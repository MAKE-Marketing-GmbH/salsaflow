# R132 18.08. /tanzkurse/bachata Mobil-Fold

Foto sitzt im 390×844-Fold. Beide Köpfe inkl. Kinn. H1 und beide CTAs bleiben. Crop `center 20%`. R128–R131 bleiben.

## Foto

`/photos/premium/offer-bachata-wide-v2.webp` · Crop `center 20%`.
EN `center 22%` bleibt. Motiv unverändert.

## Klickweg Mobil 390

Fold-Ist: H1 bottom 215, CTA Schnupper bottom 393, CTA Kursplan bottom 453, Foto y=528 h=320 bottom 848, 316 px im Fold. Beide Gesichter inkl. Kinn. Pills weg (`bullets: []`).
Baseline vor Bau: Foto y=772 h=160, 72 px im Fold, nur Stirn/Haar.

## Desktop 1440

Foto y=474 h=176, ganz im Fold. H1 bottom 238, beide CTAs. `lg:h-[11rem]` gehalten. Crop 20% gehalten. Beide Kinn sichtbar.

## R128 / R129 / R130 / R131

BookingPanel unangetastet. SchedulePage unangetastet. CoursesPage unangetastet. Salsa-Block unangetastet (Crop 14%, heightClass 20/22/24).
R132 ändert nur DE `bachata.hero` in `content.ts`.

## Shots

[S7-ux132](/root/clients/salsaflow-w1/worklog/shots/S7-ux132/)
- [bachata-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux132/bachata-mobil-390.png)
- [bachata-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux132/bachata-desktop-1440.png)

Sweep `--routes /tanzkurse/bachata` plus `--mobile`. Verify: VERDICT PASS. Locks tot. API 74.
Sol-Lane: PASS. Luna: pass true. Kimi-Look: pass false (Desktop-Kinn zu knapp; Crop 20% und lg 11rem sind Lock. Dasselbe 176px-Fenster wie vor R132).
Kein Push.
