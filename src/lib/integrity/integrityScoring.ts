import type { IntegrityEvent, IntegrityEventType } from '../../types/integrityMonitoring';
import type { IntegrityEventCode } from '../../types/integritySession';
import type { IntegrityScoreDeduction, IntegritySeverity } from '../../types/integrityMonitoring';

export const INTEGRITY_STARTING_SCORE = 100;
export const PROCTORING_UNAVAILABLE_SCORE_CAP = 60;

/** Per-type max cumulative deductions (mirrors backend IntegrityScoringPolicy). */
export const DEDUCTION_CAPS: Record<string, number> = {
  COPY: 35,
  PASTE: 32,
  MULTI_FACE: 45,
  FACE_ABSENT: 32,
  DEVTOOLS: 30,
  TAB_SWITCH: 25,
  FOCUS_LOSS: 20,
  FULLSCREEN_EXIT: 15,
  PAGE_REFRESH: 18,
  IDLE: 15,
  GAZE: 25,
  TAB_BLUR_NO_FACE: 45,
  CAMERA_PERMISSION: 40,
  CAMERA_FROZEN: 55,
};

export type ScoredRule = IntegrityScoreDeduction & {
  code: IntegrityEventCode;
  requiresReview?: boolean;
  capKey: string;
};

/** Deduction table: 5 copies × 7 = 35 → score 65% (below 70%). */
export const INTEGRITY_DEDUCTION_RULES: ScoredRule[] = [
  {
    code: 'COPY_EVENT',
    eventType: 'clipboard_event',
    points: 7,
    severity: 'medium',
    label: 'Copy detected',
    capKey: 'COPY',
  },
  {
    code: 'PASTE_EVENT',
    eventType: 'clipboard_event',
    points: 8,
    severity: 'high',
    label: 'Paste detected',
    capKey: 'PASTE',
  },
  {
    code: 'MULTI_FACE_DETECTED',
    eventType: 'multi_face_detected',
    points: 15,
    severity: 'high',
    label: 'Second face detected in frame',
    requiresReview: true,
    capKey: 'MULTI_FACE',
  },
  {
    code: 'FACE_ABSENT_SHORT',
    eventType: 'face_restored',
    minDurationMs: 2_000,
    maxDurationMs: 4_999,
    points: 6,
    severity: 'medium',
    label: 'No face detected (2–5s)',
    capKey: 'FACE_ABSENT',
  },
  {
    code: 'FACE_ABSENT_MEDIUM',
    eventType: 'face_restored',
    minDurationMs: 5_000,
    maxDurationMs: 15_000,
    points: 12,
    severity: 'high',
    label: 'No face detected (5–15s)',
    capKey: 'FACE_ABSENT',
  },
  {
    code: 'FACE_ABSENT_LONG',
    eventType: 'face_restored',
    minDurationMs: 15_000,
    points: 20,
    severity: 'critical',
    label: 'No face detected (>15s)',
    requiresReview: true,
    capKey: 'FACE_ABSENT',
  },
  {
    code: 'DEVTOOLS_SHORTCUT',
    eventType: 'devtools_shortcut_attempt',
    points: 10,
    severity: 'high',
    label: 'DevTools / app-switch shortcut',
    capKey: 'DEVTOOLS',
  },
  {
    code: 'TAB_SWITCH',
    eventType: 'tab_switch',
    points: 5,
    severity: 'medium',
    label: 'Tab switch',
    capKey: 'TAB_SWITCH',
  },
  {
    code: 'TAB_BLUR',
    eventType: 'tab_blur',
    points: 5,
    severity: 'medium',
    label: 'Tab switch',
    capKey: 'TAB_SWITCH',
  },
  {
    code: 'FOCUS_LOSS',
    eventType: 'focus_loss',
    points: 4,
    severity: 'low',
    label: 'Window focus lost',
    capKey: 'FOCUS_LOSS',
  },
  {
    code: 'FULLSCREEN_EXIT',
    eventType: 'fullscreen_exit',
    points: 5,
    severity: 'medium',
    label: 'Exited fullscreen',
    capKey: 'FULLSCREEN_EXIT',
  },
  {
    code: 'PAGE_REFRESH',
    eventType: 'page_refresh',
    points: 6,
    severity: 'medium',
    label: 'Page refresh',
    capKey: 'PAGE_REFRESH',
  },
  {
    code: 'IDLE_TIMEOUT',
    eventType: 'idle_timeout',
    points: 3,
    severity: 'low',
    label: 'Idle for 60s+',
    capKey: 'IDLE',
  },
  {
    code: 'GAZE_DEVIATION_BRIEF',
    eventType: 'gaze_deviation_end',
    minDurationMs: 2_000,
    maxDurationMs: 3_999,
    points: 3,
    severity: 'low',
    label: 'Gaze deviation',
    capKey: 'GAZE',
  },
  {
    code: 'GAZE_DEVIATION_MODERATE',
    eventType: 'gaze_deviation_end',
    minDurationMs: 4_000,
    maxDurationMs: 9_999,
    points: 6,
    severity: 'medium',
    label: 'Gaze deviation',
    capKey: 'GAZE',
  },
  {
    code: 'GAZE_DEVIATION_SUSTAINED',
    eventType: 'gaze_deviation_end',
    minDurationMs: 10_000,
    points: 10,
    severity: 'high',
    label: 'Gaze deviation',
    capKey: 'GAZE',
  },
  {
    code: 'FACE_PARTIAL_BRIEF',
    eventType: 'face_partial_out_of_frame',
    maxDurationMs: 5_000,
    points: 3,
    severity: 'low',
    label: 'Face partially out of frame',
    capKey: 'FACE_ABSENT',
  },
  {
    code: 'TAB_BLUR_NO_FACE',
    eventType: 'tab_blur_no_face',
    points: 15,
    severity: 'critical',
    label: 'Tab blur with no face visible',
    requiresReview: true,
    capKey: 'TAB_BLUR_NO_FACE',
  },
  {
    code: 'CAMERA_PERMISSION_LOST',
    eventType: 'camera_permission_lost',
    points: 40,
    severity: 'critical',
    label: 'Webcam permission revoked mid-exam',
    requiresReview: true,
    capKey: 'CAMERA_PERMISSION',
  },
  {
    code: 'CAMERA_FEED_FROZEN',
    eventType: 'camera_feed_frozen',
    points: 25,
    severity: 'critical',
    label: 'Camera feed frozen or spoofed',
    requiresReview: true,
    capKey: 'CAMERA_FROZEN',
  },
  {
    code: 'PROCTORING_UNAVAILABLE',
    eventType: 'proctoring_unavailable',
    points: 25,
    severity: 'high',
    label: 'Proctoring unavailable — lecturer review required',
    requiresReview: true,
    capKey: 'PROCTORING_UNAVAILABLE',
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
  fullscreen_exit: { code: 'FULLSCREEN_EXIT', title: 'Exited fullscreen' },
  page_refresh: { code: 'PAGE_REFRESH', title: 'Page refresh' },
  idle_timeout: { code: 'IDLE_TIMEOUT', title: 'Idle for 60s+' },
  focus_loss: { code: 'FOCUS_LOSS', title: 'Window focus lost' },
  tab_switch: { code: 'TAB_SWITCH', title: 'Tab switch' },
};

export type ScoreUpdate = {
  code: IntegrityEventCode;
  pointsDeducted: number;
  severity: IntegritySeverity;
  label: string;
  newScore: number;
  requiresReview: boolean;
  capKey: string;
};

function matchesDuration(rule: ScoredRule, durationMs: number): boolean {
  if (rule.minDurationMs !== undefined && durationMs < rule.minDurationMs) return false;
  if (rule.maxDurationMs !== undefined && durationMs > rule.maxDurationMs) return false;
  return true;
}

export function applyCap(
  capKey: string,
  requestedPoints: number,
  alreadyDeducted: number,
): { points: number; hitCap: boolean } {
  const max = DEDUCTION_CAPS[capKey] ?? Number.POSITIVE_INFINITY;
  const remaining = Math.max(0, max - alreadyDeducted);
  const points = Math.min(Math.max(0, requestedPoints), remaining);
  return { points, hitCap: alreadyDeducted + points >= max && Number.isFinite(max) };
}

export function resolveDeduction(event: IntegrityEvent): ScoredRule | null {
  const duration = event.durationMs ?? 0;

  if (event.type === 'clipboard_event') {
    const action = String(event.metadata?.action ?? 'copy').toLowerCase();
    const code = action === 'paste' ? 'PASTE_EVENT' : 'COPY_EVENT';
    return INTEGRITY_DEDUCTION_RULES.find((r) => r.code === code) ?? null;
  }

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

export function resolveDeductionsForEvent(event: IntegrityEvent): ScoredRule[] {
  const primary = resolveDeduction(event);
  return primary ? [primary] : [];
}

export function applyIntegrityRules(
  currentScore: number,
  rules: ScoredRule[],
  deductedByCap: Record<string, number> = {},
): { updates: ScoreUpdate[]; newScore: number; deductedByCap: Record<string, number> } {
  const updates: ScoreUpdate[] = [];
  let next = currentScore;
  const caps = { ...deductedByCap };

  for (const rule of rules) {
    const { points, hitCap } = applyCap(rule.capKey, rule.points, caps[rule.capKey] ?? 0);
    caps[rule.capKey] = (caps[rule.capKey] ?? 0) + points;
    next = Math.max(0, next - points);
    const flagOnCap = hitCap && (rule.capKey === 'COPY' || rule.capKey === 'MULTI_FACE');
    updates.push({
      code: rule.code,
      pointsDeducted: points,
      severity: flagOnCap ? 'high' : rule.severity,
      label: rule.label,
      newScore: next,
      requiresReview: Boolean(rule.requiresReview || flagOnCap),
      capKey: rule.capKey,
    });
  }

  return { updates, newScore: next, deductedByCap: caps };
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
  if (event.type === 'clipboard_event') {
    const action = String(event.metadata?.action ?? 'copy').toLowerCase();
    return {
      code: action === 'paste' ? 'PASTE_EVENT' : 'COPY_EVENT',
      title: action === 'paste' ? 'Paste detected' : 'Copy detected',
      description: buildDescription(event),
    };
  }

  if (event.type === 'face_partial_out_of_frame') {
    return {
      code: event.metadata?.ended === true ? 'FACE_PARTIAL_CLEARED' : 'FACE_PARTIAL_DETECTED',
      title: event.metadata?.ended === true
        ? 'Partial face visibility cleared'
        : 'Partial face visibility detected',
      description: buildDescription(event),
    };
  }

  const info = INFO_EVENT_MAP[event.type];
  if (info) {
    return { code: info.code, title: info.title, description: buildDescription(event) };
  }

  const rule = resolveDeduction(event);
  if (rule) {
    return { code: rule.code, title: rule.label, description: buildDescription(event) };
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
