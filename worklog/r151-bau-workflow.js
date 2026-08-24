export const meta = {
  name: 'r151-partys-bau',
  description: 'R151 Partys Blob Koepfe Motion bauen',
  phases: [{ title: 'Bau', detail: 'opus-builder PartysPage + index.css data-partys-page' }],
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
cwd /root/clients/salsaflow-w1. Branch geil-welle. Vite 5175.

BAU, nicht nur messen. Schreibe die Dateien.

write_set:
- /root/clients/salsaflow-w1/src/public/PartysPage.tsx
- /root/clients/salsaflow-w1/src/index.css

TABU, nicht anfassen: kit.tsx, TanzschuhePage, CollabsPage, FaqPage, FaqAccordion, EventsPage, TeamPage, PhotosPage, gallery/content.ts, SiteHeader, SiteFooter, HeelsView, StylePage, PrivatstundenPage, KursaufbauPage, partys-content.ts (Motiv bleibt party-31-v3.webp). party-47 und party-50-v4 nicht anfassen.

1. Hero-Koepfe ganz: in PartysPage SubHero media
   positionClass: 'object-[center_28%]'
   heightClass: 'h-[16rem] sm:h-[20rem] lg:h-[22rem]'
   Motiv src unveraendert c.hero.image.src
   Kommentar R151: Band-Top ~484, 22rem=352, Ende ~836 <= 900-Fold. 28% haelt hintere Scheitel und Frau vorn.

2. Motion smoother NUR auf dieser Seite: jedes useReveal() in PartysPage wird
   useReveal({ duration: 0.7, distance: 8, stagger: 0.1 })
   Kein neues Paket. kit.tsx nicht aendern.

3. Blob voller Kreis NUR via index.css, Marker [data-partys-page].
   kit.tsx hat den Blob: h-[36rem] w-[36rem] -right-40 -top-40, Sektion overflow-hidden.
   Fuege in index.css einen Block mit Kommentar "R151 partys-blob" ein:
   body:has([data-partys-page]) section.relative.isolate.overflow-hidden > div.pointer-events-none[aria-hidden] {
     right: 2.5rem !important;
     top: 5rem !important;
     left: auto !important;
     bottom: auto !important;
     width: 12rem !important;
     height: 12rem !important;
   }
   Das ist ein voller Kreis im Hero, nicht weg, nicht die Danceflow-Kachel, nicht den FAB.
   Desktop-WA-Kreis fuer data-partys-page bleibt.

4. npx oxlint src/public/PartysPage.tsx Exit 0.

Locks unberuehrt: center 84% Tanzschuhe, Footer tanzschuhe, ml-auto 0, party-47, center 39%, center 24%, center 12% heels, left 1.25rem = 0.

OUTPUT: done true, files, notes mit den drei Hebeln.`,
  { label: 'bau:opus-r151', phase: 'Bau', agentType: 'opus-builder', schema: DONE },
)

return { bau, items }
