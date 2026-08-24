// R188 final6 / G5: sucht auf 390px JEDE Scrollposition, an der die WhatsApp-Blase
// einen echten Textknoten ueberdeckt. Meldet OVERLAPS + die schlimmsten Treffer.
import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: true, channel: 'chrome' });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const p = await c.newPage();
await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
await p.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
await p.evaluate(() => document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }));
await p.waitForFunction(() => Array.from(document.images).every(i => i.complete), { timeout: 20000 }).catch(() => {});
const H = await p.evaluate(() => document.body.scrollHeight);
const hits = [];
for (let y = 0; y <= H; y += 200) {
  await p.evaluate(v => window.scrollTo(0, v), y);
  await p.waitForTimeout(90);
  const r = await p.evaluate(() => {
    const fl = document.querySelector('a[aria-label*="WhatsApp"].whatsapp-float');
    if (!fl) return null;
    const f = fl.getBoundingClientRect();
    if (f.width === 0) return null;
    const out = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walk.nextNode())) {
      const t = (n.textContent || '').trim();
      if (t.length < 3) continue;
      const el = n.parentElement;
      if (!el || fl.contains(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) {
        if (r.width < 2 || r.height < 2) continue;
        const ox = Math.min(f.right, r.right) - Math.max(f.left, r.left);
        const oy = Math.min(f.bottom, r.bottom) - Math.max(f.top, r.top);
        if (ox > 1 && oy > 1) out.push({ t: t.slice(0, 44), ox: Math.round(ox), oy: Math.round(oy) });
      }
    }
    return out;
  });
  if (r && r.length) hits.push({ y, hits: r });
}
let total = 0;
for (const h of hits) { total += h.hits.length; }
console.log('SCROLLPOSITIONEN MIT UEBERLAPPUNG:', hits.length);
for (const h of hits.slice(0, 12)) console.log(`  y=${h.y}  ` + h.hits.map(x => `"${x.t}" (${x.ox}x${x.oy}px)`).join(' | '));
console.log('OVERLAPS', total);
await b.close();
