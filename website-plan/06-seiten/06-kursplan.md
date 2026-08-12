# 06 — Kursplan `/kursplan`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P0
**Job:** Das Werkzeug der Seite. Hier sucht jemand einen konkreten Kurs an einem konkreten Abend und meldet sich an. Alles andere führt hierher.
**Suchabsicht:** „Salsa Kurse Basel Termine", Wiederkehrende Besucher
**Primärer CTA:** Kurs buchen (pro Kurs)

---

## 1. Meta

```text
Title:       Kursplan — alle Tanzkurse mit Terminen | Salsaflow Basel
Description: Alle laufenden und startenden Kurse in Basel: Salsa, Bachata und
             Heels, nach Level und Wochentag gefiltert. Quereinstieg möglich.
```

## 2. Aufbau

1. Kopf
2. Filter
3. Kursliste
4. Erklärzeile unter der Liste
5. Hilfe-Block

---

## 3. Kopf

```text
H1:    Kursplan
Lead:  Alle Kurse, die gerade laufen oder demnächst starten. Filtere nach Stil,
       Level und Wochentag — oder zeig dir nur die Kurse an, in die du auch
       mitten im Block noch einsteigen kannst.
```

Kein CTA im Kopf. Der Handlungsaufruf sitzt an jedem einzelnen Kurs. Ein zusätzlicher Button oben würde nur vom Werkzeug ablenken.

---

## 4. Filter

Vier Filter, alle als sichtbare Knopfreihen, nicht als Auswahlmenü. Ein Auswahlmenü versteckt, was es überhaupt gibt.

```text
Stil       Alle · Salsa · Bachata · Heels
Level      Alle · Beginner · Beginner Flow · Intermediate · Intermediate Flow · Advanced
Tag        Alle · Mo · Di · Mi · Do · Fr · Sa · So
Einstieg   Alle · Startet bald · Quereinstieg möglich
```

Filterzustand steht in der Adresse (`/kursplan?stil=salsa&level=beginner`), damit ein gefilterter Kursplan verschickt und verlinkt werden kann. Die Stilseiten und die Home verlinken genau so hierher.

```text
Zurücksetzen: Filter zurücksetzen
```

### Anzeige der Trefferzahl

```text
<n> Kurse gefunden
```

Bei genau einem Treffer: `1 Kurs gefunden`. Kein „Ergebnis(se)" mit Klammern.

---

## 5. Kursliste

Eine Karte pro Kurs. Sichtbar ohne Klick:

```text
Stil und Level        Salsa · Beginner Stufe 3
Variante              On2                        (nur wenn gesetzt)
Wochentag und Zeit    Dienstag, 19:00 – 20:00
Start                 Beginnt am 2. September
Dauer                 8 Wochen
Lehrperson            mit Claudia                (nur wenn freigegeben)
Ort                   Studio 1
Status                Plätze frei
Preis                 CHF 190 · Studierende CHF 160
CTA                   Kurs buchen
```

Lehrpersonen erscheinen nur mit ausdrücklicher Freigabe der jeweiligen Person. → **Entscheidung KP-01.** Ohne Freigabe entfällt die Zeile.

### Statuszeilen

Jede Zeile ist eine Aussage über die Realität, nicht über Marketing.

| Fall | Sichtbarer Text | CTA |
|---|---|---|
| Plätze frei | `Plätze frei` | `Kurs buchen` |
| Wenige Plätze | `Noch wenige Plätze` | `Kurs buchen` |
| Ausgebucht | `Ausgebucht` | `Auf die Warteliste` |
| Läuft, Einstieg erlaubt | `Läuft — Quereinstieg möglich` | `Quereinstieg anfragen` |
| Läuft, kein Einstieg | `Läuft bereits` | kein CTA |
| Rollen ungleich verteilt | `Noch Plätze zum Folgen` bzw. `Noch Plätze zum Führen` | `Kurs buchen` |

„Noch wenige Plätze" darf nur erscheinen, wenn es stimmt — also aus der tatsächlichen Restkapazität berechnet wird. Ab welcher Zahl das gilt, legt Salsaflow fest. → **Entscheidung KP-02.** Ohne Festlegung gibt es nur „Plätze frei" und „Ausgebucht".

Kein Countdown, kein „nur noch 2 Plätze!" mit Ausrufezeichen, keine Anzeige, wie viele andere gerade schauen.

### Zustände der Liste

