# GATES — R188 Runde 3 (Polier-Runde), Team + FAQ

Nur diese Dateien: src/public/TeamPage.tsx, src/public/FaqPage.tsx

- [x] T4 Unterkanten buendig
  MESSUNG: sichtbare Unterkante Textspalte (letzter Absatz) vs Bildkarte, Desktop 1440
  EXPECT: Differenz < 8px
  EVIDENCE: DIFF_visible 0.0px, DIFF_containers 0.0px (textCol bottom 2539.9,
  figure bottom 2539.9, letzter Absatz bottom 2539.9). EN ebenfalls 0.0px.
  Befund war anders als im Auftrag vermutet: die Container waren nie ungleich
  (beide 2113.2..2540.0, Diff 0). Ungleich war die SICHTBARE Kante — der Text
  endete bei 2312.7, darunter standen 227.2px leeres Beige.

- [x] Teamfoto bleibt unbeschnitten (Nebenbedingung, nicht im Auftrag genannt)
  EXPECT: keine abgeschnittenen Koepfe (stehende Regel R156/R159/R187)
  EVIDENCE: sichtbares Quellfenster 0.0%..100.0% vertikal UND horizontal,
  Dichte 2.81. Die zuerst gebaute Variante (Bild aus Textspalte speisen) traf
  die 0px auch, zeigte aber nur src 26.6%..73.4% — allen zwoelf Personen war
  der Kopf ab (Beleg /tmp/t4-image-crop.png). Verworfen.

- [x] Badge-Text loest Bild-Text-Widerspruch (Grok)
  EXPECT: Badge bezieht sich auf Heute, nicht auf 2018-Gruendung. DE + EN.
  EVIDENCE: DE "Heute: rund 40 Kurse pro Woche", EN "Today: around 40 classes
  a week" (beide live im Browser gelesen). Zahl ist belegt: steht woertlich im
  Story-Absatz daneben. 2018 bleibt im ersten Absatz sichtbar.

- [x] FAQ Mobil 390: Themenfilter-Pillen kompakt, einheitliche Hoehe
  EXPECT: keine fahrige Treppe, weniger verschenkte Hoehe
  EVIDENCE: 7 Pillen, distinctRows 7 -> 1, Blockhoehe 48px (vorher rund 350px),
  alle Pillen exakt 44px hoch (Touch-Ziel), scrollWidth 1621 / clientWidth 390,
  overflowX auto. Ab sm unveraendert Umbruch. Selbst gelesen in faq/m-02.png.

- [x] Team Mobil 390: keine Ein-Wort-Kaskaden in Gruender-Metadaten
  EXPECT: Karte "Claudia" ohne Ein-Wort-Zeilen
  EVIDENCE: Rolle vorher 3 Zeilen ("Gründerin" / "und" / "Schulleitung"),
  jetzt 2 ("Gründerin und" / "Schulleitung"). Kurszeile vorher 7 Zeilen mit
  5 Ein-Wort-Zeilen, jetzt 3 sinnvolle Einheiten ("Salsa," /
  "Bodymovement & Ladystyle" / "· Mo + Mi + Do").
  Kartenbreite 103px -> 167px. Ursache war index.css:801 (4rem padding-right
  auf JEDEM li dieser Route); index.css blieb unangetastet.

- [x] Kein neuer WhatsApp-Float-Konflikt (Regression aus dem Fix oben)
  EXPECT: 0 Ueberdeckungen von Gruender-Text durch den Float
  EVIDENCE: Scan ueber die ganze Seite in 200px-Schritten: 0 Treffer.
  Zwischenstand mit pauschalem !pr-0 hatte 3 Treffer bei scrollY 800 —
  darum traegt jetzt nur die Kurszeile der rechten Spalte max-sm:pr-14.

- [x] Kein Textueberlauf aus der Karte
  EVIDENCE: overflowPx Fabio -84.4, Claudia -9.2, Sebastian -82, Vanessa -137.1
  (alle negativ = innerhalb). Zwischenstand mit whitespace-nowrap lief bei
  Claudia 70.4px hinaus bis x=440 auf 390px Schirm — verworfen.

- [x] npm run typecheck gruen
  CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck
  EVIDENCE: Exit 0

- [x] npx oxlint auf geaenderte Dateien Exit 0
  CHECK: npx oxlint src/public/TeamPage.tsx src/public/FaqPage.tsx src/public/faq/content.ts
  EVIDENCE: "Found 0 warnings and 0 errors. Finished in 243ms on 3 files with
  111 rules using 6 threads." Exit 0

- [x] Neue Captures + 0 Konsolenfehler
  EVIDENCE: manifest.json — /team d 8 Slices h6944, /team m 10 Slices h8282,
  /faq d 7 Slices h5568, /faq m 10 Slices h8325. consoleErrors ueberall [].

- [x] Vorrunde-Fixes unangetastet
  EVIDENCE: hp-21.webp 2 Treffer (Couch-Ersatz steht), rote Pille 0 Treffer
  (bleibt weg), image2 in FaqPage.tsx 6 / content.ts 4 (FAQ-Zweitbild steht).
  faq/content.ts wurde in dieser Runde NICHT angefasst.
