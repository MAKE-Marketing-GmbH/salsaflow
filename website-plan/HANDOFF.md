# HANDOFF — Salsaflow DC website-plan — 2026-08-12 (nach Aufräum-Lauf 4)

## Auftrag
Website-Plan FULL ohne Production-Code. Pack unter website-plan/.

## Stand
- ERLEDIGT: 4 Workflows COMPLETE (`wf_c3729fb9` → `wf_bc3d758d` → `wf_29643fc6` → `wf_b1cc7e53`).
- Alle 4 Critic-Blocker GESCHLOSSEN (Supabase-Konflikt, Alias-Mapping, Spec-Kanon, Redirect-Matrix + Loop).
- Copy v2 SEO-final auf allen 13 Seiten (05b-copy-style FINAL v2, 04d-seo-konkurrenz neu).
- Screenshots 2026-08-12: 24/24 abgenommen (alte Sätze in screenshots/_alt/).
- Gates: G-IA grün · G-DESIGN grün (A Warme Bühne) · Blocker grün · Ship = auf Raphaels „Bau".

## Nächster Schritt
1. Lies 00-dod-status.md + 13-final-critic.md (Re-Verdict + Runde-2-Tabelle).
2. „Bau" → EnterWorktree von main; Specs NUR 06-seiten/0N-*.md; Design A + DESIGN.md; Redirects nach 14-redirect-matrix.md (vercel.json-Snippet dort).
3. Offene Owner-Entscheide bei Raphael: GUT-01, PRIV-01–04, R-01 (EN), Prod-DB-Hosting. P0-Asset: Privatstunden-Shooting (02b-asset-gaps S-01).

## Entscheidungen
- IA: Kunden-DOCX Baseline · Design: A Warme Bühne · CTA: „Probestunde anfragen" bis Gratis-Proof.
- Backend: Drizzle + PGlite (dev), KEIN Supabase (ARCHITEKTUR-Anhang = Historie, nicht ausführen), Prod-DB offen.
- www = Jimdo live; Neu = salsaflow-dc.vercel.app; Fallback unbekannter Pfade = 404, kein 301 auf /.

## Fallen
- Unnummerierte 06-seiten/*.md sind ÜBERHOLT-Stubs — nie bauen.
- ARCHITEKTUR-Anhang „NICHT AUSFÜHREN" — keine Supabase-Zeile umsetzen.
- Event-Routen /events/* existieren erst nach Bau → Cutover-Zeilen der Redirect-Matrix erst dann abnehmbar.
- package.json + scripts/build-* nicht mitcommitten (fremd).
- Live-Jimdo-Pfade: Privatstunden = /kurse/privatstunden/, Kurse = /kurse/ (nicht /privatstunden).
