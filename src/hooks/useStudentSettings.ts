import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getDefaultSettings,
  type NotificationPreferences,
  type StoredStudentSettings,
} from '../data/studentSettingsData';
import { STUDENT_SETTINGS_CHANGED } from '../lib/studentSettingsEvents';
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '../services/notificationService';
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
    let cancelled = false;
    void fetchNotificationPreferences()
      .then((notifications) => {
        if (!cancelled) {
          setSettings((current) => ({ ...current, notifications }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSaveStatus('error');
          setSaveMessage('Could not load notification preferences.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ institutionalId: string }>).detail;
      if (detail?.institutionalId === institutionalId) {
        setSettings((current) => ({
          ...readStoredSettings(institutionalId, email),
          notifications: current.notifications,
        }));
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
      setSettings(next);
    },
    [clearStatus, settings],
  );

  const saveAllNotifications = useCallback(
    async (notifications: NotificationPreferences) => {
      clearStatus();
      try {
        const saved = await updateNotificationPreferences(notifications);
        const next: StoredStudentSettings = { ...settings, notifications: saved };
        setSettings(next);
        showSuccess('Notification preferences saved.');
        return true;
      } catch {
        setSaveStatus('error');
        setSaveMessage('Could not save notification preferences. Please try again.');
        return false;
      }
    },
    [clearStatus, settings, showSuccess],
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
