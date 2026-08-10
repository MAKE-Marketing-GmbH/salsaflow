---
typ: architektur
slug: salsaflow-dc
etappe: 2
name: Salsaflow Dance Company - Technisches Fundament
status: spec (noch nicht implementiert)
quelle: wiki.md (Single-Source) + Kursstaffel-Excel (Struktur) + Zahlungsanbieter-Recherche
erstellt: 2026-06-16
---

# ARCHITEKTUR - Salsaflow Dance Company

> Technisches Fundament fuer den Relaunch (Marathon Etappe 2). Definiert Backend, Datenbank,
> Level-Logik, DE/EN-Woerterbuch, Buchungs-Logik und Zahlungsanbieter, BEVOR gebaut wird.
> Quelle ist `wiki.md` (Single-Source) plus die Struktur aus dem Kursstaffel-Excel und die
> Zahlungsanbieter-Recherche. Hier wird noch nichts implementiert (Implementierung ab Etappe 5).
> Begriffe: **Staffel** = ein 8-Wochen-Kursblock (im Code `term`). **Kurs** = ein konkreter Slot
> in einer Staffel (Stil + Level + Tag + Zeit + Ort + Lehrer). **Lektion** = eine der 8 Wochen.

---

## 0. Was das Excel zusaetzlich aufgedeckt hat (gegen das Wiki abgeglichen)

Das Wiki/DOCX kannte nur Salsa, Bachata, Heels. Das echte Kursstaffel-Excel (43 Sheets) enthaelt
mehr und praezisiert zwei offene Punkte. Diese Befunde sind in Schema und Woerterbuch eingearbeitet:

1. **Mehr Tanzstile als im Wiki:** zusaetzlich `Cha Cha Cha`, `Bodymovement & Ladystyle`,
   `Contemporary`, `Basics & Fundamentals`, `SFIT` (Samstags-Format), und als Workshop-Formate
   `Partnerwork` und `Shines`. -> Stil-Liste muss data-driven sein, kein hartes Enum (Abschnitt 4 + 6).
2. **Preis 190/160 bestaetigt (loest Offene Frage 6):** Die Kurs-Sheets zeigen durchgehend
   `CHF 190.- / CHF 160.-`. Das ist NICHT ein zweiter Kurstyp, sondern **Normal 190 / ermaessigt 160**.
   Ermaessigt = Student/Tarif. Zusaetzlich: SFIT `240/120`, Workshops `30/25` bzw. `25/20`. (Abschnitt 6)
3. **Tarif-Kategorien real:** `Normal`, `Paar`, `Familie`, `Student`, `Pushflow` (Abo-Tarif fuer
   aktive Community/Pushflower) plus Notiz `Salsaflow Pass`. -> eigene `tariffs`-Tabelle (Abschnitt 4).
4. **Flow als Uebergangsstufe (praezisiert Offene Frage 15):** Die Sheet-Reihenfolge legt nahe, dass
   `Beginner Flow` zwischen Beginner und Intermediate sitzt und `Intermediate Flow` zwischen
   Intermediate und Advanced. Flow ist damit eine **Bruecken-Stufe in der Leiter**, kein paralleler
   Vertiefungskurs. Default in Abschnitt 3 so modelliert, mit Fabio final bestaetigen.
5. **On1/On2 (praezisiert Offene Frage 14):** Im Excel nur als `Advanced On2 Flow` belegt. -> Modelliert
   als **optionales Attribut `on_variant` an Salsa-Kursen**: `null` = On1 (Default-Timing, das ungelabelte
   Gros der Salsa-Kurse), `on2` = explizit markiert. Kein eigener Stil, kein eigenes Level. (Abschnitt 4)
6. **Ein Standort, mehrere Raeume:** Alle Kurse an Adresse `Elisabethenanlage 7, 4051 Basel`. Das Wiki
   spricht von "3 Studios am Bahnhof SBB" = 3 Raeume an dieser Adresse. -> `locations`-Tabelle mit
   optionalem Raum, ein Eintrag genuegt heute, Modell bleibt erweiterbar. (Abschnitt 4)
7. **Stufen nicht lueckenlos:** In einer Staffel sind nur die aktuell laufenden Stufen vorhanden
   (z.B. Beginner 1-5, Intermediate 8-11, Advanced 13-17). -> `stufe` ist eine **freie Ganzzahl**,
   kein geschlossenes Enum. Advanced ist nach oben offen (faktisch unendlich). (Abschnitt 3)
8. **Leere/inaktive Kurse:** Mehrere Sheets enthalten `#N/A`-Platzhalter (noch nicht befuellt). -> Kurs
   kann mit 0 Buchungen und Status `draft`/`open` existieren. (Abschnitt 4)
9. **Privatdaten:** Die Excel-Bloecke `Master Data` (3667 Zeilen) und Teilnehmer-Zeilen sind die
   Vorlage fuer `participants` (CRM), kommen aber NIE oeffentlich auf die Site (RLS, Abschnitt 1.3 + 2).

---

## 1. Backend, Datenbank, Hosting (Entscheid + Begruendung)

### 1.1 Entscheid: Supabase (Managed Postgres + Auth + RLS + Edge Functions)

