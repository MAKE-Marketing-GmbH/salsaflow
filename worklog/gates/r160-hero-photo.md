# GATES — R160 hero-photo (/privatstunden)

- [ ] G1 DE+EN hero.image.src = /photos/2026/hero-paar-studiowand-01.webp
  CHECK: rg -c "photos/2026/hero-paar-studiowand-01.webp" src/public/privat/content.ts
  EXPECT: 2
  EVIDENCE: pending
- [ ] G2 offer-privat-square-1200 kommt in der Datei nicht mehr vor
  CHECK: rg -c "offer-privat-square-1200" src/public/privat/content.ts
  EXPECT: 0 oder leer
  EVIDENCE: pending
- [ ] G3 Kandidat per Read angesehen: hell, zwei Personen, Köpfe ganz, kein KI
  EVIDENCE: pending
- [ ] G4 Flow-Bild kurse/06.jpg geprüft: hell genug -> bleibt, sonst Tausch
  EVIDENCE: pending
- [ ] G5 Kein CSS-Filter, keine Preis-/CHF-Änderung
  CHECK: git diff -U0 src/public/privat/content.ts | rg -n "CHF|filter" | wc -l
  EXPECT: 0
  EVIDENCE: pending
- [ ] G6 npx oxlint src/public/privat/content.ts Exit 0
  EVIDENCE: pending
- [ ] G7 forbidden-check.py --doku Exit 0 auf content.ts
  EVIDENCE: pending
- [ ] G8 Render /privatstunden PNG (Desktop+Mobil), selbst per Read angesehen
  EVIDENCE: pending
