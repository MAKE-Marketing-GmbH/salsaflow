// R215: Crop-Suche fuer das gekuerzte Band. Die Rechnung sagt nur, WELCHER Quell-Y
// im Fenster liegt — ob die Kopfreihe angeschnitten ist, sagt nur das Bild.
// Darum: object-position live variieren und je Wert einen Fold-Shot ablegen.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = process.env.BASE || 'http://127.0.0.1:4732';
const OUT = process.env.OUT || '/root/clients/salsaflow-w1/worklog/shots/R215-crop';
const POSITIONS = (process.env.POS || '0,5,8,10,12,15').split(',');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 730 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  await page.goto(BASE + '/mehr/partys', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  for (const pos of POSITIONS) {
    const info = await page.evaluate((pos) => {
      const img = [...document.querySelectorAll('section img')].find(
        (el) => el.getBoundingClientRect().width > window.innerWidth * 0.9,
      );
      if (!img) return null;
      img.style.setProperty('object-position', `50% ${pos}%`, 'important');
      const b = img.getBoundingClientRect();
      const scale = b.width / img.naturalWidth;
      const overflow = img.naturalHeight * scale - b.height;
      const off = (overflow * Number(pos)) / 100;
      return {
        quellY: `${Math.round(off / scale)}-${Math.round((off + b.height) / scale)}`,
        bottom: Math.round(b.bottom),
      };
    }, pos);
    await page.waitForTimeout(350);
    const file = `${OUT}/partys-crop-${pos}.png`;
    await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
    console.log(`  pos ${String(pos).padStart(2)}%  Quell-Y ${info.quellY}  bandBottom=${info.bottom}  ${file}`);
  }
  await ctx.close();
  await browser.close();
})();
