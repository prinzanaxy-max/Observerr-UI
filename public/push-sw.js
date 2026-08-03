/* Observerr native Web Push service worker */
self.addEventListener('push', (event) => {
  let payload = { title: 'Observerr', body: 'You have a new notification', deepLink: '/' };
  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() };
    }
  } catch {
    try {
      payload.body = event.data?.text() || payload.body;
    } catch {
      // keep defaults
    }
  }

  const deepLink = typeof payload.deepLink === 'string' ? payload.deepLink : '/';
  const data = payload.data && typeof payload.data === 'object' ? payload.data : {};

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({
          type: 'OBSERVERR_PUSH',
          title: payload.title,
          body: payload.body,
          deepLink,
          data,
        });
      }

      const focused = clients.some((client) => client.focused);
      if (focused) return;

      await self.registration.showNotification(payload.title || 'Observerr', {
        body: payload.body || 'You have a new notification',
        data: { deepLink, ...data },
        icon: '/favicon.svg',
        badge: '/favicon.svg',
      });
    })(),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const deepLink =
    (event.notification.data && event.notification.data.deepLink) || '/';
  const target =
    typeof deepLink === 'string' && deepLink.startsWith('/') && !deepLink.startsWith('//')
      ? deepLink
      : '/';

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client) {
            await client.navigate(target);
          } else {
            client.postMessage({ type: 'OBSERVERR_NAVIGATE', deepLink: target });
          }
          return;
        }
      }
      await self.clients.openWindow(target);
    })(),
  );
});
