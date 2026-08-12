# 13 — Final Critic (gesamtes Plan-Paket)

## Re-Audit 2026-08-12 nach Reparaturrunde

**VERDICT: FAIL · PLAN_VERIFIED=NO**

Dieser Abschnitt ist der aktuelle Kanon. Ältere Befunde darunter bleiben als Audit-Historie,
werden aber durch den aktuellen Dateistand relativiert.

### Behoben

1. Backend-Konflikt dokumentarisch geschlossen: Supabase-first ist in `ARCHITEKTUR.md`
   als überholt markiert; gültig sind Drizzle + PGlite für Dev, Prod-DB-Hosting bleibt
   eine offene Deployment-Entscheidung.
2. Nummerierte `06-seiten/00–14` sind der einzige Plan-Kanon; unnummerierte Dateien sind Altstand.
3. `14-redirect-matrix.md` existiert; `/events-workshops/*` ist nur Redirect-Quelle,
   `/events/*` ist Zielkanon.
4. `06-seiten/route-manifest.tsv` deckt 26 indexierbare URLs genau einmal ab.
5. Home Section 2 und `/kursplan` haben konkretere H2/Lead/Kartenfelder/Microcopy,
   Mobile-/State- und Motion-Verträge.
6. Vier vorher fehlende URLs stehen in `14-fehlende-oeffentliche-routen.md`.
7. `09-mockups/mockup-manifest.tsv` und 26 Section-Captures existieren; sie sind ehrlich
   `FAIL_COPY_SYNC`, nicht fälschlich PASS.

### Aktuelle Blocker

1. Kunden-/Owner-Fakten offen: Preise, Eventdaten, Team-Bios/Fotofreigaben, Show-/Raumdetails,
   Partner/Partys, Legal-01/02 sowie Claims zu gratis, Studio- und Kurszahl. Die betroffenen
   Routen bleiben `OWNER_BLOCKED` oder `READY_FOR_VERIFY`.
2. Per-Section-Spec-Migration ist nicht vollständig. Mehrere Seitendateien haben weiterhin
   einen Sammelblock statt eines vollständigen Spec-Vertrags pro sichtbarer Section.
3. Visual-Abnahme offen: 26 Preview-Captures zeigen gesperrte oder abweichende Copy (u. a.
   gratis, 4,9/104, drei Studios, 37/40 Kurse). Weitere P0-Routen fehlen im Manifest.
4. Die implementierte Preview ist kein Beweis für den reparierten Plantext. Copy-Sync und
   erneute Section-Captures sind nötig; Motion braucht zusätzlich Interaktionsbelege.
5. Legal-Seiten dürfen ohne freigegebenen Inhalt nicht auf Production.

### Reproduzierbarer Check

```bash
python3 /root/raphael-skills/skills/eigene/website-plan/scripts/validate-plan.py \
  /root/clients/salsaflow-dc/website-plan
```

Aktueller Ausgang: Exit 1, `PLAN_VERIFIED=NO`. Erst Exit 0 plus erneuter unabhängiger
Critic-PASS darf den Planstatus ändern.

**Run-ID Lauf 3:** `wf_29643fc6-3fa`  
**Rolle:** sol-pruefer (Inhalt recovered aus StructuredOutput; write-only-Lücke)  
**Design-Wahl:** A — Warme Bühne  
**IA-Wahl:** Kunden-Baseline (A-artig)

---

FAIL

Befunde

1. BLOCKER — Der Backend-Vertrag ist weiterhin logisch unerfüllbar.
- [DECISIONS.md](/root/clients/salsaflow-dc/DECISIONS.md:11) verbietet Supabase ausdrücklich: „Kein Supabase“.
- [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md:57-79) legt Supabase, Auth, RLS und Edge Functions als Erstwahl fest.
- [00-meta-plan.md](/root/clients/salsaflow-dc/website-plan/00-meta-plan.md:151-160) macht Supabase/RLS trotzdem zur Definition of Done.
- Der Konflikt war bereits als Ship-Blocker in [01c-research-critic.md](/root/clients/salsaflow-dc/website-plan/01c-research-critic.md:15-20) dokumentiert, wurde aber in den Abschlussdokumenten nicht geschlossen.
- Harte Folge: Eine Bauwelle kann nicht gleichzeitig DECISIONS und den Meta-DoD erfüllen. Fachlogik wie transaktionale Kapazität, Warteliste und signaturgeprüfter Webhook ist verwendbar; Hosting/Auth ist nicht freigegeben.

