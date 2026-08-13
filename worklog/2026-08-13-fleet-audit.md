# Fleet-Audit 13.08.2026 — Fix-Liste

Quelle: 22 bestaetigte Funde, alle Belege hier nochmal am Working Tree und live nachgeprueft.
Live-Site: https://salsaflow-dc.vercel.app
Stand Working Tree: viele Dateien modifiziert (`git status` nicht sauber), letzter Commit `25a6cbb`.

**Lies zuerst den Abschnitt "Abweichungen".** Drei Zeilenangaben aus den Funden stimmen nicht mehr.

---

## Top 5: groesster sichtbarer Effekt fuer einen Besucher

| # | Fix | Warum | Aufwand |
|---|---|---|---|
| 1 | Ticket-Links zeigen auf `eventfrog.ch` statt auf Salsaflow-Tickets | Alle 6 Ticket-Buttons auf /events fuehren ins Leere. Kein Kauf moeglich. | GROESSER (Kunden-Input) |
| 2 | Ohne JavaScript ist die Seite leer | Hero, H1 und Haupt-CTA sind unsichtbar. 47x `opacity:0` im Live-HTML. | SOFORT |
| 3 | Canonicals zeigen auf die alte Jimdo-Domain | 23 von 26 Zielen sind 404. Google kann die neue Seite verwerfen. | GROESSER (DNS) |
| 4 | Team-Portraits sind oben abgeschnitten | 7 Koepfe geschnitten auf /fotos, dazu Anina auf /team und zwei Hero-Baender. | SOFORT |
| 5 | /privatstunden und /shows-animationen fuehren ins falsche Formular | 8 + 15 CTAs oeffnen das Schnupperstunden-Formular. Falsche Anfrage kommt an. | SOFORT |

---

## Abweichungen zu den gemeldeten Funden

Diese Punkte weichen vom Audit ab. Nicht blind uebernehmen.

1. **BookingPanel: nur 2 Fundstellen, nicht 3.** Die Zeilennummern 854/907/1116 stimmen nicht.
   Im Working Tree gibt es genau zwei: Zeile **830** (textarea) und Zeile **1039** (const input).
   Ein `<select name="tariff">` existiert nicht mehr — `grep -n '<select' src/public/BookingPanel.tsx` = kein Treffer.
   `grep -c 'focus:ring' src/public/BookingPanel.tsx` = 0. Der Befund selbst bleibt richtig.

2. **Fund "Galerie koepft 8 von 10": es sind 7 von 9.** Claudia ist nicht betroffen.
   Der Kern stimmt trotzdem: globales `object-[center_30%]` koepft die Hochformat-Freisteller.

3. **Fund "26 von 26 Canonicals sind 404": es sind 23 von 26.**
   `/`, `/events` und `/kontakt` geben 200 — aber mit fremdem Jimdo-Inhalt. Das ist schlimmer, nicht besser.

4. **Fund "/events Anniversary ohne Programm" ist teilweise falsch.**
   Anniversary hat eine Highlight-Liste. Der echte Defekt ist die fehlende interne Verlinkung.
   Erfinde keine Termine — `anniversary-content.ts:8-10` verbietet das ausdruecklich.

5. **Fund "Code-Splitting" — vorgeschlagener Fix zerstoert das Prerendering.**
   `src/entry-server.tsx` nutzt `renderToString`. Das kann nicht suspendieren.
   Lazy-Routen in `<Suspense>` wuerden auf 26 SEO-Seiten einen Spinner statt Inhalt ausliefern.

---

## Paket A — Bilder und Crops

### A1. Team-Freisteller in der Galerie werden geköpft — SOFORT
**Datei:** `src/public/PhotosPage.tsx:124`
**Beleg:** Globale Klasse `object-cover object-[center_30%]` auf jedem Galerie-Bild.
Die Quellen sind 1000x1414-Hochformat. Die Kachel-Ratios kommen aus `galleryTileAspect` (PhotosPage.tsx:273-279): 4/5, 3/2, square, 5/4.
Bei 3/2, square und 5/4 beginnt das Fenster unter dem Scheitel.

**Fix, drei Schritte.**

1. Typ erweitern in `src/public/gallery/content.ts:121`:
```ts
export type GalleryPhoto = { albumId: AlbumId; src: string; alt: string; altEn?: string; width?: number; height?: number; pos?: string };
```

2. Bei diesen 9 Zeilen jeweils `, pos: 'object-[center_8%]'` ergaenzen (verifizierte Zeilennummern):
`137` fabio · `143` claudia · `149` sebastian · `155` vanessa · `161` teacher-aleksandra · `167` teacher-anina · `173` teacher-jelena · `179` teacher-maarten · `185` teacher-tobias

Auch Aleksandra und Tobias eintragen. Ihre Ratio haengt an `index % 9` und verschiebt sich beim naechsten Listen-Edit.

3. In `src/public/PhotosPage.tsx` den Typ `Photo` (Zeile 24) um `pos?: string` erweitern und in der `useMemo`-Map (Zeile 40) durchreichen. Dann Zeile 124:
```tsx
className={cn('h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-out group-hover:scale-[1.04]', p.pos ?? 'object-[center_30%]')}
```

**Achtung Tailwind:** `object-[center_8%]` muss als vollstaendiges String-Literal in `content.ts` stehen.
Dynamisch zusammengebaut purged Tailwind die Klasse und die Kachel faellt still auf 50%/50% zurueck.

**Pruefung:** Filter "Team" oeffnen. Ueber jedem Scheitel muss Hintergrund stehen.
Dazu `grep 'object-position:center 8%' dist/assets/*.css` — fehlt die Regel, hat Tailwind gepurged.

---

### A2. /mehr/partys Hero: Mann im Hintergrund wird enthauptet — SOFORT
**Datei:** `src/public/PartysPage.tsx:44`
**Beleg:** Zeile lautet `media={{ src: c.hero.image.src, alt: c.hero.image.alt, position: 'center 38%' }}`.
Bild `party-31-v3.webp` ist 2048x1360. Band nutzt den HeroFrame-Default `h-[16rem] sm:h-[22rem] lg:h-[30rem]`.
Bei 1440px zeigt das Fenster nur Bild-y 18.9%..69.1%. Der Kopf liegt bei y 7%..20%.

**Fix:** `position: 'center 38%'` → `position: 'center 12%'`

Ein Wert, eine Zeile. Gerendert geprueft: Kopf vollstaendig, Taenzerin bleibt im Bild.

---

