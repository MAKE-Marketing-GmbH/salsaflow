# Produkt-Design-Kontrakt — Salsa-Studio Basel

Dieses Dokument haelt den BESTEHENDEN, bereits gebauten Designstand fest. Es erfindet
keine neue visuelle Sprache. Die Site ist produktiv; Aenderungen sind chirurgisch.

## Produkt, Zielgruppe, eine Aufgabe

- **Produkt:** Website eines Salsa-Tanzstudios in Basel (Elisabethenanlage 7, 4051 Basel).
- **Zielgruppe:** Erwachsene ohne Tanzerfahrung, die zoegern. Der Einstieg ist die
  Schnupperstunde; die Hemmschwelle, nicht der Preis, ist das Hindernis.
- **Eine Aufgabe der Seite:** einen Platz reservieren, mit so wenig Schritten wie moeglich.
  Alles andere (Kursplan, Team, Standort) stuetzt nur diese Aufgabe.

## Farbtokens (gesetzt, aus src/index.css)

| Token | Hex | Rolle |
|---|---|---|
| `--color-ink` | `#0a0a0a` | Fliesstext, Ueberschriften |
| `--color-ink-muted` | `#52524e` | Sekundaertext, Labels |
| `--color-paper-warm` | `#fbfaf8` | Default-Flaeche, Header-Balken |
| `--color-bg-soft` | `#f4f1ec` | ruhige Sektionsflaeche, Warteliste-Kopf |
| `--color-line` | `#e4e4e1` | Haarlinien, Kartenrand |
| `--color-salsa` | `#ad1827` | EINZIGER Akzent: CTA, Fokus, Marker |
| `--color-salsa-700` | `#8e1320` | Hover/Active auf rotem Button |

Keine neue Farbe in einer Komponente. Ein Akzent, sonst Papier und Tinte.

## Typografie

| Rolle | Familie | Einsatz |
|---|---|---|
| Display | `--font-display` — Cal Sans | H1–H3, Zahlen in Faktenleisten |
| Body | `--font-sans` — Afacad | Fliesstext, Formulare, Buttons, WhatsApp-Float |
| Script | `--font-script` — Alex Brush | sehr sparsamer Zierakzent |

Utility-Labels: `text-xs font-bold uppercase tracking-[0.12em]` bis `[0.16em]`.

## Layout

- Shell symmetrisch: `px-5 sm:px-8`. Kein asymmetrisches Gutter fuer schwebende Elemente.
- Karten: `--radius-card` (16px), `border-[var(--color-line)]`, `bg-white`,
  Schatten `0_14px_40px_rgba(17,17,17,0.04)`.
- Fixe Kopfleiste `--nav-h`, opaker `--color-paper-warm`-Balken, kein Blur, kein
  vertikaler Shift. 24px Scroll-Hysterese.
- Der WhatsApp-Float steht fest unten rechts (ab `lg`), ohne Kollisions-Solver.
  `--wa-corner` haelt ihm die Ecke frei.

## Komponenten- und Zustandsregeln

- Formularfehler benennen NUR sichtbare Felder. Ist ein Feld ausgeblendet, darf der
  Fehlertext es nicht als Option anbieten.
- Fehlertext und roter Rahmen stammen aus derselben Entscheidung; Markierung erst nach
  einem Absendeversuch, nie beim Tippen.
- Erfolgstexte versprechen keinen Automatismus. Eine Reservierung ist `reserved`, nicht
  bestaetigt — das Studio bestaetigt sie durch einen Menschen.
- Bewegung: ein authored Moment pro Bildschirm, danach Ruhe. `prefers-reduced-motion`
  und der Zustand vor der Hydration sind der Endzustand, nie ein Zwischenschritt.

## Signature-Element

Die **Fakten-Dreierleiste** (Wann / Wo / Bezahlung): Label klein und versal in
`--color-ink-muted`, Wert direkt darunter in `--color-ink`. Sie beantwortet die einzige
Frage nach einer Reservierung — was habe ich gebucht — bevor irgendein Fliesstext kommt.
Sie erscheint im Warteliste-Panel und auf /vorbereiten und traegt dort dieselbe Form.
