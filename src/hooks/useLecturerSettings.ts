import { useCallback, useEffect, useState } from 'react';
import type { NotificationPreferences } from './studentSettingsData';
import {
  getDefaultLecturerSettings,
  type StoredLecturerSettings,
} from '../data/lecturerSettingsData';
import { notifyStudentSettingsChanged, STUDENT_SETTINGS_CHANGED } from '../lib/studentSettingsEvents';
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

const writeStoredSettings = (institutionalId: string, settings: StoredLecturerSettings) => {
  if (!institutionalId || institutionalId === '—') return;
  localStorage.setItem(storageKey(institutionalId), JSON.stringify(settings));
  notifyStudentSettingsChanged(institutionalId);
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
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ institutionalId: string }>).detail;
      if (detail?.institutionalId === institutionalId) {
        setSettings(readStoredSettings(institutionalId));
      }
    };
    window.addEventListener(STUDENT_SETTINGS_CHANGED, handler);
    return () => window.removeEventListener(STUDENT_SETTINGS_CHANGED, handler);
  }, [institutionalId]);

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
      writeStoredSettings(institutionalId, next);
      setSettings(next);
      showSuccess('Notification preferences updated.');
    },
    [clearStatus, institutionalId, settings, showSuccess],
  );

  const saveAllNotifications = useCallback(
    async (notifications: NotificationPreferences) => {
      clearStatus();
      const next: StoredLecturerSettings = { ...settings, notifications };
      writeStoredSettings(institutionalId, next);
      setSettings(next);
      await new Promise((resolve) => setTimeout(resolve, 300));
      showSuccess('Notification preferences saved.');
      return true;
    },
    [clearStatus, institutionalId, settings, showSuccess],
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
