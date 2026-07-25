import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import StudentAvatar from '../StudentAvatar';
import { useAuthProfile } from '../../../hooks/useAuthProfile';
import { useStudentSettings } from '../../../hooks/useStudentSettings';

type ResultDetailHeaderProps = {
  title: string;
  completedLabel: string;
  integrityScore: number;
};

const ResultDetailHeader = memo(({ title, completedLabel, integrityScore }: ResultDetailHeaderProps) => {
  const { initials } = useAuthProfile();
  const { avatarUrl } = useStudentSettings();

  return (
    <header className="shrink-0 bg-transparent border-b border-student-outline-variant/20 px-4 sm:px-6 md:px-8 py-4 sticky top-0 z-30 backdrop-blur-md bg-student-surface-bright/80">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/student/results"
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-student-surface-container-high transition-colors text-student-on-surface"
            aria-label="Back to results"
          >
            <Icon name="arrow_back" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-student-headline-md font-student text-student-on-background font-bold truncate">{title}</h1>
            <span className="text-student-body-md font-student text-student-on-surface-variant flex items-center gap-1">
              <Icon name="calendar_month" className="text-[18px]" />
              {completedLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="bg-student-primary-container text-student-on-primary-container px-5 sm:px-6 py-2 rounded-full flex items-center gap-2 shadow-[0_4px_14px_0_rgba(140,227,93,0.39)]">
            <Icon name="verified_user" filled className="text-[20px]" />
            <span className="text-student-headline-sm font-student font-semibold">{integrityScore}% Integrity</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button type="button" className="w-10 h-10 rounded-full hover:bg-student-surface-container-highest/50 flex items-center justify-center transition-colors relative text-student-primary" aria-label="Notifications">
              <Icon name="notifications" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-student-error rounded-full border-2 border-student-surface" />
            </button>
            <button type="button" className="w-10 h-10 rounded-full hover:bg-student-surface-container-highest/50 flex items-center justify-center transition-colors text-student-primary" aria-label="Help">
              <Icon name="help" />
            </button>
            <Link to="/student/profile" aria-label="View profile">
              <StudentAvatar src={avatarUrl} initials={initials} size="sm" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
});

ResultDetailHeader.displayName = 'ResultDetailHeader';

export default ResultDetailHeader;
