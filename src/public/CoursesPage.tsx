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
//   Keine Pastell-Flaechen. Hover aendert den Zustand echt
//   (Rot -> Ink invertieren + Pfeil-Slide), nicht nur dunkler.
//
// Inhalt + Fakten kommen 1:1 aus courses/overview-content.ts (COURSES_OVERVIEW), nichts erfunden.
// Zweisprachig DE/EN.

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { levelLabelI18n, useLang, weekdayLabel } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { Shell, CtaPill, CtaText, sectionTitle, sectionLead } from '@/public/site/primitives';
/* R208: CONTACT, CtaArrow und WhatsAppIcon sind mit dem dritten CTA in PrivatSection
   weggefallen (Raphael: "drei CTAs machen keinen Sinn"). */
/* R188 TZ1: HeroFrame ist raus. Die Kopfsektion baut jetzt lokal, damit
   `lg:items-start` gilt, ohne die Achse 'split' sitewide zu aendern (kit.tsx tabu). */
import { MEASURE_L, MEASURE_XL, ClosingInvite } from '@/public/subpage/kit';
import { Reveal, useReveal } from '@/public/home/motion';
import { cn } from '@/lib/utils';
import { COURSES_OVERVIEW } from '@/public/courses/overview-content';
import { fetchSchedule, nextScheduleDate, pickVariedCourses, type ScheduleCourse, type ScheduleResponse, type WeekdayKey } from '@/lib/schedule';
/* Check und ShieldCheck sind mit der Preise-Sektion (R188 TZ5) weggefallen:
   sie standen nur in deren Leistungsliste und Garantie-Zeile. */
