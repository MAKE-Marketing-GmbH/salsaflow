// Buchungs-Funnel unter /buchung (Redesign 2026-08-07): EIN Fluss in drei Schritten —
// Kurs waehlen (Wochentag + Liste aus dem echten Plan) -> Daten eingeben -> Bestaetigung
// oder Warteliste. KEIN Payment im Funnel: der Hinweis ist immer "Reservieren, zahlst vor
// Ort (Twint/Bar)". Der Stripe-Pfad (BookingReturn fuer Zahl-Links aus Mails) bleibt
// unangetastet auf seinen Sub-Routen.
//
// ?kurs=<id> springt direkt in Schritt 2 (Deep-Link aus kuenftigen Kurs-Seiten).
// Motion: EINE Signatur — getakteter Fade-up (Feder-Kurve) auf Liste und Panel-Wechsel,
// alles motion-safe, also respektiert prefers-reduced-motion automatisch.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_OUT, useHydrated } from '@/public/home/motion';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { CONTACT } from '@/public/site/SiteFooter';
import { BOOKING_UI, WEEKDAY_LABEL, useLang, waitlistBody, levelLabelI18n, formatDateI18n } from '@/lib/i18n';
import {
  createBooking,
  fetchAvailability,
  type CourseAvailability,
  type CreateBookingResult,
} from '@/lib/booking';
import {
  fetchSchedule,
  embeddedSchedule,
  buildScheduleDays,
  buildScheduleSlots,
  weekdayKeyForISO,
  type ScheduleCourse,
  type ScheduleResponse,
  type ScheduleSlot,
  type ScheduleTerm,
} from '@/lib/schedule';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';

type Person = { firstName: string; lastName: string; email: string; phone: string };
const emptyPerson = (): Person => ({ firstName: '', lastName: '', email: '', phone: '' });
const emailOk = (s: string) => /.+@.+\..+/.test(s.trim());

/* Preise gibt es in diesem Fluss nicht (Beschluss 13.08.2026). Der Platz wird reserviert,
   bezahlt wird vor Ort. Preise stehen auf /preise. */

/* Funnel-Lexikon (nur hier gebraucht — bewusst nicht im globalen Dict). */
const FUNNEL = {
  de: {
    pickDay: 'Wähle deinen Tag',
    noCoursesDay: 'An diesem Tag läuft gerade kein Kurs.',
    noCoursesHint: 'Wähl einen anderen Tag oben. Oder spring direkt zu den nächsten Terminen.',
    nextDayWithCourses: 'Nächster Tag mit Kursen',
    nextSlotsTitle: 'Nächste Termine für dich',
    nextSlotsHint: 'Direkt buchen, ohne Tag zu wechseln.',
    trustSolo: 'Auch ohne Tanzpartner willkommen',
    trustStudios: '3 Studios am Bahnhof Basel SBB',
    trustTrial: 'Gratis Schnupperstunde möglich',
    free: 'frei',
    waitlist: 'Warteliste',
    step1: '1 · Kurs',
    step2: '2 · Anmeldung',
    step3: '3 · Fertig',
    changeCourse: 'Anderen Kurs wählen',
    loadPlan: 'Kursplan wird geladen …',
    planError: 'Der Kursplan konnte nicht geladen werden.',
    emptyWeek: 'In dieser Woche ist alles ausgebucht. Schau auf einen anderen Tag oder schreib uns kurz.',
    today: 'heute',
    // R64: toter ?kurs=-Link — klar sagen, dann die Termine unter dem Satz stehen lassen.
    kursGone: 'Dieser Kurs läuft gerade nicht mehr. Hier sind die aktuellen Termine:',
    // R134/3: Multistep im Dialog. Zwei Schritte, wenige Felder je Schritt.
    formNext: 'Weiter',
    formBack: 'Zurück',
  },
  en: {
    pickDay: 'Pick your day',
    noCoursesDay: 'No class runs on this day right now.',
    noCoursesHint: 'Pick another day above. Or jump straight to the next openings.',
    nextDayWithCourses: 'Next day with classes',
    nextSlotsTitle: 'Next openings for you',
    nextSlotsHint: 'Book directly, no day switch needed.',
    trustSolo: 'Welcome without a dance partner',
    trustStudios: '3 studios at Basel SBB station',
    trustTrial: 'Free trial class available',
    free: 'free',
    waitlist: 'Waiting list',
    step1: '1 · Class',
    step2: '2 · Sign-up',
    step3: '3 · Done',
    changeCourse: 'Pick another class',
    loadPlan: 'Loading the schedule …',
    planError: 'The schedule could not be loaded.',
    emptyWeek: 'Everything is booked this week. Try another day or drop us a line.',
    today: 'today',
    kursGone: 'This class is no longer running. Here are the current openings:',
    formNext: 'Next',
    formBack: 'Back',
  },
} as const;

export function BookingPage() {
  return (
    <>
      <Seo page="booking" noindex />
      <SiteHeader solidBackdrop />
      <main
        id="main"
        tabIndex={-1}
        data-testid="booking-funnel"
        // R117: data-buchung markiert den Seitenstamm. index.css setzt darauf mobil
        // --whatsapp-lift (wie R101 data-kursplan), weil der Float auf dem frei-Badge
        // der letzten Fold-Zeile sass (Luna + Kimi FAIL).
        data-buchung
        // pb-24 mobil: Float (5rem Lift + Eigengroesse) schwebt ueber leerem Raum
        // unter der Liste statt ueber einer Kurs-Zeile. Desktop pb-10 unveraendert.
        className="bg-[var(--color-paper-warm)] pb-24 sm:pb-10"
        style={{ paddingTop: 'calc(var(--nav-h) + 1rem)' }}
      >
        <Funnel />
      </main>
      <SiteFooter />
    </>
  );
}

