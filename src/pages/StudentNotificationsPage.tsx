import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import NotificationsHeader from '../components/student/notifications/NotificationsHeader';
import NotificationCard from '../components/student/notifications/NotificationCard';
import Icon from '../components/student/Icon';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationCategory, NotificationItem } from '../types/pushNotifications';

const CATEGORY_OPTIONS: { value: '' | NotificationCategory; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'EXAM', label: 'Exams' },
  { value: 'INTEGRITY', label: 'Integrity' },
  { value: 'RESULT', label: 'Results' },
  { value: 'SYSTEM', label: 'System' },
];

const StudentNotificationsPage = () => {
  const navigate = useNavigate();
  const searchQuery = '';
  const [category, setCategory] = useState<'' | NotificationCategory>('');
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    error,
    pendingIds,
    markAllPending,
    clearAllPending,
    hasMore,
    reload,
    loadMore,
    markRead,
    dismiss,
    markAllRead,
    clearAll,
  } = useNotifications(category || undefined);

  useEffect(() => {
    document.title = 'Notifications — Observerr';
  }, []);

  const filteredNotifications = useMemo(
    () => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return notifications;
      return notifications.filter((notification) =>
        `${notification.title} ${notification.message}`.toLowerCase().includes(query),
      );
    },
    [notifications, searchQuery],
  );


  const handleSelect = useCallback(async (notification: NotificationItem) => {
    try {
      await markRead(notification);
    } catch {
      return;
    }
    if (
      notification.deepLink?.startsWith('/') &&
      !notification.deepLink.startsWith('//')
    ) {
      navigate(notification.deepLink);
    }
  }, [markRead, navigate]);

  return (
    <StudentPortalLayout
      contentClassName="student-notifications-bg relative"
      header={
        <NotificationsHeader
          unreadCount={unreadCount}
          markingAllRead={markAllPending}
          onMarkAllRead={() => void markAllRead()}
          clearAllPending={clearAllPending}
          onClearAll={() => void clearAll()}
          hasNotifications={notifications.length > 0 || unreadCount > 0}
        />
      }
    >
      <div className="pointer-events-none fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-student-primary-container opacity-[0.07] blur-[100px] z-0" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-student-secondary-container opacity-[0.07] blur-[100px] z-0" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-[800px] mx-auto w-full pb-24 md:pb-12">
        <div className="md:hidden flex items-center justify-between mb-6 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-background font-bold">
            Notifications
          </h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                disabled={markAllPending}
                onClick={() => void markAllRead()}
                className="text-student-label-md font-student text-student-primary py-1.5 px-3 rounded-full border border-student-primary disabled:opacity-50"
              >
                {markAllPending ? 'Marking…' : 'Mark all read'}
              </button>
            )}
            {(notifications.length > 0 || unreadCount > 0) && (
              <button
                type="button"
                disabled={clearAllPending}
                onClick={() => void clearAll()}
                className="text-student-label-md font-student text-student-error py-1.5 px-3 rounded-full border border-student-error disabled:opacity-50"
              >
                {clearAllPending ? 'Clearing…' : 'Clear all'}
              </button>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-5">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-5" aria-label="Notification category">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value || 'all'}
              type="button"
              aria-pressed={category === option.value}
              onClick={() => setCategory(option.value)}
              className={`px-4 py-2 rounded-full font-student text-student-label-md border ${
                category === option.value
                  ? 'bg-student-primary text-student-on-primary border-student-primary'
                  : 'border-student-outline-variant text-student-on-surface-variant'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {error && !loading ? (
          <div role="alert" className="text-center py-12 px-6 rounded-2xl student-exam-glass-card">
            <Icon name="error" className="text-[48px] text-student-error mb-4 mx-auto" />
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">{error}</p>
            <button type="button" onClick={reload} className="px-5 py-2 rounded-full border border-student-primary text-student-primary">Retry</button>
          </div>
        ) : loading ? (
          <div className="space-y-4 animate-pulse" aria-label="Loading notifications">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-xl bg-student-surface-container-high" />
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="flex flex-col gap-5">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onSelect={handleSelect}
                onDismiss={(id) => void dismiss(id)}
                dismissing={pendingIds.has(notification.id)}
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

        {hasMore && !loading && (
          <div className="mt-6 text-center">
            <button
              type="button"
              disabled={loadingMore}
              onClick={loadMore}
              className="px-6 py-2.5 rounded-full border border-student-primary text-student-primary disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </StudentPortalLayout>
  );
};

export default StudentNotificationsPage;
