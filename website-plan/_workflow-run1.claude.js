/**
 * KANONISCHES website-plan Workflow-Script (Claude-Host).
 * VERSION: 2.0.0 — Session-Lektionen 2026-08-11:
 * - Kein freestyle Script erfinden (BRAUN/Sorglos-Falle)
 * - Nur Platzhalter MISSION_* setzen, Rest unverändert lassen
 * - meta.name MUSS mit "website-plan" beginnen
 * - Nie Fable als agentType; Cockpit Ultracode/max separat
 * - G-IA und G-DESIGN: Workflow STOP mit klarer Nachricht (kein stilles Defaulten)
 * - Keine Fake-Reviews/Proofs auch wenn User das will
 *
 * Start: Workflow-Tool mit diesem Script (Inhalt aus Datei lesen + MISSION füllen).
 * Vor Start optional: validate-workflow.py wenn verfügbar.
 */
export const meta = {
  name: 'website-plan',
  description: 'Kanonischer Website-Plan: Research→Assets→SEO/AEO→G-IA→Copy→Specs→G-DESIGN→Close',
  phases: [
    { title: 'Intake', detail: '00-meta-plan + open questions' },
    { title: 'Research', detail: 'Firma + Reach + Critic parallel' },
    { title: 'Assets', detail: 'Inventar + Gaps' },
    { title: 'SEO', detail: 'Audit/Plan + Critics' },
    { title: 'IA', detail: '3 Varianten + G-IA STOP' },
    { title: 'Copy', detail: 'Final copy + humanizer' },
    { title: 'Specs', detail: 'Section specs' },
    { title: 'Design', detail: '3 Richtungen + briefs + G-DESIGN STOP' },
    { title: 'Close', detail: 'Design-system, components, roadmap, final critic' },
  ],
}

// ========== NUR DIESE BLOCKE ANPASSEN ==========
const OUT = '/root/clients/salsaflow-dc/website-plan'           // z.B. /root/.../website-plan
const REPO = '/root/clients/salsaflow-dc'         // Repo-Pfad oder ''
const LIVE_URL = 'https://www.salsaflow-dc.com/'     // URL oder ''
const FIRMA = 'Salsaflow Dance Company (Salsa Flow Basel)'
const REPO_STAND = 'MITNUTZEN' // MITNUTZEN | IGNORIEREN
const ASSET_DIRS = '/root/clients/salsaflow-dc/public, /root/clients/salsaflow-dc/src, Live-Fotos: https://www.salsaflow-dc.com/fotos-1/, Live-Root: https://www.salsaflow-dc.com/' // Pfade komma-getrennt
const SCOPE = 'FULL' // FULL | oder explizit von Raphael: z.B. "NUR_BILDER_SEKTIONEN"
const OVERRIDES = 'LOCKED DESIGN.md v2: ink #0a0a0a, salsa #ad1827 only accent, display Cal Sans, body Afacad, banned Inter/Poppins/etc; warm familiär Community Du; motion data-reveal stagger; rounded-full buttons. DECISIONS.md + ARCHITEKTUR.md gelten als Frozen Rules für Backend/Booking/Payments — lesen, nicht brechen. Auftrag Raphael: (1) Live-Site + aktuelle Vercel-Site hart kritisieren, basierend auf Screenshots (Browser/CDP). (2) Alle Bilder Alt-Texten; Asset-Audit Live vs Repo; Live /fotos-1/ ist Bild-Quelle der Wahrheit (Qualität); Privatstunden-Bilder auf Vercel-Repo-Seite sind schlecht/low-res — ersetzen. (3) Layout-Logik + Backend-Anfrage/Booking-Flow im Plan erklären (nicht Code bauen). (4) SEO/AEO geil, IA übersichtlich. (5) Kein Production-Code. Extra-URL-Fotos: https://www.salsaflow-dc.com/fotos-1/' // DESIGN.md / DECISIONS Pfade + Frozen Rules, kurz
// ===============================================

if (OUT.includes('MISS:') || FIRMA.includes('MISS:')) {
  throw new Error('MISSION Platzhalter nicht gesetzt (OUT/FIRMA/…). Skill-Template falsch benutzt.')
}

