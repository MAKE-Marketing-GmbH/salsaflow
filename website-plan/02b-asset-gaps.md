# Salsaflow Dance Company — Asset-Gap-Matrix, Version 2

**Version:** 2 · **Stand:** 2026-08-12
**Rolle:** Asset-Planung (kreativ) — Aufgeräumt und erweitert
**Bezug:** [02-asset-inventar.md](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md) · [13-final-critic.md](/root/clients/salsaflow-dc/website-plan/13-final-critic.md) · kanonische Seitenmappe [06-seiten/](/root/clients/salsaflow-dc/website-plan/06-seiten/) (nur `0N-*.md`)
**Scope:** PLANNING ONLY — kein Production-Code geändert
**Regel:** Keine erfundenen Bilder, Rechte, Fotografen oder Personen. Alles Ungeklärte ist `OFFEN` markiert. Version 1 wird durch diese Datei ersetzt.

---

## 0. Kernaussage in fünf Zeilen

1. **Ein einziges Studio-Shooting (ca. 2,5–3 Stunden) löst sechs der acht offenen Bildlücken** — Privatstunde, drei Stil-Kursmotive, Studio/Eingang, Danceflow-Stimmung neu.
2. **Nur zwei echte P0-Blocker bleiben:** Das Privatstunden-Motiv belegt semantisch keinen 1:1-Unterricht (Befund 5), und die Composite-Provenienz ist ungeklärt. Alles andere hat einen funktionierenden Fallback.
3. **Ein OG-Default-Bild existiert bereits** (`hp-05.webp`, 1800×1200) — der alte P0-Status war überzogen (Befund 12); nötig ist nur ein sauberer 1200×630-Crop.
4. **Von 22 Bedarfsflächen sind 13 sofort aus dem Bestand bedienbar** — das Mapping Bestand → Slot steht in Abschnitt 5, das Shooting deckt den Rest.
5. **Das grösste Aufräum-Potenzial ist kein Fehlen, sondern Überschuss:** 127 unreferenzierte Dateien (~13 MB) und 6 leere Platzhalter gehören in einen eigenen Lösch-Commit.

---

## 1. Änderungen gegenüber Version 1 (aufgeräumt)

| Was | Version 1 | Version 2 | Grund |
|---|---|---|---|
| P-02 Review-Proof | ROT / Launch-Blocker | **P1** — Fläche weglassen ist die vorgesehene Lösung | Befund 12: kein Abnahme-Kriterium unerfüllbar |
| P-09 OG-Bild | ROT / Launch-Blocker | **P1** — Default `hp-05.webp` existiert und ist verdrahtet ([seo-config.ts:82-91](/root/clients/salsaflow-dc/src/lib/seo-config.ts)) | Befund 12: kein „grauer Kasten", da gültiges Defaultbild vorhanden |
| P-01 Privatstunden | ROT, „Zwischenlösung ja" | **P0, Zwischenlösung semantisch korrigiert** — Bestandsbilder nur mit neutraler Paar-/Tanz-Alt, nie als Lehrer/Schüler-Beleg | Befund 5: Paar-Fotos belegen keinen 1:1-Unterricht |
| Shot-Liste | nicht vorhanden | **Abschnitt 2** — 8 Pflicht-Motive mit Slot-Verweis und Alt-Entwurf | Nutzerwunsch „mehr Assets überlegen" |
| Grafik-Assets | verstreut (P-09, P-10) | **Abschnitt 3** — OG-Spec, Favicon-Check, Stil-Icons, Empty-State | Nutzerwunsch „das gesamte Ding aufräumen" |
| Prioritäten | Ampel ROT/GELB/GRÜN, 4 Blocker | **P0/P1/P2**, 2 Blocker | Befund 12: kein Blocker-Inflationieren |

---

## 2. Shot-Liste Studio-Shooting (ein Termin, eine Crew)

**Rahmen:** Studio Elisabethenanlage 7, Tageslicht am späten Nachmittag plus eine abgedunkelte Abend-Einheit für Danceflow-Stimmung. Dauer ca. 2,5–3 Stunden. Personen: 1–2 Lehrpersonen, 1 Paar (Schüler-Rolle), 4 Gründer, 6–10 Kursteilnehmende für Gruppenmotive. **Vor dem ersten Auslösen: unterschriebene Bildfreigaben aller Abgebildeten** (AGB regeln Foto-Nutzung restriktiv, [01-firma-dossier.md](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md)). Alt-Texte sind Entwürfe und werden nach der Auswahl bildgenau finalisiert (Regelwerk [02-asset-inventar.md](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md), Abschnitt 6.3).

