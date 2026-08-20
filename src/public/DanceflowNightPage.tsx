// Danceflow-Night-Unterseite (/events-workshops/danceflow-night) aus dem V3-Copyplan (pages/12).
// Rhythmus: Hero (dunkel, naechtlich) -> Warum kommen -> Ablauf des Abends (dunkles Band) ->
// Fuer Anfaenger:innen -> Eintritt -> Etiquette -> Final CTA (dunkel) -> FAQ.
//
// Danceflow ist der Social-Dance-Abend und darf naechtlicher wirken (Auftrag): drei dunkle
// Flaechen (Hero, Ablauf, Closer) im Wechsel mit den hellen paper-warm/bg-soft-Sektionen. Rot
// #AD1827 bleibt sparsam (CTA, Marker, ein Script-Akzentwort). Copy 1:1 aus danceflow-content.ts.

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { DANCEFLOW, type DanceflowContent } from '@/public/events/danceflow-content';
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

export function DanceflowNightPage() {
  const { lang } = useLang();
  const c = DANCEFLOW[lang];
  return (
    <SubPageShell seo={c.seo}>
      <DanceflowHero c={c} />
      <WhySection c={c} />
      <FlowSection c={c} />
      <BeginnerSection c={c} />
      <PriceSection c={c} />
      <EtiquetteSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero (dunkel, full-bleed) */
function DanceflowHero({ c }: { c: DanceflowContent }) {
  const { container, item } = useReveal();
  const h = c.hero;
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
      style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.10)_0%,transparent_66%)]"
      />
      <Shell className="grid items-center gap-10 pb-16 pt-6 sm:pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:pb-24 lg:pt-8">
        <motion.div data-reveal variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item} className="mb-6">
            <Breadcrumb trail={c.crumbs} />
          </motion.div>
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          <motion.h1
            variants={item}
            className="type-h1 mt-5"
          >
            {h.h1.pre}
            <TitleAccent>{h.h1.accent}</TitleAccent>
            {h.h1.post}
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
            {h.lead}
          </motion.p>
          <motion.ul variants={item} className="mt-7 flex flex-wrap gap-2">
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
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryCta href={h.primary.href}>{h.primary.label}</PrimaryCta>
            <GhostCta href={h.secondary.href}>{h.secondary.label}</GhostCta>
          </motion.div>
          <motion.p variants={item} className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {h.microcopy}
          </motion.p>
          <motion.div
            variants={item}
            className="mt-9 inline-flex items-center gap-3.5 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white px-5 py-4 shadow-sm"
          >
            <BeatMark />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{h.cardLabel}</p>
              <p className="mt-1 type-h3 text-[var(--color-ink)]">{h.cardText}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.figure
          data-reveal
          variants={item}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)]"
        >
          <img
            src={h.image.src}
            alt={h.image.alt}
            className="aspect-[4/3] w-full object-cover object-[center_42%]"
            width={h.image.width}
            height={h.image.height}
            loading="eager"
            fetchPriority="high"
          />
        </motion.figure>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Warum kommen (hell) */
