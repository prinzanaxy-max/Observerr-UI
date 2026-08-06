import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';

type NotificationsHeaderProps = {
  unreadCount: number;
  markingAllRead: boolean;
  onMarkAllRead: () => void;
  clearAllPending?: boolean;
  onClearAll?: () => void;
  hasNotifications?: boolean;
};

const NotificationsHeader = memo(({
  unreadCount,
  markingAllRead,
  onMarkAllRead,
  clearAllPending = false,
  onClearAll,
  hasNotifications = false,
}: NotificationsHeaderProps) => (
  <header className="hidden md:flex shrink-0 h-20 bg-transparent items-center justify-between px-6 lg:px-8 sticky top-0 z-20 backdrop-blur-md bg-student-surface-bright/80 border-b border-student-outline-variant/10">
    <h1 className="text-student-headline-md font-student text-student-on-background">Notifications</h1>

    <div className="flex items-center gap-3">
      {unreadCount > 0 && (
        <button
          type="button"
          disabled={markingAllRead}
          onClick={onMarkAllRead}
          className="text-student-label-md font-student text-student-primary hover:text-student-primary-container transition-colors py-2 px-4 rounded-full border border-student-primary hover:bg-student-primary/5 disabled:opacity-50"
        >
          {markingAllRead ? 'Marking…' : 'Mark all as read'}
        </button>
      )}
      {hasNotifications && onClearAll && (
        <button
          type="button"
          disabled={clearAllPending}
          onClick={onClearAll}
          className="text-student-label-md font-student text-student-error py-2 px-4 rounded-full border border-student-error hover:bg-student-error/5 disabled:opacity-50"
        >
          {clearAllPending ? 'Clearing…' : 'Clear all'}
        </button>
      )}

      <div className="flex gap-1 bg-student-surface-container-low rounded-full px-2 py-1">
        <span className="p-2 text-student-on-surface-variant relative" aria-hidden="true">
          <Icon name="notifications" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-student-error rounded-full border border-student-surface" />
          )}
        </span>
        <Link
          to="/student/documentation"
          className="p-2 rounded-full text-student-on-surface-variant hover:bg-student-surface-container-highest/50 transition-colors"
          aria-label="Help"
        >
          <Icon name="help" />
        </Link>
      </div>
    </div>
  </header>
));

NotificationsHeader.displayName = 'NotificationsHeader';

export default NotificationsHeader;
