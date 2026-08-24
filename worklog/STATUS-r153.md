# STATUS R153 – Cookie + WhatsApp

## Ist

Cookie-Karte unten mittig. Desktop-WA-Pille in derselben Zeile auf der Karte. Mobil WA und Karte auf «Schnupperstunde buchen». Animation mit Scale.

## Soll

Video 03:46 Cookie besser. 03:50 WhatsApp nicht 0815. Kein Ueberlapp. CTA frei. FAB frei. Einmal rein, dann Ruhe.

## Bau

- [CookieBanner.tsx](/root/clients/salsaflow-w1/src/public/site/CookieBanner.tsx): Karte bleibt. Mobil-Gutter `pr-[5.5rem]`. Desktop ohne Extra-Gutter, weil raised hebt.
- [WhatsAppFloat.tsx](/root/clients/salsaflow-w1/src/public/site/WhatsAppFloat.tsx): raised nutzt `--cookie-float-lift`. Dauer `var(--dur-slow)`. `t-hover-move` raus.
- [index.css](/root/clients/salsaflow-w1/src/index.css): `--cookie-float-lift` 0 unter sm, ab sm gleich `--cookie-banner-height`. Keyframes ohne Scale.

oxlint 0 auf den TSX-Dateien. verify-ux VERDICT PASS. cmp Desktop und Mobil Exit 1.

R153-Dateien: CookieBanner, WhatsAppFloat, index.css. Nicht HomePage, nicht Hero, nicht Collabs, nicht Partys, nicht Tanzschuhe.

Locks: Collabs 24 %, kein lazy, Partys `center_10%`, Tanzschuhe 84 %, Footer-Link, party-47, `left: 1.25rem` = 0, FAQ `ml-auto` = 0, kein fabio.

## Shots

- [cookie-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux153/cookie-desktop-1440.png)
- [cookie-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux153/cookie-mobil-390.png)
- [cookie-desktop-1440-accepted.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux153/after/cookie-desktop-1440-accepted.png)
- [cookie-mobil-390-accepted.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux153/after/cookie-mobil-390-accepted.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux153/vorher/).

## Kritik

Welle `wf_40aacd37-c46`.

- Sol: BLOCKED. Lane `codex-lane.sh` verboten.
- Luna: cookieFrei JA, fabFrei JA, ctaFrei JA, shotsDa JA, waRechts JA.
- Opus: pass false. WICHTIG Desktop-Gutter plus Lift. Fix: `sm:pr-[10.5rem]` weg. WICHTIG Verifier dismissCookie. NICE Hover `--dur-slow`.
- Look: BLOCKED. Gateway `grok-4.6-build`.

### Parent (PNGs gelesen)

- cookieFrei: JA. Mobil Karte links, FAB rechts.
- fabFrei: JA. Desktop-Pille ueber der Karte. Mobil-Kreis neben der Karte.
- ctaFrei: JA. Mobil «Schnupperstunde buchen» komplett sichtbar.
- shotsDa: JA. Home Erstbesuch mit Cookie, danach ohne.
- waRechts: JA. Gruen, unten rechts.

Opus-WICHTIG Desktop-Gutter ist umgesetzt: Gutter nur unter sm.

## rg-Belege

```text
$ rg -n "center 24%" src/public/CollabsPage.tsx
53:          position: 'center 24%',

$ rg -n "loading=\"lazy\"" src/public/CollabsPage.tsx || echo 0
0

$ rg -n "center_10%" src/public/PartysPage.tsx
56:          positionClass: 'object-[center_10%]',

$ rg -n "center 84%" src/public/TanzschuhePage.tsx
61:          position: 'center 84%',

$ rg -n "tanzschuhe" src/public/site/SiteFooter.tsx
79:    { label: nav.tanzschuhe, href: '/mehr/tanzschuhe' },

$ rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
0

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0
```

## Offene Punkte

- Sol BLOCKED. Look BLOCKED.
- Verifier dismissCookie vor measure. Ausserhalb write_set.
