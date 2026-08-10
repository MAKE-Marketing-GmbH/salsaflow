// Typisierter Zugriff auf die Admin-API (Etappe 6). Alle Calls laufen ueber den Vite-Proxy nach /api.

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(body.error ?? `Fehler ${res.status}`, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/* ----------------------------------------------------------------------------
 * Typen (Spiegel der Server-Antworten aus server/admin.ts)
 * -------------------------------------------------------------------------- */
export type Meta = {
  styles: { id: string; key: string; nameDe: string; nameEn: string; ladderKey: string; sort: number }[];
  levelRungs: {
    id: string;
    ladderKey: string;
    ordinal: number;
    category: string;
    isFlow: boolean;
    labelDe: string;
    labelEn: string;
  }[];
  teachers: { id: string; displayName: string }[];
  locations: { id: string; name: string }[];
  tariffs: { id: string; key: string; nameDe: string; seats: number; sort: number }[];
  weekdays: { key: string; de: string }[];
};

export type TermListItem = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  weekCount: number;
  isSummer: boolean;
  status: 'draft' | 'published' | 'archived';
  duplicatedFrom: string | null;
  courseCount: number;
  createdAt: string;
};

export type AdminCourse = {
  id: string;
  styleId: string;
  styleKey: string;
  styleDe: string;
  styleEn: string;
  ladderKey: string;
  levelRungId: string | null;
  levelDe: string | null;
  levelEn: string | null;
  onVariant: 'on1' | 'on2' | null;
  weekday: string;
  weekdayDe: string;
  startTime: string;
  endTime: string;
  locationId: string;
  locationName: string;
  bookingType: 'leader_follower' | 'open';
  capacityTotal: number;
  status: 'draft' | 'open' | 'full' | 'cancelled' | 'finished';
  teachers: { id: string; displayName: string }[];
  prices: { tariffId: string; tariffKey: string; tariffDe: string; amountChf: string }[];
};

export type TermDetail = {
  term: TermListItem;
  courses: AdminCourse[];
};

export type DuplicatePreview = {
  source: { id: string; name: string };
  suggested: { name: string; startDate: string; endDate: string; weekCount: number; isSummer: boolean };
  courses: {
    courseId: string;
    styleDe: string;
    ladderKey: string;
    weekdayDe: string;
    time: string;
    onVariant: 'on1' | 'on2' | null;
    currentLevelDe: string | null;
    currentRungId: string | null;
    newLevelDe: string | null;
    targetRungId: string | null;
    autoNewAdvanced: boolean;
    changed: boolean;
  }[];
  changedCount: number;
};

/* ----------------------------------------------------------------------------
 * Buchungen / Balance (Etappe 8)
 * -------------------------------------------------------------------------- */
export type CourseAvailabilityAdmin = {
  bookingType: 'leader_follower' | 'open';
  capacityTotal: number;
  capLeader: number;
  capFollower: number;
  freeLeader: number;
  freeFollower: number;
  freeOpen: number;
  confirmedLeader: number;
  confirmedFollower: number;
  balance: number;
  needsAushilfeFollower: number;
  needsAushilfeLeader: number;
  waitlistLeader: number;
  waitlistFollower: number;
  waitlistCouple: number;
  waitlistOpen: number;
};

export type AdminBooking = {
  id: string;
  participantName: string;
  participantEmail: string;
  role: 'leader' | 'follower' | null;
  mode: 'solo' | 'couple';
  partnerName: string | null;
  needsAushilfe: boolean;
  status: 'pending_payment' | 'waitlisted' | 'confirmed' | 'cancelled' | 'expired' | 'refunded' | 'completed';
  waitlistPosition: number | null;
  createdAt: string;
};

export type CourseBalance = {
  courseId: string;
  styleDe: string;
  levelDe: string | null;
  onVariant: 'on1' | 'on2' | null;
  weekdayDe: string;
  time: string;
  bookingType: 'leader_follower' | 'open';
  capacityTotal: number;
  availability: CourseAvailabilityAdmin | null;
  bookings: AdminBooking[];
};

export type TermBalance = { term: TermListItem; courses: CourseBalance[] };

/* ----------------------------------------------------------------------------
 * Anzeige-Helfer
 * -------------------------------------------------------------------------- */
const ON_SUFFIX: Record<string, string> = { on1: ' On1', on2: ' On2' };

// Setzt das Level-Label inkl. On1/On2-Suffix zusammen (z.B. "Advanced Flow On2").
export function levelLabel(levelDe: string | null, onVariant: 'on1' | 'on2' | null): string {
  if (!levelDe) return onVariant ? (ON_SUFFIX[onVariant]?.trim() ?? 'Open Level') : 'Open Level';
  // On2 wird angezeigt, On1 ist Default und wird nur bei Salsa-Bedarf ergaenzt.
  if (onVariant === 'on2') return `${levelDe} On2`;
  return levelDe;
}

export const STATUS_LABEL: Record<string, string> = {
  draft: 'Entwurf',
  published: 'Veröffentlicht',
  archived: 'Archiviert',
  open: 'Offen',
  full: 'Ausgebucht',
  cancelled: 'Abgesagt',
  finished: 'Beendet',
};

// "2026-01-05" -> "5. Januar 2026"
const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d}. ${MONTHS_DE[(m - 1) % 12]} ${y}`;
}
