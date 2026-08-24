# STATUS R138

## Ergebnis

**R138 `/tanzkurse/bachata`: PASS.**

## Vorher und Soll

Vorher: Der Text stand ueber einem dunklen Full-Bleed-Band, Koepfe waren angeschnitten, und das Why-Bild war falsch eingefaerbt. Beleg: `/root/clients/salsaflow-w1/worklog/shots/S7-ux138/vorher/`.

Soll: Der Aufbau steht links/rechts, die Flaeche ist hell, und die Bilder wirken natuerlich. Beleg: `/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-mobil-390.png` und `/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-desktop-1440.png`.

## Kritik-Funde

```json
[
  {"wo":"src/public/courses/styles/StylePage.tsx:234","problem":"Salsa ist visuell offenbar identisch, aber nicht byte-for-byte: R137 dokumentiert `aspect-[3/2] w-full object-cover object-center lg:aspect-[5/4]`, `SplitHero` erzeugt eine andere Klassenreihenfolge; Alt-Sprachwechsel, 1600x1066, `eager` und `high` blieben dagegen erhalten","beleg":"src/public/courses/styles/StylePage.tsx:236-241 baut den Klassenstring per cn('w-full object-cover', photo.ratio, photo.objectPosition ? undefined : 'object-center', photo.grade) — Reihenfolge weicht vom R137-Original ab. Salsa-Fold-Screenshot ist laut Sol hash-identisch.","fix":"Salsa-Klassenstring vollstaendig und unveraendert als Variante uebernehmen","schwere":"WICHTIG"},
  {"wo":"src/public/courses/styles/content.ts:419","problem":"`center 20%` existiert nur noch in toter `hero.band`-Konfiguration; der Bachata-Pfad steigt in `SplitHero` aus und verwendet stattdessen hart `center 30%`, womit der Gate-Buchstabe erfuellt, der Crop-Lock aber wirkungslos ist","beleg":"content.ts:428 `position: 'center 20%'` im band-Objekt; StylePage.tsx:272 `if (c.seo === 'bachata') return <SplitHero c={c} photo={BACHATA_HERO_PHOTO} />` rendert h.band nie, StylePage.tsx:154 setzt `objectPosition: 'center 30%'`.","fix":"Den Split-Hero aus Live-Content konfigurieren oder den obsoleten Lock ausdruecklich ersetzen","schwere":"WICHTIG"},
  {"wo":"src/public/subpage/kit.tsx:289","problem":"`liftMedia` ist nach Entfernung des letzten Callers repo-weit tot; Default, Prop-Typ, Kommentar und `lift`-Berechnung bleiben als verwaiste API zurueck","beleg":"kit.tsx:289 `liftMedia = false`, :309 `liftMedia?: boolean;`, :332 `const lift = Boolean(liftMedia && dense && media)`. Der letzte Caller `liftMedia={isSalsa}` wurde in StylePage.tsx (Diff-Hunk um Zeile 281) entfernt.","fix":"Prop und zugehoerige Logik vollstaendig entfernen","schwere":"WICHTIG"},
  {"wo":"src/public/courses/styles/content.ts:107","problem":"Oxlint Exit 0 ist kein gruenes Gate, solange gleichzeitig drei `anti-slop(no-known-value-widening)`-Fehler an :107, :399 und :672 ausgegeben werden; vorbestehend heisst nicht bestanden","beleg":"npx oxlint src/public/courses/styles/StylePage.tsx src/public/courses/styles/content.ts meldet 3 errors (content.ts:107:43, :399:45, :672:76) und liefert trotzdem Exit 0.","fix":"Gate so konfigurieren, dass diese Diagnosen non-zero liefern, und Altfehler separat baselinen oder beheben","schwere":"WICHTIG"},
  {"beleg":"Desktop-PNG /root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-desktop-1440.png, unten rechts: WhatsApp steht weiss auf gruen, aber die Flaeche ist eine laengliche Schaltflaeche und kein Kreis.","fix":"WhatsApp unten rechts als gruener Kreis ohne Text darstellen.","problem":"waRechts: NEIN. Das WhatsApp-Element ist auf dem Desktop kein Kreis.","schwere":"KRITISCH","wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-desktop-1440.png, unten rechts"},
  {"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-desktop-1440.png (Hero-Foto rechts, ca. x1140-1330 / y180-330) · Quelle: /root/clients/salsaflow-w1/public/photos/premium/offer-bachata-wide-v2.webp · Einbau: src/public/courses/styles/StylePage.tsx BACHATA_HERO_PHOTO","problem":"Das neue Hero-Motiv ist ein KI-/Freisteller-Bild, kein sauberes Foto. Um den Kopf des Mannes laeuft eine haarduenne, gleichmaessig weisse Umriss-Linie (Matte-Kante). Hinter seiner Schulter steht zusaetzlich ein kopfloser, verwaschener Koerper-Rest. Brief Punkt 2 verlangt ausdruecklich: «Kein KI-Bild.» R138 hat das Motiv vom 10rem-Streifen auf ein grosses Hero hochgezogen — der Fehler war vorher unsichtbar und ist jetzt der Blickfang der Seite.","beleg":"Zoom auf das Quellbild (Crop 1620,230-1980,560, NEAREST x3): die weisse Linie folgt exakt Haaransatz, Ohr und Wange, konstante Breite, kein Lichtabfall — das ist eine Matte-Kante, kein Rim-Light. Im gerenderten PNG bachata-desktop-1440.png bei ca. x1230-1300 dieselbe Linie klar sichtbar, dazu der Torso-Rest rechts daneben. Gegenprobe: Salsa-Hero /photos/kurse/kurs-03.jpg hat keine solche Kante.","fix":"Anderes Bachata-Motiv aus public/photos/ waehlen, das nachweislich unretuschiert ist, und es VOR dem Einbau per Read auf Freisteller-Kanten und Geister-Koerper pruefen (design-SKILL.md Screenshot-Pflicht Punkt 2). Falls kein passendes Paar-Motiv existiert, das alte Band-Motiv nicht als Hero verwenden, sondern ein echtes Foto nachliefern. offer-bachata-wide-v2.webp taugt nur als kleiner Streifen, nicht als Hero.","schwere":"KRITISCH"},
  {"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-mobil-390.png, unterer Fold-Rand (y 828-844)","problem":"Im 390x844-Fold ist der zweite Bullet-Chip «Technik, Musikalitaet und Connection» mitten durch die Form abgeschnitten. Die Chip-Oberkante liegt bei y=828, der Fold endet bei y=844 — es bleibt ein 16px hoher Reststreifen mit halber Rundung. Genau das Muster «angeschnittener Chip», das in frueheren Runden schon einmal als Fehler protokolliert wurde.","beleg":"Zeilen-Helligkeitsscan von bachata-mobil-390.png: Foto endet y≈740, Chip 1 laeuft y≈766-806, Chip 2 beginnt y≈828 und wird vom Bildrand bei 844 gekappt. Crop (0,750,390,844) zeigt die abgeschnittene zweite Pille deutlich.","fix":"Auf Mobil entweder das Hero-Bildverhaeltnis leicht kuerzen oder die Chip-Liste im Fold auf die Chips begrenzen, die ganz passen (Rest erst nach dem Fold). Danach 390x844 neu shooten und per Read pruefen, dass keine Chip-Form die untere Kante kreuzt.","schwere":"WICHTIG"},
  {"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-mobil-390.png, rechte Seite bei y 766-821","problem":"Der gruene WhatsApp-Knopf liegt auf dem ersten Bullet-Chip. Der Chip reicht bis x≈355, der Knopf belegt x314-369 — die rechte Chip-Rundung verschwindet unter dem Knopf. Auf der Salsa-Route passiert das nicht, weil dort im Fold keine Chips neben dem Knopf stehen.","beleg":"Pixel-Messung in bachata-mobil-390.png: FAB-Bounding-Box x314-369 / y766-821. Auf der Chip-Mittelzeile y=786 endet das Chip-Weiss bei x=314, also exakt an der Knopfkante; die graue Chip-Umrandung laesst sich noch bis x≈355 nachweisen (Zeile y=768/770). Der Crop (0,750,390,844) zeigt die Ueberdeckung.","fix":"Auf dieser Route im Fold rechts Platz fuer den Knopf freihalten (Muster ScheduleTeaser / lg:pr-36, hier als mobiler rechter Innenabstand) oder die Chips so umbrechen, dass keine Pille in die Knopfzone laeuft. Danach 390x844 neu shooten und per Read gegenpruefen.","schwere":"WICHTIG"},
  {"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux138/vorher/ (26 Dateien, alle Desktop)","problem":"Der Brief verlangt unter «Ablauf und Beweise» Punkt 1 Ist-Shots in 390x844 UND 1440x730 vor dem Bau. Im Ordner vorher/ liegen ausschliesslich Desktop-Aufnahmen, kein einziger Mobil-Shot. Damit fehlt der Vorher-Nachher-Vergleich genau fuer die Ansicht, in der jetzt zwei Fehler stecken (abgeschnittener Chip, Knopf-Ueberdeckung) — es laesst sich nicht belegen, ob R138 sie verursacht oder geerbt hat.","beleg":"ls /root/clients/salsaflow-w1/worklog/shots/S7-ux138/vorher/ liefert 26 Eintraege, davon 0 mit «mobile» im Namen; alle heissen tanzkurse__bachata-desktop-*.","fix":"Mobil-Ist-Shot nachziehen (git stash auf den Vorzustand oder aus einer frueheren Runde belegen) und die beiden Mobil-Funde dagegen einordnen. Solange das fehlt, gilt der Mobil-Fold als unbelegt.","schwere":"WICHTIG"}
]
```

