import apiClient from '../lib/axios';
import type { StudentExamDto, StudentExamListResponse } from '../types/studentExams';

export async function fetchStudentExams(): Promise<StudentExamListResponse> {
  const { data } = await apiClient.get<StudentExamListResponse>('/api/student/exams');
  return data;
}

export async function fetchStudentExam(examId: number): Promise<StudentExamDto> {
  const { data } = await apiClient.get<StudentExamDto>(`/api/student/exams/${examId}`);
  return data;
}
