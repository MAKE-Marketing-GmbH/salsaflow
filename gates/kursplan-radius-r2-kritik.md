# Gates: kursplan-radius Runde-2-Kritik

Scope: Unabhaengiges PASS/FAIL fuer ITEM [kursplan-radius] nur an src/public/SchedulePage.tsx.

- [x] G1: Gate g28 Exit 0, Radius Desktop und Mobil >=12px, Streckung Faktor <=2.2, Motiv hero-paar-studiowand
  CHECK: node worklog/.r183-check.mjs g28
  EXPECT: /PASS|exit 0|radius/
  EVIDENCE: PASS G28: band 3.21:1, quelle 2.33:1, faktor 1.38, radius desktop 24px / mobil 24px, src hero-paar-studiowand-hero-2100.webp. Exit 0. (gleichesMotivWieTanzkurse false ist korrekt: Tanzkurse nutzt kurse-classfreude.)

- [x] G2: object-position-Fix steht in SchedulePage.tsx (30% mobil, center ab sm)
  CHECK: grep -n "object-\\[30%_20%\\]\\|sm:object-\\[center_20%\\]" src/public/SchedulePage.tsx
  EXPECT: object-[30%_20%]
  EVIDENCE: Zeile 322: object-[30%_20%] sm:object-[center_20%]. Round-1-PNG schnitt den Mannkopf, Round-2-PNG zeigt ihn ganz.

- [x] G3: Tabu-Dateien unberuehrt (index.css, kit.tsx, CookieBanner, WhatsAppFloat)
  CHECK: git diff --name-only -- src/index.css src/public/subpage/kit.tsx src/public/CookieBanner.tsx src/public/WhatsAppFloat.tsx src/public/site/CookieBanner.tsx src/public/site/WhatsAppFloat.tsx
  EXPECT: /^$/
  EVIDENCE: git diff --name-only auf Tabu-Pfade leer. kit.tsx mtime 19.08., index.css 09:26, aelter als SchedulePage.

- [x] G4: Radius am Eltern-DIV mit overflow-hidden, Vorbild CoursesPage analog
  EVIDENCE: SchedulePage.tsx:236-237 Shell + overflow-hidden rounded-[var(--radius-media)]. CoursesPage.tsx:280-281 gleiche Bauform. --radius-media=24px in index.css:65. PNG-Ecken rund, Kantenlage identisch zum Vorbild (Messung B).

- [x] G5: oxlint Exit 0 auf SchedulePage.tsx
  CHECK: npx oxlint src/public/SchedulePage.tsx
  EXPECT: /Found 0 warnings|0 error|no problems/i
  EVIDENCE: npx oxlint src/public/SchedulePage.tsx Exit 0.

ABANDON: leftover-other-round nicht R189-Rest