| Baustein | Wahl | Warum |
|---|---|---|
| Datenbank | **PostgreSQL** (managed via Supabase) | Relationales Modell (Kurse/Buchungen/Zahlungen/Teilnehmer sind stark verknuepft), Transaktionen fuer Kapazitaet/Warteliste, JSONB fuer Roh-Webhook-Events. |
| Auth (Admin-Login) | **Supabase Auth** (E-Mail + Passwort) | Loest Etappe-5-Kriterium "Admin-Login" ohne Eigenbau. Fabio/Claudia = wenige Admin-Accounts. |
| Sicherheit | **Row Level Security (RLS)** | Erzwingt auf DB-Ebene: oeffentlich lesbar nur Kurs-/Staffel-Daten; Teilnehmer/Buchungen/Zahlungen nur fuer eingeloggte Admins. Deckt No-Go "private Schuelerdaten nie auf die Site". |
| Server-Logik | **Supabase Edge Functions** (Deno) | Stripe-Webhook, Bestaetigungsmails, serverseitige Kapazitaets-/Wartelisten-Pruefung. Haelt Secrets (Stripe-Key) serverseitig. |
| ORM/Migrations | **Drizzle ORM** (TypeScript) | Typsicheres Schema + versionierte Migrationen aus dem Vite/TS-Code. Schema ist Single-Source, Etappe-5 `npm run build` kann Typen pruefen. |
| Mailversand | **Resend** (oder SMTP von info@) | Transaktionale Mails (Buchungsbestaetigung an Kunde + info@). Entscheid in Etappe 8, hier nur vorgesehen. |
| Frontend | React + Vite + TypeScript + Tailwind + shadcn/ui | Vorgabe Regel 031. |
| Hosting | **Vercel** (Frontend) + Supabase (DB/Auth/Functions) | Vorgabe. Supabase-Region **Frankfurt (eu-central-1)** wegen Datennaehe Schweiz/EU (Datenschutz). |

### 1.2 Warum Supabase und nicht Eigenbau-Node-API

- Kleines Team, Vollumfang bis August: Auth, RLS und Webhook-Runtime gibt es fertig statt selbst zu
  bauen. Weniger Eigen-Code = weniger Fehlerquellen, schneller live.
- Geringe Fixkosten (Kundenwunsch): Free-Tier deckt dieses Volumen (ein paar hundert Buchungen pro
  Staffel) locker; Pro-Plan ca. 25 USD/Monat erst bei Bedarf.
- Datenschutz: EU-Region waehlbar, RLS trennt oeffentliche Kursdaten sauber von privaten Schuelerdaten.
- Portabel: Das Schema ist normales Postgres-DDL (Abschnitt 4), bei Bedarf auf Neon/RDS umziehbar.
- **Alternative (Fallback), falls kein BaaS gewuenscht:** Vercel Serverless Functions (Node, Hono) +
  Neon-Postgres + Drizzle + Auth.js. Gleiches Schema, mehr Eigen-Code. Nicht Erstwahl.

### 1.3 Sichtbarkeits-Regel (RLS-Leitplanke)

- **Oeffentlich (anon, nur lesen):** `terms`(published), `courses`(public), `styles`, `level_rungs`,
  `locations`, `teachers`(oeffentliches Profil), `tariffs`, `course_prices`. Plus abgeleitete
  Kapazitaets-Zahl (frei/belegt) ohne Personenbezug.
- **Nur Admin (eingeloggt):** `participants`, `bookings`, `payments`, `payment_events`,
  `notifications`, `admin_profiles`, `audit_log`.
- **Schreiben:** alle Schreibzugriffe auf Buchung/Zahlung laufen ueber Edge Functions (Service-Role),
  nie direkt vom Browser. Der oeffentliche Client darf nur lesen + eine Buchung anstossen.

---

## 2. DB-Schema (vollstaendig)

Notation: PostgreSQL. `PK` Primaerschluessel, `FK` Fremdschluessel, `?` nullable. Enums als
Postgres-Enum-Typen. Zeitstempel `timestamptz`. Geld als `numeric(8,2)` in CHF (kein Float).
Vier Datenbereiche sind klar getrennt: **A Admin/Auth, B Kurse, C Buchungen, D Zahlungen.**

### Bereich A - Admin / Auth

```sql
-- Supabase verwaltet die Login-Identitaeten in auth.users. Hier nur das Profil + Rolle.
CREATE TYPE admin_role AS ENUM ('owner', 'admin', 'teacher_readonly');

CREATE TABLE admin_profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  role         admin_role NOT NULL DEFAULT 'admin',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Nachvollziehbarkeit kritischer Admin-Aktionen (Staffel publiziert, Buchung storniert, Refund).
CREATE TABLE audit_log (
  id         bigserial PRIMARY KEY,
  actor_id   uuid REFERENCES admin_profiles(id),
  action     text NOT NULL,          -- z.B. 'term.publish', 'booking.cancel', 'payment.refund'
  entity     text NOT NULL,          -- Tabellenname
  entity_id  text NOT NULL,
  meta       jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### Bereich B - Kurse (Staffeln, Kurse, Stammdaten)

```sql
-- Standort + Raum (heute 1 Adresse, mehrere Raeume moeglich).
CREATE TABLE locations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,                       -- 'Studio 1' / 'Hauptsaal' o.ae.
  address    text NOT NULL DEFAULT 'Elisabethenanlage 7, 4051 Basel',
  sort       int  NOT NULL DEFAULT 0
);

-- Lehrer (oeffentliches Profil fuer Team-Seite; reale Namen sind oeffentlich erlaubt).
CREATE TABLE teachers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  role         text,                              -- 'Inhaber/Lehrer', 'Lehrer/Pushflower', ...
  bio_de       text, bio_en text,
  photo_url    text,
  is_active    boolean NOT NULL DEFAULT true,
  sort         int NOT NULL DEFAULT 0
);

