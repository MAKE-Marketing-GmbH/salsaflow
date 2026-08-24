# STATUS R148 – /faq vier Funde

## Ist

R147 liess vier KRITISCH-Funde: Mobil-Fold-Hash = Vorher, FAB auf Heels-Zeile, Chevron am `max-w-5xl`-Rand, «ab etwa 12 Jahren» und Aushilfe-Chats.

## Soll

Die vier Funde weg. Shots S7-ux148 mit neuem Hash. Kritik-Welle. Kein Push.

## Bau

- [FaqAccordion.tsx](/root/clients/salsaflow-w1/src/public/faq/FaqAccordion.tsx): `ml-auto` entfernt
- [FaqPage.tsx](/root/clients/salsaflow-w1/src/public/FaqPage.tsx): Accordion `max-w-3xl`, Hero `dense` + `tightBottom`
- [index.css](/root/clients/salsaflow-w1/src/index.css): Mobil-pr 6.5rem unter sm
- [content.ts](/root/clients/salsaflow-w1/src/public/faq/content.ts): Alter 12 und Aushilfe-Chats raus, DE und EN

oxlint 0. forbidden-check 0 harte Verstösse. GATES 13/13.

Locks: party-47, Team 39 %, Crop 12, `left: 1.25rem` = 0, gallery ohne fabio.

## Shots

- [faq-mobil-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux148/faq-mobil-390.png) MD5 `e890c00d`, cmp Vorher Exit 1, cmp R147 Exit 1
- [faq-desktop-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux148/faq-desktop-1440.png) MD5 `8fd789bc`
- [faq-accordion-scroll-1440.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux148/faq-accordion-scroll-1440.png) Panel offen
- [faq-accordion-scroll-390.png](/root/clients/salsaflow-w1/worklog/shots/S7-ux148/faq-accordion-scroll-390.png) Heels-Zeile, FAB in der Lücke

Messung Parent: Heels chevRight 266, FAB left 314. Desktop summaryW 768, chevRight 820, summaryX 52.

## Kritik

Welle [r148-kritik](/root/clients/salsaflow-w1/worklog/r148-kritik-workflow.js) `wf_5d15f4d5-e2d`.

### Parent (PNGs gelesen)

- chevronAnText: JA. Desktop-Chevron sitzt am Spaltenrand, nicht am Viewport.
- fabFrei: JA. Heels-Text und Chevron links, Kreis in der Lücke.
- shotsNeu: JA. Hash `e890c00d` ≠ Vorher und ≠ R147. Luna hatte kein Vorher-PNG.
- wenigerDicht: JA. Eine Lesespalte, mehr py, Chips im 390-Fold.
- echteFragen: JA. Kein «12 Jahren», keine Aushilfe-Chats.

### Luna Ja/Nein

- chevronAnText: JA
- fabFrei: JA
- shotsNeu: NEIN (kein Vorher im Auftrag; Parent-cmp widerlegt)
- wenigerDicht: NEIN (kein Vorher; Parent-Shot widerlegt)
- echteFragen: JA

### Sol

pass=false. Ein Fund KRITISCH `BLOCKED`. Lane-Verbot, kein Ersatz-Urteil.

### Opus

pass=true. Vier R147-Funde weg. Drei NICE: Shot-Fallback `nth(4)` statt `nth(5)`, FAB-pr nur bis 639px, Look-Set unvollständig weil Sol und Kimi tot.

### Look (kimi)

status=BLOCKED. Erster Call 400. Zweiter Call HTTP 200, Modell `grok-4.6-build`. Kein Kimi-Urteil. Kein dritter Versuch.

Look-Freigabe: nicht erteilt. Die vier Sachfunde sind trotzdem raus.

## rg-Belege

```text
$ rg -n "ml-auto" src/public/faq/FaqAccordion.tsx || echo 0
0

$ rg -n "ab etwa 12 Jahren|Aushilfe-Chats" src/public/faq/content.ts || echo 0
0

$ rg -n "founders/fabio.webp" src/public/gallery/content.ts || echo 0
0

$ rg -n "party-47" src/public/EventsPage.tsx
161:        src: '/photos/party/party-47.webp',

$ rg -n "center 39%" src/public/TeamPage.tsx
247:        position: 'center 39%',

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0
```

## Offene Punkte

- Sol-Lane bleibt tot unter dem Lane-Verbot.
- Kimi-Look BLOCKED durch Gateway-Failover.
- NICE: Shot-Fallback `nth(5)`, Shot bei 640/768.
