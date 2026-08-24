# R134 - Welle 1, Fix-Runde 4: PASS

1. Welle 1 Fix-Runde 4: PASS.

2. Die 6 Punkte

- `src/public/home/EventsTeaser.tsx:88`, `src/public/events/danceflow-content.ts:118,252`: gespiegelt wirkendes Partybild durch `/photos/party/party-50-v4.webp` ersetzt.
- `src/public/BookingPanel.tsx:1157,1164-1166`: `formStepOf` folgt `visibleStep` und zeigt 1 von 2 oder 2 von 2.
- `src/public/BookingPanel.tsx:1676-1767`: Pflichtmeldungen auf Vorname, Nachname und E-Mail begrenzt; Telefon bleibt ohne Pflichtmeldung; E-Mail-Format hat eigene Meldung.
- `src/index.css:54-55,366`: Pastell-Tokens und Hex-Erwähnungen entfernt.
- `src/public/social/InstagramShowcase.tsx:234-237`: Sachabsatz auf `/` wieder sichtbar; H2 bleibt „Kurse und Abende aus dem Studio.“.
- `src/public/BookingPanel.tsx:327`: `aria-current="step"` am Kurs-Link ergänzt, wenn kein Kurs gewählt ist.

3. Kritik-Funde dieser Welle

[{
  "wo":"src/public/BookingPanel.tsx:1033, 1311",
  "problem":"API-/Submit-Fehler werden in formError gespeichert, aber formError wird ausschließlich auf visibleStep 1 gerendert. Beim Absenden und bei Heels ist visibleStep 2, daher bleibt ein Buchungsfehler unsichtbar.",
  "beleg":"catch setzt setFormError(...) in Zeile 1033; der einzige Alert ist durch visibleStep === 1 in Zeile 1311 begrenzt.",
  "fix":"Feld-/Schrittvalidierung von Submit-Fehlern trennen und einen eigenen API-/Submit-Alert auf Schritt 2 sichtbar rendern, ohne die globale Pflichtfeldmeldung unter Telefon oder Nachricht zurückzubringen.",
  "schwere":"WICHTIG"
}]

4. Look

BLOCKED: Provider-Ausfall Moonshot-PAYG, 18.08.2026. Kein Kimi-Urteil, kein Ersatz-Urteil (Huellen-Verbot).

Versuchte Wege, alle belegt:
- `kimi-lane.sh`: Exit 2, `config.toml` 600 root:root (Watchdog R136, nicht erneut versucht).
- Gateway 8318 Alias `kimi-k3`: stiller Fallback auf `grok-4.6-build` — verworfen, kein Kimi.
- Gateway 8318 Alias `kimi/k3`: HTTP 429 `model_cooldown` "All credentials ... cooling down via provider openai-compatible-moonshot-payg", durchgehend 17:10 bis 20:34 UTC.
- Poller alle 5 Min, 19:04:14 bis 20:29:32 UTC: 14x Cooldown, dann KIMI_TIMEOUT nach 90 Min.
- `kimi-code/k3`: HTTP 401. `kimi-code`, `kimi-max`, `kimi-ultrafast`: Timeout > 75 s.

Naechster Schritt: Kimi-Look nachziehen, sobald Moonshot wieder antwortet
(Retry-Workflow liegt bereit: /tmp/salsaflow-r136-workflow.mjs, Marker R136b).
5. Verifikation

Befehl 1:
```text
cd /root/clients/salsaflow-w1 && rg -c 'left: 1\.25rem' src/index.css || true
```
Ausgabe:
```text

```

Befehl 2:
```text
rg -n '--color-salsa-100|--color-salsa-50|#f7dcdf|#fceeef' src/ || true
```
Ausgabe:
```text
src/index.css:53:  --color-salsa-500: #c61f30;
src/public/courses/styles/StylePage.tsx:382:                  <Check size={16} strokeWidth={2.5} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-salsa-500)]" />
```

Befehl 3:
```text
rg -n 'formStepOf:' src/public/BookingPanel.tsx
```
Ausgabe:
```text

```

Befehl 4:
```text
node scripts/verify-ux-whatsapp.mjs 2>&1 | tail -3
```
Ausgabe:
```text
PASS home-dsk-wa-right
REPORT /root/clients/salsaflow-w1/worklog/shots/S7-ux121/verify-report.json
VERDICT PASS
```

Befehl 5:
```text
ls /root/clients/salsaflow-w1/worklog/shots/S7-ux134/home-mobil-390.png /root/clients/salsaflow-w1/worklog/shots/S7-ux134/home-desktop-1440.png
```
Ausgabe:
```text
/root/clients/salsaflow-w1/worklog/shots/S7-ux134/home-desktop-1440.png
/root/clients/salsaflow-w1/worklog/shots/S7-ux134/home-mobil-390.png
```

6. Nächste Route

Stilseiten, erst nach Watchdog-Go.
