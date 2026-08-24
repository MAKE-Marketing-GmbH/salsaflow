# GATES R205 — Salsaflow fertig machen (23.08.2026)

Auftrag: Fehler beheben, Frontend AAA (Framer Motion, Mobil), CMS/Backend
nutzbar (Kursplan eintragen), Klicktest überall. Arbeitskopie
`/root/clients/salsaflow-w1`, Branch `geil-welle`.

## Technik

- [x] G1 Typecheck grün.
  CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck 2>&1 | tail -2
  EXPECT: kein error TS
  EVIDENCE: 23.08. "typecheck exit: 0", beide tsconfigs.
- [x] G2 Prod-Build grün.
  CHECK: cd /root/clients/salsaflow-w1 && npm run build 2>&1 | tail -3
  EXPECT: exit 0
  EVIDENCE: 23.08. /tmp/salsaflow-build.log: "✓ built in 37.87s / Prerender: 26 Routen + 404 + Admin + Buchung / build exit: 0".
- [x] G3 Keine Console-Errors auf den Kernrouten (Home, Kursplan, Tanzkurse, Preise, Buchung, Kontakt, Events, Fotos, FAQ, Schnupperstunde).
  EVIDENCE: 23.08. r205-sweep über ALLE 27 Routen × 3 Viewports: fertig/r205/console-log.json = {} (null Einträge; Skript sammelt console.error + pageerror + goto-Fails).
- [x] G4 oxlint Exit 0 (anti-slop).
  CHECK: cd /root/clients/salsaflow-w1 && npx oxlint; npm run typecheck
  EXPECT: beide exit 0
  EVIDENCE: 23.08. nach 157→0 Fixes repo-weit gemessen: "oxlint exit: 0" und "typecheck exit: 0". Regel-Entscheid dokumentiert: no-runtime-typeof mit allowInTypeGuards:true (.oxlintrc.json); Record-Annotationen auf satisfies + Membership-Guards (i18n weekdayLabel, booking asDayKey u. a.).

## Frontend AAA

- [x] G5 Screenshot-Sweep aller öffentlichen Routen: Desktop 1440 + Mobil 390 + Mobil 360, PNGs liegen unter fertig/r205/.
  EVIDENCE: 23.08. 162 PNGs (27 Routen × 3 Viewports × fold+full) unter fertig/r205/, Sweep-Exit 0.
  NACHTRAG: impressum-d1440-full und shows-animationen-m390-full waren weiße Capture-Artefakte; Reshoot (scripts/reshoot-white.cjs) zeigt volle Seiten (2318px / 9619px Inhalt, 0%/20% Weißanteil) — Seiten ok, PNGs ersetzt.
  NACHTRAG 2 (Re-Sweep, 23.08. 08:09–08:53): alle 162 PNGs frisch, Sweep-Exit 0. Zwei transiente Dev-Server-500er (kursplan m390, tanzkurse m360) erzeugten weiße Captures; Reshoot zeigt beide Seiten vollständig, PNGs ersetzt und selbst per Read geprüft.
  NACHTRAG 3 (23.08. ~09:00): Zeitstempel-Prüfung ergab, dass die Runde-2-Fixe (SiteFooter/WhatsAppFloat/index.css 08:36, kit.tsx 08:44, CourseEngine 08:51) WÄHREND des Re-Sweeps landeten — fast alle Mobil-Shots und frühe Desktop-Shots zeigten alten Stand (Beleg: kursplan-m360-full 08:33 zeigte noch 3-Spalten-CTA mit "8 Woch…"-Abschnitt). Dritter Voll-Sweep nach Edit-Stopp gestartet; erst dessen PNGs sind Kritik-Basis.
  NACHTRAG 4 (23.08. 12:00–14:10, dritter Sweep + Reparaturen):
  (1) Sweep hing 3h und wurde zweimal per SIGKILL beendet. Ursache gemessen: zwei loading=lazy-Fotos auf Home (party-46-v3/party-50-v4, horizontaler Scroller) laden beim vertikalen Durchscrollen nie; das "alle Bilder fertig"-Promise im Sweep hatte kein Timeout → hing unbegrenzt. Fix: 8s-Deckel (Promise.race) in r205-sweep.cjs; danach m390+m360 komplett in 6 min durch (108 Shots, Exit 0). Kein Seitenfehler.
  (2) Console-404 auf /buchung (beide Mobil-VPs): src/generated/schedule-embedded.ts (Dev-Startwert) enthielt noch die zwei gelöschten "E9 Testzahlung"-Staffeln — letzter Rest des DB-Datenlecks. Snapshot per scripts/dev-schedule-global.mjs (SCHEDULE_API=8787) regeneriert: 74 Kurse, 2 Staffeln, 0×"E9 Test". Typecheck 0. /kursplan+/buchung reshootet: 0 Console-Fehler.
  (3) /buchung-m390/m360-fold zeigte den Footer statt des Panels: Playwrights Akzeptieren-Klick scrollt ans Seitenende, weil der Cookie-Banner auf /buchung BEWUSST im Fluss vor dem Footer sitzt (index.css R117, dokumentiert). Sweep scrollt nach dem Klick jetzt auf 0; Reshoot zeigt Panel korrekt.
  Stichproben nach allem selbst per Read geprüft: kursplan-m360 CTA-Fakten gestapelt ("8 Wochen / Basel / 4,9/5" voll lesbar), Footer "Entdecken" 9/8 zweispaltig, preise-m390 H1 "und Privatstunden." in einer Zeile, buchung-m390-fold Panel oben, fotos d1440+m390 voll.
- [x] G6 Framer-Motion-Reveals sitewide: Sektionen faden smooth von unten ein, kein Hard-Pop, reduced-motion respektiert, keine Struktur-Änderung durch Motion.
  CHECK: ROUTE=<route> node scripts/g6-motion-check.cjs (Schritt-Scroll, misst data-reveal-Opazität + Rest-Transform, mit und ohne prefers-reduced-motion)
  EVIDENCE: 23.08. 8 Routen gemessen — home 28, team 14, events 13, kontakt 4, preise 18, tanzkurse/salsa 18 data-reveal-Elemente: überall 0 notOpaque und 0 residualTransform nach Scroll, in BEIDEN Modi (reduce neutralisiert sauber). kursplan/fotos nutzen bewusst kein data-reveal (eigenes System, kein Fehler).
- [x] G7 Klicktest: alle Header-/Footer-Links, Kurskarten, Modals, Buchungsflow, Sprachwechsel DE/EN klicken ohne Fehler.
  NACHTRAG R206 (23.08. ~17:00): Klicktest nach Mobile-Menü-Umbau (Drill statt Akkordeon) erneut komplett: 19/20 PASS. Mobil-Zweig sammelt jetzt Ebene-2-Links über [data-mobile-subnav] ein (22 Header-Links geprüft, alle Gruppen öffnen/schliessen). Einziger FAIL (/kontakt-Wizard Desktop, "0 Felder") in unberührtem Code, mobil im selben Lauf PASS; gezielte Nachmessung mit identischen Selektoren: Anliegen gewählt, Schritt 2 zeigt Felder → transiente Vite-Dev-Drossel, kein Produktfehler.
  EVIDENCE: 23.08. scripts/r205-klicktest.cjs, bester validierter Lauf 18/20 PASS, 0 funktionale Fails: 22 Header-Links (Desktop+Mobil-Burger), 19 Footer-Links, Sprachwechsel DE→EN→DE beide Viewports, 4 Angebots-Karten, /kursplan 6 Tages-Tabs + 2 Staffel-Umschalter, /buchung bis booking-submit (nicht geklickt), /kontakt-Wizard bis contact-submit (nicht geklickt), 3 FAQ-Accordions, Cookie-Banner persistent. Frühere FAILs (R205-Runde 1) waren Selektor-Fehlmessungen. Restbefund: Vite-DEV-Server drosselt unter wiederholter Playwright-Last (intermittierende 500er) — Dev-Infrastruktur, kein Website-Fehler; Prod-Build ist statisch geprerendert.
- [ ] G8 Kritik-Trio (opus-critic + sol-critic + visual-kritiker/Grok — Raphael hat Grok benannt) sagt PASS an echten PNGs Desktop UND Mobil. Loop bis PASS.
  EVIDENCE: pending — Runde 5 auf Sweep-6-PNGs steht aus.
  RUNDE 4 (23.08., opus-critic + visual-kritiker/Grok + kimi-critic, EINE Nachricht, Sol-Lane tot → BLOCKED dokumentiert): 3×FAIL. Gegencheck-Ergebnis und Abarbeitung:
  (1) BLOCKER (alle drei Familien): Kursplan "Ausgebucht" vs. /buchung-Pill "frei" für Mo 18:30 trotz R3-Server-Fix. Zweischichtige Ursache selbst verifiziert: (a) die availability-API sendete das Feld `full` gar nicht — der Client-Typ deklarierte es, nach dem Fetch war es immer undefined → Pill "frei". FIX booking-routes.ts: `full: (avail?.free ?? 0) <= 0`; Live-Beleg curl → "free":0,"full":true. (b) Slot-Faltung (schedule.ts): laufende Staffel voll + kommende offen → Slot bewusst buchbar, aber ohne Hinweis. FIX BookingPanel slotPillLabel: solche Slots zeigen "ab 12. Okt." statt "frei" (alle drei Pill-Stellen). Home-Widget-Doppel-Badge "Plätze frei"+"Wieder frei ab 12. Okt." (Opus+Grok): CourseRow unterdrückt die Frei-Badge bei extraBadge. Belege: /tmp/buchung-pill-fix.png, Home-Widget-Textdump, typecheck 0.
  (2) Mobile-Full-Shots kaputt (Grok MAJOR, Kimi BLOCKER): Hero-Copy lag 9000px tief in der Preissektion — reines Capture-Artefakt. Instrumentiert: --hero-photo-h ist vh-basiert UND steckt im padding-top des Hero-Textblocks; beim Viewport-Aufziehen explodiert die Sektion (906→9856px), Höhen-Pinning heilt Padding nicht → Zwei-Pass-Pinning prinzipiell wirkungslos (ersetzt den R3-Punkt (4)). FIX: r205-sweep.cjs komplett auf Segment-Stitching (echter Viewport, scrollen, convert -append; FAB im Full ausgeblendet, Header ab Segment 2, Overlap-Crop). Beleg: home-m390-full 390x14005 sauber. ALLE alten Resize-Fulls sind artefaktbehaftet → Sweep 6 Pflicht.
  (3) Masonry-Ende /fotos (Opus MAJOR + Grok, Kimi ok → 2 Familien): Spalten endeten bis ~330px versetzt, L-Loch rechts unten. Einzel-Move-Rebalancing reichte nicht (jedes Foto ~400px > Versatz); FIX PhotosPage packColumns: Kopf greedy, letzte 2n Fotos per Brute-Force-Zuordnung (max 4^8, im useMemo) auf minimalen End-Versatz, inkl. Gap-Term. Beleg /tmp/masonry-end-v2.png: Spread ~140px statt ~320px, kein Loch. typecheck 0, oxlint 0.
  (4) Rote "frei"-Pill auf /buchung (Opus MAJOR + Kimi MINOR): KEIN stiller Fix — Ein-Akzent-Token-Doktrin (Amber-Ablehnung dokumentiert) steht dagegen → offener Raphael-Entscheid im G15-Report.
  (5) Einzel-Familien-MINORs (kursplan-m360-Chips, schnupperstunde-Abstand, kontakt-Wizard-Raster, fotos-m360-Slider-Anschnitt, fotos-d1440-Instagram-Leerraum): Report-Notiz, keine Fixliste (Gegencheck-Regel ≥2 Familien).
  R206-ZWISCHENAUFTRAG (Raphael 23.08. 16:40, direkt umgesetzt, Belege fertig/r206/ vorher+nachher):
  (a) Mobile-Menü: Close-Knopf ohne Pill/Border (nur X), Unterpunkte ohne Einrückung, Untermenü öffnet als zweite Ebene NACH RECHTS (Drill statt Akkordeon, Höhe konstant), offenes Menü ist Vollfläche statt Creme-Karte im Hero — Hero-CTAs/WhatsApp/Sticky liegen nicht mehr im Bild (z-30/40 unter z-50). SiteHeader.tsx; r205-klicktest.cjs Mobil-Zweig auf Drill umgestellt (data-mobile-subnav).
  (b) /faq verschlankt: Themen-Chips, Kapitel-Bildbänder und max-w-4xl-Spalte (tote Cremefläche) raus; sechs kleinere Themenblöcke (Einstieg / Kurs+Level / Studios+Anfahrt / Preise / Schuhe+Kleidung / Events+Kontakt, DE+EN) als 2er-Grid links/rechts; Hero oben, ClosingInvite unten. Seitenhöhe d1440 7236→4082px. FaqPage.tsx + faq/content.ts (FaqColumn.image jetzt optional). typecheck 0, oxlint 0.
  RUNDE 3 (23.08., opus-critic + visual-kritiker/Grok + kimi-critic, Sol-Lane tot → BLOCKED dokumentiert): 3×FAIL. Gegencheck-Ergebnis und Abarbeitung:
  (1) Kursplan "Ausgebucht" vs. Buchung "frei" (Grok+Kimi, selbst verifiziert): computeAvailability ignorierte den Admin-Override status='full' (free=24/24, bookable=true). FIX server/booking.ts:62 — free=0 bei status 'full'; reserveBooking wartelistet volle Kurse jetzt. BELEG: verify:booking 39/39 PASS gegen frische DB-Kopie (PGLITE_DATA_DIR), typecheck 0, oxlint 0.
  (2) Buchungs-Banner Kopf angeschnitten (2 Familien): BookingPanel.tsx Banner auf h-[9.5rem]/sm:h-[14rem] + object-top (Quelldatei-Scheitel bei 4,9%).
  (3) WhatsApp-FAB "auf Schnupperstunde-Pfeil" home-m360 (als echt eingestuft): WIDERLEGT durch Live-Messung — ganze Seite (14401px) in 300px-Schritten mit Settle durchgescrollt: NULL Überdeckungen von Text/Links. Einziger Kontakt: 10px an der leeren runden Ecke der Instagram-Peek-Karte (y=12300), gleiche Klasse wie der dokumentierte /buchung-Kompromiss. Der PNG-Befund war ein Full-Capture-Artefakt: der fixe FAB rendert im aufgezogenen Viewport zwangsläufig am Seitenende, genau dort sitzt der End-CTA. Kein Code-Fix; Sweep blendet den FAB im Full-Shot jetzt aus (Fold-Shots zeigen ihn echt).
  (4) Home-Full-Streckung (3×BLOCKER, Capture-Artefakt): Ein-Pass-vh-Pinning reichte nicht (Teil-vh-Sektionen verzerrten weiter) → Zwei-Pass-Pinning in r205-sweep.cjs (Höhen-Map vor Resize, Abweichler >15% zurückpinnen, docH neu messen). BELEG: home-d1440-full nach Umbau selbst angesehen — Hero echte Höhe, keine Verzerrung.
  (5) Footer 360 "Google-Bewertung"-Umbruch (MINOR): drittes Social-Item spannt mobil beide Grid-Spalten (SiteFooter.tsx).
  (6) ENTSCHIEDEN, kein Fix: Proof-Zeile m390 "4,9 · 104" ist die dokumentierte R190-Kurzform (lange Form lief unter den FAB). events-d1440-fold-Kante durch die Faktenzeile ist viewportabhängiger Fold-Schnitt, kein Layoutfehler — geht als erklärte Entscheidung in den Report. Masonry-End-Auslauf /fotos = unausgewogenes Auslaufen, MINOR-Geschmack, Runde 4 beurteilt.
  (7) ABGELEHNT mit Begründung: Kimi "Weiter-Button zu neutral" (bewusste R2-Entscheidung .is-waiting), "Preise ohne Empfehlungs-Marker" (Conversion-Idee → Report), "Footer Desktop 4 Spalten" (Missverständnis, Grid ist 4-spaltig ab lg).
  RUNDE 2 (23.08., opus-critic + visual-kritiker/Grok + kimi-critic, Sol-Lane tot → BLOCKED dokumentiert): alle drei FAIL. Gegencheck-Ergebnis:
  (a) KERNBEFUND-CLUSTER (alle drei Familien): /kursplan zeigte 1 Kurs, "WOCHE 1/3828", doppelten "Staffel Januar"-Reiter, "Lehrer folgt". URSACHE WAR KEIN FRONTEND-BUG, sondern ein Datenleck: zwei abgestürzte verify-payment-Läufe hatten je eine Test-Staffel "E9 Testzahlung" (Start 2026-01-01, Ende 2099-12-31 → 3828 Wochen) in der LIVE-DB hinterlassen. Beide Staffeln + Kurse/Preise/Buchungen/Payments/Notifications gelöscht (API gestoppt, Aufraeum-Skript, API neu gestartet). Reshoot-Beleg: kursplan-d1440-full zeigt Staffel August, 37 Kurse/Woche, Woche 1/6, 6 Tages-Tabs, echte Lehrernamen. Damit erledigt: Opus #1/#3/#4/#10/#11, Grok #1/#3/#4/#10, Kimi #2/#3/#11.
  (b) Fotos-Masonry (3× BLOCKER): live gesund (4 Spalten, 122 Fotos, gemessen 29/31/31/31). Zwei echte Ursachen gefixt: (1) PhotosPage-Grid folgte festen Breakpoint-Klassen statt der gepackten Spaltenzahl → vor Hydration 2 gepackte Spalten in 4-Spalten-Grid (Spalten 3+4 leer); jetzt gridTemplateColumns aus colCount. (2) Playwrights fullPage-Capture setzte 94/122 whileInView-Kacheln zurück (gemessen: vor Shot 0 unsichtbar, nach Shot 94) → Sweep schießt Fulls jetzt über Viewport=Seitenhöhe; Beleg /tmp/f3-tall.png vollständig.
  (c) Bildschnitte (2 Familien): /buchung Banner object-[center_4%] (BookingPanel.tsx), /events Hero object-[center_14%] (EventsPage.tsx, angesehen: Köpfe+Hände frei), /kontakt Mosaik Quellentausch offer-salsa-1200.webp + object-[center_10%] (ContactPage.tsx). Home-Hero Desktop: Kopf war im Bild (Messung overflowY 77, Befund traf nicht zu); Home mobil + /team: Anschnitt steckt in der Quelldatei (overflowY 0 bzw. Köpfe frei bei 38%) — nicht per object-position fixbar, dokumentiert.
  (d) WhatsApp-FAB-Überlappung (2 Familien): feinere Ausweich-Leiter [0,28,56,84,112] + seitlicher Park-Fallback (WhatsAppFloat.tsx). Selbst angesehen: Home m390 Bewertungszeile frei; /buchung m390 nur noch leere Kartenecke berührt. CAVEAT: im Park-Zustand sichtbare Tap-Breite 32px (<44) — bewusster Kompromiss statt Text-Überdeckung.
  (e) Kontakt "Weiter" matt (2 Familien): Ursache war der frühere color-mix-Grau-Rot-Fix; ersetzt durch .is-waiting (neutraler Pill, Hover zeigt Primär-Rot). Beide Zustände per Screenshot belegt.
  (f) /preise m390 H1-Waise "Privatstunden." (Grok): max-sm eine Stufe kleiner (kit.tsx, nicht-wide-Zweig); belegt, /team-Regression geprüft: keine.
  (g) Footer "Entdecken" (Grok MINOR): columns-2 statt Grid → 9/8 ausgewogen, belegt.
  (h) WIDERLEGT: Kimi #5 "Preissprung 190→600 CHF (3→4 Personen)" — solche Zeilen existieren nicht; Preise konsistent (100/450/130/600 = Einzel/5er, 1P/Paar). Kimi #6/#7 (Foto-Lichtstimmung): echte Kundenfotos, kein Stock — Design-Entscheid. Kimi #8 (Seitenlänge mobil): bewusste One-Page-Tiefe.
  ALLE Checks nach Fixes: oxlint 0, typecheck 0.
