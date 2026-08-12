# PROGRESS — Salsaflow DC

**Stand:** 2026-08-12 (Session 2: Aufräum-Lauf 4 + Runde-2-Nachträge)
**Session:** website-plan Aufräumen/Copy-Final (COMPLETE)
**Handoff-ready:** ja

## ERLEDIGT

- Skill **website-plan** FULL (Läufe 1–3) + **Aufräum-Lauf 4** `wf_b1cc7e53-90f` (20 Agents: Kimi-Research, Opus-Copy, Sol-Critics, Luna-Mechanik, Grok-Redirect, Visual-Kritiker) + Parent-Runde 2.
- **G-IA** Kunden-Baseline · **G-DESIGN** A Warme Bühne (unverändert).
- **Alle 4 Final-Critic-Blocker GESCHLOSSEN** (Beleg: [`website-plan/13-final-critic.md`](website-plan/13-final-critic.md) Re-Verdict + Runde-2-Tabelle):
  1. Supabase-Konflikt: Drizzle + PGlite (dev) gilt; [`ARCHITEKTUR.md`](ARCHITEKTUR.md) Supabase-Teil in End-Anhang „NICHT AUSFÜHREN", Hauptteil neutralisiert (0 operative Treffer).
  2. Meta-Alias-Mapping in [`website-plan/00-meta-plan.md`](website-plan/00-meta-plan.md).
  3. Spec-Kanon: nur `06-seiten/0N-*.md`; 19 unnummerierte = ÜBERHOLT-Stubs; `_recover-*`/Workflow-Skripte in `website-plan/_archiv/`.
  4. [`website-plan/14-redirect-matrix.md`](website-plan/14-redirect-matrix.md): 33 Quellen, Abnahme-Loop 67 Zeilen = alle 65 vercel.json-Varianten, 0 fehlend; `/events/*`-Ziele als Cutover-only markiert.
- **Copy v2 SEO-final auf allen 13 Seiten** ([`06-seiten/`](website-plan/06-seiten/)): Keyword in Title/H1/Lead, vollständige Sektions-Copy, Home Sektion 2 mit H2 „Finde deinen Tanzkurs in Basel." + definierter Kursplan-Vorschau, unbelegte Claims raus (Gehzeiten/„zwei Häuser", Abo, Mengen, Rollen-Alt-Texte, „schnellster Weg", 24h-Verrechnung → PRIV-04).
- [`05b-copy-style.md`](website-plan/05b-copy-style.md) **FINAL v2** (Referenz-Analyse specialelements/fromm/kcdance + elephantsolar/enpal/priwatt nur sprachlich; SEO-Schreibregeln; Slop-Verbotsliste) + [`04d-seo-konkurrenz.md`](website-plan/04d-seo-konkurrenz.md) neu (10 Massnahmen).
- **Screenshots neu:** [`screenshots/2026-08-12/`](website-plan/screenshots/2026-08-12/) 24/24 abgenommen ([`09-mockups/screenshot-abnahme-2026-08-12.md`](website-plan/09-mockups/screenshot-abnahme-2026-08-12.md)); alte Sätze in `screenshots/_alt/`. Methode: reduced-motion + Scroll + Bild-Wait; Live-Pfade korrigiert (`/kurse/privatstunden/`, `/kurse/`).
- [`02b-asset-gaps.md`](website-plan/02b-asset-gaps.md) v2: Shot-Liste 8 Motive (P0: echte Privatstunde), OG-Spec, Grafik-Assets.
- Mobbin-MCP per `claude mcp add` registriert (lädt erst in neuer Session).
- Commits: `a26a864` → **`6089a24`** (lokal).

## OFFEN (WIP=1)

**Nächster Task:** Auf Raphaels Wort **„Bau"** starten — Plan braucht nichts mehr.

Parallel/beim Bau (keine Plan-Blocker):
- Owner-Entscheide: GUT-01 (Gutschein), PRIV-01–04, R-01 (EN), Prod-DB-Hosting.
- P0-Asset: Privatstunden-Shooting (Shot-Liste S-01).
- Event-Routen `/events/*` entstehen im Bau → dann Cutover-Zeilen der Redirect-Matrix abnehmen.

## Gates

| Gate | Status |
|---|---|
| G-IA | **ENTSCHIEDEN** — Kunden-Baseline / A-artig |
| G-DESIGN | **ENTSCHIEDEN** — A Warme Bühne |
| website-plan Skill-DoD | **PASS** ([`00-dod-status.md`](website-plan/00-dod-status.md)) |
| Final Critic Blocker 1–4 | **GESCHLOSSEN** (Lauf 4 + Runde 2) |
| Production-Code | **nicht gestartet** — wartet auf „Bau" |
| DNS Cutover Jimdo→Vercel | **offen** (www noch Jimdo; erst nach Bau + Redirects) |

## Run-IDs

| Lauf | Run-ID | Ende |
|---|---|---|
| 1 | `wf_c3729fb9-2f4` | G-IA |
| 2 | `wf_bc3d758d-083` | G-DESIGN prep |
| 3 | `wf_29643fc6-3fa` | COMPLETE (Critic FAIL) |
| 4 | `wf_b1cc7e53-90f` | COMPLETE (Blocker zu, Copy v2, Screenshots) |

## Hosting-Fakt

- Live: `https://www.salsaflow-dc.com/` = **Jimdo** (Nav zeigt inzwischen „Anniversary Weekend 2027" — Matrix bei Cutover gegenchecken)
- Neu: `https://salsaflow-dc.vercel.app/`
- Live-Jimdo-Pfade: Privatstunden = `/kurse/privatstunden/`, Kurse = `/kurse/`

## Uncommitted / nicht Teil dieses Handoffs

- `package.json` (dirty, fremd — NICHT committen)
- Root-eigene Dateien fremder/paralleler Session (für diese Session unlesbar, nicht angefasst): `website-plan/06-seiten/14-fehlende-oeffentliche-routen.md`, `06-seiten/route-manifest.tsv`, `09-mockups/generated/`, `09-mockups/*-manifest*`, `09-mockups/gpt-prompts.md`, `09-mockups/capture-preview.cjs`
- **Kein Push:** origin = GitHub mit Vercel-Kopplung → Push wäre faktisch Deploy; Push nur auf Raphaels Wort.

## Nächster Schritt (1 Zeile)

Bei „Bau": EnterWorktree von `main` → [`website-plan/HANDOFF.md`](website-plan/HANDOFF.md) lesen → Specs NUR `06-seiten/0N-*.md`, Design A + `DESIGN.md`, Redirects aus `14-redirect-matrix.md`.
