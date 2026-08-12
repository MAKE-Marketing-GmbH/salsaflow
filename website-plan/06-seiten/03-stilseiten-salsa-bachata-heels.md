# 03 — Stilseiten `/tanzkurse/salsa` · `/tanzkurse/bachata` · `/tanzkurse/heels`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P0
**Job:** Drei getrennte Suchabsichten bedienen. Wer „Salsa Kurs Basel" sucht, will keine Übersicht über drei Stile, sondern eine Antwort zu Salsa.
**Primärer CTA je Seite:** Kursplan für diesen Stil

---

## 0. Gemeinsame Bauform

Alle drei Seiten haben dieselbe Reihenfolge. Der Inhalt ist pro Stil verschieden — die Struktur zu wiederholen ist richtig, den Text zu wiederholen wäre ein Fehler. Zwei Seiten mit demselben Fliesstext konkurrieren in der Suche gegeneinander.

| # | Section | Frage, die sie beantwortet |
|---|---|---|
| 1 | Kopf | Was ist das und ist es was für mich? |
| 2 | Für wen | Passe ich da rein? |
| 3 | Partner | Brauche ich jemanden? |
| 4 | Level | Wo fange ich an? |
| 5 | Ablauf und Preis | Was kostet es und wie lange? |
| 6 | Nächste Kurse | Wann kann ich anfangen? |
| 7 | Nachbarstil | Vielleicht doch etwas anderes? |
| 8 | Abschluss | Wie mache ich den ersten Schritt? |

Pflicht auf jeder der drei Seiten: genau eine H1, mindestens fünf interne Links im Fliesstext, keine aus einer anderen Stilseite kopierte Formulierung.

---

# A — `/tanzkurse/salsa`

## A.1 Meta

```text
Title:       Salsa-Kurse in Basel — On1 und On2 | Salsaflow
Description: Salsa lernen in Basel: Kursblöcke über 8 Wochen, Beginner bis
             Advanced, On2 und On1. Ohne Partner möglich, direkt beim Bahnhof SBB.
```

## A.2 Kopf

```text
H1:    Salsa-Kurse in Basel
Lead:  Salsa ist schnell, drehfreudig und hat ein klares Timing. Wir unterrichten
       vor allem On2 — den New-York-Stil, bei dem der Grundschritt auf die zweite
       Zählzeit fällt — und daneben On1.
Primary:   Salsa-Kurse im Kursplan  →  /kursplan?stil=salsa
Secondary: Probestunde anfragen     →  /kontakt#schnupperstunde
```

Stil-Schwerpunkt On2 / New York belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:228-231)).

**Nicht verwendet:** Der Live-Claim, Salsaflow sei die einzige Schule in Basel mit vollem On2-Fokus (C01). Konkurrenten in Basel bieten On2 ebenfalls an — das ist ein rechtliches Risiko, kein Textproblem.

## A.3 Für wen

```text
H2:   Für wen Salsa passt
Body: Salsa braucht kein Vorwissen, aber Lust auf Tempo. Du zählst, du drehst,
      du reagierst auf jemand anderen. Wenn dir das zu schnell erscheint,
      fang mit Bachata an und komm später dazu.
```

Der Verweis auf Bachata ist keine Schwäche, sondern der ehrliche Weg. Wer im falschen Kurs landet, hört nach drei Wochen auf.

## A.4 Partner

```text
H2:   Ohne Partner? Kein Problem.
Body: Im Kurs wechseln wir regelmässig durch, du tanzt also mit verschiedenen
      Leuten. Wenn du zu zweit kommst, tanzt ihr trotzdem nicht nur miteinander —
      genau daran lernt man das Führen und Folgen.
```

Solo-Teilnahme und Lead/Follow-Balance sind in der Live-FAQ belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:174)).

## A.5 Level

```text
H2:  Wo du anfängst
```

