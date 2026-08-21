# STATUS R187: Bildauflösung siteweit

R187 prüft 27 öffentliche Haupt-Routen an fünf Viewports.

Stand 21.08.2026: R187 liegt auf `origin/main` und ist deployt. Der Auftrag
verbot Push und Deploy zunächst. Raphael hat das am 20.08. aufgehoben: erst
fertig bauen, dann pushen und deployen. Die Vorschau läuft unter
`https://salsaflow-dc.vercel.app`. Die Kundendomain `www.salsaflow-dc.com`
zeigt weiterhin auf die alte Seite und braucht Raphaels Freigabe.

## Ergebnis

| Größe | Wert |
|---|---|
| Haupt-Routen | 27 |
| Viewports | 390, 768, 1024, 1440, 1920 Pixel Breite |
| Sichtbare Bild-Vorkommen | 1655 |
| Bild/Route-Paare | 314 |
| Paare unter 2,0 | 49 |
| Betroffene Dateien | 42 |
| Eingebaute größere Fassungen | 6 |
| Kaputte Bildpfade | 0 |
| Ladefehler | 0 |
| Lauf-Fehler | 0 |

Die drei Zustände `/buchung/erfolg`, `/buchung/abbruch` und `/404` wurden zusätzlich geprüft.
Sie gehören nicht zum Raster der 27 Haupt-Routen.

## Eingebaute größere Fassungen

Jede neue Datei stammt aus einem größeren Original desselben Motivs.
Keine neue Datei überschreitet die Pixelmaße ihres Originals.

| Route | Motiv | Alte Quelle | Neue Quelle | Original | Dichte vorher | Dichte nachher | Ergebnis |
|---|---|---|---|---|---|---|---|
| `/events-workshops/eventkalender` | Danceflow Night | `/photos/premium/danceflow-home-1400.webp` 1400x934 | `/photos/premium/danceflow-home-3840.webp` 3840x2560 | `docs/bilder/assets/premium-2026-07-03/danceflow-home.jpg` 5618x3745 | 0.73 | **2.00** | PASS |
| `/mehr/collabs` | Team auf der Couch | `/photos/showcase/hp-27.webp` 1800x1200 | `/photos/showcase/hp-27-3840.webp` 3840x2560 | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` 5674x3782 | 0.94 | **2.00** | PASS |
| `/events-workshops/anniversary-weekend` | Community auf der Couch | `/photos/premium/community-story-1600.webp` 1600x1067 | `/photos/premium/community-story-2634.webp` 2634x1756 | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` 5674x3782 | 1.22 | **2.00** | PASS |
| `/events-workshops/anniversary-weekend` | Gruppe beim Tanzen | `/photos/events/event-03.jpg` 1600x1067 | `/photos/events/event-03-2634.webp` 2634x1756 | `docs/bilder/assets/photos/events/event-03.jpg` 4176x2784 | 1.22 | **2.00** | PASS |
| `/events-workshops/anniversary-weekend und /events-workshops/eventkalender` | Community-Wochenende | `/photos/premium/events-hero-1400.webp` 1400x787 | `/photos/premium/events-hero-1998.webp` 1998x1124 | `docs/bilder/assets/premium-2026-07-03/events-hero.jpg` 3200x1800 | 1.40 | **2.00** | PASS |
| `/mehr/collabs` | Zwei Tänzerinnen in Heels | `/photos/premium/offer-heels-1200.webp` 1200x1600 | `/photos/premium/offer-heels-1404.webp` 1404x1872 | `docs/bilder/assets/premium-2026-07-03/offer-heels.jpg` 2400x3200 | 1.71 | **2.00** | PASS |

Die Seitenverhältnisse bleiben gleich. Bestehende `object-position`-Werte gelten weiter.
R187 änderte den Buchungs-Hero auf den gebundenen Heels-Crop `center 12%`.

## Materialbedarf

Für 49 Bild/Route-Paare aus 42 Dateien fehlt eine passende größere Fassung.
Die Originalsuche prüfte zwölf Bildordner per RMSE-Vergleich.
Ein Motivwechsel braucht Raphaels Freigabe. Künstliche Hochskalierung bleibt ausgeschlossen.

