// Unterseite "Shows & Animationen" (/shows-animationen) aus dem V3-Copyplan
// (pages/07_shows-animationen.md). Verkauft Latin-Energie fuer externe Anlaesse: Salsaflow
// kann nicht nur unterrichten, sondern Events bewegen, mit Show, Animation, Workshop oder
// Kombination. Design-System strikt wie StylePage/CoursesPage: hell im Wechsel (paper-warm,
// bg-soft, ein weisses Formate-Feld), Rot #AD1827 sparsam (CTA + Marker + je ein Script-Akzent),
// ruhiger Reveal-Takt, echte Buehnen-Fotos als Beweis. Alle Pfeile als Lucide. DE/EN.
//
// Rhythmus: Hero -> Anlaesse -> Formate (Show/Animation/Workshop + Kombination) -> Ablauf der
// Anfrage -> Beweis-Galerie -> Final CTA -> FAQ. Primaerer CTA sitewide -> /kontakt#schnupperstunde.

import { motion } from 'framer-motion';
import {
  Check,
  Building2,
  Heart,
  PartyPopper,
  Cake,
  Drama,
  Users,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { SHOWS_ANIM, type ShowsAnimContent } from '@/public/shows/animationen-content';
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
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';

// Icons je Anlass (Firmenanlass / Hochzeit / Polterabend / Geburtstag). Rot als sparsamer Marker.
const OCCASION_ICONS: LucideIcon[] = [Building2, Heart, PartyPopper, Cake];
// Icons je Format (Show / Animation / Workshop). Kombination hat ihr eigenes Icon (Sparkles).
const FORMAT_ICONS: LucideIcon[] = [Drama, Users, GraduationCap];

export function ShowsAnimationenPage() {
  const { lang } = useLang();
  const c = SHOWS_ANIM[lang];
  return (
    <SubPageShell seo="shows">
      <AnimHero c={c} />
      <OccasionsSection c={c} />
      <FormatsSection c={c} />
      <ProcessSection c={c} />
      <GallerySection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faq.title} items={c.faq.items} />
    </SubPageShell>
  );
}

/* --------------------------------------------------------------------------- Hero (paper-warm)
   Section-X Image-Strategie = direct, weil ein einzelnes starkes Buehnen-Foto (Crew in Bewegung)
   die Show-Energie sofort beweist und keine Composition braucht. Split wie StyleHero: links
   Breadcrumb + Eyebrow + H1 + Lead + Proof-Chips + CTA-Paar, rechts das Foto mit Glas-Karte. */
function AnimHero({ c }: { c: ShowsAnimContent }) {
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
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          <motion.h1
            variants={item}
            className="mt-5 font-display text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.022em] text-balance sm:text-[3rem] lg:text-[3.4rem]"
          >
            {h.title}
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
            <GhostCta href={h.secondary.href} down>
              {h.secondary.label}
            </GhostCta>
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
              className="aspect-[4/5] w-full object-cover object-[center_35%] sm:aspect-[5/4] lg:aspect-[4/5]"
              width={1600}
              height={1067}
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

/* ---------------------------------------------------------------------- Anlaesse (bg-soft)
   Section-X Image-Strategie = direct, weil ein echtes Firmen-Weihnachtsfeier-Foto (Crew bewegt
   das Publikum) den Anlass-Beweis liefert. Split: Foto links, 2x2-Bento der vier Anlaesse rechts. */
function OccasionsSection({ c }: { c: ShowsAnimContent }) {
  const { item } = useReveal();
  const o = c.occasions;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <motion.figure
            variants={item}
            className="relative overflow-hidden rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white shadow-[0_18px_55px_rgba(17,17,17,0.08)]"
          >
            <img
              src={o.image.src}
              alt={o.image.alt}
              className="aspect-[4/5] w-full object-cover object-[center_40%] sm:aspect-[4/3] lg:aspect-[5/6]"
              width={1600}
              height={1200}
              loading="lazy"
            />
          </motion.figure>
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <motion.div variants={item}>
            <Eyebrow>{o.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
            {o.titleA} <TitleAccent>{o.titleAccent}</TitleAccent> {o.titleB}
          </motion.h2>
          <motion.p variants={item} className={`mt-4 ${sectionLead}`}>
            {o.lead}
          </motion.p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {o.cards.map((card, i) => {
              const Icon = OCCASION_ICONS[i] ?? Building2;
              return (
                <motion.div
                  key={card.title}
                  variants={item}
                  className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-salsa)]">
                    <Icon size={18} strokeWidth={1.9} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{card.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{card.text}</p>
                </motion.div>
              );
            })}
          </div>

          <Reveal className="mt-8">
            <motion.div variants={item}>
              <PrimaryCta href={o.cta.href}>{o.cta.label}</PrimaryCta>
            </motion.div>
          </Reveal>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------------- Formate (weiss)
   Section-X Image-Strategie = direct, weil ein Finale-Foto der ganzen Company das "Show"-Format
   belegt. Links Eyebrow + Headline + drei Format-Karten + Kombi-Karte, rechts das Foto. */
function FormatsSection({ c }: { c: ShowsAnimContent }) {
  const { item } = useReveal();
  const f = c.formats;
  return (
    <section className="bg-white py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-xl">
          <motion.div variants={item}>
            <Eyebrow>{f.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={`mt-5 ${sectionTitle}`}>
            {f.titleA} <TitleAccent>{f.titleAccent}</TitleAccent>
          </motion.h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal className="grid gap-4" stagger={0.08}>
            {f.items.map((fmt, i) => {
              const Icon = FORMAT_ICONS[i] ?? Drama;
              return (
                <motion.div
                  key={fmt.name}
                  variants={item}
                  className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-salsa)] shadow-sm">
                      <Icon size={18} strokeWidth={1.9} aria-hidden />
                    </span>
                    <h3 className="font-display text-xl font-bold leading-tight text-[var(--color-ink)]">{fmt.name}</h3>
                  </div>
                  <dl className="mt-5 space-y-3">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">{f.whatLabel}</dt>
                      <dd className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink)]">{fmt.what}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{f.fitLabel}</dt>
                      <dd className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{fmt.fit}</dd>
                    </div>
                  </dl>
                  <a
                    href={fmt.cta.href}
                    className="group mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    {fmt.cta.label}
                    <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              );
            })}

            {/* Kombi-Karte: hebt sich als roter Akzent-Rahmen ab (Hoehepunkt + Beteiligung). */}
            <motion.div
              variants={item}
              className="rounded-[var(--radius-card)] border border-[var(--color-salsa)]/30 bg-[var(--color-paper-warm)] p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-salsa)] text-white shadow-sm">
                  <Sparkles size={18} strokeWidth={1.9} aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold leading-tight text-[var(--color-ink)]">{f.combo.name}</h3>
              </div>
              <dl className="mt-5 space-y-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">{f.whatLabel}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink)]">{f.combo.what}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">{f.fitLabel}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{f.combo.fit}</dd>
                </div>
              </dl>
            </motion.div>
          </Reveal>

          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <motion.figure
              variants={item}
              className="overflow-hidden rounded-[var(--radius-media)] ring-1 ring-black/5 shadow-[0_24px_60px_-28px_rgba(17,17,17,0.5)]"
            >
              <img
                src={f.image.src}
                alt={f.image.alt}
                className="aspect-[4/5] w-full object-cover object-[center_40%] lg:aspect-[4/6]"
                width={1600}
                height={1200}
                loading="lazy"
              />
            </motion.figure>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Ablauf der Anfrage (paper-warm)
   Vier-Schritte-Prozess: senkt die Huerde, weil klar wird welche Infos die Anfrage braucht. */
