# 13 — Mehr, FAQ und Collabs `/mehr` · `/faq` · `/mehr/collabs`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P1 (FAQ ist faktisch P0 — sie beantwortet die Fragen vor der Buchung)
**Nav-Label:** MEHR (Kunden-Baseline)

---

# A — `/mehr`

## A.1 Was diese Seite ist

Der Kunde will einen Menüpunkt „MEHR" mit FAQ und Collabs ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:41-43)). Das bleibt so.

Ehrlich benannt: Diese Seite ist eine Verteilerseite mit zwei Zielen. Sie soll nicht künstlich zu einem Themenhaus aufgeblasen werden ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:76)).

## A.2 Meta

```text
Title:       Mehr — Häufige Fragen und Collabs | Salsaflow Basel
Description: Antworten auf die häufigsten Fragen zu Kursen, Preisen und
             Anmeldung — und unsere Zusammenarbeit mit 2332 Dancewear.
```

## A.3 Inhalt

```text
H1:    Mehr
Lead:  Alles, was sonst nirgends hinpasst.
```

Zwei Kacheln:

```text
Häufige Fragen
  Kursdauer, Preise, Anmeldung, Partner, verpasste Lektionen.
  →  /faq

Collabs
  Unsere Zusammenarbeit mit 2332 Dancewear.
  →  /mehr/collabs
```

Weitere Kacheln kommen dazu, wenn die entsprechenden Seiten belegten Inhalt haben — `/mehr/tanzschuhe` und `/mehr/partys` bestehen im Repo, aber nur mit Inhalt gehören sie hierher ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:76)).

---

# B — `/faq`

## B.1 Warum die FAQ wichtiger ist als ihre Position im Menü

Sie beantwortet die Fragen, die zwischen Interesse und Anmeldung stehen. Und sie ist die Seite, aus der KI-Assistenten und Suchmaschinen am ehesten direkt zitieren ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:321-367)).

## B.2 Meta

```text
Title:       Häufige Fragen zu Tanzkursen in Basel | Salsaflow
Description: Wie lange dauert ein Kurs, was kostet er, brauche ich einen
             Partner? Die häufigsten Fragen kurz beantwortet.
```

## B.3 Bauform jeder Antwort

Diese Form ist verbindlich:

```text
H2 = die Frage, so wie jemand sie stellt
Erster Satz = die vollständige Antwort, allein verständlich
Danach = ein bis zwei Sätze Erklärung
Zum Schluss = Link auf die passende Seite
```

Der erste Satz muss ohne die Frage funktionieren. Ein Assistent, der ihn zitiert, zitiert nur diesen Satz.

Falsch: `Das kommt ganz darauf an!` — Richtig: `Ein Kursblock dauert 8 Wochen.`

## B.4 Die Fragen

Alle neun Themen stammen aus der Live-FAQ (P09, [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:170-180)).

```text
H2:  Wie lange dauert ein Kurs?
Ein Kursblock dauert 8 Wochen, mit einer Lektion von 60 Minuten pro Woche.
An Feiertagen und in den Schulferien findet kein Unterricht statt — der Block
verlängert sich dann entsprechend.
→  Kursplan ansehen  /kursplan
```

```text
H2:  Was kostet ein Kurs?
Ein Kursblock kostet CHF 190, für Studierende CHF 160.
Eine einzelne Lektion kostet CHF 30, für Studierende CHF 25.
→  Alle Preise ansehen  /preise
```

```text
H2:  Brauche ich einen Tanzpartner?
Nein, du kannst dich allein anmelden.
Im Kurs wechseln wir regelmässig durch, damit alle mit verschiedenen Leuten
tanzen. Wenn ihr zu zweit kommt, geht das natürlich auch.
→  Tanzkurse ansehen  /tanzkurse
```

```text
H2:  Ich habe noch nie getanzt. Kann ich trotzdem kommen?
Ja, dafür ist Stufe 1 da — dort setzen wir nichts voraus.
Die meisten in einem Anfängerkurs haben vorher noch nie getanzt.
→  Wie die Level aufgebaut sind  /kursaufbau
```

