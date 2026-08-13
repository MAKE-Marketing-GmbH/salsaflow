import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME_V3, TRIAL_HREF } from '@/public/home/content-v3';
import { Shell } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { MEASURE_L, MEASURE_M, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

// Sektions-Variante 1 von 3: STICKY-SPALTE. Der Kopf bleibt links stehen, waehrend rechts die
// vier Einwaende durchlaufen. Bewusst KEIN Karten-Raster — die Formel wiederholt sich sonst
// dreimal auf derselben Seite (siehe CoursePath = Treppe + Foto, TeamBlock = Foto-Band).
//
// ---------------------------------------------------------------------------------------------
// Fix-Runde 1 (2026-08-07), Kritiker-Fund d-05/m-07: "leere beige Weissflaeche, nacktes
// Numbered-List-Template".
//
// URSACHE (gemessen, scripts/r1-home-probe2.cjs auf 1440px): die Sektion mass 758px Hoehe bei
//   vier Eintraegen von zusammen 566px — und `imgs: 0`. Die linke Sticky-Spalte gab ihre
//   Headline nach rund 300px frei und stand danach bis zum Sektionsende leer; da die rechte
//   Spalte kuerzer ist als die Sektion hoch, entstand unten links ein leeres beiges Feld.
//   Zusammen mit `kurse` (ebenfalls imgs: 0) liefen so zwei Sektionen und rund 2700px am
//   Stueck voellig ohne Foto — genau der Rhythmus-Bruch, den die Kritik "Template-Weisse" nennt.
//
// ZWEI EINGRIFFE, beide klein:
//   1. Die leere Sticky-Spalte bekommt unter dem CTA ein echtes Community-Foto
//      (community-diversitaet-01.webp, sitewide bisher NICHT referenziert, geprueft per grep).
//      Motiv passt zum Argument der Sektion: erkennbar verschiedene Menschen und Altersgruppen
//      auf der Flaeche — der Beweis fuer "der erste Schritt darf leicht sein", kein Deko-Bild.
//   2. Die 01-02-03-04-Spalte faellt weg (Kritikpunkt 6). Die Nummern trugen hier keine
//      Reihenfolge — die vier Einwaende sind gleichrangig und in beliebiger Ordnung lesbar,
//      anders als die Level-Treppe in CoursePath, wo 01..05 eine echte Folge ist. Zwei
//      identische Ziffernstapel auf einer Seite lasen sich als SaaS-Formel. Der frei werdende
//      Platz geht an die Antwortspalte, kein Wort Copy faellt weg.
export function WhyGrid() {
  const { lang } = useLang();
  const w = HOME_V3[lang].why;
  const { item } = useReveal({ stagger: 0.07 });
  const de = lang === 'de';

  return (
    <section id="einstieg" className={cn('relative scroll-mt-24 bg-[var(--color-bg-soft)]', SECTION_Y_HOME)}>
      {/* -------------------------------------------------- Kritiker-Verdict r14, Punkt 1
          Befund "6+ Sektionen im selben Muster". Nachgemessen mit
          `node scripts/aaa-r14-pattern.cjs 1440` bleibt davon genau EIN echtes Doppel uebrig:
          diese Sektion und #faq liefen beide auf "Kopf-Schiene links (lg:sticky) + haarlinien-
          getrennte Zeilen rechts". Alle anderen Sektionen haben nachweislich eigene Bauformen
          (angebot Split mit Grosskarte, kurse Tages-Tabs + Treppe, events Foto-Collage dunkel,
          team full-bleed Band, price Panel, standort Foto/Text, instagram Video-Reihe).

          Dazu kam ein toter Regelsatz: `node scripts/aaa-r14-sticky.cjs` mass fuer diese Rail
          rail=592 / nachbar=592 — die scrollende Nachbarspalte ist EXAKT so hoch wie die
          Schiene, also gibt es nichts, woran sie kleben koennte. `lg:sticky lg:top-28` hat hier
          nie gewirkt (in #kurse und #faq wirkt es: 515/582 bzw. 223/553). Die Regel faellt
          darum weg, statt sie zu behalten und zu erklaeren.

          Die vier Einwaende laufen jetzt als 2x2-Paarfeld statt als vier volle Zeilen. Das ist
          die inhaltlich richtigere Form — die vier sind gleichrangig und in beliebiger
          Reihenfolge lesbar (steht so schon im Kopfkommentar oben) — und es trennt die Sektion
          sichtbar von der langen Einspalten-Liste in #faq. Kein Wort Copy faellt weg, keine
          Karte kommt dazu: Trenner bleiben Haarlinien, kein Radius, kein Rahmen, kein Schatten. */}
      <Shell className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
        <Reveal className="lg:self-start">
          {/* Zeilenmass am Heading (em loest gegen 52px auf), nicht am Wrapper. */}
          <motion.h2
            variants={item}
            className={cn(
              'font-display text-[2.35rem] leading-[0.98] tracking-[-0.025em] text-[var(--color-ink)] sm:text-[3.25rem]',
              MEASURE_L,
            )}
          >
            {de ? 'Der erste Schritt darf leicht sein.' : 'Your first step can feel easy.'}
          </motion.h2>
          <motion.p variants={item} className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-[var(--color-ink-muted)]">
            {w.turn}
          </motion.p>
          <motion.a
            variants={item}
            href={TRIAL_HREF}
            className="group mt-7 inline-flex min-h-12 items-center gap-2 font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-4"
          >
            {de ? 'Schnupperstunde buchen' : 'Book a trial class'}
            <ArrowRight aria-hidden size={18} strokeWidth={2.25} className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
          </motion.a>

          {/* Fuellt die gemessene Leerzone unter dem CTA (Kopfkommentar Eingriff 1).
              object-[50%_42%]: die Gesichter der vorderen Reihe liegen im Motiv bei rund
              30..50 % der Hoehe, oben ist Decke/Licht, unten Parkett. */}
          <motion.img
            variants={item}
            src="/photos/2026/community-diversitaet-01.webp"
            alt={
              de
                ? 'Tanzende unterschiedlichen Alters auf der Fläche an einem Salsaflow-Abend'
                : 'Dancers of different ages on the floor at a Salsaflow evening'
            }
            width={1920}
            height={1280}
            loading="lazy"
            className="mt-10 h-56 w-full rounded-[var(--radius-media)] object-cover object-[50%_42%] sm:h-72 lg:mt-12"
          />
        </Reveal>

        {/* 2x2-Paarfeld ab sm. Die Haarlinien laufen als Raster (oben durchgehend, senkrecht
            zwischen den Spalten), nicht als vier volle Zeilen — dieselbe Trenner-Sprache wie
            in #community, aber ein anderes Feld. Unter sm bleibt der Stapel mit Zeilen-Trennern,
            weil zwei Spalten auf 390px die Headline zersaegen wuerden. */}
        {/* Die zwei Zeilen teilen sich die Hoehe der linken Spalte (gemessen 592px), statt nach
            Inhalt zu wachsen. `content-start` waere hier ein Verschlimmbessern und ist bewusst
            NICHT gesetzt: mit der Regel endet das Paarfeld bei rund 340px, waehrend die linke
            Spalte mit ihrem Foto bis 592px laeuft — am Crop nachgesehen entstand dadurch ein
            rund 250px hohes, nach unten offenes Loch rechts, also genau die Art toter Flaeche,
            die in dieser Datei schon mehrfach Befund war. Gestreckt liegen die beiden Reihen
            zwischen Haarlinien, das Feld schliesst auf derselben Grundlinie wie das Foto ab,
            und die Sektionshoehe bleibt unveraendert bei 720px. */}
        <Reveal className="grid border-t border-[var(--color-line)] sm:grid-cols-2" stagger={0.07}>
          {w.items.map((point, index) => (
            <motion.article
              key={point.title}
              variants={item}
              className={cn(
                'flex flex-col gap-2.5 border-b border-[var(--color-line)] py-7 sm:py-8',
                // Senkrechte Naht nur zwischen den beiden Spalten, plus Innenabstand daran.
                index % 2 === 0 ? 'sm:pr-8 lg:pr-10' : 'sm:border-l sm:border-[var(--color-line)] sm:pl-8 lg:pl-10',
              )}
            >
              <h3
                className={cn(
                  'font-display text-[1.55rem] leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)] sm:text-[1.7rem]',
                  MEASURE_M,
                )}
              >
                {index === 3
                  ? (de ? 'Ich will das Gelernte frei tanzen.' : 'I want to dance freely with what I learn.')
                  : point.title}
              </h3>
              <p className="max-w-lg text-pretty text-base leading-relaxed text-[var(--color-ink-muted)]">
                {point.proof}
              </p>
            </motion.article>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
