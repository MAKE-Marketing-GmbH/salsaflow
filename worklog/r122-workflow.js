export const meta = {
  name: 'r122-kursplan-pfeile',
  description: 'R122 Kritik /kursplan Pfeile frei, Sol nativ extra',
  phases: [
    { title: 'Kritik', detail: 'Luna liest Nachher-PNG, Claim-Liste' },
    { title: 'Look', detail: 'kimi-critic nur Look nach Pfeile frei' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    whatsappRechtsUnten: { type: 'boolean' },
    kursplanPfeileFrei: { type: 'boolean' },
    kursplanChipsFrei: { type: 'boolean' },
    pass: { type: 'boolean' },
    beleg: { type: 'string' },
    biggest_gap: { type: 'string' },
  },
  required: [
    'whatsappRechtsUnten',
    'kursplanPfeileFrei',
    'kursplanChipsFrei',
    'pass',
    'beleg',
    'biggest_gap',
  ],
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

const MOB = '/root/clients/salsaflow-w1/worklog/shots/S7-ux122/kursplan-mobil-390.png'
const DESK = '/root/clients/salsaflow-w1/worklog/shots/S7-ux122/kursplan-desktop-1440.png'

const CLAIMS = `work_type: mass. Lies die echten PNGs mit dem Read-Tool. Kein Bash. Kein Text-Raten.

Dateien:
- Mobil 390x844: ${MOB}
- Desktop 1440x730: ${DESK}

Drei Claims, alle muessen wahr sein fuer pass=true:
1. whatsappRechtsUnten: gruener WhatsApp-Kreis sitzt unten RECHTS, nicht links.
2. kursplanPfeileFrei: die Wochen-Pfeile ‹ › liegen NICHT unter dem Kreis. Kein Pixel eines Pfeils unter dem Kreis.
3. kursplanChipsFrei: Tages-Chips Mo Di Mi liegen nicht unter dem Kreis.

Locks: Kreis bleibt rechts. Lift bleibt 5rem. Kein Salsa-Crop.

Default: pass=false wenn unsicher. beleg = was du im PNG siehst.`

phase('Kritik')
const luna = await agent(CLAIMS, {
  label: 'kritik:luna-kursplan',
  phase: 'Kritik',
  agentType: 'luna-worker',
  schema: VERDICT,
})

const pfeileFrei = Boolean(luna && luna.pass && luna.kursplanPfeileFrei)

let look = { skipped: true, reason: 'pfeile nicht frei' }
if (pfeileFrei) {
  phase('Look')
  look = await agent(
    `Nur Look. Keine Ja/Nein-Liste. Kein Claim-Urteil.

Lies mit Read:
- ${MOB}
- ${DESK}

Sag was am Look stoert. Ein Satz biggest_gap.`,
    {
      label: 'look:kimi-kursplan',
      phase: 'Look',
      agentType: 'kimi-critic',
      schema: LOOK,
    },
  )
}

return {
  route: input.route || '/kursplan',
  luna,
  pfeileFrei,
  look,
}