### A3. Anina auf /team: Scheitel klebt am Kachelrand — SOFORT
**Datei:** `src/public/TeamPage.tsx:705` (verifiziert, Zeile stimmt)
**Beleg:** `{ ratio: 'aspect-[4/5] lg:aspect-[3/4]', pos: 'object-[52%_15%]', zoom: 'scale-[1.16]', drop: 'lg:mt-10' }`.
Scheitel in der Quelldatei bei 6.36%. Gerechnet landet er bei -3.93px (Desktop) und -4.12px (Mobil). Negativ = abgeschnitten.

**Fix:** Zeile 705 (Anina):
```tsx
{ ratio: 'aspect-[4/5] lg:aspect-[3/4]', pos: 'object-[52%_4%]', zoom: 'scale-[1.06]', drop: 'lg:mt-10' },
```
Zeile 707 (Maarten) gleich mitnehmen — er steht bei +1.72px auf Mobil und kippt bei jeder Rundung:
```tsx
{ ratio: 'aspect-[4/5] lg:aspect-[3/4]', pos: 'object-[50%_4%]', zoom: 'scale-[1.06]', drop: 'lg:mt-10' },
```
Wirkung: Anina -3.93 → +12.46px, Maarten +1.72 → +8.1px.
Tragend ist der Zoom, nicht der Positionswert.

Danach den Datei-Kommentar auf Zeile 689 pruefen. Er behauptet die Kopf-drin-Zusage.

---

### A4. /events Hero-Band: obere Kopfreihe abgeschnitten ab sm — SOFORT
**Datei:** `src/public/EventsPage.tsx:155-158` (verifiziert)
**Beleg:** `party-52.webp` ist 1500x1000. Band `h-[10rem] sm:h-[11rem] lg:h-[12rem]`, `position: 'center 28%'`.
Bei 1440px zeigt das Fenster nur y 22.4%..42.4%. Die Kopfreihe braucht y 13%..48%.
Der Alt-Text sagt woertlich "alle Köpfe sichtbar" / "all heads visible" — das ist ab sm falsch.

**Fix:** Position allein loest es nicht. Fenster 20% vs. benoetigte 35% Bildhoehe.
```tsx
position: 'center 22%',
heightClass: 'h-[10rem] sm:h-[16rem] lg:h-[20rem]',
```
Alt-Text (Zeile 155-156) neutral formulieren, solange der Crop das nicht ueber alle Breakpoints haelt:
`'Tanzteam der Salsaflow Dance Company auf der Danceflow Night'`

**Rest-Einschraenkung:** Ab 1920px zeigt selbst das 320px-Band nur 25% der Bildhoehe. Dort `xl:h-[24rem]` pruefen.

---

### A5. Lehrer-Portraits: Kopfgroessen streuen um 65-84 Prozent — GROESSER
**Datei:** `src/public/TeamPage.tsx:703-709`
**Beleg:** `FACE_SHAPE` gibt jeder Kachel ein anderes Seitenverhaeltnis (4/5, 3/4, 5/7), eine andere Position und einen anderen Zoom (1.0 / 1.16 / 1.12).
Gemessen bei 260px Spalte: Aleksandra 84.5 · Anina 104.5 · Jelena 109.0 · Maarten 75.0 · Tobias 66.0 CSS-Pixel.
Die Quellbilder sind nicht schuld — sie haben aehnliche Kopfgroessen. Das CSS erzeugt die Streuung.

Die Founder-Reihe darueber macht es richtig: `team/content.ts:100-106` traegt gemessene `bust`-Fenster, `TeamPage.tsx:298-306` rendert mit `absolute max-w-none` + `style={{ width, left, top }}`.

**Warum GROESSER:** Braucht eine Design-Entscheidung. Die drei Ratios sind laut Kommentar `TeamPage.tsx:690-702` bewusst gegen das gleichfoermige Fuenfer-Band gesetzt.

**Weg, drei Teile.**
1. Kopfhoehe und Augenlinie je Lehrer aus den Quelldateien messen. Prozedur aus `src/public/team/content.ts:78-99` wiederverwenden, nicht schaetzen.
2. Auf EIN gemeinsames Panel-Seitenverhaeltnis gehen (z.B. `aspect-[4/5]`), dann pro Person ein `bust: {w,l,t}` in Prozent. Ohne gleiche Panelhoehe loest ein Prozent-`top` sich zu verschiedenen Pixeln auf.
3. Rhythmus auf eine Ebene legen, die den Kopf nicht skaliert: `drop`/mt-Versatz oder unterschiedliche Panel-Hoehe bei konstanter Kopfnormierung.

**Gegenprobe:** Kontaktbogen mit Hilfslinie rendern, Streuung der Augenlinie dokumentieren. Zielwert analog FOUNDERS unter 1pp.

**Reihenfolge:** Erst A3 (Anina), dann A5. A3 ist der Notfall, A5 die Sanierung.

---

### A6. Gate `verify-image-reuse.cjs` sieht Doppelungen auf /fotos nicht — GROESSER
**Datei:** `scripts/verify-image-reuse.cjs:25` (verifiziert)
**Beleg:** `const EXEMPT = new Set([path.join('src', 'public', 'gallery', 'content.ts')]);`, Zeile 45 ueberspringt die Datei.
Die Zaehlung ist nur sitewide (`LIMIT = 2`), es gibt keine Seiten-Achse.
Ergebnis: `anniversary-recap-v2.webp` steht dreimal auf /fotos (Hero, Grid, Instagram-Poster), das Gate meldet PASS.

`DESIGN.md:93` fordert aber: "Kein Bild auf derselben Seite doppelt; sitewide max 2x."
Das Skript prueft nur die zweite Haelfte des Satzes.

**Fix — Seiten-Achse aus dem Import-Graph ableiten, keine Dateinamen fest verdrahten.**
1. Route-Einstiegspunkte aus `src/routes.tsx` lesen. Jede Route ist eine Seite.
2. Pro Einstiegspunkt den lokalen Import-Graph transitiv folgen (nur relative und `@/`-Imports, `node_modules` ignorieren).
3. Pro Seite alle `/photos/...`-Treffer einsammeln. Je Datei die Menge der **distinct** srcs nehmen (DE/EN-Rauschen faellt weg), dann ueber die Dateien der Seite summieren.
4. Jeden src melden, der auf derselben Seite mehr als einmal vorkommt. Hier gilt Limit 1, kein Exempt.
5. Exit 1 auch bei Seiten-Treffern. Ausgabe in zwei Bloecke trennen ("Seite" / "sitewide").

Das fängt auch `HomePage.tsx:104` ab, das dieselbe `InstagramShowcase` rendert.

