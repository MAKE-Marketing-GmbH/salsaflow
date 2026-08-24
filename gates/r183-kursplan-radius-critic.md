# Leaf: kursplan-radius critic Runde 2

KORREKTUR ZU RUNDE 1. Runde 1 hat C7 ("Koepfe ganz") als erfuellt abgehakt.
Das war FALSCH. Sol hat es am echten PNG gefunden: auf 390 schnitt die linke
Bandkante durch den Schaedel des Mannes. Ich hatte nur den SENKRECHTEN Crop
gemessen und den WAAGERECHTEN nie geprueft. C7 steht deshalb unten neu, mit
einer Zahl statt eines Blicks.

- [x] C1 Radius sichtbar und rundum (alle 4 Ecken) auf Desktop-Fold
  CHECK: PNG worklog/shots/r183f-kursplan-radius/kursplan-desktop-1440-00-fold.png per Read
  EXPECT: alle vier Ecken rund, nicht full-bleed an Viewportkante
  EVIDENCE: Read 2026-08-20 Runde 2. Alle 4 Ecken rund, Band im Raster, linke Bandkante fluchtet mit H1.

- [x] C2 Radius sichtbar und rundum auf Mobil-Fold
  CHECK: PNG worklog/shots/r183f-kursplan-radius/kursplan-mobil-390-00-fold.png per Read
  EXPECT: alle vier Ecken rund, Anmutung wie Tanzkurse
  EVIDENCE: Read 2026-08-20 Runde 2. Alle 4 Ecken rund, gleiche Karten-Anmutung wie tanzkurse-mobile-00-fold.png.

- [x] C3 Cookie-offen Desktop: Radius bleibt, Koepfe ganz, keine Ueberlappung
  CHECK: PNG worklog/shots/r183f-kursplan-radius/kursplan-desktop-1440-01-cookie-offen.png per Read
  EXPECT: Band rund, Koepfe ganz, Wochen-Pfeile ueber der Cookie-Leiste
  EVIDENCE: Read 2026-08-20 Runde 2. 4 Ecken rund, Band niedriger, beide Koepfe ganz, Pfeile ueber der Leiste.

- [x] C4 Live-Gate G28 Exit 0, radius >=12px desktop+mobil, Faktor <=2.2
  CHECK: node worklog/.r183-check.mjs g28
  EXPECT: Exit 0; radius desktop >=12; radius mobil >=12; faktor <=2.2
  EVIDENCE: 2026-08-20 Runde 2 selbst gefahren: PASS G28, radius desktop 24px / mobil 24px, faktor 1.38, Exit 0.

- [x] C5 Code: nur SchedulePage, Hausmuster overflow-hidden + --radius-media
  CHECK: grep SchedulePage + CoursesPage Muster
  EXPECT: rounded-[var(--radius-media)] am Eltern-DIV; Shell wie Tanzkurse
  EVIDENCE: SchedulePage.tsx:234-235 = Shell + overflow-hidden rounded-[var(--radius-media)]. CoursesPage.tsx:280-281 identisch.

- [x] C6 Shell-Wrapper gerechtfertigt (sichtbarer Radius, Raster-Flucht)
  CHECK: Screenshot-Abgleich H1-Kante vs Bandkante + CoursesPage-Muster
  EXPECT: Shell ist Voraussetzung fuer sichtbaren Radius
  EVIDENCE: Full-bleed + Radius waere an der Viewportkante unsichtbar. G30 kodiert dieselbe Regel: Karte mit Radius ODER ehrliches Full-bleed ohne Radius.

- [x] C7 KOEPFE GANZ — jetzt gemessen statt angeschaut (Befund Sol, Runde 1 falsch)
  CHECK: node worklog/.r183f-cookie.mjs  (rechnet das sichtbare Quellfenster aus
         Boxmass + object-position + object-cover-Skalierung zurueck)
  EXPECT: sichtbares Quellfenster enthaelt Mann-Haaransatz x280 UND Frau-Haarkante
          x1300 — in BEIDEN Cookie-Zustaenden auf 390
  EVIDENCE: 2026-08-20 Runde 2 selbst gefahren:
    cookie-offen:       box 350x176, pos 30% 20%, Quelle x   93..1883, KOEPFE GANZ true (187px Luft links)
    cookie-akzeptiert:  box 350x240, pos 30% 20%, Quelle x  236..1549, KOEPFE GANZ true (44px Luft links)
    Vorher (Runde 1, derselbe Rechner): Quelle x 394..1706 -> Mann-Haar x280 lag
    114px LINKS ausserhalb des Fensters. Genau der von Sol gesehene Schnitt.
  EVIDENCE PNG: Read 2026-08-20 auf beiden Mobil-PNGs (fold + cookie-offen):
    Hinterkopf des Mannes vollstaendig im Band, sichtbare Luft zur linken Rundung.

- [x] C8 Desktop durch den Fix nicht angefasst
  CHECK: node worklog/.r183f-probe.mjs
  EXPECT: Desktop-Anker bleibt center 20%, Fenster weiterhin volle Quellbreite
  EVIDENCE: desktop-1440 pos "50% 20%", Quelle x 0..2100, box 1336x416, radius 24px.
    Der neue Anker haengt an `object-[30%_20%]` mit `sm:object-[center_20%]`,
    greift also nur unter 640px.

- [x] C9 Motiv und Streckung unveraendert
  CHECK: G28-Zeile
  EXPECT: src hero-paar-studiowand-hero-2100.webp, faktor <= 2.2, kein Tanzkurse-Motiv
  EVIDENCE: src hero-paar-studiowand-hero-2100.webp, faktor 1.38, gleichesMotivWieTanzkurse false.
    Die Bandhoehen sind nicht angefasst worden — Sweep zeigt, dass MEHR Hoehe das
    Quellfenster verengt (h20rem -> 984px) und die Koepfe dann NICHT mehr passen.

OFFEN (nicht von mir zu benoten): Freigabe braucht die unabhaengige Kritik an den
PNGs aus worklog/shots/r183f-kursplan-radius/. Die Kimi-Lane hat in Runde 1 kein
gueltiges Votum geliefert (fremder Kontext), Sols Befund ist oben eingearbeitet.

ABANDON: leftover-other-round nicht R189-Rest
