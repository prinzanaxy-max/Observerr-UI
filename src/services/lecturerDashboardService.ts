import apiClient from '../lib/axios';
import type { DashboardNeedsReviewItem, LecturerDashboardResponse } from '../types/lecturerDashboard';

export async function fetchLecturerDashboard(): Promise<LecturerDashboardResponse> {
  const { data } = await apiClient.get<LecturerDashboardResponse>('/api/lecturer/dashboard');
  return data;
}

export async function fetchNeedsReview(params?: {
  limit?: number;
  examId?: number;
}): Promise<DashboardNeedsReviewItem[]> {
  const { data } = await apiClient.get<DashboardNeedsReviewItem[]>('/api/lecturer/students/needs-review', {
    params,
  });
  return data;
}
