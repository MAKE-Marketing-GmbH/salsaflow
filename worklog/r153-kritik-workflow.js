export const meta = {
  name: 'r153-cookie-kritik',
  description: 'R153 Kritik Look STATUS nach Cookie+WA',
  phases: [
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r153.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    cookieFrei: { type: 'string' },
    fabFrei: { type: 'string' },
    ctaFrei: { type: 'string' },
    shotsDa: { type: 'string' },
    waRechts: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['cookieFrei', 'fabFrei', 'ctaFrei', 'shotsDa', 'waRechts', 'beleg'],
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
const DSK = ROOT + '/worklog/shots/S7-ux153/cookie-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux153/cookie-mobil-390.png'
const DSKA = ROOT + '/worklog/shots/S7-ux153/after/cookie-desktop-1440-accepted.png'
const MOBA = ROOT + '/worklog/shots/S7-ux153/after/cookie-mobil-390-accepted.png'

phase('Kritik')
const [sol, luna, opus] = await parallel([
  () =>
    agent(
      `ROLLE: sol-critic. READ-ONLY. Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Lane tot: pass=false, ein Fund BLOCKED, funde sonst leer. Kein Ersatz-Urteil.
Lies ${DSK} ${MOB} nur wenn die Lane laeuft.`,
      { label: 'kritik:sol-r153', phase: 'Kritik', agentType: 'sol-critic', schema: FUNDE },
    ),
  () =>
    agent(
      `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
VERBOT: nicht codex-lane.sh. Lies PNGs mit Read.
${DSK}
${MOB}
${DSKA}
${MOBA}
Felder nur JA oder NEIN: cookieFrei, fabFrei, ctaFrei, shotsDa, waRechts.
cookieFrei: Cookie-Karte nicht unter dem FAB?
fabFrei: FAB nicht auf der Cookie-Karte?
ctaFrei: Mobil «Schnupperstunde buchen» nicht unter Cookie oder FAB?
shotsDa: Dateien zeigen Home Erstbesuch mit Cookie?
waRechts: gruener Knopf unten rechts?
Default NEIN.`,
      { label: 'kritik:luna-r153', phase: 'Kritik', agentType: 'luna-worker', schema: JANEIN },
    ),
  () =>
    agent(
      `ROLLE: opus-critic. READ-ONLY. Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies PNGs, CookieBanner.tsx, WhatsAppFloat.tsx, index.css Cookie/Float.
Video 03:46 Cookie besser, 03:50 WA nicht 0815.
Kein Puls/Ping/Scale. raised greift ab sm. Gutter mobil. Default fail.`,
      { label: 'kritik:opus-r153', phase: 'Kritik', agentType: 'opus-critic', schema: FUNDE },
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
${DSK} ${MOB} ${DSKA} ${MOBA}
Cooldown, 429, 502 oder failover auf Grok: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r153', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass. Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r153.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n "center 24%" src/public/CollabsPage.tsx
rg -n "loading=\\"lazy\\"" src/public/CollabsPage.tsx || echo 0
rg -n "center_10%" src/public/PartysPage.tsx
rg -n "center 84%" src/public/TanzschuhePage.tsx
rg -n "tanzschuhe" src/public/site/SiteFooter.tsx
rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
rg -c 'left: 1\\.25rem' src/index.css || echo 0
cwd ${ROOT}. Nur diese Datei. NUR Cookie+WA. Kein Collabs-Text. Kein Verify-PASS erfinden.

Sol: ${JSON.stringify(sol || { pass: false })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
OUTPUT: path, written.`,
  { label: 'status:luna-r153', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { sol, luna, opus, look, status, items }
