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

const FIELDS = ['kurs', 'wann', 'wo', 'zahlung'] as const;

function isComplete(value: unknown): value is ReservationFacts {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return FIELDS.every((k) => typeof v[k] === 'string' && (v[k] as string).trim().length > 0);
}

export function storeReservation(facts: ReservationFacts): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(facts));
  } catch {
    // Privater Modus oder volles Storage: die Weiterleitung laeuft trotzdem, die
    // Faktenkarte bleibt dann leer.
  }
}

export function takeReservation(): ReservationFacts | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    const parsed: unknown = JSON.parse(raw);
    if (!isComplete(parsed)) return null;
    return {
      kurs: parsed.kurs.trim(),
      wann: parsed.wann.trim(),
      wo: parsed.wo.trim(),
      zahlung: parsed.zahlung.trim(),
    };
  } catch {
    return null;
  }
}
