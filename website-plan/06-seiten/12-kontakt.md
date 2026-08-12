# 12 — Kontakt `/kontakt` und `/kontakt/standort-raumvermietung`

**Status:** READY FOR VERIFY (Copy humanisiert 2026-08-12)
**Priorität:** P0
**Job:** Der Landeplatz für alle Probestunden-CTAs der Website. Diese Seite muss die Anfrage entgegennehmen, nicht nur eine Adresse zeigen.
**Nav-Label:** KONTAKT (Kunden-Baseline)
**Primärer CTA:** Nachricht senden

---

# A — `/kontakt`

## A.1 Meta

```text
Title:       Tanzschule Basel — Kontakt und Anfahrt | Salsaflow
             (54 Zeichen)
Description: Schreib uns oder komm vorbei: Elisabethenanlage 7, 1. Stock,
             4051 Basel, beim Bahnhof SBB. Auch per WhatsApp erreichbar.
             (128 Zeichen)
```

Der Hauptbegriff `tanzschule basel kontakt` ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):83) steht sinngemäss vorn im Title, in der H1 und im ersten Satz des Leads. Title 54 Zeichen, damit unter der Anzeigegrenze von 60.

## A.2 Sectionreihenfolge

1. Kopf
2. Kontaktformular (mit Anker `#schnupperstunde`)
3. Direkte Wege
4. Wo wir sind
5. Raumvermietung als Verweis

---

## A.3 Kopf

```text
H1:    Kontakt zur Tanzschule in Basel
Lead:  Schreib uns, was du über unsere Tanzschule in Basel wissen willst. Wir
       antworten persönlich. Wenn du dir unsicher bist, welcher Kurs passt, sag
       einfach, was du bisher getanzt hast.
Primary:   Nachricht senden   →  #anfrage
Secondary: WhatsApp schreiben
```

H1: fünf Wörter, mit Hauptbegriff und Ort ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):230-236). Der Lead trägt den Hauptbegriff im ersten Satz und kommt ohne Gedankenstrich aus.

## A.4 Kontaktformular

### Der Anker

Der Abschnitt trägt die Sprungmarke `#schnupperstunde`. Alle Probestunden-CTAs der Website landen hier ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:148-150)).

**Sitewide gilt genau dieser eine Anker.** `#probestunde` existiert nicht und wird nirgends verlinkt. Sichtbar bleibt das Label „Probestunde anfragen"; der technische Ankername ist `#schnupperstunde`, weil ihn die IA-Spec festlegt ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md):30).

Wer über diesen Anker kommt, sieht das Anliegen-Feld auf **Probestunde** vorausgewählt und darüber:

```text
H2:  Probestunde anfragen
```

Wer die Seite direkt aufruft, sieht:

```text
H2:  Schreib uns
```

Eine Seite, zwei Einstiege, kein doppelter Inhalt. Genau dafür ist ein Anker da.

### Felder

| Feld | Pflicht | Hinweis |
|---|---|---|
| Name | ja | |
| E-Mail | ja | |
| Telefon | nein | `Falls du lieber angerufen wirst.` |
| Anliegen | ja | Probestunde · Frage zu einem Kurs · Privatstunde · Show oder Animation · Raum mieten · Gutschein · Etwas anderes |
| Deine Nachricht | ja | Freitext |

Fünf Felder. Das Anliegen-Feld ersetzt fünf einzelne Formulare auf der Website und sortiert die Anfragen im Postfach.

### Feldabhängige Zusatzzeile

Bei Auswahl **Probestunde** erscheint unter dem Nachrichtenfeld:

```text
Schreib uns kurz, welcher Stil dich interessiert und ob du schon getanzt hast.
Dann sagen wir dir, in welchen Kurs du am besten reinschaust.
```

Kein zusätzliches Pflichtfeld — ein Hinweis reicht.

**Keine Aussage zum Preis der Probestunde.** „Gratis" bleibt gesperrt (S-02, [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:201-215)).

Bei Auswahl **Show oder Animation** und **Raum mieten** erscheint ein Hinweis mit Link auf die jeweilige Seite, weil dort das passendere Formular steht:

```text
Für eine Show kannst du auch direkt das Formular auf der Show-Seite nutzen —
dort fragen wir gleich die richtigen Angaben ab.
```

### Datenschutzzeile

```text
Wir verwenden deine Angaben nur, um dir zu antworten.
Mehr dazu in der Datenschutzerklärung.
```

### Zustände

| Zustand | Text |
|---|---|
| Absenden | `Wird gesendet …`, Knopf deaktiviert |
| Erfolg | `Deine Nachricht ist angekommen. Wir melden uns persönlich bei dir.` |
| Feldfehler | am Feld: `Bitte gib deine E-Mail-Adresse ein.` |
| Serverfehler | `Das hat gerade nicht geklappt. Schreib uns direkt an info@salsaflow-dc.com oder auf WhatsApp.` |

### Backend-Logik in Worten

Die Nachricht geht an `info@salsaflow-dc.com` (belegt, P04) und wird zusätzlich serverseitig gespeichert. Der Grund für das Speichern: Eine E-Mail kann im Spamfilter hängenbleiben, und eine verlorene Anfrage merkt niemand.

