import type {
  CourseFilterOption,
  RiskLevel,
  SessionEventSeverity,
  SessionTimelineEvent,
} from '../types/lecturerStudents';
import type { TimelineEvent } from '../data/studentTimelineData';

export const parseAvailableCourses = (courses: string[]): CourseFilterOption[] => {
  const options: CourseFilterOption[] = [{ value: 'ALL', label: 'All Courses' }];

  for (const entry of courses) {
    const colonIndex = entry.indexOf(':');
    if (colonIndex === -1) {
      options.push({ value: entry, label: entry });
      continue;
    }
    const code = entry.slice(0, colonIndex);
    const name = entry.slice(colonIndex + 1);
    options.push({ value: code, label: `${code}: ${name}` });
  }

  return options;
};

export const riskBadgeClass: Record<RiskLevel, string> = {
  LOW: 'bg-student-tertiary-container text-student-on-tertiary-container',
  MEDIUM: 'bg-amber-100 text-amber-800',
  HIGH: 'bg-student-error-container text-student-on-error-container',
};

export const formatRiskLabel = (risk: RiskLevel): string =>
  risk.charAt(0) + risk.slice(1).toLowerCase();

export const integrityScoreClass = (score: number) =>
  score >= 90 ? 'text-student-primary' : score >= 70 ? 'text-amber-600' : 'text-student-error';

export type TimelineEventView = {
  id: string;
  time: string;
  title: string;
  eventType?: string;
  severity: SessionEventSeverity;
  message: string;
  points?: number;
  hasSnapshot: boolean;
};

export const mapSessionEventToView = (event: SessionTimelineEvent): TimelineEventView => ({
  id: String(event.id),
  time: event.time,
  title: event.title,
  eventType: event.eventType,
  severity: event.severity,
  message: event.description,
  points: event.pointsDeducted ?? undefined,
  hasSnapshot: event.hasSnapshot,
});

const legacyTypeToSeverity: Record<TimelineEvent['type'], SessionEventSeverity> = {
  start: 'SUCCESS',
  minor: 'WARNING',
  critical: 'DANGER',
  end: 'NEUTRAL',
};

export const mapLegacyTimelineEventToView = (event: TimelineEvent): TimelineEventView => ({
  id: event.id,
  time: event.time,
  title: event.title,
  eventType: event.type,
  severity: legacyTypeToSeverity[event.type],
  message: event.message,
  points: event.points,
  hasSnapshot: Boolean(event.evidenceLabel),
});

export const severityDotClass: Record<SessionEventSeverity, string> = {
  SUCCESS: 'bg-student-primary',
  WARNING: 'bg-student-secondary-fixed',
  DANGER: 'bg-student-error',
  NEUTRAL: 'bg-student-surface-variant',
};

export const severityCardClass: Record<SessionEventSeverity, string> = {
  SUCCESS: 'bg-student-surface-container-low border-student-surface-container-high',
  WARNING: 'bg-student-secondary-container/20 border-student-secondary-container/50',
  DANGER: 'bg-student-error-container/30 border-student-error/50',
  NEUTRAL: 'bg-student-surface-container-low border-student-surface-container-high',
};

export const severityTitleClass: Record<SessionEventSeverity, string> = {
  SUCCESS: 'text-student-on-surface-variant',
  WARNING: 'text-student-on-surface-variant',
  DANGER: 'text-student-error font-bold',
  NEUTRAL: 'text-student-on-surface-variant',
};

export const severityIconClass: Record<SessionEventSeverity, string> = {
  SUCCESS: 'text-student-primary',
  WARNING: 'text-student-on-secondary-container',
  DANGER: 'text-student-error',
  NEUTRAL: 'text-student-on-surface-variant',
};

export const severityIcon = (eventType: string, severity: SessionEventSeverity): string => {
  switch (eventType) {
    case 'SESSION_STARTED':
      return 'verified_user';
    case 'SESSION_ENDED':
      return 'stop_circle';
    case 'DEVICE_DETECTED':
      return 'devices';
    case 'ABSENCE_DETECTED':
      return 'person_off';
    case 'AUDIO_ANOMALY':
      return 'volume_up';
    case 'GAZE_DEVIATION':
      return 'visibility_off';
    default:
      if (severity === 'DANGER') return 'warning';
      if (severity === 'WARNING') return 'info';
      if (severity === 'SUCCESS') return 'check_circle';
      return 'circle';
  }
};
