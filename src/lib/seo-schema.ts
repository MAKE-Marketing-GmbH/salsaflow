import scheduleRaw from '../../db/seed/public-schedule.json?raw';
import type { Lang } from '@/lib/i18n';
import {
  BUSINESS_ID,
  DEFAULT_SOCIAL_IMAGE,
  SEO_META,
  SEO_ROUTE_CONFIG,
  SITE_NAME,
  SITE_ORIGIN,
  WEBSITE_ID,
  canonicalUrlFor,
  type Meta,
  type SeoKey,
} from '@/lib/seo-config';

type JsonLdNode = Record<string, unknown>;
type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
type CourseStyleKey = 'salsa' | 'bachata' | 'heels';
type CoursePageKey = 'courses' | 'schedule' | CourseStyleKey;
type EventPageKey = 'events' | 'danceflow' | 'anniversary' | 'floweekend' | 'eventkalender';

type ScheduleTerm = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  phase: string;
};

type ScheduleCourse = {
  id: string;
  termId: string;
  styleKey: string;
  styleDe: string;
  styleEn: string;
  levelDe: string;
  levelEn: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  locationName: string;
  status: string;
};

type PublicSchedule = {
  terms: ScheduleTerm[];
  courses: ScheduleCourse[];
};

type ConfirmedEvent = {
  page: EventPageKey;
  id: string;
  urlPath: `/${string}`;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  startDate: string;
  endDate?: string;
  locationName: string;
  imageUrl?: string;
};

const scheduleSource: unknown = scheduleRaw;
const schedule = (typeof scheduleSource === 'string' ? JSON.parse(scheduleSource) : scheduleSource) as PublicSchedule;

const COURSE_PAGES = new Set<SeoKey>(['courses', 'schedule', 'salsa', 'bachata', 'heels']);
const EVENT_PAGES = new Set<SeoKey>(['events', 'danceflow', 'anniversary', 'floweekend', 'eventkalender']);

const COURSE_STYLE_PAGE: Record<CourseStyleKey, CourseStyleKey> = {
  salsa: 'salsa',
  bachata: 'bachata',
  heels: 'heels',
};

const COURSE_STYLES_BY_PAGE: Record<CoursePageKey, readonly CourseStyleKey[]> = {
  courses: ['salsa', 'bachata', 'heels'],
  schedule: ['salsa', 'bachata', 'heels'],
  salsa: ['salsa'],
  bachata: ['bachata'],
  heels: ['heels'],
};

const DAY_INDEX: Record<Weekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const SCHEMA_DAY: Record<Weekday, string> = {
  sun: 'https://schema.org/Sunday',
  mon: 'https://schema.org/Monday',
  tue: 'https://schema.org/Tuesday',
  wed: 'https://schema.org/Wednesday',
  thu: 'https://schema.org/Thursday',
  fri: 'https://schema.org/Friday',
  sat: 'https://schema.org/Saturday',
};

/**
 * Nur explizit bestätigte Einzeltermine gehören hier hinein. Die aktuelle Website nennt
 * Eventformate und Monatsrhythmen, aber keine verlässlichen Einzeltermine. Darum bleibt
 * die Liste leer und es wird bewusst kein Event-Markup mit erfundenem startDate erzeugt.
 */
const CONFIRMED_EVENTS: readonly ConfirmedEvent[] = [];

function zurichToday(): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function addUtcDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function utcDayIndex(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

function firstWeeklyOccurrence(term: ScheduleTerm, weekday: Weekday): string | null {
  const offset = (DAY_INDEX[weekday] - utcDayIndex(term.startDate) + 7) % 7;
  const firstDate = addUtcDays(term.startDate, offset);
  return firstDate <= term.endDate ? firstDate : null;
}

function localBusinessNode(): JsonLdNode {
  return {
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    legalName: 'Salsaflow Dance Company GmbH',
    description:
      'Tanzschule in Basel für Salsa, Bachata und Heels. 3 Studios am Bahnhof Basel SBB. Erste Schnupperstunde gratis.',
    url: SITE_ORIGIN,
    telephone: '+41764788411',
    email: 'info@salsaflow-dc.com',
    image: DEFAULT_SOCIAL_IMAGE.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Elisabethenanlage 7',
      postalCode: '4051',
      addressLocality: 'Basel',
      addressCountry: 'CH',
    },
    sameAs: ['https://www.instagram.com/salsaflowdc'],
  };
}

function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: SITE_NAME,
    inLanguage: ['de-CH', 'en'],
    publisher: { '@id': BUSINESS_ID },
  };
}

function webPageNode(page: SeoKey, lang: Lang, meta: Meta): JsonLdNode {
  const url = canonicalUrlFor(page);
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: lang === 'de' ? 'de-CH' : 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BUSINESS_ID },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: DEFAULT_SOCIAL_IMAGE.url,
      width: DEFAULT_SOCIAL_IMAGE.width,
      height: DEFAULT_SOCIAL_IMAGE.height,
      caption: DEFAULT_SOCIAL_IMAGE.alt[lang],
    },
  };
}

function isCoursePage(page: SeoKey): page is CoursePageKey {
  return COURSE_PAGES.has(page);
}

