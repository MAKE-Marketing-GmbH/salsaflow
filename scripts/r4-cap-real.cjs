// Runde-4-Nachprüfung: Screenshots MIT durchgescrollten Reveals (Lazy/IntersectionObserver),
// weil die Workflow-Captures fullPage ohne Scroll gemacht haben und Reveal-Sektionen
// dadurch als "leere Platzhalter" / "Creme-Void" erschienen.
const { chromium } = require('playwright-core');
const OUT = process.env.OUT || '/tmp';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const shoot = async (url, name, vp, mobile) => {
    const p = await b.newPage({ viewport: vp, isMobile: !!mobile, hasTouch: !!mobile });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
    });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${OUT}/real-${name}-full.png`, fullPage: true });
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/real-${name}-mid.png` });
    await p.close();
  };
  await shoot('http://localhost:5173/', 'home-d', { width: 1440, height: 900 });
  await shoot('http://localhost:5173/team', 'team-d', { width: 1440, height: 900 });
  await shoot('http://localhost:5173/kursplan', 'kursplan-m', { width: 390, height: 844 }, true);
  await b.close(); console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
