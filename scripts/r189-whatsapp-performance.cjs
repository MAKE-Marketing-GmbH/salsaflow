// R189: Verhindert den früheren Vollscan des DOM bei jedem Scroll-Frame.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/whatsapp-performance';
const TARGETS = [
  ['home-desktop', '/', { width: 1440, height: 900 }],
  ['kursplan-mobile', '/kursplan', { width: 390, height: 844 }],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [];

  for (const [name, route, viewport] of TARGETS) {
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    await context.addInitScript(() => {
      window.__r189DomReads = {
        computedStyles: 0,
        elementRects: 0,
        elementClientRects: 0,
        rangeRects: 0,
        treeWalkers: 0,
      };
      const computedStyle = window.getComputedStyle.bind(window);
      window.getComputedStyle = (...args) => {
        window.__r189DomReads.computedStyles += 1;
        return computedStyle(...args);
      };
      const elementRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function (...args) {
        window.__r189DomReads.elementRects += 1;
        return elementRect.apply(this, args);
      };
      const elementClientRects = Element.prototype.getClientRects;
      Element.prototype.getClientRects = function (...args) {
        window.__r189DomReads.elementClientRects += 1;
        return elementClientRects.apply(this, args);
      };
      const rangeRects = Range.prototype.getClientRects;
      Range.prototype.getClientRects = function (...args) {
        window.__r189DomReads.rangeRects += 1;
        return rangeRects.apply(this, args);
      };
      const createTreeWalker = Document.prototype.createTreeWalker;
      Document.prototype.createTreeWalker = function (...args) {
        window.__r189DomReads.treeWalkers += 1;
        return createTreeWalker.apply(this, args);
      };
    });

    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const counts = await page.evaluate(async () => {
      for (const key of Object.keys(window.__r189DomReads)) window.__r189DomReads[key] = 0;
      scrollTo(0, 0);
      for (let index = 0; index < 100; index += 1) {
        await new Promise((resolve) => requestAnimationFrame(() => {
          scrollBy(0, 18);
          resolve();
        }));
      }
      await new Promise((resolve) => setTimeout(resolve, 850));
      return { ...window.__r189DomReads };
    });
    results.push({ name, route, ...counts });
    await context.close();
  }

  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results));
  await browser.close();

  const failures = results.filter(
    (result) =>
      result.treeWalkers > 4 ||
      result.computedStyles > 6000 ||
      result.elementRects > 3000 ||
      result.elementClientRects > 3000 ||
      result.rangeRects > 3000,
  );
  if (failures.length) {
    throw new Error(`WhatsApp-Scrollkosten zu hoch: ${JSON.stringify(failures)}`);
  }
})();
