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
    // R141: forYouLabel ist raus. Die «Fuer dich, wenn»-Zeile ist jetzt die immer
    // sichtbare Kernzeile jeder Stufe und steht als normaler Satz da, ohne Label.
    youLearnLabel: string;
    nextLabel: string;
    /** R141: Label der Detail-Klappe je Stufe (Inhalte + Wechsel-Kriterium). */
    detailsLabel: string;
    startTag: string;
    buildTag: string;
    rungs: { name: string; forYou: string; youLearn: string; next: string }[];
    stylesIntro: string;
    styles: Cta[];
    /** R188 KA1: `graphicCaption` ist raus. Die Bildunterschrift gehoerte zur
     *  Schritt-Grafik, die mit dem Feedback «das Bild macht gar keinen Sinn»
     *  entfernt wurde. */
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

export const KURSAUFBAU = {
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
      // R141b: kurs-03.jpg war zugleich das Motiv im Salsa-SplitHero (StylePage.tsx:141).
      // Dasselbe Foto auf /kursaufbau und auf der Salsa-Seite laesst die Routen gleich
      // aussehen. kurs-02.jpg kommt nicht zurueck (31.7/255, unterbelichtet).
      // kurse-classfreude-01.webp misst 126.6/255, ist scharf, zeigt eine ganze Klasse im
      // hellen Studio mit ganzen Koepfen (per Read geprueft) und traegt genau den Alt-Text.
      // Es ist ein neutrales Kurs-Motiv, kein Salsa-, Bachata-, Heels- oder Privat-Bild.
      // Kein CSS-Filter, echtes Foto. R80-Lock unberuehrt: lg:aspect-[3/2] und der CTA im
      // Fold haengen an KursaufbauPage.tsx, nicht am Motiv.
      image: {
        src: '/photos/2026/kurse-classfreude-01.webp',
        alt: 'Tanzkurs im hellen Salsaflow Studio, die Gruppe übt gemeinsam',
      },
      cardLabel: 'Dein Einstieg',
      cardText: 'Wir empfehlen dir einen passenden Einstieg.',
    },
    levels: {
      eyebrow: 'Level-Übersicht',
      // R188 KA2: Frage statt Aussage. Wer hier landet, sucht seine Stufe.
      title: 'Welche Stufen gibt es bei Salsa und',
      titleAccent: 'Bachata?',
      body: 'Fünf Stufen bauen Technik und Sicherheit Schritt für Schritt auf. Flow-Kurse festigen das Gelernte, bevor der nächste Bereich beginnt.',
      youLearnLabel: 'Du lernst',
      nextLabel: 'Weiter, wenn',
      detailsLabel: 'Inhalte und Wechsel',
      startTag: 'Hier startest du',
      buildTag: 'Baut auf',
      rungs: [
        {
          name: 'Beginner Stufe 1 bis 6',
          forYou: 'Du startest neu oder willst deine Grundlagen systematisch aufbauen.',
          youLearn: 'Rhythmus, Grundschritte, Drehungen sowie Führung und Folge.',
          next: 'Du kannst die Beginner-Inhalte sicher anwenden.',
        },
        {
          name: 'Beginner Flow',
          forYou: 'Du hast die Beginner-Stufen 1 bis 6 hinter dir und willst sie festigen.',
          youLearn: 'Bekannte Inhalte verbinden, Timing stabilisieren und freier tanzen.',
          next: 'Beginner-Kombinationen gelingen dir ruhig und musikalisch.',
        },
        {
          name: 'Intermediate Stufe 7 bis 12',
          forYou: 'Deine Grundlagen sitzen und du willst Technik und Repertoire erweitern.',
          youLearn: 'Komplexere Figuren, Musikalität, Styling und präzisere Signale.',
          next: 'Du kannst Intermediate-Inhalte mit unterschiedlichen Partner:innen sicher tanzen.',
        },
        {
          name: 'Intermediate Flow',
          forYou: 'Du hast die Stufen 7 bis 12 hinter dir und suchst mehr Flow.',
          youLearn: 'Kombinationen variieren, musikalischer reagieren und Details verfeinern.',
          next: 'Du kannst Intermediate-Inhalte flexibel und kontrolliert einsetzen.',
        },
        {
          name: 'Advanced ab Stufe 13',
          forYou: 'Du beherrschst anspruchsvolle Technik sicher und willst tiefer gehen.',
          youLearn: 'Feinheiten, Dynamik, Interpretation und komplexe Kombinationen.',
          next: 'Du tanzt mit Kontrolle, Musikalität und eigenem Ausdruck.',
        },
      ],
      stylesIntro: 'Salsa tanzen wir On1 und On2. Heels hat einen eigenen Aufbau: Beginner, Intermediate und Advanced. Workshops laufen als Open Level.',
      styles: [
        { label: 'Salsa', href: R.salsa },
        { label: 'Bachata', href: R.bachata },
        { label: 'Heels', href: R.heels },
      ],
    },
    doubt: {
      eyebrow: 'Wenn du unsicher bist',
      // R188 KA2: Frage statt zweiteiliger Aussage ueber drei Zeilen.
      title: 'Was, wenn du dein Level nicht',
      titleAccent: 'kennst?',
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
      // R188 KA2: Frage statt Slogan. Die Antwort (8 Wochen) steht in der ersten Karte.
      title: 'Wie lange dauert eine',
      titleAccent: 'Kursstaffel?',
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
      // R188 KA2 (Video 11:38-11:46, woertlich): «regelmässiges Training bringt dich
      // sicher weiter. Ja klar, aber niemand checkt, dass es hier darum geht, was ist,
      // wenn du einen Kurs verpasst? Das muss mal richtig dastehen.»
      // Genau dieser Satz steht jetzt als Ueberschrift.
      title: 'Was ist, wenn du einen Kurs',
      titleAccent: 'verpasst?',
      body: 'Wenn du fehlst, melde dich frühzeitig. Ob und wie eine Lektion nachgeholt werden kann, hängt vom Kurs, Level und Platz ab.',
      // R141: gallery/kurse/04.jpg war hier das Club-Foto und mass 29/255 Graustufen-
      // Mittel (Raphael 04:58: «das Bild ist uebelst unterbelichtet»). kurs-05.jpg misst
      // 106/255, ist scharf und warm (R minus B = +31, wie der Hero kurs-02), zeigt eine
      // volle Kursstaffel im Tageslicht-Studio und traegt damit genau die Aussage der
      // Headline. Kein CSS-Filter, echtes Foto. DESIGN.md:93 (sitewide max 2x) haelt:
      // bisher EIN Design-Slot (/preise Fit-Band), der Galerie-Eintrag ist Archiv.
      //
      // R188 SW4 (Kritiker: «rechter unterer Bildrand, halber Kopf abgeschnitten»):
      // Der Schnitt lag NICHT am object-position, sondern in der Quelldatei selbst.
      // Gemessen im echten Renderkasten (Browser, 1440er Desktop): das Bild rendert
      // 767x403, die Quelle 1600x1065 skaliert auf 767x511 — extra_x = 0, das Bild
      // fuellt die Breite also voll aus. Jede object-position-Aenderung verschiebt nur
      // senkrecht und kann einen SEITLICH angeschnittenen Kopf nie retten.
      // Der Kopf gehoert dem baertigen Mann im schwarzen Tanktop bei Quell-x 1420-1600,
      // y 540-820: die rechte Dateikante halbiert sein Gesicht (per Crop einzeln
      // angesehen). Im Original-Katalog (worklog/R187-originale.md Zeile 132) hat
      // kurs-05.jpg KEIN groesseres Original — Upscaling ist verboten, ein Bildtausch
      // haette das geprueft passende Motiv der Sektion zerstoert.
      // Deshalb: rechte Kante bei x=1410 abgeschnitten, sonst nichts. Die halbe Figur
      // ist damit ganz raus statt halb drin. Der Mann im weissen Shirt daneben behaelt
      // seinen Kopf vollstaendig (Quell-x 1330-1400, per Crop geprueft), nur seine
      // Schulter laeuft aus dem Bild — das ist kein Kopfschnitt.
      // Neue Datei 1410x1065, Graustufen-Mittel 108.6 (vorher 106), kein Upscaling:
      // die Quelle ist mit 1410px immer noch fast doppelt so breit wie der 767px-Kasten.
      image: {
        src: '/photos/r188-kursaufbau/kursstaffel-studio-1410.jpg',
        alt: 'Volle Kursstaffel tanzt im hellen Salsaflow Studio bei Tageslicht',
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
      // Gleiches Motiv wie de (R141b).
      image: {
        src: '/photos/2026/kurse-classfreude-01.webp',
        alt: 'Dance class in the bright Salsaflow studio, the group practising together',
      },
      cardLabel: 'Your start',
      cardText: 'We recommend a suitable starting point.',
    },
    levels: {
      eyebrow: 'Level overview',
      // R188 KA2: question headline, same as de.
      title: 'Which stages do Salsa and Bachata',
      titleAccent: 'have?',
      body: 'Five stages build technique and confidence step by step. Flow classes consolidate what you have learned before the next group begins.',
      youLearnLabel: 'You learn',
      nextLabel: 'Move on, when',
      detailsLabel: 'Content and next step',
      startTag: 'You start here',
      buildTag: 'Builds on',
      rungs: [
        {
          name: 'Beginner stages 1 to 6',
          forYou: 'You are new or want to build your foundations systematically.',
          youLearn: 'Rhythm, basic steps, turns, leading and following.',
          next: 'You can use the beginner material with confidence.',
        },
        {
          name: 'Beginner Flow',
          forYou: 'You have finished beginner stages 1 to 6 and want to consolidate them.',
          youLearn: 'Connect familiar material, stabilise your timing and dance more freely.',
          next: 'You can dance beginner combinations smoothly and in time with the music.',
        },
        {
          name: 'Intermediate stages 7 to 12',
          forYou: 'Your foundations are solid and you want more technique and repertoire.',
          youLearn: 'More complex figures, musicality, styling and more precise signals.',
          next: 'You can dance the intermediate material confidently with different partners.',
        },
        {
          name: 'Intermediate Flow',
          forYou: 'You have finished stages 7 to 12 and want more flow.',
          youLearn: 'Vary combinations, respond more musically and refine the details.',
          next: 'You can use intermediate material flexibly and with control.',
        },
        {
          name: 'Advanced from stage 13',
          forYou: 'You are confident with demanding technique and want to go deeper.',
          youLearn: 'Fine detail, dynamics, interpretation and complex combinations.',
          next: 'You dance with control, musicality and your own expression.',
        },
      ],
      stylesIntro: 'We dance Salsa On1 and On2. Heels has its own structure: beginner, intermediate and advanced. Workshops run as open level.',
      styles: [
        { label: 'Salsa', href: R.salsa },
        { label: 'Bachata', href: R.bachata },
        { label: 'Heels', href: R.heels },
      ],
    },
    doubt: {
      eyebrow: 'If you are unsure',
      // R188 KA2: question headline, same as de.
      title: 'What if you do not know your',
      titleAccent: 'level?',
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
      // R188 KA2: question headline, same as de.
      title: 'How long does a course term',
      titleAccent: 'last?',
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
      // R188 KA2: question headline, same as de (Video 11:38-11:46).
      title: 'What if you miss a',
      titleAccent: 'class?',
      body: 'If you miss a class, let us know early. Whether and how a lesson can be caught up depends on the course, level and space.',
      // Gleiches Motiv und derselbe Beschnitt wie de (R141, R188 SW4 — Begruendung
      // und Messwerte stehen dort). Beide Sprachen muessen dieselbe Datei zeigen,
      // sonst traegt /kursaufbau je Sprache einen anderen Kopfschnitt.
      image: {
        src: '/photos/r188-kursaufbau/kursstaffel-studio-1410.jpg',
        alt: 'A full course term dancing in the bright Salsaflow studio in daylight',
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
} satisfies Record<Lang, KursaufbauContent>;
