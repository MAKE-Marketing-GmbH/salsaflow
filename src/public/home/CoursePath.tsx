// Sektions-Variante 2 von 3: die Level-TREPPE neben einem Studio-Foto.
//
// Vorher liefen WhyGrid, CoursePath und TeamBlock auf derselben Formel (Kopf oben, darunter ein
// gleichmaessiges Karten-/Spalten-Raster). Dreimal dieselbe Bauform auf einer Seite liest sich
// als Template. Die Levels sind aber eine FOLGE, kein Raster — darum laufen sie an einer
// senkrechten Schiene. Das Raster kam vorher sogar in die falsche Lesereihenfolge: zwei Spalten
// a drei/zwei Eintraege lasen sich 1-2-3 | 4-5 untereinander, obwohl es eine einzige Treppe
// von Stufe 1 bis 13 ist.
//
// ---------------------------------------------------------------------------------------------
// Fix-Runde 1 (2026-08-07), Kritiker-Fund d-04/m-05-06: "lange leere Template-Weisse ohne
// Foto-Rhythmus, nacktes Numbered-List-Template".
//
// URSACHE (gemessen, scripts/r1-home-probe2.cjs auf 1440px): der Zickzack war die Quelle der
//   Leere, nicht ein fehlender Abstand. Die Treppe stand in einer 1336px breiten Flaeche,
//   aber jede Stufe belegte nur 517px Text — abwechselnd links (x 208..725) und rechts
//   (x 716..1232). Pro Zeile blieben also rund 800px, also 61 % der Flaeche, per Konstruktion
//   leer; die Sektion mass 1027px Hoehe fuer 621px Inhalt. Ein Zickzack braucht diese Leere
//   auf beiden Seiten, sonst ist er kein Zickzack. Mehr Spacing haette das verschlimmert.
//
// FIX: die Treppe laeuft an EINER Schiene (eine Textkante, echte Lesereihenfolge 01..05) und
//   die frei werdende Spalte traegt ein echtes Studio-Foto, das mit der Treppe mitscrollt
//   (sticky). Damit ist die Flaeche belegt, ohne einen Absatz Fuelltext zu erfinden, und die
//   Sektion bekommt den fehlenden Foto-Rhythmus — sie war laut Sonde eine von vier Sektionen
//   mit `imgs: 0` in Folge (kurse 0, einstieg 0, dann erst community 2).
//   Foto: /photos/2026/kurse-classfreude-01.webp — echte volle Kursgruppe im hellen Studio,
//   Salsaflow-Logo an der Wand, Tageslicht. Genau das Motiv, das "Kurs-Aufbau" belegt.
//   Sitewide 2. Einsatz (sonst nur /preise regular.image, andere Seite, anderer Job) — DESIGN.md
//   erlaubt max 2x mit klar anderem Einsatz, auf DIESER Seite kommt es nur einmal vor.
//
// Bleibt hell: paper-Flaeche, Haarlinien-Schiene, Rot nur als Marker.

import { ArrowRight, CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Shell, sectionLead } from '@/public/site/primitives';
import { MEASURE_L, MEASURE_M, SECTION_Y } from '@/public/home/kit';
import { cn } from '@/lib/utils';

const COPY = {
  de: {
    title: 'Vom ersten Grundschritt zur sicheren Tanzfläche.',
    lead: 'Unsere Kurse sind klar aufgebaut. Du lernst Schritt für Schritt und wächst in dein nächstes Level hinein.',
    levels: [
      ['Beginner Stufe 1 bis 6', 'Rhythmus, Grundschritte, Drehungen und die wichtigsten Signale im Paartanz.'],
      ['Beginner Flow', 'Beginner-Inhalte verbinden, Timing festigen und freier tanzen.'],
      ['Intermediate Stufe 7 bis 12', 'Technik, Musikalität und komplexere Kombinationen aufbauen.'],
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
      ['Intermediate stages 7 to 12', 'Build technique, musicality and more complex combinations.'],
      ['Intermediate Flow', 'Vary the intermediate material and use it confidently on the dance floor.'],
      ['Advanced from stage 13', 'Refine detail, dynamics, flow and individual expression.'],
    ],
    fact: 'A regular course block usually runs for 8 weeks with one 60-minute class per week.',
    cta: 'Which level fits me?',
  },
} as const;

