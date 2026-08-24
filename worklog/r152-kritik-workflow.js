export const meta = {
  name: 'r152-collabs-kritik',
  description: 'R152 Kritik Look STATUS nach Collabs-Scroll',
  phases: [
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r152.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    bildDa: { type: 'string' },
    keinLeerband: { type: 'string' },
    headerDa: { type: 'string' },
    shotsDa: { type: 'string' },
    waRechts: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['bildDa', 'keinLeerband', 'headerDa', 'shotsDa', 'waRechts', 'beleg'],
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
const Y0 = ROOT + '/worklog/shots/S7-ux152/collabs-y0.png'
const Y8 = ROOT + '/worklog/shots/S7-ux152/collabs-y800.png'
const Y16 = ROOT + '/worklog/shots/S7-ux152/collabs-y1600.png'
const Y24 = ROOT + '/worklog/shots/S7-ux152/collabs-y2400.png'
const MOB = ROOT + '/worklog/shots/S7-ux152/collabs-mobil-390.png'

phase('Kritik')
const [sol, luna, opus] = await parallel([
  () =>
    agent(
      `ROLLE: sol-critic. READ-ONLY. Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Lane tot: pass=false, ein Fund BLOCKED, funde sonst leer. Kein Ersatz-Urteil.
Lies ${Y0} ${Y8} ${Y16} ${Y24} ${MOB} nur wenn die Lane laeuft.`,
      { label: 'kritik:sol-r152', phase: 'Kritik', agentType: 'sol-critic', schema: FUNDE },
    ),
  () =>
    agent(
      `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
VERBOT: nicht codex-lane.sh. Lies PNGs mit Read.
${Y0}
${Y8}
${Y16}
${Y24}
${MOB}
Felder nur JA oder NEIN: bildDa, keinLeerband, headerDa, shotsDa, waRechts.
bildDa: y800 oder y1600 zeigt ein Partner-Foto (Schuhe/Kollektion), nicht leer?
keinLeerband: y2400 hat KEIN grosses leeres Cream-Band zwischen Inhalt und Request-Karte?
headerDa: y800 UND y2400 zeigen die Nav-Leiste (nicht translateY weg)?
shotsDa: Dateien zeigen /mehr/collabs?
waRechts: gruener Kreis unten rechts?
Default NEIN.`,
      { label: 'kritik:luna-r152', phase: 'Kritik', agentType: 'luna-worker', schema: JANEIN },
    ),
  () =>
    agent(
      `ROLLE: opus-critic. READ-ONLY. Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies PNGs, CollabsPage.tsx, collabs-content.ts, data-collabs-page in index.css.
Video 09:19 weg, 09:23 ungeladen, 09:28 guck hin.
Fold center 24% und hp-27 unberuehrt. Partys 10% unberuehrt. Default fail.`,
      { label: 'kritik:opus-r152', phase: 'Kritik', agentType: 'opus-critic', schema: FUNDE },
    ),
])

phase('Look')
const look = await agent(
  `ROLLE: kimi-critic. NUR Look. Skill: /root/.claude/agents/kimi-critic.md
VERBOT: NICHT kimi-lane.sh. NICHT /root/.kimi-code/config.toml.
EIN Call: POST http://127.0.0.1:8318/v1/chat/completions
Authorization Bearer $CLI_PROXY_API_KEY
model MUSS kimi enthalten. Bevorzugt kimi-k3.
Lies die PNGs, beschreibe sie im Prompt.
${Y0} ${Y8} ${Y16} ${Y24} ${MOB}
Cooldown, 429, 502 oder failover auf Grok: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r152', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass. Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r152.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n "center 24%" src/public/CollabsPage.tsx
rg -n "hp-27.webp" src/public/more/collabs-content.ts
rg -n "loading=\\"lazy\\"" src/public/CollabsPage.tsx || echo 0
rg -n "center 10%" src/public/PartysPage.tsx
rg -n "center 84%" src/public/TanzschuhePage.tsx
rg -n "tanzschuhe" src/public/site/SiteFooter.tsx
rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
rg -c 'left: 1\\.25rem' src/index.css || echo 0
cwd ${ROOT}. Nur diese Datei. NUR Collabs-Scroll. Kein Partys-Text. Kein Verify-PASS erfinden.

Sol: ${JSON.stringify(sol || { pass: false })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
OUTPUT: path, written.`,
  { label: 'status:luna-r152', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { sol, luna, opus, look, status, items }
