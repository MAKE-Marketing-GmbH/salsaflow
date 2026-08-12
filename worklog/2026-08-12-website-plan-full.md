# Worklog — 2026-08-12 website-plan FULL

## Was

Vollständiger Website-**Plan** (kein Production-Code) für Salsaflow Dance Company / Salsa Flow Basel.

## Wie

1. Skill `website-plan` Kanon, 3 Claude-Workflows:
   - Lauf 1 `wf_c3729fb9-2f4` → Gate G-IA
   - Lauf 2 `wf_bc3d758d-083` → Gate G-DESIGN
   - Lauf 3 `wf_29643fc6-3fa` → COMPLETE
2. User-Gates:
   - IA: Kunden-Baseline („so wie bisher / Eingang“)
   - Design: A Warme Bühne
3. Screenshots Live (Jimdo) + Vercel; Assets/SEO/IA/Copy/Design/Roadmap/Critic.
4. sol-pruefer write-only: Final-Critic aus Journal recovered → `website-plan/13-final-critic.md`.
5. Dual-Index: `06-seiten/_index.md` mit ÜBERHOLT-Kopf.

## Ergebnis

- Ordner: `/root/clients/salsaflow-dc/website-plan/`
- Skill-DoD: PASS (Dateien)
- Critic: FAIL (4 Blocker — v. a. Supabase-Konflikt, Redirect-Matrix, dual Specs, Meta-Alias-Namen)

## Nicht getan

- Production `app/`/`components/` Code
- DNS Cutover
- Mockup-Pixel-Renders (nur Briefs)
- Push zu origin (braucht Raphael-Wort)

## Fallen

- www ≠ Vercel-Alias-Wahrheit: Traffic noch Jimdo trotz Vercel-Domain-Liste.
- Headless Vercel-Home oft weißer Hero — Layout/LCP-Bug, nicht „kein Design“.
- Privatstunden: falsches Motiv (weiches Paar-Foto), nicht nur Kompression.
- Fable nicht als workflow agentType; i-have-adhd nur per User-Slash startbar.
