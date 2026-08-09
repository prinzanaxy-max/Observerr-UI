import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../student/Icon';
import { useUnreadNotificationCount } from '../../hooks/useUnreadNotificationCount';

type NotificationBellLinkProps = {
  className?: string;
};

const NotificationBellLink = memo(({ className = '' }: NotificationBellLinkProps) => {
  const { unreadCount } = useUnreadNotificationCount();

  return (
    <Link
      to="/lecturer/notifications"
      className={`relative text-student-on-surface-variant hover:text-student-primary transition-colors focus:ring-2 focus:ring-student-primary/20 rounded-full p-2 ${className}`}
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : 'Notifications'
      }
    >
      <Icon name="notifications" />
      {unreadCount > 0 && (
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-student-error"
          aria-hidden="true"
        />
      )}
    </Link>
  );
});

NotificationBellLink.displayName = 'NotificationBellLink';

export default NotificationBellLink;
