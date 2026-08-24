# STATUS R168 – Video-Evidence 26/26

## Ist

Der Video-Pass prüfte nur H1 und HTTP. /fotos hatte den Filter «Team». Raphael 07:18: keine Porträts in der Galerie.

## Soll

Jeder Video-Punkt hat eine Messung. Team-Filter ist weg.

## Bau

- [PhotosPage.tsx](/root/clients/salsaflow-w1/src/public/PhotosPage.tsx): Filter ohne `team`. Gruppenfotos bleiben in Alle.
- [`.video-evidence.mjs`](/root/clients/salsaflow-w1/worklog/.video-evidence.mjs): 26 Checks.

oxlint PhotosPage Exit 0.

Live fail=0. WA-Kreis 56×56, Animation `whatsapp-float-in`. Cookie mobil pr 88px. Partys-Blob 192×192. Collabs nach Scroll 4 Bilder. Meta konkret.

CookieBanner und WhatsAppFloat nicht angefasst.

Locks: Team 39 %, Salsa 14 %, Bachata 20 %, Cookie-Klasse `pr-[5.5rem]`.

## Shots

- Report [report.json](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/report.json)
- [fotos-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/fotos-1440.png)
- [partys-reveal.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/partys-reveal.png)

## Kritik

### Parent

- teamFilterWeg: JA. Evidence `teamChip=0`.
- waKreis: JA. 56×56, Label none.
- cookieMobil: JA. 88px.

## Offene Punkte

- Look-Kritik nicht abgewartet.
- Kein Production-Push.
