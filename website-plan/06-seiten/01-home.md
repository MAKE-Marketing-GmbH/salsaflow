# 01 — Home `/`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P0
**Job:** In fünf Sekunden klarmachen, was Salsaflow ist, wo es ist und wie der erste Schritt aussieht — und danach die sieben Kundenblöcke in der bestellten Reihenfolge abarbeiten.
**Suchabsicht:** Marke + „Tanzschule Basel" + „Salsa lernen Basel"
**Primärer CTA:** Probestunde anfragen
**Sekundärer CTA:** Kursplan ansehen

---

## 1. Meta

```text
Title:       Salsaflow Dance Company — Tanzschule in Basel
Description: Salsa, Bachata und Heels lernen in Basel, direkt beim Bahnhof SBB.
             Kurse in klaren Levels, Privatstunden und Danceflow Nights.
```

Beide bleiben unter der üblichen Anzeigelänge. Keine Zahl, kein Superlativ, keine Bewertung.

## 2. Sectionreihenfolge

Die Reihenfolge folgt dem Kunden-Eingang ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:44-51)). Der Hero steht davor, weil ein erster Bildschirm ohne Einstieg kein Inhaltsblock ist, sondern eine Lücke.

| # | Section | Kundenblock |
|---|---|---|
| 0 | Hero | — (Rahmen) |
| 1 | Team + kurzer Text über uns | Block 1 |
| 2 | Unser Angebot / Kurskalender | Block 2 |
| 3 | Reguläre Tanzkurse | Block 3 |
| 4 | Privatstunden | Block 4 |
| 5 | Animationen / Shows | Block 5 |
| 6 | Geschenkgutschein | Block 6 |
| 7 | News | Block 7 |
| 8 | Abschluss-CTA + Standort | — (Rahmen) |

---

## 3. Section 0 — Hero

### Copy

```text
Eyebrow (Script, Alex Brush):  Bailar es vivir.
H1:       Tanzen lernen in Basel.
Lead:     Salsa, Bachata und Heels — in klaren Levels, zwei Minuten vom Bahnhof SBB.
Primary:  Probestunde anfragen
Secondary: Kursplan ansehen
```

Warum diese H1: Sie enthält das, was Leute suchen (tanzen lernen, Basel), und behauptet nichts. „Willkommen bei Salsaflow" wäre eine verschenkte Zeile.

Der Lead nennt drei Stile und einen Ortsbezug, der überprüfbar ist. Die Elisabethenanlage 7 liegt am Bahnhof Basel SBB — belegt in [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:110-120). „Zwei Minuten" ist eine Gehzeit-Aussage: Wenn sie nicht bestätigt wird, lautet der Lead stattdessen „direkt beim Bahnhof SBB". → **Entscheidung HOME-01**.

### Bild — Hero-Gate

Der erste Paint darf nicht leer sein ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:102)). Verbindlich:

