import { memo } from 'react';
import Icon from '../student/Icon';
import type { DateRangeKey } from '../../data/integrityReportsData';
import { DATE_RANGE_OPTIONS } from '../../data/integrityReportsData';

type AnalyticsDateRangeFilterProps = {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
};

const AnalyticsDateRangeFilter = memo(({ value, onChange }: AnalyticsDateRangeFilterProps) => (
  <div
    className="flex items-center bg-student-surface rounded-full p-1 shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-student-surface-variant/30 shrink-0"
    role="group"
    aria-label="Date range"
  >
    {DATE_RANGE_OPTIONS.filter((option) => option.key !== 'custom').map((option) => (
      <button
        key={option.key}
        type="button"
        onClick={() => onChange(option.key)}
        className={`px-4 py-2 rounded-full font-student text-student-label-md transition-colors ${
          value === option.key
            ? 'bg-student-primary text-student-on-primary shadow-sm font-medium'
            : 'text-student-on-surface-variant hover:bg-student-surface-container'
        }`}
        aria-pressed={value === option.key}
      >
        {option.label}
      </button>
    ))}
    <div className="w-px h-4 bg-student-surface-variant mx-1 hidden sm:block" aria-hidden="true" />
    <button
      type="button"
      onClick={() => onChange('custom')}
      className={`px-4 py-2 rounded-full font-student text-student-label-md flex items-center gap-2 transition-colors ${
        value === 'custom'
          ? 'bg-student-primary text-student-on-primary shadow-sm font-medium'
          : 'text-student-on-surface-variant hover:bg-student-surface-container'
      }`}
      aria-pressed={value === 'custom'}
    >
      <Icon name="calendar_month" className="text-[18px]" />
      <span className="hidden sm:inline">Custom</span>
    </button>
  </div>
));

AnalyticsDateRangeFilter.displayName = 'AnalyticsDateRangeFilter';

export default AnalyticsDateRangeFilter;
