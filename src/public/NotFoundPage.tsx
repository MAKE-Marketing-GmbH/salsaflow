import { ArrowRight, House } from 'lucide-react';
import { Seo } from '@/lib/seo';
import { useLang } from '@/lib/i18n';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';

const COPY = {
  de: {
    eyebrow: '404 · Falscher Takt',
    title: 'Diese Seite tanzt gerade woanders.',
    lead: 'Der Link ist nicht mehr gültig oder die Adresse wurde falsch eingegeben. Auf der Startseite und im Kursplan findest du direkt weiter.',
    home: 'Zur Startseite',
    schedule: 'Kursplan ansehen',
  },
  en: {
    eyebrow: '404 · Wrong beat',
    title: 'This page is dancing somewhere else.',
    lead: 'This link is no longer valid or the address was entered incorrectly. The home page and course schedule will get you back on track.',
    home: 'Back home',
    schedule: 'View schedule',
  },
} as const;

export function NotFoundPage() {
  const { lang } = useLang();
  const c = COPY[lang];

  return (
    <>
      <Seo page="notFound" noindex />
      <SiteHeader />
      <main
        id="main"
        tabIndex={-1}
        className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-[var(--color-paper-warm)] px-4 py-20 sm:px-6"
        style={{ paddingTop: 'calc(var(--nav-h) + 4rem)' }}
      >
        <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-2/5 bg-[var(--color-salsa-50)]" />
        <div aria-hidden className="absolute -right-20 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full border border-[var(--color-salsa)]/15" />
        <div className="mx-auto w-full max-w-4xl">
          <div className="max-w-3xl border-l-2 border-[var(--color-salsa)] pl-5 sm:pl-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">{c.eyebrow}</p>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-[clamp(3rem,8vw,6.8rem)] leading-[0.93] tracking-[-0.035em] text-[var(--color-ink)]">
              {c.title}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-7 text-[var(--color-ink-muted)] sm:text-xl">{c.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/"
                className="t-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-salsa)] px-6 text-base font-semibold text-white hover:bg-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
              >
                <House size={18} aria-hidden />
                {c.home}
              </a>
              <a
                href="/kursplan"
                className="t-hover inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-6 text-base font-semibold text-[var(--color-ink)] hover:border-[var(--color-salsa)] hover:text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
              >
                {c.schedule}
                <ArrowRight size={18} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
