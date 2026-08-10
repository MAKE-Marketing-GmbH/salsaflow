#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Baut REVIEWS.md aus reviews-raw.json. Zahlen/Zaehlungen laufen ueber Code (Regel 088)."""
import json
import re
import os

BASE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE, "reviews-raw.json"), encoding="utf-8") as f:
    data = json.load(f)

reviews = data["reviews"]
total = data["totalReviews"]
rating = data["overallRating"]
dist = data["distribution"]

with_text = [r for r in reviews if r["text"]]
without_text = [r for r in reviews if not r["text"]]

def first_name(full_name):
    if not full_name:
        return "Anonym"
    # bei reinen Vornamen / Einzelwoertern unveraendert lassen
    parts = full_name.strip().split()
    return parts[0] if parts else full_name

def approx_days(date_str):
    if not date_str:
        return 99999
    s = date_str.replace("Edited ", "").strip().lower()
    m = re.match(r"a[n]?\s+(\w+)\s+ago", s)
    if m:
        unit = m.group(1)
        unit_days = {"day": 1, "week": 7, "month": 30, "year": 365}
        return unit_days.get(unit, 99999)
    m = re.match(r"(\d+)\s+(\w+)s?\s+ago", s)
    if m:
        n = int(m.group(1))
        unit = m.group(2)
        unit_days = {"day": 1, "week": 7, "month": 30, "year": 365}
        return n * unit_days.get(unit, 99999)
    return 99999

for r in reviews:
    r["_days"] = approx_days(r["date"])

with_text_sorted = sorted(with_text, key=lambda r: r["_days"])

# Top-10 staerkste Zitate (kuratiert, review_id -> kurzer Grund)
top10_ids = [
    "ChdDSUhNMG9nS0VJQ0FnTURnMmFTMXdnRRAB",  # Deliu Doinita Andreea - Anfaenger-Kurs-Progression
    "ChdDSUhNMG9nS0VJQ0FnSURqc08yeThRRRAB",  # Linda Baumgartl - Flexibilitaet, Team, Partys
    "ChdDSUhNMG9nS0VJQ0FnSUQ1MmZiMmpnRRAB",  # Sarah Eichkorn - Charme, Family-Feeling
    "ChZDSUhNMG9nS0VJQ0FnSURYdlBIRUxnEAE",  # Marco Emmenegger - Bachata-Kurs, geduldige Lehrer
    "ChdDSUhNMG9nS0VJQ0FnSUNodzR6eTJRRRAB",  # Larissa K. - Sprachen, faire Preise, Community
    "Ci9DQUlRQUNvZENodHljRjlvT2twR2NqRlRWMlExUW5WVU5HWTJlRUZCV0VKelRHYxAB",  # Sofia Tschopp - individuelle Betreuung, Danceflow Night
    "ChdDSUhNMG9nS0VJQ0FnTURnOTRlTnVBRRAB",  # Irma Waltisberg - ohne Partner anmelden, Freitagsparty
    "Ci9DQUlRQUNvZENodHljRjlvT25wcmRrbFhXRGxsVmtsM1lrRk9aV2R2WVhoYWRGRRAB",  # Nicola Schilling - Hochzeitstanz Privatstunde
    "ChdDSUhNMG9nS0VJQ0FnSUR2bVpUSWdBRRAB",  # Rahel Bolli - Tanzabende, Stimmung
    "ChdDSUhNMG9nS0VJQ0FnSURqbnVEd3JRRRAB",  # Solange Burmeister - beste Tanzschule Basel, familiaer
]
top10_reason = {
    "ChdDSUhNMG9nS0VJQ0FnTURnMmFTMXdnRRAB": "Anfänger-Progression (Salsa 1-4 + Bachata)",
    "ChdDSUhNMG9nS0VJQ0FnSURqc08yeThRRRAB": "Flexibilität + Team + Partys",
    "ChdDSUhNMG9nS0VJQ0FnSUQ1MmZiMmpnRRAB": "Individuelle Rückmeldung + Family-Feeling",
    "ChZDSUhNMG9nS0VJQ0FnSURYdlBIRUxnEAE": "Bachata-Kurs, geduldige Coaches",
    "ChdDSUhNMG9nS0VJQ0FnSUNodzR6eTJRRRAB": "Sprachenvielfalt + faire Preise + Community",
    "Ci9DQUlRQUNvZENodHljRjlvT2twR2NqRlRWMlExUW5WVU5HWTJlRUZCV0VKelRHYxAB": "Individuelle Betreuung + Danceflow Night",
    "ChdDSUhNMG9nS0VJQ0FnTURnOTRlTnVBRRAB": "Anmeldung ohne Partner + Freitagsparty",
    "Ci9DQUlRQUNvZENodHljRjlvT25wcmRrbFhXRGxsVmtsM1lrRk9aV2R2WVhoYWRGRRAB": "Hochzeitstanz-Privatstunde",
    "ChdDSUhNMG9nS0VJQ0FnSUR2bVpUSWdBRRAB": "Tanzabende + Stimmung",
    "ChdDSUhNMG9nS0VJQ0FnSURqbnVEd3JRRRAB": "Beste Tanzschule Basel + familiär",
}

