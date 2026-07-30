import apiClient from '../lib/axios';
import type { LecturerLiveSessionsResponse } from '../types/lecturerLiveSessions';

export async function fetchLecturerLiveSessions(
  examId: number,
): Promise<LecturerLiveSessionsResponse> {
  const { data } = await apiClient.get<LecturerLiveSessionsResponse>(
    `/api/lecturer/exams/${examId}/live-sessions`,
  );
  return data;
}
