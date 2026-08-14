// Gestaltete Tanzkurse-Seite unter /tanzkurse. Ueber dem wiederverwendeten Kurskalender-Teaser
// (KEINE volle CourseEngine, die lebt nur auf /kursplan) sitzt die Uebersicht: Intro, Tanzstile,
// Kursaufbau (die Leiter-Signatur), Preise, Sommerkurse, Schnupperstunde und Privatstunden.
//
// Geil-Pass v2 (2026-07-07, Bright Editorial): Anker ist der neue helle Hero (src/public/home/Hero.tsx).
// - Breite: jede Sektion in <Shell> (1400px) statt der alten max-w-6xl-Container.
// - Flaechen: NUR hell (paper-warm / bg-soft im ruhigen Wechsel). KEINE dunklen Content-Sektionen
//   mehr, auch die Schnupperstunde ist jetzt eine helle Einladungs-Karte (nur der Footer bleibt dunkel).
// - Icons: NUR Lucide (ArrowRight/ArrowDown/Check), keine Unicode-/Kreis-Pfeile.
// - Motion: ruhiger Reveal-Takt (Reveal/useReveal), gleicher Fade-up wie die Startseite.
// - Rot #AD1827 strikt sparsam (~90/10): CTAs, Marker, aktive Leiter-Stufe, ein Script-Akzentwort.
//   Keine Pastell-Flaechen (kein salsa-50/100 als Fuellung). Hover aendert den Zustand echt
//   (Rot -> Ink invertieren + Pfeil-Slide), nicht nur dunkler.
//
// Inhalt + Fakten kommen 1:1 aus courses/overview-content.ts (COURSES_OVERVIEW), nichts erfunden.
// Zweisprachig DE/EN.

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { levelLabelI18n, useLang, WEEKDAY_LABEL } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter, CONTACT } from '@/public/site/SiteFooter';
import { Shell, Eyebrow, CtaArrow, CtaPill, CtaText, BeatMark, sectionTitle, sectionLead } from '@/public/site/primitives';
import { MEASURE_L, HeroFrame, ClosingInvite } from '@/public/subpage/kit';
import { Reveal, useReveal } from '@/public/home/motion';
import { cn } from '@/lib/utils';
import { COURSES_OVERVIEW } from '@/public/courses/overview-content';
import { fetchSchedule, pickVariedCourses, type ScheduleCourse, type ScheduleResponse } from '@/lib/schedule';
import {
  ArrowRight,
  Check,
  Users,
  Music,
  CalendarClock,
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

// Stage 4 Icon-System: sprechende Feature-Icons fuer die Privatstunden-Vorteile.
// Reihenfolge folgt privat.points: einzeln/zu zweit -> Salsa-Styles -> Termine -> Hochzeitstanz.
const PRIVAT_ICONS: LucideIcon[] = [Users, Music, CalendarClock, HeartHandshake];

// EIN CTA-Ziel sitewide (Master-Plan): der Schnupper-Anker scrollt auf /kontakt zum Formular.
const SCHNUPPER_HREF = '/kontakt#schnupperstunde';
const SECTION_OFFSET = 'calc(var(--nav-h) + 1.5rem)';

function courseStart(course: ScheduleCourse, data: ScheduleResponse, lang: 'de' | 'en') {
  const iso = data.terms.find((term) => term.id === course.termId)?.startDate;
  if (!iso) return lang === 'de' ? 'Start laut Kursplan' : 'Start according to schedule';
  return new Intl.DateTimeFormat(lang === 'de' ? 'de-CH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${iso}T12:00:00`));
}

/* Design-Kritik Runde 2, Issue 2: dieser lokale Button trug `shadow-[0_12px_30px_
   rgba(173,24,39,0.28)]` — genau der rosa Glow-Halo, den /preise und /heels NICHT hatten
   (gemessene Glow-Pixel: tanzkurse 28850 vs. preise 1893). Der Halo ist raus, der Button
   ist nur noch ein Adapter auf die EINE Definition in site/primitives.tsx. */
function PrimaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  return <CtaPill href={href}>{children}</CtaPill>;
}

/* Stil-Thumbs fuer Upcoming-Karten — gleiche Premium-Motive wie CourseEngine, damit
   vier Start-Bloecke nicht als identische "STARTET BALD"-Schablonen wirken. */
const STYLE_THUMB: Record<string, string> = {
  salsa: '/photos/premium/offer-salsa-800.webp',
  bachata: '/photos/premium/offer-bachata-800.webp',
  heels: '/photos/premium/offer-heels-800.webp',
};

/* Die Motive sind Hochformat, die Karte 16/10: object-cover schneidet mittig und
   koepft die Taenzer (Kritiker r13). Fokus deshalb pro Motiv auf die Gesichtszone. */
const STYLE_THUMB_FOCUS: Record<string, string> = {
  salsa: 'center 22%',
  bachata: 'center 20%',
  heels: 'center 25%',
};

/* Zweit-Motiv je Stil: der Teaser zeigt oft ZWEI Salsa- und ZWEI Bachata-Starts —
   mit nur einem Motiv pro Stil standen identische Fotos direkt nebeneinander
   (Sweep 14.08.2026, /tmp/s-r6-tanzkurse-390-4.png). Beide Dateien waren bisher
   ungenutzt (0 Fundstellen), Dopplungs-Limit unberuehrt. */
const STYLE_THUMB_ALT: Record<string, string> = {
  salsa: '/photos/2026/event-social-couple-01.webp',
  bachata: '/photos/2026/event-social-couple-02.webp',
};
const STYLE_THUMB_ALT_FOCUS: Record<string, string> = {
  salsa: 'center 35%',
  bachata: 'center 20%',
};

function CourseStartCard({ course, data, index, altThumb = false }: { course: ScheduleCourse; data: ScheduleResponse; index: number; altThumb?: boolean }) {
  const { lang, t } = useLang();
  const style = lang === 'de' ? course.styleDe : course.styleEn;
  const level = levelLabelI18n(lang === 'de' ? course.levelDe : course.levelEn, course.onVariant);
  const href = course.styleKey ? `/kursplan?stil=${course.styleKey}` : '/kursplan';
  const phase =
    course.phase === 'running'
      ? lang === 'de'
        ? 'Läuft'
        : 'Running'
      : lang === 'de'
        ? 'Startet bald'
        : 'Starting soon';
  const running = course.phase === 'running';
  const useAlt = altThumb && !!STYLE_THUMB_ALT[course.styleKey];
  const thumb = (useAlt ? STYLE_THUMB_ALT[course.styleKey] : STYLE_THUMB[course.styleKey]) ?? '/photos/2026/kurse-classfreude-01.webp';
  const focus = (useAlt ? STYLE_THUMB_ALT_FOCUS[course.styleKey] : STYLE_THUMB_FOCUS[course.styleKey]) ?? 'center 30%';
  return (
    <a
      href={href}
      className="group flex h-full flex-col border-t border-[var(--color-line)] py-4 transition-colors hover:border-[var(--color-salsa)] sm:border-t-0 sm:border-l sm:px-4 sm:first:border-l-0 lg:px-5"
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[1rem] bg-[var(--color-bg-soft)]">
        <img
          src={thumb}
          alt=""
          aria-hidden
          width={800}
          height={500}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-out motion-safe:group-hover:scale-[1.04]"
          style={{ objectPosition: focus }}
        />
        <span
          className={cn(
            'absolute left-2.5 top-2.5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]',
            running
              ? 'bg-[var(--color-salsa)] text-white'
              : 'border border-white/70 bg-white/90 text-[var(--color-ink)]',
          )}
        >
          {phase}
        </span>
      </span>
      <span className="mt-2 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        <span className="text-[var(--color-salsa)]">{String(index + 1).padStart(2, '0')}</span>
        <span className="truncate">{WEEKDAY_LABEL[lang][course.weekday]?.long ?? course.weekday}</span>
      </span>
      <span className="mt-1.5 font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{style}</span>
      {level ? (
        <span
          className={cn(
            'mt-1 inline-flex w-fit rounded-full px-2 py-px text-[10px] font-semibold',
            course.styleKey === 'heels'
              ? 'bg-[var(--color-ink)] text-white'
              : course.styleKey === 'bachata'
                ? 'bg-[var(--color-bg-soft)] text-[var(--color-ink)] ring-1 ring-[var(--color-line)]'
                : 'bg-[var(--color-salsa-50)] text-[var(--color-salsa)]',
          )}
        >
          {level}
        </span>
      ) : null}
      <span className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--color-line)] pt-2 text-sm">
        <span>
          <span className="block text-[10px] text-[var(--color-ink-muted)]">{lang === 'de' ? 'Start' : 'Starts'}</span>
          <span className="mt-px block font-semibold text-[var(--color-ink)]">{courseStart(course, data, lang)}</span>
        </span>
        <span>
          <span className="block text-[10px] text-[var(--color-ink-muted)]">{lang === 'de' ? 'Zeit' : 'Time'}</span>
          <span className="mt-px block font-semibold tabular-nums text-[var(--color-ink)]">{course.startTime}</span>
        </span>
      </span>
      <span className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm font-semibold text-[var(--color-salsa)]">
        <span>{course.status === 'full' ? t.fullyBooked : lang === 'de' ? 'Kurs ansehen' : 'View class'}</span>
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-1" strokeWidth={2.25} />
      </span>
    </a>
  );
}

