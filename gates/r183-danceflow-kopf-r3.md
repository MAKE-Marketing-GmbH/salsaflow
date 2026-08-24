# Gates: danceflow-kopf critic r3

Scope: Visuell prüfen ob Scheitel+Kinn im Frame, kein 4/3, kein neues Asset, Sektion-Look.

- [x] G1: why-image-after zeigt Scheitel UND Kinn
  EVIDENCE: Read worklog/shots/danceflow-kopf/why-image-after.png. Stirn, Scheitel, fliegende Haare oben im Frame mit Luft. Kinn, Hals, Schulter klar drin.

- [x] G2: why-image-mobile zeigt Scheitel UND Kinn
  EVIDENCE: Read worklog/shots/danceflow-kopf/why-image-mobile.png. Gleiches Fenster. Kopf ganz. Kinn drin.

- [x] G3: why-section-after 1440 Sektion-Look nicht gebrochen
  EVIDENCE: Read why-section-after.png. Foto links Hochformat-Kachel, Text+3 Karten rechts. Creme-Gutter, kein schwarzer Balken. Foto-Ende etwa bei CTA. Raster hält.

- [x] G4: why-section-mobile 390 Sektion-Look nicht gebrochen
  EVIDENCE: Read why-section-mobile.png. Text, Foto volle Breite, dann 3 Karten. Kopf ganz. Stack nicht gebrochen.

- [x] G5: Baseline zeigt den alten Schnitt (Kopf oben ab)
  EVIDENCE: Read why-image-baseline.png und why-section-baseline.png. Nur Kinn, Hals, Schulter. Scheitel fehlt. Raphaels Beschwerde bestätigt.

- [x] G6: Why-img aspect 4/5, object-position center 20%, kein 4/3 auf dieser Kachel
  EVIDENCE: DanceflowNightPage.tsx:160 className="aspect-[4/5] w-full object-cover object-[center_20%]". Hero-4/3 in Zeile 119 ist eine andere Sektion, nicht dieses Item.

- [x] G7: 05-v3.webp unverändert 142964 Bytes, kein neues Asset
  EVIDENCE: public/photos/gallery/danceflow/05-v3.webp 142964 Bytes, md5 6f58a8780e8e79785bc0bfc89a699530. git diff leer. Keine neue .webp/.jpg/.png ausser worklog-Shots.

ABANDON: leftover-other-round nicht R189-Rest