-- Tanzstile: DATA-DRIVEN (kein Enum), weil das Excel mehr Stile zeigt als das Wiki.
CREATE TABLE styles (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key       text UNIQUE NOT NULL,                 -- 'salsa','bachata','heels','cha_cha_cha',...
  name_de   text NOT NULL,
  name_en   text NOT NULL,
  ladder_key text NOT NULL,                       -- welche Level-Leiter gilt (siehe level_rungs)
  sort      int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

-- Level-Leiter: DATA-DRIVEN Stufen-Definition. Treibt sowohl Auto-Aufstieg (ordinal+1)
-- als auch das DE/EN-Woerterbuch. Siehe Aufstiegs-Regel Abschnitt 3.
CREATE TYPE level_category AS ENUM ('beginner','intermediate','advanced','open','heels');

CREATE TABLE level_rungs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ladder_key    text NOT NULL,                    -- 'salsa_bachata' | 'heels' | 'open'
  ordinal       int  NOT NULL,                    -- Reihenfolge in der Leiter (1,2,3,...)
  category      level_category NOT NULL,
  stufe         int,                              -- ? Nummer (Beginner 1..6, Interm 7..12, Adv 13..)
  is_flow       boolean NOT NULL DEFAULT false,   -- Bruecken-Stufe (Beginner Flow / Intermediate Flow)
  is_open_ended boolean NOT NULL DEFAULT false,   -- true bei Advanced (Stufe waechst unbegrenzt)
  label_de      text NOT NULL,
  label_en      text NOT NULL,
  UNIQUE (ladder_key, ordinal)
);

-- Staffel = 8-Wochen-Block.
CREATE TYPE term_status AS ENUM ('draft','published','archived');

CREATE TABLE terms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,                      -- 'Staffel Januar 2026'
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  week_count  int  NOT NULL DEFAULT 8,
  is_summer   boolean NOT NULL DEFAULT false,     -- Sommerkurs (3 Wochen, Spezialpreis)
  status      term_status NOT NULL DEFAULT 'draft',
  duplicated_from uuid REFERENCES terms(id),      -- Herkunft beim "letzte Staffel duplizieren"
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Kurs = ein Slot in einer Staffel.
CREATE TYPE booking_type AS ENUM ('leader_follower','open');  -- open = keine Rollen (Heels/Workshop/SFIT)
CREATE TYPE on_variant  AS ENUM ('on1','on2');
CREATE TYPE course_status AS ENUM ('draft','open','full','cancelled','finished');
CREATE TYPE weekday      AS ENUM ('mon','tue','wed','thu','fri','sat','sun');

CREATE TABLE courses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id        uuid NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  style_id       uuid NOT NULL REFERENCES styles(id),
  level_rung_id  uuid REFERENCES level_rungs(id),     -- ? null bei Open-Level-Workshops
  on_variant     on_variant,                          -- ? nur Salsa; null = On1 (Default), 'on2' = markiert
  weekday        weekday NOT NULL,
  start_time     time NOT NULL,
  end_time       time NOT NULL,
  location_id    uuid NOT NULL REFERENCES locations(id),
  booking_type   booking_type NOT NULL DEFAULT 'leader_follower',
  capacity_total      int NOT NULL DEFAULT 24,
  capacity_leader     int,                            -- ? Default capacity_total/2
  capacity_follower   int,                            -- ? Default capacity_total/2
  allows_late_entry   boolean NOT NULL DEFAULT true,  -- Quereinsteiger in laufende Staffel
  status         course_status NOT NULL DEFAULT 'draft',
  created_from_course_id uuid REFERENCES courses(id), -- Vorgaenger beim Duplizieren (Aufstieg)
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Kurs <-> Lehrer (n:m, weil Paar-Felder im Excel = 2 Lehrer pro Kurs).
CREATE TABLE course_teachers (
  course_id  uuid REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id),
  PRIMARY KEY (course_id, teacher_id)
);

