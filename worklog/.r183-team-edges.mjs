// Kanten-Messung rund um #team: Events-Fuss -> Team-Kopf -> Intro -> Foto.
// Zeigt, ob die Luft ueber dem Foto als Sektions-Kopf oder als figure-mt sitzt.
import pw from '/usr/lib/node_modules/playwright/index.js';
const b = await pw.chromium.launch();
for (const [name, w] of [['desktop', 1440], ['mobile', 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForSelector('#team figure');
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const abs = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, w: r.width, h: r.height }; };
    const team = document.querySelector('#team');
    const prev = team.previousElementSibling;
    const fig = document.querySelector('#team figure');
    const cs = getComputedStyle(fig);
    const ts = getComputedStyle(team);
    const intro = team.querySelector('h2');
    const dl = team.querySelector('dl');
    return {
      prevId: prev.id || prev.tagName,
      prevBottom: Math.round(abs(prev).bottom),
      teamTop: Math.round(abs(team).top),
      teamPadTop: ts.paddingTop,
      introTop: Math.round(abs(intro).top),
      dlBottom: Math.round(abs(dl).bottom),
      figTop: Math.round(abs(fig).top),
      figMt: cs.marginTop,
      gapDlToFig: Math.round(abs(fig).top - abs(dl).bottom),
      figLeft: Math.round(abs(fig).left),
      figRightInset: Math.round(innerWidth - abs(fig).right),
      radius: parseFloat(cs.borderTopLeftRadius),
      figW: Math.round(abs(fig).w), figH: Math.round(abs(fig).h),
    };
  });
  console.log(`\n== ${name} ${w}px ==`);
  for (const [k, v] of Object.entries(m)) console.log(`  ${k.padEnd(16)} ${v}`);
  await p.close();
}
await b.close();
