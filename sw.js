// Service Worker for persistent notifications.
// Must be registered over HTTPS.

self.addEventListener('install', (event) => {
    // Force the service worker to activate immediately
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    // Claim control of all clients
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'show_fall_notification') {
        const { title, body } = event.data;

        // Use the Service Worker's showNotification API for guaranteed push to the system bar
        self.registration.showNotification(title, {
            body: body,
            icon: 'https://placehold.co/64x64/FF0000/FFFFFF?text=🚨',
            vibrate: [500, 50, 500, 50, 500], // Aggressive vibration
            requireInteraction: true,        // Persistent notification
            tag: 'fall-alert-persistent',    // Ensures only one fall alert is active
        });
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Open the client app when the notification is tapped
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes('github.io') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/'); // Opens the main site
            }
        })
    );
});