/* TreinoHoje — service worker: faz o app abrir sem internet.
   Ao mudar arquivos do app, aumente o número da versão abaixo. */
const CACHE = 'treinohoje-v51';
const CACHE_IMG = 'treinohoje-img-1'; // ilustrações: ficam guardadas entre versões; troque o número se substituir imagens
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './icon.svg', './icon-maskable-512.png', './estilo.css', './app.js', './exercicios.js', './nuvem.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== CACHE_IMG).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // sincronização com o Supabase: sempre direto na rede, nunca do cache
  if (new URL(req.url).hostname.endsWith('supabase.co')) return;

  // Páginas: tenta a rede primeiro (para pegar atualizações), cai no cache sem internet
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Ilustrações: baixa só quando aparece e depois responde do cache (funciona sem internet)
  if (new URL(req.url).pathname.includes('/img/ex/')) {
    e.respondWith(
      caches.open(CACHE_IMG).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; })))
    );
    return;
  }

  // Arquivos do próprio app (css, js, ícones): rede primeiro, para página e código nunca ficarem em versões diferentes
  if (new URL(req.url).origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // Arquivos de fora (fontes do Google): responde do cache e atualiza em segundo plano
  e.respondWith(
    caches.match(req).then(cached => {
      const rede = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || rede;
    })
  );
});
