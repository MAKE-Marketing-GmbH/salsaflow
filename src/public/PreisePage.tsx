// Preise-Seite (/preise) aus dem V3-Copyplan (pages/09_preise.md). Nutzt den geteilten
// SubPageShell + das Design-System-Kit (src/public/subpage/kit.tsx). Rhythmus wie im Plan:
// Hero -> Reguläre Kurse -> Privatstunden -> Workshops & Danceflow Night -> Salsaflow Pass ->
// Was passt zu dir -> Final CTA -> FAQ.
//
// Look-Vorbild: PricesSection in src/public/CoursesPage.tsx (Preis-Karten, Anker-Preis rot,
// weitere Zeilen in Ink, ShieldCheck-Ruhe). Flächen wechseln hell paper-warm <-> bg-soft.
// Rot #AD1827 sparsam: Anker-Preis pro Tabelle, ein Script-Akzentwort pro Headline, CTAs.
//
// Preis-Integrität: Alle Zahlen kommen aus content.ts (Quelle Plan 09 + overview-content.ts),
// nichts hier hartkodiert. Fehlt je eine Zahl, greift der onRequest-Fallback (Stat-Kachel-Regel).

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  FaqBlock,
  CheckList,
  PrimaryCta,
  GhostCta,
  CtaArrow,
  Shell,
  TitleAccent,
  BeatMark,
  sectionTitle,
  MEASURE_L,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { PREISE, type PreiseContent, type PriceRow, type PriceGroup } from '@/public/preise/content';

export function PreisePage() {
  const { lang } = useLang();
  const c = PREISE[lang];
  /* Kritiker Runde 3, Biggest Gap: der fixe Cookie-Streifen (56px, z-40, CookieBanner.tsx:61)
     liegt auf JEDEM Screen der Seite auf der Unterkante und schnitt dort Preise und Headlines
     ab — gemessen im Vollseiten-Lauf (scratch/pv3): Desktop d-06 "Für alle, die mehr als"
     halb verdeckt, Mobile m-04 der Sparhinweis "...50 Franken." abgeschnitten.
     Ursache ist nicht der Abstand der Sektionen, sondern ein Overlay ohne Ausweichregel:
     ungelesen bleibt es die ganze Seite lang stehen. /faq hat den Fall bereits geloest
     (FaqPage.tsx:33) — der Hinweis bleibt beim Einstieg sichtbar und raeumt beim ersten
     Scroll die Inhaltsflaeche frei, ohne die Zustimmung zu faelschen (ohne Klick erscheint
     er auf der naechsten Route wieder). Dieselbe Loesung hier, statt einer neuen. */
  const [cookieClear, setCookieClear] = useState(false);
  useEffect(() => {
    if (window.scrollY > 0) {
      setCookieClear(true);
      return;
    }
    const clearOnFirstScroll = () => setCookieClear(true);
    window.addEventListener('scroll', clearOnFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', clearOnFirstScroll);
  }, []);
  return (
    <SubPageShell seo="preise">
      <div className="preise-page" data-cookie-clear={cookieClear ? 'true' : undefined} />
      {/* Kein Eyebrow: "Preise & Optionen" stand direkt ueber der H1 "Preise fuer Kurse,
          Workshops und Privatstunden." und wiederholte nur deren erstes Wort. Die Breadcrumb
          darueber sagt bereits "Preise" — dreimal dasselbe Wort in 40px Hoehe. */}
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'center' — genau wie im
          Kritik-Fix gefordert: "Preise: Headline zentriert ueber der Preistabelle".
          Das Hero-Foto ist weg; auf einer Preisseite hat ein Stimmungsbild neben der
          Zahl ohnehin nichts zu tun. */}
      {/* Kritiker final-1, Issue 1 + 3: /preise rendert (gemessen in dist/preise.html) genau
          EIN <img> auf 6162px Seitenhoehe — /team und /events je 12, /kontakt 6. Die Seite war
          damit die einzige ohne Bild ueber der Falz und fiel als reine Tabellenseite aus der
          warmen Bildsprache heraus. Das `media`-Band ist der bestehende Standard der
          Story-Seiten (HeroFrame, siehe EventsPage.tsx:152 und TeamPage.tsx:72) — hier
          gespiegelt statt neu erfunden, damit /preise dieselbe Oeffnung bekommt.
          Foto: kurs-05 hatte bisher 0 Platzierungen (verify-image-reuse.cjs), zeigt eine volle
          Kursstaffel im hellen Tageslicht-Studio und belegt damit genau das, was die Seite
          verkauft. */}
      <SubHero
        axis="center"
        seoCrumbs={[c.crumb]}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        facts={c.hero.facts}
        media={c.hero.media}
      />
      <RegularSection c={c} />
      <PrivatSection c={c} />
      <WorkshopsSection c={c} />
      <PassSection c={c} />
      <FitSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} titleAccent={c.faqTitleAccent} items={c.faq} />
    </SubPageShell>
  );
}

