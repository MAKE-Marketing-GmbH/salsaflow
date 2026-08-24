# STATUS R146 – /fotos ohne Einzelporträts

## Ist

Die Galerie enthält keine Studio-Einzelporträts mehr. `team-01.jpg` und `team-03.jpg` sind raus. Ersatz: `party-18.webp` und `party-22.webp` im Album danceflow. Album Team hat 7 Gruppenfotos. Parent hat jedes Team-Motiv gelesen.

## Soll

Keine Team-Porträts in `/fotos`. Event-, Kurs- und Gruppenfotos mit ehrlichem Alt. WA rechts. Desktop mit Text. Crops und Events-Hero unberührt.

## Bau

Datei: `src/public/gallery/content.ts`

Raus:

- 9 named founder/teacher-Zeilen (vorher)
- `team-01.jpg` (Frau, Weiß-Freisteller, Einzelporträt)
- `team-03.jpg` (blonde Frau, Weiß-Freisteller, Einzelporträt)

Rein (danceflow):

- `/photos/party/party-18.webp` Paar, Drehung, Partylicht, 1500×1000
- `/photos/party/party-22.webp` Paar auf voller Fläche, 1500×1000

Album Team (Parent-Read, alle Gruppe):

- `community-comeback-v2.webp` viele Personen vor der Wand
- `hp-03.webp` ganzes Team
- `hp-06.webp` vier Personen (Alt war «Fünf», jetzt «Vier»)
- `hp-08.webp` Crew vor der Wand
- `hp-17.webp` vier Personen
- `hp-22.webp` zwei Tänzerinnen (Alt ohne «Studioportrait»)
- `hp-27.webp` vier auf der Couch

Locks halten: party-47, Team-Crop 39 %, Heels 12 / Salsa 14 / Bachata 20, kein `left: 1.25rem`. oxlint Exit 0.

## Shots

- `/root/clients/salsaflow-w1/worklog/shots/S7-ux146/fotos-desktop-1440.png` (mtime 09:33)
- `/root/clients/salsaflow-w1/worklog/shots/S7-ux146/fotos-mobil-390.png` (mtime 09:33)
- `/root/clients/salsaflow-w1/worklog/shots/S7-ux146/fotos-galerie-scroll-1440.png` (Team-Filter, 7 Fotos)
- `/root/clients/salsaflow-w1/worklog/shots/S7-ux146/fotos-team-filter-1440.png` (gleiche Ansicht)

Desktop-Fold: Event/Kurs-Collage, WA-Pille mit Text rechts. Mobil: Kreis ohne Text, CTA frei. Team-Filter: 7 Gruppen, kein Freisteller-Porträt.

Shot-Skript in der Luna-Sandbox: Chromium EPERM. Parent hat selbst geschossen. Vite 5175 = 200.

## Kritik (Welle vor dem team-01-Fix)

- Luna: `keinePortraets=NEIN` weil Personen sichtbar. Zu grob. Vertrag ist Studio-Einzelporträt.
- Sol: `pass=false`, funde leer. Codex-Lane tot, kein `codex-lane.sh`. BLOCKED.
- Opus: KRITISCH team-01/team-03. Stimmt. Jetzt entfernt. Parent-Read bestätigt Weiß-Freisteller.
- Look: BLOCKED, Kimi HTTP 429, ein Call.

Keine neue volle Welle nach dem Fix. Parent prüft Liste + PNGs.

## rg-Belege

```text
$ rg -n "founders/fabio.webp|teacher-aleksandra.webp|team-01|team-03" src/public/gallery/content.ts || echo 0
0

$ rg -n "party-18.webp|party-22.webp" src/public/gallery/content.ts
190:  { albumId: 'danceflow', src: '/photos/party/party-18.webp'
196:  { albumId: 'danceflow', src: '/photos/party/party-22.webp'

$ rg -n "albumId: 'team'" src/public/gallery/content.ts
133 community-comeback-v2, 202 hp-03, 208 hp-06, 214 hp-08, 220 hp-17, 226 hp-22, 231 hp-27

$ rg -n "party-47" src/public/EventsPage.tsx
161:        src: '/photos/party/party-47.webp',

$ rg -n "center 39%" src/public/TeamPage.tsx
247:        position: 'center 39%',

$ rg -n "center 12%" src/public/courses/styles/heels-content.ts
127 und 238: center 12%

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0

$ node scripts/verify-ux-whatsapp.mjs | tail -1
VERDICT PASS
```

## Offene Punkte

- Look bleibt BLOCKED bis Kimi 429 endet. Kein Zweitversuch in dieser Runde.
- Sol bleibt BLOCKED ohne Codex-Lane.
