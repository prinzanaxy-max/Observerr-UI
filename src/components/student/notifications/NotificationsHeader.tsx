import { memo } from 'react';
import Icon from '../Icon';

type NotificationsHeaderProps = {
  unreadCount: number;
  onMarkAllRead: () => void;
};

const NotificationsHeader = memo(({ unreadCount, onMarkAllRead }: NotificationsHeaderProps) => (
  <header className="hidden md:flex shrink-0 h-20 bg-transparent items-center justify-between px-6 lg:px-8 sticky top-0 z-20 backdrop-blur-md bg-student-surface-bright/80 border-b border-student-outline-variant/10">
    <h1 className="text-student-headline-md font-student text-student-on-background">Notifications</h1>

    <div className="flex items-center gap-4">
      {unreadCount > 0 && (
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-student-label-md font-student text-student-primary hover:text-student-primary-container transition-colors py-2 px-4 rounded-full border border-student-primary hover:bg-student-primary/5"
        >
          Mark all as read
        </button>
      )}

      <div className="flex gap-1 bg-student-surface-container-low rounded-full px-2 py-1">
        <button
          type="button"
          className="p-2 rounded-full text-student-on-surface-variant hover:bg-student-surface-container-highest/50 transition-colors relative"
          aria-label="Notifications"
        >
          <Icon name="notifications" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-student-error rounded-full border border-student-surface" />
          )}
        </button>
        <button
          type="button"
          className="p-2 rounded-full text-student-on-surface-variant hover:bg-student-surface-container-highest/50 transition-colors"
          aria-label="Help"
        >
          <Icon name="help" />
        </button>
      </div>
    </div>
  </header>
));

NotificationsHeader.displayName = 'NotificationsHeader';

export default NotificationsHeader;
