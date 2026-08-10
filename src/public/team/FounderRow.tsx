// Die vier echten Gründer als Studio-Portraits.
//
// Design-Kritik Runde 2 (major), zwei Befunde in einer Komponente:
//
// 1) "Vier Gruender-Freisteller auf Weiss mit unterschiedlichen Crops (Fabio halbe Figur,
//    Claudia fast ganze Figur, Vanessa Dreiviertel) direkt neben Reportagefotos derselben
//    Personen. Zwei Fotowelten in einem Abschnitt."
//    Der Crop ist jetzt normiert (siehe `bust` in team/content.ts: aus dem Alpha-Kanal
//    gemessene Scheitel- und Schulterlinie, beide auf 7% / 62% der Panelhoehe gelegt, damit
//    die Augenlinie aller vier gleich hoch sitzt). Der Grund liegt nicht mehr auf Weiss,
//    sondern auf --color-bg-soft: der Freisteller-Hintergrund ist damit ein Ton der Seite
//    und kein zweiter Weisston neben den Reportagefotos.
//
// 2) "/team mobil: vier Personenkarten mit je einem kleinen Foto links und drei Textzeilen
//    rechts, 190px Hoehe pro Person fuer drei Woerter Information."
//    Mobil laeuft das jetzt als 2-spaltiges Raster mit quadratischem Foto und Namen darunter
//    (Kritik-Vorgabe). Das halbiert die Hoehe des Abschnitts auf 390px.
//
// Karten-Chrome (weisser Grund, Radius, Rahmen, Schatten) ist ersatzlos gestrichen — auf der
// Startseite traegt dieselbe Rolle nur Bild + Haarlinie + Weissraum.
//
// Warum `bust` und nicht object-position: object-position verschiebt nur, es skaliert nicht.
// Die vier Figuren stehen aber unterschiedlich GROSS in ihren Dateien (Schulterlinie streute
// ueber 5.5 Prozentpunkte), es braucht also pro Person einen eigenen Zoom. Das leistet ein
// absolut positioniertes <img> mit eigener Breite/Position im Panel.

import { useLang } from '@/lib/i18n';
import { FOUNDERS, founderRole } from '@/public/team/content';

/* ------------------------------------------------------- Kritiker-Befund 2026-08-09, Portraits
 * "Portraits wild ungleich gross (Fabio riesig, Sebastian briefmarkengross) — wirkt wie kaputtes
 * Layout. Auf 1-2 kontrollierte Groessen angleichen, gleicher Crop/Baseline, klarer Rhythmus."
 *
 * Gemessen mit `node scripts/aaa-r11-probe.cjs 1440` auf dem Stand davor: Panelbreiten
 * 424/310/196/310, Panelhoehen 530/388/245/388. Fabios Panel war also 2.16x so gross wie
 * Sebastians.
 *
 * URSACHE, und sie liegt tiefer als die Spaltenwahl: die `bust`-Werte in team/content.ts
 * normieren Kopfhoehe und Augenlinie in PROZENT der Panelmasse. Prozente skalieren mit der
 * Panelbreite mit — eine ungleiche Spaltenbreite skaliert damit zwangslaeufig auch die
 * KOPFGROESSE mit. Genau die Kopfgroesse war aber der Befund von Runde 2, den `bust` behoben
 * hat. Jede Breitenvariation in dieser Zeile bringt ihn zurueck; sie ist keine Komposition,
 * sondern das Aufheben der Normierung. Frueheres Gegenmittel (Versaetze, gemeinsame
 * Grundlinie) hat nur die Kanten sortiert, nie die Groesse.
 *
 * Darum jetzt EINE kontrollierte Groesse: vier gleich breite 4:5-Panels an einer gemeinsamen
 * Ober- UND Unterkante (lg:grid-cols-4, 317x396px auf der 1400er Shell). Alle vier Koepfe
 * erscheinen dadurch gleich gross, die Augenlinie aller vier liegt auf derselben Hoehe
 * (37.5% des Panels, siehe team/content.ts), und alle vier Bildunterschriften sitzen auf
 * derselben Zeile. Der Rhythmus kommt aus der gleichmaessigen Spalte plus der roten Ziffer,
 * nicht aus zufaelligen Groessen.
 * Unter lg bleibt das bestehende 2-Spalten-Raster unveraendert (Mobile-Politur ist eigene Phase).
 */
export function FounderCards({ className = '' }: { className?: string }) {
  const { lang } = useLang();
  return (
    <ul className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 ${className}`}>
      {FOUNDERS.map((founder, index) => {
        const role = founderRole(founder.fem, lang);
        const number = String(index + 1).padStart(2, '0');
        return (
          <li key={founder.key} className="min-w-0">
            <figure className="group flex h-full flex-col">
              {/* Quadrat auf Mobil (Kritik-Vorgabe), 4:5-Panel ab sm. Der Freisteller sitzt
                  in seinem normierten Fenster; `bust` bringt Scheitel und Schulter aller
                  vier auf dieselbe Hoehe. */}
              <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-soft)] sm:aspect-[4/5]">
                <img
                  src={founder.photo}
                  alt={`${founder.name} ${founder.last}, ${role} ${lang === 'de' ? 'von' : 'at'} Salsaflow`}
                  className="absolute max-w-none transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
                  style={{ width: founder.bust.w, left: founder.bust.l, top: founder.bust.t }}
                  loading="lazy"
                  width={1000}
                  height={1414}
                />
              </div>
              <figcaption className="mt-4 min-w-0 border-t border-[var(--color-line)] pt-3">
                <span aria-hidden className="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-[var(--color-salsa)]">
                  {number}
                </span>
                <span className="block font-display text-2xl font-extrabold leading-[0.98] tracking-[-0.01em] text-[var(--color-ink)] sm:text-[2rem]">
                  {founder.name}
                </span>
                <span className="mt-1 block text-sm font-medium text-[var(--color-ink-muted)]">
                  {founder.last}
                </span>
                <span className="mt-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                  {role}
                </span>
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
