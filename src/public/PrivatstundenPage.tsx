
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Heart,
  Target,
  TrendingUp,
  RotateCcw,
  Users,
  Sparkles,
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

export function PrivatstundenPage() {
  const { lang } = useLang();
  const c = PRIVAT[lang];
  return (
    <SubPageShell seo={c.seo}>
      <PrivatHero c={c} />
      <WhenSection c={c} />
      <FlowSection c={c} />
      <FormatsSection c={c} />
      <PricesSection c={c} />
      <NotForSection c={c} />
      <FinalCta c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
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
      <Shell className="grid items-center gap-10 pb-14 pt-6 sm:pb-16 lg:grid-cols-[0.98fr_1.02fr] lg:gap-14 lg:pb-20 lg:pt-8">
        <motion.div data-reveal variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={item} className="mb-6">
            <Breadcrumb trail={[c.crumb]} />
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.022em] text-balance sm:text-[3rem] lg:text-[3.4rem]"
          >
            <Accented text={h.title} accent={h.titleAccent} />
          </motion.h1>
          <motion.p variants={item} className={`mt-6 max-w-xl ${sectionLead}`}>
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
        </motion.div>

        <motion.div data-reveal variants={item} initial="hidden" animate="show" className="relative">
          <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
            <img
              src={h.image.src}
              alt={h.image.alt}
              className="aspect-[4/5] w-full object-cover object-[center_38%] sm:aspect-[5/4] lg:aspect-[4/5]"
              width={1200}
              height={1500}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-5 left-5 right-5 rounded-[var(--radius-card)] border border-black/5 bg-white/92 p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] backdrop-blur sm:left-auto sm:right-5 sm:max-w-[18rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{h.cardLabel}</p>
            <p className="mt-1 font-display text-lg font-bold leading-tight">{h.cardText}</p>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------- Wann Privatstunden Sinn machen */
const WHEN_ICONS = [Heart, Target, TrendingUp, RotateCcw, Users, Sparkles];

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
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
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
                <h3 className="mt-5 font-display text-xl font-bold leading-tight text-[var(--color-ink)]">{card.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{card.text}</p>
              </motion.div>
            );
          })}
        </Reveal>
        <Reveal className="mt-10">
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
                    <h3 className="font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{p.title}</h3>
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
              <img
                src={f.image.src}
                alt={f.image.alt}
                className="photo-grade-private aspect-[3/2] w-full object-cover object-[center_40%]"
                width={1800}
                height={1200}
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
        <Reveal className="max-w-2xl">
          <SectionHead title={f.title} titleAccent={f.titleAccent} />
        </Reveal>
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          {f.items.map((fmt, i) => {
            const Icon = FORMAT_ICONS[i % FORMAT_ICONS.length];
            return (
              <motion.div
                key={fmt.name}
                variants={item}
                className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                  <Icon size={22} strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold leading-tight text-[var(--color-ink)]">{fmt.name}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{fmt.text}</p>
              </motion.div>
            );
          })}
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
                className="group inline-flex items-center gap-1.5 px-2 py-2 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {p.altCta.label}
                <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
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
            className="font-display text-3xl font-bold leading-[1.06] tracking-tight text-[var(--color-ink)] sm:text-4xl"
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
