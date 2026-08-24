# STATUS R163 – FAQ, Tanzschuhe, Motion + Video-Test

## Ist

FAQ klappte nach dem Klick zu. Tanzschuhe lagen nur unter Mehr. Video-Rest 07:33, 07:57, 08:19, 08:29.

## Soll

Fragen bleiben offen. Schuhe im Fold. Link aus der FAQ. Collabs-Köpfe ganz. Partys-Crop 10 %. Video-Punkte live prüfen.

## Bau

- [FaqAccordion.tsx](/root/clients/salsaflow-w1/src/public/faq/FaqAccordion.tsx): `open={open}`. Klick klappt nicht sofort zu.
- [content.ts](/root/clients/salsaflow-w1/src/public/faq/content.ts): Link «Zur Seite Tanzschuhe» DE+EN.
- Crop-Locks: Tanzschuhe 84 %, Collabs 24 %, Partys `center_10%`.

oxlint Accordion + Collabs + Partys Exit 0.

Live-Test [`.video-pass.mjs`](/root/clients/salsaflow-w1/worklog/.video-pass.mjs): 18/18 PASS. Report [report.json](/root/clients/salsaflow-w1/worklog/shots/S7-video-pass/report.json).

Nicht angefasst: Cookie, WA, Home, Header-Dropdowns, Booking, StylePage, Team, Photos, Events, kit.tsx.

Locks: Team 39 %, Cookie `pr-[5.5rem]`, Salsa 14, Bachata 20, Heels 12.

## Shots

- [faq-open-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux163/faq-open-1440.png)
- [tanzschuhe-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux163-schuhe/tanzschuhe-desktop-1440.png)
- [collabs-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux163-motion/collabs-desktop-1440.png)
- [partys-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux163-motion/partys-desktop-1440.png)
- Video-Pass: [S7-video-pass](/root/clients/salsaflow-w1/worklog/shots/S7-video-pass/)

## Kritik

### Parent (PNGs gelesen)

- faqOffen: JA. Antwort sichtbar. Chevron rechts.
- schuheGanz: JA. Absatz bis Spitze, schwarz und rot.
- collabsKoepfe: JA. Vier Köpfe inkl. Scheitel.
- eventsKoepfe: JA. Vier Tänzerinnen inkl. Stirn. Saum am Bandrand.
- waRechtsKreis: JA.

## Offene Punkte

- Look-Kritik R163 nicht abgewartet.
- Kein Production-Push.
