// Unterseite /kursaufbau (V3-Copyplan pages/08). Risikoabbau-Asset: sie verhindert
// falsche Einstiege und macht klar, wie wir aufbauen. Rhythmus wie die uebrigen
// Unterseiten (SubPageShell + Kit), Copy 1:1 aus KURSAUFBAU (kursaufbau/content.ts).
//
// Signatur ist die Leiter aus CoursesPage LevelsSection: nummerierte Stufen (01 bis 04),
// roter aktiver Marker auf der Einstiegs-Stufe (Beginner). Flaechen hell im Wechsel
// (paper-warm <-> bg-soft), Rot #AD1827 sparsam (CTA, Marker, aktive Stufe, ein
// Script-Akzentwort pro Headline). Echte Bilder, echte Umlaute, CH-ss, keine Em-Dashes.

import { motion } from 'framer-motion';
import { Check, CalendarDays, Clock, DoorOpen, Ticket, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { KURSAUFBAU, type KursaufbauContent } from '@/public/kursaufbau/content';
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

export function KursaufbauPage() {
  const { lang } = useLang();
  const c = KURSAUFBAU[lang];
  return (
    <SubPageShell seo={c.seo}>
      <KursaufbauHero c={c} />
      <LevelsLadder c={c} />
      <DoubtSection c={c} />
      <TermSection c={c} />
      <MissSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero */
function KursaufbauHero({ c }: { c: KursaufbauContent }) {
  const { container, item } = useReveal();
  const h = c.hero;
  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
      // paddingBottom: solange die Cookie-Leiste steht, deckte sie 58px des Hero-Fotos —
      // der Hero macht ihr Platz; nach Accept wird die Variable 0px (Critic Runde 7, Item 3).
      style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)', paddingBottom: 'var(--cookie-banner-height, 0px)' }}
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
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          <motion.h1
            variants={item}
            className="mt-5 font-display text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.022em] text-balance sm:text-[3rem] lg:text-[3.4rem]"
          >
            {h.title} {h.titleAccent ? <TitleAccent>{h.titleAccent}</TitleAccent> : null}
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
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
            <img
              src={h.image.src}
              alt={h.image.alt}
              className="aspect-[4/5] w-full object-cover object-[center_42%] sm:aspect-[5/4] lg:aspect-[4/5]"
              width={1600}
              height={1067}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          {/* Links angedockt + festes Papier statt Glas — FAB lag auf der Kartenecke,
              Glas auf Fotos verboten (Sweep 14.08.2026, wie PrivatstundenPage). */}
          {/* bottom-4 statt -bottom-5: die Karte hing aus dem Foto in die naechste Sektion
              (Critic Runde 12, Item 2 — gleiches Muster wie /privatstunden in Runde 11). */}
          <div className="absolute bottom-4 left-5 right-5 rounded-2xl border border-black/5 bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] sm:right-auto sm:max-w-[18rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">{h.cardLabel}</p>
            <p className="mt-1 font-display text-lg font-bold leading-tight">{h.cardText}</p>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Levels (die Leiter-Signatur) */
function LevelsLadder({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const { lang } = useLang();
  const de = lang === 'de';
  const l = c.levels;
  return (
    <section id="levels" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-20 lg:py-32">
      <Shell>
        <Reveal className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_rgba(17,17,17,0.07)]">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            {/* Linke Spalte: Kopf + Legende + Stil-Verweise */}
            <motion.div
              variants={item}
              className="border-b border-[var(--color-line)] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12"
            >
              <Eyebrow>{l.eyebrow}</Eyebrow>
              <h2 className={`mt-5 ${sectionTitle}`}>
                {l.title} {l.titleAccent ? <TitleAccent>{l.titleAccent}</TitleAccent> : null}
              </h2>
              <p className={`mt-4 ${sectionLead}`}>{l.body}</p>

              <div className="mt-8 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-5">
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  <BeatMark />
                  {de ? 'So liest du die Leiter' : 'How to read the ladder'}
                </p>
                <ul className="mt-4 grid gap-3">
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-salsa)] font-display text-xs font-bold tabular-nums text-white">
                      01
                    </span>
                    <span className="text-sm font-semibold leading-tight text-[var(--color-ink)]">{l.startTag}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white font-display text-xs font-bold tabular-nums text-[var(--color-ink)]">
                      02
                    </span>
                    <span className="text-sm font-semibold leading-tight text-[var(--color-ink-muted)]">{l.buildTag}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{l.stylesIntro}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {l.styles.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition-colors hover:border-[var(--color-salsa)] hover:text-[var(--color-salsa)]"
                    >
                      {s.label}
                      <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Rechte Spalte: die Leiter */}
            {/* lg:pr-36: die Leiter-Tags endeten bei x=1309-1330 und liefen beim Scrollen
                unter den FAB (ab x=1294; Critic Runde 16, Item 4). */}
            <motion.div variants={item} className="bg-[var(--color-bg-soft)] p-5 sm:p-7 lg:p-8 lg:pr-36">
              <div className="rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BeatMark />
                    <h3 className="font-display text-xl font-bold text-[var(--color-ink)]">
                      {de ? 'Salsa & Bachata: Stufe für Stufe' : 'Salsa & Bachata: stage by stage'}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] shadow-sm">
                    {de ? 'Stufe für Stufe' : 'Level by level'}
                  </span>
                </div>

                <ol className="mt-6 grid gap-3">
                  {l.rungs.map((rung, ri) => {
                    const active = ri === 0;
                    return (
                      <li
                        key={rung.name}
                        className={cn(
                          'rounded-2xl border p-4 sm:p-5',
                          active
                            ? 'border-[var(--color-salsa)]/35 bg-white shadow-sm'
                            : 'border-[var(--color-line)] bg-white/70',
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={cn(
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-bold tabular-nums',
                              active
                                ? 'bg-[var(--color-salsa)] text-white'
                                : 'border border-[var(--color-line)] bg-[var(--color-paper-warm)] text-[var(--color-ink)]',
                            )}
                          >
                            {String(ri + 1).padStart(2, '0')}
                          </span>
                          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <span
                              className={cn(
                                'font-display text-xl font-bold leading-tight',
                                active ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]',
                              )}
                            >
                              {rung.name}
                            </span>
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
                                active
                                  ? 'bg-[var(--color-salsa)]/10 text-[var(--color-salsa)]'
                                  : 'bg-[var(--color-paper-warm)] text-[var(--color-ink-muted)]',
                              )}
                            >
                              {active ? l.startTag : l.buildTag}
                            </span>
                          </div>
                        </div>

                        <dl className="mt-4 grid gap-2.5 sm:pl-[3.75rem]">
                          <RungRow label={l.forYouLabel} value={rung.forYou} />
                          <RungRow label={l.youLearnLabel} value={rung.youLearn} />
                          <RungRow label={l.nextLabel} value={rung.next} />
                        </dl>
                      </li>
                    );
                  })}
                </ol>

                {/* Simple Level-Grafik (bestehendes Asset, dekorativ). */}
                <figure className="mt-7">
                  <img
                    src="/composites/graphic-world/step-salsa-line.webp"
                    alt=""
                    aria-hidden
                    width={2048}
                    height={760}
                    loading="lazy"
                    className="pointer-events-none w-full opacity-75"
                  />
                  <figcaption className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                    {l.graphicCaption}
                  </figcaption>
                </figure>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* Eine Zeile innerhalb einer Leiter-Stufe: kleines Label + Text. */
function RungRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-salsa)]">{label}</dt>
      <dd className="text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{value}</dd>
    </div>
  );
}

