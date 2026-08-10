// Inhalt der Seite Standort & Raumvermietung (/kontakt/standort-raumvermietung) aus dem
// V3-Copyplan (pages/19). Zweisprachig DE/EN, EIN Seiten-Component (StandortPage.tsx).
//
// Copy so nah wie moeglich am Plan-Wortlaut. Bewusste, dokumentierte Abweichung vom strikten
// 1:1: der Plan enthaelt interne Redaktions-Notizen und Platzhalter ("Adresse einfügen",
// "Raumdetails einfügen", "Nicht blind versprechen", "muss hier konsistent werden"). Solche
// Notizen sind Anweisungen an die Redaktion, kein Kunden-Text. Sie sind hier zur sauberen
// Kunden-Copy aufgeloest, nur mit GESICHERTEN Fakten aus dem Bau-Brief:
//  - Adresse: Salsaflow Dance Company GmbH, Elisabethenanlage 7, 4051 Basel
//  - 3 Studios direkt am Bahnhof Basel SBB, hell, mit Spiegeln (sitewide bestehende Aussagen)
// Keine erfundenen Zahlen (keine Quadratmeter, keine Kapazitaeten, keine Preise, keine
// spezifische Ausstattung ueber die bestehenden Aussagen hinaus). Kein eingebetteter
// Kartendienst: Adresse als Text + externer Google-Maps-Link (CONTACT.googleReviews).
//
// Echte Umlaute (ä ö ü), CH-ss (kein Eszett), keine Em-Dashes.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb, HeroCta } from '@/public/subpage/kit';

type Img = { src: string; alt: string };
type Info = { label: string; value: string };
type Studio = { name: string; text: string; image: Img };

export type StandortContent = {
  seo: SeoKey;
  crumbs: Crumb[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    primary: HeroCta;
    secondary: HeroCta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  anfahrt: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    infos: Info[];
    mapsCta: string;
  };
  studios: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    items: Studio[];
  };
  rental: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subline: string;
    suitedTitle: string;
    suited: string[];
    note: string;
    checklistTitle: string;
    checklist: string[];
    checklistMicro: string;
    cta: HeroCta;
  };
  closing: {
    title: string;
    titleAccent?: string;
    body: string;
    primary: HeroCta;
    secondary: HeroCta;
  };
  faqSection: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    items: Faq[];
  };
};

/* Interne Ziel-Routen. #raumvermietung belegt auf /kontakt das Anliegen-Dropdown vor. */
const R = {
  kontakt: '/kontakt',
  raumanfrage: '/kontakt#raumvermietung',
  anfahrt: '#anfahrt',
  mieten: '#mieten',
};

