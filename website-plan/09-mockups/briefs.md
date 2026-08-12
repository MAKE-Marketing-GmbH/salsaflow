# 09 — Design-Richtungen (G-DESIGN)

**Run-ID Lauf 2:** `wf_bc3d758d-083`  
**Run-ID Lauf 3:** `wf_29643fc6-3fa`  
**Gate:** Designrichtung **ENTSCHIEDEN: A — Warme Bühne** · visuelle Abnahme **RE-OPENED / FAIL** (2026-08-12)  
**Empfehlung war / Wahl:** **A — Warme Bühne** · B verworfen · C nur Fallback-Hinweis in [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md)

---

## Design-Richtungen Salsaflow — Lauf 2 G-DESIGN-Vorbereitung

**Geliefert:** drei Richtungsbeschreibungen. Die frühere Behauptung „je ein Mockup-Brief“ war falsch: Es gab weder ausgefüllte Section-Briefs noch Bilddateien. Die neue Preview-Capture-Runde liefert 26 Section-Bilder und ein Manifest; alle stehen wegen Copy-/Claim-Abweichungen auf `FAIL_COPY_SYNC`.

### Die drei Richtungen

**A — Warme Bühne (Bleed-Hero, editorial).** Weiterführung der gelockten Home-Idee: Studio-Crop mit Bleed bis an die Kante, roter Kant-Marker, Text links auf warmem Grund, danach ruhige bg-soft-Editorial-Sektionen. H1 Cal Sans ~88px dünn, einziger Rot-Akzent ist Eyebrow (Alex Brush, „Bailar es vivir.") + CTA-Pill. Hero-Bild `/photos/2026/hero-paar-studiowand-01.webp`, eager geladen, dunkle Fallback-Fläche bei Fehler. Risiko: hohe Foto-Abhängigkeit.

**B — Club-Nacht (dunkler Auftakt).** Hero auf `surface-dark #111` (erlaubter Kontrast-Block): weisse 96px-Zeile, salsa-Pill als Farbpunkt, breiter heller Bildstreifen als Bühne, danach harter Schnitt ins Helle. Transparente Navbar über Dunkel als Extra-Zustand. Risiko: Doppel-Dunkel bei falschem Foto — helleres Studio-Bild ist Pflicht.

**C — Warmes Papier (Community zuerst).** bg-soft-Grundton, rundes Hochformat-Hero (`hero-paar-dreh-01.webp`), direkt darunter Panorama-Streifen `community-crowd-01.webp` — nach fünf Sekunden echte Schule, echte Menschen sichtbar. Section 1 als weisse Karten-Insel mit 2×2-Founder-Grid. Robusteste Richtung bei schwächeren Einzelbildern. Offener Punkt: echtes paper-warm-Token existiert nicht — bg-soft nur Annäherung.

### Vergleich

| Kriterium | A | B | C |
|---|---|---|---|
| Nähe zur gelockten Home-Idee | hoch | mittel | mittel |
| Foto-Abhängigkeit | hoch | hoch | am robustesten |
| Markengefühl | Premium + warm | Energie + Nacht | familiär + warm |
| Hauptrisiko | steriler Grossraum | Doppel-Dunkel | zu lieb |

**Empfehlung: A** als Hauptrichtung, C als Fallback.

### Geändert
- [briefs.md](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md) (neu, ~16 KB)

### Geprüft
- Alle 7 referenzierten Asset-Pfade existieren in [public/](/root/clients/salsaflow-dc/public/) (hero-paar-studiowand-01, hero-paar-dreh-01, community-crowd-01, 4 Founder-Cutouts).
- Copy wortgleich aus [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md); kein „gratis", kein Review-Badge, Hero nie leer, WhatsApp sitewide, P-01 respektiert (Privatstunden bleibt textgeführt), ein Primary pro Screen, Nav exakt Kunden-Baseline.
- Kein Production-Code, kein Token-Bruch (Cal Sans/Afacad/salsa #ad1827/Stagger-Fade bleiben Wahrheit).

### Offen (Gates für nächste Runde)
- HOME-01 „zwei Minuten vom Bahnhof" → sonst Fallback-Formulierung.
- P-03 Namens-Zuordnung Founder-Cutouts → sonst neutrale Alts.
- S-02 „gratis"-Claim → CTA bleibt „Probestunde anfragen".
- Bei Wahl von C: paper-warm-Token zuerst in DESIGN.md eintragen (Token-Law).
- Sektionen 2–8 folgen nach Richtungswahl im selben Dialekt.

## Preview-Capture-Audit 2026-08-12

- Manifest: [`mockup-manifest.tsv`](./mockup-manifest.tsv)
- Captures: [`generated/A/preview/`](./generated/A/preview/)
- Umfang: Home 11 sichtbare Sections × Desktop/Mobile + Kursplan 2 Sections × Desktop/Mobile = 26 Bilder.
- Aufnahmevertrag: Chrome, Preview `https://salsaflow-dc.vercel.app`, Reduced Motion `reduce`, Cookie-Banner geschlossen, Fonts/Bilder abgewartet, ein DOM-`section` pro Datei.
- Ergebnis: **0 PASS / 26 FAIL_COPY_SYNC**. Die Captures sind Ist-Belege, keine freigegebenen Soll-Mockups.

### Sichtbare P0-Abweichungen

| Frame | Preview zeigt | Plan erlaubt | Folge |
|---|---|---|---|
| `home-H00-*` | „Drei Studios“, „erste Stunde kostet dich nichts“, 4,9/104 Reviews, rund 40 Kurse | sichere Fallbacks ohne Studio-/Kurszahl, Gratis- und Rating-Claim | Copy/Proof synchronisieren, dann neu aufnehmen |
| `home-H02-*` | „Finde deinen nächsten Kurs …“, Gratis-CTA; Kursvorschau und Level-Treppe als langer gemeinsamer Capture | H2 `Finde deinen Tanzkurs in Basel.`, konkrete Kartenfelder; je ein Frame pro Section | Copy aktualisieren und H02/H03 getrennt capturen |
| `kursplan-KP01-*` | `37 Kurse pro Woche`, `Gratis Schnupperstunde` | keine Wochenzahl/Preisbehauptung ohne Freigabe | sicheren Hinweistext aus `06-kursplan.md` setzen |
| `kursplan-KP02-*` | 4,9/104 Reviews und Gratis-CTA im Abschluss | kein Rating/Fake-Proof; `Probestunde anfragen` | Abschlusscopy und Proof entfernen/ersetzen |

### Motion-Vertrag für die Neuaufnahme

| Trigger | Element | Initial → Final | Dauer | Easing | Stagger | Reduced Motion |
|---|---|---|---:|---|---:|---|
| Initial Paint | Hero-Bild | sichtbar → sichtbar | 0 ms | — | 0 | identisch |
| Initial Paint | Hero-Copy/CTA | opacity 0, y 14 → opacity 1, y 0 | 450 ms | `cubic-bezier(0.22,1,0.36,1)` | 70 ms | sofort sichtbar, y 0 |
| Viewport | `[data-reveal]` | opacity 0, y 14 → opacity 1, y 0 | 450 ms | gleiche Kurve | 70 ms | sofort sichtbar, kein Stagger |
| Filter | Chip + Kursliste | ausgewählt; neue Liste direkt sichtbar | 160 ms Chip | `ease-out` | 0 | sofort |
| Hover | Primary/Secondary | Farbe + max. 1 px Lift/3 px Pfeil | 200 ms | `ease-out` | 0 | Farbe, keine Translation |
| Dialog | Backdrop/Panel | opacity 0, y 8, scale .98 → Endzustand | 180 ms | gleiche Kurve | 0 | sofort |

**Re-Close-Kriterium:** Copy-/Proof-Sync umgesetzt, neue Section-Captures erzeugt,
Manifest `review=PASS`, P0 Desktop 1440×900 + Mobile 390×844 vollständig und Final Critic PASS.

**Nächster Schritt:** Richtung A bleibt. Erst Copy/Proof synchronisieren, dann denselben Capture-Loop erneut fahren und jedes Bild gegen Manifest und Plan-Copy prüfen.