### S-01 — Echte Privatstunde (das P0-Motiv)

| Feld | Inhalt |
|---|---|
| **Zweck** | Belegt glaubwürdig 1:1-Unterricht. Löst Befund 5 und Gate P-01. Das teuerste Produkt (CHF 100–130/Lektion) bekommt ein ehrliches Bild. |
| **Ziel-Slots** | Hero + Ablauf-Sektion [06-seiten/07-privatstunden.md](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md), Abschnitt 4 · Angebots-Karte „Privat" [06-seiten/01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md), Section 4 |
| **Bildaufbau** | Lehrperson steht neben (nicht gegenüber) einer einzelnen Schülerin oder einem Schüler und zeigt mit der Hand auf Fussstellung oder Armführung; Blickkontakt zwischen beiden, lockeres Lächeln. Zusätzlich eine Variante, in der die Lehrperson eine Drehung vormacht und die Schülerin nachmacht. Beide Varianten quer UND hoch. |
| **Format** | Beide: Querformat 3:2 (Hero/Ablauf) + Hochformat 3:4 (Karte, mobil). 6–8 brauchbare Motive. |
| **Alt-Entwurf** | `Eine Tanzlehrperson erklärt einer Schülerin die Armführung in einer Privatstunde im Salsaflow-Studio.` / Ablauf-Variante: `Eine Lehrperson tanzt eine Drehung vor, eine Schülerin macht sie im Privatunterricht nach.` |
| **Erkennbarkeit** | Dass es Unterricht ist, muss aus dem Bild lesbar sein: nur zwei Personen im Raum, erkennbare Zeige-/Korrekturgeste. **Nicht** einfach ein tanzendes Paar fotografieren — das ist genau der Fehler des Ist-Zustands. |

### S-02 — Gruppenkurs Salsa

| Feld | Inhalt |
|---|---|
| **Zweck** | Eigenes, aktuelles Kurs-Motiv pro Stil; ersetzt die Abhängigkeit von den Premium-Crops allein. |
| **Ziel-Slots** | Hero Stilseite Salsa + Kurskarten-Filter [06-seiten/03-stilseiten-salsa-bachata-heels.md](/root/clients/salsaflow-dc/website-plan/06-seiten/03-stilseiten-salsa-bachata-heels.md) · Kursplan-Karten [06-seiten/06-kursplan.md](/root/clients/salsaflow-dc/website-plan/06-seiten/06-kursplan.md) |
| **Bildaufbau** | 6–8 Paare in Reihe vor der Spiegelwand, Lehrperson vorne mit dem Rücken zur Kamera (oder halb seitlich), alle im gleichen Grundschritt — Synchronität als Kurs-Code. |
| **Format** | Querformat 3:2; eine zweite Einstellung 21:9 für Hero-Bleed. |
| **Alt-Entwurf** | `Ein Salsa-Kurs übt den Grundschritt vor der Spiegelwand, die Lehrperson tanzt vorne vor.` |

### S-03 — Gruppenkurs Bachata

| Feld | Inhalt |
|---|---|
| **Zweck** | Wie S-02, eigener Slot Bachata. |
| **Ziel-Slots** | Hero Stilseite Bachata, dieselbe Datei wie S-02. |
| **Bildaufbau** | Paare in geschlossener Tanzhaltung, Kamera leicht von der Seite, warmes Studiolicht; ein Lehrpersonen-Paar in der Mitte des Raums als sichtbares Vorbild. Nähe und Haltung sind der Bachata-Code. |
| **Format** | Querformat 3:2 + 21:9. |
| **Alt-Entwurf** | `Paare tanzen Bachata in geschlossener Haltung, ein Lehrpaar zeigt die Figur in der Raummitte.` |

### S-04 — Gruppenkurs Heels

