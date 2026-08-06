import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useNotifications } from '../hooks/useNotifications';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import NotificationCard from '../components/student/notifications/NotificationCard';
import Icon from '../components/student/Icon';
import type { NotificationCategory, NotificationItem } from '../types/pushNotifications';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const CATEGORY_OPTIONS: { value: '' | NotificationCategory; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'EXAM', label: 'Exams' },
  { value: 'INTEGRITY', label: 'Integrity' },
  { value: 'RESULT', label: 'Results' },
  { value: 'SYSTEM', label: 'System' },
];

const LecturerNotificationsPage = () => {
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'' | NotificationCategory>('');
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    error,
    pendingIds,
    markAllPending,
    hasMore,
    reload,
    loadMore,
    markRead,
    dismiss,
    markAllRead,
  } = useNotifications(category || undefined);

  useEffect(() => {
    document.title = 'Notifications — Observerr Lecturer';
  }, []);

  const filteredNotifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notifications;
    return notifications.filter((notification) =>
      `${notification.title} ${notification.message}`.toLowerCase().includes(query),
    );
  }, [notifications, searchQuery]);

  const handleSelect = useCallback(
    async (notification: NotificationItem) => {
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
    },
    [markRead, navigate],
  );

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="lecturer-exams-bg"
      header={
        <header className="hidden md:flex shrink-0 justify-between items-center h-16 px-8 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 z-20">
          <h2 className="text-student-headline-md font-student font-semibold text-student-on-surface">
            Notifications
          </h2>
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
        </header>
      }
    >
      <div className="p-4 md:p-8 max-w-[800px] mx-auto w-full pb-12 space-y-5">
        <div className="md:hidden flex items-center justify-between pt-2">
          <h1 className="text-student-headline-md font-student font-bold text-student-on-surface">
            Notifications
          </h1>
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
        </div>

        {unreadCount > 0 && (
          <p className="text-student-body-md font-student text-student-on-surface-variant">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </p>
        )}

        <div className="relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            aria-label="Search notifications"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-student-surface border border-student-outline-variant text-student-body-md font-student focus:outline-none focus:ring-2 focus:ring-student-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Notification category">
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
          <div role="alert" className="text-center py-12 px-6 rounded-2xl bg-student-surface lecturer-card-elevation">
            <Icon name="error" className="text-[48px] text-student-error mb-4 mx-auto" />
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="px-5 py-2 rounded-full border border-student-primary text-student-primary"
            >
              Retry
            </button>
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
          <div className="text-center py-16 px-6 rounded-2xl bg-student-surface lecturer-card-elevation">
            <Icon name="notifications_off" className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              No notifications found
            </h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant">
              {searchQuery.trim()
                ? 'Try a different search term.'
                : 'You are all caught up. New alerts will appear here.'}
            </p>
          </div>
        )}

        {hasMore && !loading && (
          <div className="text-center">
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
    </LecturerPortalLayout>
  );
};

export default LecturerNotificationsPage;
