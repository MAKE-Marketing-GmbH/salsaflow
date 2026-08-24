export const meta = {
  name: 'r152-collabs-scroll-bau',
  description: 'R152 Collabs Scroll Partner Padding Header',
  phases: [{ title: 'Bau', detail: 'opus-builder CollabsPage + content + css' }],
}

const items = typeof args === 'string' ? JSON.parse(args) : args || {}

const DONE = {
  type: 'object',
  additionalProperties: false,
  properties: {
    done: { type: 'boolean' },
    files: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['done', 'files', 'notes'],
}

phase('Bau')
const bau = await agent(
  `ROLLE: opus-builder. Skill: /root/.claude/agents/opus-builder.md
cwd /root/clients/salsaflow-w1. BAU, nicht nur messen.

write_set:
- /root/clients/salsaflow-w1/src/public/CollabsPage.tsx
- /root/clients/salsaflow-w1/src/public/more/collabs-content.ts
- /root/clients/salsaflow-w1/src/index.css

TABU: kit.tsx, PartysPage, TanzschuhePage, FaqPage, EventsPage, TeamPage, PhotosPage, gallery/content.ts, SiteFooter, SiteHeader (kein Dropdown-Umbau). Fold Crop center 24% und hp-27.webp NICHT drehen.

1. CollabsPage Partner-img: Attribut loading="lazy" KOMPLETT entfernen. Default eager.
2. TrustSection und RequestSection: py-16 lg:py-24 -> py-8 lg:py-12, damit y2400 kein Cream-Leerband hat.
3. collabs-content.ts DE+EN partner.image:
   src: '/photos/premium/offer-heels-1200.webp'
   alt DE: 'Zwei Taenzerinnen in Salsaflow-Heels, Studioaufnahme'
   alt EN: 'Two dancers in Salsaflow heels, studio shot'
   Nicht hp-27. Nicht kurs-03. Nicht Stock.
4. Partner img object-position: object-[center_80%] damit die Schuhe im 4/3-Fenster liegen.
5. index.css, Kommentar "R152 collabs-header":
   body:has([data-collabs-page]) header.fixed {
     transform: none !important;
   }
   Hide-on-Scroll nur auf dieser Route aus. Nicht sitewide.

npx oxlint die drei Dateien Exit 0.
OUTPUT: done, files, notes.`,
  { label: 'bau:opus-r152', phase: 'Bau', agentType: 'opus-builder', schema: DONE },
)

return { bau, items }
