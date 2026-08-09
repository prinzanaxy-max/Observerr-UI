import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../student/Icon';
import { useUnreadNotificationCount } from '../../hooks/useUnreadNotificationCount';
import { fetchNotifications } from '../../services/notificationService';
import type { NotificationItem } from '../../types/pushNotifications';

type NotificationBellDropdownProps = {
  viewAllPath: string;
};

const formatRelativeTime = (isoString: string): string => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

const NotificationBellDropdown = memo(({ viewAllPath }: NotificationBellDropdownProps) => {
  const { unreadCount } = useUnreadNotificationCount();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const page = await fetchNotifications({ page: 0, size: 5 });
      setNotifications(page.content);
    } catch {
      // keep stale data on error
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) void loadNotifications();
      return !prev;
    });
  }, [loadNotifications]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={isOpen}
        className="relative p-2 rounded-full text-student-on-surface-variant hover:text-student-primary hover:bg-student-surface-container transition-colors focus:ring-2 focus:ring-student-primary/20"
      >
        <Icon name="notifications" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-student-error" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-student-surface rounded-2xl shadow-xl border border-student-outline-variant/20 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-student-surface-variant/50">
            <span className="text-student-body-lg font-student font-semibold text-student-on-surface">Notifications</span>
            <Link
              to={viewAllPath}
              onClick={() => setIsOpen(false)}
              className="text-student-label-md font-student text-student-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="space-y-3 p-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-student-surface-container-high" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <Icon name="notifications_off" className="text-[36px] text-student-outline mb-2 mx-auto" />
                <p className="text-student-body-md font-student text-student-on-surface-variant">No notifications yet</p>
              </div>
            ) : (
              <ul>
                {notifications.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-student-surface-variant/30 last:border-0 ${
                      !item.read ? 'border-l-2 border-l-student-primary bg-student-primary-container/5' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-student-body-md font-student truncate ${!item.read ? 'font-semibold text-student-on-surface' : 'text-student-on-surface'}`}>
                        {item.title}
                      </p>
                      <p className="text-student-label-md font-student text-student-on-surface-variant truncate mt-0.5">
                        {item.message}
                      </p>
                      <p className="text-student-label-sm font-student text-student-outline mt-1">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-student-surface-variant/50">
            <Link
              to={viewAllPath}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-student-body-md font-student text-student-primary hover:bg-student-surface-container transition-colors"
            >
              View all notifications
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});

NotificationBellDropdown.displayName = 'NotificationBellDropdown';

export default NotificationBellDropdown;
