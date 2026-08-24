// R205 Klicktest: ganze öffentliche Website, Desktop (1440x900) + Mobil (390x844).
// Nur befunden, nichts fixen. Report: /tmp/salsaflow-r205-klicktest.md
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5173';
const REPORT = '/tmp/salsaflow-r205-klicktest.md';

// Ergebnis: Map check -> { desktop: {ok, evidence}, mobil: {ok, evidence} }
const results = new Map();
function rec(check, vp, ok, evidence) {
  if (!results.has(check)) results.set(check, {});
  results.get(check)[vp] = { ok, evidence };
  console.log(`[${vp}] ${ok ? 'PASS' : 'FAIL'} ${check} — ${evidence}`);
}

const IGNORE_CONSOLE = [
  /favicon/i,
  /Download the React DevTools/i,
];

function makePage(context, errBucket) {
  return context.newPage().then((page) => {
    page.on('console', (m) => {
      if (m.type() === 'error' && !IGNORE_CONSOLE.some((re) => re.test(m.text()))) {
        errBucket.push(`${page.url()}: console: ${m.text().slice(0, 300)}`);
      }
    });
    page.on('pageerror', (e) => errBucket.push(`${page.url()}: pageerror: ${String(e).slice(0, 300)}`));
    return page;
  });
}

async function is404(page) {
  const body = await page.locator('body').innerText().catch(() => '');
  return /Seite nicht gefunden|Page not found/i.test(body);
}

async function goto(page, path) {
  const resp = await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  return resp;
}

async function acceptCookie(page) {
  const btn = page.locator('[data-testid="cookie-accept"]');
  if (await btn.count() > 0 && await btn.first().isVisible().catch(() => false)) {
    await btn.first().click().catch(() => {});
    await page.waitForTimeout(200);
  }
}

