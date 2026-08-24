# HANDOFF 2026-08-23 critic — salsaflow visual critic (new TUI)

Spawned by Grok watcher 2026-08-23 16:19 PT because Raphael said: start a NEW session that criticizes the whole Salsaflow site, SOMEWHERE ELSE. Do not touch the working builder.

Live builder (DO NOT TOUCH): e963b534 / 5cf2e897 (salsaflow-main, AAA/building), orca term_f665f3b9, pts/42, project /root/clients/salsaflow.
Dead w1 TUI (leave dead, do not resume): 5227c5b4 waiting A7. Do not overwrite worklog/watchdog/state.json.
Siblings (do not kill): 1ab17523 / e9b8fda4 / 1d4d7442.

---

## Original Raphael (verbatim gist, additive, first)

Site must be **geil**:
- Real red, not pastel.
- Consistent type and icons.
- WhatsApp white-on-green, lebendig, no collisions.
- Mobile bombastisch.
- Always screenshots + scroll tests.

Structure:
- Kursplan is primary.
- Same course row on Home and /kursplan.
- Schnupper second.
- Home after Hero = four offers.
- Events strong.

Motion:
- Real scroll motion, not dead fade.
- Framer Motion: rise, clip, blur, Wort-Stagger.
- SSR without JS still visible. Reduced motion quiet and usable.

22.08 voice:
- Reveal ploppt.
- Mobile sieht komisch aus.
- Uneven sections.
- Breite kaputt nach Hero.
- More space under subline.

23.08:
- Check UI with screenshots.
- Loop until utterly perfect.
- Nur Designfehler.
- No payment tests.

TODAY 23.08 16:19 PT Raphael (this chat):
- He does NOT want to decide.
- The session must look whether it actually looks good.
- Click everywhere.
- Hover-test mobile AND desktop.
- He hates the mobile menu: the Menu button appears again INSIDE the open menu — looks like a container in a container, "so dumm".
- More screenshots of the ENTIRE site.

Earlier bind (HANDOFF-2026-08-23-original-prompt.md):
- Worktree live dirty tree: /root/clients/salsaflow-w1
- Repo-Root: /root/clients/salsaflow
- Branch: geil-welle
- Dev-Server: http://127.0.0.1:5173 (Vite on w1; 5175 is down)
- stash@{0} NICHT loeschen.
- Production gesperrt until Raphael says Production.
- Kein git add -A. Kein Kundenkontakt. Keine Secrets.
- Home und /kursplan gleiche Kurszeile. Ganze Zeile Hover rot, Titel+CTA weiss.
- signum.ch = strukturelle Referenz.
- Neue Bilder nur echte hochaufloesende Quellen.
- Jede Aenderung braucht echte Screens.

---

## Critic brief (role)

ROLE: visual critic only.
- Do not implement unless a finding is a one-line CSS and you already have a PNG proof.
- Prefer write findings to worklog/watchdog/CRITIC-2026-08-23.md with PNG paths.
- Look at LOCAL http://127.0.0.1:5173 (Vite on w1, R190/R205 dirty) AND preview https://salsaflow-dc-git-geil-welle-make-marketing-gmbh.vercel.app (preview is R189 only).
- Desktop 1440 + mobile 390 + 360.
- Click every primary nav route and hover every CTA/nav/course-row/WA.
- First shot: mobile menu OPEN. Confirm or refute the double Menu-button / container-in-container.
- Routes: / /kursplan /events /tanzkurse /tanzkurse/salsa /faq /team /preise /fotos /kontakt /buchung
- Use existing shots under worklog/shots/R190 and fertig/r205/ plus NEW shots you take.
- /model opus then /effort medium.
- Do not push, do not touch production/Jimdo, do not kill siblings 1ab17523/e9b8fda4/1d4d7442, do not resume 5227c5b4.

---

## Measured stand (watcher, 2026-08-23 14:20Z)

- Vite 127.0.0.1:5173 HTTP 200 (pid 3523389, salsaflow-w1).
- 127.0.0.1:5175 down.
- Existing shot dirs: worklog/shots/R190, fertig/r205, plus R191-*/S7-*.
- Builder 5cf2e897 lives on /root/clients/salsaflow (not w1). Leave it.
- This critic TUI: same salsaflow repo worktree selector, --project /root/clients/salsaflow-w1 so it sees the live dirty R190/R205 tree.

---

## LOCKS

- Production / Jimdo / https://salsaflow-dc.vercel.app / www.salsaflow-dc.com: do not touch. Ersatz: local 5173 + geil-welle preview only.
- No push. No git add -A. No merge/rebase of geil-welle vs main.
- stash@{0}: do not drop.
- write_set product files: critic must not edit. Only worklog/watchdog/ (+ new PNGs under worklog/shots or worklog/watchdog).
- Do not paste into / resume e963b534, 5cf2e897, 5227c5b4.
- Do not kill 1ab17523 / e9b8fda4 / 1d4d7442.
- No payment tests.
- Haiku/Sonnet/kimi-first: tot. Driver opus medium.
- orca-ide terminal send: tot. tmux paste only (watcher).


- Watcher 14:43Z: Raphael 16:40 P-line (Mobile-Menü: X ohne Pill, Unterpunkte nicht einrücken, Submenü nach rechts, kein Creme-Container/kein Overlay; plus FAQ Desktop: Grid L/R ohne Creme-Spalte/Bildbänder, Hero+CTA, schlank) in builder e963b534 gequeued. Score against MENU-SPEC-2026-08-23.md.
- Watcher 15:15Z / 17:15 PT: Raphael 17:10 home+events + 17:14 Tanzkurse/Ueber uns/Preise P-lines in builder e963b534 gequeued. Score against HOME-EVENTS-SPEC-2026-08-23.md and PAGES2-SPEC-2026-08-23.md.