| Zustand | Sichtbarer Text |
|---|---|
| Lädt | `Kursplan wird geladen …` |
| Keine Treffer bei aktivem Filter | `Kein Kurs passt zu diesen Filtern. Setz die Filter zurück oder schreib uns auf WhatsApp — wir sagen dir, wann etwas Passendes startet.` |
| Gar keine Kurse | `Gerade läuft kein Kurs. Schreib uns auf WhatsApp, dann melden wir uns, sobald die nächste Staffel steht.` |
| Fehler | `Der Kursplan lässt sich gerade nicht laden. Versuch es in ein paar Minuten noch einmal oder schreib uns auf WhatsApp.` |

Die Leer-Texte unterscheiden zwischen „dein Filter ist zu eng" und „es gibt gerade nichts". Ein einziger Leer-Text für beide Fälle schickt Leute weg, die nur einen Haken zu viel gesetzt haben.

---

## 6. Erklärzeile unter der Liste

```text
Quereinstieg heisst: Du kommst dazu, obwohl der Block schon läuft. Das geht
nicht bei jedem Kurs — wo es geht, steht es beim Kurs.

Link: Wie die Level aufgebaut sind  →  /kursaufbau
```

---

## 7. Hilfe-Block

```text
H2:       Nicht sicher, welcher Kurs?
Body:     Schreib uns, was du bisher getanzt hast. Wir sagen dir, welcher Kurs
          passt — und wenn keiner passt, sagen wir das auch.
Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: WhatsApp schreiben
```

„Und wenn keiner passt, sagen wir das auch" ist der Satz, der diese Seite von jeder anderen Kursliste unterscheidet. Er kostet nichts und nimmt die Sorge, in ein Verkaufsgespräch zu geraten.

---

## 8. Backend-Logik in Worten

Diese Seite ist die einzige, die schreibend mit dem Server spricht. Deshalb hier ausführlich — als Erklärung, nicht als Code.

### 8.1 Woher die Kurse kommen

Der Kursplan liest den Kursbestand des Servers. Ein Kurs erscheint, wenn er als öffentlich markiert ist und entweder in der Zukunft startet oder gerade läuft. Vergangene Kurse verschwinden von selbst; niemand muss sie von Hand entfernen. Sortiert wird nach Startdatum, danach nach Wochentag und Uhrzeit.

### 8.2 Wie der Status entsteht

Der Belegungsstatus wird beim Laden berechnet, nicht gespeichert. Der Server zählt die bestätigten Buchungen eines Kurses und vergleicht sie mit der Kapazität. Ein von Hand gepflegtes Feld „ausgebucht" würde früher oder später falsch stehen.

Bei Paartänzen zählt der Server zusätzlich getrennt, wie viele Führende und wie viele Folgende gebucht haben. Ist eine Seite deutlich voller, zeigt die Karte nur noch die andere Rolle als frei. Das ist kein Marketing-Trick, sondern der Grund, warum ein Kurs funktioniert: Ohne Balance tanzt die Hälfte an der Wand.

### 8.3 Was beim Klick auf „Kurs buchen" passiert

Der Weg führt auf `/buchung` mit dem gewählten Kurs. Dort fragt das Formular nach Name, E-Mail, Telefon und Rolle (Führen oder Folgen) sowie nach dem Tarif (regulär oder Studierende). Ein Kundenkonto ist **nicht** nötig und wird auch nicht angeboten — für einen Tanzkurs ein Passwort zu vergeben, ist eine Hürde ohne Gegenwert.

Bevor irgendetwas kostenpflichtig wird, prüft der Server erneut, ob der Platz noch frei ist. Diese Prüfung findet serverseitig statt, weil zwei Leute gleichzeitig auf den letzten Platz klicken können. Ist der Platz weg, geht es nicht zur Zahlung, sondern zurück mit der Meldung: `Dieser Kurs ist gerade voll geworden. Möchtest du auf die Warteliste?`

### 8.4 Zahlung und Bestätigung

Führt der Weg über eine Online-Zahlung, endet er auf `/buchung/erfolg` oder `/buchung/abbruch`. Entscheidend: Eine Buchung gilt erst als bestätigt, wenn der Zahlungsdienst das dem Server direkt meldet — nicht dann, wenn der Browser auf der Erfolgsseite landet. Jemand kann diese Adresse auch einfach aufrufen.

Deshalb lautet der Text auf der Erfolgsseite:

```text
H1:   Zahlung erhalten
Body: Danke. Sobald die Zahlung geprüft ist, bekommst du die Anmeldebestätigung
      per E-Mail. Das dauert in der Regel wenige Minuten.
```

