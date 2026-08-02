import type { SubmitIntegritySessionPayload } from './integritySession';

export type ApiStudentExamStatus = 'LIVE' | 'UPCOMING' | 'COMPLETED';

export type StudentExamSecurityDto = {
  webcamMonitoring: boolean;
  tabSwitchTracking: boolean;
  blockCopyPaste: boolean;
};

export type StudentExamDto = {
  id: number;
  title: string;
  courseCode: string;
  courseName: string;
  courseLabel: string;
  schedule: string;
  status: ApiStudentExamStatus | string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  security: StudentExamSecurityDto;
  canTake: boolean;
  questions?: StudentExamQuestionDto[];
  resultId?: number | null;
};

export type StudentExamQuestionDto = {
  id: number;
  text: string;
  order: number;
  points: number;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
};

export type SubmitExamRequest = {
  answers: { questionId: number; selectedOption: 'A' | 'B' | 'C' | 'D' }[];
  completion: SubmitIntegritySessionPayload;
};

export type SubmitExamResponse = {
  id: number;
  examId: number;
  sessionId: string;
  submittedAt: string;
  academicScore: number;
  maxScore: number;
  percentage: number;
  integrityScore: number;
  status: 'PENDING' | 'RELEASED';
};

export type SavedStudentAnswerDto = {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  savedAt: string;
  submitted: boolean;
};

export type StudentExamListResponse = {
  exams: StudentExamDto[];
  totalElements: number;
};