2. BLOCKER — Acht vom Meta-Vertrag ausdrücklich geforderte Abschlussartefakte fehlen.
- [00-meta-plan.md](/root/clients/salsaflow-dc/website-plan/00-meta-plan.md:50-61) fordert unter anderem `01-live-critique.md`, `02-asset-audit.md`, `03-alt-text-inventory.md`, `04-ia-seo-aeo-plan.md`, `05-layout-logic.md`, `06-booking-backend-flow.md`, `07-implementation-backlog.md` und `08-qa-gates.md`.
- Keines dieser acht Artefakte existiert unter [website-plan/](/root/clients/salsaflow-dc/website-plan/).
- Inhalt liegt teilweise unter anderen Namen vor, aber der Vertrag und seine Abschlussregel wurden nie angepasst. Besonders kritisch fehlen ein kanonischer Booking-Flow, eine vollständige Redirect-Matrix und eine ausführbare QA-Gate-Matrix.
- Der Meta-DoD behauptet zugleich, alle zehn Outputs müssten vorhanden oder begründet blockiert sein ([00-meta-plan.md](/root/clients/salsaflow-dc/website-plan/00-meta-plan.md:151-161)). Dieser Gate ist nicht bestanden.

3. BLOCKER — Es gibt zwei konkurrierende „FINAL“-Seitenspec-Systeme.
- [06-seiten/00-index.md](/root/clients/salsaflow-dc/website-plan/06-seiten/00-index.md:17-33) erklärt die nummerierten Dateien wie `01-home.md` und `07-privatstunden.md` zur finalen Seitenmappe.
- [06-seiten/_index.md](/root/clients/salsaflow-dc/website-plan/06-seiten/_index.md:1-29) erklärt parallel die unnummerierten Dateien wie `home.md` und `privatstunden.md` zu `FINAL DE-Copy`.
- [10-roadmap.md](/root/clients/salsaflow-dc/website-plan/10-roadmap.md:51-59) nennt dagegen `06-seiten/01-home.md` kanonisch und `home.md` ausdrücklich Alt-Entwurf.
- Die Texte weichen substanziell ab: `home.md` verwendet „Siempre con flow“, während die gewählte Richtung und `01-home.md` „Bailar es vivir.“ verlangen. Die Privatstunden-Specs unterscheiden sich ebenfalls bei H1, Ablauf, Formular und Claims.
- Harte Folge: Ein Builder kann nicht mechanisch bestimmen, welche Copy und welche Section-Spec gilt. `_index.md` und die Alt-Dateien müssen entfernt, eindeutig als überholt markiert oder auf die kanonischen Dateien umgebogen werden.

4. BLOCKER — Die Redirect-DoD ist versprochen, aber nicht spezifiziert.
- [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:79-86) verlangt einen eigenen technischen Redirect-Plan für alle 22 Live-Adressen und die Event-Umzüge.
- [10-roadmap.md](/root/clients/salsaflow-dc/website-plan/10-roadmap.md:85-95) sagt nur „301-Matrix-Plan umsetzen“.
- Es existiert keine kanonische Matrixdatei mit jeder Quelle, beiden Slash-Formen, kodierten Umlauten, genau einem Ziel und erwartetem 301→200-Ergebnis.
- Die ältere Tabelle in [03-seo-audit.md](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md:292-321) zeigt teilweise noch `/events-workshops/*`, während der IA-Lock `/events/*` verlangt. Sie kann daher nicht unverändert als Bauvertrag dienen.
- Ohne diese Matrix ist der wichtigste SEO-Cutover-Gate nicht ausführbar.

