# 04d — SEO-Konkurrenz-Analyse

**Status:** FINAL · 2026-08-12
**Rolle:** SEO-Konkurrenz-Befund
**Modus:** Planning only — kein Production-Code
**Firma:** Salsaflow Dance Company, Basel
**Vergleichsbasis:** [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md) Zeilen 46–91 (Keyword-Map)

---

## 0. Quellenlage

| Konkurrent | Belegt | Nicht belegt |
|---|---|---|
| **KC Dance Studio** (`kcdancestudio.com`) | Startseite + 4 Unterseiten (`/classes/`, `/beginner-courses-basel/`, `/services/salsa-classes-basel/`, `/services/bachata-classes-basel/`) | `aggregateRating` im Schema nicht gesehen, aber nicht ausgeschlossen |
| **Special Elements** (`specialelements.ch`) | Startseite + Navigationsstruktur | Alle Unterseiten: Verbindung 3× verweigert (`ECONNREFUSED 94.126.20.68:443`, 2026-08-12). Preise, FAQ-Inhalt, Stil-Seiten-Tiefe **ungeprüft** |
| **Tanzschule Fromm** (`fromm.ch`) | Homepage, `/Angebot`, `/Privatstunden`, `/UeberUns` | Title/Meta nicht verlässlich extrahierbar (Wix) — als **nicht belegt** markiert |

Alle Aussagen unten stammen aus diesen Abrufen. Wo eine Quelle fehlt, steht das ausdrücklich dabei.

---

## 1. Was die Konkurrenten besetzen (belegt)

### 1.1 KC Dance Studio — der einzige ernsthafte SEO-Gegner

- **Title-Muster** konsequent `Keyword + Basel – Nutzen · KC Dance Studio`:
  „Salsa Classes Basel – Learn with Kiko & Christina", „Bachata Classes Basel", „Wedding Dance Basel – First Dance", „Beginner Dance Courses Basel – Salsa & Bachata", „Dance Classes Basel – Course Schedule".
- **Meta-Descriptions** aktiv geschrieben, mit Kaufaufforderung („Book now", „secure your spot now").
- **Dedizierte Keyword-URLs:** `/services/salsa-classes-basel/`, `/services/bachata-classes-basel/`, `/services/wedding-dance-basel/`, `/beginner-courses-basel/`.
- **Preise sichtbar** auf den Stil-Seiten: CHF 329/359 Kurse, CHF 35 Open Class, CHF 129/h Privat.
- **Tiefe:** ~2'000+ Wörter pro Stil-Seite, inklusive Level-System, Testimonials, Blog-Verlinkung.
- **Schema:** Organization, Person, FAQPage, BreadcrumbList, WebPage — auf allen geprüften Seiten. FAQPage liegt auf **jeder** Service-Seite, nicht nur auf einer zentralen FAQ.
- **H2-Struktur** gemischt emotional und sachlich: „Connection", „Your Learning Journey", „Courses & Pricing", „FAQ".
- **Sprache:** komplett Englisch — Zielgruppe sind Expats und die internationale Gemeinde in Basel.

### 1.2 Special Elements

- **Title:** „Hip Hop, Breakdance, Contemporary, Jazz Dance, Tanzschule | Basel | SE Special Elements GmbH" — besetzt „Tanzschule Basel" plus die Hip-Hop-Stile, **nicht** Salsa/Bachata.
- **H1 mit drei Standorten:** „Deine Tanzschule in Basel, Riehen & Arlesheim" — Multi-Standort-Keyword-Strategie.
- **H2 pro Standort** („Tanzschule Basel/Riehen/Arlesheim") — vermutlich standortspezifische Abschnitte oder Seiten.
- FAQ existiert (`/Fragen-Antworten.htm`). Preise auf separaten Stundenplan-Seiten pro Standort, nicht auf der Startseite.
- Kein Schema im Homepage-Extrakt erkennbar.

### 1.3 Tanzschule Fromm — SEO-schwach

- Kein H1/H2 auf der Homepage im Extrakt. Keine Meta-Description extrahierbar. Kein Schema.
- `/Angebot`: praktisch kein Content, verweist extern auf Pro Senectute (Seniorenkurse).
- Stile: Standard/Latein, Discofox, West Coast Swing, Line Dance — **nicht** Salsa/Bachata.
- Preise nur für Privatstunden sichtbar: CHF 115–130 pro Lektion, Paarkurse CHF 450–475.
- Team-Seite mit sieben Lehrpersonen und IDTA-Credentials — ein E-E-A-T-Signal, das wir in dieser Form nicht haben.

---

## 2. Keyword-Lücken

Konkurrenz besetzt, unser Plan nicht oder schwach.

1. **„Wedding Dance Basel" als eigene URL.** KC hat `/services/wedding-dance-basel/` mit eigenem Title, FAQ und Testimonials. Unser Plan lässt „hochzeitstanz basel" nur als Abschnitt auf `/privatstunden` ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):55, Entscheidung S-05 offen). KC besetzt den englischen Markt bereits. Die deutsche Variante „Hochzeitstanz Basel" ist bei Fromm und SE nicht belegt besetzt — Lücke auf beiden Seiten, aber KC hat die Seiten-Architektur dafür schon.
2. **„Beginner Courses Basel" / „Anfängerkurs" als eigenes Ziel.** KC hat `/beginner-courses-basel/` mit eigenem Title und eigener H1. Unser Plan deckt Anfänger nur als Nebenbegriff auf `/tanzkurse/salsa` ab ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):52). Die kombinierte Seite „Salsa & Bachata Anfängerkurs Basel" fehlt als URL.
3. **Englische Keywords komplett.** KC läuft vollständig auf Englisch und besetzt „salsa classes basel", „bachata classes basel", „wedding dance basel", „beginner dance courses basel". Unser `/en/`-Ausbau ist offene Entscheidung S-01 ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):135–137). Solange S-01 offen ist, geht der gesamte EN-Markt Basel an KC.
4. **„Dance Classes Basel" (Kursplan-Intent, EN).** KC-Title auf `/classes/`. Unser `/kursplan` zielt nur auf DE.
5. **Standort-Seiten nach dem Riehen/Arlesheim-Modell.** SE besetzt drei Standort-Keywords. Für uns nicht kopierbar (kein Standort dort, Verbot Nr. 13) — nur als Kontext relevant: SE rankt für „Tanzschule Basel" über Stil-Breite. Keine Lücke bei uns.
6. **Reggaeton Basel.** KC besetzt es (`/services/reggaeton-classes-basel/`). Unser Plan listet Reggaeton nicht. Nur aufnehmen, falls Salsaflow es tatsächlich anbietet — sonst bewusst offen lassen (Verbot: keine Seiten für Kurse, die es nicht gibt, [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):87–88).