| Feld | Inhalt |
|---|---|
| **Zweck** | Wie S-02, eigener Slot Heels. Ersetzt langfristig auch die Composite-Versuchung (L-01). |
| **Ziel-Slots** | Hero Stilseite Heels, dieselbe Datei wie S-02. |
| **Bildaufbau** | Solo-Gruppe (keine Paare), Choreografie-Moment mit erhobenem Arm oder Pose am Ende einer Lauf-Sequenz; Absatzschuhe im Bild sichtbar. Energie hoch, keine Statik. |
| **Format** | Querformat 3:2 + 21:9. |
| **Alt-Entwurf** | `Eine Gruppe tanzt eine Heels-Choreografie mit erhobenen Armen im hellen Studio.` |

### S-05 — Team-Porträts auf einheitlichem Hintergrund

| Feld | Inhalt |
|---|---|
| **Zweck** | Ergänzt die vorhandenen Cutouts (`/photos/founders/`, `/photos/team/teacher-*.webp`) um die fehlenden freigegebenen Lehrpersonen und ersetzt perspektivisch die 240×240-Altporträts. Löst P-03/P-04 materiell, sobald Zuordnung bestätigt ist. |
| **Ziel-Slots** | Profilkarten [06-seiten/10-team.md](/root/clients/salsaflow-dc/website-plan/06-seiten/10-team.md), Abschnitt 7 · Gründer-Reihe [06-seiten/01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md), Section 1 |
| **Bildaufbau** | Gleiche Wand (helle Studiowand wie im Home-Hero), gleiche Kameraposition, Brustbild, gleiche Ausleuchtung. Pro Person 2–3 Einstellungen: neutral freundlich + in Bewegung (Drehung angedeutet). Zusätzlich ein **Gruppenfoto der vier Gründer** nebeneinander — das fehlt im Bestand und wird auf der Home explizit gewünscht. |
| **Format** | Hochformat 3:4 (kartenkompatibel zu den bestehenden 1000×1414-Cutouts) + Querformat 3:2 für das Gruppenfoto. |
| **Alt-Entwurf** | Einzeln: `Porträt von <Vorname>, Tanzlehrperson bei Salsaflow.` (Name nur nach bestätigter Zuordnung, sonst `Porträt einer Tanzlehrperson von Salsaflow im Studio.`) · Gruppe: `Claudia, Fabio, Sebastian und Vanessa stehen nebeneinander im Salsaflow-Studio.` (ebenfalls erst nach Bestätigung) |

### S-06 — Studio und Eingang aussen

| Feld | Inhalt |
|---|---|
| **Zweck** | Auffindbarkeit (1. Stock, Klingelschild), Local-SEO-Beleg, Vertrauen vor der Probestunde. Löst P-07. |
| **Ziel-Slots** | Anfahrt-Block [06-seiten/12-kontakt.md](/root/clients/salsaflow-dc/website-plan/06-seiten/12-kontakt.md) · LocalBusiness-Bildmaterial ([04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md)) |
| **Bildaufbau** | Vier Aufnahmen: (1) Fassade mit Hausnummer Elisabethenanlage 7, (2) Eingangstür mit Klingelschild/Türschild Salsaflow, (3) Treppe oder Lift zum 1. Stock, (4) Studio leer bei Tageslicht mit sichtbarer Studiowand. Handy-Qualität reicht technisch, aber beim Shooting ohnehin mit dabei. |
| **Format** | Je quer 3:2; Eingang zusätzlich hoch 3:4. |
| **Alt-Entwurf** | `Hauseingang Elisabethenanlage 7 in Basel mit Salsaflow-Türschild.` / `Leeres Salsaflow-Studio bei Tageslicht mit heller Studiowand.` |

### S-07 — Danceflow Night Stimmung (Abend-Einheit)

| Feld | Inhalt |
|---|---|
| **Zweck** | Aktuelle (2026) Party-Motive; der Bestand ist stark, aber die Live-Galerie ist komplett 2023 (P-08). Frische Bilder verhindern den Eindruck einer inaktiven Schule. |
| **Ziel-Slots** | Danceflow-Block [06-seiten/08-events.md](/root/clients/salsaflow-dc/website-plan/06-seiten/08-events.md) · Galerie-Neuzugang [06-seiten/11-fotos.md](/root/clients/salsaflow-dc/website-plan/06-seiten/11-fotos.md) · OG-Variante Events |
| **Bildaufbau** | Gedimmtes Licht mit warmer/prägnanter Lichtfarbe, volle Tanzfläche aus leicht erhöhter Perspektive; dazu 2–3 enge Momente (Drehung, Lachen, Hand-Detail). Keine gestellten Posen — dokumentarisch während einer echten Night oder mit eingeladenen Tänzenden nachgestellt. |
| **Format** | Querformat 3:2; eine Einstellung 16:9 für Hero-Flächen. 10–15 kuratierte Bilder pro Night als Kuratierungs-Rhythmus (löst P-08 strukturell). |
| **Alt-Entwurf** | `Volle Tanzfläche bei einer Danceflow Night im gedimmten Licht.` |

