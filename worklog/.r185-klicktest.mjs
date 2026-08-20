// R185: fuehrt der Fold noch dorthin, wo er hinsoll, und sind die Stil-Ziele erhalten?
import pkg from '/usr/lib/node_modules/playwright/index.js';
const B = process.env.SF_BASE ?? 'http://127.0.0.1:5175';
let fail = 0;
const ok = (n, c, d) => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}: ${d}`); if (!c) fail = 1; };

// Ein Browser JE Abschnitt, wie in `.r184-klicktest.mjs`. GATES.md Teil A haelt fest,
// dass ein geteilter Browser ueber acht Seiten mit "Target closed" stirbt und dann
// falsch FAIL meldet. `p.close()` faehrt den zugehoerigen Browser gleich mit herunter,
// darum bleibt der restliche Testcode unveraendert.
const auf = async (w, h) => {
  const browser = await pkg.chromium.launch({ args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.addInitScript(() => window.localStorage.setItem('salsaflow-cookie-ok', '1'));
  await p.goto(`${B}/`, { waitUntil: 'networkidle' });
  await p.waitForSelector('main section img');
  await p.waitForTimeout(500);
  const schliessen = p.close.bind(p);
  p.close = async () => { await schliessen().catch(() => null); await browser.close().catch(() => null); };
  return p;
};

{
  const p = await auf(1440, 730);
  ok('guard-richtige-seite', /Salsaflow/i.test(await p.title()), await p.title());
  await p.close();
}

// Kein Stil-Weg darf verloren gegangen sein: die drei Ziele leben in Sektion 2.
{
  const p = await auf(1440, 730);
  const m = await p.evaluate(() => {
    const secs = [...document.querySelectorAll('main > section')];
    const hero = secs[0], offer = secs[1];
    const hrefs = (s) => [...s.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    return { hero: hrefs(hero), offer: hrefs(offer) };
  });
  const stile = ['/tanzkurse/salsa', '/tanzkurse/bachata', '/tanzkurse/heels'];
  ok('stil-ziele-in-sektion-2', stile.every((s) => m.offer.includes(s)), m.offer.join(' '));
  ok('hero-ohne-stil-dublette', !stile.some((s) => m.hero.includes(s)), `Hero: ${m.hero.join(' ')}`);
  ok('hero-fuehrt-kursplan', m.hero.includes('/kursplan'), m.hero.join(' '));
  await p.close();
}

// Lesbarkeit: der Lead darf nicht auf dem dunklen Foto liegen.
for (const w of [360, 390, 430]) {
  const p = await auf(w, 844);
  const m = await p.evaluate(() => {
    const hero = document.querySelector('main section');
    const lead = [...hero.querySelectorAll('p')].find((x) => /Studios|Bahnhof/i.test(x.textContent ?? ''));
    const foto = [...hero.querySelectorAll('img')].map((i) => i.getBoundingClientRect()).sort((a, b) => b.height - a.height)[0];
    return { leadOben: Math.round(lead.getBoundingClientRect().top + scrollY), fotoUnten: Math.round(foto.bottom + scrollY) };
  });
  ok(`lead-nicht-im-foto-${w}`, m.leadOben >= m.fotoUnten, `Lead y=${m.leadOben}, Foto endet ${m.fotoUnten}`);
  await p.close();
}

// Die drei Wege wirklich klicken.
for (const [name, sel, ziel] of [
  ['klick-kursplan', /Kursplan ansehen/i, '/kursplan'],
  ['klick-schnupperstunde', /Schnupperstunde buchen/i, '/schnupperstunde'],
  ['klick-tanzkurse', /Alle Tanzkurse/i, '/tanzkurse'],
]) {
  const p = await auf(1440, 730);
  const link = p.locator('main a').filter({ hasText: sel }).first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await p.waitForTimeout(1200);
  ok(name, new URL(p.url()).pathname === ziel, `landet auf ${new URL(p.url()).pathname}`);
  await p.close();
}

// Kein Sammel-close mehr: jeder Abschnitt schliesst seinen eigenen Browser in p.close().
console.log(fail ? '\nR185 KLICKTEST FAIL' : '\nR185 KLICKTEST PASS');
process.exit(fail);
