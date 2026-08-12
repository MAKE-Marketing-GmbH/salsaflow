# 05b — Copy-Style und Seitenstimme

**Status:** FINAL · IA-Lock 2026-08-12  
**Rolle:** IA-Lock  
**Modus:** Planning only — kein Production-Code  
**Firma:** Salsaflow Dance Company (Salsa Flow Basel)

## 0. Archetyp

**Archetyp: Die einladende Tanzpartnerin.**

Salsaflow spricht wie jemand, der dich an die Hand nimmt, den ersten Schritt zeigt und dich danach selbst tanzen lässt. Die Stimme ist warm, familiär, direkt und beweglich — nicht laut, nicht geschniegelt und nicht wie ein Verkaufstrichter.

**Begründung:**

1. Der Kunden-Eingang setzt Teamnähe, Kurse, Privatstunden, Shows, Gutschein und News nebeneinander; Copy muss deshalb Orientierung geben, ohne die Angebote zu vermischen ([`_kunden-sitemap-sfdc-struktur.md`](/root/clients/salsaflow-dc/website-plan/_kunden-sitemap-sfdc-struktur.md:44-55)).
2. Das gesicherte Markenbild ist familiär, entspannt, „siempre con flow“, mit Technik, Körpersprache, Musicality und Spass ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:200-214)).
3. Das Designsystem verlangt ein warmes, einladendes Du und verbietet kalte Template-Sprache, unbelegte Superlative und Claims ([`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md:34-43), [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:201-215)).

## 1. Sprachvertrag

| Regel | So schreiben wir | Nicht so |
|---|---|---|
| Ansprache | **Du**, direkt, freundlich | Sie, Ihr, passive Distanz |
| Ton | warm, klar, rhythmisch, konkret | Werbe-Buzzwords, Coaching-Sprech |
| Haltung | einladend und sicher | drängend, beschämend, künstlich euphorisch |
| Satzlänge | kurze Hauptsätze, gelegentlich ein längerer Bildsatz | verschachtelte Absätze |
| Verben | tanzen, entdecken, einsteigen, ausprobieren, buchen, anfragen | erleben, profitieren, maximieren, skalieren |
| Substantive | konkrete Dinge und Orte | abstrakte Nominalketten |
| Schweizer Schreibweise | **ss** statt ß; CHF statt € | deutsche ß-Schreibung, wechselnde Währung |
| Ort | Basel, Bahnhof SBB, Elisabethenanlage 7 nur belegbar einsetzen | pauschale „zentrale Lage“ ohne Kontext |
| Marke | Salsaflow Dance Company / Salsaflow | wechselnde Schreibweisen, Salsa Flow als alleinige Hauptmarke |

## 2. Copy-Archetyp in der Praxis

### 2.1 Hero

**Job:** In einem Blick sagen, was Salsaflow ist, wo es stattfindet und wie der nächste Schritt aussieht.

**Muster:**

```text
Eyebrow: SIEMPRE CON FLOW
H1: Tanzen lernen in Basel.
Lead: Salsa, Bachata und Heels — mit klaren Levels, echten Menschen und Platz für deinen eigenen Flow.
Primary: Probestunde anfragen
Secondary: Kursplan ansehen
```

Die Formulierung „Probestunde anfragen“ bleibt neutral, bis „gratis“ ausdrücklich bestätigt ist. Das ist kein Stilvorbehalt, sondern ein SEO- und Preis-Gate ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:201-215)).

### 2.2 Team + Über uns

**Job:** Vertrauen durch echte Menschen, nicht durch grosse Behauptungen.

**Muster:**

```text
Eyebrow: DAS SIND WIR
H2: Vier Menschen. Eine gemeinsame Tanzfläche.
Body: Wir unterrichten Salsa, Bachata und Heels mit Technik, Musikalität und Freude an Bewegung.
CTA: Unser Team kennenlernen
```

„Vier“ wird nur verwendet, wenn die konkrete Section tatsächlich die vier Gründer zeigt. Rollen, Namen und Erfahrung bleiben an den belegten Profilen; Meisterschaften, Awards und Zahlen ohne Nachweis entfallen ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:71-106)).

### 2.3 Angebot und Kurskalender

**Job:** Unsicherheit in eine passende Kurswahl übersetzen.

```text
H2: Dein nächster Kurs.
Lead: Neue und laufende Kurse findest du im Kursplan. Filtere nach Stil, Level und Termin.
CTA: Kursplan ansehen
Empty: Gerade keine passenden Kurse. Schreib uns auf WhatsApp — wir helfen dir beim Einstieg.
```

Keine freien Plätze, Termine oder Kurszahlen erfinden. Kapazität und Warteliste kommen aus dem serverseitigen Kursmodell ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:550-590)).

### 2.4 Reguläre Kurse

**Job:** Stil und Level verständlich machen.

```text
H2: Salsa, Bachata oder Heels?
Lead: Wähle deinen Stil und finde heraus, welcher Einstieg zu dir passt.
Salsa-Level: Beginner 1–6 · Beginner Flow · Intermediate 7–12 · Intermediate Flow · Advanced ab 13
Heels-Level: Beginner · Intermediate · Advanced
CTA: Alle Tanzkurse ansehen
```

„On1“ und „On2“ als Varianten erklären, nicht als zusätzliche Hauptkategorie. Flow wird als Übergangsstufe beschrieben, nicht als Geheimlevel ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:370-447)).

### 2.5 Sommerkurse

```text
Eyebrow: AUGUST
H2: Drei Wochen, ein intensiver Flow.
Body: Unsere Sommerkurse finden einmal im Jahr während drei Wochen im August statt. Der spezielle Preis und die aktuellen Daten stehen im Kursplan.
CTA: Sommerkurse im Kursplan
```

Konkrete Daten und Preise nur rendern, wenn sie im Kursbestand bestätigt sind. Keine künstliche Dringlichkeit.

### 2.6 Privatstunden

**Job:** Ein individuelles Ziel in eine persönliche Anfrage führen.

```text
H2: Ganz auf dich abgestimmt.
Lead: Privatstunden passen sich deinem Ziel, deinem Tempo und deinem Anlass an.
CTA: Privatstunde anfragen
Secondary: Ablauf und Preise
```

Geeignete Anlässe können Technik, Einzeltraining, Paare und — nur bei bestätigtem aktivem Angebot — Hochzeitstanz sein. Kein Fake-Kalender, kein „sofort verfügbar“ und kein ungeeignetes Produktmotiv. P-01 ist als Launch-Blocker belegt ([`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-32)).

