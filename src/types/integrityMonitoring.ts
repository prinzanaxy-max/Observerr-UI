export type HeadPose = {
  yaw: number;
  pitch: number;
  roll: number;
};

export type CalibrationBaseline = HeadPose;

export type IntegrityEventType =
  | 'face_lost'
  | 'face_restored'
  | 'gaze_deviation_start'
  | 'gaze_deviation_end'
  | 'multi_face_detected'
  | 'multi_face_cleared'
  | 'face_partial_out_of_frame'
  | 'tab_blur'
  | 'tab_focus'
  | 'devtools_shortcut_attempt'
  | 'clipboard_event'
  | 'camera_permission_lost'
  | 'proctoring_unavailable'
  | 'tab_blur_no_face'
  | 'camera_feed_frozen'
  | 'session_started'
  | 'session_ended'
  | 'calibration_complete';

export type IntegrityEvent = {
  type: IntegrityEventType;
  timestamp: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
};

export type IntegrityMonitorStatus =
  | 'idle'
  | 'loading'
  | 'calibrating'
  | 'monitoring'
  | 'unavailable'
  | 'permission_denied';

export type FaceDetectionSignals = {
  faceDetected: boolean;
  faceCount: number;
  headPose: HeadPose | null;
  gazeDeviation: boolean;
  faceBoxCoverage: number;
  partialOutOfFrame: boolean;
};

export type IntegritySeverity = 'low' | 'medium' | 'high' | 'critical';

export type IntegrityScoreDeduction = {
  eventType: IntegrityEventType;
  minDurationMs?: number;
  maxDurationMs?: number;
  minCount?: number;
  points: number;
  severity: IntegritySeverity;
  label: string;
};
