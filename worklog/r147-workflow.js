export const meta = {
  name: 'r147-faq',
  description: 'R147 /faq: Chevron, Dichte, Fragen, WA-Kreis, Shots, Kritik, STATUS',
  phases: [
    { title: 'Bau', detail: 'opus-builder FaqPage Accordion content CSS' },
    { title: 'Shots', detail: 'S7-ux147 plus Accordion-Scroll' },
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r147.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const BAU = {
  type: 'object',
  additionalProperties: false,
  properties: {
    done: { type: 'boolean' },
    notes: { type: 'string' },
    files: { type: 'array', items: { type: 'string' } },
  },
  required: ['done', 'notes', 'files'],
}

const SHOTS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ok: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['ok', 'notes'],
}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    chevronRechts: { type: 'string' },
    wenigerDicht: { type: 'string' },
    echteFragen: { type: 'string' },
    shotsDa: { type: 'string' },
    waRechts: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['chevronRechts', 'wenigerDicht', 'echteFragen', 'shotsDa', 'waRechts', 'beleg'],
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
const DESK = ROOT + '/worklog/shots/S7-ux147/faq-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux147/faq-mobil-390.png'
const ACCD = ROOT + '/worklog/shots/S7-ux147/faq-accordion-scroll-1440.png'
const ACCM = ROOT + '/worklog/shots/S7-ux147/faq-accordion-scroll-390.png'

phase('Bau')
const bau = await agent(
  `ROLLE: opus-builder. Skill zuerst: /root/.claude/agents/opus-builder.md
cwd: ${ROOT}
write_set NUR:
- src/public/FaqPage.tsx
- src/public/faq/FaqAccordion.tsx
- src/public/faq/content.ts
- src/index.css (nur neuer [data-faq-page]-Block, analog Team/Events, KEIN left: 1.25rem)

TABU: EventsPage, TeamPage, PhotosPage, gallery/content.ts, HeelsView, StylePage, PrivatstundenPage, KursaufbauPage. Kein Push. Crops 12/14/20, party-47, Team 39% nicht anfassen.

VIDEO Raphael 18.08.:
- 02:43 Dropdown weiter rechts
- 02:48 mehr FAQ-optimierte Fragen
- 07:33 ein bisschen auf, uebersichtlicher, sonst viel zu viel

PARENT-MESSUNG 19.08. 09:49 auf http://127.0.0.1:5175/faq:
- Desktop WA Pille 121x56 bei x1295 y576. Soll ab sm Kreis ohne Text.
- Chevron gap zur Summary-Right = 0 INNERHALB der 640px-Spalte. Linke Spalte: Chevron bei x692 (Mitte der Seite). Video will den Dropdown weiter rechts: eine volle Shell-Breite, eine Spalte, Chevron am rechten Rand der Content-Well, nicht in der Spaltenmitte.
- Mobil Accordion: erste Summary endet x370, FAB x314-370. Chevron und Zeilenende liegen UNTER dem FAB. Hebel am Text: padding-right 4rem unter sm auf summary/h2/p analog R140b, Selektor body:has([data-faq-page]), nicht left am Knopf.
- 24 Fragen, 2 Spalten a 12, erste Frage defaultOpen. Hero zeigt dieselbe Frage schon. defaultOpen = false.
- content.themes existiert, wird in FaqPage NICHT gerendert. Render die Theme-Chips als Sprung (href bleibt).
- Vorher-Shots: ${ROOT}/worklog/shots/S7-ux147/vorher/

BAU:
1. data-faq-page auf .faq-page (FaqPage nutzt SubPageShell, Marker darf innen liegen; WA-Kreis via body:has).
2. index.css: Desktop-Kreis-Block Kopie von data-team-page, Selektor data-faq-page. Mobil-pr Block fuer summary, h2, p, a im #faq.
3. Accordion: eine Spalte volle Shell-Breite. Mehr Luft (py am details, groesserer gap zwischen Gruppen). Chevron shrink-0, ml-auto, justify-between bleibt.
4. Drei kuerzere Gruppen statt zwei Waende. Mehr vertikaler Abstand zwischen Gruppen.
5. 4-6 zusaetzliche suchstarke DE-Fragen plus EN, NUR aus bestehenden Fakten (Gratis Schnupperstunde, ohne Partner, 8 Wochen 60 Min, Studios am Bahnhof Basel SBB, info@salsaflow-dc.com, Danceflow Night Salsa+Bachata, Preise auf /preise, Heels-Deep-Link /tanzkurse/heels ohne neue Heels-Behauptung). KEINE Preise erfinden. Kein Payment. forbidden.md beachten. python3 /root/raphael-skills/skills/eigene/copywriting/scripts/forbidden-check.py src/public/faq/content.ts --doku muss Exit 0.
6. npx oxlint auf den drei TSX/TS-Dateien, Exit 0.
7. JSON-LD bleibt ein Block ueber alle Items.

OUTPUT: done, notes, files.`,
  { label: 'bau:opus-r147', phase: 'Bau', agentType: 'opus-builder', schema: BAU },
)

phase('Shots')
const shots = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md zuerst.
cwd: ${ROOT}
Vite 5175 /faq muss 200 sein.
Fahre node ${ROOT}/worklog/.r147-shots.mjs
Kein Edit an src/.
OUTPUT: ok, notes.`,
  { label: 'shots:luna-r147', phase: 'Shots', agentType: 'luna-worker', schema: SHOTS },
)

phase('Kritik')
const solPrompt = `ROLLE: sol-critic. READ-ONLY.
Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Arbeite mit Read, Grep, Bash selbst. Lane tot = pass false, funde leer, problem BLOCKED.

Lies ${DESK} ${MOB} ${ACCD} ${ACCM}
und FaqPage.tsx FaqAccordion.tsx faq/content.ts.
Pruefe: Chevron rechts in der vollen Breite, Liste weniger dicht, echte Fragen ohne erfundene Fakten, Desktop-WA Kreis, Mobil kein Wort unter FAB.
Default fail.`

const lunaPrompt = `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
Lies die PNGs mit Read:
${DESK}
${MOB}
${ACCD}
${ACCM}
Felder nur JA oder NEIN: chevronRechts, wenigerDicht, echteFragen, shotsDa, waRechts.
beleg konkret. Default NEIN.`

const opusPrompt = `ROLLE: opus-critic. READ-ONLY.
Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies die vier PNGs und FaqPage.tsx, FaqAccordion.tsx, faq/content.ts.
Chevron rechts? Weniger Dichte? Suchstarke Fragen ohne erfundene Fakten? WA Kreis Desktop, Mobil FAB frei?
Default fail.`

const [sol, luna, opus] = await parallel([
  () =>
    agent(solPrompt, {
      label: 'kritik:sol-r147',
      phase: 'Kritik',
      agentType: 'sol-critic',
      schema: FUNDE,
    }),
  () =>
    agent(lunaPrompt, {
      label: 'kritik:luna-r147',
      phase: 'Kritik',
      agentType: 'luna-worker',
      schema: JANEIN,
    }),
  () =>
    agent(opusPrompt, {
      label: 'kritik:opus-r147',
      phase: 'Kritik',
      agentType: 'opus-critic',
      schema: FUNDE,
    }),
])

phase('Look')
const look = await agent(
  `ROLLE: kimi-critic. NUR Look.
Skill: /root/.claude/agents/kimi-critic.md
VERBOT: NICHT kimi-lane.sh. NICHT /root/.kimi-code/config.toml.
EIN Call: POST http://127.0.0.1:8318/v1/chat/completions
Authorization Bearer $CLI_PROXY_API_KEY
model MUSS kimi enthalten.
Lies die PNGs, beschreibe sie im Prompt.
${DESK} ${MOB} ${ACCD}
Cooldown, 429 oder failover: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r147', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r147.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
rg -n "party-47" src/public/EventsPage.tsx
rg -n "center 39%" src/public/TeamPage.tsx
rg -n "center 12%" src/public/courses/styles/heels-content.ts
rg -c 'left: 1\\.25rem' src/index.css || echo 0
rg -n "data-faq-page" src/public/FaqPage.tsx src/index.css
cwd ${ROOT}. Nur diese Datei.

Bau: ${JSON.stringify(bau || {})}
Sol: ${JSON.stringify(sol || { pass: false, note: 'null' })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
Shots: ${JSON.stringify(shots || {})}

OUTPUT: path, written.`,
  { label: 'status:luna-r147', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { bau, shots, sol, luna, opus, look, status, items }
