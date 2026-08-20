# R187 Original-Katalog — groesste vorhandene Fassung je Motiv

Frage je schwachem Bild: Liegt dieselbe Aufnahme im Repo in groesser?

## Wie geprueft wurde

Durchsucht sind zwoelf Ordner: `public/photos`, `public/composites`,
`public/graphics`, `docs/bilder/assets/masters`, `docs/bilder/assets/photos`,
`docs/bilder/assets/premium-2026-07-03`, drei `harvest`-Ordner,
`docs/bilder/assets/graphic-world`, `docs/bilder/live-site-bilder` und
`docs/bilder/redesign-2026-08`.

Der Dateiname zaehlt nicht als Beleg. Gegenprobe: `event-04.jpg` und das
gleichnamige Master zeigen zwei verschiedene Paare (RMSE 0,257).

Stattdessen misst der Lauf den Bildinhalt. Beide Fassungen kommen auf dieselbe
Groesse, dann vergleicht `compare -metric RMSE`. Zwei Wege, es zaehlt der
kleinere Wert:

1. **verzerrt** — stur auf 240x240 quetschen. Findet denselben Ausschnitt.
2. **beschnitten** — proportional fuellen, mittig schneiden. Findet dasselbe
   Motiv auch bei anderem Seitenverhaeltnis. Ohne diesen Weg fiele ein echtes
   3:2-Master zu einem 4:5-Webbild faelschlich durch.

Schwelle **RMSE 0,06**. Darunter ist der Unterschied Kompressionsrauschen,
der Ausschnitt also derselbe. Ein reiner Dateitausch genuegt. Darueber ist es ein
anderer Ausschnitt oder ein anderes Motiv; ein Tausch wuerde das Bild sichtbar
veraendern und braucht Raphaels Freigabe.

Warum gemessen und nicht angesehen: Beim Ansehen hielt ich
`offer-salsa-800` und `offer-salsa-1200` fuer verschieden geschnitten. Die
Messung widerlegte das (RMSE 0,0091–0,0160). Sie waren nur unterschiedlich
gross dargestellt. Das Auge taeuscht hier, die Zahl nicht.

## Ergebnis

| Lager | Anzahl | Bedeutung |
|---|---|---|
| TAUSCHBAR | 6 | Dasselbe Motiv, derselbe Ausschnitt, gross genug. Eingebaut. |
| Gross genug, aber anderes Bild | 32 | Kandidat haette die Pixel, zeigt aber etwas anderes. |
| Kandidat ohnehin zu klein | 10 | Auch das groesste Fundstueck verfehlt die Zielgroesse. |
| **Offener Materialbedarf** | **42** | Braucht die Originaldatei oder eine neue Aufnahme. |

## Lager 1 — TAUSCHBAR, eingebaut

Diese sechs sind erledigt. Sie stehen in keiner aktuellen Schwachliste mehr;
die Nachmessung zeigt jede neue Fassung bei genau Dichte 2,00.

| Dichte | Bild jetzt | Nat. Pixel | Zielgroesse | Groesster Kandidat | Kandidat-Pixel | RMSE | AR gleich | Reicht | Urteil |
|---|---|---|---|---|---|---|---|---|---|
| **0.73** | `/photos/premium/danceflow-home-1400.webp` | 1400x934 | — | `docs/bilder/assets/premium-2026-07-03/danceflow-home.jpg` | 5618x3745 | 0.0064 | ja | — | TAUSCHBAR |
| **0.94** | `/photos/showcase/hp-27.webp` | 1800x1200 | — | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` | 5674x3782 | 0.0464 | ja | — | TAUSCHBAR |
| **1.22** | `/photos/premium/community-story-1600.webp` | 1600x1067 | — | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` | 5674x3782 | 0.0042 | ja | — | TAUSCHBAR |
| **1.22** | `/photos/events/event-03.jpg` | 1600x1067 | — | `docs/bilder/assets/photos/events/event-03.jpg` | 4176x2784 | 0.0038 | ja | — | TAUSCHBAR |
| **1.40** | `/photos/premium/events-hero-1400.webp` | 1400x787 | — | `docs/bilder/assets/premium-2026-07-03/events-hero.jpg` | 3200x1800 | 0.0063 | ja | — | TAUSCHBAR |
| **1.71** | `/photos/premium/offer-heels-1200.webp` | 1200x1600 | — | `docs/bilder/assets/premium-2026-07-03/offer-heels.jpg` | 2400x3200 | 0.0043 | ja | — | TAUSCHBAR |

