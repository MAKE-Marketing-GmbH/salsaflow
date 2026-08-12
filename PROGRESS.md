# PROGRESS — Salsaflow DC

**Stand:** 2026-08-12  
**Session:** website-plan FULL (COMPLETE)  
**Handoff-ready:** ja

## ERLEDIGT

- Skill **website-plan** FULL durchgezogen (3 Claude-Workflow-Läufe, Run-IDs unten).
- **G-IA** entschieden: Kunden-Baseline (Eingang-DOCX), A-artig.
- **G-DESIGN** entschieden: **A — Warme Bühne**.
- Plan-Paket unter [`website-plan/`](website-plan/) (Skill-DoD-Dateien + Screenshots/Evidence).
- Dual-Seiten-Index: unnummerierte Specs als **ÜBERHOLT** markiert; kanon = nummeriert (`06-seiten/00-index.md` + `01-*.md`).
- DoD-Status: [`website-plan/00-dod-status.md`](website-plan/00-dod-status.md).
- Final-Critic recovered: [`website-plan/13-final-critic.md`](website-plan/13-final-critic.md) — Verdict **FAIL** (Blocker vor Bau).
- ADHD-Skill installiert (User muss `/i-have-adhd` tippen; `disable-model-invocation`).

## OFFEN (WIP=1)

**Nächster Task:** Plan-Blocker schließen **oder** auf Raphaels Wort **Bau** starten.

Empfohlene Reihenfolge vor Production-Code:

1. Backend-Vertrag: **Supabase ja/nein** (DECISIONS vs ARCHITEKTUR) einmal entscheiden und Docs angleichen.
2. Ausführbare **301-Redirect-Matrix** (Jimdo-Live → neue URLs) als Datei im Plan.
3. Spec-Cleanup: unnummerierte `06-seiten/*.md` entfernen oder nur nummeriert behalten.
4. P0 Assets/Claims: Privatstunden-Motiv, Hero first paint, „Gratis“-Claim-Proof.

## Gates

| Gate | Status |
|---|---|
| G-IA | **ENTSCHIEDEN** — Kunden-Baseline / A-artig |
| G-DESIGN | **ENTSCHIEDEN** — A Warme Bühne |
| website-plan Skill-DoD | **PASS** (Dateien) |
| Final Critic | **FAIL** (4 Blocker — siehe `13-final-critic.md`) |
| Production-Code (Skill) | **nicht gestartet** (MUSS-NICHT im website-plan) |
| DNS Cutover Jimdo→Vercel | **offen** (www noch Jimdo) |

## Run-IDs

| Lauf | Run-ID | Ende |
|---|---|---|
| 1 | `wf_c3729fb9-2f4` | G-IA |
| 2 | `wf_bc3d758d-083` | G-DESIGN prep |
| 3 | `wf_29643fc6-3fa` | COMPLETE |

## Hosting-Fakt

- Live: `https://www.salsaflow-dc.com/` = **Jimdo**
- Neu: `https://salsaflow-dc.vercel.app/`
- Belege: `website-plan/screenshots/`, `_parent-screenshot-notes.md`

## Uncommitted / nicht Teil dieses Handoffs

- `package.json` (dirty, nicht website-plan)
- `scripts/build-prod.mjs`, `scripts/build-thread-caps*.mjs` (untracked, fremd zur Session)
- `.claude/` (lokal)

## Nächster Schritt (1 Zeile)

Lies [`website-plan/00-dod-status.md`](website-plan/00-dod-status.md) + [`website-plan/13-final-critic.md`](website-plan/13-final-critic.md); bei „Bau“ → Worktree von `main`, Specs aus `06-seiten/0N-*.md` + Design A; bei „Blocker“ → Redirect-Matrix + Supabase-Entscheid zuerst.
