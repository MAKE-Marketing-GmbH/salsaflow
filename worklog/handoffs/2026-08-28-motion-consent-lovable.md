# Übergabe: Salsaflow-Website — Motion, Consent, Klick-Editor

**Stand:** 28.08.2026 · **Projekt:** `/root/clients/salsaflow` (VPS) · **Branch:** `feat/conversion-hero-booking`
**Live:** https://salsaflow-dc.com · https://salsaflow-dc.vercel.app

Salsaflow Dance Company ist eine Salsa-/Bachata-/Heels-Tanzschule in Basel. Die Website ist
eine React-19-MPA (Vite 6, Tailwind 4, Motion) mit Prerender auf 27 Routen, Hono-API und
PGlite als lokaler Datenbank. Deployment über Vercel.

---

## 1. Was in dieser Session gemacht wurde

Vier Commits, alle deployed und live. Details stehen jeweils in der Commit-Message —
hier nur, was man wissen muss, um anzuschließen.

| Commit | Inhalt |
|---|---|
| `a4c64f1` | R206 — WhatsApp-Float als Kreis, Fold-Staffelung beim Seitenwechsel, Reveal-Takt langsamer |
| `28b75e3` | R207 — Schnupperstunde: H1 wieder über das Formular |
| `64a3dc2` | R208 — Cookie-Banner mit Kategorien, Float auf WhatsApp-Grün |
| `b50f6ce` | R209 — Datenschutzerklärung an die Einwilligungs-Schranke angepasst |

**Auslöser** war ein Screenshot des Auftraggebers mit der Kritik: WhatsApp-Button hässlich,
Seitenübergänge zu abrupt, Animationen zu schnell, „Element für Element, bisschen tänzerisch".

### Die vier inhaltlichen Entscheidungen

**a) WhatsApp-Float: Pille → Kreis.** Das Textlabel wurde auf sieben Routen per CSS wieder
ausgeblendet. Sieben Ausnahmen gegen eine Regel heißen, dass die Regel falsch war. Der Kreis
ist jetzt der Normalfall, die 123 Zeilen Sonderfall-CSS sind ersatzlos entfernt. Das Label
lebt als Hover-Tooltip weiter, gegated auf `(hover: hover) and (pointer: fine)`.

**b) Farbe: erst Rot, dann korrigiert auf `#25d366`.** Erster Anlauf war Salsa-Rot (Palette-
Reinheit). Der Auftraggeber hat widersprochen: „nicht dunkelgrün, sondern das WhatsApp-Grün".
Das ist berechtigt — ein WhatsApp-Knopf in der Hausfarbe wird als Kanal nicht erkannt.
Das Problem am Ursprungszustand war nie „grün", sondern „dunkelgrün" (`#075e54`, alter Logo-Ton).

> **Bewusst gegen die Norm entschieden.** Eine Kontrastrechnung ergab für weißen Glyph auf
> `#25d366` nur 1,98:1 (WCAG-Grenzwert für UI-Komponenten: 3:1). Dem Auftraggeber wurden drei
> Alternativen vorgelegt; er hat sie verworfen — Design werde visuell entschieden, nicht über
> Zahlen. **Das ist eine bewusste, dokumentierte Abweichung, kein Versehen.** Nicht ohne
> Rücksprache „korrigieren". Im Projekt existiert kein Kontrast-Gate, das blockieren würde.

**c) Cookie-Banner: echte Kategorien statt Attrappe.** Die naheliegende Lösung (Notwendig /
Statistik / Marketing) wäre falsch gewesen — die Seite setzt nachweislich kein Analytics
(kein gtag/GTM/Pixel im Quelltext, index.html lädt ein einziges Skript, die eigene
Datenschutzerklärung sagt es wörtlich). Ein Schalter, der nichts schaltet, ist eine
Schein-Auswahl.

Stattdessen wurde der eine *echte* Fall schaltbar gemacht: **Google Maps** lud bisher
ungefragt und übertrug dabei die IP an Google. Jetzt Opt-in, standardmäßig aus.
Belegt: 0 Google-Requests ohne Zustimmung, 33–34 danach.

**d) Datenschutzerklärung nachgezogen.** Der Text beschrieb den Stand vor (c) und war damit
an zwei Stellen unwahr. Beide Sprachfassungen korrigiert, Stand auf August 2026.

### Wo der Code liegt

