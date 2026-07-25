import type { NotificationPreferences } from './studentSettingsData';

export type LecturerSettingsTab = 'account' | 'notifications' | 'privacy';

export type SupportFaqItem = {
  id: number;
  question: string;
  answer: string;
};

export const LECTURER_SETTINGS_TABS: {
  id: LecturerSettingsTab;
  label: string;
  keywords: string[];
}[] = [
  {
    id: 'account',
    label: 'Account',
    keywords: ['account', 'name', 'email', 'password', 'security', 'profile', 'photo'],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    keywords: ['notifications', 'alerts', 'reminders', 'email', 'maintenance', 'integrity'],
  },
  {
    id: 'privacy',
    label: 'Privacy',
    keywords: ['privacy', 'monitoring', 'proctoring', 'data', 'encryption', 'video', 'audio'],
  },
];

export const LECTURER_PRIVACY_BULLETS = [
  'Proctoring data is collected only during active exam sessions initiated by you or your institution.',
  'Session recordings and integrity signals are encrypted and retained per your institution’s policy.',
  'You can review flagged sessions and timelines before making academic integrity decisions.',
  'Student consent and institutional policies govern how monitoring data may be used.',
];

export const LECTURER_NOTIFICATION_TOGGLES: {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}[] = [
  {
    key: 'examGraded',
    label: 'Live session alerts',
    description: 'Notify me when students start, disconnect, or finish a proctored session.',
  },
  {
    key: 'examReminders',
    label: 'Scheduled exam reminders',
    description: 'Reminders before exams you publish or proctor go live.',
  },
  {
    key: 'systemMaintenance',
    label: 'System maintenance',
    description: 'Alerts about scheduled downtime and portal maintenance windows.',
  },
  {
    key: 'integrityAlerts',
    label: 'Integrity flags',
    description: 'Updates when sessions are flagged or require review.',
  },
  {
    key: 'emailDigest',
    label: 'Weekly email digest',
    description: 'Summary of exam activity and integrity trends sent every Monday.',
  },
];

export const LECTURER_SUPPORT_FAQ: SupportFaqItem[] = [
  {
    id: 1,
    question: 'How do I create and publish an exam?',
    answer:
      'Go to Exams → New Exam, configure details and security settings, then publish when ready. Students will see the exam in their portal once it is live.',
  },
  {
    id: 2,
    question: 'How does live proctoring work?',
    answer:
      'During a live session you can monitor student feeds, view integrity signals, and open a student timeline for detailed event review.',
  },
  {
    id: 3,
    question: 'What should I do when a session is flagged?',
    answer:
      'Open the student timeline from Live Monitoring or Students, review flagged events and timestamps, then follow your institution’s academic integrity process.',
  },
  {
    id: 4,
    question: 'Can I change my account email or ID?',
    answer:
      'Institutional email and ID are managed by your university. You can update your name, password, and profile photo under Settings → Account.',
  },
];

export const filterLecturerSettingsTabs = (query: string): LecturerSettingsTab[] => {
  const q = query.trim().toLowerCase();
  if (!q) return LECTURER_SETTINGS_TABS.map((t) => t.id);

  return LECTURER_SETTINGS_TABS.filter(
    (tab) =>
      tab.label.toLowerCase().includes(q) ||
      tab.keywords.some((keyword) => keyword.includes(q) || q.includes(keyword)),
  ).map((t) => t.id);
};

export const DEFAULT_LECTURER_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  examGraded: true,
  examReminders: true,
  systemMaintenance: true,
  integrityAlerts: true,
  emailDigest: false,
};

export type StoredLecturerSettings = {
  notifications: NotificationPreferences;
};

export const getDefaultLecturerSettings = (): StoredLecturerSettings => ({
  notifications: { ...DEFAULT_LECTURER_NOTIFICATION_PREFERENCES },
});
