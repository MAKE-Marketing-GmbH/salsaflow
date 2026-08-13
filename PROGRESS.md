# PROGRESS — Salsaflow DC

**Stand:** 2026-08-13 (Live-Audit + Production `659f53c`)
**Session:** Live-Site QA, chirurgische Fixes, Deploy
**Handoff-ready:** ja

## ERLEDIGT

- Live-Audit auf [salsaflow-dc.vercel.app](https://salsaflow-dc.vercel.app/) mit kanonischem `shot-sweep.mjs` (nie Ad-hoc-Playwright).
- Erster Fix-Commit **`e7c5e91`** (schon live vor dieser Runde): ein Kontakt-Pfad, 5 Hero-Crops.
- Zweiter Fix-Commit **`659f53c`** auf `origin/main` und Production:
  - `/kontakt`: Wizard im Fold, Hash setzt Topic und scrollt zu `#kontaktformular`.
  - Infosektion heisst `id="raum-info"` (nicht mehr `#raumvermietung`).
  - Wizard: Parent-Topic setzt Step und Details zurück. Weiter ist `type="submit"`.
  - Floweekend: Motiv `party-29`, `dense` Hero, kurze Band-Höhe. Köpfe im 730-Fold belegt.
  - Heels: `position` + `heightClass`. Preise: Pass-Bild `kurs-07`.
  - StickyCta auf Home gemountet. EN-Nav-Labels. Footer Gutschein-Hash. FAQ `/events`.
  - Image-Reuse-Gate PASS (103 Bilder).
- Production Ready: `dpl_9CFwXRj3sfxfF42CCTCpCAuHB1cS` → Alias [salsaflow-dc.vercel.app](https://salsaflow-dc.vercel.app/) HTTP 200.

## OFFEN (WIP=1)

**Nächster Task:** Live-Sweep nach Deploy. Nur `/kontakt` und `/events-workshops/floweekend`. Jedes Fold-PNG selbst lesen.

Nicht in diesem Diff (bewusst):
- Apex `salsaflow-dc.com` / www bleibt Jimdo bis DNS-Cutover.
- EN ohne `/en` und ohne hreflang.
- Fünf Schnupper-CTAs auf Home.
- `framer-motion` → `motion/react`.
- Rate-Limit / Mail-error-leak.
- GhostCta-Look, FAQ `-ml-4`.

## Gates

| Gate | Status |
|---|---|
| G-IA | ENTSCHIEDEN — Kunden-Baseline |
| G-DESIGN | ENTSCHIEDEN — A Warme Bühne |
| Image-Reuse | PASS (`scripts/verify-image-reuse.cjs`, 103) |
| Production `659f53c` | Ready, HTTP 200 |
| Live-Sweep nach Deploy | offen (WIP=1) |
| DNS Cutover Jimdo→Vercel | offen (Owner) |

## Hosting-Fakt

- Wahrheit: [`/root/clients/salsaflow`](/root/clients/salsaflow) auf `main`.
- GitHub: `MAKE-Marketing-GmbH/salsaflow`.
- Vercel-Projekt: `salsaflow-dc` (Team MAKE).
- Neu/Live-Preview: `https://salsaflow-dc.vercel.app/`
- Apex/www: noch Jimdo/Cloudflare 301.

## Uncommitted / nicht Teil dieses Handoffs

- `vite.dev.local.config.ts` — lokale Vite-Cache-Umgehung, nicht committen.
- Untracked: `.claude/`, `CLAUDE.md`, `wiki/`, `raw/`, `website/`, `links.json`, … — fremd, nicht mixen.
- Nie `git add -A`.

## Nächster Schritt (1 Zeile)

```
node /root/raphael-skills/skills/eigene/web/scripts/shot-sweep.mjs --base https://salsaflow-dc.vercel.app --out /tmp/salsaflow-live-r5 --routes /kontakt,/events-workshops/floweekend --static
```

Dann Fold-PNGs per Read ansehen.