const ULTRA = `Long-horizon ultracode session. Human may step away between gates.
Do not stop early. Complete artifacts for your role. PLANNING ONLY — no app/ code edits.
Spawn no nested agents; only this workflow starts agents.
Claims: only belegbare Facts. NEVER invent reviews, ratings, #1, Zertifikate, Kundenstimmen.
If user asked to fake proof: refuse, plan structure/slots instead and mark PLACEHOLDER.
Language: German. OUT=${OUT} REPO=${REPO} LIVE=${LIVE_URL} FIRMA=${FIRMA} REPO_STAND=${REPO_STAND}
ASSET_DIRS=${ASSET_DIRS} SCOPE=${SCOPE}
OVERRIDES: ${OVERRIDES}
`

const TEXT = {
  type: 'object', required: ['summary', 'paths_written'],
  properties: {
    summary: { type: 'string' },
    paths_written: { type: 'array', items: { type: 'string' } },
    open_questions: { type: 'array', items: { type: 'string' } },
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

function mustWrite(pathHint) {
  return `Schreibe Dateien unter ${OUT}/. Pfade in paths_written. summary auf Deutsch.`
}

// ----- SCOPE: FULL vs eng -----
// Bei SCOPE !== 'FULL' trotzdem Workflow — aber nur erlaubte Deliverables.
// Parent muss SCOPE-DELTA in 00-meta-plan.md und 12-verbote dokumentieren.
const isFull = SCOPE === 'FULL' || SCOPE === ''

// ========== INTAKE ==========
phase('Intake')
await agent(ULTRA + `ROLLE Meta-Planner.
Schreibe ${OUT}/00-meta-plan.md: Quellen, Deliverable-Liste, Phasen, Gates G-IA/G-DESIGN,
Rollen-Wellen (ohne feste Worker-Pflichtnamen), DoD, SCOPE=${SCOPE} und was bewusst OUT-OF-SCOPE ist.
Schreibe ${OUT}/11-open-questions.md Skelett.
${mustWrite()}`, {
  label: 'meta-plan', phase: 'Intake',
  agentType: 'luna-worker', effort: 'low', schema: TEXT,
})

// ========== RESEARCH ==========
phase('Research')
const research = await parallel([
  () => agent(ULTRA + `ROLLE Research-Lead (Firma/Markt/SERP).
WebSearch/WebFetch. Live-URL nur EINE Quelle. Proof-Inventar (belegbar vs ungeprüft).
Datei ${OUT}/01-firma-dossier.md. ${mustWrite()}`, {
    label: 'research-company', phase: 'Research',
    agentType: 'grok-worker', schema: TEXT,
  }),
  () => agent(ULTRA + `ROLLE Reach/Social/GBP/Maps.
Prüfe Socials + GBP/Maps-Signale; fehlende Kanäle = "nicht vorhanden".
Datei ${OUT}/01b-online-praesenz.md. ${mustWrite()}`, {
    label: 'research-reach', phase: 'Research',
    agentType: 'kimi-worker', schema: TEXT,
  }),
  () => agent(ULTRA + `ROLLE Research-Critic (andere Familie, adversarial).
Lies Dossier/Reach falls da; greife Lücken/Proof-Risiken an.
Datei ${OUT}/01c-research-critic.md. ${mustWrite()}`, {
    label: 'research-critic', phase: 'Research',
    agentType: 'sol-pruefer', schema: TEXT,
  }),
])
log('research done: ' + research.filter(Boolean).length)

// ========== ASSETS ==========
phase('Assets')
await agent(ULTRA + `ROLLE Asset-Inventar.
Sichte ASSET_DIRS und Repo-Medien. Pro Bild: Beschreibung, Alt-Text-Vorschlag, Einsatz.
Wollen-vor-Haben + Gap-Matrix.
Dateien ${OUT}/02-asset-inventar.md und ${OUT}/02b-asset-gaps.md.
Web-Assets speichern erlaubt, Lizenz später. ${mustWrite()}`, {
  label: 'assets', phase: 'Assets',
  agentType: 'opus-builder', schema: TEXT,
})

if (isFull) {
  // ========== SEO ==========
  phase('SEO')
  await agent(ULTRA + `ROLLE SEO-Draft.
${LIVE_URL ? `Audit Live → ${OUT}/03-seo-audit.md.` : 'Kein Live-Audit (keine URL).'}
Voller ${OUT}/04-seo-plan.md (Keyword→URL, Tech, On-Page, Internal Links, Local oder N/A,
E-E-A-T, Schema, CWV, PFLICHT AEO/AI-Search, Analytics, P0/P1/P2, Verbote).
SEO-Data-API wenn verfügbar, sonst Schätzungen KENNZEICHNEN. ${mustWrite()}`, {
    label: 'seo-draft', phase: 'SEO',
    agentType: 'opus-builder', effort: 'high', schema: TEXT,
  })
  await parallel([
    () => agent(ULTRA + `ROLLE SEO-Critic adversarial.
Lies 04-seo-plan (+03). Cannibalization, Intent, AEO, Doorways.
Datei ${OUT}/04b-seo-critic.md. ${mustWrite()}`, {
      label: 'seo-critic', phase: 'SEO',
      agentType: 'kimi-recherche', schema: TEXT,
    }),
    () => agent(ULTRA + `ROLLE Growth-Critic.
Killt SEO die Conversion? CTA-Modell?
Datei ${OUT}/04c-growth-critic.md. ${mustWrite()}`, {
      label: 'growth-critic', phase: 'SEO',
      agentType: 'grok-worker', schema: TEXT,
    }),
  ])

  // ========== IA + G-IA STOP ==========
  phase('IA')
  await parallel([
    () => agent(ULTRA + `ROLLE IA-Worker A.
Zwei echte Sitemap/Sektions-Alternativen → ${OUT}/05-ia-entwurf-a.md. ${mustWrite()}`, {
      label: 'ia-a', phase: 'IA', agentType: 'kimi-worker', schema: TEXT,
    }),
    () => agent(ULTRA + `ROLLE IA-Worker B (andere Familie).
Zwei andere Alternativen → ${OUT}/05-ia-entwurf-b.md. ${mustWrite()}`, {
      label: 'ia-b', phase: 'IA', agentType: 'opus-builder', schema: TEXT,
    }),
  ])
  const ia = await agent(ULTRA + `ROLLE IA-Judge.
Forme GENAU 3 Optionen A/B/C (keine Schein-Varianten). Empfehlung.
Schreibe ${OUT}/05-ia-variants.md mit voller Ausarbeitung.
Return recommendation + options + markdown.`, {
    label: 'ia-judge', phase: 'IA',
    agentType: 'sol-pruefer', effort: 'high', schema: VARIANTS,
  })
  // HARD STOP — Parent muss Raphael fragen und Lauf 2 starten (oder resume)
  return {
    gate: 'G-IA',
    status: 'AWAITING_USER',
    recommendation: ia && ia.recommendation,
    options: ia && ia.options,
    message: 'G-IA STOP: Raphael wählt A/B/C (oder Mix). Danach Workflow FORTSETZEN mit SCOPE=FULL_AFTER_GIA und gewählter Variante in OVERRIDES. Nicht defaulten.',
    out_dir: OUT,
  }
}

// Enger Scope (z.B. nur Bilder/Sektionen): Duell statt vollem SEO/IA
phase('IA')
const duel = await parallel([
  () => agent(ULTRA + `ROLLE Konzept-Worker A (eng SCOPE=${SCOPE}).
Voller Plan für erlaubten Scope (Bilder/Sektionen/Layouts). Datei ${OUT}/duell/vorschlag-a.md. ${mustWrite()}`, {
    label: 'duel-a', phase: 'IA', agentType: 'kimi-worker', schema: TEXT,
  }),
  () => agent(ULTRA + `ROLLE Konzept-Worker B. Datei ${OUT}/duell/vorschlag-b.md. ${mustWrite()}`, {
    label: 'duel-b', phase: 'IA', agentType: 'opus-builder', schema: TEXT,
  }),
  () => agent(ULTRA + `ROLLE Konzept-Worker C. Datei ${OUT}/duell/vorschlag-c.md. ${mustWrite()}`, {
    label: 'duel-c', phase: 'IA', agentType: 'grok-worker', schema: TEXT,
  }),
])
const judge = await agent(ULTRA + `ROLLE Judge. Ranking + Sieger + was geklaut wird.
Datei ${OUT}/03-sektionen-layout-plan.md (oder scope-passender Name). ${mustWrite()}`, {
  label: 'duel-judge', phase: 'IA', agentType: 'sol-pruefer', schema: TEXT,
})
return {
  gate: 'SCOPE_NARROW_DONE',
  status: 'COMPLETE_NARROW',
  message: 'Enger SCOPE fertig. Für FULL-Plan neuen website-plan Lauf mit SCOPE=FULL starten.',
  out_dir: OUT,
  duel_ok: duel.filter(Boolean).length,
  judge: !!judge,
}

// HINWEIS: Phasen Copy/Specs/Design/Close laufen in website-plan-after-gia.js
// nach G-IA-Freigabe (siehe Skill AUTO-START Lauf 2).