| Dichte | Datei | Route | Natürliche Pixel | Größte CSS-Box | Mindestpixel | Seitenverhältnis | Crop | Ergebnis |
|---|---|---|---|---|---|---|---|---|
| **0.78** | `/photos/party/party-47.webp` | `/events` | 1500x1000 | 1920x448 @ 1920x1080 | **3840x896** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **0.78** | `/photos/party/party-29.webp` | `/events-workshops/floweekend` | 1500x1000 | 1920x256 @ 1920x1080 | **3840x512** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **0.82** | `/composites/graphic-world/step-bachata-line.webp` | `/tanzkurse` | 577x316 | 704x385.55 @ 768x1024 | **1408x772** | 1.826 | fill; Position beibehalten | MATERIALBEDARF |
| **0.83** | `/composites/heels-shoes-stilllife.webp` | `/mehr/tanzschuhe` | 1600x1600 | 1920x384 @ 1920x1080 | **3840x1053** | 1.000 | cover; Position beibehalten | MATERIALBEDARF |
| **0.83** | `/photos/kurse/kurs-05.jpg` | `/preise` | 1600x1065 | 1920x320 @ 1920x1080 | **3840x945** | 1.502 | cover; Position beibehalten | MATERIALBEDARF |
| **1.00** | `/photos/shows/show-14.webp` | `/fotos` | 310x470 | 311.5x472.27 @ 1440x730 | **623x945** | 0.660 | fill; Position beibehalten | MATERIALBEDARF |
| **1.00** | `/photos/2026/kurse-classfreude-01.webp` | `/schnupperstunde` | 1920x1280 | 1920x320 @ 1920x1080 | **3840x1503** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.07** | `/photos/party/party-20-v3.webp` | `/events-workshops/danceflow-night` | 2048x1360 | 1920x588.63 @ 1920x1080 | **3840x1178** | 1.506 | cover; Position beibehalten | MATERIALBEDARF |
| **1.07** | `/photos/party/party-31-v3.webp` | `/mehr/partys` | 2048x1360 | 1920x320 @ 1920x1080 | **3840x1124** | 1.506 | cover; Position beibehalten | MATERIALBEDARF |
| **1.09** | `/photos/2026/kurse-heels-energie-hero-2100.webp` | `/buchung` | 2100x900 | 1920x192 @ 1920x1080 | **3840x384** | 2.333 | cover; Position beibehalten | MATERIALBEDARF |
| **1.09** | `/photos/2026/kurse-classfreude-hero-2100.webp` | `/kontakt/standort-raumvermietung` | 2100x900 | 1920x480 @ 1920x1080 | **3840x960** | 2.333 | cover; Position beibehalten | MATERIALBEDARF |
| **1.14** | `/photos/party/party-15.webp` | `/mehr/partys` | 1500x1000 | 702x877.5 @ 768x1024 | **1404x1755** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.16** | `/photos/shows/show-03.webp` | `/shows-animationen` | 600x400 | 344x344 @ 768x1024 | **688x688** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.20** | `/photos/gallery/kurse/01.jpg` | `/preise` | 1600x1066 | 1336x572.56 @ 1440x730 | **2672x1146** | 1.501 | cover; Position beibehalten | MATERIALBEDARF |
| **1.21** | `/photos/gallery/kurse/04.jpg` | `/tanzkurse/bachata` | 1600x1066 | 702x877.5 @ 768x1024 | **1404x1755** | 1.501 | cover; Position beibehalten | MATERIALBEDARF |
| **1.22** | `/photos/events/event-04.jpg` | `/events-workshops/floweekend` | 1600x1067 | 702x877.5 @ 768x1024 | **1404x1755** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.23** | `/photos/shows/show-11.webp` | `/events-workshops/anniversary-weekend` | 1800x1200 | 658x977.84 @ 1440x730 | **1404x1956** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.29** | `/photos/2026/hero-paar-dreh-01.webp` | `/` | 1600x1066 | 868x824 @ 1920x1080 | **1736x1648** | 1.501 | cover; Position beibehalten | MATERIALBEDARF |
| **1.32** | `/photos/shows/show-16.webp` | `/shows-animationen` | 1800x1200 | 604.2x906.3 @ 1440x730 | **1408x1813** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.34** | `/photos/gallery/kurse/05.jpg` | `/tanzkurse` | 1600x1066 | 448x792.59 @ 1024x768 | **1408x1586** | 1.501 | cover; Position beibehalten | MATERIALBEDARF |
| **1.35** | `/photos/showcase/hp-29.webp` | `/` | 1800x1200 | 1336x593.77 @ 1440x730 | **2672x1188** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.37** | `/photos/2026/kurse-heels-energie-card-960.webp` | `/tanzkurse/heels` | 960x1200 | 702x300.84 @ 768x1024 | **1404x909** | 0.800 | cover; Position beibehalten | MATERIALBEDARF |
| **1.44** | `/photos/2026/kurse-classfreude-01.webp` | `/team` | 1920x1280 | 1336x751.5 @ 1440x730 | **3840x1503** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.46** | `/photos/2026/event-social-couple-01.webp` | `/tanzkurse/salsa` | 1920x1280 | 702x877.5 @ 768x1024 | **1404x1755** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.50** | `/photos/showcase/hp-03-2880.webp` | `/team` | 2880x1784 | 1920x694.72 @ 1920x1080 | **3840x1390** | 1.614 | cover; Position beibehalten | MATERIALBEDARF |
| **1.51** | `/photos/gallery/danceflow/05.jpg` | `/tanzkurse/bachata` | 1066x1600 | 704x484 @ 768x1024 | **1408x968** | 0.666 | cover; Position beibehalten | MATERIALBEDARF |
| **1.52** | `/photos/gallery/danceflow/06.jpg` | `/events-workshops/floweekend` | 1066x1600 | 702x526.5 @ 768x1024 | **1404x1053** | 0.666 | cover; Position beibehalten | MATERIALBEDARF |
| **1.52** | `/photos/gallery/kurse/06.jpg` | `/kontakt` | 1066x1600 | 702x526.5 @ 768x1024 | **1404x1404** | 0.666 | cover; Position beibehalten | MATERIALBEDARF |
| **1.52** | `/photos/gallery/kurse/06.jpg` | `/privatstunden` | 1066x1600 | 702x702 @ 768x1024 | **1404x1404** | 0.666 | cover; Position beibehalten | MATERIALBEDARF |
| **1.52** | `/photos/gallery/kurse/09.jpg` | `/team` | 1067x1600 | 704x528 @ 768x1024 | **1408x1056** | 0.667 | cover; Position beibehalten | MATERIALBEDARF |
| **1.55** | `/photos/party/party-07-v3.webp` | `/events-workshops/danceflow-night` | 2048x1360 | 704x880 @ 768x1024 | **1408x1760** | 1.506 | cover; Position beibehalten | MATERIALBEDARF |
| **1.57** | `/photos/2026/hero-paar-studiowand-hero-2100.webp` | `/kursplan` | 2100x900 | 1336x416 @ 1440x730 | **2672x832** | 2.333 | cover; Position beibehalten | MATERIALBEDARF |
| **1.57** | `/photos/2026/kurse-classfreude-hero-2100.webp` | `/tanzkurse` | 2100x900 | 1336x480 @ 1440x730 | **3840x960** | 2.333 | cover; Position beibehalten | MATERIALBEDARF |
| **1.65** | `/photos/gallery/kurse/08.jpg` | `/preise` | 1067x1600 | 648x432 @ 1440x730 | **1296x935** | 0.667 | cover; Position beibehalten | MATERIALBEDARF |
| **1.70** | `/photos/premium/offer-privat-square-1200.webp` | `/preise` | 1200x1200 | 704x528 @ 768x1024 | **1408x1272** | 1.000 | cover; Position beibehalten | MATERIALBEDARF |
| **1.71** | `/photos/shows/show-13.webp` | `/shows-animationen` | 1800x1200 | 583.11x699.72 @ 1440x730 | **1404x1400** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.71** | `/photos/showcase/hp-22.webp` | `/tanzkurse/heels` | 1200x1800 | 702x877.5 @ 768x1024 | **1404x1755** | 0.667 | cover; Position beibehalten | MATERIALBEDARF |
| **1.71** | `/photos/showcase/hp-06.webp` | `/tanzkurse/heels` | 1200x1800 | 702x561.59 @ 768x1024 | **1404x1124** | 0.667 | cover; Position beibehalten | MATERIALBEDARF |
| **1.74** | `/photos/2026/kurse-heels-energie-01.webp` | `/tanzkurse` | 1920x935 | 751.33x536.66 @ 1440x730 | **1503x1074** | 2.053 | cover; Position beibehalten | MATERIALBEDARF |
| **1.82** | `/photos/shows/show-07.webp` | `/shows-animationen` | 1800x1200 | 660x660 @ 1440x730 | **1408x1320** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.87** | `/photos/instagram/choreography-v2.webp` | `/` | 640x1136 | 342x273.59 @ 768x1024 | **684x1216** | 0.563 | cover; Position beibehalten | MATERIALBEDARF |
| **1.87** | `/photos/instagram/lady-style-v2.webp` | `/` | 640x1136 | 342x273.59 @ 768x1024 | **684x1216** | 0.563 | cover; Position beibehalten | MATERIALBEDARF |
| **1.87** | `/photos/instagram/lady-style-v2.webp` | `/fotos` | 640x1136 | 342x608 @ 768x1024 | **684x1216** | 0.563 | cover; Position beibehalten | MATERIALBEDARF |
| **1.87** | `/photos/instagram/choreography-v2.webp` | `/fotos` | 640x1136 | 342x608 @ 768x1024 | **684x1216** | 0.563 | cover; Position beibehalten | MATERIALBEDARF |
| **1.90** | `/photos/party/party-08.webp` | `/mehr/partys` | 1500x1000 | 702x526.5 @ 768x1024 | **1404x1053** | 1.500 | cover; Position beibehalten | MATERIALBEDARF |
| **1.93** | `/photos/shows/show-03.webp` | `/fotos` | 600x400 | 311.5x207.66 @ 1440x730 | **688x688** | 1.500 | fill; Position beibehalten | MATERIALBEDARF |
| **1.94** | `/photos/gallery/danceflow/11-v3.webp` | `/events` | 1360x2048 | 702x400 @ 768x1024 | **1404x1439** | 0.664 | cover; Position beibehalten | MATERIALBEDARF |
| **1.99** | `/photos/premium/offer-salsa-wide-1400.webp` | `/preise` | 1400x1000 | 704x396 @ 768x1024 | **1408x792** | 1.400 | cover; Position beibehalten | MATERIALBEDARF |
| **1.99** | `/photos/gallery/kurse/01.jpg` | `/tanzkurse` | 1600x1066 | 751.33x536.66 @ 1440x730 | **2672x1146** | 1.501 | cover; Position beibehalten | MATERIALBEDARF |

