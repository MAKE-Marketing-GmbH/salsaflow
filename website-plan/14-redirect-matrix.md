# 14 — Redirect-Matrix (301, Cutover)

**Status:** PLAN FINAL · Blocker 4 aus [`13-final-critic.md`](/root/clients/salsaflow-dc/website-plan/13-final-critic.md)  
**Rolle:** Redirect-Matrix-Autor  
**Modus:** Planning only — kein Commit in `vercel.json`, kein DNS  
**Quellen:** [`03-seo-audit.md`](/root/clients/salsaflow-dc/website-plan/03-seo-audit.md:292-321), [`05-sitemap-ia.md`](/root/clients/salsaflow-dc/website-plan/05-sitemap-ia.md:79-86)  
**Live-Verifikation:** curl gegen `https://www.salsaflow-dc.com` am 2026-08-12  
**Ziel-IA:** kanonisch `/events/*` (nicht `/events-workshops/*`)

---

## 0. Vertrag

- Jede **bekannte Live-Adresse** bekommt **genau ein finales Ziel** (301, einstufig, keine Ketten).
- **Mit und ohne Trailing-Slash** sind abgedeckt (Live liefert heute beide Formen als 200).
- **Umlaut-Pfade** sind in Klarform und Prozent-kodiert gelistet (`ü` = `%C3%BC`).
- **Tippfehler** aus der Live-Site (`philisophie`, `anniverysary`) werden als Quelle akzeptiert, **nicht** als Ziel übernommen.
- **Kein pauschales 301 auf `/`** für bekannte Alt-Inhalte (IA-Lock).
- Ziel-URLs ohne Trailing-Slash (Repo-Konvention).

### 0.1 Bau-Gates vor DNS-Cutover

| Gate | Status Staging 2026-08-12 | Folge |
|---|---|---|
| Event-Detailseiten unter `/events/*` müssen 200 sein | `/events/danceflow-night`, `/events/floweekend`, `/events/anniversary-weekend`, `/events/kalender` = **404** | Route-Umzug im Repo **vor** Cutover; sonst landen 301s auf 404 |
| Altpfade `/events-workshops/*` | noch 200 | nach Umzug: 301 → `/events/*` |
| Englisch `/en` | **404** | `/home-en` temporär → `/` bis R-01; danach Matrix-Ziel auf `/en` ändern |
| AGB-Inhalt | Live `/infos/agb/` 200; Ziel `/impressum` | Impressum muss AGB-Inhalt tragen oder eigene `/agb` nachziehen |

---

## 1. Live-Verifikation (Ist-Zustand Jimdo)

Methode: `curl -sI --max-redirs 0` (Head) und `curl -sIL --max-redirs 5` (Follow).  
Host: `https://www.salsaflow-dc.com`.

### 1.1 Sitemap-Kern (21 URLs + Startseite = 22)

| # | Live-Pfad | HTTP (Head, 0 Redirects) | Follow final | Notiz |
|---|---|---|---|---|
| 1 | `/` | 200 | 200 | Start |
| 2 | `/kurse/` | 200 | 200 | auch ohne Slash 200 |
| 3 | `/kurse/preise/` | 200 | 200 | |
| 4 | `/kurse/privatstunden/` | 200 | 200 | |
| 5 | `/kurse/workshops/` | 200 | 200 | |
| 6 | `/kurse/shows-animationen/` | 200 | 200 | |
| 7 | `/angebot/` | 200 | 200 | |
| 8 | `/angebot/sommerkurse/` | 200 | 200 | |
| 9 | `/über-uns/` | 200 | 200 | Umlaut |
| 10 | `/über-uns/team/` | 200 | 200 | Umlaut |
| 11 | `/über-uns/philisophie/` | 200 | 200 | Tippfehler live |
| 12 | `/%C3%BCber-uns/` | 200 | 200 | kodierte Form |
| 13 | `/%C3%BCber-uns/team/` | 200 | 200 | kodierte Form |
| 14 | `/%C3%BCber-uns/philisophie/` | 200 | 200 | kodierte Form |
| 15 | `/kontakt/` | 200 | 200 | |
| 16 | `/kontakt/kontakt/` | 200 | 200 | Duplikat |
| 17 | `/kontakt/tanzstudio/` | 200 | 200 | |
| 18 | `/fotos-1/` | 200 | 200 | |
| 19 | `/infos/faq/` | 200 | 200 | |
| 20 | `/infos/agb/` | 200 | 200 | |
| 21 | `/events/` | 200 | 200 | |
| 22 | `/events/salsa-partys-in-basel/` | 200 | 200 | |
| 23 | `/floweekend-2026/` | 200 | 200 | |
| 24 | `/sfdc-anniverysaryweekend2026/` | 200 | 200 | Tippfehler live |
| 25 | `/home-en/` | 200 | 200 | EN, kein hreflang |

