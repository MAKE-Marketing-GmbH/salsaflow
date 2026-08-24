// R188 final6: misst die Geometrie der Blase gegen die Textspalte auf 390px.
import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: true, channel: 'chrome' });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const p = await c.newPage();
for (const route of ['/', '/preise']) {
  await p.goto('http://127.0.0.1:5175' + route, { waitUntil: 'networkidle' });
  await p.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2000 }).catch(() => {});
  await p.evaluate(() => window.scrollTo(0, 1200));
  await p.waitForTimeout(200);
  const g = await p.evaluate(() => {
    const fl = document.querySelector('a.whatsapp-float');
    if (!fl) return null;
    const f = fl.getBoundingClientRect();
    const cs = getComputedStyle(fl);
    return { left: Math.round(f.left), right: Math.round(f.right), w: Math.round(f.width), h: Math.round(f.height), vw: innerWidth, pad: cs.paddingLeft + '/' + cs.paddingRight };
  });
  console.log(route, JSON.stringify(g));
}
await b.close();
