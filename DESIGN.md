---
name: Salsaflow Dance Company - Designsystem v2
status: locked
version: 2.0
date: 2026-06-30
stack: react-vite-tailwind4
tokens_source: src/index.css (@theme)
colors:
  ink: "#0a0a0a"
  ink-muted: "#52524e"
  paper: "#ffffff"        # heute pur weiss; Ziel warm (siehe Guardrails: Migration bg-white -> paper-warm)
  bg-soft: "#f6f6f5"
  line: "#e4e4e1"
  surface-dark: "#111111"
  salsa: "#ad1827"        # EINE Akzentfarbe, ~90/10 sparsam
  salsa-700: "#8e1320"
  salsa-500: "#c61f30"
  salsa-100: "#f7dcdf"
  salsa-50: "#fceeef"
typography:
  display: "Cal Sans"      # Home-Redesign-2026-07 (Raphael 2026-07-07): Display = Cal Sans (schon in index.css eingebunden, /fonts/cal-sans-latin.woff2). Familjen Grotesk = Alt-Stand.
  sans: "Afacad"                   # warm, rhythmisch, sehr gut lesbar
  banned: ["Hanken Grotesk", "Inter", "Plus Jakarta Sans", "Geist", "Manrope", "Poppins", "Outfit", "DM Sans", "Satoshi", "Montserrat", "Roboto", "Fraunces", "Instrument Serif"]
rounded: "voll (rounded-full) für Buttons/Pills, 1.5rem-2.5rem für Bild-Container"
spacing: "Sektion py-16 / py-20 / py-24, Karten p-6 / p-8, Cluster gap-3/4/6/8, max-w-[1400px] Shell"
motion: "EINE Signatur: getakteter Stagger-Fade-up [data-reveal], Feder-Kurve. prefers-reduced-motion = sofort sichtbar."
---

# Salsaflow Dance Company - Designsystem v2 (LOCKED)

Diese Datei ist die EINE Wahrheit für Farbe, Schrift, Spacing, Radius, Motion und
Component-Bauform. Vor jeder Section lesen. Eine Abweichung ist ein Bug, kein Geschmack.

## Brand & Style
Salsa- und Bachata-Tanzschule in Basel. Gefühl: **warm, familiär, Community, einladend,
"Du", lateinisch, Bewegung, Premium ohne kalt zu sein**. Slogan "siempre con flow".
NICHT: kalt, generisch, Template-SaaS, kindisch, Stockphoto-leblos.

## Colors
- Grundstimmung hell. **Eine** Akzentfarbe: Salsa-Rot `#ad1827`, in vier Deckkraft-Stufen.
- Rot strikt für Aktion und Akzent (CTA, Marker, Hover, Eyebrow), nie als Deko-Fläche. ~90/10.
- Dunkle Sektion `surface-dark #111` nur als bewusster Kontrast-Block (z.B. Events).
- Token-Law: keine neue Farbe in der Komponente. Fehlt eine, erst hier als Token aufnehmen.
- Back-Compat (NICHT entfernen, Admin/Kursplan hängen dran): `--color-salsa-600`,
  `--color-salsa-300`, `--color-muted`.

## Typography
- Display = **Cal Sans** (`font-display`, aktiv seit Home-Redesign 2026-07). Grosse
  Headlines, tightes Leading, negatives Tracking (-0.02em bis -0.035em). Ein Schnitt
  (font-weight 100-900 mappt auf dieselbe Datei, kein Faux-Bold). Familjen Grotesk = Alt-Stand.
- Body = **Afacad** (`font-sans`, default). Fliesstext, Labels, UI. Warm, klar, nicht SaaS-glatt.
- Script-Akzent = **Alex Brush** (`font-script`), genau EINE Stelle: der Hero-Eyebrow
  ("Bailar es vivir"). Der Footer-Claim ist sitewide Chrome und zählt nicht.
- Font-Wechsel Bricolage -> Familjen Grotesk am 2026-07-02 (Stage 3). Grund:
  Raphael-Direktive (Display-Schrift ändern, wärmer, nicht kalt) + 8-Stimmen-Kritik
  (`kritik/2026-07-02-review/`): Bricolage im Black-Weight wirkt kalt und hat keinen
  echten Italic; Familjen Grotesk bringt Wärme, mehr Seele und einen ECHTEN Italic,
  der die Signatur-Zeile selbst tragen kann. **Bricolage ist NICHT gesperrt**, nur
  nicht mehr die aktive Display-Stimme. Premium-Alternativen (Kauf, offen bei Raphael):
  PP Editorial New / Canela.
