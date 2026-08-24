# STATUS R155 – /events

## Ist

Fold party-47 schnitt die Körper an der Hüfte. Galerie kappte Stirnen. Workshop hatte vier Mini-Karten.

## Soll

Video 05:26 Leute nicht abschneiden. 05:32 Animation. 05:37 Reveal. 05:40 weniger Mini-Blöcke. 05:51 Frau ganz.

## Bau

- [EventsPage.tsx](/root/clients/salsaflow-w1/src/public/EventsPage.tsx): Fold `lg:h-[28rem]`. Galerie-Crops `38%_30%` / `50%_20%` / `50%_30%` / `50%_22%`. Workshop-Bild `40%_50%`. Reveal 22px / 0.10s. Mini-Karten als Liste.
- [content.ts](/root/clients/salsaflow-w1/src/public/events/content.ts): `workshops.points` von 4 auf 2. Fakten und CHF unverändert.

oxlint EventsPage 0. cmp Desktop Exit 1.

Nicht angefasst: CookieBanner, WhatsAppFloat, Preise, Collabs, Partys, Tanzschuhe, Home, kit.tsx.

Locks: Collabs 24 %, kein lazy, Partys `center_10%`, Tanzschuhe 84 %, Cookie `pr-[5.5rem]`, kein `sm:pr-[10.5rem]`.

## Shots

- [events-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux155/events-desktop-1440.png)
- [events-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux155/events-mobil-390.png)
- [events-y1400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux155/events-y1400.png)
- [events-y2000.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux155/events-y2000.png)
- [events-y2800.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux155/events-y2800.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux155/vorher/).

## Kritik

Ultracode-Copy: ein Critic pass, einer fail (Satz packt drei Themen). EventsPage-Bau per opus-builder nach API-Abbruch.

### Parent (PNGs gelesen)

- koepfeGanz Fold: Desktop Köpfe JA. Körper im 900-Fold weiter an der Hüfte. Band wächst nach unten.
- galerieGanz: JA. y2000 vier Karten, Stirnen frei.
- miniBloecke: JA. Workshop 01 und 02 als Liste, Frau ganz.
- shotsDa: JA. Route /events.
- waRechts: JA.

## Offene Punkte

- Mobil-Fold bleibt 10rem-Streifen.
- Sol/Look oft BLOCKED.
- Nächste Fläche: /team.
- Kein Production-Push.
