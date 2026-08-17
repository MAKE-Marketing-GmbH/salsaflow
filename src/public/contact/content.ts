// Inhalt der Kontakt-Seite (Etappe 14: Kontakt + Mehr + Sonstiges), zweisprachig DE/EN.
// Quelle der Fakten: wiki.md Abschnitt 1 (Kontakt/Standort), 10 (Bedenken -> FAQ), 11 (Sitemap
// Kontakt/Mehr/Sonstiges), 12. Collab-Link aus wiki.md 11: 2332dancewear/collections/salsaflow.
// Copy nach Regel 003/069/085 (simpel, du, echte Umlaute, CH-ss, keine Em-Dashes).
// Keine Preise (Raphael-Dauerregel). Keine erfundenen Fakten (keine Oeffnungszeiten/Adressen, die
// das Briefing nicht hergibt -> bewusst allgemein gehalten, Detail kommt vom Kunden).

import type { Lang } from '@/lib/i18n';

export type Faq = { q: string; a: string };

// Anliegen-Auswahl im Formular. Die Werte muessen mit server/contact-routes.ts (zod-enum) matchen.
export type TopicKey =
  | 'kontakt'
  | 'schnupperstunde'
  | 'kurs'
  | 'privatstunden'
  | 'raumvermietung'
  | 'events'
  | 'geschenkgutschein'
  | 'animationen';

export type ContactContent = {
  hero: { eyebrow: string; titleA: string; titleAccent: string; titleB: string; lead: string; primaryCta: string };
  form: {
    eyebrow: string;
    title: string;
    lead: string;
    name: string;
    email: string;
    phone: string;
    phoneOptional: string;
    topic: string;
    topicOptions: { key: TopicKey; label: string }[];
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    requiredHint: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
    mailtoFallback: string; // Link-Text fuer den mailto-Notausgang
  };
  direct: {
    title: string;
    emailLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    hours: string; // ehrlich-allgemein, ohne erfundene Zeiten
  };
  location: {
    eyebrow: string;
    title: string;
    body: string;
    mapsCta: string;
    imageAlt: string;
    addressLabel: string;
    contactLabel: string;
  };
  rental: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    cta: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    lead: string;
    items: Faq[];
  };
  collab: {
    eyebrow: string;
    title: string;
    body: string;
    partner: string;
    cta: string;
  };
  channels: {
    title: string;
    lead: string;
    instagram: string;
    whatsapp: string;
    google: string;
  };
};

