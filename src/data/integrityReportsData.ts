export type DateRangeKey = '7d' | '30d' | '3m' | 'custom';

export type TrendDirection = 'up' | 'down' | 'flat';

export type SummaryMetric = {
  id: string;
  label: string;
  value: string;
  trendLabel: string;
  trendDirection: TrendDirection;
  icon: string;
  glowClass: string;
  iconBgClass: string;
  iconTextClass: string;
  trendClass: string;
};

export type TrendDay = {
  label: string;
  sessionsPct: number;
  flagsPct: number;
  critical?: boolean;
};

export type FlaggedBehaviorItem = {
  id: string;
  label: string;
  events: number;
  pct: number;
  icon: string;
  iconClass: string;
  barClass: string;
};

export type IntegrityReportSnapshot = {
  summary: SummaryMetric[];
  trend: TrendDay[];
  behaviors: FlaggedBehaviorItem[];
};

const SUMMARY_30D: SummaryMetric[] = [
  {
    id: 'exams',
    label: 'Total Exams Monitored',
    value: '1,248',
    trendLabel: '+12% from last period',
    trendDirection: 'up',
    icon: 'description',
    glowClass: 'bg-student-primary-container/20 group-hover:bg-student-primary-container/30',
    iconBgClass: 'bg-student-primary-container',
    iconTextClass: 'text-student-on-primary-container',
    trendClass: 'text-student-primary',
  },
  {
    id: 'flags',
    label: 'Total Flagged Events',
    value: '342',
    trendLabel: '+5% from last period',
    trendDirection: 'up',
    icon: 'flag',
    glowClass: 'bg-student-error-container/20 group-hover:bg-student-error-container/30',
    iconBgClass: 'bg-student-error-container',
    iconTextClass: 'text-student-on-error-container',
    trendClass: 'text-student-error',
  },
  {
    id: 'integrity',
    label: 'Avg Integrity Score',
    value: '94.2%',
    trendLabel: 'Stable',
    trendDirection: 'flat',
    icon: 'verified',
    glowClass: 'bg-student-secondary-container/20 group-hover:bg-student-secondary-container/30',
    iconBgClass: 'bg-student-secondary-container',
    iconTextClass: 'text-student-on-secondary-container',
    trendClass: 'text-student-primary',
  },
  {
    id: 'common-flag',
    label: 'Most Common Flag',
    value: 'Face Not Visible',
    trendLabel: '45% of total flags',
    trendDirection: 'flat',
    icon: 'visibility_off',
    glowClass: 'bg-student-tertiary-container/20 group-hover:bg-student-tertiary-container/30',
    iconBgClass: 'bg-student-surface-container',
    iconTextClass: 'text-student-on-surface-variant',
    trendClass: 'text-student-on-surface-variant',
  },
];

const TREND_30D: TrendDay[] = [
  { label: 'Mon', sessionsPct: 40, flagsPct: 30 },
  { label: 'Tue', sessionsPct: 60, flagsPct: 45 },
  { label: 'Wed', sessionsPct: 35, flagsPct: 25 },
  { label: 'Thu', sessionsPct: 80, flagsPct: 60, critical: true },
  { label: 'Fri', sessionsPct: 50, flagsPct: 40 },
  { label: 'Sat', sessionsPct: 20, flagsPct: 10 },
  { label: 'Sun', sessionsPct: 15, flagsPct: 5 },
];

const BEHAVIORS_30D: FlaggedBehaviorItem[] = [
  { id: 'face', label: 'Face Not Visible', events: 154, pct: 45, icon: 'visibility_off', iconClass: 'text-student-error', barClass: 'bg-student-error' },
  { id: 'faces', label: 'Multiple Faces', events: 89, pct: 26, icon: 'group', iconClass: 'text-student-tertiary', barClass: 'bg-student-tertiary' },
  { id: 'audio', label: 'Audio Anomaly', events: 52, pct: 15, icon: 'mic', iconClass: 'text-student-secondary', barClass: 'bg-student-secondary' },
  { id: 'device', label: 'Device Detected', events: 27, pct: 8, icon: 'smartphone', iconClass: 'text-student-primary', barClass: 'bg-student-primary' },
  { id: 'tab', label: 'Tab Change', events: 20, pct: 6, icon: 'desktop_windows', iconClass: 'text-student-outline', barClass: 'bg-student-outline' },
];