export const STANDORT: Record<Lang, StandortContent> = {
  de: {
    seo: 'standort',
    crumbs: [
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'Standort & Raumvermietung', href: '/kontakt/standort-raumvermietung' },
    ],
    hero: {
      eyebrow: 'Standort & Studios',
      title: 'Drei Studios direkt am Bahnhof Basel SBB.',
      lead: 'Salsaflow liegt direkt am Bahnhof Basel SBB. Unsere Studios sind zentral, hell und für Kurse, Workshops, Proben und Raumvermietung nutzbar.',
      primary: { label: 'Anfahrt öffnen', href: R.anfahrt },
      secondary: { label: 'Raum anfragen', href: R.mieten },
      microcopy: 'Für Raumvermietung bitte Datum, Zeitraum und Zweck nennen.',
      image: { src: '/photos/hero/hero-02.jpg', alt: 'Helles Salsaflow Studio direkt am Bahnhof Basel SBB' },
      cardLabel: 'Basel SBB',
      cardText: 'Drei Studios. Wenige Schritte vom Zug.',
    },
    anfahrt: {
      eyebrow: 'Anfahrt',
      title: 'So kommst du',
      titleAccent: 'hin',
      body: 'Die Nähe zum Bahnhof ist nicht nur ein Detail. Sie ist der Grund, warum Menschen nach Arbeit, Schule oder Uni leichter regelmässig kommen.',
      infos: [
        { label: 'Adresse', value: 'Salsaflow Dance Company GmbH, Elisabethenanlage 7, 4051 Basel' },
        { label: 'Orientierung', value: 'Direkt am Bahnhof Basel SBB, nur wenige Gehminuten entfernt.' },
        { label: 'Mit dem ÖV', value: 'Zug, Tram und Bus halten am Bahnhof SBB. Von dort bist du in wenigen Minuten bei uns.' },
        { label: 'Parken', value: 'Parkplätze am Bahnhof sind begrenzt. Am entspanntesten kommst du mit dem ÖV.' },
      ],
      mapsCta: 'In Maps öffnen',
    },
    studios: {
      eyebrow: 'Am Bahnhof SBB',
      title: 'Unsere',
      titleAccent: 'Studios',
      lead: 'Wir tanzen in drei hellen Studios direkt am Bahnhof SBB. Hier finden Kurse, Workshops und Proben statt.',
      items: [
        {
          name: 'Studio 1',
          text: 'Heller Raum mit Spiegelwand und Parkett. Ideal für Kurse und Workshops.',
          image: { src: '/photos/showcase/hp-06.webp', alt: 'Heller Tanzraum bei Salsaflow mit Spiegelwand' },
        },
        {
          name: 'Studio 2',
          text: 'Heller Tanzraum mit Spiegeln. Ideal für Kurse, Proben und kleine Gruppen.',
          image: { src: '/photos/showcase/hp-13.webp', alt: 'Salsaflow Studio mit viel Tageslicht und Tanzfläche' },
        },
        {
          name: 'Studio 3',
          text: 'Zentraler Raum am Bahnhof SBB. Ideal für Workshops, Trainings und Bewegung.',
          image: { src: '/photos/showcase/hp-21.webp', alt: 'Offener Bewegungsraum bei Salsaflow am Bahnhof Basel SBB' },
        },
      ],
    },
    rental: {
      eyebrow: 'Raumvermietung',
      title: 'Raum mieten für Tanz, Workshops oder',
      titleAccent: 'Bewegung',
      subline: 'Wenn du einen zentralen Bewegungsraum in Basel suchst, kannst du bei Salsaflow eine Raumvermietung anfragen.',
      suitedTitle: 'Geeignet für',
      suited: ['Tanzproben', 'Workshops', 'Bewegungskurse', 'private Trainings', 'kleine Gruppenformate'],
      note: 'Ausstattung, Kapazität und Preise klären wir direkt in deiner Anfrage.',
      checklistTitle: 'Das brauchen wir für deine Anfrage',
      checklist: [
        'Name oder Organisation',
        'E-Mail oder Telefon',
        'Gewünschtes Datum',
        'Uhrzeit und Dauer',
        'Zweck der Nutzung',
        'Erwartete Personenzahl',
        'Benötigte Ausstattung',
      ],
      checklistMicro: 'Je konkreter deine Angaben, desto schneller können wir prüfen, ob ein Studio passt.',
      cta: { label: 'Raumvermietung anfragen', href: R.raumanfrage },
    },
    closing: {
      title: 'Sag uns Datum, Uhrzeit und',
      titleAccent: 'Zweck',
      body: 'Dann können wir prüfen, welches Studio passt und ob der gewünschte Zeitraum verfügbar ist.',
      primary: { label: 'Raum anfragen', href: R.raumanfrage },
      secondary: { label: 'Kontakt aufnehmen', href: R.kontakt },
    },
    faqSection: {
      eyebrow: 'Raumvermietung FAQ',
      title: 'Gut zu',
      titleAccent: 'wissen',
      items: [
        {
          q: 'Kann man bei Salsaflow Räume mieten?',
          a: 'Ja. Verfügbarkeit, Ausstattung und Preise klären wir mit dir in einer konkreten Anfrage.',
        },
        {
          q: 'Für welche Formate eignen sich die Räume?',
          a: 'Für Tanz, Bewegung, Workshops, Proben oder ähnliche Formate. Details hängen vom Raum und der Gruppengrösse ab.',
        },
        {
          q: 'Wie zentral ist der Standort?',
          a: 'Direkt am Bahnhof Basel SBB, was die Anreise mit ÖV sehr einfach macht.',
        },
        {
          q: 'Welche Angaben braucht Salsaflow für eine Anfrage?',
          a: 'Datum, Uhrzeit, Dauer, Zweck, Personenzahl und gewünschte Ausstattung.',
        },
      ],
    },
  },

  en: {
    seo: 'standort',
    crumbs: [
      { label: 'Contact', href: '/kontakt' },
      { label: 'Location & room rental', href: '/kontakt/standort-raumvermietung' },
    ],
    hero: {
      eyebrow: 'Location & studios',
      title: 'Three studios right by Basel SBB station.',
      lead: 'Salsaflow sits right by Basel SBB station. Our studios are central, bright and usable for courses, workshops, rehearsals and room rental.',
      primary: { label: 'Open directions', href: R.anfahrt },
      secondary: { label: 'Request a room', href: R.mieten },
      microcopy: 'For room rental, please tell us the date, time frame and purpose.',
      image: { src: '/photos/hero/hero-02.jpg', alt: 'Bright Salsaflow studio right by Basel SBB station' },
      cardLabel: 'Basel SBB',
      cardText: 'Three studios. A few steps from the train.',
    },
    anfahrt: {
      eyebrow: 'Directions',
      title: 'This is how you get',
      titleAccent: 'here',
      body: 'The closeness to the station is not just a detail. It is the reason people come more easily and regularly after work, school or uni.',
      infos: [
        { label: 'Address', value: 'Salsaflow Dance Company GmbH, Elisabethenanlage 7, 4051 Basel' },
        { label: 'Orientation', value: 'Right by Basel SBB station, only a few minutes on foot.' },
        { label: 'By public transport', value: 'Trains, trams and buses stop at Basel SBB. From there you reach us in a few minutes.' },
        { label: 'Parking', value: 'Parking near the station is limited. The easiest way is by public transport.' },
      ],
      mapsCta: 'Open in Maps',
    },
    studios: {
      eyebrow: 'By Basel SBB',
      title: 'Our',
      titleAccent: 'studios',
      lead: 'We dance in three bright studios right by Basel SBB station. Courses, workshops and rehearsals happen here.',
      items: [
        {
          name: 'Studio 1',
          text: 'Bright room with a mirror wall and parquet floor. Ideal for courses and workshops.',
          image: { src: '/photos/showcase/hp-06.webp', alt: 'Bright Salsaflow dance room with a mirror wall' },
        },
        {
          name: 'Studio 2',
          text: 'Bright dance room with mirrors. Ideal for courses, rehearsals and small groups.',
          image: { src: '/photos/showcase/hp-13.webp', alt: 'Salsaflow studio with lots of daylight and a dance floor' },
        },
        {
          name: 'Studio 3',
          text: 'Central room by Basel SBB. Ideal for workshops, trainings and movement.',
          image: { src: '/photos/showcase/hp-21.webp', alt: 'Open movement room at Salsaflow by Basel SBB station' },
        },
      ],
    },
    rental: {
      eyebrow: 'Room rental',
      title: 'Rent a room for dance, workshops or',
      titleAccent: 'movement',
      subline: 'If you are looking for a central movement space in Basel, you can request a room rental at Salsaflow.',
      suitedTitle: 'Suitable for',
      suited: ['Dance rehearsals', 'Workshops', 'Movement classes', 'Private trainings', 'Small group formats'],
      note: 'We clarify equipment, capacity and prices directly in your request.',
      checklistTitle: 'What we need for your request',
      checklist: [
        'Name or organisation',
        'Email or phone',
        'Preferred date',
        'Time and duration',
        'Purpose of use',
        'Expected number of people',
        'Required equipment',
      ],
      checklistMicro: 'The more concrete your details, the faster we can check whether a studio fits.',
      cta: { label: 'Request a room rental', href: R.raumanfrage },
    },
    closing: {
      title: 'Tell us the date, time and',
      titleAccent: 'purpose',
      body: 'Then we can check which studio fits and whether the requested time frame is available.',
      primary: { label: 'Request a room', href: R.raumanfrage },
      secondary: { label: 'Get in touch', href: R.kontakt },
    },
    faqSection: {
      eyebrow: 'Room rental FAQ',
      title: 'Good to',
      titleAccent: 'know',
      items: [
        {
          q: 'Can you rent rooms at Salsaflow?',
          a: 'Yes. We clarify availability, equipment and prices with you in a concrete request.',
        },
        {
          q: 'Which formats are the rooms suitable for?',
          a: 'For dance, movement, workshops, rehearsals or similar formats. Details depend on the room and the group size.',
        },
        {
          q: 'How central is the location?',
          a: 'Right by Basel SBB station, which makes arriving by public transport very easy.',
        },
        {
          q: 'What details does Salsaflow need for a request?',
          a: 'Date, time, duration, purpose, number of people and desired equipment.',
        },
      ],
    },
  },
};