Und nicht „Du bist angemeldet". Auf `/buchung/abbruch`:

```text
H1:   Buchung abgebrochen
Body: Es wurde nichts abgebucht. Dein Platz ist noch nicht reserviert —
      du kannst es jederzeit noch einmal versuchen.
CTA:  Zurück zum Kursplan
```

Ob überhaupt online bezahlt wird, ist offen (ZAHL-01 in [`05-preise.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/05-preise.md)). Bleibt es bei Barzahlung, endet der Weg nach der Kapazitätsprüfung direkt bei einer Anmeldebestätigung mit dem Hinweis, dass in der ersten Lektion bezahlt wird.

### 8.5 Warteliste

Ist ein Kurs voll, führt der CTA zur Warteliste. Dort wird nur erfasst, wer sich für welchen Kurs interessiert. Es entsteht keine Zahlung und kein Anspruch. Sichtbarer Text nach dem Absenden:

```text
Du stehst auf der Warteliste. Wir melden uns, sobald ein Platz frei wird.
```

Nicht sichtbar wird, an welcher Stelle jemand steht oder wie viele warten — das sind Angaben über andere Leute.

### 8.6 Datensparsamkeit

Die Seite zeigt nie, wer in einem Kurs angemeldet ist, wie viele Plätze genau frei sind oder wie ein Kurs im Vergleich läuft. Sichtbar ist nur, was jemand für seine eigene Entscheidung braucht.

### 8.7 Sichtbarkeit für Suchmaschinen

`/kursplan` ist eine normale, indexierbare Seite. Die Buchungsstrecke `/buchung`, `/buchung/erfolg` und `/buchung/abbruch` wird nicht indexiert ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:69)). Kurse mit bestätigtem Startdatum können strukturierte Daten bekommen — Kurse ohne Datum nicht.

---

## 9. Interne Links

`/kursaufbau`, `/preise`, `/tanzkurse`, `/tanzkurse/salsa`, `/tanzkurse/bachata`, `/tanzkurse/heels`, `/kontakt#schnupperstunde`, `/faq`.

---

## 10. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| KP-01 | Dürfen Lehrpersonen namentlich beim Kurs stehen? | Zeile entfällt |
| KP-02 | Ab wie vielen Restplätzen gilt „wenige Plätze"? | nur frei / ausgebucht |
| KA-05 | Was kostet ein Quereinstieg? | „Preis auf Anfrage" |
| ZAHL-01 | Online oder bar? | Buchung endet bei Anmeldebestätigung |
| PAAR-01 | Paarpreis | Preiszeile ohne Paarpreis |

## 11. Abnahme

- Filter sind sichtbar, teilbar und zurücksetzbar.
- Vier unterschiedene Leer- und Fehlerzustände.
- Kein Status, der nicht aus echten Daten kommt.
- Keine künstliche Knappheit.
- Bestätigung nie allein aus der Browser-Rückkehr.
- Keine Fremddaten sichtbar.

## 12. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Werkzeug zuerst: H1, sichtbare Filterreihen, Trefferzahl, Kurskarten. Keine dekorative Hero-Fläche, die den Plan nach unten schiebt.
- Karten zeigen Status, Preis und Buchungsweg in fester Reihenfolge; Filter auf Mobil horizontal scrollfähig, URL bleibt teilbar.

### Buttons, Hover und Icons
- Pro Karte genau ein kontextabhängiger CTA; Reset als Secondary. Hover hebt die Karte über Border/Farbe hervor, nicht über starken Schatten.
- Lucide: `Filter`, `CalendarDays`, `Clock3`, `MapPin`, `UsersRound`, `ShoppingBag`, `ListRestart`; Labels bleiben sichtbar.

### Motion und Zustände
- Filterwechsel ohne Layout-Sprung; Karten erhalten kurzen Stagger-Fade-up. Reduced Motion sofort. Loading, kein Treffer, gar keine Kurse, Fehler, ausgebucht und Warteliste explizit.

### Assets und Alt
- Keine Bilder nötig; Kursplan ist Datenwerkzeug. Icons sind semantisch dekorativ neben Text und brauchen keine Bildbeschreibung.

### Mockup-Brief
- Felder: Query-State; Filterwerte; Trefferzahl; Kurskartenfelder; Status; CTA; Buchungsfehler; Zahlungs-/Webhook-Hinweis; Warteliste; Mobile; noindex für Buchungsrouten.
