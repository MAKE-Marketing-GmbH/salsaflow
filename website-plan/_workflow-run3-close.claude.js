/**
 * website-plan Lauf 3 — nach G-DESIGN (Claude). VERSION 2.0.0
 */
export const meta = {
  name: 'website-plan-close',
  description: 'Design-system, component map, roadmap, final critic',
  phases: [
    { title: 'Close', detail: '07/08/10/12 + final critic' },
  ],
}

const OUT = '/root/clients/salsaflow-dc/website-plan'
const REPO = '/root/clients/salsaflow-dc'
const DESIGN_CHOICE = 'A — Warme Bühne (Raphael 2026-08-12): Bleed-Hero Studio-Foto, roter Kant-Marker, Text links warm, bg-soft Editorial darunter. Cal Sans/Afacad, salsa #ad1827. B und C verworfen (C nur Fallback-Hinweis in 12). Kunden-IA Baseline bleibt. Asset-P0 Privatstunden-Motiv. Screenshots + 09-mockups/briefs.md beachten.'
const REPO_STAND = 'MITNUTZEN'

if (OUT.includes('MISS:') || DESIGN_CHOICE.includes('MISS:')) {
  throw new Error('Platzhalter setzen')
}

const ULTRA = `Long-horizon ultracode. PLAN only. OUT=${OUT} REPO=${REPO} DESIGN=${DESIGN_CHOICE} REPO_STAND=${REPO_STAND}`
const TEXT = {
  type: 'object', required: ['summary', 'paths_written'],
  properties: {
    summary: { type: 'string' },
    paths_written: { type: 'array', items: { type: 'string' } },
  },
}

phase('Close')
await parallel([
  () => agent(ULTRA + `ROLLE Design-System-Plan → ${OUT}/07-design-system-plan.md
(Farben, Adobe Fonts first, Type, Spacing-Ideen, Button-States/Hover-Vision, Header, Motion, Icons).`, {
    label: 'design-system', phase: 'Close', agentType: 'opus-builder', schema: TEXT,
  }),
  () => agent(ULTRA + `ROLLE Component-Map → ${OUT}/08-component-map.md
Repo scannen wenn MITNUTZEN; Library nur Inspiration, kein Dump.`, {
    label: 'components', phase: 'Close', agentType: 'luna-worker', schema: TEXT,
  }),
  () => agent(ULTRA + `ROLLE Roadmap → ${OUT}/10-roadmap.md und ${OUT}/12-verbote-und-gates.md
G-IA/G-DESIGN Entscheidungen dokumentieren. 11-open-questions updaten.`, {
    label: 'roadmap', phase: 'Close', agentType: 'grok-worker', schema: TEXT,
  }),
])
await agent(ULTRA + `ROLLE Final-Critic adversarial auf gesamtes ${OUT}/.
Datei ${OUT}/13-final-critic.md — fehlende DoD-Punkte, schwache Specs.`, {
  label: 'final-critic', phase: 'Close', agentType: 'sol-pruefer', schema: TEXT,
})

return { status: 'COMPLETE', out_dir: OUT, gate: null }
