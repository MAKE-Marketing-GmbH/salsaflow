# 04 — Kursaufbau `/kursaufbau`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P0
**Job:** Die eine Frage beantworten, die Leute vom Buchen abhält: „Welches Level bin ich?" — und die Level-Leiter so erklären, dass sie logisch wirkt statt kompliziert.
**Suchabsicht:** „Salsa Level", „welches Tanzlevel", „Salsa Stufen erklärt"
**Primärer CTA:** Probestunde anfragen

---

## 1. Meta

```text
Title:       Kursaufbau und Level — von Stufe 1 bis Advanced | Salsaflow
Description: Wie die Level bei Salsaflow aufgebaut sind: Beginner Stufe 1–6,
             Intermediate 7–12, Advanced ab 13, dazwischen die Flow-Kurse.
```

## 2. Sectionreihenfolge

1. Kopf
2. Die Leiter im Überblick
3. Was ein Flow-Kurs ist
4. Wie du dein Level findest
5. Quereinstieg
6. Heels
7. On1 und On2
8. Abschluss

---

## 3. Kopf

```text
H1:    Wie unsere Kurse aufgebaut sind
Lead:  Salsa und Bachata laufen bei uns über eine Stufenleiter. Ein Block dauert
       8 Wochen, danach gehst du eine Stufe weiter. Du musst dich nicht selbst
       einschätzen — das machen wir gemeinsam in einer Probestunde.
Primary:   Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: Kursplan ansehen      →  /kursplan
```

Der letzte Satz des Leads nimmt sofort den Druck raus. Die Angst, im falschen Kurs zu stehen, ist der häufigste Grund, gar nicht erst anzufangen.

---

## 4. Die Leiter im Überblick

```text
H2:  Die Stufen
```

Als visuelle Leiter, nicht als Tabelle mit acht Spalten.

```text
Stufe 1 – 6      BEGINNER
                 Grundschritt, Timing, erste Drehungen, Führen und Folgen.

                 BEGINNER FLOW
                 Alles aus 1–6 in neuen Kombinationen, bis es sitzt.

Stufe 7 – 12     INTERMEDIATE
                 Längere Kombinationen, mehr Musikalität, feinere Führung.

                 INTERMEDIATE FLOW
                 Festigen, bevor Advanced kommt.

ab Stufe 13      ADVANCED
                 Anspruchsvolle Figuren und eigener Ausdruck.
```

Struktur belegt ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:16-19)).

Die Beschreibungszeilen unter jeder Stufe sind eine inhaltliche Aussage der Schule und brauchen Freigabe. → **Entscheidung KA-01**. Ohne Freigabe bleibt die Leiter mit Bezeichnungen und Stufenzahlen stehen — sie funktioniert auch ohne die Zeilen.

```text
Zeile: Eine Stufe entspricht einem Block von 8 Wochen. Von Stufe 1 bis Stufe 6
       dauert es also rund ein Jahr, wenn du durchgehend dabei bist.
```

Diese Rechnung ist die naheliegende Frage und braucht ebenfalls Bestätigung, weil Ferienpausen und Flow-Blöcke sie verschieben. → **Entscheidung KA-02**. Ohne Bestätigung entfällt die Zeile.

---

## 5. Was ein Flow-Kurs ist

```text
H2:   Die Flow-Kurse
Body: Zwischen Beginner und Intermediate liegt ein Flow-Kurs, und zwischen
      Intermediate und Advanced noch einer. Dort kommt kein neuer Stoff dazu.
      Du wiederholst, was du gelernt hast, in anderen Kombinationen und zu
      anderer Musik — bis du es tanzt, ohne nachzudenken.
Zeile: Ein Flow-Kurs ist keine Wiederholung, weil etwas schiefging.
       Er ist der Teil, in dem das Gelernte zu Tanzen wird.
```

Diese Erklärung ist nötig, weil „Flow" sonst wie ein Zwischenlevel wirkt, das man überspringen kann. Der letzte Satz nimmt die Deutung „ich bin durchgefallen" weg.

Inhaltliche Bestätigung nötig, ob Flow-Kurse tatsächlich keinen neuen Stoff enthalten. → **Entscheidung KA-03**.

---

## 6. Wie du dein Level findest

```text
H2:  Welches Level passt zu dir?
```

Drei Fälle, als kurze Blöcke:

```text
Du hast noch nie getanzt
  Stufe 1. Dort setzen wir nichts voraus.
  →  Kurse auf Stufe 1  /kursplan?level=1

Du hast schon getanzt, aber woanders
  Komm in eine Probestunde. Level heissen nicht überall dasselbe —
  wir schauen uns an, wie du dich bewegst, und sagen dir, wo du passt.
  →  Probestunde anfragen  /kontakt#schnupperstunde

Du warst länger raus
  Meistens passt eine Stufe unter deinem alten Level. Schreib uns kurz,
  was du zuletzt getanzt hast.
  →  WhatsApp schreiben
```

Der zweite Fall ist der wichtigste: Level-Bezeichnungen sind zwischen Schulen nicht vergleichbar. Das offen zu sagen, ist ehrlicher und schützt vor Fehleinstufungen.

Die Einstufung über die Probestunde ist in der Live-FAQ belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:174)).

Der dritte Fall („eine Stufe unter dem alten Level") braucht Bestätigung. → **Entscheidung KA-04**.

---

## 7. Quereinstieg

```text
H2:   Mitten im Block einsteigen
Body: Bei vielen Kursen kannst du auch dann dazukommen, wenn der Block schon
      läuft. Ob das bei einem bestimmten Kurs geht, steht direkt beim Kurs
      im Kursplan.
CTA:  Laufende Kurse ansehen  →  /kursplan?einstieg=quereinstieg
```

Der Quereinstieg ist ein ausdrücklicher Kundenwunsch ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:11)).

