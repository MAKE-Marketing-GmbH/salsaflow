// Mailversand fuer Buchungsbestaetigungen (Etappe 8). Abstrahiert den Anbieter:
//  - RESEND_API_KEY gesetzt  -> echter Versand ueber Resend (ARCHITEKTUR.md 1.1, transaktionale Mails).
//  - sonst (Default)         -> lokaler "Outbox"-Treiber: schreibt jede Mail als .eml-Datei unter
//    ./.data/outbox und gilt als zugestellt. So ist "Bestaetigungsmails gehen raus" lokal
//    verifizierbar, ohne echte SMTP-Zugangsdaten (die liegen heute bei Jimdo, Offene Frage 17).
//
// Der Aufrufer (server/booking.ts) protokolliert jeden Versand zusaetzlich in der Tabelle
// `notifications` (queued -> sent/failed). mail.ts kennt die DB nicht, schickt nur.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const OUTBOX_DIR = resolve(here, '../.data/outbox');

// Absender + interne Mitlese-Adresse (info@). Per ENV uebersteuerbar.
export const MAIL_FROM = process.env.MAIL_FROM || 'Salsaflow Dance Company <info@salsaflow-dc.com>';
export const INFO_EMAIL = process.env.INFO_EMAIL || 'info@salsaflow-dc.com';

export type MailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  tag?: string;
  // Optionale Antwort-Adresse. Beim Kontaktformular (Etappe 14) der Besucher, damit info@ direkt
  // an die anfragende Person antworten kann. Buchungsmails (E8/E9) setzen das nicht -> unveraendert.
  replyTo?: string;
};
export type MailResult = { ok: boolean; driver: 'resend' | 'outbox'; id?: string; error?: string };

function safeName(s: string): string {
  return s.replace(/[^a-z0-9._-]+/gi, '_').slice(0, 80);
}

export async function sendMail(m: MailInput): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY?.trim();

  // --- Echter Versand ueber Resend -----------------------------------------
  if (key) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [m.to],
          subject: m.subject,
          text: m.text,
          ...(m.html ? { html: m.html } : {}),
          ...(m.replyTo ? { reply_to: m.replyTo } : {}),
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        return { ok: false, driver: 'resend', error: `Resend ${res.status}: ${body.slice(0, 200)}` };
      }
      const data = (await res.json().catch(() => ({}))) as { id?: string };
      return { ok: true, driver: 'resend', id: data.id };
    } catch (e) {
      return { ok: false, driver: 'resend', error: e instanceof Error ? e.message : 'Resend-Fehler' };
    }
  }

  // Serverless-Dateien sind kein Postfach. Ohne echten Anbieter darf ein Live-Formular
  // keinen Erfolg vorspiegeln, weil die Nachricht nach der Funktion wieder verschwindet.
  if (process.env.VERCEL) {
    return {
      ok: false,
      driver: 'outbox',
      error: 'Der Mailversand ist auf dieser Umgebung noch nicht konfiguriert.',
    };
  }

  // --- Lokaler Outbox-Treiber (Default) ------------------------------------
  try {
    mkdirSync(OUTBOX_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rnd = Math.random().toString(36).slice(2, 8);
    const fname = `${stamp}_${rnd}_${safeName(m.tag || m.to)}.eml`;
    const content =
      `To: ${m.to}\n` +
      `From: ${MAIL_FROM}\n` +
      (m.replyTo ? `Reply-To: ${m.replyTo}\n` : '') +
      `Subject: ${m.subject}\n` +
      `Content-Type: text/plain; charset=utf-8\n` +
      `\n${m.text}\n`;
    writeFileSync(resolve(OUTBOX_DIR, fname), content, 'utf8');
    return { ok: true, driver: 'outbox', id: fname };
  } catch (e) {
    return { ok: false, driver: 'outbox', error: e instanceof Error ? e.message : 'Outbox-Fehler' };
  }
}
