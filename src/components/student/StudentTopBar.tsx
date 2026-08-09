import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

type StudentTopBarProps = {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
};

const StudentTopBar = memo(({
  title,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search exams or results...',
}: StudentTopBarProps) => (
  <header className="hidden md:flex shrink-0 h-20 bg-transparent items-center justify-between px-6 lg:px-8 sticky top-0 z-20">
    <h1 className="text-student-headline-md font-student text-student-on-surface">{title}</h1>

    <div className="flex items-center gap-6">
      <div className="relative w-64 group">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-student-outline text-[20px] pointer-events-none group-focus-within:text-student-primary transition-colors"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-student-surface border border-student-outline-variant rounded-full py-2 pl-10 pr-4 text-sm font-student text-student-on-surface placeholder:text-student-outline focus:outline-none focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-all"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/student/notifications"
          className="p-2 rounded-full text-student-on-surface-variant hover:bg-student-surface-container-highest/50 transition-colors flex items-center justify-center"
          aria-label="Notifications"
        >
          <Icon name="notifications" className="text-[24px]" />
        </Link>
        <Link
          to="/student/documentation"
          className="p-2 rounded-full text-student-on-surface-variant hover:bg-student-surface-container-highest/50 transition-colors"
          aria-label="Help"
        >
          <Icon name="help" className="text-[24px]" />
        </Link>
      </div>
    </div>
  </header>
));

StudentTopBar.displayName = 'StudentTopBar';

export default StudentTopBar;
