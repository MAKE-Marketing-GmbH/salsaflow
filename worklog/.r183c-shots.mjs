import pw from '/usr/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const OUT = '/root/clients/salsaflow-w1/worklog/watchdog/shots/R183';
fs.mkdirSync(OUT, { recursive: true });
const b = await pw.chromium.launch();
const accept = async (p) => {
  try {
    const btn = p.locator('button', { hasText: /Akzeptieren|Accept/ }).first();
    if (await btn.count()) { await btn.click({ timeout: 3000 }); await p.waitForTimeout(400); }
  } catch {}
};
for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await accept(p);
  await p.waitForSelector('#team figure');
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
  await p.waitForTimeout(700);
  // 1) Das Teamfoto als Karte, mit Rand links/rechts sichtbar.
  await p.locator('#team').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  await p.locator('#team').screenshot({ path: `${OUT}/r3-team-${name}.png` });
  // 2) Die Kante events -> team (der Wert, den diese Datei besitzt).
  const box = await p.evaluate(() => {
    const t = document.querySelector('#team');
    const prev = t.previousElementSibling;
    const r = prev.getBoundingClientRect();
    return { y: Math.max(0, r.bottom + scrollY - 260), h: 560 };
  });
  await p.screenshot({ path: `${OUT}/r3-kante-events-team-${name}.png`, fullPage: true, clip: { x: 0, y: box.y, width: w, height: box.h } });
  // 3) Die Hero-Unterkante (Beleg fuer den BLOCKER, nicht fuer einen Fix).
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  const hb = await p.evaluate(() => Math.round(document.querySelector('#main > section:first-child').getBoundingClientRect().bottom + scrollY));
  await p.screenshot({ path: `${OUT}/r3-hero-kante-${name}.png`, fullPage: true, clip: { x: 0, y: Math.max(0, hb - 300), width: w, height: 600 } });
  console.log(`${name}: geschrieben (heroBottom=${hb})`);
  await p.close();
}
await b.close();
