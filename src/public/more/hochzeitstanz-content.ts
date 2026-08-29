// Inhalt der Ratgeberseite /mehr/hochzeitstanz (SEO-Research 29.08.2026: kein Messvolumen fuer
// "hochzeitstanz basel", aber hoher Auftragswert; /privatstunden nennt Hochzeitstanz bereits
// als Use-Case, preise/content.ts:313 ebenfalls).
//
// PREISE: hier steht KEINE Zahl. Die Privatstunden-Tarife leben in preise/content.ts (Stand
// 29.08.2026: CHF 100.- Einzelperson, CHF 130.- Paar, 5er-Karten 450.- / 600.-). Diese Seite
// verlinkt sie nur, damit ein Tarifwechsel genau eine Datei betrifft.
//
// Zeitangaben in der Zeitplan-Sektion sind Empfehlungen, keine Versprechen: sie stehen als
// "wir empfehlen" und nicht als Erfolgsgarantie. CH-ss, echte Umlaute, keine Em-Dashes.

import type { Lang } from '@/lib/i18n';
import type { Faq, Crumb } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Step = { title: string; text: string };

export type HochzeitstanzContent = {
  crumbs: Crumb[];
  hero: {
    title: string;
    titleAccent: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
  };
  flow: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    items: Step[];
    cta: Cta;
    ctaSecondary: Cta;
  };
  realistic: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    items: string[];
    note: string;
  };
  music: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    items: string[];
  };
  timing: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    rows: { when: string; what: string }[];
  };
  faqEyebrow: string;
  faqTitle: string;
  faq: Faq[];
  closing: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
};

