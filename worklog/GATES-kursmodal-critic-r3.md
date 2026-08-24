# Gates: Kursmodal Kritiker Runde 3 (Kreativ/UI)

Scope: PASS/FAIL-Urteil: Modal klarer/simpler, Absprache 17.08. gehalten. Kein Fix.

- [x] G1: Alle 6 genannten PNGs selbst geoeffnet
  CHECK: python3 -c "from pathlib import Path; p=Path('worklog/shots/r183-kursmodal'); names=['vorher-offeneklasse.png','nachher-offeneklasse.png','gegenprobe-runde2.png','nachher-390-step1.png','nachher-390-step2.png','nachher-390-reduced.png'];
print('ok' if all((p/n).is_file() and (p/n).stat().st_size>1000 for n in names) else 'missing')"
  EXPECT: ok
  EVIDENCE: ok. Dateien in worklog/shots/r183-kursmodal/, alle 6 geoeffnet. Gegenprobe hat den Kurstyp-Satz, nachher-offeneklasse nicht. reduced sieht wie step1 aus.

- [x] G2: BookingPanel.tsx gelesen (Kopf, Steps, offene Klasse, Fuss)
  EVIDENCE: Kopf nur courseLabel Z.1119-1121. isOpen-Zweig fuer openClassNote weg Z.1321. goToStep2 blockt ohne Rolle Z.959-966. Weiter bleibt optisch aktiv Z.1395-1402.

- [x] G3: Urteil PASS oder FAIL mit groesstem Einzelbefund
  EVIDENCE: PASS. SOLL simpler/nicht voller erfuellt. Absprache 17.08. gehalten (Tag/Zeit/Lehrer/Kurstyp-Satz raus). 4 Acceptance-Checks am Bild und an den Builder-Zahlen getragen. Kein Scope-Bruch in BookingPanel.tsx.