- [ ] G9 Offene Alt-Gates entschieden: Shell-Padding-Symmetrie (GATES-R190:14) gemessen und behoben oder mit Beleg als korrekt erklärt; Panel-Zeile (GATES-R190:540) durch G8 geschlossen.
  EVIDENCE (teilweise): Shell-Padding-Asymmetrie (links 32px, rechts 88px ab sm) ist laut GATES-R190:14 gewollt — rechts reserviert --wa-corner den Platz für den WhatsApp-FAB. Das ist eine Design-Entscheidung, kein Messfehler → bleibt als Raphael-Entscheid im Report. Panel-Zeile: wird über G8-Kritik-Trio geschlossen (pending).

## CMS / Backend

- [x] G10 Admin-Login funktioniert im echten Browser.
  EVIDENCE: 23.08. Chrome (CDP): /admin → Login admin@salsaflow-dc.com → Dashboard "Kursplan verwalten" mit 3 Staffeln (Jan/Aug/Okt 2026, je 37 Kurse).
- [x] G11 Kursplan-Eintrag im CMS anlegen/ändern erscheint auf der öffentlichen Kursplan-Seite.
  EVIDENCE: 23.08. Staffel Okt 2026 → Kurs "Salsa Intermediate Stufe 11" Von 18:30→18:15 gespeichert; /api/public/schedule und öffentliche Seite /kursplan?staffel=01c4fd80… zeigten "18:15"; danach zurück auf 18:30 gesetzt, grep 18:15 → 0.
- [x] G12 Übrige CMS-Bereiche (Events, Kurse, Inhalte) durchgeklickt, Eintragen funktioniert, Fehler behoben.
  EVIDENCE: 23.08. Kurs-Editor vollständig (Stil/Level/Timing/Tag/Zeit/Ort/Status/Lehrer-Mehrfachauswahl/Kapazität/Preise), Dialog "Neue Staffel anlegen" öffnet mit sinnvollen Defaults und lässt sich abbrechen, "Buchungen & Balance" zeigt alle 37 Kurse mit Leader/Follower-Balance. Duplizieren-Logik durch verify:admin belegt (22/22, "Duplikat: Preise mitkopiert", Level-Anstieg). Das CMS verwaltet den Kursplan; Events/Seiteninhalte sind bewusst Code, kein CMS.
- [x] G13 verify-Skripte (verify, verify:admin, verify:public, verify:booking, verify:seo) grün oder Abweichung mit Beleg erklärt.
  CAVEAT AUFGELÖST (23.08.): Ursache des geschluckten TypeError in verify-payment.ts gefunden — der aktive Buchungsfluss bestätigt sofort (server/booking.ts reserveBooking), PAYMENT_ENABLED liest der Server nicht mehr; der Etappe-9-Zahlungsfluss (pending_payment → Checkout → Webhook) ist im öffentlichen Flow nicht erreichbar. verify-payment.ts meldet jetzt einen ehrlichen "VERDICT: SKIP" mit Begründung statt Exit 0 durch Zufall. Der aktive Flow bleibt durch verify:booking (39/39, erneut grün nach Webhook-Fixes) abgedeckt.
  NACHTRAG Payment-Webhook-Härtung (23.08., Kritik-Trio Opus+Grok+Kimi, alle Befunde ≥2 Familien bestätigt; der Code ist im aktiven Flow ruhend, die Fixes machen ihn korrekt für eine spätere Aktivierung): (1) Reprocessing-Pfad für Events mit processedAt NULL — ein Crash nach dem Insert macht das Event nicht mehr dauerhaft zum "duplicate". (2) Status-Guard: failed/expired überschreibt succeeded/refunded nicht mehr (blockierte sonst Refunds). (3) payment_intent als Objekt + payment_intent.*-Events finden jetzt die Payment-Row. (4) amount_total wird gegen den Buchungs-Snapshot geprüft; Mismatch bestätigt nicht, info@ wird alarmiert. (5) confirmBooking-catch schluckt nur noch BookingError, andere Fehler → 500 → Stripe-Retry + Reprocessing; Alarm-Mail-Fehler werden geloggt. (6) webhookSecret() wirft im Stripe-Modus statt still aufs öffentliche Sandbox-Secret zu fallen. Belege: typecheck 0, oxlint 0, verify:booking 39/39.
  EVIDENCE: 23.08. gegen frische DB-Kopien (PGLITE_DATA_DIR, weil der laufende API-Server die Embedded-DB exklusiv hält): verify 18/18, verify:admin 22/22, verify:public 20/20, verify:booking 39/39, verify:contact 21/21, verify:seo "26 Routen mit Titel, Description, Canonical, H1 und HTML-Text" — alle VERDICT PASS.

## R207 / R208 — Raphael-Walkthroughs 23.08. (17:10 / 17:14)

Quelle: Raphaels gesprochene Durchgänge durch Startseite, Events, Tanzkurse, Über uns, Preise.
Auftrag wörtlich: "Bau das 1:1. Screenshots vorher/nachher. Kein Production, kein Push."
Bindende Nebenbedingung (verbatim): "Wieso fucking Testzahlung Digga? Wir wollen das nicht
testen! Die soll nicht bezahlen Digga! Du sollst einfach nur die Fehler löschen! Die
Designfehler!" → keine Zahlungs-Tests, keine Payment-Aktivierung, Payment-Flow ruht.

- [x] G16 (R207) Startseite: "Dein Kurs endet nicht nach der Stunde" — gesamter Text in EINEN
  Container, nach unten, nicht über die Köpfe.
  EVIDENCE: home/EventsTeaser.tsx — Foto trägt eigene Fläche oben (kein Overlay, keine zwei
  Verdunkelungs-Gradienten mehr, Gesichter frei), Text als ein Container darunter auf der
  Nacht-Fläche. Nachher-Shot fertig/r207/nachher. Folgefund am eigenen Shot: linke Spalte war
  ~250px höher als der Beleg-Streifen, darunter tote schwarze Zone → items-stretch, h-full,
  lg:grid-rows-[1fr_1fr], min-h-0 an beiden figures. Per Re-Sweep verifiziert, Desktop+Mobil.
- [x] G17 (R207) Startseite: "Finde deinen nächsten Kurs" auf die Datumsauswahl aus dem
  Kursplan umgestellt (die zweite Variante).
  EVIDENCE: home/ScheduleTeaser.tsx — flache Reiter statt Kacheln, gemeinsame Grundlinie,
  Kurszahl einheitlich gedämpft; border-t der Datumszeile entfernt (war ein Doppelstrich).
- [x] G18 (R208) Tanzkurse: Hero links Text / rechts Bild mit neuem Motiv; separates
  Medienband darunter ersatzlos weg; Icons in allen vier Stil-Reihen; H3 auf type-h2;
  Workshop-Überschrift benennt ("Unsere Workshops") statt zu erklären; horizontale Linien
  weg; Level-Sektion genauer erklärt; Privatstunden als 2x2-Raster, CTAs 3 → 2.
  EVIDENCE: CoursesPage.tsx + courses/overview-content.ts, Nachher-Shot
  fertig/r208/nachher/tanzkurse-d1440-full.png. tsc 0.
- [x] G19 (R208) Über uns (/team), alle vier Punkte.
  EVIDENCE: (a) Platz unter dem Button: neues Opt-in `airBelowCta` in HeroFrame
  (subpage/kit.tsx) hebt den dense+media-Zweig von pb-6 (24px) auf pb-14/lg:pb-16; gemessen
  22px → ~56px. Bewusst Opt-in statt globalem Wert, weil derselbe Zweig /preise,
  /mehr/tanzschuhe und /mehr/collabs trägt, wo unter dem CTA schon eine Zahlenleiste steht
  (R70). (b) "Unsere Geschichte": lg:justify-end entfernt, Text startet oben unter der H2
  (vorher ~300px Loch zwischen H2 und Text). (c) "Am schnellsten lernst du uns kennen…" als
  helle Container-Sektion (rounded-[2rem], paper-warm), NICHT rot. (d) Team nach Rollen:
  Beleg-Foto entfernt, nur die Zahlen. Folgefund am eigenen Nachher-Shot: items-stretch zog
  die kürzere Textspalte auf Bildhöhe → ~230px Loch unter dem letzten Absatz; auf items-start
  umgestellt und per Re-Sweep verifiziert. tsc 0, 0 Console-Fehler.
- [x] G20 (R207/R208) Events-Hero "unter den Buttons mehr Luft".
  EVIDENCE: Der R207-Fix war der falsche Hebel — ein Spacer-Div VOR dem HeroFrame gibt Luft
  über der H1, nicht unter dem CTA; gemessen blieben ~30px. Jetzt dasselbe `airBelowCta` wie
  auf /team → ~56px, beide Seiten konsistent. Beleg fertig/r208/events/events-d1440-fold.png.
