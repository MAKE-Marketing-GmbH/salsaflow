/* Uebergabe der Reservierungsfakten vom Buchungsdialog an /vorbereiten.
 *
 * Der Erfolgspfad verlaesst das Modal per window.location.assign, der Client-State geht
 * dabei verloren. Die vier Fakten reisen deshalb durch sessionStorage statt durch die
 * URL: eine Query landete in History, Lesezeichen und geteilten Links, obwohl sie nur
 * einen Seitenwechsel ueberdauern muss.
 *
 * Einmalig: /vorbereiten loescht den Eintrag beim Lesen. Ein spaeterer Direktaufruf oder
 * ein Reload zeigt die Faktenkarte damit nicht erneut. */
import { z } from 'zod';

const KEY = 'sf:reservation';

/* Die Faktenfelder kommen als roher JSON-Text aus dem sessionStorage. Zod ist die
 * Parse-Grenze: getrimmt, nicht leer, sonst kein Treffer. */
const STRING_FIELD = z.string().trim().min(1);

/* Was aus JSON.parse kommen kann, bevor es geprueft ist: benannter JSON-Wert statt
 * `unknown`, damit der Parameter von parseHandoff einen Vertrag hat. Rekursiv, weil
 * JSON verschachtelt sein darf — geprueft wird trotzdem erst in parseHandoff. */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

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

/* Ein einzelnes Faktenfeld aus rohem JSON. Liefert den getrimmten Text, sonst null —
 * damit bleibt die Pruefung "ist das ein nicht-leerer String" an genau einer Stelle. */
function readField(source: ReadonlyMap<string, unknown>, key: string): string | null {
  const text = STRING_FIELD.safeParse(source.get(key));
  return text.success ? text.data : null;
}

/* Rohes JSON zu einer Feld-Map. Zod haelt jedes Objekt fest und weist alles andere
 * (Zahl, Array, null, String) ab, ohne dass hier ein Objekttyp behauptet wird. */
const ENTRY_MAP = z.record(z.string(), z.unknown());

function parseHandoff(value: JsonValue): ReservationHandoff | null {
  const parsed = ENTRY_MAP.safeParse(value);
  if (!parsed.success) return null;
  const entries = new Map(Object.entries(parsed.data));
  if (entries.get('kind') === 'inquiry') return { kind: 'inquiry' };

  // Eintraege ohne `kind` stammen aus der Fassung vor dem Schnupper-Weg: vollstaendige
  // Fakten bedeuten dort immer eine Kursbuchung.
  const kurs = readField(entries, 'kurs');
  const wann = readField(entries, 'wann');
  const wo = readField(entries, 'wo');
  const zahlung = readField(entries, 'zahlung');
  if (!kurs || !wann || !wo || !zahlung) return null;

  return { kind: 'course', kurs, wann, wo, zahlung };
}

/* Kein `typeof window`-Test: beide Aufrufer schreiben unmittelbar vor einem
 * window.location.assign, laufen also im Browser. Der Test haette nichts geprueft,
 * was hier noch offen waere (oxlint no-runtime-typeof). */
function write(payload: ReservationHandoff): void {
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

/* Kein `typeof window`-Test: /vorbereiten wird zwar prerendert, PreparePage ruft diese
 * Funktion aber ausschliesslich aus `useEffect` — der laeuft serverseitig nie. */
export function takeReservation(): ReservationHandoff | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    return parseHandoff(JSON.parse(raw));
  } catch {
    return null;
  }
}

/* Beide Erfolgspfade verlassen die Seite per window.location.assign. Bleibt die
 * Navigation aus — blockierender Extension-Handler, abgebrochener Wechsel, Rueckkehr
 * aus dem Back-Forward-Cache auf dieselbe Seite — waere das Formular ohne diesen
 * Wecker dauerhaft im Sende-Zustand eingefroren, obwohl die Anmeldung laengst steht.
 *
 * `assign()` startet die Navigation nur; bis die Antwort committed ist, lebt dieses
 * Dokument samt seinen Timern weiter. Ein blosser Timeout wuerde darum bei jeder
 * langsamen Antwort (Mobilfunk, Cold Start) faelschlich "hat nicht geklappt" melden
 * UND den Absende-Knopf mitten in der laufenden Navigation wieder freigeben — genau
 * das Fenster fuer die Doppelbuchung, die der gesperrte Knopf verhindern soll.
 * `pagehide` markiert den tatsaechlichen Abgang des Dokuments (auch in den
 * Back-Forward-Cache) und raeumt den Wecker vorher ab. */
const REDIRECT_FALLBACK_MS = 2500;

export function redirectAfterSubmit(href: string, onStalled: () => void): void {
  let timer: number | null = null;

  const cancel = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
    window.removeEventListener('pagehide', cancel);
  };

  window.addEventListener('pagehide', cancel);

  timer = window.setTimeout(() => {
    timer = null;
    window.removeEventListener('pagehide', cancel);
    onStalled();
  }, REDIRECT_FALLBACK_MS);

  window.location.assign(href);
}
