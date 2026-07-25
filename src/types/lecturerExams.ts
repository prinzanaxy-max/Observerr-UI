export type ApiExamStatus = 'LIVE' | 'UPCOMING' | 'COMPLETED';

export type ExamStatus = 'live' | 'upcoming' | 'completed';

export type ExamFilterTab = ExamStatus;

export type ExamDetailTone = 'error' | 'muted' | 'secondary';

export type ExamDetail = {
  type: 'flags' | 'draft' | 'config';
  label: string;
  icon: string;
  tone: ExamDetailTone;
};

export type ExamSecuritySettings = {
  webcamMonitoring: boolean;
  tabSwitchTracking: boolean;
  blockCopyPaste: boolean;
};

export type LecturerExamDto = {
  id: number;
  title: string;
  courseCode: string;
  courseName: string;
  courseLabel: string;
  term: string;
  schedule: string;
  status: ApiExamStatus;
  enrollment: string;
  enrolledCount: number;
  capacityCount: number | null;
  activeFlagsCount?: number;
  startAt: string;
  durationMinutes: number;
  security: ExamSecuritySettings;
  detail: ExamDetail | null;
};

export type LecturerExamsListResponse = {
  exams: LecturerExamDto[];
  totalElements: number;
};

export type CreateExamRequest = {
  title: string;
  course: string;
  startAt: string;
  durationMinutes: number;
  security: ExamSecuritySettings;
  publish: boolean;
};

export type ExamOverview = {
  id: number;
  title: string;
  courseCode: string;
  term: string;
  schedule: string;
  status: ExamStatus;
  enrollment: string;
  startAt: string;
  durationMinutes: number;
  detail?: ExamDetail;
};

export type FetchLecturerExamsParams = {
  status?: 'ALL' | ApiExamStatus;
  search?: string;
};