Hinweis: Die SEO-Tabelle zählt **22 logische Live-Adressen** (Umlaut einmal, kodiert als Variante). Die Zeilen 9–14 sind drei logische Pfade × zwei Schreibweisen.

### 1.2 Zusätzliche Live-200-Pfade (nicht in Sitemap, aber verlinkt/erreichbar)

| Live-Pfad | HTTP | Mapping-Empfehlung |
|---|---|---|
| `/angebot/anmeldeformular-kurse/` | 200 | `/buchung` |
| `/angebot/anmeldeformular-sommerkurse/` | 200 | `/buchung` |
| `/angebot/workshops/` | 200 | `/events` |
| `/floweekend-2026/anmeldeformular-floweekend-de/` | 200 | `/events/floweekend` |
| `/kurse/sfit-salsaflow-intensiv-training/` | 200 | `/tanzkurse` |
| `/sitemap/` | 200 | kein Content-Equity → Fallback-Regel |
| `/j/privacy` | 200 | `/datenschutz` (Jimdo-Privacy) |

---

## 2. Ausführbare 301-Matrix (Kern)

**Legende Spalten**

- **Quelle:** kanonischer Alt-Pfad (Jimdo-Form mit Slash, wie in Sitemap).
- **mit/ohne Slash:** beide Formen müssen 301 liefern (kein 200 auf Alt-Pfad).
- **kodiert:** nur bei Umlaut; sonst `—`.
- **Ziel:** genau EINE neue URL (ohne Trailing-Slash).
- **Ergebnis:** nach Cutover: Quelle → 301 → Ziel → 200 (einstufig).
- **Prüf-Befehl:** gegen die **neue** Production-Domain nach DNS (hier Platzhalter `https://www.salsaflow-dc.com`).

### 2.1 Kernmatrix (jede logische Live-URL genau einmal)

