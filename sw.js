// Source : https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers

const cacheName = "taftaf-cache-v1";

const appShellFiles = [
    "./",
    "./index.html",
    "./css/stylesheet.css",
    "./js/script.js",
    "./assets/images/icon-160.png",
    "./assets/images/icon-512.png"
];

self.addEventListener('install', evt=>{
    evt.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(appShellFiles);
        })
    );
    console.log("SW - Install", evt); 
});

self.addEventListener('activate', evt=>{
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    console.log("SW - Activate", evt);
});


// Vérifie la connexion de l'utilisateur
self.addEventListener('fetch', evt=>{
    // On évite toutes les requêtes qui ne sont pas en http
    if (!evt.request.url.startsWith('http')) return;

    evt.respondWith(
        (async () => {
            // Vérif si la ressource est dans le cache
            const ressource = await caches.match(evt.request);

            // Si elle oui, on l'envoie 
            if (ressource) {
                return ressource;
            }

            // Sinon on va chercher en ligne
            const response = await fetch(evt.request);

            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // On met la réponse en cache pour plus tard
            const cache = await caches.open(cacheName);
            cache.put(evt.request, response.clone());

            // On renvoie la ressource au navigateur
            return response;
        })(),
    );
});