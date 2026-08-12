# 05-IA-Home — Informationsarchitektur der Startseite

**Status:** FINAL · Planning only  
**Gilt mit:** [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md) · [`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md)

## Aufgabe

Die Startseite ist die freundliche Übersicht über das Angebot. Sie führt nicht in eine neue Funnel-IA, sondern bildet die sieben Kunden-Blöcke aus dem Eingang ab: Team + Text, Angebot/Kurskalender, reguläre Tanzkurse, Privatstunden, Shows, Gutschein und News ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:44-51)).

## Reihenfolge und Section-Vertrag

| Reihenfolge | Section | Inhalt | Hauptziel |
|---:|---|---|---|
| 1 | Hero | echtes, sofort sichtbares Tanzbild; Ort und Angebot; neutraler Probestunden-CTA | Einstieg |
| 2 | Team + Text | echte Teamfotos, kurzer familiärer Text, Link `/team` | Vertrauen |
| 3 | Angebot / Kurskalender | neue und laufende Kurse; Filter-/Status-Hinweis; Link `/kursplan` | Kurswahl |
| 4 | Reguläre Tanzkurse | Salsa, Bachata, Heels; Level-Orientierung; Link `/tanzkurse` | Angebot verstehen |
| 5 | Privatstunden | individueller Weg; Ersatzmotiv; Link `/privatstunden` | Anfrage |
| 6 | Shows / Animationen | B2B-Text; kein Party-Mix; Link `/shows-animationen` | Anfrage |
| 7 | Gutschein | Ablauf/Preis nur bei Bestätigung; sonst `PLACEHOLDER` | Geschenk-Intent |
| 8 | News | kommende Events und Kursbeginne nur mit belegten Daten | Aktualität |
| 9 | Footer / WhatsApp | Kontakt, WhatsApp, offizielle Social-Links | Abschluss |

## Hero-Gate

- H1: klarer Ort + Tätigkeit, z. B. „Tanzen lernen in Basel.“
- Primäraktion: „Probestunde anfragen“.
- Sekundäraktion: „Kursplan ansehen“.
- Kein „gratis“, solange der Preis-Claim nicht bestätigt ist.
- Bild oder gleichwertige Fallback-Fläche muss beim ersten Paint sichtbar sein.
- Kein Reveal darf den gesamten Hero-Text im normalen Browserzustand verstecken.

Beleg für Kundenblock und Hero-Risiko: [`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:44-55) und [`04b-seo-critic.md`](/root/clients/salsaflow-dc/website-plan/04b-seo-critic.md:9).

## Crosslinks

- Team → `/team`, `/tanzkurse`.
- Kurskalender → `/kursplan`, `/tanzkurse`.
- Stile → `/tanzkurse/salsa`, `/tanzkurse/bachata`, `/tanzkurse/heels`.
- Privat → `/privatstunden`.
- Shows → `/shows-animationen`.
- News/Event → `/events`.
- Jeder Abschnitt hat höchstens einen Primary-CTA gemäss [`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md:84-88).

## Beweis- und Zustandsregeln

- Keine Review-Fläche ohne Primärbeleg; ansonsten `PLACEHOLDER` oder weglassen ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:34-43)).
- Kurskalender braucht loading, leer, Fehler, frei, voll/Warteliste und Quereinstieg-Zustände.
- News darf keine unbestätigten Termine veröffentlichen.
- Alle inhaltlichen Bilder erhalten bildgenaue Alt-Texte; dekorative Bilder `alt=""`.
- WhatsApp sitewide: `wa.me/41764788411` gemäss Kundenextrakt ([`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:19-22)).

**Abnahme:** Alle sieben Kunden-Blöcke sind vorhanden, Hero ist nicht leer, und jeder Block hat einen eindeutigen nächsten Weg.