Der zweite Satz braucht Bestätigung. → **Entscheidung FAQ-01.** Ohne Bestätigung entfällt er.

```text
H2:  Woher weiss ich, welches Level zu mir passt?
Komm in eine Probestunde — wir schauen uns gemeinsam an, welcher Kurs passt.
Das gilt besonders, wenn du schon woanders getanzt hast: Levelbezeichnungen
bedeuten nicht überall dasselbe.
→  Probestunde anfragen  /kontakt#schnupperstunde
```

Kein „gratis" (S-02).

```text
H2:  Wie melde ich mich an?
Über den Kursplan: Du wählst deinen Kurs und meldest dich direkt dort an.
Wenn du unsicher bist, welcher Kurs passt, schreib uns vorher kurz.
→  Zum Kursplan  /kursplan
```

```text
H2:  Was ist, wenn ich eine Lektion verpasse?
Du kannst sie nach Absprache in einem anderen Kurs nachholen.
Schreib uns dazu am besten auf WhatsApp, dann finden wir einen passenden Termin.
```

```text
H2:  Kann ich mitten im Kurs einsteigen?
Bei vielen Kursen ja.
Ob das bei einem bestimmten Kurs geht, steht direkt beim Kurs im Kursplan.
→  Laufende Kurse ansehen  /kursplan?einstieg=quereinstieg
```

```text
H2:  Was soll ich anziehen?
Bequeme Kleidung, in der du dich bewegen kannst.
Schuhe mit glatter Sohle sind angenehmer als Turnschuhe, weil du dich damit
auf dem Boden drehen kannst. Extra Tanzschuhe brauchst du am Anfang nicht.
```

Die Schuhaussage braucht Bestätigung. → **Entscheidung FAQ-02.**

```text
H2:  Ich habe kein Talent. Bringt das etwas?
Ja. Tanzen ist eine Technik, keine Begabung.
Am Anfang fühlt sich fast alles falsch an — nach ein paar Wochen nicht mehr.
Genau dafür ist ein Kurs über 8 Wochen da.
```

Das Thema ist in der Live-FAQ belegt. Die Antwort ist bewusst kurz und ohne Aufmunterungsrhetorik. „Jeder kann tanzen lernen!" klingt nach Werbung. „Tanzen ist eine Technik, keine Begabung" ist eine Aussage, über die jemand nachdenkt.

```text
H2:  Wo findet der Unterricht statt?
An der Elisabethenanlage 7, 4051 Basel, im 1. Stock — direkt beim Bahnhof SBB.
Trams 1, 2, 8, 10, 11 und 16 sowie Busse 30, 42, 48 und 50 halten in der Nähe.
→  Anfahrt und Kontakt  /kontakt
```

```text
H2:  Kann ich einen Kurs stornieren?
Von einem Kurs kannst du dich bis 3 Tage vorher abmelden, von einer
Einzellektion bis 24 Stunden vorher.
```

Beide Fristen aus den Live-AGB belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:62-63)).

## B.5 Strukturierte Daten

Die FAQ bekommt eine maschinenlesbare Auszeichnung — aber nur für Fragen, deren Antwort vollständig sichtbar auf der Seite steht. Eine Auszeichnung für Inhalte, die man erst aufklappen muss oder die gar nicht dastehen, ist ein Fehler.

Keine Auszeichnung für Fragen mit `PLACEHOLDER` oder offener Entscheidung.

## B.6 Aufklappen oder offen?

Alle Antworten stehen **offen** auf der Seite, nicht hinter einem Klick. Begründung: Diese Seite hat wenige Fragen und wird gelesen, nicht überflogen. Aufklappbare Elemente helfen bei fünfzig Fragen, nicht bei zwölf — und verstecken den Text vor Leuten, die auf der Seite suchen.

Gliederung stattdessen über Zwischenüberschriften: `Kurse` · `Preise und Anmeldung` · `Vor deinem ersten Mal` · `Ort`.

## B.7 Interne Links

