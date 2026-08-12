# 03 — Stilseiten `/tanzkurse/salsa` · `/tanzkurse/bachata` · `/tanzkurse/heels`

**Status:** FINAL v2 (2026-08-12)
**Priorität:** P0
**Job:** Drei getrennte Suchabsichten bedienen. Wer „Salsa Kurs Basel" sucht, will keine Übersicht über drei Stile, sondern eine Antwort zu Salsa.
**Primärer CTA je Seite:** Kursplan für diesen Stil
**Sprachvertrag:** [05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md) FINAL v2 — Du-Form, Slop-Verbotsliste, Angst-Block über der Falz, Preis inline
**Keyword-Map:** [04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):52–54 — `salsa kurs basel` · `bachata kurs basel` · `heels kurs basel`
**Konkurrenz-Massnahmen umgesetzt:** [04d-seo-konkurrenz.md](/root/clients/salsaflow-dc/website-plan/04d-seo-konkurrenz.md) Nr. 3, 4, 5, 9 — Tiefe, FAQPage je Stil-URL, Title-Muster, Inline-Preis

---

## 0. Gemeinsame Bauform

Alle drei Seiten haben dieselbe Reihenfolge. Der Inhalt ist pro Stil verschieden — die Struktur zu wiederholen ist richtig, den Text zu wiederholen wäre ein Fehler. Zwei Seiten mit demselben Fliesstext konkurrieren in der Suche gegeneinander.

| # | Section | Frage, die sie beantwortet |
|---|---|---|
| 1 | Kopf | Was ist das und ist es was für mich? |
| 2 | Für wen | Passe ich da rein? |
| 3 | Partner (Heels: Schuhe) | Brauche ich jemanden? |
| 4 | Level | Wo fange ich an? |
| 5 | Ablauf und Preis | Was kostet es und wie lange? |
| 6 | Nächste Kurse | Wann kann ich anfangen? |
| 7 | Stil-FAQ | Was will ich noch wissen, bevor ich anfrage? |
| 8 | Nachbarstil | Vielleicht doch etwas anderes? |
| 9 | Abschluss | Wie mache ich den ersten Schritt? |

Pflicht auf jeder der drei Seiten: genau eine H1, mindestens fünf interne Links im Fliesstext, keine aus einer anderen Stilseite kopierte Formulierung, ein Angst-Block (kein Partner, keine Vorkenntnisse, Probestunde) oberhalb der Falz, Einstiegspreis inline mit Link auf `/preise`, FAQ-Block mit `FAQPage`-Markup auf der jeweiligen Stil-URL.

**Preis-Regel für diese drei Seiten:** Im Text erscheint ausschliesslich CHF 190 für die Staffel mit 8 Lektionen. Studierendentarif, Einzellektion und Sommerpreis stehen im Dossier, sind aber nicht als belegte Website-Zahlen freigegeben ([05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):401). Die Preistabellen nennen dafür keinen Betrag und kein Statuswort, sondern nur die Zeile „Weitere Tarife: alle bestätigten Preise ansehen" mit Link auf `/preise`. Interne Statuswörter werden nicht ausgeliefert.

---

# A — `/tanzkurse/salsa`

## A.1 Meta

```text
Title:       Salsa Kurs Basel — On2 tanzen lernen | Salsaflow
             (48 Zeichen)
Description: Salsa lernen in Basel, beim Bahnhof SBB: 8 Wochen, je 60 Minuten,
             ab CHF 190. On2 und On1, Beginner bis Advanced, auch ohne Partner.
             (132 Zeichen)
```

Title-Muster nach [04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):184 — Hauptbegriff vorn, Marke hinten, keine Superlative. Description mit belegter Zahl und nächstem Schritt nach [05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):273.

## A.2 Kopf

```text
Eyebrow:  SALSA · ON2 UND ON1

H1:       Salsa lernen in Basel

Lead:     Salsa tanzen lernst du in Basel bei uns an der Elisabethenanlage 7,
          zwei Gehminuten vom Bahnhof SBB. Ein Kursblock dauert 8 Wochen mit je
          60 Minuten und kostet CHF 190. Du brauchst keinen Partner und keine
          Vorkenntnisse — Beginner Stufe 1 fängt bei null an.

Primary:   Salsa-Kurse im Kursplan  →  /kursplan?stil=salsa
Secondary: Probestunde anfragen     →  /kontakt#schnupperstunde

Microcopy unter den Buttons:
          Du schreibst uns, wir sagen dir, welcher Kurs gerade zu dir passt.
```

Der Hauptbegriff `salsa kurs basel` steht in Title, H1 und im ersten Satz des Leads — grammatikalisch tragend, nicht als Einschub ([05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):254-260). Der Angst-Block sitzt damit bereits im Lead und wird in A.4 ausgeführt.

Stil-Schwerpunkt On2 / New York belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:208)). Adresse und Lage belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:30), :189-190).

**Nicht verwendet:** Der Live-Claim, Salsaflow sei die einzige Schule in Basel mit vollem On2-Fokus (C01). Konkurrenten in Basel bieten On2 ebenfalls an — das ist ein rechtliches Risiko, kein Textproblem.

**Bild + Alt (Hero):**

```text
Bild: Gruppenkurs Salsa vor der Spiegelwand (Shot S-02, [02b-asset-gaps.md]).
      Bis zum Shooting: freigegebenes Premium-Angebotsbild Salsa
      (`offer-salsa-1200.webp`) — es zeigt zwei Tanzende, keinen Kurs.
Alt (bis zum Shooting, zum Bestandsbild):
      Zwei Menschen tanzen Salsa vor der Spiegelwand im Studio.
Alt (nach dem Shooting, zu S-02):
      Eine Gruppe übt den Salsa-Grundschritt in Paaren vor der Spiegelwand.
```

## A.3 Was Salsa ist

