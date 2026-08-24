# STATUS R170 – Video-Kritik beantwortet

## Ist

Captions nannten nur die Szene. Zwei Hero-Fotos lagen noch im Raster. Preise-Shot war zu früh.

## Soll

Kurzer Kontext mit Serie und Ort. Kein Hero-Motiv im Raster. Preise im Fold. Bilder mit echter Breite.

## Bau

- [PhotosPage.tsx](/root/clients/salsaflow-w1/src/public/PhotosPage.tsx): Caption mit Serie und Ort. Keine erfundenen Daten.
- [content.ts](/root/clients/salsaflow-w1/src/public/gallery/content.ts): studio-flow-v2 und lady-style-v2 nur im Hero.
- [PartysPage.tsx](/root/clients/salsaflow-w1/src/public/PartysPage.tsx): MoreSection gestapelt, keine tote linke Spalte.
- Evidence: 32 Checks. classfreude naturalWidth 1920. Preise CHF 190 im Fold.

oxlint Exit 0. Cookie und Home unangetastet.

## Shots

- [fotos-grid-captions.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/fotos-grid-captions.png)
- [preise-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/preise-1440.png)
- [report.json](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/report.json)

## Kritik

### Parent

- kontext: JA. «Danceflow Night, Basel, 1./3./5. Freitag.»
- heroDup: JA. hit=[]
- preiseFold: JA. CHF 190 / 100 / Gratis bei y=499. Link-Farbe 173,24,39.
- reso: JA. classfreude 1920.

## Offene Punkte

- Look-Kritik parallel.
- Kein Production-Push.