export const CONTACT_PAGE: Record<Lang, ContactContent> = {
  de: {
    hero: {
      eyebrow: 'Kontakt & Anfahrt',
      titleA: 'Schreib uns, was du',
      titleAccent: 'suchst.',
      titleB: 'Wir helfen dir beim nächsten Schritt.',
      lead: 'Egal ob Kurs, Level, Schnupperstunde, Privatstunde, Show, Raumvermietung oder allgemeine Frage: Je konkreter deine Nachricht, desto schneller können wir sinnvoll antworten.',
      primaryCta: 'Anfrage starten',
    },
    form: {
      eyebrow: 'Kontaktformular',
      title: 'Worum geht es?',
      lead: 'Wähle dein Anliegen, damit deine Anfrage direkt richtig eingeordnet wird.',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      phoneOptional: 'optional',
      topic: 'Anliegen',
      topicOptions: [
        { key: 'kontakt', label: 'Allgemeine Frage' },
        { key: 'schnupperstunde', label: 'Gratis Schnupperstunde' },
        { key: 'kurs', label: 'Kursanmeldung / Kursplan' },
        { key: 'privatstunden', label: 'Privatstunde' },
        { key: 'raumvermietung', label: 'Raumvermietung' },
        { key: 'events', label: 'Events' },
        { key: 'geschenkgutschein', label: 'Geschenkgutschein' },
        { key: 'animationen', label: 'Shows & Animationen' },
      ],
      message: 'Nachricht',
      messagePlaceholder: 'Ein paar Zeilen zu deinem Anliegen genügen.',
      submit: 'Anfrage absenden',
      submitting: 'Wird gesendet...',
      requiredHint: 'Bitte fülle Name, E-Mail und Nachricht aus.',
      successTitle: 'Danke, deine Nachricht ist unterwegs.',
      successBody: 'Wir haben deine Anfrage erhalten und melden uns so schnell wie möglich bei dir.',
      errorTitle: 'Das hat gerade nicht geklappt.',
      errorBody: 'Bitte versuche es gleich noch einmal oder schreib uns direkt eine E-Mail.',
      mailtoFallback: 'Direkt eine E-Mail schreiben',
    },
    direct: {
      title: 'Direkt erreichen',
      emailLabel: 'E-Mail',
      phoneLabel: 'Telefon',
      whatsappLabel: 'WhatsApp',
      hours: 'Wir antworten meistens innerhalb von 24 Stunden.',
    },
    location: {
      eyebrow: 'Standort',
      title: 'Direkt am Bahnhof Basel SBB.',
      body: 'Du findest uns an der Elisabethenanlage 7, 4051 Basel, nur wenige Gehminuten vom Bahnhof SBB entfernt.',
      mapsCta: 'Anfahrt öffnen',
      // Alt beschreibt das Bild, das wirklich steht (Runde 3): kurse/06.jpg zeigt einen
      // laufenden Kurs auf hellem Holzboden — keine Spiegelwand. Der alte Text beschrieb
      // ein Wunschbild und passte auch zum vorherigen Foto nicht.
      imageAlt: 'Heller Kursraum von Salsaflow mit Holzboden, eine Gruppe tanzt den Grundschritt',
      addressLabel: 'Adresse',
      contactLabel: 'Kontakt',
    },
    rental: {
      eyebrow: 'Raumvermietung',
      title: 'Du suchst einen Raum zum Mieten?',
      body: 'Die Studios sind zentral, hell und für Tanz, Bewegung, Workshops oder Proben geeignet. Für eine Raumvermietung brauchen wir Datum, Zeitraum, Zweck und die erwartete Personenzahl.',
      points: [
        'Helle Tanzräume mit Spiegeln und Musikanlage',
        'Top Lage direkt am Bahnhof Basel SBB',
        'Flexibel für Trainings, Workshops, Proben oder Shootings',
      ],
      cta: 'Raum anfragen',
    },
    faq: {
      eyebrow: 'Häufige Fragen',
      title: 'Gut zu wissen',
      lead: 'Die Fragen, die uns am häufigsten erreichen. Ist deine nicht dabei, schreib uns einfach.',
      items: [
        {
          q: 'Passe ich da rein, auch von meinem Alter her?',
          a: 'Ja. Bei uns tanzen Menschen aller Altersgruppen ab etwa 12 Jahren. Du wirst vom ersten Abend an herzlich aufgenommen.',
        },
        {
          q: 'Passt der Kurs zu meinem Niveau?',
          a: 'Wir haben klare Stufen vom Anfänger bis Advanced. Du kannst auch mehrere Schnupperstunden machen, bis du den richtigen Kurs gefunden hast.',
        },
        {
          q: 'Ich habe keine Tanzpartnerin oder keinen Tanzpartner.',
          a: 'Kein Problem. Du kannst dich allein anmelden, wir organisieren dir eine Aushilfe für die Gegenrolle.',
        },
        {
          q: 'Sind die Zeiten flexibel genug?',
          a: 'Wenn du einmal nicht kannst, holst du die Stunde innerhalb der laufenden Staffel nach. So verpasst du nichts.',
        },
        {
          q: 'Wie schnell komme ich voran?',
          a: 'Schon nach einem Kurs spürst du den Fortschritt. Am schnellsten wirst du, wenn du dranbleibst und das Gelernte an den Danceflow Nights anwendest.',
        },
        {
          q: 'Wie melde ich mich an?',
          a: 'Ganz einfach online über den Kursplan. Du wählst deinen Kurs, deine Rolle und buchst direkt. Deine erste Schnupperstunde ist gratis.',
        },
      ],
    },
    collab: {
      eyebrow: 'Unsere Partnermarke',
      title: 'Tanzschuhe und Kleidung von 2332dancewear',
      body: 'Bei 2332dancewear gibt es eine eigene Salsaflow-Kollektion mit Tanzschuhen und Kleidung. Beides passt zum Kurs und zu den Partys. Am Anfang reicht bequeme Kleidung, richtig ausrüsten kannst du dich später.',
      partner: '2332dancewear',
      cta: 'Zur Salsaflow-Kollektion',
    },
    channels: {
      title: 'Bleib in Kontakt',
      lead: 'Folge uns, schreib uns auf WhatsApp oder hinterlass eine Bewertung.',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
      google: 'Google-Bewertung',
    },
  },
  en: {
    hero: {
      eyebrow: 'Contact & directions',
      titleA: 'Tell us what you',
      titleAccent: 'need.',
      titleB: 'We will help you take the next step.',
      lead: 'Whether it is a course, level, trial class, private lesson, show, room rental or a general question: the more concrete your message, the faster we can give you a useful answer.',
      primaryCta: 'Start your request',
    },
    form: {
      eyebrow: 'Contact form',
      title: 'What is it about?',
      lead: 'Choose your request so we can route it to the right place right away.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      phoneOptional: 'optional',
      topic: 'Request',
      topicOptions: [
        { key: 'kontakt', label: 'General question' },
        { key: 'schnupperstunde', label: 'Free trial class' },
        { key: 'kurs', label: 'Course sign-up / schedule' },
        { key: 'privatstunden', label: 'Private lesson' },
        { key: 'raumvermietung', label: 'Room rental' },
        { key: 'events', label: 'Events' },
        { key: 'geschenkgutschein', label: 'Gift voucher' },
        { key: 'animationen', label: 'Shows & animations' },
      ],
      message: 'Message',
      messagePlaceholder: 'A few lines about your request are enough.',
      submit: 'Send request',
      submitting: 'Sending...',
      requiredHint: 'Please fill in name, email and message.',
      successTitle: 'Thanks, your message is on its way.',
      successBody: 'We have received your request and will get back to you as soon as possible.',
      errorTitle: 'That did not work just now.',
      errorBody: 'Please try again in a moment or send us an email directly.',
      mailtoFallback: 'Write an email directly',
    },
    direct: {
      title: 'Contact us directly',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      whatsappLabel: 'WhatsApp',
      hours: 'We usually reply within 24 hours.',
    },
    location: {
      eyebrow: 'Location',
      title: 'Right at Basel SBB station.',
      body: 'You find us at Elisabethenanlage 7, 4051 Basel, just a few minutes on foot from Basel SBB station.',
      mapsCta: 'Open directions',
      imageAlt: 'Bright Salsaflow class room with wooden floor, a group dancing the basic step',
      addressLabel: 'Address',
      contactLabel: 'Contact',
    },
    rental: {
      eyebrow: 'Room rental',
      title: 'Looking for a room to rent?',
      body: 'The studios are central, bright and suited for dance, movement, workshops or rehearsals. For a rental we need the date, the time frame, the purpose and the expected number of people.',
      points: [
        'Bright dance rooms with mirrors and a sound system',
        'Prime location right at Basel SBB station',
        'Flexible for trainings, workshops, rehearsals or shoots',
      ],
      cta: 'Request a room',
    },
    faq: {
      eyebrow: 'Frequently asked',
      title: 'Good to know',
      lead: 'The questions we hear most often. If yours is not here, just write to us.',
      items: [
        {
          q: 'Will I fit in, also in terms of age?',
          a: 'Yes. People of all ages from around 12 dance with us. You are warmly welcomed from your very first evening.',
        },
        {
          q: 'Is the course right for my level?',
          a: 'We have clear levels from beginner to advanced. You can also take several trial classes until you find the right course.',
        },
        {
          q: 'I do not have a dance partner.',
          a: 'No problem. You can sign up on your own and we arrange a partner for the opposite role.',
        },
        {
          q: 'Are the times flexible enough?',
          a: 'If you cannot make it once, you catch up within the current term. That way you do not miss anything.',
        },
        {
          q: 'How fast will I progress?',
          a: 'You feel the progress after just one course. The fastest way is to stay consistent and apply what you learn at the Danceflow Nights.',
        },
        {
          q: 'How do I sign up?',
          a: 'Simply online via the schedule. You pick your course and role and book directly. Your first trial class is free.',
        },
      ],
    },
    collab: {
      eyebrow: 'Our partner brand',
      title: 'Dance shoes and clothing from 2332dancewear',
      body: 'At 2332dancewear you find a dedicated Salsaflow collection of dance shoes and clothing. Both work for class and for the parties. Comfortable clothes are enough at the start, you can gear up properly later.',
      partner: '2332dancewear',
      cta: 'To the Salsaflow collection',
    },
    channels: {
      title: 'Stay in touch',
      lead: 'Follow us, message us on WhatsApp or leave a review.',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
      google: 'Google review',
    },
  },
};

// Externer Collab-Link (wiki.md 11). Eine Swap-Stelle.
export const COLLAB_URL = 'https://www.2332dancewear.com/collections/salsaflow';
