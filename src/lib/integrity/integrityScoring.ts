import type { IntegrityEvent, IntegrityEventType } from '../../types/integrityMonitoring';
import type { IntegrityEventCode } from '../../types/integritySession';
import type { IntegrityScoreDeduction, IntegritySeverity } from '../../types/integrityMonitoring';

export const INTEGRITY_STARTING_SCORE = 100;
export const PROCTORING_UNAVAILABLE_SCORE_CAP = 60;

export type ScoredRule = IntegrityScoreDeduction & {
  code: IntegrityEventCode;
  requiresReview?: boolean;
};

/** Deduction table aligned with backend IntegrityScoringPolicy. */
export const INTEGRITY_DEDUCTION_RULES: ScoredRule[] = [
  {
    code: 'GAZE_DEVIATION_BRIEF',
    eventType: 'gaze_deviation_end',
    minDurationMs: 2_000,
    maxDurationMs: 3_999,
    points: 5,
    severity: 'low',
    label: 'Brief gaze deviation (2–4s off-screen)',
  },
  {
    code: 'GAZE_DEVIATION_MODERATE',
    eventType: 'gaze_deviation_end',
    minDurationMs: 4_000,
    maxDurationMs: 9_999,
    points: 12,
    severity: 'medium',
    label: 'Moderate gaze deviation (4–10s off-screen)',
  },
  {
    code: 'FACE_ABSENT_SHORT',
    eventType: 'face_restored',
    minDurationMs: 2_000,
    maxDurationMs: 4_999,
    points: 10,
    severity: 'medium',
    label: 'No face detected (2–5s)',
  },
  {
    code: 'GAZE_DEVIATION_SUSTAINED',
    eventType: 'gaze_deviation_end',
    minDurationMs: 10_000,
    points: 20,
    severity: 'high',
    label: 'Sustained gaze deviation (>10s)',
  },
  {
    code: 'TAB_BLUR',
    eventType: 'tab_blur',
    points: 8,
    severity: 'medium',
    label: 'Tab/window blur',
  },
  {
    code: 'TAB_BLUR_REPEATED',
    eventType: 'tab_blur',
    minCount: 3,
    points: 20,
    severity: 'high',
    label: 'Repeated tab/window blur (every 3 blurs)',
  },
  {
    code: 'FACE_PARTIAL_BRIEF',
    eventType: 'face_partial_out_of_frame',
    maxDurationMs: 5_000,
    points: 6,
    severity: 'medium',
    label: 'Face partially out of frame (brief)',
  },
  {
    code: 'FACE_ABSENT_MEDIUM',
    eventType: 'face_restored',
    minDurationMs: 5_000,
    maxDurationMs: 15_000,
    points: 18,
    severity: 'high',
    label: 'No face detected (5–15s)',
  },
  {
    code: 'FACE_ABSENT_LONG',
    eventType: 'face_restored',
    minDurationMs: 15_000,
    points: 30,
    severity: 'critical',
    label: 'No face detected (>15s)',
    requiresReview: true,
  },
  {
    code: 'CLIPBOARD_EVENT',
    eventType: 'clipboard_event',
    points: 20,
    severity: 'high',
    label: 'Copy/paste detected',
  },
  {
    code: 'MULTI_FACE_DETECTED',
    eventType: 'multi_face_detected',
    points: 40,
    severity: 'critical',
    label: 'Second face detected in frame',
    requiresReview: true,
  },
  {
    code: 'DEVTOOLS_SHORTCUT',
    eventType: 'devtools_shortcut_attempt',
    points: 35,
    severity: 'high',
    label: 'DevTools shortcut attempt',
  },
  {
    code: 'CAMERA_PERMISSION_LOST',
    eventType: 'camera_permission_lost',
    points: 40,
    severity: 'critical',
    label: 'Webcam permission revoked mid-exam',
    requiresReview: true,
  },
  {
    code: 'TAB_BLUR_NO_FACE',
    eventType: 'tab_blur_no_face',
    points: 50,
    severity: 'critical',
    label: 'Tab blur with no face visible',
    requiresReview: true,
  },
  {
    code: 'CAMERA_FEED_FROZEN',
    eventType: 'camera_feed_frozen',
    points: 55,
    severity: 'critical',
    label: 'Camera feed frozen or spoofed',
    requiresReview: true,
  },
  {
    code: 'PROCTORING_UNAVAILABLE',
    eventType: 'proctoring_unavailable',
    points: 25,
    severity: 'high',
    label: 'Proctoring unavailable — lecturer review required',
    requiresReview: true,
  },
];

const INFO_EVENT_MAP: Partial<Record<IntegrityEventType, { code: IntegrityEventCode; title: string }>> = {
  gaze_deviation_start: { code: 'GAZE_DEVIATION_START', title: 'Gaze deviation started' },
  gaze_deviation_end: { code: 'GAZE_DEVIATION_END', title: 'Gaze deviation ended' },
  face_lost: { code: 'FACE_LOST', title: 'Face lost' },
  face_restored: { code: 'FACE_RESTORED', title: 'Face restored' },
  tab_focus: { code: 'TAB_FOCUS', title: 'Tab/window focused' },
  multi_face_cleared: { code: 'MULTI_FACE_CLEARED', title: 'Multiple faces cleared' },
  tab_blur_no_face: { code: 'TAB_BLUR_NO_FACE', title: 'Tab blur with no face visible' },
  camera_feed_frozen: { code: 'CAMERA_FEED_FROZEN', title: 'Camera feed frozen or spoofed' },
  proctoring_unavailable: { code: 'PROCTORING_UNAVAILABLE', title: 'Proctoring unavailable' },
  calibration_complete: { code: 'CALIBRATION_COMPLETE', title: 'Gaze calibration complete' },
  session_started: { code: 'SESSION_STARTED', title: 'Exam session started' },
  session_ended: { code: 'SESSION_ENDED', title: 'Exam session ended' },
};

