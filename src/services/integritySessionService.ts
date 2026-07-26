import { AxiosError } from 'axios';
import apiClient from '../lib/axios';
import { toApiAuditRecords } from '../lib/integrity/integrityApiMapper';
import type {
  AppendIntegrityEventsResponse,
  BatchIntegrityEventsPayload,
  CompleteIntegritySessionResponse,
  IntegrityAuditRecord,
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
  events: IntegrityAuditRecord[],
): Promise<AppendIntegrityEventsResponse> {
  const payload: BatchIntegrityEventsPayload = { events: toApiAuditRecords(events) };
  const { data } = await apiClient.post<AppendIntegrityEventsResponse>(
    `/api/student/exam-sessions/${sessionId}/integrity-events`,
    payload,
  );
  return data;
}

export async function submitIntegritySession(
  sessionId: string,
  payload: SubmitIntegritySessionPayload,
): Promise<CompleteIntegritySessionResponse> {
  const apiPayload = {
    summary: payload.summary,
    events: toApiAuditRecords(payload.events),
  };
  const { data } = await apiClient.post<CompleteIntegritySessionResponse>(
    `/api/student/exam-sessions/${sessionId}/complete`,
    apiPayload,
  );
  return data;
}

export function isSessionConflictError(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 409;
}