by_id = {r["reviewId"]: r for r in reviews}

lines = []
lines.append("# Google-Bewertungen Salsaflow Dance Company Basel")
lines.append("")
lines.append(f"**Gesamt-Rating: {rating} von 5** ({total} Bewertungen)")
lines.append("")
lines.append(f"- 5 Sterne: {dist['5']}")
lines.append(f"- 4 Sterne: {dist['4']}")
lines.append(f"- 3 Sterne: {dist['3']}")
lines.append(f"- 2 Sterne: {dist['2']}")
lines.append(f"- 1 Stern: {dist['1']}")
lines.append("")
lines.append(f"Davon {len(with_text)} Bewertungen mit Text, {len(without_text)} nur mit Sternen.")
lines.append("")
lines.append("Quelle: Google Maps, direkt per Browser gezogen (Original-Sprache, nicht Google-Übersetzung). "
             "Apify-Actor war blockiert (Monatslimit überschritten, Sperre bis 2026-07-09).")
lines.append("")
lines.append("---")
lines.append("")
lines.append("## Die 10 stärksten Zitate")
lines.append("")
lines.append("Verschiedene Aspekte: Anfänger, Community, Coaches, Partys, Privatstunden.")
lines.append("")

for rid in top10_ids:
    r = by_id[rid]
    name = first_name(r["name"])
    stars = r["stars"]
    date = r["date"]
    text = r["text"].replace("\n", " ").strip()
    reason = top10_reason[rid]
    lines.append(f"### {name}, {stars}/5 Sterne, {date}")
    lines.append(f"*Aspekt: {reason}*")
    lines.append("")
    lines.append(f"> {text}")
    lines.append("")

lines.append("---")
lines.append("")
lines.append("## Alle Text-Bewertungen")
lines.append("")
lines.append(f"Sortiert von neu nach alt, {len(with_text_sorted)} Stück.")
lines.append("")

for r in with_text_sorted:
    name = first_name(r["name"])
    stars = r["stars"]
    date = r["date"]
    text = r["text"].strip()
    lines.append(f"**{name}**, {stars}/5 Sterne, {date}")
    lines.append("")
    lines.append(f"> {text}")
    lines.append("")

lines.append("---")
lines.append("")
lines.append(f"## Bewertungen nur mit Sternen (ohne Text, {len(without_text)} Stück)")
lines.append("")
names_only = [f"{first_name(r['name'])} ({r['stars']}/5, {r['date']})" for r in without_text]
lines.append(", ".join(names_only))
lines.append("")

out = "\n".join(lines)
with open(os.path.join(BASE, "REVIEWS.md"), "w", encoding="utf-8") as f:
    f.write(out)

print("REVIEWS.md geschrieben. Top10:", len(top10_ids), "Mit Text:", len(with_text_sorted), "Nur Sterne:", len(without_text))
