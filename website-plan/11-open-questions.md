# Salsaflow Dance Company — Offene Fragen

**Status:** gepflegt nach G-IA + G-DESIGN (2026-08-12)  
**Scope:** `SCOPE=FULL`  
**Regel:** Keine offene Frage wird durch Annahme als Fakt ausgegeben. Fehlende Belege bleiben `OPEN` oder `PLACEHOLDER`.

## Ausfüllschema

Für jede Frage:

- **ID:** `OQ-XX`
- **Bereich:** IA / Content / Asset / Alt-Text / SEO-AEO / Layout / Booking / Backend / Payment / Recht / Betrieb
- **Frage:**
- **Warum jetzt:** Welche Phase oder welches Gate hängt daran?
- **Aktueller Beleg:** Absolute Datei-/Zeilenangabe, URL/Screenshot oder `FEHLT`
- **Annahme bis Entscheidung:** `keine` / klar markierte Arbeitsannahme
- **Entscheider:**
- **Priorität:** Blocker / Hoch / Mittel / Niedrig
- **Ziel-Gate:** G-IA / G-DESIGN / Abschluss / Build
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:**

---

## A. Quellen und Live-Audit

### OQ-01 — Aktuelle Vercel-URL

- **Bereich:** Betrieb / Audit
- **Frage:** Welche Vercel-Preview- oder aktuelle Deployment-URL soll als verbindlicher Vergleich zur Live-Site gelten?
- **Warum jetzt:** Live-/Vercel-Vergleich und Cutover brauchen eine benannte URL.
- **Aktueller Beleg:** Run-Registry [`00-run-id.md`](/root/clients/salsaflow-dc/website-plan/00-run-id.md): NEU `https://salsaflow-dc.vercel.app/`; Live Jimdo `https://www.salsaflow-dc.com/`.
- **Annahme bis Entscheidung:** Registry-URLs für Audit und Screenshots.
- **Entscheider:** Raphael / Projektverantwortung
- **Priorität:** Mittel (Audit gelaufen; Cutover später)
- **Ziel-Gate:** Abschluss / Cutover
- **Antwort:** Arbeitsstand 2026-08-12: `https://salsaflow-dc.vercel.app/` als NEU-Referenz; verbindlicher DNS-Cutover noch offen.
- **Entscheiddatum:** 2026-08-12 (Arbeitsstand, nicht DNS-Go-Live)
- **Folgeaktion:** Vor Cutover URL + Commit/Build erneut festhalten.

### OQ-02 — Audit-Stand und Zugriff

- **Bereich:** Audit
- **Frage:** Soll der Audit nur öffentlich sichtbare Zustände prüfen oder auch eingeloggte/private Booking-/Admin-Zustände mit Testzugang?
- **Warum jetzt:** Private Routen dürfen nicht öffentlich bewertet oder indexiert werden.
- **Aktueller Beleg:** [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md) State/noindex; [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md).
- **Annahme bis Entscheidung:** Öffentliche Zustände vollständig; private nur als Plan-/Grenzprüfung ohne Login.
- **Entscheider:** Raphael / Projektverantwortung
- **Priorität:** Mittel
- **Ziel-Gate:** Build / QA
- **Antwort:** Planwelle = öffentlich + Grenzprüfung. Login-QA erst in Implementierung mit Testzugang.
- **Entscheiddatum:** 2026-08-12 (Plan-Annahme bestätigt als Arbeitsmodus)
- **Folgeaktion:** Testuser für Booking/Admin in Build-Welle anlegen.

---

## B. Content, Proof und Assets

### OQ-03 — Bildquelle der Wahrheit

- **Bereich:** Asset
- **Frage:** Soll `/fotos-1/` ausschließlich als Qualitäts-/Motivreferenz dienen oder dürfen belegte Live-Motive direkt als bevorzugte Website-Assets übernommen werden?
- **Warum jetzt:** Lizenz und Motivwahl.
- **Aktueller Beleg:** Inventar: Live-Galerie vor allem 2023 Party; keine Privatstunden/Team-Quelle ([`02-asset-inventar.md`](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md)).
- **Annahme bis Entscheidung:** Live-Galerie = Qualitäts-/Party-Referenz; Hero/Kurse/Team aus Repo `/photos/2026/`, premium, founders — Übernahme fremder Live-Crops nur nach Lizenz.
- **Entscheider:** Raphael / Salsaflow
- **Priorität:** Hoch
- **Ziel-Gate:** Build (G-DESIGN A nutzt bereits Repo-2026-Hero)
- **Antwort:** Für Design A: Home-Hero und Kursmotive aus freigegebenem Repo-Bestand `/photos/2026/`. Live `/fotos-1/` bleibt Referenz, nicht automatische Source of Truth für alle Motive.
- **Entscheiddatum:** 2026-08-12 (Arbeitsentscheid im Asset-/Design-Lock; Lizenz L-03 weiter offen)
- **Folgeaktion:** L-03 Credits/Rechte schriftlich; Lizenz-Register.

