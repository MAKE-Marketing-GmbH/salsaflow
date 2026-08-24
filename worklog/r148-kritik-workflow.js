export const meta = {
  name: 'r148-faq-kritik',
  description: 'R148 Kritik Look STATUS nach vier Fund-Fixes',
  phases: [
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r148.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    chevronAnText: { type: 'string' },
    fabFrei: { type: 'string' },
    shotsNeu: { type: 'string' },
    wenigerDicht: { type: 'string' },
    echteFragen: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['chevronAnText', 'fabFrei', 'shotsNeu', 'wenigerDicht', 'echteFragen', 'beleg'],
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
const DESK = ROOT + '/worklog/shots/S7-ux148/faq-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux148/faq-mobil-390.png'
const ACCD = ROOT + '/worklog/shots/S7-ux148/faq-accordion-scroll-1440.png'
const ACCM = ROOT + '/worklog/shots/S7-ux148/faq-accordion-scroll-390.png'

phase('Kritik')
const solPrompt = `ROLLE: sol-critic. READ-ONLY.
Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Lane tot oder Rollen-Konflikt: pass=false, genau EIN Fund schwere KRITISCH problem BLOCKED, funde sonst leer. Kein Ersatz-Urteil der Huelle. Keine Pixelmessung als Sol-Stimme.

Lies ${DESK} ${MOB} ${ACCD} ${ACCM} nur wenn die Lane wirklich laeuft.`

const lunaPrompt = `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
Lies die PNGs mit Read:
${DESK}
${MOB}
${ACCD}
${ACCM}
Felder nur JA oder NEIN: chevronAnText, fabFrei, shotsNeu, wenigerDicht, echteFragen.
fabFrei: liegt der gruene Kreis auf einem Wort oder auf einem Chevron? Dann NEIN.
chevronAnText: sitzt der Desktop-Chevron am Ende der Lesespalte, nicht am Viewport-Rand?
Default NEIN. beleg konkret.`

const opusPrompt = `ROLLE: opus-critic. READ-ONLY.
Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies die vier PNGs und FaqAccordion.tsx, faq/content.ts, FaqPage.tsx.
Vier Funde aus R147: ml-auto weg? FAB frei auf Heels-Zeile? Mobil-Shot Hash neu? 12 Jahre und Aushilfe-Chats raus?
Default fail.`

const [sol, luna, opus] = await parallel([
  () =>
    agent(solPrompt, {
      label: 'kritik:sol-r148',
      phase: 'Kritik',
      agentType: 'sol-critic',
      schema: FUNDE,
    }),
  () =>
    agent(lunaPrompt, {
      label: 'kritik:luna-r148',
      phase: 'Kritik',
      agentType: 'luna-worker',
      schema: JANEIN,
    }),
  () =>
    agent(opusPrompt, {
      label: 'kritik:opus-r148',
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
Cooldown, 429, 502 oder failover: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r148', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r148.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
rg -n "ab etwa 12 Jahren|Aushilfe-Chats" src/public/faq/content.ts || echo 0
rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
rg -n "party-47" src/public/EventsPage.tsx
rg -n "center 39%" src/public/TeamPage.tsx
rg -c 'left: 1\\.25rem' src/index.css || echo 0
cwd ${ROOT}. Nur diese Datei.

Sol: ${JSON.stringify(sol || { pass: false, note: 'null' })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}

OUTPUT: path, written.`,
  { label: 'status:luna-r148', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { sol, luna, opus, look, status, items }
