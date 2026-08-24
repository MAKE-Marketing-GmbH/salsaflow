# STATUS R159 – /team

## Ist

Hero-Fold war nach R156 schon mit ganzen Köpfen. Fabio-WebP war 100 kB. Sebastian-Zoom 152 %.

## Soll

Video 06:57–07:18: Köpfe ganz. Schärfere Porträts. Kein Porträt-Crop im Hero.

## Bau

- [TeamPage.tsx](/root/clients/salsaflow-w1/src/public/TeamPage.tsx): Lock `center 39%`. Band `lg:aspect-[21/9]`. Kursfoto `classfreude` 16/9 `center 30%`.
- [content.ts](/root/clients/salsaflow-w1/src/public/team/content.ts): Sebastian `sebastian-ok.webp`, bust `w: 122%` statt 152.2 %.
- Fabio-WebP 167594 Byte. Vanessa 237436 Byte. Lehrer-WebP unverändert.

oxlint TeamPage + content Exit 0. cmp Desktop gegen Vorher Exit 0 (Fold gleich R156).

Nicht angefasst: CookieBanner, WhatsAppFloat, Preise, Collabs, Partys, Tanzschuhe, Home, kit.tsx, PhotosPage, EventsPage.

Locks: Collabs 24 %, Partys `center_10%`, Tanzschuhe 84 %, Cookie `pr-[5.5rem]`, Team 39 %.

## Shots

- [team-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux159/team-desktop-1440.png)
- [team-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux159/team-mobil-390.png)
- [team-y1400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux159/team-y1400.png)
- [team-y2800.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux159/team-y2800.png)
- [team-founders.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux159-founders/team-founders.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux159/vorher/).

## Kritik

### Parent (PNGs gelesen)

- koepfeFold: JA. Stehende Köpfe plus Luft. Mobil ganze Gruppe inkl. Boden.
- keinPortraetHero: JA. Landscape, kein Einzelgesicht.
- waRechtsKreis: JA.
- gruenderZoom: JA. Sebastian Brust sichtbar, Scheitel ganz.
- foundersShotCookie: Cookie-Leiste im Founders-Shot. Seite mit `salsaflow-cookie-ok` ohne Leiste.

## Offene Punkte

- `sebastian-ok.webp` bleibt 147228 Byte.
- Ultracode-Look-Kritik läuft noch (`wf_6ae4f723-e30`).
- Kein Production-Push.
