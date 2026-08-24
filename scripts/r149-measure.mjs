// R149 Messung /mehr/collabs: FAB-Geometrie, FAB-ueber-Wort, Band-Crop.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.SF_BASE || 'http://127.0.0.1:5173';
const OUT = process.env.SF_SHOT_DIR || '/tmp/r149';
mkdirSync(OUT, { recursive: true });

async function dismissCookie(page) {
  try {
    const btn = page.locator('button:has-text("Akzeptieren"), button:has-text("Okay"), button:has-text("Accept")').first();
    if (await btn.count()) await btn.click({ timeout: 900 });
    await page.waitForTimeout(350);
  } catch { /* kein Banner */ }
}

// Textknoten-genaue Ueberdeckung: Range-Rects statt Element-Rects.
async function hits(page) {
  return page.evaluate(() => {
    const fab = document.querySelector('a.whatsapp-float');
    if (!fab) return { fab: null, hits: [] };
    const f = fab.getBoundingClientRect();
    const box = { x: f.x, y: f.y, w: f.width, h: f.height, text: (fab.textContent || '').trim() };
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (fab.contains(n)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (r.width < 1 || r.height < 1) continue;
        const over = !(r.x + r.width <= f.x || r.x >= f.x + f.width || r.y + r.height <= f.y || r.y >= f.y + f.height);
        if (over) out.push({ text: n.nodeValue.trim().slice(0, 60), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) });
      }
    }
    return { fab: box, hits: out };
  });
}

async function band(page) {
  return page.evaluate(() => {
    const img = document.querySelector('section img[fetchpriority="high"]');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return {
      src: img.getAttribute('src'),
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      objectPosition: cs.objectPosition,
      objectFit: cs.objectFit,
      natural: { w: img.naturalWidth, h: img.naturalHeight },
    };
  });
}

const tag = process.argv[2] || 'run';
const browser = await chromium.launch();
let bad = 0;

for (const vp of [{ w: 1440, h: 900, name: 'desktop-1440' }, { w: 390, h: 844, name: 'mobil-390' }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/mehr/collabs`, { waitUntil: 'networkidle' });
  await dismissCookie(page);
  await page.waitForTimeout(900);

  const b = await band(page);
  console.log(`\n=== ${vp.name} ===`);
  console.log('BAND', JSON.stringify(b));
  if (b) {
    // sichtbarer Quellbereich bei object-fit cover
    const s = Math.max(b.rect.w / b.natural.w, b.rect.h / b.natural.h);
    const sh = b.natural.h * s;
    const pct = parseFloat(String(b.objectPosition).split(' ')[1]) / 100;
    const top = (sh - b.rect.h) * pct;
    console.log(`SICHTBAR y ${((top / sh) * 100).toFixed(1)}% .. ${(((top + b.rect.h) / sh) * 100).toFixed(1)}%  (Scheitel 12.4%, Kinn 37.7%)`);
    if (top / sh > 0.124) { console.log('FAIL Scheitel abgeschnitten'); bad++; }
  }

  await page.screenshot({ path: `${OUT}/collabs-${vp.name}-${tag}-fold.png` });

  const marker = await page.evaluate(() => document.querySelectorAll('[data-collabs-page]').length);
  console.log('MARKER data-collabs-page:', marker);

  const top = await hits(page);
  console.log('FAB', JSON.stringify(top.fab));
  console.log('FAB-Treffer im Fold:', top.hits.length, JSON.stringify(top.hits));
  if (top.hits.length) bad++;

  // durchscrollen und pro Stopp messen
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = vp.h; y < total; y += Math.round(vp.h * 0.75)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(320);
    const r = await hits(page);
    if (r.hits.length) {
      bad++;
      console.log(`FAIL scrollY=${y} FAB deckt:`, JSON.stringify(r.hits));
      await page.screenshot({ path: `${OUT}/collabs-${vp.name}-${tag}-hit-${y}.png` });
    }
  }
  await ctx.close();
}

await browser.close();
console.log(bad === 0 ? '\nOK alle Checks gruen' : `\nFAIL ${bad} Befunde`);
process.exit(bad === 0 ? 0 : 1);
