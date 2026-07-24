import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import NotificationsHeader from '../components/student/notifications/NotificationsHeader';
import NotificationCard from '../components/student/notifications/NotificationCard';
import Icon from '../components/student/Icon';
import {
  cloneNotifications,
  countUnreadNotifications,
  filterNotifications,
  type StudentNotification,
} from '../data/studentNotificationsData';

const StudentNotificationsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(cloneNotifications);

  useEffect(() => {
    document.title = 'Notifications — Observerr';
  }, []);

  const unreadCount = useMemo(
    () => countUnreadNotifications(notifications),
    [notifications],
  );

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, searchQuery),
    [notifications, searchQuery],
  );

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleSelect = useCallback((notification: StudentNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
  }, [navigate]);

  return (
    <StudentPortalLayout
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search notifications..."
      contentClassName="student-notifications-bg relative"
      header={
        <NotificationsHeader unreadCount={unreadCount} onMarkAllRead={handleMarkAllRead} />
      }
    >
      <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-student-primary-container opacity-[0.07] blur-[100px] z-0" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-student-secondary-container opacity-[0.07] blur-[100px] z-0" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-[800px] mx-auto w-full pb-24 md:pb-12">
        <div className="md:hidden flex items-center justify-between mb-6 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-student-label-md font-student text-student-primary py-1.5 px-3 rounded-full border border-student-primary"
            >
              Mark all read
            </button>
          )}
        </div>

        {unreadCount > 0 && (
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-5">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </p>
        )}

        {filteredNotifications.length > 0 ? (
          <div className="flex flex-col gap-5">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-2xl student-exam-glass-card">
            <Icon name="notifications_off" className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No notifications found</h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant">
              {searchQuery.trim()
                ? 'Try a different search term.'
                : 'You are all caught up. New alerts will appear here.'}
            </p>
          </div>
        )}
      </div>
    </StudentPortalLayout>
  );
};

export default StudentNotificationsPage;
