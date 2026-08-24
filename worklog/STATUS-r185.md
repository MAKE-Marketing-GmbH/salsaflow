# STATUS R185: Signum als Strukturreferenz

Ein Eingriff, ein Baustein. Belege live gegen Vite 5175. Production unberührt.

## Die Strukturkarte

Elf Home-Bausteine, live gemessen (nicht aus Bildern geschlossen):

| # | Baustein | Frage | Führende Aktion |
|---|---|---|---|
| 1 | Hero | Kurs | `/kursplan` |
| 2 | Offer „Welcher Tanz passt zu dir?" | Tanzstil | keine gefüllte |
| 3 | ScheduleTeaser | Termin | `/kursplan` |
| 4 | WhyGrid | Vertrauen | keine |
| 5 | WallOfLove | Vertrauen | keine |
| 6 | EventsTeaser | Ausblick | `/events` |
| 7 | TeamBlock | Vertrauen | keine |
| 8 | PriceSignal | Preis | keine |
| 9 | Faq | Einwand | keine |
| 10 | LocationBand | Kontakt | `/schnupperstunde` |
| 11 | Instagram | Ausblick | keine |

## Die größte belegte Lücke

Baustein 1 und 2 stellten dieselbe Frage. Der Hero trug drei Stil-Pillen auf
`/tanzkurse/salsa`, `/tanzkurse/bachata` und `/tanzkurse/heels`. Die Sektion
darunter fragt „Welcher Tanz passt zu dir?" und führt auf exakt dieselben drei
Ziele, dort aber mit Foto, Erklärtext und Niveau.

Gemessen vorher: Pillen bei y=230, H1 erst bei y=282, Kursplan-CTA bei y=613.
Mobil y=382 gegen y=698. Die erste Aktion im Fold war damit eine Stilwahl ohne
Entscheidungshilfe. Das Fold-Gate verlangt den Kursplan.

Signum löst es anders: im Fold stehen nur Navigation und Bild, die Wege kommen
als eigenes Kapitel danach.

## Der Eingriff

Die drei Pillen sind raus. Ein Baustein, keine neue Ebene, kein Zusammenlegen.
Kein Weg geht verloren: die drei Ziele stehen in Sektion 2 und im
Header-Dropdown „Tanzkurse".

Danach führt der Hero nur noch `/kursplan` und `/schnupperstunde`, statt vorher
fünf Links. Die H1 rückt 60px hoch, der CTA ebenso. Die Google-Zeile mit 4,9 aus
104 Bewertungen rutscht dadurch in den Desktop-Fold — Vertrauen steht jetzt neben
der Hauptaktion, ohne dass etwas hinzugefügt wurde.

## Der Fehler, den ich dabei gebaut habe

Ohne die Pillen rutschte der Textblock 88px hoch. Zwei Zeilen des Lead-Absatzes
standen danach dunkelgrau auf dem dunklen Foto und waren nicht lesbar.

Die erste DOM-Messung sah das nicht: sie prüfte den `<img>` und meldete keine
Überlappung. Sichtbar wurde es erst im vergrößerten Bildausschnitt. Genau dafür
werden Bilder gelesen.

Der Vorlauf `pt-[calc(var(--hero-photo-h)-15.625rem)]` enthielt die Pillen in
seiner Rechnung. Beim Korrigieren habe ich zuerst das Vorzeichen verdreht: der
Wert wird abgezogen, ein größerer `pt` schiebt also nach oben. Mit 18.625rem lag
der Lead 96px im Foto statt 48px. Richtig ist 250px − 48px = 202px = 12.625rem.

Gemessen auf 360, 390 und 430: Lead beginnt bei y=574, Foto endet bei y=574. Die
Naht liegt zwischen H1 und Lead.

## Beweislage

| Prüfung | Ergebnis |
|---|---|
| `.r185-klicktest.mjs` | 10/10 PASS, Exit 0 |
| `.r183-check.mjs all` | 12/12 PASS, Exit 0 |
| `.r184-klicktest.mjs` | 9/9 PASS, Exit 0 |
| `npx oxlint` | Exit 0 |
| `npx tsc --noEmit` | Exit 0 |

Klicks geprüft: `/kursplan`, `/schnupperstunde` und `/tanzkurse` öffnen je das
richtige Ziel. Bilder in `worklog/shots/R185-signum-clarity/`, alle jünger als
die Quelle (Frische-Wache in `.r185-shots.mjs`).

## Rhythmus, gemessen

Desktop 14,3 Bildschirme, mobil 17,4. Über zwei Bildschirmen liegen nur:
ScheduleTeaser mobil 3,1 und TeamBlock desktop 2,3. Beides sind Kandidaten für
eine spätere Runde. Diese Runde ändert einen Baustein, und der ist vergeben.

## Offen

Der Working Tree trägt acht uncommittete Dateien aus früheren Runden, darunter
den `EventsPage.tsx`-Diff aus dem gestoppten R181-Lauf. R185 hat sie nicht
angefasst.
