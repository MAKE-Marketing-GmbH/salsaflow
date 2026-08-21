# R187 Cookie-Überdeckung

## C1 — Freiraum vor der Tagesleiste

- [x] Bei offenem Cookie-Hinweis liegt die Tagesleiste nach einem variablen Freiraum.
  EVIDENCE: `cookie-overlap.json` misst mobil Tagesleiste `y=763` und erste Tageskarte `y=845` bei einem Fold bis `844`.
  EVIDENCE: Desktop misst die Tagesleiste bei `y=709` und die erste Tageskarte bei `y=791`.

## C2 — Tages- und Wochen-Schalter erreichbar

- [x] Wochen-Schalter bleiben im Fold sichtbar, frei und anklickbar.
  EVIDENCE: Beide Breiten melden für beide Wochen-Schalter `inViewport=true`, `overlapsBanner=false` und `hitSelf=true`.
- [x] Alle sechs Tages-Schalter funktionieren nach dem Schließen.
  EVIDENCE: `cookie-overlap.json` meldet zwölf erfolgreiche Klicks mit `aria-pressed="true"`.

## C3 — Keine mobile Folgeüberschrift im Fold

- [x] Team zeigt mobil keine Folgeüberschrift unter dem Hero.
  EVIDENCE: `team-mobile.png` zeigt unter dem Foto freien Grund bis zur Cookie-Karte.
- [x] Eventkalender zeigt mobil keine Folgeüberschrift unter dem Hero.
  EVIDENCE: `eventkalender-mobile.png` zeigt unter dem Foto freien Grund bis zur Cookie-Karte.

## C4 — Bestehende Locks bleiben erhalten

- [x] Cookie-Zeigerverhalten und `5.5rem`-Gutter bleiben erhalten.
  EVIDENCE: `CookieBanner.tsx` blieb unverändert. Alle sechs Messfälle melden außen `none` und innen `auto`.
- [x] Team `38%`, Eventkalender `22%` sowie Kursplan `19rem` und `22%` bleiben erhalten.
  EVIDENCE: `TeamPage.tsx`, `eventkalender-content.ts` und `SchedulePage.tsx` enthalten die bestehenden Werte.
  EVIDENCE: Der Desktop-Kursplan misst `304px` und `50% 22%`.

## C5 — Browserbilder

- [x] Sechs aktuelle PNGs liegen in beiden Zielgrößen vor.
  EVIDENCE: `team-*`, `eventkalender-*` und `kursplan-*` liegen unter `worklog/shots/R187-cookie-overlap/`.
  EVIDENCE: `file` bestätigt dreimal `1440 x 730` und dreimal `390 x 844`.

## C6 — Vollständiger Browser-Sweep

- [x] Alle 27 Routen bestehen in beiden Zielgrößen.
  EVIDENCE: `full-browser-sweep.json` meldet `complete=true`, `caseCount=54` und `failureCount=0`.

## C7 — Code-Gates

- [x] TypeScript, Oxlint, Build und Diff-Prüfung bestehen.
  CHECK: npx tsc --noEmit && npx oxlint src/public && npm run build && git diff --check
  EXPECT: exit 0
  EVIDENCE: Exit 0. Vite baute 2291 Module und alle Prerender-Routen.

## C8 — Drei unabhängige Kritiker

- [x] Opus, Sol und Grok prüfen alle sechs echten PNGs.
  EVIDENCE: Opus PASS. Grok PASS. Sol PASS nach direktem Beleg für den Eventkalender-Crop.

## C9 — Temporäre Prüfdateien entfernt

- [x] Temporäre Browser-Skripte und lokaler Vite-Cache fehlen.
  CHECK: test ! -e worklog/.r187-cookie-hit.mjs && test ! -e worklog/.r187-browser-sweep.mjs && test ! -e .vite-r187
  EXPECT: exit 0
  EVIDENCE: Exit 0.
