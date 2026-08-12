# IA-Entwurf A — Zwei Sitemap-/Sektions-Alternativen

**Rolle:** IA-Worker A
**Stand:** 2026-08-12
**Modus:** PLANNING ONLY — kein Production-Code.
**Verbindlich:** [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md) (locked v2) · [DECISIONS.md](/root/clients/salsaflow-dc/DECISIONS.md) (frozen) · [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md) (frozen)
**Grundlagen:** [00-meta-plan.md](/root/clients/salsaflow-dc/website-plan/00-meta-plan.md) · [01-firma-dossier.md](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md) · [03-seo-audit.md](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md) · [04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md) · Repo-Routing [routes.tsx](/root/clients/salsaflow-dc/src/routes.tsx)

---

## 0. Ausgangslage — was die IA leisten muss

### 0.1 Bestand (Repo, belegt aus `routes.tsx`, Zeilen 44–78)

Heute existieren **27 SEO-Routen + 4 App-Routen**. Struktur-Ist:

```
/ (Home)
/tanzkurse ──┬── /tanzkurse/salsa
             ├── /tanzkurse/bachata
             └── /tanzkurse/heels
/privatstunden
/kursaufbau
/preise
/kursplan  (app-public, data-driven)
/shows-animationen
/events
/events-workshops ──┬── /danceflow-night
                    ├── /anniversary-weekend
                    ├── /floweekend
                    └── /eventkalender
/team
/fotos
/kontakt ── /kontakt/standort-raumvermietung
/mehr ──┬── /mehr/collabs
        ├── /mehr/tanzschuhe
        └── /mehr/partys
/faq
/impressum · /datenschutz
/buchung ──┬── /buchung/erfolg
           └── /buchung/abbruch
```

Plus 3 Redirects (`/shows`, `/events-workshops`, `/kursplan-buchung`) — belegt `routes.tsx` Zeilen 75–77.

### 0.2 Befund-Stichworte (aus 03/04, die die IA treffen)

- **Live-Ist-Zustand:** Jimdo-Site mit inkonsistenter URL-Hierarchie (Umlaute, Tippfehler `philisophie`/`anniverysary`, doppelte Kontakt-Pfade `/kontakt/` vs `/kontakt/kontakt/`), Sie/Du-Bruch, keine EN-Version im Repo, keine feste Öffnungszeiten/Maps auf Kontakt.
- **Repo-Ist-Zustand:** 27 Routen bereits gut strukturiert, aber: `/mehr` ist ein Sammelbecken (collabs/tanzschuhe/partys — drei unterschiedliche Absichten), `/events-workshops` mischt Marken-Events mit dem generischen Eventkalender, und die Geld-Seiten (Kurse, Privatstunden, Preise) konkurrieren nicht, sitzen aber auf unterschiedlichen Nav-Ebenen.
- **Booking-Regel (ARCHITEKTUR frozen):** Public liest nur Kurs-/Staffel-Daten + abgeleitete Kapazität; Schreibzugriff nur über Server (Edge Functions); Buchung startet Stripe Checkout; Status-Maschine `pending_payment → confirmed | waitlisted | cancelled`. Kein Login für Kunden, nur Admin-Auth. → Die IA darf **keinen Kunden-Account-Bereich** einführen.
- **Keyword-Mapping (04-seo-plan, SCHÄTZUNG):** Jede Route hat bereits einen Hauptbegriff. Die IA darf kein Keyword doppelt besetzen. Offene Entscheidung S-05: Hochzeitstanz = Abschnitt auf `/privatstunden` oder eigene Seite.
- **DESIGN v2 locked:** Cal Sans Display + Afacad Body, ink `#0a0a0a`, salsa `#ad1827` nur Akzent/Aktion, `rounded-full` Buttons, `data-reveal` Stagger, warm-familiäres Du. → Nav-CTAs und Section-Übergänge müssen dieses System tragen; salsa-Rot ist Handlungsfarbe (DECISIONS Fire 31: blockierte Zustände tragen kein Salsa).

### 0.3 Anforderungen an beide Alternativen

