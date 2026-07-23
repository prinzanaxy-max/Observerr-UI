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
};

export type ProctoringExam = {
  id: number;
  title: string;
  courseCode: string;
  activeFeeds: number;
  totalStudents: number;
};

export const PROCTORING_EXAMS: ProctoringExam[] = [
  {
    id: 1,
    title: 'Advanced Algorithms Final',
    courseCode: 'CS401',
    activeFeeds: 142,
    totalStudents: 150,
  },
];

export const PROCTORING_FEEDS: ProctoringFeed[] = [
  {
    id: '902144',
    name: 'Alex Mercer',
    risk: 'high',
    liveStatus: 'tab-out',
    liveStatusLabel: 'Tab Out',
    feedPreview:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=360&fit=crop&q=80',
    audioLevel: 72,
    cameraOn: true,
    micOn: true,
    integrityScore: 42,
    lastFlag: 'Secondary device detected · 2m ago',
    streamingSince: '09:02 AM',
    seatLabel: 'Row A · Seat 12',
  },
  {
    id: '902155',
    name: 'Sarah Chen',
    risk: 'low',
    liveStatus: 'focused',
    liveStatusLabel: 'Focused',
    feedPreview:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=640&h=360&fit=crop&q=80',
    audioLevel: 18,
    cameraOn: true,
    micOn: false,
    integrityScore: 96,
    streamingSince: '09:00 AM',
    seatLabel: 'Row B · Seat 04',
  },
  {
    id: '902188',
    name: 'Maria Garcia',
    risk: 'medium',
    liveStatus: 'looking-away',
    liveStatusLabel: 'Looking Away',
    feedPreview:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=640&h=360&fit=crop&q=80',
    audioLevel: 34,
    cameraOn: true,
    micOn: true,
    integrityScore: 71,
    lastFlag: 'Gaze off-screen · Just now',
    streamingSince: '09:01 AM',
    seatLabel: 'Row C · Seat 08',
  },
  {
    id: '902201',
    name: 'James Wilson',
    initials: 'JW',
    risk: 'low',
    liveStatus: 'focused',
    liveStatusLabel: 'Focused',
    feedPreview:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=360&fit=crop&q=80',
    audioLevel: 12,
    cameraOn: true,
    micOn: false,
    integrityScore: 94,
    streamingSince: '09:00 AM',
    seatLabel: 'Row A · Seat 03',
  },
  {
    id: '902215',
    name: 'Marcus Johnson',
    initials: 'MJ',
    risk: 'high',
    liveStatus: 'tab-out',
    liveStatusLabel: 'Tab Out',
    feedPreview:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=640&h=360&fit=crop&q=80',
    audioLevel: 58,
    cameraOn: true,
    micOn: true,
    integrityScore: 38,
    lastFlag: 'Clipboard paste · 5m ago',
    streamingSince: '09:03 AM',
    seatLabel: 'Row D · Seat 01',
  },
  {
    id: '902230',
    name: 'Emily Nakamura',
    risk: 'low',
    liveStatus: 'focused',
    liveStatusLabel: 'Focused',
    feedPreview:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=640&h=360&fit=crop&q=80',
    audioLevel: 8,
    cameraOn: true,
    micOn: false,
    integrityScore: 91,
    streamingSince: '09:00 AM',
    seatLabel: 'Row B · Seat 11',
  },
];

export const PROCTORING_TIMER_SECONDS = 6026;

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

export const getProctoringFeed = (id: string) => PROCTORING_FEEDS.find((feed) => feed.id === id);
