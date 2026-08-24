// R188 final6 / G5: dieselbe Overlap-Messung ueber MEHRERE Routen auf 390px.
import { chromium } from 'playwright-core';
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2)
  : ['/', '/preise', '/kursplan', '/tanzkurse', '/team', '/faq'];
const b = await chromium.launch({ headless: true, channel: 'chrome' });
let grand = 0;
for (const route of ROUTES) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:5175' + route, { waitUntil: 'networkidle' }).catch(() => {});
  await p.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2000 }).catch(() => {});
  await p.evaluate(() => document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }));
  await p.waitForFunction(() => Array.from(document.images).every(i => i.complete), { timeout: 15000 }).catch(() => {});
  const H = await p.evaluate(() => document.body.scrollHeight);
  let total = 0; const worst = [];
  for (let y = 0; y <= H; y += 200) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    // Settled-state-Gate: Scroll-Handler -> rAF -> React-State -> zweiter rAF.
    // 250ms war bei schnellen Serien-Spruengen noch in der Listener-Neuregistrierung.
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const fl = document.querySelector('a.whatsapp-float');
      if (!fl || parseFloat(getComputedStyle(fl).opacity) < 0.05) return [];
      const f = fl.getBoundingClientRect();
      if (f.width === 0) return [];
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
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const rr of rg.getClientRects()) {
          if (rr.width < 2 || rr.height < 2) continue;
          const ox = Math.min(f.right, rr.right) - Math.max(f.left, rr.left);
          const oy = Math.min(f.bottom, rr.bottom) - Math.max(f.top, rr.top);
          if (ox > 1 && oy > 1) out.push(`"${t.slice(0, 34)}" ${Math.round(ox)}x${Math.round(oy)}px`);
        }
      }
      return out;
    });
    total += r.length;
    if (r.length && worst.length < 3) worst.push(`y=${y} ${r[0]}`);
  }
  grand += total;
  console.log(`${route.padEnd(14)} OVERLAPS ${total}` + (worst.length ? '  z.B. ' + worst.join(' | ') : ''));
  await c.close();
}
console.log('GESAMT', grand);
await b.close();
