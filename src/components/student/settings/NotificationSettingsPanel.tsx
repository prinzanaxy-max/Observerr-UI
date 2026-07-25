import { memo, useCallback, useEffect, useState } from 'react';
import { NOTIFICATION_TOGGLES, type NotificationPreferences } from '../../../data/studentSettingsData';
import PushNotificationsToggle from './PushNotificationsToggle';
import type { PushPermissionStatus } from '../../../types/pushNotifications';

type NotificationSettingsPanelProps = {
  preferences: NotificationPreferences;
  saving: boolean;
  onToggle: (key: keyof NotificationPreferences, value: boolean) => void;
  onSaveAll: (preferences: NotificationPreferences) => Promise<boolean>;
  pushStatus: PushPermissionStatus;
  pushEnabled: boolean;
  pushErrorMessage: string;
  onEnablePush: () => Promise<boolean>;
  onDisablePush: () => void;
};

const NotificationSettingsPanel = memo(({
  preferences,
  saving,
  onToggle,
  onSaveAll,
  pushStatus,
  pushEnabled,
  pushErrorMessage,
  onEnablePush,
  onDisablePush,
}: NotificationSettingsPanelProps) => {
  const [draft, setDraft] = useState(preferences);

  useEffect(() => {
    setDraft(preferences);
  }, [preferences]);

  const handleToggle = useCallback((key: keyof NotificationPreferences) => {
    const next = { ...draft, [key]: !draft[key] };
    setDraft(next);
    onToggle(key, next[key]);
  }, [draft, onToggle]);

  const handleSaveAll = useCallback(async () => {
    await onSaveAll(draft);
  }, [draft, onSaveAll]);

  return (
    <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-student-headline-sm font-student text-student-on-surface mb-1">Notification Preferences</h3>
        <p className="text-student-body-md font-student text-student-on-surface-variant">
          Choose which alerts you receive in the portal and by email.
        </p>
      </div>

      <ul className="space-y-4 max-w-2xl">
        <PushNotificationsToggle
          status={pushStatus}
          pushEnabled={pushEnabled}
          errorMessage={pushErrorMessage}
          onEnable={onEnablePush}
          onDisable={onDisablePush}
        />

        {NOTIFICATION_TOGGLES.map((item) => (
          <li
            key={item.key}
            className="flex items-start justify-between gap-4 p-4 rounded-xl border border-student-outline-variant/30 bg-student-surface-container-lowest"
          >
            <div className="min-w-0">
              <p className="text-student-body-lg font-student font-medium text-student-on-surface">{item.label}</p>
              <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">{item.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={draft[item.key]}
              onClick={() => handleToggle(item.key)}
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                draft[item.key] ? 'bg-student-primary' : 'bg-student-outline-variant/60'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  draft[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end pt-6 max-w-2xl">
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSaveAll()}
          className="px-6 py-2.5 rounded-full bg-student-primary text-student-on-primary text-student-body-md font-student font-bold shadow-[0_0_15px_rgba(43,108,0,0.3)] hover:shadow-[0_0_20px_rgba(43,108,0,0.4)] transition-all disabled:opacity-60"
        >
          Save Preferences
        </button>
      </div>
    </section>
  );
});

NotificationSettingsPanel.displayName = 'NotificationSettingsPanel';

export default NotificationSettingsPanel;