Die Mindestpixel stammen aus `R187-schwach-eindeutig.json`.
Bei mehrfach genutzten Dateien gilt das größte Ziel für alle Fundstellen.

### Warum die Tabelle Paare zählt und nicht Dateien

Die Tabelle hat 49 Zeilen, betrifft aber nur 42 Dateien. Sieben Dateien
stehen zweimal drin. Sie rendern auf zwei Routen verschieden groß und brauchen
darum je Route eine andere Pixelzahl:

| Datei | Route A | Route B |
|---|---|---|
| `/photos/2026/kurse-classfreude-01.webp` | `/schnupperstunde` 1.00 | `/team` 1.44 |
| `/photos/2026/kurse-classfreude-hero-2100.webp` | `/kontakt/standort-raumvermietung` 1.09 | `/tanzkurse` 1.57 |
| `/photos/shows/show-03.webp` | `/shows-animationen` 1.16 | `/fotos` 1.93 |
| `/photos/gallery/kurse/01.jpg` | `/preise` 1.20 | `/tanzkurse` 1.99 |
| `/photos/gallery/kurse/06.jpg` | `/kontakt` 1.52 | `/privatstunden` 1.52 |
| `/photos/instagram/choreography-v2.webp` | `/` 1.87 | `/fotos` 1.87 |
| `/photos/instagram/lady-style-v2.webp` | `/` 1.87 | `/fotos` 1.87 |

