# HANDOFF 2026-08-24 builder — salsaflow-w1 (new TUI)

## R222 FERTIG (Builder-TUI, 2026-08-24) — Footer-Wortfuge FOLG UNS

Critic-Luecke Pass 07:09 (FOLGUNS klebt) ist geschlossen.

- Fix: `src/public/site/SiteFooter.tsx` FooterHeading bekommt `[word-spacing:0.2em]` (Runde 1 mit 0.5em FAILte die Kritik — zu weit aufgerissen, wirkte wie zwei Labels). Einzige geaenderte Produktdatei. `.type-h4` (index.css:442) und `content.ts:286` unangetastet — Label-Klasse haengt an sechs weiteren Stellen, Content-String 'Folg uns' bleibt zwei Woerter.
- Wirkung: Wortfuge ~11px gegen ~2px Buchstabenabstand — FOLG UNS liest sich als zwei Woerter, bleibt EIN Label. KONTAKT/ENTDECKEN unveraendert (kein Leerzeichen, keine Wirkung).
- Eigene Belege: `worklog/shots/R222/footer-home-1024.png`, `footer-home-1440.png`, `footer-fotos-1440.png` (gezielte Footer-Crops, dsf 2).
- Build: `npm run build` gruen (26 Routen + Prerender).
- Kritik (opus-critic, andere Familie, frischer Kontext, las echte PNGs): Runde 1 FAIL (0.5em zu weit) → Fix → Runde 2 **PASS**: beide Latten halten (unten kein FOLGUNS, oben keine Zwei-Label-Optik), keine Seitenwirkung, Einwort-Koepfe sauber. Kleinste Beobachtung ohne Blocker: Fugen-Faktor ~4.6x statt kommunizierter 2.2x (Rechenfehler in der Uebergabe, visuell im Zielkorridor).
- Locks eingehalten: kein Push, kein git add -A, stash@{0} unberuehrt, Raster + Instagram-Kopf nicht angefasst, keine Payment-Tests. Uncommitted wie der Rest des Worktrees.
- NICHT selbst commiten/pushen — Ship nur auf Raphael-Wort.

---


Spawned by Grok watcher 2026-08-24 08:00 CEST. Dead builder e963b534 wrap 5cf2e897: TUI gone after Fertig R221 06:59 CEST, pts/42 no proc, no Orca tab. Critic 3e60fc23 Pass 07:09 IDLE. Do NOT resume 5227c5b4. Do not kill siblings 1ab17523 / e9b8fda4 / 1d4d7442.

---

## Original Raphael (bindend, zuerst)

ultracode

Du setzt R189 an salsaflow-w1 fort. Kein Recap. Kein Fragen. Fertig machen.

Worktree: /root/clients/salsaflow-w1
Repo-Root: /root/clients/salsaflow
Branch: geil-welle
Dev-Server: http://127.0.0.1:5173
stash@{0} NICHT loeschen.
Production gesperrt, bis Raphael ausdruecklich Production sagt.
Kein git add -A. Kein Kundenkontakt. Keine Secrets.

Originalauftrag (bindend):
- Echte Scroll-Animation, nicht tot.
- WhatsApp rechts unten, weiss auf Gruen, lebendig, keine Kollision.
- Home und /kursplan gleiche Kurszeile. Ganze Zeile Hover rot, Titel+CTA weiss.
- Events-Block stark.
- Framer Motion: rise, clip, blur, Wort-Stagger.
- SSR ohne JS sichtbar. Reduced Motion ruhig und nutzbar.
- Kursplan = Primaeraktion. Schnupperstunde sichtbar, zweitrangig.
- Home direkt nach Hero: vier Angebote.
- signum.ch = strukturelle Referenz.
- Neue Bilder nur echte hochaufloesende Quellen.
- Jede Aenderung braucht echte Screens.

Volltext: worklog/watchdog/HANDOFF-2026-08-23-original-prompt.md

