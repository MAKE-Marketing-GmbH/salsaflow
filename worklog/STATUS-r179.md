# STATUS R179 – Kursplan Hero-Band

## Ist

Desktop-Band war 176px (`lg:h-[11rem]`). Cookie-CSS stauchte auf 10rem/8.25rem.

## Soll

Nicht knapp. Köpfe ganz.

## Bau

- [SchedulePage.tsx](/root/clients/salsaflow-w1/src/public/SchedulePage.tsx): `h-[14rem] sm:h-[15rem] lg:h-[18rem]`, crop `center 16%`
- [index.css](/root/clients/salsaflow-w1/src/index.css): Cookie-Stauchen 11rem mobil, 14rem ab 40rem. CookieBanner unangetastet.

## Messung

- Accept 1440: Band 288px. 390: 224px. Wochentage im Fold.
- Cookie 1440: Band 224px. 390: 176px. Köpfe sichtbar.

## Shots

- [kursplan-1440-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux179/kursplan-1440-fold.png)
- [kursplan-390-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux179/kursplan-390-fold.png)
- [kursplan-1440-cookie.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux179/kursplan-1440-cookie.png)

Ultracode Look BLOCKED nach 3 Runden (Beweis-Set). Sol-Lücke Cookie-160px: gehoben. Nächste Fläche /team.
