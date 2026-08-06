import type { LiveStatus } from './liveMonitoringData';

export type ProctoringFeed = {
  id: string;
  name: string;
  initials?: string;
  risk: 'high' | 'medium' | 'low';
  liveStatus: LiveStatus;
  liveStatusLabel: string;
  feedPreview: string;
  audioLevel: number;
  cameraOn: boolean;
  micOn: boolean;
  integrityScore: number;
  lastFlag?: string;
  streamingSince: string;
  seatLabel?: string;
  sessionId?: string | number;
  participantIdentity?: string;
  roomName?: string;
};

export type ProctoringExam = {
  id: number;
  title: string;
  courseCode: string;
  activeFeeds: number;
  totalStudents: number;
};

export const liveStatusTone = {
  focused: 'text-student-primary bg-student-primary-container/30 border-student-primary/30',
  'tab-out': 'text-student-error bg-student-error-container/40 border-student-error/30',
  'looking-away': 'text-amber-700 bg-amber-100 border-amber-200',
};

export const riskTone = {
  high: 'bg-student-error-container text-student-on-error-container',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-student-tertiary-container text-student-on-tertiary-container',
};
