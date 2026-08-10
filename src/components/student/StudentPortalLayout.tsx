import { memo, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthProfile } from '../../hooks/useAuthProfile';
import { getStudentActiveNav } from '../../data/studentPortalNav';
import ObserverrLogo from '../ObserverrLogo';
import StudentSidebar from './StudentSidebar';
import StudentTopBar from './StudentTopBar';
import MobileBottomNav from './MobileBottomNav';
import StudentAvatar from './StudentAvatar';

type StudentPortalLayoutProps = {
  children: ReactNode;
  title?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  contentClassName?: string;
  header?: ReactNode;
};

const StudentPortalLayout = memo(({
  children,
  title = '',
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search exams or results...',
  contentClassName = '',
  header,
}: StudentPortalLayoutProps) => {
  const { institutionalId, email, initials, profilePictureUrl } = useAuthProfile();
  const { pathname } = useLocation();
  const activeNav = getStudentActiveNav(pathname);

  return (
    <div className="student-dashboard student-portal h-dvh flex overflow-hidden antialiased">
      <StudentSidebar
        activeNav={activeNav}
        institutionalId={institutionalId}
        email={email}
        initials={initials}
        avatarUrl={profilePictureUrl}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="md:hidden shrink-0 h-16 flex items-center justify-between px-4 border-b border-student-surface-variant/50 bg-student-surface-container-lowest">
          <Link to="/student" className="flex items-center gap-2.5 min-w-0">
            <ObserverrLogo className="h-7 w-7 shrink-0" />
            <span className="text-student-headline-sm font-student text-student-primary tracking-tight truncate">
              OBSERVERR
            </span>
          </Link>
          <Link to="/student/profile" aria-label="View profile">
            <StudentAvatar src={profilePictureUrl} initials={initials} size="xs" />
          </Link>
        </div>

        {header ?? <StudentTopBar />}

        <main className={`flex-1 min-h-0 overflow-y-auto overscroll-contain student-hide-scrollbar ${contentClassName}`}>
          {children}
        </main>

        <MobileBottomNav activeNav={activeNav} />
      </div>
    </div>
  );
});

StudentPortalLayout.displayName = 'StudentPortalLayout';

export default StudentPortalLayout;
