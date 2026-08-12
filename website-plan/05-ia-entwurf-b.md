# IA-Entwurf B — zwei Alternativen zur heutigen Struktur

**Rolle:** IA-Worker B (andere Familie)
**Stand:** 2026-08-12
**Scope:** FULL, **PLANNING ONLY** — kein Production-Code, keine Route-Datei angefasst.
**Bindend gelesen:** [DESIGN.md](/root/clients/salsaflow-dc/DESIGN.md) · [DECISIONS.md](/root/clients/salsaflow-dc/DECISIONS.md) · [ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md)
**Grundlage:** [03-seo-audit.md](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md) · [04-seo-plan.md](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md) · [04c-growth-critic.md](/root/clients/salsaflow-dc/website-plan/04c-growth-critic.md) · [01-firma-dossier.md](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md) · [02-asset-inventar.md](/root/clients/salsaflow-dc/website-plan/02-asset-inventar.md) · [02b-asset-gaps.md](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md) · [01b-online-praesenz.md](/root/clients/salsaflow-dc/website-plan/01b-online-praesenz.md)

**Beweisregel:** Jede Ist-Aussage hat Datei+Zeile, URL oder Befehl. Bewertungen sind als `BEWERTUNG` markiert. Keine erfundenen Reviews, Sterne, Rankings, Zertifikate, Kundenstimmen. Fehlender Beleg = `PLACEHOLDER`.

---

## 0. Was dieses Dokument ist — und was nicht

Es liefert **zwei vollständige, gegensätzliche IA-Alternativen** (B1 und B2) zur heute gebauten Struktur. Beide sind bewusst **keine Kosmetik** an den 26 Routen, sondern zwei verschiedene Antworten auf dieselbe Frage: *nach welcher Logik soll ein Mensch diese Website begreifen?*

- **B1 „Ein Weg" (Funnel-IA)** — die Seite ist als ein Entscheidungspfad gebaut. Schlanke Navigation (5 Einträge), jede Seite kennt ihren nächsten Schritt. Für Einsteiger optimiert.
- **B2 „Zwei Häuser" (Publikums-IA)** — die Seite trennt oben zwei Publika: *Lernen* und *Ausgehen*. Für Community + Kursverkauf gleichzeitig.

Beide halten die Frozen Rules ein. Beide sind gegen den heutigen Stand gemessen. Am Ende steht eine **Empfehlung mit Begründung** und die Liste dessen, was ich **nicht** entscheiden darf.

**Kein Deliverable dieses Dokuments:** Code, Copy in Endfassung, Redirect-Implementierung, Designentwürfe, neue Bilder.

---

## 1. Ist-Zustand der IA (gemessen, damit die Alternativen einen Nullpunkt haben)

### 1.1 Der heutige Baum

Quelle: [`src/routes.tsx:43-79`](/root/clients/salsaflow-dc/src/routes.tsx) — 26 indexierbare Routen, 3 App-Routen, 3 Redirects.

```
/                                          Home
/tanzkurse                                 Übersicht
  /tanzkurse/salsa · /bachata · /heels      3 Stil-Seiten
/privatstunden
/kursaufbau
/preise
/kursplan                                  (app-public, prerender)
/shows-animationen
/events                                    Übersicht
/events-workshops/danceflow-night
/events-workshops/anniversary-weekend
/events-workshops/floweekend
/events-workshops/eventkalender
/team
/fotos
/kontakt
/kontakt/standort-raumvermietung
/mehr                                      Übersicht
/mehr/collabs · /mehr/tanzschuhe · /mehr/partys
/faq
/impressum · /datenschutz
/buchung · /buchung/erfolg · /buchung/abbruch   (noindex)
/admin                                     (noindex)
```

Navigation: 6 Top-Level-Einträge mit Dropdowns, belegt in [`src/public/site/SiteHeader.tsx:98-136`](/root/clients/salsaflow-dc/src/public/site/SiteHeader.tsx).

### 1.2 Was an dieser IA gut ist — nicht kaputtreden

| # | Stärke | Beleg |
|---|---|---|
| IS-1 | **Ein Thema, eine Adresse** — keine Doppelseiten wie live `/kontakt/` gegen `/kontakt/kontakt/` | 03-seo-audit L-06 vs. §4.1 |
| IS-2 | **Genau 1 H1 pro Seite**, maschinell erzwungen | `node scripts/verify-seo.mjs` → PASS, 26 Routen |
| IS-3 | **Saubere Slugs** — die Live-Tippfehler `philisophie` / `anniverysary` sind nicht übernommen | 03-seo-audit L-11 |
| IS-4 | **Keine Seite tiefer als 3 Klicks** | 04-seo-plan §5 Regel 6 |
| IS-5 | **Checkout ist aus dem Index heraus** — `/buchung*` und `/admin` auf `noindex` | `routes.tsx:71-75` + dist-Messung |
| IS-6 | **Stil-Seiten existieren getrennt** (Salsa/Bachata/Heels) — genau die kaufnahen Suchbegriffe | `routes.tsx:46-48` |

**Diese sechs Punkte sind in B1 und B2 nicht verhandelbar.** Eine Alternative, die IS-1 bis IS-6 aufgibt, ist keine Verbesserung, sondern ein Rückschritt zur Jimdo-Logik.

### 1.3 Was an dieser IA strukturell schwach ist

