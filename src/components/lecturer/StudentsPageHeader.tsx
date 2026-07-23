import { memo } from 'react';
import Icon from '../student/Icon';
import { COURSE_FILTERS } from '../../data/lecturerStudentsData';

type StudentsPageHeaderProps = {
  initials: string;
  searchQuery: string;
  courseFilter: string;
  onSearchChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onGoLive: () => void;
};

const StudentsPageHeader = memo(({
  initials,
  searchQuery,
  courseFilter,
  onSearchChange,
  onCourseChange,
  onGoLive,
}: StudentsPageHeaderProps) => (
  <header className="hidden md:flex shrink-0 justify-between items-center h-16 px-8 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 z-20 gap-4">
    <h2 className="text-student-headline-md font-student font-semibold text-student-primary shrink-0">Students</h2>

    <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
      <div className="relative w-48 lg:w-64 hidden sm:block">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-student-surface-container-lowest border border-student-outline-variant rounded-full text-student-body-md font-student focus:outline-none focus:ring-2 focus:ring-student-primary/20 focus:border-student-primary transition-all"
          placeholder="Search students..."
          aria-label="Search students"
        />
      </div>

      <div className="relative hidden lg:block">
        <select
          value={courseFilter}
          onChange={(e) => onCourseChange(e.target.value)}
          className="appearance-none bg-student-surface-container-lowest border border-student-outline-variant rounded-full py-2 pl-4 pr-10 text-student-body-md font-student text-student-on-surface focus:outline-none focus:border-student-primary focus:ring-1 focus:ring-student-primary transition-colors cursor-pointer"
          aria-label="Filter by course"
        >
          {COURSE_FILTERS.map((course) => (
            <option key={course.value} value={course.value}>{course.label}</option>
          ))}
        </select>
        <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-student-outline pointer-events-none" />
      </div>

      <button
        type="button"
        onClick={onGoLive}
        className="hidden sm:flex px-5 py-2 bg-gradient-to-r from-student-primary-fixed to-student-secondary-fixed text-student-on-primary-fixed rounded-full font-student font-bold text-student-label-md uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_10px_rgba(133,220,87,0.2)] items-center gap-2 shrink-0"
      >
        Go Live
      </button>

      <div className="flex items-center gap-3 sm:gap-4 border-l border-student-surface-variant pl-4 shrink-0">
        <button type="button" className="relative text-student-on-surface-variant hover:text-student-primary transition-colors p-1" aria-label="Notifications">
          <Icon name="notifications" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-student-error rounded-full" />
        </button>
        <div
          className="w-8 h-8 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold border border-student-outline-variant"
          aria-hidden="true"
        >
          {initials}
        </div>
      </div>
    </div>
  </header>
));

StudentsPageHeader.displayName = 'StudentsPageHeader';

export default StudentsPageHeader;
