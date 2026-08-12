# HANDOFF — Salsaflow DC website-plan — 2026-08-12 — Session website-plan

## Auftrag (1 Satz)

Website-**Plan** FULL (IA, SEO/AEO, Copy, Design, Backend-Logik) ohne Production-Code — Pack unter `website-plan/`.

## Stand

- **ERLEDIGT:** 3 Workflow-Läufe COMPLETE; G-IA = Kunden-Baseline; G-DESIGN = A Warme Bühne; Skill-DoD-Dateien da; Critic recovered (FAIL); DoD-Status + PROGRESS/DECISIONS/worklog geschrieben.
- **OFFEN (WIP=1):** Vor Bau: Supabase-Konflikt + 301-Matrix + Spec-Kanon bereinigen — **oder** Raphael sagt „Bau“.
- **Gates:** G-IA grün · G-DESIGN grün · Critic rot · Ship nicht freigegeben.

## Nächster Schritt (exakt, sofort startbar)

1. Lies [`00-dod-status.md`](./00-dod-status.md) und [`13-final-critic.md`](./13-final-critic.md).
2. Wenn **Bau:** `EnterWorktree` von `main`, Specs nur aus [`06-seiten/00-index.md`](./06-seiten/00-index.md) + nummerierte `0N-*.md`, Design aus [`07-design-system-plan.md`](./07-design-system-plan.md) + DESIGN.md (Cal Sans / Afacad / salsa `#ad1827`), Roadmap [`10-roadmap.md`](./10-roadmap.md).
3. Wenn **Blocker zuerst:** eine Datei `14-redirect-matrix.md` (alle Live-URLs → Ziel 301) + DECISIONS/ARCHITEKTUR auf **ein** Backend (Drizzle-only vs Supabase) angleichen.

## Entscheidungen (warum)

- IA Kunden-Baseline → Raphael: so wollten sie es; stabile URLs/SEO.
- Design A → Raphael wählte „Warme Bühne“ (Empfehlung).
- Kein Code im Skill → website-plan MUSS-NICHT.
- Header-CTA ohne „Gratis“ bis Proof → Claim-Risiko P0.

## Kontext-Pfade

- Repo: `/root/clients/salsaflow-dc`
- Plan: `/root/clients/salsaflow-dc/website-plan/`
- Eingang: `/root/clients/salsaflow-dc/docs/bilder/redesign-2026-08/eingang/`
- DESIGN/DECISIONS: Repo-Root
- Live Jimdo: `https://www.salsaflow-dc.com/`
- Neu: `https://salsaflow-dc.vercel.app/`
- Run-IDs: `wf_c3729fb9-2f4`, `wf_bc3d758d-083`, `wf_29643fc6-3fa`

## Fallen & Sackgassen

- **Nicht** IA-B Funnel oder `/schule`/`/nights` neu erfinden — verworfen.
- **Nicht** unnummerierte `06-seiten/home.md` etc. bauen — ÜBERHOLT; kanon nummeriert.
- **Nicht** beide Backend-Verträge gleichzeitig bauen (DECISIONS Kein Supabase vs ARCHITEKTUR Supabase).
- **Nicht** www als Vercel-Live behandeln — noch Jimdo.
- **Nicht** Privatstunden mit altem weichem Paar-Motiv lassen.
- sol-pruefer kann oft nicht schreiben → Critic/Recover aus Journal.
- i-have-adhd: nur User tippt `/i-have-adhd`.
- package.json + scripts/build-* in Working Tree sind **nicht** Teil dieses Plans — nicht blind mitcommitten.
