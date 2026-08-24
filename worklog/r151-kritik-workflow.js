export const meta = {
  name: 'r151-partys-kritik',
  description: 'R151 Kritik Look STATUS nach Partys-Bau',
  phases: [
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r151.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    kreisRund: { type: 'string' },
    koepfeGanz: { type: 'string' },
    motionDa: { type: 'string' },
    shotsDa: { type: 'string' },
    waRechts: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['kreisRund', 'koepfeGanz', 'motionDa', 'shotsDa', 'waRechts', 'beleg'],
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
const DESK = ROOT + '/worklog/shots/S7-ux151/partys-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux151/partys-mobil-390.png'
const SCR = ROOT + '/worklog/shots/S7-ux151/partys-hero-scroll-1440.png'
const DF = ROOT + '/worklog/shots/S7-ux151/partys-danceflow-scroll-1440.png'

phase('Kritik')
const [sol, luna, opus] = await parallel([
  () =>
    agent(
      `ROLLE: sol-critic. READ-ONLY. Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Lane tot oder Rollen-Konflikt: pass=false, genau EIN Fund schwere KRITISCH problem BLOCKED, funde sonst leer. Kein Ersatz-Urteil der Huelle.
Lies ${DESK} ${MOB} ${SCR} ${DF} nur wenn die Lane wirklich laeuft.`,
      { label: 'kritik:sol-r151', phase: 'Kritik', agentType: 'sol-critic', schema: FUNDE },
    ),
  () =>
    agent(
      `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
VERBOT: nicht /root/tools/model-lanes/codex-lane.sh. Lies PNGs mit dem Read-Tool selbst.
Lies:
${DESK}
${MOB}
${SCR}
${DF}
Felder nur JA oder NEIN: kreisRund, koepfeGanz, motionDa, shotsDa, waRechts.
kreisRund: oben rechts im Desktop-Hero ein voller Kreis (kein angeschnittener Blob)? JA auch wenn der grosse 36rem-Blob weg ist und stattdessen ein kleiner voller Kreis sitzt.
koepfeGanz: sichtbare Koepfe im Desktop-Hero-Band ohne Scheitel-Schnitt?
motionDa: du siehst Motion nicht im PNG — Default NEIN, beleg "nicht im Fold-Shot".
shotsDa: Dateien zeigen /mehr/partys?
waRechts: gruener Kreis unten rechts, nicht Pille?
Default NEIN.`,
      { label: 'kritik:luna-r151', phase: 'Kritik', agentType: 'luna-worker', schema: JANEIN },
    ),
  () =>
    agent(
      `ROLLE: opus-critic. READ-ONLY. Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies die PNGs, PartysPage.tsx, data-partys-page in index.css.
Video 08:29 Animation und oben passt nicht, 08:40 Kreis komplett rund, 08:44-08:54 Bilder besser.
Tanzschuhe center 84% unberuehrt. Collabs 24% unberuehrt. kit.tsx nicht geaendert. Default fail.`,
      { label: 'kritik:opus-r151', phase: 'Kritik', agentType: 'opus-critic', schema: FUNDE },
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
${DESK} ${MOB} ${SCR} ${DF}
Cooldown, 429, 502 oder failover auf Grok: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r151', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass. Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r151.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n "center 84%" src/public/TanzschuhePage.tsx
rg -n "tanzschuhe" src/public/site/SiteFooter.tsx
rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
rg -n "party-47" src/public/EventsPage.tsx
rg -n "center 24%" src/public/CollabsPage.tsx
rg -n "center 12%" src/public/courses/styles/heels-content.ts
rg -c 'left: 1\\.25rem' src/index.css || echo 0
cwd ${ROOT}. Nur diese Datei. NUR Partys, kein Partys-Text mit Tanzschuhe-Crop verwechseln, kein Verify-PASS erfinden.

Sol: ${JSON.stringify(sol || { pass: false })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
OUTPUT: path, written.`,
  { label: 'status:luna-r151', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { sol, luna, opus, look, status, items }
