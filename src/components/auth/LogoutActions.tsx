import { memo, useCallback } from 'react';
import useAuthStore from '../../store/authStore';
import Icon from '../student/Icon';

type LogoutActionsProps = {
  className?: string;
  compact?: boolean;
};

const LogoutActions = memo(({ className = '', compact = false }: LogoutActionsProps) => {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = useCallback(() => {
    void logout(false);
  }, [logout]);

  const handleLogoutEverywhere = useCallback(() => {
    void logout(true);
  }, [logout]);

  if (compact) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center text-student-error hover:opacity-80 transition-opacity text-sm font-medium"
        >
          <Icon name="logout" className="mr-2 text-[18px]" />
          Log out
        </button>
        <button
          type="button"
          onClick={handleLogoutEverywhere}
          className="text-left text-student-on-surface-variant hover:text-student-on-surface transition-colors text-xs font-medium pl-[26px]"
        >
          Log out everywhere
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 rounded-xl border border-student-outline-variant px-4 py-2.5 text-sm font-medium text-student-on-surface hover:bg-student-surface-container-high transition-colors"
      >
        <Icon name="logout" className="text-[18px]" />
        Log out
      </button>
      <button
        type="button"
        onClick={handleLogoutEverywhere}
        className="text-center text-xs font-medium text-student-on-surface-variant hover:text-student-on-surface transition-colors"
      >
        Log out everywhere
      </button>
    </div>
  );
});

LogoutActions.displayName = 'LogoutActions';

export default LogoutActions;
