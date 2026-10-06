var C="omsai-v2",F=["/admin.html","/manifest.json","/icon-192.png","/icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}).catch(function(){}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
 var u=new URL(e.request.url);
 if(e.request.method!=="GET"||u.origin!==location.origin)return;
 e.respondWith(caches.open(C).then(function(c){return c.match(e.request).then(function(hit){
  var net=fetch(e.request).then(function(r){if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(function(){return hit});
  return hit||net;
 })}));
});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(clients.matchAll({type:"window"}).then(function(l){for(var i=0;i<l.length;i++){if(l[i].url.indexOf("admin.html")>-1)return l[i].focus()}return clients.openWindow("/admin.html")}))});
