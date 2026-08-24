# Item [fotos-alt] — BLOCKED (Scope-Konflikt)

## Gemessener Befund

`node worklog/.r183-check.mjs g32` → Exit 1

```
FAIL G32: Kacheln 128, sichtbare Bildtexte 0, Team-Portraets 0, ohne alt 3
```

Die drei Bilder ohne `alt` sind identifiziert, dreimal reproduziert:

| Bild | Quelle |
|---|---|
| `/photos/instagram/anniversary-recap-v2.webp` | `src/public/social/instagram-feed.ts:69` |
| `/photos/instagram/choreography-v2.webp` | `src/public/social/instagram-feed.ts:79` |
| `/photos/instagram/lady-style-v2.webp` | `src/public/social/instagram-feed.ts:89` |

## Warum ich nichts geaendert habe

**1. Keines der drei Bilder steht in meiner Datei.**
`src/public/gallery/content.ts` ist meine einzige erlaubte Datei. Alle 128
Raster-Kacheln ziehen ihr `alt` aus `GALLERY_PHOTOS` (`PhotosPage.tsx:182`,
`alt={p.alt}`). Jeder Eintrag dort hat schon ein echtes deutsches `alt`.
Der Fehler liegt in einer anderen Datei.

**2. Das leere `alt` ist hart im Layout verdrahtet, nicht in den Daten.**
`src/public/social/InstagramShowcase.tsx:73` schreibt `alt=""` als Literal.
Es liest kein Feld aus `instagram-feed.ts`. Ein neues Feld in meiner Datei
wuerde dort nie ankommen.

**3. Ein beschreibendes `alt` waere hier fachlich falsch.**
Das Poster liegt in einem Button, der schon einen Namen hat. Gemessen:

```
anniversary-recap-v2 | button aria-label: "Anniversary Weekend 2026 von Instagram laden"
choreography-v2      | button aria-label: "Choreografie von Salsaflow von Instagram laden"
```

Der Kartentitel steht zusaetzlich sichtbar im Text
(`"@SALSAFLOWDC Anniversary Weekend 2026 Laedt Instagram erst beim Klick"`).
Das Bild ist damit dekorativ. `alt=""` ist die korrekte Auszeichnung.
Ein zweiter Text wuerde den Screenreader doppelt vorlesen.

## Folge fuer das Gate

G32 zaehlt jedes `img` breiter als 120px, auch die drei Instagram-Poster.
Es unterscheidet nicht zwischen dekorativ und inhaltstragend. Damit kann
G32 aus meiner Datei heraus nicht gruen werden.

## Vorschlag an den Parent (eine der zwei Varianten)

- **A (bevorzugt):** G32 in `worklog/.r183-check.mjs:319` so messen, dass ein
  bewusst leeres `alt` innerhalb eines Buttons mit `aria-label` als korrekt
  gilt. Das misst Barrierefreiheit statt Attribut-Anwesenheit.
- **B:** Item auf `InstagramShowcase.tsx` umschneiden. Dann aber bitte mit
  der Frage, ob das doppelte Vorlesen gewollt ist.

## Nebenbefund

Ein Lauf meldete `Kacheln 0`. Ursache: parallele HMR-Aenderungen an
Nachbar-Dateien waehrend der Messung. Danach wieder stabil 128.
G32 ist unter parallelem Betrieb also zeitweise flaky.

## Belege

- `npx oxlint src/public/gallery/content.ts` → Exit 0
- `git diff src/public/gallery/content.ts` → von mir 0 Zeilen geaendert

ABANDON: leftover-other-round nicht R189-Rest
