import type { DateRangeKey, FlaggedBehaviorItem, SummaryMetric, TrendDay } from '../data/integrityReportsData';
import type {
  AnalyticsChangeDirection,
  AnalyticsMetric,
  AnalyticsPeriod,
  AnalyticsTopBehavior,
  LecturerAnalyticsOverviewResponse,
} from '../types/lecturerAnalytics';

export const UI_PERIOD_TO_API: Record<Exclude<DateRangeKey, 'custom'>, AnalyticsPeriod> = {
  '7d': '7D',
  '30d': '30D',
  '3m': '3M',
};

export type AnalyticsOverviewView = {
  summary: SummaryMetric[];
  trend: TrendDay[];
  behaviors: FlaggedBehaviorItem[];
  trendTitle: string;
  trendSubtitle: string;
};

const formatCount = (value: number) => value.toLocaleString('en-US');

const formatIntegrity = (value: number) => `${Number(value.toFixed(1))}%`;

const mapChangeDirection = (direction: AnalyticsChangeDirection) => {
  if (direction === 'UP') return 'up' as const;
  if (direction === 'DOWN') return 'down' as const;
  return 'flat' as const;
};

const buildTrendLabel = (metric: AnalyticsMetric) => {
  if (metric.changeDirection === 'STABLE' || metric.changePercent == null) {
    return metric.changeLabel;
  }

  const prefix =
    metric.changeDirection === 'UP'
      ? '+'
      : metric.changeDirection === 'DOWN' && metric.changePercent > 0
        ? '-'
        : '';

  return `${prefix}${metric.changePercent}% ${metric.changeLabel}`;
};

const trendClassFor = (metric: AnalyticsMetric, cardId: string) => {
  if (cardId === 'integrity' && metric.changeDirection === 'DOWN') {
    return 'text-student-error';
  }
  if (metric.changeDirection === 'UP') return 'text-student-primary';
  if (metric.changeDirection === 'DOWN') return 'text-student-error';
  return cardId === 'common-flag' ? 'text-student-on-surface-variant' : 'text-student-primary';
};

const mapSummaryMetric = (
  id: string,
  label: string,
  value: string,
  metric: AnalyticsMetric,
  icon: string,
  styles: Pick<SummaryMetric, 'glowClass' | 'iconBgClass' | 'iconTextClass'>,
): SummaryMetric => ({
  id,
  label,
  value,
  trendLabel: buildTrendLabel(metric),
  trendDirection: mapChangeDirection(metric.changeDirection),
  icon,
  trendClass: trendClassFor(metric, id),
  ...styles,
});

const behaviorStyles = (tone: AnalyticsTopBehavior['tone']) => {
  switch (tone) {
    case 'error':
      return { iconClass: 'text-student-error', barClass: 'bg-student-error' };
    case 'warning':
      return { iconClass: 'text-student-tertiary', barClass: 'bg-student-tertiary' };
    default:
      return { iconClass: 'text-student-primary', barClass: 'bg-student-primary' };
  }
};

export function mapAnalyticsOverviewToView(data: LecturerAnalyticsOverviewResponse): AnalyticsOverviewView {
  const points = data.trends?.points ?? [];
  const topBehaviors = data.topBehaviors ?? [];
  const maxMonitored = Math.max(...points.map((p) => p.monitoredSessions), 1);
  const totalBehaviorEvents = topBehaviors.reduce((sum, b) => sum + b.eventCount, 0);

  return {
    trendTitle: data.trends?.title ?? 'Integrity Event Trends',
    trendSubtitle: data.trends?.subtitle ?? 'Daily flagged events vs monitored sessions',
    summary: [
      mapSummaryMetric(
        'exams',
        'Total Exams Monitored',
        formatCount(data.totalExamsMonitored.value),
        data.totalExamsMonitored,
        'description',
        {
          glowClass: 'bg-student-primary-container/20 group-hover:bg-student-primary-container/30',
          iconBgClass: 'bg-student-primary-container',
          iconTextClass: 'text-student-on-primary-container',
        },
      ),
      mapSummaryMetric(
        'flags',
        'Total Flagged Events',
        formatCount(data.totalFlaggedEvents.value),
        data.totalFlaggedEvents,
        'flag',
        {
          glowClass: 'bg-student-error-container/20 group-hover:bg-student-error-container/30',
          iconBgClass: 'bg-student-error-container',
          iconTextClass: 'text-student-on-error-container',
        },
      ),
      mapSummaryMetric(
        'integrity',
        'Avg Integrity Score',
        formatIntegrity(data.avgIntegrityScore.value),
        data.avgIntegrityScore,
        'verified',
        {
          glowClass: 'bg-student-secondary-container/20 group-hover:bg-student-secondary-container/30',
          iconBgClass: 'bg-student-secondary-container',
          iconTextClass: 'text-student-on-secondary-container',
        },
      ),
      mapSummaryMetric(
        'common-flag',
        'Most Common Flag',
        data.mostCommonFlag.label,
        {
          value: data.mostCommonFlag.sharePercent,
          changePercent: null,
          changeDirection: 'STABLE',
          changeLabel: `${data.mostCommonFlag.sharePercent}% of total flags`,
        },
        data.mostCommonFlag.icon,
        {
          glowClass: 'bg-student-tertiary-container/20 group-hover:bg-student-tertiary-container/30',
          iconBgClass: 'bg-student-surface-container',
          iconTextClass: 'text-student-on-surface-variant',
        },
      ),
    ],
    trend: points.map((point) => ({
      label: point.label,
      sessionsPct: (point.monitoredSessions / maxMonitored) * 100,
      flagsPct: (point.flaggedEvents / maxMonitored) * 100,
      critical: point.alert,
    })),
    behaviors: topBehaviors.map((behavior) => {
      const styles = behaviorStyles(behavior.tone);
      return {
        id: behavior.behaviorCode,
        label: behavior.label,
        events: behavior.eventCount,
        pct:
          totalBehaviorEvents > 0
            ? Math.round((behavior.eventCount / totalBehaviorEvents) * 100)
            : 0,
        icon: behavior.icon,
        ...styles,
      };
    }),
  };
}
