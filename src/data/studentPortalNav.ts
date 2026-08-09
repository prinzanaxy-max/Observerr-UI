export type StudentNavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
  filled?: boolean;
  badge?: boolean;
};

export const STUDENT_PORTAL_NAV: StudentNavItem[] = [
  { id: 'home', label: 'Home', icon: 'home', path: '/student', filled: true },
  { id: 'exams', label: 'Exams', icon: 'assignment', path: '/student/exams' },
  { id: 'results', label: 'Results', icon: 'leaderboard', path: '/student/results' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications', path: '/student/notifications', badge: false },
];

export const STUDENT_PORTAL_FOOTER_NAV: StudentNavItem[] = [
  { id: 'profile', label: 'Profile', icon: 'person', path: '/student/profile' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/student/settings' },
];

export const STUDENT_MOBILE_NAV: StudentNavItem[] = [
  { id: 'home', label: 'Home', icon: 'home', path: '/student' },
  { id: 'exams', label: 'Exams', icon: 'assignment', path: '/student/exams', filled: true },
  { id: 'results', label: 'Results', icon: 'leaderboard', path: '/student/results' },
  { id: 'profile', label: 'Profile', icon: 'person', path: '/student/profile' },
];

export const getStudentActiveNav = (pathname: string): string => {
  if (pathname.startsWith('/student/exams')) return 'exams';
  if (pathname.startsWith('/student/results')) return 'results';
  if (pathname.startsWith('/student/notifications')) return 'notifications';
  if (pathname.startsWith('/student/profile')) return 'profile';
  if (pathname.startsWith('/student/settings')) return 'settings';
  if (pathname.startsWith('/student/documentation')) return 'settings';
  return 'home';
};
