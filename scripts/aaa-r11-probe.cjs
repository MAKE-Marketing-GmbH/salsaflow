// Runde 2026-08-09 (r11): misst die Geometrie der beiden Home-Stellen, an denen die Kritik
// haengt — das full-bleed Teamfoto (welcher Bildausschnitt landet im Band?) und die vier
// Gruender-Panels (Breiten/Ober-/Unterkanten). Rein lesend, veraendert die Seite nicht.
// Aufruf: node scripts/aaa-r11-probe.cjs [width]
const { chromium } = require('/usr/lib/node_modules/playwright');
const W = Number(process.argv[2] || 1440);

(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const H = document.body.scrollHeight;
    for (let y = 0; y <= H; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);

  // Teamfoto: aus Bandmassen + object-position ausrechnen, WELCHER Prozentstreifen der
  // Originaldatei sichtbar ist. Genau das entscheidet, ob Logo/Koepfe angeschnitten sind.
  const band = await p.evaluate(() => {
    const img = document.querySelector('#team figure img');
    const r = img.getBoundingClientRect();
    const posY = parseFloat(getComputedStyle(img).objectPosition.split(' ')[1]) / 100;
    const scale = r.width / img.naturalWidth;          // object-cover, Breite fuellt
    const rendered = img.naturalHeight * scale;        // Hoehe des skalierten Motivs
    const offset = (rendered - r.height) * posY;       // was oben weggeschnitten wird
    return {
      boxW: Math.round(r.width), boxH: Math.round(r.height),
      nat: [img.naturalWidth, img.naturalHeight],
      objectPosition: getComputedStyle(img).objectPosition,
      visibleTopPct: +(offset / rendered * 100).toFixed(1),
      visibleBotPct: +((offset + r.height) / rendered * 100).toFixed(1),
    };
  });
  console.log('teamband', JSON.stringify(band));

  const founders = await p.evaluate(() => {
    const ul = document.querySelector('#team ul');
    const r = ul.getBoundingClientRect();
    return {
      ulH: Math.round(r.height),
      items: [...ul.children].map((li) => {
        const lr = li.getBoundingClientRect();
        const im = li.querySelector('img').getBoundingClientRect();
        return {
          w: Math.round(lr.width),
          top: Math.round(lr.top - r.top),
          bot: Math.round(lr.bottom - r.top),
          panelH: Math.round(li.querySelector('div').getBoundingClientRect().height),
          imgH: Math.round(im.height),
        };
      }),
    };
  });
  console.log('founders', JSON.stringify(founders));
  await b.close();
})();
