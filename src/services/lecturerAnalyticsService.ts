import apiClient from '../lib/axios';
import { normalizeAnalyticsOverview } from '../lib/lecturerAnalyticsNormalize';
import type {
  AnalyticsPeriod,
  IntegrityReportFilters,
  IntegrityReportPage,
  LecturerAnalyticsOverviewResponse,
} from '../types/lecturerAnalytics';
import { requireArray, requireNumber, requireRecord, requireString } from '../lib/apiResponse';

const SEVERITIES = ['SUCCESS', 'WARNING', 'DANGER', 'NEUTRAL'] as const;

export const normalizeIntegrityReport = (value: unknown): IntegrityReportPage => {
  const page = requireRecord(value, 'integrity report');
  return {
    content: requireArray(page.content, 'integrity report').map((value) => {
      const event = requireRecord(value, 'integrity report event');
      const severity = requireString(event.severity, 'integrity report event');
      if (!SEVERITIES.includes(severity as (typeof SEVERITIES)[number])) {
        throw new Error('Invalid integrity report event response.');
      }
      if (
        (typeof event.id !== 'string' && typeof event.id !== 'number') ||
        (typeof event.sessionId !== 'string' && typeof event.sessionId !== 'number') ||
        (typeof event.studentId !== 'string' && typeof event.studentId !== 'number') ||
        (typeof event.examId !== 'string' && typeof event.examId !== 'number')
      ) throw new Error('Invalid integrity report event response.');
      return {
        id: event.id,
        sessionId: event.sessionId,
        studentId: event.studentId,
        studentName: requireString(event.studentName, 'integrity report event'),
        examId: event.examId,
        examTitle: requireString(event.examTitle, 'integrity report event'),
        eventType: requireString(event.eventType, 'integrity report event'),
        severity: severity as IntegrityReportPage['content'][number]['severity'],
        occurredAt: requireString(event.occurredAt, 'integrity report event'),
        pointsDeducted: event.pointsDeducted === null
          ? null
          : requireNumber(event.pointsDeducted, 'integrity report event'),
      };
    }),
    page: requireNumber(page.page, 'integrity report'),
    size: requireNumber(page.size, 'integrity report'),
    totalElements: requireNumber(page.totalElements, 'integrity report'),
    totalPages: requireNumber(page.totalPages, 'integrity report'),
    eventTypes: requireArray(page.eventTypes, 'integrity report').map((type) =>
      requireString(type, 'integrity report')),
  };
};

export async function fetchLecturerAnalyticsOverview(
  period: AnalyticsPeriod,
  range?: { startDate: string; endDate: string },
): Promise<LecturerAnalyticsOverviewResponse> {
  const { data } = await apiClient.get<unknown>('/api/lecturer/analytics/overview', {
    params: range
      ? { startDate: range.startDate, endDate: range.endDate }
      : { period },
  });
  return normalizeAnalyticsOverview(data);
}

export async function fetchIntegrityReport(
  filters: IntegrityReportFilters,
): Promise<IntegrityReportPage> {
  const { data } = await apiClient.get<unknown>(
    '/api/lecturer/analytics/integrity-events',
    { params: filters },
  );
  return normalizeIntegrityReport(data);
}
