import { memo, useRef } from 'react';
import Icon from '../student/Icon';

type CustomDateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

const CustomDateTimeInput = memo(({
  value,
  onChange,
  id,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: CustomDateTimeInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`flex items-center gap-2 bg-student-surface border border-student-outline-variant rounded-full px-4 py-2 cursor-pointer hover:border-student-primary/50 focus-within:ring-2 focus-within:ring-student-primary/20 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <Icon
        name="schedule"
        className="text-student-outline shrink-0 pointer-events-none text-[18px]"
      />
      <input
        ref={inputRef}
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className="flex-1 bg-transparent outline-none text-student-body-md font-student text-student-on-surface cursor-pointer min-w-0"
      />
    </div>
  );
});

CustomDateTimeInput.displayName = 'CustomDateTimeInput';

export default CustomDateTimeInput;
