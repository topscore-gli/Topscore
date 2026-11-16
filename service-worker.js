const CACHE_NAME='topscore-shell-v4';
const SHELL=['./','./index.html','./dashboard.html','./courses.html','./course-catalog.json','./auth.html','./manifest.json','./offline.html','./img/logo.png','./img/icon-192.png','./img/icon-512.png','./assets/dashboard/jamb-hero-student.png','./assets/dashboard/study-trophy.png','./assets/dashboard/student-avatar-male.png','./assets/dashboard/student-avatar-female.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('topscore-shell-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(response=>response).catch(async()=> (await caches.match(req))||(await caches.match('./offline.html'))));
    return;
  }
  const isShellAsset=SHELL.some(path=>new URL(path,self.location.href).pathname===url.pathname);
  if(!isShellAsset)return;
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok&&response.type==='basic'){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));}return response;})));
});