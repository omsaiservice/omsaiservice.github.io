var C="omsai-v3",F=["/admin.html","/receipt.html","/manifest.json","/manifest-receipt.json","/icon-192.png","/icon-512.png","/icon-r192.png","/icon-r512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return Promise.all(F.map(function(u){return c.add(u).catch(function(){})}))}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
// Pages (html/json/js): pehle internet se naya lao (2.5 sec me na aaye to purana dikhao). Isse update turant dikhta hai.
function fresh(req){
 return new Promise(function(res){
  var done=false;
  var t=setTimeout(function(){caches.match(req).then(function(h){if(h&&!done){done=true;res(h)}})},2500);
  fetch(req,{cache:"no-cache"}).then(function(r){
   clearTimeout(t);
   if(r&&r.ok){var c=r.clone();caches.open(C).then(function(x){x.put(req,c)})}
   if(!done){done=true;res(r)}
  }).catch(function(){
   clearTimeout(t);
   caches.match(req).then(function(h){if(!done){done=true;res(h||Response.error())}});
  });
 });
}
self.addEventListener("fetch",function(e){
 var u=new URL(e.request.url);
 if(e.request.method!=="GET"||u.origin!==location.origin)return;
 if(e.request.mode==="navigate"||/\.(html|json|js)$/.test(u.pathname)||u.pathname==="/"){e.respondWith(fresh(e.request));return}
 e.respondWith(caches.open(C).then(function(c){return c.match(e.request).then(function(hit){
  var net=fetch(e.request).then(function(r){if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(function(){return hit});
  return hit||net;
 })}));
});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(clients.matchAll({type:"window"}).then(function(l){for(var i=0;i<l.length;i++){if(l[i].url.indexOf("admin.html")>-1)return l[i].focus()}return clients.openWindow("/admin.html")}))});