- GESPERRT: Hanken Grotesk, Inter, Plus Jakarta Sans und die Ban-Liste aus dem Frontmatter. Tauchen sie wieder aktiv auf = Bug.
- Text-Balance Pflicht: H1/H2/H3 `text-balance`, lange Absätze `text-pretty`. Keine
  Silbentrennung, kein `overflow-wrap:anywhere` auf Headlines, keine Ein-Wort-Schlusszeile.
- Italic-Hinweis: Familjen Grotesk hat einen ECHTEN Italic (600/700). Display-Italic
  darf die expressive Zeile selbst setzen. Der Script-Claim "Bailar es vivir." bleibt
  als EINE Signatur (Afacad-Italic wie bisher). Kein Faux-Italic.
- Squiggle-Unterstrich: Dosierung max 1-2 Stellen pro Seite. Startseite = nur Hero
  ("glücklich") + Abschluss-CTA. Sonst normaler Rot-Akzent ohne Unterstrich.

## Layout & Spacing
- Shell `max-w-[1400px]`, Padding `px-5 sm:px-8`. Messbarer Startseiten-Lock: `structure/homepage-design-dna.md`.
- Sektion-Abstand `py-16` bis `py-24`. Karten `p-6`/`p-8`. Cluster `gap-3/4/6/8`.
- Fixe Navbar, First-Section bekommt `--nav-h` (76px) Headroom (Regel 062).
- Ein Fokuspunkt pro Screen. Whitespace als Werkzeug. Weniger, bessere Sektionen.

## Elevation & Depth
- Border ODER weicher Schatten, nicht beides stark. Keine harten dunklen Schatten.
- Karten meist nur feine `--color-line` Border. Tiefe über Spacing, nicht über Schatten-Schwemme.

## Shapes
- Buttons/Pills `rounded-full`. Bild-Container `rounded-[1.5rem]`..`rounded-[2.5rem]`.
- Ein Radius-System konsequent. Kein Mix aus eckig und rund ohne Grund.

## Components
- Primary-CTA: roter Pill (`bg-salsa`, white text, hover `salsa-700`), ein Verb ("Schnupperstunde buchen").
- Secondary: textüller Link mit Pfeil, Hover -> salsa. Max ein Primary pro Sektion.
- Icon-Buttons brauchen Label + Focus-State. Karten brauchen einen Job (kein Card-Soup).
- Forms: Label, Validierung, Submitting-State, Erfolg/Next-Step. Buchung ist Kernfunktion.

## Imagery & Media
- Echte Tanz-/Studio-/Team-Fotos zuerst (Salsaflow hat viel Material). Menschen nie KI-from-scratch.
- Ein Bild-Stil über die ganze Seite (Licht, Crop, Wärme). Bild-Stil-Lock je Welle.
- Kein Bild auf derselben Seite doppelt; sitewide max 2x mit klar anderem Einsatz.
- Hero nutzt grossen Studio-Crop mit Bleed + rotem Kant-Marker (bestehende starke Idee, behalten).

## Motion
- EINE Signatur: getakteter Stagger-Fade-up (`[data-reveal]`, Feder-Kurve), schon im CSS.
- Hover subtil (Farbe/Translate). Keine Bounce-Orgie. `prefers-reduced-motion` = alles sofort sichtbar.

## Responsive
- Desktop zuerst (Regel webdesigner-pro). Mobile-Politur erst wenn Raphael es klar anfordert.
- Bestehende Mobile-Pfade (Hero Hochformat etc.) bleiben, werden in der Mobile-Phase poliert.

## Guardrails

Anti-Slop, gilt immer:
- Ein Stil-Dialekt. Eine Akzentfarbe in 4 Stufen. Dünne grosse Headlines, nie alles fett.
- Ein Icon-Set (lucide). Ein Radius-System. **Kein reines Schwarz/Weiss als Default-Fläche**:
  Ziel ist warm-paper statt pures `#fff`. Migration `bg-white` -> warmes paper-Token erfolgt
  pro Seite mit Screenshot-Check (66 `bg-white`-Stellen, nicht blind global tauschen).
- Keine Zufallsfarben, keine Gradient-/Border-/Schatten-Schwemme, keine generische Card-Soup.
- GESPERRTE Fonts tauchen nie wieder in aktivem Code oder aktiver Design-Wahrheit auf.
- Voller Text im HTML für öffentliche Routen (SEO + KI-Suche). Private App-Routen `noindex`.

## State-Coverage (Pflicht pro Screen/Component)
loading, empty, error, success, disabled/submitting, (mobile als Notiz bis Desktop-Lock).

## Lock
- Geändert nur mit bewusster Entscheidung + Eintrag in docs/decisions.md.
- Verify nach jeder Änderung: `npm run build` (tsc + vite) + Browser-Sicht.
