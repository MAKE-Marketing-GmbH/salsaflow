# Brief Runde 135 — Fix-Runde 4 (nur offene KRITISCH)

Alter Lauf `wf_3d2739dd-724` ist tot nach 3 Kritik-Runden. NICHT neu bauen.
Nur diese 5 KRITISCH + 1 WICHTIG. Arbeitsverzeichnis: `/root/clients/salsaflow-w1`.
Vite: `http://127.0.0.1:5175`. NIE unter `/root/clients/braun-services`.

## Fixes (chirurgisch)

1. **party-50-v3.webp gespiegelt.** Datei:
   `/root/clients/salsaflow-w1/public/photos/party/party-50-v3.webp`
   Haengt an `src/public/home/EventsTeaser.tsx:88` und
   `src/public/events/danceflow-content.ts:118` und `:252`.
   Bild per Read ansehen. Dann entweder horizontal floppen
   (`magick input -flop output`) in eine neue Datei und alle 3 Pfade umstellen,
   oder anderes Foto aus `public/photos/party/` (kein Team-Portraet).
   Nach dem Tausch das Ergebnis-PNG per Read pruefen: Marke/Schrift muss
   richtig herum stehen. Alte Datei nicht auf `/` lassen.

2. **formStepOf ist Konstante.** `src/public/BookingPanel.tsx:79` DE und `:104` EN.
   Wird bei `:1172` gerendert. Ableiten aus `visibleStep` (Zeile 945):
   sichtbar 1 → «Schritt 1 von 2» / «Step 1 of 2».
   sichtbar 2 → «Schritt 2 von 2» / «Step 2 of 2».
   Keine feste «Schritt 2 von 3»-Zeichenkette mehr.
   `rg formStepOf:` darf keine feste Zahl enthalten.

3. **Pflicht-Meldung unter optionalem Telefon.** `PersonFields` plus
   `formError` bei `:1305`. Globale Meldung «Bitte fülle die Pflichtfelder aus.»
   sitzt unter Vorname, Nachname, E-Mail UND TELEFON (OPTIONAL).
   Soll: eigene kurze Meldung NUR unter Pflichtfeldern (Vorname, Nachname, E-Mail).
   Unter Telefon und Nachricht: keine Pflicht-Meldung.
   E-Mail-Format: eigene Zeile «Diese E-Mail-Adresse stimmt nicht.» — nicht
   «Pflichtfelder». Globales `formError` unter den Feldern entfernen, wenn die
   Feldmeldungen das abdecken. Schritt-1-Fehler (`:1331`) darf bleiben.

4. **Pastell-Tokens tot.** `src/index.css:56-57` `--color-salsa-100` und
   `--color-salsa-50` loeschen. Kommentar ohne Hex. Alle Erwaehnungen von
   `#f7dcdf` `#fceeef` `--color-salsa-100` `--color-salsa-50` in `src/` weg
   (auch Kommentare in `index.css:371`, `CoursesPage.tsx:12`).
   Gate: `rg '--color-salsa-100|--color-salsa-50|#f7dcdf|#fceeef' src/` = 0.

5. **Instagram-Sachabsatz auf `/`.** `src/public/social/InstagramShowcase.tsx:234`.
   `{!onHome && (` macht den Absatz nur ausserhalb von Home unsichtbar.
   Absatz wieder auf `/` zeigen. H2 auf `/` bleibt
   «Kurse und Abende aus dem Studio.» — kein «Siempre con Flow.» auf `/`.

6. **WICHTIG, billig:** `aria-current="step"` am Kurs-Link bei `!course`
   in `BookingPanel.tsx:332`.

## Locks (nie brechen)

WhatsApp rechts unten, weiss auf gruen. Kein `left: 1.25rem` auf `.whatsapp-float`.
Salsa-DE-Crop `center 14%` nicht anfassen. Kein Payment. Startseite nicht kuerzen.
Instagram-Absatz ist Sachtext, darf wieder sichtbar sein. H2 bleibt die Sachzeile.
Kein Pastellrot. R125/R126/R120. Heels-Deep-Link. Kein Push, kein Deploy.
Stilseiten nicht anfassen (R132/R133).

## Beweise nach dem Fix

Sweep:
`node /root/raphael-skills/skills/eigene/web/scripts/shot-sweep.mjs --base http://127.0.0.1:5175 --out /root/clients/salsaflow-w1/worklog/shots/S7-ux134 --routes /`
Mobil 390: Sweep-Flags aus der Skript-Quelle, kein eigenes Playwright.
Pflicht-PNGs:
`worklog/shots/S7-ux134/home-mobil-390.png`
`worklog/shots/S7-ux134/home-desktop-1440.png`
plus Buchungs-Flow neu: `buchung-desktop-03`, `buchung-desktop-05`,
`buchung-desktop-06` (bestehendes `booking-flow-shots.mjs` nutzen, falls da).
Jedes Pflicht-PNG per Read ansehen.
`node scripts/verify-ux-whatsapp.mjs` → VERDICT PASS.
`rg -c 'left: 1\.25rem' src/index.css` = 0.
`npx oxlint` Exit 0 auf geaenderten TS-Dateien.
`node /root/raphael-skills/skills/design/scripts/detect.mjs` auf geaenderte Dateien.
