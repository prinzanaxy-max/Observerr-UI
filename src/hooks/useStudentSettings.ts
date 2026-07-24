import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getDefaultSettings,
  type NotificationPreferences,
  type PasswordChangeInput,
  type StoredStudentSettings,
  type StudentSettingsProfile,
} from '../data/studentSettingsData';
import { useAuthProfile } from './useAuthProfile';

const storageKey = (institutionalId: string) => `observerr:student-settings:${institutionalId}`;

const readStoredSettings = (institutionalId: string, email: string): StoredStudentSettings => {
  if (!institutionalId || institutionalId === '—') {
    return getDefaultSettings(email);
  }

  try {
    const raw = localStorage.getItem(storageKey(institutionalId));
    if (!raw) return getDefaultSettings(email);
    const parsed = JSON.parse(raw) as Partial<StoredStudentSettings>;
    const defaults = getDefaultSettings(email);
    return {
      profile: { ...defaults.profile, ...parsed.profile },
      notifications: { ...defaults.notifications, ...parsed.notifications },
    };
  } catch {
    return getDefaultSettings(email);
  }
};

const writeStoredSettings = (institutionalId: string, settings: StoredStudentSettings) => {
  if (!institutionalId || institutionalId === '—') return;
  localStorage.setItem(storageKey(institutionalId), JSON.stringify(settings));
};

export type SaveStatus = 'idle' | 'success' | 'error';

export function useStudentSettings() {
  const { institutionalId, email } = useAuthProfile();
  const [settings, setSettings] = useState<StoredStudentSettings>(() =>
    readStoredSettings(institutionalId, email),
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setSettings(readStoredSettings(institutionalId, email));
  }, [institutionalId, email]);

  const clearStatus = useCallback(() => {
    setSaveStatus('idle');
    setSaveMessage('');
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSaveStatus('success');
    setSaveMessage(message);
  }, []);

  const showError = useCallback((message: string) => {
    setSaveStatus('error');
    setSaveMessage(message);
  }, []);

  const saveProfile = useCallback(
    async (profile: StudentSettingsProfile, password?: PasswordChangeInput) => {
      clearStatus();

      if (!profile.firstName.trim()) {
        showError('First name is required.');
        return false;
      }

      const hasPasswordInput =
        password &&
        (password.currentPassword || password.newPassword || password.confirmPassword);

      if (hasPasswordInput && password) {
        if (!password.currentPassword) {
          showError('Enter your current password to change it.');
          return false;
        }
        if (!password.newPassword) {
          showError('Enter a new password.');
          return false;
        }
        if (password.newPassword.length < 8) {
          showError('New password must be at least 8 characters.');
          return false;
        }
        if (password.newPassword !== password.confirmPassword) {
          showError('New password and confirmation do not match.');
          return false;
        }
      }

      const next: StoredStudentSettings = { ...settings, profile };
      writeStoredSettings(institutionalId, next);
      setSettings(next);

      await new Promise((resolve) => setTimeout(resolve, 400));

      if (hasPasswordInput) {
        showSuccess('Account updated and password change request submitted.');
      } else {
        showSuccess('Account information saved successfully.');
      }

      return true;
    },
    [clearStatus, institutionalId, settings, showError, showSuccess],
  );

  const updateNotificationPref = useCallback(
    (key: keyof NotificationPreferences, value: boolean) => {
      clearStatus();
      const next: StoredStudentSettings = {
        ...settings,
        notifications: { ...settings.notifications, [key]: value },
      };
      writeStoredSettings(institutionalId, next);
      setSettings(next);
      showSuccess('Notification preferences updated.');
    },
    [clearStatus, institutionalId, settings, showSuccess],
  );

  const saveAllNotifications = useCallback(
    async (notifications: NotificationPreferences) => {
      clearStatus();
      const next: StoredStudentSettings = { ...settings, notifications };
      writeStoredSettings(institutionalId, next);
      setSettings(next);
      await new Promise((resolve) => setTimeout(resolve, 300));
      showSuccess('Notification preferences saved.');
      return true;
    },
    [clearStatus, institutionalId, settings, showSuccess],
  );

  const displayName = useMemo(() => {
    const { firstName, lastName } = settings.profile;
    return [firstName, lastName].filter(Boolean).join(' ') || institutionalId;
  }, [institutionalId, settings.profile]);

  return {
    email,
    institutionalId,
    settings,
    displayName,
    saveStatus,
    saveMessage,
    clearStatus,
    saveProfile,
    updateNotificationPref,
    saveAllNotifications,
  };
}