- **Motiv:** `/photos/2026/hero-paar-studiowand-01.webp` — echtes Paar in Bewegung vor der Studiowand.
- **Alt:** `Ein Paar tanzt Salsa vor der hellen Studiowand, die Frau dreht sich unter dem Arm des Partners hindurch.`
- **Ladeverhalten:** Dieses eine Bild wird bevorzugt geladen und ist im ersten Bildschirm sofort da. Kein Fade-in aus Unsichtbarkeit, kein Lazy-Loading. Wenn das Bild fehlschlägt, bleibt eine gefüllte dunkle Fläche mit dem Wortzeichen stehen — nie Weiss.
- Roter Kant-Marker am Bildrand bleibt (bestehende Idee, [`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md:88)).

### Verboten hier

Kein Autoplay-Video über den ganzen Bildschirm. Kein Text auf unruhigem Bildbereich ohne Abdunklung. Keine Zählerzahlen („500 zufriedene Tänzer").

---

## 4. Section 1 — Team und kurzer Text über uns

### Copy

```text
Eyebrow:  DAS SIND WIR
H2:       Eine Schule, die man nach zwei Wochen kennt.
Body:     Salsaflow gibt es seit 2018. Gegründet von Claudia, Fabio, Sebastian und
          Vanessa — alle vier unterrichten bis heute selbst.
          Wir arbeiten an Technik, Führen und Folgen, Musikalität und daran,
          dass du dich auf der Tanzfläche traust.
CTA:      Team kennenlernen  →  /team
```

Die H2 sagt etwas Überprüfbares über die Grösse und die Nähe der Schule, ohne „familiär" als Adjektiv zu behaupten. Wer nach zwei Wochen die Namen kennt, hat verstanden, was gemeint ist.

„Seit 2018" ist belegt (P06). Es steht bewusst nicht „seit über 20 Jahren" — das ist eine Aussage über die Tanzerfahrung des Teams, nicht über das Alter der Schule ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:207-210)).

Die vier Namen sind belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:66-73)). Rollenbezeichnung auf der Home bewusst weggelassen — „Co-Founder, School Director" viermal untereinander liest sich wie ein Impressum.

### Bild

- **Motiv:** Gruppenfoto der vier Gründerinnen und Gründer. Falls kein aktuelles Gruppenfoto freigegeben ist: vier Einzelporträts als Reihe.
- **Alt (Gruppe):** `Claudia, Fabio, Sebastian und Vanessa stehen nebeneinander im Studio.`
- **Alt (Einzel):** je `Porträt von <Vorname>, Tanzlehrerin bzw. Tanzlehrer bei Salsaflow.` — Namen nur, wenn die Zuordnung gesichert ist. Sonst `alt=""` und Name als sichtbare Bildunterschrift.

---

## 5. Section 2 — Unser Angebot / Kurskalender

### Copy

```text
Eyebrow:  UNSER ANGEBOT
H2:       Dein nächster Kurs.
Lead:     Neue Kurse starten laufend. In viele bestehende Kurse kannst du auch
          mitten im Block einsteigen — filtere nach Stil, Level und Wochentag.
Primary:  Kursplan ansehen  →  /kursplan
```

Der Quereinstieg steht hier vorne, weil der Kunde ihn ausdrücklich als Bedürfnis genannt hat ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:11)). Formulierung bewusst „in viele", nicht „in alle": Ob ein Kurs Quereinstieg erlaubt, entscheidet das Feld `allows_late_entry` pro Kurs ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md:242)).

### Inhalt

Eine kompakte Vorschau des Kursplans: die nächsten startenden Kurse als Karten, höchstens sechs, danach der Link auf den vollen Plan.

Pro Karte sichtbar: Stil, Level, Wochentag, Startdatum, Status.

### Zustände

| Zustand | Sichtbarer Text |
|---|---|
| Lädt | `Kurse werden geladen …` |
| Kurse vorhanden | Karten |
| Keine passenden Kurse | `Gerade startet kein neuer Kurs. Schreib uns auf WhatsApp — wir sagen dir, wann der nächste beginnt.` |
| Fehler | `Der Kursplan lässt sich gerade nicht laden. Versuch es später noch einmal oder schreib uns auf WhatsApp.` |

### Backend-Logik in Worten

Die Karten kommen aus dem Kursbestand des Servers, nicht aus einer gepflegten Textliste. Ein Kurs erscheint hier, wenn sein Startdatum in der Zukunft liegt oder er Quereinstieg erlaubt, und wenn er als öffentlich sichtbar markiert ist. Sortiert wird nach Startdatum, das nächste zuerst. Der Belegungsstatus („Plätze frei", „Ausgebucht") wird beim Laden aus der Zahl bestätigter Buchungen gegen die Kapazität berechnet — nicht aus einem Feld, das jemand von Hand pflegt. Steht kein Kurs zur Verfügung, wird die Leer-Zeile oben gezeigt statt die Section still auszublenden. Details: [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:550-590).

---

## 6. Section 3 — Reguläre Tanzkurse

### Copy

```text
Eyebrow:  REGULÄRE KURSE
H2:       Salsa, Bachata oder Heels?
Lead:     Ein Kursblock dauert 8 Wochen, einmal pro Woche 60 Minuten.
          Du steigst auf deinem Level ein und tanzt dich Stufe für Stufe hoch.
```

Drei Karten:

```text
Karte 1 — Salsa
  Titel:  Salsa
  Text:   Paartanz mit Drehungen und Timing. Bei uns vor allem On2,
          daneben On1. Beginner Stufe 1–6, Intermediate 7–12, Advanced ab 13.
  Link:   Salsa ansehen  →  /tanzkurse/salsa

Karte 2 — Bachata
  Titel:  Bachata
  Text:   Weicher, näher, mit Körperwellen. Sensual-Stil, gleiche Level-Leiter
          wie Salsa: Beginner 1–6, Intermediate 7–12, Advanced ab 13.
  Link:   Bachata ansehen  →  /tanzkurse/bachata

Karte 3 — Heels
  Titel:  Heels
  Text:   Solo, auf Absätzen, mit Haltung und Ausdruck. Kein Partner nötig.
          Beginner, Intermediate, Advanced.
  Link:   Heels ansehen  →  /tanzkurse/heels
```

Darunter eine Zeile zur Flow-Stufe, weil sie sonst wie ein Geheimlevel wirkt:

```text
Zwischen Beginner und Intermediate liegt jeweils ein Flow-Kurs. Dort festigst du,
was du kannst, bevor die nächste Stufe kommt.
```

Und die Sommerkurse, weil der Kunde sie ausdrücklich hervorgehoben hat:

```text
Eyebrow:  AUGUST
Zeile:    Einmal im Jahr, drei Wochen im August: unsere Sommerkurse zum
          Spezialpreis. Daten und Preis stehen im Kursplan, sobald die Staffel steht.
CTA:      Sommerkurse im Kursplan  →  /kursplan?zeitraum=sommer
```

Der Sommerpreis von CHF 100 bzw. 90 für Studierende ist zwar auf der Live-Site belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:137)), gilt aber für eine vergangene Staffel. Er wird deshalb nur aus dem Kursbestand gerendert, nicht fest in die Home geschrieben. → **Entscheidung HOME-02**.

### CTA-Disziplin

Diese Section hat drei Kartenlinks und einen Sommerkurs-Link, aber **keinen** Primary-Button. Der Primary gehört Section 2 (Kursplan) und Section 8 (Abschluss). Ein Primary pro Bildschirm ([`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md:79-81)).

