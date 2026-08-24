# GATES — R188 Fix-Runde final5 (Preise / Privatstunden / Kursaufbau)

Auftrag: vier FAIL-Punkte des Opus-Kritikers. Surgical, nur diese drei Seiten.
Ledger: 18 von 18 Gates geprueft.

## P3 — /preise: Preis-Hierarchie
- [x] G1: Ankerpreis je Preisblock, Faktor >= 1.4.
      CHECK: Browser, getComputedStyle fontSize je dd
      EVIDENCE: Kurs Singles anchor 52px / secondary 16px = 3.25x.
      Workshop, Danceflow, Pass, Privatstunde je 32px / 16px = 2.0x.
      Vorher: 20px / 18px = 1.1x. (/tmp/verify.cjs)
- [x] G2: Nebenpreise klar untergeordnet, keine Liste gleichrangiger Zahlen.
      EVIDENCE: GroupedPrices ist jetzt zweistufig — Ankerblock (Preis + Position +
      Empfehlungs-Pille) und darunter zweispaltige, gruppierte Nebenpreise in
      text-base/ink-muted. d-02.png selbst gelesen: eine Zahl fuehrt, fuenf folgen leise.
- [x] G3: Kein Pastellrot, nur #AD1827.
      CHECK: grep -oE "color-salsa|#[A-Fa-f0-9]{6}" src/public/PreisePage.tsx
      EVIDENCE: 10x var(--color-salsa), 1x #AD1827 (Kommentar). Die Pille nutzt
      `bg-[var(--color-salsa)]/10` als Flaeche, die SCHRIFT traegt volles Marken-Rot.

## P8 — /preise: Trennlinien ueber drei Preisen weg
- [x] G4: Keine Linie ueber "Freitag Workshop CHF 30.-".
- [x] G5: Keine Linie ueber "Salsaflow Schueler CHF 5.-".
- [x] G6: Keine Linie ueber "Salsaflow Pass CHF 410.-".
      CHECK: Browser, borderTopWidth/borderBottomWidth aller `dl > div`
      EVIDENCE: 20 Preiszeilen gesamt, 0 Zeilen mit Rahmen. Vorher trugen 12 von 20
      je 1px. Auch die Linie UNTER dem Kartenkopf (direkt ueber dem Ankerpreis) ist
      raus. (/tmp/verify.cjs)
- [x] G7: Gliederung bleibt ohne Linien lesbar.
      EVIDENCE: Traegt jetzt der Abstand — Anker `pb-3.5`, Nebenpreise `py-2.5`,
      Gruppen `gap-y-7` plus Gruppenname. d-05.png und d-06.png selbst gelesen:
      Gruppen bleiben unterscheidbar, das Linien-Rauschen ist weg.

## PR1 — /privatstunden: Nebenanlaesse kompakt
- [x] G8: Keine drei grossen eigenen Karten mehr.
      CHECK: Browser, Kartenzahl in der When-Sektion
      EVIDENCE: 3 Karten statt 6. Die drei Nebenanlaesse sind Chips
      (gleiche Bauform wie die Hero-Chips der Seite). (/tmp/verify2.cjs)
- [x] G9: SW2 erfuellt, keine halb so hohe zweite Reihe.
      EVIDENCE: Kartenhoehen Desktop [123,123,123], Mobil [139,139,139] — alle
      gleich. Die zweite Kartenreihe existiert nicht mehr, sie wurde nicht
      kuenstlich gestreckt.
- [x] G10: Ueberschrift unveraendert.
      CHECK: grep -c "Wann lohnt sich eine Privatstunde?" src/public/privat/content.ts
      EXPECT: >=1 -> 2 (de-Titel + Kommentarzeile); Browser-innerText bestaetigt
      "Wann lohnt sich eine Privatstunde?" auf 1440 und 390.
- [x] G11: Mobil keine leeren/halbleeren Karten.
      EVIDENCE: m-02.png selbst gelesen — drei volle Karten, danach die Chip-Zeile.
      Die frueher fast leere Zelle "Styling und Musikalitaet" ist ein Chip.

## SW4 — /kursaufbau: kein abgeschnittener Kopf
- [x] G12: Rechts unten kein halber Kopf mehr.
      EVIDENCE: Ursache war NICHT object-position, sondern die Quelldatei: im
      gemessenen 767x403-Kasten ist extra_x = 0, das Bild fuellt die Breite voll,
      eine Position verschiebt nur senkrecht. Der Kopf gehoerte dem baertigen Mann
      bei Quell-x 1420-1600. Neue Datei schneidet rechts bei x=1410 ab.
      d-05.png selbst gelesen: alle Koepfe vollstaendig im Bild.
- [x] G13: Kein Upscaling.
      EVIDENCE: Quelle 1410px gegen Renderbreite 767px = Faktor 1.84x.
      naturalWidth 1410 = deklariertes width -> auch kein CLS.

## Querschnitt
- [x] G14: npm run typecheck gruen.
      EVIDENCE: exit=0, keine Ausgabe. (Ein Zwischenlauf zeigte Fehler in
      src/public/TeamPage.tsx — fremde Datei, paralleler Builder, mtime 11:59
      nach meiner letzten Aenderung 11:56. Meine sechs Dateien: 0 Fehler.)
- [x] G15: npx oxlint auf allen geaenderten Dateien Exit 0.
      EVIDENCE: exit=0 ueber alle sechs Dateien.
- [x] G16: 0 Konsolenfehler.
      EVIDENCE: manifest.json, 6 Captures (3 Seiten x Desktop/Mobil), TOTAL 0.
- [x] G17: Keine fremde Datei angefasst.
      EVIDENCE: meine 7 Pfade liegen alle unter preise/privat/kursaufbau plus das
      neue Foto. team/faq/courses/floweekend/shows nicht von mir angefasst.
- [x] G18: PASS-Punkte nicht verschlechtert.
      EVIDENCE: P1/P2/P4-P7 und KA1/KA2 sind Copy- und Struktur-Entscheidungen in
      content.ts, die ich nicht angefasst habe. Einzige Content-Aenderung: das neue
      Feld `anchorNote` und der getauschte Bildpfad. d-02/d-04/d-05/d-06 selbst
      gelesen: Fragen-Ueberschriften, entfernte Doppelungen und Bilder unveraendert.
