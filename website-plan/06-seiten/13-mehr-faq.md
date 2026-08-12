# 13 — Mehr, FAQ und Collabs `/mehr` · `/faq` · `/mehr/collabs`

**Status:** READY FOR VERIFY (Copy humanisiert 2026-08-12)
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

### A.4 `/mehr/partys` und `/mehr/tanzschuhe` — beide vorerst gestrichen

Der SEO-Plan mappt beide Routen mit einem eigenen Hauptbegriff: `/mehr/partys` auf `salsa bachata partys basel`, `/mehr/tanzschuhe` auf `tanzschuhe basel` ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):74-83). Für beide gibt es keinen belegten Inhalt:

- **`/mehr/partys`** müsste fremde Veranstaltungen und Termine anderer Anbieter nennen. Nichts davon ist im Proof-Inventar belegt, und eine Terminliste über Dritte veraltet ohne Pflegeprozess innerhalb weniger Wochen.
- **`/mehr/tanzschuhe`** wäre ein Ratgeber mit Kaufempfehlungen. Belegt ist nur die Kollektion bei 2332 Dancewear; eine Empfehlung darüber hinaus wäre erfunden.

**Entscheidung:** Beide Routen entfallen bis auf Weiteres aus Seitenmappe, Navigation, Kachelliste und internem Verlinkungsplan. Sie werden von keiner Seite verlinkt — insbesondere nicht von `/events` ([`08-events.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/08-events.md), Abschnitt 7). Die Suchabsicht „wo kann ich in Basel tanzen gehen" bedient bis dahin `/events/danceflow-night`.

→ **Entscheidung MEHR-01.** Sobald die Schule Inhalt für eine der beiden Adressen freigibt, entsteht eine eigene nummerierte Seitenspezifikation und erst danach ein Link. Halbfertige Zielrouten werden nicht verlinkt ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:76)).

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

## B.3 Kopf

```text
H1:    Fragen zu Tanzkursen in Basel
Lead:  Hier stehen die Antworten, die zwischen Interesse und Anmeldung stehen:
       Kursdauer, Preis, Partner, Level und Einstieg. Wir unterrichten an der
       Elisabethenanlage 7 in Basel, direkt beim Bahnhof SBB.
```

Genau eine H1 auf dieser Adresse, fünf Wörter, mit Hauptbegriff und Ort ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):230-236). Alle einzelnen Fragen bleiben H2.

## B.4 Bauform jeder Antwort

Diese Form ist verbindlich:

```text
H2 = die Frage, so wie jemand sie stellt
Erster Satz = die vollständige Antwort, allein verständlich
Danach = ein bis zwei Sätze Erklärung
Zum Schluss = Link auf die passende Seite
```

Der erste Satz muss ohne die Frage funktionieren. Ein Assistent, der ihn zitiert, zitiert nur diesen Satz.

Falsch: `Das kommt ganz darauf an!` — Richtig: `Ein Kursblock dauert 8 Wochen.`

## B.5 Die Fragen

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
Ein Kursblock kostet CHF 190 pro Person und umfasst 8 Lektionen zu je 60 Minuten.
Ob es einen Studierendentarif gibt und was eine einzelne Lektion kostet, sagen
wir dir auf Anfrage — schreib uns kurz.
→  Alle Preise ansehen  /preise
```

Nur CHF 190 ist als Website-Zahl freigegeben ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):391-401). Studierendentarif und Einzellektion stehen ohne Betrag, bis STUD-01 und EINZ-01 entschieden sind ([`05-preise.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/05-preise.md):106-113).

```text
H2:  Brauche ich einen Tanzpartner?
Nein, du kannst dich allein anmelden.
Im Kurs wechseln wir regelmässig durch, damit alle mit verschiedenen Leuten
tanzen. Wenn ihr zu zweit kommt, geht das natürlich auch.
→  Tanzkurse ansehen  /tanzkurse
```

```text
H2:  Ich habe noch nie getanzt. Kann ich trotzdem kommen?
Ja, dafür ist Stufe 1 da. Dort setzen wir nichts voraus.
Die meisten in einem Anfängerkurs haben vorher noch nie getanzt.
→  Wie die Level aufgebaut sind  /kursaufbau
```

Der zweite Satz braucht Bestätigung. → **Entscheidung FAQ-01.** Ohne Bestätigung entfällt er.

```text
H2:  Ich bin über 40 und komplett unsportlich. Passt das?
Ja. Stufe 1 setzt weder Alter noch Kondition voraus.
Eine Lektion dauert 60 Minuten, und Salsa und Bachata lernst du über Schritte
und Timing, nicht über Kraft oder Beweglichkeit. Du bestimmst selbst, wie viel
du gibst.
→  Wie die Level aufgebaut sind  /kursaufbau
```

Die Antwort stützt sich nur auf Belegtes: Stufe 1 startet bei null ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):122) und eine Lektion dauert 60 Minuten. Sie behauptet keine Altersstruktur der Gruppen und kein Fitness-Ergebnis. Die Frage ist im SEO-Plan ausdrücklich für `/faq` vorgesehen ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):363).

```text
H2:  Kann ich als Frau die Führung lernen?
Ja, du wählst bei uns die Rolle, nicht dein Geschlecht.
Führen und Folgen sind zwei Techniken, die beide lernbar sind — in beide
Richtungen. Sag uns bei der Anmeldung, welche Rolle du tanzen willst.
→  Tanzkurse ansehen  /tanzkurse
```

Ob die Rollenwahl in jeder Gruppe frei möglich ist, hängt an der Zusammensetzung des Kurses. → **Entscheidung FAQ-03.** Ohne Bestätigung lautet der zweite Satz nur: `Führen und Folgen sind zwei Techniken, die beide lernbar sind. Schreib uns, welche Rolle du tanzen willst.` Die Frage ist im SEO-Plan ausdrücklich für `/faq` vorgesehen ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):364).

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
Am Anfang fühlt sich fast alles falsch an. Nach ein paar Wochen nicht mehr.
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

## B.6 Strukturierte Daten

Die FAQ bekommt eine maschinenlesbare Auszeichnung — aber nur für Fragen, deren Antwort vollständig sichtbar auf der Seite steht. Eine Auszeichnung für Inhalte, die man erst aufklappen muss oder die gar nicht dastehen, ist ein Fehler.

Keine Auszeichnung für Fragen mit `OWNER-BLOCKER` oder offener Entscheidung.

## B.7 Aufklappen oder offen?

Alle Antworten stehen **offen** auf der Seite, nicht hinter einem Klick. Begründung: Diese Seite hat wenige Fragen und wird gelesen, nicht überflogen. Aufklappbare Elemente helfen bei fünfzig Fragen, nicht bei zwölf — und verstecken den Text vor Leuten, die auf der Seite suchen.

Gliederung stattdessen über Zwischenüberschriften: `Kurse` · `Preise und Anmeldung` · `Vor deinem ersten Mal` · `Ort`.

## B.8 Interne Links

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
Lead:  OWNER-BLOCKER — worin die Zusammenarbeit besteht.
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
Zeile darunter: Was du für den Kursstart wirklich brauchst, steht in unseren
      häufigen Fragen. Bequeme Kleidung und Schuhe mit glatter Sohle reichen
      am Anfang.
Link: Häufige Fragen ansehen  →  /faq
Link: Alle Tanzkurse ansehen  →  /tanzkurse
```

Der ausgehende Link öffnet in einem neuen Tab und ist als externer Link gekennzeichnet.

Die beiden internen Links sind Pflicht: Sonst endet diese Adresse als externe Sackgasse und erfüllt das Kriterium „interne Links pro Seite" nicht ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):231-237). Sie passen zum Seitenjob, weil jemand, der auf Tanzkleidung schaut, meistens vor dem ersten Kurs steht.

## C.3 Was hier nicht passiert

Keine Produktbilder ohne Nutzungsrecht. Keine Preise der Partnerseite — sie ändern sich dort und veralten hier. Keine Rabattbehauptung ohne Bestätigung.

---

## D — Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| FAQ-01 | „Die meisten haben vorher nie getanzt" belegbar? | Satz entfällt |
| FAQ-02 | Schuhempfehlung für den Anfang | Satz entfällt |
| FAQ-03 | Rollenwahl in jeder Gruppe frei möglich? | Kurzfassung ohne Zusage, „schreib uns"-Satz |
| COL-01 | Inhalt und Art der Collab | Kurzfassung mit Link |
| MEHR-01 | Inhalt für `/mehr/partys` und `/mehr/tanzschuhe` | beide Routen entfallen, keine Verlinkung |
| STUD-01 | Studierendentarif freigegeben? | kein Betrag in der FAQ, Verweis auf `/preise` |
| EINZ-01 | Preis einer einzelnen Lektion? | kein Betrag in der FAQ, Verweis auf `/preise` |
| S-02 | Probestunde gratis? | ohne Preisaussage |

## E — Abnahme

- Jede FAQ-Antwort ist im ersten Satz vollständig.
- Keine Antwort verlinkt pauschal auf die Startseite.
- Strukturierte Daten nur für sichtbare, bestätigte Antworten.
- Antworten stehen offen, nicht hinter Klick.
- `/mehr` bleibt eine schlanke Verteilerseite.
- Collabs ohne unbelegte Rabatt- oder Partnerbehauptung, mit mindestens zwei internen Links.
- `/faq` hat genau eine H1; alle Fragen sind H2.
- In der FAQ erscheint als Preiszahl ausschliesslich CHF 190.
- Keine Verlinkung auf `/mehr/partys` oder `/mehr/tanzschuhe`, solange sie keine eigene Seitenspezifikation haben.

## 12. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- `/mehr` bleibt Verteiler mit zwei klaren Kacheln. FAQ zeigt Antworten offen, gegliedert nach Themen; Collab kurz und extern verlinkt.
- Keine Sammelstruktur und keine künstliche Bildfläche; Text ist das Produkt.

### Buttons, Hover und Icons
- Kacheln und FAQ-Zielseiten als Textlinks mit Pfeil; externer Collab-Link erhält `ExternalLink` und Hinweis neues Tab.
- Lucide: `CircleHelp`, `Handshake`, `ExternalLink`, `ArrowRight`, `MapPin`; Icons unterstützen die Beschriftung.

### Motion und Zustände
- Stagger-Fade-up für Kacheln und FAQ-Gruppen; Antworten bleiben offen und ohne Accordion-Abhängigkeit. Reduced Motion sofort.
- OWNER-BLOCKER-Antworten erhalten sichtbaren offenen Status; keine strukturierte Auszeichnung für unvollständige Inhalte.

### Assets und Alt
- FAQ ohne Bild. Collab nur mit freigegebenen Partnerassets; keine Produktbilder oder Preise von der externen Seite kopieren.

### Mockup-Brief
- Felder: Route; Frage/Erstsatz; Antwort; Ziel-Link; Schema-Freigabe; extern/neu-Tab; Icon; Placeholder; FAQ-01, FAQ-02, COL-01, S-02.
