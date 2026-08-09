export const PUSH_SW_PATH = '/push-sw.js';

export const getVapidPublicKey = (): string =>
  (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined)?.trim() ?? '';

export const isWebPushConfigured = (): boolean => Boolean(getVapidPublicKey());

export const isWebPushSupported = (): boolean =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  typeof Notification !== 'undefined';

/** Convert a URL-safe base64 VAPID key to a Uint8Array for PushManager.subscribe. */
export function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export type WebPushSubscriptionPayload = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export function toSubscriptionPayload(
  subscription: PushSubscription,
): WebPushSubscriptionPayload {
  const json = subscription.toJSON();
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;
  if (!json.endpoint || !p256dh || !auth) {
    throw new Error('Push subscription is missing endpoint or keys.');
  }
  return {
    endpoint: json.endpoint,
    keys: { p256dh, auth },
  };
}
