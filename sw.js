/**
 * Raahi Service Worker
 * Handles Web Push notifications for new inbox bookings.
 */

const WORKER_URL = 'https://raahi-worker.prashant-balepur.workers.dev';
const APP_URL    = 'https://pbalepur.github.io/raahi/japan.html#bookings';

// ─── Push event ───────────────────────────────────────────────────────────────

self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let body = 'New booking received — tap to review';

    // Fetch latest pending bookings so we can show the booking name
    try {
      const res = await fetch(`${WORKER_URL}/api/pending`);
      if (res.ok) {
        const bookings = await res.json();
        if (bookings.length === 1) {
          body = `${bookings[0].name || 'New booking'} — tap to review`;
        } else if (bookings.length > 1) {
          body = `${bookings.length} new bookings — tap to review`;
        }
      }
    } catch { /* show generic message */ }

    return self.registration.showNotification('📬 Raahi', {
      body,
      icon:      '/raahi/icon-192.png',
      badge:     '/raahi/favicon-32.png',
      tag:       'raahi-inbox',   // replaces previous notification rather than stacking
      renotify:  true,
      data:      { url: APP_URL },
    });
  })());
});

// ─── Notification click ───────────────────────────────────────────────────────

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || APP_URL;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Focus existing tab if one is open
      for (const client of list) {
        if (client.url.includes('japan.html')) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
