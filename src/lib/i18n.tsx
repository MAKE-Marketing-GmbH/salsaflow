// Zweisprachigkeit (DE/EN) fuer den oeffentlichen Kursplan (Etappe 7).
// Quelle der Begriffe: ARCHITEKTUR.md Abschnitt 4 (Woerterbuch) + 4.5 (UI-Lexikon).
// Level-/Stil-Begriffe kommen aus der DB (label_de/en, name_de/en); hier liegt nur das
// statische UI-Lexikon plus der Sprach-Umschalter. Bewusst eigenstaendig gehalten, damit
// Etappe 15 (Zweisprachigkeit sitewide) den Provider hochziehen kann.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'de' | 'en';

const STORAGE_KEY = 'salsaflow-lang';

/* Wochentage DE/EN (lang + kurz), aus ARCHITEKTUR.md 4.3 */
export const WEEKDAY_LABEL: Record<Lang, Record<string, { long: string; short: string }>> = {
  de: {
    mon: { long: 'Montag', short: 'Mo' },
    tue: { long: 'Dienstag', short: 'Di' },
    wed: { long: 'Mittwoch', short: 'Mi' },
    thu: { long: 'Donnerstag', short: 'Do' },
    fri: { long: 'Freitag', short: 'Fr' },
    sat: { long: 'Samstag', short: 'Sa' },
    sun: { long: 'Sonntag', short: 'So' },
  },
  en: {
    mon: { long: 'Monday', short: 'Mon' },
    tue: { long: 'Tuesday', short: 'Tue' },
    wed: { long: 'Wednesday', short: 'Wed' },
    thu: { long: 'Thursday', short: 'Thu' },
    fri: { long: 'Friday', short: 'Fri' },
    sat: { long: 'Saturday', short: 'Sat' },
    sun: { long: 'Sunday', short: 'Sun' },
  },
};

/* Statisches UI-Lexikon (ARCHITEKTUR.md 4.5) */
export type Dict = {
  planTitle: string;
  planLead: string;
  phaseAll: string;
  phaseRunning: string;
  phaseUpcoming: string;
  phaseLate: string;
  filterDay: string;
  filterStyle: string;
  filterLevel: string;
  allDays: string;
  allStyles: string;
  allLevels: string;
  reset: string;
  spotsAvailable: string;
  fullyBooked: string;
  lateEntry: string;
  runningNow: string;
  startsOn: string;
  teacherTba: string;
  noCourses: string;
  resultOne: string;
  resultMany: string;
  loading: string;
  loadError: string;
  retry: string;
  summerBadge: string;
};

export const UI: Record<Lang, Dict> = {
  de: {
    planTitle: 'Kursplan öffnen und passenden Kurs finden.',
    planLead:
      'Wähle Tanzstil, Level und Termin oder starte mit einer Gratis Schnupperstunde, wenn du noch unsicher bist.',
    phaseAll: 'Alle',
    phaseRunning: 'Laufende Kurse',
    phaseUpcoming: 'Neu & zukünftig',
    phaseLate: 'Quereinsteiger',
    filterDay: 'Tag',
    filterStyle: 'Stil',
    filterLevel: 'Level',
    allDays: 'Alle Tage',
    allStyles: 'Alle Stile',
    allLevels: 'Alle Level',
    reset: 'Filter zurücksetzen',
    spotsAvailable: 'Plätze frei',
    fullyBooked: 'Ausgebucht',
    lateEntry: 'Quereinstieg möglich',
    runningNow: 'läuft gerade',
    startsOn: 'Start',
    teacherTba: 'Lehrer folgt',
    noCourses: 'Für diese Auswahl gibt es aktuell keine Kurse.',
    resultOne: 'Kurs',
    resultMany: 'Kurse',
    loading: 'Kursplan wird geladen...',
    loadError: 'Der Kursplan konnte nicht geladen werden.',
    retry: 'Erneut versuchen',
    summerBadge: 'Sommerkurse',
  },
  en: {
    planTitle: 'Open the schedule and find the right course.',
    planLead:
      'Choose a dance style, level and time, or start with a free trial class if you are still unsure.',
    phaseAll: 'All',
    phaseRunning: 'Ongoing courses',
    phaseUpcoming: 'New & upcoming',
    phaseLate: 'Join mid-term',
    filterDay: 'Day',
    filterStyle: 'Style',
    filterLevel: 'Level',
    allDays: 'All days',
    allStyles: 'All styles',
    allLevels: 'All levels',
    reset: 'Reset filters',
    spotsAvailable: 'Spots available',
    fullyBooked: 'Fully booked',
    lateEntry: 'Late entry possible',
    runningNow: 'running now',
    startsOn: 'Starts',
    teacherTba: 'Teacher to be announced',
    noCourses: 'There are currently no courses for this selection.',
    resultOne: 'course',
    resultMany: 'courses',
    loading: 'Loading schedule...',
    loadError: 'The schedule could not be loaded.',
    retry: 'Try again',
    summerBadge: 'Summer courses',
  },
};

