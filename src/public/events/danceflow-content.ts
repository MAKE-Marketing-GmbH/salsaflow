// Inhalt der Danceflow-Night-Unterseite (/events-workshops/danceflow-night) aus dem
// V3-Copyplan (pages/12). EIN Content-Objekt, EINE Seite (DanceflowNightPage.tsx). Copy 1:1
// aus dem Plan, zweisprachig (de = Plan-Wortlaut, en = treu uebersetzt). Echte Umlaute, CH-ss,
// keine Em-Dashes (Plan-Em-Dash im Hero-Lead zu Komma aufgeloest, Copy-Regel 003/069).
//
// Reine Produktions-/Design-Notizen aus dem Plan (z.B. "Aktuelle Preisliste final pruefen",
// "Beginner-freundliche Hinweise direkt an Eventkarten anzeigen", "Vor Livegang final pruefen")
// sind KEINE Besuchercopy und werden bewusst nicht gerendert. Preise CHF 5.- / CHF 10.- stehen
// im Plan und sind daher nicht erfunden.
//
// Bilder: echte Salsaflow-Fotos (public/photos). Jedes Bild max 1x auf dieser Seite.
// Danceflow darf naechtlicher wirken (Auftrag): dunkler Hero, dunkles Ablauf-Band, dunkler Closer.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string; width: number; height: number };

export type DanceflowContent = {
  seo: SeoKey;
  crumbs: Crumb[];
  hero: {
    eyebrow: string;
    h1: { pre: string; accent: string; post: string };
    lead: string;
    bullets: string[];
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  why: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    cards: { title: string; text: string }[];
    cta: Cta;
    image: Img;
  };
  flow: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
    cta: Cta;
    image: Img;
  };
  beginner: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    cta: Cta;
    image: Img;
  };
  price: {
    eyebrow: string;
    title: string;
    cards: { label: string; value: string }[];
    cta: Cta;
  };
  etiquette: {
    eyebrow: string;
    title: string;
    bullets: string[];
  };
  closing: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
  };
  faqEyebrow: string;
  faqTitle: string;
  faq: Faq[];
};

/* Interne Ziel-Routen (echte App-Routen). */
const R = {
  eventkalender: '/events-workshops/eventkalender',
  kontakt: '/kontakt',
  preise: '/preise',
  self: '/events-workshops/danceflow-night',
};

const CRUMBS: Crumb[] = [
  { label: 'Events', href: '/events' },
  { label: 'Danceflow Night', href: R.self },
];

