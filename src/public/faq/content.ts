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
/** R188 F4: eine Antwort darf zwei Wege anbieten (z. B. Schnupperstunde ueber Kursplan
 *  ODER ueber das Formular). Mehr als zwei waeren eine Linkliste, kein Satz. */
export type FaqItemData = Faq & { link?: FaqLink; link2?: FaqLink };
/** R188 F5: jeder FAQ-Block bekommt ein echtes Foto. `title` bleibt die Ueberschrift,
 *  `blurb` sagt in einem Satz, worum es in diesem Block geht (F3: "klarere
 *  Ueberschriften"), `image` ist das Motiv daneben. Alle Bilder liegen im Bestand und
 *  sind vor dem Einbau einzeln angesehen worden. */
/** R188, Kritiker-Befund /faq d-04 + d-05: "dasselbe blaue Social-Foto erscheint doppelt".
 *  Gemessen (scratch/r188-faq-images.cjs) liegt im DOM KEIN doppeltes Bild — alle vier
 *  Motive sind verschieden. Die Ursache ist das Sticky-Verhalten: das Bild einer Spalte
 *  laeuft `lg:sticky` neben der Frageliste mit. Die dritte Spalte traegt 12 Fragen (die
 *  erste nur 6) und ist damit ueber zwei volle 900px-Viewports hoch — dasselbe Foto stand
 *  darum in Slice d-04 UND d-05 fest im Bild. Sichtbar ist das eine Doppelung, auch wenn
 *  die Datei nur einmal existiert.
 *
 *  `image2` ist die Antwort: eine lange Spalte bekommt ein ZWEITES Motiv, das auf halber
 *  Hoehe uebernimmt. Kurze Spalten lassen das Feld weg und bleiben unveraendert. */
export type FaqColumn = { title: string; blurb: string; image: Img; image2?: Img; items: FaqItemData[] };

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
  /* R188 F4: Ziele der neuen Antwort-Links. Beide live geprueft (HTTP 200). */
  heels: '/tanzkurse/heels',
};

