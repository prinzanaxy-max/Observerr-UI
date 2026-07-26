export type AnalyticsPeriod = '7D' | '30D' | '3M';

export type AnalyticsChangeDirection = 'UP' | 'DOWN' | 'STABLE';

export type AnalyticsMetric = {
  value: number;
  changePercent: number | null;
  changeDirection: AnalyticsChangeDirection;
  changeLabel: string;
};

export type AnalyticsMostCommonFlag = {
  label: string;
  sharePercent: number;
  icon: string;
};

export type AnalyticsTrendPoint = {
  label: string;
  monitoredSessions: number;
  flaggedEvents: number;
  alert: boolean;
};

export type AnalyticsTrends = {
  title: string;
  subtitle: string;
  granularity: 'DAY' | 'WEEK';
  points: AnalyticsTrendPoint[];
};

export type AnalyticsBehaviorTone = 'error' | 'warning' | 'neutral';

export type AnalyticsTopBehavior = {
  behaviorCode: string;
  label: string;
  eventCount: number;
  icon: string;
  tone: AnalyticsBehaviorTone;
};

export type LecturerAnalyticsOverviewResponse = {
  period: AnalyticsPeriod;
  totalExamsMonitored: AnalyticsMetric;
  totalFlaggedEvents: AnalyticsMetric;
  avgIntegrityScore: AnalyticsMetric;
  mostCommonFlag: AnalyticsMostCommonFlag;
  trends: AnalyticsTrends;
  topBehaviors: AnalyticsTopBehavior[];
};