### S-08 — Hochzeitspaar-Variante der Privatstunde (optional, gleiches Setup)

| Feld | Inhalt |
|---|---|
| **Zweck** | Privatstunden werden auch für Hochzeitstanz gebucht ([06-seiten/07-privatstunden.md](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md), Zielgruppen). Löst P-06. **Nur, wenn ein echtes Paar mit Freigabe verfügbar ist — nie Stock.** |
| **Ziel-Slots** | Anlass-Block auf der Privatstunden-Seite. |
| **Bildaufbau** | Ein Paar übt mit der Lehrperson eine langsame Figur; Alltagskleidung, kein Brautkleid — der Anlass steht in der Copy, nicht im Kostüm. |
| **Format** | Hoch 3:4. |
| **Alt-Entwurf** | `Ein Paar übt mit einer Tanzlehrperson seine Hochzeitstanz-Figur in einer Privatstunde.` (nur wenn das Paar tatsächlich für eine Hochzeit übt, sonst neutral) |

**Shooting-Nebenbedingung:** Aus S-01, S-05 und S-06 lassen sich die OG- und Kartencrops direkt ableiten — dafür immer den vollen Sensor freihalten, nicht in Kamera croppen.

---

## 3. Grafik-Assets (Spezifikationen, keine Bilder erfinden)

### G-01 — OG-Default-Bild 1200×630

**Ist-Zustand (korrigiert):** Ein OG-Bild existiert und ist verdrahtet — [`hp-05.webp`](/root/clients/salsaflow-dc/public/photos/showcase/hp-05.webp), 1800×1200 (3:2), als `DEFAULT_SOCIAL_IMAGE` in [seo-config.ts:82-91](/root/clients/salsaflow-dc/src/lib/seo-config.ts) und identisch in [index.html:25-30](/root/clients/salsaflow-dc/index.html). Es funktioniert, ist aber nicht kanonisch beschnitten: WhatsApp/LinkedIn croppen auf 1,91:1 und schneiden damit Motiv-Ränder ab.

**Spec für den echten 1200×630-Default:**

| Feld | Vorgabe |
|---|---|
| Masse | exakt 1200×630 px, WebP, Ziel ≤ 150 KB |
| Quelle | Neuer Crop aus `/photos/2026/hero-paar-studiowand-01.webp` (1920×1280) — Marke/Studiowand ist im Bild, wärmste Aufnahme des Bestands |
| Sichere Zone | Zentrale 1200×500 für Motiv; Wortmarke `salsaflow-wordmark-weiss.png` unten links mit 40 px Rand, nie in den äussersten 65 px (runde Avatare/Crops der Plattformen) |
| Abdunklung | `#0a0a0a`-Overlay 30–35 % nur hinter der Wortmarke, nicht über dem ganzen Bild |
| Alt | `Ein Paar tanzt Salsa vor der hellen Salsaflow-Studiowand.` (DE/EN gepflegt) |
| Ablage | `/public/og/og-default-1200x630.webp`; danach `DEFAULT_SOCIAL_IMAGE` auf dieses Bild umstellen |
| Varianten (P2) | Je ein 1200×630-Crop für Kurse (`kurse-classfreude-01`), Privatstunden (aus S-01, sobald vorhanden), Danceflow Night (aus S-07 oder `danceflow-home-2000.webp`) |

### G-02 — Favicon / Touch-Icons — Check

**Ist-Zustand:** Nur `favicon.jpg` (929×969, **JPG** — als Favicon ungeeignet) und byte-identisch mit `logo/salsaflow-icon.jpg` (beide 53 797 B). Kein ICO, PNG, SVG oder Apple-Touch-Icon im Repo.

**Zu erzeugen (alles aus einer Quelle ableitbar):**

