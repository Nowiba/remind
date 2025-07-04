importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyCSvfuFeeG0952SOT1s6yOPEyprPo_d22s",
  authDomain: "nowiba-project.firebaseapp.com",
  databaseURL: "https://nowiba-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nowiba-project",
  storageBucket: "nowiba-project.firebasestorage.app",
  messagingSenderId: "1058905312580",
  appId: "1:1058905312580:web:d2820c8dade0c3ebb45b11",
  measurementId: "G-F5Y0HKDJ6M"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage(payload => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png', // Ensure icon.png exists in your GitHub repo root
        data: { url: payload.data?.url || 'https://nowiba.github.io/remind/' } // Fallback URL
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const urlToOpen = event.notification.data.url || 'https://nowiba.github.io/remind/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // Open the URL in an existing window or a new one
                for (let client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
