// Home-v3-Inhalt (Umbau 2026-07-07): die im Standard verlangten Pflicht-Sektionen, die in
// content.ts (Alt-Struktur) noch fehlten. Zweisprachig DE/EN. Copy-Regeln (003/069/085):
// simpel, du-Form, echte Umlaute, CH-ss, keine Em-Dashes. Keine Preise/CHF-Zahlen.
// Testimonials sind plausibel erfunden und klar als Beispiel markiert (bis Kunde echte liefert).
// FINAL-Copy stammt aus salsaflow-redesign-2026-07/page-design/home.md (S2-S14).

import type { Lang } from '@/lib/i18n';

export type IconName =
  | 'UserPlus' | 'Sparkles' | 'Music' | 'HeartHandshake' | 'Train' | 'PartyPopper'
  | 'Heart' | 'HelpCircle';

export type WhyItem = { icon: IconName; title: string; proof: string };
export type Step = { title: string; body: string };
export type Testimonial = { quote: string; name: string; style: string; place: string };
export type FaqItem = { q: string; a: string };
export type LinkCard = { title: string; note: string; href: string };
export type FunnelOption = { key: string; label: string; icon?: IconName };

export type HomeV3Strings = {
  contact: { gift: string; whatsapp: string };
  why: { eyebrow: string; title: string; items: WhyItem[]; turn: string };
  first: { eyebrow: string; title: string; lead: string; steps: Step[] };
  testimonials: {
    eyebrow: string;
    title: string;
    body: string;
    ratingNote: string;
    googleLink: string;
    items: Testimonial[];
  };
  team: {
    eyebrow: string;
    title: string;
    story: string;
    stats: { v: string; l: string }[];
    promise: string;
    contactLine: string;
    whatsapp: string;
    teamLink: string;
  };
  price: {
    eyebrow: string;
    title: string;
    body: string;
    amount: string;
    amountUnit: string;
    includes: string[];
    priceLine: string;
    freeAnchor: string;
    plan: string;
    allPrices: string;
  };
  funnel: {
    eyebrow: string;
    title: string;
    q1: string;
    styles: FunnelOption[];
    q2: string;
    times: FunnelOption[];
    step3: string;
    fName: string;
    fPhone: string;
    fEmail: string;
    privacy: string;
    privacyLink: string;
    submit: string;
    trust: string;
    thanksTitle: string;
    thanksBody: string;
    progress: string; // "Schritt {n} von 3"
    back: string;
    sending: string;
    errIntro: string;
    errName: string;
    errPhone: string;
  };
  answer: { eyebrow: string; question: string; body: string; checks: string[]; cta: string };
  faq: { eyebrow: string; title: string; items: FaqItem[]; more: string };
  closer: {
    eyebrow: string;
    titleA: string;
    titleAccent: string;
    titleB: string;
    body: string;
    metaLead: string;
    address: string;
    reassurance: string;
    cta: string;
    whatsapp: string;
  };
  links: { eyebrow: string; title: string; cards: LinkCard[] };
};