1. **Eine Suchabsicht pro Adresse** (04-seo-plan Regel).
2. **Max. 2 Klicks von `/` zu jeder Buchungs-Handlung** (Schnupperstunde, Kurs buchen, Privatstunde anfragen).
3. **`/mehr` auflösen oder schärfen** — Sammelbecken ohne Suchabsicht ist toter Nav-Platz.
4. **301-Mapping komplett** — Live hat 22 Adressen (03-seo-audit Abschnitt 6); beide Alternativen müssen jedes Ziel adressieren.
5. **Kein Kunden-Login, kein Dashboard** — bricht ARCHITEKTUR.
6. **EN-Version als Later-Phase** markieren (04-seo-plan Lücke), aber URL-Strategie jetzt festlegen.
7. **Mobile-First-Nav:** max. 6 Top-Level-Items + 1 CTA (Faustregel aus Screen-Quality-Rubric; 7+ Items brechen auf 375px).

---

## ALTERNATIVE A1 — „Flach & Handlungsorientiert"

**Leitidee:** Die drei Geld-Wege (Kurs finden → buchen, Privatstunde anfragen, Show buchen) sind Top-Level. Alles Community-/Vertrauens-Zeug rutscht in Footer + kontextuelle Querverlinkung. `/mehr` wird **abgeschafft**.

### Sitemap A1

```
NAVIGATION (Top-Level, 6 + CTA)
────────────────────────────────────────────────────────────
[Logo]  Kurse ▾   Preise   Kursplan   Events ▾   Team   Kontakt   [Gratis Schnupperstunde]
         │                        │
         ├─ Alle Kurse            ├─ Danceflow Night
         ├─ Salsa                 ├─ Workshops & Specials
         ├─ Bachata               ├─ FLOWeekend
         └─ Heels                 └─ Eventkalender

SEITEN-BAUM (Tiefe max. 3)
────────────────────────────────────────────────────────────
/
├── /tanzkurse                     Hub: Stil-Wahl + Level-Teaser + Preis-Teaser
│   ├── /tanzkurse/salsa           Geld-Seite P0
│   ├── /tanzkurse/bachata         Geld-Seite P0
│   └── /tanzkurse/heels           Geld-Seite P1
├── /privatstunden                 Geld-Seite P0 (enthält Hochzeitstanz-Abschnitt, s. S-05)
├── /kursaufbau                    Level-Orientierung (aus Kurse-Dropdown verlinkt, nicht Nav)
├── /preise                        Geld-Seite P0 (Tarife: Normal/Reduziert/Paar/Familie/Student/Pushflow)
├── /kursplan                      Data-driven Tabelle (app-public, filterbar)
├── /events                        Hub: kommende Termine, 3 Karten-Typen
│   ├── /events/danceflow-night    Event-Marke P0 (salsa party basel)
│   ├── /events/floweekend         Event-Marke P2
│   ├── /events/anniversary-weekend Event-Marke P2
│   └── /events/kalender           Liste/Archiv (ersetzt /events-workshops/eventkalender)
├── /team                          Vertrauen P1
├── /shows-animationen             B2B P1 (Footer + Home-Sektion verlinkt)
├── /kontakt                       P1 (Form + Map + NAP)
│   └── /kontakt/raum-mieten       P1 (eigener Umsatzstrom; Umbenennung von standort-raumvermietung)
├── /faq                           P0 (AEO-Hauptquelle)
├── /fotos                         P2 (Footer)
├── /tanzschuhe                    P2 Ratgeber (Footer, aus /mehr/tanzschuhe)
├── /impressum · /datenschutz      (Footer)
│
APP-ROUTEN (nicht in Nav, keine Indexierung nötig)
├── /buchung · /buchung/erfolg · /buchung/abbruch
└── /admin (app-private)
```

**Was sich gegenüber Ist ändert:**

| Aktion | Grund |
|---|---|
| `/mehr` + 3 Kinder gelöscht | Sammelbecken ohne Suchabsicht. `partys` → Inhalt in `/events`-Hub einbauen (ist dieselbe Absicht wie Eventkalender). `collabs` → Footer-Link auf externe Partner oder Abschnitt auf `/team`. `tanzschuhe` → eigene Top-Level-Footer-Route (Ratgeber-SEO P2). |
| `/events-workshops/*` → `/events/*` | Pfad kürzer, konsistent mit Hub-Logik. Alte Pfade → 301. |
| `/kontakt/standort-raumvermietung` → `/kontakt/raum-mieten` | Kürzer, suchbegriffsnäher (`tanzraum mieten basel`). Standort-Info gehört auf `/kontakt` selbst (Map + NAP), nicht in eine Unterseite versteckt. |
| `/kursaufbau` aus Hauptnav | Wichtig für Orientierung, aber kein Top-Level-Bedürfnis. Einstieg über Kurse-Dropdown + Kontextlinks von Stil-Seiten. |
| `/shows-animationen` aus Hauptnav | B2B-Absicht, < 5 % der Besucher. Home-Sektion + Footer reicht. |

