# 06 — FINAL DE-Copy: `/events/kalender`

**Route:** `/events/kalender` · **Prio:** P2 · **Hauptbegriff:** salsa termine basel
**Nebenbegriffe:** salsa kalender basel, tanz events basel termine
**Suchabsicht:** Terminliste. Besucher:in will die kommenden Daten sehen.
**Primary Conversion:** C4 Event ansehen · **Secondary:** Kontakt
**Meta-Title:** Eventkalender: Tanz-Termine in Basel | Salsaflow
**Meta-Description:** Alle Tanz-Termine bei Salsaflow Basel im Kalender: Danceflow Nights, Workshops und Specials — mit Datum, sobald bestätigt.

> Kommende Termine zuerst. **Keine erfundenen Datumszeilen** — ohne bestätigtes Datum wird der Rhythmus erklärt. Kein `Event`-Schema ohne Primärdatum. Ablaufende Kampagnen nicht als dauerhafte Navigation.

---

## Section 1 — Hero

# Der Eventkalender.

Alle kommenden Termine auf einen Blick — zuerst die nächsten.

---

## Section 2 — Kommende Termine (datengetrieben)

**Rendert je bestätigtem Termin:** Datum, Format (Danceflow Night / Workshop / Special), Ort, CTA.

**Zustände:**
- Termine vorhanden: Datum, Ort, Format, CTA.
- Keine bestätigten Termine: „Die Danceflow Night findet am 1., 3. und 5. Freitag im Monat statt. Neue Specials kündigen wir hier an." — **kein** erfundenes Datum.
- Archiv: Jahres-/Anlasslabel sichtbar.
- Fehler: „Der Kalender konnte nicht geladen werden. Bitte versuche es erneut oder schreib uns." + WhatsApp/Kontakt als Fallback.

[Textlink] **WhatsApp schreiben →** `wa.me/41764788411`

---

## Section 3 — Formate im Überblick

## Unsere Formate.

- **Danceflow Night** — 1., 3. und 5. Freitag im Monat. [Mehr →](/events/danceflow-night)
- **FLOWeekend** — 9.–10. Oktober 2026. [Mehr →](/events/floweekend)
- **Anniversary Weekend** — Datum folgt, sobald bestätigt. [Mehr →](/events/anniversary-weekend)

---

**Interne Pflicht-Links:** `/events/danceflow-night`, `/events/floweekend`, `/events/anniversary-weekend`, `/tanzkurse`, `/kontakt`.
**Schema:** `Event` nur mit echtem Primärdatum.
**Claim-Check:** keine erfundenen Termine, Rhythmus belegt, FLOWeekend-Datum belegt, Anniversary-Datum konditional.