| Datei | Masse | Quelle / Bemerkung |
|---|---|---|
| `favicon.ico` | 16/32/48 Multi-Size | aus `salsaflow-logo-schwarzrot-mit-dc.png` (2000×2000), auf Quadrat gepolstert |
| `favicon.svg` | Vektor | aus der Logo-Vorlage, falls eine SVG-Quelle existiert; sonst entfällt SVG und PNG reicht (`OFFEN`: SVG-Master anfragen) |
| `icon-192.png`, `icon-512.png` | 192², 512² | für Web-App-Manifest |
| `apple-touch-icon.png` | 180×180 | ohne Transparenz-Spielräume, Hintergrund `#fdfcfa` |
| Aufräumen | — | `favicon.jpg` und `logo/salsaflow-icon.jpg` nach Umstellung löschen (redundant) |

### G-03 — Stil-Icons / Marker im Design-A-Stil (nur Beschreibung)

Je Stil ein dünnes Linien-Icon, gezeichnet im Stil der vorhandenen `/graphics/`-SVGs (dünne Kontur, keine Füllung, Akzent `#ad1827` erst bei Hover/Aktiv):

- **Salsa:** Zwei überkreuzte Fussabdruck-Paare im Grundschritt-Muster (Anlehnung an `step-salsa.webp`, aber reduziert auf reine Linie).
- **Bachata:** Zwei wellenförmig verschlungene Linien als Körpernähe-Metapher, horizontal, ruhig.
- **Heels:** Eine einzige Pumps-Silhouette als reine Konturlinie, Absatz leicht angehoben.

Einsatz: Kursplan-Filter-Chips, Stilseiten-Eyebrow, Kurskarten-Ecke. Semantisch dekorativ neben Text → `alt=""`, Titel nur im SVG (`<title>Salsa</title>`) für Tooltips. Lieferung als je eine SVG-Datei, 24×24-Viewbox.

### G-04 — Kursplan-Empty-State-Illustration (nur Beschreibung)

