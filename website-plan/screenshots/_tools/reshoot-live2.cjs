const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222', { timeout: 90000 });
  const ctx = browser.contexts()[0];
  const targets = [
    ['https://www.salsaflow-dc.com/kurse/privatstunden/', 'live-privatstunden-desktop-full.png'],
    ['https://www.salsaflow-dc.com/kurse/', 'live-kurse-desktop-full.png'],
  ];
  for (const [url, name] of targets) {
    const page = await ctx.newPage();
    try {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(()=>{});
      for (const t of ['Okay','Alle akzeptieren','Akzeptieren','Zustimmen']) {
        try { await page.getByRole('button', { name: t }).first().click({ timeout: 1500 }); break; } catch {}
      }
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
        window.scrollTo(0, 0);
      });
      await page.waitForFunction(() => [...document.images].every(i => i.complete), { timeout: 8000 }).catch(()=>{});
      await page.waitForTimeout(800);
      await page.screenshot({ path: 'website-plan/screenshots/2026-08-12/' + name, fullPage: true });
      console.log('SHOT', name, url);
    } finally { await page.close(); }
  }
  console.log('DONE');
})();