export const HOCHZEITSTANZ = {
  de: {
    crumbs: [{ label: 'Hochzeitstanz', href: '/mehr/hochzeitstanz' }],
    hero: {
      title: 'Hochzeitstanz in Basel: Entspannt',
      titleAccent: 'vorbereitet.',
      lead: 'Ihr braucht keine Choreografie aus dem Fernsehen. Ihr braucht ein paar Minuten, in denen ihr euch sicher fühlt.',
      primary: { label: 'Privatstunde anfragen', href: '/privatstunden' },
      secondary: { label: 'Preise ansehen', href: '/preise' },
      microcopy: 'Termine nach Absprache, auch ausserhalb der Kurszeiten.',
    },
    flow: {
      eyebrow: 'So läuft es ab',
      title: 'Vier Termine, ein ruhiger',
      titleAccent: 'Ablauf.',
      lead: 'Der Hochzeitstanz läuft bei uns über Privatstunden, nicht über einen Gruppenkurs. Ihr bestimmt Tempo, Musik und wie weit ihr gehen wollt.',
      items: [
        {
          title: 'Erstes Gespräch',
          text: 'Ihr schreibt uns, wann geheiratet wird und ob ihr schon ein Lied habt. Wir klären, wie viele Stunden realistisch sind und wer von uns zu euch passt.',
        },
        {
          title: 'Erste Stunde',
          text: 'Wir schauen uns euren Song an, finden die Zählweise und bauen den Grundschritt. Am Ende der ersten Stunde könnt ihr zu eurer Musik zusammen gehen, auch wenn es noch schlicht aussieht.',
        },
        {
          title: 'Aufbau',
          text: 'In den folgenden Stunden kommen Anfang, ein Übergang und ein Schluss dazu. Wir bauen nur so viel, wie ihr euch zwischen den Terminen merken könnt.',
        },
        {
          title: 'Letzte Stunde',
          text: 'Wir laufen den ganzen Tanz mehrfach durch, klären Kleid und Schuhe und üben die Stellen, an denen Nervosität zuschlägt: den Anfang und den Moment, in dem alle schauen.',
        },
      ],
      cta: { label: 'Privatstunde anfragen', href: '/privatstunden' },
      ctaSecondary: { label: 'Preise für Privatstunden', href: '/preise' },
    },
    realistic: {
      eyebrow: 'Was drin ist',
      title: 'Was in drei bis fünf Stunden wirklich',
      titleAccent: 'geht.',
      body: 'Drei bis fünf Privatstunden reichen für einen Tanz, der zu euch passt und sicher läuft. Was in dieser Zeit nicht entsteht, ist eine Bühnenchoreografie mit Hebefiguren. Das ist selten ein Verlust, weil euer Publikum ohnehin auf euch schaut und nicht auf die Technik.',
      items: [
        'Ein Anfang, der geübt ist, damit die erste Sekunde nicht improvisiert wirkt',
        'Grundschritt und zwei bis drei Figuren, die ihr sicher könnt',
        'Ein Übergang, mit dem ihr euch auf der Fläche bewegt statt auf einem Fleck zu stehen',
        'Ein klarer Schluss, damit der Applaus einen Zeitpunkt hat',
        'Ein Plan für den Moment, in dem die Gäste dazukommen',
      ],
      note: 'Wenn ihr mehr wollt, geht mehr. Es ist nur keine Voraussetzung für einen schönen Abend.',
    },
    music: {
      eyebrow: 'Musikwahl',
      title: 'Das Lied ist die halbe',
      titleAccent: 'Miete.',
      body: 'Bringt euer Lied mit, auch wenn ihr unsicher seid, ob man dazu tanzen kann. Fast jedes Stück lässt sich tanzen, wenn man den richtigen Stil dazu wählt. Wir hören es uns in der ersten Stunde gemeinsam an.',
      items: [
        'Nehmt ein Lied, das euch etwas bedeutet. Ein technisch einfacherer Song, den ihr nicht mögt, wird auf der Fläche nicht besser.',
        'Drei bis vier Minuten sind eine gute Länge. Wird es länger, kürzen wir gemeinsam eine Version.',
        'Sehr langsame Balladen sind schwerer als sie klingen, weil jede Bewegung sichtbar bleibt.',
        'Wenn ihr noch kein Lied habt, schlagen wir euch etwas vor, das zu eurem Tempo passt.',
      ],
    },
    timing: {
      eyebrow: 'Zeitplan',
      title: 'Wann ihr anfangen',
      titleAccent: 'solltet.',
      lead: 'Diese Empfehlung geht von einem Termin pro Woche oder alle zwei Wochen aus. Kürzer geht auch, dann wird es dichter.',
      rows: [
        { when: 'Drei Monate vorher', what: 'Schreibt uns und sichert euch Termine. In der Hochsaison zwischen Mai und September sind die Abende schnell vergeben.' },
        { when: 'Acht Wochen vorher', what: 'Erste Stunde. Ab hier habt ihr Zeit, das Gelernte zwischendurch zu Hause zu wiederholen.' },
        { when: 'Vier Wochen vorher', what: 'Der Tanz steht in Grundzügen. Jetzt lohnt es sich, ihn in den Schuhen zu üben, die ihr am Fest tragt.' },
        { when: 'Eine Woche vorher', what: 'Letzte Stunde mit Durchläufen. Danach nichts Neues mehr dazunehmen.' },
      ],
    },
    faqEyebrow: 'Hochzeitstanz FAQ',
    faqTitle: 'Häufige Fragen von Paaren',
    faq: [
      {
        q: 'Wir haben beide noch nie getanzt. Reicht das?',
        a: 'Ja, das ist der Normalfall bei Hochzeitspaaren. Wir fangen beim Gewicht und beim Grundschritt an und bauen von dort. Vorkenntnisse machen den Weg kürzer, sie sind aber keine Bedingung.',
      },
      {
        q: 'Wie viele Stunden brauchen wir?',
        a: 'Für einen sicheren, schlichten Tanz rechnen wir mit drei bis fünf Privatstunden. Wie viele es am Ende werden, hängt davon ab, wie viel ihr zwischen den Terminen übt und wie aufwändig euer Lied ist.',
      },
      {
        q: 'Was kostet eine Privatstunde?',
        a: 'Die aktuellen Tarife für Einzelpersonen und Paare stehen auf der Preisseite, dort auch die Fünferkarten. Für Hochzeitspaare gilt der normale Paartarif.',
      },
      {
        q: 'Können wir zu unserem eigenen Lied tanzen?',
        a: 'Ja, und das ist uns lieber als ein Standardstück. Bringt die Aufnahme mit, wir hören sie in der ersten Stunde an und suchen den Stil, der dazu passt.',
      },
      {
        q: 'Was ist mit Kleid und Absätzen?',
        a: 'Übt spätestens ab der Hälfte in Schuhen, die den echten ähnlich sind. Beim Kleid reicht es, die Länge einmal auszuprobieren, damit ihr wisst, wie viel Platz ihr für Drehungen braucht.',
      },
      {
        q: 'Können auch Trauzeugen oder die Familie mitmachen?',
        a: 'Ja. Für grössere Gruppen und Überraschungseinlagen schaut euch die Seite Shows und Animationen an, dort steht, was wir für Anlässe anbieten.',
      },
    ],
    closing: {
      eyebrow: 'Nächster Schritt',
      title: 'Schreibt uns euer',
      titleAccent: 'Datum.',
      body: 'Nennt uns den Hochzeitstag und euer Lied, wenn ihr schon eines habt. Wir melden uns mit freien Terminen und einer ehrlichen Einschätzung, wie viele Stunden ihr braucht.',
      primary: { label: 'Privatstunde anfragen', href: '/privatstunden' },
      secondary: { label: 'Preise ansehen', href: '/preise' },
    },
  },
  en: {
    crumbs: [{ label: 'Wedding dance', href: '/mehr/hochzeitstanz' }],
    hero: {
      title: 'Wedding dance in Basel: calmly',
      titleAccent: 'prepared.',
      lead: 'You do not need a television choreography. You need a few minutes in which the two of you feel secure.',
      primary: { label: 'Request a private lesson', href: '/privatstunden' },
      secondary: { label: 'See prices', href: '/preise' },
      microcopy: 'Appointments by arrangement, also outside class hours.',
    },
    flow: {
      eyebrow: 'How it works',
      title: 'Four appointments, one calm',
      titleAccent: 'process.',
      lead: 'The wedding dance runs through private lessons here, not through a group course. You set the pace, the music and how far you want to go.',
      items: [
        {
          title: 'First conversation',
          text: 'You write to us with your wedding date and tell us whether you already have a song. We clarify how many hours are realistic and who of us fits you.',
        },
        {
          title: 'First lesson',
          text: 'We listen to your song, find the count and build the basic step. By the end of the first lesson you can move together to your music, even if it still looks plain.',
        },
        {
          title: 'Building up',
          text: 'The following lessons add an opening, a transition and an ending. We only build as much as you can remember between appointments.',
        },
        {
          title: 'Last lesson',
          text: 'We run the whole dance several times, sort out dress and shoes and practise the moments where nerves hit: the start, and the moment everyone is watching.',
        },
      ],
      cta: { label: 'Request a private lesson', href: '/privatstunden' },
      ctaSecondary: { label: 'Prices for private lessons', href: '/preise' },
    },
    realistic: {
      eyebrow: 'What fits',
      title: 'What three to five hours really',
      titleAccent: 'cover.',
      body: 'Three to five private lessons are enough for a dance that suits you and runs safely. What does not appear in that time is a stage choreography with lifts. That is rarely a loss, because your guests are watching you and not the technique.',
      items: [
        'An opening you have practised, so the first second does not look improvised',
        'The basic step and two or three figures you can do reliably',
        'A transition that moves you across the floor instead of standing in one spot',
        'A clear ending, so the applause has a moment to start',
        'A plan for the moment when the guests join in',
      ],
      note: 'If you want more, more is possible. It is simply not a requirement for a good evening.',
    },
    music: {
      eyebrow: 'Choosing music',
      title: 'The song is half the',
      titleAccent: 'work.',
      body: 'Bring your song, even if you are unsure whether anyone can dance to it. Almost every track works once you pick the right style for it. We listen to it together in the first lesson.',
      items: [
        'Take a song that means something to you. A technically easier track you do not like will not improve on the floor.',
        'Three to four minutes is a good length. If it runs longer, we shorten a version together.',
        'Very slow ballads are harder than they sound, because every movement stays visible.',
        'If you have no song yet, we suggest something that matches your pace.',
      ],
    },
    timing: {
      eyebrow: 'Timing',
      title: 'When to',
      titleAccent: 'start.',
      lead: 'This recommendation assumes one appointment per week or every second week. Shorter works too, it just gets denser.',
      rows: [
        { when: 'Three months before', what: 'Write to us and secure your slots. Between May and September the evenings fill up quickly.' },
        { when: 'Eight weeks before', what: 'First lesson. From here you have time to repeat what you learned at home.' },
        { when: 'Four weeks before', what: 'The dance is broadly in place. Now it pays to practise in the shoes you will wear.' },
        { when: 'One week before', what: 'Last lesson with full run-throughs. After that, nothing new gets added.' },
      ],
    },
    faqEyebrow: 'Wedding dance FAQ',
    faqTitle: 'Common questions from couples',
    faq: [
      {
        q: 'Neither of us has ever danced. Is that enough?',
        a: 'Yes, that is the normal case for wedding couples. We start with weight and the basic step and build from there. Previous experience shortens the path but is not a condition.',
      },
      {
        q: 'How many hours do we need?',
        a: 'For a secure, simple dance we count on three to five private lessons. How many it becomes depends on how much you practise between appointments and how demanding your song is.',
      },
      {
        q: 'What does a private lesson cost?',
        a: 'The current rates for individuals and couples are on the prices page, including the five-lesson cards. Wedding couples pay the normal couple rate.',
      },
      {
        q: 'Can we dance to our own song?',
        a: 'Yes, and we prefer that to a standard track. Bring the recording, we listen to it in the first lesson and find the style that fits.',
      },
      {
        q: 'What about the dress and heels?',
        a: 'From halfway through, practise in shoes similar to the real ones. For the dress it is enough to try the length once, so you know how much room you need for turns.',
      },
      {
        q: 'Can the wedding party or family join in?',
        a: 'Yes. For larger groups and surprise performances, see the shows and animation page for what we offer at events.',
      },
    ],
    closing: {
      eyebrow: 'Next step',
      title: 'Send us your',
      titleAccent: 'date.',
      body: 'Tell us the wedding day and your song, if you already have one. We come back with free slots and an honest estimate of how many hours you need.',
      primary: { label: 'Request a private lesson', href: '/privatstunden' },
      secondary: { label: 'See prices', href: '/preise' },
    },
  },
} satisfies Record<Lang, HochzeitstanzContent>;
