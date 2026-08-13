// Kursplan-Seite unter /kursplan. Vollwertige Seite wie alle anderen: SiteHeader + SiteFooter,
// <Seo page="schedule"/> und ein kompaktes Off-White-Intro (eine Botschaft + ein kuratiertes
// Kursfoto) mit Headroom unter der fixen Navbar. Sprache kommt aus dem globalen LangProvider.
//
// Umbau 2026-08-07 (Kundenkritik "mach es mehr wie einen Kalender"): das Herzstueck ist der
// Wochen-Kalender in CourseEngine — Tages-Leiste oben, Kurse des Tages nach Uhrzeit. Die Filter-
// Sidebar ist weg, deshalb verspricht das Intro auch kein Filtern mehr, sondern erklaert den
// Kalender in einem Satz.
//
// Fix 2026-08-07 (Kritik-Runde 3): das Intro war 530px hoch (grosses Kursfoto rechts, zwei
// Fliesstext-Zeilen). Im ersten Viewport (1440x730) standen dadurch NUR Headline, Foto und die
// Tages-/Stil-Chips — keine einzige Uhrzeit, der Plan begann erst bei y700
// (Beleg: /tmp/salsaflow-r3/kursplan-desktop-00-fold.png). Auf einer Seite, deren einziger Job
// "wann laeuft was" ist, ist das der teuerste Fehler. Das Intro ist jetzt eine Zeile hoch:
// Headline + ein kurzer Satz, das Foto nur noch als schmaler Streifen rechts (Marken-Anker,
// kostet keine Fold-Hoehe). Der Kalender startet damit noch ueber dem Fold.

import { useState } from 'react';
import { Seo } from '@/lib/seo';
import { useLang } from '@/lib/i18n';
import { embeddedSchedule } from '@/lib/schedule';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { TitleAccent } from '@/public/site/primitives';
import { CourseEngine } from '@/public/courses/CourseEngine';

export function SchedulePage() {
  const { lang, t } = useLang();
  // Gesamtzahl der Kurse fuer die Hero-Zeile. Die Engine meldet sie nach dem Laden zurueck,
  // damit es keinen zweiten Fetch braucht.
  // Startwert aus dem eingebetteten Plan: sonst steht im ausgelieferten HTML "Kursplan wird
  // geladen" statt der echten Kurszahl.
  const [total, setTotal] = useState<number | null>(() => embeddedSchedule()?.courses.length ?? null);

  return (
    <>
      <Seo page="schedule" />
      <SiteHeader solidBackdrop />
      <main id="main" tabIndex={-1}>
        {/* Intro: EINE Bildschirmzeile. Headline links, Foto rechts nur als schmaler Streifen in
            Zeilenhoehe — es soll die Marke setzen, nicht den Plan nach unten schieben. */}
        <section className="bg-[var(--color-bg-soft)]" style={{ paddingTop: 'calc(var(--nav-h) + 0.5rem)' }}>
          <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-5 pb-4 pt-3 sm:px-8 lg:flex-row lg:items-center lg:gap-6 lg:pt-1">
            <div className="min-w-0 flex-1">
              {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
              <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-[var(--color-ink)] sm:text-5xl">
                {lang === 'de' ? (
                  <>Finde deinen <TitleAccent>Kurs.</TitleAccent></>
                ) : (
                  <>Find your <TitleAccent>class.</TitleAccent></>
                )}
              </h1>
              <p className="mt-2.5 text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
                {lang === 'de'
                  ? 'Wähle deinen Wochentag. Du siehst sofort, wann was läuft.'
                  : 'Pick your weekday and see exactly when each class runs.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-sm font-semibold text-[var(--color-ink)]">
                  {total !== null
                    ? `${total} ${total === 1 ? t.resultOne : t.resultMany} ${lang === 'de' ? 'pro Woche' : 'per week'}.`
                    : t.loading}
                </span>
                <span aria-hidden className="text-[var(--color-line)]">·</span>
                <a
                  href="/kontakt#schnupperstunde"
                  className="inline-flex min-h-10 items-center rounded-full border border-[var(--color-salsa)] px-4 py-2 text-sm font-semibold text-[var(--color-salsa)] transition-colors hover:bg-[var(--color-salsa)] hover:text-white"
                >
                  {lang === 'de' ? 'Neu? Gratis Schnupperstunde' : 'New here? Free trial class'}
                </a>
              </div>
            </div>
            {/* Auf Mobile wieder sichtbar: das echte Klassenfoto setzt den Einstieg emotional, ohne
                die Kalenderzeilen hinter einen reinen Textblock zu schieben. Desktop bleibt der
                Bildanker bewusst schmal. */}
            <figure className="relative w-full overflow-hidden rounded-[var(--radius-media)] ring-1 ring-black/5 lg:w-[260px] lg:shrink-0">
              <img
                src="/photos/schedule/kurs-aktion.webp"
                alt={lang === 'de' ? 'Salsaflow-Kurs in Aktion im Studio' : 'Salsaflow class in action in the studio'}
                width={1600}
                height={1067}
                loading="eager"
                // 12% statt Mitte: Das Band ist sehr flach (160px auf voller Breite). Mittig
                // geschnitten faellt die ganze Kopfreihe raus. 25% reichte nicht: zwischen
                // 640 und 1023px (Band 190px) schnitt der Crop die hintere Kopfreihe oben an
                // (Critic 13.08.2026); 12% haelt sie auf allen Breiten im Bild.
                className="h-[160px] w-full object-cover object-[center_12%] sm:h-[190px] lg:h-[132px]"
              />
            </figure>
          </div>
        </section>

        {/* Der Kalender. max-w 1080px statt der sitewide 1400px: eine Kurszeile ist
            Zeit + Kurs + CTA und braucht keine 1400px — bei voller Breite stand ein 700px
            breites Nichts zwischen Kursname und Button (Beleg:
            /tmp/kursplan-cal-shots3/kursplan-desktop-01-y700.png). */}
        {/* pb: der dunkle ScheduleBottomCta stand vorher direkt auf dem schwarzen Footer —
            zwei grosse Dunkelflaechen ohne Fuge (Kritik-Runde 10.08.2026). Papier-Luft dazwischen. */}
        <section id="kursplan-list" className="scroll-mt-24 bg-[var(--color-paper-warm)] pb-14 pt-4 sm:pb-16">
          <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
            <CourseEngine onTotal={setTotal} />
          </div>
        </section>
      </main>
      <SiteFooter entryCta={false} />
    </>
  );
}
