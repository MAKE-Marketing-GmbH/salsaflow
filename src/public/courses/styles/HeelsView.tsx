// Heels-Seite (/tanzkurse/heels). Eigener Rhythmus laut Plan (pages/05): Hero -> Angst abbauen
// (Myth-Busting) -> Was trainiert wird -> Schuhe & Vorbereitung -> Atmosphaere -> Final CTA -> FAQ.
// Design-System strikt (hell im Wechsel paper-warm/bg-soft, Rot sparsam, Reveal-Takt, Kit-Bausteine).
// Copy kommt 1:1 aus HEELS (heels-content.ts), hier nur Rendering.

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { HEELS, type HeelsContent } from '@/public/courses/styles/heels-content';
/* R162: Termine dieses Stils. Dieselbe Sektion wie auf Salsa/Bachata, importiert statt
   kopiert — zwei Listen liefen ab dem ersten Fix auseinander. Sie muss ein echtes Kind
   im JSX-Baum sein: scripts/prerender.mjs legt den Plan als globalThis.__SCHEDULE__ ab,
   damit renderToString schon echte Zeiten schreibt (DESIGN.md: «Voller Text im HTML fuer
   oeffentliche Routen»). Ein Portal auf den Marker haette hier leeres HTML ausgeliefert. */
