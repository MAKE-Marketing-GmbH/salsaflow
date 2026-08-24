/goal

<role>
builder
Item-Loop und Produktcode. write_set nur hier.
Critic 3e60fc23 lebt separat — kein zweiter /ultracode dort, keine Critic-TUI.
</role>

<goal>
Rufe /goal auf, bevor du baust. Skill: /root/.grok/skills/define-goal/SKILL.md
Objective: Sitewide-Footer-Spaltenkopf "Folg uns" bleibt zwei Woerter nach uppercase+letter-spacing (liest sich als FOLG UNS, nie als FOLGUNS) auf Home und /fotos bei 1024 und 1440.
Beweis: eigene Shots worklog/shots/R222/ footer-home-1024.png und footer-home-1440.png, Wortfuge sichtbar; Critic-Beleg raster-home-1024.png nicht als eigenes Urteil verkaufen.
Stopp: Raster/IG-Kopf nicht anfassen; kein Push.
</goal>

<bar>
Decke: Signum.ch-Klarheit im Sitewide-Footer — Versal-Label lesbar als Woerter, nicht als Kunstwort. Immer drueber als "Tippfehler im Footer einer Tanzschule".
Referenzen (Lead scoutet selbst, 3-5, nicht auf eine Datei festjagen):
1. https://signum.ch — strukturelle Raphael-Referenz: Footer-Labels als klare Woerter.
2. https://www.salsabor.co.uk — Studio-Footer, Versal-Navigation lesbar.
3. Godly/Awwwards Studio-Footer mit letter-spacing, Wortfuge haelt.
4. Critic-Shot worklog/shots/CRITIC-0824-0709/raster-home-1024.png — IST: FOLGUNS klebt (Reject-Latte).
Layout/Copy/Logo nicht kopieren.
</bar>

<workflow>
Lies zuerst:
- /root/.grok/skills/define-goal/SKILL.md
- /root/clients/salsaflow-w1/worklog/watchdog/HANDOFF-2026-08-24-builder.md (Original Raphael zuerst)
- /root/clients/salsaflow-w1/worklog/watchdog/HANDOFF-2026-08-23-original-prompt.md
- /root/clients/salsaflow-w1/worklog/watchdog/CRITIC-2026-08-23.md  (nur Pass 07:09 Kopf)
Dann DESIGN/DECISIONS falls noetig.
Starte /ultracode (sonst /workflow). Tasks. Ein Task = diese Footer-Wortfuge. Lead zerlegt selbst (Content vs CSS vs Heading-Komponente).
</workflow>

<gauntlet>
Fan out: ein starker Sub je Stueck, disjunkte Dateien (SiteFooter.tsx vs index.css vs content.ts — nicht drei Schreiber auf derselben Datei).
/loop je Stueck. Eigener harter Kritiker mit frischem Kontext.
Kritiker liest echte PNGs, nie die Builder-Zusammenfassung.
Blind A/B gegen die Latte (Signum-Klarheit + Critic-Shot als Reject). Eine groesste Luecke, ein Beleg.
Verliert unseres: zurueck an den Builder. Nicht nach drei Runden stoppen.
Stopp: Raphael-Stopp oder Plateau (zwei Runden, gleiche Luecke, kein sichtbarer Zugewinn).
/ultracode. Builder benotet sich nie selbst.
</gauntlet>

<phase-plan>
Skills lesen. Tasks anlegen. Schreibpfade trennen. Gate je Task: Shot 1024+1440 Footer-Kopf mit sichtbarer Wortfuge. Parent (diese TUI) schreibt Produktcode nur im Workflow.
</phase-plan>

<phase-bau>
Driver kimi-k3. Luna Masse, Opus Frontend wenn Sub noetig, Grok Code, Sol harter Fix.
Fable-Subagent tot. Haiku/Sonnet tot. Grok nicht als Frontend-Driver.
</phase-bau>

<phase-kritik>
Andere Familie als der Builder. Gate: PNG Footer 1024 und 1440, Home und /fotos.
FAIL mit Beleg = Fix, dann Kritik. Keine feste Rundenzahl.
</phase-kritik>

