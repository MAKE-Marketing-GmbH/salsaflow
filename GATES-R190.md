# GATES R190 — Smooth Scroll, Breite, Rhythmus

Auftrag: Raphaels Sprachnachricht vom 22.08.2026 zur Live-Preview.
Wörtlich beklagt: (1) Reveal "ploppt einfach ein", kein smooth Scroll.
(2) Auf Mobil "sieht das richtig komisch aus". (3) Sektionen uneinheitlich,
egal ob Eyebrow, Überschrift oder Subtitle da ist. (4) "Die Breite der Seite
ist übelst kaputt nach dem Hero". (5) Unter der Subline mehr Platz.

Regel: Kein Gate ohne Beleg. EVIDENCE `pending` = offen.
Offen aus R189 mitgenommen: G3 (WhatsApp-Kritiker).

## A1 — Breite ist siteweit eine, nicht zwei
- [x] Hero-Inhalt und alle Folgesektionen starten auf derselben linken Kante.
- [ ] Das Shell-Padding ist symmetrisch.
- CHECK: `paddingLeft` gegen `paddingRight` der Shell auf Mobil und Desktop messen.
- EVIDENCE: FAIL, und zwar als bewusste Entscheidung, nicht als offene Aufgabe.
  Gemessen links 32 px gegen rechts 88 px ab `sm`. Der Haken bleibt leer, weil das
  Ziel wörtlich nicht erreicht ist; die Sache selbst ist entschieden (siehe
  "ENTSCHIEDEN STATT OFFEN" in A7 und die Begründung unten). Bis R192 trug dieser
  Punkt gar keine EVIDENCE-Zeile, nur Prosa — Befund des Konsistenz-Reviews
  `task_8107a0551a63`. Wer ihn auflösen will, braucht eine Design-Entscheidung
  von Raphael, keine Messung.
  NICHT ERREICHT, und der Haken war vorher zu Unrecht gesetzt. Befund von
  sol-critic, nachgemessen und bestätigt: die Shell steht auf
  `pl-5 pr-[var(--wa-corner)] sm:pl-8`. `--wa-corner` ist ab `sm` 5.5rem = 88 px
  — also GENAU der alte Wert. Auf Mobil ist der rechte Rand wirklich von 96 auf
  60 px gefallen, ab `sm` hat sich nichts geändert: gemessen links 32 px gegen
  rechts 88 px. Das echte Verhältnis ist 62 % (mobil) und 100 % (desktop) des
  alten Gutters, nicht "ein Drittel".
  KORREKTUR (sol-critic, Runde 3): hier stand "92 % desktop". Das war 88/96 —
  geteilt durch den MOBILEN Altwert. Der alte Desktop-Wert war
  `sm:pr-[5.5rem]` = 88 px, an `git show HEAD:` nachgeprüft. Desktop hat sich
  also gar nicht geändert, 100 %.
  Ein symmetrischer Versuch (`px-5 sm:px-8`) wurde gefahren und wieder verworfen:
  er erzeugte 14 von damals 16 Kollisions-Kombinationen (Beleg und Einordnung
  der Zahl in G3).
  ABGESCHLOSSEN IN DIESER RUNDE — die Asymmetrie bleibt. opus-critic Runde 4
  hat zu Recht angegriffen, dass Weg 1 (seitliche Achse) die falsche Grösse
  misst: der Knopf ist `fixed` und steht im Viewport, nicht im Dokumentrand.
  Weg 2 wurde deshalb gebaut: symmetrische Shell plus Reserve nur im unteren
  Band (`scripts/r190-probe-wa-symmetrie2.cjs`, acht Routen, beide Viewports,
  alle Scrollpositionen). Gemessene Kollisionen:
    A  jetzt, asymmetrisch                 0
    B  symmetrisch, ohne Ersatz           34
    C  symmetrisch + Bandreserve           7
  C ist besser als B und schlechter als A. Die sieben Resttreffer liegen auf
  `/`, `/tanzkurse` und mobil. Wer die Symmetrie will, muss den Knopf ändern
  (kleiner oder beim Scrollen weg) — das ist Raphaels Design-Entscheidung.
  WARUM DAS GATE DEN FEHLHAKEN NICHT GEFANGEN HAT: `r190-layout-audit.cjs` mass
  nur die LINKE Textkante und den Überlauf. Über den rechten Rand gab es keinen
  Messwert, also konnte auch keiner widersprechen. Die Messung ist jetzt
  ergänzt und läuft in jeder Zeile mit (bewusst als Protokollzahl, nicht als
  Fehlerfall — die Asymmetrie ist zurzeit gewollt):
  `/ desktop … Shell-Rand L32/R88 px · / mobil … L20/R60 px`, identisch auf
  `/tanzkurse/bachata` und `/kursplan`.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r190-layout-audit.cjs --gate; echo EXIT:$?`
- EXPECT: EXIT:0
- MESSUNG VORHER (2026-08-22, scripts/r190-layout-audit.cjs):
  Desktop 1440: Hero innerLeft 52 px / innerW 640 px. Sektionen 1..9 alle
  innerLeft 20 px / innerW 1400 px. Sprung an der Hero-Kante: 32 px.
  Shell (`src/public/site/primitives.tsx:30`) trägt `pl-5 pr-24`,
  also links 20 px gegen rechts 96 px. Differenz 76 px über die ganze Site.
- EVIDENCE: PASS über drei Routen und zwei Breiten. Linke Textkante exakt
  52 px (Desktop) und 20 px (Mobil), ohne Sprung:
  `/ desktop 52..52 · / mobil 20..20 · /tanzkurse/bachata desktop 52..52 ·
  /tanzkurse/bachata mobil 20..20 · /kursplan desktop 52..52 ·
  /kursplan mobil 20..20`.
  ZWEITE MESSUNG ZU RAPHAELS PUNKT 4, weil "die Breite ist übelst kaputt nach
  dem Hero" bisher als Links-Rechts-Asymmetrie GEDEUTET wurde. Das war eine
  Deutung, keine Messung — und die Asymmetrie sitzt am Aussenrand, wo man sie
  kaum sieht. `scripts/r190-probe-breite.cjs` misst deshalb die echte
  Inhaltskante Sektion für Sektion von oben nach unten:
  Startseite Desktop: Sektionen 1-4, 7, 9 alle auf L52. Zwei Ausreisser —
  Sektion 5 (TeamBlock) L30 und Sektion 6 (PriceSignal) L101.
  Beide nachgeprüft, beide KEIN Fehler:
  · TeamBlock: die H2 steht auf 52. Was auf 30 ragt, ist ein `absolute`
    positioniertes Foto — der gewollte Parallax-Überstand.
  · PriceSignal: die Sektion rendert ein gerahmtes Panel mit `lg:p-12`
    (48 px Innenabstand). 52 + 48 = 100. Die Kartenkante steht auf 52.
  ERGEBNIS: die Textkante der Startseite ist durchgehend 52 px (Desktop) und
  20 px (Mobil). Was in der Messung springt, sind bewusst gesetzte Karten- und
  Bildüberstände. An dieser Stelle ist Raphaels Punkt 4 nicht reproduzierbar —
  was er gesehen hat, muss etwas anderes sein. Die Bild-Kritik (A7) soll es
  benennen, statt dass ich es rate.
  ZWEITE URSACHE, erst durch Bild-Kritik gefunden: `/kursplan` trug einen
  EIGENEN zentrierten Container (`mx-auto max-w-[1080px] pl-5 pr-24`,
  SchedulePage.tsx:201). Die H1 stand dort auf 52 px, der ganze Kalender
  darunter auf 213 px — 161 px Sprung direkt unter dem Hero. Der Audit prüfte
  damals nur `/` und sah die Seite nie; zwei Bild-Kritiker sahen sie sofort.
  Der Kalender läuft jetzt in derselben `Shell`, die 1080 px wirken als
  `max-w` darin (ohne `mx-auto`). Der Audit prüft seitdem drei Routen.
  DRITTE STELLE: `/schnupperstunde` trug `pr-24 lg:pr-0` als Rest desselben
  Gutters (SchnupperstundePage.tsx:98) — entfernt.

## A2 — Kein horizontaler Überlauf auf Mobil
- [x] Bei 390 px ragt kein Element über die Viewport-Kante.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r190-layout-audit.cjs --gate; echo EXIT:$?`
- EXPECT: EXIT:0, `offenders` leer auf Mobil
- MESSUNG VORHER: 8 Elemente ragen bis `right=580` bei clientW 390.
  Wurzel: `DIV.w-[82%] shrink-0 snap-start` im Angebots-Karussell.
  `scrollW` meldet trotzdem 390, weil der Slider selbst scrollt — der Überlauf
  ist gewollt im Slider, aber die Karten sind zu breit gerechnet.
- EVIDENCE: PASS. `Überlauf 0` auf allen drei Routen in beiden Breiten
  (vorher 8 Elemente bis right=580).

## A3 — Reveal ploppt nicht mehr
- [x] Kein Reveal zündet, wenn das Element schon im Bild steht. Der Einstieg
  beginnt, während das Element hereinkommt, nicht danach.
