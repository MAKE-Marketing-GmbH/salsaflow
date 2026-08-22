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

import { motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';
import { Eyebrow, Shell } from '@/public/site/primitives';
import {
  EASE_OUT,
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.62fr_1fr] lg:gap-5">
          {/* HAUPTFLAECHE: ein grosses Foto traegt die Sektion, der Text liegt darauf.
              Das ist das Gewicht, das nach dem Hero fehlte. */}
          <RevealOne
            variant="clip"
            className="relative overflow-hidden rounded-[var(--radius-media)]"
          >
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
            {/* Lesbarkeits-Schleier, kein Deko-Gradient. ZWEI Lagen, weil eine Lage in
                Runde 1 gescheitert ist: der Text sass auf dem hellen Gesicht der Taenzerin
                und der Body-Text kam unter 4.5:1.
                Lage 1 dunkelt von unten (traegt Fakten + CTA), Lage 2 von links (traegt
                H2 + Body). So bleibt die rechte Bildhaelfte offen und das Foto lesbar. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-night)] via-[var(--color-night)]/75 to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[var(--color-night)]/92 via-[var(--color-night)]/55 to-transparent sm:via-[var(--color-night)]/45"
            />

            {/* min-h in Runde 1 war 38rem und damit ~180px hoeher als der Inhalt: unten
                stand eine tote schwarze Zone. Jetzt traegt der Inhalt die Hoehe, das min-h
                ist nur noch der Boden fuer genug Bildflaeche ueber dem Text.
                Runde 3: mobil 21rem statt 26rem. Der Text fuellt dort ohnehin mehr als
                21rem, das min-h zog also nur eine leere Bildzone ueber die Schrift. */}
            <Reveal className="relative flex min-h-[21rem] flex-col justify-end p-6 sm:min-h-[30rem] sm:p-9 lg:min-h-[33rem] lg:p-11">
              <motion.div variants={item}>
                <Eyebrow dark>{e.eyebrow}</Eyebrow>
              </motion.div>

              <motion.h2 variants={item} className={cn('type-h2 mt-4 text-white', MEASURE_L)}>
                {e.title}
              </motion.h2>

              <motion.p
                variants={item}
                className="mt-4 max-w-lg text-base leading-relaxed text-[var(--color-night-muted)] sm:text-lg"
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
                    className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5"
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
            className="hidden gap-4 lg:grid lg:grid-cols-1 lg:grid-rows-2 lg:gap-5"
            initial={hydrated ? { opacity: 0, y: reduced ? 0 : 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: reduced ? 0.32 : 0.6, ease: EASE_OUT, delay: reduced ? 0 : 0.1 }}
          >
            <figure className="overflow-hidden rounded-[var(--radius-media)]">
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
            <figure className="overflow-hidden rounded-[var(--radius-media)]">
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
