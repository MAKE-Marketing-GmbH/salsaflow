import pw from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
console.log(await p.evaluate(() => {
  const secs = [...document.querySelectorAll('main section, body > section')];
  const hero = secs.find(s => s.id === 'hero') || secs[0];
  const team = document.querySelector('#team');
  const hr = hero.getBoundingClientRect();
  const tr = team.getBoundingClientRect();
  return JSON.stringify({
    heroId: hero.id || hero.tagName,
    heroBottomAbs: Math.round(hr.bottom + scrollY),
    teamTopAbs: Math.round(tr.top + scrollY),
    sectionOrder: secs.map(s => s.id || s.tagName).slice(0, 12),
  }, null, 1);
}));
await b.close();
