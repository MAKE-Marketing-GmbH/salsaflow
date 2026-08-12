# 06 — Kursplan `/kursplan`

**Status:** FINAL v2 (2026-08-12)
**Priorität:** P0
**Job:** Das Werkzeug der Seite. Hier sucht jemand einen konkreten Kurs an einem konkreten Abend und meldet sich an. Alles andere führt hierher.
**Suchabsicht:** „kursplan tanzschule basel", „salsa kurse basel termine", wiederkehrende Besucher
**Primärer CTA:** Kurs buchen (pro Kurs)
**Primär-Keyword:** kursplan tanzschule basel ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):57)
**Sekundär-Keywords:** salsa kurse basel termine · bachata kurs basel termine · tanzkurs wochentag basel

---

## 1. Meta

```text
Title:       Kursplan: Tanzkurse in Basel | Salsaflow
Description: Alle Salsa-, Bachata- und Heels-Kurse in Basel mit Tag, Uhrzeit und
             Level. Filtere nach Stil und Einstieg. Ein Kursblock kostet CHF 190.
```

Title 40 Zeichen, Description 136 Zeichen — beide innerhalb der Vorgabe. Das Primär-Keyword steht vorn, die Marke hinten.

## 2. Aufbau

1. Kopf
2. Filter
3. Kursliste
4. Erklärzeile unter der Liste
5. Preiszeile
6. Hilfe-Block

---

## 3. Kopf

```text
Eyebrow: KURSPLAN
H1:      Kursplan der Tanzschule in Basel
Lead:    Im Kursplan der Tanzschule in Basel siehst du jeden laufenden und jeden
         startenden Kurs mit Wochentag, Uhrzeit und Level. Wir unterrichten an
         der Elisabethenanlage 7, im 1. Stock beim Bahnhof SBB. Filtere nach
         Stil, Level oder Tag und such dir einen Kurs aus.
Hinweis: Neu bei uns? Beginner Stufe 1 ist der direkte Einstieg — dort startest
         du bei null. Wenn du schon getanzt hast, schreib uns kurz, dann stufen
         wir dich ein.
Angst-Zeile: Du brauchst keinen Partner. Wir wechseln im Kurs regelmässig durch.
```

H1: fünf Wörter, enthält „Kursplan", „Tanzschule" und „Basel" ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):230-236). Der Lead trägt den Hauptbegriff grammatikalisch notwendig im ersten Satz und den Ort im zweiten ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):254-260).

Kein CTA im Kopf. Der Handlungsaufruf sitzt an jedem einzelnen Kurs. Ein zusätzlicher Button oben würde nur vom Werkzeug ablenken.

---

## 4. Filter

Vier Filter, alle als sichtbare Knopfreihen, nicht als Auswahlmenü. Ein Auswahlmenü versteckt, was es überhaupt gibt.

```text
Filter-Überschrift (visuell versteckt, für Screenreader): Kurse filtern

Stil       Alle · Salsa · Bachata · Heels · weitere bestätigte Stile aus dem Kursbestand
Level      Alle · Beginner · Beginner Flow · Intermediate · Intermediate Flow · Advanced
Tag        Alle · Mo · Di · Mi · Do · Fr · Sa · So
Einstieg   Alle · Startet bald · Quereinstieg möglich
```

### Filter-Logik

