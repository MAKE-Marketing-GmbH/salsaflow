export const meta = {
  name: 'r124-schnupper-lead',
  description: 'R124 Kritik /schnupperstunde Lead nicht unter WA-Kreis',
  phases: [
    { title: 'Kritik', detail: 'Luna liest Nachher-PNG, Kreis nicht auf dem Lead' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    whatsappRechtsUnten: { type: 'boolean' },
    leadFrei: { type: 'boolean' },
    pass: { type: 'boolean' },
    beleg: { type: 'string' },
    biggest_gap: { type: 'string' },
  },
  required: ['whatsappRechtsUnten', 'leadFrei', 'pass', 'beleg', 'biggest_gap'],
}

const MOB = '/root/clients/salsaflow-w1/worklog/shots/S7-ux124/schnupper-mobil-390.png'
const DESK = '/root/clients/salsaflow-w1/worklog/shots/S7-ux124/schnupper-desktop-1440.png'

const CLAIMS = `work_type: mass. Lies die echten PNGs mit dem Read-Tool. Kein Bash. Kein Text-Raten.

Skill: luna-worker. Datei: /root/.claude/agents/luna-worker.md
Lies die Agent-Datei zuerst. Ist sie nicht lesbar: BLOCKED.

Dateien:
- Mobil 390x844: ${MOB}
- Desktop 1440x730: ${DESK}

Zwei Claims, beide muessen wahr sein fuer pass=true:
1. whatsappRechtsUnten: gruener WhatsApp-Kreis sitzt unten RECHTS und ist sichtbar.
2. leadFrei: der Satz «Keine Verkaufsstunde. Du tanzt mit, siehst das Studio und sprichst mit uns.» liegt NICHT unter dem Kreis. Kein Pixel dieses Satzes unter dem Kreis. H2 «Was dich erwartet» bleibt lesbar.

Locks: Kreis bleibt rechts. Motiv classfreude-01. Crop center 30%. Lift bleibt 5rem.

Default: pass=false wenn unsicher. beleg = was du im PNG siehst.`

phase('Kritik')
const luna = await agent(CLAIMS, {
  label: 'kritik:luna-r124',
  phase: 'Kritik',
  agentType: 'luna-worker',
  schema: VERDICT,
})

return {
  route: input.route || '/schnupperstunde',
  luna,
  leadFrei: Boolean(luna && luna.pass && luna.leadFrei),
}