5. BLOCKER — Asset-P0 ist semantisch nicht gelöst; die Zwischenlösung wird zu stark dargestellt.
- Die Root Cause „low-res“ wurde korrekt widerlegt: Die vorhandenen Privatbilder sind ausreichend gross, aber motivisch ungeeignet ([02-asset-inventar.md](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md:91-132)).
- Das geplante Ersatzbild [hero-paar-dreh-01-portrait.webp](/root/clients/salsaflow-dc/public/photos/2026/hero-paar-dreh-01-portrait.webp) zeigt jedoch ein tanzendes Paar in einer sozialen Kurs-/Party-Situation. Es belegt weder Privatunterricht noch die Rollen „Lehrperson“ und „Schülerin“.
- Trotzdem behaupten [06-seiten/01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:208-216) und [06-seiten/07-privatstunden.md](/root/clients/salsaflow-dc/website-plan/06-seiten/07-privatstunden.md:50-58) genau diese Rollen im vorgeschlagenen Alt-Text.
- Das zweite Bild [hero-paar-studiowand-01.webp](/root/clients/salsaflow-dc/public/photos/2026/hero-paar-studiowand-01.webp) zeigt ebenfalls ein Paar beim Tanzen, nicht nachweisbar eine Privatstunde.
- Korrekte Gate-Lesart: Diese Assets sind nur atmosphärische Paar-Fallbacks. Sie dürfen nicht als Beleg für 1:1-Unterricht beschrieben werden. P-01 bleibt offen, bis entweder neutrale Alt-/Copy-Semantik freigegeben oder ein echtes Privatstunden-Shooting geliefert ist.

6. HOCH — Design A ist entschieden, aber die visuelle Abnahme ist zu schwach spezifiziert.
- A selbst ist konsistent festgeschrieben: Bleed-Hero, roter Kant-Marker, warmer Text links, `bg-soft` darunter, Cal Sans/Afacad und `#ad1827` ([12-verbote-und-gates.md](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md:40-82)). B ist verworfen; C bleibt nur Fallback.
- Die vorhandenen Screenshots belegen die Probleme klar: [vercel-home.png](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-home.png) zeigt den nahezu leeren ersten Screen; [vercel-privatstunden.png](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-privatstunden.png) zeigt das ungeeignete Motiv und die schwache Primary-Hierarchie; [live-home.png](/root/clients/salsaflow-dc/website-plan/screenshots/live-home.png) zeigt die alte Text-/Cookie-Last.
- Es fehlt jedoch ein tatsächliches Referenzmockup für die gewählte Richtung A. [09-mockups/briefs.md](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md) ist nur ein Textbrief; [10-roadmap.md](/root/clients/salsaflow-dc/website-plan/10-roadmap.md:129-132) verschiebt die Mockup-Sektionen 2–8 auf P1.
- Der DoD nennt keine festen Screenshot-Namen, Viewport-Höhen, Browserzustände, Cookie-Zustände, Bildladezustände oder Pixel-/Layout-Kriterien. „1440px und mobil“ ist kein reproduzierbares visuelles Gate.
- Mindestnachbesserung: kanonische A-Referenzbilder für Home Desktop und Mobile sowie Privatstunden Desktop und Mobile; jeweils URL, exakter Viewport, Reduced-Motion, Cookie-Zustand, erwartete Above-the-fold-Elemente und Abweichungskriterium.

7. HOCH — Die Motion-Spec widerspricht der realen Implementierung.
- [06-seiten/01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:375-377) nennt eine „Feder-Kurve“.
- Der echte Code in [motion.tsx](/root/clients/salsaflow-dc/src/public/home/motion.tsx:17-38) verwendet eine feste Ease-out-Bezierkurve `[0.22, 1, 0.36, 1]`, 14 px, 0,45 s und Stagger 0,07 s — keine Spring-/Federphysik.
- [07-design-system-plan.md](/root/clients/salsaflow-dc/website-plan/07-design-system-plan.md:375-409) beschreibt den Code dagegen korrekt.
- Die Seitenspec muss denselben mechanischen Vertrag verwenden; sonst implementiert ein Builder unnötig eine zweite Motion-Sprache.

8. HOCH — C-Fallback und Token-Wahrheit widersprechen sich innerhalb des Abschlusses.
- [12-verbote-und-gates.md](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md:56-68) behauptet, C habe kein `paper-warm`-Token und dieses müsse zuerst eingetragen werden.
- Der echte Token existiert bereits in [src/index.css](/root/clients/salsaflow-dc/src/index.css:38-44) als `--color-paper-warm: #fbfaf8`.
- [07-design-system-plan.md](/root/clients/salsaflow-dc/website-plan/07-design-system-plan.md:493-503) erkennt genau diesen Widerspruch korrekt.
- Auch wenn C nur Fallback bleibt, ist Kapitel 12 dadurch sachlich falsch. Der Fallback darf nicht mit einem nicht existierenden Blocker arbeiten.

