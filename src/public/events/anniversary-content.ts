// Inhalt der Anniversary-Weekend-Unterseite (/events-workshops/anniversary-weekend) aus dem
// V3-Copyplan (pages/13). EIN Content-Objekt, EINE Seite (AnniversaryPage.tsx). Copy 1:1 aus
// dem Plan, zweisprachig (de = Plan-Wortlaut, en = treu uebersetzt). Echte Umlaute, CH-ss,
// keine Em-Dashes.
//
// Reine Produktions-/Design-Notizen aus dem Plan (z.B. "Die Seite sollte nicht nur Programm
// auflisten...", "Nutze hier keine generischen Eventgrafiken...", "Das Programm muss in 10
// Sekunden scannbar sein") sind KEINE Besuchercopy und werden nicht 1:1 gerendert. Der
// Programm-Block bleibt bewusst ein Template ohne erfundene Termine/Line-ups (Plan: modulare
// Event-Copy, echte Daten im Eventkalender). Marke bleibt hell (nie dunkler Club).
//
// Bilder: echte Salsaflow-Fotos (public/photos). Jedes Bild max 1x auf dieser Seite.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };

export type AnniversaryContent = {
  seo: SeoKey;
  crumbs: Crumb[];
  hero: {
    eyebrow: string;
    h1: { pre: string; accent: string; post: string };
    lead: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  about: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    pillars: { title: string; text: string }[];
    image: Img;
  };
  programm: {
    eyebrow: string;
    title: string;
    intro: string;
    fieldsIntro: string;
    fields: string[];
    questionsIntro: string;
    questions: string[];
    cta: Cta;
  };
  audience: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    fitTitle: string;
    fit: string[];
    newTitle: string;
    newBody: string;
    cta: Cta;
    image: Img;
  };
  proof: {
    eyebrow: string;
    title: string;
    images: Img[];
    links: Cta[];
  };
  closing: {
    eyebrow: string;
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

/* Interne Ziel-Routen (echte App-Routen). */
const R = {
  eventkalender: '/events-workshops/eventkalender',
  kontakt: '/schnupperstunde',
  fotos: '/fotos',
  danceflow: '/events-workshops/danceflow-night',
  self: '/events-workshops/anniversary-weekend',
};

const CRUMBS: Crumb[] = [
  { label: 'Events', href: '/events' },
  { label: 'Anniversary Weekend', href: R.self },
];

export const ANNIVERSARY: Record<Lang, AnniversaryContent> = {
  de: {
    seo: 'anniversary',
    crumbs: CRUMBS,
    hero: {
      eyebrow: 'Salsaflow Community Weekend',
      h1: {
        pre: 'Anniversary Weekend: Wir ',
        accent: 'feiern',
        post: ', was aus einem Kurs entstehen kann.',
      },
      lead: 'Ein Wochenende für Workshops, Shows, Socials und Menschen, die Salsaflow nicht nur besuchen, sondern als Community erleben.',
      primary: { label: 'Programm ansehen', href: R.eventkalender },
      secondary: { label: 'Interesse anmelden', href: R.kontakt },
      microcopy: 'Neue Termine, Line-up und Preise veröffentlichen wir nach Bestätigung.',
      image: {
        src: '/photos/premium/events-hero-1400.webp',
        alt: 'Ausgelassene Salsaflow-Community bei einem grossen Wochenende in Basel',
      },
      cardLabel: 'Community Weekend',
      cardText: 'Workshops, Shows, Socials und Menschen.',
    },
    about: {
      eyebrow: 'Was ist das',
      title: 'Nicht nur ein Event. Ein Wiedersehen, ein Lernmoment und eine',
      titleAccent: 'Feier',
      body: 'Das Anniversary Weekend bündelt die Energie von Salsaflow: Unterricht, Shows, Social Dancing und Community.',
      pillars: [
        { title: 'Lernen', text: 'Workshops mit klaren Themen und Levels.' },
        { title: 'Erleben', text: 'Shows, Auftritte und besondere Momente.' },
        { title: 'Verbinden', text: 'Socials, Begegnungen und Community.' },
      ],
      image: {
        src: '/photos/premium/community-story-1600.webp',
        alt: 'Salsaflow-Tänzer:innen und Gäste in warmer Community-Stimmung',
      },
    },
    programm: {
      eyebrow: 'Programm',
      title: 'Das erfährst du mit dem veröffentlichten Programm.',
      intro: 'Sobald das nächste Anniversary Weekend bestätigt ist, veröffentlichen wir die wichtigsten Angaben zu jedem Programmpunkt.',
      fieldsIntro: 'Jeder Programmpunkt enthält',
      fields: [
        'Datum / Uhrzeit',
        'Programmpunkt',
        'Tanzstil',
        'Level',
        'Ort / Studio',
        'Preis / Ticketstatus',
      ],
      questionsIntro: 'Bei Workshops klären wir:',
      questions: ['Für wen geeignet?', 'Brauche ich Vorkenntnisse?', 'Muss ich Partner mitbringen?'],
      cta: { label: 'Aktuelle Termine ansehen', href: R.eventkalender },
    },
    audience: {
      eyebrow: 'Für wen',
      title: 'Für alle, die mehr wollen als eine normale',
      titleAccent: 'Kurswoche',
      fitTitle: 'Passt zu dir, wenn',
      fit: [
        'du Salsaflow schon kennst und tiefer eintauchen willst',
        'du Workshops und Socials an einem Wochenende verbinden möchtest',
        'du Shows und Community-Momente erleben willst',
        'du neue Menschen aus der Szene kennenlernen möchtest',
      ],
      newTitle: 'Wenn du ganz neu bist',
      newBody: 'Starte über eine beginner-freundliche Session oder frage vorab, welche Programmpunkte passen.',
      cta: { label: 'Frage zum Level stellen', href: R.kontakt },
      image: {
        src: '/photos/events/event-03.jpg',
        alt: 'Gruppe aus der Salsaflow-Szene beim gemeinsamen Tanzen',
      },
    },
    proof: {
      eyebrow: 'Beweis durch Bilder',
      title: 'So fühlt sich ein Salsaflow-Wochenende an.',
      images: [
        { src: '/photos/shows/show-11.webp', alt: 'Bühnenmoment einer Salsaflow-Show vor Publikum' },
        { src: '/photos/events/event-02.jpg', alt: 'Volle Crowd und gute Laune bei einem Salsaflow-Event' },
        { src: '/photos/showcase/hp-14.webp', alt: 'Lachende Tänzer:innen auf der Tanzfläche' },
        { src: '/photos/events/event-07.jpg', alt: 'Tanzfläche voller Menschen bei einem Salsaflow-Wochenende' },
      ],
      links: [
        { label: 'Alle Fotos ansehen', href: R.fotos },
        { label: 'Danceflow Night entdecken', href: R.danceflow },
      ],
    },
    closing: {
      eyebrow: 'In den Kalender',
      title: 'Wenn du Salsaflow feiern willst, gehört dieses Wochenende in deinen',
      titleAccent: 'Kalender',
      body: 'Sieh dir das Eventformat an oder melde Interesse an, solange noch kein neuer Termin veröffentlicht ist.',
      primary: { label: 'Eventübersicht ansehen', href: R.eventkalender },
      secondary: { label: 'Interesse anmelden', href: R.kontakt },
    },
    faqEyebrow: 'Anniversary FAQ',
    faqTitle: 'Häufige Fragen zum Anniversary Weekend',
    faq: [
      {
        q: 'Muss ich Salsaflow-Schüler:in sein?',
        a: 'Das hängt vom jeweiligen Programmpunkt ab. In der veröffentlichten Ankündigung steht, ob Gäste willkommen sind.',
      },
      {
        q: 'Gibt es Workshops für Anfänger:innen?',
        a: 'Wenn es welche gibt, sind sie im Programm klar markiert. Sonst frag dein Level vorab kurz bei uns nach.',
      },
      {
        q: 'Kann ich einzelne Programmpunkte buchen?',
        a: 'Das hängt vom Ticketmodell ab. Die Details findest du beim jeweiligen Programmpunkt im Eventkalender.',
      },
      {
        q: 'Wo findet das Anniversary Weekend statt?',
        a: 'In den Salsaflow-Studios oder an der im Eventkalender genannten Location.',
      },
    ],
  },
  en: {
    seo: 'anniversary',
    crumbs: CRUMBS,
    hero: {
      eyebrow: 'Salsaflow Community Weekend',
      h1: {
        pre: 'Anniversary Weekend: we ',
        accent: 'celebrate',
        post: ' what can grow out of a course.',
      },
      lead: 'A weekend for workshops, shows, socials and people who do not just visit Salsaflow but experience it as a community.',
      primary: { label: 'See the programme', href: R.eventkalender },
      secondary: { label: 'Register interest', href: R.kontakt },
      microcopy: 'We publish new dates, the line-up and prices once they are confirmed.',
      image: {
        src: '/photos/premium/events-hero-1400.webp',
        alt: 'Joyful Salsaflow community at a big weekend in Basel',
      },
      cardLabel: 'Community weekend',
      cardText: 'Workshops, shows, socials and people.',
    },
    about: {
      eyebrow: 'What it is',
      title: 'Not just an event. A reunion, a learning moment and a',
      titleAccent: 'celebration',
      body: 'The Anniversary Weekend bundles the energy of Salsaflow: teaching, shows, social dancing and community.',
      pillars: [
        { title: 'Learn', text: 'Workshops with clear themes and levels.' },
        { title: 'Experience', text: 'Shows, performances and special moments.' },
        { title: 'Connect', text: 'Socials, encounters and community.' },
      ],
      image: {
        src: '/photos/premium/community-story-1600.webp',
        alt: 'Salsaflow dancers and guests in a warm community mood',
      },
    },
    programm: {
      eyebrow: 'Programme',
      title: 'What you will find in the published programme.',
      intro: 'Once the next Anniversary Weekend is confirmed, we publish the essential details for each programme item.',
      fieldsIntro: 'Each programme item includes',
      fields: [
        'Date / time',
        'Programme item',
        'Dance style',
        'Level',
        'Location / studio',
        'Price / ticket status',
      ],
      questionsIntro: 'For workshops we clarify:',
      questions: ['Who is it for?', 'Do I need experience?', 'Do I have to bring a partner?'],
      cta: { label: 'See current dates', href: R.eventkalender },
    },
    audience: {
      eyebrow: 'Who it is for',
      title: 'For everyone who wants more than a normal',
      titleAccent: 'course week',
      fitTitle: 'It suits you if',
      fit: [
        'you already know Salsaflow and want to dive deeper',
        'you want to combine workshops and socials in one weekend',
        'you want to experience shows and community moments',
        'you want to meet new people from the scene',
      ],
      newTitle: 'If you are brand new',
      newBody: 'Start with a beginner-friendly session or ask in advance which programme items suit you.',
      cta: { label: 'Ask about your level', href: R.kontakt },
      image: {
        src: '/photos/events/event-03.jpg',
        alt: 'A group from the Salsaflow scene dancing together',
      },
    },
    proof: {
      eyebrow: 'Proof in pictures',
      title: 'How a Salsaflow weekend feels.',
      images: [
        { src: '/photos/shows/show-11.webp', alt: 'Stage moment of a Salsaflow show in front of an audience' },
        { src: '/photos/events/event-02.jpg', alt: 'Full crowd and good mood at a Salsaflow event' },
        { src: '/photos/showcase/hp-14.webp', alt: 'Laughing dancers on the dance floor' },
        { src: '/photos/events/event-07.jpg', alt: 'Dance floor full of people at a Salsaflow weekend' },
      ],
      links: [
        { label: 'See all photos', href: R.fotos },
        { label: 'Discover the Danceflow Night', href: R.danceflow },
      ],
    },
    closing: {
      eyebrow: 'Into your calendar',
      title: 'If you want to celebrate Salsaflow, this weekend belongs in your',
      titleAccent: 'calendar',
      body: 'Explore the event format or register your interest while no new date has been published.',
      primary: { label: 'See the event overview', href: R.eventkalender },
      secondary: { label: 'Register interest', href: R.kontakt },
    },
    faqEyebrow: 'Anniversary FAQ',
    faqTitle: 'Common questions about the Anniversary Weekend',
    faq: [
      {
        q: 'Do I have to be a Salsaflow student?',
        a: 'That depends on the programme item. The published announcement will say whether guests are welcome.',
      },
      {
        q: 'Are there workshops for beginners?',
        a: 'If there are, they are clearly marked in the programme. Otherwise, just ask us about your level in advance.',
      },
      {
        q: 'Can I book individual programme items?',
        a: 'That depends on the ticket model. You find the details at each programme item in the event calendar.',
      },
      {
        q: 'Where does the Anniversary Weekend take place?',
        a: 'In the Salsaflow studios or at the location named in the event calendar.',
      },
    ],
  },
};
