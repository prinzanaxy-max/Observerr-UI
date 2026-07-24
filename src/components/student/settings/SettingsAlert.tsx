import { memo } from 'react';
import Icon from '../Icon';
import type { SaveStatus } from '../../../hooks/useStudentSettings';

type SettingsAlertProps = {
  status: SaveStatus;
  message: string;
  onDismiss: () => void;
};

const SettingsAlert = memo(({ status, message, onDismiss }: SettingsAlertProps) => {
  if (status === 'idle' || !message) return null;

  const isSuccess = status === 'success';

  return (
    <div
      role="status"
      className={`rounded-xl px-4 py-3 flex items-start gap-3 border ${
        isSuccess
          ? 'bg-student-primary-container/15 border-student-primary-container text-student-on-primary-container'
          : 'bg-student-error-container border-student-error/30 text-student-on-error-container'
      }`}
    >
      <Icon
        name={isSuccess ? 'check_circle' : 'error'}
        filled={isSuccess}
        className="shrink-0 mt-0.5"
      />
      <p className="flex-1 text-student-body-md font-student">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
});

SettingsAlert.displayName = 'SettingsAlert';

export default SettingsAlert;
