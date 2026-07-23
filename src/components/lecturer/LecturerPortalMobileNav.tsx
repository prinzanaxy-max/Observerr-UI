import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../student/Icon';
import { MOBILE_PORTAL_NAV } from '../../data/lecturerPortalNav';

const LecturerPortalMobileNav = memo(() => {
  const { pathname } = useLocation();

  return (
    <nav
      className="md:hidden shrink-0 border-t border-student-outline-variant/50 bg-student-surface-container-lowest px-2 py-2 grid grid-cols-5 gap-1 z-20"
      aria-label="Mobile portal navigation"
    >
      {MOBILE_PORTAL_NAV.map((item) => {
        const isActive = item.path === '/lecturer' ? pathname === '/lecturer' : pathname.startsWith(item.path);
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-medium transition-colors ${
              isActive ? 'text-student-primary' : 'text-student-on-surface-variant'
            }`}
          >
            <Icon name={item.icon} filled={isActive} className="text-[20px]" />
            <span className="truncate max-w-full px-1">{item.label.split(' ')[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
});

LecturerPortalMobileNav.displayName = 'LecturerPortalMobileNav';

export default LecturerPortalMobileNav;