**Inhalts-Fix dazu:** Hero in `PhotosPage.tsx:218/240` auf Fotos umstellen, die weder in `gallery/content.ts` noch in `InstagramShowcase.tsx` stehen. Kleinere Aenderung als das Archiv anzufassen.

---

## Paket B — Formular und Buchung

### B1. /privatstunden: 8 CTAs landen im Schnupperstunden-Formular — SOFORT
**Dateien:** `src/public/privat/content.ts:86` · `src/public/ContactPage.tsx:27`
**Beleg (verifiziert):** `R` enthaelt nur `schnupper: '/kontakt#schnupperstunde'`, keine Privat-Route.
`TOPIC_HASHES` enthaelt `#schnupperstunde`, `#raumvermietung`, `#geschenkgutschein`, `#events`, `#animationen` — `#privatstunden` fehlt.
Live: `curl .../privatstunden | grep -o 'href="/kontakt#schnupperstunde"' | wc -l` = **8**.

**Schaden:** `InquiryWizard.tsx:81` setzt `needsChoices = topic === 'schnupperstunde' || topic === 'kurs'`.
Der Nutzer bekommt den Salsa/Bachata-Stil-Picker der Gratis-Schnupperstunde statt des Freitext-Ziels.
Der falsche `topic` geht so auch an `/api/public/contact`.

**Fix, vier Schritte.**

1. `src/public/ContactPage.tsx:27` — Hash ergaenzen:
```ts
const TOPIC_HASHES: Record<string, TopicKey> = {
  '#schnupperstunde': 'schnupperstunde',
  '#privatstunden': 'privatstunden',
  '#raumvermietung': 'raumvermietung',
  '#geschenkgutschein': 'geschenkgutschein',
  '#events': 'events',
  '#animationen': 'animationen',
};
```

2. `src/public/privat/content.ts:86` — Route ergaenzen:
```ts
const R = {
  schnupper: '/kontakt#schnupperstunde',
  privatAnfrage: '/kontakt#privatstunden',
  preise: '/preise',
  kontakt: '/kontakt',
  kursaufbau: '/kursaufbau',
  privat: '/privatstunden',
};
```

3. CTAs in **beiden** Sprachbloecken umhaengen. `content.ts` hat zwei getrennte Objekte: DE ab Zeile 92, EN ab Zeile 201.
Je Block auf `R.privatAnfrage`: `hero.primary`, `when.cta`, `flow.cta`, `closing.primary`.
`notFor.cta` bleibt in beiden Bloecken auf `R.schnupper` — dort ist die Schnupperstunde inhaltlich richtig.

4. `DECISIONS.md:11` nachziehen. Die Zeile listet die gueltigen Hashes und wird sonst falsch.

**Pruefung:** `grep -c 'R.schnupper' src/public/privat/content.ts` muss 2 ergeben.
Nach Deploy: `href="/kontakt#privatstunden"` = 8, `#schnupperstunde` = 2.

---

### B2. /shows-animationen: Firmenanfragen landen im Schnupperstunden-Formular — SOFORT
**Datei:** `src/public/shows/animationen-content.ts:79` (verifiziert)
**Beleg:** `const ANFRAGE = '/kontakt#schnupperstunde';` haengt an 15 CTAs (DE: 96, 130, 147, 153, 159, 180, 215 · EN: 255, 289, 306, 312, 318, 339, 374).
Zielgruppe laut Zeile 88: "Ob Firmenanlass, Hochzeit, Polterabend oder Geburtstag".
Der richtige Hash existiert schon: `ContactPage.tsx:32` mappt `'#animationen': 'animationen'`.

**Fix:** Zeile 78-79 ersetzen. Die geteilte Konstante deckt alle 15 CTAs ab.
```ts
// Sitewide Conversion-Anker: Event-Anfrage auf den Animationen-Anker /kontakt#animationen.
// Der Hash belegt das Anliegen-Dropdown vor (ContactPage.tsx TOPIC_HASHES) und scrollt zum Formular.
const ANFRAGE = '/kontakt#animationen';
```
`KONTAKT` in Zeile 80 bleibt `'/kontakt'`. Kein weiterer Eingriff.

**Gegenprobe:** `home/content.ts:151` und `:262` verlinken "Auftritt anfragen" bereits korrekt auf `/kontakt#animationen`. Die Shows-Seite ist der Ausreisser.

---

### B3. /kontakt: keine E-Mail und keine Telefonnummer im Seiteninhalt — SOFORT
**Datei:** `src/public/ContactPage.tsx:108-111` (verifiziert)
**Beleg:** Die Seite rendert nur `ContactHero`, `FormSection`, `LocationSection`, `RentalSection`.
Der Block `direct` (`contact/content.ts:130-136`: title "Direkt erreichen", emailLabel, phoneLabel, whatsappLabel, hours) ist vollstaendig getextet, wird aber nirgends gerendert.
Live: `grep -c "Direkt erreichen"` = 0. Das einzige `mailto:` liegt bei Byte 48312, `<footer` beginnt bei 46974 — also im Footer.

**Regression, keine Absicht:** Commit `659f53c` hat ein fertiges `<aside>` entfernt. Die Commit-Message spricht nur von Hero-Layout und Scroll. Weder `DESIGN.md` noch `DECISIONS.md` dokumentieren eine Entscheidung, die Kanaele zu streichen.

**Wichtig:** Die Feldnamen aus dem Audit-Vorschlag (`CONTACT.phoneRaw`, `CONTACT.phone`) existieren nicht.
Verifiziert in `src/public/site/SiteFooter.tsx:17-23`: `email`, `phoneDisplay`, `phoneHref`, `whatsapp`, `instagram`, `googleReviews`.

**Fix 1 — Direktkontakt zurueckholen.** Sauberster Weg:
```
git show 659f53c^:src/public/ContactPage.tsx
```
Das originale `<aside>` war bereits im Hausstil gebaut. Zurueckholen und zwischen Zeile 109 und 110 einsetzen.
`CONTACT` ist in `ContactPage.tsx:15` schon importiert, ebenso `Reveal`/`useReveal`, `sectionTitle`/`Shell`, `MEASURE_L`. Kein neuer Import noetig.

**Fix 2 — Notausgang im Fehler-State des Wizards.**
`src/public/contact/InquiryWizard.tsx:253-257` zeigt bei Fehlschlag nur reinen Text:
```tsx
{(error || status === 'error') && (
  <p role="alert" className="mt-5 rounded-[var(--radius-chip)] bg-[var(--color-salsa-50)] px-4 py-3 text-sm font-semibold text-[var(--color-salsa-700)]">
    {error || copy.sendError}
  </p>
)}
```
Der Copy-String existiert schon ungenutzt: `contact/content.ts:128` (`'Direkt eine E-Mail schreiben'`) und `:242` (`'Write an email directly'`).
Auf ein `<div role="alert">` umbauen und darunter einen `mailto:${CONTACT.email}`-Link mit `copy.mailtoFallback` setzen.
Schlaegt das Formular fehl, hat der Besucher sonst keinen Weg mehr.

