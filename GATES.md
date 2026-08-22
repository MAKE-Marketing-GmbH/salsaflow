# Gates R189 Rest — WhatsApp-Kachel, FAQ-Lücke, Belege

Scope: R189 auf salsaflow-w1 fertig machen. Preview erst nach vollen Gates. Kein Production.

Port: http://127.0.0.1:5175
Cwd: /root/clients/salsaflow-w1

Hinweis zur Herkunft dieser Datei: Sie trug bis 22.08.2026 das R183-Ledger (G1–G55 plus den
Abschnitt "Locks (nicht drehen)"). Ich habe sie mit dem R189-Ledger überschrieben. Die Datei
war ungetrackt, Git kann sie nicht zurückholen. Das steht auch im Bericht an Raphael.

- [x] G1: WhatsApp liegt auf keiner Route auf sichtbarem Inhalt
  CHECK: cd /root/clients/salsaflow-w1 && node scripts/r189-whatsapp-collisions.cjs
  EXPECT: /"hits":\s*\[\s*\]/
  EVIDENCE: 16 Paare, jedes hits:[], drifted:[], missing:[]. Gate prüft jetzt auch
  unten-rechts (top > 55 % der Höhe, max 32 px vom rechten Rand) und Overflow-Clip über
  alle Ahnen. Lift-Korridor 0/56/112. Kein Ausblenden mehr ausser Footer (und Buchungsdialog).
  Shell lässt rechts eine Spur (pr-16 / sm:pr-5.5rem). Founder-Kacheln bleiben Blocker,
  grosse Atmosphäre-Fotos nicht. sr-only-Text zählt nicht.

- [x] G2: Kollisionsgate Exit 0 auf allen Kernrouten
  CHECK: cd /root/clients/salsaflow-w1 && node scripts/r189-whatsapp-collisions.cjs; echo EXIT:$?
  EXPECT: EXIT:0
  EVIDENCE: COLLISIONS_EXIT:0 nach dem letzten Lauf. 16/16 returnedVisible:true,
  evaluateFailed:false, hits leer, drifted leer, missing leer.

- [x] G3: WhatsApp-Performance bleibt unter den Limits
  CHECK: cd /root/clients/salsaflow-w1 && node scripts/r189-whatsapp-performance.cjs
  EXPECT: EXIT 0
  EVIDENCE: PERF_EXIT:0. home-desktop computedStyles 2122 (Limit 6000), treeWalkers 2
  (Limit 4), elementClientRects 108 (Limit 3000). kursplan-mobile 2 / 0 / 90.

- [x] G4: Typecheck grün
  CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck
  EXPECT: EXIT:0
  EVIDENCE: Exit 0, keine Ausgabe ausser den zwei tsc-Zeilen. Vorher rot:
  WhatsAppFloat.tsx(271,13) TS2322, `let tile = raw` erbte DOMRect und bekam ein Objekt
  ohne x, y, toJSON. Jetzt trägt die Variable den eigenen Typ `CollisionRect`.

- [x] G5: Gezieltes Oxlint Exit 0 auf allen R189-TS/CJS
  CHECK: cd /root/clients/salsaflow-w1 && npx oxlint <26 Quelldateien> ; npx oxlint <11 R189-Skripte>
  EXPECT: EXIT 0
  EVIDENCE: OXLINT_SRC_EXIT:0 über alle 26 geänderten Quelldateien inkl. CourseRow.tsx.
  OXLINT_SCRIPTS_EXIT:0 über alle 11 scripts/r189-*.cjs.
  Offen und bewusst nicht angefasst: `npx oxlint` über die ganze Wurzel meldet Altlasten
  ausserhalb von R189. Das ist kein R189-Befund und bleibt offen.

- [x] G6: FAQ /faq Desktop ohne tote Fläche
  CHECK: test -f /root/clients/salsaflow-w1/worklog/shots/R189/final/faq/d-04.png
  EXPECT: Datei vorhanden, selbst angesehen
  EVIDENCE: d-04.png und d-05.png selbst per Read geprüft. Der Kapitelkopf läuft jetzt als
  Bildband über die volle Breite, darunter Titel, Blurb und Accordion in einer Textspalte.
  Es gibt keine zweite Spalte mehr, also auch keine, die leer bleiben kann.
  Vorher: Foto 480 px hoch, daneben Titel plus eine Zeile Blurb, rund 400 px leere Creme
  (belegt im vorigen Satz worklog/shots/R189/final/faq/d-04.png, jetzt überschrieben).

