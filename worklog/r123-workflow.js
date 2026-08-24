export const meta = {
  name: 'r123-wa-sitewide',
  description: 'R123 Kritik WhatsApp Kreis auf Tanzkurse Salsa Preise',
  phases: [
    { title: 'Kritik', detail: 'Luna liest Nachher-PNG, Kreis unten rechts' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    tanzkurse: { type: 'boolean' },
    salsa: { type: 'boolean' },
    preise: { type: 'boolean' },
    pass: { type: 'boolean' },
    beleg: { type: 'string' },
    biggest_gap: { type: 'string' },
  },
  required: ['tanzkurse', 'salsa', 'preise', 'pass', 'beleg', 'biggest_gap'],
}

const DIR = '/root/clients/salsaflow-w1/worklog/shots/S7-ux123'
const FILES = [
  `${DIR}/tanzkurse-mobil-390.png`,
  `${DIR}/tanzkurse-desktop-1440.png`,
  `${DIR}/salsa-mobil-390.png`,
  `${DIR}/salsa-desktop-1440.png`,
  `${DIR}/preise-mobil-390.png`,
  `${DIR}/preise-desktop-1440.png`,
]

const CLAIMS = `work_type: mass. Lies die echten PNGs mit dem Read-Tool. Kein Bash. Kein Text-Raten.

Dateien:
${FILES.map((f) => '- ' + f).join('\n')}

Ein Claim, muss auf JEDER Datei wahr sein fuer pass=true:
whatsappRechtsUnten: gruener WhatsApp-Kreis sitzt unten RECHTS und ist sichtbar.

Pro Route ein Boolean: tanzkurse, salsa, preise.
pass=true nur wenn alle drei true.
Default: pass=false wenn unsicher. beleg = was du im PNG siehst.`

phase('Kritik')
const luna = await agent(CLAIMS, {
  label: 'kritik:luna-r123',
  phase: 'Kritik',
  agentType: 'luna-worker',
  schema: VERDICT,
})

return {
  routes: input.routes || ['/tanzkurse', '/tanzkurse/salsa', '/preise'],
  luna,
}