**Pruefung:** `grep "Direkt erreichen"` auf /kontakt muss Treffer liefern. `mailto:` muss vor dem Byte-Offset von `<footer` vorkommen.

---

### B4. Formularfelder im Buchungs-Dialog ohne sichtbaren Fokus-Ring — SOFORT
**Datei:** `src/public/BookingPanel.tsx:830` und `:1039`

**Korrigierte Fundstellen.** Das Audit nannte 854/907/1116 und drei Stellen. Im Working Tree sind es zwei:
- Zeile **830** — `textarea`
- Zeile **1039** — `const input` (Klasse aller Personen-Felder: Vorname, Name, E-Mail, Telefon)
- Ein `<select name="tariff">` gibt es nicht mehr. `grep -n '<select' src/public/BookingPanel.tsx` = kein Treffer.

**Beleg:** `grep -c 'focus:ring' src/public/BookingPanel.tsx` = **0**.
Beide Stellen setzen `focus:outline-none` und ersetzen es nur durch einen Rahmenfarb-Wechsel.
Die globale Baseline in `src/index.css` greift nicht — ihr Selektor ist `:where(a, button, [role='button'], summary):focus-visible`. Form-Inputs sind bewusst ausgenommen, mit dem Kommentar "die haben ihren eigenen focus:ring". Genau diese haben keinen.

`src/public/contact/InquiryWizard.tsx:309` macht es richtig: `outline-none focus:border-... focus:ring-2 focus:ring-[var(--color-salsa)]/25`.

**Fix — beide Stellen auf dasselbe Muster:**
```
focus:border-[var(--color-salsa)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-salsa)]/25
```

`focus:border-[var(--color-salsa)]` **muss bleiben**. Der Ring ist mit `/25` nur 25% deckend und liegt allein unter 3:1. Er traegt nur, weil der volldeckende Rahmen darunter liegt.

**Danach:** Den Kommentar in `src/index.css` korrigieren. Seine Annahme hat den Fehler gedeckt.
Robuster: die Baseline auf `input`/`select`/`textarea` ausweiten, damit kuenftige Felder nicht wieder durchfallen.

---

## Paket C — Animationen

### C1. Ohne JavaScript ist die halbe Seite unsichtbar — SOFORT
**Dateien:** `src/public/home/kit.tsx:163-165` (Rise) · `src/public/home/motion.tsx:58-63` (Reveal)

**Beleg (verifiziert).** `kit.tsx`:
```tsx
initial={{ opacity: 0, y: reduced ? 0 : 16 }}
whileInView={{ opacity: 1, y: 0 }}
```
`motion.tsx`: `initial="hidden"` + `whileInView="show"`.
Der Startzustand landet dadurch im prerenderten HTML.

Live: `curl https://salsaflow-dc.vercel.app/ | grep -o 'opacity:0' | wc -l` = **47**.
Betroffen sind H1, Lead-Absatz und der Haupt-CTA "Schnupperstunde buchen".
Sitewide: `/` 47 · `/preise` 39 · `/tanzkurse` 34 · `/team` 34 · `/kontakt` 10.
Gemessene effektive H1-Deckkraft: JS aus = 0.000 · JS an = 1.000.

Es gibt keinen Fallback. Kein `data-reveal` in `src/index.css`, kein `noscript`, kein `scripting:`.
`data-reveal` existiert laut Kommentar (`motion.tsx:6-9`) nur fuer das interne Screenshot-Tool.

**Schaden:** Die Seite ist bewusst vorgerendert (`scripts/prerender.mjs:38`, `scripts/verify-seo.mjs:29`).
Der Prerender-Nutzen verpufft fuer jeden Client ohne JS, mit spaetem JS oder ohne ankommendes Bundle.

**Fix — Ursache beheben, nicht ueberschreiben.**

Reveals erst nach Hydration scharf schalten. In beiden Komponenten:
```tsx
const [hydrated, setHydrated] = useState(false);
useEffect(() => setHydrated(true), []);
```
`kit.tsx` (Rise):
```tsx
initial={hydrated ? { opacity: 0, y: reduced ? 0 : 16 } : false}
```
`motion.tsx` (Reveal):
```tsx
initial={hydrated ? 'hidden' : false}
```

`initial={false}` laesst framer-motion sofort im Endzustand rendern.
Der Prerender schreibt dann kein `opacity:0` mehr. Die Animation laeuft nur im Browser.
Das deckt alle drei Faelle ab: JS aus, JS spaet, Bundle kommt nie an.

**Zusaetzlich als Absicherung** in `src/index.css`:
```css
@media (scripting: none) {
  [data-reveal], [data-reveal] * { opacity: 1 !important; transform: none !important; }
}
```

**Nicht auf `<noscript>` verlassen.** Bei aktivem JS mit fehlgeschlagenem Bundle rendert der Browser `<noscript>`-Inhalt gerade NICHT. Dieses Loch schliesst allein der Hydration-Schritt.

**Nachmessen:** `scripts/verify-seo.mjs` laufen lassen. Effektive H1-Deckkraft mit `javaScriptEnabled: false` erneut pruefen. Zielwert 1.

---

## Paket D — Seiten-Inhalt

### D1. /events: alle 6 Ticket-CTAs zeigen auf die Eventfrog-Startseite — GROESSER
**Dateien:** `src/public/events/content.ts:177-179` · `src/public/EventsPage.tsx:72-95`

**Beleg (verifiziert).**
```ts
export const EVENTFROG_URL =
  (import.meta.env.VITE_EVENTFROG_URL as string | undefined)?.trim() || 'https://eventfrog.ch';
```
Live: `curl .../events | grep -o 'href="https://eventfrog.ch"' | wc -l` = **6**.
Ziel antwortet mit 302 auf `https://eventfrog.ch/de/home.html` — generische Startseite, kein Salsaflow-Kontext.
Alle sechs Buttons kommen aus derselben Komponente `EventfrogCta` (`EventsPage.tsx:72`, `href={EVENTFROG_URL}` in Zeile 90), verwendet in 162, 250, 370, 505, 538, 614.
Die Seite hat keinen anderen Weg zu einem Ticket.

