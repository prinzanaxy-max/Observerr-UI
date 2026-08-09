import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ObserverrLogo from '../ObserverrLogo';
import Icon from './Icon';
import LogoutActions from '../auth/LogoutActions';
import StudentAvatar from './StudentAvatar';
import {
  STUDENT_PORTAL_FOOTER_NAV,
  STUDENT_PORTAL_NAV,
} from '../../data/studentPortalNav';
import { useUnreadNotificationCount } from '../../hooks/useUnreadNotificationCount';

type StudentSidebarProps = {
  activeNav: string;
  institutionalId: string;
  email?: string;
  initials: string;
  avatarUrl?: string | null;
};

const isNavActive = (pathname: string, path: string) =>
  path === '/student' ? pathname === '/student' : pathname.startsWith(path);

const StudentSidebar = memo(({
  activeNav,
  institutionalId,
  email,
  initials,
  avatarUrl,
}: StudentSidebarProps) => {
  const { pathname } = useLocation();
  const { unreadCount } = useUnreadNotificationCount();

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col justify-between border-r border-student-surface-variant bg-student-surface shadow-[0px_10px_30px_rgba(0,0,0,0.05)] h-full z-10">
      <div>
        <div className="h-20 flex items-center px-6 border-b border-student-surface-variant/50">
          <Link to="/student" className="flex items-center gap-3 min-w-0">
            <ObserverrLogo className="h-8 w-8 shrink-0" />
            <div className="min-w-0">
              <span className="block text-student-headline-sm font-student text-student-primary tracking-tight truncate">
                OBSERVERR
              </span>
              <span className="block text-student-label-md font-student text-student-on-surface-variant">
                Student Portal
              </span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1 mt-4" aria-label="Student navigation">
          {STUDENT_PORTAL_NAV.map((item) => {
            const isActive = activeNav === item.id || isNavActive(pathname, item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-student-body-md font-student transition-colors relative ${
                  isActive
                    ? 'bg-student-surface-container-highest/30 text-student-primary font-bold border-r-4 border-student-primary'
                    : 'text-student-on-surface-variant hover:bg-student-surface-container-high'
                }`}
              >
                <Icon name={item.icon} filled={isActive} className="mr-3 text-[20px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-student-surface-variant/50">
        <nav className="space-y-1 mb-4" aria-label="Student account navigation">
          {STUDENT_PORTAL_FOOTER_NAV.map((item) => {
            const isActive = activeNav === item.id || isNavActive(pathname, item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex items-center px-4 py-3 rounded-xl text-student-body-md font-student transition-colors ${
                  isActive
                    ? 'bg-student-surface-container-high text-student-on-surface font-semibold'
                    : 'text-student-on-surface-variant hover:bg-student-surface-container-high'
                }`}
              >
                <Icon name={item.icon} filled={isActive} className="mr-3 text-[20px]" />
                {item.label}
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-student-error" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 px-2 mb-4 min-w-0">
          <StudentAvatar src={avatarUrl} initials={initials} size="sm" />
          <div className="min-w-0">
            <p className="text-student-label-md font-student text-student-on-surface truncate font-semibold">{institutionalId}</p>
            <p className="text-[11px] text-student-on-surface-variant truncate">{email || 'Student Account'}</p>
          </div>
        </div>
        <LogoutActions compact className="px-2" />
      </div>
    </aside>
  );
});

StudentSidebar.displayName = 'StudentSidebar';

export default StudentSidebar;
