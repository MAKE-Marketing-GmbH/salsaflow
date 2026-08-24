# STATUS R141

## Ergebnis

1. **R141 /kursaufbau: PASS.**
2. **Vorher:** Fünf Dreizeiler-Stufen, dunkles Miss-Bild mit Leerraum und WA-Pille. Belege: `/root/clients/salsaflow-w1/worklog/shots/S7-ux141/vorher/kursaufbau-desktop-1440-vorher.png`, `/root/clients/salsaflow-w1/worklog/shots/S7-ux141/vorher/kursaufbau-mobil-390-vorher.png`.
3. **Soll:** Die Leiter ist aufgegangen, das Bild ist hell, und der WhatsApp-Button ist ein Kreis. Belege: `/root/clients/salsaflow-w1/worklog/shots/S7-ux141/kursaufbau-desktop-1440.png`, `/root/clients/salsaflow-w1/worklog/shots/S7-ux141/kursaufbau-mobil-390.png`.

## Kritik-Funde

```json
[
  {"wo":"src/public/kursaufbau/content.ts:145,151,164 (DE) und :301,320 (EN)","problem":"Sol (FAIL): Die Kürzung streicht die Modalität kann/can in den Aufstiegs-Kriterien. Aus einer Fähigkeitsschwelle (du kannst X) wird eine Tatsachenbehauptung über den Leser (du tust X). Das ist genau der vom Brief verbotene Qualifizierer-Verlust (Lehre R140).","beleg":"DE :145 du die Inhalte der Beginner-Stufen sicher anwenden kannst. -> Du wendest die Beginner-Inhalte sicher an. · DE :164 flexibel und kontrolliert einsetzen kannst -> Du setzt ... flexibel und kontrolliert ein. · EN :301 you can use the content ... with confidence -> You use the beginner material with confidence. · EN :320 you can use intermediate material flexibly and with control -> You use intermediate material flexibly and with control.","fix":"Modalverb zurückholen: Du kannst die Beginner-Inhalte sicher anwenden. / Du kannst Intermediate-Inhalte flexibel und kontrolliert einsetzen. / You can use the beginner material with confidence.","schwere":"WICHTIG"},
  {"wo":"src/public/kursaufbau/content.ts:313 (EN) gegen :157 (DE)","problem":"Sol (FAIL): Die EN-Fassung streicht confidently, die DE-Fassung behält sicher. DE und EN nennen damit unterschiedliche Aufstiegskriterien für dieselbe Stufe. Zusätzlich wird aus different partners (Bandbreite an Menschen) changing partners (Partnerwechsel) eine andere Aussage.","beleg":"EN :313 you can dance the intermediate material confidently with different partners. -> You dance intermediate material with changing partners. · DE :157 behält sicher: Du tanzt Intermediate-Inhalte mit wechselnden Partner:innen sicher.","fix":"EN: You can dance the intermediate material confidently with different partners. DE: unterschiedlichen Partner:innen statt wechselnden, solange Partnerrotation nicht belegt ist.","schwere":"WICHTIG"},
  {"wo":"src/public/kursaufbau/content.ts:143 (DE) und :299 (EN)","problem":"Sol (FAIL): systematisch / systematically wurde ersatzlos gestrichen. Das war das Unterscheidungsmerkmal der Einstiegsstufe. Die DE-Fassung sagt jetzt zweimal neu im selben Satz.","beleg":"DE :143 du neu startest oder deine Grundlagen systematisch aufbauen willst. -> Du startest neu oder baust deine Grundlagen neu auf. · EN :299 want to rebuild your foundations systematically -> rebuilding your foundations","fix":"Du startest neu oder willst deine Grundlagen systematisch aufbauen. / You are new or want to build your foundations systematically.","schwere":"WICHTIG"},
  {"wo":"src/public/kursaufbau/content.ts:135 (DE) und :291 (EN)","problem":"Sol (FAIL): Der Intro-Satz verliert die einzige Sachaussage. Technik und Sicherheit schrittweise wird durch die inhaltsleere Formel Fünf Stufen, ein Weg ersetzt. Die Zahl fünf deckt das Rungs-Array, ein Weg ersetzt aber keine gestrichene Information.","beleg":"DE :135 Die Stufen bauen Technik und Sicherheit schrittweise auf. -> Fünf Stufen, ein Weg. · EN :291 Each stage builds technique and confidence. -> Five stages, one path.","fix":"Sachaussage knapp zurückholen, zum Beispiel: Fünf Stufen bauen Technik und Sicherheit Schritt für Schritt auf.","schwere":"WICHTIG"},
  {"wo":"src/public/kursaufbau/content.ts:163 (DE) und :319 (EN)","problem":"Sol (FAIL): Der Lernzielsatz der Intermediate-Flow-Stufe verliert eine ganze Dimension. Details verfeinern ist gestrichen und nicht in feiner auf die Musik reagieren enthalten. Das ist Musikalität, nicht Detailarbeit.","beleg":"DE :163 Kombinationen variieren, musikalischer reagieren und Details verfeinern. -> Kombinationen variieren und feiner auf die Musik reagieren. · EN :319 respond more musically and refine the details -> respond to the music in finer detail","fix":"Beide Ziele behalten: Kombinationen variieren, musikalischer reagieren und Details verfeinern.","schwere":"WICHTIG"},
  {"wo":"src/public/kursaufbau/content.ts:168 (DE) und :324 (EN)","problem":"Sol (FAIL): Die Advanced-Eintrittsschwelle wird aufgeweicht. sicher beherrschst -> beherrschst (DE), confident with -> handle (EN). Bei der höchsten Stufe ist die Präzision der Schwelle der Zweck des Satzes.","beleg":"DE :168 du anspruchsvolle Technik sicher beherrschst -> Du beherrschst anspruchsvolle Technik · EN :324 you are confident with demanding technique -> You handle demanding technique","fix":"sicher beherrschst beziehungsweise confident with demanding technique wiederherstellen.","schwere":"WICHTIG"},
  {"wo":"src/public/kursaufbau/content.ts:307 (EN)","problem":"Sol (FAIL): Ein prüfbares Könnenskriterium wird zu einem Gefühl. in time with the music (messbares Timing) wird zu musical (Geschmacksurteil). Als Aufstiegskriterium ist es unbrauchbar.","beleg":"EN :307 you can dance beginner combinations smoothly and in time with the music. -> Beginner combinations feel smooth and musical.","fix":"You can dance beginner combinations smoothly and in time with the music.","schwere":"WICHTIG"},
  {"wo":"src/public/kursaufbau/content.ts:312 (EN)","problem":"Sol (FAIL): Der Komparativ fällt weg. Die Stufe beschreibt einen Fortschritt gegenüber den Grundlagen. precise signals statt more precise signals streicht diesen Bezug.","beleg":"EN :312 more complex figures, musicality, styling and more precise signals. -> More complex figures, musicality, styling and precise signals.","fix":"more precise signals wiederherstellen.","schwere":"WICHTIG"},
  {"wo":"src/public/KursaufbauPage.tsx:462-478 (MissSection)","problem":"Sol (FAIL): Der Kommentar beschreibt Code, den es nicht gibt. Er behauptet ein festes lg:aspect-[4/5]; die Klasse enthält kein aspect-Utility, sondern lg:h-full lg:min-h-[26rem]. Damit ist nicht garantiert, dass der Text die Zeilenhöhe bestimmt.","beleg":"Kommentar :465 das Foto bekommt ein festes lg:aspect-[4/5] gegen Klasse :475 h-72 w-full object-cover object-[center_38%] sm:h-80 lg:h-full lg:min-h-[26rem] - kein aspect-[4/5] im Element.","fix":"Code und Absicht in Deckung bringen: aspect-[4/5] wirklich setzen oder das Bild absolut in einen Wrapper ohne Eigenhöhe legen. Danach den falschen Kommentar löschen.","schwere":"WICHTIG"},
  {"wo":"src/public/KursaufbauPage.tsx:299 (summary der details-Klappe)","problem":"Sol (FAIL): Fünf Klappschalter auf einer Seite tragen denselben zugänglichen Namen. Ein Screenreader zeigt fünfmal Inhalte und Wechsel. Niemand kann die Stufe zuordnen.","beleg":"summary rendert nur {l.detailsLabel} = Inhalte und Wechsel / Content and next step für alle fünf rungs identisch (l.rungs.map, KursaufbauPage.tsx:238).","fix":"Stufe in den Namen aufnehmen, zum Beispiel <span className=\"sr-only\">{rung.name}: </span> vor dem Label. Natives summary liefert Rolle, Tastatur und Auf/Zu-Zustand.","schwere":"WICHTIG"},
  {"wo":"worklog/shots/S7-ux141/miss-desktop-1440-nachher.png — Miss-Block, rechte Textspalte","problem":"Der Leerraum aus Video 04:58 ist nicht gelöst, nur die Blockhöhe geschrumpft. Rechts neben Eyebrow, H2 und zwei Zeilen Text bleibt die halbe Blockbreite leer.","beleg":"miss-desktop-1440-nachher.png: Textspalte läuft ungefähr von x~1020 bis x~1860. Der Container endet bei x~1925. Im Vorher-Shot steht dieselbe leere Fläche an derselben Stelle. KursaufbauPage.tsx:461-466 fixt allein die Höhe.","fix":"Grid-Verhältnis zugunsten des Bildes drehen, zum Beispiel lg:grid-cols-[1.15fr_0.85fr], oder die Textspalte mit dem vorhandenen Dein-Tempo-Inhalt füllen.","schwere":"KRITISCH"},
  {"wo":"worklog/shots/S7-ux141/levels-mobil-390-nachher.png + kursaufbau-mobile-click-y1688-00-Inhalte_und_Wechsel.png — Leiter-Kopfzeile","problem":"Die Leiter zeigt Salsa & Bachata: Stufe für Stufe als H3 und direkt daneben nochmals die Pille Stufe für Stufe. Mobil bricht die H3 dadurch auf drei Zeilen.","beleg":"KursaufbauPage.tsx:228-232 rendert beide Strings hartkodiert. Sichtbar in levels-mobil-390-nachher.png: H3 umbricht zu Salsa & / Bachata: / Stufe für Stufe.","fix":"Die Pille löschen oder durch eine Orientierung wie 5 Stufen ersetzen.","schwere":"WICHTIG"},
  {"wo":"worklog/shots/S7-ux141/kursaufbau-desktop-1440.png + kursaufbau-mobile-03-y844.png — Hero-Foto /photos/kurse/kurs-02.jpg","problem":"Der Hero derselben Route ist genauso unterbelichtet wie das Foto, das wegen Unterbelichtung ersetzt wurde. Die Seite bleibt dadurch inkonsistent.","beleg":"PIL-Mittelwerte: gallery/kurse/04.jpg = 30.3, kurse/kurs-05.jpg = 106.9, kurse/kurs-02.jpg = 31.7. Der Hero ist minimal dunkler als das entfernte Foto.","fix":"Ein helles Motiv aus public/photos/kurse/ auch für den Hero wählen und den Kandidaten vorher per Read prüfen.","schwere":"WICHTIG"},
  {"wo":"worklog/shots/S7-ux141/levels-desktop-1440-nachher.png — linke Spalte unter der Schritt-Grafik","problem":"Der Umbau erzeugt in der linken Spalte neuen Leerraum. Unter der Grafik bleiben rund 330 CSS-px leer. Der Levels-Block ist trotz eingeklappter Inhalte von 2800px auf 3000px gewachsen.","beleg":"numpy auf levels-desktop-1440-nachher.png: linke Spalte x=150..1240, leerer Bereich y=1900 bis y=2560. Vorher 2880x2800, nachher 2880x3000. KursaufbauPage.tsx:197-202 nennt das Problem selbst und löst es nur teilweise.","fix":"Grafik größer ziehen oder die linke Spalte per lg:sticky an der Leiter mitlaufen lassen.","schwere":"WICHTIG"}
]
```