function ProcessSection({ c }: { c: ShowsAnimContent }) {
  const { item } = useReveal();
  const p = c.process;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead title={p.title} />
        </Reveal>
        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {p.steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={item}
              className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-salsa)] font-display text-base font-bold tabular-nums text-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{step.text}</p>
            </motion.div>
          ))}
        </Reveal>
        <Reveal className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <motion.div variants={item}>
            <PrimaryCta href={p.cta.href}>{p.cta.label}</PrimaryCta>
          </motion.div>
          <motion.p variants={item} className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {p.microcopy}
          </motion.p>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Beweis-Galerie (bg-soft)
   Section-X Image-Strategie = direct, weil echte Buehnen-Fotos der beste Vertrauensbeweis sind.
   Editorial-Bento: 1 grosses Feature + 4 quadratische Kacheln, alle echte Salsaflow-Momente. */
function GallerySection({ c }: { c: ShowsAnimContent }) {
  const { item } = useReveal();
  const g = c.gallery;
  return (
    <section id="beispiele" className="scroll-mt-24 bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <motion.h2 variants={item} className={sectionTitle}>
            <TitleAccent>{g.titleAccent}</TitleAccent> {g.titleRest}
          </motion.h2>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" stagger={0.08}>
          {g.photos.map((photo, i) => {
            const feature = i === 0;
            return (
              <motion.figure
                key={photo.src}
                variants={item}
                className={`overflow-hidden rounded-[var(--radius-card)] ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(17,17,17,0.45)] ${
                  feature ? 'col-span-2 lg:row-span-2' : ''
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={
                    feature
                      ? 'aspect-[16/11] w-full object-cover object-center lg:aspect-auto lg:h-full'
                      : 'aspect-square w-full object-cover object-center'
                  }
                  width={feature ? 1600 : 900}
                  height={feature ? 1100 : 900}
                  loading="lazy"
                />
              </motion.figure>
            );
          })}
        </Reveal>

        <Reveal className="mt-8">
          <motion.div variants={item}>
            <a
              href={g.link.href}
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              {g.link.label}
              <CtaArrow className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------- Final CTA (paper-warm)
   Heller Schluss mit bg-soft-Karte (gleiche DNA wie ClosingInvite), aber zwei CTAs (Event
   anfragen + Kontakt aufnehmen) und ein Script-Akzent in der Headline. */
function ClosingSection({ c }: { c: ShowsAnimContent }) {
  const cl = c.closing;
  // Runde 2, Issue 9: EIN Schluss-CTA sitewide -> ClosingInvite (src/public/subpage/kit.tsx).
  // Dreiteiliger Titel (Text - Akzent - Text) laeuft ueber `titleNode`.
  return (
    <ClosingInvite
      eyebrow={c.hero.eyebrow}
      titleNode={
        <>
          {cl.titleA} <TitleAccent>{cl.titleAccent}</TitleAccent> {cl.titleB}
        </>
      }
      body={cl.body}
      ctaLabel={cl.primary.label}
      ctaHref={cl.primary.href}
      secondary={cl.secondary}
      surface="soft"
    />
  );
}
