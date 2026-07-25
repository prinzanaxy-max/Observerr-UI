import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      import.meta.env.VITE_FIREBASE_VAPID_KEY,
  );

const getOrInitApp = (): FirebaseApp => {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp(firebaseConfig);
};

let messagingInstance: Messaging | null = null;
let messagingInitPromise: Promise<Messaging | null> | null = null;

/** Lazy messaging instance — only available in supported browsers. */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (messagingInstance) {
    return messagingInstance;
  }

  if (!messagingInitPromise) {
    messagingInitPromise = isSupported().then((supported) => {
      if (!supported) {
        return null;
      }
      const app = getOrInitApp();
      messagingInstance = getMessaging(app);
      return messagingInstance;
    });
  }

  return messagingInitPromise;
}

export const getVapidKey = (): string => import.meta.env.VITE_FIREBASE_VAPID_KEY ?? '';

export const FIREBASE_SW_PATH = '/firebase-messaging-sw.js';
