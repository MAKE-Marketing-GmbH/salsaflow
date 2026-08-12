# 08 — Component-Map / Bauplan

**Status:** PLAN ONLY · A — Warme Bühne entschieden 2026-08-12  
**Scope:** Home `/` und sitewide Komponenten für die nächste Bauwelle. Kein Production-Code geändert.  
**Verbindliche Quellen:** [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md), [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md), [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md), [briefs.md](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md), [12-verbote-und-gates.md](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md)

---

## 0. Vertrag und Abnahme

### Gewünschtes Ergebnis

Die Home wird im Dialekt **A — Warme Bühne** umgesetzt: Bleed-Hero mit echtem Studiofoto, rotem Kant-Marker, warmem Textblock links und ruhigen Editorial-Sektionen auf `paper-warm`/`bg-soft`. Die Kunden-IA bleibt unverändert. B und C werden nicht gebaut.

### Kleinste Beweise

- Hero im ersten Paint sichtbar, nicht lazy geladen; Bildfehler zeigt eine gefüllte dunkle Fläche mit Wortzeichen statt Weiss. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:56-63).
- Home enthält Hero plus die sieben Kundenblöcke in Reihenfolge: Team, Angebot/Kurskalender, reguläre Kurse, Privatstunden, Shows/Animationen, Gutschein, News. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:22-36).
- Hauptnavigation bleibt exakt `TANZKURSE · EVENTS & WORKSHOPS · TEAM · FOTOS · KONTAKT · MEHR`. Beleg: [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:20-32).
- Keine erfundenen Reviews, Ratings, Zertifikate, Zahlen oder Namen. Beleg: [12-verbote-und-gates.md](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md:13-20).
- Privatstunden verwendet nicht das bestehende falsche Motiv. Zwischenlösung oder textgeführt. Beleg: [02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:23-32) und [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:208-216).
- Nach der Umsetzung: `npm run build` plus Browser-Sichtprüfung der Home in 1440px und mobil. Das ist der verankerte Verify-Befehl. Beleg: [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:118-120).

---

## 1. Systemgrenzen

| Regel | Umsetzung im Map | Beleg |
|---|---|---|
| Display-Schrift | `font-display` = Cal Sans | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:47-52) |
| Fliesstext | `font-sans` = Afacad | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:47-52) |
| Akzent | Salsa `#ad1827`, sparsam für Aktion/Marker/Hover | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:39-45) |
| Script | Alex Brush genau am Hero-Eyebrow `Bailar es vivir.` | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:52-53) |
| Bildsprache | echte Tanz-/Studio-/Team-Fotos, kein KI-from-scratch | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:90-94) |
| Motion | nur Stagger-Fade-up; Reduced Motion sofort sichtbar | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:96-98) |
| Shell | `max-w-[1400px]`, `px-5 sm:px-8` | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:70-74) |
| CTA | höchstens ein Primary pro Sektion; Pill rot, Sekundärlink als Textlink | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:84-88) |
| States | loading, empty, error, success, disabled/submitting, mobile als Notiz | [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:115-116) |

Vorhandene primitives und Shell liegen in [primitives.tsx](/root/clients/salsaflow-dc/src/public/site/primitives.tsx) und [kit.tsx](/root/clients/salsaflow-dc/src/public/home/kit.tsx). Sie sind Reuse-Bestand, keine neue Parallel-Komponentenfamilie.

---

## 2. Seitenkomposition Home `/`