```text
Beginner            Stufe 1 bis 6      Grundschritt, Timing, erste Drehungen
Beginner Flow                          Festigen, bevor Stufe 7 kommt
Intermediate        Stufe 7 bis 12     Kombinationen, Musikalität, Führung im Detail
Intermediate Flow                      Festigen vor Advanced
Advanced            ab Stufe 13        anspruchsvolle Figuren und eigener Ausdruck
```

Die Kurzbeschreibungen je Stufe sind eine inhaltliche Aussage der Schule und brauchen Freigabe. → **Entscheidung SAL-01**. Ohne Freigabe bleiben nur die Stufenbezeichnungen stehen.

```text
Link: Wie die Level aufgebaut sind  →  /kursaufbau
```

## A.6 Ablauf und Preis

```text
H2:  Ablauf und Preis
```

| | |
|---|---|
| Dauer | 8 Wochen, einmal pro Woche 60 Minuten |
| Preis | CHF 190, Studierende CHF 160 |
| Einzelne Lektion | CHF 30, Studierende CHF 25 |
| Ort | Elisabethenanlage 7, 1. Stock, 4051 Basel |

```text
Link: Alle Preise ansehen  →  /preise
```

## A.7 Nächste Kurse

Kursplan-Ausschnitt, auf Salsa gefiltert. Höchstens vier Karten, dann Link auf den vollen Plan.

```text
Leer: Gerade startet kein Salsa-Kurs. Schreib uns auf WhatsApp — wir sagen dir,
      wann der nächste beginnt.
```

## A.8 Nachbarstil

```text
H2:   Passt vielleicht auch
Body: Viele bei uns tanzen beides. Bachata ist langsamer und näher —
      ein guter zweiter Tanz, wenn Salsa läuft.
Link: Bachata ansehen  →  /tanzkurse/bachata
```

## A.9 Abschluss

```text
H2:       Einmal ausprobieren?
Body:     Komm in eine Probestunde. Wir schauen gemeinsam, welches Level passt.
Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
```

## A.10 Interne Links

`/kursplan` (2×), `/kursaufbau`, `/preise`, `/tanzkurse/bachata`, `/kontakt`, `/faq`, `/tanzkurse`. → 8, Ziel ist 5.

---

# B — `/tanzkurse/bachata`

## B.1 Meta

```text
Title:       Bachata-Kurse in Basel — Bachata Sensual | Salsaflow
Description: Bachata lernen in Basel: Kursblöcke über 8 Wochen, Beginner bis
             Advanced, Sensual-Stil. Ohne Partner möglich, beim Bahnhof SBB.
```

## B.2 Kopf

```text
H1:    Bachata-Kurse in Basel
Lead:  Bachata ist langsamer als Salsa und wird näher getanzt. Wir unterrichten
       Bachata Sensual — mit weichen Körperbewegungen aus der Mitte heraus statt
       vieler schneller Drehungen.
Primary:   Bachata-Kurse im Kursplan  →  /kursplan?stil=bachata
Secondary: Probestunde anfragen       →  /kontakt#schnupperstunde
```

Bachata Sensual belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:232)).

## B.3 Für wen

```text
H2:   Für wen Bachata passt
Body: Das ruhigere Tempo macht den Einstieg leichter, wenn du noch nie getanzt
      hast. Die Nähe im Paartanz gehört dazu — im Kurs wechselst du regelmässig
      den Partner, und niemand tanzt enger, als er möchte.
```

Der zweite Satz nimmt einen Einwand ernst, den fast niemand ausspricht. Ihn zu ignorieren kostet Anmeldungen.

## B.4 Partner

```text
H2:   Alleine anmelden geht
Body: Wir wechseln im Kurs durch, damit alle mit verschiedenen Leuten tanzen.
      Du musst niemanden mitbringen.
```

Andere Formulierung als auf der Salsa-Seite, gleiche Aussage — kein kopierter Text.

## B.5 Level

```text
H2:  Wo du anfängst
```

```text
Beginner            Stufe 1 bis 6
Beginner Flow
Intermediate        Stufe 7 bis 12
Intermediate Flow
Advanced            ab Stufe 13
```

