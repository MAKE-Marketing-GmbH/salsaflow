# 06 — FINAL DE-Copy: `/kursplan`

**Route:** `/kursplan` · **Prio:** P1 · **Hauptbegriff:** kursplan tanzschule basel
**Nebenbegriffe:** salsa kurse basel termine
**Suchabsicht:** konkret, terminnah. Besucher:in will einen passenden Kurs finden und sich anmelden.
**Primary Conversion:** C2 Buchung starten · **Secondary:** WhatsApp bei Fragen
**Meta-Title:** Kursplan für Tanzkurse in Basel | Salsaflow
**Meta-Description:** Der ganze Kursplan auf einen Blick. Filtere Salsa, Bachata und Heels nach Tag, Stil und Level — und finde deinen nächsten Kurs in Basel.

> Kein „gratis" (S-02). Termine, Lehrpersonen, Zeiten und Kapazität kommen **datengetrieben** aus dem Kursmodell — Copy erfindet keine. Der Kursplan liest nur veröffentlichte Kurs-/Staffel-Daten; Kapazität und Warteliste werden serverseitig entschieden ([`ARCHITEKTUR.md`](/root/clients/salsaflow-dc/ARCHITEKTUR.md:550-629)).

---

## Section 1 — Hero

# Der Kursplan.

Alle neuen und laufenden Kurse auf einen Blick. Filtere nach Stil, Level, Tag und Termin — als Quereinsteiger:in siehst du auch, wo du mitten in einer Staffel einsteigen kannst.

---

## Section 2 — Kurskalender (datengetrieben)

**Filter:** Stil (Salsa / Bachata / Heels) · Level · Wochentag · Zeitraum · Status (neu / laufend / Quereinstieg).

**Kurskarte rendert je Kurs:** Titel, Stil, Level/Stufe, Wochentag, Zeit, Zeitraum, Lehrperson(en), Ort (Elisabethenanlage 7), Preis, Status.

**Zustände (sichtbare Sprache nach [`05b-copy-style.md` §6](/root/clients/salsaflow-dc/website-plan/05b-copy-style.md)):**

| Zustand | Sichtbare Sprache |
|---|---|
| Laden | „Kursplan wird geladen …" |
| Leer | „Gerade keine passenden Kurse. Filter anpassen oder WhatsApp schreiben." |
| Fehler | „Der Kursplan konnte nicht geladen werden. Bitte versuche es erneut oder schreib uns." |
| Frei | „Plätze frei" |
| Laufend | „Quereinstieg möglich" — nur wenn `allows_late_entry` bestätigt |
| Voll | „Ausgebucht / Auf die Warteliste" |

**Buchung:** Ein voller Kurs zeigt „Auf die Warteliste", nicht eine erfolgreiche Buchung. `confirmed` entsteht erst nach verifiziertem Stripe-Webhook — die Seite behauptet keine Bestätigung aus einer Browser-Rückkehr.

[Primary auf Kurskarte] **Anmelden** → `/buchung?course=<id>`

---

## Section 3 — Hilfe

## Nicht sicher, welcher Kurs passt?

Wir helfen dir beim Einstieg — persönlich und ohne Umwege.

[Textlink] **Level im Detail ansehen →** `/kursaufbau`
[Textlink] **WhatsApp schreiben →** `wa.me/41764788411`
[Textlink] **Probestunde anfragen →** `/kontakt#schnupperstunde`

---

**Interne Pflicht-Links:** `/tanzkurse`, `/tanzkurse/salsa`, `/tanzkurse/bachata`, `/tanzkurse/heels`, `/kursaufbau`, `/preise`, `/kontakt#schnupperstunde`, WhatsApp.
**Schema:** `Course` nur für sichtbare, bestätigte Kurse.
**Claim-Check:** kein „gratis", keine erfundenen Termine/Plätze/Lehrpersonen — alles datengetrieben, „Quereinstieg" nur mit `allows_late_entry`.