### Backend-Logik in Worten

Jeder Kurs trägt ein Merkmal, das aussagt, ob ein späterer Einstieg erlaubt ist. Nur wenn dieses Merkmal gesetzt ist, zeigt der Kursplan den Hinweis „Quereinstieg möglich" und nimmt den Kurs in den entsprechenden Filter auf. Es wird nicht aus dem Startdatum geraten. Ein laufender Kurs ohne dieses Merkmal erscheint im Plan als laufend, aber ohne Einstiegs-Angebot — und ist nicht buchbar.

Was ein Quereinsteiger dann bezahlt, ist offen: der volle Blockpreis, ein anteiliger Preis oder der Einzellektionspreis. → **Entscheidung KA-05**. Ohne Antwort steht im Kursplan bei Quereinstieg kein Preis, sondern „Preis auf Anfrage".

---

## 8. Heels

```text
H2:   Heels läuft anders
Body: Heels hat keine Stufenzahlen. Es gibt Beginner, Intermediate und Advanced.
      Weil du solo tanzt, hängt der Einstieg mehr an Haltung und Kondition
      als an einer Zählweise.
Link: Zu den Heels-Kursen  →  /tanzkurse/heels
```

Der zweite Satz begründet, warum. Ohne Begründung wirkt es wie eine Inkonsistenz im System.

Begründung braucht Freigabe. → **Entscheidung KA-06**. Ohne Freigabe bleibt nur Satz 1 und 2 ohne Begründung.

---

## 9. On1 und On2

```text
H2:   Salsa On1 und On2
Body: Der Unterschied liegt im Timing. Bei On1 fällt der Grundschritt auf die
      erste Zählzeit, bei On2 auf die zweite. On2 ist der New-York-Stil und
      unser Schwerpunkt. Beides ist Salsa — der Wechsel ist Gewöhnung,
      kein Neuanfang.
Link: Zu den Salsa-Kursen  →  /tanzkurse/salsa
```

On2 als Schwerpunkt ist belegt ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:228-231)).

Ob ein Kurs On1 oder On2 ist, steht beim einzelnen Kurs im Kursplan, nicht als eigene Navigationsebene ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:113)).

---

## 10. Abschluss

```text
H2:       Immer noch unsicher?
Body:     Das ist normal. Komm in eine Probestunde — danach weisst du es.
Primary:  Probestunde anfragen  →  /kontakt#schnupperstunde
Secondary: Preise ansehen       →  /preise
```

---

## 11. Interne Links

`/kursplan` (4× mit verschiedenen Filtern), `/kontakt#schnupperstunde` (3×), `/tanzkurse/salsa`, `/tanzkurse/heels`, `/preise`, `/faq`.

---

## 12. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| KA-01 | Sind die Stufenbeschreibungen inhaltlich korrekt? | nur Bezeichnungen und Stufenzahlen |
| KA-02 | Stimmt „Stufe 1 bis 6 = rund ein Jahr"? | Zeile entfällt |
| KA-03 | Kommt im Flow-Kurs wirklich kein neuer Stoff dazu? | Beschreibung neutraler formulieren |
| KA-04 | Rückkehrer: eine Stufe tiefer? | nur „schreib uns" |
| KA-05 | Was kostet ein Quereinstieg? | „Preis auf Anfrage" |
| KA-06 | Warum hat Heels keine Stufenzahlen? | Begründung entfällt |
| S-02 | Probestunde gratis? | ohne Preisaussage |

## 13. Abnahme

- Eine H1, eine durchgehende Erklärung ohne Fachjargon ohne Erklärung.
- Level 1–13+, beide Flow-Stufen und Heels B/I/A vollständig abgebildet.
- Quereinstieg erklärt und mit Backend-Regel hinterlegt.
- Keine erfundene Dauer, kein erfundener Preis.
- Jede unbestätigte inhaltliche Aussage hat eine Entscheidungs-ID und einen Fallback.

## 14. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Hero mit Level-Frage als Fokus; danach visuelle Leiter mit klaren Brücken zwischen Beginner Flow und Intermediate Flow. Fälle zur Einstufung als drei kurze Entscheidungskarten.
- Quereinstieg als eigener Kontrast-Block; Heels und On1/On2 als erklärende Textmodule, nicht als neue Navigation.

### Buttons, Hover und Icons
- Primary Probestunde, Secondary Kursplan. Leiter-Schritte sind nicht klickbare Deko; nur passende Links als Textlinks.
- Lucide: `Route`, `CircleHelp`, `Shuffle`, `Footprints`, `ArrowRight`; sichtbare Labels und Fokuszustände.

### Motion und Zustände
- Leiter erscheint als getakteter Fade-up, Schrittfolge bleibt auch ohne Motion vollständig lesbar. Reduced Motion sofort.
- Quereinstieg zeigt Datenhinweis aus `allows_late_entry`; bei unbekanntem Preis `Preis auf Anfrage`, kein Fake-Loading.

### Assets und Alt
- Step-Diagramme nur als funktionale Grafik mit echtem Alt; dekorative Linien `alt=""`. Keine erfundenen Level-Fotos.

### Mockup-Brief
- Felder: Leiterdaten; Flow-Brücken; Einstufungsfälle; CTA-Ziele; `allows_late_entry`-Hinweis; Preis-Fallback; Icon; Motion; Alt; KA-01 bis KA-06.
