// Inhalt der FAQ-Seite (/faq) aus dem V3-Copyplan (pages/24_faq.md), zweisprachig DE/EN.
// EINE Datei, EIN Seiten-Component (FaqPage.tsx). Copy so nah wie moeglich am Plan-Wortlaut.
//
// Bewusste, dokumentierte Abweichung vom strikten 1:1: die Plan-Antworten enthalten an ein
// paar Stellen interne Redaktions-Notizen ("final pruefen", "Die Seite/Kurskarte sollte
// anzeigen", "Vor Livegang", "In bisherigen Informationen wird gearbeitet"). Solche Notizen
// sind Anweisungen an die Redaktion, kein Kunden-Text, und wuerden live peinlich wirken. Sie
// sind hier zur sauberen Kunden-Antwort umgeschrieben. Dabei nur GESICHERTE Fakten aus dem
// Bau-Brief (Kursstaffel 8 Wochen, 1 Lektion a 60 Minuten pro Woche, 3 Studios am Bahnhof
// Basel SBB, info@salsaflow-dc.com). Zahlen und Preise nur aus dem Bau-Brief.
//
// Echte Umlaute (ae/oe/ue -> ä/ö/ü), CH-ss (kein Eszett), keine Em-Dashes.
// Alle FAQ-Fragen/Antworten landen in EINEM FaqBlock (setzt die vollstaendige FAQPage-JSON-LD).

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb, HeroCta } from '@/public/subpage/kit';

type Img = { src: string; alt: string };
type Theme = { label: string; hint: string; href: string };
export type FaqLink = { label: string; href: string };
export type FaqItemData = Faq & { link?: FaqLink };
export type FaqColumn = { title: string; items: FaqItemData[] };

export type FaqPageContent = {
  seo: SeoKey;
  crumb: Crumb;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    primary: HeroCta;
    secondary: HeroCta;
    microcopy: string;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  themes: {
    title: string;
    titleAccent?: string;
    lead: string;
    items: Theme[];
  };
  faqSection: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    items: Faq[];
    columns: FaqColumn[];
  };
  closing: {
    title: string;
    titleAccent?: string;
    body: string;
    primary: HeroCta;
    secondary: HeroCta;
  };
};

/* Interne Ziel-Routen (echte App-Routen). Plan-Links wie /kursplan-buchung/ mappen auf /kursplan. */
const R = {
  kontakt: '/kontakt',
  schnupper: '/schnupperstunde',
  kursplan: '/kursplan',
  tanzkurse: '/tanzkurse',
  preise: '/preise',
  events: '/events',
  tanzschuhe: '/mehr/tanzschuhe',
  standort: '/kontakt/standort-raumvermietung',
};