---

## 7. Section 4 — Privatstunden

### Copy

```text
Eyebrow:  PRIVATSTUNDEN
H2:       Wenn es schneller gehen soll.
Lead:     Eine Lehrperson, nur für dich oder euch zu zweit. Wir arbeiten an dem,
          was gerade hakt: Timing, Führen und Folgen, oder ein Tanz für einen
          bestimmten Anlass.
CTA:      Privatstunde anfragen  →  /privatstunden
```

„Wenn es schneller gehen soll" beschreibt den echten Anlass, aus dem Leute Einzelunterricht buchen. „Ganz auf dich abgestimmt" wäre austauschbar.

„Für einen bestimmten Anlass" deckt Hochzeitstanz ab, ohne ihn als aktives Produkt zu behaupten, solange das nicht bestätigt ist ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md:116)).

### Bild — Blocker P-01

Das bestehende Privatstunden-Motiv wird **nicht** verwendet. Es zeigt vier Crops desselben Bildes mit einer jungen Frau und einem deutlich älteren Herrn in flachem Kunstlicht, ohne Bewegung — das verkauft das teuerste Produkt der Schule aktiv schlecht ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-32)).

- **Zwischenlösung, sofort einsetzbar:** `/photos/2026/hero-paar-dreh-01-portrait.webp`
- **Alt:** `Eine Tanzlehrerin führt eine Drehung mit einer Schülerin, beide im Studio.` — Alt-Text erst final, wenn das gewählte Motiv feststeht; er muss beschreiben, was tatsächlich zu sehen ist.
- **Echte Lösung:** Shooting mit einer Lehrperson und einem Paar, 45 Minuten, Tageslicht.

Solange keines von beiden vorliegt, läuft die Section **ohne Bild** als reine Textkarte. Ein falsches Bild ist schlechter als kein Bild.

---

## 8. Section 5 — Animationen und Shows

### Copy

```text
Eyebrow:  FÜR EVENTS
H2:       Tanz für deinen Anlass.
Lead:     Wir tanzen auf Firmenfeiern, Hochzeiten und Vereinsanlässen — als Show
          oder als Animation, bei der die Gäste selbst mitmachen.
CTA:      Show anfragen  →  /shows-animationen
```

Das ist ein anderes Publikum als der Rest der Seite: jemand plant ein Event und sucht einen Programmpunkt. Deshalb sachlich, kein Party-Ton, keine Kundenlogos und keine Reichweitenzahlen — dafür gibt es keinen Beleg.

### Bild

Show-Fotos aus dem Bestand. **Ausgeschlossen:** `show-04`, `show-15`, `show-22` — sie tragen fremde Wasserzeichen ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:70-73)).

