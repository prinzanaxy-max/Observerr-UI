import { memo, type InputHTMLAttributes } from 'react';
import Icon from '../Icon';

type SettingsFieldProps = {
  label: string;
  icon?: string;
  hint?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const SettingsField = memo(({
  label,
  icon,
  hint,
  error,
  className = '',
  id,
  ...inputProps
}: SettingsFieldProps) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="text-student-label-md font-student text-student-on-surface">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none"
          />
        )}
        <input
          id={fieldId}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-lg border border-student-outline-variant bg-student-surface focus:border-student-primary focus:ring-1 focus:ring-student-primary outline-none transition-all text-student-body-md font-student text-student-on-surface disabled:bg-student-surface-container-low disabled:text-student-on-surface-variant disabled:cursor-not-allowed disabled:opacity-70 ${error ? 'border-student-error focus:border-student-error focus:ring-student-error' : ''} ${className}`}
          {...inputProps}
        />
      </div>
      {hint && !error && (
        <p className="text-student-label-md font-student text-student-on-surface-variant">{hint}</p>
      )}
      {error && (
        <p className="text-student-label-md font-student text-student-error">{error}</p>
      )}
    </div>
  );
});

SettingsField.displayName = 'SettingsField';

export default SettingsField;
