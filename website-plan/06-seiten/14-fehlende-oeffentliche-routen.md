# 14 — Ergänzende öffentliche Routen

**Status:** READY FOR VERIFY · Planning only

Diese Datei schliesst vier Lücken aus dem freigegebenen IA-Baum. Jede URL hat einen eigenen Suchjob und eigene Metadaten. Rechtstexte werden nicht erfunden.

## A — Tanzschuhe `/mehr/tanzschuhe`

### Meta und Outline

- **Intent:** Tanzschuhe in Basel finden bzw. Salsaflows Partnerhinweis verstehen.
- **Primary Keyword:** `Tanzschuhe Basel` (Volumen: UNKNOWN, kein Export).
- **Title:** `Tanzschuhe in Basel — Hinweise & Partner | Salsaflow`
- **Meta:** `Welche Schuhe passen zu Salsa, Bachata oder Heels? Salsaflow erklärt die wichtigsten Unterschiede und verweist auf bestätigte Partner.`
- **H1:** `Tanzschuhe für deinen Kurs.`
- **H2:** `Was du am Anfang brauchst` · `Schuhe für Salsa und Bachata` · `Schuhe für Heels` · `Bestätigte Partner`
- **CTA:** `Kursplan ansehen` → `/kursplan`
- **Links:** OUT `/tanzkurse`, `/tanzkurse/heels`, `/kursplan`; IN aus `/mehr` und Heels-Seite.
- **Schema:** `WebPage`; kein `Product` oder `Offer` ohne eigenes, bestätigtes Sortiment.

### Finale Copy und Section-Specs

1. **Kopf:** H1 wie oben. Body: `Für die erste Stunde brauchst du keine Spezialausrüstung. Wähle saubere Schuhe, in denen du dich sicher drehen und bewegen kannst. Wenn du regelmässig tanzt, lohnt sich ein Paar, das zu deinem Stil und Fuss passt.` Desktop textgeführt; Mobile identisch. Mockup `TS01`.
2. **Orientierung:** H2 `Was du am Anfang brauchst`. Body: `Bring die Schuhe mit, in denen du dich stabil fühlst. Bei Salsa und Bachata hilft eine Sohle, die Drehungen zulässt. Für Heels sind Halt und eine sichere Passform wichtiger als die Absatzhöhe.` **OWNER-BLOCKER `FAQ-02`:** fachliche Schuhdetails von Salsaflow bestätigen; bis dahin bleibt nur der erste und letzte Satz. Mockup `TS02`.
3. **Partner:** H2 `Wo du Tanzschuhe findest`. Body: `Sobald Salsaflow einen Partner und die Verlinkung bestätigt hat, findest du ihn hier. Bis dahin beraten wir dich vor oder nach deinem Kurs persönlich.` Keine Rabatt- oder Preisbehauptung. Mockup `TS03`.

Motion: globaler Reveal-Vertrag; Reduced Motion sofort. Desktop 1440×900, Mobile 390×844.

## B — Partys `/mehr/partys`

### Meta und Outline

- **Intent:** Salsa-/Bachata-Partys in Basel und Salsaflow-Formate finden.
- **Primary Keyword:** `Salsa Partys Basel` (Volumen: UNKNOWN).
- **Title:** `Salsa- & Bachata-Partys in Basel | Salsaflow`
- **Meta:** `Finde Salsaflow-Partys und öffentliche Tanzabende in Basel. Bestätigte Termine stehen im Eventkalender.`
- **H1:** `Partys zum Weitertanzen.`
- **H2:** `Salsaflow-Events` · `Weitere Partys in Basel` · `Termine prüfen`
- **CTA:** `Zum Eventkalender` → `/events/kalender`
- **Links:** OUT `/events`, `/events/danceflow-night`, `/events/kalender`; IN aus `/mehr` und Redirect `/events/salsa-partys-in-basel/`.
- **Schema:** `CollectionPage`; `Event` nur je bestätigtem Termin mit Datum, Uhrzeit und Ort.

### Finale Copy und Section-Specs

