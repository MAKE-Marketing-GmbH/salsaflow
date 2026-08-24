# Item-Ledger [kursmodal] — R183 Welle 2

Rolle: opus-builder (bounded). Datei: `src/public/BookingPanel.tsx` (einzige geaenderte Datei).

SOLL (Raphael 20.08.): Kursmodal klarer. Simpler, nicht voller.
Absprache 17.08.: Modal nur Rolle plus Anmeldung. Die Kursseite traegt die Infos.

## Pfad-Korrektur

`src/public/booking/BookingPanel.tsx` existiert nicht. Gefunden per `rg`:
echter Pfad ist `/root/clients/salsaflow-w1/src/public/BookingPanel.tsx`
(genutzt in `src/routes.tsx:18`). Nur diese eine Datei angefasst.

## Messung 390x844 (Playwright, Skript `worklog/.r183-kursmodal-measure.mjs`)

| Messgroesse | vorher | nachher |
|---|---|---|
| Sichtbare Elemente Schritt 1 | 22 | **15** |
| Sichtbare Elemente Schritt 2 | 28 | **22** |
| Ueberschriften S1 / S2 | 4 / 3 | 3 / 2 |
| Dialog scrollWidth | 364 | 364 (<= 390) |
| Dokument scrollWidth | 390 | 390 (<= 390) |
| Touch-Ziele < 40px | **1** (19px) | **0** |
| Fluss Rolle+Anmeldung | ok | ok |
| reduced-motion laufende Animationen | 0 | 0 |

Elemente gesamt: 50 -> 37. Das sind 13 weniger, kein Element dazu.

## Was WEG ist (und warum)

1. **`Schritt 1 von 2` / `Schritt 2 von 2`** — die Seite zaehlt schon oben
   (`1 · Kurs -> 2 · Anmeldung -> 3 · Fertig`). Zwei Zaehler fuer einen Fluss.
2. **Ueberschrift `Anmeldung` (Schritt-Titel)** — stand wortgleich 90px ueber der
   Gruppen-Ueberschrift `Anmeldung`. Dasselbe Wort zweimal auf einem Bildschirm.
3. **`Für die Balance im Kurs.`** — rechtfertigte die Frage, half nicht bei der Wahl.
4. **Kopfzeile: Wochentag, Uhrzeit, Lehrer** — Absprache 17.08.: Kursseite traegt die
   Infos. Der Nutzer hat genau diese Zeile in der Liste angeklickt. Wann/Wo stehen
   nach dem Absenden wieder da (SuccessPanel), dort sind sie neue Information.
5. **Label `Kurs buchen:`** — der Absende-Knopf sagt `Platz reservieren`.
6. **Ueberschrift `Deine Daten`** — jedes Feld darunter traegt sein Label.

## Was BLEIBT bedienbar

Rolle (Follower/Leader), Anmeldung (Allein/Als Paar), Aushilfe-Haken, alle Datenfelder,
Datenschutz, Absenden. Gemessen: `roleTilesPresent/rolePressed/firstNameVisible/
emailVisible/submitVisible/submitInViewport/privacyVisible` = alle true.

## Zugaenglichkeit nicht verschlechtert

- Dialog traegt jetzt `aria-label="Kurs buchen: <Kursname>"` — die Handlung bleibt
  angesagt, obwohl die sichtbare Ueberschrift nur den Kursnamen zeigt.
- Feldgruppe `Deine Daten` bleibt als `sr-only`-Legende (`hideLegend`), `aria-labelledby`
  unveraendert. Gemessen: im sichtbaren Text nicht vorhanden, im Baum schon.
- Fokus nach Schrittwechsel: S1 -> `Ich tanze als`, S2 -> `step1-summary`
  (gemessen: `document.activeElement` = `step1-summary`). Offene Klasse: siehe
  Fix-Runde 2 unten — dort ist der Anker jetzt der Hinweis der offenen Klasse.

## Touch-Ziel-Fix (gemessen, nicht geschaetzt)

Der Inline-Link `Datenschutzerklärung` mass **19px** und lag mitten im Klick-Text der
Checkbox — ein Fehlgriff setzte den Haken statt die Seite zu oeffnen. Der Link steht
jetzt als eigene Zeile NEBEN dem Label (nicht darin) mit `min-h-11`. Danach 0 Ziele < 40px.

## Sonderfall offene Klasse (Heels) geprueft

Kein Heels im Live-Plan diese Woche. Zweig darum erzwungen: `page.route` patcht
`styleKey` auf `heels`. Ergebnis: kein Schritt 1, Datenfelder sofort da,
`step1-summary` korrekt abwesend, submit im Viewport, scrollWidth 364, 0 Ziele < 40px,
kein PAGEERROR. PNG: `nachher-offeneklasse.png`.

Diese Runde-1-Messung sah den Zweig zwar laufen, prueft aber den fehlenden Hinweis
nicht — genau die Luecke, die `kimi-critic` fand. Siehe Fix-Runde 2 unten.

