export const meta = {
  name: 'r126-home-kinn',
  description: 'R126 Kritik Home Mobil Kinn der Frau sichtbar',
  phases: [
    { title: 'Kritik', detail: 'Luna liest Nachher-PNG, Kinn sichtbar, CTA frei' },
  ],
}

const input = typeof args === 'string' ? JSON.parse(args) : (args || {})

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    whatsappRechtsUnten: { type: 'boolean' },
    kinnSichtbar: { type: 'boolean' },
    homeKursplanFrei: { type: 'boolean' },
    pass: { type: 'boolean' },
    beleg: { type: 'string' },
    biggest_gap: { type: 'string' },
  },
  required: ['whatsappRechtsUnten', 'kinnSichtbar', 'homeKursplanFrei', 'pass', 'beleg', 'biggest_gap'],
}

const MOB = '/root/clients/salsaflow-w1/worklog/shots/S7-ux126w/home-mobil-390.png'
const DESK = '/root/clients/salsaflow-w1/worklog/shots/S7-ux126w/home-desktop-1440.png'

const CLAIMS = `work_type: mass. Lies die echten PNGs mit dem Read-Tool. Kein Bash. Kein Text-Raten.

Skill: luna-worker. Datei: /root/.claude/agents/luna-worker.md
Lies die Agent-Datei zuerst. Ist sie nicht lesbar: BLOCKED.

Dateien:
- Mobil 390x844: ${MOB}
- Desktop 1440x730: ${DESK}

Drei Claims, alle muessen wahr sein fuer pass=true:
1. whatsappRechtsUnten: gruener WhatsApp-Kreis sitzt unten RECHTS und ist sichtbar.
2. kinnSichtbar: im Mobilbild sind Mund und Kinn der Frau sichtbar. Kein Schnitt durch Mund oder Kinn. Beide Gesichter vollstaendig im Fold.
3. homeKursplanFrei: der Ghost-CTA «Kursplan ansehen» liegt NICHT unter dem Kreis.

Locks: Kreis bleibt rechts. Motiv hero-paar-dreh-01-portrait. Lift bleibt 5rem. H1-Copy unveraendert.

Default: pass=false wenn unsicher. beleg = was du im PNG siehst.`

phase('Kritik')
const luna = await agent(CLAIMS, {
  label: 'kritik:luna-r126',
  phase: 'Kritik',
  agentType: 'luna-worker',
  schema: VERDICT,
})

return {
  route: input.route || '/',
  luna,
  kinnSichtbar: Boolean(luna && luna.pass && luna.kinnSichtbar),
}
