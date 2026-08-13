// Partys-Seite unter /mehr/partys. Rhythmus aus dem V3-Copyplan (pages/23): Hero -> Danceflow
// Night als Start -> Weitere Orte (kuratiert) -> Erstes Mal (Tipps) -> FAQ -> Schluss-CTA. Ruhig,
// aber warm und lebendig (Plan: hell, echte Menschen, nie dunkler Club). Copy 1:1 aus PARTYS
// (echte Umlaute, CH-ss). Danceflow + Kalender verlinken auf echte Event-Routen.

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  FaqBlock,
  PrimaryCta,
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
import { PARTYS } from '@/public/more/partys-content';

export function PartysPage() {
  const { lang } = useLang();
  const c = PARTYS[lang];
  return (
    <SubPageShell seo="partys">
      {/* Runde 2, Issue 1: Typo-Hero statt Foto-Split. Achse 'wide' + full-bleed Partyband
          unter der Headline — das Motiv traegt hier inhaltlich, aber randlos statt als
          gerahmte Kachel neben dem Text. */}
      <SubHero
        axis="wide"
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        microcopy={c.hero.microcopy}
        // 25 % statt 38 %: Das Band zeigt nur 190 von 956 skalierten Pixeln, also ein Fuenftel
        // des Bildes. Bei 38 % lag das Fenster unter dem Gesicht der Taenzerin, die der
        // Alt-Text nennt — sichtbar blieben zwei angeschnittene Koepfe dahinter.
        media={{ src: c.hero.image.src, alt: c.hero.image.alt, position: 'center 25%' }}
      />
      <DanceflowSection c={c} />
      <MoreSection c={c} />
      <FirstTimeSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
      <FinalCta c={c} />
    </SubPageShell>
  );
}

/* ------------------------------------------------------------------ Danceflow Night als Start */
function DanceflowSection({ c }: { c: (typeof PARTYS)['de'] }) {
  const { item } = useReveal();
  const d = c.danceflow;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div variants={item} className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_30px_70px_-30px_rgba(17,17,17,0.42)]">
              <img
                src={d.image.src}
                alt={d.image.alt}
                className="aspect-[4/3] w-full object-cover"
                width={1400}
                height={1050}
                loading="lazy"
              />
            </div>
          </motion.div>
          <motion.div variants={item} className="order-1 max-w-xl lg:order-2">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle}`}>
              {d.title} <TitleAccent>{d.titleAccent}</TitleAccent>
            </h2>
            <p className={`mt-4 ${sectionLead}`}>{d.body}</p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--color-line)] pt-6">
              {d.facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-display text-lg font-extrabold leading-tight text-[var(--color-salsa)] sm:text-xl">{f.value}</dt>
                  <dd className="mt-1.5 text-xs leading-snug text-[var(--color-ink-muted)]">{f.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <PrimaryCta href={d.cta.href}>{d.cta.label}</PrimaryCta>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Weitere Orte (kuratiert) */
function MoreSection({ c }: { c: (typeof PARTYS)['de'] }) {
  const { item } = useReveal();
  const m = c.more;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="max-w-md lg:sticky lg:top-28 lg:self-start">
            <motion.div variants={item}>
              <Eyebrow>{m.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {m.title} <TitleAccent>{m.titleAccent}</TitleAccent>
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {m.body}
            </motion.p>
            <motion.div variants={item} className="mt-7">
              <a
                href={m.cta.href}
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {m.cta.label}
                <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </Reveal>
          <Reveal className="grid gap-3 sm:grid-cols-2" stagger={0.06}>
            {m.template.map((row) => (
              <motion.div
                key={row.label}
                variants={item}
                className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
              >
                <p className="flex items-center gap-2 font-display text-base font-bold text-[var(--color-ink)]">
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

/* ------------------------------------------------------------------ Zum ersten Mal (Tipps) */
function FirstTimeSection({ c }: { c: (typeof PARTYS)['de'] }) {
  const { item } = useReveal();
  const f = c.firstTime;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <Reveal className="max-w-xl">
            <motion.div variants={item}>
              <Eyebrow>{f.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
              {f.title} <TitleAccent>{f.titleAccent}</TitleAccent>
            </motion.h2>
            <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
              {f.body}
            </motion.p>
            <motion.ul variants={item} className="mt-8 grid gap-3">
              {f.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-4 text-[0.98rem] leading-relaxed text-[var(--color-ink)] sm:p-5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-salsa)] text-white">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </span>
                  {tip}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={item} className="mt-8">
              <PrimaryCta href={f.cta.href}>{f.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
          <Reveal className="lg:sticky lg:top-28">
            <motion.div variants={item} className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_24px_70px_-30px_rgba(17,17,17,0.4)]">
              <img
                src={f.image.src}
                alt={f.image.alt}
                className="aspect-[4/5] w-full object-cover"
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

/* ------------------------------------------------------------------ Schluss-CTA (zwei Wege) */
function FinalCta({ c }: { c: (typeof PARTYS)['de'] }) {
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