### OQ-04 — Privatstunden-Fotos (Asset-P0)

- **Bereich:** Asset / Content
- **Frage:** Welche Motive ersetzen die ungeeigneten Privatstunden-Bilder? Zwischenlösung freigeben oder Shooting?
- **Warum jetzt:** P0 Roadmap; teuerstes Produkt; G-DESIGN A verlangt glaubwürdige Fotos.
- **Aktueller Beleg:** P-01 in [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md); Spec [`07-privatstunden.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md); Screenshots `vercel-privatstunden*`.
- **Annahme bis Entscheidung:** Zwischenlösung Hero `hero-paar-dreh-01-portrait.webp`, Ablauf `hero-paar-studiowand-01.webp` — **noch nicht kundenfreigegeben**.
- **Entscheider:** Raphael / Salsaflow
- **Priorität:** **Hoch / P0**
- **Ziel-Gate:** Build (blockiert weiche Abnahme Privatstunden)
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Freigabe Zwischenlösung **oder** Shooting-Termin 45 Min Studio.

### OQ-05 — Namen und Bildbeschreibungen

- **Bereich:** Alt-Text / Content
- **Frage:** Welche Namen/Rollen sind für Bildbeschreibungen redaktionell bestätigt (Founder-Cutouts P-03)?
- **Warum jetzt:** Falsche Namens-Alts sind peinlich und riskant.
- **Aktueller Beleg:** Dateinamen legen Zuordnung nahe, beweisen sie nicht ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md) P-03).
- **Annahme bis Entscheidung:** Neutrale Alts oder sichtbare Caption; Namen nur aus Textquelle.
- **Entscheider:** Salsaflow Content
- **Priorität:** Mittel
- **Ziel-Gate:** Build Team/Home Founder-Grid
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** 4 Founder + Lehrer-Zuordnung abhaken.

### OQ-06 — Proof-Platzhalter

- **Bereich:** Content / SEO-AEO
- **Frage:** Welche echten Google-/Kundenstimmen sind mit Originalquelle freigegeben?
- **Warum jetzt:** Wall of Love / Review-Schema verboten ohne Quelle (P-02).
- **Aktueller Beleg:** Aggregator-Zahlen ungeprüft; keine Review-Screenshots.
- **Annahme bis Entscheidung:** Fläche weglassen oder `PLACEHOLDER`; kein Review-JSON-LD.
- **Entscheider:** Salsaflow / Raphael
- **Priorität:** Hoch
- **Ziel-Gate:** Build Content; nicht G-DESIGN
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** GBP öffnen, Zitate + Datum + Vorname freigeben.

---

## C. IA, SEO und AEO

### OQ-07 — Primäre Conversion

- **Bereich:** IA / Conversion
- **Frage:** Ist „Probestunde anfragen“ sitewide primär oder route-spezifisch?
- **Warum jetzt:** CTA-Lärm killt Conversion ([`04c-growth-critic.md`](/root/clients/salsaflow-dc/website-plan/04c-growth-critic.md)).
- **Aktueller Beleg:** IA-Lock Header-CTA Probestunde; Growth Intent-Matrix.
- **Annahme bis Entscheidung (Recommended, Build-Default):**  
  - Nav/Header: neutral **„Probestunde anfragen“** (kein gratis).  
  - Body-Primary route-spezifisch: Home/Kurse→Probestunde oder Kursweg; Privatstunden→Privat anfragen; Events→Event-Handlung; Kontakt→Nachricht/WhatsApp.
- **Entscheider:** Raphael / Salsaflow
- **Priorität:** Hoch
- **Ziel-Gate:** Build (G-IA gelöst für Nav-Label-Richtung)
- **Antwort:** Arbeitsdefault = route-spezifischer Body-Primary + einheitlicher Header ohne „gratis“. Endgültige Kundenbestätigung offen.
- **Entscheiddatum:** 2026-08-12 (Plan-Default nach Growth-Critic + IA)
- **Folgeaktion:** Bei Kundenreview CTA-Matrix in 5 Minuten abnicken lassen.

### OQ-08 — Sprachumfang

- **Bereich:** IA / SEO-AEO / Content
- **Frage:** Welche Routen werden dauerhaft DE und EN gepflegt?
- **Warum jetzt:** Hreflang und Pflegeaufwand.
- **Aktueller Beleg:** ARCHITEKTUR DE/EN-Daten; IA: EN erst später `/en/*`.
- **Annahme bis Entscheidung:** DE primär; EN nicht in P0/P1 erzwingen.
- **Entscheider:** Salsaflow / Raphael
- **Priorität:** Mittel
- **Ziel-Gate:** P2
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** EN-Routenliste nach DE-Launch.

### OQ-09 — Strukturierte Daten

- **Bereich:** SEO-AEO
- **Frage:** Welche Schema-Typen sind vollständig belegt?
- **Warum jetzt:** JSON-LD darf keine Fake-Reviews/Preise erfinden.
- **Aktueller Beleg:** `src/lib/seo-schema.ts`; SEO-Plan AEO-Block.
- **Annahme bis Entscheidung:** Organization/LocalBusiness/Course/Event/FAQ nur aus sichtbarem belegtem Content; Review-Schema erst nach OQ-06.
- **Entscheider:** Raphael / Salsaflow
- **Priorität:** Hoch
- **Ziel-Gate:** Build SEO
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Wahrheitstabelle Preis/Adresse/Öffnungszeiten vor JSON-LD-Final.

### OQ-HOME-01 — „zwei Minuten vom Bahnhof“

- **Bereich:** Content
- **Frage:** Ist die Gehzeit-Formulierung im Home-Lead bestätigt?
- **Warum jetzt:** Home-Copy FINAL mit Fallback.
- **Aktueller Beleg:** [`01-home.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md) HOME-01; Adresse Elisabethenanlage 7 belegt.
- **Annahme bis Entscheidung:** Fallback **„direkt beim Bahnhof SBB“**.
- **Entscheider:** Salsaflow
- **Priorität:** Mittel
- **Ziel-Gate:** Build Home
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Gehzeit messen oder Fallback final setzen.

---

## D. Booking, Backend und Payment

### OQ-10 — Kurs-/Preis-Freigabe

- **Bereich:** Booking / Content
- **Frage:** Sind ARCHITEKTUR-Kurs-/Preisdaten verbindlich für den Relaunch?
- **Warum jetzt:** Kursplan, Formular, Schema müssen übereinstimmen.
- **Aktueller Beleg:** ARCHITEKTUR Stammdaten; Copy nutzt nur bestätigte Einzelpreise wo markiert.
- **Annahme bis Entscheidung:** Architektur als Planungsquelle; Live-Abgleich vor Publish.
- **Entscheider:** Fabio / Salsaflow
- **Priorität:** Hoch
- **Ziel-Gate:** Abschluss
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Preis-/Paarlogik S-10 klären.

### OQ-11 — Flow-Leiter und Grenzen

- **Bereich:** Booking / Backend
- **Frage:** Bestätigt Fabio Level-Grenzen Beginner–6, Intermediate–12, Flow als Brücke?
- **Warum jetzt:** Staffel-Duplikation an `level_rungs.ordinal`.
- **Aktueller Beleg:** ARCHITEKTUR; Kunden-IA Level-Logik.
- **Annahme bis Entscheidung:** Keine Änderung Frozen Rule ohne Fabio.
- **Entscheider:** Fabio
- **Priorität:** Hoch
- **Ziel-Gate:** Abschluss
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Kurzes Ja/Nein von Fabio.

### OQ-12 — Stripe/TWINT und Datenstandort

- **Bereich:** Payment / Recht / Betrieb
- **Frage:** Stripe Checkout + TWINT Erstwahl bestätigt, oder Payrexx wegen CH-Datenhaltung?
- **Warum jetzt:** Live-Geld, Datenschutz, Onboarding.
- **Aktueller Beleg:** ARCHITEKTUR Stripe/TWINT-Flow.
- **Annahme bis Entscheidung:** Stripe als Architektur-Erstwahl; **keine Live-Schaltung** ohne Bestätigung.
- **Entscheider:** Raphael / Salsaflow
- **Priorität:** **Blocker**
- **Ziel-Gate:** Abschluss vor Live-Payment
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Entscheidung + Account-Setup.

### OQ-13 — Storno-/Refund-Policy

- **Bereich:** Booking / Payment / Recht
- **Frage:** Bis wann kostenlos stornieren? Volle/anteiliche Refunds?
- **Warum jetzt:** UI, Mails, Admin.
- **Aktueller Beleg:** ARCHITEKTUR verweist; Policy-Text `FEHLT`.
- **Annahme bis Entscheidung:** Keine Policy erfinden.
- **Entscheider:** Salsaflow / Recht
- **Priorität:** **Blocker**
- **Ziel-Gate:** Abschluss vor Live-Payment
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Eine Regel schriftlich, dann UI/Copy.

### OQ-14 — Mailversand

- **Bereich:** Booking / Betrieb
- **Frage:** Resend oder SMTP `info@` für Buchungsmails?
- **Warum jetzt:** notifications, Zustellbarkeit, Datenschutz.
- **Aktueller Beleg:** ARCHITEKTUR offen.
- **Annahme bis Entscheidung:** Provider offen; Mailtypen aus Architektur bleiben.
- **Entscheider:** Salsaflow / Raphael
- **Priorität:** Hoch
- **Ziel-Gate:** Abschluss
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Provider wählen + SPF/DKIM.

---

## E. Recht, Datenschutz und Betrieb

### OQ-15 — Rechtstext-Review

- **Bereich:** Recht / SEO
- **Frage:** Wer gibt Impressum, Datenschutz, Cookie-, Buchungs-/Stornotexte frei?
- **Warum jetzt:** Cutover-Risiko.
- **Aktueller Beleg:** Legal-Routen im Repo; fachliche Freigabe `FEHLT`.
- **Annahme bis Entscheidung:** Bestehende Texte auditieren, nicht als geprüft behaupten.
- **Entscheider:** Salsaflow / Recht
- **Priorität:** Hoch
- **Ziel-Gate:** Abschluss / Cutover
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Reviewer + Termin.

### OQ-16 — Tracking und Consent

- **Bereich:** Betrieb / Recht / SEO
- **Frage:** Welche Analyse-/Marketing-Tools und welcher Consent?
- **Warum jetzt:** Banner, Datenschutz, Messung.
- **Aktueller Beleg:** `FEHLT`.
- **Annahme bis Entscheidung:** Kein neues Tracking planen oder behaupten.
- **Entscheider:** Raphael / Salsaflow
- **Priorität:** Mittel
- **Ziel-Gate:** P2 / nach Launch-Messkonzept
- **Antwort:**
- **Entscheiddatum:**
- **Folgeaktion:** Erst nach Legal + Ziel-KPIs.

---

## Entscheidungslog

| ID | Entscheidung | Datum | Beleg | Folge-Dokumente |
|---|---|---|---|---|
| G-IA | Kunden-Baseline / A-artig; B+C verworfen | 2026-08-12 | User + Eingangs-Doc | [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md), [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md) |
| G-DESIGN | **A — Warme Bühne**; B verworfen; C nur Fallback-Hinweis | 2026-08-12 | Raphael | [`09-mockups/briefs.md`](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md), [`10-roadmap.md`](/root/clients/salsaflow-dc/website-plan/10-roadmap.md), [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md) |
| OQ-01 | Vercel-URL Arbeitsstand `salsaflow-dc.vercel.app` | 2026-08-12 | `00-run-id.md` | Audit/Screenshots |
| OQ-02 | Planwelle öffentlich + Grenzprüfung | 2026-08-12 | Meta-Plan | QA später mit Login |
| OQ-03 | Design-A-Assets aus Repo `/photos/2026/` primär | 2026-08-12 | Asset-Inventar + Brief A | Home/Privat Specs |
| OQ-07 | Default: Header Probestunde anfragen; Body route-spezifisch | 2026-08-12 | Growth-Critic + IA | Roadmap P0-C |

---

## Blocker-Log

| ID | Blocker | Seit wann | Betroffene Phase/Gate | Nächste konkrete Aktion |
|---|---|---|---|---|
| OQ-12 | Payment-Anbieter unbestätigt | 2026-08-12 | Live-Zahlung / Abschluss | Raphael/Salsaflow: Stripe+TWINT vs Payrexx |
| OQ-13 | Storno/Refund-Policy fehlt | 2026-08-12 | Live-Zahlung / Abschluss | Eine schriftliche Regel |
| OQ-04 / P-01 | Privatstunden-Motiv nicht freigegeben | 2026-08-12 | Build Privatstunden P0 | Zwischenlösung freigeben oder Shooting |
| OQ-06 / P-02 | Kein Review-Proof | 2026-08-12 | Content Proof | GBP-Zitate freigeben oder Fläche weglassen |

---

## Geschlossen durch Gates (kein offener Blocker mehr)

| Thema | Ergebnis |
|---|---|
| Informationsarchitektur-Variante | Kunden-Baseline (G-IA) |
| Design-Hauptrichtung | A Warme Bühne (G-DESIGN) |
| Design B Club-Nacht | verworfen |
| Design C als Default | verworfen; nur dokumentierter Fallback |
| Nav-Labels | exakt Kunden-Baseline |
| Hero-Richtung Home | Bleed + Marker + warm links + `bg-soft` Editorial |
