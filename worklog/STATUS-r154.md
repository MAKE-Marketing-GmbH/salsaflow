# STATUS R154 – /preise

## Ist

Fold-Band `kurs-05` 14rem schnitt Koepfe. Scroll `party-36` war das zweite Klassenfoto.

## Soll

Video 05:08/05:12 uebersichtlicher. 05:19 keine doppelten Bilder auf /preise. Fold-Koepfe ganz. Ein Motiv pro Sektion. Keine neuen Preise.

## Bau

- [PreisePage.tsx](/root/clients/salsaflow-w1/src/public/PreisePage.tsx): `data-preise-page`. regular-img 1600x1066. Pass-img 1400x1000.
- [content.ts](/root/clients/salsaflow-w1/src/public/preise/content.ts): Fold `lg:h-[20rem]`, Position 38 %. `hero.image` raus. party-36 src raus.
- Runde 2: regular `gallery/kurse/01.jpg`. pass `offer-salsa-wide-1400.webp`. 02/05 raus.

oxlint 0. tsc 0. GATES 15/15. cmp Desktop Exit 1.

Nicht angefasst: CookieBanner, WhatsAppFloat, Home, Collabs, Partys, Tanzschuhe, kit.tsx.

Locks: Collabs 24 %, kein lazy, Partys `center_10%`, Tanzschuhe 84 %, Footer-Link, Cookie `pr-[5.5rem]`, kein `sm:pr-[10.5rem]`, `left: 1.25rem` = 0.

## Shots

- [preise-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux154/preise-desktop-1440.png)
- [preise-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux154/preise-mobil-390.png)
- [preise-y1400.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux154/preise-y1400.png)
- [preise-y2800.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux154/preise-y2800.png)

Vorher: [vorher/](/root/clients/salsaflow-w1/worklog/shots/S7-ux154/vorher/).

## Kritik

### Luna

uebersichtDa JA. bildEinmal JA. koepfeGanz JA. shotsDa NEIN. waRechts JA.

Parent: `shotsDa` ist falsch. Die vier Dateien zeigen /preise.

### Sol

BLOCKED. Codex-Lane tot. Kein Ersatzurteil.

### Opus Runde 1

pass false. Nachtbilder unter der Staffel. Site-Reuse ausser Scope.

### Look

BLOCKED. Kimi-Call kam als `grok-4.6-build`.

### Parent (PNGs nach Runde 2 gelesen)

- uebersichtDa: JA. Fold CHF 190 / 100 / Gratis.
- bildEinmal: JA. y1400 ist ein Kurs-Paar bei Tageslicht, kein Lineup, kein Nachtlicht.
- koepfeGanz: Desktop Mittelreihe JA. Vordere Reihe unten angeschnitten. Mobil nur Band-Start.
- shotsDa: JA.
- waRechts: JA.

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

$ rg -n "pr-\\[5.5rem\\]" src/public/site/CookieBanner.tsx
162:      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pr-[5.5rem] sm:px-5 sm:pb-5"

$ rg -n "sm:pr-\\[10.5rem\\]" src/public/site/CookieBanner.tsx || echo 0
0

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0

$ rg -n "gallery/kurse/0[25].jpg" src/public/preise/content.ts || echo 0
0
```

## Offene Punkte

- Sol/Look BLOCKED.
- Mobil-Fold bleibt schmal.
- Kein Production-Push.
