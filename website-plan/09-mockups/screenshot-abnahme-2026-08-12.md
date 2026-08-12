# Screenshot-Abnahme 2026-08-12

Serie: [`/root/clients/salsaflow-dc/website-plan/screenshots/2026-08-12/`](/root/clients/salsaflow-dc/website-plan/screenshots/2026-08-12/)  
Geprüft: alle 24 PNGs per Bild-Read (Pixel, nicht Builder-Prosa).  
Kriterien: leerer/weisser Hero, abgeschnittene Köpfe/CTAs, Cookie-Banner, kaputte Layouts, nicht geladene Bilder (graue Boxen), unlesbare Mobile-Shots.

## Gesamturteil

**FAIL**

Grösste Lücke: Live-Jimdo-URLs `privatstunden` und `kurse` zeigen 404-Seiten statt Inhalt — Referenzshots unbrauchbar.

## Vercel (20)

| Datei | Verdict | Grund |
|---|---|---|
| vercel-home-desktop.png | PASS | Hero-Paar, Headline, beide CTAs und Social-Proof vollständig; Köpfe im Bild; kein Cookie-Banner |
| vercel-home-desktop-full.png | PASS | Fullpage geladen: Kurse, Reviews, Team, FAQ, Studios, Footer; Bilder sichtbar, kein Grau-Platzhalter |
| vercel-home-mobile.png | PASS | Mobile lesbar: Hero, CTAs, Sterne; kein Banner, Layout intakt |
| vercel-tanzkurse-desktop.png | PASS | Headline, Stats 2018/40/3, Kursfoto; Text und CTA lesbar |
| vercel-tanzkurse-desktop-full.png | PASS | Stil-Karten, Level, Preise CHF, Privatstunden, Footer vollständig; Fotos geladen |
| vercel-tanzkurse-mobile.png | PASS | Headline, CTA, Stats, Kursfoto; mobile lesbar |
| vercel-kursplan-desktop.png | PASS | Headline, Kursfoto, Tageschips, Stil-Filter, Kurszeilen mit Avataren und «Platz sichern» |
| vercel-kursplan-desktop-full.png | PASS | Drei Zeitslots + CTA-Block + Footer; keine leeren Karten, kein Banner |
| vercel-kursplan-mobile.png | PASS | Tagesraster, Stil-Chips, erste Kurszeile; lesbar und intakt |
| vercel-events-desktop.png | PASS | Headline, CTAs, Stats, Eventfoto mit vollständigen Gesichtern im Viewport |
| vercel-events-desktop-full.png | PASS | Danceflow, Workshops, Wochenende, Rhythmus-Sektion; Fotos geladen |
| vercel-team-desktop.png | PASS | Headline + Gruppenfoto; alle Köpfe im Rahmen, kein Crop-Fail |
| vercel-team-desktop-full.png | PASS | Gründer-Portraits, Geschichte, Rollen, weitere Trainer; Bilder geladen |
| vercel-fotos-desktop.png | PASS | Headline, Collage (3 Motive), Galerie-Filter; Hero-Motive scharf |
| vercel-fotos-desktop-full.png | PASS | Dichte Galerie (viele Thumbnails) alle befüllt, Instagram-Block, CTA, Footer |
| vercel-kontakt-desktop.png | PASS | Headline, Kontaktkarte WhatsApp/E-Mail/Telefon, Hero-Streifen mit Kursfoto |
| vercel-kontakt-desktop-full.png | PASS | Anfrage-Wizard, Standort, Raumvermietung, Footer; Fotos geladen |
| vercel-kontakt-mobile.png | PASS | Headline + Kontaktkarte vollständig; mobile lesbar, kein Banner |
| vercel-mehr-desktop.png | PASS | Headline, CTAs FAQ/Kontakt, Hero-Paar vollständig im Kartenrahmen |
| vercel-mehr-desktop-full.png | PASS | 4 Hub-Karten (Collabs/Tanzschuhe/Partys/FAQ) + CTA + Footer; Layout sauber |

## Live Jimdo (4)

| Datei | Verdict | Grund |
|---|---|---|
| live-home-desktop-full.png | PASS | Live-Home gerendert: Hero, Sommerkurse-Tabelle, Event-Flyer, Collabs, Footer; kein Cookie-Banner im Shot |
| live-fotos-desktop-full.png | PASS | Fotos-Seite mit Hero und mehreren Album-Blöcken; Thumbnails und Hauptmotive geladen |
| live-privatstunden-desktop-full.png | FAIL | 404: «Die Seite wurde nicht gefunden» + Sitemap; grosser weisser Leerbereich statt Privatstunden-Inhalt |
| live-kurse-desktop-full.png | FAIL | 404: «Die Seite wurde nicht gefunden» + Sitemap unter B/W-Hero; Kurse-Inhalt fehlt komplett |

## FAIL-Liste

1. **live-privatstunden-desktop-full.png** — 404-Seite (weisser Leer-Hero + «Die Seite wurde nicht gefunden»), kein Privatstunden-Content.
2. **live-kurse-desktop-full.png** — 404-Seite («Die Seite wurde nicht gefunden»), kein Kurse-Content.

## Notizen (kein FAIL)

- Vercel-Above-the-fold-Shots schneiden bewusst Folgesektionen am Viewport-Rand ab (normal für ATF).
- Live-Home/Fotos sind Jimdo-Alt-Design (dicht, Flyer-lastig) — Capture selbst ist gültig, Design-Qualität ist nicht Abnahme-Kriterium dieser Serie.
- Kein Cookie-Banner in irgendeinem der 24 PNGs.
- Keine grauen Bild-Boxen auf Vercel-Shots.

## Critic-Kontrakt (Serie)

```
verdict: fail
biggest_gap: Live-Shots privatstunden und kurse sind 404-Seiten ohne Seiteninhalt
beleg: live-privatstunden-desktop-full.png Mitte «Die Seite wurde nicht gefunden»; live-kurse-desktop-full.png Mitte gleicher 404-Text
confidence: HIGH
```

## Nachtrag Runde 2 (Parent, 2026-08-12)

Die zwei FAIL-Shots waren 404, weil die falschen Live-Pfade verwendet wurden. Neu geschossen mit den echten Jimdo-Pfaden aus der Redirect-Matrix (Roh-CDP, reduced-motion, Scroll-Durchlauf, Bilder abgewartet):

| Datei | Pfad | Befund | Verdict |
|---|---|---|---|
| `live-privatstunden-desktop-full.png` | `/kurse/privatstunden/` | Visuell geprüft (Read): volle Seite, H1 „Unsere Privatstunden", Preise CHF 100/450/130/600 sichtbar, kein 404 | **PASS** |
| `live-kurse-desktop-full.png` | `/kurse/` | Mechanisch geprüft: Titel „Reguläre Tanzkurzse - Salsa Tanzschule in Basel", Contenthöhe 4730px — echte Inhaltsseite, kein 404-Titel | **PASS** |

Damit: Vercel 20/20 PASS · Live 4/4 PASS. **Gesamtserie abgenommen.**