```text
Eyebrow:  KURZ ERKLÄRT

H2:       Was Salsa eigentlich ist

Lead:     Salsa ist ein Paartanz zu schneller Musik mit acht Zählzeiten und
          einem festen Grundschritt. Einer führt, eine folgt — und beide können
          beides lernen.

Body:     Der Rhythmus wiederholt sich alle acht Schläge. Darauf legst du den
          Grundschritt, dann Drehungen, dann Figuren, die aus dem Grundschritt
          herauswachsen. Genau deshalb kannst du bei null anfangen: Du lernst
          eine Bewegung und baust alles Weitere darauf auf.

          Wir unterrichten vor allem On2, den New-York-Stil. Der Grundschritt
          beginnt dabei auf der zweiten Zählzeit statt auf der ersten. Das
          klingt nach einer Kleinigkeit, verändert aber das Gefühl: Der Tanz
          liegt näher an der Percussion und wirkt ruhiger, obwohl die Musik
          schnell ist. On1 unterrichten wir daneben — welche Variante ein Kurs
          hat, steht bei jedem Kurs im Kursplan.

Bullets:
          - Musik: schnell, klarer Achter-Rhythmus
          - Rolle: Führen oder Folgen, beides lernbar
          - Unser Schwerpunkt: On2, New York Style
          - Auch im Angebot: On1
          - Erstes Ziel: Grundschritt, Timing, erste Drehung

Link:     Wie ein Kursblock aufgebaut ist  →  /kursaufbau
```

Fachbegriff On2 ist im Satz übersetzt, nicht vorausgesetzt ([05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):54). Der Definitions-Satz am Abschnittsanfang ist AEO-Futter: Er kann allein zitiert werden ([04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):341-349).

## A.4 Für wen Salsa passt

```text
H2:       Für wen Salsa passt

Lead:     Salsa passt dir, wenn du Tempo magst und Lust hast, dich auf jemand
          anderen einzustellen. Vorwissen brauchst du keines.

Body:     Du zählst, du drehst, du reagierst auf einen anderen Menschen. Am
          Anfang fühlt sich das nach viel gleichzeitig an. Nach zwei, drei
          Abenden macht der Körper den Grundschritt von allein, und der Kopf
          wird frei für den Rest.

          Wenn dir das Tempo zu hoch erscheint, fang mit Bachata an. Bachata
          ist langsamer, der Einstieg fällt vielen leichter, und du kannst
          später jederzeit dazukommen. Wer im falschen Kurs landet, hört nach
          drei Wochen auf — deshalb sagen wir das lieber vorher.

Gut zu wissen:
          Turnschuhe reichen für den Anfang. Tanzschuhe brauchst du erst,
          wenn du merkst, dass du dabeibleibst.

Link:     Bachata ansehen  →  /tanzkurse/bachata
```

Der Verweis auf Bachata ist keine Schwäche, sondern der ehrliche Weg. → **Entscheidung TK-01** (Bachata offiziell als Einsteigerstil positionieren?). Ohne Freigabe bleibt der Absatz als Tempo-Hinweis stehen, ohne Bachata als „Einsteigerkurs" zu bezeichnen.

## A.5 Ohne Partner

```text
H2:       Ohne Partner? Kein Problem.

Lead:     Du kannst dich allein anmelden. Im Kurs wechseln wir regelmässig
          durch, du tanzt also mit verschiedenen Leuten.

Body:     Das ist kein Notbehelf, sondern der schnellere Weg. Wer immer mit
          derselben Person tanzt, gewöhnt sich an genau diese Person. Wer
          wechselt, lernt zu führen und zu folgen, statt eine Abmachung
          auswendig zu können.

          Kommt ihr zu zweit, tanzt ihr trotzdem nicht nur miteinander. Das
          fühlt sich am ersten Abend ungewohnt an und ist nach dem zweiten
          selbstverständlich.

Bullets:
          - Anmeldung: allein oder zu zweit, beides normal
          - Im Kurs: regelmässiger Partnerwechsel
          - Rolle: du wählst Führen oder Folgen
          - Niemand tanzt enger, als er möchte
```

Solo-Teilnahme und Lead/Follow-Balance sind in der Live-FAQ belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:179)).

## A.6 Level

```text
Eyebrow:  DEIN EINSTIEG

H2:       Wo du anfängst

Lead:     Salsa und Bachata teilen bei uns dieselbe Level-Leiter, von Beginner
          Stufe 1 bis Advanced ab Stufe 13. Du steigst dort ein, wo du gerade
          stehst — und wenn du unsicher bist, findest du es in einer
          Probestunde heraus.
```

| Level | Stufen | Wo du gerade stehst |
|---|---|---|
| Beginner | Stufe 1 bis 6 | Noch nie Salsa getanzt? Hier lernst du Grundschritt, Timing und die ersten Drehungen. |
| Beginner Flow | — | Du kennst die Grundschritte und willst sie endlich flüssig tanzen, bevor Stufe 7 kommt. |
| Intermediate | Stufe 7 bis 12 | Der Grundschritt sitzt. Jetzt kommen Kombinationen und die Feinheiten beim Führen und Folgen. |
| Intermediate Flow | — | Sicher unterwegs, aber es soll leichter aussehen: festigen, bevor es anspruchsvoller wird. |
| Advanced | ab Stufe 13 | Schwierige Figuren, Timing-Spiele und dein eigener Ausdruck. |

```text
Body nach der Tabelle:
          Flow ist keine Sonderstufe und kein Geheimkurs. Es ist eine Runde
          zum Festigen zwischen zwei Blöcken — damit du nicht aufsteigst,
          bevor du dich sicher fühlst.

Microcopy:
          Nicht sicher, welches Level passt? Schreib uns kurz, wir ordnen
          dich ein.

Link:     Wie die Level aufgebaut sind  →  /kursaufbau
```