### Nav-Verhalten A1

- **Desktop:** 6 Items + salsa-CTA `Gratis Schnupperstunde` (rounded-full, `data-reveal` nicht nötig, statisch sichtbar). Dropdowns öffnen auf Hover (Kurse, Events) mit 3–4 Einträgen, kein Mega-Menü.
- **Mobile (≤ 768px):** Burger → Vollbild-Overlay, Items in derselben Reihenfolge, Dropdowns als Akkordeon. CTA sticky unten im Overlay.
- **Footer:** 3 Spalten — (1) Angebot: Kurse, Preise, Kursplan, Privatstunden, Shows; (2) Schule: Team, Fotos, FAQ, Tanzschuhe, Kontakt, Raum mieten; (3) Recht/Social: Impressum, Datenschutz, Instagram, WhatsApp.

### Stärken A1

- **Kürzester Weg zur Buchung:** `/` → Kurse → Salsa → Buchen = 3 Klicks; Schnupper-CTA immer sichtbar.
- **Kein Sammelbecken:** Jede Route hat eine Absicht.
- **SEO-sauber:** Keine zwei Seiten konkurrieren. `partys`-Absicht landet im `/events`-Hub, der dadurch stärker wird (interne Verlinkung konzentriert sich).
- **Mobile-tauglich:** 6 Top-Items passen in ein Overlay ohne Scrollen.

### Schwächen A1

- **`/kursaufbau` verliert Sichtbarkeit** — Neueinsteiger, die nicht wissen welches Level, müssen einen Klick mehr machen. Risiko: mehr Fehlbuchungen/Abbruch im Kursplan.
- **`/mehr/collabs` fällt weg** — falls Collabs strategisch wichtig sind (Szene-Verankerung), ist Footer-only zu schwach. → OQ-Kandidat.
- **B2B (Shows) versteckt** — Firmenanfragen brauchen dann Home-Sektion oder direkten Link.

---

## ALTERNATIVE A2 — „Zwei-Säulen: Lernen & Erleben"

**Leitidee:** Besucher kommen mit zwei Grundabsichten: **Tanzen lernen** (Kurse, Privat, Preise) oder **Tanzen erleben** (Socials, Events, Shows, Community). Die Nav spiegelt das. `/mehr` wird zu **Community** umbenannt und bekommt echte Absicht.

### Sitemap A2

```
NAVIGATION (Top-Level, 5 + CTA)
────────────────────────────────────────────────────────────
[Logo]   Lernen ▾   Erleben ▾   Preise   Team   Kontakt   [Gratis Schnupperstunde]
          │             │
          ├─ Alle Kurse         ├─ Danceflow Night
          ├─ Salsa              ├─ Socials & Partys
          ├─ Bachata            ├─ Workshops & Specials
          ├─ Heels              ├─ FLOWeekend
          ├─ Privatstunden      ├─ Anniversary Weekend
          ├─ Kursplan           └─ Eventkalender
          ├─ Kursaufbau
          └─ Shows & Animationen (B2B)

SEITEN-BAUM
────────────────────────────────────────────────────────────
/
├── /tanzkurse ──┬── /salsa · /bachata · /heels     (wie A1)
├── /privatstunden                                 (wie A1, P0)
├── /kursaufbau                                    (Dropdown-Eintrag, prominenter als A1)
├── /preise                                        (wie A1, P0)
├── /kursplan                                      (Dropdown-Eintrag, app-public)
├── /shows-animationen                             (Dropdown-Eintrag „Lernen"-Kontext: Show-Teams; B2B-Teil unten auf Seite)
│
├── /events                                        Hub „Erleben"
│   ├── /events/danceflow-night                    P0
│   ├── /events/socials-partys                     NEU: merge /mehr/partys + Szene-Überblick
│   ├── /events/floweekend                         P2
│   ├── /events/anniversary-weekend                P2
│   └── /events/kalender                           Liste
│
├── /community                                     (umbenannt aus /mehr)
│   ├── /community/fotos                           (aus /fotos)
│   ├── /community/collabs                         (aus /mehr/collabs)
│   └── /community/tanzschuhe                      (aus /mehr/tanzschuhe)
│
├── /team                                          (wie A1, P1)
├── /kontakt ── /kontakt/raum-mieten               (wie A1)
├── /faq · /impressum · /datenschutz               (Footer)
│
APP-ROUTEN: identisch zu A1 (/buchung*, /admin)
```

