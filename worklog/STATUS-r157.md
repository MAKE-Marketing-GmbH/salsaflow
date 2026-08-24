# STATUS R157 – /fotos

## Ist

Hero links war ein enges Party-Gesicht. Album Team hatte Studio-Posen auf Grau (hp-06, hp-17, hp-22, hp-27).

## Soll

Kontext, keine Porträts. Keine Gründer-Freisteller.

## Bau

- [PhotosPage.tsx](/root/clients/salsaflow-w1/src/public/PhotosPage.tsx): Hero `/photos/2026/community-crowd-01.webp`, `object-right`.
- [content.ts](/root/clients/salsaflow-w1/src/public/gallery/content.ts): Team-Tiles hp-06/17/22/27 raus. Ersatz classfreude, hp-11, heels-energie, community-diversitaet. hp-03 und hp-08 bleiben.

oxlint PhotosPage + gallery Exit 0. cmp Desktop Exit 1.

Nicht angefasst: TeamPage, Cookie, WhatsApp, Events, Preise, Collabs, Partys, Tanzschuhe, Home, kit.tsx.

Locks: Collabs 24 %, Partys `center_10%`, Tanzschuhe 84 %, Cookie `pr-[5.5rem]`, Team 39 %.

## Shots

- [fotos-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux157/fotos-desktop-1440.png)
- [fotos-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux157/fotos-mobil-390.png)
- [fotos-y1400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux157/fotos-y1400.png)
- [fotos-y2800.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux157/fotos-y2800.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux157/vorher/).

## Kritik

### Parent (PNGs gelesen)

- heroKontext: JA. Crowd statt Einzelgesicht. Mobil gleich.
- keineFreisteller: JA. Keine founders/teacher-Pfade.
- teamPosen: JA in der Datei.
- galeriePortraet: Runde 2. `anniversary-recap-v2` raus, `danceflow/11-v3.webp` rein. y1400 oben links ist Saal/Night, kein Spitzentop.
- shotsDa: JA. Route /fotos.
- waRechts: JA.

## Offene Punkte

- Filter-Label «Team» trifft den Inhalt jetzt weniger. Text nicht geändert.
- /privatstunden und /tanzkurse/bachata sind im Ist hell. Bachata-Hero ist schon `offer-bachata-1200.webp` plus `center 20%` (R138).
- Nächste: Video-Rest (Formular, Kursinfos).
- Kein Production-Push.
