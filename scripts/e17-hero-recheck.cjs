const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  // Mobile hero
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: 'reduce' });
  const mp = await m.newPage();
  await mp.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 25000 });
  await mp.evaluate(()=>{document.querySelectorAll('img').forEach(i=>{i.loading='eager';i.decoding='sync';});});
  await mp.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0),{timeout:15000}).catch(()=>{});
  await mp.waitForTimeout(600);
  await mp.screenshot({ path: '.marathon/e17-shots/recheck-mobile-home-s01.png' });
  // Desktop hero (top slice)
  const d = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const dp = await d.newPage();
  await dp.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 25000 });
  await dp.evaluate(()=>{document.querySelectorAll('img').forEach(i=>{i.loading='eager';i.decoding='sync';});});
  await dp.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0),{timeout:15000}).catch(()=>{});
  await dp.waitForTimeout(600);
  await dp.screenshot({ path: '.marathon/e17-shots/recheck-dsk-home-s01.png' });
  await b.close();
  console.log('recheck captured');
})();
