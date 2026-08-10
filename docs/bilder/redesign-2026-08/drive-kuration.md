# Drive-Kuration — Salsaflow Redesign 2026-08

**Stand:** 2026-08-05 16:13 UTC  
**Quelle:** https://drive.google.com/drive/folders/1j1krxC96TklPZKCpK6BB0lDQsXcizYEZ  
**Zielordner Download:** `/root/clients/salsaflow-dc/00-brain/redesign-2026-08/assets/drive/`

## Status: BLOCKIERT — Download fehlgeschlagen

Keine Bilder heruntergeladen. Einzel-Sichtung (`Read` je Datei) und Premium-Bewertung **nicht möglich**.

### Versuche (Belege)

| Weg | Ergebnis |
|---|---|
| `pip install --break-system-packages gdown` → `~/.local/bin/gdown --folder <url> -O …/assets/drive/` | `Failed to retrieve folder contents … status code 401` |
| `curl -sI` Folder-URL | `HTTP/2 302` → `accounts.google.com/ServiceLogin?service=wise&…continue=https://drive.google.com/drive/folders/1j1krxC96TklPZKCpK6BB0lDQsXcizYEZ` |
| `curl -sL` embeddedfolderview `?id=1j1krxC96TklPZKCpK6BB0lDQsXcizYEZ` | Login-/Error-Shell (kein File-Listing) |
| Google Drive API v3 files?q=…in parents (ohne Key) | `403 PERMISSION_DENIED` / unregistered callers |
| Browser MCP (`browser_navigate` / `browser_tabs`) | Websocket-Init Timeout 30000ms gegen `127.0.0.1:9222` |
| rclone | keine nutzbare Config (`permission denied` auf `rclone.conf`) |

**Ursache:** Ordner ist für unauthentifizierte Zugriffe nicht offen („Anyone with the link“ / Viewer fehlt bzw. Login-Wall). gdown-FAQ: Permission auf „Anyone with the link“ setzen.

**Lokal im Zielordner:** leer (nur `.` / `..`). Verifiziert: `ls -la …/assets/drive/` → total 8, nur `.`/`..`.

**Nicht als Ersatz verwendet:**  
- `assets/eingang/` (IMG_7656–7670.jpg)  
- `/root/eingang/` HEICs  
- Live-Site / premium-2026-07-03  

Auftrag war explizit dieser Drive-Ordner; lokale Bestände sind bereits in `lokal-kuration.md` / `instagram-report.md` abgedeckt.

## Tabelle Datei | Urteil | Verwendung

| Datei | Urteil | Verwendung (Hero/Galerie/Team/nix) |
|---|---|---|
| — | **keine Dateien** | — |

## Nächster Schritt (Mensch)

1. Drive-Ordner-Freigabe auf **„Jeder mit dem Link“ / Viewer** setzen **oder** ZIP/Dateien nach `/root/eingang` legen bzw. direkt nach `…/assets/drive/` kopieren.  
2. Task erneut anstoßen: gdown → `Read` jeder Bilddatei → Tabelle füllen (ja/nein + Schärfe/Licht/Motiv/lost-Faktor; Verwendung Hero/Galerie/Team/nix).
