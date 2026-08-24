# STATUS R137

## Ergebnis

- R137 `/tanzkurse/salsa`: PASS.
- Vorher: Der Text stapelt über dem Full-Bleed-Bild.
- Soll: Text und Bild stehen links und rechts getrennt.
- Vorher-Shots: `/root/clients/salsaflow-w1/worklog/shots/S7-ux137/vorher/`
- Mobil: `/root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-mobil-390.png`
- Desktop: `/root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-desktop-1440.png`

## Kritik-Funde

```json
[
  {"wo":"src/public/courses/styles/StylePage.tsx:176","problem":"Mobile crop widerspricht der eigenen Messung. Kommentar verlangt 3/2 (4/3 endete bei y=833); Klasse ist unbedingt aspect-[5/4], also höher als 4/3 und schiebt die Bildkante unter den 844px-Fold.","beleg":"FAIL Sol: comment says mobile must use 3/2; actual class is unconditionally aspect-[5/4]. Should be mobile aspect-[3/2] with lg:aspect-[5/4].","fix":"aspect-[3/2] lg:aspect-[5/4] statt nur aspect-[5/4].","schwere":"WICHTIG"},
  {"wo":"src/public/courses/styles/StylePage.tsx:141","problem":"Foto sitzt mobil nicht direkt unter der Microcopy. Die Bullet-Liste (Zeilen 144-156) steht dazwischen; umgebrochene Chips machen die dokumentierte Fold-Kalibrierung ungültig.","beleg":"FAIL Sol: The photo is not directly under the microcopy on mobile. The bullet list remains between microcopy and image.","fix":"Auf Mobil das Bild direkt nach der Microcopy setzen; Bullets unter das Bild oder in die Textspalte ohne Fold-Schub.","schwere":"WICHTIG"},
  {"wo":"working tree (16 Dateien außer StylePage.tsx)","problem":"R137 ist per Patch/mtime isoliert auf StylePage.tsx, aber der Tree enthält 16 ältere tracked Änderungen inkl. Home und BookingPanel.tsx. 'Kein Home-/Booking-Rückbau' gilt nur für R137, nicht für den späteren Sammel-Commit.","beleg":"FAIL residual risk Sol: working tree still contains 16 older modified tracked files, including Home and BookingPanel.tsx.","fix":"Vorrunden-Dirt nicht in denselben Commit wie R137 packen; oder Tree auf erlaubte Dateien reduzieren.","schwere":"WICHTIG"},
  {"beleg":"NEIN. In `/root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-desktop-1440.png` ist das WhatsApp-Element unten rechts grün mit weißem Icon, aber als breite Pillenform statt als Kreis dargestellt. Mobil ist es ein Kreis.","fix":"Desktop-Widget als Kreis darstellen.","problem":"waRechts ist nicht in beiden PNGs ein Kreis.","schwere":"KRITISCH","wo":"Desktop: unten rechts am Bild."},
  {"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-desktop-1440.png und salsa-mobil-390.png (Hero, kurse/05.jpg)","problem":"Hero-Foto ist schärfer als das alte Band, aber weiter dunkel: schwarzer Hintergrund, Club-Licht, Gesichter nur warm angestrahlt. Raphael 02:21 wollte ein helles, scharfes Bild. Das ist nicht erfüllt.","beleg":"Desktop- und Mobil-Fold: große schwarze Fläche hinter dem Paar, Fenster nur als dunkler Streifen. Why-Foto (salsa-why-scroll-1440.png) ist deutlich heller. Der Kontrast belegt, dass der Hero nicht „hell“ ist.","fix":"Anderes Foto aus public/photos wählen, das bei Read hell und scharf ist (Studio/Tageslicht, volle Gesichter). Crop „center 14%“ in content.ts nicht drehen.","schwere":"WICHTIG"}
]
```

## Look

BLOCKED (BLOCKED: Helper /tmp/kimi-look-r137.sh Timeout nach 180s, kein /tmp/kimi-look-r137.json, max ein Versuch), G11-Kimi bleibt offen, Route trotzdem abgeschlossen.

## Belege

```text
$ cd /root/clients/salsaflow-w1 && rg -n "center 14%" src/public/courses/styles/content.ts | head -2
147:        // Luft zum Fold. Crop bleibt center 14% (P85), Motiv bleibt, EN 55
152:        // 24rem wie in R109. Crop bleibt center 14% (P85-Lock, nicht gedreht).

$ rg -n "center 20%" src/public/courses/styles/content.ts | head -2
428:        position: 'center 20%',

$ rg -n "center 12%" src/public/courses/styles/heels-content.ts | head -2
123:        position: 'center 12%',

$ rg -c 'left: 1\.25rem' src/index.css || true
239

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

$ ls /root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-mobil-390.png /root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-desktop-1440.png
/root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-desktop-1440.png
/root/clients/salsaflow-w1/worklog/shots/S7-ux137/salsa-mobil-390.png
```
