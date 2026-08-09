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

export const DATE_RANGE_OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '3m', label: '3M' },
];

export const trendIcon = (direction: TrendDirection) => {
  if (direction === 'up') return 'trending_up';
  if (direction === 'down') return 'trending_down';
  return 'trending_flat';
};
