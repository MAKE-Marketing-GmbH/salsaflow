# SEO- & AEO-Plan — Salsaflow Dance Company

**Rolle:** SEO-Draft
**Stand:** 2026-08-12
**Grundlage:** [03-seo-audit.md](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md)
**Verbindlich:** [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md) · [DECISIONS.md](/root/clients/salsaflow-dc/DECISIONS.md) · [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md)
**Modus:** PLANNING ONLY — kein Production-Code in diesem Auftrag.

---

## 0. Datenlage — bitte zuerst lesen

In diesem Lauf war **keine SEO-Daten-Schnittstelle verfügbar** (geprüft: kein DataForSEO,
Semrush, Ahrefs, keine Search-Console-Anbindung). Deshalb gilt für dieses Dokument:

- Es stehen **keine Suchvolumen-Zahlen** darin. Erfundene Zahlen wären schlimmer als keine.
- Jede Priorität ist mit `SCHÄTZUNG` markiert und beruht auf: Angebot der Schule (belegt),
  Ortsbezug, Kaufabsicht des Suchenden und Wettbewerbslage aus `01-firma-dossier.md`.
- Sobald Search Console läuft (Massnahme P0-4), wird diese Reihenfolge mit echten Zahlen
  überschrieben. Das ist ausdrücklich vorgesehen, kein Nachbessern.

**Was hier niemals hineingehört** (Auftragsregel): erfundene Bewertungen, Sternezahlen,
„Nr. 1 in Basel", Zertifikate, Kundenstimmen, Auszeichnungen ohne Beleg. Wo Beweis fehlt,
steht `PLACEHOLDER`.

---

## 1. Strategie in fünf Sätzen

1. Salsaflow gewinnt **nicht** über „grösste Schule", sondern über **Ort** (Bahnhof Basel SBB), **Stil** (Salsa On2 und Bachata Sensual), **Einstiegs-Angst nehmen** (ohne Partner, Probestunde, Level-Hilfe) und **Community** (Danceflow Night).
2. Der Repo-Stand hat die technische Grundlage bereits fast fertig; der Plan investiert deshalb nicht in Neubau, sondern in **vier Lücken**: Englisch, Messung, lokale Signale, Ladezeit.
3. Jede Seite bekommt **eine** Suchabsicht, **eine** Hauptüberschrift und **eine** Hauptaktion — sonst konkurrieren die eigenen Seiten miteinander.
4. Für KI-Suche wird nicht extra optimiert, sondern **die Antwort direkt unter die Frage geschrieben** und maschinenlesbar markiert; das ist derselbe Text, der auch Menschen hilft.
5. Der Umzugstag ist das grösste Risiko: ohne vollständige Weiterleitungen ist alles andere egal.

---

## 2. Suchbegriff → Adresse (Keyword-Mapping)

**Regel:** Ein Thema, eine Adresse. Zwei Seiten dürfen nie denselben Hauptbegriff anpeilen —
sonst schlagen sie sich gegenseitig aus dem Rennen (das passiert live bereits bei
`/kontakt/` gegen `/kontakt/kontakt/`).

Prioritäten: `P0` = trägt Umsatz · `P1` = wichtig · `P2` = ergänzend. Alle `SCHÄTZUNG`.

### 2.1 Geld-Seiten

| Adresse | Hauptbegriff | Nebenbegriffe | Absicht | Prio |
|---|---|---|---|---|
| `/` | tanzschule basel | salsa tanzschule basel, latin dance basel | Marke + Einstieg | P0 |
| `/tanzkurse` | tanzkurse basel | tanzkurs basel, tanzen lernen basel | Übersicht/Vergleich | P0 |
| `/tanzkurse/salsa` | salsa kurs basel | salsa tanzen lernen basel, salsa anfängerkurs basel, salsa on2 basel | kaufbereit | P0 |
| `/tanzkurse/bachata` | bachata kurs basel | bachata tanzen basel, bachata sensual basel | kaufbereit | P0 |
| `/tanzkurse/heels` | heels kurs basel | heels dance basel, high heels tanzen basel | kaufbereit | P1 |
| `/privatstunden` | privatstunden tanzen basel | tanzlehrer privat basel, hochzeitstanz basel* | hohe Kaufabsicht | P0 |
| `/preise` | tanzkurs preise basel | was kostet tanzkurs basel | Vergleich vor Kauf | P0 |
| `/kursplan` | kursplan tanzschule basel | salsa kurse basel termine | konkret, terminnah | P1 |
| `/kursaufbau` | tanzkurs level anfänger | welches level tanzkurs, salsa level erklärung | Orientierung/Zweifel | P1 |

