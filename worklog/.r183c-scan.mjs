// R183 Fix-Runde 3 — Ehrliche Bestandsaufnahme.
// Frage 1: Wie gross ist die Luft an JEDER Sektionskante der Home (Rhythmus-Vergleich)?
// Frage 2: Wo genau liegt die Kante, die zu #team gehoert (Events-Fuss -> Team-Kopf)?
import pw from '/usr/lib/node_modules/playwright/index.js';
const b = await pw.chromium.launch();
for (const [name, w] of [['desktop', 1440], ['mobile', 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.waitForSelector('#team figure');
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0,0); });
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const secs = [...document.querySelectorAll('#main > *')];
    const rows = secs.map((s) => {
      const r = s.getBoundingClientRect();
      const cs = getComputedStyle(s);
      return {
        id: s.id || s.tagName + '.' + (s.className || '').split(' ')[0],
        top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY),
        padTop: parseFloat(cs.paddingTop), padBottom: parseFloat(cs.paddingBottom),
        bg: cs.backgroundColor,
      };
    });
    // "Tote Luft" pro Kante = padBottom(vorige) + padTop(naechste)
    const edges = [];
    for (let i = 1; i < rows.length; i++) {
      edges.push({
        edge: `${rows[i-1].id} -> ${rows[i].id}`,
        dead: rows[i-1].padBottom + rows[i].padTop,
        padB: rows[i-1].padBottom, padT: rows[i].padTop,
        colorChange: rows[i-1].bg !== rows[i].bg,
      });
    }
    return { rows, edges };
  });
  console.log(`\n===== ${name} ${w}px =====`);
  console.log('-- Sektionen --');
  for (const r of m.rows) console.log(`  ${r.id.padEnd(28)} y ${String(r.top).padStart(5)}..${String(r.bottom).padStart(5)}  padT=${r.padTop} padB=${r.padBottom}`);
  console.log('-- Kanten (tote Luft = padB + padT) --');
  for (const e of m.edges) console.log(`  ${String(e.dead).padStart(4)}px  ${e.edge.padEnd(46)} (${e.padB}+${e.padT})${e.colorChange ? '  [Farbwechsel]' : ''}`);
  await p.close();
}
await b.close();