async function runViewport(vpName, viewport) {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const consoleErrors = [];
  const page = await makePage(context, consoleErrors);
  const mobile = vpName === 'mobil';

  // ---------- 9. Cookie-Banner ----------
  try {
    await goto(page, '/');
    const banner = page.locator('[data-testid="cookie-accept"]');
    await banner.waitFor({ timeout: 5000 });
    await banner.click();
    await page.waitForTimeout(300);
    const goneAfterClick = !(await banner.isVisible().catch(() => false));
    await goto(page, '/kontakt');
    await page.waitForTimeout(400);
    const goneAfterNav = (await page.locator('[data-testid="cookie-accept"]').count()) === 0
      || !(await page.locator('[data-testid="cookie-accept"]').first().isVisible().catch(() => false));
    rec('9 Cookie-Banner: Akzeptieren + bleibt weg', vpName,
      goneAfterClick && goneAfterNav,
      `nach Klick sichtbar=${!goneAfterClick}, nach Navigation sichtbar=${!goneAfterNav}`);
  } catch (e) {
    rec('9 Cookie-Banner: Akzeptieren + bleibt weg', vpName, false, `Fehler: ${String(e).slice(0, 200)}`);
  }

  // ---------- 1. Header-Navigation ----------
  try {
    await goto(page, '/');
    await acceptCookie(page);
    const navLinks = new Map(); // href -> label
    if (!mobile) {
      // Desktop: Top-Level-Links einsammeln + Dropdowns öffnen
      const nav = page.locator('nav[aria-label="Hauptnavigation"], nav[aria-label="Main navigation"]').first();
      const tops = nav.locator('a[href^="/"], a[aria-expanded]');
      const n = await tops.count();
      for (let i = 0; i < n; i++) {
        const a = tops.nth(i);
        const href = await a.getAttribute('href');
        const expandable = (await a.getAttribute('aria-expanded')) !== null;
        if (expandable) {
          await a.hover();
          await page.waitForTimeout(350);
          const open = (await a.getAttribute('aria-expanded')) === 'true';
          if (!open) throw new Error(`Dropdown "${(await a.innerText()).trim()}" öffnet nicht (aria-expanded bleibt false)`);
          // Kind-Links des offenen Dropdowns
          const children = page.locator('a[aria-expanded="true"] ~ * a[href^="/"], [role="menu"] a[href^="/"]');
          const kids = await nav.locator('a[href^="/"]').evaluateAll((els) =>
            els.filter((el) => el.offsetParent !== null).map((el) => [el.getAttribute('href'), el.textContent.trim()]));
          for (const [h, l] of kids) if (h) navLinks.set(h, l);
          void children;
        }
        if (href) navLinks.set(href, (await a.innerText()).trim());
      }
      // CTAs in der Leiste
      for (const h of ['/schnupperstunde', '/kursplan']) navLinks.set(h, navLinks.get(h) || h);
    } else {
      // Mobil (R206, Raphael 23.08.): Untermenues sind kein Akkordeon mehr, sie oeffnen
      // als zweite Ebene nach rechts. Ablauf darum: Burger auf, Top-Level einsammeln,
      // je Gruppe hinein (Ebene 2 = [data-mobile-subnav]), Links einsammeln, zurueck.
      const burger = page.locator('button[aria-label="Menü"], button[aria-label="Menu"]').first();
      await burger.click();
      await page.waitForTimeout(400);
      const mnav = page.locator('nav[aria-label="Mobile Navigation"], nav[aria-label="Mobile navigation"]').last();
      const top = await mnav.locator('a[href^="/"]').evaluateAll((els) =>
        els.map((el) => [el.getAttribute('href'), el.textContent.trim()]));
      for (const [h, l] of top) if (h) navLinks.set(h, l);
      const sub = page.locator('#mobile-navigation [data-mobile-subnav]');
      const groups = mnav.locator('button[aria-expanded]');
      const g = await groups.count();
      for (let i = 0; i < g; i++) {
        const btn = groups.nth(i);
        await btn.click();
        await page.waitForTimeout(350);
        if ((await btn.getAttribute('aria-expanded')) !== 'true')
          throw new Error(`Mobil-Gruppe ${i} oeffnet nicht`);
        const kids = await sub.locator('a[href^="/"]').evaluateAll((els) =>
          els.map((el) => [el.getAttribute('href'), el.textContent.trim()]));
        if (!kids.length) throw new Error(`Mobil-Gruppe ${i}: Ebene 2 ohne Links`);
        for (const [h, l] of kids) if (h) navLinks.set(h, l);
        await sub.locator('button').first().click(); // Zurueck zu Ebene 1
        await page.waitForTimeout(350);
      }
    }
    // Jeden Nav-Link besuchen: HTTP < 400 und kein SPA-404
    const bad = [];
    for (const [href] of navLinks) {
      const clean = href.split('#')[0];
      if (!clean) continue;
      const resp = await goto(page, clean);
      const st = resp ? resp.status() : 0;
      if (st >= 400 || (await is404(page))) bad.push(`${clean} (HTTP ${st}${(await is404(page)) ? ', SPA-404' : ''})`);
    }
    rec('1 Header-Nav: alle Links + Dropdowns', vpName, bad.length === 0,
      `${navLinks.size} Links geprüft${bad.length ? '; kaputt: ' + bad.join(', ') : ''}`);
  } catch (e) {
    rec('1 Header-Nav: alle Links + Dropdowns', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 2. Footer-Links ----------
  try {
    await goto(page, '/');
    await acceptCookie(page);
    const footer = page.locator('footer').first();
    const links = await footer.locator('a[href]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('href')).filter(Boolean));
    const internal = [...new Set(links.filter((h) => h.startsWith('/')))];
    const external = [...new Set(links.filter((h) => /^https?:|^mailto:|^tel:/.test(h)))];
    const bad = [];
    for (const href of internal) {
      const clean = href.split('#')[0] || '/';
      const resp = await goto(page, clean);
      const st = resp ? resp.status() : 0;
      if (st >= 400 || (await is404(page))) bad.push(`${clean} (HTTP ${st}${(await is404(page)) ? ', SPA-404' : ''})`);
    }
    rec('2 Footer: alle Links', vpName, bad.length === 0 && internal.length > 0,
      `${internal.length} interne besucht, ${external.length} externe/mailto/tel gezählt${bad.length ? '; kaputt: ' + bad.join(', ') : ''}`);
  } catch (e) {
    rec('2 Footer: alle Links', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 3. Sprachwechsel DE→EN→DE ----------
  try {
    const evid = [];
    let ok = true;
    for (const path of ['/', '/tanzkurse/salsa']) {
      await goto(page, path);
      await acceptCookie(page);
      // Mobil steckt der sichtbare Toggle im Burger-Menü; Desktop-Toggle ist dort versteckt.
      const clickLang = async (code) => {
        let t;
        if (mobile) {
          // Der Panel-Toggle ist bei zugeklapptem Menü nur GECLIPPT (overflow-hidden),
          // für Playwright aber "visible" — darum immer zuerst den Burger öffnen.
          const burger = page.locator('button[aria-expanded][aria-controls="mobile-navigation"]').first();
          if ((await burger.getAttribute('aria-expanded')) !== 'true') {
            await burger.click();
            await page.waitForTimeout(400);
          }
          t = page.locator(`#mobile-navigation [data-testid="lang-${code}"]`).first();
        } else {
          t = page.locator(`[data-testid="lang-${code}"]:visible`).first();
        }
        await t.scrollIntoViewIfNeeded().catch(() => {});
        try {
          await t.click({ timeout: 8000 });
        } catch {
          // Diagnose statt Hänger: wo liegt der Button, was liegt darüber?
          const box = await t.boundingBox();
          const cover = box ? await page.evaluate(([x, y]) => {
            const el = document.elementFromPoint(x, y);
            return el ? el.tagName + '.' + String(el.className).slice(0, 60) : 'nichts';
          }, [box.x + box.width / 2, box.y + box.height / 2]) : 'kein boundingBox';
          throw new Error(`lang-${code} nicht klickbar; box=${JSON.stringify(box)}; darüber liegt: ${cover}`);
        }
        await page.waitForTimeout(400);
      };
      const deText = (await page.locator('h1').first().innerText()).trim();
      await clickLang('en');
      const enText = (await page.locator('h1').first().innerText()).trim();
      await clickLang('de');
      const backText = (await page.locator('h1').first().innerText()).trim();
      const changed = deText !== enText && backText === deText;
      ok = ok && changed;
      evid.push(`${path}: DE "${deText.slice(0, 40)}" → EN "${enText.slice(0, 40)}" → DE zurück=${backText === deText}`);
    }
    rec('3 Sprachwechsel DE→EN→DE (Home + Salsa)', vpName, ok, evid.join(' | '));
  } catch (e) {
    rec('3 Sprachwechsel DE→EN→DE (Home + Salsa)', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 4. Home: vier Angebots-Karten ----------
  try {
    await goto(page, '/');
    await acceptCookie(page);
    const targets = [
      ['/tanzkurse/salsa', 'Salsa'],
      ['/tanzkurse/bachata', 'Bachata'],
      ['/tanzkurse/heels', 'Heels'],
      ['/privatstunden', 'Privatstunden'],
    ];
    const evid = [];
    let ok = true;
    for (const [href, name] of targets) {
      await goto(page, '/');
      const card = page.locator(`main a[href="${href}"]`).first();
      if ((await card.count()) === 0) { ok = false; evid.push(`${name}: keine Karte mit href=${href} auf Home`); continue; }
      await card.scrollIntoViewIfNeeded();
      await card.click();
      await page.waitForURL(`**${href}**`, { timeout: 5000 });
      const h1 = (await page.locator('h1').first().innerText()).trim();
      // Stil-Seiten hängen selbst Query-Parameter an (?tag=…&staffel=…) — Pfad zählt.
      const good = new URL(page.url()).pathname === href && !(await is404(page));
      ok = ok && good;
      evid.push(`${name} → ${new URL(page.url()).pathname}, H1 "${h1.slice(0, 40)}"`);
    }
    rec('4 Home: 4 Angebots-Karten', vpName, ok, evid.join(' | '));
  } catch (e) {
    rec('4 Home: 4 Angebots-Karten', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 5. /kursplan: Filter, Staffel, Kurs öffnen, Anmelden-Weg ----------
  try {
    await goto(page, '/kursplan');
    await acceptCookie(page);
    await page.locator('[data-testid="course-card"]').first().waitFor({ timeout: 10000 });
    const evid = [];
    // Tag-Filter: Buttons mit Wochentags-Kürzel
    const dayBtns = page.locator('main button').filter({ hasText: /Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag/ });
    // Kalender rendert nach den Karten — auf die Tages-Leiste selbst warten.
    await dayBtns.first().waitFor({ timeout: 8000 }).catch(() => {});
    const dayCount = await dayBtns.count();
    let dayOk = false;
    if (dayCount >= 2) {
      const before = await page.locator('[data-testid="course-card"]').count();
      await dayBtns.nth(1).click();
      await page.waitForTimeout(400);
      const after = await page.locator('[data-testid="course-card"]').count();
      const emptyState = await page.locator('[data-testid="schedule-day-empty"]').count();
      dayOk = after !== before || after > 0 || emptyState > 0;
      evid.push(`Tag-Filter: ${dayCount} Tage, Karten ${before}→${after}${emptyState ? ' (leerer Tag korrekt gemeldet)' : ''}`);
    } else evid.push(`Tag-Filter: nur ${dayCount} Tages-Buttons gefunden`);
    // Staffel wechseln
    const termBtns = page.locator('main button').filter({ hasText: /^Staffel |term$/i });
    const termCount = await termBtns.count();
    let termOk = false;
    if (termCount >= 2) {
      await termBtns.nth(1).click();
      await page.waitForTimeout(500);
      const cards = await page.locator('[data-testid="course-card"]').count();
      const termEmpty = await page.locator('[data-testid="schedule-term-empty"], [data-testid="schedule-day-empty"]').count();
      termOk = cards > 0 || termEmpty > 0;
      evid.push(`Staffel: ${termCount} Umschalter, nach Wechsel ${cards} Karten${termEmpty ? ' / Leer-Hinweis' : ''}`);
      await termBtns.nth(0).click();
      await page.waitForTimeout(400);
    } else evid.push(`Staffel: nur ${termCount} Umschalter gefunden`);
    // Kurs öffnen → Anmelden-Weg bis Buchungsseite
    const card = page.locator('[data-testid="course-card"]').first();
    await card.waitFor({ timeout: 5000 });
    const cardName = (await card.innerText()).split('\n')[0].trim();
    await card.click();
    await page.waitForTimeout(600);
    let flowOk = false;
    let flowEvid = '';
    const dialog = page.locator('[data-testid="booking-dialog"], [role="dialog"]');
    if (await dialog.count() > 0 && await dialog.first().isVisible().catch(() => false)) {
      flowEvid = `Modal offen ("${cardName.slice(0, 30)}")`;
      const anmelden = dialog.locator('[data-testid="reserve-spot"], a, button').filter({ hasText: /Anmelden|Platz|Buchung|reserve/i }).first();
      if (await anmelden.count() > 0) {
        await anmelden.click();
        await page.waitForTimeout(800);
        flowOk = /\/buchung/.test(page.url()) || await page.locator('[data-testid="booking-funnel"]').count() > 0;
        flowEvid += ` → Anmelden → ${new URL(page.url()).pathname + new URL(page.url()).search}`;
      } else flowEvid += ', kein Anmelden-Element im Modal';
    } else if (/\/buchung\?kurs=/.test(page.url())) {
      flowOk = await page.locator('[data-testid="booking-funnel"], [data-testid="course-detail"]').count() > 0;
      flowEvid = `Karte führt direkt auf ${new URL(page.url()).pathname + new URL(page.url()).search}, Funnel sichtbar=${flowOk}`;
    } else {
      flowEvid = `Klick auf Karte: kein Modal, URL ${page.url()}`;
    }
    rec('5 /kursplan: Filter + Staffel + Kurs + Anmelden-Weg', vpName,
      dayOk && termOk && flowOk, evid.concat(flowEvid).join(' | '));
  } catch (e) {
    rec('5 /kursplan: Filter + Staffel + Kurs + Anmelden-Weg', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 6. /buchung: Schritte bis vor Absenden ----------
  try {
    await goto(page, '/buchung');
    await acceptCookie(page);
    await page.locator('[data-testid="booking-funnel"]').waitFor({ timeout: 10000 });
    const evid = [];
    // Schritt 1: Tag wählen, Kurs wählen
    const dayBtn = page.locator('[data-testid^="day-"]').first();
    if (await dayBtn.count() > 0) { await dayBtn.click(); await page.waitForTimeout(400); }
    let pick = page.locator('[data-testid^="pick-course-"]').first();
    if ((await pick.count()) === 0) {
      // leerer Tag → nächster Tag mit Kursen
      const nxt = page.locator('[data-testid="empty-next-day"]').first();
      if (await nxt.count() > 0) { await nxt.click(); await page.waitForTimeout(400); }
      pick = page.locator('[data-testid^="pick-course-"]').first();
    }
    if ((await pick.count()) === 0) throw new Error('kein wählbarer Kurs in Schritt 1');
    const pickedName = (await pick.innerText()).split('\n')[0].trim();
    await pick.click();
    await page.waitForTimeout(600);
    evid.push(`Kurs gewählt: "${pickedName.slice(0, 40)}"`);
    // Kurs-Detail → weiter zur Anmeldung
    const detail = page.locator('[data-testid="course-detail"]');
    if (await detail.count() > 0) {
      const reserve = page.locator('[data-testid="reserve-spot"], [data-testid="booking-next"], [data-testid="inquiry-next"]').first();
      if (await reserve.count() > 0) { await reserve.scrollIntoViewIfNeeded(); await reserve.click(); await page.waitForTimeout(600); evid.push('Detail → weiter geklickt'); }
    }
    // Dialog-Multistep: Schritt A sind Auswahl-Buttons (Follower/Leader, Allein/Als Paar),
    // danach Text-Felder. "Weiter" bis der Submit sichtbar ist — NICHT absenden.
    const scope = (await page.locator('[data-testid="booking-dialog"]').count()) > 0
      ? page.locator('[data-testid="booking-dialog"]') : page.locator('[data-testid="booking-funnel"]');
    let submitVisible = false;
    for (let step = 0; step < 4 && !submitVisible; step++) {
      // Auswahl-Buttons: erste Option je Gruppe
      for (const re of [/^(Follower|Leader)$/, /^(Allein|Als Paar|Alone|As a couple)$/]) {
        const opt = scope.locator('button:visible').filter({ hasText: re }).first();
        if (await opt.count() > 0) { await opt.click().catch(() => {}); await page.waitForTimeout(150); }
      }
      // Text-Felder füllen
      const inputs = scope.locator('input:visible:not([type="checkbox"]):not([type="radio"]), textarea:visible');
      const nIn = await inputs.count();
      let filledStep = 0;
      for (let i = 0; i < nIn; i++) {
        const inp = inputs.nth(i);
        const type = (await inp.getAttribute('type')) || 'text';
        const name = ((await inp.getAttribute('name')) || (await inp.getAttribute('id')) || '').toLowerCase();
        let val = 'Klick Test';
        if (type === 'email' || name.includes('mail')) val = 'klicktest@example.com';
        else if (type === 'tel' || name.includes('phone') || name.includes('tel')) val = '+41 79 000 00 00';
        if (await inp.fill(val).then(() => true).catch(() => false)) filledStep++;
      }
      if (filledStep) evid.push(`Schritt ${step + 1}: ${filledStep} Felder gefüllt`);
      submitVisible = await scope.locator('[data-testid="booking-submit"]:visible').count() > 0;
      if (submitVisible) break;
      const next = scope.locator('[data-testid="booking-next"]:visible').first();
      if (await next.count() === 0) break;
      await next.click();
      await page.waitForTimeout(500);
      evid.push('Weiter geklickt');
      submitVisible = await scope.locator('[data-testid="booking-submit"]:visible').count() > 0;
    }
    evid.push(`Submit sichtbar (NICHT geklickt): ${submitVisible}`);
    rec('6 /buchung: Schritte bis vor Absenden', vpName, submitVisible, evid.join(' | '));
  } catch (e) {
    rec('6 /buchung: Schritte bis vor Absenden', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 7. /kontakt: Formular ausfüllbar ----------
  try {
    await goto(page, '/kontakt');
    await acceptCookie(page);
    // Wizard: Schritt 0 Anliegen → inquiry-next → weitere Schritte (Radios + Text) → contact-submit
    const topic = page.locator('input[name="topic"]').first();
    await topic.waitFor({ timeout: 8000 });
    await topic.locator('..').click();
    await page.waitForTimeout(300);
    if ((await page.locator('input[name="topic"]:checked').count()) === 0) {
      await topic.check({ force: true }).catch(() => {});
      await page.waitForTimeout(300);
    }
    const topicChecked = (await page.locator('input[name="topic"]:checked').count()) === 1;
    let filled = 0;
    let submitVisible = false;
    for (let step = 0; step < 4 && !submitVisible; step++) {
      // Weiter-Knopf wird erst nach der Anliegen-Wahl scharf (aria-disabled fällt weg).
      const nxt = page.locator('[data-testid="inquiry-next"]:visible:not([aria-disabled="true"])').first();
      await nxt.waitFor({ timeout: 6000 }).catch(() => {});
      if (await nxt.count() > 0) { await nxt.click({ timeout: 8000 }); await page.waitForTimeout(500); }
      // Radios je Gruppe: erste Option
      const radios = page.locator('form input[type="radio"]:visible:not([name="topic"])');
      const groups = new Set();
      for (let i = 0; i < await radios.count(); i++) {
        const nm = await radios.nth(i).getAttribute('name');
        if (nm && !groups.has(nm)) { groups.add(nm); await radios.nth(i).check().catch(() => {}); }
      }
      const fields = page.locator('form input:visible:not([type="checkbox"]):not([type="radio"]), form textarea:visible');
      const nF = await fields.count();
      for (let i = 0; i < nF; i++) {
        const f = fields.nth(i);
        const type = (await f.getAttribute('type')) || 'text';
        const val = type === 'email' ? 'klicktest@example.com' : type === 'tel' ? '+41 79 000 00 00' : 'Klicktest';
        await f.fill(val).catch(() => {});
        if (((await f.inputValue().catch(() => ''))).length > 0) filled++;
      }
      submitVisible = (await page.locator('[data-testid="contact-submit"]:visible').count()) > 0;
    }
    rec('7 /kontakt: Formular ausfüllbar (nicht gesendet)', vpName,
      topicChecked && filled > 0 && submitVisible,
      `Anliegen gewählt=${topicChecked}, ${filled} Felder gefüllt, Submit sichtbar (NICHT geklickt)=${submitVisible}`);
  } catch (e) {
    rec('7 /kontakt: Formular ausfüllbar (nicht gesendet)', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 8. FAQ: Accordions ----------
  try {
    await goto(page, '/faq');
    await acceptCookie(page);
    const closed = page.locator('details:not([open]) summary');
    await closed.first().waitFor({ timeout: 8000 });
    const evid = [];
    let opened = 0;
    for (let i = 0; i < 3; i++) {
      const s = page.locator('details:not([open]) summary').first();
      if ((await s.count()) === 0) break;
      const q = (await s.innerText()).trim();
      await s.scrollIntoViewIfNeeded();
      await s.click();
      await page.waitForTimeout(300);
      const openCount = await page.locator('details[open]').count();
      if (openCount > opened) { opened = openCount; evid.push(`"${q.slice(0, 45)}" offen`); }
      else evid.push(`"${q.slice(0, 45)}" öffnet NICHT`);
    }
    rec('8 FAQ: 3 Accordions öffnen', vpName, opened >= 3, evid.join(' | '));
  } catch (e) {
    rec('8 FAQ: 3 Accordions öffnen', vpName, false, `Fehler: ${String(e).slice(0, 250)}`);
  }

  // ---------- 10. Console/Pageerrors gesamt ----------
  const uniqErrors = [...new Set(consoleErrors)];
  rec('10 Console-/Pageerrors auf allen Seiten', vpName, uniqErrors.length === 0,
    uniqErrors.length ? uniqErrors.slice(0, 8).join(' || ') : 'keine Fehler');

  await browser.close();
}

(async () => {
  await runViewport('desktop', { width: 1440, height: 900 });
  await runViewport('mobil', { width: 390, height: 844 });

  // Report schreiben
  let fails = 0, total = 0;
  const rows = [];
  for (const [check, r] of results) {
    for (const vp of ['desktop', 'mobil']) {
      total++;
      if (!r[vp] || !r[vp].ok) fails++;
    }
    const d = r.desktop || { ok: false, evidence: 'nicht gelaufen' };
    const m = r.mobil || { ok: false, evidence: 'nicht gelaufen' };
    const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
    rows.push(`| ${check} | ${d.ok ? 'PASS' : 'FAIL'} | ${m.ok ? 'PASS' : 'FAIL'} | Desktop: ${esc(d.evidence)}<br>Mobil: ${esc(m.evidence)} |`);
  }
  const md = [
    '# Salsaflow R205 Klicktest — öffentliche Website',
    '',
    `Datum: ${new Date().toISOString()} · Base: ${BASE} · Desktop 1440x900 · Mobil 390x844`,
    '',
    `**Ergebnis: ${total - fails}/${total} PASS${fails ? `, ${fails} FAIL` : ''}**`,
    '',
    '| Prüfung | Desktop | Mobil | Beleg |',
    '|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
  fs.writeFileSync(REPORT, md);
  console.log(`\nReport: ${REPORT}`);
  console.log(`GESAMT: ${total - fails}/${total} PASS, ${fails} FAIL`);
  process.exitCode = fails ? 1 : 0;
})().catch((e) => {
  console.error(e);
  process.exitCode = 2;
});