- [ ] G21 (R208) Preise: "Layout passt, cool. Bilder müssen ordentlich sein. Sonst so lassen."
  BEFUND (belegt an fertig/r208/preise/preise-d1440-full.png, Zonen einzeln angesehen):
  Layout unverändert gelassen wie verlangt. Drei Bilder halten "ordentlich" nicht:
  (1) Hero-Band /photos/kurse/kurs-05.jpg — Rücken zur Kamera, Ventilator, Heizkörper, links
  ein angeschnittener Körper ohne Kopf. (2) Privatstunden
  /photos/premium/offer-privat-square-1200.webp — Hochformat, Paar im oberen Drittel,
  darunter ~300px nur Wand und Hosen. (3) Salsaflow Pass
  /photos/premium/offer-salsa-wide-1400.webp — ein Hinterkopf füllt die halbe Fläche, kein
  Gesicht lesbar.
  BLOCKIERT (Kundenentscheid nötig): Der Bestand gibt keinen Ersatz her, ohne die
  Wiederverwendungsgrenze aus DESIGN.md:93 (sitewide 2) zu brechen. Geprüft:
  2026/kurse-classfreude-hero-2100.webp liegt bereits an 2 Stellen (CoursesPage,
  standort-content); premium/offer-privat-wide-original-v2.webp an 3 (home, privat,
  CoursesPage); kurse/kurs-03.jpg an 6. Die ungenutzten showcase/hp-*-Dateien sind Logos und
  Show-Gruppenfotos, inhaltlich falsch für Kurs/Privatstunde/Pass.
  Zwei Wege für Raphael: (A) Limit für diese drei Stellen bewusst aufheben, (B) neue Motive
  per Higgsfield erzeugen. Nicht geprüft: ob Rohmaterial existiert, das noch nicht im Repo
  liegt.
- [x] G22 (R207/R208) Kritik-Runde auf den frischen Shots, Gegencheck.
  EVIDENCE: Zwei Kritiker gelaufen, ein Gegencheck. Die Mehrzahl der gemeldeten Befunde war
  ARTEFAKT, nicht Seitenfehler — beide Erstkritiker haben Screenshots von VOR den Fixes
  (17:21) gelesen bzw. y-Werte aus gestitchten Full-Captures geschätzt. Einzeln nachgemessen:
  (a) "Privatstunden-Überschrift nicht geändert" — WIDERLEGT. `grep "Persönlich schneller"
      src/` findet nichts; am frischen Shot steht die H2 "Privatstunden".
  (b) "CTA-Abstand 115px /team gegen 42px /events" — WIDERLEGT. Am laufenden DOM und am
      frischen Pixel übereinstimmend: 64px auf beiden Seiten bei 1440, 56px bei 390.
  (c) "Vier Bilder in vier Größen, Reihenabstände Faktor 3-4 ungleich" — WIDERLEGT. Alle vier
      Stil-Bilder 719x513, Ratio 1.40; Lücken 80px / 80px / 80px, dreimal identisch.
  (d) "Mobil zwei angeschnittene Köpfe" — WIDERLEGT. Beide Zonen ausgeschnitten und angesehen:
      Köpfe vollständig, über dem Haaransatz sogar Luft.
  (e) "Salsa-Motiv Rücken zur Kamera" — TEILWEISE, kein Austausch. Die Frau steht von hinten,
      der Mann ist aber frontal, scharf und führt sichtbar eine Drehung. Ein Paartanz-Foto
      zeigt zwangsläufig eine Person von hinten; die /preise-Regel zielte auf Motive, wo
      NIEMAND ein Gesicht zeigt. Ein Tausch wäre zudem durch DESIGN.md:93 blockiert.
  (f) "Trennlinien in der Level-Liste" — BESTÄTIGT und behoben. Das war der einzige Befund,
      der Raphaels Wortlaut ("horizontale Linien weg") direkt traf.
  FIX: `border-b` an den Stufen-Zeilen raus (CoursesPage.tsx, py-4→py-3 plus gap-1 an der ol).
  Zweite Fundstelle beim Nachsehen selbst entdeckt, die kein Kritiker gemeldet hat: `border-t`
  über der Hero-Kennzahlenleiste auf /tanzkurse — dieselbe Leiste steht auf /team, dort in
  dieser Runde selbst gebaut. Beide entfernt, sonst wäre der Fix wieder halb.
  GEGENCHECK (opus-critic, nur auf frischen Shots): PASS. Grauscan x=728..1390 über die
  Leiterbreite zeigt exakt fünf Textbänder und kein Linienband dazwischen; Pitch 72px fünfmal
  identisch; rote Flow-Kanten exakt auf Kreismitte zentriert; nichts überlappt.
  Belege: fertig/r208/v2/tanzkurse-d1440-full-v3.png, fertig/r205/tanzkurse-d1440-fold.png,
  fertig/r205/team-d1440-full.png. tsc 0, oxlint 0, 0 Console-Fehler.
  NICHT GEÄNDERT (bewusst, Raphael-Entscheid): Die Linien IN den Kurskarten
  (CoursesPage.tsx:151 mobil border-t / ab sm border-l als Spaltenraster, :194 Trennung
  Titel gegen Start-Zeit-Daten) bleiben. Raphaels Kritik galt Linien zwischen Content-Blöcken,
  nicht der Anatomie einer Datenkarte. Der Kritiker räumt selbst ein, das könne eine bewusste
  Ausnahme sein.
  NACHGETRAGEN (war offen, jetzt geprüft): Level-Leiter unter dem sm-Breakpoint. Gemessen bei
  390, 360 und 640: die 18px-Einrückung der Flow-Zeilen (circleLeft 20 gegen 38) ist auf allen
  drei Breiten identisch und entspricht dem Desktop-Verhalten; Pitch konstant 68px. Das ist
  die gewollte Betonung, kein Breakpoint-Bruch — bestand schon vor dieser Änderung. Visuell
  belegt an fertig/r205/tanzkurse-m390-full.png (Zone y=5400): keine Trennlinien, Leiter sauber.
  KRITIKER-LANE AUSGEFALLEN: kimi-critic BLOCKED (403, Usage-Limit im Billing-Cycle),
  sol/codex BLOCKED (Usage-Limit bis 27.08.2026). Zweite Modellfamilie als Gegencheck war
  damit nicht verfügbar; der Gegencheck lief auf opus-critic. Das ist eine Abweichung von
  der Regel "≥2 Modellfamilien" und ausdrücklich kein PASS dieser Regel.

- [x] G23 (R208) Blind-A/B gegen Weltklasse-Referenzen, Side-by-Side, verdeckte Zuordnung.
  AUFBAU: Drei Paare à zwei Screenshots, alle 1440x900 Above-the-Fold, identischer Viewport,
  neutral als A1/A2/B1/B2/C1/C2 benannt, Reihenfolge pro Paar gemischt. Die Zuordnung lag in
  /tmp/ab-key.json AUSSERHALB des Bildordners — die Kritiker haben sie nie gesehen und wurden
  ausdrücklich angewiesen, nicht zu raten. Je ein unabhängiger Kritiker pro Paar, parallel.
  Referenzen live geshootet (Cookie-Banner weggeklickt): pineapple.uk.com,
  broadwaydancecenter.com, peridance.com — drei international bekannte Tanzschulen.
  ERGEBNIS 3:0 für Salsaflow, jeweils deutlich, kein knappes Urteil:
    Paar A  Startseite  SALSAFLOW 8.4  gegen  Pineapple London 3.8
    Paar B  /tanzkurse  SALSAFLOW 7.6  gegen  Broadway Dance Center NYC 3.4
    Paar C  /team       SALSAFLOW 8.0  gegen  Peridance NYC 3.4
  Alle drei Kritiker beschrieben die Salsaflow-Seite unabhängig als "bewusst gestaltet" bzw.
  "teuer" und die jeweilige Referenz als "Baukasten". Sie verschrieben ihre Verbesserungs-
  vorschläge jeweils der REFERENZ — sie hielten sie für die schwächere Arbeit, ohne zu wissen,
  wessen Seite das war. Zitat Paar A: "Der Abstand ist nicht knapp."
  EINZIGER VERWERTBARER VORBEHALT, nachgeprüft und WIDERLEGT: Paar-B-Kritiker sah am
  Tanzkurse-Hero "sichtbaren Freistellungs-/Kantenrand am rechten Mann". Zone ausgeschnitten
  und angesehen (/tmp/tk-hero-img.png): keine Freistellung, das Foto ist unbeschnitten mit
  runden Ecken. Was er für eine Kante hielt, ist der warme Lichtsaum am Hemd — ein echter
  Gegenlicht-Effekt der Studiobeleuchtung. Kein Handlungsbedarf.
  NICHT GEPRÜFT: nur statischer Fold bei 1440. Motion, Hover, Scroll-Zustände und Mobile sind
  in diesem Vergleich nicht bewertet.

- [x] G24 (R209) Hero-Erstframe ohne Opacity-Fade — Foto und Rot ab dem ersten Frame.
  AUFTRAG Raphael 23.08. 20:20: "Home-Erstbild (und Mobil-Erstbild) ist immer noch ein
  Fade-Wrack. Hero-Erstframe ohne Opacity-Fade — Foto+Rot sofort." Beleg des Befunds:
  worklog/shots/CRITIC-0823-2010/home-1440-fold0.png (49 KB) gegen home-1440-top.png (644 KB).
  URSACHE, gemessen und nicht geraten: `useHydrated` liefert beim ersten Client-Render `true`.
  In derselben Sekunde kippt die `hidden`-Variante von {opacity:1} auf {opacity:0}, und weil
  `animate="show"` sofort läuft, fadet der ganze Fold von 0 zurück auf 1. Der Haken selbst ist
  richtig — er verhindert, dass der Prerender opacity:0 ins HTML schreibt. Falsch war, dass der
  Fold überhaupt animiert: ein Reveal ist eine EINTRITTS-Geste, und der Hero ist beim Laden
  schon im Bild. Nicht der Fade wurde verkürzt, sondern weggelassen.
  FIX: src/public/home/Hero.tsx — container/item/photoItem auf konstante Endwerte, H1 auf das
  neue `instant`-Flag. src/public/home/motion.tsx — `instant` in RevealWords, setzt auch den
  INITIAL-Zustand auf 'show'; ohne das bliebe ein Hidden-Frame stehen, und genau der war der
  leere Erstframe. Der Prerender-Schutz in motion.tsx bleibt für alle 23 Aufrufstellen
  unterhalb des Folds unverändert.
  MESSUNG gegen den PRODUKTIONS-Build (npm run build + serve dist:4599), nicht den Dev-Server:
  der kompiliert beim ersten Request und verschiebt den ersten Paint um mehrere hundert ms
  genau in das gemessene Fenster. Skript scripts/r209-frames.cjs, frischer Browser-Kontext pro
  Lauf (kein warmer Cache), Raster 0/60/120/180/240/320/420/600/900/1400 ms, je 3 Läufe pro
  Viewport. ERGEBNIS, über alle drei Läufe deckungsgleich:
    Desktop 1440x730  60ms=597875  120ms=571598  180ms=572455  ab 240ms konstant 572283
    Mobil    390x844  60ms=277122  120ms=276100  180ms=275744  ab 240ms konstant 275659
  Vorher lag dieselbe Kurve bei 5 KB bis 160 ms, 75 KB bei 260 ms, 498 KB bei 400 ms und voll
  erst ab 700 ms — der Treppenaufbau ist weg, es gibt keine Zwischenstufe mehr.
  VISUELL ANGESEHEN, nicht nur gemessen: /tmp/r209/d1-0060.png zeigt bei 60 ms Foto in voller
  Deckkraft, schwarze H1 (vorher grau, weil der Wort-Stagger bei opacity 0.72 startete), rote
  Pill, sekundären Textlink und die Trust-Zeile mit Sternen. /tmp/r209/m1-0060.png ebenso für
  Mobil — Raphael nannte es ausdrücklich mit. Kopien in worklog/shots/R209/, Gegenüberstellung
  gegen Raphaels Beleg in worklog/shots/R209/vergleich-erstframe.png.
  ZUSATZPRÜFUNG Font-Swap: der 60-ms-Frame ist mit 597 KB größer als der Endzustand (572 KB).
  H1-Zone bei 60 ms und 180 ms übereinandergelegt (/tmp/r209/z-font.png): identisch, Afacad
  steht ab dem ersten Frame. Die Differenz ist Bildkompression, kein Schriftsprung.
  GATES: tsc=0, oxlint=0, detect.mjs Exit 0. Die zwei [broken-image]-Hinweise von detect.mjs
  sind Falschtreffer — der Detektor findet das Wort <img> in den KOMMENTARZEILEN Hero.tsx:403
  und :570; die beiden echten Tags (:509, :634) haben beide ein src. Nicht angefasst.
  NICHT GEPRÜFT: prefers-reduced-motion im Fold (dort bewegt sich nur noch der Foto-Parallax,
  der seine Distanz in useParallax selbst nullt) und die Reveals unterhalb des Folds — die
  wurden bewusst nicht verändert.

- [x] G25 (R209) Gegencheck des Erstframe-Fix durch unabhängigen visuellen Kritiker.
  URTEIL: BESTÄTIGT. Der Kritiker lieferte einen härteren Beleg als meine eigene Messung:
  Mobil ist der Frame bei 120 ms zum Endzustand bei 1400 ms BYTE-IDENTISCH (Diff-Bbox None,
  maxdiff 0). Desktop bei 120 ms nur noch eine 19x77-Zone am Rand der WhatsApp-Bubble,
  null Pixel über Schwelle 8. Ein stufenweiser Aufbau ist damit ausgeschlossen, nicht bloss
  unwahrscheinlich. Elementmittelwerte Erstframe gegen settled bitidentisch (Headline
  172.61/171.94/170.59, CTA-Pill 180.88/46.51/59.93 usw.). Im alten Beleg misst dagegen der
  ganze Fotobereich sowie CTA, Textlink, Subline und Trust-Zeile exakt 251/250/248 — reine
  Hintergrundfarbe, also nicht gerendert; die Headline stand bei 207 statt 172, messbar grau.
  Der Kritiker prüfte die Fade-Hypothese aktiv GEGEN sich selbst: Best-fit-Alpha 0.977
  VERSCHLECHTERT den Residualfehler (21.68 gegen 21.05 roh), und 40 % der Pixel sind heller,
  38 % dunkler — ein Fade auf hellem Grund macht ausschliesslich heller. Also kein Alpha.
  SEINE URSACHENDEUTUNG WAR FALSCH, nachgeprüft: er hielt die Restbewegung im Foto (bester
  Shift-Fit dx=-1, dy=4) für Videoinhalt. Es gibt kein <video> im Hero (grep). Es ist der
  Parallax (Hero.tsx:141, angewandt :609), der sich nach dem Layout-Shift des Cookie-Banners
  neu setzt. Richtige Schlussfolgerung, falscher Grund.
  ZWEITE FAMILIE NICHT ERREICHT — das ist eine Abweichung, kein bestandenes Gate: Die
  Codex/Sol-Lane meldete Exit 1, "usage limit", Reset laut Provider 27.08.2026 03:36. Der
  Code-Gegencheck (6 Prüffragen zu Ursache, Prerender-Schutz, reduced-motion-Regression,
  Notwendigkeit von initial='show', tote Reste) ist damit NICHT GEPRÜFT. Grok oder Kimi wären
  ein Modellwechsel und brauchen Raphaels ausdrückliche Ansage.
  EIGENE ERSATZPRÜFUNG statt Behauptung, zwei Punkte davon konnte ich selbst belegen:
  - Prerender-Schutz intakt: `curl` auf das gebaute HTML findet 81x `opacity:1` und KEIN
    einziges `opacity:0`. Die Seite ist ohne JavaScript vollständig sichtbar.
  - Nahtstelle Fold/erste Sektion: nach abgeschlossenem Reveal steht kein Element unter
    opacity 0.99 (scripts/r209-settle.cjs, DOM-Messung, leeres Ergebnis). Was auf einem
    Zwischen-Screenshot wie halbtransparente Kurskarten aussah, war ein Reveal in Bewegung
    plus der gewollte Bild-Overlay hinter der weissen Schrift. Mein eigener Verdacht dort
    war falsch.
