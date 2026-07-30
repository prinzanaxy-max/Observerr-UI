export type ProctoringExamDto = {
  id: number;
  title: string;
  courseCode: string;
  activeFeeds: number;
  totalStudents: number;
};

export type ProctoringFeedDto = {
  sessionId: string | number;
  studentId: number;
  studentNumber: string;
  name: string;
  initials?: string;
  riskLevel: string;
  liveStatus: string;
  liveStatusLabel: string;
  integrityScore: number;
  snapshotUrl: string | null;
  lastFlag?: string | null;
  cameraOn?: boolean;
  micOn?: boolean;
  audioLevel?: number;
  streamingSince?: string | null;
  seatLabel?: string | null;
};

export type ProctoringExamsResponse = {
  exams: ProctoringExamDto[];
};

export type ProctoringFeedsResponse = {
  examId: number;
  feeds: ProctoringFeedDto[];
};