-- Tarife (aus Excel: Normal/Paar/Familie/Student/Pushflow).
CREATE TABLE tariffs (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key       text UNIQUE NOT NULL,                  -- 'normal','reduced','couple','family','student','pushflow'
  name_de   text NOT NULL,
  name_en   text NOT NULL,
  seats     int NOT NULL DEFAULT 1,                -- 'couple' belegt 2 Plaetze (1 Leader + 1 Follower)
  sort      int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

-- Preis pro Kurs und Tarif (flexibel: 190/160 Standard, 240/120 SFIT, 30/25 Workshop ...).
CREATE TABLE course_prices (
  course_id  uuid REFERENCES courses(id) ON DELETE CASCADE,
  tariff_id  uuid REFERENCES tariffs(id),
  amount_chf numeric(8,2) NOT NULL,
  PRIMARY KEY (course_id, tariff_id)
);
```

### Bereich C - Buchungen (Teilnehmer, Buchung, Warteliste)

```sql
-- Teilnehmer = CRM-Stammdaten (entspricht Excel 'Master Data'). PRIVAT (RLS: nur Admin).
CREATE TYPE gender AS ENUM ('m','w','d','none');

CREATE TABLE participants (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text NOT NULL,
  phone         text,
  gender        gender NOT NULL DEFAULT 'none',     -- Excel m/w; optional
  default_tariff_id uuid REFERENCES tariffs(id),
  source        text,                               -- CRM 'Quelle' (woher kam der Kontakt)
  marketing_optin boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

-- Buchung = eine Anmeldung fuer einen Kurs.
CREATE TYPE dance_role     AS ENUM ('leader','follower');
CREATE TYPE booking_mode   AS ENUM ('solo','couple');
CREATE TYPE booking_status AS ENUM
  ('pending_payment','waitlisted','confirmed','cancelled','expired','refunded','completed');

CREATE TABLE bookings (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id            uuid NOT NULL REFERENCES courses(id),
  participant_id       uuid NOT NULL REFERENCES participants(id),
  role                 dance_role,                  -- ? null bei booking_type 'open' (Heels/Workshop)
  mode                 booking_mode NOT NULL DEFAULT 'solo',
  partner_participant_id uuid REFERENCES participants(id),  -- ? nur bei mode='couple'
  partner_role         dance_role,                  -- ? Gegenrolle bei Paar
  needs_aushilfe       boolean NOT NULL DEFAULT false, -- solo: Schule organisiert Gegenrolle
  tariff_id            uuid NOT NULL REFERENCES tariffs(id),
  amount_chf           numeric(8,2) NOT NULL,        -- Snapshot des Preises bei Buchung
  status               booking_status NOT NULL DEFAULT 'pending_payment',
  waitlist_position    int,                          -- ? nur wenn status='waitlisted'
  language             text NOT NULL DEFAULT 'de',   -- 'de' | 'en' (fuer Bestaetigungsmail)
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  confirmed_at         timestamptz,
  cancelled_at         timestamptz,
  payment_deadline     timestamptz                   -- Reservierung verfaellt nach X Min ohne Zahlung
);

CREATE INDEX ON bookings (course_id, status, role);  -- schnelle Kapazitaets-/Balance-Abfrage
```

### Bereich D - Zahlungen (Zahlung, Webhook-Events, Mails)

```sql
CREATE TYPE payment_provider AS ENUM ('stripe');
CREATE TYPE payment_method   AS ENUM ('twint','card','apple_pay','google_pay','other');
CREATE TYPE payment_status   AS ENUM
  ('created','pending','succeeded','failed','expired','refunded','partially_refunded');

CREATE TABLE payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id          uuid NOT NULL REFERENCES bookings(id),
  provider            payment_provider NOT NULL DEFAULT 'stripe',
  checkout_session_id text,                          -- Stripe Checkout Session
  payment_intent_id   text,                          -- Stripe PaymentIntent
  amount_chf          numeric(8,2) NOT NULL,
  currency            char(3) NOT NULL DEFAULT 'CHF',
  method              payment_method,                -- ? erst nach Bezahlung bekannt
  status              payment_status NOT NULL DEFAULT 'created',
  refund_amount_chf   numeric(8,2) NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  paid_at             timestamptz,
  refunded_at         timestamptz,
  UNIQUE (booking_id)                                 -- 1 aktive Zahlung pro Buchung
);

-- Webhook-Events vom Provider (Idempotenz: jedes Event nur einmal verarbeiten).
CREATE TABLE payment_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_event_id text UNIQUE NOT NULL,            -- Stripe event.id (Idempotenz-Schluessel)
  payment_id        uuid REFERENCES payments(id),
  type              text NOT NULL,                   -- 'checkout.session.completed', ...
  payload           jsonb NOT NULL,
  received_at       timestamptz NOT NULL DEFAULT now(),
  processed_at      timestamptz
);

-- Versand-Log der Bestaetigungsmails (Kunde + info@).
CREATE TYPE notification_kind AS ENUM
  ('booking_confirmation','waitlist_promoted','payment_failed','cancellation','refund');

CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid REFERENCES bookings(id),
  kind        notification_kind NOT NULL,
  to_email    text NOT NULL,                         -- Kunde ODER info@salsaflow-dc.com
  language    text NOT NULL DEFAULT 'de',
  status      text NOT NULL DEFAULT 'queued',        -- queued|sent|failed
  sent_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

### 2.1 Beziehungs-Uebersicht (Text-ERD)

```
terms 1---n courses n---1 styles ---1 (ladder_key) n--- level_rungs
                  |                |
                  | n              | (course_teachers n:m teachers)
                  |                |
                  | 1              n
              course_prices n---1 tariffs
                  |
courses 1---n bookings n---1 participants   (partner_participant_id -> participants)
                  |
        bookings 1---1 payments 1---n payment_events
                  |
        bookings 1---n notifications
admin_profiles 1---n audit_log
```

---

## 3. Level-Aufstiegs-Regel (eindeutig)

Ziel: Beim "letzte Staffel duplizieren" (Etappe 6) steigt jeder Kurs automatisch eine Stufe hoch.
Die Regel ist **data-driven ueber `level_rungs.ordinal`** und damit eindeutig und ohne Code-Aenderung
anpassbar.

### 3.1 Kanonische Leiter `salsa_bachata` (Salsa und Bachata teilen sie)

| ordinal | category | stufe | is_flow | is_open_ended | label_de | label_en |
|---|---|---|---|---|---|---|
| 1 | beginner | 1 | nein | nein | Beginner Stufe 1 | Beginner Level 1 |
| 2 | beginner | 2 | nein | nein | Beginner Stufe 2 | Beginner Level 2 |
| 3 | beginner | 3 | nein | nein | Beginner Stufe 3 | Beginner Level 3 |
| 4 | beginner | 4 | nein | nein | Beginner Stufe 4 | Beginner Level 4 |
| 5 | beginner | 5 | nein | nein | Beginner Stufe 5 | Beginner Level 5 |
| 6 | beginner | 6 | nein | nein | Beginner Stufe 6 | Beginner Level 6 |
| 7 | beginner | - | **ja** | nein | Beginner Flow | Beginner Flow |
| 8 | intermediate | 7 | nein | nein | Intermediate Stufe 7 | Intermediate Level 7 |
| 9 | intermediate | 8 | nein | nein | Intermediate Stufe 8 | Intermediate Level 8 |
| 10 | intermediate | 9 | nein | nein | Intermediate Stufe 9 | Intermediate Level 9 |
| 11 | intermediate | 10 | nein | nein | Intermediate Stufe 10 | Intermediate Level 10 |
| 12 | intermediate | 11 | nein | nein | Intermediate Stufe 11 | Intermediate Level 11 |
| 13 | intermediate | 12 | nein | nein | Intermediate Stufe 12 | Intermediate Level 12 |
| 14 | intermediate | - | **ja** | nein | Intermediate Flow | Intermediate Flow |
| 15 | advanced | 13 | nein | **ja** | Advanced Stufe 13 | Advanced Level 13 |
| 16+ | advanced | 14, 15, 16, 17, ... | nein | **ja** | Advanced Stufe N | Advanced Level N |

