export const meta = {
  name: 'r154-preise-bau2',
  description: 'R154 Runde 2 helle Kurs-Paare statt Nacht',
  phases: [{ title: 'Bau', detail: 'content.ts + PreisePage Masse' }],
}

const ROOT = '/root/clients/salsaflow-w1'

phase('Bau')
const bau = await agent(
  `ROLLE: opus-builder. Skill: /root/.claude/agents/opus-builder.md
long horizon session, human is away.

cwd: ${ROOT}
write_set NUR:
- ${ROOT}/src/public/preise/content.ts
- ${ROOT}/src/public/PreisePage.tsx

TABU: CookieBanner, WhatsAppFloat, Home, Collabs, Partys, Tanzschuhe, kit.tsx, index.css, Preise.

Parent hat die Dateien per Read geprueft. Keine neue Wahl. Kein YuNet-Umweg.

PFLICHT DE und EN identisch:

1) regular.image
   src: '/photos/gallery/kurse/01.jpg'
   alt DE: 'Paar uebt im Kurs eine Drehung, weitere Paare im Hintergrund'
   alt EN: 'Couple practising a turn in class, other couples in the background'
   position: 'center 28%'
   Masse: 1600 x 1066

2) pass.image
   src: '/photos/premium/offer-salsa-wide-1400.webp'
   alt DE: 'Frau lacht im Kurs, Partner unscharf im Spiegel'
   alt EN: 'Woman laughing in class, partner blurred in the mirror'
   position: 'center 40%'

3) Kommentare: alte Begruendung zu gallery/02 und gallery/05 ersetzen. Kurz: Nachtlicht raus, Kurs-Paar rein. Kein Dateiname party-36.webp in einem src-String.

4) PreisePage.tsx: Kommentar und width/height der regular-img auf 1600x1066. objectPosition-Logik bleibt.

5) Fold kurs-05, 38 %, heightClass unveraendert. Privat/Workshop/Social unveraendert. Keine neue Zahl.

VERIFY:
npx oxlint src/public/PreisePage.tsx src/public/preise/content.ts
npx tsc --noEmit
rg -n "gallery/kurse/02.jpg|gallery/kurse/05.jpg" src/public/preise/content.ts || echo 0
Muss 0 sein (kein src, Kommentar ohne diese Pfade).

OUTPUT: files, oxlint exit, tsc exit, rg 02/05.`,
  { label: 'bau2:opus-r154', phase: 'Bau', agentType: 'opus-builder' },
)

return { bau }
