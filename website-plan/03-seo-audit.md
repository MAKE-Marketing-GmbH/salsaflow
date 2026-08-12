# SEO-Audit — Live-Site vs. Repo-Stand (Vercel)

**Rolle:** SEO-Draft
**Stand:** 2026-08-12
**Live (Ist):** [https://www.salsaflow-dc.com/](https://www.salsaflow-dc.com/) — Jimdo hinter Cloudflare
**Repo-Stand (Soll/Zielbild):** `/root/clients/salsaflow-dc/dist/` (26 indexierbare Routen, vorgerendert)
**Scope:** FULL, PLANNING ONLY — kein Production-Code geändert.

## Beweisregel

Jede Zahl in diesem Dokument stammt aus einem ausgeführten Befehl gegen die Live-Site oder das
gebaute `dist/`-Verzeichnis am 2026-08-12. Es gibt in diesem Lauf **keine SEO-Data-API**
(kein DataForSEO, kein Semrush, kein Ahrefs, keine Search-Console-Anbindung — geprüft über
Environment- und Binary-Scan). Deshalb enthält dieses Audit **keine Suchvolumen-Zahlen**.
Alle Volumen- und Prioritätsaussagen im Plan sind als `SCHÄTZUNG` gekennzeichnet und als
Reihenfolge-Logik zu lesen, nicht als Messwert.

---

## 1. Das Wichtigste in fünf Sätzen

1. Die **Live-Site ist technisch schwach**: 0 strukturierte Daten auf allen 13 geprüften Seiten, 7 H1 auf der Startseite, 744 von 749 Bildern in der Galerie ohne Alt-Text, kein hreflang trotz englischer Seiten.
2. Der **Repo-Stand ist der Live-Site technisch weit voraus**: genau 1 H1 pro Seite, JSON-LD auf jeder Route, saubere Canonicals, echter HTML-Text ohne JavaScript, und ein Prüf-Skript, das das erzwingt.
3. Die **grösste ungelöste Lücke im Repo** ist die englische Sprache: die Übersetzungen existieren vollständig im Code, haben aber **keine einzige eigene URL** — Google kann sie nicht finden, nicht indexieren, nicht ranken. Das ist verschenkte Arbeit.
4. Die **zweitgrösste Lücke** ist die fehlende Verbindung nach aussen: kein Analytics, keine Search Console, kein echter Google-Maps-Link — es gibt also nach dem Start keine Möglichkeit zu sehen, ob SEO wirkt.
5. **Inhaltlich** ist der Repo-Stand stark genug für KI-Suche (21 echte FAQ-Fragen mit Schema), aber die Seiten verlinken sich fast nur über Navigation und Fussbereich, kaum im Fliesstext.

---

## 2. Prüfumfang und Befehle

| Prüfung | Methode |
|---|---|
| Live-Seitenanalyse (13 Seiten) | `curl` + Python-Parser, `/tmp/sfdc-seo/audit.py` |
| Weiterleitungen / Statuscodes | `curl -o /dev/null -w "%{url_effective} %{http_code}"` |
| robots.txt / sitemap.xml Live | direkter Abruf |
| Repo-Stand | Parser über alle 29 Dateien in `dist/**/*.html` |
| Interne Verlinkung | Link-Graph-Parser über `dist/` |
| SEO-Gate im Repo | `node scripts/verify-seo.mjs` |
| SEO-Data-API | Environment-/Binary-Scan → **nicht vorhanden** |

---

## 3. Live-Site — gemessener Ist-Zustand

### 3.1 Seiten-Messwerte (2026-08-12)

| Seite | Titel-Länge | Desc-Länge | H1 | JSON-LD | hreflang | Bilder (Alt leer) | Wörter |
|---|---:|---:|---:|---:|---|---|---:|
| `/` | 51 | 141 | **7** | **0** | — | 50 (**45**) | 571 |
| `/kurse/` | 47 | 147 | **3** | 0 | — | 13 (6) | 215 |
| `/kurse/preise/` | 64 | 154 | 1 | 0 | — | 6 (0) | 255 |
| `/kurse/privatstunden/` | 41 | 136 | **2** | 0 | — | 6 (0) | 229 |
| `/infos/faq/` | 31 | 117 | 1 | **0** | — | 5 (0) | 635 |
| `/über-uns/team/` | 38 | 130 | **3** | 0 | — | 14 (9) | 283 |
| `/kontakt/kontakt/` | 48 | 139 | 1 | 0 | — | 5 (0) | 175 |
| `/fotos-1/` | 63 | **0** | **0** | 0 | — | **749 (744)** | 194 |
| `/angebot/` | 59 | 151 | 1 | 0 | — | 10 (3) | 329 |
| `/events/salsa-partys-in-basel/` | 40 | 108 | **2** | 0 | — | 8 (3) | 300 |
| `/kurse/workshops/` | 59 | 146 | **2** | 0 | — | 10 (5) | 258 |
| `/home-en/` | 51 | **0** | **5** | 0 | — | 23 (18) | 585 |
| `/kontakt/tanzstudio/` | 44 | 143 | **3** | 0 | — | 9 (4) | 373 |

### 3.2 Was live sauber ist (nicht kaputtreden)

- **Weiterleitungen sind korrekt.** `http://` → `https://`, `salsaflow-dc.com` → `www.salsaflow-dc.com`, jeweils sauber und ohne Kette:
  - `http://salsaflow-dc.com/` → `https://www.salsaflow-dc.com/` (200, 2 Sprünge)
  - `https://salsaflow-dc.com/` → `https://www.salsaflow-dc.com/` (200, 1 Sprung)
- **404 antwortet echt mit 404** (nicht mit 200 wie bei vielen Baukästen). Geprüft: `/diese-seite-existiert-nicht-xyz/` → `404`.
- **Canonicals sind gesetzt** und zeigen auf sich selbst; `/kurse` ohne Schrägstrich zeigt korrekt auf `/kurse/`.
- **robots.txt existiert** und verweist auf die sitemap.xml.
- **Server ist schnell:** erste Antwort in 0,18 s (Cloudflare-Cache).
- **FAQ-Inhalt ist inhaltlich gut** (635 Wörter, echte Fragen) — die Substanz ist da, nur ohne Schema.

### 3.3 Harte Befunde Live (nach Wirkung sortiert)

**L-01 — Keine einzigen strukturierten Daten, sitewide. (kritisch)**
Auf **allen 13 geprüften Seiten**: 0 Blöcke `application/ld+json`. Keine `LocalBusiness`-Angaben,
keine Adresse, kein Telefon, keine Öffnungszeiten, kein `FAQPage`, kein `Course`, kein `Event`.
Für eine lokale Tanzschule ist das der teuerste Einzelfehler: Google und KI-Assistenten bekommen
kein maschinenlesbares „wer, wo, was, wie teuer". Die FAQ-Seite hat 635 Wörter echte Antworten —
ohne `FAQPage`-Markup ist sie für KI-Antworten deutlich schlechter verwertbar.

**L-02 — Startseite hat 7 H1-Überschriften. (hoch)**
Gemessen: `Salsaflow Dance Company`, `Sommerkurse ab 10. August 2026`, `Neue Kurse ab 31. August 2026`,
`Workshop & Danceflow Night`, `Danceflow Night - Outdoor Editions`, `Floweekend 9-10 Oktober 2026`, `COLLABS`.
Sieben gleichrangige Hauptüberschriften heissen für eine Suchmaschine: keine davon ist die Hauptüberschrift.
Dazu nur **eine** H2 auf der ganzen Seite — die Gliederung ist also nicht flach, sondern falsch herum.
Betroffen sind auch `/kurse/` (3), `/über-uns/team/` (3), `/kontakt/tanzstudio/` (3), `/home-en/` (5).

**L-03 — Die Fotogalerie ist eine Barrierefreiheits- und Bildersuche-Ruine. (hoch)**
`/fotos-1/`: **749 Bilder, davon 744 mit leerem Alt-Text**, dazu **keine H1** und **keine
Meta-Description**. Die Seite trägt zusätzlich den Titel eines einzelnen Abends von 2023
(`Danceflow Night - 15. Dezember 2023`) als Titel der gesamten Galerie. Für Screenreader-Nutzer
ist die Seite praktisch leer, für die Google-Bildersuche unsichtbar.

**L-04 — Englische Seiten ohne hreflang und ohne Beschreibung. (hoch)**
`/home-en/` existiert, hat aber: **keine Meta-Description**, den **deutschen Titel**
(`Salsaflow Dance Company - Salsa Tanzschule in Basel`), **kein hreflang** und ist **nicht in der
sitemap.xml**. Die Sitemap enthält 0 englische Einträge (geprüft). Google bekommt also nie gesagt,
dass es eine englische Fassung gibt — und findet sie über die Sitemap gar nicht erst.

**L-05 — Sitemap ist unvollständig und ohne Datumsangaben. (mittel)**
21 URLs, davon 0 englische. Keine `lastmod`-, `changefreq`- oder `priority`-Angaben (geprüft: 0 Treffer).
Ohne `lastmod` hat der Crawler kein Signal, welche Seite sich geändert hat.

**L-06 — Doppelte Seiten durch Baukasten-Struktur. (mittel)**
`/kontakt/` und `/kontakt/kontakt/` liefern **denselben Titel** (`Kontaktieren Sie uns - Salsa
Tanzschule in Basel`) unter **zwei verschiedenen Adressen**, jede mit einem Canonical auf sich selbst.
Damit konkurrieren zwei identische Seiten miteinander, statt dass eine gewinnt. Gleiches Muster bei
`/angebot/` und `/events/` als parallele Übersichtsseiten.

**L-07 — Titel-Muster verbrennt Platz und enthält Tippfehler. (mittel)**
Fast jeder Titel endet auf `- Salsa Tanzschule in Basel`. Das ist an sich sinnvoll, aber:
- `/kurse/`: „Reguläre **Tanzkurzse**" — Tippfehler im Seitentitel.
- `/infos/faq/`: nur 31 Zeichen — halber Titel verschenkt.
- Die Marke „Salsaflow" fehlt in mehreren Titeln komplett.
- Bachata und Heels tauchen in **keinem** Titel auf, obwohl beides unterrichtet wird.

**L-08 — Beschreibungen beantworten die falsche Frage. (mittel)**
`/kurse/` beschreibt sich mit „Für unsere Beginner-Tanzkurse reichen Straßenschuhe aus…" — das ist
eine Detail-Antwort aus dem Fliesstext, kein Grund zu klicken. `/angebot/` beginnt mit „Du bist
verhindert und kannst zu Beginn des Kurses nicht dabei sein?". Beide Texte wurden offensichtlich aus
dem Seiteninhalt übernommen statt geschrieben. Zusätzlich: `/events/salsa-partys-in-basel/` benutzt ein
grünes Haken-Symbol und die Sie-Form, während die Marke sonst „Du" sagt.

**L-09 — Sie/Du-Bruch mitten in der Marke. (mittel)**
`/kontakt/kontakt/`: Titel „**Kontaktieren Sie uns**", Beschreibung „**Kontakieren** Sie uns!"
(zusätzlich Tippfehler). Der Rest der Site duzt. Für die im Designsystem festgelegte warme
Du-Ansprache ist das ein Bruch direkt an der wichtigsten Kontaktstelle.

**L-10 — Sehr dünne Seiten. (mittel)**
`/kontakt/kontakt/` 175 Wörter, `/fotos-1/` 194, `/kurse/` 215, `/kurse/privatstunden/` 229.
Für die kommerziell wichtigen Suchbegriffe („Salsa Kurs Basel", „Privatstunden Basel") ist das zu
wenig Substanz, um gegen Wettbewerber zu bestehen.

**L-11 — Tippfehler in dauerhaften Adressen. (mittel, blockiert Relaunch nicht)**
Live-Adressen enthalten `philisophie` (statt Philosophie) und `anniverysary` (statt anniversary).
Diese Adressen dürfen **nicht** in den Relaunch übernommen werden; sie brauchen eine Weiterleitung.

**L-12 — Meta-Pixel ohne erkennbaren Zweck. (Datenschutz-Prüfpunkt)**
Die Live-Startseite lädt `connect.facebook.net/en_US/fbevents.js`, obwohl es laut
`01b-online-praesenz.md` **keinen betriebenen Facebook-Kanal** gibt. Diese Altlast darf beim
Umzug nicht mitgenommen werden.

---

## 4. Repo-Stand (Vercel) — gemessener Ist-Zustand

### 4.1 Was hier richtig gebaut ist

Der vorgerenderte Stand löst fast alle Live-Probleme. Gemessen über alle 29 HTML-Dateien in `dist/`:

| Signal | Ergebnis |
|---|---|
| H1 pro indexierbarer Seite | **genau 1** — auf allen 26 Seiten |
| Strukturierte Daten | **1 bis 3 Blöcke pro Seite**, inklusive `LocalBusiness`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `Course` |
| Canonical | auf allen 26 indexierbaren Seiten korrekt und absolut |
| `robots`-Angabe | `index, follow` öffentlich; `noindex, nofollow` auf `/admin`, `/buchung`, `/404` |
| Text ohne JavaScript | ja — z. B. Startseite 1302 Wörter, `/tanzkurse/salsa` 851, `/kursaufbau` 838 |
| Bilder ohne Alt-Attribut | **0** über alle 29 Dateien |
| Verwaiste Seiten | keine (ausser bewusst `/admin`, `/buchung`, `/404`) |
| sitemap.xml + robots.txt | vorhanden, 26 Adressen, alle auf der richtigen Domain |
| Prüf-Gate | `node scripts/verify-seo.mjs` → **PASS: 26 Routen** |

Belegte Ausgabe des Gates:

```
SEO-Verify PASS: 26 Routen mit Titel, Description, Canonical, H1 und HTML-Text.
```

Das ist der eigentliche Wert des Repo-Stands: die SEO-Grundlagen sind nicht nur einmal richtig
gemacht, sondern **maschinell abgesichert**. `scripts/verify-seo.mjs` bricht den Build ab, wenn
eine Seite zwei H1 bekommt, ein Canonical falsch ist oder eine Description fehlt.

Inhaltlich stark für KI-Suche: die FAQ-Seite liefert **21 echte Fragen mit Antworten** im
`FAQPage`-Markup — genau die Fragen, die Menschen wirklich stellen („Kann ich ohne Tanzpartner
kommen?", „Was ist, wenn ich mein Level nicht kenne?", „Kann ich mit Strassenschuhen ins Studio?").

Sauber gelöste Ehrlichkeitsfrage: `src/lib/seo-schema.ts:107` hält die Liste bestätigter Events
bewusst **leer**, mit Begründung im Code — es wird also kein `Event`-Markup mit erfundenem Datum
erzeugt. Ebenso steht **kein `aggregateRating`** im `LocalBusiness`-Markup. Das entspricht der
Vorgabe, keine Bewertungen zu erfinden, und ist genau richtig.

### 4.2 Harte Befunde Repo

**R-01 — Englisch existiert, ist aber für Google unsichtbar. (kritisch)**
Die Übersetzungen sind **vollständig vorhanden**: `src/lib/seo-config.ts` enthält für alle 29
Seitenschlüssel deutsche **und** englische Titel und Beschreibungen (z. B. Zeile 104:
`Dance School Basel: Salsa, Bachata & Heels | Salsaflow`).

Aber:
- `src/routes.tsx` enthält **keine einzige englische Adresse** (geprüft: 0 Treffer für `/en`).
- Die Sprache wird nur im Browser-Speicher gehalten: `src/lib/i18n.tsx:11` `STORAGE_KEY = 'salsaflow-lang'`, gesetzt in Zeile 447 über `localStorage.setItem`.
- Vorgerendert wird ausschliesslich Deutsch: `scripts/prerender.mjs:34` schreibt fest `<html lang="de-CH">`, Zeile 49 fest `og:locale = de_CH`.
- Gegenprobe: englische Textbausteine kommen in `dist/index.html` und `dist/tanzkurse/salsa.html` **0 mal** vor.
- `src/components/SeoHead.tsx` setzt **kein** `hreflang` (geprüft: 0 hreflang-Angaben in allen 29 Dateien).

**Wirkung:** Wechselt ein Besucher auf Englisch, ändert sich die Adresse nicht. Es gibt also keine
englische Seite, die Google speichern könnte. Die komplette englische Übersetzung — inklusive der
sorgfältig geschriebenen Beschreibungen — bringt aktuell **null** Suchsichtbarkeit. Für eine
Tanzschule direkt am Bahnhof Basel SBB mit internationalem Publikum ist das die grösste verschenkte
Chance im ganzen Projekt.

**R-02 — Kein Analytics, keine Search Console. (kritisch für Steuerbarkeit)**
Scan über `src/`, `index.html` und `public/`: **kein** Google Analytics, **kein** Tag Manager,
**kein** Plausible/Umami/Matomo/PostHog, **keine** Search-Console-Bestätigung.
Wirkung: Nach dem Start gibt es keine Antwort auf „bringt das etwas?". Kein Suchbegriff-Bericht,
keine Indexierungsprüfung, keine Messung, wie viele Menschen wirklich eine Schnupperstunde anfragen.

**R-03 — Ein einzelnes JavaScript-Paket von 1,1 MB. (hoch, Ladezeit)**
Gemessen: `dist/assets/index-BekJJ7mV.js` = **1,1 MB**, CSS 156 KB, `dist/assets` insgesamt 1,9 MB.
Weil die Seiten vorgerendert sind, sieht der Besucher den Text sofort — der Schaden ist also
begrenzt. Aber das Paket blockiert die Bedienbarkeit (Interaktion) und zählt gegen die
Ladezeit-Bewertung, besonders auf Mobilfunk. Das Buchungs- und Verwaltungs-JavaScript wird
offensichtlich auch auf reinen Textseiten wie `/impressum` mitgeladen.

**R-04 — Die Vorlade-Anweisungen zeigen auf die falschen Bilder. (hoch, Ladezeit)**
In `dist/index.html` werden drei Bilder vorgeladen: `salsaflow-wordmark.png`,
`salsaflow-logo-weissrot.png`, `google-g.svg` — also **Logos**. Das grosse Startbild, das den
Ladezeit-Wert bestimmt, ist **nicht** dabei. Ausserdem sind 53 der 249 Fotos noch JPG/PNG statt WebP,
und die Foto-Ordner wiegen zusammen 33 MB.

**R-05 — Die Seiten verlinken sich fast nur über Navigation und Fussbereich. (mittel)**
Der Link-Graph zeigt ein verdächtig gleichmässiges Bild: **jede** der 26 Seiten hat **exakt 27**
eingehende Links. Das ist das Muster von Navigation und Fussbereich, nicht von echten Empfehlungen.
Zählt man nur Links im eigentlichen Seiteninhalt:

| Seite | Links im Inhalt |
|---|---:|
| `/preise` | 10 |
| `/` | 13 |
| `/privatstunden` | **3** |
| `/tanzkurse/salsa` | **2** |

Die wichtigste Geldseite der Schule — `/tanzkurse/salsa` — verweist im gesamten Fliesstext auf
genau zwei andere Seiten. Sie verlinkt **nicht** auf `/preise`, **nicht** auf `/kursplan`,
**nicht** auf `/faq`. `/preise` ist dagegen vorbildlich gebaut und zeigt, wie es gehen kann.

**R-06 — Sitemap ohne Datumsangaben. (niedrig)**
`public/sitemap.xml`: 26 Adressen, **0** `lastmod`-Angaben (geprüft). Bei einer Schule, deren
Kursplan sich jede Staffel ändert, ist das ein verschenktes Frische-Signal.

**R-07 — Nur ein einziger Verweis auf externe Profile. (niedrig, wirkt auf Vertrauen)**
`src/lib/seo-schema.ts:155`: `sameAs: ['https://www.instagram.com/salsaflowdc']`. Der echte
Google-Maps-Eintrag fehlt (laut `01b-online-praesenz.md` verlinkt der Fussbereich nur eine
allgemeine Google-Suche, keinen echten Eintrag). Für lokale Suche ist der bestätigte
Google-Unternehmenseintrag das wichtigste Einzelsignal überhaupt.

**R-08 — Ein Standardbild für alle Seiten beim Teilen. (niedrig)**
`src/lib/seo-config.ts:83` setzt `hp-05.webp` als Vorschaubild für **jede** Seite. Wer einen Link zu
`/preise` oder `/privatstunden` in WhatsApp teilt, sieht immer dasselbe Bild.

**R-09 — Widersprüchliche Zahlen zwischen Live und Repo. (mittel, inhaltlich)**
Der Repo-Stand schreibt in mehreren Beschreibungen „**drei Studios**" (`seo-config.ts:161`, `:190`)
und „rund 40 Kurse pro Woche" (`:161`). Die Live-Studioseite nennt dagegen **zwei** gleich grosse
Studios. Diese Diskrepanz ist in `01-firma-dossier.md` als offener Punkt R-04 vermerkt. Solange sie
nicht geklärt ist, steht in Titel und Beschreibung eine Zahl, die möglicherweise falsch ist —
und Beschreibungen sind das, was in der Google-Trefferliste steht.

**R-10 — „Erste Schnupperstunde gratis" ist ein ungeprüfter Preisclaim. (mittel, rechtlich)**
`src/lib/seo-schema.ts:143` schreibt in die strukturierten Daten: „Erste Schnupperstunde gratis."
Dieselbe Aussage steht in mehreren Beschreibungen (`seo-config.ts:101`, `:230`). Die Live-FAQ belegt
laut `01-firma-dossier.md` nur, dass eine **Probestunde jederzeit möglich** ist — nicht ausdrücklich,
dass sie **kostenlos** ist. Ein Preisversprechen in strukturierten Daten ist bindend und muss
bestätigt werden. → `PLACEHOLDER` bis Kundenfreigabe.

---

## 5. Direktvergleich

| Prüfpunkt | Live (Jimdo) | Repo (Vercel) | Gewinner |
|---|---|---|---|
| Strukturierte Daten | 0 auf 13 Seiten | 1–3 pro Seite | **Repo** |
| H1-Gliederung | bis zu 7 pro Seite | genau 1 | **Repo** |
| Alt-Texte | 744/749 leer in Galerie | 0 fehlende Attribute | **Repo** |
| Text im HTML | 175–635 Wörter | 264–1302 Wörter | **Repo** |
| FAQ-Markup | keins | 21 Fragen als `FAQPage` | **Repo** |
| Doppelte Seiten | `/kontakt/` + `/kontakt/kontakt/` | keine | **Repo** |
| Adressen-Tippfehler | `philisophie`, `anniverysary` | saubere Adressen | **Repo** |
| Automatische Absicherung | keine | `verify-seo.mjs` PASS | **Repo** |
| Englische Fassung | eigene Adresse, aber ohne hreflang/Description | **gar keine Adresse** | **Live (knapp)** |
| Analytics/Search Console | Meta-Pixel vorhanden | gar nichts | unentschieden |
| Weiterleitungen | sauber | Vercel-Ebene ungeprüft | Live (geprüft) |

**Fazit:** Der Relaunch ist in fast jedem technischen Punkt ein klarer Fortschritt. Genau **zwei**
Dinge kann die Live-Site besser, und beide sind im Repo lösbar: Englisch braucht eigene Adressen,
und es braucht Messung.

---

## 6. Was beim Umzug nicht verloren gehen darf

| Live-Adresse | Ziel im Relaunch |
|---|---|
| `/` | `/` |
| `/kurse/` | `/tanzkurse` |
| `/kurse/preise/` | `/preise` |
| `/kurse/privatstunden/` | `/privatstunden` |
| `/kurse/workshops/` | `/events-workshops/danceflow-night` |
| `/kurse/shows-animationen/` | `/shows-animationen` |
| `/angebot/` | `/tanzkurse` |
| `/angebot/sommerkurse/` | `/tanzkurse` |
| `/über-uns/` | `/team` |
| `/über-uns/team/` | `/team` |
| `/über-uns/philisophie/` | `/team` (Tippfehler nicht übernehmen) |
| `/kontakt/kontakt/` | `/kontakt` |
| `/kontakt/` | `/kontakt` |
| `/kontakt/tanzstudio/` | `/kontakt/standort-raumvermietung` |
| `/fotos-1/` | `/fotos` |
| `/infos/faq/` | `/faq` |
| `/infos/agb/` | `/impressum` — **OFFEN**: eigene AGB-Seite nötig? |
| `/events/salsa-partys-in-basel/` | `/mehr/partys` |
| `/events/` | `/events` |
| `/floweekend-2026/` | `/events-workshops/floweekend` |
| `/sfdc-anniverysaryweekend2026/` | `/events-workshops/anniversary-weekend` (Tippfehler nicht übernehmen) |
| `/home-en/` | `/en` — **erst nach Umsetzung von R-01** |

**Wichtig:** Alle Live-Adressen enden auf einen Schrägstrich, die neuen nicht. Die Weiterleitungen
müssen beide Formen abdecken. Die Adressen mit Umlaut (`/über-uns/`) existieren live in
kodierter Form (`/%C3%BCber-uns/`) und brauchen die Weiterleitung genau so.

**Ohne diese Weiterleitungen verliert die Schule am Umzugstag jede aufgebaute Sichtbarkeit.**
Das ist das grösste Einzelrisiko des Relaunchs.

---

## 7. Rangliste der Befunde

| # | Befund | Ort | Wirkung |
|---|---|---|---|
| 1 | Umzug ohne vollständige Weiterleitungen | Übergang | Totalverlust der Sichtbarkeit |
| 2 | Englisch ohne eigene Adressen (R-01) | Repo | ganzer Sprachmarkt unsichtbar |
| 3 | Keine Messung, keine Search Console (R-02) | Repo | Erfolg nicht steuerbar |
| 4 | Kein Google-Unternehmenseintrag verlinkt (R-07) | Repo/extern | lokale Suche geschwächt |
| 5 | Keine strukturierten Daten (L-01) | Live | wird durch Relaunch gelöst |
| 6 | 1,1 MB JavaScript + falsche Vorladung (R-03/R-04) | Repo | Ladezeit-Bewertung |
| 7 | Kaum Links im Fliesstext (R-05) | Repo | Geldseiten schlecht gestützt |
| 8 | Ungeprüfte Zahlen und Gratis-Claim (R-09/R-10) | Repo | Vertrauen, rechtliches Risiko |
| 9 | Galerie ohne Alt-Texte (L-03) | Live | wird durch Relaunch gelöst |
| 10 | Sitemap ohne `lastmod` (R-06) | Repo | schwaches Frische-Signal |

---

## 8. Grenzen dieses Audits

- **Keine SEO-Data-API vorhanden** → keine Suchvolumen, keine Positionen, keine Wettbewerbsdaten. Alle Prioritäten im Plan sind Logik, keine Messwerte, und sind als `SCHÄTZUNG` gekennzeichnet.
- **Keine Search-Console-Daten** → aktuelle Positionen und Klicks der Live-Site sind unbekannt.
- **Ladezeit nicht am echten Nutzer gemessen** → Aussagen zu R-03/R-04 stammen aus Dateigrössen und Vorlade-Anweisungen, nicht aus einer Feldmessung.
- **Google-Unternehmenseintrag nicht primär geprüft** (kein Zugang) → siehe `01b-online-praesenz.md`.
- **Vercel-Weiterleitungen nicht live geprüft** → `vercel.json` wurde nicht gegen eine laufende Preview-Adresse getestet.

---

*Belege: `/tmp/sfdc-seo/audit.py` + `audit.json` (13 Live-Seiten), Parser über `dist/**/*.html` (29 Dateien), `node scripts/verify-seo.mjs` (PASS), `curl`-Statusprüfungen — alle am 2026-08-12 ausgeführt. Keine Production-Datei geändert.*
