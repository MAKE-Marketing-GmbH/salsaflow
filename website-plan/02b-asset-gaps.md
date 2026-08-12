# Salsaflow Dance Company — Asset-Gap-Matrix

**Rolle:** Asset-Inventar
**Stand:** 2026-08-12 (UTC)
**Bezug:** [02-asset-inventar.md](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md)
**Scope:** FULL, PLANNING ONLY — kein Production-Code geändert
**Regel:** Keine erfundenen Rechte, Fotografen, Personen. Alles Ungeklärte ist als `PLACEHOLDER` oder `OFFEN` markiert und blockiert den Launch nur dort, wo es unter „Blocker“ steht.

---

## 1. Ampel in einem Blick

| Status | Anzahl | Bedeutung |
|---|---:|---|
| **ROT — Launch-Blocker** | 4 | Ohne Lösung geht die Seite nicht live |
| **GELB — vor Launch klären** | 8 | Machbar mit Bestand oder kurzer Rückfrage |
| **GRÜN — nach Launch** | 6 | Verbessert, blockiert aber nicht |

---

## 2. ROT — Launch-Blocker

### P-01 — Privatstunden-Bild zeigt das falsche Produkt

| Feld | Inhalt |
|---|---|
| **Was fehlt** | Ein glaubwürdiges 1:1-Motiv: Lehrperson mit **einem Paar oder einer Einzelperson**, freundlich, in Bewegung |
| **Warum ROT** | Privatstunden sind das teuerste Produkt (CHF 100–130/Lektion, 5er ab CHF 450). Das aktuelle Bild verkauft es aktiv schlecht. |
| **Ist-Zustand** | 4 Crops **desselben** Motivs: junge Frau + deutlich älterer Herr, Handhaltung, flaches Kunstlicht, keine Bewegung. Belegt durch visuelle Sichtung aller 4 Dateien. |
| **Zwischenlösung (heute machbar)** | `/photos/2026/hero-paar-dreh-01-portrait.webp` als Hero, `/photos/2026/hero-paar-studiowand-01.webp` für die Ablauf-Sektion. Beide zeigen echte Bewegung. |
| **Echte Lösung** | Shooting: 1 Lehrperson + 1 Paar, 45 Min, Studio bei Tageslicht. 6–8 Motive quer + hoch. |
| **Entscheidung braucht** | Salsaflow: Shooting-Termin **oder** Freigabe der Zwischenlösung |

### P-02 — Kein einziger echter Bild-Proof

| Feld | Inhalt |
|---|---|
| **Was fehlt** | Screenshots echter Google-Bewertungen für die „Wall of Love“-Fläche |
| **Warum ROT** | Die Fläche ist im Bestand angelegt (`src/public/home/WallOfLove.tsx`), aber es gibt **keine belegten Review-Assets**. Erfinden ist laut Auftrag verboten. |
| **Ist-Zustand** | Dossier führt „Google 4.9 / 102 Reviews“ als **UNGEPRÜFT** (Aggregator, nicht Primärquelle). Kein Screenshot vorhanden. |
| **Lösung** | Google Business Profile primär öffnen, echte Reviews screenshotten, **Zitat + Datum + Vorname** schriftlich freigeben lassen. |
| **Bis dahin** | Fläche mit `PLACEHOLDER` bauen oder **ganz weglassen**. Keine Sterne, keine Zahlen, keine erfundenen Namen. |
| **Entscheidung braucht** | Salsaflow: Freigabe welcher Reviews wörtlich zitiert werden dürfen |

### P-09 — Kein Open-Graph-Bild

| Feld | Inhalt |
|---|---|
| **Was fehlt** | 1200×630 Sharing-Bild (WhatsApp, Facebook, Instagram-DM, LinkedIn) |
| **Warum ROT** | Eine Tanzschule wird **über WhatsApp weiterempfohlen**. Ohne OG-Bild erscheint ein grauer Kasten. Das ist der häufigste Erstkontakt überhaupt. |
| **Ist-Zustand** | Im gesamten Bestand existiert **kein** Asset im Seitenverhältnis 1,91:1. Nächstliegend: `home-hero-wide-2400.webp` (2400×1028 = 2,33:1) — falsch beschnitten. |
| **Lösung** | Aus `/photos/2026/hero-paar-studiowand-01.webp` einen 1200×630-Crop bauen, Wordmark `salsaflow-wordmark-weiss.png` unten links, ink-Overlay `#0a0a0a` bei 35 %. |
| **Zusätzlich** | Je ein eigener OG-Crop für Kurse, Privatstunden, Danceflow Night, FLOWeekend |
| **Entscheidung braucht** | nichts — aus Bestand baubar |

### L-01 — Provenienz der Composite-Bilder ungeklärt

