# 05 — IA-Varianten (G-IA)

**Run-ID:** `wf_c3729fb9-2f4`  
**Gate:** G-IA — wartet auf Raphael (A/B/C oder Mix)  
**Judge-Empfehlung:** **Option A — Kernwege, stabile Adressen**

Quellen: [05-ia-entwurf-a.md](/root/clients/salsaflow-dc/website-plan/05-ia-entwurf-a.md), [05-ia-entwurf-b.md](/root/clients/salsaflow-dc/website-plan/05-ia-entwurf-b.md)

---

# FAIL — IA-Varianten und Ship-Gate

**Empfehlung:** Option A „Kernwege, stabile Adressen“.

Das verlangte Ziel [`05-ia-variants.md`](/root/clients/salsaflow-dc/website-plan/05-ia-variants.md) existiert noch nicht. Dieser Prüfer arbeitet laut bindender Harness-Regel read-only und durfte die Datei deshalb nicht anlegen. Der folgende Inhalt ist vollständig und kann unverändert in diese Datei übernommen werden.

**Stand:** 2026-08-12  
**Rolle:** IA-Judge  
**Modus:** PLANNING ONLY — kein Production-Code  
**Verbindlich:** [`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md) · [`DECISIONS.md`](/root/clients/salsaflow-dc/DECISIONS.md) · [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md)

---

## 1. Urteil in zwei Sätzen

Die heutige Repo-Struktur ist technisch bereits deutlich besser als die Live-Site, aber ihre Navigation ist noch ein Angebotskatalog: `/mehr` ist eine Restekiste, Event-Übersicht und Event-Details liegen unter verschiedenen Präfixen, und Shows werden mit Partys vermischt. Ein radikaler Neuaufbau ist dafür nicht nötig; Option A löst die belegten Probleme mit dem kleinsten URL-Risiko und gibt Kurswahl, Kursplan, Privatstunden und Danceflow klare Wege.

---

## 2. Mechanische Ausgangslage

### 2.1 Repo-Routen

Aus [`src/routes.tsx`](/root/clients/salsaflow-dc/src/routes.tsx):

- 33 Routendefinitionen insgesamt.
- 27 Einträge der Klasse `seo-public`, darunter drei Redirect-Routen.
- 5 Einträge der Klasse `app-public`.
- 1 Eintrag der Klasse `app-private`.
- 26 Routen werden vorgerendert.
- 3 bestehende Redirects.

Der aktive Inhaltsbaum umfasst unter anderem:

```text
/
/tanzkurse
  /tanzkurse/salsa
  /tanzkurse/bachata
  /tanzkurse/heels
/privatstunden
/kursaufbau
/preise
/kursplan
/shows-animationen
/events
/events-workshops/danceflow-night
/events-workshops/anniversary-weekend
/events-workshops/floweekend
/events-workshops/eventkalender
/team
/fotos
/kontakt
/kontakt/standort-raumvermietung
/mehr
  /mehr/collabs
  /mehr/tanzschuhe
  /mehr/partys
/faq
/impressum
/datenschutz
/buchung*
/admin
```

### 2.2 Aktive Navigation

[`SiteHeader.tsx`](/root/clients/salsaflow-dc/src/public/site/SiteHeader.tsx) führt aktuell sieben sichtbare Navigationspunkte plus CTA:

- Tanzkurse
- Kursplan
- Events
- Team
- Fotos
- Mehr
- Kontakt
- CTA zur Schnupperstunde

Belegte Strukturprobleme:

- `/mehr` bündelt FAQ, Collabs, Tanzschuhe und Partys. Diese Inhalte lösen verschiedene Aufgaben.
- `/events` ist die Übersicht, die Detailseiten liegen aber unter `/events-workshops/*`.
- `/shows-animationen` liegt im Events-Menü, obwohl die Hauptaktion eine B2B-Anfrage ist.
- Der Sprachschalter ändert derzeit den Browserzustand, nicht die Adresse; es gibt keine indexierbaren englischen Routen.

### 2.3 Bilder

Aus [`02-asset-inventar.md`](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md):

- 274 Bild- und SVG-Assets im Repo.
- 18 aktuelle Bilder unter `/photos/2026/`.
- 29 kuratierte Bilder unter `/photos/premium/`.
- Die Live-Galerie enthält 749 Bild-Tags, davon 744 mit leerem Alt-Text.
- Die 275 geprüften Vollbild-URLs der Live-Galerie sind eine starke Qualitätsquelle für Party- und Community-Fotografie, inhaltlich aber aus 2023.
- Die vorhandenen Privatstunden-Crops zeigen dasselbe ungeeignete Motiv. Ein echtes aktuelles 1:1-Privatstunden-Motiv fehlt.

---

## 3. Harte Kritik anhand der Screenshots

### 3.1 Live-Startseite

Beleg: [`live-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/live-home.png)

- Die Navigation behandelt zeitgebundene Kampagnen wie „Floweekend 2026“ und „Anniversary Weekend 2027“ als dauerhafte Hauptnavigation. Das macht den Kopf unruhig und altert schlecht.
- Der obere Seitenbereich ist weitgehend leer. Der eigentliche Inhalt beginnt spät.
- Der lange Willkommenstext verlangt Lesen, bevor ein Besucher einen klaren nächsten Schritt erkennt.
- Der Cookie-Dialog verdeckt einen grossen Teil des sichtbaren Inhalts.
- Das Audit belegt sieben H1 auf der Startseite. Die visuelle und semantische Hierarchie ist damit gleichzeitig beschädigt.

### 3.2 Vercel-Startseite

Beleg: [`vercel-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-home.png)

- Navigation und Markenrichtung sind wesentlich sauberer als live.
- Der Screenshot zeigt trotzdem einen fast leeren ersten Bildschirm mit sehr hellem Text und ohne sichtbares Hero-Bild.
- Ob die Ursache Lazy Loading, Reveal-Motion, Headless-Capture oder ein echter Renderfehler ist, ist mit dem Screenshot allein nicht bewiesen. Das Ergebnis ist dennoch ein Ship-Blocker: Ein zulässiger Lade-, Motion- oder Screenshot-Zustand darf nicht wie eine leere Seite aussehen.
- Das Hero-Gate muss deshalb den ersten Paint, JavaScript-Ausfall, `prefers-reduced-motion`, langsame Bilder und normale Browserdarstellung getrennt prüfen.

### 3.3 Live-Privatstunden

Beleg: [`live-privatstunden.png`](/root/clients/salsaflow-dc/website-plan/screenshots/live-privatstunden.png)

- Positiv: Anlass, Nutzen, Preise und Anfrage sind sofort sichtbar.
- Negativ: Das Foto wirkt statisch, gelbstichig und verkauft weder Bewegung noch persönliche Energie.
- Der Cookie-Dialog verdeckt erneut einen grossen Teil der Seite.
- Der Inhalt ist verständlicher als die Gestaltung. Diese Klarheit muss erhalten bleiben.

### 3.4 Vercel-Privatstunden

Beleg: [`vercel-privatstunden.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-privatstunden.png)

- Das ungeeignete Motiv wurde vergrössert und damit zum dominanten Problem gemacht.
- Die linke Hero-Hälfte ist fast leer; zentrale Inhalte wirken durch den sehr hellen Kontrast wie deaktiviert.
- „Ziel beschreiben“ ist als Hauptaktion schwächer als „Privatstunde anfragen“ oder „Preise und Termin anfragen“.
- Der sichtbare Use-Case Hochzeitstanz ist sinnvoll, aber ein passendes Bild fehlt. Kein Stock-Hochzeitspaar einsetzen; bis zu einem Shooting bleibt die Bildrolle allgemein „Paar in persönlicher Tanzsituation“.

---

# Option A — Kernwege, stabile Adressen

## 4. Leitidee

Die bereits starken kaufnahen Adressen bleiben stabil. Geändert werden nur die Stellen, an denen URL und Nutzerlogik nachweisbar widersprechen: Events bekommen einen gemeinsamen Elternpfad, `/mehr` verschwindet aus der Hauptnavigation und B2B-Anfragen werden von Party-Inhalten getrennt.

## 5. Sitemap

```text
/
├── /tanzkurse
│   ├── /tanzkurse/salsa
│   ├── /tanzkurse/bachata
│   └── /tanzkurse/heels
├── /kursaufbau
├── /preise
├── /kursplan
├── /privatstunden
├── /events
│   ├── /events/danceflow-night
│   ├── /events/floweekend
│   ├── /events/anniversary-weekend
│   └── /events/kalender
├── /shows-animationen
├── /team
├── /fotos
├── /kontakt
│   └── /kontakt/raum-mieten
├── /faq
├── /mehr/tanzschuhe       Footer/Ratgeber, vorerst stabil
├── /mehr/collabs          Footer, bis strategische Rolle geklärt
├── /impressum
├── /datenschutz
├── /agb                   nur falls S-04 bestätigt
├── /en/*                  eigene zweite Phase
└── /buchung* · /admin     noindex, nicht in der Hauptnavigation
```

`/mehr` selbst wird kein Hauptnavigationspunkt mehr. `/mehr/partys` wird in den Events-Hub integriert oder auf eine belegbar tragfähige Event-Seite weitergeleitet. Tanzschuhe und Collabs dürfen ihre bestehenden Adressen zunächst behalten; URL-Schönheit ist kein ausreichender Grund für zusätzliche Redirects.

## 6. Hauptnavigation

```text
Kurse ▾ | Kursplan | Privatstunden | Events ▾ | Team | Kontakt | [Probestunde anfragen]
```

**Kurse-Dropdown**

- Alle Tanzkurse
- Salsa
- Bachata
- Heels
- Welches Level passt?
- Preise

**Events-Dropdown**

- Event-Übersicht
- Danceflow Night
- FLOWeekend
- Anniversary Weekend
- Eventkalender

**Footer**

- Angebot: Kurse, Preise, Kursplan, Privatstunden, Shows
- Schule: Team, Fotos, FAQ, Kontakt, Raum mieten
- Ratgeber/Partner: Tanzschuhe, Collabs
- Recht: AGB falls bestätigt, Impressum, Datenschutz

## 7. Startseiten-Logik

Die Startseite bekommt nicht noch mehr Bausteine. Sie bekommt einen klaren Entscheidungsweg:

1. Hero: „Tanzen lernen in Basel“ mit echtem, sofort sichtbarem Foto.
2. Drei Einstiege: Salsa, Bachata, Heels.
3. Orientierung: Level, Preis, ohne Partner, Standort; nur belegte Fakten.
4. Kursplan-Teaser mit echten Zuständen.
5. Privatstunden als klarer zweiter Kaufweg.
6. Danceflow Night als Community-Einstieg.
7. Team und echte Fotografie als Vertrauen.
8. Kurze FAQ-Antworten.
9. Abschlussaktion zur Probestunde.

Keine Review-Fläche, solange keine echten freigegebenen Zitate vorliegen. Der Slot bleibt `PLACEHOLDER` oder entfällt.

## 8. Seitenlogik

### Tanzkurse und Stilseiten

Jede Seite beantwortet oben sofort:

- Für wen ist der Stil?
- Brauche ich einen Partner?
- Wie finde ich mein Level?
- Wo sehe ich Termine und Preise?

Fester Weiterweg:

```text
Stil verstehen → Level prüfen → Preis prüfen → Kursplan → Buchung
```

### Privatstunden

Reihenfolge:

1. Nutzen und Zielgruppen.
2. Belegte Preise.
3. Ablauf in wenigen Schritten.
4. Anfrageformular.
5. FAQ zu Termin, Personenzahl und Hochzeitstanz, nur soweit bestätigt.

Bildplan:

- Sofortige Zwischenlösung Hero: `/photos/2026/hero-paar-dreh-01-portrait.webp`.
- Zweites Bild: `/photos/2026/hero-paar-studiowand-01.webp`.
- Endlösung: echtes Shooting mit Lehrperson und Paar oder Einzelperson.
- Die vier `offer-privat-*`-Crops nicht weiter als Verkaufsbilder einsetzen.

### Events

Der Hub trennt:

- regelmässige Danceflow Night,
- bestätigte Specials,
- Kalender.

Ohne bestätigtes Datum kein erfundenes Datum und kein `Event`-Markup. Dann wird nur der belegte Rhythmus beschrieben.

### Shows und Raumvermietung

Beide bleiben als eigene Suchabsichten auffindbar. Sie dürfen dasselbe Anfrage-Backend nutzen, aber nicht dieselbe SEO-Seite werden.

## 9. Anfrage-, Booking- und Payment-Fluss

Die IA ändert keine Frozen Rule und führt keinen Kunden-Login ein.

### Probestunde

```text
CTA → Probestunden-Anfrage → Erfolg mit nächstem Schritt
```

Minimale Felder:

- Vorname, Nachname
- E-Mail
- optional Telefon
- Stilinteresse
- ungefähres Level oder „weiss ich nicht“
- bevorzugter Tag
- Nachricht optional
- Datenschutz-Einwilligung

Kein „gratis“-Claim, bis die kostenlose erste Stunde bestätigt ist.

### Reguläre Kursbuchung

```text
Stilseite oder Kursplan
→ konkreten Kurs wählen
→ /buchung?course=<id>
→ Rolle/Modus/Tarif und Kontaktdaten
→ serverseitige Kapazitätsprüfung
→ bei Platz: pending_payment und Stripe Checkout
→ bei voller Rolle: Warteliste
→ Erfolg/Abbruch-Rückkehr
→ confirmed erst nach verifiziertem succeeded-Webhook
```

Pflichtzustände:

- loading
- empty
- error
- frei
- voll/Warteliste
- disabled/submitting
- Zahlungsfrist abgelaufen
- Browser-Rückkehr vor Webhook-Bestätigung

Auf `/buchung/erfolg` darf die Browser-Rückkehr nicht allein als bestätigte Buchung ausgegeben werden.

### Privatstunden

```text
/privatstunden → Anfrageformular → E-Mail/Backend → persönliche Terminabstimmung
```

Kein Checkout-Zwang, solange Termin und Umfang individuell abgestimmt werden.

### Shows und Raumvermietung

Getrennte Einstiegsseiten, gemeinsames Anfrageprinzip mit kontextabhängigen Feldern:

- Anfrageart
- Datum
- Ort
- Personenzahl
- Zeitrahmen
- gewünschte Leistung
- Kontaktangaben
- Nachricht

## 10. SEO und AEO

- Eine Suchabsicht und eine H1 pro indexierbarer Adresse.
- Bestehende kaufnahe Slugs bleiben, soweit kein belegtes IA-Problem besteht.
- Event-Details werden unter `/events/*` vereinheitlicht.
- Vollständige 301-Matrix für alle 22 Live-Adressen sowie jede intern umgezogene Route.
- Keine Redirect-Ketten und keine pauschalen Redirects auf `/`.
- Englisch unter `/en/*`, mit eigenem HTML, Canonical und wechselseitigem `hreflang`; Umfang erst nach S-01.
- Jede wichtige Frage wird direkt unter der Überschrift in ein bis zwei belegten Sätzen beantwortet.
- Preis-, Level- und Terminangaben als Tabellen oder klar beschriftete Faktenblöcke.
- FAQ-Antworten verlinken auf die passende Geldseite.
- Stilseiten verlinken sichtbar auf Level, Preise, Kursplan und FAQ.
- Kein `aggregateRating`, keine Review-Daten und keine Eventdaten ohne Primärquelle.

## 11. Bild- und Alt-Text-Gate

Die Live-Galerie ist Quelle der Wahrheit für hochwertige Partyfotografie, nicht automatisch für Privatstunden, Team oder aktuelle Kurse.

Für jedes ausgelieferte Bild muss vor Bau eine Registerzeile existieren:

```text
Datei | Route | Bildrolle | Alt DE | Alt EN | dekorativ ja/nein | Quelle | Rechte/Credit | Freigabe
```

Regeln:

- Alt beschreibt nur Sichtbares.
- Keine geratenen Namen.
- Dekorative Bilder erhalten `alt=""` oder werden CSS-Hintergrund.
- Kein „Bild von“ und keine Keyword-Kette.
- Dasselbe Bild nicht zweimal auf derselben Seite.
- Live-Galerie nach Jahr und Anlass kuratieren; aktuelle Repo-Bilder zuerst.
- Fotografen-Credits und Nutzungsrechte vor Übernahme klären.

## 12. Stärken und Risiken

**Stärken**

- Schützt die bestehenden kaufnahen URLs.
- Löst `/mehr`, Event-Präfix und Shows/Party-Vermischung ohne Vollumbau.
- Geringster Redirect- und Content-Aufwand der drei Optionen.
- Booking- und Payment-Architektur bleibt unberührt.

**Risiken**

- Tanzschuhe und Collabs behalten vorerst alte `/mehr/*`-Adressen.
- Die Startseite muss trotzdem deutlich reduziert werden; Navigation allein löst den leeren Hero nicht.
- Eine neue Probestunden-Adresse ist erst sinnvoll, wenn Formularziel und Gratis-Claim geklärt sind.

---

# Option B — Ein Weg zur ersten Stunde

## 13. Leitidee und Baum

Die Website wird als Entscheidungspfad gebaut. Neueinsteiger werden von Unsicherheit zu einer Probestunden-Anfrage oder Buchung geführt.

```text
/
├── /probestunde
├── /tanzkurse
│   ├── /tanzkurse/salsa
│   ├── /tanzkurse/bachata
│   ├── /tanzkurse/heels
│   └── /tanzkurse/level
├── /preise
├── /kursplan
├── /privatstunden
├── /danceflow-night
├── /events/*
├── /studio
│   ├── /studio/team
│   ├── /studio/fotos
│   └── /studio/raum-mieten
├── /shows-animationen
├── /faq
├── /kontakt
└── Recht, Ratgeber, Partner im Footer
```

Navigation:

```text
Kurse ▾ | Kursplan | Privatstunden | Danceflow Night | Studio ▾ | [Probestunde]
```

Jede Geldseite hat einen strukturell vorgegebenen nächsten Schritt. Team und Fotos liegen nicht mehr als Sackgassen herum, sondern im Studio-Vertrauenscluster.

**Stärke:** klarster Conversion-Pfad für Einsteiger.  
**Preis:** neue Seiten `/probestunde` und `/studio`, mehrere interne Umzüge, neue Texte und grössere Redirect-Matrix.  
**Hauptrisiko:** Danceflow Night als Top-Level kann die Kurslogik dominieren, wenn Events nicht der wichtigste zweite Geschäftszweig sind.

Booking-, SEO-, Asset- und Alt-Text-Regeln entsprechen Option A.

---

# Option C — Schule und Nights

## 14. Leitidee und Baum

Die Marke erhält zwei klar getrennte Welten: Lernen und Ausgehen.

```text
/
├── /schule
│   ├── /schule/salsa
│   ├── /schule/bachata
│   ├── /schule/heels
│   ├── /schule/level
│   ├── /schule/preise
│   ├── /schule/kursplan
│   ├── /schule/probestunde
│   └── /schule/privatstunden
├── /nights
│   ├── /nights/danceflow-night
│   ├── /nights/partys-in-basel
│   ├── /nights/floweekend
│   ├── /nights/anniversary-weekend
│   └── /nights/kalender
├── /salsaflow
│   ├── /salsaflow/team
│   ├── /salsaflow/fotos
│   └── /salsaflow/studio
├── /shows-animationen
├── /kontakt
├── /faq
└── Footer-Seiten
```

Navigation:

```text
Schule ▾ | Nights ▾ | Salsaflow ▾ | Shows | Kontakt | [Probestunde]
```

Die Startseite wird eine Weiche:

1. Marken-Hero.
2. Tür „Tanzen lernen“.
3. Tür „Ausgehen und Community“.
4. belegte Fakten.
5. Team/Studio.
6. Probestunden-Abschluss.

**Stärke:** stärkste Trennung von Kurs- und Event-Traffic; gut skalierbar, wenn beide Bereiche dauerhaft gepflegt werden.  
**Preis:** fast alle wichtigen URLs ziehen um; grösste Redirect-Matrix und grösster Content-Umbau.  
**Hauptrisiko:** Die Galerie ist überwiegend 2023 und bestätigte Eventtermine sind im strukturierten Datenbestand bewusst leer. Ohne laufende Pflege wirkt `/nights` schnell wie ein leeres zweites Geschäft.

Booking-, SEO-, Asset- und Alt-Text-Regeln entsprechen Option A; nur der sichtbare Ort des Kursplans wird `/schule/kursplan`.

---

## 15. Entscheidungsmatrix

| Kriterium | A Kernwege | B Ein Weg | C Schule/Nights |
|---|---:|---:|---:|
| URL-Stabilität | **hoch** | mittel | niedrig |
| Klarheit für kaufbereite Besucher | **hoch** | hoch | hoch |
| Hilfe für unsichere Einsteiger | hoch | **sehr hoch** | hoch |
| Trennung Kurs/Event | gut | gut | **sehr gut** |
| Redirect-Aufwand | **kleinster** | mittel | grösster |
| Neue Content-Seiten | wenige | mehrere | mehrere Hubs |
| Abhängigkeit von Eventpflege | gering | mittel | **hoch** |
| Schutz des bestehenden SEO-Stands | **stärkster** | mittel | schwächster |
| Skalierbarkeit Eventbereich | mittel | mittel | **hoch** |
| Empfehlung | **JA** | Reserve | nur bei Pflegezusage |

---

## 16. Empfehlung

**Option A gewinnt.**

Begründung:

1. Der Repo-Stand hat bereits saubere indexierbare Geldseiten, strukturierte Daten, Canonicals und ein SEO-Gate. Diese Stärke darf nicht durch unnötige URL-Umzüge entwertet werden.
2. Die klar belegten IA-Probleme sind begrenzt: `/mehr`, der Event-Präfix-Bruch, Shows im Party-Menü und zu viele gleichrangige Navigationselemente.
3. Option A löst genau diese Probleme und lässt die Frozen Rules für Buchung, Warteliste, Zahlung und Admin unangetastet.
4. Option B ist die richtige Reserve, falls die Probestunde als eigenständiges Produkt mit klarem Formular beschlossen wird.
5. Option C gewinnt nur mit einer verbindlichen Eventpflege: bestätigte Termine, aktuelle Bilder und ein dauerhafter Kalender. Dieser Nachweis liegt derzeit nicht vor.

---

## 17. Ship-Gates für die spätere Bau-Welle

### IA

- Maximal sechs Hauptpunkte plus ein CTA.
- Keine Restekiste „Mehr“ in der Hauptnavigation.
- Jede Buchungs- oder Anfrageaktion in höchstens zwei Interaktionen aus der Hauptnavigation erreichbar.
- Keine öffentliche Sackgasse: Team, Fotos und FAQ führen zu Kurs, Probestunde oder Kontakt weiter.

### Screenshot und Gestaltung

- Hero ist beim ersten Paint sichtbar und lesbar.
- Hero bleibt bei langsamem Bild, deaktiviertem JavaScript und `prefers-reduced-motion` verständlich.
- Cal Sans, Afacad, Ink `#0a0a0a`, Salsa `#ad1827` nur als Akzent.
- Buttons `rounded-full`.
- Nur `[data-reveal]` als Motion-Signatur; reduzierte Bewegung zeigt Inhalte sofort.
- Privatstunden nutzt keines der ungeeigneten `offer-privat-*`-Motive.

### SEO/AEO

- Genau eine H1 pro indexierbarer Route.
- Canonical und Redirect-Ziel stimmen mit der gewählten Option überein.
- Alle 22 Live-Adressen leiten einstufig auf ein passendes 200-Ziel.
- Keine unbelegten Claims, Reviews, Sterne, Rankings, Zertifikate oder Termine.
- Öffentliche Inhalte stehen vollständig im HTML.
- `/buchung*` und `/admin` bleiben `noindex`.

### Bilder

- Jede ausgelieferte Datei steht im Alt-/Rechte-Register.
- Alle inhaltlichen Bilder haben bildgenaue Alt-Texte auf Deutsch und Englisch.
- Dekor hat leeren Alt-Text.
- Keine geratenen Personennamen.
- Fotografenrecht und Credit der Live-Galerie sind geklärt.

### Booking und Backend

- Kein Kundenkonto.
- Keine personenbezogenen Kapazitätsdaten öffentlich.
- Kapazität und Warteliste werden serverseitig entschieden.
- `confirmed` erst nach verifiziertem Zahlungs-Webhook.
- Privatstunden, Shows und Raumvermietung bleiben Anfrageflüsse, solange keine andere Frozen Rule beschlossen wird.

---

## 18. Befehle und Ausgaben

```text
python3 Route-Zählung über /root/clients/salsaflow-dc/src/routes.tsx
→ definitions 33
→ seo-public 27
→ app-public 5
→ app-private 1
→ redirects 3
→ prerender 26

python3 Zielprüfung
→ /root/clients/salsaflow-dc/website-plan/05-ia-variants.md exists False
→ DESIGN.md exists True
→ DECISIONS.md exists True
→ ARCHITEKTUR.md exists True
→ 05-ia-entwurf-a.md exists True
→ 05-ia-entwurf-b.md exists True

python3 Asset-Zählung
→ image_assets 274
→ photos/2026 18
→ photos/premium 29
→ photos/party 71
→ photos/founders 4
```

## 19. Verbleibende Risiken

- Der Screenshot beweist das leere Vercel-Hero-Ergebnis, aber nicht allein dessen technische Ursache. Vor Ship ist eine getrennte Browserprüfung nötig.
- Ob die erste Probestunde kostenlos ist, ist ungeklärt. Bis zur Freigabe nur „Probestunde anfragen“.
- Zwei oder drei Studios sowie „rund 40 Kurse“ sind widersprüchlich beziehungsweise ungeprüft und dürfen nicht als Fakt in IA-Texte oder Markup.
- Hochzeitstanz bekommt keine eigene Route, solange das aktive Angebot nicht bestätigt ist.
- Die Nutzungsrechte und Credit-Pflichten der Live-Galerie sind offen.
- Ein echtes Privatstunden-Shooting fehlt; die vorgeschlagenen Repo-Bilder sind nur eine ehrliche Zwischenlösung.
- [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md) beschreibt einen eingefrorenen fachlichen Vertrag, während der aktuelle Repo-Stand bereits konkrete Server-/Drizzle-Dateien enthält. Dieser IA-Plan entscheidet keine Architektur-Migration und darf keine davon implizit auslösen.