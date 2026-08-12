# 01c — Research-Critic (adversarial)

**Run-ID:** `wf_c3729fb9-2f4`  
**Rolle:** sol-pruefer (read-only — Inhalt aus StructuredOutput recovered)  
**Status:** Prüfung gelaufen; Datei nachträglich aus Journal geschrieben.

---

FAIL

Der geforderte Bericht `/root/clients/salsaflow-dc/website-plan/01c-research-critic.md` wurde nicht geschrieben, weil diese Prüferrolle laut Harness strikt read-only ist. Die Prüfung selbst ist weitgehend abgeschlossen. Beim Screenshot-Lauf wurden jedoch sieben Beleg-PNGs erzeugt; weitere Änderungen habe ich gestoppt.

Befunde

1. BLOCKER — Frozen Rules widersprechen sich beim Backend.
- `/root/clients/salsaflow-dc/DECISIONS.md:11` sagt ausdrücklich: „Kein Supabase“.
- `/root/clients/salsaflow-dc/ARCHITEKTUR.md:57-79` erklärt Supabase, Supabase Auth, RLS und Edge Functions zur Erstwahl.
- Der Meta-Plan übernimmt in `/root/clients/salsaflow-dc/website-plan/00-meta-plan.md:157` Supabase/RLS als zwingende DoD-Regel. Das ist nicht zugleich mit DECISIONS erfüllbar.
- Der echte Repo-Stand nutzt Hono + Drizzle sowie PGlite/Postgres (`/root/clients/salsaflow-dc/server/app.ts`, `/root/clients/salsaflow-dc/db/client.ts`).
- Ship-Gate: FAIL, bis eine kanonische Regel festlegt, ob DECISIONS oder ARCHITEKTUR für Hosting/Auth gewinnt. Booking-Fachlogik wie serverseitige Kapazitätsprüfung, Warteliste und bestätigender Stripe-Webhook kann unabhängig davon erhalten bleiben.

2. Live-Site und aktuelle Vercel-Site sind sauber identifiziert.
- Live `https://www.salsaflow-dc.com/` antwortete am 12.08.2026 mit Cloudflare/Jimdo (`x-jimdo-wid`) und HTTP 200.
- Vercel-Projekt: `prj_nz1DH3loOu2mjNONyXVvZ8pBzkHb`.
- Neueste Preview: `https://salsaflow-ir6dubp31-raphael-2645s-projects.vercel.app`, Deployment `dpl_7uHxAU7iXrgQP3EVVtnjQn1jayQ3`, erstellt 11.08.2026 15:40 UTC.
- Neueste Production: `https://salsaflow-1cb9wgrkx-raphael-2645s-projects.vercel.app`, Deployment `dpl_AhDW8BEnSQbjNPpizAA9mqHXN7jm`, erstellt 11.08.2026 11:12 UTC.
- Vercel führt die Live-Domains bereits als Aliases, während der öffentliche Abruf noch Jimdo liefert. Das muss im Migrationsplan als DNS-/Umschaltzustand behandelt werden, nicht als identische Site.

3. Harte Kritik an der Jimdo-Live-Site.
- Der Cookie-Dialog verdeckt auf Desktop und Mobile einen grossen Teil des ersten Screens und konkurriert sofort mit Navigation und Inhalt.
- Die Startseite ist keine klare Einstiegseite, sondern ein langer News-/Flyer-Feed. Kursstart, Workshops, Eventplakate und Collabs stehen ohne erkennbare Priorisierung untereinander.
- Primäre Nutzeraufgaben — Tanzstil wählen, passenden Kurs finden, Schnupperstunde buchen — sind im ersten Screen nicht klar geführt.
- Auf Desktop nutzt der Inhalt nur einen schmalen Mittelstreifen; Navigation und Text sind klein. Auf Mobile werden grosse Flyer nacheinander gestapelt.
- Die Live-Fotoseite zeigt starke, authentische Eventmotive in hoher visueller Qualität, ist aber eine alte Slider-/Thumbnail-Struktur ohne moderne Filterung, Motivkontext oder klare Bildauswahl für konkrete Seitenfunktionen.

