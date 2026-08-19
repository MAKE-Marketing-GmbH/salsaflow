
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Heart,
  Target,
  TrendingUp,
  User,
  UsersRound,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { PRIVAT, type PrivatContent } from '@/public/privat/content';
import {
  ClosingInvite,
  SubPageShell,
  Breadcrumb,
  PrimaryCta,
  GhostCta,
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

export function PrivatstundenPage() {
  const { lang } = useLang();
  const c = PRIVAT[lang];
  return (
    <SubPageShell seo={c.seo}>
      {/* R140: Marker dieser Route, Muster aus R139 (HeelsView). Traegt EINE
          route-lokale Korrektur, ohne WhatsAppFloat.tsx anzufassen (sitewide/tabu):
          Der Desktop-Float ist sonst eine Pille mit Label «WhatsApp» (im Vorher-Shot
          1440x730 gemessen). Hier Kreis wie mobil.
          Eigenes Attribut statt [data-heels-style-page] oder [data-split-hero-page]:
          die haengen an anderen Routen und wuerden diese mitziehen. */}
      <div data-privat-page="">
        <PrivatHero c={c} />
        <WhenSection c={c} />
        <FlowSection c={c} />
        <FormatsSection c={c} />
        <PricesSection c={c} />
        <NotForSection c={c} />
        <FinalCta c={c} />
        <FaqBlock title={c.faqTitle} items={c.faq} />
      </div>
    </SubPageShell>
  );
}

/* ---------------------------------------------------------------- Accent-Helper */
/** Setzt das Script-Akzentwort inline in die Headline (erste Fundstelle). Keine Copy-Aenderung,
 *  nur ein Wort visuell hervorgehoben. Fehlt der Accent im Text, wird der Text unveraendert gezeigt. */
function Accented({ text, accent, dark = false }: { text: string; accent?: string; dark?: boolean }): ReactNode {
  if (!accent) return text;
  const idx = text.indexOf(accent);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <TitleAccent dark={dark}>{accent}</TitleAccent>
      {text.slice(idx + accent.length)}
    </>
  );
}