Levelnamen und Leiter belegt ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md):370-390, [`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md):21). Die Zustands-Sätze in der rechten Spalte sind eine inhaltliche Aussage der Schule und brauchen Freigabe → **Entscheidung SAL-01**. Ohne Freigabe bleiben Level und Stufen stehen, die rechte Spalte entfällt.

## A.7 Ablauf und Preis

```text
Eyebrow:  ABLAUF UND PREIS

H2:       Was ein Salsa-Kurs kostet

Lead:     Ein Salsa-Kursblock dauert 8 Wochen, einmal pro Woche 60 Minuten,
          immer am gleichen Wochentag. Der Block kostet CHF 190 pro Person.
```

| | |
|---|---|
| Dauer | 8 Wochen, einmal pro Woche 60 Minuten |
| Preis | CHF 190 pro Person und Block |
| Ort | Elisabethenanlage 7, 1. Stock, 4051 Basel |
| Anreise | zwei Gehminuten vom Bahnhof Basel SBB, Tram 1, 2, 8, 10, 11, 16 |
| Anmeldung | allein oder zu zweit |
| Weitere Tarife | Alle bestätigten Preise ansehen → `/preise` |

```text
Body:     Der gleiche Wochentag ist Absicht: Du planst den Kurs einmal ein und
          musst dich danach nicht mehr entscheiden.

Link:     Alle Preise ansehen  →  /preise
```

Preis CHF 190 und Format 8×60 Minuten belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:140), :154). Struktur vor Preis nach [05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):49. Studierenden- und Einzellektionspreise stehen im Dossier, sind aber nicht in der freigegebenen Preisliste ([05b-copy-style.md](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md):391-401). Deshalb steht in der Zeile „Weitere Tarife" kein Betrag, sondern der Link auf `/preise`.

## A.8 Nächste Kurse

```text
Eyebrow:  NÄCHSTE KURSE

H2:       Wann du einsteigen kannst

Lead:     Hier siehst du die Salsa-Kurse, die als Nächstes starten. Neue Blöcke
          beginnen laufend.
```

Kursplan-Ausschnitt, auf Salsa gefiltert. Höchstens vier Karten, dann Link auf den vollen Plan.

```text
Laden:  Salsa-Kurse werden geladen …
Leer:   Gerade startet kein Salsa-Kurs. Schreib uns auf WhatsApp — wir sagen
        dir, wann der nächste beginnt.
Fehler: Die Kurse konnten nicht geladen werden. Versuch es bitte nochmal oder
        schreib uns direkt.

Link:   Alle Salsa-Kurse im Kursplan  →  /kursplan?stil=salsa
```

## A.9 Stil-FAQ

Vier Fragen, `FAQPage`-Markup auf dieser URL, nicht nur auf `/faq` ([04d-seo-konkurrenz.md](/root/clients/salsaflow-dc/website-plan/04d-seo-konkurrenz.md):77). Jede Antwort beginnt mit der Antwort.

```text
H2:  Häufige Fragen zu Salsa
```

**H3: Was ist der Unterschied zwischen Salsa On1 und On2?**

> Bei On1 beginnt der Grundschritt auf der ersten Zählzeit, bei On2 auf der zweiten. On2 ist der New-York-Stil und liegt näher an der Percussion, deshalb wirkt er ruhiger, obwohl die Musik gleich schnell ist. Bei uns liegt der Schwerpunkt auf On2, On1 bieten wir daneben an. Für den Einstieg musst du dich nicht entscheiden — du lernst zuerst den Grundschritt, alles andere kommt danach.

**H3: Brauche ich für den Salsa-Kurs einen Partner?**

> Nein. Du meldest dich allein an und tanzt im Kurs mit wechselnden Leuten. Wir achten darauf, dass Führen und Folgen einigermassen ausgeglichen besetzt sind. Wenn du zu zweit kommst, wechselt ihr trotzdem mit — genau daran lernt man das Führen und Folgen.

**H3: Wie lange dauert ein Salsa-Kurs und was kostet er?**

> Ein Kursblock dauert 8 Wochen mit je 60 Minuten pro Woche und kostet CHF 190 pro Person. Der Unterricht findet immer am gleichen Wochentag statt, an der Elisabethenanlage 7 beim Bahnhof Basel SBB. Alle weiteren Tarife stehen auf der Preisseite.

**H3: Ich habe noch nie getanzt. Ist Salsa dafür zu schwer?**

> Nein, Beginner Stufe 1 startet bei null und setzt nichts voraus. Du lernst zuerst den Grundschritt, dann das Timing, dann die erste Drehung. Die meisten in diesem Kurs stehen zum ersten Mal auf einer Tanzfläche. Wenn du es zuerst anschauen willst, frag eine Probestunde an.

```text
Link nach dem FAQ-Block:  Alle Fragen und Antworten  →  /faq
```

## A.10 Nachbarstil

```text
H2:   Passt vielleicht auch

Body: Viele bei uns tanzen beides. Bachata ist langsamer und wird näher
      getanzt — ein guter zweiter Tanz, sobald Salsa läuft.

Link: Bachata-Kurse ansehen  →  /tanzkurse/bachata
```

## A.11 Abschluss

```text
Eyebrow:  ERSTER SCHRITT

H2:       Einmal ausprobieren?

Body:     Such dir einen Salsa-Kurs aus und frag eine Probestunde an. Wir
          schauen gemeinsam, welches Level zu dir passt, und du entscheidest
          danach.

Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: Salsa-Kurse im Kursplan  →  /kursplan?stil=salsa

Schluss-Satz: Wir freuen uns auf dich.
```

CTA-Wortlaut „Probestunde anfragen" ist gesetzt, bis S-02 („erste Stunde gratis") vom Kunden bestätigt ist ([04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):215, :490).

## A.12 Interne Links

`/kursplan` (3×), `/kursaufbau` (2×), `/preise`, `/tanzkurse/bachata` (2×), `/kontakt`, `/faq`. → 11 Links im Fliesstext, Ziel ist 5 ([04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):243).

---

# B — `/tanzkurse/bachata`

## B.1 Meta

```text
Title:       Bachata Kurs Basel — Sensual lernen | Salsaflow
             (47 Zeichen)
Description: Bachata lernen in Basel, beim Bahnhof SBB: 8 Wochen, je 60 Minuten,
             ab CHF 190. Bachata Sensual von Beginner bis Advanced, auch allein.
             (135 Zeichen)
```

## B.2 Kopf

```text
Eyebrow:  BACHATA · SENSUAL

H1:       Bachata lernen in Basel

Lead:     Bachata tanzen lernst du in Basel bei uns an der Elisabethenanlage 7,
          gleich beim Bahnhof SBB. Ein Kursblock dauert 8 Wochen mit je 60
          Minuten und kostet CHF 190. Anmelden kannst du dich allein, Erfahrung
          brauchst du keine.

Primary:   Bachata-Kurse im Kursplan  →  /kursplan?stil=bachata
Secondary: Probestunde anfragen       →  /kontakt#schnupperstunde

Microcopy unter den Buttons:
          Sag uns, wie viel du schon getanzt hast — wir schlagen dir den
          passenden Kurs vor.
```

Bachata Sensual belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:209)).

**Bild + Alt (Hero):**

```text
Bild: Gruppenkurs Bachata in geschlossener Haltung (Shot S-03,
      [02b-asset-gaps.md]). Bis zum Shooting: freigegebenes Premium-
      Angebotsbild Bachata (`offer-bachata-1200.webp`) — ein Paar, kein Kurs.
Alt (bis zum Shooting, zum Bestandsbild):
      Ein Paar tanzt Bachata in geschlossener Haltung im warmen Studiolicht.
Alt (nach dem Shooting, zu S-03):
      Mehrere Paare tanzen Bachata in geschlossener Haltung im Studio.
```

## B.3 Was Bachata ist

```text
Eyebrow:  KURZ ERKLÄRT

H2:       Was Bachata Sensual ausmacht

Lead:     Bachata ist ein Paartanz aus der Dominikanischen Republik mit vier
          Zählzeiten und einer kleinen Hüftbewegung auf dem vierten Schlag.
          Bachata Sensual ist die Variante, die wir unterrichten.

Body:     Der Grundschritt ist schnell gelernt: drei Schritte zur Seite, dann
          ein Tippen. Genau deshalb steht man in Bachata oft schon in der
          ersten Stunde zu zweit auf der Fläche und tanzt etwas, das sich nach
          Tanzen anfühlt.

          Sensual heisst: weiche Bewegungen aus der Körpermitte, Wellen im
          Oberkörper, ruhige Gewichtsverlagerungen. Statt vieler schneller
          Drehungen arbeitest du an Verbindung und Kontrolle. Wer die
          dominikanische Bachata kennt, merkt den Unterschied sofort — dort
          liegt mehr Betonung auf Fussarbeit und Tempo.

Bullets:
          - Musik: langsamer als Salsa, Vier-Schlag-Rhythmus
          - Grundschritt: drei Schritte, ein Tippen
          - Unser Stil: Bachata Sensual
          - Fokus: Körperbewegung, Verbindung, Kontrolle
          - Erstes Ziel: Grundschritt, Haltung, erste Drehung

Link:     Wie ein Kursblock aufgebaut ist  →  /kursaufbau
```

## B.4 Für wen Bachata passt

```text
H2:       Für wen Bachata passt

Lead:     Bachata passt dir, wenn du langsam anfangen willst und Musik magst,
          bei der man mehr fühlt als zählt.

Body:     Das ruhigere Tempo macht den Einstieg leichter, wenn du noch nie
          getanzt hast. Du hast mehr Zeit pro Schritt, und Fehler fallen weniger
          ins Gewicht als bei einem schnellen Tanz.

          Die Nähe im Paartanz gehört dazu, und darüber reden wir offen. Im
          Kurs wechselst du regelmässig den Partner, die Haltung zeigen wir
          Schritt für Schritt, und niemand tanzt enger, als er möchte. Wenn
          dir etwas unangenehm ist, sag es uns — das ist keine grosse Sache.

Gut zu wissen:
          Für den Anfang reichen Schuhe mit glatter Sohle. Wir sagen dir im
          Kurs, worauf du beim Kauf achten solltest, falls du dabeibleibst.

Link:     Salsa-Kurse ansehen  →  /tanzkurse/salsa
```

Der Nähe-Absatz nimmt einen Einwand ernst, den fast niemand ausspricht. Ihn zu ignorieren kostet Anmeldungen. → **Entscheidung TK-01**: Ohne Freigabe entfällt die ausdrückliche Einsteiger-Positionierung im Lead und der Abschnitt beginnt mit „Bachata passt dir, wenn du Musik magst, bei der man mehr fühlt als zählt."

## B.5 Ohne Partner

```text
H2:       Allein anmelden geht

Lead:     Du musst niemanden mitbringen. Wir wechseln im Kurs durch, damit
          alle mit verschiedenen Leuten tanzen.

Body:     Bei Bachata hilft der Wechsel besonders: Der Tanz lebt von der
          Verbindung, und die entsteht anders, wenn du sie mit mehreren Leuten
          übst. Du merkst schnell, dass es nicht an dir liegt, wenn eine Figur
          einmal nicht klappt.

Bullets:
          - Anmeldung: allein oder zu zweit
          - Im Kurs: regelmässiger Partnerwechsel
          - Rolle: Führen oder Folgen, du entscheidest
          - Nähe: nur so viel, wie für dich stimmt
```

Andere Formulierung als auf der Salsa-Seite, gleiche Aussage — kein kopierter Text.

## B.6 Level

```text
Eyebrow:  DEIN EINSTIEG

H2:       Wo du anfängst

Lead:     Bachata folgt bei uns derselben Level-Leiter wie Salsa: Beginner
          Stufe 1 bis 6, Beginner Flow, Intermediate Stufe 7 bis 12,
          Intermediate Flow, Advanced ab Stufe 13.
```

| Level | Stufen | Wo du gerade stehst |
|---|---|---|
| Beginner | Stufe 1 bis 6 | Du fängst bei null an: Grundschritt, Haltung, erste Drehungen. |
| Beginner Flow | — | Die Schritte sitzen, jetzt geht es um Fluss statt um Zählen. |
| Intermediate | Stufe 7 bis 12 | Sicher im Grundschritt? Jetzt kommen Körperbewegung, Kombinationen und Musikalität dazu. |
| Intermediate Flow | — | Festigen, bevor der anspruchsvolle Teil kommt. |
| Advanced | ab Stufe 13 | Anspruchsvolle Figuren und dein eigener Ausdruck. |

```text
Body nach der Tabelle:
          Wer Salsa und Bachata tanzt, ist selten in beiden gleich weit. Das
          ist normal und kein Rückschritt — die Tänze fordern
          Unterschiedliches.

Microcopy:
          Unsicher beim Level? Frag eine Probestunde an, dann ordnen wir dich
          direkt ein.

Link:     Wie die Level aufgebaut sind  →  /kursaufbau
```

Leiter belegt ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md):370-390). Zustands-Sätze in der rechten Spalte fallen unter **SAL-01** (gleiche Freigabe wie Salsa).

## B.7 Ablauf und Preis

```text
Eyebrow:  ABLAUF UND PREIS

H2:       Was ein Bachata-Kurs kostet

Lead:     Ein Bachata-Kursblock dauert 8 Wochen, einmal pro Woche 60 Minuten,
          immer am gleichen Wochentag. Der Block kostet CHF 190 pro Person.
```

| | |
|---|---|
| Dauer | 8 Wochen, einmal pro Woche 60 Minuten |
| Preis | CHF 190 pro Person und Block |
| Ort | Elisabethenanlage 7, 1. Stock, 4051 Basel |
| Anreise | zwei Gehminuten vom Bahnhof Basel SBB, Tram 1, 2, 8, 10, 11, 16 |
| Anmeldung | allein oder zu zweit |
| Weitere Tarife | Alle bestätigten Preise ansehen → `/preise` |

```text
Body:     Salsa und Bachata kosten gleich viel. Wenn du beides tanzen willst,
          buchst du zwei Blöcke — welche Kombination gerade läuft, siehst du
          im Kursplan.

Link:     Alle Preise ansehen  →  /preise
```

## B.8 Nächste Kurse

```text
Eyebrow:  NÄCHSTE KURSE

H2:       Wann du einsteigen kannst

Lead:     Das sind die Bachata-Kurse, die als Nächstes beginnen.
```

Kursplan-Ausschnitt, auf Bachata gefiltert. Höchstens vier Karten.

```text
Laden:  Bachata-Kurse werden geladen …
Leer:   Gerade startet kein Bachata-Kurs. Schreib uns auf WhatsApp, dann melden
        wir uns, sobald der nächste steht.
Fehler: Die Kurse konnten nicht geladen werden. Versuch es bitte nochmal oder
        schreib uns direkt.

Link:   Alle Bachata-Kurse im Kursplan  →  /kursplan?stil=bachata
```

## B.9 Stil-FAQ

`FAQPage`-Markup auf dieser URL.

```text
H2:  Häufige Fragen zu Bachata
```

**H3: Was ist Bachata Sensual?**

> Bachata Sensual ist die Variante der Bachata, die mit weichen Körperbewegungen aus der Mitte arbeitet — Wellen im Oberkörper, ruhige Gewichtsverlagerungen, viel Verbindung zwischen den Tanzenden. Sie ist in Europa entstanden und unterscheidet sich von der dominikanischen Bachata, bei der Fussarbeit und Tempo stärker im Vordergrund stehen. Bei uns liegt der Schwerpunkt auf Sensual.

**H3: Ist Bachata leichter zu lernen als Salsa?**

> Der Grundschritt der Bachata ist schneller gelernt: drei Schritte zur Seite, ein Tippen, dazu langsamere Musik. Dafür braucht die sensuelle Körperbewegung Zeit und Übung. Viele fangen mit Bachata an und nehmen Salsa später dazu — beides gleichzeitig geht auch.

**H3: Muss ich beim Bachata-Kurs eng tanzen?**

> Nein. Du bestimmst selbst, wie viel Nähe für dich stimmt, und wir zeigen die Haltung Schritt für Schritt. Im Kurs wechseln alle regelmässig den Partner, und wenn dir etwas unangenehm ist, sagst du es uns einfach. Bachata funktioniert auch mit Abstand.

**H3: Was kostet ein Bachata-Kurs in Basel?**

> Ein Kursblock kostet CHF 190 pro Person und umfasst 8 Wochen mit je 60 Minuten. Der Unterricht findet an der Elisabethenanlage 7 beim Bahnhof Basel SBB statt, immer am gleichen Wochentag. Alle weiteren Tarife stehen auf der Preisseite.

```text
Link nach dem FAQ-Block:  Alle Fragen und Antworten  →  /faq
```

## B.10 Nachbarstil

```text
H2:   Passt vielleicht auch

Body: Salsa ist schneller und drehfreudiger. Die meisten, die Bachata tanzen,
      probieren es irgendwann aus — spätestens auf der Tanzfläche, wo beide
      Stile laufen.

Link: Salsa-Kurse ansehen  →  /tanzkurse/salsa
```

## B.11 Abschluss

```text
Eyebrow:  ERSTER SCHRITT

H2:       Einmal ausprobieren?

Body:     In einer Probestunde findest du in einer Stunde heraus, ob Bachata
          zu dir passt. Such dir einen Kurs aus, frag an, und den Rest
          besprechen wir persönlich.

Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: Bachata-Kurse im Kursplan  →  /kursplan?stil=bachata

Schluss-Satz: Wir freuen uns auf dich.
```

## B.12 Interne Links

`/kursplan` (3×), `/kursaufbau` (2×), `/preise`, `/tanzkurse/salsa` (2×), `/kontakt`, `/faq`. → 11.

---

# C — `/tanzkurse/heels`

## C.1 Meta

```text
Title:       Heels Kurs Basel — Tanzen auf Absätzen | Salsaflow
             (50 Zeichen)
Description: Heels lernen in Basel, beim Bahnhof SBB: solo tanzen auf Absätzen,
             8 Wochen ab CHF 190. Beginner bis Advanced, kein Partner nötig.
             (130 Zeichen)
```

## C.2 Kopf

```text
Eyebrow:  HEELS · SOLO

H1:       Heels lernen in Basel

Lead:     Heels tanzt du allein: Choreografie auf Absätzen, mit Haltung,
          Ausdruck und Körperspannung. Unsere Heels-Kurse laufen an der
          Elisabethenanlage 7 beim Bahnhof SBB, 8 Wochen zu je 60 Minuten,
          ab CHF 190. Du brauchst keinen Partner und keine Vorkenntnisse.

Primary:   Heels-Kurse im Kursplan  →  /kursplan?stil=heels
Secondary: Probestunde anfragen     →  /kontakt#schnupperstunde

Microcopy unter den Buttons:
          Schreib uns vorher kurz, dann sagen wir dir, welche Schuhe für den
          Anfang passen.
```

Heels als eigener Stil ist im Kunden-Eingang belegt ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:20)) und steht im Instagram-Profil (P18).

**Bild + Alt (Hero):**

```text
Bild: Heels-Gruppe in einer Choreografie (Shot S-04, [02b-asset-gaps.md]).
      Bis zum Shooting: echtes Heels-Foto aus dem Bestand
      (`offer-heels-1200.webp`, zwei Tänzerinnen) — oder kein Bild.
      Das Composite ist ausgeschlossen, siehe C.12.
Alt (bis zum Shooting, zum Bestandsbild):
      Zwei Tänzerinnen in Heels posieren vor hellem Hintergrund.
Alt (nach dem Shooting, zu S-04):
      Eine Gruppe tanzt eine Heels-Choreografie mit erhobenen Armen im hellen
      Studio.
```

## C.3 Was Heels ist

```text
Eyebrow:  KURZ ERKLÄRT

H2:       Was Heels-Tanzen bedeutet

Lead:     Heels ist ein Solotanz auf Absatzschuhen. Du lernst eine
          Choreografie und arbeitest an Haltung und Ausdruck. Am Ende des
          Blocks tanzt du sie als Ganzes.

Body:     Der Unterschied zum Paartanz ist grundsätzlich: Es gibt kein Führen
          und kein Folgen. Niemand gleicht aus, wenn du zu früh bist. Dafür
          bestimmst du jede Bewegung selbst und musst dich auf niemanden
          einstellen.

          Der Absatz verändert alles. Dein Gewicht liegt weiter vorn, die
          Körperspannung muss halten, jeder Schritt wird bewusster. Genau
          deshalb fangen wir im Beginner-Kurs beim Gehen an, bevor irgendeine
          Choreografie kommt. Wer sicher auf Absätzen geht, lernt danach
          schnell.

Bullets:
          - Form: Solo, keine Partnerin, kein Partner
          - Schuhe: Absatz — Höhe siehe unten
          - Fokus: Haltung, Körperspannung, Ausdruck
          - Aufbau: Technik im Kurs, Choreografie über den Block
          - Erstes Ziel: sicher auf Absätzen gehen

Link:     Wie ein Kursblock aufgebaut ist  →  /kursaufbau
```

## C.4 Für wen Heels passt

```text
H2:       Für wen Heels passt

Lead:     Heels passt dir, wenn du tanzen willst, ohne dich mit jemandem
          abstimmen zu müssen.

Body:     Du arbeitest an deiner Haltung, deinem Timing und daran, eine
          Bewegung zu Ende zu tanzen statt sie abzubrechen. Das ist
          anstrengender, als es aussieht, und es macht sich in jedem anderen
          Tanz bemerkbar.

          Vorkenntnisse brauchst du keine. Erfahrung auf Absätzen im Alltag
          hilft, ist aber keine Bedingung — im Beginner-Kurs beginnen alle
          mit dem Gehen.

Gut zu wissen:
          Heels ist offen für alle, die auf Absätzen tanzen wollen.
```

## C.5 Welche Schuhe du brauchst

Diese Section ersetzt auf der Heels-Seite die Partner-Frage. Die häufigste Sorge ist hier eine andere.

```text
H2:       Welche Schuhe du brauchst

Lead:     Schreib uns vor deiner ersten Stunde kurz, dann sagen wir dir, welche
          Schuhe für den Anfang passen. Kauf nichts, bevor du mit uns geredet
          hast.

Body:     Absatzhöhe, Passform und Sohle machen am Anfang mehr aus als die
          Marke. Wir schauen kurz mit dir, was du schon zu Hause hast — oft
          reicht das für die erste Stunde.

Link:     Ratgeber Tanzschuhe  →  /mehr/tanzschuhe
CTA:      Frag uns zu den Schuhen  →  /kontakt
```

**OWNER-BLOCKER → Entscheidung HEE-01.** Offen sind: empfohlene Absatzhöhe für den Einstieg, ob Anfängerinnen im Turnschuh starten dürfen, ob Leihschuhe zum Ausprobieren da sind. Solange das nicht beantwortet ist, bleibt es bei dem oben ausgeschriebenen Text — er ist vollständig und hilfreich, behauptet aber keine Regel. Nichts erfinden: Es geht um einen Kauf, den jemand für den Kurs tätigt.

`/mehr/tanzschuhe` nur verlinken, wenn die Seite belegten Inhalt hat.

## C.6 Level

```text
Eyebrow:  DEIN EINSTIEG

H2:       Wo du anfängst

Lead:     Heels hat drei Level: Beginner, Intermediate und Advanced. Die
          Stufenzahlen 1 bis 13 aus Salsa und Bachata gelten hier nicht.
```

| Level | Wo du gerade stehst |
|---|---|
| Beginner | Du startest bei null: Grundlagen, Haltung und sicheres Gehen auf Absätzen. |
| Intermediate | Du gehst sicher auf Absätzen und tanzt längere Choreografien in höherem Tempo. |
| Advanced | Du tanzt anspruchsvolle Kombinationen und arbeitest an deinem eigenen Ausdruck. |

```text
Body nach der Tabelle:
          Drei Level statt dreizehn Stufen heisst nicht, dass es weniger zu
          lernen gibt. Der Weg ist nur anders geschnitten als im Paartanz.

Microcopy:
          Nicht sicher, wo du hingehörst? Frag eine Probestunde an, dann
          schauen wir es gemeinsam an.

Link:     Wie die Level aufgebaut sind  →  /kursaufbau
```

Die Zustands-Sätze in der rechten Spalte brauchen Freigabe → **Entscheidung HEE-02**. Ohne Freigabe bleiben nur die drei Bezeichnungen stehen.

Heels hat **keine** Stufen 1–13 — die Level-Leiter gilt für Salsa und Bachata ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md):396-403, [`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:21)). Diese Unterscheidung darf im Layout nicht verwischt werden.

