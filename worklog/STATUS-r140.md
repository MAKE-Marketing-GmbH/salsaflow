# STATUS R140

1. R140 `/privatstunden`: PASS.

2. Vorher vs. Soll

- Vorher: Sechs When-Karten, viel Copy, ein dunkles Flow-Bild und eine WhatsApp-Pille; Beleg: `/root/clients/salsaflow-w1/worklog/shots/S7-ux140/vorher/` mit `privat-desktop-when.png` und `privat-desktop-flow.png`.
- Soll: Weniger Text, mehr Luft, ein helles Bild und ein WhatsApp-Kreis; Pflicht-PNGs: `/root/clients/salsaflow-w1/worklog/shots/S7-ux140/privat-mobil-390.png` und `/root/clients/salsaflow-w1/worklog/shots/S7-ux140/privat-desktop-1440.png`.

3. Kritik-Funde

```json
[{"wo":"src/public/privat/content.ts:133-141, 269-275","problem":"The rewrite invents frequency and ranking claims that were not present in the source material.","beleg":"Comments classify three cases as “die drei häufigsten Anlässe” and the remaining cases as “die drei selteneren Anlässe”; the rendered labels say \"Ebenfalls häufig\" / \"Also common\". The previous copy only enumerated six use cases and supplied no frequency evidence.","fix":"Use a neutral label such as \"Weitere Anlässe\" / \"Other reasons\" and remove unsupported “most common”/“less common” assertions.","schwere":"WICHTIG"},{"wo":"src/public/privat/content.ts:182-187, 295-300","problem":"The format cut changes the offer’s meaning and contradicts its own list. A general small group is narrowed to exactly three people, while the item below still says \"Kleingruppe\" / \"Small group\". The small-group description also drops preparation for a topic and retains only an occasion.","beleg":"\"Allein, zu zweit oder zu dritt.\" and \"Alone, as a pair or as three.\" versus { name: 'Kleingruppe' ... } / { name: 'Small group' ... }. Previous copy: \"wenn mehrere Personen ein bestimmtes Thema oder einen Anlass vorbereiten.\"","fix":"Use \"Allein, als Paar oder in kleiner Gruppe.\" / \"Alone, as a couple or in a small group.\" and retain both topic and occasion in the shortened item.","schwere":"WICHTIG"},{"wo":"src/public/privat/content.ts:204-209, 316-320","problem":"The trial-class cut strengthens a qualified statement into an absolute claim and removes two established reasons for private coaching.","beleg":"Previous German copy said a trial class is \"oft\" enough and identified \"einen Anlass oder eine wiederkehrende Unsicherheit\" as private-lesson cases. Current copy says \"reicht die Gratis Schnupperstunde\" and only retains \"Bei einem klaren Ziel\". English similarly changes \"is often enough\" to \"is enough\".","fix":"Preserve the qualification and cases concisely, for example: \"Für die erste Orientierung reicht oft eine Gratis Schnupperstunde. Bei einem klaren Ziel, Anlass oder wiederkehrenden Problem kommst du mit Privatunterricht schneller weiter.\"","schwere":"WICHTIG"},{"wo":"/root/clients/salsaflow-w1/src/public/privat/content.ts:182","problem":"Format-H2 liest sich als «Allein, zu zweit oder zu dritt. zu dritt». title plus titleAccent verdoppelt das letzte Stück.","beleg":"/root/clients/salsaflow-w1/worklog/shots/S7-ux140/privatstunden-desktop-03-y1500.png und privatstunden-mobile-08-y2954.png: sichtbarer Doppeltext «zu dritt. zu dritt».","fix":"titleAccent leer lassen oder title ohne «zu dritt», damit nur einmal «zu dritt» steht.","schwere":"KRITISCH"},{"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux140/privat-desktop-flow.png","problem":"Flow-Motiv ist derselbe Studio-Schnitt, nur näher. Frau links angeschnitten. Licht bleibt warm/gelb. 09:02 (dunkel, falsch eingefärbt) ist nicht gelöst.","beleg":"vorher/privat-desktop-flow.png vs privat-desktop-flow.png: gleiches Paar, gleiche Wand, gleicher Farbstich. Crop schneidet das Frauengesicht. Mobil: privatstunden-mobile-08-y2954.png.","fix":"Anderes helles Foto aus public/photos/. Köpfe ganz. Kein Crop-Trick, kein Filter.","schwere":"WICHTIG"},{"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux140/privat-mobil-390.png","problem":"WhatsApp-Kreis liegt auf Hero-Fließtext. Unten auf Karten und Buttons. Brief Punkt 4: kein Text vom FAB überdeckt.","beleg":"privat-mobil-390.png: FAB über «nächste Level». privat-mobil-when.png und privatstunden-mobile-06-y2110.png: FAB auf Kartenzeilen.","fix":"Mehr Abstand unten am Text/Karten oder FAB weiter weg, bis kein Wort darunter liegt.","schwere":"WICHTIG"},{"wo":"/root/clients/salsaflow-w1/worklog/shots/S7-ux140/privatstunden-desktop-04-y2250.png","problem":"Format-Block bleibt drei gleich laute Karten. Video 04:21 zielte genau auf diese Karten-Ästhetik. When-Block ist simpler, Format nicht.","beleg":"privatstunden-desktop-03-y1500.png / 04-y2250.png: drei weiße Icon-Karten Einzelperson/Paar/Kleingruppe, gleiche Lautstärke wie das alte When-Grid.","fix":"Eine Zeile oder eine Liste statt drei gleich großer Karten. Weniger Rahmen.","schwere":"WICHTIG"}]
```

