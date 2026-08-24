export const meta = {
  name: 'r146-fotos',
  description: 'R146 Shots und Kritik /team-FAB plus /fotos ohne Portraets',
  phases: [
    { title: 'Shots', detail: 'S7-ux146 plus Team-Mobil nach FAB' },
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r146.md' },
  ],
}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    keinePortraets: { type: 'string' },
    kontextDa: { type: 'string' },
    shotsDa: { type: 'string' },
    waRechtsKreis: { type: 'string' },
    fabTextFrei: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['keinePortraets', 'kontextDa', 'shotsDa', 'waRechtsKreis', 'fabTextFrei', 'beleg'],
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

const SHOTS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ok: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['ok', 'notes'],
}

const ROOT = '/root/clients/salsaflow-w1'
const DESK = ROOT + '/worklog/shots/S7-ux146/fotos-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux146/fotos-mobil-390.png'
const GRID = ROOT + '/worklog/shots/S7-ux146/fotos-galerie-scroll-1440.png'
const TEAM_MOB = ROOT + '/worklog/shots/S7-ux144/team-mobil-390.png'

phase('Shots')
const shots = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md zuerst.
cwd: ${ROOT}
Vite 5175 /fotos und /team muessen 200 sein.
Fahre node ${ROOT}/worklog/.r146-shots.mjs
Kein Edit an src/.
Falls Dateien schon da und juenger als der Script-Lauf: trotzdem einmal fahren.
OUTPUT: ok, notes.`,
  { label: 'shots:luna-r146', phase: 'Shots', agentType: 'luna-worker', schema: SHOTS },
)

phase('Kritik')
const solPrompt = `ROLLE: sol-critic. READ-ONLY.
Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Arbeite mit Read, Grep, Bash selbst. Lane tot = pass false, funde leer, problem BLOCKED.

Lies ${DESK} ${MOB} ${GRID} ${TEAM_MOB}
und gallery/content.ts.
Pruefe: keine Team-Portraets in der Galerie, Event/Kursfotos mit Kontext,
Team-Mobil H2 nicht unter FAB, WA Kreis.
Default fail.`

const lunaPrompt = `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
Lies die PNGs mit Read:
${DESK}
${MOB}
${GRID}
${TEAM_MOB}
Felder nur JA oder NEIN: keinePortraets, kontextDa, shotsDa, waRechtsKreis, fabTextFrei.
beleg konkret. Default NEIN.`

const opusPrompt = `ROLLE: opus-critic. READ-ONLY.
Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies die vier PNGs und gallery/content.ts.
Keine Portraets? Kontext da? FAB frei auf /team Mobil?
Default fail.`

const [sol, luna, opus] = await parallel([
  () =>
    agent(solPrompt, {
      label: 'kritik:sol-r146',
      phase: 'Kritik',
      agentType: 'sol-critic',
      schema: FUNDE,
    }),
  () =>
    agent(lunaPrompt, {
      label: 'kritik:luna-r146',
      phase: 'Kritik',
      agentType: 'luna-worker',
      schema: JANEIN,
    }),
  () =>
    agent(opusPrompt, {
      label: 'kritik:opus-r146',
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
model MUSS kimi/k3 sein.
Lies die PNGs, beschreibe sie im Prompt.
${DESK} ${MOB} ${GRID}
Cooldown, 429 oder failover: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r146', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r146.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
rg -n "teacher-aleksandra.webp" src/public/gallery/content.ts || echo 0
rg -n "party-47" src/public/EventsPage.tsx
rg -n "center 39%" src/public/TeamPage.tsx
rg -n "center 12%" src/public/courses/styles/heels-content.ts
rg -c 'left: 1\\.25rem' src/index.css || echo 0
cwd ${ROOT}. Nur diese Datei.

Sol: ${JSON.stringify(sol || { pass: false, note: 'null' })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
Shots: ${JSON.stringify(shots || {})}

OUTPUT: path, written.`,
  { label: 'status:luna-r146', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { shots, sol, luna, opus, look, status }
