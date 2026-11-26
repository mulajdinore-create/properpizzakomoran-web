// Service worker i thjeshtë: e ruan faqen që aplikacioni të hapet edhe pa internet
const CACHE = 'dergesat-v1';
const FILES = ['/shoferi/', '/shoferi/manifest.webmanifest', '/shoferi/icon-192.png', '/img/logo.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  // gjithmonë provo rrjetin së pari, që shoferi ta ketë versionin e fundit
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('/shoferi/'))));
});
