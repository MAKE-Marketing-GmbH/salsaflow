# STATUS R186: Doms Feedback zur Home-Strecke

Vier Angebote direkt nach dem Hero. Der Kursplan bleibt die Hauptaktion.
Production unberührt.

## Was Dom wollte

Kundenwort, Message `3B2B2A2BA0B4A4776C88`: „Wenn me denn drufklickt am beste es
Video vo de Tänz (müen mir organisiere) und de Kursplan (gfileret) mit em agebot
vo dene Tänz wo mir hänn sowie d verlinkig zur kursbuechig".

Dazu drei Bilder: die Einsteiger-Sektion abgelehnt, die Angebotssektion
vereinfacht, der rote Kursplan-CTA bestätigt.

## Die vier Eingriffe

| Datei | Änderung |
|---|---|
| `HomePage.tsx` | `WhyGrid` rendert nicht mehr. Datei bleibt liegen, Import ist raus. |
| `home/content.ts` | Titel „Salsa, Bachata, Heels.". Eyebrow und Lead leer. Kartentitel gekürzt. |
| `home/Offer.tsx` | Privatstunden-Filter raus. Vier gleich große Fotokarten. |
| `courses/styles/StylePage.tsx` | Link führt auf `/kursplan?stil=${styleKey}`. |

Die Einsteiger-Sektion beantwortete vier Fragen, die die FAQ am Seitenende
ohnehin trägt. Kein Inhalt geht verloren.

## Was die Bilder gezeigt haben

Zwei Fehler standen erst im gerenderten Bild, nicht in der DOM-Messung.

**Der Link wiederholte den Titel.** Über „Salsa" stand nochmals „Salsa →". Der
Linktext sagt jetzt, wohin der Klick führt: „Kurse und Termine", bei
Privatstunden „Privatstunde anfragen".

**Zwei Eyebrows waren unlesbar.** Heels und Privatstunden sind oben helle
Motive. Weiß auf hellem Studio verschwand. Der Verlauf deckt jetzt bis zur
Mitte statt bis zu einem Viertel.

## Gemessen, nicht geschätzt

Desktop 1440: die vier Karten stehen bei x=52, 392, 732 und 1072. Privatstunden
steht ganz rechts. Mobil 390: dieselbe Reihenfolge von oben nach unten.

Der gefilterte Kursplan zeigt keinen fremden Tanzstil mehr. Salsa führt drei
Buchungslinks, Bachata und Heels je zwei. Ungefiltert sind es neun.

## Beweislage

| Prüfung | Ergebnis |
|---|---|
| `.r186-klicktest.mjs` | 20/20 PASS, Exit 0 |
| `.r183-check.mjs all` | 12/12 PASS, Exit 0 |
| `.r184-klicktest.mjs` | 9/9 PASS, Exit 0 |
| `.r185-klicktest.mjs` | 10/10 PASS, Exit 0 |
| `npx tsc --noEmit` | Exit 0 |
| `npx oxlint` auf den R186-Dateien | Exit 0 |

Bilder in `worklog/shots/R186-dom-home/`, alle jünger als die Quelle.

Zur Oxlint-Zeile: Der repoweite Lauf endet mit Exit 1. Die Meldungen stammen
aus `src/lib/api.ts`, `db/client.ts`, `api/index.ts` und `scripts/`. Eine davon
trifft `home/content.ts:106` und betrifft die Zeile `export const HOME`. Der
Gegentest gegen `git show HEAD:src/public/home/content.ts` zeigt dieselbe
Meldung, sie ist also älter als diese Runde. Geprüft wurde: `Offer.tsx`,
`HomePage.tsx` und `StylePage.tsx`, je Exit 0.

Zwei FAILs im ersten Klicktest waren Messfehler, keine Seitenfehler. Die
Buchung läuft in drei Schritten, die Felder liegen in Schritt 2; mein Test
suchte sie in Schritt 1. Der Header trägt vier Links auf `/kursplan`, mein Test
prüfte den ersten statt den roten CTA. Beide Prüfungen sind korrigiert.

## Materialbedarf: drei Tanzvideos fehlen

