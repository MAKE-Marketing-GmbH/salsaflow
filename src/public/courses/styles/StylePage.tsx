
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useLang, levelLabelI18n, WEEKDAY_LABEL } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  buildScheduleSlots,
  embeddedSchedule,
  fetchSchedule,
  type ScheduleResponse,
  type ScheduleSlot,
} from '@/lib/schedule';
import type { StyleContent } from '@/public/courses/styles/content';
import {
  MEASURE_L,
  MEASURE_XL,
  SubPageShell,
  HeroFrame,
  Breadcrumb,
  PrimaryCta,
  GhostCta,
  SectionHead,
  FaqBlock,
  ClosingInvite,
  Shell,
  Eyebrow,
  TitleAccent,
  CtaArrow,
  BeatMark,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';

export function StylePage({ data }: { data: Record<'de' | 'en', StyleContent> }) {
  const { lang } = useLang();
  const c = data[lang];
  const isSalsa = c.seo === 'salsa';
  /* R138: Split-Hero-Routen. Beide brauchen den WhatsApp-Kreis auf Desktop; die
     Cookie-Banner-Korrektur unten bleibt der Salsa-Sonderfall aus R137. */
  const isSplitHeroRoute = isSalsa || c.seo === 'bachata';
  return (
    <SubPageShell seo={c.seo}>
      <div
        data-salsa-style-page={isSalsa ? '' : undefined}
        data-bachata-style-page={c.seo === 'bachata' ? '' : undefined}
        data-split-hero-page={isSplitHeroRoute ? '' : undefined}
      >
        {isSalsa ? (
          <style>{`
            body:has([data-salsa-style-page]) [role="region"]:has([data-testid="cookie-accept"]) {
              position: static;
              inset: auto;
              width: 100%;
            }
            @media (max-width: 639px) {
              body:has([data-salsa-style-page]) [role="region"]:has([data-testid="cookie-accept"]) > div {
                padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
              }
            }
          `}</style>
        ) : null}
        {isSplitHeroRoute ? (
          <style>{`
            /* R137-Fix, R138 auf Bachata ausgeweitet: der Desktop-Float ist sonst eine
               Pille (Label sm:inline). Auf diesen Routen Kreis wie Mobil — der Fix haengt
               am Marker, nicht an WhatsAppFloat.tsx (sitewide tabu).
               Kritik R138: der Selektor las [data-salsa-style-page] und griff darum auf
               Bachata nie; im Desktop-Shot stand «WhatsApp» weiss auf gruen in einer
               laenglichen Schaltflaeche statt im Kreis. */
            @media (min-width: 640px) {
              body:has([data-split-hero-page]) a.whatsapp-float {
                width: 3.5rem;
                padding-left: 0;
                padding-right: 0;
                justify-content: center;
                gap: 0;
              }
              body:has([data-split-hero-page]) a.whatsapp-float span {
                display: none;
              }
            }
          `}</style>
        ) : null}
        <StyleHero c={c} />
        <WhySection c={c} />
        <FitSection c={c} />
        <BeginnerSection c={c} />
        <LevelsSection c={c} />
        <StyleSlotsSection styleKey={c.seo} />
        <SocialSection c={c} />
        <div className={isSalsa ? 'lg:[&>section]:!py-16' : undefined}>
          <ClosingInvite
            title={c.closing.title}
            titleAccent={c.closing.titleAccent}
            body={c.closing.body}
            ctaLabel={c.closing.primary.label}
            ctaHref={c.closing.primary.href}
            secondary={c.closing.secondary}
            note={c.closing.microcopy}
          />
        </div>
        <FaqBlock title={c.faqTitle} items={c.faq} />
      </div>
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero */

/* R137 (Raphael-Video 02:11–02:21, 18.08.): «Mach so einfach links, rechts.» Der
   Salsa-Hero stapelte Typo ueber einem Full-Bleed-Band; im Fold stand Schrift oben,
   Foto unten, kein Nebeneinander. Dazu 02:21 zum Band-Motiv: «schlechte Aufloesung,
   schlechtes Licht» (offer-salsa-hero: Frau im Profil, Mann verwaschen).

   Loesung ohne kit.tsx anzufassen: Salsa bekommt hier eine eigene, flache Bauform.
   Desktop lg = zwei Spalten (Text links, Foto rechts). Mobil = gestapelt, Foto direkt
   unter der Microcopy, damit die Gesichter inkl. Kinn im 390x844-Fold liegen.
   Bachata und Heels laufen unveraendert weiter durch HeroFrame.

   Motiv: /photos/kurse/kurs-03.jpg — per Read: helles Studio-Tageslicht, scharf,
   volles Gesicht, weisse Waende. 05.jpg war Club-Nacht (schwarz hinter dem Paar).
   gallery/kurse/03.jpg bleibt Bachata-Why und wird hier nicht genutzt.
   Das Band-Motiv offer-salsa-hero-2100 und sein Crop 'center 14%' bleiben in
   content.ts woertlich stehen (P85-Lock) — der Salsa-Hero rendert das Band nur
   nicht mehr. */
/* Was der Split-Hero pro Stilseite ueber sein Foto wissen muss.

   `imgClass` traegt den KOMPLETTEN Klassenstring des Bild-Elements, nicht Bausteine,
   aus denen der Hero ihn zusammensetzt. Grund (Kritik R138): die vorherige Fassung baute
   ihn per cn('w-full object-cover', ratio, …) und drehte damit die Reihenfolge gegen
   das R137-Original 'aspect-[3/2] w-full object-cover object-center lg:aspect-[5/4]'
   (GATES.md G1, EVIDENCE Zeile 8). Optisch gleich, aber nicht byte-fuer-byte — und
   damit kein belastbarer Salsa-Regressionsbeweis mehr. Jetzt steht pro Route genau
   der String, der im DOM landet. */
type SplitHeroPhoto = {
  src: string;
  de: string;
  en: string;
  imgClass: string;
  columns: string;
  /** Setzt objectPosition aus `hero.band.position` (content.ts) statt aus einem
      zweiten, hier eingefrorenen Wert. Ohne Flag bleibt der Crop in `imgClass`. */
  usesBandPosition?: boolean;
};

const SALSA_HERO_PHOTO: SplitHeroPhoto = {
  src: '/photos/kurse/kurs-03.jpg',
  de: 'Laechelnde Taenzerin im hellen Salsaflow Studio vor dem Spiegel',
  en: 'Smiling dancer in the bright Salsaflow studio in front of the mirror',
  /* R137-Original, woertlich aus GATES.md G1 uebernommen. Nicht anfassen, nicht
     umsortieren — sonst reisst der Vergleich gegen S7-ux137/salsa-desktop-1440.png. */
  imgClass: 'aspect-[3/2] w-full object-cover object-center lg:aspect-[5/4]',
  /* R137-Werte: Spalten mittig zueinander, Textspalte 1.05fr. */
  columns: 'lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
};

/* R138 (Raphael-Video 02:56 + 03:05, 18.08.): «Warum ist das so zu dunkel?» und
   «uebelst lost … viel zu gequetscht». Der Bachata-Hero lief noch ueber HeroFrame:
   Typo-Block gestapelt, darunter ein 10rem-Full-Bleed-Band mit hartem 20%-Crop.
   Das Band schnitt die Koepfe an und zeigte nur den dunkelsten Streifen des Motivs.

   Bachata bekommt jetzt dieselbe flache Bauform wie Salsa: Desktop lg zwei Spalten
   (Text links, Foto rechts), mobil gestapelt mit dem Foto direkt unter der Microcopy.
   Der Split-Hero ist parametrisiert statt kopiert; SALSA_HERO_PHOTO traegt die
   R137-Werte unveraendert weiter, der Salsa-Zweig rendert Byte fuer Byte gleich.

   Motiv: /photos/2026/hero-paar-studiowand-01.webp (1920x1280). Siehe R172 unten.

   KORREKTUR R138 (Kritik nach dem ersten Bau): Der Hero lief zwischenzeitlich auf
   offer-bachata-wide-v2.webp. Das ist ein KI-Auszug desselben Motivs, kein Foto —
   Zoom auf Crop (1620,230)-(1980,560) zeigt eine haarduenne, gleichmaessig weisse
   Linie exakt entlang Haaransatz, Ohr und Wange (Matte-Kante, kein Rim-Light), dazu
   hinter der Schulter einen kopflosen Koerper-Rest. Als 10rem-Streifen fiel das nicht
   auf, als grosses Hero war es der Blickfang. Brief Punkt 2 verbietet KI-Bilder.
   Danach lief der Hero auf offer-bachata-1200.webp, der unretuschierten Foto-Quelle
   desselben Paares. Die KI-Kante war damit weg, das Bild blieb aber das dunkelste
   Paar-Motiv im Bestand — R172 tauscht es (Kommentar am `src` unten).
   Jedes Ersatz-Motiv muss weiter ein echtes Foto sein: natuerliche Hautkante, keine
   Umriss-Linie, kein Geister-Koerper, scharf, beide Gesichter inkl. Kinn ganz im
   Bild, Bachata-Naehe statt Heels/Fitness.
   kurs-03.jpg (Salsa) und gallery/kurse/03.jpg (Bachata-Why) sind hier verboten. */
const BACHATA_HERO_PHOTO: SplitHeroPhoto = {
  /* R176, Look-FAIL R172: studiowand war hell (110.9), aber Logo fuellt die Wand
     und der Mann steht mit dem Ruecken. Crop kann das Logo nicht wegschneiden.
     party-33.webp: Mittel 97.1, R-B niedrig (kein Tungsten-Orange), beide Gesichter,
     Fuehrungshaltung, Logo nur im Spiegel. Nur gallery/content.ts sonst.
     Verboten bleiben: offer-bachata-1200, wide-v2, dreh-01, studiowand-Hero.
     Crop bleibt usesBandPosition (center 20% in content.ts). */
  src: '/photos/party/party-33.webp',
  de: 'Paar tanzt in geschlossener Haltung im Salsaflow-Studio',
  en: 'Couple dancing in closed hold at the Salsaflow studio',
  /* Klassenstring vollstaendig, in derselben Reihenfolge wie die Salsa-Variante.
     Mobil 4/3 statt 16/10: das Quellbild ist Hochformat, und der flachere Rahmen
     zog den Hero-Block soweit nach unten, dass der zweite Chip im 844er-Fold
     mittendurch geschnitten wurde. lg 4/3 fuellt die rechte Spalte bis knapp unter
     den 730er-Fold. R161, Video 09:08 «das war auch falsch eingefaerbt»: der Hero
     traegt jetzt GAR keine Grade-Klasse mehr. Die Gegen-Klasse aus R138 war nur ein
     zweiter Filter ueber einem Filter. Das Foto steht auf dem Bild-Stil-Lock der
     Route und traegt sich selbst. photo-grade-bachata bleibt in index.css, weil
     Offer.tsx:67 daran haengt — hier wird sie einfach nicht gesetzt. */
  imgClass: 'aspect-[16/9] w-full object-cover lg:aspect-[4/3]',
  /* Crop kommt aus content.ts `hero.band.position` ('center 20%', Brief Punkt 3).
     Das Quellbild ist Hochformat mit beiden Koepfen im oberen Drittel; 20% legt das
     4/3-Fenster auf den Gesichtsblock statt auf Boden. Der Lock wirkt jetzt wirklich. */
  usesBandPosition: true,
  /* Bachata hat fuenf Bullets (Salsa vier) und laengere Labels. Mit Salsas 1.05fr
     blieben der Textspalte 672px, die Chips brachen auf drei Zeilen und der Block
     endete bei y=707, das Foto schon bei 649 — genau das «gequetscht» aus 03:05.
     1.12fr gibt der Spalte Luft, items-start setzt beide Spalten auf dieselbe
     Oberkante statt das Foto in die Mitte zu haengen. */
  columns: 'lg:grid-cols-[1.12fr_0.88fr] lg:items-start',
};

function SplitHero({ c, photo }: { c: StyleContent; photo: SplitHeroPhoto }) {
  const { lang } = useLang();
  const { container, item } = useReveal();
  const h = c.hero;
  /* Crop-Lock aus dem LIVE-Content, nicht aus einer toten Konfiguration.
     Kritik R138: `position` lag nur noch im `hero.band`-Objekt, das dieser Hero gar
     nicht mehr rendert — der Gate-Treffer auf 'center 20%' war damit Buchstabe ohne
     Wirkung, waehrend der Hero hart 'center 30%' setzte. `usesBandPosition` schaltet
     den Wert aus content.ts scharf: aendert ihn dort jemand, aendert sich das Bild.
     Salsa laesst das Flag weg und bleibt bei object-center aus dem R137-String. */
  const objectPosition = photo.usesBandPosition ? h.band.position : undefined;
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
      style={{ paddingTop: 'var(--nav-h)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
      />
      <Shell className="pt-2 pb-10 lg:pt-6 lg:pb-16">
        <motion.div data-reveal variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-2 lg:mb-4">
            <Breadcrumb trail={[{ label: 'Tanzkurse', href: '/tanzkurse' }, c.crumb]} compact />
          </motion.div>

          {/* Die eine Achse dieser Seite: Text links, Foto rechts. Unter lg stapelt es,
              Foto zuerst nach der Microcopy — mobil zaehlt der Fold, nicht die Spalte.
              gap-5 mobil statt gap-7: mit gap-7 endete die Bildkante bei y=850, also
              6px unter dem 844er-Fold; die untere Rundung war angeschnitten. */}
          <div className={cn('grid gap-5 lg:gap-14', photo.columns)}>
            <div className="flex flex-col gap-4">
              <motion.h1 variants={item} className={cn('type-h1 text-[var(--color-ink)]', MEASURE_XL)}>
                {h.title} {h.titleAccent ? <TitleAccent>{h.titleAccent}</TitleAccent> : null}
              </motion.h1>
              <motion.p
                variants={item}
                className={cn('text-pretty max-w-xl', sectionLead)}
                style={{ lineHeight: 1.4 }}
              >
                {h.lead}
              </motion.p>
              <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryCta href={h.primary.href}>{h.primary.label}</PrimaryCta>
                <GhostCta href={h.secondary.href} down={h.secondary.href.startsWith('#')}>
                  {h.secondary.label}
                </GhostCta>
              </motion.div>
              <motion.p variants={item} className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {h.microcopy}
              </motion.p>
              {h.bullets.length ? (
                <motion.ul variants={item} className="hidden flex-wrap gap-1.5 sm:gap-2 lg:flex">
                  {h.bullets.map((b) => (
                    <li
                      key={`lg-${b}`}
                      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--color-line)] bg-white px-2.5 py-1 text-[0.72rem] font-semibold leading-tight text-[var(--color-ink)] sm:gap-2 sm:px-3.5 sm:py-1.5 lg:px-3 lg:text-[0.8rem]"
                    >
                      <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
                      {b}
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </div>

            {/* R165: Foto ohne Stagger. Video 03:17 Beweis durch Bilder.
                Gemessen: bei 700ms war die Spalte leer (item 7 im Stagger),
                bei 2000ms sichtbar. Der Nutzer sieht sonst eine leere Rechte. */}
            <div className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              {/* Fold-kalibriert pro Route. Der Klassenstring kommt VOLLSTAENDIG aus
                  photo.imgClass — kein cn()-Zusammenbau mehr, damit Salsa exakt den
                  R137-String rendert (GATES.md G1). */}
              <img
                src={photo.src}
                alt={lang === 'de' ? photo.de : photo.en}
                style={objectPosition ? { objectPosition } : undefined}
                className={photo.imgClass}
                width={1600}
                height={1066}
                loading="eager"
                fetchPriority="high"
              />
            </div>
            {h.bullets.length ? (
              /* gap-2.5 statt gap-1.5 unter sm ist der Fold-Hebel: mit 6px Abstand begann
                 der dritte Chip bei y839 und stand als 5px-Sliver mit halber Rundung auf
                 der 844er-Kante — genau das Muster «angeschnittener Chip». 10px schieben
                 ihn auf y847, also ganz unter den Fold, waehrend Chip 2 bei y837 endet und
                 vollstaendig sichtbar bleibt. Am Live-Render gemessen.
                 Die Ueberdeckung durch den WhatsApp-Knopf loest NICHT ein pr-* hier: das
                 Padding zaehlt zur min-content-Breite der Flex-Zeile, weitete die
                 Grid-Spalte und schob den ganzen Hero auf x20-395, also 5px aus dem
                 390er-Viewport. Der Knopf weicht stattdessen aus (--whatsapp-lift in
                 index.css, Marker data-bachata-style-page). */
              <motion.ul variants={item} className="flex flex-wrap gap-2.5 sm:gap-2 lg:hidden">
                {h.bullets.map((b) => (
                  <li
                    key={`sm-${b}`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--color-line)] bg-white px-2.5 py-1 text-[0.72rem] font-semibold leading-tight text-[var(--color-ink)] sm:gap-2 sm:px-3.5 sm:py-1.5"
                  >
                    <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
                    {b}
                  </li>
                ))}
              </motion.ul>
            ) : null}
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

function StyleHero({ c }: { c: StyleContent }) {
  const h = c.hero;
  const isSalsa = c.seo === 'salsa';
  if (isSalsa) return <SplitHero c={c} photo={SALSA_HERO_PHOTO} />;
  if (c.seo === 'bachata') return <SplitHero c={c} photo={BACHATA_HERO_PHOTO} />;
  return (
    <HeroFrame
      // axis="left" auch fuer Bachata: split + lg:items-end liess die linke Spalte leer
      // und schob Copy/CTA nach oben rechts (Critic Runde 9, Item 1).
      axis="left"
      // dense: das Hero-Band lag auf beiden Stilseiten komplett unter dem 730er-Fold und
      // bei 390 war der letzte Bullet-Chip angeschnitten (Critic Runde 11, Item 1).
      dense
      crumbs={[{ label: 'Tanzkurse', href: '/tanzkurse' }, c.crumb]}
      title={h.title}
      titleAccent={h.titleAccent}
      lead={h.lead}
      primary={h.primary}
      secondary={h.secondary}
      microcopy={h.microcopy}
      media={h.band}
    >
      {/* flex-wrap auf allen Breiten statt grid-cols-2 unter sm: das Raster brach
          (erste Chips 165x53, letzter 255x24 — Critic Runde 9, Item 5). Chips min-h-11.
          R71-Nachzieh: whitespace-nowrap + shrink-0 pro Chip, damit kein Chip
          innerhalb umbricht. R72: lg:justify-center — eine einzelne Zeile aus
          flex-nowrap schnitt den fuenften Chip rechts ab (gemessen: letzter Chip
          endete bei 1555 > 1440, "Danceflow Night" fehlte). Wrap auf lg bricht die
          fuenf Chips zentriert auf zwei Zeilen (4+1, gemessen maxRight 1298 < 1440);
          das Foto-Band beginnt unter dem Content, darum bleiben die R71-Koepfe im
          Fold. Keine neue Copy, Crop und Band-Hoehe unveraendert (R72-Stopp). */}
      <ul className="flex flex-wrap gap-1.5 sm:gap-2 lg:justify-center">
        {h.bullets.map((b) => (
          <li
            key={b}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--color-line)] bg-white px-2.5 py-1 text-[0.72rem] font-semibold leading-tight text-[var(--color-ink)] sm:gap-2 sm:px-3.5 sm:py-1.5 lg:px-3 lg:text-[0.8rem]"
          >
            <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
            {b}
          </li>
        ))}
      </ul>
    </HeroFrame>
  );
}

/* -------------------------------------------------------------------- Warum */
function WhySection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const w = c.why;
  const isSalsa = c.seo === 'salsa';
  /* R137 nur Salsa: 1fr_1fr statt 0.85fr_1.15fr und die linke Spalte ohne
     max-w-md-Deckel. Mit dem Deckel blieb das Foto 448px schmal, waehrend die
     rechte Blockliste bis 1387 lief — unter den drei Blocks stand ein leeres
     Feld von ~250px Hoehe. Gleich breite Spalten lesen als «links, rechts».
     R138: derselbe Befund auf Bachata (gemessen linke Spalte 448px, rechte 731px,
     Leerfeld unter Block 03) — Raphael 03:05 «uebelst lost». Bachata bekommt
     dieselbe Aufteilung. Heels behaelt seine. */
  const wideWhy = isSalsa || c.seo === 'bachata';
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className={cn('grid gap-10 lg:gap-16', wideWhy ? 'lg:grid-cols-2' : 'lg:grid-cols-[0.85fr_1.15fr]')}>
          <Reveal className={wideWhy ? undefined : 'max-w-md'}>

            <motion.h2 variants={item} className={cn(sectionTitle, MEASURE_L)}>
              {w.title} {w.titleAccent ? <TitleAccent>{w.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 text-pretty ${sectionLead}`}>
              {w.body}
            </motion.p>
            {/* R137: Salsa hatte das Bild als 16/7-Streifen UNTER dem Grid — wieder
                gestapelt, genau die Bauform aus Raphaels Kritik. Es steht jetzt wie auf
                Bachata und Heels in der linken Textspalte, also neben den Blocks
                («links, rechts»). Der Sonderzweig unten faellt damit weg. */}
            <motion.div variants={item} className="mt-8 overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
              <img
                src={w.image.src}
                alt={w.image.alt}
                style={isSalsa && w.image.position ? { objectPosition: w.image.position } : undefined}
                className={cn(
                  'w-full object-cover',
                  // Salsa und Bachata: die breitere Spalte traegt ab lg ein 3/2-Fenster,
                  // damit das Foto neben der Blockliste steht statt als flacher Rest
                  // darunter. Heels behaelt 4/3 in der schmalen Spalte.
                  wideWhy ? 'aspect-[4/3] lg:aspect-[3/2]' : 'aspect-[4/3]',
                  isSalsa && w.image.position ? undefined : 'object-[center_42%]',
                  // R161, Video 09:08: hier stand eine Bachata-Gegen-Klasse gegen
                  // photo-grade-bachata. Beide sind weg — dieses Foto lief nie unter
                  // der geteilten Klasse, die Korrektur korrigierte also nichts und
                  // faerbte nur ein zweites Mal. Bild-Stil-Lock der Route reicht.
                )}
                width={1200}
                height={900}
                loading="lazy"
              />
            </motion.div>
          </Reveal>

          <Reveal className="grid content-start border-t border-[var(--color-line)]" stagger={0.08}>
            {w.blocks.map((b, i) => (
              <motion.div
                key={b.title}
                variants={item}
                className="flex gap-5 border-b border-[var(--color-line)] py-6 lg:pr-20"
              >
                <span className="font-display text-xl font-extrabold tabular-nums text-[var(--color-salsa)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="type-h3 text-[var(--color-ink)]">{b.title}</h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{b.text}</p>
                </div>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Fuer wen */
function FitSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const f = c.fit;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal>
          <SectionHead title={f.title} titleAccent={f.titleAccent} lead={f.intro} />
        </Reveal>
        <Reveal className="mt-12 grid items-stretch gap-5 lg:grid-cols-2" stagger={0.08}>
          <motion.div variants={item} className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-salsa)]/25 bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8">

            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              {f.yesTitle}
            </p>
            <ul className="mt-5 space-y-px">
              {f.yes.map((y) => (
                <li key={y} className="flex items-start gap-3 border-t border-[var(--color-line)] py-3.5 first:border-t-0">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Check size={13} strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{y}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={item} className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-7 shadow-[0_14px_35px_rgba(17,17,17,0.04)] sm:p-8">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              {f.maybeTitle}
            </p>
            <ul className="mt-5 space-y-px">
              {f.maybe.map((m) => (
                <li key={m} className="flex items-start gap-3 border-t border-[var(--color-line)] py-3.5 first:border-t-0">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-ink-muted)]" />
                  <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{m}</span>
                </li>
              ))}
            </ul>
            <a
              href={f.cta.href}
              className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {f.cta.label}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Erste Wochen */
function BeginnerSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const b = c.beginner;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{b.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn('mt-5', sectionTitle, MEASURE_L)}>
              {b.title} {b.titleAccent ? <TitleAccent>{b.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 text-pretty ${sectionLead}`}>
              {b.body}
            </motion.p>

            <motion.ol variants={item} className="mt-8 border-t border-[var(--color-line)]">
              {b.phases.map((p, i) => (
                <li
                  key={p.title}
                  className="grid grid-cols-[3rem_1fr] items-start gap-4 border-b border-[var(--color-line)] py-5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-salsa)] font-display text-base font-bold tabular-nums text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{p.tag}</p>
                    <h3 className="type-h3 text-[var(--color-ink)]">{p.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{p.text}</p>
                  </div>
                </li>
              ))}
            </motion.ol>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={b.cta.href}>{b.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              <img src={b.image.src} alt={b.image.alt} className="aspect-[4/5] w-full object-cover object-[center_40%]" width={1200} height={1500} loading="lazy" />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Level */
function LevelsSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const l = c.levels;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead title={l.title} titleAccent={l.titleAccent} lead={l.body} />
        </Reveal>

        <Reveal className="mt-12" stagger={0.07}>
          <div className="border-t border-[var(--color-line)]">
            <ol
              className="grid sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--rungs),minmax(0,1fr))]"
              /* SAFETY: CSS custom property --rungs is not in CSSProperties; length is a number. */
              style={{ '--rungs': l.rungs.length } as React.CSSProperties}
            >
              {l.rungs.map((r, i) => (
                <motion.li
                  key={r.name}
                  variants={item}
                  className="flex flex-col border-b border-[var(--color-line)] py-6 sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0 lg:border-r lg:last:border-r-0"
                >
                  {/* Fortschritt: der Balken fuellt sich Stufe fuer Stufe. */}
                  <span aria-hidden className="flex h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-line)]">
                    <span
                      className="block h-full rounded-full bg-[var(--color-salsa)]"
                      style={{ width: `${((i + 1) / l.rungs.length) * 100}%` }}
                    />
                  </span>
                  <span className="mt-4 font-display text-sm font-extrabold tabular-nums text-[var(--color-salsa)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 type-h3 text-[var(--color-ink)]">{r.name}</h3>
                  <p className="mt-2 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{r.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item} className="flex flex-col gap-6">
            {/* Salsa-Charakter: die On1/On2-Frage gehoert zum Level-Gespraech. Steht als
                ruhige Notiz an einer Haarlinie, nicht als Karte — ein Hinweis, kein Angebot. */}
            {l.timingNote ? (
              <div className="max-w-xl border-t border-[var(--color-line)] pt-5">
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  <BeatMark />
                  {l.timingNote.title}
                </p>
                <p className="mt-2.5 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {l.timingNote.text}
                </p>
              </div>
            ) : null}
            <div>
              <a
                href={l.cta.href}
                className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {l.cta.label}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Termine */

/* R162: Die Stilseite erklaerte den Stil, nannte aber keinen einzigen Termin — wer
   einsteigen wollte, musste erst auf den Kursplan wechseln. Diese Sektion zeigt die
   Termine GENAU DIESES Stils direkt hier, mit sichtbarem «frei» oder «Ausgebucht».

   Bewusst KEIN CourseEngine-Import: die Engine ist der volle Kursplan mit Staffel-
   Wechsler, Wochen-Navigation, Filtern und Tages-Tabs. Hier braucht es eine Liste.
   Beide lesen dieselben Daten aus @/lib/schedule, darum bleibt kein zweiter
   Datenstand entstehen. Keine neue API. */

const SLOTS_UI = {
  de: {
    eyebrow: 'Termine',
    title: 'Wann du',
    titleAccent: 'tanzen kannst',
    lead: 'Alle laufenden Termine in diesem Stil. Ein Klick auf die Zeile bringt dich zur Anmeldung.',
    free: 'frei',
    full: 'Ausgebucht',
    teacherTba: 'Team',
    empty: 'Gerade laeuft in diesem Stil kein Kurs. Schreib uns — wir sagen dir, wann der naechste startet.',
    more: 'Alle Kurse im Kursplan',
    clock: 'Uhr',
  },
  en: {
    eyebrow: 'Dates',
    title: 'When you',
    titleAccent: 'can dance',
    lead: 'Every running course in this style. Click a row to go to the sign-up.',
    free: 'open',
    full: 'Fully booked',
    teacherTba: 'Team',
    empty: 'No course is running in this style right now. Write to us and we will tell you when the next one starts.',
    more: 'See the full schedule',
    clock: '',
  },
} as const;

/** Laedt den Kursplan: erst der eingebettete Stand (steht schon im HTML, darum kein
 *  «wird geladen»), danach aktualisiert der Netz-Aufruf auf den Live-Stand. Genau der
 *  Vertrag aus schedule.ts. */
function useSchedule(): ScheduleResponse | null {
  const [data, setData] = useState<ScheduleResponse | null>(() => embeddedSchedule());

  useEffect(() => {
    let alive = true;
    fetchSchedule()
      .then((res) => {
        if (alive) setData(res);
      })
      .catch(() => {
        /* Der eingebettete Stand bleibt stehen. Eine leere Liste waere schlechter
           als ein Plan, der ein paar Minuten alt ist. */
      });
    return () => {
      alive = false;
    };
  }, []);

  return data;
}

/** Faltet die bereits sortierten Slots zu Wochentag-Bloecken. `buildScheduleSlots`
 *  liefert sie nach Wochentag und Startzeit sortiert (schedule.ts), darum reicht ein
 *  Durchlauf: ein neuer Tag beginnt genau dort, wo sich `weekday` aendert. */
function groupSlotsByWeekday(slots: ScheduleSlot[]): { weekday: string; slots: ScheduleSlot[] }[] {
  const groups: { weekday: string; slots: ScheduleSlot[] }[] = [];
  for (const slot of slots) {
    const last = groups[groups.length - 1];
    if (last && last.weekday === slot.weekday) last.slots.push(slot);
    else groups.push({ weekday: slot.weekday, slots: [slot] });
  }
  return groups;
}

/** Die Termin-Sektion eines Stils. `styleKey` ist der Routen-Schluessel
 *  (salsa|bachata|heels) und trifft styleKey in der API 1:1 — gemessen gegen
 *  /api/public/schedule: salsa 50, bachata 8, heels 4 Kurse.
 *
 *  Exportiert, weil nicht jeder Stil ueber StylePage laeuft: /tanzkurse/heels
 *  rendert HeelsView.tsx (eigener Plan-Rhythmus, siehe pages.tsx). Ohne Export
 *  muesste die Sektion dort ein zweites Mal existieren — zwei Kopien derselben
 *  Liste, die ab dem ersten Fix auseinanderlaufen. Ein Import, eine Wahrheit.
 *  Mountpunkt in HeelsView: <StyleSlotsSection styleKey={c.seo} />. */
export function StyleSlotsSection({ styleKey }: { styleKey: string }) {
  const { lang } = useLang();
  const { item } = useReveal();
  const t = SLOTS_UI[lang];
  const data = useSchedule();

  const slots = data ? buildScheduleSlots(data.courses.filter((course) => course.styleKey === styleKey), data.terms) : [];

  /* Nichts zu zeigen heisst: nichts zeigen. Eine Sektion mit Ueberschrift ueber einer
     leeren Liste sieht kaputt aus, und ein Skelett waere hier eine Behauptung ueber
     Daten, die es vielleicht nicht gibt. */
  if (!slots.length) return null;

  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <motion.div variants={item}>
            <Eyebrow>{t.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={cn('mt-5', sectionTitle, MEASURE_L)}>
            {t.title} <TitleAccent>{t.titleAccent}</TitleAccent>
          </motion.h2>
          <motion.p variants={item} className={`mt-4 text-pretty ${sectionLead}`}>
            {t.lead}
          </motion.p>
        </Reveal>

        {/* Nach Wochentag gruppiert statt als eine lange Liste. Ungruppiert stand
            «Montag» neunmal untereinander und der Tag war die lauteste Information
            auf dem Schirm, obwohl er sich neunmal nicht aendert (am Live-Render mit
            25 Zeilen gemessen). Als Zwischen-Ueberschrift sagt der Tag einmal, was
            er sagen muss, und die Zeile traegt nur noch, was sie unterscheidet. */}
        <div className="mt-10 flex flex-col gap-8">
          {groupSlotsByWeekday(slots).map((group) => (
            <Reveal key={group.weekday} stagger={0.04}>
              <motion.h3
                variants={item}
                className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]"
              >
                {WEEKDAY_LABEL[lang][group.weekday]?.long ?? group.weekday}
              </motion.h3>
              <div className="mt-3 overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white">
                {group.slots.map((slot) => (
                  <SlotLine key={slot.key} slot={slot} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">
          <motion.div variants={item}>
            <a
              href="/kursplan"
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {t.more}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

function SlotLine({ slot }: { slot: ScheduleSlot }) {
  const { lang } = useLang();
  const { item } = useReveal();
  const t = SLOTS_UI[lang];
  const course = slot.primary;

  /* Der Badge beschreibt den Kurs, auf den die Zeile ZEIGT — nicht irgendeinen aus
     der Gruppe. `slot.bookable` ist genau dieses Ziel (schedule.ts: erster offener
     Kurs, sonst der laufende). `slot.full` waere hier falsch: es steht nur auf true,
     wenn laufende UND kommende Staffel voll sind. Am Live-Stand ist Montag 18:30
     «Intermediate Stufe 11» laufend ausgebucht, die Oktober-Staffel offen — die Zeile
     verlinkt Oktober, also ist «frei» die richtige und ehrliche Auskunft. Haengt das
     Ziel dagegen an einem vollen Kurs, steht «Ausgebucht» statt eines Versprechens,
     das die Anmeldung nicht halten kann. */
  const isFull = slot.bookable.status === 'full';

  const weekday = WEEKDAY_LABEL[lang][slot.weekday]?.long ?? slot.weekday;
  const level = levelLabelI18n(lang === 'de' ? course.levelDe : course.levelEn, course.onVariant);
  /* Nur der Vorname: die Zeile ist eng, und im Studio ruft ohnehin niemand den
     Nachnamen. Mehrere Lehrer werden mit & verbunden wie im Kursplan. */
  const teachers = course.teachers.map((teacher) => teacher.displayName.split(' ')[0]).join(' & ');

  return (
    <motion.a
      variants={item}
      href={`/buchung?kurs=${encodeURIComponent(slot.bookable.id)}`}
      data-testid="style-slot"
      data-course-id={slot.bookable.id}
      data-full={isFull ? '' : undefined}
      className="group flex flex-col gap-2 border-b border-[var(--color-line)] px-4 py-4 transition-colors last:border-b-0 hover:bg-[var(--color-bg-soft)] sm:flex-row sm:items-center sm:gap-5 sm:px-6"
    >
      {/* Die Uhrzeit ist der Anker der Zeile: danach sucht man, wenn man wissen will,
          ob es in den eigenen Feierabend passt. Feste Breite ab sm, damit die Zeiten
          untereinander eine Spalte bilden statt zu flattern. Der Wochentag steht als
          Ueberschrift ueber der Gruppe und wird hier nicht wiederholt — nur der
          Screenreader bekommt ihn pro Zeile, weil der Link auch einzeln vorgelesen
          wird und «18:30–19:30» ohne Tag keine buchbare Auskunft ist. */}
      <span className="flex shrink-0 flex-col sm:w-40">
        {/* whitespace-nowrap: ohne die Klasse brach «19:30–20:30 Uhr» nach der Zeit um
            und setzte «Uhr» auf eine zweite Zeile, waehrend «18:30–19:30 Uhr» einzeilig
            blieb — die Zeitspalte lief zweizeilig gegen einzeilig (im Desktop-Render
            gemessen). Die Zeit ist eine Einheit und darf nicht brechen. */}
        <span className="whitespace-nowrap font-display text-base font-bold tabular-nums leading-tight text-[var(--color-ink)]">
          <span className="sr-only">{weekday} </span>
          {slot.startTime}–{slot.endTime}
          {t.clock ? ` ${t.clock}` : ''}
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[0.98rem] font-semibold leading-snug text-[var(--color-ink)]">{level}</span>
        <span className="mt-0.5 block break-words text-sm leading-snug text-[var(--color-ink-muted)]">
          {teachers || t.teacherTba}
        </span>
      </span>

      {/* Ausgebucht ist eine ruhige Auskunft, kein Alarm: graue Pille. «frei» traegt
          Rot, weil Rot auf dieser Seite die Aktionsfarbe ist. */}
      <span className="flex shrink-0 items-center gap-3 self-start sm:self-center">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
            isFull
              ? 'border-[var(--color-line)] bg-[var(--color-bg-soft)] text-[var(--color-ink-muted)]'
              : 'border-[var(--color-salsa)]/30 bg-[var(--color-salsa)]/8 text-[var(--color-salsa)]',
          )}
        >
          {isFull ? t.full : t.free}
        </span>
        <CtaArrow className="text-[var(--color-ink-muted)] transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5 group-hover:text-[var(--color-salsa)]" />
      </span>
    </motion.a>
  );
}

/* -------------------------------------------------------------------- Danceflow-Band (dunkler) */
function SocialSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const s = c.social;
  return (
    <section className="bg-[var(--color-surface-dark)] py-20 text-white lg:py-32">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div variants={item} className="order-2 overflow-hidden rounded-[var(--radius-media)] ring-1 ring-white/10 lg:order-1">
            <img src={s.image.src} alt={s.image.alt} style={s.image.position ? { objectPosition: s.image.position } : undefined} className="aspect-[16/11] w-full object-cover" width={1400} height={960} loading="lazy" />
          </motion.div>
          <motion.div variants={item} className="order-1 max-w-xl lg:order-2">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              <BeatMark />
              Danceflow Night
            </p>
            <h2 className={cn('type-h2 mt-5', MEASURE_L)}>
              {s.title} {s.titleAccent ? <TitleAccent dark>{s.titleAccent}</TitleAccent> : null}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/80 sm:text-lg">{s.body}</p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[0.98rem] leading-relaxed text-white/85">
                  <Check size={16} strokeWidth={2.5} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-salsa-500)]" />
                  {b}
                </li>
              ))}
            </ul>
            <a
              href={s.cta.href}
              className="btn-base btn-primary group mt-8 px-6 py-3 text-sm"
            >
              {s.cta.label}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}
