export type DeviceTokenRequest = {
  token: string;
};

export type NotificationCategory =
  | 'EXAM'
  | 'INTEGRITY'
  | 'RESULT'
  | 'SYSTEM';

export type NotificationItem = {
  id: string | number;
  category: NotificationCategory;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  deepLink: string | null;
  deduplicationKey?: string | null;
};

export type NotificationPage = {
  content: NotificationItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  unreadCount: number;
};

export type NotificationPreferences = {
  examEvents: boolean;
  integrityAlerts: boolean;
  resultUpdates: boolean;
  systemUpdates: boolean;
};

export type PushPermissionStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'error'
  | 'unsupported';

export type ForegroundPushPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
  deepLink?: string;
};
