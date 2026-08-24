# STATUS R164 – 17.08-Rest

## Ist

Header DE/EN und Meta standen. Schnupper sprang ins Formular (H1 bei y −306). Buchung-Schritt 2 war nicht belegt.

## Soll

Schnupper startet im Hero. Köpfe sichtbar. Modal-Schritt 2 zeigt Datenfelder. Header wechselt DE/EN.

## Bau

- [InquiryWizard.tsx](/root/clients/salsaflow-w1/src/public/contact/InquiryWizard.tsx): Fokus nur nach echtem Schrittwechsel. StrictMode scrollt nicht mehr.
- Buchung Schritt 2: Vorname, Nachname, Mail. Ein Schritt, luftig.
- Header: `lang-${l}` plus EN-Copy `Classes`.

oxlint InquiryWizard Exit 0.

Live: Header EN-Shot, Schnupper-Fold scrollY 0, Buchung Schritt 2.

Nicht angefasst: Cookie, WA-Komponente, kit.tsx, Home, Header-Dropdowns, Collabs, Partys, Tanzschuhe, Team.

Locks: classfreude-01, Team 39 %, Bachata 20 %, Cookie `pr-[5.5rem]`.

## Shots

- [header-en-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux164/header-en-1440.png)
- [schnupper-fold-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux164-schnupper/schnupper-fold-1440.png)
- [schnupper-fold-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux164-schnupper/schnupper-fold-390.png)
- [buchung-step2-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux164-form/buchung-step2-1440.png)

## Kritik

### Parent (PNGs gelesen)

- headerEn: JA. Classes, Schedule, Prices, EN aktiv.
- schnupperH1: JA. «Komm einmal.» scrollY 0.
- schnupperKoepfe: JA. Frau vorne inkl. Stirn. Foto classfreude-01.
- formStep2: JA. Vorname, Nachname, E-Mail. Schritt 2 von 2.
- meta: Events-Description ist konkret, nicht «Salsaflow Dance Company.» allein.

## Offene Punkte

- Look-Kritik nicht abgewartet.
- Kein Production-Push.