export function CoursesPage() {
  return (
    <>
      <Seo page="courses" />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <CoursesHero />
        <StylesSection />
        <LevelsSection />
        <PricesSection />
        <SummerSection />
        <PrivatSection />
        <CalendarSection />
        {/* Design-Kritik Runde 3, Issue 7: der Abbinder stand vorher MITTEN auf der Seite
            (nach SummerSection) und darunter folgten noch Privatstunden und Kurskalender —
            die Seite hoerte einmal auf und lief dann weiter. Zusammen mit dem Kalender-Block,
            der optisch dieselbe Bauform trug, las sich das als zwei Abbinder. Jetzt steht
            der EINE Abbinder da, wo ein Abbinder hingehoert: am Schluss. */}
        <TrialSection />
      </main>
      {/* Runde 3, Issue 7: EIN Abbinder pro Seite. Die Seite schliesst mit TrialSection
          ("Schnupperstunde"); der generische Footer-Streifen mit demselben CTA entfaellt.
          float={false}: wie /preise und Home — der fixe WhatsApp-FAB lag auf den
          rechtsbuendigen Privat-Preisen (100 CHF) in der Preise-Sektion. WhatsApp bleibt
          ueber Privatstunden-CTA, Kontakt und Footer erreichbar. */}
      <SiteFooter entryCta={false} float={false} />
    </>
  );
}

/* ---------------------------------------------------------------------------- Intro */
/* Design-Kritik Runde 2, Issue 1: dieser Hero war eine EIGENE Kopie derselben Bauform wie
   SubHero (Text links / Foto rechts / drei rote Stat-Zahlen). Genau diese Kopien haben die
   Sechsfach-Dopplung erzeugt (Beleg /tmp/slices/z_hero_grid.jpg). Jetzt laeuft er ueber
   HeroFrame — dieselbe EINE Definition wie alle Unterseiten, Achse 'split':
   Headline links, Erklaerung + CTA in der rechten Schiene, kein Hero-Foto. */
