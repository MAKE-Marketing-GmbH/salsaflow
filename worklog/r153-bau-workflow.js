export const meta = {
  name: 'r153-cookie-wa-bau',
  description: 'R153 Cookie-Lage und WhatsApp raised',
  phases: [{ title: 'Bau', detail: 'opus-builder CookieBanner + WhatsAppFloat + css' }],
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
- /root/clients/salsaflow-w1/src/public/site/CookieBanner.tsx
- /root/clients/salsaflow-w1/src/public/site/WhatsAppFloat.tsx
- /root/clients/salsaflow-w1/src/index.css

TABU: HomePage, home/Hero, home/Offer, home/StickyCta, CollabsPage, PartysPage, TanzschuhePage, FaqPage, EventsPage, TeamPage, PhotosPage, gallery/content.ts, SiteHeader, SiteFooter, kit.tsx. Kein left: 1.25rem. Copy-Text der Cookie-Karte nicht aendern.

IST (Harness 1440 und 390 Erstbesuch):
- Cookie-Karte unten. Desktop-WA-Pille liegt in derselben Zeile auf der Karte.
- Mobil: WA-Kreis liegt auf «Schnupperstunde buchen». Cookie bedeckt den CTA.

SOLL
1. CookieBanner: Karte bleibt. Rechter Gutter fuer den FAB, damit Karte und Knopf nebeneinander liegen. Mobil CTA nicht unter der Karte. Hebel: padding-right am Banner-Wrapper (Kreis ~3.5rem + gap, Desktop-Pille breiter). Nicht left am Float.
2. WhatsAppFloat + index.css: raised muss greifen. --cookie-banner-height hebt den Float ab sm UEBER die Karte. Unter sm kein Vertikal-Lift auf den Hero-CTA: Float bleibt unten rechts im Gutter. Formel weiter 1.25rem + --sticky-cta-height + --whatsapp-lift + (ab sm) --cookie-banner-height.
3. Animation: kein Puls, kein Ping, kein Scale, kein Wackeln. Einmal rein (opacity + translateY), dann Ruhe. Dauer var(--dur-slow), Kurve var(--ease-sf). Keyframes .whatsapp-float / whatsapp-float-in in index.css. Transition in WhatsAppFloat auf var(--dur-slow). Kein neues Motion-Paket. prefers-reduced-motion bleibt.

npx oxlint die drei Dateien Exit 0.
OUTPUT: done, files, notes.`,
  { label: 'bau:opus-r153', phase: 'Bau', agentType: 'opus-builder', schema: DONE },
)

return { bau, items }
