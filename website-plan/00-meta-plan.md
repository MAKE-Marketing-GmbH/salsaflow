**Run-ID Lauf 1:** `wf_c3729fb9-2f4` (2026-08-12) — Gate G-IA

# Salsaflow Dance Company — Meta-Plan Website-Relaunch

**Rolle:** Meta-Planner  
**Stand:** MITNUTZEN  
**Umfang:** `SCOPE=FULL`  
**Arbeitsmodus:** Planung בלבד; kein Production-Code, keine Backend-Implementierung, keine Live-Veröffentlichung.

## 1. Vertrag und Beweisziel

Dieses Dokument steuert die vollständige Planungs- und Audit-Welle für die Website von Salsaflow Dance Company. Der Plan ist erfüllt, wenn:

- Live-Site und aktuelle Vercel-Site anhand reproduzierbarer Browser-/CDP-Screenshots kritisch verglichen sind.
- Alle im öffentlichen Website-Content verwendeten Bilder einen passenden Alt-Text oder eine begründete Kennzeichnung als dekorativ haben.
- Live `/fotos-1/` als Bild-Quelle der Wahrheit gegen die Repo-Assets geprüft ist; Unterschiede, Qualität und Ersatzkandidaten sind dokumentiert.
- Die Privatstunden-Bilder auf der Vercel-Repo-Seite als eigener Asset-Check behandelt sind; semantisch ungeeignete Kandidaten werden nur durch belegte Live-/Repo-Assets ersetzt (Auflösung ok).
- Eine klare Informationsarchitektur (IA), SEO/AEO-Struktur und Layout-Logik vorliegt.
- Der Backend-/Booking-/Payment-Flow als fachliche Planung beschrieben ist und die Frozen Rules aus [DECISIONS.md](/root/clients/salsaflow-dc/DECISIONS.md) sowie [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md) nicht bricht.
- Für jede Welle ein Gate, ein überprüfbarer Output und ein Definition-of-Done vorliegen.

**Beweisregel:** Jede Feststellung im späteren Audit erhält eine Quelle: URL + Screenshot/Viewport oder absoluter Repo-Pfad + Zeile bzw. Befehl und Ausgabe. Unbelegte Reviews, Rankings, Zertifikate, Kundenstimmen und Erfolgsbehauptungen bleiben draußen. Nicht vorhandene Belege werden als `PLACEHOLDER` markiert.

## 2. Quellenbasis

### 2.1 Verbindliche Regeln

- [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md): Locked Designsystem v2. Belegt Farben, Fonts, Formen, Motion, Bildregeln, SEO-Grundregel und State-Coverage; insbesondere `#0a0a0a`, `#ad1827`, Cal Sans, Afacad, Du-Kommunikation und `[data-reveal]`.
- [DECISIONS.md](/root/clients/salsaflow-dc/DECISIONS.md): Frozen Rules und bisheriger Wellenstand. Es gilt der aktuelle Inhalt, nicht alte Historie oder alte Review-Texte.
- [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md): Frozen Rules für Backend, Datenmodell, Rollen-/Kapazitätslogik, Statusdiagramm und Stripe/TWINT-Flow. Lesen und in den Plan übersetzen, nicht neu entscheiden.

### 2.2 Aktuelle Implementierungs- und Asset-Quellen