| # | Quelle (exakter Pfad) | mit / ohne Trailing-Slash | kodierte Variante | Ziel (genau eine URL) | erwartetes Ergebnis | Prüf-Befehl |
|---|---|---|---|---|---|---|
| 1 | `/` | nur `/` (identisch) | — | `/` | 200 (kein Redirect) | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/` |
| 2 | `/kurse/` | `/kurse` und `/kurse/` | — | `/tanzkurse` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kurse/` |
| 3 | `/kurse/preise/` | `/kurse/preise` und `/kurse/preise/` | — | `/preise` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kurse/preise/` |
| 4 | `/kurse/privatstunden/` | `/kurse/privatstunden` und `/kurse/privatstunden/` | — | `/privatstunden` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kurse/privatstunden/` |
| 5 | `/kurse/workshops/` | `/kurse/workshops` und `/kurse/workshops/` | — | `/events/danceflow-night` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kurse/workshops/` |
| 6 | `/kurse/shows-animationen/` | `/kurse/shows-animationen` und `/kurse/shows-animationen/` | — | `/shows-animationen` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kurse/shows-animationen/` |
| 7 | `/angebot/` | `/angebot` und `/angebot/` | — | `/tanzkurse` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/angebot/` |
| 8 | `/angebot/sommerkurse/` | `/angebot/sommerkurse` und `/angebot/sommerkurse/` | — | `/tanzkurse` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/angebot/sommerkurse/` |
| 9 | `/über-uns/` | `/über-uns` und `/über-uns/` | `/%C3%BCber-uns` und `/%C3%BCber-uns/` | `/team` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/%C3%BCber-uns/` |
| 10 | `/über-uns/team/` | `/über-uns/team` und `/über-uns/team/` | `/%C3%BCber-uns/team` und `/%C3%BCber-uns/team/` | `/team` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/%C3%BCber-uns/team/` |
| 11 | `/über-uns/philisophie/` | `/über-uns/philisophie` und `/über-uns/philisophie/` | `/%C3%BCber-uns/philisophie` und `/%C3%BCber-uns/philisophie/` | `/team` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/%C3%BCber-uns/philisophie/` |
| 12 | `/kontakt/` | `/kontakt` und `/kontakt/` | — | `/kontakt` | Slash-Form 301 → 200; kanonisch ohne Slash 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kontakt/` |
| 13 | `/kontakt/kontakt/` | `/kontakt/kontakt` und `/kontakt/kontakt/` | — | `/kontakt` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kontakt/kontakt/` |
| 14 | `/kontakt/tanzstudio/` | `/kontakt/tanzstudio` und `/kontakt/tanzstudio/` | — | `/kontakt/standort-raumvermietung` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kontakt/tanzstudio/` |
| 15 | `/fotos-1/` | `/fotos-1` und `/fotos-1/` | — | `/fotos` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/fotos-1/` |
| 16 | `/infos/faq/` | `/infos/faq` und `/infos/faq/` | — | `/faq` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/infos/faq/` |
| 17 | `/infos/agb/` | `/infos/agb` und `/infos/agb/` | — | `/impressum` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/infos/agb/` |
| 18 | `/events/` | `/events` und `/events/` | — | `/events` | Slash-Form 301 → 200; kanonisch ohne Slash 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/events/` |
| 19 | `/events/salsa-partys-in-basel/` | `/events/salsa-partys-in-basel` und `/events/salsa-partys-in-basel/` | — | `/mehr/partys` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/events/salsa-partys-in-basel/` |
| 20 | `/floweekend-2026/` | `/floweekend-2026` und `/floweekend-2026/` | — | `/events/floweekend` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/floweekend-2026/` |
| 21 | `/sfdc-anniverysaryweekend2026/` | `/sfdc-anniverysaryweekend2026` und `/sfdc-anniverysaryweekend2026/` | — | `/events/anniversary-weekend` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/sfdc-anniverysaryweekend2026/` |
| 22 | `/home-en/` | `/home-en` und `/home-en/` | — | `/` *(temporär bis R-01; danach `/en`)* | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/home-en/` |

**Kernzeilen gesamt: 22** (logische Live-Adressen, je einmal).

