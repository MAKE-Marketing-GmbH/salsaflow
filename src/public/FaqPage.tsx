// FAQ-Seite (/faq) aus dem V3-Copyplan (pages/24_faq.md). Design-System strikt (Kit + StylePage):
// hell im Wechsel (paper-warm <-> bg-soft), Rot sparsam, Reveal-Takt wie Startseite.
//
// Rhythmus: Hero -> Themen-Orientierung (Sprungkarten in die passenden Seiten) -> EIN FaqBlock
// mit ALLEN Fragen/Antworten (setzt die vollstaendige FAQPage-JSON-LD) -> Schluss-CTA.
//
// Bewusst EIN FaqBlock statt mehrerer pro Kategorie: FaqBlock schreibt die JSON-LD unter fixer
// id 'ld-faq'; mehrere Bloecke wuerden sich gegenseitig ueberschreiben und nur die letzte
// Kategorie ins Schema legen. Ein Block = vollstaendige FAQPage-JSON-LD (der SEO-Job der Seite).

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import {
  ClosingInvite,
  SubPageShell,
  SubHero,
  SectionHead,
  Shell,
  Reveal,
  useReveal,
} from '@/public/subpage/kit';
import { FAQ_CONTENT, type FaqPageContent } from '@/public/faq/content';
import { FaqItem } from '@/public/faq/FaqAccordion';