**Warum GROESSER:** Der echte Link steht nirgends im Repo. `grep -rin "eventfrog" wiki/ links.json raw/` = leer. Die alte Live-Site hat ihn auch nicht.
`.env.example:34-36` dokumentiert selbst: "Vor Launch mit dem echten Salsaflow-Eventfrog-Link von Fabio fuellen (Open Q9)".
Das ist der eine Punkt, der eine Rueckfrage rechtfertigt — Kunden-Input, nicht ratbar.

**Schritt 1 — Sofortmassnahme.** `VITE_EVENTFROG_URL` in Vercel fuer Production setzen, neu deployen.

**Schritt 2 — Fallback haerten, intern statt auf eine Fremdseite.**
`src/public/events/content.ts:178`:
```ts
export const EVENTFROG_URL = (import.meta.env.VITE_EVENTFROG_URL as string | undefined)?.trim() || '';
```
`src/public/EventsPage.tsx` — `target`/`rel` duerfen nicht mehr fix gesetzt sein, sonst oeffnet der interne Fallback einen neuen Tab:
```tsx
const href = EVENTFROG_URL || '/kontakt#events';
const isExternal = Boolean(EVENTFROG_URL);
<a href={href} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})} data-testid="eventfrog-cta" className={`${base} ${styles}`}>
```
`#events` ist als Hash vorhanden (`ContactPage.tsx:31`). Pruefen, dass `/kontakt#events` wirklich zum Formular scrollt.

**Schritt 3 — Kommentare mitziehen.** `content.ts:177` und `.env.example:34-36` beschreiben die Fremd-Startseite als legitimen Fallback. Nach dem Fix gilt: leer → interner Kontakt-Link, nie eine Fremdseite.

**Schritt 4 — Regression absichern.** `grep -rln "eventfrog" tests/` ist leer. Kein Test schuetzt die Ticket-Links.
Ein Test genuegt: /events rendern, pruefen dass kein `data-testid="eventfrog-cta"` auf einen fremden Host zeigt und nie auf das nackte `https://eventfrog.ch`.

---

### D2. /events: Anniversary und Floweekend verlinken die eigenen Detailseiten nicht — SOFORT
**Datei:** `src/public/EventsPage.tsx:508-511` (Anniversary) und `:539` (Floweekend)

**Der Fund war anders formuliert. Der echte Defekt:** Beide Sektionen nutzen `EventfrogCta` und schicken den Besucher nach extern, obwohl die eigenen Detailseiten live sind.
`/events-workshops/anniversary-weekend` → 200 · `/events-workshops/floweekend` → 200.
Inhalt vorhanden: `anniversary-content.ts` 328 Zeilen, `floweekend-content.ts` 297 Zeilen. Routen: `routes.tsx:56` und `:57`.
Im Sektions-Body gibt es keinen einzigen internen Link — nur in Desktop-Nav und Mobile-Menue.

**Fix.**
1. `EventfrogCta` in beiden Sektionen durch einen internen Link ersetzen:
   - Anniversary → `href="/events-workshops/anniversary-weekend"`, Label "Anniversary Weekend ansehen"
   - Floweekend → `href="/events-workshops/floweekend"`, Label "Floweekend ansehen"
   Kein `target="_blank"`, da intern.
   Der Eventfrog-CTA bleibt wo er hingehoert: Hero (162), Danceflow (250), TicketsSection.

2. `FloweekendSection` (`EventsPage.tsx:517-556`) bekommt dieselbe Highlight-Liste wie Anniversary (`:429-437`, gerendert `:481-503`). Sie rendert heute nur Eyebrow, Badge, Titel, einen Satz und den CTA.
   Werte aus `floweekend-content.ts` uebernehmen, nicht erfinden. Drei Punkte reichen.

**Keine Platzhalter-Termine.** `anniversary-content.ts:8-10` schreibt ausdruecklich: "Der Programm-Block bleibt bewusst ein Template ohne erfundene Termine/Line-ups". Echte Termine gehoeren in den Eventkalender.

---

### D3. /faq: die erste Frage steht doppelt sichtbar auf der Seite — SOFORT
**Datei:** `src/public/FaqPage.tsx:70` und `:131` (verifiziert)

**Beleg.** Zeile 70: `const first = c.faqSection.items[0];` speist `title={first.q}` und `lead={first.a}` in den Hero.
Zeile 131: `f.items.map(...)` rendert dieselbe Liste komplett noch einmal, inklusive Index 0, mit `defaultOpen={index < 2}` — also aufgeklappt.
Zeile 92: `mainEntity: f.items.map(...)` legt sie ein drittes Mal ins JSON-LD.

**Praezisierung:** Sichtbar sind 2 Kopien, nicht 3. Das dritte Vorkommen ist unsichtbares JSON-LD.

**Fix — beide Stellen aus EINER Quelle ableiten.**

Konstante oben in der Datei, nach den Imports:
```tsx
/* Der Hero beantwortet die erste Frage bereits vollstaendig (siehe FaqHero).
   Die sichtbare Liste laesst sie deshalb aus. Das JSON-LD behaelt sie —
   Schema und sichtbarer Text duerfen hier auseinanderlaufen, weil der Hero
   die Antwort im Klartext zeigt. */
const HERO_FAQ_INDEX = 0;
```
Zeile 70:
```tsx
const first = c.faqSection.items[HERO_FAQ_INDEX];
```
Zeile 131 — filtern statt slicen:
```tsx
{f.items
  .filter((_, i) => i !== HERO_FAQ_INDEX)
  .map((faq, index) => (
    <motion.div key={faq.q} variants={item}>
      <FaqItem q={faq.q} a={faq.a} defaultOpen={index < 2} />
    </motion.div>
  ))}
```
`schema.mainEntity` in Zeile 92 bleibt unveraendert auf `f.items`.

**Warum `filter` statt `slice(1)`:** `slice(1)` sagt "wirf das erste weg" und stimmt nur zufaellig.
`filter` sagt "wirf genau das weg, was der Hero zeigt". Beide Stellen haengen an derselben Konstante.

**Gegenprobe, beide Sprachen:** Der Frage-String muss auf /faq noch 2x vorkommen (Hero + JSON-LD), nicht 3x. `mainEntity` muss weiterhin 21 Eintraege haben.

---

### D4. /tanzkurse: Privatstunden-Preistabelle steht zweimal auf der Seite — SOFORT
**Datei:** `src/public/CoursesPage.tsx:856-879`

**Beleg.** `PricesSection` mappt `privatGroup.rows` in `CoursesPage.tsx:670-693`.
`PrivatSection` (ab Zeile 801) liest in Zeile 800 dieselben Daten und mappt sie erneut in `:861-878`.
Quelle einmal in `courses/overview-content.ts:195-200` (DE) und `:332-337` (EN): 100/450/130/600 CHF.
Live: `'1 Lektion, 1 Person'` steht bei Byte 57422 und 67401 — zwei getrennte `<dl>`-Bloecke.
Dieselben Zahlen stehen zusaetzlich auf `/preise` und `/privatstunden`.

