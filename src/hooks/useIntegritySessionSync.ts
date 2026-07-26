import { useCallback, useEffect, useRef } from 'react';
import type { IntegrityAuditRecord, IntegritySessionSummary } from '../types/integritySession';
import * as integritySessionService from '../services/integritySessionService';

const FLUSH_INTERVAL_MS = 30_000;

export function useIntegritySessionSync(
  examId: number,
  sessionId: string,
  getPendingEvents: () => IntegrityAuditRecord[],
  onFlush: (flushedCount: number) => void,
) {
  const lastFlushedIndexRef = useRef(0);
  const backendSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const res = await integritySessionService.startIntegritySession(examId);
        if (!cancelled) {
          backendSessionIdRef.current = res.sessionId;
        }
      } catch {
        // Backend may not be ready — client sessionId still used locally
        backendSessionIdRef.current = sessionId;
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, [examId, sessionId]);

  const flush = useCallback(async () => {
    const all = getPendingEvents();
    const pending = all.slice(lastFlushedIndexRef.current);
    if (pending.length === 0) return;

    const targetSessionId = backendSessionIdRef.current ?? sessionId;
    try {
      await integritySessionService.appendIntegrityEvents(targetSessionId, { events: pending });
      lastFlushedIndexRef.current = all.length;
      onFlush(pending.length);
    } catch {
      // Retry on next interval
    }
  }, [getPendingEvents, onFlush, sessionId]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void flush();
    }, FLUSH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [flush]);

  const submitSession = useCallback(
    async (summary: IntegritySessionSummary, events: IntegrityAuditRecord[]) => {
      await flush();
      const targetSessionId = backendSessionIdRef.current ?? sessionId;
      try {
        await integritySessionService.submitIntegritySession(targetSessionId, { summary, events });
      } catch {
        // Exam submit proceeds even if sync fails — events retained in client log for retry
        console.warn('[IntegritySession] Failed to submit session to backend');
      }
    },
    [flush, sessionId],
  );

  return { flush, submitSession };
}