### 3.2 Leiter `heels` (Heels Class, 3 Stufen, endlich)

| ordinal | category | label_de | label_en |
|---|---|---|---|
| 1 | heels | Beginner | Beginner |
| 2 | heels | Intermediate | Intermediate |
| 3 | heels | Advanced | Advanced |

Heels nimmt am Auto-Aufstieg teil (Beginner -> Intermediate -> Advanced), endet aber bei Advanced
(endliche Leiter, kein `is_open_ended`). Ein Heels-Advanced-Kurs bleibt beim Duplizieren auf Advanced
(Regel 3.4, Zweig "Ende einer endlichen Leiter"), Admin kann uebersteuern.

### 3.3 Leiter `open` (Workshops + Spezialstile ohne Auto-Aufstieg)

Gilt fuer Cha Cha Cha, Bodymovement & Ladystyle, Contemporary, Basics & Fundamentals, SFIT,
Partnerwork, Shines und Open-Level-Workshops. Eine Stufe `Open Level` (ordinal 1), nicht promotbar.
Optional zusaetzlich `Beginner`/`Intermediate`/`Advanced` als nicht-nummerierte Open-Rungs, wenn ein
Format das braucht. **Beispiel aus dem Excel:** `Bodymovement & Ladystyle` laeuft als Open Level, hat
aber auch eine Intermediate-Variante (`Bodymovement & Ladystyle Int`). Das ist eine nicht-nummerierte
Open-Rung `Intermediate` in der `open`-Leiter. Open-Rungs steigen NICHT automatisch auf (kein `ordinal+1`
beim Duplizieren); der Kurs wird mit gleichem Level wiederholt, Admin entscheidet manuell.

### 3.4 Die Aufstiegs-Regel (deterministischer Algorithmus)

Beim Duplizieren einer Staffel wird fuer JEDEN Kurs `c` die neue Stufe so bestimmt:

```
funktion naechste_stufe(c):
    r = c.level_rung
    wenn r ist null  ->  bleibt null            # Open-Level-Workshop: kein Aufstieg
    wenn r.ladder_key == 'open'  ->  bleibt r   # Spezialstile/Open-Rungs: kein Aufstieg
    naechste = level_rungs[ladder_key = r.ladder_key, ordinal = r.ordinal + 1]
    wenn naechste existiert  ->  naechste        # normaler Schritt (inkl. Flow-Bruecken)
    sonst wenn r.is_open_ended UND r.stufe ist nicht null  ->   # Advanced nummeriert, nach oben offen
        gib zurueck (oder lege an) rung mit
        ladder_key=r.ladder_key, category='advanced',
        stufe = r.stufe + 1, ordinal = r.ordinal + 1, is_open_ended=true,
        is_flow = r.is_flow,                     # Flow-Charakter bleibt erhalten (z.B. Advanced Flow)
        label = baue_label(category, stufe, is_flow)
    sonst  ->  bleibt r                           # endliche Leiter (Heels Advanced) ODER
                                                  # Advanced-Flow ohne Nummer (z.B. "Advanced On2 Flow"):
                                                  # wiederholt sich, Admin-Override moeglich
# on_variant (on1/on2) sitzt am Kurs, nicht an der Rung, und bleibt beim Duplizieren immer erhalten.
```

Eigenschaften, die diese Regel eindeutig machen:
- **Genau ein Schritt pro Staffel:** `ordinal + 1`. Beginner 1 -> Beginner 2; Beginner 6 -> Beginner Flow;
  Beginner Flow -> Intermediate 7; Intermediate 12 -> Intermediate Flow; Intermediate Flow -> Advanced 13.
- **Advanced waechst unbegrenzt:** Advanced 17 -> Advanced 18, ... (faktisch unendlich, Wiki Abschnitt 7).
- **Flow ist eine Bruecken-Stufe**, kein paralleler Kurs (Befund 4 in Abschnitt 0).
- **Open/Spezialstile** und reine Open-Level-Workshops steigen nicht auf.
- **Admin-Override:** Das Admin-UI zeigt den vorgeschlagenen neuen Level pro Kurs an und laesst ihn vor
  dem Publizieren aendern (idiotensicher, Etappe 6). Auto-Vorschlag ist die obige Regel.
- **On1/On2** bleibt beim Duplizieren am Kurs erhalten (eigenes Attribut, nicht Teil der Leiter).

> Final mit Fabio zu bestaetigen (Offene Frage 15): die genauen Kategorie-Grenzen (Beginner endet bei
> Stufe 6, Intermediate bei 12). Falls anders, nur die `level_rungs`-Daten anpassen, nicht den Code.

---

## 4. DE/EN-Woerterbuch (alle Levels und Stile, plus Tage/Tarife/Begriffe)

Quelle: alle Stil-/Level-/Tag-Werte aus dem Kursstaffel-Excel + Wiki Abschnitt 7. Das Woerterbuch lebt
als Daten (`styles`, `level_rungs`, `tariffs` + ein statisches UI-Lexikon). Vollstaendig, damit der
oeffentliche Kursplan DE/EN automatisch rendert (Etappe 7).

### 4.1 Tanzstile (alle aus dem Excel)

| key | DE | EN |
|---|---|---|
| salsa | Salsa | Salsa |
| bachata | Bachata | Bachata |
| heels | Heels Class | Heels Class |
| cha_cha_cha | Cha Cha Cha | Cha Cha Cha |
| bodymovement_ladystyle | Bodymovement & Ladystyle | Body Movement & Lady Styling |
| contemporary | Contemporary | Contemporary |
| basics_fundamentals | Basics & Fundamentals | Basics & Fundamentals |
| sfit | SFIT (Salsaflow Fitness) | SFIT (Salsaflow Fitness) |
| partnerwork | Partnerwork | Partner Work |
| shines | Shines | Shines |

