# 05-IA-Tanzkurse — Informationsarchitektur und Copy-Spec

**Status:** FINAL · Planning only  
**Gilt mit:** [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md) · [`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md)

## Seitenauftrag

`/tanzkurse` ist der Überblick über neue und laufende Kurse. Die drei Stilseiten sind kaufnahe Vertiefungen. Die Kundenstruktur verlangt Filterbarkeit für Quereinsteiger und zukünftige Kurse ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:11-22)).

## Seitenbaum

```text
/tanzkurse
├── /tanzkurse/salsa
├── /tanzkurse/bachata
└── /tanzkurse/heels
```

## `/tanzkurse` Sections

1. Hero: „Finde deinen Tanzkurs.“ — Überblick, Ort, neutraler Einstieg.
2. Stilwahl: Salsa, Bachata, Heels.
3. Levelhilfe: Beginner, Flow, Intermediate, Advanced.
4. Sommerkurse: drei Wochen im August, Spezialpreis nur bei bestätigten Daten.
5. Kurskalender: neu/laufend, Filter nach Stil, Level und Termin.
6. FAQ-/Kontakt-Weiterweg: Kursplan, Probestunde anfragen, WhatsApp.

## Stilseiten

Jede Stilseite beantwortet in dieser Reihenfolge:

- Für wen ist der Stil?
- Ist Solo-Einstieg möglich?
- Welches Level passt?
- Welche Termine und Preise gelten?
- Wie geht es zur Kursbuchung?

### Salsa

- On1 und On2 als Varianten.
- Beginner 1–6, Beginner Flow, Intermediate 7–12, Intermediate Flow, Advanced ab 13.
- CTA: Kursplan ansehen oder Probestunde anfragen.

### Bachata

- Dieselbe belegte Salsa/Bachata-Level-Leiter.
- Bachata Sensual nur als Inhalt, wenn die Angebotsquelle es bestätigt.
- CTA: Kursplan ansehen.

### Heels

- Beginner, Intermediate, Advanced.
- Offene Kurslogik; keine Lead-/Follower-Pflicht behaupten, wenn der Kursdatensatz sie nicht vorgibt.
- CTA: Kursplan ansehen.

## Kursdaten und Buchungslogik

Der öffentliche Kursplan liest nur veröffentlichte Kurs-/Staffel-Daten. Kapazität und Warteliste werden serverseitig entschieden. Ein voller Kurs zeigt „Auf die Warteliste“, nicht eine erfolgreiche Buchung. Die Frozen Rules stehen in [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:550-629).

## Abnahme

- `/tanzkurse` führt zu allen drei Stilseiten und zum Kursplan.
- Level 1–13+, Flows und Heels B/I/A sind sichtbar erklärt.
- Sommerkurse nennen drei Wochen August und Spezialpreis; Daten/Preis bleiben datenabhängig.
- Keine „gratis“-Formulierung ohne Bestätigung.
- Jede Kurskarte hat einen passenden Zustand und nächsten Schritt.
