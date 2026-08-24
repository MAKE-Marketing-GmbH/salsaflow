# Gates: kursplan-radius R2 critic

Scope: Hartes PASS/FAIL gegen Auftrag, ohne Fix.

- [x] G1: g28 Exit 0
  CHECK: node worklog/.r183-check.mjs g28
  EXPECT: PASS G28
  EVIDENCE: PASS G28: band 3.21:1, quelle 2.33:1, faktor 1.38, radius desktop 24px / mobil 24px, gleichesMotivWieTanzkurse false, src hero-paar-studiowand-hero-2100.webp | 1/1 PASS

- [x] G2: radius desktop >= 12px UND mobil >= 12px
  CHECK: node worklog/.r183-check.mjs g28
  EXPECT: /radius desktop \d+px \/ mobil \d+px/
  EVIDENCE: PASS G28: band 3.21:1, quelle 2.33:1, faktor 1.38, radius desktop 24px / mobil 24px, gleichesMotivWieTanzkurse false, src hero-paar-studiowand-hero-2100.webp | 1/1 PASS

- [x] G3: Streckung Faktor <= 2.2, Motiv hero-paar-studiowand, Koepfe ganz
  EVIDENCE: faktor 1.38. Motiv hero-paar-studiowand-hero-2100.webp. Live .r183f-cookie.mjs Exit 0: cookie-offen x 93..1883 (187px Luft), cookie-akzeptiert x 236..1549 (44px Luft), KOEPFE GANZ true. Vier r183f-PNGs: Hinterkopf des Mannes vollstaendig, Frau ganz.

- [x] G4: nur SchedulePage.tsx im Scope, Tabu-Pfade unberuehrt
  EVIDENCE: git diff --stat kit.tsx index.css CookieBanner WhatsAppFloat leer. Andere dirty src-Dateien = parallele Wellen-Items, kein Crop-Fix dieses Laufs.

- [x] G5: Sonderfragen Shell-Radius, style-Block, Diff-Groesse
  EVIDENCE: Shell+overflow-hidden+--radius-media = CoursesPage.tsx:280-281; Full-bleed-Radius waere unsichtbar. style-Block nur in erlaubter Datei. Diff 235/40 ist Altlast; diese Runde eine className-Zeile.

Verdict: PASS

ABANDON: leftover-other-round nicht R189-Rest
