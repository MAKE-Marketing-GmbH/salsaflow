export const meta = {
  name: 'r149-collabs-bau',
  description: 'R149 Collabs Crop Bandhoehe und Desktop-WA Kreis',
  phases: [{ title: 'Bau', detail: 'opus-builder CollabsPage plus CSS-Block' }],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const DONE = {
  type: 'object',
  additionalProperties: false,
  properties: {
    files: { type: 'array', items: { type: 'string' } },
    crop: { type: 'string' },
    heightClass: { type: 'string' },
    notes: { type: 'string' },
  },
  required: ['files', 'crop', 'heightClass', 'notes'],
}

phase('Bau')
const bau = await agent(
  `ROLLE: opus-builder. Skill: /root/.claude/agents/opus-builder.md
cwd: /root/clients/salsaflow-w1
long horizon session, human is away.

AUFGABE: /mehr/collabs, Video 07:45 Koepfe nicht abschneiden.

WRITE_SET nur:
- src/public/CollabsPage.tsx
- src/index.css (nur neuer Block am FAQ-Block danach, nichts anderes aendern)
- src/public/more/collabs-content.ts nur wenn noetig (Motiv hp-27.webp behalten)

IST Desktop 1440: Band hp-27, position center 40%, heightClass h-[11rem] sm:h-[13rem] lg:h-[15rem].
Scheitel der vier Personen weg, Beine weg. WA ist Pille.
IST Mobil 390: ganze Gruppe sichtbar, FAB auf der Couch.

SOLL:
1. In CollabsPage.tsx Wrapper mit data-collabs-page="" um den Seiteninhalt, analog FaqPage.
2. object-position und/oder Bandhoehe so, dass Gesichter PLUS Scheitel im Desktop-Fold liegen.
   Motiv bleibt hp-27.webp. Vorschlag: position 'center 32%' und heightClass
   'h-[16rem] sm:h-[20rem] lg:h-[28rem]'. Wenn du misst und ein anderer Wert die
   Scheitel sicherer trifft, nimm den. Kein neues Stock.
3. index.css: neuer Block ab sm analog Team/FAQ:
   body:has([data-collabs-page]) a.whatsapp-float { width 3.5rem, padding 0, span display none }
   Mobil-pr NUR wenn FAB ein Wort trifft. FAB auf der Couch ohne Wort = kein pr.
4. Kein left: 1.25rem. Keine Edits an FaqPage, TeamPage, EventsPage, gallery, Heels, Crops 12/14/20.

GATE: rg data-collabs-page in CollabsPage.tsx und index.css.
rg "center 40%" CollabsPage.tsx muss 0 sein (auch im Kommentar 40% raus oder umschreiben).
oxlint Exit 0 auf den angefassten TSX-Dateien.

OUTPUT: files, crop, heightClass, notes.`,
  {
    label: 'bau:opus-r149',
    phase: 'Bau',
    agentType: 'opus-builder',
    schema: DONE,
  },
)

return { bau, items }
