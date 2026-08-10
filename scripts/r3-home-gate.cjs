// Ship-Gate Home (Kritiker-Runde 3): prueft, dass die fixe Cookie-Leiste an KEINER
// Scrollposition Inhalt verdeckt, und dass die Primary-CTAs frei stehen.
const { chromium } = require('playwright-core');

const SELECTOR = 'main :is(h1,h2,h3,p,li,a,button,dt,dd,span,figcaption)';

async function run(browser, vp) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);

  // 1) Erstes Bild: Leiste steht, Fold muss trotzdem frei sein.
  const fold = await p.evaluate((sel) => {
    const acc = document.querySelector('[data-testid="cookie-accept"]');
    if (!acc) return { bannerVisible: false };
    const bb = acc.closest('[role="region"]').getBoundingClientRect();
    const hits = [];
    document.querySelectorAll(sel).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > window.innerHeight) return;
      if (el.querySelector(sel)) return;
      if (r.bottom > bb.top && r.top < bb.bottom) hits.push((el.textContent || '').trim().slice(0, 40));
    });
    return { bannerVisible: true, covered: hits };
  }, SELECTOR);

  // 2) Nach dem ersten Scroll muss die Leiste die Flaeche freigeben.
  const height = await p.evaluate(() => document.body.scrollHeight);
  const covered = [];
  let bannerStillCovering = false;
  for (let y = 400; y <= height; y += Math.round(vp.height * 0.8)) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(160);
    const r = await p.evaluate((sel) => {
      const acc = document.querySelector('[data-testid="cookie-accept"]');
      if (!acc) return { banner: false, covered: [] };
      const region = acc.closest('[role="region"]');
      if (getComputedStyle(region).visibility === 'hidden') return { banner: false, covered: [] };
      const bb = region.getBoundingClientRect();
      const hits = [];
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > window.innerHeight) return;
        if (el.querySelector(sel)) return;
        if (r.bottom > bb.top && r.top < bb.bottom) hits.push((el.textContent || '').trim().slice(0, 40));
      });
      return { banner: true, covered: hits };
    }, SELECTOR);
    if (r.banner) bannerStillCovering = true;
    covered.push(...r.covered);
  }

  // 3) Primary-CTAs vollstaendig sichtbar?
  const ctas = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('main a[href*="kontakt"]').forEach((el) => {
      const label = (el.textContent || '').trim();
      if (!label) return;
      const r = el.getBoundingClientRect();
      el.scrollIntoView({ block: 'center' });
      const r2 = el.getBoundingClientRect();
      const acc = document.querySelector('[data-testid="cookie-accept"]');
      const region = acc && acc.closest('[role="region"]');
      const hidden = !region || getComputedStyle(region).visibility === 'hidden';
      const bb = region ? region.getBoundingClientRect() : null;
      const clash = !hidden && bb && r2.bottom > bb.top && r2.top < bb.bottom;
      out.push({ label: label.slice(0, 40), h: Math.round(r.height), clash });
    });
    return out;
  });

  await ctx.close();
  return { vp: vp.width, fold, afterScrollBannerPresent: bannerStillCovering, covered, ctaClash: ctas.filter((c) => c.clash) };
}

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    console.log(JSON.stringify(await run(b, vp)));
  }
  await b.close();
})();
