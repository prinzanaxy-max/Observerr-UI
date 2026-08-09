import type { IntegritySeverity } from './integrityMonitoring';
import type { ApiIntegrityAuditRecord } from '../lib/integrity/integrityApiMapper';

/** Stable codes stored in DB — do not rename once deployed. */
export type IntegrityEventCode =
  | 'GAZE_DEVIATION_BRIEF'
  | 'GAZE_DEVIATION_MODERATE'
  | 'GAZE_DEVIATION_SUSTAINED'
  | 'GAZE_DEVIATION'
  | 'TAB_BLUR'
  | 'TAB_SWITCH'
  | 'TAB_BLUR_REPEATED'
  | 'FOCUS_LOSS'
  | 'FULLSCREEN_EXIT'
  | 'PAGE_REFRESH'
  | 'IDLE_TIMEOUT'
  | 'FACE_PARTIAL_BRIEF'
  | 'FACE_ABSENT'
  | 'FACE_ABSENT_SHORT'
  | 'FACE_ABSENT_MEDIUM'
  | 'FACE_ABSENT_LONG'
  | 'CLIPBOARD_EVENT'
  | 'COPY_EVENT'
  | 'PASTE_EVENT'
  | 'MULTI_FACE_DETECTED'
  | 'DEVTOOLS_SHORTCUT'
  | 'CAMERA_PERMISSION_LOST'
  | 'TAB_BLUR_NO_FACE'
  | 'CAMERA_FEED_FROZEN'
  | 'FACE_SWAP_DETECTED'
  | 'SESSION_STARTED'
  | 'SESSION_ENDED'
  | 'CALIBRATION_COMPLETE'
  | 'PROCTORING_UNAVAILABLE'
  | 'GAZE_DEVIATION_START'
  | 'GAZE_DEVIATION_END'
  | 'FACE_LOST'
  | 'FACE_RESTORED'
  | 'FACE_PARTIAL_DETECTED'
  | 'FACE_PARTIAL_CLEARED'
  | 'TAB_FOCUS'
  | 'MULTI_FACE_CLEARED';

export type IntegrityAuditRecord = {
  clientEventId: string;
  eventCode: IntegrityEventCode;
  title: string;
  description: string;
  severity: IntegritySeverity | 'info';
  pointsDeducted: number;
  scoreAfter: number;
  requiresReview: boolean;
  timestamp: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
};

export type IntegritySessionSummary = {
  sessionId: string;
  examId: number;
  startedAt: string;
  endedAt: string;
  startingScore: number;
  finalScore: number;
  totalEvents: number;
  totalDeductions: number;
  requiresReview: boolean;
  proctoringAvailable: boolean;
};

export type SubmitIntegritySessionPayload = {
  summary: IntegritySessionSummary;
  events: IntegrityAuditRecord[];
};

export type BatchIntegrityEventsPayload = {
  events: ApiIntegrityAuditRecord[];
};

export type StartIntegritySessionResponse = {
  sessionId: string;
  examId: number;
  studentId: number;
  startedAt: string;
  startingScore: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
};

export type AppendIntegrityEventsResponse = {
  accepted: number;
  skipped: number;
  currentScore: number;
  requiresReview: boolean;
};

export type CompleteIntegritySessionResponse = {
  sessionId: string;
  finalScore: number;
  requiresReview: boolean;
  status: 'COMPLETED';
};