---

## 3. Content-Lücken

Tiefe, wo KC oder Fromm mehr liefern.

1. **Stil-Seiten-Tiefe.** KC liefert ~2'000+ Wörter pro Stil-Seite mit Level-System, Testimonials und Blog-Links. Unser `dist/`-Stand hat 264–1'302 Wörter pro Seite ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):329) — die Untergrenze liegt unter KC-Niveau. `/tanzkurse/salsa` und `/tanzkurse/bachata` brauchen Ausbau Richtung 1'500+ Wörter mit echter Substanz, kein Fülltext.
2. **Testimonials und Sozialbeweis.** KC hat vier bis fünf Testimonials pro Seite. Unser Plan **verbietet** erfundene Zitate ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):453). Diese Lücke lässt sich nur mit echten, belegten Stimmen schliessen — Sammelprozess nötig, bis dahin bleibt `PLACEHOLDER`. Kein SEO-Nachteil, der per Text lösbar wäre.
3. **Blog/Ratgeber.** KC verlinkt „Relevant Blog Articles" pro Stil-Seite (interne Verlinkung plus Long-Tail). Unser Plan hat nur `/mehr/tanzschuhe` als Ratgeber (P2). Kein Blog geplant — mittelfristige Lücke für Long-Tail-Fragen.
4. **Lehrer-Credentials.** Fromm zeigt IDTA-Ausbildungen pro Person. Unser Plan sieht `/team` nur mit „Rolle, Stil, seit wann" vor ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):274) — Ausbildungsnachweise ergänzen, falls vorhanden und belegbar.
5. **Preis-Transparenz als Ranking-Signal.** KC zeigt Preise direkt auf den Stil-Seiten. Unser Plan hat `/preise` als eigene Seite — gut, aber die Stil-Seiten sollten den Einstiegspreis inline nennen („ab CHF 190") mit Link auf `/preise`.
6. **FAQ pro Stil-Seite.** KC hat FAQPage-Schema auf **jeder** Service-Seite. Unser Plan konzentriert 21 Fragen auf `/faq`; Stil-Fragen (On1/On2, Bachata Sensual) sind geplant ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):354–355) — korrekt, muss aber mit FAQPage-Markup auf der jeweiligen Stil-URL umgesetzt werden, nicht nur auf `/faq`.

---

## 4. Die 10 Massnahmen

Abhakbare Liste. Reihenfolge = Priorität.

- [ ] **1. S-01 sofort entscheiden lassen: `/en/` vollständig ausbauen.**
  KC besetzt den gesamten EN-Markt Basel unbestritten. URLs: `/en/salsa-classes-basel` (bzw. `/en/dance-classes/salsa`), `/en/private-lessons` mit Wedding-Abschnitt, `/en/beginner-courses`. Das ist die grösste einzelne Lücke — ohne sie verlieren wir Expats an KC. Referenz: [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):114–137.

- [ ] **2. Eigene Seite `/hochzeitstanz` (DE) statt nur Abschnitt.**
  KC hat die EN-Seite, DE ist bei Fromm und SE unbesetzt. Eigene URL mit Title „Hochzeitstanz Basel – Erster Tanz | Salsaflow", eigenem FAQPage-Block (4–6 Fragen: Ablauf, Dauer, Songwahl, Preis ab CHF X), Verlinkung von `/privatstunden` und `/preise`. Entscheidung S-05 auf „ja, eigene Seite" eskalieren.

