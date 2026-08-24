const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  for (const route of ['/preise', '/team', '/tanzkurse/salsa', '/']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:5175' + route, { waitUntil: 'domcontentloaded' });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const out = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const hb = h1.getBoundingClientRect();
      const lead = Array.from(document.querySelectorAll('p'))
        .map((p) => ({ p, b: p.getBoundingClientRect() }))
        .filter((x) => x.b.top >= hb.bottom - 1 && x.b.height > 0 && x.b.top - hb.bottom < 200)
        .sort((a, b) => a.b.top - b.b.top)[0];
      if (!lead) return { keinLead: true };
      const parent = lead.p.parentElement;
      const pcs = getComputedStyle(parent);
      return {
        h1ZuLead: Math.round(lead.b.top - hb.bottom),
        leadMt: getComputedStyle(lead.p).marginTop,
        elternDisplay: pcs.display, elternGap: pcs.rowGap,
      };
    });
    console.log(route.padEnd(18) + JSON.stringify(out));
    await ctx.close();
  }
  await browser.close();
})();