\* `hochzeitstanz basel` ist ein eigener, kaufstarker Markt. **Entscheidung nötig:** eigene Seite
oder Abschnitt auf `/privatstunden`? Empfehlung `SCHÄTZUNG`: erst als starker Abschnitt mit eigener
Überschrift und FAQ; eigene Seite nur, wenn die Schule das aktiv anbietet. → offene Frage S-05.

### 2.2 Community- und Vertrauens-Seiten

| Adresse | Hauptbegriff | Absicht | Prio |
|---|---|---|---|
| `/events/danceflow-night` | salsa party basel | Abend finden | P0 |
| `/mehr/partys` | salsa bachata partys basel | bestätigte Szene-/Terminübersicht | P1 |
| `/events` | tanz events basel | Übersicht | P1 |
| `/events/floweekend` | salsa workshop weekend basel | Event-Marke | P2 |
| `/events/anniversary-weekend` | (Marke) | Event-Marke | P2 |
| `/events/kalender` | salsa termine basel | Terminliste | P2 |
| `/team` | tanzlehrer basel | Vertrauen | P1 |
| `/fotos` | (Marke, Bildersuche) | Atmosphäre prüfen | P2 |
| `/kontakt` | tanzschule basel kontakt | Kontakt | P1 |
| `/kontakt/standort-raumvermietung` | tanzraum mieten basel | eigener Umsatzstrom | P1 |
| `/faq` | (Fragen, siehe AEO) | Zweifel klären | P0 |
| `/shows-animationen` | tanzshow buchen basel | Firmen/Events | P1 |
| `/mehr/tanzschuhe` | tanzschuhe basel | tanzschuhe salsa anfänger; Ratgeber-Einstieg | P2 |
| `/mehr/collabs` | (Marke) | Partner | P2 |
| `/impressum` | kein Zielkeyword | Recht/Anbieterangaben | P0 Recht |
| `/datenschutz` | kein Zielkeyword | Datenschutz/Transparenz | P0 Recht |

Alle Begriffe und Prioritäten in 2.1/2.2 sind **SCHÄTZUNG/UNKNOWN**, solange kein
Keyword-, GSC- oder SERP-Export mit Datum vorliegt. Sie steuern die Seitenjobs,
nicht behauptete Nachfrage oder Ranking-Chancen.

### 2.3 Nicht anpeilen

- **„Nr. 1", „beste Tanzschule Basel", „einzige Schule…"** — nicht belegbar, laut
  `01-firma-dossier.md` (C01) sogar wettbewerbsrechtlich riskant, da Wettbewerber ebenfalls On2 anbieten.
- **„Kizomba", „Salsa Cubana", „Zouk"** — laut Live-Angebot nicht Schwerpunkt. Keine Seiten für
  Kurse bauen, die es nicht gibt.
- **Städte ausserhalb der Region** — kein Standort, keine Seite. Ausnahme prüfen: Lörrach/Weil am
  Rhein sind Pendlergebiet, aber nur als Nebensatz auf `/kontakt/standort-raumvermietung`, **keine**
  eigenen Stadt-Seiten (das wäre Doorway-Spam und wird abgestraft).

---

## 3. Technisches SEO

### 3.1 P0 — Weiterleitungen beim Umzug

Das grösste Einzelrisiko des Projekts. Die vollständige Zuordnungstabelle steht in
[03-seo-audit.md, Abschnitt 6](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md).

Regeln:
- Jede Weiterleitung ist **dauerhaft (301)**, nicht temporär.
- **Beide Formen abdecken**: Live endet auf Schrägstrich, neu nicht (`/kurse/` **und** `/kurse`).
- **Umlaut-Adressen** in kodierter Form abdecken: `/%C3%BCber-uns/team/`.
- **Nur eine Stufe**: nie Weiterleitung auf eine Weiterleitung.
- **Nie auf die Startseite abladen.** Wer `/kurse/preise/` sucht, gehört auf `/preise`, nicht auf `/`.
- Die Tippfehler-Adressen (`philisophie`, `anniverysary`) bekommen eine Weiterleitung, werden
  aber **nicht** als neue Adresse übernommen.

**Abnahme:** Jede der 22 Live-Adressen aus der Tabelle antwortet mit 301 auf genau das
vorgesehene Ziel, das Ziel antwortet mit 200. Prüfung als Skript, Ausgabe wird protokolliert.

### 3.2 P0 — Englische Sprachfassung bekommt Adressen

Ausgangslage (belegt, siehe Audit R-01): Übersetzungen sind vollständig vorhanden, aber die
Sprache lebt nur im Browser-Speicher (`src/lib/i18n.tsx:11`), es gibt keine englische Adresse,
und `scripts/prerender.mjs:34` schreibt fest `<html lang="de-CH">`.

**Empfehlung (`SCHÄTZUNG`): Unterordner `/en/…`.** Begründung: gleiche Domain behält die
aufgebaute Stärke, ist bei Vercel ohne neue Infrastruktur zu bauen, und passt zum bestehenden
Vorrender-Verfahren. Alternative Unterdomain `en.` bringt hier nur Zusatzaufwand.

