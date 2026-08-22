# GATES R189 — Motion-Welle + Kursplan-Vereinheitlichung

Auftrag: Raphaels Video-Kritik vom 21.08.2026 (Sprachnachricht).
Regel: Kein Gate ohne Beleg. EVIDENCE `pending` = offen.

## G1 — Echte Scroll-Animation existiert
- [ ] Bewegung haengt am Scroll, nicht nur an einem Einmal-Fade. Gemessen am gerenderten
  Element, nicht am Quelltext.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r189-scroll-motion.cjs; echo EXIT:$?`
- EXPECT: EXIT:0
- EVIDENCE: EXIT:0, neun Messpunkte auf `/` und `/tanzkurse/bachata`. Kleinster Unterschied
  21,9 px (home-hero), groesster 41,7 px (style-why). Dazwischen: offer-salsa/bachata/heels/
  privat je 26,5 px, events-photo 34,2 px, team-band 36,0 px, location-photo 38,0 px.
  Gemessen wird `translateY` am gerenderten Knoten an zwei Scroll-Positionen.
- Warum nicht mehr per grep: Die alte Zeile zaehlte `useScroll`-Treffer im Quelltext.
  Das beweist nur, dass jemand die Funktion importiert hat. Ob sich beim Scrollen etwas
  bewegt, sagt es nicht. Das Skript misst stattdessen `translateY` am echten Knoten an
  zwei Scroll-Positionen und verlangt einen Unterschied.

## G2 — Reveals sind nicht mehr alle derselbe Effekt
- [ ] Vier unterscheidbare Reveal-Varianten existieren und sind benutzbar: rise, clip, blur,
  Wort-Stagger.
- CHECK: `cd /root/clients/salsaflow-w1 && grep -c "export function RiseReveal\|export function ClipReveal\|export function BlurReveal\|export function RevealWords" src/public/home/motion.tsx`
- EXPECT: 4
- EVIDENCE: 4 Treffer: RiseReveal (motion.tsx:408), ClipReveal (:412), BlurReveal (:416),
  RevealWords (:443). Die vier laufen mit eigenen Dauern (`VARIANT_DURATION` :229,
  `WORD_DURATION` :236). Im Betrieb gezaehlt von `scripts/r189-reduced-motion.cjs`:
  auf `/` sieben Wort-Stagger, fuenf Clip, zwei Blur, ein Rise.

## G3 — WhatsApp-Button fühlt sich gut an
- [ ] Eintritt, Hover und Ruhe sind bewusst gestaltet; kein "totes" Icon, kein 0815-Puls.
- [ ] Drei Kritiker (opus-critic, sol-critic, visual-kritiker) sagen PASS an echten PNGs.
- EVIDENCE: pending

## G4 — Kursplan EIN Stil, Startseite = Unterseite
- [x] Der Kursplan-Preview auf der Startseite nutzt dieselbe Optik wie /kursplan.
- [x] Auswahl/Hover färbt in beiden Ansichten identisch rot.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r189-course-hover.cjs; echo EXIT:$?`
- EXPECT: EXIT:0, beide Routen `rgb(173, 24, 39)`
- EVIDENCE: EXIT:0. Startseite und /kursplan messen identisch: Hintergrund
  `rgb(173, 24, 39)`, Titel `rgb(255, 255, 255)`, CTA `rgb(255, 255, 255)`.
  Eine Komponente: `src/public/courses/CourseRow.tsx`, benutzt von beiden Ansichten.
  Das Gate war zuerst rot und die Ursache lag im Gate, nicht im CSS: Der Block auf der
  Startseite steckt in `ClipReveal` mit 0,72 s Dauer. Das Skript wartete 300 ms und traf
  die noch geclipte Karte. Jetzt wartet es 900 ms vor dem Hover.

