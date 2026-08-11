
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { StyleContent } from '@/public/courses/styles/content';
import {
  MEASURE_L,
  SubPageShell,
  HeroFrame,
  PrimaryCta,
  SectionHead,
  FaqBlock,
  ClosingInvite,
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

export function StylePage({ data }: { data: Record<'de' | 'en', StyleContent> }) {
  const { lang } = useLang();
  const c = data[lang];
  const isSalsa = c.seo === 'salsa';
  return (
    <SubPageShell seo={c.seo}>
      <div data-salsa-style-page={isSalsa ? '' : undefined}>
        {isSalsa ? (
          <style>{`
            body:has([data-salsa-style-page]) [role="region"]:has([data-testid="cookie-accept"]) {
              position: static;
              inset: auto;
              width: 100%;
            }
            @media (max-width: 639px) {
              body:has([data-salsa-style-page]) [role="region"]:has([data-testid="cookie-accept"]) > div {
                padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
              }
            }
          `}</style>
        ) : null}
        <StyleHero c={c} />
        <WhySection c={c} />
        <FitSection c={c} />
        <BeginnerSection c={c} />
        <LevelsSection c={c} />
        <SocialSection c={c} />
        <div className={isSalsa ? 'lg:[&>section]:!py-16' : undefined}>
          <ClosingInvite
            title={c.closing.title}
            titleAccent={c.closing.titleAccent}
            body={c.closing.body}
            ctaLabel={c.closing.primary.label}
            ctaHref={c.closing.primary.href}
            secondary={c.closing.secondary}
            note={c.closing.microcopy}
          />
        </div>
        <FaqBlock title={c.faqTitle} items={c.faq} />
      </div>
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero */

function StyleHero({ c }: { c: StyleContent }) {
  const h = c.hero;
  return (
    <HeroFrame
      axis={c.seo === 'bachata' ? 'split' : 'left'}
      crumbs={[{ label: 'Tanzkurse', href: '/tanzkurse' }, c.crumb]}
      title={h.title}
      titleAccent={h.titleAccent}
      lead={h.lead}
      primary={h.primary}
      secondary={h.secondary}
      microcopy={h.microcopy}
      media={h.band}
    >
      <ul className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
        {h.bullets.map((b) => (
          <li
            key={b}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-2.5 py-1 text-[0.72rem] font-semibold leading-tight text-[var(--color-ink)] last:col-span-2 last:w-fit sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm sm:last:col-span-1"
          >
            <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
            {b}
          </li>
        ))}
      </ul>
    </HeroFrame>
  );
}

/* -------------------------------------------------------------------- Warum */
function WhySection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const w = c.why;
  const isSalsa = c.seo === 'salsa';
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="max-w-md">

            <motion.h2 variants={item} className={cn(sectionTitle, MEASURE_L)}>
              {w.title} {w.titleAccent ? <TitleAccent>{w.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 text-pretty ${sectionLead}`}>
              {w.body}
            </motion.p>
            {!isSalsa ? (
              <motion.div variants={item} className="mt-8 overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
                <img
                  src={w.image.src}
                  alt={w.image.alt}
                  className={cn(
                    'aspect-[4/3] w-full object-cover object-[center_42%]',
                    c.seo === 'bachata' ? 'photo-grade-bachata' : undefined,
                  )}
                  width={1200}
                  height={900}
                  loading="lazy"
                />
              </motion.div>
            ) : null}
          </Reveal>

          <Reveal className="grid content-start border-t border-[var(--color-line)]" stagger={0.08}>
            {w.blocks.map((b, i) => (
              <motion.div
                key={b.title}
                variants={item}
                className="flex gap-5 border-b border-[var(--color-line)] py-6 lg:pr-20"
              >
                <span className="font-display text-xl font-extrabold tabular-nums text-[var(--color-salsa)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold leading-tight text-[var(--color-ink)]">{b.title}</h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{b.text}</p>
                </div>
              </motion.div>
            ))}
          </Reveal>
        </div>
        {isSalsa ? (
          <Reveal className="mt-10 lg:mt-14">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
              <img src={w.image.src} alt={w.image.alt} className="aspect-[16/7] w-full object-cover object-[center_42%]" width={1400} height={613} loading="lazy" />
            </motion.div>
          </Reveal>
        ) : null}
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Fuer wen */
function FitSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const f = c.fit;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal>
          <SectionHead title={f.title} titleAccent={f.titleAccent} lead={f.intro} />
        </Reveal>
        <Reveal className="mt-12 grid items-stretch gap-5 lg:grid-cols-2" stagger={0.08}>
          <motion.div variants={item} className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-salsa)]/25 bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8">

            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              {f.yesTitle}
            </p>
            <ul className="mt-5 space-y-px">
              {f.yes.map((y) => (
                <li key={y} className="flex items-start gap-3 border-t border-[var(--color-line)] py-3.5 first:border-t-0">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Check size={13} strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{y}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={item} className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-7 shadow-[0_14px_35px_rgba(17,17,17,0.04)] sm:p-8">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              {f.maybeTitle}
            </p>
            <ul className="mt-5 space-y-px">
              {f.maybe.map((m) => (
                <li key={m} className="flex items-start gap-3 border-t border-[var(--color-line)] py-3.5 first:border-t-0">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-ink-muted)]" />
                  <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{m}</span>
                </li>
              ))}
            </ul>
            <a
              href={f.cta.href}
              className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {f.cta.label}
              <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Erste Wochen */
function BeginnerSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const b = c.beginner;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{b.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn('mt-5', sectionTitle, MEASURE_L)}>
              {b.title} {b.titleAccent ? <TitleAccent>{b.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 text-pretty ${sectionLead}`}>
              {b.body}
            </motion.p>

            <motion.ol variants={item} className="mt-8 border-t border-[var(--color-line)]">
              {b.phases.map((p, i) => (
                <li
                  key={p.title}
                  className="grid grid-cols-[3rem_1fr] items-start gap-4 border-b border-[var(--color-line)] py-5"
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
              <PrimaryCta href={b.cta.href}>{b.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              <img src={b.image.src} alt={b.image.alt} className="aspect-[4/5] w-full object-cover object-[center_40%]" width={1200} height={1500} loading="lazy" />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Level */
function LevelsSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const l = c.levels;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead title={l.title} titleAccent={l.titleAccent} lead={l.body} />
        </Reveal>

        <Reveal className="mt-12" stagger={0.07}>
          <div className="border-t border-[var(--color-line)]">
            <ol
              className="grid sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--rungs),minmax(0,1fr))]"
              style={{ '--rungs': l.rungs.length } as React.CSSProperties}
            >
              {l.rungs.map((r, i) => (
                <motion.li
                  key={r.name}
                  variants={item}
                  className="flex flex-col border-b border-[var(--color-line)] py-6 sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0 lg:border-r lg:last:border-r-0"
                >
                  {/* Fortschritt: der Balken fuellt sich Stufe fuer Stufe. */}
                  <span aria-hidden className="flex h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-line)]">
                    <span
                      className="block h-full rounded-full bg-[var(--color-salsa)]"
                      style={{ width: `${((i + 1) / l.rungs.length) * 100}%` }}
                    />
                  </span>
                  <span className="mt-4 font-display text-sm font-extrabold tabular-nums text-[var(--color-salsa)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold leading-tight text-balance text-[var(--color-ink)]">{r.name}</h3>
                  <p className="mt-2 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{r.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item} className="flex flex-col gap-6">
            {/* Salsa-Charakter: die On1/On2-Frage gehoert zum Level-Gespraech. Steht als
                ruhige Notiz an einer Haarlinie, nicht als Karte — ein Hinweis, kein Angebot. */}
            {l.timingNote ? (
              <div className="max-w-xl border-t border-[var(--color-line)] pt-5">
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  <BeatMark />
                  {l.timingNote.title}
                </p>
                <p className="mt-2.5 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {l.timingNote.text}
                </p>
              </div>
            ) : null}
            <div>
              <a
                href={l.cta.href}
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {l.cta.label}
                <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Danceflow-Band (dunkler) */
function SocialSection({ c }: { c: StyleContent }) {
  const { item } = useReveal();
  const s = c.social;
  return (
    <section className="bg-[var(--color-surface-dark)] py-20 text-white lg:py-32">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div variants={item} className="order-2 overflow-hidden rounded-[var(--radius-media)] ring-1 ring-white/10 lg:order-1">
            <img src={s.image.src} alt={s.image.alt} className="aspect-[16/11] w-full object-cover" width={1400} height={960} loading="lazy" />
          </motion.div>
          <motion.div variants={item} className="order-1 max-w-xl lg:order-2">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              <BeatMark />
              Danceflow Night
            </p>
            <h2 className={cn('mt-5 font-display text-3xl font-bold leading-[1.06] tracking-tight text-balance sm:text-4xl md:text-[2.6rem]', MEASURE_L)}>
              {s.title} {s.titleAccent ? <TitleAccent dark>{s.titleAccent}</TitleAccent> : null}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/80 sm:text-lg">{s.body}</p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[0.98rem] leading-relaxed text-white/85">
                  <Check size={16} strokeWidth={2.5} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-salsa-500)]" />
                  {b}
                </li>
              ))}
            </ul>
            <a
              href={s.cta.href}
              className="group mt-8 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-salsa)] hover:text-white"
            >
              {s.cta.label}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}
