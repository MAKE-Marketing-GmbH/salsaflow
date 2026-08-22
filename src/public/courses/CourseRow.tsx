// EINE Kurs-Zeile fuer die ganze Site.
//
// R189 (Raphael, Video): "Der Kursplan muss ein Stueckchen klarer werden. Mach das einfach in
// EINEM Stil. Auf der Tanz- und Kursplan-Seite wird das beim Hover rot, das ist richtig nice.
// Aber auf der Startseite sieht es GANZ ANDERS aus."
//
// Gemessen an den Belegen (worklog/shots/R189/before/home/d-03.png gegen
// worklog/shots/R189/before/kursplan/d-01.png) rendern beide Seiten denselben Inhalt in zwei
// Sprachen: die Startseite als nackte Textzeile ohne Lehrpersonen, ohne Karte, mit grauer
// Kleinuhr und EINEM Badge; /kursplan als weisse Karte mit Portrait, 2rem-Uhr samt rotem Punkt,
// drei Badges und "Platz sichern". Der Kunde will die /kursplan-Optik. Sie zieht deshalb hier
// heraus und wird von beiden Seiten benutzt, statt ein drittes Mal nachgebaut zu werden.
//
// Die Datei traegt NUR die Darstellung. Wer die Zeilen zusammenstellt, bleibt getrennt:
// /kursplan faltet je Staffel (CourseEngine.buildSlots), die Startseite faltet ueber Staffeln
// (lib/schedule.buildScheduleSlots). Diese Trennung ist ein bezahlter Bugfix vom 2026-08-07
// (falscher "Plaetze frei"-Status auf der Startseite) und wird hier nicht angefasst — darum
// nimmt `CourseRow` fertige Anzeige-Werte entgegen und rechnet selbst nichts aus.

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang, WEEKDAY_LABEL, levelLabelI18n } from '@/lib/i18n';
import type { ScheduleCourse } from '@/lib/schedule';

/* ----------------------------------------------------------------------------
 * Mikro-Lexikon der Kurs-Zeile. Steht bewusst hier und nicht in src/lib/i18n.tsx:
 * es sind Begriffe, die nur an dieser Zeile haengen. CourseEngine importiert sie,
 * damit /kursplan und Startseite garantiert dieselben Woerter zeigen.
 * -------------------------------------------------------------------------- */
export const ROW_COPY = {
  de: {
    full: 'Ausgebucht',
    free: 'Plätze frei',
    book: 'Platz sichern',
    waitlist: 'Auf Warteliste',
    lateEntry: 'Quereinstieg möglich',
    beginner: 'Ideal zum Einsteigen',
    teacherTba: 'Lehrer folgt',
    until: 'bis',
  },
  en: {
    full: 'Fully booked',
    free: 'Spots available',
    book: 'Book your spot',
    waitlist: 'Join waitlist',
    lateEntry: 'Late entry possible',
    beginner: 'Ideal for starting',
    teacherTba: 'Teacher to be announced',
    until: 'until',
  },
} as const;

/* Die Nachschlag-Tabellen werden mit einem BELIEBIGEN Namen aus der API befragt (Lehrer-
 * Vorname, Stil-Schluessel). Ein `satisfies` wuerde den Typ auf die bekannten Schluessel
 * verengen und das Nachschlagen unmoeglich machen (TS7053). Darum die Owner-Funktion
 * `definePhotoLookup`: sie benennt den Vertrag "offenes Woerterbuch, Wert ist ein Bildpfad"
 * genau einmal, statt ihn an jeder Konstante als roher Record-Typ zu wiederholen. */
type PhotoLookup = Record<string, string>;

function definePhotoLookup(photos: PhotoLookup): PhotoLookup {
  return photos;
}

const TEACHER_PHOTOS = definePhotoLookup({
  aleks: '/photos/team/teacher-aleksandra.webp',
  aleksandra: '/photos/team/teacher-aleksandra.webp',
  claudia: '/photos/founders/claudia.webp',
  fabio: '/photos/founders/fabio.webp',
  jelena: '/photos/team/teacher-jelena.webp',
  maarten: '/photos/team/teacher-maarten.webp',
  sebas: '/photos/founders/sebastian.webp',
  sebastian: '/photos/founders/sebastian.webp',
  tobi: '/photos/team/teacher-tobias.webp',
  tobias: '/photos/team/teacher-tobias.webp',
  vanessa: '/photos/founders/vanessa.webp',
});

