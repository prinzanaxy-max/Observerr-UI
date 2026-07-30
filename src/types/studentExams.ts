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
};

export type StudentExamListResponse = {
  exams: StudentExamDto[];
  totalElements: number;
};