1. **Vier unabhängige Gruppen, innerhalb einer Gruppe eine Auswahl.** Stil, Level, Tag und Einstieg werden mit UND verknüpft: „Salsa" und „Dienstag" zeigt nur Salsa-Kurse am Dienstag. Innerhalb einer Gruppe gilt genau ein aktiver Wert; ein zweiter Klick ersetzt den ersten. Das hält die Adresse kurz und die Bedienung vorhersehbar.
2. **`Alle` ist der Startwert jeder Gruppe** und erscheint nicht in der Adresse. Wer die Seite ohne Parameter öffnet, sieht den vollständigen Kursplan.
3. **Der Filterzustand steht in der Adresse:** `/kursplan?stil=salsa&level=beginner&tag=di&einstieg=quereinstieg`. Damit lässt sich ein gefilterter Kursplan verschicken und verlinken. Die Stilseiten und die Startseite verlinken genau so hierher.
4. **Unbekannte oder leere Parameterwerte werden ignoriert**, nicht als Fehler behandelt. Ein alter Link mit einem Stil, den es nicht mehr gibt, zeigt den vollen Plan statt einer Fehlerseite.
5. **Level-Gruppierung:** Der Filterwert `Beginner` deckt alle Beginner-Stufen ab (Stufe 1 bis 6), `Intermediate` alle Stufen 7 bis 12. Die Flow-Stufen und Advanced sind eigene Werte. So muss niemand die eigene Stufennummer kennen, um zu filtern.
6. **`Startet bald`** zeigt Kurse, deren Startdatum in der Zukunft liegt. **`Quereinstieg möglich`** zeigt laufende Kurse, bei denen der Einstieg im Kursdatensatz ausdrücklich erlaubt ist. Kurse ohne dieses Merkmal erscheinen in diesem Filter nicht.
7. **Die Filterung passiert clientseitig auf dem geladenen Kursbestand**, damit das Umschalten sofort reagiert. Die Adresse wird ohne Neuladen aktualisiert, der Zurück-Knopf des Browsers stellt den vorherigen Filterzustand wieder her.
8. **Kein Filter versteckt sich hinter einem weiteren Klick.** Auf Mobil öffnet ein Knopf ein Bottom Sheet mit allen vier Gruppen; die Trefferzahl steht im Sheet und aktualisiert sich mit.

```text
Zurücksetzen (nur sichtbar, wenn mindestens ein Filter aktiv ist): Filter zurücksetzen
```

### Anzeige der Trefferzahl

```text
<n> Kurse gefunden
```

Bei genau einem Treffer: `1 Kurs gefunden`. Bei null Treffern erscheint keine Zahlenzeile, sondern der Leer-Text aus Abschnitt 5. Kein „Ergebnis(se)" mit Klammern.

```text
Aktive Filter als Klartext neben der Zahl: Salsa · Beginner · Dienstag
Einzelner Filter entfernbar über ein X am jeweiligen Klartext-Chip.
```

---

## 5. Kursliste

Eine Karte pro Kurs. Alle Felder sichtbar ohne Klick; Felder ohne bestätigten Wert entfallen, statt leer zu erscheinen.

### Kartenfelder

| Feld | Beispielwert | Quelle | Regel |
|---|---|---|---|
| Stil und Level | `Salsa · Beginner Stufe 3` | Kursdatensatz | Pflichtfeld, immer sichtbar |
| Variante | `On2` | Kursdatensatz | nur wenn gesetzt |
| Wochentag und Zeit | `Dienstag, 19:00 – 20:00` | Kursdatensatz | Pflichtfeld |
| Start | `Beginnt am 2. September` | Startdatum | bei laufenden Kursen ersetzt durch `Läuft seit dem 2. September` |
| Dauer | `8 Lektionen, je 60 Minuten` | Kursmodell | Pflichtfeld |
| Lehrperson | `mit Claudia` | Kursdatensatz | nur mit Freigabe, siehe KP-01 |
| Ort | bestätigte Studiobezeichnung aus dem Kursdatensatz | Kursdatensatz | Pflichtfeld |
| Status | `Plätze frei` | berechnet | Pflichtfeld, siehe Statuszeilen |
| Preis | `CHF 190 für den ganzen Block` | Preistabelle | Pflichtfeld, Wert nur aus [`05-preise.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/05-preise.md) |
| CTA | `Kurs buchen` | Status | Pflichtfeld, Text folgt dem Status |

```text
Karte, ausgeschrieben

  Salsa · Beginner Stufe 3
  On2
  Dienstag, 19:00 – 20:00
  Beginnt am 2. September
  8 Lektionen, je 60 Minuten
  Elisabethenanlage 7, Studio 1
  Plätze frei
  CHF 190 für den ganzen Block
  [ Kurs buchen ]
```

Der Preis auf der Karte nennt ausschliesslich den belegten Betrag CHF 190. Studierenden-, Paar- oder Einzellektionspreise erscheinen hier nicht, solange sie nicht freigegeben sind ([`05-preise.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/05-preise.md), EINZ-01/STUD-01/PAAR-01).

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

