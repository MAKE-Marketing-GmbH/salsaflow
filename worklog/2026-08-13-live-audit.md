# Worklog — 2026-08-13 Live-Audit

## Was

Live-Site logisch und visuell geprüft. Belegte Fixes auf `main`. Production deployed.

## Commits

- `e7c5e91` — ein Kontakt-Pfad, 5 Hero-Crops (vorher schon live).
- `659f53c` — Wizard im Fold, Hashes, Crops, Sticky-CTA, Reuse.

## Deploy

- Git-Push `origin/main` → Vercel Production Ready.
- `dpl_9CFwXRj3sfxfF42CCTCpCAuHB1cS`
- Alias: https://salsaflow-dc.vercel.app/ HTTP 200.

## Sweeps

- Live-r1: `/tmp/salsaflow-live-r1/`
- Fix-r2: `/tmp/salsaflow-fix-r2/`
- Fix-r3: `/tmp/salsaflow-fix-r3/`
- Fix-r4 Floweekend nach `dense`: `/tmp/salsaflow-fix-r4/` — Fold gelesen, Köpfe ganz.

## Fallen

- Shell-CWD fällt oft auf `/root/clients/salsaflow-dc`. Immer `cd /root/clients/salsaflow`.
- Extra-Worktree nicht Wahrheit. Raphael: nur dieser Checkout.
- `npm run dev:web` Default-Cache EACCES. Nur lokale Extra-Config.
- `vercel --prod` lokal: EACCES auf `website-plan/09-mockups/generated`. Push statt CLI.
- Grok-xAI 401 (`auth_kind=none`). PNG selbst lesen, nicht retryen.
- Shot-Sweep: nur `shot-sweep.mjs`, nie Ad-hoc-Playwright.
- Untracked wiki/raw/CLAUDE.md nicht in Commits.

## Nicht getan

- Live-Sweep nach `659f53c` (nächster Task).
- DNS-Cutover Apex/www.
- EN-Routen, Motion-Paket-Wechsel.
