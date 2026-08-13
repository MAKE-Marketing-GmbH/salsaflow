// Events-&-Workshops-Seite unter /events (Geil-Pass v2 2026-07-07): jetzt komplett HELL,
// Bright-Editorial wie die neue Startseite. Anker sind der helle Hero + der EventsTeaser.
// RAUS: die dunkle Danceflow-Sektion und die drei Rot-auf-Ink-Duotone-Kacheln
// (nie /composites/graphic-world). REIN: helle Sektions-Flaechen (paper-warm / white /
// bg-soft), echte Party-Fotos aus /photos/gallery/danceflow (im Bild duerfen sie dunkel sein),
// 1400px-Shell, ein ruhiger Fade-up-Takt (Reveal / useReveal) und alle Pfeile als Lucide
// (ArrowRight / ArrowDown, KEINE Unicode-Pfeile). Copy + Fakten + alle data-testid bleiben
// unveraendert (Eventfrog-Anbindung, Danceflow-Fakten 1./3./5. Freitag, 5/10 CHF). DE/EN.

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarDays, PartyPopper, Users, type LucideIcon } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter, CONTACT } from '@/public/site/SiteFooter';
import { cn } from '@/lib/utils';
import { Eyebrow, Shell, CtaText, sectionTitle, sectionLead } from '@/public/site/primitives';
import { ClosingInvite, MEASURE_L, HeroFrame } from '@/public/subpage/kit';
import { Reveal, useReveal, EASE_OUT, VIEWPORT, useHydrated } from '@/public/home/motion';
import { EVENTS, EVENTFROG_URL, EVENTFROG_IS_EXTERNAL, type EventFact } from '@/public/events/content';

// Icon-System fuer die drei Anniversary-Highlights (einmal im Jahr -> Workshops & Partys -> Community).
const HIGHLIGHT_ICONS: LucideIcon[] = [CalendarDays, PartyPopper, Users];

// Globaler Conversion-Anker (CONTENT-SPEC): jeder Schnupper-Weg zielt auf /kontakt#schnupperstunde.
const CONTACT_HREF = '/kontakt#schnupperstunde';

export function EventsPage() {
  return (
    <>
      <Seo page="events" />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <EventsHero />
        <DanceflowSection />
        <GallerySection />
        <WorkshopsSection />
        <AnniversarySection />
        <FloweekendSection />
        <TicketsSection />
        <ClosingSection />
      </main>
      {/* Runde 3, Issue 7: EIN Abbinder pro Seite (die Seite hat ihre eigene ClosingSection). */}
      <SiteFooter entryCta={false} />
    </>
  );
}

/* Ruhiger Foto-Fade beim Eintritt (whileInView). Reduced-motion nur Opacity, kein Versatz.
   `data-reveal` erzwingt Sichtbarkeit im statischen Screenshot-Tool. */
