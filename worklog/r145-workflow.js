export const meta = {
  name: 'r145-team',
  description: 'R145 /team: Köpfe ganz, schärfere Porträts, WA-Kreis, Shots, Kritik',
  phases: [
    { title: 'Bau', detail: 'opus-builder TeamPage + Porträts + WA' },
    { title: 'Shots', detail: 'S7-ux144 Pflicht-PNGs' },
    { title: 'Kritik', detail: 'sol nativ + luna JaNein + opus-critic' },
    { title: 'Look', detail: 'kimi 8318 ein Call' },
    { title: 'Status', detail: 'STATUS-r144.md' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const BUILD = {
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
    mobil: { type: 'string' },
    desktop: { type: 'string' },
    founders: { type: 'string' },
    waPass: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['mobil', 'desktop', 'founders', 'waPass', 'notes'],
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
    portraetsScharf: { type: 'string' },
    waRechtsKreis: { type: 'string' },
    keinKi: { type: 'string' },
    foldCtaGanz: { type: 'string' },
    shotsDa: { type: 'string' },
    beleg: { type: 'string' },
  },
  required: [
    'koepfeGanz',
    'portraetsScharf',
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
const DESK = ROOT + '/worklog/shots/S7-ux144/team-desktop-1440.png'
const MOB = ROOT + '/worklog/shots/S7-ux144/team-mobil-390.png'
const FOUND = ROOT + '/worklog/shots/S7-ux144/team-founders-scroll-1440.png'

phase('Bau')
const bau = await agent(
  `ROLLE: opus-builder. HARNESS: Claude Agent. work_type: frontend.
Skill: /root/.claude/agents/opus-builder.md zuerst.
Dann /root/.claude/skills/web/SKILL.md und /root/.claude/skills/design/SKILL.md
cwd: ${ROOT}

write_set:
- ${ROOT}/src/public/TeamPage.tsx
- ${ROOT}/src/public/team/content.ts
- ${ROOT}/src/public/team/FounderRow.tsx
- ${ROOT}/src/index.css  NUR neuer Selektor body:has([data-team-page]) analog R142 events
- ${ROOT}/public/photos/founders/*.webp
- ${ROOT}/public/photos/team/teacher-*.webp

TABU: EventsPage.tsx, EventsTeaser.tsx, PhotosPage.tsx, gallery/content.ts,
HeelsView, StylePage, PrivatstundenPage, KursaufbauPage, danceflow-content.ts.

AUFTRAG /team Video 06:57 nicht abschneiden, 07:03 bessere Aufloesung.

1) Marker: in TeamPage ein leeres <div data-team-page="" /> wie data-events-page.
2) index.css: Kopie der Events-WA-Kreis-Regel, Selektor [data-team-page]. Nichts anderes in index.css.
3) Portraets schaerfer: Cutouts unter
   ${ROOT}/docs/bilder/assets/premium-2026-07-03/cutouts/
   sind 1414x2000 und schaerfer als public 1000x1414 (Parent hat Fabio gelesen:
   public hat weissen Hof, Cutout ist sauber).
   Konvertiere mit cwebp -q 90 auf dieselbe Datei:
   fabio/claudia/sebastian/vanessa.png -> public/photos/founders/<name>.webp
   aleksandra/anina/jelena/maarten/tobias.png -> public/photos/team/teacher-<name>.webp
   Namen nicht erfinden. bust-Werte in content.ts nicht ohne Beweis drehen.
4) Hero hp-03.webp bleibt. Crop center 58% nur aendern mit neuem 1440-Fold-Beweis.
   Vorher-Shot ${ROOT}/worklog/shots/S7-ux144/vorher/team-desktop-1440.png:
   stehende Koepfe ganz, kniende Reihe am Fold abgeschnitten, WA ist Pille 121x56.
   Ziel: alle sichtbaren Koepfe im Fold ganz (Kinn + Luft), inkl. vorderer Reihe.
   Hebel in TeamPage: dense und/oder heightClass, damit das Band vollstaendig
   im 1440x730-Fold liegt. CTA «Schnupperstunde buchen» bleibt im Fold.
5) npx oxlint auf geaenderten ts/tsx, Exit 0.

long horizon, human is away. Fertig erst mit data-team-page und oxlint 0.
Kein Push. EventsPage nicht anfassen.

OUTPUT: done, notes, files.`,
  { label: 'bau:opus-team', phase: 'Bau', agentType: 'opus-builder', schema: BUILD },
)

phase('Shots')
const shots = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md zuerst.

cwd: ${ROOT}
Vite http://127.0.0.1:5175/team muss 200 sein.

Schreibe und fahre ${ROOT}/worklog/.r145-shots.mjs
Cookie vor Mobil akzeptieren (Akzeptieren ODER Alle akzeptieren).
Warte bis Text sichtbar ist (kein Fade).

Pflicht:
- ${DESK} 1440x730
- ${MOB} 390x844
- ${FOUND} 1440x900, zu den Gruender-Portraets scrollen

Danach: node scripts/verify-ux-whatsapp.mjs  VERDICT PASS.
Kein Edit an src/.

OUTPUT: mobil, desktop, founders, waPass, notes.`,
  { label: 'shots:luna-team', phase: 'Shots', agentType: 'luna-worker', schema: SHOTS },
)

phase('Kritik')
const solPrompt = `ROLLE: sol-critic. READ-ONLY.
Skill: /root/.claude/agents/sol-critic.md
VERBOT: rufe NICHT /root/tools/model-lanes/codex-lane.sh auf.
Arbeite mit Read, Grep, Bash selbst. Lane tot = status BLOCKED, nicht raten.

Lies ${DESK} ${MOB} ${FOUND} und TeamPage.tsx.
Pruefe: Koepfe ganz, Portraets schaerfer, WA Kreis, CTA im Fold, kein KI.
Default fail. pass nur mit Beleg.`

const lunaPrompt = `ROLLE: luna-worker. work_type: mass. Nur Ja/Nein.
Skill: /root/.claude/agents/luna-worker.md
Lies die PNGs mit Read:
${DESK}
${MOB}
${FOUND}
Felder nur JA oder NEIN: koepfeGanz, portraetsScharf, waRechtsKreis, keinKi, foldCtaGanz, shotsDa.
beleg konkret. Default NEIN.`

const opusPrompt = `ROLLE: opus-critic. READ-ONLY.
Skill: /root/.claude/agents/opus-critic.md
Du hast nicht gebaut. Lies die drei PNGs und TeamPage.tsx.
Koepfe ganz? WA Kreis? CTA im Fold? Portraets scharf, kein KI?
Default fail. pass nur mit Beleg.`

const [sol, luna, opus] = await parallel([
  () =>
    agent(solPrompt, {
      label: 'kritik:sol-team',
      phase: 'Kritik',
      agentType: 'sol-critic',
      schema: FUNDE,
    }),
  () =>
    agent(lunaPrompt, {
      label: 'kritik:luna-team',
      phase: 'Kritik',
      agentType: 'luna-worker',
      schema: JANEIN,
    }),
  () =>
    agent(opusPrompt, {
      label: 'kritik:opus-team',
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
Lies die PNGs, beschreibe sie im Prompt (Gateway bekommt keine Bilder).
${DESK} ${MOB} ${FOUND}
Frage: wirkt /team scharf, Koepfe ganz, WA Kreis ruhig?
Cooldown oder failover: status=BLOCKED, kein Eigenurteil, kein zweiter Versuch.`,
  { label: 'look:kimi-team', phase: 'Look', agentType: 'kimi-critic', schema: LOOK },
)

phase('Status')
const status = await agent(
  `ROLLE: luna-worker. work_type: mass.
Skill: /root/.claude/agents/luna-worker.md
Schreibe ${ROOT}/worklog/STATUS-r144.md
Ist/Soll, Bau-Notizen, Shot-Pfade, Luna/Sol/Opus/Look, rg-Belege:
rg -n data-team-page src/public/TeamPage.tsx
rg -n party-47 src/public/EventsPage.tsx
rg -n "center 12%" src/public/courses/styles/heels-content.ts
rg -n "center 14%" src/public/courses/styles/content.ts
rg -n "center 20%" src/public/courses/styles/content.ts
rg -c 'left: 1\\.25rem' src/index.css || echo 0
node scripts/verify-ux-whatsapp.mjs | tail -3
cwd ${ROOT}. Nur diese Datei.

Sol-Ergebnis: ${JSON.stringify(sol || { pass: false, note: 'null' })}
Luna: ${JSON.stringify(luna || {})}
Opus: ${JSON.stringify(opus || {})}
Look: ${JSON.stringify(look || {})}
Bau: ${JSON.stringify(bau || {})}

OUTPUT: path, written.`,
  { label: 'status:luna-r144', phase: 'Status', agentType: 'luna-worker', schema: STATUS },
)

return { bau, shots, sol, luna, opus, look, status, input }
