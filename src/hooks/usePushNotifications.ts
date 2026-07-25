import { useCallback, useEffect, useRef, useState } from 'react';
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import {
  FIREBASE_SW_PATH,
  getFirebaseMessaging,
  getVapidKey,
  isFirebaseConfigured,
} from '../lib/firebase';
import { registerDeviceToken } from '../services/deviceTokenService';
import type { ForegroundPushPayload, PushPermissionStatus } from '../types/pushNotifications';
import useAuthStore from '../store/authStore';

const PUSH_ENABLED_KEY = 'observerr:push-notifications-enabled';
const TOKEN_REFRESH_MS = 24 * 60 * 60 * 1000;

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
  if (typeof Notification === 'undefined') {
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

const payloadToForeground = (payload: MessagePayload): ForegroundPushPayload => ({
  title: payload.notification?.title ?? 'Observerr',
  body: payload.notification?.body ?? 'You have a new notification',
  data: payload.data as Record<string, string> | undefined,
});

/**
 * FCM modular SDK has no onTokenRefresh listener. Tokens can rotate when:
 * - the browser clears site data, SW updates, or Firebase rotates keys.
 * We re-fetch on window focus and on a 24h interval while push is enabled,
 * then re-register with the backend if the token changed.
 */
export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [status, setStatus] = useState<PushPermissionStatus>(() => {
    if (!isFirebaseConfigured()) return 'unsupported';
    return mapBrowserPermission();
  });
  const [pushEnabled, setPushEnabled] = useState(readPushEnabled);
  const [errorMessage, setErrorMessage] = useState('');
  const lastTokenRef = useRef<string | null>(null);

  const registerTokenWithBackend = useCallback(async (token: string) => {
    if (!isAuthenticated) {
      return;
    }
    if (lastTokenRef.current === token) {
      return;
    }
    await registerDeviceToken(token);
    lastTokenRef.current = token;
  }, [isAuthenticated]);

  const fetchAndRegisterToken = useCallback(async (): Promise<string | null> => {
    const messaging = await getFirebaseMessaging();
    const vapidKey = getVapidKey();

    if (!messaging || !vapidKey) {
      throw new Error('Push notifications are not configured.');
    }

    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers are not supported in this browser.');
    }

    const registration = await navigator.serviceWorker.register(FIREBASE_SW_PATH);
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      throw new Error('Could not obtain a push token.');
    }

    await registerTokenWithBackend(token);
    return token;
  }, [registerTokenWithBackend]);

  const refreshTokenSilently = useCallback(async () => {
    if (!pushEnabled || status !== 'granted' || !isAuthenticated) {
      return;
    }

    try {
      await fetchAndRegisterToken();
    } catch {
      // Silent refresh — avoid disrupting the user; next focus will retry.
    }
  }, [fetchAndRegisterToken, isAuthenticated, pushEnabled, status]);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    setErrorMessage('');

    if (!isFirebaseConfigured()) {
      setStatus('unsupported');
      setErrorMessage('Push notifications are not configured.');
      return false;
    }

    if (typeof Notification === 'undefined') {
      setStatus('unsupported');
      setErrorMessage('This browser does not support notifications.');
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

      await fetchAndRegisterToken();
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
  }, [fetchAndRegisterToken]);

  const disablePushNotifications = useCallback(() => {
    setPushEnabled(false);
    writePushEnabled(false);
    lastTokenRef.current = null;
    setErrorMessage('');

    if (Notification.permission === 'denied') {
      setStatus('denied');
    } else {
      setStatus('idle');
    }
  }, []);

  useEffect(() => {
    if (!pushEnabled || status !== 'granted') {
      return;
    }

    void refreshTokenSilently();

    const onFocus = () => {
      void refreshTokenSilently();
    };

    window.addEventListener('focus', onFocus);
    const intervalId = window.setInterval(() => {
      void refreshTokenSilently();
    }, TOKEN_REFRESH_MS);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.clearInterval(intervalId);
    };
  }, [pushEnabled, refreshTokenSilently, status]);

  useEffect(() => {
    if (pushEnabled && status === 'granted' && isAuthenticated) {
      void refreshTokenSilently();
    }
  }, [isAuthenticated, pushEnabled, refreshTokenSilently, status]);

  return {
    status,
    pushEnabled,
    errorMessage,
    requestNotificationPermission,
    disablePushNotifications,
    refreshTokenSilently,
  };
}

/** Subscribe to foreground FCM messages. Returns an unsubscribe function. */
export async function subscribeToForegroundMessages(
  callback: (payload: ForegroundPushPayload) => void,
): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return null;
  }

  return onMessage(messaging, (payload) => {
    callback(payloadToForeground(payload));
  });
}
