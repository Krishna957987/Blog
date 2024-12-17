const CACHE_NAME = "pwa-cache-v1";
const URLS_TO_CACHE = [
 "/",
 "/home.html",
 "/js/home.js",
 "/editor.html",
 "/js/editor.js",
];


// Install service worker and cache assets
self.addEventListener("install", (event) => {
 event.waitUntil(
   caches.open(CACHE_NAME).then((cache) => {
     console.log("Service Worker: Caching assets");
     return cache.addAll(URLS_TO_CACHE);
   })
 );
});


// Activate service worker
self.addEventListener("activate", (event) => {
 console.log("Service Worker: Activated");
});


// Fetch assets from the cache first, then network if needed
self.addEventListener("fetch", (event) => {
 event.respondWith(
   caches.match(event.request).then((cachedResponse) => {
     return cachedResponse || fetch(event.request);
   })
 );
});