/* Buchungs-Lexikon (Etappe 8). Quelle: ARCHITEKTUR.md 4.5. Bewusst getrennt vom Plan-Dict,
   damit es spaeter (Etappe 11/15) eigenstaendig erweitert werden kann. */
export type BookingDict = {
  bookNow: string;
  title: string;
  notBookable: string;
  chooseRole: string;
  leader: string;
  follower: string;
  roleHelper: string;
  openClassNote: string;
  roleFull: string;
  courseFull: string;
  registration: string;
  solo: string;
  couple: string;
  aushilfeLabel: string;
  aushilfeHint: string;
  yourData: string;
  partnerData: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneOptional: string;
  tariff: string;
  submit: string;
  submitting: string;
  cancel: string;
  close: string;
  requiredHint: string;
  errorGeneric: string;
  successConfirmedTitle: string;
  successConfirmedBody: string;
  successWaitlistTitle: string;
  loading: string;
  redirecting: string;
  payOnSite: string;
  payOnlineOption: string;
  priceOnRequest: string;
  pricePerCourse: string;
  priceFree: string;
  stepRegister: string;
  stepData: string;
  reserveCta: string;
  payOnSiteNote: string;
  weeksNote: string;
  message: string;
  messageOptional: string;
  messagePlaceholder: string;
  successNextTitle: string;
  successNextMail: string;
  successNextLocation: string;
  successNextBring: string;
  waitlistBodyExtra: string;
  toSchedule: string;
  retry: string;
  backToCourses: string;
  back: string;
};

