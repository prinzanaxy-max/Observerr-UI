import { memo } from 'react';
import type { ExamListTab } from '../../data/studentExamsData';

type ExamsTabControlProps = {
  activeTab: ExamListTab;
  onTabChange: (tab: ExamListTab) => void;
};

const ExamsTabControl = memo(({ activeTab, onTabChange }: ExamsTabControlProps) => (
  <div
    className="flex items-center bg-student-surface-container-low p-1 rounded-full w-fit mb-8 shadow-sm"
    role="tablist"
    aria-label="Exam list filter"
  >
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === 'upcoming'}
      onClick={() => onTabChange('upcoming')}
      className={`px-6 py-2 rounded-full font-student text-student-label-md font-bold transition-all ${
        activeTab === 'upcoming'
          ? 'bg-student-surface-container-lowest text-student-primary shadow-[0px_4px_10px_rgba(0,0,0,0.05)]'
          : 'text-student-on-surface-variant hover:bg-student-surface-container-highest/30'
      }`}
    >
      Upcoming
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === 'completed'}
      onClick={() => onTabChange('completed')}
      className={`px-6 py-2 rounded-full font-student text-student-label-md font-bold transition-all ${
        activeTab === 'completed'
          ? 'bg-student-surface-container-lowest text-student-primary shadow-[0px_4px_10px_rgba(0,0,0,0.05)]'
          : 'text-student-on-surface-variant hover:bg-student-surface-container-highest/30'
      }`}
    >
      Completed
    </button>
  </div>
));

ExamsTabControl.displayName = 'ExamsTabControl';

export default ExamsTabControl;
