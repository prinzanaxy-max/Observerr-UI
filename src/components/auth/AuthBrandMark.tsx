import { memo, type ReactNode } from 'react';
import Icon from '../student/Icon';
import ObserverrLogo from '../ObserverrLogo';

type AuthBrandMarkProps = {
  variant?: 'compact' | 'display';
};

const AuthBrandMark = memo(({ variant = 'compact' }: AuthBrandMarkProps) => {
  if (variant === 'display') {
    return (
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-student-display-lg font-student text-student-primary mb-2 tracking-tight">OBSERVERR</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-student-primary/10 shrink-0">
        <ObserverrLogo className="w-8 h-8" />
      </div>
      <span className="text-student-headline-md font-student font-bold text-student-primary tracking-tight">
        OBSERVERR
      </span>
    </div>
  );
});

AuthBrandMark.displayName = 'AuthBrandMark';

type AuthFieldProps = {
  id: string;
  label: ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: string;
  autoComplete?: string;
  rightSlot?: ReactNode;
};

export const AuthField = memo(({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  icon,
  autoComplete,
  rightSlot,
}: AuthFieldProps) => (
  <div>
    {label !== '' && (
      typeof label === 'string' ? (
        <label htmlFor={id} className="block text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider mb-1">
          {label}
        </label>
      ) : (
        label
      )
    )}
    <div className="relative">
      <Icon
        name={icon}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-student-outline-variant pointer-events-none"
      />
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-student-surface-container-lowest border rounded-xl py-3 pl-10 pr-4 font-student text-student-body-md text-student-on-surface placeholder:text-student-outline focus:outline-none focus:ring-2 focus:ring-student-primary focus:border-student-primary transition-colors ${
          rightSlot ? 'pr-10' : ''
        } ${error ? 'border-student-error' : 'border-student-outline'}`}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
    {error && (
      <p className="mt-1.5 text-student-error text-student-label-md font-student flex items-center gap-1">
        <Icon name="error" className="text-sm" />
        {error}
      </p>
    )}
  </div>
));

AuthField.displayName = 'AuthField';

export default AuthBrandMark;