- Repo-Frontend: `/root/clients/salsaflow-dc/src/`.
- Repo-Assets: `/root/clients/salsaflow-dc/public/`.
- Asset-Quelle der Wahrheit: [Live-Fotogalerie](https://www.salsaflow-dc.com/fotos-1/).
- Live-Site: [salsaflow-dc.com](https://www.salsaflow-dc.com/).
- Live-Fotos zusätzlich: [salsaflow-dc.com/fotos-1/](https://www.salsaflow-dc.com/fotos-1/).
- Aktuelle Vercel-Site: die für den Audit ermittelte Preview-/Deployment-URL; URL, Commit/Build-Zeitpunkt und Screenshot werden im Audit-Log festgehalten.
- SEO-/Routing-Quellen im Repo: `src/routes.tsx`, `src/components/SeoHead.tsx`, `src/lib/seo-config.ts`, `src/lib/seo-schema.ts`, `src/lib/seo.tsx`.
- Booking-/Payment-Quellen im Repo: `src/public/BookingPanel.tsx`, `src/public/BookingReturn.tsx`, `src/lib/booking.ts`, `src/lib/payments.ts`, `src/lib/schema.ts`.

### 2.3 Audit-Instrumente

- Browser/CDP-Screenshots mit URL, Viewport, Motion-Einstellung und Datum.
- `find`, `file`, Bild-Dimensionen/Dateigrösse und Hash-Vergleich für Repo-Assets.
- `grep`/AST- oder statischer Scan für `<img>`, Background-Images, `alt`, `aria-hidden`, SEO-Metadaten und JSON-LD.
- HTTP-Status/Redirect-Check für Live-URLs.

## Vertrags-Artefakt → tatsächliche Datei

| Vertrags-Artefakt | Tatsächliche Datei |
|---|---|
| `01-live-critique` | [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md) + Parent-Screenshot-Notizen |
| `02-asset-audit` | [`02-asset-inventar.md`](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md) |
| `03-alt-text-inventory` | [`02-asset-inventar.md`](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md), Alt-Spalte |
| `04-ia-seo-aeo-plan` | [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md) + [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md) |
| `05-layout-logic` | [`06-seiten/`](/root/clients/salsaflow-dc/website-plan/06-seiten/) — nummerierte Seiten-Specs |
| `06-booking-backend-flow` | [`README-BACKEND.md`](/root/clients/salsaflow-dc/README-BACKEND.md) + [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md) |
| `07-implementation-backlog` | [`10-roadmap.md`](/root/clients/salsaflow-dc/website-plan/10-roadmap.md) |
| `08-qa-gates` | [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md) + QA-Teil von [`07-design-system-plan.md`](/root/clients/salsaflow-dc/website-plan/07-design-system-plan.md) |

Die folgenden Vertragsabschnitte verwenden diese tatsächlichen Dateinamen. Der DoD prüft die Artefakte über dieses Mapping, nicht über die überholten Vertragsnamen.

## 3. Deliverables

1. `00-meta-plan.md` — dieser Steuerungsplan, Quellen, Phasen, Gates, Rollen, DoD und Scope.
2. `01-live-critique.md` — belegter Vergleich Live vs. aktuelle Vercel-Site: Screenshot-Index, Stärken, harte Kritik, Priorität, betroffene Route/Viewport.
3. `02-asset-audit.md` — Repo-/Live-Audit mit Asset-Map, Dimensionen, Qualität, Duplikaten, fehlenden Bildern und Ersatzkandidaten; Privatstunden separat.
4. `03-alt-text-inventory.md` — vollständige Bildliste mit Route, Quelle, Bildfunktion, aktuellem Alt-Text, vorgeschlagenem Alt-Text oder `DECORATIVE`; keine erfundenen Personen-/Ortsdetails.
5. `04-ia-seo-aeo-plan.md` — Seitenbaum, interne Verlinkung, Seitensuchintention, Title/H1/Description-Regeln, strukturierte Daten, FAQ-/AEO-Fragen, Indexierungsregeln.
6. `05-layout-logic.md` — wiederverwendbare Layout- und Section-Logik gemäß DESIGN.md; pro Route Fokus, Reihenfolge, CTA, Bildrolle und Zustände.
7. `06-booking-backend-flow.md` — fachlicher Booking-/Backend-/Payment-Plan gemäß ARCHITEKTUR.md; Statusdiagramm, Rollen, Kapazität, Warteliste, Webhook, Mail, Fehlerfälle und Admin-Grenzen.
8. `07-implementation-backlog.md` — priorisierte Umsetzungspakete mit Akzeptanzkriterien, Abhängigkeiten und Rückfragen; kein Code.
9. `08-qa-gates.md` — Prüfmatrix für Content, Assets, SEO/AEO, responsive Screens, a11y, Booking-States und Datenschutz.
10. `11-open-questions.md` — offene Entscheidungen als ausfüllbares Skelett; jede Frage mit Besitzer, Kontext, Blockierwirkung und Belegfeld.

**Bewusst keine Deliverables:** neue Bilder, erfundene Testimonials, erfundene Ratings, Fake-Proof, Code-Patches, Migrationen, Datenbankänderungen oder Deployment.

## 4. Phasen und Gates

### Phase 0 — Quellen- und Scope-Lock

- Frozen Rules lesen und als Constraints in jedem Folge-Dokument referenzieren.
- Live-Root, Live `/fotos-1/` und aktuelle Vercel-URL mit Datum/URL erfassen.
- Routenliste aus dem aktuellen Repo und öffentlich erreichbaren Live-Routen abgleichen.
- `SCOPE=FULL` festhalten; keine implizite Reduktion auf nur Home.

**Output:** Quellenregister, Routenregister, Audit-Konventionen.  
**Gate G-IA:** Erst weiter, wenn Routen, Zielgruppen, Primäraktionen und öffentliche/private Grenzen nachvollziehbar erfasst sind. Fehlende Daten als `OPEN` markieren.

### Phase 1 — Live-/Vercel-Kritik

- Gleiche Kernrouten und Viewports aufnehmen: Desktop breit, Desktop kompakt, Mobile hoch.
- Pro Screenshot dokumentieren: URL, Viewport, Motion, Ladezustand, sichtbare CTA, Bild, Text, Layoutbruch.
- Kritik nach Wirkung sortieren: Orientierung, Vertrauen, Conversion, Lesbarkeit, a11y, Performance-Anzeichen.
- Keine Behauptung aus Bauchgefühl als Fakt ausgeben; Interpretation als `BEWERTUNG` kennzeichnen und Screenshot referenzieren.

**Output:** `01-live-critique.md`.  
**Checkpoint:** Wenn Live oder Vercel nicht erreichbar ist, Audit mit den erreichbaren Quellen fertigstellen und die fehlende URL samt Befehl/Fehler als Blocker notieren.

### Phase 2 — Asset- und Alt-Text-Audit

- Alle Bildquellen in `src/` und `public/` erfassen, einschließlich CSS-/Content-/Manifest-Verweisen.
- Live `/fotos-1/` als Qualitäts- und Motivvergleich nutzen.
- Für jedes verwendete Bild Funktion bestimmen: informativ, kontextgebend oder dekorativ.
- Alt-Texte beschreiben nur belegbare Bildinhalte; Namen, Rollen, Orte und Ereignisse nicht aus dem Bild raten.
- Privatstunden-Assets separat markieren: aktueller Kandidat, Live-Referenz, Auflösung, Crop-Eignung, Ersatzentscheidung.

**Output:** `02-asset-audit.md`, `03-alt-text-inventory.md`.  
**Gate:** Keine Alt-Text-Lücke für ein öffentlich verwendetes informatives Bild; ungeklärte Motive bleiben `PLACEHOLDER` statt erfunden.

### Phase 3 — IA, SEO/AEO und Layout

- Seiten nach Suchintention und Nutzeraufgabe gruppieren: Kurse finden, Schnupperstunde buchen, Privatstunde anfragen, Events entdecken, Team/Vertrauen, Kontakt/Standort, FAQ/Legal.
- Jede öffentliche Route erhält genau eine Hauptintention, eine klare H1 und eine primäre Aktion.
- Vollständiger sichtbarer Text bleibt im HTML; private App-Routen bleiben `noindex` gemäß DESIGN.md.
- AEO-Fragen als echte, beantwortbare Inhalte planen: Wer, wo, wann, Preis, Einstufung, Einstieg, Rolle, Paar/solo, Storno, Kontakt. Nur bestätigte Antworten veröffentlichen.
- Layout nach dem Locked System planen: Shell, ein Fokuspunkt pro Screen, sparsame Salsa-Akzente, echte Bilder, `rounded-full`-Buttons, `[data-reveal]`-Stagger und Reduced-Motion-Fallback.

**Output:** `04-ia-seo-aeo-plan.md`, `05-layout-logic.md`.  
**Gate G-DESIGN:** IA und Layout bestehen gegen DESIGN.md, ohne neue Farben/Fonts/Radius-/Motion-Sprache und ohne Fake-Proof.

### Phase 4 — Booking-/Backend-Fachplanung

- Öffentliche Kursdaten und private Teilnehmer-/Buchungsdaten trennen.
- Buchung serverseitig starten: Kurs, Rolle/Modus, Tarif, Kapazität und Warteliste transaktional prüfen.
- `pending_payment` reserviert Platz; erst verifizierter Stripe-Webhook mit `succeeded` macht `confirmed`.
- TWINT/Karte/Wallets über Stripe Checkout einplanen; Webhook-Idempotenz über `payment_events`.
- Storno, Ablauf, Warteliste, Mailversand, Admin-Balance und Fehlerzustände als fachliche Szenarien beschreiben.
- Keine neue Backend-Architektur gegen ARCHITEKTUR.md erfinden; offene Kundenentscheidungen als Fragen auslagern.

**Output:** `06-booking-backend-flow.md`.  
**Gate:** Jeder Statuswechsel, jede private Datenfläche und jeder Payment-Fehler hat eine definierte Behandlung oder ist ausdrücklich `OPEN`.

### Phase 5 — Umsetzungsbacklog und QA

- Arbeit in kleine Pakete schneiden: Content/IA, Assets/Alt, Layout, SEO/AEO, Booking-UI, Backend, Payment, QA.
- Jede Karte bekommt Zielpfad, Akzeptanzkriterien, Beweis und Abhängigkeit.
- QA-Matrix deckt loading, empty, error, success, disabled/submitting und mobile Notiz ab.
- Browser-Sichtprüfung und Build-Prüfung erst in der Implementierungswelle; in diesem Auftrag nur als Plan-Schritt definieren.

**Output:** `07-implementation-backlog.md`, `08-qa-gates.md`.  
**Abschluss-Gate:** Alle Deliverables vorhanden, jede unbelegte Aussage markiert, offene Entscheidungen in `11-open-questions.md` gesammelt.

## 5. Rollen-Wellen

Rollen sind Fähigkeiten, keine festen Worker-Pflichtnamen. Die Zuweisung erfolgt je Paket.

- **Meta-Planung:** Scope, Quellen, Gates, Abhängigkeiten, Konfliktauflösung.
- **Browser-/Evidence-Audit:** Live/Vercel-Screenshots, URL-/Viewport-Register, harte belegte Kritik.
- **Asset-/Accessibility-Audit:** Bildinventar, Dimensionen, Alt-Texte, dekorative Kennzeichnung, Privatstunden-Qualität.
- **IA-/SEO-/AEO-Planung:** Seitenbaum, Suchintention, interne Links, Metadaten, JSON-LD, FAQ-Antworten.
- **Design-/Layout-Planung:** Umsetzungsspezifikation innerhalb DESIGN.md; keine neue Designwelt.
- **Booking-/Backend-Planung:** Übersetzung der Frozen Rules in User Flow, Zustände, Admin- und Integrationsschnittstellen.
- **QA-/Evidence-Planung:** Akzeptanzkriterien, Testmatrix, Screenshot- und Build-Belege.

### Empfohlene Reihenfolge der Wellen

1. Meta + Browser parallel nach Quellen-Lock.
2. Asset/Alt parallel zu Route-/IA-Inventar.
3. IA/SEO/AEO und Layout nach Live-/Asset-Befunden.
4. Booking-/Backend-Planung nach Frozen-Rule-Check.
5. Backlog + QA als Zusammenführung.

## 6. Definition of Done

- Alle zehn benannten Plan-/Audit-Outputs sind vorhanden oder als begründet blockiert markiert.
- `SCOPE=FULL` ist abgedeckt: Home, öffentliche Unterseiten, Events, Galerie, Kontakt, Legal und booking-nahe Routen; private Admin-Flächen sind als `noindex`/nicht öffentlich abgegrenzt.
- Jede Route hat Zweck, Haupt-CTA, H1-/SEO-Richtung, Bildrollen und State-Hinweis.
- Jedes verwendete informative Bild hat einen belegbaren Alt-Text; dekorative Bilder sind explizit als dekorativ markiert.
- Live-Fotos und Repo-Assets sind mit überprüfbaren Pfaden/URLs, Dimensionen und Qualitätsentscheidungen verbunden.
- Keine erfundenen Bewertungen, Stimmen, Zertifikate, Rankings, Namen, Zahlen oder Kundenbelege.
- Backend-/Booking-/Payment-Plan stimmt mit dem gültigen Stand überein: Drizzle + eingebettetes PGlite (dev), serverseitige Buchungsprüfung, Rollen-/Kapazitätslogik, Warteliste, Stripe Checkout, verifizierter Webhook; Prod-DB-Hosting ist bei Raphael offen.
- G-IA und G-DESIGN sind als bestanden oder mit konkretem Blocker dokumentiert.
- Keine Production-Datei wurde geändert; die Plan-Dateien sind die einzigen Outputs dieses Auftrags.

## 7. SCOPE=FULL und bewusst OUT-OF-SCOPE

### In Scope

- Vollständiger Website-Audit von Live, aktueller Vercel-Site und Repo-Stand.
- Alle öffentlichen Routen und relevante Booking-/Return-Zustände.
- Bildqualität, Bildquelle, Alt-Texte, Privatstunden-Ersatzplanung.
- IA, SEO, AEO, interne Verlinkung, strukturierte Daten und Indexierungslogik.
- Layoutlogik, responsive Prüfziele, a11y- und State-Anforderungen.
- Fachliche Backend-/Booking-/Payment-Anfrage gemäß Frozen Rules.
- Umsetzungsreihenfolge, Gates und überprüfbare Akzeptanzkriterien.

### Bewusst OUT-OF-SCOPE

- Production-Code, CSS-/React-/Backend-Edits, Datenbankmigrationen und Schemaänderungen.
- Deployment, Vercel-Konfiguration, DNS, Tracking, Mailprovider-Onboarding und Payment-Live-Schaltung.
- Erzeugung, Retusche oder KI-Generierung neuer Menschen-/Teamfotos.
- Veröffentlichung von Testimonials, Ratings, Zertifikaten, Rankings oder sonstigem Proof ohne Originalquelle.
- Rechtliche oder steuerliche Freigabe; offene Punkte werden an die zuständige Person geroutet.
- Änderung von DESIGN.md, DECISIONS.md oder ARCHITEKTUR.md.
- Zusätzliche kreative Neuentwicklung außerhalb der Locked Design Rules.

## 8. Routing offener Arbeit

- Offene Codeprobleme und technische Fixes: an `grok-worker` oder Sol.
- Ads und kreative Neuentwicklung: an `kimi-worker`.
- Frontend-/Writing-Ausarbeitung: an `opus-builder`.
- Dieses Meta-Paket entscheidet nicht eigenmächtig über offene Kundenfragen; es sammelt sie mit Beleg, Besitzer und Gate.
