import { AxiosError } from 'axios';
import apiClient from '../lib/axios';
import type { ProctoringMediaToken } from '../types/proctoringMedia';

export async function fetchStudentMediaToken(
  sessionId: string,
): Promise<ProctoringMediaToken> {
  const { data } = await apiClient.post<ProctoringMediaToken>(
    `/api/student/exam-sessions/${encodeURIComponent(sessionId)}/media-token`,
  );
  return data;
}

export async function fetchLecturerMediaToken(
  examId: number,
): Promise<ProctoringMediaToken> {
  const { data } = await apiClient.post<ProctoringMediaToken>(
    `/api/lecturer/proctoring/exams/${examId}/media-token`,
  );
  return data;
}

export function resolveLiveKitUrl(response: ProctoringMediaToken): string | null {
  const url = response.url ?? response.livekitUrl ?? import.meta.env.VITE_LIVEKIT_URL;
  return typeof url === 'string' && url.trim() ? url.trim() : null;
}

export function isMediaUnavailable(error: unknown): boolean {
  return (
    error instanceof AxiosError &&
    (error.response?.status === 404 || error.response?.status === 503)
  );
}
