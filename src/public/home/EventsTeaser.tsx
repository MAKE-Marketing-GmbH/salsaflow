// EventsTeaser (Geil-Pass v2 2026-07-07): Danceflow-Nights-Sektion, jetzt HELL statt dunklem
// Fullbleed (Bright-Editorial-Anker = Hero). Die Sektions-Flaeche bleibt hell (paper-warm),
// die Party-Fotos duerfen im Bild dunkel sein - echte Fotos, KEIN Duoton, kein Rot-Wash.
// Links eine ruhige Foto-Komposition (ein grosses warm gegradetes Nacht-Foto + zwei echte
// Danceflow-Momente), rechts Eyebrow, Headline mit einem Alex-Brush-Akzentwort, Body aus
// content.ts, eine scannbare Fakten-Leiste und ein roter CTA auf /events. Preis (5/10 CHF)
// steht als du-Form-Zeile am CTA. Motion: ein ruhiger Fade-up-Takt, reduced-motion nur Fade.
// id="events" bleibt erhalten (Anker der alten EventsDark-Sektion).

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME } from '@/public/home/content';
import { Eyebrow, Shell } from '@/public/site/primitives';
import { Reveal, useReveal, EASE_OUT, VIEWPORT, useHydrated } from '@/public/home/motion';
import { MEASURE_L, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

export function EventsTeaser() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const e = HOME[lang].events;
  const { item } = useReveal();

  const facts =
    lang === 'de'
      ? [
          ['Wann', '1., 3., 5. Freitag'],
          ['Sound', 'Eigene DJs'],
          ['Level', 'Alle willkommen'],
        ]
      : [
          ['When', '1st, 3rd, 5th Friday'],
          ['Sound', 'Our own DJs'],
          ['Level', 'All welcome'],
        ];
  const priceNote = lang === 'de' ? 'Du kommst für 5 oder 10 CHF rein.' : 'You get in for 5 or 10 CHF.';

  return (
    // Kritiker-FAIL 2026-08-09: "dunkler Blob in der Seitenmitte" / "dunklen leeren
    // Gradient-Streifen zwischen Bloecken loeschen".
    // Der Blob war ein 544x544px grosser roter Radial-Gradient (rgba(173,24,39,0.28)),
    // aria-hidden, rein dekorativ, oben rechts aus der Sektion herausragend. Er lag genau in
    // dem Viertel der Sektion, das sonst leer ist (gemessen mit scripts/aaa-r10-density.py:
    // rechte Haelfte 24.6% Deckung gegen 68.6% links) und war damit das einzige "Motiv" dort —
    // eine Deko-Flaeche, die Inhalt vortaeuscht.
    // Er verstoesst zugleich zweifach gegen DESIGN.md (LOCKED): "Rot strikt fuer Aktion und
    // Akzent (CTA, Marker, Hover, Eyebrow), nie als Deko-Flaeche" und Guardrail "keine
    // Gradient-/Border-/Schatten-Schwemme". Ersatzlos geloescht statt abgeschwaecht — ein
    // schwaecherer Blob waere derselbe Fehler in leise.
    <section id="events" className={cn('relative isolate scroll-mt-24 overflow-hidden bg-[var(--color-night)] text-white', SECTION_Y_HOME)}>
      <Shell className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* LINKS: Foto-Komposition. Echte Party-Fotos (im Bild dunkel), Sektion bleibt hell.
            Ein grosses Nacht-Foto oben, darunter zwei echte Danceflow-Momente. Kein Karten-Nest. */}
        <motion.div
          data-reveal
          className="order-2 lg:order-1"
          initial={hydrated ? { opacity: 0, y: reduced ? 0 : 16 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: reduced ? 0.32 : 0.55, ease: EASE_OUT }}
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <figure className="col-span-2 overflow-hidden rounded-[1.5rem] shadow-[0_24px_60px_-28px_rgba(17,17,17,0.5)] ring-1 ring-black/5">
              <img
                src="/photos/party/party-31-v3.webp"
                alt="Fröhliches Paar tanzt vor voller Tanzfläche bei einer Danceflow Night"
                className="aspect-[16/10] w-full object-cover object-[center_40%]"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
            <figure className="overflow-hidden rounded-[1.25rem] shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
              <img
                src="/photos/party/party-46-v3.webp"
                alt="Paar tanzt dicht im blauen Partylicht bei einer Danceflow Night"
                className="aspect-[4/3] w-full object-cover object-center"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
            <figure className="overflow-hidden rounded-[1.25rem] shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
              <img
                src="/photos/party/party-50-v3.webp"
                alt="Paar tanzt Hand in Hand auf voller Tanzfläche"
                className="aspect-[4/3] w-full object-cover object-center"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
          </div>
        </motion.div>

        {/* RECHTS: Text */}
        <Reveal className="order-1 max-w-xl lg:order-2">
          <motion.div variants={item}>
            <Eyebrow dark>{e.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={item}
            className={cn(
              'mt-4 font-display text-4xl font-bold leading-[1.0] tracking-[-0.025em] text-white sm:text-5xl',
              MEASURE_L,
            )}
          >
            {e.title}
          </motion.h2>
          <motion.p variants={item} className="mt-5 max-w-lg text-base leading-relaxed text-[var(--color-night-muted)] sm:text-lg">
            {e.body}
          </motion.p>

          <motion.dl variants={item} className="mt-8 grid max-w-md grid-cols-3 gap-5">
            {facts.map(([label, value]) => (
              <div key={label} className="border-t border-white/20 pt-3">
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug text-white">{value}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/events"
              className="group inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-[var(--color-salsa)] px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-colors duration-200 hover:bg-white hover:text-[var(--color-night)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
            >
              {e.cta}
              <ArrowRight
                size={18}
                strokeWidth={2.25}
                aria-hidden
                className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5"
              />
            </a>
            <span className="text-sm font-semibold text-white/65">{priceNote}</span>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}