/* -------------------------------------------------------------------- Wenn du unsicher bist */
function DoubtSection({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const d = c.doubt;
  return (
    <section className="bg-[var(--color-paper-warm)] py-20 lg:py-32">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={d.eyebrow} title={d.title} titleAccent={d.titleAccent} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.08}>
          {d.blocks.map((b) => (
            <motion.div
              key={b.quote}
              variants={item}
              className="flex h-full flex-col rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
            >
              <Quote aria-hidden className="h-7 w-7 text-[var(--color-salsa)]" strokeWidth={1.75} />
              <p className="mt-4 font-display text-lg font-bold leading-snug text-[var(--color-ink)]">
                {'„'}
                {b.quote}
                {'“'}
              </p>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-[var(--color-ink-muted)]">{b.answer}</p>
            </motion.div>
          ))}
        </Reveal>
        <Reveal className="mt-9">
          <motion.div variants={item}>
            <a
              href={d.cta.href}
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {d.cta.label}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Kursstaffeln & Dauer */
const TERM_ICONS = [CalendarDays, Clock, DoorOpen, Ticket];

function TermSection({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const t = c.term;
  return (
    <section className="bg-[var(--color-bg-soft)] py-20 lg:py-32">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-md">
            <motion.div variants={item}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {t.title} {t.titleAccent ? <TitleAccent>{t.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {t.body}
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta href={t.cta.href}>{t.cta.label}</PrimaryCta>
              <GhostCta href={t.secondary.href}>{t.secondary.label}</GhostCta>
            </motion.div>
          </Reveal>

          <Reveal className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
            {t.cards.map((card, i) => {
              const Icon = TERM_ICONS[i] ?? CalendarDays;
              return (
                <motion.div
                  key={card.label}
                  variants={item}
                  className="flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Icon aria-hidden className="h-[1.2rem] w-[1.2rem]" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    {card.label}
                  </h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{card.value}</p>
                </motion.div>
              );
            })}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Nachholen & Fehlen */
function MissSection({ c }: { c: KursaufbauContent }) {
  const { item } = useReveal();
  const m = c.miss;
  return (
    <section className="bg-[var(--color-paper-warm)] py-20 lg:py-32">
      <Shell>
        <Reveal className="overflow-hidden rounded-[1.75rem] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.08)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div variants={item} className="relative">
            <img
              src={m.image.src}
              alt={m.image.alt}
              className="h-72 w-full object-cover object-[center_42%] sm:h-80 lg:h-full"
              width={1066}
              height={1600}
              loading="lazy"
            />
            {/* Festes Papier statt Glas (Sweep 14.08.2026). */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-black/5 bg-[var(--color-paper-warm)] p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] sm:right-auto sm:max-w-[17rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">{m.cardLabel}</p>
              <p className="mt-1 font-display text-lg font-bold leading-tight">{m.cardText}</p>
            </div>
          </motion.div>
          <motion.div variants={item} className="p-8 sm:p-10 lg:p-12">
            <Eyebrow>{m.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle}`}>
              {m.title} {m.titleAccent ? <TitleAccent>{m.titleAccent}</TitleAccent> : null}
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{m.body}</p>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Schluss-CTA (zwei Wege) */
function ClosingSection({ c }: { c: KursaufbauContent }) {
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
      note={cl.microcopy}
      surface="soft"
    />
  );
}
