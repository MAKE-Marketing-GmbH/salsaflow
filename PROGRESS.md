# PROGRESS — Salsaflow DC

**Stand:** 2026-08-13 (Reservierungs-Runde, Production `a5d2f40`)
**Session:** Buchung real gemacht, Formular gekuerzt, Bilder und Motion gefixt
**Handoff-ready:** ja

## ERLEDIGT

### Reservierung laeuft (der Kern dieser Runde)

Die Buchung war live tot: Vercel fuhr nur eine Stub-API, jeder Aufruf gab 503.
Der Funnel war aber nie ein Kauf, sondern eine Reservierung. Also braucht er
keine Datenbank, sondern eine Mail.

- `server/reservation-routes.ts` neu: ohne DB, ohne Preis, ohne Stripe.
  Verfuegbarkeit aus `db/seed/public-schedule.json`, Reservierung als Mail.
  Voller Kurs wird zur Warteliste. Honeypot wie im Kontaktformular.
- `BookingPanel`: Tarif-Auswahl, Preisanzeige und Platzzahlen raus.
- Erfolgstexte sagen die Wahrheit: das Studio bestaetigt, es kommt keine
  automatische Bestaetigungsmail.
- **Live verifiziert:** `POST /api/public/reservations` → HTTP 200,
  `{"ok":true,"status":"reserved"}`. Neun Faelle lokal geprueft.

### Ohne JavaScript keine leeren Seiten mehr

Reveal-Animationen schrieben `opacity:0` ins ausgelieferte HTML — 47 Mal auf der
Startseite, darunter die H1. `useHydrated()` in `home/motion.tsx` loest das:
Server rendert den Endzustand, die Animation zuendet nach der Hydration.
**Live verifiziert:** 0 Treffer auf allen geprueften Seiten.

### Bilder

- Galerie `/fotos`: `galleryTileAspect` entfernt. Bilder laufen im eigenen
  Format im Masonry-Raster, kein Zuschnitt. Alle 88 Eintraege tragen jetzt echte
  Masse (vorher 13).
- Kursplan-Band mobil: `object-[center_25%]` (ganze Kopfreihe fehlte).
- Bachata-Karte auf `/tanzkurse`: `object-[center_25%]` (Oberkopf beider fehlte).
- Partys-Band: `center 25%` statt 38 %.
- Jeder Crop am gerenderten Ausschnitt geprueft, nicht geschaetzt.

### Formular

Kontakt-Wizard von vier auf drei Schritte, Pruef-Schritt raus. Dazu sechs Fehler:
Reset mitten im Ausfuellen, Enter sprang weiter, Honeypot ohne relativen Anker,
unsichtbarer Fokus bei den Auswahlkarten, zwei Fehlermeldungen gleichzeitig,
haengender Sendefehler beim zweiten Versuch.

### CTA-Ziele

- Sechs Ticket-Knoepfe zeigten auf `eventfrog.ch` (302 auf die Fremd-Startseite).
  Fallback jetzt `/kontakt#events`. `VITE_EVENTFROG_URL` schaltet wieder um.
- Acht „Privatstunde anfragen" zeigten auf `#schnupperstunde` → `#privatstunden`.
- 15 Show-Anfragen auf `/shows-animationen` → `#animationen`.
- `#privatstunden` fehlte ganz in `TOPIC_HASHES`.

### Motion

Drei Dauer-Tokens (`--dur-fast/base/slow`) statt fuenf zufaelliger Werte.
Zehn Navigations- und Fusszeilen-Links hatten Hover ohne Uebergang. 52 Pfeile
liefen auf Tailwinds 150ms-Notnagel. Zwei `transition-all` ersetzt. Akkordeon-
Weichzeichner raus. Die beiden Primaerknoepfe dunkeln jetzt beide beim Hover
(einer hellte vorher auf).

### Kursplan steht im HTML (zweite Runde)

Der Kursplan existierte fuer Suchmaschinen nicht: Die Komponenten holten ihre Daten
erst im Browser, das Prerendering fror den Ladezustand ein. Im HTML von `/kursplan`
stand woertlich "Kursplan wird geladen", keine einzige Kurszeit. Das verstiess gegen
`DESIGN.md:113` ("Voller Text im HTML für öffentliche Routen").

