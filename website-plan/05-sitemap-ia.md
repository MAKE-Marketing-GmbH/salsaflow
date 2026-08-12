# 05 — Sitemap / Informationsarchitektur

**Status:** FINAL · G-IA freigegeben 2026-08-12  
**Rolle:** IA-Lock  
**Modus:** Planning only — kein Production-Code  
**Firma:** Salsaflow Dance Company (Salsa Flow Basel)

## 0. Verbindliche Entscheidung

Die Website folgt der **Kunden-Baseline** aus [`SFDC-NEW-WEBSITE-STRUKTUR.docx`](/root/clients/salsaflow-dc/docs/bilder/redesign-2026-08/eingang/SFDC-NEW-WEBSITE-STRUKTUR.docx), extrahiert in [`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:3-55):

```text
TANZKURSE | EVENTS & WORKSHOPS | TEAM | FOTOS | KONTAKT | MEHR
```

Das Mapping ist **A-artig**: bestehende, kaufnahe Repo-Adressen bleiben stabil. Die Funnel-IA B und der Schule/Nights-Split C sind verworfen. Keine neue `/probestunde`-Pflichtadresse, kein `/schule`- oder `/nights`-Haus.

Beleg der Freigabe: [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md:3-11).

## 1. Hauptnavigation

| Nav-Label | Ziel | Dropdown / Inhalt |
|---|---|---|
| **TANZKURSE** | `/tanzkurse` | Neue und laufende Kurse, Salsa, Bachata, Heels, Sommerkurse, Workshops, Preise, Schnupperstunde, Kursstruktur, Levels |
| **EVENTS & WORKSHOPS** | `/events` | Danceflow Nights, Workshops, Anniversary Weekend, FLOWeekend, Eventkalender |
| **TEAM** | `/team` | Inhaber, Lehrer, Pushflowers, DJ, Eventmanager, Allrounder; Fotos und belegte Kurztexte |
| **FOTOS** | `/fotos` | Kurse, Events und flexibel ergänzbare neue Eventbilder |
| **KONTAKT** | `/kontakt` | Location, Kontaktformular, Raumvermietung, WhatsApp |
| **MEHR** | `/mehr` | FAQ und Collabs; keine neue Sammelstruktur darüber hinaus |
| **Header-CTA** | `/kontakt#schnupperstunde` oder bestätigter Kursplan-/Buchungszielpfad | Label bis Bestätigung: **„Probestunde anfragen“**, nicht „gratis“ |

Die Navigation behält damit exakt die vom Kunden gewünschte Benennung. Die URL-Struktur wird nur dort geschärft, wo der Repo-Baum bereits ein stabiles Ziel bietet.

## 2. Kanonischer Seitenbaum

```text
/
├── /tanzkurse
│   ├── /tanzkurse/salsa
│   ├── /tanzkurse/bachata
│   └── /tanzkurse/heels
├── /privatstunden
├── /kursaufbau
├── /preise
├── /kursplan
├── /events
│   ├── /events/danceflow-night              (kanonisch; Altpfad 301)
│   ├── /events/anniversary-weekend         (kanonisch; Altpfad 301)
│   ├── /events/floweekend                  (kanonisch; Altpfad 301)
│   └── /events/kalender                     (kanonisch; Altpfad 301)
├── /shows-animationen
├── /team
├── /fotos
├── /kontakt
│   └── /kontakt/standort-raumvermietung
├── /mehr
│   ├── /mehr/collabs
│   ├── /mehr/tanzschuhe
│   └── /mehr/partys
├── /faq
├── /impressum
├── /datenschutz
├── /buchung
│   ├── /buchung/erfolg
│   └── /buchung/abbruch
└── /admin
```

`/buchung*` und `/admin` sind technische bzw. private Routen, nicht Teil der Hauptnavigation. Sie bleiben `noindex` gemäss [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:81-89) und dem SEO-Plan ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:139-145).

### 2.1 URL-Regeln

