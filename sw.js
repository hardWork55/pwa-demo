const staticAssets= ["./","./app.css","./app.js"];
self.addEventListener("install",async event => {
	console.log("sw install");
	const cache = await caches.open("static-assets");
	cache.addAll(staticAssets)
})

self.addEventListener("fetch",async event => {
	console.log("sw fetch");
	const req = event.request;
	const url = new URL(req.url);
	if(url.origin === location.origin){
		event.respondWith(cacheFirst(req));
	}else{
		event.respondWith(networkFirst(req));
	}
})

async function cacheFirst(req){
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}

async function networkFirst(req){
	const cache = await caches.open("topics-dynamic");
	try{
		const res = await fetch(req);
		cache.put(req,res.clone());
		return res
	}catch(error){
		return await cache.match(req)
	}
}
