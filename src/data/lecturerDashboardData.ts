export type LecturerNavItem = {
  id: string;
  label: string;
  icon: string;
};

export type ReviewStudent = {
  id: number;
  name: string;
  initials: string;
  exam: string;
  risk: 'CRITICAL' | 'MODERATE';
  integrity: number;
};

export type LecturerExam = {
  id: number;
  title: string;
  date: string;
  students: number;
  status: 'live' | 'upcoming' | 'completed';
};

export type FlaggedBehavior = {
  id: number;
  label: string;
  count: number;
  pct: number;
  tone: 'error' | 'secondary' | 'tertiary';
};

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
};

export const LECTURER_NAV: LecturerNavItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'exams', label: 'Exams', icon: 'assignment' },
  { id: 'students', label: 'Students', icon: 'group' },
  { id: 'question-bank', label: 'Question Bank', icon: 'quiz' },
  { id: 'reports', label: 'Reports', icon: 'description' },
  { id: 'analytics', label: 'Analytics', icon: 'insights' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const MOBILE_LECTURER_NAV = LECTURER_NAV.filter((item) =>
  ['home', 'exams', 'students', 'analytics', 'settings'].includes(item.id),
);

export const LIVE_EXAM = {
  title: 'CS 204 — Data Structures Midterm',
  initialSeconds: 1934,
  active: 42,
  highRisk: 3,
  avgScore: 88,
};

export const NEEDS_REVIEW: ReviewStudent[] = [
  { id: 1, name: 'Liam Carter', initials: 'LC', exam: 'CS 204 Midterm', risk: 'CRITICAL', integrity: 42 },
  { id: 2, name: 'Sophia Zheng', initials: 'SZ', exam: 'Data Structures Lab', risk: 'MODERATE', integrity: 68 },
  { id: 3, name: 'Elias Thorne', initials: 'ET', exam: 'CS 204 Midterm', risk: 'MODERATE', integrity: 71 },
];

export const LECTURER_EXAMS: LecturerExam[] = [
  { id: 1, title: 'Algorithm Design Finals', date: 'Dec 14, 2024 • 10:00 AM', students: 128, status: 'live' },
  { id: 2, title: 'Discrete Math Quiz 4', date: 'Dec 16, 2024 • 02:00 PM', students: 84, status: 'upcoming' },
  { id: 3, title: 'Network Security', date: 'Dec 19, 2024 • 09:00 AM', students: 45, status: 'upcoming' },
  { id: 4, title: 'Operating Systems Final', date: 'Nov 28, 2024 • 09:00 AM', students: 96, status: 'completed' },
];

export const INTEGRITY_TREND = [40, 65, 85, 95, 70, 55, 80];

export const FLAGGED_BEHAVIORS: FlaggedBehavior[] = [
  { id: 1, label: 'Tab Switching', count: 64, pct: 82, tone: 'error' },
  { id: 2, label: 'Clipboard / Copy', count: 22, pct: 45, tone: 'secondary' },
  { id: 3, label: 'Idle Behavior', count: 18, pct: 30, tone: 'tertiary' },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'new-exam', label: 'New Exam', icon: 'add_task' },
  { id: 'q-bank', label: 'Q-Bank', icon: 'database' },
  { id: 'reports', label: 'Reports', icon: 'summarize' },
  { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
];

export type ExamTab = 'live' | 'upcoming' | 'completed';
