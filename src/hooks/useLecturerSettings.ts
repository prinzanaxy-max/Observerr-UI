import { useCallback, useEffect, useState } from 'react';
import type { NotificationPreferences } from '../data/studentSettingsData';
import {
  getDefaultLecturerSettings,
  type StoredLecturerSettings,
} from '../data/lecturerSettingsData';
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '../services/notificationService';
import { useAuthProfile } from './useAuthProfile';

const storageKey = (institutionalId: string) => `observerr:lecturer-settings:${institutionalId}`;

const readStoredSettings = (institutionalId: string): StoredLecturerSettings => {
  if (!institutionalId || institutionalId === '—') {
    return getDefaultLecturerSettings();
  }

  try {
    const raw = localStorage.getItem(storageKey(institutionalId));
    if (!raw) return getDefaultLecturerSettings();
    const parsed = JSON.parse(raw) as Partial<StoredLecturerSettings>;
    const defaults = getDefaultLecturerSettings();
    return {
      notifications: { ...defaults.notifications, ...parsed.notifications },
    };
  } catch {
    return getDefaultLecturerSettings();
  }
};

export type SaveStatus = 'idle' | 'success' | 'error';

export function useLecturerSettings() {
  const { institutionalId } = useAuthProfile();
  const [settings, setSettings] = useState<StoredLecturerSettings>(() =>
    readStoredSettings(institutionalId),
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setSettings(readStoredSettings(institutionalId));
  }, [institutionalId]);

  useEffect(() => {
    let cancelled = false;
    void fetchNotificationPreferences()
      .then((notifications) => {
        if (!cancelled) setSettings({ notifications });
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
      const next: StoredLecturerSettings = {
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
        setSettings({ notifications: saved });
        showSuccess('Notification preferences saved.');
        return true;
      } catch {
        setSaveStatus('error');
        setSaveMessage('Could not save notification preferences. Please try again.');
        return false;
      }
    },
    [clearStatus, showSuccess],
  );

  return {
    settings,
    saveStatus,
    saveMessage,
    clearStatus,
    updateNotificationPref,
    saveAllNotifications,
  };
}
