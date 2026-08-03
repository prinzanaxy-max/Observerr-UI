import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getVapidPublicKey,
  isWebPushConfigured,
  isWebPushSupported,
  PUSH_SW_PATH,
  toSubscriptionPayload,
  urlBase64ToUint8Array,
  type WebPushSubscriptionPayload,
} from '../lib/webPush';
import { registerDeviceToken, unregisterDeviceToken } from '../services/deviceTokenService';
import type { ForegroundPushPayload, PushPermissionStatus } from '../types/pushNotifications';
import useAuthStore from '../store/authStore';

const PUSH_ENABLED_KEY = 'observerr:push-notifications-enabled';
const SUBSCRIPTION_REFRESH_MS = 24 * 60 * 60 * 1000;

const readPushEnabled = (): boolean => {
  try {
    return localStorage.getItem(PUSH_ENABLED_KEY) === 'true';
  } catch {
    return false;
  }
};

const writePushEnabled = (enabled: boolean) => {
  try {
    localStorage.setItem(PUSH_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {
    // ignore storage failures
  }
};

const mapBrowserPermission = (): PushPermissionStatus => {
  if (!isWebPushSupported()) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  return 'idle';
};

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [status, setStatus] = useState<PushPermissionStatus>(() => {
    if (!isWebPushConfigured()) return 'unconfigured';
    return mapBrowserPermission();
  });
  const [pushEnabled, setPushEnabled] = useState(readPushEnabled);
  const [errorMessage, setErrorMessage] = useState('');
  const lastEndpointRef = useRef<string | null>(null);

  const registerSubscriptionWithBackend = useCallback(
    async (subscription: PushSubscription) => {
      if (!isAuthenticated) {
        return;
      }
      const payload = toSubscriptionPayload(subscription);
      if (lastEndpointRef.current === payload.endpoint) {
        return;
      }
      await registerDeviceToken(payload);
      lastEndpointRef.current = payload.endpoint;
    },
    [isAuthenticated],
  );

  const subscribeAndRegister = useCallback(async (): Promise<WebPushSubscriptionPayload | null> => {
    const vapidKey = getVapidPublicKey();
    if (!vapidKey) {
      throw new Error('Push notifications are not configured.');
    }
    if (!isWebPushSupported()) {
      throw new Error('This browser does not support web push.');
    }

    const registration = await navigator.serviceWorker.register(PUSH_SW_PATH);
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }

    await registerSubscriptionWithBackend(subscription);
    return toSubscriptionPayload(subscription);
  }, [registerSubscriptionWithBackend]);

  const refreshSubscriptionSilently = useCallback(async () => {
    if (!pushEnabled || status !== 'granted' || !isAuthenticated) {
      return;
    }

    try {
      await subscribeAndRegister();
    } catch {
      // Silent refresh — avoid disrupting the user; next focus will retry.
    }
  }, [isAuthenticated, pushEnabled, status, subscribeAndRegister]);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    setErrorMessage('');

    if (!isWebPushConfigured()) {
      setStatus('unconfigured');
      setErrorMessage(
        'Push is not configured. Set VITE_VAPID_PUBLIC_KEY in the frontend env (must match the backend VAPID public key).',
      );
      return false;
    }

    if (!isWebPushSupported()) {
      setStatus('unsupported');
      setErrorMessage('This browser does not support web push notifications.');
      return false;
    }

    if (Notification.permission === 'denied') {
      setStatus('denied');
      setErrorMessage('Notifications are blocked. Enable them in your browser settings.');
      return false;
    }

    setStatus('requesting');

    try {
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        setStatus('denied');
        setPushEnabled(false);
        writePushEnabled(false);
        setErrorMessage('Notifications are blocked. Enable them in your browser settings.');
        return false;
      }

      await subscribeAndRegister();
      setStatus('granted');
      setPushEnabled(true);
      writePushEnabled(true);
      return true;
    } catch (err) {
      setStatus('error');
      setPushEnabled(false);
      writePushEnabled(false);
      setErrorMessage(err instanceof Error ? err.message : 'Could not enable push notifications.');
      return false;
    }
  }, [subscribeAndRegister]);

  const disablePushNotifications = useCallback(async () => {
    setPushEnabled(false);
    writePushEnabled(false);
    setErrorMessage('');

    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      setStatus('denied');
    } else {
      setStatus('idle');
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration(PUSH_SW_PATH);
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        const payload = toSubscriptionPayload(subscription);
        await subscription.unsubscribe();
        if (isAuthenticated) {
          await unregisterDeviceToken(payload);
        }
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Push was disabled locally, but the device could not be unregistered.',
      );
    } finally {
      lastEndpointRef.current = null;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!pushEnabled || status !== 'granted') {
      return;
    }

    void refreshSubscriptionSilently();

    const onFocus = () => {
      void refreshSubscriptionSilently();
    };

    window.addEventListener('focus', onFocus);
    const intervalId = window.setInterval(() => {
      void refreshSubscriptionSilently();
    }, SUBSCRIPTION_REFRESH_MS);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.clearInterval(intervalId);
    };
  }, [pushEnabled, refreshSubscriptionSilently, status]);

  useEffect(() => {
    if (pushEnabled && status === 'granted' && isAuthenticated) {
      void refreshSubscriptionSilently();
    }
  }, [isAuthenticated, pushEnabled, refreshSubscriptionSilently, status]);

  return {
    status,
    pushEnabled,
    errorMessage,
    requestNotificationPermission,
    disablePushNotifications,
    refreshTokenSilently: refreshSubscriptionSilently,
  };
}

/** Subscribe to foreground push messages from the service worker. */
export async function subscribeToForegroundMessages(
  callback: (payload: ForegroundPushPayload) => void,
): Promise<(() => void) | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  const onMessage = (event: MessageEvent) => {
    const data = event.data as
      | {
          type?: string;
          title?: string;
          body?: string;
          deepLink?: string;
          data?: Record<string, string>;
        }
      | undefined;
    if (!data || data.type !== 'OBSERVERR_PUSH') {
      return;
    }
    callback({
      title: data.title ?? 'Observerr',
      body: data.body ?? 'You have a new notification',
      deepLink: data.deepLink,
      data: data.data,
    });
  };

  navigator.serviceWorker.addEventListener('message', onMessage);
  return () => navigator.serviceWorker.removeEventListener('message', onMessage);
}