import { StyleSlotsSection } from '@/public/courses/styles/StylePage';
import {
  MEASURE_L,
  MEASURE_XL,
  ClosingInvite,
  SubPageShell,
  Breadcrumb,
  PrimaryCta,
  GhostCta,
  SectionHead,
  CheckList,
  FaqBlock,
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

export function HeelsPage() {
  const { lang } = useLang();
  const c = HEELS[lang];
  return (
    <SubPageShell seo={c.seo}>
      {/* R139: Marker dieser Route. Traegt EINE route-lokale Korrektur, ohne
          WhatsAppFloat.tsx oder StylePage.tsx anzufassen (beide sitewide/tabu):
          Der Desktop-Float ist sonst eine Pille mit Label «WhatsApp» (im Vorher-Shot
          1440x730 gemessen: 121px breit, span display:block). Hier Kreis wie mobil.
          Mobil braucht der Knopf KEINEN Lift — die Freistellung laeuft ueber die
          Bild-Ratio unten (siehe HEELS_HERO_IMG_CLASS), nicht ueber --whatsapp-lift.
          [data-split-hero-page] waere falsch: der haengt an StylePage und wuerde
          Salsa/Bachata mitziehen; dieser Marker gilt nur fuer /tanzkurse/heels. */}
      <div data-heels-style-page="">
        <style>{`
          @media (min-width: 640px) {
            body:has([data-heels-style-page]) a.whatsapp-float {
              width: 3.5rem;
              padding-left: 0;
              padding-right: 0;
              justify-content: center;
              gap: 0;
            }
            body:has([data-heels-style-page]) a.whatsapp-float span {
              display: none;
            }
          }
        `}</style>
        <HeelsHero c={c} />
        <MythSection c={c} />
        <TrainingSection c={c} />
        <ShoesSection c={c} />
        <AtmosphereSection c={c} />
        {/* Gleiche Position wie auf Salsa/Bachata: die Termine stehen vor dem
            Schluss-CTA, damit der Leser den Tag kennt, bevor er gefragt wird. */}
        <StyleSlotsSection styleKey={c.seo} />
        <ClosingSection c={c} />
        <FaqBlock title={c.faqTitle} items={c.faq} />
      </div>
    </SubPageShell>
  );
}

/* Vom Vertrag, nicht vom Literal. `HEELS` traegt seit R139 ein `satisfies` statt einer
   Typ-Annotation (oxlint anti-slop/no-known-value-widening). Damit narrowt
   (typeof HEELS)['de'] auf die konkreten DE-Daten und verliert jedes optionale Feld,
   das dort zufaellig fehlt — z. B. myth.titleAccent. */
type C = HeelsContent;

/* -------------------------------------------------------------------- Hero */
/* R139 (Raphael-Video Punkt 7, 18.08.): «Mach so einfach links, rechts.» — dieselbe
   Ansage, die R137 auf Salsa und R138 auf Bachata umgesetzt haben. Heels lief bis hier
   noch ueber HeroFrame axis="center": zentrierter Typo-Block, darunter ein Full-Bleed-
   Band. Am 1440x730-Fold gemessen (worklog/shots/S7-ux139/vorher/heels-desktop-1440.png)
   begann das Band erst bei y=545 und die Gesichter lagen komplett unter der Foldkante —
   im Fold stand nur Schrift, kein Nebeneinander.

   Diese Bauform steht bewusst HIER und nicht in StylePage.tsx (tabu, Brief Punkt 5).
   Strukturell aehnlich, nicht importiert: eigene Konstante, eigener Klassenstring,
   eigene Fold-Kalibrierung. Salsa und Bachata bleiben Byte fuer Byte unberuehrt.

   Motiv und Alt-Text kommen aus heels-content.ts `hero.band` (DE und EN) — EIN
   Objekt, alle drei Felder live: `src`, `alt` und `position` gehen direkt in das
   Bild-Element unten. Bis R139 rendete hier eine zweite, hartkodierte Konstante, waehrend
   `band.src`/`band.alt` ignoriert wurden; wer die Content-Datei aenderte, sah keine
   Wirkung (Sol-Fund R139). Diese Aufspaltung ist weg.

   Das Asset (/photos/2026/kurse-heels-energie-card-960.webp, 960x1200) ist der
   Hochformat-Zuschnitt desselben Shots wie das fruehere 21:9-Band — helle
   Heels-Klasse vor der Salsaflow-Wand, Frauen, Energie. Vor dem Einbau per Read
   geprueft: echtes Foto, natuerliche Haut- und Haarkanten, keine Matte-Linie und
   kein kopfloser Koerper-Rest (R138 Fund 6), scharf, Tageslicht-Studio.
   Hochformat ist Pflicht, damit object-cover vertikalen Ueberhang hat — sonst
   waere 'center 12%' ein totes Feld (R138 Fund 2). */

/* Mobil 21/9, ab lg 4/3. Der Crop kommt NICHT aus dieser Klasse, sondern per
   objectPosition aus heels-content.ts hero.band.position — sonst haette die Klasse
   den Content-Wert still ueberstimmt.

   Warum mobil so flach: der WhatsApp-Float ist fixed und sitzt bei 390x844 auf
   y768-824 (x314-370). Mit dem vorherigen 3/2 endete das Foto bei y773 und lief bis
   x369 — der Knopf steckte mitten im Motiv auf der zweiten Taenzerin (Sol-Fund R139,
   live gemessen). Ein Lift half nicht: zwischen Bildunterkante und Chip-Oberkante
   liegen strukturell nur 21px (grid gap-5), der Knopf ist 56px hoch.
   21/9 (348x149) zieht die Bildkante auf y690. Chip-Zeile 1 laeuft dann y711-755 und
   endet bei x172, die Knopf-Spalte ab x314 ist dort frei. Der Float bleibt bei
   --whatsapp-lift 0 auf y768-824 und beruehrt weder Foto noch Chip.
   Bei 360x800 gilt dasselbe: Bild endet y700, Float y724-780, kein Kontakt.

   Beide Verhaeltnisse behalten bei 12% alle Gesichter inkl. Kinn — per Read am
   simulierten Ausschnitt geprueft: 21/9 zeigt Quell-Y 95-506 von 1200, 4/3 zeigt
   58-777. Die Kopfreihe liegt zwischen Y 90 und 400. */
const HEELS_HERO_IMG_CLASS = 'aspect-[21/9] w-full object-cover lg:aspect-[4/3]';

function HeelsHero({ c }: { c: C }) {
  const { container, item } = useReveal();
  const h = c.hero;
  /* Crop-Lock aus dem LIVE-Content (Brief Punkt 3): `position` steuert das Hero-Foto —
     der Gate-Treffer auf 'center 12%' ist damit Buchstabe MIT Wirkung. Aendert jemand
     den Wert in heels-content.ts, wandert der Bildausschnitt mit. */
  const objectPosition = h.band.position;
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

          {/* Die eine Achse: Text links, Foto rechts. Unter lg stapelt es, Foto direkt
              nach der Microcopy — mobil zaehlt der Fold, nicht die Spalte.
              1.05fr/items-center: Heels hat fuenf Chips wie Bachata, aber kuerzere
              Labels (laengster 190px gegen Bachatas Zeile); mit 1.05fr bleiben der
              Textspalte 672px und die Chips brechen auf zwei Zeilen statt drei. */}
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
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
            </div>

            <motion.div
              variants={item}
              className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]"
            >
              <img
                src={h.band.src}
                alt={h.band.alt}
                style={{ objectPosition }}
                className={HEELS_HERO_IMG_CLASS}
                width={960}
                height={1200}
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>

            {/* Die Chip-Reihe steht mobil UNTER dem Foto, damit die Gesichter im
                390x844-Fold liegen.

                px-2 und gap-x-1 statt px-2.5/gap-2.5: die Heels-Labels sind laenger als
                Bachatas. Mit px-2.5 messen Chip 1 und 2 zusammen 156+10+195 = 361px bei
                348px Spaltenbreite — jeder Chip bekam eine eigene Zeile, Zeile 2 lag bei
                y=812 und wurde von der 844er-Kante durchgeschnitten. Die engere Stufe
                nimmt jedem Chip 4px und dem Abstand 6px: 152+4+191 = 347px, beide passen
                in Zeile 1. Dieselbe Rechnung stand schon in der HeroFrame-Fassung dieser
                Route (Critic Runde 12, Item 4). Ab sm greifen wieder die Normalwerte.

                Die Ueberdeckung durch den WhatsApp-Knopf loest KEIN pr-* hier: das
                Padding zaehlt zur min-content-Breite der Flex-Zeile, weitet die
                Grid-Spalte und schiebt den Hero aus dem 390er-Viewport (R138 Fund 8).
                Der Knopf weicht stattdessen aus — --whatsapp-lift in index.css am
                Marker [data-heels-style-page]. */}
            <motion.ul variants={item} className="flex flex-wrap gap-x-1 gap-y-2.5 sm:gap-2 lg:hidden">
              {h.bullets.map((b) => (
                <li
                  key={`sm-${b}`}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--color-line)] bg-white px-2 py-1 text-[0.72rem] font-semibold leading-tight text-[var(--color-ink)] sm:gap-2 sm:px-3.5 sm:py-1.5"
                >
                  <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
                  {b}
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Angst abbauen */
function MythSection({ c }: { c: C }) {
  const { item } = useReveal();
  const m = c.myth;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal>
          <SectionHead eyebrow={m.eyebrow} title={m.title} titleAccent={m.titleAccent} lead={m.body} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.08}>
          {m.cards.map((card, i) => (
            <motion.div
              key={card.myth}
              variants={item}
              className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.05)] sm:p-7"
            >
              <span className="font-display text-sm font-extrabold tabular-nums text-[var(--color-salsa)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 font-display text-lg font-bold leading-snug text-[var(--color-ink)]">{card.myth}</p>
              <p className="mt-3 flex items-start gap-2.5 text-[0.96rem] leading-relaxed text-[var(--color-ink-muted)]">
                <BeatMark className="mt-1.5 shrink-0" />
                <span>{card.reality}</span>
              </p>
            </motion.div>
          ))}
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item}>
            <a
              href={m.cta.href}
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {m.cta.label}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Was trainiert wird */
function TrainingSection({ c }: { c: C }) {
  const { item } = useReveal();
  const t = c.training;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {t.title} {t.titleAccent ? <TitleAccent>{t.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {t.body}
            </motion.p>
            {/* Runde 3, Issue 9 ("Auf /heels dasselbe Muster: 4er-Kartenblock
                Haltung/Linien/Walks/Choreografie direkt nach dem 3er-Kartenblock der
                Einwaende"). Der Vierer laeuft jetzt als zweispaltiges Raster unter EINER
                Oberkante mit Haarlinien statt als vier weisse Schatten-Kaesten. */}
            <motion.div variants={item} className="mt-8 grid border-t border-[var(--color-line)] sm:grid-cols-2">
              {t.items.map((it) => (
                <div
                  key={it.name}
                  className="border-b border-[var(--color-line)] py-5 sm:px-6 sm:odd:border-r sm:odd:pl-0 sm:even:pr-0"
                >
                  <h3 className="type-h3 text-[var(--color-ink)]">{it.name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{it.text}</p>
                </div>
              ))}
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={t.cta.href}>{t.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              <img src={t.image.src} alt={t.image.alt} className="aspect-[4/5] w-full object-cover object-[center_30%]" width={1200} height={1500} loading="lazy" />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Schuhe & Vorbereitung */
function ShoesSection({ c }: { c: C }) {
  const { item } = useReveal();
  const s = c.shoes;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
              {/* 80% statt 45%: die Schuhe stehen unten im Motiv — 45% legte den leeren
                  Saal in die Mitte und schnitt die Schuhe an (Critic Runde 8, Item 2). */}
              <img src={s.image.src} alt={s.image.alt} className="aspect-[4/3] w-full object-cover object-[center_80%]" width={1200} height={900} loading="lazy" />
            </motion.div>
          </Reveal>
          <Reveal className="order-1 max-w-xl lg:order-2">
            <motion.div variants={item}>
              <Eyebrow>{s.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {s.title} {s.titleAccent ? <TitleAccent>{s.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {s.body}
            </motion.p>
            <motion.div variants={item} className="mt-7 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]">
              <CheckList items={s.checklist} />
            </motion.div>
            <motion.div variants={item} className="mt-7">
              <a
                href={s.cta.href}
                className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {s.cta.label}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Atmosphaere */
function AtmosphereSection({ c }: { c: C }) {
  const { item } = useReveal();
  const a = c.atmosphere;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <motion.div variants={item} className="max-w-xl">
            <h2 className={cn(sectionTitle, MEASURE_L)}>
              {a.title} {a.titleAccent ? <TitleAccent>{a.titleAccent}</TitleAccent> : null}
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{a.body}</p>
          </motion.div>
          <motion.div variants={item} className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
            <img src={a.image.src} alt={a.image.alt} className="aspect-[5/4] w-full object-cover object-[center_35%]" width={1400} height={1120} loading="lazy" />
            {/* Festes Papier statt Glas (Sweep 14.08.2026). */}
            <div className="absolute bottom-4 left-4 right-4 rounded-[var(--radius-card)] border border-black/5 bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] sm:right-auto sm:max-w-[20rem]">
              <p className="text-[0.95rem] font-semibold leading-snug">{a.microcopy}</p>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Final CTA (zwei Wege) */
function ClosingSection({ c }: { c: C }) {
  const cl = c.closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  return (
    <ClosingInvite
      title={cl.title}
      titleAccent={cl.titleAccent}
      body={cl.body}
      ctaLabel={cl.primary.label}
      ctaHref={cl.primary.href}
      secondary={cl.secondary}
      note={cl.microcopy}
      surface="soft"
    />
  );
}
