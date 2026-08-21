# GATES — R188 Item Tanzkurse, Runde 2 (opus-builder)

Worktree: /root/clients/salsaflow-w1 · NICHT committet, NICHT gepusht.
Angefasst: CoursesPage.tsx, courses/CourseEngine.tsx, courses/styles/content.ts,
courses/styles/heels-content.ts.

Ledger: 17 von 17 geprueft. 16 erfuellt, 1 ABANDON (G7, begruendet).

## Fix-Gates

- [x] G1 TZ5 HART — /tanzkurse traegt KEINEN Preisblock CHF 100/450/130/600 mehr.
      CHECK: grep -n "privatPrices\|CHF" src/public/CoursesPage.tsx
      EXPECT: nur Kommentar-Treffer
      EVIDENCE: 2 Treffer, beide Kommentar (Zeile 899 Begruendungstext,
      Zeile 982 Zitat der geloeschten Zahlen). Kein Render-Code. Die Tabelle ist
      ersetzt durch Satz + CtaText href="/preise". Am PNG bestaetigt:
      tanzkurse/d-06.png zeigt "Alle Tarife fuer Privatstunden und Kurse stehen
      auf der Preisseite." statt der vier CHF-Zeilen.

- [x] G2 TZ6a — Vertikale Trennlinie in der Levelsektion weg.
      CHECK: grep -c "absolute inset-y-0 left-\[calc" src/public/CoursesPage.tsx
      EXPECT: 0
      EVIDENCE: 0. PNG tanzkurse/d-05.png: zwischen "Salsa On1 und On2" und
      "Salsa & Bachata" laeuft kein Strich mehr. Spaltenabstand pr-12/pl-12 -> pr-16/pl-16.

- [x] G3 TZ6b — Sommerkurs-Block aufgeraeumt.
      EVIDENCE: Live gemessen (/tmp/measure-summer.cjs auf 1440):
      img top 4256 / bottom 4685, textCol top 4256 / bottom 4685 — beide Spalten
      exakt gleich hoch, kein Restfeld mehr. Vorher hing der kurze Text per
      items-center mittig neben einem 4/3-Bild. Jetzt items-stretch +
      justify-center, Bild lg:aspect-[3/2], Spalten 1fr_1fr.

- [x] G4 ST2 — Datum gleichwertig zur Uhrzeit in der linken Zeitspalte.
      EVIDENCE: PNG tanzkurse_bachata/d-06.png: "Mi 26. Aug." steht fett in Ink
      ueber "19:30" in derselben linken Spalte. Der alte Outline-Chip im Tag-Rudel
      ist weg (Reihe zeigt nur noch Plaetze frei / Ideal zum Einsteigen /
      Quereinstieg moeglich). Mobil ebenso: tanzkurse_salsa/m-09.png "Fr 21. Aug."
      ueber "19:30".

- [x] G5 ST2-Regression — Klicktest-Attribute unveraendert.
      CHECK: grep -c je Attribut in CourseEngine.tsx
      EXPECT: alle > 0
      EVIDENCE: data-testid="course-card" 2 · data-date= 1 · /buchung?kurs= 4.
      Bestaetigt durch G15 (Klicktest PASS).

- [x] G6 ST4 — Poetische Ueberschriften konkret, DE + EN.
      EVIDENCE: Heels myth eyebrow 'Kein Druck'/'No pressure' -> '' (SectionHead
      rendert den Block dann nicht). Titel -> 'Was du im Heels-Kurs ohne
      Vorkenntnisse lernst' / 'What you learn in a Heels class without any
      experience'. Salsa beginner -> 'Was lernst du in den ersten Wochen?' /
      'What do you learn in your first weeks?'.
      PNG tanzkurse_heels/d-01.png: kein KEIN-DRUCK-Kicker, keine Strich-Deko.
      PNG tanzkurse_salsa/d-03.png: neue H2 sichtbar.