export const FAQ_CONTENT = {
  de: {
    seo: 'faq',
    crumb: { label: 'FAQ', href: '/faq' },
    hero: {
      eyebrow: 'FAQ',
      title: 'Unsicher ist normal. Unklar muss es nicht bleiben.',
      lead: 'Hier findest du Antworten zu Einstieg, Tanzpartner, Level, Preisen, Kursablauf, Schuhen, Events und Kontakt.',
      primary: { label: 'Kursplan ansehen', href: R.kursplan },
      secondary: { label: 'Frage stellen', href: R.kontakt },
      microcopy: 'Wenn deine Frage nicht dabei ist, schreib uns kurz.',
      /* R188 F6: der Hero zeigt jetzt ein echtes Bild rechts neben Text und Knoepfen.
         hero-paar-dreh-01 ist scharf (1600x1066), quer und zeigt beide Gesichter ganz.
         Bewusst ein ANDERES Motiv als der erste FAQ-Block darunter: in der ersten Runde
         stand hier dasselbe Kursfoto wie in "Dein Einstieg", man sah es beim Scrollen
         zweimal innerhalb einer Bildschirmhoehe (Beleg d-01/d-02 der ersten Runde). */
      image: { src: '/photos/2026/hero-paar-dreh-01.webp', alt: 'Tanzpaar dreht sich gemeinsam im Salsaflow-Studio' },
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
          title: 'Dein Einstieg',
          blurb: 'Ausprobieren, ohne Vorkenntnisse und ohne Tanzpartner.',
          image: {
            src: '/photos/2026/kurse-classfreude-01.webp',
            alt: 'Beginner-Kurs im hellen Salsaflow-Studio, viele Menschen tanzen gemeinsam',
          },
          items: [
            /* R188 F4 (Video 00:50-01:10): "Antworten: mehr Infos + direkte Links."
               Jede Antwort unten ist gegen bestehende Seiteninhalte geprueft; es steht
               nichts drin, was nicht schon anderswo auf der Seite belegt ist:
               - Gratis/unverbindlich/ohne Partner: courses/overview-content.ts:227-228
               - 8 Wochen, eine Lektion a 60 Minuten: preise/content.ts:225
               - Partnerwechsel im Kurs: home/content-v3.ts:218
               - Studios am Bahnhof Basel SBB: home/content.ts:138
               Die Links zeigen ausschliesslich auf Routen, die live 200 liefern. */
            {
              q: 'Kann ich einfach ausprobieren, ob Salsaflow zu mir passt?',
              a: 'Ja. Die Gratis Schnupperstunde ist genau dafür gedacht: kostenlos, unverbindlich und auch ohne Tanzpartner. Du tanzt eine ganze Lektion in einem laufenden Kurs mit und bekommst ein Gefühl für Level, Tempo und die Leute, bevor du dich festlegst.',
              link: { label: 'Schnupperstunde buchen', href: R.schnupper },
            },
            {
              q: 'Muss ich schon tanzen können?',
              a: 'Nein, und die meisten können es am ersten Abend nicht. Beginner-Kurse starten bei null: zuerst der Grundschritt, dann Führen und Folgen, dann die ersten Figuren. Wir wechseln im Kurs regelmässig die Partner durch, dadurch gewöhnst du dich schnell an verschiedene Tanzpartner statt nur an einen. Wenn du unsicher bist, welches Level passt, komm zur Schnupperstunde und wir schauen es gemeinsam an.',
              link: { label: 'Kurse und Level ansehen', href: R.tanzkurse },
            },
            {
              q: 'Wie buche ich eine Schnupperstunde?',
              a: 'Auf zwei Wegen. Im Kursplan suchst du dir den Kurs aus, der zeitlich passt, und reservierst direkt deinen Platz. Oder du füllst das kurze Formular auf der Schnupperseite aus, dann melden wir uns mit einem passenden Termin bei dir.',
              link: { label: 'Zum Kursplan', href: R.kursplan },
              link2: { label: 'Zur Schnupperstunde', href: R.schnupper },
            },
            {
              q: 'Kann ich ohne Tanzpartner kommen?',
              a: 'Ja, und die allermeisten kommen ohne. Du meldest dich allein an, im Kurs wird auf eine gute Balance zwischen Leadern und Followern geachtet und die Partner wechseln regelmässig durch. So tanzt du mit allen und lernst schneller, als wenn du immer mit derselben Person übst.',
            },
            {
              q: 'Passe ich da rein, auch von meinem Alter her?',
              a: 'Ja. Bei uns tanzen Menschen aller Altersgruppen nebeneinander im selben Kurs, von Studierenden bis weit darüber hinaus. Beim Partnerwechsel tanzt du im Lauf eines Abends ohnehin mit fast allen. Du wirst vom ersten Abend an herzlich aufgenommen.',
            },
            {
              q: 'Wo buche ich den Heels-Kurs?',
              a: 'Auf der Heels-Seite unter Tanzkurse. Dort stehen der Aufbau, die aktuellen Termine und die Hinweise zu Schuhen und Sicherheit.',
              link: { label: 'Zur Seite Heels', href: R.heels },
            },
          ],
        },
        {
          title: 'Kurs, Partner und Level',
          blurb: 'Wie ein Kurs abläuft, wie lange er dauert und welches Level zu dir passt.',
          /* R188: hier stand zuerst hero-paar-studiowand-01.webp. Im Screenshot
             (worklog/shots/R188/team-faq-kontakt/faq/d-03.png der ersten Runde) war der
             Kopf des Mannes oben abgeschnitten — und zwar NICHT durch das Fenster: die
             Datei ist 1920x1280 (3:2), das 4:3-Fenster zeigt davon die volle Hoehe und
             beschneidet nur die Breite (1706 von 1920 px). Der Anschnitt steckt in der
             Quelle selbst, kein object-position kann ihn heilen.
             event-social-couple-01.webp zeigt dieselbe Aussage (Fuehren und Folgen) mit
             beiden Gesichtern ganz im Bild und ist nicht das Hero-Motiv. */
          image: {
            src: '/photos/2026/event-social-couple-01.webp',
            alt: 'Tanzpaar führt und folgt an einem Salsaflow-Abend',
          },
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
              a: 'Dann starte mit einer Schnupperstunde. Du tanzt eine Lektion mit und danach wissen wir beide, ob das Level passt. Das ist ehrlicher als jede Selbsteinschätzung. Wer schon getanzt hat und unsicher ist, schreibt uns kurz, was und wie lange, dann ordnen wir das ein.',
              link: { label: 'Schnupperstunde buchen', href: R.schnupper },
              link2: { label: 'Frag uns direkt', href: R.kontakt },
            },
            {
              q: 'Kann ich direkt in Intermediate starten?',
              a: 'Wenn du passende Erfahrung hast, ja. Trotzdem lohnt sich bei Unsicherheit ein kurzer Level-Check.',
            },
            {
              q: 'Wie lange dauert ein Kurs?',
              a: 'Eine Kursstaffel dauert 8 Wochen mit einer Lektion à 60 Minuten pro Woche, also 8 Lektionen. Danach entscheidest du neu, ob du im selben Level bleibst oder eine Stufe weitergehst. Welche Staffeln gerade starten, steht im Kursplan.',
              link: { label: 'Aktuelle Staffeln im Kursplan', href: R.kursplan },
            },
            {
              q: 'Was passiert, wenn ich eine Lektion verpasse?',
              a: 'Melde dich frühzeitig. Ob du eine Lektion nachholen kannst, hängt von Kurs, Level und freiem Platz ab. Sag uns kurz Bescheid, dann finden wir eine Lösung.',
            },
            {
              q: 'Wo finden die Kurse statt?',
              a: 'In unseren drei Studios direkt am Bahnhof Basel SBB. Auf der Kurskarte im Kursplan siehst du, in welchem Studio dein Kurs läuft. Die genaue Anfahrt steht auf der Standortseite.',
              link: { label: 'Anfahrt und Standort', href: R.standort },
            },
            {
              q: 'Wie komme ich mit dem Zug zum Studio?',
              a: 'Die Studios liegen direkt am Bahnhof Basel SBB. Die Anfahrt steht auf der Standortseite.',
            },
          ],
        },
        {
          title: 'Preise, Events und Kontakt',
          blurb: 'Was es kostet, was an den Abenden läuft und wie du uns erreichst.',
          image: {
            src: '/photos/2026/community-diversitaet-01.webp',
            alt: 'Volle Tanzfläche an einer Danceflow Night',
          },
          /* Diese Spalte traegt 12 Fragen und ist ueber zwei Viewports hoch. Ohne zweites
             Motiv stand das Foto oben in beiden Slices fest (Befund d-04 + d-05).
             hp-28.webp (1800x1200) ist ein echtes Salsaflow-Showfoto aus dem Bestand,
             sitewide an keiner Stelle als aktives `src` eingebunden, alle Koepfe ganz
             im Bild. Es passt zum Thema Events und loest die zweite Bildhaelfte ab. */
          image2: {
            src: '/photos/showcase/hp-28.webp',
            alt: 'Das Salsaflow-Team nach einer Show auf der Bühne',
          },
          items: [
            {
              q: 'Was kostet ein Kurs?',
              a: 'Der Preis gilt für die ganze Kursstaffel, also 8 Lektionen à 60 Minuten, nicht pro Abend. Dazu gibt es Workshops, Pässe und Privatstunden mit eigenen Preisen. Alle aktuellen Beträge stehen auf der Preisseite.',
              link: { label: 'Alle Preise ansehen', href: R.preise },
            },
            {
              q: 'Gibt es Studentenpreise?',
              a: 'Ja. Für Schüler und Studenten kostet die Kursstaffel CHF 160 statt 190, für Paare CHF 270 statt 320. Die übrigen Angebote haben eigene reduzierte Sätze, alle stehen auf der Preisseite.',
              link: { label: 'Zu den Preisen', href: R.preise },
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
              a: 'Unser regelmässiger Social-Dance-Abend mit Salsa, Bachata und der ganzen Community. Hier tanzt du frei, was du im Kurs gelernt hast, mit wechselnden Partnern statt nach Programm. Genau dort geht das Gelernte am schnellsten in Fleisch und Blut über.',
              link: { label: 'Termine bei den Events', href: R.events },
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
      primary: { label: 'See the schedule', href: R.kursplan },
      secondary: { label: 'Ask a question', href: R.kontakt },
      microcopy: 'If your question is not here, just drop us a line.',
      image: { src: '/photos/2026/hero-paar-dreh-01.webp', alt: 'Dance couple turning together in the Salsaflow studio' },
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
          blurb: 'Try it out, with no experience and no dance partner.',
          image: {
            src: '/photos/2026/kurse-classfreude-01.webp',
            alt: 'Beginner course in the bright Salsaflow studio, many people dancing together',
          },
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
          title: 'Course, partner and level',
          blurb: 'How a course runs, how long it lasts and which level fits you.',
          image: {
            src: '/photos/2026/event-social-couple-01.webp',
            alt: 'Dance couple leading and following at a Salsaflow night',
          },
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
          title: 'Prices, events and contact',
          blurb: 'What it costs, what happens on the nights and how to reach us.',
          image2: {
            src: '/photos/showcase/hp-28.webp',
            alt: 'The Salsaflow team on stage after a show',
          },
          image: {
            src: '/photos/2026/community-diversitaet-01.webp',
            alt: 'Full dance floor at a Danceflow Night',
          },
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
