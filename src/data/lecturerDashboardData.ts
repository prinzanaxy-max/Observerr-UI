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
  latestSessionId: string | number | null;
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

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'new-exam', label: 'New Exam', icon: 'add_task' },
  { id: 'q-bank', label: 'Q-Bank', icon: 'database' },
  { id: 'reports', label: 'Reports', icon: 'summarize' },
  { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
];

export type ExamTab = 'live' | 'upcoming' | 'completed';
