# Salsaflow Dance Company — Asset-Inventar

**Rolle:** Asset-Inventar
**Stand:** 2026-08-12 (UTC)
**Scope:** FULL, PLANNING ONLY — kein Production-Code geändert
**Quellen:** [`/root/clients/salsaflow-dc/public/`](/root/clients/salsaflow-dc/public/), [`/root/clients/salsaflow-dc/src/`](/root/clients/salsaflow-dc/src/), Live-Galerie [https://www.salsaflow-dc.com/fotos-1/](https://www.salsaflow-dc.com/fotos-1/)
**Regel:** Nur belegbare Facts. Keine erfundenen Fotografen, Rechte, Personennamen. Ungeprüftes = `PLACEHOLDER` / `OFFEN`.

---

## 0. Kernaussage in fünf Zeilen

1. Die Bildlage ist **besser als gedacht** — 274 Assets, davon ein sehr starker moderner Kern (`/photos/2026/`, `/photos/premium/`, Cutout-Portraits).
2. Das Hauptproblem ist **nicht fehlender Alt-Text** (332 Alt-Einträge existieren), sondern **falscher Alt-Text** und **falsche Motivwahl**.
3. Die **Privatstunden-Bilder sind das schwerste Einzelproblem** — nicht wegen Auflösung, sondern weil sie das falsche Produkt zeigen (Beleg unten, Abschnitt 4).
4. **6 Dateien sind leere weisse 66-Byte-Platzhalter**, 3 weitere sind Mini-Crops — alle nicht ausgeliefert, aber im Repo.
5. **127 von 274 Assets (13 MB) sind unreferenziert** — Altlast aus mehreren Bau-Runden.

---

## 1. Mengengerüst (gemessen)

Befehl: `find public -type f \( -iname '*.jpg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.svg' \)`

| Kennzahl | Wert | Beleg |
|---|---:|---|
| Assets gesamt (Raster + SVG) | **274** | `wc -l /tmp/all_assets.txt` |
| Exakt referenziert in `src/` | **147** | `grep -rhoE '/(photos\|logo\|composites\|graphics)/…'` |
| Unreferenziert (Orphan-Kandidaten) | **127** | `comm -23` |
| Unreferenzierte Bytes | **~13 MB** | Summe `stat -c%s` |
| Alt-Einträge in `content.ts`-Dateien | **332** (204 distinct) | `grep -rhoE "alt: *'[^']+'"` |
| `<img>`-Tags in `src/` | 94 | `grep -rn '<img' src/` |
| Leere/blinde Platzhalter-Dateien | **6** (je 66 B, reinweiss) | `identify -format '%[mean]'` = 65535 |

**Wichtig:** Der Alt-Text-Auftrag ist damit **kein Neuschreiben von Null**. Es ist ein **Korrektur- und Qualitätsauftrag** auf einem bereits dichten Bestand.

---

## 2. Ordner-Übersicht mit Bewertung

| Ordner | Dateien | Qualität | Rolle im Relaunch |
|---|---:|---|---|
| `/photos/2026/` | 18 | **Sehr gut** — 1920–2100 px, aktuell, echte Kurs-/Party-Situationen | **Primärquelle Hero + Kurse + Community** |
| `/photos/premium/` | 29 | **Sehr gut** — kuratierte Offer-/Hero-Crops in 800/1200/1400/2100 | **Primärquelle Angebots-Karten** |
| `/photos/team/` (teacher-*) | 5 | **Sehr gut** — freigestellte Cutouts 1000×1414, einheitlich | **Team-Grid** |
| `/photos/founders/` | 4 | **Sehr gut** — gleiche Cutout-Serie, 1000×1414 | **Gründer-Block** |
| `/photos/party/` | 62 | Gut — 1500×1000, `-v3` sogar 2048×1360 | Galerie / Danceflow-Beleg |
| `/photos/shows/` | 23 | **Gemischt** — 3 leere Platzhalter, 2 Fremd-Watermarks, Rest gut | Shows-Seite, kuratiert |
| `/photos/showcase/` | 29 | **Gemischt** — 3 leere Platzhalter, 1 Mini-Crop (137×84) | Reserve |
| `/photos/gallery/` | 21 | Gut — `-v3.webp` ersetzt Alt-JPG | Galerie |
| `/photos/events/` | 13 | Gut | Events |
| `/photos/kurse/` | 7 | Mittel — 1600 px JPG, Altbestand | ersetzbar durch `/2026/` |
| `/photos/hero/` | 3 | Mittel — 1080×1616, Altbestand | ersetzt durch `/2026/` + `/premium/` |
| `/photos/instagram/` | 5 | **Schwach** — 2 Dateien nur 640×1136 | nur Social-Teaser, nie gross |
| `/photos/team/` (team-*, founder-*) | 10 | **Schwach** — `founder-0*.jpg` nur **240×240** | **nicht verwenden** |
| `/composites/` | 11 | Gut — Duotone `#ad1827`, Step-Diagramme | Brand-Flächen, Kursaufbau |
| `/graphics/` | 5 | Gut — dünne Linien-SVG-Ersatzgrafiken | Dekor / Trenner |
| `/logo/` | 9 | Gut — bis 3150×1994 | Header, Footer, OG |

---

## 3. Live-Galerie `/fotos-1/` — Bild-Wahrheit, aber mit zwei Haken

Gemessen am 2026-08-12 (`curl` + `grep`):

| Kennzahl | Wert |
|---|---:|
| `<img>`-Tags auf der Seite | 749 |
| davon mit **nicht-leerem** Alt | **5** |
| davon mit `alt=""` | **744** |
| Echte Vollbild-URLs (`dimension=2048x2048`) | **275** |
| Lazy-Load-Platzhalter (`dimension=25x25`) | 372 |

**Haken 1 — Barrierefreiheit:** 744 von 749 Bildern ohne Alt-Text. Das ist auf der Live-Site der grösste A11y-Einzelposten.

**Haken 2 — Aktualität:** Die Galerie ist inhaltlich **komplett 2023**. Die einzigen Überschriften auf der Seite sind:

- Danceflow Night — 15. Dezember 2023
- Danceflow Night — 18. August 2023
- Salsaflow's 5th Anniversary Weekend — 22./23. April 2023
- Danceflow Night + Workshop — 31. März 2023

**Qualität ist bestätigt gut:** Stichprobe von 9 Vollbildern → durchgehend 2048×1365, 235–341 KB, sauber belichtete Event-Fotografie mit Studio-Branding im Bild.

**Fotografen (belegt auf der Seite):** „Fotos by Urs Müller“, „Fotos by Valentin“ (Nachname Behringer laut Dossier). → **Credit-Pflicht im Relaunch klären**, siehe Gap `L-03`.

**Konsequenz für den Plan:** `/fotos-1/` ist Qualitätsreferenz für **Social-/Party-Motive**. Sie ist **keine** Quelle für Privatstunden, Team-Portraits oder aktuelle Kursbilder — diese Motive kommen dort schlicht nicht vor.

---

## 4. Der Privatstunden-Befund (härtester Punkt)

**Auftrag sagte:** „Privatstunden-Bilder auf Vercel-Repo-Seite sind schlecht/low-res — ersetzen.“

**Gemessen stimmt der Vorwurf technisch nur teilweise:**

| Datei | Auflösung | Grösse |
|---|---|---:|
| `offer-privat-1200.webp` | 1200×1600 | 159 KB |
| `offer-privat-wide-original-v2.webp` | 1800×1200 | 150 KB |
| `offer-privat-square-1200.webp` | 1200×1200 | 45 KB |
| `offer-privat-800.webp` | 800×1067 | 33 KB |

Das ist **keine kritisch niedrige Auflösung**. 1200×1600 reicht für eine Karte problemlos.

**Das echte Problem ist inhaltlich — und es ist gravierender.** Nach visueller Sichtung aller vier Dateien (Montage aus `/tmp/ai/privat_s.jpg`):

> Alle vier Dateien zeigen **dasselbe Motiv in vier Crops**: eine junge dunkelhaarige Frau und ein deutlich älterer grauhaariger Herr im hellblauen Hemd, die vor der Salsaflow-Studiowand **Handhaltung üben**. Flaches, gelbstichiges Kunstlicht. Keine Bewegung, keine Dynamik, keine Freude im Gesichtsausdruck — der Herr blickt konzentriert nach unten auf die Hände.

Daraus folgen drei Defekte:

**D-1 — Alt-Text ist sachlich falsch.**
In [`src/public/privat/content.ts:146-147`](/root/clients/salsaflow-dc/src/public/privat/content.ts) steht:
```
src: '/photos/premium/offer-privat-wide-original-v2.webp',
alt: 'Persönliche Korrektur im Salsaflow Unterricht',
```
Auf dem Bild findet **keine Korrektur** statt. Zwei Personen halten Hände in Grundposition. Ein Screenreader bekommt eine Beschreibung, die das Bild nicht zeigt.

**D-2 — Ein Motiv, vier Slots.** Dieselbe Aufnahme erscheint als Hero **und** als Ablauf-Bild auf derselben Seite (Zeilen 110-112 und 145-147, DE; 224-226 und 256-258, EN). Die Seite wirkt dadurch leer und wiederholt sich.

**D-3 — Falsches Verkaufsversprechen.** Privatstunden werden laut Dossier auch für **Hochzeitspaare** verkauft. Das Bild zeigt eine Konstellation, in der sich weder ein Hochzeitspaar noch ein junger Einsteiger wiedererkennt.

**Ersatz-Empfehlung (aus vorhandenem Bestand, sofort möglich):**

| Slot | Ersatz | Warum |
|---|---|---|
| Hero Privatstunden | `/photos/2026/hero-paar-dreh-01-portrait.webp` (1080×1350) | Echtes Paar, echte Drehung, warmes Licht, Blickkontakt |
| Ablauf-Sektion | `/photos/2026/hero-paar-studiowand-01.webp` (1920×1280) | Studiowand + Marke sichtbar, zwei Personen im Fokus |
| Quer-Format | `/photos/premium/offer-bachata-wide-v2.webp` (2752×1536) | Höchste Auflösung im Bestand, klare Zweier-Situation |

**Offen bleibt (`P-01`):** Ein *echtes* 1:1-Privatstunden-Foto mit jungem Paar existiert im Bestand **nicht**. Für ein ehrliches Bild ist ein **Neu-Shooting** nötig — siehe Gap-Matrix.

---

## 5. Defekte Dateien (gemessen, nicht geschätzt)

Nachweis über `identify -format '%[mean]'` — Wert 65535 = reinweiss:

| Datei | Grösse | Befund |
|---|---:|---|
| `/photos/showcase/hp-10.webp` | 66 B | **leer, reinweiss 62×62** |
| `/photos/showcase/hp-12.webp` | 66 B | **leer, reinweiss 62×62** |
| `/photos/showcase/hp-24.webp` | 66 B | **leer, reinweiss 62×62** |
| `/photos/shows/show-05.webp` | 66 B | **leer, reinweiss 62×62** |
| `/photos/shows/show-06.webp` | 66 B | **leer, reinweiss 62×62** |
| `/photos/shows/show-18.webp` | 66 B | **leer, reinweiss 62×62** |
| `/photos/showcase/hp-01.webp` | 2 KB | Mini-Crop 137×84, unbrauchbar |
| `/photos/team/founder-01.jpg` | 6 KB | 240×240 — **zu klein für jede Fläche** |
| `/photos/team/founder-02.jpg` | 10 KB | 240×240 — dito |
| `/photos/team/founder-03.jpg` | 10 KB | 240×240 — dito |

**Entwarnung:** Keine dieser Dateien wird ausgeliefert. Die einzige Fundstelle für `show-05` ist ein **Kommentar**, der die Platzhalter korrekt ausschliesst — [`src/public/shows/animationen-content.ts:8-10`](/root/clients/salsaflow-dc/src/public/shows/animationen-content.ts):

```
// Bilder: nur echte Buehnen-Fotos aus /photos/shows. Uebersprungen sind die leeren Platzhalter
// (show-05/06/18, je 66 Byte), die Logo-Grafiken (show-01/10) und Fotos mit Fremd-Watermark
// (show-04/22 "Bail Adoro", show-15 Fremd-Event-Logo).
```

Das ist gute Repo-Hygiene. **Empfehlung trotzdem: Dateien löschen**, damit sie in keiner künftigen Runde versehentlich eingebunden werden.

**Fremd-Watermark (Rechte-Risiko, aus dem Kommentar belegt):** `show-04`, `show-22` („Bail Adoro“), `show-15` (Fremd-Event-Logo). → Gap `L-02`.

---

## 6. Alt-Text-Register

### 6.1 Bewertung des Bestands

Der Bestand ist **dicht und überwiegend gut**. Positive Beispiele aus dem Code:

- `'Tanzende im Salsaflow-Kurs, helle Studio-Atmosphaere nahe Bahnhof Basel SBB.'` — beschreibend **und** SEO-nützlich, ohne Keyword-Stuffing
- `'Das ganze Salsaflow-Team liegt lachend vor der Salsaflow-Wand im Studio.'` — konkret, bildgenau
- `'Frau streckt den Arm hoch mitten in der Drehung'` — Handlung statt Etikett

### 6.2 Die drei Fehlermuster, die zu korrigieren sind

**Muster A — Behauptung statt Beschreibung** (kritisch, A11y-Verstoss)
Alt-Text beschreibt eine *Interpretation*, die das Bild nicht hergibt.
- `'Persönliche Korrektur im Salsaflow Unterricht'` → tatsächlich: zwei Personen in Handhaltung
- Korrektur: `'Tanzlehrer und Schülerin üben die Handhaltung vor der Salsaflow-Studiowand'`

**Muster B — Personennamen ohne Beleg** (Risiko)
Founder-Alts wie `'Fabio Branco, Mitgründer von Salsaflow'` sind **nur zulässig**, wenn die Zuordnung Datei→Person bestätigt ist. Die Dateinamen (`fabio.webp`, `claudia.webp`) legen es nahe, **beweisen es aber nicht**. → Gap `P-03`: Zuordnung durch Salsaflow bestätigen lassen, sonst neutral formulieren (`'Mitgründer von Salsaflow im Studio'`).

**Muster C — Dekorbilder mit gefülltem Alt**
Duotone-Hintergründe und Linien-Grafiken (`closing-bg.webp`, `founders-line-*.webp`, `paper-grain-tile.webp`) sind rein dekorativ. Sie gehören auf `alt=""` **oder** als CSS-`background-image`, damit Screenreader sie überspringen. Aktuell existieren 10 `alt=""` im Code — das ist die richtige Richtung, muss aber konsequent auf alle Dekor-Assets angewendet werden.

### 6.3 Regelwerk Alt-Texte (verbindlich für die Bau-Welle)

1. **Beschreiben, was zu sehen ist** — nicht, was es verkaufen soll.
2. **Keine geratenen Personennamen.** Nur bestätigte Zuordnungen.
3. **Keine Keyword-Ketten.** Ein Ortsbezug („im Salsaflow-Studio“, „nahe Bahnhof Basel SBB“) ist erlaubt, wenn er stimmt — maximal einmal pro Alt.
4. **Dekor = `alt=""`** oder CSS-Background.
5. **Länge 60–125 Zeichen.** Kürzer verliert Information, länger wird vorgelesen zur Zumutung.
6. **Kein „Bild von“, „Foto zeigt“.** Screenreader sagen bereits „Grafik“.
7. **DE und EN gepflegt.** Die Content-Dateien führen `alt` + `altEn` — beide müssen inhaltlich identisch sein.
8. **Keine Emotion behaupten, die nicht sichtbar ist.** „lachend“ nur, wenn jemand lacht.

### 6.4 Alt-Texte für die Kern-Assets (Vorschläge, einsatzfertig)

**Hero / Home**

| Datei | Alt-Vorschlag DE | Einsatz |
|---|---|---|
| `/photos/2026/hero-paar-studiowand-01.webp` | Paar tanzt Salsa vor der Salsaflow-Wand im Studio | Home-Hero |
| `/photos/2026/hero-paar-dreh-01.webp` | Paar mitten in der Drehung, weitere Tanzende im Hintergrund | Home-Hero Variante |
| `/photos/2026/hero-paar-dreh-01-portrait.webp` | Paar in der Drehung, Hochformat für mobile Ansicht | Hero mobil |
| `/photos/premium/home-hero-wide-2400.webp` | Weite Studioaufnahme mit tanzenden Paaren | Hero breit |

**Kurse**

| Datei | Alt-Vorschlag DE | Einsatz |
|---|---|---|
| `/photos/2026/kurse-classfreude-01.webp` | Kursgruppe tanzt gemeinsam im hellen Studio mit grossen Fenstern | Kurse-Hero |
| `/photos/2026/kurse-heels-energie-01.webp` | Gruppe im Heels-Kurs posiert mit erhobenen Armen | Heels-Kurs |
| `/photos/premium/offer-salsa-1200.webp` | Zwei Tanzende im Salsa-Kurs vor der Spiegelwand | Angebots-Karte Salsa |
| `/photos/premium/offer-bachata-1200.webp` | Bachata-Paar in enger Tanzhaltung im warmen Studiolicht | Angebots-Karte Bachata |
| `/photos/premium/offer-heels-1200.webp` | Zwei Tänzerinnen in Heels posieren vor hellem Hintergrund | Angebots-Karte Heels |

**Community / Events**

| Datei | Alt-Vorschlag DE | Einsatz |
|---|---|---|
| `/photos/2026/community-crowd-01.webp` | Volle Tanzfläche bei einer Danceflow Night, Gäste winken in die Kamera | Community-Band |
| `/photos/2026/community-diversitaet-01.webp` | Tanzende unterschiedlichen Alters gemeinsam auf der Fläche | Community |
| `/photos/2026/event-venue-wide-01.webp` | Grosser Saal im violetten Licht während einer Danceflow Night | Events-Hero |
| `/photos/2026/event-social-couple-01.webp` | Paar tanzt Bachata im blauen Partylicht | Events |
| `/photos/2026/event-party-dreh-01.webp` | Paar dreht sich auf der Tanzfläche, Gäste im Hintergrund | Events |

**Team**

| Datei | Alt-Vorschlag DE (neutral, bis Zuordnung bestätigt) | Einsatz |
|---|---|---|
| `/photos/founders/fabio.webp` | Mitgründer von Salsaflow, freigestelltes Portrait | Gründer-Grid |
| `/photos/founders/claudia.webp` | Mitgründerin von Salsaflow, freigestelltes Portrait | Gründer-Grid |
| `/photos/founders/sebastian.webp` | Mitgründer von Salsaflow, freigestelltes Portrait | Gründer-Grid |
| `/photos/founders/vanessa.webp` | Mitgründerin von Salsaflow, freigestelltes Portrait | Gründer-Grid |
| `/photos/team/teacher-*.webp` | Tanzlehrperson von Salsaflow, freigestelltes Portrait | Team-Grid |

> Sobald Salsaflow die Zuordnung schriftlich bestätigt (Gap `P-03`), auf die Namensform wechseln: `'Fabio Branco, Mitgründer von Salsaflow'`.

**Dekor — bewusst leer**

| Datei | Alt |
|---|---|
| `/composites/closing-bg.webp`, `/composites/nights-bg.webp` | `""` (CSS-Background bevorzugt) |
| `/graphics/founders-line-*.webp`, `/graphics/choreo-curve-*.webp` | `""` |
| `/graphics/paper-grain-tile.webp` | `""` — reine Textur |
| `/composites/graphic-world/duotone-*.webp` | `""` wenn Hintergrund; sonst beschreiben |

**Funktionale Grafiken — brauchen echten Alt**

| Datei | Alt-Vorschlag |
|---|---|
| `/composites/graphic-world/step-salsa.webp` | Schrittdiagramm Salsa-Grundschritt mit nummerierten Fussabdrücken 1 bis 7 |
| `/composites/graphic-world/step-bachata.webp` | Schrittdiagramm Bachata-Grundschritt mit vier nummerierten Schritten |
| `/logo/salsaflow-wordmark.png` | Salsaflow Dance Company |
| `/logo/google-g.svg` | Google |

---

## 7. Wollen-vor-Haben — Bedarf je Seite

Zuerst der **Bedarf** aus der geplanten IA, dann erst der Abgleich mit dem Bestand.

| # | Seite / Fläche | Gewünschtes Bild | Format | Haben? | Bestand |
|---|---|---|---|---|---|
| W-01 | Home Hero | Paar in Bewegung, Studio erkennbar, Marke sichtbar | 2400×1028 quer + 1080×1350 hoch | **JA** | `/photos/2026/hero-paar-studiowand-01.webp`, `hero-paar-dreh-01-portrait.webp` |
| W-02 | Home Angebots-Karten (4) | Salsa / Bachata / Heels / Privat je eigenes Motiv | 1200×1600 | **3 von 4** | `offer-salsa`, `offer-bachata`, `offer-heels` gut — **`offer-privat` untauglich** |
| W-03 | Home Community-Band | Volle Tanzfläche, viele Gesichter | 1920×1281 | **JA** | `/photos/2026/community-crowd-01.webp` |
| W-04 | Home Proof / Wall of Love | Echte Review-Screenshots | — | **NEIN** | Gap `P-02` |
| W-05 | Kurse Übersicht Hero | Kursgruppe im Unterricht | 2100×900 | **JA** | `kurse-classfreude-hero-2100.webp` |
| W-06 | Kursaufbau Level 1–4 | 4 unterscheidbare Level-Motive | 1200×800 | **TEILWEISE** | Step-Diagramme da, echte Level-Fotos fehlen → `P-05` |
| W-07 | Privatstunden Hero | Paar 1:1 mit Lehrperson, freundlich | 1600×1067 | **NEIN** | siehe Abschnitt 4 → `P-01` |
| W-08 | Privatstunden Hochzeit | Hochzeitspaar beim Üben | 1200×1600 | **NEIN** | `P-06` |
| W-09 | Danceflow Night | Party bei Nacht, volle Fläche | 2000×1334 | **JA** | `/photos/premium/danceflow-home-2000.webp` + 62 Party-Bilder |
| W-10 | Shows & Animationen | Bühne, Formation, Kostüme | 1800×1200 | **JA** (kuratiert) | `/photos/shows/` ohne die 6 Defekten |
| W-11 | Team-Grid | Freigestellte Portraits, einheitlich | 1000×1414 | **JA** | `/photos/founders/` + `teacher-*` |
| W-12 | Team Nachwuchs | Portraits Talentpool | 1000×1414 | **NEIN** | `P-04` |
| W-13 | Standort / Studio | Studio leer, Tageslicht, 2 Räume | 1600×1067 | **TEILWEISE** | `heels-shoes-stilllife.webp` zeigt Raum — **Provenienz offen** `L-01` |
| W-14 | Standort Anfahrt | Karte / Eingang / Hausnummer | — | **NEIN** | `P-07` |
| W-15 | Galerie | Kuratierte Auswahl, aktuell | 2048×1360 | **JA, aber alt** | Live = 100 % 2023 → `P-08` |
| W-16 | Preise | Ruhiges Kontextbild | 1600×1067 | **JA** | `/photos/schedule/kurs-aktion.webp` |
| W-17 | FAQ | Kein Bild nötig | — | — | bewusst leer |
| W-18 | Kontakt | Freundliches Ansprech-Motiv | 1200×800 | **JA** | aus `/photos/2026/` ableitbar |
| W-19 | OG / Social-Sharing | 1200×630 Marke + Motiv | 1200×630 | **NEIN** | `P-09` — kein einziges 1200×630 im Bestand |
| W-20 | Favicon / App-Icon | Quadratisch, scharf | 512×512 | **TEILWEISE** | `favicon.jpg` 929×969 ist JPG — PNG/ICO/SVG fehlt `P-10` |
| W-21 | FLOWeekend / Anniversary | Event-Key-Visual mit Datum | 1200×1600 | **TEILWEISE** | Fotos ja, gestaltetes Key-Visual nein `P-11` |
| W-22 | Blog / AEO-Artikel | Artikel-Header | 1600×900 | **NEIN** | `P-12`, falls Blog kommt |

**Bilanz:** 11 von 22 Flächen sind aus dem Bestand voll bedienbar, 5 teilweise, **6 gar nicht**.

---

## 8. Einsatzplan je Asset-Gruppe (Kurzfassung)

| Gruppe | Verwenden | Nicht verwenden |
|---|---|---|
| `/photos/2026/` | **alle 18** — erste Wahl für Hero, Kurse, Community | — |
| `/photos/premium/` | `offer-salsa*`, `offer-bachata*`, `offer-heels*`, `home-hero-*`, `community-story-*`, `danceflow-home-*`, `events-hero-*` | **`offer-privat-*` (4 Dateien)** |
| `/photos/founders/`, `teacher-*` | **alle 9** | `founder-0*.jpg` (240×240), `team-0*.jpg` |
| `/photos/party/` | `-v3.webp`-Varianten (2048×1360) bevorzugt | 1500×1000-Duplikate, wo `-v3` existiert |
| `/photos/shows/` | kuratierte ~14 | `show-05/06/18` (leer), `show-04/22/15` (Fremd-Watermark) |
| `/photos/showcase/` | Reserve nach Sichtung | `hp-01` (137×84), `hp-10/12/24` (leer) |
| `/photos/instagram/` | nur klein als Social-Teaser | nie als Hero — 640×1136 zu klein |
| `/composites/` | Duotone als Flächen, Step-Diagramme funktional | `heels-shoes-stilllife.webp` bis `L-01` geklärt |
| `/graphics/` | als Dekor mit `alt=""` | — |
| `/logo/` | `salsaflow-wordmark.webp` (70 KB) statt `.png` (143 KB) | — |

---

## 9. Technische Beobachtungen für die Bau-Welle

1. **Kein AVIF im Bestand.** Alles WebP/JPG. AVIF bringt bei diesen Motiven typisch 20–30 % gegenüber WebP. Entscheidung offen — nicht kritisch, da WebP-Grössen bereits gesund sind (Median ~120 KB).
2. **Grösste Einzeldatei:** `/photos/shows/show-21.webp` mit **554 KB** bei 1350×1800. Die `-opt`-Variante (500 KB) spart kaum. Vor Einsatz neu komprimieren.
3. **Responsive-Sätze sind unvollständig.** `offer-salsa` hat 800/1200/2100, `offer-privat` hat 800/1200/square/wide — uneinheitlich. Für `srcset` braucht es **eine feste Leiter** (z. B. 640/960/1280/1920) pro Motiv.
4. **`favicon.jpg` und `logo/salsaflow-icon.jpg` sind byte-identisch** (beide 53 797 B, 929×969) — eine Datei ist redundant.
5. **EXIF ist überall entfernt.** `identify -verbose` liefert nur `date:create` vom Build (2026-08-10). Das ist gut für Datenschutz, aber es bedeutet: **die Herkunft der Bilder ist technisch nicht mehr nachweisbar** → Lizenz-Register muss manuell geführt werden (`L-04`).
6. **13 MB unreferenziert.** Das landet nicht im Bundle (statisches `public/`), bläht aber Repo und Deploy auf.

---

## 10. Validierung dieser Datei

| Check | Ergebnis |
|---|---|
| Alle Zahlen gemessen, nicht geschätzt | ja — Befehle in Abschnitt 1 dokumentiert |
| Bilder visuell gesichtet | ja — Privatstunden, `/2026/`, Team, Premium, Composites, Live-Sample |
| Erfundene Fotografen / Rechte / Namen | keine |
| Production-Code geändert | **nein** |
| Live-Galerie geprüft | ja, 2026-08-12, 749 `<img>`, 275 Vollbilder |
| Offene Punkte ausgelagert | ja → [02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md) |

**Ende `02-asset-inventar.md`.**
