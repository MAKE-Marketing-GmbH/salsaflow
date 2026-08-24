# Gates R183: Video 19 Soll-Punkte + Raphael 20.08.

Scope: Video-Soll 1–19 aus VIDEO-2026-08-18-supercut.md PLUS Raphael 20.08.
Beleg live gegen Vite 5175. Kein Production-Push.

Quellen:
- `/root/clients/salsaflow/worklog/watchdog/VIDEO-2026-08-18-supercut.md`
- `/root/clients/salsaflow/wiki/absprachen.md` Zeile 7

**Diese Datei gehört dem Parent. Worker schreiben ihren Item-Ledger nach
`gates/<item>.md`.** Die Item-Ledger der R183-Läufe liegen dort gesichert.

Stand 20.08.:
- `node worklog/.r183-check.mjs all` → **12/12 PASS, Exit 0**
- `node worklog/.r183-klicktest.mjs` → **15/15 PASS, Exit 0**

## Teil A — Video 1–19 (Stand R176–R180, Beleg gehalten)

- [x] G1: Home erreichbar, kein 1:1-Coaching, Hero rund
  CHECK: node worklog/.video-evidence.mjs
  EVIDENCE: fail=0 total=34. PASS v1-home-200, v6-coaching-weg, v4-hero-rund r=24px

Der Sammel-Lauf `.video-evidence.mjs` deckt G1–G19 ab. Jedes Gate nennt darum
denselben CHECK und prueft per EXPECT seine eigene Zeile aus der Ausgabe.

- [x] G2: Nav Tanzkurse sichtbar
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v2-nav-kurse
  EVIDENCE: pending

- [x] G3: Bilder nicht unter 2x
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: /PASS v3-reso .*"unread":0,"small":0/
  EVIDENCE: pending

- [x] G4: Hero nicht eckig
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v4-hero-rund
  EVIDENCE: pending

- [x] G5: Home-Lead konkret
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v5-text
  EVIDENCE: pending

- [x] G6: 1:1-Coaching-Block weg
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v6-coaching-weg
  EVIDENCE: pending

- [x] G7: Bachata-Hero hell, Crop 20% (Lock party-33)
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v7-bachata-src src=/photos/party/party-33.webp
  EVIDENCE: pending

- [x] G8: FAQ Chevron/open
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v8-faq-open
  EVIDENCE: pending

- [x] G9: Cookie-Gutter 88px + WhatsApp-Motion
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v9-cookie visible=true pr=88px
  EVIDENCE: pending

- [x] G10: Heels-Seite + Slots
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v10-heels-slots
  EVIDENCE: pending

- [x] G11: Privatstunden weniger Text
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: /PASS v11-privat .*party-31-v3.webp/
  EVIDENCE: pending

- [x] G12: Preise Fold, keine Doubletten
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v12-preise-imgs n=6 unique=6
  EVIDENCE: pending

- [x] G13: Events Reveal 0→1, keine Mini-Bloecke
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v13-events-mini mini-grids=0
  EVIDENCE: pending

- [x] G14: Events-Meta konkret
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v14-meta
  EVIDENCE: pending

- [x] G15: Team H1
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v15-team
  EVIDENCE: pending

- [x] G16: Fotos ohne Team-Filter und ohne Bildtext
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: /PASS v16-fotos-ohne-bildtext Bildtexte=0 Kacheln=\d+/
  EVIDENCE: pending
  NOTE: Video-Punkt 16 wollte Kontext-Bildtexte. Raphael hat das am 20.08.
  widerrufen ("Fotos ohne Bildtext, mehr Fotos"). Der Test folgt der juengeren
  Ansage und prueft jetzt das Gegenteil. Gegenstueck ist G32.

- [x] G17: Collabs-Scroll
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v17-collabs-scroll
  EVIDENCE: pending

- [x] G18: Tanzschuhe sichtbar
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: PASS v18-schuhe-img
  EVIDENCE: pending

