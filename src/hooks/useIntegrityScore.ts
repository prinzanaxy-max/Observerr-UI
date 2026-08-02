import { useCallback, useRef, useState, type RefObject } from 'react';
import type { IntegrityEvent } from '../types/integrityMonitoring';
import type { IntegrityAuditRecord, IntegritySessionSummary } from '../types/integritySession';
import {
  applyIntegrityRules,
  applyProctoringUnavailableCap,
  createClientEventId,
  describeEvent,
  INTEGRITY_STARTING_SCORE,
  resolveDeductionsForEvent,
  type ScoreUpdate,
} from '../lib/integrity/integrityScoring';

export function useIntegrityScore(
  examId: number,
  sessionIdRef: RefObject<string>,
  initialScore = INTEGRITY_STARTING_SCORE,
) {
  const [score, setScore] = useState(initialScore);
  const [lastUpdate, setLastUpdate] = useState<ScoreUpdate | null>(null);
  const [auditLog, setAuditLog] = useState<IntegrityAuditRecord[]>([]);
  const [requiresReview, setRequiresReview] = useState(false);

  const tabBlurCountRef = useRef(0);
  const repeatedTabPenaltyAppliedRef = useRef(false);
  const sessionStartedAtRef = useRef(new Date().toISOString());
  const scoreRef = useRef(initialScore);
  const auditLogRef = useRef<IntegrityAuditRecord[]>([]);

  const getSessionId = useCallback(() => sessionIdRef.current || 'pending', [sessionIdRef]);

  const setSessionStartedAt = useCallback((startedAt: string) => {
    sessionStartedAtRef.current = startedAt;
  }, []);

  const appendRecord = useCallback((record: IntegrityAuditRecord) => {
    auditLogRef.current = [...auditLogRef.current, record];
    setAuditLog(auditLogRef.current);
    if (record.requiresReview) {
      setRequiresReview(true);
    }
  }, []);

  const handleIntegrityEvent = useCallback((event: IntegrityEvent) => {
    if (event.type === 'tab_blur') {
      tabBlurCountRef.current += 1;
    }

    const sessionId = getSessionId();
    const { code, title, description } = describeEvent(event);
    let rules = resolveDeductionsForEvent(event, tabBlurCountRef.current);
    rules = rules.map((rule) => applyProctoringUnavailableCap(rule, scoreRef.current));

    if (event.type === 'tab_blur' && tabBlurCountRef.current >= 3) {
      if (!repeatedTabPenaltyAppliedRef.current) {
        repeatedTabPenaltyAppliedRef.current = true;
      } else {
        rules = rules.filter((r) => r.code !== 'TAB_BLUR_REPEATED');
      }
    }

    if (rules.length === 0) {
      appendRecord({
        clientEventId: createClientEventId(),
        eventCode: code,
        title,
        description,
        severity: 'info',
        pointsDeducted: 0,
        scoreAfter: scoreRef.current,
        requiresReview: false,
        timestamp: event.timestamp,
        durationMs: event.durationMs,
        metadata: { examId, sessionId, rawType: event.type, ...event.metadata },
      });
      return;
    }

    const { updates, newScore } = applyIntegrityRules(scoreRef.current, rules);
    scoreRef.current = newScore;
    setScore(newScore);
    setLastUpdate(updates[updates.length - 1] ?? null);

    for (const update of updates) {
      appendRecord({
        clientEventId: createClientEventId(),
        eventCode: update.code,
        title: update.label,
        description,
        severity: update.severity,
        pointsDeducted: update.pointsDeducted,
        scoreAfter: update.newScore,
        requiresReview: update.requiresReview,
        timestamp: event.timestamp,
        durationMs: event.durationMs,
        metadata: { examId, sessionId, rawType: event.type, ...event.metadata },
      });
    }
  }, [appendRecord, examId, getSessionId]);

  const logSessionEvent = useCallback(
    (eventCode: IntegrityAuditRecord['eventCode'], title: string, description: string) => {
      const sessionId = getSessionId();
      appendRecord({
        clientEventId: createClientEventId(),
        eventCode,
        title,
        description,
        severity: 'info',
        pointsDeducted: 0,
        scoreAfter: scoreRef.current,
        requiresReview: false,
        timestamp: new Date().toISOString(),
        metadata: { examId, sessionId },
      });
    },
    [appendRecord, examId, getSessionId],
  );

  const buildSummary = useCallback(
    (proctoringAvailable: boolean): IntegritySessionSummary => ({
      sessionId: getSessionId(),
      examId,
      startedAt: sessionStartedAtRef.current,
      endedAt: new Date().toISOString(),
      startingScore: INTEGRITY_STARTING_SCORE,
      finalScore: scoreRef.current,
      totalEvents: auditLogRef.current.length,
      totalDeductions: auditLogRef.current.reduce((sum, r) => sum + r.pointsDeducted, 0),
      requiresReview:
        !proctoringAvailable ||
        requiresReview ||
        auditLogRef.current.some((r) => r.requiresReview),
      proctoringAvailable,
    }),
    [examId, getSessionId, requiresReview],
  );

  return {
    score,
    lastUpdate,
    auditLog,
    requiresReview,
    handleIntegrityEvent,
    logSessionEvent,
    buildSummary,
    setSessionStartedAt,
    getAuditLog: () => auditLogRef.current,
    getScore: () => scoreRef.current,
  };
}
