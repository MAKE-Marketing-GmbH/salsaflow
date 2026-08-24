# STATUS R180 – Team Hero (Parent nach BLOCKED)

Ultracode 3 Runden BLOCKED: Breitenkappe machte Cream-Postkarte. Parent: Kappe raus, vh-Hoehe bleibt, Quelle 2880.

## Live 2026-08-20, Vite 5175/team

localStorage `salsaflow-cookie-ok=1`. CookieBanner unangetastet.

| Messwert | 1440×900 dpr=2 | 390×844 dpr=3 |
| --- | --- | --- |
| h1 y | 76 | 66 |
| src | `/photos/showcase/hp-03-2880.webp` | gleich |
| y / h / bot | 385.3 / 514.7 / 900 | 433.3 / 256 / 689.3 |
| width | 1440 (full-bleed) | 390 |
| naturalWidth | 2880 | 2880 |
| position | 50% 56% | 50% 56% |
| FOLD src | 23.7%..81.4% | −3.3%..102.6% |
| headsWhole | PASS 23.7 ≤ 25.1 | PASS |
| shoesInFold | PASS 81.4 ≥ 80.0 | PASS |

oxlint TeamPage.tsx Exit 0.

## Bau

[TeamPage.tsx](/root/clients/salsaflow-w1/src/public/TeamPage.tsx): `lg:h-[calc(100vh-24.08rem)]`, kein max-w, src 2880, pos 56%.

kit.tsx, CookieBanner, WhatsApp unangetastet.

## Shots

- [team-1440-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux180/team-1440-fold.png)
- [team-390-fold.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux180/team-390-fold.png)
