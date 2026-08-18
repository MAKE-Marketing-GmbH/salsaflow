// Content der Floweekend-Seite (/events-workshops/floweekend) aus dem V3-Copyplan
// (pages/14_events-workshops__floweekend.md). Copy 1:1 aus dem Plan, zweisprachig
// (de = Plan-Wortlaut, en = treu uebersetzt). Echte Umlaute, CH-ss, keine Em-Dashes,
// keine erfundenen Zahlen. Bilder: echte Salsaflow-Fotos (public/photos), da laut Plan
// (KI-Bild-Wahrscheinlichkeit 15%) Eventfotos reichen.
//
// Interne Links (Plan): Eventkalender, Tanzschuhe, Kontakt, Tanzkurse. Schnupperstunde
// sitewide auf /kontakt#schnupperstunde.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };
type Link = { label: string; href: string };

export type FloweekendContent = {
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
  what: {
    title: string;
    titleAccent?: string;
    body: string;
    elements: { title: string; text: string }[];
    image: Img;
  };
  program: {
    title: string;
    titleAccent?: string;
    blocks: { title: string; text: string }[];
    cta: Cta;
  };
  fit: {
    title: string;
    titleAccent?: string;
    yesTitle: string;
    yes: string[];
    unsureTitle: string;
    unsure: string;
    cta: Cta;
  };
  prep: {
    title: string;
    titleAccent?: string;
    bullets: string[];
    links: Link[];
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

/* Interne Ziel-Routen (echte App-Routen). */
const R = {
  eventkalender: '/events-workshops/eventkalender',
  kontakt: '/kontakt',
  schnupper: '/schnupperstunde',
  tanzkurse: '/tanzkurse',
  tanzschuhe: '/mehr/tanzschuhe',
};

export const FLOWEEKEND: Record<Lang, FloweekendContent> = {
  de: {
    seo: 'floweekend',
    crumbs: [
      { label: 'Events', href: '/events' },
      { label: 'Floweekend', href: '/events-workshops/floweekend' },
    ],
    hero: {
      eyebrow: 'Workshops · Socials · Flow',
      title: 'Floweekend: ein Wochenende, das dich mehr tanzen lässt.',
      lead: 'Mehr Zeit, mehr Themen, mehr Menschen: Das Floweekend ist für alle, die tiefer in Salsa, Bachata und Community eintauchen wollen.',
      primary: { label: 'Floweekend anfragen', href: R.kontakt },
      secondary: { label: 'Frage zum Level stellen', href: R.kontakt },
      microcopy: 'Programm, Level und Preise folgen mit dem nächsten bestätigten Termin.',
      // Runde 3, Issue 3: events-hero-1400 lag gleichzeitig auf /events/anniversary,
      // /events/eventkalender und hier — drei Event-Unterseiten mit demselben Aufmacher.
      // Floweekend bekommt einen eigenen Social-Moment aus der Party-Strecke.
      image: {
        src: '/photos/party/party-29.webp',
        alt: 'Gruppe tanzt gemeinsam im hellen Salsaflow Studio',
      },
      cardLabel: 'Floweekend',
      cardText: 'Mehr Zeit, mehr Themen, mehr Menschen.',
    },
    what: {
      title: 'Ein Wochenende für Workshops, Socials und Community.',
      body: 'Ein Floweekend bündelt Workshops, Social-Dance-Momente und Community in einem kompakten Format. Es ist ideal, wenn du in kurzer Zeit viel Input, Wiederholung und echte Tanzfläche willst.',
      elements: [
        { title: 'Workshops', text: 'fokussierte Themen statt Wochenstaffel' },
        { title: 'Socials', text: 'ausprobieren, was du gelernt hast' },
        { title: 'Community', text: 'Menschen treffen, die denselben Flow suchen' },
      ],
      image: {
        src: '/photos/gallery/danceflow/06.jpg',
        alt: 'Tanzende Community bei einer Salsaflow Danceflow Night',
      },
    },
    program: {
      title: 'Was dich',
      titleAccent: 'erwartet.',
      blocks: [
        { title: 'Technik', text: 'Details, die deine Bewegungen sauberer machen.' },
        { title: 'Musikalität', text: 'Musik besser hören und bewusster tanzen.' },
        { title: 'Partnerwork', text: 'klarer führen, leichter folgen, besser reagieren.' },
        { title: 'Social', text: 'mehr Tanzen, mehr Begegnung, mehr Praxis.' },
      ],
      cta: { label: 'Programm öffnen', href: R.eventkalender },
    },
    fit: {
      title: 'Passt, wenn du ein Wochenende lang wirklich eintauchen willst.',
      yesTitle: 'Passt zu dir, wenn',
      yes: [
        'du regelmässig tanzt oder gerade stärker einsteigen willst',
        'du mehr Praxis als in einer einzelnen Kursstunde suchst',
        'du gern mit unterschiedlichen Menschen lernst',
        'du Workshops und Socials verbinden möchtest',
      ],
      unsureTitle: 'Wenn du unsicher bist',
      unsure:
        'Frag vorab nach dem passenden Level. Ein intensives Wochenende bringt am meisten, wenn du nicht überfordert bist.',
      cta: { label: 'Level klären', href: R.schnupper },
    },
    prep: {
      title: 'So holst du mehr aus dem',
      titleAccent: 'Wochenende.',
      bullets: [
        'bequeme Kleidung und passende Tanzschuhe mitbringen',
        'Wasser und Pausen einplanen',
        'Level realistisch wählen',
        'offen sein für Partnerwechsel und neue Themen',
        'nach Workshops direkt social tanzen, solange es frisch ist',
      ],
      links: [
        { label: 'Tanzkurse ansehen', href: R.tanzkurse },
        { label: 'Passende Tanzschuhe', href: R.tanzschuhe },
      ],
      image: {
        src: '/photos/events/event-04.jpg',
        alt: 'Tanzende bei einem Salsaflow Workshop in Basel',
      },
    },
    closing: {
      title: 'Bereit für mehr als eine einzelne',
      titleAccent: 'Stunde?',
      body: 'Öffne das aktuelle Floweekend-Programm oder frag uns, ob das Format zu deinem Level passt.',
      primary: { label: 'Floweekend ansehen', href: R.eventkalender },
      secondary: { label: 'Kontakt aufnehmen', href: R.kontakt },
    },
    faqEyebrow: 'Floweekend FAQ',
    faqTitle: 'Häufige Fragen zum Floweekend',
    faq: [
      {
        q: 'Ist das Floweekend für Anfänger:innen geeignet?',
        a: 'Nur wenn passende Beginner-Programmpunkte angeboten werden. Das muss im aktuellen Programm klar markiert sein.',
      },
      {
        q: 'Kann ich einzelne Workshops buchen?',
        a: 'Das hängt vom Ticketmodell ab. Einzel- und Pass-Optionen zeigen wir dir klar getrennt, sobald die Anmeldung offen ist.',
      },
      {
        q: 'Brauche ich einen Tanzpartner?',
        a: 'Bei vielen Workshops nicht, aber es hängt vom Format ab. Die Details stehen jeweils direkt bei der Anmeldung.',
      },
      {
        q: 'Was sollte ich mitbringen?',
        a: 'Bequeme Kleidung, passende Schuhe, Wasser und Offenheit für viel Bewegung.',
      },
    ],
  },
  en: {
    seo: 'floweekend',
    crumbs: [
      { label: 'Events', href: '/events' },
      { label: 'Floweekend', href: '/events-workshops/floweekend' },
    ],
    hero: {
      eyebrow: 'Workshops · Socials · Flow',
      title: 'Floweekend: a weekend that gets you dancing more.',
      lead: 'More time, more topics, more people: the Floweekend is for everyone who wants to dive deeper into Salsa, Bachata and community.',
      primary: { label: 'Ask about Floweekend', href: R.kontakt },
      secondary: { label: 'Ask about your level', href: R.kontakt },
      microcopy: 'The programme, levels and prices will be published with the next confirmed date.',
      image: {
        src: '/photos/party/party-29.webp',
        alt: 'Group dancing together in the bright Salsaflow studio',
      },
      cardLabel: 'Floweekend',
      cardText: 'More time, more topics, more people.',
    },
    what: {
      title: 'A weekend of workshops, socials and community.',
      body: 'A Floweekend combines workshops, social dancing and community in one compact format. It gives you more time to learn, practise and dance over a single weekend.',
      elements: [
        { title: 'Workshops', text: 'focused topics beyond the weekly class schedule' },
        { title: 'Socials', text: 'try out what you have learned' },
        { title: 'Community', text: 'meet people who are after the same flow' },
      ],
      image: {
        src: '/photos/gallery/danceflow/06.jpg',
        alt: 'Dancing community at a Salsaflow Danceflow Night',
      },
    },
    program: {
      title: 'What awaits',
      titleAccent: 'you.',
      blocks: [
        { title: 'Technique', text: 'Details that make your movements cleaner.' },
        { title: 'Musicality', text: 'Hear the music better and dance more consciously.' },
        { title: 'Partner work', text: 'Lead more clearly, follow more easily, react better.' },
        { title: 'Social', text: 'more dancing, more connection, more practice.' },
      ],
      cta: { label: 'Open the programme', href: R.eventkalender },
    },
    fit: {
      title: 'A good fit if you want to fully dive in for a whole weekend.',
      yesTitle: 'It suits you if',
      yes: [
        'you dance regularly or want to step it up now',
        'you are after more practice than a single class gives',
        'you like learning with different people',
        'you want to combine workshops and socials',
      ],
      unsureTitle: 'If you are unsure',
      unsure:
        'Ask about the right level beforehand. An intensive weekend gives you the most when you are not overwhelmed.',
      cta: { label: 'Clarify your level', href: R.schnupper },
    },
    prep: {
      title: 'How to get more out of the',
      titleAccent: 'weekend.',
      bullets: [
        'bring comfortable clothes and proper dance shoes',
        'plan for water and breaks',
        'choose your level realistically',
        'stay open to partner changes and new topics',
        'dance socially right after the workshops, while it is fresh',
      ],
      links: [
        { label: 'See the courses', href: R.tanzkurse },
        { label: 'Proper dance shoes', href: R.tanzschuhe },
      ],
      image: {
        src: '/photos/events/event-04.jpg',
        alt: 'Dancers at a Salsaflow workshop in Basel',
      },
    },
    closing: {
      title: 'Ready for more than a single',
      titleAccent: 'hour?',
      body: 'Open the current Floweekend programme or ask us whether the format fits your level.',
      primary: { label: 'See the Floweekend', href: R.eventkalender },
      secondary: { label: 'Get in touch', href: R.kontakt },
    },
    faqEyebrow: 'Floweekend FAQ',
    faqTitle: 'Common questions about the Floweekend',
    faq: [
      {
        q: 'Is the Floweekend suitable for beginners?',
        a: 'Only if suitable beginner programme points are offered. That has to be clearly marked in the current programme.',
      },
      {
        q: 'Can I book single workshops?',
        a: 'That depends on the ticket model. We show you single and pass options clearly separated once sign-up is open.',
      },
      {
        q: 'Do I need a dance partner?',
        a: 'For many workshops no, but it depends on the format. The details are shown right at sign-up.',
      },
      {
        q: 'What should I bring?',
        a: 'Comfortable clothes, proper shoes, water and openness for a lot of movement.',
      },
    ],
  },
};
