import apiClient from '../lib/axios';
import type {
  CreateExamRequest,
  FetchLecturerExamsParams,
  LecturerExamDto,
  LecturerExamsListResponse,
  LecturerExamResultsResponse,
} from '../types/lecturerExams';
import {
  requireArray,
  requireBoolean,
  requireNumber,
  requireRecord,
  requireString,
} from '../lib/apiResponse';

export const normalizeLecturerResults = (value: unknown): LecturerExamResultsResponse =>
  requireArray(value, 'lecturer exam results').map((value) => {
    const result = requireRecord(value, 'lecturer exam result');
    const status = requireString(result.status, 'lecturer exam result');
    if (status !== 'PENDING' && status !== 'RELEASED') {
      throw new Error('Invalid lecturer exam result response.');
    }
    return {
      id: requireNumber(result.id, 'lecturer exam result'),
      studentId: requireNumber(result.studentId, 'lecturer exam result'),
      studentName: requireString(result.studentName, 'lecturer exam result'),
      submittedAt: requireString(result.submittedAt, 'lecturer exam result'),
      academicScore: requireNumber(result.academicScore, 'lecturer exam result'),
      maxScore: requireNumber(result.maxScore, 'lecturer exam result'),
      percentage: requireNumber(result.percentage, 'lecturer exam result'),
      integrityScore: requireNumber(result.integrityScore, 'lecturer exam result'),
      requiresReview: requireBoolean(result.requiresReview, 'lecturer exam result'),
      status,
    };
  });

export async function fetchLecturerExams({
  status = 'ALL',
  search = '',
}: FetchLecturerExamsParams = {}): Promise<LecturerExamsListResponse> {
  const { data } = await apiClient.get<LecturerExamsListResponse>('/api/lecturer/exams', {
    params: { status, search },
  });
  return data;
}

export async function fetchLecturerExamResults(examId: number): Promise<LecturerExamResultsResponse> {
  const { data } = await apiClient.get<unknown>(
    `/api/lecturer/exams/${examId}/results`,
  );
  return normalizeLecturerResults(data);
}

export async function setLecturerResultReleased(
  examId: number,
  resultId: number,
  released: boolean,
): Promise<LecturerExamResultsResponse> {
  const { data } = await apiClient.post<unknown>(
    `/api/lecturer/exams/${examId}/results/${released ? 'release' : 'unrelease'}`,
    { resultIds: [resultId] },
  );
  return normalizeLecturerResults(data);
}

export async function fetchLecturerExam(examId: number): Promise<LecturerExamDto> {
  const { data } = await apiClient.get<LecturerExamDto>(`/api/lecturer/exams/${examId}`);
  return data;
}

export async function createLecturerExam(payload: CreateExamRequest): Promise<LecturerExamDto> {
  const { data } = await apiClient.post<LecturerExamDto>('/api/lecturer/exams', payload);
  return data;
}
