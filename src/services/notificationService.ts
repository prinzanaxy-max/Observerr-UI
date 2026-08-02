import apiClient from '../lib/axios';
import type {
  NotificationCategory,
  NotificationItem,
  NotificationPage,
  NotificationPreferences,
} from '../types/pushNotifications';
import {
  requireArray,
  requireBoolean,
  requireNumber,
  requireRecord,
  requireString,
} from '../lib/apiResponse';

const CATEGORIES: NotificationCategory[] = ['EXAM', 'INTEGRITY', 'RESULT', 'SYSTEM'];
let preferenceUpdatePromise: Promise<NotificationPreferences> | null = null;

export const normalizeNotificationPage = (value: unknown): NotificationPage => {
  const page = requireRecord(value, 'notifications page');
  return {
    content: requireArray(page.content, 'notifications page').map((value) => {
      const item = requireRecord(value, 'notification');
      const category = requireString(item.category, 'notification') as NotificationCategory;
      if (!CATEGORIES.includes(category)) throw new Error('Invalid notification response.');
      if (typeof item.id !== 'string' && typeof item.id !== 'number') {
        throw new Error('Invalid notification response.');
      }
      return {
        id: item.id,
        category,
        title: requireString(item.title, 'notification'),
        message: requireString(item.message, 'notification'),
        read: requireBoolean(item.read, 'notification'),
        createdAt: requireString(item.createdAt, 'notification'),
        deepLink: item.deepLink === null ? null : requireString(item.deepLink, 'notification'),
      };
    }),
    page: requireNumber(page.page, 'notifications page'),
    size: requireNumber(page.size, 'notifications page'),
    totalElements: requireNumber(page.totalElements, 'notifications page'),
    totalPages: requireNumber(page.totalPages, 'notifications page'),
    unreadCount: requireNumber(page.unreadCount, 'notifications page'),
  };
};

export const normalizeNotificationPreferences = (value: unknown): NotificationPreferences => {
  const preferences = requireRecord(value, 'notification preferences');
  return {
    examEvents: requireBoolean(preferences.examEvents, 'notification preferences'),
    integrityAlerts: requireBoolean(preferences.integrityAlerts, 'notification preferences'),
    resultUpdates: requireBoolean(preferences.resultUpdates, 'notification preferences'),
    systemUpdates: requireBoolean(preferences.systemUpdates, 'notification preferences'),
  };
};

export type FetchNotificationsParams = {
  page?: number;
  size?: number;
  category?: NotificationCategory;
  unreadOnly?: boolean;
};

export async function fetchNotifications({
  page = 0,
  size = 20,
  category,
  unreadOnly = false,
}: FetchNotificationsParams = {}): Promise<NotificationPage> {
  const { data } = await apiClient.get<unknown>('/api/notifications', {
    params: { page, size, category, unreadOnly },
  });
  return normalizeNotificationPage(data);
}

export async function markNotificationRead(
  notificationId: NotificationItem['id'],
): Promise<void> {
  await apiClient.patch(`/api/notifications/${notificationId}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch('/api/notifications/read-all');
}

export async function dismissNotification(
  notificationId: NotificationItem['id'],
): Promise<void> {
  await apiClient.delete(`/api/notifications/${notificationId}`);
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const { data } = await apiClient.get<unknown>(
    '/api/notifications/preferences',
  );
  return normalizeNotificationPreferences(data);
}

export async function updateNotificationPreferences(
  preferences: NotificationPreferences,
): Promise<NotificationPreferences> {
  if (preferenceUpdatePromise) return preferenceUpdatePromise;
  preferenceUpdatePromise = apiClient.put<unknown>('/api/notifications/preferences', preferences)
    .then(({ data }) => normalizeNotificationPreferences(data))
    .finally(() => {
      preferenceUpdatePromise = null;
    });
  return preferenceUpdatePromise;
}
