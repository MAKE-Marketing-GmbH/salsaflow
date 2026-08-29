// Ratgeberseite /mehr/salsa-lernen. Aufbau nach dem Muster der TanzschuhePage: SubHero (Achse
// 'left', ruhige Beratungsseite), danach Flaechenwechsel bg-soft <-> paper-warm, FaqBlock,
// ClosingInvite. Alle Bausteine aus subpage/kit.tsx, keine neuen Farben oder Typo-Rollen.
//
// Reihenfolge folgt der Extrahierbarkeit (research-fazit 29.08.): Definition mit Kernsatz
// zuerst, dann die nummerierten Schritte, dann Rollenwechsel, dann Dauer, dann FAQ.

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  FaqBlock,
  CheckList,
  PrimaryCta,
  CtaArrow,
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
import { SALSA_LERNEN } from '@/public/more/salsa-lernen-content';

type Content = (typeof SALSA_LERNEN)['de'];

export function SalsaLernenPage() {
  const { lang } = useLang();
  const c = SALSA_LERNEN[lang];
  return (
    <SubPageShell seo="salsaLernen">
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
      <DefinitionSection c={c} />
      <StepsSection c={c} />
      <SoloSection c={c} />
      <DurationSection c={c} />
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

/* ------------------------------------------------------------------ Definition (Kernsatz zuerst) */
function DefinitionSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const d = c.definition;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <motion.div variants={item} className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle} ${MEASURE_L}`}>
              {d.title} <TitleAccent>{d.titleAccent}</TitleAccent>
            </h2>
          </motion.div>
          <motion.div variants={item} className="min-w-0">
            {/* Der 40-60-Wort-Kernsatz steht als erster Absatz und traegt die groessere
                Lesegroesse: Menschen lesen ihn zuerst, Extraktions-Engines finden ihn oben. */}
            <p className="max-w-[62ch] text-pretty text-lg leading-relaxed text-[var(--color-ink)] sm:text-xl">
              {d.core}
            </p>
            <p className="mt-5 max-w-[62ch] text-pretty text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
              {d.body}
            </p>
            <dl className="mt-8 grid gap-5 border-t border-[var(--color-line)] pt-6 sm:grid-cols-3">
              {d.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    {f.label}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-extrabold leading-snug text-[var(--color-salsa)]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Schritt fuer Schritt */
function StepsSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const s = c.steps;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead eyebrow={s.eyebrow} title={s.title} titleAccent={s.titleAccent} lead={s.lead} />
        </Reveal>
        {/* Die Reihenfolge steht im Markup (<ol>), nicht nur in den sichtbaren Zahlen.
            `Reveal` rendert immer ein <div> und kennt kein `as` — das Grid liegt deshalb
            auf dem <ol> darin, statt die geteilte Komponente fuer eine Seite umzubauen. */}
        <Reveal className="mt-12" stagger={0.08}>
          <ol className="grid gap-4 sm:grid-cols-2">
          {s.items.map((step, i) => (
            <motion.li
              key={step.title}
              variants={item}
              className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] sm:p-7"
            >
              <span className="font-display text-sm font-extrabold tabular-nums text-[var(--color-salsa)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 type-h3 text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-muted)]">{step.text}</p>
              <a
                href={step.href}
                className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
              >
                {step.linkLabel}
                <ArrowRight size={15} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-[var(--motion-out)] group-hover:translate-x-0.5" />
              </a>
            </motion.li>
          ))}
          </ol>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Ohne Partner */
function SoloSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const s = c.solo;
  return (
    <section className="bg-[var(--color-bg-soft)] py-16 lg:py-24">
      <Shell>
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:gap-16" stagger={0.08}>
          <motion.div variants={item} className="max-w-xl">
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h2 className={`mt-5 ${sectionTitle} ${MEASURE_L}`}>
              {s.title} <TitleAccent>{s.titleAccent}</TitleAccent>
            </h2>
            <p className={sectionLead}>{s.body}</p>
            <div className="mt-8">
              <PrimaryCta href={s.cta.href}>{s.cta.label}</PrimaryCta>
            </div>
          </motion.div>
          <motion.div
            variants={item}
            className="min-w-0 rounded-[var(--radius-media)] border border-[var(--color-salsa)]/25 bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8"
          >
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
              <BeatMark />
              {s.eyebrow}
            </p>
            <CheckList items={s.items} className="mt-6" />
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ Wie lange dauert es */
function DurationSection({ c }: { c: Content }) {
  const { item } = useReveal();
  const d = c.duration;
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell>
        <Reveal className="mx-auto max-w-3xl text-center">
          <motion.div variants={item} className="flex justify-center">
            <Eyebrow>{d.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2 variants={item} className={`type-h2 mx-auto mt-5 text-[var(--color-ink)] ${MEASURE_L}`}>
            {d.title} <TitleAccent>{d.titleAccent}</TitleAccent>
          </motion.h2>
          <motion.p variants={item} className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
            {d.body}
          </motion.p>
          <motion.p variants={item} className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
            {d.body2}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex justify-center">
            <a
              href="/events-workshops/danceflow-night"
              className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)]"
            >
              <DanceflowLabel />
              <CtaArrow className="transition-transform duration-[var(--dur-fast)] ease-[var(--motion-out)] group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

function DanceflowLabel() {
  const { lang } = useLang();
  return <>{lang === 'de' ? 'Danceflow Night ansehen' : 'See Danceflow Night'}</>;
}