- [x] G19: Partys WhatsApp-Kreis, Blob rund
  CHECK: node worklog/.video-evidence.mjs
  EXPECT: /PASS v19-wa-kreis .*"w":56,"h":56/
  EVIDENCE: pending

- [x] G20: Cookie-Lock unangetastet
  CHECK: rg -c "pr-\[5.5rem\]" src/public/site/CookieBanner.tsx
  EXPECT: 1
  EVIDENCE: pending

- [x] G21: kein Production-Push auf diesem Branch
  CHECK: git log --oneline origin/main..HEAD | wc -l && git branch --show-current
  EXPECT: geil-welle
  EVIDENCE: pending

## Teil B — Raphael 20.08. (R183)

Messung: `node worklog/.r183-check.mjs <gate>` — live gegen 5175, Exit 0 = PASS.

- [x] G22: Header DE/EN Kreis, nicht Oval
  CHECK: node worklog/.r183-check.mjs g22
  EVIDENCE: de 44x44, en 44x44. Pillen-Kapsel entfernt: DE und EN sind zwei
  eigene Kreise. Beleg `shots/S7-ux183-final/home-desktop-00-fold.png` gelesen.

- [x] G23: Mobil-Header simpel, Schliessen im Header
  CHECK: node worklog/.r183-check.mjs g23
  EVIDENCE: ein Menue-Schalter, Schliessen top 12px im Header.
  Klicktest: Panel 0px → 548px → 0px, aria-expanded true.

- [x] G24: Dropdown Tanzkurse/Events/Mehr öffnet nach rechts
  CHECK: node worklog/.r183-check.mjs g24
  EVIDENCE: alle drei linksbuendig am Trigger — Tanzkurse 373=373,
  Events 574=574, Mehr 735=735. `rg "top-full" SiteHeader.tsx` findet nichts.

- [x] G25: Tanzkurse-Hero-Band rund
  CHECK: node worklog/.r183-check.mjs g25
  EVIDENCE: radius 24px, src kurse-classfreude-hero-2100.webp, Koepfe ganz.
  kit.tsx unangetastet.

- [x] G26: Tanzkurse mehr verschiedene Fotos, keine Doublette
  CHECK: node worklog/.r183-check.mjs g26
  EVIDENCE: unique 11, Doubletten 0 (vorher `offer-bachata.webp` ×2)

- [x] G27: Tanzkurse Level/Aufbau weniger Text
  CHECK: node worklog/.r183-check.mjs g27
  EVIDENCE: 119 Woerter, Schwelle 120 (vorher 125)

- [x] G28: Kursplan-Hero nicht gestreckt, Köpfe ganz, rund wie der Rest
  CHECK: node worklog/.r183-check.mjs g28
  EVIDENCE: band 3.21:1, quelle 2.33:1, faktor 1.38, radius desktop 24px /
  mobil 24px (vorher 0/0), Motiv hero-paar-studiowand ≠ Tanzkurse.
  Vorher `shots/S7-ux183-mobil/kursplan-mobile-00-fold.png`, nachher
  `shots/S7-ux183-final/kursplan-desktop-00-fold.png`. Beide gelesen.

- [x] G29: Danceflow Sektion 2 Frau mit ganzem Kopf
  CHECK: rg -n "aspect-\[4/5\] w-full object-cover object-\[center_20%\]" src/public/DanceflowNightPage.tsx
  EXPECT: 1 Treffer in WhySection (Sektion 2). Zeile 119 ist der Hero, bleibt 4/3.
  EVIDENCE: 4/3+center_42% → 4/5+center_20%. Quelle 05-v3.webp 1360x2048,
  sichtbar y 3.4%..86.4%, Scheitel 9.5% und Kinn 30% im Bild.

- [x] G30: Home Teamfoto hp-29 nicht rund-am-Rand
  CHECK: node worklog/.r183-check.mjs g30
  EVIDENCE: inset 52px + radius 24px = echte Karte.