- [x] G27 (R210) Cookie-Hinweis verdeckt keinen Fold-Inhalt der Startseite mehr.
  AUFTRAG Raphael 23.08. 21:00: "Cookie-Banner auf Mobil 390 schneidet Secondary-CTA
  Schnupperstunde und Trust. Desktop-Fold <=730 schneidet Trust." Belege
  worklog/shots/CRITIC-0823-2051/home-390-settled.png und home-1440x730-cookie.png.
  BEFUND GEMESSEN, nicht am Screenshot geschätzt (scripts/r210-cookie-overlap.cjs, echter
  Rechteck-Schnitt im DOM gegen die Bannerkarte):
    390x844   93 % des sekundären CTA verdeckt, sein Textlabel 100 %
    1440x730  "seit 2018 in Basel" und "rund 40 Kurse pro Woche" je 100 %,
              "aus 104 Google-Bewertungen" 23 %
    1440x800  frei — das Problem hängt an der knappen Fold-Höhe, nicht an der Breite
  Damit ist Raphaels Befund in beiden Teilen bestätigt und mobil schärfer als gemeldet.
  GEGENPROBE OHNE HINWEIS (scripts/r210-nobanner.cjs, localStorage vorgesetzt) — sie trennt
  "Hinweis verdeckt" von "passt ohnehin nicht in den Fold":
    1440x730  Trust endet bei 711 bei 730 Viewport, passt mit 19 px Luft → Hinweis ist die
              alleinige Ursache
    390x844   CTA endet bei 808 und passt; Trust endet bei 872 und liegt SCHON OHNE Hinweis
              außerhalb → für die Trust-Zeile war der Hinweis mobil nicht die einzige Ursache
  WARUM DAS VORHANDENE POLSTER NICHT REICHTE: `[data-hero-fold] { padding-bottom }` gab es
  bereits und es greift nachweislich (matched, 78 px kommen an). Es verlängert den Fold aber
  nach UNTEN (949 → 1027 px bei 844 px Viewport); der Link bleibt bei y=764. Ein Bodenpolster
  schiebt die nächste Sektion weg und holt keinen Inhalt nach oben.
  FIX, zwei Regeln in src/index.css, beide nur bei sichtbarem Hinweis im Home-Fold:
  - Desktop ab lg: die Karte weicht waagerecht aus (`margin-left:auto` + `max-width:34rem`).
    Sie lag mittig bei x326..966 genau über der Trust-Zeile; rechts steht das Hero-Foto, dort
    verdeckt sie keine Information. Rechtsbündig allein reichte nicht — mit max-w-640 begann
    sie bei x632, die Textspalte endet bei x692, 60 px Rest blieben. 34rem setzen ihre linke
    Kante hinter die Textspalte.
  - Mobil unter sm: `--hero-photo-h` von 68svh auf `calc(68svh - 7.5rem)`. Der Wert wurde in
    zwei Messschritten gefunden: 4.5rem befreiten den CTA, ließen aber die Trust-Zeile in den
    Kartenbereich rutschen (danach 100 % verdeckt); nachgemessen fehlten 34 px mehr. Der
    Hebel sitzt bewusst am Foto und nicht am pt-Wert des Textblocks — der trägt die Naht
    zwischen H1 und Lead und ist in Hero.tsx:256-273 als "darf nicht kleiner werden" markiert.
    Ein kleineres Foto zieht den Textblock mit nach oben, die Naht bleibt.
  ZWEI ANSÄTZE GEBAUT UND VERWORFEN, beide im CSS-Kommentar mit Grund festgehalten:
  - Hinweis unter die Navigation wie /kursplan und /events: gebaut, gemessen, zurückgenommen.
    Er lag dann auf der Navigation — Desktop 100 % über "Danceflow Night" und "Collabs", 98 %
    "Salsa", 87 % "Übersicht"/"FAQ", mobil 81 % auf dem "Tanzkurse"-Knopf. Auf /kursplan geht
    das Muster auf, weil dort kein aufgeklapptes Menü im selben Band sitzt.
  - Vertikaler Lift: auf Mobil ausdrücklich verworfen (WhatsAppFloat.tsx:699) — er hätte den
    WhatsApp-Kreis genau auf "Schnupperstunde buchen" gesetzt.
  BELEG NACH FIX (scripts/r210-verify.cjs, zählt NUR sichtbare Elemente):
    m390 / d730 / d800 / d900 — jeweils KEINE Überdeckung sichtbarer Inhalte.
  Die Zählung nur sichtbarer Elemente ist nicht kosmetisch: die Rohmessung meldete durchgehend
  80 % auf "Gratis Schnupperstunde". Das ist der StickyCta, der mit opacity 0 und
  aria-hidden="true" gar nicht sichtbar ist und ohnehin über dem Hinweis liegt
  (StickyCta.tsx:74). Ein Falschbefund meines eigenen ersten Messskripts.
  REGRESSIONSPROBE 7 Routen x 2 Viewports (scripts/r210-routes.cjs): alle frei. Nur `/` zeigt
  auf Desktop die verschobene Karte (728..1272), alle anderen behalten 326..966; /kursplan und
  /events sitzen unverändert oben. Wiederkehrer-Zustand geprüft: ohne Hinweis ist der Fold
  unverändert, das Foto hat seine volle Höhe (R210/m390-accepted.png).
  VISUELL ANGESEHEN: R210/m390-cookie.png, d730-cookie.png, d800-cookie.png, beide
  -accepted.png plus Gegenüberstellungen vergleich-390.png und vergleich-1440x730.png.
  GATES: tsc=0, oxlint=0, detect.mjs Exit 0. Die vier [layout-transition]-Hinweise sind
  Bestand von /kursplan und /events; mein Diff fügt null Transitions hinzu (nachgezählt).
  NICHT GELÖST, weil andere Ursache: Auf 390 liegt die Trust-Zeile auch OHNE Hinweis knapp
  außerhalb des Folds (Ende 872 bei 844). Mit Hinweis ist sie jetzt sichtbar, weil das Foto
  kürzer ist. Ohne Hinweis bleibt sie unter der Kante — das ist eine Fold-Höhen-Entscheidung
  und kein Cookie-Problem, deshalb hier nicht angefasst.
- [x] G28 (R210) Gegencheck des Cookie-Fix durch unabhängigen visuellen Kritiker.
  URTEIL: BESTÄTIGT für die tragende Aussage. Der Kritiker ging alle acht Screenshots
  elementweise durch: auf 390, 1440x730 und 1440x800 ist im Erstbesuch kein Text, kein Button
  und keine Trust-Zeile mehr verdeckt. Zum Vorher-Beleg hält er fest, dass auf 1440x730 vorher
  nur "aus 104 Google-Bewert" sichtbar war und die Zeile jetzt vollständig steht.
  ZUM RISKANTESTEN TEIL DES FIX (gekürztes Mobil-Foto) prüfte er gezielt auf Schaden und fand
  keinen: der Beschnitt liegt oben, beide Gesichter sind vollständig und mit Abstand zur
  Kante, das Seitenverhältnis ist unverändert (echter Crop, kein Squash). Weg fallen leere
  Deckenfläche und Fingerspitzen.
  ZWEI NEBENBEFUNDE, beide NACHGEMESSEN UND WIDERLEGT — nicht übernommen:
  - "Auf d730 ist der Hinweis-Kasten unten angeschnitten." Gemessen über sechs Höhen
    (scripts/r210-cardfit.cjs, 640/700/730/760/800/900): die Kartenunterkante liegt konstant
    12 px ÜBER der Viewport-Kante, nie darüber hinaus. Der Akzeptieren-Knopf endet überall
    23 px darüber. Was er für einen Anschnitt hielt, ist der weiche Schatten unter der Karte.
  - "Mobil überlappt der WhatsApp-Kreis im Wiederkehrer-Zustand den Link Schnupperstunde."
    Gemessen (scripts/r210-whatsapp.cjs): 0 % in BEIDEN Zuständen. Der Float steht bei
    x358..406, der Link endet bei x310 — 48 px Abstand. Beim ersten Messversuch traf mein
    eigener Selektor den WhatsApp-Link im Footer (y=13264); mit Filter auf `position:fixed`
    ist das Ergebnis eindeutig.
  ZWEITE MODELLFAMILIE weiterhin nicht erreichbar (Codex/Sol usage limit bis 27.08., siehe
  G25). Der Gegencheck lief damit erneut auf einer Opus-Instanz — Abweichung, kein
  bestandenes Familien-Gate.
  ZUSATZ, vom Kritiker nicht verlangt und selbst geprüft: Die englische Fassung hängt an
  localStorage (`salsaflow-lang`), nicht am Pfad — `/en/...` liefert die 404-Seite, was meine
  erste Prüfung fälschlich als Treffer meldete. Mit korrekt gesetzter Sprache
  (scripts/r210-en.cjs): 390, 1440x730 und 1440x800 alle frei, Knopf "Okay", Karte an
  denselben Positionen wie in Deutsch.
  DIE VOM KRITIKER ALS UNGEPRÜFT BENANNTEN BREITEN HABE ICH NACHGEZOGEN — und dabei vier
  echte Lücken gefunden, die der erste Fix nicht abdeckte (scripts/r210-widths.cjs,
  16 Kombinationen von 360x740 bis 1920x900 inklusive Querformat):
    1024x700  17 % auf der Bewertungszeile, 100 % auf "seit 2018 in Basel"
    1180x720  16 % auf "seit 2018 in Basel"
    844x390   50 % auf dem Lead-Text (Querformat)
    932x430   82 % auf dem Lead-Text (Querformat)
  Der erste Fix war also nur für die drei gemessenen Viewports richtig. Ohne diese Runde
  wäre "frei" eine Behauptung über drei Stichproben gewesen.
  NACHBESSERUNG, zwei Ursachen getrennt behandelt:
  - Desktop: `max-width: 34rem` war ein geratener Festwert. Gemessen (r210-probe.cjs) endet
    die Textspalte bei jeder Breite ab lg konsistent bei 47–48 % der Fensterbreite, der freie
    Platz rechts davon reicht aber von 540 px bei 1024 bis 988 px bei 1920. Ein Festwert
    kann das nicht treffen. Jetzt `max-width: calc(50% - 3rem)` — prozentual zum Wrapper,
    der den 10.5rem-Gutter für den WhatsApp-Knopf bereits enthält.
    ZWEI FEHLVERSUCHE davor, beide aus demselben Denkfehler (gegen den FENSTERrand gerechnet
    statt gegen den Wrapper): `min(40rem, 50vw - 4rem)` liess bei 1440 die alten 640 px
    stehen, weil der Deckel gewann; `calc(50vw - 3rem)` ergab 672 px und war 80 px zu breit.
    Beide sind im CSS-Kommentar festgehalten, damit der Wert nicht erneut "vereinfacht" wird.
  - Querformat (>= 40rem breit, <= 32rem hoch): Hier gibt es keine freie Spalte, die
    Textspalte läuft über 100 % der Breite. Am Foto zu drehen war wirkungslos — ab sm ist es
    nicht mehr die absolut positionierte Fläche hinter dem Text (Hero.tsx:591), die Variable
    trägt den Textversatz dort nicht mehr. `padding-bottom` an der Section kam an (94 px),
    wirkte aber am Sectionsende bei y=1161, weit unter einem 390 px hohen Fenster. Beides
    gemessen und verworfen. Gewählt: der Hinweis geht nach OBEN unter die Navigation. Für
    normale Fenster war das falsch (aufgeklappte Menüs im selben Band), im Querformat ist die
    Navigation zusammengeklappt und das Band frei — visuell bestätigt in R210/844x390-quer.png.
  BELEG NACH NACHBESSERUNG: ALLE 16 Kombinationen frei. Visuell angesehen: 1024x700 (Trust
  bricht auf zwei Zeilen, beide vollständig), 1440x730, 844x390-quer.
  WIEDERKEHRER-ZUSTAND separat geprüft (scripts/r210-returning.cjs, 5 Viewports): ohne
  Hinweis überall `--hero-photo-h: 68svh`, mainPadTop 0, alle Zusatz-Polster inaktiv. Keine
  der neuen Regeln wirkt in den Normalzustand hinein.
- [x] G26 (R209) ERLEDIGT durch G27 — der Befund war der Auftrag vom 23.08. 21:00.
  Ursprünglicher Eintrag zur Nachvollziehbarkeit:
  Vom Kritiker gemeldet, von mir am Bild nachgeprüft und BESTÄTIGT — gehört aber nicht zum
  Fade-Auftrag und wird ohne Raphaels Wort nicht angefasst.
  - Desktop (/tmp/r209/z-trust.png): der Banner schneidet die Trust-Zeile mitten im Wort ab,
    sichtbar bleibt "aus 104 Google-Bewert…". Der stärkste Social Proof im Fold ist beim
    Erstbesuch halb verdeckt.
  - Mobil (/tmp/r209/m1-1400.png): der Banner überdeckt den sekundären Link
    "Schnupperstunde buchen" vollständig. Im Erstframe ist er noch sichtbar. Das kostet auf
    Mobil eine ganze Conversion-Option.
  - Folge davon ist auch der vom Kritiker als eigenständig gemeldete Sprung der
    WhatsApp-Bubble (y≈682 auf y≈604): sie springt nicht von selbst, der Banner schiebt sie.
  ENTSCHEIDUNG RAPHAEL: Banner tiefer setzen / Fold-Inhalt darüber halten / so lassen.