export const BOOKING_UI: Record<Lang, BookingDict> = {
  de: {
    bookNow: 'Jetzt buchen',
    title: 'Kurs buchen',
    notBookable: 'Dieser Kurs ist aktuell nicht buchbar.',
    chooseRole: 'Ich tanze als',
    leader: 'Mann',
    follower: 'Frau',
    roleHelper: 'Meistens tanzen Frauen als Follower und Männer als Leader. Wähle einfach, was auf dich zutrifft — wir brauchen das nur für die Balance im Kurs.',
    openClassNote: 'Offene Klasse - keine Rollenwahl nötig.',
    roleFull: 'Diese Rolle ist gerade voll. Du kommst auf die Warteliste.',
    courseFull: 'Dieser Kurs ist gerade voll. Du kommst auf die Warteliste.',
    registration: 'Anmeldung',
    solo: 'Allein',
    couple: 'Als Paar',
    aushilfeLabel: 'Ich habe keine feste Tanzpartnerin / keinen festen Tanzpartner.',
    aushilfeHint: 'Kein Problem. Wir organisieren dir die Gegenrolle (Aushilfe).',
    yourData: 'Deine Daten',
    partnerData: 'Daten deiner Tanzpartnerin / deines Tanzpartners',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phone: 'Telefon',
    phoneOptional: 'optional',
    tariff: 'Tarif',
    submit: 'Platz reservieren',
    submitting: 'Wird reserviert...',
    cancel: 'Abbrechen',
    close: 'Schliessen',
    requiredHint: 'Bitte fülle die Pflichtfelder aus.',
    errorGeneric: 'Buchung fehlgeschlagen. Bitte versuche es erneut.',
    successConfirmedTitle: 'Reservierung ist da',
    successConfirmedBody: 'Schön, dass du dabei bist. Wir prüfen den Platz und bestätigen dir kurz. Zahlen kannst du einfach vor Ort (Twint oder Bar).',
    successWaitlistTitle: 'Du bist auf der Warteliste',
    loading: 'Verfügbarkeit wird geprüft...',
    redirecting: 'Weiter zur sicheren Bezahlung...',
    payOnSite: 'Zahlst du einfach vor Ort — Twint oder Bar. Keine Online-Zahlung nötig.',
    payOnlineOption: 'Lieber gleich online mit TWINT oder Karte zahlen.',
    priceOnRequest: 'Preis auf Anfrage',
    pricePerCourse: 'für 8 Wochen',
    priceFree: 'kostenlos',
    stepRegister: '1 · Anmeldung',
    stepData: '2 · Deine Daten',
    reserveCta: 'Platz reservieren',
    payOnSiteNote: 'Zahlung vor Ort mit TWINT oder bar.',
    weeksNote: '8 Wochen · 1 Lektion pro Woche',
    message: 'Nachricht',
    messageOptional: 'optional',
    messagePlaceholder: 'Zum Beispiel: Ich habe vor zwei Jahren mal Salsa getanzt …',
    successNextTitle: 'So geht es weiter',
    successNextMail: 'Wir melden uns bei dir und bestätigen deinen Platz — meist am selben Tag.',
    successNextLocation: 'Studio Elisabethenanlage 7, 4051 Basel — 5 Minuten vom Bahnhof SBB.',
    successNextBring: 'Bring bequeme Kleidung und saubere Schuhe mit flacher Sohle mit.',
    waitlistBodyExtra: 'Sobald ein Platz frei wird, schreiben wir dir sofort.',
    toSchedule: 'Zurück zum Kursplan',
    retry: 'Erneut versuchen',
    backToCourses: 'Anderen Kurs wählen',
    back: 'Zurück',
  },
  en: {
    bookNow: 'Book now',
    title: 'Book course',
    notBookable: 'This course is currently not bookable.',
    chooseRole: 'I dance as',
    leader: 'Man',
    follower: 'Woman',
    roleHelper: 'Usually women dance as followers and men as leaders. Just pick what fits you — we only need this to keep the class balanced.',
    openClassNote: 'Open class - no role selection needed.',
    roleFull: 'This role is currently full. You will join the waiting list.',
    courseFull: 'This course is currently full. You will join the waiting list.',
    registration: 'Registration',
    solo: 'Solo',
    couple: 'As a couple',
    aushilfeLabel: 'I do not have a fixed dance partner.',
    aushilfeHint: 'No problem. We will arrange a partner for you.',
    yourData: 'Your details',
    partnerData: "Your partner's details",
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone',
    phoneOptional: 'optional',
    tariff: 'Tariff',
    submit: 'Reserve my spot',
    submitting: 'Reserving...',
    cancel: 'Cancel',
    close: 'Close',
    requiredHint: 'Please fill in the required fields.',
    errorGeneric: 'Booking failed. Please try again.',
    successConfirmedTitle: 'Your request is in',
    successConfirmedBody: 'Great to have you. We check the spot and confirm it shortly. You can simply pay on site (TWINT or cash).',
    successWaitlistTitle: 'You are on the waiting list',
    loading: 'Checking availability...',
    redirecting: 'Continuing to secure payment...',
    payOnSite: 'You simply pay on site — TWINT or cash. No online payment needed.',
    payOnlineOption: 'Prefer to pay online right away with TWINT or card.',
    priceOnRequest: 'Price on request',
    pricePerCourse: 'for 8 weeks',
    priceFree: 'free',
    stepRegister: '1 · Registration',
    stepData: '2 · Your details',
    reserveCta: 'Reserve my spot',
    payOnSiteNote: 'Pay on site with TWINT or cash.',
    weeksNote: '8 weeks · 1 class per week',
    message: 'Message',
    messageOptional: 'optional',
    messagePlaceholder: 'For example: I danced salsa two years ago …',
    successNextTitle: 'What happens next',
    successNextMail: 'We get back to you and confirm your spot — usually the same day.',
    successNextLocation: 'Studio Elisabethenanlage 7, 4051 Basel — 5 minutes from Basel SBB.',
    successNextBring: 'Bring comfortable clothes and clean flat-soled shoes.',
    waitlistBodyExtra: 'As soon as a spot opens up, we write to you right away.',
    toSchedule: 'Back to the schedule',
    retry: 'Try again',
    backToCourses: 'Pick another class',
    back: 'Back',
  },
};

/* Rueckkehrseiten nach der Zahlung (Etappe 9): Erfolg / Abbruch / Zahlen. */
export type PaymentDict = {
  checking: string;
  confirmedTitle: string;
  confirmedBody: string;
  receiptLabel: string;
  paidWith: string;
  pendingTitle: string;
  pendingBody: string;
  failedTitle: string;
  failedBody: string;
  cancelledTitle: string;
  cancelledBody: string;
  expiredTitle: string;
  expiredBody: string;
  retry: string;
  toPlan: string;
  notFound: string;
  startingPayment: string;
};

