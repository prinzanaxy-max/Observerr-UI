export type ProctoringExamDto = {
  examId: number;
  title: string;
  courseLabel: string;
  activeFeeds: number;
  totalStudents: number;
};

export type ProctoringFeedDto = {
  sessionId: string | number;
  participantIdentity?: string;
  roomName?: string;
  studentId: number;
  studentNumber?: string;
  studentName: string;
  name?: string;
  initials?: string;
  riskLevel: string;
  liveStatus?: string;
  liveStatusLabel: string;
  integrityScore: number;
  snapshotUrl: string | null;
  lastEvent?: string | null;
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
  roomName?: string;
  feeds: ProctoringFeedDto[];
};
