export type PortalNavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};

export const PORTAL_NAV: PortalNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/lecturer' },
  { id: 'exams', label: 'Exams', icon: 'quiz', path: '/lecturer/exams' },
  { id: 'students', label: 'Students', icon: 'group', path: '/lecturer/students' },
  { id: 'proctoring', label: 'Proctoring', icon: 'visibility', path: '/lecturer/proctoring' },
  { id: 'reports', label: 'Integrity Reports', icon: 'analytics', path: '/lecturer/reports' },
];

export const PORTAL_FOOTER_NAV: PortalNavItem[] = [
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/lecturer/settings' },
  { id: 'support', label: 'Support', icon: 'help', path: '/lecturer/support' },
];

export const MOBILE_PORTAL_NAV = PORTAL_NAV.filter((item) =>
  ['dashboard', 'exams', 'students', 'proctoring', 'reports'].includes(item.id),
);
