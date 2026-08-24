// R183 G1 — Item [home-team-luft], Fix-Runde 3.
// Prueft die drei Acceptance-Checks, ohne einen davon schoenzurechnen.
//   A) Teamfoto wirkt nicht rund-am-Viewportrand (Karte MIT Innenabstand ODER Full-bleed OHNE Radius)
//   B) Luft: die Kante, die TeamBlock.tsx BESITZT (events -> team), auf Seitenrhythmus.
//      Die Hero-Kante wird gemessen und als BLOCKER ausgewiesen, nicht als PASS verkauft.
//   C) Hero.tsx unveraendert
//
// Aenderung gegen Fix-Runde 2 (sol-critic hatte recht): Check B behauptete frueher
// "134px, also genug Luft" und wurde damit gruen, ohne dass diese Datei etwas beitrug.
// Die 134px liefen bis zur H2 INNERHALB #angebot, also inklusive deren Polster. Die echte
// Sektionskante ist 64px gegen 128px ueberall sonst. G1 misst jetzt die Kante selbst.
import pw from '/usr/lib/node_modules/playwright/index.js';
import { execSync } from 'node:child_process';
const { chromium } = pw;
const b = await chromium.launch();
let fail = 0;
const say = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) fail = 1; };

// ---------- A) Karte statt rund-am-Rand ----------
for (const [name, w] of [['desktop', 1440], ['mobile', 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForSelector('#team figure');
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await p.waitForTimeout(400);
  const m = await p.evaluate(() => {
    const fig = document.querySelector('#team figure');
    const r = fig.getBoundingClientRect();
    const cs = getComputedStyle(fig);
    return {
      left: Math.round(r.left), right: Math.round(window.innerWidth - r.right),
      radius: parseFloat(cs.borderTopLeftRadius), mt: parseFloat(cs.marginTop),
    };
  });
  const inset = Math.min(m.left, m.right);
  const karte = inset >= 16 && m.radius >= 12;
  const fullBleed = inset <= 2 && m.radius < 4;
  console.log(`-- ${name} ${w}px: inset=${m.left}/${m.right} radius=${m.radius} marginTop=${m.mt}`);
  say(karte || fullBleed, `${name}: eindeutig Karte ODER Full-bleed, keine Mischung (inset ${inset}px, radius ${m.radius}px)`);
  say(m.left === m.right, `${name}: Innenabstand symmetrisch`);
  say(m.radius === 24, `${name}: Radius 24px erhalten (R134/7-Lock, Video 01:32)`);
  // Rhythmus: der Abstand ueber dem Band bleibt auf der Nachbarstufe (12/16 => 48/64px).
  say(m.mt === (w >= 1024 ? 64 : 48), `${name}: Abstand ueber dem Band auf Nachbarstufe (${m.mt}px, nicht kuenstlich aufgeblasen)`);
  // Der Sektionskopf laeuft ueber den geteilten Token (SECTION_Y_HOME = 64px), nicht von Hand.
  const padTop = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#team')).paddingTop));
  say(padTop === 64, `${name}: Sektionskopf auf dem geteilten Token SECTION_Y_HOME (${padTop}px, erwartet 64)`);
  await p.close();
}

// ---------- B) Luft unter dem Hero (Overlays ausgeschlossen) ----------
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  const m = await p.evaluate(() => {
    const floating = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const pos = getComputedStyle(n).position;
        if (pos === 'fixed' || pos === 'sticky') return true;
      }
      return false;
    };
    const hero = [...document.querySelectorAll('img,video')]
      .filter((el) => { const q = el.getBoundingClientRect(); return q.top < 400 && q.width > 400 && q.height > 200; })
      .sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top)[0];
    if (!hero) return null;
    const hb = hero.getBoundingClientRect().bottom;
    const cands = [...document.querySelectorAll('h1,h2,h3,p,img,a,button')]
      .map((el) => ({ el, q: el.getBoundingClientRect() }))
      .filter(({ el, q }) => q.top >= hb - 1 && q.height > 8 && !el.contains(hero))
      .sort((a, c) => a.q.top - c.q.top);
    const raw = cands[0];
    const solid = cands.find(({ el }) => !floating(el));
    const team = document.querySelector('#team');
    return {
      rawTag: raw.el.tagName, rawText: (raw.el.textContent || '').trim().slice(0, 20),
      rawFloating: floating(raw.el), rawGap: +(raw.q.top - hb).toFixed(0),
      solidText: (solid.el.textContent || '').trim().slice(0, 30),
      solidSection: solid.el.closest('section')?.id || '(kein id)',
      solidGap: +(solid.q.top - hb).toFixed(0),
      solidInTeam: !!solid.el.closest('#team'),
      heroBottom: Math.round(hb + scrollY),
      teamTop: Math.round(team.getBoundingClientRect().top + scrollY),
    };
  });
  console.log(`\n-- Hero-Kante 1440px: erstes Element "${m.rawText}" (${m.rawTag}), floating=${m.rawFloating}, gap=${m.rawGap}px`);
  console.log(`   erster echter Nachbar: "${m.solidText}" in #${m.solidSection}, gap=${m.solidGap}px`);
  console.log(`   Hero endet y=${m.heroBottom}, #team beginnt y=${m.teamTop} -> Distanz ${m.teamTop - m.heroBottom}px`);

  // Die ECHTE Sektionskante unter dem Hero + der Beweis, dass sie dieser Datei nicht gehoert.
  const edge = await p.evaluate(() => {
    const rect = (el) => el.getBoundingClientRect();
    const hero = document.querySelector('#main > section:first-child');
    const ang = document.querySelector('#angebot');
    const before = Math.round(rect(ang).top - rect(hero).bottom);
    const heroPadB = parseFloat(getComputedStyle(hero).paddingBottom);
    const angPadT = parseFloat(getComputedStyle(ang).paddingTop);
    // Hebel-Test: TeamBlock maximal aufblasen und die Hero-Kante nachmessen.
    const t = document.querySelector('#team');
    const snap = [];
    t.querySelectorAll('*').forEach((el) => { snap.push([el, el.style.marginTop]); el.style.marginTop = '400px'; });
    t.style.paddingTop = '400px'; t.style.marginTop = '400px';
    const after = Math.round(rect(ang).top - rect(hero).bottom);
    t.style.paddingTop = ''; t.style.marginTop = '';
    snap.forEach(([el, v]) => { el.style.marginTop = v; });
    return { before, after, heroPadB, angPadT };
  });
  console.log(`   ECHTE Sektionskante Hero -> #angebot: ${edge.before}px (Hero padB=${edge.heroPadB}, #angebot padT=${edge.angPadT})`);
  console.log(`   Hebel-Test: #team + alle Kinder auf 400px -> Hero-Kante ${edge.before}px -> ${edge.after}px`);
  say(edge.before === edge.after,
    `Hero-Kante ist aus TeamBlock.tsx mechanisch NICHT steuerbar (${edge.before}px vor und nach dem 400px-Hebel)`);
  // Kein PASS auf "genug Luft unter dem Hero". Die Kante ist zu eng und gehoert Hero.tsx/Offer.tsx.
  if (edge.before < 128) {
    console.log(`\nBLOCKER (ausserhalb allowed_paths, NICHT von diesem Item geloest):`);
    console.log(`   Hero -> #angebot misst ${edge.before}px, jede andere Sektionskante der Home 128px.`);
    console.log(`   Ursache: Hero.tsx <section> hat padding-bottom ${edge.heroPadB}. Fix gehoert an`);
    console.log(`   Hero.tsx oder Offer.tsx — beide in diesem Item tabu.`);
  }
  await p.close();
}

