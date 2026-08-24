export const meta = {
  name: 'r143-events-koepfe',
  description: 'R143 /events: party-52 raus, Köpfe ganz, Shots, Kritik, STATUS',
  phases: [
    { title: 'Bau', detail: 'opus-builder ersetzt Hero und Danceflow 02-v3' },
    { title: 'Shots', detail: 'Pflicht-PNGs S7-ux142 überschreiben' },
    { title: 'Kritik', detail: 'sol-critic + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi-critic ein Gateway-Call 8318' },
    { title: 'Status', detail: 'STATUS-r142.md mit Ist/Soll und rg' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const BUILD = {
  type: 'object',
  additionalProperties: false,
  properties: {
    heroSrc: { type: 'string' },
    danceflowSrc: { type: 'string' },
    files: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
    done: { type: 'boolean' },
  },
  required: ['heroSrc', 'danceflowSrc', 'files', 'notes', 'done'],
}

const SHOTS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    mobil: { type: 'string' },
    desktop: { type: 'string' },
    danceflow: { type: 'string' },
    waPass: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['mobil', 'desktop', 'danceflow', 'waPass', 'notes'],
}

const FUNDE = {
  type: 'object',
  additionalProperties: false,
  properties: {
    funde: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          wo: { type: 'string' },
          problem: { type: 'string' },
          beleg: { type: 'string' },
          fix: { type: 'string' },
          schwere: { enum: ['KRITISCH', 'WICHTIG', 'NICE'] },
        },
        required: ['wo', 'problem', 'beleg', 'fix', 'schwere'],
      },
    },
    pass: { type: 'boolean' },
  },
  required: ['funde', 'pass'],
}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    koepfeGanz: { type: 'string' },
    wenigerMinis: { type: 'string' },
    keinFremdMotiv: { type: 'string' },
    waRechtsKreis: { type: 'string' },
    keinKi: { type: 'string' },
    foldCtaGanz: { type: 'string' },
    shotsDa: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: [
    'koepfeGanz',
    'wenigerMinis',
    'keinFremdMotiv',
    'waRechtsKreis',
    'keinKi',
    'foldCtaGanz',
    'shotsDa',
    'beleg',
  ],
}

const LOOK = {
  type: 'object',
  additionalProperties: false,
  properties: {
    status: { type: 'string' },
    model: { type: 'string' },
    text: { type: 'string' },
  },
  required: ['status', 'model', 'text'],
}

const STATUS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    path: { type: 'string' },
    written: { type: 'boolean' },
  },
  required: ['path', 'written'],
}

const ROOT = '/root/clients/salsaflow-w1'
const SHOT_DIR = ROOT + '/worklog/shots/S7-ux142'
const DESK = SHOT_DIR + '/events-desktop-1440.png'
const MOB = SHOT_DIR + '/events-mobil-390.png'
const DANCE = SHOT_DIR + '/events-danceflow-scroll-1440.png'

phase('Bau')
const bau = await agent(
  `ROLLE: opus-builder. HARNESS: Claude Agent. work_type: frontend.
Skill zuerst lesen: /root/.claude/agents/opus-builder.md
Dann /root/.claude/skills/web/SKILL.md und /root/.claude/skills/design/SKILL.md
Dann /root/.claude/skills/install-anti-slop/SKILL.md
cwd: ${ROOT}
Branch: geil-welle. Nicht /root/clients/braun-services.

write_set: nur ${ROOT}/src/public/EventsPage.tsx
content.ts nur wenn zwingend. index.css NICHT anfassen (WA-Kreis existiert schon).

AUFTRAG:
1. Hero-Band in EventsPage.tsx NICHT mehr /photos/party/party-52.webp.
2. Danceflow-Grossfoto NICHT mehr /photos/gallery/danceflow/02-v3.webp, ODER Crop so, dass hintere Koepfe und rechter Rand ganz sind. Ersatz ist sicherer.
3. party-23-v3 bleibt, wenn Koepfe ganz bleiben.
4. Drei Fakten-Bloecke halten. Nicht auf sechs Chips zurueck.
5. CTA «Nächste Events ansehen» bleibt im 1440-Fold. lg:h-[21rem] nur aendern mit neuem Fold-Beweis.
6. Kein KI-Bild. Jeden Kandidaten VOR Einbau per Read-Tool ansehen.

Kandidaten (Parent hat sie gelesen, du liest trotzdem selbst):
- Hero-Erste: ${ROOT}/public/photos/party/party-47.webp
  Vier Tänzerinnen lila, alle Koepfe ganz plus Luft, hell, scharf, echt, in src unbenutzt.
- Hero-Reserve: ${ROOT}/public/photos/party/party-35-v3.webp
  Paar, hell, beide Hauptkoepfe ganz. Nur Galerie-Album, kein Hero einer anderen Route.
- Danceflow-Erste: ${ROOT}/public/photos/party/party-35-v3.webp wenn Hero party-47 ist.
  Sonst party-47 als Danceflow-Grossfoto.
- Danceflow-Reserve: ${ROOT}/public/photos/party/party-28.webp nur wenn Vorderreihe Koepfe ganz bleiben.

VERBOTEN als Motiv:
party-52.webp, party-50-v4.webp, danceflow/01-v3, kurs-03, offer-bachata-1200,
kurse-heels-energie, offer-privat, kurse-classfreude-01, gallery/kurse/06.

TABU-DATEIEN (kein Edit):
EventsTeaser.tsx, danceflow-content.ts, KursaufbauPage, PrivatstundenPage,
HeelsView, StylePage, Home, BookingPanel, Offer.tsx.

Crops 12/14/20 nicht drehen. left: 1.25rem nicht setzen. Kein Push.

npx oxlint src/public/EventsPage.tsx muss Exit 0.

long horizon session, human is away. Fertig erst wenn party-52 weg ist und oxlint 0.

OUTPUT: heroSrc, danceflowSrc, files, notes, done.`,
  { label: 'bau:opus-events', phase: 'Bau', agentType: 'opus-builder', schema: BUILD },
)