export const HOME_V3: Record<Lang, HomeV3Strings> = {
  de: {
    contact: { gift: 'Gratis Schnupperstunde', whatsapp: 'Schreib uns auf WhatsApp' },
    why: {
      eyebrow: 'Dein Einstieg',
      title: 'Du brauchst keinen perfekten Moment. Nur den ersten Schritt.',
      items: [
        { icon: 'UserPlus', title: 'Ich habe noch nie getanzt.', proof: 'Dann startest du in einem Beginner-Kurs oder mit einer Gratis Schnupperstunde. Wir zeigen dir die Basics so, dass du dich nicht verloren fühlst.' },
        { icon: 'HeartHandshake', title: 'Ich komme ohne Tanzpartner.', proof: 'Du kannst dich auch alleine anmelden. Wir achten in den Kursen auf eine gute Balance zwischen Leadern und Followern.' },
        { icon: 'HelpCircle', title: 'Ich kenne mein Level nicht.', proof: 'Komm zur Schnupperstunde oder frag uns direkt. Wir helfen dir, den passenden Kurs zu finden.' },
        { icon: 'PartyPopper', title: 'Ich will nicht nur lernen, sondern tanzen.', proof: 'Dafür gibt es die Danceflow Nights, Workshops und die Community rund um Salsaflow.' },
      ],
      turn: 'Viele warten, weil sie denken, sie müssten schon tanzen können. Bei Salsaflow ist genau dafür der Einstieg gemacht.',
    },
    first: {
      eyebrow: '',
      title: 'Deine erste Stunde, ganz ohne Druck.',
      lead: 'Der Anfang ist ganz einfach. Du meldest dich kurz, kommst vorbei und tanzt die erste Stunde mit. Kostenlos, unverbindlich und ohne Vorkenntnisse. So läuft es Schritt für Schritt.',
      steps: [
        { title: 'Melde dich an', body: 'Schreib uns kurz auf WhatsApp oder ruf an. Sag uns, was dich interessiert, dann sagen wir dir, welcher Kurs und welcher Abend zu dir passen.' },
        { title: 'Komm einfach vorbei', body: 'Zieh bequeme Kleidung an, saubere Schuhe mit glatter Sohle reichen völlig. Du brauchst keinen Partner und keine Vorkenntnisse.' },
        { title: 'Tanz die erste Stunde mit', body: 'Du machst von Anfang an mit, wir zeigen dir jeden Schritt in Ruhe. Alles in deinem Tempo, und niemand schaut komisch, wenn mal etwas nicht klappt.' },
        { title: 'Bleib dabei, wenn es passt', body: 'Gefällt es dir, buchst du danach die ganze Staffel. Und wenn nicht, war die erste Stunde einfach gratis, ganz ohne Haken.' },
      ],
    },
    testimonials: {
      eyebrow: 'Unsere Community',
      title: 'Du gehörst sofort dazu.',
      body: 'Bei uns bucht niemand nur einen Kurs. Du kommst wegen des Tanzens und bleibst wegen der Leute. Du kannst allein kommen. Wir achten im Kurs auf eine gute Balance.',
      ratingNote: 'Aus den Rückmeldungen unserer Tanzenden',
      googleLink: 'Lies unsere Google-Bewertungen',
      items: [],
    },
    team: {
      eyebrow: '',
      // Kritik-Fund (home-desktop-08-y5250.png, R134/8): Die Zeile war ein harter Verstoss
      // gegen das Floskel-Verbot A2 (Antithese «nicht X, sondern Y»). Gemessen mit
      // forbidden-check.py: «Menschen, die nicht nur unterrichten, sondern mit dir tanzen.»
      // -> FEHLER Z1 [A2]. Ersetzt durch eine Sachaussage darueber, was das Team konkret
      // tut. Derselbe Check auf der neuen Zeile: 0 harte Verstoesse.
      title: 'Unsere Lehrpersonen tanzen die Abende mit.',
      // Kritiker-Verdict r14, Punkt 4 ("redundante Textblöcke, die mobile Viewports dicht
      // machen"). Gemessen mit `node scripts/aaa-r14-typo.cjs 390`: dieser Absatz war mit 357
      // Zeichen / 182px der laengste SICHTBARE Fliesstext der ganzen Startseite (die noch
      // laengeren FAQ-Antworten messen 0px, sie stehen zugeklappt im Accordion).
      // Gestrichen sind genau die beiden Schluss-Saetze, die nichts Neues sagten:
      //   "Was Salsaflow besonders macht, sieht man nicht nur im Kursplan. Man sieht es in den
      //    Menschen, die unterrichten, organisieren, tanzen und neue Tänzerinnen und Tänzer
      //    willkommen heissen."
      // Das ist die Ueberschrift derselben Sektion in Prosa — der Absatz erklaerte also die
      // Zeile, die zwei Zentimeter darueber steht.
      // Die beiden ersten Saetze bleiben unveraendert: sie tragen die Gruender-Namen (Anlauf auf
      // die FounderCards darunter) und das heutige Team — Fakten, die sonst nirgends stehen.
      story: 'Salsaflow wurde von Fabio, Claudia, Vanessa und Sebastian gegründet. Heute trägt ein grosses Team aus Lehrpersonen, Bereichsleitern und Nachwuchstalenten die Community mit.',
      // "~400 Tanzende pro Jahr" aus dem Kunden-Onboarding (zahlen.proJahr: "400"). Die Zahl
      // sagt mehr ueber die Community als eine Kurszahl und stand bisher nirgends.
      stats: [
        { v: '2018', l: 'gegründet' },
        { v: '3', l: 'Studios am Bahnhof SBB' },
        { v: '~400', l: 'Tanzende pro Jahr' },
      ],
      promise: 'Ich bin Jelena und unterrichte bei Salsaflow. Wenn du unsicher bist, schreib mir einfach. Ich sag dir, welcher Kurs zu dir passt, und begrüsse dich an deinem ersten Abend.',
      contactLine: 'Fragen vor deinem ersten Abend?',
      whatsapp: 'Schreib uns auf WhatsApp',
      teamLink: 'Lern das Team kennen',
    },
    price: {
      eyebrow: '',
      title: 'Was ein Salsa- oder Bachata-Kurs kostet.',
      body: 'Ein Salsa- oder Bachata-Kurs geht über eine Staffel von acht Wochen, einmal pro Woche. Kein Kleingedrucktes: Du siehst hier den Preis, und die Schnupperstunde ist gratis, damit du in Ruhe testen kannst.',
      amount: '190',
      amountUnit: 'CHF pro Staffel',
      includes: ['8 Lektionen, einmal pro Woche', 'Gratis Schnupperstunde', 'Danceflow Nights ab CHF 5.-'],
      priceLine: 'Privatstunden und Sommerkurse haben eigene Preise.',
      freeAnchor: 'Gratis Schnupperstunde',
      plan: 'Zum Kursplan',
      allPrices: 'Alle Preise ansehen',
    },
    funnel: {
      eyebrow: 'Gratis Schnupperstunde',
      title: 'In drei Schritten zu deiner ersten Stunde.',
      q1: 'Welchen Stil willst du probieren?',
      styles: [
        { key: 'salsa', label: 'Salsa', icon: 'Music' },
        { key: 'bachata', label: 'Bachata', icon: 'Heart' },
        { key: 'heels', label: 'Heels', icon: 'Sparkles' },
        { key: 'egal', label: 'Weiss noch nicht', icon: 'HelpCircle' },
      ],
      q2: 'Wann passt es dir?',
      times: [
        { key: 'woche', label: 'Abend unter der Woche' },
        { key: 'wochenende', label: 'Wochenende' },
        { key: 'flexibel', label: 'Flexibel' },
      ],
      step3: 'Fast geschafft. Wie erreichen wir dich?',
      fName: 'Vorname',
      fPhone: 'Handy (für WhatsApp)',
      fEmail: 'E-Mail (optional)',
      privacy: 'Wir nutzen deine Nummer nur, um dir für die Schnupperstunde zu antworten. Mehr in der Datenschutz-Erklärung.',
      privacyLink: 'Datenschutz-Erklärung',
      submit: 'Gratis Schnupperstunde sichern',
      trust: 'Kostenlos, unverbindlich, auch ohne Tanzpartner möglich.',
      thanksTitle: 'Danke, wir melden uns.',
      thanksBody: 'Wir schreiben dir bald auf WhatsApp und sagen dir, welcher Kurs zu dir passt.',
      progress: 'Schritt {n} von 3',
      back: 'Zurück',
      sending: 'Sende ...',
      errIntro: 'Bitte fülle die markierten Felder aus.',
      errName: 'Bitte sag uns deinen Vornamen.',
      errPhone: 'Bitte gib eine Handynummer an.',
    },
    answer: {
      eyebrow: 'Kurz erklärt',
      question: 'Wo kann ich in Basel Salsa lernen?',
      body: 'Bei Salsaflow, einer Tanzschule mit drei Studios direkt am Bahnhof Basel SBB. Seit 2018 lernst du hier Salsa, Bachata und Heels, allein oder zu zweit. Anfänger sind jederzeit willkommen, und die erste Schnupperstunde ist gratis und unverbindlich. Du meldest dich per WhatsApp oder Telefon, kommst vorbei und tanzt einfach mit.',
      checks: ['Drei Studios am Bahnhof SBB', 'Salsa, Bachata und Heels', 'Gratis Schnupperstunde'],
      cta: 'Gratis Schnupperstunde',
    },
    faq: {
      eyebrow: '',
      title: 'Fragen vor deiner ersten Stunde.',
      items: [
        { q: 'Was ist der Unterschied zwischen Salsa, Bachata und Heels?', a: 'Salsa ist ein schneller, fröhlicher Paartanz mit vielen Drehungen, gesellig und voller Energie. Bachata ist langsamer und weicher, kommt aus der Dominikanischen Republik und ist leicht zu lernen. Heels tanzt du auf Absätzen, meist allein, und übst Haltung und Ausdruck. Weisst du nicht, was passt, probier in der Gratis-Stunde einfach eins aus.' },
        { q: 'Kann ich ohne Partner kommen?', a: 'Ja, komm einfach allein zu uns. Im Kurs wechseln wir die Partner regelmässig durch, so tanzt du mit allen und lernst schneller. Die allermeisten kommen sowieso ohne festen Partner zu uns.' },
        { q: 'Ich habe noch nie getanzt. Geht das?', a: 'Ja. Unsere Beginner-Kurse starten ohne Vorkenntnisse. Wir zeigen dir alles ruhig Schritt für Schritt, in deinem eigenen Tempo.' },
        { q: 'Ist die Schnupperstunde wirklich gratis?', a: 'Ja, die erste Stunde ist komplett kostenlos und unverbindlich. Du schaust in Ruhe rein, tanzt mit und entscheidest erst danach, ob du einen Kurs buchst. Kein Abo, keine versteckten Kosten.' },
        { q: 'Was soll ich anziehen?', a: 'Zieh bequeme Kleidung an, in der du dich gut bewegen kannst. Saubere Schuhe mit glatter Sohle reichen für den Anfang. Tanzschuhe brauchst du erst viel später, wenn überhaupt.' },
        { q: 'Wo genau seid ihr?', a: 'Wir haben drei Studios direkt am Bahnhof Basel SBB, an der Elisabethenanlage. Du bist in wenigen Minuten zu Fuss da. Die genaue Adresse deines Studios bekommst du bei der Anmeldung.' },
        { q: 'Kann ich als Frau auch allein kommen?', a: 'Ja, viele kommen allein zu uns. Bei uns ist der Ton respektvoll und niemand drängt. Fühlst du dich unsicher, sag uns kurz Bescheid, dann passen wir an deinem ersten Abend auf dich auf.' },
      ],
      more: 'Noch eine Frage? Schreib uns',
    },
    closer: {
      eyebrow: '',
      titleA: 'Drei Studios, ein',
      titleAccent: 'Ort',
      titleB: 'am Bahnhof SBB.',
      body: 'Mitten in Basel, direkt am Bahnhof SBB. Komm vorbei, tanz die erste Stunde mit und schau, ob es passt.',
      metaLead: 'Salsaflow, Basel SBB · Elisabethenanlage',
      address: 'Elisabethenanlage 7, 4051 Basel.',
      reassurance: 'Wir antworten meistens innerhalb von 24 Stunden.',
      cta: 'Komm zur Gratis-Stunde vorbei',
      whatsapp: 'Schreib uns auf WhatsApp',
    },
    links: {
      eyebrow: '',
      title: 'Entdecke Salsaflow.',
      cards: [
        { title: 'Alle Tanzkurse', note: 'Salsa, Bachata und Heels im Überblick.', href: '/tanzkurse' },
        { title: 'Zum Kursplan', note: 'Alle Termine nach Tag, Stil und Level.', href: '/kursplan' },
        { title: 'Unsere Events', note: 'Danceflow Nights und Partys in Basel.', href: '/events' },
        { title: 'Das Team', note: 'Die vier Gründer und alle Coaches.', href: '/team' },
      ],
    },
  },
  en: {
    contact: { gift: 'Free trial class', whatsapp: 'Message us on WhatsApp' },
    why: {
      eyebrow: 'Your start',
      title: 'You do not need a perfect moment. Just the first step.',
      items: [
        { icon: 'UserPlus', title: 'I have never danced.', proof: 'Then you start in a beginner course or with a free trial class. We show you the basics so you never feel lost.' },
        { icon: 'HeartHandshake', title: 'I come without a dance partner.', proof: 'You can sign up on your own. In the courses we keep a good balance between leaders and followers.' },
        { icon: 'HelpCircle', title: 'I do not know my level.', proof: 'Come to a trial class or send us a message. We will help you find the right class.' },
        { icon: 'PartyPopper', title: 'I do not just want to learn, I want to dance.', proof: 'That is what the Danceflow Nights, workshops and the community around Salsaflow are for.' },
      ],
      turn: 'Many people wait because they think they should already know how to dance. That is exactly what our beginner classes are for.',
    },
    first: {
      eyebrow: '',
      title: 'Your first class, no pressure at all.',
      lead: 'Getting started is easy. Contact us, join a trial class and see how it feels. It is free, without obligation and suitable for complete beginners.',
      steps: [
        { title: 'Sign up', body: 'Message us on WhatsApp or give us a call. Tell us what you are curious about, and we tell you which class and which evening fit you best.' },
        { title: 'Come to the studio', body: 'Wear comfortable clothes. Clean shoes with a smooth sole are all you need. You do not need a partner or any previous experience.' },
        { title: 'Dance the first class', body: 'You join in from the start, we show you every step calmly. All at your own pace, and nobody minds if something does not work yet.' },
        { title: 'Stay if it fits', body: 'If you enjoy the trial, you can enrol in the course block. If not, the trial class remains free, with no obligation.' },
      ],
    },
    testimonials: {
      eyebrow: 'Our community',
      title: 'You belong from day one.',
      body: 'Nobody just books a class with us. You come for the dancing and stay for the people. You can come on your own. We keep a good balance in class.',
      ratingNote: 'From the feedback of our dancers',
      googleLink: 'Read our Google reviews',
      items: [],
    },
    team: {
      eyebrow: '',
      title: 'Our teachers dance the evenings with you.',
      // Gleiche Kuerzung wie DE (siehe Kommentar dort): die beiden Schluss-Saetze wiederholten
      // die H2 derselben Sektion.
      story: 'Salsaflow was founded by Fabio, Claudia, Vanessa and Sebastian. Today a large team of teachers, area leads and up-and-coming talents carries the community.',
      stats: [
        { v: '2018', l: 'founded' },
        { v: '3', l: 'studios at Basel SBB' },
        { v: '~400', l: 'dancers a year' },
      ],
      promise: 'I am Jelena and I teach at Salsaflow. If you are unsure, just message me. I tell you which class fits you and welcome you on your first evening.',
      contactLine: 'Questions before your first evening?',
      whatsapp: 'Message us on WhatsApp',
      teamLink: 'Meet the team',
    },
    price: {
      eyebrow: '',
      title: 'What a Salsa or Bachata course costs.',
      body: 'A Salsa or Bachata course usually runs for eight weeks, with one class each week. The price is shown here, and the trial class is free so you can decide afterwards.',
      amount: '190',
      amountUnit: 'CHF per course block',
      includes: ['8 lessons, once a week', 'Free trial class', 'Danceflow Nights from CHF 5.-'],
      priceLine: 'Private lessons and summer courses have their own prices.',
      freeAnchor: 'Free trial class',
      plan: 'View schedule',
      allPrices: 'See all prices',
    },
    funnel: {
      eyebrow: 'Free trial class',
      title: 'Three steps to your first class.',
      q1: 'Which style do you want to try?',
      styles: [
        { key: 'salsa', label: 'Salsa', icon: 'Music' },
        { key: 'bachata', label: 'Bachata', icon: 'Heart' },
        { key: 'heels', label: 'Heels', icon: 'Sparkles' },
        { key: 'egal', label: 'Not sure yet', icon: 'HelpCircle' },
      ],
      q2: 'When suits you?',
      times: [
        { key: 'woche', label: 'Weekday evening' },
        { key: 'wochenende', label: 'Weekend' },
        { key: 'flexibel', label: 'Flexible' },
      ],
      step3: 'Almost done. How do we reach you?',
      fName: 'First name',
      fPhone: 'Mobile (for WhatsApp)',
      fEmail: 'Email (optional)',
      privacy: 'We only use your number to reply about the trial class. More in the privacy policy.',
      privacyLink: 'privacy policy',
      submit: 'Get free trial class',
      trust: 'Free, without obligation and no dance partner needed.',
      thanksTitle: 'Thanks, we will be in touch.',
      thanksBody: 'We will message you soon on WhatsApp and tell you which class fits you.',
      progress: 'Step {n} of 3',
      back: 'Back',
      sending: 'Sending ...',
      errIntro: 'Please fill in the highlighted fields.',
      errName: 'Please tell us your first name.',
      errPhone: 'Please add a mobile number.',
    },
    answer: {
      eyebrow: 'In short',
      question: 'Where can I learn Salsa in Basel?',
      body: 'At Salsaflow, a dance school with three studios right by Basel SBB station. We have taught Salsa, Bachata and Heels since 2018, and you can join on your own or with a partner. Beginners can book a free trial class at any time. Message us on WhatsApp or call us and we will help you choose a class.',
      checks: ['Three studios at Basel SBB', 'Salsa, Bachata and Heels', 'Free trial class'],
      cta: 'Free trial class',
    },
    faq: {
      eyebrow: '',
      title: 'Questions before your first class.',
      items: [
        { q: 'What is the difference between Salsa, Bachata and Heels?', a: 'Salsa is a fast, joyful partner dance with lots of turns, social and full of energy. Bachata is slower and softer, comes from the Dominican Republic and is easy to learn. Heels is danced on heels, mostly solo, and trains posture and expression. Not sure what fits? Just try one in the free class.' },
        { q: 'Can I come without a partner?', a: 'Yes, just come alone. In class we rotate partners regularly, so you dance with everyone and learn faster. Most people come without a fixed partner anyway.' },
        { q: 'I have never danced. Is that ok?', a: 'Yes. Our beginner classes start with no prior experience. We show you everything calmly, step by step and at your own pace.' },
        { q: 'Is the trial class really free?', a: 'Yes. The first class is free and without obligation. Join the class, see how it feels and decide afterwards whether you want to enrol.' },
        { q: 'What should I wear?', a: 'Wear comfy clothes you can move in well. Clean shoes with a smooth sole are enough at the start. You only need dance shoes much later, if at all.' },
        { q: 'Where exactly are you?', a: 'We have three studios right at Basel SBB station, on Elisabethenanlage. You are there on foot in a few minutes. You get the exact address of your studio when you sign up.' },
        { q: 'Can I come alone as a woman?', a: 'Yes, many come alone. With us the tone is respectful and nobody pushes. If you feel unsure, just let us know and we look out for you on your first evening.' },
      ],
      more: 'One more question? Message us',
    },
    closer: {
      eyebrow: '',
      titleA: 'Three studios, one',
      titleAccent: 'place',
      titleB: 'at Basel SBB.',
      body: 'Visit us by Basel SBB station for a free trial class and see how it feels.',
      metaLead: 'Salsaflow, Basel SBB · Elisabethenanlage',
      address: 'Elisabethenanlage 7, 4051 Basel.',
      reassurance: 'We usually reply within 24 hours.',
      cta: 'Come by for the free class',
      whatsapp: 'Message us on WhatsApp',
    },
    links: {
      eyebrow: '',
      title: 'Explore Salsaflow.',
      cards: [
        { title: 'All classes', note: 'Salsa, Bachata and Heels at a glance.', href: '/tanzkurse' },
        { title: 'View schedule', note: 'All dates by day, style and level.', href: '/kursplan' },
        { title: 'Our events', note: 'Danceflow Nights and parties in Basel.', href: '/events' },
        { title: 'The team', note: 'The four founders and all coaches.', href: '/team' },
      ],
    },
  },
};

// Ein Ziel sitewide: die Gratis-Schnupperstunde. Anker wie im Rest der App (Hero, Footer).
export const TRIAL_HREF = '/schnupperstunde';
