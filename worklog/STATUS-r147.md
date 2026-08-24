# STATUS R147 – /faq

## Ist

Zwei Spalten à 12, Chevron bei x692, Desktop-WA Pille 121×56, Mobil-FAB auf Accordion-Zeilen.

## Soll

Chevron weiter rechts. Liste mit Luft. Suchstarke Fragen ohne erfundene Fakten. Desktop-WA Kreis. FAB frei.

## Bau

`FaqPage.tsx`, `faq/FaqAccordion.tsx`, `faq/content.ts`, `index.css` nur `[data-faq-page]`.

- Eine Spalte, `max-w-5xl` (Chevron Desktop x1076, vorher x692)
- Drei Gruppen, mehr py, `defaultOpen` aus
- Theme-Chips, Label «Weiter zu den Seiten»
- Zwei neue Fragen: Heels-Kurs, Zug zum Studio (Basel SBB)
- Drei SEO-Doppel raus nach Opus
- Mobil `padding-right: 5rem` auf `#faq` summary. Chevron x268–290, FAB ab x314
- Desktop-WA Kreis 56×56

oxlint 0. forbidden-check 0 harte Verstösse.

Locks: party-47, Team 39 %, Crops 12/14/20, `left: 1.25rem` = 0, gallery ohne fabio.

## Shots

- [faq-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux147/faq-desktop-1440.png) Cookie weg, WA Kreis, Chips
- [faq-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux147/faq-mobil-390.png) Fold = Hero, Hash gleich Vorher, weil Hero unverändert
- [faq-accordion-scroll-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux147/faq-accordion-scroll-1440.png)
- [faq-accordion-scroll-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux147/faq-accordion-scroll-390.png)

## Kritik

- Luna: chevronRechts JA, wenigerDicht JA, echteFragen JA, shotsDa JA, waRechts JA
- Sol: BLOCKED (Rollen-Konflikt, kein `codex-lane.sh`). Hülle mass selbst. Nicht als Sol-Urteil zählen.
- Opus: `pass=false`. Mobil-Fold-Hash identisch (Hero unberührt, wahr). Dichte: 29 Fragen zu viel → drei Doppel raus, jetzt 26. Chip-Label und Heels-Klick-Satz gefixt.
- Look: BLOCKED (8318 Server error, ein Call, kein Retry)

Alter «ab 12» und Aushilfe-Chats standen vor R147 in content.ts. Nicht neu erfunden, nicht gestrichen.

## rg-Belege

```text
$ rg -n "data-faq-page" src/public/FaqPage.tsx
42:      <div className="faq-page" data-faq-page=""

$ rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
0

$ rg -n "party-47" src/public/EventsPage.tsx
161:        src: '/photos/party/party-47.webp',

$ rg -n "center 39%" src/public/TeamPage.tsx
247:        position: 'center 39%',

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0

$ node scripts/verify-ux-whatsapp.mjs | tail -1
VERDICT PASS
```

## Offene Punkte

- Sol-Stimme fehlt ohne Codex-Lane.
- Look BLOCKED.
- Mobil-Fold-Shot bleibt Hero, Beleg für Accordion ist der Scroll-Shot.
