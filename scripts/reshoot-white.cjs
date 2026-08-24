const { chromium } = require('playwright-core');
(async () => {
  const jobs = [
    ['/kursplan', { width: 390, height: 844 }, 'fertig/r205/kursplan-m390-full.png'],
    ['/kursplan', { width: 390, height: 844 }, 'fertig/r205/kursplan-m390-fold.png'],
    ['/tanzkurse', { width: 360, height: 780 }, 'fertig/r205/tanzkurse-m360-full.png'],
    ['/tanzkurse', { width: 360, height: 780 }, 'fertig/r205/tanzkurse-m360-fold.png'],
  ];
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  for (const [route, viewport, out] of jobs) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:5173' + route, { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2000 }).catch(() => {});
    await page.evaluate(async () => {
      const step = innerHeight * 0.8;
      for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 150));
      }
      scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: out, fullPage: !out.includes('-fold') });
    console.log(out);
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
