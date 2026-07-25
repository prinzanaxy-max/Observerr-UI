import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getDefaultSettings,
  type NotificationPreferences,
  type StoredStudentSettings,
} from '../data/studentSettingsData';
import { notifyStudentSettingsChanged, STUDENT_SETTINGS_CHANGED } from '../lib/studentSettingsEvents';
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
  notifyStudentSettingsChanged(institutionalId);
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

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ institutionalId: string }>).detail;
      if (detail?.institutionalId === institutionalId) {
        setSettings(readStoredSettings(institutionalId, email));
      }
    };
    window.addEventListener(STUDENT_SETTINGS_CHANGED, handler);
    return () => window.removeEventListener(STUDENT_SETTINGS_CHANGED, handler);
  }, [institutionalId, email]);

  const clearStatus = useCallback(() => {
    setSaveStatus('idle');
    setSaveMessage('');
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSaveStatus('success');
    setSaveMessage(message);
  }, []);

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
    updateNotificationPref,
    saveAllNotifications,
  };
}