Ein Kritiker hat das gefunden. Eine frühere Fassung führte je Datei nur den
schlechtesten Fall und meldete darum 42 statt 49. Der Auftrag verlangt
jedes Bild auf jeder Route. Wer nach der kurzen Liste bestellt, kauft für die
zweite Route zu klein.

## Zweite Ursache: Kompressionsqualität, nicht Pixelzahl

Ein Kritiker sah auf `/kursplan` Blockkanten am Hinterkopf des Mannes. Ich habe
den Ausschnitt selbst gelesen. Der Befund stimmt. Die Dichte-Messung findet so
etwas nie: sie zählt Pixel und sagt nichts über ihre Kodierung.

Nachgemessen als Bytes je Pixel. Der Vergleich trägt nur bei gleicher Pixelzahl
und gleicher Rolle, denn ein ruhiges Motiv braucht von sich aus weniger Daten.
Die drei Hero-Bänder mit 2100x900:

| Datei | Bytes je Pixel |
|---|---|
| `hero-paar-studiowand-hero-2100.webp` | 0,0410 |
| `kurse-heels-energie-hero-2100.webp` | 0,0715 |
| `kurse-classfreude-hero-2100.webp` | 0,0743 |

`hero-paar-studiowand` trägt 55 Prozent der Datenmenge seiner Geschwister bei
gleicher Pixelzahl. Ein Tausch scheitert auch hier: `hero-paar-studiowand-01.webp`
(1920x1280) zeigt dieselbe Aufnahme, aber ein Bandschnitt aus 1920 Breite gibt
höchstens 1920 Pixel. Das Ziel sind 2672. Das wäre Hochskalierung.