4. Harte Kritik an der Vercel-Site.
- Die visuelle Qualität ist gegenüber Jimdo deutlich höher: echte Menschen, klare Hierarchie, Cal-Sans/Afacad-Richtung, sparsame rote Aktionselemente und konsistente Pill-CTAs sind in den Screenshots erkennbar.
- Die Homepage ist trotzdem überlang: gemessen 10.973 px bei 1440×1000 und 15.247 px bei 390×844. Mobile ist damit deutlich länger als die Jimdo-Startseite mit 8.900 px.
- Viele Sektionen wiederholen dieselbe Kernbotschaft: passender Tanz, erster Schritt, Community, Bewertungen, Anfänger, Team, Preis, FAQ, Standort und Social Feed. Das schwächt Orientierung trotz guter Einzelgestaltung.
- Kritischer IA-Test: Jede Home-Sektion muss nachweisen, dass sie eine neue Nutzerfrage beantwortet oder die nächste Aktion erleichtert. Sonst streichen oder auf eine Zielseite verschieben.
- Zahlen wie „4,9“, „104“, „seit 2018“, „drei Studios“ und „rund 40 Kurse pro Woche“ sind prominent. Google-Zahl und Reviewtexte haben einen Repo-Harvest, aber zeitabhängige Zahlen brauchen vor Veröffentlichung einen Aktualitäts-Check. Die Quelle liegt unter `/root/clients/salsaflow-dc/docs/bilder/assets/harvest-2026-07-07/google-reviews/`; der Kommentar in `/root/clients/salsaflow-dc/src/public/site/reviews.ts:2` nennt einen unvollständigen/falschen Pfad.

5. Privatstunden-Bildproblem: Die behauptete Root Cause „low-res“ ist widerlegt.
- `/root/clients/salsaflow-dc/public/photos/premium/offer-privat-1200.webp`: 1200×1600, 159.044 Bytes.
- `/root/clients/salsaflow-dc/public/photos/premium/offer-privat-wide-original-v2.webp`: 1800×1200, 149.532 Bytes.
- `/root/clients/salsaflow-dc/public/photos/premium/offer-privat-square-1200.webp`: 1200×1200, 44.998 Bytes.
- Das sichtbare Problem ist nicht die nominelle Pixelzahl, sondern Motiv, weiche Detailzeichnung/Kompression und Wiederholung desselben älteren Lehrer-Schüler-Motivs im Hero und Prozessabschnitt.
- Ein blinder Austausch gegen Partybilder aus `/fotos-1/` wäre fachlich falsch. Die Ersatzbilder müssen eindeutig 1:1-Korrektur, Paarunterricht oder Hochzeitstanz zeigen und einen Desktop-/Mobile-Crop tragen.
- Zusätzlicher Alt-Text-/Semantikfehler: `/root/clients/salsaflow-dc/src/public/CoursesPage.tsx:813-818` nutzt `/photos/gallery/kurse/05.jpg` und behauptet im Alt-Text „Tanzpaar bei einer Privatstunde“. Dasselbe Asset wird in `/root/clients/salsaflow-dc/src/public/gallery/content.ts:160` neutral als Tanzpaar im Kurs beschrieben. Der Privatstunden-Kontext ist nicht belegt und darf nicht im Alt-Text behauptet werden.
- Die Alt-Texte `/root/clients/salsaflow-dc/src/public/privat/content.ts:112` und `:147` behaupten „Salsaflow Studio“ beziehungsweise „Salsaflow Unterricht“. Das ist nur zulässig, wenn Motivherkunft und Ort redaktionell bestätigt sind.

6. Asset-Quelle `/fotos-1/` richtig nutzen.
- Die Galerie belegt hochwertige, lebendige Event-/Community-Fotografie und ist als Qualitätsreferenz geeignet.
- Sie belegt nicht automatisch Privatunterricht, konkrete Personenrollen oder Nutzungsrechte für jede Relaunch-Fläche.
- Planregel: Motiv zuerst semantisch zuordnen, dann Originaldatei/volle Jimdo-Quelle sichern, Dimension und Crop prüfen, Freigabe dokumentieren. Keine Thumbnail- oder Screenshot-Übernahme.

