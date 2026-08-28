/* Uebergabe der Reservierungsfakten vom Buchungsdialog an /vorbereiten.
 *
 * Der Erfolgspfad verlaesst das Modal per window.location.assign, der Client-State geht
 * dabei verloren. Die vier Fakten reisen deshalb durch sessionStorage statt durch die
 * URL: eine Query landete in History, Lesezeichen und geteilten Links, obwohl sie nur
 * einen Seitenwechsel ueberdauern muss.
 *
 * Einmalig: /vorbereiten loescht den Eintrag beim Lesen. Ein spaeterer Direktaufruf oder
 * ein Reload zeigt die Faktenkarte damit nicht erneut. */
const KEY = 'sf:reservation';

export type ReservationFacts = {
  kurs: string;
  wann: string;
  wo: string;
  zahlung: string;
};

/* Zwei Wege enden auf /vorbereiten. Der Kursdialog kennt Slot, Ort und Zahlweise und
 * uebergibt sie als Faktenkarte. Das Schnupper-Formular im Hero kennt nichts davon —
 * dort gibt es keinen gewaehlten Termin. Beide muessen die Seite trotzdem von einem
 * kalten Direktaufruf unterscheiden koennen, sonst begruesst sie jemanden, der gerade
 * abgeschickt hat, wie einen Fremden. Darum zwei Formen statt erfundener Fakten. */
export type ReservationHandoff =
  | ({ kind: 'course' } & ReservationFacts)
  | { kind: 'inquiry' };

const FIELDS = ['kurs', 'wann', 'wo', 'zahlung'] as const;

function isComplete(value: Record<string, unknown>): boolean {
  return FIELDS.every((k) => typeof value[k] === 'string' && (value[k] as string).trim().length > 0);
}

function parseHandoff(value: unknown): ReservationHandoff | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (v.kind === 'inquiry') return { kind: 'inquiry' };
  // Eintraege ohne `kind` stammen aus der Fassung vor dem Schnupper-Weg: vollstaendige
  // Fakten bedeuten dort immer eine Kursbuchung.
  if (!isComplete(v)) return null;
  return {
    kind: 'course',
    kurs: (v.kurs as string).trim(),
    wann: (v.wann as string).trim(),
    wo: (v.wo as string).trim(),
    zahlung: (v.zahlung as string).trim(),
  };
}

function write(payload: ReservationHandoff): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Privater Modus oder volles Storage: die Weiterleitung laeuft trotzdem, die
    // Faktenkarte bleibt dann leer.
  }
}

export function storeReservation(facts: ReservationFacts): void {
  write({ kind: 'course', ...facts });
}

/* Der Hero-Weg hat Name und Nummer geschickt, aber keinen Termin gewaehlt. Hinterlegt
 * wird darum nur, DASS eine Anmeldung vorliegt. */
export function storeInquiry(): void {
  write({ kind: 'inquiry' });
}

export function takeReservation(): ReservationHandoff | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    return parseHandoff(JSON.parse(raw));
  } catch {
    return null;
  }
}
