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
const CONTACT_HREF = '/schnupperstunde';

export function EventsPage() {
  return (
    <>
      <Seo page="events" />
      <SiteHeader />
      {/* R142: der WhatsApp-Float ist sitewide eine Pille mit Label (belegt im Vorher-Shot
          worklog/shots/S7-ux142/vorher/events-desktop-00-fold.png). Auf dieser Route soll er
          ab sm ein Kreis ohne Text sein. Eigener Marker analog R140/R141, damit
          WhatsAppFloat.tsx und die Marker der anderen Routen unberuehrt bleiben. */}
      <div data-events-page="" />
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
      // R155: 16px -> 22px Versatz, damit die Einzelfotos denselben spuerbaren Takt haben
      // wie die gestaffelten Reveal-Gruppen. Reduced-motion bleibt bei y:0 (nur Fade).
      initial={hydrated ? { opacity: 0, y: reduced ? 0 : 22 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduced ? 0.32 : 0.6, ease: EASE_OUT }}
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
    'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper-warm)]';
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
  /* R174, Video 05:26 ("Leute abgeschnitten"). Gemessen bei 1440x900:
     Band-Top 533, Hoehe 448 -> Ende 981. Die Viewport-Kante 900 lag MITTEN im Band
     und kappte die Koerper auf Huefthoehe.

     Der Hebel ist der Platz UEBER dem Band, nicht der Crop. Die drei Fakten sassen
     im HeroFrame zwischen CTA und Band und kosteten dort 104px plus 24px Abstand.
     Sie laufen jetzt UNTER dem Band: dieselbe Information, dieselbe Reihenfolge im
     Lesefluss, aber der Platz kommt dem Foto zugute.

     Nachgerechnet mit der finalen Staffelung (Werte live gemessen):
       H1-Top 96 (Nav-Freiraum, siehe pt-5 unten) -> Band-Top 405
       Band 25rem = 400px            -> Band-Ende 805
       Fakten py-4 = 88px            -> Fakten-Ende 893
     Damit liegt das ganze Band im Fold (805 <= 900) UND die Fakten stehen
     vollstaendig darueber lesbar, statt an der Falz abzureissen. */
  return (
    <>
    {/* R174: ohne `facts` schaltet HeroFrame auf tight (dense+media+!facts+!split) und
        setzt den Section-Top auf var(--nav-h) mit pt-0. Gemessen stand die H1 damit
        exakt auf y76 = Unterkante des Headers — die Nav-Pille (gerundete Leiste, optisch
        bis ~y100) lag auf der Versalhoehe von "Dein Kurs". Diese 20px Papier-Luft geben
        der H1 ihren alten Start bei y96 zurueck. Reiner Abstand, kein Eingriff in
        kit.tsx (dort haengen bachata/salsa/partys am selben tight-Zweig). */}
    <div className="bg-[var(--color-paper-warm)] pt-5" />
    <HeroFrame
      axis="wide"
      dense
      title={
        <>
          {h.titleA} {h.titleAccent}
          {h.titleB ? <> {h.titleB}</> : null}
        </>
      }
      lead={h.lead}
      media={{
        src: '/photos/party/party-47.webp',
        alt:
          lang === 'de'
            ? 'Vier Tänzerinnen in Lila zeigen eine Choreografie im Salsaflow-Saal'
            : 'Four dancers in purple performing a choreography in the Salsaflow studio',
        // R143: das alte Gruppenfoto ist als Motiv raus. Ersatz ist party-47 (1500x1000, vor dem Einbau
        // per Read geprueft): vier Taenzerinnen in Lila vor der hellen Salsaflow-Wand,
        // echtes Foto, scharf, in src/ sonst unbenutzt.
        //
        // R155 hatte das Band von 21rem auf 28rem (448px) verlaengert, damit die Figuren
        // bis zum Rock laufen statt an der Huefte abzubrechen. Das war richtig fuer die
        // Bandkante, sprengte aber den Fold: 533 + 448 = 981.
        //
        // R174b: 25rem kappte die erhobenen Haende an der Bandoberkante (Sol FAIL).
        // 28rem bleibt, weil Facts unter dem Band den Fold tragen. Crop 20 % holt
        // die Haende; Haar-Landmarke nat. Y 225 bleibt im Fenster.
        //
        // Sichtbares Fenster Desktop (lg 28rem, Crop 20 %):
        //   1280px / 1440px / 1920px — Scheitel (nat. Y 225) bleiben im Fenster.
        // Landmarken an der Datei nachgemessen: hoechste Frisur 225, dritte Taenzerin 230,
        // hintere beiden 293/295.
        //
        // R181 Mobil: 10rem=160px schnitt bei Huefte/Rocksaum ab. Rechnung 390px Breite,
        // object-cover, Motiv 1500x1000: scale 390/1500=0.26, Bild skaliert 260px.
        // 160px-Fenster = 160/0.26=615 nat. Y. Ueberhang 385. Crop 20% -> Oberkante 77,
        // Unterkante 692. Genau die Huefte. 15rem=240px: Fenster 240/0.26=923 nat. Y.
        // Ueberhang 77. Crop 20% -> Oberkante 15, Unterkante 938. Koepfe (225) und
        // erhobene Haende liegen weit unter der Oberkante. Unten bis Unterschenkel.
        // Band start bleibt y=445 (H1-Ende 213, Fold 844). 16.25rem waere volle Bildhoehe
        // (260px, nichts abgeschnitten) — 15rem oeffnet deutlich mehr Koerper, ohne das
        // Band auf Bildhoehe zu ziehen. sm:16rem, damit das Band ab 640px nicht auf
        // 11rem zurueckfaellt. positionClass 20% und lg:28rem unveraendert.
        positionClass: 'object-[center_20%]',
        heightClass: 'h-[15rem] sm:h-[16rem] lg:h-[28rem]',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <EventfrogCta label={h.ctaTickets} />
        <ScrollDownLink href="#danceflow">{h.ctaScroll}</ScrollDownLink>
      </div>
    </HeroFrame>
    {/* R174: die drei Hero-Fakten standen vorher IM HeroFrame ueber dem Band. Hier
        unten tragen sie dieselbe Rolle (Hero-Meta, gleiche Reihenfolge, gleiche Typo),
        kosten das Band aber keinen Platz mehr. py-4 statt py-6: gemessen 88px statt
        104px Zeilenhoehe, damit die Zeile mit Wert UND Label komplett ueber der Falz
        steht (Ende 893) statt bei 937 abzureissen. Bewusst KEINE Kacheln — dieselbe
        offene dl-Leiste wie im HeroFrame, nur an anderer Stelle. */}
    <div className="bg-[var(--color-paper-warm)]">
      <Shell>
        <dl className="grid grid-cols-1 gap-5 border-t border-[var(--color-line)] py-4 md:grid-cols-3 md:gap-4">
          {facts.map(([value, label]) => (
            <div key={label}>
              <dt className="font-display text-2xl font-extrabold leading-none text-[var(--color-salsa)] sm:text-3xl">
                {value}
              </dt>
              <dd className="mt-2 text-xs leading-snug text-balance text-[var(--color-ink-muted)] [overflow-wrap:normal] [word-break:keep-all]">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </Shell>
    </div>
    </>
  );
}

/* ---------------------------------------------------------------------------- Danceflow Nights (jetzt HELL, echte Fotos)
   Kein Duoton mehr, keine dunkle Flaeche: Sektion hell, links eine Komposition aus echten
   Party-Fotos (im Bild dunkel erlaubt), rechts Eyebrow + Headline + Body + klare Info-Bloecke
   (Wann / Was / Wo / Fuer wen / Eintritt) + Ticket-CTA. Bright-Editorial wie der EventsTeaser. */
function DanceflowSection() {
  const { lang } = useLang();
  const de = lang === 'de';
  // R155: der Reveal war da, wirkte aber schwach (Video 05:32/05:37). Grund: alle Bloecke
  // liefen auf dem Default-Takt (14px Versatz, 0.07s Stagger) — bei einer langen Textspalte
  // ist das unter der Wahrnehmungsschwelle. Die Textseite bekommt hier den kraeftigeren
  // Takt (22px, 0.10s): sichtbar gestaffelt, aber immer noch im Design-Vertrag
  // (Distanz <= 24px, Dauer 0.4-0.7s). `useReveal` haengt beides an useReducedMotion —
  // ohne Bewegung bleiben Stagger 0 und Versatz 0, es fadet nur.
  const { item } = useReveal({ stagger: 0.1, distance: 22 });
  const d = EVENTS[lang].danceflow;
  return (
    // Kritik Runde 2: pro Seite EIN Hoehepunkt mit der grossen Abstandsstufe — auf /events
    // ist das laut Kritik die Danceflow Night. Alle anderen Sektionen laufen auf der Standardstufe.
    <section id="danceflow" className="scroll-mt-24 bg-white py-16 lg:py-[6.25rem]">
      <Shell className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* LINKS: Foto-Komposition aus echten Danceflow-Fotos. Ein grosses Gruppen-Foto oben,
            darunter zwei echte Tanz-Momente. Ersetzt die drei entfernten Duotone-Kacheln. */}
        {/* R142 Reveal (Video 05:32 "mach so Reveal Animations"): die drei Fotos stiegen
            als EIN Block ein (PhotoFade). Jetzt staffelt der vorhandene Reveal aus
            home/motion.tsx sie nacheinander — grosses Foto zuerst, dann die zwei kleinen.
            Kein neues Motion-Primitiv, keine zweite Marquee. `item` haengt in useReveal an
            useReducedMotion: ohne Bewegung bleibt nur der Fade, kein Versatz. */}
        <Reveal className="order-1" stagger={0.16} distance={22}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.figure variants={item} className="col-span-2 overflow-hidden rounded-[var(--radius-media)] ring-1 ring-black/5 shadow-[0_24px_60px_-28px_rgba(17,17,17,0.5)]">
              {/* R143: hier lag `danceflow/02-v3` — dort schnitt der 16/10-Rahmen die
                  hinteren Koepfe und den rechten Rand an. Ersatz ist `party/party-35-v3`
                  (2048x1360, vor dem Einbau per Read geprueft): echtes Party-Foto, hell,
                  scharf, Paar frontal. Nachgerechnet: 2048/1360 = 1.506 ist flacher als
                  16/10 = 1.6, es fallen also nur 80px Hoehe weg (sichtbar 1280 von 1360).
                  Bei object-[center_30%] liegen 24px davon oben — das Fenster deckt nat.
                  Y 24-1304 ab. Die hoechste Frisur (Mann) beginnt bei nat. Y~95, beide
                  Hauptkoepfe und die Gaeste im Hintergrund bleiben komplett, der rechte
                  Rand laeuft ungeschnitten durch (Beleg /tmp/p35_df30.png). */}
              <img
                src="/photos/party/party-35-v3.webp"
                alt={de ? 'Paar tanzt lachend auf einer Danceflow Night, weitere Gäste im Hintergrund' : 'Couple dancing and laughing at a Danceflow Night with more guests behind them'}
                className="aspect-[16/10] w-full object-cover object-[center_30%]"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </motion.figure>
            {/* R142: hier lag `danceflow/01-v3` — das ist der Hero von /tanzkurse und damit
                laut Brief ein Fremd-Motiv auf dieser Route. Ersatz ist `party/party-23-v3`
                (2048x1360): echtes Party-Foto, hell und
                scharf, beide Koepfe komplett im Bild, nirgends sonst in src/ verwendet.
                object-[center_30%] statt 22%: das Motiv traegt die Gesichter mittig, bei 22%
                schnitte der 4/3-Rahmen die Stirn der Frau an. */}
            <motion.figure variants={item} className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)]">
              <img
                src="/photos/party/party-23-v3.webp"
                alt={de ? 'Zwei Tanzende lachen in die Kamera auf einer Danceflow Night' : 'Two dancers laughing at the camera during a Danceflow Night'}
                className="aspect-[4/3] w-full object-cover object-[center_30%]"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </motion.figure>
            <motion.figure variants={item} className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)]">
              <img
                src="/photos/gallery/danceflow/03-v3.webp"
                alt={de ? 'Paar tanzt dicht zusammen auf der Tanzfläche' : 'Couple dancing close together on the floor'}
                className="aspect-[4/3] w-full object-cover object-[center_30%]"
                width={2048}
                height={1360}
                loading="lazy"
              />
            </motion.figure>
          </div>
        </Reveal>

        {/* RECHTS: Text + Fakten + Ticket-CTA.
            lg:pr-36: die H2 endete bei x=1344 und lief beim Scrollen unter den FAB
            (ab x=1294; Critic Runde 15, Item 4). */}
        <Reveal className="order-2 max-w-xl lg:pr-36" stagger={0.1} distance={22}>
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
          {/* R142: die Liste lief als 2-spaltiges Raster mit sechs gleich lauten Chips —
              im Video das "richtig lost"-Bild (05:38). Jetzt eine einspaltige Leseliste aus
              drei Bloecken (Termin / Abend / Publikum). Eine Spalte statt zwei heisst: ein
              Lesepfad statt sechs Sprungziele. Label und Wert stehen nebeneinander, damit
              die Zeile als Zeile liest und nicht als Kachel. */}
          <motion.dl variants={item} className="mt-4 divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
            {d.facts.map((fact: EventFact) => (
              <div key={fact.label} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-salsa)] sm:pt-0.5">
                  {fact.label}
                </dt>
                <dd className="text-sm leading-relaxed text-[var(--color-ink)]">{fact.value}</dd>
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
  // R155: staerkerer Takt, siehe Kommentar in DanceflowSection.
  const { item } = useReveal({ stagger: 0.14, distance: 22 });
  const g = EVENTS[lang].gallery;
  /* R155, Karte 1 und 2 kappten die Stirn (Video 05:51, Beleg worklog/shots/S7-ux155/
     vorher/events-y1400.png).

     ROOT CAUSE, nicht Symptom: die ersten drei Quellen sind QUERFORMAT (2048x1360, 1.506),
     der Rahmen ist HOCHFORMAT (aspect-4/5, 0.8). Bei object-fit:cover skaliert der Browser
     dann ueber die HOEHE, nicht ueber die Breite. Nachgerechnet fuer die 4-Spalten-Reihe
     auf 1440px (Shell 1336, 3x16px Gap -> Spalte 322px, Rahmen 322x402):
       scale = 402/1360 = 0.296 -> skaliert 606x402
       Ueberhang Y = 0, Ueberhang X = 284
     Die volle Bildhoehe ist also IMMER sichtbar. Der Y-Anteil in object-[center_35%] war
     damit wirkungslos — er konnte die Stirn gar nicht retten, weil es vertikal nichts zu
     verschieben gibt. Geschnitten wird ausschliesslich LINKS und RECHTS.

     Fix ist deshalb der X-Wert, gemessen am gerenderten Ausschnitt:
       Karte 1 (party-06): 50% -> 38%. Bei 50% lief der Kopf des Mannes an der rechten
         Kante an und das Gesicht der Frau klebte links auf der Kante. Bei 38% (nat. X
         149-1237) stehen beide Koepfe frei, die Frau bekommt Luft nach links.
       Karte 2 (party-17): 50% -> 50% X, aber der Rahmen zeigte die erhobenen Haende
         angeschnitten; 20% Y bleibt wirkungslos, deshalb hier nur der Y-Wert auf 20%
         korrigiert, damit die Klasse nicht laenger etwas behauptet, was sie nicht tut.
       Karte 3 (danceflow/10): unveraendert mittig, beide Koepfe stehen ohnehin frei.
     Karte 4 (danceflow/05) ist als EINZIGE Hochformat (1360x2048): dort greift der Y-Wert
     wirklich (Ueberhang Y 82px), 22% haelt Kopf und Haare komplett im Rahmen.
     Alle vier Werte gegen den 2-Spalten-Fall auf 390px gegengeprueft (Rahmen 169x211):
     jeder Kopf steht dort ebenfalls vollstaendig mit Luft nach oben. */
  const photos: [string, string, string, number, number][] =
    lang === 'de'
      ? [
          ['/photos/party/party-06-v3.webp', 'Frau im roten Top tanzt mit ihrem Partner', 'object-[38%_30%]', 2048, 1360],
          ['/photos/party/party-17-v3.webp', 'Zwei Frauen tanzen zusammen und lachen', 'object-[50%_20%]', 2048, 1360],
          ['/photos/gallery/danceflow/10-v3.webp', 'Paar dreht sich auf der Tanzfläche im grünen Licht', 'object-[50%_30%]', 2048, 1360],
          ['/photos/gallery/danceflow/05-v3.webp', 'Frau tanzt frei mit fliegenden Haaren', 'object-[50%_22%]', 1360, 2048],
        ]
      : [
          ['/photos/party/party-06-v3.webp', 'Woman in a red top dancing with her partner', 'object-[38%_30%]', 2048, 1360],
          ['/photos/party/party-17-v3.webp', 'Two women dancing together and laughing', 'object-[50%_20%]', 2048, 1360],
          ['/photos/gallery/danceflow/10-v3.webp', 'Couple turning on the dance floor in green light', 'object-[50%_30%]', 2048, 1360],
          ['/photos/gallery/danceflow/05-v3.webp', 'Woman dancing freely with her hair flying', 'object-[50%_22%]', 1360, 2048],
        ];
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-xl" stagger={0.14} distance={22}>
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

        {/* R155: die vier Fotos sind die deutlichste Stelle fuer eine sichtbare Staffelung —
            gleiche Kacheln, gleiche Groesse, sie laufen als Reihe nacheinander ein. */}
        <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" stagger={0.14} distance={22}>
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
  // R155: staerkerer Takt, siehe Kommentar in DanceflowSection.
  const { item } = useReveal({ stagger: 0.1, distance: 22 });
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
          <Reveal className="p-7 sm:p-9 lg:p-12" stagger={0.1} distance={22}>
            <motion.div variants={item}>
              <Eyebrow>{w.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {w.title}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 max-w-2xl ${sectionLead}`}>
              {w.body}
            </motion.p>

            {/* R155: hier standen vier schmale Mini-Karten in sm:grid-cols-2 (Vorher-Shot
                events-y2800.png). content.ts traegt inzwischen nur noch ZWEI Punkte, und
                die sind keine Chip-Labels mehr, sondern ganze Absaetze. Das feste
                2-Spalten-Raster haette daraus zwei halbleere Kaesten neben zwei fehlenden
                gemacht. Die Liste laeuft deshalb einspaltig: die Zahl steht als Marker in
                einer eigenen Spalte links, der Absatz bekommt die volle Kartenbreite zum
                Lesen. Kein leerer Kasten mehr, egal ob content.ts einen, zwei oder drei
                Punkte liefert. Bewusst dieselbe Leseliste-Geste wie die Danceflow-Fakten
                oben (grid statt Kachel), damit die Seite EIN Listen-Muster hat. */}
            <motion.div
              variants={item}
              className="mt-8 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]"
            >
              {w.points.map((point: string, i: number) => (
                <div key={point} className="grid grid-cols-[2rem_1fr] gap-4 py-5">
                  <span className="font-display text-sm font-bold tabular-nums text-[var(--color-salsa)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--color-ink)]">{point}</p>
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
              //
              // R155: die Frau war rechts angeschnitten (Beleg worklog/shots/S7-ux155/
              // vorher/events-y2800.png). Wieder ein X-, kein Y-Problem: die Quelle ist
              // Querformat (2048x1360), die Bildspalte auf 1440px misst rund 615x770.
              //   scale = 770/1360 = 0.566 -> skaliert 1160x770
              //   Ueberhang Y = 0, Ueberhang X = 545
              // Die volle Bildhoehe steht also immer im Rahmen; der alte Y-Wert 42% war
              // wirkungslos. Bei X 50% lief ihr rechter Arm ueber die Kante hinaus.
              // X 40% (nat. X 385-1471) haelt Kopf, Schultern und beide Haende komplett
              // im Bild; der Mann dahinter bleibt sichtbar, weggeschnitten wird nur
              // Hintergrund am rechten Rand.
              className="absolute inset-0 h-full w-full object-cover object-[40%_50%] opacity-95"
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
  const de = lang === 'de';
  // R155: staerkerer Takt, siehe Kommentar in DanceflowSection.
  const { item } = useReveal({ stagger: 0.1, distance: 22 });
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
              alt={de ? 'Frau in Rot beim Dreh, lacht in die Kamera' : 'Woman in red mid-turn, laughing at the camera'}
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

        <Reveal className="order-1 max-w-xl lg:order-2" stagger={0.1} distance={22}>
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
                    <span className="block type-h3 text-[var(--color-ink)]">
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
  const de = lang === 'de';
  // R155: staerkerer Takt, siehe Kommentar in DanceflowSection.
  const { item } = useReveal({ stagger: 0.1, distance: 22 });
  const f = EVENTS[lang].floweekend;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="max-w-xl" stagger={0.1} distance={22}>
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <Eyebrow>{f.eyebrow}</Eyebrow>
            <span className="rounded-full bg-[var(--color-salsa)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
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
              alt={de ? 'Lachendes Social-Dancing-Paar, mehrere Paare im Hintergrund' : 'Laughing social-dancing couple with more couples behind them'}
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
  // R155: staerkerer Takt, siehe Kommentar in DanceflowSection.
  const { item } = useReveal({ stagger: 0.1, distance: 22 });
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
          <Reveal className="p-7 sm:p-9 lg:p-12" stagger={0.1} distance={22}>
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
                    <span className="block type-h3 text-[var(--color-ink)]">
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
