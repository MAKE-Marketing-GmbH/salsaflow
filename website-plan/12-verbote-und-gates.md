# 12 — Verbote und Gates

**Stand:** 2026-08-12 · SCOPE=FULL · REPO_STAND=MITNUTZEN  
**OUT:** [`/root/clients/salsaflow-dc/website-plan/`](/root/clients/salsaflow-dc/website-plan/)

---

## G-IA (2026-08-12) — ENTSCHIEDEN

| Feld | Wert |
|---|---|
| Run-ID | `wf_c3729fb9-2f4` |
| Status | **ENTSCHIEDEN** |
| User-Antwort | Kunden-Baseline aus Eingang (`SFDC-NEW-WEBSITE-STRUKTUR.docx`); „so wie bisher / wie sie wollten“ |
| Gate-Mapping | **A-artig** (stabile Adressen, kaufnahe Repo-URLs) |
| Freigeschrieben | [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md) |
| Varianten-Quellen | [`05-ia-variants.md`](/root/clients/salsaflow-dc/website-plan/05-ia-variants.md), Entwürfe A/B |
| Eingang | [`docs/bilder/redesign-2026-08/eingang/`](/root/clients/salsaflow-dc/docs/bilder/redesign-2026-08/eingang/), Extrakt [`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md) |

### Entscheidung: G-IA

**Gewählt: Option A-artig (Kunden-Baseline)** — stabile, kaufnahe Adressen und exakte Kunden-Nav.

| Option | Was das bedeutet | Tradeoff | Status |
|---|---|---|---|
| **A / Baseline** | Nav TANZKURSE · EVENTS & WORKSHOPS · TEAM · FOTOS · KONTAKT · MEHR; Repo-URLs behalten; Events unter `/events/*` schärfen | Weniger „Funnel-Optimierung“, dafür Kundenwunsch und SEO-Stabilität | **GEWÄHLT** |
| B Funnel | Probestunde/Conversion-first IA, neue Pflichtpfade | Mehr CRO-Theorie, bricht Kunden-Sitemap und stabile Adressen | **VERWORFEN** |
| C Schule/Nights | Split Schule vs. Nights (`/schule`, `/nights`) | Klare Welten, aber neuer URL-Hausbau und Redirect-Last | **VERWORFEN** |

### G-IA — verbindliche Folgen

- Keine `/probestunde` als neue Pflichtseite.
- Keine `/schule/*`, `/nights/*`, `/studio/*`, `/club/*`, `/uns/*`.
- Header-CTA bis Claim-Freigabe: **„Probestunde anfragen“** (nicht „gratis“).
- Home-Inhaltsvertrag: sieben Kundenblöcke in bestellter Reihenfolge (+ Hero/Closer).
- Englisch erst später unter `/en/*`, keine stillen Route-Umzüge in dieser Welle.

---

## G-DESIGN (2026-08-12) — ENTSCHIEDEN

G-DESIGN_CHOICE: A

| Feld | Wert |
|---|---|
| Run-ID Lauf 2 (Vorbereitung) | `wf_bc3d758d-083` |
| Run-ID Lauf 3 (Close) | `wf_29643fc6-3fa` |
| Status | **RICHTUNG ENTSCHIEDEN: A — Warme Bühne; VISUELLE ABNAHME RE-OPENED** |
| Empfehlung war | **A — Warme Bühne** |
| Briefs | [`09-mockups/briefs.md`](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md) |
| Screenshots (Anti-/Ist-Belege) | [`screenshots/`](/root/clients/salsaflow-dc/website-plan/screenshots/) — v. a. `vercel-home.png` (leerer Hero), `live-home.png`, `vercel-privatstunden.png` |
| Roadmap | [`10-roadmap.md`](/root/clients/salsaflow-dc/website-plan/10-roadmap.md) |

### Entscheidung: G-DESIGN

**Gewählt: A — Warme Bühne** — Bleed-Hero Studio-Foto, roter Kant-Marker, Text links warm, `bg-soft` Editorial darunter; Cal Sans/Afacad, salsa `#ad1827`.

| Option | Was das bedeutet | Tradeoff | Status |
|---|---|---|---|
| **A Warme Bühne** | Bleed-Hero, Marker, warm links, Editorial darunter; Premium + warm; starke Foto-Abhängigkeit | Braucht gutes Hero-Asset (vorhanden: `hero-paar-studiowand-01`) | **GEWÄHLT** |
| B Club-Nacht | Dunkler Auftakt `surface-dark`, weisse Display-Zeile, heller Bildstreifen | Risiko Doppel-Dunkel; anderer Markenton | **VERWORFEN** |
| C Warmes Papier | Community zuerst, rundes Hero + Crowd-Streifen, Karten-Insel Founder | Robust bei schwächeren Fotos; Risiko „zu lieb“; Token `--color-paper-warm` existiert in `src/index.css` | **VERWORFEN** als Hauptrichtung |

### Fallback-Hinweis (nur C, kein Default)

**C — Warmes Papier** bleibt **kein** aktives Design und **kein** stiller Default.  
Nur wenn die gewählte A-Umsetzung an **Foto-Qualität** scheitert (Hero-LCP unbrauchbar, Studio-Motive ungeeignet) und Raphael ausdrücklich umschaltet:

1. Das vorhandene **paper-warm**-Token `--color-paper-warm` in [`src/index.css`](/root/clients/salsaflow-dc/src/index.css) verwenden — nicht ad hoc neue Tokens in Komponenten anlegen.
2. Dann Brief C aus [`09-mockups/briefs.md`](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md) und Crowd-/Founder-Assets.
3. Gate G-DESIGN hier mit Datum und neuer User-Antwort nachziehen.

Bis dahin: **nur A bauen**. B nicht reaktivieren ohne neue Gate-Runde.

### G-DESIGN A — Bau-Vertrag (kurz)

| Element | Vorgabe |
|---|---|
| Hero-Asset Home | `/photos/2026/hero-paar-studiowand-01.webp`, eager, dunkler Fallback + Wordmark |
| Typo | Cal Sans Display, Afacad Body, Alex Brush nur Hero-Eyebrow |
| Farbe | salsa `#ad1827` ~90/10; helles Grundgerüst |
| Motion | `[data-reveal]` Stagger-Fade; Reduced-Motion sofort sichtbar |
| Privatstunden Asset-P0 | Zwischenlösung Dreh-Portrait + Studiowand; echtes 1:1-Shooting offen (P-01) |
| IA | bleibt Kunden-Baseline; Design ändert keine Nav/URLs |

---

## Verbote (dauerhaft)

- Keine erfundenen Reviews, Ratings, Zertifikate, „#1“, Awards, Kundenstimmen ohne Primärquelle
- Kein Production-Code im website-plan Skill (`app/`, `components/` hier nicht bauen)
- Keine stillen Gate-Defaults (G-IA/G-DESIGN brauchen User-Wort)
- Fable nicht als Workflow-Worker
- Claims nur aus Proof-Inventar / Kunden-Doc / Live / freigegebenen Daten
- Kein „gratis“-Schnupper-Claim ohne S-02-Freigabe
- Keine Wiederbelebung verworfener IA-B/C oder Design-B als Default
- Design-C nur über expliziten Fallback-Pfad oben, nie still
- Repo ist MITNUTZEN, nie alleinige Wahrheit gegen Live/Recherche
- Menschenfotos nicht KI-from-scratch; Composites ohne Provenienz (L-01) nicht als reales Studio verkaufen
- Private Routen `/buchung*`, `/admin` bleiben `noindex`

---

## Run-Registry (Kurz)

| Lauf | Run-ID | Gate / Ziel |
|---|---|---|
| 1 Research→IA | `wf_c3729fb9-2f4` | G-IA → entschieden Baseline |
| 2 Copy/Specs/Design-Prep | `wf_bc3d758d-083` | G-DESIGN-Vorbereitung |
| 3 Close | `wf_29643fc6-3fa` | G-DESIGN A dokumentiert; 07/08/10/12/13 |

Vollregister: [`00-run-id.md`](/root/clients/salsaflow-dc/website-plan/00-run-id.md).

---

## Offen nach Gates (kein Gate-Ersatz)

| Thema | Ziel-Doku | Priorität |
|---|---|---|
| Privatstunden-Motiv Freigabe / Shooting | OQ-04, P-01 | P0 |
| Review-Primärquellen | OQ-06, P-02 | P0 Content |
| Payment Stripe/TWINT vs Payrexx | OQ-12 | Blocker Live-Zahlung |
| Storno/Refund | OQ-13 | Blocker Live-Zahlung |
| HOME-01 „zwei Minuten vom Bahnhof“ | Copy-Fallback im Home-Spec | Mittel |
| Founder-Namens-Zuordnung P-03 | Team-Alts | Mittel |
| Legal-Freigabe | OQ-15 | Hoch vor Cutover |

Siehe [`11-open-questions.md`](/root/clients/salsaflow-dc/website-plan/11-open-questions.md) und [`10-roadmap.md`](/root/clients/salsaflow-dc/website-plan/10-roadmap.md).
