import { useCallback, useRef, useState } from 'react';
import type { IntegrityEvent } from '../types/integrityMonitoring';
import type { IntegrityAuditRecord, IntegritySessionSummary } from '../types/integritySession';
import {
  applyIntegrityRules,
  createClientEventId,
  describeEvent,
  INTEGRITY_STARTING_SCORE,
  resolveDeductionsForEvent,
  type ScoreUpdate,
} from '../lib/integrity/integrityScoring';

export function useIntegrityScore(examId: number, sessionId: string, initialScore = INTEGRITY_STARTING_SCORE) {
  const [score, setScore] = useState(initialScore);
  const [lastUpdate, setLastUpdate] = useState<ScoreUpdate | null>(null);
  const [auditLog, setAuditLog] = useState<IntegrityAuditRecord[]>([]);
  const [requiresReview, setRequiresReview] = useState(false);

  const tabBlurCountRef = useRef(0);
  const repeatedTabPenaltyAppliedRef = useRef(false);
  const sessionStartedAtRef = useRef(new Date().toISOString());
  const scoreRef = useRef(initialScore);
  const auditLogRef = useRef<IntegrityAuditRecord[]>([]);

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

    const { code, title, description } = describeEvent(event);
    let rules = resolveDeductionsForEvent(event, tabBlurCountRef.current);

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
  }, [appendRecord, examId, sessionId]);

  const logSessionEvent = useCallback(
    (eventCode: IntegrityAuditRecord['eventCode'], title: string, description: string) => {
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
    [appendRecord, examId, sessionId],
  );

  const buildSummary = useCallback(
    (proctoringAvailable: boolean): IntegritySessionSummary => ({
      sessionId,
      examId,
      startedAt: sessionStartedAtRef.current,
      endedAt: new Date().toISOString(),
      startingScore: INTEGRITY_STARTING_SCORE,
      finalScore: scoreRef.current,
      totalEvents: auditLogRef.current.length,
      totalDeductions: auditLogRef.current.reduce((sum, r) => sum + r.pointsDeducted, 0),
      requiresReview: requiresReview || auditLogRef.current.some((r) => r.requiresReview),
      proctoringAvailable,
    }),
    [auditLogRef, examId, requiresReview, sessionId],
  );

  return {
    score,
    lastUpdate,
    auditLog,
    requiresReview,
    handleIntegrityEvent,
    logSessionEvent,
    buildSummary,
    getAuditLog: () => auditLogRef.current,
    getScore: () => scoreRef.current,
  };
}
