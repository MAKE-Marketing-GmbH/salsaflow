# 07 — Privatstunden `/privatstunden`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P0
**Job:** Das teuerste Produkt der Schule verkaufen — CHF 100 bis 130 pro Lektion, Pakete ab CHF 450. Die Seite muss den Preis rechtfertigen, ohne ihn zu verteidigen.
**Suchabsicht:** „Privatstunden Tanzen Basel", „Hochzeitstanz Basel", „Tanzunterricht einzeln"
**Primärer CTA:** Privatstunde anfragen
**Blocker:** P-01 (Bildmotiv)

---

## 1. Meta

```text
Title:       Privatstunden — Einzelunterricht im Tanzen | Salsaflow Basel
Description: Privatstunden in Basel für eine oder zwei Personen. CHF 100 pro
             Lektion, 5er-Paket CHF 450. Termin nach Absprache.
```

## 2. Sectionreihenfolge

1. Kopf
2. Wann eine Privatstunde sinnvoll ist
3. Wie es abläuft
4. Preise
5. Anfrageformular
6. Alternative Gruppenkurs

---

## 3. Kopf

```text
H1:    Privatstunden
Lead:  Eine Lehrperson, nur für dich oder euch zu zweit. Ihr arbeitet genau an
       dem, was gerade dran ist — im eigenen Tempo, ohne auf eine Gruppe
       Rücksicht zu nehmen.
Primary:   Privatstunde anfragen  →  #anfrage
Secondary: Preise ansehen         →  #preise
```

Der zweite Satz benennt den einzigen echten Unterschied zum Gruppenkurs. Alles andere wäre Verpackung.

## 4. Bild — Blocker P-01

Das aktuelle Motiv wird **nicht** übernommen. Es liegt in vier Zuschnitten desselben Bildes vor: eine junge Frau und ein deutlich älterer Herr, Handhaltung, flaches Kunstlicht, keine Bewegung ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-32)).

Warum das kein Auflösungsproblem ist: Das Bild zeigt nicht das Produkt. Privatstunden werden meistens von Paaren gebucht, die sich auf einen Anlass vorbereiten, oder von Einzelpersonen, die schneller vorankommen wollen. Das Motiv erzählt eine andere, unpassende Geschichte — und steht neben dem höchsten Preis der Seite.

| Weg | Motiv | Alt-Text |
|---|---|---|
| **Zwischenlösung, sofort** | `/photos/2026/hero-paar-dreh-01-portrait.webp` | `Eine Lehrperson führt eine Drehung mit einer Schülerin im Studio.` |
| **Ablauf-Sektion** | `/photos/2026/hero-paar-studiowand-01.webp` | `Ein Paar tanzt vor der hellen Studiowand.` |
| **Echte Lösung** | Shooting: eine Lehrperson mit einem Paar, 45 Minuten, Studio bei Tageslicht, 6 bis 8 Motive quer und hoch | nach Aufnahme festlegen |

Alt-Texte sind erst final, wenn das Motiv feststeht. Sie müssen beschreiben, was zu sehen ist — keine geratenen Namen ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md:258-265)).

**Wenn keiner der Wege freigegeben ist, läuft die Seite ohne Bild.** Textkarten mit ruhigem Layout. Ein falsches Bild schadet mehr als eine leere Fläche.

---

## 5. Wann eine Privatstunde sinnvoll ist

```text
H2:  Wofür Leute zu uns kommen
```

Vier Blöcke, keine Aufzählung mit Häkchen:

```text
Ein bestimmter Anlass
  Ihr wollt zu einem bestimmten Lied tanzen können — an einer Hochzeit,
  einem Geburtstag, einem Firmenanlass. Wir bauen etwas, das ihr auch
  wirklich tanzen könnt.

Etwas hakt
  Eine Drehung will nicht, das Timing rutscht, das Führen kommt nicht an.
  In einer Stunde zu zweit lässt sich das anschauen, was im Gruppenkurs
  untergeht.

Schneller vorankommen
  Als Ergänzung zum Kurs. Eine Privatstunde zwischendurch bringt
  oft mehr als ein zusätzlicher Block.

Lieber ohne Gruppe
  Manche wollen nicht vor anderen anfangen. Das ist ein guter Grund,
  und wir machen kein Thema daraus.
```

Der vierte Block spricht etwas aus, das sonst niemand schreibt. Er holt genau die Leute ab, die sonst gar nicht buchen.

