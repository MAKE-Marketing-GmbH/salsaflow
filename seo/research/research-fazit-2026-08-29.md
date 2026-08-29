# SEO-Research Salsaflow — Fazit 29.08.2026

Quelle: DataForSEO (Google Ads Search Volume CH + Live-SERP Basel-Stadt + Labs Keyword
Suggestions CH). Rohdaten in diesem Ordner:

- `dfs-search-volume-2026-08-29.json` — 20 Seed-Keywords, Volumen Schweiz
- `dfs-serp-tanzschule-basel-2026-08-29.json` — Live-SERP Basel-Stadt, Desktop, Tiefe 20
- `dfs-serp-salsa-kurs-basel-2026-08-29.json` — Live-SERP Basel-Stadt, Desktop, Tiefe 20
- `dfs-suggestions-salsa-2026-08-29.json` / `dfs-suggestions-tanzkurs-2026-08-29.json`

## Ist-Rankings (SERP-Ausriss 29.08.2026, Standort Basel-Stadt)

| Query | Local Pack | Organisch |
|---|---|---|
| salsa kurs basel (70/Mt) | **#1 Salsaflow Dance Company GmbH** | **#4 www.salsaflow-dc.com** (Jimdo-Altsite) |
| tanzschule basel (480/Mt) | nicht im Pack (Pack: Jitterbugs, NDC, KC Dance) | **#6 www.salsaflow-dc.com** (Jimdo-Altsite) |

Konsequenz: Die Domain hat bereits Equity. Der DNS-Cutover (Domain zeigt noch auf Jimdo)
ist der größte einzelne SEO-Hebel — er ersetzt eine schwache Altseite durch die neue,
technisch saubere Site auf derselben Domain. Vor dem Cutover ist jedes On-Page-Investment
nur auf salsaflow-dc.vercel.app wirksam, und das ist absichtlich noindex.

## Volumen-Kernbild (Schweiz, Google Ads)

- heels dance 1000 · bachata basel 590 · tanzschule basel 480 · salsa basel 260
- tanzkurs/tanzkurse basel je 170 · salsa kurs basel 70 · salsa party basel 40
- bachata kurs basel 30 · salsa lernen 30 · bachata lernen 30 · tanzpartner finden 30
- tanzschuhe damen salsa 40 · salsa oder bachata 10 · hochzeitstanz basel: kein Messwert
- Aus Suggestions: bachata tanzkurs 170 · tanzkurs für paare 170 · tanzkurs für singles 110
  · anfänger tanzkurs 70 · tanzkurs in der nähe 260 (generisch)

## Abgeleitete Content-Entscheidungen (Ratgeber-Cluster unter /mehr/*)

1. **/mehr/salsa-lernen** — „Salsa lernen für Anfänger" (salsa lernen, salsa tanzen lernen,
   anfänger tanzkurs, tanzkurs für singles/paare als Sektionen). Extrahierbare Struktur:
   Definitionsblock, Schritt-für-Schritt, FAQ — bedient Google und KI-Engines gleichermaßen.
2. **/mehr/salsa-oder-bachata** — Vergleichsseite mit echter Vergleichstabelle
   (KI-Extraktion bevorzugt Tabellen für „X vs Y"), verlinkt beide Stilseiten.
3. **/mehr/hochzeitstanz** — Hochzeitstanz Basel (kein Messvolumen, aber hoher
   Auftragswert; Privatstunden-Seite nennt Hochzeitstanz bereits als Use-Case).

Bestehende Seiten tragen die Kern-Keywords bereits korrekt (Titles geprüft im SEO-Audit
28.08.). Kein Keyword-Kannibalismus: Ratgeber zielen auf informationale Queries, die
Kurs-/Stilseiten auf transaktionale.

## KI-Sichtbarkeit (aus skills/seo/references/ideen-ai-sichtbarkeit-aeo.md)

- Kein Spezial-Markup für Google AI Overviews — normales, sauberes SEO reicht dort.
- Für ChatGPT/Perplexity/Copilot: extrahierbare Passagen (40–60-Wort-Kernsätze,
  134–167-Wort-Absätze), FAQ-Blöcke, Vergleichstabellen, Antwort im ersten Drittel.
- robots.txt darf GPTBot/PerplexityBot/ClaudeBot/Google-Extended nicht blocken (Ist: erlaubt alles ✓).
- llms.txt existiert bereits; niedrige Priorität, kein belegtes Signal.
- Messkonzept: monatlich 10–20 Queries in ChatGPT/Perplexity/Google prüfen, Tabelle
  Query × Engine × zitiert. Erst nach DNS-Cutover sinnvoll.
