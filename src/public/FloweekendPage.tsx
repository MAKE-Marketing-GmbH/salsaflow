// Floweekend-Seite (/events-workshops/floweekend) aus dem V3-Copyplan (pages/14).
// Sektions-Rhythmus: Hero -> Programmbloecke -> Fuer wen -> Final CTA -> FAQ.
// Design-System strikt (hell im Wechsel paper-warm/bg-soft, Rot #AD1827 sparsam, Reveal-Takt
// wie Startseite). Copy 1:1 aus floweekend-content.ts.
//
// R188 E8: die Sektion "Was ist ein Floweekend" (Foto plus Dreiklang Workshops/Socials/
// Community) ist raus. Was das Format ist, beantworten jetzt die vier Programmbloecke.

import { motion } from 'framer-motion';
import { Check, PartyPopper, Users, Target, Music2 } from 'lucide-react';
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
  BeatMark,
  CtaArrow,
  // R188 E8: `sectionLead` lief nur in der entfernten WhatSection.
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
      {/* Mobil entfällt der generische 32px-Abstand nach der Microcopy.
          So bleibt das Foto vollständig, und WhatsApp verdeckt das Wasserzeichen nicht. */}
      <div className="max-sm:[&>section>div:last-child]:-mt-8">
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
            // R188 final: party-52 ist mit 1500x1000 exakt 3:2.
            // Der responsive 3:2-Rahmen zeigt die ganze Pose ohne Zuschnitt.
            // Bei 1440px skaliert die Quelle auf 0.96. Bei 390px skaliert sie auf 0.26.
            heightClass: 'aspect-[3/2] h-auto',
          }}
        />
      </div>
      {/* R188 E8 (Video 05:40 "Ja, das würde ich weglassen, das hier"). Gemeint ist die
          Sektion "Ein Wochenende für Workshops, Socials und Community" — Foto links,
          rechts drei Karten (Workshops / Socials / Community). Beleg: Frame f107 zeigt
          genau diese Sektion im Bild, f110 (05:47) ist schon eine Sektion weiter bei
          "Passt, wenn du ein Wochenende lang wirklich eintauchen willst".

          Die drei Karten wiederholten den Dreiklang, den ProgramSection direkt darunter
          in vier Bloecken ohnehin ausfuehrt. Die Funktion WhatSection und ihre Icon-Liste
          sind mitentfernt, damit kein toter Code bleibt; die Copy steht weiter in
          floweekend-content.ts. */}
      <ProgramSection c={c} />
      <FitSection c={c} />
      <ClosingSection c={c} />
      <FaqBlock title={c.faqTitle} items={c.faq} />
    </SubPageShell>
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
        {/* R188 SW2 (Feedback: gleiche Container-/Body-Hoehen, keine wilden Unterschiede).
            Ausgangslage: `lg:grid-cols-2`, beide Karten gleich breit. Links vier
            Checklisten-Zeilen, rechts ein Zweizeiler plus Link. Das Grid streckte den
            rechten Container auf die Hoehe des linken, der Inhalt blieb aber oben kleben —
            Ergebnis war ein grosses leeres Bodenfeld (Beleg R188 after-final d-02/d-03).

            Zwei Stellschrauben, beide ohne erfundenen Fuelltext:
            1. Spaltenbreite 1.15fr / 0.85fr. Die Checkliste braucht die Breite, der
               Hinweis kommt mit weniger aus. Im schmaleren Container laeuft der
               Zweizeiler ueber mehr Zeilen, das schliesst einen Teil der Hoehendifferenz
               von selbst.
            2. Das Strecken bleibt bewusst an (kein `items-start`), damit beide Karten
               exakt gleich hoch sind. Damit das nicht wieder zum leeren Feld fuehrt,
               verteilt der rechte Container seinen Inhalt jetzt ueber die volle Hoehe:
               Label oben, Text darunter, CTA per `mt-auto` an den Boden. Gemessen auf
               1440: vorher 322 vs. 217 px (105 px Differenz), jetzt beide gleich hoch.
            Unter lg ist das Grid einspaltig, dort gibt es kein Hoehenproblem. */}
        <Reveal
          className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
          stagger={0.08}
        >
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
                gleicher Fall wie die Format-CTAs auf /shows-animationen).
                R188 SW2: `mt-auto` statt `mt-4`. Die Karte ist so hoch wie die
                Checkliste nebenan; der CTA sitzt jetzt am Boden statt direkt unter dem
                Text, damit die Restflaeche nicht als Loch unter dem Inhalt haengt.
                `self-start` haelt die Klickflaeche auf Textbreite statt volle Kartenbreite.
                lg:mt-auto: erst ab der zweispaltigen Ansicht, darunter bleibt der
                gewohnte 16-px-Abstand. */}
            <a
              href={f.cta.href}
              className="group mt-4 inline-flex min-h-12 items-center gap-1.5 self-start text-sm font-bold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-ink)] lg:mt-auto lg:pt-6"
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
