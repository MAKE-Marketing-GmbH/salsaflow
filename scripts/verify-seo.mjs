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

const sitemap = read(path.join(dist, 'sitemap.xml'));
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(urls.length === 26, `Sitemap hat ${urls.length} statt 26 kanonischen Routen.`);
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

if (failures.length) {
  process.stderr.write(`SEO-Verify FAIL\n${failures.map((failure) => `- ${failure}`).join('\n')}\n`);
  process.exit(1);
}

process.stdout.write(`SEO-Verify PASS: ${urls.length} Routen mit Titel, Description, Canonical, H1 und HTML-Text.\n`);
