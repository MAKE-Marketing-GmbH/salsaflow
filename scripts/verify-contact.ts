// Etappe-14-Gate: prueft die oeffentliche Kontakt-API (/api/public/contact) ueber echte
// app.request()-Calls. Kern (Memory-Falle "Formular sendet nichts"): eine GUELTIGE Anfrage
// erzeugt NACHWEISBAR eine Mail an info@salsaflow-dc.com (lokale .eml in der Outbox), eine
// UNGUELTIGE Anfrage erzeugt KEINE Mail (sendet nicht ins Leere). Read-only auf der DB.
//
// Deterministik: Wir erzwingen den lokalen Outbox-Treiber (RESEND_API_KEY wird fuer den Lauf
// entfernt), damit der Nachweis ohne externe Zugangsdaten als .eml pruefbar ist. Mit gesetztem
// RESEND_API_KEY liefe derselbe Code gegen echtes Resend (Launch-Config).

import 'dotenv/config';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { openDb } from '../db/client.js';
import { createApp } from '../server/app.js';
import { OUTBOX_DIR, INFO_EMAIL } from '../server/mail.js';

// Outbox-Treiber erzwingen (lokaler, verifizierbarer Nachweis).
delete process.env.RESEND_API_KEY;

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
function check(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

function emlFiles(): string[] {
  if (!existsSync(OUTBOX_DIR)) return [];
  return readdirSync(OUTBOX_DIR).filter((f) => f.endsWith('.eml'));
}
function readEml(name: string): string {
  return readFileSync(resolve(OUTBOX_DIR, name), 'utf8');
}

async function main() {
  const handle = await openDb();
  const app = createApp(handle.db);

  async function post(body: unknown) {
    return app.request('/api/public/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  /* 1) Gueltige Anfrage -> 200 + Outbox-Mail nachweisbar ---------------------- */
  const token = `VERIFY-CONTACT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const before = new Set(emlFiles());
  const res = await post({
    name: 'Test Anfrage',
    email: 'besucher@example.com',
    phone: '+41 79 000 00 00',
    topic: 'raumvermietung',
    message: `Hallo, ich interessiere mich. Marker ${token}`,
    language: 'de',
  });
  const body = (await res.json().catch(() => null)) as { ok?: boolean; driver?: string; id?: string } | null;
  check('Gueltige Anfrage: Status 200', res.status === 200, `status ${res.status}`);
  check('Gueltige Anfrage: ok=true', body?.ok === true, JSON.stringify(body));
  check('Treiber = outbox (lokaler Nachweis)', body?.driver === 'outbox', `driver ${body?.driver}`);

  // Genau die neue .eml finden (die den Marker enthaelt).
  const afterNew = emlFiles().filter((f) => !before.has(f));
  const newWithToken = afterNew.filter((f) => readEml(f).includes(token));
  check('Genau eine neue .eml-Datei erzeugt', newWithToken.length === 1, `${newWithToken.length} neu (von ${afterNew.length})`);

  if (newWithToken.length === 1) {
    const content = readEml(newWithToken[0]);
    check('Mail geht an info@salsaflow-dc.com', content.includes(`To: ${INFO_EMAIL}`), `To-Header`);
    check('Reply-To = Absender (direkt antwortbar)', content.includes('Reply-To: besucher@example.com'), 'Reply-To');
    check('Mail enthaelt Name des Absenders', content.includes('Test Anfrage'), 'Name');
    check('Mail enthaelt die Nachricht', content.includes(token), 'Nachricht');
    check('Mail enthaelt das Anliegen (Raumvermietung)', content.includes('Raumvermietung'), 'Anliegen-Label');
  } else {
    check('Mail geht an info@salsaflow-dc.com', false, 'keine eindeutige Mail');
  }

  /* 2) Gueltige Telefon-Anfrage -> 200 + Outbox-Mail ohne Reply-To ------------ */
  const phoneToken = `VERIFY-PHONE-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const beforePhone = new Set(emlFiles());
  const resPhone = await post({
    name: 'Telefon Anfrage',
    email: null,
    phone: '+41 79 111 22 33',
    topic: 'schnupperstunde',
    message: `Schnupperstunde. Marker ${phoneToken}`,
    language: 'de',
  });
  const phoneBody = (await resPhone.json().catch(() => null)) as { ok?: boolean } | null;
  check('Telefon-Anfrage ohne E-Mail: Status 200', resPhone.status === 200, `status ${resPhone.status}`);
  check('Telefon-Anfrage ohne E-Mail: ok=true', phoneBody?.ok === true, JSON.stringify(phoneBody));
  const phoneMail = emlFiles()
    .filter((f) => !beforePhone.has(f))
    .find((f) => readEml(f).includes(phoneToken));
  check('Telefon-Anfrage erzeugt eine .eml-Datei', Boolean(phoneMail), phoneMail ?? 'keine Mail');
  if (phoneMail) {
    const content = readEml(phoneMail);
    check('Telefon-Anfrage enthaelt Telefonnummer', content.includes('+41 79 111 22 33'), 'Telefon');
    check('Telefon-Anfrage hat kein falsches Reply-To', !content.includes('Reply-To:'), 'kein Reply-To');
  } else {
    check('Telefon-Anfrage enthaelt Telefonnummer', false, 'keine Mail');
    check('Telefon-Anfrage hat kein falsches Reply-To', false, 'keine Mail');
  }

  /* 3) Ungueltige Anfrage (kein Kontaktweg) -> 400 + KEINE neue Mail --------- */
  const before2 = new Set(emlFiles());
  const resBad = await post({ name: 'Ohne Mail', message: 'Hallo, das ist eine Nachricht.' });
  check('Ungueltige Anfrage (kein Kontaktweg): Status 400', resBad.status === 400, `status ${resBad.status}`);
  const after2New = emlFiles().filter((f) => !before2.has(f));
  check('Ungueltige Anfrage erzeugt KEINE Mail (kein Leer-Versand)', after2New.length === 0, `${after2New.length} neu`);

  /* 4) Ungueltige Anfrage (Nachricht zu kurz) -> 400 ------------------------- */
  const resShort = await post({ name: 'Kurz', email: 'a@b.com', message: 'hi' });
  check('Zu kurze Nachricht: Status 400', resShort.status === 400, `status ${resShort.status}`);

  /* 5) Leerer Body -> 400 ---------------------------------------------------- */
  const resEmpty = await post(null);
  check('Leerer Body: Status 400', resEmpty.status === 400, `status ${resEmpty.status}`);

  /* 6) Honeypot ausgeloest -> 200, aber KEINE Mail (Spam still verworfen) ---- */
  const before5 = new Set(emlFiles());
  const resHp = await post({
    name: 'Bot',
    email: 'bot@example.com',
    message: 'Spam Spam Spam Nachricht',
    website: 'http://spam.example',
  });
  const hpBody = (await resHp.json().catch(() => null)) as { ok?: boolean; skipped?: boolean } | null;
  check('Honeypot: Status 200 (Bot lernt nichts)', resHp.status === 200, `status ${resHp.status}`);
  // Die Antwort ist absichtlich zeichengleich mit dem Erfolgsfall (contact-routes.ts):
  // ein "skipped: true" wuerde dem Bot verraten, dass das Feld ihn enttarnt hat.
  check('Honeypot: Antwort wie Erfolgsfall, kein skipped-Leak', hpBody?.ok === true && hpBody?.skipped === undefined, JSON.stringify(hpBody));
  const after5New = emlFiles().filter((f) => !before5.has(f));
  check('Honeypot erzeugt KEINE Mail', after5New.length === 0, `${after5New.length} neu`);

  await handle.close();

  /* Ausgabe ----------------------------------------------------------------- */
  console.log('\n=== Etappe 14 Verify (Kontaktformular -> info@) ===');
  console.log(`DB-Treiber: ${handle.driver}  |  Outbox: ${OUTBOX_DIR}\n`);
  let failed = 0;
  for (const c of checks) {
    console.log(`  ${c.ok ? 'PASS' : 'FAIL'}  ${c.name}  (${c.detail})`);
    if (!c.ok) failed++;
  }
  console.log('');
  if (failed > 0) {
    console.log(`VERDICT: FAIL (${failed}/${checks.length} Checks fehlgeschlagen)`);
    process.exit(1);
  }
  console.log(`VERDICT: PASS (${checks.length}/${checks.length} Checks gruen)`);
}

main().catch((err) => {
  console.error('[verify-contact] FEHLER:', err);
  process.exit(1);
});
