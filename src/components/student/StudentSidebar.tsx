import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ObserverrLogo from '../ObserverrLogo';
import Icon from './Icon';
import { NAV_ITEMS } from '../../data/studentDashboardData';

type StudentSidebarProps = {
  activeNav: string;
  onNavChange: (id: string) => void;
  fullName: string;
  initials: string;
  onLogout: () => void;
};

const StudentSidebar = memo(({
  activeNav,
  onNavChange,
  fullName,
  initials,
  onLogout,
}: StudentSidebarProps) => {
  const handleNav = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      onNavChange(id);
    },
    [onNavChange],
  );

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col justify-between border-r border-student-surface-variant bg-student-surface-container-lowest h-full z-10">
      <div>
        <div className="h-20 flex items-center px-6 border-b border-student-surface-variant/50">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <ObserverrLogo className="h-8 w-8 shrink-0" />
            <span className="text-student-headline-sm font-student text-student-primary tracking-tight truncate">
              OBSERVERR
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-2 mt-4" aria-label="Student navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleNav(item.id)}
                className={`flex items-center px-4 py-3 rounded-xl text-student-label-md font-student transition-colors ${
                  isActive
                    ? 'bg-student-primary-container text-student-on-primary-container'
                    : 'text-student-on-surface-variant hover:bg-student-surface-container-low'
                }`}
              >
                <Icon name={item.icon} filled={isActive && item.filled} className="mr-3 text-[20px]" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-student-surface-variant/50">
        <div className="flex items-center gap-3 mb-4 min-w-0">
          <div
            className="w-10 h-10 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container font-semibold text-sm border border-student-outline-variant"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-student-label-md font-student text-student-on-surface truncate">{fullName}</p>
            <p className="text-[11px] text-student-on-surface-variant">Student Account</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center text-student-error hover:opacity-80 transition-opacity text-sm font-medium"
        >
          <Icon name="logout" className="mr-2 text-[18px]" />
          Log Out
        </button>
      </div>
    </aside>
  );
});

StudentSidebar.displayName = 'StudentSidebar';

export default StudentSidebar;