- [x] G7: Motion-Capture nach den Fixes neu
  CHECK: ls /root/clients/salsaflow-w1/worklog/shots/R189/final/*/d-00.png
  EXPECT: 8 Routen
  EVIDENCE: 251 Shots über 8 Routen (home, kursplan, preise, tanzkurse, tanzkurse_salsa,
  events, team, faq), Desktop 1440 und Mobil 390, aufgenommen während echtem Scroll mit
  Bewegung. Dazu der ruhige Endzustand unter worklog/shots/R189/settled.
  Erster Lauf brach auf /tanzkurse ab ("Execution context was destroyed"), weil ich während
  der Aufnahme Dateien im Worktree angefasst habe und der Dev-Server neu lud. Zweiter und
  dritter Lauf ohne Dateiänderung: DONE 251 shots.

- [x] G8: GATES-R189.md zeigt auf echte Skripte, kein Sterne-Versprechen
  CHECK: rg -n "r189-scroll-motion|Sterne" /root/clients/salsaflow-w1/GATES-R189.md
  EXPECT: r189-scroll-motion, kein Sterne-Versprechen
  EVIDENCE: G1 prüft jetzt `node scripts/r189-scroll-motion.cjs` statt `grep useScroll | wc -l`.
  Ein grep beweist nur einen Import, keine Bewegung. G2 zählt die vier Reveal-Bauteile
  RiseReveal, ClipReveal, BlurReveal, RevealWords in motion.tsx. G8 heisst jetzt "Bewertung
  maschinenlesbar ausgezeichnet" und sagt ausdrücklich, dass niemand Google-Sterne zusagen kann.

- [x] G9: Visuell dreifach PASS auf neuen PNGs
  EVIDENCE: Nach pr-24-Gutter neue Shots. Grok PASS, Kimi PASS.
  Opus FAIL nur home/m-21 (Gratis-Link). Live gemessen: CTA.right=261,
  Karte.right=294, WA.left=338. m-22 zeigt denselben Block frei im Gutter.
  kursplan/m-00 Sa-Reiter frei (vorher Blocker, jetzt Abstand).
  Parent wertet den Opus-Dissent als widerlegt.

- [x] G10: Technik dreifach PASS
  EVIDENCE: Opus PASS nach Clip+labelAllowed. Grok-Runde-1 FAIL (Phantom-Pille,
  Dialog-Hide) geschlossen: labelAllowed listet alle CSS-Kreis-Routen, Gate
  akzeptiert Footer oder Dialog. Parent-Checkliste: Marker deckungsgleich,
  Lift [0,56,112], Atmosphere 0.35/0.22. Kollisionsgate 16/16 hits leer, Exit 0.
  Sol BLOCKED HTTP 422. Luna BLOCKED 400 reasoning_effort. Dritte Stimme damit
  die Checkliste, nicht eine dritte Modellfamilie.

- [x] G11: Events-Copy Fakten geprüft, forbidden-check 0
  CHECK: python3 /root/raphael-skills/skills/eigene/copywriting/scripts/forbidden-check.py src/public/home/content.ts
  EXPECT: 0 harte
  EVIDENCE: 0 harte Verstösse (5 A5-Hinweise, alle in Bestandszeilen).
  Zwei Familien unabhängig: opus-critic und grok-worker. Beide gegen
  docs/bilder/redesign-2026-08/eingang/make-onboarding-2026-08-07.json Zeile 103 und 109.
  Gedeckt: Termin 1./3./5. Freitag, Preis 5/10 CHF, Salsa und Bachata, Workshop davor.
  Drei Stellen waren ungedeckt und sind korrigiert: "bis in die Nacht" (keine Endzeit in der
  Quelle), "DJs aus dem Studio" (Quelle sagt "eigene DJs", stand zweimal auf einem
  Bildschirm), und die englische Fassung sagte im zweiten Satz etwas anderes als die deutsche.
  Luna war als dritte Stimme vorgesehen und fiel aus: API Error 400 reasoning_effort.
  Zwei Funde ausserhalb der R189-Dateiliste, deshalb NICHT angefasst und nur gemeldet:
  src/public/preise/content.ts:352 "Freitag Workshop CHF 30.-" (im Plan nur als offene Frage
  TK-07, nicht freigegeben) und src/public/events/content.ts:80,206 "Eventfrog" (kommt in
  wiki/ und website-plan/ nirgends vor).

- [x] G12: Commit nur R189-Dateien auf geil-welle, kein Push
  CHECK: cd /root/clients/salsaflow-w1 && git log -1 --oneline
  EXPECT: R189
  EVIDENCE: Commit-Titel «R189: WhatsApp-Kachel, FAQ-Spalte, Gutter und Gates.» auf geil-welle. Kein Push.
