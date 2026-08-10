// Verifiziert den WhatsAppFloat-Fix: Sobald der Footer im Viewport ist, muss der
// fixe FAB (a[href*="wa.me"]) aus dem DOM sein (Kritiker-Befund kursplan d-mid r10).
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:5173/kursplan', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  });
  const check = async (name, frac) => {
    await p.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f), frac);
    await p.waitForTimeout(600);
    const info = await p.evaluate(() => {
      const fab = [...document.querySelectorAll('a[href*="wa.me"]')].find(
        (a) => getComputedStyle(a).position === 'fixed',
      );
      const footer = document.querySelector('footer');
      const fr = footer.getBoundingClientRect();
      return {
        fabPresent: !!fab,
        footerTop: Math.round(fr.top),
        footerInViewport: fr.top < window.innerHeight,
      };
    });
    console.log(name, JSON.stringify(info));
    await p.screenshot({ path: `/tmp/fab-check-${name}.png` });
  };
  await check('top0', 0);
  await check('mid45', 0.45);
  await check('deep80', 0.8);
  await check('bottom', 1);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