## Angeschnittene Köpfe auf `/team` (behoben)

Ein Kritiker hat das gefunden. Ich habe es am Browserbild und am Quellfoto
nachgeprüft. Es stimmt. Auf `/team` kappte die Oberkante des Bandes die hintere
Reihe. Die Gesichter blieben ganz, angeschnitten war bei drei Personen der
obere Haaransatz. Raphael hat die Korrektur freigegeben. Sie ist eingebaut.

Das ist kein Auflösungsproblem. Die Dichte-Messung konnte es nie finden, weil
sie Pixel zählt und nicht, was im Rahmen steht.

Das Quellfoto ist in Ordnung: `hp-03-2880.webp` (2880x1784) zeigt alle Köpfe
vollständig, mit Luft darüber. Verloren gehen sie erst im Zuschnitt.
`TeamPage.tsx:318` setzte `position: center 56%`. Die Box ist bei Viewport 1440
nur 1440x345 groß. Sichtbar bleiben 690 Pixel Bildhöhe, 1094 fallen weg, davon
bei 56 Prozent **613 Pixel oben**. Genau dort sind die Köpfe.

Ich habe vier Zuschnitte gerendert und verglichen:

| Position | Oben abgeschnitten | Ergebnis |
|---|---|---|
| `center 56%` (vorher) | 613 px | hintere Reihe angeschnitten |
| `center 44%` | 481 px | Köpfe knapp angeschnitten |
| **`center 38%`** (jetzt) | **426 px** | **alle Köpfe ganz, Logo lesbar** |
| `center 32%` | 328 px | alle Köpfe ganz, dafür leere Wand |

**Eingebaut:** `TeamPage.tsx:318` steht auf `center 38%`. Eine Zeile, kein neues
Material, keine Ladekosten. Die 56 Prozent waren eine Entscheidung aus R180c;
Raphael hat das Überschreiben freigegeben.

