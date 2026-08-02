import { AxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as notificationService from '../services/notificationService';
import type { NotificationCategory, NotificationItem } from '../types/pushNotifications';

const PAGE_SIZE = 20;

export function useNotifications(category?: NotificationCategory) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [pendingIds, setPendingIds] = useState<Set<string | number>>(new Set());
  const [markAllPending, setMarkAllPending] = useState(false);
  const markAllPendingRef = useRef(false);

  const load = useCallback(async (nextPage = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const data = await notificationService.fetchNotifications({
        page: nextPage,
        size: PAGE_SIZE,
        category,
      });
      setNotifications((current) => {
        const merged = append ? [...current, ...data.content] : data.content;
        return Array.from(new Map(merged.map((item) => [item.id, item])).values());
      });
      setPage(data.page);
      setTotalPages(data.totalPages);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      const status = err instanceof AxiosError ? err.response?.status : undefined;
      setError(
        status === 403
          ? 'You do not have permission to view these notifications.'
          : 'Could not load notifications. Please try again.',
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category]);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = useCallback(async (notification: NotificationItem) => {
    if (notification.read || pendingIds.has(notification.id)) return;
    setPendingIds((ids) => new Set(ids).add(notification.id));
    try {
      await notificationService.markNotificationRead(notification.id);
      setNotifications((items) =>
        items.map((item) => item.id === notification.id ? { ...item, read: true } : item),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } finally {
      setPendingIds((ids) => {
        const next = new Set(ids);
        next.delete(notification.id);
        return next;
      });
    }
  }, [pendingIds]);

  const dismiss = useCallback(async (id: NotificationItem['id']) => {
    if (pendingIds.has(id)) return;
    const item = notifications.find((notification) => notification.id === id);
    setPendingIds((ids) => new Set(ids).add(id));
    try {
      await notificationService.dismissNotification(id);
      setNotifications((items) => items.filter((notification) => notification.id !== id));
      if (item && !item.read) setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      setError('Could not dismiss that notification.');
    } finally {
      setPendingIds((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }
  }, [notifications, pendingIds]);

  const markAllRead = useCallback(async () => {
    if (unreadCount === 0 || markAllPendingRef.current) return;
    markAllPendingRef.current = true;
    setMarkAllPending(true);
    try {
      await notificationService.markAllNotificationsRead();
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      setError('Could not mark notifications as read.');
    } finally {
      markAllPendingRef.current = false;
      setMarkAllPending(false);
    }
  }, [unreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    error,
    pendingIds,
    markAllPending,
    hasMore: page + 1 < totalPages,
    reload: () => load(),
    loadMore: () => load(page + 1, true),
    markRead,
    dismiss,
    markAllRead,
  };
}
