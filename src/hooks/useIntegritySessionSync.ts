import { useCallback, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import type {
  CompleteIntegritySessionResponse,
  IntegrityAuditRecord,
  IntegritySessionSummary,
  StartIntegritySessionResponse,
  SubmitIntegritySessionPayload,
} from '../types/integritySession';
import * as integritySessionService from '../services/integritySessionService';

const FLUSH_INTERVAL_MS = 12_000;

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
  const flushInFlightRef = useRef<Promise<void> | null>(null);
  const sessionCompletedRef = useRef(false);
  const startedAtRef = useRef<string | null>(null);
  const onSessionReadyRef = useRef(onSessionReady);
  useEffect(() => {
    onSessionReadyRef.current = onSessionReady;
  }, [onSessionReady]);

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
        const detail =
          err instanceof AxiosError
            ? (err.response?.data as { message?: string } | undefined)?.message
            : undefined;
        setSessionError(detail ?? 'Could not start proctoring session on server.');
        console.warn('[IntegritySession] Failed to start session', err);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [enabled, examId]);

  const flush = useCallback((): Promise<void> => {
    if (flushInFlightRef.current) return flushInFlightRef.current;
    if (!sessionReady || !sessionId || sessionCompletedRef.current) {
      return Promise.resolve();
    }

    const run = async () => {
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
        if (err instanceof AxiosError && err.response?.status === 403) {
          const detail = err.response.data as { message?: string } | undefined;
          setSessionError(detail?.message ?? 'This exam attempt has been blocked by the lecturer.');
          sessionCompletedRef.current = true;
          return;
        }
        if (integritySessionService.isSessionConflictError(err)) {
          sessionCompletedRef.current = true;
          console.warn('[IntegritySession] Session already completed — stopping flush.');
          return;
        }
        console.warn('[IntegritySession] Flush failed, will retry.', err);
      }
    };

    const inFlight = run().finally(() => {
      if (flushInFlightRef.current === inFlight) {
        flushInFlightRef.current = null;
      }
    });
    flushInFlightRef.current = inFlight;
    return inFlight;
  }, [getAuditLog, sessionId, sessionReady]);

  useEffect(() => {
    if (!sessionReady) return undefined;

    const id = window.setInterval(() => {
      void flush();
    }, FLUSH_INTERVAL_MS);
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') void flush();
    };
    const flushOnPageHide = () => void flush();
    document.addEventListener('visibilitychange', flushWhenHidden);
    window.addEventListener('pagehide', flushOnPageHide);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', flushWhenHidden);
      window.removeEventListener('pagehide', flushOnPageHide);
    };
  }, [flush, sessionReady]);

  const submitSession = useCallback(
    async (
      summary: IntegritySessionSummary,
      events: IntegrityAuditRecord[],
      submit?: (
        sessionId: string,
        payload: SubmitIntegritySessionPayload,
      ) => Promise<CompleteIntegritySessionResponse | unknown>,
    ) => {
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
        const payload = {
          summary: apiSummary,
          events: pending,
        };
        const result = submit
          ? await submit(sessionId, payload)
          : await integritySessionService.submitIntegritySession(sessionId, payload);
        sessionCompletedRef.current = true;
        lastFlushedIndexRef.current = events.length;
        console.info('[IntegritySession] complete:', result);
        return result;
      } catch (err) {
        console.warn('[IntegritySession] Failed to submit session to backend', err);
        if (err instanceof AxiosError) {
          const detail = err.response?.data as { message?: string } | undefined;
          throw new Error(detail?.message ?? 'Exam submission failed. Please retry.', { cause: err });
        }
        throw err instanceof Error ? err : new Error('Exam submission failed. Please retry.');
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
