# 05 — Preise `/preise`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P0
**Job:** Alle Preise an einer Stelle, ohne Sternchen und ohne dass man rechnen muss. Diese Seite hatte auf der alten Site schon die beste interne Verlinkung — das bleibt so.
**Suchabsicht:** „Tanzkurs Basel Preis", „Salsa Kurs Kosten"
**Primärer CTA:** Kursplan ansehen

---

## 1. Meta

```text
Title:       Preise — Tanzkurse, Privatstunden und Pässe | Salsaflow Basel
Description: Kursblock 8 Wochen CHF 190, Studierende CHF 160. Einzellektion,
             Privatstunden, Salsaflow Pass und Studio-Miete auf einen Blick.
```

Die Zahl im Description-Text ist belegt (P08) und der stärkste Grund zu klicken.

## 2. Sectionreihenfolge

1. Kopf
2. Gruppenkurse
3. Privatstunden
4. Pass
5. Danceflow Night
6. Studio mieten
7. Was im Preis enthalten ist
8. Bezahlen und Abmelden
9. Abschluss

---

## 3. Kopf

```text
H1:    Preise
Lead:  Alle Preise in Schweizer Franken. Ein Kursblock läuft über 8 Wochen,
       einmal pro Woche 60 Minuten.
Primary:   Kursplan ansehen  →  /kursplan
```

Kein Einleitungsabsatz über „faire Preise" oder „gutes Preis-Leistungs-Verhältnis". Wer auf eine Preisseite kommt, will die Zahl.

---

## 4. Gruppenkurse

```text
H2:  Gruppenkurse
```

| | CHF | Studierende |
|---|---:|---:|
| Kursblock, 8 Wochen, eine Person | 190 | 160 |
| Kursblock, 8 Wochen, Paar | `PLACEHOLDER` | `PLACEHOLDER` |
| Einzelne Lektion | 30 | 25 |
| Workshop, 60 Minuten | 30 | 25 |

### PAAR-01 — der Paarpreis muss geklärt werden

Auf der Live-Site widersprechen sich zwei Stellen ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:157)):

- Die Preisseite liest sich als **CHF 190 pro Person**, auch wenn man als Paar kommt.
- Die FAQ nennt **CHF 320 für ein Paar** und **CHF 270 für ein Studierendenpaar** — das wären CHF 160 bzw. 135 pro Person.

Beides gleichzeitig kann nicht stimmen. Solange das nicht geklärt ist, steht in der Paar-Zeile `PLACEHOLDER` und darunter:

```text
Ihr kommt zu zweit? Schreib uns kurz — wir sagen dir den Paarpreis.
```

Eine falsche Preisangabe ist teurer als eine fehlende. → **Entscheidung PAAR-01**, blockiert diese Seite nicht, muss aber vor dem Launch beantwortet sein.

Sobald die Antwort da ist, gibt es genau **eine** Quelle für den Paarpreis: diese Tabelle. FAQ und Kursplan zeigen denselben Wert, nicht ihre eigene Version.

---

## 5. Privatstunden

```text
H2:  Privatstunden
```

| | CHF |
|---|---:|
| Eine Person, eine Lektion | 100 |
| Eine Person, 5er-Paket | 450 |
| Zwei Personen, eine Lektion | 130 |
| Zwei Personen, 5er-Paket | 600 |

```text
Zeile: Das 5er-Paket spart bei einer Person CHF 50, bei zwei Personen CHF 50.
Link:  Wie Privatstunden ablaufen  →  /privatstunden
```

Die Ersparnis auszurechnen ist Service, keine Werbung — die Zahlen stehen ohnehin in der Tabelle. Gerechnet: 5 × 100 = 500 gegenüber 450, und 5 × 130 = 650 gegenüber 600.

Alle vier Preise belegt (P08, [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:161-162)).

---

## 6. Salsaflow Pass

```text
H2:  Salsaflow Pass
```

| | CHF | Studierende |
|---|---:|---:|
| Pass, 8 Wochen | 410 | 340 |