9. HOCH — Die Root-Design-Wahrheit ist nicht sauber versioniert.
- [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:8-23) nennt noch `paper #ffffff` und `bg-soft #f6f6f5`, während [src/index.css](/root/clients/salsaflow-dc/src/index.css:25-40) `#fdfcfa`, `#f4f1ec` und `paper-warm #fbfaf8` verwendet.
- [07-design-system-plan.md](/root/clients/salsaflow-dc/website-plan/07-design-system-plan.md:59-98) dokumentiert die Drift korrekt, behandelt aber Code als oberste Wahrheit, obwohl DESIGN.md selbst „EINE Wahrheit“ und locked behauptet.
- Vor der Bauwelle braucht es eine eindeutige Entscheidung: entweder Root-Doktrin auf den aktuellen Tokenstand aktualisieren oder die Abweichung als bewusst freigegebene Ausnahme in DECISIONS dokumentieren. Ein Plan darf nicht beide als bindend bezeichnen und bei Konflikt still den Code wählen.

10. HOCH — QA ist überwiegend eine Wunschliste, kein ausführbarer Ship-Gate.
- Das geforderte `08-qa-gates.md` fehlt vollständig.
- [07-design-system-plan.md](/root/clients/salsaflow-dc/website-plan/07-design-system-plan.md:527-543) deckt Designchecks ab, aber nicht den vollständigen Website-Vertrag.
- Es fehlen insbesondere: Route-für-Route erwartete HTTP-Codes; Redirect-Testfälle; Canonical/noindex/hreflang-Matrix; Formularvalidierung je Feld; Booking-Statusübergänge inklusive Ablauf, Doppelwebhook und Warteliste; Tastatur-/Focus-Reihenfolge; Bildfehler je P0-Slot; strukturierte Daten gegen sichtbaren Content; Cookie-/Consent-Zustand; OG-Preview; und eindeutige Belegpfade.
- „States loading/empty/error/success/disabled“ wird oft pauschal wiederholt, aber nicht je datenführender Komponente mit Trigger, Erwartung und Beweis spezifiziert.

11. MITTEL — Ein harter Linkfehler bestätigt die Konkurrenz der alten Specs.
- Der Plan-Linkscan fand genau einen nicht existierenden absoluten Zielpfad: [06-seiten/home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/home.md:24) verweist auf `/root/clients/salsaflow-dc/website-plan/03-alt-text-inventory.md`, das nicht existiert.
- Das ist kein isolierter Tippfehler: Es ist ein weiterer Hinweis, dass die unnummerierte Spec-Familie nicht final konsolidiert wurde.

12. MITTEL — Mehrere Prioritäten sind als Fakten formuliert, obwohl ihre Herleitung fehlt.
- Beispiele: P-02 Reviews und P-09 OG werden in [02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-65) als rote Launch-Blocker eingestuft. Das Weglassen einer unbelegten Review-Fläche ist aber eine sichere, bereits vorgesehene Lösung; ein fehlendes eigenes OG-Bild erzeugt nicht zwingend einen „grauen Kasten“, wenn ein gültiges Defaultbild vorhanden ist.
- Diese Punkte sind wichtig, aber „Launch-Blocker“ braucht ein tatsächlich unerfüllbares Abnahmekriterium. Sonst wird die Roadmap künstlich blockiert und widerspricht der eigenen Regel, unbelegten Proof einfach wegzulassen.

Was am Plan belastbar ist

- G-IA ist klar: Kunden-Navigation und stabile kaufnahe Adressen bleiben erhalten; Funnel-IA B und Schule/Nights-C sind verworfen.
- G-DESIGN A ist klar und entspricht der Nutzerentscheidung.
- Die Ursache des Privatstunden-Problems wurde von „Pixelzahl“ auf Motiv/Semantik korrigiert.
- Die Asset-Bestandsaufnahme, Screenshotkritik, Claim-Sperren und SEO-Grundrichtung enthalten viel verwendbare Evidenz.
- Die vorhandenen Bilder bestätigen, dass A visuell grundsätzlich baubar ist.

