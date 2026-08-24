// Kann IRGENDEIN Wert aus TeamBlock.tsx die Hero-Unterkante bewegen?
// Test: alle Layout-Werte von #team im DOM auf Extremwerte setzen und die Hero-Kante nachmessen.
import pw from '/usr/lib/node_modules/playwright/index.js';
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await p.waitForSelector('#team figure');

const measure = () => p.evaluate(() => {
  const hero = document.querySelector('#main > section:first-child');
  const angebot = document.querySelector('#angebot');
  const hr = hero.getBoundingClientRect(), ar = angebot.getBoundingClientRect();
  const h2 = angebot.querySelector('h2').getBoundingClientRect();
  return {
    heroBottom: Math.round(hr.bottom + scrollY),
    angebotTop: Math.round(ar.top + scrollY),
    sectionGap: Math.round(ar.top - hr.bottom),
    gapToH2: Math.round(h2.top - hr.bottom),
  };
});
console.log('VORHER (unveraendert):', JSON.stringify(await measure()));

// TeamBlock maximal aufblasen: Sektionspolster + jedes Kind-Margin auf 400px.
await p.evaluate(() => {
  const t = document.querySelector('#team');
  t.style.paddingTop = '400px'; t.style.paddingBottom = '400px'; t.style.marginTop = '400px';
  t.querySelectorAll('*').forEach((el) => { el.style.marginTop = '400px'; });
});
await p.waitForTimeout(300);
console.log('NACHHER (#team + alle Kinder auf 400px):', JSON.stringify(await measure()));
console.log('\nBefund: aendert sich sectionGap/gapToH2 durch TeamBlock-Werte?');
await b.close();