### 2.7 Shows und Animationen

**Job:** Firmen- und Eventkunden schnell zu einer Anfrage bringen.

```text
H2: Bewegung, die zu deinem Anlass passt.
Lead: Shows und Tanzanimationen planen wir passend zu deinem Event.
CTA: Show anfragen
Secondary: Kontakt aufnehmen
```

Keine Party-Sprache für B2B und keine Awards, Reichweiten oder Kundenlogos ohne Nachweis. Die Seite bleibt eine eigene Suchabsicht.

### 2.8 Geschenkgutschein

**Job:** Produkt und nächster Schritt ohne Versprechen aufblasen.

```text
H2: Tanz verschenken.
Lead: Ein Gutschein für gemeinsame Zeit, Bewegung und deinen nächsten Flow.
CTA: Gutschein anfragen
```

Preis, Gültigkeit, Zustellung und Einlösung sind `PLACEHOLDER`, bis sie bestätigt sind. Keine Kauf- oder Checkout-Behauptung ohne Backend-Spec.

### 2.9 News und Events

**Job:** Aktualität zeigen, ohne alte Termine zu behaupten.

```text
H2: Was als Nächstes ansteht.
Lead: Neue Kurse, Workshops und Danceflow Nights — mit Datum, sobald es bestätigt ist.
CTA: Alle Events ansehen
```

Ein Event bekommt nur dann konkretes Datum und Event-Markup, wenn die Primärquelle vorliegt. Sonst Rhythmus oder `PLACEHOLDER` verwenden ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:295-317)).

## 3. Seitenspezifische Copy-Regeln

### Tanzkurse / Salsa / Bachata / Heels

- Erste Antwort: Für wen ist der Stil?
- Danach: Partner nötig oder Solo möglich?
- Danach: Level, Preise, Termine.
- H1 und Meta-Title besetzen jeweils eine eigene Suchabsicht.
- CTA-Reihenfolge: Level verstehen → Preise prüfen → Kursplan → Buchung.

### Events & Workshops

- Danceflow Night, Anniversary Weekend, FLOWeekend und Kalender klar trennen.
- Keine abgelaufenen Jahreszahlen als dauerhafte Navigation.
- Bei fehlendem Datum: keine Event-Schema-Daten.

### Team und Fotos

- Bildgenaue Alt-Texte, keine geratenen Namen.
- Teamprofile verwenden nur belegte Rollen und Bios.
- Fotos sind Atmosphäre und Beleg echter Community, kein Review-Ersatz.

### Kontakt

```text
H1: Komm vorbei oder schreib uns.
Lead: Du findest uns an der Elisabethenanlage 7 im 1. Stock, direkt beim Bahnhof Basel SBB.
CTA: Nachricht senden
Secondary: WhatsApp schreiben
```

Öffnungszeiten nur bei Bestätigung. Adresse, E-Mail und Telefonnummern müssen sitewide identisch bleiben ([`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:20-44)).

### FAQ

Frage als H2, Antwort direkt darunter in ein bis zwei zitierfähigen Sätzen. Danach optional die Erklärung und ein Link zur passenden Geldseite. Das entspricht der AEO-Regel ([`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:321-367)).