## G5 — Events-Block unter dem Hero sieht gut aus
- [x] "Dein Kurs endet nicht nach der Stunde" ist visuell stark, nicht flach.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r189-events-measure.cjs; echo EXIT:$?`
- EXPECT: EXIT:0, drei Bilder, keine Kollisionen
- EVIDENCE: EXIT:0. Desktop 815 px hoch, 3 Bilder, keine Kollisionen. Mobil 708 px,
  3 Bilder, keine Kollisionen. Sichtprüfung an den neuen Shots steht bei G7.

## G6 — Technik grün
- [x] Typecheck grün.
- CHECK: `cd /root/clients/salsaflow-w1 && npm run typecheck`
- EXPECT: kein "error TS"
- EVIDENCE: Exit 0, keine Fehlerzeile.
- [x] Oxlint Exit 0 auf geänderten Dateien.
- EVIDENCE: Exit 0 über alle 26 geänderten Quelldateien und alle 11 `scripts/r189-*.cjs`.
  Offen: `npx oxlint` über die ganze Wurzel meldet Altlasten ausserhalb von R189.
  Die bleiben offen und werden hier nicht mitgeschleift.
- [x] Production-Build grün.
- CHECK: `cd /root/clients/salsaflow-w1 && npm run build`
- EXPECT: kein "error"
- EVIDENCE: `✓ built in 11.56s`, danach `Prerender: 26 Routen + 404 + Admin + Buchung`.
  Warnung bleibt: ein Chunk ist 1.268 kB (gzip 337 kB). Kein Fehler, aber offen.
  Zusaetzlich `npm run verify:seo`: PASS, 26 Routen mit Titel, Description, Canonical, H1.

## G7 — Visuell belegt
- [x] Echte Screenshots im Scroll-Zustand, nicht nur oben.
- EVIDENCE: 251 Shots unter `worklog/shots/R189/final`, 8 Routen, Desktop 1440 und
  Mobil 390, aufgenommen waehrend echtem Scroll MIT Bewegung. Ruhiger Endzustand
  zusaetzlich unter `worklog/shots/R189/settled`.

## G8 — SEO: Bewertung maschinenlesbar ausgezeichnet
- [x] `aggregateRating` im LocalBusiness-Schema, aus belegter Quelle.
- EVIDENCE: `grep -c aggregateRating src/lib/schema.ts src/lib/seo-schema.ts` -> schema.ts:2, seo-schema.ts:1.
  Quelle `src/public/site/reviews.ts:14-15` (rating 4.9, count 104, Harvest 2026-07-07).
  Oxlint Exit 0. Typecheck ohne Fehler in beiden Dateien.
  Vorher stand die Bewertung nur als Fliesstext auf der Seite. Jetzt steht sie zusaetzlich
  strukturiert im Schema, also in einer Form, die Suchmaschinen auslesen koennen.
- Kein Sterne-Versprechen: Ob Google Sterne anzeigt, entscheidet Google. Das Gate deckt nur,
  dass die Daten korrekt und belegt ausgezeichnet sind. Der alte Titel "Sterne im
  Suchergebnis" hat ein Ergebnis zugesagt, das niemand hier zusagen kann.

## G9 — hreflang: geprüft, bewusst NICHT gesetzt
- [x] Entscheidung mit Beleg, kein stilles Auslassen.
- EVIDENCE: `grep -rn "hreflang" src/ index.html` -> 0 Treffer. Zuerst wie eine Lücke gelesen.
  Gegenprobe entscheidet anders: `src/lib/i18n.tsx:11` haelt die Sprache in `localStorage`
  (`STORAGE_KEY = 'salsaflow-lang'`), NICHT in der URL. DE und EN teilen sich damit dieselbe
  Adresse. `hreflang` verlangt aber je Sprache eine eigene, crawlbare URL.
  Ein Tag, das zweimal auf dieselbe URL zeigt, waere falsch und wuerde ignoriert oder abgestraft.
  ABANDON: G9-hreflang — nicht ohne URL-Praefixe (/en/...) machbar. Das ist ein Routing-Umbau,
  kein SEO-Tag, und liegt ausserhalb dieser Motion-Welle. Als naechster Schritt notiert.

## G10 — Bild-alt-Texte
- [x] Jedes Bild hat einen alt-Text.
- EVIDENCE: 89 `<img>` in `src/public`, davon 0 ohne `alt` (Python-Scan ueber den ganzen Tag,
  nicht zeilenweise). Der einzige Treffer war ein Kommentar in `team/FounderRow.tsx:25`;
  der echte Tag steht dort in Zeile 71 und traegt
  `alt={\`${founder.name} ${founder.last}, ${role} von Salsaflow\`}`.
  Hinweis fuer die naechste Runde: ein zeilenweises `grep "<img" | grep -v "alt="` meldet hier
  falsch 81 Treffer, weil die JSX-Tags mehrzeilig sind. Nur ueber den ganzen Tag messen.
