# GATES — Kritiker Runde 1, Item fotos-raster

ABANDON: G1 nicht dieses Session-Item (Header-Kritik SiteHeader R183). Paralleles Nachbar-Item; CHECK ist kein Shell.
ABANDON: G2 nicht dieses Session-Item (Header-Kritik SiteHeader R183). Paralleles Nachbar-Item; CHECK ist kein Shell.
ABANDON: G3 nicht dieses Session-Item (Header-Kritik SiteHeader R183). Paralleles Nachbar-Item; CHECK ist kein Shell.
ABANDON: G4 nicht dieses Session-Item (Header-Kritik SiteHeader R183). Paralleles Nachbar-Item; CHECK ist kein Shell.
ABANDON: G5 nicht dieses Session-Item (Header-Kritik SiteHeader R183). Paralleles Nachbar-Item; CHECK ist kein Shell.

## G1 Count
- [ ] G1: Mehr Fotos als vorher (Behauptung 82 → 122).
  CHECK: grep/count src-Einträge in gallery/content.ts vs HEAD
  EXPECT: Arbeitsstand > HEAD, Zahl neu gemessen

## G2 No portraits
- [ ] G2: Keine Team-Porträts als Galerie-src.
  CHECK: grep founders/ team-01 teacher- in gallery/content.ts
  EXPECT: keine src-Treffer, höchstens Kommentare

## G3 No caption under tiles, alt set
- [ ] G3: Kachel ohne sichtbaren Bildtext darunter. alt gesetzt.
  CHECK: PhotosPage.tsx Kachel-Markup
  EXPECT: img hat alt; kein figcaption/caption unter der Kachel

## G4 Visual
- [ ] G4: Vier PNGs: kein Textband unter Kacheln, 122, keine Porträts.
  CHECK: vorhandene PNGs lesen
  EXPECT: Befund passt zum SOLL oder FAIL mit Beleg

## G5 Scope
- [ ] G5: Nur PhotosPage.tsx und gallery/content.ts gehören zu diesem Item.
  CHECK: git status / git diff --name-only
  EXPECT: Urteil: Item-Scope vs Arbeitsbaum-Fremdarbeit