| Slot | Kundenjob | Ziel-Komponente | Reuse / Plan | Asset / Daten | Pflichtzustände |
|---|---|---|---|---|---|
| 0 | erster Paint, Orientierung, Einstieg | `Hero` | bestehende Datei als Umbau auf A-Dialekt | `/photos/2026/hero-paar-studiowand-01.webp`; `loading="eager"`, `fetchPriority="high"` | Bild-Error-Fallback; reduced motion |
| 1 | Team + kurzer Text über uns | `TeamBlock` | bestehende Komponente; Text/Bild-Komposition an Kunden-Copy angleichen | freigegebenes Gründer-Gruppenfoto oder vier Cutouts; neutrale Alts bis P-03 geklärt | Bild-Error-Fallback; neutrale Alt-Texte |
| 2 | Angebot + Kurskalender | `Offer` + `ScheduleTeaser` | bestehende Komponenten, als ein Kapitel dokumentieren; Kursdaten bleiben serverseitig | Premium-Stilbilder; `/api/public/schedule` | loading, ready, empty, error, Status frei/ausgebucht |
| 3 | reguläre Tanzkurse | `Offer`-Karten / `CoursePath` | bestehende Stilkarten und Level-Block wiederverwenden, keine neue Card-Soup | Salsa, Bachata, Heels Assets; Level-Logik aus IA | sichtbare Links; Daten-/Textzustand |
| 4 | Privatstunden | textgeführter Home-Block oder geeigneter bestehender Teil | kein falsches `offer-privat-*`; bestehende Motivfamilie nur nach P-01-Freigabe | vorläufig textgeführt; Ersatzmotiv nur mit bestätigtem Alt | kein Fake-Kalender; Anfrageweg |
| 5 | Animationen / Shows | `EventsTeaser`-ähnlicher Editorial-Block oder bestehende Shows-Referenz | vorhandenen Event-/Show-Bau wiederverwenden; keine neue Event-Nacht-Seite | kuratierte Showbilder, ohne `show-04`, `show-15`, `show-22` | Bild-Error-Fallback; Anfrage-Link |
| 6 | Gutschein | bestehender Kontakt-/Anfrageweg, kein Checkout | als Anfrage-Block; Ablauf/Preis nicht erfinden | keine Pflichtgrafik | neutraler Anfragezustand; keine Kaufbehauptung |
| 7 | News | bestehende `EventsTeaser`/datengetriebene News-Struktur | nur belegte kommende Einträge; keine statische Altlast | Danceflow Night, FLOWeekend nur mit Proof | no upcoming, Fehler still weglassen |
| 8 | Abschluss + Standort | `LocationBand` | bestehende Kontaktkarte im ruhigen Editorial-Dialekt | echtes Kurs-/Studiofoto; Adresse aus Proof | CTA, WhatsApp, Telefon; Bild-Fallback |
| Chrome | Navigation und Kontakt | `SiteHeader`, `SiteFooter`, `WhatsAppFloat` | sitewide wiederverwenden, keine Home-Sondernavigation | Wordmark, echte Kontaktziele | mobile Menü, Fokus, Cookie-/Float-Interaktion |

Die aktuelle Render-Reihenfolge in [HomePage.tsx](/root/clients/salsaflow-dc/src/public/HomePage.tsx:92-105) ist ein vorhandener Repo-Stand und entspricht nicht vollständig dem verbindlichen Kundenvertrag. Die nächste Produktionswelle muss daher die Reihenfolge gegen [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:22-36) prüfen, statt die aktuelle JSX-Reihenfolge blind als IA zu übernehmen.

---

## 3. Detailverträge je Komponente

### 3.1 `Hero`

**Datei:** [Hero.tsx](/root/clients/salsaflow-dc/src/public/home/Hero.tsx)  
**Rolle:** P0-Hero, A — Warme Bühne.

- Layout: links warmer Textblock, rechts Studio-Crop als Bleed bis zur Viewportkante. Der rote Kant-Marker bleibt als Akzent.
- Copy: H1 `Tanzen lernen in Basel.`; Lead mit Salsa, Bachata, Heels und bestätigtem Bahnhof-Bezug; CTA `Probestunde anfragen`; sekundär `Kursplan ansehen`. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:40-54).
- Asset: `/photos/2026/hero-paar-studiowand-01.webp`; bildgenauer Alt-Text. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:56-63).
- Mobile: Portrait-Variante nur als technische Responsive-Ausspielung, nicht als neue Designrichtung.
- `onError`: gefüllte dunkle Fallback-Fläche plus Wortzeichen; niemals leerer weisser Bereich.
- Nicht übernehmen: unbestätigte `gratis`-Claims oder aktuelle Hero-Copy, falls sie dem finalen Home-Vertrag widerspricht. Beleg des Gates: [12-verbote-und-gates.md](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md:26-34).

### 3.2 `TeamBlock`

**Datei:** [TeamBlock.tsx](/root/clients/salsaflow-dc/src/public/home/TeamBlock.tsx)  
**Rolle:** Kundenblock 1.

