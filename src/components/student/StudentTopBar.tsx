import { memo } from 'react';
import Icon from './Icon';

type StudentTopBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

const StudentTopBar = memo(({ searchQuery, onSearchChange }: StudentTopBarProps) => (
  <header className="shrink-0 h-20 bg-student-surface-container-lowest/80 backdrop-blur-md border-b border-student-surface-variant/30 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
    <h1 className="text-student-headline-md font-student text-student-on-background">Dashboard</h1>

    <div className="flex items-center gap-4 sm:gap-6">
      <div className="relative hidden sm:block w-64">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-student-outline text-[20px] pointer-events-none"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-student-surface border border-student-outline-variant rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-all"
          placeholder="Search exams or results..."
          aria-label="Search exams or results"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative text-student-on-surface-variant hover:text-student-primary transition-colors p-1"
          aria-label="Notifications"
        >
          <Icon name="notifications" className="text-[24px]" />
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-student-error rounded-full border-2 border-student-surface-container-lowest" />
        </button>
        <button
          type="button"
          className="text-student-on-surface-variant hover:text-student-primary transition-colors p-1"
          aria-label="Settings"
        >
          <Icon name="settings" className="text-[24px]" />
        </button>
      </div>
    </div>
  </header>
));

StudentTopBar.displayName = 'StudentTopBar';

export default StudentTopBar;