**Fix.** `CoursesPage.tsx:856-879` (Kommentar, `<h3>Preise</h3>`, die ganze `<dl>`) ersatzlos streichen. Statt dessen eine reine Textzeile:
```tsx
<motion.p variants={item} className="mt-8 border-t border-[var(--color-line)] pt-6 text-[0.95rem] text-[var(--color-ink-muted)]">
  {de ? 'Ab 100 CHF pro Lektion.' : 'From CHF 100 per lesson.'}
</motion.p>
```

**Keinen zweiten Link setzen.** Die obere Tabelle hat schon einen CTA "Mehr zu Privatstunden" → `#privatstunden` (`overview-content.ts:201`, EN `:338`). Der springt genau zu dieser Sektion. Ein zweiter Link mit fast gleichem Text auf ein anderes Ziel ersetzt eine Dopplung durch eine neue.
`PrivatSection` hat direkt darunter schon ein CTA-Paar (`:881-895`).

**Aufraeumen:** Die dann unbenutzte Variable `privatPrices` in Zeile 800 samt Kommentar 799 loeschen. Sonst bricht der Build bei `noUnusedLocals`.
`cn` und `item` bleiben — beide werden weiter gebraucht (`:836`, `:839`).
Der Anker `id="privatstunden"` in Zeile 803 **muss bleiben**.

---

### D5. Toter Testimonial-Block in content-v3.ts — SOFORT
**Datei:** `src/public/home/content-v3.ts:126` (DE) und `:274` (EN)

**Beleg (verifiziert).** Beide Zeilen enthalten `items: []`. Der Typ verlangt `items: Testimonial[]` (Zeile 30), `Testimonial` steht in Zeile 15.
Kopfkommentar Zeile 4: "Testimonials sind plausibel erfunden und klar als Beispiel markiert (bis Kunde echte liefert)". Das stimmt nicht und stimmte nie.

**Groesser als gemeldet.** Repo-weite Suche nach `testimonials` liefert genau drei Treffer, alle in dieser Datei: Typ `:24`, DE-Block `:120`, EN-Block `:268`. Es gibt **keinen einzigen Consumer**.
Tot ist nicht nur `items`, sondern der komplette Block inklusive `eyebrow`, `title`, `body`, `ratingNote`, `googleLink`.

**Richtigstellung:** `WallOfLove.tsx` importiert `HOME_V3` ueberhaupt nicht. Der Block war fuer diese Komponente nie eine Quelle. Echte Zitate stehen in `src/public/site/reviews.ts` (`WALL_REVIEWS`, 13 Eintraege).

**Fix.**
1. Kompletten `testimonials`-Block streichen: Typ `:24-31`, DE `:120-127`, EN `:268-275`.
2. `export type Testimonial` (Zeile 15) loeschen. Danach null Referenzen.
3. Kopfkommentar Zeile 4 streichen. Er ist eine aktive Falschaussage im Dateikopf.
4. Im selben Zug pruefen: `hero` und `journey` haben ebenfalls 0 `HOME_V3`-Consumer. Mit erledigen oder als eigenen Fund festhalten.

**Verifikation:** `npx tsc --noEmit` sauber. `grep -rn 'testimonials\|Testimonial' src/` leer. Sichtbarer Inhalt aendert sich nicht.

---

## Paket E — Technik und SEO

### E1. Preview-Host ist voll crawlbar und liefert Canonicals auf 404-URLs — SOFORT
**Dateien:** `public/robots.txt:5-6` · `vercel.json:28-38` · `src/lib/seo-config.ts:4`

Dieser Eintrag fasst zwei gemeldete Funde zusammen. Gleiche Ursache: die Domain zeigt noch auf Jimdo, die Preview ist trotzdem offen.

**Beleg (verifiziert).**
- `src/lib/seo-config.ts:4` = `export const SITE_ORIGIN = 'https://www.salsaflow-dc.com' as const;`
- Der Host laeuft noch auf Jimdo: Header `x-jimdo-wid: s4e7929a263e9dc43`, Titel "Salsaflow Dance Company - Salsa Tanzschule in Basel".
- Preview setzt Canonical dorthin, dazu `og:url` und `og:image`.
- `sitemap.xml` auf der Preview hat 26 `<loc>`-Eintraege, alle auf `www.salsaflow-dc.com`.
- **23 von 26 sind 404.** Drei geben 200 mit fremdem Jimdo-Inhalt: `/`, `/events`, `/kontakt`. Das macht den Schaden groesser — Google findet eine lebende Fremdseite und kann die neue als Duplikat verwerfen.
- Die Preview ist voll crawlbar: `robots.txt` = `Allow: /`, Meta `index, follow`, kein `x-robots-tag`.
- `og:image`-Ziel `https://www.salsaflow-dc.com/photos/showcase/hp-05.webp` → 404.

Deckt sich mit `DECISIONS.md:26`: "www.salsaflow-dc.com = Jimdo live; Neu = salsaflow-dc.vercel.app; DNS-Cutover + 301-Matrix vor SEO-Go-Live".

**`seo-config.ts:4` NICHT aendern.** Die Datei ist richtig. Kaputt ist das Deployment-Ziel.

**Schritt 1 — Preview aus dem Index halten (sofort, drei Ebenen).**

Ebene 1, Plattform-Schalter: Vercel Project Settings → Deployment Protection → Vercel Authentication fuer Preview-Deployments. Deckt alle Preview-Hosts ab, auch die Hash-URLs. Falls die Seite fuer den Kunden offen bleiben muss, Ebene 2 nutzen.

Ebene 2, Header per Regex-Host — nicht per exaktem Host, sonst bleiben `salsaflow-dc-<hash>-<scope>.vercel.app` ungeschuetzt. In `vercel.json` das `headers`-Array ergaenzen:
```json
{
  "source": "/(.*)",
  "has": [{ "type": "host", "value": ".*\\.vercel\\.app" }],
  "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
}
```

Ebene 3, widerspruechliche Signale abschalten:
- Das HTML sendet `<meta name="robots" content="index, follow" />`. Ueber Build-Env loesen: `VERCEL_ENV !== "production"` → `noindex, nofollow`. Nicht hart verdrahten.
- `sitemap.xml` auf dem Preview-Host nicht ausliefern. Sie listet 26 URLs, die auf Produktion ueberwiegend 404 sind.

