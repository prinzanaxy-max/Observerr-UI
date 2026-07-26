import type {
  IntegrityEvent,
  IntegrityScoreDeduction,
  IntegritySeverity,
} from '../../types/integrityMonitoring';

export const INTEGRITY_STARTING_SCORE = 100;

/** Severity-tier lookup — parent owns running score via useIntegrityScore. */
export const INTEGRITY_DEDUCTION_RULES: IntegrityScoreDeduction[] = [
  { eventType: 'gaze_deviation_end', minDurationMs: 2_000, maxDurationMs: 4_000, points: 1, severity: 'low', label: 'Brief gaze deviation' },
  { eventType: 'gaze_deviation_end', minDurationMs: 4_000, maxDurationMs: 10_000, points: 3, severity: 'low', label: 'Gaze deviation (4–10s)' },
  { eventType: 'gaze_deviation_end', minDurationMs: 10_000, points: 5, severity: 'medium', label: 'Sustained gaze deviation (>10s)' },
  { eventType: 'tab_blur', points: 2, severity: 'low', label: 'Tab/window blur' },
  { eventType: 'tab_focus', minCount: 3, points: 8, severity: 'medium', label: 'Repeated tab blur (3+ times)' },
  { eventType: 'face_partial_out_of_frame', maxDurationMs: 5_000, points: 2, severity: 'low', label: 'Face partially out of frame' },
  { eventType: 'face_restored', minDurationMs: 5_000, maxDurationMs: 15_000, points: 6, severity: 'medium', label: 'No face detected (5–15s)' },
  { eventType: 'face_restored', minDurationMs: 15_000, points: 15, severity: 'high', label: 'No face detected (>15s)' },
  { eventType: 'clipboard_event', points: 8, severity: 'medium', label: 'Copy/paste detected' },
  { eventType: 'multi_face_detected', points: 20, severity: 'high', label: 'Second face detected' },
  { eventType: 'devtools_shortcut_attempt', points: 20, severity: 'high', label: 'DevTools shortcut attempt' },
  { eventType: 'camera_permission_lost', points: 25, severity: 'high', label: 'Camera permission revoked' },
];

export type ScoreUpdate = {
  pointsDeducted: number;
  severity: IntegritySeverity;
  label: string;
  newScore: number;
};

function matchesDuration(rule: IntegrityScoreDeduction, durationMs: number): boolean {
  if (rule.minDurationMs !== undefined && durationMs < rule.minDurationMs) return false;
  if (rule.maxDurationMs !== undefined && durationMs > rule.maxDurationMs) return false;
  return true;
}

export function resolveDeduction(
  event: IntegrityEvent,
  tabBlurCount = 0,
): IntegrityScoreDeduction | null {
  if (event.type === 'tab_focus' && tabBlurCount >= 3) {
    return INTEGRITY_DEDUCTION_RULES.find(
      (r) => r.eventType === 'tab_focus' && r.minCount === 3,
    ) ?? null;
  }

  const duration = event.durationMs ?? 0;
  const candidates = INTEGRITY_DEDUCTION_RULES.filter((rule) => {
    if (rule.eventType !== event.type) return false;
    if (rule.minCount !== undefined) return false;

    if (rule.minDurationMs !== undefined || rule.maxDurationMs !== undefined) {
      return matchesDuration(rule, duration);
    }

    if (event.type === 'face_partial_out_of_frame') {
      return event.metadata?.ended === true && matchesDuration(rule, duration);
    }

    return true;
  });

  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.points - a.points)[0];
}

export function applyIntegrityEvent(
  currentScore: number,
  event: IntegrityEvent,
  tabBlurCount = 0,
): ScoreUpdate | null {
  const rule = resolveDeduction(event, tabBlurCount);
  if (!rule) return null;

  const newScore = Math.max(0, currentScore - rule.points);
  return {
    pointsDeducted: rule.points,
    severity: rule.severity,
    label: rule.label,
    newScore,
  };
}
