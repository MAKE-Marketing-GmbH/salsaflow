# 09 — Design-Richtungen (G-DESIGN)

**Run-ID Lauf 2:** `wf_bc3d758d-083`  
**Run-ID Lauf 3:** `wf_29643fc6-3fa`  
**Gate:** G-DESIGN — **ENTSCHIEDEN: A — Warme Bühne** (Raphael 2026-08-12)  
**Empfehlung war / Wahl:** **A — Warme Bühne** · B verworfen · C nur Fallback-Hinweis in [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md)

---

## Design-Richtungen Salsaflow — Lauf 2 G-DESIGN-Vorbereitung

**Geliefert:** [briefs.md](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md) — genau 3 Richtungen A/B/C mit je einem Mockup-Brief (Route `/`, Desktop 1440px, Hero + Section 1, exakte Copy, exakte Asset-Pfade, 1 Bild pro Sektion).

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

**Nächster Schritt:** Raphael wählt A, B oder C → danach Mockup-Produktion (Bild-Generierung/Screenshot-Loop) für die gewählte Richtung, dann Sektionen 2–8.