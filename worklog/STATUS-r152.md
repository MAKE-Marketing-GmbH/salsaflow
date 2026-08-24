# STATUS R152 – /mehr/collabs Scroll

## Ist

Partner `loading="lazy"` plus kurs-03. Trust/Request `py-16 lg:py-24`. Header Hide-on-Scroll. Fold 24 % / hp-27 bleibt.

## Soll

Video 09:19 Header bleibt. 09:23 Partner-Foto da. 09:28 kein grosses Cream-Leerband. Fold 24 % / hp-27 unberuehrt.

## Bau

- [CollabsPage.tsx](/root/clients/salsaflow-w1/src/public/CollabsPage.tsx): Partner-img ohne lazy. `object-[center_80%]`. Trust/Request `py-8 lg:py-12`. Fold `center 24%`, Band 28rem.
- [collabs-content.ts](/root/clients/salsaflow-w1/src/public/more/collabs-content.ts): Partner `/photos/premium/offer-heels-1200.webp`. Hero bleibt hp-27.
- [index.css](/root/clients/salsaflow-w1/src/index.css): `body:has([data-collabs-page]) header.fixed { transform: none !important; }`

oxlint 0. verify-ux VERDICT PASS. GATES 13 met, G6 ABANDON (Mobil-Fold identisch, Fold gelockt).

Locks: Fold 24 %, hp-27, Partys `center_10%`, Tanzschuhe 84 %, Footer-Link, Crop 12, party-47, `left: 1.25rem` = 0, FAQ `ml-auto` = 0.

Nicht angefasst: PartysPage, TanzschuhePage, SiteFooter, kit.tsx, SiteHeader.tsx, EventsPage, TeamPage, gallery, FaqPage.

## Shots

- [collabs-y0.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux152/collabs-y0.png)
- [collabs-y800.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux152/collabs-y800.png)
- [collabs-y1600.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux152/collabs-y1600.png)
- [collabs-y2400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux152/collabs-y2400.png)
- [collabs-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux152/collabs-mobil-390.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux152/vorher/). Mobil-Fold cmp Exit 0 (erwartet).

## Kritik

Welle `wf_fcd99645-71c`.

- Sol: BLOCKED. Lane `codex-lane.sh` verboten. Ein Fund BLOCKED, sonst leer.
- Luna: bildDa JA, keinLeerband JA, headerDa JA, waRechts JA. shotsDa NEIN (URL nicht im PNG). Parent: shotsDa JA.
- Opus: pass false. KRITISCH `object-[center_80%]` koepft. WICHTIG Hochformat in 4/3 plus Padding. NICE Header-!important.
- Look: BLOCKED. Gateway `grok-4.6-build` statt kimi.

### Parent (PNGs 14:18, gelesen)

- bildDa: JA. y1600 Heels-Schuhe im 4/3.
- keinLeerband: JA. y2400 Fakten plus Request-Karte.
- headerDa: JA. y800 und y2400 Nav sichtbar.
- shotsDa: JA. Route /mehr/collabs.
- waRechts: JA. Gruener Kreis.

Opus-KRITISCH bleibt als Look-Schuld. Vertrag war Schuh-Foto im Fenster. `offer-heels-wide-1400.webp` zeigt Köpfe ohne Schuhe.

## rg-Belege

```text
$ rg -n "center 24%" src/public/CollabsPage.tsx
53:          position: 'center 24%',

$ rg -n "hp-27.webp" src/public/more/collabs-content.ts
93:      image: { src: '/photos/showcase/hp-27.webp', ...
184:      image: { src: '/photos/showcase/hp-27.webp', ...

$ rg -n "loading=\"lazy\"" src/public/CollabsPage.tsx || echo 0
0

$ rg -n "kurs-03.jpg" src/public/more/collabs-content.ts || echo 0
0

$ rg -n "center_10%" src/public/PartysPage.tsx
56:          positionClass: 'object-[center_10%]',

$ rg -n "center 84%" src/public/TanzschuhePage.tsx
61:          position: 'center 84%',

$ rg -n "tanzschuhe" src/public/site/SiteFooter.tsx
79:    { label: nav.tanzschuhe, href: '/mehr/tanzschuhe' },

$ rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
0

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0
```

## Offene Punkte

- Sol BLOCKED. Look BLOCKED.
- Opus will Wide-Motiv mit Koepfen. Vertrag haelt die Schuhe.
