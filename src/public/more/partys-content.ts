// Inhalt der Partys-Seite (/mehr/partys) aus dem V3-Copyplan (pages/23_mehr__partys.md).
// Zweisprachig DE/EN. de = Plan-Wortlaut, en = treu uebersetzt. Echte Umlaute, CH-ss, keine
// Em-Dashes. Ruhige Seite (Plan: soll Danceflow Night als Start positionieren, nicht mit ihr
// konkurrieren). Fakten nur gesichert: Danceflow Night jeden 1., 3. und 5. Freitag im Monat.
//
// Keine externen Party-Namen/Links erfunden (Plan nennt keine bestaetigten, Brief-Regel: sonst
// auf /kontakt bzw. Eventkalender). Interne Links zeigen auf echte Event-Routen.

import type { Lang } from '@/lib/i18n';
import type { Faq, Crumb } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };
type Fact = { value: string; label: string };
type TemplateRow = { label: string; hint: string };

export type PartysContent = {
  crumbs: Crumb[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  danceflow: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    facts: Fact[];
    cta: Cta;
    image: Img;
  };
  more: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    template: TemplateRow[];
    cta: Cta;
  };
  firstTime: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    tips: string[];
    cta: Cta;
    image: Img;
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

export const PARTYS: Record<Lang, PartysContent> = {
  de: {
    crumbs: [
      { label: 'Mehr', href: '/mehr' },
      { label: 'Partys', href: '/mehr/partys' },
    ],
    hero: {
      eyebrow: 'Partys & Socials',
      title: 'Kurse zeigen dir Schritte. Partys zeigen dir den',
      titleAccent: 'Flow.',
      lead: 'Wenn du Salsa oder Bachata wirklich tanzen willst, brauchst du echte Abende mit Musik, Menschen und Wiederholung. Hier findest du den Einstieg.',
      primary: { label: 'Danceflow Night ansehen', href: '/events-workshops/danceflow-night' },
      secondary: { label: 'Eventübersicht öffnen', href: '/events-workshops/eventkalender' },
      microcopy: 'Du musst nicht perfekt sein, um social zu tanzen.',
      image: { src: '/photos/party/party-31-v3.webp', alt: 'Lächelnde Tänzerin mitten in einer hellen Salsaflow Party in Basel' },
      cardLabel: 'Danceflow Night',
      cardText: 'Jeden 1., 3. und 5. Freitag im Monat.',
    },
    danceflow: {
      eyebrow: 'Der einfachste Start',
      title: 'Der naheliegendste Start: Danceflow',
      titleAccent: 'Night.',
      body: 'Wenn du bei Salsaflow lernst, ist die Danceflow Night der einfachste Social-Dance-Einstieg. Du kennst den Ort, triffst Menschen aus Kursen und kannst in vertrauter Atmosphäre üben.',
      facts: [
        { value: '1., 3. & 5. Freitag', label: 'jeden Monat' },
        { value: 'Salsa & Bachata', label: 'Musik' },
        { value: 'Alle Levels', label: 'willkommen' },
      ],
      cta: { label: 'Nächste Danceflow Night', href: '/events-workshops/danceflow-night' },
      image: { src: '/photos/party/party-08.webp', alt: 'Stimmung an einer Danceflow Night in Basel' },
    },
    more: {
      eyebrow: 'Aktuelle Abende finden',
      title: 'So findest du den nächsten',
      titleAccent: 'Tanzabend.',
      body: 'Partys ändern Termine und Orte. Darum zeigen wir hier keine ungeprüfte Linkliste. Nutze die festen Danceflow Nights oder frag uns nach einer aktuellen Empfehlung.',
      template: [
        { label: 'Danceflow Night', hint: 'Jeden 1., 3. und 5. Freitag im Monat bei Salsaflow.' },
        { label: 'Instagram', hint: 'Dort teilen wir kurzfristige Hinweise und neue Daten.' },
        { label: 'Frag das Team', hint: 'Wir sagen dir, welcher aktuelle Abend zu deinem Level passt.' },
        { label: 'Vorher prüfen', hint: 'Kontrolliere Datum, Ort und Eintritt direkt beim Veranstalter.' },
        { label: 'Alleine willkommen', hint: 'Für Social Dancing brauchst du keinen festen Tanzpartner.' },
      ],
      cta: { label: 'Danceflow Night ansehen', href: '/events-workshops/danceflow-night' },
    },
    firstTime: {
      eyebrow: 'Kein Druck',
      title: 'Zum ersten Mal auf einer',
      titleAccent: 'Salsa- oder Bachata-Party?',
      body: 'Der erste Social-Abend muss nicht perfekt sein. Es reicht, wenn du ein paar Basics kennst, freundlich fragst und offen bleibst.',
      tips: [
        'Komm lieber früh, wenn es ruhiger ist.',
        'Tanz einfache Sachen sauber statt zu viel zu wollen.',
        'Frag freundlich und akzeptiere ein Nein.',
        'Mach Pausen, schau zu, hör Musik.',
        'Wenn du unsicher bist, starte mit der Danceflow Night.',
      ],
      cta: { label: 'Beginner-freundlichen Abend finden', href: '/events-workshops/danceflow-night' },
      image: { src: '/photos/party/party-15.webp', alt: 'Menschen tanzen zusammen bei einer Salsa-Party' },
    },
    faqEyebrow: 'Partys FAQ',
    faqTitle: 'Häufige Fragen zu Partys & Socials',
    faq: [
      {
        q: 'Kann ich als Anfänger auf eine Salsa-Party gehen?',
        a: 'Ja, besonders wenn du Basics kennst und mit einfachen Tänzen startest. Für einen sicheren Einstieg ist die Danceflow Night ideal.',
      },
      {
        q: 'Muss ich jemanden mitbringen?',
        a: 'Nein. Viele Socials funktionieren auch alleine, weil man unterschiedliche Menschen zum Tanzen fragt.',
      },
      {
        q: 'Welche Party empfiehlt Salsaflow?',
        a: 'Zuerst unsere eigenen Danceflow Nights. Weitere Orte empfehlen wir dir, wenn sie aktuell und geprüft sind.',
      },
      {
        q: 'Was soll ich anziehen?',
        a: 'Bequem, beweglich und passend zur Atmosphäre. Schuhe sollten sicher und sauber sein.',
      },
    ],
    closing: {
      eyebrow: 'Nächster Schritt',
      title: 'Dein nächster Tanzabend: die',
      titleAccent: 'Danceflow Night.',
      body: 'Sieh dir den festen Monatsrhythmus an. Je öfter du tanzt, desto natürlicher fühlt sich der Kursstoff an.',
      primary: { label: 'Danceflow Night ansehen', href: '/events-workshops/danceflow-night' },
      secondary: { label: 'Eventübersicht öffnen', href: '/events-workshops/eventkalender' },
    },
  },
  en: {
    crumbs: [
      { label: 'More', href: '/mehr' },
      { label: 'Parties', href: '/mehr/partys' },
    ],
    hero: {
      eyebrow: 'Parties & socials',
      title: 'Courses show you steps. Parties show you the',
      titleAccent: 'flow.',
      lead: 'If you really want to dance Salsa or Bachata, you need real nights with music, people and repetition. Here you find the way in.',
      primary: { label: 'See the Danceflow Night', href: '/events-workshops/danceflow-night' },
      secondary: { label: 'Open the event overview', href: '/events-workshops/eventkalender' },
      microcopy: 'You do not have to be perfect to dance socially.',
      image: { src: '/photos/party/party-31-v3.webp', alt: 'Smiling dancer in the middle of a bright Salsaflow party in Basel' },
      cardLabel: 'Danceflow Night',
      cardText: 'Every 1st, 3rd and 5th Friday of the month.',
    },
    danceflow: {
      eyebrow: 'The easiest start',
      title: 'The most obvious start: Danceflow',
      titleAccent: 'Night.',
      body: 'If you learn at Salsaflow, the Danceflow Night is the easiest way into social dancing. You know the place, you meet people from the courses and you can practise in a familiar atmosphere.',
      facts: [
        { value: '1st, 3rd & 5th Friday', label: 'every month' },
        { value: 'Salsa & Bachata', label: 'music' },
        { value: 'All levels', label: 'welcome' },
      ],
      cta: { label: 'Next Danceflow Night', href: '/events-workshops/danceflow-night' },
      image: { src: '/photos/party/party-08.webp', alt: 'Atmosphere at a Danceflow Night in Basel' },
    },
    more: {
      eyebrow: 'Find a current social',
      title: 'How to find your next',
      titleAccent: 'dance night.',
      body: 'Party dates and venues change. Instead of listing unverified links, we point you to the regular Danceflow Nights or help you find a current recommendation.',
      template: [
        { label: 'Danceflow Night', hint: 'Every first, third and fifth Friday of the month at Salsaflow.' },
        { label: 'Instagram', hint: 'We share short-notice updates and new dates there.' },
        { label: 'Ask the team', hint: 'We can suggest a current night that suits your level.' },
        { label: 'Check before you go', hint: 'Confirm the date, venue and entry fee with the organiser.' },
        { label: 'Come on your own', hint: 'You do not need a fixed dance partner for social dancing.' },
      ],
      cta: { label: 'See the Danceflow Night', href: '/events-workshops/danceflow-night' },
    },
    firstTime: {
      eyebrow: 'No pressure',
      title: 'First time at a Salsa or Bachata',
      titleAccent: 'party?',
      body: 'The first social evening does not have to be perfect. It is enough if you know a few basics, ask kindly and stay open.',
      tips: [
        'Come early, while the dance floor is quieter.',
        'Keep your dancing simple and comfortable.',
        'Ask kindly and accept a no.',
        'Take breaks, watch, listen to the music.',
        'If you are unsure, start with the Danceflow Night.',
      ],
      cta: { label: 'Find a beginner-friendly night', href: '/events-workshops/danceflow-night' },
      image: { src: '/photos/party/party-15.webp', alt: 'People dancing together at a Salsa party' },
    },
    faqEyebrow: 'Parties FAQ',
    faqTitle: 'Common questions about parties & socials',
    faq: [
      {
        q: 'Can I go to a Salsa party as a beginner?',
        a: 'Yes, especially if you know the basics and start with simple dances. For a safe start the Danceflow Night is ideal.',
      },
      {
        q: 'Do I have to bring someone?',
        a: 'No. Many people come on their own and ask different partners to dance during the evening.',
      },
      {
        q: 'Which party does Salsaflow recommend?',
        a: 'Start with one of our Danceflow Nights. Ask the team if you would like a current recommendation for another social.',
      },
      {
        q: 'What should I wear?',
        a: 'Wear comfortable clothes that let you move freely. Your shoes should be secure and clean.',
      },
    ],
    closing: {
      eyebrow: 'Next step',
      title: 'Your next dance night: the',
      titleAccent: 'Danceflow Night.',
      body: 'See the regular monthly schedule. The more often you dance, the more natural the material from class will feel.',
      primary: { label: 'See the Danceflow Night', href: '/events-workshops/danceflow-night' },
      secondary: { label: 'Open the event overview', href: '/events-workshops/eventkalender' },
    },
  },
};