function CoursesHero() {
  const { lang } = useLang();
  const h = COURSES_OVERVIEW[lang].hero;
  const de = lang === 'de';
  /* Mobile: "Studios am Bahnhof SBB" brach als alleinstehendes "SBB" unter "Bahnhof".
     Kurzeres Label + keep-all im HeroFrame-Fact-Label. Desktop bleibt lesbar. */
  const stats: [string, string][] =
    de
      ? [
          ['2018', 'seit dem Start'],
          ['40', 'Kurse pro Woche'],
          ['3', 'Studios am Bahnhof'],
        ]
      : [
          ['2018', 'since the start'],
          ['40', 'classes a week'],
          ['3', 'studios by the station'],
        ];
  return (
    <HeroFrame
      axis="split"
      title={`${h.title}${h.titleAccent ? ` ${h.titleAccent}` : ''}`}
      lead={h.lead}
      primary={{
        label: de ? 'Gratis Schnupperstunde buchen' : 'Book a free trial class',
        href: SCHNUPPER_HREF,
      }}
      secondary={{ label: de ? 'Kursplan ansehen' : 'See the schedule', href: '#kurskalender' }}
      facts={stats}
      media={{
        src: '/photos/2026/kurse-classfreude-hero-2100.webp',
        alt: de ? 'Tanzkurs im hellen Salsaflow Studio' : 'Dance class in the bright Salsaflow studio',
        /* Live-Fold 1440x730: 28% koepfte die vordere Reihe. 16% holt die Gesichter
           in den sichtbaren Streifen unter der Typo. */
        position: 'center 16%',
        heightClass: 'h-[20rem] sm:h-[26rem] lg:h-[34rem]',
      }}
    />
  );
}

