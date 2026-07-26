import { useCallback, useEffect, useRef, useState } from 'react';
import type { IntegrityAuditRecord, IntegritySessionSummary, StartIntegritySessionResponse } from '../types/integritySession';
import * as integritySessionService from '../services/integritySessionService';

const FLUSH_INTERVAL_MS = 30_000;

export type UseIntegritySessionSyncOptions = {
  examId: number;
  enabled?: boolean;
  getAuditLog: () => IntegrityAuditRecord[];
  onSessionReady?: (session: StartIntegritySessionResponse) => void;
};

export function useIntegritySessionSync({
  examId,
  enabled = true,
  getAuditLog,
  onSessionReady,
}: UseIntegritySessionSyncOptions) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const lastFlushedIndexRef = useRef(0);
  const sessionCompletedRef = useRef(false);
  const startedAtRef = useRef<string | null>(null);
  const onSessionReadyRef = useRef(onSessionReady);
  onSessionReadyRef.current = onSessionReady;

  useEffect(() => {
    if (!enabled || examId <= 0) return undefined;

    let cancelled = false;

    const init = async () => {
      setSessionError(null);
      try {
        const res = await integritySessionService.startIntegritySession(examId);
        if (cancelled) return;

        setSessionId(res.sessionId);
        startedAtRef.current = res.startedAt;
        setSessionReady(true);

        console.info('[IntegritySession] sessionId:', res.sessionId);

        onSessionReadyRef.current?.(res);
      } catch (err) {
        if (cancelled) return;
        setSessionError('Could not start proctoring session on server.');
        console.warn('[IntegritySession] Failed to start session', err);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [enabled, examId]);

  const flush = useCallback(async () => {
    if (!sessionReady || !sessionId || sessionCompletedRef.current) return;

    const all = getAuditLog();
    const pending = all.slice(lastFlushedIndexRef.current);
    if (pending.length === 0) return;

    try {
      const result = await integritySessionService.appendIntegrityEvents(sessionId, pending);
      lastFlushedIndexRef.current = all.length;
      console.info(
        `[IntegritySession] flushed ${result.accepted} event(s), skipped ${result.skipped}`,
      );
    } catch (err) {
      if (integritySessionService.isSessionConflictError(err)) {
        sessionCompletedRef.current = true;
        console.warn('[IntegritySession] Session already completed — stopping flush.');
        return;
      }
      console.warn('[IntegritySession] Flush failed, will retry.', err);
    }
  }, [getAuditLog, sessionId, sessionReady]);

  useEffect(() => {
    if (!sessionReady) return undefined;

    const id = window.setInterval(() => {
      void flush();
    }, FLUSH_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [flush, sessionReady]);

  const submitSession = useCallback(
    async (summary: IntegritySessionSummary, events: IntegrityAuditRecord[]) => {
      if (!sessionId) {
        console.warn('[IntegritySession] No backend sessionId — skipping submit.');
        return null;
      }

      if (!sessionCompletedRef.current) {
        await flush();
      }

      const apiSummary: IntegritySessionSummary = {
        ...summary,
        sessionId,
        startedAt: startedAtRef.current ?? summary.startedAt,
      };

      try {
        const pending = events.slice(lastFlushedIndexRef.current);
        const result = await integritySessionService.submitIntegritySession(sessionId, {
          summary: apiSummary,
          events: pending,
        });
        sessionCompletedRef.current = true;
        lastFlushedIndexRef.current = events.length;
        console.info('[IntegritySession] complete:', result);
        return result;
      } catch (err) {
        console.warn('[IntegritySession] Failed to submit session to backend', err);
        return null;
      }
    },
    [flush, sessionId],
  );

  return {
    sessionId,
    sessionReady,
    sessionError,
    flush,
    submitSession,
  };
}