- [x] Die Bewegung ist an den Scroll gebunden, nicht nur an einen Trigger.
- [x] Der Reveal hat einen SICHTBAREN Weg — er hellt nicht nur an Ort und
  Stelle auf.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r190-reveal-timing.cjs; echo EXIT:$?`
- EXPECT: EXIT:0
- MESSUNG VORHER: `VIEWPORT = { once: true, margin: '-8% 0px' }`
  (`src/public/home/motion.tsx:86`). Negative Margin verkleinert den
  Auslösebereich: das Element muss 8 % TIEF im Bild stehen, bevor überhaupt
  etwas anfängt. Danach läuft der Effekt auf eigener Uhr ab. Genau das
  beschreibt Raphael als Ploppen.
- EVIDENCE: PASS. `VIEWPORT` steht auf `margin: '0px'`; zusätzlich gibt es
  echte Scroll-Bindungen. Gemessen wird BINDUNG, nicht Auslösezeit: messen →
  400 px scrollen → erneut messen (muss sich ändern) → 500 ms ohne Scroll
  warten (darf sich NICHT ändern). Ergebnis:
  `/ 8 scroll-gebunden` — team-band `4.0 → -4.8 → -4.8 (ohne Scroll)`,
  location-photo `4.4 → -5.5 → -5.5`.
  `/tanzkurse/bachata 3 scroll-gebunden` — style-why `4.9 → -6.1 → -6.1`,
  style-build `4.2 → -4.9 → -4.9`, style-social `4.4 → -5.2 → -5.2`.
- DRITTE PRÜFUNG, nach der zweiten Kritikrunde ergänzt. Die zwei Messungen oben
  waren grün, und trotzdem meldeten alle drei Kritiker dasselbe Bild: Elemente
  stehen an der Endposition und sind noch halb durchsichtig. Ich habe das nicht
  am Eindruck entschieden, sondern die Kurve nachgerechnet: die alte
  `[0.22, 1, 0.36, 1]` legt bei 27 % der Laufzeit 79 % des Weges zurück. Von
  14 px blieben dort 2,9 px — bei 79 % Deckkraft. Die Kritiker hatten recht.
  Geändert: Kurve → `[0.33, 1, 0.68, 1]`, Distanz 14 → 20 px, `rise`-Dauer
  0,45 → 0,58 s (`motion.tsx`).
  DIESE PRÜFUNG HAT SECHS VERWORFENE ANLÄUFE GEBRAUCHT, alle im Skriptkopf
  dokumentiert: zu lockere Schwelle · falsche Achse für die `blur`-Variante ·
  Mischmedian über alle Varianten · Messung zu EINEM Zeitpunkt · Restweg ohne
  Bezug auf die Deckkraft · Restweg bei fester Deckkraft. Jeder davon hätte grün
  gemeldet, ohne etwas zu beweisen.
  DER SECHSTE WAR DIE HARTNÄCKIGSTE FALLE, weil er funktionierte. Er mass den
  Restweg bei fester Deckkraft, trennte sauber (alt 4,3..5,0 gegen neu 6,1..6,9)
  und wurde über acht Läufe bestätigt. Trotzdem war er blind: `useReveal` gibt
  Deckkraft UND Versatz dasselbe `transition`-Objekt (`motion.tsx:152`), also
  gilt `Restweg = distance × (1 − opacity)` — Kurve und Dauer kürzen sich weg.
  Die Schwelle 5,5 prüfte in Wahrheit nur `distance ≳ 15,7 px`. Die eigene
  Kalibriertabelle sagte es mit: alle drei Fenster zeigten Faktor ~1,4, und
  20/14 = 1,4286. Ich hatte den Distanz-Quotienten für einen Kurven-Effekt
  gehalten. Befund von sol-critic, am Code gezeigt, im Browser nachgeprüft.
  GEMESSEN WIRD JETZT der Restweg bei festem ZEITANTEIL (27 % der Laufzeit) —
  die Größe, aus der `motion.tsx` ohnehin argumentiert, und eine Funktion der
  Kurve. Drei Achsen statt zwei, weil `clip` weder Weg noch Schärfe bewegt,
  sondern einen Vorhang (`inset(0% 0% 100% 0%)` → `inset(0% 0% 0% 0%)`).
  Genau daran fiel `clip` vorher stumm durch das Gate.
  SIEBTER ANLAUF, nach opus-critic Runde 4: `clip` fuhr `opacity: 1` in
  BEIDEN Zuständen. Eine 416 px hohe Sektion stand voll sichtbar im Bild
  und war zu 100 % leer — belegt in `home-desktop-01-motion.png` und
  gemessen als `inset(0% 0% 100%)` bei Deckkraft 1. Das ist Raphaels
  "das ploppt einfach ein". Neu: Startvorhang 88 %, Deckkraft 0,55, wie
  bei `blur`. Das Gate prüft das jetzt als eigene Bedingung: volle
  Deckkraft plus mehr als die Hälfte verdeckt = FAIL.
  Gegenprobe mit zurückgedrehtem `motion.tsx`: Restvorhang-Median 39,01 %,
  Deckkraft dort 1,00 — die Vorhang-Achse allein lässt den alten Stand
  durch. Erst die Deckkraft-Bedingung fällt ihn.
  Zusätzlich: `VARIANT_DURATION.clip` und der Startvorhang werden aus der
  Quelle gelesen (vorher hart kodiert); eine Einzelmessung unter der
  Hälfte der Schwelle fällt; Kinder eines clip-Elements zählen nicht als
  clip (zogen das Minimum auf 0,00); Komponenten mit `distance` unter
  75 % des Tokens fallen. Gefunden und gehoben: Faq.tsx 12, MehrPage 14,
  PartysPage 3×14.
  GEGENPROBE AN motion.tsx SELBST, nicht am Modell (Datei geändert, Gate
  gefahren, zurückgestellt; Prüfsumme vorher und nachher `843d57f1…`):
    nur `EASE_OUT` zurück auf `[0.22, 1, 0.36, 1]`, Distanz und Dauer unverändert:
      rise 7,80 → 4,11 px · letters 7,02 → 3,70 px ·
      clip 39,01 → 20,57 % · blur 1,17 → 0,62 px — alle vier FAIL.
    nur `distance` zurück auf 14, Kurve und Dauer unverändert:
      rise 7,80 → 5,46 px FAIL, die drei anderen korrekt grün.
  Die alte Größe meldete bei genau diesem Kurven-Zustand 6,89 und PASS. Das ist
  der Unterschied.
  ZWEI WEITERE LÜCKEN, DIE DABEI AUFGINGEN:
  (a) `clip` und `letters` konnten im Deckkraft-Fenster nie eine Messung liefern
  (`clip` startet bei Deckkraft 1, `letters`-Wörter bei 0,72). Eine fehlende
  Variante tauchte in der Auswertung gar nicht auf und löste nichts aus — ein
  kaputtes `clip`-Reveal konnte das Gate nicht rot machen. Jetzt ist eine
  fehlende Variante ein FAIL.
  (b) Teil 1 und 2 scrollen die Route durch, bevor Teil 3 misst. Mit `once: true`
  sind die Reveals dann verbraucht: gemessen `rise` Restweg 0,00 bei Deckkraft
  1,00. Teil 3 bekommt jetzt eine frische Seite.
  GRENZE DER MESSUNG, offen notiert: nur was über die Web-Animations-API läuft,
  lässt sich per Uhr stellen. Nachgemessen auf `/` laufen `clipPath`, `filter`,
  `opacity` und `scale` über WAAPI, der `transform` der `rise`-Elemente NICHT —
  Framer Motion schreibt ihn direkt in den Style. Die Weg-Achse wird deshalb
  gegen ein Referenzelement gemessen, das die Tokens aus `motion.tsx` liest
  (nicht kopiert: dreht jemand die Werte zurück, fällt das Gate).
  EHRLICH DAZU: für die `blur`-Variante gab es mit der alten Messung KEINEN
  Beleg einer Verbesserung. Mit der neuen trennt sie: 1,17 gegen 0,62 px.
  Das Minimum trennt weiterhin nicht und steht nur als Protokollwert.
- ZAHLENVERHÄLTNIS, EINGEORDNET STATT NUR GEMELDET: auf `/` stehen 8 gebundene
  gegen 28 reine Trigger-Reveals, auf `/tanzkurse/bachata` 3 gegen 18. Diese
  Zahl sieht schlechter aus, als sie ist — nachgeprüft, welche Sektionen
  betroffen sind.
  KORRIGIERT NACH sol-critic, Runde 3. Hier stand "die Startseite hat 8
  Sektionen" und "jede Sektion mit Foto ist scroll-gebunden". Beides war falsch,
  am Code nachgeprüft:
  (a) `HomePage.tsx:103-112` rendert ZEHN Kinder, nicht acht: Hero, Offer,
  ScheduleTeaser, WallOfLove, EventsTeaser, TeamBlock, PriceSignal, Faq,
  LocationBand, InstagramShowcase. WallOfLove fehlte in beiden Listen.
  (b) ScheduleTeaser wird auf `/` mit `withCoursePath` gerendert
  (`ScheduleTeaser.tsx:384`), und `CoursePath.tsx:166` trägt ein `<img>`.
  Es gibt also mindestens eine ungebundene Sektion MIT Foto.
  (c) Die Zählmethode war auch andersherum unzuverlässig: TeamBlock greppt auf
  0 `<img>`, trägt aber ein Foto als `motion.img` (`TeamBlock.tsx:249`).
  WAS WEITERHIN STIMMT: Parallax braucht laut `useParallax` (motion.tsx:182)
  Überstand am Bild; auf Fließtext angewandt verschiebt er Zeilen gegen ihren
  Rahmen und sieht billiger aus, nicht teurer. Der Instagram-Block ist bewusst
  ausgenommen: er führt fremde iframes auf einer festen 9:16-Bühne, die genau
  gegen Layout-Shift gebaut ist (InstagramShowcase.tsx:36-43).
  EHRLICHE FASSUNG: die grossen Bildflächen der Startseite sind gebunden
  (Offer, EventsTeaser, TeamBlock, LocationBand). Das eine Foto im eingebetteten
  CoursePath ist es nicht. Ob das reicht, ist eine Frage ans Auge und nicht ans
  Gate — sie gehört in die Bild-Kritik (A7), nicht in eine Behauptung hier.

## A4 — Sektionen haben EINEN Rhythmus
- [x] Abstand Eyebrow→Titel und Titel→Subline ist überall gleich,
  unabhängig davon, welche der drei Zeilen vorhanden sind.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r190-section-rhythm.cjs; echo EXIT:$?`
- EXPECT: EXIT:0
- MESSUNG VORHER: `sectionLead` wurde an 87 Stellen mit sechs verschiedenen
  Margins aufgerufen (`mt-2` 1×, `mt-3` 3×, `mt-4` 40×, `mt-5` 5×, `mt-6` 4×,
  `mt-8` 1×). Am DOM kam das als 12, 16 und 20 px an.
- EVIDENCE: PASS. Der Abstand steht jetzt zentral in `sectionLead` (`mt-4`);
  24 redundante `mt-4` an Aufrufstellen sind entfernt (92 → 68 Vorkommen in den
  geänderten `src`-Dateien). Hier stand "35" — nicht reproduzierbar, Befund von
  sol-critic, nachgezählt.
  `/ Titel→Subline 16..16 px über 7 Sektionen` — EIN Wert, keine Spanne.
  `/ Eyebrow→Titel 20..22 px über 2 Sektionen` (vorher 16..22).
  `/tanzkurse/bachata Eyebrow→Titel 20..20 px über 3 Sektionen` (vorher 12..20),
  `/tanzkurse/bachata Titel→Subline 16..16 px über 6 Sektionen` (vorher 0..53).
  DREI GATE-FEHLER dabei gefunden und behoben, sonst hätte es falsch grün
  gemeldet: (a) es sah nur `main > *` und übersprang `/tanzkurse/bachata`
  komplett ("nur 1 Sektionsköpfe") — die Seite hat 10 Köpfe in einem Wrapper;
  (b) es mass gegen `sr-only`-Tagesüberschriften im Kalender und meldete 0 px;
  (c) es hielt den abgesetzten FAQ-Block hinter einer Trennlinie für eine
  Subline und meldete 53 px.