export type ScoreUpdate = {
  code: IntegrityEventCode;
  pointsDeducted: number;
  severity: IntegritySeverity;
  label: string;
  newScore: number;
  requiresReview: boolean;
};

function matchesDuration(rule: ScoredRule, durationMs: number): boolean {
  if (rule.minDurationMs !== undefined && durationMs < rule.minDurationMs) return false;
  if (rule.maxDurationMs !== undefined && durationMs > rule.maxDurationMs) return false;
  return true;
}

export function resolveDeduction(
  event: IntegrityEvent,
): ScoredRule | null {
  const duration = event.durationMs ?? 0;
  const candidates = INTEGRITY_DEDUCTION_RULES.filter((rule) => {
    if (rule.eventType !== event.type) return false;
    if (rule.minCount !== undefined) return false;

    if (event.type === 'face_partial_out_of_frame') {
      return event.metadata?.ended === true && matchesDuration(rule, duration);
    }

    if (rule.minDurationMs !== undefined || rule.maxDurationMs !== undefined) {
      return matchesDuration(rule, duration);
    }

    return true;
  });

  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.points - a.points)[0];
}

export function resolveDeductionsForEvent(
  event: IntegrityEvent,
  tabBlurCount = 0,
): ScoredRule[] {
  const rules: ScoredRule[] = [];

  if (event.type === 'tab_blur') {
    const single = INTEGRITY_DEDUCTION_RULES.find((r) => r.code === 'TAB_BLUR');
    if (single) rules.push(single);
    // Extra streak penalty on every 3rd blur (3, 6, 9, …).
    if (tabBlurCount >= 3 && tabBlurCount % 3 === 0) {
      const repeated = INTEGRITY_DEDUCTION_RULES.find((r) => r.code === 'TAB_BLUR_REPEATED');
      if (repeated) rules.push(repeated);
    }
    return rules;
  }

  const primary = resolveDeduction(event);
  if (primary) rules.push(primary);
  return rules;
}

export function applyIntegrityEvent(
  currentScore: number,
  event: IntegrityEvent,
  tabBlurCount = 0,
): ScoreUpdate | null {
  const rules = resolveDeductionsForEvent(event, tabBlurCount);
  if (rules.length === 0) return null;

  const totalPoints = rules.reduce((sum, r) => sum + r.points, 0);
  const primary = rules.sort((a, b) => b.points - a.points)[0];
  const newScore = Math.max(0, currentScore - totalPoints);

  return {
    code: primary.code,
    pointsDeducted: totalPoints,
    severity: primary.severity,
    label: rules.length > 1 ? `${primary.label} (+${rules.length - 1} more)` : primary.label,
    newScore,
    requiresReview: rules.some((r) => r.requiresReview || r.severity === 'critical'),
  };
}

export function applyIntegrityRules(
  currentScore: number,
  rules: ScoredRule[],
): { updates: ScoreUpdate[]; newScore: number } {
  const updates: ScoreUpdate[] = [];
  let next = currentScore;

  for (const rule of rules) {
    next = Math.max(0, next - rule.points);
    updates.push({
      code: rule.code,
      pointsDeducted: rule.points,
      severity: rule.severity,
      label: rule.label,
      newScore: next,
      requiresReview: rule.requiresReview ?? rule.severity === 'critical',
    });
  }

  return { updates, newScore: next };
}

export function applyProctoringUnavailableCap(rule: ScoredRule, currentScore: number): ScoredRule {
  if (rule.code !== 'PROCTORING_UNAVAILABLE') return rule;
  return {
    ...rule,
    points: Math.max(0, currentScore - PROCTORING_UNAVAILABLE_SCORE_CAP),
    requiresReview: true,
  };
}

export function describeEvent(event: IntegrityEvent): { code: IntegrityEventCode; title: string; description: string } {
  if (event.type === 'face_partial_out_of_frame') {
    return {
      code: event.metadata?.ended === true
        ? 'FACE_PARTIAL_CLEARED'
        : 'FACE_PARTIAL_DETECTED',
      title: event.metadata?.ended === true
        ? 'Partial face visibility cleared'
        : 'Partial face visibility detected',
      description: buildDescription(event),
    };
  }

  const info = INFO_EVENT_MAP[event.type];
  if (info) {
    return {
      code: info.code,
      title: info.title,
      description: buildDescription(event),
    };
  }

  const rule = INTEGRITY_DEDUCTION_RULES.find((r) => r.eventType === event.type);
  if (rule) {
    return {
      code: rule.code,
      title: rule.label,
      description: buildDescription(event),
    };
  }

  return {
    code: 'SESSION_STARTED',
    title: event.type,
    description: buildDescription(event),
  };
}

function buildDescription(event: IntegrityEvent): string {
  const parts: string[] = [];
  if (event.durationMs !== undefined) {
    parts.push(`Duration: ${Math.round(event.durationMs / 1000)}s`);
  }
  if (event.metadata) {
    Object.entries(event.metadata).forEach(([k, v]) => {
      parts.push(`${k}: ${String(v)}`);
    });
  }
  return parts.length > 0 ? parts.join(' · ') : 'Integrity signal detected during exam session.';
}

export function createClientEventId(): string {
  return crypto.randomUUID();
}