`scripts/prerender.mjs` liest jetzt denselben Seed wie die API und legt ihn als
Datenblock in die Seite. `embeddedSchedule()` in `src/lib/schedule.ts` ist der
Startwert der Komponenten; der Netz-Aufruf ueberschreibt ihn danach.

**Live gemessen:** 76 Kurszeiten auf `/kursplan`, 42 auf `/`, 38 auf `/tanzkurse`.
Vorher jeweils null. Kein Ladezustand mehr im HTML. Hero zeigt "37 Kurse pro Woche".

Nebeneffekt: Faellt der Netz-Aufruf aus, bleibt der eingebettete Plan stehen statt
einer Fehlermeldung. Er ist hoechstens einen Deploy alt.

### Weitere Bild-Fixes (zweite Runde)

- Anniversary-Galerie: `hp-14` fehlte dem stehenden Mann der Kopf ganz, `event-07`
  beiden die Stirn. Position pro Motiv gesetzt.
- Bachata-Band `/tanzkurse/bachata`: lief waagrecht durch beide Gesichter.
  `lg:h-[18rem]` plus `center 10%` loesen es zusammen.
- Fehlalarm geprueft und verworfen: der gemeldete Danceflow-Crop ist sauber.

### Sicherheit (dritte Runde)

Ein adversarialer Test hat vier Luecken gefunden, alle geschlossen:

- **Header-Injection.** Ein CRLF im Vornamen erzeugte eine echte `Bcc:`-Zeile in der
  Mail — verifiziert im Outbox-Pfad. Live hielt bisher nur der Mailanbieter dagegen.
  Zwei Ebenen: `headerSafe()` in `server/mail.ts` saeubert `to`, `subject`, `replyTo`
  fuer jede Mail; beide Schemas weisen Umbrueche in Namen und Telefon ab.
- **Kein Rate-Limit.** `server/rate-limit.ts`: fuenf Anfragen je zehn Minuten und IP,
  auf Kontakt und Reservierung. Im Speicher (keine DB) — stoppt den realen Fall,
  nicht einen verteilten Angriff. Ein echtes Limit gehoert an den Rand.
- **Server lockerer als das Formular.** Nachname und E-Mail waren serverseitig
  optional; per curl kam eine unbrauchbare Reservierung durch. Server zieht nach.
- **Fehler-Leak.** Die rohe Antwort des Mailanbieters ging an den Client.

**Live geprueft:** CRLF 400, fehlender Nachname 400, gueltige Reservierung 200,
sechste Anfrage derselben IP 429.

### Motion (dritte Runde)

18 harte Dauern in 12 Dateien auf die Tokens gezogen — danach null Ausreisser.
27 Links hatten eine `hover:`-Farbe ohne Uebergang und sprangen hart um; alle
tragen jetzt `.t-hover`.

### Nebenbei

`scripts/prerender.mjs` bekommt einen eigenen Vite-Cache — der geteilte Ordner
kann einem anderen Benutzer gehoeren, dann brach der Build mit EACCES.
`/buchung` trug den Titel der Rueckkehr-Seite; eigener `seoKey`, und die leeren
Huellen ziehen ihre Titel jetzt aus `SEO_META` statt aus einer Kopie im Skript.

## OFFEN

| Thema | Stand |
|---|---|
| Echter Eventfrog-Link | Fehlt. `VITE_EVENTFROG_URL` setzen, dann geht der Ticket-Knopf wieder nach draussen. Owner: Fabio. |
| DNS Cutover Jimdo→Vercel | Offen. `www.salsaflow-dc.com` laeuft noch auf Jimdo, darum zeigen die Canonicals ins Leere. |
| Preview crawlbar | `salsaflow-dc.vercel.app` erlaubt Indexierung. Vor dem Cutover auf noindex setzen. |
| EN ohne `/en` und hreflang | Bewusst offen. |
| `framer-motion` → `motion/react` | Bewusst offen. |
| Rate-Limit am Rand | Teilweise. Im Speicher gefixt (5/10 Min je IP). Ein verteilter Angriff umgeht das — eine Vercel-WAF-Regel waere die saubere Loesung. |
| Anfaenger-Marker im Kursplan | Vorschlag, braucht Entscheidung: Soll ein Kurs pro Tag als "gut fuer den Einstieg" markiert werden, statt alle ins Formular zu schicken? |
| Mobbin-MCP | Nicht aktivierbar: `/root/.claude.json` gehoert einem anderen Benutzer. `raphael-mcp-ondemand.sh enable mobbin` muss Raphael selbst ausfuehren, danach neue Session. |

