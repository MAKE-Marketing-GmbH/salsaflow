// R183f — mobiler Crop im Cookie-OFFEN-Zustand (Erstbesucher). Dort klemmt
// index.css die Bandhoehe; eine niedrigere Box verbreitert das Quellfenster,
// darf den linken Anker aber nicht kippen.
import pkg from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const MANN_HAAR = 280, FRAU_HAAR_RECHTS = 1300;

const browser = await chromium.launch();
for (const state of ['cookie-offen', 'cookie-akzeptiert']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  if (state === 'cookie-akzeptiert') {
    await page.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  }
  await page.goto('http://127.0.0.1:5175/kursplan', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const m = await page.evaluate(() => {
    const img = document.querySelector('[data-schedule-hero-photo] img');
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    const natW = img.naturalWidth, natH = img.naturalHeight;
    const scale = Math.max(r.width / natW, r.height / natH);
    const drawnW = natW * scale, drawnH = natH * scale;
    const [px, py] = cs.objectPosition.split(' ');
    const pctX = px.endsWith('%') ? parseFloat(px) : 50;
    const pctY = py && py.endsWith('%') ? parseFloat(py) : 50;
    const offX = (drawnW - r.width) * (pctX / 100);
    const offY = (drawnH - r.height) * (pctY / 100);
    return {
      boxW: r.width, boxH: r.height, objectPosition: cs.objectPosition,
      srcLeft: offX / scale, srcRight: (offX + r.width) / scale,
      srcTop: offY / scale, srcBottom: (offY + r.height) / scale,
      radius: parseFloat(getComputedStyle(img.parentElement).borderTopLeftRadius) || 0,
      cookieDa: !!document.querySelector("[data-testid='cookie-accept']"),
    };
  });
  const kopfOk = m.srcLeft <= MANN_HAAR && m.srcRight >= FRAU_HAAR_RECHTS;
  console.log(`${state}: box ${m.boxW}x${m.boxH}, pos ${m.objectPosition}, Quelle x ${m.srcLeft.toFixed(0)}..${m.srcRight.toFixed(0)}, radius ${m.radius}px, Cookie-Leiste ${m.cookieDa}`);
  console.log(`   Mann-Haar x280 links drin: ${m.srcLeft <= MANN_HAAR} (${(MANN_HAAR - m.srcLeft).toFixed(0)}px Luft) | Frau-Haar x1300 rechts drin: ${m.srcRight >= FRAU_HAAR_RECHTS} | KOEPFE GANZ: ${kopfOk}`);
  await page.close();
}
await browser.close();