import {
  ArrowRight,
  Users,
  Music,
  CalendarClock,
  HeartHandshake,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

// Stage 4 Icon-System: sprechende Feature-Icons fuer die Privatstunden-Vorteile.
// Reihenfolge folgt privat.points: einzeln/zu zweit -> Salsa-Styles -> Termine -> Hochzeitstanz.
const PRIVAT_ICONS: LucideIcon[] = [Users, Music, CalendarClock, HeartHandshake];

/* R208 (Raphael 23.08. 17:14): "Icons: wenn Icons, dann UEBERALL gleich, nicht nur bei
   manchen Punkten." + "H3 zu klein. Icon dazu, cooler machen."
   Vorher trug NUR die Workshop-Reihe ein Icon (GraduationCap), die drei Stil-Reihen
   daneben keines — vier gleich gebaute Reihen, eine davon mit Zeichen. Jetzt hat jede
   Reihe ihr Icon aus demselben Satz (Lucide, gleiche Groesse, gleiche Strichstaerke).
   Der Lookup ist offen typisiert, weil `card.key` ein roher String aus dem Content ist;
   der `??`-Fallback faengt einen unbekannten Stil ab. */
// oxlint-disable-next-line anti-slop/no-known-value-widening
const STYLE_ICON: Record<string, LucideIcon> = {
  salsa: Music,
  bachata: HeartHandshake,
  heels: Sparkles,
  workshops: GraduationCap,
};

// EIN CTA-Ziel sitewide (Master-Plan): der Schnupper-Anker scrollt auf /kontakt zum Formular.
const SCHNUPPER_HREF = '/schnupperstunde';
const SECTION_OFFSET = 'calc(var(--nav-h) + 1.5rem)';

function courseStart(course: ScheduleCourse, data: ScheduleResponse, lang: 'de' | 'en') {
  const term = data.terms.find((t) => t.id === course.termId);
  // SAFETY: `course.weekday` kommt als roher String aus der API und ist NICHT garantiert ein
  // WeekdayKey. Die Zusicherung ist trotzdem gefahrlos: nextScheduleDate schlaegt den Wert nur
  // per WEEKDAY_ORDER.indexOf nach (src/lib/schedule.ts) und liefert bei einem unbekannten Tag
  // -1 bzw. null. Der Aufrufer faengt null unten mit der "Start laut Kursplan"-Zeile ab.
  const iso =
    course.nextDates?.[0] ??
    (term ? nextScheduleDate(term.startDate, course.weekday as WeekdayKey, [term]) : null);
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
/* Der Lookup unten indiziert mit `course.styleKey` (roher String aus der API), darum ist die
   offene Dictionary-Signatur hier die richtige Vertragsform und kein Typ-Verlust: sie erlaubt
   den String-Zugriff und liefert bei unbekanntem Stil `undefined`, was der `??`-Fallback faengt.
   Mit `satisfies` statt Annotation bricht `tsc` mit TS7053 (gemessen: 5 Fehler). */
// oxlint-disable-next-line anti-slop/no-known-value-widening
const STYLE_THUMB: Record<string, string> = {
  salsa: '/photos/premium/offer-salsa-800.webp',
  bachata: '/photos/premium/offer-bachata-800.webp',
  heels: '/photos/premium/offer-heels-800.webp',
};

/* Die Motive sind Hochformat, die Karte 16/10: object-cover schneidet mittig und
   koepft die Taenzer (Kritiker r13). Fokus deshalb pro Motiv auf die Gesichtszone. */
// oxlint-disable-next-line anti-slop/no-known-value-widening
const STYLE_THUMB_FOCUS: Record<string, string> = {
  salsa: 'center 22%',
  bachata: 'center 20%',
  heels: 'center 25%',
};

/* Zweit-Motiv je Stil: der Teaser zeigt oft ZWEI Salsa- und ZWEI Bachata-Starts —
   mit nur einem Motiv pro Stil standen identische Fotos direkt nebeneinander
   (Sweep 14.08.2026, /tmp/s-r6-tanzkurse-390-4.png). Beide Dateien waren bisher
   ungenutzt (0 Fundstellen), Dopplungs-Limit unberuehrt. */
// oxlint-disable-next-line anti-slop/no-known-value-widening
const STYLE_THUMB_ALT: Record<string, string> = {
  salsa: '/photos/2026/event-social-couple-01.webp',
  bachata: '/photos/2026/event-social-couple-02.webp',
};
// oxlint-disable-next-line anti-slop/no-known-value-widening
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
  const thumb = (useAlt ? STYLE_THUMB_ALT[course.styleKey] : STYLE_THUMB[course.styleKey]) ?? '/photos/premium/offer-salsa-800.webp';
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
        <span className="truncate">{weekdayLabel(lang, course.weekday)?.long ?? course.weekday}</span>
      </span>
      <span className="mt-1.5 type-h3 text-[var(--color-ink)]">{style}</span>
      {/* R217 (Raphael 24.08. 02:22): "Level-Pille auf /tanzkurse nach Level (oder
          einheitlich) faerben, nicht nach Kartenindex. Beginner ist einmal rot
          (Stufe 2) und zweimal beige (Stufe 4, 5) — die Farbe kodiert nichts.
          Rot ist Aktionsfarbe der Site, zwei rote Pillen lesen sich als
          Hervorhebung ohne Grund."

          KORREKTUR ZUR URSACHE: nach Kartenindex faerbte sie nicht. Sie faerbte
          nach `course.styleKey` — heels dunkel, bachata beige, alles andere rot.
          Im Screenshot lag Salsa zufaellig auf 01+02 und Bachata auf 03+04,
          daher las es sich als Positionsfarbe. Die beschriebene WIRKUNG stimmt
          trotzdem exakt: die Pille zeigt einen LEVEL-Text und faerbte nach STIL,
          die Farbe kodierte also nicht, was in ihr steht.

          Warum einheitlich und nicht nach Level: `levelCategory` gibt es zwar
          sauber im Datenmodell (db/schema.ts:35, fuenf Enum-Werte — beginner,
          intermediate, advanced, open, heels; gezaehlt in
          src/generated/schedule-embedded.ts: 32/12/14/12/4). Eine Farbskala
          darueber waere aber eine neue Zeichensprache, die die Seite nirgends
          erklaert, und zwei der fuenf Werte (open, heels) sind gar keine Stufe
          auf der Leiter — sie liessen sich nicht einordnen.

          Stattdessen folgt die Pille dem Muster, das die SCHWESTERSEITE fuer
          exakt dieselbe Information schon hat: `/kursplan` rendert den Level ueber
          `CourseBadge tone="level"` (courses/CourseRow.tsx:311) und der Ton ist
          dort einheitlich `bg-bg-soft` + `text-ink`, nie rot. Der Kommentar
          darueber nennt den Grund woertlich: "Metadaten bleiben neutral.
          Salsa-Rot markiert nur die erste Buchungsaktion." Genau diese Regel
          hat die Pille hier gebrochen.

          `CourseBadge` wird nicht importiert: der Ton dort traegt vier
          group-hover-Faelle fuer die rot durchfaerbende Kurszeile auf /kursplan.
          Diese Karte hat keinen solchen Zustand; die Klassen waeren hier tot.
          Uebernommen wird die Farbentscheidung, nicht der Sonderfall.

          Der Stil steht als eigene Zeile direkt darueber ({style}, Zeile 179).
          Die Stilfarbe war also auch inhaltlich redundant.

          Eine Haarlinie kommt dazu, obwohl /kursplan keine traegt. Grund
          gemessen (scripts/r217-kontrast.cjs): dort sitzt die Badge auf einer
          WEISSEN Kurszeile, hier steht die Karte ohne eigenen Hintergrund
          direkt auf der Sektion — und die ist exakt dieselbe Farbe wie die
          Pille (beide rgb(244,241,236)). Ohne Linie verschwindet die
          Pillenform vollstaendig; im ersten Belegbild war das sichtbar. Der
          alte bachata-Zweig trug aus genau diesem Grund einen Ring.

          `border` und NICHT `ring-1`, obwohl der alte Zweig `ring` nutzte:
          index.css:348-352 loescht unter 640px per
          `main :not(a):not(button)... { box-shadow: none }` jeden Schatten auf
          nicht-interaktiven Elementen. Ein Tailwind-`ring` IST ein box-shadow
          und wurde damit auf 390 stillschweigend entfernt — gemessen
          (scripts/r217-ring.cjs): 1440 boxShadow rgb(228,228,225) 0 0 0 1px,
          390 boxShadow "none". Die alte Bachata-Pille war auf Mobil aus
          demselben Grund ringlos. `border` faellt nicht unter die Regel und
          haelt darum auf beiden Viewports. */}
      {level ? (
        <span className="mt-1 inline-flex w-fit rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-2 py-px text-[10px] font-semibold text-[var(--color-ink)]">
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
          {/* Ohne tabular-nums: Doppelpunkt-Uhr bekam Ziffernbreiten-Loecher
              (Critic Runde 17, Item 3 — wie CourseEngine/ScheduleTeaser in Runde 14). */}
          <span className="mt-px block font-semibold text-[var(--color-ink)]">{course.startTime}</span>
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
        {/* R188 TZ5, Raphael-Video 09:12: «Was ein regulaerer Kurs kostet — komplett weg.»
            Die Sektion stand hier als dritte Preis-Stelle der Seite: die Privatstunden-
            Preise laufen weiter unten in PrivatSection, der volle Tarif steht auf /preise.
            PricesSection ist damit ersatzlos raus. Die Preis-Daten in overview-content.ts
            bleiben stehen, weil PrivatSection sie liest (prices.groups[key='privat']). */}
        {/* R188 TZ6: Der komplette Sommer-/Spezialpreis-Promo-Block ist entfernt.
            Raphael beanstandete nicht nur Badge und Linie, sondern den verbleibenden
            Block mit «Drei Wochen Sommerkurs» und «Spezialpreis». Kein Ersatz. */}
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
          Float bleibt an: Raphael will den Kreis sitewide unten rechts. */}
      <SiteFooter entryCta={false} />
    </>
  );
}

/* ---------------------------------------------------------------------------- Intro */
/* R188 TZ1, Raphael-Video 08:45: «Links die Ueberschrift, rechts der frei schwebende
   Text — die sind nicht auf einer ordentlichen Hoehe.»

   Gemessen am Vorher-Shot (worklog/shots/R188/before/tanzkurse/d-01.png): die H1 beginnt
   bei y=130, der Lead rechts bei y=103 und der CTA-Block haengt darunter frei in der
   Luft. Ursache ist die Achse 'split' in HeroFrame (kit.tsx): sie stellt beide Spalten
   auf `lg:items-end`, also auf eine gemeinsame UNTERkante. Weil die rechte Schiene
   (Lead + zwei CTAs + drei Zahlen) hoeher baut als die zweizeilige H1, rutscht die
   Headline nach unten und keine der beiden Spalten hat oben eine gemeinsame Linie.

   kit.tsx ist hier tabu (parallele Items, sitewide Wirkung). Der Kopf laeuft darum
   nicht mehr ueber HeroFrame, sondern als eigene Sektion in dieser Datei: dasselbe
   Zweispalter-Bild, aber `lg:items-start` plus eine gemeinsame Haarlinie ueber beiden
   Spalten. H1 und Lead starten damit auf derselben Oberkante. Alle anderen Routen
   behalten HeroFrame und ihre Achse unveraendert. */
function CoursesHero() {
  const { lang } = useLang();
  const { container, item } = useReveal();
  const h = COURSES_OVERVIEW[lang].hero;
  const de = lang === 'de';
  /* Facts (~290px unter den CTAs) schieben das Foto auf 390 aus dem Fold.
     Ab sm (640) bleiben die drei Zahlen; darunter weglassen. */
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  /* Mobile: "Studios am Bahnhof SBB" brach als alleinstehendes "SBB" unter "Bahnhof".
     Kurzeres Label + keep-all im Fact-Label. Desktop bleibt lesbar. */
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
    <>
      {/* Raphael 20.08.2026: "Tanzkurse-Bilder rund." Das Hero-Band lief als einziges
          Element der Seite eckig full-bleed bis an beide Viewportkanten (gemessen
          borderRadius 0px, x=0, w=1440) — der ganze Rest der Seite ist gerundet.
          Das Band steht darum als eigenes, gerundetes Medienband in dieser Seite. */}
      <section
        className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
        style={{ paddingTop: 'calc(var(--nav-h) + 0.5rem)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
        />
        <Shell className="pt-2 pb-10 lg:pt-3 lg:pb-14">
          <motion.div data-reveal variants={container} initial="hidden" animate="show">
            {/* Die gemeinsame Oberkante ist sichtbar, nicht nur gerechnet: EINE Haarlinie
                laeuft ueber beide Spalten, beide Inhalte starten mit demselben pt-8.

                `mt-0` auf der H1: type-h1 bringt einen eigenen Aussenabstand mit. Der
                addierte sich auf das pt-8 und schob die Ueberschrift 14px unter die
                rechte Spalte (am Live-Render gemessen: H1-Box bei y=111, rechte Spalte
                bei y=97). Genau der Versatz, den Raphael sieht. Mit mt-0 tragen beide
                Spalten denselben Abstand zur Linie.

                Gleiche BOX-Kante reicht optisch nicht: type-h1 laeuft auf
                line-height 1, der Lead auf 1.625. Die H1-Versalien starten also direkt
                am Padding (32px + 0 Leerraum), die erste Lead-Zeile erst 5.6px darunter
                (32px + (29.25-18)/2). Ohne Korrektur haengt der Text rechts sichtbar
                tiefer als die Ueberschrift — genau der Versatz aus dem Video.
                Rechts steht darum `lg:pt-[1.625rem]` = 26px: 26 + 5.6 = 31.6, also die
                Oberkante der H1-Versalien bei 32. Am Live-Render nachgemessen. */}
            {/* R208 (Raphael 23.08. 17:14): "Hero weird. Links-rechts: links Text, rechts ein
                Bild. Bild WECHSELN, das aktuelle Bild ist schlecht."
                Vorher trug der Hero LINKS die H1 und RECHTS Lead + CTAs + Zahlen — also Text
                gegen Text, kein Bild. Das Foto lief als separates Band UNTER dem Hero
                (kurse-classfreude-hero-2100.webp, die Gruppe mit erhobenen Armen von hinten).
                Jetzt: links die komplette Textschiene (H1, Lead, CTAs, Zahlen), rechts das
                Bild in der Hero-Zeile. Das Band darunter entfaellt — sonst stuende dasselbe
                Motiv zweimal auf 900px Hoehe. */}
            <div className="grid gap-8 border-t border-[var(--color-line)] lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
              <div className="flex flex-col gap-6 pt-8">
                <motion.h1
                  variants={item}
                  className={cn('type-h1 mt-0 text-[var(--color-ink)]', MEASURE_XL)}
                >
                  {h.title}{h.titleAccent ? ` ${h.titleAccent}` : ''}
                </motion.h1>
                <motion.p variants={item} className={cn('mt-0 max-w-xl text-pretty', sectionLead)}>
                  {h.lead}
                </motion.p>
                <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PrimaryCta href="/kursplan">
                    {de ? 'Kursplan ansehen' : 'See the schedule'}
                  </PrimaryCta>
                  <CtaText href={SCHNUPPER_HREF}>
                    {de ? 'Gratis Schnupperstunde buchen' : 'Book a free trial class'}
                  </CtaText>
                </motion.div>
                {wide ? (
                  <motion.dl
                    variants={item}
                    /* R208 Runde 2 (Linien-Befund, zweite Fundstelle): `border-t` raus.
                       Diese Linie sass im Hero direkt ueber der Zahlenreihe, also an der
                       sichtbarsten Stelle der Seite — derselbe Strich, den Raphael
                       (23.08. 17:14) weghaben wollte. Belegt am Fold-Shot
                       fertig/r205/tanzkurse-d1440-fold.png, Zone y=540.
                       Der Abstand traegt die Trennung allein: `pt-6` bleibt, `mt-2` am
                       Elternteil setzt die Reihe ohnehin vom CTA ab. Dieselbe Leiste
                       steht auf /team (TeamPage.tsx) und ist dort gleich behandelt. */
                    className="grid max-w-xl grid-cols-1 gap-5 pt-6 md:grid-cols-3 md:gap-4"
                  >
                    {stats.map(([value, label]) => (
                      <div key={label}>
                        <dt className="font-display text-2xl font-extrabold leading-none text-[var(--color-salsa)] sm:text-3xl">
                          {value}
                        </dt>
                        {/* text-balance + keep-all: "Studios am Bahnhof" soll nicht als
                            alleinstehendes Wort unter die Zeile rutschen. */}
                        <dd className="mt-2 text-balance text-xs leading-snug text-[var(--color-ink-muted)] [overflow-wrap:normal] [word-break:keep-all]">
                          {label}
                        </dd>
                      </div>
                    ))}
                  </motion.dl>
                ) : null}
              </div>

              {/* Das neue Motiv: hero-paar-dreh-01-portrait.webp — ein Paar bei einer Drehung,
                  BEIDE Gesichter frei und zugewandt. Das alte Bandmotiv zeigte eine Gruppe
                  ueberwiegend von hinten. Hochformat, passt ohne Crop in die Hero-Spalte;
                  vor dem Einbau per Read angesehen. */}
              <motion.div variants={item} className="pt-8">
                <div className="overflow-hidden rounded-[var(--radius-media)]">
                  <img
                    src="/photos/2026/hero-paar-dreh-01-portrait.webp"
                    alt={de ? 'Tanzendes Paar bei einer Drehung im Salsaflow-Studio' : 'A couple mid-turn in the Salsaflow studio'}
                    className="aspect-[4/5] w-full object-cover object-[center_28%] lg:aspect-[4/4.4]"
                    width={1080}
                    height={1350}
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Shell>
      </section>
      {/* R208: Das separate Medienband unter dem Hero ist entfallen. Das Hero-Bild steht
          jetzt IN der Hero-Zeile rechts (siehe oben) — zwei grosse Motive direkt
          uebereinander waeren dieselbe Flaeche zweimal. */}
    </>
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
  /* Raphael 20.08.2026: "Mehr verschiedene Fotos."
     Die Bachata-Stilkarte trug offer-bachata-1200.webp, der Kurs-Teaser weiter
     unten offer-bachata-800.webp: dasselbe Paar, nur zwei Groessen. Ob beide
     gleichzeitig sichtbar sind, haengt am Kursplan-Feed — deshalb hier nicht
     "war doppelt", sondern: das Risiko ist ausgebaut. Die Karte zeigt jetzt
     community-diversitaet-01.webp (sitewide sonst nur an einer Stelle), die
     800er bleibt im Teaser, damit der Bachata-Crop-Lock (center 20%) haelt.
     Gemessen 20.08. auf 1440 und 390: 11 Fotos, 0 doppelte Motive. */
  const CARD_PHOTO_OVERRIDE = {
    bachata: {
      src: '/photos/2026/community-diversitaet-01.webp',
      position: 'object-[center_38%]',
      alt: de ? 'Tanzende Paare auf der Bachata-Flaeche' : 'Couples dancing bachata on the floor',
    },
  } satisfies Record<string, { src: string; position: string; alt: string }>;
  /* R188 TZ2: Die Schlagwort-Listen fuellten die geloeschte Overline-Zeile
     («Beginner bis Advanced · Partnerwork · …»). Sie hatten sonst keinen Leser. */

  return (
    <section style={{ scrollMarginTop: SECTION_OFFSET }} className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        {/* R188 TZ6: Rechts stand eine zweite Spalte mit Trennlinie, Takt-Marker und dem
            Satz «Stil waehlen, Schnupperstunde buchen und im passenden Level starten.»
            Der Satz sagte dasselbe wie der Lead links daneben, und Linie plus Marker
            waren die Deko-Elemente, die Raphael auf dieser Seite beanstandet
            («Linie dort scheisse, weg»). Der Kopf ist jetzt eine Spalte. */}
        {/* R188 TZ2 Runde 2, Raphael-Video 08:52: «Diese Striche ueberall weglassen,
            mehr Platz lassen.» Runde 1 hatte nur die Deko-Overlines INNERHALB der
            Stil-Reihen entfernt; der Sektionskopf trug den Kicker weiter. Beleg:
            worklog/shots/R188/after-final/tanzkurse/d-02.png zeigt ueber der H2 den
            roten Dreistrich-Marker und «KURSRICHTUNGEN».
            Der Kicker ist raus. Er benannte in Versalien, was die H2 darunter im Satz
            sagt («Salsa, Bachata, Heels oder ein gezielter Workshop»), und der Marker
            war der Strich selbst. Das freigewordene Mass geht als Luft in den Kopf:
            die Ueberschrift startet ohne mt-5 direkt oben, der Lead bekommt mt-5. */}
        {/* AAA Runde 2 (Opus), Beleg worklog/shots/R188/after-final2-tanzkurse/
            tanzkurse/d-02.png: Der Sektionskopf stand in EINER max-w-2xl-Spalte ganz
            links. Rechts daneben blieben auf 1440 rund 700px voellig leer — bei einer
            Ueberschrift, die auf zwei Zeilen laeuft, und einem Lead auf zwei Zeilen.
            Die Sektion begann damit als halb leere Flaeche.

            Kopf und Lead stehen jetzt nebeneinander: die H2 links, der Lead rechts.
            Beide starten auf derselben Oberkante, dieselbe Zweispalter-Logik wie der
            Seitenkopf weiter oben (CoursesHero, TZ1) — die Seite bekommt damit EIN
            Kopfmuster statt zweier. Der Lead traegt `lg:pt-[0.5rem]`, weil type-h2 und
            sectionLead verschiedene Zeilenhoehen haben und die erste Lead-Zeile sonst
            ueber der H2-Oberkante der Versalien saesse. Kein neuer Kicker, kein Strich:
            es verschiebt sich nur, was vorher schon da war. Unter lg stapelt es wie
            bisher. */}
        <Reveal>
          <motion.div
            variants={item}
            className="grid gap-x-16 gap-y-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start"
          >
            <h2 className={cn(sectionTitle, MEASURE_L)}>
              {s.title}{s.titleAccent ? ` ${s.titleAccent}` : ''}
            </h2>
            {/* `lg:mt-0`: ab lg stehen H2 und Lead NEBENeinander auf derselben
                Oberkante (siehe Kommentar oben). Das `mt-4` aus `sectionLead`
                schoebe den Lead dort um 16 px nach unten und bräche genau die
                Ausrichtung, die dieser Block herstellt. Unter lg stapeln die
                beiden, dort ist der Rand richtig und bleibt stehen. */}
            <p className={cn('max-w-xl text-pretty lg:pt-[0.5rem]', sectionLead, 'lg:mt-0')}>{s.lead}</p>
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
              // SAFETY: der `in`-Test oben beweist, dass card.key ein Schluessel von
              // CARD_PHOTO_OVERRIDE ist; nur dann wird indiziert.
              const override =
                card.key in CARD_PHOTO_OVERRIDE
                  ? CARD_PHOTO_OVERRIDE[card.key as keyof typeof CARD_PHOTO_OVERRIDE]
                  : undefined;
              const photo = override?.src ?? card.photo;
              return (
                /* AAA Runde 2 (Opus), SW2 — Beleg d-02.png/d-03.png:
                   Die drei Stil-Teaser standen vertikal uneinheitlich. Gemessen an den
                   Screenshots: Der Salsa-Text beginnt bei y=577 neben einem Bild, das
                   von y=400 bis y=899 laeuft (also mittig), der Bachata-Text bei y=224
                   neben einem Bild von y=44 bis y=572 (also ebenfalls mittig) — aber
                   weil die drei Texte VERSCHIEDEN lang sind (Salsa 3 Zeilen, Bachata 3,
                   Heels 3, plus unterschiedlich hohe Ueberschriften), landet jeder Block
                   auf einer anderen relativen Hoehe seiner Reihe. Im Scroll liest sich
                   das als «Bachata klebt oben am Bild, Heels haengt mittig».

                   Fix ohne neue Elemente: `items-center` faellt weg, die Textspalte
                   richtet sich mit `items-stretch` (Grid-Default) an der Reihe aus und
                   setzt ihren Inhalt selbst auf `justify-center`. Damit steht jeder
                   Text auf DERSELBEN relativen Achse seiner Reihe — der optischen Mitte
                   des Bildes daneben — unabhaengig davon, wie lang er ist.
                   Zusaetzlich bekommt die Textspalte `lg:py-0`: das feste py-14/py-20
                   addierte sich auf die Bildhoehe und war der zweite Grund fuer die
                   ungleichen Abstaende. Unter lg (gestapelt) bleibt das Polster. */
                /* R208 (Raphael 23.08. 17:14): "Horizontale Linien: weg. Sehen scheisse aus."
                   + "Abstand zwischen den Bildern. Besonders Salsa/Bachata gezielter
                   Workshop: Luft zwischen den Bildern, sonst sieht es dumm aus."
                   Die Reihen hingen an `border-t` mit 0px Abstand: dadurch stiess die
                   Unterkante des einen Fotos direkt an die Oberkante des naechsten (im
                   Vorher-Shot d1440 sichtbar zwischen Heels und Workshop). Statt Linie
                   jetzt echter Weissraum zwischen den Reihen. */
                <motion.li
                  key={card.key}
                  variants={item}
                  className={cn(
                    'grid grid-cols-1 gap-x-12 pt-14 first:pt-0 lg:pt-20',
                    flip ? 'lg:grid-cols-[5fr_7fr]' : 'lg:grid-cols-[7fr_5fr]',
                  )}
                >
                  <a
                    href={card.href}
                    aria-label={card.title}
                    className={cn(
                      /* Raphael 20.08.2026: "Tanzkurse-Bilder rund" — Plural. Runde 1 rundete
                         nur das Hero-Band; die drei Stil-Fotos blieben scharfkantig und
                         standen damit als einzige eckige Medienflaechen neben lauter
                         gerundeten (Hero-Band, Privatstunden-Foto, Teaser-Thumbs). Gleicher
                         Token wie sitewide: --radius-media. */
                      'group relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] sm:aspect-[7/5]',
                      flip && 'lg:order-2',
                    )}
                  >
                    <img
                      src={photo}
                      alt={override?.alt ?? card.alt ?? card.title}
                      className={cn(
                        'absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-base)] ease-out motion-safe:group-hover:scale-[1.04]',
                        // Das Bachata-Motiv ist hochkant. In der Querformat-Karte (7/5) schneidet
                        // ein mittiger Ausschnitt beiden Tanzenden den Oberkopf ab.
                        // 12% statt 25%: der Maennerkopf war oben angeschnitten
                        // (Critic Runde 10, Item 5).
                        photo?.includes('offer-bachata') && 'object-[center_12%]',
                        override?.position,
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
                  {/* R188 TZ2, Raphael-Video 08:52: «Diese Striche ueberall weglassen,
                      mehr Platz lassen.» Hier stand ueber jeder Ueberschrift eine
                      Deko-Overline aus Nummer und vier Schlagworten
                      («01 · BEGINNER BIS ADVANCED · PARTNERWORK · …»), getrennt durch
                      Mittelpunkte. Sie war reine Dekoration: nicht klickbar, kein Filter,
                      und sie wiederholte in Stichworten, was der Absatz darunter als Satz
                      sagt. Raus, und das gewonnene Vertikalmass geht als Luft in die
                      Reihe (py-12 -> py-14/lg:py-20). */}
                  <div className={cn('flex flex-col justify-center py-14 lg:py-0', flip && 'lg:order-1')}>
                    {/* R208: Icon ueber der Ueberschrift, gleiche Bauform wie die
                        Workshop-Reihe darunter — dieselbe Groesse (h-8 w-8), dieselbe
                        Strichstaerke (1.75), dieselbe Farbe. */}
                    {(() => {
                      const Icon = STYLE_ICON[card.key] ?? Music;
                      return <Icon aria-hidden className="h-8 w-8 text-[var(--color-salsa)]" strokeWidth={1.75} />;
                    })()}
                    {/* R208: "H3 zu klein." type-h3 lief auf 23px und war damit von der
                        Body-Zeile (17px) kaum abgesetzt. type-h2 macht die Stil-Namen zu
                        dem, was sie sind: die Kapitelmarken dieser Sektion. Das <h3>-Tag
                        bleibt — die H2 der Sektion steht darueber, Groesse und Ebene sind
                        getrennt (dasselbe Muster wie home/CoursePath.tsx:81). */}
                    <h3 className="type-h2 mt-4 text-[var(--color-ink)]">
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
              /* AAA SW2: vierte Reihe desselben Zickzacks -> dieselbe Ausrichtung wie die
                 drei Stil-Reihen darueber (items-stretch + justify-center im Text). */
              /* R208: `border-y` raus (Linien weg) und pt-14/lg:pt-20 rein — dieselbe
                 Luft wie zwischen den drei Stil-Reihen darueber. Genau hier lag der
                 Befund "Salsa/Bachata gezielter Workshop: Luft zwischen den Bildern". */
              className="grid grid-cols-1 gap-x-12 pt-14 lg:grid-cols-[5fr_7fr] lg:pt-20"
            >
              <div className="order-2 flex flex-col justify-center py-8 lg:order-1 lg:py-0">
                <GraduationCap aria-hidden className="h-8 w-8 text-[var(--color-salsa)]" strokeWidth={1.75} />
                {/* R208: dieselbe Groesse wie die drei Stil-Reihen (type-h2). */}
                <h3 className="mt-4 type-h2 text-[var(--color-ink)]">
                  {workshop.title}
                </h3>
                <p className="mt-4 max-w-[42ch] text-pretty text-[1.0625rem] leading-[1.588] text-[var(--color-ink-muted)]">
                  {workshop.text}
                </p>
                <div className="mt-6">
                  <PrimaryCta href={workshop.href}>{workshop.cta}</PrimaryCta>
                </div>
              </div>
              {/* Vierte Reihe desselben Zickzacks -> derselbe Medien-Radius wie die drei
                  Stil-Fotos darueber. */}
              <div className="group relative order-1 block aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] sm:aspect-[7/5] lg:order-2">
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
  /* `de` ist mit R188 TZ2 weggefallen: die Sektion hatte genau einen im Code
     geschriebenen Text, das Deko-Label «Stufenweise / Step by step». Alles andere
     liest sie aus COURSES_OVERVIEW[lang]. Mit dem Label ist auch die Sprachweiche hier
     ueberfluessig. */
  const l = COURSES_OVERVIEW[lang].levels;
  const [mainTrack, heelsTrack] = l.tracks;
  /* Raphael 20.08.2026: "Level/Aufbau weniger Text." Gate G27 misst den ganzen
     Sektionstext gegen 120 Woerter.
     Runde 1: 185 -> 125 Woerter. Der Block sagte dieselbe Sache viermal: Lead, eine
     eigene Ueberschrift "So findest du deinen Einstieg" mit Fliesstext, eine
     01/02/03-Liste ("Stil waehlen / Level testen / In der Staffel wachsen") und die
     Flow-Notizen in der Leiter. Ueberschrift und Liste sind raus.
     Runde 2: 125 -> 119 Woerter. Die Zeile sagte zum dritten Mal, was die H2
     ("Wir finden es gemeinsam heraus") und der Lead ("Schnupperstunde ... bei der
     Einordnung") schon tragen. Sie nennt jetzt nur noch die Handlung.
     Runde 3 (Kritik Sol): Beim Streichen der 01/02/03-Liste fiel "In der Staffel
     wachsen" / "Grow through the term" ersatzlos weg. Die Aussage steht sonst
     NIRGENDS in der Sektion: mainTrack.note ("von ganz neu bis Advanced") meint
     den Weg ueber alle Level, der Chip "Nachholen in der Staffel" meint eine
     verpasste Lektion. Die Zeile hier traegt die Aussage jetzt wieder.
     Bezahlt ist sie aus derselben Zeile: der Aufruf "Komm in die Schnupperstunde"
     ist raus, weil der Lead direkt darueber schon "eine Schnupperstunde ... bei
     der Einordnung" nennt. Die Sektion sagt die Schnupperstunde damit einmal
     statt zweimal und ist bei 119 Woertern — genauso viele wie vor dem Fix,
     eine Aussage mehr.
     Die Leiter bleibt: sie ist die Signatur der Sektion, kein Text-Fueller.

     R188 TZ3, Raphael-Video 09:00: «Viel zu viel Text, kuerzen, Abstand zwischen
     den Sachen.» Runde 4 zieht weiter zusammen — gestrichen sind:
     - die Zeile `sideText` ("Eine Staffel, eine Stufe weiter."): sie sagt in anderen
       Worten dasselbe wie mainTrack.note ("Ein klarer Weg von ganz neu bis Advanced")
       direkt daneben.
     - die beiden Flow-Erklaersaetze in der Leiter (flowNoteBeginner /
       flowNoteIntermediate): sie hingen als zweite Textebene an zwei der fuenf Stufen
       und erklaerten das Wort «Flow», das die Stufe selbst schon traegt. Die Leiter
       liest sich damit als fuenf gleich gebaute Zeilen statt als drei Zeilen und zwei
       Absaetze.
     - die Zustands-Spalte rechts ("AUFBAUEN"/"VERBINDEN"): eine dritte Spalte
       Versalien pro Zeile, die keine Information trug, die die Stufe nicht schon hat.
     Das gewonnene Mass geht als Abstand zurueck in die Liste (py-3 -> py-4).
     Die Flow-Texte bleiben in overview-content.ts stehen: /kursaufbau liest sie. */

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
        {/* R208 (Raphael 23.08. 17:14): "Horizontale Linien: weg. Sehen scheisse aus.
            Besonders unter 'Du musst dein Level nicht kennen'." Die Sektion hatte eine
            Rahmenlinie oben und zwei weitere im Inneren. Alle raus, Weissraum traegt. */}
        <Reveal>
          {/* items-start: durch den gekuerzten Text ist die linke Spalte kuerzer als die
              Leiter rechts. Bei der Default-Dehnung (stretch) blieben darunter gemessene
              282px leere Flaeche stehen. Die Trennlinie zieht separat ueber die volle
              Zeilenhoehe, damit die Spalten-Optik erhalten bleibt. */}
          {/* R188 TZ6a Runde 2, Raphael-Video 09:20: «Die Linie dort ist scheisse, weg.»
              Hier lief die letzte senkrechte Trennlinie der Seite: ein 1px-Streifen ueber
              die volle Zeilenhoehe zwischen linker Spalte und Leiter (Beleg
              worklog/shots/R188/after-final2-tanzkurse/tanzkurse/d-05.png, die Linie
              laeuft dort von y=0 bis y=595 zwischen «Salsa On1 und On2» und «Salsa &
              Bachata»). Sie trennte zwei Spalten, die der Weissraum schon trennt.
              Raus, ohne Ersatz. Der Spaltenabstand steigt von 12 auf 16
              (lg:pr-12 -> lg:pr-16, lg:pl-12 -> lg:pl-16): das Mass, das die Linie
              vorher besetzt hat, geht als Luft in die Luecke, damit die Spalten ohne
              Strich klar auseinander liegen. */}
          <div className="grid lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
            <motion.div
              variants={item}
              // R208: `border-b` raus — das war die Linie direkt unter dem Level-Kopf.
              className="py-6 sm:py-7 lg:py-7 lg:pr-16"
            >
              {/* R188 TZ2: Kicker «LEVEL & AUFBAU» plus Takt-Marker raus (Begruendung
                  am Kopf der Stil-Sektion). Der Lead rueckt von mt-3 auf mt-5 ab. */}
              <h2 className={cn(sectionTitle, MEASURE_L)}>
                {l.title}{l.titleAccent ? ` ${l.titleAccent}` : ''}
              </h2>
              <p className={cn("max-w-xl text-pretty", sectionLead)}>{l.lead}</p>

              {/* R208: `border-t` raus, der Abstand traegt die Trennung. */}
              <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <div>
                  <h3 className="type-h3 text-[var(--color-ink)]">{l.onTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{l.onText}</p>
                </div>
                <div>
                  <h3 className="type-h3 text-[var(--color-ink)]">{heelsTrack?.title ?? 'Heels'}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{heelsTrack?.note}</p>
                  {/* Pillen -> Meta-Zeile: das waren Deko-Label, kein Filter (Kritik Runde 2). */}
                  <p className="mt-2.5 text-sm font-semibold text-[var(--color-ink)]">
                    {heelsTrack?.rungs.join(' · ')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Rechte Spalte: keine Karte, keine eigene Fuellfarbe mehr — sie stand als
                graue Flaeche in einer weissen Box auf Papier (drei Toene fuer eine Liste).
                R188 TZ6a: pl-12 -> pl-16, siehe Begruendung an der linken Spalte. */}
            <motion.div variants={item} className="py-6 lg:py-7 lg:pl-16">
              <div>
                {/* R188 TZ2: Rechts stand hier das gesperrte Label «STUFENWEISE». Das ist
                    dieselbe Bauform wie die geloeschten Overline-Striche: gesperrte
                    Versalien als Deko neben einer Ueberschrift. Es sagte ausserdem
                    nichts Neues — die Leiter direkt darunter ist 01 bis 05 nummeriert. */}
                {/* R188 TZ2 Runde 2: Auch dieser rote Dreistrich ist weg. Er stand als
                    einziger Marker der Seite noch neben einer Ueberschrift und war damit
                    genau der «Strich», den Raphael meint — nur an einer H3 statt an einem
                    Kicker. */}
                <div>
                  <h3 className="type-h3 text-[var(--color-ink)]">{mainTrack?.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{mainTrack?.note}</p>
                </div>

                {/* R188 TZ3: eine Zeile pro Stufe, alle gleich gebaut. Die Flow-Saetze
                    und die Zustands-Spalte rechts sind raus (Begruendung oben), der
                    Zeilenabstand waechst von py-3 auf py-4. */}
                {/* R208 Runde 2: `gap-1` ersetzt die entfallenen Trennlinien (siehe
                    Kommentar an der `li`). Ohne den Zusatzabstand stossen die Zeilen
                    mit nur py-3 aneinander. */}
                <ol className="mt-6 grid gap-1">
                  {mainTrack?.rungs.map((rung, ri) => {
                    const isFlow = /flow/i.test(rung);
                    return (
                      <li
                        key={rung}
                        className={cn(
                          // R208 Runde 2 (Kritik Tanzkurse, Befund 6): Hier stand `border-b`
                          // auf jeder Zeile. Raphael (23.08. 17:14) wollte die horizontalen
                          // Linien weg — sie sind zwischen den Stil-Reihen gefallen, in
                          // dieser Leiter aber stehen geblieben. Am Shot nachgesehen
                          // (fertig/r208/v2/tanzkurse-d1440-full.png, Level-Zone y=3420):
                          // vier feine Striche zwischen den fuenf Stufen. Halb umgesetzt
                          // liest sich als Nachlaessigkeit, nicht als Entscheidung.
                          // Die Gliederung traegt hier ohnehin nicht die Linie: jede Zeile
                          // hat einen nummerierten Kreis (01..05), und die Flow-Stufen
                          // stehen zusaetzlich auf einer roten Kante links. Der Abstand
                          // waechst von py-4 auf py-3 plus gap, damit die Zeilen ohne
                          // Strich nicht zusammenlaufen.
                          'grid grid-cols-[3.25rem_1fr] items-center gap-4 py-3 sm:grid-cols-[4.25rem_1fr]',
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
                        <span
                          className={cn(
                            'min-w-0 font-display text-lg font-bold leading-tight sm:text-xl',
                            isFlow ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                          )}
                        >
                          {rung}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {/* R188 TZ4, Raphael-Video 09:05: «Die Bilder in der Levelsektion
                    weglassen.» Hier standen zwei Fussschritt-Diagramme
                    (step-salsa-line.webp / step-bachata-line.webp) mit Versal-Captions
                    unter der Leiter. Sie waren aria-hidden, also fuer Screenreader
                    ohnehin nicht vorhanden, und erklaerten eine Taktzaehlung, die auf
                    dieser Uebersichtsseite nirgends gebraucht wird. Beide raus. */}

                {/* Vier weisse Schatten-Pillen -> eine Fakten-Zeile unter einer Haarlinie.
                    Sie waren nicht klickbar und damit Deko (Kritik Runde 2). */}
                {/* R208: `border-t` raus (Linien-Befund), Abstand von pt-5 auf mt-7. */}
                <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-1.5">
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
  /* R188 TZ5 Runde 2: `privatPrices` ist mit der Preistabelle weggefallen. Damit liest
     /tanzkurse die Preis-Daten aus overview-content.ts an KEINER Stelle mehr — die Seite
     nennt keinen Franken-Betrag und verweist stattdessen auf /preise. Die Daten selbst
     bleiben in overview-content.ts stehen: sie sind dort der gemeinsame Bestand, und
     /preise ist die Seite, die sie zeigt. */
  return (
    <section id="privatstunden" className="scroll-mt-24 bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:h-full">
            {/* Bild-Chrome und schwebende Glas-Karte raus (Kritik Runde 2). Die Caption
                sitzt jetzt unter dem Foto an einer Haarlinie. */}
            <motion.div variants={item} className="flex h-full flex-col">
              {/* R188 TZ7, Raphael-Video 09:28: «Das Privatstunden-Foto ist
                  unterbelichtet, tauschen.»

                  Runde 3. Die zwei Vorgaenger sind beide am Screenshot gescheitert:
                  /photos/gallery/kurse/05.jpg (Luminanz 50/255, Nachtaufnahme mit
                  Blitz) und danach ein weissabgeglichenes Derivat von
                  /photos/2026/hero-paar-studiowand-01.webp (Luminanz 111.6). Auf der
                  hellen Papierflaeche (#FBFAF8) stand auch das zweite noch als dunkles
                  Feld. Ein Weissabgleich macht ein Bild neutral, nicht hell.

                  Jetzt: /photos/premium/offer-privat-wide-original-v2.webp, gemessen
                  Luminanz 121.5 im Original, R minus B = +5.4, Laplace-Schaerfe 3.27.
                  Das Motiv zeigt genau ZWEI Menschen in einer Eins-zu-eins-Fuehrung vor
                  der Salsaflow-Wand — die Aussage der Sektion.

                  Ableitung ist ein reiner Downscale 1800x1200 auf 1500x1000, Qualitaet
                  88. Kein Aufhellen, kein Upscaling, kein Crop — beide Koepfe bleiben
                  vollstaendig (TZ8). Gemessen danach: Luminanz 124.4, R 130.0 / G 118.8
                  / B 124.5. Vor dem Einbau per Read angesehen.

                  Das Quellmotiv laeuft sitewide sonst nur auf der Startseite
                  (src/public/home/content.ts:115).

                  R188 TZ8 (mobiler Crop): Die Datei war vollstaendig, der RAHMEN nicht.
                  Mobil lief hier aspect-[4/5] mit object-center. Nachgerechnet am Bild
                  (Quelle 1500x1000): die beiden Koepfe belegen zusammen x 205..1055,
                  also 850px. Ein 4/5-Fenster ist bei 1000px Hoehe nur 800px breit — 50px
                  zu schmal. Der Kopf der Frau lief darum links aus dem Bild, ihr Zopf war
                  weg und das Gesicht klebte auf der Kante. Wichtig: das war KEIN
                  Positions-Fehler. Bei 800px Fensterbreite rettet KEIN object-position-Wert
                  beide Koepfe, weil das Motiv breiter ist als der Rahmen. Ein X-Wert haette
                  nur ausgesucht, welcher Kopf faellt.

                  Fix ist deshalb das Seitenverhaeltnis, nicht die Position: mobil
                  aspect-square (1000x1000 Fenster). Damit passt die 850px-Spanne mit
                  75px Luft je Seite. object-[26%_center] legt das Fenster auf x=130 —
                  mittig ueber die Koepfe statt mittig ueber die Datei, weil das Paar
                  links der Bildmitte steht. Auf 390px Viewport (Rahmen 358x358) am
                  gerenderten Ausschnitt geprueft: beide Koepfe vollstaendig mit Luft.

                  Ab sm bleibt alles wie gehabt: 4/3 ist 1333px breit, dort liegen beide
                  Koepfe schon bei object-center frei (Luft links 122px, rechts 361px),
                  und ab lg traegt object-cover ohnehin die volle Spaltenhoehe. Der
                  Desktop-Zustand aendert sich durch diesen Fix nicht. */}
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-media)]">
                <img
                  src="/photos/r188-tanzkurse/privatstunden-hell-1500.webp"
                  alt={de ? 'Tanzlehrer fuehrt eine Schuelerin in einer Privatstunde vor der Salsaflow-Wand' : 'Dance teacher leading a student in a private lesson in front of the Salsaflow wall'}
                  className="aspect-square w-full object-cover object-[26%_center] sm:aspect-[4/3] sm:object-center lg:aspect-auto lg:h-full"
                  width={1500}
                  height={1000}
                  loading="lazy"
                />
              </div>
              {/* R208 (Raphael 23.08. 17:14): "'1:1-Coaching, dein Tempo, dein Fokus':
                  Beschreibung komisch." Unter dem Foto standen zwei Schlagzeilen
                  uebereinander ("1:1 Coaching" / "Dein Tempo. Dein Fokus.") — zwei
                  Ueberschriften ohne Aussage, dazu die Trennlinie darueber. Jetzt EINE
                  Bildunterschrift, die sagt, was auf dem Foto passiert. */}
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {de
                  ? 'Privatstunde im Studio: eine Lehrperson für dich allein oder zu zweit, ganz an deinem Thema.'
                  : 'A private lesson in the studio: one teacher for you alone or as a pair, entirely on your topic.'}
              </p>
            </motion.div>
          </Reveal>

          <Reveal className="order-1 max-w-xl lg:order-2">
            {/* R188 TZ2: Kicker «PRIVATSTUNDEN» plus Strich raus. Die H2 sagt
                «Persoenlich schneller weiterkommen», der Absatz nennt die Privatstunde
                beim Namen; das Versal-Label war die dritte Nennung und der Strich Deko. */}
            <motion.h2 variants={item} className={cn(sectionTitle, MEASURE_L)}>
              {pr.title}{pr.titleAccent ? ` ${pr.titleAccent}` : ''}
            </motion.h2>
            <motion.p variants={item} className={cn("max-w-xl text-pretty", sectionLead)}>
              {pr.body}
            </motion.p>
            {/* R208 (Raphael 23.08. 17:14): "'Persoenlich schneller weiterkommen': anders
                machen, nicht cool." Der Block war eine vierzeilige Liste mit Trennlinie
                zwischen jeder Zeile — vier fast leere Zeilen mit je einem Icon-Kreis links
                und drei Wortern rechts, dazu die horizontalen Linien, die Raphael auf
                dieser Seite generell beanstandet.
                Jetzt ein 2x2-Raster ohne Linien: jedes Merkmal steht als eigene kleine
                Flaeche mit Icon darueber. Dieselben vier Inhalte, dieselben vier Icons —
                nur nicht mehr als Zeilenstapel. */}
            <motion.ul variants={item} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pr.points.map((point, i) => {
                const Icon = PRIVAT_ICONS[i] ?? Users;
                return (
                  <li
                    key={point}
                    className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-bg-soft)] p-5"
                  >
                    <Icon aria-hidden className="h-6 w-6 shrink-0 text-[var(--color-salsa)]" strokeWidth={1.75} />
                    <span className="text-base font-semibold leading-snug text-[var(--color-ink)]">{point}</span>
                  </li>
                );
              })}
            </motion.ul>

            {/* R188 TZ5 Runde 2, Raphael-Video 09:12: «Die Sektion komplett weg.»
                Runde 1 hatte die eigene Sektion «Was ein regulaerer Kurs kostet»
                geloescht — hier stand aber weiter eine zweite, vollstaendige
                Preistabelle: vier Zeilen CHF 100 / 450 / 130 / 600 mit Tarif-Labels.
                Am Screenshot nachgewiesen (worklog/shots/R188/after-final2-tanzkurse/
                tanzkurse/d-07.png, Aufnahme 11:46 also NACH Runde 1): der Preisblock
                stand unveraendert auf der Seite. Kundenwort war «komplett weg», nicht
                «eine von zwei Stellen weg».

                Ersatz ist der schlanke Verweis, den der Auftrag nennt: eine Zeile plus
                Textlink auf /preise. Die Zahlen leben dort an EINER Stelle weiter.
                Bewusst KEIN neuer Kicker und kein Deko-Strich (TZ2) — die Zeile haengt
                an derselben Haarlinie, die die Tabelle vorher trug. */}
            {/* R208 (Raphael 23.08. 17:14): "Drei CTAs machen keinen Sinn — reduzieren."
                Hier standen DREI Wege nebeneinander: der Textlink "Preise ansehen", die
                rote Pille "Privatstunde anfragen" und daneben "Schreib uns auf WhatsApp".
                Der Besucher musste zwischen drei gleich lauten Angeboten waehlen.
                Jetzt EIN Hauptweg (Privatstunde anfragen) plus der Preis-Verweis als
                leiser Textlink in derselben Zeile — der Preis ist eine Nebenfrage, kein
                zweites Angebot. WhatsApp ist raus: der Kanal steht sitewide als fixer
                Float-Knopf unten rechts auf jeder Seite, hier war er die dritte Nennung. */}
            <motion.div variants={item} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <PrimaryCta href={SCHNUPPER_HREF}>{de ? 'Privatstunde anfragen' : 'Request a private lesson'}</PrimaryCta>
              <CtaText href="/preise">{de ? 'Preise ansehen' : 'See the prices'}</CtaText>
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
          {/* R188 TZ2: letzter Kicker der Seite («KURSKALENDER») raus — gleiche
              Begruendung wie oben. Damit traegt /tanzkurse keinen einzigen
              Versal-Kicker und keinen roten Strich mehr. */}
          <motion.div variants={item} className="max-w-xl">
            <h2 className={cn(sectionTitle, MEASURE_L)}>
              {cal.title}{cal.titleAccent ? ` ${cal.titleAccent}` : ''}
            </h2>
            <p className={cn("max-w-xl text-pretty", sectionLead)}>{cal.lead}</p>
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
