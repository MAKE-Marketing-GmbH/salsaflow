# STATUS R177 – Privatstunden Hero

## Ist

Hero war `hero-paar-studiowand-01.webp`. Logo und Rücken.

## Soll

Video 04:21: weniger Text, mehr Luft, Bild nicht dunkel, nicht falsch eingefärbt.

## Bau

- [content.ts](/root/clients/salsaflow-w1/src/public/privat/content.ts) DE+EN src = `/photos/party/party-31-v3.webp`
- [PrivatstundenPage.tsx](/root/clients/salsaflow-w1/src/public/PrivatstundenPage.tsx): Chips nur ab lg, Crop `center 42%`, Mobil 5/4
- Evidence: `v11-privat` fällt bei `studiowand` durch

Live: src party-31-v3, 1440 CTA bottom 553, 390 CTA bottom 815 im Fold.

## Kritik

- Opus: FAIL. Motiv ist Party, nicht Privatstunde.
- Grok: PASS. Hell, Hautton normal, keine Logo-Wand.
- Sol: hängt. Stoppt nicht.

Kein 1:1-Foto ohne Logo. G11-look-1:1 ABANDON. Video-Farbe/Helligkeit erfüllt.

## Shots

- [privat-1440-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux177/privat-1440-fold.png)
- [privat-390-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux177/privat-390-fold.png)

## Offene Punkte

- Kein Production-Push.
- Cookie unangetastet.
- Nächste Fläche: /kontakt
