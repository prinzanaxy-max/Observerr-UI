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

export type AlertItem = {
  id: string | number;
  title: string;
  message: string;
  time: string;
  icon: string;
  tone: 'primary' | 'secondary';
  linkTo?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home', filled: true },
  { id: 'exams', label: 'Exams', icon: 'assignment' },
  { id: 'results', label: 'Results', icon: 'fact_check' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
