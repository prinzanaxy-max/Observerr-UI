import apiClient from '../lib/axios';
import { normalizeAnalyticsOverview } from '../lib/lecturerAnalyticsNormalize';
import type { AnalyticsPeriod, LecturerAnalyticsOverviewResponse } from '../types/lecturerAnalytics';

export async function fetchLecturerAnalyticsOverview(
  period: AnalyticsPeriod,
): Promise<LecturerAnalyticsOverviewResponse> {
  const { data } = await apiClient.get<unknown>('/api/lecturer/analytics/overview', {
    params: { period },
  });
  return normalizeAnalyticsOverview(data);
}