Dom will Videos der Tänze. Im Repo liegt keine Videodatei. Die Stilseiten
warten auf echtes Salsaflow-Material.

| Tanz | Zielort | Format | Dateipfad |
|---|---|---|---|
| Salsa | `StylePage.tsx`, Medien-Rahmen | 4:3 oder höher, mindestens 1920 breit | `public/videos/kurse-salsa-paar.mp4` |
| Bachata | `StylePage.tsx`, Medien-Rahmen | 4:3 oder höher, mindestens 1920 breit | `public/videos/kurse-bachata-paar.mp4` |
| Heels | `HeelsView.tsx`, Medien-Rahmen | 4:5, 1080 × 1350 | `public/videos/kurse-heels-gruppe.mp4` |

Länge je 10 bis 15 Sekunden, echte Salsaflow-Kurse.

**Zum Seitenverhältnis:** Salsa steht mobil auf `3/2`, ab Desktop auf `5/4`.
Bachata steht mobil auf `16/9`, ab Desktop auf `4/3`. Die Desktop-Werte sind
höher. Ein Video im Querformat 3:2 hat dafür zu wenig Höhe. Darum 4:3 oder
höher liefern und mobil beschneiden lassen.

**Zur Kopfhöhe:** Die Zuschnitte stehen fest. Bachata `center 20%` (deutsch)
und `center 22%` (englisch), Heels `center 12%`. Die Gesichter gehören ins
obere Drittel des Bildes.

**Zum Ordner:** `public/photos/2026/` trägt nur `.webp`. Videos gehören in
einen eigenen Ordner. Den gibt es heute nicht.

## Was die Kritiker gemeldet haben

Drei Kritiker haben die Bilder gelesen. Grok fiel mit `503 auth_unavailable`
aus, Kimi K3 kam nach der Fallback-Regel dazu.

**Beide meldeten verdeckte Kartentexte auf 390.** Der Befund stammt aus
`angebot-390.png`. Dieses Bild ist ein Element-Screenshot: Playwright rendert
die festen Leisten mit, obwohl sie im echten Viewport an anderer Stelle liegen.
Gemessen wurde daraufhin jede Karte einzeln im echten Sichtfenster. Ergebnis:
null Überdeckung auf allen vier Karten. Die Kopfzeile stand dabei bei
`top: -66px`, war also weggescrollt. Belege liegen als
`mobil-karte-salsa.png` bis `mobil-karte-privatstunden.png` daneben.

**Opus meldete drei echte Fehler im Bericht.** Alle drei sind korrigiert: der
Kommentar in `HomePage.tsx` behauptete einen liegengebliebenen Import, die
Oxlint-Zeile war zu kurz gefasst, und `const cards = o.cards` war eine
Umbenennung ohne Zweck.

**Zwei Vorwürfe halten dem Gegentest nicht stand.** Die Zusatzangebote
Gutschein und Shows seien verschwunden: `git show HEAD:src/public/home/Offer.tsx`
rendert sie ebenfalls nicht, sie lagen schon vorher nur in `content.ts`. Die
Oxlint-Meldung auf `content.ts:106` sei neu: dieselbe Meldung erscheint auf der
alten Datei.

## Offen

**Mobil ist die Schnupperstunde die einzige dauerhaft rote Fläche.** Der feste
Balken am unteren Rand führt auf `/schnupperstunde`. Der Lock aus R184 gibt die
gefüllte rote Hauptaktion dem Kursplan. `StickyCta.tsx` ist seit dem letzten
Commit unverändert, der Widerspruch ist also älter als diese Runde. R186 sperrt
die Mobil-Leisten, darum bleibt die Datei unberührt. Das braucht Raphaels Wort.

Im offenen Mobil-Menü stehen zwei gleich aussehende rote Knöpfe „Kursplan
ansehen" übereinander. Der Fund stammt aus R184 und ist älter als diese Runde.

Der Working Tree trägt 15 geänderte Dateien unter `src/` aus früheren Runden,
darunter den `EventsPage.tsx`-Diff aus dem gestoppten R181-Lauf. Zählt man die
unversionierten Dateien mit, sind es 259 Einträge.