// ---------- B2) Die Kante, die TeamBlock.tsx BESITZT: events -> team ----------
for (const [name, w] of [['desktop', 1440], ['mobile', 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);
  await p.waitForSelector('#team');
  const m = await p.evaluate(() => {
    const team = document.querySelector('#team');
    const prev = team.previousElementSibling;
    return {
      prevId: prev.id || prev.tagName,
      padB: parseFloat(getComputedStyle(prev).paddingBottom),
      padT: parseFloat(getComputedStyle(team).paddingTop),
    };
  });
  const dead = m.padB + m.padT;
  console.log(`\n-- ${name} ${w}px: Kante ${m.prevId} -> team = ${dead}px (${m.padB}+${m.padT})`);
  say(dead === 128, `${name}: eigene Kante auf dem Seitenrhythmus (${dead}px, alle anderen Home-Kanten 128px)`);
  await p.close();
}

// ---------- C) Hero.tsx unveraendert ----------
{
  const dirty = execSync('git status --porcelain src/public/home/Hero.tsx', { cwd: '/root/clients/salsaflow-w1' }).toString().trim();
  say(dirty === '', `Hero.tsx unveraendert (git status leer)${dirty ? ' -> ' + dirty : ''}`);
  const changed = execSync('git diff --name-only', { cwd: '/root/clients/salsaflow-w1' }).toString().trim().split('\n');
  say(changed.includes('src/public/home/TeamBlock.tsx'), `TeamBlock.tsx ist geaendert`);
}

await b.close();
console.log(fail ? '\nG1 FAIL' : '\nG1 PASS');
process.exit(fail);