## C.7 Ablauf und Preis

```text
Eyebrow:  ABLAUF UND PREIS

H2:       Was ein Heels-Kurs kostet

Lead:     Ein Heels-Kursblock dauert 8 Wochen, einmal pro Woche 60 Minuten,
          immer am gleichen Wochentag. Der Block kostet CHF 190 pro Person.
```

| | |
|---|---|
| Dauer | 8 Wochen, einmal pro Woche 60 Minuten |
| Preis | CHF 190 pro Person und Block |
| Ort | Elisabethenanlage 7, 1. Stock, 4051 Basel |
| Anreise | zwei Gehminuten vom Bahnhof Basel SBB, Tram 1, 2, 8, 10, 11, 16 |
| Anmeldung | allein — Heels ist ein Solotanz |
| Weitere Tarife | Alle bestätigten Preise ansehen → `/preise` |

```text
Body:     Der Preis ist derselbe wie bei Salsa und Bachata. Was du an Schuhen
          brauchst, klären wir vorher — siehe oben.

Link:     Alle Preise ansehen  →  /preise
```

## C.8 Nächste Kurse

```text
Eyebrow:  NÄCHSTE KURSE

H2:       Wann du einsteigen kannst

Lead:     Das sind die Heels-Kurse, die als Nächstes starten.
```