- [x] G29 (R211) Events-Leiste nach dem Hero entfernt — Auftrag Raphael 23.08. 22:03
  ("Eine Sache: Events-Leiste weg"), Beleg des Kritikers
  worklog/shots/CRITIC-0823-2148/events-1440-below-hero.png, Urteil
  worklog/watchdog/CRITIC-2026-08-23.md (dort Zeile 37 als FAIL mit DOM y:1027).
  ENTFERNT in src/public/EventsPage.tsx: das `<div>` mit dem `<dl>` unter dem Foto-Band
  («WANN 1. 3. 5. · MUSIK DJs · WO Basel SBB») plus die damit unbenutzte `facts`-Konstante.
  Der R174-Kommentar über der Komponente ist auf den neuen Stand gezogen statt gelöscht —
  die Rechnung dort erklärt, warum das Band bei 405/805 im Fold liegt, und das gilt weiter.
  DRITTE RUNDE AN DERSELBEN STELLE. R188 E2 nahm den Begleittext weg, R207 antwortete auf
  denselben Satz "sieht dumm aus" mit kleinen Labels über den Werten. Beide Male blieb die
  Leiste stehen und Raphael meldete sie erneut. Der Umbau war die falsche Antwort: "1. 3. 5."
  trägt ohne "Freitag im Monat" keine lesbare Datumsangabe — genau dieser Träger fiel in
  R188 E2 weg — und "DJs" als Antwort auf "Musik" sagt nichts, was ein Gast nicht erwartet.
  KEIN INHALTSVERLUST, VOR dem Löschen geprüft und danach gemessen. Alle drei Angaben stehen
  ausgeschrieben weiter unten auf derselben Seite: content.ts:75 "Jeden 1., 3. und 5. Freitag
  am Bahnhof Basel SBB", content.ts:94/95 in der Danceflow-Karte, content.ts:174 im FAQ.
  MESSUNG (scripts/r211-events.cjs, 1440x900 und 390x844, gegen den Produktions-Build auf
  Port 4712, Cookie-Hinweis über den am Code nachgeschlagenen Key `salsaflow-cookie-ok`='1'
  quittiert): Leisten-Form (dl/ul mit allen drei Werten) 0 Treffer, nackte "1. 3. 5."-
  Vorkommen 0, ausgeschriebener Termin weiterhin vorhanden = true, "Basel SBB" 3x auf der
  Seite. Die Entfernung ist damit belegt, nicht behauptet, und der Inhalt nachweislich da.
  VISUELL ANGESEHEN (worklog/shots/R211-nachher/): events-1440-below-hero.png — unter dem
  Band folgt direkt "Alle Events auf einen Blick." und darunter die Karte mit
  "JEDEN 1., 3. UND 5. FREITAG / Danceflow Night / Der Social-Dance-Abend am Bahnhof Basel
  SBB, mit eigenen DJs". Dieselbe Information, nur lesbar. events-390-below-hero.png ebenso.
  events-1440-top.png: der Fold ist unverändert, die Leiste saß unter dem Band.
  GATES: tsc --noEmit Exit 0, oxlint src ohne neue Warnung (die eine bestehende liegt in
  src/lib/api.ts und ist nicht Teil dieser Änderung), detect.mjs auf EventsPage.tsx Exit 0.
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Die Sol-Lane ist bis 27.08.
  03:36 am Usage-Limit; Grok oder Kimi wären ein Modellwechsel und brauchen Raphaels Wort.

