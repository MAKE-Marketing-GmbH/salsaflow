// Inhalt der Shows-&-Animationen-Seite, zweisprachig DE/EN. Gleiche Form wie events/content.ts.
// Die Tanz-Crew von Salsaflow tanzt professionelle Buehnen-Shows und Animationen fuer Feste,
// Firmen und Events (alte Seite: /kurse/shows-animationen). Quelle der Fakten: home/content.ts
// (Offer-Extra "Animationen & Shows") + wiki.md. Copy nach Regel 003/069/085: simpel, du-Form,
// echte Umlaute, CH-ss, keine Em-Dashes, ~50 Woerter pro Sektion. KEINE erfundenen Zitate/Zahlen,
// KEINE Preise (Show-Preise laufen individuell ueber die Anfrage). Primaerer CTA immer -> /kontakt.

import type { Lang } from '@/lib/i18n';

/** Ein Angebots-Block in der Offer-Sektion (Titel + Text). Icon waehlt die Seite (ShowsPage). */
export type ShowOffer = { title: string; text: string };

export type ShowsContent = {
  hero: {
    eyebrow: string;
    titleA: string;
    titleAccent: string; // ein Wort als Script-Akzent (Alex Brush, Rot) - nur hier
    titleB: string;
    lead: string;
    ctaBook: string;
    ctaScroll: string;
  };
  offer: {
    eyebrow: string;
    title: string;
    body: string;
    items: ShowOffer[]; // genau drei: Auftritte / Choreografie / Animation
  };
  occasions: {
    eyebrow: string;
    title: string;
    body: string;
    tags: string[]; // Anlass-Chips
  };
  gallery: { eyebrow: string; title: string; lead: string };
  closing: { title: string; body: string; cta: string; secondary: string };
};

export const SHOWS: Record<Lang, ShowsContent> = {
  de: {
    hero: {
      eyebrow: 'Shows & Animationen',
      titleA: 'Shows, die den',
      titleAccent: 'Saal',
      titleB: 'füllen.',
      lead: 'Unsere Tänzerinnen und Tänzer bringen echte Bühnen-Shows auf dein Fest. Salsa, Bachata und mehr, farbig, live und mitreissend. Wir tanzen für dich und holen deine Gäste danach mit auf die Fläche.',
      ctaBook: 'Show anfragen',
      ctaScroll: 'Was wir bieten',
    },
    offer: {
      eyebrow: 'Was wir bieten',
      title: 'Drei Wege auf deine Bühne.',
      body: 'Egal ob grosse Show oder lockere Animation, wir passen uns deinem Anlass an. Du sagst uns den Rahmen, wir bringen Musik, Kostüme und die passende Choreografie mit.',
      items: [
        {
          title: 'Auftritte für Feste, Firmen und Events',
          text: 'Eine fertige Bühnen-Show für deinen Anlass. Farbige Kostüme, starke Musik und Tänzer, die den Raum füllen.',
        },
        {
          title: 'Choreografie nach Mass',
          text: 'Du hast ein Thema oder ein Lied? Wir bauen die passende Choreografie, von der ersten Idee bis zum letzten Schritt.',
        },
        {
          title: 'Animation für deine Gäste',
          text: 'Nach der Show holen wir deine Gäste auf die Fläche. Ein paar einfache Schritte, viel Lachen, alle machen mit.',
        },
      ],
    },
    occasions: {
      eyebrow: 'Für jeden Anlass',
      title: 'Von der Firmenfeier bis zur Gala.',
      body: 'Ob Geburtstag, Hochzeit, Firmenfeier oder Bühnen-Event: Wir bringen die passende Show mit. Sag uns, was du planst, und wir machen daraus einen Moment, über den deine Gäste noch lange reden.',
      tags: ['Firmenfeste', 'Hochzeiten', 'Geburtstage', 'Galas & Bühnen', 'Vereinsanlässe', 'Weihnachtsfeiern'],
    },
    gallery: {
      eyebrow: 'Von der Bühne',
      title: 'Momente aus unseren Shows.',
      lead: 'Echte Fotos von unseren Auftritten. Farbige Kostüme, volle Bühnen und Tänzer, die für den Moment leben. Genau das bringen wir zu dir.',
    },
    closing: {
      title: 'Hol dir die Show auf deine Bühne.',
      body: 'Erzähl uns von deinem Anlass, dem Datum und dem Rahmen. Wir melden uns schnell mit einer Idee und einem Vorschlag, der zu dir passt.',
      cta: 'Show anfragen',
      secondary: 'Lern das Team kennen',
    },
  },
  en: {
    hero: {
      eyebrow: 'Shows & animation',
      titleA: 'Shows that',
      titleAccent: 'fill',
      titleB: 'the room.',
      lead: 'Our dancers bring a real stage show to your event. Salsa, Bachata and more, colourful, live and full of energy. We dance for you and then pull your guests onto the floor.',
      ctaBook: 'Request a show',
      ctaScroll: 'What we offer',
    },
    offer: {
      eyebrow: 'What we offer',
      title: 'Three ways onto your stage.',
      body: 'From a full show to a relaxed animation, we adapt to your occasion. You give us the setting, we bring the music, the costumes and the right choreography.',
      items: [
        {
          title: 'Shows for parties, companies and events',
          text: 'A ready-made stage show for your occasion. Colourful costumes, strong music and dancers who fill the room.',
        },
        {
          title: 'Choreography made to measure',
          text: 'Got a theme or a song? We build the right choreography, from the first idea to the last step.',
        },
        {
          title: 'Animation for your guests',
          text: 'After the show we bring your guests onto the floor. A few simple steps, lots of laughing, everyone joins in.',
        },
      ],
    },
    occasions: {
      eyebrow: 'For any occasion',
      title: 'From company party to gala.',
      body: 'Birthday, wedding, company party or stage event: we bring the right show. Tell us what you are planning and we turn it into a moment your guests will talk about for a long time.',
      tags: ['Company parties', 'Weddings', 'Birthdays', 'Galas & stages', 'Club events', 'Christmas parties'],
    },
    gallery: {
      eyebrow: 'From the stage',
      title: 'Moments from our shows.',
      lead: 'Real photos from our performances. Colourful costumes, full stages and dancers who live for the moment. That is exactly what we bring to you.',
    },
    closing: {
      title: 'Bring the show to your stage.',
      body: 'Tell us about your occasion, the date and the setting. We get back to you quickly with an idea and a proposal that fits you.',
      cta: 'Request a show',
      secondary: 'Meet the team',
    },
  },
};
