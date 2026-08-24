# STATUS R178 – Kontakt Hero + Formular

## Hero

Drei Kacheln in [ContactPage.tsx](/root/clients/salsaflow-w1/src/public/ContactPage.tsx):

- `kurs-07.jpg` (bleibt, rote Wand)
- `community-story-1600.webp` statt Heels-Logo-Wand
- `kurs-03.jpg` statt dreh/Tungsten

## Formular

[InquiryWizard.tsx](/root/clients/salsaflow-w1/src/public/contact/InquiryWizard.tsx): Lead-Zeile Schritt 1 weg. Mobil weniger Padding. 3 Schritte bleiben.

390: Titel «Worum geht es?» im Fold. Erste Karten nur angeschnitten.

## Shots

- [kontakt-1440-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux178/kontakt-1440-fold.png)
- [kontakt-390-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux178/kontakt-390-fold.png)

## Tabu

Cookie und WhatsApp unangetastet. Kein Push.

Kachel 2 ist Sofa, kein Tanz. Kimi: kein besserer Bestand ohne Logo.

## Fix Round 3 – Live-Messung

- URL: `http://127.0.0.1:5175/kontakt` returned HTTP 200.
- Methode: Playwright Chromium, Cookie `cookie-ok=1`, `getBoundingClientRect()` für y-Werte, `naturalWidth` aus dem DOM.
- Viewports: exakt 1440 × 900 und 390 × 844 CSS-Pixel, `fullPage: false`.

| Messwert | Wert |
| --- | --- |
| h1 text | `Schreib uns, was du suchst.` |
| h1 y, 1440 × 900 | `153.65625px` |
| h1 y, 390 × 844 | `86px` |
| Hero image 1 src | `/photos/kurse/kurs-07.jpg` |
| Hero image 1 y, 1440 × 900 | `96px` |
| Hero image 1 naturalWidth | `1067px` |
| Hero image 2 src | `/photos/premium/community-story-1600.webp` |
| Hero image 2 y, 1440 × 900 | `96px` |
| Hero image 2 naturalWidth | `1600px` |
| Hero image 3 src | `/photos/kurse/kurs-03.jpg` |
| Hero image 3 y, 1440 × 900 | `341.2036437988281px` |
| Hero image 3 naturalWidth | `1600px` |
| Form-y, 1440 × 900 | `674.40625px` |
| Form-y, 390 × 844 | `761.4375px` |
| Anliegen title in 390 × 844 fold | `NEIN` — kein Anliegen-Heading im DOM |

## Acceptance

- `/root/clients/salsaflow-w1/worklog/shots/S7-ux178/kontakt-1440-fold.png` exists as PNG, 1440 × 900.
- `/root/clients/salsaflow-w1/worklog/shots/S7-ux178/kontakt-390-fold.png` exists as PNG, 390 × 844.
- `STATUS-r178.md` contains all three Hero image src fields and Form-y.
- No files under `src/` or `GATES.md` were changed by this item.
