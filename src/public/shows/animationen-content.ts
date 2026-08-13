// Inhalt der Unterseite "Shows & Animationen" (/shows-animationen), zweisprachig DE/EN.
// Copy 1:1 aus dem V3-Copyplan (pages/07_shows-animationen.md). Die Tanz-Crew von Salsaflow
// bringt Shows, Tanzanimationen und Workshops an Firmenanlaesse, Hochzeiten, Polterabende und
// Geburtstage. de = Plan-Wortlaut, en = treue Uebersetzung.
//
// Regeln (BUILD-V3-SUBAGENT-BRIEF): echte Umlaute, CH-ss, keine Em-Dashes (Komma statt " ,").
// KEINE erfundenen Zahlen, KEINE Preise (Show-Preise laufen individuell ueber die Anfrage).
// Bilder: nur echte Buehnen-Fotos aus /photos/shows. Uebersprungen sind die leeren Platzhalter
// (show-05/06/18, je 66 Byte), die Logo-Grafiken (show-01/10) und Fotos mit Fremd-Watermark
// (show-04/22 "Bail Adoro", show-15 Fremd-Event-Logo). Primaerer CTA -> /kontakt#animationen:
// wer eine Show anfragt, will kein Formular fuer die Gratis-Tanzstunde.

import type { Lang } from '@/lib/i18n';
import type { Crumb, Faq } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };

/** Ein Format-Block in der Angebot-Sektion (Show / Animation / Workshop). Icon waehlt die Seite. */
export type ShowFormat = { name: string; what: string; fit: string; cta: Cta };

