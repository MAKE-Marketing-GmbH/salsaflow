# STATUS R187: Bildauflösung siteweit

R187 prüft 27 öffentliche Haupt-Routen an fünf Viewports.
Der fertige Stand ist für den Release geprüft.

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

## Finale Crop-Korrekturen

Die zwei belegten Zuschnittfehler sind behoben.

- `/team` nutzt `center 38%`.
- `/events-workshops/eventkalender` nutzt `center 22%`.
- Desktop und Mobil zeigen alle Köpfe, Hände und Arme vollständig.
- Das Team-Logo bleibt lesbar.

Finale Browserbilder:

- `worklog/shots/R187-final-crops-desktop-v2`
- `worklog/shots/R187-final-crops-mobile-v2`

Drei unabhängige Kritiker lasen die echten PNGs und gaben PASS.

## Ein Fall bleibt unverändert: `hp-22.webp`

`hp-22.webp` auf `/tanzkurse/heels` liegt bei Dichte 1,71.
Der verfügbare Master ist wärmer und anders beschnitten.
Der Tausch wäre ein nicht freigegebener Motivwechsel.
Darum bleibt die Datei als MATERIALBEDARF dokumentiert.

## Browserbelege

Das Manifest enthält 27 Haupt-Routen und 54 Fold-Bilder.
Die Pflichtgrößen sind 1440x730 und 390x844.
Pfad: `worklog/shots/R187-resolution/manifest.json`.

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
| Production-Release | nach finaler Prüfung freigegeben |

## Belege

- `worklog/R187-messung.json`: Rohwerte.
- `worklog/R187-inventar.md`: alle 314 Bild/Route-Paare.
- `worklog/R187-originale.md`: Originalsuche und RMSE-Werte.
- `worklog/shots/R187-resolution/manifest.json`: Browserbilder.
