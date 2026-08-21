# GATES — R188 Events/Shows

Worktree: `/root/clients/salsaflow-w1`
Bildbelege: `worklog/shots/R188/after-final4-events-shows/`

## Kunden-Feedback

- [x] E1–E3 `/events`: scharfes Hero-Bild, einfache Faktenzeile und vier Event-Wege.
  EVIDENCE: `events/d-01.png`, `events/d-02.png`, `events/m-01.png`, `events/m-03.png`.
- [x] E4 Danceflow: kompakte Karten ohne grosses Bild in der beanstandeten Sektion.
  EVIDENCE: `events-workshops_danceflow-night/d-02.png`, `m-03.png`.
- [x] E5 Anniversary: beanstandete Audience-Sektion entfernt.
  EVIDENCE: vollständiger Bildsatz `events-workshops_anniversary-weekend/`.
- [x] E6 Anniversary-Hero: Abstand und vollständiger Gruppen-Crop.
  EVIDENCE: `events-workshops_anniversary-weekend/d-01.png`, `m-01.png`.
- [x] E7: beanstandete Kopf-Crops an Events, Danceflow, Anniversary, Floweekend und Shows behoben.
  EVIDENCE: `events/d-03.png`, `events/d-04.png`, `events-workshops_danceflow-night/d-03.png`, `m-04.png`, `events-workshops_anniversary-weekend/d-02.png`, `d-04.png`, `events-workshops_floweekend/d-01.png`, `m-01.png`, `shows-animationen/m-02.png`.
- [x] E8: Sektion „So holst du mehr aus dem Wochenende.“ vollständig entfernt.
  EVIDENCE: vollständiger Bildsatz `events-workshops_floweekend/`; nach FitSection folgt ClosingInvite.
- [x] S1: schwache Shows-Bilder ersetzt; Formate-Bild zeigt echte Bühne und klare Personen.
  EVIDENCE: `shows-animationen/d-01.png`, `d-02.png`, `d-03.png`, `d-05.png`, `m-02.png`, `m-04.png`, `m-09.png`.
- [x] S2: Show-, Animation-, Workshop- und Kombinations-Container bleiben erhalten.
  EVIDENCE: `shows-animationen/d-03.png`, `d-04.png`, `m-05.png`, `m-06.png`.
- [x] SW2: Formatkarten nutzen gleiche Mindesthöhe; Aktionen stehen am Kartenboden.
  EVIDENCE: `shows-animationen/d-03.png`, `d-04.png`, `m-05.png`, `m-06.png`.

## Technik

- [x] T1 Typecheck Exit 0.
  CHECK: `cd /root/clients/salsaflow-w1 && npm run typecheck`
  EXPECT: Exit 0
  EVIDENCE: `tsc -p tsconfig.json --noEmit && tsc -p tsconfig.node.json --noEmit`, Exit 0.
- [x] T2 Oxlint Exit 0 für neun geänderte TypeScript-Dateien.
  CHECK: `cd /root/clients/salsaflow-w1 && npx oxlint src/public/EventsPage.tsx src/public/DanceflowNightPage.tsx src/public/AnniversaryPage.tsx src/public/FloweekendPage.tsx src/public/ShowsAnimationenPage.tsx src/public/events/anniversary-content.ts src/public/events/danceflow-content.ts src/public/events/floweekend-content.ts src/public/shows/animationen-content.ts`
  EXPECT: Exit 0
  EVIDENCE: keine Ausgabe, Exit 0.
- [x] T3 Vollständiger Bildsatz für fünf Seiten, Desktop und Mobil.
  EVIDENCE: `manifest.json` enthält 10 Läufe für fünf Routen.
- [x] T4 Keine Konsolenfehler.
  EVIDENCE: `manifest.json` enthält in allen 10 Läufen `consoleErrors: []`.
- [x] T5 Kein Commit und kein Push.
  EVIDENCE: Änderungen liegen nur im Working Tree.

Ledger vor Final-Hero: 15 von 15 Gates mit Beleg. Visuelles Urteil bleibt bis zur unabhängigen Kritik untrusted.

