/* R188 WhatsApp-Verifier: prueft Text UND Bilder UND Flaechen, Desktop UND Mobil.
 *
 * Der Vorgaenger .r188f6-wa-multi.mjs las nur Textknoten und lief nur auf 390px. Er
 * meldete GESAMT 0, waehrend zwei Kritiker echte Treffer fanden: ein Foto auf Desktop
 * und ein Chip-Rand auf Mobil. Beide sind fuer einen reinen Text-Scan unsichtbar.
 *
 * Aufruf: node worklog/.r188-wa-verify.mjs
 * Ausgabe: pro Route/Viewport die Treffer, am Ende PASS/FAIL mit collisions=<n>.
 */
import { chromium } from 'playwright-core';

const BASE = 'http://127.0.0.1:5175';
const ROUTES = ['/', '/preise', '/tanzkurse', '/tanzkurse/heels', '/events-workshops/floweekend'];
const VIEWPORTS = [
  { name: 'd', width: 1440, height: 900 },
  { name: 'm', width: 390, height: 844 },
];

const findOverlaps = () => {
  const float = document.querySelector('a.whatsapp-float');
  if (!float) return { present: false, hits: [] };
  /* Ein ausgeblendeter Knopf verdeckt nichts. Der Solver setzt opacity:0 plus
     pointer-events:none, wenn auf einem Bildschirm kein freier Slot existiert. Wer diesen
     Zustand nicht abfragt, zaehlt unsichtbare Rechtecke als Treffer — genau das meldete
     dieser Verifier auf /events-workshops/floweekend y=506 faelschlich zweimal. */
  const fs = window.getComputedStyle(float);
  if (fs.display === 'none' || fs.visibility === 'hidden' || Number(fs.opacity) < 0.05) {
    return { present: false, hits: [] };
  }
  const wa = float.getBoundingClientRect();
  const vh = window.innerHeight;
  const hits = [];
  const overlap = (r) => {
    const w = Math.min(wa.right, r.right) - Math.max(wa.left, r.left);
    const h = Math.min(wa.bottom, r.bottom) - Math.max(wa.top, r.top);
    return w > 1 && h > 1 ? Math.round(Math.min(w, h)) : 0;
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    const parent = node.parentElement;
    if (!text || text.length < 2 || !parent || float.contains(parent)) continue;
    const st = window.getComputedStyle(parent);
    if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) < 0.05) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.bottom <= 0 || r.top >= vh) continue;
      const px = overlap(r);
      if (px) hits.push({ kind: 'text', px, what: text.slice(0, 48) });
    }
  }

  const viewportArea = window.innerWidth * vh;
  for (const el of document.querySelectorAll('img, svg, video, picture, li, button, [class*="rounded"]')) {
    if (float.contains(el)) continue;
    const st = window.getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) < 0.05) continue;
    const isMedia = ['IMG', 'SVG', 'VIDEO', 'PICTURE'].includes(el.tagName);
    const boxed =
      st.borderTopWidth !== '0px' &&
      st.borderBottomWidth !== '0px' &&
      st.borderLeftWidth !== '0px' &&
      st.borderRightWidth !== '0px';
    const filled =
      (st.backgroundColor !== 'rgba(0, 0, 0, 0)' && st.backgroundColor !== 'transparent') ||
      st.backgroundImage !== 'none';
    const hasSurface = boxed || filled;
    if (!isMedia && !hasSurface) continue;
    if (!isMedia && st.pointerEvents === 'none') continue;
    const r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= vh) continue;
    const visW = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
    const visH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (visW * visH > viewportArea * 0.7) continue;
    const px = overlap(r);
    if (px) {
      hits.push({
        kind: isMedia ? 'media' : 'surface',
        px,
        what: `${el.tagName.toLowerCase()} ${(el.getAttribute('src') || el.className || '').toString().slice(0, 48)}`,
      });
    }
  }
  return { present: true, hits, wa: { x: Math.round(wa.x), y: Math.round(wa.y) } };
};

const browser = await chromium.launch({ channel: 'chrome' });
let total = 0;
let reachable = 0;
let positions = 0;

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const docH = await page.evaluate(() => document.body.scrollHeight);
    const step = Math.round(vp.height * 0.6);
    for (let y = 0; y < docH - vp.height; y += step) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      /* Der Solver scannt zweimal: sofort und nach 700ms, weil Reveal-Elemente mit
         opacity:0 starten und der erste Scan sie zu Recht ignoriert. Unter 1500ms misst
         man den Zwischenstand statt des Ergebnisses. */
      await page.waitForTimeout(1500);
      const res = await page.evaluate(findOverlaps);
      positions += 1;
      if (res.present) reachable += 1;
      for (const hit of res.hits) {
        total += 1;
        console.log(`TREFFER ${vp.name} ${route} y=${y} ${hit.kind} ${hit.px}px :: ${hit.what}`);
      }
    }
    await ctx.close();
  }
}
await browser.close();

console.log(`ERREICHBAR ${reachable}/${positions} Scrollpositionen`);
console.log(`${total === 0 ? 'PASS' : 'FAIL'} whatsapp collisions=${total}`);
process.exit(total === 0 ? 0 : 1);
