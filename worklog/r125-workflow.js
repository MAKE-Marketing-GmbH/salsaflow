export const meta = {
  name: 'r125-home-cta',
  description: 'R125 Kritik Home Ghost-CTA nicht unter WA-Kreis',
  phases: [
    { title: 'Kritik', detail: 'Luna liest Nachher-PNG, Kursplan-CTA frei' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    whatsappRechtsUnten: { type: 'boolean' },
    homeKursplanFrei: { type: 'boolean' },
    pass: { type: 'boolean' },
    beleg: { type: 'string' },
    biggest_gap: { type: 'string' },
  },
  required: ['whatsappRechtsUnten', 'homeKursplanFrei', 'pass', 'beleg', 'biggest_gap'],
}

const MOB = '/root/clients/salsaflow-w1/worklog/shots/S7-ux125/home-mobil-390.png'
const DESK = '/root/clients/salsaflow-w1/worklog/shots/S7-ux125/home-desktop-1440.png'

const CLAIMS = `work_type: mass. Lies die echten PNGs mit dem Read-Tool. Kein Bash. Kein Text-Raten.

Skill: luna-worker. Datei: /root/.claude/agents/luna-worker.md
Lies die Agent-Datei zuerst. Ist sie nicht lesbar: BLOCKED.

Dateien:
- Mobil 390x844: ${MOB}
- Desktop 1440x730: ${DESK}

Zwei Claims, beide muessen wahr sein fuer pass=true:
1. whatsappRechtsUnten: gruener WhatsApp-Kreis sitzt unten RECHTS und ist sichtbar.
2. homeKursplanFrei: der Ghost-CTA «Kursplan ansehen» liegt NICHT unter dem Kreis. Kein Pixel dieses Labels unter dem Kreis.

Locks: Kreis bleibt rechts. Lift bleibt 5rem. Kein Salsa-Crop.

Default: pass=false wenn unsicher. beleg = was du im PNG siehst.`

phase('Kritik')
const luna = await agent(CLAIMS, {
  label: 'kritik:luna-r125',
  phase: 'Kritik',
  agentType: 'luna-worker',
  schema: VERDICT,
})

return {
  route: input.route || '/',
  luna,
  homeKursplanFrei: Boolean(luna && luna.pass && luna.homeKursplanFrei),
}
