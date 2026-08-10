// Anfrage-Sektion der Startseite (Anker #probestunde).
//
// Design-Kritik Runde 3, Issue 4 ("Schwarze Leerflaeche"): der Block lief auf
// --color-surface-dark (#111) und war gemessen 805px hoch, waehrend die linke Spalte nur
// 201px Inhalt trug (Headline + drei Zeilen) und die Formularkarte rechts 613px. Es blieben
// rund 600px reines Schwarz ohne Aufgabe. Dazu kam der Systembruch: DESIGN.md:42 erlaubt die
// dunkle Flaeche ausdruecklich nur als EINEN bewussten Kontrast-Block. Gemessen lagen auf der
// Startseite DREI dunkle Zonen (dieser Block #111, der Events-Block #241316, der Footer #111)
// — drei Zaesuren entwerten jede einzelne.
//
// Fix, zwei Teile:
//  1. Flaeche. Der Block sitzt jetzt auf hellem Papier (bg-soft). Dunkel bleibt damit
//     genau EIN bewusster Kontrast — der Events-Block, wo er die Nacht-Stimmung traegt.
//  2. Leerraum. Die linke Spalte bekommt einen Job statt Luft: die drei Vertrauens-Anker,
//     die vorher nirgends auf der Seite standen (Antwortzeit, WhatsApp-Direktweg, echte
//     Google-Bewertung). Alle drei sind belegt — die Google-Zahlen kommen aus
//     site/reviews.ts (Harvest 2026-07-07), die Nummer aus SiteFooter CONTACT. Keine
//     erfundene Zahl, keine erfundene Zusage.

import { useLang } from '@/lib/i18n';
import { MessageCircle, Clock } from 'lucide-react';
import { InquiryWizard } from '@/public/contact/InquiryWizard';
import { Shell, GoogleRating } from '@/public/site/primitives';
import { CONTACT } from '@/public/site/SiteFooter';
import { MEASURE_L, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

export function Funnel() {
  const { lang } = useLang();
  const de = lang === 'de';

  return (
    <section id="probestunde" className={cn('scroll-mt-24 bg-[var(--color-bg-soft)]', SECTION_Y_HOME)}>
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
          <div className="max-w-xl lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <h2
              className={cn(
                'font-display text-4xl font-bold leading-[1.01] tracking-[-0.025em] text-[var(--color-ink)] sm:text-5xl',
                MEASURE_L,
              )}
            >
              {de ? 'Wobei können wir dir helfen?' : 'How can we help?'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
              {de
                ? 'Wähle Schnupperstunde, Kurs, Privatstunde oder ein anderes Anliegen. Danach fragen wir nur nach den Angaben, die dafür nötig sind.'
                : 'Choose a trial class, course, private lesson or another topic. We then ask only for the details needed for that request.'}
            </p>

            {/* Vertrauens-Anker: fuellt die Spalte mit Information statt mit Flaeche.
                Haarlinien statt Karten — dieselbe Bauform wie CoursePath/ReassuranceBand. */}
            <dl className="mt-9 border-t border-[var(--color-line)]">
              <div className="flex items-start gap-3.5 border-b border-[var(--color-line)] py-4">
                <Clock aria-hidden size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[var(--color-salsa)]" />
                <div>
                  <dt className="font-display text-base font-bold leading-tight text-[var(--color-ink)]">
                    {de ? 'Ein Mensch antwortet dir' : 'A person will answer you'}
                  </dt>
                  <dd className="mt-1 text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">
                    {de
                      ? 'Deine Anfrage landet direkt bei Fabio oder Sebastian, nicht in einem Ticket-System.'
                      : 'Your message goes straight to Fabio or Sebastian, not into a ticket system.'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3.5 border-b border-[var(--color-line)] py-4">
                <MessageCircle aria-hidden size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[var(--color-salsa)]" />
                <div>
                  <dt className="font-display text-base font-bold leading-tight text-[var(--color-ink)]">
                    {de ? 'Lieber kurz schreiben?' : 'Prefer a quick message?'}
                  </dt>
                  <dd className="mt-1 text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">
                    <a
                      href={CONTACT.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--color-ink)] underline decoration-[var(--color-salsa)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-salsa)]"
                    >
                      {de ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp'}
                    </a>
                    {de ? ' — auch ohne Formular.' : ' — no form needed.'}
                  </dd>
                </div>
              </div>
              <div className="py-4">
                <GoogleRating />
              </div>
            </dl>
          </div>

          {/* Die Karte behaelt ihre Fuellfarbe: sie hebt sich jetzt gegen bg-soft ab
              (vorher gegen Schwarz). Schatten deutlich zurueckgenommen — auf Papier war der
              70px-Schatten die "Schatten-Schwemme" aus DESIGN.md:77. */}
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper)]">
            <InquiryWizard initialTopic="schnupperstunde" compact />
          </div>
        </div>
      </Shell>
    </section>
  );
}