**Was sich gegenüber Ist ändert:**

| Aktion | Grund |
|---|---|
| `/mehr` → `/community` | Gibt dem Sammelbecken eine Absicht: Community zeigen. Fotos gehören dazu. |
| `/fotos` → `/community/fotos` | Atmosphäre prüfen = Community-Absicht. Alte URL → 301. |
| `/mehr/partys` → `/events/socials-partys` | Partys sind Erlebnis, nicht „mehr". Stärkt Events-Hub. |
| `/kursaufbau` im Lernen-Dropdown | Sichtbarer als A1, weniger Nav-Platz als Top-Level. |
| `/shows-animationen` im Lernen-Dropdown | Show-Teams lernen = Kurs-Kontext; B2B-Anfragen kommen über eigene Sektion auf der Seite. |
| Top-Level nur 5 Items + CTA | Mehr Whitespace, klarere Fokussierung. Dropdowns tragen die Last. |

### Nav-Verhalten A2

- **Desktop:** 5 Items + CTA. Dropdowns auf Hover mit Eyebrow-Trenner („Stile" / „Orientierung" / „Für Firmen" innerhalb Lernen; „Regelmässig" / „Specials" innerhalb Erleben).
- **Mobile:** Burger-Overlay, zwei Akkordeon-Gruppen (Lernen / Erleben), dann direkte Links Preise/Team/Kontakt, CTA sticky.
- **Footer:** 4 Spalten — (1) Lernen: Kurse, Preise, Kursplan, Privatstunden, Kursaufbau, Shows; (2) Erleben: Danceflow Night, Socials, Workshops, Kalender; (3) Community: Team, Fotos, Collabs, Tanzschuhe, FAQ; (4) Recht/Kontakt.

### Stärken A2

- **Mentales Modell:** „Lernen vs. Erleben" passt zur tatsächlichen Besucher-Absicht (Anfänger vs. Szene-Menschen). Senkt Kognitive Last bei Erstbesuch.
- **`/community` gibt Sammel-Content ein Zuhause** — Collabs, Fotos, Tanzschuhe bekommen einen Kontext statt Footer-Exil.
- **Skaliert besser:** Neue Event-Marken oder Kurs-Stile passen in bestehende Dropdowns ohne Nav-Umbau.
- **Cross-Selling eingebaut:** Wer unter „Erleben" die Danceflow Night anschaut, sieht im selben Menü „Lernen" → natürlicher Übergang Party → Kurs.

### Schwächen A2

- **Ein Klick mehr zu Kernseiten:** `/tanzkurse/salsa` ist jetzt Dropdown-Stufe 2 statt Top-Level-Stufe 1 (A1). Geringfügig höhere Abbruchgefahr bei zielstrebigen Besuchern.
- **Dropdown-Abhängigkeit:** Besucher, die Dropdowns nicht öffnen (v.a. ältere/mobile), sehen Shows/Kursaufbau/Privatstunden nicht direkt. Braucht starke Home-Sektionen als Ausgleich.
- **`/community` als Label ist weniger suchmaschinen-stark** als flache Route (kein eigener Hauptbegriff) — akzeptabel, weil Kinder P2 sind.

---

## Vergleich & Empfehlung

| Kriterium | A1 Flach | A2 Zwei-Säulen |
|---|---|---|
| Klicks zu Buchung | 3 | 4 |
| Top-Level-Items | 6 + CTA | 5 + CTA |
| Sammelbecken | keins | `/community` (mit Absicht) |
| Mobile-Nav | einfach | Akkordeon nötig |
| Skalierbarkeit | begrenzt | gut |
| Mentales Modell | Angebots-Liste | Besucher-Absicht |
| SEO-Risiko | keins | keins (beide sauber) |
| Aufwand Umbau | mittel (Merge + Redirects) | mittel-gross (Rename + Merge + Redirects) |

**Empfehlung (SCHÄTZUNG): A1**, weil:

1. Die Mehrheit der Besucher ist kaufnah (Kurs/Privatstunde/Preise) — kürzester Weg gewinnt.
2. `/mehr` als Konzept ist das grösste IA-Problem des Ist-Zustands; A1 löst es radikal.
3. Mobile-Nav ist einfacher (weniger Verschachtelung).
4. Die A2-Stärke (Lernen/Erleben-Modell) lässt sich in A1 **auf der Home** nachbauen (zwei Sektionen mit eigenem Einstieg), ohne Nav-Komplexität.

A2 wird relevant, wenn Salsaflow die Event-/Community-Sparte stärker ausbaut (mehr Socials, mehr Specials) — dann ist die Dropdown-Struktur die bessere Investition.

---

## Booking-Flow-Einbettung (beide Alternativen identisch)

Frozen Rules aus ARCHITEKTUR (Abschnitte 1.3, 4, 5) — die IA berührt sie nicht:

```
/kursplan  →  Kurs-Karte „Jetzt buchen"  →  /buchung?course=<id>
                                               │
                                               ├─ Formular: Name, E-Mail, Rolle (Leader/Follower),
                                               │   Modus (solo/couple), Tarif (Normal/Student/…)
                                               │
                                               ▼
                                        Stripe Checkout (serverseitig erstellt)
                                               │
                                               ├─ Erfolg → /buchung/erfolg  (Bestätigung + Kalender-ICS)
                                               └─ Abbruch → /buchung/abbruch (Zurück-Link + WhatsApp)
```

- **Kapazität/Warteliste** wird serverseitig geprüft (Edge Function). Kurs-Karte zeigt Badge: grün „Plätze frei" / grau „Ausgebucht" / amber „Quereinstieg möglich" (DECISIONS Fire 31/32, frozen).
- **Kein Kunden-Login.** Buchung ist anonym + E-Mail-Verifikation über Bestätigungsmail (Resend).
- **Privatstunden** laufen **nicht** über Stripe, sondern über Anfrage-Formular auf `/privatstunden` (E-Mail an info@) — das ist Ist-Zustand und bleibt, weil Privatstunden individuell terminiert werden.
- **Schnupperstunde** = eigener Buchungspfad? **OQ-Kandidat** — aktuell führt der CTA auf `/kontakt` (Ist). Prüfen, ob Schnupperstunde direkt buchbar sein soll (wäre ein neuer `booking_type`).

---

## Offene Fragen (IA-spezifisch, neue IDs)

| ID | Frage | Auswirkung | Prio |
|---|---|---|---|
| **IA-01** | `/mehr/collabs` — behalten (A2-Community) oder Footer-only (A1)? Hängt an strategischer Bedeutung von Partnern. | A1 vs A2 | Mittel |
| **IA-02** | Schnupperstunde — eigenes Buchungsformular oder Kontakt-Formular? | CTA-Ziel, Booking-Schema | Hoch |
| **IA-03** | Hochzeitstanz (S-05 aus SEO-Plan) — Abschnitt auf `/privatstunden` oder eigene Route `/hochzeitstanz`? | IA-Tiefe, Keyword | Hoch |
| **IA-04** | EN-Version — URL-Strategie `/en/...` Prefix oder `en.salsaflow-dc.com`? Muss jetzt festgelegt werden, damit Redirect-Map und hreflang stimmen. | Redirects, i18n | Hoch |
| **IA-05** | `/events/socials-partys` (A2) vs. Merge in `/events`-Hub (A1) — eigene Route nur wenn genug Content (regelmässige Termine, Fotos) vorhanden. | Content-Aufwand | Mittel |

---

## Nächste Schritte

1. **Raphael entscheidet A1 vs A2** (Empfehlung: A1).
2. **IA-02/03/04 klären** — blockieren Redirect-Map und Booking-Planung.
3. **Redirect-Tabelle** aus gewählter Alternative ableiten (Input für 06-redirect-map).
4. **Nav-Komponente-Spec** (Desktop-Dropdown-Verhalten, Mobile-Overlay) an Design-Worker weitergeben, locked an DESIGN.md v2.
