// R188 final6 / G2: misst JEDE Sektions-H2 der Startseite (font-size + line-height).
import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: true, channel: 'chrome' });
const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p = await c.newPage();
await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
const rows = await p.evaluate(() => {
  const main = document.querySelector('main');
  // Sektions-H2 = jede h2, plus die eine eingebettete Kapitelzeile (h3 in ScheduleTeaser).
  const out = [];
  for (const el of main.querySelectorAll('h2, h3')) {
    const cs = getComputedStyle(el);
    // sr-only / unsichtbare Ueberschriften zaehlen nicht zur SICHTBAREN Hierarchie.
    const r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.width <= 4 || r.height <= 4) continue;
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44);
    out.push({
      tag: el.tagName,
      cls: el.className.toString().split(/\s+/).filter(x => x.startsWith('type-')).join(',') || '(none)',
      fs: Math.round(parseFloat(cs.fontSize) * 10) / 10,
      lh: Math.round(parseFloat(cs.lineHeight) * 10) / 10,
      fw: cs.fontWeight,
      txt,
    });
  }
  return out;
});
const h2 = rows.filter(r => r.tag === 'H2');
for (const r of rows) console.log(`${r.tag} fs=${r.fs} lh=${r.lh} fw=${r.fw} [${r.cls}] ${r.txt}`);
const sizes = [...new Set(h2.map(r => r.fs))].sort((a, z) => a - z);
console.log('\nH2 COUNT', h2.length, 'DISTINCT SIZES', sizes.join('/'));
const gs = rows.find(r => r.txt.startsWith('Vom ersten Grundschritt'));
console.log('GRUNDSCHRITT', gs ? `${gs.tag} fs=${gs.fs} lh=${gs.lh} [${gs.cls}]` : 'NOT FOUND');
await b.close();
