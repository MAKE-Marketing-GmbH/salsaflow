// R183 Fix-Runde 2: frische Belege.
//  1) Teamfoto-Karte in Ruhe (Cookie-Banner akzeptiert, sauber gescrollt, Nav nicht im Motiv)
//  2) Hero-Unterkante als eigener Shot — zeigt die 134px bis #angebot
import pw from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const b = await chromium.launch();
const OUT = '/root/clients/salsaflow-w1/worklog/watchdog/shots/R183';

async function prep(w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  // Cookie-Overlay wegklicken: es verdeckt sonst die Unterkante im Shot.
  const btn = p.getByRole('button', { name: /Akzeptieren|Accept/ });
  if (await btn.count()) { await btn.first().click(); await p.waitForTimeout(400); }
  return p;
}

for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const p = await prep(w, h);
  await p.waitForSelector('#team figure');
  // alles wecken, dann zurueck zum Team-Block und Motion ausklingen lassen
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
  await p.waitForTimeout(600);
  // Die Sektion so ins Bild holen, dass links/rechts der Viewportrand mitlaeuft.
  await p.evaluate(() => {
    const fig = document.querySelector('#team figure');
    const y = fig.getBoundingClientRect().top + scrollY;
    window.scrollTo(0, Math.max(0, y - 120));
  });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/team-fix-${name}.png` });
  console.log(`shot ${OUT}/team-fix-${name}.png`);
  await p.close();
}

// Hero-Unterkante: Beleg fuer Check B (134px bis #angebot, ohne Overlay)
{
  const p = await prep(1440, 900);
  await p.waitForTimeout(500);
  await p.evaluate(() => window.scrollTo(0, 380));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/hero-unterkante-desktop.png` });
  console.log(`shot ${OUT}/hero-unterkante-desktop.png`);
  await p.close();
}
await b.close();
