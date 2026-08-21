// Inhalt der Events-&-Workshops-Seite (Etappe 12), zweisprachig DE/EN.
// Quelle der Fakten: wiki.md + Briefing. Danceflow Night = jeden 1., 3. und 5. Freitag Social
// Dancing am Bahnhof Basel SBB (oeffentlich; genaue Adresse Elisabethenanlage 7 nur intern, nie
// auf die Seite). Daneben Workshops vor der Night, das Anniversary Weekend und das Floweekend.
// Ticketverkauf + Kalender laufen ueber Eventfrog (Link, kein Embed). Copy nach Regel 003/069/085
// (simpel, du-Form, echte Umlaute, CH-ss, keine Em-Dashes, ~50 Woerter pro Sektion). Einzige
// Preis-Ausnahme: Danceflow-Eintritt (Schueler 5 CHF, Gaeste 10 CHF) laut Spec. KEINE erfundenen Zitate.

import type { Lang } from '@/lib/i18n';

/** Ein Eckdaten-Paar in der Danceflow-Sektion (Label + Wert). */
export type EventFact = { label: string; value: string };

/** Eine Karte der Event-Preview (R188 E3). Ein Event, ein Bild, ein Weg. */
export type EventPreviewCard = {
  title: string;
  /** Ein Satz, was der Abend ist. Bewusst kurz — die Karte ist ein Wegweiser, kein Text. */
  text: string;
  /** Rhythmus oder Format in wenigen Woertern (steht als Meta-Zeile ueber dem Titel). */
  meta: string;
  image: { src: string; alt: string; position: string };
  href: string;
  ctaLabel: string;
};

export type EventsContent = {
  hero: {
    eyebrow: string;
    titleA: string;
    titleAccent: string; // ein Wort in Rot
    titleB: string;
    lead: string;
    ctaTickets: string;
    ctaScroll: string;
  };
  danceflow: {
    eyebrow: string;
    title: string;
    body: string;
    factsTitle: string;
    facts: EventFact[];
    ctaTickets: string;
    note: string;
  };
  /** R188 E3: Preview aller Event-Typen. Genau vier Karten, je ein Weg. */
  preview: { title: string; lead: string; cards: EventPreviewCard[] };
  gallery: { eyebrow: string; title: string; lead: string };
  workshops: { eyebrow: string; title: string; body: string; points: string[] };
  anniversary: { eyebrow: string; title: string; body: string };
  floweekend: { eyebrow: string; badge: string; title: string; body: string; ctaTickets: string };
  tickets: { eyebrow: string; title: string; body: string; cta: string };
  closing: { title: string; body: string; cta: string; secondary: string };
};

