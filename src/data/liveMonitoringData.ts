export type LiveStatus = 'focused' | 'tab-out' | 'looking-away';

export type RiskFilter = 'all' | 'high' | 'medium' | 'low';

export type MonitoredStudent = {
  id: string;
  name: string;
  initials?: string;
  liveStatus: LiveStatus;
  liveStatusLabel: string;
  risk: 'high' | 'medium' | 'low';
  lastEvent: string | null;
  highlighted?: boolean;
};

export type LiveSessionStats = {
  active: number;
  total: number;
  highRisk: number;
  warnings: number;
  networkStability: number;
};

export const LIVE_SESSION_INITIAL_SECONDS = 6026;

export const LIVE_SESSION_STATS: LiveSessionStats = {
  active: 142,
  total: 150,
  highRisk: 3,
  warnings: 12,
  networkStability: 94,
};

export const MONITORED_STUDENTS: MonitoredStudent[] = [
  {
    id: '902144',
    name: 'Alex Chen',
    liveStatus: 'tab-out',
    liveStatusLabel: 'Active - Tab Out',
    risk: 'high',
    lastEvent: 'Multiple secondary faces detected (2m ago)',
    highlighted: true,
  },
  {
    id: '902155',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    liveStatus: 'focused',
    liveStatusLabel: 'Focused',
    risk: 'low',
    lastEvent: null,
  },
  {
    id: '902188',
    name: 'Maria Garcia',
    liveStatus: 'looking-away',
    liveStatusLabel: 'Looking Away',
    risk: 'medium',
    lastEvent: 'Gaze off-screen > 10s (Just now)',
  },
  {
    id: '902201',
    name: 'James Wilson',
    initials: 'JW',
    liveStatus: 'focused',
    liveStatusLabel: 'Focused',
    risk: 'low',
    lastEvent: null,
  },
  {
    id: '902215',
    name: 'Priya Patel',
    initials: 'PP',
    liveStatus: 'tab-out',
    liveStatusLabel: 'Active - Tab Out',
    risk: 'high',
    lastEvent: 'Clipboard paste detected (5m ago)',
  },
];

export const RISK_FILTER_COUNTS = {
  all: 142,
  high: 3,
  medium: 9,
  low: 130,
};

export const liveStatusDot = {
  focused: 'bg-student-primary',
  'tab-out': 'bg-student-error',
  'looking-away': 'bg-amber-500',
};

export const riskBadge = {
  high: 'bg-student-error-container text-student-on-error-container',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-student-surface-container-high text-student-on-surface-variant',
};
