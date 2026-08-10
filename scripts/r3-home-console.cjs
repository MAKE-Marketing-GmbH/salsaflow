const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 500)));
  p.on('response', async (r) => {
    if (r.status() >= 400) {
      console.log('[' + r.status() + ']', r.url());
      try {
        console.log((await r.text()).slice(0, 600));
      } catch {}
    }
  });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  console.log('rootChildren', await p.evaluate(() => document.getElementById('root')?.childElementCount));
  await b.close();
})();
