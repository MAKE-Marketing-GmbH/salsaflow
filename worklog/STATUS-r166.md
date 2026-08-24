# STATUS R166 – FAQ-Link nach R163-BLOCKED

## Ist

R163-Ultracode endete BLOCKED. Accordion stand wieder auf `open={defaultOpen || undefined}`. Die Tanzschuhe-Antwort hatte keinen Link. `kit.tsx` bleibt tabu.

## Soll

Klick lässt die Antwort offen. In der Schuhe-Antwort steht der Link `/mehr/tanzschuhe`.

## Bau

- [FaqAccordion.tsx](/root/clients/salsaflow-w1/src/public/faq/FaqAccordion.tsx): `open={open}` plus `preventDefault` auf Summary. Optionales `link`.
- [content.ts](/root/clients/salsaflow-w1/src/public/faq/content.ts): DE «Zur Seite Tanzschuhe», EN «To the dance shoes page».
- [FaqPage.tsx](/root/clients/salsaflow-w1/src/public/FaqPage.tsx): reicht `link` durch. Erstes Item defaultOpen.

oxlint Exit 0. forbidden-check content.ts 0 harte Verstösse.

Live: open=2 nach Klick. Link sichtbar, href `/mehr/tanzschuhe`.

Nicht angefasst: kit.tsx, Cookie, WA, Home, Header-Dropdowns, Collabs, Partys, TanzschuhePage, Booking, StylePage.

Locks: Salsa 14 %, Bachata 20 %, Heels 12 %, Team 39 %, Cookie `pr-[5.5rem]`.

## Shots

- [faq-schuhe-link-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux166/faq-schuhe-link-1440.png)
- [faq-schuhe-link-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux166/faq-schuhe-link-390.png)

## Kritik

### Parent (PNG gelesen)

- faqOffen: JA. Antwort sichtbar. Chevron oben.
- schuheLink: JA. «Zur Seite Tanzschuhe» unterstrichen.

## Offene Punkte

- Look-Kritik nicht abgewartet.
- Kein Production-Push.