- [ ] **3. `/tanzkurse/salsa` auf ~1'500 Wörter ausbauen, mit FAQPage-Markup.**
  Fragen direkt auf der Seite mit Schema: „Was ist Salsa On2?", „On1 vs. On2?", „Brauche ich einen Partner?", „Welches Level passt mir?". Inline-Preis „ab CHF 190" plus Link `/preise`. Ziel: Tiefe mindestens auf KC-Niveau, aber auf Deutsch und mit On2-Differenzierung (KC macht Cuban/on-the-line, wir On2 — echte inhaltliche Differenzierung, kein Claim).

- [ ] **4. `/tanzkurse/bachata` analog ausbauen.**
  Fokus „Bachata Sensual" als Differenzierung (KC nennt Sensual nicht prominent). FAQ: „Was ist Bachata Sensual?", „Unterschied zur dominikanischen Bachata?". Ebenfalls FAQPage-Schema auf der URL.

- [ ] **5. Title und Meta aller Geld-Seiten gegen das KC-Muster schärfen.**
  KC-Muster „Keyword Basel – Nutzen · Marke" ist gut. Unser Muster „Hauptbegriff mit Ort | Salsaflow" ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):178) einhalten und jede Meta-Description mit konkreter Zahl plus CTA schreiben, zum Beispiel: „Salsa On2 Kurse in Basel, direkt am Bahnhof SBB. Probestunde ohne Partner. Kurse ab CHF 190."

- [ ] **6. `/kursaufbau` zur Level-Erklärseite ausbauen (P1-8 vorsehen).**
  KC hat Discover/Develop/Refine als H2-Struktur pro Seite. Unsere Antwort: eine zentrale Level-Seite mit klarer Tabelle (Level → Voraussetzung → Dauer → nächster Schritt) plus Antwort auf „Wie lange dauert es, bis ich auf einer Party mittanzen kann?" ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):356). Von jeder Stil-Seite verlinken.

- [ ] **7. Beginner-Intent auf `/tanzkurse` bündeln.**
  Statt eigener Anfänger-URL (Kannibalisierungsrisiko, Verbot Nr. 9) bekommt `/tanzkurse` einen prominenten H2-Abschnitt „Anfängerkurse in Basel — ohne Erfahrung, ohne Partner" mit Direktantwort und Links auf Salsa/Bachata. Deckt den KC-`/beginner-courses/`-Intent DE-seitig ab, ohne zweite Seite für denselben Begriff.

- [ ] **8. Person-Schema plus Credentials auf `/team`.**
  Fromm zeigt IDTA-Nachweise. Auf `/team` pro Person: Stil, Rolle, Ausbildung/Jahre — nur Belegtes — plus Person-Schema ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):306). P2 auf P1 hochziehen, weil Fromm das Signal bereits setzt.

- [ ] **9. Offer-Schema mit CHF-Preisen auf `/preise`, Preis inline auf allen Geld-Seiten.**
  KC zeigt Preise überall, Fromm nur bei Privatstunden, SE versteckt sie auf Stundenplan-Seiten. Volle Transparenz plus maschinenlesbare Auszeichnung ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):307) ist der schnellste Weg, Preisvergleichs-Suchen („was kostet tanzkurs basel") zu gewinnen. Voraussetzung: P0-2 Preiswidersprüche auflösen.

- [ ] **10. Lokale Signale konsequent ausbauen (P0-5 + DanceSchool-Schema + `sameAs`).**
  Keiner der drei Konkurrenten hat LocalBusiness- oder DanceSchool-Schema (KC nur Organization, SE und Fromm keins erkennbar). Unser Plan sieht DanceSchool plus `geo`, `openingHours` und echten Maps-Link vor ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):303–310). Das ist der strukturelle Vorsprung, der zusammen mit P0-5 (Google-Profil) die Local-Pack-Plätze für „tanzschule basel" und „salsa basel" entscheidet. Zusätzlich: Die H1 der Startseite muss „Tanzschule Basel" enthalten — SE macht das, KC nicht (KC positioniert sich als „Boutique Dance Studio").

---

## 5. Unsicherheiten

- **Special-Elements-Unterseiten** (Preise, FAQ-Inhalt, Stil-Seiten-Tiefe) sind ungeprüft (`ECONNREFUSED` ×3, 2026-08-12). Deren Content-Tiefe kann höher sein als hier angenommen.
- **Fromm Title/Meta** nicht extrahierbar (Wix). Aussagen zur Meta-Ebene von Fromm sind deshalb nicht belegt.
- **KC-Testimonials** könnten `aggregateRating`-fähig sein. Im Schema nicht gesehen, aber nicht ausgeschlossen.
- Für eine belastbare Preis-Analyse von Special Elements müsste der Abruf von einer anderen IP oder durch Raphael im Browser erfolgen.

**Ende der Konkurrenz-Analyse.**