- **Behalten:** `/tanzkurse/*`, `/privatstunden`, `/kursaufbau`, `/preise`, `/kursplan`, `/team`, `/fotos`, `/kontakt`, `/shows-animationen`, `/mehr/*`.
- **Schärfen:** Event-Details und der Kalender werden einheitlich unter `/events/*` geführt. Bestehende `/events-workshops/*`-Pfade erhalten einstufige 301-Ziele.
- **Nicht bauen:** `/probestunde` als neue Pflichtseite, `/schule/*`, `/nights/*`, `/studio/*`, `/club/*` oder `/uns/*`.
- **Mehr bleibt:** Kundenwunsch, aber inhaltlich dünn: FAQ und Collabs zuerst; vorhandene Ratgeber-/Party-Adressen nur mit belegtem Inhalt pflegen.
- **Englisch:** spätere Phase unter `/en/*`; in dieser IA keine halbe Sprachfassung und keine stillen Route-Umzüge.

### 2.2 Redirect-Gate

Die vollständige Redirect-Matrix wird als eigener technischer Plan erstellt. Sie muss alle 22 Live-Adressen aus [`03-seo-audit.md`](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md:97-112) sowie die internen Event-Umzüge abdecken:

- 301, einstufig, mit und ohne abschliessenden Slash.
- Kein pauschales Ziel `/`.
- Live-Tippfehler wie `philisophie` und `anniverysary` werden nicht übernommen.
- Jedes Ziel muss ein passendes 200-Ziel sein.

## 3. Home-Informationsarchitektur

Die Kundenreihenfolge aus dem Eingangsdokument bleibt als Inhaltsvertrag erhalten ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:44-51)). Die konkrete Section-Spec entscheidet später über Layout, nicht über die Reihenfolge der Jobs:

1. **Team + kurzer Text über uns** — familiäre Einführung, echte Teamfotos.
2. **Unser Angebot / Kurskalender** — neue, laufende und filterbare Kurse; echte Zustände.
3. **Reguläre Tanzkurse** — Salsa, Bachata, Heels und passende Einstiege.
4. **Privatstunden** — individueller Weg mit Anfrage-CTA.
5. **Animationen / Shows** — eigene B2B-Suchabsicht, nicht mit Party-Content vermischen.
6. **Geschenkgutschein** — nur mit bestätigtem Ablauf und Preis; sonst `PLACEHOLDER`.
7. **News** — kommende Events und neue Kursbeginne, nur mit belegten Daten.

Zusätzlich sitewide: WhatsApp, Google-Bewertung nur bei primär belegtem Proof, Instagram und Facebook nur mit bestätigten offiziellen Links ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:52-55)).

