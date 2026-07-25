import type { ProfileStat } from '../data/studentProfileData';
import type { StudentStats } from '../types/studentStats';

export type StatsCard = {
  id: string;
  label: string;
  value: string;
  icon: string;
  tone?: 'primary' | 'secondary' | 'neutral';
};

export const buildResultsSummaryCards = (stats: StudentStats): StatsCard[] => [
  {
    id: 'exams',
    label: 'Exams Completed',
    value: String(stats.examsCompleted),
    icon: 'history_edu',
    tone: 'neutral',
  },
  {
    id: 'integrity',
    label: 'Avg Integrity',
    value: `${stats.avgIntegrity}%`,
    icon: 'verified_user',
    tone: 'primary',
  },
  {
    id: 'verified',
    label: 'Verified Sessions',
    value: String(stats.verifiedSessions),
    icon: 'check_circle',
    tone: 'primary',
  },
  {
    id: 'review',
    label: 'Under Review',
    value: String(stats.underReview),
    icon: 'pending',
    tone: 'secondary',
  },
];

export const buildProfileStats = (stats: StudentStats): ProfileStat[] => [
  {
    id: 'exams',
    label: 'Exams Completed',
    value: String(stats.examsCompleted),
    icon: 'history_edu',
    tone: 'neutral',
  },
  {
    id: 'integrity',
    label: 'Avg. Integrity',
    value: `${stats.avgIntegrity}%`,
    icon: 'verified_user',
    tone: 'primary',
  },
  {
    id: 'verified',
    label: 'Verified Sessions',
    value: String(stats.verifiedSessions),
    icon: 'check_circle',
    tone: 'primary',
  },
  {
    id: 'review',
    label: 'Under Review',
    value: String(stats.underReview),
    icon: 'flag',
    tone: stats.underReview > 0 ? 'secondary' : 'neutral',
  },
];

export type QuickStatRow = {
  id: string;
  label: string;
  value: string;
  icon: string;
  valueClassName?: string;
};

export const buildQuickStatRows = (stats: StudentStats): QuickStatRow[] => [
  {
    id: 'exams',
    label: 'Exams Completed',
    value: String(stats.examsCompleted),
    icon: 'history_edu',
  },
  {
    id: 'integrity',
    label: 'Avg Integrity',
    value: `${stats.avgIntegrity}%`,
    icon: 'security',
    valueClassName: 'text-student-primary',
  },
  {
    id: 'verified',
    label: 'Verified Sessions',
    value: String(stats.verifiedSessions),
    icon: 'check_circle',
  },
  {
    id: 'review',
    label: 'Under Review',
    value: String(stats.underReview),
    icon: 'pending',
    valueClassName: stats.underReview > 0 ? 'text-student-secondary' : undefined,
  },
];