**Beleg:** `worklog/shots/R187-crop-fix/team-1440.png`. Ich habe das Bild selbst
gelesen. Alle Köpfe der hinteren Reihe stehen ganz im Band, mit Luft darüber.
Das Mobilbild (`team-390.png`) zeigt das Motiv unverändert vollständig.

## Gekappte Hände auf `/events-workshops/eventkalender` (behoben)

Derselbe Fehlertyp, andere Route. Ein dritter Kritiker hat ihn gefunden, ich
habe das PNG selbst gelesen. Die Oberkante des Bandes schnitt die erhobenen
Hände ab: links fehlten Fingerspitzen, rechts war ein Arm mitten im Unterarm
durchtrennt. Das Motiv lebt vom Jubel nach oben. Genau der war weg.
Raphael hat die Korrektur freigegeben. Sie ist eingebaut.

Das Quellfoto ist in Ordnung. `danceflow-home-3840.webp` (3840x2560) zeigt
jede Hand vollständig, darüber ist noch die Decke mit den Lampen zu sehen.

WICHTIG, damit die Zuordnung stimmt: Dieses Bild ist einer meiner sechs
Tausche. Der Zuschnitt kommt aber **nicht** daher. Alt und neu haben dasselbe
Seitenverhältnis (1,4989 gegen 1,5000, das sind 0,07 Prozent Abweichung),
also schneidet die Box exakt gleich. Der Fehler war vorher da. Das schärfere
Bild macht ihn nur besser sichtbar.

Ursache war die fehlende `position`-Angabe. Ohne Wert gilt `center 50%`. Das
Band zeigt bei Viewport 1440 nur 555 von 2560 Pixeln Bildhöhe; bei 50 Prozent
fallen **1003 Pixel oben** weg.

| Position | Oben abgeschnitten | Ergebnis |
|---|---|---|
| `center 50%` (vorher) | 1003 px | Hände und Fingerspitzen gekappt |
| `center 30%` | 602 px | Hände fast ganz |
| **`center 22%`** (jetzt) | **441 px** | **alle Hände ganz, Gesichter im Bild** |
| `center 15%` | 301 px | viel Decke, Gesichter rutschen nach unten |

**Eingebaut:** `eventkalender-content.ts` trägt `position: 'center 22%'` an
beiden Fundstellen, deutsch und englisch. `EventkalenderPage.tsx:58` reicht den
Wert an `HeroFrame` durch. Der Wert stand dort vorher fest im Bauteil; jetzt
kommt er aus dem Content, damit er nur an einer Stelle steht.

**Beleg:** `worklog/shots/R187-crop-fix/eventkalender-1440.png`. Ich habe das
Bild selbst gelesen. Jede erhobene Hand steht ganz im Band, darüber sind Decke
und Lampen zu sehen. Das Mobilbild (`eventkalender-390.png`) bleibt vollständig.

## Ein Fall braucht deine Entscheidung: `hp-22.webp`

`hp-22.webp` auf `/tanzkurse/heels` liegt bei Dichte 1,71 und bräuchte
1404x1755 Pixel. Es hat 1200x1800.

Der Suchlauf sortierte es als „anderes Motiv" aus (RMSE 0,1193 gegen
`offer-heels.jpg`). Die Sichtprobe zeigt aber dieselbe Aufnahme: zwei
Tänzerinnen, gleiche Pose, gleiches Studio. Der Farbvergleich hat den
Unterschied überzeichnet. `hp-22` ist kühl abgestimmt, das Master warm.
In Graustufen mit ausgeglichenem Kontrast liegt der Wert bei **0,0040**.

Ausgetauscht habe ich es trotzdem nicht. Die Ausschnitte sind verschieden:
`hp-22` ist 2:3, das Master 3:4 (2400x3200). Eine Suche über Zoom und Position
findet als besten Neuschnitt `2133x3200+133+0` mit RMSE 0,159. Das liegt weit
über der Schwelle 0,06. `hp-22` ist zusätzlich nachbearbeitet.