Kein Countdown, kein „nur noch 2 Plätze" mit Ausrufezeichen, keine Anzeige, wie viele andere gerade schauen.

### Zustände der Liste

| Zustand | Sichtbarer Text |
|---|---|
| Lädt | `Kursplan wird geladen …` |
| Keine Treffer bei aktivem Filter | `Kein Kurs passt zu diesen Filtern. Setz die Filter zurück oder schreib uns auf WhatsApp — wir sagen dir, wann etwas Passendes startet.` |
| Gar keine Kurse | `Gerade läuft kein Kurs. Schreib uns auf WhatsApp, dann melden wir uns, sobald die nächste Staffel steht.` |
| Fehler | `Der Kursplan lässt sich gerade nicht laden. Versuch es in ein paar Minuten noch einmal oder schreib uns auf WhatsApp.` |

Die Leer-Texte unterscheiden zwischen „dein Filter ist zu eng" und „es gibt gerade nichts". Ein einziger Leer-Text für beide Fälle schickt Leute weg, die nur einen Haken zu viel gesetzt haben.

### Microcopy rund um den Kursplan

```text
Ergebnisüberschrift:  <Wochentag> — <n> Kurse
Filterstatus mobil:   <n> Kurse · <aktive Filter als Klartext>
Filter öffnen:        Kurse filtern
Filter anwenden:      <n> Kurse anzeigen
Filter schliessen:    Fertig
Filter entfernen:     <Filtername> entfernen
Zurücksetzen:         Filter zurücksetzen
Einstiegshilfe:       Welches Level passt zu mir?
Preislink:            Was ein Kursblock kostet
Warteliste-Knopf:     Auf die Warteliste
Quereinstieg-Knopf:   Quereinstieg anfragen
```

### Section-Spec KP01–KP05

- **KP01 Kopf:** Orientierung vor dem Werkzeug; Desktop maximal 720 px Textbreite, Mobile ohne zusätzliche CTA-Leiste. H1, Lead, Hinweis und Angst-Zeile wortgleich aus Abschnitt 3.
- **KP02 Filter:** Desktop sichtbare Reihen, Mobile Bottom Sheet mit Labels, ausgewähltem Zustand, `Filter zurücksetzen` und Ergebnis-CTA. Focus-Reihenfolge folgt Stil → Level → Tag → Einstieg.
- **KP03 Liste:** Desktop nach Uhrzeit gruppiert, Karten innerhalb der Zeitgruppe; Mobile Zeit als Gruppenüberschrift und Karten einspaltig. Loading, leer, Fehler, ausgebucht, Warteliste und Quereinstieg getrennt abbilden.
- **KP04 Erklärung:** ruhiger Textblock mit Link `/kursaufbau`; kein Kartencontainer nötig.
- **KP05 Hilfe:** H2 `Nicht sicher, welcher Kurs zu dir passt?`, Primär-CTA `Probestunde anfragen`, Sekundärlink WhatsApp; keine Preiszusage.
- **Motion-Vertrag:** Filterchip 160 ms `ease-out`; Ergebniswechsel ohne Out-Animation; Karten 450 ms, Stagger 70 ms. Reduced Motion: keine Translation und kein Stagger.
- **Mockup-Briefs:** je ein eigener Frame `KP01` bis `KP05`, Desktop 1440×900 und Mobile 390×844, Copy wortgleich aus den jeweiligen Abschnitten. Zusätzlich getrennte Mobile-Frames für Loading, keine Treffer, Fehler und ausgebucht; keine Collage.

---

## 6. Erklärzeile unter der Liste

```text
H3:   Was Quereinstieg bedeutet
Body: Quereinstieg heisst: Du kommst dazu, obwohl der Block schon läuft. Das
      geht nicht bei jedem Kurs — wo es geht, steht es direkt beim Kurs. Frag
      uns, wenn du unsicher bist, ob du noch mitkommst.

Link: Wie die Level aufgebaut sind  →  /kursaufbau
```

---

## 7. Preiszeile