7. Booking-/Backend-Plan: fachliche Mindestlogik.
- Öffentliche Kurswahl und private Teilnehmerdaten strikt trennen.
- Kurs, Rolle, Solo/Paar, Tarif und Kapazität serverseitig und transaktional prüfen.
- Bei freiem Platz `pending_payment` mit Frist; bei voller Rolle `waitlisted` mit Position.
- Erst ein signaturgeprüfter, idempotent verarbeiteter Stripe-Webhook darf `confirmed` setzen.
- Ablauf/Storno gibt Plätze frei und triggert Wartelisten-Nachrücken; Payment-Fehler dürfen keine bestätigte Buchung erzeugen.
- UI braucht loading, empty, error, success, disabled/submitting, Warteliste, Zahlungsabbruch und Rückkehrzustände.
- Diese Fachlogik ist planbar. Hosting/Auth darf wegen des Frozen-Rule-Konflikts nicht als entschieden behauptet werden.

8. IA-/SEO-/AEO-Gate.
- Home auf Orientierung und drei Wege reduzieren: Tanzstil/Kurs finden, Schnupperstunde, Privatstunden/anderes Anliegen.
- Zielseiten tragen die Tiefe: `/tanzkurse`, Stilseiten, `/privatstunden`, `/events`, `/team`, `/kontakt`, `/faq`.
- Jede indexierbare Route: eine Suchintention, eine H1, eine primäre CTA, sichtbare belegte Antworten zu Ort, Preis, Einstieg, Rolle und Ablauf.
- Review-/Rating-Schema nur aus aktuell verifizierter Originalquelle. Event-/Course-Schema nur aus publizierten Daten. Keine erfundenen Availability-, Preis- oder Proof-Werte.

Befehle und Ausgaben

- `vercel project inspect salsaflow-dc --scope team_ZObdHHoO8QzijkhDiBcoN3zE` → Projekt gefunden, Framework Vite, Build `npm run build`, Output `dist`.
- `vercel list salsaflow-dc --scope team_ZObdHHoO8QzijkhDiBcoN3zE` → Preview und Production Ready; URLs und Zeitpunkte oben.
- `curl -sSIL https://www.salsaflow-dc.com/` → HTTP/2 200, `server: cloudflare`, `x-jimdo-wid`.
- `curl -sSIL https://salsaflow-ir6dubp31-raphael-2645s-projects.vercel.app/` → HTTP/2 200, `server: Vercel`, `x-vercel-cache: HIT`.
- Playwright über CDP `127.0.0.1:9222` → sieben Full-Page-Screenshots; alle Seiten meldeten HTTP 200. Der Prozess lief nach dem letzten erfolgreichen Screenshot beim Schliessen in das 600-Sekunden-Timeout und endete mit Code 143. Die Dateien selbst wurden vollständig geschrieben und gelesen.
- Sharp-Messung → Privatstunden-Dimensionen wie oben; damit ist „low-res“ als technische Ursache nicht belegt.
- `grep` gegen DECISIONS/ARCHITEKTUR/db/server → Supabase-Konflikt und aktueller Hono/PGlite/Drizzle-Stand mechanisch bestätigt.

Modellroute
- Prüfermodell: `gpt-5.6-sol`, adversarial Research-Critic, keine Subagenten.

Verbleibende Risiken
- Kein vollständiger Alt-Text-Inventarscan aller öffentlichen Routen in diesem Paket; nur die besonders kritischen Privatstunden-Fälle wurden geprüft.
- Live-Galerie-Originale wurden nicht vollständig gegen alle Repo-Hashes gemappt.
- Reviewzahlen stammen aus einem Harvest vom 07.07.2026 und können inzwischen veraltet sein.
- Der gewünschte Markdown-Bericht fehlt wegen der read-only-Grenze; die obigen Befunde müssen vom schreibberechtigten Workflow in die Zieldatei übernommen werden.
