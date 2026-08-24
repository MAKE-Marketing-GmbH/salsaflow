# R127 18.08. Kunden-Ready messen

Kein Bau. Journey auf `/buchung` und `/kursplan` Mobil 390 ist in drei Schritten klar.

## Live Jimdo vs Worktree

Jimdo `/kurse/`: drei Studio-Fotos plus PDF. Kein klickbarer Plan.
Jimdo `/angebot/anmeldeformular-kurse/`: langes Formular. Alle Kurse als Checkboxen nach Studio. Partnerfelder. AGB. Mobil schwer.

Worktree `/kursplan`: Staffel, Woche, Tag, frei/ausgebucht, Modal.
Worktree `/buchung`: drei Schritte, Reservierung, zahlst vor Ort. Kein Stripe.

## Klickweg `/buchung` 390 (ohne Mail raus)

Sichtbar am Fold Di 18.08. (8 Kurse):
- 18:30 Salsa Beginner Stufe 2, frei
- 18:30 Salsa Intermediate Stufe 9, frei
- 19:30 Basics & Fundamentals, frei
- 19:30 Salsa Advanced Stufe 16, frei
- 19:30 Salsa Beginner Stufe 3, frei
- 20:30 Cha Cha Cha, frei (Kreis rechts daneben, nicht auf frei)

Tap: erste Zeile `Salsa Beginner Stufe 2`.
Schritt: Detail «Dein Kurs». Ort, Staffel 10.08.–02.10.2026, Vor Ort Twint/Bar, Maps.
Knopf «Platz reservieren» links unten. Kreis x=314 y=768. Knopf x=41 y=796 w=140. Kein X-Overlap.
Rolle + Name/Mail/Phone sitzen im Dialog nach diesem Knopf. Kein Mail gesendet.

## `/kursplan` 390

H1 «Finde deinen Kurs.» Foto `community-diversitaet-01.webp` (echte Körper, Gesichter ganz).
Staffel August läuft. Staffel Oktober startet bald.
Woche ab 17. August 2026. Pfeile unter der Wochenzeile (R122).
Mo/Di/Mi-Chips im Fold. Kreis rechts, nicht auf Pfeilen (Verify PASS).

## Shots

[S7-ux127](/root/clients/salsaflow-w1/worklog/shots/S7-ux127/)
- [buchung-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux127/buchung-mobil-390.png)
- [buchung-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux127/buchung-desktop-1440.png)
- [kursplan-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux127/kursplan-mobil-390.png)
- [kursplan-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux127/kursplan-desktop-1440.png)
- [buchung-kurs-gewaehlt-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux127/buchung-kurs-gewaehlt-390.png)

Sweep: `--routes /buchung,/kursplan --mobile --static --no-interact` plus Desktop-Interact.
Verify: VERDICT PASS. Locks: salsa14 events classfreude lift5 noleft. API 74 Kurse.

## SEO/AEO Schwesterseiten

Kein neuer Blog. Kein Jimdo-`DC.subject`.

| Route | Title | Index | Antwort-Zeile oben |
|---|---|---|---|
| `/kursplan` | Kursplan für Tanzkurse in Basel | ja | H1 + Lead: Tag, Stil, frei |
| `/tanzkurse` | Tanzkurse Basel: Salsa, Bachata & Heels | ja | Lead: Kurs, Level, Einstieg am SBB |
| `/schnupperstunde` | Gratis Schnupperstunde in Basel | ja | Title + Lead: echte Lektion, gratis |
| `/fotos` | Fotos aus Kursen & Events | ja | Lead: Kurse, Nights, Community Basel |
| `/buchung` | Platz reservieren | nein | Funnel, bewusst noindex |

JSON-LD: `SeoHead` + `buildSeoJsonLd`. Course-Seiten bekommen CourseInstance aus dem Seed. `/buchung` ohne Schema (noindex).

## Locks unberührt

R122 Pfeile. R123 Kreis rechts. R124 Schnupper classfreude-01. R125 Ghost mr-16. R126 Crop 26%. Salsa 14%. Events 55/42. Lift 5rem. Kein Push.

## Kritik

2-von-2 PASS. Kein Bau.

| Stimme | Urteil | Datei |
|---|---|---|
| Harness (PNG selbst) | Journey klar. Kreis nicht auf «Platz reservieren». | diese Datei |
| Sol-Lane (Codex gpt-5.6-sol) | PASS, 6/6 Claims true | [s7-sol-r127.md](/root/clients/salsaflow-w1/worklog/s7-sol-r127.md) |
| Luna PNG | pass=true | [s7-luna-r127.md](/root/clients/salsaflow-w1/worklog/s7-luna-r127.md) |
| Extra sol-critic-Agent | FAIL `kursplanLesbar` | Desktop-Wochenzeile y≈711, Pfeile am Rand 1440×730 |
| Kimi Look | FAIL Raster/Maps/Desktop-Leere | [s7-kimi-r127.md](/root/clients/salsaflow-w1/worklog/s7-kimi-r127.md) |

Hebel-Regel: nur wenn Journey Mobil in unter 30 s unklar. Mobil 390 ist klar. Desktop-Anschnitt ist Rest, kein Hebel.

Sol biggest_gap: Desktop-Wochenpfeile sitzen am unteren Shot-Rand. Mobil: Pfeile und Mo/Di/Mi sichtbar. Kreis rechts, nicht auf Pfeilen.
