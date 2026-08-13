// Oeffentliche Kontakt-API (Etappe 14): nimmt eine Kontaktanfrage entgegen und schickt sie als
// Mail an info@salsaflow-dc.com. KEIN Auth-Gate (öffentliches Formular).
//
// Wichtig (Memory-Falle "Formular sendet nichts"): Das Formular sendet NIE ins Leere. Jede gueltige
// Anfrage erzeugt nachweisbar eine Mail über die Mail-Mechanik aus server/mail.ts:
//   - ohne RESEND_API_KEY -> lokale .eml-Datei unter ./.data/outbox (Default, lokal verifizierbar)
//   - mit RESEND_API_KEY   -> echter Versand (Launch-Config)
// Scheitert der Versand, antwortet die Route mit Fehler (kein Fake-Erfolg). Die anfragende Person
// Eine angegebene E-Mail-Adresse steht als Reply-To in der Mail. Bei Telefon-Anfragen antwortet
// das Team über die mitgesendete Nummer.

import { Hono } from 'hono';
import { z } from 'zod';
import { INFO_EMAIL, sendMail } from './mail.js';
import { clientKey, rateLimit } from './rate-limit.js';

// Erlaubte Anliegen (das Formular bietet sie als Auswahl; freier Text ist die Nachricht).
const TOPIC_LABEL: Record<string, string> = {
  kontakt: 'Allgemeine Frage',
  schnupperstunde: 'Schnupperstunde',
  kurs: 'Kurs & Anmeldung',
  privatstunden: 'Privatstunden',
  raumvermietung: 'Raumvermietung',
  events: 'Events',
  geschenkgutschein: 'Geschenkgutschein',
  animationen: 'Animationen & Shows',
};

const contactSchema = z
  .object({
    // Der Name steht in der Betreffzeile. Ein Zeilenumbruch darin wuerde dort eine neue
    // Kopfzeile oeffnen (siehe headerSafe in server/mail.ts). Die Regex steht VOR dem
    // Trimmen — sonst ist ein fuehrender Umbruch schon weg, bevor sie ihn sehen kann
    // (dieselbe Reihenfolge wie in reservation-routes.ts, dort ausfuehrlich begruendet).
    name: z.string().regex(/^[^\r\n]*$/, 'Zeilenumbrüche sind nicht erlaubt').trim().min(1).max(120),
    email: z.string().trim().email().max(160).optional().nullable(),
    phone: z.string().trim().max(40).optional().nullable(),
    topic: z
      .enum([
        'kontakt',
        'schnupperstunde',
        'kurs',
        'privatstunden',
        'raumvermietung',
        'events',
        'geschenkgutschein',
        'animationen',
      ])
      .optional(),
    message: z.string().trim().min(5).max(4000),
    language: z.enum(['de', 'en']).optional(),
    // Honeypot: ein für Menschen unsichtbares Feld. Bots fuellen es gern aus. Das eigentliche
    // Verwerfen passiert im Handler (ist es gesetzt -> still verwerfen, 200, der Bot lernt nichts).
    // Hier nur als optionalen String akzeptieren.
    website: z.string().optional(),
  })
  .refine((data) => Boolean(data.email?.trim() || data.phone?.trim()), {
    message: 'E-Mail oder Telefonnummer ist erforderlich',
    path: ['email'],
  });

export function createContactRoutes() {
  const app = new Hono();

  app.post('/api/public/contact', async (c) => {
    // Jede gueltige Anfrage erzeugt eine Mail ans Studio. Ohne Limit laesst sich das Postfach
    // fluten; der Honeypot haelt nur naive Bots auf.
    const limit = rateLimit(clientKey(c.req.raw.headers, 'contact'), 5, 10 * 60 * 1000);
    if (!limit.ok) {
      return c.json(
        { error: 'Zu viele Anfragen in kurzer Zeit. Bitte versuch es später noch einmal.' },
        429,
        { 'retry-after': String(limit.retryAfterSeconds) },
      );
    }

    const parsed = contactSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      // Die Zod-Fehlerliste bleibt im Log. Nach aussen ging sie vorher mit: Feldnamen, Typen,
      // Grenzwerte — und darunter der Honeypot-Feldname. Ein Bot baute sich daraus mit einem
      // einzigen leeren POST die perfekte Nutzlast. Das Formular kennt seine eigenen Regeln.
      console.error('[contact] ungueltige Eingabe', parsed.error.issues);
      return c.json({ error: 'Ungültige Eingabe' }, 400);
    }
    const d = parsed.data;
    const replyEmail = d.email?.trim() || null;

    // Honeypot ausgeloest -> als Spam still verwerfen. Die Antwort ist Zeichen fuer Zeichen
    // dieselbe wie im Erfolgsfall. Ein "skipped: true" verriet dem Bot, dass das Feld ihn
    // enttarnt hat — beim naechsten Versuch liess er es einfach leer.
    if (d.website && d.website.trim().length > 0) {
      console.error('[contact] Honeypot ausgeloest, Anfrage verworfen');
      return c.json({ ok: true }, 200);
    }

    const topicLabel = TOPIC_LABEL[d.topic ?? 'kontakt'] ?? TOPIC_LABEL.kontakt;
    const subject = `Neue Kontaktanfrage: ${topicLabel} - ${d.name}`;
    const text =
      `Neue Anfrage über das Kontaktformular der Website.\n\n` +
      `Anliegen: ${topicLabel}\n` +
      `Name: ${d.name}\n` +
      `E-Mail: ${replyEmail ?? '(nicht angegeben)'}\n` +
      `Telefon: ${d.phone?.trim() ? d.phone.trim() : '(nicht angegeben)'}\n` +
      `Sprache: ${d.language === 'en' ? 'Englisch' : 'Deutsch'}\n\n` +
      `Nachricht:\n${d.message}\n\n` +
      (replyEmail
        ? `Antwort geht direkt an ${replyEmail} (Reply-To gesetzt).\n`
        : `Antwort bitte per Telefon oder WhatsApp.\n`);

    const res = await sendMail({
      to: INFO_EMAIL,
      replyTo: replyEmail ?? undefined,
      subject,
      text,
      tag: `kontakt_${d.topic ?? 'kontakt'}`,
    });

    if (!res.ok) {
      // KEIN Fake-Erfolg: die Person bekommt einen ehrlichen Fehler und kann auf mailto ausweichen.
      console.error('[contact] Mailversand fehlgeschlagen:', res.error);
      // Der Grund bleibt im Log, nicht in der Antwort an den Client.
      return c.json({ error: 'Mail konnte nicht gesendet werden' }, 502);
    }

    return c.json({ ok: true, driver: res.driver, id: res.id }, 200);
  });

  return app;
}
