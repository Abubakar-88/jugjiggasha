const CACHE_NAME = 'Jug-Jiggasha-v2.0.0';
const NOTIFICATION_TIME = 'saturday-23:08'; // শনিবার বেলা ৫টা

// Install event - Set up weekly notification
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed with weekly notifications');
  
  // Schedule weekly notification
  scheduleWeeklyNotification();
});

// Schedule weekly notification for Saturday 5 PM
function scheduleWeeklyNotification() {
  // Calculate next Saturday 5 PM
  const now = new Date();
  const nextSaturday = new Date(now);
  
  // Find next Saturday (6 = Saturday)
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(23, 8, 0, 0); // 5:00 PM

  const timeUntilNotification = nextSaturday.getTime() - now.getTime();

  console.log('Next notification scheduled for:', nextSaturday.toString());

  // Set timeout for notification
  setTimeout(() => {
     console.log('🎯 শনিবার সকাল ১১:০৬টা - নোটিফিকেশন দেখানো হচ্ছে...');
    showWeeklyNotification();
    // Schedule next notification (7 days later)
    setInterval(showWeeklyNotification, 7 * 24 * 60 * 60 * 1000);
  }, timeUntilNotification);
}

// Show weekly notification
function showWeeklyNotification() {
  const notificationOptions = {
    body: 'আজ শনিবার মাগরিবের পর দ্বীনী মজলিস অনুষ্ঠিত হবে। সকলকে উপস্থিত হওয়ার জন্য বিশেষ অনুরোধ।',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'weekly-mojlis',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'বিস্তারিত দেখুন'
      },
      {
        action: 'dismiss',
        title: 'বন্ধ করুন'
      }
    ],
    data: {
      url: '/events'
    }
  };

  self.registration.showNotification('সাপ্তাহিক দ্বীনী মজলিসের আমন্ত্রণ', notificationOptions)
    .then(() => console.log('Weekly notification shown successfully'))
    .catch(err => console.error('Failed to show notification:', err));
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    // Open the events page
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/events');
        }
      })
    );
  } else if (event.action === 'dismiss') {
    console.log('Notification dismissed by user');
  } else {
    // Default click behavior
    event.waitUntil(
      clients.openWindow('/events')
    );
  }
});

// Handle push events (for future server-side notifications)
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'push-notification',
        data: {
          url: data.url || '/'
        }
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (error) {
      console.error('Error processing push event:', error);
    }
  }
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SHOW_WELCOME_NOTIFICATION') {
    self.registration.showNotification('স্বাগতম! ইসলামী প্রশ্নোত্তর', {
      body: 'আপনি সফলভাবে অ্যাপটি ইন্সটল করেছেন। প্রতি শনিবার মজলিসের রিমাইন্ডার পাবেন।',
      icon: '/icon-192x192.png',
      tag: 'welcome'
    });
  }
  
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification(event.data.title || 'পরীক্ষামূলক নোটিফিকেশন', {
      body: event.data.body || 'নোটিফিকেশন সিস্টেম কাজ করছে!',
      icon: '/icon-192x192.png',
      tag: 'test'
    });
  }
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated with weekly notifications');
      return self.clients.claim();
    })
  );
});

// Fetch event - Cache strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((fetchResponse) => {
          // Cache successful responses
          if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        // Fallback for failed requests
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle background sync tasks here
  }
});