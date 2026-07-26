import apiClient from '../lib/axios';
import type { AnalyticsPeriod, LecturerAnalyticsOverviewResponse } from '../types/lecturerAnalytics';

export async function fetchLecturerAnalyticsOverview(
  period: AnalyticsPeriod,
): Promise<LecturerAnalyticsOverviewResponse> {
  const { data } = await apiClient.get<LecturerAnalyticsOverviewResponse>(
    '/api/lecturer/analytics/overview',
    { params: { period } },
  );
  return data;
}