**Hochzeitstanz:** Der Anlass ist genannt, aber nicht als eigenes Produkt beworben. Ob Salsaflow Hochzeitstanz aktiv anbietet — mit eigenem Ablauf und eigenem Preis — ist nicht belegt. → **Entscheidung PRIV-01.** Bei Bestätigung wird daraus ein eigener Abschnitt, weil „Hochzeitstanz Basel" eine eigene Suchabsicht ist.

„Schneller vorankommen als im Kurs" ist eine inhaltliche Behauptung der Schule. → **Entscheidung PRIV-02.** Ohne Bestätigung: `Als Ergänzung zum Kurs, wenn du an einem bestimmten Punkt gezielt arbeiten willst.`

---

## 6. Wie es abläuft

```text
H2:  So läuft es ab
```

```text
1  Du schreibst uns
   Kurz, was du erreichen willst und wann du ungefähr Zeit hast.

2  Wir melden uns persönlich
   Wir schlagen eine Lehrperson und Termine vor.

3  Ihr legt den Termin fest
   Direkt mit der Lehrperson.

4  Die Stunde
   60 Minuten bei uns im Studio, Elisabethenanlage 7, 1. Stock.
```

Diese vier Schritte sind bewusst konkret: Wer CHF 100 ausgibt, will wissen, was zwischen Klick und Tanzstunde passiert.

Die Dauer von 60 Minuten braucht Bestätigung — belegt ist der Preis pro Lektion, nicht deren Länge ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:161)). → **Entscheidung PRIV-03.** Ohne Bestätigung entfällt die Zeitangabe.

```text
Zeile: Einen Termin für eine Einzellektion kannst du bis 24 Stunden vorher
       absagen.
```

Belegt aus den Live-AGB ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:63)). Diese Zeile gehört hierher, weil sie eine Sorge auflöst.

### Kein Kalender

Es gibt **keinen** Buchungskalender mit freien Terminen und kein „sofort verfügbar". Termine entstehen in Absprache. Einen Kalender vorzutäuschen, der dann doch eine Anfrage auslöst, ist der schlechteste Weg.

---

## 7. Preise

```text
H2:  Preise
```

| | CHF |
|---|---:|
| Eine Person, eine Lektion | 100 |
| Eine Person, 5er-Paket | 450 |
| Zwei Personen, eine Lektion | 130 |
| Zwei Personen, 5er-Paket | 600 |

```text
Zeile: Beim 5er-Paket sparst du CHF 50.
Link:  Alle Preise ansehen  →  /preise
```

Alle vier Preise belegt (P08). Die Ersparnis ist aus den Zahlen gerechnet, nicht behauptet.

Keine Ratenzahlung, keine Rabattaktion, keine Preisspanne mit „ab". Der Preis steht da, wie er ist.

---

## 8. Anfrageformular

```text
H2:   Privatstunde anfragen
Lead: Schreib uns kurz, worum es geht. Wir melden uns persönlich —
      meistens innerhalb von zwei Tagen.
```

Die Antwortzeit ist ein Versprechen und braucht Bestätigung. → **Entscheidung PRIV-04.** Ohne Bestätigung: `Wir melden uns persönlich bei dir.`

### Felder

| Feld | Pflicht | Hinweis |
|---|---|---|
| Name | ja | |
| E-Mail | ja | |
| Telefon | nein | `Falls du lieber angerufen wirst.` |
| Für wie viele Personen | ja | Eine Person · Zwei Personen |
| Worum geht es | ja | Freitext, mehrzeilig. Platzhalter: `Zum Beispiel: Wir heiraten im Mai und wollen zu einem bestimmten Lied tanzen.` |
| Wann passt es dir ungefähr | nein | Freitext. Platzhalter: `Zum Beispiel: abends unter der Woche` |

Sechs Felder, davon vier Pflicht. Jedes weitere Feld kostet Anfragen. Keine Abfrage von Tanzerfahrung — das klärt sich im Gespräch.

### Datenschutz

Eine Zeile über dem Absenden-Knopf, kein Häkchen zum Anklicken, wenn keine Einwilligung nötig ist:

```text
Wir verwenden deine Angaben nur, um dir zu antworten.
Mehr dazu in der Datenschutzerklärung.
```

### Zustände

| Zustand | Sichtbarer Text |
|---|---|
| Absenden läuft | `Wird gesendet …`, Knopf deaktiviert |
| Erfolg | `Deine Anfrage ist angekommen. Wir melden uns persönlich bei dir.` |
| Feldfehler | direkt am Feld: `Bitte gib deine E-Mail-Adresse ein.` |
| Serverfehler | `Das hat gerade nicht geklappt. Schreib uns direkt an info@salsaflow-dc.com oder auf WhatsApp.` |