> **Cutover-Status:** Alle Zeilen mit Ziel unter `/events/*` (Kern #5, #20, #21, Zusatz Z3-Anteil, Repo R1–R5): Das Ziel existiert erst nach der Bauwelle — Abnahme dieser Zeilen ist erst beim Cutover möglich. Alle übrigen Ziele sind auf Staging bereits 200.


### 2.2 Zusatzmatrix (Live-200, ausserhalb Sitemap)

| # | Quelle | mit / ohne Slash | kodiert | Ziel | Ergebnis | Prüf-Befehl |
|---|---|---|---|---|---|---|
| Z1 | `/angebot/anmeldeformular-kurse/` | beide | — | `/buchung` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/angebot/anmeldeformular-kurse/` |
| Z2 | `/angebot/anmeldeformular-sommerkurse/` | beide | — | `/buchung` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/angebot/anmeldeformular-sommerkurse/` |
| Z3 | `/angebot/workshops/` | beide | — | `/events` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/angebot/workshops/` |
| Z4 | `/floweekend-2026/anmeldeformular-floweekend-de/` | beide | — | `/events/floweekend` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/floweekend-2026/anmeldeformular-floweekend-de/` |
| Z5 | `/kurse/sfit-salsaflow-intensiv-training/` | beide | — | `/tanzkurse` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/kurse/sfit-salsaflow-intensiv-training/` |
| Z6 | `/j/privacy` | `/j/privacy` (Jimdo-Form) | — | `/datenschutz` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/j/privacy` |

`/sitemap/` bleibt **ohne** speziellen Content-Redirect (siehe Fallback).

### 2.3 Interne Repo-Umzüge (Altpfad Staging → IA-Lock)

Gilt sobald Event-Seiten unter `/events/*` existieren. **Keine Kette** über Alt-Live + Alt-Repo.

| # | Quelle | mit / ohne Slash | Ziel | Ergebnis | Prüf-Befehl |
|---|---|---|---|---|---|
| R1 | `/events-workshops/danceflow-night` | beide | `/events/danceflow-night` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/events-workshops/danceflow-night` |
| R2 | `/events-workshops/floweekend` | beide | `/events/floweekend` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/events-workshops/floweekend` |
| R3 | `/events-workshops/anniversary-weekend` | beide | `/events/anniversary-weekend` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/events-workshops/anniversary-weekend` |
| R4 | `/events-workshops/kalender` | beide | `/events/kalender` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/events-workshops/kalender` |
| R5 | `/events-workshops` | beide | `/events` | 301 → 200 | `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.salsaflow-dc.com/events-workshops` |

### 2.4 Mapping-Korrektur gegenüber SEO-Audit

| Alt (03-seo-audit) | Neu (diese Matrix, IA-Lock) | Grund |
|---|---|---|
| `/kurse/workshops/` → `/events-workshops/danceflow-night` | → `/events/danceflow-night` | IA: `/events/*` kanonisch |
| `/floweekend-2026/` → `/events-workshops/floweekend` | → `/events/floweekend` | IA-Lock |
| `/sfdc-anniverysaryweekend2026/` → `/events-workshops/anniversary-weekend` | → `/events/anniversary-weekend` | IA-Lock + Tippfehler nicht erben |
| `/home-en/` → `/en` | → `/` temporär | `/en` staging 404; R-01 zuerst |

---

## 3. Fallback-Regel (unbekannte Pfade)

**Entscheidung: ehrliches HTTP 404** für unbekannte öffentliche Pfade. **Kein** pauschales 301 auf `/`.

**Begründung (2 Sätze):** Ein flächendeckendes 301 auf die Startseite erzeugt Soft-404s, verwässert Rankings und widerspricht dem IA-Lock («Kein pauschales Ziel `/`»). 410 eignet sich nur für bewusst und dauerhaft gelöschte Einzel-URLs mit nachgewiesenem Alt-Traffic; pauschal unbekanntes Material ist kein Lösch-Inventar, sondern «nicht vorhanden» → 404.

**Optional später:** einzelne totgelaufene Marketing-URLs mit messbarem Traffic gezielt auf das nächste thematische 200-Ziel mappen (nie blind auf `/`).

Technische Routen (`/buchung*`, `/admin`) bleiben wie spezifiziert `noindex` und sind **keine** Redirect-Ziele für Alt-Marketing-URLs ausser den Anmeldeformularen (Z1/Z2).

---

## 4. Referenz: `vercel.json`-Redirect-Snippet (Planung, kein Commit)

> Nur Referenz für den Implementierer. **Nicht** in Production committen, solange Event-Routen unter `/events/*` noch 404 sind und EN fehlt.

```json
{
  "redirects": [
    { "source": "/kurse", "destination": "/tanzkurse", "permanent": true },
    { "source": "/kurse/", "destination": "/tanzkurse", "permanent": true },
    { "source": "/kurse/preise", "destination": "/preise", "permanent": true },
    { "source": "/kurse/preise/", "destination": "/preise", "permanent": true },
    { "source": "/kurse/privatstunden", "destination": "/privatstunden", "permanent": true },
    { "source": "/kurse/privatstunden/", "destination": "/privatstunden", "permanent": true },
    { "source": "/kurse/workshops", "destination": "/events/danceflow-night", "permanent": true },
    { "source": "/kurse/workshops/", "destination": "/events/danceflow-night", "permanent": true },
    { "source": "/kurse/shows-animationen", "destination": "/shows-animationen", "permanent": true },
    { "source": "/kurse/shows-animationen/", "destination": "/shows-animationen", "permanent": true },
    { "source": "/kurse/sfit-salsaflow-intensiv-training", "destination": "/tanzkurse", "permanent": true },
    { "source": "/kurse/sfit-salsaflow-intensiv-training/", "destination": "/tanzkurse", "permanent": true },

    { "source": "/angebot", "destination": "/tanzkurse", "permanent": true },
    { "source": "/angebot/", "destination": "/tanzkurse", "permanent": true },
    { "source": "/angebot/sommerkurse", "destination": "/tanzkurse", "permanent": true },
    { "source": "/angebot/sommerkurse/", "destination": "/tanzkurse", "permanent": true },
    { "source": "/angebot/workshops", "destination": "/events", "permanent": true },
    { "source": "/angebot/workshops/", "destination": "/events", "permanent": true },
    { "source": "/angebot/anmeldeformular-kurse", "destination": "/buchung", "permanent": true },
    { "source": "/angebot/anmeldeformular-kurse/", "destination": "/buchung", "permanent": true },
    { "source": "/angebot/anmeldeformular-sommerkurse", "destination": "/buchung", "permanent": true },
    { "source": "/angebot/anmeldeformular-sommerkurse/", "destination": "/buchung", "permanent": true },

    { "source": "/über-uns", "destination": "/team", "permanent": true },
    { "source": "/über-uns/", "destination": "/team", "permanent": true },
    { "source": "/%C3%BCber-uns", "destination": "/team", "permanent": true },
    { "source": "/%C3%BCber-uns/", "destination": "/team", "permanent": true },
    { "source": "/über-uns/team", "destination": "/team", "permanent": true },
    { "source": "/über-uns/team/", "destination": "/team", "permanent": true },
    { "source": "/%C3%BCber-uns/team", "destination": "/team", "permanent": true },
    { "source": "/%C3%BCber-uns/team/", "destination": "/team", "permanent": true },
    { "source": "/über-uns/philisophie", "destination": "/team", "permanent": true },
    { "source": "/über-uns/philisophie/", "destination": "/team", "permanent": true },
    { "source": "/%C3%BCber-uns/philisophie", "destination": "/team", "permanent": true },
    { "source": "/%C3%BCber-uns/philisophie/", "destination": "/team", "permanent": true },

    { "source": "/kontakt/kontakt", "destination": "/kontakt", "permanent": true },
    { "source": "/kontakt/kontakt/", "destination": "/kontakt", "permanent": true },
    { "source": "/kontakt/tanzstudio", "destination": "/kontakt/standort-raumvermietung", "permanent": true },
    { "source": "/kontakt/tanzstudio/", "destination": "/kontakt/standort-raumvermietung", "permanent": true },

    { "source": "/fotos-1", "destination": "/fotos", "permanent": true },
    { "source": "/fotos-1/", "destination": "/fotos", "permanent": true },

    { "source": "/infos/faq", "destination": "/faq", "permanent": true },
    { "source": "/infos/faq/", "destination": "/faq", "permanent": true },
    { "source": "/infos/agb", "destination": "/impressum", "permanent": true },
    { "source": "/infos/agb/", "destination": "/impressum", "permanent": true },

    { "source": "/events/salsa-partys-in-basel", "destination": "/mehr/partys", "permanent": true },
    { "source": "/events/salsa-partys-in-basel/", "destination": "/mehr/partys", "permanent": true },

    { "source": "/floweekend-2026", "destination": "/events/floweekend", "permanent": true },
    { "source": "/floweekend-2026/", "destination": "/events/floweekend", "permanent": true },
    { "source": "/floweekend-2026/anmeldeformular-floweekend-de", "destination": "/events/floweekend", "permanent": true },
    { "source": "/floweekend-2026/anmeldeformular-floweekend-de/", "destination": "/events/floweekend", "permanent": true },

    { "source": "/sfdc-anniverysaryweekend2026", "destination": "/events/anniversary-weekend", "permanent": true },
    { "source": "/sfdc-anniverysaryweekend2026/", "destination": "/events/anniversary-weekend", "permanent": true },

    { "source": "/home-en", "destination": "/", "permanent": true },
    { "source": "/home-en/", "destination": "/", "permanent": true },

    { "source": "/j/privacy", "destination": "/datenschutz", "permanent": true },

    { "source": "/events-workshops", "destination": "/events", "permanent": true },
    { "source": "/events-workshops/", "destination": "/events", "permanent": true },
    { "source": "/events-workshops/danceflow-night", "destination": "/events/danceflow-night", "permanent": true },
    { "source": "/events-workshops/danceflow-night/", "destination": "/events/danceflow-night", "permanent": true },
    { "source": "/events-workshops/floweekend", "destination": "/events/floweekend", "permanent": true },
    { "source": "/events-workshops/floweekend/", "destination": "/events/floweekend", "permanent": true },
    { "source": "/events-workshops/anniversary-weekend", "destination": "/events/anniversary-weekend", "permanent": true },
    { "source": "/events-workshops/anniversary-weekend/", "destination": "/events/anniversary-weekend", "permanent": true },
    { "source": "/events-workshops/kalender", "destination": "/events/kalender", "permanent": true },
    { "source": "/events-workshops/kalender/", "destination": "/events/kalender", "permanent": true }
  ]
}
```

**Ketten-Vermeidung:** Beide Slash-Formen stehen **direkt** auf dem finalen Ziel.  
`trailingSlash: false` allein reicht nicht — sonst entstünde z. B. `/kurse/` → `/kurse` → `/tanzkurse` (2 Hops).  
Nach R-01: Zeilen `home-en` auf `"destination": "/en"` umstellen (nur wenn `/en` 200 liefert).

---

## 5. Abnahme-Checkliste (nach DNS-Cutover)

### 5.1 Voraussetzungen

- [ ] Event-Routen `/events/danceflow-night`, `/events/floweekend`, `/events/anniversary-weekend`, `/events/kalender` liefern **200** auf Production.
- [ ] Redirects aus Abschnitt 4 sind deployed (oder äquivalent in Next.js `redirects`).
- [ ] DNS zeigt auf Vercel; HTTPS gültig.
- [ ] `BASE=https://www.salsaflow-dc.com` (oder finale Domain) gesetzt.

### 5.2 Loop-Test (alle Matrix-Quellen)

```bash
#!/usr/bin/env bash
# redirect-abnahme.sh — nach Cutover ausführen
set -u
BASE="${BASE:-https://www.salsaflow-dc.com}"
FAIL=0

# Format: source|expected_final_path
ROWS=(
  "/kontakt/|/kontakt"
  "/events/|/events"
  "/kurse|/tanzkurse"
  "/kurse/|/tanzkurse"
  "/kurse/preise|/preise"
  "/kurse/preise/|/preise"
  "/kurse/privatstunden|/privatstunden"
  "/kurse/privatstunden/|/privatstunden"
  "/kurse/workshops|/events/danceflow-night"
  "/kurse/workshops/|/events/danceflow-night"
  "/kurse/shows-animationen|/shows-animationen"
  "/kurse/shows-animationen/|/shows-animationen"
  "/kurse/sfit-salsaflow-intensiv-training|/tanzkurse"
  "/kurse/sfit-salsaflow-intensiv-training/|/tanzkurse"
  "/angebot|/tanzkurse"
  "/angebot/|/tanzkurse"
  "/angebot/sommerkurse|/tanzkurse"
  "/angebot/sommerkurse/|/tanzkurse"
  "/angebot/workshops|/events"
  "/angebot/workshops/|/events"
  "/angebot/anmeldeformular-kurse|/buchung"
  "/angebot/anmeldeformular-kurse/|/buchung"
  "/angebot/anmeldeformular-sommerkurse|/buchung"
  "/angebot/anmeldeformular-sommerkurse/|/buchung"
  "/über-uns|/team"
  "/über-uns/|/team"
  "/%C3%BCber-uns|/team"
  "/%C3%BCber-uns/|/team"
  "/über-uns/team|/team"
  "/über-uns/team/|/team"
  "/%C3%BCber-uns/team|/team"
  "/%C3%BCber-uns/team/|/team"
  "/über-uns/philisophie|/team"
  "/über-uns/philisophie/|/team"
  "/%C3%BCber-uns/philisophie|/team"
  "/%C3%BCber-uns/philisophie/|/team"
  "/kontakt/kontakt|/kontakt"
  "/kontakt/kontakt/|/kontakt"
  "/kontakt/tanzstudio|/kontakt/standort-raumvermietung"
  "/kontakt/tanzstudio/|/kontakt/standort-raumvermietung"
  "/fotos-1|/fotos"
  "/fotos-1/|/fotos"
  "/infos/faq|/faq"
  "/infos/faq/|/faq"
  "/infos/agb|/impressum"
  "/infos/agb/|/impressum"
  "/events/salsa-partys-in-basel|/mehr/partys"
  "/events/salsa-partys-in-basel/|/mehr/partys"
  "/floweekend-2026|/events/floweekend"
  "/floweekend-2026/|/events/floweekend"
  "/floweekend-2026/anmeldeformular-floweekend-de|/events/floweekend"
  "/floweekend-2026/anmeldeformular-floweekend-de/|/events/floweekend"
  "/sfdc-anniverysaryweekend2026|/events/anniversary-weekend"
  "/sfdc-anniverysaryweekend2026/|/events/anniversary-weekend"
  "/home-en|/"
  "/home-en/|/"
  "/j/privacy|/datenschutz"
  "/events-workshops|/events"
  "/events-workshops/|/events"
  "/events-workshops/danceflow-night|/events/danceflow-night"
  "/events-workshops/danceflow-night/|/events/danceflow-night"
  "/events-workshops/floweekend|/events/floweekend"
  "/events-workshops/floweekend/|/events/floweekend"
  "/events-workshops/anniversary-weekend|/events/anniversary-weekend"
  "/events-workshops/anniversary-weekend/|/events/anniversary-weekend"
  "/events-workshops/kalender|/events/kalender"
  "/events-workshops/kalender/|/events/kalender"
)
# Vollständigkeit: 67 Zeilen = alle 65 vercel.json-Quellen + 2 Slash-Kanonisierungen; mechanisch aus Abschnitt 4 generiert (2026-08-12), 0 fehlende Varianten.

echo "BASE=$BASE"
for row in "${ROWS[@]}"; do
  src="${row%%|*}"
  expect="${row##*|}"
  # Erster Hop muss 301/308 sein (ausser Quelle schon final)
  first=$(curl -sI -o /dev/null -w '%{http_code}' --max-redirs 0 "$BASE$src" || echo ERR)
  # Follow: final URL + Code
  final=$(curl -sIL -o /dev/null -w '%{http_code}|%{url_effective}' --max-redirs 5 "$BASE$src" || echo "ERR|")
  fcode="${final%%|*}"
  furl="${final#*|}"
  # Hop-Count grob: mehr als 1 Redirect = Kette (warn)
  hops=$(curl -sIL -o /dev/null -w '%{num_redirects}' --max-redirs 5 "$BASE$src" || echo 9)
  ok=1
  if [[ "$expect" == "/" ]]; then
    [[ "$fcode" == "200" && "$furl" == "$BASE/" ]] || ok=0
  else
    [[ "$fcode" == "200" && "$furl" == "$BASE$expect" ]] || ok=0
  fi
  # Wenn Quelle != Ziel: erster Status sollte 301 oder 308 sein
  if [[ "$src" != "$expect" && "$src" != "${expect}/" && "$src" != "/" ]]; then
    if [[ "$first" != "301" && "$first" != "308" ]]; then
      ok=0
    fi
  fi
  if [[ "$hops" -gt 1 ]]; then
    echo "WARN chain hops=$hops $src -> $furl"
  fi
  if [[ "$ok" -eq 1 ]]; then
    echo "OK  $src  first=$first hops=$hops final=$fcode $furl"
  else
    echo "FAIL $src  first=$first hops=$hops final=$fcode $furl  expected=$BASE$expect"
    FAIL=$((FAIL+1))
  fi
done

# Fallback: unbekannter Pfad darf NICHT 301 auf / sein
unk_first=$(curl -sI -o /dev/null -w '%{http_code}' --max-redirs 0 "$BASE/this-path-should-not-exist-sfdc-2026" || echo ERR)
unk_final=$(curl -sIL -o /dev/null -w '%{http_code}|%{url_effective}' --max-redirs 5 "$BASE/this-path-should-not-exist-sfdc-2026" || echo "ERR|")
echo "FALLBACK first=$unk_first final=$unk_final (erwarte 404, nicht 301→/)"
if [[ "$unk_first" == "301" || "$unk_first" == "308" ]]; then
  echo "FAIL fallback redirected"
  FAIL=$((FAIL+1))
fi

echo "----"
echo "Fails: $FAIL"
exit "$FAIL"
```

### 5.3 Manuelle Stichproben

- [ ] Browser: alter Link aus Google/Instagram-Bio öffnet finales Ziel ohne Zwischenseite.
- [ ] Umlaut: sowohl `/über-uns/` als auch `/%C3%BCber-uns/` landen auf `/team`.
- [ ] Kein Redirect-Loop (DevTools Network: max. 1 Redirect-Hop von Alt → Neu).
- [ ] Canonical der Zielseite zeigt auf sich selbst (kein Canonical zurück auf Alt-URL).
- [ ] Search Console: nach Cutover «Adressänderung» / Sitemap neu einreichen; 404-Bericht 14 Tage beobachten.

### 5.4 Pass/Fail-Kriterien

| Kriterium | Pass |
|---|---|
| Jede Kern- und Zusatzquelle | final HTTP 200 auf exaktem Zielpfad |
| Erster Response von Alt-Quelle | 301 (oder 308), nicht 302 |
| Redirect-Hops | genau 1 von Alt → Ziel (0 wenn Quelle = Ziel-kanonisch) |
| Unbekannter Pfad | 404, **nicht** 301 `/` |
| Event-Ziele | 200, nicht 404 |
| Tippfehler-Ziele | keine URL enthält `philisophie` oder `anniverysary` |

---

## 6. Zählung / Inventar

| Block | Zeilen (logische Quellen) |
|---|---|
| Kernmatrix Live (SEO-DoD) | **22** |
| Zusatz Live-200 | **6** |
| Interne Repo-Umzüge `/events-workshops/*` | **5** |
| **Summe ausführbarer Redirect-Quellen** | **33** |
| vercel.json source-Einträge (mit/ohne Slash, Umlaut doppelt) | ca. **60** Snippet-Zeilen |

---

## 7. Offene Nachzüge (nicht Teil dieser Datei)

1. Event-Seiten physisch unter `/events/*` bauen (Staging heute 404) — **Cutover-Blocker**.
2. Nach R-01: `/home-en` → `/en` umhängen.
3. AGB: Inhalt auf `/impressum` sichern oder eigene `/agb` + Matrix-Update.
4. Search Console Property + Sitemap nach Cutover.

---

**Datei:** [`14-redirect-matrix.md`](/root/clients/salsaflow-dc/website-plan/14-redirect-matrix.md)  
**Erstellt:** 2026-08-12 · Planning only  
