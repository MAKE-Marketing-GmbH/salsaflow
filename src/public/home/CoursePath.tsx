import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Shell, sectionLead } from '@/public/site/primitives';
import { MEASURE_L, MEASURE_M, SECTION_Y } from '@/public/home/kit';
import { RevealGroup, useRevealMotion } from '@/lib/reveal';
import { cn } from '@/lib/utils';

const COPY = {
  de: {
    title: 'Vom ersten Grundschritt zur sicheren Tanzfläche.',
    lead: 'Unsere Kurse sind so aufgebaut, dass du Schritt für Schritt in dein nächstes Level wächst.',
    levels: [
      ['Beginner Stufe 1 bis 6', 'Rhythmus, Grundschritte, Drehungen und die wichtigsten Signale im Paartanz.'],
      ['Beginner Flow', 'Beginner-Inhalte verbinden, Timing festigen und freier tanzen.'],
      // "Musikalitaet" stand sitewide 20 Mal ohne ein Wort Erklaerung. No-Go des Kunden:
      // "keine Fachbegriffe, die Laien nicht verstehen". Hier erklaert, wo der Begriff zuerst
      // auftaucht — ein Halbsatz reicht.
      ['Intermediate Stufe 7 bis 12', 'Technik und komplexere Kombinationen. Dazu Musikalität: hören, was die Musik gerade macht, und passend darauf tanzen.'],
      ['Intermediate Flow', 'Intermediate-Inhalte variieren und sicher auf der Tanzfläche einsetzen.'],
      ['Advanced ab Stufe 13', 'Details, Dynamik, Flow und eigenen Ausdruck vertiefen.'],
    ],
    fact: 'Eine Kursstaffel dauert in der Regel 8 Wochen mit einer Lektion à 60 Minuten pro Woche.',
    cta: 'Welches Level passt zu mir?',
  },
  en: {
    title: 'From your first steps to dancing with confidence.',
    lead: 'Our classes follow a clear path. You learn step by step and grow into your next level.',
    levels: [
      ['Beginner stages 1 to 6', 'Rhythm, basic steps, turns and the most important partner-dance signals.'],
      ['Beginner Flow', 'Connect the beginner material, strengthen your timing and dance more freely.'],
      ['Intermediate stages 7 to 12', 'Technique and more complex combinations. Plus musicality: hearing what the music is doing and dancing to it.'],
      ['Intermediate Flow', 'Vary the intermediate material and use it confidently on the dance floor.'],
      ['Advanced from stage 13', 'Refine detail, dynamics, flow and individual expression.'],
    ],
    fact: 'A regular course block usually runs for 8 weeks with one 60-minute class per week.',
    cta: 'Which level fits me?',
  },
} as const;

