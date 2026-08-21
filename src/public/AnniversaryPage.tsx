// Anniversary-Weekend-Unterseite (/events-workshops/anniversary-weekend) aus dem V3-Copyplan
// (pages/13). Rhythmus: Hero -> Was ist das (3 Saeulen) -> Programm (Template) -> Fuer wen ->
// Beweis durch Bilder -> Final CTA -> FAQ.
//
// Marke bleibt hell und grosszuegig (nie dunkler Club): paper-warm/bg-soft im Wechsel, Rot
// #AD1827 sparsam, ein Script-Akzentwort pro Headline. Der Programm-Block bleibt bewusst ein
// Template ohne erfundene Termine (Plan: echte Daten leben im Eventkalender). Copy 1:1 aus
// anniversary-content.ts.

import { motion } from 'framer-motion';
// R188 E5: `Check` lief nur in der entfernten AudienceSection.
import { GraduationCap, Sparkles, Users, type LucideIcon } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ANNIVERSARY, type AnniversaryContent } from '@/public/events/anniversary-content';
import {
  ClosingInvite,
  SubPageShell,
  Breadcrumb,
  PrimaryCta,
  GhostCta,
  SectionHead,
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

// Sprechende Icons fuer die drei Saeulen (Lernen / Erleben / Verbinden).
const PILLAR_ICONS: LucideIcon[] = [GraduationCap, Sparkles, Users];

export function AnniversaryPage() {
  const { lang } = useLang();
  const c = ANNIVERSARY[lang];
  return (
    <SubPageShell seo={c.seo}>
      <AnniversaryHero c={c} />
      <AboutSection c={c} />
      <ProgrammSection c={c} />
      {/* R188 E5 (Video 04:35 "Das hier würde ich weglassen"): die Sektion "Für wen /
          Für alle, die mehr wollen als eine normale Kurswoche" ist raus. Sie wiederholte
          mit ihrer Vier-Punkte-Liste, was die drei Saeulen in AboutSection schon sagen.
          Die Funktion AudienceSection ist mitentfernt, damit kein toter Code liegen
          bleibt; die Copy steht weiter in anniversary-content.ts und ist damit ohne
          Textverlust zurueckholbar. */}
      <ProofSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero (hell) */
function AnniversaryHero({ c }: { c: AnniversaryContent }) {
  const { container, item } = useReveal();
  const h = c.hero;
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
      style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
      />
      {/* R82 (Fold 1440x730): lg:pt-8 -> lg:pt-0 hebt den Hero-Inhalt um 32px. Zusammen
          mit H1-Kappung, Foto lg:aspect-[3/2] und CTA lg:mt-4 sitzt der rote Knopf
          "Programm ansehen" ganz im Fenster. NUR Abstand + H1-Schriftgroesse. */}
      {/* R188 E6, Teil 1 (Video 05:10 "Hier, das ist viel zu fest. Also viel zu nah
          beieinander"). Gemessen bei 1440x900: die H1 endete bei x=679, das Foto begann
          bei x=736 — 57px Luft zwischen Textspalte und Bildkante. Der Spaltenabstand
          selbst war lg:gap-14 (56px); die H1 lief bis an ihre Spaltenkante und stiess
          damit fast an den Bildrahmen.

          lg:gap-20 (80px) gibt beiden Spalten die fehlende Luft. Weil `items-center`
          bleibt, verschiebt das keine vertikale Ausrichtung.

          R188 E6, Teil 4 — Nachtrag Runde 2. gap-20 allein war zu wenig: mehr
          Spaltenabstand schiebt die BILDspalte nach rechts, die linke Textkante bleibt
          liegen. Fuer den Knopf aendert sich dadurch nichts. Der Grund, warum die
          CTA-Reihe verloren aussah, ist die Spaltenteilung: bei 0.98fr war die
          Textspalte 615px breit, die H1 nutzte davon 615px, die CTA-Reihe nur 365px.
          0.86fr/1.14fr nimmt der Textspalte die ungenutzte Breite (615 -> 540) und gibt
          sie dem Foto. Die H1 bricht dadurch weiter oben um, Lead und CTA-Reihe ruecken
          naeher an die Spaltenkante, und der Knopf steht nicht mehr in einem Loch.
          Gegengeprueft im Screenshot, nicht nur in der Zahl. */}
      <Shell className="grid items-center gap-10 pb-14 pt-6 sm:pb-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20 lg:pb-20 lg:pt-0">
        <motion.div data-reveal variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item} className="mb-6">
            <Breadcrumb trail={c.crumbs} />
          </motion.div>
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          {/* R82: H1 bricht bei 4.3rem auf 5 Zeilen (275px). Kappung auf 3.4rem (nur
              diese Seite, nur Desktop) bringt ~3-4 Zeilen. Kein Text geaendert. */}
          <motion.h1
            variants={item}
            className="type-h1 mt-5 lg:mt-0 lg:text-[clamp(2.6rem,5.2vw,3.4rem)]"
          >
            {h.h1.pre}
            <TitleAccent>{h.h1.accent}</TitleAccent>
            {h.h1.post}
          </motion.h1>
          <motion.p variants={item} className={`mt-6 max-w-xl ${sectionLead}`}>
            {h.lead}
          </motion.p>
          {/* R188 E6, Fix-Runde 3. Die Runde-2-Aenderung hat den Knopf nicht bewegt:
              Messung vorher bei 1440px: CTA-Wrapper x=52..592, Pill x=52..257,
              Ghost x=273..421. Rechts vom CTA-Paar blieben 171px leer; links 0px.
              Der Kritiker hatte deshalb recht: die schmalere Textspalte rahmte den
              Knopf nur neu, liess seine Position aber exakt bei x=52.

              `lg:justify-center` verteilt den freien Raum der 540px-Zeile gleich:
              Das 369px breite Paar rueckt um 85px nach rechts. H1 und Lead bleiben
              linksbuendig, mobil bleibt die gestapelte CTA-Reihe unveraendert. */}
          <motion.div
            variants={item}
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-6 lg:justify-center"
          >
            <PrimaryCta href={h.primary.href}>{h.primary.label}</PrimaryCta>
            <GhostCta href={h.secondary.href}>{h.secondary.label}</GhostCta>
          </motion.div>
          <motion.p variants={item} className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {h.microcopy}
          </motion.p>
        </motion.div>

        <motion.div data-reveal variants={item} initial="hidden" animate="show" className="relative">
          <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
            <img
              src={h.image.src}
              alt={h.image.alt}
              // R82: lg:aspect-[4/5] (Foto 814px) -> lg:aspect-[3/2] (~434px) schrumpft
              // die rechte Spalte; items-center zentriert hoeher.
              //
              // R188 E6, Teil 2 (Video 05:16 "Das Bild ist unnötig abgeschnitten, ein
              // bisschen höher") + E7 (05:24 "die Köpfe nicht abgeschnitten").
              // ROOT CAUSE, nicht Symptom: die Quelle events-hero-1998.webp ist
              // 1998x1124, also 16:9 (1.778). Der Rahmen erzwang 3/2 (1.5).
              // Nachgerechnet am gerenderten Rahmen 651x434:
              //   scale = max(651/1998, 434/1124) = 0.386 -> skaliert 771x434
              //   Ueberhang X = 120px, Ueberhang Y = 0
              // Geschnitten wurde also LINKS und RECHTS, nie oben. Der Y-Wert 38% in
              // object-[center_38%] konnte gar nichts heben — er hatte keinen Weg.
              // Weggefallen sind 120px Bildbreite, und darin standen die aeusseren
              // Taenzer:innen der Gruppe.
              //
              // Fix ist das Seitenverhaeltnis, nicht die Position: lg:aspect-[16/9]
              // ist exakt das Verhaeltnis der Datei. Ueberhang X und Y sind damit beide
              // 0 — das Foto steht vollstaendig im Rahmen, keine Person wird
              // angeschnitten, kein Kopf gekappt. Die Rahmenhoehe sinkt von 434px auf
              // 366px, der Hero wird also zugleich ruhiger.
              // object-center statt object-[center_38%]: bei Ueberhang 0 ist jede
              // Position gleichwertig, und der ehrliche Wert ist die Mitte.
              //
              // R188 Fix-Runde 3, E7 mobil. Der Satz "mobil schneidet der Rahmen
              // bewusst" stand hier zwei Runden lang und war falsch. Nachgemessen
              // mit Gesichtserkennung im 390er-Rendering: aspect-[4/5] presste die
              // 16:9-Datei in ein Hochformat, schnitt links und rechts je ~230px weg
              // und zerteilte dabei die aeussere Taenzerin senkrecht — genau der
              // Anschnitt, den E7 verbietet. Die Zahlen bei 348px Spaltenbreite:
              //   4/5 (348x435) -> 2 angeschnittene Koepfe
              //   5/4 (348x278) -> 1 angeschnittener Kopf
              //   4/3 (348x261) -> 0
              // Darum ueberall 4/3 oder flacher. Ein Gruppenfoto im Querformat
              // vertraegt kein Hochformat-Fenster.
              className="aspect-[4/3] w-full object-cover object-center lg:aspect-[16/9]"
              width={1998}
              height={1124}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          {/* Links angedockt + festes Papier statt Glas — FAB lag auf der Kartenecke,
              Glas auf Fotos verboten (Sweep 14.08.2026, wie PrivatstundenPage). */}
          {/* bottom-4 statt -bottom-5: die Karte hing aus dem Foto (390 klar sichtbar,
              Critic Runde 12, Item 3 — gleiches Muster wie /privatstunden in Runde 11). */}
          <div className="absolute bottom-4 left-5 right-5 rounded-[var(--radius-card)] border border-black/5 bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] sm:right-auto sm:max-w-[18rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{h.cardLabel}</p>
            <p className="mt-1 font-display text-lg font-bold leading-tight">{h.cardText}</p>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Was ist das (3 Saeulen) */
function AboutSection({ c }: { c: AnniversaryContent }) {
  const { item } = useReveal();
  const a = c.about;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{a.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {a.title} {a.titleAccent ? <TitleAccent>{a.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {a.body}
            </motion.p>
            <motion.div variants={item} className="mt-8 grid gap-4">
              {a.pillars.map((p, i) => {
                const Icon = PILLAR_ICONS[i] ?? Sparkles;
                return (
                  <div
                    key={p.title}
                    className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                      <Icon size={20} strokeWidth={2} aria-hidden />
                    </span>
                    <div>
                      <h3 className="type-h3 text-[var(--color-ink)]">{p.title}</h3>
                      <p className="mt-1.5 text-[0.96rem] leading-relaxed text-[var(--color-ink-muted)]">{p.text}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div
              variants={item}
              className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]"
            >
              <img
                src={a.image.src}
                alt={a.image.alt}
                className="aspect-[4/5] w-full object-cover object-[center_42%] lg:aspect-[4/3] lg:object-top"
                width={1400}
                height={1750}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Programm (Template) */
function ProgrammSection({ c }: { c: AnniversaryContent }) {
  const { item } = useReveal();
  const p = c.programm;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={p.eyebrow} title={p.title} lead={p.intro} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]" stagger={0.08}>
          <motion.div
            variants={item}
            className="rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8"
          >
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              <BeatMark />
              {p.fieldsIntro}
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {p.fields.map((field) => (
                <li
                  key={field}
                  className="flex items-center gap-3 rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-4 py-3 text-[0.96rem] leading-snug text-[var(--color-ink)]"
                >
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-salsa)]" />
                  {field}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            variants={item}
            className="flex flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-7 shadow-[0_14px_35px_rgba(17,17,17,0.04)] sm:p-8"
          >
            <p className="text-[0.98rem] font-semibold leading-relaxed text-[var(--color-ink)]">{p.questionsIntro}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.questions.map((q) => (
                <li
                  key={q}
                  className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-sm font-medium text-[var(--color-ink)]"
                >
                  {q}
                </li>
              ))}
            </ul>
            <a
              href={p.cta.href}
              className="group mt-auto inline-flex min-h-12 items-center gap-1.5 pt-7 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {p.cta.label}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Beweis durch Bilder */
function ProofSection({ c }: { c: AnniversaryContent }) {
  const { item } = useReveal();
  const p = c.proof;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={p.eyebrow} title={p.title} />
        </Reveal>
        <Reveal className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" stagger={0.07}>
          {p.images.map((img, i) => (
            <motion.div
              key={img.src}
              variants={item}
              className={
                i === 0
                  ? 'col-span-2 overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)] lg:col-span-2 lg:row-span-2'
                  : 'overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_14px_40px_rgba(17,17,17,0.04)]'
              }
            >
              <img
                src={img.src}
                alt={img.alt}
                // lg: Kartenhoehen kommen aus dem Grid (row-span-2-Kachel + zwei Zeilen
                // Hochformat daneben). Mit fixem Aspect blieb unten ein weisser Kartenboden —
                // erst bei den kleinen Kacheln (Kritik-Runde), in Runde 3 auch bei der grossen
                // (lg:aspect-square < Zeilenhoehe). Alle fuellen die Karte deshalb mit h-full.
                className={cn(
                  'aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full',
                  // Zwei Hochformat-Motive in einer Querformat-Kachel: mittig geschnitten fehlte
                  // dem stehenden Mann in hp-14 der Kopf ganz, in event-07 beiden die Stirn.
                  // Am gerenderten Ausschnitt geprueft.
                  img.src.includes('hp-14')
                    ? 'object-[center_5%]'
                    : img.src.includes('event-07')
                      ? 'object-[center_10%]'
                      : 'object-center',
                )}
                width={1200}
                height={900}
                loading="lazy"
              />
            </motion.div>
          ))}
        </Reveal>
        <Reveal className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          {p.links.map((link) => (
            <motion.a
              key={link.href}
              variants={item}
              href={link.href}
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {link.label}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </motion.a>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Final CTA (hell) */
function ClosingSection({ c }: { c: AnniversaryContent }) {
  const cl = c.closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  return (
    <ClosingInvite
      eyebrow={cl.eyebrow}
      title={cl.title}
      titleAccent={cl.titleAccent}
      body={cl.body}
      ctaLabel={cl.primary.label}
      ctaHref={cl.primary.href}
      secondary={cl.secondary}
      surface="soft"
    />
  );
}