## Raphael-Kette (additiv, kein Erstauftrag-Ersatz)

Site muss geil sein: echtes Rot, Typo/Icons konsistent, WhatsApp weiss-auf-gruen lebendig, Mobile bombastisch, immer Screens + Scroll-Tests.
22.08: Reveal ploppt; Mobile komisch; unebene Sections; Breite nach Hero kaputt; mehr Luft unter Subline.
23.08: UI mit Screenshots pruefen; Loop bis utterly perfect; nur Designfehler; keine Payment-Tests.
23.08 16:19: er will nicht entscheiden — Session schaut, ob es wirklich gut aussieht; ueberall klicken; Hover mobil UND desktop.
Model-Policy 23.08: watch all, do not build frontend. Driver dieser TUI: kimi-k3 (Kimi haelt nach 503). Nie haiku/sonnet. Nie grok als Frontend-Driver.

## Ist (Watcher 07:59 CEST)

- Builder e963b534 tot. Letztes Wort 06:59:23 CEST: R221 fertig, alle Gates gruen. Desktop-Raster 1024-1920 ohne Waise, ohne Einspalten-Kolonne, Iframe 360px aus R220 gehalten.
- Critic 3e60fc23 Pass 07:09 (Urteil-Kopf 07:55:23 CEST): Instagram-Raster HAELT, 18/18 Messpunkte sauber. Instagram-Kopf HAELT (R220).
- Neue groesste Luecke: Footer-Ueberschrift FOLGUNS (siehe unten).
- Vite http://127.0.0.1:5173 HTTP 200. 5175 down.
- Branch geil-welle, worktree /root/clients/salsaflow-w1.
- Dead w1 5227c5b4 waiting A7 — nicht spawnen, state.json dort nicht ueberschreiben.

## Neue Luecke (Critic Pass 07:09) — NUR DIESE

Footer-Spaltenkopf FOLGUNS liest sich als ein Wort / Tippfehler, sitewide.

Kette (Critic nur gelesen):
- Quelle: src/public/home/content.ts:286  followTitle: 'Folg uns' (korrekt getrennt)
- Render: src/public/site/SiteFooter.tsx:255  FooterHeading followTitle
- Stil: src/index.css:442  .type-h4  text-transform: uppercase; letter-spacing: 0.16em

Kein Datenfehler. Versal-Sperrung schliesst den Leerschritt optisch. KONTAKT und ENTDECKEN sind Einwort-Koepfe und kippen nicht; FOLG UNS ist der einzige zweiwortige Kopf und kippt genau deshalb.
Belege: worklog/shots/CRITIC-0824-0709/raster-home-1024.png (Footer im Frame), raster-fotos-1440.png, raster-home-1150.png, critic-raster-0709.mjs, CRITIC-2026-08-23.md Pass 07:09.

Nicht erneut bauen (HAELT / schon gepastet): Fade, cookie 390, Events-Leiste, FAQ-Hero Home-Paar, Ueber-uns-Hero, Home-Levels void, /mehr/partys, /faq mediaCount 0, tanzkurse Level-Pille, tote CTA-Anker, Kontakt-Wizard form-error, Instagram-Kopf, Desktop-Raster Waisen-Karte / Einspalten-Kolonne.
R218 und IG-Raster AskUser schon beantwortet — nicht erneut fragen.
320 px iPhone SE = benannte Grenze R220, keine neue Luecke.

## Stopp

- Kein Push. Kein Production. Kein Jimdo. Kein salsaflow-dc.vercel.app / www.salsaflow-dc.com.
- Kein git add -A. stash@{0} bleibt.
- Kein Resume 5227c5b4. Siblings 1ab17523 / e9b8fda4 / 1d4d7442 nicht anfassen.
- Keine Payment-Tests. Kein "mach alles besser".
- Raster und Instagram-Kopf nicht aufmachen.
