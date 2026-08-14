const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  for (const W of [390, 768, 1024, 1440]) {
    const p = await (await b.newContext({ viewport: { width: W, height: 900 } })).newPage();
    await p.goto('http://localhost:5173/events', { waitUntil: 'networkidle' });
    const img = p.locator('img[src*="party-52"]');
    await img.scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    await img.screenshot({ path: `/tmp/band-${W}.png` });
    await p.close();
  }
  await b.close();
})();
