# Gates: ContactHero Collage-Bilder (Leaf, nicht Root)

Scope: Drei Hero-Kacheln auf /kontakt tauschen. Root-GATES.md bleibt das Video-Ledger und wurde NICHT angefasst.

Finale Bildwahl (alle drei per Read selbst angesehen, alle Werte gemessen):
  Kachel 1 gross  /photos/kurse/kurs-07.jpg                  1067x1600  lum 128  R-B +59.0
  Kachel 2 oben   /photos/premium/community-story-1600.webp  1600x1067  lum 151  R-B +22.2
  Kachel 3 unten  /photos/kurse/kurs-03.jpg                  1600x1064  lum 118  R-B +26.0

- [x] G1: Logo-Wand und Tungsten-Orange sind raus
  CHECK: echte src= im Hero gegen Sperrliste (Kommentartext zaehlt nicht)
  EXPECT: old-srcs-gone
  EVIDENCE: 3 srcs = kurs-07.jpg, community-story-1600.webp, kurs-03.jpg. Kein Treffer.
  HINWEIS: Die naive Fassung (Substring ueber die ganze Datei) schlaegt fehl, weil der
  Kopfkommentar Zeile 136/140 die verworfenen Bilder BEGRUENDET. Das ist gewollt und
  verhindert das Zurueckdrehen. Geprueft wird darum nur src=.

- [x] G2: Verbotene Quellen nicht verwendet
  CHECK: python3 -c "p=open('src/public/ContactPage.tsx').read(); assert 'hero-paar-studiowand' not in p; assert 'offer-bachata' not in p; print('forbidden-gone')"
  EVIDENCE: forbidden-gone

- [x] G3: 3 img in ContactHero
  EVIDENCE: count 3

- [x] G4: Kommentarblock nennt neue Dateien
  EVIDENCE: comment-ok (R178 vorhanden)

- [~] G5: oxlint Exit 0
  CHECK: npx oxlint src/public/ContactPage.tsx
  EVIDENCE: Exit 1, 6x anti-slop in Zeile 28,38,55,71,87,106.
  VORBESTAND, NICHT VON MIR: identische 6 Fehler in git HEAD (Vergleich gegen
  /tmp/r178-verify/base/src/public/ContactPage.tsx -> ebenfalls 6).
  Mein Diff beginnt bei Zeile 129. Betroffen sind TOPIC_HASHES und die Cookie-Logik,
  also Code ausserhalb meines Auftrags. Nicht angefasst.

- [x] G6: Collage-Struktur unveraendert
  EVIDENCE: structure-ok (aspect-[4/5] + 2x aspect-[4/3])

- [x] G7: Render geprueft, PNGs selbst gelesen
  EVIDENCE: /tmp/r178-verify/kontakt-1440-fold.png und kontakt-390-fold.png.
  Alle drei Bilder loaded=true, inFold=true auf 1440 UND 390.
  width/height im Markup = natuerliche Dateimasse (kein Verzerren).

- [x] G8: Kein Home-Dup
  EVIDENCE: grep der drei Quellen in src/public/home/ -> 0 Treffer.
  kurse-classfreude-01 war ein Home-Dup (WhyGrid.tsx:91) und wurde darum ersetzt.

OFFEN / EHRLICH:
  Kachel 2 (community-story) ist ein gestelltes Sofa-Portraet zwischen zwei
  Tanz-Reportagen. Genre-Bruch nach DESIGN.md:92. Ein Tausch auf showcase/hp-29.webp
  wurde geprueft und von der Kimi-Lane ABGELEHNT: hp-29 zeigt das Team vor der grossen
  Salsaflow-Logo-Wand und laeuft bereits im Home-TeamBlock (TeamBlock.tsx:195).
  Das waere ein Rueckfall in genau den Fehler, den R178 behebt.
  Ebenfalls geprueft und verworfen: kurs-05 (Logo + 5x sitewide),
  hp-03/hp-21 (Logo-Wand bzw. dunkel/Tungsten), gallery/kurse/06 (laeuft schon in der
  LocationSection derselben Seite).
  Ergebnis: kein Kandidat im Bestand ist besser. Stand bleibt.