1. **Kopf:** `Im Kurs lernst du die Schritte. Auf Partys werden sie zu deinem eigenen Tanz. Hier sammeln wir Salsaflow-Abende und bestätigte weitere Termine in Basel.` Mockup `PA01`.
2. **Eigene Formate:** H2 `Salsaflow-Events`. Body: `Danceflow Night, Workshops und Wochenendformate haben eigene Seiten. Dort stehen Programm, Ort, Preis und Anmeldung, sobald die Angaben bestätigt sind.` CTA `/events`. Mockup `PA02`.
3. **Externe Termine:** H2 `Weitere Partys in Basel`. **OWNER-BLOCKER `PARTY-01`:** Veranstalter, Aktualisierungsrhythmus und Linkfreigaben fehlen. Sicherer Fallback: `Wir veröffentlichen hier nur Termine, die wir geprüft haben. Bis dahin findest du unsere eigenen Abende im Eventkalender.` Mockup `PA03`.

## C — Impressum `/impressum`

- **Intent/Indexation:** Navigation und rechtliche Anbieterangaben; indexierbar, aber kein Keyword-Ziel.
- **Title:** `Impressum | Salsaflow Dance Company`
- **Meta:** `Anbieter- und Kontaktangaben der Salsaflow Dance Company in Basel.`
- **H1:** `Impressum`
- **H2:** `Anbieter` · `Kontakt` · `Vertretungsberechtigte Person` · `Register- und Steuerangaben` · `Haftung und Urheberrecht`
- **CTA:** keiner; Footerlinks zu `/datenschutz` und `/kontakt`.
- **Schema:** `WebPage`; Unternehmensdaten nur aus bestätigter NAP-Quelle.

**OWNER-BLOCKER LEGAL-01:** vollständige juristische Firmierung, Rechtsform, vertretungsberechtigte Person, Register-/UID-Angaben und freigegebener Haftungstext fehlen. Diese Seite ist erst `FINAL`, wenn der Kunde oder Rechtsbeistand den Wortlaut liefert. Sichtbarer sicherer Zwischenstand im Staging: `Die rechtlichen Anbieterangaben werden vor Veröffentlichung von Salsaflow ergänzt und freigegeben.` Dieser Satz darf nicht auf Production stehen.

Layout: schmale Textspalte, keine Motion ausser sofortigem Seitenaufbau, keine Marketing-CTA. Mockup `IM01` Desktop/Mobile.

## D — Datenschutz `/datenschutz`

- **Intent/Indexation:** Datenschutzinformation; indexierbar, kein Keyword-Ziel.
- **Title:** `Datenschutz | Salsaflow Dance Company`
- **Meta:** `Informationen zur Verarbeitung personenbezogener Daten auf der Website von Salsaflow.`
- **H1:** `Datenschutz`
- **H2:** `Verantwortliche Stelle` · `Hosting und Server-Logs` · `Kontakt- und Buchungsformulare` · `Zahlungen` · `Cookies und Einwilligung` · `Drittanbieter` · `Speicherdauer` · `Deine Rechte` · `Kontakt`
- **CTA:** keiner; Footerlinks zu `/impressum` und `/kontakt`.
- **Schema:** `WebPage`.

**OWNER-BLOCKER LEGAL-02:** Verantwortliche Stelle, Hosting, Analytics/Consent, Mail-, Karten-, Zahlungs- und sonstige Auftragsverarbeiter müssen dem tatsächlichen Production-Stack entsprechen und rechtlich freigegeben werden. Keine Vorlage darf diese Angaben raten. Staging-Fallback: `Der vollständige Datenschutzhinweis wird nach dem technischen Anbieter-Inventar rechtlich freigegeben.` Nicht für Production.

Layout: Inhaltsverzeichnis mit Sprunglinks, schmale Textspalte, sichtbarer Aktualisierungsstand. Keine Scroll-Reveal-Animation für Rechtstext; Reduced Motion identisch. Mockup `DS01` Desktop/Mobile.

## Abnahme

- Alle vier URLs stehen im Route-Manifest und in der SEO-Map.
- `/mehr/partys` ist vor Aktivierung des 301-Ziels als 200-Route vorhanden.
- Legal-Seiten bleiben blockiert, bis LEGAL-01/02 geschlossen sind.
- Keine Preise, Rabatte, Partner, Events oder Rechtsangaben wurden erfunden.
