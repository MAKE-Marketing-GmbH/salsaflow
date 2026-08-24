export const meta = {
  name: 'r121-buchung-verify',
  description: 'R120-Verify /buchung, bei PASS /kursplan messen',
  phases: [
    { title: 'KritikBuchung', detail: 'Sol-Lane plus Luna auf /buchung-PNGs' },
    { title: 'NaechsteRoute', detail: 'Bei 2-von-2 PASS /kursplan messen' },
    { title: 'KritikKursplan', detail: 'Sol plus Luna auf /kursplan, nur nach PASS' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    whatsappRechtsUnten: { type: 'boolean' },
    buchungFreiFrei: { type: 'boolean' },
    buchungZeitFrei: { type: 'boolean' },
    pass: { type: 'boolean' },
    beleg: { type: 'string' },
    biggest_gap: { type: 'string' },
  },
  required: ['whatsappRechtsUnten', 'buchungFreiFrei', 'buchungZeitFrei', 'pass', 'beleg', 'biggest_gap'],
}

const LOOK = {
  type: 'object',
  additionalProperties: false,
  properties: {
    look: { type: 'string' },
    biggest_gap: { type: 'string' },
  },
  required: ['look', 'biggest_gap'],
}

const SHOT_BUCHUNG_MOB = '/root/clients/salsaflow-w1/worklog/shots/S7-ux121/buchung-mobil.png'
const SHOT_BUCHUNG_DESK = '/root/clients/salsaflow-w1/worklog/shots/S7-ux121/buchung-desktop.png'
const SHOT_KURS_MOB = '/root/clients/salsaflow-w1/worklog/shots/S7-ux121/kursplan-mobil.png'
const SHOT_KURS_DESK = '/root/clients/salsaflow-w1/worklog/shots/S7-ux121/kursplan-desktop.png'

const CLAIMS = `Lies die echten PNGs mit dem Read-Tool. Kein Text-Raten.

Dateien:
- Mobil 390x844: ${SHOT_BUCHUNG_MOB}
- Desktop 1440x730: ${SHOT_BUCHUNG_DESK}

Drei Claims, alle muessen wahr sein fuer pass=true:
1. whatsappRechtsUnten: gruener WhatsApp-Kreis sitzt unten RECHTS, nicht links.
2. buchungFreiFrei: das Wort «frei» liegt NICHT unter dem Kreis.
3. buchungZeitFrei: keine Uhr liegt unter dem Kreis. «frei» darf unter der Zeit links stehen.

Locks: Kreis bleibt rechts. Kein left: 1.25rem. Kein Salsa-Crop. Kein Events-Crop.

Default: pass=false wenn unsicher. beleg = was du im PNG siehst.`

phase('KritikBuchung')
const kritikBuchung = await parallel([
  () => agent(CLAIMS, {
    label: 'kritik:sol-buchung',
    phase: 'KritikBuchung',
    agentType: 'sol-critic',
    schema: VERDICT,
  }),
  () => agent(CLAIMS + '\n\nwork_type: mass. Nur PNG lesen. PASS/FAIL nach der Claim-Liste.', {
    label: 'kritik:luna-buchung',
    phase: 'KritikBuchung',
    agentType: 'luna-worker',
    schema: VERDICT,
  }),
])
const buchungVotes = kritikBuchung.filter(Boolean)
const buchungPassCount = buchungVotes.filter((v) => v.pass).length
const buchungTwoOfTwo = buchungPassCount === 2

let kursplan = { skipped: true, reason: 'buchung nicht 2-von-2 PASS' }
let kritikKursplan = []
let look = null

if (buchungTwoOfTwo) {
  phase('NaechsteRoute')
  const shot = await agent(
    `work_type: mass. Fuehre genau diesen Befehl aus und gib stdout zurueck:
node /root/clients/salsaflow-w1/worklog/shots/S7-ux121/ux121-shot.mjs /kursplan
Danach pruefe, dass diese Dateien existieren:
${SHOT_KURS_MOB}
${SHOT_KURS_DESK}
Gib {ok, stdout, files} zurueck. Nichts anderes aendern.`,
    {
      label: 'shot:kursplan',
      phase: 'NaechsteRoute',
      agentType: 'luna-worker',
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ok: { type: 'boolean' },
          stdout: { type: 'string' },
          files: { type: 'string' },
        },
        required: ['ok', 'stdout', 'files'],
      },
    },
  )
  kursplan = shot || { skipped: false, ok: false, stdout: 'null', files: '' }

  phase('KritikKursplan')
  const kursClaims = `Lies die echten PNGs mit dem Read-Tool. Kein Text-Raten.

Dateien:
- Mobil 390x844: ${SHOT_KURS_MOB}
- Desktop 1440x730: ${SHOT_KURS_DESK}

Claims fuer pass=true:
1. whatsappRechtsUnten: gruener WhatsApp-Kreis sitzt unten RECHTS.
2. Seite ist /kursplan (Kalender/Wochenplan sichtbar).
3. Mobil: Kreis liegt nicht auf den Tages-Chips.

buchungFreiFrei und buchungZeitFrei hier auf false setzen, ausser du siehst dieselben Worte auf /kursplan.

Default: pass=false wenn unsicher.`

  kritikKursplan = (await parallel([
    () => agent(kursClaims, {
      label: 'kritik:sol-kursplan',
      phase: 'KritikKursplan',
      agentType: 'sol-critic',
      schema: VERDICT,
    }),
    () => agent(kursClaims + '\n\nwork_type: mass. Nur PNG lesen. PASS/FAIL nach der Claim-Liste.', {
      label: 'kritik:luna-kursplan',
      phase: 'KritikKursplan',
      agentType: 'luna-worker',
      schema: VERDICT,
    }),
    () => agent(`Nur Look, kein Ja/Nein zu den Claims. Lies ${SHOT_KURS_MOB} und ${SHOT_KURS_DESK}. Was wirkt lost? Ein Satz Luecke.`, {
      label: 'look:kimi-kursplan',
      phase: 'KritikKursplan',
      agentType: 'kimi-critic',
      schema: LOOK,
    }),
  ])).filter(Boolean)
  look = kritikKursplan.find((v) => v.look)
}

return {
  route0: '/buchung',
  route1: buchungTwoOfTwo ? '/kursplan' : null,
  buchungVotes,
  buchungPassCount,
  buchungTwoOfTwo,
  buildOnlyIfBothFail: !buchungTwoOfTwo && buchungPassCount === 0,
  kursplan,
  kritikKursplan,
  look,
  input,
}
