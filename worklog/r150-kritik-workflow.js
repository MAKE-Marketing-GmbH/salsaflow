export const meta = {
  name: 'r150-tanzschuhe-kritik',
  description: 'R150 Kritik Look STATUS nach Tanzschuhe-Crop',
  phases: [
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r150.md' },
  ],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const JANEIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    schuheGanz: { type: 'string' },
    schaerfer: { type: 'string' },
    footerLink: { type: 'string' },
    shotsDa: { type: 'string' },
    waRechts: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: ['schuheGanz', 'schaerfer', 'footerLink', 'shotsDa', 'waRechts', 'beleg'],
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
const DESK = ROOT + '/worklog/shots/S7-ux150/tanzschuhe-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux150/tanzschuhe-mobil-390.png'
const SCR = ROOT + '/worklog/shots/S7-ux150/tanzschuhe-hero-scroll-1440.png'

phase('Kritik')
const [sol, luna, opus] = await parallel([
  () =>
    agent(
      `ROLLE: sol-critic. READ-ONLY. Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Lane tot oder Rollen-Konflikt: pass=false, genau EIN Fund schwere KRITISCH problem BLOCKED, funde sonst leer. Kein Ersatz-Urteil der Huelle.
Lies ${DESK} ${MOB} ${SCR} nur wenn die Lane wirklich laeuft.`,
      { label: 'kritik:sol-r150', phase: 'Kritik', agentType: 'sol-critic', schema: FUNDE },
    ),
  () =>
    agent(
      `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
Lies die PNGs mit Read:
${DESK}
${MOB}
${SCR}
Felder nur JA oder NEIN: schuheGanz, schaerfer, footerLink, shotsDa, waRechts.
schuheGanz: beide Schuh-Paare komplett (Absatz bis Spitze) im Desktop-Band?
schaerfer: wirkt das Desktop-Band schaerfer/naeher als ein duenner Riemen-Streifen?
footerLink: du kannst den Footer nicht aus dem Fold-Shot sehen — Default NEIN, beleg "nicht im Fold-Shot".
shotsDa: drei Dateien zeigen /mehr/tanzschuhe?
waRechts: gruener Kreis unten rechts, nicht Pille?
Default NEIN.`,
      { label: 'kritik:luna-r150', phase: 'Kritik', agentType: 'luna-worker', schema: JANEIN },
    ),
  () =>
    agent(
      `ROLLE: opus-critic. READ-ONLY. Skill: /root/.claude/agents/opus-critic.md
Nur echte Opus-Lane. Timeout 3 Minuten. Sonst pass false und ein Fund BLOCKED.
Lies die drei PNGs, TanzschuhePage.tsx, SiteFooter.tsx, data-tanzschuhe-page in index.css.
Video 07:57 Aufloesung, 08:09 Ganzes sehen, 08:19 Findbarkeit Footer.
Motiv stilllife. Collabs center 24% unberuehrt. Default fail.`,
      { label: 'kritik:opus-r150', phase: 'Kritik', agentType: 'opus-critic', schema: FUNDE },
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
${DESK} ${MOB} ${SCR}
Cooldown, 429, 502 oder failover auf Grok: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-r150', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass. Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r150.md
Ist/Soll, Bau, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n "tanzschuhe" src/public/site/SiteFooter.tsx
rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
rg -n "party-47" src/public/EventsPage.tsx
rg -n "center 24%" src/public/CollabsPage.tsx
rg -n "center 12%" src/public/courses/styles/heels-content.ts
rg -c 'left: 1\\.25rem' src/index.css || echo 0
cwd ${ROOT}. Nur diese Datei.

Sol: ${JSON.stringify(sol || { pass: false })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
OUTPUT: path, written.`,
  { label: 'status:luna-r150', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { sol, luna, opus, look, status, items }
