# 05-IA-Events — Informationsarchitektur und Copy-Spec

**Status:** FINAL · Planning only  
**Gilt mit:** [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md) · [`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md)

## Navigation

Das Kundenlabel bleibt **EVENTS & WORKSHOPS**. Die stabile Repo-Übersicht ist `/events`. Event-Details werden unter `/events/*` vereinheitlicht; die bisherigen `/events-workshops/*`-Pfade erhalten einstufige 301-Weiterleitungen.

```text
/events
├── /events/danceflow-night
├── /events/anniversary-weekend
├── /events/floweekend
└── /events/kalender
```

## Hub-Auftrag

Der Hub trennt drei Content-Arten:

1. Danceflow Night als wiederkehrendes Format.
2. Bestätigte Workshops und Specials.
3. Kalender bzw. Archiv.

Shows/Animationen bleiben ausserhalb dieses Hubs als eigene B2B-Seite `/shows-animationen`.

## Copy-Regeln

- Danceflow Night: Rhythmus, Floors, Preis und Ort nur mit belegter Quelle.
- Anniversary Weekend und FLOWeekend: Jahr und Datum nur sichtbar, wenn aktuell bestätigt.
- Eventkalender: kommende Termine zuerst; leere Zustände ehrlich benennen.
- Kein Event-Markup ohne echte Primärdaten.
- Keine abgelaufene Kampagne als dauerhafte Hauptnavigation.
- CTA: „Event ansehen“, „Zum Kalender“ oder „Kontakt aufnehmen“; keine falsche Verfügbarkeitsbehauptung.

## Interne Wege

- Event-Hub → `/tanzkurse`.
- Danceflow Night → `/tanzkurse` und `/kontakt`.
- Workshop → `/kursplan`, wenn kursdatengetrieben; sonst Anfrage.
- Event-Fotos → `/fotos`.

## Zustände

- kommende Events vorhanden: Datum, Ort, Format, CTA.
- keine bestätigten Termine: Rhythmus/Format erklären, keine erfundene Datumszeile.
- Archiv: Jahres-/Anlasslabel sichtbar.
- Fehler: Kalender konnte nicht geladen werden; WhatsApp/Kontakt als Fallback.

**Abnahme:** Kundenlabel bleibt erhalten, URL-Elternpfad ist konsistent, Shows bleiben eigenständig und kein Eventdatum wird ohne Primärbeleg ausgegeben.
