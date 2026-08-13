// Buchungs-Funnel unter /buchung (Redesign 2026-08-07): EIN Fluss in drei Schritten —
// Kurs waehlen (Wochentag + Liste aus dem echten Plan) -> Daten eingeben -> Bestaetigung
// oder Warteliste. KEIN Payment im Funnel: der Hinweis ist immer "Reservieren, zahlst vor
// Ort (Twint/Bar)". Der Stripe-Pfad (BookingReturn fuer Zahl-Links aus Mails) bleibt
// unangetastet auf seinen Sub-Routen.
//
// ?kurs=<id> springt direkt in Schritt 2 (Deep-Link aus kuenftigen Kurs-Seiten).
// Motion: EINE Signatur — getakteter Fade-up (Feder-Kurve) auf Liste und Panel-Wechsel,
// alles motion-safe, also respektiert prefers-reduced-motion automatisch.

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { BOOKING_UI, WEEKDAY_LABEL, useLang, waitlistBody, levelLabelI18n, formatDateI18n } from '@/lib/i18n';
import {
  createBooking,
  fetchAvailability,
  type CourseAvailability,
  type CreateBookingResult,
} from '@/lib/booking';
import {
  fetchSchedule,
  buildScheduleDays,
  weekdayKeyForISO,
  type ScheduleCourse,
  type ScheduleResponse,
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
    noCoursesHint: 'Wähl einen anderen Tag oben — oder spring direkt zu den nächsten Terminen.',
    nextDayWithCourses: 'Nächster Tag mit Kursen',
    nextSlotsTitle: 'Nächste Termine für dich',
    nextSlotsHint: 'Direkt buchen — ohne Tag zu wechseln.',
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
    emptyWeek: 'In dieser Woche ist alles ausgebucht — schau auf einen anderen Tag oder schreib uns kurz.',
    today: 'heute',
  },
  en: {
    pickDay: 'Pick your day',
    noCoursesDay: 'No class runs on this day right now.',
    noCoursesHint: 'Pick another day above — or jump straight to the next openings.',
    nextDayWithCourses: 'Next day with classes',
    nextSlotsTitle: 'Next openings for you',
    nextSlotsHint: 'Book directly — no day switch needed.',
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
    emptyWeek: 'Everything is booked this week — try another day or drop us a line.',
    today: 'today',
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
        className="bg-[var(--color-paper-warm)] pb-8 sm:pb-10"
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

  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [planError, setPlanError] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);
  const [courseAvailability, setCourseAvailability] = useState<Record<string, CourseAvailability | null>>({});

  const [course, setCourse] = useState<ScheduleCourse | null>(null);
  const [day, setDay] = useState<string | null>(null);

  const loadPlan = () => {
    setPlanLoading(true);
    setPlanError(false);
    fetchSchedule()
      .then((s) => {
        setSchedule(s);
        const preselect = new URLSearchParams(window.location.search).get('kurs');
        const hit = preselect ? s.courses.find((c) => c.id === preselect) : null;
        if (hit) {
          setCourse(hit);
        } else {
          setDay(weekdayKeyForISO(s.today) ?? 'mon');
        }
      })
      .catch(() => setPlanError(true))
      .finally(() => setPlanLoading(false));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadPlan, []);

  const days = useMemo(() => (schedule ? buildScheduleDays(schedule.today) : []), [schedule]);
  const activeDay = day ?? days[0]?.key ?? 'mon';
  const dayCourses = useMemo(() => {
    if (!schedule) return [];
    return schedule.courses
      .filter((c) => c.weekday === activeDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedule, activeDay]);

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
  const recommendedCourses = useMemo(() => {
    if (!schedule || !days.length || dayCourses.length > 0) return [];
    const idx = days.findIndex((d) => d.key === activeDay);
    const ordered: ScheduleCourse[] = [];
    for (let i = 1; i <= days.length && ordered.length < 4; i++) {
      const d = days[(idx + i) % days.length];
      const dayHits = schedule.courses
        .filter((c) => c.weekday === d.key)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      // freie Plätze zuerst, dann Warteliste — Studio-Rhythmus statt leere Flache.
      const ranked = [
        ...dayHits.filter((c) => c.status !== 'full'),
        ...dayHits.filter((c) => c.status === 'full'),
      ];
      for (const c of ranked) {
        if (ordered.length >= 4) break;
        ordered.push(c);
      }
    }
    return ordered;
  }, [schedule, days, activeDay, dayCourses.length]);

  const visibleCardCourses = dayCourses.length > 0 ? dayCourses : recommendedCourses;
  useEffect(() => {
    const missing = visibleCardCourses.filter((item) => courseAvailability[item.id] === undefined);
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
  }, [visibleCardCourses, courseAvailability]);

  const termOf = (c: ScheduleCourse): ScheduleTerm | undefined =>
    schedule?.terms.find((t) => t.id === c.termId);

  return (
    <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
      {/* Fortschritt: drei Worte, keine Deko. */}
      <ol className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]" aria-hidden>
        <li className={cn(!course && 'text-[var(--color-salsa)]')}>{ft.step1}</li>
        <li className="text-[var(--color-line)]">→</li>
        <li className={cn(course && 'text-[var(--color-salsa)]')}>{ft.step2}</li>
      </ol>

      {planLoading ? (
        <p role="status" className="py-16 text-center text-sm text-[var(--color-ink-muted)]">{ft.loadPlan}</p>
      ) : planError || !schedule ? (
        <div role="alert" className="py-16 text-center">
          <p className="text-sm font-medium text-[var(--color-salsa)]">{ft.planError}</p>
          <button
            type="button"
            onClick={loadPlan}
            data-testid="plan-retry"
            className="t-hover mt-4 rounded-full bg-[var(--color-salsa)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-salsa-600)]"
          >
            {BOOKING_UI[lang].retry}
          </button>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-4xl">
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
              const count = schedule.courses.filter((c) => c.weekday === d.key).length;
              return (
                <button
                  key={d.key}
                  type="button"
                  aria-pressed={activeDay === d.key}
                  data-testid={`day-${d.key}`}
                  onClick={() => setDay(d.key)}
                  className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-1.5 text-[0.8125rem] font-semibold transition-colors sm:px-3.5 sm:py-2.5 sm:text-sm',
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
                    <span className={cn('ml-1 text-[0.7rem] tabular-nums sm:text-xs', activeDay === d.key ? 'text-white/75' : 'text-[var(--color-ink-muted)]')}>
                      ·{count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kurse des Tages: getakteter Fade-up, EINE Signatur fuer den ganzen Funnel. */}
          {dayCourses.length === 0 ? (
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
                        className="t-hover inline-flex h-10 items-center rounded-full bg-[var(--color-salsa)] px-4 text-sm font-semibold text-white hover:bg-[var(--color-salsa-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)]"
                      >
                        {ft.nextDayWithCourses}
                        <span className="ml-1.5 text-white/80">
                          {WEEKDAY_LABEL[lang][nextDayWithCourses.key]?.short ?? nextDayWithCourses.shortDe}
                        </span>
                      </button>
                    )}
                    <a
                      href="/kontakt#kontaktformular"
                      className="t-hover inline-flex h-10 items-center rounded-full border border-[var(--color-line)] px-4 text-sm font-semibold text-[var(--color-ink)] hover:border-[var(--color-salsa)] hover:text-[var(--color-salsa)]"
                    >
                      {lang === 'de' ? 'Frag uns' : 'Ask us'}
                    </a>
                  </div>
                </div>
              </div>

              {recommendedCourses.length > 0 && (
                <div data-testid="empty-recommendations">
                  <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                        {ft.nextSlotsTitle}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">{ft.nextSlotsHint}</p>
                    </div>
                  </div>
                  <ul className="space-y-2" data-testid="empty-rec-list">
                    {recommendedCourses.map((c, i) => {
                      const style = lang === 'de' ? c.styleDe : c.styleEn;
                      const level = levelLabelI18n(lang === 'de' ? c.levelDe : c.levelEn, c.onVariant);
                      const teachers = c.teachers.map((t) => t.displayName.split(' ')[0]).join(', ');
                      const availability = courseAvailability[c.id];
                      const full = availability ? availability.full : c.status === 'full';
                      const dayShort = WEEKDAY_LABEL[lang][c.weekday]?.short ?? c.weekday;
                      return (
                        <li
                          key={c.id}
                          className="motion-safe:animate-[booking-panel-in_280ms_ease-out_both]"
                          style={{ animationDelay: `${Math.min(i, 4) * 40}ms` }}
                        >
                          <button
                            type="button"
                            data-testid={`pick-course-${c.id}`}
                            onClick={() => setCourse(c)}
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
                                <span className="truncate font-display text-sm font-bold text-[var(--color-ink)] sm:text-base">{style}</span>
                                {level && (
                                  <span className="shrink-0 rounded-full bg-[var(--color-bg-soft)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--color-ink-muted)]">
                                    {level}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex min-w-0 items-center gap-2 text-xs leading-snug text-[var(--color-ink-muted)]">
                                <span className="min-w-0 truncate">
                                  {teachers && <>{teachers} · </>}
                                  {c.locationName}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <span
                                className={cn(
                                  'block rounded-full px-2.5 py-1 text-[0.65rem] font-bold sm:px-3 sm:text-xs',
                                  full ? 'bg-amber-100 text-amber-800' : 'bg-[var(--color-salsa-50)] text-[var(--color-salsa)]',
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
            <ul className="mt-4 space-y-2.5" data-testid="course-list">
              {dayCourses.map((c, i) => {
                const style = lang === 'de' ? c.styleDe : c.styleEn;
                const level = levelLabelI18n(lang === 'de' ? c.levelDe : c.levelEn, c.onVariant);
                const teachers = c.teachers.map((t) => t.displayName.split(' ')[0]).join(', ');
                const availability = courseAvailability[c.id];
                const full = availability ? availability.full : c.status === 'full';
                return (
                  <li
                    key={c.id}
                    // ease-out statt Federkurve: cubic-bezier(0.34,1.56,0.64,1) schiesst ueber den
                    // Zielwert hinaus und wippt zurueck. Bei einer Liste von bis zu neun Karten
                    // wippt dann alles nacheinander. Dieselbe Animation lief an drei anderen
                    // Stellen im selben Panel schon mit ease-out.
                    className="motion-safe:animate-[booking-panel-in_280ms_ease-out_both]"
                    style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                  >
                    <button
                      type="button"
                      data-testid={`pick-course-${c.id}`}
                      onClick={() => setCourse(c)}
                      className="group flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white px-4 py-3.5 text-left transition-colors hover:border-[var(--color-salsa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] sm:gap-4 sm:px-5 sm:py-4"
                    >
                      <div className="w-14 shrink-0 text-center">
                        <div className="font-display text-lg font-extrabold leading-none text-[var(--color-ink)]">{c.startTime}</div>
                        <div className="mt-0.5 text-xs text-[var(--color-ink-muted)]">{c.endTime}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          <span className="truncate font-display text-base font-bold text-[var(--color-ink)]">{style}</span>
                          {level && (
                            <span className="shrink-0 rounded-full bg-[var(--color-bg-soft)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--color-ink-muted)]">
                              {level}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex min-w-0 items-center gap-2 text-xs leading-snug text-[var(--color-ink-muted)]">
                          <span className="min-w-0 truncate">
                            {teachers && <>{teachers} · </>}
                            {c.locationName}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={cn(
                            'block rounded-full px-3 py-1 text-xs font-bold',
                            full ? 'bg-amber-100 text-amber-800' : 'bg-[var(--color-salsa-50)] text-[var(--color-salsa)]',
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

          {/* Buchungs-Dialog: Overlay mit Backdrop, Fokus-Isolation und Scroll-Lock. */}
          {course && (
            <BookingForm
              key={course.id}
              course={course}
              term={termOf(course)}
              onBack={() => {
                setCourse(null);
                setDay(course.weekday);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

/* Schritt 2+3: Formular und Bestaetigung als Dialog-Overlay. */
function BookingForm({
  course,
  term,
  onBack,
}: {
  course: ScheduleCourse;
  term?: ScheduleTerm;
  onBack: () => void;
}) {
  const { lang } = useLang();
  const bt = BOOKING_UI[lang];
  const ft = FUNNEL[lang];

  const [avail, setAvail] = useState<CourseAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [role, setRole] = useState<'leader' | 'follower' | null>(null);
  const [mode, setMode] = useState<'solo' | 'couple'>('solo');
  const [needsAushilfe, setNeedsAushilfe] = useState(false);
  const [me, setMe] = useState<Person>(emptyPerson);
  const [partner, setPartner] = useState<Person>(emptyPerson);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateBookingResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onBack]);

  // Heels wird ohne Rollentrennung getanzt: dort gibt es kein Leader/Follower und kein Paar.
  const isOpen = course.styleKey === 'heels';

  function changeMode(next: 'solo' | 'couple') {
    setMode(next);
    if (next === 'couple') setNeedsAushilfe(false);
  }

  // Voll heisst: der Kursplan meldet den Kurs als ausgebucht. Dann geht die Anfrage auf die Warteliste.
  const laneFull = avail?.full ?? course.status === 'full';

  const courseLabel = `${lang === 'de' ? course.styleDe : course.styleEn} ${levelLabelI18n(
    lang === 'de' ? course.levelDe : course.levelEn,
    course.onVariant,
  )}`.trim();
  const teachers = course.teachers.map((t) => t.displayName.split(' ')[0]).join(', ');
  const dayLabel = WEEKDAY_LABEL[lang][course.weekday]?.long ?? course.weekday;

  const focusFirstInvalid = () =>
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  async function submit() {
    setFormError(null);
    setShowErrors(true);
    if (!isOpen && mode === 'solo' && role === null) {
      setFormError(bt.requiredHint);
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

    setSubmitting(true);
    try {
      const r = await createBooking({
        courseId: course.id,
        role: isOpen ? null : mode === 'couple' ? role ?? 'leader' : role,
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
    } catch (e) {
      setFormError(e instanceof Error ? e.message : bt.errorGeneric);
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
        aria-labelledby={`booking-panel-title-${course.id}`}
        data-testid="booking-dialog"
        className="my-auto flex w-full max-w-[980px] max-h-[min(92vh,900px)] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper-warm)] shadow-[0_24px_64px_rgba(17,17,17,0.28)] motion-safe:animate-[booking-panel-in_180ms_ease-out]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0 overflow-hidden bg-[var(--color-ink)] px-4 py-3 text-white sm:px-5 sm:py-3.5">
          <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[var(--color-salsa)]" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 id={`booking-panel-title-${course.id}`} className="font-display text-lg font-extrabold leading-tight tracking-tight sm:text-xl">
                {bt.title}: <span className="text-[var(--color-salsa)]">{courseLabel}</span>
              </h3>
              <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/55 sm:text-xs">
                <span>{dayLabel}</span>
                <span>{course.startTime}-{course.endTime}</span>
                {teachers && <span>{teachers}</span>}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onBack}
              data-testid="booking-close"
              aria-label={bt.backToCourses}
              className="t-hover inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[minmax(220px,0.62fr)_1.38fr]">
          {/* Summary: dichter Kurs-Kontext (weniger leere Weissflaeche links). */}
          <aside className="border-b border-[var(--color-line)] bg-[var(--color-bg-soft)] px-4 py-3.5 sm:px-4 lg:border-b-0 lg:border-r">
            <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-3.5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--color-salsa)]">
                {lang === 'de' ? 'Dein Kurs' : 'Your class'}
              </p>
              <p className="mt-1 font-display text-base font-extrabold leading-tight tracking-tight text-[var(--color-ink)] sm:text-lg">
                {courseLabel}
              </p>
              <dl className="mt-2.5 space-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                    {lang === 'de' ? 'Zeit' : 'Time'}
                  </dt>
                  <dd className="min-w-0 leading-snug text-[var(--color-ink)]">
                    {dayLabel} {course.startTime}-{course.endTime}
                    {teachers ? ` · ${teachers}` : ''}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                    {lang === 'de' ? 'Ort' : 'Place'}
                  </dt>
                  <dd className="min-w-0 leading-snug text-[var(--color-ink)]">{course.locationName}</dd>
                </div>
                {term && (
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                      {lang === 'de' ? 'Staffel' : 'Term'}
                    </dt>
                    <dd className="min-w-0 leading-snug text-[var(--color-ink)]">
                      {formatDateI18n(term.startDate, lang)} – {formatDateI18n(term.endDate, lang)}
                      <span className="text-[var(--color-ink-muted)]"> · {bt.weeksNote}</span>
                    </dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                    {lang === 'de' ? 'Kosten' : 'Payment'}
                  </dt>
                  <dd className="min-w-0 leading-snug text-[var(--color-ink)]">{bt.payOnSite}</dd>
                </div>
              </dl>
            </div>
            {!result && (
              <button
                type="button"
                onClick={onBack}
                data-testid="booking-change-course"
                className="t-hover mt-3 text-sm font-semibold text-[var(--color-salsa)] underline underline-offset-4 hover:text-[var(--color-salsa-700)]"
              >
                ← {ft.changeCourse}
              </button>
            )}
          </aside>

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
                className="t-hover mt-3 rounded-full bg-[var(--color-salsa)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-salsa-600)]"
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
            <SuccessPanel result={result} onBack={onBack} />
          ) : (
            <form
              ref={formRef}
              id={`booking-form-${course.id}`}
              className="space-y-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
                {/* Gruppe 1: Anmeldung (Rolle, Modus, Tarif) — flach, ohne Karten-Verschachtelung. */}
                <h3 className="font-display text-base font-bold text-[var(--color-ink)]">{bt.stepRegister}</h3>

                {/* Rolle (nur bei Leader/Follower-Kursen) */}
                {isOpen ? (
                  <p className="text-sm text-[var(--color-ink-muted)]">{bt.openClassNote}</p>
                ) : (
                  <section className="border-t border-[var(--color-line)] pt-2.5 first:border-t-0 first:pt-0" aria-labelledby="booking-role-title" aria-describedby={showErrors && role === null ? 'booking-role-error' : undefined}>
                    <h3 id="booking-role-title" className="mb-1.5 text-sm font-bold text-[var(--color-ink)]">{bt.chooseRole}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <RoleTile
                        testid="role-follower"
                        active={role === 'follower'}
                        label={bt.follower}
                        onClick={() => setRole('follower')}
                        invalid={showErrors && mode === 'solo' && role === null}
                      />
                      <RoleTile
                        testid="role-leader"
                        active={role === 'leader'}
                        label={bt.leader}
                        onClick={() => setRole('leader')}
                        invalid={showErrors && mode === 'solo' && role === null}
                      />
                    </div>
                    <p className="mt-1.5 text-xs leading-snug text-[var(--color-ink-muted)]">{bt.roleHelper}</p>
                    {showErrors && mode === 'solo' && role === null && (
                      <p id="booking-role-error" className="mt-1.5 text-sm font-medium text-[var(--color-salsa)]">{bt.requiredHint}</p>
                    )}
                  </section>
                )}

                {/* Modus allein / Paar (nur Leader/Follower) */}
                {!isOpen && (
                  <section className="border-t border-[var(--color-line)] pt-2.5" aria-labelledby="booking-mode-title">
                    <h3 id="booking-mode-title" className="mb-1.5 text-sm font-bold text-[var(--color-ink)]">{bt.registration}</h3>
                    <div className="flex gap-2">
                      <ModeButton testid="mode-solo" active={mode === 'solo'} onClick={() => changeMode('solo')}>
                        {bt.solo}
                      </ModeButton>
                      <ModeButton testid="mode-couple" active={mode === 'couple'} onClick={() => changeMode('couple')}>
                        {bt.couple}
                      </ModeButton>
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
                        <span className="min-w-0 flex-1 text-pretty">{bt.aushilfeLabel}</span>
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
                    className="rounded-[var(--radius-chip)] bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
                  >
                    {bt.courseFull}
                  </p>
                )}

                {/* Gruppe 2: Personendaten */}
                <h3 className="border-t border-[var(--color-line)] pt-4 font-display text-lg font-bold text-[var(--color-ink)]">{bt.stepData}</h3>

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

                {formError && <p role="alert" className="text-sm font-medium text-[var(--color-salsa)]">{formError}</p>}
              </form>
            )}
          </div>
        </div>

        {!loading && !loadError && avail?.bookable && !result && (
          <div className="sticky bottom-0 z-10 shrink-0 border-t border-[var(--color-line)] bg-white px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center text-xs font-medium text-[var(--color-ink-muted)] sm:text-left">
                {lang === 'de' ? 'Bezahlt wird vor Ort' : 'Pay on site'}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="t-hover hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)] sm:inline-flex"
                >
                  {bt.back}
                </button>
                <button
                  type="submit"
                  form={`booking-form-${course.id}`}
                  data-testid="booking-submit"
                  disabled={submitting}
                  className="t-hover flex-1 rounded-full bg-[var(--color-salsa)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-salsa-600)] disabled:opacity-50 sm:flex-none"
                >
                  {submitting ? bt.submitting : bt.reserveCta}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Schritt 3: Bestaetigung (frei) oder Warteliste (voll) — jeweils mit naechsten Schritten. */
function SuccessPanel({ result, onBack }: { result: CreateBookingResult; onBack: () => void }) {
  const { lang } = useLang();
  const bt = BOOKING_UI[lang];
  const waitlisted = result.status === 'waitlisted';
  return (
    <div
      className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white px-5 py-8 text-center shadow-sm"
      data-testid="booking-success"
      data-status={waitlisted ? 'waitlisted' : 'confirmed'}
    >
      <div
        className={cn(
          'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full',
          waitlisted ? 'bg-amber-100 text-amber-700' : 'bg-[var(--color-salsa-50)] text-[var(--color-salsa)]',
        )}
        aria-hidden
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {waitlisted ? <path d="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" /> : <path d="M20 6 9 17l-5-5" />}
        </svg>
      </div>
      <h3 className="font-display text-2xl font-bold leading-tight text-[var(--color-ink)]">
        {waitlisted ? bt.successWaitlistTitle : bt.successConfirmedTitle}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {waitlisted ? waitlistBody(lang) : bt.successConfirmedBody}
      </p>

      {/* Naechste Schritte: konkret, kein Marketing. */}
      <div className="mx-auto mt-6 max-w-sm text-left">
        <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-salsa)]">{bt.successNextTitle}</h4>
        <ul className="mt-3 space-y-3">
          {(waitlisted
            ? [bt.successNextMail, bt.waitlistBodyExtra]
            : [bt.successNextMail, bt.successNextLocation, bt.successNextBring]
          ).map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-ink)]">
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-salsa-50)] font-display text-xs font-bold text-[var(--color-salsa)]"
              >
                {i + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <a
          href="/kursplan"
          className="t-hover rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-salsa)]"
        >
          {bt.toSchedule}
        </a>
        <button
          type="button"
          onClick={onBack}
          data-testid="booking-success-back"
          className="t-hover rounded-full px-6 py-2.5 text-sm font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          {bt.backToCourses}
        </button>
      </div>
    </div>
  );
}

function RoleTile({
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
        'relative flex flex-col items-start rounded-[var(--radius-card)] border px-3 py-2.5 text-left transition-colors sm:px-3.5 sm:py-3',
        active
          ? 'border-[var(--color-salsa)] bg-[var(--color-salsa-50)] shadow-[inset_0_0_0_1.5px_var(--color-salsa)] ring-1 ring-[var(--color-salsa)]/30'
          : 'border-[var(--color-line)] bg-[var(--color-bg-soft)] hover:border-[var(--color-salsa)]',
        invalid && !active && 'border-[var(--color-salsa)]/50',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full border',
          active
            ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white'
            : 'border-[var(--color-line)] bg-white',
        )}
      >
        {active && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className={cn('pr-7 font-display text-base font-bold leading-tight sm:text-lg', active ? 'text-[var(--color-salsa)]' : 'text-[var(--color-ink)]')}>
        {label}
      </span>
    </button>
  );
}

function ModeButton({
  testid,
  active,
  onClick,
  children,
}: {
  testid: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition-colors sm:px-4 sm:py-2.5',
        active
          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-sm'
          : 'border-[var(--color-line)] bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:border-[var(--color-salsa)]',
      )}
    >
      {children}
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
          {showErrors && !person.firstName.trim() && <span id={`${prefix}-firstName-error`} className="mt-1 block text-xs font-medium text-[var(--color-salsa)]">{bt.requiredHint}</span>}
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
          {showErrors && !person.lastName.trim() && <span id={`${prefix}-lastName-error`} className="mt-1 block text-xs font-medium text-[var(--color-salsa)]">{bt.requiredHint}</span>}
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
        {showErrors && !emailOk(person.email) && <span id={`${prefix}-email-error`} className="mt-1 block text-xs font-medium text-[var(--color-salsa)]">{bt.requiredHint}</span>}
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
