/**
 * website-plan Lauf 2 — nach G-IA Freigabe (Claude-Host). VERSION 2.0.0
 * Setze MISSION + GIA_CHOICE, dann Workflow starten.
 */
export const meta = {
  name: 'website-plan-after-gia',
  description: 'Nach G-IA: Copy, Specs, G-DESIGN, Close',
  phases: [
    { title: 'Lock-IA', detail: '05-sitemap-ia festschreiben' },
    { title: 'Copy', detail: 'Final + humanizer' },
    { title: 'Specs', detail: 'Section specs' },
    { title: 'Design', detail: '3 Richtungen + G-DESIGN STOP' },
  ],
}

const OUT = '/root/clients/salsaflow-dc/website-plan'
const REPO = '/root/clients/salsaflow-dc'
const LIVE_URL = 'https://www.salsaflow-dc.com/'
const FIRMA = 'Salsaflow Dance Company (Salsa Flow Basel)'
const GIA_CHOICE = 'Kunden-Baseline aus Eingang SFDC-NEW-WEBSITE-STRUKTUR.docx (Raphael 2026-08-12): Nav TANZKURSE | EVENTS & WORKSHOPS | TEAM | FOTOS | KONTAKT | MEHR — so wie bisher/wie Kunde wollte. Mapping Gate = A-artig (stabile Repo-URLs). B Funnel und C Schule/Nights verworfen. Freigeschrieben in 05-sitemap-ia.md. Home-Blöcke laut Kunden-Doc: Team+Text, Angebot/Kalender, Kurse, Privatstunden, Shows, Gutschein, News. Levels Salsa/Bachata 1-13+Flows, Heels B/I/A, Sommerkurse 3 Wochen Spezialpreis. WhatsApp sitewide.' // A | B | C | Mix-Beschreibung
const OVERRIDES = 'LOCKED DESIGN.md v2 (Cal Sans/Afacad, salsa #ad1827). DECISIONS+ARCHITEKTUR Frozen. Asset-P0: Privatstunden-Motiv ersetzen (falsches Produktbild, nicht nur low-res); Hero Home darf nicht leer; Alt-Texte alle. Live=Jimdo noch DNS; Vercel=https://salsaflow-dc.vercel.app. Screenshots: website-plan/screenshots + evidence/. Kunden-Eingang: docs/bilder/redesign-2026-08/eingang/. Kein Production-Code. Backend-Logik in Specs erklären (Buchung/Kontakt/Privat-Anfrage). SEO 04 + Critics beachten: Gratis-Schnupper Claim unbestätigt.'

if (OUT.includes('MISS:') || GIA_CHOICE.includes('MISS:')) {
  throw new Error('Platzhalter OUT/GIA_CHOICE setzen')
}

const ULTRA = `Long-horizon ultracode. PLAN only. No nested agents. No fake proof.
OUT=${OUT} FIRMA=${FIRMA} LIVE=${LIVE_URL} REPO=${REPO}
G-IA Wahl des Users: ${GIA_CHOICE}
${OVERRIDES}`

const TEXT = {
  type: 'object', required: ['summary', 'paths_written'],
  properties: {
    summary: { type: 'string' },
    paths_written: { type: 'array', items: { type: 'string' } },
  },
}
const VARIANTS = {
  type: 'object', required: ['recommendation', 'options', 'markdown'],
  properties: {
    recommendation: { type: 'string' },
    options: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object', required: ['id', 'title', 'meaning', 'tradeoff'],
        properties: {
          id: { type: 'string' }, title: { type: 'string' },
          meaning: { type: 'string' }, tradeoff: { type: 'string' },
        },
      },
    },
    markdown: { type: 'string' },
  },
}

phase('Lock-IA')
await agent(ULTRA + `ROLLE IA-Lock.
Schreibe final ${OUT}/05-sitemap-ia.md und ${OUT}/05b-copy-style.md (Archetyp + 3 Zeilen Begründung)
gemäß User-Wahl ${GIA_CHOICE} und Dateien 05-ia-*.`, {
  label: 'ia-lock', phase: 'Lock-IA', agentType: 'luna-worker', schema: TEXT,
})

phase('Copy')
await parallel([
  () => agent(ULTRA + `ROLLE Copywriter. FINAL DE-Copy je Priority-Page unter ${OUT}/06-seiten/<slug>.md.
Nur belegbare Claims. Kein Lorem.`, {
    label: 'copy-draft', phase: 'Copy', agentType: 'kimi-worker', schema: TEXT,
  }),
  () => agent(ULTRA + `ROLLE Humanizer. Alle 06-seiten/* entfloskeln, FINAL markieren.`, {
    label: 'copy-humanizer', phase: 'Copy', agentType: 'opus-builder', schema: TEXT,
  }),
])

phase('Specs')
await agent(ULTRA + `ROLLE Section-Specs.
In 06-seiten/* Specs ergänzen (Layout, Buttons/Hover-Vision, Icons, Motion, Assets, Mockup-Brief-Felder).`, {
  label: 'specs', phase: 'Specs', agentType: 'luna-worker', schema: TEXT,
})

phase('Design')
const des = await agent(ULTRA + `ROLLE Design-Richtungen.
GENAU 3 Richtungen A/B/C + Mockup-Briefs (1 Bild/Sektion, exact copy) nach ${OUT}/09-mockups/briefs.md
und markdown in Return. Kein finales Brand-Polish erzwingen.`, {
  label: 'design-variants', phase: 'Design', agentType: 'kimi-worker', schema: VARIANTS,
})

return {
  gate: 'G-DESIGN',
  status: 'AWAITING_USER',
  recommendation: des && des.recommendation,
  options: des && des.options,
  message: 'G-DESIGN STOP: Raphael wählt Richtung und macht Mockups mit. Danach website-plan-close Workflow.',
  out_dir: OUT,
}