/** Kritiker final-2, Issue 2 (MAJOR, "13 gestapelte Module = SaaS-Stack statt Editorial"):
 *  "Finde deinen naechsten Kurs" (ScheduleTeaser) und "Vom ersten Grundschritt zur sicheren
 *  Tanzflaeche" (diese Datei) waren zwei eigene <section> mit zwei H2, zwei Hintergruenden und
 *  zwei vollen Sektionsabstaenden — obwohl beide DENSELBEN Gedanken tragen: welcher Kurs, welches
 *  Level. Zwei Kapitelgrenzen fuer einen Gedanken ist genau der Stapel-Eindruck, den die Kritik
 *  meint.
 *  `embedded` rendert die Treppe darum ohne eigenes <section> und ohne eigene Shell (sie laeuft
 *  dann in der Shell von ScheduleTeaser) und demoted die Ueberschrift auf H3 — der Kurs-Block
 *  hat danach EINE H2 und EINE Kapitelgrenze. Kein Wort Copy faellt weg. Die Standalone-Variante
 *  bleibt erhalten, damit die Sektion anderswo unveraendert weiterverwendet werden kann. */
export function CoursePath({ embedded = false }: { embedded?: boolean } = {}) {
  const { lang } = useLang();
  const c = COPY[lang];

  const Heading = embedded ? 'h3' : 'h2';

  const body = (
    <>
        <div className="max-w-3xl">
          <Heading
            className={cn(
              'font-display font-bold leading-[0.98] tracking-tight text-[var(--color-ink)]',
              embedded
                ? 'text-2xl sm:text-3xl md:text-[2.25rem]'
                : 'text-3xl sm:text-4xl md:text-[2.75rem]',
              MEASURE_L,
            )}
          >
            {c.title}
          </Heading>
          <p className={`mt-4 max-w-xl ${sectionLead}`}>{c.lead}</p>
          <a
            href="/kursaufbau"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-[var(--color-salsa)]"
          >
            {c.cta}
            <ArrowRight size={17} strokeWidth={2.25} className="transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>

        {/* Treppe links, Foto rechts. Ab lg zwei Spalten; das Foto ist `sticky` und bleibt
            neben der Treppe stehen, solange man sie liest — es ist damit ein Begleiter des
            Lesepfads, kein weiterer Stapel-Block. Unter lg laeuft die Treppe wie bisher an
            der linken Schiene, das Foto sitzt darueber (Bild zuerst, dann die Stufen). */}
        <div className={cn('grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16', embedded ? 'mt-10 lg:mt-12' : 'mt-12 lg:mt-16')}>
          <ol className="relative order-2 lg:order-1">
            <span aria-hidden className="absolute left-[3px] top-2 bottom-8 w-px bg-[var(--color-line)]" />
            {c.levels.map(([name, body], i) => {
              const LevelHeading = embedded ? 'h4' : 'h3';
              return (
                <li key={name} className="group relative pb-9 pl-8 last:pb-0">
                  {/* Marker auf der Schiene. Micro-Interaction: nur scale, hinter motion-safe.
                      Der Ring maskiert die Schiene und muss die FLAECHE treffen, auf der die
                      Treppe steht — eingebettet paper-warm (ScheduleTeaser), sonst paper. */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-0 top-2 h-[9px] w-[9px] rounded-full bg-[var(--color-salsa)] ring-4',
                      embedded ? 'ring-[var(--color-paper-warm)]' : 'ring-[var(--color-paper)]',
                      'transition-transform duration-300 ease-out motion-safe:group-hover:scale-150',
                    )}
                  />
                  {/* Die Ziffer laeuft als Praefix IN der Ueberschrift statt als eigene
                      01-Zeile darueber. Grund (Kritikpunkt 6, Eyebrow-/Nummern-Flut): auf der
                      Seite standen zwei getrennte 01-02-03-04-Stapel — hier und in WhyGrid.
                      Die Treppe braucht ihre Nummern (sie IST eine Reihenfolge), der Einwand-
                      Block nicht; dort sind sie jetzt weg. Als Praefix kostet die Ziffer keine
                      eigene Zeile mehr und der Block wirkt nicht mehr als Formular-Liste. */}
                  <LevelHeading
                    className={cn(
                      'font-display text-2xl font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)]',
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
                </li>
              );
            })}

            <p className="mt-9 flex max-w-xl items-start gap-3 border-t border-[var(--color-line)] pt-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              <CalendarDays aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-salsa)]" strokeWidth={1.8} />
              <span>{c.fact}</span>
            </p>
          </ol>

          {/* Das Foto fuellt die Spalte, die der alte Zickzack leer liess. object-[50%_38%]:
              die Gruppe steht in kurse-classfreude-01 im mittleren Bildband, oben ist Decke,
              unten leeres Parkett — 38 % legt das Fenster auf die Koerper und Gesichter. */}
          <figure className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            <img
              src="/photos/2026/kurse-classfreude-01.webp"
              alt={
                lang === 'de'
                  ? 'Eine volle Kursgruppe tanzt gemeinsam im hellen Salsaflow-Studio, Arme oben'
                  : 'A full class dancing together in the bright Salsaflow studio, arms raised'
              }
              width={1920}
              height={1280}
              loading="lazy"
              className="h-64 w-full rounded-[var(--radius-media)] object-cover object-[50%_38%] sm:h-80 lg:h-[30rem]"
            />
            <figcaption className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {lang === 'de'
                ? 'Beginner-Kurs im Studio am Bahnhof SBB. So sieht eine normale Lektion aus.'
                : 'A beginner class at our studio by Basel SBB. This is what a normal lesson looks like.'}
            </figcaption>
          </figure>
        </div>
    </>
  );

  // Eingebettet: kein eigenes <section>, keine eigene Shell — der Block laeuft im Kurs-Kapitel
  // von ScheduleTeaser weiter. Der Anker #kursaufbau wandert auf den Wrapper, damit bestehende
  // Sprungziele erhalten bleiben.
  //
  // Kritiker-FAIL 2026-08-09, "keine halbleeren Viewport-Hoehen ohne Inhalt": nach dem
  // Straffen der Sektionskanten war der groesste tote Streifen der Seite kein Sektionsrand
  // mehr, sondern dieser INNERE Abstand — gemessen 160px reine Leerflaeche
  // (`python3 scripts/aaa-r10-dead.py`, DEAD y=2700..2860). Er lag damit ueber der
  // Kapitelgrenze (128px), obwohl er zwei Bloecke DESSELBEN Kapitels trennt: die Trennung
  // markiert hier schon die Haarlinie, ein Kapitelwechsel findet gar nicht statt.
  //
  // Kritiker-Befund 2026-08-09, "Mid-Sections (Levels/FAQ): vertikale Rhythmen enger":
  // nach dem obigen Eingriff standen hier 104px (Desktop) um die Haarlinie — gemessen mit
  // Playwright endete der Kursplan-Block bei y=2707, die Level-Headline begann bei y=2812.
  // Damit war dieser INNERE Abstand nur 24px kleiner als eine echte Kapitelgrenze (128px)
  // und blieb der groesste einzelne Leerstreifen der Seitenmitte
  // (`python3 scripts/aaa-r10-dead.py`: DEAD 120px y=2700..2820).
  // Neu mt-10/pt-8 auf allen Stufen = 72px. Das ist knapp die Haelfte einer Kapitelgrenze,
  // die Hierarchie "Kapitel > Block" liest sich damit auch im Abstand eindeutig, und die
  // Haarlinie bleibt der eigentliche Trenner.
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
