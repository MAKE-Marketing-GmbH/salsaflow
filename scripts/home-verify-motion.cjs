// Verify Motion-Bar der Startseite (Runde 1, 2026-08-07).
// Prueft am gerenderten DOM: EINE Signatur, prefers-reduced-motion laesst nichts unsichtbar.
// Aufruf: node scripts/home-verify-motion.cjs
const { chromium } = require('/usr/lib/node_modules/playwright');

const BASE = 'http://localhost:5173';
let fails = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fails++;
};

async function scan(b, reducedMotion) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await page.waitForTimeout(1500);
  const res = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    // Alles, was nach dem Durchscrollen noch (fast) unsichtbar ist, ist haengengeblieben.
    const stuck = nodes.filter((n) => parseFloat(getComputedStyle(n).opacity) < 0.95);
    return {
      reveals: nodes.length,
      stuck: stuck.length,
      stuckSample: stuck.slice(0, 3).map((n) => (n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50)),
    };
  });
  await ctx.close();
  return res;
}

(async () => {
  const b = await chromium.launch();

  const normal = await scan(b, 'no-preference');
  console.log('normal:', JSON.stringify(normal));
  check('Reveal-Elemente vorhanden ([data-reveal])', normal.reveals > 0, `${normal.reveals}`);
  check('nach dem Scroll bleibt nichts unsichtbar', normal.stuck === 0, normal.stuckSample.join(' | '));

  const reduced = await scan(b, 'reduce');
  console.log('reduced:', JSON.stringify(reduced));
  check('prefers-reduced-motion: alles sichtbar', reduced.stuck === 0, reduced.stuckSample.join(' | '));
  check('reduced zeigt dieselben Elemente wie normal', reduced.reveals === normal.reveals,
    `${reduced.reveals} vs ${normal.reveals}`);

  await b.close();
  console.log(fails === 0 ? '\nALLE CHECKS GRUEN' : `\n${fails} CHECK(S) ROT`);
  process.exit(fails === 0 ? 0 : 1);
})();
