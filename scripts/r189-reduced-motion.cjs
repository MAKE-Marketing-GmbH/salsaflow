// R189: Belegt den ruhigen Laufzeitpfad für prefers-reduced-motion.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/reduced-motion';
const ROUTES = ['/', '/events', '/tanzkurse/salsa'];

function isIdentityTransform(value) {
  return value === 'none' || value === 'matrix(1, 0, 0, 1, 0, 0)' || value === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [];

  for (const route of ROUTES) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2500 }).catch(() => {});
    await page.evaluate(() => scrollTo(0, 0));

    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= maxScroll; y += 520) {
      await page.evaluate((nextY) => scrollTo(0, nextY), y);
      await page.waitForTimeout(360);
    }
    await page.evaluate((nextY) => scrollTo(0, nextY), maxScroll);
    await page.waitForTimeout(400);

    const state = await page.evaluate(() => {
      const markers = [...document.querySelectorAll('[data-reveal-variant]')];
      const variants = {};
      const failures = [];

      for (const marker of markers) {
        const variant = marker.getAttribute('data-reveal-variant') || 'unknown';
        variants[variant] = (variants[variant] || 0) + 1;
        const targets = [marker, ...marker.querySelectorAll('[style]')];
        for (const target of targets) {
          const style = getComputedStyle(target);
          const blur = style.filter.match(/blur\(([^)]+)\)/)?.[1];
          const filterOk = !blur || blur === '0px' || blur === '0';
          const clipOk = style.clipPath === 'none' || style.clipPath === 'inset(0% 0% 0%)' || style.clipPath === 'inset(0px)';
          const transformOk = style.transform === 'none' || style.transform === 'matrix(1, 0, 0, 1, 0, 0)' || style.transform === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
          if (!filterOk || !clipOk || !transformOk || Number(style.opacity) < 0.99) {
            failures.push({
              variant,
              tag: target.tagName.toLowerCase(),
              filter: style.filter,
              clipPath: style.clipPath,
              transform: style.transform,
              opacity: style.opacity,
            });
          }
        }
      }

      return {
        mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
        variants,
        progressBars: document.querySelectorAll('[data-scroll-progress]').length,
        failures,
      };
    });

    const invalidTransforms = state.failures.filter((failure) => !isIdentityTransform(failure.transform));
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '_');
    await page.screenshot({ path: `${OUT}/${slug}.png` });
    results.push({ route, ...state, invalidTransforms: invalidTransforms.length });
    await context.close();
  }

  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results));
  await browser.close();

  const failures = results.filter(
    (result) =>
      !result.mediaMatches ||
      result.progressBars !== 0 ||
      result.failures.length > 0 ||
      result.invalidTransforms !== 0 ||
      Object.values(result.variants).reduce((sum, count) => sum + count, 0) < 4,
  );
  if (failures.length) {
    throw new Error(`Reduced-Motion-Gate fehlgeschlagen: ${JSON.stringify(failures)}`);
  }
})();
