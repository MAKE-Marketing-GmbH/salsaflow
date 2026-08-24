// R183 Fix-Runde 2, Diagnose: WAS liegt wirklich unter dem Hero, und wo endet der Hero?
// Ziel: pruefen, ob "Luft unter dem Hero" ueberhaupt aus TeamBlock.tsx erreichbar ist.
import pw from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const b = await chromium.launch();

for (const [name, w] of [['desktop', 1440], ['mobile', 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  const m = await p.evaluate(() => {
    const abs = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, h: r.height }; };
    // Hero = grosses Medium ganz oben (gleiche Definition wie G31).
    const hero = [...document.querySelectorAll('img, video')]
      .filter((el) => { const r = el.getBoundingClientRect(); return r.top < 400 && r.width > 400 && r.height > 200; })
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    const heroBottom = hero ? abs(hero).bottom : null;
    const heroSection = hero ? hero.closest('section') : null;
    const next = [...document.querySelectorAll('h1,h2,h3,p,img,a,button')]
      .map((el) => ({ el, a: abs(el) }))
      .filter(({ el, a }) => a.top >= heroBottom - 1 && a.h > 8 && !el.contains(hero))
      .sort((x, y) => x.a.top - y.a.top)[0];
    const team = document.querySelector('#team');
    const fig = document.querySelector('#team figure');
    // direkte Sektion VOR #team
    const prev = team ? team.previousElementSibling : null;
    return {
      heroBottom,
      heroSectionBottom: heroSection ? abs(heroSection).bottom : null,
      heroSectionId: heroSection ? (heroSection.id || heroSection.getAttribute('data-design-unit') || '(kein id)') : null,
      nextTag: next ? next.el.tagName : null,
      nextClosestSection: next ? (next.el.closest('section')?.id || '(kein id)') : null,
      gapUnderHero: next ? next.a.top - heroBottom : null,
      teamTop: team ? abs(team).top : null,
      figTop: fig ? abs(fig).top : null,
      prevTag: prev ? (prev.id || prev.tagName) : null,
      prevBottom: prev ? abs(prev).bottom : null,
      teamPadTop: team ? getComputedStyle(team).paddingTop : null,
    };
  });
  console.log(`\n== ${name} ${w}px ==`);
  for (const [k, v] of Object.entries(m)) console.log(`  ${k.padEnd(20)} ${v}`);
  console.log(`  --> Hero endet y=${Math.round(m.heroBottom)}, #team beginnt y=${Math.round(m.teamTop)}, Abstand ${Math.round(m.teamTop - m.heroBottom)}px`);
  await p.close();
}
await b.close();
