# Gates: kursplan-radius critic r1 (Duplikat-Ledger)

Scope: Gleiches Item wie Root-GATES.md. Nicht /tanzkurse.

- [x] G1: Desktop-1440-Fold selbst gesehen
  EVIDENCE: Duplikat von Root-GATES G1. Shot kursplan-desktop-1440-00-fold.png gelesen.

- [x] G2: Mobil-390-Fold selbst gesehen
  EVIDENCE: Duplikat von Root-GATES G2. Shot kursplan-mobil-390-00-fold.png gelesen.

- [x] G3: Desktop Cookie-offen selbst gesehen
  EVIDENCE: Duplikat von Root-GATES G3. Shot kursplan-desktop-1440-01-cookie-offen.png gelesen.

- [x] G4: Radius Desktop >= 12px
  CHECK: node worklog/.r183-check.mjs g28
  EXPECT: radius desktop 24px / mobil 24px
  EVIDENCE: Exit 0, desktop 24px

- [x] G5: Radius Mobil >= 12px
  CHECK: node worklog/.r183-check.mjs g28
  EXPECT: radius desktop 24px / mobil 24px
  EVIDENCE: Exit 0, mobil 24px

- [x] G6: rounded Token am Eltern-DIV
  EVIDENCE: SchedulePage.tsx:200 rounded-[var(--radius-media)] overflow-hidden

- [x] G7: Shell analog Tanzkurse
  EVIDENCE: SchedulePage.tsx:199 plus CoursesPage.tsx:280-281

- [x] G8: Scope nur SchedulePage.tsx
  EVIDENCE: Isolierter Diff Shell + rounded

- [x] G9: Vier Ecken rund
  EVIDENCE: drei Shots, Verdict PASS

- [x] G10: Kanten fluchten
  EVIDENCE: Bandkante = H1-Kante

- [x] G11: kein Full-Bleed
  EVIDENCE: Gutter in allen drei Shots

ABANDON: leftover-other-round nicht R189-Rest