```text
Body: PLACEHOLDER — was der Pass genau abdeckt: alle Kurse im Zeitraum,
      bestimmte Stile, Workshops inklusive oder nicht, Danceflow Night inklusive
      oder nicht.
```

Der Preis ist belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:163)), der Leistungsumfang nicht. Eine Zahl ohne Erklärung, was man dafür bekommt, verkauft nichts und wirft Fragen auf. → **Entscheidung PASS-01**.

Ohne Antwort bleibt die Zeile in der Tabelle mit dem Hinweis:

```text
Was im Pass enthalten ist, sagen wir dir gerne — schreib uns.
```

---

## 7. Danceflow Night

```text
H2:  Danceflow Night
```

| | CHF |
|---|---:|
| Eintritt, Mitglieder | 5 |
| Eintritt, Gäste | 10 |

```text
Zeile: Jeden 1., 3. und 5. Freitag im Monat, mit Salsa- und Bachata-Floor.
Link:  Zur Danceflow Night  →  /events/danceflow-night
```

Preise und Rhythmus belegt (P10, [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:160)).

**Offen:** Die Live-Site benutzt an einer Stelle „Mitglieder / Gäste", an anderer „Studierende / Gäste". Wer den vergünstigten Eintritt bekommt, ist damit unklar. → **Entscheidung DFN-01.** Bis zur Klärung steht statt der Bezeichnung:

```text
CHF 5 für Kursteilnehmende, CHF 10 für alle anderen
```

— und auch das nur, wenn Salsaflow es so bestätigt. Sonst nur `CHF 10 Eintritt` ohne Ermässigungszeile.

---

## 8. Studio mieten

```text
H2:  Studio mieten
```

| | CHF pro Stunde |
|---|---:|
| Montag bis Freitag, bis 17 Uhr | 50 |
| Danach und am Wochenende | 60 |

```text
Zeile: Zwei gleich grosse Räume mit Tageslicht, Spiegel und Musikanlage.
       Ausserhalb der regulären Zeiten auf Anfrage.
Link:  Standort und Raumvermietung  →  /kontakt/standort-raumvermietung
```

Preise und Zeitfenster belegt (P16, [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:164)).

„Spiegel und Musikanlage" braucht Bestätigung — belegt sind Tageslicht, zwei gleich grosse Studios, zwei WCs und ein Wasserspender ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:191-196)). → **Entscheidung STU-01.** Ohne Bestätigung: `Zwei gleich grosse Räume mit Tageslicht.`

---

## 9. Was im Preis enthalten ist

```text
H2:  Was im Kurspreis drin ist
```

```text
Enthalten
  8 Lektionen à 60 Minuten
  Wechselnde Tanzpartner im Kurs, du musst niemanden mitbringen
  Nachholen einer verpassten Lektion nach Absprache

Nicht enthalten
  Eintritt zur Danceflow Night
  Workshops ausserhalb des Kursblocks
  Tanzschuhe
```

Die Nachhol-Regel und die Partnerregel sind FAQ-belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:174-176)).

Eine „Nicht enthalten"-Liste wirkt zuerst unfreundlich und verhindert später genau die Diskussion, die niemand will.

---

## 10. Bezahlen und Abmelden

```text
H2:  Bezahlen und Abmelden
```

```text
Bezahlen
  PLACEHOLDER — heute wird bei Regulärkursen oft in der ersten oder zweiten
  Lektion bar bezahlt. Ob das so bleibt oder online bezahlt wird, ist offen.

Abmelden
  Von einem Kurs kannst du dich bis 3 Tage vorher abmelden.
  Bei einer Einzellektion bis 24 Stunden vorher.
```

Beide Abmeldefristen sind in den Live-AGB belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:62-64)).

### Backend-Logik in Worten — ZAHL-01

Das Zielbild im Repo sieht eine Online-Zahlung über Stripe vor. Die heutige Live-Praxis ist Barzahlung in der ersten oder zweiten Lektion. Beides gleichzeitig zu behaupten, verwirrt.

