# STATUS R167 – Wizard-Fokus nach R164-BLOCKED

## Ist

Der R164-Workflow setzte InquiryWizard auf HEAD zurück. Der Fokus-Effect lief wieder bei step=1 auf Mount. Der Builder baute einen 900-ms-Scroll-Riegel auf der Schnupperseite.

## Soll

Fokus nur nach echtem Schrittwechsel. Hero bleibt oben ohne Scroll-Hack.

## Bau

- [InquiryWizard.tsx](/root/clients/salsaflow-w1/src/public/contact/InquiryWizard.tsx): `prevStep`. StrictMode scrollt nicht.
- [SchnupperstundePage.tsx](/root/clients/salsaflow-w1/src/public/SchnupperstundePage.tsx): `useNoAutoScrollOnLoad` entfernt. Weiter-Knopf-Abstand bleibt.

oxlint Exit 0.

Live: 1440 scrollY 0, H1 y 158. 390 scrollY 0, H1 y 98.

Nicht angefasst: Cookie, WA-Komponente, kit.tsx, Home, FAQ, StylePage.

Locks: classfreude-01, Team 39 %, Bachata 20 %, Cookie `pr-[5.5rem]`.

## Kritik

### Parent (gemessen)

- schnupperH1: JA. «Komm einmal. Entscheide danach.» scrollY 0.

## Offene Punkte

- Look-Kritik nicht abgewartet.
- Kein Production-Push.
