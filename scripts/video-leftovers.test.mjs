/**
 * Drives shipped SEO_META + Preise media + Mehr-route markers.
 * Run: node scripts/video-leftovers.test.mjs
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
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
assert.match(partys, /from 'motion\/react'/);

const css = read('src/index.css');
assert.match(css, /data-tanzschuhe-page/);
assert.match(css, /data-partys-page/);
assert.match(css, /data-collabs-page/);
assert.match(css, /object-position:\s*50% 8%/);
assert.match(css, /height:\s*13rem/);

const header = read('src/public/site/SiteHeader.tsx');
assert.match(header, /href: '\/mehr\/tanzschuhe'/);
assert.match(header, /href: '\/mehr\/partys'/);
assert.doesNotMatch(header, /href: '\/mehr'/);

const hero = read('src/public/home/Hero.tsx');
for (const shortcode of ['DYhKD7ONhfK', 'DahpxEVtWvm', 'DX-Cz9MNkG_']) {
  assert.match(hero, new RegExp(shortcode), `missing Hero source shortcode ${shortcode}`);
}

function inspectHeroVideo(relativePath, maxBytes, expectedWidth, expectedHeight) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(absolutePath), `missing Hero video ${relativePath}`);
  const bytes = fs.statSync(absolutePath).size;
  assert.ok(bytes <= maxBytes, `${relativePath} is ${bytes} bytes; cap is ${maxBytes}`);

  const probe = JSON.parse(
    execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration:stream=codec_type,codec_name,width,height',
        '-of',
        'json',
        absolutePath,
      ],
      { encoding: 'utf8' },
    ),
  );
  const streams = Array.isArray(probe.streams) ? probe.streams : [];
  assert.equal(streams.some((stream) => stream.codec_type === 'audio'), false, `${relativePath} contains audio`);
  const video = streams.find((stream) => stream.codec_type === 'video');
  assert.ok(video, `${relativePath} has no video stream`);
  assert.equal(video.codec_name, 'h264');
  assert.equal(video.width, expectedWidth);
  assert.equal(video.height, expectedHeight);
  assert.ok(Number(probe.format?.duration) >= 9 && Number(probe.format?.duration) < 10);
  return bytes;
}

const desktopHeroBytes = inspectHeroVideo(
  'public/videos/home-hero-instagram-muted.mp4',
  3 * 1024 * 1024,
  720,
  1280,
);
const mobileHeroBytes = inspectHeroVideo(
  'public/videos/home-hero-instagram-muted-mobile.mp4',
  1.5 * 1024 * 1024,
  480,
  854,
);

console.log('PASS video-leftovers', {
  descriptions: descriptions.length,
  firstPreisePhotos: mediaSrcs.slice(0, 2),
  heroBytes: { desktop: desktopHeroBytes, mobile: mobileHeroBytes },
});
