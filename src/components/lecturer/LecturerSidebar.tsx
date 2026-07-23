import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ObserverrLogo from '../ObserverrLogo';
import Icon from '../student/Icon';
import { LECTURER_NAV } from '../../data/lecturerDashboardData';

type LecturerSidebarProps = {
  activeNav: string;
  onNavChange: (id: string) => void;
  fullName: string;
  title: string;
  initials: string;
  onLogout: () => void;
};

const LecturerSidebar = memo(({
  activeNav,
  onNavChange,
  fullName,
  title,
  initials,
  onLogout,
}: LecturerSidebarProps) => {
  const handleNav = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      onNavChange(id);
    },
    [onNavChange],
  );

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col h-full bg-student-surface shadow-[0px_10px_30px_rgba(0,0,0,0.05)] z-10">
      <div className="px-6 py-8 border-b border-student-outline-variant/30">
        <Link to="/" className="block min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <ObserverrLogo className="h-8 w-8 shrink-0" />
            <h1 className="text-student-headline-md font-student font-bold text-student-primary tracking-tight truncate">
              OBSERVERR
            </h1>
          </div>
          <p className="text-student-label-md font-student text-student-on-surface-variant leading-none mt-1 pl-11">
            Exam Integrity System
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overscroll-contain" aria-label="Lecturer navigation">
        {LECTURER_NAV.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-student-headline-sm text-[16px] font-student transition-colors ${
                isActive
                  ? 'text-student-primary font-bold border-r-4 border-student-primary bg-student-surface-container-high/60'
                  : 'text-student-on-surface-variant hover:bg-student-surface-container-high'
              }`}
            >
              <Icon name={item.icon} filled={isActive} className="text-[20px]" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-auto px-6 py-6 border-t border-student-outline-variant/30">
        <div className="flex items-center gap-3 mb-4 min-w-0">
          <div className="w-10 h-10 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container font-semibold text-sm border border-student-outline-variant">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-student-body-md font-student font-bold text-student-on-surface truncate">{fullName}</p>
            <p className="text-student-label-md font-student text-student-on-surface-variant truncate">{title}</p>
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

LecturerSidebar.displayName = 'LecturerSidebar';

export default LecturerSidebar;