export function FaqPage() {
  const { lang } = useLang();
  const c = FAQ_CONTENT[lang];
  const [cookieClear, setCookieClear] = useState(false);

  // Der Hinweis bleibt beim Einstieg sichtbar. Sobald jemand die Seite erkundet, räumt er
  // die Inhaltsfläche frei; auf der nächsten Route erscheint er wieder, falls er nicht bestätigt wurde.
  useEffect(() => {
    if (window.scrollY > 0) {
      setCookieClear(true);
      return;
    }
    const clearOnFirstScroll = () => setCookieClear(true);
    window.addEventListener('scroll', clearOnFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', clearOnFirstScroll);
  }, []);

  return (
    <SubPageShell seo={c.seo}>
      <div className="faq-page" data-cookie-clear={cookieClear ? 'true' : undefined}>
        <FaqHero c={c} />
        <ThemesSection c={c} />
        <CommunityStrip />
        <FaqSection c={c} />
        <FinalCta c={c} />
      </div>
    </SubPageShell>
  );
}

/* -------------------------------------------------------------------- Hero (erste Frage) */
/* Meta-Kritik 2026-08-07 ("AI-Eyebrow-Flut / jede Unterseite startet gleich"): /faq oeffnete
   mit derselben zentrierten Riesen-Behauptung wie /preise und /tanzkurse/heels — Headline,
   Lead, zwei CTAs, Microcopy, mittig, Achse 'center' (Beleg /tmp/eyebrow-shots/faq.png vs
   preise.png vs heels.png, identische Silhouette). Die alte H1 "Unsicher ist normal. Unklar
   muss es nicht bleiben." sagte ausserdem nichts, was die Seite nicht schon im Breadcrumb
   verspricht.
   Fix: die Seite startet jetzt mit dem, wofuer man sie oeffnet — der ersten echten Frage
   samt Antwort. Achse 'split': Frage links, Antwort + CTA in der rechten Schiene. Damit ist
   der Einstieg inhaltlich UND strukturell nicht mehr mit Preise/Heels verwechselbar.
   Quelle ist bewusst faqSection.items[0] und keine zweite Copy-Stelle: das Hero-Versprechen
   kann so nicht von der Liste darunter abweichen. */
function FaqHero({ c }: { c: FaqPageContent }) {
  const first = c.faqSection.items[0];
  return (
    <SubHero
      axis="split"
      seoCrumbs={[c.crumb]}
      title={first.q}
      lead={first.a}
      primary={{ label: c.hero.primary.label, href: c.hero.primary.href }}
      secondary={{ label: c.hero.secondary.label, href: '#faq' }}
      microcopy={c.hero.microcopy}
    />
  );
}

/* -------------------------------------------------------------------- FAQ (Motion-Accordion) */
function FaqSection({ c }: { c: FaqPageContent }) {
  const { item } = useReveal();
  const { lang } = useLang();
  const f = c.faqSection;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: f.items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
  return (
    <section
      id="faq"
      className="scroll-mt-[calc(var(--nav-h)+1.5rem)] bg-[var(--color-bg-soft)] pb-16 pt-12 lg:pb-20 lg:pt-14"
    >
      {/* FAQPage-JSON-LD direkt bei den sichtbaren Fragen (seo-schema.ts Kommentar:
          sichtbarkeitskonform, ohne Duplikate). */}
      <script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll('<', '\\u003c') }}
      />
      <Shell>
        <Reveal className="max-w-3xl">
          <SectionHead eyebrow={f.eyebrow} title={f.title} titleAccent={f.titleAccent} />
          <div className="mt-6 border-t border-[var(--color-line)] pt-5">
            <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
              {lang === 'de'
                ? 'Deine Frage ist nicht dabei? Schreib uns kurz, wir antworten persönlich.'
                : 'Your question is not here? Send us a short message, we answer personally.'}
            </p>
            <a
              href="/kontakt"
              className="mt-2 -ml-4 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-salsa)] transition-colors hover:bg-[var(--color-salsa-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
            >
              {lang === 'de' ? 'Frag uns direkt' : 'Ask us directly'}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
            </a>
          </div>
        </Reveal>

        {/* Volle Breite statt dauerhaft leerer Sticky-Spalte. Zwei Antworten sind im Review offen. */}
        <Reveal className="mt-10 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)] lg:mt-12">
          {f.items.map((faq, index) => (
            <motion.div key={faq.q} variants={item}>
              <FaqItem q={faq.q} a={faq.a} defaultOpen={index < 2} />
            </motion.div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Themen (Orientierung) */
function ThemesSection({ c }: { c: FaqPageContent }) {
  const { item } = useReveal();
  const t = c.themes;
  return (
    <section
      id="themen"
      className="scroll-mt-[calc(var(--nav-h)+1.5rem)] bg-[var(--color-bg-soft)] py-16 lg:py-16"
    >
      <Shell>
        <Reveal className="max-w-2xl">
          <SectionHead title={t.title} titleAccent={t.titleAccent} lead={t.lead} />
        </Reveal>
        <Reveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12" stagger={0.06}>
          {t.items.map((theme, index) => (
            <motion.a
              key={theme.label}
              href={theme.href}
              variants={item}
              className={`group flex items-start justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)] transition-colors hover:border-[var(--color-salsa)] ${
                index < 4 ? 'lg:col-span-3' : 'lg:col-span-4'
              }`}
            >
              <span>
                <span className="block font-display text-lg font-bold leading-tight text-[var(--color-ink)]">
                  {theme.label}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {theme.hint}
                </span>
              </span>
              <ArrowRight
                size={18}
                strokeWidth={2}
                aria-hidden
                className="mt-1 shrink-0 text-[var(--color-salsa)] transition-transform group-hover:translate-x-0.5"
              />
            </motion.a>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Echtes Studioleben */
function CommunityStrip() {
  const { lang } = useLang();
  return (
    <section className="bg-[var(--color-bg-soft)] pb-10 lg:pb-10" aria-label={lang === 'de' ? 'Einblick in eine Tanzstunde' : 'A look inside a dance class'}>
      <Shell>
        <Reveal>
          <figure>
            <div className="overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-paper-warm)]">
              <img
                src="/photos/2026/kurse-classfreude-hero-2100.webp"
                alt={
                  lang === 'de'
                    ? 'Tanzende in einer lebendigen Gruppenstunde im Salsaflow Studio'
                    : 'Dancers enjoying a lively group class in the Salsaflow studio'
                }
                width={2100}
                height={900}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover object-center sm:aspect-[16/7]"
              />
            </div>
            <figcaption className="mt-4 max-w-2xl font-display text-xl leading-tight text-[var(--color-ink)] sm:text-2xl">
              {lang === 'de'
                ? 'Du musst nicht alles vorher wissen. Du darfst einfach anfangen.'
                : 'You do not need to know everything first. You can simply begin.'}
            </figcaption>
          </figure>
        </Reveal>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------- Schluss-CTA (zwei CTAs) */
function FinalCta({ c }: { c: FaqPageContent }) {
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
    />
  );
}
