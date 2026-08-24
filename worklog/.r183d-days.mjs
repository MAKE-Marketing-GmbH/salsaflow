// Warum meldete der Verifier "Wochentage=0"? Erst schauen, was wirklich im DOM steht,
// bevor ich die Assertion anfasse. Zwei Moeglichkeiten: (a) ich habe die Chips zerstoert,
// (b) mein Selektor war falsch. Der Unterschied entscheidet ueber Fix vs. Assertion.
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2] ?? 'http://127.0.0.1:5175';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 730 } });
const p = await ctx.newPage();
await p.goto(`${BASE}/kursplan`, { waitUntil: 'domcontentloaded' });
await p.waitForSelector('[data-schedule-hero-photo-img]', { timeout: 15000 });
await p.waitForLoadState('networkidle').catch(() => {});
await p.waitForTimeout(800);

const r = await p.evaluate(() => {
  const RE = /(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)/;
  const hits = [...document.querySelectorAll('button,a,[role="tab"],[role="button"]')]
    .filter((e) => RE.test(e.textContent || ''))
    .map((e) => {
      const rect = e.getBoundingClientRect();
      return {
        tag: e.tagName, role: e.getAttribute('role'),
        text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 34),
        w: Math.round(rect.width), h: Math.round(rect.height),
        visible: rect.width > 0 && rect.height > 0,
      };
    });
  return { count: hits.length, hits: hits.slice(0, 12) };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
