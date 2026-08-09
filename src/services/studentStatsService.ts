import apiClient from '../lib/axios';
import type { StudentStats } from '../types/studentStats';

export async function fetchStudentStats(): Promise<StudentStats> {
  const { data } = await apiClient.get<StudentStats>('/api/student/stats');
  return data;
}
