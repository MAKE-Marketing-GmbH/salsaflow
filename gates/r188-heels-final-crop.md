# R188 Heels Final-Crop

- [x] G1 Heels-Hero nutzt ein echtes Original ohne Hochskalierung oder Farbänderung.
  CHECK: identify public/photos/2026/kurse-heels-energie-hero-2100.webp public/photos/r188-tanzkurse/heels-hero-heads-1470.webp
  EXPECT: 2100x900 und 1470x630
  EVIDENCE: Original WEBP 2100x900; Ableitung WEBP 1470x630. Crop `1470x630+300+0`, also nur Subtraktion, keine Skalierung.

- [x] G2 Desktop 1440 zeigt alle sichtbaren Köpfe vollständig.
  EVIDENCE: `worklog/shots/R188/after-final7-heels-crop/tanzkurse_heels/d-01.png` gelesen; alle sichtbaren Scheitel und Kinne liegen im Rahmen.

- [x] G3 Mobil 390 zeigt alle sichtbaren Köpfe vollständig.
  EVIDENCE: `worklog/shots/R188/after-final7-heels-crop/tanzkurse_heels/m-01.png` gelesen; alle sichtbaren Köpfe liegen vollständig im Rahmen.

- [x] G4 Heels d-02 ist nicht schlechter geworden.
  EVIDENCE: Neues `d-02.png` gegen `after-final2-tanzkurse/.../d-02.png` gelesen. `compare -metric AE` meldet exakt `0` abweichende Pixel.

- [x] G5 Tanzkurse d-02 wurde geprüft; Änderung nur bei echtem Bild-Crop.
  EVIDENCE: `after-final2-tanzkurse/tanzkurse/d-02.png` beginnt mitten in einem Seitenbild. Der angeschnittene Hinterkopf liegt an der Screenshot-Slice-Grenze, nicht an einem Bildrahmen. Keine Änderung.

- [x] G6 Nur die zwei veralteten ST4-Dateien sind entfernt, wenn aktuelle Belege vollständig sind.
  CHECK: test ! -e worklog/shots/R188/after-final2-tanzkurse/st4-salsa-de.png && test ! -e worklog/shots/R188/after-final2-tanzkurse/st4-bachata-de.png
  EXPECT: Exit 0
  EVIDENCE: Beide alten Dateien entfernt. `st4-final-salsa-de.png`, `st4-final-bachata-de.png` und Seitenslices gelesen und vorhanden.

- [x] G7 Typecheck ist grün.
  CHECK: npm run typecheck
  EXPECT: Exit 0
  EVIDENCE: `tsc -p tsconfig.json --noEmit && tsc -p tsconfig.node.json --noEmit`, Exit 0.

- [x] G8 Oxlint ist für die eigenen TS-Dateien grün.
  CHECK: npx oxlint src/public/courses/styles/heels-content.ts src/public/courses/styles/HeelsView.tsx
  EXPECT: Exit 0
  EVIDENCE: Keine Ausgabe, Exit 0.

- [x] G9 R188-Klicktest ist grün.
  CHECK: node scripts/r188-clicktest.cjs
  EXPECT: PASS
  EVIDENCE: `PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite`, Exit 0.

- [x] G10 Visuelles G1 und fremder Kritiker sind grün.
  CHECK: python3 /root/raphael-skills/skills/eigene/visual-aaa/scripts/validate-ship-manifest.py worklog/shots/R188/after-final7-heels-crop/visual-ship.json
  EXPECT: SHIP VALID
  EVIDENCE: G1 `3 file(s), 0 findings`; visual-kritiker `verdict: pass`, `confidence: HIGH`; Manifest `SHIP VALID`.
