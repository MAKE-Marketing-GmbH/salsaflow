// Kursplan-Seite unter /kursplan. Vollwertige Seite wie alle anderen: SiteHeader + SiteFooter,
// <Seo page="schedule"/> und der Wochen-Kalender in CourseEngine als Herzstueck.
//
// Umbau 2026-08-07 (Kundenkritik "mach es mehr wie einen Kalender"): Tages-Leiste oben, Kurse
// des Tages nach Uhrzeit. Die Filter-Sidebar ist weg, deshalb verspricht das Intro auch kein
// Filtern mehr, sondern erklaert den Kalender in einem Satz.
//
// ---------------------------------------------------------------------------------------------
// R188 2026-08-21 (Raphael, Video 07:34) — KP1: DER HERO HAT KEIN BILD MEHR.
//   "Kursplan simpel, ohne Hero-Bild." Das full-bleed Studioband unter der Headline ist
//   ersatzlos weg. Der Hero ist jetzt genau zwei Dinge: H1 und ein Satz, was die Seite kann.
//   Danach kommt sofort der Kalender. Alle unten stehenden Absaetze zum Bildband (Crop,
//   Kopf-Landmarken, Cookie-Klemme) beschreiben einen Zustand, den es nicht mehr gibt —
//   sie bleiben nur als Begruendung stehen, warum die Naht-Loesung (Mangel 1) weiter gilt.
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
//
// ---------------------------------------------------------------------------------------------
// R183 2026-08-20 (Raphael): Hero war auf 1440 gestreckt, Koepfe oben/unten abgeschnitten.
//   Zwischenzeitlich stand hier community-diversitaet-01.webp (1920x1280, Verhaeltnis 1.50) in
//   einem 288px-Band (Verhaeltnis 5.00). Das Band traegt jetzt wieder das oben beschriebene
//   Studiowand-Motiv, weil dessen 2100x900 zur Bandform passt. Masse und Begruendung stehen am
//   Bild-Tag selbst. Zusaetzlich ist der doppelte Schnupperstunde-CTA aus der rechten Schiene
//   raus (Begruendung dort) — der Fold trug ihn zweimal.
//
// R183 Fix-Runde 3: "raus" gilt nur AB sm. Runde 2 hatte den CTA auf allen Breiten entfernt;
//   unter 640px ist der Header-CTA aber display:none, damit war das Ziel auf Mobil nur noch
//   hinter dem Burger erreichbar (gemessen, nicht vermutet — Zahlen am Element selbst).
//   Jetzt traegt der Fold auf JEDER Breite genau einen sichtbaren Schnupperstunde-CTA.

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
          // R183 Fix-Runde 2: Der Headroom stand hier als Inline-Style. Inline schlaegt
          // jedes Stylesheet, damit haette die Klemmen-Korrektur unten ihn nicht kuerzen
          // koennen. Er sitzt jetzt als Tailwind-Klasse (gleicher Wert, Regel 062
          // unveraendert) und ist damit im Cookie-offen-Zustand ueberschreibbar.
          className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] pt-[calc(var(--nav-h)+1.5rem)] text-[var(--color-ink)]"
        >
          {/* Warmes Overlay-Muster der Site: derselbe Rot-Radialschein wie in HeroFrame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.07)_0%,transparent_68%)]"
          />
          {/* Achse 'split' wie /tanzkurse: H1 links, Erklaerung + CTA in der rechten Schiene.
              `items-end` setzt beide Bloecke auf dieselbe Grundlinie, statt die Schiene
              mittig neben der Headline schweben zu lassen. */}
          {/* R188 KP1: Ohne Bildband endet der Hero hier. Die Fuss-Luft steigt deshalb von
              pb-2 auf pb-8/pb-10 — vorher trug das Band den Abstand zum Kalender, jetzt
              muss ihn der Textblock selbst tragen, sonst klebt die Tages-Steuerung direkt
              unter dem Intro-Satz. */}
          <Shell className="pb-8 pt-2 sm:pb-10 lg:pb-10 lg:pt-3">
            <div className="grid gap-2 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <h1 className={`type-h1 text-[var(--color-ink)] ${MEASURE_XL}`}>
                {de ? (
                  <>Finde deinen <TitleAccent>Kurs.</TitleAccent></>
                ) : (
                  <>Find your <TitleAccent>class.</TitleAccent></>
                )}
              </h1>
              <div className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-3 lg:gap-5 lg:border-t-0 lg:pt-0">
                <p className="max-w-xl text-pretty text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg">
                  {de
                    ? 'Wähle Staffel, Woche und Wochentag. Du siehst sofort, wann welcher Kurs läuft und wo noch Plätze frei sind.'
                    : 'Pick a term, a week and a weekday. You see straight away when each class runs and where spots are left.'}
                </p>
                {/* R183 (Raphael 20.08.): "weniger unnoetige Elemente" ueber dem Kalender.
                    Weg ist der Doppel-CTA AB sm — der Outline-Button "Neu? Gratis
                    Schnupperstunde" zeigte auf /schnupperstunde, und exakt dieses Ziel
                    traegt die fixe Kopfleiste im SELBEN Fold schon als roten Primaer-Button
                    (SiteHeader.tsx:216-223). Zwei Buttons, ein Ziel, ~400px Abstand.

                    R183 Fix-Runde 3 — KORREKTUR EINES ECHTEN FEHLERS VON MIR (Befund Sol).
                    Runde 2 hat den Button auf ALLEN Breiten entfernt und mit "das Ziel
                    bleibt im Fold erreichbar" begruendet. Diese Begruendung war auf Mobil
                    schlicht falsch, und zwar nachmessbar. Der Header-CTA traegt
                    `hidden ... sm:inline-flex` (SiteHeader.tsx:219): unter 640px ist er
                    display:none. Gemessen auf 390x844 mit geschlossenem Burger
                    (worklog/.r183d-gap.mjs + .r183d-reach.mjs):
                      Header-CTA          -> VERSTECKT, 0x0, display:none
                      Panel #mobile-nav   -> 378x0 (Hoehe null, Inhalt haengt unsichtbar raus)
                      Panel-CTA y=540     -> elementFromPoint trifft die Staffel-Chips,
                                             nicht den Link; hitIsTheLink=false
                      Playwright-Klick    -> CLICKABLE_WITHOUT_BURGER = false (Timeout)
                    Auf Mobil gab es also KEINEN sichtbaren Weg zur Schnupperstunde mehr,
                    ohne vorher den Burger zu oeffnen. Ein Ziel hinter zwei Taps ersetzt ein
                    sichtbares Bedienelement nicht — das ist eine geloeschte Funktion.

                    FIX: der Button kommt zurueck, aber nur genau dort, wo er fehlt.
                    `sm:hidden` ist die exakte Gegenbedingung zum `sm:inline-flex` des
                    Headers. Damit gilt auf jeder Breite: genau EIN sichtbarer
                    Schnupperstunde-CTA im Fold — unter 640px dieser hier, ab 640px der im
                    Header. Raphaels "weniger Elemente" bleibt erfuellt (Desktop unveraendert
                    aufgeraeumt), und die Funktion ist auf Mobil wieder sichtbar bedienbar.
                    Der frueher danebenstehende Trenner-Punkt kehrt NICHT zurueck: er war ab
                    sm sichtbar, also genau dort, wo der Button jetzt weg ist.

                    Kurszahl und Button stehen untereinander (flex-col), nicht nebeneinander:
                    auf 390px umbrach die alte Zeile hinter der Kurszahl. */}
                <span className="text-sm font-semibold text-[var(--color-ink)]">
                  {total !== null
                    ? `${total} ${total === 1 ? t.resultOne : t.resultMany} ${de ? 'pro Woche' : 'per week'}.`
                    : t.loading}
                </span>
                {/* Kursplan bleibt die gefuellte Hauptaktion. Der mobile Ersatz fuer den
                    versteckten Header-CTA behaelt 44px Klickhoehe, aber weder rote Fuellung
                    noch Outline-Pille (absprachen.md:13). */}
                <a
                  data-schedule-trial-cta
                  href="/schnupperstunde"
                  className="group inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-4 sm:hidden"
                >
                  {de ? 'Neu? Gratis Schnupperstunde' : 'New here? Free trial class'}
                  <ArrowRight
                    aria-hidden
                    size={16}
                    strokeWidth={2.25}
                    className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </Shell>

          {/* R188 KP1 (Raphael 21.08., Video 07:34): "Kursplan simpel, OHNE Hero-Bild —
              das gestreckte Bild oben raus." Das gesamte full-bleed Studioband ist damit
              entfernt: der Style-Block mit den Cookie-Klemmen, der Shell-Wrapper und das
              Bild-Tag selbst. Es gibt keinen Rest-Selektor mehr, der ins Leere zeigt —
              [data-schedule-hero-photo] existiert im Baum nicht mehr, also greifen auch
              index.css:858/887 nicht mehr (Nachfahren-Selektoren ohne Knoten).

              WAS AN DIE STELLE TRITT: nichts. Der Kalender rueckt hoch und beginnt sofort
              nach der Kopfzeile. Genau das ist der Auftrag — der Kursplan bleibt die
              primaere Aktion der Seite, und die Aktion faengt jetzt im Fold an statt
              hinter 416px Dekoration.

              Die frueher hier stehende Herleitung des Bandes (Crop-Anker, Kopf-Landmarken,
              Cookie-Klemme) ist mit dem Band selbst hinfaellig geworden und deshalb
              geloescht statt konserviert. Die Historie steht im Git-Log. */}
        </section>

        {/* Der Kalender. max-w 1080px statt der sitewide 1400px: eine Kurszeile ist
            Zeit + Kurs + CTA und braucht keine 1400px — bei voller Breite stand ein 700px
            breites Nichts zwischen Kursname und Button (Beleg:
            /tmp/kursplan-cal-shots3/kursplan-desktop-01-y700.png). */}
        {/* pb: der dunkle ScheduleBottomCta stand vorher direkt auf dem schwarzen Footer —
            zwei grosse Dunkelflaechen ohne Fuge (Kritik-Runde 10.08.2026). Papier-Luft dazwischen. */}
        <section id="kursplan-list" className="scroll-mt-24 bg-[var(--color-bg-soft)] pb-14 pt-2 sm:pb-16 sm:pt-10 lg:pt-5">
          <div className="mx-auto max-w-[1080px] pl-5 pr-24 sm:pl-8 sm:pr-[5.5rem]">
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