export type ShowsAnimContent = {
  crumb: Crumb;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    bullets: string[];
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  occasions: {
    eyebrow: string;
    titleA: string;
    titleAccent: string;
    titleB: string;
    lead: string;
    cards: { title: string; text: string }[];
    cta: Cta;
    image: Img;
  };
  formats: {
    eyebrow: string;
    titleA: string;
    titleAccent: string;
    whatLabel: string;
    fitLabel: string;
    items: ShowFormat[]; // genau drei: Show / Animation / Workshop
    combo: { name: string; what: string; fit: string };
    image: Img;
  };
  process: {
    title: string;
    steps: { title: string; text: string }[]; // vier Schritte
    cta: Cta;
    microcopy: string;
  };
  gallery: {
    titleAccent: string; // ein Script-Akzentwort am Kopf der Headline
    titleRest: string;
    photos: Img[]; // fuenf echte Buehnen-Fotos (1 Feature + 4)
    link: Cta;
  };
  closing: {
    titleA: string;
    titleAccent: string;
    titleB: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
  faq: { eyebrow: string; title: string; items: Faq[] };
};

// Anfrage-Anker dieser Seite. Vorher #schnupperstunde: Wer eine Show fuer sein Firmenfest
// anfragen wollte, landete im Formular fuer die Gratis-Tanzstunde und wurde nach Tanzstil und
// Wochentag gefragt. #animationen setzt das richtige Anliegen und die passende Rueckfrage.
const ANFRAGE = '/kontakt#animationen';
const KONTAKT = '/kontakt';

export const SHOWS_ANIM: Record<Lang, ShowsAnimContent> = {
  de: {
    crumb: { label: 'Shows & Animationen', href: '/shows-animationen' },
    hero: {
      eyebrow: 'Shows · Workshops · Animationen',
      title: 'Latin-Energie, die deine Gäste in Bewegung bringt.',
      lead: 'Ob Firmenanlass, Hochzeit, Polterabend oder Geburtstag: Salsaflow bringt Shows, Tanzanimationen und Workshops an dein Event, professionell, lebendig und passend zum Anlass.',
      bullets: [
        'Show-Auftritt für Bühne oder Eventfläche',
        'Tanzanimation für Gäste',
        'Workshop als gemeinsames Erlebnis',
        'Kombinationen auf Anfrage',
        'Individuelle Planung je nach Anlass und Raum',
      ],
      primary: { label: 'Event-Anfrage senden', href: ANFRAGE },
      secondary: { label: 'Beispiele ansehen', href: '#beispiele' },
      microcopy: 'Sag uns Anlass, Datum, Ort und gewünschte Stimmung.',
      image: {
        src: '/photos/shows/show-12.webp',
        alt: 'Salsaflow-Tanzcrew in dynamischer Bewegung auf dunkler Bühne, Tänzerinnen in violetten Fransenkleidern und Tänzer in Grün',
      },
      cardLabel: 'Für dein Event',
      cardText: 'Show, Animation und Workshop aus einer Hand.',
    },
    occasions: {
      eyebrow: 'Für welche Anlässe',
      titleA: 'Wenn Menschen zusammenkommen, darf Bewegung',
      titleAccent: 'entstehen.',
      titleB: '',
      lead: 'Nicht jeder Anlass braucht dieselbe Energie.',
      cards: [
        {
          title: 'Firmenanlass',
          text: 'Für Teams, die nicht nur sitzen und zuhören sollen. Eine Animation oder ein Workshop lockert den Abend und schafft gemeinsame Momente.',
        },
        {
          title: 'Hochzeit',
          text: 'Für ein Highlight zwischen Apéro, Dinner oder Party. Möglich als Show, Animation oder Tanzmoment mit den Gästen.',
        },
        {
          title: 'Polterabend',
          text: 'Für Gruppen, die etwas Aktives, Lustiges und Erinnerbares suchen.',
        },
        {
          title: 'Geburtstag / Private Feier',
          text: 'Für alle, die Gäste überraschen und Stimmung in den Raum bringen wollen.',
        },
      ],
      cta: { label: 'Anlass beschreiben', href: ANFRAGE },
      image: {
        src: '/photos/shows/show-13.webp',
        alt: 'Salsaflow-Tänzer bringen die Gäste einer Firmen-Weihnachtsfeier vor dem Christbaum in Bewegung',
      },
    },
    formats: {
      eyebrow: 'Formate',
      titleA: 'Drei Wege, dein Event zu',
      titleAccent: 'bewegen.',
      whatLabel: 'Was passiert',
      fitLabel: 'Passt, wenn',
      items: [
        {
          name: 'Show',
          what: 'Professioneller Tanzauftritt mit Musik, Kostüm, Choreografie und Bühnengefühl.',
          fit: 'du einen starken Programmpunkt willst, ohne dass Gäste selbst tanzen müssen.',
          cta: { label: 'Show anfragen', href: ANFRAGE },
        },
        {
          name: 'Animation',
          what: 'Tänzerinnen und Tänzer holen Gäste behutsam in Bewegung, bringen einfache Schritte rein und schaffen Stimmung.',
          fit: 'die Party Energie braucht und die Gäste mitmachen dürfen.',
          cta: { label: 'Animation anfragen', href: ANFRAGE },
        },
        {
          name: 'Workshop',
          what: 'Gäste lernen einfache Salsa- und Bachata-Schritte oder ein kurzes Thema in lockerer Atmosphäre.',
          fit: 'du ein gemeinsames Erlebnis statt nur Unterhaltung willst.',
          cta: { label: 'Workshop anfragen', href: ANFRAGE },
        },
      ],
      combo: {
        name: 'Kombination',
        what: 'Erst Show, dann Animation oder Workshop.',
        fit: 'der Abend einen klaren Höhepunkt und danach Beteiligung bekommen soll.',
      },
      image: {
        src: '/photos/shows/show-16.webp',
        alt: 'Salsaflow-Company beim Finale einer Show, alle mit weit ausgestreckten Armen auf der Bühne',
      },
    },
    process: {
      title: 'So wird aus deiner Anfrage ein passendes Format.',
      steps: [
        { title: 'Anlass beschreiben', text: 'Firmenanlass, Hochzeit, Geburtstag, Polterabend oder andere Idee.' },
        { title: 'Rahmen klären', text: 'Datum, Ort, Raumgrösse, Gästeanzahl, Zeitfenster.' },
        { title: 'Format empfehlen', text: 'Show, Animation, Workshop oder Kombination.' },
        { title: 'Angebot erhalten', text: 'Du bekommst eine klare Empfehlung und ein individuelles Angebot.' },
      ],
      cta: { label: 'Event-Anfrage starten', href: ANFRAGE },
      microcopy: 'Je konkreter die Anfrage, desto schneller können wir passend antworten.',
    },
    gallery: {
      titleAccent: 'Salsaflow',
      titleRest: 'auf der Bühne und mitten im Publikum.',
      photos: [
        {
          src: '/photos/shows/show-07.webp',
          alt: 'Grosse Salsaflow-Tanzcompany posiert nach der Show gemeinsam auf der Bühne',
        },
        {
          src: '/photos/shows/show-08.webp',
          alt: 'Weihnachts-Show mit Samichlaus und einer Tänzerin in Rot auf der Bühne',
        },
        {
          src: '/photos/shows/show-17.webp',
          alt: 'Tänzer mit Mikrofon animiert die Gäste eines Firmenanlasses zum Mitmachen',
        },
        {
          src: '/photos/shows/show-03.webp',
          alt: 'Themen-Show der Company in zerrissenen Kostümen unter pinkem Bühnenlicht',
        },
        {
          src: '/photos/shows/show-11.webp',
          alt: 'Salsaflow-Gruppe in violetten Kostümen auf der Bühne, ein Tänzer in Weiss in der Mitte',
        },
      ],
      link: { label: 'Alle Fotos ansehen', href: '/fotos' },
    },
    closing: {
      titleA: 'Erzähl uns von deinem',
      titleAccent: 'Event.',
      titleB: 'Wir empfehlen dir das passende Format.',
      body: 'Schreib uns Anlass, Datum und gewünschte Stimmung. Wir schlagen dir ein Format vor, das zum Raum, Publikum und Ablauf passt.',
      primary: { label: 'Event anfragen', href: ANFRAGE },
      secondary: { label: 'Kontakt aufnehmen', href: KONTAKT },
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Häufige Fragen zu Shows und Animationen',
      items: [
        {
          q: 'Für welche Events kann man Salsaflow buchen?',
          a: 'Für Firmenanlässe, Hochzeiten, Polterabende, Geburtstage und private oder öffentliche Events. Das passende Format hängt von Raum, Publikum und Ziel ab.',
        },
        {
          q: 'Bietet Salsaflow nur Shows oder auch Mitmachformate?',
          a: 'Beides. Möglich sind Show, Animation, Workshop oder eine Kombination.',
        },
        {
          q: 'Wie viel kostet eine Show oder Animation?',
          a: 'Das hängt von Format, Dauer, Ort, Teamgrösse und Aufwand ab. Deshalb machen wir dir nach deiner Anfrage ein individuelles Angebot statt einer Pauschale.',
        },
        {
          q: 'Wie früh sollte ich anfragen?',
          a: 'So früh wie möglich, besonders bei Wochenenden und grossen Events.',
        },
      ],
    },
  },

  en: {
    crumb: { label: 'Shows & animation', href: '/shows-animationen' },
    hero: {
      eyebrow: 'Shows · Workshops · Animation',
      title: 'Latin energy that gets your guests moving.',
      lead: 'Whether a company event, wedding, pre-wedding party or birthday: Salsaflow brings shows, dance animations and workshops to your event, professional, lively and right for the occasion.',
      bullets: [
        'Show performance for stage or event floor',
        'Dance animation for your guests',
        'Workshop as a shared experience',
        'Combinations on request',
        'Individual planning to fit the occasion and the room',
      ],
      primary: { label: 'Send an event request', href: ANFRAGE },
      secondary: { label: 'See examples', href: '#beispiele' },
      microcopy: 'Tell us the occasion, date, place and the mood you want.',
      image: {
        src: '/photos/shows/show-12.webp',
        alt: 'Salsaflow dance crew in dynamic motion on a dark stage, dancers in purple fringe dresses and men in green',
      },
      cardLabel: 'For your event',
      cardText: 'Show, animation and workshop from one team.',
    },
    occasions: {
      eyebrow: 'For which occasions',
      titleA: 'When people come together,',
      titleAccent: 'movement',
      titleB: 'can happen.',
      lead: 'Not every occasion needs the same energy.',
      cards: [
        {
          title: 'Company event',
          text: 'For teams that should not just sit and listen. An animation or a workshop loosens up the evening and creates shared moments.',
        },
        {
          title: 'Wedding',
          text: 'For a highlight between the apéro, dinner or party. Possible as a show, an animation or a dance moment with your guests.',
        },
        {
          title: 'Pre-wedding party',
          text: 'For groups looking for something active, fun and memorable.',
        },
        {
          title: 'Birthday / private party',
          text: 'For anyone who wants to surprise their guests and bring energy into the room.',
        },
      ],
      cta: { label: 'Describe your occasion', href: ANFRAGE },
      image: {
        src: '/photos/shows/show-13.webp',
        alt: 'Salsaflow dancers get the guests of a company Christmas party moving in front of the Christmas tree',
      },
    },
    formats: {
      eyebrow: 'Formats',
      titleA: 'Three ways to get your event',
      titleAccent: 'moving.',
      whatLabel: 'What happens',
      fitLabel: 'Fits when',
      items: [
        {
          name: 'Show',
          what: 'A professional dance performance with music, costumes, choreography and stage presence.',
          fit: 'you want a strong highlight without your guests having to dance themselves.',
          cta: { label: 'Request a show', href: ANFRAGE },
        },
        {
          name: 'Animation',
          what: 'Our dancers gently get your guests moving, bring in simple steps and create a great mood.',
          fit: 'the party needs energy and your guests are up for joining in.',
          cta: { label: 'Request an animation', href: ANFRAGE },
        },
        {
          name: 'Workshop',
          what: 'Guests learn simple Salsa and Bachata steps or a short theme in a relaxed setting.',
          fit: 'you want a shared experience instead of just entertainment.',
          cta: { label: 'Request a workshop', href: ANFRAGE },
        },
      ],
      combo: {
        name: 'Combination',
        what: 'First the show, then an animation or a workshop.',
        fit: 'the evening needs a clear highlight and some participation afterwards.',
      },
      image: {
        src: '/photos/shows/show-16.webp',
        alt: 'Salsaflow company at the finale of a show, everyone with arms wide open on stage',
      },
    },
    process: {
      title: 'How your request turns into the right format.',
      steps: [
        { title: 'Describe the occasion', text: 'Company event, wedding, birthday, pre-wedding party or another idea.' },
        { title: 'Clarify the setting', text: 'Date, place, room size, number of guests, time slot.' },
        { title: 'Recommend a format', text: 'Show, animation, workshop or a combination.' },
        { title: 'Get an offer', text: 'You receive a clear recommendation and an individual offer.' },
      ],
      cta: { label: 'Start your event request', href: ANFRAGE },
      microcopy: 'The more details you share, the more precisely we can recommend a format.',
    },
    gallery: {
      titleAccent: 'Salsaflow',
      titleRest: 'on stage and among your guests.',
      photos: [
        {
          src: '/photos/shows/show-07.webp',
          alt: 'Large Salsaflow dance company posing together on stage after the show',
        },
        {
          src: '/photos/shows/show-08.webp',
          alt: 'Christmas show with Santa and a dancer in red on stage',
        },
        {
          src: '/photos/shows/show-17.webp',
          alt: 'A dancer with a microphone gets the guests of a company event to join in',
        },
        {
          src: '/photos/shows/show-03.webp',
          alt: 'Themed company show in ripped costumes under pink stage light',
        },
        {
          src: '/photos/shows/show-11.webp',
          alt: 'Salsaflow group in purple costumes on stage, one dancer in white in the centre',
        },
      ],
      link: { label: 'See all photos', href: '/fotos' },
    },
    closing: {
      titleA: 'Tell us about your',
      titleAccent: 'event.',
      titleB: 'We recommend the right format.',
      body: 'Tell us the occasion, the date and the mood you want. We suggest a format that fits the room, the audience and the flow of your event.',
      primary: { label: 'Request an event', href: ANFRAGE },
      secondary: { label: 'Get in touch', href: KONTAKT },
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common questions about shows and animation',
      items: [
        {
          q: 'Which events can you book Salsaflow for?',
          a: 'For company events, weddings, pre-wedding parties, birthdays and private or public events. The right format depends on the room, the audience and the goal.',
        },
        {
          q: 'Does Salsaflow only offer shows or also formats to join in?',
          a: 'Both. A show, an animation, a workshop or a combination are all possible.',
        },
        {
          q: 'How much does a show or animation cost?',
          a: 'It depends on the format, length, place, team size and effort. That is why we send you an individual offer after your request instead of a flat price.',
        },
        {
          q: 'How early should I get in touch?',
          a: 'As early as possible, especially for weekends and large events.',
        },
      ],
    },
  },
};
