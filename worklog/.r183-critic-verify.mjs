import pw from '/usr/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const b = await chromium.launch();
for (const [tag, w, h] of [['desktop',1440,900],['mobile',390,844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const img = document.querySelector('img[src*="hp-29"]');
    if (!img) return { err: 'hp-29 nicht gefunden' };
    const fig = img.closest('figure');
    const fr = fig.getBoundingClientRect();
    const cs = getComputedStyle(fig);
    const sec = fig.closest('section');
    const prev = sec?.previousElementSibling;
    const pr = prev?.getBoundingClientRect();
    return {
      left: Math.round(fr.left), right: Math.round(innerWidth - fr.right),
      width: Math.round(fr.width), height: Math.round(fr.height),
      radius: cs.borderTopLeftRadius, marginTop: cs.marginTop,
      vw: innerWidth,
      prevTag: prev?.id || prev?.tagName,
      gapToPrev: pr ? Math.round(fr.top + scrollY - (pr.bottom + scrollY)) : null,
      secId: sec?.id,
    };
  });
  console.log(tag, JSON.stringify(r));
  await p.close();
}
await b.close();