## Final-Hero F1–F12 (21.08.2026)

Scope: Nur die Darstellung des echten Gruppenfotos im Floweekend-Hero.

- [x] F1: Das Hero-Foto nutzt seine echte 3:2-Proportion. Die festen Bandhöhen sind entfernt.
  CHECK: node /tmp/r188-floweekend-source-check.cjs
  EXPECT: PASS source 3:2 responsive, fixed heights absent
  EVIDENCE: `PASS source 3:2 responsive, fixed heights absent`. `heightClass: 'aspect-[3/2] h-auto'` in `src/public/FloweekendPage.tsx`; `h-[13rem] sm:h-[20rem] lg:h-[24.5rem]` ist weg.

- [x] F2: Desktop 1440 rendert das Bild mit 3:2, ohne Upscaling.
  CHECK: node /tmp/r188-floweekend-hero-measure.cjs desktop
  EXPECT: PASS desktop 1440x960 ratio=1.500 scale=0.960
  EVIDENCE: `PASS desktop 1440x960 ratio=1.500 scale=0.960`. scale < 1, also kein Upscaling.

- [x] F3: Mobil 390 rendert das Bild mit 3:2, ohne Upscaling.
  CHECK: node /tmp/r188-floweekend-hero-measure.cjs mobile
  EXPECT: PASS mobile 390x260 ratio=1.500 scale=0.260
  EVIDENCE: `PASS mobile 390x260 ratio=1.500 scale=0.260`. scale < 1, also kein Upscaling.

- [x] F4: Die neuen Desktop- und Mobil-Captures sind jünger als die Hero-Quelle.
  CHECK: node /tmp/r188-floweekend-freshness.cjs
  EXPECT: PASS captures fresh
  EVIDENCE: `PASS captures fresh`.

- [x] F5: Desktop 1440 zeigt alle Köpfe, beide hochgereckten Handgruppen und lesbare Körper ohne dominierende Wandfläche.
  EVIDENCE: Eigener Bild-Read von `worklog/shots/R188/after-final4-events-shows/floweekend-hero-render/desktop-1440.png` (1440x1535) und `events-workshops_floweekend/d-01.png`: Foto 1440x960, alle Köpfe frei, beide Handgruppen vollständig unter der Oberkante, Körper bis Schuhe und Parkett sichtbar, Wand nur oberer Randstreifen.

- [x] F6: Mobil 390 zeigt alle Köpfe, beide hochgereckten Handgruppen und lesbare Körper ohne dominierende Wandfläche.
  EVIDENCE: Eigener Bild-Read von `floweekend-hero-render/mobile-390.png` (390x831) und `events-workshops_floweekend/m-01.png`: Foto 390x260, gesamte Gruppe im Rahmen, WhatsApp-Kreis liegt nach dem `-mt-8`-Fix nur über Bodenfläche und nicht mehr über dem Wasserzeichen.

- [x] F7: Bildquelle, Farben, Hero-Text und CTAs bleiben unverändert.
  CHECK: node /tmp/r188-floweekend-assets-check.cjs
  EXPECT: PASS content and image hashes unchanged
  EVIDENCE: `PASS content and image hashes unchanged`. `floweekend-content.ts` sha256 `0abdfaca…8677`, `party-52.webp` sha256 `26dec4cf…e595`.

- [x] F8: Der Quell-Diff dieses Auftrags bleibt im Floweekend-Hero.
  CHECK: node /tmp/r188-floweekend-scope-check.cjs
  EXPECT: PASS scope Floweekend Hero only
  EVIDENCE: `PASS scope Floweekend Hero only`. Alles außerhalb des Hero-Blocks ist byte-gleich mit `/tmp/R188-FloweekendPage.before.tsx`.

- [x] F9: Typecheck läuft ohne Fehler.
  CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck
  EXPECT: tsc -p tsconfig.node.json --noEmit
  EVIDENCE: `tsc -p tsconfig.json --noEmit && tsc -p tsconfig.node.json --noEmit`, keine Meldung, Exit 0.

