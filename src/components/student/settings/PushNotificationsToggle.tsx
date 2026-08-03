import { memo, useCallback } from 'react';
import Icon from '../Icon';
import type { PushPermissionStatus } from '../../../types/pushNotifications';

type PushNotificationsToggleProps = {
  status: PushPermissionStatus;
  pushEnabled: boolean;
  errorMessage: string;
  onEnable: () => Promise<boolean>;
  onDisable: () => void;
};

const statusLabel: Record<PushPermissionStatus, string> = {
  idle: 'Receive alerts in this browser even when Observerr is in the background.',
  requesting: 'Waiting for browser permission…',
  granted: 'Push notifications are enabled for this browser.',
  denied: 'Notifications are blocked — enable them in your browser settings.',
  error: 'Could not enable push notifications.',
  unsupported: 'This browser does not support push notifications.',
  unconfigured:
    'Push is not configured yet. Set VITE_FIREBASE_* (and VAPID) in the frontend env, and FIREBASE_SERVICE_ACCOUNT_JSON on the API.',
};

const PushNotificationsToggle = memo(({
  status,
  pushEnabled,
  errorMessage,
  onEnable,
  onDisable,
}: PushNotificationsToggleProps) => {
  const isOn = pushEnabled && status === 'granted';
  const isLoading = status === 'requesting';
  const isDisabled = status === 'unsupported' || status === 'unconfigured' || isLoading;

  const handleToggle = useCallback(() => {
    if (isOn) {
      onDisable();
      return;
    }
    void onEnable();
  }, [isOn, onDisable, onEnable]);

  const helperText = errorMessage || statusLabel[status];

  return (
    <li className="flex items-start justify-between gap-4 p-4 rounded-xl border border-student-primary/20 bg-student-primary-container/5">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="notifications_active" className="text-student-primary shrink-0" />
          <p className="text-student-body-lg font-student font-medium text-student-on-surface">
            Enable push notifications
          </p>
        </div>
        <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">
          Get browser alerts for exam reminders, grades, and system updates.
        </p>
        <p
          className={`text-student-label-md font-student mt-2 ${
            status === 'denied' || status === 'error' ? 'text-student-error' : 'text-student-on-surface-variant'
          }`}
        >
          {helperText}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-busy={isLoading}
        disabled={isDisabled}
        onClick={handleToggle}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isOn ? 'bg-student-primary' : 'bg-student-outline-variant/60'
        }`}
      >
        {isLoading ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="auth-spinner scale-75" />
          </span>
        ) : (
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              isOn ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        )}
      </button>
    </li>
  );
});

PushNotificationsToggle.displayName = 'PushNotificationsToggle';

export default PushNotificationsToggle;
