# 08 — Events & Workshops `/events` und Eventseiten

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P1
**Job:** Zeigen, dass hier etwas los ist — ohne abgelaufene Termine stehen zu lassen. Die alte Site trägt Jahreszahlen dauerhaft in der Navigation; das ist der Fehler, den diese Seite nicht wiederholt.
**Nav-Label:** EVENTS & WORKSHOPS (Kunden-Baseline)
**Routen:** `/events`, `/events/danceflow-night`, `/events/anniversary-weekend`, `/events/floweekend`, `/events/kalender`

---

## 1. `/events` — Übersicht

### 1.1 Meta

```text
Title:       Events und Workshops — Danceflow Nights und mehr | Salsaflow Basel
Description: Salsa- und Bachata-Partys, Workshops und Weekends in Basel.
             Danceflow Night jeden 1., 3. und 5. Freitag im Monat.
```

### 1.2 Kopf

```text
H1:    Events und Workshops
Lead:  Tanzen lernt man im Kurs. Tanzen tut man an einem Abend wie diesem.
       Hier findest du unsere Partys, Workshops und Weekends.
```

Der Lead sagt in zwei Sätzen, wozu diese Seite da ist: Kurse und Events sind zwei verschiedene Dinge, die sich brauchen.

### 1.3 Die drei festen Formate

```text
H2:  Was bei uns regelmässig stattfindet
```

```text
Danceflow Night
  Unsere Party im eigenen Studio, jeden 1., 3. und 5. Freitag im Monat.
  Zwei Floors: Salsa und Bachata.
  →  Zur Danceflow Night  /events/danceflow-night

FLOWeekend
  Ein Wochenende mit Workshops und Partys.
  →  Zum FLOWeekend  /events/floweekend

Anniversary Weekend
  Unser Geburtstagswochenende.
  →  Zum Anniversary Weekend  /events/anniversary-weekend
```

Rhythmus der Danceflow Night belegt (P10). Zwei Floors belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:139)).

Beim FLOWeekend und Anniversary Weekend steht bewusst **kein** Datum in der Übersicht. Datum steht auf der jeweiligen Seite, wo es gepflegt wird — sonst hat man zwei Stellen, die auseinanderlaufen.

### 1.4 Freitags-Workshops

```text
H2:   Workshops am Freitag
Body: Einzelne Workshops von 60 Minuten, je nach Thema für alle Level offen
      oder auf ein Level zugeschnitten. Du musst dafür keinen Kurs besuchen.
Preis: CHF 30, Studierende CHF 25
Link:  Alle Termine im Kalender  →  /events/kalender
```

Dauer und Preis belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:136,158)).

### 1.5 Kommende Termine

Automatische Liste. Pro Eintrag: Datum, Titel, eine Zeile, Link.

| Zustand | Sichtbarer Text |
|---|---|
| Termine vorhanden | Liste |
| Keine Termine | `Gerade steht kein einzelner Termin fest. Die Danceflow Night findet weiterhin jeden 1., 3. und 5. Freitag statt.` |
| Fehler | Block entfällt still |

### 1.6 Abschluss

```text
H2:       Noch nie an einer Salsa-Party gewesen?
Body:     Das ist kein Problem. Es kommen regelmässig Leute allein, und getanzt
          wird mit allen. Wenn du erst ein paar Schritte lernen willst,
          fang mit einem Kurs an.
Primary:  Tanzkurse ansehen  →  /tanzkurse
```

Das ist die echte Hemmschwelle bei Social Nights. Sie zu benennen, bringt mehr als jede Ankündigung.

Die Aussage „es kommen regelmässig Leute allein" braucht Bestätigung. → **Entscheidung EVT-01.**

---

## 2. `/events/danceflow-night`

### 2.1 Meta

```text
Title:       Danceflow Night — Salsa und Bachata Party in Basel | Salsaflow
Description: Jeden 1., 3. und 5. Freitag im Monat: Salsa- und Bachata-Floor
             an der Elisabethenanlage 7 in Basel. Eintritt ab CHF 5.
```

Dies ist die stärkste Event-Suchabsicht der Schule: „Salsa Party Basel" sucht jemand am Freitagnachmittag.

### 2.2 Kopf

```text
H1:    Danceflow Night
Lead:  Unsere Party im eigenen Studio. Jeden 1., 3. und 5. Freitag im Monat,
       zwei Floors: Salsa und Bachata.
Primary:   Nächster Termin  →  Kalender-Anker
```

### 2.3 Die Fakten

| | |
|---|---|
| Wann | jeden 1., 3. und 5. Freitag im Monat |
| Uhrzeit | `PLACEHOLDER` |
| Wo | Elisabethenanlage 7, 1. Stock, 4051 Basel |
| Floors | Salsa und Bachata |
| Eintritt | CHF 5 für Kursteilnehmende, CHF 10 für alle anderen |
| DJ | wechselnd, unter anderem DJ Rafa Rivas |

