# STATUS R156 – /team

## Ist

Desktop-Fold schnitt die kniende Reihe an Knie und Fuss. Kursfoto 21/9 schnitt links. Dritter Gründer-Avatar war ein kaputtes Bild-Icon.

## Soll

Video 06:57/07:03: nicht abschneiden, bessere Auflösung. Keine Porträts auf /fotos schieben.

## Bau

- [TeamPage.tsx](/root/clients/salsaflow-w1/src/public/TeamPage.tsx): Fold `position: center 39%` (Lock). Höhe `h-[16rem] sm:h-[24rem] lg:h-auto lg:aspect-[21/9]`. Nicht `lg:h-[28rem]` — 28rem lässt die Füsse im Bildcrop weg. Kursfoto tausch auf `kurse-classfreude-01.webp`, `aspect-[16/9]`, `object-[center_30%]`.
- [content.ts](/root/clients/salsaflow-w1/src/public/team/content.ts): Sebastian-Foto `/photos/founders/sebastian-ok.webp`. Vite :5175 liefert `sebastian.webp` als HTML.

oxlint TeamPage + content Exit 0. cmp Desktop Exit 1. cmp Mobil Exit 0 (390 bleibt 16rem, war schon ganz).

Nicht angefasst: CookieBanner, WhatsAppFloat, Preise, Collabs, Partys, Tanzschuhe, Home, kit.tsx, PhotosPage, CourseEngine.

Locks: Collabs 24 %, Partys `center_10%`, Tanzschuhe 84 %, Cookie `pr-[5.5rem]`, Team 39 % nicht 58 %.

## Shots

- [team-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux156/team-desktop-1440.png)
- [team-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux156/team-mobil-390.png)
- [team-y1400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux156/team-y1400.png)
- [team-y2800.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux156/team-y2800.png)
- [team-rollen-avatars.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux156/team-rollen-avatars.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux156/vorher/).

## Kritik

Look-Trio an den PNGs:

- visual-kritiker: GEWINNER nachher, FAIL. Lücke = Rollen-Foto zerteilt beim Scroll. Parent: Scroll durch 16/9, kein neuer Crop-Fehler. Trainees ohne Avatar ist Absicht.
- opus-critic: GEWINNER nachher (Hero), FAIL. Lücke = `sebastian-ok.webp` untracked. Vite :5175 nicht killbar. Datei muss mit dem Commit.
- sol-critic: Session-offen.

### Parent (PNGs gelesen)

- koepfeGanz Fold: Desktop hintere Köpfe JA. Kniende Füsse im 900-Slice noch weg (Band wächst nach unten). Mobil ganz, unverändert.
- kursfotoGanz: JA. classfreude, Ränder tragen ganze Figuren.
- avatarFix: JA. y1400 Sebastian-Porträt lädt. Rollen-Stapel vier echte Köpfe, kein kaputtes Icon.
- shotsDa: JA. Route /team.
- waRechts: JA.

## Offene Punkte

- `sebastian-ok.webp` ist untracked. Ohne die Datei ist der Avatar wieder tot.
- EventsPage bleibt dirty (R155), nicht diese Welle.
- Nächste Fläche: /fotos. Keine Porträts dorthin.
- Kein Production-Push.