### 4.2 Level-Kategorien und Stufen

| Begriff DE | Begriff EN | Hinweis |
|---|---|---|
| Beginner | Beginner | Stufe 1 bis 6 |
| Intermediate | Intermediate | Stufe 7 bis 12 |
| Advanced | Advanced | ab Stufe 13, nach oben offen |
| Stufe {N} | Level {N} | "Stufe" -> "Level" ist die zentrale DE/EN-Uebersetzung der Nummerierung |
| Beginner Flow | Beginner Flow | Bruecke Beginner -> Intermediate |
| Intermediate Flow | Intermediate Flow | Bruecke Intermediate -> Advanced |
| Advanced On2 Flow | Advanced On2 Flow | zusammengesetzt: Advanced-Rung mit `is_flow=true` (Leiter `salsa_bachata`) + Kurs-Attribut `on_variant='on2'`. Label = "Advanced" + " On2" (aus on_variant) + " Flow" (aus is_flow). Kein eigenes Enum. |
| Open Level | Open Level | Workshops/Spezialstile |
| On1 | On1 | Salsa-Timing (auf 1) |
| On2 | On2 | Salsa-Timing (auf 2) |

Vollstaendige Stufen-Labels DE/EN ergeben sich aus `level_rungs` (Abschnitt 3.1/3.2): jede Zeile hat
`label_de` und `label_en`. Beispiel: `Beginner Stufe 3` / `Beginner Level 3`.

### 4.3 Wochentage

| DE | DE-Kurz | EN | EN-Kurz | enum |
|---|---|---|---|---|
| Montag | Mo | Monday | Mon | mon |
| Dienstag | Di | Tuesday | Tue | tue |
| Mittwoch | Mi | Wednesday | Wed | wed |
| Donnerstag | Do | Thursday | Thu | thu |
| Freitag | Fr | Friday | Fri | fri |
| Samstag | Sa | Saturday | Sat | sat |
| Sonntag | So | Sunday | Sun | sun |

### 4.4 Tarife (aus Excel)

Das Excel kennt genau diese fuenf Tarif-Kategorien (Spalte "Tarif"). Sie sind die `tariffs`-Stammdaten:

| key | DE | EN | seats |
|---|---|---|---|
| normal | Normal | Standard | 1 |
| student | Student | Student | 1 |
| couple | Paar | Couple | 2 |
| family | Familie | Family | 1 |
| pushflow | Pushflow | Pushflow | 1 |

Hinweis Preis-Logik: Der Excel-Header `CHF 190.- / CHF 160.-` ist **Normal-Preis / ermaessigter Preis**,
kein eigener Tarif (loest Befund 2). 190 = Tarif `normal`; 160 = ermaessigter Preis, der per `course_prices`
dem Tarif `student` (und ggf. weiteren) zugeordnet wird. `Paar`/`Familie` bekommen ihren eigenen Betrag
ebenfalls ueber `course_prices`. Es gibt also keinen erfundenen Tarif "reduced" - "ermaessigt" ist nur
das Preis-Tier. `Salsaflow Pass` ist im Excel eine Notiz, kein Tarif -> nicht modelliert (spaeter als Abo
moeglich).

### 4.5 Buchungs-/UI-Begriffe (statisches Lexikon, Auszug)

| DE | EN |
|---|---|
| Staffel | Term (8-week term) |
| Kurs | Course |
| Lektion | Lesson |
| Leader | Leader |
| Follower | Follower |
| allein anmelden | Book solo |
| als Paar | As a couple |
| Aushilfe wird organisiert | Partner will be arranged |
| Warteliste | Waiting list |
| Schnupperstunde (gratis) | Free trial class |
| Sommerkurs | Summer course |
| Privatstunde | Private lesson |
| Workshop | Workshop |
| Geschenkgutschein | Gift voucher |
| laufende Kurse | Ongoing courses |
| neue / zukuenftige Kurse | New / upcoming courses |
| Quereinsteiger | Late entry |
| Plaetze frei | Spots available |
| ausgebucht | Fully booked |
| Buchung bestaetigt | Booking confirmed |
| jetzt buchen | Book now |
| Danceflow Night | Danceflow Night |

---

## 5. Buchungs-Logik (Leader/Follower, allein/Paar, Kapazitaet, Warteliste, Balance)

Quelle: Wiki Abschnitt 8 (Aushilfe-Garantie) + Abschnitt 13 (Anmeldeformular, Leader-/Follower-Aushilfe-Chat).

### 5.1 Rollen und Modus

- **Rolle:** Leader oder Follower. Pflicht bei `booking_type = 'leader_follower'` (Salsa/Bachata).
  Bei `booking_type = 'open'` (Heels, SFIT, Bodymovement, Contemporary, Workshops) entfaellt die Rolle.
- **Modus allein (`solo`):** Person bucht eine Rolle. Fehlt die Gegenrolle, organisiert die Schule
  Aushilfe (`needs_aushilfe = true`). Das ist der Online-Abbild der "Leader-/Follower-Aushilfe-Chats".
- **Modus Paar (`couple`):** zwei Teilnehmer, je eine Rolle. Belegt einen Leader- und einen
  Follower-Platz (Tarif `couple`, `seats = 2`). `partner_participant_id` + `partner_role` gesetzt.

### 5.2 Kapazitaet pro Rolle

- Kurs hat `capacity_total` und optional `capacity_leader` / `capacity_follower`
  (Default je `capacity_total / 2`).
- **Freie Plaetze je Rolle** = `capacity_<rolle> - (bestaetigte + pending-mit-laufender-Frist in dieser Rolle)`.
- Reservierungen mit `status = pending_payment` blockieren den Platz bis `payment_deadline`
  (Default 30 Minuten). Bei Ablauf -> `expired`, Platz frei.