export const PAYMENT_UI: Record<Lang, PaymentDict> = {
  de: {
    checking: 'Zahlung wird geprüft...',
    confirmedTitle: 'Zahlung erfolgreich - Buchung bestätigt',
    confirmedBody: 'Vielen Dank. Deine Buchung ist fix. Du bekommst die Bestätigung per E-Mail.',
    receiptLabel: 'Beleg',
    paidWith: 'bezahlt mit',
    pendingTitle: 'Zahlung wird noch verarbeitet',
    pendingBody: 'Deine Zahlung ist noch unterwegs. Sobald sie eingeht, bestätigen wir die Buchung und schicken dir die E-Mail.',
    failedTitle: 'Zahlung nicht abgeschlossen',
    failedBody: 'Deine Zahlung ist nicht durchgegangen. Dein Platz ist noch kurz reserviert. Du kannst es gleich erneut versuchen.',
    cancelledTitle: 'Zahlung abgebrochen',
    cancelledBody: 'Du hast die Zahlung abgebrochen. Deine Buchung ist noch nicht abgeschlossen. Du kannst sie jederzeit erneut starten.',
    expiredTitle: 'Reservierung abgelaufen',
    expiredBody: 'Die Zahlungsfrist ist abgelaufen und der Platz wurde wieder freigegeben. Bitte buche den Kurs erneut.',
    retry: 'Zahlung erneut versuchen',
    toPlan: 'Zurück zum Kursplan',
    notFound: 'Diese Buchung wurde nicht gefunden.',
    startingPayment: 'Zahlung wird gestartet...',
  },
  en: {
    checking: 'Checking your payment...',
    confirmedTitle: 'Payment successful - booking confirmed',
    confirmedBody: 'Thank you. Your booking is secured. You will receive the confirmation by email.',
    receiptLabel: 'Receipt',
    paidWith: 'paid with',
    pendingTitle: 'Payment is still processing',
    pendingBody: 'Your payment is on its way. As soon as it arrives we confirm the booking and send you the email.',
    failedTitle: 'Payment not completed',
    failedBody: 'Your payment did not go through. Your spot is still reserved for a short while. You can try again now.',
    cancelledTitle: 'Payment cancelled',
    cancelledBody: 'You cancelled the payment. Your booking is not complete yet. You can start it again anytime.',
    expiredTitle: 'Reservation expired',
    expiredBody: 'The payment window expired and the spot was released. Please book the course again.',
    retry: 'Try payment again',
    toPlan: 'Back to the schedule',
    notFound: 'This booking was not found.',
    startingPayment: 'Starting payment...',
  },
};

// Wartelisten-Text (DE/EN). Ohne Platznummer: die kennt nur das Studio, nicht die Website.
export function waitlistBody(lang: Lang): string {
  return lang === 'de'
    ? 'Dieser Kurs ist gerade voll. Wir setzen dich auf die Warteliste und melden uns, sobald ein Platz frei wird.'
    : 'This class is currently full. We put you on the waiting list and get in touch as soon as a spot opens up.';
}

/* Level-Kategorien fuer den Level-Filter (DE/EN). Quelle: level_rungs.category. */
export const CATEGORY_LABEL: Record<Lang, Record<string, string>> = {
  de: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    heels: 'Heels',
    open: 'Open Level',
  },
  en: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    heels: 'Heels',
    open: 'Open Level',
  },
};

const MONTHS: Record<Lang, string[]> = {
  de: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

// "2026-07-20" -> DE "20. Juli 2026" / EN "July 20, 2026"
export function formatDateI18n(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const month = MONTHS[lang][(m - 1) % 12];
  return lang === 'de' ? `${d}. ${month} ${y}` : `${month} ${d}, ${y}`;
}

// Level-Label inkl. On1/On2-Suffix. `level` ist bereits das sprachrichtige Rung-Label
// (Caller waehlt labelDe/labelEn). "On2" ist sprachneutrale Notation (ARCHITEKTUR.md 4.2:
// Label = Rung-Label + " On2" aus on_variant).
export function levelLabelI18n(level: string | null, onVariant: 'on1' | 'on2' | null): string {
  const open = 'Open Level'; // sprachneutral (DE=EN), Fallback wenn kein Rung-Label vorliegt
  if (!level) return onVariant === 'on2' ? 'On2' : open;
  return onVariant === 'on2' ? `${level} On2` : level;
}

/* Sprach-Context */
type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const Ctx = createContext<LangCtx>({ lang: 'de', setLang: () => {}, t: UI.de });

function readStoredLang(): Lang {
  if (typeof window !== 'undefined') {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'de' || v === 'en') return v;
  }
  return 'de';
}

export function LangProvider({ children }: { children: ReactNode }) {
  // Das Prerender-HTML ist Deutsch. Der erste Client-Render muss deshalb ebenfalls
  // Deutsch sein; die gespeicherte Sprache wird direkt nach der Hydration aktiviert.
  // So bleibt die Hydration deterministisch, auch wenn im Browser Englisch gespeichert ist.
  const [lang, setLangState] = useState<Lang>('de');
  useEffect(() => {
    const stored = readStoredLang();
    setLangState(stored);
    document.documentElement.lang = stored === 'de' ? 'de-CH' : 'en';
  }, []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // localStorage kann blockiert sein - kein Grund die App zu stoppen.
    }
    if (typeof document !== 'undefined') document.documentElement.lang = l === 'de' ? 'de-CH' : 'en';
  }, []);
  return <Ctx.Provider value={{ lang, setLang, t: UI[lang] }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  return useContext(Ctx);
}
