# GATES — R188 Team/FAQ Fix-Paket (T5, T6, T4, FAQ-Doppelbild)

Scope: nur src/public/TeamPage.tsx, src/public/FaqPage.tsx, src/public/faq/content.ts.
Kein courses/-Pfad. Kein Commit, kein Push.

- [x] G1 T5 — roter Container mit "Du gehörst vom ersten Abend an dazu." ersatzlos weg
  CHECK: grep -c "Du gehörst vom ersten Abend an dazu" src/public/TeamPage.tsx
  EXPECT: 0
  EVIDENCE: Ausgabe `0`. Der Ersatzsatz stand schon im TrialBand
    (TeamPage.tsx:589 "Am schnellsten lernst du uns kennen, indem du einmal mittanzt.").

- [x] G2 T5 — auch die EN-Fassung des Satzes weg
  CHECK: grep -c "You belong from your very first evening" src/public/TeamPage.tsx
  EXPECT: 0
  EVIDENCE: Ausgabe `0`.

- [x] G3 T6 — Couch-Foto nicht mehr als aktives Bild der Team-Seite
  CHECK: grep -c 'src="/photos/r188-team' src/public/TeamPage.tsx
  EXPECT: 0
  EVIDENCE: Ausgabe `0`. Der Dateiname steht nur noch im Erklaer-Kommentar
    (TeamPage.tsx:446). Aktives Bild ist jetzt TeamPage.tsx:513
    `src="/photos/showcase/hp-21.webp"`.

- [x] G4 T6 — Ersatz stammt aus worklog/R187-originale.md, kein Upscaling
  EVIDENCE: `/photos/showcase/hp-21.webp`, 1800x1200 (identify). Aus dem
    Original-Katalog, nativ eingebunden, nicht hochskaliert. Sitewide an keiner
    Stelle als aktives `src` (grep) -> kein neues Duplikat.
    Gegenprobe: `hp-27-3840.webp` UND `community-story.jpg` zeigen beide
    dieselbe Couch-Szene und scheiden darum aus (per Bildsicht geprueft).

- [x] G5 T4 — Geschichte-Sektion: gleiche visuelle Kartenhöhe auf Desktop 1440
  CHECK: node scratch/r188-card-heights.cjs
  EXPECT: DELTA 0
  EVIDENCE: `grid: 2 Spalten, Hoehen 427 / 427, delta 0` -> `DELTA 0`.

- [x] G6 FAQ — kein doppeltes Social-Foto mehr sichtbar
  CHECK: node scratch/r188-faq-images.cjs
  EXPECT: DUPLICATES 0
  EVIDENCE: `DOM_DUPES []`, `SEQ_REPEATS 0`, `DUPLICATES 0`.
    Slices: 01 hero-paar-dreh / 02 kurse-classfreude / 03 event-social-couple /
    04 community-diversitaet / 05 hp-28 — jeder Slice ein anderes Motiv.
    URSACHE war nicht eine doppelte Datei (DOM_DUPES war immer leer), sondern
    ein `lg:sticky`-Bild neben einer 12-Fragen-Spalte ueber zwei Viewports.

- [x] G7 typecheck grün
  CHECK: npm run typecheck
  EXPECT: exit 0
  EVIDENCE: `EXIT=0`, keine Fehlerzeile.

- [x] G8 oxlint Exit 0 auf allen geänderten Dateien
  CHECK: npx oxlint src/public/TeamPage.tsx src/public/FaqPage.tsx src/public/faq/content.ts
  EXPECT: exit 0
  EVIDENCE: `oxlint exit=0`, keine Meldung.

- [x] G9 Screenshots /team + /faq, Desktop 1440 + Mobil 390, 0 Konsolenfehler
  EVIDENCE: worklog/shots/R188/after-final3-team-faq/manifest.json:
    /team d slices=8 errors=0 · /team m slices=10 errors=0
    /faq  d slices=7 errors=0 · /faq  m slices=11 errors=0

- [x] G10 Selbstsicht: eigene PNGs gelesen, alle vier Befunde bestätigt
  EVIDENCE: team/d-03 (Couch weg, hp-21 drin, Text oben buendig, Spalten gleich hoch),
    team/d-04 (kein roter Container mehr, TrialBand folgt direkt),
    team/m-04 (mobil ebenso, keine Koepfe angeschnitten),
    faq/d-04 (blaues Social-Foto) vs faq/d-05 (hp-28 Showfoto) — verschieden,
    faq/m-08 (mobil zwei verschiedene Motive untereinander).
    Nachgebessert nach Selbstsicht: Textspalte lief `justify-center` und begann
    erst auf halber Bildhoehe -> auf `justify-start` geaendert.
