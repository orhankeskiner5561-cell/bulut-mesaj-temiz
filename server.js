const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function sendJson(res, status, data, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders
  });
  res.end(JSON.stringify(data));
}

async function handleNews(req, res, url) {
  try {
    const scope = String(url.searchParams.get('scope') || 'turkiye');
    const cat = String(url.searchParams.get('cat') || 'manset');
    const city = String(url.searchParams.get('city') || 'Samsun')
      .replace(/[^\p{L}\p{N} .-]/gu, '')
      .slice(0, 60);

    const map = {
      manset: 'son dakika önemli haberler',
      sondakika: 'son dakika',
      spor: 'spor futbol basketbol',
      magazin: 'magazin sanat ünlüler',
      muzik: 'müzik şarkıcı albüm konser müzik dünyası',
      ekonomi: 'ekonomi finans piyasalar',
      teknoloji: 'teknoloji yapay zeka bilim'
    };

    let q = map[cat] || map.manset;
    if (scope === 'local') q = `${city} ${q}`;
    else if (scope === 'world') q = `dünya ${q}`;
    else q = `Türkiye ${q}`;

    const rss = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=tr&gl=TR&ceid=TR:tr`;
    const r = await fetch(rss, { headers: { 'user-agent': 'Mozilla/5.0 VITRIN/1.0' } });
    if (!r.ok) throw new Error('news fetch failed');
    const xml = await r.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, 24)
      .map(m => {
        const x = m[1];
        const pick = t => ((x.match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`)) || [])[1] || '')
          .replace(/<!\[CDATA\[|\]\]>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        const title = pick('title');
        const link = pick('link');
        const pubDate = pick('pubDate');
        const srcMatch = x.match(/<source[^>]*>([\s\S]*?)<\/source>/);
        const source = (srcMatch?.[1] || 'Haber Kaynağı')
          .replace(/<!\[CDATA\[|\]\]>/g, '')
          .replace(/&amp;/g, '&');
        return { title, link, pubDate, source };
      })
      .filter(x => x.title && x.link);

    sendJson(res, 200, { scope, cat, city, items }, {
      'Cache-Control': 'public, max-age=0, s-maxage=180, stale-while-revalidate=300'
    });
  } catch (e) {
    sendJson(res, 500, { error: 'Haberler alınamadı', items: [] });
  }
}

function handleRegion(req, res) {
  const h = req.headers || {};
  let country = String(
    h['cf-ipcountry'] ||
    h['x-country-code'] ||
    h['x-vercel-ip-country'] ||
    ''
  ).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) country = '';
  sendJson(res, 200, { country }, { 'Cache-Control': 'no-store' });
}

function serveStatic(res, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400);
    return res.end('Bad Request');
  }

  if (decoded === '/') decoded = '/index.html';
  const relative = decoded.replace(/^\/+/, '');
  let filePath = path.resolve(ROOT, relative);
  if (!filePath.startsWith(path.resolve(ROOT) + path.sep) && filePath !== path.resolve(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.stat(filePath, (err2, stat2) => {
      if (err2 || !stat2.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Not Found');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/news') return handleNews(req, res, url);
  if (url.pathname === '/api/region') return handleRegion(req, res);
  return serveStatic(res, url.pathname);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`VITRIN running on port ${PORT}`);
});