const STYLE_PHOTOS = definePhotoLookup({
  bachata: '/photos/premium/offer-bachata-800.webp',
  heels: '/photos/premium/offer-heels-800.webp',
  salsa: '/photos/premium/offer-salsa-800.webp',
});

export function portraitFor(teacher: ScheduleCourse['teachers'][number] | undefined, styleKey: string) {
  if (teacher?.photoUrl) return { src: teacher.photoUrl, named: true };
  const name = teacher?.displayName.trim().toLowerCase();
  const teacherPhoto = name ? TEACHER_PHOTOS[name] : undefined;
  if (teacherPhoto) return { src: teacherPhoto, named: true };
  return { src: STYLE_PHOTOS[styleKey] ?? '/photos/premium/offer-salsa-800.webp', named: false };
}

/* ----------------------------------------------------------------------------
 * Der Zeit-Block: die linke Kalender-Spalte (Datum, 2rem-Uhr mit rotem Punkt, "bis 19:30")
 * plus die weisse Karte rechts, in der die Kurs-Zeilen sitzen.
 * -------------------------------------------------------------------------- */
export function CourseTimeBlock({
  start,
  end,
  dateLabel,
  children,
}: {
  start: string;
  end: string;
  /** Fertige Beschriftung ueber der Uhr ("Mi 26. Aug."). Ohne Datum weglassen. */
  dateLabel?: string | null;
  children: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <div className="grid gap-1.5 border-b border-[var(--color-line)] py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5 sm:py-5 lg:grid-cols-[10rem_minmax(0,1fr)]">
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:block sm:self-stretch sm:border-r sm:border-[var(--color-line)] sm:pr-5">
        {/* Das Datum steht ueber der Uhr — erst WANN, dann um wie viel Uhr. Fett und in
            Ink, damit es dieselbe Ebene traegt wie die Uhrzeit und nicht als Beschriftung
            gelesen wird. Mobil laeuft es in derselben Zeile mit, damit die Kopfzeile des
            Blocks nicht auf drei Zeilen waechst. */}
        {dateLabel ? (
          <span className="order-first w-full text-sm font-bold text-[var(--color-ink)] sm:mb-1.5 sm:block">
            {dateLabel}
          </span>
        ) : null}
        {/* Ohne tabular-nums: Cal Sans reserviert sonst Ziffernbreite fuer den Doppelpunkt
            — die Uhr las sich als "18 : 30" (Critic Runde 14, Item 2). */}
        <span className="inline-flex items-center gap-2 font-display text-[2rem] font-extrabold leading-none text-[var(--color-ink)]">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--color-salsa)]" />
          {start}
        </span>
        <span className="text-sm font-semibold tabular-nums text-[var(--color-ink-muted)] sm:ml-4 sm:mt-1.5 sm:block">
          {ROW_COPY[lang].until} {end}
        </span>
      </p>
      <div className="min-w-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white">
        {children}
      </div>
    </div>
  );
}

/** Metadaten bleiben neutral. Salsa-Rot markiert nur die erste Buchungsaktion. */
export function CourseBadge({
  tone,
  children,
}: {
  tone: 'strong' | 'level' | 'muted' | 'outline';
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        // R188 KP3: Jeder Ton bekommt eine Rot-Fassung. Ohne die blieben auf der roten
        // Zeile weisse und graue Kaestchen stehen und die Karte waere nur halb gefaerbt —
        // genau das Fleckige, das Raphael im Video "nicht ganz rot" nennen wuerde.
        // Auf Rot traegt jede Badge dieselbe Sprache: 1px weisser Rand bei 45 %,
        // Schrift Weiss, keine eigene Fuellung. Die "Plaetze frei"-Badge (tone strong)
        // dreht sich um: sie ist auf Papier die dunkle und auf Rot die weisse Flaeche,
        // damit sie in beiden Zustaenden die auffaelligste bleibt.
        'inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors',
        tone === 'strong'
          && 'bg-[var(--color-ink)] text-white group-hover:bg-white group-hover:text-[var(--color-salsa)] group-focus-within:bg-white group-focus-within:text-[var(--color-salsa)] group-data-[hot=true]:bg-white group-data-[hot=true]:text-[var(--color-salsa)]',
        tone === 'level'
          && 'bg-[var(--color-bg-soft)] font-semibold text-[var(--color-ink)] group-hover:bg-white/15 group-hover:text-white group-focus-within:bg-white/15 group-focus-within:text-white group-data-[hot=true]:bg-white/15 group-data-[hot=true]:text-white',
        tone === 'muted'
          && 'bg-[var(--color-bg-soft)] text-[var(--color-ink-muted)] group-hover:bg-white/15 group-hover:text-white group-focus-within:bg-white/15 group-focus-within:text-white group-data-[hot=true]:bg-white/15 group-data-[hot=true]:text-white',
        tone === 'outline'
          && 'border border-[var(--color-line)] bg-white text-[var(--color-ink-muted)] group-hover:border-white/45 group-hover:bg-transparent group-hover:text-white group-focus-within:border-white/45 group-focus-within:bg-transparent group-focus-within:text-white group-data-[hot=true]:border-white/45 group-data-[hot=true]:bg-transparent group-data-[hot=true]:text-white',
      )}
    >
      {children}
    </span>
  );
}

