import pw from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux140';
const B = 'http://127.0.0.1:5175';
const b = await chromium.launch();
async function shot(path, name) {
  const p = await b.newPage({ viewport: { width: 1440, height: 730 }, deviceScaleFactor: 1 });
  await p.goto(B + path, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('h1', { timeout: 15000 });
  await p.waitForTimeout(1200);
  const btn = p.locator('button:has-text("Akzeptieren")');
  if (await btn.count()) {
    await btn.first().click();
    await p.waitForTimeout(500);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  const info = await p.evaluate(() => ({ y: window.scrollY, href: location.href, h1: document.querySelector('h1')?.textContent?.slice(0, 80) }));
  console.log(name, info);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  await p.close();
}
await shot('/tanzkurse/salsa', 'regress-salsa-1440');
await shot('/tanzkurse/bachata', 'regress-bachata-1440');
await shot('/tanzkurse/heels', 'regress-heels-1440');
await b.close();
