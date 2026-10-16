importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js'); // notificações (OneSignal)
// Guarda só a "casca" do app (esta página e os ícones). Os dados vêm sempre do Google.
const CACHE = 'leitura-gas-v5';
const CASCA = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './favicon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CASCA))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // Google/Apps Script: direto da rede
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