export function TeacherPortrait({
  styleKey,
  style,
  teachers,
}: {
  styleKey: string;
  style: string;
  teachers: ScheduleCourse['teachers'];
}) {
  const shown = (teachers.length ? teachers : [undefined]).slice(0, 2);

  return (
    <span aria-hidden data-style-mark={styleKey} className="flex h-14 w-[4.5rem] shrink-0 items-end">
      {shown.map((teacher, index) => {
        const portrait = portraitFor(teacher, styleKey);
        return (
          <span
            key={teacher?.id ?? `${styleKey}-studio`}
            title={portrait.named ? teacher?.displayName : style}
            className={cn(
              // R188 KP3: Der 2px-Trennring bleibt weiss — auf der roten Hover-Flaeche
              // liest er sich als saubere Kontur um das Portrait statt als heller Fleck,
              // und er trennt die beiden gestapelten Koepfe weiterhin voneinander.
              'relative h-14 w-12 overflow-hidden rounded-[1rem] border-2 border-white bg-[var(--color-bg-soft)] transition-colors',
              index > 0 && '-ml-5 h-12',
            )}
          >
            <img
              src={portrait.src}
              alt=""
              loading="lazy"
              // object-cover statt contain: die Freisteller sind Ganzkoerper-Fotos —
              // contain steckte Mini-Figuren in die 48x56-Kachel, cover+top zeigt das
              // Gesicht (Critic 13.08.2026).
              className={cn('h-full w-full object-cover', portrait.named && 'object-top')}
            />
          </span>
        );
      })}
    </span>
  );
}

export type CourseRowProps = {
  course: ScheduleCourse;
  /** Ziel des Klicks. /kursplan bucht direkt, die Startseite fuehrt in den Plan. */
  href: string;
  /** Ausgebucht heisst je nach Aufrufer etwas anderes (eine Staffel vs. alle Staffeln des
   *  Slots). Deshalb kommt der fertige Wahrheitswert von aussen, nicht aus `course.status`. */
  full: boolean;
  lateEntry?: boolean;
  /** Zusatz-Badge fuer einen Zustand, den nur der Aufrufer kennt (z. B. "Ausgebucht, wieder
   *  frei ab 9. Sep." auf der Startseite). */
  extraBadge?: string | null;
  /** Wochentag statt Ort in der Unterzeile. Die Startseite zeigt mehrere Tage untereinander
   *  und braucht den Tag; im Kalender steht er schon ueber dem Block. */
  showWeekday?: boolean;
  /** Attribute, die der Klicktest von /kursplan liest. Unveraendert durchgereicht. */
  dataAttrs?: Record<string, string | undefined>;
};

/* ----------------------------------------------------------------------------
 * Die Kurs-Zeile. Die GANZE Zeile ist das Klickziel, der CTA ist deshalb ein <span>
 * (kein verschachtelter Link/Button). Das Lehrpersonen-Portrait gibt jeder Zeile einen
 * eigenen visuellen Anker, auch wenn die API kein Foto liefert.
 * -------------------------------------------------------------------------- */
