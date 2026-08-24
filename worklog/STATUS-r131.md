# R131 18.08. /tanzkurse/salsa Mobil-Fold

Foto sitzt im 390×844-Fold. Beide Köpfe inkl. Kinn. H1 und beide CTAs bleiben. Crop `center 14%`. R128–R130 bleiben.

## Foto

`/photos/premium/offer-salsa-hero-2100.webp` · Crop `center 14%`.
EN `center 55%` bleibt. Motiv unverändert.

## Klickweg Mobil 390

Fold-Ist: H1 bottom 256, CTA Schnupper bottom 415, CTA Kursplan bottom 475, Foto y=546 h=320 bottom 866, 298 px im Fold. Frau im Profil mit Kinn, Mann mit Kinn. Pills weg (`bullets: []`).
Baseline vor Bau: Foto y=740 h=160, nur Stirn/Dutt. Pills bis y=707.

## Desktop 1440

Foto y=522 h=384, 208 px im Fold. H1 bottom 306, beide CTAs. `lg:h-[24rem]` gehalten. Crop 14% gehalten.

## R128 / R129 / R130

BookingPanel unangetastet in dieser Runde. SchedulePage unangetastet in dieser Runde. CoursesPage unangetastet in dieser Runde.
R131 ändert nur DE `salsa.hero` in `content.ts` (bullets leer, heightClass Mobil/sm höher).

## Shots

[S7-ux131](/root/clients/salsaflow-w1/worklog/shots/S7-ux131/)
- [salsa-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux131/salsa-mobil-390.png)
- [salsa-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux131/salsa-desktop-1440.png)

Sweep `--routes /tanzkurse/salsa` plus `--mobile`. Verify: VERDICT PASS. Locks tot. API 74.
Sol-Lane: PASS. Luna: pass true. Kimi-Look: pass false (will Motivwechsel; Lock verbietet das. Pixel: Frau-Profil mit Kinn, nicht Hinterkopf).
Kein Push.
