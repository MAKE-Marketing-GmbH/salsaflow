// Rueckkehr-Seiten unter /buchung/erfolg und /buchung/abbruch.
//
// Sie gehoeren zum Stripe-Pfad: der Zahlungsanbieter schickte die Person nach dem Bezahlen
// hierher zurueck (server/payment-service.ts baut diese Links). Auf dieser Website gibt es
// keine Zahlung — der Funnel ist eine Reservierung, bezahlt wird vor Ort.
//
// Vorher rief diese Seite `/api/public/bookings/:id/status`. Den Endpunkt gibt es hier nicht;
// die Antwort war ein 503, und die Seite zeigte jedem Besucher "Buchung nicht gefunden".
// Wer ueber einen alten Link kommt, landete also in einer Sackgasse.
//
// Jetzt sagt die Seite, was Sache ist, und fuehrt weiter. Der Server-Code fuer Zahlungen
// bleibt unangetastet: wird er spaeter scharf geschaltet, gehoert hier wieder eine echte
// Statusabfrage hin.

import { Seo } from '@/lib/seo';
import { useLang } from '@/lib/i18n';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { CtaPill, CtaText } from '@/public/site/primitives';

export function BookingReturn() {
  const { lang } = useLang();
  const de = lang === 'de';
  const cancelled = globalThis.window?.location.pathname.includes('abbruch') ?? false;

  const title = cancelled
    ? de ? 'Kein Problem.' : 'No problem.'
    : de ? 'Danke für deine Anfrage.' : 'Thanks for your request.';
  const body = cancelled
    ? de
      ? 'Du hast nichts abgeschlossen. Such dir im Kursplan einen Termin, der besser passt — reservieren kostet nichts und du zahlst erst vor Ort.'
      : 'Nothing was completed. Pick a time that suits you better in the schedule — reserving is free and you pay on site.'
    : de
      ? 'Wir melden uns und bestätigen deinen Platz. Bezahlt wird vor Ort, mit Twint oder bar.'
      : 'We will get back to you and confirm your spot. You pay on site, by TWINT or cash.';

  return (
    <>
      <Seo page="bookingStatus" noindex />
      <SiteHeader solidBackdrop />
      <main
        id="main"
        tabIndex={-1}
        className="bg-[var(--color-paper-warm)]"
        style={{ paddingTop: 'calc(var(--nav-h) + 3rem)' }}
      >
        <div className="mx-auto max-w-[38rem] px-5 pb-20 text-center sm:px-8">
          <h1 className="type-h1 text-[var(--color-ink)]">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
            {body}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaPill href="/kursplan">{de ? 'Zum Kursplan' : 'To the schedule'}</CtaPill>
            <CtaText href="/kontakt">{de ? 'Frage stellen' : 'Ask a question'}</CtaText>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