**Nur `robots.txt` reicht nicht.** Ein `Disallow` verhindert das Crawlen, nicht das Indexieren einer verlinkten URL.

**Schritt 2 — Domain umstellen (danach, dann Schritt 1 zurueckdrehen).**
Vercel → Domains → `www.salsaflow-dc.com` hinzufuegen. Cloudflare-Record von Jimdo auf Vercel zeigen.
Nach dem Umzug: `curl -I https://www.salsaflow-dc.com/` — der Header `x-jimdo-wid` muss weg sein. Das ist der harte Beweis.

**Schritt 3 — Nacharbeiten, die sonst liegenbleiben.**
1. `og:image` erneut pruefen, sonst bleiben alle Social-Previews leer.
2. `src/public/subpage/kit.tsx:70` hat `SITE_ORIGIN` als zweite hartkodierte Kopie, genutzt in Zeile 149 fuer BreadcrumbList-Items. Aus `@/lib/seo-config` importieren, sonst driften die Werte auseinander.
3. Alte Jimdo-URLs sichern: `/angebot/` und `/kurse/` stehen in der alten sitemap.xml und haben Rankings. 301-Redirects auf die neuen Pfade anlegen.

**Check nach Deploy:** `curl -I .../tanzkurse | grep -i x-robots-tag` muss `noindex, nofollow` zeigen.
Nach dem Cutover muss `www.salsaflow-dc.com` den Header **nicht** setzen.

---

### E2. /buchung bekommt den noindex-Header nicht — SOFORT
**Datei:** `vercel.json:34` (verifiziert)

**Beleg.** Die Regel lautet `"source": "/buchung/(.*)"`. Das Muster verlangt Slash plus Rest — `/buchung` selbst faellt raus.
Gemessen: `/buchung` → 200, **kein** `x-robots-tag`. `/buchung/erfolg` → Header vorhanden. `/admin` → Header vorhanden.
`/buchung/` mit Trailing Slash bekommt den Header, `/buchung` nicht. Das bestaetigt die Slash-Abhaengigkeit.

Heute rettet nur das statische Meta-Tag in `dist/buchung.html` die Lage. Der Header fehlt trotzdem.

**Fix.** `vercel.json:33-35`:
```json
{ "source": "/buchung(/.*)?", "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }] }
```

Die `/admin`-Regel (`vercel.json:30`) hat das Problem spiegelverkehrt: sie deckt nur `/admin` ab, keine Unterpfade.
Falls es Admin-Unterrouten gibt, ebenfalls auf `/admin(/.*)?` erweitern.

**Nicht anfassen:** die `rewrites`-Regel `/buchung/(.*)` → `/buchung` (`vercel.json:44`). Die ist absichtlich nur fuer Unterpfade. `/buchung` wird direkt von `dist/buchung.html` bedient. Erweitern riskiert eine Rewrite-Schleife.

**Verifikation:** `curl -sI .../buchung | grep -i x-robots-tag` → `noindex, nofollow`.

---

## Paket F — A11y und Performance

### F1. Galerie laedt 13.4 MB Original-Fotos als Thumbnails — GROESSER
**Datei:** `src/public/PhotosPage.tsx:116-128`

**Beleg (verifiziert).** Kein `srcSet`. Im ganzen `src/`-Baum gibt es genau eins, und zwar in `src/public/home/Hero.tsx:300` — nicht in der Galerie.
`gallery/content.ts` hat 88 Eintraege, zusammen 13.4 MB. Groesste: `show-21.webp` 541 KB, `show-08.webp` 356 KB, `anniversary-recap-v2.webp` 314 KB.
Live-Browser-Messung auf /fotos: Desktop 5.27 MB vor dem Scrollen → **13.80 MB** nach vollem Scroll, 93 Requests.
Mobil identisch: 2.73 MB → 13.80 MB. Kein einziges Byte gespart.
Gemessene Kachelbreiten: **154px mobil**, 246px Desktop, bei `naturalWidth` 1080px — siebenfacher Overfetch.

**Einschraenkung:** `loading="lazy"` wirkt. Der Erstaufruf kostet mobil 2.73 MB, nicht 13.4. Der Schaden entsteht beim Durchscrollen — und genau dafuer ist die Seite da.

**Fix.**

1. Breakpoints an der Realitaet, nicht an 1440w. Die groesste CSS-Kachel bleibt unter ~300px:
```tsx
const base = p.src.replace(/\.(webp|jpg)$/, '');
<img
  src={`${base}-480.webp`}
  srcSet={`${base}-320.webp 320w, ${base}-480.webp 480w, ${base}-960.webp 960w`}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
  ...
/>
```

2. **`src` darf nicht auf das Original zeigen.** Jeder Browser, der `srcset` ignoriert, zieht sonst weiter die volle Datei. Der Fallback muss die kleine Variante sein.

3. **Die Lightbox nicht mitverkleinern.** `PhotosPage.tsx:448-454` zeigt das Foto mit `max-h-[78vh]`. Dort ist das Original richtig. Nur die Kachel in der Liste umstellen.

4. **Varianten muessen automatisch entstehen.** `scripts/photo-polish.cjs` kann mit sharp skalieren, aber nichts regeneriert Varianten, wenn ein Foto neu in `gallery/content.ts` landet — dann liefern die Varianten still 404.
Varianten in `scripts/build-prod.mjs` aus `GALLERY_PHOTOS` heraus erzeugen, idempotent (vorhandene Datei ueberspringen).

**Realistische Ersparnis, mit sharp nachgemessen:** `show-21.webp` 541 KB → 73 KB bei 480w, 244 KB bei 960w.
Bei 88 Fotos landet die durchgescrollte Galerie bei grob 2 bis 3 MB statt 13.8 MB. Nicht "unter 1.5 MB".

---

### F2. Ein einziger JS-Chunk mit 1.1 MB — GROESSER
**Datei:** `src/routes.tsx:3-30`

**Beleg (verifiziert).** 26 statische Seiten-Imports (`grep -c '^import { .*Page' src/routes.tsx` = 26).
Kein `React.lazy` in `src/` — `grep -rn 'lazy(' src/` = kein Treffer. Einziges dynamisches `import()` ist `lenis` in `SmoothScroll.tsx:53`.
`vite.config.ts` hat weder `rollupOptions` noch `manualChunks`.
Live: 1.121.204 Bytes roh, 300.468 Bytes brotli.

