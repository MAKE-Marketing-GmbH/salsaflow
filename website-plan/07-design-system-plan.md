# 07 — Design-System-Plan (Design A "Warme Bühne")

**Stand:** 2026-08-12 · **Gate:** G-DESIGN entschieden (A, Raphael 2026-08-12)
**Scope:** PLANNING ONLY — kein Production-Code geändert.
**Repo-Stand:** `MITNUTZENROLLE` — das Design-System existiert bereits im Code.
Dieser Plan **beschreibt und schärft** den Bestand, er erfindet ihn nicht neu.

**Bindende Wahrheit (Reihenfolge):**
1. [`src/index.css`](/root/clients/salsaflow-dc/src/index.css) — `@theme`-Block = Token-Realität
2. [`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md) — gelockte Doktrin (`status: locked`)
3. Dieser Plan — Lücken, Drift, Umsetzungsschritte

Wo dieser Plan von DESIGN.md abweicht, steht das als **DRIFT** mit Beleg und braucht
eine bewusste Entscheidung. Stillschweigend überschreibe ich nichts.

---

## 0. Kernaussage in fünf Zeilen

- Design A ist **kein Neubau**. Der Bleed-Hero mit rotem Kant-Marker, Cal Sans, Afacad und `#ad1827` sind bereits gebaut.
- Die Arbeit ist **Konsolidierung**: vier konkurrierende Hover-Werte, 157 `bg-white`-Stellen, veraltete Kommentare.
- **Adobe Fonts wird nicht gebraucht** — und wäre ein Rückschritt (siehe Kapitel 2).
- Grösster echter Design-Blocker ist ein **Asset**, kein CSS: P-01 Privatstunden-Motiv.
- Alles Messbare in diesem Plan ist mit Befehl + Ausgabe belegt.

---

## 1. Farben

### 1.1 Ist-Zustand (Beleg: `src/index.css:25-67`)

Der `@theme`-Block ist die einzige Token-Quelle. Tailwind 4 generiert daraus die Utilities.

**Neutral / Grundstimmung**

| Token | Wert | Rolle |
|---|---|---|
| `--color-ink` | `#0a0a0a` | Fliesstext, Headlines |
| `--color-ink-muted` | `#52524e` | Sekundärtext, Labels |
| `--color-paper` | `#fdfcfa` | helle Fläche (bereits warm, nicht `#fff`) |
| `--color-paper-warm` | `#fbfaf8` | **Default-Body-Fläche**, gesetzt in `body` (`index.css:116`) |
| `--color-bg-soft` | `#f4f1ec` | Editorial-Sektionen unter dem Hero (Design-A-Träger) |
| `--color-line` | `#e4e4e1` | Karten-Border, Trenner |
| `--color-surface-dark` | `#111111` | bewusster Kontrast-Block (Events) |

**Akzent — Salsa-Rot, genau eine Familie**

| Token | Wert | Rolle |
|---|---|---|
| `--color-salsa` | `#ad1827` | CTA-Fläche, Kant-Marker, Eyebrow |
| `--color-salsa-700` | `#8e1320` | **kanonischer Hover** auf rotem Grund |
| `--color-salsa-500` | `#c61f30` | helle Variante |
| `--color-salsa-100` / `-50` | `#f7dcdf` / `#fceeef` | sehr helle Flächen |
| `--color-salsa-600` / `-300` | `#8e1320` / `#e07b86` | **Back-Compat, nicht neu verwenden** |

**Warm-modern (additiv)** — `--color-script-cream`, `--color-team-warm-1/2`,
`--color-photo-warm`, `--color-flow-green`, `--color-whatsapp(-hover)`.

### 1.2 DRIFT-01 — DESIGN.md ist bei drei Farben veraltet

| Feld | Inhalt |
|---|---|
| **Behauptung** | DESIGN.md Frontmatter: `paper: "#ffffff"` mit Kommentar „heute pur weiss; Ziel warm“ |
| **Realität** | `--color-paper: #fdfcfa` und `--color-bg-soft: #f4f1ec` (`index.css:29-30`); `body` läuft bereits auf `--color-paper-warm` (`index.css:116`) |
| **Ebenso** | DESIGN.md nennt `bg-soft: "#f6f6f5"` (neutralgrau), Code hat `#f4f1ec` (warm-beige) |
| **Folge** | Die Migration „pures Weiss → warm“ ist auf Body-Ebene **erledigt**. DESIGN.md beschreibt einen Zustand von vor der Umstellung. |
| **Empfehlung** | DESIGN.md-Frontmatter auf die drei Code-Werte korrigieren. Keine Code-Änderung. |

> Das ist wichtig, weil `briefs.md:19` beim Verwerfen von Richtung C notiert hat, ein
> „echtes paper-warm-Token existiert nicht“. Das war schon damals falsch — das Token
> steht seit Längerem in `index.css:40`. Für A ist der Punkt ohnehin gegenstandslos.

### 1.3 DRIFT-02 — 157 `bg-white`-Stellen statt der dokumentierten 66

```
$ grep -ron "bg-white" src/ --include=*.tsx | wc -l
157
$ grep -rn "paper-warm" src/ --include=*.tsx | wc -l
126
```

DESIGN.md:110 nennt „66 `bg-white`-Stellen“. Das ist um Faktor 2,4 daneben.

**Kein Blind-Ersatz.** `bg-white` ist an drei Stellen *richtig*:
Karten-Insel auf `bg-soft` (gewollter Helligkeitssprung), Text auf dunklem Foto,
und Elemente auf `surface-dark`. Der 90/10-Kontrast lebt vom Unterschied.

**Vorgehen — pro Seite, mit Screenshot-Vergleich:**

| Fall | Regel |
|---|---|
| Vollflächiger Sektions-Hintergrund | → `bg-[var(--color-paper-warm)]` |
| Karte auf `bg-soft` | **bleibt weiss** (gewollter Sprung) |
| Fläche auf `surface-dark` / auf Foto | **bleibt weiss** |
| Overlay / Chip auf Bild | **bleibt weiss** |

Reihenfolge: Home → Kurse → Preise → Privatstunden → Rest. Erst Screenshot,
dann Ersatz, dann Screenshot. Erst wenn eine Seite sauber ist, die nächste.

### 1.4 90/10-Gesetz

Rot ist **Aktion und Akzent**, nie Deko-Fläche: CTA-Pill, Kant-Marker, Eyebrow,
Hover, Live-Punkt, Fokus-Ring. Kein rotes Karten-Panel, kein roter Verlauf.
Fehlt eine Farbe: erst als Token in `index.css` + DESIGN.md, dann benutzen (Token-Law).

---

## 2. Schrift — inklusive der Adobe-Fonts-Frage

### 2.1 Adobe Fonts: klare Empfehlung NEIN

Der Auftrag sagt „Adobe Fonts first“. Nach Prüfung des Repos rate ich davon ab.
Das ist eine Empfehlung mit Begründung, keine eigenmächtige Entscheidung.

```
$ grep -rn "typekit\|adobe\|use.typekit" src/ index.html package.json
(keine Treffer)
```

Heute sind **alle vier Schriften self-hosted**:

```
$ ls public/fonts/
alex-brush-latin.woff2
cabinet-grotesk-700.woff2
cabinet-grotesk-800.woff2
cal-sans-latin.woff2
```

Afacad kommt als npm-Paket über `@fontsource/afacad` (`index.css:2-6`), Cal Sans und
Alex Brush über `@font-face` aus `/fonts/` (`index.css:9-22`).

**Vier Gründe gegen Adobe Fonts hier:**

1. **DSGVO/DSG.** `index.css:8` sagt wörtlich: *„Self-hosted Fonts (GDPR-konform, keine externen Requests)“*. Adobe Fonts lädt von `use.typekit.net` und überträgt IP-Adressen an einen US-Anbieter. Für eine Schweizer Tanzschule mit Cookie-Banner ist das ein Rückschritt mit Rechtsrisiko.
2. **Cal Sans gibt es dort nicht.** Cal Sans ist eine freie Schrift (nicht im Adobe-Katalog). Der Wechsel würde die Display-Stimme der Marke erzwingen — genau die Entscheidung, die in Design A bestätigt wurde.
3. **Performance.** Self-hosted `.woff2` vom selben Origin schlägt einen Fremd-Origin (extra DNS + TLS + Render-Block).
4. **Kein Problem zu lösen.** Die Typo-Ebene funktioniert. Ein Anbieterwechsel ohne Mangel ist reines Risiko.

**Wenn Raphael Adobe Fonts trotzdem will:** der einzige sinnvolle Anlass wäre eine
*gekaufte Premium-Display-Schrift* als Cal-Sans-Ersatz. DESIGN.md:59-60 nennt dafür
bereits PP Editorial New / Canela — beide sind aber **nicht** bei Adobe, sondern bei
Pangram Pangram / Commercial Type. Das wäre ein eigener Font-Entscheid, kein
Infrastruktur-Wechsel. Ich habe hier nichts geändert.

### 2.2 Die Stimmen

| Rolle | Schrift | Token | Einsatz |
|---|---|---|---|
| Display | **Cal Sans** | `--font-display` | H1-H4, automatisch über Element-Selektor (`index.css:185-192`) |
| Body | **Afacad** | `--font-sans` | Fliesstext, Labels, UI (Body-Default, `index.css:118`) |
| Script | **Alex Brush** | `--font-script` | **genau eine Stelle**: Hero-Eyebrow „Bailar es vivir.“ |

Cal Sans läuft als Variable-Range `font-weight: 100 900` auf **eine** Datei
(`index.css:12`). Darum `font-synthesis-weight: none` (`index.css:191`) — sonst
erfindet der Browser ein Faux-Bold. Das ist bewusst so und darf nicht „repariert“ werden.

**Gesperrt** (DESIGN.md:23): Hanken Grotesk, Inter, Plus Jakarta Sans, Geist, Manrope,
Poppins, Outfit, DM Sans, Satoshi, Montserrat, Roboto, Fraunces, Instrument Serif.
Tauchen sie in aktivem Code auf, ist das ein Bug.

**Offener Punkt:** `cabinet-grotesk-700/800.woff2` liegen in `public/fonts/`, werden
aber in `index.css` **nirgends** per `@font-face` eingebunden — Reste der Stage-7-Ablösung.
Zwei ungenutzte Dateien im Deploy. Aufräumen ist Wartung, kein Design; ich habe sie
nicht angefasst. Ausserdem beschreibt der Kommentar `index.css:58` noch
„Display Familjen Grotesk -> Cabinet Grotesk“, obwohl direkt darunter Cal Sans steht.

### 2.3 Type-Skala (aus dem Hero gemessen)

Beleg `src/public/home/Hero.tsx:186`:

```
text-[2.75rem] leading-[0.92] tracking-[-0.035em]
  sm:text-[4.25rem] lg:text-[3.75rem] xl:text-[4.75rem]
```

| Stufe | Grösse (Desktop) | Leading | Tracking |
|---|---|---|---|
| H1 Hero | 76px (`4.75rem` @xl) | `0.92` | `-0.035em` |
| H2 Sektion | 40-56px | `1.0-1.05` | `-0.022em` bis `-0.025em` |
| H3 Karte | 24-32px | `1.15` | `-0.02em` (Default) |
| Body | 16-18px | `1.5-1.6` | normal |
| Label/Eyebrow | 13-14px | `1.4` | `+0.08em`, Versalien |
| Script-Eyebrow | 32px / 38px (`sm`) | **`1.3`** | normal |

Zwei Regeln, die aus gemessenen Fehlern stammen und bleiben müssen:

- **Script-Leading `1.3`, nie `leading-none`.** `Hero.tsx:152` hält fest: Alex Brush setzt Ober- und Unterlängen, die bei `leading-none` abgeschnitten werden.
- **Display-Tracking `-0.02em` als Element-Default** (`index.css:187`). Grosse Zeilen setzen zusätzlich explizit `-0.022` bis `-0.035em`. Grund laut Kommentar `index.css:182-184`: neutrales Tracking franst bei grossen Graden aus.

**Pflicht:** `text-balance` auf H1/H2/H3, `text-pretty` auf lange Absätze.
Keine Silbentrennung, kein `overflow-wrap:anywhere` auf Headlines, keine
Ein-Wort-Schlusszeile.

---

## 3. Spacing und Layout

### 3.1 Shell und Rhythmus

- Shell `max-w-[1400px]`, Padding `px-5 sm:px-8`
- Sektionen `py-16` / `py-20` / `py-24` — drei Stufen, nichts dazwischen
- Karten `p-6` / `p-8` · Cluster `gap-3/4/6/8`
- Fixe Navbar: erste Sektion bekommt `--nav-h` Headroom (Regel 062)

`--nav-h` ist `76px` Desktop, `66px` unter 640px (`index.css:74,83`).
`scroll-padding-top: var(--nav-h)` (`index.css:89`) verhindert, dass Ankersprünge
unter der Leiste landen. FAQ-Seiten addieren `+1.5rem` (`index.css:258-264`).

### 3.2 Radien — DRIFT-03: zwei parallele Systeme

Es gibt benannte Radius-Tokens (`index.css:64-66`):
`--radius-chip: 8px` · `--radius-card: 16px` · `--radius-media: 24px`

Gleichzeitig steht in `src/public` freies Arbitrary-Rounding:

```
$ grep -roh "rounded-\[[0-9.]*rem\]" src/public | sort | uniq -c | sort -rn
      7 rounded-[1.5rem]
      3 rounded-[1.75rem]
      3 rounded-[1.25rem]
      2 rounded-[2rem]
      2 rounded-[1rem]
      1 rounded-[2.5rem]
```

Sechs verschiedene Werte neben drei Tokens. `rounded-[1.5rem]` = 24px ist identisch
mit `--radius-media`, nur anders geschrieben.

**Ziel-Regel:**

| Element | Radius |
|---|---|
| Buttons, Pills, Chips | `rounded-full` |
| Karten, Panels | `var(--radius-card)` (16px) |
| Bild-Container | `var(--radius-media)` (24px) |
| Grosse Editorial-Bühne | `rounded-[2.5rem]` als bewusste Ausnahme |

`rounded-[1.25rem]`, `[1.75rem]` und `[1rem]` haben keinen eigenen Job und sollten
auf das nächste Token fallen. Das ist Politur, kein Blocker — pro Seite mitnehmen,
wenn die Datei ohnehin offen ist.

### 3.3 Tiefe

Border **oder** weicher Schatten, nie beides stark. Karten tragen meist nur
`border-[var(--color-line)]`. Tiefe entsteht über Spacing, nicht über Schatten.
Unter 640px werden Schatten auf Nicht-Interaktivem global entfernt (`index.css:216-220`) —
Mobile bleibt flach und ruhig.

---

## 4. Buttons, States, Hover-Vision

### 4.1 DRIFT-04 — vier konkurrierende Hover-Werte (wichtigster Fund)

DESIGN.md:85 schreibt **einen** Hover vor: `bg-salsa` → `salsa-700`. Gemessen:

```
$ grep -roh "hover:bg-\[var(--color-salsa-[0-9]*)\]" src/ | sort | uniq -c
      2 hover:bg-[var(--color-salsa-50)]
      3 hover:bg-[var(--color-salsa-500)]
      4 hover:bg-[var(--color-salsa-600)]
     16 hover:bg-[var(--color-salsa-700)]
```

Der Primary-CTA verhält sich an verschiedenen Stellen unterschiedlich:

- `src/public/home/ScheduleTeaser.tsx:138` → `hover:bg-[var(--color-salsa-700)]` (korrekt)
- `src/public/home/StickyCta.tsx:37` → `hover:bg-[var(--color-salsa-500)]` (wird **heller** statt dunkler)

Das ist der auffälligste Bruch im ganzen System: derselbe rote Pill reagiert einmal
dunkler, einmal heller. Nutzer lesen das als „andere Art Knopf“.

Entlastend: `--color-salsa-600` und `--color-salsa-700` haben **denselben Wert**
`#8e1320` (`index.css:51-52`). Die vier `-600`-Stellen sind also optisch schon richtig,
nur uneinheitlich geschrieben. Echt falsch sind die drei `-500`-Stellen.

**Ziel:** `-500` → `-700`, dann `-600` → `-700` (rein kosmetisch, kein Pixel ändert sich).
`hover:bg-[var(--color-salsa-50)]` bleibt: das sind helle Flächen, kein Primary.
`--color-salsa-600` bleibt als Token bestehen — Admin/Kursplan hängen dran (DESIGN.md:45).

### 4.2 Die drei Button-Rollen

| Rolle | Bauform | Hover | Fokus |
|---|---|---|---|
| **Primary** | `rounded-full bg-[var(--color-salsa)] text-white font-semibold px-5-7 py-3-3.5` | `bg-[var(--color-salsa-700)]`, `transition-colors duration-200` | `ring-2 ring-[var(--color-salsa)] ring-offset-2` |
| **Secondary** | Textlink + Pfeil, kein Kasten | Farbe → `salsa`, Pfeil `translate-x-0.5` | Outline-Baseline |
| **Auf dunkel** | roter Pill auf `surface-dark` | **invertiert** → `bg-white text-night` | `ring-white ring-offset-[var(--color-night)]` |

Die Invertierung auf Dunkel (`EventsTeaser.tsx:129`) ist bewusst und richtig:
`salsa-700` auf `#111` hätte zu wenig Abstand. Als Sonderfall dokumentiert, nicht als
Abweichung behandeln.

**Regel:** maximal **ein** Primary pro Sektion. Verb im Label
(„Schnupperstunde buchen“), nie „Mehr erfahren“.

### 4.3 Mindestgrössen und Fokus

Touch-Ziele `min-h-11` (44px) bis `min-h-12` (48px), Sticky-CTA `h-[52px]`.
Die Fokus-Baseline liegt zentral (`index.css:210-213`): jedes `a, button,
[role=button], summary` bekommt bei Keyboard-Fokus `outline: 2px solid var(--color-salsa)`
mit `2px` Offset. Über `:where()` mit Spezifität 0 — jede explizite Utility gewinnt.
Ein neuer Button ist damit **nie** ohne Fokus-Zustand, auch wenn man es vergisst.

### 4.4 State-Coverage (Pflicht pro Screen)

`loading` · `empty` · `error` · `success` · `disabled/submitting` · Mobile-Notiz.
Für Formulare gilt zusätzlich: Label, Validierung, Submitting-State, Erfolg mit
nächstem Schritt. Buchung ist die Kernfunktion der Seite.

---

## 5. Header

Beleg: [`src/public/site/SiteHeader.tsx`](/root/clients/salsaflow-dc/src/public/site/SiteHeader.tsx)

### 5.1 Bauform

Der Header ist **fixed** (`SiteHeader.tsx:150`), `z-50`, mit
`transition-transform duration-300 ease-out` und `motion-reduce:transition-none`.
Er reserviert exakt `height: var(--nav-h)` (`:154`).

Innen liegt eine **schwebende Insel** (`:181`):
`rounded-full` (Desktop) · `border-[var(--color-line)]` ·
`bg-[var(--color-paper-warm)]/95` + `backdrop-blur` ·
`shadow-[0_8px_28px_rgba(17,17,17,0.1)]`.

Die Halbtransparenz ist bewusst: Inhalt schimmert leicht durch, die Leiste wirkt
leicht statt als Balken (Kommentar `:176`).

### 5.2 Scroll-Verhalten und Mobile

Der Header misst `window.scrollY` gegen `lastY` (`:54-76`, `passive: true`) und
fährt beim Runterscrollen weg, beim Hochscrollen zurück.

Mobil ist der Header **ein einziges Accordion**, das nach unten wächst — nicht
Leiste plus Overlay. Beim Öffnen wird die Transparenz zurückgenommen:
`data-[open=true]:bg-[var(--color-paper-warm)]` + `backdrop-blur-none` (`:181`).
Kein Text auf halbdurchsichtigem Grund. Das Panel-Muster liegt in `index.css:132-165`
(`grid-template-rows: 0fr → 1fr`, `--acc-ease: cubic-bezier(0.22,1,0.36,1)`, 250ms,
Blur 4px → 0). Das Menü scrollt bei `max-h-[calc(100dvh-var(--nav-h)-1rem)]` (`:245`).

Ein Skip-Link liegt als erstes fokussierbares Element (`:326`): `sr-only`, bei Fokus
sichtbar als roter Pill oben links.

### 5.3 DRIFT-05 — „Gratis“ im Header-Umfeld ist ein ungeprüfter Claim

`04c-growth-critic.md:58` und `04-seo-plan.md:484` führen S-02 („Ist die erste
Schnupperstunde wirklich kostenlos?“) als **ungeprüft**. `briefs.md:43` legt fest:
bis zur Freigabe heisst der CTA „Probestunde anfragen“ — ohne „gratis“.

Im Code steht der Claim aber an mindestens acht Stellen:

```
$ grep -rin "gratis" src/ index.html --include=*.tsx --include=*.html
src/lib/i18n.tsx:69
src/public/site/SiteFooter.tsx:110, :121
src/public/BookingPanel.tsx:64
src/public/courses/CourseEngine.tsx:764
src/public/CoursesPage.tsx:222
index.html:9  (meta description)
```

Auch die Meta-Description in `index.html:9` sagt „Gratis Schnupperstunde“ —
das ist der Text, der in der Google-Suche erscheint.

**Das ist ein Claim-Thema, kein Design-Thema.** Zwei saubere Wege:
Salsaflow bestätigt „gratis“ schriftlich (dann bleibt alles), **oder** die acht
Stellen werden auf „Schnupperstunde buchen“ geändert. Ich entscheide das nicht und
habe nichts geändert. Der Punkt gehört vor den Launch geklärt, weil er auch in der
Suchergebnis-Anzeige steht.

---

## 6. Motion

### 6.1 Die eine Signatur

Beleg: [`src/public/home/motion.tsx`](/root/clients/salsaflow-dc/src/public/home/motion.tsx)

Ein Takt für die ganze Seite (`motion.tsx:25-39`):

| Parameter | Wert |
|---|---|
| Distanz | `14px` y-Versatz |
| Dauer | `0.45s` (reduced: `0.3s`, nur Fade) |
| Stagger | `0.07s`, `delayChildren: 0.03` |
| Easing | `EASE_OUT = [0.22, 1, 0.36, 1]` |
| Viewport | `once: true`, `margin: '-8% 0px'` |

Das `-8%` statt `-12%` ist gemessen (`motion.tsx:18-19`): Reveals zünden früher und
„schwimmen“ nicht im Scroll-Glide nach.

Dasselbe Easing `cubic-bezier(0.22,1,0.36,1)` liegt als `--acc-ease` im CSS
(`index.css:78`). Eine Kurve, zwei Systeme — richtig.

### 6.2 Weitere erlaubte Bewegungen

- **Count-up** (`useCountUp`, `motion.tsx:72-96`): 1,1s, Ease-out-Cubic, einmalig ab Sichtbarkeit.
- **Marquee** (`motion.tsx:118-147`): die **einzige** erlaubte Dauerschleife, 42s linear, `aria-hidden`, zwei identische Spuren.
- **Booking-Dialog** (`index.css:238-256`): Backdrop-Fade + Panel `translateY(8px) scale(0.98)` → neutral, 150-200ms.
- **Header-Hide/Show**: `transition-transform duration-300`.

### 6.3 Reduced-Motion — doppelt abgesichert

Global (`index.css:98-111`): alle Animationen und Transitions auf `0.01ms`,
`scroll-behavior: auto`. Zusätzlich prüft jede JS-Komponente `useReducedMotion()`
und liefert den Endzustand direkt: kein Versatz, kein Loop, kein Count-up
(`motion.tsx:4`). Der Marquee wird zum seitlich scrollbaren Band (`:128-134`).

**Nicht entfernen:** jeder Reveal-Container trägt `data-reveal` (`motion.tsx:59`).
Das Screenshot-Tool erzwingt darüber Sichtbarkeit — sonst wären alle
Reveal-on-Scroll-Shots leer. Ein „aufgeräumtes“ `data-reveal` bricht die Verify-Schleife.

```
$ grep -rln "data-reveal" src/ | wc -l
14
```

### 6.4 Verboten

Bounce, Overshoot, parallaxe Hintergründe, Scroll-Hijacking, Auto-Karussells mit
Inhalt (der `aria-hidden`-Marquee ist die Ausnahme), Animation auf `width`/`height`/
`top`/`left`. Nur `transform` und `opacity`.

---

## 7. Icons

Ein Set: **lucide-react** (`package.json:43`, `^1.23.0`).

```
$ grep -rlo "react-icons\|@heroicons\|phosphor" src/ package.json
(leer)
$ grep -rl "from 'lucide-react'" src/ | wc -l
36
```

Sauber — kein zweites Icon-Set im Repo.

**Regeln:** Strichstärke `1.5`-`2`, Grösse `16`/`20`/`24`, Farbe erbt via
`currentColor` (nie hart gesetzt). Rein dekorative Icons bekommen `aria-hidden`;
ein Icon-Button braucht `aria-label` **und** einen Fokus-Zustand. Keine Emoji als
Icon-Ersatz, keine eigenen SVG-Einzelstücke ohne Not.

---

## 8. Bild-Stil

Ein Grading über die ganze Seite (`index.css:222-224`):

```css
main img:not([src$='.svg']):not([src*='/logo/']) {
  filter: saturate(0.96) contrast(1.03) brightness(1.02);
}
```

Zwei belegte Belichtungs-Ausreisser bekommen eine eigene Gradation, die den
allgemeinen Lock **ersetzt** statt sich zu stapeln (`index.css:228-234`):
`.photo-grade-bachata` und `.photo-grade-private`. Logos und SVGs sind
ausgenommen — sonst würde die Wortmarke mitgefärbt.

**Weitere Regeln:** echte Fotos zuerst, Menschen nie KI-generiert. Kein Bild
zweimal auf derselben Seite; sitewide maximal 2× mit klar anderem Einsatz.
Der Hero-Bleed ist die **einzige** Bleed-Stelle sitewide (`Hero.tsx:4`) — genau das
macht ihn zur Signatur von Design A. Unterseiten bleiben in der Shell.

---

## 9. Asset-P0 — Privatstunden-Motiv (der eigentliche Blocker)

Der grösste Design-Mangel ist kein CSS-Problem.

Laut [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md)
sind es vier Crops **desselben** Motivs: junge Frau + deutlich älterer Herr,
Handhaltung, flaches Kunstlicht, keine Bewegung. Privatstunden sind das teuerste
Produkt (CHF 100-130/Lektion, 5er ab CHF 450) — das Bild verkauft es aktiv schlecht.

| | |
|---|---|
| **Zwischenlösung (heute machbar)** | `/photos/2026/hero-paar-dreh-01-portrait.webp` als Hero, `/photos/2026/hero-paar-studiowand-01.webp` für die Ablauf-Sektion. Beide zeigen echte Bewegung. |
| **Echte Lösung** | Shooting: 1 Lehrperson + 1 Paar, 45 Min, Studio bei Tageslicht, 6-8 Motive quer + hoch |
| **Braucht** | Salsaflow: Shooting-Termin **oder** Freigabe der Zwischenlösung |

Beide Zwischenlösungs-Bilder sind Design-A-Assets — der Stil bricht nicht.

Ebenfalls ROT und ohne Rückfrage baubar: **P-09 Open-Graph-Bild** (1200×630).
Es existiert kein Asset im Verhältnis 1,91:1. Eine Tanzschule wird über WhatsApp
weiterempfohlen; ohne OG-Bild erscheint dort ein grauer Kasten.

---

## 10. Fallback-Hinweis Richtung C (Auftrag Kap. 12)

C („Warmes Papier“) ist **verworfen**, hier nur als Notfall-Notiz:

Sollte A am Hero-Foto scheitern, wäre C die robusteste Richtung, weil sie die Last auf
mehrere Bilder verteilt (rundes Hochformat-Hero + Panorama-Streifen `community-crowd-01.webp`)
statt auf ein grosses. Der in `briefs.md:44` genannte Blocker („paper-warm-Token
zuerst eintragen“) besteht **nicht mehr**: `--color-paper-warm: #fbfaf8` liegt in
`index.css:40` und läuft bereits als Body-Fläche.

Ohne ausdrückliches Wort von Raphael wird nichts aus C gebaut.

---

## 11. Umsetzungs-Reihenfolge

Sortiert nach Wirkung pro Aufwand. Alles PLANNING — nichts davon ist ausgeführt.

| # | Schritt | Warum | Aufwand | Braucht Entscheid |
|---|---|---|---|---|
| 1 | Hover `salsa-500` → `-700` (3 Stellen) | Primary-CTA verhält sich uneinheitlich (heller statt dunkler) | XS | nein |
| 2 | DESIGN.md-Frontmatter: `paper`, `bg-soft`, `bg-white`-Zahl korrigieren | Doktrin widerspricht dem Code | XS | nein |
| 3 | S-02 „gratis“ klären (8 Stellen inkl. Meta-Description) | Claim-Risiko, steht im Google-Snippet | S | **ja — Kunde** |
| 4 | P-01 Privatstunden-Bild: Zwischenlösung oder Shooting | teuerstes Produkt, schlechtestes Bild | S / M | **ja — Kunde** |
| 5 | P-09 OG-Bild 1200×630 bauen | WhatsApp-Weiterempfehlung = häufigster Erstkontakt | S | nein |
| 6 | `bg-white`-Migration Home → Kurse → Preise → Privat | warme Grundstimmung durchziehen | M | nein |
| 7 | Hover `salsa-600` → `-700` (4 Stellen) | rein kosmetisch, identischer Farbwert | XS | nein |
| 8 | Radien auf 3 Tokens zusammenziehen | 6 Arbitrary-Werte neben 3 Tokens | S | nein |
| 9 | Cabinet-Grotesk-Dateien + veraltete Kommentare aufräumen | 2 ungenutzte Dateien im Deploy | XS | nein |

Schritte 1, 2, 5, 7, 9 sind ohne Rückfrage machbar. 3 und 4 brauchen Salsaflow.

---

## 12. Akzeptanz-Checks

Vor „fertig“ müssen alle grün sein:

| # | Check | Befehl / Methode |
|---|---|---|
| A1 | Build grün | `npm run build` (tsc + vite) |
| A2 | Kein Primary-Hover ausser `-700` | `grep -roh "hover:bg-\[var(--color-salsa-[0-9]*)\]" src/` → nur `-700` und `-50` |
| A3 | Keine gesperrte Schrift aktiv | `grep -rinE '"(Inter\|Poppins\|Montserrat\|Plus Jakarta Sans\|Manrope\|Geist\|Outfit\|DM Sans\|Satoshi\|Roboto)"' src/index.css` → leer. Anführungszeichen und `-E` sind nötig: ein blosses `grep -i inter` trifft sonst `pointer-events` (`index.css:285`). |
| A4 | Genau ein Icon-Set | `grep -rlo "react-icons\|@heroicons\|phosphor" src/` → leer |
| A5 | `data-reveal` intakt | `grep -rln "data-reveal" src/ \| wc -l` → ≥ 14 |
| A6 | Reduced-Motion | DevTools „prefers-reduced-motion: reduce“ → kein Versatz, kein Marquee, Count-up sofort am Endwert |
| A7 | Keine erfundenen Claims | keine Sterne/Ratings/Zertifikate/„#1“ ohne Beleg; „gratis“ nur nach S-02-Freigabe |
| A8 | Ein Bleed | nur der Home-Hero blutet aus, alle Unterseiten in der Shell |
| A9 | Fokus sichtbar | Tab durch Home → jedes Ziel zeigt Salsa-Ring; Skip-Link ist erstes Element |
| A10 | Kein Token-Bruch | keine neue Farbe/Schrift direkt in einer Komponente, nur `@theme` |

---

## 13. Verbote (aus [`12-verbote-und-gates.md`](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md))

- Keine erfundenen Reviews, Ratings, Zertifikate, „#1“
- Kein Production-Code im website-plan
- Keine stillen Gate-Defaults
- Claims nur aus Proof-Inventar / Kunden-Doc / Live
- Keine neue Farbe/Schrift ohne Token-Eintrag
- Gesperrte Fonts nie wieder aktiv
- `data-reveal` nicht entfernen (bricht die Verify-Schleife)

---

## 14. Offene Punkte

| ID | Frage | Wer |
|---|---|---|
| S-02 | Ist die erste Schnupperstunde wirklich kostenlos? | Kunde |
| P-01 | Shooting-Termin oder Freigabe der Zwischenlösung? | Kunde |
| P-02 | Welche Google-Reviews dürfen wörtlich zitiert werden? | Kunde |
| HOME-01 | Stimmt „zwei Minuten vom Bahnhof“? | Kunde |
| P-03 | Namens-Zuordnung Founder-Cutouts | Kunde |
| ADOBE-01 | Adobe Fonts trotz DSGVO-Nachteil? Empfehlung: nein (Kap. 2.1) | Raphael |
| FONT-02 | Premium-Display-Kauf (PP Editorial New / Canela) statt Cal Sans? | Raphael |
