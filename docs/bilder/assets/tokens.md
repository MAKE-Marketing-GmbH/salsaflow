---
zweck: Brand-Tokens (Farben + Typo-Richtung) fuer Salsaflow Dance Company
quelle: Logo (Farben direkt aus salsaflow-logo-schwarzrot.png gemessen) + wiki.md Abschnitt 3
etappe: Marathon Etappe 3 (Asset-Inventar)
stand: 2026-06-16
---

# Brand-Tokens: Salsaflow Dance Company

> Leit-Palette laut Briefing: **Schwarz und Rot**, Grundstimmung **hell**. Anmutung: modern,
> eher mutig/energetisch, eher schlicht (nicht premium-elitaer), ruhig (nicht schreiend),
> viel Bewegung, Lebensfreude. Diese Datei ist die Token-Quelle fuer Etappe 10 (Designsystem).
> Die Farbwerte unten sind aus dem echten Logo gemessen, nicht geschaetzt.

## 1. Marken-Kernfarben (gemessen aus dem Logo)

| Token | Hex | RGB | Herkunft |
|---|---|---|---|
| `--brand-red` | `#AD1827` | 170, 24, 39 | dominantes Rot im Schriftzug "flow" (direkt gesampelt) |
| `--brand-black` | `#000000` | 0, 0, 0 | "Salsa" + Bildmarke im Logo (reines Schwarz) |

Das Rot ist ein tiefes, sattes Karmin/Salsa-Rot, kein Signal- oder Knallrot. Das passt zum
No-Go "grell und bunt" und zum Slider "ruhig (10)". Schwarz und Rot sind die einzigen
Markenfarben, alles andere sind neutrale Helfer.

## 2. Praktische Rot-Abstufungen (abgeleitet vom gemessenen Brand-Rot)

Fuer States (Hover/Active), Verlaeufe und Flaechen. Direkt aus `#AD1827` heller/dunkler gerechnet.

| Token | Hex | Verwendung |
|---|---|---|
| `--red-700` | `#8E1320` | Hover/Active auf rotem Button (dunkler) |
| `--red-600` | `#AD1827` | Basis = `--brand-red`, Primaer-CTA, Akzentlinien |
| `--red-500` | `#C61F30` | etwas heller, Links/Icons auf hellem Grund |
| `--red-100` | `#F7DCDF` | sehr helle Rot-Tint-Flaeche (Badges, Highlights) |
| `--red-50`  | `#FCEEEF` | zarte Hintergrund-Tint |

Hinweis A11y: `#AD1827` auf Weiss hat ausreichenden Kontrast fuer Text (>= 4.5:1). Reines
`--brand-red` NICHT als grosse, duenne Schrift auf Schwarz verwenden (zu wenig Kontrast),
dort `#FFFFFF` oder `--red-500` nehmen.

## 3. Neutrale (helle Grundstimmung)

Grundstimmung ist hell: weisser/fast-weisser Seitenhintergrund, Schwarz als Text/Struktur.

| Token | Hex | Verwendung |
|---|---|---|
| `--bg`          | `#FFFFFF` | Seiten-Hintergrund (hell, Default) |
| `--bg-soft`     | `#F6F6F5` | abgesetzte Sektionen, Karten-Flaechen |
| `--ink`         | `#0A0A0A` | Haupttext / Headlines (fast-Schwarz, etwas weicher als #000) |
| `--ink-muted`   | `#52524E` | Sekundaertext, Captions (entspricht dem Grau von "DANCE COMPANY") |
| `--border`      | `#E4E4E1` | Trennlinien, Karten-Raender |
| `--surface-dark`| `#111111` | optionale dunkle Sektion (z.B. Events/Hero-Kontrast), Logo dann in Weiss |

Auf `--surface-dark` gilt: Logo-Variante `salsaflow-logo-weiss.png` oder `...-weissrot.png`
verwenden, Text in `#FFFFFF`, Akzent in `--red-500`.

## 4. Typo-Richtung (Briefing-Luecke, daher Richtung statt Festlegung)

Im Briefing ist die Schrift `[LUECKE]` (nicht spezifiziert). Finale Wahl erfolgt in Etappe 10.
Richtung, abgeleitet aus "modern (80), eher schlicht (20), nicht premium-elitaer, gut lesbar,
bedienerfreundlich, keine Fachbegriffe":

- **Haltung:** moderne, gut lesbare Grotesk (Sans-Serif). Freundlich-geometrisch, nicht kuehl-technisch
  (No-Go "sehr technisch und kuehl"), nicht verspielt-altmodisch (No-Go "altmodisch").
- **Headline-Kandidaten (Richtung, nicht final):** eine Grotesk mit Charakter und etwas Energie,
  z.B. Clash/General-Sans-Klasse oder eine kraeftige humanistische Grotesk. Tanz/Bewegung darf
  in der Headline-Spannung mitschwingen.
- **Body-Kandidaten:** neutrale, sehr gut lesbare Grotesk (z.B. Inter-Klasse) fuer Lauftext,
  Formulare, Kursplan-Tabellen (Lesbarkeit vor Charakter, da viel Funktion).
- **Spanisch-Akzent:** "Bailar es vivir." als Marken-Claim typografisch hervorheben, aber sparsam.
- **Skala (Startwerte fuer Etappe 10):** klare Hierarchie, grosse Headlines (Bewegung 70),
  ruhiger Body. Keine Versalien-Walls (No-Go "vollgepackt mit Text").

## 5. Anwendungsregeln (kurz)

- Schwarz + Weiss tragen die Flaeche, **Rot ist Akzent** (CTAs, aktive Zustaende, Highlights),
  nicht Flaechenfarbe. Verhaeltnis grob 90/10.
- Hell ist Default. Dunkle Sektionen sind die Ausnahme fuer Kontrast (z.B. Event-Sektion).
- Bildsprache: ausschliesslich echte Salsaflow-Fotos (siehe `MANIFEST.md`), nie Stock/KI.
- Logo-Leitvariante: `salsaflow-logo-schwarzrot-mit-dc.png` auf hellem Grund.

## 6. CSS-Custom-Properties (copy-paste-fertig fuer Etappe 10)

```css
:root {
  /* Marke */
  --brand-red: #AD1827;
  --brand-black: #000000;
  /* Rot-Skala */
  --red-700: #8E1320;
  --red-600: #AD1827;
  --red-500: #C61F30;
  --red-100: #F7DCDF;
  --red-50:  #FCEEEF;
  /* Neutral / hell */
  --bg: #FFFFFF;
  --bg-soft: #F6F6F5;
  --ink: #0A0A0A;
  --ink-muted: #52524E;
  --border: #E4E4E1;
  --surface-dark: #111111;
}
```