export const DANCEFLOW = {
  de: {
    seo: 'danceflow',
    crumbs: CRUMBS,
    hero: {
      eyebrow: '1., 3. und 5. Freitag',
      h1: { pre: 'Tanzen, üben, ', accent: 'ankommen', post: '.' },
      lead: 'Die Danceflow Night ist dein regelmässiger Social-Dance-Abend bei Salsaflow, mit Salsa, Bachata, Menschen aus den Kursen und Gästen aus der Community.',
      bullets: [
        'Salsa und Bachata Social',
        'Salsaflow-Schüler:innen mit günstigerem Eintritt',
        'Gäste willkommen',
        'Workshops vor ausgewählten Abenden',
        'direkt im Salsaflow-Studio',
      ],
      primary: { label: 'Nächsten Abend anfragen', href: R.kontakt },
      secondary: { label: 'Eintrittspreise ansehen', href: R.preise },
      microcopy: 'Komm zum Tanzen, nicht zum Beweisen.',
      image: {
        src: '/photos/party/party-50-v4.webp',
        alt: 'Tanzpaar inmitten einer hellen Danceflow Night im Salsaflow-Studio',
        width: 2048,
        height: 1360,
      },
      cardLabel: 'Jeden 1., 3. und 5. Freitag',
      cardText: 'Social Dance direkt im Salsaflow-Studio.',
    },
    why: {
      eyebrow: 'Warum kommen',
      title: 'Warum die Danceflow Night zum Kurs gehört.',
      body: 'Im Kurs lernst du Schritte und Kombinationen. Auf der Danceflow Night probierst du sie mit verschiedenen Menschen und Songs in entspannter Atmosphäre aus.',
      cards: [
        { title: 'Üben ohne Druck', text: 'Du kannst ausprobieren, was im Kurs schon sitzt, ohne dass es perfekt sein muss.' },
        { title: 'Menschen kennenlernen', text: 'Du triffst Tänzer:innen aus anderen Kursen und findest schneller Anschluss.' },
        { title: 'Dranbleiben', text: 'Regelmässige Socials machen aus einem Kurs eine Gewohnheit.' },
      ],
      cta: { label: 'Nächsten Abend anfragen', href: R.kontakt },
      image: {
        src: '/photos/gallery/danceflow/05-v3.webp',
        alt: 'Tanzende Paare in warmer Stimmung auf der Danceflow Night',
        width: 1360,
        height: 2048,
      },
    },
    flow: {
      eyebrow: 'Der Abend',
      title: 'So fühlt sich der Abend an.',
      steps: [
        { title: 'Ankommen', text: 'Du kommst ins Studio, triffst bekannte und neue Gesichter.' },
        { title: 'Optionaler Workshop', text: 'Vor ausgewählten Abenden gibt es ein Thema zum Vertiefen.' },
        { title: 'Social Dance', text: 'Salsa, Bachata, Pausen, Gespräche, neue Tänze.' },
        { title: 'Wiederkommen', text: 'Genau dadurch entsteht Community.' },
      ],
      cta: { label: 'Weitere Eventformate ansehen', href: R.eventkalender },
      image: {
        src: '/photos/party/party-17-v3.webp',
        alt: 'DJ und Stimmung im Studio während der Danceflow Night',
        width: 2048,
        height: 1360,
      },
    },
    beginner: {
      eyebrow: 'Für Anfänger:innen',
      title: 'Du musst nicht perfekt tanzen, um',
      titleAccent: 'vorbeizukommen',
      body: 'Gerade am Anfang hilft es, Kursschritte in echter Atmosphäre auszuprobieren. Wenn du unsicher bist, ob ein Abend für dein Level passt, frag kurz nach oder komm zu einem Workshop davor.',
      cta: { label: 'Frage zum Level stellen', href: R.kontakt },
      image: {
        src: '/photos/gallery/danceflow/10-v3.webp',
        alt: 'Entspannte Tänzer:innen üben gemeinsam auf der Danceflow Night',
        width: 2048,
        height: 1360,
      },
    },
    price: {
      eyebrow: 'Eintritt',
      title: 'Eintritt und Preise.',
      cards: [
        { label: 'Salsaflow-Schüler:innen', value: 'CHF 5.-' },
        { label: 'Gäste', value: 'CHF 10.-' },
        // Aus dem Kunden-Onboarding, leistungen[2].was, woertlich: "Besuchst Du einen
        // Workshops, so zahlst Du keinen Eintritt fuer unsere regulaeren Danceflow Nights!"
        // Stand bisher nirgends. Vorher hiess es hier "separat gemaess aktueller Liste" —
        // das klang nach Zusatzkosten statt nach einem Vorteil.
        { label: 'Mit Workshop davor', value: 'Eintritt frei' },
      ],
      cta: { label: 'Preise ansehen', href: R.preise },
    },
    etiquette: {
      eyebrow: 'Auf der Tanzfläche',
      title: 'Gute Socials fühlen sich entspannt an, weil alle aufeinander achten.',
      bullets: [
        'freundlich fragen',
        'ein Nein akzeptieren',
        'Platz auf der Tanzfläche respektieren',
        'keine komplizierten Figuren erzwingen',
        'nach dem Tanz bedanken',
      ],
    },
    closing: {
      eyebrow: 'Nächster Freitag',
      title: 'Komm zur nächsten',
      titleAccent: 'Danceflow Night',
      body: 'Die Danceflow Night findet am 1., 3. und 5. Freitag im Monat statt. Bei Fragen zum nächsten Abend oder zum Workshop davor schreib uns kurz.',
      primary: { label: 'Nächsten Abend anfragen', href: R.kontakt },
      secondary: { label: 'Preise ansehen', href: R.preise },
      microcopy: 'Salsa · Bachata · Community · direkt am Bahnhof SBB.',
      image: {
        src: '/photos/party/party-20-v3.webp',
        alt: 'Tanzende Community am späten Abend auf der Danceflow Night',
        width: 2048,
        height: 1360,
      },
    },
    faqEyebrow: 'Danceflow FAQ',
    faqTitle: 'Häufige Fragen zur Danceflow Night',
    faq: [
      {
        q: 'Wann findet die Danceflow Night statt?',
        a: 'Sie findet am 1., 3. und 5. Freitag im Monat statt. Bei Feiertagen oder Programmänderungen frag uns kurz oder prüfe die aktuelle Instagram-Ankündigung.',
      },
      {
        q: 'Kann ich als Anfänger:in kommen?',
        a: 'Ja, wenn du offen bist zu üben und dir bewusst ist, dass Social Dance nicht wie Unterricht funktioniert. Bei Unsicherheit frag den Workshop davor oder das Team.',
      },
      {
        q: 'Muss ich jemanden mitbringen?',
        a: 'Nein. Du kannst alleine kommen.',
      },
      {
        q: 'Was kostet der Eintritt?',
        a: 'Laut aktueller Preisliste: CHF 5.- für Salsaflow-Schüler:innen und CHF 10.- für Gäste.',
      },
    ],
  },
  en: {
    seo: 'danceflow',
    crumbs: CRUMBS,
    hero: {
      eyebrow: '1st, 3rd and 5th Friday',
      h1: { pre: 'Dance, practise, ', accent: 'connect', post: '.' },
      lead: 'The Danceflow Night is your regular social-dance evening at Salsaflow, with Salsa, Bachata, people from the courses and guests from the community.',
      bullets: [
        'Salsa and Bachata social',
        'Reduced entry for Salsaflow students',
        'Guests welcome',
        'Workshops before selected nights',
        'right in the Salsaflow studio',
      ],
      primary: { label: 'Ask about the next night', href: R.kontakt },
      secondary: { label: 'See entry prices', href: R.preise },
      microcopy: 'Come to dance, not to prove yourself.',
      image: {
        src: '/photos/party/party-50-v4.webp',
        alt: 'Dance couple in the middle of a bright Danceflow Night at the Salsaflow studio',
        width: 2048,
        height: 1360,
      },
      cardLabel: 'Every 1st, 3rd and 5th Friday',
      cardText: 'Social dance right in the Salsaflow studio.',
    },
    why: {
      eyebrow: 'Why come',
      title: 'Why the Danceflow Night belongs with your class.',
      body: 'In class you learn steps and combinations. At the Danceflow Night you can use them with different partners and songs in a relaxed setting.',
      cards: [
        { title: 'Practise without pressure', text: 'You can try what already works from class, without it having to be perfect.' },
        { title: 'Meet people', text: 'You meet dancers from other courses and connect more quickly.' },
        { title: 'Stay with it', text: 'Regular socials turn a course into a habit.' },
      ],
      cta: { label: 'Ask about the next night', href: R.kontakt },
      image: {
        src: '/photos/gallery/danceflow/05-v3.webp',
        alt: 'Couples dancing in a warm mood at the Danceflow Night',
        width: 1360,
        height: 2048,
      },
    },
    flow: {
      eyebrow: 'The evening',
      title: 'How the evening feels.',
      steps: [
        { title: 'Arriving', text: 'You come into the studio and meet familiar and new faces.' },
        { title: 'Optional workshop', text: 'Selected nights begin with a focused workshop.' },
        { title: 'Social dance', text: 'Salsa, Bachata, breaks, conversations, new dances.' },
        { title: 'Coming back', text: 'That is exactly how community grows.' },
      ],
      cta: { label: 'Explore other event formats', href: R.eventkalender },
      image: {
        src: '/photos/party/party-17-v3.webp',
        alt: 'DJ and atmosphere in the studio during the Danceflow Night',
        width: 2048,
        height: 1360,
      },
    },
    beginner: {
      eyebrow: 'For beginners',
      title: 'You do not need to dance perfectly to',
      titleAccent: 'drop by',
      body: 'Right at the start it helps to try course steps in a real atmosphere. If you are unsure whether a night suits your level, ask us briefly or come to a workshop before.',
      cta: { label: 'Ask about your level', href: R.kontakt },
      image: {
        src: '/photos/gallery/danceflow/10-v3.webp',
        alt: 'Relaxed dancers practising together at the Danceflow Night',
        width: 2048,
        height: 1360,
      },
    },
    price: {
      eyebrow: 'Entry',
      title: 'Entry and prices.',
      cards: [
        { label: 'Salsaflow students', value: 'CHF 5.-' },
        { label: 'Guests', value: 'CHF 10.-' },
        { label: 'With workshop before', value: 'entry free' },
      ],
      cta: { label: 'See the prices', href: R.preise },
    },
    etiquette: {
      eyebrow: 'On the dance floor',
      title: 'Good socials feel relaxed because everyone looks out for each other.',
      bullets: [
        'ask kindly',
        'accept a no',
        'respect space on the dance floor',
        'do not force complicated figures',
        'thank each other after the dance',
      ],
    },
    closing: {
      eyebrow: 'Next Friday',
      title: 'Come to the next',
      titleAccent: 'Danceflow Night',
      body: 'Danceflow Night takes place on the first, third and fifth Friday of each month. Message us if you have questions about the next night or the workshop beforehand.',
      primary: { label: 'Ask about the next night', href: R.kontakt },
      secondary: { label: 'See prices', href: R.preise },
      microcopy: 'Salsa · Bachata · community · right by Basel SBB station.',
      image: {
        src: '/photos/party/party-20-v3.webp',
        alt: 'Dancing community late in the evening at the Danceflow Night',
        width: 2048,
        height: 1360,
      },
    },
    faqEyebrow: 'Danceflow FAQ',
    faqTitle: 'Common questions about the Danceflow Night',
    faq: [
      {
        q: 'When does the Danceflow Night take place?',
        a: 'It takes place on the first, third and fifth Friday of each month. For public holidays or programme changes, message us or check the latest Instagram announcement.',
      },
      {
        q: 'Can I come as a beginner?',
        a: 'Yes, if you are open to practising and aware that social dance does not work like a class. If unsure, ask about the workshop before or the team.',
      },
      {
        q: 'Do I have to bring someone?',
        a: 'No. You can come on your own.',
      },
      {
        q: 'What does entry cost?',
        a: 'As per the current price list: CHF 5.- for Salsaflow students and CHF 10.- for guests.',
      },
    ],
  },
} satisfies Record<Lang, DanceflowContent>;
