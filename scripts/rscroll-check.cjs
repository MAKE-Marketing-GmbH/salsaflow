/* R-Scroll: Einmal-Prüfskript für die 5 Scroll-Signature-Momente auf dem lokalen
   Preview (Port 5178). Screenshots nach worklog/shots/RSCROLL-CHECK/. */
const { chromium } = require('playwright-core');
const fs = require('fs');

const OUT = 'worklog/shots/RSCROLL-CHECK';
const BASE = 'http://localhost:5178';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });

  // 1) Home top: Hero sofort da?
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/home-top.png` });

  // Hero-Exit: halb rausgescrollt
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/home-hero-exit.png` });

  // 2) Stil-Sektion
  const offer = await page.evaluate(() => {
    const el = document.querySelector('[data-scroll-motion^="offer-"]');
    if (!el) return null;
    const r = el.closest('section')?.getBoundingClientRect();
    return r ? r.top + window.scrollY - 100 : null;
  });
  if (offer) {
    await page.evaluate((y) => window.scrollTo(0, y), offer);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/home-offer.png` });
  } else {
    console.log('WARN: keine offer-Karten gefunden');
  }

  // 3) Team-Stats (CountUp + Linie)
  const stats = await page.evaluate(() => {
    const dl = [...document.querySelectorAll('dl')].find((d) => /2018/.test(d.textContent) || /400/.test(d.textContent));
    if (!dl) return null;
    const r = dl.getBoundingClientRect();
    return r.top + window.scrollY - 400;
  });
  if (stats) {
    await page.evaluate((y) => window.scrollTo(0, y), stats);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/home-teamstats.png` });
    const txt = await page.evaluate(() => {
      const dl = [...document.querySelectorAll('dl')].find((d) => /2018/.test(d.textContent) || /400/.test(d.textContent));
      return dl ? dl.textContent.replace(/\s+/g, ' ').trim() : '';
    });
    console.log('TEAM-STATS TEXT:', txt);
  } else {
    console.log('WARN: Stats-dl nicht gefunden');
  }

  // 4) Marquee unten
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 2200));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/home-marquee-a.png` });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/home-marquee-b.png` });
  const marquee = await page.evaluate(() => {
    const el = document.querySelector('.flex.w-max');
    return el ? el.style.transform || getComputedStyle(el).transform : 'NOT FOUND';
  });
  console.log('MARQUEE TRANSFORM:', marquee);

  // 5) Unterseiten-H1 sofort sichtbar?
  for (const path of ['/preise', '/team']) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}${path.replace('/', '/sub-')}-top.png` });
    const h1 = await page.evaluate(() => {
      const h = document.querySelector('h1');
      if (!h) return { text: 'NO H1' };
      const spans = h.querySelectorAll('span');
      const hidden = [...spans].filter((s) => parseFloat(getComputedStyle(s).opacity) < 0.9).length;
      return { text: h.textContent.trim(), spans: spans.length, hiddenSpans: hidden, opacity: getComputedStyle(h).opacity };
    });
    console.log(`H1 ${path}:`, JSON.stringify(h1));
  }

  // 6) /tanzkurse/salsa Layout
  await page.goto(BASE + '/tanzkurse/salsa', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/sub-salsa-top.png` });
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/sub-salsa-mid.png` });

  await b.close();
  console.log('DONE');
})().catch((e) => { console.error(e); process.exit(1); });
