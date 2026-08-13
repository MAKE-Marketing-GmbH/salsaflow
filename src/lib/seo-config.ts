import type { Lang } from '@/lib/i18n';

/** Verbindliche Produktions-Origin. Keine Canonicals oder Schema-IDs auf Preview-Hosts. */
export const SITE_ORIGIN = 'https://www.salsaflow-dc.com' as const;
export const SITE_NAME = 'Salsaflow Dance Company' as const;
export const BUSINESS_ID = `${SITE_ORIGIN}/#business` as const;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website` as const;

export type SeoKey =
  | 'home'
  | 'courses'
  | 'schedule'
  | 'events'
  | 'shows'
  | 'team'
  | 'photos'
  | 'contact'
  | 'more'
  | 'impressum'
  | 'datenschutz'
  | 'salsa'
  | 'bachata'
  | 'heels'
  | 'privatstunden'
  | 'kursaufbau'
  | 'preise'
  | 'danceflow'
  | 'anniversary'
  | 'floweekend'
  | 'eventkalender'
  | 'standort'
  | 'collabs'
  | 'tanzschuhe'
  | 'partys'
  | 'faq'
  | 'admin'
  | 'booking'
  | 'bookingStatus'
  | 'notFound';

export type Meta = {
  title: string;
  description: string;
};

export type SeoRouteConfig = {
  canonicalPath: `/${string}` | '/';
  indexable: boolean;
};

export const SEO_ROUTE_CONFIG: Record<SeoKey, SeoRouteConfig> = {
  home: { canonicalPath: '/', indexable: true },
  courses: { canonicalPath: '/tanzkurse', indexable: true },
  salsa: { canonicalPath: '/tanzkurse/salsa', indexable: true },
  bachata: { canonicalPath: '/tanzkurse/bachata', indexable: true },
  heels: { canonicalPath: '/tanzkurse/heels', indexable: true },
  privatstunden: { canonicalPath: '/privatstunden', indexable: true },
  kursaufbau: { canonicalPath: '/kursaufbau', indexable: true },
  preise: { canonicalPath: '/preise', indexable: true },
  shows: { canonicalPath: '/shows-animationen', indexable: true },
  events: { canonicalPath: '/events', indexable: true },
  danceflow: { canonicalPath: '/events-workshops/danceflow-night', indexable: true },
  anniversary: { canonicalPath: '/events-workshops/anniversary-weekend', indexable: true },
  floweekend: { canonicalPath: '/events-workshops/floweekend', indexable: true },
  eventkalender: { canonicalPath: '/events-workshops/eventkalender', indexable: true },
  team: { canonicalPath: '/team', indexable: true },
  photos: { canonicalPath: '/fotos', indexable: true },
  contact: { canonicalPath: '/kontakt', indexable: true },
  standort: { canonicalPath: '/kontakt/standort-raumvermietung', indexable: true },
  more: { canonicalPath: '/mehr', indexable: true },
  collabs: { canonicalPath: '/mehr/collabs', indexable: true },
  tanzschuhe: { canonicalPath: '/mehr/tanzschuhe', indexable: true },
  partys: { canonicalPath: '/mehr/partys', indexable: true },
  faq: { canonicalPath: '/faq', indexable: true },
  impressum: { canonicalPath: '/impressum', indexable: true },
  datenschutz: { canonicalPath: '/datenschutz', indexable: true },
  schedule: { canonicalPath: '/kursplan', indexable: true },
  admin: { canonicalPath: '/admin', indexable: false },
  booking: { canonicalPath: '/buchung', indexable: false },
  bookingStatus: { canonicalPath: '/buchung', indexable: false },
  notFound: { canonicalPath: '/404', indexable: false },
};

export const DEFAULT_SOCIAL_IMAGE = {
  url: `${SITE_ORIGIN}/photos/showcase/hp-05.webp`,
  width: 1800,
  height: 1200,
  type: 'image/webp',
  alt: {
    de: 'Zwei Tanzpaare der Salsaflow Dance Company in Bewegung',
    en: 'Two dancing couples from Salsaflow Dance Company',
  },
} as const;

/** Kompatibler String-Export für bestehende Importe. */
export const SOCIAL_IMAGE = DEFAULT_SOCIAL_IMAGE.url;

export const SEO_META: Record<SeoKey, Record<Lang, Meta>> = {
  home: {
    de: {
      title: 'Tanzschule Basel: Salsa, Bachata & Heels | Salsaflow',
      description:
        'Salsa, Bachata und Heels tanzen in Basel: Gratis Schnupperstunde, Kurse für jedes Level, direkt am Bahnhof SBB und auch ohne Tanzpartner möglich.',
    },
    en: {
      title: 'Dance School Basel: Salsa, Bachata & Heels | Salsaflow',
      description:
        'Learn Salsa, Bachata and Heels in Basel, in a community that knows your name. Come alone or as a pair. Your first trial class is free.',
    },
  },
  courses: {
    de: {
      title: 'Tanzkurse Basel: Salsa, Bachata & Heels | Salsaflow',
      description:
        'Alle laufenden und kommenden Tanzkurse auf einen Blick. Salsa, Bachata und Heels für verschiedene Levels, direkt am Bahnhof Basel SBB.',
    },
    en: {
      title: 'Dance Classes Basel: Salsa, Bachata & Heels | Salsaflow',
      description:
        'All current and upcoming classes at a glance. Salsa, Bachata and Heels for different levels, right by Basel SBB station.',
    },
  },
  schedule: {
    de: {
      title: 'Kursplan für Tanzkurse in Basel | Salsaflow',
      description:
        'Der ganze Kursplan auf einen Blick. Filtere Salsa, Bachata und Heels nach Tag, Stil und Level. Gratis Schnupperstunden sind jederzeit möglich.',
    },
    en: {
      title: 'Dance Class Schedule in Basel | Salsaflow',
      description:
        'The full schedule at a glance. Filter Salsa, Bachata and Heels by day, style and level. Free trial classes are available at any time.',
    },
  },
  events: {
    de: {
      title: 'Events & Danceflow Nights in Basel | Salsaflow',
      description:
        'Danceflow Night am 1., 3. und 5. Freitag im Monat, dazu Workshops und besondere Wochenenden bei Salsaflow Basel.',
    },
    en: {
      title: 'Events & Danceflow Nights in Basel | Salsaflow',
      description:
        'Danceflow Night on the first, third and fifth Friday of each month, plus workshops and special weekends at Salsaflow Basel.',
    },
  },
  shows: {
    de: {
      title: 'Tanzshows & Animationen in Basel | Salsaflow',
      description:
        'Salsaflow bringt Latin Dance Shows, Workshops und Animationen an Firmenanlässe, Hochzeiten, Polterabende und Geburtstage.',
    },
    en: {
      title: 'Dance Shows & Event Animation in Basel | Salsaflow',
      description:
        'Salsaflow brings Latin dance shows, workshops and animation to company events, weddings, stag and hen parties and birthdays.',
    },
  },
  team: {
    de: {
      title: 'Team der Salsaflow Dance Company Basel',
      description:
        'Lern die vier Gründer und das Team hinter rund 40 Kursen pro Woche in drei Studios direkt am Bahnhof Basel SBB kennen.',
    },
    en: {
      title: 'Salsaflow Dance Company Team in Basel',
      description:
        'Meet the four founders and the team behind around 40 weekly classes in three studios right by Basel SBB station.',
    },
  },
  photos: {
    de: {
      title: 'Fotos aus Kursen & Events | Salsaflow Basel',
      description:
        'Momente von unserer Tanzfläche. Tanzabende und Kurse. So fühlt sich Salsaflow an, wenn die Musik läuft.',
    },
    en: {
      title: 'Photos from Classes & Events | Salsaflow Basel',
      description:
        'Moments from our dance floor. Dance nights and courses. This is what Salsaflow feels like when the music plays.',
    },
  },
  contact: {
    de: {
      title: 'Kontakt zur Tanzschule Salsaflow Basel',
      description:
        'Schreib uns deine Frage zu Kursen, zur Schnupperstunde oder zur Raumvermietung. Drei Studios direkt am Bahnhof Basel SBB.',
    },
    en: {
      title: 'Contact Salsaflow Dance School Basel',
      description:
        'Send us your question about courses, a trial class or room rental. Three studios right at Basel SBB station.',
    },
  },
  more: {
    de: {
      title: 'FAQ, Collabs & Partys | Salsaflow Basel',
      description:
        'Häufige Fragen zu Kursen, Levels und Anmeldung, unsere Partner für Tanzschuhe und Bekleidung und wo die Danceflow Nights in Basel laufen.',
    },
    en: {
      title: 'FAQ, Collabs & Parties | Salsaflow Basel',
      description:
        'Common questions about courses, levels and signing up, our partners for dance shoes and wear, and where the Danceflow Nights happen in Basel.',
    },
  },
  impressum: {
    de: {
      title: 'Impressum | Salsaflow Dance Company',
      description: 'Angaben zur Betreiberin dieser Website, der Salsaflow Dance Company in Basel.',
    },
    en: {
      title: 'Imprint | Salsaflow Dance Company',
      description: 'Information about the operator of this website, Salsaflow Dance Company in Basel.',
    },
  },
  datenschutz: {
    de: {
      title: 'Datenschutz | Salsaflow Dance Company',
      description:
        'Wie wir mit deinen Daten umgehen. Einfach erklärt, welche Daten wir erheben und welche Rechte du hast.',
    },
    en: {
      title: 'Privacy | Salsaflow Dance Company',
      description: 'How we handle your data. Explained simply: which data we collect and which rights you have.',
    },
  },
  salsa: {
    de: {
      title: 'Salsa Kurs Basel: Alle Levels | Salsaflow',
      description:
        'Salsa tanzen lernen in Basel: mit Gratis Schnupperstunde, klaren Levels, Social-Dance-Fokus und Einstieg auch ohne Tanzpartner.',
    },
    en: {
      title: 'Salsa Classes Basel: All Levels | Salsaflow',
      description:
        'Learn to dance Salsa in Basel with a free trial class, a clear course structure, a social-dance focus and no dance partner required.',
    },
  },
  bachata: {
    de: {
      title: 'Bachata Kurs Basel: Sensual lernen | Salsaflow',
      description:
        'Bachata lernen in Basel: von den Basics bis zu Connection, Technik und Flow. Gratis Schnupperstunde bei Salsaflow am Bahnhof SBB.',
    },
    en: {
      title: 'Bachata Classes Basel: Learn Sensual | Salsaflow',
      description:
        'Learn Bachata in Basel: from the basics to connection, technique and flow. Free trial class at Salsaflow by the SBB station.',
    },
  },
  heels: {
    de: {
      title: 'Heels Kurs Basel: Technik & Ausdruck | Salsaflow',
      description:
        'Heels tanzen in Basel: Lerne Ausdruck, Linien, Haltung und sichere Technik in einem unterstützenden Kursumfeld bei Salsaflow.',
    },
    en: {
      title: 'Heels Classes Basel: Technique & Expression | Salsaflow',
      description:
        'Dance in heels in Basel: learn expression, lines, posture and safe technique in a supportive class environment at Salsaflow.',
    },
  },
  privatstunden: {
    de: {
      title: 'Private Tanzstunden in Basel | Salsaflow',
      description:
        'Private Tanzstunden in Basel für Technik, Stil, Hochzeitstanz oder gezielte Vorbereitung. Persönlich, flexibel und direkt am Bahnhof SBB.',
    },
    en: {
      title: 'Private Dance Lessons in Basel | Salsaflow',
      description:
        'Private dance lessons in Basel for technique, style, wedding dance or focused preparation. Personal, flexible and right by the SBB station.',
    },
  },
  kursaufbau: {
    de: {
      title: 'Kursaufbau & Levels | Salsaflow Basel',
      description:
        'So funktionieren die Levels bei Salsaflow: Salsa und Bachata mit Stufen und Flow-Kursen, Heels mit drei Levels sowie persönliche Einstiegshilfe.',
    },
    en: {
      title: 'Course Structure & Levels | Salsaflow Basel',
      description:
        'How Salsaflow levels work: numbered Salsa and Bachata stages with Flow classes, three Heels levels and personal help choosing where to start.',
    },
  },
  preise: {
    de: {
      title: 'Preise für Tanzkurse & Privatstunden | Salsaflow',
      description:
        'Alle Preise für reguläre Kurse, Paare, Studierende, Workshops, Privatstunden, Salsaflow Pass und Danceflow Night bei Salsaflow Basel.',
    },
    en: {
      title: 'Dance Class & Private Lesson Prices | Salsaflow',
      description:
        'All prices for regular courses, couples, students, workshops, private lessons, the Salsaflow Pass and the Danceflow Night at Salsaflow Basel.',
    },
  },
  danceflow: {
    de: {
      title: 'Danceflow Night Basel: Salsa & Bachata | Salsaflow',
      description:
        'Danceflow Night bei Salsaflow: Salsa und Bachata Social in Basel am 1., 3. und 5. Freitag im Monat. Gäste sind willkommen.',
    },
    en: {
      title: 'Danceflow Night Basel: Salsa & Bachata | Salsaflow',
      description:
        'Danceflow Night at Salsaflow: a Salsa and Bachata social in Basel on the first, third and fifth Friday of each month. Guests are welcome.',
    },
  },
  anniversary: {
    de: {
      title: 'Anniversary Weekend | Salsaflow Dance Company Basel',
      description:
        'Das Anniversary Weekend von Salsaflow: Workshops, Shows, Socials und Community-Momente in Basel.',
    },
    en: {
      title: 'Anniversary Weekend | Salsaflow Dance Company Basel',
      description:
        'The Anniversary Weekend by Salsaflow: workshops, shows, socials and community moments in Basel.',
    },
  },
  floweekend: {
    de: {
      title: 'Floweekend Basel: Workshops & Socials | Salsaflow',
      description:
        'Floweekend bei Salsaflow: intensiver lernen, tanzen und Community erleben mit Workshops und Social-Dance-Momenten in Basel.',
    },
    en: {
      title: 'Floweekend Basel: Workshops & Socials | Salsaflow',
      description:
        'Floweekend at Salsaflow: learn, dance and experience community more intensely, with workshops and social-dance moments in Basel.',
    },
  },
  eventkalender: {
    de: {
      title: 'Eventkalender für Salsa & Bachata | Salsaflow Basel',
      description:
        'Danceflow Night, Workshops und Weekends bei Salsaflow Basel: fester Monatsrhythmus und eine ehrliche Übersicht der Eventformate.',
    },
    en: {
      title: 'Salsa & Bachata Event Calendar | Salsaflow Basel',
      description:
        'Danceflow Night, workshops and weekends at Salsaflow Basel: the regular monthly schedule and a clear overview of each event format.',
    },
  },
  standort: {
    de: {
      title: 'Standort & Raumvermietung | Salsaflow Basel',
      description:
        'Salsaflow Studios direkt am Bahnhof Basel SBB: Anfahrt, Standort und Raumvermietung für Tanz, Workshops, Proben und Bewegung.',
    },
    en: {
      title: 'Location & Room Rental | Salsaflow Basel',
      description:
        'Salsaflow studios right by Basel SBB station: how to get there, location and room rental for dance, workshops, rehearsals and movement.',
    },
  },
  collabs: {
    de: {
      title: 'Collabs & Partner | Salsaflow Basel',
      description:
        'Partner, Empfehlungen und Kooperationen von Salsaflow: Tanzschuhe, die Salsaflow-Kollektion und transparente Hinweise für Tänzer:innen.',
    },
    en: {
      title: 'Collabs & Partners | Salsaflow Basel',
      description:
        'Salsaflow partners, recommendations and collaborations: dance shoes, the Salsaflow collection and transparent guidance for dancers.',
    },
  },
  tanzschuhe: {
    de: {
      title: 'Tanzschuhe für Salsa, Bachata & Heels | Salsaflow',
      description:
        'Welche Tanzschuhe passen zu Salsa, Bachata und Heels? Salsaflow erklärt, worauf Anfänger achten sollten und verlinkt hilfreiche Partner.',
    },
    en: {
      title: 'Dance Shoes for Salsa, Bachata & Heels | Salsaflow',
      description:
        'Which dance shoes suit Salsa, Bachata and Heels? Salsaflow explains what beginners should look for and links helpful partners.',
    },
  },
  partys: {
    de: {
      title: 'Salsa- & Bachata-Partys in Basel | Salsaflow',
      description:
        'Finde Salsaflow Danceflow Nights und weitere Salsa-/Bachata-Partys in Basel. Tipps für den ersten Social-Dance-Abend.',
    },
    en: {
      title: 'Salsa & Bachata Parties in Basel | Salsaflow',
      description:
        'Find Salsaflow Danceflow Nights and more Salsa and Bachata parties in Basel. Tips for your first social-dance evening.',
    },
  },
  faq: {
    de: {
      title: 'FAQ zu Tanzkursen & Events | Salsaflow Basel',
      description:
        'Antworten zu Schnupperstunde, Tanzpartner, Level, Preisen, Schuhen, Kursablauf, Events und Kontakt bei Salsaflow Basel.',
    },
    en: {
      title: 'Dance Class & Event FAQ | Salsaflow Basel',
      description:
        'Answers about the trial class, dance partner, levels, prices, shoes, how courses run, events and contact at Salsaflow Basel.',
    },
  },
  admin: {
    de: {
      title: 'Admin | Salsaflow Dance Company',
      description: 'Geschützter Verwaltungsbereich der Salsaflow Dance Company.',
    },
    en: {
      title: 'Admin | Salsaflow Dance Company',
      description: 'Protected administration area of the Salsaflow Dance Company.',
    },
  },
  booking: {
    de: {
      title: 'Platz reservieren | Salsaflow Dance Company',
      description: 'Reserviere deinen Platz im Tanzkurs bei der Salsaflow Dance Company.',
    },
    en: {
      title: 'Reserve your spot | Salsaflow Dance Company',
      description: 'Reserve your spot in a dance class at the Salsaflow Dance Company.',
    },
  },
  bookingStatus: {
    de: {
      title: 'Buchungsstatus | Salsaflow Dance Company',
      description: 'Status deiner Kursbuchung bei der Salsaflow Dance Company.',
    },
    en: {
      title: 'Booking Status | Salsaflow Dance Company',
      description: 'Status of your course booking at the Salsaflow Dance Company.',
    },
  },
  notFound: {
    de: {
      title: 'Seite nicht gefunden | Salsaflow Dance Company',
      description: 'Diese Seite gibt es nicht. Zurück zur Startseite oder direkt den passenden Tanzkurs finden.',
    },
    en: {
      title: 'Page Not Found | Salsaflow Dance Company',
      description: 'This page does not exist. Return home or find the right dance course directly.',
    },
  },
};

export function canonicalUrlFor(page: SeoKey): string {
  return `${SITE_ORIGIN}${SEO_ROUTE_CONFIG[page].canonicalPath}`;
}