```text
Zeile: Bachata folgt derselben Leiter wie Salsa. Wer beides tanzt, ist nicht
       automatisch auf beiden Seiten gleich weit — das ist normal.
Link:  Wie die Level aufgebaut sind  →  /kursaufbau
```

## B.6 Ablauf und Preis

Wie A.6.

## B.7 Nächste Kurse

Kursplan-Ausschnitt, auf Bachata gefiltert.

```text
Leer: Gerade startet kein Bachata-Kurs. Schreib uns auf WhatsApp, dann melden
      wir uns, sobald der nächste steht.
```

## B.8 Nachbarstil

```text
H2:   Passt vielleicht auch
Body: Salsa ist schneller und drehfreudiger. Die meisten, die Bachata tanzen,
      probieren es irgendwann aus.
Link: Salsa ansehen  →  /tanzkurse/salsa
```

## B.9 Abschluss

```text
H2:       Einmal ausprobieren?
Body:     In einer Probestunde findest du in einer Stunde heraus, ob es passt.
Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
```

## B.10 Interne Links

`/kursplan` (2×), `/kursaufbau`, `/preise`, `/tanzkurse/salsa`, `/kontakt`, `/faq`, `/tanzkurse`. → 8.

---

# C — `/tanzkurse/heels`

## C.1 Meta

```text
Title:       Heels-Kurse in Basel — Tanzen auf Absätzen | Salsaflow
Description: Heels-Kurse in Basel: Solo tanzen auf Absätzen, mit Haltung,
             Ausdruck und Choreografie. Beginner bis Advanced, kein Partner nötig.
```

## C.2 Kopf

```text
H1:    Heels-Kurse in Basel
Lead:  Heels tanzt du allein: Choreografie auf Absätzen, mit Haltung, Ausdruck
       und Körperspannung. Kein Führen, kein Folgen, keine Partnersuche.
Primary:   Heels-Kurse im Kursplan  →  /kursplan?stil=heels
Secondary: Probestunde anfragen     →  /kontakt#schnupperstunde
```

Heels als eigener Stil ist im Kunden-Eingang belegt ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:20)) und steht im Instagram-Profil (P18).

## C.3 Für wen

```text
H2:   Für wen Heels passt
Body: Für alle, die tanzen wollen, ohne sich mit jemandem abstimmen zu müssen.
      Du arbeitest an deiner Haltung, deinem Timing und daran, eine Bewegung
      zu Ende zu tanzen.
```

## C.4 Schuhe

Diese Section ersetzt auf der Heels-Seite die Partner-Frage. Die häufigste Sorge ist hier eine andere.

```text
H2:   Welche Schuhe du brauchst
Body: PLACEHOLDER — Absatzhöhe für den Einstieg, ob Anfängerinnen im Turnschuh
      starten dürfen, ob Schuhe zum Ausprobieren da sind.
```

→ **Entscheidung HEE-01.** Ohne Antwort steht hier nur eine Zeile: `Schreib uns vorher kurz, dann sagen wir dir, welche Schuhe für den Anfang passen.` Nichts erfinden — es geht um einen Kauf, den jemand für den Kurs tätigt.

Vorhandene Ratgeberseite `/mehr/tanzschuhe` verlinken, sofern sie belegten Inhalt hat.

## C.5 Level

```text
H2:  Wo du anfängst
```

```text
Beginner        Grundlagen, Haltung, Gehen auf Absätzen
Intermediate    längere Choreografien, mehr Tempo
Advanced        anspruchsvolle Kombinationen und eigener Ausdruck
```

Die Kurzbeschreibungen brauchen Freigabe. → **Entscheidung HEE-02.** Ohne Freigabe bleiben nur die drei Bezeichnungen.

Heels hat **keine** Stufen 1–13 — die Level-Leiter gilt für Salsa und Bachata ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:21)). Diese Unterscheidung darf im Layout nicht verwischt werden.

## C.6 Ablauf und Preis

Wie A.6, aber ohne Partner-Zeile.

## C.7 Nächste Kurse

Kursplan-Ausschnitt, auf Heels gefiltert.

