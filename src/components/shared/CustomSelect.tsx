import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../student/Icon';

export type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

const CustomSelect = memo(({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const select = useCallback((val: string) => {
    onChange(val);
    close();
  }, [onChange, close]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, close]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (activeIndex >= 0) {
        select(options[activeIndex].value);
      }
    } else if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [disabled, isOpen, activeIndex, options, select, close]);

  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-student-surface border border-student-outline-variant rounded-full text-student-body-md font-student text-student-on-surface hover:border-student-primary/50 focus:outline-none focus:ring-2 focus:ring-student-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="truncate">{selectedLabel}</span>
        <Icon
          name="expand_more"
          className={`shrink-0 text-student-outline transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full mt-1 z-50 bg-student-surface border border-student-outline-variant/30 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => select(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-4 py-2.5 cursor-pointer text-student-body-md font-student transition-colors ${
                  isSelected
                    ? 'text-student-primary font-semibold bg-student-primary-container/10'
                    : isActive
                      ? 'bg-student-surface-container-high text-student-on-surface'
                      : 'text-student-on-surface hover:bg-student-surface-container-high'
                } first:rounded-t-2xl last:rounded-b-2xl`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
