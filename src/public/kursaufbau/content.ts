// Content der Unterseite /kursaufbau aus dem V3-Copyplan (pages/08_kursaufbau.md).
// EINE Datei, EIN Seiten-Template (KursaufbauPage.tsx). Copy 1:1 aus dem Plan,
// zweisprachig (de = Plan-Wortlaut, en = treu uebersetzt). Echte Umlaute, CH-ss,
// keine Em-Dashes, keine erfundenen Zahlen.
//
// Seitenjob: Risikoabbau. Sie verhindert falsche Einstiege und macht klar, wie wir
// aufbauen. Salsa/Bachata-Stufen mit Flow-Kursen sowie der eigene Heels-Aufbau,
// Kursstaffel-Fakten (8 Wochen, 60 Minuten), Level-Beratung, FAQ und Schluss-CTA.
//
// Editorial-Notizen aus dem Plan (z. B. "final pruefen", "bitte final mit Salsaflow
// pruefen", "soll es hier sichtbar stehen") sind Anweisungen an das Team, keine Kunden-
// Copy. Sie stehen NICHT auf der Seite. Die gesicherten Fakten (8 Wochen / 60 Minuten,
// aus BUILD-V3-SUBAGENT-BRIEF) werden sauber genannt, nichts erfunden.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };

export type KursaufbauContent = {
  seo: SeoKey;
  crumb: Crumb;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    bullets: string[];
    primary: Cta;
    secondary: Cta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  levels: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    forYouLabel: string;
    youLearnLabel: string;
    nextLabel: string;
    startTag: string;
    buildTag: string;
    rungs: { name: string; forYou: string; youLearn: string; next: string }[];
    stylesIntro: string;
    styles: Cta[];
    graphicCaption: string;
  };
  doubt: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    blocks: { quote: string; answer: string }[];
    cta: Cta;
  };
  term: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    cards: { label: string; value: string }[];
    cta: Cta;
    secondary: Cta;
  };
  miss: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  closing: {
    eyebrow: string;
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
  kursplan: '/kursplan',
  preise: '/preise',
  schnupper: '/schnupperstunde',
  salsa: '/tanzkurse/salsa',
  bachata: '/tanzkurse/bachata',
  heels: '/tanzkurse/heels',
  self: '/kursaufbau',
};

