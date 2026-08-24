# STATUS R149 – /mehr/collabs Koepfe

## Ist

Desktop-Band `hp-27` mit `center 40%` und 15rem. Scheitel weg. WA Pille. Mobil: Gruppe ganz, FAB auf der Couch.

## Soll

Gesichter plus Scheitel im Fold. Desktop-WA Kreis. Motiv `hp-27.webp`. Shots S7-ux149.

## Bau

- [CollabsPage.tsx](/root/clients/salsaflow-w1/src/public/CollabsPage.tsx): Marker `data-collabs-page`, Crop `center 24%`, Band `h-[16rem] sm:h-[20rem] lg:h-[28rem]`
- [index.css](/root/clients/salsaflow-w1/src/index.css): Desktop-WA Kreis ab sm, analog FAQ
- Motiv `hp-27.webp` bleibt. oxlint 0. Kein Mobil-pr: FAB trifft kein Wort.

Locks: party-47, Team 39 %, Crop 12, `left: 1.25rem` = 0, FAQ `ml-auto` = 0, gallery ohne fabio.

`git diff --name-only` der Collabs-Edits: `src/public/CollabsPage.tsx`, `src/index.css`. Nicht EventsPage, TeamPage, gallery, FaqPage.

## Shots

- [collabs-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux149/collabs-mobil-390.png)
- [collabs-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux149/collabs-desktop-1440.png)
- [collabs-hero-scroll-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux149/collabs-hero-scroll-1440.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux149/vorher/). cmp Mobil Exit 1.

## Kritik

Welle [r149-kritik](/root/clients/salsaflow-w1/worklog/r149-kritik-workflow.js) `wf_1d8a4b36-8fe`.

### Parent (PNGs gelesen)

- koepfeGanz: JA. Vier Scheitel im Desktop-Fold, inklusive der groessten Person.
- shotsDa: JA.
- waRechts: JA. Desktop-Kreis unten rechts, keine Pille.

### Luna Ja/Nein

- koepfeGanz: JA
- shotsDa: JA
- waRechts: JA

### Sol

pass=false. Ein Fund KRITISCH `BLOCKED`. Lane-Verbot, kein Ersatz-Urteil.

### Opus

pass=true. NICE: totes `className` (entfernt), kein 768-Shot.

### Look (kimi)

status=BLOCKED. Call `kimi-k3` kam als `grok-4.6-build` zurueck. Kein Kimi-Urteil. Kein zweiter Versuch.

Look-Freigabe: nicht erteilt. Die Koepfe sind trotzdem ganz.

## rg-Belege

```text
$ rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
0

$ rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
0

$ rg -n "party-47" src/public/EventsPage.tsx
161:        src: '/photos/party/party-47.webp',

$ rg -n "center 39%" src/public/TeamPage.tsx
247:        position: 'center 39%',

$ rg -n "center 12%" src/public/courses/styles/heels-content.ts
127:        position: 'center 12%',
238:        position: 'center 12%',

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0
```

## Offene Punkte

- Sol-Lane tot unter dem Lane-Verbot.
- Kimi-Look BLOCKED durch Gateway-Failover.
- `verify-ux-whatsapp` G14: Chromium bekommt SIGKILL (earlyoom). Ein kompletter Lauf: alle Checks PASS ausser salsa-dsk-wa null (Flake). Collabs-WA Kreis ist in den Shots belegt.