## Fix-Ergebnis (Nachtrag Parent, 18./19.08.)

Die 9 Funde oben sind abgearbeitet: 7 GEFIXT, 1 WIDERLEGT (liftMedia — CoursesPage.tsx:249
nutzt die Prop, TS-Fehler beim Entfernen), 1 NACHGEZOGEN (Mobil-Vorher-Shots per git stash).
Details mit Messbelegen: Fixer-Notizen im Workflow-Journal `wf_9db8d2a0-fad`.
Kernpunkte: KI-Bild ersetzt durch `/photos/premium/offer-bachata-1200.webp` (unretuschierte
Quelle desselben Paares); Crop-Lock jetzt WIRKSAM (`usesBandPosition` liest `center 20%`
aus content.ts:428, gerendert `50% 20%`); WA-Desktop wieder Kreis (56x56, Marker
`data-split-hero-page`); Chips im 390x844-Fold ganz; FAB-Überlappung über `--whatsapp-lift`
1.5rem nur auf Bachata; Salsa-Regression pixelgleich (maxdiff 0).
Parent hat beide Pflicht-PNGs (Stand nach Fix) selbst gelesen und die Ja/Nein-Liste
bestätigt. Offen bleibt: Fix-Runde ohne zweite Fremd-Kritik-Welle; Leerfläche im
Why-Block rechts (Kandidat nächste Runde); 123 oxlint-Altfehler repo-weit (baselined).