## Gates

| Gate | Status |
|---|---|
| G-IA | ENTSCHIEDEN — Kunden-Baseline |
| G-DESIGN | ENTSCHIEDEN — A Warme Bühne |
| Reservierung live | PASS (HTTP 200, echte Mail) |
| Kein `opacity:0` im HTML | PASS (0 auf allen geprueften Seiten) |
| Live-Sweep `/kontakt` + `/floweekend` | PASS — Folds selbst gelesen, Desktop und Mobil. Wizard zeigt drei Schritte, Floweekend-Band mit allen Koepfen. Ablage `/tmp/salsaflow-live-r6`, `/tmp/sf-wiz3`. |
| Kursplan im HTML (`DESIGN.md:113`) | PASS — 76 Zeiten auf `/kursplan`, 42 auf `/`, 38 auf `/tanzkurse`. Vorher null. |
| Header-Injection | PASS — CRLF in Namen wird abgewiesen, `sendMail` saeubert zusaetzlich. |
| Rate-Limit auf Mail-Routen | PASS — sechste Anfrage derselben IP gibt 429. |
| Keine harten Motion-Dauern | PASS — null Treffer fuer `duration-150/200/300/500/700`. |
| Production | Live |
| DNS Cutover | offen (Owner) |

## Hosting-Fakt

- Wahrheit: [`/root/clients/salsaflow`](/root/clients/salsaflow) auf `main`.
- GitHub: `MAKE-Marketing-GmbH/salsaflow`. Push auf `main` = Vercel-Deploy.
- Live: [salsaflow-dc.vercel.app](https://salsaflow-dc.vercel.app/)
- Apex/www: noch Jimdo/Cloudflare.

## Fallen

- CWD faellt auf `/root/clients/salsaflow-dc`. Immer `cd /root/clients/salsaflow`.
- Zwei Ordner unter `.git/objects/` (`ee`, `78`) gehoeren root. Ein Blob mit
  passendem Hash-Praefix laesst sich nicht schreiben. Dann die Datei minimal
  aendern, damit ein anderer Hash entsteht.
- GitHub lehnte Pushes zeitweise mit „Internal Server Error" ab. Wiederholen hilft.
- Nie `git add -A`. Dateien einzeln vormerken.
- Nie Ad-hoc-Playwright. Nur `shot-sweep.mjs`.
- `shot-sweep.mjs` faehrt mit `reducedMotion: reduce`. Hover-Unterstriche stehen
  darum im Screenshot dauerhaft — das ist der Endzustand, kein Fehler.

## Naechster Schritt

Alle Gates dieser Runde sind gruen. Der naechste sinnvolle Schritt ist eine
Entscheidung, kein Code:

1. **Eventfrog-Link von Fabio holen** und `VITE_EVENTFROG_URL` setzen. Bis dahin
   fuehrt der Ticket-Knopf ins eigene Formular — funktioniert, ist aber nicht das Ziel.
2. **DNS-Cutover planen.** Vorher die Preview auf noindex setzen, sonst
   konkurrieren zwei Staende in der Suche.

Wenn stattdessen weiter geprueft werden soll, die noch nicht selbst gelesenen Seiten:

```
node /root/raphael-skills/skills/eigene/web/scripts/shot-sweep.mjs \
  --base https://salsaflow-dc.vercel.app --out /tmp/sf-next \
  --routes /kursaufbau,/mehr/tanzschuhe,/mehr/collabs,/faq --static --mobile
```
