# Gates: R190 Runde-7-Rest (Technik-Kritik)

Scope: Trust-dl unter Fold 360×780 vs 390×844 live, Offer-H2 RiseReveal, Clip-Gates nicht tot-skaliert.

- [x] G1: Trust-dl ist auf 360×780 per CSS versteckt, zweiter CTA bleibt über dem Fold
  CHECK: NODE_PATH=/root/clients/salsaflow-w1/node_modules node /tmp/r190-r7-measure.cjs
  EXPECT: 360 hidden=true
  EVIDENCE: 360×780 dlDisplay=none, schnupperBottom=765, fold=780, Reserve 15 px. Shot /tmp/r190-r7-shots/360x780-fold.png ohne Trust-Zeile.

- [x] G2: Trust-dl ist auf 390×844 sichtbar und endet über dem Fold
  CHECK: NODE_PATH=/root/clients/salsaflow-w1/node_modules node /tmp/r190-r7-measure.cjs
  EXPECT: 390 hidden=false reserve>=0
  EVIDENCE: 390×844 dlDisplay=flex, dlTop=803, dlBottom=842, fold=844, dlReserve=2 px. Shot /tmp/r190-r7-shots/390x844-fold.png zeigt G · Sterne · 4,9 · 104.

- [x] G3: Offer-H2 trägt live data-reveal-variant=rise, nicht blur/clip
  CHECK: NODE_PATH=/root/clients/salsaflow-w1/node_modules node /tmp/r190-r7-measure.cjs
  EXPECT: offerH2=rise
  EVIDENCE: beide Viewports offerH2Variant=rise, Offer-Kinder nur rise (H2 + Raster). Kein clip in #angebot.

- [x] G4: Clip-Startvorhang >= 30, MIN_CLIP_LEFT nicht 0
  CHECK: NODE_PATH=/root/clients/salsaflow-w1/node_modules node /tmp/r190-r7-measure.cjs
  EXPECT: clipStart>=30 minClipLeft>0
  EVIDENCE: clipStart=45, opacity=0.55, MIN_CLIP_START=30, MIN_CLIP_LEFT=11.8. Schwelle nicht auf 0 skaliert.
