# 11 — Fotos `/fotos`

**Status:** FINAL v2 (2026-08-12)
**Priorität:** P1
**Job:** Beweisen, dass es diese Community wirklich gibt. Bilder sind hier der Ersatz für die Bewertungen, die wir nicht zeigen dürfen.
**Nav-Label:** FOTOS (Kunden-Baseline)
**Primärer CTA:** Kursplan ansehen
**Primary-Keyword:** Marke plus Bildersuche — `salsaflow basel fotos` ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md):75)
**Sekundär:** salsa party basel fotos, danceflow night basel, tanzschule basel bilder

---

## 1. Meta

```text
Title:       Fotos aus unserer Tanzschule in Basel | Salsaflow
Description: Fotos aus den Kursen, von den Danceflow Nights und von unseren
             Events an der Elisabethenanlage 7 in Basel. Schau dir an, wie ein
             Abend bei uns aussieht.
```

**Längen (Zeichen inkl. Leerzeichen, einzeilig gezählt):** Title 49 · Description 152. Beide innerhalb der Vorgabe (Title ≤ 60, Description ≤ 155).

Diese Seite zielt nicht auf einen Kaufbegriff, sondern auf Marke und Bildersuche. Deshalb trägt der Title den Ort und die Marke, nicht einen erzwungenen Kursbegriff. Der Begriff „Fotos" steht in Title, H1 und erstem Satz.

**Open Graph:** OG-Titel `Fotos aus der Tanzschule Salsaflow in Basel`, OG-Bild ein Danceflow-Motiv aus dem freigegebenen Bestand (`/photos/premium/danceflow-home-2000.webp`), zugeschnitten nach G-01 ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md):125-139).

## 2. Warum diese Seite wichtiger ist, als sie aussieht

Es gibt keine freigegebenen Bewertungszitate (P-02, [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:34-44)). Die „Wall of Love"-Fläche entfällt deshalb sitewide. Was bleibt, um Vertrauen zu zeigen: echte Bilder von echten Abenden mit echten Leuten.

Eine Galerie ist damit kein Deko-Anhängsel, sondern der einzige Sozialbeweis, den die Seite ehrlich führen kann.

---

## 3. Kopf

```text
Eyebrow: AUS DEM STUDIO
H1:      Fotos aus unserer Tanzschule
Lead:    Diese Fotos stammen aus unseren Kursen, von den Danceflow Nights und
         von unseren Events an der Elisabethenanlage 7 in Basel. Alle Bilder
         sind bei uns entstanden, keines ist gekauft. Wenn du wissen willst,
         wie ein Abend bei uns aussieht — hier siehst du es.
Microcopy unter dem Lead:
         Wähl unten einen Bereich oder öffne ein Album.
```

H1: vier Wörter, Hauptbegriff vorn (Regel 4.1). Lead: Hauptbegriff im ersten Satz, Ort im ersten Satz, nächster Schritt im dritten (Regel 4.3).

Kein Satz über „unvergessliche Momente". Die Bilder machen die Arbeit.

**Der Satz „keines ist gekauft" ist nur zulässig, wenn L-01 geklärt und die Composite-Bilder ausgeschlossen sind** (Abschnitt 10). Bleibt L-01 offen, lautet der zweite Satz: `Alle Bilder sind bei einem echten Kurs oder Event von uns entstanden.` Sobald ein einziges Stock- oder KI-Bild in der Galerie läge, wäre der Satz eine Falschaussage.

---

## 4. Filter-Chips

```text
H2:  Wonach willst du schauen?
```

Über den Alben steht eine Chip-Reihe. Sie filtert die Album-Liste, sie führt nicht auf andere Seiten.

| Chip | Zeigt | Aktiv beim Laden |
|---|---|---|
| Alle | alle Alben, neueste zuerst | ja |
| Danceflow Nights | Album-Typ `night` | — |
| Kurse und Studio | Album-Typ `kurs` | — |
| Events | FLOWeekend, Anniversary Weekend, sonstige Anlässe | — |
| Shows | Auftritte und Animationen | — |

**Microcopy und Zustände der Chip-Reihe:**

