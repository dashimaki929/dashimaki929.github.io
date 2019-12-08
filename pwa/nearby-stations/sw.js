var CACHE_DYNAMIC_VERSION = 'dynamic-v1';

self.addEventListener('fetch', event => {
	console.log('[Service Worker] Fetching something ...');
	event.respondWith(
		// キャッシュの存在チェック
		caches.match(event.request)
			.then(response => {
				if (response) {
					return response;
				} else {
					// キャッシュがなければリクエストを投げて、レスポンスをキャッシュに入れる
					return fetch(event.request)
						.then(res => {
							return caches.open(CACHE_DYNAMIC_VERSION)
								.then(cache => {
									// 最後に res を返せるように、ここでは clone() する必要がある
									cache.put(event.request.url, res.clone());
									return res;
								})
						})
						.catch(() => {});
				}
			})
	);
});