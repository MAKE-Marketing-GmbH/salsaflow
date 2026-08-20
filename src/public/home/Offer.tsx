import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { HOME, type OfferCard } from '@/public/home/content';
import { Shell } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { MEASURE_L, MEASURE_M, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

/* R186 (Dom, 20.08.): Vorher trug diese Sektion EINE grosse Featured-Karte links und
   zwei duenne Zeilen rechts, Privatstunden war ganz herausgefiltert. Dom will vier
   gleichwertige, bildstarke Angebote nebeneinander sehen. Darum jetzt eine Karte fuer
   alle vier — dieselbe Form, dieselbe Hoehe, nur das Motiv unterscheidet sie.

   Der Bildzuschnitt bleibt pro Motiv erhalten: die Werte stammen aus der frueheren
   StyleRow und sind an das jeweilige Foto gemessen, nicht geraten. Bachata liegt bei
   36 % und Heels bei 20 %, damit die Koepfe im Bild bleiben (Crop-Lock R138/R139). */
function cardCrop(key: string) {
  if (key === 'salsa') return 'object-[center_46%]';
  if (key === 'bachata') return 'object-[center_36%]';
  if (key === 'heels') return 'object-[center_20%]';
  return 'object-[center_42%]';
}

/* Die intrinsischen Masse verhindern einen Layout-Shift beim Laden. Sie stehen pro
   Motiv, weil die vier Dateien unterschiedliche Formate haben (Salsa quer, Heels hoch). */
function cardSize(key: string) {
  if (key === 'salsa') return { w: 1600, h: 1067 };
  if (key === 'bachata') return { w: 2752, h: 1536 };
  if (key === 'privat') return { w: 1800, h: 1200 };
  return { w: 1200, h: 1600 };
}

function StyleCard({ card }: { card: OfferCard }) {
  const { lang } = useLang();
  const size = cardSize(card.key);

  return (
    <a
      href={card.href}
      aria-label={`${card.title}: ${card.hint}`}
      className="group relative isolate flex min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-[var(--color-ink)] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:rounded-[2rem] lg:min-h-[26rem]"
    >
      <img
        src={card.photo}
        alt={card.alt}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-out motion-safe:group-hover:scale-[1.025]',
          card.key === 'bachata' ? 'photo-grade-bachata' : card.key === 'privat' ? 'photo-grade-private' : undefined,
          cardCrop(card.key),
        )}
        width={size.w}
        height={size.h}
        loading="lazy"
      />
      {/* Der Verlauf traegt den Text. Erster Versuch endete bei 25 % Deckung auf halber
          Hoehe — gemessen im Bild standen dann "HALTUNG UND CHOREOGRAFIE" (Heels) und
          "1:1 COACHING" (Privatstunden) weiss auf hellem Studio und waren unlesbar.
          Beide Motive sind oben hell. Der Verlauf deckt jetzt bis zwei Drittel Hoehe. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/95 via-[var(--color-ink)]/70 via-45% to-transparent" />
      <div className="relative z-10 mt-auto p-5 sm:p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/85">{card.hint}</span>
        <h3 className={cn('type-h3 mt-2', MEASURE_M)}>{card.title}</h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-white/85">{card.text}</p>
        {/* Der Linktext wiederholte zuerst den Kartentitel ("Salsa" ueber "Salsa →").
            Er sagt jetzt, wohin der Klick fuehrt. Privatstunden fuehren auf die
            Anfrageseite, die drei Tanzarten auf ihre Stilseite mit Terminen. */}
        <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
          {card.key === 'privat'
            ? (lang === 'de' ? 'Privatstunde anfragen' : 'Request a private lesson')
            : (lang === 'de' ? 'Kurse und Termine' : 'Courses and dates')}
          <ArrowRight aria-hidden size={18} strokeWidth={2.25} className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export function Offer() {
  const { lang } = useLang();
  const o = HOME[lang].offer;
  const { item } = useReveal({ stagger: 0.07 });
  // R186 (Dom, 20.08.): Der Filter `card.key !== 'privat'` aus R134/9 ist raus. Dom will
  // die Privatstunden auf der Startseite sehen, Desktop als vierte Karte ganz rechts.
  // Die Reihenfolge steht in content.ts: Salsa, Bachata, Heels, Privatstunden.

  return (
    <section id="angebot" className={cn('relative scroll-mt-24 bg-[var(--color-bg-soft)]', SECTION_Y_HOME)}>
      <Shell>
        {/* Titel und Lead gestapelt statt H2 links / Lead rechts (Split-Header-Ban,
            Critic 13.08.2026). */}
        <Reveal>
          <motion.h2
            variants={item}
            className={cn(
              'type-h2 text-[var(--color-ink)]',
              MEASURE_L,
            )}
          >
            {o.title}
          </motion.h2>
          {/* R186: Der Lead ist in content.ts leer. Ein leeres <p> traegt trotzdem seinen
              mt-4 und die Zeilenhoehe, also 4rem Loch zwischen H2 und Karten. Darum
              gar nicht erst rendern. */}
          {o.lead ? (
            <motion.p variants={item} className="mt-4 max-w-[65ch] text-pretty text-lg leading-relaxed text-[var(--color-ink-muted)]">
              {o.lead}
            </motion.p>
          ) : null}
        </Reveal>

        {/* R186 (Dom, 20.08.): Vier gleich grosse Karten statt einer grossen und zwei
            Zeilen. Desktop vier Spalten, damit Privatstunden ganz rechts steht. Mobil
            eine Spalte in derselben Reihenfolge, Tablet zwei.
            Kein lg:pr-36 mehr: das Polster hielt frueher den WhatsApp-FAB vom rechten
            Zeilenende fern. Die Karten enden jetzt am Shell-Rand, der Text sitzt links
            unten in der Karte — der FAB liegt ueber der Bildflaeche, nicht auf Schrift. */}
        <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6" stagger={0.07}>
          {o.cards.map((card) => (
            <motion.div key={card.key} variants={item} className="min-w-0">
              <StyleCard card={card} />
            </motion.div>
          ))}
        </Reveal>

        <Reveal className="mt-10 lg:mt-12">
          <motion.a
            variants={item}
            href="/tanzkurse"
            className="group inline-flex min-h-11 items-center gap-2 border-t border-[var(--color-line)] pt-5 text-base font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-4"
          >
            {lang === 'de'
              ? 'Alle Tanzkurse im Überblick'
              : 'See all dance classes'}
            <ArrowRight aria-hidden size={18} strokeWidth={2.25} className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
          </motion.a>
        </Reveal>
      </Shell>
    </section>
  );
}
