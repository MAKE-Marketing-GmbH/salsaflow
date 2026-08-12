# Online-Präsenz — Social, Google Business Profile, Maps, Local Citations

**Rolle:** Reach/Social/GBP/Maps-Audit, Lauf 1
**Stand:** 2026-08-12
**Beweisregel:** Jede Feststellung hat eine Quelle (URL + geprüfter HTTP-Status oder Repo-Pfad + Zeile). Keine erfundenen Bewertungen, Follower-Zahlen oder Kundenstimmen. Wo ein Wert nicht belegt ist, steht `NICHT BELEGT` oder `PLACEHOLDER`.

---

## 1. Befund in einer Tabelle

| Kanal | Status | Handle / URL | Beleg |
|---|---|---|---|
| Instagram | **vorhanden, verlinkt** (einziger verlinkter Social-Kanal) | `instagram.com/salsaflowdc/` | HTTP 200; Repo `src/public/site/SiteFooter.tsx:22`; Schema `src/lib/seo-schema.ts:155` |
| WhatsApp Business | **vorhanden, verlinkt** | `wa.me/41764788411` | Repo `SiteFooter.tsx:21`; sitewide Float `WhatsAppFloat` |
| Google Business Profile / Maps | **Eintrag existiert, aber nicht sauber verlinkt** | siehe §4 | Maps-Suche liefert Treffer „Salsaflow Dance Company Basel"; Repo verlinkt nur eine generische Such-URL (`SiteFooter.tsx:23`) |
| Facebook | **nicht vorhanden** | — | Live-Site hat nur einen generischen Facebook-Share-Button (Jimdo-Baukasten), keine Profil-URL; Repo: explizit kein Facebook (`SiteFooter.tsx` Kopfzeile 5); alle geprüften Kandidaten-URLs (facebook.com/salsaflowdc, …/salsaflowbasel) antworten 400/Fehler |
| TikTok | **nicht belegt / kein Kanal in Verwendung** | — | `tiktok.com/@salsaflowdc` antwortet 200, aber das ist TikToks Standard-Verhalten auch für nicht vergebene Handles (generische Seite, `followerCount:3` = Platzhalter-Account ohne Inhaltssignale). Weder Live-Site noch Repo verlinken TikTok → als **nicht vorhanden** behandeln |
| YouTube | **nicht vorhanden** (als Schul-Kanal) | — | `youtube.com/@salsaflow` antwortet 200 mit Titel „salsa flow", aber kein Beleg, dass der Kanal zur Tanzschule gehört; Live-Site verlinkt kein YouTube (nur Cookie-Hinweis zu eingebetteten YouTube-Videos); Repo verlinkt kein YouTube. `youtube.com/@salsaflowdc` = HTTP 404 |
| LinkedIn | **nicht vorhanden** | — | Kein Link auf Live-Site oder im Repo; Unternehmensseite nicht belegbar |
| 2332 Dancewear | **vorhanden (Partnerlink, kein Social)** | `2332dancewear.com/collections/salsaflow` | Live-Homepage, Call-to-Action-Link |

