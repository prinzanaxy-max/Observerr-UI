import { memo } from 'react';
import Icon from '../student/Icon';
import type { ExamFilterTab } from '../../data/lecturerExamsData';

const TABS: { id: ExamFilterTab; label: string }[] = [
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

type ExamsFilterBarProps = {
  activeTab: ExamFilterTab;
  searchQuery: string;
  onTabChange: (tab: ExamFilterTab) => void;
  onSearchChange: (value: string) => void;
};

const ExamsFilterBar = memo(({ activeTab, searchQuery, onTabChange, onSearchChange }: ExamsFilterBarProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
    <div className="flex bg-student-surface-container-high p-1 rounded-xl w-full md:w-auto">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 md:w-auto px-6 py-2 rounded-lg font-student text-student-body-md transition-all ${
            activeTab === tab.id
              ? 'bg-student-surface text-student-primary font-semibold lecturer-card-elevation'
              : 'text-student-on-surface-variant hover:text-student-on-surface'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    <div className="relative w-full md:w-64">
      <Icon
        name="search"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-student-outline pointer-events-none"
      />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-student-surface border border-student-outline-variant rounded-xl pl-10 pr-4 py-2 font-student text-student-body-md text-student-on-surface focus:outline-none focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-all"
        placeholder="Search exams..."
        aria-label="Search exams"
      />
    </div>
  </div>
));

ExamsFilterBar.displayName = 'ExamsFilterBar';

export default ExamsFilterBar;