export function CourseRow({
  course,
  href,
  full,
  lateEntry = false,
  extraBadge = null,
  showWeekday = false,
  dataAttrs,
}: CourseRowProps) {
  const { lang } = useLang();
  const c = ROW_COPY[lang];
  const level = levelLabelI18n(lang === 'de' ? course.levelDe : course.levelEn, course.onVariant);
  const style = lang === 'de' ? course.styleDe : course.styleEn;
  const teachers = course.teachers.map((tea) => tea.displayName.split(' ')[0]).join(' & ');
  const label = full ? c.waitlist : c.book;
  const beginner = course.levelCategory === 'beginner';
  const weekdayLabel = WEEKDAY_LABEL[lang][course.weekday]?.long ?? course.weekday;
  const [hot, setHot] = useState(false);

  return (
    <a
      href={href}
      data-testid="course-card"
      data-hot={hot ? 'true' : 'false'}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      {...dataAttrs}
      className={cn(
        // R188 KP3 (Raphael 21.08., Video 07:52): "Wenn ich mit der Maus drueber gehe,
        // soll die GANZE Karte rot werden — passend zum Platz-reservieren-Look."
        //
        // VORHER wechselte nur die Textfarbe des CTA rechts; die Zeile selbst ging auf
        // ein helles Grau. Man sah nicht, dass die ganze Zeile das Klickziel ist.
        //
        // JETZT faerbt `group-hover` die komplette Flaeche auf --color-salsa (#AD1827,
        // das Marken-Rot aus index.css — KEIN Pastellrot, Raphael-Lock 17.08.). Jede
        // Textebene darin invertiert mit: Titel, Lehrer-Zeile, CTA auf Weiss, die
        // Badges auf halbtransparentes Weiss. Der gemessene Kontrast Weiss auf #AD1827
        // ist 7.4:1 und damit ueber WCAG AA fuer Fliesstext (4.5:1).
        //
        // `focus-within` haengt am selben Zustand: wer mit der Tastatur durch die Liste
        // geht, sieht dieselbe Fuellung wie mit der Maus. Ohne das waere die Rueckmeldung
        // eine reine Maus-Funktion.
        //
        // duration/reducedMotion: die Faerbung laeuft ueber `transition-colors` mit
        // --dur-fast. Bei `prefers-reduced-motion: reduce` schaltet index.css die Dauer
        // global auf 0.01ms — die Farbe springt dann, sie verschwindet nicht.
        'group flex flex-col gap-2 border-b border-[var(--color-line)] px-4 py-3 transition-colors duration-[var(--dur-fast)] last:border-b-0 hover:border-[var(--color-salsa)] hover:bg-[var(--color-salsa)] focus-within:border-[var(--color-salsa)] focus-within:bg-[var(--color-salsa)] sm:flex-row sm:items-center sm:gap-5 sm:px-5 sm:py-3.5',
        hot
          ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)]'
          : beginner
            ? 'bg-[var(--color-paper-warm)]'
            : 'bg-white',
      )}
    >
      <span className="flex min-w-0 flex-1 items-start gap-3">
        <TeacherPortrait styleKey={course.styleKey} style={style} teachers={course.teachers} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span
              data-course-title
              className={cn(
                'font-display text-lg leading-tight transition-colors sm:text-xl',
                hot
                  ? 'text-white'
                  : 'text-[var(--color-ink)] group-hover:text-white group-focus-within:text-white',
              )}
            >
              {style}
            </span>
            {level && <CourseBadge tone="level">{level}</CourseBadge>}
          </span>
          <span
            className={cn(
              'mt-1 block break-words text-sm leading-snug transition-colors',
              hot
                ? 'text-white/85'
                : 'text-[var(--color-ink-muted)] group-hover:text-white/85 group-focus-within:text-white/85',
            )}
          >
            {showWeekday ? `${weekdayLabel} · ` : ''}
            {teachers || c.teacherTba} · {course.locationName}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <CourseBadge tone={full ? 'muted' : 'strong'}>{full ? c.full : c.free}</CourseBadge>
            {extraBadge && <CourseBadge tone="muted">{extraBadge}</CourseBadge>}
            {beginner && <CourseBadge tone="outline">{c.beginner}</CourseBadge>}
            {lateEntry && <CourseBadge tone="outline">{c.lateEntry}</CourseBadge>}
          </span>
        </span>
      </span>
      {/* Kritik-Runde 10.08.2026: vorher trug NUR die erste Zeile des Tages einen roten
          Pill-CTA, alle weiteren einen Textlink — sah aus wie zwei Buchungs-Systeme.
          Jetzt EIN ruhiger Zeilen-CTA fuer alle; die rote Hauptaktion gehoert dem
          ScheduleBottomCta bzw. dem Sektions-Knopf der Startseite. */}
      {/* R188 KP3: Auf der roten Flaeche kann der CTA nicht mehr rot werden — er wuerde
          verschwinden. Er wird weiss, wie der Rest der Zeile. */}
      <span
        data-course-cta
        className={cn(
          'inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 self-start px-1 text-sm font-semibold transition-colors sm:self-center',
          hot
            ? 'text-white'
            : 'text-[var(--color-ink)] group-hover:text-white group-focus-within:text-white',
        )}
      >
        {label}
        <ArrowRight size={16} strokeWidth={2} aria-hidden className="transition-transform duration-[var(--dur-fast)] ease-out group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