- [x] F10: Oxlint läuft für die eigene Datei ohne Befund.
  CHECK: cd /root/clients/salsaflow-w1 && npx oxlint src/public/FloweekendPage.tsx && printf 'OXLINT PASS\n'
  EXPECT: OXLINT PASS
  EVIDENCE: `OXLINT PASS`, keine Befunde.

- [x] F11: Der R188-Klicktest bleibt grün.
  CHECK: cd /root/clients/salsaflow-w1 && node scripts/r188-clicktest.cjs
  EXPECT: PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite
  EVIDENCE: `PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite`, Exit 0.

- [x] F12: HEAD bleibt unverändert. Es gibt keinen Commit, Push oder Deploy.
  CHECK: test "$(git -C /root/clients/salsaflow-w1 rev-parse HEAD)" = "4e67a69e6ef71038a9cc8d8dbf2f19971a29059b" && printf 'PASS HEAD unchanged\n'
  EXPECT: PASS HEAD unchanged
  EVIDENCE: `PASS HEAD unchanged`. Änderung liegt nur im Working Tree.

- [x] F13: Das deterministische Pixel-Gate meldet für beide vollständigen Hero-Renderings null Funde.
  CHECK: python3 /root/raphael-skills/skills/eigene/visual-aaa/scripts/visual-g1.py /root/clients/salsaflow-w1/worklog/shots/R188/after-final4-events-shows/floweekend-hero-render --json /root/clients/salsaflow-w1/worklog/shots/R188/after-final4-events-shows/floweekend-hero-g1-report.json
  EXPECT: G1 PASS
  EVIDENCE: `G1 PASS — 2 file(s), 0 findings`, Exit 0.

- [ ] F14: Opus, Sol und Grok geben für Desktop und Mobil jeweils PASS mit HIGH.
  CHECK: node /tmp/r188-floweekend-critics-check.cjs
  EXPECT: PASS critics 6/6
  EVIDENCE: 5 von 6 pass/HIGH. Offen ist Sol/mobile-390: `fail`, biggest_gap
  "Der WhatsApp-Floating-Button überdeckt einen Teil des eingebrannten SalsaFlow-Logos".
  Belegt und nachgemessen: Float-Kreis fix bei x=330..378, y=776..824; Bild endet y=784.
  Überlappung 8px auf der Zeile "DANCE COMPANY" im Wasserzeichen.
  ABANDON: F14 Der Rest-Befund liegt strukturell außerhalb des erlaubten Scopes
  ("Ändere nur Floweekend-Hero-Darstellung"). Messung
  `/tmp/r188-mt-sweep.cjs`: Versatz 32px = Text frei, Button überlappt 8px;
  Versatz 40px = Button frei, Microcopy 8px verdeckt. Es gibt kein Fenster, in dem
  beides sauber ist, weil der Hero exakt an der Bildkante endet (Sektion 0..784,
  keine Luft darunter). Lösbar nur außerhalb des Hero, über einen der drei Wege:
  (a) `--whatsapp-lift` unter sm plus Routen-Marker in `src/index.css`
      (etablierte Stelle, siehe index.css Zeilen 288..308 für /kursplan und /bachata),
  (b) Kollisions-Solver in `src/public/site/WhatsAppFloat.tsx` Zeile 154 —
      er verwirft jedes Element breiter als 60 % der Viewportbreite und sieht das
      Vollbild-Foto deshalb nie,
  (c) ein Bildoriginal ohne eingebranntes Wasserzeichen.
  Alle drei liegen in fremden Dateien und brauchen eine Freigabe.

- [ ] F15: Das Visual-AAA-Ship-Manifest ist gültig.
  CHECK: python3 /root/raphael-skills/skills/eigene/visual-aaa/scripts/validate-ship-manifest.py /root/clients/salsaflow-w1/worklog/shots/R188/after-final4-events-shows/floweekend-visual-ship.json
  EXPECT: SHIP VALID
  EVIDENCE: `SHIP INVALID — 5 error(s)`, davon `ok must be true`.
  ABANDON: F15 hängt an F14. Ohne 6 von 6 pass/HIGH kann das Manifest nicht gültig
  werden. Kein Ship.