Kursplan-Ausschnitt, auf Heels gefiltert. Höchstens vier Karten.

```text
Laden:  Heels-Kurse werden geladen …
Leer:   Gerade startet kein Heels-Kurs. Schreib uns auf WhatsApp, dann sagen
        wir dir Bescheid, sobald der nächste beginnt.
Fehler: Die Kurse konnten nicht geladen werden. Versuch es bitte nochmal oder
        schreib uns direkt.

Link:   Alle Heels-Kurse im Kursplan  →  /kursplan?stil=heels
```

## C.9 Stil-FAQ

`FAQPage`-Markup auf dieser URL.

```text
H2:  Häufige Fragen zu Heels
```

**H3: Was ist ein Heels-Kurs?**

> Ein Heels-Kurs ist Solotanz auf Absatzschuhen: Du lernst über 8 Wochen eine Choreografie und arbeitest dabei an Haltung, Körperspannung und Ausdruck. Es gibt kein Führen und kein Folgen, also brauchst du niemanden mitzubringen. Bei uns läuft Heels in drei Leveln — Beginner, Intermediate und Advanced.

**H3: Brauche ich Erfahrung auf Absätzen?**

> Nein. Im Beginner-Kurs fangen alle mit dem Gehen auf Absätzen an, bevor die erste Choreografie kommt. Alltagserfahrung mit Absätzen hilft, ist aber keine Voraussetzung. Wer bei null startet, ist hier richtig.