Uhrzeit ist im Proof-Inventar nicht belegt. → **Entscheidung DFN-02.** Ohne Uhrzeit kann kein vollständiges Event-Markup entstehen.

Eintritt siehe DFN-01 in [`05-preise.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/05-preise.md) — die Bezeichnung der vergünstigten Gruppe ist zwischen Live-Seiten widersprüchlich.

DJ Rafa Rivas ist belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:88)). „Wechselnd" braucht Bestätigung. → **Entscheidung DFN-03.**

### 2.4 Für Neue

```text
H2:  Zum ersten Mal dabei?
```

```text
Allein kommen ist normal.        Getanzt wird mit allen, nicht nur mit dem,
                                 mit dem man gekommen ist.
Was anziehen.                    Was du magst. Schuhe mit glatter Sohle
                                 sind angenehmer als Turnschuhe.
Wie viel du können musst.        Ein Grundschritt reicht. Wenn du den nicht
                                 hast, komm vorher in einen Kurs.
```

Diese drei Punkte beantworten die Fragen, die Leute davon abhalten hinzugehen. Die Schuhaussage braucht Bestätigung. → **Entscheidung DFN-04.**

### 2.5 Nächste Termine

Automatisch berechnet aus der Regel „1., 3. und 5. Freitag", nicht von Hand gepflegt. Die nächsten drei Termine mit Datum.

```text
Ausnahme-Hinweis: An Feiertagen kann ein Termin ausfallen. Fällt einer aus,
                  steht es hier.
```

### 2.6 Backend-Logik in Worten

Die Danceflow Night ist ein wiederkehrender Termin, kein einzelner Eintrag. Der Server berechnet aus der Regel die nächsten Daten und zeigt sie an. Dadurch kann diese Seite nie veralten — der häufigste Fehler auf Tanzschulseiten.

Ausfälle sind Ausnahmen, die einzeln eingetragen werden und den berechneten Termin überschreiben. Nur wenn zu einem Termin auch eine Uhrzeit bestätigt ist, entsteht für Google ein Event-Eintrag mit Datum. Ohne Uhrzeit bleibt es reine Textinformation ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:295-317)).

---

## 3. `/events/floweekend`

### 3.1 Meta

```text
Title:       FLOWeekend 2026 — Workshops und Partys | Salsaflow Basel
Description: FLOWeekend am 9. und 10. Oktober 2026 in Basel:
             Workshops und Partys über zwei Tage.
```

### 3.2 Kopf

```text
H1:    FLOWeekend 2026
Lead:  9. und 10. Oktober 2026. Zwei Tage Workshops und zwei Abende Party.
```

Datum belegt (P11).

### 3.3 Inhalt

```text
Programm      PLACEHOLDER — Zeitplan, Workshops, Lehrpersonen
Preise        PLACEHOLDER — Tagespass, Wochenendpass, nur Party
Anmeldung     PLACEHOLDER — Formular oder Buchung
Ort           Elisabethenanlage 7, 1. Stock, 4051 Basel  (falls dort)
```

→ **Entscheidung FLO-01.** Bis das Programm steht, ist die Seite eine Ankündigung mit Datum und einem Hinweis:

```text
Das Programm für 2026 steht noch nicht fest. Schreib uns auf WhatsApp,
dann sagen wir dir Bescheid, sobald es online ist.
```

### 3.4 Nach dem Event

Nach dem 10. Oktober 2026 wird die Seite nicht gelöscht. Sie bekommt oben:

```text
Das FLOWeekend 2026 ist vorbei. Fotos findest du in der Galerie.
Das nächste Datum geben wir hier bekannt.
```

Das erhält die Adresse und den Suchwert. Eine gelöschte Eventseite ist ein toter Link in jedem geteilten Beitrag.

---

## 4. `/events/anniversary-weekend`

### 4.1 Kopf

```text
H1:    Anniversary Weekend
Lead:  Unser Geburtstagswochenende mit Workshops und Partys.
```

### 4.2 Status

```text
Datum      PLACEHOLDER
Programm   PLACEHOLDER
Preise     PLACEHOLDER
```

Auf der Live-Site ist die Lage unklar: Der Slug enthält einen Tippfehler (`anniverysary`), die URL nennt 2026, der Inhalt bezieht sich auf 2027 ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:146)). Diese Unklarheit wird **nicht** übernommen.

→ **Entscheidung ANN-01.** Bis das Datum bestätigt ist:

```text
Das nächste Anniversary Weekend steht noch nicht fest. Sobald das Datum
da ist, findest du es hier.
```

Der alte Live-Pfad mit dem Tippfehler bekommt eine Weiterleitung auf diese Adresse ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:85)).

---

## 5. `/events/kalender`

### 5.1 Kopf

```text
H1:    Eventkalender
Lead:  Alle Termine an einem Ort: Partys, Workshops und Weekends.
```

### 5.2 Aufbau

Chronologische Liste, nächster Termin oben. Filter: `Alle · Partys · Workshops · Weekends`.

Pro Eintrag: Datum, Wochentag, Titel, Ort, eine Zeile, Link.

| Zustand | Sichtbarer Text |
|---|---|
| Lädt | `Termine werden geladen …` |
| Leer | `Gerade steht kein Termin fest. Die Danceflow Night findet weiterhin jeden 1., 3. und 5. Freitag statt.` |
| Fehler | `Die Termine lassen sich gerade nicht laden. Schau später noch einmal vorbei.` |

### 5.3 Backend-Logik in Worten

Der Kalender führt zwei Arten von Terminen zusammen: einzelne Ereignisse mit festem Datum und wiederkehrende Ereignisse mit einer Regel. Beide werden für die kommenden Monate berechnet, zusammengelegt und nach Datum sortiert.

Vergangene Termine verschwinden automatisch aus der Liste. Sie bleiben aber als Seite erreichbar, wenn sie eine eigene Adresse haben.

Ein Eintrag bekommt nur dann strukturierte Daten für Google, wenn Datum, Uhrzeit und Ort bestätigt sind. Halbe Angaben erzeugen in der Suche Fehler und sind schlechter als gar keine Angabe.

---

## 6. Gemeinsame Regeln für alle Eventseiten

- Kein abgelaufenes Datum bleibt sichtbar stehen.
- Keine Jahreszahl in der Navigation.
- Kein Event-Markup ohne bestätigtes Datum und Uhrzeit.
- Vergangene Eventseiten werden nicht gelöscht, sondern bekommen eine Rückschau-Zeile.
- Kein „ausverkauft!"-Effekt ohne echte Kapazitätsdaten.
- Fotos von Events nur aus der eigenen Galerie, ohne fremde Wasserzeichen ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:70-73)).

## 7. Interne Links

`/tanzkurse`, `/kursplan`, `/preise`, `/fotos`, `/kontakt`, untereinander zwischen den Eventseiten.

## 8. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| EVT-01 | Kommen regelmässig Leute allein? | Zeile entfällt |
| DFN-01 | Wer zahlt CHF 5? | nur CHF 10 |
| DFN-02 | Uhrzeit der Danceflow Night | kein Event-Markup |
| DFN-03 | Wechselnde DJs? | nur belegter Name oder keine Zeile |
| DFN-04 | Schuhempfehlung | Zeile entfällt |
| FLO-01 | FLOWeekend-Programm 2026 | Ankündigung mit Datum |
| ANN-01 | Anniversary Weekend Datum | Hinweiszeile ohne Datum |

## 9. Abnahme

- Vier Eventadressen, jede mit eigener H1.
- Danceflow Night berechnet ihre Termine selbst.
- Kein Datum ohne Beleg, kein Markup ohne Uhrzeit.
- Einstiegshürde für Party-Neulinge ausdrücklich adressiert.
- Alte Live-Tippfehler-Adressen werden weitergeleitet, nicht übernommen.

## 10. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Events-Hero und Danceflow-Block auf dunkler Kontrastfläche; Kalender als helle chronologische Liste. Formate als drei klare Teaser, nicht als News-Card-Soup.
- Vergangene Einzel-Events erhalten Archivstatus statt Löschung; Datum nie dauerhaft in der Navigation.

### Buttons, Hover und Icons
- Primary führt zum Kalender bzw. nächsten Termin; Formatlinks sekundär. Hover über Border/Farbe, keine Party-Bounce-Effekte.
- Lucide: `CalendarDays`, `Music2`, `Ticket`, `PartyPopper`, `ArrowRight`; Uhrzeit/Ort mit sichtbaren Labels.

### Motion und Zustände
- Stagger-Fade-up für Terminliste; wiederkehrende Danceflow-Daten werden nicht visuell künstlich animiert. Reduced Motion sofort. Loading, leer, Fehler und Archivzustand festlegen.

### Assets und Alt
- Danceflow-Fotos aus `/photos/premium/danceflow-home-2000.webp` oder kuratierten Party-Bildern; Shows ohne Wasserzeichen. Alt nach Szene und Anlass, keine erfundenen Eventnamen.

### Mockup-Brief
- Felder: Eventtyp; Regel/festes Datum; Ort; Preis; CTA; Kalenderfilter; Leer/Error/Archiv; Schema-Gate; Asset/Alt; EVT-01, DFN-01 bis DFN-04, FLO-01, ANN-01.