```text
H3:   Was ein Kurs kostet
Body: Ein Kursblock kostet CHF 190 pro Person und umfasst 8 Lektionen zu je 60
      Minuten. Privatstunden kosten CHF 100 für eine Person und CHF 130 zu
      zweit.
Link: Alle Preise ansehen  →  /preise
```

Preis inline auf der Geld-Seite, mit Link auf `/preise` ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):271). Nur belegte Beträge.

---

## 8. Hilfe-Block

```text
Eyebrow:   HILFE BEIM EINSTIEG
H2:        Nicht sicher, welcher Kurs zu dir passt?
Body:      Schreib uns, was du bisher getanzt hast. Wir sagen dir, welcher Kurs
           passt — und wenn gerade keiner passt, sagen wir das auch.
Primary:   Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: WhatsApp schreiben
Schlusszeile: Wir freuen uns auf dich.
```

„Und wenn gerade keiner passt, sagen wir das auch" ist der Satz, der diese Seite von jeder anderen Kursliste unterscheidet. Er kostet nichts und nimmt die Sorge, in ein Verkaufsgespräch zu geraten.

---

## 9. Backend-Logik in Worten

Diese Seite ist die einzige, die schreibend mit dem Server spricht. Deshalb hier ausführlich — als Erklärung, nicht als Code.

### 9.1 Woher die Kurse kommen

Der Kursplan liest den Kursbestand des Servers. Ein Kurs erscheint, wenn er als öffentlich markiert ist und entweder in der Zukunft startet oder gerade läuft. Vergangene Kurse verschwinden von selbst; niemand muss sie von Hand entfernen. Sortiert wird nach Startdatum, danach nach Wochentag und Uhrzeit.

### 9.2 Wie der Status entsteht

Der Belegungsstatus wird beim Laden berechnet, nicht gespeichert. Der Server zählt die bestätigten Buchungen eines Kurses und vergleicht sie mit der Kapazität. Ein von Hand gepflegtes Feld „ausgebucht" würde früher oder später falsch stehen.

Bei Paartänzen zählt der Server zusätzlich getrennt, wie viele Führende und wie viele Folgende gebucht haben. Ist eine Seite deutlich voller, zeigt die Karte nur noch die andere Rolle als frei. Das ist kein Marketing-Trick, sondern der Grund, warum ein Kurs funktioniert: Ohne Balance tanzt die Hälfte an der Wand.

### 9.3 Was beim Klick auf „Kurs buchen" passiert

Der Weg führt auf `/buchung` mit dem gewählten Kurs. Dort fragt das Formular nach Name, E-Mail, Telefon und Rolle (Führen oder Folgen). Ein Kundenkonto ist **nicht** nötig und wird auch nicht angeboten — für einen Tanzkurs ein Passwort zu vergeben, ist eine Hürde ohne Gegenwert. Eine Tarifauswahl erscheint erst, wenn STUD-01 und PAAR-01 entschieden sind; bis dahin gilt der Blockpreis CHF 190.

Bevor irgendetwas kostenpflichtig wird, prüft der Server erneut, ob der Platz noch frei ist. Diese Prüfung findet serverseitig statt, weil zwei Leute gleichzeitig auf den letzten Platz klicken können. Ist der Platz weg, geht es nicht zur Zahlung, sondern zurück mit der Meldung: `Dieser Kurs ist gerade voll geworden. Möchtest du auf die Warteliste?`

### 9.4 Zahlung und Bestätigung

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

### 9.5 Warteliste

Ist ein Kurs voll, führt der CTA zur Warteliste. Dort wird nur erfasst, wer sich für welchen Kurs interessiert. Es entsteht keine Zahlung und kein Anspruch. Sichtbarer Text nach dem Absenden:

```text
Du stehst auf der Warteliste. Wir melden uns, sobald ein Platz frei wird.
```

Nicht sichtbar wird, an welcher Stelle jemand steht oder wie viele warten — das sind Angaben über andere Leute.

### 9.6 Datensparsamkeit

Die Seite zeigt nie, wer in einem Kurs angemeldet ist, wie viele Plätze genau frei sind oder wie ein Kurs im Vergleich läuft. Sichtbar ist nur, was jemand für seine eigene Entscheidung braucht.