Zu planen:
- Für jede der 26 öffentlichen Seiten eine englische Entsprechung: `/en/dance-classes`, `/en/prices`, `/en/private-lessons`, `/en/faq` und so weiter. Englische Adressen sollen **englisch** sein, nicht `/en/tanzkurse`.
- `hreflang`-Verweise auf **jeder** Seite, wechselseitig, plus `x-default` auf die deutsche Fassung.
- Vorrendern in beiden Sprachen; `<html lang>` und `og:locale` müssen der jeweiligen Sprache folgen.
- Beide Sprachfassungen in die sitemap.xml.
- Der Sprachumschalter muss die **Adresse wechseln**, nicht nur den Text.

**Abnahme:** `/en/prices` antwortet mit 200, enthält englischen Text im Quelltext, hat
`<html lang="en">`, ein eigenes Canonical und einen `hreflang`-Verweis auf `/preise` — und
umgekehrt. `verify-seo.mjs` wird um diese Prüfung erweitert.

**Offen (S-01):** Soll Englisch überhaupt vollständig ausgebaut werden, oder reicht eine
englische Startseite plus `/en/faq`? Ganz oder gar nicht — eine halbe Sprachfassung mit
Sackgassen ist schlechter als eine bewusst kleine.

### 3.3 P1 — Indexierung und Steuerdateien

- **Nicht indexieren:** `/admin`, `/buchung`, `/buchung/erfolg`, `/buchung/abbruch`, `/404`. Im Repo bereits korrekt gelöst (`noindex, nofollow` belegt in `dist/`). Zusätzlich über Kopfzeile absichern, damit auch Zwischenschritte im Buchungsvorgang nie in den Index geraten.
- **sitemap.xml:** `lastmod` je Seite ergänzen (aktuell 0 Angaben). Bei `/kursplan` und den Event-Seiten am Ausgabedatum orientieren.
- **robots.txt:** aktueller Stand ist gut (erlaubt alles, verweist auf die Sitemap). Beim Umzug den Jimdo-Stand mit `Crawl-Delay: 5` **nicht** übernehmen.
- **Ein Adressmuster:** ohne Schrägstrich am Ende, wie im Repo. Die jeweils andere Form muss weiterleiten, nicht doppelt existieren.
- **Kein Meta-Pixel übernehmen** (Audit L-12), solange kein Facebook-Kanal betrieben wird und keine Einwilligung eingeholt ist.

### 3.4 P1 — Ladezeit (Core Web Vitals)

Messwerte aus dem Audit: JavaScript-Paket 1,1 MB, Vorladung zeigt auf Logos statt aufs Startbild,
53 von 249 Fotos noch nicht in modernem Format, Fotos gesamt 33 MB.

| Wert | Ziel | Massnahme |
|---|---|---|
| Grösstes Element sichtbar (LCP) | unter 2,5 s | Startbild vorladen statt Logos; Logo-Vorladung entfernen; Startbild mit `fetchpriority="high"`, alle weiteren mit `loading="lazy"` (bereits 18-mal korrekt gesetzt) |
| Reaktionszeit (INP) | unter 200 ms | Buchungs- und Verwaltungs-JavaScript nur laden, wo es gebraucht wird — nicht auf `/impressum` |
| Layout-Sprünge (CLS) | unter 0,1 | Breite und Höhe an jedem Bild; feste Höhe für Klapp-Elemente in der FAQ |
| Seitengewicht | so klein wie möglich | restliche 53 JPG/PNG in modernes Format; passende Grössen ausliefern |

**Wichtig:** Weil die Seiten vorgerendert sind, sieht der Besucher den Text sofort — die
Ladezeit-Massnahmen verbessern Bewertung und Bedienbarkeit, nicht die Sichtbarkeit des Inhalts.
Deshalb P1 und nicht P0.

**Abnahme:** Feldmessung mit PageSpeed Insights auf `/`, `/tanzkurse/salsa`, `/preise` — Werte
protokollieren, vorher und nachher.

### 3.5 P2 — Bilder

- Jedes inhaltlich relevante Bild braucht einen Alt-Text (Repo bereits ohne fehlende Attribute; die Textqualität prüft das Alt-Text-Inventar `03-alt-text-inventory.md`).
- Dateinamen sprechend halten (`salsa-kurs-basel-paar.webp` statt `IMG_2831.jpg`).
- Ein eigenes Bildverzeichnis nur, wenn `/fotos` wirklich Bildersuche bringen soll — sonst Aufwand ohne Ertrag.

---

## 4. Seitenregeln (On-Page)

### 4.1 Titel

Muster: `Hauptbegriff mit Ort | Salsaflow` — 50 bis 60 Zeichen.

