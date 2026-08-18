// Kursplan-Seite unter /kursplan. Vollwertige Seite wie alle anderen: SiteHeader + SiteFooter,
// <Seo page="schedule"/> und der Wochen-Kalender in CourseEngine als Herzstueck.
//
// Umbau 2026-08-07 (Kundenkritik "mach es mehr wie einen Kalender"): Tages-Leiste oben, Kurse
// des Tages nach Uhrzeit. Die Filter-Sidebar ist weg, deshalb verspricht das Intro auch kein
// Filtern mehr, sondern erklaert den Kalender in einem Satz.
//
// ---------------------------------------------------------------------------------------------
// Hero-Umbau 2026-08-14 (Welle "geil"), zwei belegte Maengel:
//
// MANGEL 1 — DIE NAHT. Die Seite reichte `solidBackdrop` an SiteHeader durch. Damit bekam die
//   fixe Kopfleiste eine EIGENE Flaeche (paper-warm #FBFAF8), waehrend die Hero-Sektion
//   darunter auf bg-soft (#F6F6F5) sass. Auf 1440x900 lief dadurch bei y=76 eine sichtbare
//   waagerechte Kante quer durch den Bildschirm — zwei Grautoene, die sich beruehren
//   (Beleg /tmp/s2/base-desktop-fold.png). `solidBackdrop` ist raus: die Nav-Pille schwebt
//   wie auf JEDER anderen Unterseite mit ihrer eigenen Rundung auf der Hero-Flaeche, und
//   dieselbe Flaeche laeuft ununterbrochen von y=0 bis unter die Pille hindurch. Der Hero
//   traegt dafuer den `--nav-h`-Headroom selbst (Regel 062, wie HeroFrame in subpage/kit.tsx).
//
// MANGEL 2 — DER HERO WAR EINE ZEILE. Er war 2026-08-07 bewusst auf Zeilenhoehe gedrueckt,
//   damit der Kalender ueber dem Fold beginnt. Das hat den Fold gerettet und den Einstieg
//   kaputt gemacht: H1, ein Satz und ein 132px-Briefmarkenfoto rechts. /tanzkurse macht es
//   richtig vor (CoursesPage.tsx -> HeroFrame): Luft ueber der Typo, und das Foto laeuft als
//   full-bleed Band UNTER dem Text bis an beide Viewport-Kanten. Genau diese Bauform steht
//   jetzt hier — mit dem warmen Overlay-Muster der Site (Rot-Radial oben rechts) und einem
//   bisher ungenutzten Studio-Motiv (hero-paar-studiowand-hero-2100.webp, 0 Platzierungen vor
//   dieser Aenderung, Image-Reuse-Gate bleibt gruen).

import { useState } from 'react';
import { Seo } from '@/lib/seo';
import { useLang } from '@/lib/i18n';
import { embeddedSchedule } from '@/lib/schedule';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { TitleAccent, Shell } from '@/public/site/primitives';
import { MEASURE_XL } from '@/public/subpage/kit';
import { CourseEngine } from '@/public/courses/CourseEngine';

