# 11 — Fotos `/fotos`

**Status:** FINAL (Copy humanisiert 2026-08-12)
**Priorität:** P1
**Job:** Beweisen, dass es diese Community wirklich gibt. Bilder sind hier der Ersatz für die Bewertungen, die wir nicht zeigen dürfen.
**Nav-Label:** FOTOS (Kunden-Baseline)
**Primärer CTA:** Kursplan ansehen

---

## 1. Meta

```text
Title:       Fotos — Kurse, Partys und Events | Salsaflow Basel
Description: Bilder aus unseren Kursen, von den Danceflow Nights und
             unseren Events in Basel.
```

## 2. Warum diese Seite wichtiger ist, als sie aussieht

Es gibt keine freigegebenen Bewertungszitate (P-02, [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:34-44)). Die „Wall of Love"-Fläche entfällt deshalb sitewide. Was bleibt, um Vertrauen zu zeigen: echte Bilder von echten Abenden mit echten Leuten.

Eine Galerie ist damit kein Deko-Anhängsel, sondern der einzige Sozialbeweis, den die Seite ehrlich führen kann.

---

## 3. Kopf

```text
H1:    Fotos
Lead:  Bilder aus unseren Kursen, von den Danceflow Nights und von unseren
       Events. Wenn du wissen willst, wie es bei uns aussieht — hier.
```

Kein Satz über „unvergessliche Momente". Die Bilder machen die Arbeit.

---

## 4. Aufbau

Ordner statt einer endlosen Bilderwand. Der Kunde hat es genau so beschrieben: viele Ordner von verschiedenen Events und Kursen, neue Eventbilder flexibel ergänzbar ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:38-39)).

```text
H2:  Alben
```

Pro Album eine Kachel: Titelbild, Titel, Jahr, Anzahl Bilder.

```text
Danceflow Nights
Kurse und Studio
FLOWeekend
Anniversary Weekend
Shows und Auftritte
```

Klick öffnet das Album, nicht ein Einzelbild.

### Sortierung

Neueste Alben oben. Ein Album von 2023 als erstes zu zeigen, lässt die Schule inaktiv wirken — auf der Live-Seite sind Event-Blöcke von 2023 belegt (P12).

---

## 5. Im Album

- Raster, klickbar zur Grossansicht.
- Grossansicht mit Weiter- und Zurück-Taste, schliessbar mit Escape und Klick daneben.
- Bilder werden nachgeladen, während man scrollt — eine Galerie mit 200 Bildern darf nicht 200 Bilder auf einmal laden.
- Kein automatischer Diashow-Ablauf.
- Kein Rechtsklick-Schutz. Er verhindert nichts und ärgert Leute.

### Zustände

| Zustand | Text |
|---|---|
| Lädt | `Bilder werden geladen …` |
| Album leer | `In diesem Album sind noch keine Bilder.` |
| Fehler | `Die Bilder lassen sich gerade nicht laden. Versuch es später noch einmal.` |

---

## 6. Alt-Texte

Der schwierigste Teil dieser Seite. Eine Galerie mit hunderten Bildern kann keine handgeschriebenen Alt-Texte pro Bild haben — aber `alt=""` für alles ist auch falsch, weil die Bilder Inhalt sind.

**Die Regel:**

| Fall | Alt-Text |
|---|---|
| Bild trägt eigene Aussage (Gruppenbild, Auftritt, Studioansicht) | eigener, bildgenauer Text |
| Bild ist eines von vielen aus demselben Anlass | Album-Text plus Nummer: `Danceflow Night, Bild 12 von 40.` |
| Reines Stimmungsbild ohne Informationswert | `alt=""` |

Verboten bleibt in allen Fällen: geratene Namen, Keyword-Stapelung, „Bild von" ([`05b-copy-style.md`](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md:258-265)).

Die Album-Beschreibung übernimmt damit die Arbeit, die 200 Einzeltexte nicht leisten können. Sie muss deshalb konkret sein:

```text
Danceflow Night, Oktober 2026 — Salsa- und Bachata-Floor in unserem Studio
an der Elisabethenanlage.
```

---

## 7. Fotografen-Credits

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

## 8. Personen auf Bildern