Der Fehlertext nennt einen zweiten Weg. Ein Formular, das scheitert und nur „Fehler" sagt, verliert die Anfrage endgültig.

E-Mail-Adresse belegt (P04).

### Backend-Logik in Worten

Die Anfrage geht an `info@salsaflow-dc.com` und wird zusätzlich serverseitig gespeichert, damit keine verlorengeht, wenn eine E-Mail hängenbleibt. Es entsteht **keine** Buchung und keine Zahlung — eine Privatstunde ist eine Absprache, kein Selbstbedienungsprodukt.

Die Antwort-E-Mail an die anfragende Person wiederholt, was sie geschrieben hat, und nennt die Adresse des Studios. Sie behauptet keinen Termin.

Gegen automatisierte Spam-Einträge wird ein serverseitiges Verfahren eingesetzt, das keine Rätselaufgabe für Menschen erzeugt. Wer eine Tanzstunde anfragen will, soll keine Ampeln anklicken müssen.

Die Erfolgsmeldung erscheint erst, wenn der Server die Anfrage tatsächlich angenommen hat — nicht schon beim Klick.

---

## 9. Alternative Gruppenkurs

```text
H2:   Vielleicht reicht auch ein Kurs
Body: Wenn du regelmässig tanzen lernen willst und kein bestimmtes Ziel im Kopf
      hast, ist ein Gruppenkurs meistens der bessere Weg — und deutlich günstiger.
Link: Tanzkurse ansehen  →  /tanzkurse
```

Ein teureres Produkt aktiv abzuraten, wenn es nicht passt, ist der glaubwürdigste Satz auf dieser Seite. Er kostet einzelne Buchungen und gewinnt Vertrauen.

---

## 10. Interne Links

`/preise`, `/tanzkurse`, `/kursplan`, `/kontakt`, `/faq`, `/kursaufbau`. → 6, Ziel ist 5. Die Live-Seite hatte 3 ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:249)).

---

## 11. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| P-01 | Welches Bildmotiv? | Seite ohne Bild |
| PRIV-01 | Wird Hochzeitstanz aktiv angeboten? | nur als Anlass erwähnt |
| PRIV-02 | „Schneller als im Kurs" belegbar? | neutrale Formulierung |
| PRIV-03 | Dauert eine Privatstunde 60 Minuten? | ohne Zeitangabe |
| PRIV-04 | Antwortzeit zwei Tage? | ohne Zeitangabe |

## 12. Abnahme

- Kein ungeeignetes Produktmotiv.
- Kein Kalender, kein „sofort buchbar".
- Alle vier Preise belegt, keine Preisspanne.
- Formular mit sechs Feldern, vier Zustände abgedeckt.
- Anfrage geht an die belegte E-Mail-Adresse.
- Gruppenkurs als ehrliche Alternative genannt.

## 13. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Hero als ruhige Text/Bild-Zweispalte; Nutzenblöcke vierfach als kurze Zeilen; Ablauf nummeriert; Preise als klare Tabelle; Anfrageformular ohne Kalender.
- Falsches Bestandsmotiv nicht verwenden. Bei fehlender Freigabe bewusst textzentriertes Layout statt leerem Bildslot.

### Buttons, Hover und Icons
- Primary `Privatstunde anfragen`, Secondary Preise. Submit-Button zeigt disabled/submitting; Erfolg bleibt im Formularbereich.
- Lucide: `UserRound`, `UsersRound`, `Target`, `CalendarClock`, `Send`, `MessageCircle`; Label immer sichtbar.

### Motion und Zustände
- Stagger-Fade-up für Nutzen und Ablauf, Formular selbst ruhig. Reduced Motion sofort. Absenden, Feldfehler, Erfolg und Serverfehler sind sichtbar spezifiziert.

### Assets und Alt
- Zwischenlösung `/photos/2026/hero-paar-dreh-01-portrait.webp`; Ablauf `/photos/2026/hero-paar-studiowand-01.webp`; Neu-Shooting bleibt Gate P-01. Alt erst nach finalem Motiv festschreiben.

### Mockup-Brief
- Felder: Zielgruppe; Ablauf; Preis; sechs Formularfelder; Pflichtstatus; Datenschutzhinweis; Erfolg/Fehler; E-Mail-Ziel; Bild/Alt; PRIV-01 bis PRIV-04.