Neu: [`src/lib/consent.ts`](src/lib/consent.ts) — eine Quelle für den Einwilligungsstand,
inklusive Brücke vom alten localStorage-Schlüssel (Bestandsbesucher sehen den Banner nicht erneut).

Wesentlich geändert: `src/public/site/CookieBanner.tsx`, `src/public/site/GoogleMapEmbed.tsx`,
`src/public/site/WhatsAppFloat.tsx`, `src/lib/motion-tokens.ts`, `src/lib/reveal.tsx`,
`src/public/subpage/kit.tsx`, `src/public/legal/content.ts`.
Vollständige Liste: `git diff --stat dbd1aa6..HEAD`.

Der Design-Kontrakt für Motion und Chrome steht in
[`.claude/product-design.md`](.claude/product-design.md) — er ergänzt das gesperrte
`DESIGN.md` und begründet jeden geänderten Wert.

---

## 2. Laufender Zustand auf dem VPS

Für den Auftraggeber läuft ein **Klick-Editor** („Lovable Lane"): Er öffnet eine Tunnel-URL,
klickt in der laufenden Website auf ein Element, tippt einen Kommentar — der landet in einer
JSONL-Inbox, ein Monitor weckt die Session, die Änderung wird umgesetzt.

| Was | Wo | Anmerkung |
|---|---|---|
| Vite-Dev | `127.0.0.1:5173` | Salsaflow, Hot Reload |
| Hono-API | `:8787` | PGlite, 74 Kurse / 2 Staffeln |
| Overlay-Bridge | `:4902` → 5173 | injiziert das Feedback-Overlay |
| Tunnel | `https://agrees-hostel-kiss-positioning.trycloudflare.com` | die URL für den Auftraggeber |
| Inbox | `/root/preview-feedback/inbox.jsonl` | aktuell leer |

**Werkzeuge:** `/root/tools/lovable-up`, `/root/tools/preview-url`, `/root/tools/lovable-lane`.
Overlay-Quelltext: `/root/tools/preview-bridge/overlay.js`.

### Drei Dinge, die daran angepasst wurden

1. **Der Feedback-Knopf saß auf dem WhatsApp-Float.** Rechts unten belegt, links unten →
   Cookie-Banner, links oben → Logo. Er sitzt jetzt als schmaler, halbtransparenter Reiter
   mittig am linken Rand (`overlay.js`, Backup unter `overlay.js.bak`). Auf 12 Routen ×
   2 Viewports kollisionsfrei geprüft.
2. **Die Inbox ist projektübergreifend.** Während der Arbeit kamen 17 Kommentare zu einem
   fremden Shopify-Projekt („Manuka Swiss", Tunnel `measure-manager-age-founder`) an, die eine
   parallele Session bearbeitet. Der Monitor ist deshalb auf den Salsaflow-Tunnel gefiltert:
   `tail -F … | grep --line-buffered "agrees-hostel-kiss-positioning"`.
   **Wer den Monitor neu aufsetzt, muss diesen Filter mitnehmen** — sonst reagiert man auf
   fremdes Feedback.
3. **PGlite war kaputt.** Acht Dateien unter `.data/pglite` gehörten `root` statt dem
   Laufzeitbenutzer, dazu ein verwaistes `postmaster.pid`. Behoben durch zielgenauen `chown`.
   Backup: `/tmp/pglite-backup-1502` (wird beim Reboot geleert).

---

## 3. Wichtige Randbedingungen

- **Die Commits sind nur lokal.** Es gibt kein GitHub-Remote, nur ein Backup-Repo unter
  `/root/.no-mistakes/repos/`. Der Branch hat kein Upstream. Wer die Arbeit sichern will,
  muss ein Remote einrichten.
- **Deployment läuft über `npx vercel --prod --yes`**, nicht über Git-Push.
- **Der Auftraggeber führt keine Befehle selbst aus.** Aufträge werden bis zum Ergebnis
  ausgeführt, nicht als Befehlsliste zurückgegeben.
- **Sprache:** Alles auf Deutsch, inklusive Code-Kommentaren. Kommentare erklären das *Warum*
  und nennen Messwerte — das ist die Repo-Konvention, kein Zufall.
- **Rechteproblem:** Irgendein Prozess schreibt gelegentlich als `root` in das Projekt
  (betraf heute `src/`, `.git`, `dist`, die Vercel-Config und die Datenbank). Bei
  `EACCES`-Fehlern hilft ein zielgenauer `sudo -n chown` auf den betroffenen Pfad —
  kein breites rekursives `chmod`.

---

## 4. Gates

Vor jedem Abschluss grün zu bekommen:

```bash
npm run typecheck && npx oxlint --config .oxlintrc.json src/ && npm run build
```

`oxlint` läuft mit einem strengen „anti-slop"-Regelsatz: keine `typeof`-Verengung an
I/O-Grenzen, keine offenen Dictionary-Typen, `SAFETY:`-Kommentar vor jeder Typ-Assertion.
Die Regeln sind ernst gemeint und haben in dieser Session zwei echte Schwächen aufgedeckt.

Zusätzlich verlangt das Setup nach jeder Frontend-Änderung einen **Browser-Lauf**:

```bash
claude-visual capture --session-id "<id>" --url "<url>" --routes auto --viewports mobile,desktop
```

Jedes zurückgegebene PNG muss tatsächlich angesehen werden — ein Code-Grep ersetzt keinen
Screenshot. Weitere Repo-Kommandos: [`VERIFY_COMMANDS.md`](VERIFY_COMMANDS.md).

---

## 5. Offene Punkte

1. **Die Seitenübergänge sind nie in Bewegung gesehen worden.** Headless-Chromium führt
   Cross-Document View Transitions in dieser Umgebung nicht aus — mit einer neutralen
   Minimal-Testseite belegt, also kein Defekt des Codes. Verifiziert ist der *Aufbau*
   (Snapshot-Namen, Timings 0/60/120/180/240 ms, Keyframes) gegen das ausgelieferte CSS,
   nicht das laufende Bild. **Ein Klick zwischen zwei Seiten in einem echten Browser schließt
   das.** Bis dahin gilt: nicht als „geprüft" ausgeben.
2. **Schnupperstunde-Fold hat noch Weißraum.** Die H1 steht wieder korrekt über dem Formular
   (y=460 → y=116), aber die linke Spalte ist darunter leer. Ein Trust-Element (Google-
   Bewertung, „seit 2018", die drei Fakten aus der Sektion darunter) würde sie tragen. Das ist
   eine Inhaltsentscheidung, keine Layout-Reparatur — gehört dem Auftraggeber.
3. **Juristische Abnahme der Datenschutzerklärung steht aus.** Der Text wurde an das
   angepasst, was die Seite nachweislich tut — Faktentreue, keine Rechtsprüfung.
4. **Die Rechte-Ursache ist nicht behoben, nur die Folge.** Solange der root-schreibende
   Prozess läuft, kann die Datenbank erneut ausfallen.
5. **Tunnel-URLs sterben mit ihrem Prozess** (Reboot, `preview-url stop`). Dann
   `/root/tools/lovable-up` erneut ausführen und die neue URL durchgeben.

---

## 6. Empfohlene nächste Skills

| Skill | Wofür |
|---|---|
| `visual-harness` | **Pflicht** nach jeder Frontend-Änderung — Browser-Lauf plus Sichtung jedes PNG |
| `lovable` | Klick-Editor betreiben (Start, Feedback-Schleife, Archivierung der Inbox) |
| `web` | Website-/Landingpage-Arbeit an diesem Projekt |
| `design` | Design-Quelle; die Motion-Doktrin darin trägt die Werte aus Punkt 1 |
| `no-mistakes` | Vor dem Abschluss größerer Änderungen — Review-Durchlauf |
| `handoff` | Für den *eigenen* nächsten Session-Übergang (PROGRESS.md/DECISIONS.md, Commit) |

**Nicht** `improve-animations` oder `animate` laden, solange es um diese Website geht — die
sind laut ihrer eigenen Beschreibung für Audits bzw. Einzelanimationen gedacht, nicht für
Site-Builds. Die Motion-Werte stehen bereits in `.claude/product-design.md`.

---

## 7. Der nächste konkrete Schritt

Der Auftraggeber hat den Klick-Editor bekommen und will damit arbeiten. **Warten, bis ein
Kommentar in der Inbox landet, dann die Feedback-Schleife fahren:** Kommentar lesen →
Änderung chirurgisch umsetzen → `claude-visual capture` → PNGs ansehen → kurz melden, was
geändert wurde, plus „neu laden".

Solange nichts hereinkommt, ist der sinnvollste eigene Zug Punkt 1 aus den offenen Punkten:
die Seitenübergänge in einem echten Browser gegenprüfen, damit die einzige unverifizierte
Zusage dieser Session belegt ist.