Ship-Gate

- Nicht an eine Implementierungswelle übergeben.
- Vor Übergabe zwingend: Backend-Konflikt entscheiden; eine einzige kanonische Seitenmappe festlegen; fehlende Meta-Deliverables entweder erzeugen oder den Meta-Vertrag sauber umbenennen; vollständige Redirect- und QA-Matrizen erstellen; P-01 als semantisch offen kennzeichnen; A mit reproduzierbaren Referenzscreens abnehmen.

Befehle und Ausgaben

1. Dateiinventar
`find /root/clients/salsaflow-dc/website-plan -maxdepth 2 -type f -printf '%p\n' | sort`
- Ergebnis: umfangreiche Planmappe vorhanden; `13-final-critic.md` fehlt; die acht oben genannten Meta-Deliverables fehlen ebenfalls.

2. Meta-Deliverable-Prüfung
Ausgeführtes Python-Skript extrahierte die in `00-meta-plan.md` versprochenen Dateinamen und prüfte ihre Existenz.
Ausgabe:
`01-live-critique.md MISSING`
`02-asset-audit.md MISSING`
`03-alt-text-inventory.md MISSING`
`04-ia-seo-aeo-plan.md MISSING`
`05-layout-logic.md MISSING`
`06-booking-backend-flow.md MISSING`
`07-implementation-backlog.md MISSING`
`08-qa-gates.md MISSING`
`11-open-questions.md EXISTS`

3. Linkprüfung über alle Markdown-Dateien
Ausgabe:
`ABS_LINKS 415 BROKEN_PATHS 1`
`BROKEN /root/clients/salsaflow-dc/website-plan/06-seiten/home.md /root/clients/salsaflow-dc/website-plan/03-alt-text-inventory.md`

4. Widerspruchssuche
Ausgeführtes Python-Skript suchte planweit nach `Supabase`, `PGlite`, `Hono`, `Payrexx`, `paper-warm-Token fehlt`, `Feder-Kurve` und `low-res`.
- Supabase erschien im Meta-DoD und zugleich im bereits dokumentierten Frozen-Rule-Konflikt.
- PGlite/Hono erschienen nur im Critic, nicht als geschlossene Architekturentscheidung.
- `paper-warm-Token fehlt` blieb in Kapitel 12 stehen, obwohl `src/index.css` das Token enthält.
- `Feder-Kurve` erschien in der Home-Spec, während der Code eine Bezier-Ease nutzt.
- `low-res` blieb in Growth/Roadmap stehen, obwohl der Asset-Audit diese Ursache widerlegt.

5. Visuelle Gegenprüfung der Assets
- [hero-paar-dreh-01-portrait.webp](/root/clients/salsaflow-dc/public/photos/2026/hero-paar-dreh-01-portrait.webp): warmes, dynamisches Paarmotiv; kein belegbarer Privatunterricht und keine belegbaren Lehrer-/Schülerrollen.
- [hero-paar-studiowand-01.webp](/root/clients/salsaflow-dc/public/photos/2026/hero-paar-studiowand-01.webp): starkes Studio-/Markenmotiv für Home A; ebenfalls kein Beleg für Privatunterricht.

Modellroute

- Prüfermodell: `gpt-5.6-sol`.
- Rolle: adversarial Final-Critic, read-only, keine Subagenten und keine externen Seiteneffekte.
- Urteil basiert auf direkten Reads des gesamten Abschlusskerns, mechanischem Datei-/Linkscan, Widerspruchssuche und visueller Prüfung der relevanten Screenshots und P0-Assets.

Verbleibende Risiken

- Wegen Read-only-Regel wurde [13-final-critic.md](/root/clients/salsaflow-dc/website-plan/13-final-critic.md) nicht geschrieben.
- Nicht jede einzelne der parallelen Alt-Spec-Dateien wurde vollständig Satz für Satz gegeneinander diffed; die Index- und Stichprobenkonflikte reichen bereits für FAIL.
- Keine Build-, Browser- oder Live-HTTP-Regression wurde ausgeführt, weil der Auftrag PLAN-only und das zu prüfende Artefakt die Planmappe ist. Die vorhandenen Screenshotbelege wurden direkt gelesen.
- Rechtliche Aussagen zu Datenschutz, Bewertungen und Bildrechten sind Planrisiken, keine Rechtsberatung.