/* ---------------------------------------------------------------------------- Tanzstile */
function StylesSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  const s = COURSES_OVERVIEW[lang].styles;
  const mainCards = s.cards.filter((card) => !card.accent);
  const workshop = s.cards.find((card) => card.accent);
  const metaByKey: Record<string, string[]> = de
    ? {
        salsa: ['Beginner bis Advanced', 'Partnerwork', 'Musikalität', 'Social Dance'],
        bachata: ['Basics', 'Sensual-Elemente', 'Connection', 'Körperkontrolle'],
        heels: ['Haltung', 'Walks', 'Choreo', 'Ausdruck'],
      }
    : {
        salsa: ['Beginner to advanced', 'Partner work', 'Musicality', 'Social dance'],
        bachata: ['Basics', 'Sensual elements', 'Connection', 'Body control'],
        heels: ['Posture', 'Walks', 'Choreo', 'Expression'],
      };

  return (
    <section style={{ scrollMarginTop: SECTION_OFFSET }} className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_0.46fr] lg:items-end">
          <motion.div variants={item} className="max-w-2xl">
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h2 className={cn('mt-5', sectionTitle, MEASURE_L)}>
              {s.title}{s.titleAccent ? ` ${s.titleAccent}` : ''}
            </h2>
            <p className={`mt-4 text-pretty ${sectionLead}`}>{s.lead}</p>
          </motion.div>
          {/* Zwei Eyebrows nebeneinander ("KURSRICHTUNGEN" links, "DEIN WEG" rechts) lasen sich
              als zwei konkurrierende Sektions-Koepfe. Der rechte Block ist kein Kopf, sondern
              ein Hinweis — er bekommt jetzt keinen Eyebrow mehr, nur den Takt-Marker als Anker.
              Runde 2: die weisse Schatten-Box um den Hinweis ist raus, es bleibt eine Oberkante. */}
          {/* hidden lg:block: unter lg stapelte der Hinweis als toter BeatMark-Block
              zwischen H2 und erstem Foto (Critic Runde 14, Item 5) — er ist eine
              Rand-Notiz fuer die breite Zweispalter-Zeile, kein Mobilinhalt. */}
          <motion.div variants={item} className="hidden border-t border-[var(--color-line)] pt-5 lg:block">
            <BeatMark />
            <p className="mt-3 text-pretty text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {de
                ? 'Stil wählen, Schnupperstunde buchen und im passenden Level starten.'
                : 'Choose a style, book a trial class and start at the right level.'}
            </p>
          </motion.div>
        </Reveal>

        {/* Design-Kritik Runde 2 (critical): hier standen drei weisse Schatten-Karten, in
            jeder darin nochmal vier graue Chips — bis zu drei Radius-Ebenen ineinander.
            Ersetzt durch den Zickzack der Startseite (src/public/home/Offer.tsx): EIN
            Bildmodul (7fr Bild / 5fr Text, aspect 7:5 Desktop, 4:5 Mobil), nur die Seite
            kippt je Reihe, getrennt durch 1px Haarlinie. Die Chips sind Fliesstext-Meta
            geworden — sie waren Deko-Label, kein Filter (Chips bleiben dem Kursplan
            vorbehalten). */}
        <Reveal className="mt-12" stagger={0.08}>
          <ul>
            {mainCards.map((card, i) => {
              const flip = i % 2 === 1;
              return (
                <motion.li
                  key={card.key}
                  variants={item}
                  className={cn(
                    'grid grid-cols-1 items-center gap-x-12 border-t border-[var(--color-line)]',
                    flip ? 'lg:grid-cols-[5fr_7fr]' : 'lg:grid-cols-[7fr_5fr]',
                  )}
                >
                  <a
                    href={card.href}
                    aria-label={card.title}
                    className={cn(
                      'group relative block aspect-[4/5] overflow-hidden sm:aspect-[7/5]',
                      flip && 'lg:order-2',
                    )}
                  >
                    <img
                      src={card.photo}
                      alt={card.alt ?? card.title}
                      className={cn(
                        'absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-base)] ease-out motion-safe:group-hover:scale-[1.04]',
                        // Das Bachata-Motiv ist hochkant. In der Querformat-Karte (7/5) schneidet
                        // ein mittiger Ausschnitt beiden Tanzenden den Oberkopf ab.
                        // 12% statt 25%: der Maennerkopf war oben angeschnitten
                        // (Critic Runde 10, Item 5).
                        card.photo?.includes('offer-bachata') && 'object-[center_12%]',
                      )}
                      width={1200}
                      height={857}
                      loading="lazy"
                    />
                    {/* Rot-Kante faehrt beim Hover ein — dieselbe Micro-Interaction wie auf der Home. */}
                    <span
                      aria-hidden
                      className="t-underline absolute inset-x-0 bottom-0 h-[3px] bg-[var(--color-salsa)]"
                    />
                  </a>
                  <div className={cn('flex flex-col justify-center py-12', flip && 'lg:order-1')}>
                    <span className="text-[12px] font-semibold uppercase leading-[1.4] tracking-[0.16em] text-[var(--color-ink-muted)]">
                      {String(i + 1).padStart(2, '0')} · {(metaByKey[card.key] ?? []).join(' · ')}
                    </span>
                    <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.08] tracking-[-0.02em] text-balance text-[var(--color-ink)]">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-[42ch] text-pretty text-[1.0625rem] leading-[1.588] text-[var(--color-ink-muted)]">
                      {card.text}
                    </p>
                    {/* Design-Kritik Runde 2, Issue 3: "Salsa Kurse ansehen" / "Bachata Kurse
                        ansehen" / "Heels ansehen" liefen hier als schlichter schwarzer Fettext
                        ohne Pfeil, ohne Farbe, ohne Unterstrich (Beleg /tmp/slices/z_link1.jpg)
                        — die wichtigsten Kategorie-Einstiege der Seite sahen aus wie tote
                        Ueberschriften, waehrend daneben rote Pills und rote Pfeil-Links standen.
                        Sie sitzen jetzt auf Stufe 2 der EINEN Link-Skala (CtaText). */}
                    <div className="mt-4 self-start">
                      <CtaText href={card.href}>{card.cta}</CtaText>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </Reveal>

        {workshop ? (
          // Vierte Reihe im selben Zickzack-Takt (Index 3 -> Bild rechts), keine eigene
          // Karten-Bauform mehr. Sie war vorher ein weisses Panel mit Schatten unter drei
          // weissen Karten — vier Karten-Ebenen in einer Sektion.
          <Reveal className="mt-0">
            <motion.article
              variants={item}
              className="grid grid-cols-1 items-center gap-x-12 border-y border-[var(--color-line)] lg:grid-cols-[5fr_7fr]"
            >
              <div className="order-2 flex flex-col justify-center py-8 lg:order-1 lg:py-14">
                <GraduationCap aria-hidden className="h-8 w-8 text-[var(--color-salsa)]" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.08] tracking-[-0.02em] text-balance text-[var(--color-ink)]">
                  {workshop.title}
                </h3>
                <p className="mt-4 max-w-[42ch] text-pretty text-[1.0625rem] leading-[1.588] text-[var(--color-ink-muted)]">
                  {workshop.text}
                </p>
                <div className="mt-6">
                  <PrimaryCta href={workshop.href}>{workshop.cta}</PrimaryCta>
                </div>
              </div>
              <div className="group relative order-1 block aspect-[4/5] overflow-hidden sm:aspect-[7/5] lg:order-2">
                <img
                  // Runde 2, Issue 5: /photos/gallery/danceflow/01.jpg hatte Luminanz 37/255
                  // und sass auf bg-soft — ein dunkles Loch im hellen Raster. 01-v3.webp ist
                  // dasselbe Motiv in der aufgehellten v3-Fassung (57/255).
                  src="/photos/gallery/danceflow/01-v3.webp"
                  alt={de ? 'Danceflow Night mit Workshop-Stimmung' : 'Danceflow Night with workshop atmosphere'}
                  className="absolute inset-0 h-full w-full object-cover"
                  width={1200}
                  height={857}
                  loading="lazy"
                />
              </div>
            </motion.article>
          </Reveal>
        ) : null}
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Kursaufbau (die Leiter-Signatur) */
function LevelsSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  const l = COURSES_OVERVIEW[lang].levels;
  const [mainTrack, heelsTrack] = l.tracks;
  const sideTitle = de ? 'So findest du deinen Einstieg.' : 'How to find your start.';
  const sideText = de
    ? 'Wenn du zwischen zwei Levels stehst, frag uns lieber kurz. Zur Schnupperstunde sehen wir gemeinsam, wo du dich wohlfühlst.'
    : 'If you are between two levels, just ask us. At the trial class we find together where you feel comfortable.';
  const sideItems: [string, string][] = de
    ? [
        ['01', 'Stil wählen'],
        ['02', 'Level testen'],
        ['03', 'In der Staffel wachsen'],
      ]
    : [
        ['01', 'Choose a style'],
        ['02', 'Try your level'],
        ['03', 'Grow through the term'],
      ];

  return (
    /* Kritiker r5: untere ~40% Creme vor Pricing + Mobile leere Hälfte — Sektions-Padding
       asymmetrisch (unten kürzer) und innere Abstände verdichtet, damit Level-Pfad und
       Pricing enger koppeln. Kein Filler, nur weniger Luft. */
    <section id="kursaufbau" style={{ scrollMarginTop: SECTION_OFFSET }} className="bg-[var(--color-paper-warm)] py-12 pb-8 lg:py-16 lg:pb-10">
      <Shell>
        {/* Design-Kritik Runde 2: die ganze Sektion sass in einer weissen Schatten-Karte mit
            Radius, darin zwei Spalten mit eigenem Padding, darin nochmal Chips und Pillen.
            Karte, Schatten und Radius sind raus — es bleiben zwei Spalten, getrennt durch
            EINE senkrechte Haarlinie, so wie die Home ihre Zweispalter setzt. */}
        <Reveal className="border-t border-[var(--color-line)]">
          <div className="grid lg:grid-cols-[0.96fr_1.04fr]">
            <motion.div
              variants={item}
              className="border-b border-[var(--color-line)] py-6 sm:py-7 lg:border-b-0 lg:border-r lg:py-7 lg:pr-12"
            >
              <Eyebrow>{l.eyebrow}</Eyebrow>
              <h2 className={cn("mt-4", sectionTitle, MEASURE_L)}>
                {l.title}{l.titleAccent ? ` ${l.titleAccent}` : ''}
              </h2>
              <p className={cn("mt-3 max-w-xl text-pretty", sectionLead)}>{l.lead}</p>

              {/* Karten-Verschachtelung aufgeloest (Design-Kritik Runde 1): vorher lag hier
                  eine hellgraue Karte IN der weissen Karte, darin drei weisse Zeilen-Pillen —
                  drei Ebenen fuer eine Aufzaehlung. Jetzt traegt die aeussere Karte alles,
                  getrennt nur durch 1px-Linien und Weissraum. */}
              <div className="mt-6 border-t border-[var(--color-line)] pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{sideTitle}</p>
                <p className="mt-2.5 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)]">{sideText}</p>
                <ul className="mt-4 grid gap-x-6 sm:grid-cols-3 lg:grid-cols-1">
                  {sideItems.map(([number, label]) => (
                    <li
                      key={number}
                      className="flex items-center gap-3 border-b border-[var(--color-line)] py-2.5 last:border-b-0 lg:last:border-b"
                    >
                      <span className="font-display text-sm font-bold tabular-nums text-[var(--color-salsa)]">{number}</span>
                      <span className="text-sm font-semibold leading-tight text-[var(--color-ink)]">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid gap-x-10 gap-y-5 border-t border-[var(--color-line)] pt-5 sm:grid-cols-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">{l.onTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{l.onText}</p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">{heelsTrack?.title ?? 'Heels'}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{heelsTrack?.note}</p>
                  {/* Pillen -> Meta-Zeile: das waren Deko-Label, kein Filter (Kritik Runde 2). */}
                  <p className="mt-2.5 text-sm font-semibold text-[var(--color-ink)]">
                    {heelsTrack?.rungs.join(' · ')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Rechte Spalte: keine Karte, keine eigene Fuellfarbe mehr — sie stand als
                graue Flaeche in einer weissen Box auf Papier (drei Toene fuer eine Liste). */}
            <motion.div variants={item} className="py-6 lg:py-7 lg:pl-12">
              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <BeatMark />
                      <h3 className="font-display text-2xl font-bold text-[var(--color-ink)]">{mainTrack?.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{mainTrack?.note}</p>
                  </div>
                  {/* Deko-Pille -> Label (Kritik Runde 2: Pillen nur wo sie klickbar filtern). */}
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    {de ? 'Stufe für Stufe' : 'Level by level'}
                  </span>
                </div>

                <ol className="mt-5 grid gap-2">
                  {mainTrack?.rungs.map((rung, ri) => {
                    const isFlow = /flow/i.test(rung);
                    return (
                      <li
                        key={rung}
                        className={cn(
                          // Zeilen statt Kaesten: Trennlinie + Weissraum. Die aktive Stufe
                          // ist an einer roten Kante links erkennbar, nicht an einer Karte.
                          'grid grid-cols-[3.25rem_1fr] gap-4 border-b border-[var(--color-line)] py-3 last:border-b-0 sm:grid-cols-[4.25rem_1fr_auto] sm:items-center',
                          isFlow && 'border-l-2 border-l-[var(--color-salsa)] pl-4',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold tabular-nums sm:h-11 sm:w-11 sm:text-base',
                            isFlow
                              ? 'bg-[var(--color-salsa)] text-white'
                              : 'border border-[var(--color-line)] bg-[var(--color-paper-warm)] text-[var(--color-ink)]',
                          )}
                        >
                          {String(ri + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={cn(
                              'block font-display text-lg font-bold leading-tight sm:text-xl',
                              isFlow ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                            )}
                          >
                            {rung}
                          </span>
                          {isFlow ? (
                            <span className="mt-1 block text-sm leading-relaxed text-[var(--color-ink-muted)]">{l.flowNote}</span>
                          ) : null}
                        </span>
                        <span className="col-span-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)] sm:col-span-1 sm:text-right">
                          {isFlow ? (de ? 'Verbinden' : 'Connect') : de ? 'Aufbauen' : 'Build'}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-5 grid items-end gap-x-6 gap-y-3 lg:grid-cols-[1.55fr_1fr]">
                  <figure className="min-w-0">
                    <img
                      src="/composites/graphic-world/step-salsa-line.webp"
                      alt=""
                      aria-hidden
                      width={2048}
                      height={760}
                      loading="lazy"
                      className="pointer-events-none w-full opacity-75"
                    />
                    <figcaption className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                      Salsa On1 &middot; 1-2-3 &middot; 5-6-7
                    </figcaption>
                  </figure>
                  <figure className="min-w-0">
                    <img
                      src="/composites/graphic-world/step-bachata-line.webp"
                      alt=""
                      aria-hidden
                      width={577}
                      height={316}
                      loading="lazy"
                      className="pointer-events-none w-full opacity-75"
                    />
                    <figcaption className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                      Bachata &middot; 1-2-3-4
                    </figcaption>
                  </figure>
                </div>

                {/* Vier weisse Schatten-Pillen -> eine Fakten-Zeile unter einer Haarlinie.
                    Sie waren nicht klickbar und damit Deko (Kritik Runde 2). */}
                <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-[var(--color-line)] pt-4">
                  {l.chips.map((chip) => (
                    <li key={chip.label} className="text-sm font-semibold text-[var(--color-ink)]">
                      {chip.label}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Preise */
function PricesSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  const p = COURSES_OVERVIEW[lang].prices;
  const courseGroup = p.groups.find((group) => group.key === 'kurs') ?? p.groups[0];
  const privatGroup = p.groups.find((group) => group.key === 'privat');
  const coursePrice = courseGroup?.rows[0];
  const included = de
    ? ['8 Lektionen', 'Nachholen in der Staffel', 'Aushilfe wird organisiert', 'Keine versteckten Kosten']
    : ['8 lessons', 'Make-up class in the term', 'Dance partner help is organised', 'No hidden costs'];
  return (
    /* Kritiker r5: Pricing enger an Level-Pfad — Top-Padding gekürzt, Bottom bleibt ruhig. */
    <section style={{ scrollMarginTop: SECTION_OFFSET }} className="bg-[var(--color-bg-soft)] py-12 pt-10 lg:py-20 lg:pt-12">
      <Shell>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{p.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-4", sectionTitle, MEASURE_L)}>
              {p.title}{p.titleAccent ? ` ${p.titleAccent}` : ''}
            </motion.h2>
            <motion.p variants={item} className={cn("mt-3 max-w-xl text-pretty", sectionLead)}>
              {p.lead}
            </motion.p>
            <motion.p variants={item} className="mt-6 flex items-center gap-3 text-sm font-semibold text-[var(--color-ink)]">
              <ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-[var(--color-salsa)]" strokeWidth={1.75} />
              {p.guarantee}
            </motion.p>
          </Reveal>

          {/* Design-Kritik Runde 2 (critical, y=3050-3900): drei Radius-Ebenen ineinander —
              weisse Aussenbox mit Schatten, darin zwei Karten mit Radius und Schatten, darin
              die Check-Zeilen NOCHMAL als eigene Kaesten. Alle drei Ebenen sind raus. Es
              bleiben zwei Spalten, gefasst von einer Ober- und einer Trennlinie; die
              Check-Zeilen sind wieder eine Liste. */}
          <Reveal className="grid border-t border-[var(--color-line)] sm:grid-cols-2" stagger={0.08}>
            {courseGroup && coursePrice ? (
              <motion.article
                variants={item}
                className="relative flex h-full flex-col border-b border-[var(--color-line)] py-6 sm:border-b-0 sm:border-r sm:pb-7 sm:pr-8"
              >
                {/* Warmer Rot-Schein statt Pastell-Blob (gleiche Technik wie der Hero-Lichtschein).
                    Runde 3: -right-16 schob den Kreis 64px ueber die rechte Shell-Kante — auf 390px
                    (Shell-Padding 20px) waren das gemessene 14px Seitenbreite zu viel. Auf Mobil
                    sitzt der Schein jetzt buendig an der Kante, ab sm bleibt der Ueberhang
                    (dort hat die Shell genug Luft, die Seite bleibt exakt 390/1440 breit). */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-16 right-0 -z-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.08)_0%,transparent_70%)] sm:-right-16"
                />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    {courseGroup.title}
                  </p>
                  <p className="mt-6 font-display text-[4rem] font-extrabold leading-none tracking-[-0.022em] text-[var(--color-salsa)] sm:text-[4.65rem]">
                    {coursePrice.value}
                  </p>
                  <p className="mt-3 max-w-xs text-base leading-relaxed text-[var(--color-ink-muted)]">{coursePrice.label}</p>
                </div>
                <ul className="relative mt-8 grid gap-2.5">
                  {included.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm font-semibold text-[var(--color-ink)]"
                    >
                      <Check size={15} strokeWidth={3} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-salsa)]" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                {courseGroup.cta ? (
                  <a
                    href={courseGroup.cta.href}
                    className="group relative mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {courseGroup.cta.label}
                    <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                  </a>
                ) : null}
              </motion.article>
            ) : null}

            {privatGroup ? (
              <motion.article
                variants={item}
                className="flex h-full flex-col py-6 sm:pb-7 sm:pl-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{privatGroup.title}</p>
                <dl className="mt-5 border-t border-[var(--color-line)]">
                  {privatGroup.rows.map((row, i) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[var(--color-line)] py-4 last:border-b-0"
                    >
                      <dt className="text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{row.label}</dt>
                      {/* Rot-Dosierung: nur der Anker-Preis (erste Zeile) rot, die weiteren in Ink. */}
                      <dd
                        className={cn(
                          'shrink-0 font-display text-base font-extrabold',
                          i === 0 ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                        )}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {privatGroup.cta ? (
                  <a
                    href={privatGroup.cta.href}
                    className="group mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {privatGroup.cta.label}
                    <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                  </a>
                ) : null}
              </motion.article>
            ) : null}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Sommerkurse */
function SummerSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  const su = COURSES_OVERVIEW[lang].summer;
  return (
    <section style={{ scrollMarginTop: SECTION_OFFSET }} className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        {/* Bild links, Inhalt rechts. Bricht das Hero-Echo (Text links / Bild rechts).
            Runde 2: das Panel war eine weisse Schatten-Karte, in der das Bild NOCHMAL in
            einem eigenen Radius-Rahmen mit 1rem Abstand sass. Beide Ebenen sind weg —
            das Foto laeuft bis an die Spaltenkante wie im Home-Zickzack. */}
        <Reveal className="border-y border-[var(--color-line)] lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div variants={item} className="relative">
            <img
              src="/photos/party/party-46-v3.webp"
              alt={de ? 'Lachendes Tanzpaar im hellen Salsaflow Studio' : 'Smiling dance couple in the bright Salsaflow studio'}
              className="aspect-[4/3] w-full object-cover object-[center_38%]"
              width={2048}
              height={1360}
              loading="lazy"
            />
          </motion.div>
          <motion.div variants={item} className="py-12 lg:pl-12">
            {/* Die Glas-Pill lag als eigene Schwebe-Ebene auf dem Foto. Sie ist jetzt die
                Meta-Zeile ueber dem Eyebrow — gleiche Information, eine Ebene weniger. */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">{su.badge}</p>
            <Eyebrow>{su.eyebrow}</Eyebrow>
            <h2 className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {su.title}{su.titleAccent ? ` ${su.titleAccent}` : ''}
            </h2>
            <p className={cn("mt-4 max-w-xl text-pretty", sectionLead)}>{su.body}</p>
            <div className="mt-8">
              <PrimaryCta href={SCHNUPPER_HREF}>{de ? 'Gratis Schnupperstunde buchen' : 'Book a free trial class'}</PrimaryCta>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Schnupperstunde (helle Einladungs-Karte) */
function TrialSection() {
  const { lang } = useLang();
  const de = lang === 'de';
  const tr = COURSES_OVERVIEW[lang].trial;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  // Diese Sektion war eine handkopierte Fassung derselben Komponente (gleiche Oberkante,
  // gleicher Schein, gleiche Masse) plus einem Logo-Bild obendrueber. Das Logo faellt weg:
  // es steht 40px ueber der Wortmarke in der Navi und nochmal im Footer - dreimal dasselbe
  // Zeichen auf einer Seite. Copy und Ziel bleiben unveraendert.
  return (
    <ClosingInvite
      eyebrow={tr.eyebrow}
      title={tr.title}
      titleAccent={tr.titleAccent}
      body={tr.body}
      ctaLabel={tr.cta}
      ctaHref={SCHNUPPER_HREF}
      secondary={{
        label: de ? 'Kursplan ansehen' : 'See the schedule',
        href: '/kursplan',
      }}
      note={tr.note}
      trust={
        de
          ? ['Gratis', '60 Minuten', 'Ohne Partner möglich']
          : ['Free', '60 minutes', 'No partner needed']
      }
      /* Der Abbinder steht jetzt hinter CalendarSection, und die traegt bereits bg-soft.
         Bliebe er ebenfalls "soft", verschmoelzen beide zu einer randlosen Flaeche — darum
         paper-warm: die Kante zwischen Kalender und Schluss bleibt sichtbar.
         dense: Abstand Kalender→CTA eng, Trust-Zeile + zweiter Button als visueller Anker. */
      surface="paper"
      dense
    />
  );
}

/* ---------------------------------------------------------------------------- Privatstunden */
function PrivatSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  const pr = COURSES_OVERVIEW[lang].privat;
  // Eine Quelle fuer die Privat-Preise: dieselben Zeilen wie in der Preise-Sektion.
  const privatPrices = COURSES_OVERVIEW[lang].prices.groups.find((g) => g.key === 'privat')?.rows ?? [];
  return (
    <section id="privatstunden" className="scroll-mt-24 bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:h-full">
            {/* Bild-Chrome und schwebende Glas-Karte raus (Kritik Runde 2). Die Caption
                sitzt jetzt unter dem Foto an einer Haarlinie. */}
            <motion.div variants={item} className="flex h-full flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-media)]">
                <img
                  src="/photos/gallery/kurse/05.jpg"
                  alt={de ? 'Tanzpaar bei einer Privatstunde' : 'Couple in a private lesson'}
                  className="aspect-[4/5] w-full object-cover object-[center_42%] sm:aspect-[4/3] lg:aspect-auto lg:h-full"
                  width={1600}
                  height={1066}
                  loading="lazy"
                />
              </div>
              <div className="mt-5 border-t border-[var(--color-line)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  {de ? '1:1 Coaching' : '1:1 coaching'}
                </p>
                <p className="mt-1.5 font-display text-lg font-bold leading-tight text-[var(--color-ink)]">
                  {de ? 'Dein Tempo. Dein Fokus.' : 'Your pace. Your focus.'}
                </p>
              </div>
            </motion.div>
          </Reveal>

          <Reveal className="order-1 max-w-xl lg:order-2">
            <motion.div variants={item}>
              <Eyebrow>{pr.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {pr.title}{pr.titleAccent ? ` ${pr.titleAccent}` : ''}
            </motion.h2>
            <motion.p variants={item} className={cn("mt-4 max-w-xl text-pretty", sectionLead)}>
              {pr.body}
            </motion.p>
            <motion.ul variants={item} className="mt-7 space-y-px">
              {pr.points.map((point, i) => {
                const Icon = PRIVAT_ICONS[i] ?? Users;
                return (
                  <li key={point} className="flex items-start gap-4 border-t border-[var(--color-line)] py-3.5 first:border-t-0">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                      <Icon aria-hidden className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
                    </span>
                    <span className="text-base leading-relaxed text-[var(--color-ink)]">{point}</span>
                  </li>
                );
              })}
            </motion.ul>

            {/* Kompakte Preis-Tabelle (gleiche Zahlen wie in der Preise-Sektion). */}
            <motion.div variants={item} className="mt-8 border-t border-[var(--color-line)] pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                {de ? 'Preise' : 'Prices'}
              </h3>
              <dl className="mt-3 space-y-px">
                {privatPrices.map((row, i) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-t border-[var(--color-line)] py-3 first:border-t-0"
                  >
                    <dt className="text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{row.label}</dt>
                    <dd
                      className={cn(
                        'shrink-0 font-display text-base font-extrabold',
                        i === 0 ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta href={SCHNUPPER_HREF}>{de ? 'Privatstunde anfragen' : 'Request a private lesson'}</PrimaryCta>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3.5 text-base font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-salsa)]"
              >
                {de ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp'}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Kursplan-Teaser (Auszug, kein voller Kalender) */
// Master-Plan: KEIN zweiter voller Kurskalender auf Tanzkurse. Der lebt nur auf /kursplan.
// Hier nur ein Auszug der naechsten Kurse + Button zum ganzen Plan. Robust: laedt der Server
// nicht (statischer Deploy ohne Backend), greift ein freundlicher Fallback statt eines Fehlers.
function CalendarSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const de = lang === 'de';
  const cal = COURSES_OVERVIEW[lang].calendar;
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let alive = true;
    fetchSchedule()
      .then((d) => alive && (setData(d), setState('ready')))
      .catch(() => alive && setState('error'));
    return () => {
      alive = false;
    };
  }, []);

  const courses = data?.courses ?? [];
  const upcoming = courses.filter((c) => c.phase === 'upcoming');
  const running = courses.filter((c) => c.phase === 'running');
  // Vielfalt statt 4x derselbe Tag/Stil: verschiedene Wochentage/Stile in der Vorschau.
  const teaser = pickVariedCourses([...upcoming, ...running], 4);
  const showFallback = state !== 'ready' || teaser.length === 0;

  return (
    /* Kritiker r5/r6: Lücke unter 4er-Grid bis Final-CTA — Bottom-Padding knapper als Top,
       damit "Sieh, welche Kurse..." und ClosingInvite eng koppeln (keine halbe Viewport-Leere). */
    <section id="kurskalender" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-10 pb-6 lg:py-12 lg:pb-6">
      <Shell>
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div variants={item} className="max-w-xl">
            <Eyebrow>{cal.eyebrow}</Eyebrow>
            <h2 className={cn("mt-4", sectionTitle, MEASURE_L)}>
              {cal.title}{cal.titleAccent ? ` ${cal.titleAccent}` : ''}
            </h2>
            <p className={cn("mt-3 max-w-xl text-pretty", sectionLead)}>{cal.lead}</p>
          </motion.div>
          <motion.div variants={item}>
            <PrimaryCta href="/kursplan">{cal.cta}</PrimaryCta>
          </motion.div>
        </Reveal>

        {state === 'loading' ? (
          <div className="mt-6 grid gap-px border-t border-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-[var(--color-bg-soft)]" />
            ))}
          </div>
        ) : showFallback ? (
          /* Design-Kritik Runde 3, Issue 5 ("Die Sektion bricht ihr eigenes Versprechen").
           *
           * Der Befund — eine Zeile Fliesstext, zweimal derselbe Link "Kursplan oeffnen" und
           * eine leere Box mit Fussschritt-Grafik — war der FALLBACK dieser Sektion, nicht ihr
           * Normalzustand. Nachgewiesen: die Kurse kommen aus `fetchSchedule()`; im Umfeld der
           * Screenshots antwortet `/api/schedule` mit HTTP 500 (kein Backend beim statischen
           * Preview), darum greift `showFallback`. Mit laufender API rendert hier das
           * Karten-Raster mit echten Terminen und die Sektion loest ihr Versprechen ein.
           *
           * Zwei Dinge waren am Fallback trotzdem echte Fehler und sind hier behoben:
           *  1. Die Fussschritt-Grafik hatte an dieser Stelle keine Funktion — sie fuellte nur
           *     Flaeche und liess die Box wie ein vergessenes Element wirken. Ersatzlos raus
           *     (so auch die Kritik: "muss in beiden Faellen weg").
           *  2. Der doppelte CTA: derselbe "Kursplan oeffnen"-Link stand als Pill oben in der
           *     Sektion UND noch einmal als Textlink hier drin. Der zweite ist gestrichen —
           *     der Pill oben bleibt der eine Weg in den Kursplan.
           *
           * Was bleibt, ist eine ehrliche, ruhige Statuszeile statt einer leeren Buehne. */
          <p className="mt-6 border-t border-[var(--color-line)] pt-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {de
              ? 'Die nächsten Kurstermine laden gerade nicht. Den vollständigen Plan mit Tanzstil, Level und Wochentag findest du im Kursplan.'
              : 'The next course dates are not loading right now. You will find the full plan with style, level and weekday on the schedule page.'}
          </p>
        ) : (
          <div className="mt-6 grid border-t border-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
            {teaser.map((course, index) => {
              // Jede ZWEITE Karte desselben Stils bekommt das Zweit-Motiv, damit keine
              // identischen Fotos nebeneinander stehen.
              const nthOfStyle = teaser.slice(0, index).filter((c) => c.styleKey === course.styleKey).length;
              return (
                <div key={course.id} className="h-full">
                  <CourseStartCard course={course} data={data!} index={index} altThumb={nthOfStyle % 2 === 1} />
                </div>
              );
            })}
          </div>
        )}
      </Shell>
    </section>
  );
}
