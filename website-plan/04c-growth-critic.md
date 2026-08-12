# Growth-Critic — SEO vs. Conversion & CTA-Modell

**Rolle:** Growth-Critic  
**Stand:** 2026-08-12  
**Live:** [https://www.salsaflow-dc.com/](https://www.salsaflow-dc.com/) (Jimdo)  
**Repo/Vercel-Zielbild:** [https://salsaflow-dc.vercel.app/](https://salsaflow-dc.vercel.app/) (DNS noch nicht umgestellt)  
**Belege:** Screenshots in [`screenshots/`](/root/clients/salsaflow-dc/website-plan/screenshots/), [03-seo-audit.md](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md), [04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md), [01-firma-dossier.md](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md), [01b-online-praesenz.md](/root/clients/salsaflow-dc/website-plan/01b-online-praesenz.md), OQ-07 in [11-open-questions.md](/root/clients/salsaflow-dc/website-plan/11-open-questions.md)  
**Frozen Rules:** [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md) · [DECISIONS.md](/root/clients/salsaflow-dc/DECISIONS.md) · [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md)  
**Modus:** PLANNING ONLY — kein Production-Code.

---

## 0. Urteil in drei Sätzen

1. **SEO killt die Conversion nicht von allein** — aber **falsches SEO** (Keyword-Essays, eine CTA für alles, ungeprüfte Gratis-Claims, leere Above-the-fold-Fläche) schon.
2. Die Vercel-Site hat **bessere Navigation und klarere Marke** als Jimdo, verliert den Verkauf aber **im ersten Viewport**: Hero ohne Bild, Headline blass, Cookie-Leiste konkurriert mit dem einzigen roten Knopf.
3. Das CTA-Modell muss **route-spezifisch** werden (Schnupper vs. Kurs buchen vs. Privat anfragen vs. Event/Show) — sitewide „Gratis Schnupperstunde“ auf jeder Seite ist Conversion-Lärm und Claim-Risiko (S-02 / OQ-07).

---

## 1. Was hier „Conversion“ heisst

Für eine lokale Tanzschule am Bahnhof Basel SBB ist Conversion **kein** SaaS-Signup. Es sind messbare nächste Schritte (Prio absteigend, `SCHÄTZUNG` aus Angebot + Live-Ist):

| # | Conversion | Typische Absicht | Heutiger Live-Weg | Repo-Zielbild |
|---|---|---|---|---|
| C1 | **Schnupper / Probestunde** | Angst nehmen, Level checken | Formular / WhatsApp / FAQ „Probestunde jederzeit“ | Header-CTA + ClosingCta; Claim „gratis“ **ungeprüft** |
| C2 | **Kursbuchung** (8×60) | Kaufbereit, Termin klar | Anmeldeformular Kurse | `/kursplan` → `/buchung` (noindex) + Stripe/TWINT |
| C3 | **Privatstunden-Anfrage** | Hochwert, Hochzeit/Technik | Formular „Privatstunden Anfrage“ | Seite `/privatstunden`, CTA schwach („Ziel beschreiben“) |
| C4 | **Event / Danceflow Night / Workshop** | Abend, Community | Events-Seiten, Formulare | Events-Routen + ggf. Ticket/Info |
| C5 | **Soft-Leads** | WhatsApp, Telefon, Mail, Maps | Footer/Float | WhatsAppFloat + Kontakt; Maps-Link noch generisch |

**Regel Growth:** Jede öffentliche Seite hat **genau eine** Primary-Conversion aus C1–C5. Alles andere ist Secondary (Textlink / Outline). Mehrere gleichstarke rote Buttons = keine Conversion, nur Dekoration.

---

## 2. Killt SEO die Conversion?

### 2.1 Nein — wenn SEO die Kaufangst beantwortet

Der SEO-/AEO-Plan ([04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md)) ist **conversion-kompatibel**, solange er diese Disziplin hält:

- **Eine Suchabsicht = eine Seite = eine H1 = eine Primary-CTA** (Plan §1 + §2).
- **Antwort zuerst, dann Erklärung** (AEO §9.2) — das ist exakt der Scan-Pfad kaufbereiter Besucher.
- **Weg Zweifel → Buchung** bewusst gelegt: `/kursaufbau` → Stil-Seite → `/preise` → `/kursplan` → Buchung (Plan §5).
- **Keine Fake-Proofs** (keine Sterne, kein „Nr. 1“) — schützt Marke und Conversion-Vertrauen.

Das ist gutes SEO **und** gutes CRO: Menschen und Maschinen brauchen dieselben klaren Fakten (Preis, Ort, Solo-ok, Level, Dauer).

### 2.2 Ja — wenn SEO so gebaut wird, wie der Plan **nicht** will

Konkrete SEO-Fallen, die Conversion töten (`BEWERTUNG`, abgeleitet aus Audit + Screenshots + Plan-Risiken):

| Falle | Warum Conversion stirbt | Gegenregel |
|---|---|---|
| **Keyword-Wand ohne CTA** | Live-Home: langer Willkommenstext, schwache Aktion, Cookie-Modal vor dem Angebot ([`live-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/live-home.png)) | Above-the-fold: Angebot + Ort + 1 Primary + 1 Secondary, Text erst darunter |
| **Eine CTA sitewide** | Nav-Pill „Gratis Schnupperstunde“ auch auf `/privatstunden`, wo der Job „Privat anfragen“ ist ([`vercel-privatstunden.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-privatstunden.png)) | Nav-CTA **kontextsensitiv** oder neutral („Jetzt starten“ → Intent-Router); Primary im Body route-spezifisch |
| **Unbelegter Gratis-Claim** | „Erste Schnupperstunde gratis“ in Nav/Closer ohne Freigabe (Plan S-02, Audit P0-3) | Bis Freigabe: „Probestunde anfragen“ / „Schnupperstunde buchen“ **ohne** „gratis“ |
| **SEO-Seiten ohne Handlung** | Dünne Live-Geldseiten (Privat 229 Wörter, Kurse 215) **oder** umgekehrt Endlos-FAQ ohne Button | Jede Geld-Seite: Fakten-Tabelle + FAQ-Block + sticky/primary CTA |
| **Internal-Link-Spam** | Plan will mehr Fliesstext-Links (gut) — Risiko: Link-Salat unterbricht den Scan | Max. 1–2 Links pro Absatz; Linktext = nächster Job („Preise ansehen“, „Level finden“) |
| **Buchungs-URLs indexieren** | `/buchung*` muss `noindex` bleiben (Plan 3.3, bereits im Repo) | Checkout nie SEO-Ziel; Traffic landet auf indexierbaren Entscheidungsseiten |
| **Ladezeit / leerer Hero** | Vercel-Home: riesiger Weissraum, Hero-Bild fehlt im Viewport ([`vercel-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-home.png)); Audit: JS 1,1 MB, LCP-Risiko | LCP-Bild vorladen; Conversion misst nicht Rankings, wenn der erste Screen tot wirkt |
| **Widersprüchliche Preise/Claims** | FAQ vs. Preise Paarlogik; Studio-Zahl; 40 Kurse ungeprüft | Eine Wahrheitstabelle vor Launch — KI und Menschen springen bei Widerspruch ab |
| **Local SEO vernachlässigen** | GBP/Maps schwächer als Website-Text (01b) | Für „Salsa Basel“ gewinnt oft der Maps-Pack die Conversion **vor** der Website |

### 2.3 Balance-Formel (verbindlich für den Plan)

```
SEO-Job auf der Seite  =  die Frage beantworten, die den Klick auslöste
CRO-Job auf der Seite  =  den nächsten kleinen Schritt so leicht machen, dass Zögern teurer wird als Klicken
```

- **Traffic-Seiten** (FAQ, Kursaufbau, Partys-Überblick): mehr erklärender Text, Secondary-CTAs ok.  
- **Geld-Seiten** (`/`, Stil-Seiten, `/preise`, `/kursplan`, `/privatstunden`, Danceflow Night): Text nur so lang, bis der Einwand weg ist — dann **stoppen und handeln**.  
- **AEO-Sätze** (1–2 Sätze unter H2 mit Zahl/Ort) **helfen** Conversion; 800 Wörter Marketing-Floskel **schaden**.

**Verdikt:** Der vorliegende SEO-Plan tötet Conversion **nicht**, wenn P0-2/P0-3 (Wahrheit bei Preisen/Claims) und das CTA-Modell unten gelten. Ohne das wird SEO zur Ausrede für leere oder laute Seiten.

---

## 3. CTA-Modell (Soll)

### 3.1 Hierarchie (Design-kompatibel)

Aus DESIGN.md / DECISIONS: **ein** dominanter gefüllter Salsa-Button (`#ad1827`, `rounded-full`); Secondary als Outline/Text; Nav-CTA nicht als zweiter voller Pill neben Hero (bereits als Outline-Entscheidung dokumentiert — Hero/Body behält den einen vollen Primary).

| Stufe | Visuell | Wann |
|---|---|---|
| **Primary** | Gefüllter Salsa, `rounded-full` | Genau 1 pro Viewport-Fokus / pro Route-Hauptjob |
| **Secondary** | Outline ink/salsa oder Text+Pfeil | Alternative Absicht (Plan ansehen, Preise, WhatsApp) |
| **Tertiary** | Footer, Float, Tel | Immer erreichbar, nie lauter als Primary |
| **System** | Cookie „Akzeptieren“ | Darf **nie** mit Primary um Farbe/Position konkurrieren (unten, klein, nach First-Paint) |

### 3.2 Intent-Matrix (Route → Primary / Secondary)

Annahme bis Kundenentscheid OQ-07 — **Growth-Empfehlung (Recommended):**

| Route / Cluster | Primary (C#) | Label-Vorschlag (ohne unbelegtes „gratis“) | Secondary | Verboten |
|---|---|---|---|---|
| `/` Home | C1 | „Schnupperstunde anfragen“ oder freigegeben „Erste Stunde auf uns“ | „Kursplan ansehen“ | Drei rote Pills; Event-Chaos in Top-Nav wie Live |
| `/tanzkurse`, Stil-Seiten | C1 → C2 | Oben C1; nach Preis/Level-Block C2 „Kurs wählen“ → `/kursplan` | Preise, FAQ-Level | Nur SEO-Text ohne Button |
| `/kursplan` | C2 | „Platz sichern“ / „Jetzt buchen“ (wenn frei) | „Warteliste“ wenn full; WhatsApp | Voller „Jetzt buchen“-Primary auf **ausgebucht** (DECISIONS-Backlog: semantisch falsch) |
| `/preise` | C2 oder C1 | „Zum Kursplan“ (kaufnah) | Schnupper / Privat | Preise ohne nächsten Schritt |
| `/kursaufbau` | C1 | „Level unklar? Probestunde“ | Stil-Seiten | Endlos-Leiter ohne CTA |
| `/privatstunden` | **C3** | „Privatstunde anfragen“ (Preisrahmen nennen wenn belegt: ab CHF 100) | „Technik / Hochzeit wählen“ als Anker, nicht als schwacher Ghost-Button | Nav-Primary „Schnupper“ als **einzige** laute Aktion; Label „Ziel beschreiben“ (zu weich, kein Wert) |
| `/events…`, Danceflow Night | C4 | „Nächste Night / Ticket-Info“ (nur echte Termine) | „Kurse entdecken“ | Erfundene Event-Schema-Termine |
| `/shows-animationen`, Raumvermietung | C5/Anfrage | „Anfrage senden“ mit Pflichtfeldern Datum/Art | Tel/WhatsApp | Gruppenkurs-CTA als Primary |
| `/team`, `/fotos` | Soft → C1 | „Atmosphäre checken → Schnupper“ | Instagram | Kein CTA = reine Galerie-Sackgasse |
| `/faq`, `/kontakt` | C5 + C1 | Kontakt: WhatsApp/Tel primary soft; FAQ-Ende: Schnupper | Maps, Mail | Sie-Form / Tippfehler Live |
| `/buchung*` | Checkout | „Zahlung abschliessen“ | Abbrechen | SEO-Index, ablenkende Nav-Promo |

### 3.3 Nav-CTA-Policy

**Problem belegt:** Auf Vercel sitzt **sitewide** rechts „Gratis Schnupperstunde“ — auch wo der Job ein anderer ist (Privatstunden-Screenshot).

**Soll (eine Regel, drei erlaubte Varianten):**

1. **Default (Kurs-Universum):** Nav-CTA = Schnupper/Probestunde (Label ohne „gratis“, bis S-02 freigegeben).  
2. **Override Privat / Shows / Miete:** Nav-CTA wechselt zu „Anfrage“ **oder** bleibt Outline-neutral „Kontakt“, Body-Primary übernimmt C3.  
3. **Nie:** zwei volle Salsa-Pills gleichzeitig (Nav + Hero) — DECISIONS: Nav outline, Body filled.

### 3.4 Funnel-Schritte (fachlich, kein Code)

```
Awareness (Google/Maps/IG)
  → Entscheidungsseite (indexierbar, 1 Intent)
    → Soft: WhatsApp / Tel / FAQ-Einwand weg
    → Hard:
         Schnupper-Anfrage (Form/Slot)     [C1]
         ODER Kurs → /buchung pending_payment → Stripe Webhook → confirmed  [C2, ARCHITEKTUR]
         ODER Privat/Show-Anfrage → Mail/CRM, kein Self-Checkout Pflicht  [C3]
```

**Messziele** (Plan §10, P1):  
`schnupper_submit` · `booking_start` · `booking_confirmed` · `privat_request` · `wa_click` · `tel_click` · `maps_click`  
Ohne diese Events ist jedes SEO-Ranking **Blindflug** (Audit: heute 0 Analytics).

### 3.5 Copy-Regeln für CTAs (Du, warm, ehrlich)

- Verb + Ergebnis: „Schnupperstunde anfragen“, „Platz im Kurs sichern“, „Privatstunde anfragen“.  
- Kein „Hier klicken“, kein „Mehr erfahren“ als Primary.  
- Preisversprechen nur mit Beleg (CHF 190 / 8×60, Privat 100/130 … aus Dossier).  
- „Gratis“ / „geht auf uns“ nur nach expliziter Kundenfreigabe (S-02).  
- Ausgebucht: Primary wird Warteliste/gedämpft — nicht „Jetzt buchen“ in Salsa-Rot (semantische Regel aus DECISIONS-Log).

---

## 4. Live Jimdo — Growth-Kritik (belegt)

Quellen: [`live-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/live-home.png), [`live-privatstunden.png`](/root/clients/salsaflow-dc/website-plan/screenshots/live-privatstunden.png), Audit L-*, Dossier 5.4.

| ID | Befund | Conversion-Wirkung | Prio |
|---|---|---|---|
| G-L1 | **Cookie-Modal** deckt Inhalt; mehrere Entscheidungen vor dem ersten Angebot | Erster Impuls = Friction, nicht Tanzen | P0 UX |
| G-L2 | **Nav-Chaos:** FLOWeekend / Anniversary auf Top-Level neben Angebot | Event-Traffic und Kurs-Traffic vermischt; Einsteiger findet Probestunde nicht | P0 IA |
| G-L3 | Home = **Textwand**, schwache Primary, Hero praktisch grau/leer | Kein klarer C1 in 3 Sekunden | P0 CRO |
| G-L4 | Buchung nur **Formulare**, kein Self-Service-Checkout | Mehr Abbruch zwischen Interesse und Zahlung | P1 (Repo löst C2) |
| G-L5 | Privatstunden: Preise klar (gut), Hero weich/alt, CTA „Anfrage“ vorhanden | C3 funktioniert inhaltlich besser als Vercel-Label — Design/Trust schwach | P1 Asset |
| G-L6 | FAQ stark (635 Wörter) **ohne** Schema und ohne harte CTA-Schleife | SEO-Substanz verschenkt; Einwand weg, Handlung unklar | P1 |
| G-L7 | Kein LocalBusiness-JSON-LD, schwache Maps-Anbindung | Maps-Pack/KI verlieren Trust-Signale → weniger qualifizierter Traffic | P0 Local |
| G-L8 | Meta-Pixel ohne Facebook-Kanal | Datenschutz-/Trust-Risiko, kein nachweisbarer Ad-Return | P0 Cleanup |
| G-L9 | Sie/Du-Bruch + Tippfehler auf Kontakt | Unprofessionalität genau am Lead-Form | P1 Copy |

**Live-Stärke nicht kaputtreden:** Probestunde in FAQ belegt; Preise transparent; Fotos `/fotos-1/` = Asset-Wahrheit; echte Community-Events.

---

## 5. Vercel / Repo-Stand — Growth-Kritik (belegt)

Quellen: [`vercel-home.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-home.png), [`vercel-privatstunden.png`](/root/clients/salsaflow-dc/website-plan/screenshots/vercel-privatstunden.png), Parent-Notes, SEO-Audit R-*.

| ID | Befund | Conversion-Wirkung | Prio |
|---|---|---|---|
| G-V1 | **Above-the-fold Katastrophe:** weisser Leerraum, Headline hellgrau, kein Hero-Bild im Shot | Sofortiger Trust-/Energie-Verlust; C1 unsichtbar ausser Nav-Pill | **P0 CRO** |
| G-V2 | Nav-CTA „**Gratis** Schnupperstunde“ sitewide | Claim-Risiko + falscher Job auf Nicht-Kurs-Seiten | P0 Claim/CTA |
| G-V3 | Privatstunden: Primary im Body **„Ziel beschreiben →“** (blass, low contrast); Nav schreit Schnupper | C3 unterliegt C1-Lärm; Kaufimpulse (Hochzeit CHF 100+) verpuffen | P0 CTA |
| G-V4 | Privat-Hero **Motiv/Semantik ungeeignet, Auflösung ok** (offer-privat ~33 KB) | Premium-Preis, Discount-Optik | P0 Asset |
| G-V5 | Cookie-Bar unten mit rotem „Akzeptieren“ | Zweiter Salsa-Button konkurriert mit Conversion-Farbsprache | P1 UX |
| G-V6 | Tech-SEO stark (1 H1, JSON-LD, prerender) — **Messung 0** | Rankings unbewiesen; kein Funnel-Optimieren möglich | P0 Measure |
| G-V7 | Interne Links fast nur Nav/Footer | SEO- und CRO-Pfad „Zweifel→Buchung“ ungenutzt | P1 |
| G-V8 | EN nur Client-State, keine URL | Internationaler Traffic (Basel/Expat) zahlt nicht auf indexierbare EN-Geldseiten | P1 SEO (nach CRO-Fix) |
| G-V9 | Booking/Stripe im Architektur-Soll | Grosser Conversion-Hebel vs. Jimdo-Form — **nur** wenn Kapazität/Status/Warteliste UI ehrlich (full ≠ „buchen“) | P1 Flow |

**Vercel-Stärke:** Klare IA-Nav (Tanzkurse, Kursplan, Events…); ClosingCta-Konzept („erste Stunde…“) in DECISIONS als Conversion-Block gedacht; Du-Ton; WhatsApp als Soft-Lead.

---

## 6. SEO-Plan-Stress-Test (gegen Conversion)

| Plan-Element | CRO-Verdict | Auflage |
|---|---|---|
| Keyword-Mapping 1:1 Adresse | **Hilft** | Halten; keine Doorway-Städte |
| P0 Redirects Jimdo→neu | **Hilft** (erhält bezahlten/organischen Traffic) | Nie auf Home abladen |
| AEO Antwort-zuerst | **Hilft** | Direkt unter H2 + CTA im selben Screen-Abschnitt |
| Mehr Fliesstext-Links | **Hilft bedingt** | Budget: Geld-Seiten min. 5 **sinnvolle** Links, nicht 20 |
| EN `/en/…` voll | **Neutral bis riskant** | Halbe Sprache = Sackgassen-Friction; OQ S-01: ganz oder schlank |
| FAQ ausbauen | **Hilft** | Jede Antwort endet mit Link/CTA zum passenden Job |
| Schema Offer/Preise | **Hilft** nur bei einer Wahrheit | Widerspruch FAQ/Preise vorher töten |
| Längere Content-Seiten | **Schadet**, wenn Above-the-fold leidet | Erst Hero+CTA fix, dann Wortzahl |
| „Gratis“ in Titles/Nav | **Schadet** bis Beleg | P0-3 |

---

## 7. Priorisierte Growth-Massnahmen (Plan, kein Code)

### P0 — vor/mit DNS-Cutover (Conversion-kritisch)

1. **Hero Home reparieren:** echtes warmes Paar-/Studio-Bild (Quelle `/fotos-1/`), Kontrast Headline ink, ein Primary, ein Secondary — Screenshot-Abnahme Desktop+Mobile.  
2. **CTA-Matrix implementieren (fachlich freigeben):** OQ-07 entscheiden; Default Schnupper ohne „gratis“ bis S-02.  
3. **Privatstunden:** Primary „Privatstunde anfragen“; Nav-Override; Hero-Asset ersetzen (scharf, warm).  
4. **Claims/Preise eine Wahrheit** (P0-2/P0-3 SEO-Plan).  
5. **Redirect-Map** vollständig — sonst stirbt organischer Einstieg in den Funnel.  
6. **Search Console + datenschutzfreundliche Events** (mindestens submit/start/wa).  
7. **GBP Inhaberschaft + echter Place-Link** (oft mehr Local-Conversion als eine neue Unterseite).

### P1 — erste Wochen

8. Cookie-UI entkoppeln von Salsa-Primary-Semantik.  
9. Kursplan: ausgebucht → Warteliste-CTA.  
10. Fliesstext-Pfad Zweifel→Buchung auf Stil-Seiten + Privat.  
11. FAQ-Schleifen mit Primary am Blockende.  
12. WhatsApp-Klick und Tel als Secondary sitewide belassen (Float), aber nicht lauter als Body-Primary.

### P2

13. EN-Strategie nach S-01.  
14. Event-CTAs nur mit echten Terminen.  
15. Review-QR im Studio (ethisch, keine Anreize) — `PLACEHOLDER` bis echte Quelle.

---

## 8. Anti-Patterns (explizit verboten im Relaunch)

- Sitewide derselbe Primary-Text auf jeder Route.  
- „Gratis“ / Sterne / „beste Schule“ / Fake-Testimonials.  
- SEO-Blog ohne Bezug zu C1–C5.  
- Indexierte Checkout-URLs.  
- Zwei volle rote CTAs + roter Cookie-Button im selben Viewport.  
- Primary-Button auf ausgebuchtem Kurs mit Zahlungsversprechen.  
- Lange AEO-Fragen mit Ausweichantwort (Plan §9.3).  
- Meta-Pixel ohne Kanal und ohne Consent.

---

## 9. Abnahme-Kriterien Growth (Definition of Done für diesen Strang)

- [ ] Jede Geld-Seite hat dokumentiert: Intent, Primary-Label, Secondary, Ziel-URL/Form, Event-Name.  
- [ ] Home-Viewport-Screenshot: Bild + lesbare H1 + Primary sichtbar **ohne** Scroll (Desktop 1440, Mobile 390).  
- [ ] `/privatstunden`: Primary = Anfrage Privat, nicht Schnupper; Motiv/Semantik geeignet (Auflösung ok).  
- [ ] Kein „gratis“ in UI/Meta ohne schriftliche Freigabe S-02.  
- [ ] Mindestens die Events aus §3.4 feuern in Staging (manuell protokolliert).  
- [ ] SEO-Plan P0-1…P0-3 erfüllt oder als Blocker in `11-open-questions.md` geführt.  
- [ ] Keine erfundenen Reviews/Ratings in UI oder Schema.

---

## 10. Offene Entscheidungen (Growth-relevant)

| ID | Frage | Blockiert |
|---|---|---|
| OQ-07 | Sitewide Schnupper vs. route-Primary | CTA-Matrix §3 |
| S-02 | Schnupper wirklich gratis? | Nav-Label, ClosingCta, Ads |
| S-03 | Studio-Zahl, „40 Kurse“ | Trust + Schema |
| GBP | Inhaber-Login / Place-ID | Local Conversion |
| Analytics S-08 | Plausible/Umami vs. GA | Event-Tracking ohne Banner-Friction |

---

## 11. Kurzfazit für die nächste Rolle

- **IA/Layout:** Above-the-fold und CTA-Matrix vor Content-Länge.  
- **Copy:** Du, Antwort-zuerst, CTAs verb+Ergebnis, keine Claims ohne Beleg.  
- **Backend-Plan:** C2 folgt ARCHITEKTUR (`pending_payment` → Webhook → `confirmed`); C1/C3 bleiben Anfrage-lastig bis Produkt sagt „Self-Serve Privat“.  
- **SEO-Draft:** Plan behalten, aber jeden P1-Content-Schritt gegen §2.3 prüfen — SEO dient dem Funnel, nicht umgekehrt.

**Growth-Critic-Status:** Kritik und CTA-Modell dokumentiert; **kein** Production-Code; Output untrusted bis Sol/Cross-Check.
