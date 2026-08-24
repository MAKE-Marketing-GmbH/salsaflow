/* R217-Messserver: liefert den Produktions-Build aus dist UND reicht /api an den
   laufenden Hono-Server (8787) durch.

   Warum es den braucht: die Kurskarten auf /tanzkurse kommen per fetchSchedule()
   von /api/public/schedule (CoursesPage.tsx). Ein reiner `npx serve -s dist`
   liefert keine API, showFallback greift, und es steht KEINE Karte im DOM —
   genau daran ist die erste R217-Messung gescheitert. Das war ein
   Umgebungsartefakt, kein Codebefund: der Kritiker hatte einen API-Server.

   `npm start` allein reicht nicht: server/index.ts bedient nur /api, keine
   statischen Routen (curl /tanzkurse -> 404). Darum diese Kombination. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const DIST = path.join(__dirname, '..', 'dist');
const API = Number(process.env.R217_API ?? 8787);
const PORT = Number(process.env.R217_PORT ?? 4753);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    if (url.pathname.startsWith('/api')) {
      const proxy = http.request(
        { host: '127.0.0.1', port: API, path: req.url, method: req.method, headers: req.headers },
        (up) => {
          res.writeHead(up.statusCode ?? 502, up.headers);
          up.pipe(res);
        },
      );
      proxy.on('error', () => {
        res.writeHead(502).end('api down');
      });
      req.pipe(proxy);
      return;
    }

    // Prerender-Vertrag: /tanzkurse liegt als dist/tanzkurse.html, / als dist/index.html.
    const clean = url.pathname.replace(/\/$/, '');
    const candidates = [
      path.join(DIST, url.pathname),
      path.join(DIST, `${clean || '/index'}.html`),
      path.join(DIST, clean, 'index.html'),
      path.join(DIST, 'index.html'),
    ];
    const file = candidates.find((p) => p.startsWith(DIST) && fs.existsSync(p) && fs.statSync(p).isFile());
    if (!file) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`r217 serve :${PORT} -> api :${API}`));