## Look

**BLOCKED.** Kimi/K3 ist im Cooldown. Zwei Einzel-Proben nach Abschluss der Route
(19.08. ~00:05 und ~00:15 UTC, jeweils nach Ablauf des gemeldeten Resets) trafen
erneut `model_cooldown` mit sofort verlängertem Fenster. Moonshot-PAYG ist seit
18.08. 17:10 UTC durchgehend zu — das ist ein Konto-/Guthaben-Thema beim Provider,
kein Transportfehler. Keine weiteren Retries; G11-Kimi bleibt offen (ABANDON in
GATES.md), nachziehbar über `/tmp/kimi-look-r138.sh`, sobald der Provider antwortet. Gateway 8318 meldete `model_cooldown` bei `openai-compatible-moonshot-payg`, Reset in 15m33s, Helper Exit 3, Feld `model` leer. G11-Kimi bleibt offen. Die Route ist abgeschlossen.

## Verbatim-Belege

```text
$ cd /root/clients/salsaflow-w1 && rg -n "center 20%" src/public/courses/styles/content.ts | head -2
428:        position: 'center 20%',

$ rg -n "center 14%" src/public/courses/styles/content.ts | head -3
147:        // Luft zum Fold. Crop bleibt center 14% (P85), Motiv bleibt, EN 55
152:        // 24rem wie in R109. Crop bleibt center 14% (P85-Lock, nicht gedreht).
153:        position: 'center 14%',

$ rg -n "center 12%" src/public/courses/styles/heels-content.ts | head -2
123:        position: 'center 12%',
239:        position: 'center 12%',

$ rg -c 'left: 1\.25rem' src/index.css || echo 0
0

$ node scripts/verify-ux-whatsapp.mjs 2>&1 | tail -3
PASS home-dsk-wa-right
REPORT /root/clients/salsaflow-w1/worklog/shots/S7-ux121/verify-report.json
VERDICT PASS

$ git diff --name-only
src/index.css
src/lib/i18n.tsx
src/public/BookingPanel.tsx
src/public/CoursesPage.tsx
src/public/courses/CourseEngine.tsx
src/public/courses/styles/StylePage.tsx
src/public/courses/styles/content.ts
src/public/events/danceflow-content.ts
src/public/home/EventsTeaser.tsx
src/public/home/Hero.tsx
src/public/home/Offer.tsx
src/public/home/TeamBlock.tsx
src/public/home/content-v3.ts
src/public/home/content.ts
src/public/site/CookieBanner.tsx
src/public/site/WhatsAppFloat.tsx
src/public/social/InstagramShowcase.tsx
src/public/team/FounderRow.tsx

$ ls /root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-mobil-390.png /root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-desktop-1440.png
/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-desktop-1440.png
/root/clients/salsaflow-w1/worklog/shots/S7-ux138/bachata-mobil-390.png
```