- [x] G31: Unter dem Home-Hero Luft
  CHECK: node worklog/.r183-check.mjs g31
  EVIDENCE: 134px bis `<h2>`, Schwelle 48. Der schwebende WhatsApp-Blob
  faellt aus der Messung (position fixed ist kein Seiteninhalt).

- [x] G32: Fotos-Raster ohne Bildtext, mehr Fotos
  CHECK: node worklog/.r183-check.mjs g32
  EVIDENCE: Kacheln 128 (vorher 82), sichtbare Bildtexte 0, Team-Portraets 0,
  ohne zugaenglichen Namen 0.

- [x] G33: Kontakt-Formular Mobil besser, Buchung klarer
  CHECK: node worklog/.r183-check.mjs g33
  EVIDENCE: 0 Ueberlaeufe, 0 Touch-Ziele < 40px, scrollWidth 390/390.
  Buchung Mobil: 22 Felder, 0 zu klein. Klicktest laeuft den Weg durch.

- [x] G34: Motion sitewide, reduced-motion bleibt
  CHECK: node worklog/.r183-check.mjs g34
  EVIDENCE: --dur-fast=160ms --dur-base=240ms
  --ease-sf=cubic-bezier(0.22,1,0.36,1). Unter reduced-motion 0 animiert.

- [ ] G35: Backend/CMS nutzbar, npm run verify Exit 0
  CHECK: npm run verify
  EXPECT: Exit 0
  EVIDENCE: **BLOCKIERT, vorbestehend.** `[verify] FEHLER: RuntimeError: unreachable`
  in `@electric-sql/pglite` 0.2.17 (Postgres-WASM) unter Node v22.23.1.
  Gegenprobe: `git stash push -u -- src/` (alle R183-Aenderungen weg) → derselbe
  Fehler, danach `git stash pop`. R183 hat keine Backend-Datei angefasst.
  Umgebungsdefekt, nicht von dieser Runde verursacht und ausserhalb der
  Frontend-`paths` dieses Laufs.
  Naechster Schritt: pglite auf 0.3.x heben oder Node auf 20 pinnen.

- [x] G36: Sweep 1440 + 390 Exit 0, jedes Fold-PNG gelesen
  CHECK: node /root/raphael-skills/skills/eigene/web/scripts/shot-sweep.mjs --base http://127.0.0.1:5175 --out worklog/shots/S7-ux183-final --static
  EVIDENCE: Desktop 110 Shots (S7-ux183), Mobil 212 Shots (S7-ux183-mobil),
  final 109 Shots (S7-ux183-final). Alle Exit 0. Gelesen: home desktop+mobil,
  tanzkurse desktop+mobil, kursplan desktop+mobil, danceflow y750, buchung mobil.

- [x] G37: Klicktest Header, Dropdown, Buchung, Formular
  CHECK: node worklog/.r183-klicktest.mjs
  EXPECT: Exit 0
  EVIDENCE: 15/15 PASS. Kursplan → Kurskarte → /buchung?kurs=… → Rolle waehlen →
  Kontaktdaten tippen. Mobil-Menue auf und zu. Kontakt-Assistent bis zum Textfeld.

## Locks (nicht drehen)

- Salsa `center 14%`, Bachata `center 20%` + party-33, Heels `center 12%`
- Events Hero party-47 + `object-[center_20%]` + `lg:h-[28rem]`
- WhatsApp rechts unten, weiss auf gruen. `index.css` `left: 1.25rem` tot.
- CookieBanner `pr-[5.5rem]`. Nicht nachbauen. Collabs nicht nachbauen.
- Fotos ohne Team-Portraets. Kein Pastellrot.
- kit.tsx nur mit Prop, Default fuer andere Routen unveraendert.
- Danceflow Zeile 119 (Hero) bleibt `aspect-[4/3]` + `center_42%`.
  Nur Sektion 2 wurde gedreht.
