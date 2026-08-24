# STATUS R160 – /privatstunden

## Ist

Hero war `offer-privat-square-1200.webp` (mean 113, dunkel). Video 08:59.

## Soll

Helles Studio-Foto. Köpfe ganz. Kein CSS-Filter.

## Bau

- [content.ts](/root/clients/salsaflow-w1/src/public/privat/content.ts): Hero DE+EN `/photos/2026/hero-paar-studiowand-01.webp`.
- Flow bleibt `gallery/kurse/06.jpg`.
- `photo-grade-private` bleibt weg.

oxlint PrivatstundenPage + content Exit 0.

Nicht angefasst: Home, CoursesPage, Cookie, WA, Team, Photos, Events, Collabs, Partys, Tanzschuhe, Bachata.

Locks: Team 39 %, Collabs 24 %, Bachata 20 %, Cookie `pr-[5.5rem]`.

## Shots

- [privat-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux160/privat-desktop-1440.png)
- [privat-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux160/privat-mobil-390.png)
- [privat-y1400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux160/privat-y1400.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux160/vorher/).

## Kritik

### Parent (PNGs gelesen)

- heroHell: JA. Studiowand, Lampenlicht, keine dunkle Quadrat-Karte.
- koepfeGanz: JA. Frau ganz. Mann von hinten ganz.
- overlay: Karte sitzt auf der Hüfte, nicht auf Köpfen.
- waRechtsKreis: JA.

## Offene Punkte

- Home-Karte `offerPhotos.privat` bleibt `wide-original-v2` (nicht diese Route).
- Nächste: `/tanzkurse/bachata`.
- Kein Production-Push.
