// Heels-Seite (/tanzkurse/heels) aus dem V3-Copyplan (pages/05). Eigener Rhythmus als Salsa/Bachata:
// Hero -> Angst abbauen (Myth-Busting) -> Was trainiert wird -> Schuhe & Vorbereitung -> Atmosphaere
// -> Final CTA -> FAQ. Copy 1:1, zweisprachig (de = Plan, en = treu). Echte Umlaute, CH-ss.
//
// Bild-Hinweis (03_KI_BILD_LUECKEN): Heels hat die groesste KI-Luecke (helles Beginner-/Schuh-Motiv).
// Bis ein echtes Foto oder KI-Still-Life da ist, stehen Platzhalter mit `// TODO KI-Bild`.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Crumb, Faq } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };
type HeroBand = Img & { position?: string; heightClass?: string };

export type HeelsContent = {
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
    /** Full-bleed Charakter-Band unter dem Typo-Hero (21:9 Polished-Hero, Foto-Pipeline 2026-08-06). */
    band: HeroBand;
    cardLabel: string;
    cardText: string;
  };
  myth: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    cards: { myth: string; reality: string }[];
    cta: Cta;
  };
  training: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    items: { name: string; text: string }[];
    cta: Cta;
    image: Img;
  };
  shoes: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    checklist: string[];
    cta: Cta;
    image: Img;
  };
  atmosphere: {
    title: string;
    titleAccent?: string;
    body: string;
    microcopy: string;
    image: Img;
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

const R = {
  heelsPlan: '/kursplan?stil=heels',
  tanzschuhe: '/mehr/tanzschuhe',
  kontakt: '/kontakt',
  schnupper: '/kontakt#schnupperstunde',
  heelsPage: '/tanzkurse/heels',
};

export const HEELS: Record<Lang, HeelsContent> = {
  de: {
    seo: 'heels',
    crumb: { label: 'Heels', href: R.heelsPage },
    hero: {
      eyebrow: 'Heels Kurse in Basel',
      title: 'Tanze Heels mit Haltung, Technik und',
      titleAccent: 'Selbstvertrauen',
      lead: 'Heels ist mehr als Schritte auf Absätzen. Du trainierst Linien, Ausdruck, Körperkontrolle und Präsenz, in einem Umfeld, das dich stärkt statt bewertet.',
      bullets: [
        'Haltung, Linien und Walks',
        'Technik und sichere Bewegungen',
        'Choreografie und Ausdruck',
        'Level je nach aktuellem Kursplan',
        'Studio direkt am Bahnhof SBB',
      ],
      primary: { label: 'Heels Kurs ansehen', href: R.heelsPlan },
      secondary: { label: 'Frage zum Einstieg stellen', href: R.kontakt },
      microcopy: 'Level, Schuhe und Vorbereitung klären wir vor dem Start.',
      image: { src: '/photos/premium/offer-heels-1200.webp', alt: 'Heels-Tänzerin mit klarer Linie und Präsenz im Salsaflow Studio' },
      band: {
        src: '/photos/2026/kurse-heels-energie-hero-2100.webp',
        alt: 'Heels-Kurs im hellen Studio, energiegeladene Gruppe vor der Salsaflow-Wand',
        // Kein heightClass mehr: das flache 10-12rem-Band (192px auf 1440) schnitt
        // Stirn und Scheitel der Gruppe (Critic Runde 8, Item 1) — es gilt wieder die
        // HeroFrame-Default-Hoehe h-[16rem] sm:h-[22rem] lg:h-[30rem]. Im hohen Band
        // haelt 15% die Kopfreihe im Bild, ohne nur Decke zu zeigen (25% schnitt der
        // Taenzerin rechts noch die Schaedeldecke an).
        position: 'center 15%',
      },
      cardLabel: 'Dein Einstieg',
      cardText: 'Sicher stehen, Haltung finden, freier bewegen.',
    },
    myth: {
      eyebrow: 'Kein Druck',
      title: 'Du musst nicht perfekt laufen können. Du lernst, dich sicher zu bewegen',
      body: 'Viele denken bei Heels sofort an perfekte Linien, Bühne und Selbstbewusstsein. Im Kurs beginnt es viel einfacher: sicher stehen, Gewicht kontrollieren, Haltung finden und sich Schritt für Schritt freier bewegen.',
      cards: [
        { myth: '„Ich bin nicht selbstbewusst genug.“', reality: 'Genau daran arbeitest du im Kurs. Selbstbewusstsein ist nicht Voraussetzung, sondern Ergebnis.' },
        { myth: '„Ich kann nicht auf Absätzen tanzen.“', reality: 'Du startest mit Basics, sicheren Schuhen und kontrollierten Bewegungen. Höhe ist weniger wichtig als Stabilität.' },
        { myth: '„Ich muss schon gut tanzen können.“', reality: 'Entscheidend ist, dass du in deinem passenden Level startest und offen für Technik bist.' },
      ],
      cta: { label: 'Frage zum Einstieg stellen', href: R.kontakt },
    },
    training: {
      eyebrow: 'Kursinhalte',
      title: 'Was im Heels-Kurs',
      titleAccent: 'entsteht',
      body: 'Es geht nicht darum, direkt wie auf der Bühne auszusehen. Es geht darum, deinen Körper klarer zu steuern.',
      items: [
        { name: 'Haltung', text: 'Du lernst, wie du stabiler stehst, deine Mitte aktivierst und präsenter wirkst.' },
        { name: 'Linien', text: 'Arme, Beine und Blick werden bewusster, damit Bewegungen klarer aussehen.' },
        { name: 'Walks & Technik', text: 'Du übst sichere Schritte, Gewichtswechsel und Übergänge.' },
        { name: 'Choreografie', text: 'Bewegungen werden verbunden, damit aus einzelnen Elementen ein Auftrittsgefühl entsteht.' },
      ],
      cta: { label: 'Kursplan ansehen', href: R.heelsPlan },
      // Design-Kritik Runde 2, Issue 5: hier stand /photos/shows/show-16.webp — eine
      // Buehnenaufnahme mit Luminanz 16/255 (89.7% der Pixel unter 40/255) auf einer
      // paper-warm-Sektion. Ein schwarzes Rechteck auf hellem Papier, Motiv nicht lesbar.
      // Ersatz: das helle Studio-Doppelportraet (Luminanz 180/255), das die Kritik als
      // "bereits vorhandenes starkes helles Motiv" der Heels-Seite ausdruecklich nennt.
      image: { src: '/photos/showcase/hp-22.webp', alt: 'Zwei Heels-Tänzerinnen mit klarer Haltung im hellen Studio' },
    },
    shoes: {
      eyebrow: 'Schuhe & Vorbereitung',
      title: 'Welche Schuhe brauchst du?',
      body: 'Für den Anfang brauchst du keinen extrem hohen Absatz. Wichtiger sind ein stabiler Sitz, sicherer Halt und eine Sohle, mit der du dich kontrolliert bewegen kannst. Wenn du unsicher bist, frag uns vor dem Kurs.',
      checklist: [
        'stabiler Absatz statt maximaler Höhe',
        'Schuh sitzt fest, ohne zu drücken',
        'Fussgelenk fühlt sich sicher an',
        'keine rutschige Modesohle',
        'lieber kontrolliert starten als riskant aussehen',
      ],
      cta: { label: 'Tanzschuhe ansehen', href: R.tanzschuhe },
      image: { src: '/composites/heels-shoes-stilllife.webp', alt: 'Schwarze Dance Heels und rote Salsa-Schuhe im hellen Salsaflow Studio' },
    },
    atmosphere: {
      title: 'Stark aussehen darf sich trotzdem sicher anfühlen',
      body: 'Bei uns geht es nicht nur um Attitude. Menschen dürfen in einem unterstützenden Raum wachsen. Darum bleibt der Ton bewusst freundlich: kein Druck, keine Bewertung, kein Zwang, jemand anderes zu sein.',
      microcopy: 'Du musst nicht so starten. Genau dahin wächst man Schritt für Schritt.',
      image: { src: '/photos/showcase/hp-06.webp', alt: 'Heels-Gruppe im Studio, unterstützende Stimmung' },
    },
    closing: {
      title: 'Probiere Heels im passenden',
      titleAccent: 'Level',
      body: 'Öffne den Kursplan oder stell uns kurz deine Frage. Wir helfen dir, Level, Schuhe und Einstieg realistisch einzuschätzen.',
      primary: { label: 'Heels Einstieg finden', href: R.heelsPlan },
      secondary: { label: 'Frage stellen', href: R.kontakt },
      microcopy: 'Unterstützend · klar aufgebaut · direkt am Bahnhof SBB.',
    },
    faqEyebrow: 'Heels FAQ',
    faqTitle: 'Häufige Fragen zu Heels',
    faq: [
      {
        q: 'Muss ich schon tanzen können?',
        a: 'Nein. Wichtig ist, dass du offen bist und im passenden Level startest. Technik und Sicherheit werden im Kurs aufgebaut.',
      },
      {
        q: 'Welche Heels brauche ich?',
        a: 'Starte lieber mit stabilen Schuhen als mit sehr hohen Absätzen. Wenn du unsicher bist, frag vor dem Kurs nach einer Empfehlung.',
      },
      {
        q: 'Ist Heels nur für Fortgeschrittene?',
        a: 'Nicht grundsätzlich. Entscheidend sind der aktuelle Kursplan und das Level. Frag uns, ob gerade ein Beginner-Angebot aktiv ist.',
      },
      {
        q: 'Kann ich erst zuschauen oder schnuppern?',
        a: 'Wenn eine Schnuppermöglichkeit besteht, siehst du sie direkt im Kursplan. Sonst schreib uns kurz über das Kontaktformular.',
      },
    ],
  },
  en: {
    seo: 'heels',
    crumb: { label: 'Heels', href: R.heelsPage },
    hero: {
      eyebrow: 'Heels classes in Basel',
      title: 'Dance heels with posture, technique and',
      titleAccent: 'confidence',
      lead: 'Heels is more than steps in high shoes. You train lines, expression, body control and presence, in a place that lifts you up instead of judging you.',
      bullets: [
        'Posture, lines and walks',
        'Technique and safe movement',
        'Choreography and expression',
        'Level depending on the current schedule',
        'Studio right by the SBB station',
      ],
      primary: { label: 'See the Heels course', href: R.heelsPlan },
      secondary: { label: 'Ask about getting started', href: R.kontakt },
      microcopy: 'We sort out level, shoes and preparation before you start.',
      image: { src: '/photos/premium/offer-heels-1200.webp', alt: 'Heels dancer with a clear line and presence in the Salsaflow studio' },
      band: {
        src: '/photos/2026/kurse-heels-energie-hero-2100.webp',
        alt: 'Heels class in the bright studio, energetic group in front of the Salsaflow wall',
        // Kein heightClass mehr: das flache 10-12rem-Band (192px auf 1440) schnitt
        // Stirn und Scheitel der Gruppe (Critic Runde 8, Item 1) — es gilt wieder die
        // HeroFrame-Default-Hoehe h-[16rem] sm:h-[22rem] lg:h-[30rem]. Im hohen Band
        // haelt 15% die Kopfreihe im Bild, ohne nur Decke zu zeigen (25% schnitt der
        // Taenzerin rechts noch die Schaedeldecke an).
        position: 'center 15%',
      },
      cardLabel: 'Your start',
      cardText: 'Stand safely, find posture, move more freely.',
    },
    myth: {
      eyebrow: 'No pressure',
      title: 'You do not need to walk perfectly. You learn to move safely',
      body: 'Many people think of perfect lines, the stage and confidence when they hear heels. In class it starts much simpler: stand safely, control your weight, find posture and move more freely step by step.',
      cards: [
        { myth: '"I am not confident enough."', reality: 'That is exactly what you work on in class. Confidence is not a requirement, it is a result.' },
        { myth: '"I cannot dance in heels."', reality: 'You start with basics, safe shoes and controlled movement. Height matters less than stability.' },
        { myth: '"I already have to dance well."', reality: 'What matters is that you start at the right level and stay open to technique.' },
      ],
      cta: { label: 'Ask about getting started', href: R.kontakt },
    },
    training: {
      eyebrow: 'Course content',
      title: 'What you develop in a Heels',
      titleAccent: 'class',
      body: 'You begin with control, posture and technique, then bring those foundations into choreography.',
      items: [
        { name: 'Posture', text: 'You learn to stand more steadily, engage your centre and feel more present.' },
        { name: 'Lines', text: 'Arms, legs and gaze become more deliberate so movements look clearer.' },
        { name: 'Walks & technique', text: 'You practise safe steps, weight changes and transitions.' },
        { name: 'Choreography', text: 'Movements get connected so single elements grow into a sense of performance.' },
      ],
      cta: { label: 'See the schedule', href: R.heelsPlan },
      image: { src: '/photos/showcase/hp-22.webp', alt: 'Two heels dancers with a clear posture in the bright studio' },
    },
    shoes: {
      eyebrow: 'Shoes & preparation',
      title: 'Which shoes do you need?',
      body: 'You do not need very high heels to start. A secure fit, ankle support and a sole that lets you move with control matter far more. Ask us before class if you are unsure.',
      checklist: [
        'a stable heel instead of maximum height',
        'the shoe sits firmly without pinching',
        'your ankle feels safe',
        'no slippery fashion sole',
        'control matters more than appearance',
      ],
      cta: { label: 'See dance shoes', href: R.tanzschuhe },
      image: { src: '/composites/heels-shoes-stilllife.webp', alt: 'Black dance heels and red salsa shoes in the bright Salsaflow studio' },
    },
    atmosphere: {
      title: 'Strength and safety belong together',
      body: 'The class gives you room to develop at your own pace. The atmosphere is supportive, with no pressure to perform or pretend to be someone else.',
      microcopy: 'You build confidence, control and expression step by step.',
      image: { src: '/photos/showcase/hp-06.webp', alt: 'Heels group in the studio, supportive mood' },
    },
    closing: {
      title: 'Try Heels at the right',
      titleAccent: 'level',
      body: 'Open the schedule or send us a message. We will help you choose the right level and shoes for your first class.',
      primary: { label: 'Find your Heels start', href: R.heelsPlan },
      secondary: { label: 'Ask a question', href: R.kontakt },
      microcopy: 'Supportive · clearly structured · right by the SBB station.',
    },
    faqEyebrow: 'Heels FAQ',
    faqTitle: 'Common questions about Heels',
    faq: [
      {
        q: 'Do I already need to know how to dance?',
        a: 'No. Start at the right level and we will develop technique and safety step by step in class.',
      },
      {
        q: 'Which heels do I need?',
        a: 'Better to start with stable shoes than very high heels. If you are unsure, ask for a recommendation before the course.',
      },
      {
        q: 'Is Heels only for advanced dancers?',
        a: 'Not in general. The current schedule and level decide. Ask us whether a beginner offer is running right now.',
      },
      {
        q: 'Can I watch or try first?',
        a: 'If a trial option exists, you see it directly in the schedule. Otherwise send us a quick message via the contact form.',
      },
    ],
  },
};