Wie der Tausch aussähe, kannst du direkt sehen. Aus demselben Master ist auf
`/mehr/collabs` bereits `offer-heels-1404.webp` (1404x1872) entstanden, einer
der sechs eingebauten Tausche. Beide Dateien nebeneinander zeigen dieselbe
Aufnahme: zwei Tänzerinnen, gleiche Pose, gleiche Kleidung, gleiche Schuhe.
Der füllend-zentrierte Graustufenvergleich liegt bei RMSE 0,0286 und damit
unter der Schwelle 0,06. Sichtbar unterscheidet sich allein die Farbstimmung:
`hp-22` ist kühl und grau, die Master-Fassung warm und beige.

**Deine Entscheidung:** Aus dem Master wären 1404x1755 erreichbar. Das Bild sähe
wärmer und anders beschnitten aus. Das ist ein Motivwechsel, und der braucht
laut Auftrag deine Freigabe. Freigeben oder so lassen?

## Browserbelege

Das Manifest enthält 27 Haupt-Routen und 54 Fold-Bilder.
Die Pflichtgrößen sind 1440x730 und 390x844.
Pfad: `worklog/shots/R187-resolution/manifest.json`.

Nach den zwei Zuschnitt-Korrekturen kamen vier neue Fold-Bilder dazu:
`worklog/shots/R187-crop-fix/`. Ich habe alle vier selbst gelesen.

| Bild | Befund |
|---|---|
| `team-1440.png` | alle Köpfe der hinteren Reihe ganz, Logo lesbar |
| `team-390.png` | Motiv vollständig, unverändert |
| `eventkalender-1440.png` | jede erhobene Hand ganz, darüber Decke und Lampen |
| `eventkalender-390.png` | Motiv vollständig, unverändert |

## Die drei Kritikerstimmen

Kein Bericht geht raus, den der Ersteller selbst freigegeben hat. Drei
familienfremde Stimmen lasen echte PNGs:

| Stimme | Gelesen | Urteil |
|---|---|---|
| Kimi | 16 PNG plus 6 eigene 1:1-Ausschnitte | FAIL, Befunde behoben |
| Sol | 10 PNG, dazu `identify`- und `git`-Gegenrechnung | FAIL, Befunde behoben |
| Luna | 11 PNG plus eigene Nachrechnung aller Zahlen | 5 von 6 PASS |

Grok fiel mit HTTP 402 aus, das Guthaben war leer. Opus blieb außen vor: das
ist die Builderfamilie und darf die eigene Arbeit nicht abnehmen.

Lunas Zahlen decken sich mit meinen: 1655 Vorkommen, 27 Routen mit je fünf
Viewports, 314 Paare, 49 schwach aus 42 Dateien, 0 Lauf-Fehler. Die
Materialbedarf-Tabelle hat 49 Zeilen aus 42 Dateien, jede mit Zielpixelmaß.

**Lunas einziger FAIL**, nachgeprüft und bestätigt: Ein Kursplan-Bild wirkt
sichtbar weich. Luna nannte keinen Pfad, darum habe ich ihn selbst bestimmt.
Betroffen ist `/photos/2026/hero-paar-studiowand-hero-2100.webp`, sichtbar in
`worklog/shots/R187-resolution/kursplan-1440.png`. Am Bild geprüft: Haare und
Hemdmuster verlieren Zeichnung, die Wandfläche wirkt flau. Kein Gesicht ist
angeschnitten.

Beide Ursachen stehen bereits in diesem Bericht: die Dichte 1,57 in der
Materialbedarf-Tabelle, der Kompressionswert 0,0410 in der Tabelle darunter.
Ein Tausch scheitert an der Breite: die größere Fassung
`hero-paar-studiowand-01.webp` misst 1920x1280 und bleibt 752 Pixel unter der
gebrauchten Breite von 2672. Das wäre Hochskalierung, die der Auftrag verbietet.
Der FAIL ist ein belegter Materialmangel, kein Baufehler.

