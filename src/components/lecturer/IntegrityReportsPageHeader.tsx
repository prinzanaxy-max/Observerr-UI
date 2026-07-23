import { memo } from 'react';
import Icon from '../student/Icon';

type IntegrityReportsPageHeaderProps = {
  initials: string;
  onGoLive: () => void;
};

const IntegrityReportsPageHeader = memo(({ initials, onGoLive }: IntegrityReportsPageHeaderProps) => (
  <header className="hidden md:flex shrink-0 justify-end items-center h-16 px-8 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 z-20">
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onGoLive}
        className="text-student-primary font-student text-student-headline-sm font-semibold hover:bg-student-surface-container-high px-4 py-2 rounded-full transition-colors flex items-center gap-2"
      >
        <Icon name="videocam" filled />
        Go Live
      </button>

      <button
        type="button"
        className="p-2 text-student-on-surface-variant hover:text-student-primary transition-colors hover:bg-student-surface-container rounded-full"
        aria-label="Notifications"
      >
        <Icon name="notifications" />
      </button>

      <button
        type="button"
        className="p-2 text-student-on-surface-variant hover:text-student-primary transition-colors hover:bg-student-surface-container rounded-full"
        aria-label="Account"
      >
        <Icon name="account_circle" />
      </button>

      <div
        className="w-8 h-8 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold border border-student-outline-variant ml-1"
        aria-hidden="true"
      >
        {initials}
      </div>
    </div>
  </header>
));

IntegrityReportsPageHeader.displayName = 'IntegrityReportsPageHeader';

export default IntegrityReportsPageHeader;
