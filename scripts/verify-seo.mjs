import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const origin = 'https://www.salsaflow-dc.com';
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function read(file) {
  check(fs.existsSync(file), `Datei fehlt: ${file}`);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

// Die Sollzahl stand hier einmal fest im Skript und brach bei jeder Routenaenderung.
// Die Routen-Wahrheit kommt aus demselben Manifest, aus dem scripts/prerender.mjs
// Sitemap und noindex-Flag erzeugt (`entry.getPrerenderManifest()`, dort als
// .data/prerender-manifest.json abgelegt). Frueher stand hier eine Regex ueber
// src/routes.tsx und src/lib/seo-config.ts: die haette bei mehrzeiliger Formatierung
// oder einem berechneten `indexable` stillschweigend andere Zahlen geliefert, ohne dass
// sich die Bedeutung aendert.
const manifestPfad = path.resolve('.data/prerender-manifest.json');
check(
  fs.existsSync(manifestPfad),
  `Prerender-Manifest fehlt: ${manifestPfad} — zuerst \`npm run build\` laufen lassen.`,
);
const manifest = fs.existsSync(manifestPfad) ? JSON.parse(read(manifestPfad)) : [];
check(manifest.length > 0, 'Prerender-Manifest ist leer.');
const soll = manifest.filter((route) => route.indexable !== false).length;
check(soll > 0, 'Keine indexierbare Route im Prerender-Manifest.');

// Vorgerendert, aber bewusst nicht indexierbar: die Datei existiert, steht in keiner
// Sitemap und muss noindex tragen. Ohne diesen Check deckt sich die Regel selbst zu,
// weil Sitemap-Laenge und Soll aus derselben Quelle stammen.
const noindexPfade = manifest.filter((route) => route.indexable === false).map((route) => route.path);

const sitemap = read(path.join(dist, 'sitemap.xml'));
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(urls.length === soll, `Sitemap hat ${urls.length} statt ${soll} kanonischen Routen.`);
check(new Set(urls).size === urls.length, 'Sitemap enthält doppelte URLs.');

for (const rawUrl of urls) {
  const url = new URL(rawUrl);
  const route = url.pathname;
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.slice(1)}.html`);
  const html = read(file);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  check(rawUrl.startsWith(origin), `Falsche Domain in Sitemap: ${rawUrl}`);
  check(html.includes('data-prerendered="true"'), `Kein vorgerendertes Root: ${route}`);
  check(h1Count === 1, `${route} hat ${h1Count} H1 im Roh-HTML.`);
  check(/<title>[^<]+<\/title>/i.test(html), `Titel fehlt: ${route}`);
  check(/<meta name="description" content="[^"]+"/i.test(html), `Description fehlt: ${route}`);
  check(html.includes(`<link rel="canonical" href="${rawUrl}"`), `Canonical falsch: ${route}`);
  check(/<meta name="robots" content="index, follow"/i.test(html), `Robots falsch: ${route}`);
  check(/<meta property="og:url" content="[^"]+"/i.test(html), `og:url fehlt: ${route}`);
  check(/<meta name="twitter:title" content="[^"]+"/i.test(html), `Twitter-Titel fehlt: ${route}`);
}

for (const file of ['admin.html', 'buchung.html', '404.html']) {
  const html = read(path.join(dist, file));
  check(/<meta name="robots" content="noindex, nofollow"/i.test(html), `${file} ist nicht noindex.`);
}

for (const route of noindexPfade) {
  const file = path.join(dist, `${route.slice(1)}.html`);
  const html = read(file);
  check(
    /<meta name="robots" content="noindex, nofollow"/i.test(html),
    `${route} ist vorgerendert, aber nicht noindex.`,
  );
  check(!/<link rel="canonical"/i.test(html), `${route} ist noindex, traegt aber ein Canonical.`);
  check(
    !urls.some((rawUrl) => new URL(rawUrl).pathname === route),
    `${route} ist noindex, steht aber in der Sitemap.`,
  );
}

if (failures.length) {
  process.stderr.write(`SEO-Verify FAIL\n${failures.map((failure) => `- ${failure}`).join('\n')}\n`);
  process.exit(1);
}

process.stdout.write(`SEO-Verify PASS: ${urls.length} Routen mit Titel, Description, Canonical, H1 und HTML-Text.\n`);