Das gewählte Anliegen wird in den Betreff der internen E-Mail geschrieben. Wer morgens das Postfach öffnet, sieht dann sofort, ob es um eine Probestunde oder um eine Raumanfrage geht.

Die anfragende Person bekommt eine Bestätigungs-E-Mail, die wiederholt, was sie geschrieben hat, und die Studioadresse nennt. Sie verspricht keinen Termin und nennt keine Antwortfrist, solange keine bestätigt ist.

Gegen automatisierte Einträge läuft ein serverseitiges Verfahren ohne Rätselaufgabe. Ein Captcha vor dem Kontaktformular einer Tanzschule kostet mehr Anfragen, als es Spam verhindert.

Die Erfolgsmeldung erscheint erst, wenn der Server die Anfrage angenommen hat.

---

## A.5 Direkte Wege

```text
H2:  Oder direkt
```

| | |
|---|---|
| WhatsApp | am schnellsten für kurze Fragen |
| E-Mail | info@salsaflow-dc.com |
| Fabio | +41 76 478 84 11 |
| Sebastian | +41 76 218 21 98 |

Alle vier belegt (P04, P05).

Beide Nummern gehören Privatpersonen. Deshalb steht darunter:

```text
Für Kursfragen ist WhatsApp oder das Formular der bessere Weg.
```

Das schützt die Erreichbarkeit und ist trotzdem freundlich.

### Öffnungszeiten

```text
OWNER-BLOCKER
```

Auf der Live-Kontaktseite gibt es keinen Öffnungszeiten-Block — das ist ausdrücklich als fehlend belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:38)). → **Entscheidung KON-01.**

Bis dahin steht statt einer Zeitangabe:

```text
Das Studio ist zu den Kurszeiten offen. Wann welcher Kurs stattfindet,
steht im Kursplan.
```

Das ist wahr und hilfreicher als eine erfundene Öffnungszeit. Für den Google-Unternehmenseintrag sind echte Zeiten allerdings wichtig — das ist ein eigener Punkt ausserhalb dieser Seite.

---

## A.6 Wo wir sind

```text
H2:  Elisabethenanlage 7, 4051 Basel
Body: 1. Stock, direkt beim Bahnhof Basel SBB.
```

| | |
|---|---|
| Tram | 1, 2, 8, 10, 11, 16 |
| Bus | 30, 42, 48, 50 |
| Parkplätze | wenige an der Strasse. Am nächsten: Parking Elsässertor und Parkhaus Elisabethen. |

Alles belegt (P16, [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:193-195)).

Der Hinweis auf die wenigen Strassenparkplätze ist keine Schwäche — er verhindert, dass jemand zu spät und genervt zur ersten Stunde kommt.

### Karte

Auf der Live-Seite fehlt eine Karte vollständig ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:39)). Der Relaunch bekommt eine.

**Umsetzung:** Die Karte lädt erst nach einem Klick. Vorher steht ein Standbild mit dem Knopf `Karte laden`. Grund: Eine eingebettete Karte lädt beim Seitenaufruf Daten zu einem Drittanbieter, ohne dass jemand zugestimmt hat.

```text
Knopf-Untertext: Beim Laden wird eine Verbindung zu Google Maps hergestellt.
```

Zusätzlich ein direkter Link `In Google Maps öffnen`, der ohne Einbettung funktioniert.

---

## A.7 Raumvermietung als Verweis

```text
H2:   Studio mieten
Body: Unsere beiden Räume kannst du stundenweise mieten — für Proben,
      Workshops oder eigene Kurse.
Link: Standort und Raumvermietung  →  /kontakt/standort-raumvermietung
```

---

# B — `/kontakt/standort-raumvermietung`

## B.1 Meta

```text
Title:       Studio mieten in Basel — Tanzraum stundenweise | Salsaflow
Description: Tanzraum mieten an der Elisabethenanlage 7 in Basel: zwei gleich
             grosse Räume mit Tageslicht, stundenweise. Preis auf Anfrage.
```

Eigene Suchabsicht: „Tanzraum mieten Basel", „Proberaum Basel". Diese Seite darf nicht mit `/kontakt` verschmelzen ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:166-168)).

## B.2 Kopf

```text
H1:    Studio mieten in Basel
Lead:  Zwei gleich grosse Räume mit Tageslicht an der Elisabethenanlage 7,
       im 1. Stock beim Bahnhof SBB. Stundenweise mietbar.
Primary:   Raum anfragen  →  #anfrage
```

Zwei gleich grosse Studios mit Tageslicht belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:191-192)).

### S-03 — zwei oder drei Studios?

Die Studio-Seite nennt zwei Räume, die Kurs-Seite drei ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:198)). Diese Seite sagt **zwei**, weil das die Angabe der Seite ist, die den Raum tatsächlich beschreibt. → **Entscheidung S-03**, muss vor dem Launch geklärt werden. Bis dahin steht sitewide nur die Zahl zwei — nie beide.

## B.3 Preise