export const EVENTS = {
  de: {
    hero: {
      eyebrow: 'Danceflow Night · Workshops · Weekends',
      titleA: 'Dein Kurs endet nicht',
      titleAccent: 'nach der Stunde.',
      titleB: '',
      lead: 'Bei Salsaflow findest du regelmässige Events, Workshops und Socials, damit aus Technik echte Tanzabende werden.',
      ctaTickets: 'Nächste Events ansehen',
      ctaScroll: 'Danceflow Night öffnen',
    },
    danceflow: {
      eyebrow: '',
      title: 'Lernen ist der Anfang. Tanzen passiert in der Community.',
      body: 'Ein Kurs gibt dir Struktur. Ein Event gibt dir Wiederholung, Begegnung und echte Tanzsituationen. Du übst, was du gelernt hast, lernst neue Menschen kennen und bleibst leichter dran, weil Tanzen sozial wird.',
      factsTitle: 'Gut zu wissen',
      // R142: vorher sechs gleich laute Fact-Chips ("richtig lost", Video 05:38). Jetzt drei
      // Bloecke: Termin, Abend, Publikum. Die Pflicht-Fakten bleiben wortgleich drin —
      // 1./3./5. Freitag im ersten Wert, CHF 5.-/10.- im zweiten.
      facts: [
        { label: 'Termin', value: 'Jeden 1., 3. und 5. Freitag am Bahnhof Basel SBB' },
        { label: 'Abend', value: 'Social Dancing mit eigenen DJs. Schüler CHF 5.-, Gäste CHF 10.-' },
        { label: 'Publikum', value: 'Alle Levels, allein oder zu zweit. Tanzende aus der Schweiz, Frankreich und Deutschland' },
      ],
      ctaTickets: 'Nächste Danceflow Night ansehen',
      note: 'Oft gibt es vor der Night einen kurzen Workshop. Den genauen Plan findest du auf Eventfrog.',
    },
    /* R188 E3 (Video 03:09 "Diese Sektion sieht übelst lost aus. Da würde ich so einen
       Preview machen von allen Events, die wir haben"). Alle vier Wege stehen als eine
       Reihe nebeneinander: Danceflow Night, Anniversary Weekend, Floweekend, Eventkalender.
       Jede Zeile ist ein Fakt aus der jeweiligen Unterseite, nichts ist erfunden:
       Rhythmus 1./3./5. Freitag aus danceflow-content.ts, Wochenend-Formate aus
       anniversary-/floweekend-content.ts, der Kalender aus eventkalender-content.ts. */
    preview: {
      title: 'Alle Events auf einen Blick.',
      lead: 'Vier Wege, mehr zu tanzen als nur im Kurs.',
      cards: [
        {
          title: 'Danceflow Night',
          meta: 'Jeden 1., 3. und 5. Freitag',
          text: 'Der Social-Dance-Abend am Bahnhof Basel SBB, mit eigenen DJs.',
          image: {
            src: '/photos/party/party-50-v4.webp',
            alt: 'Paar tanzt auf einer Danceflow Night, weitere Gäste im Hintergrund',
            position: 'object-[center_28%]',
          },
          href: '/events-workshops/danceflow-night',
          ctaLabel: 'Danceflow Night ansehen',
        },
        {
          title: 'Anniversary Weekend',
          meta: 'Einmal im Jahr',
          text: 'Das Community-Wochenende mit Workshops, Shows und Socials.',
          image: {
            src: '/photos/premium/events-hero-1998.webp',
            alt: 'Salsaflow-Community posiert nach einer Show auf der Bühne',
            position: 'object-[center_35%]',
          },
          href: '/events-workshops/anniversary-weekend',
          ctaLabel: 'Anniversary ansehen',
        },
        {
          title: 'Floweekend',
          meta: 'Wochenendformat',
          text: 'Workshops, Socials und Community in kompakter Form.',
          image: {
            src: '/photos/r188-events/floweekend-preview-2400.webp',
            alt: 'Paar tanzt gemeinsam bei einem Salsaflow-Event',
            position: 'object-center',
          },
          href: '/events-workshops/floweekend',
          ctaLabel: 'Floweekend ansehen',
        },
        {
          title: 'Eventkalender',
          meta: 'Termine und Workshops',
          text: 'Alle bestätigten Termine, Workshops und Tickets an einem Ort.',
          image: {
            src: '/photos/party/party-20-v3.webp',
            alt: 'Tanzende begrüssen sich lachend auf der Tanzfläche',
            position: 'object-[center_25%]',
          },
          href: '/events-workshops/eventkalender',
          ctaLabel: 'Zum Eventkalender',
        },
      ],
    },
    gallery: {
      eyebrow: '',
      title: 'Was möchtest du als Nächstes erleben?',
      lead: 'Danceflow Nights, Workshops und Weekends geben dir Zeit zum Üben, Vertiefen und Feiern.',
    },
    workshops: {
      eyebrow: 'Workshops',
      title: 'Ein Workshop gibt einem Thema einen ganzen Abend.',
      body: 'Du konzentrierst dich auf Technik, Figuren, Musikalität oder Styling und kannst das Gelernte danach direkt auf Events anwenden.',
      // R155: vorher vier kleine Punkte (Video 05:40, "Mini-Sachen lost"). Jetzt zwei
      // Bloecke, je ein Gedanke pro Satz: Punkt 1 traegt Technik, Styling und
      // Musikalitaet, Punkt 2 die Gastlehrer:innen. Keine neue Aussage.
      points: [
        'Dein Handwerk. Du lernst saubere Bewegung statt nur mehr Figuren. Du findest bewussten Ausdruck in Salsa, Bachata oder Heels. Du hörst die Musik besser und reagierst besser auf sie.',
        'Deine Special Topics. Dafür reisen Gastlehrer:innen monatlich aus ganz Europa an.',
      ],
    },
    anniversary: {
      eyebrow: 'Anniversary Weekend',
      title: 'Das grosse Community-Wochenende rund um Salsaflow.',
      body: 'Mehr Programm, mehr Menschen, mehr Feiermoment.',
    },
    floweekend: {
      eyebrow: 'Floweekend',
      badge: 'Highlight',
      title: 'Ein Wochenende zum Eintauchen.',
      body: 'Wochenendformat für intensiveres Lernen, Tanzen und Community-Gefühl.',
      ctaTickets: 'Floweekend ansehen',
    },
    tickets: {
      eyebrow: '',
      title: 'Feste Rhythmen und neue Ankündigungen.',
      body: 'Die Danceflow Night findet am 1., 3. und 5. Freitag im Monat statt. Weitere Workshops und Weekends veröffentlichen wir, sobald Termine und Anmeldung bestätigt sind.',
      cta: 'Eventübersicht öffnen',
    },
    closing: {
      title: 'Dein nächster Tanzabend kann mit der Danceflow Night beginnen.',
      body: 'Entdecke den festen Monatsrhythmus oder folge uns auf Instagram für neue Workshops und Weekends.',
      cta: 'Auf Instagram folgen',
      secondary: 'Schreib uns',
    },
  },
  en: {
    hero: {
      eyebrow: 'Danceflow Night · Workshops · Weekends',
      titleA: 'Your course does not end',
      titleAccent: 'after the class.',
      titleB: '',
      lead: 'At Salsaflow you find regular events, workshops and socials, so that technique turns into real dance nights.',
      ctaTickets: 'See the next events',
      ctaScroll: 'Open Danceflow Night',
    },
    danceflow: {
      eyebrow: '',
      title: 'Learning is the start. Dancing happens in the community.',
      body: 'A course gives you structure. An event gives you repetition, real encounters and real dance situations. You practise what you learned, meet new people and stay on it more easily, because dancing becomes social.',
      factsTitle: 'Good to know',
      // R142: same three-block grouping as DE. 1st/3rd/5th Friday and CHF 5.-/10.- stay.
      facts: [
        { label: 'Date', value: 'Every 1st, 3rd and 5th Friday at Basel SBB station' },
        { label: 'Evening', value: 'Social dancing with our own DJs. Students CHF 5.-, guests CHF 10.-' },
        { label: 'Crowd', value: 'All levels, alone or as a pair. Dancers from Switzerland, France and Germany' },
      ],
      ctaTickets: 'See the next Danceflow Night',
      note: 'There is often a short workshop before the night. You find the exact plan on Eventfrog.',
    },
    /* R188 E3: same four cards as DE, same facts, same order. */
    preview: {
      title: 'All events at a glance.',
      lead: 'Four ways to dance beyond your course.',
      cards: [
        {
          title: 'Danceflow Night',
          meta: 'Every 1st, 3rd and 5th Friday',
          text: 'The social dance night at Basel SBB station, with our own DJs.',
          image: {
            src: '/photos/party/party-50-v4.webp',
            alt: 'Couple dancing at a Danceflow Night with more guests behind them',
            position: 'object-[center_28%]',
          },
          href: '/events-workshops/danceflow-night',
          ctaLabel: 'See Danceflow Night',
        },
        {
          title: 'Anniversary Weekend',
          meta: 'Once a year',
          text: 'The community weekend with workshops, shows and socials.',
          image: {
            src: '/photos/premium/events-hero-1998.webp',
            alt: 'Salsaflow community posing on stage after a show',
            position: 'object-[center_35%]',
          },
          href: '/events-workshops/anniversary-weekend',
          ctaLabel: 'See the anniversary',
        },
        {
          title: 'Floweekend',
          meta: 'Weekend format',
          text: 'Workshops, socials and community in a compact format.',
          image: {
            src: '/photos/r188-events/floweekend-preview-2400.webp',
            alt: 'Couple dancing together at a Salsaflow event',
            position: 'object-center',
          },
          href: '/events-workshops/floweekend',
          ctaLabel: 'See Floweekend',
        },
        {
          title: 'Event calendar',
          meta: 'Dates and workshops',
          text: 'All confirmed dates, workshops and tickets in one place.',
          image: {
            src: '/photos/party/party-20-v3.webp',
            alt: 'Dancers greeting each other on the dance floor',
            position: 'object-[center_25%]',
          },
          href: '/events-workshops/eventkalender',
          ctaLabel: 'To the event calendar',
        },
      ],
    },
    gallery: {
      eyebrow: '',
      title: 'What would you like to experience next?',
      lead: 'Danceflow Nights, workshops and weekends give you time to practise, explore and celebrate.',
    },
    workshops: {
      eyebrow: 'Workshops',
      title: 'A workshop gives one topic a full evening.',
      body: 'You focus on technique, figures, musicality or styling and can apply what you learned directly at the next event.',
      // R155: same two-block grouping as DE, one thought per sentence.
      points: [
        'Your craft. You learn clean movement instead of just more figures. You find conscious expression in Salsa, Bachata or Heels. You hear the music better and react to it better.',
        'Your special topics. For these, guest teachers travel in from across Europe every month.',
      ],
    },
    anniversary: {
      eyebrow: 'Anniversary Weekend',
      title: 'The big community weekend around Salsaflow.',
      body: 'More programme, more people, more moments to celebrate.',
    },
    floweekend: {
      eyebrow: 'Floweekend',
      badge: 'Highlight',
      title: 'A weekend to dive in.',
      body: 'A weekend format with more time for workshops, dancing and the Salsaflow community.',
      ctaTickets: 'See Floweekend',
    },
    tickets: {
      eyebrow: '',
      title: 'Regular events and new announcements.',
      body: 'Danceflow Night takes place on the first, third and fifth Friday of each month. We publish other workshops and weekends once the dates and registration details are confirmed.',
      cta: 'Open the event overview',
    },
    closing: {
      title: 'Your next dance night can start with Danceflow Night.',
      body: 'Explore the regular monthly schedule or follow us on Instagram for new workshops and weekends.',
      cta: 'Follow on Instagram',
      secondary: 'Write to us',
    },
  },
} satisfies Record<Lang, EventsContent>;

// Eventfrog-Ziel fuer alle Ticket-Buttons + den Eventkalender. Eine Swap-Stelle: vor Launch
// VITE_EVENTFROG_URL mit dem echten Salsaflow-Eventfrog-Link fuellen (.env).
//
// Fallback ist das eigene Kontaktformular, nicht mehr eventfrog.ch. Grund: die nackte Domain
// leitet auf die Eventfrog-Startseite weiter. Wer dort ankommt, muss Salsaflow erst suchen und
// hat keinen Weg zurueck. Das eigene Formular beantwortet dieselbe Frage und die Anfrage kommt an.
const EVENTFROG_ENV = import.meta.env.VITE_EVENTFROG_URL?.trim();
export const EVENTFROG_URL = EVENTFROG_ENV || '/kontakt#events';

/** Zeigt der Ticket-Weg nach draussen? Steuert target/rel und die Button-Beschriftung. */
export const EVENTFROG_IS_EXTERNAL = Boolean(EVENTFROG_ENV);
