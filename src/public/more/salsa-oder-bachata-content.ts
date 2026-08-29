// Inhalt der Vergleichsseite /mehr/salsa-oder-bachata (SEO-Research 29.08.2026: "salsa oder
// bachata" 10/Mt CH, dazu die deutlich groesseren Stil-Queries bachata basel 590 / salsa basel 260).
//
// Kernbaustein ist eine echte HTML-Tabelle (siehe SalsaOderBachataPage.tsx): KI-Engines
// extrahieren Tabellen fuer "X vs Y"-Anfragen bevorzugt, eine Karten-Optik waere hier
// schlechter lesbar fuer Maschinen UND fuer Menschen.
//
// Regel fuer diese Seite: kein Stil wird schlechtgeredet. Jede Zeile beschreibt beide Spalten
// als Eigenschaft, nicht als Vor- oder Nachteil. Tempo-Angaben sind allgemeine Musikfakten,
// keine Salsaflow-Zahlen. CH-ss, echte Umlaute, keine Em-Dashes.

import type { Lang } from '@/lib/i18n';
import type { Crumb } from '@/public/subpage/kit';
import { SCHNUPPER_HREF } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
/** Eine Tabellenzeile: Kriterium in der Kopfspalte, dann Salsa, dann Bachata. */
type CompareRow = { criterion: string; salsa: string; bachata: string };

export type SalsaOderBachataContent = {
  crumbs: Crumb[];
  hero: {
    title: string;
    titleAccent: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
  };
  table: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    caption: string;
    headCriterion: string;
    headSalsa: string;
    headBachata: string;
    rows: CompareRow[];
  };
  styles: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    items: {
      name: string;
      claim: string;
      body: string;
      fits: string[];
      href: string;
      linkLabel: string;
    }[];
  };
  verdict: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    body2: string;
    cta: Cta;
  };
  closing: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
};

