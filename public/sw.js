// Service worker mínimo: apenas recepção de Web Push e clique na notificação.
// Sem estratégia de cache offline nesta fase — não é um requisito da Fase 1.

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json();

  event.waitUntil(
    self.registration.showNotification(payload.titulo ?? 'Ride2gether', {
      body: payload.corpo,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: payload.url ?? '/passeios' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/passeios';
  event.waitUntil(clients.openWindow(url));
});
