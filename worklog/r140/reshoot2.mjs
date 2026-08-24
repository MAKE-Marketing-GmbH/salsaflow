import pw from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux140';
const B = 'http://127.0.0.1:5175';
const b = await chromium.launch();
async function shot(w, h, name, scrollSel) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto(B + '/privatstunden', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const btn = p.locator('button:has-text("Akzeptieren")');
  if (await btn.count()) {
    await btn.click();
    await p.waitForTimeout(600);
  }
  if (scrollSel) {
    await p.evaluate((s) => { const el = document.querySelector(s); if (el) el.scrollIntoView({ block: 'start' }); }, scrollSel);
    await p.waitForTimeout(900);
  }
  await p.screenshot({ path: `${OUT}/${name}.png` });
  await p.close();
  console.log('ok', name);
}
await shot(390, 844, 'privat-mobil-390');
await shot(1440, 730, 'privat-desktop-1440');
await shot(1440, 900, 'privat-desktop-when', 'section:nth-of-type(2)');
await shot(1440, 900, 'privat-desktop-flow', 'section:nth-of-type(3)');
await shot(390, 844, 'privat-mobil-when', 'section:nth-of-type(2)');
await shot(390, 844, 'privat-mobil-flow', 'section:nth-of-type(3)');
await b.close();
