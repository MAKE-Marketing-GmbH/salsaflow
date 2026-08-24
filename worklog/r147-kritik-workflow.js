export const meta = {
  name: 'r147-faq-kritik',
  description: 'R147 Kritik Look STATUS nach FAQ-Bau',
  phases: [
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r147.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

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

phase('Kritik')
const solPrompt = `ROLLE: sol-critic. READ-ONLY.
Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Arbeite mit Read, Grep, Bash selbst. Lane tot = pass false, funde leer, problem BLOCKED.

Lies ${DESK} ${MOB} ${ACCD} ${ACCM}
und FaqPage.tsx FaqAccordion.tsx faq/content.ts.
Pruefe: Chevron rechts in voller Shell-Breite (Desktop chevRight 1388), Liste weniger dicht, echte Fragen ohne erfundene Fakten, Desktop-WA Kreis ~51px, Mobil Chevron x284 links vom FAB x314.
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

Sol: ${JSON.stringify(sol || { pass: false, note: 'null' })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}

OUTPUT: path, written.`,
  { label: 'status:luna-r147', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { sol, luna, opus, look, status, items }