phase('Shots')
const shots = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md zuerst lesen. Sonst BLOCKED.

cwd: ${ROOT}
Vite: http://127.0.0.1:5175  muss 200 auf /events sein.
API: http://127.0.0.1:8788/api/health muss 200 sein.

Schreibe ${ROOT}/worklog/.r143-shots.mjs analog ${ROOT}/worklog/.r141-shots.mjs
und fahre es mit node.

Pflicht, alte Dateien ueberschreiben:
- ${DESK} Viewport 1440x730. CTA «Nächste Events ansehen» muss im Shot sein.
- ${MOB} Viewport 390x844. Cookie VOR dem Shot akzeptieren (Alle akzeptieren).
- ${DANCE} Viewport 1440x900, zu #danceflow scrollen, Komposition sichtbar.

Danach: node scripts/verify-ux-whatsapp.mjs  — VERDICT PASS erwarten.

Kein Edit an src/. Nur Shots und das mjs.

OUTPUT: mobil, desktop, danceflow (Absolutpfade), waPass, notes.`,
  { label: 'shots:luna', phase: 'Shots', agentType: 'luna-worker', schema: SHOTS },
)

phase('Kritik')
const kritikPromptSol = `ROLLE: sol-critic. READ-ONLY.
Skill: /root/.claude/agents/sol-critic.md zuerst.

cwd: ${ROOT}
Pruefe den R143-Fix auf /events.

Lies:
- ${ROOT}/src/public/EventsPage.tsx (Hero-src + Danceflow-src)
- ${DESK}
- ${MOB}
- ${DANCE}

Fragen:
1. Ist party-52 weg?
2. Sind sichtbare Koepfe im Fold ganz (Kinn + Luft)?
3. Sind sichtbare Koepfe in der Danceflow-Komposition ganz?
4. Bleibt CTA «Nächste Events ansehen» im 1440-Fold?
5. Drei Fakten, WA-Kreis, kein Fremd-Hero?

Default fail wenn unsicher. pass=true nur mit Beleg.
Keine Tabu-Dateien fordern.`

const kritikPromptOpus = `ROLLE: opus-critic. READ-ONLY.
Skill: /root/.claude/agents/opus-critic.md zuerst.

Dieselbe Pruefung wie Sol, unabhaengig.
Lies die echten PNGs:
${DESK}
${MOB}
${DANCE}
und EventsPage.tsx Hero + Danceflow src.

party-52 muss weg. Koepfe ganz. CTA im Fold. Drei Fakten. WA Kreis.
Default fail. pass=true nur mit Beleg. Nicht die eigene Bauarbeit — du hast nicht gebaut.`

const kritikPromptLuna = `ROLLE: luna-worker. work_type: mass. Kein Look-Urteil, nur Ja/Nein nach PNG.
Skill: /root/.claude/agents/luna-worker.md zuerst.

Lies mit Read-Tool, kein Raten:
${DESK}
${MOB}
${DANCE}