**Achtung — der naheliegende Fix zerstoert das Prerendering.**
`src/entry-server.tsx:2,24` nutzt `renderToString`, angetrieben von `scripts/prerender.mjs:79` ueber `PRERENDER_ROUTES` (26 Routen mit `prerender: true`).
`renderToString` kann nicht suspendieren. Gegen die repo-eigene React-19-Version getestet: die Ausgabe ist `<div>LOADING</div>` plus die Meldung *"The server used renderToString which does not support Suspense."*
Lazy-Routen in `<Suspense>` wuerden auf allen 26 SEO-Seiten das prerenderte HTML durch einen Spinner ersetzen. `/tanzkurse` liefert heute 82.883 Bytes Markup mit `data-prerendered="true"` — das faellt weg.

**Kernregel: nur die NICHT-prerenderten Routen lazy laden.** Genau dort liegt das tote Gewicht.

1. **Admin lazy machen** — groesster sicherer Gewinn. `/admin` hat kein `prerender: true` (`routes.tsx:71`).
Damit fallen `AdminApp`, `TermEditor`, `TermsList`, `BalanceView`, `DuplicateView` aus dem Startseiten-Chunk.
In `src/App.tsx`:
```tsx
const AdminApp = lazy(() => import('@/admin/AdminApp'));
```
und den Render-Ort in `<Suspense fallback={null}>` wickeln. `App` wird nur clientseitig gerendert, nie von `renderToString` angefasst — hier ist Suspense gefahrlos.

2. Ebenso `BookingPage` (`/buchung`, `routes.tsx:72`) und `BookingReturn` (`routes.tsx:73-74`).
Sicher, weil `PRERENDER_ROUTES` nach `prerender === true` filtert (`routes.tsx:80`).
**Trotzdem nach der Aenderung `npm run build` laufen lassen** und pruefen, dass jede der 26 HTML-Dateien weiterhin `data-prerendered="true"` und echten Body-Inhalt hat.

3. Prerenderte Routen splitten braucht eine Umstellung von `renderToString` auf `prerenderToNodeStream` (react-dom/static). Eigene Aenderung mit eigenem Test. **Nicht nebenbei mitmachen.**

4. Vendor-Splitting in `vite.config.ts` ist optional und bringt **keine** kleinere Startseite, nur bessere Cache-Trennung:
```js
build: { rollupOptions: { output: { manualChunks: { react: ['react','react-dom'] } } } }
```
`framer-motion` braucht die Startseite selbst. Ein eigener Chunk spart dort nichts.

**Zwei Irrtuemer aus dem Fund:** `lucide-react` wird ueberall named importiert und sauber tree-shaked — 0 Treffer fuer `createLucideIcon` im Bundle. Und "unter 150 KB brotli" ist unbelegt.
**Messlatte statt Schaetzung:** nach Schritt 1+2 erneut messen mit `ls -la dist/assets/*.js` und `curl -H 'Accept-Encoding: br'`.

---

### F3. 547 KB Font-Dateien im Build — SOFORT
**Datei:** `src/index.css:2-6` (verifiziert)

**Beleg.** Die Datei importiert die Sammel-CSS:
```css
@import "@fontsource/afacad/400.css";
@import "@fontsource/afacad/400-italic.css";
@import "@fontsource/afacad/500.css";
@import "@fontsource/afacad/600.css";
@import "@fontsource/afacad/700.css";
```
`node_modules/@fontsource/afacad/400.css` enthaelt 6 `@font-face`-Bloecke: cyrillic-ext, math, symbols, vietnamese, latin-ext, latin.
Eine DE/EN-Seite braucht math, symbols, vietnamese und cyrillic nie.
Im Build: **50 Afacad-Dateien**, 559.724 Bytes — 25x `.woff2` plus 25x `.woff`.
Laufzeitkosten entstehen dank `unicode-range` nicht. Build-, Deploy- und Cache-Volumen schon.

**Schritt 1 — nur gebrauchte Subsets.** Zeile 2-6 ersetzen:
```css
@import "@fontsource/afacad/latin-400.css";
@import "@fontsource/afacad/latin-400-italic.css";
@import "@fontsource/afacad/latin-500.css";
@import "@fontsource/afacad/latin-600.css";
@import "@fontsource/afacad/latin-700.css";
```
Gemessen: 50 Dateien → 10, 559.724 B → 152.124 B.

**Schritt 2 — woff wirklich entfernen (weitere 85.720 B).**
Schritt 1 allein reicht nicht: die `latin-*.css` tragen den woff-Fallback selbst:
```
src: url(./files/afacad-latin-400-normal.woff2) format('woff2'), url(./files/afacad-latin-400-normal.woff) format('woff');
```
Das `.woff`-Set ist reine Altlast — jeder Browser mit ES-Modul-Support kann woff2.
Statt der Fontsource-CSS eigene `@font-face`-Bloecke schreiben und die 5 woff2 nach `public/fonts/` kopieren. Analog zu Cal Sans und Alex Brush, die in `src/index.css:9-22` schon so eingebunden sind:
```css
@font-face {
  font-family: "Afacad";
  src: url("/fonts/afacad-latin-400-normal.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
```
Gleiches fuer 400-italic, 500, 600, 700. Ergebnis: 5 Dateien, ~66 KB statt 547 KB.
Der `unicode-range`-Wert ist 1:1 aus `node_modules/@fontsource/afacad/400.css`.

**Entscheidung latin-ext bewusst treffen.** Deutsche Umlaute liegen in U+0000-00FF und sind vom latin-Subset gedeckt. latin-ext wird nicht gebraucht — aber das festhalten, nicht als Nebenwirkung durchrutschen lassen.

**Schritt 3 — unabhaengig davon:** `@fontsource/bricolage-grotesque` aus `package.json:35` entfernen. 0 Treffer in `src/`.

---

## Reihenfolge fuer die Umsetzung

**Runde 1 — SOFORT, kein Nachdenken noetig (~90 Minuten):**
C1 (JS-Fallback) · A1, A2, A3, A4 (Crops) · B1, B2 (falsche Formulare) · E2 (buchung-Header) · D3, D4, D5 (Dopplungen) · F3 (Fonts) · B4 (Fokus-Ringe)

**Runde 2 — SOFORT, etwas mehr Arbeit:**
B3 (Kontakt-Kanaele zurueckholen) · D2 (interne Event-Links)

**Runde 3 — GROESSER, braucht Entscheidung oder Zugang:**
D1 (Eventfrog-Link von Fabio) · E1 (DNS-Cutover) · A5 (Lehrer-Normierung) · A6 (Gate umbauen) · F1 (srcset-Pipeline) · F2 (Code-Splitting)

**Vor dem Deploy:** `git status` ist nicht sauber. 48 Dateien sind modifiziert und noch nicht committet. Erst diesen Stand klaeren.
