// Ist der "Folgeinhalt" unter dem Hero ein Overlay (fixed/sticky) statt echter Nachbar?
// Und wie gross ist die Luft, wenn man Overlays ausschliesst?
import pw from '/usr/lib/node_modules/playwright/index.js';
const b = await pw.chromium.launch();
for (const [name, w] of [['desktop', 1440], ['mobile', 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const floating = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const pos = getComputedStyle(n).position;
        if (pos === 'fixed' || pos === 'sticky') return true;
      }
      return false;
    };
    const hero = [...document.querySelectorAll('img,video')]
      .filter((el) => { const q = el.getBoundingClientRect(); return q.top < 400 && q.width > 400 && q.height > 200; })
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (!hero) return { noHero: true };
    const hb = hero.getBoundingClientRect().bottom;
    const cands = [...document.querySelectorAll('h1,h2,h3,p,img,a,button')]
      .map((el) => ({ el, q: el.getBoundingClientRect() }))
      .filter(({ el, q }) => q.top >= hb - 1 && q.height > 8 && !el.contains(hero))
      .sort((a, b) => a.q.top - b.q.top);
    const raw = cands[0];
    const solid = cands.find(({ el }) => !floating(el));
    return {
      rawTag: raw.el.tagName, rawText: (raw.el.textContent || '').trim().slice(0, 30),
      rawFloating: floating(raw.el), rawGap: +(raw.q.top - hb).toFixed(1),
      solidTag: solid.el.tagName, solidText: (solid.el.textContent || '').trim().slice(0, 30),
      solidSection: solid.el.closest('section')?.id || '(kein id)',
      solidGap: +(solid.q.top - hb).toFixed(1),
      solidInTeam: !!solid.el.closest('#team'),
    };
  });
  console.log(`\n== ${name} ${w}px ==`);
  console.log(JSON.stringify(r, null, 2));
  await b.close?.bind(b);
  await p.close();
}
await b.close();
