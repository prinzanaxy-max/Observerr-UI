import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../student/Icon';

type ExamsPageHeaderProps = {
  initials: string;
  onGoLive: () => void;
};

const ExamsPageHeader = memo(({ initials, onGoLive }: ExamsPageHeaderProps) => (
  <header className="hidden md:flex shrink-0 justify-between items-center h-16 px-8 bg-student-surface/80 backdrop-blur-md border-b border-transparent z-20">
    <div className="text-student-headline-md font-student font-semibold text-student-on-surface">Exams Overview</div>
    <div className="flex items-center gap-4">
      <Link
        to="/lecturer/settings"
        className="text-student-on-surface-variant hover:text-student-primary transition-colors focus:ring-2 focus:ring-student-primary/20 rounded-full p-2"
        aria-label="Notification settings"
      >
        <Icon name="notifications" />
      </Link>
      <button
        type="button"
        onClick={onGoLive}
        className="px-4 py-2 rounded-full bg-student-error-container text-student-on-error-container text-student-label-md font-student font-bold hover:bg-student-error/20 transition-colors"
      >
        Go Live
      </button>
      <div
        className="w-8 h-8 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold border-2 border-student-surface-variant"
        aria-hidden="true"
      >
        {initials}
      </div>
    </div>
  </header>
));

ExamsPageHeader.displayName = 'ExamsPageHeader';

export default ExamsPageHeader;