**Hero-Gate:** Der erste Paint darf nicht leer wirken. Es braucht ein sofort sichtbares, echtes Bild oder eine gleichwertig starke visuelle Fallback-Fläche. Beleg des Problems: [`04b-seo-critic.md`](/root/clients/salsaflow-dc/website-plan/04b-seo-critic.md:9) und Screenshot [`vercel-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-home.png).

## 4. Angebots- und Level-Logik

### 4.1 Salsa und Bachata

- Beginner Stufe 1–6.
- Beginner Flow.
- Intermediate Stufe 7–12.
- Intermediate Flow.
- Advanced ab Stufe 13.
- Salsa On1 und On2 als Kursvariante, nicht als eigene Hauptnavigation.

### 4.2 Heels

- Beginner.
- Intermediate.
- Advanced.

### 4.3 Sommerkurse

- Einmal jährlich.
- Drei Wochen im August.
- Spezieller Preis.
- Preis und konkrete Daten nur aus bestätigten Kursdaten anzeigen.

Diese Struktur ist im Kundenextrakt belegt ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:11-22)) und wird durch die data-driven Level-Leiter in [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:370-447) technisch erklärt.

## 5. Buchung, Kontakt und Anfrage — fachliche IA-Spec

### 5.1 Regulärer Kurs

```text
/tanzkurse oder /kursplan
→ Kurs / Level / Termin wählen
→ /buchung?course=<id>
→ Kontakt, Rolle/Modus, Tarif
→ serverseitige Kapazitätsprüfung
→ Stripe Checkout
→ /buchung/erfolg oder /buchung/abbruch
```

Die Buchung darf keinen Kunden-Login voraussetzen. `confirmed` entsteht erst nach verifiziertem Stripe-Webhook; freie Kapazität, Warteliste und Rollenbalance werden serverseitig entschieden ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:550-629)).

### 5.2 Probestunde

Der Einstieg bleibt über Header, Home und FAQ möglich. Bis zur Kundenbestätigung wird nur **„Probestunde anfragen“** verwendet. „Gratis“ ist gesperrt, weil der Claim im SEO-Plan als ungeprüft markiert ist ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:201-215)).

Das Ziel kann zunächst `/kontakt#schnupperstunde` bleiben. Eine eigene `/probestunde`-Route wird ausdrücklich nicht aus B/Funnel-Varianten übernommen.

### 5.3 Privatstunden

```text
/privatstunden
→ Nutzen, Zielgruppen und belegte Preise
→ Anfrageformular
→ E-Mail / Backend an info@salsaflow-dc.com
→ persönliche Terminabstimmung
```

Kein Fake-Kalender und kein verpflichtender Self-Checkout. Das ungeeignete Privatstunden-Motiv wird ersetzt; die Lücke ist in [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-32) als P-01 belegt.

### 5.4 Shows und Raumvermietung

- `/shows-animationen` bleibt eine eigene Suchabsicht mit Anfrageformular.
- `/kontakt/standort-raumvermietung` bleibt eine eigene Raumvermietungs- und Standort-Absicht.
- Beide dürfen ein gemeinsames Backend nutzen, aber nicht zu einer einzigen SEO-Seite verschmelzen.

## 6. Interne Verlinkung

Jede öffentliche Geldseite braucht einen sichtbaren nächsten Weg:

| Seite | Pflichtziele im Inhalt |
|---|---|
| `/tanzkurse` und Stilseiten | `/kursaufbau`, `/preise`, `/kursplan`, `/faq`, passende Nachbarstile |
| `/kursaufbau` | Stilseiten, `/kursplan`, Probestunden-Anfrage |
| `/preise` | `/kursplan`, `/tanzkurse`, `/privatstunden`, `/faq` |
| `/kursplan` | Buchung, WhatsApp bei Fragen, Stil-/Level-Kontext |
| `/privatstunden` | Anfrageformular, Kontakt, FAQ |
| `/events` und Eventseiten | kommende Termine nur belegt, `/tanzkurse`, Kontakt |
| `/team` und `/fotos` | `/tanzkurse`, `/privatstunden`, `/kontakt` |
| `/faq` | jeweils passende Zielseite statt pauschal Home |

Grundlage: SEO-Regeln in [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:219-243).

## 7. IA-Abnahme-Gates

- Hauptnavigation lautet exakt: TANZKURSE · EVENTS & WORKSHOPS · TEAM · FOTOS · KONTAKT · MEHR.
- Keine B-Funnel- oder C-Schule/Nights-Routen.
- Stabile Repo-URLs bleiben erhalten; Event-Umzug wird vollständig gemappt.
- Home enthält alle sieben Kunden-Blöcke.
- Level- und Sommerkurs-Logik ist sichtbar und datengetrieben.
- Schnupper-Claim bleibt ohne Freigabe neutral.
- Privatstunden-Motiv wird ersetzt; Hero darf nicht leer sein.
- Jedes inhaltliche Bild erhält einen sichtbaren, bildgenauen Alt-Text; dekorative Bilder `alt=""` gemäss [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-32) und [`05-ia-entwurf-a.md`](/root/clients/salsaflow-dc/website-plan/05-ia-entwurf-a.md:369-387).
- Keine Reviews, Ratings, Termine oder Zahlen ohne Primärbeleg.

**Ende des verbindlichen IA-Locks.**