Für den Leer-Zustand des Kursplans (Copy steht bereits: „Keine passenden Kurse gefunden. Filter anpassen oder WhatsApp schreiben.", [05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md), Abschnitt 6):

Ruhige Linien-Illustration im `/graphics/`-Stil: eine einzelne, offene Tür zur Studiowand mit zwei wartenden Tanzschuhpaaren davor, Akzentlinie in `#ad1827` als Türrahmen. Warm, nicht traurig — die Tür steht offen. Eine SVG-Datei, ~200×160-Viewbox, `alt=""` (dekorativ; die Aussage steht im Text daneben).

---

## 4. Prioritäten P0 / P1 / P2

**Regel (aus [13-final-critic.md](/root/clients/salsaflow-dc/website-plan/13-final-critic.md), Befund 12):** P0 ist nur, was einen Abnahme-Check wirklich unerfüllbar macht. „Wichtig" ist kein Blocker-Grund.

### P0 — blockiert die Abnahme

| ID | Lücke | Warum P0 | Lösung |
|---|---|---|---|
| P-01 | Privatstunden-Motiv belegt keinen 1:1-Unterricht | Teuerstes Produkt; falsches Bild ist aktiver Schaden; Befund 5 | Shot S-01; bis dahin neutrale Alt-/Copy-Semantik oder Textkarte ohne Bild (Fallback existiert und ist in [07-privatstunden.md](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md) festgeschrieben) |
| L-01 | Composite-Provenienz (`heels-shoes-stilllife.webp`, `hero-stage.webp`) ungeklärt | Stock ohne Lizenz = Abmahnrisiko; KI-Bild als „unser Studio" = Irreführung | Herkunft klären **oder** nicht verwenden (Stilseiten-Spec schliesst das Heels-Composite bereits aus) |

### P1 — vor Launch erledigen, Fallback vorhanden

| ID | Lücke | Fallback, der heute trägt |
|---|---|---|
| P-02 | Kein belegter Review-Proof | Wall-of-Love-Fläche weglassen — ist die vorgesehene sichere Lösung |
| P-09 | OG-Default nicht kanonisch 1200×630 | `hp-05.webp` (1800×1200) ist verdrahtet und gültig; Crop nach G-01 nachziehen |
| P-10 | Favicon-Set unvollständig, JPG-Favicon | G-02-Ableitungen aus dem 2000²-Logo erzeugen |
| P-03 | Portrait-Zuordnung Datei → Person unbestätigt | Neutrale Alt-Texte (steht bereits in den Specs) |
| L-03 | Fotografen-Credits (Urs Müller, Valentin) | Kurzfristig Galerie-Einschränkung auf eigene/ungeklärte freie Bilder vermeiden — schriftliche Bestätigung einholen |
| L-04 | Kein Lizenz-Register | Tabelle anlegen, sobald L-01/L-03 beantwortet sind |
| S-02/03/04 | Stil-Kursmotive neu | Premium-Crops (`offer-salsa/bachata/heels`) sind gut und referenziert |
| P-07 | Eingang/Anfahrt (S-06) | Adresse + Karte mit Klick-Ladung reicht für den Start |

### P2 — nach Launch

| ID | Lücke |
|---|---|
| P-04 | Nachwuchs-/Talentpool-Porträts (oder Fläche streichen) |
| P-05 | Vier unterscheidbare Level-Fotos (Zwischenlösung: Step-Diagramme + ein Kursfoto) |
| P-06 | Hochzeitstanz-Motiv (S-08) |
| P-08 | Galerie-Verjüngung: 2026 zuerst, Kuratierungs-Rhythmus nach jeder Night |
| P-11 | Event-Key-Visuals (FLOWeekend, Anniversary) |
| P-12 | Blog-/AEO-Artikelbilder (nur falls Blog kommt) |
| T-01 | AVIF-Ausspielung |
| T-02 | 127 unreferenzierte Dateien (~13 MB) + 6 leere Platzhalter löschen — eigener Commit |
| G-03/G-04 | Stil-Icons und Empty-State-Illustration |
| OG-Varianten | Seitenspezifische 1200×630-Crops |

---

## 5. Mapping: Bestand löst Slot vs. zwingend neu

### 5.1 Aus dem Bestand sofort bedienbar (13 Flächen)

| Slot (kanonische Spec) | Bestands-Asset | Bemerkung |
|---|---|---|
| Home Hero ([01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md)) | `/photos/2026/hero-paar-studiowand-01.webp` + `hero-paar-dreh-01-portrait.webp` (mobil) | Festgeschrieben |
| Home Angebots-Karten Salsa/Bachata/Heels | `offer-salsa-1200.webp`, `offer-bachata-1200.webp`, `offer-heels-1200.webp` | Gut |
| Home Community-Band | `/photos/2026/community-crowd-01.webp` | Gut |
| Kurse-Hero ([02-tanzkurse.md](/root/clients/salsaflow-dc/website-plan/06-seiten/02-tanzkurse.md)) | `kurse-classfreude-hero-2100.webp` | Gut |
| Stilseiten-Heros ([03-stilseiten](/root/clients/salsaflow-dc/website-plan/06-seiten/03-stilseiten-salsa-bachata-heels.md)) | die drei Premium-Offer-Bilder | Heels-Composite ausdrücklich ausgeschlossen |
| Kursaufbau ([04-kursaufbau.md](/root/clients/salsaflow-dc/website-plan/06-seiten/04-kursaufbau.md)) | `step-salsa.webp`, `step-bachata.webp` (funktional) | Level-Fotos sind P2 |
| Events / Danceflow ([08-events.md](/root/clients/salsaflow-dc/website-plan/06-seiten/08-events.md)) | `/photos/premium/danceflow-home-2000.webp` + kuratierte `/photos/party/`-v3 | Gut |
| Shows ([09-shows-animationen.md](/root/clients/salsaflow-dc/website-plan/06-seiten/09-shows-animationen.md)) | `/photos/shows/` ohne `show-04/05/06/15/18/22` | Kuratiert |
| Team-Grid ([10-team.md](/root/clients/salsaflow-dc/website-plan/06-seiten/10-team.md)) | `/photos/founders/` (4) + `/photos/team/teacher-*.webp` (5) | Mit neutralen Alts bis P-03 |
| Preise-Kontextbild | `/photos/schedule/kurs-aktion.webp` | Gut |
| Kontakt-Motiv | aus `/photos/2026/` ableitbar | Gut |
| Galerie ([11-fotos.md](/root/clients/salsaflow-dc/website-plan/06-seiten/11-fotos.md)) | `/photos/party/`, `/photos/gallery/` (`-v3.webp`) | Inhaltlich gut, Jahres-Sortierung P2 |
| OG-Default | `/photos/showcase/hp-05.webp` (1800×1200) | Funktioniert; 1200×630-Crop P1 |

### 5.2 Semantisch bedingt lösbar (nur mit neutraler Beschreibung)

| Slot | Bestands-Asset | Einschränkung (Befund 5) |
|---|---|---|
| Privatstunden Hero/Ablauf | `hero-paar-dreh-01-portrait.webp`, `hero-paar-studiowand-01.webp` | **Nur atmosphärischer Paar-Fallback.** Alt-Text darf nie „Lehrperson"/„Schülerin"/„Privatstunde" behaupten. Korrekte Form: `Ein Paar tanzt Salsa im Salsaflow-Studio.` Die Rollen-Alt-Texte in [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md) (Zeile 213) und [07-privatstunden.md](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md) (Zeile 52) müssen auf diese neutrale Form umgebogen werden. |

### 5.3 Zwingend neu zu schiessen oder zu erzeugen

| Was | Shot/Spec | Warum kein Bestand |
|---|---|---|
| Echte Privatstunde (Lehrperson + 1 Person, Unterricht lesbar) | S-01 | Kommt im gesamten Bestand und in der Live-Galerie nicht vor |
| Gruppenfoto der vier Gründer | S-05 | Nur Einzel-Cutouts vorhanden; Home-Section 1 wünscht Gruppenmotiv |
| Eingang/Fassade/1.-Stock-Wegweisung | S-06 | Kein Aussen-Motiv im Bestand |
| OG-Crop 1200×630 | G-01 | Kein einziges 1,91:1-Asset im Bestand |
| Favicon/Touch-Icon-Set | G-02 | Nur ein JPG vorhanden |
| Stil-Icons, Empty-State | G-03/G-04 | Nicht vorhanden (Illustrationen, keine Fotos) |
| Aktuelle Stil-Kursmotive 2026 (Qualitäts-Upgrade) | S-02/03/04 | Bestand trägt, ist aber Altbestand-Mix |
| Frische Danceflow-Motive 2026 | S-07 | Repo-Party-Bilder gut, Live-Galerie komplett 2023 |

---

## 6. Was Salsaflow liefern muss (aktualisierte Liste zum Weiterreichen)

1. **Shooting-Termin bestätigen** — ein Termin, 2,5–3 h, deckt S-01 bis S-07 ab. *(P-01, P-04, P-06, P-07, P-08)*
2. **Bildfreigaben** aller Abgebildeten vor dem Shooting unterschreiben lassen. *(TEAM-05)*
3. **Portrait-Zuordnung bestätigen** — welches vorhandene Cutout ist welche Person? *(P-03)*
4. **Herkunft der Composite-Bilder** (`heels-shoes-stilllife.webp`, `hero-stage.webp`) — Stock, KI oder eigenes Foto? *(L-01)*
5. **Fotografen-Rechte** — dürfen Urs Müllers und Valentins Bilder in die neue Site, mit welchem Credit? *(L-03)*
6. **Review-Freigabe** — welche Google-Bewertungen dürfen wörtlich zitiert werden (Vorname + Datum)? Sonst bleibt die Fläche leer. *(P-02)*
7. **SVG-Master des Logos**, falls vorhanden — für `favicon.svg`. *(G-02)*
8. **Nachwuchs-Team** — Namen und Portraits, oder Fläche streichen? *(P-04)*

---

## 7. Validierung dieser Datei

| Check | Ergebnis |
|---|---|
| Jede Shot/Spec mit Ziel-Slot in der kanonischen Seitenmappe (`0N-*.md`) | ja — Verweise in jeder Tabelle |
| Keine erfundenen Bilder als vorhanden ausgegeben | ja — jedes Bestands-Asset ist in [02-asset-inventar.md](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md) belegt oder per `identify`/Code-Read geprüft |
| Befund 5 eingearbeitet (Privatstunden semantisch) | ja — Abschnitte 1, 4, 5.2; neutrale Alt-Form festgeschrieben |
| Befund 12 eingearbeitet (kein Blocker-Inflationieren) | ja — nur 2× P0; P-02 und P-09 auf P1 mit dokumentiertem Fallback |
| Version-1-Ampel durch P0/P1/P2 ersetzt und begründet | ja — Abschnitt 1 |
| Production-Code geändert | **nein** |

**Ende `02b-asset-gaps.md`, Version 2.**
