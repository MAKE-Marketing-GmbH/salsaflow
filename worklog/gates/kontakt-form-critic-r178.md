# GATES — Critic Runde 2, Item kontakt-form (nicht Root)

- [ ] A1 Schritt-1-Titel UND erste Anliegen-Karten im 390-Fold lesbar
  CHECK: Screenshot + Messung (Karten-Text sichtbar, nicht nur Rand)
  EXPECT: Kartentext (z.B. Schnupperstunde) im Fold lesbar; >50% der ersten Kartenreihe sichtbar
- [ ] A2 Weniger Text, gleiche Felder
  CHECK: Lead-Zeile Schritt 1 gestrichen; 8 Karten; 3 Schritte
  EXPECT: weniger Copy, TOPIC_ORDER Länge 8, LAST_STEP=2
- [ ] A3 Wizard 3 Schritte, kein 4. Schritt
  CHECK: grep step=== in InquiryWizard.tsx
  EXPECT: genau step===0,1,2
- [ ] Scope: nur InquiryWizard.tsx + content.ts
  CHECK: git diff -- src/public/contact/
  EXPECT: ContactPage.tsx und kit.tsx unberührt im Item-Scope
- [ ] Tabu: WhatsApp-Float und Cookie unberührt
  CHECK: keine Änderungen an Float/Cookie in den zwei Dateien
  EXPECT: kein max-sm:sticky mehr das den Fold verdeckt; Float nicht verschoben