<modelle>
Driver dieser TUI: kimi-k3. Effort high.
Haiku tot. Sonnet tot. Fable-Subagent tot. Fable-TUI-Driver erlaubt, hier nicht noetig.
Kimi-Sub nur Look/Copy. Grok nicht Frontend.
</modelle>

<stand>
Selbst messen, kein Handoff-Satz als Stand.
Vite http://127.0.0.1:5173 HTTP 200 (w1). 5175 down.
Critic Urteil Pass 07:09 mtime 07:55:23 CEST: Raster HAELT 18/18; neue Luecke FOLGUNS.
Shots: worklog/shots/CRITIC-0824-0709/raster-home-1024.png
Dateien: src/public/home/content.ts:286 followTitle 'Folg uns'; src/public/site/SiteFooter.tsx:255 FooterHeading; src/index.css:442 .type-h4 letter-spacing 0.16em.
Toter Vorgaenger: e963b534 Fertig R221 06:59:23 CEST.
</stand>

<locks>
Production / Jimdo / https://salsaflow-dc.vercel.app / www.salsaflow-dc.com: nicht anfassen. Ersatz: lokal 5173 + geil-welle Preview.
Kein Push. Kein git add -A. Kein Merge/Rebase geil-welle vs main.
stash@{0}: nicht droppen.
Nicht resume 5227c5b4 (A7-Wait). Siblings 1ab17523 / e9b8fda4 / 1d4d7442 nicht toeten.
Keine Payment-Tests.
R218 AskUser und IG-Raster AskUser schon beantwortet — nicht erneut fragen.
Raster Waisen-Karte / Einspalten-Kolonne: HAELT (Pass 07:09) — nicht aufmachen.
Instagram-Kopf: HAELT (Pass 06:07/R220) — nicht aufmachen.
Form-error, tote CTA-Anker, Level-Pille, FAQ mediaCount, /mehr/partys, Home-Levels, Ueber-uns-Hero, FAQ-Hero, Events-Leiste, cookie 390, Fade: nicht erneut.
320 px iPhone SE: benannte Grenze R220, keine neue Luecke.
"Mach alles besser" tot.
</locks>

<auftrag>
Ist: Im Shot raster-home-1024.png stehen die Footer-Spaltenkoepfe KONTAKT · ENTDECKEN · FOLGUNS. Der dritte klebt zu einem Kunstwort. Content-String ist korrekt 'Folg uns'; .type-h4 uppercase + 0.16em letter-spacing frisst die Wortfuge.
Soll: Wortfuge bleibt sichtbar nach Versal+Sperrung. Messbar auf Home und /fotos, 1024 und 1440. Aendere nur was die Fuge braucht (FooterHeading / .type-h4-Ausnahme / letter-spacing / word-spacing / nbsp — Lead entscheidet anhand Shot). followTitle-Text 'Folg uns' nicht in ein Einwort aendern als "Fix".
Stopp: Push ohne Raphael-Wort. Raster/IG-Kopf. Gesperrte Pfade. Mini-Solo ohne Workflow. Zweites Ultracode in der Critic-TUI.
Handoff-Pfad: /root/clients/salsaflow-w1/worklog/watchdog/HANDOFF-2026-08-24-builder.md
</auftrag>

<beweis>
Eigene Shots worklog/shots/R222/footer-home-1024.png footer-home-1440.png footer-fotos-1440.png — "FOLG UNS" als zwei Woerter lesbar, nicht FOLGUNS.
Critic-Pass-07:09-Datei bleibt; kein write dort ausser watchdog-Notiz wenn noetig.
Kein git add -A.
</beweis>

<stopp>
Kein Push. Kein Production. Kein Jimdo.
Kein git add -A. stash@{0} bleibt.
Kein Resume 5227c5b4. Siblings unangetastet.
Kein Raster-Redo. Kein Instagram-Kopf-Redo.
Keine Payment-Tests. Kein orca-ide terminal send (Watcher).
Ship nur Raphael-Wort oder 19.08.-Kette.
</stopp>
