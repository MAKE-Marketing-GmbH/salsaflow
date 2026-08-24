// R164 (19.08.2026) — Fold-Belege fuer /schnupperstunde.
// Zweck: 1440 zeigt H1 "Komm einmal" UND ganze Koepfe im Bildband.
// 390 zeigt den Weiter-Knopf frei neben dem WhatsApp-Kreis.
// Nur Beleg-Skript. Es aendert die Seite nicht.

import { mkdir } from 'node:fs/promises';
import { chromium } from '/usr/lib/node_modules/playwright/index.mjs';

const ROOT = '/root/clients/salsaflow-w1/worklog/shots/S7-ux164-schnupper';
const BASE = 'http://127.0.0.1:5175';

await mkdir(ROOT, { recursive: true });

const browser = await chromium.launch({
  handleSIGINT: false,
  handleSIGTERM: false,
  handleSIGHUP: false,
});

async function openPage(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('salsaflow-cookie-ok', '1');
    } catch {
      /* ignore */
    }
  });
  await page.goto(`${BASE}/schnupperstunde`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.locator('h1').first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(1200);
  return page;
}

/* Die Seite muss VON SELBST oben stehen. Ohne den Riegel in
   SchnupperstundePage.tsx fokussiert der Wizard beim Mount seine
   Ueberschrift und der Browser scrollt zu ihr — gemessen 1440 auf 528,
   390 auf 885. Ein blindes scrollTo(0,0) im Beleg-Skript wuerde genau
   diesen Fehler zudecken. Darum hier erst messen, dann erst stellen. */
async function assertNoAutoScroll(page, label) {
  const sy = await page.evaluate(() => window.scrollY);
  if (sy !== 0) {
    fail(
      `${label}: page auto-scrolled to ${sy} on load — the guard in ` +
        'SchnupperstundePage.tsx (useNoAutoScrollOnLoad) is not working; the hero is off-screen',
    );
  }
}

function fail(msg) {
  throw new Error(msg);
}

/* 1440: H1 im Fold, Bildband komplett im Fold, Crop-Fenster deckt die Koepfe. */
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await openPage(page);
  await assertNoAutoScroll(page, '1440');

  const h1 = page.locator('h1').first();
  const h1Text = (await h1.innerText()).trim();
  const h1Box = await h1.boundingBox();
  if (!h1Box) fail('1440: h1 has no box');
  if (!/Komm einmal/i.test(h1Text)) fail(`1440: wrong h1: ${h1Text}`);
  if (h1Box.y < 0 || h1Box.y + h1Box.height > 900) fail(`1440: h1 outside fold (${h1Box.y})`);

  const img = page.locator('img[src*="kurse-classfreude-01"]').first();
  const imgSrc = await img.getAttribute('src');
  if (imgSrc !== '/photos/2026/kurse-classfreude-01.webp') fail(`1440: wrong photo ${imgSrc}`);
  const band = await img.boundingBox();
  if (!band) fail('1440: band has no box');
  if (band.y + band.height > 900) {
    fail(`1440: band bottom ${Math.round(band.y + band.height)} below fold`);
  }

  /* Welcher Quell-Ausschnitt liegt im Band? object-fit cover + object-position. */
  const crop = await img.evaluate((el) => {
    const cs = getComputedStyle(el);
    const w = el.clientWidth;
    const h = el.clientHeight;
    const nw = el.naturalWidth;
    const nh = el.naturalHeight;
    const scale = Math.max(w / nw, h / nh);
    const sw = nw * scale;
    const sh = nh * scale;
    const posY = cs.objectPosition.split(' ')[1] || '50%';
    const pct = parseFloat(posY) / 100;
    const offY = (sh - h) * pct;
    return {
      objectPosition: cs.objectPosition,
      srcTop: Math.round(offY / scale),
      srcBottom: Math.round((offY + h) / scale),
      naturalHeight: nh,
      bandHeight: Math.round(h),
    };
  });
  /* Gemessen am Motiv (1920x1280): Gesichter der vorderen Reihe liegen y 280-540.
     Ganze Koepfe heisst: Fenster startet ueber 280 und endet unter 540. */
  if (crop.srcTop > 260) fail(`1440: crop starts too low (${crop.srcTop} > 260), heads cut on top`);
  if (crop.srcBottom < 560) fail(`1440: crop ends too high (${crop.srcBottom} < 560), chins cut`);

  await page.screenshot({ path: `${ROOT}/schnupper-fold-1440.png`, timeout: 15000 });
  console.log(
    `1440 OK h1=${JSON.stringify(h1Text)} h1Y=${Math.round(h1Box.y)} ` +
      `bandTop=${Math.round(band.y)} bandBottom=${Math.round(band.y + band.height)} ` +
      `objectPosition=${crop.objectPosition} srcY=${crop.srcTop}-${crop.srcBottom}`,
  );
  await page.close();
}

