# Parent Screenshot-Notizen (Belege für Research/Assets/SEO)

**Stand:** 2026-08-12  
**Run-ID:** `wf_c3729fb9-2f4`  
**Ordner:** [`screenshots/`](/root/clients/salsaflow-dc/website-plan/screenshots/)

## DNS / Hosting-Fakt (kritisch)

- `www.salsaflow-dc.com` antwortet mit **Jimdo** (`x-jimdo-wid`, Cloudflare).
- Vercel-Deployment `salsaflow-1cb9wgrkx-…` listet Aliases inkl. `www.salsaflow-dc.com`, aber **Live-Traffic ist noch Jimdo**.
- Neue Site erreichbar unter:
  - https://salsaflow-dc.vercel.app/
  - https://salsaflow-1cb9wgrkx-raphael-2645s-projects.vercel.app/
- Plan muss DNS-Cutover + Redirect-Map Jimdo→Neue URLs behandeln.

## Live Jimdo (www) — Screenshot-Kritik

### Home (`live-home.png`)
- Rotes Menü-Chaos: Events (Floweekend/Anniversary) sitzen auf Top-Level neben Home/Angebot.
- Hero praktisch **leer / grauer Streifen** + Cookie-Overlay dominiert.
- Willkommenstext lang, wenig Scan, CTA schwach.
- Teamfoto unten ok, aber Seite fühlt sich nach 2015 an.

### Privatstunden (`live-privatstunden.png`)
- Text+Preise klar (gut).
- Hero-Bild: älteres Paar im Unterricht — **weich, warm-gelb, wenig Premium**.
- CTA „Privatstunden Anfrage“ vorhanden.
- Preise belegbar: 1P 100 / 5×450; 2P 130 / 5×600 CHF.

### Fotos (`live-fotos.png` / `live-fotos-full.png`)
- **Stärkste Bildquelle** der Live-Site (User: Bilder top).
- Als Source-of-Truth für Qualitäts-Fotos im Asset-Plan nutzen.
- URL: https://www.salsaflow-dc.com/fotos-1/

## Vercel-Neu-Site — Screenshot-Kritik

### Home (`vercel-home.png` / `vercel-home-full.png`)
- Nav clean (Tanzkurse, Kursplan, Events, Team, Fotos, Mehr, Kontakt) + CTA „Gratis Schnupperstunde“.
- **Katastrophe Above-the-fold:** riesiger Weißraum, Hero-Bild fehlt/lädt nicht im Headless (oder Layout-Bug).
- Headline „Salsa, Bachata und Heels. Mitten in Basel.“ + „Bailar es vivir.“ — Richtung gut, Ausführung leer.
- Cookie-Bar unten.

### Privatstunden (`vercel-privatstunden.png`)
- **Dasselbe weiche Unterrichts-Foto** wie Live (offer-privat) — Raphael: „sieht absolut behindert aus“.
- Soft-Blur / low bitrate: Datei `offer-privat-800.webp` nur ~33 KB bei 800×1067; square ~45 KB bei 1200².
- Layout: Bild rechts, viel Leerraum links; Text hellgrau, Kontrast schwach.
- Use-Cases (Hochzeitstanz) ok, CTA „Ziel beschreiben“ schwach vs. Preisanfrage.

## Repo-Asset-Bomben (Messung)

| Datei | Problem |
|---|---|
| `public/photos/showcase/hp-10.webp` u.a. | 62×62, 66 Bytes — **Placeholder-Müll** |
| `public/photos/team/founder-*.jpg` | 240×240, 6–10 KB — zu klein |
| `public/photos/premium/offer-privat-*.webp` | starke Kompression, weich |
| `public/photos/premium/home-hero-wide-*.webp` | 24–42 KB bei 1600–2400 px — zu dünn |

## Auftrag an Asset-Agent (Pflicht)

1. Live `/fotos-1/` inventarisieren (URLs + Einsatzvorschläge).
2. Repo `public/` inventarisieren inkl. Alt-Text-Vorschläge **für jedes Bild**.
3. Gap-Matrix: Wollen | Haben | Fehlt | Beschaffen (von Live-Fotos ziehen).
4. Privatstunden-Hero **ersetzen** mit scharfem Live-Foto (Paar/Unterricht/Show — Premium, scharf, warm).
5. Keine Fake-Reviews.

## Backend/Anfrage-Logik (für späteren Plan, nicht Code)

Repo hat bereits: Kontakt-API → Mail `info@salsaflow-dc.com`, Booking `/buchung`, Kursplan, Admin, optional Payments (DECISIONS/ARCHITEKTUR).  
Plan soll erklären: Schnupperstunde vs Kursbuchung vs Privatstunden-Anfrage vs Shows-Anfrage — welche Form, welche Felder, was ins Backend.

## Screenshots-Index

- `live-home.png`
- `live-fotos.png` / `live-fotos-full.png`
- `live-privatstunden.png`
- `live-kurse.png`
- `vercel-home.png` / `vercel-home-full.png`
- `vercel-privatstunden.png` / `vercel-privat-full.png`
- `vercel-fotos.png`
