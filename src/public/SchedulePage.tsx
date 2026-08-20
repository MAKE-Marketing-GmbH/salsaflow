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
          <Shell className="pb-2 pt-2 sm:pb-11 lg:pb-4 lg:pt-3">
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
                <a
                  data-schedule-trial-cta
                  href="/schnupperstunde"
                  className="btn-base btn-outline-salsa self-start px-4 py-2 text-sm sm:hidden"
                >
                  {de ? 'Neu? Gratis Schnupperstunde' : 'New here? Free trial class'}
                </a>
              </div>
            </div>
          </Shell>

          {/* R183 Fix-Runde 2 (Kritik Sol + Grok + Kimi, alle drei derselbe Befund):
              Im Cookie-offen-Zustand — also bei JEDEM Erstbesucher vor der Einwilligung —
              schnitt das Band der Frau waagerecht durch Mund und Kinn. Die Acceptance-
              Bedingung "Koepfe ganz im Band" war damit im wichtigsten Zustand verletzt.

              URSACHE, gerechnet statt geraten. Die Kopf-Landmarken sind an einem Lineal-
              Streifen durch die Quelle abgelesen, nicht geschaetzt (Beleg:
              /tmp/r183b-landmark/mann.png und frau.png, Raster alle 25px):
                Mann (von hinten)  Haaransatz y=115   Kieferkante y=495
                Frau               Haaransatz y=285   Kinn        y=525
              Bindend ist Mann-Haar bis Frau-Kinn: y 115..525 = 410px = 45.6% der
              Quellhoehe. object-cover skaliert auf 1440 Breite mit 1440/2100 = 0.6857,
              die Spanne wird also 281px hoch. index.css:887 klemmt das Band bei offener
              Leiste auf 14rem = 224px. 224 < 282: die Koepfe passen bei KEINEM
              object-position-Wert hinein. Der Crop-Anker war nie das Problem, die
              geklemmte Hoehe ist es. Beleg-Crops: /tmp/r183b-crops/band224-pos*.png.

              FIX 1 — Band auf 19rem = 304px. 282px waeren das nackte Minimum; 288px
              liessen das Kinn exakt auf der Unterkante liegen (gemessen: 0px Luft), was
              wie ein Schnitt aussieht. 304px geben oben 10px und unten 13px echte Luft.

              FIX 2 — der Platz kommt von OBEN, nicht von unten. Die Klemme aus R179
              existiert, damit die Wochen-Pfeile ueber der Cookie-Leiste bleiben. Gemessen
              auf 1440x730 bei offener Leiste: Pfeile enden y=596, Leiste beginnt y=652,
              also nur 56px Spielraum — zu wenig fuer ein 304px-Band. Deshalb gibt der
              Hero-Kopf im geklemmten Zustand 2.5rem Headroom ab.

              Warum genau 2.5rem und nicht mehr: der Headroom haelt H1 und Intro-Text
              unter der schwebenden Nav-Pille (Regel 062). Ein erster Versuch mit 5rem
              zog den Absatz auf y=32 und damit HINTER die Pille (Unterkante y=53) — im
              Screenshot sichtbar abgeschnitten. Gemessener Sweep bei offener Leiste:
                cut 0rem   Text frei, Pfeile ragen in die Leiste (676 > 652)
                cut 1rem   Text frei, Pfeile ragen in die Leiste (660 > 652)
                cut 2rem   Text frei, Pfeile frei (644 <= 652)   <- Grenze
                cut 2.5rem Text frei (Absatz y=72 > Pille y=53), Pfeile frei (636)
              2.5rem liegt in diesem Fenster und haelt zu beiden Waenden Abstand.

              FIX 3 — Crop-Anker 22% fuer den geklemmten Fall. Bei 304px liegt damit der
              Haaransatz des Mannes 10px unter der Oberkante und das Kinn der Frau 13px
              ueber der Unterkante. Kleinere Werte druecken das Kinn an die Kante.

              WARUM ALS <style> UND NICHT INLINE. index.css ist in diesem Auftrag TABU,
              die Klemme muss also von hier ueberboten werden. Ein Inline-`height` am
              Bild-Tag koennte den Cookie-Zustand nicht unterscheiden und wuerde auch den
              gesunden Normalfall von 416px auf 304px druecken — die Streckung stiege
              dort von 1.48 auf 2.03. Diese Regeln spiegeln deshalb exakt den Selektor
              aus index.css:887 und haengen einen eigenen Haken davor: gleiche Bedingung,
              hoehere Spezifitaet, nur der geklemmte Desktop-Fall. Mobil bleibt alles
              unberuehrt — dort ist die Spanne nur 76px und passt laengst in die 176px
              der mobilen Klemme. */}
          <style>{`@media (width >= 40rem) {
  body:has([data-testid='cookie-accept']):not(:has([data-cookie-clear='true'])) [data-schedule-hero-photo] [data-schedule-hero-photo-img] {
    height: 19rem;
    object-position: center 22%;
  }
  body:has([data-testid='cookie-accept']):not(:has([data-cookie-clear='true'])) [data-schedule-hero][data-schedule-hero] {
    padding-top: calc(var(--nav-h) + 1.5rem - 2.5rem);
  }
}`}</style>
          {/* R183 Radius-Runde (Raphael 20.08.: "Tanzkurse-Bilder rund" — gilt hier gleich).
              GEMESSENER IST vorher: radius desktop 0px / mobil 0px. Das Band lief als
              einziges Element der Seite eckig full-bleed bis an beide Viewportkanten,
              waehrend Hero-Pille und alle Karten drumherum --radius-media tragen (Beleg:
              worklog/shots/S7-ux183-mobil/kursplan-mobile-00-fold.png eckig gegen
              tanzkurse-mobile-00-fold.png rund).

              FIX, gebaut wie /tanzkurse es vormacht (CoursesPage.tsx:280): Shell gibt dem
              Band denselben Seitenrand wie dem Text darueber, der direkte Eltern-DIV traegt
              `overflow-hidden rounded-[var(--radius-media)]`. Der Radius sitzt bewusst am
              direkten Elternteil des Bild-Tags und nicht am Bild selbst — `overflow-hidden`
              schneidet dann auch das object-cover-Bild sauber an der Rundung ab.

              WARUM DIE KLEMMEN WEITER GREIFEN: index.css:858/887 und der <style>-Block
              oben adressieren `[data-schedule-hero-photo] img` bzw.
              `[data-schedule-hero-photo] [data-schedule-hero-photo-img]` — beides
              Nachfahren-Selektoren. Der neue Zwischen-DIV steht dazwischen, die Regeln
              treffen das Bild unveraendert. Hoehen und Motiv hero-paar-studiowand bleiben
              exakt wie gemessen; die Streckung bleibt damit gefixt. Der WAAGERECHTE
              Crop-Anker ist danach in Fix-Runde 2 noch einmal korrigiert worden (FIX 4
              am Bild-Tag): senkrecht weiter 20%, waagerecht auf Mobil 30% statt center,
              weil `center` dort den Kopf des Mannes abschnitt. */}
          <Shell className="pb-2 pt-3 sm:pt-4">
            <div data-schedule-hero-photo className="relative w-full overflow-hidden rounded-[var(--radius-media)]">
              <img
                // Eigener Haken fuer die Klemmen-Korrektur im <style> darueber. Nur dafuer da:
                // er gibt der Regel die noetige Spezifitaet gegen index.css:887, ohne dass
                // ich die fremde Datei anfassen muss.
                data-schedule-hero-photo-img
                src="/photos/2026/hero-paar-studiowand-hero-2100.webp"
                alt={de
                  ? 'Tanzendes Paar vor der Salsaflow-Studiowand'
                  : 'A dancing couple in front of the Salsaflow studio wall'}
                width={2100}
                height={900}
                loading="eager"
                fetchPriority="high"
                // R183 (Raphael 20.08.): "Hero nicht gestreckt, Koepfe ganz".
                //
                // URSACHE, gemessen statt geschaetzt. Die Quelle war
                // community-diversitaet-01.webp mit 1920x1280 = Seitenverhaeltnis 1.50.
                // Das Band war auf 1440 aber 1440x288 = 5.00. object-cover skaliert
                // deshalb auf Breite und schneidet oben und unten weg: sichtbar blieben
                // 288/960 = 30% der Bildhoehe. Genau da lagen die Koepfe — Schaedeldecken
                // und Kinn fielen aus dem Streifen, und der Rest wirkte auf 1440 wie
                // gezogen.
                //
                // FIX 1 — Motiv mit Band-Seitenverhaeltnis. hero-paar-studiowand-hero-2100
                // ist 2100x900 = 2.33, also als Band-Fassung geschnitten und nicht als
                // 3:2-Foto. Es ist NICHT der /tanzkurse-Hero (der ist
                // kurse-classfreude-hero-2100.webp, CoursesPage.tsx:259) und war vor
                // dieser Aenderung nirgends im Code platziert — Image-Reuse-Gate gruen.
                //
                // FIX 2 — Band hoeher. lg 26rem (416px) statt 18rem (288px). Das
                // Crop-Fenster geht damit auf 1440/416 = 3.46 statt 5.00; die Streckung
                // gegenueber der Quelle faellt von 3.3x auf 1.5x. /tanzkurse faehrt
                // dieselbe Quelle auf lg:h-[34rem]; 26rem bleibt bewusst darunter, damit
                // der Kalender im Fold anfaengt.
                //
                // FIX 3 — Crop-Anker, am gerenderten Band ausgemessen statt geschaetzt.
                // Gemessen wurde der Abstand der Haaransaetze zur Bandoberkante auf 1440
                // (Sweep 20/25/30/35/40%):
                //   20%: Mann 46px Luft, Frau 114px   <- gewaehlt
                //   30%: Mann 26px, Frau  94px
                //   40%: Mann  6px, Frau  74px
                // 20% gibt beiden Koepfen die meiste Luft nach oben; groessere Werte
                // schieben den Ausschnitt nach unten und druecken den Mann an die Kante.
                //
                // Zweiter Zustand, absichtlich mitgemessen: solange die Cookie-Leiste offen
                // ist, klemmt index.css das Band auf 14rem (Zeile 887, fremde Datei, hier
                // TABU). Auch in diesem geklemmten Fall bleibt der Kopf des Mannes bei 20%
                // frei (8px Luft) — bei 25% und hoeher stiess er an die Oberkante.
                //
                // FIX 4 (R183 Fix-Runde 2, Befund Sol — KORREKTUR EINES ECHTEN FEHLERS VON
                // MIR). Ich hatte "Koepfe ganz" fuer Mobil behauptet, ohne den WAAGERECHTEN
                // Ausschnitt zu messen. Er war verletzt: auf 390 schnitt die linke Bandkante
                // durch den Schaedel des Mannes.
                //
                // URSACHE, gerechnet statt geraten (worklog/.r183f-probe.mjs). Auf 390 ist
                // das Band 350x240 = 1.46, die Quelle 2100x900 = 2.33. object-cover skaliert
                // deshalb auf die HOEHE (scale 0.267) und schneidet LINKS UND RECHTS weg:
                // sichtbar bleiben nur 1313 der 2100 Quellpixel. Mit `center` lag dieses
                // Fenster auf x 394..1706. Der Haaransatz des Mannes liegt aber bei x~280
                // (abgelesen am Raster /tmp/r183f/source-ruler.png, Linien alle 200px) —
                // 114px LINKS ausserhalb. Auf Desktop tritt der Fehler nicht auf: dort ist
                // das Band 1336x416 = 3.21 und breiter als die Quelle, es wird auf die
                // BREITE skaliert und nur oben/unten geschnitten (Fenster x 0..2100).
                // Deshalb war der Mangel allein auf Mobil sichtbar.
                //
                // FIX: der Anker wandert auf Mobil nach LINKS. Gemessener Sweep bei 350px
                // Boxbreite (worklog/.r183f-sweep.mjs); bindend ist Mann-Haar x280 bis
                // Frau-Haarkante rechts x1300:
                //   pos-x 40%  Fenster x 315..1628   Mann angeschnitten
                //   pos-x 30%  Fenster x 236..1549   Mann 44px Luft, Frau ganz   <- gewaehlt
                //   pos-x 20%  Fenster x 158..1470   Mann 122px Luft, Paar sitzt links
                //   pos-x  0%  Fenster x   0..1313   Stativ am Rand kommt ins Bild
                // 30% ist der rechteste Wert, der den Kopf noch ganz zeigt, und haelt das
                // Paar dabei am naechsten an der Bildmitte.
                //
                // Warum die HOEHE nicht steigt: mehr Hoehe verengt das Fenster (h20rem ->
                // nur 984px, gemessen), dann passen die 1020px Kopf-zu-Kopf-Spanne NICHT
                // mehr hinein. Die Streckung bleibt damit ebenfalls unangetastet.
                //
                // Ab sm zurueck auf `center`: dort ist das Band breit genug und wird auf die
                // Breite skaliert, ein Seitenversatz haette keine Wirkung ausser Unordnung.
                // Der senkrechte Anker bleibt in JEDEM Fall 20% (FIX 3, oben belegt).
                //
                // Filter inline, sonst gewinnt `main img` (saturate 0.96).
                className="h-[15rem] w-full object-cover object-[30%_20%] sm:h-[19rem] sm:object-[center_20%] lg:h-[26rem]"
                style={{ filter: 'saturate(1) contrast(1.04) brightness(1.08)' }}
              />
            </div>
          </Shell>
        </section>

        {/* Der Kalender. max-w 1080px statt der sitewide 1400px: eine Kurszeile ist
            Zeit + Kurs + CTA und braucht keine 1400px — bei voller Breite stand ein 700px
            breites Nichts zwischen Kursname und Button (Beleg:
            /tmp/kursplan-cal-shots3/kursplan-desktop-01-y700.png). */}
        {/* pb: der dunkle ScheduleBottomCta stand vorher direkt auf dem schwarzen Footer —
            zwei grosse Dunkelflaechen ohne Fuge (Kritik-Runde 10.08.2026). Papier-Luft dazwischen. */}
        <section id="kursplan-list" className="scroll-mt-24 bg-[var(--color-bg-soft)] pb-14 pt-2 sm:pb-16 sm:pt-10 lg:pt-5">
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
