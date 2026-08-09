export type SettingsTab = 'account' | 'notifications' | 'privacy';

export type StudentSettingsProfile = {
  firstName: string;
  lastName: string;
};

export type { NotificationPreferences } from '../types/pushNotifications';
import type { NotificationPreferences } from '../types/pushNotifications';

export type StoredStudentSettings = {
  profile: StudentSettingsProfile;
  notifications: NotificationPreferences;
};

export type PasswordChangeInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const SETTINGS_TABS: { id: SettingsTab; label: string; keywords: string[] }[] = [
  {
    id: 'account',
    label: 'Account',
    keywords: ['account', 'name', 'email', 'password', 'security', 'profile'],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    keywords: ['notifications', 'alerts', 'reminders', 'email', 'maintenance', 'grades'],
  },
  {
    id: 'privacy',
    label: 'Privacy',
    keywords: ['privacy', 'monitoring', 'proctoring', 'data', 'encryption', 'video', 'audio'],
  },
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  examEvents: true,
  integrityAlerts: true,
  resultUpdates: true,
  systemUpdates: true,
};

export const PRIVACY_BULLETS = [
  'Monitoring only occurs when you explicitly start an exam.',
  'Data is securely encrypted and automatically deleted after the review period.',
  'You can request a copy of your session data from your institution.',
  'Camera and microphone access is revoked immediately when a session ends.',
];

export const SUPPORT_FAQ = [
  {
    id: 1,
    question: 'How do I prepare for a proctored exam?',
    answer:
      'Ensure a stable internet connection, good lighting, a quiet environment, and a government-issued ID ready for identity verification before starting.',
  },
  {
    id: 2,
    question: 'Why was my integrity score reduced?',
    answer:
      'Integrity scores reflect detected events such as focus loss, gaze deviations, or environmental anomalies during your session. View your result detail page for a full timeline.',
  },
  {
    id: 3,
    question: 'Can I retake an exam?',
    answer:
      'Retake policies are set by your instructor. Contact your course administrator if you believe a retake is warranted.',
  },
];

export const NOTIFICATION_TOGGLES: {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}[] = [
  {
    key: 'examEvents',
    label: 'Exam alerts',
    description: 'Notify me about exam reminders, starts, and endings.',
  },
  {
    key: 'resultUpdates',
    label: 'Result updates',
    description: 'Notify me when a lecturer releases an exam result.',
  },
  {
    key: 'systemUpdates',
    label: 'System maintenance',
    description: 'Alerts about scheduled downtime and portal maintenance windows.',
  },
  {
    key: 'integrityAlerts',
    label: 'Integrity & verification',
    description: 'Updates on identity verification and integrity report availability.',
  },
];

export const filterSettingsTabs = (query: string): SettingsTab[] => {
  const q = query.trim().toLowerCase();
  if (!q) return SETTINGS_TABS.map((t) => t.id);

  return SETTINGS_TABS.filter(
    (tab) =>
      tab.label.toLowerCase().includes(q) ||
      tab.keywords.some((keyword) => keyword.includes(q) || q.includes(keyword)),
  ).map((t) => t.id);
};

export const capitalize = (value: string): string =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';

export const parseNameFromEmail = (email: string): StudentSettingsProfile => {
  const local = email.split('@')[0] ?? '';
  const parts = local.split(/[._-]/).filter(Boolean);

  if (parts.length >= 2) {
    return {
      firstName: capitalize(parts[0]),
      lastName: capitalize(parts[parts.length - 1]),
    };
  }

  return {
    firstName: capitalize(parts[0] || 'Student'),
    lastName: '',
  };
};

export const getDefaultSettings = (email: string): StoredStudentSettings => ({
  profile: parseNameFromEmail(email),
  notifications: { ...DEFAULT_NOTIFICATION_PREFERENCES },
});