| Feld | Inhalt |
|---|---|
| **Was fehlt** | Nachweis, woher `/composites/heels-shoes-stilllife.webp` und `/composites/hero-stage.webp` stammen |
| **Warum ROT** | `heels-shoes-stilllife.webp` (1600×1600) zeigt zwei Paar Tanzschuhe in einem leeren Saal mit Parkett-Muster und Sprossenfenstern. Dieser Raum sieht **nicht** aus wie das Salsaflow-Studio auf den anderen Bildern. Das ist entweder Stock oder KI-generiert. |
| **Risiko** | Ein Stock-Bild ohne Lizenz ist ein Abmahnrisiko. Ein KI-Bild, das als „unser Studio“ gelesen wird, ist eine Irreführung. |
| **Ist-Zustand** | **EXIF komplett entfernt** — `identify -verbose` liefert nur `date:create: 2026-08-10` vom Build. Herkunft technisch nicht rekonstruierbar. |
| **Lösung** | Entweder Lizenz-/Quellnachweis beibringen, oder Asset ersetzen durch ein echtes Studio-Foto, oder klar als Illustration kennzeichnen und nicht neben Standort-Aussagen platzieren. |
| **Entscheidung braucht** | Salsaflow / Raphael: Woher kommen diese Dateien? |

---

## 3. GELB — vor Launch klären

### L-02 — Fremd-Watermarks auf Show-Fotos

Belegt aus [`src/public/shows/animationen-content.ts:9-10`](/root/clients/salsaflow-dc/src/public/shows/animationen-content.ts): `show-04` und `show-22` tragen ein „Bail Adoro“-Wasserzeichen, `show-15` ein fremdes Event-Logo.
**Lösung:** nicht verwenden (ist im Code bereits so gehandhabt) **oder** Nutzungsrecht des Fotografen einholen. Dateien zur Sicherheit löschen.

### L-03 — Fotografen-Credits

Auf `/fotos-1/` steht belegt „Fotos by Urs Müller“ und „Fotos by Valentin“ (Nachname laut Dossier: Behringer).
**Offen:** Gilt der Credit auch im Relaunch? Ist er Pflicht laut Vertrag? Dürfen die Bilder überhaupt in eine neue Site übernommen werden?
**Lösung:** Schriftliche Bestätigung einholen; Credit-Zeile in der Galerie-Fussleiste einplanen.

### L-04 — Kein Lizenz-Register

Da EXIF überall entfernt ist, gibt es **keine** maschinelle Spur, welches Bild von wem stammt.
**Lösung:** Eine Tabelle `assets-lizenzen.md` mit Spalten Datei / Fotograf / Datum / Nutzungsrecht / Freigabe. Muss von Salsaflow befüllt werden. Ohne sie ist jede spätere Rechtsfrage unbeantwortbar.

### P-03 — Zuordnung Portrait → Person unbestätigt

Die Dateinamen (`fabio.webp`, `claudia.webp`, `sebastian.webp`, `vanessa.webp`) legen die Zuordnung nahe, **beweisen sie aber nicht**. Ein falsch beschriftetes Portrait ist peinlich und potenziell persönlichkeitsrechtlich heikel.
**Bis zur Bestätigung:** neutrale Alt-Texte (`'Mitgründerin von Salsaflow, freigestelltes Portrait'`).
**Danach:** Namensform aktivieren.

### P-04 — Nachwuchs-/Talentpool ohne Bilder

Die Live-Site erwähnt einen Talentpool, nennt aber **keine Namen** und zeigt keine Portraits.
**Lösung:** Entweder Portraits im gleichen Cutout-Stil nachziehen (gleicher Hintergrund, gleiche Ausleuchtung wie `teacher-*.webp`), oder die Fläche weglassen. Halbe Lösung = inkonsistentes Grid.

### P-05 — Keine Level-Bilder für Kursaufbau

Für Level 1–4 braucht es vier **unterscheidbare** Motive, damit die Progression sichtbar wird.
**Vorhanden:** Step-Diagramme (`step-salsa.webp`, `step-bachata.webp`) — die sind gut und funktional.
**Fehlt:** vier echte Fotos, die Anfänger vs. Fortgeschrittene zeigen.
**Zwischenlösung:** Mit Step-Diagrammen + einem Kursfoto arbeiten, statt vier beliebige Fotos zu nehmen, die alle gleich aussehen.

### P-07 — Kein Anfahrts-/Eingangsbild

Elisabethenanlage 7, **1. Stock** — Gäste müssen den Eingang finden.
**Fehlt:** Foto der Hausfassade mit Nummer, Foto des Eingangs/Klingelschilds, Kartenausschnitt.
**Wirkung:** Senkt No-Shows bei der Probestunde spürbar. Billig zu produzieren (Handy reicht bei gutem Licht).

### P-10 — Favicon-Set unvollständig

`favicon.jpg` ist ein **JPG** mit 929×969 — als Favicon technisch ungeeignet.
Zusätzlich: `favicon.jpg` und `logo/salsaflow-icon.jpg` sind **byte-identisch** (je 53 797 B) — eine Datei ist redundant.
**Lösung:** `favicon.svg` + `favicon-96.png` + `apple-touch-icon-180.png` + `icon-512.png` aus `salsaflow-logo-schwarzrot-mit-dc.png` (2000×2000) ableiten.

---

## 4. GRÜN — nach Launch