function courseStyleName(style: CourseStyleKey, lang: Lang): string {
  if (style === 'heels') return lang === 'de' ? 'Heels Tanzkurse in Basel' : 'Heels dance classes in Basel';
  return lang === 'de' ? `${style === 'salsa' ? 'Salsa' : 'Bachata'} Tanzkurse in Basel` : `${style === 'salsa' ? 'Salsa' : 'Bachata'} dance classes in Basel`;
}

function courseInstanceNode(course: ScheduleCourse, term: ScheduleTerm, lang: Lang) {
  const startDate = firstWeeklyOccurrence(term, course.weekday);
  if (!startDate) return null;

  const styleName = lang === 'de' ? course.styleDe : course.styleEn;
  const levelName = lang === 'de' ? course.levelDe : course.levelEn;
  const scheduleUrl = canonicalUrlFor('schedule');

  return {
    '@type': 'CourseInstance',
    '@id': `${scheduleUrl}#course-instance-${course.id}`,
    name: `${styleName} - ${levelName} - ${term.name}`,
    courseMode: 'onsite',
    inLanguage: lang === 'de' ? 'de-CH' : 'en',
    startDate,
    endDate: term.endDate,
    educationalLevel: levelName,
    location: {
      '@type': 'Place',
      name: course.locationName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Elisabethenanlage 7',
        postalCode: '4051',
        addressLocality: 'Basel',
        addressCountry: 'CH',
      },
    },
    courseSchedule: {
      '@type': 'Schedule',
      startDate,
      endDate: term.endDate,
      repeatFrequency: 'P1W',
      byDay: SCHEMA_DAY[course.weekday],
      startTime: course.startTime,
      endTime: course.endTime,
      scheduleTimezone: 'Europe/Zurich',
    },
  } satisfies JsonLdNode;
}

function courseNodes(page: SeoKey, lang: Lang): JsonLdNode[] {
  if (!isCoursePage(page)) return [];

  const today = zurichToday();
  const eligibleTerms = schedule.terms.filter(
    (term) => (term.phase === 'running' || term.phase === 'upcoming') && term.endDate >= today,
  );
  const termById = new Map(eligibleTerms.map((term) => [term.id, term]));

  return COURSE_STYLES_BY_PAGE[page].flatMap((style) => {
    const stylePage = COURSE_STYLE_PAGE[style];
    const matchingCourses = schedule.courses.filter(
      (course) => course.styleKey === style && course.status !== 'cancelled' && termById.has(course.termId),
    );
    if (matchingCourses.length === 0) return [];

    const instances = page === 'schedule'
      ? matchingCourses.flatMap((course) => {
          const term = termById.get(course.termId);
          if (!term) return [];
          const instance = courseInstanceNode(course, term, lang);
          return instance ? [instance] : [];
        })
      : [];

    return [
      {
        '@type': 'Course',
        '@id': `${canonicalUrlFor(stylePage)}#course`,
        url: canonicalUrlFor(stylePage),
        name: courseStyleName(style, lang),
        description: SEO_META[stylePage][lang].description,
        inLanguage: lang === 'de' ? 'de-CH' : 'en',
        provider: { '@id': BUSINESS_ID },
        ...(instances.length > 0 ? { hasCourseInstance: instances } : {}),
      },
    ];
  });
}

function hasIsoStartDate(event: ConfirmedEvent): boolean {
  return /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?(?:[+-]\d{2}:\d{2}|Z)?)?$/.test(event.startDate);
}

function eventNodes(page: SeoKey, lang: Lang): JsonLdNode[] {
  if (!EVENT_PAGES.has(page)) return [];

  return CONFIRMED_EVENTS.filter((event) => event.page === page && hasIsoStartDate(event)).map((event) => ({
    '@type': 'Event',
    '@id': `${SITE_ORIGIN}${event.urlPath}#event-${event.id}`,
    url: `${SITE_ORIGIN}${event.urlPath}`,
    name: event.name[lang],
    description: event.description[lang],
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    ...(event.imageUrl ? { image: [event.imageUrl] } : {}),
    location: {
      '@type': 'Place',
      name: event.locationName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Elisabethenanlage 7',
        postalCode: '4051',
        addressLocality: 'Basel',
        addressCountry: 'CH',
      },
    },
    organizer: { '@id': BUSINESS_ID },
  }));
}

export type SeoJsonLd = {
  '@context': 'https://schema.org';
  '@graph': JsonLdNode[];
};

/**
 * FAQPage- und BreadcrumbList-Markup wird weiterhin direkt bei den sichtbaren Inhalten
 * ausgegeben. Dadurch bleibt Frage/Antwort-Markup sichtbarkeitskonform und ohne Duplikate.
 * Die Home nutzt ihr bestehendes, gleich-ID-basiertes LocalBusiness-Schema.
 */
export function buildSeoJsonLd(page: SeoKey, lang: Lang, meta: Meta): SeoJsonLd | null {
  if (!SEO_ROUTE_CONFIG[page].indexable || page === 'home') return null;

  return {
    '@context': 'https://schema.org',
    '@graph': [localBusinessNode(), websiteNode(), webPageNode(page, lang, meta), ...courseNodes(page, lang), ...eventNodes(page, lang)],
  };
}
