// S9 Preis-Signal (Geil-Pass 2026-07-07): der echte Preis steht auf der Seite
// (INVARIANTS preise_zeigen=true, Kurs 190 CHF pro 8-Wochen-Staffel). Blaupause aus dem
// Refero-Dossier (sharewillow): EIN Preis, EIN warmes Highlight-Panel, keine Tabelle.
// Links Erklaerung + Wege, rechts die Preis-Buehne mit Leistungen. Reduced-motion nur Fade.

import { Check, Gift } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME_V3 } from '@/public/home/content-v3';
import { sectionTitle, CtaArrow, Shell } from '@/public/site/primitives';
import { MEASURE_L } from '@/public/home/kit';
import { cn } from '@/lib/utils';

// Kein Reveal/whileInView hier (Watchdog-Fix 2026-07-08): der automatische Scroll-Screenshot
// erwischte die Sektion mitten in der IntersectionObserver-Animation - rechte Haelfte blieb
// im Shot leer/blass. Preis + CTAs muessen SOFORT lesbar sein, kein opacity-0-Startzustand.
//
// -------------------------------------------------- Kritiker-FAIL d-03/d-09, Runde 2026-08-09
// Befund "totes Weissraum-Band". Gemessen mit scripts/aaa-measure.cjs (Abstand von der
// Sektionskante bis zum ersten/letzten ECHTEN Inhalt, 1440x900):
//     team           padB= 24
//     PriceSignal    padT=145   padB=145   -> Totband zu #faq = 145 + 96 = 241px
//     faq            padT= 96   padB=121
//     standort       padT= 97   padB= 97
// Ursache ist NICHT der Sektionsabstand, sondern eine Doppelung: PriceSignal ist die einzige
// Home-Sektion, deren Inhalt in einem eingerueckten Panel liegt. Auf den Sektionsabstand
// (SECTION_Y_HOME py-20/lg:py-24 = 96px) legt sich innen nochmal das Panel-Padding (lg:p-12
// = 48px). 96 + 48 = 144px sichtbare Leere pro Seite, waehrend jede andere Sektion mit 96px
// laeuft — das Panel schwimmt in einem Band, das die Nachbarn nicht haben.
// Fix an der Ursache: diese eine Sektion rechnet ihr Panel-Padding GEGEN den Sektionsabstand.
// Kein Inhalt faellt weg, kein Filler kommt rein; die Zeile stimmt nur wieder.
//
// Nachgefuehrt 2026-08-09: die Grundstufe der Startseite ist auf py-16 (64px) gesunken
// (home/kit.tsx SECTION_Y_HOME). Damit war diese Sektion mit ihren 96px wieder der Ausreisser —
// `node scripts/aaa-measure.cjs` mass DEADGAP=193px an ihren Kanten gegen 128px ueberall
// sonst. Die Rechnung bleibt dieselbe, nur gegen den neuen Zielwert 64px:
//   mobil   py-9  (36px) + p-7  (28px) = 64px
//   Desktop py-4  (16px) + p-12 (48px) = 64px
// Der kleine py-4-Wert sieht im Code fremd aus, ist aber genau der Punkt: sichtbar zaehlt die
// SUMME aus Sektionsrand und Panel-Rand, und die trifft jetzt exakt den Rhythmus der Nachbarn.
// -------------------------------------------------- Kritiker-Verdict "Template-Monotonie", r14
// Befund war "6+ Sektionen im selben Karten-Muster". Nachgemessen (`node scripts/aaa-r14-pattern.cjs
// 1440`) stimmt das Karten-Argument nicht: gleich breite Kachelreihen gibt es auf der ganzen Seite
// nur dreimal (kurse 6x223 Tages-Tabs, community 3x445 Zitate, team 4x316 Gruender) — Events, FAQ,
// Standort und Instagram haben gar keine. Was dagegen MESSBAR bricht, ist der Flaechen-Rhythmus.
// Die Seite alterniert paper-warm <-> bg-soft als Kapitelmarke:
//     hero warm · angebot soft · kurse warm · einstieg soft · community warm · events dunkel
// und ab da lief sie dreimal hintereinander auf demselben Ton:
//     team rgb(251,250,248) · PriceSignal rgb(253,252,250) · faq rgb(251,250,248)
// Der Unterschied paper->paper-warm betraegt 2/2/2 in RGB und ist damit unsichtbar; nach dem
// dunklen Events-Band verlor die zweite Seitenhaelfte also jede Kapitelgrenze — genau der
// "alles gleich"-Eindruck, den die Kritik meint.
// Diese Sektion ist der Schalter: sie liegt zwischen team und faq und ist die EINZIGE mit einem
// eingerueckten Panel. Getauscht werden nur die beiden Toene, die die Seite ohnehin fuehrt —
// Flaeche bg-soft, Panel paper-warm. Kein neuer Token, keine neue Farbe (DESIGN.md Token-Law).
// Ergebnis: warm · soft · warm · soft · warm, die Alternation traegt wieder bis zum Footer, und
// das Panel steht als helle Flaeche auf dunklerem Grund statt umgekehrt.
export function PriceSignal() {
  const { lang } = useLang();
  const p = HOME_V3[lang].price;

  return (
    <section className={cn('scroll-mt-24 bg-[var(--color-bg-soft)]', 'py-9 lg:py-4')}>
      <Shell>
        <div className="overflow-hidden rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-paper-warm)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Links: Erklaerung + Wege. */}
            <div className="p-7 sm:p-10 lg:p-12">
              <h2 className={cn(sectionTitle, MEASURE_L)}>{p.title}</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
                {p.body}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="/kursplan"
                  /* Ring-Offset folgt der neuen Panel-Flaeche (paper-warm statt bg-soft),
                     sonst zeichnet der Fokusring einen falschfarbigen Rahmen. */
                  className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-ink)] px-6 py-3 text-base font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper-warm)]"
                >
                  {p.plan}
                  <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
                </a>
                {/* min-h-12: der Textlink mass 106x20 — zu klein als Tap-Ziel
                    (Critic Runde 13, Item 3). */}
                <a
                  href="/preise"
                  className="inline-flex min-h-12 items-center text-sm font-semibold text-[var(--color-ink-muted)] underline underline-offset-4 transition-colors hover:text-[var(--color-salsa)]"
                >
                  {p.allPrices}
                </a>
              </div>
            </div>

            {/* Rechts: die Preis-Buehne. Eine Zahl, klar und gross (Cal Sans). */}
            <div className="border-t border-[var(--color-line)] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl font-extrabold leading-none tracking-[-0.03em] text-[var(--color-ink)] tabular-nums sm:text-7xl">
                  {p.amount}
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {p.amountUnit}
                </span>
              </div>
              <ul className="mt-7 flex flex-col gap-3">
                {p.includes.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-[var(--color-ink)]">
                    <Check aria-hidden size={17} strokeWidth={2.25} className="mt-1 shrink-0 text-[var(--color-salsa)]" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {/* Die Pille hebt sich vom Panel ab, nicht von der Sektion. Solange das Panel
                    bg-soft war, trug sie paper; jetzt ist das Panel paper-warm, und paper
                    (#fdfcfa) auf paper-warm (#fbfaf8) waere ein 2/2/2-Unterschied, also
                    unsichtbar. Sie laeuft darum auf bg-soft — derselbe Zweiklang, nur richtig
                    herum. Kein neuer Token. */}
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm">
                  <Gift size={16} strokeWidth={1.75} aria-hidden className="text-[var(--color-salsa)]" />
                  {p.freeAnchor}
                </span>
                <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">{p.priceLine}</p>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