- **Alt:** `Zwei Tänzerinnen und zwei Tänzer in Bühnenkleidung bei einem Auftritt.` — an das gewählte Bild anpassen.

---

## 9. Section 6 — Geschenkgutschein

### Copy

```text
Eyebrow:  GUTSCHEIN
H2:       Tanzen verschenken.
Lead:     Ein Gutschein für einen Kurs oder eine Privatstunde. Schreib uns, für wen
          und für was — wir stellen ihn aus.
CTA:      Gutschein anfragen  →  /kontakt?anliegen=gutschein
```

### PLACEHOLDER — GUT-01

Nicht bestätigt und deshalb **nicht** auf der Seite:

- Preis oder Preisstufen des Gutscheins
- Gültigkeitsdauer
- Zustellung (PDF, Post, Abholung im Studio)
- Ob man ihn online kaufen kann oder nur anfragen

Bis zur Bestätigung bleibt der Gutschein eine **Anfrage**, kein Kauf. Sobald Ablauf und Preis stehen, kann die Section auf „Gutschein kaufen" mit Checkout wechseln — das ist dann eine eigene Spec.

---

## 10. Section 7 — News

### Copy

```text
Eyebrow:  AKTUELL
H2:       Was als Nächstes ansteht.
CTA:      Alle Events ansehen  →  /events
```

Darunter zwei bis vier Einträge. Ein Eintrag besteht aus: Datum, Titel, einer Zeile, Link.

Dauerhaft belegte Einträge:

```text
Danceflow Night
  Jeden 1., 3. und 5. Freitag im Monat. Salsa- und Bachata-Floor.
  →  /events/danceflow-night

FLOWeekend
  9. und 10. Oktober 2026. Workshops und Partys.
  →  /events/floweekend
```

Beide sind belegt (P10, P11). Das Anniversary Weekend erscheint erst, wenn ein bestätigtes Datum vorliegt — die Live-Site trägt hier einen Tippfehler im Slug und eine unklare Jahreszahl ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:146)).

### Zustände

| Zustand | Sichtbarer Text |
|---|---|
| Keine kommenden Einträge | `Gerade steht kein Termin fest. Die Danceflow Night findet weiterhin jeden 1., 3. und 5. Freitag statt.` |
| Fehler | Section wird still weggelassen. Ein Fehlertext im News-Block hilft niemandem. |

### Backend-Logik in Worten

Einträge mit einem konkreten Datum werden gefiltert: Alles, was vorbei ist, verschwindet automatisch. Das ist wichtiger, als es klingt — die alte Seite trägt abgelaufene Jahreszahlen dauerhaft in der Navigation. Wiederkehrende Termine wie die Danceflow Night haben kein einzelnes Datum, sondern eine Regel; sie werden als Rhythmus angezeigt und laufen nie ab. Strukturierte Event-Daten für Google entstehen nur für Einträge mit echtem Datum ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:295-317)).

---

## 11. Section 8 — Abschluss und Standort

### Copy

```text
H2:       Komm einfach mal vorbei.
Lead:     Elisabethenanlage 7, 1. Stock, 4051 Basel — zwei Häuser vom Bahnhof SBB.
          Schreib uns, welcher Stil dich interessiert, und wir sagen dir, welcher
          Kurs gerade passt.
Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: WhatsApp schreiben
```

„Gratis" kommt hier nicht vor. Der Claim ist ungeprüft und gesperrt ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:201-215)). Sobald die Schule bestätigt, dass die erste Stunde kostenlos ist, wird der Primary zu „Gratis-Probestunde anfragen" — das ist ein Ein-Wort-Wechsel an einer Stelle. → **Entscheidung S-02**.

„Zwei Häuser vom Bahnhof" hat dieselbe Bedingung wie in Section 0: entweder belegt oder auf „direkt beim Bahnhof SBB" zurückfallen.

---

## 12. Sitewide auf dieser Seite

| Element | Verhalten |
|---|---|
| WhatsApp | Fester Knopf unten rechts, auf jeder Seite. Beschriftung `WhatsApp` mit Icon, nicht nur Icon. Öffnet einen Chat mit vorbereitetem Text: `Hallo Salsaflow, ich habe eine Frage zu` |
| Google-Bewertung | **Nicht** anzeigen. Kein Sternewidget, keine Zahl, keine Wall of Love — es gibt keinen freigegebenen Primärbeleg (P-02). Die Fläche entfällt, bis Zitate schriftlich freigegeben sind. |
| Instagram / Facebook | Im Fussbereich, nur die belegten Profile: `facebook.com/SalsaflowDC` (P17) und `@salsaflowdc` (P18). |
| Sprache | Nur Deutsch. Ein Sprachumschalter erscheint erst, wenn `/en/*` vollständig existiert. |

