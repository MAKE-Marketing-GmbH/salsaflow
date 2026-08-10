// Heels-Seite (/tanzkurse/heels). Eigener Rhythmus laut Plan (pages/05): Hero -> Angst abbauen
// (Myth-Busting) -> Was trainiert wird -> Schuhe & Vorbereitung -> Atmosphaere -> Final CTA -> FAQ.
// Design-System strikt (hell im Wechsel paper-warm/bg-soft, Rot sparsam, Reveal-Takt, Kit-Bausteine).
// Copy kommt 1:1 aus HEELS (heels-content.ts), hier nur Rendering.

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { HEELS } from '@/public/courses/styles/heels-content';
import {
  MEASURE_L,
  ClosingInvite,
  SubPageShell,
  HeroFrame,
  PrimaryCta,
  SectionHead,
  CheckList,
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

export function HeelsPage() {
  const { lang } = useLang();
  const c = HEELS[lang];
  return (
    <SubPageShell seo={c.seo}>
      <HeelsHero c={c} />
      <MythSection c={c} />
      <TrainingSection c={c} />
      <ShoesSection c={c} />
      <AtmosphereSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
    </SubPageShell>
  );
}

type C = (typeof HEELS)['de'];

/* -------------------------------------------------------------------- Hero */
/* Design-Kritik Runde 2, Issue 1: die sechste Kopie derselben Bauform. Jetzt Achse 'center'
   (im Kritik-Fix als Beispiel genannt) — die Headline steht zentriert ueber dem Inhalt.
   Runde 1 (2026-08): das Charakter-Foto der Seite (energiegeladene Heels-Klasse vor der
   Salsaflow-Wand) laeuft als full-bleed Band UNTER dem Typo-Block — gleiche Geste wie Salsa
   und Bachata, anderes Motiv, anderer Charakter (Ausdruck/Empowerment). */
function HeelsHero({ c }: { c: C }) {
  const h = c.hero;
  return (
    <HeroFrame
      axis="center"
      crumbs={[{ label: 'Tanzkurse', href: '/tanzkurse' }, c.crumb]}
      title={h.title}
      titleAccent={h.titleAccent}
      lead={h.lead}
      primary={h.primary}
      secondary={h.secondary}
      microcopy={h.microcopy}
      media={h.band}
    >
      <ul className="flex flex-wrap justify-center gap-2">
        {h.bullets.map((b) => (
          <li
            key={b}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--color-ink)]"
          >
            <Check size={13} strokeWidth={3} aria-hidden className="text-[var(--color-salsa)]" />
            {b}
          </li>
        ))}
      </ul>
    </HeroFrame>
  );
}

/* -------------------------------------------------------------------- Angst abbauen */
function MythSection({ c }: { c: C }) {
  const { item } = useReveal();
  const m = c.myth;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal>
          <SectionHead eyebrow={m.eyebrow} title={m.title} titleAccent={m.titleAccent} lead={m.body} />
        </Reveal>
        <Reveal className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.08}>
          {m.cards.map((card, i) => (
            <motion.div
              key={card.myth}
              variants={item}
              className="flex h-full flex-col rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.05)] sm:p-7"
            >
              <span className="font-display text-sm font-extrabold tabular-nums text-[var(--color-salsa)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 font-display text-lg font-bold leading-snug text-[var(--color-ink)]">{card.myth}</p>
              <p className="mt-3 flex items-start gap-2.5 text-[0.96rem] leading-relaxed text-[var(--color-ink-muted)]">
                <BeatMark className="mt-1.5 shrink-0" />
                <span>{card.reality}</span>
              </p>
            </motion.div>
          ))}
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item}>
            <a
              href={m.cta.href}
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {m.cta.label}
              <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Was trainiert wird */
function TrainingSection({ c }: { c: C }) {
  const { item } = useReveal();
  const t = c.training;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {t.title} {t.titleAccent ? <TitleAccent>{t.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {t.body}
            </motion.p>
            {/* Runde 3, Issue 9 ("Auf /heels dasselbe Muster: 4er-Kartenblock
                Haltung/Linien/Walks/Choreografie direkt nach dem 3er-Kartenblock der
                Einwaende"). Der Vierer laeuft jetzt als zweispaltiges Raster unter EINER
                Oberkante mit Haarlinien statt als vier weisse Schatten-Kaesten. */}
            <motion.div variants={item} className="mt-8 grid border-t border-[var(--color-line)] sm:grid-cols-2">
              {t.items.map((it) => (
                <div
                  key={it.name}
                  className="border-b border-[var(--color-line)] py-5 sm:px-6 sm:odd:border-r sm:odd:pl-0 sm:even:pr-0"
                >
                  <h3 className="font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{it.name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{it.text}</p>
                </div>
              ))}
            </motion.div>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={t.cta.href}>{t.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              <img src={t.image.src} alt={t.image.alt} className="aspect-[4/5] w-full object-cover object-[center_30%]" width={1200} height={1500} loading="lazy" />
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Schuhe & Vorbereitung */
function ShoesSection({ c }: { c: C }) {
  const { item } = useReveal();
  const s = c.shoes;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
              <img src={s.image.src} alt={s.image.alt} className="aspect-[4/3] w-full object-cover object-[center_45%]" width={1200} height={900} loading="lazy" />
            </motion.div>
          </Reveal>
          <Reveal className="order-1 max-w-xl lg:order-2">
            <motion.div variants={item}>
              <Eyebrow>{s.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={cn("mt-5", sectionTitle, MEASURE_L)}>
              {s.title} {s.titleAccent ? <TitleAccent>{s.titleAccent}</TitleAccent> : null}
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {s.body}
            </motion.p>
            <motion.div variants={item} className="mt-7 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]">
              <CheckList items={s.checklist} />
            </motion.div>
            <motion.div variants={item} className="mt-7">
              <a
                href={s.cta.href}
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {s.cta.label}
                <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Atmosphaere */
function AtmosphereSection({ c }: { c: C }) {
  const { item } = useReveal();
  const a = c.atmosphere;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <motion.div variants={item} className="max-w-xl">
            <h2 className={cn(sectionTitle, MEASURE_L)}>
              {a.title} {a.titleAccent ? <TitleAccent>{a.titleAccent}</TitleAccent> : null}
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{a.body}</p>
          </motion.div>
          <motion.div variants={item} className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
            <img src={a.image.src} alt={a.image.alt} className="aspect-[5/4] w-full object-cover object-[center_35%]" width={1400} height={1120} loading="lazy" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[var(--radius-card)] border border-black/5 bg-white/92 p-4 text-[var(--color-ink)] shadow-[0_18px_44px_-18px_rgba(17,17,17,0.5)] backdrop-blur sm:right-auto sm:max-w-[20rem]">
              <p className="text-[0.95rem] font-semibold leading-snug">{a.microcopy}</p>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Final CTA (zwei Wege) */
function ClosingSection({ c }: { c: C }) {
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
      note={cl.microcopy}
      surface="soft"
    />
  );
}