export function SchedulePage() {
  const { lang, t } = useLang();
  const de = lang === 'de';
  // Gesamtzahl der Kurse fuer die Hero-Zeile. Die Engine meldet sie nach dem Laden zurueck,
  // damit es keinen zweiten Fetch braucht.
  // Startwert aus dem eingebetteten Plan: sonst steht im ausgelieferten HTML "Kursplan wird
  // geladen" statt der echten Kurszahl.
  const [total, setTotal] = useState<number | null>(() => embeddedSchedule()?.courses.length ?? null);

  return (
    <>
      <Seo page="schedule" />
      {/* Kein solidBackdrop: die Pille bekaeme sonst ihre eigene Flaeche und erzeugte
          genau die Kante, die dieser Umbau entfernt (siehe Kopfkommentar, Mangel 1). */}
      <SiteHeader />
      {/* R101: data-kursplan-markiert den Seitenstamm. index.css setzt darauf mobil
          --whatsapp-lift: 5rem — der WhatsApp-Float rechnet die Variable in seinen
          Inline-bottom mit und gibt die Tages-Chips Mo–Sa frei. Desktop (sm+) 0. */}
      <main id="main" tabIndex={-1} data-kursplan>
        {/* Hero. Die Flaeche beginnt bei y=0 und laeuft hinter der Kopfleiste durch; der
            Textblock bekommt den Headroom ueber paddingTop (Regel 062). Bauform und Masse
            folgen HeroFrame/axis="split" von /tanzkurse. */}
        <section
          data-hero-bleed
          data-schedule-hero
          className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]"
          style={{ paddingTop: 'calc(var(--nav-h) + 1.5rem)' }}
        >
          {/* Warmes Overlay-Muster der Site: derselbe Rot-Radialschein wie in HeroFrame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
          />
          {/* Achse 'split' wie /tanzkurse: H1 links, Erklaerung + CTA in der rechten Schiene.
              `items-end` setzt beide Bloecke auf dieselbe Grundlinie, statt die Schiene
              mittig neben der Headline schweben zu lassen. */}
          <Shell className="pb-9 pt-4 sm:pb-11 lg:pb-6 lg:pt-4">
            <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <h1 className={`type-h1 text-[var(--color-ink)] ${MEASURE_XL}`}>
                {de ? (
                  <>Finde deinen <TitleAccent>Kurs.</TitleAccent></>
                ) : (
                  <>Find your <TitleAccent>class.</TitleAccent></>
                )}
              </h1>
              <div className="flex flex-col gap-5 border-t border-[var(--color-line)] pt-5 lg:border-t-0 lg:pt-0">
                <p className="max-w-xl text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
                  {de
                    ? 'Wähle Staffel, Woche und Wochentag. Du siehst sofort, wann welcher Kurs läuft und wo noch Plätze frei sind.'
                    : 'Pick a term, a week and a weekday. You see straight away when each class runs and where spots are left.'}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-sm font-semibold text-[var(--color-ink)]">
                    {total !== null
                      ? `${total} ${total === 1 ? t.resultOne : t.resultMany} ${de ? 'pro Woche' : 'per week'}.`
                      : t.loading}
                  </span>
                  {/* hidden sm: auf 390px umbrach die Zeile hinter der Kurszahl, und der
                      Trenner stand als einzelner Punkt allein am Zeilenende. */}
                  <span aria-hidden className="hidden text-[var(--color-line)] sm:inline">·</span>
                  <a
                    href="/schnupperstunde"
                    className="btn-base btn-outline-salsa px-4 py-2 text-sm"
                  >
                    {de ? 'Neu? Gratis Schnupperstunde' : 'New here? Free trial class'}
                  </a>
                </div>
              </div>
            </div>
          </Shell>

          {/* Full-bleed Foto-Band im /tanzkurse-Stil: ohne Shell, ohne Radius, ohne Rahmen,
              bis an beide Viewport-Kanten. Es traegt keinen Text. */}
          <div data-schedule-hero-photo className="relative w-full overflow-hidden">
            <img
              src="/photos/2026/community-diversitaet-01.webp"
              alt={de
                ? 'Tanzende verschiedener Altersgruppen in einer Salsaflow-Stunde'
                : 'Dancers of different ages in a Salsaflow class'}
              width={2100}
              height={900}
              loading="eager"
              fetchPriority="high"
              // center 28%: beide Gesichter liegen im oberen Drittel des Motivs. Bei 38%
              // schnitt das flache Band das Kinn der Taenzerin an (gemessen 1440x900,
              // /tmp/s2/v1-desktop-fold.png).
              className="h-[12rem] w-full object-cover object-[center_28%] sm:h-[15rem] lg:h-[11rem]"
            />
          </div>
        </section>

        {/* Der Kalender. max-w 1080px statt der sitewide 1400px: eine Kurszeile ist
            Zeit + Kurs + CTA und braucht keine 1400px — bei voller Breite stand ein 700px
            breites Nichts zwischen Kursname und Button (Beleg:
            /tmp/kursplan-cal-shots3/kursplan-desktop-01-y700.png). */}
        {/* pb: der dunkle ScheduleBottomCta stand vorher direkt auf dem schwarzen Footer —
            zwei grosse Dunkelflaechen ohne Fuge (Kritik-Runde 10.08.2026). Papier-Luft dazwischen. */}
        <section id="kursplan-list" className="scroll-mt-24 bg-[var(--color-bg-soft)] pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pt-5">
          <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
            <CourseEngine onTotal={setTotal} />
          </div>
        </section>
      </main>
      {/* Kein Float-Overlap: auf 1440 laege die gruene Pille auf der Samstag-Karte
          (S7-Kritik Sol, kursplan-desktop-fold). WhatsApp bleibt im Footer.
          R101: mobil sass der Float auf dem Tages-Chip «Mi». Der Lift laeuft ueber
          data-kursplan am <main> (oben) + --whatsapp-lift in index.css, NICHT ueber eine
          Klasse — der Float-bottom ist inline und wuerde eine Klasse schlagen. Copy/Raster
          bleiben. */}
      <SiteFooter entryCta={false} />
    </>
  );
}
