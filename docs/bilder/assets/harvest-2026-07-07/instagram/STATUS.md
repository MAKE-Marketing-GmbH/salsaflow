# Instagram Harvest — BLOCKIERT

Ziel: Fotos von https://www.instagram.com/salsaflowdc/ herunterladen.

## Status: fehlgeschlagen (Apify-Konto-Limit)

Zwei Apify-Actors probiert, beide mit demselben Fehler:
- `apify~instagram-scraper` -> `platform-feature-disabled: Monthly usage hard limit exceeded`
- `apify~instagram-post-scraper` -> gleicher Fehler

Bestaetigt per `GET /v2/users/me/limits`:
- `maxMonthlyUsageUsd`: 29
- aktueller `monthlyUsageUsd`: 30.52 (Limit bereits ueberschritten)
- Abrechnungszyklus endet: 2026-07-09T23:59:59Z

Das ist ein Account-weites Hard-Limit, kein Actor-spezifisches Problem. Kein Workaround ohne Limit-Erhoehung oder Warten bis zum Zyklus-Ende (2026-07-09).

Rohdaten der Fehlerantworten liegen als `_raw_posts.json` und `_raw_posts2.json` in diesem Ordner.

## Naechste Schritte (Optionen fuer Raphael)
1. Warten bis 2026-07-09 (neuer Abrechnungszyklus), dann Task erneut starten.
2. Apify-Monatslimit manuell erhoehen (im Apify-Dashboard unter Billing/Limits).
3. Alternativen Weg nutzen (z.B. anderer Apify-Account/Token, oder manueller Screenshot-Export).
