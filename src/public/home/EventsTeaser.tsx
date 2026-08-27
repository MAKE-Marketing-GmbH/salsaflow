// EventsTeaser (R189, 2026-08-21): Kundenkritik war "unter dem Hero sieht es direkt nicht
// geil aus". Befund an den Vorher-Shots: der Block war ein 50/50-Split aus Textspalte und
// einem Drei-Kachel-Grid, in dem alle drei Fotos gleich laut waren. Nach einem Hero mit
// 80px-H1 und einem randlosen Foto fiel das visuelle Gewicht direkt auf null ab.
//
// Jetzt: EIN grosses Nacht-Foto traegt die Sektion randlos bis zur Viewport-Kante, Eyebrow,
// H2, Body und CTA liegen darauf. Die beiden Beleg-Fotos stehen als schmaler Streifen
// daneben und sind bewusst kleiner - sie belegen, sie konkurrieren nicht. Die Fakten-Leiste
// haengt unter dem CTA an einer Haarlinie, damit Wann/Musik/Fuer-wen scanbar bleibt.
//
// Runde 3: Das Hauptmotiv oeffnet mit der neuen clip-Variante. Die zwei Belegfotos bleiben
// auf Desktop erhalten und sind mobil ausgeblendet. So endet der Block dort am Hauptmotiv,
// bevor Sticky-CTA und WhatsApp die kleineren Bilder verdecken koennen.
// id="events" bleibt (Anker der alten EventsDark-Sektion).

import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';
import { Eyebrow, Shell, sectionLead } from '@/public/site/primitives';
import {
  EASE_OUT,
  REVEAL_BLUR,
  REVEAL_DURATION,
  Reveal,
  RevealOne,
  VIEWPORT,
  useHydrated,
  useParallaxStyle,
  useReveal,
} from '@/public/home/motion';
import { MEASURE_L } from '@/public/home/kit';
import { cn } from '@/lib/utils';