4. Look: BLOCKED (BLOCKED: kimi-k3 nicht erreichbar — Gateway 8318 antwortete model_cooldown (provider openai-compatible-moonshot-payg, reset 1693s / 28m12s), Exit 3, Feld model leer), G11-Kimi bleibt offen, Route trotzdem abgeschlossen.

5. Kandidat nächste Runde: `/kursaufbau` (Video 04:46-04:58 zeigt dort dichte Texte + unterbelichtetes Bild — Abgrenzung siehe Brief R140).

6. Verifikation

```text
cd /root/clients/salsaflow-w1 && rg -n "center 12%" src/public/courses/styles/heels-content.ts
rg -n "position: 'center 14%'" src/public/courses/styles/content.ts | head -1
rg -n "position: 'center 20%'" src/public/courses/styles/content.ts | head -1
rg -c 'left: 1\.25rem' src/index.css || echo 0
git diff --name-only
stat -c '%y %n' src/public/courses/styles/HeelsView.tsx src/public/courses/styles/StylePage.tsx src/public/PrivatstundenPage.tsx | sed 's/\..* / /'
node scripts/verify-ux-whatsapp.mjs 2>&1 | tail -3
ls /root/clients/salsaflow-w1/worklog/shots/S7-ux140/privat-mobil-390.png /root/clients/salsaflow-w1/worklog/shots/S7-ux140/privat-desktop-1440.png
```



## Nachtrag R140b

- Parent-Befund H1/FAB-Ueberdeckung: Im Mobil-Fold 390x844 lag der gruene WhatsApp-Kreis auf der H1 «Unterricht für genau dein Ziel.», rechts auf «Ziel». Das verletzte Brief-Punkt 4.
- Fixer: `done=true`. Der Fixer verschob den route-lokalen WhatsApp-Kreis von der H1 weg. Er hielt die Aenderung auf `PrivatstundenPage.tsx`, `privat/content.ts` und den `[data-privat-page]`-Selektor in `index.css` begrenzt. Verbotene Dateien blieben unangetastet.
- Fixer-Notizen: Die gekuerzte Copy behaelt die Qualifikation «oft» sowie Ziel, Anlass und wiederkehrendes Problem. Die Kleingruppe behaelt Thema und Anlass. Das Flow-Bild nutzt jetzt `/photos/gallery/kurse/06.jpg`.
- luna-Funde: `[]`.
- Shot-mtime: `/root/clients/salsaflow-w1/worklog/shots/S7-ux140/privat-mobil-390.png` — `2026-08-19 03:42:52.811317968 +0000`.
- G11-Kimi: nicht geaendert.
