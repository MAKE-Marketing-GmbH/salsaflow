export const meta = {
  name: 'r154-preise-bau',
  description: 'R154 Preise Uebersicht Motive Koepfe',
  phases: [{ title: 'Bau', detail: 'opus-builder PreisePage + content' }],
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
- /root/clients/salsaflow-w1/src/public/PreisePage.tsx
- /root/clients/salsaflow-w1/src/public/preise/content.ts
- /root/clients/salsaflow-w1/src/index.css  (NUR wenn [data-preise-page] noetig)

TABU: kit.tsx, CookieBanner, WhatsAppFloat, HomePage, Hero, Offer, CollabsPage, PartysPage, TanzschuhePage, FaqPage, EventsPage, TeamPage, PhotosPage, gallery/content.ts, SiteHeader, SiteFooter. Keine neue Zahl. Keine erfundene Leistung. Kein neues Eyebrow Preise. Kein dritter Primaer-Knopf im Fold.

IST: Fold kurs-05 14rem center 38% schneidet Koepfe. Scroll regular.image party-36 ist zweites Klassenfoto. hero.image kurs-03 ungenutzt. Pass kurs-07 drittes Klassenfoto.

SOLL
1. Marker data-preise-page am Wrapper in PreisePage.
2. Fold-Band kurs-05 bleibt. Hoehe lg:h-[20rem] (sm 16rem). position center 30%, damit sichtbare Koepfe ganz sind. Band waechst nach unten. kit.tsx nicht anfassen.
3. hero.image kurs-03 entfernen (Typ + DE + EN), wenn ungenutzt. PreisePage nutzt media.
4. regular.image: party-36 raus. Ersatz /photos/kurse/kurs-02.jpg (Paar im Kurs, kein zweites Gruppen-Lineup). Alt ehrlich. DE+EN.
5. pass.image: kurs-07 raus. Ersatz /photos/kurse/kurs-06.jpg (Studio-Portraet, kein Klassen-Lineup). position center 35%. DE+EN.
6. Workshop 08.jpg und Danceflow party-38 und Privat offer-privat bleiben.
7. Hierarchie bleibt: Fold-Ankerzahlen, dann Staffel-Tabelle, dann Rest. Keine neuen Preise. Copy nicht aufblasen.

npx oxlint die angefassten TS-Dateien Exit 0.
OUTPUT: done, files, notes.`,
  { label: 'bau:opus-r154', phase: 'Bau', agentType: 'opus-builder', schema: DONE },
)

return { bau, items }