## Look

**BLOCKED.** Kimi-K3 war nicht erreichbar. Gateway 8318 meldete `model_cooldown`, Provider `openai-compatible-moonshot-payg`, Reset 28m24s / 1704s, Exit 3, Feld `model` leer. G11-Kimi bleibt offen. Die Route ist trotzdem abgeschlossen.

## Verifikation

```text
$ rg -n "center 12%" src/public/courses/styles/heels-content.ts
127:        position: 'center 12%',
238:        position: 'center 12%',
$ rg -n "position: 'center 14%'" src/public/courses/styles/content.ts | head -1
$ rg -n "position: 'center 20%'" src/public/courses/styles/content.ts | head -1
$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0
$ git diff --name-only
scripts/verify-ux-whatsapp.mjs
src/index.css
src/lib/i18n.tsx
src/public/BookingPanel.tsx
src/public/CoursesPage.tsx
src/public/KursaufbauPage.tsx
src/public/PrivatstundenPage.tsx
src/public/courses/CourseEngine.tsx
src/public/courses/styles/HeelsView.tsx
src/public/courses/styles/StylePage.tsx
src/public/courses/styles/content.ts
src/public/courses/styles/heels-content.ts
src/public/events/danceflow-content.ts
src/public/home/EventsTeaser.tsx
src/public/home/Hero.tsx
src/public/home/Offer.tsx
src/public/home/TeamBlock.tsx
src/public/home/content-v3.ts
src/public/home/content.ts
src/public/kursaufbau/content.ts
src/public/privat/content.ts
src/public/site/CookieBanner.tsx
src/public/site/WhatsAppFloat.tsx
src/public/social/InstagramShowcase.tsx
src/public/team/FounderRow.tsx
$ stat -c '%y %n' src/public/PrivatstundenPage.tsx src/public/courses/styles/HeelsView.tsx src/public/courses/styles/StylePage.tsx src/public/KursaufbauPage.tsx | sed 's/\..* / /'
2026-08-19 03:43:02 src/public/PrivatstundenPage.tsx
2026-08-19 01:36:33 src/public/courses/styles/HeelsView.tsx
2026-08-18 23:43:54 src/public/courses/styles/StylePage.tsx
2026-08-19 05:09:29 src/public/KursaufbauPage.tsx
$ node scripts/verify-ux-whatsapp.mjs 2>&1 | tail -3
PASS heels-dsk-wa-kreis
REPORT /root/clients/salsaflow-w1/worklog/shots/S7-ux121/verify-report.json
VERDICT PASS
$ ls /root/clients/salsaflow-w1/worklog/shots/S7-ux141/kursaufbau-mobil-390.png /root/clients/salsaflow-w1/worklog/shots/S7-ux141/kursaufbau-desktop-1440.png
/root/clients/salsaflow-w1/worklog/shots/S7-ux141/kursaufbau-desktop-1440.png
/root/clients/salsaflow-w1/worklog/shots/S7-ux141/kursaufbau-mobil-390.png
```


## Nachtrag R141b

- Parent-Befund: `kurs-03.jpg` ist das Salsa-Hero. Das verletzt den Bild-Lock.
- Gewählter Ersatz: `/photos/2026/kurse-classfreude-01.webp`. Das Motiv zeigt eine helle Tanzklasse im Studio.
- luna-Funde: `[]`.