| | |
|---|---|
| Montag bis Freitag, bis 17 Uhr | Preis auf Anfrage |
| Danach und am Wochenende | Preis auf Anfrage |

```text
Zeile: Schreib uns, wann und wie lange du den Raum brauchst. Dann bekommst du
       den Preis direkt von uns.
Link:  Alle Preise  →  /preise
```

Die Mietbeträge gehören nicht zu den fünf freigegebenen Zahlen ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):391-401) und stehen deshalb nirgends im Text. Der Tarifaufbau — günstiger bis 17 Uhr, teurer danach und am Wochenende — bleibt sichtbar, weil er die Anfrage steuert, ohne eine Zahl zu behaupten. → **Entscheidung STU-01.**

Sobald beide Beträge freigegeben sind, gibt es genau **eine** kanonische Quelle dafür: die Tabelle „Weitere Preise" auf `/preise` ([`05-preise.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/05-preise.md):145-173). Diese Seite zeigt dann denselben Wert, nicht ihre eigene Version.

## B.4 Ausstattung

```text
H2:  Was da ist
```

```text
Zwei gleich grosse Räume
Tageslicht
Zwei WC
Wasserspender
```

Genau diese vier Punkte sind belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:191-192)).

**Nicht aufgeführt, obwohl naheliegend:** Spiegel, Musikanlage, Umkleide, Bodenart, Quadratmeter. Nichts davon ist belegt — und genau danach fragt jeder, der einen Raum mietet. → **Entscheidung STU-01.** Diese Angaben sind der wichtigste Zusatz für diese Seite.

Bis dahin:

```text
Schreib uns, was du brauchst — dann sagen wir dir, ob der Raum passt.
```

## B.5 Anfrage

Dasselbe Formular wie auf `/kontakt`, mit **Raum mieten** vorausgewählt, plus zwei Zusatzfelder:

| Feld | Pflicht |
|---|---|
| Wann | ja — Datum und Uhrzeit, auch ungefähr |
| Wofür | ja — Freitext |

### Backend-Logik in Worten

Die Anfrage geht an dieselbe Adresse und dasselbe gespeicherte Verzeichnis wie alle anderen, aber mit eigener Kennzeichnung. Ein gemeinsames Backend ist richtig; eine gemeinsame Seite wäre falsch.

Es gibt **keinen** Verfügbarkeitskalender. Die Räume werden für Kurse gebraucht, und ein Kalender, der freie Zeiten zeigt, die dann doch belegt sind, erzeugt mehr Arbeit als er spart.

## B.6 Interne Links

`/preise`, `/kontakt`, `/tanzkurse`, `/events`.

---

## C — Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| KON-01 | Öffnungszeiten des Studios | Hinweis auf Kurszeiten |
| S-03 | Zwei oder drei Studios? | sitewide „zwei" |
| STU-01 | Ausstattung: Spiegel, Anlage, Boden, Fläche | „schreib uns"-Zeile |
| S-02 | Probestunde gratis? | ohne Preisaussage |

## D — Abnahme

- `#schnupperstunde` ist ein echter Anker mit vorausgewähltem Anliegen; sitewide existiert keine zweite Ankervariante.
- Title höchstens 60 Zeichen; Hauptbegriff `tanzschule basel kontakt` sinngemäss in Title, H1 und erstem Lead-Satz.
- Kein Mietbetrag im Text, solange er nicht freigegeben ist.
- Adresse, E-Mail und beide Nummern stimmen mit dem Rest der Website überein.
- Keine erfundenen Öffnungszeiten.
- Karte lädt erst nach Klick.
- Raumvermietung bleibt eine eigene Adresse mit eigener H1.
- Kein Verfügbarkeitskalender.
- Kein „gratis".

## 14. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Hero mit Adresse und zwei Kontaktwegen; Formular als Hauptfläche; danach direkte Wege, Anfahrt und Raumvermietungs-Verweis. Karte zunächst als Standbild mit aktivem Ladeknopf.
- `#schnupperstunde` ist ein sichtbarer Formularzustand mit vorausgewähltem Anliegen, kein eigener Seitenweg.

### Buttons, Hover und Icons
- Primary Nachricht senden, WhatsApp als Secondary. Karte `Karte laden` erst nach Klick; externer Maps-Link klar markiert.
- Lucide: `MessageCircle`, `Mail`, `Phone`, `MapPin`, `TrainFront`, `Map`, `Send`; keine Telefonnummer nur als Icon.

### Motion und Zustände
- Form-Sections mit Fade-up; Karten-Embed ohne Autoplay/Pop-in. Absenden, Erfolg, Feldfehler und Serverfehler sichtbar; Reduced Motion sofort.

### Assets und Alt
- Optionales Kontaktmotiv aus `/photos/2026/`; Anfahrts-/Eingangsfotos erst nach P-07. Karten-Standbild braucht beschreibenden Alt-Text, dekorative Grafik leer.

### Mockup-Brief
- Felder: Anliegen; vorausgewählter Hash-State; Formular; Direktwege; NAP; Karten-Consent; Loading/Success/Error; Raumvermietungslink; KON-01, S-03, STU-01, S-02.
