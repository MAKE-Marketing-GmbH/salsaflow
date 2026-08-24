// Wem gehoert das Element direkt unter dem Hero? Beweis, dass es NICHT TeamBlock ist.
import pw from '/usr/lib/node_modules/playwright/index.js';
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
const r = await p.evaluate(() => {
  const hero = [...document.querySelectorAll('img,video')]
    .filter((el) => { const q = el.getBoundingClientRect(); return q.top < 400 && q.width > 400 && q.height > 200; })
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
  const hb = hero.getBoundingClientRect().bottom;
  const next = [...document.querySelectorAll('h1,h2,h3,p,img,a,button')]
    .map((el) => ({ el, q: el.getBoundingClientRect() }))
    .filter(({ el, q }) => q.top >= hb - 1 && q.height > 8 && !el.contains(hero))
    .sort((a, b) => a.q.top - b.q.top)[0];
  return {
    tag: next.el.tagName,
    text: (next.el.textContent || '').trim().slice(0, 60),
    cls: next.el.className.toString().slice(0, 140),
    sameSectionAsHero: hero.closest('section') === next.el.closest('section'),
    insideTeamBlock: !!next.el.closest('#team'),
    gap: +(next.q.top - hb).toFixed(1),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
