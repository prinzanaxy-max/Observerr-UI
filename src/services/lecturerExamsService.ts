import apiClient from '../lib/axios';
import type {
  CreateExamRequest,
  FetchLecturerExamsParams,
  LecturerExamDto,
  LecturerExamsListResponse,
} from '../types/lecturerExams';

export async function fetchLecturerExams({
  status = 'ALL',
  search = '',
}: FetchLecturerExamsParams = {}): Promise<LecturerExamsListResponse> {
  const { data } = await apiClient.get<LecturerExamsListResponse>('/api/lecturer/exams', {
    params: { status, search },
  });
  return data;
}

export async function fetchLecturerExam(examId: number): Promise<LecturerExamDto> {
  const { data } = await apiClient.get<LecturerExamDto>(`/api/lecturer/exams/${examId}`);
  return data;
}

export async function createLecturerExam(payload: CreateExamRequest): Promise<LecturerExamDto> {
  const { data } = await apiClient.post<LecturerExamDto>('/api/lecturer/exams', payload);
  return data;
}