- Der wichtigste Begriff steht **vorn**, die Marke hinten.
- Kein Titel doppelt.
- Der Live-Fehler „Tanzkurzse" (Audit L-07) darf nicht mitwandern.
- Keine Superlative, keine Symbole wie das grüne Häkchen der Live-Events-Seite.
- Die bestehenden Titel im Repo (`src/lib/seo-config.ts`) sind gut gebaut und bleiben — **ausser**
  dort, wo sie ungeprüfte Zahlen enthalten (siehe 4.4).

### 4.2 Beschreibungen

150 bis 160 Zeichen, geschrieben als Einladung, nicht als Zusammenfassung.

Aufbau: **was es ist → für wen → was den Einstieg leicht macht → Ort**.
Immer „Du". Kein „Sie" (Live-Bruch L-09). Keine aus dem Fliesstext kopierten Sätze (Live-Fehler L-08).

### 4.3 Überschriften

- **Genau eine H1 pro Seite**, sie beantwortet den Hauptbegriff in menschlicher Sprache.
  Im Repo bereits durchgesetzt und maschinell abgesichert — dieses Gate bleibt.
- H2 gliedert nach den Fragen der Besucher, nicht nach internen Kategorien.
- Keine Überschrift ohne Text darunter.

### 4.4 Ehrlichkeit im Text — verbindlich

Aus dem Audit (R-09, R-10) und `01-firma-dossier.md`:

| Aussage | Status | Regel |
|---|---|---|
| „drei Studios" | **widersprüchlich** (Live nennt zwei) | erst klären, dann schreiben → S-03 |
| „rund 40 Kurse pro Woche" | **ungeprüft** | erst belegen, dann schreiben → S-03 |
| „Erste Schnupperstunde gratis" | **ungeprüft** | Preisversprechen — nur mit Freigabe → S-02 |
| „über 20 Jahre Tanzerfahrung" | Selbstaussage | nur als Aussage über das Team, nie als Schulalter |
| Meisterschaften, Trophäen | unbelegt | ohne Jahr und Verband **nicht** verwenden |
| Bewertungen, Sterne | keine Quelle | **verboten**, auch nicht in strukturierten Daten |

Diese Punkte stehen in Titeln, Beschreibungen **und** strukturierten Daten. Beschreibungen sind
das, was in Google steht — eine falsche Zahl dort ist teurer als im Fliesstext.

---

## 5. Interne Verlinkung

**Problem (Audit R-05):** Alle 26 Seiten haben exakt 27 eingehende Links — das kommt allein aus
Navigation und Fussbereich. Im Fliesstext hat `/tanzkurse/salsa` nur **2** Links, `/privatstunden`
nur **3**. `/preise` zeigt mit 10 Links, wie es gehen soll.

