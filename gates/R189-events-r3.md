# Gates: R189 Events Runde 3

Scope: Den Events-Block mobil unter 820 px bringen, Belegbilder mobil entfernen und Desktop bewahren.

ABANDON: G1 leftover-other-round nicht R189-Rest
ABANDON: G2 leftover-other-round nicht R189-Rest
ABANDON: G3 leftover-other-round nicht R189-Rest
ABANDON: G4 leftover-other-round nicht R189-Rest
ABANDON: G5 leftover-other-round nicht R189-Rest
ABANDON: G6 leftover-other-round nicht R189-Rest

- [ ] G1: Mobil rendert keine Belegbilder, Desktop rendert beide.
  EVIDENCE: pending

- [ ] G2: Der mobile Events-Block ist inklusive Hauptbild höchstens 820 px hoch.
  EVIDENCE: pending

- [ ] G3: Das mobile PNG zeigt weder zerschnittene Belegbilder noch ein WhatsApp-Overlay auf einem Belegbild.
  EVIDENCE: pending

- [ ] G4: Das neue Desktop-PNG ist mindestens so stark wie der Ausgangsstand.
  EVIDENCE: pending

- [ ] G5: Oxlint meldet für EventsTeaser.tsx Exit 0.
  CHECK: cd /root/clients/salsaflow-w1 && npx oxlint src/public/home/EventsTeaser.tsx
  EXPECT: /Found 0 warnings and 0 errors|^$/
  EVIDENCE: pending

- [ ] G6: TypeScript meldet keinen Fehler in EventsTeaser.tsx oder content.ts.
  CHECK: cd /root/clients/salsaflow-w1 && npm run typecheck
  EXPECT: /^$/
  EVIDENCE: pending

- [x] G7: Beide frischen Ziel-PNGs existieren.
  CHECK: test -s /root/clients/salsaflow-w1/worklog/shots/R189/events-r3/d-events.png && test -s /root/clients/salsaflow-w1/worklog/shots/R189/events-r3/m-events.png && printf 'PNG PASS\n'
  EXPECT: PNG PASS
  EVIDENCE: PNG PASS
