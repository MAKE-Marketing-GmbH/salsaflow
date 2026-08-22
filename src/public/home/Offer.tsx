import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { HOME, type OfferCard } from '@/public/home/content';
import { Shell } from '@/public/site/primitives';
import {
  BlurReveal,
  ClipReveal,
  Reveal,
  type ParallaxStyle,
  useParallaxStyle,
  useReveal,
} from '@/public/home/motion';
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
  /* R188 / H2: das Bachata-Motiv ist natives Hochformat (hp-26.webp, 1200x1800, siehe
     content.ts). Der frueher noetige 36%-Versatz gehoerte zum alten Querformat und wuerde
     hier den Kopf des Tanzenden aus dem Bild schieben. Gemessen an der Kartenflaeche
     316x416 (Verhaeltnis 0.76 gegen 0.67 des Bildes): object-cover skaliert ueber die
     Breite, sichtbar sind 87.9% der Bildhoehe um die Mitte, also 6.1% Beschnitt oben und
     unten. Die Koepfe des Paares liegen bei 28-45% der Bildhoehe und damit mit Abstand
     innerhalb des Fensters (SW4: "Koepfe nie abschneiden"). */
  if (key === 'bachata') return 'object-center';
  if (key === 'heels') return 'object-[center_20%]';
  return 'object-[center_42%]';
}

/* Die intrinsischen Masse verhindern einen Layout-Shift beim Laden. Sie stehen pro
   Motiv, weil die vier Dateien unterschiedliche Formate haben (Salsa quer, Heels hoch). */
function cardSize(key: string) {
  if (key === 'salsa') return { w: 1600, h: 1067 };
  if (key === 'bachata') return { w: 1200, h: 1800 };
  if (key === 'privat') return { w: 1800, h: 1200 };
  return { w: 1200, h: 1600 };
}

function StyleCard({ card, parallax }: { card: OfferCard; parallax: ParallaxStyle }) {
  const { lang } = useLang();
  const size = cardSize(card.key);

  return (
    <a
      href={card.href}
      aria-label={`${card.title}: ${card.hint}`}
      className="group relative isolate flex min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-[var(--color-ink)] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 sm:rounded-[2rem] lg:min-h-[26rem]"
    >
      <motion.div
        data-scroll-motion={`offer-${card.key}`}
        style={parallax}
        className="absolute inset-x-0 -top-5 h-[calc(100%+2.5rem)]"
      >
        <img
          src={card.photo}
          alt={card.alt}
          /* R188 / H2: `photo-grade-bachata` ist hier raus. Die Klasse (index.css:480,
             saturate .82 / contrast 1.14) war genau die "komische Toenung" aus dem Video —
             sie lag ZUSAETZLICH auf einer schon nachbearbeiteten Datei. Das neue Bild ist eine
             Groessenableitung des Originals und traegt sich ohne CSS-Filter. Kein Filter als
             Bildersatz, dieselbe Entscheidung wie bei photo-grade-private auf /privatstunden
             (privat/content.ts:181). */
          className={cn(
            'h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-out motion-safe:group-hover:scale-[1.025]',
            card.key === 'privat' ? 'photo-grade-private' : undefined,
            cardCrop(card.key),
          )}
          width={size.w}
          height={size.h}
          loading="lazy"
        />
      </motion.div>
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
  const sectionRef = useRef<HTMLElement>(null);
  const cardParallax = useParallaxStyle(sectionRef, 32);
  // R186 (Dom, 20.08.): Der Filter `card.key !== 'privat'` aus R134/9 ist raus. Dom will
  // die Privatstunden auf der Startseite sehen, Desktop als vierte Karte ganz rechts.
  // Die Reihenfolge steht in content.ts: Salsa, Bachata, Heels, Privatstunden.

  return (
    <section
      ref={sectionRef}
      id="angebot"
      className={cn('relative scroll-mt-24 bg-[var(--color-bg-soft)]', SECTION_Y_HOME)}
    >
      <Shell>
        {/* Titel und Lead gestapelt statt H2 links / Lead rechts (Split-Header-Ban,
            Critic 13.08.2026). */}
        {/* R189: Der Sektionstitel bekommt `BlurReveal` statt des generischen item-Fades.
            Die Wahl gegen `RevealWords` ist bewusst und folgt der Rollenteilung des
            Motion-Systems: Wort-fuer-Wort gehoert der grossen H1 im Fold. Wuerde jede H2
            der Seite ebenfalls Wort fuer Wort einsteigen, waere der Effekt kein Akzent
            mehr, sondern der neue Default — und die H1 verlaere ihren Vorrang.
            `blur` liest sich als "scharfstellen" (8px -> 0 plus 1.02 -> 1 scale, siehe
            motion.tsx:285-292) und bleibt damit klar unterscheidbar vom Vorhang der
            Karten darunter.

            Der Lead behaelt bewusst den ruhigen `rise`-Default ueber `Reveal` + `item`:
            eine Fliesstextzeile scharfstellen zu lassen waere derselbe Effekt an zwei
            Stellen hintereinander — und Fliesstext ist genau der Fall, fuer den `rise`
            der Default ist. */}
        {/* Die visuelle Klasse bleibt am <h2>, nicht am Reveal-Wrapper: `type-h2` setzt
            Schriftgrad und Zeilenhoehe, `MEASURE_L` das Zeilenmass in em. Beides auf einem
            16px-Wrapper waere ein anderer Wert als auf der grossen Ueberschrift. Der
            Wrapper traegt nur die Bewegung. */}
        <BlurReveal>
          <h2
            className={cn(
              'type-h2 text-[var(--color-ink)]',
              MEASURE_L,
            )}
          >
            {o.title}
          </h2>
        </BlurReveal>
        {/* R186: Der Lead ist in content.ts leer. Ein leeres <p> traegt trotzdem seinen
            mt-4 und die Zeilenhoehe, also 4rem Loch zwischen H2 und Karten. Darum
            gar nicht erst rendern. */}
        {o.lead ? (
          <Reveal>
            <motion.p variants={item} className="mt-4 max-w-[65ch] text-pretty text-lg leading-relaxed text-[var(--color-ink-muted)]">
              {o.lead}
            </motion.p>
          </Reveal>
        ) : null}

        {/* R186 (Dom, 20.08.): Vier gleich grosse Karten statt einer grossen und zwei
            Zeilen. Desktop vier Spalten, damit Privatstunden ganz rechts steht. Mobil
            eine Spalte in derselben Reihenfolge, Tablet zwei.
            Kein lg:pr-36 mehr: das Polster hielt frueher den WhatsApp-FAB vom rechten
            Zeilenende fern. Die Karten enden jetzt am Shell-Rand, der Text sitzt links
            unten in der Karte — der FAB liegt ueber der Bildflaeche, nicht auf Schrift. */}
        {/* R189 Kritik-Runde 1: Vier einzelne ClipReveal mit 0.08s Abstand sahen im echten
            Zwischenframe kaputt aus: Karte 1 stand schon, Karte 2 war nur ein grauer Streifen,
            Karten 3 und 4 fehlten. Ein Reveal darf mitten im Lauf nicht wie fehlende Daten
            aussehen. Deshalb oeffnet jetzt EIN Vorhang das ganze Raster. Die vier Angebote
            erscheinen als zusammengehoerige Reihe; kein Motiv verschiebt sich, keine Spalte
            aendert ihre Breite. */}
        <ClipReveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {o.cards.map((card) => (
            <StyleCard key={card.key} card={card} parallax={cardParallax} />
          ))}
        </ClipReveal>

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
