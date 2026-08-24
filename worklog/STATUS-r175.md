# STATUS R175 – Video-Rest belegt

## Ist

Evidence nach Meta/Events/Floweekend nicht neu gelaufen. Events-Reveal nur Standbild. Bachata-Look zwei FAIL.

## Soll

32 Checks plus Reveal 0→1. Bachata-src ehrlich. Kein Push.

## Bau

- Evidence: [worklog/.video-evidence.mjs](/root/clients/salsaflow-w1/worklog/.video-evidence.mjs) Check `v13-events-reveal` (selbes Element, `data-ev-probe`).
- Bachata bleibt [StylePage.tsx Z191](/root/clients/salsaflow-w1/src/public/courses/styles/StylePage.tsx): `hero-paar-studiowand-01.webp`.
- Cookie, kit, Home, WA nicht angefasst.

## Messung

`node worklog/.video-evidence.mjs` → fail=0 total=33.

`v13-events-reveal` start op=0 y=1063 → after op=1 y=128, gleicher Text.

Cookie: `pr-[5.5rem]`, Live pr=88px.

## Bachata ABANDON

Kein Bestandfoto ist heller und Paar mit Blickkontakt.

| Datei | Mittel |
|---|---|
| studiowand | 110.9 |
| offer-bachata-1200 | 84.7 |
| party-35-v3 | 83.1 |
| dreh-01 | 76.9 |
| social-couple | 58.9 |

studiowand bleibt. Logo/Orange sind Look-Rest, kein Tausch ohne neues Foto.

## Kritik Parent

- evidence: JA. fail=0
- reveal: JA. 0→1 selbes Kind
- bachata-src: JA. nicht offer-bachata-1200
- cookie: JA
- kein Push: JA

## Offene Punkte

- Bachata-Look: Logo im Bild, warmer Stich. Nur mit neuem Foto lösbar.
- Kein Production-Push.