function Funnel() {
  const { lang } = useLang();
  const ft = FUNNEL[lang];

  // Watchdog R63: Startwert aus dem eingebetteten Plan — derselbe Vertrag wie in
  // CourseEngine und ScheduleTeaser. Der erste Render zeigt Tage und Kurse aus dem
  // Bundle statt «Plan lädt» ueber einem leeren Tag; der Netz-Aufruf aktualisiert nur.
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(embeddedSchedule);
  const [planError, setPlanError] = useState(false);
  const [planLoading, setPlanLoading] = useState(() => !embeddedSchedule());
  const [courseAvailability, setCourseAvailability] = useState<Record<string, CourseAvailability | null>>({});

  const [course, setCourse] = useState<ScheduleCourse | null>(null);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  // Watchdog R64: toter ?kurs=-Deep-Link. Gesetzt aber in keiner Plan-Quelle gefunden
  // → ein Satz sagt Bescheid, statt still auf heute zu fallen. null = noch nicht entschieden
  // (Embed-Pruefung laeuft), true = Kurs fehlt, false = Link ok oder kein ?kurs=.
  const [kursMissing, setKursMissing] = useState<boolean | null>(null);
  // R54: fertiger Buchungs-Stand liegt in BookingForm (Dialog). Der Funnel braucht ihn fuer
  // Schritt 3 der Fortschritts-Leiste — BookingForm meldet ihn ueber onDone hoch.
  const [done, setDone] = useState(false);

  // Der Dialog haengt seinen Scroll-Lock- und Erst-Fokus-Effekt an diese Funktion.
  // Als Inline-Pfeilfunktion entstand sie bei JEDEM Render von Funnel neu, der Effekt
  // lief erneut, der Body wurde ent- und neu gesperrt und der Fokus sprang zurueck auf
  // den Schliessen-Knopf. `onDone()` loeste so einen Render garantiert aus und stahl
  // dem Nutzer mitten im Formular den Fokus. Die beiden Setter sind von React stabil,
  // die Funktion ist damit fuer die Lebensdauer des Dialogs dieselbe.
  const closeReservation = useCallback(() => {
    setReserveOpen(false);
    setDone(false);
  }, []);

  const loadPlan = () => {
    if (!embeddedSchedule()) setPlanLoading(true);
    setPlanError(false);
    fetchSchedule()
      .then((s) => {
        setSchedule(s);
        const preselect = new URLSearchParams(window.location.search).get('kurs');
        const hit = preselect ? s.courses.find((c) => c.id === preselect) : null;
        if (hit) {
          setCourse(hit);
          setReserveOpen(false);
          setKursMissing(false);
        } else {
          // Nur meckern, wenn ein Link gesetzt ist UND der Live-Plan ihn nicht kennt.
          setKursMissing(preselect ? true : false);
          // R64: toter Link → nicht auf einem leeren heutigen Tag landen (heute = So ohne
          // Kurse wirkt wie eine zweite Fehlermeldung). Auf den naechsten Tag MIT Kursen
          // vorziehen, damit unter dem Satz echte Termine stehen.
          const todayKey = weekdayKeyForISO(s.today) ?? 'mon';
          const daysWithCourses = buildScheduleDays(s.today).filter((d) =>
            s.courses.some((c) => c.weekday === d.key),
          );
          const startIdx = daysWithCourses.findIndex((d) => d.key === todayKey);
          const firstWithCourses =
            (startIdx >= 0 && s.courses.some((c) => c.weekday === todayKey)
              ? todayKey
              : daysWithCourses[startIdx + 1]?.key) ??
            daysWithCourses[0]?.key ??
            todayKey;
          setDay(firstWithCourses);
        }
      })
      // R63: Faellt das Netz aus, bleibt der eingebettete Plan stehen (hoechstens ein
      // Deploy alt) — besser als eine Fehlermeldung ueber einem schon lesbaren Funnel.
      .catch(() => {
        if (!embeddedSchedule()) setPlanError(true);
      })
      .finally(() => setPlanLoading(false));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadPlan, []);

  // Nur Wochentage mit Kursen — dieselbe Leiste wie /kursplan (Mo–Sa statt Mo–So).
  // Zwei verschieden lange Tagesleisten fuehlten sich wie zwei Produkte an (UX-Audit,
  // Punkt 7); ein Tag ganz ohne Kursangebot braucht auch keinen leeren Tab.
  const days = useMemo(
    () =>
      schedule
        ? buildScheduleDays(schedule.today).filter((d) =>
            schedule.courses.some((c) => c.weekday === d.key),
          )
        : [],
    [schedule],
  );
  const activeDay = day ?? days[0]?.key ?? 'mon';
  // Laufende und kommende Staffel desselben Kurses zu EINEM Slot gefaltet — sonst steht
  // jede Klasse zweimal in der Liste (running + upcoming, Critic 13.08.2026). Gleiche
  // Faltung wie der Kursplan (CourseEngine).
  const slots = useMemo(
    () => (schedule ? buildScheduleSlots(schedule.courses, schedule.terms) : []),
    [schedule],
  );
  const daySlots = useMemo(
    () => slots.filter((s) => s.weekday === activeDay),
    [slots, activeDay],
  );

  // Naechster Tag mit Kursen (fuer den Leer-Zustand-Next-Step).
  const nextDayWithCourses = useMemo(() => {
    if (!schedule || !days.length) return null;
    const idx = days.findIndex((d) => d.key === activeDay);
    for (let i = 1; i <= days.length; i++) {
      const d = days[(idx + i) % days.length];
      if (schedule.courses.some((c) => c.weekday === d.key)) return d;
    }
    return null;
  }, [schedule, days, activeDay]);

  // Empfohlene Nachbar-Termine: füllt die Empty-Day-Weisszone mit echtem Booking-Inhalt.
  const recommendedSlots = useMemo(() => {
    if (!days.length || daySlots.length > 0) return [];
    const idx = days.findIndex((d) => d.key === activeDay);
    const ordered: ScheduleSlot[] = [];
    for (let i = 1; i <= days.length && ordered.length < 4; i++) {
      const d = days[(idx + i) % days.length];
      const dayHits = slots.filter((s) => s.weekday === d.key);
      // freie Plätze zuerst, dann Warteliste — Studio-Rhythmus statt leere Flache.
      const ranked = [...dayHits.filter((s) => !s.full), ...dayHits.filter((s) => s.full)];
      for (const s of ranked) {
        if (ordered.length >= 4) break;
        ordered.push(s);
      }
    }
    return ordered;
  }, [slots, days, activeDay, daySlots.length]);

  const visibleSlots = daySlots.length > 0 ? daySlots : recommendedSlots;
  useEffect(() => {
    const missing = visibleSlots
      .map((s) => s.bookable)
      .filter((item) => courseAvailability[item.id] === undefined);
    if (!missing.length) return;
    let cancelled = false;
    Promise.all(
      missing.map(async (item) => {
        try {
          return [item.id, await fetchAvailability(item.id)] as const;
        } catch {
          return [item.id, null] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) setCourseAvailability((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });
    return () => {
      cancelled = true;
    };
  }, [visibleSlots, courseAvailability]);

  const termOf = (c: ScheduleCourse): ScheduleTerm | undefined =>
    schedule?.terms.find((t) => t.id === c.termId);

  const showDayList = !(course && !reserveOpen);

  // Kritik-Fund (buchung-desktop-01-kursliste.png): Das Foto-Band ueber der Kursliste war zu
  // knapp beschnitten — der Frau rechts fehlte der Oberkopf, der Frau links endete der Kopf
  // am Haaransatz an der Bildkante.
  // Ursache gemessen, nicht geschaetzt: Die Quelle war `kurse-heels-energie-01.webp`
  // (1920x935). Bei 1440px Bandbreite und 12rem Bandhoehe rendert object-cover das Motiv
  // 701px hoch — sichtbar sind 192px, also 27.4% der Bildhoehe. Die vorderen Koepfe brauchen
  // in dieser Datei rund 40%. Der Ausschnitt KONNTE sie nicht fassen, egal wohin
  // object-position ihn schob: `center 22%` legte das Fenster auf 16.0%..43.4%, und selbst
  // `top` (0%..27.4%) schnitt die vordere Reihe am Kinn ab.
  // Die band-fertige Fassung desselben Motivs bleibt. Der Desktop-Fold belegt,
  // dass `center 30%` erst unterhalb der Stirn beginnt. `center 12%` legt das
  // sichtbare Fenster auf den Kopfbereich und hält zugleich den Heels-Crop-Lock.
  return (
    <>
    {showDayList && (
      <div data-buchung-photo className="relative mb-4 w-full overflow-hidden">
        <img
          src="/photos/2026/kurse-heels-energie-hero-2100.webp"
          alt={lang === 'de'
            ? 'Heels-Kurs bei Salsaflow, Energie auf der Fläche'
            : 'Heels class at Salsaflow, energy on the floor'}
          width={2100}
          height={900}
          loading="eager"
          fetchPriority="high"
          className="h-[7.5rem] w-full object-cover object-[center_12%] sm:h-[12rem]"
        />
      </div>
    )}
    <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
      {/* Fortschritt: drei Worte, keine Deko.
          R134/4: Schritt 1 war eine tote Beschriftung. Wer im Funnel auf «Kurs» klickte,
          blieb stehen (Raphael-Video 00:41). Schritt 1 ist jetzt ein echter Link auf
          /tanzkurse — der Weg zurueck zur Kursuebersicht. Damit traegt die Leiste eine
          Aktion und darf nicht mehr aria-hidden sein; sie steht als <nav> mit Label da,
          die beiden restlichen Schritte bleiben reine Zustands-Anzeige. */}
      <nav aria-label={lang === 'de' ? 'Fortschritt' : 'Progress'} className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          <li>
            <a
              href="/tanzkurse"
              data-testid="step-back-to-courses"
              aria-current={!course ? 'step' : undefined}
              className={cn(
                't-hover underline-offset-4 hover:text-[var(--color-salsa)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)]',
                !course && 'text-[var(--color-salsa)]',
              )}
            >
              {ft.step1}
            </a>
          </li>
          <li aria-hidden className="text-[var(--color-line)]">→</li>
          <li className={cn(course && !done && 'text-[var(--color-salsa)]')} aria-current={course && !done ? 'step' : undefined}>{ft.step2}</li>
          <li aria-hidden className="text-[var(--color-line)]">→</li>
          {/* R54: Copy kennt drei Schritte, die Leiste zeigte nur zwei. Schritt 3 wird aktiv,
              sobald die Buchung fertig ist (done). */}
          <li className={cn(done && 'text-[var(--color-salsa)]')} aria-current={done ? 'step' : undefined}>{ft.step3}</li>
        </ol>
      </nav>

      {planLoading ? (
        <p role="status" className="py-16 text-center text-sm text-[var(--color-ink-muted)]">{ft.loadPlan}</p>
      ) : planError || !schedule ? (
        <div role="alert" className="py-16 text-center">
          <p className="text-sm font-medium text-[var(--color-salsa)]">{ft.planError}</p>
          <button
            type="button"
            onClick={loadPlan}
            data-testid="plan-retry"
            className="btn-base btn-primary mt-4 px-6 py-2.5 text-sm"
          >
            {BOOKING_UI[lang].retry}
          </button>
        </div>
      ) : (
        <>
          {/* R64: toter ?kurs=-Link — ein ruhiger Satz statt stillem Fallback auf heute.
              Kein Alert, kein Dialog; die Termine darunter bleiben der Weg. */}
          {kursMissing === true && (
            <p
              role="status"
              data-testid="kurs-gone"
              className="mb-3 mt-2 inline-block rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-4 py-2.5 text-sm font-medium leading-snug text-[var(--color-ink)]"
            >
              {ft.kursGone}
            </p>
          )}

          {showDayList && (
          <>
          <h1 className="type-h1 text-[var(--color-ink)]">
            {ft.pickDay}
          </h1>

          {/* Tages-Leiste: dichte Chip-Reihe, Wrap glatt (Mobil 4+3 statt verwaiste So-Zeile). */}
          <div
            className="mt-4 flex flex-wrap gap-1.5 sm:gap-2"
            // Kein role="tablist": Das ARIA-Tab-Muster verspricht Pfeiltasten-Navigation und
            // ein verknuepftes Panel. Beides gibt es hier nicht. Es sind Filter-Schalter,
            // und die beschreibt aria-pressed korrekt.
            role="group"
            aria-label={ft.pickDay}
          >
            {days.map((d) => {
              const count = slots.filter((s) => s.weekday === d.key).length;
              return (
                <button
                  key={d.key}
                  type="button"
                  aria-pressed={activeDay === d.key}
                  data-testid={`day-${d.key}`}
                  onClick={() => setDay(d.key)}
                  className={cn(
                    // min-h-11: 44px-Tap-Ziel — mit py-1.5 allein massen die Chips 34px
                    // (Critic Runde 6, Item 5).
                    'inline-flex min-h-11 items-center rounded-full border px-2.5 py-1.5 text-[0.8125rem] font-semibold transition-colors sm:px-3.5 sm:py-2.5 sm:text-sm',
                    activeDay === d.key
                      ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white'
                      : 'border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-salsa)]',
                  )}
                >
                  {WEEKDAY_LABEL[lang][d.key]?.short ?? d.shortDe}
                  <span className={cn('ml-1 text-[0.7rem] tabular-nums sm:ml-1.5 sm:text-xs', activeDay === d.key ? 'text-white/75' : 'text-[var(--color-ink-muted)]')}>
                    {d.date.slice(8, 10)}.{d.date.slice(5, 7)}.
                  </span>
                  {count > 0 && (
                    // "9 Kurse" mit Abstand statt "·9": Datum und Zahl klebten zu einer
                    // Zahl zusammen ("10.08. ·9", Critic Runde 10, Item 1).
                    <span className={cn('ml-1.5 text-[0.7rem] tabular-nums sm:text-xs', activeDay === d.key ? 'text-white/75' : 'text-[var(--color-ink-muted)]')}>
                      {count} {count === 1 ? (lang === 'de' ? 'Kurs' : 'class') : (lang === 'de' ? 'Kurse' : 'classes')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kurse des Tages: getakteter Fade-up, EINE Signatur fuer den ganzen Funnel. */}
          {daySlots.length === 0 ? (
            <div data-testid="booking-empty-day" className="mt-2.5 space-y-3">
              <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white px-4 py-3.5 sm:px-5 sm:py-3.5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{ft.noCoursesDay}</p>
                    <p className="mt-0.5 text-sm leading-snug text-[var(--color-ink-muted)]">{ft.noCoursesHint}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {nextDayWithCourses && (
                      <button
                        type="button"
                        data-testid="empty-next-day"
                        onClick={() => setDay(nextDayWithCourses.key)}
                        className="btn-base btn-primary px-4 text-sm"
                      >
                        {ft.nextDayWithCourses}
                        <span className="ml-1.5 text-white/80">
                          {WEEKDAY_LABEL[lang][nextDayWithCourses.key]?.short ?? nextDayWithCourses.shortDe}
                        </span>
                      </button>
                    )}
                    <a
                      href="/kontakt#kontaktformular"
                      className="btn-base btn-outline px-4 text-sm"
                    >
                      {lang === 'de' ? 'Frag uns' : 'Ask us'}
                    </a>
                  </div>
                </div>
              </div>

              {recommendedSlots.length > 0 && (
                <div data-testid="empty-recommendations">
                  <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="type-h4 text-[var(--color-salsa)]">
                        {ft.nextSlotsTitle}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">{ft.nextSlotsHint}</p>
                    </div>
                  </div>
                  <ul className="space-y-2" data-testid="empty-rec-list">
                    {recommendedSlots.map((s, i) => {
                      const c = s.primary;
                      const style = lang === 'de' ? c.styleDe : c.styleEn;
                      const level = levelLabelI18n(lang === 'de' ? c.levelDe : c.levelEn, c.onVariant);
                      const teachers = c.teachers.map((t) => t.displayName.split(' ')[0]).join(', ');
                      const availability = courseAvailability[s.bookable.id];
                      const full = availability ? availability.full : s.full;
                      const dayShort = WEEKDAY_LABEL[lang][c.weekday]?.short ?? c.weekday;
                      return (
                        <li
                          key={s.key}
                          className="motion-safe:animate-[booking-panel-in_280ms_ease-out_both]"
                          style={{ animationDelay: `${Math.min(i, 4) * 40}ms` }}
                        >
                          <button
                            type="button"
                            data-testid={`pick-course-${s.bookable.id}`}
                            onClick={() => {
                              setCourse(s.bookable);
                              setReserveOpen(false);
                            }}
                            className="group flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white px-3.5 py-3 text-left transition-colors hover:border-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] sm:gap-4 sm:px-4 sm:py-3.5"
                          >
                            <div className="w-12 shrink-0 text-center sm:w-14">
                              <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-salsa)]">
                                {dayShort}
                              </div>
                              <div className="font-display text-base font-extrabold leading-none text-[var(--color-ink)] sm:text-lg">
                                {c.startTime}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                                {/* Kein truncate: lange Stilnamen ("Bodymovement & Ladystyle") brechen um,
                                    statt bei 390px mit … abzuschneiden (Critic 13.08.2026). */}
                                <span className="min-w-0 font-display text-sm font-bold text-[var(--color-ink)] sm:text-base">{style}</span>
                                {level && (
                                  <span className="shrink-0 rounded-full bg-[var(--color-bg-soft)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--color-ink-muted)]">
                                    {level}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex min-w-0 items-center gap-2 text-xs leading-snug text-[var(--color-ink-muted)]">
                                {/* Kein truncate: "Studio Elisabethenanlage" wurde bei 390px
                                    abgeschnitten — umbrechen (Critic Runde 6, Item 5). */}
                                <span className="min-w-0 break-words">
                                  {teachers && <>{teachers} · </>}
                                  {c.locationName}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <span
                                className={cn(
                                  'inline-flex min-h-11 items-center rounded-full px-2.5 py-1 text-[0.65rem] font-bold sm:px-3 sm:text-xs',
                                  // Warteliste neutral, nicht amber: Amber steht in keinem Token der DESIGN.md und
// riss eine zweite Akzentfarbe auf. Neutrale Flaeche, roter Rand als Akzent.
full
  ? 'border border-[var(--color-salsa)]/35 bg-[var(--color-bg-soft)] text-[var(--color-salsa)]'
  : 'bg-[var(--color-salsa)] text-white',
                                )}
                              >
                                {full ? ft.waitlist : ft.free}
                              </span>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // R78 (Fold 1440x730): Die letzte sichtbare Karte hing als Streifen am unteren
            // Rand — Di/Mi/Do schnitt der Fold Karte 6 hart (top 729, 1px sichtbar), Mo bei 724.
            // Liste hoch (mt-2) + dichter (gap 8) + flachere Karten (py-2.5) lassen Karte 6 ganz
            // (bottom 715). Zusaetzlich bekommt Karte 7+ eine 16px-Luecke (mt-4): damit liegt der
            // Fold in der Luecke zwischen Karte 6 und 7 — Karte 7 rutscht mit top 731 ganz unter
            // den Fold statt als 7px-Streifen anzuhaengen. Karte 6 bleibt die letzte GANZE Karte,
            // ein gleichmaessiger groesserer Gap ueberall (space-y-4) wuerde Karte 6 selbst kappen
            // (bottom 755). Kein Umbruch (h 81->69), Chips bleiben eine Zeile.
            // Nur Abstand/Kartenhoehe/Listen-Padding — Termine, Copy, Embed-Plan unberuehrt.
            <ul className="mt-2 space-y-2 [&>li:nth-child(n+7)]:mt-4" data-testid="course-list">
              {daySlots.map((s, i) => {
                const c = s.primary;
                const style = lang === 'de' ? c.styleDe : c.styleEn;
                const level = levelLabelI18n(lang === 'de' ? c.levelDe : c.levelEn, c.onVariant);
                const teachers = c.teachers.map((t) => t.displayName.split(' ')[0]).join(', ');
                const availability = courseAvailability[s.bookable.id];
                const full = availability ? availability.full : s.full;
                return (
                  <li
                    key={s.key}
                    // ease-out statt der frueheren Federkurve: die schoss ueber den Zielwert
                    // hinaus und wippte zurueck. Bei bis zu neun Karten wippt dann alles
                    // nacheinander. Dieselbe Animation lief an drei anderen Stellen im selben
                    // Panel schon mit ease-out.
                    className="motion-safe:animate-[booking-panel-in_280ms_ease-out_both]"
                    style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                  >
                    <button
                      type="button"
                      // Gebucht wird die buchbare Staffel des Slots (offene laufende vor
                      // offener kommender), nicht stumpf die laufende.
                      data-testid={`pick-course-${s.bookable.id}`}
                      onClick={() => {
                        setCourse(s.bookable);
                        setReserveOpen(false);
                      }}
                      className="group flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white px-4 py-2.5 text-left transition-colors hover:border-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] sm:gap-4 sm:px-5 sm:py-2.5"
                    >
                      <div className="w-14 shrink-0 text-center">
                        <div className="font-display text-lg font-extrabold leading-none text-[var(--color-ink)]">{c.startTime}</div>
                        <div className="mt-0.5 text-xs text-[var(--color-ink-muted)]">{c.endTime}</div>
                        {/* R120: Badge mobil unter die Zeit (links), Desktop bleibt rechts.
                            Kreis rechts unten deckte sonst das rechte «frei» (Raphael R120). */}
                        <span
                          className={cn(
                            'mt-1.5 inline-flex min-h-6 items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold sm:hidden',
                            full
                              ? 'border border-[var(--color-salsa)]/35 bg-[var(--color-bg-soft)] text-[var(--color-salsa)]'
                              : 'bg-[var(--color-salsa)] text-white',
                          )}
                        >
                          {full ? ft.waitlist : ft.free}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          {/* Kein truncate: lange Stilnamen brechen um statt mit … (Critic 13.08.2026). */}
                          <span className="min-w-0 type-h3 text-[var(--color-ink)]">{style}</span>
                          {level && (
                            <span className="shrink-0 rounded-full bg-[var(--color-bg-soft)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--color-ink-muted)]">
                              {level}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex min-w-0 items-center gap-2 text-xs leading-snug text-[var(--color-ink-muted)]">
                          {/* Kein truncate: Studio-Name bricht um statt … (Critic Runde 6). */}
                          <span className="min-w-0 break-words">
                            {teachers && <>{teachers} · </>}
                            {c.locationName}
                          </span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 text-right sm:block">
                        <span
                          className={cn(
                            'inline-flex min-h-11 items-center rounded-full px-3 py-1 text-xs font-bold',
                            // Warteliste neutral, nicht amber: Amber steht in keinem Token der DESIGN.md und
// riss eine zweite Akzentfarbe auf. Neutrale Flaeche, roter Rand als Akzent.
full
  ? 'border border-[var(--color-salsa)]/35 bg-[var(--color-bg-soft)] text-[var(--color-salsa)]'
  : 'bg-[var(--color-salsa)] text-white',
                          )}
                        >
                          {full ? ft.waitlist : ft.free}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          </>
          )}

          {course && !reserveOpen && (
            <CourseDetail
              course={course}
              term={termOf(course)}
              onReserve={() => setReserveOpen(true)}
              onChange={() => {
                setCourse(null);
                setDay(course.weekday);
                setDone(false);
              }}
            />
          )}

          {course && reserveOpen && (
            <BookingForm
              key={course.id}
              course={course}
              onBack={closeReservation}
              onDone={() => setDone(true)}
            />
          )}
        </>
      )}
    </div>
    </>
  );
}

function CourseDetail({
  course,
  term,
  onReserve,
  onChange,
}: {
  course: ScheduleCourse;
  term?: ScheduleTerm;
  onReserve: () => void;
  onChange: () => void;
}) {
  const { lang } = useLang();
  const de = lang === 'de';
  const [avail, setAvail] = useState<CourseAvailability | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchAvailability(course.id)
      .then((next) => {
        if (!cancelled) setAvail(next);
      })
      .catch(() => {
        if (!cancelled) setAvail(null);
      });
    return () => {
      cancelled = true;
    };
  }, [course.id]);

  const full = avail?.full ?? course.status === 'full';
  const courseLabel = `${de ? course.styleDe : course.styleEn} ${levelLabelI18n(
    de ? course.levelDe : course.levelEn,
    course.onVariant,
  )}`.trim();
  const teachers = course.teachers.map((t) => t.displayName.split(' ')[0]).join(', ');
  const dayLabel = WEEKDAY_LABEL[lang][course.weekday]?.long ?? course.weekday;

  return (
    <section
      data-testid="course-detail"
      className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
            {de ? 'Dein Kurs' : 'Your class'}
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-[var(--color-ink)]">
            {courseLabel}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {dayLabel} {course.startTime}-{course.endTime}
            {teachers ? ` · ${teachers}` : ''}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex min-h-11 items-center rounded-full px-3 py-1 text-xs font-bold',
            full
              ? 'border border-[var(--color-salsa)]/35 bg-[var(--color-bg-soft)] text-[var(--color-salsa)]'
              : 'bg-[var(--color-salsa)] text-white',
          )}
        >
          {full ? (de ? 'Ausgebucht' : 'Fully booked') : de ? 'Plätze frei' : 'Spots left'}
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              {de ? 'Ort' : 'Place'}
            </dt>
            <dd className="mt-1 text-sm text-[var(--color-ink)]">{course.locationName}</dd>
          </div>
          {term && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                {de ? 'Staffel' : 'Term'}
              </dt>
              <dd className="mt-1 text-sm text-[var(--color-ink)]">
                {formatDateI18n(term.startDate, lang)}
                {de ? ' bis ' : ' to '}
                {formatDateI18n(term.endDate, lang)}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              {de ? 'Kosten' : 'Payment'}
            </dt>
            <dd className="mt-1 text-sm text-[var(--color-ink)]">
              {de ? 'Vor Ort, Twint oder Bar.' : 'On site, TWINT or cash.'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              {de ? 'Einstieg' : 'Entry'}
            </dt>
            <dd className="mt-1 text-sm text-[var(--color-ink)]">
              {course.phase === 'running' && course.allowsLateEntry
                ? de
                  ? 'Quereinstieg möglich.'
                  : 'Late entry possible.'
                : de
                  ? 'Neue Staffel, Einstieg zum Start.'
                  : 'New term, start at the first class.'}
            </dd>
          </div>
        </dl>
        <div className="relative h-64 min-h-[16rem] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
          <iframe
            title={de ? 'Standort Salsaflow auf Google Maps' : 'Salsaflow location on Google Maps'}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8000!2d7.5866!3d47.548917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f14!3m3!1m2!1s0x4791b9bbe6210ca7%3A0xe24471415832cb62!2sSalsaflow%20Dance%20Company%20GmbH!5e0!3m2!1sde!2sch"
            className="h-full w-full min-h-[16rem] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <a
        href={CONTACT.anfahrt}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-salsa)] underline underline-offset-4"
      >
        {de ? 'Route in Google Maps öffnen' : 'Open route in Google Maps'}
      </a>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onReserve} data-testid="reserve-spot" className="btn-base btn-primary px-6 py-2.5 text-sm">
          {full
            ? de
              ? 'Auf Warteliste setzen'
              : 'Join the waiting list'
            : de
              ? 'Platz reservieren'
              : 'Reserve a spot'}
        </button>
        <button
          type="button"
          onClick={onChange}
          className="t-hover text-sm font-semibold text-[var(--color-ink-muted)] underline underline-offset-4"
        >
          {de ? 'Anderen Kurs wählen' : 'Pick another class'}
        </button>
      </div>
    </section>
  );
}

/* Schritt 2+3: Formular und Bestaetigung als Dialog-Overlay. */
function BookingForm({
  course,
  onBack,
  onDone,
}: {
  course: ScheduleCourse;
  onBack: () => void;
  onDone?: () => void;
}) {
  const { lang } = useLang();
  const bt = BOOKING_UI[lang];
  const ft = FUNNEL[lang];

  const [avail, setAvail] = useState<CourseAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // R134/3: Der Dialog war EIN langer Scroll (Rolle, Anmeldung, Deine Daten, Partnerdaten,
  // Nachricht) — Raphael-Video 00:13. Jetzt zwei Schritte: 1 = Rolle + Allein/Paar,
  // 2 = Daten. Offene Klassen (Heels) haben keine Rollenwahl, dort startet der Fluss
  // direkt auf Schritt 2 und die Weiter-Taste entfaellt.
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'leader' | 'follower' | null>(null);
  // Klick auf die Rolle und sofort Weiter las den State noch als null
  // (React committet setRole erst nach dem Event). Der Ref steht im selben Tick.
  const roleRef = useRef<'leader' | 'follower' | null>(null);
  const [mode, setMode] = useState<'solo' | 'couple'>('solo');
  const [needsAushilfe, setNeedsAushilfe] = useState(false);
  const [me, setMe] = useState<Person>(emptyPerson);
  const [partner, setPartner] = useState<Person>(emptyPerson);
  const [notes, setNotes] = useState('');
  const [privacy, setPrivacy] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateBookingResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Schritt-Anfang: nach jedem Schrittwechsel wandert der Fokus hierher.
  // Ohne das bleibt der Fokus auf «Weiter» bzw. «Zurueck» — beide Knoepfe werden
  // beim Wechsel ausgetauscht, der Fokus faellt danach auf <body> zurueck.
  // Schritt 1: die Rollen-Ueberschrift «Ich tanze als». Offene Klassen haben keinen
  // Schritt 1, dieser Ref bleibt dort leer.
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  // Schritt 2, erste Zeile: die Auswahl aus Schritt 1 — bei offenen Klassen der
  // Hinweis, dass ohne Rollen getanzt wird. Immer vorhanden.
  const stepSummaryRef = useRef<HTMLParagraphElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);
  // Erst ab dem ersten Wechsel fokussieren: beim Oeffnen gehoert der Fokus dem
  // Schliessen-Knopf (Dialog-Konvention), nicht der Ueberschrift.
  const stepChanged = useRef(false);

  const loadAvail = () => {
    setLoading(true);
    setLoadError(false);
    fetchAvailability(course.id)
      .then(setAvail)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadAvail, [course.id]);

  // Dialog-Isolation: Body-Scroll sperren, Escape schliessen, Fokus-Trap, Fokus zurueckgeben.
  useEffect(() => {
    // SAFETY: activeElement ist Element | null. Wir brauchen nur .focus() beim Schliessen.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const focusables = () =>
      [...(dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [])].filter((el) => el.getClientRects().length > 0 && !el.hasAttribute('disabled'));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);

    // Body-Scroll sperren. `overflow: hidden` allein reicht auf iOS Safari nicht — dort
    // scrollt der Hintergrund weiter und nimmt die Geste mit, sodass der Dialog selbst
    // stehen bleibt. Der Body wird darum zusaetzlich auf `position: fixed` gelegt und die
    // Scrollposition festgehalten, damit die Seite beim Schliessen nicht nach oben springt.
    const scrollY = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      previouslyFocused?.focus?.();
    };
  }, [onBack]);

  // Heels wird ohne Rollentrennung getanzt: dort gibt es kein Leader/Follower und kein Paar.
  const isOpen = course.styleKey === 'heels';

  // Offene Klasse hat keinen Schritt 1 — sonst staende dort eine leere Seite mit
  // einem Weiter-Knopf. Der sichtbare Schritt ist deshalb abgeleitet, nicht roh.
  const visibleStep: 1 | 2 = isOpen ? 2 : step;

  function changeMode(next: 'solo' | 'couple') {
    setMode(next);
    if (next === 'couple') setNeedsAushilfe(false);
  }

  function chooseRole(next: 'leader' | 'follower') {
    roleRef.current = next;
    setRole(next);
  }

  function goToStep2() {
    const hasRole = isOpen || roleRef.current !== null;
    if (!hasRole) {
      // Ein Fehlertext an den Kacheln, nicht noch formError mit demselben Satz.
      setShowErrors(true);
      setFormError(null);
      focusFirstInvalid();
      return;
    }
    if (role === null && roleRef.current !== null) setRole(roleRef.current);
    setFormError(null);
    setShowErrors(false);
    stepChanged.current = true;
    setStep(2);
  }

  // Ein Schrittwechsel ist ein Seitenwechsel im Kleinen: die Flaeche startet oben und
  // der Fokus steht auf der neuen Ueberschrift. Sonst liest ein Screenreader nach
  // «Weiter» gar nichts vor und die Tastatur landet wieder ganz am Anfang des Dialogs.
  useEffect(() => {
    if (!stepChanged.current) return;
    const frame = window.requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0 });
      // R183: Beide Schritt-Ueberschriften sind weg. Das Fokus-Ziel ist jetzt der
      // erste bedeutungstragende Knoten des Schritts: Schritt 1 die Rollen-Frage,
      // Schritt 2 die Auswahl-Zeile aus Schritt 1.
      // Dieser Effekt laeuft nur nach einem echten Schrittwechsel (`stepChanged`).
      // Den setzen nur `goToStep2()` und der Zurueck-Knopf des Rollen-Falls — beide
      // gibt es bei einer offenen Klasse nicht. Fuer `isOpen` feuert der Effekt also
      // nie, und `stepSummaryRef` darf dort null sein.
      // Das erste Eingabefeld bleibt die Absicherung, damit der Fokus nie auf
      // <body> faellt, falls ein Anker doch einmal fehlt.
      const target =
        (visibleStep === 1 ? stepHeadingRef.current : stepSummaryRef.current) ??
        formRef.current?.querySelector<HTMLElement>('input, textarea, button') ??
        null;
      target?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [visibleStep]);

  // Voll heisst: der Kursplan meldet den Kurs als ausgebucht. Dann geht die Anfrage auf die Warteliste.
  const laneFull = avail?.full ?? course.status === 'full';

  const courseLabel = `${lang === 'de' ? course.styleDe : course.styleEn} ${levelLabelI18n(
    lang === 'de' ? course.levelDe : course.levelEn,
    course.onVariant,
  )}`.trim();
  // R183: `teachers` ist weg — die Kopfzeile nennt die Lehrer nicht mehr (Kursseite
  // traegt die Infos). `dayLabel` bleibt: die Bestaetigung zeigt «Wann» weiterhin.
  const dayLabel = WEEKDAY_LABEL[lang][course.weekday]?.long ?? course.weekday;

  const focusFirstInvalid = () =>
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  async function submit() {
    setFormError(null);
    setSubmitError(null);
    setShowErrors(true);
    // Rolle fehlt: das ist Schritt 1. Zurueckspringen statt einen Fehler zu zeigen,
    // den man auf dem sichtbaren Schritt gar nicht beheben kann.
    if (!isOpen && roleRef.current === null) {
      setStep(1);
      setShowErrors(true);
      setFormError(null);
      focusFirstInvalid();
      return;
    }
    if (!me.firstName.trim() || !me.lastName.trim() || !emailOk(me.email)) {
      setFormError(bt.requiredHint);
      focusFirstInvalid();
      return;
    }
    if (mode === 'couple' && (!partner.firstName.trim() || !partner.lastName.trim() || !emailOk(partner.email))) {
      setFormError(bt.requiredHint);
      focusFirstInvalid();
      return;
    }
    if (!privacy) {
      // Der Fehler steht direkt an der Checkbox (aria-describedby) UND der Fokus
      // springt dorthin. Ein Alert allein liess die Box unmarkiert stehen.
      setFormError(null);
      window.requestAnimationFrame(() => privacyRef.current?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const r = await createBooking({
        courseId: course.id,
        role: isOpen ? null : mode === 'couple' ? roleRef.current ?? 'leader' : roleRef.current,
        mode: isOpen ? 'solo' : mode,
        participant: { firstName: me.firstName, lastName: me.lastName, email: me.email, phone: me.phone || undefined },
        partner:
          mode === 'couple'
            ? { firstName: partner.firstName, lastName: partner.lastName, email: partner.email, phone: partner.phone || undefined }
            : null,
        needsAushilfe: !isOpen && mode === 'solo' ? needsAushilfe : false,
        notes: notes.trim() || undefined,
        language: lang,
      });
      setResult(r);
      onDone?.();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : bt.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 p-3 backdrop-blur-[2px] sm:p-5 motion-safe:animate-[booking-backdrop-in_180ms_ease-out]"
      data-testid="booking-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onBack();
      }}
    >
      <div
        ref={dialogRef}
        id={`booking-panel-${course.id}`}
        role="dialog"
        aria-modal="true"
        // R183: Die sichtbare Ueberschrift traegt nur noch den Kursnamen. Der Dialog
        // benennt darum die Handlung selbst — sonst ruft ein Screenreader beim Oeffnen
        // «Bachata Beginner Stufe 5, Dialog» aus und sagt nicht, dass gebucht wird.
        aria-label={`${bt.title}: ${courseLabel}`}
        data-testid="booking-dialog"
        /* Hoehe in `dvh`, nicht `vh`. Auf Mobil-Browsern meint `vh` den Viewport OHNE
           Adressleiste — der Dialog wurde damit hoeher als der sichtbare Bereich und die
           Fusszeile mit dem Absende-Knopf lag darunter, unerreichbar. `dvh` folgt der
           tatsaechlich sichtbaren Hoehe. Die Klasse ist der `vh`-Fallback fuer Browser ohne
           `dvh`; die Inline-Regel ueberschreibt sie dort, wo die Einheit bekannt ist.
           Kennt der Browser `dvh` nicht, verwirft er die Deklaration und die Klasse bleibt. */
        style={{ maxHeight: 'min(92dvh, 900px)' }}
        className="my-auto flex max-h-[min(92vh,900px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] shadow-[0_24px_64px_rgba(17,17,17,0.28)] motion-safe:animate-[booking-panel-in_180ms_ease-out]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* R134/1: Der 4px-Salsa-Strich ueber der schwarzen Kopfzeile ist WEG (Raphael:
            "KI-Scheisse"). Er war ein aufgesetzter Akzent ohne Funktion — der Kurstitel
            traegt das Rot schon. Stattdessen traegt der Kopf jetzt einen ruhigen
            Tiefenverlauf und eine Haarlinie nach unten, also eine Kante aus dem Aufbau
            statt einer Deko-Kappe. */}
        <div className="relative shrink-0 overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#1a1a1a_0%,var(--color-ink)_100%)] px-4 py-3 text-white sm:px-5 sm:py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {/* Kritik-Fund KRITISCH: Der Kursname stand in Salsa-Rot auf der fast schwarzen
                  Kopfzeile — im PNG gemessen rgb(173,24,39) auf rgb(19,19,19), Kontrast 2.6:1.
                  WCAG AA verlangt 4.5:1 fuer Fliesstext und 3.0:1 selbst fuer grosse Schrift.
                  Das ist die wichtigste Zeile des Dialogs: welchen Kurs buche ich gerade.
                  Der Name steht jetzt weiss wie «Kurs buchen:» (18.6:1). Die Auszeichnung
                  laeuft ueber Helligkeit und Schriftschnitt: das Label davor ist auf 70 %
                  gedimmt, der Name traegt volles Weiss. Kein Rot auf Schwarz. */}
              {/* R183: Das Label «Kurs buchen:» ist WEG. Der Dialog ist der Buchung —
                  das sagt der Absende-Knopf «Platz reservieren». Uebrig bleibt die eine
                  Zeile, die der Nutzer wirklich pruefen will: WELCHEN Kurs buche ich.
                  Fuer Screenreader benennt aria-label des Dialogs die Handlung weiter. */}
              {/* Kein `id` mehr: der Dialog benennt sich ueber `aria-label`, das
                  fruehere `aria-labelledby` zeigte als einziges hierher. Eine id ohne
                  Referenz ist toter Markup. */}
              <h3 className="font-display text-lg font-extrabold leading-tight tracking-tight text-white sm:text-xl">
                {courseLabel}
              </h3>
              {/* R183: Wochentag, Uhrzeit und Lehrer sind WEG (Absprache 17.08.: die
                  Kursseite traegt die Infos). Der Nutzer kommt aus der Kursliste oder von
                  der Kursseite — dort stand genau diese Zeile schon, und er hat auf sie
                  geklickt. Der Kursname allein beantwortet «bin ich richtig hier».
                  Wann und Wo stehen nach dem Absenden wieder da, in der Bestaetigung
                  (SuccessPanel, Fakten «Wann»/«Wo») — dort ist es neue Information. */}
            </div>
            {/* h-11/w-11 statt h-10: 44px-Tap-Ziel fuer den Dialog-Schliessen-Knopf
                (Critic Runde 16, Item 3). */}
            <button
              ref={closeRef}
              type="button"
              onClick={onBack}
              data-testid="booking-close"
              aria-label={bt.backToCourses}
              className="t-hover inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ref: DIESER Kasten scrollt, nicht der Dialog selbst. Ohne die Bindung lief
            der Scroll-Reset beim Schrittwechsel ins Leere. */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="px-4 py-4 sm:px-5 sm:py-4">
          {loading ? (
            <p role="status" className="py-6 text-center text-sm text-[var(--color-ink-muted)]">{bt.loading}</p>
          ) : loadError || !avail ? (
            <div role="alert" className="py-6 text-center text-sm">
              <p className="font-medium text-[var(--color-salsa)]">{bt.errorGeneric}</p>
              <button
                type="button"
                onClick={loadAvail}
                data-testid="avail-retry"
                className="btn-base btn-primary mt-3 px-6 py-2.5 text-sm"
              >
                {bt.retry}
              </button>
            </div>
          ) : !avail.bookable ? (
            <div className="py-6 text-center text-sm text-[var(--color-ink-muted)]">
              <p>{bt.notBookable}</p>
              <a href="/kontakt#kontaktformular" className="mt-3 inline-flex font-semibold text-[var(--color-salsa)] underline underline-offset-4">
                {lang === 'de' ? 'Anderen Einstieg finden' : 'Find another way to start'}
              </a>
            </div>
          ) : result ? (
            <SuccessPanel
              result={result}
              onBack={onBack}
              courseLabel={courseLabel}
              dayLabel={dayLabel}
              startTime={course.startTime}
              endTime={course.endTime}
              locationName={course.locationName}
            />
          ) : (
            <form
              ref={formRef}
              id={`booking-form-${course.id}`}
              className="space-y-2.5"
              // noValidate wie im InquiryWizard: ohne das feuerte der Browser seine NATIVE
              // Bubble ("Please fill out this field.", englisch, nennt das Feld nicht),
              // bevor submit() je lief — die eigene deutsche Validierung samt Fokus aufs
              // erste Fehlerfeld war damit unerreichbar (UX-Probe mobil, 13.08.2026).
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
                {/* R183: Die Schritt-Zaehlung ist WEG. Die Seite zaehlt schon einmal, oben in
                    der Fortschritts-Leiste (1 · Kurs → 2 · Anmeldung → 3 · Fertig). Zwei Zaehler
                    fuer einen Fluss lassen den Nutzer die beiden Zahlen abgleichen, statt zu
                    waehlen. Der sichtbare Schritt steht ohnehin in der Ueberschrift. */}

                {/* Schritt 1: Rolle + Allein/Paar. Sonst nichts. */}
                {visibleStep === 1 && (
                <>
                {/* R183: Die Ueberschrift «Anmeldung» ist WEG. Sie stand wortgleich 90px
                    ueber der Gruppen-Ueberschrift `bt.registration` — dasselbe Wort zweimal,
                    einmal als Schritt-Titel und einmal als Feldgruppe. Der Schritt-Titel war
                    der schwaechere: er benannte den Dialog, den die Kopfzeile schon benennt.
                    Die Rollen-Ueberschrift «Ich tanze als» ist jetzt das Fokus-Ziel nach dem
                    Schrittwechsel und traegt tabIndex={-1}. */}

                {/* Rolle. Dieser Block gehoert zu Schritt 1, und Schritt 1 gibt es nur bei
                    Leader/Follower-Kursen: `visibleStep` ist bei offenen Klassen fest 2
                    (siehe oben). Ein `isOpen`-Zweig waere hier toter Code. Offene Klassen
                    springen direkt in die Daten — ohne erklaerenden Satz, denn der Kurstyp
                    steht auf der Kursseite (Absprache 17.08.). */}
                <section className="pt-0" aria-labelledby="booking-role-title" aria-describedby={showErrors && role === null ? 'booking-role-error' : undefined}>
                  <h3 ref={stepHeadingRef} tabIndex={-1} id="booking-role-title" className="mb-1.5 text-sm font-bold text-[var(--color-ink)] focus:outline-none">{bt.chooseRole}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <ChoiceTile
                      testid="role-follower"
                      active={role === 'follower'}
                      label={bt.follower}
                      onClick={() => chooseRole('follower')}
                      invalid={showErrors && role === null}
                    />
                    <ChoiceTile
                      testid="role-leader"
                      active={role === 'leader'}
                      label={bt.leader}
                      onClick={() => chooseRole('leader')}
                      invalid={showErrors && role === null}
                    />
                  </div>
                  {/* R183: «Für die Balance im Kurs.» ist WEG. Der Satz rechtfertigte die
                      Frage, statt bei der Wahl zu helfen — wer «Follower» oder «Leader»
                      liest, waehlt danach nicht anders. Die Fehlermeldung bleibt. */}
                  {showErrors && role === null && (
                    <p id="booking-role-error" role="alert" data-testid="booking-required-error" className="mt-1.5 text-sm font-medium text-[var(--color-salsa)]">{bt.requiredHint}</p>
                  )}
                </section>

                {/* Modus allein / Paar (nur Leader/Follower) */}
                {!isOpen && (
                  <section className="border-t border-[var(--color-line)] pt-2.5" aria-labelledby="booking-mode-title">
                    <h3 id="booking-mode-title" className="mb-1.5 text-sm font-bold text-[var(--color-ink)]">{bt.registration}</h3>
                    {/* Gleiches Raster und gleiche Kachel wie die Rollenwahl darueber:
                        eine Auswahl sieht im ganzen Schritt gleich aus. */}
                    <div className="grid grid-cols-2 gap-2">
                      <ChoiceTile
                        testid="mode-solo"
                        active={mode === 'solo'}
                        label={bt.solo}
                        onClick={() => changeMode('solo')}
                      />
                      <ChoiceTile
                        testid="mode-couple"
                        active={mode === 'couple'}
                        label={bt.couple}
                        onClick={() => changeMode('couple')}
                      />
                    </div>
                    {mode === 'solo' && (
                      <label className="mt-2.5 flex items-start gap-2.5 rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2.5 text-sm leading-snug text-[var(--color-ink)]">
                        <input
                          type="checkbox"
                          data-testid="aushilfe"
                          checked={needsAushilfe}
                          onChange={(e) => setNeedsAushilfe(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-salsa)]"
                        />
                        <span className="min-w-0 flex-1 text-pretty">
                          {lang === 'de' ? 'Keine feste Tanzpartnerin / keinen festen Tanzpartner' : 'No fixed dance partner'}
                        </span>
                      </label>
                    )}
                    {mode === 'solo' && needsAushilfe && (
                      <p className="mt-1.5 pl-1 text-xs leading-snug text-[var(--color-ink-muted)]">{bt.aushilfeHint}</p>
                    )}
                  </section>
                )}

                {laneFull && (
                  <p
                    data-testid="lane-full-note"
                    className="rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2 text-sm font-medium text-[var(--color-ink)]"
                  >
                    {bt.courseFull}
                  </p>
                )}
                </>
                )}

                {/* Schritt 2: nur noch Daten. */}
                {visibleStep === 2 && (
                <>
                {/* Gruppe 2: Personendaten.
                    R183: Die Ueberschrift «Deine Daten» ist WEG. Jedes Feld darunter traegt
                    sein eigenes Label (Vorname, Nachname, E-Mail, Telefon) — die Ueberschrift
                    fasste nur zusammen, was direkt darunter schon steht. Fuer Screenreader
                    bleibt die Gruppe benannt: PersonFields traegt die Legende weiter als
                    sr-only (hideLegend), die Section behaelt ihr aria-labelledby.
                    Das Fokus-Ziel nach dem Schrittwechsel ist jetzt die Auswahl-Zeile. */}

                {/* Erste Zeile des Schritts, und zugleich das Fokus-Ziel nach dem Wechsel:
                    die Auswahl aus Schritt 1 — sonst ist die Entscheidung nach dem Wechsel
                    unsichtbar.

                    R183 Runde 3: Der Zweig fuer die offene Klasse ist WEG. Er zeigte
                    «Offene Klasse - keine Rollenwahl noetig.» als erste Zeile. Zwei Gruende:
                    1. Das ist Kurstyp-Information. Absprache 17.08.: die Kursseite traegt
                       die Infos, das Modal traegt Rolle plus Anmeldung. Der Nutzer hat den
                       Kurs eben dort ausgewaehlt.
                    2. Der Satz erklaerte eine Rollenwahl, die in diesem Zweig nie erscheint
                       — er beantwortete eine Frage, die der Nutzer nie gestellt bekommt.
                    Der frueher genannte Grund «Schritt 2 braucht ein Fokus-Ziel» traegt
                    nicht: der Fokus-Effekt haengt an `stepChanged`, das nur `goToStep2()`
                    und der Zurueck-Knopf des Rollen-Falls setzen. Beide gibt es hier nicht;
                    bei `isOpen` schliesst «Zurueck» den Dialog (siehe unten). Gemessen in
                    worklog/.r183-openclass-reach.mjs: booking-next fehlt, Zurueck schliesst,
                    focusAnchorNeeded=false. Der Anker war unerreichbarer Code. */}
                {!isOpen && (
                  <p
                    ref={stepSummaryRef}
                    tabIndex={-1}
                    data-testid="step1-summary"
                    className="text-sm text-[var(--color-ink-muted)] focus:outline-none"
                  >
                    {role === 'leader' ? bt.leader : bt.follower}
                    {' · '}
                    {mode === 'couple' ? bt.couple : bt.solo}
                  </p>
                )}

                {isOpen && laneFull && (
                  <p
                    data-testid="lane-full-note"
                    className="rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2 text-sm font-medium text-[var(--color-ink)]"
                  >
                    {bt.courseFull}
                  </p>
                )}

                {/* Eigene Daten */}
                <PersonFields legend={bt.yourData} prefix="bk" person={me} onChange={setMe} bt={bt} showErrors={showErrors} hideLegend />

                {/* Partner-Daten (nur Paar) */}
                {mode === 'couple' && !isOpen && (
                  <PersonFields legend={bt.partnerData} prefix="bk-p" person={partner} onChange={setPartner} bt={bt} showErrors={showErrors} />
                )}

                {/* Nachricht (optional) — landet als notes in der Buchung. */}
                <label className="block border-t border-[var(--color-line)] pt-3">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    {bt.message} <span className="text-[var(--color-ink-muted)]/70">({bt.messageOptional})</span>
                  </span>
                  <textarea
                    name="bk-message"
                    data-testid="bk-message"
                    rows={2}
                    maxLength={1000}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={bt.messagePlaceholder}
                    className="w-full resize-y rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-salsa)] focus:bg-white focus:outline-none"
                  />
                </label>
                </>
                )}

                {/* Schritt 1 hat kein optionales Feld — dort schliesst die Meldung den
                    Block ab. Auf Schritt 2 steht sie oben an den Pflichtfeldern (siehe
                    Kommentar dort) und darf hier kein zweites Mal erscheinen. */}
                {visibleStep === 1 && formError && !(showErrors && role === null) && (
                  <p role="alert" className="text-sm font-medium text-[var(--color-salsa)]">{formError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* R134/3: Die Fusszeile traegt genau die Aktion des sichtbaren Schritts.
            Schritt 1 hat eine Weiter-Taste und keinen Datenschutz-Haken — der gehoert
            zum Absenden, nicht zur Rollenwahl. */}
        {!loading && !loadError && avail?.bookable && !result && (
          <div className="sticky bottom-0 z-10 shrink-0 border-t border-[var(--color-line)] bg-white px-4 py-3 sm:px-5">
            {visibleStep === 1 ? (
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="t-hover hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)] sm:inline-flex"
                >
                  {bt.back}
                </button>
                <button
                  type="button"
                  onClick={goToStep2}
                  data-testid="booking-next"
                  className="btn-base btn-primary flex-1 px-6 py-2.5 text-sm sm:flex-none"
                >
                  {ft.formNext}
                </button>
              </div>
            ) : (
              <>
                {submitError && (
                  <p
                    role="alert"
                    data-testid="booking-submit-error"
                    className="mb-2 text-sm font-medium text-[var(--color-salsa)]"
                  >
                    {submitError}
                  </p>
                )}
                {/* Kein mb hier: Satz und Link darunter gehoeren zusammen und stehen
                    darum enger beieinander als der Link am Absende-Knopf (Naehe = Gruppe).
                    Der Abstand nach unten sitzt am Link. */}
                <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  <input
                    ref={privacyRef}
                    type="checkbox"
                    data-testid="booking-privacy"
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
                    // Fehlender Haken ist ein Feldfehler, kein allgemeiner Formularfehler:
                    // die Box selbst wird markiert und traegt ihre Meldung.
                    aria-invalid={showErrors && !privacy ? true : undefined}
                    aria-describedby={showErrors && !privacy ? 'booking-privacy-error' : undefined}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-salsa)]"
                  />
                  {/* R183 gemessen: Der Inline-Link war 19px hoch — unter den 40px, die ein
                      Finger sicher trifft, und er liegt mitten im Text der Checkbox. Ein
                      Fehlgriff setzte den Haken statt die Seite zu oeffnen (oder umgekehrt).
                      Der Satz nennt den Datenschutz jetzt nur noch. Der Link steht als
                      eigene Zeile NEBEN dem Label (nicht darin) mit min-h-11: ein Klick
                      darauf kann den Haken gar nicht mehr mitschalten. */}
                  <span className="min-w-0 text-pretty">
                    {lang === 'de'
                      ? 'Ich habe die Datenschutzerklärung gelesen und bin damit einverstanden.'
                      : 'I have read the privacy policy and agree to it.'}
                  </span>
                </label>
                <a
                  href="/datenschutz"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="booking-privacy-link"
                  className="mb-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-salsa)] underline underline-offset-4"
                >
                  {lang === 'de' ? 'Datenschutzerklärung lesen' : 'Read the privacy policy'}
                </a>
                {showErrors && !privacy && (
                  <p id="booking-privacy-error" className="mb-2 text-sm font-medium text-[var(--color-salsa)]">
                    {lang === 'de' ? 'Bitte setze das Häkchen beim Datenschutz.' : 'Please tick the privacy box.'}
                  </p>
                )}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="order-last text-center text-xs font-medium text-[var(--color-ink-muted)] sm:order-first sm:text-left">
                    {lang === 'de' ? 'Bezahlt wird vor Ort' : 'Pay on site'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      // Offene Klasse hat keinen Schritt 1: dort schliesst der Knopf den
                      // Dialog wie bisher, sonst geht er einen Schritt zurueck.
                      onClick={
                        isOpen
                          ? onBack
                          : () => {
                              stepChanged.current = true;
                              setStep(1);
                            }
                      }
                      data-testid="booking-step-back"
                      className="t-hover shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]"
                    >
                      {isOpen ? bt.back : ft.formBack}
                    </button>
                    <button
                      type="submit"
                      form={`booking-form-${course.id}`}
                      data-testid="booking-submit"
                      disabled={submitting}
                      className="btn-base btn-primary flex-1 px-6 py-2.5 text-sm disabled:opacity-50 sm:flex-none"
                    >
                      {submitting ? bt.submitting : bt.reserveCta}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* Schritt 3: Bestaetigung (frei) oder Warteliste (voll).
 *
 * Der Bildschirm beantwortet zuerst die Frage, die der Besucher gerade hat: WAS habe ich
 * gebucht? Darum steht der Kursname gross oben, darunter drei Fakten-Zeilen (Wann, Wo,
 * Bezahlen). Erst danach kommt der Text. Vorher stand hier eine Ueberschrift, ein
 * Fliesstext-Block und eine nummerierte Liste — keine einzige Zeile nannte den Kurs.
 *
 * Ehrlichkeit: es geht KEINE automatische Bestaetigungs-Mail raus. Die Reservierung
 * landet als Mail beim Studio, ein Mensch bestaetigt (Absprache 13.08.2026). Der Text
 * sagt genau das und verspricht keinen Automatismus.
 *
 * Warteliste: kein bg-amber-100 mehr (Fremdfarbe ausserhalb der Token-Liste, DESIGN.md
 * "keine neue Farbe in der Komponente"). Neutrale bg-soft-Flaeche, Salsa-Rot als Akzent,
 * gleiche Klarheit wie der Erfolgs-Fall.
 */
function SuccessPanel({
  result,
  onBack,
  courseLabel,
  dayLabel,
  startTime,
  endTime,
  locationName,
}: {
  result: CreateBookingResult;
  onBack: () => void;
  courseLabel: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  locationName: string;
}) {
  const { lang } = useLang();
  const bt = BOOKING_UI[lang];
  const waitlisted = result.status === 'waitlisted';
  const reduced = useReducedMotion();
  const hydrated = useHydrated();

  // EIN authored Moment: die Karte steigt mit Feder-Kurve ein, der Haken zeichnet sich
  // in derselben Bewegung. 380ms, danach ist Ruhe. Kein Bounce, kein zweiter Effekt.
  // Vor der Hydration und bei prefers-reduced-motion ist der Endzustand der Startzustand:
  // kein opacity:0 im ausgelieferten HTML, kein Versatz fuer Leute, die keine Bewegung wollen.
  const still = reduced || !hydrated;
  const cardInitial = still ? { opacity: 1, transform: 'translateY(0px)' } : { opacity: 0, transform: 'translateY(12px)' };

  return (
    <motion.div
      className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white shadow-sm"
      data-testid="booking-success"
      data-status={waitlisted ? 'waitlisted' : 'confirmed'}
      role="status"
      aria-live="polite"
      initial={cardInitial}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={still ? { duration: 0 } : { type: 'spring', duration: 0.42, bounce: 0.12 }}
    >
      {/* Kopf: Haken + Kursname + Fakten. Der Erfolgs-Fall traegt Salsa-Rot als Flaeche,
          die Warteliste dieselbe Struktur auf neutraler bg-soft-Flaeche mit rotem Akzent. */}
      <div
        className={cn(
          'px-5 py-6 text-center sm:px-6 sm:py-7',
          waitlisted
            ? 'border-b border-[var(--color-line)] bg-[var(--color-bg-soft)]'
            : 'bg-[var(--color-salsa)] text-white',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-full',
            waitlisted ? 'bg-white text-[var(--color-salsa)] ring-1 ring-[var(--color-line)]' : 'bg-white/15 text-white',
          )}
          aria-hidden
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Der Haken (bzw. die Uhr) zeichnet sich einmal. pathLength normiert die Laenge
                auf 1, damit dieselbe Dauer fuer beide Formen gilt. */}
            <motion.path
              d={waitlisted ? 'M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z' : 'M20 6 9 17l-5-5'}
              pathLength={1}
              initial={still ? { strokeDasharray: 1, strokeDashoffset: 0 } : { strokeDasharray: 1, strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: 0 }}
              transition={still ? { duration: 0 } : { duration: 0.38, ease: EASE_OUT, delay: 0.08 }}
            />
          </svg>
        </div>

        <p className={cn('mt-4 text-xs font-bold uppercase tracking-[0.16em]', waitlisted ? 'text-[var(--color-salsa)]' : 'text-white/70')}>
          {waitlisted ? bt.successWaitlistFor : bt.successConfirmedTitle}
        </p>
        <h3 className={cn('type-h2 mt-1 text-balance', waitlisted ? 'text-[var(--color-ink)]' : 'text-white')} data-testid="booking-success-course">
          {courseLabel}
        </h3>

        {/* Drei Fakten, die vorher nirgends standen. Kein Fliesstext. */}
        <dl className={cn('mx-auto mt-5 grid max-w-md gap-3 text-left sm:grid-cols-3', waitlisted ? 'text-[var(--color-ink)]' : 'text-white')}>
          <Fact label={bt.successFactWhen} tone={waitlisted ? 'light' : 'dark'}>
            {dayLabel} {startTime}-{endTime}
          </Fact>
          <Fact label={bt.successFactWhere} tone={waitlisted ? 'light' : 'dark'}>
            {locationName}
          </Fact>
          <Fact label={bt.successFactPay} tone={waitlisted ? 'light' : 'dark'}>
            {bt.successPayShort}
          </Fact>
        </dl>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {waitlisted && (
          <h4 className="type-h3 text-[var(--color-ink)]">{bt.successWaitlistTitle}</h4>
        )}
        <p className={cn('max-w-prose text-sm leading-relaxed text-[var(--color-ink-muted)]', waitlisted && 'mt-2')}>
          {waitlisted ? waitlistBody(lang) : bt.successConfirmedBody}
        </p>

        {/* Naechste Schritte: konkret, kein Marketing. Ohne die Mail-Zeile — sie stand
            wortgleich schon im Text darueber. */}
        <ul className="mt-4 space-y-2.5">
          {(waitlisted
            ? [bt.waitlistBodyExtra]
            : [bt.successNextLocation, bt.successNextBring]
          ).map((text) => (
            <li key={text} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-ink)]">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-salsa)]" />
              <span className="text-pretty">{text}</span>
            </li>
          ))}
        </ul>

        {/* EINE starke Aktion: WhatsApp. Kursplan bleibt Text-Link, damit kein Button-Zoo
            entsteht. "Anderen Kurs waehlen" schliesst den Dialog und bleibt still. */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
            data-testid="booking-success-whatsapp"
            className="btn-base btn-primary gap-2 px-6 py-2.5 text-sm"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            {bt.successWhatsApp}
          </a>
          <a
            href="/kursplan"
            data-testid="booking-success-schedule"
            className="t-hover text-sm font-semibold text-[var(--color-salsa)] underline underline-offset-4 hover:text-[var(--color-salsa-700)]"
          >
            {bt.toSchedule}
          </a>
          <button
            type="button"
            onClick={onBack}
            data-testid="booking-success-back"
            className="t-hover text-sm font-semibold text-[var(--color-ink-muted)] underline underline-offset-4 hover:text-[var(--color-ink)]"
          >
            {bt.backToCourses}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/** Eine Fakten-Zeile der Erfolgs-Ansicht: Label klein, Wert lesbar. */
function Fact({ label, tone, children }: { label: string; tone: 'light' | 'dark'; children: React.ReactNode }) {
  return (
    <div>
      <dt className={cn('text-[0.65rem] font-bold uppercase tracking-[0.14em]', tone === 'dark' ? 'text-white/65' : 'text-[var(--color-ink-muted)]')}>
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold leading-snug">{children}</dd>
    </div>
  );
}

/**
 * EINE Auswahl-Kachel fuer JEDE Auswahl in Schritt 1 — Rolle und Anmeldeart.
 *
 * Kritik-Fund KRITISCH (buchung-desktop-04-modal-leader-selected.png): Schritt 1 hatte
 * zwei Auswahl-Gruppen direkt untereinander und zwei verschiedene "gewaehlt"-Looks.
 * Im PNG gemessen: "Leader" gewaehlt = rgb(173,24,39) auf einer eckig-gerundeten Kachel,
 * "Allein" gewaehlt = rgb(10,10,10) auf einer Pille — zwei Farben fuer dieselbe Bedeutung,
 * 90px voneinander entfernt. Getrennte Komponenten (RoleTile / ModeButton) konnten nur
 * auseinanderlaufen; jetzt gibt es nur noch diese eine.
 *
 * Eine Linie: Rot ist der EINZIGE Gewaehlt-Zustand. Rot traegt sonst nur der CTA, damit
 * bleibt "rot = das habe ich gewaehlt bzw. das loest aus" die ganze Seite ueber wahr.
 *
 * R134/2 bleibt darin erhalten: auf roter Flaeche steht das Label weiss (Kontrast 5.9:1
 * auf #AD1827), das Haekchen liegt im weissen Kreis. Kein Zustand ohne lesbares Wort.
 */
function ChoiceTile({
  testid,
  active,
  label,
  onClick,
  invalid = false,
}: {
  testid: string;
  active: boolean;
  label: string;
  onClick: () => void;
  invalid?: boolean;
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      aria-pressed={active}
      aria-invalid={invalid || undefined}
      onClick={onClick}
      className={cn(
        'relative flex flex-1 flex-col items-start rounded-[var(--radius-card)] border px-3 py-2.5 text-left transition-colors sm:px-3.5 sm:py-3',
        active
          ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)]'
          : 'border-[var(--color-line)] bg-[var(--color-bg-soft)] hover:border-[var(--color-salsa)]',
        invalid && !active && 'border-[var(--color-salsa)]/50',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full border',
          active
            ? 'border-white bg-white text-[var(--color-salsa)]'
            : 'border-[var(--color-line)] bg-white',
        )}
      >
        {active && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className={cn('pr-7 font-display text-base font-bold leading-tight sm:text-lg', active ? 'text-white' : 'text-[var(--color-ink)]')}>
        {label}
      </span>
    </button>
  );
}

function PersonFields({
  legend,
  prefix,
  person,
  onChange,
  bt,
  showErrors,
  hideLegend = false,
}: {
  legend: string;
  prefix: string;
  person: Person;
  onChange: (p: Person) => void;
  bt: (typeof BOOKING_UI)['de'];
  showErrors: boolean;
  hideLegend?: boolean;
}) {
  const input =
    'w-full rounded-[var(--radius-chip)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-salsa)] focus:bg-white focus:outline-none';
  const set = (patch: Partial<Person>) => onChange({ ...person, ...patch });
  return (
    <section className="space-y-2.5 border-t border-[var(--color-line)] pt-3" aria-labelledby={`${prefix}-legend`}>
      <h3 id={`${prefix}-legend`} className={cn('text-sm font-bold text-[var(--color-ink)]', hideLegend && 'sr-only')}>{legend}</h3>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            {bt.firstName} *
          </span>
          <input
            name={`${prefix}-firstName`}
            autoComplete="given-name"
            required
            data-testid={`${prefix}-firstName`}
            value={person.firstName}
            onChange={(e) => set({ firstName: e.target.value })}
            aria-invalid={showErrors && !person.firstName.trim() ? true : undefined}
            aria-describedby={showErrors && !person.firstName.trim() ? `${prefix}-firstName-error` : undefined}
            className={input}
          />
          {showErrors && !person.firstName.trim() && <span id={`${prefix}-firstName-error`} className="mt-1 block text-xs font-medium text-[var(--color-salsa)]">{bt.fieldRequired}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            {bt.lastName} *
          </span>
          <input
            name={`${prefix}-lastName`}
            autoComplete="family-name"
            required
            data-testid={`${prefix}-lastName`}
            value={person.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
            aria-invalid={showErrors && !person.lastName.trim() ? true : undefined}
            aria-describedby={showErrors && !person.lastName.trim() ? `${prefix}-lastName-error` : undefined}
            className={input}
          />
          {showErrors && !person.lastName.trim() && <span id={`${prefix}-lastName-error`} className="mt-1 block text-xs font-medium text-[var(--color-salsa)]">{bt.fieldRequired}</span>}
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          {bt.email} *
        </span>
        <input
          type="email"
          name={`${prefix}-email`}
          autoComplete="email"
          required
          data-testid={`${prefix}-email`}
          value={person.email}
          onChange={(e) => set({ email: e.target.value })}
          aria-invalid={showErrors && !emailOk(person.email) ? true : undefined}
          aria-describedby={showErrors && !emailOk(person.email) ? `${prefix}-email-error` : undefined}
          className={input}
        />
        {showErrors && !person.email.trim() && <span id={`${prefix}-email-error`} className="mt-1 block text-xs font-medium text-[var(--color-salsa)]">{bt.fieldRequired}</span>}
        {showErrors && person.email.trim() && !emailOk(person.email) && <span id={`${prefix}-email-error`} className="mt-1 block text-xs font-medium text-[var(--color-salsa)]">{bt.emailInvalid}</span>}
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          {bt.phone} <span className="text-[var(--color-ink-muted)]/70">({bt.phoneOptional})</span>
        </span>
        <input
          type="tel"
          name={`${prefix}-phone`}
          autoComplete="tel"
          data-testid={`${prefix}-phone`}
          value={person.phone}
          onChange={(e) => set({ phone: e.target.value })}
          className={input}
        />
      </label>
    </section>
  );
}