```text
Label vor der Reihe (visuell versteckt, für Screenreader):  Alben filtern
Chip aktiv:        Chip bleibt farblich markiert, Attribut aria-pressed="true"
Ergebniszeile:     4 Alben · Danceflow Nights
Zurücksetzen:      Filter zurücksetzen
Kein Treffer:      In diesem Bereich sind noch keine Alben. Schau bei „Alle"
                   vorbei oder komm an einer Danceflow Night selbst vorbei.
```

Regeln:

- Chips sind echte Buttons, kein Dropdown. Fünf Optionen brauchen kein Menü.
- Der aktive Filter steht in der Adresse (`/fotos?bereich=nights`), damit ein Link teilbar ist und der Zurück-Knopf funktioniert.
- Ein Chip erscheint nur, wenn es mindestens ein Album dieses Typs gibt. Ein leerer Chip ist ein Versprechen, das die Seite nicht hält.
- Chips filtern ohne Neuladen und ohne Sprung: die Scrollposition bleibt.

---

## 5. Aufbau

Ordner statt einer endlosen Bilderwand. Der Kunde hat es genau so beschrieben: viele Ordner von verschiedenen Events und Kursen, neue Eventbilder flexibel ergänzbar ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:38-39)).

```text
H2:   Alben von Kursen, Nights und Events
Lead: Jedes Album gehört zu einem Abend oder einer Staffel. Klick eins an,
      dann siehst du alle Bilder dazu.
```

Pro Album eine Kachel: Titelbild, Titel, Jahr, Anzahl Bilder.

```text
Danceflow Nights
Kurse und Studio
FLOWeekend
Anniversary Weekend
Shows und Auftritte
```

**Kacheltext (ausgeschrieben, Muster pro Album):**

```text
Titel:      Danceflow Night, Oktober 2026
Jahr:       2026
Anzahl:     38 Bilder
Untertitel: Salsa- und Bachata-Floor in unserem Studio
Aria-Label: Album öffnen: Danceflow Night, Oktober 2026, 38 Bilder
```

Titel, Jahr und Anzahl kommen aus dem Albumdatensatz. Wo ein Datum fehlt, steht nur das Jahr — nie ein geschätztes Datum.

Klick öffnet das Album, nicht ein Einzelbild.

### Sortierung

Neueste Alben oben. Ein Album von 2023 als erstes zu zeigen, lässt die Schule inaktiv wirken — auf der Live-Seite sind Event-Blöcke von 2023 belegt (P12).

---

## 6. Im Album

- Raster, klickbar zur Grossansicht.
- Grossansicht mit Weiter- und Zurück-Taste, schliessbar mit Escape und Klick daneben.
- Bilder werden nachgeladen, während man scrollt — eine Galerie mit 200 Bildern darf nicht 200 Bilder auf einmal laden.
- Kein automatischer Diashow-Ablauf.
- Kein Rechtsklick-Schutz. Er verhindert nichts und ärgert Leute.

### Album-Kopf (ausgeschrieben)

```text
Zurück-Link: Alle Alben
H1 Albumseite: Danceflow Night, Oktober 2026
Lead:          38 Bilder aus dem Studio an der Elisabethenanlage 7. Salsa auf
               dem einen Floor, Bachata auf dem anderen.
Credit-Zeile:  Fotos: <Name>            (nur wenn FOTO-01 geklärt)
Hinweis:       Du bist auf einem Bild und möchtest es nicht hier haben?
               Schreib uns kurz, wir nehmen es raus.
```

Die Albumseite hat ihre eigene H1. `/fotos` und die Albumseiten sind getrennte Adressen mit je genau einer H1.

### Grossansicht (Lightbox) — Microcopy und Verhalten