| # | Schwäche | Beleg | Warum das ein IA-Problem ist (nicht Copy) |
|---|---|---|---|
| IA-1 | **`/mehr` ist eine Restekiste.** Darin: Collabs (Partner-Shop), Tanzschuhe (Ratgeber), Partys (Szene-Überblick), FAQ per Nav-Link. | `routes.tsx:62-66`, `SiteHeader.tsx:126-134` | Drei völlig verschiedene Jobs unter einem Label, das nichts verspricht. Kein Mensch sucht „Mehr". `BEWERTUNG` |
| IA-2 | **Zwei parallele Event-Präfixe.** `/events` ist die Übersicht, die Kinder liegen unter `/events-workshops/…`. | `routes.tsx:55-59` | Der Übersichtspfad ist nicht der Elternpfad der Detailseiten. Breadcrumb und URL erzählen zwei verschiedene Hierarchien. |
| IA-3 | **`/shows-animationen` hängt im Event-Dropdown**, ist aber eine B2B-Anfrage-Seite. | `SiteHeader.tsx:120` | Firmenkunde und Partygast bekommen denselben Einstieg. Growth-Critic ordnet Shows als C5/Anfrage ein, Events als C4 — verschiedene Conversions. |
| IA-4 | **`/kursplan` ist `app-public`, aber der eigentliche Kaufort.** | `routes.tsx:70` | Die kommerziell wichtigste Seite lebt in einer anderen Route-Klasse als die Seiten, die dorthin führen. |
| IA-5 | **Die Geldseiten stützen sich fast nicht gegenseitig.** `/tanzkurse/salsa` hat 2 Links im Inhalt, `/privatstunden` 3. | 03-seo-audit R-05 | Das ist kein Textproblem, sondern ein IA-Problem: die Struktur sieht keine Nachbarschaft vor. |
| IA-6 | **Kein einziger englischer Pfad.** Übersetzungen komplett vorhanden, 0 Treffer für `/en` in den Routen. | 03-seo-audit R-01, `src/lib/i18n.tsx:11` | Eine ganze Sprachfassung ohne Adresse ist eine IA-Lücke, nicht ein Übersetzungsproblem. |
| IA-7 | **`/kursaufbau` liegt im Kurs-Dropdown an 6. Stelle**, obwohl es der Einwand-Löser Nr. 1 ist („welches Level bin ich?"). | `SiteHeader.tsx:106` | Die Struktur versteckt die Antwort auf die häufigste Angst. `BEWERTUNG` |
| IA-8 | **`/fotos` und `/team` sind Sackgassen im Baum** — Vertrauensseiten ohne strukturell vorgesehenen Weiterweg. | Growth-Critic §3.2 („Galerie-Sackgasse") | Vertrauen wird aufgebaut und dann nicht eingelöst. |
| IA-9 | **Keine Adresse für die AGB.** Live existiert `/infos/agb/` mit echten Zahlungs- und Abmelderegeln; im Repo gibt es keinen Zielpfad. | 03-seo-audit §6 Zeile `/infos/agb/`; 04-seo-plan §7 | Für eine Schule, die kassiert, ist das eine strukturelle Lücke, nicht ein Textmangel. Offen als S-04. |

**Kernbefund:** Die heutige IA ist **technisch sauber, aber thematisch nach Angebotskatalog sortiert**, nicht nach der Frage, mit der ein Mensch ankommt. `BEWERTUNG`

---

## 2. Die Aufgaben, an denen jede IA gemessen wird

Abgeleitet aus den belegten Conversions (Growth-Critic §1, C1–C5) und dem Angebot ([01-firma-dossier.md](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md) §5).

| Job | Der Mensch dahinter | Erfolg heisst |
|---|---|---|
| **J1 Ausprobieren** | „Ich will tanzen lernen, traue mich aber nicht." | Probestunde angefragt (C1) |
| **J2 Einsteigen** | „Ich bin bereit. Wann, wo, wie viel?" | Kurs gebucht (C2) |
| **J3 Einordnen** | „Welcher Kurs passt zu mir? Bin ich zu spät/zu alt/zu unsportlich?" | geht weiter zu J1 oder J2 |
| **J4 Individuell** | Hochzeitspaar, Technikarbeit, Schichtarbeit | Privatstunde angefragt (C3) |
| **J5 Ausgehen** | „Wo kann ich Freitag in Basel tanzen?" | Danceflow Night besucht (C4) |
| **J6 Prüfen** | „Ist das seriös? Wer unterrichtet? Wie sieht es aus?" | Vertrauen → J1/J2 |
| **J7 Beauftragen** | Firma, Hochzeit, Raumsuche | Anfrage gesendet (C5) |
| **J8 Wiederkommen** | Bestehende Schülerin: Plan, Termine, Nachholen | findet in ≤2 Klicks |
| **J9 Englisch** | Expat/Pendler am SBB | dasselbe wie J1–J8, auf Englisch, mit eigener Adresse |

**Messlatte:** Eine IA ist besser, wenn sie mehr dieser Jobs in **weniger Klicks mit weniger Fehlentscheidungen** löst — und die Frozen Rules nicht bricht.

---

# ALTERNATIVE B1 — „Ein Weg"

**Leitidee:** Die Website ist **eine Entscheidungsstrecke**, nicht ein Katalog. Jede Seite auf der Strecke beantwortet eine Stufe des Zögerns. Alles, was nicht auf dieser Strecke liegt, wird nachgeordnet — nicht gelöscht, aber aus der Hauptnavigation genommen.

**Wette:** Die Schule verliert Geld an Unentschlossenheit, nicht an fehlender Information. `BEWERTUNG`, gestützt auf: FAQ live hat 635 Wörter echte Einwand-Antworten (03-seo-audit §3.1) — die Substanz ist da, sie steht nur nicht im Weg.

## B1.1 Der Baum

```
/                                       „Tanzen lernen in Basel" — Einstieg
│
├─ /probestunde                      ★ NEU — eigene Seite für J1
│
├─ /tanzkurse                           Alle Kurse, ein Vergleich
│   ├─ /tanzkurse/salsa
│   ├─ /tanzkurse/bachata
│   ├─ /tanzkurse/heels
│   └─ /tanzkurse/level               ← heute /kursaufbau, umbenannt
│
├─ /kursplan                            Termine + Buchen (der Kaufort)
├─ /preise
│
├─ /privatstunden
│   └─ /privatstunden/hochzeitstanz    ★ NEU, nur wenn belegt → S-05
│
├─ /danceflow-night                  ← heute /events-workshops/danceflow-night
│   └─ /danceflow-night/basel-partys  ← heute /mehr/partys
│
├─ /studio                              Ort, Anfahrt, Vermietung, Team
│   ├─ /studio/team                   ← heute /team
│   ├─ /studio/fotos                  ← heute /fotos
│   └─ /studio/raum-mieten            ← heute /kontakt/standort-raumvermietung
│
├─ /anfragen                          ★ NEU — ein Anfrage-Ort für J7
│                                        (Shows, Animationen, Firmen, Raum)
├─ /faq
├─ /kontakt
│
├─ /events                              Terminübersicht (Danceflow, Specials)
│   ├─ /events/floweekend
│   └─ /events/anniversary-weekend
│
├─ /mehr/tanzschuhe                     bleibt, aber nur aus /faq + Stil-Seiten verlinkt
├─ /mehr/collabs                        bleibt, nur Footer
│
├─ /agb                              ★ NEU, offen S-04
├─ /impressum · /datenschutz
│
├─ /buchung*  · /admin                  noindex, unverändert
└─ /en/…                                Spiegel, siehe §B1.6
```

Zählung: **27 indexierbare deutsche Seiten** (heute 26), plus englischer Spiegel. Geprüft mit `/tmp/count.py` → `B1 indexierbar: 27 | unique: 27`.

**Ehrlich dazu:** B1 spart **keine** Seiten, es *sortiert* sie. Die Seitenzahl steigt sogar um 1, weil `/probestunde`, `/buchen-lassen` und `/agb` neu dazukommen und nur `/mehr` wegfällt. Der Gewinn von B1 liegt nicht in weniger Seiten, sondern in **weniger Navigationsentscheidungen** (5 statt 6 Top-Einträge, keine Restekiste) und in einem klaren Pfad. Wer „weniger Seiten" als Ziel hört, wird von B1 enttäuscht.

## B1.2 Navigation — bewusst fünf Einträge

| Position | Label | Ziel | Kinder |
|---|---|---|---|
| 1 | Kurse | `/tanzkurse` | Salsa · Bachata · Heels · Welches Level? · Preise |
| 2 | Kursplan | `/kursplan` | — |
| 3 | Privatstunden | `/privatstunden` | (Hochzeitstanz, falls S-05 ja) |
| 4 | Danceflow Night | `/danceflow-night` | Partys in Basel · Eventkalender |
| 5 | Studio | `/studio` | Team · Fotos · Raum mieten |
| CTA | **Probestunde** | `/probestunde` | Outline-Pill, siehe B1.5 |

Footer trägt: FAQ, Kontakt, Anfragen, Tanzschuhe, Collabs, AGB, Impressum, Datenschutz, Instagram, WhatsApp, Maps-Link.

**Was hier absichtlich verschwindet:** „Mehr" als Navigationspunkt (löst IA-1), Shows als Event-Kind (löst IA-3), `/events-workshops/` als Präfix (löst IA-2).

## B1.3 Warum jede Änderung — mit Job und Beleg

| Änderung | Löst | Begründung |
|---|---|---|
| **`/probestunde` als eigene Seite** | J1, IA-7 | Heute ist die Probestunde nur ein Nav-Button auf `/kontakt#schnupperstunde` ([`SiteHeader.tsx:212`](/root/clients/salsaflow-dc/src/public/site/SiteHeader.tsx)). Ein Anker auf der Kontaktseite ist kein Landeplatz: er kann nicht ranken, nicht geteilt, nicht in der Search Console gemessen werden. Die häufigste Einstiegsabsicht hat keine Adresse. |
| **`/kursaufbau` → `/tanzkurse/level`** | J3, IA-7 | „Kursaufbau" ist Schulsprache. Gesucht wird „welches level tanzkurs" (04-seo-plan §2.1). Als Kind von `/tanzkurse` steht es dort, wo die Frage entsteht. |
| **`/mehr` aufgelöst** | IA-1 | Partys gehören zur Danceflow Night (gleiche Absicht: ausgehen). Tanzschuhe ist eine FAQ-Antwort mit eigener Seite. Collabs ist ein Partnerlink — Footer genügt. |
| **`/studio` als Vertrauens-Haus** | J6, IA-8 | Team, Fotos, Ort und Vermietung beantworten alle dieselbe Frage: „Ist das echt und wo ist das?" Als Cluster können sie sich gegenseitig stützen; heute sind es drei Sackgassen an drei Stellen im Baum. |
| **`/anfragen` als ein Anfrage-Ort** | J7, IA-3 | Shows, Animationen, Firmenevents und Raummiete sind derselbe Vorgang: Formular mit Datum, Art, Personenzahl. Ein Ort, ein Formular, ein Messpunkt. |
| **`/events-workshops/` → `/events/`** | IA-2 | Die Übersicht wird der echte Elternpfad. Breadcrumb und URL erzählen dieselbe Hierarchie. |
| **`/danceflow-night` auf Top-Level** | J5 | Es ist eine eigene Marke mit belegtem Rhythmus (1./3./5. Freitag, 01-firma-dossier §5.2) und eigenem Preis (CHF 5/10). Sie unter „Events" zu vergraben, verschenkt den einzigen wiederkehrenden Community-Anker. |
| **`/agb` als Adresse** | IA-9 | Live existieren echte Regeln unter `/infos/agb/`. Der Relaunch braucht ein Ziel dafür. Offen: eigene Seite oder Teil des Impressums → S-04. |

## B1.4 Der eine Weg, explizit

```
Google / Maps / Instagram
   │
   ├─ „salsa kurs basel"      → /tanzkurse/salsa
   ├─ „tanzschule basel"      → /
   ├─ „welches level"         → /tanzkurse/level
   └─ „salsa party basel"     → /danceflow-night
          │
          ▼
   Einwand weg?  ── nein ──► /faq  ·  /tanzkurse/level  ·  /studio/fotos
          │ ja
          ▼
   /probestunde   ──────────► Anfrage abgeschickt          [C1]
          │  (oder direkt)
          ▼
   /preise ──► /kursplan ──► /buchung ──► Stripe ──► confirmed   [C2]
```

**Jede Seite kennt ihren nächsten Schritt.** Das ist die strukturelle Antwort auf IA-5: die Nachbarschaft ist im Baum vorgesehen, nicht dem Textredakteur überlassen.

Pflicht-Nachbarschaften (mindestens, aus 04-seo-plan §5):

| Seite | verlinkt strukturell auf |
|---|---|
| `/tanzkurse/salsa` | `/preise`, `/kursplan`, `/tanzkurse/level`, `/probestunde`, `/danceflow-night` |
| `/tanzkurse/level` | die drei Stil-Seiten, `/probestunde`, `/kursplan` |
| `/preise` | `/kursplan`, `/tanzkurse`, `/privatstunden`, `/faq` |
| `/studio/fotos` | `/danceflow-night`, `/probestunde`, `/tanzkurse` |
| `/studio/team` | `/tanzkurse`, `/privatstunden` |
| `/faq` | jede Antwort auf die betroffene Seite |
| `/danceflow-night` | `/danceflow-night/basel-partys`, `/tanzkurse`, `/probestunde` |

## B1.5 CTA-Belegung (im Rahmen Growth-Critic §3.2, DESIGN.md „max ein Primary pro Sektion")

| Seite | Primary | Secondary | Nav-CTA |
|---|---|---|---|
| `/` | „Probestunde anfragen" → `/probestunde` | „Kursplan ansehen" | Outline „Probestunde" |
| `/tanzkurse` + Stil-Seiten | oben C1, nach dem Preisblock C2 „Kurs wählen" → `/kursplan` | Preise, Level | Outline „Probestunde" |
| `/tanzkurse/level` | „Probestunde anfragen" | Stil-Seiten | Outline „Probestunde" |
| `/kursplan` | „Platz sichern" (frei) / **„Auf die Warteliste"** (voll) | WhatsApp | Outline „Probestunde" |
| `/preise` | „Zum Kursplan" | Probestunde, Privat | Outline „Probestunde" |
| `/privatstunden` | „Privatstunde anfragen" | Ablauf/Preisrahmen als Anker | **Override → Outline „Kontakt"** |
| `/danceflow-night` | „Nächster Termin" (nur echte Termine) | Kurse entdecken | Outline „Probestunde" |
| `/studio/*` | „Probestunde anfragen" | Instagram, Anfahrt | Outline „Probestunde" |
| `/anfragen` | „Anfrage senden" (Datum, Art, Personen) | Telefon, WhatsApp | **Override → Outline „Kontakt"** |
| `/faq` | am Blockende „Probestunde anfragen" | passende Seite je Antwort | Outline „Probestunde" |
| `/kontakt` | WhatsApp/Telefon soft | Maps, Mail | — |

**Label-Sperre:** kein „gratis" / „geht auf uns", solange S-02 nicht freigegeben ist (03-seo-audit R-10 belegt den Claim als ungeprüft; er steht heute in `src/lib/seo-schema.ts:143`). Bis dahin: „Probestunde anfragen".

## B1.6 Englisch

Spiegel unter `/en/…` mit **englischen** Slugs, wechselseitiges `hreflang` plus `x-default` auf Deutsch (04-seo-plan §3.2).

| Deutsch | Englisch |
|---|---|
| `/` | `/en` |
| `/probestunde` | `/en/trial-class` |
| `/tanzkurse` | `/en/dance-classes` |
| `/tanzkurse/salsa` | `/en/dance-classes/salsa` |
| `/tanzkurse/level` | `/en/dance-classes/levels` |
| `/kursplan` | `/en/schedule` |
| `/preise` | `/en/prices` |
| `/privatstunden` | `/en/private-lessons` |
| `/danceflow-night` | `/en/danceflow-night` |
| `/studio` | `/en/studio` |
| `/anfragen` | `/en/enquiry` |
| `/faq` | `/en/faq` |
| `/kontakt` | `/en/contact` |

**B1-Position zu S-01:** Wenn nicht alle Seiten übersetzt werden, dann **nur der Kernpfad** — `/en`, `/en/trial-class`, `/en/dance-classes` (+3 Stile), `/en/schedule`, `/en/prices`, `/en/faq`, `/en/contact`. Also 10 Seiten, jede mit vollständigem Weg zur Anfrage. Eine halbe Sprachfassung mit Sackgassen ist schlechter als eine bewusst kleine (deckt sich mit Growth-Critic §6).

## B1.7 Was B1 kostet

| Kosten | Grösse | Beleg |
|---|---|---|
| Zusätzliche Redirects intern | **11 Pfade**: `/kursaufbau`, `/team`, `/fotos`, `/mehr/partys`, `/kontakt/standort-raumvermietung`, `/shows-animationen`, 4× `/events-workshops/*`, `/mehr` | Zählung gegen `routes.tsx:43-79`, geprüft mit `/tmp/b1b2.py` → `B1 Umzuege: 11` |
| Verlust | `/shows-animationen` als eigener Suchbegriff („tanzshow buchen basel", 04-seo-plan §2.2) verschwindet in `/anfragen` | **Risiko, siehe §5** |
| Neue Seiten | 3 (`/probestunde`, `/anfragen`, `/agb`) + optional Hochzeitstanz | — |
| Content-Arbeit | `/probestunde` und `/anfragen` sind echte neue Texte | — |

---

# ALTERNATIVE B2 — „Zwei Häuser"

**Leitidee:** Salsaflow betreibt in Wahrheit **zwei Geschäfte** unter einer Marke: eine **Schule** (Kurse, Level, Buchung, Privatstunden) und einen **Club** (Danceflow Night, Partys, Weekends, Shows). Die IA gibt das oben zu, statt es zu vermischen.

**Belege für die These:**
- Eigener Rhythmus, eigener Preis: Danceflow Night 1./3./5. Freitag, CHF 5 Mitglieder / 10 Gäste (01-firma-dossier §5.2–5.3).
- Eigene Event-Marken mit Datum: FLOWeekend 9.–10.10.2026, Anniversary Weekend (01-firma-dossier §5.2).
- Live zeigt die Vermischung als Schaden: 7 H1 auf der Startseite, darunter Sommerkurse, Danceflow Night, FLOWeekend und COLLABS gleichrangig (03-seo-audit L-02); Growth-Critic G-L2 nennt genau das „Event-Traffic und Kurs-Traffic vermischt".
- Die Galerie ist vollständig Party-Material aus 2023 (02-asset-inventar §3) — also existiert der Club-Teil auch als Bildwelt getrennt.

**Wette:** Zwei klare Türen konvertieren besser als eine Tür mit neun Beschriftungen. `BEWERTUNG`

## B2.1 Der Baum

```
/                                    Marken-Startseite: zwei Türen + Beweis
│
├─ /schule                        ★ HAUS 1 — Hub „Tanzen lernen"
│   ├─ /schule/salsa
│   ├─ /schule/bachata
│   ├─ /schule/heels
│   ├─ /schule/level                 ← heute /kursaufbau
│   ├─ /schule/probestunde        ★ NEU
│   ├─ /schule/preise
│   ├─ /schule/kursplan              ← heute /kursplan (Kaufort)
│   └─ /schule/privatstunden
│       └─ /schule/privatstunden/hochzeitstanz   ★ NEU, nur wenn belegt → S-05
│
├─ /club                          ★ HAUS 2 — Hub „Ausgehen & Community"
│   ├─ /club/danceflow-night
│   ├─ /club/partys-in-basel         ← heute /mehr/partys
│   ├─ /club/floweekend
│   ├─ /club/anniversary-weekend
│   └─ /club/kalender                ← heute /events-workshops/eventkalender
│
├─ /uns                           ★ HAUS 3 (klein) — Marke & Vertrauen
│   ├─ /uns/team
│   ├─ /uns/fotos
│   └─ /uns/studio                   ← Ort, Anfahrt, 1. Stock, ÖV
│
├─ /buchen-lassen                 ★ B2B: Shows, Animationen, Raummiete, Firmen
│
├─ /faq
├─ /kontakt
├─ /tanzschuhe                       ← aus /mehr herausgehoben (Ratgeber-Einstieg)
├─ /collabs                          ← Footer-only
├─ /agb                           ★ NEU, offen S-04
├─ /impressum · /datenschutz
├─ /buchung* · /admin                noindex, unverändert
└─ /en/…                             Spiegel, siehe §B2.6
```

Zählung: **28 indexierbare deutsche Seiten** (heute 26), plus englischer Spiegel. Geprüft mit `/tmp/count.py` → `B2 indexierbar: 28 | unique: 28`. Auch B2 spart keine Seiten — es kommen zwei Hub-Seiten (`/club`, `/uns`) und drei neue Seiten hinzu, während nur `/mehr` entfällt.

## B2.2 Navigation — vier Einträge, zwei davon sind Häuser

| Position | Label | Ziel | Kinder |
|---|---|---|---|
| 1 | **Schule** | `/schule` | Salsa · Bachata · Heels · Welches Level? · Kursplan · Preise · Privatstunden · Probestunde |
| 2 | **Club** | `/club` | Danceflow Night · Partys in Basel · FLOWeekend · Anniversary · Kalender |
| 3 | Uns | `/uns` | Team · Fotos · Studio & Anfahrt |
| 4 | Kontakt | `/kontakt` | FAQ · Shows & Miete anfragen |
| CTA | **Probestunde** | `/schule/probestunde` | Outline-Pill |

**Der Unterschied zu heute:** Die Top-Navigation stellt eine **Frage** („willst du lernen oder ausgehen?"), statt einen **Katalog** anzuzeigen. Ein Mensch, der Freitagabend etwas sucht, klickt Club und ist fertig. Eine Einsteigerin klickt Schule und sieht nur Kurs-Material.

## B2.3 Die Startseite in B2 — strukturell anders

Das ist der wichtigste Unterschied zu B1. `/` ist in B2 **keine Verkaufsseite mit neun Sektionen**, sondern eine **Weiche mit Beweis**:

| Reihenfolge | Sektion | Job | Bildrolle | Zustände |
|---|---|---|---|---|
| 1 | Hero: Marke + Ort + zwei Türen | J1/J5 sofort trennen | ein grosser echter Studio-/Paar-Crop aus `/photos/2026/` (02-asset-inventar §2: 1920–2100 px, „Primärquelle Hero") | — |
| 2 | Tür „Schule" | J1/J2/J3 | Kursbild | — |
| 3 | Tür „Club" | J5 | Party-Bild | Leerzustand: kein bestätigter Termin → „Rhythmus" statt Datum |
| 4 | Beweis-Band: Ort, Dauer, Preis, „ohne Partner", Probestunde | J3, AEO | keine | — |
| 5 | Team-Streifen | J6 | Cutout-Portraits aus `/photos/founders/` + `/photos/team/` | Portrait-Zuordnung bis P-03 neutral formuliert |
| 6 | Abschluss-CTA Probestunde | J1 | — | — |

**Sechs Sektionen statt der heutigen 15 Home-Bausteine.** Belegt: [`src/public/home/`](/root/clients/salsaflow-dc/src/public/home/) enthält 17 `.tsx`-Dateien, davon 15 Sektions-Bausteine (Hero, WhyGrid, Offer, CoursePath, PriceSignal, ScheduleTeaser, EventsTeaser, TeamBlock, Faq, CommunityBand, LocationBand, ProofLine, WallOfLove, Funnel, StickyCta) plus 2 Hilfsdateien (`kit.tsx`, `motion.tsx`) — Befehl: `ls src/public/home/*.tsx | wc -l` → 17. `BEWERTUNG`: Das ist der strukturelle Grund, warum der Vercel-Hero laut Growth-Critic G-V1 „leer" wirkt — die Startseite muss zu viele Jobs gleichzeitig erledigen, also gewinnt keiner den ersten Viewport.

**Wichtig zu WallOfLove:** Die Fläche existiert im Code ([`src/public/home/WallOfLove.tsx`](/root/clients/salsaflow-dc/src/public/home/WallOfLove.tsx)), aber es gibt **keinen belegten Review-Proof** (02b-asset-gaps P-02, ROT). In B2 ist sie in Sektion 4 als `PLACEHOLDER`-Slot vorgesehen und wird **erst nach schriftlicher Freigabe echter Zitate mit Vorname und Datum** gefüllt. Bis dahin bleibt sie leer oder entfällt. Keine Sterne, keine Zahlen, keine erfundenen Namen.

## B2.4 Warum jede Änderung — mit Job und Beleg

| Änderung | Löst | Begründung |
|---|---|---|
| **Zwei Hubs `/schule` und `/club`** | IA-2, IA-3, J5 vs. J1 | Die belegte Live-Krankheit ist Vermischung (03-seo-audit L-02: 7 H1; Growth-Critic G-L2). Zwei Hubs machen die Trennung zur Struktur, nicht zur Redaktionsdisziplin. |
| **`/kursplan` wird `/schule/kursplan`** | IA-4 | Der Kaufort liegt im selben Haus wie die Seiten, die dorthin führen. Breadcrumb: Startseite → Schule → Kursplan. Route-Klasse bleibt `app-public` — das ist eine technische Eigenschaft, kein IA-Argument. |
| **`/buchen-lassen` als B2B-Ort** | J7, IA-3 | Shows, Animationen und Raummiete sind alle „jemand bezahlt Salsaflow für einen Auftritt oder einen Raum". Der Name sagt den Job. Heute liegt Shows im Event-Dropdown, wo Partygäste suchen. |
| **`/uns` als kleines drittes Haus** | J6, IA-8 | Team, Fotos, Studio sind Vertrauensarbeit. Als Haus mit Hub können sie in beide Geschäfte zurückverlinken — das löst die Sackgassen. |
| **`/tanzschuhe` auf Top-Level (Footer/FAQ-verlinkt)** | IA-1 | Es ist ein echter Ratgeber-Einstieg („tanzschuhe salsa anfänger", 04-seo-plan §2.2). Unter „Mehr" findet ihn niemand; als eigene Adresse kann er Traffic holen und in `/schule` führen. |
| **`/mehr` verschwindet vollständig** | IA-1 | Jedes Kind hat jetzt ein echtes Zuhause: Partys → Club, Tanzschuhe → eigen, Collabs → Footer, FAQ → Top-Level. |
| **`/agb` als Adresse** | IA-9 | Wie B1. Offen S-04. |

## B2.5 CTA-Belegung

Der Vorteil von B2: **Das CTA-Modell folgt dem Haus**, also braucht der Nav-CTA weniger Sonderfälle als die drei Varianten in Growth-Critic §3.3.

| Haus | Primary-Job | Label | Nav-CTA |
|---|---|---|---|
| **Schule** | C1 oben, C2 nach dem Preis-/Level-Block | „Probestunde anfragen" / „Platz sichern" | Outline „Probestunde" |
| `/schule/privatstunden` | C3 | „Privatstunde anfragen" | Outline „Kontakt" (Override) |
| **Club** | C4 | „Nächster Termin" (nur echte Termine) | Outline „Probestunde" — hier legitim, weil Party-Gäste die häufigsten Kurs-Einsteiger sind `BEWERTUNG` |
| **Uns** | soft → C1 | „Probestunde anfragen" | Outline „Probestunde" |
| `/buchen-lassen` | C5 | „Anfrage senden" | Outline „Kontakt" (Override) |
| `/kontakt`, `/faq` | C5 + C1 | WhatsApp/Telefon soft; FAQ-Ende Probestunde | — |

Gleiche Label-Sperre wie B1: kein „gratis" bis S-02.

## B2.6 Englisch

| Deutsch | Englisch |
|---|---|
| `/` | `/en` |
| `/schule` | `/en/school` |
| `/schule/salsa` | `/en/school/salsa` |
| `/schule/level` | `/en/school/levels` |
| `/schule/probestunde` | `/en/school/trial-class` |
| `/schule/kursplan` | `/en/school/schedule` |
| `/schule/preise` | `/en/school/prices` |
| `/schule/privatstunden` | `/en/school/private-lessons` |
| `/club` | `/en/club` |
| `/club/danceflow-night` | `/en/club/danceflow-night` |
| `/club/partys-in-basel` | `/en/club/dance-parties-basel` |
| `/uns` | `/en/about` |
| `/buchen-lassen` | `/en/book-us` |
| `/faq` · `/kontakt` | `/en/faq` · `/en/contact` |

**B2-Position zu S-01:** B2 macht die Teil-Übersetzung leicht sauber lösbar — man übersetzt **das Haus Schule vollständig** und lässt Club deutsch (Community ist ohnehin lokal). Das ist eine ehrliche, begründbare Grenze statt willkürlicher Seitenauswahl. `BEWERTUNG`

## B2.7 Was B2 kostet

| Kosten | Grösse | Beleg |
|---|---|---|
| Redirects intern | **21 Pfade** — praktisch jede Unterseite bekommt eine neue Adresse | Zählung gegen `routes.tsx:43-79`, geprüft mit `/tmp/b1b2.py` → `B2 Umzuege: 21` |
| Risiko | Zwei Hubs müssen inhaltlich **tragen**. Ein leerer `/club`-Hub ohne bestätigte Termine wirkt toter als heute. | 02b-asset-gaps P-08: Galerie komplett 2023; `src/lib/seo-schema.ts:107` hält Event-Liste bewusst leer |
| Neue Seiten | 4 (`/schule/probestunde`, `/club` Hub, `/buchen-lassen`, `/agb`) + `/uns` Hub |  |
| Startseiten-Umbau | Von 14 Home-Bausteinen auf 6 Sektionen — grösster Einzelposten | `src/public/home/` Dateiliste |

---

## 3. B1 gegen B2 gegen Ist — Vergleichstabelle

| Kriterium | Ist (26 Routen) | **B1 „Ein Weg"** | **B2 „Zwei Häuser"** |
|---|---|---|---|
| Top-Nav-Einträge | 6 + CTA | **5 + CTA** | **4 + CTA** |
| Indexierbare DE-Seiten | 26 | 27 | 28 |
| Klicks bis Probestunde | 1 (Nav-Anker, keine eigene Seite) | **1** (eigene Seite) | **1** (eigene Seite) |
| Klicks bis Kursbuchung | 2 (Nav → Kursplan) | 2 | **2** (Nav → Schule → Kursplan = 2, Hub überspringbar) |
| Klicks bis Freitagabend-Info | 3 (Events → Dropdown → Night) | **1** (Top-Level) | **2** (Club → Night) |
| „Mehr"-Restekiste | ja (IA-1) | **weg** | **weg** |
| Event-Präfix-Bruch (IA-2) | ja | **weg** | **weg** |
| Shows bei Partygästen (IA-3) | ja | **weg** (`/anfragen`) | **weg** (`/buchen-lassen`) |
| Kaufort im richtigen Haus (IA-4) | nein | teilweise | **ja** |
| Vertrauensseiten mit Weiterweg (IA-8) | nein | **ja** (`/studio`) | **ja** (`/uns`) |
| AGB-Adresse (IA-9) | nein | **ja** (S-04) | **ja** (S-04) |
| Level-Frage sichtbar (IA-7) | 6. Dropdown-Position | **Kind von /tanzkurse** | **Kind von /schule** |
| Interne Redirects nötig | — | **11** | **21** |
| Startseiten-Umbau nötig | — | mittel | **gross** |
| Risiko „leerer Hub" | — | klein | **mittel** (Club braucht echte Termine) |
| Teil-Englisch sauber begrenzbar | nein | Kernpfad (10 Seiten) | **ja, ganzes Haus Schule** |
| Bruch mit IS-1…IS-6 | — | **keiner** | **keiner** |

---

## 4. Prüfung gegen die Frozen Rules

| Regel | Quelle | B1 | B2 |
|---|---|---|---|
| Keine neuen Farben; salsa `#ad1827` einzige Akzentfarbe | DESIGN.md `colors` | eingehalten — IA vergibt keine Farben | eingehalten |
| Display Cal Sans, Body Afacad; Ban-Liste (Inter, Poppins …) | DESIGN.md `typography` | eingehalten | eingehalten |
| `rounded-full` für Buttons | DESIGN.md `Shapes` | eingehalten (CTA-Bauform unverändert) | eingehalten |
| Eine Motion-Signatur `[data-reveal]`, Reduced-Motion sofort sichtbar | DESIGN.md `Motion` | eingehalten — keine neuen Motion-Muster | eingehalten |
| Max ein Primary pro Sektion | DESIGN.md `Components` | §B1.5 hält es | §B2.5 hält es |
| Warm, familiär, Community, **Du** | DESIGN.md `Brand & Style` | alle Labels duzen | alle Labels duzen |
| Voller Text im HTML für öffentliche Routen; App-Routen `noindex` | DESIGN.md `Guardrails` | `/buchung*`, `/admin` unverändert noindex | unverändert |
| Ein Fokuspunkt pro Screen | DESIGN.md `Layout` | Ziel von B1 | Ziel von B2, §B2.3 |
| Kein Bild doppelt auf einer Seite, sitewide max 2× | DESIGN.md `Imagery` | IA-neutral; Bildrollen in §B2.3 respektieren es | dito |
| Buchung erst `confirmed` bei verifiziertem Stripe-Webhook `succeeded` | ARCHITEKTUR.md §6 („Harte Regel") | **nicht berührt** — B1/B2 ändern keinen Status | nicht berührt |
| `pending_payment` reserviert bis `payment_deadline` (Default 30 Min), dann `expired` | ARCHITEKTUR.md §5.2 | nicht berührt | nicht berührt |
| Rolle voll → `waitlisted` mit `waitlist_position` je Kurs+Rolle | ARCHITEKTUR.md §5.3 | Kursplan-CTA zeigt Warteliste statt „Jetzt buchen" | dito |
| Paar-Buchung nur wenn in **beiden** Rollen frei | ARCHITEKTUR.md §5.3 | nicht berührt | nicht berührt |
| Stripe Checkout (gehostet), TWINT + Karte; Idempotenz über `payment_events` | ARCHITEKTUR.md §7.3 | nicht berührt | nicht berührt |
| Öffentlich nur Kapazitätszahl ohne Personenbezug | ARCHITEKTUR.md Zeile 85 | eingehalten: Kursplan zeigt frei/belegt, keine Namen | eingehalten |
| Kein `aggregateRating`, keine `Review` ohne Quelle | 04-seo-plan §12 Nr. 2 | eingehalten; WallOfLove bleibt `PLACEHOLDER` | eingehalten, §B2.3 |
| Keine `Event`-Markierung mit erfundenem Datum | `src/lib/seo-schema.ts:107` | eingehalten; Club/Event-Seiten zeigen Rhythmus statt Datum, bis Termine bestätigt | eingehalten |
| Kein „gratis"-Claim bis Freigabe | 03-seo-audit R-10, S-02 | Label-Sperre in §B1.5 | §B2.5 |
| Live-Tippfehler-Slugs nicht übernehmen | 03-seo-audit L-11 | keiner übernommen | keiner |
| Ein Adressmuster, ohne Schrägstrich am Ende | 04-seo-plan §3.3 | eingehalten | eingehalten |

**Ergebnis:** Beide Alternativen sind mit den Frozen Rules vereinbar. Keine Alternative verlangt eine Änderung an DESIGN.md, DECISIONS.md oder ARCHITEKTUR.md.

---

## 5. Risiken, ehrlich

| # | Risiko | Betrifft | Grösse | Gegenmittel |
|---|---|---|---|---|
| RB-1 | **Jeder Umbau vergrössert die Redirect-Matrix.** Die 22 Live-Adressen (03-seo-audit §6) sind bereits das grösste Einzelrisiko des Projekts. B1 legt 11 interne Umzüge drauf, B2 legt 21 drauf. | B1, **B2** | B1 klein, **B2 mittel** | Interne Umzüge sind harmlos, weil die neuen Adressen noch keine Sichtbarkeit haben — sie sind nicht indexiert. Trotzdem: eine Tabelle, eine Stufe, 301, Prüfskript. Nie auf `/` abladen. |
| RB-2 | **`/club` kann leer wirken.** Ohne bestätigte Termine steht dort nur ein Rhythmus. | **B2** | mittel | Club-Hub braucht: belegten Rhythmus (1./3./5. Freitag), belegte Preise (CHF 5/10), Fotos. Fotos sind vorhanden, aber 2023 (02b-asset-gaps P-08) → Galerie nach Jahr gruppieren, 2026 zuerst. **Wenn kein einziger bestätigter Termin lieferbar ist, ist B2 riskant.** |
| RB-3 | **`/shows-animationen` verliert seinen eigenen Suchbegriff.** „tanzshow buchen basel" ist als P1 gemappt (04-seo-plan §2.2). In B1 wird daraus `/anfragen`, in B2 `/buchen-lassen`. | B1, B2 | mittel | Der Suchbegriff braucht eine eigene H1-Sektion mit Ankeradresse auf der Anfrage-Seite — oder die Shows-Seite bleibt eigenständig und verlinkt auf die Anfrage. **Empfehlung: eigenständig lassen, Anfrage-Seite als Ziel.** |
| RB-4 | **B2 baut Hierarchie-Tiefe.** `/schule/privatstunden/hochzeitstanz` ist Ebene 3. | **B2** | klein | Bleibt innerhalb „max 3 Klicks von der Startseite" (04-seo-plan §5 Regel 6), weil die Navigation direkt dorthin springt. |
| RB-5 | **Zwei Hubs verdoppeln Pflegeaufwand.** Zwei Hub-Seiten, die aktuell bleiben müssen. | **B2** | klein bis mittel | Nur bauen, wenn ein Kuratierungs-Rhythmus zugesagt ist (02b-asset-gaps P-08 fordert das ohnehin). |
| RB-6 | **B1 macht die Startseite nicht automatisch besser.** Der belegte Above-the-fold-Schaden (Growth-Critic G-V1) ist ein Hero-/Asset-Problem, kein Baum-Problem. | **B1** | mittel | B1 muss die Hero-Reparatur (echtes Bild aus `/photos/2026/`, Kontrast ink, ein Primary) als eigenes Paket mitführen. IA allein löst es nicht. |
| RB-7 | **Neue Seiten brauchen echten Inhalt.** `/probestunde` und `/anfragen` bzw. `/buchen-lassen` sind leer, bis jemand sie schreibt. | B1, B2 | mittel | Als Content-Pakete im Backlog führen, nicht als „Route anlegen". |
| RB-8 | **`/probestunde` ist ein Claim-Risiko-Ort.** Genau dort will man „gratis" schreiben. | B1, B2 | mittel | Bis S-02: „Probestunde anfragen", „unverbindlich". Belegt ist nur, dass eine Probestunde jederzeit möglich ist (01-firma-dossier §5.4), **nicht** dass sie kostenlos ist. |
| RB-9 | **Hochzeitstanz-Seite ohne belegtes Angebot.** | B1, B2 | klein | Nur bauen, wenn S-05 bestätigt ist. Sonst ein Abschnitt auf der Privatstunden-Seite. Kein Stock-Hochzeitspaar (02b-asset-gaps P-06). |
| RB-10 | **Zwei/drei-Studios-Widerspruch trifft jede Standort-Seite.** Live nennt zwei Studios, Repo-Beschreibungen nennen drei. | B1 (`/studio`), B2 (`/uns/studio`) | mittel | Blockiert die Standort-Seite inhaltlich bis S-03 geklärt ist. Zahl bis dahin weglassen, nicht raten. |

---

## 6. Empfehlung

**Empfehlung: B1 „Ein Weg" umsetzen, den Club-Gedanken aus B2 als Sektion mitnehmen.**

Begründung, in der Reihenfolge des Gewichts:

1. **Das belegte Hauptproblem ist Conversion im ersten Viewport, nicht Auffindbarkeit.** Der Repo-Stand gewinnt gegen Live in fast jedem technischen Punkt (03-seo-audit §5: 9 von 11 Prüfpunkten). Die harten Befunde sind G-V1 (leerer Hero), G-V3 (schwacher Privat-CTA), G-V4 (low-res Privat-Asset), R-05 (keine Fliesstext-Links). Das sind **Pfad- und Asset-Probleme**, und B1 greift genau dort an.
2. **B1 kostet 11 interne Umzüge, B2 kostet 21.** Bei einem Projekt, dessen grösstes Einzelrisiko laut Audit die Redirect-Vollständigkeit ist, ist die kleinere Matrix ein echter Wert.
3. **B2 hängt an einer Zusage, die heute nicht belegt ist.** Ein `/club`-Haus braucht laufend bestätigte Termine. Die Event-Liste im Code ist bewusst leer (`src/lib/seo-schema.ts:107`), die Galerie ist 2023 (02-asset-inventar §3). Ohne Kuratierungs-Zusage baut B2 ein leeres Zimmer.
4. **B1 löst IA-1, IA-2, IA-3, IA-7, IA-8, IA-9 vollständig** und IA-5 strukturell. Nur IA-4 (Kaufort-Haus) bleibt offen — und das ist eine technische Route-Klasse, kein Nutzerproblem.
5. **`/danceflow-night` auf Top-Level ist der billigste Community-Gewinn:** 1 Klick statt 3, ohne ein zweites Haus zu bauen.

**Was aus B2 mitkommt (ausdrücklich):**
- Die **6-Sektionen-Startseite** aus §B2.3 statt 15 Home-Bausteinen. Das ist der stärkste Einzelgedanke in diesem Dokument und unabhängig vom Baum umsetzbar.
- Die **`/buchen-lassen`-Benennung** ist besser als `/anfragen`, weil sie den Job nennt. Vorschlag: B1 nutzt `/buchen-lassen`.
- Die **Teil-Englisch-Grenze nach Haus** — falls S-01 auf „schlank" fällt, ist „alles was zum Kurs führt" die ehrliche Grenze.

**Wann B2 stattdessen gewinnt:** Wenn Salsaflow zusagt, den Eventkalender zu pflegen und pro Danceflow Night 10–15 Bilder zu liefern (02b-asset-gaps P-08). Dann ist der Club ein echtes Geschäft mit eigener Bildwelt, und die Zwei-Türen-IA ist die stärkere Antwort. **Diese Zusage ist eine Kundenentscheidung, nicht meine.**

---

## 7. Kursplan- und Buchungslogik in der IA (fachlich, kein Code)

Beide Alternativen berühren die Buchungsmechanik **nicht**. Sie legen nur fest, **wo** sie sichtbar wird. Zur Klarheit gegen die Frozen Rules ([ARCHITEKTUR.md](/root/clients/salsaflow-dc/ARCHITEKTUR.md) §5–§7):

| Ort in der IA | Was der Mensch sieht | Was dahinter gilt |
|---|---|---|
| Stil-Seite / Level-Seite | Kursarten, Dauer 8×60, Rollenprinzip Leader/Follower, „ohne Partner möglich" | `booking_type = 'leader_follower'` bei Salsa/Bachata, `'open'` bei Heels (§5.1) |
| Kursplan | Termine, Stil, Level, Tag, **frei / knapp / voll je Rolle** — als Zahl, ohne Namen | freie Plätze = `capacity_<rolle> − (bestätigte + laufende pending)` (§5.2); öffentlich nur Kapazitätszahl ohne Personenbezug (Zeile 85) |
| Kursplan, Zustand „voll" | CTA wird **„Auf die Warteliste"**, nicht „Jetzt buchen" | Rolle voll → `waitlisted` mit `waitlist_position` je Kurs+Rolle (§5.3) |
| Kursplan, Modus Paar | Paar nur wählbar, wenn **beide** Rollen frei; sonst Paar-Warteliste | §5.3 letzter Absatz |
| Kursplan, laufende Staffel | „Quereinstieg möglich" nur wenn erlaubt | `courses.allows_late_entry` (§5.5) |
| `/buchung` (noindex) | Reservierung mit Frist, dann Stripe Checkout | `pending_payment` blockiert bis `payment_deadline`, Default 30 Min, dann `expired` (§5.2) |
| Rückkehr `/buchung/erfolg` | „Zahlung erhalten, Bestätigung kommt per Mail" — **nicht** „Buchung bestätigt", solange der Webhook nicht durch ist | Harte Regel §6: `confirmed` nur bei verifiziertem Webhook mit `succeeded`, nicht per Browser-Redirect |
| Probestunde-Seite | Anfrage-Formular, **kein** Checkout | Probestunde ist laut Live-FAQ jederzeit möglich (01-firma-dossier §5.4); Preisstatus offen (S-02) |
| Privatstunden | Anfrage, kein Self-Checkout-Zwang | Growth-Critic §3.4 C3 |

**Zustands-Pflicht pro buchungsnaher Fläche** (DESIGN.md `State-Coverage`): loading, empty (keine Kurse in dieser Staffel), error (Kapazitätsprüfung fehlgeschlagen), success, disabled/submitting, voll/Warteliste, Frist abgelaufen. Als Anforderung notiert — Umsetzung ist Implementierungswelle.

---

## 8. Was ich nicht entscheiden darf

Diese Punkte blockieren Teile beider Entwürfe. Sie gehören zu den bereits geführten offenen Fragen und werden hier nur mit ihrer IA-Wirkung benannt.

| Bezug | Frage | IA-Wirkung |
|---|---|---|
| S-01 | Englisch vollständig oder schlank? | Entscheidet über 13 vs. 25 englische Adressen |
| S-02 | Ist die erste Probestunde kostenlos? | Entscheidet über Label und H1 auf `/probestunde` |
| S-03 | Zwei oder drei Studios? Wirklich ~40 Kurse/Woche? | Blockiert Standort-Seite (`/studio`, `/uns/studio`) |
| S-04 | Eigene AGB-Seite oder Teil des Impressums? | Entscheidet, ob `/agb` existiert |
| S-05 | Wird Hochzeitstanz aktiv angeboten? | Entscheidet über eigene Seite vs. Abschnitt |
| P-01 (02b) | Privatstunden-Shooting oder Zwischenlösung? | Privatstunden-Seite braucht ein glaubwürdiges Motiv; heute zeigt sie 4 Crops desselben ungeeigneten Motivs |
| P-02 (02b) | Welche Google-Reviews dürfen wörtlich zitiert werden? | Entscheidet, ob die Proof-Fläche existiert oder entfällt |
| P-08 (02b) | Wird die Galerie kuratiert (10–15 Bilder pro Night)? | **Entscheidet B1 gegen B2** — siehe §6 |
| — | Soll `/shows-animationen` eigenständig bleiben? | RB-3; meine Empfehlung: ja, eigenständig, mit `/buchen-lassen` als Ziel |
| — | Wird `/kursplan` zu `/schule/kursplan`? | Nur relevant, wenn B2 gewählt wird |

---

## 9. Selbstprüfung dieser Datei

| Check | Ergebnis |
|---|---|
| Zwei vollständige, strukturell verschiedene Alternativen | ja — B1 Funnel-IA (27 Seiten, 5 Nav), B2 Publikums-IA (28 Seiten, 4 Nav) |
| Eigene Zahlen nachgerechnet statt geschätzt | ja — erste Fassung nannte 22/25 Seiten und 8/16 Redirects; nachgezählt sind es 27/28 und 11/21. Korrigiert, Zählskripte `/tmp/b1b2.py` + `/tmp/count.py` |
| Ist-Zustand gemessen, nicht behauptet | ja — `src/routes.tsx:43-79`, `SiteHeader.tsx:98-136`, `src/public/home/` |
| Jede Änderung mit Job + Beleg begründet | ja — §B1.3, §B2.4 |
| Gegen DESIGN.md geprüft | ja — §4, alle Zeilen eingehalten |
| Gegen ARCHITEKTUR.md geprüft (Booking/Payment) | ja — §4 + §7; kein Statuswechsel, keine Payment-Logik verändert |
| Erfundene Reviews / Sterne / Rankings / Zertifikate / Kundenstimmen | **keine** — Proof-Fläche bleibt `PLACEHOLDER` (§B2.3) |
| Ungeprüfte Claims als Fakt verwendet | keine — „gratis" gesperrt (RB-8), Studio-Zahl gesperrt (RB-10) |
| Empfehlung abgegeben statt Auswahl vermieden | ja — §6, B1 mit zwei Übernahmen aus B2 |
| Risiken der eigenen Empfehlung genannt | ja — RB-1, RB-3, RB-6, RB-7 betreffen B1 |
| Production-Code geändert | **nein** — nur diese Datei geschrieben |
| Selbstbenotung als „passing" | **nein** — dieser Entwurf ist untrusted bis zur Prüfung durch eine andere Modellfamilie |

**Ende `05-ia-entwurf-b.md`.**