- KORREKTUREN AM PRODUKT, nicht nur am Gate:
  (a) das dunkle CTA-Band (CourseEngine.tsx:1075) baute seinen Kopf von Hand mit
  `mt-3` statt der geteilten Rolle — jetzt `mt-5`/`mt-4` wie jeder andere.
  (b) NACHTRAG dieser Runde: der Rest der 16..20-Spanne kam nicht aus einer
  Toleranz, sondern aus VIER Absätzen, die `sectionLead` gar nicht benutzten.
  Sie wiederholten dessen Klassen wörtlich und setzten ein eigenes `mt-5`
  davor — LocationBand.tsx:92, PriceSignal.tsx:76, TeamBlock.tsx:130 und
  InstagramShowcase.tsx:234. Alle vier laufen jetzt über die Rolle. EINE echte
  Ausnahme bleibt und steht als Kommentar dabei: TeamBlock `lg:mt-0` für die
  Grundlinien-Ausrichtung in der zweiten Grid-Spalte (`lg:items-end`).
  (c) EventsTeaser.tsx:108 trug `mt-4` am Titel und war damit der einzige
  Eyebrow→Titel-Abstand der Startseite unter 20 px — jetzt `mt-5`.
  Dessen Lead behält als einziger einen Farb-Override
  (`text-[var(--color-night-muted)]` auf dunklem Grund). Nachgemessen am
  gerenderten DOM: `rgb(216, 200, 197)` bei 18 px — er setzt sich also durch
  `cn()` gegen die Rollenfarbe durch und ist keine tote Klasse.
  (d) NACHTRAG, Befund von sol-critic, nachgeprüft und bestätigt: der
  entsprechende Override in InstagramShowcase war TOT. Er hing am Zweig
  `!compact`, aber beide Aufrufstellen setzen `compact` (HomePage.tsx:112,
  PhotosPage.tsx:258) — der dunkle Pfad wird nie gerendert. Entfernt.
  Die Farbmessung oben gehört zu EventsTeaser; in der ersten Fassung dieses
  Eintrags stand sie fälschlich bei Instagram und belegte damit eine
  Entscheidung, die es so nicht gab.
- OFFEN, klein und benannt: `/ Eyebrow→Titel` steht bei 20..22 px. Die 2 px
  sind die Zeilenbox des Instagram-Eyebrows (Icon neben Text), kein
  abweichender Margin. Vor dieser Runde war die Spanne 6 px.