const SUMMARY_7D: SummaryMetric[] = SUMMARY_30D.map((metric) => {
  if (metric.id === 'exams') return { ...metric, value: '312', trendLabel: '+8% from last week' };
  if (metric.id === 'flags') return { ...metric, value: '89', trendLabel: '+3% from last week' };
  if (metric.id === 'integrity') return { ...metric, value: '95.1%', trendLabel: '+0.4% vs last week', trendDirection: 'up' as const };
  return metric;
});

const TREND_7D: TrendDay[] = TREND_30D.slice(0, 7).map((day, i) => ({
  ...day,
  sessionsPct: Math.max(15, day.sessionsPct - i * 3),
  flagsPct: Math.max(5, day.flagsPct - i * 2),
}));

const BEHAVIORS_7D: FlaggedBehaviorItem[] = BEHAVIORS_30D.map((b) => ({
  ...b,
  events: Math.round(b.events * 0.28),
}));

const SUMMARY_3M: SummaryMetric[] = SUMMARY_30D.map((metric) => {
  if (metric.id === 'exams') return { ...metric, value: '3,842', trendLabel: '+18% from last quarter' };
  if (metric.id === 'flags') return { ...metric, value: '1,024', trendLabel: '+9% from last quarter' };
  if (metric.id === 'integrity') return { ...metric, value: '93.8%', trendLabel: '-0.2% vs last quarter', trendDirection: 'down' as const, trendClass: 'text-student-error' };
  return metric;
});

const TREND_3M: TrendDay[] = [
  { label: 'W1', sessionsPct: 55, flagsPct: 35 },
  { label: 'W2', sessionsPct: 62, flagsPct: 42 },
  { label: 'W3', sessionsPct: 48, flagsPct: 38 },
  { label: 'W4', sessionsPct: 70, flagsPct: 52, critical: true },
  { label: 'W5', sessionsPct: 58, flagsPct: 40 },
  { label: 'W6', sessionsPct: 45, flagsPct: 28 },
  { label: 'W7', sessionsPct: 38, flagsPct: 22 },
  { label: 'W8', sessionsPct: 52, flagsPct: 34 },
  { label: 'W9', sessionsPct: 65, flagsPct: 48 },
  { label: 'W10', sessionsPct: 42, flagsPct: 26 },
  { label: 'W11', sessionsPct: 36, flagsPct: 18 },
  { label: 'W12', sessionsPct: 30, flagsPct: 12 },
];

const BEHAVIORS_3M: FlaggedBehaviorItem[] = BEHAVIORS_30D.map((b) => ({
  ...b,
  events: Math.round(b.events * 3.1),
}));

export const DATE_RANGE_OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '3m', label: '3M' },
  { key: 'custom', label: 'Custom' },
];

export const INTEGRITY_REPORTS: Record<DateRangeKey, IntegrityReportSnapshot> = {
  '7d': { summary: SUMMARY_7D, trend: TREND_7D, behaviors: BEHAVIORS_7D },
  '30d': { summary: SUMMARY_30D, trend: TREND_30D, behaviors: BEHAVIORS_30D },
  '3m': { summary: SUMMARY_3M, trend: TREND_3M, behaviors: BEHAVIORS_3M },
  custom: { summary: SUMMARY_30D, trend: TREND_30D, behaviors: BEHAVIORS_30D },
};

export const trendIcon = (direction: TrendDirection) => {
  if (direction === 'up') return 'trending_up';
  if (direction === 'down') return 'trending_down';
  return 'trending_flat';
};
