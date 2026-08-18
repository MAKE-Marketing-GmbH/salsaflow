// Floweekend-Seite (/events-workshops/floweekend) aus dem V3-Copyplan (pages/14).
// Eigener Sektions-Rhythmus laut Plan: Hero -> Was ist ein Floweekend -> Programmbloecke
// -> Fuer wen -> Vorbereitung -> Final CTA -> FAQ. Design-System strikt (hell im Wechsel
// paper-warm/bg-soft, Rot #AD1827 sparsam, Reveal-Takt wie Startseite). Copy 1:1 aus
// floweekend-content.ts. Merksatz: der Dreiklang Workshops/Socials/Community erklaert das
// Format in einem Blick, damit niemand raten muss, was ein Floweekend ist.

import { motion } from 'framer-motion';
import { Check, GraduationCap, PartyPopper, Users, Target, Music2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { FLOWEEKEND, type FloweekendContent } from '@/public/events/floweekend-content';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  FaqBlock,
  PrimaryCta,
  Shell,
  TitleAccent,
  BeatMark,
  CtaArrow,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';

export function FloweekendPage() {
  const { lang } = useLang();
  const c = FLOWEEKEND[lang];
  return (
    <SubPageShell seo={c.seo}>
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'left' + full-bleed Band —
          das Weekend-Motiv laeuft randlos unter der Headline. */}
      <SubHero
        axis="left"
        dense
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        microcopy={c.hero.microcopy}
        media={{
          src: c.hero.image.src,
          alt: c.hero.image.alt,
          // R83: 16rem + Crop 34%. Band-Fenster 226px (bandTop 504, Fold 730). Anker-Modell:
          // Translation = Y% x (scaledH-bandH) = Y% x 704. Bei 27% sass das Kinn der tanzenden
          // Frau (weisses Shirt) an der 730er-Unterkante (FAIL), bei 37% rutschte ihr Haaransatz
          // an die Oberkante. 34% hebt das Motiv so, dass die tanzende Frau Kinn+Hals mit Luft
          // UND die lila-Top-Frau dahinter ganz mit Kinn zeigen. Motiv party-29 bleibt.
          position: 'center 34%',
          heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[16rem]',
        }}
      />
      <WhatSection c={c} />
      <ProgramSection c={c} />
      <FitSection c={c} />
      <PrepSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
    </SubPageShell>
  );
}

/* --------------------------------------------------- Was ist ein Floweekend */
const WHAT_ICONS: LucideIcon[] = [GraduationCap, PartyPopper, Users];

function WhatSection({ c }: { c: FloweekendContent }) {
  const { item } = useReveal();
  const w = c.what;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <motion.div
              variants={item}
              className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]"
            >
              <img
                src={w.image.src}
                alt={w.image.alt}
                className="aspect-[4/3] w-full object-cover object-[center_45%]"
                width={1200}
                height={900}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
          <Reveal className="max-w-xl">
            <motion.h2 variants={item} className={sectionTitle}>
              {w.title}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {w.body}
            </motion.p>
            <motion.ul variants={item} className="mt-8 grid gap-4">
              {w.elements.map((el, i) => {
                const Icon = WHAT_ICONS[i % WHAT_ICONS.length];
                return (
                  <li
                    key={el.title}
                    className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                      <Icon size={20} strokeWidth={2} aria-hidden />
                    </span>
                    <div>
                      <h3 className="type-h3 text-[var(--color-ink)]">
                        {el.title}
                      </h3>
                      <p className="mt-1 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{el.text}</p>
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Programmbloecke */
const PROGRAM_ICONS: LucideIcon[] = [Target, Music2, Users, PartyPopper];

function ProgramSection({ c }: { c: FloweekendContent }) {
  const { item } = useReveal();
  const p = c.program;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead title={p.title} titleAccent={p.titleAccent} />
        </Reveal>
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {p.blocks.map((b, i) => {
            const Icon = PROGRAM_ICONS[i % PROGRAM_ICONS.length];
            return (
              <motion.div
                key={b.title}
                variants={item}
                className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                  <Icon size={20} strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-4 type-h3 text-[var(--color-ink)]">
                  {b.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{b.text}</p>
              </motion.div>
            );
          })}
        </Reveal>
        <Reveal className="mt-10">
          <motion.div variants={item}>
            <PrimaryCta href={p.cta.href}>{p.cta.label}</PrimaryCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Fuer wen */
function FitSection({ c }: { c: FloweekendContent }) {
  const { item } = useReveal();
  const f = c.fit;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead title={f.title} titleAccent={f.titleAccent} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-2" stagger={0.08}>
          <motion.div
            variants={item}
            className="rounded-[var(--radius-media)] border border-[var(--color-salsa)]/25 bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8"
          >
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              <BeatMark />
              {f.yesTitle}
            </p>
            <ul className="mt-5 space-y-px">
              {f.yes.map((y) => (
                <li
                  key={y}
                  className="flex items-start gap-3 border-t border-[var(--color-line)] py-3.5 first:border-t-0"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Check size={13} strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{y}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            variants={item}
            className="flex flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_14px_35px_rgba(17,17,17,0.04)] sm:p-8"
          >
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              <BeatMark />
              {f.unsureTitle}
            </p>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">{f.unsure}</p>
            {/* min-h-12: der Textlink mass 20px — zu kleines Tap-Ziel (Sweep 14.08.2026,
                gleicher Fall wie die Format-CTAs auf /shows-animationen). */}
            <a
              href={f.cta.href}
              className="group mt-4 inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {f.cta.label}
              {/* Pfeil-Dauer aus dem Motion-Token, sonst faellt Tailwind auf 150ms zurueck. */}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Vorbereitung */
function PrepSection({ c }: { c: FloweekendContent }) {
  const { item } = useReveal();
  const p = c.prep;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.h2 variants={item} className={sectionTitle}>
              {p.title} {p.titleAccent ? <TitleAccent>{p.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.ul variants={item} className="mt-8 grid gap-3">
              {p.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-4 shadow-[0_10px_30px_rgba(17,17,17,0.03)] sm:p-5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Check size={13} strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{b}</span>
                </li>
              ))}
            </motion.ul>
            {/* min-h-12 je Link (Sweep 14.08.2026: 20px Tap-Ziele). gap-y kleiner, weil die
                Links jetzt selbst Hoehe mitbringen. */}
            <motion.div variants={item} className="mt-5 flex flex-wrap gap-x-6 gap-y-0">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {l.label}
                  <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
                </a>
              ))}
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div
              variants={item}
              className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]"
            >
              <img
                src={p.image.src}
                alt={p.image.alt}
                className="aspect-[4/5] w-full object-cover object-[center_40%]"
                width={1200}
                height={1500}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* --------------------------------------------------- Final CTA (zwei CTAs) */
function ClosingSection({ c }: { c: FloweekendContent }) {
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
