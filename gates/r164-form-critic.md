# Gates: Critic Runde 2 — Pflicht-Fehler nur einmal (R164 Form)

Scope: Urteil, ob ERROR_ONCE=1 den Check «Pflicht-Fehler nur einmal» deckt. Kein Code-Fix.

- [x] G1: Shot-Skript klickt booking-next vor role-leader
  CHECK: python3 -c "t=open('worklog/.r164-form-shots.mjs').read(); a=t.find(\"getByTestId('booking-next')\"); b=t.find('ERROR_ONCE'); c=t.find(\"getByTestId('role-leader')\"); print('ORDER_NEXT_THEN_LEADER' if 0<=a<b<c else 'ORDER_OTHER')"
  EXPECT: ORDER_NEXT_THEN_LEADER
  EVIDENCE: ORDER_NEXT_THEN_LEADER

- [x] G2: ERROR_ONCE zaehlt nur requiredHint-String
  CHECK: python3 -c "t=open('worklog/.r164-form-shots.mjs').read(); print('HINT_ONLY' if 'Bitte fülle die Pflichtfelder aus.' in t and 'fieldRequired' not in t and 'Dieses Feld ist Pflicht' not in t else 'HINT_PLUS_FIELD')"
  EXPECT: HINT_ONLY
  EVIDENCE: HINT_ONLY

- [x] G3: BookingPanel hat Sammelsatz plus Feld-Fehler
  CHECK: python3 -c "t=open('src/public/BookingPanel.tsx').read(); print('TWO_SOURCES' if 'bt.requiredHint' in t and 'booking-required-error' in t and t.count('bt.fieldRequired')>=3 else 'NOT_TWO')"
  EXPECT: TWO_SOURCES
  EVIDENCE: TWO_SOURCES

- [x] G4: Skript klickt booking-submit nicht
  CHECK: python3 -c "t=open('worklog/.r164-form-shots.mjs').read(); print('NO_SUBMIT' if 'booking-submit' not in t else 'HAS_SUBMIT')"
  EXPECT: NO_SUBMIT
  EVIDENCE: NO_SUBMIT

- [x] G5: Verdict FAIL weil Beweis den Check nicht deckt
  EVIDENCE: FAIL. ERROR_ONCE=1 nach booking-next ohne Rolle (Skript Z.51-62 vor role-leader Z.64). Original-Pfad Rolle+sofort-Weiter ungetestet. booking-submit fehlt. PNGs ohne Fehlertext. Feld-Fehler (bt.fieldRequired x3) zaehlt das Skript nicht.

ABANDON: leftover-other-round nicht R189-Rest