export const FAQ_CONTENT = {
  de: {
    seo: 'faq',
    crumb: { label: 'FAQ', href: '/faq' },
    hero: {
      eyebrow: 'FAQ',
      title: 'Unsicher ist normal. Unklar muss es nicht bleiben.',
      lead: 'Hier findest du Antworten zu Einstieg, Tanzpartner, Level, Preisen, Kursablauf, Schuhen, Events und Kontakt.',
      primary: { label: 'Frage stellen', href: R.kontakt },
      secondary: { label: 'Kursplan ansehen', href: R.kursplan },
      microcopy: 'Wenn deine Frage nicht dabei ist, schreib uns kurz.',
      image: { src: '/photos/showcase/hp-05.webp', alt: 'Zwei Tanzpaare drehen sich in einem hellen Salsaflow Studio' },
      cardLabel: 'Gut zu wissen',
      cardText: 'Die häufigsten Fragen, direkt beantwortet.',
    },
    themes: {
      title: 'Weiter zu den',
      titleAccent: 'Seiten',
      lead: 'Unten findest du alle Antworten. Willst du gleich tiefer, führt dich jedes Thema zur passenden Seite.',
      items: [
        { label: 'Einstieg & Schnupperstunde', hint: 'Ausprobieren ohne Risiko', href: R.schnupper },
        { label: 'Tanzpartner & Level', hint: 'Ohne Partner, richtiges Level', href: R.tanzkurse },
        { label: 'Anmeldung & Kursablauf', hint: 'Dauer, Nachholen, Studios', href: R.kursplan },
        { label: 'Preise', hint: 'Was Kurse und Events kosten', href: R.preise },
        { label: 'Schuhe & Vorbereitung', hint: 'Schuhe und Kleidung zum Start', href: R.tanzschuhe },
        { label: 'Events', hint: 'Danceflow Nights und Workshops', href: R.events },
        { label: 'Kontakt & Standort', hint: 'Anfahrt und Raumvermietung', href: R.standort },
      ],
    },
    faqSection: {
      eyebrow: 'FAQ',
      title: 'Häufige',
      titleAccent: 'Fragen',
      items: [],
      columns: [
        {
          title: 'Einstieg',
          items: [
            {
              q: 'Kann ich einfach ausprobieren, ob Salsaflow zu mir passt?',
              a: 'Ja. Die Gratis Schnupperstunde ist genau dafür gedacht. Du bekommst ein Gefühl für Kurs, Level und Atmosphäre, ohne dich direkt festlegen zu müssen.',
            },
            {
              q: 'Muss ich schon tanzen können?',
              a: 'Nein. Beginner-Kurse starten ohne Vorkenntnisse. Wichtig ist nur, dass du offen bist, Schritt für Schritt zu lernen.',
            },
            {
              q: 'Wie buche ich eine Schnupperstunde?',
              a: 'Über den Kursplan oder das Schnupperformular auf der Schnupperseite.',
            },
            {
              q: 'Kann ich ohne Tanzpartner kommen?',
              a: 'Ja. Du kannst dich auch alleine anmelden. Im Kurs wird auf eine gute Balance geachtet und du lernst mit wechselnden Partner:innen.',
            },
            {
              q: 'Passe ich da rein, auch von meinem Alter her?',
              a: 'Ja. Bei uns tanzen Menschen aller Altersgruppen. Du wirst vom ersten Abend an herzlich aufgenommen.',
            },
            {
              q: 'Wo buche ich den Heels-Kurs?',
              a: 'Unter Tanzkurse, Seite Heels.',
            },
          ],
        },
        {
          title: 'Kurs, Partner, Level',
          items: [
            {
              q: 'Wie viele Figuren lerne ich am Anfang?',
              a: 'Weniger, als du denkst. Und das ist gut so. Am Anfang geht es um Führen und Folgen. Wer das kann, tanzt mit jeder Person, auch ohne eine einzige Figur. Die Figuren kommen dann von selbst.',
            },
            {
              q: 'Wie schnell komme ich voran?',
              a: 'Schon nach einem Kurs spürst du den Fortschritt. Am schnellsten wirst du, wenn du dranbleibst und das Gelernte an den Danceflow Nights anwendest.',
            },
            {
              q: 'Was ist, wenn ich mein Level nicht kenne?',
              a: 'Dann frag uns kurz oder starte mit einer Schnupperstunde. Wir helfen dir, nicht zu hoch und nicht zu tief einzusteigen.',
            },
            {
              q: 'Kann ich direkt in Intermediate starten?',
              a: 'Wenn du passende Erfahrung hast, ja. Trotzdem lohnt sich bei Unsicherheit ein kurzer Level-Check.',
            },
            {
              q: 'Wie lange dauert ein Kurs?',
              a: 'Eine Kursstaffel dauert 8 Wochen mit einer Lektion à 60 Minuten pro Woche. Die aktuellen Staffeln findest du im Kursplan.',
            },
            {
              q: 'Was passiert, wenn ich eine Lektion verpasse?',
              a: 'Melde dich frühzeitig. Ob du eine Lektion nachholen kannst, hängt von Kurs, Level und freiem Platz ab. Sag uns kurz Bescheid, dann finden wir eine Lösung.',
            },
            {
              q: 'Wo finden die Kurse statt?',
              a: 'In den Salsaflow-Studios direkt am Bahnhof Basel SBB. Auf der Kurskarte siehst du, in welchem Studio dein Kurs läuft.',
            },
            {
              q: 'Wie komme ich mit dem Zug zum Studio?',
              a: 'Die Studios liegen direkt am Bahnhof Basel SBB. Die Anfahrt steht auf der Standortseite.',
            },
          ],
        },
        {
          title: 'Preise, Events, Kontakt',
          items: [
            {
              q: 'Was kostet ein Kurs?',
              a: 'Alle aktuellen Preise findest du auf der Preisseite.',
            },
            {
              q: 'Gibt es Studentenpreise?',
              a: 'Ja. Für Schülerinnen, Schüler und Studierende gibt es reduzierte Preise. Die Details stehen auf der Preisseite.',
            },
            {
              q: 'Was kostet die Danceflow Night?',
              a: 'Für die Danceflow Night gibt es unterschiedliche Preise für Salsaflow-Schüler:innen und Gäste. Die aktuellen Beträge stehen auf der Preisseite.',
            },
            {
              q: 'Brauche ich Tanzschuhe für den Start?',
              a: 'Nicht zwingend. Für die erste Stunde reichen oft saubere, bequeme Schuhe. Später können Tanzschuhe helfen, besonders bei Drehungen und Heels.',
              link: { label: 'Zur Seite Tanzschuhe', href: R.tanzschuhe },
            },
            {
              q: 'Was ziehe ich zum Kurs an?',
              a: 'Bequeme Kleidung, in der du dich gut bewegen kannst. Für Heels gelten eigene Hinweise zu Schuhen und Sicherheit.',
            },
            {
              q: 'Kann ich mit Strassenschuhen ins Studio?',
              a: 'Nur wenn sie sauber und für drinnen geeignet sind. So schützen wir den Tanzboden.',
            },
            {
              q: 'Was ist die Danceflow Night?',
              a: 'Ein regelmässiger Social-Dance-Abend bei Salsaflow mit Salsa, Bachata und Community.',
            },
            {
              q: 'Sind Events auch für Gäste offen?',
              a: 'Viele Events sind auch für Gäste offen. Auf der jeweiligen Eventkarte siehst du, ob ein Abend offen ist.',
            },
            {
              q: 'Was ist der Unterschied zwischen Workshop und Kurs?',
              a: 'Ein Kurs läuft über mehrere Wochen. Ein Workshop fokussiert ein Thema an einem bestimmten Termin.',
            },
            {
              q: 'Wie erreiche ich Salsaflow?',
              a: 'Über das Kontaktformular, per E-Mail an info@salsaflow-dc.com, telefonisch oder über Social Media. Alle Wege findest du auf der Kontaktseite.',
            },
            {
              q: 'Wo ist Salsaflow?',
              a: 'Direkt am Bahnhof Basel SBB. Die genaue Anfahrt findest du auf der Standortseite.',
            },
            {
              q: 'Kann ich Räume mieten?',
              a: 'Ja. Räume kannst du für Tanz, Workshops oder Proben anfragen. Die Details stehen auf der Standort- und Raumvermietungsseite.',
            },
          ],
        },
      ],
    },
    closing: {
      title: 'Deine Frage ist nicht',
      titleAccent: 'dabei',
      body: 'Dann schreib uns kurz. Manchmal ist eine direkte Antwort schneller als weitere Recherche.',
      primary: { label: 'Kontakt aufnehmen', href: R.kontakt },
      secondary: { label: 'Kursplan ansehen', href: R.kursplan },
    },
  },

  en: {
    seo: 'faq',
    crumb: { label: 'FAQ', href: '/faq' },
    hero: {
      eyebrow: 'FAQ',
      title: 'Feeling unsure is normal. Staying unclear does not have to be.',
      lead: 'Here you find answers about getting started, dance partner, level, prices, how courses run, shoes, events and contact.',
      primary: { label: 'Ask a question', href: R.kontakt },
      secondary: { label: 'See the schedule', href: R.kursplan },
      microcopy: 'If your question is not here, just drop us a line.',
      image: { src: '/photos/showcase/hp-05.webp', alt: 'Two dance couples turning in a bright Salsaflow studio' },
      cardLabel: 'Good to know',
      cardText: 'The most common questions, answered honestly.',
    },
    themes: {
      title: 'Go to the',
      titleAccent: 'pages',
      lead: 'All answers are just below. If you want to go deeper right away, each topic takes you to the matching page.',
      items: [
        { label: 'Getting started & trial class', hint: 'Try it without risk', href: R.schnupper },
        { label: 'Dance partner & level', hint: 'No partner, right level', href: R.tanzkurse },
        { label: 'Sign-up & how courses run', hint: 'Duration, catch-up, studios', href: R.kursplan },
        { label: 'Prices', hint: 'What courses and events cost', href: R.preise },
        { label: 'Shoes & preparation', hint: 'Shoes and clothing to start', href: R.tanzschuhe },
        { label: 'Events', hint: 'Danceflow Nights and workshops', href: R.events },
        { label: 'Contact & location', hint: 'Directions and room rental', href: R.standort },
      ],
    },
    faqSection: {
      eyebrow: 'FAQ',
      title: 'Common',
      titleAccent: 'questions',
      items: [],
      columns: [
        {
          title: 'Getting started',
          items: [
            {
              q: 'Can I simply try out whether Salsaflow suits me?',
              a: 'Yes. The free trial class is made exactly for that. You get a feel for the class, level and atmosphere without having to commit right away.',
            },
            {
              q: 'Do I already need to know how to dance?',
              a: 'No. Beginner courses start with no experience. All that matters is that you are open to learning step by step.',
            },
            {
              q: 'How do I book a trial class?',
              a: 'Through the schedule or the trial form on the trial-class page.',
            },
            {
              q: 'Can I come without a dance partner?',
              a: 'Yes. You can sign up on your own. The course keeps a good balance and you learn with changing partners.',
            },
            {
              q: 'Do I fit in, also in terms of my age?',
              a: 'Yes. People of all ages dance with us. You are welcomed warmly from the very first evening.',
            },
            {
              q: 'Where do I book the Heels course?',
              a: 'Under courses, on the Heels page.',
            },
          ],
        },
        {
          title: 'Course, partner, level',
          items: [
            {
              q: 'How many figures do I learn at the start?',
              a: 'Fewer than you expect. And that is a good thing. At the start it is about leading and following. Once that works, you can dance with anyone, without a single figure. The figures follow on their own.',
            },
            {
              q: 'How fast do I make progress?',
              a: 'You feel the progress after a single course. You get fastest by staying with it and using what you learned at the Danceflow Nights.',
            },
            {
              q: 'What if I do not know my level?',
              a: 'Then ask us briefly or start with a trial class. We help you not to start too high or too low.',
            },
            {
              q: 'Can I start directly in intermediate?',
              a: 'If you have the right experience, yes. Still, if you are unsure, a quick level check is worth it.',
            },
            {
              q: 'How long does a course last?',
              a: 'A course term runs for 8 weeks with one 60-minute lesson per week. You find the current terms in the schedule.',
            },
            {
              q: 'What happens if I miss a lesson?',
              a: 'Let us know early. Whether you can catch up a lesson depends on the course, level and free spots. Send us a quick note and we find a solution.',
            },
            {
              q: 'Where do the courses take place?',
              a: 'In the Salsaflow studios right by Basel SBB station. The course card shows you which studio your course is in.',
            },
            {
              q: 'How do I get to the studio by train?',
              a: 'The studios sit right by Basel SBB station. Directions are on the location page.',
            },
          ],
        },
        {
          title: 'Prices, events, contact',
          items: [
            {
              q: 'What does a course cost?',
              a: 'You find all current prices on the prices page.',
            },
            {
              q: 'Are there student prices?',
              a: 'Yes. Pupils and students get reduced prices. The details are on the prices page.',
            },
            {
              q: 'What does the Danceflow Night cost?',
              a: 'The Danceflow Night has different prices for Salsaflow students and guests. The current amounts are on the prices page.',
            },
            {
              q: 'Do I need dance shoes to start?',
              a: 'Not necessarily. For the first class, clean, comfortable shoes are often enough. Later, dance shoes can help, especially with turns and heels.',
              link: { label: 'To the dance shoes page', href: R.tanzschuhe },
            },
            {
              q: 'What do I wear to class?',
              a: 'Comfortable clothes you can move well in. For heels there are separate notes on shoes and safety.',
            },
            {
              q: 'Can I wear street shoes in the studio?',
              a: 'Only if they are clean and suitable for indoors. That way we protect the dance floor.',
            },
            {
              q: 'What is the Danceflow Night?',
              a: 'A regular social-dance evening at Salsaflow with Salsa, Bachata and community.',
            },
            {
              q: 'Are events open to guests too?',
              a: 'Many events are open to guests too. The event card shows you whether an evening is open.',
            },
            {
              q: 'What is the difference between a workshop and a course?',
              a: 'A course runs over several weeks. A workshop focuses on one topic on a specific date.',
            },
            {
              q: 'How do I reach Salsaflow?',
              a: 'Through the contact form, by email at info@salsaflow-dc.com, by phone or via social media. You find all ways on the contact page.',
            },
            {
              q: 'Where is Salsaflow?',
              a: 'Right by Basel SBB station. You find the exact directions on the location page.',
            },
            {
              q: 'Can I rent rooms?',
              a: 'Yes. You can request rooms for dance, workshops or rehearsals. The details are on the location and room rental page.',
            },
          ],
        },
      ],
    },
    closing: {
      title: 'Still have a',
      titleAccent: 'question?',
      body: 'Send us a short message and we will help you directly.',
      primary: { label: 'Get in touch', href: R.kontakt },
      secondary: { label: 'See the schedule', href: R.kursplan },
    },
  },
} as const satisfies Record<Lang, FaqPageContent>;