function PhotoFade({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  return (
    <motion.div
      data-reveal
      className={className}
      initial={hydrated ? { opacity: 0, y: reduced ? 0 : 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduced ? 0.32 : 0.55, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* Wiederverwendbarer Eventfrog-Ticket-Button. EINE Stelle fuer Ziel + Verhalten:
   neuer Tab, rel=noreferrer, testbares data-testid. Fuehrt zum Ticket-Vorverkauf.
   Bright-Editorial: primary = Rot, Hover invertiert auf Ink; ghost = Ink-Outline auf Weiss.
   Pfeil ist Lucide ArrowRight mit Hover-Slide (kein Unicode-Pfeil mehr). */
function EventfrogCta({
  label,
  variant = 'primary',
}: {
  label: string;
  variant?: 'primary' | 'ghost';
}) {
  // Runde 2, Issue 2: der Glow-Halo (shadow rgba(173,24,39,0.28)) ist raus — er lag auf
  // /events, aber nicht auf /preise (gemessene Glow-Pixel 14396 vs. 1893). Der Zustand
  // wechselt jetzt wie sitewide ueber Farbtiefe (salsa -> salsa-700) plus 1px-Kontur.
  const base =
    'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper-warm)]';
  const styles =
    variant === 'primary'
      ? 'border border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white hover:border-[var(--color-salsa-700)] hover:bg-[var(--color-salsa-700)]'
      : 'border border-[var(--color-ink)]/25 bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white';
  return (
    <a
      href={EVENTFROG_URL}
      // Neuer Tab nur, wenn der Weg wirklich nach draussen fuehrt. Ohne echten Eventfrog-Link
      // zeigt der Knopf auf das eigene Kontaktformular — das gehoert in denselben Tab.
      target={EVENTFROG_IS_EXTERNAL ? '_blank' : undefined}
      rel={EVENTFROG_IS_EXTERNAL ? 'noreferrer' : undefined}
      data-testid="eventfrog-cta"
      className={`${base} ${styles}`}
    >
      {label}
      <ArrowRight
        size={18}
        strokeWidth={2.25}
        aria-hidden
        className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5"
      />
    </a>
  );
}

/* Sekundaerer Scroll-Cue nach unten. Runde 2, Issue 3: das war die dritte Link-Variante
   (schwarzer Fettext ohne Unterstrich) neben Pill und rotem Pfeil-Link. Er laeuft jetzt
   auf Stufe 2 der EINEN Link-Skala (CtaText, down). */
function ScrollDownLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <CtaText href={href} down>
      {children}
    </CtaText>
  );
}

/* ---------------------------------------------------------------------------- Hero (hell) */
function EventsHero() {
  const { lang } = useLang();
  const h = EVENTS[lang].hero;
  const facts: [string, string][] =
    lang === 'de'
      ? [
          ['1. 3. 5.', 'Freitag im Monat'],
          ['DJs', 'von Salsaflow'],
          ['Basel SBB', 'direkt am Bahnhof'],
        ]
      : [
          ['1st 3rd 5th', 'Friday each month'],
          ['DJs', 'by Salsaflow'],
          ['Basel SBB', 'right by the station'],
        ];
  /* Design-Kritik Runde 2, Issue 1: auch dieser Hero war eine eigene Kopie der Einheits-
     Bauform (Text links / gerahmtes Foto rechts / drei rote Zahlen). Er laeuft jetzt ueber
     HeroFrame mit Achse 'wide' — die H1 steht ueber die volle Shell, und das Eventfoto
     folgt darunter als full-bleed Band bis an beide Viewport-Kanten. Das ist die im
     Kritik-Fix genannte Loesung ("Events: Headline ueber dem Foto-Grid") und zugleich der
     klare Abstand zum Home-Hero, der als einziger Text AUF dem Bild traegt. */
  return (
    <HeroFrame
      axis="wide"
      title={
        <>
          {h.titleA} {h.titleAccent}
          {h.titleB ? <> {h.titleB}</> : null}
        </>
      }
      lead={h.lead}
      facts={facts}
      media={{
        src: '/photos/party/party-52.webp',
        alt:
          lang === 'de'
            ? 'Tanzteam auf der Danceflow Night, alle Köpfe sichtbar'
            : 'Dance team at the Danceflow Night, all heads visible',
        position: 'center 28%',
        heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[12rem]',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <EventfrogCta label={h.ctaTickets} />
        <ScrollDownLink href="#danceflow">{h.ctaScroll}</ScrollDownLink>
      </div>
    </HeroFrame>
  );
}

/* ---------------------------------------------------------------------------- Danceflow Nights (jetzt HELL, echte Fotos)
   Kein Duoton mehr, keine dunkle Flaeche: Sektion hell, links eine Komposition aus echten
   Party-Fotos (im Bild dunkel erlaubt), rechts Eyebrow + Headline + Body + klare Info-Bloecke
   (Wann / Was / Wo / Fuer wen / Eintritt) + Ticket-CTA. Bright-Editorial wie der EventsTeaser. */
function DanceflowSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const d = EVENTS[lang].danceflow;
  return (
    // Kritik Runde 2: pro Seite EIN Hoehepunkt mit der grossen Abstandsstufe — auf /events
    // ist das laut Kritik die Danceflow Night. Alle anderen Sektionen laufen auf der Standardstufe.
    <section id="danceflow" className="scroll-mt-24 bg-white py-16 lg:py-[6.25rem]">
      <Shell className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* LINKS: Foto-Komposition aus echten Danceflow-Fotos. Ein grosses Gruppen-Foto oben,
            darunter zwei echte Tanz-Momente. Ersetzt die drei entfernten Duotone-Kacheln. */}
        <PhotoFade className="order-1">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <figure className="col-span-2 overflow-hidden rounded-[var(--radius-media)] ring-1 ring-black/5 shadow-[0_24px_60px_-28px_rgba(17,17,17,0.5)]">
              <img
                src="/photos/gallery/danceflow/02-v3.webp"
                alt="Volle Tanzfläche bei einer Danceflow Night, viele lachende Gäste"
                className="aspect-[16/10] w-full object-cover object-[center_35%]"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
            <figure className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)]">
              <img
                src="/photos/gallery/danceflow/01-v3.webp"
                alt="Frau tanzt lachend mit ausgestreckten Armen auf einer Danceflow Night"
                className="aspect-[4/3] w-full object-cover object-[center_22%]"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
            <figure className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)]">
              <img
                src="/photos/gallery/danceflow/03-v3.webp"
                alt="Paar tanzt dicht zusammen auf der Tanzfläche"
                className="aspect-[4/3] w-full object-cover object-[center_30%]"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </figure>
          </div>
        </PhotoFade>

        {/* RECHTS: Text + Fakten + Ticket-CTA. */}
        <Reveal className="order-2 max-w-xl">
          <motion.div variants={item}>
            <Eyebrow>{d.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
            {d.title}
          </motion.h2>
          <motion.p variants={item} className={cn("mt-5 max-w-xl text-pretty", sectionLead)}>
            {d.body}
          </motion.p>

          {/* Klare Info-Bloecke (Wann / Was / Wo / Fuer wen / Eintritt) aus content.ts. */}
          <motion.p
            variants={item}
            className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]"
          >
            {d.factsTitle}
          </motion.p>
          <motion.dl variants={item} className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {d.facts.map((fact: EventFact) => (
              <div key={fact.label} className="border-t border-[var(--color-line)] pt-3">
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-salsa)]">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]">{fact.value}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={item} className="mt-8">
            <EventfrogCta label={d.ctaTickets} />
          </motion.div>
          <motion.p
            variants={item}
            className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]"
          >
            {d.note}
          </motion.p>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Foto-Galerie (echte Party-Fotos)
   Erfuellt "gallery of real party photos": statisches, responsives Raster aus echten Danceflow-
   Fotos (kein Duoton, kein Filter). Keine neue Dauer-Schleife (die EINE Marquee lebt auf der Home). */
function GallerySection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const g = EVENTS[lang].gallery;
  const photos: [string, string, string, number, number][] =
    lang === 'de'
      ? [
          ['/photos/party/party-06-v3.webp', 'Frau im roten Top tanzt mit ihrem Partner', 'object-[center_35%]', 2048, 1360],
          ['/photos/party/party-17-v3.webp', 'Zwei Frauen tanzen zusammen und lachen', 'object-[center_25%]', 2048, 1360],
          ['/photos/gallery/danceflow/10-v3.webp', 'Paar dreht sich auf der Tanzfläche im grünen Licht', 'object-[center_38%]', 2048, 1360],
          ['/photos/gallery/danceflow/05-v3.webp', 'Frau tanzt frei mit fliegenden Haaren', 'object-[center_28%]', 1360, 2048],
        ]
      : [
          ['/photos/party/party-06-v3.webp', 'Woman in a red top dancing with her partner', 'object-[center_35%]', 2048, 1360],
          ['/photos/party/party-17-v3.webp', 'Two women dancing together and laughing', 'object-[center_25%]', 2048, 1360],
          ['/photos/gallery/danceflow/10-v3.webp', 'Couple turning on the dance floor in green light', 'object-[center_38%]', 2048, 1360],
          ['/photos/gallery/danceflow/05-v3.webp', 'Woman dancing freely with her hair flying', 'object-[center_28%]', 1360, 2048],
        ];
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-xl">
          <motion.div variants={item}>
            <Eyebrow>{g.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
            {g.title}
          </motion.h2>
          <motion.p variants={item} className={cn("mt-4 max-w-xl text-pretty", sectionLead)}>
            {g.lead}
          </motion.p>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" stagger={0.09}>
          {photos.map(([src, alt, pos, width, height]) => (
            <motion.figure
              key={src}
              variants={item}
              className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)]"
            >
              <img
                src={src}
                alt={alt}
                className={`aspect-[4/5] w-full object-cover ${pos}`}
                width={width}
                height={height}
                loading="lazy"
              />
            </motion.figure>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Workshops vor der Night */
function WorkshopsSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const w = EVENTS[lang].workshops;
  const flowSteps =
    lang === 'de'
      ? [
          ['Früher ankommen', 'Komm vor der Night etwas früher vorbei.'],
          ['Locker lernen', 'Ein Thema, klar erklärt und direkt tanzbar.'],
          ['Direkt anwenden', 'Danach geht es auf die Tanzfläche.'],
        ]
      : [
          ['Arrive early', 'Come a bit before the night starts.'],
          ['Learn lightly', 'One topic, clearly explained and easy to dance.'],
          ['Use it right away', 'Then take it straight to the dance floor.'],
        ];
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_55px_rgba(17,17,17,0.07)] lg:grid-cols-[1.08fr_0.92fr]">
          <Reveal className="p-7 sm:p-9 lg:p-12">
            <motion.div variants={item}>
              <Eyebrow>{w.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {w.title}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 max-w-2xl ${sectionLead}`}>
              {w.body}
            </motion.p>

            <motion.div variants={item} className="mt-8 grid gap-3 sm:grid-cols-2">
              {w.points.map((point: string, i: number) => (
                <div
                  key={point}
                  className="rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-4"
                >
                  <span className="font-display text-sm font-bold tabular-nums text-[var(--color-salsa)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">{point}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <EventfrogCta
                label={lang === 'de' ? 'Workshops ansehen' : 'See workshops'}
                variant="ghost"
              />
              <ScrollDownLink href="#tickets">
                {lang === 'de' ? 'Zum Kalender' : 'To the calendar'}
              </ScrollDownLink>
            </motion.div>
          </Reveal>

          <div className="relative min-h-[31rem] overflow-hidden bg-[var(--color-ink)] lg:min-h-0">
            <img
              src="/photos/gallery/danceflow/12-v3.webp"
              alt={
                lang === 'de'
                  ? 'Frau tanzt bei Partylicht auf einer Danceflow Night'
                  : 'Woman dancing in party light at a Danceflow Night'
              }
              // Gleiche Kopplung wie in TicketsSection (Runde 2, Issue 4): das Bild liegt
              // absolut und bestimmt die Zeilenhoehe nicht mehr mit. Die Kritik verlangt
              // die Pruefung ausdruecklich fuer ALLE Split-Cards, nicht nur die eine.
              className="absolute inset-0 h-full w-full object-cover object-[center_42%] opacity-95"
              width={2048}
              height={1360}
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/82 via-[var(--color-ink)]/18 to-transparent"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-[var(--radius-media)] border border-white/15 bg-[var(--color-ink)]/88 p-5 text-white shadow-2xl backdrop-blur sm:left-6 sm:right-auto sm:max-w-[22rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
                {lang === 'de' ? 'Ablauf' : 'Flow'}
              </p>
              <div className="mt-4 grid gap-3">
                {flowSteps.map(([title, body]) => (
                  <div key={title} className="grid grid-cols-[0.65rem_1fr] gap-3">
                    <span aria-hidden className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--color-salsa)]" />
                    <span>
                      <span className="block font-display text-xl font-bold leading-tight">{title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/85">{body}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Anniversary Weekend */
function AnniversarySection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const a = EVENTS[lang].anniversary;
  const highlights =
    lang === 'de'
      ? [
          ['Einmal im Jahr', 'Ein ganzes Wochenende für Salsaflow.'],
          ['Workshops & Partys', 'Lernen, feiern und spät weiter tanzen.'],
          ['Community', 'Viele bekannte Gesichter an einem Ort.'],
        ]
      : [
          ['Once a year', 'A full weekend for Salsaflow.'],
          ['Workshops & parties', 'Learn, celebrate and keep dancing.'],
          ['Community', 'Many familiar faces in one place.'],
        ];
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <PhotoFade className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_55px_rgba(17,17,17,0.08)]">
            <img
              src="/photos/events/event-05-v4.webp"
              alt="Frau in Rot beim Dreh, lacht in die Kamera"
              className="aspect-[4/5] w-full object-cover sm:aspect-[4/3]"
              width={2048}
              height={1360}
              loading="lazy"
            />
            {/* Sitewide Warm-Soft-Light: editoriales Marken-Foto in die warme Bild-Welt. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/68 via-transparent to-transparent"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-[var(--radius-media)] border border-white/15 bg-[var(--color-ink)]/88 p-5 text-white shadow-2xl backdrop-blur sm:right-auto sm:max-w-[21rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">{a.eyebrow}</p>
              <p className="mt-2 font-display text-2xl font-bold leading-tight">
                {lang === 'de'
                  ? 'Das Wochenende für die ganze Community.'
                  : 'The weekend for the whole community.'}
              </p>
            </div>
          </div>
        </PhotoFade>

        <Reveal className="order-1 max-w-xl lg:order-2">
          <motion.h2 variants={item} className={cn(sectionTitle, MEASURE_L)}>
            {a.title}
          </motion.h2>
          <motion.p variants={item} className={cn("mt-4 max-w-xl text-pretty", sectionLead)}>
            {a.body}
          </motion.p>

          {/* Offene, typografisch gefuehrte Highlight-Liste (Lucide-Icons), keine schweren Cards. */}
          <motion.ul
            variants={item}
            className="mt-9 divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]"
          >
            {highlights.map(([title, body], i) => {
              const Icon = HIGHLIGHT_ICONS[i] ?? CalendarDays;
              return (
                <li key={title} className="grid grid-cols-[1.75rem_1fr] items-start gap-4 py-5">
                  <Icon
                    aria-hidden
                    className="mt-1 h-[1.15rem] w-[1.15rem] text-[var(--color-salsa)]"
                    strokeWidth={1.75}
                  />
                  <span>
                    <span className="block font-display text-lg font-bold leading-tight text-[var(--color-ink)]">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {body}
                    </span>
                  </span>
                </li>
              );
            })}
          </motion.ul>

          <motion.div variants={item} className="mt-8">
            <EventfrogCta
              label={lang === 'de' ? 'Anniversary ansehen' : 'See the anniversary'}
              variant="ghost"
            />
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Floweekend */
function FloweekendSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const f = EVENTS[lang].floweekend;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="max-w-xl">
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <Eyebrow>{f.eyebrow}</Eyebrow>
            <span className="rounded-full bg-[var(--color-salsa-50)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-salsa)]">
              {f.badge}
            </span>
          </motion.div>
          <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
            {f.title}
          </motion.h2>
          <motion.p variants={item} className={cn("mt-4 max-w-xl text-pretty", sectionLead)}>
            {f.body}
          </motion.p>
          <motion.div variants={item} className="mt-8">
            <EventfrogCta label={f.ctaTickets} variant="ghost" />
          </motion.div>
        </Reveal>
        <PhotoFade>
          <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.08)]">
            <img
              src="/photos/events/event-06-v3.webp"
              alt="Lachendes Social-Dancing-Paar, mehrere Paare im Hintergrund"
              className="aspect-[4/3] w-full object-cover object-[center_42%]"
              width={2048}
              height={1360}
              loading="lazy"
            />
            {/* Sitewide Warm-Soft-Light: editoriales Marken-Foto in die warme Bild-Welt.
                Kein Text-Overlay: die Headline steht schon in der Textspalte (kein Doppel). */}
          </div>
        </PhotoFade>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Tickets: Eventfrog-Hub */
function TicketsSection() {
  const { lang } = useLang();
  const { item } = useReveal();
  const t = EVENTS[lang].tickets;
  const calendarItems =
    lang === 'de'
      ? [
          ['Danceflow Nights', '1., 3. und 5. Freitag'],
          ['Workshops', 'oft direkt vor der Night'],
          ['Weekends', 'Anniversary und Floweekend'],
        ]
      : [
          ['Danceflow Nights', '1st, 3rd and 5th Friday'],
          ['Workshops', 'often right before the night'],
          ['Weekends', 'Anniversary and Floweekend'],
        ];
  return (
    <section id="tickets" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)] lg:grid-cols-[1.03fr_0.97fr]">
          <Reveal className="p-7 sm:p-9 lg:p-12">
            <motion.div variants={item}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {t.title}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 max-w-xl ${sectionLead}`}>
              {t.body}
            </motion.p>

            <motion.div variants={item} className="mt-8 grid gap-3">
              {calendarItems.map(([title, body], i) => (
                <div
                  key={title}
                  className="grid grid-cols-[3.25rem_1fr] items-center gap-4 rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-white font-display text-xl font-bold tabular-nums text-[var(--color-salsa)] shadow-sm">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-bold leading-tight text-[var(--color-ink)]">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {body}
                    </span>
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <EventfrogCta label={t.cta} />
              <ScrollDownLink href="#danceflow">
                {lang === 'de' ? 'Danceflow ansehen' : 'See Danceflow'}
              </ScrollDownLink>
            </motion.div>
          </Reveal>

          {/* Design-Kritik Runde 2, Issue 4 ("~530px leeres Weiss in der linken Spalte",
              Beleg /tmp/slices/z_events_card2.jpg).

              ROOT CAUSE, nicht Symptom: das Foto stand im normalen Fluss der Grid-Zelle.
              `h-full` loest gegen eine Elternhoehe auf, die selbst noch `auto` ist — der
              Browser faellt deshalb auf das intrinsische Seitenverhaeltnis zurueck und
              rechnet die Hoehe AUS DER BREITE. Nachgerechnet auf 1440px:
                Shell 1400 - 2x32 Padding = 1336px, Spalte 0.97/(1.03+0.97) = 648px
                648 x 2048/1360 (Hochformat!) = 976px Bildhoehe
              Die Bildspalte hat damit die Zeilenhoehe auf 976px gezogen, waehrend der Text
              links nur rund 600px trug. Das Weiss war kein Spacing-Fehler, sondern die
              Aspect-Ratio eines Hochformat-Fotos in einer breiten Spalte.

              Fix: das Bild wird absolut positioniert. Damit traegt es NICHTS mehr zur
              intrinsischen Zeilenhoehe bei — die Hoehe kommt jetzt vom Text, und das Foto
              fuellt per object-fit:cover exakt diese Hoehe. Genau die im Fix geforderte
              Kopplung "Bildspalte an die Texthoehe" statt umgekehrt. `min-h` bleibt fuer
              Mobil, wo die Spalten untereinander stehen und es keine Nachbarhoehe gibt. */}
          <div className="relative min-h-[25rem] overflow-hidden bg-[var(--color-ink)] lg:min-h-0">
            <img
              src="/photos/gallery/danceflow/11-v3.webp"
              alt={
                lang === 'de'
                  ? 'Social Dancing an einer Danceflow Night'
                  : 'Social dancing at a Danceflow Night'
              }
              // Kritiker final-2, Issue 6: Koepfe an der Frame-Oberkante angeknappt.
              // Nachgerechnet an der Datei (1360x2048) im gerenderten Rahmen (~640x690):
              // skaliert 640x964, es fallen 274px Hoehe weg. Bei 42% lagen 115px davon oben —
              // genau die Zone, in der der Kopf des Mannes sitzt, seine Schaedeldecke wurde
              // abgeschnitten. Bei 25% sind es 68px oben: beide Koepfe stehen vollstaendig im
              // Bild, weggeschnitten wird unten (Beine), wo ohnehin die Textkarte liegt.
              className="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-90"
              width={1360}
              height={2048}
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/78 via-[var(--color-ink)]/20 to-transparent"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-[var(--radius-media)] border border-white/15 bg-[var(--color-ink)]/88 p-5 text-white shadow-2xl backdrop-blur sm:left-6 sm:right-auto sm:max-w-[21rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
                {lang === 'de' ? 'Kalender zuerst' : 'Calendar first'}
              </p>
              <p className="mt-2 font-display text-2xl font-bold leading-tight">
                {lang === 'de'
                  ? 'Such dir den Abend aus, der zu dir passt.'
                  : 'Pick the evening that fits you.'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                {lang === 'de'
                  ? 'Eventfrog zeigt dir Tickets, Zeiten und den aktuellen Plan.'
                  : 'Eventfrog shows tickets, times and the current plan.'}
              </p>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Closing (jetzt HELL)
   Kein dunkles Fullbleed mehr: heller Editorial-Split. Links Headline (ein Akzentwort) + Body +
   CTA-Paar (Instagram-Rot + Schreib-uns-Ghost mit Lucide-Pfeil), rechts ein echtes Party-Foto. */
function ClosingSection() {
  const { lang } = useLang();
  const c = EVENTS[lang].closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  // Die Split-Card mit Foto war eines der vier Muster; das Foto ist raus, weil /events
  // direkt darueber schon ein Fotoraster hat und der Abbinder sonst dritte Bildebene waere.
  return (
    <ClosingInvite
      title={c.title}
      body={c.body}
      ctaLabel={c.cta}
      ctaHref={CONTACT.instagram}
      secondary={{ label: c.secondary, href: CONTACT_HREF }}
    />
  );
}
