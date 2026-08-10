# Google-Reviews Salsaflow Dance Company Basel, Harvest 2026-07-07

## Kurzfazit

Rating **4.9 von 5 Sternen** bei **104 Bewertungen**. Verteilung: 100x 5 Sterne, 2x 4 Sterne, 0x 3 Sterne, 0x 2 Sterne, 2x 1 Stern. Das ist ein sehr starkes, fast makelloses Bild.

72 Bewertungen haben Text, 32 sind reine Sternebewertungen.

## Themen-Cluster (aus den Text-Reviews)

- **Coaches/Lehrer**: mit Abstand am häufigsten gelobt. Claudia und Fabio werden namentlich am öftesten erwähnt, dazu Sebastian, Vanessa, Jelena, Yannick, Jasmin, Nico. Betont wird: geduldig, kompetent, humorvoll, gehen individuell auf Fehler ein.
- **Familiäre Community**: viele Reviews beschreiben eine warme, familiäre Atmosphäre ("wie eine grosse Familie", "Salsaflow-Family"). Wiederkehrendes Wort: "familiär".
- **Flexibilität ohne festen Partner**: mehrfach gelobt, dass man sich einzeln anmelden kann und die Schule für Balance zwischen Leadern und Followern sorgt, auch bei Absagen.
- **Danceflow Night / Tanzabende / Partys**: regelmässige Partys (oft alle 2 Wochen, teils Freitagsparty) werden als Highlight genannt, um das Gelernte in lockerer Atmosphäre zu üben.
- **Anfänger-Progression**: mehrere Reviews beschreiben den Weg durch Kursstufen (Salsa 1 bis 4, Bachata Beginner) mit spürbarem Fortschritt.
- **Privatstunden für Hochzeitstanz**: mehrere neuere Reviews (2026) loben Claudia und Fabio konkret für massgeschneiderte Hochzeits-Choreos.
- **Mehrsprachigkeit**: Unterricht auf Schweizerdeutsch, Hochdeutsch, Englisch, teils Spanisch, wird als Plus erwähnt (nützlich für internationales Publikum).
- **Faire Preise/Kulanz**: z.B. keine volle Zahlung bei längerer Ferienabwesenheit.

## Kritische Stimmen (2x 1 Stern)

- Ein Reviewer (spanischsprachig) beschreibt eine als aggressiv und respektlos empfundene Reaktion auf einen eigenen Fehler.
- Ein zweiter 1-Stern-Review hat keinen Text.

Für die Website relevant: nicht zitieren, aber im Hinterkopf behalten falls Umgangston/Feedback-Kultur ein Thema wird.

## Sprachverteilung der Text-Reviews

57x Deutsch/Schweizerdeutsch, 13x Englisch, 2x Spanisch.

## Dateien in diesem Ordner

- `reviews-raw.json`: alle 104 Reviews als Rohdaten (Name, Sterne, Datum, Original-Text, Original-Sprache).
- `REVIEWS.md`: Gesamt-Rating, die 10 stärksten Zitate (kuratiert nach Aspekt), alle 72 Text-Reviews sauber formatiert, plus Liste der 32 reinen Sternebewertungen.
- `build_reviews_md.py`: Script das REVIEWS.md aus reviews-raw.json baut (bei neuem Harvest einfach reviews-raw.json ersetzen und Script neu laufen lassen).

## Wichtiger Hinweis zur Methode

Apify-Actor `compass~google-maps-reviews-scraper` war blockiert: Monatslimit überschritten (30.52 von 29 USD), Sperre bis 2026-07-09. Kein Fallback-Token vorhanden. Deshalb Daten stattdessen per Playwright-Browser direkt von der Google-Maps-Seite der Firma gezogen (Consent-Dialog akzeptiert mit "Reject all", danach Reviews-Liste bis zum Ende gescrollt, alle "More"-Texte und alle "See original"-Toggles angeklickt, damit die echte Original-Sprache statt der Google-Übersetzung im Datensatz steht).

Zwei Reviews (Sybil Schilling, Vinoth Tissa) enden mit "…" ohne weiteren Ausklapp-Button. Das ist ein bekanntes Google-Maps-Darstellungsdetail bei Emoji-Zeichen am Textende, kein Datenverlust durch die Scraping-Methode.
