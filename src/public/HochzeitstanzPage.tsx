// Ratgeberseite /mehr/hochzeitstanz. Zielgruppe sind Paare vor dem Fest, nicht Kursinteressenten
// — der Weg fuehrt deshalb ueber /privatstunden und /preise, nicht ueber die Schnupperstunde.
// Aufbau wie TanzschuhePage: SubHero 'left', Flaechenwechsel bg-soft <-> paper-warm, FaqBlock,
// ClosingInvite. Keine Preiszahl auf dieser Seite (Begruendung in hochzeitstanz-content.ts).

import { motion } from 'motion/react';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  FaqBlock,
  CheckList,
  PrimaryCta,
  GhostCta,
  Shell,
  Eyebrow,
  TitleAccent,
  BeatMark,
  MEASURE_L,
  sectionTitle,
  sectionLead,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { useLang } from '@/lib/i18n';
import { HOCHZEITSTANZ } from '@/public/more/hochzeitstanz-content';

type Content = (typeof HOCHZEITSTANZ)['de'];

export function HochzeitstanzPage() {
  const { lang } = useLang();
  const c = HOCHZEITSTANZ[lang];
  return (
    <SubPageShell seo="hochzeitstanz">
      <SubHero
        axis="left"
        seoCrumbs={c.crumbs}
        title={c.hero.title}
        titleAccent={c.hero.titleAccent}
        lead={c.hero.lead}
        primary={c.hero.primary}
        secondary={c.hero.secondary}
        microcopy={c.hero.microcopy}
      />
      <FlowSection c={c} />
      <RealisticSection c={c} />
      <MusicSection c={c} />
      <TimingSection c={c} />
      <FaqBlock eyebrow={c.faqEyebrow} title={c.faqTitle} items={c.faq} />
      <ClosingInvite
        eyebrow={c.closing.eyebrow}
        title={c.closing.title}
        titleAccent={c.closing.titleAccent}
        body={c.closing.body}
        ctaLabel={c.closing.primary.label}
        ctaHref={c.closing.primary.href}
        secondary={c.closing.secondary}
      />
    </SubPageShell>
  );
}

/* ------------------------------------------------------------------ Ablauf ueber Privatstunden */
function FlowSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const f = c.flow;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={f.eyebrow} title={f.title} titleAccent={f.titleAccent} lead={f.lead} />
        </Reveal>
        <Reveal className="mt-12" stagger={0.08}>
          {/* <ol>, weil die vier Termine aufeinander folgen. `Reveal` rendert immer ein <div>
              und kennt kein `as`, deshalb liegt das Grid auf der Liste darin. */}
          <ol className="grid gap-4 sm:grid-cols-2">
            {f.items.map((step, i) => (
              <motion.li
                key={step.title}
                variants={item}
                className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
              >
                <span className="font-display text-sm font-extrabold tabular-nums text-[var(--color-salsa)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 type-h3 text-[var(--color-ink)]">{step.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </Reveal>
        <Reveal className="mt-8">
          <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryCta href={f.cta.href}>{f.cta.label}</PrimaryCta>
            <GhostCta href={f.ctaSecondary.href}>{f.ctaSecondary.label}</GhostCta>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Was realistisch drin ist */
function RealisticSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const r = c.realistic;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:gap-16" stagger={0.08}>
          <motion.div variants={item} className="max-w-xl">
            <Eyebrow>{r.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle} ${MEASURE_L}`}>
              {r.title} <TitleAccent>{r.titleAccent}</TitleAccent>
            </h2>
            <p className={sectionLead}>{r.body}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{r.note}</p>
          </motion.div>
          <motion.div
            variants={item}
            className="min-w-0 rounded-[var(--radius-media)] border border-[var(--color-salsa)]/25 bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8"
          >
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              <BeatMark />
              {r.eyebrow}
            </p>
            <CheckList items={r.items} className="mt-6" />
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Musikwahl */
function MusicSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const m = c.music;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16" stagger={0.08}>
          <motion.div variants={item} className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <Eyebrow>{m.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle} ${MEASURE_L}`}>
              {m.title} <TitleAccent>{m.titleAccent}</TitleAccent>
            </h2>
          </motion.div>
          <motion.div variants={item} className="min-w-0">
            <p className="max-w-[62ch] text-pretty text-base leading-relaxed text-[var(--color-ink)] sm:text-lg">
              {m.body}
            </p>
            <ul className="mt-7 space-y-px">
              {m.items.map((i2) => (
                <li
                  key={i2}
                  className="flex items-start gap-3 border-t border-[var(--color-line)] py-3.5 text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)] first:border-t-0"
                >
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

/* ------------------------------------------------------------------ Zeitplan */
function TimingSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const t = c.timing;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={t.eyebrow} title={t.title} titleAccent={t.titleAccent} lead={t.lead} />
        </Reveal>
        <Reveal className="mt-12" stagger={0.08}>
          {/* Definitionsliste statt Karten: links der Zeitpunkt, rechts die Empfehlung.
              Das ist dieselbe Rolle wie eine Tabelle, aber mit nur zwei Spalten lesbarer. */}
          <dl className="border-t border-[var(--color-line)]">
            {t.rows.map((row) => (
              <motion.div
                key={row.when}
                variants={item}
                className="grid gap-2 border-b border-[var(--color-line)] py-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
              >
                <dt className="font-display text-base font-extrabold leading-snug text-[var(--color-salsa)]">
                  {row.when}
                </dt>
                <dd className="max-w-[62ch] text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {row.what}
                </dd>
              </motion.div>
            ))}
          </dl>
        </Reveal>
      </Shell>
    </section>
  );
}