**H3: Welche Schuhe brauche ich für den Heels-Kurs?**

> Schreib uns vor deiner ersten Stunde, dann sagen wir dir, welche Schuhe passen — bevor du etwas kaufst. Absatzhöhe, Passform und Sohle sind am Anfang wichtiger als die Marke, und oft reicht für die erste Stunde, was du schon zu Hause hast.

**H3: Was kostet ein Heels-Kurs in Basel?**

> Ein Kursblock kostet CHF 190 pro Person und umfasst 8 Wochen mit je 60 Minuten. Die Kurse finden an der Elisabethenanlage 7 beim Bahnhof Basel SBB statt. Alle weiteren Tarife stehen auf der Preisseite.

```text
Link nach dem FAQ-Block:  Alle Fragen und Antworten  →  /faq
```

## C.10 Nachbarstil

```text
H2:   Passt vielleicht auch

Body: Wenn du auch im Paar tanzen willst: Bachata Sensual arbeitet mit
      ähnlichen Körperbewegungen aus der Mitte, nur zu zweit.

Link: Bachata-Kurse ansehen  →  /tanzkurse/bachata
```

## C.11 Abschluss

```text
Eyebrow:  ERSTER SCHRITT

H2:       Einmal mitmachen?

Body:     Komm in eine Probestunde und schau, ob der Stil zu dir passt. Frag
          uns vorher kurz zu den Schuhen, dann kommst du gleich richtig
          ausgerüstet.

Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: Heels-Kurse im Kursplan  →  /kursplan?stil=heels

Schluss-Satz: Wir freuen uns auf dich.
```

