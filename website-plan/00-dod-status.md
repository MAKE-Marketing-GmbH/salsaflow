# DoD-Status (Skill FULL)

**Stand:** 2026-08-12 · nach Aufräum-Lauf 4 (`wf_b1cc7e53-90f`) + Runde-2-Nachträge
**Run-IDs:** `wf_c3729fb9-2f4` → `wf_bc3d758d-083` → `wf_29643fc6-3fa` → `wf_b1cc7e53-90f`

## Gates

| Gate | Entscheidung |
|---|---|
| G-IA | Kunden-Baseline (A-artig), aus Eingang-DOCX |
| G-DESIGN | **A — Warme Bühne** |

## Skill-DoD

| Check | Status |
|---|---|
| Research `00`–`02*` | PASS (`02b-asset-gaps` v2 mit Shot-Liste) |
| SEO `03`+`04` (+AEO) | PASS (+ `04d-seo-konkurrenz.md` neu) |
| G-IA + `05-sitemap-ia` + `05b-copy-style` | PASS (`05b` FINAL v2: Stil-Regeln aus Referenz-Analyse, SEO-Schreibregeln, Slop-Verbotsliste) |
| `06-seiten/` kanonisch | PASS — nur `0N-*.md`; 19 unnummerierte = ÜBERHOLT-Stubs. Copy v2 auf allen 13 Seiten; unbelegte Claims entfernt (Lauf-4-Critic + Runde 2) |
| Screenshots | PASS — `screenshots/2026-08-12/` 24/24 abgenommen (`09-mockups/screenshot-abnahme-2026-08-12.md`) |
| G-DESIGN + `09-mockups` Briefs | PASS (Mockup-Renders weiterhin optional) |
| `07` `08` `10` `12` `13` `14` | PASS — `14-redirect-matrix.md` neu: 33 Quellen, Loop 67 Zeilen = alle 65 vercel.json-Varianten, 0 fehlend |
| Critic-Blocker 1–4 (Lauf 3) | **ALLE GESCHLOSSEN** (Beleg: `13-final-critic.md` Re-Verdict + Runde-2-Tabelle) |

## Offen (nicht Plan-schliessbar)

1. **Owner-Entscheide:** GUT-01, PRIV-01–PRIV-04, R-01 (EN), TK-Rest — liegen bei Raphael/Kunde.
2. **Bau-abhängig:** Event-Routen `/events/*` erst in der Bauwelle → erst dann Cutover-Abnahme der markierten Redirect-Zeilen.
3. **P0-Asset:** echtes Privatstunden-Motiv (Shooting, `02b-asset-gaps.md` S-01); bis dahin neutrale Paar-Semantik.
4. DNS: www = Jimdo; Cutover erst nach Bau + Redirects.

## Ship-Gate

Plan-Paket ist bau-bereit. **Bauwelle startet nur auf Raphaels „Bau"** (dann: EnterWorktree von `main`, Specs nur `06-seiten/0N-*.md`, Design A, `DESIGN.md`).
