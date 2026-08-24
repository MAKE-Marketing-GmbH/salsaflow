# STATUS R144 / R145 – /team

## Ist

`/team` ist gebaut. Marker `data-team-page` sitzt. Desktop-WA ist Kreis. Hero bleibt `center 39%`. Mobil-H2 «geprägt haben.» steht frei neben dem FAB. Porträts auf der Team-Seite kommen aus den Cutouts 1414×2000, nicht aus einer Hochskalierung der alten 1000×1414-WebPs.

## Soll

Köpfe ganz im Fold. Porträts scharf. WA Desktop Kreis. Mobil kein Text unter dem FAB. Kein Push.

## Bau

- Marker: `src/public/TeamPage.tsx:61`
- Hero: `hp-03.webp`, `position: 'center 39%'`, `lg:h-[21rem]`, `dense`
- Mobil-Textlift: `src/index.css` `[data-team-page] ~ main :is(h2, p, li, dd) { padding-right: 4rem; }` plus `pr-16` am Gründer-H2
- Public-WebP: Cutout-PNG 1414×2000 → cwebp q90. Fabio public 100282 Bytes, Cutout PNG 1130780 Bytes, beide 1414×2000. RMSE gegen Cutout ~0.3–0.6 %. Kein Rollback auf 1000×1414.

## Shots

- `/root/clients/salsaflow-w1/worklog/shots/S7-ux144/team-desktop-1440.png`
- `/root/clients/salsaflow-w1/worklog/shots/S7-ux144/team-mobil-390.png`
- `/root/clients/salsaflow-w1/worklog/shots/S7-ux144/team-founders-1440.png`
- `/root/clients/salsaflow-w1/worklog/shots/S7-ux144/team-gesichter-1440.png`

Parent hat die PNGs gelesen. Mobil: H2 frei, FAB rechts. Desktop: Köpfe im Band, WA 56×56 Kreis.

## Kritik

- Luna: JA (Köpfe, WA-Kreis, Fold-CTA, Shots da).
- Sol: BLOCKED. `sol-critic` braucht die Codex-Lane. Task verbietet `codex-lane.sh`. Kein Urteil, keine Hülle.
- Opus: `pass=false` wegen «Hochskalierung». Falsch. Quelle ist Cutout 1414×2000. Nicht rollbacken.
- Look: BLOCKED, Kimi HTTP 429, ein Call, kein Retry.

## rg-Belege

```text
$ rg -n data-team-page src/public/TeamPage.tsx
61:      <div data-team-page="" />

$ rg -n "party-47" src/public/EventsPage.tsx
161:        src: '/photos/party/party-47.webp',

$ rg -n "center 39%" src/public/TeamPage.tsx
247:        position: 'center 39%',

$ rg -n "center 12%" src/public/courses/styles/heels-content.ts
127:        position: 'center 12%',
238:        position: 'center 12%',

$ rg -n "center 14%" src/public/courses/styles/content.ts
153:        position: 'center 14%',

$ rg -n "center 20%" src/public/courses/styles/content.ts
428:        position: 'center 20%',

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0

$ node scripts/verify-ux-whatsapp.mjs | tail -1
VERDICT PASS
```

## Offene Punkte

Keine für `/team`. Galerie-Porträts liegen in R146.