export function EventsTeaser() {
  const { lang } = useLang();
  const de = lang === 'de';
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const e = HOME[lang].events;
  const { item } = useReveal();
  const sectionRef = useRef<HTMLElement>(null);
  const photoParallax = useParallaxStyle(sectionRef, 36);

  return (
    <section
      ref={sectionRef}
      id="events"
      className={cn(
        'relative isolate scroll-mt-24 overflow-hidden bg-[var(--color-night)] text-white',
        // Mobil eine Stufe unter SECTION_Y_HOME: der Block traegt dort nur noch EIN Motiv,
        // und py-16 auf beiden Kanten hat 128px an einen Abschnitt ohne zweite Ebene gegeben.
        // Desktop bleibt auf derselben Stufe wie SECTION_Y_HOME (lg:py-16), hier aber
        // ausgeschrieben statt per String-Ersetzung aus dem Token gerechnet: ein
        // `.replace('py-16 ', '')` bricht still, sobald jemand den Token-Wert aendert.
        'py-12 lg:py-16',
      )}
    >
      <Shell>
        {/* R190: `items-start`. Der Grid-Default `stretch` zog die linke Hauptkarte auf
            die Hoehe der hoeheren Zeile. Ihr Inhalt (Eyebrow, H2, Body, CTA, Fakten)
            endete aber rund 220px darueber, und darunter stand eine tote schwarze Zone
            — dasselbe Bild, das der Kommentar bei `min-h` weiter unten schon einmal
            beschreibt. Mit `items-start` traegt jede Spalte ihre eigene Inhaltshoehe:
            gemessen 528px links (Inhalt) gegen 659px rechts (zwei Belegfotos).
            Der Beleg-Streifen rechts bekommt bewusst KEIN `self-stretch` zurueck: das
            waere die alte Zeilenhoehe unter neuem Namen. */}
        {/* R207: `items-stretch` statt `items-start`. Mit dem Textcontainer UNTER dem Foto
            (statt als Overlay darauf) ist die linke Spalte rund 250px hoeher als der
            Beleg-Streifen rechts — unter dem zweiten Belegfoto stand eine tote schwarze
            Zone (gemessen am Nachher-Shot home-d1440-full.png). Die zwei Belegfotos tragen
            die Zeilenhoehe jetzt mit; ihr `h-full` unten verteilt sie auf beide Kacheln.
            Das ist NICHT die alte gestreckte Leerkarte von R190: gestreckt wird eine
            Bildflaeche, die den Platz auch fuellt, keine leere Textspalte. */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.62fr_1fr] lg:gap-5">
          {/* HAUPTFLAECHE: ein grosses Foto traegt die Sektion, der Text liegt darauf.
              Das ist das Gewicht, das nach dem Hero fehlte. */}
          {/* R207 (Raphael 23.08. 17:10): "'Dein Kurs endet nicht nach der Stunde' sieht lost
              aus — den gesamten Text in EINEN Container packen und nach unten, nicht ueber
              die Koepfe legen."
              Vorher lag der komplette Textblock als Overlay auf dem Nacht-Foto: zwei
              Verdunkelungs-Gradienten mussten die Taenzer ueberdecken, damit die Schrift
              4.5:1 erreicht — genau das ist "ueber die Koepfe". Jetzt traegt das Foto seine
              eigene Flaeche oben (unbeschriftet, kein Schleier, die Gesichter bleiben frei),
              der gesamte Text steht als EIN Container darunter auf der Nacht-Flaeche.
              Der Parallax bleibt: er sass am Foto, nicht am Overlay. */}
          <RevealOne
            variant="clip"
            className="overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-night)]"
          >
            <div className="relative h-56 overflow-hidden sm:h-72 lg:h-80">
              <motion.div
                data-scroll-motion="events-photo"
                style={photoParallax}
                className="absolute inset-x-0 -top-5 h-[calc(100%+2.5rem)]"
              >
                <img
                  src="/photos/party/party-31-v3.webp"
                  alt={
                    de
                      ? 'Fröhliches Paar tanzt vor voller Tanzfläche bei einer Danceflow Night'
                      : 'Happy couple dancing in front of a packed floor at a Danceflow Night'
                  }
                  className="h-full w-full object-cover object-[center_38%]"
                  width={2048}
                  height={1360}
                  loading="lazy"
                />
              </motion.div>
              {/* Nur noch ein kurzer Auslauf an der Unterkante, damit Foto und Textflaeche
                  nicht als harte Kante aufeinanderstossen. Er liegt auf dem unteren
                  Bildviertel, nicht auf den Gesichtern. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-night)] to-transparent"
              />
            </div>

            <Reveal className="flex flex-col p-6 sm:p-9 lg:p-11">
              <motion.div variants={item}>
                <Eyebrow dark>{e.eyebrow}</Eyebrow>
              </motion.div>

              {/* R190: Der Kopf stand hier auf `mt-4` und war damit der einzige
                  Eyebrow→Titel-Abstand der Startseite, der nicht 20 px mass — der
                  Instagram-Block daneben traf den geteilten Wert (`mt-5`, siehe
                  subpage/kit.tsx:622) bereits. Gemessen: events 16 px gegen 9 = 20 px.
                  Genau diese Ungleichheit meint Raphael mit "es soll einheitlich sein,
                  ob wir jetzt eine Ueberschrift mehr dazu haben". */}
              <motion.h2 variants={item} className={cn('type-h2 mt-5 text-white', MEASURE_L)}>
                {e.title}
              </motion.h2>

              {/* Der Abstand kommt aus `sectionLead`, nicht aus einem eigenen `mt-4`.
                  Der Wert ist derselbe — die Rolle traegt ihn ab jetzt aber zentral,
                  sonst wandert dieser Block beim naechsten Takt-Wechsel wieder aus. */}
              <motion.p
                variants={item}
                className={cn(sectionLead, 'max-w-lg text-[var(--color-night-muted)]')}
              >
                {e.body}
              </motion.p>

              <motion.div
                variants={item}
                className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
              >
                <a href="/events" className="btn-base btn-primary group min-h-12 px-7 py-3.5 text-base">
                  {e.cta}
                  <ArrowRight
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden
                    className="transition-transform duration-[var(--dur-fast)] ease-[var(--motion-out)] motion-safe:group-hover:translate-x-0.5"
                  />
                </a>
                <span className="text-sm font-semibold text-white/75">{e.price}</span>
              </motion.div>

              {/* Fakten unter dem CTA an einer Haarlinie: scanbar, ohne dem CTA
                  die Aufmerksamkeit zu nehmen. */}
              <motion.dl
                variants={item}
                className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-white/20 pt-5 sm:grid-cols-3 lg:max-w-3xl"
              >
                {e.facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium uppercase tracking-[0.14em] text-white/60">
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold leading-snug text-white">{value}</dd>
                  </div>
                ))}
              </motion.dl>
            </Reveal>
          </RevealOne>

          {/* BELEG-STREIFEN: zwei echte Momente, bewusst kleiner als die Hauptflaeche.
              NUR ab lg. Auf Mobil waren die beiden Fotos der Blockschluss und lagen damit
              genau dort, wo die globale Sticky-CTA und der WhatsApp-Kreis liegen: das
              Capture 964.5px zeigte beide Bilder quer zerschnitten, den WhatsApp-Kreis
              auf dem rechten Motiv. Ein halb verdecktes Belegfoto belegt nichts.
              `hidden lg:grid` haelt sie aus dem Layout UND aus der Zeichnung heraus; das
              grosse Nacht-Foto darueber traegt die Sektion mobil allein. Desktop bleibt
              unveraendert zweispaltig. */}
          <motion.div
            data-reveal
            // R207: h-full + zwei gleiche Zeilen (1fr), damit der Streifen die volle
            // Zeilenhoehe traegt und unten keine schwarze Restflaeche bleibt.
            className="hidden h-full gap-4 lg:grid lg:grid-cols-1 lg:grid-rows-[1fr_1fr] lg:gap-5"
            initial={hydrated ? { opacity: 0, filter: reduced ? 'blur(0px)' : `blur(${REVEAL_BLUR}px)`, transform: reduced ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)' } : false}
            whileInView={{ opacity: 1, filter: 'blur(0px)', transform: 'translate3d(0, 0, 0)' }}
            viewport={VIEWPORT}
            transition={{ duration: reduced ? 0.2 : REVEAL_DURATION, ease: EASE_OUT, delay: reduced ? 0 : 0.08 }}
          >
            <figure className="min-h-0 overflow-hidden rounded-[var(--radius-media)]">
              <img
                src="/photos/party/party-46-v3.webp"
                alt={
                  de
                    ? 'Paar tanzt dicht im blauen Partylicht bei einer Danceflow Night'
                    : 'Couple dancing close in blue party light at a Danceflow Night'
                }
                className="h-full w-full object-cover object-center"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
            <figure className="min-h-0 overflow-hidden rounded-[var(--radius-media)]">
              <img
                src="/photos/party/party-50-v4.webp"
                alt={
                  de
                    ? 'Paar tanzt Hand in Hand auf voller Tanzfläche'
                    : 'Couple dancing hand in hand on a packed floor'
                }
                className="h-full w-full object-cover object-center"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
          </motion.div>
        </div>
      </Shell>
    </section>
  );
}
