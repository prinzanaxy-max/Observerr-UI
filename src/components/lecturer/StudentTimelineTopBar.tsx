import { memo } from 'react';
import Icon from '../student/Icon';

type StudentTimelineTopBarProps = {
  initials: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

const StudentTimelineTopBar = memo(({ initials, searchQuery, onSearchChange }: StudentTimelineTopBarProps) => (
  <header className="hidden md:flex shrink-0 justify-between items-center h-16 px-8 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 z-20">
    <div className="relative w-64">
      <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-student-surface-container-lowest border border-student-outline-variant rounded-full text-student-body-md font-student focus:outline-none focus:ring-2 focus:ring-student-primary/20 focus:border-student-primary transition-all"
        placeholder="Search..."
        aria-label="Search timeline"
      />
    </div>

    <div className="flex items-center gap-4 sm:gap-6">
      <button
        type="button"
        className="px-5 sm:px-6 py-2 bg-student-error-container text-student-on-error-container rounded-full font-student font-bold text-student-body-md hover:bg-student-error hover:text-student-on-error transition-colors flex items-center gap-2"
      >
        <Icon name="radio_button_checked" filled className="text-[18px]" />
        Go Live
      </button>
      <button type="button" className="text-student-on-surface-variant hover:text-student-primary transition-colors p-1" aria-label="Notifications">
        <Icon name="notifications" />
      </button>
      <button type="button" className="text-student-on-surface-variant hover:text-student-primary transition-colors p-1" aria-label="Account">
        <Icon name="account_circle" />
      </button>
      <div
        className="w-8 h-8 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold border border-student-outline-variant"
        aria-hidden="true"
      >
        {initials}
      </div>
    </div>
  </header>
));

StudentTimelineTopBar.displayName = 'StudentTimelineTopBar';

export default StudentTimelineTopBar;