**Regeln:**
1. Jede Geld-Seite verlinkt im Fliesstext mindestens auf: `/preise`, `/kursplan`, `/faq` und eine passende Nachbarseite.
2. Der Linktext beschreibt das Ziel („Alle Preise ansehen"), nie „hier klicken".
3. Der Weg vom Zweifel zur Buchung wird bewusst gelegt: `/kursaufbau` → `/tanzkurse/salsa` → `/preise` → `/kursplan` → Buchung.
4. Von `/faq` zurück in die passenden Seiten — jede Antwort, die eine Seite betrifft, verlinkt sie.
5. `/fotos` und `/team` verlinken auf Kurse, nicht nur auf sich selbst.
6. Keine Seite mehr als drei Klicks von der Startseite entfernt (aktuell erfüllt).

**Sollzustand je Seite:**

| Seite | Links im Inhalt jetzt | Ziel |
|---|---:|---:|
| `/tanzkurse/salsa` | 2 | min. 5 |
| `/tanzkurse/bachata` | ungeprüft | min. 5 |
| `/tanzkurse/heels` | ungeprüft | min. 5 |
| `/privatstunden` | 3 | min. 5 |
| `/preise` | 10 | halten |
| `/` | 13 | halten |

---

## 6. Lokales SEO — der wichtigste Hebel ausserhalb der Website

Für eine Tanzschule am Bahnhof Basel SBB ist der Google-Unternehmenseintrag oft wichtiger als
jede Unterseite. Details und Belege stehen in
[01b-online-praesenz.md](/root/clients/salsaflow-dc/website-plan/01b-online-praesenz.md).

| # | Massnahme | Prio |
|---|---|---|
| 1 | Google-Unternehmensprofil beanspruchen und Inhaberschaft klären | **P0** |
| 2 | Echten Eintrags-Link statt allgemeiner Google-Suche im Fussbereich (`SiteFooter.tsx:23`) | **P0** |
| 3 | Profil füllen: Kategorie „Tanzschule", Adresse zeichengleich, Telefon, Website, Fotos aus `/fotos-1/`, Öffnungs- bzw. Kurszeiten | P1 |
| 4 | Diesen Eintrag in `sameAs` ergänzen (aktuell nur Instagram, `seo-schema.ts:155`) | P1 |
| 5 | local.ch und search.ch prüfen und angleichen — Name, Adresse, Telefon **zeichengleich** | P1 |
| 6 | Bing Places und Apple Business Connect anlegen | P2 |
| 7 | Ehrliches Bewerten ermöglichen: Karte im Studio mit QR auf den echten Bewertungslink — **keine** Anreize, **keine** gekauften Bewertungen | P1 |

**Verboten:** `aggregateRating` in strukturierte Daten schreiben, solange keine belastbare Quelle
existiert. Der Repo-Stand macht das aktuell **richtig** (kein Rating im Markup) — das bleibt so.

---

## 7. Vertrauen und Fachlichkeit (E-E-A-T)

Google und KI-Systeme bewerten, ob hinter einer Seite echte Menschen mit echter Erfahrung stehen.
Salsaflow hat davon viel — es steht nur nicht maschinenlesbar da.

| Signal | Ist | Zu tun |
|---|---|---|
| **Erfahrung** | Team unterrichtet nachweislich; Live nennt Namen und Rollen | Auf `/team` je Person: Rolle, Stil, seit wann dabei — nur belegte Angaben |
| **Fachlichkeit** | On2-Schwerpunkt, klare Level-Struktur | `/kursaufbau` als echte Erklärseite ausbauen — der beste Vertrauensbeweis, weil er Zweifel ausräumt |
| **Autorität** | Schule seit 2018, GmbH seit 2024 | Beides sauber trennen (Live vermischt es) |
| **Vertrauen** | Adresse, zwei Telefonnummern, E-Mail, AGB live vorhanden | Impressum vollständig, Adresse überall zeichengleich, echter Maps-Link |
| **Personen sichtbar** | Team-Seite vorhanden | Echte Fotos statt Symbolbilder; Personen nie künstlich erzeugen (DESIGN.md) |
| **Bewertungen** | keine geprüfte Quelle | `PLACEHOLDER` — Struktur planen, Inhalt erst nach echtem Beleg |

**AGB:** Live existiert `/infos/agb/` mit echten Regeln (Zahlung, Abmeldefristen, Haftung).
Im Repo gibt es dafür **keine Adresse**. Für eine Schule, die Geld für Kurse nimmt, ist eine
erreichbare AGB-Seite ein Vertrauens- **und** Rechtsthema. → offene Frage S-04.

---

## 8. Strukturierte Daten (Schema)

### 8.1 Bestand — bereits gut

Belegt aus `dist/`: `LocalBusiness`, `WebSite`, `WebPage` sitewide, dazu `BreadcrumbList`,
`FAQPage` und `Course` auf den passenden Seiten. Das ist mehr, als die Live-Site an irgendeiner
Stelle hat (dort: 0).

Zwei Dinge sind bewusst richtig gelöst und bleiben so:
- **Keine erfundenen Termine:** `src/lib/seo-schema.ts:107` hält die Event-Liste leer, mit Begründung im Code.
- **Kein `aggregateRating`** ohne Quelle.

### 8.2 Ergänzen

| Typ | Wo | Zweck | Prio |
|---|---|---|---|
| `DanceSchool` statt nur `LocalBusiness` | sitewide | präziserer Typ für Tanzschule | P1 |
| `openingHoursSpecification` | Unternehmens-Angaben | häufigste lokale Frage; **erst wenn Zeiten bestätigt** → S-06 | P1 |
| `geo` (Koordinaten) | Unternehmens-Angaben | Kartenbezug | P2 |
| `Person` je Lehrperson | `/team` | Fachlichkeit sichtbar machen | P2 |
| `Offer` mit Preis in CHF | `/preise` | Preis maschinenlesbar; **nur bestätigte Preise** | P1 |
| `Event` | Event-Seiten | erst wenn echte Termine vorliegen — Liste bleibt bis dahin leer | P1 |
| `ImageObject` | `/fotos` | Bildersuche | P2 |
| `sameAs` + echter Maps-Link | Unternehmens-Angaben | lokales Vertrauen | P0 |
| `VideoObject` | wo Instagram-Videos eingebettet sind | Video-Treffer | P2 |

### 8.3 Regeln

- Markup beschreibt **nur**, was auf der Seite sichtbar steht. Kein verstecktes Markup.
- Preise im Markup und auf der Seite müssen übereinstimmen — die Live-Widersprüche bei Paarpreisen (`01-firma-dossier.md`, 5.3) vorher auflösen.
- Nach jeder Änderung mit dem Rich-Results-Test prüfen, Ergebnis protokollieren.

---

## 9. AEO / KI-Suche — Pflichtteil

Immer mehr Menschen fragen ChatGPT, Google AI Overviews oder Perplexity statt eine Trefferliste zu
lesen. Diese Systeme zitieren Seiten, die **eine klare Frage klar beantworten** — mit Zahlen,
Namen und Orten, sofort im Text.

### 9.1 Warum Salsaflow hier gut dasteht

- Der Text steht **im HTML**, nicht erst nach JavaScript (belegt: 264–1302 Wörter je Seite in `dist/`). KI-Systeme rendern oft kein JavaScript — die Live-Konkurrenz mit reinen Baukastenseiten ist hier angreifbar.
- Es gibt bereits **21 echte Fragen mit `FAQPage`-Markup**.
- Die Fakten sind konkret: Adresse, Preise in CHF, Kursdauer 8×60 Minuten, Rhythmus der Danceflow Night.

### 9.2 Die Antwort-Regel

Jede wichtige Frage wird **direkt unter der Überschrift in ein bis zwei Sätzen beantwortet** —
mit der Zahl, dem Ort, dem Namen. Erklärung danach.

Gut: „Ein Kurs dauert 8 Wochen mit je 60 Minuten pro Woche und kostet CHF 190, für Studierende
CHF 160. Die Kurse finden an der Elisabethenanlage 7 direkt beim Bahnhof Basel SBB statt."

Schlecht: „Unsere Kurse sind so aufgebaut, dass für jeden etwas dabei ist."

Der erste Satz ist zitierfähig, weil er allein stehen kann. Der zweite sagt nichts.

### 9.3 Fragen, die beantwortet und markiert werden müssen

Bestand (belegt aus `dist/faq.html`, 21 Fragen) — inhaltlich gut, deckt Einstieg, Level, Preis,
Schuhe, Events und Kontakt ab. **Behalten.**

Zu ergänzen (`SCHÄTZUNG`, aus Angebot und Wettbewerbslage abgeleitet):

| Frage | Wo | Warum |
|---|---|---|
| Was ist der Unterschied zwischen Salsa On1 und On2? | `/tanzkurse/salsa` | echte Fachfrage, Alleinstellung, wenig gut beantwortet |
| Was ist Bachata Sensual — und wie unterscheidet sie sich von normaler Bachata? | `/tanzkurse/bachata` | häufige Einsteigerfrage |
| Wie lange dauert es, bis ich auf einer Party mittanzen kann? | `/kursaufbau` | die eigentliche Frage hinter „lohnt sich das?" |
| Ich bin über 40 / komplett unsportlich — passt das? | `/faq` | echte Hemmschwelle |
| Kann ich als Frau die Führung lernen (und umgekehrt)? | `/faq` | zeitgemäss, differenzierend |
| Was kostet eine Privatstunde und wie läuft sie ab? | `/privatstunden` | direkte Kaufabsicht |
| Bietet ihr Hochzeitstanz-Unterricht an? | `/privatstunden` | eigener Markt |
| Wo kann ich in Basel Salsa tanzen gehen? | `/mehr/partys` | reine Antwortfrage, sehr KI-tauglich |
| Wie komme ich mit ÖV zum Studio? | `/kontakt/standort-raumvermietung` | Tram- und Buslinien sind belegt |
| Kann ich einen Tanzraum mieten? | `/kontakt/standort-raumvermietung` | eigener Umsatzstrom |

**Regel:** Nur Fragen aufnehmen, die wirklich beantwortet werden können. Eine Frage mit
Ausweichantwort schadet mehr als keine Frage.

### 9.4 Weitere AEO-Massnahmen

- **Zusammenfassung am Anfang** jeder längeren Seite: drei bis vier Zeilen, die die Seite
  beantworten. Hilft Menschen beim Überfliegen und Maschinen beim Zitieren.
- **Fakten in Tabellen** (Preise, Level, Zeiten) — leichter maschinell zu lesen als Fliesstext.
- **Eine Wahrheit pro Zahl.** Der Preiswiderspruch zwischen FAQ und Preisseite
  (`01-firma-dossier.md`, 5.3) muss **vor** dem Start aufgelöst werden: widersprüchliche
  Angaben führen dazu, dass KI-Systeme die Seite gar nicht zitieren.
- **Datum sichtbar machen** bei allem, was altert (Kursstart, Event-Termine).
- **KI-Crawler nicht aussperren.** Die robots.txt des Repo-Stands erlaubt alles — das ist die
  richtige Entscheidung. Wer GPTBot und PerplexityBot blockt, verschwindet aus KI-Antworten.
  Falls die Schule das ändern will, ist es eine bewusste Entscheidung → S-07.
- **Nachprüfen statt hoffen:** monatlich in ChatGPT und Perplexity fragen „Wo kann ich in Basel
  Salsa lernen?" und protokollieren, ob und wie Salsaflow auftaucht.

---

## 10. Messung

**Ist: nichts.** Weder Analytics noch Search Console (Audit R-02). Ohne Messung ist jede
Aussage über SEO-Erfolg eine Behauptung.

| Werkzeug | Zweck | Prio |
|---|---|---|
| **Google Search Console** | Suchbegriffe, Positionen, Indexierungsfehler. Direkt nach dem Start eintragen und Sitemap einreichen | **P0** |
| **Bing Webmaster Tools** | speist auch KI-Systeme; kleiner Aufwand | P2 |
| **Datenschutzfreundliche Statistik** (Plausible oder Umami) | Besucher, Wege, Absprünge — ohne Einwilligungsbanner | P1 |
| **Zielereignisse** | Schnupperstunde angefragt, Buchung gestartet, Buchung bestätigt, Kontaktformular, WhatsApp-Klick, Telefon-Klick | P1 |

**Vorschlag zur Wahl (`SCHÄTZUNG`):** Plausible oder Umami statt Google Analytics. Für eine
Schweizer Schule mit wenigen Seiten reicht das, es braucht kein Einwilligungsbanner (das die
Zahlen ohnehin verfälscht), und es passt zum sauberen Stand ohne Meta-Pixel. → Entscheidung S-08.

**Berichtsrhythmus:** monatlich eine Seite — Suchbegriffe, die Klicks bringen; Seiten ohne Klicks;
Anfragen; Positionen der Geld-Seiten; KI-Sichtbarkeitsprobe aus 9.4.

---

## 11. Reihenfolge der Umsetzung

### P0 — vor dem Start, nicht verhandelbar

| # | Massnahme | Fertig, wenn |
|---|---|---|
| P0-1 | Weiterleitungen für alle 22 Live-Adressen (mit und ohne Schrägstrich, Umlaute kodiert) | Prüfskript zeigt 301 auf das richtige Ziel, Ziel antwortet 200 |
| P0-2 | Preis-, Studio- und Kurszahlen-Widersprüche auflösen | Eine Preistabelle, eine Studio-Zahl, überall identisch |
| P0-3 | Ungeprüfte Aussagen entfernen oder freigeben lassen (Gratis-Stunde, drei Studios, 40 Kurse) | Keine unbelegte Aussage in Titel, Beschreibung oder Markup |
| P0-4 | Search Console einrichten, Sitemap einreichen | Property bestätigt, Sitemap gelesen |
| P0-5 | Google-Unternehmensprofil beanspruchen, echten Link setzen | Fussbereich zeigt auf den echten Eintrag, nicht auf eine Suche |
| P0-6 | Prüfen, dass `/admin` und `/buchung` nicht indexierbar sind | `verify-seo.mjs` bestätigt es (läuft bereits) |
| P0-7 | Meta-Pixel der Jimdo-Seite nicht übernehmen | Kein Tracking-Skript ohne Einwilligung im Quelltext |

### P1 — erste vier Wochen nach dem Start

| # | Massnahme |
|---|---|
| P1-1 | Englische Fassung mit eigenen Adressen und `hreflang` (Abschnitt 3.2) |
| P1-2 | Statistik-Werkzeug plus Zielereignisse |
| P1-3 | Fliesstext-Verlinkung auf den Geld-Seiten (Abschnitt 5) |
| P1-4 | Ladezeit: Startbild vorladen, JavaScript aufteilen (Abschnitt 3.4) |
| P1-5 | Neue AEO-Fragen schreiben und markieren (Abschnitt 9.3) |
| P1-6 | Schema ergänzen: `DanceSchool`, Öffnungszeiten, `Offer` mit CHF |
| P1-7 | local.ch und search.ch angleichen |
| P1-8 | `/kursaufbau` zur echten Erklärseite ausbauen |
| P1-9 | AGB-Seite klären und anlegen (S-04) |

### P2 — laufend

| # | Massnahme |
|---|---|
| P2-1 | `lastmod` in der Sitemap pflegen |
| P2-2 | Eigene Vorschaubilder je Seitentyp |
| P2-3 | `Person`-Angaben auf `/team` |
| P2-4 | Bing Places, Apple Business Connect |
| P2-5 | Restliche 53 Bilder in modernes Format |
| P2-6 | Monatliche KI-Sichtbarkeitsprobe |
| P2-7 | Hochzeitstanz je nach Entscheidung ausbauen (S-05) |

---

## 12. Verbote

Diese Liste ist bindend. Ein Verstoss ist ein Fehler, keine Geschmacksfrage.

**Inhalt und Beweis**
1. Keine erfundenen Bewertungen, Sterne, Rezensionen oder Kundenstimmen — auch nicht als Beispiel.
2. Kein `aggregateRating` oder `Review` in strukturierten Daten ohne echte, prüfbare Quelle.
3. Kein „Nr. 1", „beste", „einzige" ohne Beleg — laut `01-firma-dossier.md` (C01) zusätzlich rechtlich riskant.
4. Keine Zertifikate, Auszeichnungen oder Meisterschaften ohne Jahr, Verband und Nachweis.
5. Keine Zahlen, die nicht belegt sind (Studios, Kurse pro Woche, Jahre, Teilnehmerzahlen).
6. Kein Preisversprechen ohne Freigabe — das schliesst „erste Stunde gratis" ein.
7. Keine `Event`-Markierung mit erfundenem Datum. Der bestehende leere Stand ist richtig.

**Technik**
8. Kein Markup für Inhalte, die auf der Seite nicht sichtbar sind.
9. Keine zwei Seiten für denselben Hauptbegriff.
10. Keine Weiterleitung auf die Startseite, wenn es eine passende Seite gibt.
11. Keine Weiterleitungsketten.
12. Kein Aussperren von KI-Crawlern ohne bewusste Entscheidung.
13. Keine Stadt-Seiten für Orte ohne Standort.
14. Kein Text für Suchmaschinen, der für Menschen keinen Sinn ergibt.
15. Keine Übernahme der Tippfehler-Adressen (`philisophie`, `anniverysary`).
16. Kein Tracking ohne Einwilligung; kein Meta-Pixel ohne betriebenen Kanal.

**Gestaltung (aus DESIGN.md, gilt auch für SEO-Texte)**
17. Keine neue Farbe, keine gesperrte Schrift (Inter, Poppins und die übrige Liste).
18. Keine „Sie"-Ansprache — die Marke duzt.
19. Menschen nie künstlich erzeugen; echte Fotos aus dem vorhandenen Material.

---

## 13. Offene Entscheidungen

| ID | Frage | Blockiert | Wer |
|---|---|---|---|
| S-01 | Englisch vollständig unter `/en/…`, oder nur Startseite plus FAQ? | P1-1 | Kunde |
| S-02 | Ist die erste Schnupperstunde wirklich **kostenlos**? | P0-3 | Kunde |
| S-03 | Zwei oder drei Studios? Wirklich rund 40 Kurse pro Woche? | P0-2, P0-3 | Kunde |
| S-04 | Eigene AGB-Seite im Relaunch — oder Teil des Impressums? | P1-9 | Kunde |
| S-05 | Wird Hochzeitstanz aktiv angeboten? Eigene Seite? | P2-7 | Kunde |
| S-06 | Feste Öffnungszeiten für das Unternehmensprofil? | P1-6 | Kunde |
| S-07 | KI-Crawler erlaubt lassen? (Empfehlung: ja) | — | Kunde |
| S-08 | Plausible oder Umami — und wer zahlt? | P1-2 | Raphael |
| S-09 | Wer hat den Google-Unternehmens-Zugang? | P0-5 | Kunde |
| S-10 | Wie lauten die Paarpreise wirklich? (Live widersprüchlich) | P0-2 | Kunde |

---

## 14. Wie Erfolg gemessen wird

**Am Starttag**
- Alle 22 alten Adressen leiten korrekt weiter (Skript-Protokoll).
- `verify-seo.mjs` läuft grün.
- Search Console eingerichtet, Sitemap gelesen.
- Keine unbelegte Aussage im Quelltext.

**Nach 30 Tagen**
- Für alle 26 eingereichten Seiten ist der GSC-Status dokumentiert: indexiert, entdeckt,
  gecrawlt/nicht indexiert oder Fehler. Google schuldet keine vollständige Indexierung.
- Abdeckungsfehler sind je URL priorisiert; freiwillig nicht indexierte technische Routen
  werden nicht als Fehler gezählt.
- Markenposition und erste Suchanfragen werden als Baseline gemessen, nicht als Position-1-Versprechen.
- Sobald belastbare Daten vorliegen, ersetzen sie die `SCHÄTZUNG/UNKNOWN`-Felder in Abschnitt 2.

**Nach 90 Tagen**
- Die P0-Geldseiten erscheinen für ihre Hauptbegriffe in den Suchergebnissen (Position `SCHÄTZUNG`, erst nach echten Daten festlegbar).
- Anfragen über Formular, WhatsApp und Telefon sind messbar.
- Die KI-Probe zeigt, ob Salsaflow bei „Salsa lernen Basel" genannt wird.

---

*Grundlage: [03-seo-audit.md](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md) (Messungen 2026-08-12), [01-firma-dossier.md](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md), [01b-online-praesenz.md](/root/clients/salsaflow-dc/website-plan/01b-online-praesenz.md), [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md). Keine SEO-Daten-Schnittstelle verfügbar — alle Prioritäten als `SCHÄTZUNG` gekennzeichnet. Kein Production-Code geändert.*
