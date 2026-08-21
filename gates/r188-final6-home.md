# GATES — R188 final6, Startseite (H2, H4/SW3, SW4, AAA-WhatsApp)

Worktree: /root/clients/salsaflow-w1 · Branch geil-welle · NICHT committen.
Belege: worklog/shots/R188/after-final6-home/

## G1 — H2: Bachata-Karte ohne Orangestich
- [x] Bachata-Kartenbild auf Home nutzt ein neutrales echtes Original (kein Filter, kein Upscale)
      CHECK: node worklog/.r188f6-tint.mjs
      EXPECT: bachata Rot-minus-Blau <= 30 (Nachbarkarten 2-30)
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/

## G2 — H4 + SW3: EINE Sektions-H2-Groesse auf Home
- [x] "Vom ersten Grundschritt ..." rendert auf derselben Stufe wie die anderen Sektions-H2
- [x] alle Home-Sektions-H2 auf EINER Groesse (vorher 16/33/39/42px)
      CHECK: node worklog/.r188f6-heads.mjs
      EXPECT: genau 1 distinkte font-size ueber alle Home-Sektions-H2
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/

## G3 — SW4a: Studio-Bild d-09, kein angeschnittener Kopf
- [x] Im LocationBand-Studio-Bild ist kein Kopf mittig durch die linke Rahmenkante geschnitten
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/ (PNG selbst gelesen)

## G4 — SW4b: Sofa-Bild d-07, Menschen erkennbar
- [x] Das Team-Band zeigt auf 1440px Gesichter/Oberkoerper, nicht nur Beine und Schuhe
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/ (PNG selbst gelesen)

## G5 — AAA: WhatsApp-Blase ueberlappt keinen Fliesstext (mobil)
- [x] Auf 390px liegt die gruene Blase auf keinem Textknoten
      CHECK: node worklog/.r188f6-wa.mjs
      EXPECT: OVERLAPS 0
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/

## G6 — Gruender-Portraets: Hintergrund geprueft
- [x] Sebastians Kachel gegen die drei anderen geprueft; angeglichen ODER begruendet unveraendert
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/

## G7 — Technik
- [x] npm run typecheck gruen
      CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck 2>&1 | tail -3
      EXPECT: kein error TS
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/
- [x] npx oxlint auf den geaenderten Dateien Exit 0
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/
- [x] 0 Konsolenfehler im Capture
      CHECK: node -e "const m=require('/root/clients/salsaflow-w1/worklog/shots/R188/after-final6-home/manifest.json');console.log('ERRS',m.flatMap(x=>x.consoleErrors).length)"
      EXPECT: ERRS 0
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/

## G8 — Scope
- [x] Nur Startseiten-Dateien (src/public/home/*, HomePage) + ggf. WhatsApp-Blasen-Abstaende
      CHECK: cd /root/clients/salsaflow-w1 && git diff --name-only
      EXPECT: keine team/ faq/ courses/ Preise/Events/Shows-Seiten in MEINEM Diff
      EVIDENCE: siehe Abschluss-Protokoll + worklog/shots/R188/after-final6-home/
