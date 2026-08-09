import type {
  AnalyticsMetric,
  AnalyticsPeriod,
  AnalyticsTopBehavior,
  AnalyticsTrendPoint,
  LecturerAnalyticsOverviewResponse,
} from '../types/lecturerAnalytics';

const pick = <T,>(obj: Record<string, unknown>, camel: string, snake: string): T | undefined =>
  (obj[camel] ?? obj[snake]) as T | undefined;

const normalizeMetric = (raw: unknown): AnalyticsMetric | null => {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  const value = m.value;
  if (typeof value !== 'number') return null;

  const direction = String(m.changeDirection ?? m.change_direction ?? 'STABLE').toUpperCase();
  const changeDirection =
    direction === 'UP' || direction === 'DOWN' || direction === 'STABLE' ? direction : 'STABLE';

  return {
    value,
    changePercent:
      m.changePercent === null || m.changePercent === undefined
        ? m.change_percent === null || m.change_percent === undefined
          ? null
          : Number(m.change_percent)
        : Number(m.changePercent),
    changeDirection: changeDirection as AnalyticsMetric['changeDirection'],
    changeLabel: String(m.changeLabel ?? m.change_label ?? ''),
  };
};

const normalizeTrendPoint = (raw: unknown): AnalyticsTrendPoint | null => {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  return {
    label: String(p.label ?? ''),
    monitoredSessions: Number(p.monitoredSessions ?? p.monitored_sessions ?? 0),
    flaggedEvents: Number(p.flaggedEvents ?? p.flagged_events ?? 0),
    alert: Boolean(p.alert),
  };
};

const normalizeBehavior = (raw: unknown): AnalyticsTopBehavior | null => {
  if (!raw || typeof raw !== 'object') return null;
  const b = raw as Record<string, unknown>;
  const tone = String(b.tone ?? 'neutral').toLowerCase();
  return {
    behaviorCode: String(b.behaviorCode ?? b.behavior_code ?? ''),
    label: String(b.label ?? ''),
    eventCount: Number(b.eventCount ?? b.event_count ?? 0),
    icon: String(b.icon ?? 'flag'),
    tone: tone === 'error' || tone === 'warning' ? tone : 'neutral',
  };
};

/** Coerce backend JSON into the shape the UI mapper expects (camelCase + nested metrics). */
export function normalizeAnalyticsOverview(raw: unknown): LecturerAnalyticsOverviewResponse {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Analytics response is not an object');
  }

  const r = raw as Record<string, unknown>;
  const trendsRaw = pick<Record<string, unknown>>(r, 'trends', 'trends') ?? {};
  const pointsRaw = trendsRaw.points ?? trendsRaw.trend_points ?? [];
  const behaviorsRaw =
    r.topBehaviors ?? r.top_behaviors ?? r.topFlaggedBehaviors ?? r.top_flagged_behaviors ?? [];

  const totalExamsMonitored = normalizeMetric(r.totalExamsMonitored ?? r.total_exams_monitored);
  const totalFlaggedEvents = normalizeMetric(r.totalFlaggedEvents ?? r.total_flagged_events);
  const avgIntegrityScore = normalizeMetric(r.avgIntegrityScore ?? r.avg_integrity_score);
  const mostCommonFlagRaw = pick<Record<string, unknown>>(r, 'mostCommonFlag', 'most_common_flag');

  if (!totalExamsMonitored || !totalFlaggedEvents || !avgIntegrityScore || !mostCommonFlagRaw) {
    throw new Error('Analytics response missing required summary fields');
  }

  const points = (Array.isArray(pointsRaw) ? pointsRaw : [])
    .map(normalizeTrendPoint)
    .filter((p): p is AnalyticsTrendPoint => p !== null);

  const topBehaviors = (Array.isArray(behaviorsRaw) ? behaviorsRaw : [])
    .map(normalizeBehavior)
    .filter((b): b is AnalyticsTopBehavior => b !== null);

  const periodRaw = String(r.period ?? '7D').toUpperCase();
  const period: AnalyticsPeriod =
    periodRaw === '30D' || periodRaw === '3M' || periodRaw === 'CUSTOM'
      ? (periodRaw as AnalyticsPeriod)
      : '7D';

  return {
    period,
    totalExamsMonitored,
    totalFlaggedEvents,
    avgIntegrityScore,
    mostCommonFlag: {
      label: String(mostCommonFlagRaw.label ?? ''),
      sharePercent: Number(mostCommonFlagRaw.sharePercent ?? mostCommonFlagRaw.share_percent ?? 0),
      icon: String(mostCommonFlagRaw.icon ?? 'visibility_off'),
    },
    trends: {
      title: String(trendsRaw.title ?? 'Integrity Event Trends'),
      subtitle: String(
        trendsRaw.subtitle ?? 'Daily flagged events vs monitored sessions',
      ),
      granularity:
        String(trendsRaw.granularity ?? trendsRaw.granularity) === 'WEEK' ? 'WEEK' : 'DAY',
      points,
    },
    topBehaviors,
  };
}
