import { memo, useCallback } from 'react';
import Icon from '../student/Icon';
import { MOBILE_LECTURER_NAV } from '../../data/lecturerDashboardData';

type LecturerMobileNavProps = {
  activeNav: string;
  onNavChange: (id: string) => void;
};

const LecturerMobileNav = memo(({ activeNav, onNavChange }: LecturerMobileNavProps) => {
  const handleNav = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      onNavChange(id);
    },
    [onNavChange],
  );

  return (
    <nav
      className="md:hidden shrink-0 border-t border-student-outline-variant/50 bg-student-surface-container-lowest px-2 py-2 grid grid-cols-5 gap-1 z-20"
      aria-label="Mobile lecturer navigation"
    >
      {MOBILE_LECTURER_NAV.map((item) => {
        const isActive = activeNav === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={handleNav(item.id)}
            className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-medium transition-colors ${
              isActive ? 'text-student-primary' : 'text-student-on-surface-variant'
            }`}
          >
            <Icon name={item.icon} filled={isActive} className="text-[20px]" />
            <span className="truncate max-w-full px-1">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
});

LecturerMobileNav.displayName = 'LecturerMobileNav';

export default LecturerMobileNav;
