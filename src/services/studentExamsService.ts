import apiClient from '../lib/axios';
import type {
  StudentExamDto,
  StudentExamListResponse,
  SavedStudentAnswerDto,
  StudentExamQuestionDto,
  SubmitExamRequest,
  SubmitExamResponse,
} from '../types/studentExams';

export async function fetchStudentExams(): Promise<StudentExamListResponse> {
  const { data } = await apiClient.get<StudentExamListResponse>('/api/student/exams');
  return data;
}

export async function fetchStudentExam(examId: number): Promise<StudentExamDto> {
  const { data } = await apiClient.get<StudentExamDto>(`/api/student/exams/${examId}`);
  return data;
}

export async function submitStudentExam(
  sessionId: string,
  payload: SubmitExamRequest,
): Promise<SubmitExamResponse> {
  const { data } = await apiClient.post<SubmitExamResponse>(
    `/api/student/exam-sessions/${encodeURIComponent(sessionId)}/submit`,
    payload,
  );
  return data;
}

export async function fetchSessionQuestions(
  sessionId: string,
): Promise<StudentExamQuestionDto[]> {
  const { data } = await apiClient.get<StudentExamQuestionDto[]>(
    `/api/student/exam-sessions/${encodeURIComponent(sessionId)}/questions`,
  );
  return data;
}

export async function restoreSessionAnswers(
  sessionId: string,
): Promise<SavedStudentAnswerDto[]> {
  const { data } = await apiClient.get<SavedStudentAnswerDto[]>(
    `/api/student/exam-sessions/${encodeURIComponent(sessionId)}/answers`,
  );
  return data;
}

export async function saveSessionAnswer(
  sessionId: string,
  questionId: number,
  selectedOption: 'A' | 'B' | 'C' | 'D',
): Promise<SavedStudentAnswerDto> {
  const { data } = await apiClient.put<SavedStudentAnswerDto>(
    `/api/student/exam-sessions/${encodeURIComponent(sessionId)}/answers/${questionId}`,
    { selectedOption },
  );
  return data;
}