| Element | Text / Verhalten |
|---|---|
| Schliessen | Button mit zugänglichem Namen `Grossansicht schliessen`; zusätzlich Escape und Klick auf den Hintergrund |
| Zurück | `Vorheriges Bild`; zusätzlich Pfeiltaste links |
| Weiter | `Nächstes Bild`; zusätzlich Pfeiltaste rechts |
| Zähler | `Bild 12 von 38` — sichtbar unter dem Bild |
| Bildunterschrift | Album-Titel plus Zähler, sonst nichts. Keine geratenen Namen. |
| Fokus | Beim Öffnen springt der Fokus in die Grossansicht, beim Schliessen zurück auf das angeklickte Bild |
| Tastatur | Fokus bleibt in der Grossansicht gefangen, solange sie offen ist |
| Erstes/letztes Bild | Weiter am Ende und Zurück am Anfang sind deaktiviert, nicht umlaufend — sonst weiss niemand, wo das Album endet |
| Ladephase | `Bild wird geladen …` |
| Bild fehlt | `Dieses Bild lässt sich gerade nicht laden.` |
| Reduced Motion | Kein Zoom, kein Bounce; nur einfaches Ein- und Ausblenden |

### Zustände

| Zustand | Text |
|---|---|
| Lädt | `Bilder werden geladen …` |
| Album leer | `In diesem Album sind noch keine Bilder.` |
| Kein Album im Filter | `In diesem Bereich sind noch keine Alben.` |
| Fehler | `Die Bilder lassen sich gerade nicht laden. Versuch es später noch einmal.` |
| Nachladen läuft | `Weitere Bilder werden geladen …` |
| Ende erreicht | `Das waren alle Bilder aus diesem Album.` |

---

## 7. Alt-Text-System

Der schwierigste Teil dieser Seite. Eine Galerie mit hunderten Bildern kann keine handgeschriebenen Alt-Texte pro Bild haben — aber `alt=""` für alles ist auch falsch, weil die Bilder Inhalt sind.

**Die Regel:**

| Fall | Alt-Text |
|---|---|
| Bild trägt eigene Aussage (Gruppenbild, Auftritt, Studioansicht) | eigener, bildgenauer Text |
| Bild ist eines von vielen aus demselben Anlass | Album-Text plus Nummer: `Danceflow Night, Bild 12 von 40.` |
| Reines Stimmungsbild ohne Informationswert | `alt=""` |
| Album-Titelbild auf der Kachel | `alt=""` — der Albumtitel steht als Text daneben, sonst liest der Screenreader alles doppelt |

Verboten bleibt in allen Fällen: geratene Namen, Keyword-Stapelung, „Bild von" ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md:442-457)).

### Fertige Alt-Texte für Event-Fotos (Stimmung neutral, ohne Personenzuschreibung)

Diese Sätze sind die zugelassene Auswahl für Bilder mit eigener Aussage. Der passende wird gewählt, nicht neu erfunden:

```text
Volle Tanzfläche bei einer Danceflow Night im gedimmten Licht.
Menschen tanzen in Paaren auf der Tanzfläche, im Hintergrund der DJ-Tisch.
Ein Paar tanzt Salsa, um die beiden herum stehen weitere Tanzende.
Eine Gruppe steht im Kreis im Studio und lacht.
Ein Kurs übt den Grundschritt vor der Spiegelwand.
Tanzende in einer Reihe bei einer Choreografie, die Arme oben.
Blick über die Tanzfläche in unserem Studio bei Tageslicht.
Zwei Tanzende in geschlossener Haltung, seitlich aufgenommen.
Eine Gruppe steht nach dem Auftritt auf der Bühne und verbeugt sich.
Publikum applaudiert vor einer Bühne bei einem Event.
```

**Die Verbotsliste dazu ist genauso bindend:**

- Keine Namen — nicht `Fabio und Claudia tanzen`, sondern `Ein Paar tanzt Salsa`.
- Keine Rollen — nicht `Lehrperson korrigiert Schülerin`, solange kein echtes Unterrichtsfoto existiert ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md):236-238).
- Keine Gefühle als Fakt — nicht `glückliche Menschen geniessen den Abend`, sondern was zu sehen ist.
- Keine Zahlen raten — nicht `50 Tanzende`, sondern `volle Tanzfläche`.
- Keine Keywords stapeln — nicht `Salsa Basel Bachata Basel Tanzkurs Foto`.

### Album-Beschreibung

Die Album-Beschreibung übernimmt damit die Arbeit, die 200 Einzeltexte nicht leisten können. Sie muss deshalb konkret sein:

```text
Danceflow Night, Oktober 2026 — Salsa- und Bachata-Floor in unserem Studio
an der Elisabethenanlage.
```