### P-06 — Hochzeitstanz-Motiv
Privatstunden werden auch für Hochzeitspaare verkauft. Ein echtes Hochzeitspaar-Motiv (mit Freigabe!) wäre stark, ist aber kein Blocker. **Nie** ein Stock-Hochzeitspaar verwenden — das erkennt jeder.

### P-08 — Galerie ist komplett 2023
Gemessen: Die Live-Galerie enthält ausschliesslich vier Blöcke aus 2023 (Danceflow Nights März/August/Dezember, Anniversary April). Die neuesten Bilder im Repo (`/photos/2026/`) sind **nicht** in der Live-Galerie.
**Wirkung:** Wer die Galerie öffnet, sieht eine Schule, die seit drei Jahren nichts gemacht hat.
**Lösung:** Galerie nach Jahr gruppieren, 2026 zuerst. Ein Kuratierungs-Rhythmus (nach jeder Danceflow Night 10–15 Bilder) verhindert die Wiederholung.

### P-11 — Key-Visuals für FLOWeekend / Anniversary
Fotos existieren, ein **gestaltetes** Key-Visual mit Datum und Wordmark nicht. Für Social-Ankündigungen nützlich.

### P-12 — Blog-/AEO-Artikelbilder
Nur relevant, falls der SEO-Plan Artikel vorsieht. Dann 1600×900 pro Artikel.

### T-01 — AVIF-Ausspielung
WebP-Grössen sind bereits gesund (Median ~120 KB). AVIF brächte 20–30 %. Nette Optimierung, kein Blocker.

### T-02 — Aufräumen
127 unreferenzierte Dateien (~13 MB), davon 6 leere Platzhalter, 3 Mini-Crops und zahlreiche Alt-JPGs, die durch `-v3.webp` ersetzt wurden.
**Lösung:** In einem eigenen Commit löschen — **nicht** vermischt mit Feature-Arbeit, damit der Diff lesbar bleibt.

---

## 5. Gap-Matrix kompakt

| ID | Lücke | Ampel | Aus Bestand lösbar? | Braucht Entscheidung von |
|---|---|:--:|---|---|
| P-01 | Privatstunden-Motiv falsch | 🔴 | Zwischenlösung ja, echte Lösung nein | Salsaflow (Shooting) |
| P-02 | Kein Review-Proof | 🔴 | nein | Salsaflow (Freigabe) |
| P-09 | Kein OG-Bild 1200×630 | 🔴 | **ja** | — |
| L-01 | Composite-Provenienz | 🔴 | nein | Salsaflow / Raphael |
| L-02 | Fremd-Watermarks | 🟡 | ja (nicht verwenden) | — |
| L-03 | Fotografen-Credits | 🟡 | nein | Salsaflow |
| L-04 | Lizenz-Register fehlt | 🟡 | nein | Salsaflow |
| P-03 | Portrait-Zuordnung | 🟡 | ja (neutral formulieren) | Salsaflow |
| P-04 | Nachwuchs-Portraits | 🟡 | nein | Salsaflow |
| P-05 | Level-Bilder | 🟡 | teilweise | — |
| P-07 | Anfahrt/Eingang | 🟡 | nein | Salsaflow (Handy-Fotos) |
| P-10 | Favicon-Set | 🟡 | **ja** | — |
| P-06 | Hochzeitstanz | 🟢 | nein | Salsaflow |
| P-08 | Galerie veraltet | 🟢 | **ja** | — |
| P-11 | Event-Key-Visuals | 🟢 | ja | — |
| P-12 | Blog-Bilder | 🟢 | nein | abhängig vom SEO-Plan |
| T-01 | AVIF | 🟢 | ja | — |
| T-02 | 13 MB aufräumen | 🟢 | **ja** | — |

---

## 6. Was Salsaflow liefern muss (eine Liste, zum Weiterreichen)

1. **Shooting Privatstunden** — 45 Min, Lehrperson + ein Paar, Tageslicht. *(P-01)*
2. **Freigabe Google-Reviews** — welche Zitate dürfen wörtlich, mit Vorname und Datum? *(P-02)*
3. **Herkunft der Composite-Bilder** — Stock, KI oder eigenes Foto? *(L-01)*
4. **Fotografen-Rechte** — dürfen Urs Müllers und Valentins Bilder in die neue Site, mit welchem Credit? *(L-03)*
5. **Portrait-Zuordnung bestätigen** — welches Bild ist welche Person? *(P-03)*
6. **Vier Handy-Fotos**: Hausfassade mit Nummer, Eingang, Treppe/Lift, Klingelschild. *(P-07)*
7. **Nachwuchs-Team** — Namen und Portraits, oder Fläche streichen? *(P-04)*
8. **Aktuelle Event-Fotos 2026** — für die Galerie. *(P-08)*

---

## 7. Validierung dieser Datei

| Check | Ergebnis |
|---|---|
| Jede Lücke mit Beleg oder klarem `OFFEN` | ja |
| Erfundene Rechte / Fotografen / Personen | keine |
| Blocker von Nice-to-have getrennt | ja (3 Ampelstufen) |
| Aus Bestand lösbare Punkte markiert | ja (6 von 18 ohne Rückfrage lösbar) |
| Production-Code geändert | **nein** |

**Ende `02b-asset-gaps.md`.**