### 5.3 Warteliste

- Ist die gewaehlte Rolle voll, wird statt `pending_payment` der Status `waitlisted` gesetzt mit
  fortlaufender `waitlist_position` je Kurs+Rolle.
- Wird ein Platz frei (Storno/Ablauf), rueckt der erste der Warteliste nach: Status -> `pending_payment`,
  Benachrichtigung `waitlist_promoted`, Zahlungs-Frist startet. Zahlt er nicht rechtzeitig -> naechster.
- Bei Paar-Buchung: nur moeglich, wenn in BEIDEN Rollen ein Platz frei ist, sonst Paar-Warteliste.

### 5.4 Balance-Sicht im Admin

- Pro Kurs zeigt das Admin (Etappe 8): bestaetigte Leader vs. Follower, offene Aushilfe-Bedarfe
  (`needs_aushilfe = true` ohne zugeordnete Gegenrolle), Wartelisten je Rolle.
- Kennzahl "Balance" = Leader minus Follower. Negativ = Leader-Aushilfe gesucht, positiv = Follower-Aushilfe.
- Diese Sicht ersetzt die heutigen WhatsApp-Aushilfe-Chats durch eine Tabelle.

### 5.5 Quereinsteiger

- `courses.allows_late_entry` steuert, ob eine laufende Staffel noch Buchungen annimmt.
- Der oeffentliche Plan (Etappe 7) filtert "laufend" (Quereinstieg) vs. "neu/zukuenftig" ueber
  `term.start_date/end_date` + `allows_late_entry`.

---

## 6. Buchungs-Statusdiagramm

Status-Enum: `pending_payment, waitlisted, confirmed, cancelled, expired, refunded, completed`.

```
                         Kunde waehlt Kurs + Rolle + Tarif
                                      |
                       Rolle hat freien Platz?
                        /                          \
                     ja                             nein
                      |                               |
              PENDING_PAYMENT  <----- nachrueck ----  WAITLISTED
              (Platz reserviert,        (rueckt bei                 \
               Frist ~30 Min)            freiem Platz nach)          Kunde verzichtet
                      |                                                    |
       Stripe Checkout (TWINT/Karte)                                   CANCELLED
            /         |          \
   webhook        webhook       Frist ohne Zahlung
  succeeded       failed/cancel  abgelaufen
       |              |               |
   CONFIRMED     bleibt PENDING    EXPIRED
   (Buchung      (Kunde kann       (Platz wird
    fix, Mail     erneut zahlen)    freigegeben,
    an Kunde                        Warteliste
    + info@)                        rueckt nach)
       |
   Storno durch Kunde/Admin vor Frist
       |
   CANCELLED  --(Stripe Refund ausgeloest)-->  REFUNDED
       |
   (Kurs durchgefuehrt)  -->  COMPLETED
```

Harte Regel (deckt Etappe-9-Kriterium): **Eine Buchung ist erst `confirmed`, wenn die zugehoerige
Zahlung den Status `succeeded` hat** (gesetzt vom verifizierten Stripe-Webhook, nicht vom Browser-Redirect).
Bis dahin blockiert sie nur reserviert (`pending_payment`).

---

## 7. Zahlungsanbieter-Entscheid (TWINT-faehig, begruendet)

### 7.1 Entscheid: Stripe (mit Stripe Checkout), Fallback Payrexx

| Anbieter | TWINT | Karte | Gebuehren (Richtwert 2026) | Node-SDK | Fixkosten | Eignung |
|---|---|---|---|---|---|---|
| **Stripe** | **Ja** (offiziell seit 2024, Redirect) | Ja + Apple/Google Pay | TWINT 1.9% + 0.30; CH-Karte 2.9% + 0.30 | Bestes am Markt | keine | **Erstwahl** |
| Payrexx (CH) | Ja, nativ | Ja | TWINT ca. 1.3-1.5% | nur PHP offiziell | ab ca. 19 CHF/Mt fuer API | **Fallback** |
| Datatrans (CH) | Ja, nativ | Ja | individuell, intransparent | vorhanden, aufwendig | Vertrag/Setup | Overkill fuer dieses Volumen |
| Wallee (CH) | Ja (eigener Acquiring-Vertrag) | Ja | intransparent | maechtig, komplex | moeglich | zu komplex |
| Mollie | Ja | Ja | CH/TWINT weniger transparent | gut | keine | EU-fokussiert, kein Vorteil |
| SumUp | **Nein** | Ja | - | - | - | disqualifiziert (kein TWINT) |

### 7.2 Begruendung (zugeschnitten auf dieses Setup)

- **TWINT ist Pflicht** (Schweiz, sehr verbreitet) und bei Stripe offiziell abgedeckt - eine einzige
  Integration deckt TWINT, Visa/Mastercard, Apple Pay und Google Pay ab. Kein separater TWINT-Vertrag.
- **Kleines, entwicklergetriebenes Team:** Stripe hat das beste Node-SDK und die beste Doku. Das
  bedeutet am wenigsten Eigen-Code und am schnellsten live (passt zur August-Timeline).
- **Geringe Fixkosten (Kundenwunsch):** Stripe hat keine Setup- und keine Monatsgebuehr, nur
  Transaktionsgebuehren. Bei ein paar hundert Buchungen pro Staffel ideal.
- **Vollstaendig fuer die geforderte Logik:** Sandbox/Testmodus, verifizierte Webhooks, Refund-API,
  automatische Belege. Genau das, was Etappe 9 (Test-Transaktion, Fehlerfall, Refund) verlangt.
