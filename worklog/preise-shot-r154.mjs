import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const BASE = 'http://127.0.0.1:5175';
const OUT = '/tmp/see-now';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
async function dismissCookie(page) {
  try {
    const btn = page.locator('button:has-text("Akzeptieren")').first();
    if (await btn.count()) await btn.click({ timeout: 1200 });
    await page.waitForTimeout(300);
  } catch {}
}
async function dump(page, name) {
  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].map(img => {
      const r = img.getBoundingClientRect();
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        vis: r.bottom > 0 && r.top < innerHeight && r.width > 40,
      };
    });
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const facts = [...document.querySelectorAll('dt, .type-h3, h2, h3')].slice(0, 20).map(el => el.textContent.trim().slice(0, 80));
    return { h1, title: document.title, imgs: imgs.filter(i => i.vis || i.y < 2000).slice(0, 16), facts };
  });
  console.log('===', name, '===');
  console.log(JSON.stringify(info, null, 2));
}
for (const vp of [
  { w: 1440, h: 900, tag: 'preise-dsk' },
  { w: 390, h: 844, tag: 'preise-mob' },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/preise`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);
  await dismissCookie(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${vp.tag}-fold.png`, fullPage: false });
  await dump(page, vp.tag + '-fold');
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${vp.tag}-y1400.png`, fullPage: false });
  await page.evaluate(() => window.scrollTo(0, 2800));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${vp.tag}-y2800.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
console.log('DONE');