Weitere fertige Album-Beschreibungen (Datum jeweils aus dem Albumdatensatz, nie geschätzt):

```text
Kurse und Studio — Bilder aus laufenden Kursen und aus unseren beiden
Studioräumen an der Elisabethenanlage 7.

FLOWeekend — Workshops und Partys an unserem Tanzwochenende in Basel.

Anniversary Weekend — unser Geburtstagswochenende mit Workshops, Show
und Party.

Shows und Auftritte — Auftritte unseres Teams bei Anlässen in und um Basel.
```

---

## 8. Fotografen-Credits

Auf der Live-Galerie stehen „Fotos by Urs Müller" und „Fotos by Valentin" (Nachname laut Dossier Behringer) — belegt (P12, L-03 in [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:75-79)).

Drei Fragen sind offen und alle drei betreffen Rechte, nicht Gestaltung:

1. Dürfen diese Bilder überhaupt auf die neue Website übernommen werden?
2. Ist die Credit-Nennung vertraglich Pflicht?
3. Gilt der Credit pro Bild oder pro Album?

→ **Entscheidung FOTO-01.**

Vorgesehen ist eine Credit-Zeile am Fuss jedes betroffenen Albums:

```text
Fotos: Urs Müller
```

Solange Frage 1 nicht beantwortet ist, werden diese Bilder **nicht** übernommen. Bilder ohne geklärte Nutzungsrechte auf eine neue Domain zu ziehen, ist ein Risiko, das eine Galerie nicht wert ist.

---

## 9. Personen auf Bildern

Die Live-AGB regeln Foto- und Videonutzung restriktiv ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:65)). Für die Galerie heisst das:

- Kursteilnehmende sind erkennbar abgebildet. Es braucht eine Regel, wie jemand ein Bild entfernen lassen kann.
- Diese Regel gehört sichtbar auf die Seite, nicht versteckt in die Datenschutzerklärung:

```text
H3:   Du bist auf einem Bild?
Body: Du bist auf einem Bild und möchtest es nicht hier haben? Schreib uns
      kurz, wir nehmen es raus. Eine Nachricht reicht, du musst nichts
      begründen.
CTA:  Bild melden  →  /kontakt
```

Der Block steht einmal auf `/fotos` unter den Alben und zusätzlich als kurze Zeile im Album-Kopf. Dieser Satz kostet nichts und löst ein echtes Problem. → **Entscheidung FOTO-02** nur zur Formulierung, nicht zur Sache — die Möglichkeit muss es geben.

---

## 10. Ausgeschlossene Bilder

- `show-04`, `show-22` — fremdes „Bail Adoro"-Wasserzeichen.
- `show-15` — fremdes Event-Logo.
- `/composites/heels-shoes-stilllife.webp` und `/composites/hero-stage.webp` — Herkunft ungeklärt, EXIF vollständig entfernt, der abgebildete Raum entspricht nicht dem Salsaflow-Studio (L-01).

Belegt in [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:58-73).

In einer Galerie wiegt der letzte Punkt besonders schwer: Hier liest man jedes Bild als „so ist es bei Salsaflow". Ein Stock- oder KI-Bild an dieser Stelle ist eine Irreführung, nicht nur ein Stilfehler.

---

## 11. Abschluss

```text
H2:        Willst du auf dem nächsten Bild dabei sein?
Body:      Die Bilder entstehen an ganz normalen Kursabenden und an den
           Danceflow Nights. Ein Kursblock dauert 8 Wochen mit je 60 Minuten
           und kostet CHF 190.
Primary:   Kursplan ansehen         →  /kursplan
Secondary: Danceflow Night ansehen  →  /events/danceflow-night
Schluss:   Wir freuen uns auf dich.
```

Der Inline-Preis mit Link auf `/preise` erfüllt die Transparenz-Regel und die Konkurrenz-Massnahme 9 ([`04d-seo-konkurrenz.md`](/root/clients/salsaflow-dc/website-plan/04d-seo-konkurrenz.md):109-110).

---

## 12. Interne Links

`/kursplan`, `/events/danceflow-night`, `/events`, `/tanzkurse`, `/team`, `/preise`, `/kontakt`.

