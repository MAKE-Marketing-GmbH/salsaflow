/**
 * Drives shipped SEO_META + Preise media + Mehr-route markers.
 * Run: node scripts/video-leftovers.test.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const seo = read('src/lib/seo-config.ts');
const descRe = /description:\s*(?:\n\s*)?'([^']+)'/g;
const descriptions = [];
let m;
while ((m = descRe.exec(seo))) descriptions.push(m[1]);
assert.ok(descriptions.length >= 40, `expected many descriptions, got ${descriptions.length}`);
const counts = new Map();
for (const d of descriptions) counts.set(d, (counts.get(d) || 0) + 1);
const reused = [...counts.entries()].filter(([, n]) => n > 1);
assert.equal(reused.length, 0, `reused descriptions: ${JSON.stringify(reused)}`);

const preise = read('src/public/preise/content.ts');
const deBlock = preise.split('en: {')[0];
const mediaSrcs = [...deBlock.matchAll(/src:\s*'(\/photos\/[^']+)'/g)].map((x) => x[1]);
assert.ok(mediaSrcs.length >= 2, `preise DE media srcs: ${mediaSrcs.join(',')}`);
assert.notEqual(mediaSrcs[0], mediaSrcs[1], `first two preise photos are the same: ${mediaSrcs[0]}`);

const tanz = read('src/public/TanzschuhePage.tsx');
assert.match(tanz, /data-tanzschuhe-page/);
assert.match(tanz, /center \d+%/);
assert.match(tanz, /heels-shoes-stilllife|c\.hero\.image\.src/);

const partys = read('src/public/PartysPage.tsx');
assert.match(partys, /data-partys-page/);
assert.match(partys, /from 'framer-motion'/);

const css = read('src/index.css');
assert.match(css, /data-tanzschuhe-page/);
assert.match(css, /data-partys-page/);
assert.match(css, /data-collabs-page/);
assert.match(css, /object-position:\s*50% 10%/);
assert.match(css, /height:\s*20rem/);

const header = read('src/public/site/SiteHeader.tsx');
assert.match(header, /href: '\/mehr\/tanzschuhe'/);
assert.match(header, /href: '\/mehr\/partys'/);
assert.doesNotMatch(header, /href: '\/mehr'/);

console.log('PASS video-leftovers', {
  descriptions: descriptions.length,
  firstPreisePhotos: mediaSrcs.slice(0, 2),
});
