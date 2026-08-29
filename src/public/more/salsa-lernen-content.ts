// Inhalt der Ratgeberseite /mehr/salsa-lernen (SEO-Research 29.08.2026: "salsa lernen" 30/Mt CH,
// dazu "anfänger tanzkurs", "tanzkurs für singles/paare"). Struktur bewusst extrahierbar:
// Definitionsblock mit 40-60-Wort-Kernsatz zuerst, danach nummerierte Schritte, dann FAQ.
//
// Alle Fakten stammen aus bestehender, belegter Copy: 8 Wochen / 60 Minuten aus
// preise/content.ts:225, Partnerwechsel aus home/content-v3.ts:218, Danceflow Night aus
// events-workshops/danceflow-night. Die FAQ-Antworten sind aus faq/content.ts uebernommen
// (gleiche Fragen, gleicher Wortlaut) statt neu erfunden — ein zweiter Wortlaut fuer dieselbe
// Frage waere ein Widerspruch, den niemand pflegt. CH-ss, echte Umlaute, keine Em-Dashes.

import type { Lang } from '@/lib/i18n';
import type { Faq, Crumb } from '@/public/subpage/kit';
import { SCHNUPPER_HREF } from '@/public/subpage/kit';

type Cta = { label: string; href: string };
type Step = { title: string; text: string; href: string; linkLabel: string };

export type SalsaLernenContent = {
  crumbs: Crumb[];
  hero: {
    title: string;
    titleAccent: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    microcopy: string;
  };
  definition: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    /** Der 40-60-Wort-Kernsatz. Steht als erster Absatz der Seite unter dem Fold. */
    core: string;
    body: string;
    facts: { label: string; value: string }[];
  };
  steps: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    items: Step[];
  };
  solo: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    items: string[];
    cta: Cta;
  };
  duration: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    body2: string;
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

