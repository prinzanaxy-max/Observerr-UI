export type AnalyticsApiError = {
  error: string;
  message: string;
  timestamp: string;
};

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

export type IntegrityReportEvent = {
  id: string | number;
  sessionId: string | number;
  studentId: string | number;
  studentName: string;
  examId: string | number;
  examTitle: string;
  eventType: string;
  severity: 'SUCCESS' | 'WARNING' | 'DANGER' | 'NEUTRAL';
  occurredAt: string;
  pointsDeducted: number | null;
};

export type IntegrityReportPage = {
  content: IntegrityReportEvent[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  eventTypes: string[];
};

export type IntegrityReportFilters = {
  period: AnalyticsPeriod;
  page?: number;
  size?: number;
  search?: string;
  eventType?: string;
  severity?: IntegrityReportEvent['severity'] | '';
};