```text
Leer: Gerade startet kein Heels-Kurs. Schreib uns auf WhatsApp, dann sagen wir
      dir Bescheid, sobald der nächste beginnt.
```

## C.8 Nachbarstil

```text
H2:   Passt vielleicht auch
Body: Wenn du auch im Paar tanzen willst: Bachata Sensual arbeitet mit ähnlichen
      Körperbewegungen, nur zu zweit.
Link: Bachata ansehen  →  /tanzkurse/bachata
```

## C.9 Abschluss

```text
H2:       Einmal mitmachen?
Body:     Komm in eine Probestunde und schau, ob der Stil zu dir passt.
Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
```

## C.10 Bildhinweis

Das Composite `/composites/heels-shoes-stilllife.webp` wird **nicht** verwendet. Der abgebildete Raum sieht nicht aus wie das Salsaflow-Studio, die Herkunft ist ungeklärt und EXIF-Daten fehlen vollständig — Stock oder KI-Bild ist beides möglich (L-01, [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:58-66)). Ein Bild, das als „unser Studio" gelesen wird, aber keines ist, ist eine Irreführung.

Stattdessen ein echtes Heels-Foto aus dem Bestand oder gar kein Bild.

## C.11 Interne Links

`/kursplan` (2×), `/kursaufbau`, `/preise`, `/tanzkurse/bachata`, `/mehr/tanzschuhe`, `/kontakt`, `/tanzkurse`. → 8.

---

## D — Gemeinsame Abnahme

- Drei eigene H1, drei eigene Meta-Beschreibungen, kein doppelter Fliesstext.
- Jede Seite mindestens fünf interne Links im Inhalt.
- On1/On2 nur auf der Salsa-Seite erklärt.
- Heels ohne Stufenzahlen.
- Kein „gratis", kein „einzige Schule", keine Meisterschaften.
- Keine ungeklärten Bilder (L-01).

## E — Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| SAL-01 | Stufenbeschreibungen Salsa freigegeben? | nur Bezeichnungen |
| HEE-01 | Welche Schuhe für den Einstieg? | eine Zeile „schreib uns" |
| HEE-02 | Stufenbeschreibungen Heels freigegeben? | nur Bezeichnungen |
| TK-01 | Bachata als Einsteigerstil? | Zeile B.3 entfällt |

## F. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Gemeinsames Seitenraster, aber pro Stil eigenes Hero-Bild, Lead und Akzenttext. Reihenfolge Kopf, Für wen, Partner/Schuhe, Level, Preis, Kurse, Nachbarstil, Abschluss bleibt fest.
- Preis-/Ablauf-Block zweispaltig auf Desktop, gestapelt auf Mobil; Kursplan-Ausschnitt vor Nachbarstil.

### Buttons, Hover und Icons
- Stil-spezifischer Kursplan als einziger Primary im Hero; Probestunde als Secondary. Hover: Rotwechsel, Pfeilbewegung, Fokus sichtbar.
- Lucide: `Music2` Salsa, `HeartHandshake` Bachata, `Sparkles` Heels, `Clock3`, `ArrowRight`; Icons nur als Verstärkung neben Text.

### Motion und Zustände
- Getakteter `[data-reveal]` Fade-up für Sections und Kurskarten; keine stilabhängigen Sonderanimationen. Reduced Motion sofort.
- Kursausschnitt hat Loading, leer und Fehler; Heels-Schuh-Block zeigt PLACEHOLDER/Fallback nicht als erfundene Fakten.

### Assets und Alt
- Salsa/Bachata/Heels aus den drei freigegebenen Premium-Angebotsbildern; Heels-Composite ausdrücklich nicht einsetzen. Bildgenaue Alt-Texte, keine Namen raten.

### Mockup-Brief
- Pro Route: Stil, Hero-Copy, Primärziel, Nachbarstil-Link, Level-Darstellung, Preisquelle, Kursdatenfilter, Asset/Alt, Zustände, offene Entscheidung SAL-01/HEE-01/HEE-02/TK-01.
