// Collabs-Seite unter /mehr/collabs. Rhythmus aus dem V3-Copyplan (pages/21): Hero -> So
// empfehlen wir -> Partner (Tanzschuhe) -> Vertrauen (gesicherte Fakten) -> Collab-Anfrage ->
// FAQ -> Schluss-CTA. Ruhige Variante des Design-Systems (hell im Wechsel paper-warm/bg-soft,
// Rot sparsam, Reveal-Takt wie Startseite). Copy 1:1 aus COLLABS (echte Umlaute, CH-ss).

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';
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
  BeatMark,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { COLLABS } from '@/public/more/collabs-content';

export function CollabsPage() {
  const { lang } = useLang();
  const c = COLLABS[lang];
  return (
    <SubPageShell seo="collabs">
      <div data-collabs-page="">
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'split' — Headline links,
          Angebot + CTA in der rechten Schiene (B2B-Anfrageseite).
          R69: Das Team-Motiv hp-27 sass ungenutzt in der Content-Datei (hero.image),
          der Fold war nur Text. Jetzt dense + media-Band wie R68 Tanzschuhe: das Foto
          laeuft randlos unter Typo und Schiene. Achse bleibt 'split'.
          R149: Video 07:45 schnitt die Scheitel ab. Das 15rem-Band war zu flach.
          center 24% legt die Scheitel in den 730-Fold; 28rem gibt den Koepfen Platz. */}
      <SubHero
        axis="split"
        dense
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        media={{
          src: c.hero.image.src,
          alt: c.hero.image.alt,
          position: 'center 24%',
          heightClass: 'h-[16rem] sm:h-[20rem] lg:h-[28rem]',
        }}
      />
      <HowSection c={c} />
      <PartnerSection c={c} />
      <TrustSection c={c} />
      <RequestSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
      <FinalCta c={c} />
      </div>
    </SubPageShell>
  );
}

/* ------------------------------------------------------------------ So empfehlen wir */
function HowSection({ c }: { c: (typeof COLLABS)['de'] }) {
  const { item } = useReveal();
  const h = c.how;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="max-w-md lg:sticky lg:top-28 lg:self-start">
            <motion.div variants={item}>
              <Eyebrow>{h.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {h.title} <TitleAccent>{h.titleAccent}</TitleAccent>
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {h.body}
            </motion.p>
          </Reveal>
          {/* lg:pr-36: der fixe WhatsApp-FAB lag auf der rechten Kartenspalte und verdeckte
              Text (Critic Runde 11, Item 5) — gleiches Muster wie ScheduleTeaser. */}
          <Reveal className="grid gap-3 sm:grid-cols-2 lg:pr-36" stagger={0.06}>
            {h.template.map((row) => (
              <motion.div
                key={row.label}
                variants={item}
                className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
              >
                <p className="flex items-center gap-2 type-h3 text-[var(--color-ink)]">
                  <BeatMark size="sm" />
                  {row.label}
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{row.hint}</p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Partner (Tanzschuhe) */
function PartnerSection({ c }: { c: (typeof COLLABS)['de'] }) {
  const { item } = useReveal();
  const p = c.partner;
  return (
    <section id="partner" className="scroll-mt-24 bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div variants={item} className="max-w-xl">
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
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">{p.note}</p>
          </motion.div>
          <motion.div variants={item} className="relative">
            <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.42)]">
              {/* R152: Partnerbild ohne lazy-Attribut. Default eager.
                  object-[center_80%] holt die Schuhe ins 4/3-Fenster. */}
              <img
                src={p.image.src}
                alt={p.image.alt}
                className="aspect-[4/3] w-full object-cover object-[center_80%]"
                width={1200}
                height={900}
              />
            </div>
            {/* Festes Papier statt Glas (Sweep 14.08.2026). */}
            <span className="absolute left-5 top-5 rounded-full bg-[var(--color-paper-warm)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] shadow-sm">
              {p.badge}
            </span>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Vertrauen (Fakten) */
function TrustSection({ c }: { c: (typeof COLLABS)['de'] }) {
  const { item } = useReveal();
  const t = c.trust;
  // R152: py-16 lg:py-24 riss bei y2400 ein Cream-Leerband zwischen Fakten und Anfrage.
  return (
    <section className="bg-[var(--color-bg-soft)] py-8 lg:py-12">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={t.eyebrow} title={t.title} titleAccent={t.titleAccent} lead={t.body} />
        </Reveal>
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          {t.facts.map((f) => (
            <motion.div
              key={f.label}
              variants={item}
              className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-7 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
            >
              <p className="font-display text-3xl font-extrabold leading-none text-[var(--color-salsa)]">{f.value}</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{f.label}</p>
            </motion.div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Collab-Anfrage */
function RequestSection({ c }: { c: (typeof COLLABS)['de'] }) {
  const { item } = useReveal();
  const r = c.request;
  // R152: gleiches Leerband wie TrustSection, gleiche Kur.
  return (
    <section className="bg-[var(--color-paper-warm)] py-8 lg:py-12">
      <Shell>
        <Reveal className="mx-auto max-w-3xl overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-7 shadow-[0_18px_60px_rgba(17,17,17,0.06)] sm:p-10">
          <motion.div variants={item}>
            <Eyebrow>{r.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
            {r.title} <TitleAccent>{r.titleAccent}</TitleAccent>
          </motion.h2>
          <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
            {r.body}
          </motion.p>
          <motion.p variants={item} className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            {r.fieldsLabel}
          </motion.p>
          <motion.ul variants={item} className="mt-4 flex flex-wrap gap-2">
            {r.fields.map((field) => (
              <li
                key={field}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-ink)]"
              >
                <BeatMark size="sm" />
                {field}
              </li>
            ))}
          </motion.ul>
          <motion.div variants={item} className="mt-8">
            <PrimaryCta href={r.cta.href}>{r.cta.label}</PrimaryCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Schluss-CTA (zwei Wege) */
function FinalCta({ c }: { c: (typeof COLLABS)['de'] }) {
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
