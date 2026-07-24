import { STUDENT_RESULTS } from './studentResultsData';
import { QUICK_STATS, INTEGRITY_SCORE } from './studentDashboardData';

export type ProfileStat = {
  id: string;
  label: string;
  value: string;
  icon: string;
  tone?: 'primary' | 'secondary' | 'neutral';
};

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

export type ProfileActivity = {
  id: number;
  title: string;
  subtitle: string;
  timeLabel: string;
  icon: string;
  linkTo?: string;
};

export const getStudentProfileStats = (): ProfileStat[] => {
  const examsTaken = STUDENT_RESULTS.length;
  const avgIntegrity = examsTaken
    ? Math.round(STUDENT_RESULTS.reduce((sum, r) => sum + r.integrityScore, 0) / examsTaken)
    : 0;
  const verifiedCount = STUDENT_RESULTS.filter((r) => r.status === 'Verified').length;
  const underReview = STUDENT_RESULTS.filter((r) => r.status === 'Under Review').length;

  return [
    {
      id: 'exams',
      label: 'Exams Completed',
      value: String(examsTaken),
      icon: 'history_edu',
      tone: 'neutral',
    },
    {
      id: 'integrity',
      label: 'Avg. Integrity',
      value: `${avgIntegrity}%`,
      icon: 'verified_user',
      tone: 'primary',
    },
    {
      id: 'verified',
      label: 'Verified Sessions',
      value: String(verifiedCount),
      icon: 'check_circle',
      tone: 'primary',
    },
    {
      id: 'flags',
      label: 'Under Review',
      value: String(underReview),
      icon: 'flag',
      tone: underReview > 0 ? 'secondary' : 'neutral',
    },
  ];
};

export const getOverallIntegrityScore = (): number => INTEGRITY_SCORE;

export const getProfileRecentResults = (limit = 4) =>
  [...STUDENT_RESULTS]
    .sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime())
    .slice(0, limit);

export const VERIFICATION_ITEMS: VerificationItem[] = [
  {
    id: 'identity',
    label: 'Identity Verification',
    status: 'verified',
    description: 'Biometric profile matched and approved for proctored exams.',
    icon: 'badge',
  },
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
    status: 'clear',
    description: `Overall score ${INTEGRITY_SCORE}% — consistent adherence to testing protocols.`,
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

export const getProfileActivity = (): ProfileActivity[] => {
  const recentResults = getProfileRecentResults(3);

  return recentResults.map((result) => ({
    id: result.id,
    title: `${result.examLabel}: ${result.courseName}`,
    subtitle: `Integrity ${result.integrityScore}% · ${result.status}`,
    timeLabel: result.dateTaken,
    icon: result.icon,
    linkTo: `/student/results/${result.id}`,
  }));
};

export const formatMemberSince = (createdAt?: string): string => {
  if (!createdAt) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(createdAt));
  } catch {
    return '—';
  }
};

export const filterProfileResults = (query: string, limit = 4) => {
  const q = query.trim().toLowerCase();
  const results = getProfileRecentResults(24);
  if (!q) return results.slice(0, limit);
  return results
    .filter(
      (r) =>
        r.courseName.toLowerCase().includes(q) ||
        r.courseCode.toLowerCase().includes(q) ||
        r.examLabel.toLowerCase().includes(q),
    )
    .slice(0, limit);
};

/** Re-export for profile stats card consistency with dashboard */
export const PROFILE_QUICK_STATS = QUICK_STATS;
