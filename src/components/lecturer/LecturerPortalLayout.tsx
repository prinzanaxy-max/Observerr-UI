import { memo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ObserverrLogo from '../ObserverrLogo';
import LecturerPortalSidebar from './LecturerPortalSidebar';
import LecturerPortalMobileNav from './LecturerPortalMobileNav';
import StudentAvatar from '../student/StudentAvatar';
import NotificationBellDropdown from '../shared/NotificationBellDropdown';
import { useAuthProfile } from '../../hooks/useAuthProfile';

type LecturerPortalLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  institutionalId: string;
  email?: string;
  initials: string;
  onNewExam?: () => void;
  contentClassName?: string;
};

const LecturerPortalLayout = memo(({
  children,
  header,
  institutionalId,
  email,
  initials,
  onNewExam,
  contentClassName = '',
}: LecturerPortalLayoutProps) => {
  const { profilePictureUrl } = useAuthProfile();

  return (
    <div className="lecturer-dashboard h-dvh flex overflow-hidden antialiased">
      <LecturerPortalSidebar institutionalId={institutionalId} email={email} initials={initials} onNewExam={onNewExam} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="md:hidden shrink-0 h-16 flex items-center justify-between px-4 border-b border-student-outline-variant/50 bg-student-surface">
          <Link to="/lecturer" className="flex items-center gap-2.5 min-w-0">
            <ObserverrLogo className="h-7 w-7 shrink-0" />
            <span className="text-student-headline-sm font-student text-student-primary tracking-tight truncate">
              OBSERVERR
            </span>
          </Link>
        </div>

        {header ?? (
          <header className="hidden md:flex shrink-0 h-16 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 items-center justify-end px-6 gap-4 z-20">
            <NotificationBellDropdown viewAllPath="/lecturer/notifications" />
            <Link to="/lecturer/settings" aria-label="Account settings">
              <StudentAvatar src={profilePictureUrl} initials={initials} size="xs" />
            </Link>
          </header>
        )}

        <main className={`flex-1 min-h-0 overflow-y-auto overscroll-contain ${contentClassName}`}>
          {children}
        </main>

        <LecturerPortalMobileNav />
      </div>
    </div>
  );
});

LecturerPortalLayout.displayName = 'LecturerPortalLayout';

export default LecturerPortalLayout;