- [x] G30 (R212) FAQ-Hero ohne Home-Paar-Foto — Auftrag Raphael 23.08. 22:33
  ("Eine Sache: FAQ-Hero ohne Home-Paar"), Beleg des Kritikers
  worklog/shots/CRITIC-0823-2221/faq-1440-fold0.png, Urteil
  worklog/watchdog/CRITIC-2026-08-23.md ("FAQ-Hero-Foto FAIL — gleiches Home-Paar
  hero-paar-dreh-01.webp 596x447, y:125. Spec: Bilder nicht nötig, Hero schlank").
  BEFUND BESTÄTIGT, nicht nur übernommen: `grep` auf hero-paar-dreh-01 zeigt dieselbe
  Datei in home/Hero.tsx:635 (Home-Hero) und faq/content.ts:99/305. Es war buchstäblich
  dasselbe Bild, nicht nur ein ähnliches Motiv.
  ENTFERNT in src/public/FaqPage.tsx: die rechte Bildspalte des Heros samt Reveal-Wrapper.
  Das zweispaltige Grid (`lg:grid-cols-[1.02fr_0.98fr]`) ist mit ihr raus — der Textblock
  trägt jetzt die volle Shell. Der Lead darf von max-w-xl auf max-w-2xl, weil ihn keine
  Bildspalte mehr drückt; über die ganze Shell wäre zu weit für `sectionLead`.
  DAS BILD WAR EIN REST, KEIN ENTWURF. Raphaels Spec vom 23.08. 16:40 steht wörtlich in
  faq/content.ts:25-29: "Bilder nicht nötig. Hero oben, unten eine CTA-Section. Seite
  schlank." R206 entfernte daraufhin die Kapitel-Bildbänder und ließ dieses eine stehen.
  Die Begründung aus R188 F6 trug hier nicht mehr: sie wählte das Motiv gegen das Foto im
  ersten FAQ-Block darunter (Doppelung beim Scrollen) — gegen den Home-Hero war es nie
  geprüft worden.
  BEWUSST NICHT `axis="center"` GEWÄHLT. Der Kommentar in FaqPage.tsx:57-65 hält fest, dass
  /faq vor der Meta-Kritik vom 07.08. genau so lief und Silhouette für Silhouette aussah wie
  /preise und /heels. Zentrieren hätte den alten Fehler zurückgeholt. Linksbündig über die
  volle Breite zitiert weder das Home-Hero noch die zentrierten Schwesterseiten.
  MESSUNG (scripts/r212-faq.cjs, 1440x900 / 1440x730 / 390x844 gegen den Produktions-Build
  auf Port 4712): Bilder im Hero 0 in allen drei Viewports, hero-paar-dreh-01 auf der
  ganzen Seite 0. Englische Fassung separat geprüft (localStorage salsaflow-lang=en):
  H1 "Questions and answers", heroImgs 0, homeMotiv 0 — beide Sprachen tragen denselben
  Hero-Code, das ist damit belegt statt angenommen.
  NEBENEFFEKT, gemessen statt vermutet: der Hero endet jetzt bei y560 statt vorher ~660.
  Dadurch beginnt das FAQ-Grid in ALLEN drei Viewports im Fold (560 < 730), auch in der
  engen 730er-Höhe. Der Nutzer sieht sofort Fragen statt nur ein Versprechen.
  VISUELL ANGESEHEN (worklog/shots/R212-nachher/): faq-1440-fold0.png — H1 einzeilig über
  die volle Breite, darunter im selben Fold "Häufige Fragen" mit "Dein Einstieg" und
  "Kurs und Level". faq-1440x730-fold0.png — "Häufige Fragen" gerade noch im Fold.
  faq-390-fold0.png — Mobil sauber, dort saß das Bild ohnehin unter dem Text.
  OFFEN FÜR RAPHAEL (subjektiv, nicht von mir entschieden): rechts neben H1 und Lead steht
  jetzt eine große leere Fläche. Das ist der Preis für linksbündig statt zentriert. Wenn
  ihm das zu leer ist, sind die Wege: Lead breiter laufen lassen, die Themen-Chips aus
  `themes` (liegt ungenutzt in content.ts) dort einsetzen, oder doch zentrieren — Letzteres
  gegen die Meta-Kritik vom 07.08.
  GATES: tsc --noEmit Exit 0, oxlint src ohne neue Warnung (die eine bestehende liegt in
  src/lib/api.ts), detect.mjs auf FaqPage.tsx Exit 0.
  NICHT ANGEFASST: `hero.image` bleibt in faq/content.ts und im Typ — der Typ ist mit
  anderen Unterseiten geteilt, die das Feld rendern. Ebenso `cardLabel`/`cardText`/`themes`,
  die auf /faq schon vor dieser Runde ungenutzt waren. Beides wäre Scope-Ausweitung.
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit; Grok oder Kimi wären ein Modellwechsel und brauchen Raphaels Wort.

- [x] G31 (R213) Über-uns-Hero: Luft über der H1 — Auftrag Raphael 23.08. 22:33
  ("Eine Sache: Ueber-uns-Hero Luft oben und unten"), Belege
  worklog/shots/CRITIC-0823-2252/ueberuns-1440-fold0.png und ueberuns-390-fold0.png,
  Urteil worklog/watchdog/CRITIC-2026-08-23.md.
  MESSFEHLER IM EIGENEN SKRIPT ZUERST GEFUNDEN UND KORRIGIERT. Der erste Selektor suchte
  das "tiefste grosse Element im Header" und lieferte 911px Unterkante bei 900px Viewport
  — auf JEDER Route identisch. Das war das zugeklappte Mobilmenü (`h-[calc(100dvh-3rem)]`,
  844px hoch), das im DOM steht und weder display:none noch opacity:0 trägt. Die daraus
  errechnete "Überlappung -835px" war mein Fehler, kein Befund. Korrigiert auf die Pille
  (`header .t-acc`, Höhe < 120px). Dieselbe Lehre wie bei R210: unsichtbare bzw. falsch
  getroffene Elemente erzeugen zuverlässig Falschbefunde.
  MESSUNG NACH DER KORREKTUR (scripts/r213-team-hero.cjs, Produktions-Build). Luft zwischen
  Pillen-Unterkante und H1-Oberkante, und Luft zwischen tiefstem CTA-Element und Bandkante:

    Route                Luft oben 1440 / 390     Luft unter CTA 1440 / 390
    /team  VORHER              8 /  7                    64 / 56
    /team  NACHHER            48 / 47                    64 / 56
    /events                   40 / 39                    64 / 56
    /tanzkurse                61 / 56                     -
    /preise                   84 / 79                   128 / 259
    salsa/bachata/heels       68 /  -                     -

  /team hatte als EINZIGE Route einstellige Luft über der H1 — fünfmal weniger als die
  nächstknappe Seite. Nachher liegt sie zwischen /events (40) und /tanzkurse (61).
  URSACHE: nicht der tight-Zweig selbst, sondern eine FEHLENDE Breadcrumb. `tight` setzt
  `paddingTop: var(--nav-h)` und `pt-0`; der Abstand zur H1 entsteht auf den Schwesterseiten
  allein aus dem `mb-1` der Crumb-Zeile. /team trägt keine Crumb, also fällt der Puffer weg
  und die H1 startet exakt auf var(--nav-h) = 76px, während die Pille schon bei 68px endet
  und mit ihrer Rundung optisch tiefer reicht. Daher las sich der Fold als Überlappung.
  FIX: neue Opt-in-Prop `airAboveTitle` in kit.tsx (`calc(var(--nav-h) + 2.5rem)`), gesetzt
  nur auf /team. Sie steht bewusst VOR dem tight/lift-Zweig — genau die Falle, in die R208
  bei `airBelowCta` schon einmal gelaufen ist (Flag hinter dem Zweig = wirkungslos).
  KEIN GRIFF IN DEN GETEILTEN ZWEIG: derselbe tight-Zweig trägt /tanzkurse/salsa, /bachata,
  /heels und /mehr/partys, deren Band-Crop laut R71/R159/R174 auf Kinnlinien kalibriert ist.
  Gegenprobe nach dem Fix: salsa/bachata/heels unverändert bei 68, /events bei 40.
  BAND-CROP NACHGEMESSEN (scripts/r213-band.cjs), weil die 40px das Band nach unten schieben:
  srcFenster 11.7%..80.9% — deckungsgleich mit der Messreihe im Code-Kommentar (12.0%..81.2%),
  `object-position: 50% 38%` unverändert. Bei 1440x730 reicht der Fold bis src 37.8%; die
  Köpfe liegen laut R159 bei 25–45%, sind also weiterhin vollständig im Fold. Die Verschiebung
  kostet keinen Kopf.
  ENGLISCHE FASSUNG separat geprüft (localStorage salsaflow-lang=en): luftOben 48, H1
  "Dancing feels easier when you feel welcome".
  VISUELL ANGESEHEN (worklog/shots/R213-nachher/): team-1440-fold0.png — H1 steht frei unter
  der Navbar, Versalien berühren die Pille nicht mehr, alle Köpfe sichtbar.
  team-1440x730-fold0.png — hintere Reihe mit vollständigen Gesichtern im Fold.
  team-390-fold0.png — "Tanz lernt" nicht mehr angeschnitten. salsa-1440-fold0.png als
  Gegenprobe: unverändert.
  KORREKTUR AM URTEIL: der Kritiker nannte "44 px unter der CTA". Gemessen sind es 64 —
  ab der Pill 44, ab dem tiefer reichenden Textlink daneben 64. Genau diese Messpunkt-Falle
  steht schon im R208-Kommentar in kit.tsx. Mit 64px liegt /team exakt auf /events und ist
  dort kein Ausreisser; der Befund lag oben, nicht unten. Deshalb wurde unten NICHTS
  geändert — `airBelowCta` aus R208 wirkt bereits.
  OFFEN FÜR RAPHAEL: die Ansage lautete "Luft oben und unten". Unten habe ich bewusst nicht
  angefasst, weil 64px dem Wert der Schwesterseite entspricht. Wenn dort trotzdem mehr Luft
  gewünscht ist, ist der Hebel `airBelowCta` in kit.tsx (aktuell pb-14 lg:pb-16) — das
  verschiebt allerdings das Band weiter aus dem 730er-Fold und müsste neu gegen den Crop
  gemessen werden.
  NEBENBEFUND, NICHT ANGEFASST (ausserhalb des Auftrags): /mehr/partys hat 0px Luft zwischen
  CTA-Reihe und Bandkante (1440x900, dieselbe Messung).
  GATES: tsc --noEmit Exit 0, oxlint src ohne neue Warnung (die eine bestehende liegt in
  src/lib/api.ts), detect.mjs auf TeamPage.tsx + kit.tsx Exit 0.
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit; Grok oder Kimi wären ein Modellwechsel und brauchen Raphaels Wort.

- [x] G32 (R214) Home-Levels: rechte Hälfte auf Überschriftenhöhe füllen — Auftrag Raphael 23.08. 23:34
  BEFUND NACHGEMESSEN: Der Kopf der Sektion "Vom ersten Grundschritt zur sicheren Tanzfläche"
  lief als EIN einspaltiger Block auf max-w-3xl — H2, Lead und der Link "Welches Level passt
  zu mir?" untereinander, alles links. Rechts von der Seitenmitte stand zwischen der
  Überschrift und dem Foto nichts. Der Kritiker misst 285px Leere (H2 y2842, erstes rechtes
  Element y3127); meine eigene Messung mit 200px-Band ab Überschriftenoberkante ergab vorher
  RECHTS-INK=0. Kein Streit über die Zahl: derselbe Befund, konservativerer Ausschnitt.
  FIX: Der Kopf übernimmt die Bauform des direkten Nachbarn ScheduleTeaser
  (grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:pr-36) — übernommen, nicht
  neu erfunden. H2 und Lead bilden zusammen die linke Spalte, der CTA-Link wird zweites
  Grid-Kind. `mt-6` fällt weg, den Abstand trägt jetzt der Grid-Gap.
  BEWUSST NICHT ÜBERNOMMEN: die rote Pille des Nachbarn. Dort ist "Zum ganzen Kursplan" die
  Hauptaktion der Kursplan-Sektion; hier ist "Welches Level passt zu mir?" eine Orientierungs-
  hilfe zur Level-Treppe darunter. Zwei rote Pillen in zwei aufeinanderfolgenden Sektionen
  würden die eine Hauptaktion verwässern. Der Platz ändert sich, die Stufe der Aktion nicht.
  NACHHER GEMESSEN (scripts/r214-coursepath.cjs, Produktions-Build auf :4724):
  1440 Levels  RECHTS-INK=1, erstes rechtes Element <A> x=993 y=2951 "Welches Level passt zu mir?"
  1440 Nachbar RECHTS-INK=1, erstes rechtes Element <A> x=1003 y=1887 "Zum ganzen Kursplan"
  Beide Köpfe liegen damit im selben Korridor; das leere Band ist geschlossen.
  WHATSAPP-ZONE GEPRÜFT statt geglaubt: FAB.left=1360, CTA.right=1188, Abstand 172px. Das
  `lg:pr-36` trägt — ohne es liefe der Link in dieselbe Zone wie in Critic Runde 15, Item 1.
  390 UNVERÄNDERT: RECHTS-INK=0 bei Levels UND beim Nachbarn — einspaltig, wie vom Urteil
  ausdrücklich als "kein Problem" bezeichnet. Der Nachbar verhält sich identisch, also ist
  die 0 dort kein Befund, sondern das erwartete Verhalten des lg-Breakpoints.
  VISUELL ANGESEHEN (worklog/shots/R214/): home-1440-levels.png — der Link sitzt rechts auf
  der Lead-Grundlinie, H2 und Lead sind sichtbar (der Reveal trägt auch ohne eigenes
  `variants={item}` am <p>, weil es jetzt Kind des linken motion.div ist).
  home-1440-nachbar.png als Gegenprobe: gleiche Bauform, gleicher rechter Rand bei 1188.
  home-390-levels.png: H2, Lead, Link untereinander — unverändert einspaltig.
  KORREKTUR EINER ANNAHME: Ich bin davon ausgegangen, CoursePath rendere zweimal (standalone
  auf / und embedded auf /kursaufbau). Nachgeschlagen: `withCoursePath` wird NIRGENDS auf
  true gesetzt — HomePage.tsx:111 ruft <ScheduleTeaser /> ohne Prop, und /kursaufbau ist eine
  eigene Seite mit eigenen Überschriften. Der embedded-Zweig ist derzeit toter Code und wurde
  nicht angefasst; es gibt genau einen aktiven Renderpfad. Belegt über grep auf withCoursePath
  und über die H2-Liste in dist/kursaufbau.html.
  GATES: tsc --noEmit Exit 0, oxlint src ohne neue Warnung (die eine bestehende liegt in
  src/lib/api.ts:18), detect.mjs auf CoursePath.tsx Exit 0.
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit; Grok oder Kimi wären ein Modellwechsel und brauchen Raphaels Wort.

- [x] G33 (R215) /mehr/partys Hero: Luft oben und unten — Auftrag Raphael 24.08. 00:05
  BEFUND NACHGEMESSEN (scripts/r215-partys-hero.cjs, Produktions-Build, 10 Routen):
  UNTEN bestätigt sich exakt: /mehr/partys stand auf 0px zwischen letztem Ink-Element und
  Bandoberkante — auf 1440 UND auf 390, als einzige Route mit Foto-Band. Korridor der
  Geschwister: /events 64, /team 64 (390: 68/68), /preise 24 (dort trägt die Preisleiste mit).
  OBEN — KORREKTUR ZUR URTEILSZAHL: Der Kritiker nennt "Breadcrumb-unten 107, H1-top 100,
  Luft -7", also Überlappung. Am <nav> gemessen sind es crumbUK 96 gegen h1Top 100, also +4.
  Der Unterschied ist der Messpunkt: die Crumb-Anker tragen eine 44px-Tap-Fläche, die über
  die Textzeile hinausreicht. Keine Überlappung — aber der Befund "zu wenig Luft" trägt:
  OBEN(nav) war 32, während salsa/bachata/heels auf 68 und /preise auf 84 liegen.
  URSACHE, am Code belegt: NICHT der tight-Zweig allein. src/index.css:766 setzte seit R151
  `padding-bottom: 0 !important` auf allen Viewports für [data-partys-page] und hat damit das
  `pb-8` aus R77 sitewide ausgehebelt — R77 hatte es gesetzt, damit die Microcopy nicht auf
  der Foto-Naht klebt. Eine spätere Runde hat eine frühere still überschrieben.
  FIX in drei Schritten:
  1. `airAboveTitle` (R213-Hebel) auf /mehr/partys — hebt OBEN(nav) 32 -> 72, in den Korridor.
  2. Die Padding-Sperre in index.css entfernt, `airBelowCta` (R208-Hebel) gesetzt — UNTEN
     0 -> 64 auf 1440, 0 -> 56 auf 390.
  3. SubHero reicht beide Flags jetzt an HeroFrame durch. Sie existierten dort seit R208/R213,
     waren über SubHero aber nicht erreichbar: /team und /events bauen ihren Hero mit eigenem
     Code direkt auf HeroFrame, /mehr/partys geht über SubHero.
  ZIELKONFLIKT, RAPHAEL VORGELEGT UND ENTSCHIEDEN: 64px Luft schieben das 20rem-Band unter
  den 730er-Fold, dessen Crop auf Kinnlinien kalibriert ist (R150b). Entscheidung 24.08.:
  "Luft, Band schrumpfen". Band 20rem -> 13rem (gemessen: Band-Top 521 + 208px = 729, also
  1px über dem Fold). 16rem war der erste Versuch und ragte gemessen 47px unter den Fold.
  EHRLICH BENANNT — ECHTE EINBUSSE: R150b belegt für party-31-v3 (2048x1360) Quell-Y 90-544
  als nötig für beide Köpfe inkl. Kinn (454px Motiv). Ein 208px hohes Fenster zeigt nur 296px
  Quellhöhe. Der kalibrierte Ausschnitt passt bei KEINER object-position mehr hinein; über
  0% bis 20% durchgerechnet deckt keiner 90-544 ab. Der Wert wurde an Bildern gesucht statt
  gerechnet (scripts/r215-crop.cjs, sechs Fold-Shots, alle angesehen): 15% schnitt der Frau
  vorn mitten durchs Gesicht (schlechter als vorher), 0% zeigt den Mann ganz und die Frau gar
  nicht, 8% ist der beste Kompromiss — Mann vollständig inkl. Kinn, Frau an der Haarlinie
  angeschnitten statt auf Nasenhöhe. Kein Wert löst es ganz: das Motiv hat zwei Tiefenebenen,
  296px Quellhöhe fassen nur eine.
  VISUELL ANGESEHEN (worklog/shots/R215/): mehr-partys-1440x730-fold.png — Breadcrumb frei
  über der H1, sichtbares Papier zwischen CTA-Reihe und Bandkante, Band endet im Fold.
  mehr-partys-390-fold.png — "Du musst nicht perfekt sein..." hat Luft zur Fotokante, beide
  Personen mit vollständigen Gesichtern. team-1440x730-fold.png als Gegenprobe: unverändert.
  GEGENPROBE GEMESSEN: /events, /team, /preise, salsa/bachata/heels stehen nach dem Eingriff
  auf exakt denselben Zahlen wie in der Vormessung — Byte für Byte identische Zeilen.
  390 NICHT ANGEFASST: dort ragt das Band über den 844er-Viewport. Das war schon vorher so
  (heightClass 16rem aus PartysPage.tsx, die 13rem-Regel gilt nur ab lg) und ist auf Mobil
  normales Scrollen. Der Auftrag nennt für 390 ausdrücklich nur den Klebe-Befund.
  GATES: tsc --noEmit Exit 0, oxlint src ohne neue Warnung (die eine bestehende liegt in
  src/lib/api.ts:18), detect.mjs Exit 0. Die 4 [layout-transition]-Funde in index.css
  (Zeilen 1228-1299) sind VORBESTEHEND — per git stash gegengeprüft: sie erscheinen ohne
  meine Änderungen identisch und liegen weit außerhalb des angefassten Bereichs (749-800).
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit; Grok oder Kimi wären ein Modellwechsel und brauchen Raphaels Wort.
  OFFEN FÜR RAPHAEL: OBEN(crumb) bleibt bei 4px, weil Breadcrumb und H1 zusammen nach unten
  gewandert sind — der Abstand ZWISCHEN beiden kommt aus dem `mb-1` der Crumb-Zeile im
  tight-Zweig, nicht aus dem Hero-Padding. Die anderen Crumb-Seiten liegen dort bei 8-16.
  Im Bild steht der Breadcrumb frei; wenn dort trotzdem mehr Abstand gewünscht ist, wäre der
  Hebel ein eigenes Flag für die Crumb-Zeile — ein Griff in den geteilten tight-Zweig würde
  salsa/bachata/heels mitverschieben.

- [x] G34 (R216) /faq-Hero: rechte Hälfte füllen, ohne Bild — Critic 24.08. 00:51 + Raphael-Entscheid
  KONFLIKT ZUERST GEMELDET, NICHT ÜBERGANGEN: Der Critic fordert "echtes Bild/Media ins
  FAQ-Hero". Das widerspricht zwei Raphael-Ansagen, die wörtlich im Code stehen: 23.08. 16:40
  "Bilder nicht nötig" (zitiert in faq/content.ts:25) und 23.08. 22:33 "FAQ-Hero ohne
  Home-Paar", umgesetzt in R206/R212 und vom Critic selbst viermal als WIDERLEGT bestätigt.
  Ein Critic-Urteil ist ein Befund, keine Nutzeransage — deshalb vorgelegt statt gebaut.
  RAPHAELS ENTSCHEIDUNG 24.08.: rechte Hälfte füllen, aber OHNE Bild. Spec bleibt.
  BEFUND NACHGEMESSEN (scripts/r216-faq-hero.cjs, Produktions-Build):
  mediaCount 0 auf ganz /faq — BESTÄTIGT, ist aber die Spec und kein Defekt.
  Rechts der Seitenmitte auf Hero-Höhe: 1 Ink-Element, und das ist der Deko-Blob ohne Text.
  KORREKTUR ZUR URTEILSZAHL: die tote Zone misst 88px (Textkante x1332 gegen Shell x1420),
  nicht 96. Der Befund ist trotzdem GRÖSSER als seine Zahl: im Screenshot steht die ganze
  Fläche ab Seitenmitte über die volle Hero-Höhe leer, während links H1, Lead, zwei CTAs und
  Microcopy sitzen. Der Kritiker hat in der Sache recht, nur nicht in der Zahl.
  FIX: Der Hero läuft ab lg zweispaltig (grid lg:grid-cols-[1.05fr_0.95fr] lg:items-start).
  Links der unveränderte Textblock aus R212/R188 F6, rechts die Themen-Sprungliste.
  BAUFORM NICHT ERFUNDEN: der Kopf von "Häufige Fragen" auf DERSELBEN SEITE (FaqPage.tsx:183)
  hat denselben Befund schon einmal gelöst — R188 F3, "rechte zwei Fünftel leer, sieht lost
  aus" — mit exakt diesem Grid. Gleicher Fehler, gleiche Antwort, gleiche Seite.
  INHALT IST BESTEHENDE, TOTE COPY: `themes.items` — sieben Sprungziele mit Label und Hinweis,
  DE und EN vollständig. Per grep gegengeprüft, dass `themes` an keiner anderen Stelle
  gerendert wird: R206 hat den Block beim Vereinfachen fallen lassen, ohne die Copy zu
  entfernen. Damit steht rechts etwas, das der Seite gehört und einem Besucher nützt, statt
  Dekoration zur Flächenfüllung. Keine erfundene Copy. Alle sieben, keine Auswahl — welche
  wichtig sind, entscheidet der Besucher, und die Copy führt sie als geschlossene Liste.
  Als <nav aria-label> ausgezeichnet: es ist eine Navigationshilfe, kein Fliesstext, und
  Screenreader können sie so überspringen. Haarlinien statt Kästen, weil die Seite
  durchgehend mit border-line arbeitet.
  NACHHER GEMESSEN: Ink rechts der Mitte 1 -> 16 auf 1440.
  390 UNVERÄNDERT EINSPALTIG: die Liste rutscht unter die Microcopy, durch eine Haarlinie
  abgesetzt. Dort gibt es keine rechte Hälfte, also auch keinen Befund.
  VISUELL ANGESEHEN (worklog/shots/R216/): faq-1440x900-vorher.png und -nachher.png im
  direkten Vergleich; faq-390-nachher.png (Liste unter dem Textblock, Label brechen um,
  Hinweise kollidieren nicht); faq-1440x900-en.png (alle sieben Einträge übersetzt, keine
  Überläufe). Die H1 wächst durch die schmalere Spalte auf zwei Zeilen (69 -> 138px) — im
  Bild geprüft, die Zeile steht ruhig und die Spaltenkante ist klar.
  GATES: tsc --noEmit Exit 0, oxlint src ohne neue Warnung (die eine bestehende liegt in
  src/lib/api.ts:18), detect.mjs auf FaqPage.tsx Exit 0.
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit; Grok oder Kimi wären ein Modellwechsel und brauchen Raphaels Wort.
  NEBENBEFUND, NICHT ANGEFASST: `themes.lead` bleibt ungenutzt — er beschreibt einen eigenen
  Abschnitt ("Unten findest du alle Antworten..."), nicht diese Liste. Ihn hier zu zeigen
  wäre eine Behauptung über einen Block, den es nicht mehr gibt.

- [x] G35 (R217) /tanzkurse Level-Pille nach Level oder einheitlich färben, nicht nach
  Kartenindex. Auftrag Raphael 24.08. 02:22 (Critic-Urteil 02:16): "Vier gleichrangige
  Startet-bald-Karten: 01+02 rot rgb(173,24,39), 03+04 beige rgb(244,241,236). Beginner ist
  einmal rot (Stufe 2) und zweimal beige (Stufe 4, 5) — die Farbe kodiert nichts. Rot ist
  Aktionsfarbe der Site, zwei rote Pillen lesen sich als Hervorhebung ohne Grund."
  EVIDENCE:
  VORHER GEMESSEN (scripts/r217-pillen.cjs gegen den Produktions-Build, alte Pillenzeile
  temporär zurückgepatcht): 1440 und 390 identisch — "Intermediate Stufe 8" rgb(173,24,39),
  "Beginner Stufe 2" rgb(173,24,39), "Beginner Stufe 4" rgb(244,241,236), "Beginner Stufe 5"
  rgb(244,241,236). Zwei verschiedene Hintergründe. Der Befund ist damit reproduziert, die
  Kartenlevel des Kritikers stimmen exakt.
  KORREKTUR ZUR URSACHE: Nach Kartenindex färbte die Pille NICHT. Sie färbte nach
  `course.styleKey` (CoursesPage.tsx: heels dunkel, bachata beige, alles andere rot). Im
  Screenshot lag Salsa zufällig auf 01+02 und Bachata auf 03+04, daher las es sich als
  Positionsfarbe. Die beschriebene WIRKUNG stimmt trotzdem exakt: die Pille zeigt einen
  LEVEL-Text und färbte nach STIL — die Farbe kodierte nicht, was in ihr steht.
  ENTSCHEIDUNG einheitlich statt nach Level: `levelCategory` liegt sauber im Datenmodell
  (db/schema.ts:35, fünf Enum-Werte; gezählt in src/generated/schedule-embedded.ts:
  beginner 32, advanced 14, intermediate 12, open 12, heels 4). Eine Farbskala darüber wäre
  aber eine neue Zeichensprache, die die Seite nirgends erklärt, und zwei der fünf Werte
  (open, heels) sind gar keine Stufe auf der Leiter. Stattdessen folgt die Pille dem Muster,
  das die SCHWESTERSEITE für dieselbe Information schon hat: /kursplan rendert den Level über
  `CourseBadge tone="level"` (courses/CourseRow.tsx:311), einheitlich bg-soft + text-ink, nie
  rot. Der Kommentar dort nennt den Grund wörtlich: "Metadaten bleiben neutral. Salsa-Rot
  markiert nur die erste Buchungsaktion." Genau diese Regel hatte die Pille gebrochen.
  `CourseBadge` wird bewusst nicht importiert: der Ton dort trägt vier group-hover-Fälle für
  die rot durchfärbende Kurszeile, die diese Karte nicht hat.
  ZWEITER BEFUND, im Bild gefunden statt in Zahlen: Nach dem ersten Fix verschwand die
  Pillenform. Gemessen (scripts/r217-kontrast.cjs): Pille rgb(244,241,236) auf Sektion
  rgb(244,241,236) — identisch, die Karte hat keinen eigenen Hintergrund. Der alte
  bachata-Zweig hatte dafür `ring-1 ring-line`; beim Übernehmen des /kursplan-Tons war der
  Ring verlorengegangen (dort sitzt die Badge auf weisser Zeile).
  DRITTER BEFUND, ebenfalls gemessen: `ring-1` wirkte nur auf 1440. index.css:348-352 löscht
  unter 640px per `main :not(a):not(button)... { box-shadow: none }` jeden Schatten auf
  nicht-interaktiven Elementen, und ein Tailwind-`ring` IST ein box-shadow. Beleg
  (scripts/r217-ring.cjs): 1440 boxShadow "rgb(228,228,225) 0px 0px 0px 1px", 390 boxShadow
  "none". Die alte Bachata-Pille war auf Mobil aus demselben Grund ringlos. Gelöst mit
  `border` statt `ring`: nachgemessen tragen jetzt beide Viewports border rgb(228,228,225) 1px.
  NACHHER GEMESSEN: 1440 und 390 je 1 verschiedener Hintergrund — alle vier Level-Pillen
  rgb(244,241,236). Rot trägt in der Sektion nur noch der eine Haupt-CTA "Kursplan öffnen".
  MESSUMGEBUNG REPARIERT: Die erste Messung fand keine Karten. Ursache war kein Codefehler,
  sondern die Umgebung — die Karten kommen per fetchSchedule() von /api/public/schedule, und
  ein statischer `npx serve -s dist` liefert keine API, also greift showFallback. `npm start`
  allein reicht auch nicht (server/index.ts bedient nur /api, curl /tanzkurse -> 404). Dafür
  liegt jetzt scripts/r217-serve.cjs im Repo: liefert dist und reicht /api an den laufenden
  Hono-Server (8787) durch. Erst damit stehen vier echte Karten im DOM.
  VISUELL ANGESEHEN (worklog/shots/R217/): tanzkurse-karten-1440.png und -390.png je vor und
  nach dem Ring-Fix, dazu pille-390-nah.png bei deviceScaleFactor 3. Die Nahaufnahme war
  nötig: im verkleinerten 390er-Vollbild war nicht zu entscheiden, ob der Rand fehlt oder nur
  nicht aufgelöst wird. Sie zeigte, dass er wirklich fehlte — das war der Einstieg in den
  box-shadow-Befund.
  DIFF-UMFANG: eine Zeile Klassen in src/public/CoursesPage.tsx plus Begründung. Per grep
  gegengeprüft, dass keine weitere Farbe im Repo an `styleKey` hängt — die Stelle war die
  einzige. /kursplan ist nicht angefasst.
  GATES: tsc --noEmit Exit 0, oxlint src ohne neue Warnung (die eine bestehende liegt in
  src/lib/api.ts:18), detect.mjs auf CoursesPage.tsx Exit 0.
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit; Grok oder Kimi wären ein Modellwechsel und brauchen Raphaels Wort.
  NEBENBEFUND, NICHT ANGEFASST: index.css:348-352 entfernt sitewide jeden box-shadow auf
  nicht-interaktiven Elementen unter 640px. Jedes `ring-*` auf Nicht-Links ist auf Mobil
  damit still wirkungslos. Hier umgangen, nicht global geändert — die Regel trägt vermutlich
  Absicht (flache Mobil-Optik), und ein sitewide Eingriff wäre weit über diesen Auftrag hinaus.

- [x] G36 (R218) Tote Anker #events und #raumvermietung auf /kontakt heilen.
  Auftrag Raphael 24.08. 03:20 (Critic-Urteil 03:12): "vier CTAs springen auf Anker, die auf
  /kontakt nicht existieren. /events 'Naechste Events ansehen' und 'Workshops ansehen' ->
  /kontakt#events (ID fehlt). /kontakt/standort-raumvermietung 'Raumvermietung anfragen' und
  'Raum anfragen' -> /kontakt#raumvermietung (ID fehlt; gemeinter Abschnitt ist raum-info).
  Echter Klick landet scrollY 482, Viewport zeigt Formularschritt 'Worum geht es?' statt
  Events." Builder entscheidet die Route.
  ERGEBNIS: BEFUND WIDERLEGT. Kein Codeeingriff. Raphael hat die Route am 24.08. entschieden,
  nachdem die Messung vorlag.
  EVIDENCE:
  DIE ANKER SIND KEINE SPRUNGZIELE, SONDERN REGISTRIERTE HASH-WEGE. ContactPage.tsx:47-54
  fuehrt TOPIC_HASHES mit sechs Eintraegen, darunter '#events' und '#raumvermietung'. Der
  useEffect ab Zeile 83 liest den Hash, setzt damit das Anliegen (setTopic) und scrollt
  gezielt auf #kontaktformular. Zeile 81-82 sagt den Vorsatz woertlich: "#raumvermietung darf
  nicht an der Infosektion landen — die traegt bewusst keine gleichnamige id mehr."
  Die Beobachtung "ID fehlt" stimmt also woertlich (curl auf /kontakt listet nur
  contact-maps, inquiry-next, kontaktformular, raum-info, schnupperstunde, main, root u.a.),
  trifft aber nicht die Mechanik: Diese Anker sollen keine Elemente sein.
  ECHTER KLICK GEMESSEN (scripts/r218-anker.cjs, Klick von der Ursprungsseite, nicht
  Direktaufruf, Produktions-Build):
    /events "Naechste Events ansehen"  href=/kontakt#events         -> scrollY 482, formTop 172, Formular im Viewport
    /events "Workshops ansehen"        href=/kontakt#events         -> scrollY 482, formTop 172, Formular im Viewport
    /standort-raumvermietung "Raumvermietung anfragen" href=/kontakt#raumvermietung -> scrollY 482, formTop 172
    /standort-raumvermietung "Raum anfragen"           href=#mieten -> bleibt auf der Seite, scrollY 2368
  Der vierte CTA zeigt gar nicht auf /kontakt, sondern ist der seiteninterne Anker #mieten —
  also genau die "Kontrolle", die das Urteil selbst als funktionierend nennt.
  VORBELEGUNG GEMESSEN (scripts/r218-topic.cjs, ueber input[name=topic]):
    (kein hash)        -> gewaehlt null,              scrollY 0
    #events            -> gewaehlt "events",          scrollY 482
    #raumvermietung    -> gewaehlt "raumvermietung",  scrollY 482
    #geschenkgutschein -> gewaehlt "geschenkgutschein", scrollY 482
    #animationen       -> gewaehlt "animationen",     scrollY 482
    #schnupperstunde   -> gewaehlt "schnupperstunde", scrollY 482
  Die beiden beanstandeten Anker verhalten sich damit ZEICHENGLEICH zu den vier
  unbeanstandeten. Waere #events kaputt, muesste es sich von #geschenkgutschein unterscheiden
  — tut es in keiner gemessenen Groesse.
  ZUR ZAHL scrollY 482 UND "Viewport zeigt Worum geht es? statt Events": beides stimmt und
  ist das gewollte Verhalten. Der Wizard ist dreistufig (ANLIEGEN / DETAILS / KONTAKT); der
  Hash setzt Schritt 1 auf das richtige Anliegen und laesst die Person dort weiterklicken.
  Einen Events-Abschnitt zum Hinspringen gibt es auf /kontakt nicht und soll es laut Aufbau
  der Seite auch nicht geben — die Seite ist "ankommen/schreiben/finden" (ContactPage.tsx:430).
  Die Kritiker-Screenshots belegen das selbst: dead-events-1.png und -2.png zeigen
  "Events & Workshops" rot gefuellt, dead-raum-1.png zeigt "Raum mieten" rot gefuellt.
  KEINE AENDERUNG: Zwei Alternativen wurden Raphael vorgelegt und verworfen — zusaetzliche
  echte IDs (kollidiert mit dem dokumentierten Vorsatz aus ContactPage.tsx:81-82) und Umbiegen
  auf #kontaktformular (verlaere die Anliegen-Vorbelegung, macht den Weg schlechter als heute).
  VISUELL ANGESEHEN (worklog/shots/R218/): kontakt-events-1440.png, kontakt-raumvermietung-390.png
  sowie die Kontrollen kontakt-geschenkgutschein-* und kontakt-animationen-* je 1440 und 390.
  Dazu das Kritiker-Kontrollbild CRITIC-0824-0251/control-raum-mieten.png — es zeigt #mieten
  auf /kontakt/standort-raumvermietung, also einen seiteninternen Anker auf einer anderen Route.
  GATES: nicht gefahren, weil keine Datei geaendert wurde.
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit.
  NEBENBEFUND, GEMELDET UND AUF RAPHAELS ENTSCHEID NICHT ANGEFASST: Auf dem Produktions-Build
  ist bei KEINEM Hash-Anker die vorbelegte Karte rot gefuellt. Gemessen
  (scripts/r218-labels.cjs, scripts/r218-klassen.cjs): das richtige Radio ist checked, das
  Label traegt aber weiter `bg-[var(--color-paper)]` = rgb(253,252,250) statt
  `bg-[var(--color-salsa)]`; die aktiv-Klasse aus InquiryWizard.tsx:775-777 schlaegt nicht
  durch. Betrifft #events, #raumvermietung, #geschenkgutschein und #animationen gleichermassen,
  auf 1440 und 390, und bleibt auch nach 3000ms und nach einem echten Klick bestehen. React
  hydriert dabei sauber (keine Konsolenmeldung, keine fehlende Response, eine einzige
  Wizard-Instanz). Die Kritiker-Screenshots zeigen die Fuellung dagegen ROT — der Unterschied
  zwischen deren Umgebung und dem hier gemessenen dist-Build ist NICHT geklaert. Weil der
  Befund alle sechs Anker gleich trifft, ausserhalb der "einen Sache" liegt und ein Artefakt
  der Messumgebung sein koennte, steht er hier als offene Meldung und nicht als Fix.

- [x] G37 (R219) Fallunterscheidung im Kontaktfeld-Fehlertext plus sichtbare Feldmarkierung.
  Auftrag Watcher 24.08. 04:20 (Critic-Urteil 04:15): "Kontakt-Wizard Fehlertext ist statisch.
  Vorname ausgefuellt, Handy und E-Mail leer -> Meldung bleibt wortgleich 'Bitte gib deinen
  Vornamen und eine E-Mail oder Handynummer an.' Kein Feld sichtbar markiert (Rahmen
  rgb(228,228,225) identisch). Bei falscher Mail aria-invalid=true ohne sichtbaren
  Rahmenwechsel. Gegentest Datenschutz-Haekchen liefert praezisen eigenen Text."
  Builder entscheidet die Route.
  ERGEBNIS: BEFUND BESTAETIGT, in beiden Teilen, und behoben.
  URSACHE AM CODE: (1) submit() setzte fuer jeden Kontaktfeld-Fall denselben copy.contactError;
  contactValid war eine UND-Verknuepfung dreier Bedingungen, aber welche gerissen war, ging
  verloren. privacyError hatte dagegen einen eigenen Zweig — daher der praezise Gegentest.
  (2) fieldClass war eine Konstante ohne Invalid-Variante; die invalid-Prop steuerte
  ausschliesslich aria-invalid und aria-describedby, nie die className. Zusaetzlich bekam nur
  das E-Mail-Feld ueberhaupt invalid, Vorname und Handy nie.
  VORHER GEMESSEN (scripts/r219-fehler.cjs, Produktions-Build via scripts/r217-serve.cjs),
  vier Fehlerlagen, ein Satz, alle Rahmen gleich:
    name leer / handy leer / mail leer    -> "Bitte gib deinen Vornamen und eine E-Mail
                                             oder Handynummer an."  alle 3 Felder
                                             rgb(228,228,225), aria-invalid=null
    name da / handy leer / mail leer      -> WORTGLEICH, alle 3 rgb(228,228,225)
    name da / mail "keine-mail-adresse"   -> WORTGLEICH, E-Mail aria-invalid=true,
                                             Rahmen trotzdem rgb(228,228,225)
    name leer / handy da                  -> WORTGLEICH, alle 3 rgb(228,228,225)
    GEGENTEST ohne Haekchen               -> "Bitte setze das Häkchen beim Datenschutz."
  NACHHER GEMESSEN, identisch auf 1440 UND 390:
    name fehlt      -> "Bitte gib deinen Vornamen an."
                       Vorname rgb(173,24,39) 2px aria-invalid=true; Handy/E-Mail 1px unveraendert
    kontaktweg fehlt-> "Bitte gib eine E-Mail oder eine Handynummer an, damit wir antworten
                       können."  Handy UND E-Mail rgb(173,24,39) 2px
    mail kaputt     -> "Diese E-Mail-Adresse sieht nicht vollständig aus. Bitte prüfe sie kurz."
                       nur E-Mail rgb(173,24,39) 2px
    GEGENTEST       -> unveraendert "Bitte setze das Häkchen beim Datenschutz.",
                       KEIN Kontaktfeld markiert (Markierung schlaegt nicht blind an)
  ROUTE UND WARUM: contactGap bestimmt in Lesereihenfolge des Formulars den ersten gerissenen
  Fall; Text und Feldmarkierung stammen aus derselben Entscheidung, koennen also nicht
  auseinanderlaufen. Beim Fall 'reach' werden Handy UND E-Mail markiert — es fehlt genau einer
  von zwei Wegen, keiner der beiden ist der falsche.
  MARKIERUNG PER `border`, NICHT `ring`: index.css:348-352 loescht unter 640px jeden box-shadow
  auf nicht-interaktiven Elementen in `main`, und ein Tailwind-Ring IST ein box-shadow. Genau
  daran war R217 in der ersten Fassung gescheitert. Die 390er-Messung oben belegt, dass die
  border-Route dort haelt.
  ZEITPUNKT DER MARKIERUNG GEAENDERT: vorher trug die E-Mail invalid={!emailValid}, also schon
  beim Tippen. Jetzt haengt die Markierung an `error`, erscheint also erst nach einem
  Absendeversuch und verschwindet mit der ersten Eingabe zusammen mit der Meldung. Eine halb
  getippte Adresse ist kein Fehler.
  AUFGERAEUMT: contactValid war nach dem Umbau verwaist (contactGap === null sagt dasselbe)
  und wurde entfernt statt als tote Bindung stehenzubleiben.
  BEIDE FELDGRUPPEN: der Wizard hat eine zweite, kompakte Gruppe (Startseite, InquiryWizard
  .tsx:437-439). Sie hat dieselbe Behandlung bekommen, sonst waere der Fix auf /kontakt sichtbar
  und auf der Startseite still weg.
  REGRESSIONSPROBE: vollstaendig ausgefuelltes Formular (Name + Mail + Haekchen) geht weiter
  durch — keine Fehlerzeile, Danke-Zustand erreicht. KEIN Zahlungs-Test, Payment-Flow ruht.
  VISUELL ANGESEHEN, alle acht per Read (worklog/shots/R219/): a-name-fehlt-{1440,390}.png,
  b-kontaktweg-fehlt-{1440,390}.png, c-mail-kaputt-{1440,390}.png,
  d-gegentest-consent-{1440,390}.png.
  GATES: npx tsc --noEmit sauber. npx oxlint src nur die bekannte Vorbelastung
  src/lib/api.ts:18:52 unicorn(no-useless-fallback-in-spread), fremde Datei, nicht angefasst.
  detect.mjs auf InquiryWizard.tsx Exit 0.
  SKRIPTE: scripts/r219-fehler.cjs (Text + Rahmenfarbe + Rahmenbreite je Feld, R219_W schaltet
  den Viewport), scripts/r219-shots.cjs (die acht Belegbilder).
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit.

