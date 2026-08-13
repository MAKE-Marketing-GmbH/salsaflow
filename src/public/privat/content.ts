// Content der Privatstunden-Seite (/privatstunden) aus dem V3-Copyplan (pages/06). Copy 1:1
// aus dem Plan, zweisprachig (de = Plan-Wortlaut, en = treu uebersetzt). Echte Umlaute, CH-ss,
// keine Em-Dashes. Keine erfundenen Zahlen: die Preise stehen so im Plan.
//
// Hinweis zu Plan-Notizen: Der Plan mischt Besucher-Copy mit Bau-Anweisungen. Reine
// Bau-Anweisungen ("Preise nur anzeigen, wenn final bestaetigt", "Preis-Logik aus aktueller
// Liste pruefen", "Darum sollte das Anfrageformular ... fragen") sind NICHT Besucher-Copy und
// werden nicht als Text ausgegeben. Die eigentliche Besucher-Copy ist woertlich uebernommen.
//
// Bilder: echte Salsaflow-Fotos (public/photos). Hero = kuratiertes Offer-Bild, Ablauf-Sektion
// ein echtes Unterrichtsfoto. Jedes Bild nur einmal pro Seite.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };

export type PrivatContent = {
  seo: SeoKey;
  crumb: Crumb;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string; // ein Script-Akzentwort, inline gesetzt
    lead: string;
    bullets: string[];
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  when: {
    title: string;
    titleAccent?: string;
    intro: string;
    cards: { title: string; text: string }[];
    cta: Cta;
  };
  flow: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    steps: { tag: string; title: string; text: string }[];
    cta: Cta;
    image: Img;
  };
  formats: {
    title: string;
    titleAccent?: string;
    items: { name: string; text: string }[];
  };
  prices: {
    title: string;
    titleAccent?: string;
    body: string;
    rows: { label: string; price: string }[];
    cta: Cta;
    altCta: Cta;
  };
  notFor: {
    title: string;
    titleAccent?: string;
    body: string;
    cta: Cta;
  };
  closing: {
    title: string;
    titleAccent?: string;
    body: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
  };
  faqEyebrow: string;
  faqTitle: string;
  faq: Faq[];
};

/* Interne Ziel-Routen (echte App-Routen). */
const R = {
  schnupper: '/kontakt#schnupperstunde',
  // Eigener Hash fuer Privatstunden. Vorher zeigten auch die acht Knoepfe mit der Aufschrift
  // "Privatstunde anfragen" auf #schnupperstunde. Das Formular fragte dann nach Tanzstil und
  // Wochentag statt nach dem Ziel — und schickte das falsche Anliegen ans Studio.
  privatAnfrage: '/kontakt#privatstunden',
  preise: '/preise',
  kontakt: '/kontakt',
  kursaufbau: '/kursaufbau',
  privat: '/privatstunden',
};