## C.12 Bildhinweis

Das Composite `/composites/heels-shoes-stilllife.webp` wird **nicht** verwendet. Der abgebildete Raum sieht nicht aus wie das Salsaflow-Studio, die Herkunft ist ungeklärt und EXIF-Daten fehlen vollständig — Stock oder KI-Bild ist beides möglich (L-01, [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:58-66)). Ein Bild, das als „unser Studio" gelesen wird, aber keines ist, ist eine Irreführung.

Stattdessen ein echtes Heels-Foto aus dem Bestand oder gar kein Bild.

## C.13 Interne Links

`/kursplan` (3×), `/kursaufbau` (2×), `/preise`, `/tanzkurse/bachata` (2×), `/mehr/tanzschuhe`, `/kontakt` (2×), `/faq`. → 13.

---

## D — Gemeinsame Abnahme

- Drei eigene H1, drei eigene Meta-Beschreibungen, kein doppelter Fliesstext.
- Title je ≤ 60 Zeichen, Description je ≤ 155 Zeichen.
- Hauptbegriff je Seite in Title, H1 und erstem Satz des Leads.
- Jede Seite mindestens fünf interne Links im Inhalt (erreicht: 11 / 11 / 13).
- Angst-Block (kein Partner, keine Vorkenntnisse, Probestunde) oberhalb der Falz; bei Heels ersetzt die Schuh-Frage die Partner-Frage.
- Einstiegspreis CHF 190 inline auf jeder der drei Seiten, mit Link auf `/preise`.
- FAQ-Block mit vier Fragen je Seite, `FAQPage`-Markup auf der jeweiligen Stil-URL.
- Jede FAQ-Antwort beginnt mit der Antwort, nicht mit Vorgeplänkel.
- Jede Seite endet mit einem warmen Schluss-Satz nach dem letzten CTA.
- On1/On2 nur auf der Salsa-Seite erklärt, Bachata Sensual nur auf der Bachata-Seite.
- Heels ohne Stufenzahlen.
- Nur die belegten Preise als Zahl; für Studierenden-, Einzellektions- und Sommerpreise steht kein Betrag und kein Statuswort, sondern nur der Link auf `/preise`.
- Kein „gratis", kein „einzige Schule", keine Meisterschaften, keine Bewertungen.
- Keine ungeklärten Bilder (L-01). Alt-Texte beschreiben Sichtbares, keine geratenen Namen oder Rollen.
- Jeder Hero hat zwei Alt-Texte: einen zum Bestandsbild, das bis zum Shooting läuft, und einen zum späteren Shot. Der Alt beschreibt immer das Bild, das wirklich ausgeliefert wird — ein Paar-Foto wird als tanzendes Paar beschrieben, nie als Kurs und nie als Lehrperson mit Schülerin ([02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md), Befund 5).