Konkrete Linktexte im Fliesstext:

| Linktext | Ziel | Wo |
|---|---|---|
| Kursplan | `/kursplan` | Abschluss |
| Danceflow Night | `/events/danceflow-night` | Lead, Album Danceflow Nights, Abschluss |
| CHF 190 | `/preise` | Abschluss |
| unsere Kurse | `/tanzkurse` | Album Kurse und Studio |
| unser Team | `/team` | Album Shows und Auftritte |
| Bild melden | `/kontakt` | Personen-Block |

Pflicht laut SEO-Plan: `/fotos` verlinkt auf Kurse, nicht nur auf sich selbst ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:243)).

---

## 13. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| FOTO-01 | Rechte und Credits Urs Müller / Valentin Behringer | betroffene Bilder nicht übernehmen |
| FOTO-02 | Formulierung der Bild-Entfernung | Standardsatz aus Abschnitt 9 |
| FOTO-03 | Album-Datumsangaben je Album (Monat und Jahr) | nur Jahr anzeigen |
| L-01 | Herkunft der Composite-Bilder | nicht verwenden; Lead-Satz 2 in der neutralen Fassung |

## 14. Abnahme

- Alben statt Bilderwand, neueste zuerst.
- Filter-Chips als Buttons, Zustand in der Adresse, kein leerer Chip.
- Grossansicht mit Escape, Pfeiltasten, Fokusfalle und beschrifteten Buttons.
- Alt-Text-Regel für Massenbilder definiert, kein pauschales `alt=""`.
- Event-Alt-Texte nur aus der zugelassenen Liste; keine Namen, keine Rollen, keine geratenen Zahlen.
- Kein Bild mit fremdem Wasserzeichen.
- Kein Bild ungeklärter Herkunft.
- Sichtbarer Weg, ein Bild entfernen zu lassen.
- Genau eine H1 auf `/fotos`, genau eine H1 je Albumseite.
- Title ≤ 60, Description ≤ 155 Zeichen.
- Galerie führt in den Kursplan und endet mit einem warmen Satz.

## 15. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Kopf, danach Filter-Chip-Reihe, danach Album-Kacheln mit Titelbild, Titel, Jahr und Bildanzahl; neueste zuerst. Albumseite als Raster mit Grossansicht, nicht als endlose Einzelbildwand.
- Credits und Bildentfernungs-Hinweis pro betroffenem Album sichtbar; Personen-Block einmal auf `/fotos` unter den Alben.

### Buttons, Hover und Icons
- Chips als `rounded-full`-Buttons mit `aria-pressed`; aktiver Chip in `#ad1827`. Albumkachel Hover: feiner Crop/Border-Wechsel; Grossansicht mit beschrifteten Zurück/Weiter/Schliessen-Buttons.
- Lucide: `Images`, `ChevronLeft`, `ChevronRight`, `X`, `ExternalLink`, `MessageCircle`; Icon-Buttons immer mit Label oder zugänglichem Namen.

### Motion und Zustände
- Bilder laden gestuft beim Scrollen; Lightbox ohne Bounce und ohne Autoplay. Reduced Motion sofort. Laden, leer, Filter-ohne-Treffer, Fehler, Nachladen, Album-Ende und Escape/Klick-aussen abdecken.
- Filterwechsel ohne Neuladen und ohne Scrollsprung.

### Assets und Alt
- Nur rechtlich freigegebene Galerie-Bilder; Wasserzeichen- und Herkunftsrisiko-Assets ausschliessen. Massenbilder folgen der Album-Text-plus-Nummer-Regel, dekorative Bilder und Album-Titelbilder `alt=""`.
- Event-Alt-Texte aus der Liste in Abschnitt 7; nie Namen oder Rollen.

### Mockup-Brief
- Felder: Filter-Chips (Label, aktiv, Trefferzahl); Album; Titelbild/Alt; Jahr; Anzahl; Album-Beschreibung; Credit; Rechte; Grid; Lightbox-Steuerung mit Zähler; Loading/Empty/No-Match/Error/Ende; Entfernen-Hinweis; FOTO-01/FOTO-02/FOTO-03/L-01.