- **Fallback Payrexx**, falls Schweizer Datenhaltung oder die guenstigere TWINT-Gebuehr den Ausschlag
  geben. Preis: kleine Monatsgebuehr fuer API + mehr Eigen-Code (kein Node-SDK). Bei diesem Volumen
  ist der Gebuehren-Vorteil in Franken klein, der Mehraufwand relativ gross -> deshalb nur Fallback.

### 7.3 Integrationsweg: Stripe Checkout (gehostete Bezahlseite)

Nicht das eingebettete Payment Element und kein Eigen-Formular. Grund: TWINT ist ein Redirect-Verfahren
(Bestaetigung in der TWINT-App). Checkout uebernimmt Redirect-Handling, 3D-Secure, PCI, Mobile-Optimierung
und Fehlerfaelle komplett. Ablauf (deckt Etappe 9):

```
1. Frontend: "Kurs buchen" -> Edge Function legt bookings-Zeile (pending_payment) an,
   prueft Kapazitaet/Warteliste serverseitig in einer Transaktion.
2. Edge Function erstellt Stripe Checkout Session (Betrag aus course_prices, Zahlarten TWINT+Karte,
   success_url, cancel_url, metadata.booking_id) -> gibt Session-URL zurueck.
3. Frontend leitet auf die Stripe-Seite weiter. Stripe zeigt TWINT/Karte/Apple/Google Pay je Geraet.
4. Stripe-Webhook 'checkout.session.completed' an Edge Function:
   - Signatur pruefen, Event-ID in payment_events (Idempotenz),
   - payment.status='succeeded', booking.status='confirmed', confirmed_at=now,
   - Bestaetigungsmail an Kunde + info@ (notifications).
5. Fehlerfall (Zahlung fehlgeschlagen / Frist abgelaufen): booking bleibt pending bzw. -> expired,
   Platz wird freigegeben, Warteliste rueckt nach.
6. Storno: Refund ueber Stripe-API -> payment.status='refunded', booking.status='refunded'.
```

### 7.4 Offene Punkte fuer den Kunden (vor Etappe 9)

- Schweizer Geschaeftskonto (CHF) auf die Rechtsform Salsaflow Dance Company GmbH (UID CHE-441.271.107).
- Stripe-Onboarding: Firmendaten + Identitaetsnachweis + wirtschaftlich Berechtigte.
- MWST: ob auf Kurspreisen auszuweisen (betrifft Belege, nicht den Anbieter).
- TWINT im Stripe-Dashboard aktivieren (kein Extra-Vertrag).
- Datenstandort/Datenschutz: falls zwingend Schweizer Datenhaltung -> auf Fallback Payrexx wechseln.
- Storno-/Refund-Policy festlegen (bis wann kostenlos stornierbar, voll oder anteilig).
- Mailversand-Setup fuer info@salsaflow-dc.com (liegt heute bei Jimdo, Offene Frage 17).

---

## 8. Abdeckung des Fertig-Kriteriums (Selbstcheck)

| Kriterium (Etappe 2) | Wo erfuellt |
|---|---|
| DB-Schema Kurse | Abschnitt 2 Bereich B (terms, courses, styles, level_rungs, locations, teachers, tariffs, course_prices) |
| DB-Schema Buchungen | Abschnitt 2 Bereich C (participants, bookings) |
| DB-Schema Zahlungen | Abschnitt 2 Bereich D (payments, payment_events, notifications) |
| DB-Schema Admin | Abschnitt 2 Bereich A (admin_profiles, audit_log) + Supabase Auth |
| Eindeutige Level-Aufstiegs-Regel | Abschnitt 3 (data-driven `ordinal + 1`, Algorithmus 3.4) |
| DE/EN-Woerterbuch aller Levels/Stile | Abschnitt 4 (alle 10 Stile + alle Level + Tage + Tarife + Begriffe; Excel-Ground-Truth) |
| Buchungs-Statusdiagramm | Abschnitt 6 |
| Begruendeter TWINT-faehiger Zahlungsanbieter | Abschnitt 7 (Stripe, TWINT-Pflicht erfuellt, begruendet) |

---

## 9. Was die naechsten Etappen aus dieser Architektur brauchen

- **Etappe 3 (Assets):** keine Abhaengigkeit, laeuft parallel.
- **Etappe 5 (Backend/DB/Auth):** Dieses Schema 1:1 als Drizzle-Migration umsetzen, Supabase-Projekt
  (Region Frankfurt) anlegen, Auth fuer Admin, Seed = Staffel Januar 2026 (nur Header-Struktur, keine
  Schuelerdaten) plus die `styles`/`level_rungs`/`tariffs`-Stammdaten aus Abschnitt 3 und 4.
- **Etappe 6 (Admin-UI):** Auto-Aufstieg = Algorithmus 3.4, mit Override-Vorschau. "Staffel duplizieren"
  kopiert Kurse + setzt `level_rung` per Regel hoch + `duplicated_from`/`created_from_course_id`.
- **Etappe 7 (Kursplan):** rendert DE/EN aus `styles`/`level_rungs` + UI-Lexikon (Abschnitt 4); Filter
  laufend/zukuenftig/Tag/Stil/Level aus `terms` + `courses`.
- **Etappe 8 (Buchung):** Logik aus Abschnitt 5, Status aus Abschnitt 6, Mails ueber `notifications`.
- **Etappe 9 (Zahlung):** Stripe Checkout + Webhook aus Abschnitt 7.3; Buchung erst bei `succeeded` fix.
- **Vor Bau zu klaeren (an Fabio):** Offene Fragen 6 (Preis 190/160 nun belegt - nur bestaetigen),
  14 (On1/On2 als Attribut ok?), 15 (Flow als Bruecken-Stufe + Kategorie-Grenzen 6/12 bestaetigen),
  8 (Stripe bestaetigen), 17 (Mailversand info@).
```

