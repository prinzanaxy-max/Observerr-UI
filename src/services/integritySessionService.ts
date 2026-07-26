import apiClient from '../lib/axios';
import type {
  BatchIntegrityEventsPayload,
  StartIntegritySessionResponse,
  SubmitIntegritySessionPayload,
} from '../types/integritySession';

export async function startIntegritySession(examId: number): Promise<StartIntegritySessionResponse> {
  const { data } = await apiClient.post<StartIntegritySessionResponse>(
    `/api/student/exams/${examId}/sessions`,
    { startingScore: 100 },
  );
  return data;
}

export async function appendIntegrityEvents(
  sessionId: string,
  payload: BatchIntegrityEventsPayload,
): Promise<void> {
  await apiClient.post(`/api/student/exam-sessions/${sessionId}/integrity-events`, payload);
}

export async function submitIntegritySession(
  sessionId: string,
  payload: SubmitIntegritySessionPayload,
): Promise<void> {
  await apiClient.post(`/api/student/exam-sessions/${sessionId}/complete`, payload);
}