/* ----------------------------------------------------------------- Preis-Tabellen */
/** Flache Preis-Tabelle. Rot-Dosierung: nur die erste (Anker-)Zeile rot, der Rest in Ink. */
function PriceRows({ rows, onRequest }: { rows: PriceRow[]; onRequest: string }) {
  return (
    <dl className="border-t border-[var(--color-line)]">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[var(--color-line)] py-3.5 last:border-b-0"
        >
          <dt className="text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{row.label}</dt>
          <dd
            className={cn(
              'shrink-0 font-display text-base font-extrabold tabular-nums',
              i === 0 ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
            )}
          >
            {row.value ?? onRequest}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Gruppierte Preis-Tabelle (Einzeln / Zu zweit / Einzellektion). Rot nur der Anker (erste
 *  Zeile der ersten Gruppe), damit die Rot-Dosierung sitewide gleich bleibt. */
function GroupedPrices({ groups, onRequest }: { groups: PriceGroup[]; onRequest: string }) {
  return (
    <div className="grid gap-6">
      {groups.map((g, gi) => (
        <div key={g.label}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{g.label}</p>
          <dl className="mt-2.5 border-t border-[var(--color-line)]">
            {g.rows.map((row, ri) => {
              const anchor = gi === 0 && ri === 0;
              return (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[var(--color-line)] py-3.5 last:border-b-0"
                >
                  <dt className="text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{row.label}</dt>
                  <dd
                    className={cn(
                      'shrink-0 font-display text-base font-extrabold tabular-nums',
                      anchor ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                    )}
                  >
                    {row.value ?? onRequest}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- Reguläre Kurse */
function RegularSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const r = c.regular;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <SectionHead title={r.title} titleAccent={r.titleAccent} lead={r.body} />
            </motion.div>
            {/* Deko-Pille -> Zeile (Kritik Runde 2: Pillen nur wo sie interaktiv filtern). */}
            <motion.p
              variants={item}
              className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-[var(--color-ink)]"
            >
              <BeatMark />
              {r.fixed}
            </motion.p>
            <motion.div variants={item} className="mt-8">
              <CheckList items={r.included} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={r.cta.href}>{r.cta.label}</PrimaryCta>
            </motion.div>
            <motion.p variants={item} className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {r.microcopy}
            </motion.p>
          </Reveal>

          {/* Design-Kritik Runde 2 (critical): "die Preistabellen auf /preise verlieren die
              Box und bekommen nur horizontale Linien." Box, Radius, Schatten und weisse
              Fuellung sind raus — die Tabelle traegt sich ueber ihre eigenen Zeilenlinien. */}
          <Reveal className="border-t border-[var(--color-line)] pt-6">
            <motion.div
              variants={item}
              className="flex items-baseline justify-between gap-4 border-b border-[var(--color-line)] pb-5"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-ink)]">{r.cardTitle}</p>
              <p className="text-xs font-semibold text-[var(--color-ink-muted)]">{r.cardNote}</p>
            </motion.div>
            <motion.div variants={item} className="mt-6">
              <GroupedPrices groups={r.groups} onRequest={c.onRequest} />
            </motion.div>
          </Reveal>
        </div>

        {/* Runde 1 (Preise-Builder): der Einstiegs-Block beantwortet die Frage, die direkt
            nach "CHF 190.-" entsteht — muss ich das blind buchen? Vorher stand die Antwort
            erst rund 4000px weiter unten: "Gratis Schnupperstunde" nur in der Fit-Liste
            (Sektionsstart y=5616) und in FAQ-Frage 3 (y=6785) von 7756px Seitenhoehe; das
            Wort "Quereinstieg" kam in preise/content.ts ueberhaupt nicht vor, obwohl der
            Kursplan es pro Kurs als Badge fuehrt (CourseEngine.tsx:177, i18n.tsx:83).

            Er steht ueber die VOLLE Breite, nicht in einer der beiden Spalten. Erste Fassung
            hing im rechten Ast unter der Preistabelle — gemessen auf 1440px war die rechte
            Spalte damit bis y=2047 lang, die linke endete bei y=1700, und links entstanden
            347px neue Leerflaeche (x40-680: Band y1695-2017). Genau der Fehler, den das
            Beleg-Foto darunter schon einmal geloest hat: was beide Spalten abschliesst,
            gehoert unter beide.

            Keine neue Sektion: die Flaechen wechseln sitewide lueckenlos paper-warm <->
            bg-soft, ein eingeschobener Block wuerde die ganze Kette umdrehen.
            Kein Countdown, kein "nur noch X Plaetze": die Verfuegbarkeit steht im Kursplan
            und ist dort echt. */}
        <Reveal className="mt-12 border-t border-[var(--color-line)] pt-6 lg:mt-14">
          <motion.p
            variants={item}
            className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]"
          >
            <BeatMark />
            {r.entry.label}
          </motion.p>
          <div className="mt-6 grid gap-x-16 gap-y-8 lg:grid-cols-[0.9fr_1.1fr]">
            {r.entry.items.map((e) => (
              <motion.div key={e.title} variants={item}>
                <h3 className="font-display text-lg font-bold leading-snug text-balance text-[var(--color-ink)]">
                  {e.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {e.text}
                </p>
              </motion.div>
            ))}
          </div>
          {/* Stufe 2 der Link-Skala, nicht noch ein roter Pill: die Sektion hat mit
              "Kursplan oeffnen" oben schon ihren einen Primary (DESIGN.md Zeile 86). */}
          <motion.div variants={item} className="mt-6 -ml-4">
            <GhostCta href={r.entry.link.href}>{r.entry.link.label}</GhostCta>
          </motion.div>
        </Reveal>

        {/* Kritiker final-1, Issue 1 ("grosse leere Papier-Zonen"). Der Befund ist messbar:
            im Full-Page-Screenshot (_screenshots-kritiker/final-1/preise-1440.png, 1440x6162)
            liegen zwei Baender ueber 200px, in denen JEDE Pixelzeile eine Standardabweichung
            unter 3/255 hat — also reine, unbespielte Flaeche:
              y1305-1518 (213px)  · direkt hier, unter Bullet-Liste und Preistabelle
              y2446-2665 (219px)  · zwischen Privatstunden-Caption und "Workshops und Events"
            Zum Vergleich mit derselben Messung: team-1440 0 Baender, events-1440 0,
            kontakt-1440 0. /preise war die einzige Seite mit toten Zonen dieser Groesse.

            Ursache ist nicht der Abstand, sondern die ungleiche Spaltenhoehe: links endet die
            Copy-Spalte nach CTA und Microcopy, rechts laeuft die dreigruppige Preistabelle
            deutlich weiter — unter der kuerzeren Spalte bleibt Leere stehen. Ein Beleg-Foto
            ueber die volle Breite schliesst beide Spalten gemeinsam ab, statt die Luecke nur
            enger zu machen. Gleiche Bauform wie das Beleg-Foto auf /team (TeamPage.tsx:270):
            21/9, --radius-media, Caption an der Haarlinie. */}
        <Reveal className="mt-12 lg:mt-16">
          <motion.figure variants={item}>
            <img
              src={r.image.src}
              alt={r.image.alt}
              className="aspect-[21/9] w-full rounded-[var(--radius-media)] object-cover object-[center_45%]"
              width={1500}
              height={1000}
              loading="lazy"
            />
            <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[var(--color-line)] pt-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                {r.cardTitle}
              </span>
              <span className="text-[0.95rem] text-[var(--color-ink-muted)]">{r.fixed}</span>
            </figcaption>
          </motion.figure>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Privatstunden */
function PrivatSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const p = c.privat;
  return (
    /* Kritiker Runde 3, Fix 5 ("tote Weissflaeche zwischen 1:1-Fokus und Workshops").
       Gemessen im laufenden Dev-Server (scratch/pv3-cols.cjs, 1440px): die Privat-Sektion
       endet bei y=3964, die Workshops-Sektion beginnt dort — die Fuge ist die Summe aus
       pb 96px und pt 96px = 192px. Darueber steht links nur noch die Caption "Dein Tempo.
       Dein Ziel." (Unterkante y=3868) und rechts endet die Copy-Spalte schon bei y=3655.
       Ursache ist also die gestapelte Sektions-Fuge, nicht ein Abstand im Inneren — genau
       der Fall, den PassSection auf dieser Seite schon einmal geloest hat (Zeile 459: untere
       Stufe knapper). Hier dieselbe Loesung: unten eine Stufe knapper, oben unveraendert. */
    <section className="bg-[var(--color-paper-warm)] pb-12 pt-16 lg:pb-16 lg:pt-24">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:h-full">
            {/* Bild-Chrome + Glas-Karte raus, Caption an die Haarlinie (Kritik Runde 2). */}
            <motion.div variants={item} className="flex h-full flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-media)]">
                <img
                  src={p.image.src}
                  alt={p.image.alt}
                  /* Kritiker Runde 3, Fix 5 ("tote Weissflaeche zwischen 1:1-Fokus und
                     Workshops"). URSACHE gemessen (scratch/pv3-priv.cjs, 1440px): die
                     Foto-Spalte lief 2938-3868 (930px), die Text-Spalte endete mit dem CTA
                     schon bei 3658 (720px). Die 210px Differenz sind genau die Leere in d-05
                     — sie entsteht, weil `lg:aspect-auto lg:h-full` das Foto auf die
                     Zeilenhoehe des Rasters STRECKT und die Spalte damit ueber den Nachbarn
                     hinaus waechst. Nicht der Abstand ist falsch, sondern die freie Hoehe.
                     Feste 1:1-Box auf lg: 636px breit -> 636px hoch, plus Caption ~84px sind
                     720px — dieselbe Hoehe wie die Textspalte, ohne Streckung. */
                  /* Asset ist seit 10.08.2026 ein echtes Quadrat (offer-privat-square-1200):
                     beide Tanzenden voll im Bild, kein horizontaler Beschnitt mehr noetig —
                     object-center statt 42%-Bias, width/height 1200x1200. */
                  className="aspect-[4/5] w-full object-cover object-center sm:aspect-[4/3] lg:aspect-square"
                  width={1200}
                  height={1200}
                  loading="lazy"
                />
              </div>
              <div className="mt-5 border-t border-[var(--color-line)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{p.cardLabel}</p>
                <p className="mt-1.5 font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{p.cardText}</p>
              </div>
            </motion.div>
          </Reveal>

          <Reveal className="order-1 max-w-xl lg:order-2">
            <motion.div variants={item}>
              <SectionHead eyebrow={p.eyebrow} title={p.title} titleAccent={p.titleAccent} lead={p.body} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PriceRows rows={p.rows} onRequest={c.onRequest} />
            </motion.div>
            {/* Runde 1 (Preise-Builder): der Fuenferblock ist ein Rabatt, den die Tabelle
                zwar enthaelt, aber nicht ausspricht — 5x100 gegen 450 und 5x130 gegen 600,
                je 50 Franken. Steht direkt an der Tabellenkante, weil es eine Lesehilfe zu
                den Zahlen darueber ist und keine eigene Aussage. */}
            <motion.p
              variants={item}
              className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]"
            >
              {p.note}
            </motion.p>
            {/* Die Kursstaffel sagt in einer CheckList, was im Preis steckt; die
                Privatstunden nannten nur vier Zahlen. Gemessen auf 1440px vor dem Fix:
                rechte Spalte endet mit dem CTA bei y=3184, die Spalte selbst laeuft bis
                y=3580 — 396px, in denen neben dem Foto nichts steht. Gleiche CheckList
                (kit.tsx:478), damit beide Preisbloecke der Seite dieselbe Bauform haben. */}
            <motion.div variants={item} className="mt-8">
              <CheckList items={p.included} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={p.cta.href}>{p.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Workshops & Danceflow Night */
function WorkshopCard({
  title,
  body,
  rows,
  foot,
  image,
  onRequest,
}: {
  title: string;
  body: string;
  rows: PriceRow[];
  foot?: string;
  image: { src: string; alt: string; width: number; height: number; position?: string };
  onRequest: string;
}) {
  return (
    // Karte -> Spalte unter einer Oberkante (Kritik Runde 2).
    <div className="flex h-full flex-col border-t border-[var(--color-line)] pt-6">
      {/* Kritiker final-1, Issue 1 ("Preisstaffel in Karten mit Foto-Anker"): die beiden
          Spalten waren reine Text-Preis-Bloecke. Das Foto sitzt UEBER dem Titel und bleibt
          damit die Oberkante der Spalte — die Haarlinie darueber traegt weiter den Rhythmus,
          es entsteht keine neue Karten-Bauform (DESIGN.md: Border ODER Schatten, kein
          Card-Soup). --radius-media wie jede andere Bildflaeche sitewide. */}
      {/* width/height melden das ECHTE Seitenverhaeltnis der Datei (nicht das der Box) —
          sonst reserviert der Browser die falsche Hoehe und die Seite springt beim Laden (CLS).
          Die beiden Spalten tragen unterschiedliche Formate: Workshop hochkant 1067x1600,
          Danceflow quer 1500x1000. Ein fester Wert waere fuer eine der beiden falsch. */}
      {/* `position` je Bild, nicht pauschal: bei einer hochkanten Quelle in einer 3:2-Box
          schneidet `cover` sehr viel Hoehe weg, und ein Standardwert von 40% landet dort
          unterhalb der Gesichter (gemessen an gallery/kurse/08.jpg 1067x1600: bei 40% ist
          der Kopf des Lehrers ausserhalb des Rahmens, bei 20% sitzt er im Bild). */}
      <img
        src={image.src}
        alt={image.alt}
        className="mb-6 aspect-[3/2] w-full rounded-[var(--radius-media)] object-cover"
        style={{ objectPosition: image.position ?? 'center 40%' }}
        width={image.width}
        height={image.height}
        loading="lazy"
      />
      <div className="flex items-center gap-3">
        <BeatMark />
        <h3 className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)]">{title}</h3>
      </div>
      <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
      <div className="mt-6">
        <PriceRows rows={rows} onRequest={onRequest} />
      </div>
      {/* mt-auto haelt die Fussnote am Kartenboden: nur EINE der beiden Karten hat einen `foot`,
          vorher standen die Unterkanten dadurch unterschiedlich hoch. */}
      {foot ? (
        <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{foot}</p>
      ) : null}
    </div>
  );
}

function WorkshopsSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const w = c.workshops;
  return (
    /* Kritiker Runde 3, Fix 2 ("leere Beige-Zone ueber der Pass-Headline straffen").
       Gemessen (scratch/pv3-cols.cjs, 1440px): Workshops enden y=5116 bei pb 96px, der
       Pass beginnt dort mit pt 96px. Im Screen d-06 ist genau diese 192px-Fuge die leere
       beige Flaeche unter dem "Events ansehen"-CTA — die Headline "Fuer alle, die mehr
       als" wurde dadurch an die Unterkante des Screens geschoben. Untere Stufe knapper,
       gleiche Massnahme wie in PrivatSection und PassSection. */
    <section className="bg-[var(--color-bg-soft)] pb-12 pt-16 lg:pb-16 lg:pt-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <motion.div variants={item}>
            <SectionHead title={w.title} titleAccent={w.titleAccent} lead={w.lead} />
          </motion.div>
        </Reveal>
        <Reveal className="mt-12 grid items-stretch gap-x-10 md:grid-cols-2" stagger={0.08}>
          <motion.div variants={item} className="h-full">
            <WorkshopCard
              title={w.workshop.title}
              body={w.workshop.body}
              rows={w.workshop.rows}
              image={w.workshop.image}
              onRequest={c.onRequest}
            />
          </motion.div>
          <motion.div variants={item} className="h-full">
            <WorkshopCard
              title={w.social.title}
              body={w.social.body}
              rows={w.social.rows}
              foot={w.social.foot}
              image={w.social.image}
              onRequest={c.onRequest}
            />
          </motion.div>
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item}>
            <PrimaryCta href={w.cta.href}>{w.cta.label}</PrimaryCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Salsaflow Pass */
function PassSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const p = c.pass;
  return (
    // Kritik Runde 2: pro Seite genau EIN Hoehepunkt mit der grossen Abstandsstufe.
    // Auf /preise ist das laut Kritik der Salsaflow-Pass.
    /* Kritiker Runde 1 (/preise, Fix 4): "tote Weissraeume zwischen Pass, Ziel-Liste und
       Kursplan-CTA" (d-08/d-09, m-10). Gemessen wurde jedes Band im Vollseiten-Screenshot
       ueber die Standardabweichung je Pixelzeile (<3/255 = unbespielt, Skript
       /tmp/pv/deadbands.py) und dann einer Ursache zugeordnet (/tmp/pv/gap.cjs).

       Ergebnis: KEIN Band lag unter einer zu kurzen Spalte — alle sieben Desktop-Baender
       sind Sektionsfugen, also die Summe aus paddingBottom der einen und paddingTop der
       naechsten Sektion. In der vom Kritiker genannten Strecke waren das dreimal
       100px+96px bzw. 96px+96px am Stueck:
         y5789-5985 (196px)  Pass  -> Fit
         y6428-6620 (192px)  Fit   -> Closing
         y6962-7154 (192px)  Closing -> FAQ
       Auf Mobile dieselbe Kette mit 64px+64px: y6603-6755, y7451-7579, y7927-8089.

       Der Pass hatte als "Hoehepunkt der Seite" bewusst die groesste Stufe (lg:py-[6.25rem]
       = 100px). Genau die stapelt sich hier aber mit dem naechsten Sektions-Padding zur
       groessten Luecke der Seite. Die Emphase bleibt erhalten — sie kommt aus Typo und
       Haarlinien, nicht aus 100px Boden. Zurueck auf die regulaere Stufe py-16/lg:py-24
       (DESIGN.md Zeile "Sektion-Abstand py-16 bis py-24"), unten eine Stufe knapper. */
    <section id="salsaflow-pass" className="scroll-mt-24 bg-[var(--color-paper-warm)] pb-12 pt-16 lg:pb-16 lg:pt-24">
      <Shell>
        {/* Der Salsaflow-Pass ist laut Kritik DER Hoehepunkt dieser Seite — er behaelt darum
            die grosse Abstandsstufe (siehe Sektion oben) und die staerkste Typo, verliert
            aber die Karte. Emphase entsteht ueber Weissraum und Groesse, nicht ueber Chrome. */}
        <Reveal className="border-y border-[var(--color-line)] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={item} className="py-10 lg:py-14 lg:pr-12">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              <BeatMark />
              {p.badge}
            </p>
            <h2 className={cn('mt-5', sectionTitle, MEASURE_L)}>
              {p.title} <TitleAccent>{p.titleAccent}</TitleAccent>
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">{p.body}</p>
            {/* Nutzenliste (Kritiker Fix-Runde 1, Issue 1). Gleiche CheckList wie in der
                Kursstaffel-Sektion oben (kit.tsx:478) — der Pass war der einzige Block der
                Seite, der eine Zahl nannte ohne zu sagen, wofuer. */}
            <div className="mt-7 max-w-xl">
              <CheckList items={p.included} />
            </div>
            <div className="mt-8">
              <PrimaryCta href={p.cta.href}>{p.cta.label}</PrimaryCta>
            </div>
          </motion.div>
          <motion.div
            variants={item}
            /* Kritiker Runde 1 (/preise, Fix 5): auf Mobile stand "Schueler und Studenten
               CHF 340.-" als Fragment ohne Kontext — der Screen davor endete mit dem Foto.
               Gemessen (Vollseiten-Screenshot 390px): Foto y6222-6529, dann erst die beiden
               Preiszeilen y6560/6613. Zwischen der Ueberschrift "Fuer alle, die mehr als
               einen Kurs tanzen wollen." und ihrer Zahl lagen 307px Bild.

               Ursache ist die Stapelreihenfolge: im Desktop-Zweispalter steht das Foto
               korrekt UEBER den Preiszeilen (Bauform wie WorkshopCard). Beim Umbruch auf eine
               Spalte erbt Mobile dieselbe Reihenfolge — und schiebt damit das Bild zwischen
               Aussage und Preis. `flex` + `order` dreht das NUR auf Mobile um: Preise direkt
               unter den CTA, Foto danach. Ab lg gilt wieder die alte Ordnung, der
               Desktop-Aufbau bleibt unveraendert. */
            className="flex flex-col border-t border-[var(--color-line)] py-10 lg:block lg:border-l lg:border-t-0 lg:py-14 lg:pl-12"
          >
            {/* Kritiker Fix-Runde 1, Issue 1 ("riesige tote Weissflaeche, rechts nur zwei duenne
                Preiszeilen"). Der Befund ist eine Hoehen-Differenz, kein Abstandsfehler: links
                stehen Badge + zweizeilige H2 + Lead + CTA, rechts trug die Spalte nur eine
                dl mit ZWEI Zeilen. Gemessen im Beleg-PNG (preise-desktop-06-y4200.png):
                rechte Spalte endet bei y=891, die gemeinsame Unterkante der Sektion liegt bei
                y=1123 — 232px reine Leerflaeche unter den Preisen.
                Fix ist Inhalt, nicht Chrome: ein Foto-Anker ueber den Preiszeilen. Genau die
                Bauform, die diese Seite zwei Sektionen darueber schon traegt (WorkshopCard,
                Zeile 301: Bild ueber Titel, --radius-media, keine Karte) — also kein neuer
                Baustein und kein Card-Soup (DESIGN.md: Karten brauchen einen Job).
                Foto-Wahl und die verworfene erste Variante: siehe preise/content.ts bei
                `pass.image`. */}
            <img
              src={p.image.src}
              alt={p.image.alt}
              className="order-2 mt-8 aspect-[16/9] w-full rounded-[var(--radius-media)] object-cover object-[center_45%] lg:order-none lg:mb-7 lg:mt-0"
              width={1920}
              height={1280}
              loading="lazy"
            />
            <div className="order-1 lg:order-none">
              <PriceRows rows={p.rows} onRequest={c.onRequest} />
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Was passt zu dir? */
function FitSection({ c }: { c: PreiseContent }) {
  const { item } = useReveal();
  const f = c.fit;
  return (
    // Fix 4 (Fortsetzung): diese Sektion liegt zwischen zwei der drei gemessenen Fugen und
    // traegt deshalb oben UND unten die knappe Stufe. Sie ist eine kurze Entscheidungsliste,
    // kein Hoehepunkt — 96px Boden davor und dahinter waren hier am wenigsten verdient.
    <section className="bg-[var(--color-bg-soft)] py-12 lg:py-16">
      <Shell>
        {/* lg:sticky auf der linken Spalte: die Optionen-Liste rechts ist fast doppelt so hoch
            wie der Kopf links (535px vs 280px, gemessen 2026-08-06). Statt einer toten Flaeche
            laeuft der Kopf jetzt mit. */}
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <motion.div variants={item}>
              <SectionHead title={f.title} titleAccent={f.titleAccent} lead={f.lead} />
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={f.cta.href}>{f.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          {/* Vier weisse Schatten-Karten -> vier Zeilen unter einer Oberkante (Kritik Runde 2).
              Der Hover faerbt jetzt echt (Titel wird rot) statt nur den Schatten zu vergroessern. */}
          <Reveal className="border-t border-[var(--color-line)]" stagger={0.06}>
            {f.options.map((o) => (
              <motion.a
                key={o.when}
                variants={item}
                href={o.href}
                className="group flex items-center justify-between gap-5 border-b border-[var(--color-line)] py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-soft)]"
              >
                <span className="min-w-0">
                  <span className="block font-display text-lg font-bold leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-salsa)]">{o.when}</span>
                  <span className="mt-1 block text-[0.95rem] leading-snug text-[var(--color-ink-muted)]">{o.pick}</span>
                </span>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-salsa)] transition-colors duration-200 group-hover:border-[var(--color-salsa)] group-hover:bg-[var(--color-salsa)] group-hover:text-white">
                  <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </motion.a>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Final CTA (heller Closer, zwei CTAs) */
function ClosingSection({ c }: { c: PreiseContent }) {
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
    />
  );
}