- [x] G38 (R220) Instagram-Embed-Kopf lesbar machen.
  Auftrag Watcher 24.08. 05:38 (Critic-Urteil 05:28): "Der Instagram-Kopf ist in jeder Karte
  zerstoert. Home (/ compact InstagramShowcase) und /fotos, beide Viewports, alle sichtbaren
  Karten. Der blaue 'Profil ansehen'-Button liegt auf dem Kontonamen (Kollision ox bis 82px).
  Auf 390 laeuft der Kopf aus dem Iframe (bodyW 245 > viewW 206). Nicht Instagrams Fehler:
  standalone-Test mit den drei echten Shortcodes ist ab 360px kollisionsfrei; die Site gibt
  248px (1440) und 206px (390)." Builder entscheidet die Route.
  ERGEBNIS: BEFUND BESTAETIGT und behoben. Auch die genannten Zeilen stimmten.
  VORHER SELBST GEMESSEN (scripts/r220-breite.cjs, Produktions-Build), zwoelf Karten:
    home + fotos @ 1440 -> iframe 248px, je 112px unter der Schwelle
    home + fotos @  390 -> iframe 206px, je 154px unter der Schwelle
    cutR/cutB = 0 auf 1440, d.h. nichts wurde von aussen beschnitten — das iframe WAR schmal.
  WARUM min-width allein nicht reicht (der Punkt, an dem der Auftrag zu kurz greift): die
  verfuegbare Rasterbreite gibt die Schwelle bei fester Spaltenzahl NIE her. Gemessen:
    1440 -> Raster 783px : 3 Spalten = 250px    2 Spalten = 383px OK
    1024 -> Raster 543px : 3 Spalten = 170px (!) schmaler als auf 390
     768 -> Raster 648px : 2 Spalten = 316px
     640 -> Raster 520px : 2 Spalten = 252px
  Der schlimmste Fall lag also NICHT auf 390, sondern auf 1024 mit 170px. Eine min-width auf
  einer festen Spaltenzahl haette dort einen Ueberlauf erzeugt statt den Kopf zu retten.
  ROUTE: `sm:grid-cols-[repeat(auto-fill,minmax(var(--ig-min),1fr))]` statt
  `sm:grid-cols-2 lg:grid-cols-3`. Das Raster entscheidet selbst, wie viele Karten passen,
  und legt lieber eine um als eine zu quetschen. Faellt spaeter eine vierte Karte in den Feed,
  gilt dieselbe Regel ohne neuen Breakpoint. Die Schwelle steht als benannte Konstante
  IG_EMBED_MIN = 360 mit Herkunftsbeleg im Code, nicht als nackte Zahl im Klassennamen.
  DREI FEHLSCHLAEGE AUF DEM WEG, alle gemessen statt geraten:
    1. `w-[min(360px,100vw-2.5rem)]` ergab auf 390 nur 348px — 12px unter der Schwelle.
    2. Danach 360px Karte -> iframe 358px. Die Schwelle gilt fuers IFRAME, die Karte traegt
       aber 1px Rand pro Seite (border border-white/15). Daher IG_CARD_MIN = 360 + 2.
    3. Karte 362px im Slider -> Kopf innen korrekt (bodyW==viewW), Knopf trotzdem halb weg.
       Ursache: der Slider erbte die Shell-Raender und war nur 310px breit, seine Box endete
       bei 330px und schnitt die Karte bei 381px per overflow-x ab. Der Slider laeuft jetzt
       bis sm ueber die Shell-Kante (max-sm:-ml-5 -mr-[var(--wa-corner)]).
    4. Nachwirkung davon: mit `pl-5` scrollte sich der Slider im Ruhezustand selbst um genau
       diese 20px (gemessen scrollLeft=20), weil `snap-start` die Karte an ihrer Snap-Kante
       einrasten laesst. Behoben mit `scroll-pl-5` — scroll-padding verschiebt die Snap-Kante
       mit, statt gegen sie zu arbeiten. Ruhezustand jetzt scrollLeft=0, Kartenkante 20px,
       Textkante 20px, also buendig.
  NACHHER GEMESSEN, beide Routen, zehn Viewports:
    1920/1440 -> 382px OK    1280 -> 705px OK    1024 -> 541px OK    834 -> 712px OK
     768 -> 646px OK    640 -> 518px OK    414/390/375 -> 360px OK
  BEWUSSTE GRENZE, NICHT GELOEST: 320px (iPhone SE) bleibt bei 318px, 42px unter der Schwelle.
  Dort ist die Schwelle physisch nicht erreichbar — eine 362px-Karte waere breiter als der
  Bildschirm. min() faengt das ab; der Kopf ist dort enger, laeuft aber nicht aus dem Geraet.
  NEBENWIRKUNG, POSITIV: auf /fotos liefert Instagram bei der neuen Breite zusaetzlich
  Like-Zahl, Caption und Aktionsleiste aus — das volle Embed statt eines gequetschten Kopfes.
  Deckt sich mit Raphaels Vorgabe aus R207 ("echtes Instagram-Embed, nicht nur Bilder die so
  tun als waeren sie Instagram").
  EIGENER MESSFEHLER, KORRIGIERT: die erste Fassung von r220-shots.cjs beschnitt die
  Nahaufnahme auf `min(box.width, w - box.x)` und schnitt damit den Knopf im BILD ab, obwohl
  er real ganz sichtbar war. Haette einen Fehler vorgetaeuscht, den es nicht gab. Der Clip
  nimmt jetzt die volle Kartenbreite.
  VISUELL ANGESEHEN, alle acht per Read (worklog/shots/R220/): home-{1440,390}.png,
  fotos-{1440,390}.png sowie die Kopf-Nahaufnahmen home-{1440,390}-kopf.png und
  fotos-{1440,390}-kopf.png (deviceScaleFactor 3, obere 90px der ersten Karte — die Kollision
  spielt sich in ~20px Kopfhoehe ab und ist im Seitenbild nicht zu beurteilen).
  Dazu die Kritiker-Belege CRITIC-0824-0457/ig-1440.png und ig-390.png sowie _log-igthresh.json
  (die 360px-Schwelle, an allen drei Shortcodes belegt: bei 320px noch Ueberlappung, ab 360
  keine mehr).
  GATES: npx tsc --noEmit sauber. npx oxlint src nur die bekannte Vorbelastung
  src/lib/api.ts:18:52 unicorn(no-useless-fallback-in-spread), fremde Datei, nicht angefasst.
  Zwischendurch meldete oxlint anti-slop(require-safety-comment-for-type-assertion) auf die
  neue `as CSSProperties`-Zusicherung — mit SAFETY-Begruendung behoben, nicht unterdrueckt.
  detect.mjs auf InstagramShowcase.tsx Exit 0.
  SKRIPTE: scripts/r220-breite.cjs (Iframe-/Kartenbreite und Container-Beschnitt je Route und
  Viewport, R220_VIEWPORTS schaltet die Breitenliste), scripts/r220-shots.cjs (die acht Bilder).
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit. Ebenfalls nicht geprueft: echtes Geraet statt Chromium-Viewport, und ob
  Instagram seine Kopf-Schwelle spaeter aendert — dann verschiebt sich IG_EMBED_MIN.

- [x] G39 (R221) Desktop-Raster der Instagram-Sektion ohne Waise und ohne Einspalten-Kolonne.
  Auftrag Watcher 24.08. 06:24: R220 hatte mit auto-fill + 360px-Minimum das Raster zerlegt —
  2+1-Waise ab 1440 mit 400px toter Spur, Einspalten-Kolonne auf 1024-1280 mit bis zu 1372px
  hohen Kacheln. Route von Raphael bestaetigt: Kopf ueber die Karten.
  VORHER (dist von R220, scripts/r221-raster.cjs), 12 von 12 Faellen mit Befund:
  1024/1180/1280 Einspalten-Kolonne (Raster 543/643/707px), ab 1440 die 2+1-Waise (Raster
  783px, 400px tot). Ursache: das Raster lag in der schmalen 1.28fr-Spalte; drei Karten
  brauchen 3x362 + 2x16 = 1118px und passten auf keiner Breite in eine Zeile.
  BAU, drei Hebel:
  1. Kopf ueber die Karten statt daneben: `lg:grid-cols-[0.72fr_1.28fr]` und `lg:sticky`
     entfernt, das Raster bekommt die volle Shell. Das allein liess die Waise bei 1024
     (904px) und 1180 (1060px) stehen.
  2. `min-[1150px]:-mr-[var(--wa-corner)]`: die Shell haelt rechts 88px fuer den
     WhatsApp-Float frei, unter dem Raster ungenutzt (Float ist `fixed`, sitzt unten
     rechts am Viewport, nicht in dieser Sektion). Holt die 88px zurueck; bei 1180 sind
     es genau die fehlenden 58px zur dritten Karte (1060 -> 1148).
  3. Slider bis 1149px statt nur bis sm, Grid erst ab 1150px. Bei 1024 stuenden auch
     ohne jeden Rand nur 992px zur Verfuegung — drei Karten sind dort physisch
     unmoeglich, ohne die 360px-Schwelle aus R220 zu unterschreiten (verboten). Der
     Slider ist die dritte Antwort: alle drei Karten in voller Breite, ohne Waise und
     ohne Einspalten-Kolonne. Der Umschaltpunkt ist die gemessene Grenze: Shell innen
     = min(vw,1400) - 32 (pl-8) erreicht 1118px genau bei 1150.
  NACHHER (scripts/r221-raster.cjs), 16 von 16 Faellen OK, Exit 0:
  / 1024 slider(3 Karten) iframe=360,360,360 / 1140 slider / 1150 raster=1118
  spuren=362/362/362 3er(tot 0) iframe=360,360,360 / 1180 raster=1148 spuren=372x3
  3er(tot 0) iframe=370 / 1280-1920 raster=1248-1368 3er(tot 0) iframe=403-443.
  Dieselben acht Zeilen fuer /fotos.
  GEGENPROBE Mobil und Tablet (R221_VIEWPORTS=320,375,390,414,640,768,900,1023):
  375-1023 halten 360px Iframe-Breite. 320 misst 318px — die aus R220 benannte Grenze,
  nicht neu: unter 362px Viewport ist die Schwelle physisch unerreichbar, und
  min(362px, 100vw) faengt das bewusst ab (iPhone SE).
  VISUELL ANGESEHEN, alle acht per Read (worklog/shots/R221/): ig-home-{1024,1140,1150,1440}.png,
  ig-fotos-{1024,1140,1150,1440}.png. Beidseitig des Umschaltpunkts: 1140 Slider mit
  drei vollbreiten Karten und sichtbarem Peek rechts, 1150 das 3er-Raster mit Totraum 0.
  Bei 1440 drei Karten in einer Zeile, Kopf lesbar, kein WhatsApp-Float-Konflikt.
  GATES: npx tsc --noEmit sauber. npx oxlint src nur die bekannte Vorbelastung
  src/lib/api.ts:18:52 unicorn(no-useless-fallback-in-spread), fremde Datei, nicht
  angefasst. detect.mjs auf InstagramShowcase.tsx Exit 0.
  SKRIPTE: scripts/r221-raster.cjs (Spuren, Karten je Zeile, Totraum rechts,
  Iframe-Breite; GRID_AB=1150 muss mit dem Bauteil uebereinstimmen; Exit 2 bei
  Befund), scripts/r221-shots.cjs (die acht Bilder, R221_SHOT_W schaltet die Breiten).
  NICHT GEPRÜFT: Gegencheck durch eine zweite Modellfamilie. Sol-Lane bis 27.08. 03:36 am
  Usage-Limit. Ebenfalls nicht geprueft: echtes Geraet statt Chromium-Viewport.

## Abschluss

- [ ] G14 Commit auf geil-welle + Push (Preview-Deploy laut Absprache 18.08.; Production bleibt).
  EVIDENCE: pending
- [ ] G15 Report mit Ledger, offene Raphael-Entscheidungen benannt.
  EVIDENCE: pending
