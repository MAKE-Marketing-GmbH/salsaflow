# STATUS R151 – /mehr/partys

## Ist

15rem-Band, Crop 18 %. Hintere Koepfe weg. Blob 36rem oben rechts angeschnitten. Motion = Default-Reveal.

## Soll

Sichtbare Koepfe ganz. Blob voller Kreis. Motion weicher. Shots S7-ux151.

## Bau

- [PartysPage.tsx](/root/clients/salsaflow-w1/src/public/PartysPage.tsx): Crop `center 10%`, Band `lg:h-[20rem]`. Motiv bleibt party-31-v3.webp.
- useReveal `{ duration: 0.7, distance: 8 }`. Reveal-Prop `stagger={0.1}` an vier Bloecken (Opus-Fund).
- [index.css](/root/clients/salsaflow-w1/src/index.css): `partys-blob` 12rem-Kreis. Desktop: Microcopy aus, Shell-pb 0, Band 20rem bei 10 %. kit.tsx unberuehrt.

oxlint 0. GATES 14/14. verify-ux VERDICT PASS.

Locks: Tanzschuhe 84 %, Footer-Link, Collabs 24 %, Team 39 %, Crop 12, party-47, `left: 1.25rem` = 0, FAQ `ml-auto` = 0.

Partys-Edits: `src/public/PartysPage.tsx`, `src/index.css`. Nicht EventsPage, TeamPage, gallery, FaqPage, CollabsPage, TanzschuhePage, SiteFooter.

## Shots

- [partys-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux151/partys-mobil-390.png)
- [partys-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux151/partys-desktop-1440.png)
- [partys-hero-scroll-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux151/partys-hero-scroll-1440.png)
- [partys-danceflow-scroll-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux151/partys-danceflow-scroll-1440.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux151/vorher/). cmp Exit 1.

## Kritik

Welle `wf_4142662e-b33` las aeltere Shots (vor 10 % / 20rem).

- Sol: BLOCKED. Lane `codex-lane.sh` verboten.
- Luna (alte Shots): koepfeGanz NEIN, kreisRund NEIN. shotsDa JA, waRechts JA.
- Opus: WICHTIG tot-Stagger. Fix: `stagger={0.1}` an Reveal. NICE: Blob-Selektor fragil.
- Look: BLOCKED. Gateway `grok-4.6-build`.

### Parent (PNGs nach 10 % / 20rem, gelesen)

- kreisRund: JA. Weicher voller Kreis oben rechts.
- koepfeGanz: JA. Frau vorn inkl. Kinn, Mann dahinter inkl. Scheitel.
- motionDa: Code JA nach Stagger-Fix. PNG zeigt Endzustand, nicht den Takt.
- shotsDa: JA.
- waRechts: JA. Gruener Kreis.

## rg-Belege

```text
$ rg -n "center 84%" src/public/TanzschuhePage.tsx
61:          position: 'center 84%',

$ rg -n "tanzschuhe" src/public/site/SiteFooter.tsx
79:    { label: nav.tanzschuhe, href: '/mehr/tanzschuhe' },

$ rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
0

$ rg -n "center 24%" src/public/CollabsPage.tsx
53:          position: 'center 24%',

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0
```

## Offene Punkte

- Sol/Look: BLOCKED.
