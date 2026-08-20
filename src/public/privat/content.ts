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
    /** R140: Die drei haeufigsten Anlaesse. Sie bleiben Karten und tragen den Block. */
    cards: { title: string; text: string }[];
    /** R140: Die restlichen Anlaesse als leise Zeile darunter, nicht als vierte bis
     *  sechste gleich laute Karte (Video 04:21 «viel zu viel», Frame p-08). */
    moreLabel: string;
    more: string[];
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
  schnupper: '/schnupperstunde',
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
    // R140 (Video 04:21 «viel zu viel Text»): Headline von 8 auf 5 Wörter, Lead von
    // 30 auf 14 Wörter, vier Chips auf drei. Aussage und Ziel-Liste bleiben.
    title: 'Unterricht für genau dein Ziel.',
    titleAccent: 'dein Ziel',
    lead: 'Technik, Hochzeitstanz oder der Sprung ins nächste Level. Du sagst, woran du arbeiten willst.',
    bullets: [
      'persönliche Korrektur statt Kurslogik',
      'Salsa, Bachata, Hochzeitstanz, Technik',
      'im Studio am Bahnhof SBB',
    ],
    primary: { label: 'Privatstunde anfragen', href: R.privatAnfrage },
    secondary: { label: 'Preise ansehen', href: R.preise },
    microcopy: 'Beschreib kurz dein Ziel. Wir empfehlen dir den nächsten Schritt.',
    // R177b: party-04 war warm/orange (Opus FAIL). party-31-v3: weisse Wand,
    // blaues Licht, Frau frontal, Mann Gesicht sichtbar. Mittel 91.3.
    // Nicht studiowand, nicht party-33, nicht KI. Crop in PrivatstundenPage.
    image: {
      src: '/photos/party/party-31-v3.webp',
      alt: 'Paar tanzt, die Frau lächelt in die Kamera, der Mann hinter ihr',
    },
    cardLabel: 'Dein Ziel',
    cardText: 'Technik, Hochzeitstanz oder ein sicherer Einstieg. Persönlich begleitet.',
  },
  when: {
    // R140: Titel von 16 auf 5 Wörter. Der alte Satz lief über drei Zeilen und sagte
    // dasselbe wie der Intro-Satz darunter.
    title: 'Wann sich das lohnt.',
    titleAccent: 'lohnt',
    intro: 'Kurse bauen dich Schritt für Schritt auf. Privatstunden setzen dort an, wo du Aufmerksamkeit brauchst.',
    // R140: Drei statt sechs Karten. Drei Anlässe tragen den Block, drei stehen
    // als leise Zeile darunter. Die Reihenfolge ist eine Layout-Entscheidung,
    // keine Häufigkeits-Aussage: dazu gibt es keine Zahlen vom Studio.
    cards: [
      { title: 'Hochzeitstanz', text: 'Ein Anlass steht an und ihr wollt euch sicher fühlen.' },
      { title: 'Technik', text: 'Du bleibst immer wieder an derselben Bewegung hängen.' },
      { title: 'Levelwechsel', text: 'Du willst wissen, ob du bereit für das nächste Level bist.' },
    ],
    // R140: Die restlichen Anlässe bleiben lesbar, aber leise. Label neutral:
    // «Ebenfalls häufig» behauptete eine Häufigkeit ohne Beleg.
    moreLabel: 'Weitere Anlässe',
    more: ['Wiedereinstieg nach einer Pause', 'Zusammen als Paar üben', 'Styling und Musikalität'],
    cta: { label: 'Ziel beschreiben', href: R.privatAnfrage },
  },
  flow: {
    eyebrow: 'So funktioniert es',
    // R140: Der alte Titel war eine Antithese-Figur («beginnt nicht mit Figuren.
    // Sie beginnt mit …», forbidden.md A2) und lief über drei Zeilen.
    title: 'So läuft eine Stunde ab.',
    titleAccent: 'Stunde',
    body: 'Je klarer dein Ziel, desto besser wird die Stunde.',
    steps: [
      { tag: 'Schritt 1', title: 'Ziel klären', text: 'Du sagst uns, woran du arbeiten willst.' },
      { tag: 'Schritt 2', title: 'Fokus setzen', text: 'Wir wählen Übungen, die zu deinem Level passen.' },
      { tag: 'Schritt 3', title: 'Direkt korrigieren', text: 'Du bekommst dein Feedback sofort, nicht Wochen später.' },
    ],
    cta: { label: 'Privatstunde buchen', href: R.privatAnfrage },
    // Runde 3, Issue 3: war /photos/gallery/kurse/03.jpg — ein Party-Schnappschuss unter
    // der Ueberschrift "Persoenliche Korrektur im Unterricht". Der wide-Crop der
    // Privatstunden-Strecke zeigt genau das: eine Lehrerin fuehrt Hand in Hand.
    //
    // R140 (Video 09:02 «viel zu dunkel und das ist auch falsch eingefaerbt»): erst weg
    // von offer-privat-wide-original-v2.webp (mean 124.5, R 130.1 / G 118.6 / B 124.7 —
    // Gruen unter Rot UND Blau, also Magenta-Stich).
    //
    // R140-Fix: offer-privat-1200.webp war der falsche Ersatz. Es ist derselbe Schnitt
    // wie der damalige quadratische Hero-Crop — gleiches Paar, gleiche Wand,
    // gleiches warmes Licht, nur naeher. Der Crop schnitt der Frau links das Gesicht an.
    // Jetzt gallery/kurse/06.jpg, per Read einzeln angesehen und gemessen:
    //   offer-privat-1200: mean 133.7, R 157.1 / G 129.7 / B 114.4  (warmes Kunstlicht)
    //   kurse/06.jpg:      mean 125.3, R 165.9 / G 116.4 /  B 93.4  (Tageslicht, die
    //     Rot-Spitze ist die rote Studiowand im Motiv, kein Weissabgleich-Fehler)
    // Scharf, Tageslicht, helles Parkett, alle Koepfe ganz im Bild, anderes Motiv als
    // der Hero. Es zeigt genau die Aussage der Sektion: jemand korrigiert vorne, die
    // Uebenden machen mit. Kein KI-Bild, kein Salsa-/Bachata-/Heels-Motiv.
    // Kein CSS-Filter als Ersatz: photo-grade-private ist raus, das Foto traegt sich selbst.
    //
    // Quadratisch statt 3:2: die Quelle ist hochkant (1066x1600). Bei 1:1 bleibt der
    // Lehrer ganz im Ausschnitt.
    image: {
      src: '/photos/gallery/kurse/06.jpg',
      alt: 'Tanzlehrer zeigt einen Schritt, die Übenden folgen im hellen Studio',
    },
  },
  formats: {
    // R140-Fix: «zu dritt» engte die Kleingruppe auf genau drei Personen ein und
    // widersprach der Zeile «Kleingruppe» darunter. Der Titel nennt jetzt dieselben
    // drei Formate wie die Liste.
    title: 'Allein, als Paar oder in kleiner Gruppe.',
    titleAccent: 'kleiner Gruppe',
    items: [
      { name: 'Einzelperson', text: 'Für Technik, Styling oder Level-Fragen.' },
      { name: 'Paar', text: 'Für Hochzeitstanz und Sicherheit als Paar.' },
      // R140-Fix: Thema war beim Kürzen weggefallen und stand nur noch als Anlass.
      { name: 'Kleingruppe', text: 'Wenn mehrere ein Thema oder einen Anlass vorbereiten.' },
    ],
  },
  prices: {
    title: 'Einzelstunde oder Paket?',
    titleAccent: 'Paket',
    // R140: von 38 auf 21 Wörter. Beide Fälle stehen weiter drin.
    body: 'Eine Einzelstunde passt für eine konkrete Frage. Ein Paket lohnt sich, wenn du über Wochen an einem Ziel arbeitest.',
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
    // R140: gekürzt. R140-Fix: «reicht» war eine absolute Zusage, im Plan stand
    // «oft». Anlass und wiederkehrendes Problem sind wieder drin: sie waren zwei
    // von drei Gründen für eine Privatstunde und fielen beim Kürzen weg.
    body: 'Für die erste Orientierung reicht oft die Gratis Schnupperstunde. Bei einem klaren Ziel, einem Anlass oder einem wiederkehrenden Problem kommst du mit Privatunterricht schneller weiter.',
    cta: { label: 'Schnupperstunde buchen', href: R.schnupper },
  },
  closing: {
    title: 'Beschreib uns dein Ziel.',
    titleAccent: 'dein Ziel',
    // R140: von 23 auf 15 Wörter.
    body: 'Schreib kurz, worum es geht: Salsa, Bachata, Hochzeitstanz, Technik oder Level. Wir empfehlen dir das passende Format.',
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
    title: 'Coaching for exactly your goal.',
    titleAccent: 'your goal',
    lead: 'Technique, a wedding dance or the step up to the next level. You tell us what to work on.',
    bullets: [
      'personal correction instead of course logic',
      'Salsa, Bachata, wedding dance, technique',
      'in the studio at Basel SBB station',
    ],
    primary: { label: 'Request a private lesson', href: R.privatAnfrage },
    secondary: { label: 'See the prices', href: R.preise },
    microcopy: 'Describe your goal in a few words. We recommend the next step.',
    // R177: same photo as DE. Not studiowand-01.
    image: {
      src: '/photos/party/party-31-v3.webp',
      alt: 'Couple dancing, the woman smiling at the camera, the man behind her',
    },
    cardLabel: 'Your goal',
    cardText: 'Technique, wedding dance or a safe start. Personally guided.',
  },
  when: {
    title: 'When it pays off.',
    titleAccent: 'pays off',
    intro: 'Courses build you up step by step. Private lessons start where you need attention.',
    cards: [
      { title: 'Wedding dance', text: 'An occasion is coming up and you want to feel confident.' },
      { title: 'Technique', text: 'You keep getting stuck on the same movement.' },
      { title: 'Level change', text: 'You want to know if you are ready for the next level.' },
    ],
    moreLabel: 'Other reasons',
    more: ['Coming back after a break', 'Practising together as a couple', 'Styling and musicality'],
    cta: { label: 'Describe your goal', href: R.privatAnfrage },
  },
  flow: {
    eyebrow: 'How it works',
    title: 'How a lesson runs.',
    titleAccent: 'lesson',
    body: 'The clearer your goal, the better the lesson.',
    steps: [
      { tag: 'Step 1', title: 'Clarify the goal', text: 'You tell us what you want to work on.' },
      { tag: 'Step 2', title: 'Set the focus', text: 'We pick exercises that fit your level.' },
      { tag: 'Step 3', title: 'Correct on the spot', text: 'You get your feedback right away, not weeks later.' },
    ],
    cta: { label: 'Book a private lesson', href: R.privatAnfrage },
    image: {
      src: '/photos/gallery/kurse/06.jpg',
      alt: 'Dance teacher showing a step while the students follow in the bright studio',
    },
  },
  formats: {
    title: 'Alone, as a couple or in a small group.',
    titleAccent: 'small group',
    items: [
      { name: 'Individual', text: 'For technique, styling or level questions.' },
      { name: 'Couple', text: 'For a wedding dance and confidence as a pair.' },
      { name: 'Small group', text: 'When several people prepare a topic or an occasion.' },
    ],
  },
  prices: {
    title: 'Single lesson or package?',
    titleAccent: 'package',
    body: 'A single lesson fits a specific question. A package is worth it when you work on a goal over several weeks.',
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
    body: 'For a first orientation, the free trial class is often enough. With a clear goal, an occasion or a recurring problem, private coaching gets you there faster.',
    cta: { label: 'Book a trial class', href: R.schnupper },
  },
  closing: {
    title: 'Describe your goal.',
    titleAccent: 'your goal',
    body: 'Tell us briefly what it is about: Salsa, Bachata, a wedding dance, technique or level. We will recommend the right format.',
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

export const PRIVAT = { de, en } satisfies Record<Lang, PrivatContent>;
