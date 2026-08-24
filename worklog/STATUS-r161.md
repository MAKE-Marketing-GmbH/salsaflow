# STATUS R161 – /tanzkurse/bachata

## Ist

Band-src war `offer-bachata-wide-v2.webp` (KI). Hero trug `photo-grade-bachata-hero`. Video 09:08.

## Soll

Echtes Foto. Kein Filter auf dieser Route. Crop `center 20%`.

## Bau

- [content.ts](/root/clients/salsaflow-w1/src/public/courses/styles/content.ts): Band DE+EN `/photos/premium/offer-bachata-1200.webp`. Lock `center 20%`.
- [StylePage.tsx](/root/clients/salsaflow-w1/src/public/courses/styles/StylePage.tsx): `photo-grade-bachata-hero` und `-why` runter.

oxlint StylePage Exit 0. cmp Desktop Exit 1.

Nicht angefasst: Home, Offer.tsx, index.css, Cookie, Team, Privat, Photos, Events, Collabs, Partys, Tanzschuhe, Salsa, Heels.

Locks: Bachata 20 %, Team 39 %, Collabs 24 %, Cookie `pr-[5.5rem]`.

## Shots

- [bachata-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux161/bachata-desktop-1440.png)
- [bachata-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux161/bachata-mobil-390.png)
- [bachata-y1400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux161/bachata-y1400.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux161/vorher/).

## Kritik

### Parent (PNGs gelesen)

- koepfeGanz: JA. Frau und Mann inkl. Kinn.
- keinGradeGrau: JA. Warme Haut, kein Entsaettigen.
- waRechtsKreis: JA.
- mobilChip: WA deckt den ersten Chip leicht. Nicht in dieser Welle.

## Offene Punkte

- Home-Karte Bachata kann noch `wide-v2` tragen. Nicht diese Route.
- Kein Production-Push.
