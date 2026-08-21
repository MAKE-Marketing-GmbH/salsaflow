# GATES — R188 Events Mobile Crop

Scope: Nur die Floweekend-Vorschaukarte auf `/events` und ihre echte Bildquelle.

- [x] G1: Mobil 390 zeigt in der Floweekend-Karte keinen hart angeschnittenen Kopf.
  EVIDENCE: `/root/clients/salsaflow-w1/worklog/shots/R188/after-final4-events-shows/events/m-03.png` selbst gelesen. Beide Hauptköpfe stehen vollständig mit Luft im Bild.
- [x] G2: Desktop 1440 bleibt sauber; alle vier Karten bleiben gleichwertig.
  EVIDENCE: `/root/clients/salsaflow-w1/worklog/shots/R188/after-final4-events-shows/events/d-02.png` selbst gelesen. Vier Karten bleiben gleich hoch; die drei anderen Bilder und Texte sind unverändert.
- [x] G3: Bildquelle ist ein echtes, ausreichend grosses Original. Kein Upscaling und keine Farbmanipulation.
  EVIDENCE: Quelle `docs/bilder/assets/photos/events/event-03.jpg` ist 4176x2784. Ableitung ist 2400x1600 WebP. Nur Verkleinerung und WebP-Kompression; `identify` bestätigt beide Grössen.
- [x] G4: `npm run typecheck` endet mit Exit 0.
  CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck
  EXPECT: Exit 0
  EVIDENCE: `tsc -p tsconfig.json --noEmit && tsc -p tsconfig.node.json --noEmit`, Exit 0.
- [x] G5: Oxlint endet für die eigene TS-Datei mit Exit 0.
  CHECK: cd /root/clients/salsaflow-w1 && npx oxlint src/public/events/content.ts
  EXPECT: Exit 0
  EVIDENCE: keine Ausgabe, Exit 0.
- [x] G6: R188-Klicktest endet mit Exit 0.
  CHECK: cd /root/clients/salsaflow-w1 && node scripts/r188-clicktest.cjs
  EXPECT: Exit 0
  EVIDENCE: `PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite`.
- [x] G7: Kein Commit, Push oder Deploy. Der vorhandene uncommitted Stand bleibt erhalten.
  EVIDENCE: `git status --short` zeigt weiterhin den vorhandenen Working Tree plus nur die scoped Dateien dieses Fixes.

Ledger: 7 von 7 Gates mit Beleg. Eigenes visuelles Urteil bleibt bis zur unabhängigen Kritik untrusted.