export const SALSA_LERNEN = {
  de: {
    crumbs: [{ label: 'Salsa lernen', href: '/mehr/salsa-lernen' }],
    hero: {
      title: 'Salsa lernen: So startest du in',
      titleAccent: 'Basel.',
      lead: 'Der Einstieg ist kleiner, als er von aussen aussieht. Eine Stunde mittanzen, dann weisst du, ob es passt.',
      primary: { label: 'Gratis Schnupperstunde', href: SCHNUPPER_HREF },
      secondary: { label: 'Kursplan ansehen', href: '/kursplan' },
      microcopy: 'Ohne Vorkenntnisse, ohne Tanzpartner.',
    },
    definition: {
      eyebrow: 'Kurz erklärt',
      title: 'Was Salsa eigentlich',
      titleAccent: 'ist.',
      core: 'Salsa ist ein Paartanz aus der Karibik, getanzt auf acht Zählzeiten mit sechs Schritten und zwei Pausen. Eine Person führt, die andere folgt, beide wechseln sich in Drehungen und Figuren ab. Gelernt wird im Kurs zuerst der Grundschritt, danach Führen und Folgen, erst zuletzt die Figuren.',
      body: 'Die Musik läuft meist zwischen 160 und 200 Schlägen pro Minute, was zu Beginn schneller klingt, als es sich später anfühlt. Wer die Zählweise einmal im Körper hat, hört sie in fast jedem Salsa-Stück wieder. In Basel tanzen wir Salsa Cubana und Salsa on 1, beides Varianten derselben Grundlage.',
      facts: [
        { label: 'Zählzeiten', value: '8 Counts, 6 Schritte' },
        { label: 'Kursstaffel', value: '8 Wochen, je 60 Minuten' },
        { label: 'Vorkenntnisse', value: 'keine nötig' },
      ],
    },
    steps: {
      eyebrow: 'Schritt für Schritt',
      title: 'Vom ersten Abend bis zur',
      titleAccent: 'Tanzfläche.',
      lead: 'Vier Stationen, in dieser Reihenfolge. Keine davon setzt voraus, dass du vorher schon getanzt hast.',
      items: [
        {
          title: 'Schnupperstunde',
          text: 'Du tanzt eine ganze Lektion in einem laufenden Kurs mit. Sie kostet nichts, verpflichtet zu nichts, und danach weisst du mehr über das Level und die Leute als aus jedem Text.',
          href: SCHNUPPER_HREF,
          linkLabel: 'Schnupperstunde buchen',
        },
        {
          title: 'Beginner 1',
          text: 'Hier fängt alles bei null an: Grundschritt, Gewichtswechsel, die erste Drehung. Wir wechseln im Kurs regelmässig die Partner durch, damit du dich nicht an eine einzige Person gewöhnst.',
          href: '/tanzkurse/salsa',
          linkLabel: 'Salsa-Kurse ansehen',
        },
        {
          title: 'Acht-Wochen-Staffeln',
          text: 'Eine Staffel dauert 8 Wochen mit einer Lektion à 60 Minuten pro Woche. Danach entscheidest du neu, ob du im selben Level bleibst oder eine Stufe weitergehst.',
          href: '/kursaufbau',
          linkLabel: 'Kursaufbau ansehen',
        },
        {
          title: 'Danceflow Night',
          text: 'Am 1., 3. und 5. Freitag im Monat wird getanzt statt geübt. Genau dort setzt sich fest, was im Kurs noch wackelt, weil du mit Leuten tanzt, die dieselbe Figur anders führen als deine Kursleitung.',
          href: '/events-workshops/danceflow-night',
          linkLabel: 'Danceflow Night ansehen',
        },
      ],
    },
    solo: {
      eyebrow: 'Ohne Partner',
      title: 'Du kannst alleine',
      titleAccent: 'kommen.',
      body: 'Viele melden sich ohne Tanzpartner an, und im Kurs merkt man es niemandem an. Wir achten auf die Balance zwischen Leadern und Followern und wechseln die Paare regelmässig durch. Im Lauf eines Abends tanzt du mit vielen verschiedenen Menschen.',
      items: [
        'Die meisten melden sich alleine an',
        'Rollenwechsel im Kurs: du gewöhnst dich an unterschiedliche Führung',
        'Wer als Paar kommt, tanzt trotzdem auch mit anderen',
        'Führen und Folgen sind lernbar, unabhängig davon, wer du bist',
      ],
      cta: { label: 'Gratis Schnupperstunde', href: SCHNUPPER_HREF },
    },
    duration: {
      eyebrow: 'Ehrlich eingeordnet',
      title: 'Wie lange dauert',
      titleAccent: 'das?',
      body: 'Eine belastbare Zahl gibt es nicht, und wer dir eine nennt, hat sie erfunden. Nach der ersten Staffel kommst du durch einen einfachen Song, ohne mitzuzählen. Bis sich das Tanzen locker anfühlt, dauert es länger, und das hängt vor allem daran, wie oft du zwischen den Lektionen tanzt.',
      body2: 'Den grössten Unterschied machen die Abende ausserhalb des Kurses. Wer regelmässig an eine Danceflow Night geht, kommt spürbar schneller voran als jemand, der nur die Lektion besucht. Das ist die einzige Abkürzung, die wir kennen.',
    },
    faqEyebrow: 'Salsa lernen FAQ',
    faqTitle: 'Häufige Fragen zum Einstieg',
    faq: [
      {
        q: 'Muss ich schon tanzen können?',
        a: 'Nein, und die meisten können es am ersten Abend nicht. Beginner-Kurse starten bei null: zuerst der Grundschritt, dann Führen und Folgen, dann die ersten Figuren. Wir wechseln im Kurs regelmässig die Partner durch, dadurch gewöhnst du dich schnell an verschiedene Tanzpartner statt nur an einen.',
      },
      {
        q: 'Kann ich ohne Tanzpartner kommen?',
        a: 'Ja, viele kommen ohne. Du meldest dich allein an, im Kurs wird auf eine gute Balance zwischen Leadern und Followern geachtet und die Partner wechseln regelmässig durch. So tanzt du im Lauf eines Abends mit vielen verschiedenen Menschen.',
      },
      {
        q: 'Wie viele Figuren lerne ich am Anfang?',
        a: 'Weniger, als du denkst. Und das ist gut so. Am Anfang geht es um Führen und Folgen. Wer das kann, tanzt mit jeder Person, auch ohne eine einzige Figur. Die Figuren kommen dann von selbst.',
      },
      {
        q: 'Wie lange dauert ein Kurs?',
        a: 'Eine Kursstaffel dauert 8 Wochen mit einer Lektion à 60 Minuten pro Woche, also 8 Lektionen. Danach entscheidest du neu, ob du im selben Level bleibst oder eine Stufe weitergehst. Welche Staffeln gerade starten, steht im Kursplan.',
      },
      {
        q: 'Was ist, wenn ich mein Level nicht kenne?',
        a: 'Dann starte mit einer Schnupperstunde. Du tanzt eine Lektion mit und danach wissen wir beide, ob das Level passt. Das ist ehrlicher als jede Selbsteinschätzung. Wer schon getanzt hat und unsicher ist, schreibt uns kurz, was und wie lange, dann ordnen wir das ein.',
      },
      {
        q: 'Brauche ich Tanzschuhe für den Start?',
        a: 'Nicht zwingend. Für die erste Stunde reichen oft saubere, bequeme Schuhe. Später können Tanzschuhe helfen, besonders bei Drehungen und Heels.',
      },
    ],
    closing: {
      eyebrow: 'Nächster Schritt',
      title: 'Gelesen ist nicht',
      titleAccent: 'getanzt.',
      body: 'Die Schnupperstunde beantwortet in 60 Minuten mehr Fragen als diese Seite. Du kommst allein oder zu zweit, wir holen dich in der Stunde ab.',
      primary: { label: 'Gratis Schnupperstunde', href: SCHNUPPER_HREF },
      secondary: { label: 'Kursplan öffnen', href: '/kursplan' },
    },
  },
  en: {
    crumbs: [{ label: 'Learning Salsa', href: '/mehr/salsa-lernen' }],
    hero: {
      title: 'Learning Salsa: how to start in',
      titleAccent: 'Basel.',
      lead: 'The first step is smaller than it looks from outside. Dance one lesson, then you know whether it fits.',
      primary: { label: 'Free trial class', href: SCHNUPPER_HREF },
      secondary: { label: 'See the schedule', href: '/kursplan' },
      microcopy: 'No experience needed, no dance partner needed.',
    },
    definition: {
      eyebrow: 'In short',
      title: 'What Salsa actually',
      titleAccent: 'is.',
      core: 'Salsa is a partner dance from the Caribbean, danced over eight counts with six steps and two pauses. One person leads, the other follows, and both take turns in the turns and figures. In class you learn the basic step first, then leading and following, and the figures come last.',
      body: 'The music usually runs between 160 and 200 beats per minute, which sounds faster at the start than it feels later. Once the count sits in your body, you hear it again in almost every Salsa track. In Basel we dance Salsa Cubana and Salsa on 1, two variants of the same foundation.',
      facts: [
        { label: 'Counts', value: '8 counts, 6 steps' },
        { label: 'Course block', value: '8 weeks, 60 minutes each' },
        { label: 'Experience', value: 'none required' },
      ],
    },
    steps: {
      eyebrow: 'Step by step',
      title: 'From the first evening to the',
      titleAccent: 'dance floor.',
      lead: 'Four stations, in this order. None of them assumes that you have danced before.',
      items: [
        {
          title: 'Trial class',
          text: 'You dance a full lesson inside a running course. It costs nothing, commits you to nothing, and afterwards you know more about the level and the people than any text can tell you.',
          href: SCHNUPPER_HREF,
          linkLabel: 'Book a trial class',
        },
        {
          title: 'Beginner 1',
          text: 'Everything starts at zero here: basic step, weight changes, the first turn. We rotate partners regularly in class so you do not get used to one single person.',
          href: '/tanzkurse/salsa',
          linkLabel: 'See Salsa classes',
        },
        {
          title: 'Eight-week blocks',
          text: 'A course block runs 8 weeks with one 60 minute lesson per week. Afterwards you decide again whether to stay at the same level or move up a step.',
          href: '/kursaufbau',
          linkLabel: 'See course levels',
        },
        {
          title: 'Danceflow Night',
          text: 'On the first, third and fifth Friday of the month people dance instead of practising. That is where the shaky parts settle, because you dance with people who lead a figure differently than your instructor does.',
          href: '/events-workshops/danceflow-night',
          linkLabel: 'See Danceflow Night',
        },
      ],
    },
    solo: {
      eyebrow: 'Without a partner',
      title: 'You can come on your',
      titleAccent: 'own.',
      body: 'Many people sign up without a dance partner, and nobody notices in class. We watch the balance between leaders and followers and rotate the pairs regularly. Over the course of an evening you dance with many different people.',
      items: [
        'Signing up alone is the normal case, not the exception',
        'Partner rotation in class: you get used to different leading',
        'Couples who come together still dance with others',
        'Leading and following are both learnable, whoever you are',
      ],
      cta: { label: 'Free trial class', href: SCHNUPPER_HREF },
    },
    duration: {
      eyebrow: 'An honest answer',
      title: 'How long does it',
      titleAccent: 'take?',
      body: 'There is no reliable number, and anyone who gives you one made it up. After the first block you get through a simple song without counting along. Feeling relaxed on the floor takes longer, and that depends mostly on how often you dance between lessons.',
      body2: 'The biggest difference is not talent but the evenings outside class. People who go to a Danceflow Night regularly progress noticeably faster than people who only attend the lesson. That is the only shortcut we know.',
    },
    faqEyebrow: 'Learning Salsa FAQ',
    faqTitle: 'Common questions about starting',
    faq: [
      {
        q: 'Do I already need to know how to dance?',
        a: 'No, and most people cannot on their first evening. Beginner courses start from zero: the basic step first, then leading and following, then the first figures. We rotate partners regularly in class, so you quickly get used to different dance partners instead of just one.',
      },
      {
        q: 'Can I come without a dance partner?',
        a: 'Yes, many people come without one. You sign up alone, the class keeps a good balance between leaders and followers, and partners rotate regularly. Over the course of an evening you dance with many different people.',
      },
      {
        q: 'How many figures do I learn at the start?',
        a: 'Fewer than you think. And that is a good thing. At the start it is about leading and following. Whoever can do that dances with anyone, even without a single figure. The figures come by themselves.',
      },
      {
        q: 'How long does a course last?',
        a: 'A course block runs 8 weeks with one 60 minute lesson per week, so 8 lessons. Afterwards you decide again whether to stay at the same level or move up a step. The schedule shows which blocks are starting.',
      },
      {
        q: 'What if I do not know my level?',
        a: 'Then start with a trial class. You dance one lesson and afterwards we both know whether the level fits. That is more honest than any self assessment.',
      },
      {
        q: 'Do I need dance shoes to start?',
        a: 'Not necessarily. Clean, comfortable shoes are often enough for the first class. Dance shoes can help later, especially for turns and heels.',
      },
    ],
    closing: {
      eyebrow: 'Next step',
      title: 'Reading is not',
      titleAccent: 'dancing.',
      body: 'A trial class answers more questions in 60 minutes than this page can. Come alone or as a pair, we meet you in the lesson.',
      primary: { label: 'Free trial class', href: SCHNUPPER_HREF },
      secondary: { label: 'Open the schedule', href: '/kursplan' },
    },
  },
} satisfies Record<Lang, SalsaLernenContent>;