**Kurzfazit:** Die gesamte externe Präsenz der Schule hängt an **einem** Kanal (Instagram) plus WhatsApp. Kein Facebook, kein YouTube, kein TikTok, kein LinkedIn, kein sauber verlinktes Google-Profil. Für eine lokale Tanzschule, die von Impulsentscheidungen („Salsakurs Basel" googeln, Location in Maps prüfen) lebt, ist das die grösste Reach-Lücke des Relaunchs — noch vor jedem Content-Thema.

---

## 2. Instagram — der einzige echte Kanal

- **Handle:** `@salsaflowdc`, URL `https://www.instagram.com/salsaflowdc/` (HTTP 200 belegt, 2026-08-12).
- **Einbindung Live-Site (Jimdo):** kein einziger sichtbarer Instagram-Link auf der Live-Homepage. Quelle: Volltext-Scan von `https://www.salsaflow-dc.com/` — einzige Social-Artefakte sind ein generischer Facebook-**Share**-Button und das Jimdo-Facebook-Pixel (`connect.facebook.net/en_US/fbevents.js`, ein Tracking-Skript, kein Kanal).
- **Einbindung Repo (Vercel-Stand):** sauber gelöst — Footer-Spalte „Folg uns" mit Icon+Label (`SiteFooter.tsx:72–76`), `sameAs` im LocalBusiness-JSON-LD (`seo-schema.ts:155`), Instagram-Reel-Einbettungen als Content-Format (`instagram.com/reel/…` in der Fotos-/Home-Content-Schicht). Das ist die richtige Basis.
- **Offen (nicht belegbar ohne Login):** Follower-Zahl, Posting-Frequenz, letzte Aktivität, ob das Profil als Business-Account läuft und mit der Website verknüpft ist. → `11-open-questions.md`-Kandidat: Raphael um Screenshot des Profil-Headers oder Business-Suite-Zugang bitten.

**Planungs-Implikation:** Instagram bleibt der Reach-Anker. Relaunch-Plan (kein Code): Bio-Link auf die neue Domain zeigen lassen, Reels-Formate der Website (Kurs-Feeling, Party-Atmosphäre) als Rückkanal zu `/fotos` und `/events` definieren, `sameAs` auf dem Live-Stand beibehalten.

## 3. WhatsApp — Conversion-Kanal, kein Reach-Kanal

- `wa.me/41764788411` ist im Repo an drei Stellen verdrahtet: Footer-Kontakt, Footer-Social-Spalte, fixer `WhatsAppFloat` sitewide. Beleg: `SiteFooter.tsx:17–24, 253`.
- Einordnung: Für eine Tanzschule ist WhatsApp der stärkste Conversion-Hebel (Schnupperstunde anfragen, Privatstunde klären) — aber er ersetzt keinen einzigen Discovery-Kanal. Im Plan als **Anfrage-Kanal** führen, nicht unter „Social Media" mischen.
- Risiko beachten: WhatsApp-Float + Instagram sind die einzigen externen Verlinkungen sitewide. Wenn Instagram ausfällt/Account gesperrt wird, bleibt ausserhalb der Website nur die Maps-Suche.

## 4. Google Business Profile / Maps — die grösste Lücke

**Was belegt ist:**

- Eine Google-Maps-Suche nach „Salsaflow Dance Company Basel" liefert einen benannten Treffer „Salsaflow Dance Company Basel" (Quelle: Maps-Such-HTML, 2026-08-12). Das Profil existiert also.
- **Sternebewertung, Anzahl Rezensionen, Öffnungszeiten, Kategorie, Fotos, Inhaber-Status:** `NICHT BELEGT` — die Werte stecken in Maps-internen Datenstrukturen, die ohne Browser-Rendering oder Places-API-Key nicht verlässlich auslesbar sind. Es wird hier bewusst **keine** Zahl behauptet.
- **Repo-Stand ist schwach:** Der Footer verlinkt als „Google-Bewertung" eine generische Such-URL:
  `https://www.google.com/maps/search/?api=1&query=Salsaflow+Dance+Company+Basel` (`SiteFooter.tsx:23`).
  Das ist **kein** direkter Link auf den Place-Eintrag (kein Place-ID-Link `…?cid=…` oder `g.page`-Kurzlink) und erst recht **kein Review-Link** (`…&action=review`). Wer „Google-Bewertung" klickt, landet auf einer Suchergebnisseite — ein Klick zu viel vor dem Bewerten.

**Planungs-Empfehlungen (Priorität P1, alle ohne Production-Code umsetzbar vorgesehen):**

1. **Place-ID-Link ermitteln und ersetzen.** Konkreter Schritt: Maps-Eintrag in Raphaels Browser öffnen → „Teilen" → Link kopieren (enthält `!1s0x…:0x…` / CID) → Footer-`googleReviews`-URL damit ersetzen. Alternativ Googles offiziellen Review-Kurzlink aus dem GBP-Dashboard („Bewertungen → Mehr Bewertungen erhalten") verwenden — der öffnet direkt das Bewertungsfenster. PLACEHOLDER: echter Place-Link, Quelle Raphaels Browser.
2. **GBP-Inhaberschaft klären.** Ungewiss, ob das Profil von der Schule selbst verwaltet wird (Öffnungszeiten, Kurs-Fotos, Posts). → Open Question: Wer hat den Google-Unternehmens-Login? Ohne Inhaberschaft keine Öffnungszeiten-Pflege, keine Fotos, keine Q&A-Kontrolle.
3. **GBP-Profil-Inhalte (nur belegbare Facts eintragen, keine Claims):** Kategorie „Tanzschule", Adresse Elisabethenanlage 7, 4051 Basel (zeichengleich zur NAP im Footer, `SiteFooter.tsx:185–186`), Telefon +41 76 478 84 11, Website-URL der neuen Domain, Fotos aus der `/fotos-1/`-Quelle der Wahrheit, Öffnungszeiten = Kurszeiten-Hinweis oder „nach Kursplan".
4. **Schema-Anreicherung:** `sameAs` um den finalen Maps-Place-Link ergänzen (derzeit nur Instagram, `seo-schema.ts:155`). Kein `aggregateRating` ins Schema schreiben, solange keine belastbare Quelle die Zahl belegt — Fake-Reviews/-Ratings sind laut Auftrag verboten und Google straft Schema-Spam ab.
5. **Review-Sammeln strukturieren (Ethik-konform):** Nach Schnupperstunde/Abschluss um ehrliche Bewertung bitten — z. B. QR-Karte im Studio auf den echten Review-Link. Keine Anreize, keine gekauften Bewertungen.

