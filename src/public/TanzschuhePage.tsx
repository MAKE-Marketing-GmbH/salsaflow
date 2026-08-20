// Tanzschuhe-Seite unter /mehr/tanzschuhe. Rhythmus aus dem V3-Copyplan (pages/22): Hero ->
// Nach Tanzstil -> Praktisch (Checkliste + Mitbringen) -> Kein Stress -> Partner/Shop -> FAQ ->
// Schluss-CTA. Ruhige Beratungsseite (hell im Wechsel paper-warm/bg-soft, Rot sparsam). Copy 1:1
// aus TANZSCHUHE (echte Umlaute, CH-ss). Interne Links auf echte Kurs-/Kursplan-Routen.

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';
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
  Eyebrow,
  TitleAccent,
  BeatMark,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { TANZSCHUHE } from '@/public/more/tanzschuhe-content';

export function TanzschuhePage() {
  const { lang } = useLang();
  const c = TANZSCHUHE[lang];
  return (
    <SubPageShell seo="tanzschuhe">
      <div data-tanzschuhe-page="">
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'left' — die Seite ist eine
          ruhige Beratungsseite, sie beginnt linksbuendig gestapelt.
          R68: Das Schuh-Motiv sass ungenutzt in der Content-Datei (hero.image), der Fold
          war nur Text. Jetzt axis="left" + dense + media-Band nach dem Eventkalender-Muster
          (R58): das Foto laeuft randlos unter der Headline, Schuhe im 1440-Fold sichtbar.
          13rem statt Eventkalender-18rem: die H1 ist hier dreizeilig, dadurch bleibt das
          Band trotz laengerem Kopf im Fold.
          R150: Desktop-WhatsApp als Kreis ueber [data-tanzschuhe-page].
          Video 07:57/08:09: das flache 16rem-Band schnitt beide Paare. 24rem bei
          center 84% zeigt Absatz bis Spitze und endet im 900-Fold (Band-Top ~504).
          Motiv bleibt heels-shoes-stilllife.webp (einziges echtes Schuh-Still). */}
      <SubHero
        axis="left"
        dense
        tightBottom
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
          position: 'center 84%',
          heightClass: 'h-[18rem] sm:h-[22rem] lg:h-[24rem]',
        }}
      />
      <ByStyleSection c={c} />
      <PracticalSection c={c} />
      <NotNeededSection c={c} />
      <PartnerSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
      <FinalCta c={c} />
      </div>
    </SubPageShell>
  );
}

/* ------------------------------------------------------------------ Nach Tanzstil */
function ByStyleSection({ c }: { c: (typeof TANZSCHUHE)['de'] }) {
  const { lang } = useLang();
  const { item } = useReveal();
  const s = c.byStyle;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={s.eyebrow} title={s.title} titleAccent={s.titleAccent} />
        </Reveal>
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {s.cards.map((card, i) => (
            <motion.a
              key={card.name}
              href={card.href}
              variants={item}
              className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] transition-colors hover:border-[var(--color-salsa)] sm:p-7"
            >
              <span className="font-display text-sm font-extrabold tabular-nums text-[var(--color-salsa)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 type-h3 text-[var(--color-ink)]">{card.name}</h3>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{card.text}</p>
              {/* Der Link trug denselben Text wie die Ueberschrift direkt darueber — auf der
                  Karte stand "Salsa" zweimal untereinander. Jetzt sagt er, wohin er fuehrt. */}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)]">
                {lang === 'de' ? `${card.name}-Kurse ansehen` : `See ${card.name} classes`}
                <ArrowRight size={15} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item}>
            <a
              href={s.cta.href}
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {s.cta.label}
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Praktisch (Checkliste + Mitbringen) */
function PracticalSection({ c }: { c: (typeof TANZSCHUHE)['de'] }) {
  const { item } = useReveal();
  const cl = c.checklist;
  const ca = c.care;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-5 lg:grid-cols-2 lg:gap-6" stagger={0.08}>
          <motion.div
            variants={item}
            className="rounded-[var(--radius-media)] border border-[var(--color-salsa)]/25 bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8"
          >
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              <BeatMark />
              {cl.eyebrow}
            </p>
            <h2 className="type-h2 mt-4 text-[var(--color-ink)]">
              {cl.title} <TitleAccent>{cl.titleAccent}</TitleAccent>
            </h2>
            <CheckList items={cl.items} className="mt-6" />
          </motion.div>
          <motion.div
            variants={item}
            className="rounded-[var(--radius-media)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-7 shadow-[0_14px_35px_rgba(17,17,17,0.04)] sm:p-8"
          >
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              <BeatMark />
              {ca.eyebrow}
            </p>
            <h2 className="type-h2 mt-4 text-[var(--color-ink)]">
              {ca.title} <TitleAccent>{ca.titleAccent}</TitleAccent>
            </h2>
            <ul className="mt-6 space-y-px">
              {ca.items.map((i2) => (
                <li key={i2} className="flex items-start gap-3 border-t border-[var(--color-line)] py-3.5 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)] first:border-t-0">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-salsa)]" />
                  {i2}
                </li>
              ))}
            </ul>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Kein Stress */
function NotNeededSection({ c }: { c: (typeof TANZSCHUHE)['de'] }) {
  const { item } = useReveal();
  const n = c.notNeeded;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="mx-auto max-w-3xl text-center">
          <motion.div variants={item} className="flex justify-center">
            <Eyebrow>{n.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={item}
            className="type-h2 mt-5 text-[var(--color-ink)]"
          >
            {n.title} <TitleAccent>{n.titleAccent}</TitleAccent>
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

/* ------------------------------------------------------------------ Partner / Shop */
function PartnerSection({ c }: { c: (typeof TANZSCHUHE)['de'] }) {
  const { item } = useReveal();
  const p = c.partner;
  return (
    <section id="partner" className="scroll-mt-24 bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <motion.div variants={item} className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.42)]">
              <img
                src={p.image.src}
                alt={p.image.alt}
                className="aspect-[4/3] w-full object-cover object-[center_42%]"
                width={1200}
                height={900}
                loading="lazy"
              />
            </div>
            {/* Festes Papier statt Glas (Sweep 14.08.2026). */}
            <span className="absolute left-5 top-5 rounded-full bg-[var(--color-paper-warm)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] shadow-sm">
              {p.badge}
            </span>
          </motion.div>
          <motion.div variants={item} className="order-1 max-w-xl lg:order-2">
            <Eyebrow>{p.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle}`}>
              {p.title} <TitleAccent>{p.titleAccent}</TitleAccent>
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{p.body}</p>
            <ul className="mt-7 grid gap-2.5">
              {p.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[0.98rem] leading-relaxed text-[var(--color-ink)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Check size={13} strokeWidth={3} aria-hidden />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta href={p.primary.href}>{p.primary.label}</PrimaryCta>
              <GhostCta href={p.secondary.href}>{p.secondary.label}</GhostCta>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Schluss-CTA (zwei Wege) */
function FinalCta({ c }: { c: (typeof TANZSCHUHE)['de'] }) {
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
    />
  );
}
