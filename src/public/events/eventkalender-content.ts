// Content der Eventkalender-Seite (/events-workshops/eventkalender) aus dem V3-Copyplan
// (pages/15_events-workshops__eventkalender.md). Copy 1:1 aus dem Plan, zweisprachig
// (de = Plan-Wortlaut, en = treu uebersetzt). Echte Umlaute, CH-ss, keine Em-Dashes,
// KEINE erfundenen Datumsangaben. Der Kalender-Empty-State zeigt "Termine folgen" ohne
// erfundene Termine (laut 03_KI_BILD_LUECKEN darf dort spaeter eine KI-Grafik stehen).
//
// Einzige verwendete Zeitangabe ist der gesicherte Danceflow-Rhythmus (jeden 1., 3. und
// 5. Freitag im Monat, aus business-reality). Interne Links (Plan): Danceflow Night,
// Anniversary Weekend, Floweekend, Kontakt. Instagram-URL aus dem SiteFooter (CONTACT).

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb } from '@/public/subpage/kit';
import { CONTACT } from '@/public/site/SiteFooter';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };
type Link = { label: string; href: string };

export type EventkalenderContent = {
  seo: SeoKey;
  crumbs: Crumb[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  filter: {
    title: string;
    titleAccent?: string;
    body: string;
    groups: { label: string; options: string[]; href: string }[];
    groupCta: string;
  };
  cards: {
    title: string;
    intro: string;
    items: { name: string; when: string; tags: string[]; text: string; cta: Cta }[];
  };
  featured: {
    title: string;
    titleAccent?: string;
    body: string;
    cta: Cta;
    links: Link[];
    image: Img;
  };
  empty: {
    eyebrow: string;
    title: string;
    stateLabel: string;
    noResults: string;
    primary: Cta;
    secondary: Cta;
    image: Img;
  };
  closing: {
    title: string;
    titleAccent?: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
  faqEyebrow: string;
  faqTitle: string;
  faq: Faq[];
};

/* Interne Ziel-Routen (echte App-Routen). Anker #filter/#kalender liegen auf dieser Seite. */
const R = {
  danceflow: '/events-workshops/danceflow-night',
  anniversary: '/events-workshops/anniversary-weekend',
  floweekend: '/events-workshops/floweekend',
  events: '/events',
  kontakt: '/kontakt',
  filter: '#filter',
  kalender: '#kalender',
};

export const EVENTKALENDER: Record<Lang, EventkalenderContent> = {
  de: {
    seo: 'eventkalender',
    crumbs: [
      { label: 'Events', href: '/events' },
      { label: 'Eventkalender', href: '/events-workshops/eventkalender' },
    ],
    hero: {
      eyebrow: 'Eventkalender',
      title: 'Was läuft als',
      titleAccent: 'Nächstes?',
      lead: 'Hier findest du den festen Rhythmus der Danceflow Nights und die wichtigsten Salsaflow-Eventformate. Neue Einzeltermine veröffentlichen wir, sobald sie bestätigt sind.',
      primary: { label: 'Eventformate ansehen', href: R.filter },
      secondary: { label: 'Danceflow Night ansehen', href: R.danceflow },
      microcopy: 'Bestätigte Daten und Anmeldelinks folgen mit dem jeweiligen Event.',
      image: {
        src: '/photos/premium/danceflow-home-1400.webp',
        alt: 'Tanzende Menschen bei einer Salsaflow Danceflow Night in Basel',
      },
      cardLabel: 'Aktueller Stand',
      cardText: 'Neue Einzeltermine folgen.',
    },
    filter: {
      title: 'Vier Eventformate bei',
      titleAccent: 'Salsaflow.',
      body: 'Vom regelmässigen Social bis zum besonderen Wochenende: Wähle das Format, über das du mehr erfahren möchtest.',
      groups: [
        // href je Format: die Karten sahen aus wie waehlbare Filter, waren aber tote
        // Listen — jetzt fuehrt jede Karte auf ihre Format-Seite (Critic Runde 10, Item 2).
        { label: 'Danceflow Night', options: ['1., 3. & 5. Freitag', 'Salsa & Bachata', 'alle Levels'], href: R.danceflow },
        { label: 'Workshops', options: ['wechselnde Themen', 'Level je Ankündigung', 'Termine folgen'], href: R.kontakt },
        { label: 'Anniversary Weekend', options: ['Workshops', 'Shows', 'Socials'], href: R.anniversary },
        { label: 'Floweekend', options: ['Workshops', 'Social Dancing', 'Community'], href: R.floweekend },
      ],
      groupCta: 'Mehr erfahren',
    },
    cards: {
      title: 'Zwei typische Wege auf die Tanzfläche.',
      intro:
        'Die Danceflow Night hat einen festen Monatsrhythmus. Workshops veröffentlichen wir mit Thema, Level und Anmeldung, sobald die Daten stehen.',
      items: [
        {
          name: 'Danceflow Night',
          when: 'Jeden 1., 3. und 5. Freitag im Monat',
          tags: ['Salsa & Bachata Social', 'Gäste willkommen'],
          text: 'Tanze, übe und triff die Salsaflow-Community. Workshop davor je nach Programm.',
          cta: { label: 'Mehr erfahren', href: R.danceflow },
        },
        {
          name: 'Workshop',
          when: 'Thema, Level und Tanzstil je nach Programm',
          tags: ['Technik', 'Figuren', 'Musikalität'],
          text: 'Ein fokussierter Abend, um Technik, Figuren oder Musikalität gezielt zu vertiefen.',
          cta: { label: 'Workshop anfragen', href: R.kontakt },
        },
      ],
    },
    featured: {
      title: 'Besondere Wochenenden im',
      titleAccent: 'Überblick.',
      body: 'Anniversary Weekend und Floweekend verbinden Workshops, Social Dancing und Community. Auf den Detailseiten erfährst du, welches Format dich erwartet.',
      cta: { label: 'Floweekend ansehen', href: R.floweekend },
      links: [
        { label: 'Floweekend', href: R.floweekend },
        { label: 'Anniversary Weekend', href: R.anniversary },
      ],
      image: {
        src: '/photos/events/event-02.jpg',
        alt: 'Grosses Salsaflow Event mit voller Tanzfläche in Basel',
      },
    },
    empty: {
      eyebrow: 'Kommende Events',
      title: 'Aktuell sind keine weiteren Einzeltermine veröffentlicht.',
      stateLabel: 'Termine folgen',
      noResults:
        'Den festen Rhythmus der Danceflow Night findest du oben. Für neue Workshops und Weekends folgst du uns am besten auf Instagram oder fragst uns direkt.',
      primary: { label: 'Eventformate ansehen', href: R.events },
      secondary: { label: 'Instagram öffnen', href: CONTACT.instagram },
      image: {
        src: '/photos/premium/events-hero-1400.webp',
        alt: 'Tanzende Menschen bei einem Salsaflow Event in Basel',
      },
    },
    closing: {
      title: 'Keine Lust, Termine zu',
      titleAccent: 'verpassen?',
      body: 'Folge Salsaflow auf Instagram für neue Daten oder öffne die Eventübersicht, um die verschiedenen Formate kennenzulernen.',
      primary: { label: 'Eventübersicht öffnen', href: R.events },
      secondary: { label: 'Instagram öffnen', href: CONTACT.instagram },
    },
    faqEyebrow: 'Eventkalender FAQ',
    faqTitle: 'Häufige Fragen zum Eventkalender',
    faq: [
      {
        q: 'Wo finde ich die nächsten Danceflow Nights?',
        a: 'Die Danceflow Night findet am 1., 3. und 5. Freitag im Monat statt. Details findest du auf der Danceflow-Night-Seite.',
      },
      {
        q: 'Wo steht das Level eines Workshops?',
        a: 'Sobald ein Workshop veröffentlicht ist, stehen Thema, Level und Anmeldung in der jeweiligen Ankündigung.',
      },
      {
        q: 'Wo finde ich Preise und Tickets?',
        a: 'Preise und Ticketlinks werden mit dem konkreten Event veröffentlicht. Wenn noch kein Termin steht, gibt es auch noch keinen Ticketstatus.',
      },
      {
        q: 'Wie erfahre ich von neuen Terminen?',
        a: 'Folge Salsaflow auf Instagram oder schreib uns kurz, wenn du dich für ein bestimmtes Format interessierst.',
      },
    ],
  },
  en: {
    seo: 'eventkalender',
    crumbs: [
      { label: 'Events', href: '/events' },
      { label: 'Event calendar', href: '/events-workshops/eventkalender' },
    ],
    hero: {
      eyebrow: 'Event calendar',
      title: 'What is on',
      titleAccent: 'next?',
      lead: 'Find the regular Danceflow Night schedule and an overview of Salsaflow event formats. We publish individual dates as soon as they are confirmed.',
      primary: { label: 'Explore event formats', href: R.filter },
      secondary: { label: 'See the Danceflow Night', href: R.danceflow },
      microcopy: 'Confirmed dates and registration links are published with each event.',
      image: {
        src: '/photos/premium/danceflow-home-1400.webp',
        alt: 'People dancing at a Salsaflow Danceflow Night in Basel',
      },
      cardLabel: 'Current status',
      cardText: 'More individual dates to come.',
    },
    filter: {
      title: 'Four event formats at',
      titleAccent: 'Salsaflow.',
      body: 'From a regular social to a special weekend, choose the format you would like to explore.',
      groups: [
        { label: 'Danceflow Night', options: ['1st, 3rd & 5th Friday', 'Salsa & Bachata', 'all levels'], href: R.danceflow },
        { label: 'Workshops', options: ['changing topics', 'level in each announcement', 'dates to come'], href: R.kontakt },
        { label: 'Anniversary Weekend', options: ['workshops', 'shows', 'socials'], href: R.anniversary },
        { label: 'Floweekend', options: ['workshops', 'social dancing', 'community'], href: R.floweekend },
      ],
      groupCta: 'Learn more',
    },
    cards: {
      title: 'Two typical ways to get on the dance floor.',
      intro:
        'Danceflow Night follows a regular monthly schedule. We publish workshops with their topic, level and registration link once the dates are confirmed.',
      items: [
        {
          name: 'Danceflow Night',
          when: 'Every 1st, 3rd and 5th Friday of the month',
          tags: ['Salsa & Bachata social', 'Guests welcome'],
          text: 'Dance, practise and meet the Salsaflow community. Workshop beforehand depending on the programme.',
          cta: { label: 'Learn more', href: R.danceflow },
        },
        {
          name: 'Workshop',
          when: 'Topic, level and dance style depending on the programme',
          tags: ['Technique', 'Figures', 'Musicality'],
          text: 'A focused evening to deepen technique, figures or musicality in a targeted way.',
          cta: { label: 'Ask about workshops', href: R.kontakt },
        },
      ],
    },
    featured: {
      title: 'Special weekends at a',
      titleAccent: 'glance.',
      body: 'The Anniversary Weekend and Floweekend combine workshops, social dancing and community. Their detail pages explain what to expect from each format.',
      cta: { label: 'Explore Floweekend', href: R.floweekend },
      links: [
        { label: 'Floweekend', href: R.floweekend },
        { label: 'Anniversary Weekend', href: R.anniversary },
      ],
      image: {
        src: '/photos/events/event-02.jpg',
        alt: 'Large Salsaflow event with a full dance floor in Basel',
      },
    },
    empty: {
      eyebrow: 'Upcoming events',
      title: 'No additional individual dates are currently published.',
      stateLabel: 'Dates to follow',
      noResults:
        'The regular Danceflow Night schedule is listed above. Follow us on Instagram for new workshops and weekends, or send us a message.',
      primary: { label: 'Explore event formats', href: R.events },
      secondary: { label: 'Open Instagram', href: CONTACT.instagram },
      image: {
        src: '/photos/premium/events-hero-1400.webp',
        alt: 'People dancing at a Salsaflow event in Basel',
      },
    },
    closing: {
      title: 'Do not want to miss any',
      titleAccent: 'dates?',
      body: 'Follow Salsaflow on Instagram for new dates, or explore the event overview to learn more about each format.',
      primary: { label: 'Open the event overview', href: R.events },
      secondary: { label: 'Open Instagram', href: CONTACT.instagram },
    },
    faqEyebrow: 'Event calendar FAQ',
    faqTitle: 'Common questions about the event calendar',
    faq: [
      {
        q: 'Where do I find the next Danceflow Nights?',
        a: 'Danceflow Night takes place on the first, third and fifth Friday of each month. See the Danceflow Night page for details.',
      },
      {
        q: 'Where can I find the level for a workshop?',
        a: 'Once a workshop is announced, its topic, level and registration link are included in the announcement.',
      },
      {
        q: 'Where can I find prices and tickets?',
        a: 'Prices and ticket links are published with the specific event. If no date has been announced, there is no ticket status yet.',
      },
      {
        q: 'How can I hear about new dates?',
        a: 'Follow Salsaflow on Instagram or message us if you are interested in a specific format.',
      },
    ],
  },
};
