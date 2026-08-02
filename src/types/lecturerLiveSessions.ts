export type LiveSessionStatsDto = {
  active: number;
  total: number;
  highRisk: number;
  warnings: number;
  networkStability: number;
};

export type LiveSessionStudentDto = {
  studentId: number;
  studentNumber: string;
  name: string;
  initials: string;
  liveStatus: string;
  liveStatusLabel: string;
  riskLevel: string;
  lastEvent: string | null;
  latestSessionId: string | number | null;
  integrityScore: number;
  highlighted?: boolean;
  blocked?: boolean;
  blockReason?: string | null;
};

export type EndExamResponse = {
  examId: number;
  status: 'COMPLETED';
  endedAt: string;
};

export type ExamStudentBlockRequest = {
  reason: string;
};

export type LecturerLiveSessionsResponse = {
  examId: number;
  stats: LiveSessionStatsDto;
  students: LiveSessionStudentDto[];
};
