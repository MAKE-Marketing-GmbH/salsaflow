// Geteilte Render-Ansicht fuer die Rechtstexte (Etappe 15): Impressum + Datenschutz teilen
// dasselbe ruhige, helle Layout (Designsystem aus Etappe 10: SiteHeader/Footer, Eyebrow,
// Tokens). Sprache kommt aus dem globalen LangProvider (main.tsx). Lange Lese-Seite,
// daher schlichte Prosa statt Karten.

import { useLang } from '@/lib/i18n';
import { Seo, type SeoKey } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { Eyebrow, sectionTitle, sectionLead } from '@/public/site/primitives';
import type { LegalDoc } from '@/public/legal/content';

export function LegalView({ doc, seoKey }: { doc: Record<'de' | 'en', LegalDoc>; seoKey: SeoKey }) {
  const { lang } = useLang();
  const d = doc[lang];

  return (
    <>
      <Seo page={seoKey} />
      <SiteHeader />
      <main id="main" tabIndex={-1} style={{ marginTop: 'var(--nav-h, 88px)' }}>
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <header className="mb-12">
            <Eyebrow>{d.lastUpdated}</Eyebrow>
            <h1 className={`mt-4 ${sectionTitle}`}>{d.pageTitle}</h1>
            <p className={`mt-5 ${sectionLead}`}>{d.intro}</p>
          </header>

          <div className="space-y-10">
            {d.sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl">
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-base leading-relaxed text-[var(--color-ink-muted)]">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