## 4. CTA- und Claim-Lexikon

### Erlaubte Standard-CTAs

- Probestunde anfragen
- Kursplan ansehen
- Tanzkurs auswählen
- Level herausfinden
- Preise ansehen
- Privatstunde anfragen
- Show anfragen
- Gutschein anfragen
- Team kennenlernen
- WhatsApp schreiben
- Kontakt aufnehmen

### Gesperrte oder belegpflichtige Formulierungen

- Gratis / kostenlos / geht auf uns — bis Kundenbestätigung.
- Beste / grösste / einzige / #1 — ohne Primärbeleg.
- Rund 40 Kurse pro Woche — bis Zahlen bestätigt.
- Drei Studios — widersprüchlich; Standortzahl offen.
- Meisterschaften, Trophäen, Awards — ohne Jahr, Verband und Nachweis.
- „Sofort buchen“ bei Privatstunden — individueller Anfrageprozess.
- „Nächster Termin“ — nur mit bestätigtem Termin.

Beleg für die Claim-Sperren: [`04-seo-plan.md`](/root/clients/salsaflow-dc/website-plan/04-seo-plan.md:201-215) und [`01-firma-dossier.md`](/root/clients/salsaflow-dc/website-plan/01-firma-dossier.md:244-268).

## 5. Format- und Designanschluss

- Display-Schrift: **Cal Sans**; Fliesstext und UI: **Afacad**.
- Salsa-Rot `#ad1827` nur für Aktion und Akzent.
- Buttons als `rounded-full`; pro Section höchstens ein Primary-CTA.
- H1/H2/H3 kurz, balanciert und text-balance-fähig.
- Absätze kurz genug zum Scannen; Fakten als Tabelle, Liste oder klarer Block.
- Keine Textflächen als Dekoration; jede Section beantwortet einen Job.
- Ein warmer, familiärer Dialekt mit normalem Schweizer Hochdeutsch.

Beleg: [`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md:34-43), [`DESIGN.md`](/root/clients/salsaflow-dc/DESIGN.md:47-88).

## 6. Zustände und Backend-Hinweise für spätere Specs

Copy muss die fachlichen Zustände verständlich benennen:

| Zustand | Sichtbare Sprache |
|---|---|
| Laden | Kursplan wird geladen … |
| Leer | Keine passenden Kurse gefunden. Filter anpassen oder WhatsApp schreiben. |
| Fehler | Der Kursplan konnte nicht geladen werden. Bitte versuche es erneut oder schreib uns. |
| Frei | Plätze frei |
| Laufend | Quereinstieg möglich — nur wenn `allows_late_entry` bestätigt |
| Voll | Ausgebucht / Auf die Warteliste |
| Absenden | Wird gesendet … |
| Erfolg | Anfrage angekommen. Wir melden uns persönlich. |
| Zahlungsrückkehr | Zahlung erhalten; Bestätigung folgt nach serverseitiger Prüfung |

Die sichtbare Sprache darf keine private Kapazitäts- oder Personendaten offenlegen. `confirmed` wird nicht allein aus einer Browser-Rückkehr behauptet ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:627-629)).

## 7. Alt-Text-Stil

Schema für Register und spätere Implementierung:

```text
Datei | Route | Bildrolle | Alt DE | Alt EN | dekorativ | Quelle | Rechte/Credit | Freigabe
```

Regeln:

- Beschreibe, was sichtbar ist.
- Keine geratenen Namen oder Rollen.
- Kein „Bild von“.
- Kein Keyword-Stapeln.
- Dekorative Bilder erhalten `alt=""`.
- Privatstunden-Motiv darf nicht als Verkaufsbild bleiben, solange es das falsche Produkt zeigt.

Beleg: [`05-ia-entwurf-a.md`](/root/clients/salsaflow-dc/website-plan/05-ia-entwurf-a.md:369-387) und [`02b-asset-gaps.md`](/root/clients/salsaflow-dc/website-plan/02b-asset-gaps.md:21-32).

## 8. Abnahme

- Jede Prioritätsseite hat eine klare H1, einen kurzen Lead und genau einen primären nächsten Schritt.
- Alle Texte duzen und verwenden Schweizer ss-Schreibung.
- Keine unbelegten Gratis-, Mengen-, Studio-, Review-, Ranking- oder Termin-Claims.
- Kundenblöcke Team, Angebot/Kalender, Kurse, Privatstunden, Shows, Gutschein und News sind copyseitig vorgesehen.
- Copy erklärt Levels 1–13+, Flows, Heels B/I/A und Sommerkurse mit 3 Wochen Spezialpreis.
- WhatsApp ist als sitewide Kontaktweg vorgesehen.
- Alt-Texte und Bildrechte bleiben ein eigener Gate-Punkt.

**Ende des Copy-Style-Vertrags.**