const de: PrivatContent = {
  seo: 'privatstunden',
  crumb: { label: 'Privatstunden', href: R.privat },
  hero: {
    eyebrow: 'Privatstunden in Basel',
    title: 'Persönlicher Unterricht für genau das, was du verbessern willst.',
    titleAccent: 'verbessern',
    lead: 'In einer Privatstunde arbeitest du direkt an deinem Ziel: Technik, Rhythmus, Führung, Folgen, Styling, Hochzeitstanz oder ein sicherer Einstieg in dein nächstes Level.',
    bullets: [
      'persönliche Korrektur statt allgemeiner Kurslogik',
      'Salsa, Bachata, Hochzeitstanz und Technik-Fokus möglich',
      'für Einzelpersonen, Paare oder kleine Ziele',
      'direkt im Salsaflow-Studio am Bahnhof SBB',
    ],
    primary: { label: 'Privatstunde anfragen', href: R.privatAnfrage },
    secondary: { label: 'Preise ansehen', href: R.preise },
    microcopy: 'Beschreib kurz dein Ziel. Wir empfehlen dir den sinnvollen nächsten Schritt.',
    image: {
      src: '/photos/premium/offer-privat-square-1200.webp',
      alt: 'Persönlicher Tanzunterricht im hellen Salsaflow Studio',
    },
    cardLabel: 'Dein Ziel',
    cardText: 'Technik, Hochzeitstanz oder ein sicherer Einstieg. Persönlich begleitet.',
  },
  when: {
    title: 'Privatstunden sind sinnvoll, wenn du nicht allgemein üben willst, sondern gezielt weiterkommen möchtest.',
    titleAccent: 'gezielt',
    intro: 'Reguläre Kurse bauen dich Schritt für Schritt auf. Privatstunden setzen dort an, wo du persönliche Aufmerksamkeit brauchst.',
    cards: [
      { title: 'Hochzeitstanz', text: 'Wenn ein bestimmter Anlass näherkommt und ihr euch sicherer fühlen wollt.' },
      { title: 'Technik', text: 'Wenn du immer wieder an der gleichen Bewegung hängen bleibst.' },
      { title: 'Levelwechsel', text: 'Wenn du wissen willst, ob du bereit für das nächste Level bist.' },
      { title: 'Wiedereinstieg', text: 'Wenn du früher getanzt hast und nicht weisst, wo du wieder einsteigen sollst.' },
      { title: 'Paartanz als Paar', text: 'Wenn ihr gemeinsam lernen und in eurem Tempo arbeiten wollt.' },
      { title: 'Styling & Musikalität', text: 'Wenn du Bewegungen schöner, freier und musikalischer tanzen möchtest.' },
    ],
    cta: { label: 'Ziel beschreiben', href: R.privatAnfrage },
  },
  flow: {
    eyebrow: 'So funktioniert es',
    title: 'Eine gute Privatstunde beginnt nicht mit Figuren. Sie beginnt mit deinem Ziel.',
    titleAccent: 'Ziel',
    body: 'Je klarer dein Ziel, desto besser wird die Stunde.',
    steps: [
      { tag: 'Schritt 1', title: 'Ziel klären', text: 'Du sagst uns, was du verbessern willst oder welcher Anlass ansteht.' },
      { tag: 'Schritt 2', title: 'Fokus setzen', text: 'Wir wählen Technik, Bewegungen oder Übungen, die zu deinem Level passen.' },
      { tag: 'Schritt 3', title: 'Direkt korrigieren', text: 'Du bekommst Feedback im Moment, statt erst Wochen später zu merken, was nicht sitzt.' },
    ],
    cta: { label: 'Privatstunde buchen', href: R.privatAnfrage },
    // Runde 3, Issue 3: war /photos/gallery/kurse/03.jpg — ein Party-Schnappschuss unter
    // der Ueberschrift "Persoenliche Korrektur im Unterricht". Der wide-Crop der
    // Privatstunden-Strecke zeigt genau das: eine Lehrerin fuehrt Hand in Hand.
    image: {
      src: '/photos/premium/offer-privat-wide-original-v2.webp',
      alt: 'Persönliche Korrektur im Salsaflow Unterricht',
    },
  },
  formats: {
    title: 'Das Format richtet sich nach deinem Ziel.',
    items: [
      { name: 'Einzelperson', text: 'Ideal für Technik, Styling, Musikalität oder Level-Fragen.' },
      { name: 'Paar', text: 'Ideal für Hochzeitstanz, Paartanz-Sicherheit oder gemeinsames Lernen.' },
      { name: 'Kleingruppe', text: 'Sinnvoll, wenn mehrere Personen ein bestimmtes Thema oder einen Anlass vorbereiten.' },
    ],
  },
  prices: {
    title: 'Einzelstunde oder Paket?',
    titleAccent: 'Paket',
    body: 'Eine Einzelstunde passt, wenn du ein konkretes Thema testen oder eine Frage klären willst. Ein Paket lohnt sich, wenn du an einem Ziel über mehrere Wochen arbeiten möchtest, etwa Hochzeitstanz, Technik oder Levelaufbau.',
    rows: [
      { label: 'Privatstunde 1 Person', price: 'CHF 100.-' },
      { label: '5 Privatstunden 1 Person', price: 'CHF 450.-' },
      { label: 'Privatstunde Paar', price: 'CHF 130.-' },
      { label: '5 Privatstunden Paar', price: 'CHF 600.-' },
    ],
    cta: { label: 'Preise ansehen', href: R.preise },
    altCta: { label: 'Kursaufbau ansehen', href: R.kursaufbau },
  },
  notFor: {
    title: 'Nicht jede Frage braucht eine Privatstunde.',
    titleAccent: 'Privatstunde',
    body: 'Wenn du einfach herausfinden willst, ob Salsa oder Bachata zu dir passt, reicht oft eine Gratis Schnupperstunde. Wenn du aber ein klares Ziel, einen Anlass oder eine wiederkehrende Unsicherheit hast, ist Privatunterricht der schnellere Weg.',
    cta: { label: 'Schnupperstunde buchen', href: R.schnupper },
  },
  closing: {
    title: 'Beschreib uns dein Ziel. Wir sagen dir, was sinnvoll ist.',
    titleAccent: 'dein Ziel',
    body: 'Schreib kurz, ob es um Salsa, Bachata, Hochzeitstanz, Technik oder Level geht. So können wir dir schneller eine passende Empfehlung geben.',
    primary: { label: 'Privatstunde anfragen', href: R.privatAnfrage },
    secondary: { label: 'Kontakt aufnehmen', href: R.kontakt },
    microcopy: 'Persönlich · flexibel · direkt am Bahnhof SBB.',
  },
  faqEyebrow: 'Privatstunden FAQ',
  faqTitle: 'Häufige Fragen zu Privatstunden',
  faq: [
    {
      q: 'Wie viele Privatstunden brauche ich?',
      a: 'Das hängt vom Ziel ab. Für eine konkrete Technikfrage kann eine Stunde reichen. Für Hochzeitstanz oder sichtbare Fortschritte ist ein Paket oft sinnvoller.',
    },
    {
      q: 'Kann ich als Paar Privatstunden buchen?',
      a: 'Ja. Paar-Privatstunden sind besonders sinnvoll für Hochzeitstanz, Bachata/Salsa als Paar oder gezielte Paartanz-Sicherheit.',
    },
    {
      q: 'Kann ich eine Privatstunde ohne Vorkenntnisse buchen?',
      a: 'Ja, aber für reine Orientierung kann zuerst eine Schnupperstunde sinnvoller sein. Privatstunden sind stärker, wenn ein konkretes Ziel vorhanden ist.',
    },
    {
      q: 'Wo finden Privatstunden statt?',
      a: 'Im Salsaflow-Studio direkt am Bahnhof Basel SBB, sofern nichts anderes vereinbart wird.',
    },
  ],
};