## Regression R183 bis R186

Alle vier Suiten liefen nach den Korrekturen. Kein Fehler hängt an R187:
die drei Auffälligkeiten liegen in den Testskripten, nicht in der Seite.

| Suite | Ergebnis | Bewertung |
|---|---|---|
| R183 | 3/4, `kontakt-tippen` rot | Testfehler. Die Schleife bricht eine Stufe zu früh ab. Nachgemessen: nach drei Stufen stehen drei Textfelder bereit. |
| R184 | Abbruch | Skript stirbt an „waiting for element to be stable". Kein Urteil möglich. |
| R185 | 4/4 PASS | grün |
| R186 | 19/20, wechselnder Fehler | Timing. Wartet die Probe auf die API-Antwort statt auf eine feste Zeit, laden alle drei Buchungslinks. |

Der R186-Fall ist nachgemessen: `/buchung?kurs=` lädt Salsa, Bachata und Heels
alle korrekt, sobald `/api/public/schedule` beantwortet ist. Beleg:
`worklog/.r187-buchung-probe2.mjs`. Ich habe kein Testskript geändert; das
gehört nicht zu R187.

## Locks

| Lock | Stand |
|---|---|
| Salsa 14 %, Bachata 20 %, Heels 12 % | erhalten |
| Events `party-47`, `center 20%`, Desktop 28rem | erhalten |
| Angebotskarten 46 %, 36 %, 20 %, 42 % | erhalten |
| Cookie `pr-[5.5rem]` | erhalten |
| Mobil-Vorlauf `12.625rem` | erhalten |
| Kursplan als gefüllte rote Hauptaktion | erhalten |
| Galerie ohne sichtbare Beschriftungen | erhalten |
| Production | gepusht und deployt nach Raphaels Freigabe vom 20.08. |
| Kundendomain `www.salsaflow-dc.com` | unberührt, zeigt auf die alte Seite |

### Was im Arbeitsbaum wirklich offen ist

Eine frühere Fassung schrieb „0 geänderte verfolgte Dateien". Das war
irreführend. Die Zahl galt dem Hauptcheckout. Für den Arbeitsbaum gilt sie
nicht. Ein Kritiker hat es gemeldet, der Einwand stimmt. Sauber getrennt:

| Ort | Stand |
|---|---|
| Hauptcheckout `/root/clients/salsaflow` (`main`) | 0 verfolgte Änderungen, 0 unpushed Commits |
| Arbeitsbaum `/root/clients/salsaflow-w1` (`geil-welle`) | **40 verfolgte Änderungen**, 268 unverfolgte |

Von diesen 40 stammen **5 Dateien** aus R187:
`events/anniversary-content.ts`, `events/eventkalender-content.ts` und
`more/collabs-content.ts` mit zusammen 14 geänderten `src:`-Zeilen, dazu
`TeamPage.tsx` und `EventkalenderPage.tsx` für die zwei freigegebenen
Zuschnitte. Dazu kommen 6 neue Bilddateien.
Die übrigen **35 Dateien** sind Altbestand aus R183 bis R186 und aus der
Anti-Slop-Runde (die `satisfies`-Umtypung, 20 Vorkommen über den Branch).
Sie lagen vor R187 im Arbeitsbaum und gehören nicht zu dieser Aufgabe.
Die 268 unverfolgten Dateien sind Worklog, Gates, Messskripte und Screenshots
aus allen Runden; nur die 6 Bilder davon gehören zu R187.

R187 wird als eigener Commit abgelegt: die 5 Quelldateien, die 6 Bilder und
die R187-Belege. Der Altbestand bleibt unangetastet im Arbeitsbaum liegen.
`git add -A` ist ausgeschlossen, jede Datei wird einzeln benannt.

## Belege

- `worklog/R187-messung.json`: Rohwerte.
- `worklog/R187-inventar.md`: alle 314 Bild/Route-Paare.
- `worklog/R187-originale.md`: Originalsuche und RMSE-Werte.
- `worklog/shots/R187-resolution/manifest.json`: Browserbilder.
