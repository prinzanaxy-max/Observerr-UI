import { useCallback, useEffect, useState } from 'react';
import { fetchNotifications } from '../services/notificationService';
import useAuthStore from '../store/authStore';

const POLL_MS = 60_000;
export const NOTIFICATIONS_CHANGED_EVENT = 'observerr:notifications-changed';

export function notifyNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

/** Lightweight unread badge source for sidebars / header bells. */
export function useUnreadNotificationCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const page = await fetchNotifications({ page: 0, size: 1 });
      setUnreadCount(page.unreadCount);
    } catch {
      // Keep last known count on transient failures.
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
    if (!isAuthenticated) return undefined;
    const id = window.setInterval(() => void refresh(), POLL_MS);
    const onFocus = () => void refresh();
    const onChanged = () => void refresh();
    window.addEventListener('focus', onFocus);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, onChanged);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, onChanged);
    };
  }, [isAuthenticated, refresh]);

  return { unreadCount, refreshUnreadCount: refresh };
}
