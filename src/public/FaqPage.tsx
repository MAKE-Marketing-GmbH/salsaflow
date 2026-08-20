// FAQ-Seite (/faq) aus dem V3-Copyplan (pages/24_faq.md). Design-System strikt (Kit + StylePage):
// hell im Wechsel (paper-warm <-> bg-soft), Rot sparsam, Reveal-Takt wie Startseite.
//
// Rhythmus: Hero (erste echte Frage) -> zwei FAQ-Spalten nach Thema -> Schluss-CTA.
// JSON-LD bleibt EIN Block (id ld-faq) und sammelt beide Spalten.

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
      <div className="faq-page" data-faq-page="" data-cookie-clear={cookieClear ? 'true' : undefined}>
        <FaqHero c={c} />
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
function allFaqItems(c: FaqPageContent) {
  return c.faqSection.columns.flatMap((column) => column.items);
}

function FaqHero({ c }: { c: FaqPageContent }) {
  const first = allFaqItems(c)[0];
  return (
    <SubHero
      axis="split"
      seoCrumbs={[c.crumb]}
      title={first.q}
      lead={first.a}
      primary={{ label: c.hero.primary.label, href: c.hero.primary.href }}
      secondary={{ label: c.hero.secondary.label, href: '#faq' }}
      microcopy={c.hero.microcopy}
      dense
      tightBottom
    />
  );
}

/* -------------------------------------------------------------------- FAQ (Motion-Accordion) */
function FaqSection({ c }: { c: FaqPageContent }) {
  const { item } = useReveal();
  const { lang } = useLang();
  const f = c.faqSection;
  const items = allFaqItems(c);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
  return (
    <section
      id="faq"
      className="scroll-mt-[calc(var(--nav-h)+1.5rem)] bg-[var(--color-bg-soft)] pb-16 pt-8 lg:pb-20 lg:pt-14"
    >
      <script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll('<', '\\u003c') }}
      />
      <Shell>
        <Reveal className="max-w-3xl">
          <SectionHead eyebrow={f.eyebrow} title={f.title} titleAccent={f.titleAccent} />
          <div className="mt-6 flex flex-wrap gap-2">
            {c.themes.items.map((theme) => (
              <a
                key={theme.href}
                href={theme.href}
                className="inline-flex min-h-11 items-center rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-salsa)] hover:text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
              >
                {theme.label}
              </a>
            ))}
          </div>
          <div className="mt-8 border-t border-[var(--color-line)] pt-6">
            <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-muted)]">
              {lang === 'de'
                ? 'Deine Frage ist nicht dabei? Schreib uns kurz, wir antworten persönlich.'
                : 'Your question is not here? Send us a short message, we answer personally.'}
            </p>
            <a
              href="/kontakt"
              className="group mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--color-salsa)] transition-colors hover:text-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
            >
              {lang === 'de' ? 'Frag uns direkt' : 'Ask us directly'}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out motion-safe:group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>

        <Reveal className="mt-12 flex max-w-3xl flex-col gap-16 lg:mt-16" stagger={0.06}>
          {f.columns.map((column) => (
            <motion.div key={column.title} variants={item}>
              <h3 className="type-h3 text-[var(--color-ink)]">{column.title}</h3>
              <div className="mt-6 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                {column.items.map((faq, i) => (
                  <FaqItem
                    key={faq.q}
                    q={faq.q}
                    a={faq.a}
                    defaultOpen={column === f.columns[0] && i === 0}
                    link={faq.link}
                  />
                ))}
              </div>
            </motion.div>
          ))}
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
