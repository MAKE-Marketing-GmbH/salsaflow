# STATUS R172 – Bachata-Hero hell

## Ist

offer-bachata-1200.webp. Dunkel, hart orange. Video 18.08.

Ultracode setzte danach hero-paar-dreh-01.webp. Dunkler (76.9 gegen 84.7). Home-Duplikat.

## Soll

Echtes helleres Paar-Foto. Crop 20 %. Keine Grade-Klasse. Kein KI-wide-v2.

## Bau

- [StylePage.tsx](/root/clients/salsaflow-w1/src/public/courses/styles/StylePage.tsx): src = `/photos/2026/hero-paar-studiowand-01.webp`.
- usesBandPosition true. Live objectPosition 50% 20%. Foto 561×421, y 137.
- Graustufen-Mittel: alt 84.7, dreh 76.9, jetzt 110.9.

oxlint Exit 0. Cookie und Home unangetastet. Kein Push.

## Shots

- [bachata-vorher.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux172/bachata-vorher.png)
- [bachata-nachher.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux172/bachata-nachher.png)

## Kritik

### Parent

- srcNeu: JA. hero-paar-studiowand-01.webp
- crop20: JA. 50% 20%
- kiWeg: JA. kein wide-v2 auf dieser Route
- dunkelWeg: JA. 84.7 auf 110.9
- homeDup: JA. dreh-01 ist raus

## Offene Punkte

- Studiowand hängt auch auf Privatstunden und Standort.
- Meta (Video 14) ist die nächste Fläche.
- Kein Production-Push.
