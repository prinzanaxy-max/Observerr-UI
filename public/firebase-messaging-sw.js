/**
 * Firebase Cloud Messaging service worker.
 *
 * IMPORTANT: Service workers cannot read Vite env vars at runtime.
 * Firebase web config is public by design — hardcoded values here are intentional.
 * Do NOT try to inject import.meta.env into this file.
 */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBU5Sut88KycrrondL_iSGpoZy9gfsgprg',
  authDomain: 'observerr-f836d.firebaseapp.com',
  projectId: 'observerr-f836d',
  storageBucket: 'observerr-f836d.firebasestorage.app',
  messagingSenderId: '940322602962',
  appId: '1:940322602962:web:d957206e172e4ae74c120b',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'Observerr';
  const body = payload.notification?.body ?? 'You have a new notification';

  self.registration.showNotification(title, {
    body,
    icon: '/observerr-logo.png',
    badge: '/observerr-logo.png',
    data: payload.data,
  });
});
