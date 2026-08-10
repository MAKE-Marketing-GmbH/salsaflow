# Instagram-Report @salsaflowdc (SalsaFlow Basel)

**Stand:** 2026-08-05  
**Re-Verify (Grok-Worker):** 2026-08-05 ~16:11 UTC — Imginn erneut 200/109 534 B, 12/13 `ig_*` JPEGs vorhanden, 1 CDN-URL 403; Browser-CDP Timeout; nativer IG-curl 302→Login / 429  
**Zielprofil:** https://www.instagram.com/salsaflowdc/  
**Asset-Ordner:** `/root/clients/salsaflow-dc/00-brain/redesign-2026-08/assets/instagram/`  
**Report-Pfad:** `/root/clients/salsaflow-dc/00-brain/redesign-2026-08/assets/instagram-report.md`

---

## 0) Zugriffslage (ehrlich)

| Kanal | Ergebnis | Beleg |
|---|---|---|
| Browser → `instagram.com/salsaflowdc/` | **blockiert** (CDP/WS Timeout 30s; früher ERR_ABORTED) | MCP `browser_navigate` 2026-08-05 |
| curl → nativer IG | **302 Login** bzw. **429** | `curl -sI` / `-sL` 16:11 UTC |
| curl → Picuki / Gramhir | **403 Cloudflare** | HTTP 403 |
| **Imginn** `imginn.com/salsaflowdc/` | **HTTP 200**, Captions in `img alt`, 13× `/p/…`, `s10.imginn.com` + scontent-CDN | 109 534 Bytes HTML (Re-fetch) |
| WebSearch „salsaflowdc“ | Profil + Bio | „Siempre con flow“, Basel SBB · [instagram.com/salsaflowdc](https://www.instagram.com/salsaflowdc/) |
| **Ersatz Website** jimcdn | 414 Dateien (früherer Batch) | `image.jimcdn.com` · [salsaflow-dc.com](https://www.salsaflow-dc.com/) |

**Fazit:** Direkt-Instagram (Browser/headless) blockt. **Imginn liefert den aktuellen Comeback-Feed** inkl. Caption-Texte in `img alt` und herunterladbare JPEGs. Zusätzlich bleiben Website-Fotos als high-res Brand-Archiv im selben Ordner (`web_*`, `web_extra_*`).

**Kontext-Hinweis aus Bio/Captions:** Account wurde von Instagram gelöscht/blockiert („more than 4000 of you were gone“) — aktuelles `@salsaflowdc` ist **Comback-Account** („Starting from the bottom… again“, „WE'RE BACK“). Ältere 4k-Follower-Historie ist weg; Feed ist jung, aber Marke/Community unverändert.

---

## 1) Profil-Kontext

- **Name:** Salsaflow Dance Company / Salsaflow DC  
- **Handle:** @salsaflowdc  
- **Ort:** Elisabethenanlage 7, 4051 Basel (SBB), Studio  
- **Fokus im Feed:** Salsa, Bachata, Heels/Lady Style, Workshops, Danceflow Nights, **FLOWEEKEND**, Anniversary Weekend, Community-Reisen (z. B. Rovinj / SeaSunSalsa)  
- **Slogan / Bio-Kern:** **„Siempre con flow“** · Tanzschule im Herzen von Basel  
- **Verwandte Handles (Captions):** @claudjinha_salsaflow, @fabio_branco_salsaflow, @sebasalsaflow, @jazyfizzle_, Guest-Artists (Maria Malakou, Maria & Vincenzo, …)  
- **Website:** https://www.salsaflow-dc.com/  
- **FB:** https://www.facebook.com/SalsaflowDC/

---

## 2) Bildwelt / Ästhetik

### 2.1 Farben (aus echten IG-Frames + Website-Showfotos)

| Schicht | Beobachtung |
|---|---|
| **Nacht / Social** | Tiefschwarz + **Gold-Lichtspuren** (Long-Exposure-Bögen), Violett/Blau Ambient, Nebel/Haze |
| **Party-Outfit** | Orange-Satin, Lila-Satin-Kleid, Spitze/Transparenz, warme Hauttöne — **glamourös, nicht club-neon-billig** |
| **Tageslicht / Festival** | High-Key Sonne, Pastell-Sport-Top (Orange/Grau), Streifenhemd, Türkis-Shorts — Urlaubs-Community |
| **Studio-Klasse** | Weiß/Hell, Parkett, Spiegelwand, Alltags-Crops (Mint, Rot, Schwarz) — **Lachen im Vordergrund** |
| **Brand-Akzent (Logo/Web)** | Salsa-Rot ca. `#ad1827` + schwarzes Script; Show-Kostüme oft Smaragd/Magenta (Website-Archiv) |
| **Gesamteindruck** | Dualität: **cinematic night party** ↔ **helle Community/Klasse** ↔ **Show-Glamour** |

### 2.2 Motive (IG-Feed, sichtbar geprüft)

1. **Social-Floor Close-ups** — Paar tanzt, Lachen, Motion-Blur/Light-Trails (`ig_684282327_…`, 1290×2289)  
2. **Elegant Social** — Satin-Orange × Lila-Kleid, Blickkontakt, volle Dancefloor-Tiefe (`ig_718792894_…`)  
3. **Festival/Outdoor-Joy** — Drinks, Sonnenbrille, Umarmung, echte Freude (`ig_724103526_…`)  
4. **Class-Collage** — mehrere Panels: Partnerwork, Heels-Line, Gruppenkreis, High-Five mit Haarspray-Gag (`ig_755170796_…`)  
5. **Event-Promo-Frames** — FLOWEEKEND / Anniversary Recaps (teils niedrigere Auflösung, 640–828px breit)  
6. **Website-Archiv ergänzend:** Founders-4, Showcast Grün, große Group vor roten Vorhängen, „SIEMPRE CON FLOW“-Merch

### 2.3 Stimmung

- **Energie + Wärme + FOMO**, nie steife Akademie  
- **Spaß ist Pflichtmotiv** (Lachen, Zunge/Pose auf Website-Group, Witze in Captions)  
- **Community first:** Paare und Gruppen > Solo-Hero-only  
- **Premium-Nachtfotografie** (Lichtspuren, Satin, Tiefe) neben **authentischem Tageslicht**  
- Keine Stock-Ästhetik, keine kalte Corporate-Bildsprache  

### 2.4 Redesign-Implikationen

- Hero: Night-Social mit Goldlicht **oder** warmes Founders/Studio  
- Events: dunkel + Gold + Menge; Kurse: hell + Lachen + Partnerwork  
- UI-Akzent bleibt **Rot** (`#ad1827`); Orange/Lila/Gold sind **Fotofarben**, nicht zwingend Tokens  
- Echte Menschen behalten — Feed-Qualität reicht für Web, wenn high-res Website-Frames mitgenutzt werden  

---

## 3) Heruntergeladene Assets

**Pfad:** `/root/clients/salsaflow-dc/00-brain/redesign-2026-08/assets/instagram/`  
**Gesamt:** **426 Dateien · ~152 MB**

| Prefix | Quelle | Anzahl (ca.) | Nutzen |
|---|---|---|---|
| `ig_*.jpg` | Imginn/IG-CDN (2026-08-05) | **12** | Echte aktuelle Feed-Motive |
| `web_*.jpg/png` | Website Homepage high-res | 20 | Hero-/Show-tauglich |
| `web_extra_*.jpg/png` | Website-Unterseiten Crawl | ~394 | Volumen-Archiv |

### 3.1 Native IG-Dateien (neu)

| Datei | px | Kurzinhalt |
|---|---:|---|
| `ig_684282327_18098636569927530_4362564149766705128_n.jpg` | 1290×2289 | Night social, Lace-Top, Gold-Lighttrails — **stärkstes IG-Hero** |
| `ig_718792894_18104659798927530_1311981161491831914_n.jpg` | 1290×1720 | Orange-Satin × Lila-Kleid, lachendes Paar |
| `ig_724103526_18106093483927530_1561586528101412939_n.jpg` | 1290×1613 | Outdoor Festival-Paar, Drinks, Sonne |
| `ig_755170796_18112675303927530_1627223146721807841_n.jpg` | 1290×1613 | Studio-Collage: Klasse, Heels, High-Five |
| `ig_684222478_…` | 1290×865 | Landscape-Frame (Feed) |
| `ig_759002273_…`, `ig_729603414_…`, `ig_758395690_…`, `ig_684272286_…` | ~828×1470 | Verticals / Reels-Thumbs |
| `ig_750211034_…`, `ig_743016956_…`, `ig_746384475_…` | 480–828 | kleinere Promo/Thumbs |

**Nicht enthalten:** volle Reels-MP4s (URLs im HTML vorhanden, nicht batch-gespeichert), Stories, Avatar (bewusst übersprungen).

### 3.2 Website-Stichproben (weiterhin gültig)

| Datei | Inhalt |
|---|---|
| `web_1_i5742066fda3099be.jpg` | Founders-4, Lila/Weiß/Jeans |
| `web_5_ib4d5534991ba6114.jpg` | Team + „SIEMPRE CON FLOW“-Shirt |
| `web_8_ifa174e23863005de.jpg` | Riesige Show-Gruppe, rote Vorhänge |
| `web_10_i5061079fb98e7705.jpg` | Show-Cast Grün unter Spots |
| `web_3_i08e0a5f4e840dea0.jpg` | Studio-Community bunt vor Logo |

---

## 4) Tonalität / Wording (Captions — **verifiziert aus Imginn alts**)

### 4.1 Stimme

| Eigenschaft | Ausprägung |
|---|---|
| **Anrede** | We/You, warm, „our people“, „you“ |
| **Sprachen** | **EN dominant** im aktuellen IG-Feed; DE sporadisch (z. B. Dis.co: „Was wir erleben, müssen wir festhalten…“) |
| **Emoji** | dicht, emotional (❤️‍🔥 😭 🥳 💃🕺 ✨ 🔥 📅) — nicht peinlich-corporate |
| **Register** | Freund:in-Storytelling, Party-Host, Community-Mama/Papa — **kein** Agentur-Deutsch |
| **Humor** | Self-deprecating (Account-Löschung), FOMO-Witze („staying home is overrated“) |
| **CTA** | Follow, Save the date, Website/Tickets, „FLOW into the weekend“ |

### 4.2 Echte Caption-Beispiele (Auszug)

**Bio / Comeback-Pin-Stil:**
> Starting from the bottom… again🙄  
> Instagram deleted us, but in real life nothing ever stopped💃🏽🕺🏼  
> Same people. Same energy. Just a new account🤪  
> Follow us & be part of the comeback❤️

**WE'RE BACK:**
> Our Instagram got blocked and with it, more than 4000 of you were gone😭  
> … one thing never changed: the people, the energy, the love for dancing🥳

**Why Salsaflow? (Value Props als Emoji-Liste):**
> ✨ A warm, family-like atmosphere  
> 💃 Experienced instructors  
> 🎉 Regular parties (Danceflow Nights)  
> 🌍 Major events … (Anniversary & FloWeekend)  
> 🎧 Top DJs & the best dance floor atmosphere  
> 👯‍♂️ … Styling, Bachata, Salsa, Heels  
> … you don’t just learn how to dance - you become part of a community❤️

**Event-Promo FLOWEEKEND 9–10 Oct 2026:**
> Two days filled with Salsa, Bachata & amazing vibes!  
> … workshops … 2 dance floors & 2 DJs … Bootcamp with Maria & Vincenzo …  
> 👉 Secure your spot now and **FLOW into the weekend!** ❤️

**Anniversary Save-the-date:**
> Some moments deserve to be relived…  
> 📅 Save the date: 19. - 21.03.2027

**Community-Reise:**
> One of the most beautiful things about running a dance school is seeing our people dancing all over the world😍  
> … seaside dance floors of Rovinj …

**Heels-Collab-Muster (oft von Teachers/Gästen getaggt):**
> ~ I adore you ~ / ~ LET ME BE ~  
> Bullet-Credits: Song / Shoes / At @salsaflowdc / Filmed / DC  
> Hashtags: `#heels` `#heelsdance` `#heelsbasel` `#highheelsbasel`

**DE-poetisch (Dis.co Part I):**
> Was wir erleben, müssen wir festhalten, um es mit der Welt zu teilen.

### 4.3 Marken-Phrasen (Feed + Site)

- siempre con flow / SIEMPRE CON FLOW  
- FLOWEEKEND · Danceflow Night · FloWeekend · Anniversary Weekend · SFIT  
- family-like atmosphere / community  
- FLOW into the weekend  
- Dance what you feel & feel what you dance (Website)  
- Qualität, Leidenschaft, Spass (FB)  
- bailar es vivir (Claudia, Website)

### 4.4 Satzmuster für Web-Copy-Anpassung

1. **Hook emotional** → kurzer Story-Beat → **konkreter Termin/CTA**  
2. **Emoji-Bullet Value Props** statt langer Feature-Sätze  
3. **We-Voice** („our people“, „we’re already counting down“)  
4. Event: **Datum + Floors/DJs/Artists + Website-Link-Logik**  
5. Comeback/Resilience als Authentizitäts-Asset nutzbar, aber **nicht** Dauer-Thema auf der Website  

### 4.5 Was **nicht** nach Salsaflow-IG klingt

- Kaltes Startup-English („Scale your dance journey“)  
- Formelles Sie  
- Lange Essay-Captions ohne Emoji/CTA  
- Rein technischer On2-Jargon ohne Community/Spaß  
- Sterile Stock-Bild-Sprache  

### 4.6 Website vs. IG

| | Website (DE) | IG Feed (EN-lastig) |
|---|---|---|
| Anrede | Du / Ihr | You / We |
| Länge | Absätze, Willkommenstext | Kurz–mittel + Emoji |
| CTA | Schnupper, Kurs finden | Follow, Save the date, Tickets |
| Würze | sparsam ES/EN | dichter Emoji, Party-Tone |

Für **DE-Website-Redesign:** IG-Energie behalten, aber **Du-Form + klarere DE-Sätze** (Website-DNA), nicht 1:1 englische Captions kopieren.

---

## 5) Empfehlungen Redesign

1. **Visual System:** Night-Gold/Dunkel für Events; High-Key Studio für Kurse/Team; Festival-Tageslicht für Community-Proof.  
2. **Hero-Kandidaten:** `ig_684282327_…` (Lighttrails), `ig_718792894_…` (Satin-Paar), `web_10_…` (Show Grün), `web_1_…` (Founders).  
3. **Headline-Ton:** Du + Flow + Basel; max. ein lateinisches Fragment pro Block („siempre con flow“).  
4. **Social Proof:** lachende Gruppen/Paare > sterile Portraits.  
5. **Event-Blöcke:** Caption-Logik (Hook → Bullet → Datum → CTA „FLOW into…“).  
6. **Optional später:** Reels-MP4s von Imginn/scontent speichern; Follower-Counts wenn Account stabil ist.

---

## 6) Verifikation (Grok-Re-run 2026-08-05)

```text
ls /root/clients/salsaflow-dc/00-brain/redesign-2026-08/assets/instagram/ig_*.jpg | wc -l
# → 12

file …/ig_684282327_18098636569927530_4362564149766705128_n.jpg
# → JPEG … 1290x2289 progressive

find …/instagram -type f | wc -l
# → 426  (12 ig + 414 web*)
du -sh …/instagram/
# → 152M

curl -sL -A 'Mozilla/5.0 …' -o /tmp/imginn_salsaflow.html -w '%{http_code} %{size_download}' \
  https://imginn.com/salsaflowdc/
# → 200 109534

# 13 unique s10.imginn basenames; 12 on disk; missing:
# ig_683632074_18097526428927530_6698816657973144601_n.jpg → HTTP 403 on re-download

curl -sI https://www.instagram.com/salsaflowdc/ | head -1
# → HTTP/2 302 (login redirect)
# -sL later → 429

# Picuki/Gramhir → 403 CF
# MCP browser → Timeout connecting to CDP 9222 / page load
```

**Open / Grenzen:**
- Kein vollständiger historischer Feed (nur aktueller Comeback-Grid auf Imginn; Account-Reset nach IG-Löschung).  
- 1 von 13 Imginn-Thumb-URLs beim Re-Download 403.  
- Follower/Following in Imginn-Meta unzuverlässig (`undefined`); WebSearch-Snippet ~942 Followers (Comeback).  
- Reels-MP4s nicht archiviert (CDN-Query-URLs im HTML, batch nicht gezogen).  
- Captions aus `alt` — Imginn hängt teils „taken in … by @salsaflowdc“ an (Mirror-Artefakt).  
- Direktes Instagram bleibt headless/VPS-seitig unbrauchbar.

---

*Grok-Worker: Report re-verifiziert + leicht aktualisiert (untrusted bis Zweitprüfung anderer Modellfamilie). Keine Commits.*
