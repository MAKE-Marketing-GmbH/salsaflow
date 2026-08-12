# 10 — Roadmap (P0 / P1 / P2)

**Stand:** 2026-08-12  
**Modus:** PLAN only — kein Production-Code in dieser Welle  
**REPO_STAND:** MITNUTZEN (Repo nutzen, nie Source of Truth)  
**IA-Lock:** Kunden-Baseline A-artig — [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md)  
**Design-Lock:** **A — Warme Bühne** — Bleed-Hero Studio-Foto, roter Kant-Marker, Text links warm, `bg-soft` Editorial darunter; Cal Sans / Afacad, salsa `#ad1827`  
**Run-IDs:** Lauf 1 `wf_c3729fb9-2f4` · Lauf 2 `wf_bc3d758d-083` · Lauf 3 `wf_29643fc6-3fa`

## 0. Vertrag der Umsetzungswelle

Die Relaunch-Implementierung ist erfüllt, wenn:

1. Öffentliche Routen der freigeschriebenen Sitemap live-fähig sind (Nav, Copy, Specs, States).
2. Design **A — Warme Bühne** konsequent sitzt (Hero-Gate, Tokens, Motion) und B/C nicht still reinkommen.
3. Asset-P0 Privatstunden-Motiv gelöst ist (Zwischenlösung freigegeben **oder** Neu-Shooting).
4. Claims nur aus Proof-Inventar / Kunden-Doc / Live; keine Reviews/Sterne ohne Primärquelle.
5. Booking/Payment den Frozen Rules aus [`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md) folgt; offene Payment-/Storno-Blocker vor Live-Zahlung geklärt.

**Quellen-Rang:** Recherche → Live → Repo (MITNUTZEN) → nur belegbare Facts.

---

## 1. Gates (Status)

| Gate | Status | Entscheidung | Beleg |
|---|---|---|---|
| **G-IA** | ENTSCHIEDEN 2026-08-12 | Kunden-Baseline / A-artig (stabile Adressen). IA-B Funnel und IA-C Schule/Nights **verworfen**. | [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md), [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md) |
| **G-DESIGN** | ENTSCHIEDEN 2026-08-12 | **A — Warme Bühne**. B Club-Nacht und C Warmes Papier **verworfen**; C nur Fallback-Hinweis. | [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md), [`09-mockups/briefs.md`](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md) |

### Design A — verbindliche Lesart

| Element | Vorgabe |
|---|---|
| Hero | Bleed-Studio-Foto, roter Kant-Marker, Text links warm; LCP-Bild eager; nie leerer erster Paint |
| Hero-Asset Home | `/photos/2026/hero-paar-studiowand-01.webp` (Fallback dunkle Fläche + Wordmark) |
| Typo | Display Cal Sans, Body Afacad, Script-Eyebrow Alex Brush genau 1× Hero („Bailar es vivir.") |
| Farbe | salsa `#ad1827` sparsam; Grund hell; dunkle Blöcke nur bewusst |
| Unter Hero | ruhige `bg-soft`-Editorial-Sektionen, Kundenreihenfolge Home-Blöcke 1–7 |
| Motion | eine Signatur `[data-reveal]` Stagger-Fade; Reduced-Motion = sofort sichtbar |
| CTA | ein Primary pro Screen; Label bis Claim-Freigabe **„Probestunde anfragen“** (kein „gratis“) |

**Nicht bauen:** Club-Nacht-Dunkel-Hero (B), paper-warm-Community-First als Hauptrichtung (C), neue Nav-Labels, `/probestunde` als Pflichtroute, Funnel-IA, Schule/Nights-Split.

---

## 2. P0 — Launch-kritisch (zuerst)

Alles hier blockiert soft-launch oder schadet Conversion/Recht/Vertrauen spürbar.

### P0-A — Shell + Design A auf Home

| Feld | Inhalt |
|---|---|
| **Ziel** | `/` im Dialekt A: Navbar Kunden-Baseline, Bleed-Hero, 7 Kundenblöcke, Abschluss-CTA |
| **Copy/Spec** | [`06-seiten/01-home.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md) (kanonisch; ältere `home.md` nur Alt-Entwurf) |
| **Belege** | Screenshots [`screenshots/vercel-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-home.png) (leerer Hero = Anti-Vorbild), [`live-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/live-home.png); Brief [`09-mockups/briefs.md`](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md) |
| **Akzeptanz** | Erster Viewport: Bild + H1 + Primary + Secondary; kein leeres Weiss; Nav exakt TANZKURSE · EVENTS & WORKSHOPS · TEAM · FOTOS · KONTAKT · MEHR; WhatsApp sitewide erreichbar |
| **Repo-Hinweis (MITNUTZEN)** | Bestehende Home-Sektionen / Shell / Tokens in `src/` und `DESIGN.md` prüfen und angleichen — nicht neu erfinden |

### P0-B — Asset Privatstunden (P-01)

| Feld | Inhalt |
|---|---|
| **Ziel** | Falsches Produktmotiv ersetzen |
| **Zwischenlösung (sofort)** | Hero `/photos/2026/hero-paar-dreh-01-portrait.webp`; Ablauf `/photos/2026/hero-paar-studiowand-01.webp` |
| **Echte Lösung** | Shooting 1 Lehrperson + 1 Paar (oder Einzel), 6–8 Motive |
| **Belege** | [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md) P-01; [`06-seiten/07-privatstunden.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md); Screenshots [`vercel-privatstunden.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-privatstunden.png) |
| **Akzeptanz** | Seite verkauft 1:1 / Paar-Unterricht; Alt-Texte bildgenau; kein semantisch ungeeignetes Altmotiv (Auflösung ok) |
| **Entscheidung** | Salsaflow: Freigabe Zwischenlösung **oder** Shooting-Termin (OQ-04) |

### P0-C — Geld-Routen + CTA-Modell

| Route | Primary | Spec |
|---|---|---|
| `/tanzkurse` + Stilseiten | Probestunde / Kursweg | [`02-tanzkurse.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/02-tanzkurse.md), [`03-stilseiten-*.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/03-stilseiten-salsa-bachata-heels.md) |
| `/preise` | Kursplan / buchen | [`05-preise.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/05-preise.md) |
| `/kursplan` | Buchung starten | [`06-kursplan.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/06-kursplan.md) |
| `/privatstunden` | Privat anfragen | [`07-privatstunden.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md) |
| `/events/danceflow-night` | Event-Handlung | [`08-events.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/08-events.md) / danceflow-Spec |
| `/faq` | Einwand → passende Zielseite | [`13-mehr-faq.md`](/root/clients/salsaflow-dc/website-plan/06-seiten/13-mehr-faq.md) |

**Akzeptanz:** Genau ein Primary pro Fokus; kein sitewide „gratis“; Preise/Claims nur freigegeben; States loading/empty/error/success/submitting auf Formularen und Kursliste.

### P0-D — SEO/AEO Launch-Minimum

| Arbeit | Inhalt |
|---|---|
| Meta | Title/Description pro Priority-Route laut SEO-Plan + Copy-Dateien |
| JSON-LD | Nur belegte Organisation/LocalBusiness/Course/Event/FAQ; **kein** Review-Schema ohne Freigabe |
| Index | Öffentlich index; `/buchung*`, `/admin` `noindex` |
| Redirects | 301-Matrix-Plan umsetzen (Live 22 Adressen + Event-Umzug `/events/*`); kein Dump auf `/` |
| OG | 1200×630 aus Bestand (P-09) — mind. Site-Default; ideal Home + Kurse + Privat + Night |

Beleg: [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md), [`03-seo-audit.md`](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md).

### P0-E — Proof- und Claim-Sperre

| ID | Regel bis Freigabe |
|---|---|
| P-02 / OQ-06 | Wall of Love weglassen oder `PLACEHOLDER` — keine Sterne/Zitate |
| S-02 | CTA ohne „gratis“ |
| S-03 / S-10 / C0x | Keine Studiozahl, keine Paarpreis-Erfindung, kein „#1“ / Awards |
| L-01 | Composites ohne Provenienz nicht als „unser Studio“ verkaufen |

### P0-F — Booking-Kern (fachlich vor Live-Zahlung)

| Schritt | Gate |
|---|---|
| Kurs → Rolle/Modus/Tarif → serverseitige Kapazität → `pending_payment` → Stripe Webhook → `confirmed` | Frozen Rules ARCHITEKTUR |
| Return-Routen Erfolg/Abbruch | UX + States |
| OQ-12 Payment (Stripe/TWINT vs. Payrexx) | **Blocker** vor Live-Geld |
| OQ-13 Storno/Refund | **Blocker** vor Live-Geld |
| OQ-14 Mailversand | Hoch vor Buchungsmails |

---

## 3. P1 — hart vor DNS-Cutover

| ID | Paket | Warum | Abhängig von |
|---|---|---|---|
| P1-01 | `/kursaufbau` Level-Leiter sichtbar, datengetrieben | Kaufangst | IA §4, ARCHITEKTUR Level |
| P1-02 | `/team` + Founder-Cutouts; Namen nur nach P-03 | Vertrauen | OQ-05 / P-03 |
| P1-03 | `/fotos` kuratiert; 2026 vor 2023 | Aktualität | Galerie-Assets, Credits L-03 |
| P1-04 | `/kontakt` + Standort/Raum; WhatsApp; Formular-States | Soft-Leads | OQ-07 Annahme |
| P1-05 | `/shows-animationen` B2B-Anfrage; keine Watermark-Fotos | B2B | L-02 |
| P1-06 | Event-Cluster `/events/*` + 301 von Altpfaden | SEO + Nights | Redirect-Matrix |
| P1-07 | Favicon-Set (SVG/PNG) aus Logo | Chrome/PWA | P-10 |
| P1-08 | Alt-Text-Korrektur informative Bilder | a11y | Inventar, OQ-05 |
| P1-09 | Interne Link-Pflicht Geldseiten | SEO+CRO | IA §6 |
| P1-10 | Mockup-Sektionen 2–8 Home im Dialekt A (Plan/Abnahme) | Design-Konsistenz | G-DESIGN A |
| P1-11 | Design-System-Plan + Component-Map in Build anwenden | Tokens/Reuse | `07`, `08` (Close-Welle) |

---

## 4. P2 — nach Launch / nächste Welle

| ID | Paket | Hinweis |
|---|---|---|
| P2-01 | Echte Privatstunden-Shooting-Motive | ersetzt Zwischenlösung P-01 |
| P2-02 | Review-Wall mit freigegebenen Primärquellen | erst nach OQ-06 |
| P2-03 | EN unter `/en/*` nur bestätigte Routen | OQ-08; keine stillen Umzüge |
| P2-04 | Anfahrt/Eingangsfotos (P-07) | No-Show-Reduktion |
| P2-05 | Galerie-Rhythmus nach jeder Night | P-08 |
| P2-06 | AVIF, Orphan-Cleanup 127 Dateien | T-01/T-02 getrennt vom Feature-Commit |
| P2-07 | Tracking/Consent nur nach OQ-16 | kein stilles Pixel |
| P2-08 | Gutschein-Flow wenn Preis/Ablauf freigegeben | sonst `PLACEHOLDER` |
| P2-09 | paper-warm Token-Migration `bg-white` | nur mit Screenshot-Check; C war Fallback, kein Token-Zwang für A |
| P2-10 | Key-Visuals FLOWeekend / Anniversary | Social |

---

## 5. Reihenfolge (empfohlen)

```text
1. Tokens/Shell + Home Hero A (P0-A)
2. Privatstunden-Motiv Zwischenlösung (P0-B) parallel
3. Geld-Routen + CTA-Matrix (P0-C)
4. SEO Meta/JSON-LD/Redirects/OG (P0-D)
5. Claim-/Proof-Sperren im UI durchsetzen (P0-E)
6. Booking Happy Path + Error States (P0-F) — Live-Zahlung erst nach OQ-12/13
7. P1 Team/Fotos/Kontakt/Events/Shows
8. DNS-Cutover-Checkliste (siehe §7)
9. P2 Content/Assets/EN/Tracking
```

Repo MITNUTZEN: bestehende Komponenten (`SeoHead`, BookingPanel, Home-Sections, Tokens) zuerst mappen ([`08-component-map.md`](/root/clients/salsaflow-dc/website-plan/08-component-map.md) sobald Close fertig), dann Specs drauflegen — keine Parallel-Designwelt.

---

## 6. Definition of Done je Priorität

### P0 DoD

- [ ] Home A: Bleed-Hero mit LCP-Bild, roter Marker, Primary „Probestunde anfragen“
- [ ] Nav exakt Kunden-Baseline
- [ ] Privatstunden ohne falsches Produktmotiv (Zwischenlösung freigegeben)
- [ ] Priority-Geldseiten Copy FINAL aus `06-seiten/` umgesetzt
- [ ] Kein unbelegter Proof; kein „gratis“ ohne S-02-Freigabe
- [ ] Redirect- und noindex-Regeln für kritische Pfade
- [ ] Booking-Statusdiagramm im UI abbildbar; Live-Payment erst nach Blocker-Klärung

### P1 DoD

- [ ] Alle Nav-Ziele + Kern-Unterseiten responsive Desktop-first
- [ ] Alt-Texte informative Bilder korrigiert
- [ ] Event-301 und Team/Fotos/Kontakt abgenommen
- [ ] States und a11y-Basics (Focus, Labels) auf Formularen

### P2 DoD

- [ ] Backlog abgearbeitet oder bewusst verschoben mit Besitzer
- [ ] EN/Tracking/Reviews nur mit freigegebenen Daten

---

## 7. Cutover-Checkliste (kurz)

1. Live-Jimdo 22 URLs → neue Ziele 301 getestet (mit/ohne Slash).
2. `salsaflow-dc.com` DNS → Vercel nur nach P0 DoD.
3. GBP/Maps-NAP gegen Kontaktseite abgleichen ([`01b-online-praesenz.md`](/root/clients/salsaflow-dc/website-plan/01b-online-praesenz.md)).
4. OG-Preview WhatsApp einmal manuell.
5. Buchung Testmodus Ende-zu-Ende; Webhook-Idempotenz.
6. Impressum/Datenschutz freigegeben (OQ-15) — sonst Legal-Risiko, nicht „Design-fertig“.

---

## 8. Explizit out of scope dieser Roadmap

- Production-Code in `website-plan/`-Welle (bereits verboten)
- Stille Gate-Defaults / Wiederbelebung von IA-B/C oder Design-B als Default
- Erfundene Reviews, Rankings, Zertifikate
- Änderung Frozen Rules in DESIGN/DECISIONS/ARCHITEKTUR ohne Raphael-Eintrag
- Ads/kreative Greenfield-Kampagnen (an `kimi-worker`)

---

## 9. Nächste konkrete Aktionen (Menschen)

| Wer | Aktion |
|---|---|
| Raphael / Salsaflow | OQ-04 Privatstunden-Zwischenlösung freigeben oder Shooting |
| Salsaflow | OQ-06 Review-Freigaben; OQ-12/13 Payment+Storno |
| Build-Welle | P0-A starten gegen `01-home.md` + Brief A |
| Sol/Final-Critic | DoD-Löcher in `13-final-critic.md` nach Close |
