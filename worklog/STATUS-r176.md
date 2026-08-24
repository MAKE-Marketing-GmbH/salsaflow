# STATUS R176 – Bachata-Look

## Ist

studiowand-01: hell (110.9), aber Wand-Logo und Rücken. Opus FAIL Logo, Grok FAIL Orange.

## Soll

Punkt 7: nicht dunkel, nicht falsch eingefärbt. Gesichter, kein Logo-Hero.

## Bau

[`StylePage.tsx`](/root/clients/salsaflow-w1/src/public/courses/styles/StylePage.tsx) `BACHATA_HERO_PHOTO.src` = `/photos/party/party-33.webp`.

Crop-Lock bleibt `center 20%` (Live objectPosition). oxlint Exit 0.

party-33: Mittel 97.1, R-B −29.9. Nur gallery sonst. Kein KI.

## Shots

- [bachata-nachher-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux176/bachata-nachher-fold.png)
- [bachata-nachher-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux176/bachata-nachher-390.png)

## Kritik

| Kritiker | Verdict | biggest_gap |
|---|---|---|
| opus-critic | PASS | Foto auf 390 unter dem Fold |
| sol-critic | PASS | WA überdeckt ersten Chip mobil |
| visual-kritiker | PASS | Spiegel-Logo rechts |

## Offene Punkte

- Spiegel-Logo bleibt im rechten Drittel. Kein besserer Pair-Shot ohne Logo im Bestand.
- Kein Production-Push.