## Lager 2 — Kandidat gross genug, aber anderes Bild

Diese 32 Faelle sind die Falle dieser Aufgabe. Der groesste Fund im Repo
haette genug Pixel. Er zeigt aber nicht dieselbe Aufnahme. Der RMSE liegt ueber
0,06. Ein Tausch waere ein Motivwechsel und braucht Raphaels Freigabe.

Ohne Messung waere genau hier der Fehler passiert: „grosse Datei mit aehnlichem
Namen gefunden, also eingebaut".

| Dichte | Bild jetzt | Nat. Pixel | Zielgroesse | Groesster Kandidat | Kandidat-Pixel | RMSE | AR gleich | Reicht | Urteil |
|---|---|---|---|---|---|---|---|---|---|
| **0.82** | `/composites/graphic-world/step-bachata-line.webp` | 577x316 | 1408x772 | `docs/bilder/assets/graphic-world/step-diagram-salsa-v1.webp` | 2000x2000 | 0.1015 | nein | ja | NUR-AEHNLICH |
| **0.83** | `/composites/heels-shoes-stilllife.webp` | 1600x1600 | 3840x1053 | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` | 5674x3782 | 0.2722 | nein | ja | NUR-AEHNLICH |
| **1.00** | `/photos/shows/show-14.webp` | 310x470 | 623x945 | `docs/bilder/assets/premium-2026-07-03/events-hero.jpg` | 3200x1800 | 0.281 | nein | ja | NUR-AEHNLICH |
| **1.00** | `/photos/2026/kurse-classfreude-01.webp` | 1920x1280 | 3840x1503 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.2856 | nein | ja | NUR-AEHNLICH |
| **1.09** | `/photos/2026/kurse-heels-energie-hero-2100.webp` | 2100x900 | 3840x384 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.3703 | nein | ja | NUR-AEHNLICH |
| **1.14** | `/photos/party/party-15.webp` | 1500x1000 | 1404x1755 | `public/composites/graphic-world/duotone-nights-dip.webp` | 1600x2394 | 0.2189 | nein | ja | NUR-AEHNLICH |
| **1.16** | `/photos/shows/show-03.webp` | 600x400 | 688x688 | `docs/bilder/assets/premium-2026-07-03/events-hero.jpg` | 3200x1800 | 0.3036 | nein | ja | NUR-AEHNLICH |
| **1.20** | `/photos/gallery/kurse/01.jpg` | 1600x1066 | 2672x1146 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.2684 | nein | ja | NUR-AEHNLICH |
| **1.22** | `/photos/events/event-04.jpg` | 1600x1067 | 1404x1755 | `docs/bilder/assets/premium-2026-07-03/danceflow-home.jpg` | 5618x3745 | 0.2146 | ja | ja | NUR-AEHNLICH |
| **1.29** | `/photos/2026/hero-paar-dreh-01.webp` | 1600x1066 | 1736x1648 | `docs/bilder/assets/premium-2026-07-03/offer-bachata.jpg` | 2400x3200 | 0.2183 | nein | ja | NUR-AEHNLICH |
| **1.34** | `/photos/gallery/kurse/05.jpg` | 1600x1066 | 1408x1586 | `docs/bilder/assets/photos/events/event-07.jpg` | 4176x2784 | 0.2225 | ja | ja | NUR-AEHNLICH |
| **1.35** | `/photos/showcase/hp-29.webp` | 1800x1200 | 2672x1188 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.2339 | nein | ja | NUR-AEHNLICH |
| **1.37** | `/photos/2026/kurse-heels-energie-card-960.webp` | 960x1200 | 1404x909 | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` | 5674x3782 | 0.339 | nein | ja | NUR-AEHNLICH |
| **1.46** | `/photos/2026/event-social-couple-01.webp` | 1920x1280 | 1404x1755 | `docs/bilder/assets/premium-2026-07-03/events-hero.jpg` | 3200x1800 | 0.2722 | nein | ja | NUR-AEHNLICH |
| **1.50** | `/photos/showcase/hp-03-2880.webp` | 2880x1784 | 3840x1390 | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` | 5674x3782 | 0.3401 | nein | ja | NUR-AEHNLICH |
| **1.51** | `/photos/gallery/danceflow/05.jpg` | 1066x1600 | 1408x968 | `docs/bilder/assets/photos/events/event-01.jpg` | 4176x2784 | 0.3197 | nein | ja | NUR-AEHNLICH |
| **1.52** | `/photos/gallery/kurse/06.jpg` | 1066x1600 | 1404x1404 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.2902 | ja | ja | NUR-AEHNLICH |
| **1.52** | `/photos/gallery/danceflow/06.jpg` | 1066x1600 | 1404x1053 | `docs/bilder/assets/premium-2026-07-03/danceflow-home.jpg` | 5618x3745 | 0.3168 | nein | ja | NUR-AEHNLICH |
| **1.52** | `/photos/gallery/kurse/09.jpg` | 1067x1600 | 1408x1056 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.2842 | ja | ja | NUR-AEHNLICH |
| **1.57** | `/photos/2026/hero-paar-studiowand-hero-2100.webp` | 2100x900 | 2672x832 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.2517 | nein | ja | NUR-AEHNLICH |
| **1.65** | `/photos/gallery/kurse/08.jpg` | 1067x1600 | 1296x935 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.2864 | ja | ja | NUR-AEHNLICH |
| **1.70** | `/photos/premium/offer-privat-square-1200.webp` | 1200x1200 | 1408x1272 | `docs/bilder/assets/premium-2026-07-03/offer-privat.jpg` | 2400x3200 | 0.2546 | nein | ja | NUR-AEHNLICH |
| **1.71** | `/photos/showcase/hp-22.webp` | 1200x1800 | 1404x1755 | `docs/bilder/assets/premium-2026-07-03/offer-heels.jpg` | 2400x3200 | 0.1193 | nein | ja | NUR-AEHNLICH |
| **1.71** | `/photos/showcase/hp-06.webp` | 1200x1800 | 1404x1124 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.1551 | ja | ja | NUR-AEHNLICH |
| **1.71** | `/photos/shows/show-13.webp` | 1800x1200 | 1404x1400 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.2686 | nein | ja | NUR-AEHNLICH |
| **1.74** | `/photos/2026/kurse-heels-energie-01.webp` | 1920x935 | 1503x1074 | `docs/bilder/assets/premium-2026-07-03/community-story.jpg` | 5674x3782 | 0.3595 | nein | ja | NUR-AEHNLICH |
| **1.82** | `/photos/shows/show-07.webp` | 1800x1200 | 1408x1320 | `docs/bilder/assets/premium-2026-07-03/events-hero.jpg` | 3200x1800 | 0.1355 | nein | ja | NUR-AEHNLICH |
| **1.87** | `/photos/instagram/choreography-v2.webp` | 640x1136 | 684x1216 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.2543 | nein | ja | NUR-AEHNLICH |
| **1.87** | `/photos/instagram/lady-style-v2.webp` | 640x1136 | 684x1216 | `docs/bilder/assets/premium-2026-07-03/home-hero.jpg` | 4000x6000 | 0.2688 | nein | ja | NUR-AEHNLICH |
| **1.90** | `/photos/party/party-08.webp` | 1500x1000 | 1404x1053 | `docs/bilder/assets/premium-2026-07-03/danceflow-home.jpg` | 5618x3745 | 0.2288 | ja | ja | NUR-AEHNLICH |
| **1.94** | `/photos/gallery/danceflow/11-v3.webp` | 1360x2048 | 1404x1439 | `public/composites/graphic-world/duotone-nights-dip.webp` | 1600x2394 | 0.2743 | ja | ja | NUR-AEHNLICH |
| **1.99** | `/photos/premium/offer-salsa-wide-1400.webp` | 1400x1000 | 1408x792 | `docs/bilder/assets/premium-2026-07-03/offer-salsa.jpg` | 2400x3200 | 0.2183 | nein | ja | NUR-AEHNLICH |

### Nachgeprueft: `hp-22.webp` und `offer-heels.jpg`

Dieser Fall liegt mit RMSE 0,1193 am dichtesten an der Schwelle. Die Sichtprobe
zeigt **dieselbe Aufnahme**: zwei Taenzerinnen, gleiche Pose, gleiches
Studio. Der Farbvergleich hat den Unterschied ueberzeichnet.

Gegenprobe in Graustufen mit ausgeglichenem Kontrast: RMSE **0,0040**. Das
bestaetigt dieselbe Aufnahme. `hp-22` ist nur kuehler abgestimmt, das Master
waermer.

Trotzdem **kein Tausch**. Die Ausschnitte sind verschieden: `hp-22` ist 2:3
(1200x1800), das Master 3:4 (2400x3200). Eine Suche ueber Zoom und Position in
beiden Achsen findet als besten Neuschnitt `2133x3200+133+0` mit RMSE **0,159**.
Das liegt weit ueber der Schwelle 0,06. `hp-22` ist zusaetzlich nachbearbeitet.

Ein Neuschnitt aus dem Master waere darum ein sichtbar anderes Bild, also ein
Motivwechsel. Der Auftrag verlangt dafuer Raphaels Freigabe. **Offene Frage an
Raphael:** `hp-22` auf `/tanzkurse/heels` liegt bei Dichte 1,71 und braucht
1404x1755. Aus dem Master waere das erreichbar, das Bild saehe aber waermer und
anders beschnitten aus. Freigeben oder so lassen?

## Lager 3 — Kandidat ohnehin zu klein

Bei diesen 10 scheitert es schon an der Groesse. Selbst wenn das Motiv passte,
reichte der Kandidat nicht fuer Dichte 2,0.

| Dichte | Bild jetzt | Nat. Pixel | Zielgroesse | Groesster Kandidat | Kandidat-Pixel | RMSE | AR gleich | Reicht | Urteil |
|---|---|---|---|---|---|---|---|---|---|
| **0.78** | `/photos/party/party-47.webp` | 1500x1000 | 3840x896 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.2593 | nein | nein | NUR-AEHNLICH |
| **0.78** | `/photos/party/party-29.webp` | 1500x1000 | 3840x512 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.3246 | nein | nein | NUR-AEHNLICH |
| **0.83** | `/photos/kurse/kurs-05.jpg` | 1600x1065 | 3840x945 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.2658 | nein | nein | NUR-AEHNLICH |
| **1.07** | `/photos/party/party-20-v3.webp` | 2048x1360 | 3840x1178 | `docs/bilder/assets/premium-2026-07-03/offer-bachata.jpg` | 2400x3200 | 0.2437 | nein | nein | NUR-AEHNLICH |
| **1.07** | `/photos/party/party-31-v3.webp` | 2048x1360 | 3840x1124 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.3435 | nein | nein | NUR-AEHNLICH |
| **1.09** | `/photos/2026/kurse-classfreude-hero-2100.webp` | 2100x900 | 3840x960 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.3095 | nein | nein | NUR-AEHNLICH |
| **1.21** | `/photos/gallery/kurse/04.jpg` | 1600x1066 | 1404x1755 | `docs/bilder/assets/graphic-world/choreo-curve-final.png` | 2688x1536 | 0.2202 | nein | nein | NUR-AEHNLICH |
| **1.23** | `/photos/shows/show-11.webp` | 1800x1200 | 1404x1956 | `docs/bilder/assets/graphic-world/choreo-curve-final.png` | 2688x1536 | 0.1552 | nein | nein | NUR-AEHNLICH |
| **1.32** | `/photos/shows/show-16.webp` | 1800x1200 | 1408x1813 | `docs/bilder/assets/graphic-world/choreo-curve-final.png` | 2688x1536 | 0.1653 | nein | nein | NUR-AEHNLICH |
| **1.55** | `/photos/party/party-07-v3.webp` | 2048x1360 | 1408x1760 | `public/photos/premium/offer-bachata-wide-v2.webp` | 2752x1536 | 0.2738 | nein | nein | NUR-AEHNLICH |

## Was das fuer R187 heisst

Der Quellentausch ist ausgeschoepft. 6 Dateien waren belegbar ersetzbar und
sind ersetzt. Die restlichen 42 kann kein Modell loesen: Hochskalieren ist laut
Auftrag verboten und waere sichtbar wirkungslos, ein Motivwechsel braucht
Raphaels Freigabe.

Die konkrete Mindestpixelzahl je Datei steht in `worklog/STATUS-r187.md`
unter „Materialbedarf".