## A5 — Luft unter der Hero-Subline
- [x] Der Abstand H1→Subline ist grösser als die gemessenen 28 px.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r190-layout-audit.cjs --gate; echo EXIT:$?`
- EXPECT: EXIT:0
- MESSUNG VORHER: Desktop 28 px, Mobil 28 px zwischen H1-Unterkante und
  Subline-Oberkante. Raphael: "wobei ich gerne zum Beispiel unter der
  Subline mehr Platz ist".
- EVIDENCE: PASS. Startseite Desktop 40 px (vorher 28), Mobil 36 px (vorher 28).
  DIE ERSTE FASSUNG DIESES EINTRAGS WAR FALSCH und wird hier korrigiert, nicht
  überschrieben: Ich hatte Mobil bei 28 px belassen und das als begründete
  Ausnahme verkauft — "das Foto endet bei y=574, die 28 px SIND der Abstand zur
  Bildkante". Beim Nachmessen stimmte das nicht.
  Richtig gemessen gegen die sichtbare Box (die trägt `overflow-hidden`), auf
  390/360/430 identisch: der Lead startete exakt 0 px unter der Fotokante — er
  berührte sie. Damit kippt auch das alte Argument "mehr Rand schöbe ihn ins
  dunkle Foto": er stand bereits an der Kante, mehr Rand zieht ihn davon WEG.
  ZURÜCKGEZOGEN, Befund von sol-critic: ich hatte die alten 7 px danach mit
  einer Messung gegen das `<img>` statt gegen die Box erklärt. Diese Erklärung
  ist arithmetisch unmöglich — der Parallax-Überstand reicht nur nach UNTEN, ein
  solcher Messfehler ergäbe ein negatives Vorzeichen, nicht +7. Woher die Zahl
  kam, weiß ich nicht; sie stammt aus einer Runde ohne dokumentierten Messweg.
  Sie steht jetzt als unerklärt im Code, statt mit einer erfundenen Ursache.
  Neu `max-sm:mt-9` (36 px). Der Lead steht jetzt 8 px unter der Kante.
  Der Fold trägt es, gemessen an der ENGSTEN Breite 360×780: der zweite CTA
  endet bei y=757 von 780, also 23 px Reserve. Auf 390×844 sind es 73 px.
  DIESE 23 px SIND KNAPP, und das steht hier statt nur der grünen Zahl: eine
  Lead-Zeile misst rund 29 px (18 px `text-lg` × 1.625 `leading-relaxed`).
  Bricht die Copy auf eine vierte Zeile um, fällt der zweite CTA auf 360×780
  unter den Fold. Wer den Hero-Text verlängert, misst den Fold neu — als
  Warnung auch im Code hinterlegt (`Hero.tsx`).
  NACHZIEHER auf den Unterseiten: dort trugen die Leads `sectionLead` INNERHALB
  eines Flex-Containers, der Abstand kam also doppelt (Gap + `mt-4`). Gemessen
  ergab das 40 px auf /preise, 36 px auf /team, 32 px auf /tanzkurse/salsa —
  drei Werte für dieselbe Rolle. Das `mt` ist dort jetzt aufgehoben, der Gap
  trägt den Abstand allein und steht auf `gap-6` (24 px).
  NACHTRAG, Befund von sol-critic, nachgemessen und bestätigt: `/team` lag
  danach als einzige Route bei 20 px statt 24. Ursache war eine zweite Stufe im
  Gap-Ausdruck (`kit.tsx:525`, `wide && (dense ? 'gap-5' : 'gap-7')`); `/team`
  ist die einzige Route mit `axis="wide" dense`. Jetzt `gap-6`.
  Gegengemessen über alle drei Routen: /preise 24 · /team 24 ·
  /tanzkurse/salsa 24 px.
  NACHTRAG Raphaels Punkt 5 wörtlich: "unter der Subline mehr Platz".
  Die 36/40 px oben sind der Abstand H1→Subline, also DARÜBER. Darunter
  stand mobil `mt-6` (24 px) gegen 36 px darüber — die Subline klebte am
  CTA. Jetzt `mt-10` / `max-sm:mt-8`. Gemessen in
  `scripts/r190-probe-fold.cjs`:
    360×780   Abstand 32 px, zweiter CTA endet y=765 von 780, Reserve 15 px
    390×844   Abstand 32 px, Reserve 65 px
    1440×900  Abstand 40 px, Reserve 269 px
  Der Fold trägt. Die 15 px auf der engsten Breite sind knapp; eine
  weitere Zeile Lead würde den zweiten CTA unter den Fold schieben.

## A6 — Technik grün
- [x] Typecheck ohne Fehler.
- CHECK: `cd /root/clients/salsaflow-w1 && npm run typecheck`
- EXPECT: kein "error TS"
- EVIDENCE: PASS, keine Ausgabe (beide tsconfig-Projekte).
- [x] Oxlint Exit 0 auf allen in R190 geänderten Dateien.
- EVIDENCE: PASS, `OXLINT-EXIT:0` über alle geänderten `.ts/.tsx/.cjs`.
- [x] Production-Build grün.
- CHECK: `cd /root/clients/salsaflow-w1 && npm run build`
- EXPECT: kein "error"
- EVIDENCE: PASS, `✓ built in 6.80s`, `Prerender: 26 Routen + 404 + Admin + Buchung`.
- [x] SSR bleibt ohne JavaScript sichtbar (Regel B aus motion.tsx).
- CHECK: im gebauten `dist/` je Route nach `opacity:0`, geschlossenen
  Clip-Paths und fehlenden Überschriften suchen.
- EVIDENCE: PASS. 27 von 29 prerenderten Routen tragen 0× `opacity:0`,
  0× geschlossene Clip-Path und mindestens eine sichtbare Überschrift im
  ausgelieferten HTML. Die zwei Ausnahmen `dist/buchung.html` und
  `dist/admin.html` sind bewusst client-only (leeres `<div id="root"></div>`,
  gegengeprüft an `dist/index.html`, das gefüllt ist) — Anwendungsansichten
  hinter Interaktion, keine Inhaltsseiten. Kein Reveal hält also Text
  unsichtbar, wenn JavaScript ausfällt.
  ZÄHLWEG, weil der erste falsch war: `dist/*.html` findet nur 18 Dateien —
  elf Routen liegen in Unterordnern. Gezählt wird rekursiv über den ganzen
  `dist`-Baum, sonst prüft das Gate ein Drittel der Seite nicht.

## G3 (aus R189 übernommen) — WhatsApp-Knopf
- [x] Der Knopf verdeckt keinen Inhalt — in BEIDEN Zuständen.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r189-whatsapp-collisions.cjs; echo EXIT:$?`
- EXPECT: keine Exception
- EVIDENCE: PASS über 8 Routen × 3 Breiten (390 / 768 / 1440).
  Die Zahlen in diesem Block standen bis R192 auf dem alten Zwei-Breiten-Stand
  (Konsistenz-Review `task_8107a0551a63`). Der Code hat 8 ROUTES × 3 VIEWPORTS.
  WICHTIG — DIESE RUNDE HAT DEN FEHLER SELBST ERZEUGT UND WIEDER BEHOBEN:
  Nach der ersten, rein symmetrischen Shell (`px-5 sm:px-8`) meldete das Gate
  14 Route/Viewport-Kombinationen mit verdeckten Bedienelementen, darunter der
  Link "Alle 104 Bewertungen auf Google". Gegenprobe: derselbe Lauf gegen den
  unveränderten Stand (HEAD) war grün. Die Kollisionen kamen also aus der
  Symmetrie, nicht aus einem Altbestand — gemessen, nicht vermutet.
  DIE ZAHL "14 VON 16" IST HISTORISCH, hier eingeordnet, weil sie an zwei
  weiteren Stellen zitiert wird (A1 und A7 "ENTSCHIEDEN STATT OFFEN").
  Nenner: der Lauf fand auf dem damaligen Zwei-Viewport-Gate statt, 8 Routen ×
  2 Breiten (390 / 1440) = 16. Heute hat `r189-whatsapp-collisions.cjs`
  8 ROUTES × 3 VIEWPORTS = 24 (`tablet` 768×1024 kam in G3b dazu).
  Zähler: die 14 stammen zusätzlich aus der ALTEN, in R192 als löchrig
  belegten Kollisionslogik (S2-2, S2-2b, S2-3, S2-4 in A7). Sie ist damit ein
  belastbares Signal "die Symmetrie bricht breit auf" und KEINE mit dem
  heutigen Gate vergleichbare Messgröße. Wer die Symmetrie neu bewerten will,
  fährt den Versuch gegen das heutige Gate erneut; die 14 taugen dafür nicht
  als Referenzwert.
  Der Fussabdruck des Knopfes steht jetzt als EINE Zahl in `index.css`
  (`--wa-corner`: 3.75rem mobil, 5.5rem ab sm = Kreis plus 8 px Luft) und wird
  von der Shell verbraucht. Statt 96 px über die ganze Seitenlänge.
  ZWEITER MESSPUNKT ergänzt: das Gate mass bisher 240 ms nach dem Scrollen und
  traf den Knopf damit IMMER als schmalen Kreis. Im Ruhezustand wächst er zur
  Pille (56 → 122 px) und reicht 66 px weiter nach links — dieser Zustand war
  nie geprüft. Jetzt wird er gemessen; das Gate ist in beiden Zuständen grün.
  Abstand zum nächsten Inhalt neben dem Knopf, gemessen auf `/`:
  1440 px keine Nachbarschaft · 1280 px Kreis 153 px / Pille 87 px ·
  390 px 4 px. Keine Überlappung in irgendeinem Zustand.
  LETZTER LAUF nach allen Änderungen (Stand R192): 24 Route/Viewport-
  Kombinationen, 281 Messpunkte, 0 Kollisionen — weder im Kreis- noch im
  Ruhezustand, kein Abdriften, kein Verschwinden.

### G3b — Runde 8, Grok-Look: FAB auf der Sa-Kachel (Raphaels Punkt 2)
- [x] Zwischen 640 und 1023 px liegt der Knopf nicht auf dem Kursraster.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r189-whatsapp-collisions.cjs; echo EXIT:$?`
- EXPECT: `"viewport":"tablet"` auf allen 8 Routen mit `"hits":[]`
- URSACHE, am Code belegt statt gedeutet: `ScheduleTeaser.tsx:152/256` weicht dem
  Knopf mit `lg:pr-36` aus — erst ab 1024 px. Der Knopf belegt seine Zone
  (`--wa-corner`, 88 px) aber schon ab `sm` = 640 px. In der Lücke 640..1023 px
  stand die volle Pille (122 px) über der Sa-Kachel.
  WARUM DAS GATE ES NICHT GEFANGEN HAT: `VIEWPORTS` kannte nur 1440 und 390 px.
  Auf 1440 greift `lg:pr-36`, auf 390 gibt es kein Label. Die Lücke hatte keinen
  einzigen Messpunkt — das Gate war grün, weil es dort nie hingesehen hat.
- ENTSCHEIDUNG (Raphael, 22.08.2026): Weg 2 von zwei gemessenen Möglichkeiten.
  Weg 1 wäre `pr-36` von `lg` auf `sm` zu ziehen — das hätte die sechs Tagesspalten
  auf Tablets um je 24 px verschmälert. Verworfen zugunsten des unveränderten
  Rasters: der Knopf wird unter 1024 px zum Kreis (66 px schmaler).
  Geändert: `labelAllowed()` 640 → 1024 (`WhatsAppFloat.tsx`), die Formklasse
  `sm:w-auto sm:px-4` → `lg:w-auto lg:px-4`, das Label `sm:inline-block` →
  `lg:inline-block`. Alle drei zusammen, sonst rechnet der Solver mit einer
  Pille, die nicht gezeichnet wird.
- EVIDENCE: PASS. Gate um `['tablet', 768x1024]` erweitert, Ruhezustand-Schwelle
  von 640 auf 1024 nachgezogen (unter lg gibt es kein Label mehr).
  Lauf über 8 Routen × 3 Breiten: alle 8 Tablet-Zeilen `"hits":[]`,
  `"restingHits":[]`, `"drifted":[]`, `"missing":[]`.
  Form und Abstand zur Sa-Kachel direkt gemessen (`/tmp/r190-fab-verify.cjs`,
  Shots unter `worklog/shots/R190-fab-tablet/`):
    390 px   KREIS 48×48 · Label aus · Abstand zur Sa-Kachel 8 px · kein Overlap
    768 px   KREIS 56×56 · Label aus · Abstand 8 px · kein Overlap
    1000 px  KREIS 56×56 · Label aus · Abstand 8 px · kein Overlap
    1440 px  Abstand 172 px · kein Overlap
  GEGENPROBE, dass die Pille NICHT global zerstört ist: auf `/` ganz oben
  gemessen — 768 px Breite 56, Label `display:none`; 1440 px Breite 122, Label
  `display:block`. Desktop behält die Pille, nur die Lücke verliert sie.
- OFFEN UND NICHT VON DIESER RUNDE: `/` mobil 390 px, y=0, Ruhezustand — der
  Knopf (x338..386, y776..824) überlappt den CTA "Schnupperstunde buchen"
  (x20..370, y735..779) um 32×3 px in der Ecke. Das Gate meldet deshalb weiterhin
  EXIT:1.
  ALTBESTAND, nicht Regression — gemessen, nicht behauptet: derselbe Messpunkt
  gegen den Stand OHNE die beiden Änderungen dieser Runde (`git stash`) zeigt
  exakt dieselbe Überlappung. Meine Änderungen greifen erst ab 640 px.
  Der Solver findet an dieser Position keinen freien Slot und fällt bewusst auf
  den Grundplatz zurück (`WhatsAppFloat.tsx`, Kommentar bei `if (next === null)`:
  ein zeitweise unsichtbarer Messenger-Knopf gilt als schlechter als 3 px
  Überlappung). Ob das so bleibt, ist eine Design-Entscheidung für Raphael und
  gehört nicht in diesen Fix.
  ERLEDIGT IN R191 — und die Einordnung oben war zur Hälfte falsch, das steht
  hier statt einer stillen Korrektur: siehe G3c.

### G3c — R191: der 3-px-Streifschuss war ein echter Klickdiebstahl
> STAND R191 — VON R192 ÜBERHOLT. Dieser Block hält fest, was in R191 gemessen
> wurde. Der dort gebaute Fix war unvollständig, und die R191-EVIDENCE unten
> enthielt eine falsche Teilaussage ("Text unverschoben"); beides ist in R192
> korrigiert. Der gültige Stand steht in A7 unter "RUNDE 9 ABGESCHLOSSEN (R192)",
> Befund S1-1/S1-2, und abschließend belegt unter "RUNDE 10 ABGESCHLOSSEN
> (R192)". Wer den heutigen Zustand sucht, liest dort, nicht hier.
- [x] Der Knopf nimmt dem Hero-CTA keinen Klickpunkt mehr.
- CHECK: `cd /root/clients/salsaflow-w1 && node scripts/r189-whatsapp-collisions.cjs; echo EXIT:$?`
- EXPECT: EXIT:0
- EIGENER MESSFEHLER ZUERST, weil er die Bewertung eine Runde lang trug: ich hatte
  die Klickbarkeit mit einem Raster über die GANZE CTA-Box geprüft (Schrittweite 4
  ab `top+2`) und 870 Punkte für den CTA, 0 für den Knopf gemessen. Daraus schloss
  ich "unsichtbare Polsterung, kein echter Fehler". Das Raster traf die nur 3 px
  hohe Schnittzone nie. Ein Raster über die SCHNITTFLÄCHE selbst zeigt das
  Gegenteil: 5 von 10 Punkten gehören dem Float, der Streifen x354..366 in der
  untersten Linkzeile war nicht bedienbar. Auf 360×780 waren es 118 von 130.
  Wer eine Fläche prüft, muss dort messen, wo sie klein ist — nicht im Mittel.
- URSACHE, am DOM belegt: der Link ist unter `sm` vollbreit (`items-stretch` am
  Container in `Hero.tsx`). Seine Klickfläche lief bis x=370, sein TEXT endet bei
  x=287 — 83 px tote Fläche, die unter den Kreis (x338..386) reicht.
- WARUM NICHT AM KNOPF GEDREHT, mit Gegenrechnung statt Meinung: der Solver kann
  das nicht lösen. Seine kleinste Stufe ist 56 px — fast eine Knopfhöhe für einen
  3-px-Streifschuss. Nach OBEN liegt mehr Text derselben Zeile; eine probeweise
  8-px-Stufe blieb wegen des 6-px-Polsters im Prüffenster weiterhin im CTA. Nach
  UNTEN fällt jeder Wert an der Schranke `bottom > viewportH - 12`: nachgerechnet
  für −4 (bottom 834), −8 (838), −12 (842), −16 (846), −20 (850) gegen die Grenze
  832 — alle fünf raus. Der Knopf steht mit 20 px bereits am Anschlag.
  `candidates` bleibt deshalb unverändert `[0, 56, 112]`.
- GEBAUT: `max-sm:w-[calc(100%-var(--wa-corner))]` am `CtaText` in `Hero.tsx`.
  Ein `pr-` reicht NICHT — der Link ist `inline-flex` in einem
  `items-stretch`-Container, Innenabstand lässt die Box gleich breit und schiebt
  nur den Text. Gemessen und verworfen: mit `pr-` blieb die Box bei x=370 und die
  Trefferzahl bei 5/10.
- EVIDENCE (R191, teilweise widerlegt — gültige Fassung siehe unten):
    390×844  Box endet x370 → x310 · gestohlen 5/10 → 0/0
    360×780  Box endet x340 → x280 · gestohlen 118/130 → 0/0
  Tap-Ziel 44 px erhalten, `textUeberallKlickbar: true` auf beiden Breiten.
  Diese drei Zahlen stehen weiter; sie sind in R192 nachgemessen und halten.
- WIDERLEGT IN R192, deshalb hier gestrichen statt still gelassen: an dieser
  Stelle stand "Text unverschoben (390: x73..257 vorher wie nachher)" und dazu
  ein Sichtbeleg (`worklog/shots/R191-cta/390-vorher-detail.png` gegen
  `390-nachher-detail.png`), der belegen sollte, dass sich optisch nichts ändert.
  Die Aussage ist falsch. Nachgemessen (`/tmp/r192-achse3.cjs`) wanderte der
  CTA-Text auf JEDER Breite von 320 bis 639 px um 29..31 px nach links — die
  halbe `--wa-corner`, zwangsläufige Folge einer schmaleren Box mit
  `justify-center`. Die R191-Messung hatte nur 390 px im Blick und dort die
  falsche Größe verglichen. Der Sichtbeleg zeigt einen Detail-Ausschnitt, in dem
  der Versatz nicht auffällt; er trägt die Behauptung nicht.
- EVIDENCE (gültig, Stand R192): PASS. Der Versatz ist mit
  `min-[340px]:max-sm:pl-[var(--wa-corner)]` behoben (`Hero.tsx:451`).
  Gemessen `/tmp/r192-beides.cjs`, 1px-Raster über die Schnittfläche:
  320/360/375/390/430/639 px alle `gestohlen: 0`, Versatz 0..1 px ab 360 px,
  3 Textzeilen und 44 px Tap-Ziel auf allen Breiten. Unter 340 px bleibt der
  Versatz bewusst stehen — Begründung in A7, Befund S1-1/S1-2.
- GATE ZUSÄTZLICH PRÄZISIERT (`r189-whatsapp-collisions.cjs`): eine reine
  Box-Überlappung ist kein Befund mehr. Es zählt, was man SIEHT (`coversInk`,
  `hasFill`, `hasBorder`) oder NICHT KLICKEN kann (`stolenPoints` per
  `elementFromPoint` über die Schnittfläche). Gegenprobe an drei künstlich
  erzeugten Fällen (Hintergrund gefüllt, z-Index gedreht, Ist-Zustand): alle drei
  wurden als TREFFER erkannt, keiner übersprungen.
- [x] Eintritt, Hover und Ruhe bewusst gestaltet.
- CHECK: Motion-Zustände am gerenderten Knopf messen (Eintritt, Hover, 1,5 s Ruhe).
- EVIDENCE: PASS, gemessen auf 1440×900.
  EINTRITT: `animation-iteration-count: 1`, `animationName: whatsapp-float-in`.
  Kein Puls, kein Ping, keine Wiederholung.
  RUHE: über 1,5 s unverändert (`transform: none`, `opacity: 1`),
  `running: 0` laufende Animationen — kein Dauerloop.
  HOVER: nur das Icon bewegt sich, `matrix(1.10298, -0.194486, 0.194486,
  1.10298, 0, 0)` — rund −10° Drehung bei Scale 1.12. Der Knopf selbst bleibt
  `transform: none`, also EINE Geste statt zwei.
  Shots: `worklog/shots/R191-motion/1440-hover.png` und `1440-ruhe.png`.
- [x] Drei Kritiker sagen PASS.
- EVIDENCE: PASS — Stand R192, RUNDE 10. Hier stand bis R192 "zwei getrackte
  Orca-Reviews laufen noch"; beide haben geurteilt, und die fehlende dritte
  Runde auf dem R192-Stand ist inzwischen gelaufen.
  Look-Review: PASS mit drei S3-Notizen, alle drei nachgemessen, keine trägt.
  Technik-Review (`task_990325c54d31`): FAIL, in der Sache überwiegend zu Recht;
  die Befunde sind aufgearbeitet (S1-1/S1-2, S2-2, S2-2b, S2-3, S2-4 behoben;
  S2-1 offener Verdacht; S1-4 entschieden).
  Gate-Konsistenz-Review (`task_8107a0551a63`): Befunde in A1, G3 und diesem
  Block eingearbeitet. Kein eigenes Gesamtverdikt, zählt hier nicht mit.
  Abschlussreview (`task_a465eeb0ddaf`, 22.08., `/tmp/salsaflow-current-audit.md`):
  PASS — eigene Messungen, CTA-Achse auf 320/360/390 je `gestohlen 0`, S1-4
  nachgemessen (`treffer: []` auf 8 Route/Breiten-Kombinationen).
  A7-Abschlussreview auf R192 (`/tmp/salsaflow-r192-a7-independent.md`): FAIL,
  weil zwei Belegbilder älter waren als der Fix. Reshoot
  (`/tmp/salsaflow-a7-reshoot.md`, ausdrücklich ohne Urteil), dann unabhängiger
  Gegencheck (`/tmp/salsaflow-a7-final-independent.md`): PASS.
  DIE ZÄHLUNG, ausgeschrieben statt behauptet — drei PASS tragen den Haken:
  Look-Review, `task_a465eeb0ddaf` und der Gegencheck. Zwei Instanzen sagten
  FAIL: das Technik-Review und das A7-Abschlussreview; beider Befunde sind
  aufgearbeitet, aus dem Technik-FAIL läuft S2-1 als offener Verdacht weiter.
  Einschränkung, die dazugehört: das Look-PASS urteilte über die acht
  R191-PNGs, und zwei davon hat RUNDE 10 als vor-Fix-Stand ersetzt. Auf den
  heutigen Artefakten steht damit ein PASS weniger fest, als die Zahl drei
  vermuten lässt.
  ABGRENZUNG ZUR PANEL-ZEILE IN A7 ("opus-critic + sol-critic +
  visual-kritiker sagen PASS an echten PNGs"): diese Zeile hier fragt nach dem
  ERGEBNIS dreier Prüfungen, jene nach einer bestimmten BESETZUNG. Deshalb ist
  die eine gehakt und die andere nicht. Das ist Absicht, kein Versehen.
  Volle Aufarbeitung in A7 unter "RUNDE 10 ABGESCHLOSSEN (R192)".

## A7 — Visuell belegt und von drei Kritikern abgenommen
- [x] Echte Screenshots Desktop 1440 und Mobil 390, im Scroll-Zustand.
- EVIDENCE: 48 PNG unter `worklog/shots/R190`, Motion-Aufnahmen 120 ms nach
  dem Scroll-Sprung plus Ruhezustände.
- [ ] opus-critic + sol-critic + visual-kritiker sagen PASS an echten PNGs.
- EVIDENCE: OFFEN nach RUNDE 10, und zwar aus einem anderen Grund als bisher.
  Die Sache ist abgenommen: RUNDE 10 liefert ein unabhängiges PASS an echten
  PNGs (siehe A7 unten und den Haken darüber). Was fehlt, ist die WÖRTLICHE
  Bedingung dieser Zeile — ein Panel aus genau diesen drei Modell-Kritikern.
  RUNDE 10 lief mit zwei unabhängigen Prüfern, nicht mit dem Dreier-Panel.
  Der Haken bleibt deshalb leer. Er ist keine offene Aufgabe an der Seite,
  sondern eine offene Aufgabe an diesem Gate: entweder das Panel läuft nach,
  oder die Bedingung wird bewusst auf "zwei unabhängige Runden" geändert.
  Beides ist eine Entscheidung, keine Messung.
  RUNDE 1 UND RUNDE 2 WAREN FAIL BEI ALLEN DREI.
  Runde 1 aufgearbeitet: A1 `/kursplan`, A4 Gate-Blindheit, G3 Kollisionen,
  A5 Flex-Addition, falsche Ausnahme-Regel im `sectionLead`-Kommentar,
  `mt-5`/`mt-4`-Widerspruch in `kit.tsx:946`, tote Klasse in `Hero.tsx`,
  falsch gerechneter Parallax-Kommentar in `StylePage.tsx:875`.
  Runde 2 aufgearbeitet, nach Befund getrennt in bestätigt und widerlegt —
  jeweils gemessen, nicht abgenickt:
  BESTÄTIGT UND BEHOBEN (alle von sol-critic): Shell-Änderung ist ab `sm` ein
  No-op (A1, Messung ergänzt) · `/team` bei 20 statt 24 px (A5) · toter
  `!compact`-Farbzweig in InstagramShowcase (A4 d) · unmöglicher Erklärversuch
  zu den 7 px im Hero-Kommentar (A5, zurückgezogen).
  BESTÄTIGT VON ALLEN DREI und behoben: der Reveal hatte keinen sichtbaren Weg
  (A3, dritte Prüfung mit Gegenprobe).
  WIDERLEGT, mit Gegenmessung statt Widerspruch: "Mobil H1→Lead 15 px"
  (gemessen 36 Box / 31 Ink) · fünf divergierende Titel→Subline-Werte
  13/4/5/5/37 (gemessen exakt 13 px Ink in allen sieben Sektionen beider
  Routen) · sechs WhatsApp-Überlappungs-PNGs (gemessen 48 und 37 px Abstand
  auf /kursplan; auf home-mobil-08 kein Text innerhalb von 60 px an genau
  jener Position und Zeit) · "16 px auf /tanzkurse/salsa" (gemessen 24).
  RUNDE 3 gelaufen (opus-critic, visual-kritiker/Grok, sol-critic), alle drei an
  den 48 frischen PNGs. Ergebnis wieder FAIL. Aufarbeitung:
  BESTÄTIGT UND BEHOBEN (opus-critic):
  · `useCountUp` (motion.tsx) trug weiterhin `margin: '-15% 0px'` — genau die
    negative Margin, die A3 als Ursache des Ploppens benannt und überall sonst
    entfernt hatte, hier sogar in der schlimmeren Form (15 % statt 8 %). Auf
    900 px Höhe startete die Zahl erst 135 px tief im Bild. Jetzt `'0px'`.
  · `lenis` stand in `package.json`, ohne einen einzigen Import in `src/`;
    dazu eine CSS-Regel `html.lenis-active` (index.css:118) für einen Zustand,
    den seit dem Ausbau am 13.08. niemand mehr setzt. Beides entfernt.
  · Der Kommentar in `SmoothScroll.tsx` behauptete "der Wunsch ist erfuellt".
    Er ist es für Touch nicht — der eigene Kommentar sagte zwei Zeilen später
    "Wheel und Touch bleiben nativ". Zurückgezogen und präzisiert.
  WIDERLEGT, mit Gegenmessung:
  · "Offer-Karten schneiden die letzte Textzeile ab" (Grok, sein zweitschwerster
    Befund; opus-critic S3 in derselben Richtung). Gemessen auf Desktop 1440 und
    Mobil 390, in Ruhe UND 120 ms nach dem Sprung: der Absatz endet 84 px
    (Desktop) bzw. 80 px (Mobil) ÜBER der Kartenunterkante, `scrollHeight <=
    clientHeight`, Deckkraft 1. Es wird nichts geclippt. Was beide gesehen
    haben, ist die VIEWPORT-Kante: die Shots sind 900- bzw. 844-px-Ausschnitte
    in 720-px-Schritten, Karten reichen darin naturgemäß über den Bildrand —
    wie beim echten Scrollen auch.
  · "Smooth Scroll wirkt auf Mobil gar nicht" (opus-critic S1) — halb richtig.
    Richtig: `scroll-behavior` fasst Touch nicht an. Falsch ist die Folgerung,
    mobiles Scrollen sei deshalb hart: gemessen mit echten Touch-Events (CDP
    `Input.dispatchTouchEvent`, 390×844) läuft eine Wischgeste 424 px nach,
    nachdem der Finger weg ist. Das Betriebssystem liefert die Weichheit.
  EIGENER MESSFEHLER, hier festgehalten: bei dieser Prüfung mass ich zunächst,
  `scrollTo` springe hart, und hielt das für einen Bug. Gegenprobe an einer
  NACKTEN Testseite ohne unseren Code: dort springt es genauso. Der Headless-
  Browser überspringt `scroll-behavior: smooth` grundsätzlich. Die Messung war
  untauglich, nicht der Code kaputt.
  NACHTRAG sol-critic (Runde 3, verspätet eingetroffen) — der schwerste Befund
  dieser ganzen Runde, und er betrifft nicht die Seite, sondern das Gate:
  · A3s dritte Prüfung mass die falsche Größe. `Restweg bei fester Deckkraft`
    ist wegen des gemeinsamen `transition`-Objekts identisch mit
    `distance × (1 − opacity)` — Kurve und Dauer kürzen sich weg. Die Schwelle
    5,5 prüfte nur die Distanz. Wer die alte, schnelle Kurve zurückgesetzt
    hätte, wäre durchgekommen. BEHOBEN: gemessen wird jetzt bei festem
    Zeitanteil, drei Achsen, Gegenprobe an `motion.tsx` selbst (Details in A3).
  · `clip` und `letters` konnten strukturell nie gemessen werden, und ihr Fehlen
    war unsichtbar. BEHOBEN, fehlende Variante ist jetzt ein FAIL.
  · `package-lock.json` trug `lenis` noch, nachdem es aus `package.json` raus
    war — `npm ci` wäre gescheitert. BEHOBEN: Lockfile neu erzeugt, nur der
    `lenis`-Block fällt weg (31 Zeilen), keine andere Version bewegt.
  · Vier Zahlen in dieser Datei waren falsch: "92 % desktop" (richtig 100 %),
    "35 entfernte `mt-4`" (richtig 24), "kit.tsx:515" (richtig 525),
    "8 Sektionen / jede mit Foto gebunden" (richtig 10, und CoursePath trägt
    ein ungebundenes Foto). Alle vier korrigiert, jeweils mit Beleg.
  ENTSCHIEDEN STATT OFFEN: die Shell-Asymmetrie (A1, S2 bei opus-critic).
  Hier stand, `WhatsAppFloat.tsx:400` müsse seitlich ausweichen können. Gemessen
  (`scripts/r190-probe-seitlich.cjs`): der Knopf ist breiter als der Rand, den
  eine symmetrische Shell freigäbe — Desktop fehlen 28..94 px, mobil 32 px. Eine
  seitliche Achse hätte keinen Zielort. Zusätzlich direkt gefahren: `px-5 sm:px-8`
  macht 14 von 16 Kollisions-Kombinationen rot (historische Zahl, Einordnung in
  G3). Die Asymmetrie bleibt und ist
  damit eine belegte Entscheidung, kein offener Rest. Wer sie auflösen will,
  muss den Knopf kleiner machen oder aus dem Textfluss nehmen — Design-Frage
  für Raphael.
  STAND: Technik-Gates grün (typecheck, oxlint, Layout, Rhythmus, Reveal).
  A7 bleibt offen. Runde 4 und 5: FAIL bei opus-critic und visual-kritiker.
  Sol-Lane tot (kein Urteil). Bestätigt und danach gebaut:
  · clip auf dem 416-px-Angebotsraster war der Ploppen-Fall. Jetzt RiseReveal.
  · Trust-Zeile lief unter den WhatsApp-Knopf. Mobil jetzt "4,9 · 104".
  · clip-Start 45 % + Deckkraft 0,55 (Foto-Blöcke).
  · Abstand unter der Subline 32/40 px, Fold-Reserve 15 px auf 360×780.
  · Shell-Asymmetrie: Weg 2 (Bandreserve) gemessen 7 Restkollisionen, bleibt.
  Runde 6 FAIL (Opus: Offer 250 ms opacity 0; Grok-Technik: Trust unter Fold,
  Clip-Schwelle skaliert auf 0; Grok-Look: Sa unter WA, alte Shots).
  Danach: rise-Start 0,55 · Trust-Facts 2/3 nur ab sm · Sa-Raster pr-14 ·
  MIN_CLIP_START 30 · Quelle prüft clip-Deckkraft. Runde 7: Offer-H2 noch blur
  (grau); Trust 360 unter Fold. Danach H2 rise, Trust `max-[370px]:hidden`.
  Runde 8 läuft. Keine Preview, kein Commit, keine Production.

  RUNDE 9 (R191), Stand bei Übergabe. Artefakte sind neu erzeugt:
  8 PNG unter `worklog/shots/R191-a7` (360, 390, 768, 1440 × Fold/Kurse),
  2 unter `worklog/shots/R191-motion`, 4 unter `worklog/shots/R191-cta`
  (vorher/nachher, Fold und Detail).
  Ein Look-Review liegt vor: PASS mit drei S3-Notizen. Alle drei sind
  nachgemessen statt abgenickt, keine trägt:
  · "Bei 360 px steht der Kreis nur ~30 px vom CTA-Pfeil entfernt, das wirkt
    eng." WIDERLEGT: gemessen 64 px zwischen Pfeilkante (x244) und Kreisrand
    (x308). Der Schätzwert war rund halb so groß wie der echte Abstand.
    Zum Vergleich 390 px: 81 px. Auf 360 stehen beide zudem fast auf einer
    Höhe (7 px Mittenversatz), auf 390 liegen 43 px dazwischen — die 360er
    Anordnung ist die ruhigere von beiden, nicht die engere.
    STAND VOR DEM RESHOOT, und die Zahlen sind überholt. Der R192-Fix
    (`min-[340px]:max-sm:pl-[var(--wa-corner)]`) schiebt den Sekundär-CTA nach
    rechts, also näher an den Knopf. Auf den neuen Fold-Shots misst der
    Gegencheck 38,01 px (360) und 65,30 px (390) statt 64 und 81.
    Folge für die Notiz: sie trägt weiterhin nicht — 0 gemeinsame Pixel, kein
    Kollisionsrisiko. Aber der Satz "rund halb so groß wie der echte Abstand"
    gilt nicht mehr; der Schätzwert ~30 px liegt jetzt nah am gemessenen Wert.
  · "Die Desktop-Pille wirkt schwer gegen den Weißraum." Kein FAIL-Kriterium,
    keine Messung möglich, keine Änderung. Der Zustand ist gewollt und in G3
    begründet (Label nur ab `lg`, wo Platz ist).
  · "Sa-Kachel wirkt vom Rand angeschnitten, nicht am Bild entscheidbar."
    Richtig, dass es am Bild nicht entscheidbar ist — also im Layout gemessen
    (`/tmp/r191-sa-kachel.cjs`): `abgeschnitten_rechts: 0` und
    `ueber_fensterrand: 0` auf allen drei Breiten, `ueberlappt_float: false`
    überall. Auf 1440 endet die Kachel bei x1188, die Pille beginnt bei x1294
    — 106 px Luft, genau die `lg:pr-36`-Reserve. Der Eindruck stammt vom
    Screenshot-Ausschnitt, nicht vom Layout. Derselbe Fehlschluss wie bei den
    Offer-Karten in Runde 3.
  RUNDE 9 ABGESCHLOSSEN (R192). Beide getrackten Reviews haben geurteilt.
  Der Technik-Review (`task_990325c54d31`) sagte FAIL. Er hatte in der Sache
  überwiegend recht; aufgearbeitet nach Befund, jeweils gemessen:

  BESTÄTIGT UND BEHOBEN — Produkt:
  · S1-1/S1-2, der schwerste Befund: mein eigener Code-Kommentar behauptete
    "der Text bleibt zentriert und bewegt sich nicht". Falsch. Nachgemessen
    (`/tmp/r192-achse3.cjs`) wanderte der CTA-Text auf JEDER Breite von 320 bis
    639 px um 29..31 px nach links — die halbe `--wa-corner`, zwangsläufige
    Folge einer schmaleren Box mit `justify-center`. Die beiden gestapelten CTAs
    standen dadurch auf zwei Mittelachsen; auf 360 px sind 29 px rund 8 % der
    Bildbreite. BEHOBEN mit `min-[340px]:max-sm:pl-[var(--wa-corner)]`.
    Zwei Wege verworfen, beide gemessen statt geschätzt: `translate-x` schob die
    Trefferfläche mit und holte 34 von 88 gestohlenen Rasterpunkten zurück;
    Padding unter 340 px kostet 60 px Textbreite und brach den Titel von drei
    auf vier Zeilen. Unter 340 px bleibt der Versatz deshalb bewusst stehen —
    eine vierte Zeile wiegt dort schwerer als 30 px Achsversatz.
    NACHHER gemessen (`/tmp/r192-beides.cjs`, 1px-Raster über die Schnittfläche):
    320/360/375/390/430/639 px alle `gestohlen: 0`, Versatz 0..1 px ab 360 px,
    3 Textzeilen und 44 px Tap-Ziel auf allen Breiten.

  BESTÄTIGT UND BEHOBEN — Gate:
  · S2-2: Die Ausnahme-Logik war eine Whitelist aus zwei CSS-Eigenschaften gegen
    eine offene Menge sichtbarer Darstellungen. Der Prüfer kopierte die Gate-Logik
    und setzte Sonden in die echte Seite: ein roter Block via `::before`, ein
    4px-`outline` und ein `box-shadow: inset 0 0 0 40px` wurden alle
    DURCHGELASSEN. Ursache: `getComputedStyle(el)` ohne zweiten Parameter liest
    kein Pseudoelement, und `hasBorder` prüfte nur `border*Width`.
    BEHOBEN: `::before`/`::after`, `outline` und `box-shadow` zählen jetzt mit.
  · S2-2b: `coversInk` suchte Kinder nur in `svg, img, picture, video`. Ein
    Kind-`div` mit Hintergrund oder ein `canvas` fiel nur zufällig auf.
    BEHOBEN: jedes Kind mit sichtbarer Fläche zählt.
  · S2-4, und das ist der bitterste: `for (let x = sx1 + 1; x < sx2 - 1; x += 3)`
    tastete einen 2px-Schnitt NULL mal ab — bei `sx2 - sx1 = 2` ist die
    Startbedingung sofort falsch, die Schleife lief kein einziges Mal und lieferte
    garantiert 0. Genau so ein schmaler Streifen WAR der R191-Klickdiebstahl.
    Das Gate hätte ihn im Wiederholungsfall nicht gefunden. BEHOBEN: 1px-Raster,
    Grenzen nicht mehr um je 1 px verkürzt, Deckel bei 4096 Punkten mit
    mitwachsender Schrittweite.
  · S2-3: Der Knopf ist ein Kreis; von seiner Bounding-Box gehören ihm nur rund
    82 %, ab der oberen Kante greift er erst nach 12,5 px. Ein Element, das nur in
    eine Ecke ragt, bekam 0 Punkte. Mit dem 1px-Raster wird die Ecke jetzt
    abgetastet. Der Zusatzbefund stimmt auch: `stolenPoints` ist wegen `break` und
    `&& stolenPoints === 0` faktisch ein Boolean — Verhalten korrekt, Name
    irreführend. Bewusst nicht umbenannt, das wäre Kosmetik ohne Wirkung.

  NICHT REPRODUZIERBAR, trotzdem ernst genommen:
  · S2-1, `missing:[7904]` auf `/` mobil. Bei mir grün in 7 unabhängigen Läufen,
    davon 3 ohne Beruhigungspause (`/tmp/r192-missing.cjs`, `/tmp/r192-io-lag.cjs`),
    und bei Direktsprung auf y=7904 steht der Knopf mit drei Wartezeiten stabil
    sichtbar. Der Mechanismus ist aber real und belegt: `WhatsAppFloat.tsx:562`
    macht `if (footerInView || dialogOpen) return null` — der Knopf wird
    UNMOUNTET, nicht versteckt, und startet beim Remount mit `placed: false`,
    also `invisible opacity-0` (Zeile 608). Ein MutationObserver über die volle
    Scroll-Sequenz (`/tmp/r192-unmount.cjs`) zeigt genau ein Remove-Ereignis, bei
    y=11265 nahe dem Footer — dort korrekt. Ein `IntersectionObserver` meldet
    nach einem 608-px-Sprung asynchron; ein einzelner veralteter Frame genügt für
    den Unmount. EHRLICH: ich konnte den Fall nicht auslösen und habe ihn nicht
    behoben. Er bleibt als bekannter Verdacht stehen, mit benanntem Pfad.

  WIDERLEGT, mit Gegenmessung:
  · S3-1 "Behauptung 3 ist falsch, WhatsAppFloat.tsx IST geändert": Beides stimmt,
    aber es ist kein Widerspruch. Meine Aussage lautete "der Solver ist
    unverändert" und bezog sich auf `candidates = [0, 56, 112]` — das bestätigt
    der Prüfer selbst (Zeile 406, kein Diff-Treffer). Die 13 Einfügungen sind der
    Tablet-Fix aus R190/G3b, eine dokumentierte Entscheidung Raphaels (Weg 2),
    kein unbemerkter Eingriff. Berechtigt bleibt der Formulierungs-Vorwurf:
    `labelAllowed()` geht in die Solver-Rechnung ein, "unverändert" war als
    Gesamtaussage zu weit gefasst. Hier korrigiert statt still gelassen.
  · Die drei Look-Notizen (360-px-Abstand, Desktop-Pille, Sa-Kachel) bleiben
    widerlegt — siehe die Messungen oben in diesem Block. Für die erste Notiz
    gilt der dort ergänzte Nachtrag: die Zahlen 64/81 px stammen vom vor-Fix-
    Bild, auf den neuen Shots sind es 38,01 und 65,30 px. Widerlegt bleibt sie
    trotzdem, nur knapper als damals gerechnet.

  ENTSCHIEDEN, NICHT BEHOBEN — und das ist der Endstand, kein Rückstand:
  · S1-4, `--wa-corner` deckt ab 1024 px die 146 px breite Pille um 58 px nicht,
    während `primitives.tsx:102` denselben Wert als Shell-Padding nutzt. Der
    Befund ist rechnerisch richtig und betrifft eine geteilte Konstante mit zwei
    Zwecken. Bis R192 stand er hier als "offen".
    NACHGEMESSEN IM ABSCHLUSSREVIEW `task_a465eeb0ddaf` (22.08.,
    `/tmp/salsaflow-current-audit.md`) statt weiter offen gehalten: auf 8
    Route/Breiten-Kombinationen im Ruhezustand `treffer: []`. Der nächste Inhalt
    endet 285 bis 793 px links von der Pille. Die Unterdeckung ist real und
    folgenlos. RUNDE 10 hat S1-4 ausdrücklich NICHT geprüft — beide
    RUNDE-10-Reports sagen das selbst ("an diesen Bildern weder bestätigt noch
    widerlegt"). Die Zahl stammt aus der Runde davor.
    Für die Hero-Regel ohnehin ohne Wirkung (`max-sm`). Eine Änderung hier fasst
    jede Seite an. Sie unterbleibt bewusst.

### RUNDE 10 ABGESCHLOSSEN (R192) — A7 unabhängig abgenommen
- Auslöser: der Abschlussreview auf dem R192-Stand
  (`/tmp/salsaflow-r192-a7-independent.md`) gab **FAIL**. Nicht wegen eines
  Layoutfehlers, sondern weil zwei der acht Belegbilder den Zustand zeigten, den
  R192 selbst als schwersten Befund verworfen hatte. Gemessen am Pixel:
  CTA-Achsversatz 29,5 px (360) und 30,5 px (390) — exakt S1-1/S1-2.
  Belegt mit drei unabhängigen Spuren: rechnerisch (Mitte 165 ohne `pl`, 164
  gemessen), per `md5sum`-Identität mit dem älteren `R191-cta`-Shot, und über
  die Zeitachse (PNG 20:26, `Hero.tsx` 21:06). Der Fix stand im Code, aber auf
  keinem Bild.
- Reshoot (`/tmp/salsaflow-a7-reshoot.md`): genau zwei Fold-Shots neu erzeugt,
  360 und 390, über den kanonischen Capture-Weg. Kein Produktcode angefasst.
  Die sechs übrigen PNGs blieben byte-identisch.
- Unabhängiger Gegencheck (`/tmp/salsaflow-a7-final-independent.md`): **PASS**.
  Eigener Maskenlauf auf den Rohpixeln, nicht nachgerechnet.
  · Achsversatz 0,5 px auf beiden Bildern. Über sechs Schwellenwerte gesweept:
    Spannweite 0,0..1,0 px. Die 2-px-Schranke wird in keiner Variante berührt.
  · Kollision mit dem WhatsApp-Knopf: 0 gemeinsame Pixel auf allen vier
    Element/Bild-Paaren im Einzellauf. Der Sweep über sechs Maskenkombinationen
    lief nur über das engste Paar (360 px, Primär-Pille) — dort, wo er zählt;
    auch da bleibt die Überlappung 0.
  · Zeitachse aufgelöst, und härter belegt als über eine mtime: `find src -newer`
    gegen den jüngeren Shot liefert **nichts**. Der ganze `src`-Baum ist auf dem
    Stand, den die Bilder zeigen.
    WIDERLEGT IN RUNDE 11 — der Satz gilt für ZWEI Bilder, nicht für acht.
    Der Test lief gegen den jüngsten Shot und wurde auf alle verallgemeinert.
    Je Einzelbild geprüft waren sechs der acht PNGs älter als `Hero.tsx`.
    Details und Behebung im Block "RUNDE 11" am Ende dieser Datei.
  · Byte-Identität der sechs übrigen PNGs zusätzlich über `ctime` belegt — die
    lässt sich anders als `mtime` nicht setzen. Alle sechs auf die Nanosekunde
    unverändert seit 20:26.
- ZWEI NOTIZEN, ausdrücklich NICHT blockierend:
  · NOTIZ A: Der 360er-Shot steht im Hover-Zustand — der Sekundär-CTA trägt
    seinen `t-underline` (`primitives.tsx:282-291`, `index.css:158-167`). Der
    Zeiger stand nach dem Cookie-Klick zufällig über dem Link. Wirkung
    ausgerechnet statt abgetan: Hover schiebt den Pfeil 2 px nach rechts, und
    genau 2 px Differenz sind zwischen den Bildern messbar (19 gegen 17 px
    Abstand Wortende zu Pfeil, bei identischer Wortbreite von 157 px).
    Hover herausgerechnet läge der Versatz bei 0,5 px — das Kriterium hält in
    beiden Zuständen. Bleibt als Prozesspunkt: die zwei Belegbilder stehen nicht
    im selben Interaktionszustand.
  · NOTIZ B: Auf 360 px hält die Primär-Pille zum WhatsApp-Kreis nur 2,2 bis
    3,2 px Abstand. Die Bounding-Boxen überschneiden sich sogar in einem
    Streifen von 32 × 1 px — die Formen nicht, beide sind rund. Zeilengenau bei
    y712, der einzigen gemeinsamen Zeile: 12 px Luft. Der Kommentar in
    `Hero.tsx` ("CtaPill bleibt `w-full`, weil sie den Knopf nicht berührt")
    hält der Messung stand, aber mit wenig Reserve. Wer die Pille höher macht
    oder den Knopf vergrößert, verliert das ohne Vorwarnung.
- STAND DER HAKEN NACH RUNDE 10:
  · G3 "Drei Kritiker sagen PASS" ist gehakt. Drei unabhängige Instanzen haben
    PASS gesagt: Look-Review, Abschlussreview `task_a465eeb0ddaf` und der
    Gegencheck dieser Runde. Zwei sagten FAIL (Technik-Review,
    A7-Abschlussreview); beide sind aufgearbeitet. Die volle Zählung mit ihrer
    Einschränkung steht an der Gate-Zeile selbst.
  · A7 "opus-critic + sol-critic + visual-kritiker" bleibt ungehakt. Die Sache
    ist abgenommen, die wörtliche Bedingung — dieses Dreier-Panel — ist nicht
    gelaufen. Begründung steht an der Zeile selbst.
  · A1 "Shell-Padding symmetrisch" bleibt unverändert offen. Das ist eine
    Design-Entscheidung Raphaels, keine Messung, und wurde in RUNDE 10 nicht
    angefasst.
- NICHT GEGENSTAND von RUNDE 10, weiterhin offen: S2-1 (`missing:[7904]`,
  nicht reproduzierbar, Pfad benannt), Bewegung und Reveal-Verhalten (A3, an
  Standbildern nicht beurteilbar), die inhaltliche Beurteilung der sechs
  unveränderten PNGs (bytegleich, das PASS der Vorrunde trägt weiter).

### RUNDE 11 (R193) — Panel-Anlauf, und ein Beleg-Fehler aus RUNDE 10 aufgedeckt
- ANLASS: A7 verlangt wörtlich `opus-critic + sol-critic + visual-kritiker`.
  RUNDE 10 lief mit zwei Prüfern. Diese Runde hat das Panel angesetzt.
- DER LETZTE SATZ VON RUNDE 10 WAR FALSCH, und das ist der wichtigste Befund
  dieser Runde. Dort steht, die sechs unveränderten PNGs seien "bytegleich, das
  PASS der Vorrunde trägt weiter". Bytegleich waren sie — aktuell nicht.
  Befund von sol-critic (Transport-Lane, siehe unten), hier je Einzelbild
  nachgeprüft statt übernommen:
    `for f in worklog/shots/R191-a7/*.png; do find src -newer "$f"; done`
  Sechs der acht Bilder waren ÄLTER als `src/public/home/Hero.tsx` (mtime
  21:06). Nur die zwei in RUNDE 10 erneuerten Fold-Shots (23:56) waren aktuell.
- WIE DER FEHLER ENTSTAND, benannt statt verwischt: RUNDE 10 belegte die
  Aktualität mit `find src -newer` gegen den JÜNGSTEN Shot und verallgemeinerte
  das auf alle acht. Ich habe zu Beginn dieser Session denselben Test genauso
  gefahren und denselben Schluss gezogen. Der Test ist nur gültig, wenn er
  gegen JEDES Bild einzeln läuft.
- WARUM ES INHALTLICH ZÄHLT: der uncommittete `Hero.tsx`-Diff ändert die
  A5-Abstände auf ALLEN Breiten, nicht nur mobil — `sm:mt-7` → `sm:mt-10` am
  Lead, `mt-8` → `mt-10` am CTA-Container. Die sechs alten Bilder zeigten den
  Zustand vor diesem Fix. Zwei Kritiker hatten an diesem Material bereits
  FAIL geurteilt; beide Urteile stehen damit auf teils veraltetem Beleg.
- BEHOBEN: alle acht PNGs neu erzeugt über den kanonischen Weg
  (`/tmp/r191-a7-shots.cjs`), mit EINER Korrektur — die Maus fährt nach dem
  Cookie-Klick auf (2,2). Vorher blieb der Zeiger auf dem Sekundär-CTA stehen,
  wodurch ein Bild im Hover stand und das andere nicht (NOTIZ A aus RUNDE 10,
  von sol-critic als Messbefund bestätigt: durchgehender roter Lauf y756,
  x88..247 auf dem 360er Bild).
- NACHHER BELEGT, je Einzelbild: `find src -newer <png>` = 0 Treffer für alle
  acht. Fünf Bilder haben sich geändert, drei kamen byte-identisch zurück
  (Desktop-Fold, Mobil-390-Fold, Tablet-Fold).
- DIE DREI BYTE-IDENTISCHEN SIND KEIN WIDERSPRUCH, gemessen statt vermutet
  (H1-Unterkante → Lead-Oberkante, vier Breiten):
    mobil-390 36 px · mobil-360 36 px · tablet-768 40 px · desktop-1440 40 px
  Das sind exakt die A5-Zielwerte. Der Fix wirkt auf Desktop, stand dort aber
  schon im alten Bild — deshalb identische Pixel. Die Reproduzierbarkeit ist
  damit zugleich belegt: der Capture-Weg rauscht nicht.
- TECHNIK-GATES dieser Runde, alle selbst gefahren:
    `r190-layout-audit.cjs --gate`      EXIT:0
    `r190-section-rhythm.cjs`           EXIT:0
    `r189-whatsapp-collisions.cjs`      EXIT:0 — 24 Kombinationen,
      `hits`/`restingHits`/`drifted`/`missing` alle leer. Auch S2-1
      (`missing:[7904]`) trat in diesem Lauf nicht auf.
    `npm run typecheck`                 EXIT:0
- PANEL-ANLAUF 1 (an den ALTEN Bildern, Urteile daher nur eingeschränkt gültig):
  · opus-critic FAIL. Größte Lücke: rechte Kante Hero gegen Sektionen.
  · visual-kritiker FAIL. Gleiche größte Lücke, unabhängig gefunden.
  · sol-critic BLOCKED — Codex-Lane dreimal `429 Too Many Requests`. Der Agent
    hat korrekt KEIN Urteil erfunden und stattdessen Messbelege geliefert.
    Genau aus diesen Belegen stammt der Beleg-Fehler oben.
  Das Dreier-Panel ist damit NICHT zustande gekommen.
- DIE GEMEINSAME GRÖSSTE LÜCKE BEIDER FAILS IST GATE A1, nachgemessen und
  eingeordnet statt übernommen. Beide benennen die rechte Kante: Hero steht
  weiter außen als die Folgesektionen. Eigene Messung über `main > *`,
  drei Breiten:
    Hero  #0    desktop inner[52..692]   tablet [32..736]  mobil [20..370]
    #1..#9      desktop inner[52..1332]  tablet [32..680]  mobil [20..330]
  Die neun Folgesektionen sind untereinander EXAKT identisch — es gibt keinen
  Rhythmusbruch zwischen ihnen. Die Differenz zum Hero ist genau
  `--wa-corner` (88 px Desktop, 60 px mobil), also die WhatsApp-Reserve.
  Das ist A1: von Raphael als FAIL gesetzt, Fix ausdrücklich gesperrt.
  Kein Produktfix in dieser Runde.
- OFFEN, ausdrücklich als Reichweite notiert: beide Kritiker melden von sich
  aus, dass die acht Bilder nur Fold und Kurse-Übergang zeigen. Sechs von zehn
  Sektionen stehen auf keinem Bild. Ein PASS auf dieser Bildmenge trägt
  weniger, als die Formel "drei Kritiker sagen PASS" verspricht. Wer A7
  abschließt, sollte die Bildmenge erweitern oder die Einschränkung mitschreiben.
- PANEL-ANLAUF 2, an den FRISCHEN Bildern, mit ausdrücklichem Hinweis an alle
  drei, das alte FAIL nicht zu übernehmen:
  · opus-critic FAIL · visual-kritiker FAIL · sol-critic BLOCKED.
  Sol-Lane erneut dreimal `429` über rund zehn Minuten (Belege: run-997.cPvBlA,
  run-997.xxiISc, run-997.SiMENG; kein Exit 2, also Ratenbremse, kein
  Login-Problem). Auch der zweite Anlauf hat KEIN Dreier-Panel ergeben.

- NEUER BEFUND, und diesmal NICHT von A1 gedeckt — `lg:pr-36` an der
  Kurs-Kartenliste. Beide urteilenden Kritiker haben ihn unabhängig gefunden,
  mit übereinstimmenden Zahlen, und beide grenzen ihn selbst gegen A1 ab.
  Eigene Gegenmessung (`#kurse`, rechte Kanten, Ruhezustand):
    Reiterleiste / Datumszeile   desktop-1440 [52..1332]
    Kartenliste (Inhalt)         desktop-1440 [52..1188]  padding-right 144 px
    dasselbe auf 1280            [32..1192] gegen [32..1048]
  Das sind 144 px INNERHALB einer Sektion, zusätzlich zu den 88 px der Shell.
  A1 ist die 88er-Differenz zwischen Hero und Folgesektionen; dieser Befund ist
  eine zweite, andere Kante. Die Sperre deckt ihn nicht.
  GREIFT NUR AB `lg`: auf 768 und 390 gemessen keine Reserve, Kante = Shell.
- DIE RESERVE HAT EINEN ZWECK, aber die Grösse ist nicht belegt. Die Liste
  enthält `CourseRow`-Zeilen, also klickbare Bedienelemente — anders als reiner
  Text braucht sie Abstand zum Knopf. Gemessen wurde, wie viel:
    Reserve 144 px (heute)   Zeilen enden 1187 · Luft zum Knopf 173 px
    Reserve  88 px           Zeilen enden 1243 · Luft zum Knopf 117 px
    keine Reserve            Zeilen enden 1332 · Luft zum Knopf  28 px
  Auf 1280 und 1024 entsprechend 153 / 97 / 8 px. Der Knopf steht in BEIDEN
  Zuständen als Kreis (56 px, gemessen bei 250 ms und bei 2500 ms) — die Pille
  erscheint hier nicht, weil `compact` gesetzt ist.
  `--wa-corner` (88 px) wäre also tragfähig und würde die Sektion auf EINE
  rechte Kante bringen. 144 px sind rund 56 px mehr, als der Knopf beansprucht.
- NICHT GEBAUT, bewusst: der Auftrag dieser Runde ist A7 zu schliessen, nicht
  ein neues Layout-Item zu öffnen. Der Befund ist gemessen, die Zahlen liegen
  vor, der Fix wäre eine Zeile (`lg:pr-36` → `lg:pr-[var(--wa-corner)]` an
  `ScheduleTeaser.tsx:340`). Er berührt aber auch `:152` und `:256`, die
  denselben Wert aus anderem Grund tragen (Knopf "Zum ganzen Kursplan" bei
  x=1206..1388, Tages-Grid gegen den FAB). Wer das anfasst, misst alle drei
  Stellen neu. Entscheidung liegt bei Raphael.
- KORREKTUR AN EINEM PRÜFER-BEFUND, nachgemessen statt übernommen: die
  Sol-Stimme meldet "alle acht md5 verschieden — die drei byte-identischen
  Bilder sind weg". Das trifft nicht zu. `md5sum -c` gegen den Vorher-Stand
  meldet weiterhin 3× OK. Die Stimme hat die acht Bilder UNTEREINANDER
  verglichen (dort sind sie erwartungsgemäss alle verschieden), nicht gegen den
  Stand vor dem Reshoot. Zwei verschiedene Fragen.
- STAND VON A7 NACH RUNDE 11: weiterhin ungehakt, und der Grund hat sich
  verschoben. Nach RUNDE 10 fehlte nur die Besetzung. Jetzt liegt zusätzlich
  ein unabhängig doppelt bestätigter Layout-Befund vor, der nicht von einer
  Raphael-Entscheidung gedeckt ist. A7 ist damit nicht "fast zu", sondern
  sachlich offen.
- REICHWEITE, von beiden Kritikern selbst genannt: die acht Bilder zeigen nur
  Fold und Kursblock. Angebot, Bewertungen, Events, Team, Preise, FAQ, Standort,
  Instagram und Footer stehen auf keinem Bild, ebenso wenig Hover, offenes Menü,
  Sprachumschaltung und jede Bewegung. Ein PASS auf dieser Bildmenge belegt
  weniger, als die Gate-Formel verspricht.
- Kein Push, kein Produktcode, Production unberührt.
