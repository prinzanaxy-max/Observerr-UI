import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../student/Icon';
import { PORTAL_FOOTER_NAV, PORTAL_NAV } from '../../data/lecturerPortalNav';

type LecturerPortalSidebarProps = {
  fullName: string;
  initials: string;
  onNewExam?: () => void;
};

const isActivePath = (pathname: string, path: string) =>
  path === '/lecturer' ? pathname === '/lecturer' : pathname.startsWith(path);

const LecturerPortalSidebar = memo(({ fullName, initials, onNewExam }: LecturerPortalSidebarProps) => {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col h-full bg-student-surface shadow-[0px_10px_30px_rgba(0,0,0,0.05)] z-10 p-4">
      <div className="mb-8 px-4 py-2">
        <Link to="/lecturer" className="block min-w-0">
          <div className="text-student-display-lg font-student font-black text-student-primary tracking-tight">
            OBSERVERR
          </div>
          <div className="text-student-label-md font-student text-student-on-surface-variant mt-1">
            Lecturer Portal
          </div>
        </Link>
      </div>

      <button
        type="button"
        onClick={onNewExam}
        className="mb-6 mx-2 py-3 px-4 rounded-full bg-gradient-to-r from-student-primary-fixed to-student-secondary-fixed text-student-on-surface font-student text-student-headline-sm flex items-center justify-center gap-2 lecturer-ambient-glow hover:scale-[0.98] transition-transform duration-150"
      >
        <Icon name="add" />
        New Exam
      </button>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto overscroll-contain" aria-label="Lecturer portal navigation">
        {PORTAL_NAV.map((item) => {
          const isActive =
            item.id === 'proctoring'
              ? pathname.startsWith('/lecturer/proctoring')
              : item.id === 'students'
                ? pathname.startsWith('/lecturer/students')
                : item.path === '/lecturer'
                  ? pathname === '/lecturer'
                  : pathname.startsWith(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-student text-student-body-lg transition-colors ${
                isActive
                  ? 'bg-student-primary-container text-student-on-primary-container font-bold scale-[0.98]'
                  : 'text-student-on-surface-variant hover:bg-student-surface-container-high'
              }`}
            >
              <Icon name={item.icon} filled={isActive} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-student-surface-variant pt-4">
        {PORTAL_FOOTER_NAV.map((item) => {
          const isActive = isActivePath(pathname, item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-student text-student-body-lg transition-colors ${
                isActive
                  ? 'bg-student-surface-container-high text-student-on-surface font-semibold'
                  : 'text-student-on-surface-variant hover:bg-student-surface-container-high'
              }`}
            >
              <Icon name={item.icon} filled={isActive} />
              {item.label}
            </Link>
          );
        })}

        <div className="flex items-center gap-3 px-4 py-3 mt-2 min-w-0">
          <div className="w-8 h-8 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold border-2 border-student-surface-variant">
            {initials}
          </div>
          <span className="text-student-body-md font-student font-medium text-student-on-surface truncate">{fullName}</span>
        </div>
      </div>
    </aside>
  );
});

LecturerPortalSidebar.displayName = 'LecturerPortalSidebar';

export default LecturerPortalSidebar;
