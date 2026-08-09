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
  latestSessionId?: string | number | null;
  blocked?: boolean;
  blockReason?: string | null;
};

export type LiveSessionStats = {
  active: number;
  total: number;
  highRisk: number;
  warnings: number;
  networkStability: number;
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
