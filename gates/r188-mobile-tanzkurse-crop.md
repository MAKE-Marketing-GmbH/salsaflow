# Gates: R188 mobiler Tanzkurse-Crop

Scope: Nur den harten rechten Rand-Crop des Hero-Bildes auf `/tanzkurse` mobil beheben. Desktop bleibt unverändert.

- [x] G1: Der mobile Hero-Ausschnitt zeigt keine zufällig angeschnittene nächste Person.
  EVIDENCE: `worklog/shots/R188/after-final2-tanzkurse/tanzkurse/m-01.png` selbst gelesen. Mobil zeigt das vollständige 3:2-Original ohne horizontalen `object-cover`-Crop.

- [x] G2: Kein Kopf im mobilen Hero-Ausschnitt ist abgeschnitten.
  EVIDENCE: `m-01.png` selbst gelesen. Alle sichtbaren Köpfe liegen vollständig im Bild.

- [x] G3: Der Desktop-Hero bleibt bei 1440 Pixeln visuell unverändert.
  EVIDENCE: `d-01.png` selbst gelesen. Ab `sm` gelten weiter `aspect-auto`, 24rem Höhe und `center 34%`.

- [x] G4: TypeScript-Prüfung ist grün.
  CHECK: npm --prefix /root/clients/salsaflow-w1 run typecheck
  EXPECT: tsc -p tsconfig.node.json --noEmit
  EVIDENCE: Beide tsc-Läufe beendet, Exit 0.

- [x] G5: Oxlint ist für die eigene TSX-Datei grün.
  CHECK: /root/clients/salsaflow-w1/node_modules/.bin/oxlint --config /root/clients/salsaflow-w1/.oxlintrc.json /root/clients/salsaflow-w1/src/public/CoursesPage.tsx
  EXPECT: /^$/
  EVIDENCE: Keine Meldung, Exit 0.

- [x] G6: Der R188-Klicktest ist grün.
  CHECK: node /root/clients/salsaflow-w1/scripts/r188-clicktest.cjs
  EXPECT: PASS:
  EVIDENCE: PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite. Exit 0.
