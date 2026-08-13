// Eventkalender-Seite (/events-workshops/eventkalender) aus dem V3-Copyplan (pages/15).
// Sektions-Rhythmus laut Plan: Hero -> Filter & Kategorien -> Eventkarte (Formate) ->
// Featured Event -> Leere Zustaende (Empty-State) -> Final CTA -> FAQ. Design-System
// strikt (hell im Wechsel paper-warm/bg-soft, Rot #AD1827 sparsam, Reveal-Takt wie
// Startseite). Copy 1:1 aus eventkalender-content.ts.
//
// Merksatz: der ehrliche "Termine folgen"-Empty-State fuehrt nie in eine Sackgasse und
// erfindet keine Datumsangaben. Einzige Zeitangabe ist der gesicherte Danceflow-Rhythmus.

import { motion } from 'framer-motion';
import { CalendarDays, Sparkles, Star } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { EVENTKALENDER, type EventkalenderContent } from '@/public/events/eventkalender-content';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  FaqBlock,
  PrimaryCta,
  GhostCta,
  Shell,
  Eyebrow,
  TitleAccent,
  CtaArrow,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';

export function EventkalenderPage() {
  const { lang } = useLang();
  const c = EVENTKALENDER[lang];
  return (
    <SubPageShell seo={c.seo}>
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'wide' — die H1 laeuft ueber die
          volle Shell, darunter beginnt sofort der Filter/Kalender. */}
      <SubHero
        axis="wide"
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        microcopy={c.hero.microcopy}
      />
      <FilterSection c={c} />
      <CardsSection c={c} />
      <FeaturedSection c={c} />
      <EmptyStateSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
    </SubPageShell>
  );
}

/* --------------------------------------------------- Filter & Kategorien */
function FilterSection({ c }: { c: EventkalenderContent }) {
  const { item } = useReveal();
  const f = c.filter;
  return (
    <section id="filter" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <motion.h2 variants={item} className={sectionTitle}>
            {f.title} {f.titleAccent ? <TitleAccent>{f.titleAccent}</TitleAccent> : null}
          </motion.h2>
          <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
            {f.body}
          </motion.p>
        </Reveal>
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {f.groups.map((g) => (
            <motion.div
              key={g.label}
              variants={item}
              className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
            >
              <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                <Sparkles size={14} strokeWidth={2.25} aria-hidden />
                {g.label}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.options.map((o) => (
                  <li
                    key={o}
                    className="rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-1.5 text-sm font-medium text-[var(--color-ink)]"
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Eventkarten-Formate */
function CardsSection({ c }: { c: EventkalenderContent }) {
  const { item } = useReveal();
  const cards = c.cards;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead title={cards.title} lead={cards.intro} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-2" stagger={0.08}>
          {cards.items.map((ev) => (
            <motion.article
              key={ev.name}
              variants={item}
              className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8"
            >
              <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                <CalendarDays size={14} strokeWidth={2.25} aria-hidden />
                {ev.when}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-[var(--color-ink)]">
                {ev.name}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ev.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-muted)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{ev.text}</p>
              <a
                href={ev.cta.href}
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {ev.cta.label}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.article>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Featured Event */
function FeaturedSection({ c }: { c: EventkalenderContent }) {
  const { item } = useReveal();
  const f = c.featured;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            variants={item}
            className="order-2 overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)] lg:order-1"
          >
            <img
              src={f.image.src}
              alt={f.image.alt}
              className="aspect-[16/11] w-full object-cover"
              width={1400}
              height={960}
              loading="lazy"
            />
          </motion.div>
          <motion.div variants={item} className="order-1 max-w-xl lg:order-2">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              <Star size={14} strokeWidth={2.25} aria-hidden />
              Featured
            </p>
            <h2 className={`mt-5 ${sectionTitle}`}>
              {f.title} {f.titleAccent ? <TitleAccent>{f.titleAccent}</TitleAccent> : null}
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{f.body}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <PrimaryCta href={f.cta.href}>{f.cta.label}</PrimaryCta>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {f.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)] transition-colors hover:text-[var(--color-salsa)]"
                  >
                    {l.label}
                    <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Leere Zustaende (Empty-State) */
function EmptyStateSection({ c }: { c: EventkalenderContent }) {
  const { item } = useReveal();
  const e = c.empty;
  return (
    <section id="kalender" className="scroll-mt-24 bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <motion.div variants={item}>
            <Eyebrow>{e.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
            {e.title}
          </motion.h2>
        </Reveal>
        <Reveal className="mt-12">
          <motion.div
            variants={item}
            className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.35)]"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[16rem]">
                {/* TODO KI-Grafik Kalender: vorerst echtes Event-Foto als Platzhalter (03_KI_BILD_LUECKEN). */}
                <img
                  src={e.image.src}
                  alt={e.image.alt}
                  className="h-full w-full object-cover object-[center_45%]"
                  width={1400}
                  height={960}
                  loading="lazy"
                />
                <div aria-hidden className="absolute inset-0 bg-[var(--color-ink)]/10" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                  <CalendarDays size={14} strokeWidth={2.25} aria-hidden />
                  {e.stateLabel}
                </p>
                <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
                  {e.noResults}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PrimaryCta href={e.primary.href}>{e.primary.label}</PrimaryCta>
                  <GhostCta href={e.secondary.href}>{e.secondary.label}</GhostCta>
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Final CTA (zwei CTAs) */
function ClosingSection({ c }: { c: EventkalenderContent }) {
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
      surface="soft"
    />
  );
}
