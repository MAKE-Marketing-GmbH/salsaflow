const { chromium } = await import('/usr/lib/node_modules/playwright/index.mjs');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 730 }, deviceScaleFactor: 1 });
await p.goto('http://127.0.0.1:5175/tanzkurse/salsa', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const m = await p.evaluate(() => {
  const img = document.querySelector('main section img');
  return { cls: img.className, style: img.getAttribute('style'), src: img.getAttribute('src'), objPos: getComputedStyle(img).objectPosition };
});
console.log(JSON.stringify(m));
const EXPECT = 'aspect-[3/2] w-full object-cover object-center lg:aspect-[5/4]';
console.log('BYTE_EQUAL_R137:', m.cls === EXPECT);
console.log('INLINE_STYLE_NULL:', m.style === null);
await p.screenshot({ path: '/tmp/r138check/salsa-desktop-1440.png' });
await b.close();
