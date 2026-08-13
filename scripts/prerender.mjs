import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const dist = path.join(root, 'dist');
const templatePath = path.join(dist, 'index.html');
const siteOrigin = 'https://www.salsaflow-dc.com';
const socialImage = 'https://www.salsaflow-dc.com/photos/showcase/hp-05.webp';

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

function upsertMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}=["']${key}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertCanonical(html, canonical) {
  const pattern = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  if (!canonical) return html.replace(pattern, '');
  const tag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function buildDocument(template, { route, title, description, body, noindex = false, canonical = true, prerendered = true }) {
  const canonicalUrl = `${siteOrigin}${route === '/' ? '/' : route}`;
  let html = template
    .replace(/<html\s+lang=["'][^"']*["']>/i, '<html lang="de-CH">')
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<div\s+id=["']root["'][^>]*>[\s\S]*?<\/div>/i,
      `<div id="root"${prerendered ? ' data-prerendered="true"' : ''}>${body}</div>`,
    );

  html = upsertMeta(html, 'name', 'description', description);
  html = upsertMeta(html, 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  html = upsertMeta(html, 'property', 'og:type', 'website');
  html = upsertMeta(html, 'property', 'og:site_name', 'Salsaflow Dance Company');
  html = upsertMeta(html, 'property', 'og:title', title);
  html = upsertMeta(html, 'property', 'og:description', description);
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl);
  html = upsertMeta(html, 'property', 'og:image', socialImage);
  html = upsertMeta(html, 'property', 'og:locale', 'de_CH');
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', title);
  html = upsertMeta(html, 'name', 'twitter:description', description);
  html = upsertMeta(html, 'name', 'twitter:image', socialImage);
  html = upsertCanonical(html, canonical ? canonicalUrl : null);
  return html;
}

async function writeRoute(route, html) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.slice(1)}.html`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}

function sitemapXml(paths) {
  const urls = paths
    .map((route) => `  <url>\n    <loc>${siteOrigin}${route === '/' ? '/' : route}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const template = await fs.readFile(templatePath, 'utf8');
// Eigener Cache-Ordner fuer den Prerender-Server. Grund: node_modules/.vite/deps kann einem
// anderen Benutzer gehoeren als dem, der baut. Vite raeumt den Ordner beim Start auf und
// scheitert dann mit EACCES. Ein eigener Ordner pro Build umgeht das Rechte-Problem ganz.
// Ueberschreibbar per VITE_CACHE_DIR.
const vite = await createServer({
  root,
  appType: 'custom',
  cacheDir: process.env.VITE_CACHE_DIR || path.join(root, 'node_modules', '.vite-prerender'),
  server: { middlewareMode: true },
});

try {
  const entry = await vite.ssrLoadModule('/src/entry-server.tsx');
  const manifest = entry.getPrerenderManifest();

  for (const route of manifest) {
    const rendered = entry.renderRoute(route.path);
    const html = buildDocument(template, {
      route: route.path,
      title: rendered.title,
      description: rendered.description,
      body: rendered.html,
    });
    await writeRoute(route.path, html);
  }

  const notFound = entry.renderRoute('/__not_found__');
  const notFoundHtml = buildDocument(template, {
    route: '/404',
    title: notFound.title,
    description: notFound.description,
    body: notFound.html,
    noindex: true,
    canonical: false,
  });
  await fs.writeFile(path.join(dist, '404.html'), notFoundHtml);

  // Leere Huellen fuer die zwei Routen, die im Browser aufbauen. Titel und Beschreibung kommen
  // aus SEO_META, damit sie nicht neben der echten Konfiguration veralten.
  for (const [route, file] of [['/admin', 'admin.html'], ['/buchung', 'buchung.html']]) {
    const meta = entry.getRouteMeta(route);
    const html = buildDocument(template, {
      route,
      title: meta.title,
      description: meta.description,
      body: '',
      noindex: true,
      canonical: false,
      prerendered: false,
    });
    await fs.writeFile(path.join(dist, file), html);
  }
  await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemapXml(manifest.map((route) => route.path)));

  process.stdout.write(`Prerender: ${manifest.length} Routen + 404 + Admin + Buchung\n`);
} finally {
  await vite.close();
}
