import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { STUDENT_MOBILE_NAV } from '../../data/studentPortalNav';

type MobileBottomNavProps = {
  activeNav: string;
};

const MobileBottomNav = memo(({ activeNav }: MobileBottomNavProps) => {
  const { pathname } = useLocation();

  return (
    <nav
      className="md:hidden shrink-0 border-t border-student-surface-variant/50 bg-student-surface/90 backdrop-blur-md px-2 py-2 grid grid-cols-4 gap-1 z-20 shadow-[0px_-5px_20px_rgba(0,0,0,0.05)]"
      aria-label="Mobile navigation"
    >
      {STUDENT_MOBILE_NAV.map((item) => {
        const isActive = activeNav === item.id || (item.path === '/student' ? pathname === '/student' : pathname.startsWith(item.path));
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-student font-medium transition-colors ${
              isActive ? 'text-student-primary font-bold' : 'text-student-on-surface-variant'
            }`}
          >
            <Icon name={item.icon} filled={isActive} className="text-[20px]" />
            <span className="truncate max-w-full px-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';

export default MobileBottomNav;