/* ------------------------------------------------------------------------ Hero */
function PrivatHero({ c }: { c: PrivatContent }) {
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
      {/* R81 (Fold 1440x730): lg:pt-8 -> lg:pt-0 hebt den ganzen Hero-Inhalt auf
          Desktop um 32px. Zusammen mit H1 lg:mt-0 und CTA lg:mt-4 sitzt der rote
          Knopf "Privatstunde anfragen" ganz im Fenster. NUR Abstand. */}
      <Shell className="grid items-center gap-10 pb-14 pt-6 sm:pb-16 lg:grid-cols-[0.98fr_1.02fr] lg:gap-14 lg:pb-20 lg:pt-0">
        <motion.div data-reveal variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item} className="mb-6">
            <Breadcrumb trail={[c.crumb]} />
          </motion.div>

          {/* R81: die H1 bricht bei voller Groesse (4.3rem) auf 5 Zeilen (275px) und
              schiebt den CTA unter den Fold. Die Kappung auf 3.4rem (nur diese Seite,
              nur Desktop) bringt sie auf ~4 Zeilen und holt den CTA ins Fenster.
              Kein Text geaendert, nur die Schriftgroesse. */}
          {/* R140-Fix Mobil-Fold (Brief Punkt 4): Die H1 lief in die FAB-Spalte.
              Gemessen bei 390x844 mit sichtbarem Cookie-Banner (der hebt den Float
              um 78px auf y690-746, genau in die H1-Zeile): «genau dein Ziel.» endete
              bei x303, der Knopf beginnt bei x314 — 11px Luft, optisch sass der
              gruene Kreis direkt am Punkt hinter «Ziel». Bei 360x800 war es ein
              echter Rect-Overlap («dein Ziel» x144-295 gegen Float x284-340).
              max-w-[17rem] gilt nur unter sm und zwingt den Umbruch auf
              «Unterricht / für genau / dein Ziel.» — die laengste Zeile endet bei
              x201, die Knopf-Spalte ab x314 ist frei (113px Luft ohne Banner-Fall,
              135px danach). Kein pr-* auf einer Flex-Zeile (R138 Fund 7/8), keine
              Copy-Aenderung, kein --whatsapp-lift: der Float schwebt ueber der
              ganzen Seite, jede Hoehe traefe einen anderen Absatz (R139).
              Ab sm faellt die Kappung weg, Desktop bleibt bei 627px H1-Breite. */}
          <motion.h1
            variants={item}
            className="type-h1 mt-5 max-w-[17rem] sm:max-w-none lg:mt-0 lg:text-[clamp(2.6rem,5.2vw,3.4rem)]"
          >
            <Accented text={h.title} accent={h.titleAccent} />
          </motion.h1>
          {/* R140 Mobil-Fold: der Lead sitzt auf 390x844 in der FAB-Spalte
              (Vorher-Shot: FAB deckte «genau das, was du»; Nachher-Shot 1:
              FAB deckte «näch» in «nächste Level»). pr-20 gilt nur unter sm,
              nicht auf einer Flex-Zeile (R138 Fund 7/8). Ab sm faellt der
              Abstand, weil der Desktop-Float ein Kreis rechts unten ist. */}
          <motion.p variants={item} className={`mt-6 max-w-xl pr-20 sm:pr-0 ${sectionLead}`}>
            {h.lead}
          </motion.p>
          {/* R81: lg:mt-3 zieht die Chips auf Desktop hoch -> CTA bottom <= 730. */}
          <motion.ul variants={item} className="mt-7 flex flex-wrap gap-2 lg:mt-3">
            {h.bullets.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--color-ink)] shadow-sm"
              >
                <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
                {b}
              </li>
            ))}
          </motion.ul>
          {/* R81 (Fold 1440x730): CTA-Block. Position/Feinschliff sitzt am Shell
              (lg:pt-0) und am H1 (lg:mt-0) — siehe unten. Copy, Chips, Motiv bleiben. */}
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-4">
            <PrimaryCta href={h.primary.href}>{h.primary.label}</PrimaryCta>
            <GhostCta href={h.secondary.href}>{h.secondary.label}</GhostCta>
          </motion.div>
          <motion.p variants={item} className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {h.microcopy}
          </motion.p>
        </motion.div>

        {/* Mobil steht das Foto VOR dem Textblock (Critic Runde 11, Item 3): einspaltig lag
            es komplett unter dem Fold und der Einstieg war reine Textwand. Ab lg gilt wieder
            Text links / Foto rechts. */}
        <motion.div data-reveal variants={item} initial="hidden" animate="show" className="relative -order-1 lg:order-none">
          <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
            <img
              src={h.image.src}
              alt={h.image.alt}
              // R81 (Fold 1440x730): lg:aspect-[4/5] (Foto 814px) schob den CTA
              // "Privatstunde anfragen" auf top 831 — 155px komplett unter den Fold.
              // lg:aspect-[3/2] (Foto ~434px) schrumpft die rechte Spalte; items-center
              // zentriert beide Spalten hoeher -> CTA bottom ~676, ganz im Fenster.
              // Motiv, Copy, Chips, H1 bleiben. Salsa DE14/EN55, Kursaufbau 3/2 unberuehrt.
              className="aspect-[4/5] w-full object-cover object-[center_38%] sm:aspect-[5/4] lg:aspect-[3/2]"
              width={1200}
              height={1500}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          {/* Links angedockt statt rechts: der fixe WhatsApp-FAB lag im Erst-Viewport auf
              der Kartenecke (Sweep 14.08.2026). Festes Papier statt Glas (bg-white/92 +
              backdrop-blur) — Glas auf Fotos ist seit Critic-Runde 4/5 verboten. */}
          {/* bottom-4 statt -bottom-5: die herausragende Karte wurde am Fold/Cookie-Banner
              abgeschnitten und riss aus dem Foto (Critic Runde 11, Item 3). */}
          <div className="absolute bottom-4 left-5 right-5 rounded-[var(--radius-card)] border border-black/5 bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] sm:right-auto sm:max-w-[18rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{h.cardLabel}</p>
            <p className="mt-1 font-display text-lg font-bold leading-tight">{h.cardText}</p>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------- Wann Privatstunden Sinn machen */
