const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
 "/",
 "/home.html",
 "/js/home.js",
 "/editor.html",
 "/js/editor.js",
 "/Icons/Blog1.png",
 "/Icons/Blog2.png",
 "/home.css"
];


// Install service worker and cache assets
self.addEventListener("install", (event) => {
 event.waitUntil(
   caches.open(CACHE_NAME).then((cache) => {
     console.log("Opened cache");
     return cache.addAll(urlsToCache);
   })
 );
});


self.addEventListener("fetch", (event) => {
 event.respondWith(
   caches.match(event.request).then((response) => {
     // Return the cached response if found, otherwise fetch from network
     return (
       response || fetch(event.request).catch(() => caches.match("/home.html"))
     );
   })
 );
});


// Activate service worker
self.addEventListener("activate", (event) => {
 const cacheWhitelist = [CACHE_NAME];
 event.waitUntil(
   caches.keys().then((cacheNames) => {
     return Promise.all(
       cacheNames.map((cacheName) => {
         if (!cacheWhitelist.includes(cacheName)) {
           return caches.delete(cacheName);
         }
       })
     );
   })
 );
});