Jede Antwort, die eine Seite betrifft, verlinkt sie: `/kursplan` (4×), `/preise`, `/tanzkurse`, `/kursaufbau`, `/kontakt`, `/kontakt#schnupperstunde`.

Pflicht: keine Antwort verlinkt pauschal auf die Startseite ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:241)).

---

# C — `/mehr/collabs`

## C.1 Meta

```text
Title:       Collabs — 2332 Dancewear | Salsaflow Basel
Description: Unsere Zusammenarbeit mit 2332 Dancewear.
```

## C.2 Inhalt

```text
H1:    Collabs
Lead:  PLACEHOLDER — worin die Zusammenarbeit besteht.
```

Belegt ist nur der Link aus dem Kunden-Eingang: `https://www.2332dancewear.com/collections/salsaflow` ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:43)). Dass es eine eigene Salsaflow-Kollektion gibt, geht aus der Adresse hervor.

Nicht belegt und deshalb offen:

- Gibt es für Kursteilnehmende einen Rabatt?
- Bekommt Salsaflow eine Beteiligung? (Falls ja, ist eine Werbekennzeichnung nötig.)
- Gibt es weitere Partner?

→ **Entscheidung COL-01.**

Bis dahin bleibt die Seite kurz und ehrlich:

```text
H1:   Collabs
Body: Mit 2332 Dancewear gibt es eine eigene Salsaflow-Kollektion.
CTA:  Kollektion ansehen  →  2332dancewear.com/collections/salsaflow
```

Der ausgehende Link öffnet in einem neuen Tab und ist als externer Link gekennzeichnet.

## C.3 Was hier nicht passiert

Keine Produktbilder ohne Nutzungsrecht. Keine Preise der Partnerseite — sie ändern sich dort und veralten hier. Keine Rabattbehauptung ohne Bestätigung.

---

## D — Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| FAQ-01 | „Die meisten haben vorher nie getanzt" belegbar? | Satz entfällt |
| FAQ-02 | Schuhempfehlung für den Anfang | Satz entfällt |
| COL-01 | Inhalt und Art der Collab | Kurzfassung mit Link |
| S-02 | Probestunde gratis? | ohne Preisaussage |

## E — Abnahme

- Jede FAQ-Antwort ist im ersten Satz vollständig.
- Keine Antwort verlinkt pauschal auf die Startseite.
- Strukturierte Daten nur für sichtbare, bestätigte Antworten.
- Antworten stehen offen, nicht hinter Klick.
- `/mehr` bleibt eine schlanke Verteilerseite.
- Collabs ohne unbelegte Rabatt- oder Partnerbehauptung.

## 12. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- `/mehr` bleibt Verteiler mit zwei klaren Kacheln. FAQ zeigt Antworten offen, gegliedert nach Themen; Collab kurz und extern verlinkt.
- Keine Sammelstruktur und keine künstliche Bildfläche; Text ist das Produkt.

### Buttons, Hover und Icons
- Kacheln und FAQ-Zielseiten als Textlinks mit Pfeil; externer Collab-Link erhält `ExternalLink` und Hinweis neues Tab.
- Lucide: `CircleHelp`, `Handshake`, `ExternalLink`, `ArrowRight`, `MapPin`; Icons unterstützen die Beschriftung.

### Motion und Zustände
- Stagger-Fade-up für Kacheln und FAQ-Gruppen; Antworten bleiben offen und ohne Accordion-Abhängigkeit. Reduced Motion sofort.
- PLACEHOLDER-Antworten erhalten sichtbaren offenen Status; keine strukturierte Auszeichnung für unvollständige Inhalte.

### Assets und Alt
- FAQ ohne Bild. Collab nur mit freigegebenen Partnerassets; keine Produktbilder oder Preise von der externen Seite kopieren.

### Mockup-Brief
- Felder: Route; Frage/Erstsatz; Antwort; Ziel-Link; Schema-Freigabe; extern/neu-Tab; Icon; Placeholder; FAQ-01, FAQ-02, COL-01, S-02.
