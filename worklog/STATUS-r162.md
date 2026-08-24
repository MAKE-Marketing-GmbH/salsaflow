# STATUS R162 – Kursseite + Anmelde-Modal

## Ist

Stilseite nannte den Stil, aber keinen Termin. Modal trug Ort, Staffel und Kursdaten noch einmal.

## Soll

Termine auf der Stilseite. Frei oder Ausgebucht in der Zeile. Modal nur Rolle und Daten. Formular luftiger.

## Bau

- [StylePage.tsx](/root/clients/salsaflow-w1/src/public/courses/styles/StylePage.tsx): Sektion Termine. Gruppen nach Wochentag. `data-testid="style-slot"`. Link `/buchung?kurs=`.
- [HeelsView.tsx](/root/clients/salsaflow-w1/src/public/courses/styles/HeelsView.tsx): `StyleSlotsSection` nach Atmosphere. Ultracode R162 war BLOCKED (write_set). Produkt sitzt.
- [BookingPanel.tsx](/root/clients/salsaflow-w1/src/public/BookingPanel.tsx): Dialog-Kopf nur Kursname. Schritt 1 Rolle + Allein/Paar.

oxlint StylePage + BookingPanel Exit 0.

Nicht angefasst: Home, Cookie, WA, Team, Photos, Events, Collabs, Partys, Tanzschuhe, Privat, Heels-Crop-Lock.

Locks: Salsa 14 %, Bachata 20 %, Team 39 %, Collabs 24 %, Tanzschuhe 84 %, Partys 10 %, Cookie `pr-[5.5rem]`.

## Shots

- [salsa-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux162/salsa-desktop-1440.png)
- [salsa-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux162/salsa-mobil-390.png)
- [salsa-termine-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux162/salsa-termine-desktop-1440.png)
- [salsa-termine-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux162/salsa-termine-mobil-390.png)
- [buchung-modal-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux162-modal/buchung-modal-1440.png)
- [heels-termine-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux162/heels-termine-1440.png)

## Kritik

### Parent (PNGs gelesen)

- termineSichtbar: JA. Überschrift «Wann du tanzen kannst». Montag-Gruppe. Uhr, Level, Lehrer, Pille «frei».
- ausgebuchtSichtbar: Code setzt graue Pille bei `bookable.status === 'full'`. Live-Salsa-Zeilen im Shot alle «frei» (Oktober-Staffel offen).
- modalNurRolle: JA. Kopf nur «Bachata Beginner Stufe 4». Kein Ort, keine Staffel. Leader weiss auf Rot.
- formularLuft: JA. Zwei Kachel-Reihen, Abstand, Schritt 1 von 2.
- waRechtsKreis: JA.
- heelsTermine: JA. «Wann du tanzen kannst». Donnerstag 18:30 Intermediate Jasmine frei, 19:30 Beginner Jasmine frei.

## Offene Punkte

- FAQ, Tanzschuhe, Collabs/Partys: R163.
- Kein Production-Push.
