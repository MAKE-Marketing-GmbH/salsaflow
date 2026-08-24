# GATES — Critic Runde 2 Kursmodal (Kimi)

- [x] G1 PNGs selbst gelesen
  EVIDENCE: 5 PNGs in worklog/shots/r183-kursmodal/ geoeffnet (vorher-offeneklasse, nachher-offeneklasse, nachher-390-step1, step2, reduced). Zusaetzlich vorher-390-step1 zum Delta.

- [x] G2 Code gelesen
  EVIDENCE: BookingPanel.tsx visibleStep Z.947, openClassNote Z.1304-1311, mode Default 'solo' Z.840, role null Z.836, Privacy-Link Z.1435-1442, motion-safe Z.1090. i18n openClassNote Z.205.

- [x] G3 Acceptance
  EVIDENCE: nachher.json overflow dialogScrollWidth=364 viewport=390; step1 meaningful 15 (vorher 22), step2 22 (vorher 28); tooSmall []; motion runningAnimations=0 opacity=1. Nachher-offeneklasse.json fails=[].

- [x] G4 Fragen 1-6
  EVIDENCE: 1 Rest=Offene-Klasse-Satz. 2 Satz streichen. 3 Halbe Vorauswahl Altlast, bleibt schief. 4 Kopf ohne Label reicht. 5 Recap zu leise, Zurueck da. 6 Link eigene Zeile = Footer voller, Touch besser.

- [x] G5 Verdict
  EVIDENCE: FAIL. SOLL simpler/nicht voller nicht klar erfuellt: neuer Erklaer-Satz plus Kurs-Typ im Modal.
