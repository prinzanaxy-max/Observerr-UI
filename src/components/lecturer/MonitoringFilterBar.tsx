import { memo } from 'react';
import Icon from '../student/Icon';
import type { RiskFilter } from '../../data/liveMonitoringData';
import { RISK_FILTER_COUNTS } from '../../data/liveMonitoringData';

const FILTERS: { id: RiskFilter; label: string; style: string }[] = [
  { id: 'all', label: 'All Active', style: 'bg-student-primary text-student-on-primary' },
  { id: 'high', label: 'High Risk', style: 'border-2 border-student-error text-student-error bg-transparent' },
  { id: 'medium', label: 'Medium Risk', style: 'border-2 border-amber-500 text-amber-700 bg-transparent' },
  { id: 'low', label: 'Low Risk', style: 'border-2 border-student-outline-variant text-student-on-surface-variant bg-transparent' },
];

type MonitoringFilterBarProps = {
  activeFilter: RiskFilter;
  searchQuery: string;
  onFilterChange: (filter: RiskFilter) => void;
  onSearchChange: (value: string) => void;
};

const MonitoringFilterBar = memo(({
  activeFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: MonitoringFilterBarProps) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full text-student-body-md font-student font-semibold transition-all ${
              isActive ? filter.style : 'border-2 border-student-outline-variant/50 text-student-on-surface-variant hover:border-student-primary/40'
            }`}
          >
            {filter.label} ({RISK_FILTER_COUNTS[filter.id]})
          </button>
        );
      })}
    </div>

    <div className="relative w-full lg:w-64">
      <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-outline pointer-events-none" />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-student-surface border border-student-outline-variant rounded-full py-2 pl-10 pr-4 text-student-body-md font-student focus:outline-none focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-all"
        placeholder="Search student..."
        aria-label="Search student"
      />
    </div>
  </div>
));

MonitoringFilterBar.displayName = 'MonitoringFilterBar';

export default MonitoringFilterBar;
