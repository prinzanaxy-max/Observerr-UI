import { memo, useRef } from 'react';
import Icon from '../student/Icon';

type CustomDateInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

const CustomDateInput = memo(({
  value,
  onChange,
  id,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: CustomDateInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`flex items-center gap-2 bg-student-surface border border-student-outline-variant rounded-full px-4 py-2 cursor-pointer hover:border-student-primary/50 focus-within:ring-2 focus-within:ring-student-primary/20 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <Icon
        name="calendar_today"
        className="text-student-outline shrink-0 pointer-events-none text-[18px]"
      />
      <input
        ref={inputRef}
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className="flex-1 bg-transparent outline-none text-student-body-md font-student text-student-on-surface cursor-pointer min-w-0"
      />
    </div>
  );
});

CustomDateInput.displayName = 'CustomDateInput';

export default CustomDateInput;