## E — Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| SAL-01 | Level-Zustandssätze für Salsa und Bachata freigegeben? | rechte Tabellenspalte entfällt, Bezeichnungen bleiben |
| HEE-01 | Absatzhöhe, Turnschuh-Start, Leihschuhe? | C.5 bleibt wie ausgeschrieben („schreib uns vorher") |
| HEE-02 | Level-Zustandssätze Heels freigegeben? | nur die drei Bezeichnungen |
| TK-01 | Bachata offiziell als Einsteigerstil positionieren? | Einsteiger-Formulierung in A.4 und B.4 entfällt |
| S-02 | Ist die Probestunde kostenlos? | CTA bleibt „Probestunde anfragen", kein Gratis-Wort |
| PR-01 | Studierendentarif, Einzellektion, Sommerpreis freigegeben? | kein Betrag in A.7 / B.7 / C.7, nur Verweis auf `/preise` |

## F. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Gemeinsames Seitenraster, aber pro Stil eigenes Hero-Bild, Lead und Akzenttext. Reihenfolge Kopf, Stil-Erklärung, Für wen, Partner/Schuhe, Level, Preis, Kurse, FAQ, Nachbarstil, Abschluss bleibt fest.
- Preis-/Ablauf-Block zweispaltig auf Desktop, gestapelt auf Mobil; Kursplan-Ausschnitt vor dem FAQ-Block, Nachbarstil danach.
- Level-Tabelle auf Mobil als gestapelte Karten (Level, Stufen, Zustandssatz), nicht als horizontal scrollende Tabelle.
- FAQ als Akkordeon mit fester Höhe pro geschlossenem Eintrag; erste Frage optional offen. Antworttext bleibt im HTML, auch wenn zugeklappt.

### Buttons, Hover und Icons
- Stil-spezifischer Kursplan als einziger Primary im Hero; Probestunde als Secondary. Hover: Rotwechsel, Pfeilbewegung, Fokus sichtbar.
- Lucide: `Music2` Salsa, `HeartHandshake` Bachata, `Sparkles` Heels, `Clock3`, `ArrowRight`; Icons nur als Verstärkung neben Text.
- Buttons `rounded-full`, pro Section höchstens ein Primary ([DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md)).

### Motion und Zustände
- Getakteter `[data-reveal]` Fade-up für Sections und Kurskarten; keine stilabhängigen Sonderanimationen. Reduced Motion sofort.
- Kursausschnitt hat Loading, leer und Fehler — Wortlaut je Seite in A.8 / B.8 / C.8 ausgeschrieben.
- Heels-Schuh-Block zeigt OWNER-BLOCKER/Fallback nicht als erfundene Fakten; der ausgeschriebene C.5-Text ist der Fallback.

### Assets und Alt
- Salsa/Bachata/Heels aus den drei freigegebenen Premium-Angebotsbildern, später ersetzt durch S-02/S-03/S-04 aus dem Studio-Shooting. Heels-Composite ausdrücklich nicht einsetzen.
- Bildgenaue Alt-Texte, keine Namen raten. Paar-Fotos neutral als tanzendes Paar beschreiben, nie als Lehrperson und Schülerin, solange kein echtes Unterrichts-Foto vorliegt ([02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md), Befund 5).

### Mockup-Brief
- Pro Route: Stil, Hero-Copy, Primärziel, Nachbarstil-Link, Level-Darstellung, Preisquelle, Kursdatenfilter, Asset/Alt, Zustände, FAQ-Block mit vier Fragen, offene Entscheidungen SAL-01/HEE-01/HEE-02/TK-01/PR-01.

**Ende der Stilseiten-Spec, FINAL v2.**
