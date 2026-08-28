# Salsaflow — Produkt-Design-Kontrakt (Motion & Chrome)

Ergänzt `DESIGN.md` (locked). Diese Datei regelt, was DESIGN.md offenlässt:
den Seitenwechsel, den Auftritt einzelner Elemente und die schwebende Chrome
(WhatsApp-Float). Farbe, Schrift, Spacing, Radius kommen unverändert aus DESIGN.md.

## Produkt

Salsa-, Bachata- und Heels-Schule in Basel. Publikum: Erwachsene, die noch nie
getanzt haben und Hemmungen abbauen wollen. Der eine Job der Website: aus einem
Zögernden einen gebuchten Schnupperstunden-Gast machen.

## Farbtoken (aus DESIGN.md, hier nur die für Motion/Chrome relevanten)

| Token | Hex | Rolle |
|---|---|---|
| `--color-salsa` | `#ad1827` | Die eine Aktionsfarbe. CTA, Marker, Float. |
| `--color-salsa-700` | `#8e1320` | Hover/Active auf Rot. |
| `--color-ink` | `#0a0a0a` | Text. |
| `--color-paper-warm` | `#fbfaf8` | Grundfläche. |
| `--color-line` | `#e4e4e1` | Trennlinie, Ring. |

**Entscheidung 2026-08-28: `--color-whatsapp` (#075e54) verschwindet aus der
sichtbaren Fläche.** Begründung: DESIGN.md schreibt EINE Akzentfarbe fest
("Token-Law: keine neue Farbe in der Komponente"). Ein dunkelgrüner Klotz unten
rechts ist eine zweite Akzentfarbe und der einzige Punkt der Seite, der nicht zur
Palette gehört. Der Float wird Salsa-Rot mit weissem Glyph. Das WhatsApp-Logo
bleibt als Glyph erkennbar — Wiedererkennung hängt an der Form, nicht am Grün.

## Der WhatsApp-Float

**Bauform: Kreis, immer.** 56px, Salsa-Rot, weisser Glyph, weicher Schatten.
Kein Textlabel, keine Breiten-Animation, keine Route-Sonderregel.

Begründung: Der Float trug sitewide ein Label "WhatsApp" — und sieben Routen
(`/privatstunden`, `/kursaufbau`, `/events`, `/team`, `/faq`, `/mehr/collabs`,
`/mehr/tanzschuhe` + `/mehr/partys`) hatten je eine CSS-Regel, die das Label wieder
ausblendet. Sieben Ausnahmen gegen eine Regel heissen: die Regel war falsch. Der
Kreis ist ab jetzt der Normalfall, die Ausnahmen entfallen ersatzlos.

Das Label wandert in einen Tooltip, der nur bei Hover auf feinem Zeiger erscheint —
Touch-Nutzer sehen nie ein Label, das ihnen die Ecke zustellt.

**Position:** `right: 1.5rem`, `bottom` aus den bestehenden Lift-Variablen. Auf
Mobile bleibt er ausgeblendet, solange ein Sticky-CTA da ist (bestehendes Verhalten).

**Auftritt:** einmal, nach 90ms, Opacity + 8px translateY, `--dur-slow`.
Kein Puls, kein Ring, keine Wiederholung. (Raphael-Lock R134/10.)

## Motion-Signatur: „tänzerisch"

Der Auftrag lautet „etwas langsamer, Element für Element, bisschen tänzerisch".
Übersetzt in Werte:

| Ebene | Vorher | Nachher | Warum |
|---|---|---|---|
| Reveal-Dauer | 0.72s | **0.86s** | Langsamer, marketingtypisch. Bleibt Marketing-Motion, nicht UI — die 300ms-UI-Regel gilt hier nicht. |
| Reveal-Stagger | 0.05s | **0.085s** | „Element für Element" hörbar machen. Bleibt im 30–80ms-Korridor der Doktrin (85ms = oberes Ende, bewusst). |
| Reveal-Distanz | 24px | **28px** | Mehr Weg trägt die längere Dauer. |
| Reveal-Kurve | `cubic-bezier(0.23,1,0.32,1)` | **unverändert** | Die eine Ease-Out-Familie der Site. Kein Bounce (AI-Slop-Tell laut Repo-Regel). |

**Tänzerisch heisst hier: seitlicher Versatz, nicht Federn.** Ein Element, das
einfliegt, kommt mit 6px horizontalem Offset herein und richtet sich beim Ankommen
auf — wie ein Schritt, der zur Mitte findet. Kein Rotieren, kein Wippen, kein
Overshoot. Der Effekt ist unterschwellig; wer ihn bewusst bemerkt, hat zu viel davon.

## Seitenwechsel (Cross-Document View Transitions)

Die Site ist eine MPA: jede Route ist ein echter Dokument-Load. Übergänge laufen
über `@view-transition { navigation: auto }`.

| Ebene | Vorher | Nachher | Warum |
|---|---|---|---|
| Eintritt | 720ms | **900ms** | Der Übergang soll tragen, nicht huschen. |
| Austritt | 280ms | **320ms** | Muss kürzer bleiben als der Eintritt (die alte Seite soll weg sein, bevor die neue trägt), aber nicht abgehackt. |
| Eintritts-Versatz | 20/28px | **24/32px** | Proportional zur längeren Dauer. |
| Blur | 8px | **10px** | Kaschiert den Dokument-Schnitt. Unter 20px (Safari-Kostenregel). |

**Neu: der Fold staffelt beim Seitenwechsel mit.** Bisher bewegte sich der gesamte
Seitenstamm als ein Block — technisch korrekt, aber leblos. Ab jetzt bekommen
Eyebrow, H1, Lead, CTA-Reihe und Media je einen eigenen benannten Snapshot und
kommen um 60ms versetzt herein. Das ist „Element für Element" auf der Ebene, wo es
am meisten zählt: dem ersten Eindruck nach jedem Klick.

Der Header (`sf-site-header`) bleibt beim Wechsel stehen — unverändert.

## Reduced Motion

Bewegung fällt weg, Opacity bleibt. Kein Versatz, kein Blur, keine Staffelung.
Das gilt für Reveal, Seitenwechsel und Float-Auftritt gleichermassen.

## Hover-Gating

Jeder Hover-Effekt steht in `@media (hover: hover) and (pointer: fine)`.
Touch feuert Hover beim Tap und lässt den Zustand sonst kleben.