/* R140: drei Karten, drei Icons. Hochzeitstanz, Technik, Levelwechsel. */
const WHEN_ICONS = [Heart, Target, TrendingUp];

function WhenSection({ c }: { c: PrivatContent }) {
  const { item } = useReveal();
  const w = c.when;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-3xl">
          <motion.h2 variants={item} className={sectionTitle}>
            <Accented text={w.title} accent={w.titleAccent} />
          </motion.h2>
          <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
            {w.intro}
          </motion.p>
        </Reveal>
        {/* R140 (Video 04:21, Frame p-08): Vorher standen hier sechs gleich laute Karten
            in zwei Reihen. Jetzt tragen die drei haeufigsten Anlaesse den Block, die
            drei selteneren stehen als leise Zeile darunter. Eine Reihe statt zwei,
            und der Blick hat eine Rangfolge. mt-14 statt mt-12: mehr Luft zum Lead. */}
        <Reveal className="mt-14 grid gap-4 sm:grid-cols-3" stagger={0.07}>
          {w.cards.map((card, i) => {
            const Icon = WHEN_ICONS[i % WHEN_ICONS.length];
            return (
              <motion.div
                key={card.title}
                variants={item}
                className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                  <Icon size={20} strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-5 type-h3 text-[var(--color-ink)]">{card.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{card.text}</p>
              </motion.div>
            );
          })}
        </Reveal>
        {/* Kein Kasten, kein Icon, kein Schatten: diese drei Anlaesse sollen lesbar sein,
            aber nicht mit den Karten darueber um Aufmerksamkeit kaempfen. */}
        <Reveal className="mt-8">
          <motion.div variants={item} className="flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:flex-wrap sm:items-baseline">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              {w.moreLabel}
            </p>
            <ul className="flex flex-col gap-x-7 gap-y-2 text-[0.98rem] text-[var(--color-ink-muted)] sm:flex-row sm:flex-wrap">
              {w.more.map((entry) => (
                <li key={entry} className="flex items-start gap-2">
                  <Check size={13} strokeWidth={3} aria-hidden className="mt-1.5 shrink-0 text-[var(--color-salsa)]" />
                  {entry}
                </li>
              ))}
            </ul>
          </motion.div>
        </Reveal>
        <Reveal className="mt-12">
          <motion.div variants={item}>
            <PrimaryCta href={w.cta.href}>{w.cta.label}</PrimaryCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------- Ablauf einer Privatstunde */
function FlowSection({ c }: { c: PrivatContent }) {
  const { item } = useReveal();
  const f = c.flow;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{f.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              <Accented text={f.title} accent={f.titleAccent} />
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {f.body}
            </motion.p>
            <motion.ol variants={item} className="mt-8 space-y-3">
              {f.steps.map((p, i) => (
                <li
                  key={p.title}
                  className="grid grid-cols-[3rem_1fr] items-start gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-4 sm:p-5"
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
              <PrimaryCta href={f.cta.href}>{f.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              {/* R140-Fix: Bild getauscht (Begruendung + Messwerte in privat/content.ts
                  am flow.image). Vorher lag hier derselbe Studio-Schnitt wie im Hero,
                  nur naeher, und der Crop schnitt links ein Gesicht an.
                  Die Quelle ist hochkant 1066x1600; bei 1:1 bleibt der Lehrer ganz im
                  Ausschnitt. object-[center_28%] haelt Koepfe und Arme im Bild.
                  photo-grade-private bleibt weg: kein CSS-Filter als Bildersatz. */}
              <img
                src={f.image.src}
                alt={f.image.alt}
                className="aspect-square w-full object-cover object-[center_28%]"
                width={1066}
                height={1600}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------------ Formate */
const FORMAT_ICONS = [User, Heart, UsersRound];

function FormatsSection({ c }: { c: PrivatContent }) {
  const { item } = useReveal();
  const f = c.formats;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        {/* R140-Fix: SectionHead haengt titleAccent HINTEN an den Titel an
            (kit.tsx: `{title} {titleAccent ? <TitleAccent>…`). Dadurch stand hier
            «Allein, zu zweit oder zu dritt. zu dritt» doppelt im Shot. Accented
            setzt das Wort inline, wie in allen anderen Sektionen dieser Seite. */}
        <Reveal className="max-w-2xl">
          <motion.h2 variants={item} className={sectionTitle}>
            <Accented text={f.title} accent={f.titleAccent} />
          </motion.h2>
        </Reveal>
        {/* R140-Fix (Video 04:21 «viel zu viel», zielt genau auf diese Karten):
            vorher drei gleich laute weisse Icon-Karten mit Rahmen und Schatten,
            genauso laut wie das alte When-Grid. Jetzt eine Liste mit Trennlinien:
            das Format ist eine Nebeninfo, kein eigener Block. Kein Rahmen, kein
            Schatten, keine Karte. Copy unveraendert. */}
        <Reveal className="mt-10" stagger={0.08}>
          <motion.ul variants={item} className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {f.items.map((fmt, i) => {
              const Icon = FORMAT_ICONS[i % FORMAT_ICONS.length];
              return (
                <li
                  key={fmt.name}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-6"
                >
                  <span className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                    <Icon size={18} strokeWidth={2} aria-hidden className="shrink-0 text-[var(--color-salsa)]" />
                    <span className="font-display text-lg font-bold text-[var(--color-ink)]">{fmt.name}</span>
                  </span>
                  <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{fmt.text}</span>
                </li>
              );
            })}
          </motion.ul>
        </Reveal>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------------------- Preise & Pakete */
function PricesSection({ c }: { c: PrivatContent }) {
  const { item } = useReveal();
  const p = c.prices;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal className="max-w-md">
            <motion.h2 variants={item} className={sectionTitle}>
              <Accented text={p.title} accent={p.titleAccent} />
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {p.body}
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta href={p.cta.href}>{p.cta.label}</PrimaryCta>
              <a
                href={p.altCta.href}
                className="group inline-flex min-h-12 items-center gap-1.5 px-2 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {p.altCta.label}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </Reveal>
          <Reveal className="rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-3 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-4">
            <motion.ul variants={item} className="divide-y divide-[var(--color-line)]">
              {p.rows.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6">
                  <span className="flex items-center gap-3 text-[0.98rem] font-semibold text-[var(--color-ink)]">
                    <BeatMark />
                    {row.label}
                  </span>
                  <span className="shrink-0 font-display text-lg font-extrabold tabular-nums text-[var(--color-salsa)] sm:text-xl">
                    {row.price}
                  </span>
                </li>
              ))}
            </motion.ul>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ----------------------------------------------------------------- Fuer wen nicht */
function NotForSection({ c }: { c: PrivatContent }) {
  const { item } = useReveal();
  const n = c.notFor;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="mx-auto max-w-2xl rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white px-6 py-12 text-center shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:px-10 sm:py-14">
          <motion.h2
            variants={item}
            className="type-h2 text-[var(--color-ink)]"
          >
            <Accented text={n.title} accent={n.titleAccent} />
          </motion.h2>
          <motion.p variants={item} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
            {n.body}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex justify-center">
            <PrimaryCta href={n.cta.href}>{n.cta.label}</PrimaryCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------- Final CTA */
function FinalCta({ c }: { c: PrivatContent }) {
  const cl = c.closing;
  return (
    <ClosingInvite
      titleNode={<Accented text={cl.title} accent={cl.titleAccent} />}
      body={cl.body}
      ctaLabel={cl.primary.label}
      ctaHref={cl.primary.href}
      secondary={cl.secondary}
      note={cl.microcopy}
    />
  );
}
