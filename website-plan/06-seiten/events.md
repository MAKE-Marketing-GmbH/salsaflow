# 06 — FINAL DE-Copy: `/events`

**Route:** `/events` · **Prio:** P1 · **Hauptbegriff:** tanz events basel
**Nebenbegriffe:** salsa party basel, salsa workshop weekend basel
**Suchabsicht:** Übersicht. Besucher:in will wissen, was ansteht und wann.
**Primary Conversion:** C4 Event ansehen · **Secondary:** C2 Kurse
**Meta-Title:** Events & Danceflow Nights in Basel | Salsaflow
**Meta-Description:** Events bei Salsaflow Basel: Danceflow Nights, Workshops und Specials. Alle Termine, sobald sie bestätigt sind — direkt am Bahnhof SBB.

> **Nav-Label bleibt „EVENTS & WORKSHOPS"** (Kundenlabel), URL-Elternpfad ist `/events/*`. Altpfade `/events-workshops/*` erhalten einstufige 301. Kein Event-Markup ohne Primärdatum. Keine abgelaufene Kampagne als dauerhafte Hauptnavigation.

---

## Section 1 — Hero

# Events bei Salsaflow.

Danceflow Nights, Workshops und Specials — hier siehst du, was als Nächstes ansteht. Termine erscheinen, sobald sie bestätigt sind.

[Primary] **Zum Kalender →** `/events/kalender`

---

## Section 2 — Danceflow Night (wiederkehrendes Format)

## Danceflow Night.

Unsere eigene Social Night findet am **1., 3. und 5. Freitag im Monat** bei uns im Studio statt — mit einem Salsa- und einem Bachata-Floor. Eintritt: CHF 5 für Mitglieder, CHF 10 für Gäste.

[Textlink] **Mehr zur Danceflow Night →** `/events/danceflow-night`

Rhythmus, Floors, Preis und Ort sind belegt. Der nächste konkrete Termin wird datengetrieben gerendert, nicht erfunden.

---

## Section 3 — Bestätigte Specials

## Workshops und Specials.

**FLOWeekend 2026** — 9.–10. Oktober 2026: Workshops und Parties.
[Textlink] **Zum FLOWeekend →** `/events/floweekend`

**Anniversary Weekend** — unser Geburtstags-Event mit Workshops, Shows und Socials. Jahr und Datum erscheinen, sobald aktuell bestätigt.
[Textlink] **Zum Anniversary Weekend →** `/events/anniversary-weekend`

Jahr und Datum nur sichtbar, wenn bestätigt. Kein Event-Markup ohne echte Primärdaten.

---

## Section 4 — Kalender

## Der Eventkalender.

Alle kommenden Termine in einer Liste — zuerst die nächsten.

**Zustände:**
- Termine vorhanden: Datum, Ort, Format, CTA.
- Keine bestätigten Termine: Rhythmus/Format erklären, **keine erfundene Datumszeile**.
- Archiv: Jahres-/Anlasslabel sichtbar.
- Fehler: „Der Kalender konnte nicht geladen werden." + WhatsApp/Kontakt als Fallback.

---

## Section 5 — Weiterweg

## Mehr als Events.

Hinter den Events steht eine ganze Tanzschule — mit Kursen von Beginner bis Advanced.

[Textlink] **Tanzkurse ansehen →** `/tanzkurse`
[Textlink] **Event-Fotos ansehen →** `/fotos`

---

**Interne Pflicht-Links:** `/events/danceflow-night`, `/events/floweekend`, `/events/anniversary-weekend`, `/events/kalender`, `/tanzkurse`, `/fotos`, `/kontakt`.
**Schema:** `Event` nur mit echtem Primärdatum; Liste bleibt bis dahin leer.
**Claim-Check:** Danceflow-Rhythmus/-Preis/-Ort belegt, FLOWeekend-Datum belegt (9.–10.10.2026), Anniversary-Datum konditional, keine erfundenen Termine. Shows bleiben auf `/shows-animationen`, nicht hier.