export function CoursePath({ embedded = false }: { embedded?: boolean } = {}) {
  const { lang } = useLang();
  const c = COPY[lang];

  const Heading = embedded ? 'h3' : 'h2';
  /* R188 / SW1 (Video 21.08.: "ueberall Animationen, Reinflieg beim Scrollen, sexy, nicht
     kompliziert"). Diese Sektion war die EINZIGE der Startseite ganz ohne Reveal — gezaehlt
     ueber `grep -c "Reveal\|whileInView\|data-reveal" src/public/home/*.tsx`: Hero 3,
     Offer 8, ScheduleTeaser 4, TeamBlock 12 ... CoursePath 0. Die Level-Treppe erschien
     hart, waehrend alles darueber und darunter einstieg.
     Genutzt wird das neue sitewide Muster aus `src/lib/reveal.tsx` — nicht der Home-lokale
     Reveal, damit dieselbe Sektion auf /kursaufbau (nicht embedded) denselben Takt bekaeme.
     Der Takt ist derselbe wie sitewide (14px, 0.45s, ease-out), nur der Stagger ist mit
     0.06 leicht dichter: fuenf Stufen nacheinander bei 0.07 lesen sich als Warteschlange. */
  const { item } = useRevealMotion({ stagger: 0.06 });

  const body = (
    <>
        <RevealGroup className="max-w-3xl">
          <motion.div variants={item}>
            <Heading
              /* R188 / H4 + SW3 (Video 21.08.): "Ueberschriften ueberall gleiche Groesse.
                 'Vom ersten Grundschritt zur sicheren Tanzflaeche' faellt raus."
                 Der Kunde hat GENAU diese Zeile benannt, und sie war messbar die einzige
                 Kapitelzeile der Startseite auf einer fremden Stufe: gemessen 1440px trug
                 sie 23px (type-h3), waehrend alle neun anderen Sektionsueberschriften der
                 Seite auf 44px liefen.

                 Warum die Groesse steigt und nicht die der anderen sinkt: sie eroeffnet ein
                 eigenes Kapitel mit eigenem Lead, eigenem CTA und der fuenfstufigen
                 Level-Treppe darunter. Sie ist eine Sektionsueberschrift, sie sah nur nicht
                 so aus.

                 Das <h3>-Tag bleibt: die Zeile steht innerhalb der Sektion #kurse, deren H2
                 ("Finde deinen naechsten Kurs in wenigen Minuten.") darueber liegt. Ein
                 zweites <h2> in derselben Sektion waere eine Luege ueber die Gliederung.
                 Getrennt werden also GROESSE (jetzt einheitlich type-h2) und EBENE (weiter
                 h3) — genau das meint SW3 mit "konsistente Hierarchie": gleiche Rolle,
                 gleiche Groesse. Die Level-Liste darunter laeuft auf type-h5 (18px) und
                 bleibt damit klar die Ebene darunter. */
              className={cn('type-h2', 'text-[var(--color-ink)]', MEASURE_L)}
            >
              {c.title}
            </Heading>
          </motion.div>
          <motion.p variants={item} className={`mt-4 max-w-xl ${sectionLead}`}>
            {c.lead}
          </motion.p>
          <motion.a
            variants={item}
            href="/kursaufbau"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-[var(--color-salsa)]"
          >
            {c.cta}
            <ArrowRight size={17} strokeWidth={2.25} className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden />
          </motion.a>
        </RevealGroup>

        <div className={cn('grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16', embedded ? 'mt-10 lg:mt-12' : 'mt-12 lg:mt-16')}>
          {/* R188 / SW1: die fuenf Stufen steigen nacheinander ein statt alle auf einmal.
              Das ist die Stelle, an der eine Reinflieg-Animation etwas BEDEUTET — die Liste
              ist eine Treppe, und der Stagger laesst sie als Treppe lesen. `motion.ol` traegt
              die Gruppe, damit die <li> direkte Kinder bleiben: ein Wrapper-<div> dazwischen
              wuerde die Liste fuer Screenreader zerlegen. */}
          <RevealGroup as="ol" className="relative order-2 lg:order-1" stagger={0.06}>
            <span aria-hidden className="absolute left-[3px] top-2 bottom-8 w-px bg-[var(--color-line)]" />
            {c.levels.map(([name, body], i) => {
              const LevelHeading = embedded ? 'h4' : 'h3';
              return (
                <motion.li variants={item} key={name} className="group relative pb-9 pl-8 last:pb-0">
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-0 top-2 h-[9px] w-[9px] rounded-full bg-[var(--color-salsa)] ring-4',
                      embedded ? 'ring-[var(--color-paper-warm)]' : 'ring-[var(--color-paper)]',
                      'transition-transform duration-[var(--dur-base)] ease-out motion-safe:group-hover:scale-150',
                    )}
                  />
                  {/* R188 / H4: eingebettet ist diese Zeile ein <h4> UNTER der H3
                      "Vom ersten Grundschritt zur sicheren Tanzflaeche" — sie trug aber
                      `type-h3` und rendered damit exakt gleich gross wie ihre eigene
                      Ueberschrift (beide 23px, gemessen 1440px). Eine Ebene, die nicht
                      kleiner wird, ist keine Ebene. Eingebettet jetzt `type-h5`, die
                      echte Stufe darunter (18px). Eigenstaendig (auf /kursaufbau, dort
                      ist die Zeile ein <h3> unter einer H2) bleibt es `type-h3`. */}
                  <LevelHeading
                    className={cn(
                      embedded ? 'type-h5' : 'type-h3',
                      'text-[var(--color-ink)]',
                      MEASURE_M,
                    )}
                  >
                    <span className="mr-2.5 tabular-nums text-[var(--color-salsa)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {name}
                  </LevelHeading>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)] sm:text-base">
                    {body}
                  </p>
                </motion.li>
              );
            })}
          </RevealGroup>

          {/* Die Fakt-Zeile stand bisher INNERHALB des <ol>. Ein <p> ist dort kein erlaubtes
              Kind (nur <li>, <script>, <template>) — der Browser haengt es zwar an, aber
              Screenreader zaehlen es je nach Engine als sechsten Listeneintrag. Sie steht
              jetzt als Geschwister direkt darunter; Abstand und Haarlinie sind unveraendert,
              nur die order-Klasse musste mit, damit sie auf lg weiter links unter der Liste
              sitzt statt neben dem Foto. */}
          <motion.p
            data-reveal
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-8% 0px' }}
            className="order-3 -mt-1 flex max-w-xl items-start gap-3 border-t border-[var(--color-line)] pt-5 text-sm leading-relaxed text-[var(--color-ink-muted)] lg:order-3 lg:col-start-1"
          >
            <CalendarDays aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-salsa)]" strokeWidth={1.8} />
            <span>{c.fact}</span>
          </motion.p>

          <figure className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            <div className="relative h-64 overflow-hidden rounded-[var(--radius-media)] sm:h-80 lg:h-[30rem]">
              <img
                src="/photos/party/party-36.webp"
                alt={
                  lang === 'de'
                    ? 'Eine volle Kursgruppe übt gemeinsam im hellen Salsaflow-Studio'
                    : 'A full class practising together in the bright Salsaflow studio'
                }
                width={1500}
                height={1000}
                loading="lazy"
                // Kein Zoom mehr: origin-bottom scale-[1.35] schob die Koepfe der vorderen
                // Taenzerinnen bei 1440 ueber den oberen Rahmen (Critic Runde 6, Item 2).
                // 22% statt center haelt die Kopfreihe im hohen lg-Fenster im Bild.
                className="h-full w-full object-cover object-[50%_22%]"
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-transparent" />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {lang === 'de'
                ? 'Beginner-Kurs im Studio am Bahnhof SBB. So sieht eine normale Lektion aus.'
                : 'A beginner class at our studio by Basel SBB. This is what a normal lesson looks like.'}
            </figcaption>
          </figure>
        </div>
    </>
  );

  if (embedded) {
    return (
      <div id="kursaufbau" className="mt-10 scroll-mt-24 border-t border-[var(--color-line)] pt-8">
        {body}
      </div>
    );
  }

  return (
    <section id="kursaufbau" className={cn('scroll-mt-24 bg-[var(--color-paper)]', SECTION_Y)}>
      <Shell>{body}</Shell>
    </section>
  );
}