const en: PrivatContent = {
  seo: 'privatstunden',
  crumb: { label: 'Private lessons', href: R.privat },
  hero: {
    eyebrow: 'Private lessons in Basel',
    title: 'Personal coaching for exactly what you want to improve.',
    titleAccent: 'improve',
    lead: 'In a private lesson you work directly on your goal: technique, rhythm, leading, following, styling, wedding dance or a safe entry into your next level.',
    bullets: [
      'personal correction instead of general course logic',
      'Salsa, Bachata, wedding dance and a technique focus possible',
      'for individuals, couples or small goals',
      'right in the Salsaflow studio at Basel SBB station',
    ],
    primary: { label: 'Request a private lesson', href: R.privatAnfrage },
    secondary: { label: 'See the prices', href: R.preise },
    microcopy: 'Describe your goal in a few words. We recommend the sensible next step.',
    image: {
      src: '/photos/premium/offer-privat-square-1200.webp',
      alt: 'Personal dance coaching in the bright Salsaflow studio',
    },
    cardLabel: 'Your goal',
    cardText: 'Technique, wedding dance or a safe start. Personally guided.',
  },
  when: {
    title: 'Private lessons make sense when you do not want to practise in general but want to make targeted progress.',
    titleAccent: 'targeted',
    intro: 'Regular courses build you up step by step. Private lessons start exactly where you need personal attention.',
    cards: [
      { title: 'Wedding dance', text: 'When a certain occasion is coming up and you want to feel more confident together.' },
      { title: 'Technique', text: 'When you keep getting stuck on the same movement.' },
      { title: 'Level change', text: 'When you want to know if you are ready for the next level.' },
      { title: 'Coming back', text: 'When you danced before and do not know where to start again.' },
      { title: 'Dancing as a couple', text: 'When you want to learn together and work at your own pace.' },
      { title: 'Styling & musicality', text: 'When you want to dance movements more beautifully, freely and musically.' },
    ],
    cta: { label: 'Describe your goal', href: R.privatAnfrage },
  },
  flow: {
    eyebrow: 'How it works',
    title: 'A good private lesson does not start with figures. It starts with your goal.',
    titleAccent: 'goal',
    body: 'The clearer your goal, the better the lesson.',
    steps: [
      { tag: 'Step 1', title: 'Clarify the goal', text: 'You tell us what you want to improve or which occasion is coming up.' },
      { tag: 'Step 2', title: 'Set the focus', text: 'We pick technique, movements or exercises that fit your level.' },
      { tag: 'Step 3', title: 'Correct on the spot', text: 'You get feedback in the moment, instead of noticing weeks later what is not working.' },
    ],
    cta: { label: 'Book a private lesson', href: R.privatAnfrage },
    image: {
      src: '/photos/premium/offer-privat-wide-original-v2.webp',
      alt: 'Personal correction in a Salsaflow class',
    },
  },
  formats: {
    title: 'The format follows your goal.',
    items: [
      { name: 'Individual', text: 'Ideal for technique, styling, musicality or level questions.' },
      { name: 'Couple', text: 'Ideal for a wedding dance, partner-dance confidence or learning together.' },
      { name: 'Small group', text: 'Useful when several people prepare a certain topic or occasion.' },
    ],
  },
  prices: {
    title: 'Single lesson or package?',
    titleAccent: 'package',
    body: 'A single lesson fits when you want to test a specific topic or clear up a question. A package is worth it when you want to work on a goal over several weeks, for example wedding dance, technique or level building.',
    rows: [
      { label: 'Private lesson, 1 person', price: 'CHF 100.-' },
      { label: '5 private lessons, 1 person', price: 'CHF 450.-' },
      { label: 'Private lesson, couple', price: 'CHF 130.-' },
      { label: '5 private lessons, couple', price: 'CHF 600.-' },
    ],
    cta: { label: 'See the prices', href: R.preise },
    altCta: { label: 'See the course structure', href: R.kursaufbau },
  },
  notFor: {
    title: 'Not every question needs a private lesson.',
    titleAccent: 'private lesson',
    body: 'If you simply want to find out whether Salsa or Bachata suits you, a free trial class is often enough. But if you have a clear goal, an occasion or a recurring uncertainty, private coaching is the faster way.',
    cta: { label: 'Book a trial class', href: R.schnupper },
  },
  closing: {
    title: 'Describe your goal. We will recommend the right format.',
    titleAccent: 'your goal',
    body: 'Tell us briefly whether your goal is Salsa, Bachata, a wedding dance, technique or level placement. We can then recommend the right format.',
    primary: { label: 'Request a private lesson', href: R.privatAnfrage },
    secondary: { label: 'Get in touch', href: R.kontakt },
    microcopy: 'Personal · flexible · right by Basel SBB station.',
  },
  faqEyebrow: 'Private lessons FAQ',
  faqTitle: 'Common questions about private lessons',
  faq: [
    {
      q: 'How many private lessons do I need?',
      a: 'It depends on your goal. For a specific technique question, one lesson can be enough. For a wedding dance or visible progress, a package is often more useful.',
    },
    {
      q: 'Can I book private lessons as a couple?',
      a: 'Yes. Couple private lessons are especially useful for a wedding dance, Bachata or Salsa as a couple or focused partner-dance confidence.',
    },
    {
      q: 'Can I book a private lesson without any experience?',
      a: 'Yes. If you first want to explore a dance style, a trial class may be enough. A private lesson is useful when you have a specific goal.',
    },
    {
      q: 'Where do private lessons take place?',
      a: 'In the Salsaflow studio right by Basel SBB station, unless something else is arranged.',
    },
  ],
};

export const PRIVAT: Record<Lang, PrivatContent> = { de, en };
