import apiClient from '../lib/axios';
import type {
  LecturerSessionDetailResponse,
  LecturerStudentsPageResponse,
} from '../types/lecturerStudents';
import { LECTURER_STUDENTS_PAGE_SIZE } from '../types/lecturerStudents';

export type FetchLecturerStudentsParams = {
  page: number;
  size?: number;
  search?: string;
  course?: string;
};

export async function fetchLecturerStudents({
  page,
  size = LECTURER_STUDENTS_PAGE_SIZE,
  search = '',
  course = 'ALL',
}: FetchLecturerStudentsParams): Promise<LecturerStudentsPageResponse> {
  const { data } = await apiClient.get<LecturerStudentsPageResponse>('/api/lecturer/students', {
    params: { page, size, search, course },
  });
  return data;
}

export async function fetchLecturerSessionDetail(
  sessionId: string | number,
): Promise<LecturerSessionDetailResponse> {
  const { data } = await apiClient.get<LecturerSessionDetailResponse>(
    `/api/lecturer/students/sessions/${sessionId}`,
  );
  return data;
}
