// Beweist, dass der mobile-nav-Treffer bei y=540 KEIN erreichbares Bedienelement ist,
// solange der Burger zu ist. Playwright-Sichtbarkeit allein reicht nicht — der Panel
// kollabiert per max-height/opacity, nicht per display:none. Harter Test:
// (1) elementFromPoint auf dem Link-Mittelpunkt -> trifft es den Link oder etwas anderes?
// (2) Ist ein Vorfahre per clip/overflow/max-height/opacity/pointer-events tot?
// (3) aria-expanded des Burgers.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:5175';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();
await p.goto(`${BASE}/kursplan`, { waitUntil: 'domcontentloaded' });
await p.waitForSelector('[data-schedule-hero-photo-img]', { timeout: 15000 });
await p.waitForLoadState('networkidle').catch(() => {});
await p.waitForTimeout(600);

const r = await p.evaluate(() => {
  const burger = document.querySelector('button[aria-controls="mobile-navigation"]');
  const panel = document.querySelector('#mobile-navigation');
  const link = document.querySelector('#mobile-navigation a[href="/schnupperstunde"]');
  const out = { burgerExpanded: burger?.getAttribute('aria-expanded') ?? null };
  if (panel) {
    const cs = getComputedStyle(panel);
    const pr = panel.getBoundingClientRect();
    out.panel = {
      rect: `${Math.round(pr.width)}x${Math.round(pr.height)} @y=${Math.round(pr.top)}`,
      maxHeight: cs.maxHeight, overflow: cs.overflow, opacity: cs.opacity,
      visibility: cs.visibility, pointerEvents: cs.pointerEvents, clipPath: cs.clipPath,
    };
  }
  if (link) {
    const lr = link.getBoundingClientRect();
    const cx = Math.round(lr.left + lr.width / 2);
    const cy = Math.round(lr.top + lr.height / 2);
    const hit = document.elementFromPoint(cx, cy);
    out.link = {
      rect: `${Math.round(lr.width)}x${Math.round(lr.height)} @y=${Math.round(lr.top)}`,
      probePoint: `${cx},${cy}`,
      hitTag: hit ? hit.tagName : null,
      hitIsTheLink: !!(hit && (hit === link || link.contains(hit) || hit.contains(link))),
      hitText: hit ? (hit.textContent || '').trim().slice(0, 30) : null,
    };
  }
  return out;
});
console.log(JSON.stringify(r, null, 2));

// Harter Beweis: Playwright selbst versucht zu klicken, ohne den Burger zu oeffnen.
try {
  await p.click('#mobile-navigation a[href="/schnupperstunde"]', { timeout: 2500, trial: true });
  console.log('CLICKABLE_WITHOUT_BURGER = true');
} catch (e) {
  console.log('CLICKABLE_WITHOUT_BURGER = false ->', String(e).split('\n')[0].slice(0, 120));
}
await b.close();
