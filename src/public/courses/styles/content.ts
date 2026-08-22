// Content der drei Stilseiten (/tanzkurse/salsa|bachata|heels) aus dem V3-Copyplan
// (pages/03-05). EINE Datei, EIN Seiten-Template (StylePage.tsx). Copy 1:1 aus dem Plan,
// zweisprachig (de = Plan-Wortlaut, en = treu uebersetzt). Echte Umlaute, CH-ss.
//
// Bilder: echte Salsaflow-Fotos (public/photos). KI nur laut 03_KI_BILD_LUECKEN (Heels).
// Interne Links zeigen auf die echten Routen dieser Seite.

import type { Lang } from '@/lib/i18n';
import type { SeoKey } from '@/lib/seo';
import type { Faq, Crumb } from '@/public/subpage/kit';

export type StyleKey = 'salsa' | 'bachata';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string; position?: string; mobileSrc?: string; heightClass?: string };

export type StyleContent = {
  seo: SeoKey;
  crumb: Crumb; // Breadcrumb-Endpunkt (label + href dieser Seite)
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
    band: Img;
    cardLabel: string;
    cardText: string;
  };
  why: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    blocks: { title: string; text: string }[];
    image: Img;
  };
  fit: {
    title: string;
    titleAccent?: string;
    intro: string;
    yesTitle: string;
    yes: string[];
    maybeTitle: string;
    maybe: string[];
    cta: Cta;
  };
  beginner: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    phases: { tag: string; title: string; text: string }[];
    cta: Cta;
    image: Img;
  };
  levels: {
    title: string;
    titleAccent?: string;
    body: string;
    rungs: { name: string; text: string }[];
    cta: Cta;
    /** Optionaler Charakter-Hinweis ueber der Leiter (Salsa: On1/On2). */
    timingNote?: { title: string; text: string };
  };
  social: {
    title: string;
    titleAccent?: string;
    body: string;
    bullets: string[];
    cta: Cta;
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

/* Interne Ziel-Routen (echte App-Routen dieser Seite). */
const R = {
  salsaPlan: '/kursplan?stil=salsa',
  bachataPlan: '/kursplan?stil=bachata',
  heelsPlan: '/kursplan?stil=heels',
  kursaufbau: '/kursaufbau',
  danceflow: '/events-workshops/danceflow-night',
  tanzschuhe: '/mehr/tanzschuhe',
  salsaPage: '/tanzkurse/salsa',
  bachataPage: '/tanzkurse/bachata',
  heelsPage: '/tanzkurse/heels',
  schnupper: '/schnupperstunde',
};

/* ============================================================= SALSA (Muster, 1:1 pages/03) */
const salsa = {
  de: {
    seo: 'salsa',
    crumb: { label: 'Salsa', href: R.salsaPage },
    hero: {
      eyebrow: 'Salsa Kurse in Basel',
      title: 'Lerne Salsa so, dass du dich auf der Tanzfläche sicher fühlst.',
      lead: 'Bei Salsaflow lernst du Rhythmus, Grundschritte, Führung, Folgen und erste Kombinationen in klar aufgebauten Kursen, auch wenn du ganz neu startest und ohne Tanzpartner kommst.',
      // R131 (Mobil-Fold, 18.08.): Die Pills brauchten mobil drei Zeilen und
      // endeten bei y=707. Das Band startete dadurch erst bei y=739 und zeigte
      // im 844er-Fold nur Stirn und Dutt. Brief erlaubt: Pills weichen, wenn
      // sie das Band aus dem Fold druecken. EN-Bullets bleiben unveraendert.
      bullets: [],
      primary: { label: 'Salsa Kursplan ansehen', href: R.salsaPlan },
      secondary: { label: 'Salsa Schnupperstunde buchen', href: R.schnupper },
      microcopy: 'Kostenlos · unverbindlich · wir helfen dir beim passenden Level.',
      image: { src: '/photos/premium/offer-salsa-1200.webp', alt: 'Lachendes Salsa-Paar in Bewegung im hellen Salsaflow Studio' },
      band: {
        src: '/photos/premium/offer-salsa-hero-2100.webp',
        alt: 'Salsa-Paar im Unterricht, Nähe und Energie im Salsaflow Studio',
        // R71-Nachzieh (tight-Block in subpage/kit.tsx) brachte den Band-Top auf 555,
        // sichtbar 175px. R73: Crop 0% zeigte davon nur Dutt und Haar — die Gesichter
        // sitzen UNTER dem Streifen (Quell-y ~255 von 900). 18rem + 0% hielt die
        // Gesichter also nicht, der alte Kommentar unten stimmte nicht mehr.
        // R73: Erste Live-Kalibrierung (12%) und danach 24% scheiterten — das
        // Mann-Kinn sass jeweils auf/unter der 730er-Schnittkante (Opus-Kritik
        // FAIL). Ueber Quell-Teststreifen (convert -crop 2100x420+0+N) abgelesen:
        // Erst die gezoomten Band-Bilder (convert -crop 1440x175+0+555 -resize 200%)
        // gaben objektive Kinn-Positionen; Vollbild-Ablesungen lagen immer daneben.
        // Befund ueber 4..52: bei 4..8 beide Kinne unter dem Fold, bei 28+ sinkt die
        // Frau ab, bei 48+ der Mann. Kritik-Split bei 18 (Opus PASS, Grok FAIL
        // Frau-Kinn zu knapp): die Kinn-Spanne Mann~710/Frau~690 klebte zu nah an
        // der 730er-Kante. Vollbild-Zonen-Crops (2000x350) zeigen bei 14% beide
        // Profile mit Kiefer- und Kinnlinie IM Fenster, Mann zentraler im Band.
        // 14% zentriert die Spanne, statt sie nach oben zu schieben. Motiv,
        // Copy, Bachata, Heels unberuehrt (R73-Stopp).
        // R109 (Raphael-last, 17.08.): Bei 18rem lag das Kinn auf/unter der
        // 730er-Schnittkante (Band y=566–854, nur Stirn im Fenster — Harness
        // FAIL salsaKoepfe). Einziger erlaubter Hebel: DE heightClass lg
        // hoeher. 24rem (Band-Top 660) zeigt beide Gesichter inkl. Kinn mit
        // Luft zum Fold. Crop bleibt center 14% (P85), Motiv bleibt, EN 55
        // bleibt, R87-22rem-Rueckdreh gilt nicht (damals wurde der Crop
        // mitbewegt, jetzt nur die Hoehe).
        // R131: Mobil war das Fenster mit 10rem (160px, davon 104 im Fold) zu
        // flach fuer beide Gesichter. Mobil/sm hoeher: 20rem / 22rem. lg bleibt
        // 24rem wie in R109. Crop bleibt center 14% (P85-Lock, nicht gedreht).
        position: 'center 14%',
        heightClass: 'h-[20rem] sm:h-[22rem] lg:h-[24rem]',
      },
      cardLabel: 'Dein Einstieg',
      cardText: 'Rhythmus, Grundschritt, erste Drehung. In Ruhe.',
    },
    why: {
      eyebrow: 'Warum Salsa',
      title: 'Salsa ist Energie, Führung und Musik in',
      titleAccent: 'Bewegung',
      body: 'Salsa gibt dir schnell das Gefühl, auf der Tanzfläche anzukommen. Du lernst Schritte und verstehst Rhythmus, Verbindung sowie klare Signale zwischen Leader und Follower.',
      blocks: [
        { title: 'Rhythmus', text: 'Du hörst, zählst und fühlst die Musik mit dem Körper.' },
        { title: 'Partnerwork', text: 'Du verstehst, wie Führung und Folgen funktionieren, ohne dass es verkrampft oder kompliziert wirkt.' },
        { title: 'Social Dance', text: 'Salsa bleibt nicht im Kursraum. Du kannst das Gelernte auf Danceflow Nights und Socials direkt ausprobieren.' },
      ],
      image: { src: '/photos/gallery/kurse/02.jpg', alt: 'Salsa-Paar beim Partnerwork im Unterricht', position: 'center 25%' },
    },
    fit: {
      // R188 ST4: dieselbe Regel wie auf der Bachata-Seite. Die Sektion beantwortet,
      // ob Salsa passt oder ob eine Schnupperstunde der bessere erste Schritt ist.
      title: 'Passt Salsa zu dir?',
      intro: 'Du musst kein Rhythmus-Profi sein. Hilfreich ist nur, dass du offen bist, regelmässig zu üben und dich auf Partnerwork einzulassen.',
      yesTitle: 'Passt zu dir, wenn',
      yes: [
        'du einen lebendigen Paartanz lernen willst',
        'du Musik, Rhythmus und Bewegung verbinden möchtest',
        'du gern auch auf Socials und Partys tanzen willst',
        'du klare Struktur statt chaotische Figuren-Sammlung suchst',
      ],
      maybeTitle: 'Vielleicht erst mit Schnupperstunde starten, wenn',
      maybe: [
        'du dein Level nicht einschätzen kannst',
        'du zwischen Salsa und Bachata schwankst',
        'du schon einmal Salsa gelernt hast, aber lange pausiert hast',
      ],
      cta: { label: 'Level im Kursplan prüfen', href: R.salsaPlan },
    },
    beginner: {
      eyebrow: 'Deine ersten Wochen',
      /* R188 ST4, Raphael-Video 10:xx: «Ueberschriften nicht poetisch, konkret.»
         Vorher: «Von den ersten Basics zu fliessenden Kombinationen» (Beleg
         worklog/shots/R188/after-final2-tanzkurse/tanzkurse_salsa/d-03.png). Das ist
         eine unklare Aussage. «Fliessend» beschreibt ein Gefühl. Die Zeile sagte nicht,
         was der Leser bekommt.
         Jetzt folgt die Nutzenfrage aus dem Auftrag («Muster: Was lernst du…?»). Die vier
         Phasen darunter beantworten sie. Der Eyebrow «Deine ersten Wochen» bleibt. Er nennt
         die Kursphase. Die Überschrift greift ihn jetzt wörtlich auf. */
      title: 'Was lernst du in den ersten Wochen?',
      body: 'Ein guter Salsa-Kurs beginnt nicht mit komplizierten Figuren. Er beginnt mit Rhythmus, Grundschritten und klaren Signalen, damit du dich sicher fühlst.',
      phases: [
        { tag: 'Phase 1', title: 'Rhythmus & Grundschritt', text: 'Du lernst den Grundrhythmus, einfache Gewichtswechsel und wie du zur Musik startest.' },
        { tag: 'Phase 2', title: 'Führung & Folgen', text: 'Du verstehst, wie Hände, Körperrichtung und Timing zusammenwirken.' },
        { tag: 'Phase 3', title: 'Erste Drehungen', text: 'Du lernst einfache Drehungen und Kombinationen für die Tanzfläche.' },
        { tag: 'Phase 4', title: 'Social-Dance-Gefühl', text: 'Du übst, mit wechselnden Partner:innen ruhig, klar und freundlich zu tanzen.' },
      ],
      cta: { label: 'Salsa Beginner ansehen', href: R.salsaPlan },
      image: { src: '/photos/2026/event-social-couple-01.webp', alt: 'Salsa-Grundschritt im Unterricht, Lehrperson zeigt vor' },
    },
    levels: {
      title: 'Salsa wächst mit',
      titleAccent: 'dir',
      body: 'Wenn du bereits getanzt hast, helfen wir dir bei der Wahl des Levels. So übst du weder zu weit voraus noch unter deinen Möglichkeiten.',
      rungs: [
        { name: 'Beginner Stufe 1 bis 6', text: 'Grundlagen Schritt für Schritt aufbauen.' },
        { name: 'Beginner Flow', text: 'Beginner-Inhalte verbinden und festigen.' },
        { name: 'Intermediate Stufe 7 bis 12', text: 'Technik, Musikalität und Repertoire erweitern.' },
        { name: 'Intermediate Flow', text: 'Intermediate-Inhalte flexibel anwenden.' },
        { name: 'Advanced ab Stufe 13', text: 'Details, Dynamik und eigenen Ausdruck vertiefen.' },
      ],
      cta: { label: 'Kursaufbau ansehen', href: R.kursaufbau },
      timingNote: {
        title: 'On1 oder On2?',
        text: 'Wir unterrichten beide Taktarten. On1 ist der klassische Einstieg, On2 der nächste Schritt für deinen eigenen Stil. Du musst dich nicht vorher entscheiden.',
      },
    },
    social: {
      /* R188 ST4: Die Ueberschrift hiess «Du lernst nicht fuer den Spiegel. Du lernst
         fuer echte Tanzabende». Das ist ein Slogan: er behauptet eine Haltung, nennt
         aber nicht, worum es in der Sektion geht. Wer die Seite ueberfliegt, liest die
         Ueberschrift und weiss danach nicht mehr als vorher.

         Der Name des Abends steht NICHT in der Ueberschrift. Grund am Render geprueft:
         StylePage.tsx:788-791 setzt direkt darueber ein festes Eyebrow «Danceflow Night».
         Eine Ueberschrift, die mit «Danceflow Night:» beginnt, doppelt dieses Wort im
         Abstand von einer Zeile. Der Name ist also schon gesetzt; die Ueberschrift muss
         die Aussage tragen. Sie sagt jetzt konkret, was dort passiert: du tanzt das
         Gelernte mit echten Menschen, statt es nur zu ueben. Bachata unten zieht in
         derselben Bauform mit. */
      title: 'Hier tanzt du, was du im Kurs gelernt hast',
      body: 'Die Danceflow Night ist der Ort, an dem du merkst, was im Kurs angekommen ist. Du tanzt mit Menschen aus der Community, übst in entspannter Atmosphäre und bleibst leichter dran.',
      bullets: [
        'Salsa und Bachata Socials',
        'Workshops vor ausgewählten Abenden',
        'ideal zum Üben nach dem Kurs',
        'auch für Gäste offen',
      ],
      cta: { label: 'Danceflow Night ansehen', href: R.danceflow },
      image: { src: '/photos/gallery/danceflow/03.jpg', alt: 'Volle Tanzfläche bei einer Danceflow Night' },
    },
    closing: {
      title: 'Bereit für deine erste',
      titleAccent: 'Salsa-Stunde?',
      body: 'Buche eine Gratis Schnupperstunde oder öffne direkt den Kursplan. Du musst nicht wissen, ob Salsa dein ganzes Leben wird. Es reicht, wenn du den ersten Abend testest.',
      primary: { label: 'Salsa Kursplan ansehen', href: R.salsaPlan },
      secondary: { label: 'Salsa Schnupperstunde buchen', href: R.schnupper },
      microcopy: 'Kostenlos · unverbindlich · auch ohne Tanzpartner möglich.',
    },
    faqEyebrow: 'Salsa FAQ',
    faqTitle: 'Häufige Fragen zu Salsa',
    faq: [
      {
        q: 'Kann ich ohne Vorkenntnisse Salsa lernen?',
        a: 'Ja. Die Beginner-Kurse sind genau dafür gedacht. Du lernst Grundschritte, Rhythmus, einfache Drehungen und die wichtigsten Signale im Paartanz.',
      },
      {
        q: 'Brauche ich einen Tanzpartner?',
        a: 'Nein. Du kannst dich auch alleine anmelden. Im Kurs wird auf eine gute Balance geachtet und du lernst mit wechselnden Partner:innen.',
      },
      {
        q: 'Welche Schuhe brauche ich für Salsa?',
        a: 'Für den Einstieg reichen saubere, bequeme Schuhe, mit denen du dich sicher bewegen kannst. Später sind Tanzschuhe sinnvoll, weil Drehungen leichter und kontrollierter werden.',
      },
      {
        q: 'Was ist besser: Salsa oder Bachata?',
        a: 'Salsa ist meist energiegeladener und rhythmischer, Bachata weicher und stärker auf Connection fokussiert. Wenn du unsicher bist, schau dir beide Stilseiten an und komm zur Schnupperstunde.',
      },
    ],
  },
  en: {
    seo: 'salsa',
    crumb: { label: 'Salsa', href: R.salsaPage },
    hero: {
      eyebrow: 'Salsa classes in Basel',
      title: 'Learn Salsa with confidence on the dance floor.',
      lead: 'At Salsaflow you learn rhythm, basic steps, leading, following and your first combinations in clearly structured courses, even if you start from scratch and come without a dance partner.',
      bullets: [
        'Salsa beginner to advanced',
        'Free trial class possible',
        'Works without a dance partner',
        'Right by Basel SBB station',
        'Danceflow Night to practise in a real social',
      ],
      primary: { label: 'See the Salsa schedule', href: R.salsaPlan },
      secondary: { label: 'Book a Salsa trial class', href: R.schnupper },
      microcopy: 'Free · without obligation · we help you find the right level.',
      image: { src: '/photos/premium/offer-salsa-1200.webp', alt: 'Smiling Salsa couple dancing in the bright Salsaflow studio' },
      band: {
        src: '/photos/premium/offer-salsa-hero-2100.webp',
        alt: 'Salsa couple in class, closeness and energy in the Salsaflow studio',
        // R79 (EN Fold 1440x730): Band top 498, Fenster 730-498 = 232px (konstant).
        // Runde 1: 0% nur Dutt + Maennerstirn, 20% (beide FAIL) zeigte nur den Mann klar,
        // die Dutt-Frau blieb Hinterkopf/Wange. Anker-Modell: Translation = Y% x
        // Ueberschuss (Motiv 1440x617, band 288 -> Ueberschuss 329). Fuer Frauen-Kinn
        // (~Y295) UND Mann-Kinn (~Y340-360) mit Luft braucht das Fenster Start ~Y180:
        // 55% x 329 = 181. 42-50% sitzen ebenfalls, 55% gibt beiden Kinnen die meiste
        // Luft ueber der Fold-Kante. NUR der EN-Block — DE bleibt center 14% (P85,
        // nicht angefasst), Motiv offer-salsa-hero-2100 und lg:h-[18rem] bleiben.
        position: 'center 55%',
        heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[18rem]',
      },
      cardLabel: 'Your start',
      cardText: 'Rhythm, basic step, first turn. Calmly.',
    },
    why: {
      eyebrow: 'Why Salsa',
      title: 'Salsa is energy, leading and music in',
      titleAccent: 'motion',
      body: 'Salsa quickly gives you the feeling of really dancing. You do not just memorise steps, you understand rhythm, connection and the simple signals between leader and follower.',
      blocks: [
        { title: 'Rhythm', text: 'You learn to not only hear the music but to count and feel it with your body.' },
        { title: 'Partner work', text: 'You understand how leading and following work, without it feeling tense or complicated.' },
        { title: 'Social dance', text: 'Salsa does not stay in the classroom. You can try what you learned right away at Danceflow Nights and socials.' },
      ],
      image: { src: '/photos/gallery/kurse/02.jpg', alt: 'Salsa couple doing partner work in class', position: 'center 25%' },
    },
    fit: {
      // R188 ST4: same rewrite as DE.
      title: 'Is Salsa right for you?',
      intro: 'You do not need to be a rhythm pro. It only helps that you are open, practise regularly and are willing to engage with partner work.',
      yesTitle: 'It suits you if',
      yes: [
        'you want to learn a lively partner dance',
        'you want to connect music, rhythm and movement',
        'you also like to dance at socials and parties',
        'you want clear structure instead of a chaotic pile of figures',
      ],
      maybeTitle: 'Maybe start with a trial class if',
      maybe: [
        'you cannot judge your own level',
        'you are torn between Salsa and Bachata',
        'you have danced Salsa before but paused for a long time',
      ],
      cta: { label: 'Check your level in the schedule', href: R.salsaPlan },
    },
    beginner: {
      eyebrow: 'Your first weeks',
      /* R188 ST4 — englische Fassung, siehe Begruendung am deutschen Block. */
      title: 'What do you learn in your first weeks?',
      body: 'A good Salsa course does not begin with complicated figures. It begins with rhythm, basic steps and clear signals so you feel safe.',
      phases: [
        { tag: 'Phase 1', title: 'Rhythm & basic step', text: 'You learn the basic rhythm, simple weight changes and how to start with the music.' },
        { tag: 'Phase 2', title: 'Leading & following', text: 'You understand how hands, body direction and timing work together.' },
        { tag: 'Phase 3', title: 'First turns', text: 'You learn simple turns and combinations you can really use on the dance floor.' },
        { tag: 'Phase 4', title: 'Social-dance feeling', text: 'You practise dancing with changing partners calmly, clearly and kindly.' },
      ],
      cta: { label: 'See Salsa beginner courses', href: R.salsaPlan },
      image: { src: '/photos/2026/event-social-couple-01.webp', alt: 'Salsa basic step in class, teacher demonstrating' },
    },
    levels: {
      title: 'Salsa grows with',
      titleAccent: 'you',
      body: 'If you have danced before, we can help you choose the right stage. That way the class is challenging without skipping essential foundations.',
      rungs: [
        { name: 'Beginner stages 1 to 6', text: 'Build your foundations step by step.' },
        { name: 'Beginner Flow', text: 'Connect and consolidate the beginner material.' },
        { name: 'Intermediate stages 7 to 12', text: 'Expand your technique, musicality and repertoire.' },
        { name: 'Intermediate Flow', text: 'Use the intermediate material more flexibly.' },
        { name: 'Advanced from stage 13', text: 'Refine detail, dynamics and individual expression.' },
      ],
      cta: { label: 'See the course structure', href: R.kursaufbau },
      timingNote: {
        title: 'On1 or On2?',
        text: 'We teach both timings. On1 is the classic start, On2 the next step for your own style. You do not have to decide beforehand.',
      },
    },
    social: {
      /* R188 ST4, siehe Begruendung an der deutschen Fassung oben. */
      title: 'This is where you dance what you learned in class',
      body: 'The Danceflow Night is where you notice what stuck from class. You dance with people from the community, practise in a relaxed atmosphere and stay with it more easily.',
      bullets: [
        'Salsa and Bachata socials',
        'Workshops before selected nights',
        'ideal for practising after class',
        'open to guests too',
      ],
      cta: { label: 'See the Danceflow Night', href: R.danceflow },
      image: { src: '/photos/gallery/danceflow/03.jpg', alt: 'Full dance floor at a Danceflow Night' },
    },
    closing: {
      title: 'Ready for your first',
      titleAccent: 'Salsa class?',
      body: 'Book a free trial class or open the schedule right away. You do not have to know whether Salsa will become your whole life. It is enough to test the first evening.',
      primary: { label: 'See the Salsa schedule', href: R.salsaPlan },
      secondary: { label: 'Book a Salsa trial class', href: R.schnupper },
      microcopy: 'Free · without obligation · no dance partner needed.',
    },
    faqEyebrow: 'Salsa FAQ',
    faqTitle: 'Common questions about Salsa',
    faq: [
      {
        q: 'Can I learn Salsa without any experience?',
        a: 'Yes. The beginner courses are made exactly for that. You learn basic steps, rhythm, simple turns and the most important signals in partner dancing.',
      },
      {
        q: 'Do I need a dance partner?',
        a: 'No. You can sign up on your own. The course keeps a good balance and you learn with changing partners.',
      },
      {
        q: 'Which shoes do I need for Salsa?',
        a: 'To start, clean, comfortable shoes you can move safely in are enough. Later, dance shoes make sense because turns become easier and more controlled.',
      },
      {
        q: 'Which is better: Salsa or Bachata?',
        a: 'Salsa is usually more energetic and rhythmic, Bachata is softer and more focused on connection. If you are unsure, look at both style pages and come to a trial class.',
      },
    ],
  },
} satisfies Record<Lang, StyleContent>;

/* ============================================================= BACHATA (1:1 pages/04) */
const bachata = {
  de: {
    seo: 'bachata',
    crumb: { label: 'Bachata', href: R.bachataPage },
    hero: {
      eyebrow: 'Bachata Kurse in Basel',
      title: 'Lerne Bachata mit Verbindung, Technik und Flow.',
      lead: 'Bachata verbindet weiche Bewegungen, Musikalität und Körpergefühl. Bei Salsaflow lernst du die Basics Schritt für Schritt, mit klarer Technik und einem Einstieg, der auch ohne Vorkenntnisse funktioniert.',
      bullets: [
        'Bachata Beginner bis Fortgeschrittene je nach Kursplan',
        'Technik, Musikalität und Connection',
        'Gratis Schnupperstunde möglich',
        'Ohne Tanzpartner möglich',
        'Social-Dance-Anbindung über Danceflow Night',
      ],
      primary: { label: 'Bachata Kursplan ansehen', href: R.bachataPlan },
      secondary: { label: 'Bachata Schnupperstunde buchen', href: R.schnupper },
      microcopy: 'Wir helfen dir, sicher und passend einzusteigen.',
      image: { src: '/photos/premium/offer-bachata-1200.webp', alt: 'Bachata-Paar mit ruhiger, warmer Verbindung im Salsaflow Studio' },
      band: {
        src: '/photos/premium/offer-bachata-1200.webp',
        alt: 'Bachata-Paar in ruhiger Haltung im Unterricht',
        // R71: 10% zeigte nur Boden, 25% nur Haar-Kuppen (63px Streifen zu flach).
        // R71-Nachzieh: zwei Hebel zusammen — Band-Top ~220px hoch (tight-Block in
        // subpage/kit.tsx: pt-0, pb-0, mb-1, gap-2.5; nur dense+media, ohne facts,
        // Achse left), das Band auf lg 11rem geoeffnet und die Chip-Reihe auf eine
        // Zeile gebracht (flex-nowrap, StylePage). Crop 20% legt das Fenster auf den
        // Gesichtsblock (Frau Kinn Quell-y ~640, skaliert 462/1080), sodass im
        // 730er-Fold zwei Gesichter inkl. Kinn stehen. Am Live-Render gemessen.
        position: 'center 20%',
        heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[11rem]',
      },
      cardLabel: 'Dein Einstieg',
      cardText: 'Timing, Connection, Körpergefühl. Ohne Druck.',
    },
    why: {
      eyebrow: 'Warum Bachata',
      title: 'Bachata wirkt weich. Gute Bachata ist',
      titleAccent: 'präzise',
      body: 'Von aussen sieht Bachata oft nach Nähe und Flow aus. Im Kurs lernst du, was dahinter steckt: Timing, Körperspannung, klare Signale, Kontrolle und Respekt im Paartanz.',
      // R188 ST3, Raphael-Video 10:13: «Die ganzen Sachen weglassen bzw. stark kuerzen.»
      // Hier standen drei nummerierte Blocks (01 Was man sieht / 02 Was du lernst /
      // 03 Was sich aendert), zusammen 46 Woerter neben einem Fliesstext, der dasselbe
      // schon sagt. Block 03 war ausserdem nur als Fueller fuer eine Leerflaeche
      // entstanden (Notiz Runde 1, 10.08.2026) — der Grund faellt weg, weil das Bild
      // jetzt rechts neben der Liste steht und die Spalte fuellt.
      // Es bleiben zwei Blocks mit je einer Zeile: was man sieht, was man lernt.
      // Keine neue Zusage, nur gekuerzt.
      blocks: [
        { title: 'Was man sieht', text: 'Nähe, weiche Bewegungen, Musikgefühl.' },
        { title: 'Was du lernst', text: 'Timing, Gewicht, Führen und Folgen, Körperkontrolle.' },
      ],
      // R138, Raphael-Video 09:08: «Genauso hier bei Bachata, das war auch falsch
      // eingefaerbt.» gallery/kurse/03.jpg ist eine Club-Nacht-Aufnahme mit rotem
      // Bodenlicht; jede Gradation zog sie entweder grau oder rot. Ersetzt durch
      // gallery/kurse/01.jpg — per Read geprueft: Tageslicht, scharf, Paar in
      // Fuehrungshaltung, passt zum Blocktext «Fuehrung und Folgen».
      image: { src: '/photos/gallery/kurse/01.jpg', alt: 'Bachata-Paar übt eine geführte Drehung im hellen Unterrichtsraum' },
    },
    fit: {
      // R188 ST4, Raphael-Video 10:26: «Ueberschriften nicht poetisch.» Er nennt genau
      // diesen Satz als Beispiel («Bachata passt, wenn du Flow suchst, aber trotzdem
      // Struktur brauchst»). Die Sektion vergleicht Bachata und Salsa und beantwortet
      // eine Frage: Welcher von beiden passt zu mir? Die Ueberschrift stellt sie jetzt.
      title: 'Bachata oder Salsa: Was passt zu dir?',
      intro: '',
      yesTitle: 'Passt zu dir, wenn',
      yes: [
        'du weiche Bewegungen und Paartanz mit Gefühl lernen willst',
        'du Musikalität und Connection spannend findest',
        'du lieber ruhig und kontrolliert aufbaust statt nur schnell Figuren zu sammeln',
        'du auf Socials tanzen möchtest, aber dich sicher fühlen willst',
      ],
      maybeTitle: 'Salsa könnte besser passen, wenn',
      maybe: [
        'du mehr Energie, schnelle Drehungen und rhythmische Dynamik suchst',
        'du lieber lebendig und etwas explosiver tanzt',
      ],
      cta: { label: 'Salsa und Bachata vergleichen', href: R.salsaPage },
    },
    beginner: {
      eyebrow: 'Kursinhalte',
      title: 'Das lernst du im Bachata-Kurs',
      body: 'Der Kurs soll nicht nur Figuren liefern. Er soll dir ein Gefühl geben, wie Bachata sicher, musikalisch und angenehm getanzt wird.',
      /* R188 ST3, Raphael-Video 10:13–10:21: «Die ganzen Sachen weglassen bzw. stark
         kuerzen. Bild rechts, Inhalte links.»
         Gemessen am Beleg worklog/shots/R188/after-final/tanzkurse_bachata/: die vier
         Module liefen ueber die Schnitte d-03 und d-04, also gut zwei Bildschirmhoehen
         auf 1440. Jeder Eintrag trug einen Zweizeiler mit «damit»-Nebensatz.
         Jetzt drei Module mit je einem kurzen Satz. Modul 3 «Koerpergefuehl» ist nicht
         gestrichen, sondern in «Connection» aufgegangen: Gewicht, Haltung und Fuehrung
         beschreiben dieselbe koerperliche Sache am Partner, sie standen vorher nur in
         zwei Kaesten. Keine neue Zusage, nur kuerzer gesagt. */
      phases: [
        { tag: 'Modul 1', title: 'Grundschritt & Timing', text: 'Du lernst die Basis und hältst den Rhythmus, auch bei neuen Figuren.' },
        { tag: 'Modul 2', title: 'Connection', text: 'Führen und Folgen über Haltung und Gewicht statt über Kraft.' },
        { tag: 'Modul 3', title: 'Musikalität', text: 'Du tanzt auf die Musik, statt im Kopf mitzuzählen.' },
      ],
      cta: { label: 'Bachata Kurse ansehen', href: R.bachataPlan },
      image: { src: '/photos/r188-tanzkurse/bachata-kursinhalte-studio-1800.webp', alt: 'Tanzpaar übt eine Bachata-Drehung im hellen Salsaflow Studio' },
    },
    levels: {
      title: 'Wir finden den Bachata-Kurs, der zu deinem',
      titleAccent: 'Level passt',
      body: 'Wenn Bachata zu schnell zu fortgeschrittenen Bewegungen springt, fühlt es sich unsicher an. Darum braucht es eine klare Level-Logik: Erst Basics, dann Connection, dann komplexere Bewegungen.',
      rungs: [
        { name: 'Beginner Stufe 1 bis 6', text: 'Grundschritte, einfache Drehungen und Körperhaltung.' },
        { name: 'Beginner Flow', text: 'Grundlagen verbinden und mit mehr Sicherheit tanzen.' },
        { name: 'Intermediate Stufe 7 bis 12', text: 'Technik, Musikalität und komplexere Kombinationen.' },
        { name: 'Intermediate Flow', text: 'Intermediate-Inhalte variieren und verfeinern.' },
        { name: 'Advanced ab Stufe 13', text: 'Details, Styling und anspruchsvolle Kombinationen.' },
      ],
      cta: { label: 'Level klären', href: R.kursaufbau },
    },
    social: {
      /* R188 ST4: zieht mit der Salsa-Fassung mit (Begruendung dort). Gleiche Bauform:
         Ereignis zuerst benennen, dann der konkrete Nutzen. */
      title: 'Hier wird aus Bachata-Technik Sicherheit',
      body: 'Auf der Danceflow Night kannst du das Gelernte in entspannter Atmosphäre ausprobieren. Genau dort wird aus Technik Vertrauen: Du tanzt mit unterschiedlichen Menschen, hörst unterschiedliche Songs und merkst, was wirklich sitzt.',
      bullets: [
        'Salsa und Bachata Socials',
        'Workshops vor ausgewählten Abenden',
        'ideal zum Üben nach dem Kurs',
        'auch für Gäste offen',
      ],
      cta: { label: 'Danceflow Night ansehen', href: R.danceflow },
      image: { src: '/photos/gallery/danceflow/05.jpg', alt: 'Paar tanzt Bachata bei einer Danceflow Night', position: 'center 15%' },
    },
    closing: {
      title: 'Probiere Bachata in einer',
      titleAccent: 'Gratis-Schnupperstunde',
      body: 'Starte mit einer Schnupperstunde oder öffne direkt den Kursplan. Wenn du unsicher bist, welcher Kurs passt, frag uns kurz. Lieber richtig starten als lange überlegen.',
      primary: { label: 'Bachata Kursplan ansehen', href: R.bachataPlan },
      secondary: { label: 'Bachata Schnupperstunde buchen', href: R.schnupper },
      microcopy: 'Kostenlos · unverbindlich · auch ohne Tanzpartner möglich.',
    },
    faqEyebrow: 'Bachata FAQ',
    faqTitle: 'Häufige Fragen zu Bachata',
    faq: [
      {
        q: 'Ist Bachata auch für Anfänger geeignet?',
        a: 'Ja. Im Beginner-Kurs lernst du Grundschritte, einfache Drehungen, Haltung und wie du dich im Paartanz sicher fühlst.',
      },
      {
        // Erklaerung ergaenzt 14.08.2026: "Sensual" stand sitewide als blosses Etikett, auch auf
        // der Startseite. Das Kunden-Onboarding erklaert es selbst (leistungen[1].was): Bachata
        // kommt aus der Dominikanischen Republik, Sensual ist die moderne, weichere Spielart, die
        // sich vor allem in Spanien entwickelt hat. No-Go des Kunden: "keine Fachbegriffe, die
        // Laien nicht verstehen".
        q: 'Ist Bachata Sensual zu schwierig für den Anfang?',
        a: 'Sensual ist die modernere, weichere Spielart der Bachata. Mehr Körperbewegung und Nähe als beim klassischen Stil aus der Dominikanischen Republik. Schwierig ist sie nicht, wenn sie sauber aufgebaut wird. Gute Kurse starten mit Basics und Technik, bevor komplexere Bewegungen dazukommen.',
      },
      {
        q: 'Muss ich als Paar kommen?',
        a: 'Nein. Du kannst dich auch alleine anmelden.',
      },
      {
        q: 'Ist Bachata sehr körpernah?',
        a: 'Bachata kann nah getanzt werden, aber gute Technik und respektvolle Kommunikation sind zentral. Im Kurs wird klar, wie Connection angenehm und sicher funktioniert.',
      },
    ],
  },
  en: {
    seo: 'bachata',
    crumb: { label: 'Bachata', href: R.bachataPage },
    hero: {
      eyebrow: 'Bachata classes in Basel',
      title: 'Learn Bachata with connection, technique and flow.',
      lead: 'Bachata combines soft movement, musicality and body awareness. At Salsaflow you learn the basics step by step, with clear technique and a course structure designed for complete beginners.',
      bullets: [
        'Bachata beginner to advanced, depending on the schedule',
        'Technique, musicality and connection',
        'Free trial class possible',
        'Works without a dance partner',
        'Social-dance link through the Danceflow Night',
      ],
      primary: { label: 'See the Bachata schedule', href: R.bachataPlan },
      secondary: { label: 'Book a Bachata trial class', href: R.schnupper },
      microcopy: 'We help you get in safely and at the right level.',
      image: { src: '/photos/premium/offer-bachata-1200.webp', alt: 'Bachata couple with a calm, warm connection in the Salsaflow studio' },
      band: {
        src: '/photos/premium/offer-bachata-1200.webp',
        alt: 'Bachata couple in a calm posture during class',
        position: 'center 22%',
        heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[12rem]',
      },
      cardLabel: 'Your start',
      cardText: 'Timing, connection and body awareness. Without pressure.',
    },
    why: {
      eyebrow: 'Why Bachata',
      title: 'Bachata looks soft. Good Bachata is',
      titleAccent: 'precise',
      body: 'From the outside Bachata often looks like closeness and flow. In class you learn what is behind it: timing, body tension, clear signals, control and respect in partner dancing.',
      // R188 ST3: same cut as DE, see the reasoning there.
      blocks: [
        { title: 'What you see', text: 'Closeness, soft movement, a feel for the music.' },
        { title: 'What you learn', text: 'Timing, weight transfer, leading and following, body control.' },
      ],
      // R138: gleiches Motiv wie DE, siehe Begruendung dort.
      image: { src: '/photos/gallery/kurse/01.jpg', alt: 'Bachata couple practising a led turn in the bright studio' },
    },
    fit: {
      // R188 ST4: same rewrite as DE, see the reasoning there.
      title: 'Bachata or Salsa: which one fits you?',
      intro: '',
      yesTitle: 'It suits you if',
      yes: [
        'you want to learn soft movement and partner dancing with feeling',
        'you find musicality and connection exciting',
        'you would rather build up calmly and controlled than just collect figures fast',
        'you want to dance at socials but want to feel safe',
      ],
      maybeTitle: 'Salsa might suit you better if',
      maybe: [
        'you are after more energy, fast turns and rhythmic drive',
        'you enjoy faster movement and a more energetic style',
      ],
      cta: { label: 'Compare Salsa and Bachata', href: R.salsaPage },
    },
    beginner: {
      eyebrow: 'Course content',
      title: 'What you learn in a Bachata class',
      body: 'The class teaches more than combinations. You develop safe technique, musicality and a comfortable connection with your partner.',
      /* R188 ST3 — Begruendung siehe deutsche Fassung oben. */
      phases: [
        { tag: 'Module 1', title: 'Basic step & timing', text: 'You learn the base and hold the rhythm, even on new figures.' },
        { tag: 'Module 2', title: 'Connection', text: 'Leading and following through posture and weight, not strength.' },
        { tag: 'Module 3', title: 'Musicality', text: 'You dance to the music instead of counting in your head.' },
      ],
      cta: { label: 'See Bachata courses', href: R.bachataPlan },
      image: { src: '/photos/r188-tanzkurse/bachata-kursinhalte-studio-1800.webp', alt: 'Dance couple practising a Bachata turn in the bright Salsaflow studio' },
    },
    levels: {
      title: 'We help you find the Bachata class for your',
      titleAccent: 'level',
      body: 'When Bachata jumps to advanced movements too fast, it feels unsafe. That is why it needs a clear level logic: first basics, then connection, then more complex movement.',
      rungs: [
        { name: 'Beginner stages 1 to 6', text: 'Basic steps, simple turns and posture.' },
        { name: 'Beginner Flow', text: 'Connect the foundations and dance with more confidence.' },
        { name: 'Intermediate stages 7 to 12', text: 'Technique, musicality and more complex combinations.' },
        { name: 'Intermediate Flow', text: 'Vary and refine the intermediate material.' },
        { name: 'Advanced from stage 13', text: 'Detail, styling and demanding combinations.' },
      ],
      cta: { label: 'Clarify your level', href: R.kursaufbau },
    },
    social: {
      /* R188 ST4, siehe Begruendung an der deutschen Fassung oben. */
      title: 'This is where Bachata technique turns into confidence',
      body: 'At the Danceflow Night you can try what you learned in a relaxed atmosphere. That is where technique turns into trust: you dance with different people, hear different songs and notice what really sticks.',
      bullets: [
        'Salsa and Bachata socials',
        'Workshops before selected nights',
        'ideal for practising after class',
        'open to guests too',
      ],
      cta: { label: 'See the Danceflow Night', href: R.danceflow },
      image: { src: '/photos/gallery/danceflow/05.jpg', alt: 'Couple dancing Bachata at a Danceflow Night', position: 'center 15%' },
    },
    closing: {
      title: 'Try Bachata in a free',
      titleAccent: 'trial class',
      body: 'Start with a trial class or open the schedule. If you are unsure which class fits, send us a quick message and we will help you choose.',
      primary: { label: 'See the Bachata schedule', href: R.bachataPlan },
      secondary: { label: 'Book a Bachata trial class', href: R.schnupper },
      microcopy: 'Free · without obligation · no dance partner needed.',
    },
    faqEyebrow: 'Bachata FAQ',
    faqTitle: 'Common questions about Bachata',
    faq: [
      {
        q: 'Is Bachata suitable for beginners?',
        a: 'Yes. In the beginner course you learn basic steps, simple turns, posture and how to feel safe in partner dancing.',
      },
      {
        q: 'Is Bachata Sensual too hard for the start?',
        a: 'Sensual is the more modern, softer variant of Bachata. More body movement and closeness than the classic style from the Dominican Republic. It is not hard if it is built up cleanly. Good courses start with basics and technique before more complex movement comes in.',
      },
      {
        q: 'Do I have to come as a couple?',
        a: 'No. You can sign up on your own.',
      },
      {
        q: 'Is Bachata very close?',
        a: 'Bachata can be danced close, but good technique and respectful communication are essential. In class you learn how to create a comfortable, safe connection.',
      },
    ],
  },
} satisfies Record<Lang, StyleContent>;

export const STYLE_CONTENT = {
  salsa,
  bachata,
} satisfies Record<StyleKey, Record<Lang, StyleContent>>;
