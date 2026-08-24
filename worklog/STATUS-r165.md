# STATUS R165 – Split-Hero-Foto sofort

## Ist

Salsa und Bachata hatten das Foto im DOM, aber der Stagger hielt es 1–2 Sekunden unsichtbar. Video-Pass 700 ms zeigte leere Rechte. Heels-Termine sassen nach R162.

## Soll

Foto links/rechts im Fold ohne Wartezeit. Video-Pass zählt Heels-Slots. 17.08-Rest bleibt zu.

## Bau

- [StylePage.tsx](/root/clients/salsaflow-w1/src/public/courses/styles/StylePage.tsx): Foto-Spalte ist ein `div`, kein `motion` item.
- [`.video-pass.mjs`](/root/clients/salsaflow-w1/worklog/.video-pass.mjs): wartet auf sichtbares `main img`. Check `v10-heels-slots`.

oxlint StylePage Exit 0.

Live 700 ms: Salsa kurs-03.jpg, Bachata offer-bachata-1200.webp. Parent-Opazität 1.

Video-Pass fail=0, 19 Checks, Heels-Slots=2.

Nicht angefasst: Cookie, WA-Komponente, kit.tsx, Home, Header-Dropdowns, Collabs, Partys, Tanzschuhe, Team, BookingPanel.

Locks: Salsa 14 %, Bachata 20 %, Heels 12 %, Team 39 %, Cookie `pr-[5.5rem]`.

## Shots

- [salsa-fold-700.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux165/salsa-fold-700.png)
- [bachata-fold-700.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux165/bachata-fold-700.png)
- Video-Pass [report.json](/root/clients/salsaflow-w1/worklog/shots/S7-video-pass/report.json)

## Kritik

### Parent (PNGs gelesen)

- salsaFoto700: JA. Text links, Foto rechts, Köpfe ganz, helles Studio.
- bachataFoto700: JA. Paar, Gesichter inkl. Kinn, warm, nicht schwarz.
- heelsSlots: JA. 2 Zeilen im Pass.

## Offene Punkte

- Look-Kritik nicht abgewartet.
- Kein Production-Push.
