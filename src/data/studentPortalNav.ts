export type StudentNavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
  filled?: boolean;
  badge?: boolean;
};

export const STUDENT_PORTAL_NAV: StudentNavItem[] = [
  { id: 'home', label: 'Overview', icon: 'dashboard', path: '/student', filled: true },
  { id: 'exams', label: 'Exams', icon: 'assignment', path: '/student/exams' },
  { id: 'results', label: 'Results', icon: 'leaderboard', path: '/student/results' },
  { id: 'records', label: 'Records', icon: 'history_edu', path: '/student/profile' },
];

export const STUDENT_PORTAL_FOOTER_NAV: StudentNavItem[] = [
  { id: 'notifications', label: 'Notifications', icon: 'notifications', path: '/student/notifications', badge: true },
  { id: 'support', label: 'Support', icon: 'help', path: '/student/support' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/student/settings' },
];

export const STUDENT_MOBILE_NAV: StudentNavItem[] = [
  { id: 'home', label: 'Overview', icon: 'dashboard', path: '/student' },
  { id: 'exams', label: 'Exams', icon: 'assignment', path: '/student/exams', filled: true },
  { id: 'results', label: 'Results', icon: 'leaderboard', path: '/student/results' },
  { id: 'records', label: 'Records', icon: 'history_edu', path: '/student/profile' },
];

export const getStudentActiveNav = (pathname: string): string => {
  if (pathname.startsWith('/student/exams')) return 'exams';
  if (pathname.startsWith('/student/results')) return 'results';
  if (pathname.startsWith('/student/notifications')) return 'notifications';
  if (pathname.startsWith('/student/profile')) return 'records';
  if (pathname.startsWith('/student/settings')) return 'settings';
  if (pathname.startsWith('/student/support')) return 'support';
  if (pathname.startsWith('/student/documentation')) return 'settings';
  return 'home';
};