export const KURSAUFBAU: Record<Lang, KursaufbauContent> = {
  de: {
    seo: 'kursaufbau',
    crumb: { label: 'Kursaufbau', href: R.self },
    hero: {
      eyebrow: 'Level & Kursaufbau',
      title: 'Welches Kurslevel passt zu',
      titleAccent: 'dir?',
      lead: 'Hier siehst du den Aufbau für Salsa und Bachata sowie das eigene Drei-Level-Modell für Heels. Wenn du unsicher bist, helfen wir dir beim Einstieg.',
      bullets: [
        'Klare Level statt Rätselraten',
        '8-Wochen-Staffeln',
        'Level-Hilfe bei Unsicherheit',
        'Schnupperstunde als einfacher Test',
      ],
      primary: { label: 'Level klären', href: R.schnupper },
      secondary: { label: 'Kursplan ansehen', href: R.kursplan },
      microcopy: 'Lieber kurz fragen als im falschen Level starten.',
      image: {
        src: '/photos/kurse/kurs-02.jpg',
        alt: 'Tanzkurs im hellen Salsaflow Studio, die Gruppe übt gemeinsam',
      },
      cardLabel: 'Dein Einstieg',
      cardText: 'Wir empfehlen dir einen passenden Einstieg.',
    },
    levels: {
      eyebrow: 'Level-Übersicht',
      title: 'Salsa und Bachata bauen Stufe für Stufe',
      titleAccent: 'auf.',
      body: 'Die Stufen bauen Technik und Sicherheit schrittweise auf. Flow-Kurse festigen das Gelernte, bevor es in den nächsten Bereich geht.',
      forYouLabel: 'Für dich, wenn',
      youLearnLabel: 'Du lernst',
      nextLabel: 'Weiter, wenn',
      startTag: 'Hier startest du',
      buildTag: 'Baut auf',
      rungs: [
        {
          name: 'Beginner Stufe 1 bis 6',
          forYou: 'du neu startest oder deine Grundlagen systematisch aufbauen willst.',
          youLearn: 'Rhythmus, Grundschritte, Drehungen sowie Führung und Folge.',
          next: 'du die Inhalte der Beginner-Stufen sicher anwenden kannst.',
        },
        {
          name: 'Beginner Flow',
          forYou: 'du die Beginner-Stufen abgeschlossen hast und sie festigen willst.',
          youLearn: 'Bekannte Inhalte verbinden, Timing stabilisieren und freier tanzen.',
          next: 'du Beginner-Kombinationen ruhig und musikalisch tanzen kannst.',
        },
        {
          name: 'Intermediate Stufe 7 bis 12',
          forYou: 'deine Grundlagen sitzen und du Technik und Repertoire erweitern willst.',
          youLearn: 'komplexere Figuren, Musikalität, Styling und präzisere Signale.',
          next: 'du die Intermediate-Inhalte mit unterschiedlichen Partner:innen sicher tanzt.',
        },
        {
          name: 'Intermediate Flow',
          forYou: 'du die Intermediate-Stufen abgeschlossen hast und mehr Flow suchst.',
          youLearn: 'Kombinationen variieren, musikalischer reagieren und Details verfeinern.',
          next: 'du Intermediate-Inhalte flexibel und kontrolliert einsetzen kannst.',
        },
        {
          name: 'Advanced ab Stufe 13',
          forYou: 'du anspruchsvolle Technik sicher beherrschst und weiter vertiefen willst.',
          youLearn: 'Feinheiten, Dynamik, Interpretation und komplexe Kombinationen.',
          next: 'du Inhalte kontrolliert, musikalisch und mit eigenem Ausdruck tanzt.',
        },
      ],
      stylesIntro: 'Salsa tanzen wir On1 und On2. Heels hat einen eigenen Aufbau: Beginner, Intermediate und Advanced. Workshops laufen als Open Level.',
      styles: [
        { label: 'Salsa', href: R.salsa },
        { label: 'Bachata', href: R.bachata },
        { label: 'Heels', href: R.heels },
      ],
      graphicCaption: 'Salsa und Bachata mit Flow-Stufen',
    },
    doubt: {
      eyebrow: 'Wenn du unsicher bist',
      title: 'Unsicherheit beim Level ist normal. Falsch starten muss nicht',
      titleAccent: 'sein.',
      blocks: [
        {
          quote: 'Ich will nicht zu tief starten.',
          answer: 'Zu tief ist nicht schlimm, wenn du kurz wieder Sicherheit aufbaust. Zu hoch kann dagegen frustrieren.',
        },
        {
          quote: 'Ich habe früher mal getanzt.',
          answer: 'Dann ist oft ein kurzer Level-Check besser als direkt einzusteigen. Pausen verändern Timing, Technik und Sicherheit.',
        },
        {
          quote: 'Ich lerne schnell.',
          answer: 'Gut. Trotzdem zählt nicht nur Tempo, sondern Qualität. Ein passendes Level gibt dir Struktur.',
        },
      ],
      cta: { label: 'Level-Hilfe anfragen', href: R.schnupper },
    },
    term: {
      eyebrow: 'Kursstaffeln & Dauer',
      title: 'Acht Wochen für einen klaren',
      titleAccent: 'Lernabschnitt.',
      body: 'Unsere Kurse laufen als Staffeln. Jede Staffel zeigt dir klar Startdatum, Dauer, Wochentag, Studio und Level. So weisst du vorher genau, worauf du dich einlässt.',
      cards: [
        { label: 'Dauer', value: 'In der Regel 8 Wochen pro Staffel.' },
        { label: 'Lektion', value: 'In der Regel 60 Minuten pro Woche.' },
        { label: 'Einstieg', value: 'Neue Staffeln und Schnuppertermine findest du im Kursplan.' },
        { label: 'Buchung', value: 'Direkt über den Kursplan oder das Schnupperformular.' },
      ],
      cta: { label: 'Kursplan öffnen', href: R.kursplan },
      secondary: { label: 'Preise ansehen', href: R.preise },
    },
    miss: {
      eyebrow: 'Nachholen & Fehlen',
      title: 'Regelmässiges Training bringt dich sicher',
      titleAccent: 'weiter.',
      body: 'Wenn du fehlst, melde dich frühzeitig. Ob und wie eine Lektion nachgeholt werden kann, hängt vom Kurs, Level und Platz ab.',
      image: {
        src: '/photos/gallery/kurse/04.jpg',
        alt: 'Tanzende im Salsaflow Kurs in entspannter Studio-Atmosphäre',
      },
      cardLabel: 'Dein Tempo',
      cardText: 'Melde dich früh, dann finden wir eine Lösung.',
    },
    closing: {
      eyebrow: 'Nächster Schritt',
      title: 'Kennst du dein Level? Dann ist der Kursplan der nächste',
      titleAccent: 'Schritt.',
      body: 'Und wenn du es nicht kennst, ist das auch okay. Buche eine Schnupperstunde oder frag uns kurz nach einer Empfehlung.',
      primary: { label: 'Kursplan ansehen', href: R.kursplan },
      secondary: { label: 'Level klären', href: R.schnupper },
      microcopy: 'Kostenlos · unverbindlich · auch ohne Tanzpartner möglich.',
    },
    faqEyebrow: 'Kursaufbau FAQ',
    faqTitle: 'Häufige Fragen zum Kursaufbau',
    faq: [
      {
        q: 'Was ist der Unterschied zwischen Beginner-Stufen und Beginner Flow?',
        a: 'In den Beginner-Stufen lernst du neue Grundlagen. Im Beginner Flow verbindest und festigst du diese Inhalte, bevor du in den Intermediate-Bereich wechselst.',
      },
      {
        q: 'Kann ich ein Level überspringen?',
        a: 'Nur wenn die Grundlagen wirklich sitzen. Besser kurz mit dem Team klären, als dich in einem zu hohen Kurs zu überfordern.',
      },
      {
        q: 'Wie lange dauert eine Kursstaffel?',
        a: 'Eine reguläre Kursstaffel dauert in der Regel 8 Wochen mit einer 60-minütigen Lektion pro Woche. Einmal im Jahr gibt es im August drei Wochen Sommerkurse zum Spezialpreis.',
      },
      {
        q: 'Was mache ich, wenn ich mein Level nicht kenne?',
        a: 'Buche eine Schnupperstunde oder frag das Team.',
      },
    ],
  },
  en: {
    seo: 'kursaufbau',
    crumb: { label: 'Kursaufbau', href: R.self },
    hero: {
      eyebrow: 'Levels & course structure',
      title: 'Which course level fits',
      titleAccent: 'you?',
      lead: 'See how Salsa and Bachata progress through numbered stages, and how the separate three-level Heels structure works. We can help if you are unsure where to start.',
      bullets: [
        'Clear levels instead of guessing',
        '8-week terms',
        'Level help when you are unsure',
        'A trial class as an easy test',
      ],
      primary: { label: 'Clarify your level', href: R.schnupper },
      secondary: { label: 'See the schedule', href: R.kursplan },
      microcopy: 'Better to ask briefly than to start at the wrong level.',
      image: {
        src: '/photos/kurse/kurs-02.jpg',
        alt: 'Dance class in the bright Salsaflow studio, the group practising together',
      },
      cardLabel: 'Your start',
      cardText: 'We recommend a suitable starting point.',
    },
    levels: {
      eyebrow: 'Level overview',
      title: 'Salsa and Bachata build from one stage to the',
      titleAccent: 'next.',
      body: 'Each stage builds technique and confidence. Flow classes consolidate what you have learned before you move into the next group.',
      forYouLabel: 'For you, if',
      youLearnLabel: 'You learn',
      nextLabel: 'Move on, when',
      startTag: 'You start here',
      buildTag: 'Builds on',
      rungs: [
        {
          name: 'Beginner stages 1 to 6',
          forYou: 'you are new or want to rebuild your foundations systematically.',
          youLearn: 'rhythm, basic steps, turns, leading and following.',
          next: 'you can use the content from the beginner stages with confidence.',
        },
        {
          name: 'Beginner Flow',
          forYou: 'you have completed the beginner stages and want to consolidate them.',
          youLearn: 'connect familiar material, stabilise your timing and dance more freely.',
          next: 'you can dance beginner combinations smoothly and in time with the music.',
        },
        {
          name: 'Intermediate stages 7 to 12',
          forYou: 'your foundations are solid and you want to expand your technique and repertoire.',
          youLearn: 'more complex figures, musicality, styling and more precise signals.',
          next: 'you can dance the intermediate material confidently with different partners.',
        },
        {
          name: 'Intermediate Flow',
          forYou: 'you have completed the intermediate stages and want more flow.',
          youLearn: 'vary combinations, respond more musically and refine the details.',
          next: 'you can use intermediate material flexibly and with control.',
        },
        {
          name: 'Advanced from stage 13',
          forYou: 'you are confident with demanding technique and want to develop it further.',
          youLearn: 'fine detail, dynamics, interpretation and complex combinations.',
          next: 'you dance the material with control, musicality and individual expression.',
        },
      ],
      stylesIntro: 'We dance Salsa On1 and On2. Heels has its own structure: beginner, intermediate and advanced. Workshops run as open level.',
      styles: [
        { label: 'Salsa', href: R.salsa },
        { label: 'Bachata', href: R.bachata },
        { label: 'Heels', href: R.heels },
      ],
      graphicCaption: 'Salsa and Bachata with Flow stages',
    },
    doubt: {
      eyebrow: 'If you are unsure',
      title: 'Not sure about your level? We can help you choose the right',
      titleAccent: 'stage.',
      blocks: [
        {
          quote: 'I do not want to start too low.',
          answer: 'Too low is not a problem if you quickly rebuild your confidence. Too high can be frustrating instead.',
        },
        {
          quote: 'I danced a while ago.',
          answer: 'Then a short level check is often better than jumping straight in. Breaks change timing, technique and confidence.',
        },
        {
          quote: 'I learn fast.',
          answer: 'Good. Still, it is not only about speed but about quality. The right level gives you structure.',
        },
      ],
      cta: { label: 'Ask for level help', href: R.schnupper },
    },
    term: {
      eyebrow: 'Course terms & duration',
      title: 'Eight weeks for one clear learning',
      titleAccent: 'block.',
      body: 'Our classes run in course blocks. Each listing shows the start date, duration, weekday, studio and level, so you know the format before you book.',
      cards: [
        { label: 'Duration', value: 'Usually 8 weeks per term.' },
        { label: 'Lesson', value: 'Usually 60 minutes per week.' },
        { label: 'Start', value: 'Find new terms and trial dates in the schedule.' },
        { label: 'Booking', value: 'Directly via the schedule or the trial form.' },
      ],
      cta: { label: 'Open the schedule', href: R.kursplan },
      secondary: { label: 'See prices', href: R.preise },
    },
    miss: {
      eyebrow: 'Catching up & missing a class',
      title: 'Regular practice helps you progress with',
      titleAccent: 'confidence.',
      body: 'If you miss a class, let us know early. Whether and how a lesson can be caught up depends on the course, level and space.',
      image: {
        src: '/photos/gallery/kurse/04.jpg',
        alt: 'Dancers in the Salsaflow course in a relaxed studio atmosphere',
      },
      cardLabel: 'Your pace',
      cardText: 'Let us know early and we will find a solution.',
    },
    closing: {
      eyebrow: 'Next step',
      title: 'Know your level? Then the schedule is your next',
      titleAccent: 'step.',
      body: 'And if you do not know it, that is fine too. Book a trial class or just ask us for a recommendation.',
      primary: { label: 'See the schedule', href: R.kursplan },
      secondary: { label: 'Clarify your level', href: R.schnupper },
      microcopy: 'Free · without obligation · no dance partner needed.',
    },
    faqEyebrow: 'Course FAQ',
    faqTitle: 'Common questions about the course structure',
    faq: [
      {
        q: 'What is the difference between the beginner stages and Beginner Flow?',
        a: 'The beginner stages introduce new foundations. Beginner Flow helps you connect and consolidate them before moving into the intermediate stages.',
      },
      {
        q: 'Can I skip a level?',
        a: 'Only if the basics really sit. Better to check briefly with the team than to overwhelm yourself in a course that is too high.',
      },
      {
        q: 'How long does a course term last?',
        a: 'A regular course block usually lasts 8 weeks, with one 60-minute class per week. Once a year we run three weeks of summer courses in August at a special price.',
      },
      {
        q: 'What do I do if I do not know my level?',
        a: 'Book a trial class or ask the team.',
      },
    ],
  },
};