### 9.7 Sichtbarkeit für Suchmaschinen

`/kursplan` ist eine normale, indexierbare Seite. Die Buchungsstrecke `/buchung`, `/buchung/erfolg` und `/buchung/abbruch` wird nicht indexiert ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:69)). Kurse mit bestätigtem Startdatum können strukturierte Daten bekommen — Kurse ohne Datum nicht. Weil die Kursliste clientseitig gefiltert wird, muss der vollständige Kursbestand bereits im ausgelieferten HTML stehen ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):56).

---

## 10. Bild und Alt-Text

Der Kursplan ist ein Datenwerkzeug und braucht kein Bild. Icons stehen semantisch dekorativ neben sichtbarem Text und erhalten `alt=""` beziehungsweise `aria-hidden`. Falls später doch ein Kontextbild gewünscht wird, gilt: neutral beschreiben, keine Namen, keine Rollen — zum Beispiel `Tanzende Paare in einem Studio mit Tageslicht.`

---

## 11. Interne Links

`/kursaufbau` (2×), `/preise`, `/tanzkurse`, `/tanzkurse/salsa`, `/tanzkurse/bachata`, `/tanzkurse/heels`, `/kontakt#schnupperstunde`, `/faq`.

---

## 12. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| KP-01 | Dürfen Lehrpersonen namentlich beim Kurs stehen? | Zeile entfällt |
| KP-02 | Ab wie vielen Restplätzen gilt „wenige Plätze"? | nur frei / ausgebucht |
| KA-05 | Was kostet ein Quereinstieg? | „Preis auf Anfrage" |
| ZAHL-01 | Online oder bar? | Buchung endet bei Anmeldebestätigung |
| PAAR-01 | Paarpreis | Karte zeigt nur CHF 190 pro Person |
| STUD-01 | Studierendentarif | keine zweite Preiszeile auf der Karte |

## 13. Abnahme

- Filter sind sichtbar, teilbar und zurücksetzbar; Filter-Logik in Abschnitt 4 vollständig beschrieben.
- Alle Kartenfelder sind benannt, mit Quelle und Regel.
- Vier unterschiedene Leer- und Fehlerzustände.
- Kein Status, der nicht aus echten Daten kommt.
- Keine künstliche Knappheit.
- Bestätigung nie allein aus der Browser-Rückkehr.
- Keine Fremddaten sichtbar.
- Title ≤ 60 Zeichen, Description ≤ 155 Zeichen, genau eine H1 mit „Kursplan" und „Basel".
- Nur belegte Beträge auf der Karte und in der Preiszeile.
- Seite endet mit einem warmen Schluss-Satz nach dem letzten CTA.

## 14. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Werkzeug zuerst: H1, Lead, sichtbare Filterreihen, Trefferzahl, Kurskarten. Keine dekorative Hero-Fläche, die den Plan nach unten schiebt.
- Karten zeigen Status, Preis und Buchungsweg in fester Reihenfolge; Filter auf Mobil horizontal scrollfähig, URL bleibt teilbar.

### Buttons, Hover und Icons
- Pro Karte genau ein kontextabhängiger CTA; Reset als Secondary. Hover hebt die Karte über Border/Farbe hervor, nicht über starken Schatten.
- Lucide: `Filter`, `CalendarDays`, `Clock3`, `MapPin`, `UsersRound`, `ShoppingBag`, `ListRestart`; Labels bleiben sichtbar.

### Motion und Zustände
- Filterwechsel ohne Layout-Sprung; Karten erhalten kurzen Stagger-Fade-up. Reduced Motion sofort. Loading, kein Treffer, gar keine Kurse, Fehler, ausgebucht und Warteliste explizit.

### Assets und Alt
- Keine Bilder nötig; Kursplan ist Datenwerkzeug. Icons sind semantisch dekorativ neben Text und brauchen keine Bildbeschreibung.

### Mockup-Brief
- Felder: Query-State; Filterwerte; Trefferzahl; aktive Filter-Chips; Kurskartenfelder; Status; CTA; Buchungsfehler; Zahlungs-/Webhook-Hinweis; Warteliste; Mobile; noindex für Buchungsrouten.