---

## 13. Interne Links auf dieser Seite

`/team`, `/kursplan`, `/tanzkurse/salsa`, `/tanzkurse/bachata`, `/tanzkurse/heels`, `/privatstunden`, `/shows-animationen`, `/events`, `/events/danceflow-night`, `/events/floweekend`, `/kontakt`, `/preise` (im Fussbereich und aus den Stilkarten heraus).

Damit liegt die Home über dem geforderten Wert von 13 Links im Inhalt ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:248)).

---

## 14. Offene Entscheidungen dieser Seite

| ID | Frage | Ohne Antwort |
|---|---|---|
| HOME-01 | Stimmt die Gehzeit vom Bahnhof SBB? | Fallback „direkt beim Bahnhof SBB" |
| HOME-02 | Gilt der Sommerpreis CHF 100 / 90 weiter? | Preis nur aus Kursbestand rendern |
| S-02 | Ist die Probestunde gratis? | „Probestunde anfragen" ohne Preisaussage |
| GUT-01 | Gutschein-Ablauf und Preis | Anfrage statt Kauf |
| P-01 | Privatstunden-Motiv | Section ohne Bild |
| P-02 | Review-Zitate | Wall of Love entfällt |

## 15. Abnahme

- Sieben Kundenblöcke vorhanden und in Reihenfolge.
- Genau eine H1.
- Hero zeigt sofort ein echtes Bild.
- Kein „gratis", keine Bewertung, keine erfundene Zahl.
- Genau ein Primary-CTA pro Bildschirmbereich.
- Keine gesperrte Floskel aus [`00-index.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/00-index.md) Abschnitt 3.1.

## 16. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Shell `max-w-[1400px]`, `px-5 sm:px-8`; Hero als zweispaltiger Bleed-Crop mit sofort sichtbarem Bild und rotem Kant-Marker.
- Sections 1–7 als ruhige Wechsel aus Text/Bild und Text/Kursdaten; Reihenfolge aus Abschnitt 2 bleibt unverändert. Abschluss als dunkler Kontrast-Block.
- Kurskarten maximal sechs; auf Mobil einspaltig, Filter und Status vor dem Kartenlink.

### Buttons, Hover und Icons
- Primary als Salsa-roter Pill-Button; Hover `salsa-700`, leichter Translate nach oben, sichtbarer Focus-Ring. Secondary als Textlink mit Pfeil; Hover Rot und Pfeilbewegung.
- Lucide: `ArrowUpRight` für Links, `MessageCircle` für WhatsApp, `CalendarDays` für Kursplan, `MapPin` für Standort. Icons nie allein ohne sichtbares Label.

### Motion und Zustände
- Einzige Motion-Signatur: getakteter `[data-reveal]` Fade-up mit Feder-Kurve; Hero-Bild nicht animiert einblenden. `prefers-reduced-motion`: sofort sichtbar.
- Kursvorschau deckt Laden, leer, Fehler und Status `Plätze frei`/`Ausgebucht` ab; Bildfehler zeigt gefüllte dunkle Fallback-Fläche, nie Weiss.

### Assets und Alt
- Hero `/photos/2026/hero-paar-studiowand-01.webp`; Teamfoto aus freigegebenem Bestand; Kurse `/photos/premium/offer-salsa-1200.webp`, `offer-bachata-1200.webp`, `offer-heels-1200.webp`; Privatstunden nur Ersatzmotiv aus P-01 oder ohne Bild.
- Alt-Texte bildgenau nach [`02-asset-inventar.md`](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md:190-210); dekorative Marker `alt=""`.

### Mockup-Brief
- Felder: Route und Viewport; Section-Reihenfolge; H1/Lead; Primary/Secondary; Asset-Pfad und Alt; Daten-/Leer-/Fehlerzustand; Icon; Hover/Focus; Motion; offene Entscheidung/Gate.
- Abnahmebild: erster Paint gefüllt, sieben Kundenblöcke sichtbar, WhatsApp sitewide, kein Review-Badge.
