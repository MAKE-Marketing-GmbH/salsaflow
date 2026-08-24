# STATUS R183 — Video 19 Soll-Punkte + Raphael 20.08.

Worktree `salsaflow-w1`, Branch `geil-welle`, Vite `http://127.0.0.1:5175`.
**Production unberührt.** Kein `git push origin main`, kein `vercel --prod`.

Beweis:
- `node worklog/.r183-check.mjs all` → **12/12 PASS, Exit 0**
- `node worklog/.r183-klicktest.mjs` → **15/15 PASS, Exit 0**

Jede Zahl stammt aus einem Playwright-Lauf gegen 5175.
Cookie per `localStorage['salsaflow-cookie-ok']='1'`, CookieBanner unangetastet.

## Pro Fläche: src, Radius, Kopf ganz

| Fläche | src | Radius | Kopf ganz | Gate |
| --- | --- | --- | --- | --- |
| Home Hero | `hero-paar-dreh-01.webp` | 24px | ja | G1/G4 |
| Home Teamfoto | `hp-29` | 24px, inset 52px → echte Karte | ja | G30 PASS |
| Tanzkurse Hero | `kurse-classfreude-hero-2100.webp` | 24px | ja | G25 PASS |
| Kursplan Hero | `hero-paar-studiowand-hero-2100.webp` | 24px desktop / 24px mobil | ja | G28 PASS |
| Danceflow Sektion 2 | `danceflow/05-v3.webp` 1360×2048 | `--radius-media` | ja, Scheitel 9.5 % und Kinn 30 % im Bild | G29 PASS |
| Team Hero | `showcase/hp-03-2880.webp` | full-bleed, pos 56 % | ja | R180 gehalten |

## Raphael 20.08. — Punkt für Punkt

| Forderung | Stand | Beleg |
| --- | --- | --- |
| Tanzkurse-Bilder rund | erfüllt | G25 radius 24px |
| Mehr verschiedene Fotos | erfüllt | G26 unique 11, Doubletten 0 (vorher `offer-bachata.webp` ×2) |
| Kursplan-Hero nicht gestreckt | erfüllt | G28 Faktor 1.38 (Band 3.21:1, Quelle 2.33:1) |
| Kursplan rund wie der Rest | erfüllt | G28 radius 24px desktop und mobil (vorher 0/0) |
| Danceflow Sektion 2 Kopf ganz | erfüllt | `aspect-[4/3]`+`center_42%` → `aspect-[4/5]`+`center_20%` |
| DE/EN komplett rund | erfüllt | G22 je 44×44, Pillen-Kapsel entfernt, zwei eigene Kreise |
| Mobil-Header simpel, Schliessen im Header | erfüllt | G23 ein Schalter, Schliessen top 12px |
| Dropdown nach rechts | erfüllt | G24 Tanzkurse 373=373, Events 574=574, Mehr 735=735 |
| Fotos ohne Bildtext, mehr Fotos | erfüllt | G32 128 Kacheln (vorher 82), 0 Bildtexte, 0 ohne Namen |
| Level/Aufbau weniger Text | erfüllt | G27 119 Wörter, Schwelle 120 |
| Kontakt-Formular Mobil besser | erfüllt | G33 0 Überläufe, 0 Touch-Ziele < 40px, scrollWidth 390/390 |
| Kursmodal klarer | erfüllt | Kursplan-Karte → `/buchung?kurs=…`, 3 Schritte, Klicktest durchgelaufen |
| Animation ganze Seite | erfüllt | G34 Tokens gesetzt, unter `reduced-motion` 0 animiert |
| Home Teamfoto nicht rund-am-Rand | erfüllt | G30 inset 52px + radius 24px |
| Unter dem Hero Luft | erfüllt | G31 134px bis `<h2>` |
| Backend/CMS | erfüllt | G35 `npm run verify` 18/18 grün, Exit 0 |

## G35 Backend/CMS: erfüllt, die Ursache waren Dateirechte

`npm run verify` liefert `VERDICT: PASS (18/18 Checks grün)`, Exit 0, Treiber
pglite. 16/16 Tabellen, 10 Stile, 26 Rungs, 5 Tarife, 21 Lehrer, 37 Kurse,
222 Preise. Login gibt 200, `/me` ohne Cookie gibt 401.

Der Abbruch mit `RuntimeError: unreachable` kam aus den Dateirechten.
Vier Dateien in `.data/pglite` gehörten **root**, angelegt bei einem Lauf am
19.08.: `postmaster.pid`, `pg_logical/replorigin_checkpoint`,
`global/pg_internal.init` und `base/1/pg_internal.init`. Der Nutzer
`raphael-claude` konnte sie nicht räumen, also scheiterte `_pg_initdb`.

