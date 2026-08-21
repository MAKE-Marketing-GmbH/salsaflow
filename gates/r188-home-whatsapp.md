# Gates: R188 Home und globaler WhatsApp-Abschluss

Scope: Bestehende Home-Änderungen sichern, fünf sichtbare Punkte abschließen und alle geforderten Viewports belegen.

- [x] G1: Die Bachata-Karte nutzt ein echtes, ungefiltertes Bild mit neutraler bis warmer Farbbalance.
  EVIDENCE: hp-26.webp gemessen R=136.8 G=129.7 B=135.9, R-B=0.9 (Nachbarkarten 35.7 / 26.8 / 5.4). CSS-Filter photo-grade-bachata entfernt, src/public/home/Offer.tsx + content.ts.

- [x] G2: Alle Home-Sektions-H2 haben dieselbe gerenderte Größe und Zeilenhöhe; die Grundschritt-Zeile wirkt nicht wie 16px.
  EVIDENCE: H2 COUNT 9 DISTINCT SIZES 44. "Vom ersten Grundschritt" rendert als H3 fs=44 lh=46.2 [type-h2], identisch zu den übrigen neun. FAQ-Fragen 17.3px via .type-h3-sub statt Browser-Default 16px/400.

- [x] G3: Home d-09 schneidet links keinen Kopf an.
  EVIDENCE: event-party-dreh-01.webp object-[75%_45%], box=674x585 nat=1920x1280, sichtbar B=76.7% H=100.0%. PNG gelesen: /root/clients/salsaflow-w1/worklog/shots/R188/after-final6-home/home/d-09.png

- [x] G4: Das Sofa-Bild zeigt Personen, Köpfe und Situation auf Desktop und Mobil.
  EVIDENCE: team-band-original-2800.webp (2800x1867) mit sm:aspect-[16/9] statt sm:aspect-[9/4]. box=1336x752, sichtbar H=84.4% (Gruppe liegt 12.9%–86.0%), mobil 100%. src/public/home/TeamBlock.tsx

- [x] G5: Der erreichbare WhatsApp-Button überdeckt auf allen geforderten Viewports keinen wesentlichen Inhalt.
  CHECK: node worklog/.r188-wa-verify.mjs
  EXPECT: /PASS whatsapp collisions=0/
  EVIDENCE: "ERREICHBAR 121/147 Scrollpositionen / PASS whatsapp collisions=0" über 5 Routen x 2 Viewports. Zwei harte Abnahmekriterien: Heels d-02 worst=null (vorher 27px auf hp-22.webp), Heels m-01 alle overlap=0 (vorher Chip verdeckt). Floweekend m-01 overlap 8px -> 0.

- [x] G6: Alle geforderten Home- und WhatsApp-PNGs liegen unter worklog/shots/R188/after-final6-home und wurden einzeln gelesen.
  EVIDENCE: 119 PNGs unter worklog/shots/R188/after-final6-home, zusätzlich 7 Live-Belege mit gesetztem Solver-Zustand unter whatsapp-live/ inkl. manifest.json. consoleErrors überall leer.

- [x] G7: TypeScript-Typecheck ist grün.
  CHECK: npm run typecheck
  EXPECT: /exit 0/
  EVIDENCE: tsc -p tsconfig.json --noEmit && tsc -p tsconfig.node.json --noEmit, Exit 0, keine Ausgabe.

- [x] G8: Oxlint ist nur auf den geänderten TS/TSX/JS-Dateien grün.
  CHECK: npx oxlint src/public/home/CoursePath.tsx src/public/home/Faq.tsx src/public/home/Hero.tsx src/public/home/LocationBand.tsx src/public/home/Offer.tsx src/public/home/TeamBlock.tsx src/public/home/content.ts src/public/site/WhatsAppFloat.tsx
  EXPECT: /OXLINT_EXIT=0/
  EVIDENCE: OXLINT_EXIT=0, keine Befunde. (worklog/** liegt in ignorePatterns, daher ist der Verifier nicht gelistet.)

- [x] G9: Der R188-Klicktest ist grün.
  CHECK: node scripts/r188-clicktest.cjs
  EXPECT: /PASS: 21 Routen/
  EVIDENCE: "PASS: 21 Routen, Kontakt, FAQ, Kursplan, Buchung und Stilseite"

- [ ] G10: Visual-G1 ist grün, drei unabhängige Kritiker haben echte PNGs gelesen und das Ship-Manifest ist gültig.
  ABANDON: G10 Kritik-Doppelung ist Sache des Koordinators, nicht des Builders (Regel 8: kein Selbst-Urteil). Belege und Messwerte liegen vollständig vor; opus-critic + sol-critic + visual-kritiker müssen extern laufen.