Antworte NUR JA oder NEIN je Feld:
- koepfeGanz: alle sichtbaren Koepfe im Fold-Band UND in der Danceflow-Komposition haben Kinn + Luft. Kein Schnitt durch Gesicht.
- wenigerMinis: drei Fakten-Bloecke, nicht sechs gleiche Chips.
- keinFremdMotiv: Hero ist NICHT party-52, NICHT party-50-v4, NICHT danceflow/01-v3.
- waRechtsKreis: gruener WhatsApp-Kreis unten rechts, kein Text-Label.
- keinKi: Motiv sieht nach echtem Foto aus, keine Matte-Kante.
- foldCtaGanz: Button «Nächste Events ansehen» liegt komplett im 1440-Shot.
- shotsDa: die drei genannten PNG-Pfade sind lesbar.

beleg: was du im PNG siehst, konkret.`

const [sol, luna, opus] = await parallel([
  () =>
    agent(kritikPromptSol, {
      label: 'kritik:sol',
      phase: 'Kritik',
      agentType: 'sol-critic',
      schema: FUNDE,
    }),
  () =>
    agent(kritikPromptLuna, {
      label: 'kritik:luna-janein',
      phase: 'Kritik',
      agentType: 'luna-worker',
      schema: JANEIN,
    }),
  () =>
    agent(kritikPromptOpus, {
      label: 'kritik:opus',
      phase: 'Kritik',
      agentType: 'opus-critic',
      schema: FUNDE,
    }),
])

phase('Look')
const look = await agent(
  `ROLLE: kimi-critic. NUR Look.
Skill: /root/.claude/agents/kimi-critic.md zuerst.

VERBOT in DIESEM Auftrag:
- NICHT /root/tools/model-lanes/kimi-lane.sh aufrufen.
- NICHT /root/.kimi-code/config.toml oeffnen.
- KEIN zweiter Versuch.
- KEIN Eigenurteil wenn der Call stirbt.

Ablauf:
1. Probe: curl -sS -m 8 http://127.0.0.1:8318/v1/models -H "Authorization: Bearer $CLI_PROXY_API_KEY"
   Steht model_cooldown in der Antwort: sofort status=BLOCKED, model=kimi/k3, text=cooldown. Stopp.
2. EIN Chat-Call:
   POST http://127.0.0.1:8318/v1/chat/completions
   Header Authorization: Bearer $CLI_PROXY_API_KEY
   JSON: model MUSS "kimi/k3" sein (das Wort kimi steht im Feld).
   messages: Look-Kritik der drei PNGs. Du darfst die PNGs vorher per Read ansehen und die Beschreibung in den Prompt packen, weil das Gateway keine Bilder bekommt.
   Dateien: ${DESK} ${MOB} ${DANCE}
   Frage nur Look: wirkt das Hero-Band hell/scharf? Wirken die Koepfe ganz? Wirkt die Danceflow-Komposition ruhig statt Mini-Chaos?
3. Eine Antwort. status=PASS oder FAIL oder BLOCKED. model=kimi/k3. text=Rohtext von Kimi.

Stirbt der Call: status=BLOCKED, kein Ersatzurteil.`,
  { label: 'look:kimi-8318', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md zuerst.

Schreibe ${ROOT}/worklog/STATUS-r142.md

Inhalt auf Deutsch, kurz:
## Ist / Soll
## Bau
heroSrc=${bau && bau.heroSrc}
danceflowSrc=${bau && bau.danceflowSrc}
## Shots
${DESK}
${MOB}
${DANCE}
## Luna Ja/Nein
${JSON.stringify(luna || {})}
## Sol
${JSON.stringify(sol || {})}
## Opus
${JSON.stringify(opus || {})}
## Look
${JSON.stringify(look || {})}
## rg-Belege
Fuehre selbst aus und klebe die Ausgabe:
rg -n "party-52" src/public/EventsPage.tsx; echo EXIT:$?
rg -n "center 12%" src/public/courses/styles/heels-content.ts
rg -n "center 14%" src/public/courses/styles/content.ts
rg -n "center 20%" src/public/courses/styles/content.ts
rg -n "party-50-v4" src/public/home/EventsTeaser.tsx src/public/events/danceflow-content.ts
rg -c 'left: 1\\.25rem' src/index.css || echo 0
git diff --name-only
node scripts/verify-ux-whatsapp.mjs 2>&1 | tail -3

cwd ${ROOT}. Nur diese eine Datei schreiben.

OUTPUT: path, written.`,
  { label: 'status:luna', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return {
  bau,
  shots,
  sol,
  luna,
  opus,
  look,
  status,
  input,
}
