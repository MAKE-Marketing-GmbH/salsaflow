# STATUS R169 – Fotos-Kontext + harte Checks

## Ist

Galerie-Fotos hatten nur Alt-Text. Evidence-Checks waren zu weich (H1/HTTP).

## Soll

Kurzer sichtbarer Kontext unter jedem Galerie-Foto. Jeder Video-Punkt hat eine harte Messung.

## Bau

- [PhotosPage.tsx](/root/clients/salsaflow-w1/src/public/PhotosPage.tsx): `figure` plus `figcaption`. Team-Album nicht sichtbar.
- [content.ts](/root/clients/salsaflow-w1/src/public/gallery/content.ts): drei posierte Wand-Gruppen raus.
- [`.video-evidence.mjs`](/root/clients/salsaflow-w1/worklog/.video-evidence.mjs): 29 Checks.

oxlint PhotosPage und gallery/content Exit 0.

Live fail=0, 30 Checks. Captions n=84. Team-Badge 0. Raster-Loch gap=0. Reveal 0→1. Cookie pr 88px. WA 56×56.

Nicht angefasst: CookieBanner, WhatsAppFloat, kit.tsx, Home.

Locks: Team 39 %, Salsa 14 %, Bachata 20 %, Cookie `pr-[5.5rem]`.

## Shots

- Report [report.json](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/report.json)
- [fotos-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/fotos-1440.png)
- [fotos-grid-captions.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/fotos-grid-captions.png)
- [partys-reveal.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/partys-reveal.png)
- [privat-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/privat-1440.png)
- [preise-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-video-evidence/preise-1440.png)

## Kritik

### Parent

- captions: JA. n=84, Sample «Paar tanzt mitten in der Menge bei einer Danceflow Night».
- teamPortraetWeg: JA. Badge 0. hp-03, hp-08, community-comeback-v2 raus.
- reveal: JA. 0 → 1.
- privatHero: JA. H1 «Unterricht für genau dein Ziel.», Bild 651px.

## Offene Punkte

- Look-Kritik parallel, nicht blockierend.
- Kein Production-Push.