---

# Re-Verdict (Sol, Lauf 4, `wf_b1cc7e53-90f`) + Runde-2-Nachträge (Parent)

## Sol Re-Verdict 2026-08-12: FAIL (vor den Nachträgen)

| # | Blocker | Sol-Status | Beleg |
|---|---|---|---|
| 1 | Supabase-Konflikt DECISIONS vs ARCHITEKTUR | TEILWEISE | ÜBERHOLT-Kopf da, aber operative Supabase-Anweisungen standen weiter darunter |
| 2 | Acht Alias-Artefaktnamen | **GESCHLOSSEN** | `00-meta-plan.md` mappt alle acht, `MAPPING_RULE True` |
| 3 | Dual-FINAL-Seitenspecs | **GESCHLOSSEN** | `UNNUMBERED 19 VALID_STUBS 19 BAD []` |
| 4 | 301-Redirect-Matrix | TEILWEISE | Matrix vollständig, aber Abnahme-Loop deckte 15 deklarierte Varianten nicht; 4 Event-Ziele erst nach Bau 200 |

Zusätzliche Sol-Funde: unbelegte Claims in 01-home/02-tanzkurse/07-privatstunden (Gehzeiten, „zwei Häuser", Rollen-Alt-Text, Abo-Aussage, Mengenclaims, „schnellster Weg", 4-vs-5-Schritte, Verrechnungsfolge), FINAL-Label trotz offener Owner-Entscheide, Screenshot-Serie FAIL (2 Live-404-Shots).

## Runde-2-Nachträge (Parent, 2026-08-12) — alle Sol-Punkte geschlossen

| Sol-Punkt | Fix | Mechanischer Beweis |
|---|---|---|
| Blocker 1 Rest | Supabase-Block 1.1–1.3 in End-Anhang „NICHT AUSFÜHREN" verschoben; auth.users, Edge Functions, „Supabase-Projekt anlegen", Selbstcheck im Hauptteil neutralisiert | Hauptteil-Scan oberhalb Anhang: 0 Treffer supabase/auth.users/edge function (nur der Anhang-Verweis) |
| Blocker 4 Rest | Abnahme-Loop aus vercel.json-Snippet mechanisch regeneriert; Cutover-Markierung für `/events/*`-Ziele | `SNIPPET_QUELLEN 65 LOOP_ZEILEN 67 FEHLEND 0` |
| Home-Claims | „zwei Minuten"→„direkt beim Bahnhof SBB", „zwei Häuser"→dito, Privatstunden-Alt neutral („Ein tanzendes Paar übt eine Drehung im Studio.") | grep: 0 Treffer „zwei Minuten/zwei Häuser/Schülerin" in 01-home.md |
| Tanzkurse-Claims | „zwei Gehminuten"→„direkt beim", „kein Abo"-Zeilen entschärft, „schnellster Weg" raus, TK-04 mit Fallback geschlossen, Status→READY FOR VERIFY v2 | grep: 0 Treffer in 02-tanzkurse.md |
| Privatstunden | fünf statt vier Schritte, Mengenclaims raus, 24h-Verrechnung auf belegten Fakt begrenzt (PRIV-04), Status→READY FOR VERIFY v2 | Datei-Diff, Zeilen 77/115/141/212/221 |
| Screenshots | 2 Live-Shots mit echten Pfaden (`/kurse/privatstunden/`, `/kurse/`) neu, abgenommen | `09-mockups/screenshot-abnahme-2026-08-12.md` Nachtrag: 24/24 PASS |

**Stand nach Runde 2:** Alle 4 ursprünglichen Blocker geschlossen. Bau-abhängig bleiben nur: Event-Routen `/events/*` müssen beim Bau entstehen (Cutover-Zeilen der Matrix), Owner-Entscheide (GUT-01, PRIV-01–04, R-01) liegen bei Raphael/Kunde. Ship-Gate für die **Bauwelle**: frei, sobald Raphael „Bau" sagt — Cutover-Gate bleibt bis Event-Routen + DNS.