- [ ] ABANDON: G7 ST6 — Die Preissektion hat auf den Stilseiten NIE existiert.
      Nachgewiesen, nicht geraten:
      `git show HEAD:src/public/courses/styles/StylePage.tsx | grep -i "preis|price|kostet|CHF"`
      liefert nur zwei Kommentar-Treffer ueber Bildausschnitte, keinen Preis-Code.
      `git show HEAD:src/public/courses/styles/content.ts | grep -i "preis|kostet|CHF"`
      liefert nichts. `git log --all -S'Was ein Bachata-Kurs kostet' -- src/public/courses/`
      liefert keinen Commit. Die Sektion "Was ein Bachata-Kurs kostet" gehoerte zu
      /tanzkurse (PricesSection in CoursesPage.tsx), nicht zur Bachata-Stilseite.
      Es gibt also nichts wiederherzustellen. Gemeldet statt geraten, wie beauftragt.

- [x] G8 AAA-a — /tanzkurse d-02 ausbalanciert.
      EVIDENCE: PNG tanzkurse/d-02.png: H2 links, Lead rechts auf gleicher
      Oberkante. Vorher stand der Lead unter der H2 und rechts blieben ~700px leer.

- [x] G9 AAA-b — Stil-Teaser vertikal einheitlich (SW2).
      EVIDENCE: PNG d-02.png + d-03.png: Salsa-, Bachata- und Heels-Text sitzen je
      auf der optischen Mitte ihres Bildes. items-center raus, items-stretch +
      justify-center im Textblock, lg:py-20/py-14 -> lg:py-0.

## Regel-Gates

- [x] G10 Keine neuen Kicker / Deko-Striche (TZ2).
      EVIDENCE: Neu hinzugekommen sind genau ein <p> + ein CtaText (TZ5-Ersatz).
      Kein Eyebrow, kein BeatMark, keine border-Linie neu. G6 ENTFERNT sogar einen
      Kicker (Heels 'Kein Druck') samt seinem Strich.

- [x] G11 Nur /tanzkurse- und Stilseiten-Dateien angefasst.
      EVIDENCE: 4 Dateien mit Schreibzeitstempel aus diesem Lauf (11:57–11:59):
      CoursesPage.tsx, courses/CourseEngine.tsx, courses/styles/content.ts,
      courses/styles/heels-content.ts. Die uebrigen Eintraege in `git diff --name-only`
      stammen aus der vorhandenen R187/R188-Arbeit dieses Worktrees, nicht von mir.
      team/, faq/, Preise-, Privatstunden-, Kursaufbau-, Floweekend-, Shows-Dateien
      nicht angefasst.

- [x] G12 R1-Fixes ST1, TZ2, TZ7, ST3, ST7 unangetastet.
      EVIDENCE: ST1 fixedStyle-Prop unveraendert (StylePage.tsx:749). TZ2 alle
      Kicker-Loeschungen stehen. TZ7 Privatstunden-Foto unveraendert
      (privatstunden-hell-1500.webp, PNG d-06.png). ST3 WhySectionImageRight
      unveraendert. ST7 bachata-hero-neutral-paar-1500.webp unveraendert
      (PNG tanzkurse_bachata/d-01.png).

## Verify-Gates

- [x] G13 typecheck gruen.
      CHECK: npm run typecheck
      EVIDENCE: "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.node.json --noEmit"
      ohne Fehlerausgabe, Exit 0.

- [x] G14 oxlint Exit 0.
      CHECK: npx oxlint <4 Dateien>
      EVIDENCE: keine Ausgabe, EXIT=0.

- [x] G15 Klicktest PASS.
      CHECK: node scripts/r188-clicktest.cjs
      EVIDENCE: "PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite"

- [x] G16 Captures neu.
      CHECK: node scripts/r188-capture.cjs worklog/shots/R188/after-final2-tanzkurse
             /tanzkurse /tanzkurse/salsa /tanzkurse/bachata /tanzkurse/heels
      EVIDENCE: "done /tanzkurse · done /tanzkurse/salsa · done /tanzkurse/bachata ·
      done /tanzkurse/heels · MANIFEST …/manifest.json". d-1440 + m-390 je Route.

- [x] G17 Selbstsicht.
      EVIDENCE: Selbst gelesen: tanzkurse d-02, d-03, d-05, d-06, m-04;
      tanzkurse_bachata d-06; tanzkurse_heels d-01; tanzkurse_salsa d-03, m-09.
      Je Punkt oben mit dem konkreten Befund belegt.