- Copy aus [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:71-95), nicht die alternative V3-Story als stillen Ersatz.
- Bild bevorzugt als freigegebenes Gruppenfoto der vier Gründer; sonst vier Einzel-Cutouts.
- Portrait-Namen erst nach P-03-Bestätigung. Bis dahin neutrale Alt-Texte. Beleg: [02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:87-91).
- Bestehende Gründerkarten aus [FounderRow.tsx](/root/clients/salsaflow-dc/src/public/team/FounderRow.tsx) wiederverwenden, wenn der gewünschte Inhalt vollständig bleibt.

### 3.3 `Offer` + `ScheduleTeaser`

**Dateien:** [Offer.tsx](/root/clients/salsaflow-dc/src/public/home/Offer.tsx), [ScheduleTeaser.tsx](/root/clients/salsaflow-dc/src/public/home/ScheduleTeaser.tsx), [CoursePath.tsx](/root/clients/salsaflow-dc/src/public/home/CoursePath.tsx).  
**Rolle:** Kundenblock 2 und 3 ohne künstliche neue Kartenschicht.

- `ScheduleTeaser` bleibt datengetrieben. Die Zustände sind Teil des Vertrages, nicht nachträgliches Polish. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:99-130).
- Karten zeigen mindestens Stil, Level, Wochentag, Startdatum und Status.
- `Offer` zeigt Salsa, Bachata und Heels; Privatstunden nicht als normale vierte Stilkarte, solange P-01 offen ist.
- `CoursePath` zeigt die Level-Logik und den Flow-Kurs. Die verbindlichen Stufen stehen in [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:104-128).
- Keine neue Farbe für Status; bestehende Tokens und Statussemantik verwenden.

### 3.4 Privatstunden-Block

**Planentscheidung:** textgeführt, solange P-01 nicht mit Shooting oder freigegebener Zwischenlösung gelöst ist.

- Kein Einsatz der vier `/photos/premium/offer-privat-*`-Dateien. Der Bestand zeigt vier Crops desselben ungeeigneten Motivs. Beleg: [02-asset-inventar.md](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md:91-132).
- Primärer Weg `/privatstunden`; CTA `Privatstunde anfragen`.
- Kein Fake-Kalender und kein Self-Checkout. Beleg: [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:152-162).

### 3.5 Shows, Gutschein und News

- Shows: bestehende Show-Assets kuratieren; Watermark-Motive ausschliessen. Beleg: [02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:71-74).
- Gutschein: Anfrage statt Kauf, solange Preis, Gültigkeit und Zustellung nicht bestätigt sind. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:242-263).
- News: nur kommende/belegte Einträge; wiederkehrende Danceflow Night als Rhythmus, nicht als erfundenes Datum. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:267-302).

### 3.6 `LocationBand`

**Datei:** [LocationBand.tsx](/root/clients/salsaflow-dc/src/public/home/LocationBand.tsx)

- Abschluss bleibt ruhig und editorial, nicht als zweiter Hero.
- Adresse und Bahnhofsaussage nur in bestätigter Form. `zwei Minuten` beziehungsweise `zwei Häuser` sind HOME-01-Gates. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:306-321).
- WhatsApp und Telefon bleiben sichtbare nächste Wege.

---

## 4. Sitewide-Komponenten

| Komponente | Datei | Entscheidung |
|---|---|---|
| Header | [SiteHeader.tsx](/root/clients/salsaflow-dc/src/public/site/SiteHeader.tsx) | Nav-Labels und Ziele an Kunden-Baseline angleichen; aktuelle Event-Altpfade nicht als kanonische Endziele festschreiben. |
| Footer | [SiteFooter.tsx](/root/clients/salsaflow-dc/src/public/site/SiteFooter.tsx) | echte Kontakt- und Legal-Ziele behalten; unbestätigte Review-Zeile nicht als Proof aufblasen. |
| WhatsApp | [WhatsAppFloat.tsx](/root/clients/salsaflow-dc/src/public/site/WhatsAppFloat.tsx) | sitewide sichtbar, beschriftet, mit vorbereitetem Fragetext. Beleg: [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:325-332). |
| Primitives | [primitives.tsx](/root/clients/salsaflow-dc/src/public/site/primitives.tsx) | `Shell`, `CtaPill`, `CtaText`, `Eyebrow`, `BeatMark` wiederverwenden; keine parallelen CTA-/Eyebrow-Varianten. |
| Home-Kit | [kit.tsx](/root/clients/salsaflow-dc/src/public/home/kit.tsx) | bestehende Token- und Rhythmusklassen prüfen; neue A-Dialekt-Werte nur bei belegtem Layoutbedarf. |
| SEO | [SeoHead.tsx](/root/clients/salsaflow-dc/src/components/SeoHead.tsx), [seo.tsx](/root/clients/salsaflow-dc/src/lib/seo.tsx) | Home-Meta aus [01-home.md](/root/clients/salsaflow-dc/website-plan/06-seiten/01-home.md:12-20) prüfen; keine neuen Claims. |