export const SALSA_ODER_BACHATA = {
  de: {
    crumbs: [{ label: 'Salsa oder Bachata', href: '/mehr/salsa-oder-bachata' }],
    hero: {
      title: 'Salsa oder Bachata: Was passt zu',
      titleAccent: 'dir?',
      lead: 'Beide Stile lassen sich ohne Vorkenntnisse lernen, und beide laufen bei uns am selben Abend im selben Studio. Der Unterschied liegt in der Musik und im Gefühl.',
      primary: { label: 'Vergleich ansehen', href: '#vergleich' },
      secondary: { label: 'Kursplan öffnen', href: '/kursplan' },
      microcopy: 'Du musst dich nicht für immer entscheiden.',
    },
    table: {
      eyebrow: 'Direkter Vergleich',
      title: 'Sechs Kriterien,',
      titleAccent: 'nebeneinander.',
      lead: 'Die Tabelle beschreibt Eigenschaften, keine Rangfolge. Was für dich leichter ist, hängt davon ab, was dir die Musik sagt.',
      caption: 'Vergleich von Salsa und Bachata nach Musik, Tempo, Grundschritt, Körperkontakt, Einstiegshürde und typischem Abend.',
      headCriterion: 'Kriterium',
      headSalsa: 'Salsa',
      headBachata: 'Bachata',
      rows: [
        {
          criterion: 'Musik',
          salsa: 'Bläser, Percussion, viele Instrumente gleichzeitig. Der Rhythmus schiebt nach vorn.',
          bachata: 'Gitarre und Bongo, oft eine gesungene Geschichte. Der Rhythmus trägt statt zu treiben.',
        },
        {
          criterion: 'Tempo',
          salsa: 'Schnell, meist 160 bis 200 Schläge pro Minute.',
          bachata: 'Ruhiger, meist 110 bis 140 Schläge pro Minute.',
        },
        {
          criterion: 'Grundschritt',
          salsa: 'Acht Zählzeiten, sechs Schritte, zwei Pausen. Bewegung vor und zurück.',
          bachata: 'Vier Zählzeiten, drei Schritte und ein Tap zur Seite. Bewegung seitwärts.',
        },
        {
          criterion: 'Körperkontakt',
          salsa: 'Offene Haltung mit viel Raum für Drehungen. Die Verbindung läuft über die Hände.',
          bachata: 'Näher, oft geschlossen. Die Verbindung läuft über Oberkörper und Gewicht.',
        },
        {
          criterion: 'Einstiegshürde',
          salsa: 'Der Grundschritt sitzt schnell, das Tempo braucht ein paar Wochen.',
          bachata: 'Der Grundschritt sitzt sehr schnell, die Nähe ist für manche zuerst ungewohnt.',
        },
        {
          criterion: 'Typischer Abend',
          salsa: 'Viele Partnerwechsel, viel Drehung, hohes Tempo über den ganzen Abend.',
          bachata: 'Ruhigere Blöcke zwischen den Salsa-Sets, mehr Fokus auf Musikalität.',
        },
      ],
    },
    styles: {
      eyebrow: 'Die beiden Stile',
      title: 'Was dich im Kurs',
      titleAccent: 'erwartet.',
      items: [
        {
          name: 'Salsa',
          claim: 'Tempo, Drehungen, viele Wechsel.',
          body: 'Salsa gibt dir früh das Gefühl, etwas zu können, weil der Grundschritt schnell sitzt. Danach kommt die eigentliche Arbeit: das Tempo halten und trotzdem locker bleiben. Wer gern viel Bewegung hat und sich an einem vollen Klangbild nicht stört, fühlt sich hier zuhause.',
          fits: [
            'Du magst schnelle Musik mit Bläsern und Percussion',
            'Du willst viele Drehungen lernen',
            'Dir gefällt der Gedanke, an einem Abend mit vielen Leuten zu tanzen',
          ],
          href: '/tanzkurse/salsa',
          linkLabel: 'Salsa-Kurse ansehen',
        },
        {
          name: 'Bachata',
          claim: 'Ruhe, Verbindung, Musikalität.',
          body: 'Bachata ist im Grundschritt schneller gelernt als Salsa, verlangt dafür früher eine saubere Verbindung zum Partner. Die Musik gibt dir Zeit, auf das zu hören, was gerade passiert. Wer Wert auf Gefühl im Tanz legt und nicht in erster Linie Tempo sucht, startet hier gut.',
          fits: [
            'Du magst ruhigere Musik mit Gitarre und Gesang',
            'Dir ist die Verbindung zum Partner wichtiger als die Anzahl Figuren',
            'Du willst früh musikalisch tanzen statt viele Schritte zu zählen',
          ],
          href: '/tanzkurse/bachata',
          linkLabel: 'Bachata-Kurse ansehen',
        },
      ],
    },
    verdict: {
      eyebrow: 'Fazit',
      title: 'Am Ende entscheidet der Abend im',
      titleAccent: 'Studio.',
      body: 'Die ehrlichste Antwort auf diese Frage steht in keiner Tabelle. Menschen, die sich für Salsa entschieden haben, weil das Video schöner aussah, stehen nach zwei Wochen im Bachata-Kurs und umgekehrt. Der Körper entscheidet schneller als der Kopf.',
      body2: 'Deshalb ist die Gratis Schnupperstunde der kürzeste Weg. Du tanzt eine Lektion mit, hörst die Musik im Raum statt im Kopfhörer und merkst innerhalb weniger Minuten, welcher Rhythmus dich mitnimmt. Viele bleiben später ohnehin bei beidem, weil an derselben Danceflow Night beides läuft.',
      cta: { label: 'Gratis Schnupperstunde', href: SCHNUPPER_HREF },
    },
    closing: {
      eyebrow: 'Nächster Schritt',
      title: 'Beide Türen stehen',
      titleAccent: 'offen.',
      body: 'Such dir im Kursplan die Uhrzeit, die dir passt, und schau dir den Rest im Studio an. Wenn du unsicher bist, sag uns das kurz und wir empfehlen dir einen Kurs.',
      primary: { label: 'Kursplan öffnen', href: '/kursplan' },
      secondary: { label: 'Frag uns direkt', href: '/kontakt' },
    },
  },
  en: {
    crumbs: [{ label: 'Salsa or Bachata', href: '/mehr/salsa-oder-bachata' }],
    hero: {
      title: 'Salsa or Bachata: which one suits',
      titleAccent: 'you?',
      lead: 'Both styles can be learned without experience, and both run on the same evening in the same studio. The difference lies in the music and in the feeling.',
      primary: { label: 'See the comparison', href: '#vergleich' },
      secondary: { label: 'Open the schedule', href: '/kursplan' },
      microcopy: 'You do not have to decide forever.',
    },
    table: {
      eyebrow: 'Side by side',
      title: 'Six criteria,',
      titleAccent: 'compared.',
      lead: 'The table describes properties, not a ranking. Which one feels easier depends on what the music tells you.',
      caption: 'Comparison of Salsa and Bachata by music, tempo, basic step, body contact, entry barrier and typical evening.',
      headCriterion: 'Criterion',
      headSalsa: 'Salsa',
      headBachata: 'Bachata',
      rows: [
        {
          criterion: 'Music',
          salsa: 'Brass, percussion, many instruments at once. The rhythm pushes forward.',
          bachata: 'Guitar and bongo, often a sung story. The rhythm carries instead of driving.',
        },
        {
          criterion: 'Tempo',
          salsa: 'Fast, usually 160 to 200 beats per minute.',
          bachata: 'Calmer, usually 110 to 140 beats per minute.',
        },
        {
          criterion: 'Basic step',
          salsa: 'Eight counts, six steps, two pauses. Movement forward and back.',
          bachata: 'Four counts, three steps and a tap to the side. Movement sideways.',
        },
        {
          criterion: 'Body contact',
          salsa: 'Open hold with room for turns. The connection runs through the hands.',
          bachata: 'Closer, often closed. The connection runs through the upper body and weight.',
        },
        {
          criterion: 'Entry barrier',
          salsa: 'The basic step sits quickly, the tempo takes a few weeks.',
          bachata: 'The basic step sits very quickly, the closeness feels unfamiliar to some at first.',
        },
        {
          criterion: 'Typical evening',
          salsa: 'Many partner changes, lots of turning, high tempo all evening.',
          bachata: 'Calmer blocks between the Salsa sets, more focus on musicality.',
        },
      ],
    },
    styles: {
      eyebrow: 'The two styles',
      title: 'What class looks',
      titleAccent: 'like.',
      items: [
        {
          name: 'Salsa',
          claim: 'Tempo, turns, many changes.',
          body: 'Salsa gives you the feeling of getting somewhere early, because the basic step sits quickly. Then the real work starts: holding the tempo and staying relaxed anyway. If you like plenty of movement and a full sound, this is home.',
          fits: [
            'You like fast music with brass and percussion',
            'You want to learn many turns',
            'You like the idea of dancing with many people in one evening',
          ],
          href: '/tanzkurse/salsa',
          linkLabel: 'See Salsa classes',
        },
        {
          name: 'Bachata',
          claim: 'Calm, connection, musicality.',
          body: 'The Bachata basic step is learned faster than the Salsa one, but it asks for a clean connection to your partner earlier. The music gives you time to listen to what is happening. If you care about feeling in the dance rather than tempo, this is a good start.',
          fits: [
            'You like calmer music with guitar and vocals',
            'The connection matters more to you than the number of figures',
            'You want to dance musically early instead of counting steps',
          ],
          href: '/tanzkurse/bachata',
          linkLabel: 'See Bachata classes',
        },
      ],
    },
    verdict: {
      eyebrow: 'Verdict',
      title: 'In the end the studio evening',
      titleAccent: 'decides.',
      body: 'The most honest answer to this question is in no table. People who chose Salsa because the video looked better end up in the Bachata course two weeks later, and the other way round. The body decides faster than the head.',
      body2: 'That is why the free trial class is the shortest route. You dance one lesson, hear the music in the room instead of in headphones and notice within minutes which rhythm carries you. Many people end up doing both anyway, because the same Danceflow Night plays both.',
      cta: { label: 'Free trial class', href: SCHNUPPER_HREF },
    },
    closing: {
      eyebrow: 'Next step',
      title: 'Both doors are',
      titleAccent: 'open.',
      body: 'Pick the time that suits you in the schedule and see the rest in the studio. If you are unsure, tell us briefly and we recommend a course.',
      primary: { label: 'Open the schedule', href: '/kursplan' },
      secondary: { label: 'Ask us directly', href: '/kontakt' },
    },
  },
} satisfies Record<Lang, SalsaOderBachataContent>;
