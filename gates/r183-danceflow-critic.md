# GATES — Critic Danceflow Sektion 2 Crop

ABANDON: CHECK nicht dieses Session-Item (Header-Kritik SiteHeader R183). Datei ist paralleles Nachbar-Item; CHECK-Zeilen sind Prosa, kein Shell.

## G1 Kernfix im Frame
- [ ] CHECK: Quellcode hat aspect-[4/5] und object-[center_20%] auf Motiv 05, nicht 4/3
- EXPECT: eine Datei, Motiv 05, kein neues Asset
- EVIDENCE: pending

## G2 Crop-Mathe unabhängig
- [ ] CHECK: sichtbares y-Fenster enthält Scheitel (~9.5%) und Kinn (~30%)
- EXPECT: y_start < 9.5 und y_end > 30
- EVIDENCE: pending

## G3 PNGs Kopf sichtbar
- [ ] CHECK: Desktop- und Mobile-PNG zeigen Scheitel und Kinn
- EXPECT: Luft über Scheitel, Kinn nicht am Rand abgeschnitten
- EVIDENCE: pending

## G4 Kein neues Asset
- [ ] CHECK: Diff nur CSS-Klassen, content.ts unverändert, keine neuen Bilddateien
- EXPECT: 1 Datei geändert
- EVIDENCE: pending

## G5 A/B In-Scope?
- [ ] CHECK: A (Weissraum Karten) und B (g1.json ok:false) gegen Auftrag gewogen
- EXPECT: FAIL nur wenn Auftrag verletzt oder Gate-Lüge ship-relevant
- EVIDENCE: pending