function WhySection({ c }: { c: DanceflowContent }) {
  const { item } = useReveal();
  const w = c.why;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="max-w-md">
            <motion.div variants={item}>
              <Eyebrow>{w.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {w.title} {w.titleAccent ? <TitleAccent>{w.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {w.body}
            </motion.p>
            <motion.div
              variants={item}
              className="mt-8 overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)]"
            >
              {/* 05-v3.webp ist 1360x2048 (Hochformat). Ein erzwungenes 4/3 zeigte nur
                  y 21%..71% der Quelle und schnitt den Scheitel der Taenzerin ab
                  (Raphael 20.08.). 4/5 folgt dem Hochformat und zeigt y 3.4%..86.4%:
                  Scheitel (9.5%) und Kinn (30%) liegen beide im Bild. */}
              <img
                src={w.image.src}
                alt={w.image.alt}
                className="aspect-[4/5] w-full object-cover object-[center_20%]"
                width={w.image.width}
                height={w.image.height}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
          <Reveal className="grid gap-4" stagger={0.08}>
            {w.cards.map((b, i) => (
              <motion.div
                key={b.title}
                variants={item}
                className="flex gap-5 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
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
            <motion.div variants={item} className="pt-1">
              <a
                href={w.cta.href}
                className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {w.cta.label}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Ablauf (dunkles Band) */
function FlowSection({ c }: { c: DanceflowContent }) {
  const { item } = useReveal();
  const f = c.flow;
  return (
    <section className="bg-[var(--color-surface-dark)] py-20 text-white lg:py-32">
      <Shell>
        <Reveal className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div variants={item} className="max-w-xl">
            <Eyebrow dark>{f.eyebrow}</Eyebrow>
            <h2 className="type-h2 mt-5">
              {f.title}
            </h2>
            <ol className="mt-9 space-y-3">
              {f.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[3rem_1fr] items-start gap-4 rounded-[var(--radius-card)] border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-salsa)] font-display text-base font-bold tabular-nums text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="type-h3 text-white">{s.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-white/70">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href={f.cta.href}
              className="btn-base btn-primary group mt-8 px-6 py-3 text-sm"
            >
              {f.cta.label}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
          {/* lg:mr-36: der fixe WhatsApp-FAB lag auf dem rechten unteren Bildrand
              (Critic Runde 8, Item 5 — margin statt padding, sonst entsteht Leerraum
              im gerundeten Rahmen). */}
          <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] ring-1 ring-white/10 lg:sticky lg:top-28 lg:mr-36">
            <img
              src={f.image.src}
              alt={f.image.alt}
              className="aspect-[4/5] w-full object-cover"
              width={f.image.width}
              height={f.image.height}
              loading="lazy"
            />
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Fuer Anfaenger:innen (hell) */
function BeginnerSection({ c }: { c: DanceflowContent }) {
  const { item } = useReveal();
  const b = c.beginner;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{b.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {b.title} {b.titleAccent ? <TitleAccent>{b.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {b.body}
            </motion.p>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={b.cta.href}>{b.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal>
            <motion.div
              variants={item}
              className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]"
            >
              <img
                src={b.image.src}
                alt={b.image.alt}
                className="aspect-[5/4] w-full object-cover object-[center_40%]"
                width={b.image.width}
                height={b.image.height}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Eintritt (hell, Microcards) */
function PriceSection({ c }: { c: DanceflowContent }) {
  const { item } = useReveal();
  const p = c.price;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={p.eyebrow} title={p.title} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 sm:grid-cols-3" stagger={0.08}>
          {p.cards.map((card, i) => (
            <motion.div
              key={card.label}
              variants={item}
              className={
                i === 0
                  ? 'flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-salsa)]/30 bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)]'
                  : 'flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_14px_40px_rgba(17,17,17,0.04)]'
              }
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{card.label}</p>
              <p className="mt-4 font-display text-3xl font-extrabold leading-none text-[var(--color-salsa)] sm:text-[2.25rem]">
                {card.value}
              </p>
            </motion.div>
          ))}
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item}>
            <a
              href={p.cta.href}
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
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

/* -------------------------------------------------------------------- Etiquette (hell, ruhig) */
function EtiquetteSection({ c }: { c: DanceflowContent }) {
  const { item } = useReveal();
  const e = c.etiquette;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="mx-auto max-w-3xl rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-8 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-12">
          <motion.div variants={item}>
            <Eyebrow>{e.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={item}
            className="type-h2 mt-5 text-[var(--color-ink)]"
          >
            {e.title}
          </motion.h2>
          <motion.ul variants={item} className="mt-7 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {e.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[0.98rem] leading-relaxed text-[var(--color-ink)]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                {b}
              </li>
            ))}
          </motion.ul>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Final CTA (dunkles Band) */
function ClosingSection({ c }: { c: DanceflowContent }) {
  const cl = c.closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  // `surface="night"` statt eigener Sektion: das Nachtfoto darf laut Issue 5 nur in einem
  // dunklen Band stehen, und genau das ist diese Seite. Aufbau, Takt und Buttons sind
  // trotzdem dieselben wie auf allen hellen Seiten.
  return (
    <ClosingInvite
      eyebrow={cl.eyebrow}
      title={cl.title}
      titleAccent={cl.titleAccent}
      body={cl.body}
      ctaLabel={cl.primary.label}
      ctaHref={cl.primary.href}
      secondary={cl.secondary}
      note={cl.microcopy}
      surface="night"
      nightImage={cl.image}
    />
  );
}
