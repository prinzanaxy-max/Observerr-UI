export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type SessionEventSeverity = 'SUCCESS' | 'WARNING' | 'DANGER' | 'NEUTRAL';

export type LecturerStudentItem = {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  courseCode: string;
  courseName: string;
  courseLabel: string;
  examsTaken: number;
  avgIntegrityScore: number;
  riskLevel: RiskLevel;
  lastActive: string;
  latestSessionId: number | null;
};

export type LecturerStudentsPageResponse = {
  content: LecturerStudentItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  from: number;
  to: number;
  availableCourses: string[];
};

export type SessionTimelineEvent = {
  id: number;
  time: string;
  eventType: string;
  severity: SessionEventSeverity;
  title: string;
  description: string;
  pointsDeducted: number | null;
  hasSnapshot: boolean;
};

export type LecturerSessionDetailResponse = {
  sessionId: number;
  studentId: number;
  studentNumber: string;
  studentName: string;
  initials: string;
  assessmentTitle: string;
  courseCode: string;
  courseName: string;
  courseLabel: string;
  integrityScore: number;
  duration: string;
  totalFlags: number;
  deviceFlags: number;
  absenceFlags: number;
  sessionDate: string;
  events: SessionTimelineEvent[];
};

export type CourseFilterOption = {
  value: string;
  label: string;
};

export const LECTURER_STUDENTS_PAGE_SIZE = 10;
