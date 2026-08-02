export type VerificationItem = {
  id: string;
  label: string;
  status: 'verified' | 'pending' | 'clear';
  description: string;
  icon: string;
};

export type ProfileQuickLink = {
  id: string;
  label: string;
  description: string;
  icon: string;
  path: string;
};

export const buildVerificationItems = (integrityScore: number): VerificationItem[] => [
  {
    id: 'account',
    label: 'Account Status',
    status: 'verified',
    description: 'Your student account is active with no restrictions.',
    icon: 'account_circle',
  },
  {
    id: 'integrity',
    label: 'Integrity Standing',
    status: integrityScore >= 80 ? 'clear' : 'pending',
    description: `Overall score ${integrityScore}% based on completed proctored exams.`,
    icon: 'shield',
  },
];

export const PROFILE_QUICK_LINKS: ProfileQuickLink[] = [
  {
    id: 'exams',
    label: 'My Exams',
    description: 'View upcoming and completed assessments',
    icon: 'assignment',
    path: '/student/exams',
  },
  {
    id: 'results',
    label: 'My Results',
    description: 'Review scores and session timelines',
    icon: 'leaderboard',
    path: '/student/results',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Alerts, reminders, and system updates',
    icon: 'notifications',
    path: '/student/notifications',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Account, privacy, and notification preferences',
    icon: 'settings',
    path: '/student/settings',
  },
];

export const formatMemberSince = (createdAt?: string): string => {
  if (!createdAt) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(createdAt));
  } catch {
    return '—';
  }
};