## 5. NAP- und Citation-Konsistenz (Local SEO)

**NAP = Name, Adresse, Telefon. Regel: überall zeichengleich.**

| Quelle | NAP-Stand | Beleg |
|---|---|---|
| Repo Footer | Salsaflow Dance Company · Elisabethenanlage 7, 4051 Basel · +41 76 478 84 11 · info@salsaflow-dc.com | `SiteFooter.tsx:17–24, 179–198` |
| Repo LocalBusiness-Schema | identisch, zeichengleich (bewusst so gebaut) | `seo-schema.ts:138–156` |
| Live-Site (Jimdo) | NAP auf Kontakt-Seiten vorhanden, aber **kein** LocalBusiness-JSON-LD auf der Live-Homepage gefunden (Scan: kein `application/ld+json` mit LocalBusiness im HTML) | `/tmp`-Scan Live-Homepage, 2026-08-12 |
| GBP/Maps | Name belegt („Salsaflow Dance Company Basel"), Adresse `NICHT BELEGT` geprüft | Maps-Suche, 2026-08-12 |

**Citation-Plan (Verzeichnisse, in denen der Eintrag fehlt oder ungeprüft ist — alle `NICHT VORHANDEN` bzw. `UNGEPRÜFT` bis manuell verifiziert):**

- **local.ch** und **search.ch** (die zwei gewichtigsten CH-Verzeichnisse) — `UNGEPRÜFT`.
- **Google Business Profile** — existiert, Inhaberschaft offen (§4).
- **Bing Places** — `UNGEPRÜFT` (kleiner Aufwand, deckt Bing/Apple-Maps-Daten teils mit ab).
- **Apple Business Connect** (Apple Maps) — `UNGEPRÜFT`.
- **TripAdvisor / Yelp** — für Tanzschulen nachrangig, `UNGEPRÜFT`.
- Branchen-/City-Listen (basel.ch-Veranstaltungskalender, Salsa-Community-Listen für Basel) — `UNGEPRÜFT`, als Streupfad für Event-Reichweite relevant.

Jeder Citation-Eintrag im Umsetzungsplan: Name/Adresse/Telefon **zeichengleich** zum Repo-Stand, Website-URL neu, Kategorie „Tanzschule / Dance School", keine Superlative, keine erfundenen Bewertungen.

## 6. Live-Site vs. Repo — Social/GBP-Status im Vergleich

| Signal | Live (Jimdo) | Repo (Vercel-Stand) |
|---|---|---|
| Instagram-Link | fehlt auf Homepage | Footer + sameAs (belegt) |
| WhatsApp | nicht gefunden im Homepage-HTML | Footer + sitewide Float |
| Google-Link | nicht gefunden | generischer Such-Link (§4, zu schwach) |
| Facebook | nur Share-Button + FB-Pixel (Tracking) | bewusst kein Facebook |
| LocalBusiness-Schema | nicht gefunden | vorhanden (`seo-schema.ts:138–156`) |
| Facebook-Pixel | **aktiv** (`fbevents.js`) — Datenschutz-Prüfpunkt: Lädt der Jimdo-Stand ein Meta-Pixel ohne sichtbaren Consent-Hinweis darauf? Für den Relaunch: Pixel nur mit Consent und nur wenn ein Meta-Kanal überhaupt betrieben wird. | nicht vorhanden (sauber) |

**Fazit:** Der Repo-Stand ist der Live-Site in jedem geprüften Reach-Signal voraus. Der Relaunch ist aus Social/GBP-Sicht kein Umbau, sondern eine **Verlinkungs- und Inhaberschafts-Aufgabe**: GBP sauber claimen und direkt verlinken, Citations aufbauen, Instagram als einzigen Kanal strategisch absichern (Bio-Link, Reels-Rückkanal), Facebook-Pixel-Leiche der Jimdo-Site nicht mitnehmen.

## 7. Empfohlener Massnahmenplan (Planung, keine Umsetzung)

| # | Massnahme | Prio | Aufwand | Voraussetzung |
|---|---|---|---|---|
| 1 | GBP-Inhaberschaft klären/claimen | P1 | klein | Raphaels Google-Zugang → Open Question |
| 2 | Echten Maps-Place-/Review-Link im Footer ersetzen (`SiteFooter.tsx:23`) | P1 | klein | Ergebnis aus #1 |
| 3 | GBP-Profil vervollständigen (Kategorie, Öffnungszeiten, Fotos aus `/fotos-1/`) | P1 | mittel | #1 |
| 4 | local.ch + search.ch Einträge prüfen/angleichen (NAP zeichengleich) | P2 | klein | — |
| 5 | Instagram-Bio-Link auf neue Domain; Reels-Formate an `/fotos` & `/events` koppeln | P2 | klein | Raphaels IG-Zugang |
| 6 | `sameAs` um finalen Maps-Link ergänzen | P2 | klein | #2 |
| 7 | Apple Business Connect + Bing Places anlegen | P3 | klein | #1 (Daten wiederverwenden) |
| 8 | Facebook/TikTok/YouTube: **bewusst NICHT anlegen**, solange niemand Inhalte pflegt. Halbtote Profile sind ein schlechteres Signal als kein Profil. Entscheid als Verbots-/Hinweis-Eintrag dokumentieren. | P3 | — | Raphaels Entscheid |
| 9 | Jimdo-Facebook-Pixel beim Relaunch **nicht** übernehmen | P2 | — | Relaunch-Cutover |

## 8. Offene Fragen (für `11-open-questions.md`)

1. Wer besitzt den Google-Business-Profile-Login für den Maps-Eintrag — und ist das Profil verifiziert?
2. Ist `instagram.com/salsaflowdc` ein Business-Account; Follower/letzte Aktivität (Screenshot aus Raphaels Login)?
3. Soll Instagram der einzige Social-Kanal bleiben (Empfehlung: ja, solange nur ein Kanal gepflegt wird) — Raphaels Entscheid zu Facebook/TikTok/YouTube.
4. Echter Maps-Place-Link bzw. GBP-Review-Kurzlink (aus dem Dashboard) als Ersatz für die generische Such-URL.
5. Bestehen schon Einträge auf local.ch/search.ch — mit welchen Daten?

---

*Quellen dieses Audits: Live-Scan `https://www.salsaflow-dc.com/` (HTML, 2026-08-12), HTTP-Status-Probes der Kandidaten-URLs (2026-08-12), Google-Maps-Such-HTML (2026-08-12), Repo-Dateien `src/public/site/SiteFooter.tsx`, `src/lib/seo-schema.ts`, `src/lib/schema.ts`. Alle als `NICHT BELEGT`/`UNGEPRÜFT` markierten Punkte wurden bewusst nicht mit Zahlen befüllt.*