Die Live-AGB regeln Foto- und Videonutzung restriktiv ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:65)). Für die Galerie heisst das:

- Kursteilnehmende sind erkennbar abgebildet. Es braucht eine Regel, wie jemand ein Bild entfernen lassen kann.
- Diese Regel gehört sichtbar auf die Seite, nicht versteckt in die Datenschutzerklärung:

```text
Du bist auf einem Bild und möchtest es nicht hier haben? Schreib uns kurz,
wir nehmen es raus.
```

Dieser Satz kostet nichts und löst ein echtes Problem. → **Entscheidung FOTO-02** nur zur Formulierung, nicht zur Sache — die Möglichkeit muss es geben.

---

## 9. Ausgeschlossene Bilder

- `show-04`, `show-22` — fremdes „Bail Adoro"-Wasserzeichen.
- `show-15` — fremdes Event-Logo.
- `/composites/heels-shoes-stilllife.webp` und `/composites/hero-stage.webp` — Herkunft ungeklärt, EXIF vollständig entfernt, der abgebildete Raum entspricht nicht dem Salsaflow-Studio (L-01).

Belegt in [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:58-73).

In einer Galerie wiegt der letzte Punkt besonders schwer: Hier liest man jedes Bild als „so ist es bei Salsaflow". Ein Stock- oder KI-Bild an dieser Stelle ist eine Irreführung, nicht nur ein Stilfehler.

---

## 10. Abschluss

```text
H2:       Willst du auf dem nächsten Bild dabei sein?
Primary:  Kursplan ansehen        →  /kursplan
Secondary: Danceflow Night ansehen →  /events/danceflow-night
```

---

## 11. Interne Links

`/kursplan`, `/events/danceflow-night`, `/events`, `/tanzkurse`, `/team`, `/kontakt`.

Pflicht laut SEO-Plan: `/fotos` verlinkt auf Kurse, nicht nur auf sich selbst ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:243)).

---

## 12. Offene Entscheidungen

| ID | Frage | Ohne Antwort |
|---|---|---|
| FOTO-01 | Rechte und Credits Urs Müller / Valentin Behringer | betroffene Bilder nicht übernehmen |
| FOTO-02 | Formulierung der Bild-Entfernung | Standardsatz aus 8 |
| L-01 | Herkunft der Composite-Bilder | nicht verwenden |

## 13. Abnahme

- Alben statt Bilderwand, neueste zuerst.
- Alt-Text-Regel für Massenbilder definiert, kein pauschales `alt=""`.
- Kein Bild mit fremdem Wasserzeichen.
- Kein Bild ungeklärter Herkunft.
- Sichtbarer Weg, ein Bild entfernen zu lassen.
- Galerie führt in den Kursplan.

## 13. Section-Spec — Layout, Interaktion und Mockup-Brief

### Layout
- Album-Kacheln mit Titelbild, Titel, Jahr und Bildanzahl; neueste zuerst. Albumseite als Raster mit Grossansicht, nicht als endlose Einzelbildwand.
- Credits und Bildentfernungs-Hinweis pro betroffenem Album sichtbar.

### Buttons, Hover und Icons
- Albumkachel Hover: feiner Crop/Border-Wechsel; Grossansicht mit beschrifteten Zurück/Weiter/Schliessen-Buttons.
- Lucide: `Images`, `ChevronLeft`, `ChevronRight`, `X`, `ExternalLink`, `MessageCircle`; Icon-Buttons immer mit Label oder zugänglichem Namen.

### Motion und Zustände
- Bilder laden gestuft beim Scrollen; Lightbox ohne Bounce und ohne Autoplay. Reduced Motion sofort. Laden, leer, Fehler und Escape/Klick-aussen abdecken.

### Assets und Alt
- Nur rechtlich freigegebene Galerie-Bilder; Wasserzeichen- und Herkunftsrisiko-Assets ausschliessen. Massenbilder folgen der Album-Text-plus-Nummer-Regel, dekorative Bilder `alt=""`.

### Mockup-Brief
- Felder: Album; Titelbild/Alt; Jahr; Anzahl; Credit; Rechte; Grid; Lightbox-Steuerung; Loading/Empty/Error; Entfernen-Hinweis; FOTO-01/FOTO-02/L-01.
