import apiClient from '../lib/axios';
import type { ProctoringExamsResponse, ProctoringFeedsResponse } from '../types/lecturerProctoring';

export async function fetchProctoringExams(): Promise<ProctoringExamsResponse> {
  const { data } = await apiClient.get<ProctoringExamsResponse>('/api/lecturer/proctoring/exams');
  return data;
}

export async function fetchProctoringFeeds(examId: number): Promise<ProctoringFeedsResponse> {
  const { data } = await apiClient.get<ProctoringFeedsResponse>(
    `/api/lecturer/proctoring/exams/${examId}/feeds`,
  );
  return data;
}
