export const meta = {
  name: 'r154-preise-kritik',
  description: 'R154 Kritik Look STATUS nach Preise',
  phases: [
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r154.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    uebersichtDa: { type: 'string' },
    bildEinmal: { type: 'string' },
    koepfeGanz: { type: 'string' },
    shotsDa: { type: 'string' },
    waRechts: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['uebersichtDa', 'bildEinmal', 'koepfeGanz', 'shotsDa', 'waRechts', 'beleg'],
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
const DSK = ROOT + '/worklog/shots/S7-ux154/preise-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux154/preise-mobil-390.png'
const Y14 = ROOT + '/worklog/shots/S7-ux154/preise-y1400.png'
const Y28 = ROOT + '/worklog/shots/S7-ux154/preise-y2800.png'

phase('Kritik')
const [sol, luna, opus] = await parallel([
  () =>
    agent(
      `ROLLE: sol-critic. READ-ONLY. Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Lane tot: pass=false, ein Fund BLOCKED, funde sonst leer. Kein Ersatz-Urteil.
Lies ${DSK} ${MOB} ${Y14} ${Y28} nur wenn die Lane laeuft.`,
      { label: 'kritik:sol-r154', phase: 'Kritik', agentType: 'sol-critic', schema: FUNDE },
    ),
  () =>
    agent(
      `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
VERBOT: nicht codex-lane.sh. Lies PNGs mit Read.
${DSK}
${MOB}
${Y14}
${Y28}
Felder nur JA oder NEIN: uebersichtDa, bildEinmal, koepfeGanz, shotsDa, waRechts.
uebersichtDa: Fold zeigt CHF 190 / 100 / Gratis klar?
bildEinmal: y1400 ist KEIN zweites identisches Klassen-Lineup wie das Fold-Band?
koepfeGanz: Fold-Band zeigt sichtbare Koepfe ohne Schnitt am Kinn/Scheitel der vorderen Personen?
shotsDa: Dateien zeigen /preise?
waRechts: gruener Knopf unten rechts?
Default NEIN.`,
      { label: 'kritik:luna-r154', phase: 'Kritik', agentType: 'luna-worker', schema: JANEIN },
    ),
  () =>
    agent(
      `ROLLE: opus-critic. READ-ONLY. Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies PNGs, PreisePage.tsx, preise/content.ts.
Video 05:08/05:12 uebersichtlicher, 05:19 keine doppelten Bilder.
Keine neuen Preise. Cookie unberuehrt. Default fail.`,
      { label: 'kritik:opus-r154', phase: 'Kritik', agentType: 'opus-critic', schema: FUNDE },
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
${DSK} ${MOB} ${Y14} ${Y28}
Cooldown, 429, 502 oder failover auf Grok: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r154', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass. Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r154.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege.
cwd ${ROOT}. Nur diese Datei. NUR /preise. Kein Cookie-Text. Kein Verify-PASS erfinden.

Sol: ${JSON.stringify(sol || { pass: false })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
OUTPUT: path, written.`,
  { label: 'status:luna-r154', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { sol, luna, opus, look, status, items }
