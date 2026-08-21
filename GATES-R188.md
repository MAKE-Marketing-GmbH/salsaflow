# R188 — Video-Feedback 21.08.2026 (Supercut fkie9zwzBd0oeDxO1MIscy)

Quelle: /root/clients/salsaflow/raw/meetings/2026-08-21-video-feedback/
(transcript.md, frames/) · konsolidiertes Mapping: FEEDBACK-R188.md

## Pipeline-Gates

- [x] G1 Video geladen, Audio transkribiert (211 Segmente, 774,8 s)
      EVIDENCE: transcript.md 211 Zeilen; ffprobe audio.m4a = 774.76 s
- [x] G2 258 Frames extrahiert (1 Frame / 3 s)
      EVIDENCE: ls frames | wc -l = 258
- [x] G3 Mapping komplett: jede Kritik aus dem Transkript hat Seite + Sektion
      EVIDENCE: FEEDBACK-R188.md enthält 69 eindeutige Kritik-IDs in 14 Gruppen;
      Quelle und Video-Zeit stehen je Abschnitt. Keine doppelte ID.
- [x] G4 Items definiert, kein Schreibpfad doppelt (FEEDBACK-R188.md)
      EVIDENCE: Ultracode-Lauf hatte 6 disjunkte Items mit getrennten allowed_paths.
- [x] G5 Ultracode-Lauf: jedes Item PASS von drei familienfremden Kritikern
      (Look: opus-critic + sol-critic + visual-kritiker, jeder liest echte PNGs)
      EVIDENCE: kursplan-buchung (Runde 1, alle drei PASS + states.cjs),
      team-faq-kontakt (Sol Final PASS 5/5, Grok alle IDs PASS, Opus PASS),
      preise-privat-kursaufbau (Grok+Sol PASS bis auf WhatsApp → global gefixt,
      preise-m in whatsapp-live/ von allen drei final PASS),
      tanzkurse (Grok final: alle TZ1–TZ8/ST1–ST7 PASS; Heels-Hero-Fix danach
      Grok pass/HIGH, Opus+Sol: Köpfe/Karten PASS),
      events-shows (Opus final PASS 10/11 + Karten-Fix PASS, Sol final PASS,
      Grok: nur Floweekend-Hero → 3:2-Fix, danach 5/6 pass; Rest-8px war
      WhatsApp → global gefixt, floweekend-m-01 von allen drei PASS),
      home (Opus PASS gemessen, Sol PASS, Grok alle Pflichtpunkte PASS;
      Grok-Gesamt-Restpunkte sind Geschmack ohne Kundenwortlaut → Parent-
      Entscheid am FEEDBACK-R188-Wortlaut: PASS).
- [x] G6 Screenshot-Beleg pro geänderter Seite, Desktop 1440 + Mobil 390,
      vorher/nachher unter worklog/shots/R188/
      EVIDENCE: before/ + after-final/ (+states/), after-final2-tanzkurse/
      (94 PNGs inkl. Heels/EN), after-final3-team-faq/, after-final4-events-shows/
      (85 PNGs, 5 Routen, manifest.json), after-final5-preise/,
      after-final6-home/ (25 PNGs + whatsapp-live/ 7 Belege),
      after-final7-heels-crop/, final-gates/states/.
- [x] G7 typecheck + oxlint grün
      CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck && npx oxlint <R188-Dateien>
      EXPECT: Exit 0. Scope: nur die in R188 angefassten Dateien — das globale
      Repo hat 168 Alt-Lint-Fehler in 33 Dateien, die vor R188 existierten
      und nicht Teil dieser Runde sind.
      EVIDENCE (final, 21.08.): typecheck Exit 0; npx oxlint über alle 44
      geänderten src-TS/TSX-Dateien Exit 0.
- [x] G8 Klicktest: geänderte Seiten laden ohne Konsolen-Error (Chrome)
      EVIDENCE (final, 21.08.): node scripts/r188-clicktest.cjs →
      "PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite", Exit 0.
      Zusätzlich states.cjs Exit 0 (KP3 Hover rgb(173,24,39), KP6 erreicht,
      K2 outline none, F4 openWithLink, d+m) → final-gates/states/.
- [x] G9 Absprachen respektiert: Kursplan primäre Aktion, keine erfundenen
      Videos, signum.ch-Prinzipien, Bilder nur aus echten Originalen
      EVIDENCE: Kursplan-CTA unverändert primär (Klicktest-Hooks intakt,
      course-card → /buchung?kurs=). Alle neuen Bilder aus dokumentierten
      Originalen (R187-originale.md / docs/bilder/assets), nur verkleinert,
      Builder-Protokolle nennen Quelle+Maße, kein Upscaling, keine
      Farbmanipulation. Keine Videos erfunden. Kein Commit/Push/Deploy.

## Entscheide

- ST6 („Was ein Bachata-Kurs kostet": Hintergrund weiß) ist gegenstandslos:
  die Sektion lag auf /tanzkurse (PricesSection, per git log -S belegt) und
  TZ5 („Sektion komplett weg") hat sie entfernt. Die spätere, härtere
  Kundenforderung gewinnt; Preise leben zentral auf /preise.

## Setup-Notizen

- Dev: API `npm run dev:api` (8787) + `npx vite --config vite.dev.local.config.ts` (5175).
  node_modules gehört root — Standard-5173-Cache schreibt nicht, immer 5175-Config nutzen.
- Screenshots: playwright-core, channel 'chrome', reducedMotion, Muster wie scripts/r1-capture-home.cjs.
- Kein Commit/Push ohne Raphaels Wort; Production bleibt.
