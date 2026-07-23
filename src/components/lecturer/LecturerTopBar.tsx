import { memo } from 'react';
import Icon from '../student/Icon';

type LecturerTopBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewExam: () => void;
};

const LecturerTopBar = memo(({ searchQuery, onSearchChange, onNewExam }: LecturerTopBarProps) => (
  <header className="shrink-0 min-h-16 bg-student-surface/80 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 sm:px-6 py-3 sticky top-0 z-20 border-b border-student-outline-variant/20">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 min-w-0">
      <h2 className="text-student-headline-md font-student font-bold text-student-primary shrink-0">Dashboard</h2>
      <div className="relative w-full sm:w-72 lg:w-96">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-student-surface-container-low border border-student-outline/20 rounded-full py-2 pl-10 pr-4 text-student-body-md font-student focus:outline-none focus:ring-2 focus:ring-student-primary/30 transition-all"
          placeholder="Search exams, students, or flags..."
          aria-label="Search exams, students, or flags"
        />
      </div>
    </div>

    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
      <button
        type="button"
        className="relative hover:bg-student-surface-container rounded-full p-2 transition-colors"
        aria-label="Notifications"
      >
        <Icon name="notifications" className="text-student-on-surface-variant" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-student-error rounded-full" />
      </button>
      <button
        type="button"
        onClick={onNewExam}
        className="lecturer-gradient-brand px-5 sm:px-6 py-2 rounded-full text-student-on-primary-fixed font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm text-sm sm:text-base"
      >
        <Icon name="add" />
        New Exam
      </button>
    </div>
  </header>
));

LecturerTopBar.displayName = 'LecturerTopBar';

export default LecturerTopBar;
