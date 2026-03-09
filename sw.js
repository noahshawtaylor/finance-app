self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    var bills = e.data.bills;
    var now = Date.now();
    bills.forEach(function(bill) {
      var threeDayMs = bill.dueTimestamp - (3 * 24 * 60 * 60 * 1000);
      if (threeDayMs > now) {
        setTimeout(function() {
          self.registration.showNotification('Bill in 3 Days', {
            body: bill.name + ' (' + bill.amount + ') is due in 3 days',
            icon: '/icon-192.png', tag: 'bill-3d-' + bill.name
          });
        }, threeDayMs - now);
      }
      var oneDayMs = bill.dueTimestamp - (1 * 24 * 60 * 60 * 1000);
      if (oneDayMs > now) {
        setTimeout(function() {
          self.registration.showNotification('Bill Due Tomorrow', {
            body: bill.name + ' (' + bill.amount + ') is due tomorrow!',
            icon: '/icon-192.png', tag: 'bill-1d-' + bill.name
          });
        }, oneDayMs - now);
      }
    });
  }
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(clients) {
      if (clients.length > 0) { clients[0].focus(); }
      else { self.clients.openWindow('/'); }
    })
  );
});