Die Entscheidung lautet: Wenn online bezahlt wird, gilt eine Buchung erst als bestätigt, wenn der Zahlungsdienst das serverseitig meldet — nicht schon dann, wenn der Browser von der Bezahlseite zurückkommt ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:627-629)). Die Rückkehrseite sagt deshalb „Zahlung erhalten, die Bestätigung kommt gleich per E-Mail" und nicht „Du bist angemeldet".

Bis das entschieden ist, steht auf dieser Seite kein Zahlungsweg. → **Entscheidung ZAHL-01**.

---

## 11. Abschluss

```text
H2:       Welcher Kurs passt?
Body:     Im Kursplan siehst du, was gerade startet und wo noch Plätze frei sind.
Primary:  Kursplan ansehen        →  /kursplan
Secondary: Probestunde anfragen   →  /kontakt#schnupperstunde
```

---

## 12. Interne Links

`/kursplan` (2×), `/privatstunden`, `/events/danceflow-night`, `/kontakt/standort-raumvermietung`, `/kontakt#schnupperstunde`, `/tanzkurse`, `/faq`, `/kursaufbau`. → 9, die Live-Seite hatte 10 und dieser Wert soll gehalten werden ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:252)).

---

## 13. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| PAAR-01 | Was kostet ein Paar wirklich? | `PLACEHOLDER` + „schreib uns" |
| PASS-01 | Was deckt der Salsaflow Pass ab? | Preis ohne Umfang, Hinweiszeile |
| DFN-01 | Wer zahlt CHF 5 — Mitglieder oder Studierende? | nur CHF 10 ohne Ermässigung |
| STU-01 | Ausstattung der Räume | nur Tageslicht |
| ZAHL-01 | Bar oder online? | kein Zahlungsweg genannt |
| SOM-01 | Gilt der Sommerpreis CHF 100 / 90 weiter? | Sommerpreis nur aus Kursbestand |

## 14. Abnahme

- Jede genannte Zahl steht im Proof-Inventar 8.1 oder ist `PLACEHOLDER`.
- Kein Preis erscheint an zwei Stellen der Website mit zwei Werten.
- Keine Rabattdringlichkeit, kein „nur noch heute".
- Widersprüche sind sichtbar gemacht, nicht überschrieben.

## 15. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Preis-Head kompakt; Gruppenkurse, Privatstunden, Pass, Danceflow Night und Raumvermietung als klar getrennte Tabellenblöcke. Keine Kartenwand.
- PLACEHOLDER-Zeilen erhalten sichtbare Beschriftung und werden nicht visuell wie bestätigte Preise behandelt. Abschluss mit Kursplan-CTA.

### Buttons, Hover und Icons
- Ein Primary Kursplan im Kopf und Abschluss; Tabellenlinks sekundär als Pfeil-Textlinks. Hover nur Farbe und Unterstreichung.
- Lucide: `Tag`, `CreditCard`, `Ticket`, `Moon`, `Building2`, `ArrowRight`; Geldbeträge nie nur über Farbe unterscheiden.

### Motion und Zustände
- Preisblöcke mit Stagger-Fade-up; Tabellenwerte selbst ohne Bewegung. Reduced Motion sofort.
- Offene Paar-, Pass-, Zahlungs- und Ausstattungswerte als `PLACEHOLDER`/Anfragehinweis; keine falschen Erfolgs- oder Checkout-Zustände auf dieser Infoseite.

### Assets und Alt
- Kontextbild nur aus belegtem Bestand, optional `/photos/schedule/kurs-aktion.webp`; wenn nicht freigegeben, reine Textseite. Alt konkret, dekorative Hintergründe leer.

### Mockup-Brief
- Felder: Tabelle/Quelle; bestätigter Betrag; PLACEHOLDER; Linkziel; Icon; Hover/Focus; responsive Tabellenverhalten; offene ID PAAR-01, PASS-01, DFN-01, STU-01, ZAHL-01.