Belegt durch Halbierung: ein blankes `PGlite.create()` lief unter derselben
Node-Version fehlerfrei durch. Erst `new PGlite('.data/pglite')` brach ab.
Damit zeigt der Test auf den Ordner. `postmaster.pid` trug PID `-42`,
pglites Platzhalter für „kein Prozess", und den fremden Pfad `/tmp/pglite/base`.
Kein lebender Halter, `fuser` fand nichts.

Die vier Dateien sind Lock und Cache. Postgres schreibt sie beim Start neu,
Nutzdaten liegen keine darin. Sicherung vor dem Eingriff:
`/tmp/pglite-backup-20260820`, 28M.

Meine erste Diagnose war falsch. Der `git stash`-Gegentest zeigte richtig, dass
R183 unschuldig ist. Daraus habe ich auf die Bibliothek geschlossen statt auf
die Dateirechte und den Punkt als unlösbar abgelegt. Ein Halbierungstest hätte
das sofort geklärt.

## Klicktest: der echte Gastweg

15 Schritte, alle PASS:

- Dropdown Tanzkurse, Events, Mehr — Panel sitzt links am Trigger
- Kursplan lädt 9 Kurskarten
- Karte klicken → `/buchung?kurs=<uuid>`
- Buchung Schritt 1 Kursdaten, Schritt 2 Rolle (Follower/Leader, Allein/Als Paar)
- Buchung mobil: scrollWidth 390/390, 22 Felder, 0 zu klein, Tippen kommt an
- Mobil-Menü: Panel 0px → 548px → 0px, `aria-expanded` true
- Kontakt: Anliegen wählen → Textfeld → Tippen kommt an, kein Überlauf

## Vier Gate-Fehler auf meiner Seite

Die Messung war kaputt, die Seite nicht. Jeder Fall hätte einen Builder
auf einen Phantomfehler angesetzt:

- **G31** maß 33px Luft. Das war der schwebende WhatsApp-Blob, kein Seiteninhalt.
  Fix: `position: fixed/sticky` fliegt aus der Messung. Echte Luft: **134px**.
- **G33** meldete 8 Touch-Ziele unter 40px. Das waren visuell versteckte
  1×1-Radio-Inputs, deren Label die Klickfläche ist. Fix: Label-Fläche zählt.
  Danach **0 zu kleine Ziele**.
- **G32** meldete 3 Bilder ohne alt. Es sind Reel-Poster in einem Button mit
  `aria-label`; leeres `alt` ist dort richtig. Fix: nur Bilder ohne jeden
  zugänglichen Namen zählen. Danach **0**.
- **G24** stürzte mit „Execution context destroyed". `click()` auf den Trigger
  navigiert weg, weil der Trigger ein Link ist. Fix: `hover()`.

Dazu zwei eigene Fehlurteile am Code: Danceflow schien unrepariert, weil `rg`
Zeile 119 traf — das ist der Hero, der Fix sitzt in `WhySection`. Und der
`<style>`-Block in `SchedulePage.tsx:205` sah nach Textleck aus; `innerText`
zeigt nichts davon auf der Seite.

## Sweeps

- Desktop `worklog/shots/S7-ux183/`: Exit 0, 110 Shots
- Mobil `worklog/shots/S7-ux183-mobil/`: Exit 0, 212 Shots
- Final `worklog/shots/S7-ux183-final/`: Exit 0, 109 Shots

`/tanzkurse` brach im Mobil-Lauf einmal ab (`Execution context destroyed`).
Ursache war ein Vite-Reload, weil ein Builder zeitgleich speicherte.
Der Fold-PNG existiert und ist gelesen.

Gelesene Folds: home desktop + mobil, tanzkurse desktop + mobil,
kursplan desktop + mobil, danceflow desktop y750, buchung mobil.

## Locks gehalten

Salsa `center 14%` · Bachata `center 20%` + party-33 · Heels `center 12%` ·
Events party-47 + `object-[center_20%]` + `lg:h-[28rem]` · WhatsApp rechts unten
weiß auf grün · CookieBanner `pr-[5.5rem]` unangetastet · Collabs nicht angefasst ·
keine Team-Porträts im Raster · `kit.tsx` unverändert.

Danceflow Zeile 119 (Hero) bleibt bewusst `aspect-[4/3]` + `center_42%`.
Raphael meinte Sektion 2, nicht den Hero.
