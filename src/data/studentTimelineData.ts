export type TimelineEventType = 'start' | 'minor' | 'critical' | 'end';

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  type: TimelineEventType;
  points?: number;
  message: string;
  icon: string;
  evidenceLabel?: string;
  pulse?: boolean;
};

export type SessionStatistics = {
  duration: string;
  totalFlags: number;
  deviceFlags: number;
  absenceFlags: number;
};

export type StudentTimelineProfile = {
  id: string;
  name: string;
  initials?: string;
  examLabel: string;
  integrityScore: number;
  events: TimelineEvent[];
  stats: SessionStatistics;
};

const DEFAULT_STATS: SessionStatistics = {
  duration: '2h 00m',
  totalFlags: 12,
  deviceFlags: 2,
  absenceFlags: 1,
};

const HIGH_RISK_TIMELINE: TimelineEvent[] = [
  {
    id: 'e1',
    time: '09:00 AM',
    title: 'Session Started',
    type: 'start',
    message: 'Identity verification successful. Environmental scan passed.',
    icon: 'verified_user',
  },
  {
    id: 'e2',
    time: '09:45 AM',
    title: 'Minor Infraction',
    type: 'minor',
    points: 2,
    message: 'Audio threshold exceeded. Background conversation detected.',
    icon: 'volume_up',
  },
  {
    id: 'e3',
    time: '10:12 AM',
    title: 'Critical Violation',
    type: 'critical',
    points: 15,
    message: 'Primary subject left the camera frame for > 30 seconds.',
    icon: 'visibility_off',
    evidenceLabel: 'Empty desk snapshot captured at 10:12 AM',
    pulse: true,
  },
  {
    id: 'e4',
    time: '10:40 AM',
    title: 'Critical Violation',
    type: 'critical',
    points: 25,
    message: 'Secondary device (smartphone) detected in frame.',
    icon: 'devices',
  },
  {
    id: 'e5',
    time: '11:00 AM',
    title: 'Session Ended',
    type: 'end',
    message: 'Exam submitted by user.',
    icon: 'stop_circle',
  },
];

const LOW_RISK_TIMELINE: TimelineEvent[] = [
  {
    id: 'e1',
    time: '09:00 AM',
    title: 'Session Started',
    type: 'start',
    message: 'Identity verification successful. Environmental scan passed.',
    icon: 'verified_user',
  },
  {
    id: 'e2',
    time: '11:00 AM',
    title: 'Session Ended',
    type: 'end',
    message: 'Exam submitted by user.',
    icon: 'stop_circle',
  },
];

const MEDIUM_RISK_TIMELINE: TimelineEvent[] = [
  {
    id: 'e1',
    time: '09:00 AM',
    title: 'Session Started',
    type: 'start',
    message: 'Identity verification successful. Environmental scan passed.',
    icon: 'verified_user',
  },
  {
    id: 'e2',
    time: '10:05 AM',
    title: 'Minor Infraction',
    type: 'minor',
    points: 5,
    message: 'Gaze off-screen for more than 10 seconds.',
    icon: 'visibility',
  },
  {
    id: 'e3',
    time: '11:00 AM',
    title: 'Session Ended',
    type: 'end',
    message: 'Exam submitted by user.',
    icon: 'stop_circle',
  },
];

export const STUDENT_TIMELINES: Record<string, StudentTimelineProfile> = {
  '902144': {
    id: '902144',
    name: 'Alex Mercer',
    examLabel: 'Advanced Calculus Final (MATH401)',
    integrityScore: 42,
    events: HIGH_RISK_TIMELINE,
    stats: DEFAULT_STATS,
  },
  '902155': {
    id: '902155',
    name: 'Sarah Chen',
    examLabel: 'Calculus II Midterm (MATH202)',
    integrityScore: 96,
    events: LOW_RISK_TIMELINE,
    stats: { duration: '2h 00m', totalFlags: 0, deviceFlags: 0, absenceFlags: 0 },
  },
  '902188': {
    id: '902188',
    name: 'Maria Garcia',
    examLabel: 'Advanced Calculus Final (MATH401)',
    integrityScore: 71,
    events: MEDIUM_RISK_TIMELINE,
    stats: { duration: '2h 00m', totalFlags: 3, deviceFlags: 0, absenceFlags: 1 },
  },
  '902201': {
    id: '902201',
    name: 'James Wilson',
    initials: 'JW',
    examLabel: 'Advanced Calculus Final (MATH401)',
    integrityScore: 94,
    events: LOW_RISK_TIMELINE,
    stats: { duration: '1h 55m', totalFlags: 0, deviceFlags: 0, absenceFlags: 0 },
  },
  '902215': {
    id: '902215',
    name: 'Marcus Johnson',
    initials: 'MJ',
    examLabel: 'Intro to CS Final (CS101)',
    integrityScore: 38,
    events: HIGH_RISK_TIMELINE,
    stats: DEFAULT_STATS,
  },
};

export const getStudentTimeline = (studentId: string): StudentTimelineProfile | undefined =>
  STUDENT_TIMELINES[studentId];

export const eventDotClass = {
  start: 'bg-student-primary',
  minor: 'bg-student-secondary-fixed',
  critical: 'bg-student-error',
  end: 'bg-student-surface-variant',
};

export const eventCardClass = {
  start: 'bg-student-surface-container-low border-student-surface-container-high',
  minor: 'bg-student-secondary-container/20 border-student-secondary-container/50',
  critical: 'bg-student-error-container/30 border-student-error/50',
  end: 'bg-student-surface-container-low border-student-surface-container-high',
};

export const eventTitleClass = {
  start: 'text-student-on-surface-variant',
  minor: 'text-student-on-surface-variant',
  critical: 'text-student-error font-bold',
  end: 'text-student-on-surface-variant',
};

export const pointsBadgeClass = {
  minor: 'bg-student-secondary-container text-student-on-secondary-container',
  critical: 'bg-student-error text-student-on-error',
};
