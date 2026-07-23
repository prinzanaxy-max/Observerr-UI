export type NavItem = {
  id: string;
  label: string;
  icon: string;
  filled?: boolean;
};

export type UpcomingExam = {
  id: number;
  title: string;
  courseCode: string;
  professor: string;
  date: string;
  time: string;
  icon: string;
  badge: { label: string; tone: 'urgent' | 'upcoming' };
};

export type ExamResult = {
  id: number;
  course: string;
  date: string;
  integrity: number;
  status: 'Completed' | 'Reviewed';
};

export type AlertItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  tone: 'primary' | 'secondary';
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home', filled: true },
  { id: 'exams', label: 'Exams', icon: 'assignment' },
  { id: 'results', label: 'Results', icon: 'fact_check' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const UPCOMING_EXAMS: UpcomingExam[] = [
  {
    id: 1,
    title: 'Advanced Calculus III',
    courseCode: 'MATH-301',
    professor: 'Prof. Davis',
    date: 'Oct 12',
    time: '10:00 AM',
    icon: 'calculate',
    badge: { label: 'Starts in 45m', tone: 'urgent' },
  },
  {
    id: 2,
    title: 'Intro to Psychology',
    courseCode: 'PSYC-101',
    professor: 'Dr. Aris',
    date: 'Oct 13',
    time: '2:00 PM',
    icon: 'psychology',
    badge: { label: 'Tomorrow', tone: 'upcoming' },
  },
];

export const RECENT_RESULTS: ExamResult[] = [
  { id: 1, course: 'Data Structures', date: 'Oct 05, 2023', integrity: 98, status: 'Completed' },
  { id: 2, course: 'Modern History', date: 'Sep 28, 2023', integrity: 85, status: 'Completed' },
  { id: 3, course: 'Linear Algebra', date: 'Sep 15, 2023', integrity: 95, status: 'Completed' },
];

export const SCORE_TREND = [80, 85, 95, 92, 98];

export const RECENT_ALERTS: AlertItem[] = [
  {
    id: 1,
    title: 'New exam published',
    message: 'Advanced Calculus III is now available.',
    time: '2 hours ago',
    icon: 'campaign',
    tone: 'primary',
  },
  {
    id: 2,
    title: 'System maintenance',
    message: 'Scheduled for Oct 15, 2:00 AM EST.',
    time: '1 day ago',
    icon: 'build',
    tone: 'secondary',
  },
  {
    id: 3,
    title: 'Results verified',
    message: 'Data Structures results are confirmed.',
    time: '2 days ago',
    icon: 'verified',
    tone: 'primary',
  },
];

export const QUICK_STATS = {
  examsTaken: 12,
  avgIntegrity: 94,
  flags: 0,
};

export const INTEGRITY_SCORE = 94;