---

## 5. Routen- und IA-Grenzen

- Die kanonischen Eventziele liegen laut IA unter `/events/*`. Beleg: [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:44-50).
- Der aktuelle Router führt die Event-Details noch unter `/events-workshops/*`. Beleg: [routes.tsx](/root/clients/salsaflow-dc/src/routes.tsx:54-58).
- Das ist ein separates Redirect-/Routing-Paket, nicht still in den Home-Visual-Edit mischen. Die Redirect-Matrix ist ausdrücklich ein eigener technischer Plan. Beleg: [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:79-86).
- Keine neuen `/probestunde`, `/schule`, `/nights`, `/studio`, `/club` oder `/uns`-Hausseiten. Beleg: [05-sitemap-ia.md](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:71-77).

---

## 6. Asset- und Proof-Gates vor Umsetzung

| Gate | Status | Konsequenz |
|---|---|---|
| A gewählt | erledigt | A-Dialekt bauen; B/C nicht weiterführen. Beleg: [12-verbote-und-gates.md](/root/clients/salsaflow-dc/website-plan/12-verbote-und-gates.md:26-34). |
| Hero-Asset | vorhanden | `/photos/2026/hero-paar-studiowand-01.webp` verwenden. |
| P-01 Privatstunden | offen | Home-Block textgeführt oder freigegebene Zwischenlösung; kein altes `offer-privat`. |
| P-02 Reviews | offen | keine neue Review-/Wall-of-Love-Fläche im A-Mockup ohne Primärbeleg. |
| P-03 Gründer-Zuordnung | offen | neutrale Alt-Texte, keine geratenen Namen in Bild-Alt. |
| HOME-01 Bahnhof-Gehzeit | offen | Formulierung `direkt beim Bahnhof SBB`, falls nicht bestätigt. |
| S-02 Gratis-Claim | offen | `Probestunde anfragen`; kein `gratis` in neuer Copy. |
| GUT-01 Gutschein | offen | Anfrage, kein Preis/Checkout. |
| L-01 Composite-Provenienz | offen | ungeklärte Composite-Bilder nicht neben Standort-Claims einsetzen. |

Die Asset-Lage und die Blocker sind vollständig in [02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-65) dokumentiert.

---

## 7. Produktionsreihenfolge nach Freigabe

1. **Home-Shell und Hero:** A-Mockup mit 1440px, Hero-Fallback und rotem Kant-Marker.
2. **Home-Section 1:** Team-Copy und Founder-Asset-Zuordnung neutral halten.
3. **Home-Sections 2–3:** Offer, Schedule und Level-Block auf Kundenreihenfolge und State-Coverage prüfen.
4. **Home-Sections 4–7:** Privatstunden textgeführt, Shows kuratiert, Gutschein als Anfrage, News nur mit Proof.
5. **Abschluss und Chrome:** LocationBand, Header, Footer, WhatsApp und Fokuszustände.
6. **Verifikation:** `npm run build`; Browser-Sichtprüfung Desktop/Mobil; anschließend Screenshot-Check gegen [briefs.md](/root/clients/salsaflow-dc/website-plan/09-mockups/briefs.md).
7. **Separates Paket:** Redirect-Matrix und kanonische Eventpfade unter `/events/*`; nicht Teil des visuellen Home-Pakets.

---

## 8. Bewusst nicht im Paket

- Keine Production-Dateien geändert.
- Keine Bildgenerierung oder Asset-Neuerstellung: P-01, P-02, L-01 und P-03 brauchen Freigabe/Proof.
- Keine neue Component-Library und kein Library-Dump.
- Keine B- oder C-Variante.
- Keine globale `bg-white`-Migration; [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md:104-110) verlangt pageweise Migration mit Screenshot-Check.
- Keine erfundenen Namen, Reviews, Preise, Gehzeiten oder Gutscheinbedingungen.

**Ende `08-component-map.md`.**