## Belege

- `npx oxlint src/public/BookingPanel.tsx` -> Exit **0**
- `npx tsc --noEmit` -> Exit **0**
- `git diff --stat` -> `1 file changed, 128 insertions(+), 81 deletions(-)` (nach Fix-Runde 2)
- `git status --porcelain src/public/` ausserhalb der Nachbar-Items -> nur `M BookingPanel.tsx`

## Fix-Runde 2 — toter Fokus-Anker der offenen Klasse (Fund kimi-critic)

**Der Fund stimmt.** `visibleStep` ist bei einer offenen Klasse fest `2`
(`const visibleStep: 1 | 2 = isOpen ? 2 : step`). Der `isOpen`-Zweig mit
`ref={stepHeadingRef}` stand aber innerhalb von `{visibleStep === 1 && ...}` und
konnte darum nie rendern. Zwei echte Folgen, nicht nur toter Code:

1. **`bt.openClassNote` war fuer jeden Nutzer unsichtbar.** Der einzige Satz, der
   erklaert «hier gibt es keine Rollen», stand in einem Zweig, den React nie baut.
2. **Schritt 2 hatte fuer offene Klassen gar kein Fokus-Ziel.** `stepSummaryRef` hing
   hinter `{!isOpen && ...}`. Beide Anker waren `null`, der Fokus fiel still ins erste
   Namensfeld (`bk-firstName`) — mitten in ein Pflichtfeld, ohne Kontext.

**Fix (chirurgisch, eine Datei).** Der Hinweis wandert dorthin, wo er sichtbar ist:
in Schritt 2, in denselben Slot wie die Auswahl-Zeile, mit demselben `stepSummaryRef`.
Damit hat jeder Schritt genau einen echten Anker. Der tote `isOpen`-Zweig in Schritt 1
ist weg, `stepHeadingRef` ist auf `HTMLHeadingElement` verengt (haengt nur noch am `h3`).
Der `querySelector`-Fallback bleibt als Absicherung, sein Kommentar sagt jetzt die
Wahrheit statt «fuer die offene Klasse».

**Der Regressionstest faellt auf dem alten Code durch** — sonst waere er wertlos.
Skript: `worklog/.r183-openclass-focus.mjs` (erzwingt `styleKey='heels'` per `page.route`).

| Lauf | Ergebnis |
|---|---|
| VORHER (`git stash`, alter Stand) | **Exit 1**: `present:false`, `Hinweis nicht im DOM`, Fokus haette auf `bk-firstName` gelegen |
| NACHHER (Fix) | **Exit 0**: `present:true`, `visible:true`, Text `Offene Klasse - keine Rollenwahl noetig.`, `tabIndex="-1"`, `activeElement = open-class-note` |

Der Fix-Stand wurde nach dem Stash-Test byte-identisch zurueckgeholt (`diff -q` ok).

Acceptance erneut, alle vier gruen (`worklog/.r183-kursmodal-measure.mjs`, Exit 0):
Ueberlauf 364 <= 390 · Elemente S1 15 / S2 22 (unveraendert, der Fix betrifft nur den
offenen Zweig) · Fluss alle 7 Flags true · reduced-motion 0 Animationen, Opacity 1.
Offene Klasse zusaetzlich: 0 Touch-Ziele < 40px, submit im Viewport, kein PAGEERROR.
`npx oxlint` Exit **0**, `npx tsc --noEmit` Exit **0**.

PNGs selbst angesehen (Read): die offene Klasse fuehrt jetzt sichtbar mit
«Offene Klasse - keine Rollenwahl noetig.», danach direkt die Datenfelder.
Schritt 1 der Rollen-Kurse ist unveraendert.

## Offen (gehoert NICHT mir)

- **G1 Exit 1.** Vier Funde, alle `edge-content-crush` an den Bildraendern. Das ist der
  abgedunkelte Seiten-Hintergrund hinter dem Modal-Overlay, kein Layoutfehler.
  Beleg, dass es kein Regress ist: dasselbe Skript meldet denselben Fund mit demselben
  `mean=163` auf dem **Vorher**-PNG (`vorher-offeneklasse.png`). Nachgemessen sind die
  Randpixel `rgb(125,125,124)` mit 11 verschiedenen Werten — vorher und nachher
  pixelgleich, also kein einfarbiger abgeschnittener Balken.
- **Ship-Manifest invalid.** Datei: `worklog/shots/r183-kursmodal/ship-kursmodal.json`
  (eigenes Item-Manifest; das Root-`ship-manifest.json` gehoert einem Nachbar-Item und
  liegt nicht mehr am Wurzelpfad — nicht angefasst). Exit 1 aus genau zwei Gruenden:
  `g1_exit != 0` (siehe oben, vorbestehend) und `critic_verdicts` leer.
  Ein Builder benotet sich nicht selbst — die Kritiker routet der Parent.

ABANDON: leftover-other-round nicht R189-Rest
