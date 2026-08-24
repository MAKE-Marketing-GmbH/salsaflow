# STATUS R142 / R143-Nachzug

Route: `/events`. Worktree: `/root/clients/salsaflow-w1`. Branch `geil-welle`. Preview `e175146`. Kein Push.

## Ist / Soll

**Ist vorher:** Hero `party-52.webp`. Band schnitt Körper und Köpfe. Danceflow `02-v3` schnitt hintere Köpfe. Luna R142: `koepfeGanz=NEIN`. STATUS fehlte.

**Soll jetzt:** Hero nicht `party-52`. Köpfe im Fold und in der Danceflow-Komposition ganz. Drei Fakten. WA-Kreis. CTA im 1440-Fold.

## Bau

- Hero: `/photos/party/party-47.webp` plus `dense` (Band sitzt mobil bei y699, 145px im Fold).
- Danceflow oben: `/photos/party/party-35-v3.webp`.
- `party-23-v3` bleibt.
- Nur [`EventsPage.tsx`](/root/clients/salsaflow-w1/src/public/EventsPage.tsx).

## Shots

- [`events-desktop-1440.png`](/root/clients/salsaflow-w1/worklog/shots/S7-ux142/events-desktop-1440.png)
- [`events-mobil-390.png`](/root/clients/salsaflow-w1/worklog/shots/S7-ux142/events-mobil-390.png)
- [`events-danceflow-scroll-1440.png`](/root/clients/salsaflow-w1/worklog/shots/S7-ux142/events-danceflow-scroll-1440.png)

CTA Desktop: y351–405, Fold 730.

## Kritik

- **Luna** (`ab9c2048`): 7× JA. `koepfeGanz` JA. `wenigerMinis` JA. `keinFremdMotiv` JA. `waRechtsKreis` JA. `keinKi` JA. `foldCtaGanz` JA. `shotsDa` JA.
- **opus-critic**: kein KRITISCH. NICE: Manifest alt, `party-23-v3` Masse war falsch (auf 2048×1360 gesetzt). Kernpunkte erfüllt.
- **Sol:** BLOCKED. Codex-Lane seit 07:54 leer (`/tmp/codex-lane.tJqsDI.md` 0 Bytes). Nicht weiter gewartet. Kein `codex-lane.sh`.
- **Look Kimi:** BLOCKED. Ein Call `POST http://127.0.0.1:8318/v1/chat/completions` mit `model=kimi/k3`. Antwort: `failover: alle Abos und Fallback-Modelle erschoepft`. Kein zweiter Versuch. Kein Eigenurteil.

Parent-Read 07:51: lila Formation, Köpfe ganz, CTA im Fold, WA Kreis.

## rg-Belege

```text
$ rg -n "party-52" src/public/EventsPage.tsx; echo EXIT:$?
EXIT:1

$ rg -n "center 12%" src/public/courses/styles/heels-content.ts
127:        position: 'center 12%',
238:        position: 'center 12%',

$ rg -n "center 14%" src/public/courses/styles/content.ts
153:        position: 'center 14%',

$ rg -n "center 20%" src/public/courses/styles/content.ts
428:        position: 'center 20%',

$ rg -n "party-50-v4" src/public/home/EventsTeaser.tsx src/public/events/danceflow-content.ts
src/public/home/EventsTeaser.tsx:88:                src="/photos/party/party-50-v4.webp"
src/public/events/danceflow-content.ts:118:        src: '/photos/party/party-50-v4.webp'
src/public/events/danceflow-content.ts:252:        src: '/photos/party/party-50-v4.webp'

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0

$ git diff --name-only -- src/public/EventsPage.tsx
src/public/EventsPage.tsx

$ node scripts/verify-ux-whatsapp.mjs 2>&1 | tail -3
PASS heels-dsk-wa-kreis
REPORT /root/clients/salsaflow-w1/worklog/shots/S7-ux121/verify-report.json
VERDICT PASS
```

R143 hat EventsTeaser, danceflow-content, KursaufbauPage, HeelsView, StylePage, PrivatstundenPage nicht editiert.

cwd: `/root/clients/salsaflow-w1`. Kein Edit unter `/root/clients/braun-services`.