/* 390: Weiter-Knopf darf den WhatsApp-Kreis nicht beruehren. */
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await openPage(page);
  await assertNoAutoScroll(page, '390');

  const h1 = page.locator('h1').first();
  const h1Text = (await h1.innerText()).trim();
  if (!/Komm einmal/i.test(h1Text)) fail(`390: wrong h1: ${h1Text}`);

  const img = page.locator('img[src*="kurse-classfreude-01"]').first();
  const imgSrc = await img.getAttribute('src');
  if (imgSrc !== '/photos/2026/kurse-classfreude-01.webp') fail(`390: wrong photo ${imgSrc}`);

  /* Nur der fixe Kreis zaehlt (.whatsapp-float). Footer-Links auf wa.me
     stehen im Fluss und koennen nie unter einem Knopf liegen. */
  const wa = page.locator('.whatsapp-float').first();
  const waBox0 = await wa.boundingBox();
  if (!waBox0) fail('390: no WhatsApp float box');
  if (waBox0.width > 120) fail(`390: matched wrong element, width ${Math.round(waBox0.width)}`);

  /* Der Abstand haengt an data-testid="inquiry-next". Verschwindet das
     Attribut, faellt der Knopf still zurueck unter den Kreis. Darum hier
     zuerst hart pruefen, dass der Anker ueberhaupt existiert — und dass er
     denselben Knopf meint wie der Text-Selektor. */
  const anchored = page.locator('#anfrage [data-testid="inquiry-next"]');
  if ((await anchored.count()) !== 1) {
    fail(
      `390: anchor [data-testid="inquiry-next"] missing (${await anchored.count()} found) — ` +
        'the mr-[65px] override in SchnupperstundePage.tsx is dead',
    );
  }

  const next = page.locator('#anfrage button', { hasText: /Weiter|Next/ }).first();
  const nextIsAnchor = await next.evaluate(
    (el) => el.getAttribute('data-testid') === 'inquiry-next',
  );
  if (!nextIsAnchor) fail('390: Weiter button is not the anchored [data-testid="inquiry-next"]');

  /* Und der Override muss wirklich greifen, nicht zufaellig durch fremdes
     Layout erfuellt sein: der berechnete rechte Aussenabstand ist unser Wert. */
  const anchorMargin = await next.evaluate((el) => getComputedStyle(el).marginRight);
  if (anchorMargin !== '65px') {
    fail(`390: override not applied, computed margin-right is ${anchorMargin}, expected 65px`);
  }

  await next.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const nextBox = await next.boundingBox();
  const waBox = await wa.boundingBox();
  if (!nextBox) fail('390: no Weiter button box');
  if (!waBox) fail('390: no WhatsApp float box after scroll');

  const overlaps =
    nextBox.x < waBox.x + waBox.width &&
    nextBox.x + nextBox.width > waBox.x &&
    nextBox.y < waBox.y + waBox.height &&
    nextBox.y + nextBox.height > waBox.y;
  if (overlaps) {
    fail(
      `390: Weiter overlaps WhatsApp (next ${Math.round(nextBox.x)},${Math.round(nextBox.y)} ` +
        `${Math.round(nextBox.width)}x${Math.round(nextBox.height)} vs wa ${Math.round(waBox.x)},${Math.round(waBox.y)} ` +
        `${Math.round(waBox.width)}x${Math.round(waBox.height)})`,
    );
  }
  /* 40px statt "kein Ueberlapp": ein Daumen ist breiter als 0 Pixel.
     Der Knopf muss sichtbar frei stehen, nicht nur rechnerisch. */
  const gapX = waBox.x - (nextBox.x + nextBox.width);
  if (gapX < 40) fail(`390: horizontal gap too small (${Math.round(gapX)}px)`);

  /* Der Kreis ist fixed. Der Knopf muss auch an JEDER Scroll-Position frei
     bleiben, nicht nur an dieser. Darum den ganzen Weg durchfahren. */
  const worst = await page.evaluate(() => {
    const btn = document.querySelector('#anfrage [data-testid="inquiry-next"]');
    const float = document.querySelector('.whatsapp-float');
    if (!btn || !float) return null;
    const f = float.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    /* Horizontal ist scroll-unabhaengig: beide sind x-fix. */
    return { gap: f.left - b.right, btnRight: b.right, floatLeft: f.left };
  });
  if (!worst) fail('390: could not measure scroll-independent gap');
  if (worst.gap < 40) fail(`390: gap across scroll too small (${Math.round(worst.gap)}px)`);

  /* Beleg 1: der Weiter-Knopf bei genau dieser Scroll-Position, Kreis im Bild. */
  await page.screenshot({ path: `${ROOT}/schnupper-weiter-390.png`, timeout: 15000 });

  /* Beleg 2: der Fold mit H1 bei y=0. */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const h1Box = await h1.boundingBox();
  if (!h1Box) fail('390: h1 has no box at y=0');
  if (h1Box.y < 0 || h1Box.y + h1Box.height > 844) fail(`390: h1 outside fold (${h1Box.y})`);
  await page.screenshot({ path: `${ROOT}/schnupper-fold-390.png`, timeout: 15000 });
  console.log(
    `390 OK h1=${JSON.stringify(h1Text)} ` +
      `next=${Math.round(nextBox.x)},${Math.round(nextBox.y)} ${Math.round(nextBox.width)}x${Math.round(nextBox.height)} ` +
      `waFloat=${Math.round(waBox.x)},${Math.round(waBox.y)} ${Math.round(waBox.width)}x${Math.round(waBox.height)} ` +
      `gapX=${Math.round(gapX)} overlap=0`,
  );
  await page.close();
}

await browser.close();
console.log('R164_SCHNUPPER_SHOTS_OK');
