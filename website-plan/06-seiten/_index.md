> **ÜBERHOLT 2026-08-12:** Kanonisch ist nur [`00-index.md`](./00-index.md) + nummerierte Specs (`01-home.md` …). Unnummerierte `home.md` / `privatstunden.md` usw. sind Alt-Entwürfe — nicht bauen.

# 06 — FINAL DE-Copy: Index der Priority-Pages

**Rolle:** Copywriter · **Status:** FINAL · **Modus:** Planning only — kein Production-Code
**Sprachvertrag:** [`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md) (Du, warm, Schweizer ss, CHF, keine unbelegten Claims)
**IA-Lock:** [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md) — Nav TANZKURSE · EVENTS & WORKSHOPS · TEAM · FOTOS · KONTAKT · MEHR
**Stand:** 2026-08-12

## Copy-Dateien (Route → Datei)

| Route | Prio | Datei |
|---|:--:|---|
| `/` | P0 | [home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/home.md) |
| `/tanzkurse` | P0 | [tanzkurse.md](/root/clients/salsaflow-dc/website-plan/06-seiten/tanzkurse.md) |
| `/tanzkurse/salsa` | P0 | [tanzkurse-salsa.md](/root/clients/salsaflow-dc/website-plan/06-seiten/tanzkurse-salsa.md) |
| `/tanzkurse/bachata` | P0 | [tanzkurse-bachata.md](/root/clients/salsaflow-dc/website-plan/06-seiten/tanzkurse-bachata.md) |
| `/tanzkurse/heels` | P1 | [tanzkurse-heels.md](/root/clients/salsaflow-dc/website-plan/06-seiten/tanzkurse-heels.md) |
| `/privatstunden` | P0 | [privatstunden.md](/root/clients/salsaflow-dc/website-plan/06-seiten/privatstunden.md) |
| `/preise` | P0 | [preise.md](/root/clients/salsaflow-dc/website-plan/06-seiten/preise.md) |
| `/kursplan` | P1 | [kursplan.md](/root/clients/salsaflow-dc/website-plan/06-seiten/kursplan.md) |
| `/kursaufbau` | P1 | [kursaufbau.md](/root/clients/salsaflow-dc/website-plan/06-seiten/kursaufbau.md) |
| `/events` | P1 | [events.md](/root/clients/salsaflow-dc/website-plan/06-seiten/events.md) |
| `/events/danceflow-night` | P0 | [events-danceflow-night.md](/root/clients/salsaflow-dc/website-plan/06-seiten/events-danceflow-night.md) |
| `/events/kalender` | P2 | [events-kalender.md](/root/clients/salsaflow-dc/website-plan/06-seiten/events-kalender.md) |
| `/team` | P1 | [team.md](/root/clients/salsaflow-dc/website-plan/06-seiten/team.md) |
| `/kontakt` | P1 | [kontakt.md](/root/clients/salsaflow-dc/website-plan/06-seiten/kontakt.md) |
| `/kontakt/standort-raumvermietung` | P1 | [kontakt-standort-raumvermietung.md](/root/clients/salsaflow-dc/website-plan/06-seiten/kontakt-standort-raumvermietung.md) |
| `/shows-animationen` | P1 | [shows-animationen.md](/root/clients/salsaflow-dc/website-plan/06-seiten/shows-animationen.md) |
| `/mehr/partys` | P1 | [mehr-partys.md](/root/clients/salsaflow-dc/website-plan/06-seiten/mehr-partys.md) |
| `/faq` | P0 | [faq.md](/root/clients/salsaflow-dc/website-plan/06-seiten/faq.md) |

## Gesperrte Claims (in allen Dateien durchgesetzt)

| Claim | Status | Behandlung in Copy |
|---|---|---|
| „Gratis" Schnupperstunde | unbestätigt (S-02) | nur „Probestunde anfragen" |
| „drei Studios" | widersprüchlich (S-03) | keine Studiozahl |
| „rund 40 Kurse/Woche" | ungeprüft | nicht verwendet |
| „über 20 Jahre Erfahrung" | aggregiert (C04) | nicht verwendet |
| „einzige Schule / #1 / beste" | riskant (C01) | nicht verwendet |
| Meisterschaften / Awards | unbelegt (C02) | nicht verwendet |
| Reviews / Sterne | keine Quelle (P-02) | `PLACEHOLDER`/weggelassen |
| Paarpreis | widersprüchlich (S-10) | nur bestätigte Einzelpreise |
| Hochzeitstanz | konditional (S-05) | Abschnitt nur bei bestätigtem Angebot |
| Gutschein-Details | unbestätigt | `PLACEHOLDER` |
| Öffnungszeiten | unbestätigt (S-06) | nicht erfunden |
| Event-Daten | nur belegte | FLOWeekend 9.–10.10.2026, Danceflow-Rhythmus; Rest datengetrieben |

## Nächster Schritt

G-DESIGN: Copy gegen DESIGN.md und Layout-Specs prüfen (ein Primary-CTA pro Section, H1/H2-Kürze, kein Fake-Proof). Danach Gutschein-Backend-Spec und Preis-Klärung (S-02, S-10) als Blocker adressieren.

## 5. Gemeinsamer Section-Spec-Vertrag

Alle kanonischen Seitenspecs enthalten ab jetzt neben Copy und Backend-Logik auch: Layout-Raster, CTA-Hover/Focus-Vision, Lucide-Icons mit sichtbaren Labels, die eine Motion-Signatur aus [`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md:96-98), Asset-Pfad plus bildgenauen Alt-Text, Zustände und einen strukturierten Mockup-Brief.

### Mockup-Brief-Minimum
- Route, Desktop/Mobil-Viewport und Section-Reihenfolge.
- H1, Lead, Primary/Secondary und genaue Zielroute.
- Asset-Pfad, Crop, Alt-Text oder begründetes `alt=""`.
- Layout-Variante, Karten-/Tabellenjob, Iconname und sichtbares Label.
- Hover, Focus, Loading, Empty, Error, Success/Disabled/Submitting.
- Motion-Verhalten inklusive Reduced-Motion-Fallback.
- Datenquelle, Backend-Zustand und offene Gate-ID.

Keine dieser Ergänzungen erzeugt Production-Code. Sie sind Bau- und Abnahmevorgaben für die spätere Frontend-Welle.
