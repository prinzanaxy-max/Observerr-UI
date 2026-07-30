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
};

export type LecturerLiveSessionsResponse = {
  examId: number;
  stats: LiveSessionStatsDto;
  students: LiveSessionStudentDto[];
};
