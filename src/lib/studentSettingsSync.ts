import {
  getDefaultSettings,
  type StoredStudentSettings,
} from '../data/studentSettingsData';
import { notifyStudentSettingsChanged } from '../lib/studentSettingsEvents';

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

/** Keep avatar/local prefs in sync when account names are updated via API. */
export function syncProfileNamesToLocalSettings(
  institutionalId: string,
  email: string,
  firstName: string,
  lastName: string,
) {
  if (!institutionalId || institutionalId === '—') return;

  const current = readStoredSettings(institutionalId, email);
  const next: StoredStudentSettings = {
    ...current,
    profile: {
      ...current.profile,
      firstName,
      lastName,
    },
  };

  localStorage.setItem(storageKey(institutionalId), JSON.stringify(next));
  notifyStudentSettingsChanged(institutionalId);
}
