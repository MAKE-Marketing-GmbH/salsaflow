// Content der Preise-Seite (/preise) aus dem V3-Copyplan (pages/09_preise.md). EINE Datei,
// EIN Seiten-Component (PreisePage.tsx). Copy 1:1 aus dem Plan, zweisprachig (de = Plan-Wortlaut,
// en = treu uebersetzt). Echte Umlaute, CH-ss, keine Em-Dashes.
//
// PREIS-INTEGRITAET (Regel Stat-Kachel + Aufgabe): Es werden AUSSCHLIESSLICH Zahlen verwendet,
// die im Plan 09 ODER in courses/overview-content.ts stehen. Nichts erfunden. Jede Position hat
// im Plan eine Zahl, deshalb steht ueberall ein echter Preis. Die Kern-Preise (Kurs 190, Privat
// 100/450/130/600) sind zusaetzlich in overview-content.ts gegengeprueft.
//
// Interne Redaktions-Notizen aus dem Plan ("Preise vor Livegang final abgleichen", "vor
// Veroeffentlichung final bestaetigen", "im Formular abbilden") sind KEINE Kunden-Copy und werden
// NICHT gerendert. Sie stehen im Uebergabe-Report, damit der Haupt-Agent sie pruefen kann.

import type { Lang } from '@/lib/i18n';

// EIN Schnupper-Ziel sitewide (Master-Plan): Anker auf /kontakt.
const SCHNUPPER_HREF = '/kontakt#schnupperstunde';

export type PriceRow = { label: string; value?: string };
export type PriceGroup = { label: string; rows: PriceRow[] };
type Cta = { label: string; href: string };
type Img = { src: string; alt: string; position?: string };
/** Bild mit echten Datei-Massen — nur dort noetig, wo eine Sektion Dateien mit
 *  unterschiedlichem Seitenverhaeltnis nebeneinander stellt (CLS, siehe workshops). */
type SizedImg = Img & { width: number; height: number; position?: string };
/** Full-bleed Band unter dem Typo-Hero. Gleiche Form wie HeroFrame `media` auf /events und
 *  /team (subpage/kit.tsx) — `position` steuert den Ausschnitt. */
type HeroMedia = { src: string; alt: string; position?: string; heightClass?: string };
type FitOption = { when: string; pick: string; href: string };

export type PreiseContent = {
  crumb: { label: string; href: string };
  onRequest: string; // Fallback-Label falls je eine Position ohne Zahl bleibt (Stat-Kachel-Regel)
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    image: Img;
    /** Full-bleed Band unter dem Hero (Kritiker final-1, Issue 1). */
    media: HeroMedia;
    cardLabel: string;
    cardText: string;
    facts: [string, string][];
  };
  regular: {
    title: string;
    titleAccent?: string;
    body: string;
    fixed: string;
    cardTitle: string;
    cardNote: string;
    groups: PriceGroup[];
    included: string[];
    cta: Cta;
    microcopy: string;
    /** Runde 1 (Preise-Builder): die Frage, die direkt nach "CHF 190.-" kommt — muss ich das
     *  blind buchen? Vorher stand die Antwort erst 4000px weiter unten (fit.options / faq).
     *  Beide Zeilen sind belegt, nicht behauptet: die Schnupperstunde ist laut faq[2] gratis
     *  und unverbindlich, "auch ohne Tanzpartner" laut courses/overview-content.ts (trial.note
     *  + "Aushilfe wird organisiert"); der Quereinstieg haengt laut CourseEngine.tsx:177 am
     *  Feld `allowsLateEntry` der LAUFENDEN Staffel und wird im Kursplan pro Kurs als Badge
     *  gezeigt (i18n.tsx:83) — deshalb "steht im Kursplan" statt einer pauschalen Zusage.
     *  Bewusst NICHT gesagt: was ein Quereinstieg kostet. Dafuer gibt es keine Quelle. */
    entry: {
      label: string;
      items: { title: string; text: string }[];
      link: Cta;
    };
    /** Beleg-Foto unter der Preistabelle — fuellt die gemessene Leerzone (Kritiker final-1). */
    image: Img;
  };
  privat: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    body: string;
    rows: PriceRow[];
    /** Was in einer Privatstunde drin ist. Die Kursstaffel hatte diese Liste, die
     *  Privatstunden nannten nur vier Zahlen — gemessen 396px leere Spalte unter dem CTA. */
    included: string[];
    /** Der 5er-Block ist ein Rabatt, den die Tabelle zwar enthaelt, aber nicht ausspricht. */
    note: string;
    cta: Cta;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  workshops: {
    title: string;
    titleAccent?: string;
    lead: string;
    /** Foto-Anker je Spalte (Kritiker final-1: "Preisstaffel in Karten mit Foto-Anker").
     *  `width`/`height` sind Pflicht: die beiden Spalten tragen unterschiedliche
     *  Dateiformate (hochkant vs quer), ein fester Wert im JSX waere fuer eine falsch (CLS). */
    workshop: { title: string; body: string; rows: PriceRow[]; image: SizedImg };
    social: { title: string; body: string; rows: PriceRow[]; foot: string; image: SizedImg };
    cta: Cta;
  };
  pass: {
    badge: string;
    title: string;
    titleAccent?: string;
    body: string;
    rows: PriceRow[];
    cta: Cta;
    /** Was der Pass konkret enthaelt — die Preisspalte trug vorher NUR zwei Zahlen
     *  (Kritiker Fix-Runde 1, Issue 1: "ohne Karte, Foto, Nutzenliste"). */
    included: string[];
    /** Foto-Anker ueber den Preiszeilen, gleiche Bauform wie workshops.*.image. */
    image: Img;
  };
  fit: {
    title: string;
    titleAccent?: string;
    lead: string;
    optionsTitle: string;
    options: FitOption[];
    cta: Cta;
  };
  closing: {
    title: string;
    titleAccent?: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
  faqEyebrow: string;
  faqTitle: string;
  faqTitleAccent: string;
  faq: { q: string; a: string }[];
};

export const PREISE: Record<Lang, PreiseContent> = {
  de: {
    crumb: { label: 'Preise', href: '/preise' },
    onRequest: 'auf Anfrage',
    hero: {
      eyebrow: 'Preise & Optionen',
      title: 'Preise für Kurse, Workshops und',
      titleAccent: 'Privatstunden.',
      lead: 'Hier findest du die wichtigsten Preise übersichtlich zusammengefasst. Für Shows, Animationen und Spezialanfragen erhältst du ein individuelles Angebot.',
      primary: { label: 'Kursplan ansehen', href: '/kursplan' },
      secondary: { label: 'Frage stellen', href: '/kontakt' },
      image: {
        src: '/photos/kurse/kurs-03.jpg',
        alt: 'Ruhiger Blick in eine Tanzklasse im Salsaflow Studio',
      },
      media: {
        src: '/photos/kurse/kurs-05.jpg',
        alt: 'Volle Kursstaffel im hellen Salsaflow Studio, alle tanzen im Takt',
        // Kritiker Runde 1 (/preise, Fix 3): "Koepfe/Gesichter abgeschnitten" im Hero-Band.
        // Nachgemessen mit Gesichtserkennung gegen die echte Datei (YuNet, Schwelle 0.6,
        // Skript /tmp/pv/facecut.py) im echten Renderkasten 1440x480 (gemessen im Browser,
        // nicht geschaetzt). Das Bild skaliert auf 1440x958, 478px Hoehe fallen weg:
        //   pos 25% -> Fenster y120-600, 12 Gesichter ganz sichtbar, 1 ZERSCHNITTEN (y=548)
        //   pos 20% -> Fenster y96-576,  12 ganz sichtbar, 1 ZERSCHNITTEN (y=548)
        //   pos 15% -> Fenster y72-552,  12 ganz sichtbar, 1 ZERSCHNITTEN (y=548)
        //   pos 10% -> Fenster y48-528,  12 ganz sichtbar, 0 zerschnitten
        // Der Kopf rechts unten (y=548) lag also bis 15% genau auf der Unterkante. Ab 10%
        // liegt er vollstaendig unterhalb des Fensters — die Person ist nicht mehr im Bild,
        // statt halbiert im Bild. Weggeschnitten wird oben nur Decke, unten nur Parkett.
        //
        // Kritiker Runde 3, Fix 6 ("leerer Decken-Crop"): 10% war zwar schnittfrei, hat aber
        // die obere Bildhaelfte des Bandes mit Decke und Neonroehren gefuellt — im Screen
        // d-01 (scratch/pv3) ist unter der Falz 250px lang NUR Decke zu sehen, die Tanzenden
        // Band ist jetzt 18rem. Fold zeigt den oberen Streifen.
        // 32% traf Decke, 50% traf Schultern. 38% trifft die hintere Kopfreihe im Fold.
        position: 'center 38%',
        heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[12rem]',
      },
      cardLabel: 'Klar und übersichtlich',
      cardText: 'Alle Preise auf einen Blick. Den Rest klärst du im Kursplan oder per Nachricht.',
      /* Kritiker Runde 1 (/preise, Fix 2): "in 5 Sekunden klar, was was kostet" — genau das
         ging above the fold nicht. Gemessen auf dem laufenden Dev-Server: die erste CHF-Zahl
         der Seite stand bei y=1490 (Desktop 1440x900) bzw. y=1739 (Mobile 390x844); der Falz
         liegt bei 900 bzw. 844. Ein Besucher sah oben also drei Zahlen — und keine davon war
         ein Preis: 2018 / 40 / 3.

         Die Zahlenleiste bleibt als Bauform (HeroFrame `facts`, kit.tsx:348) und wechselt nur
         den Inhalt: auf einer Preisseite ist der Anker der Preis, nicht das Gruendungsjahr.
         Keine neue Komponente und keine neue Zahl — alle drei Werte stehen schon weiter unten
         auf derselben Seite: 190 aus regular.groups[0].rows[0], 100 aus privat.rows[0], und
         "Gratis" aus faq[2] ("Die Schnupperstunde ist gratis"). 2018/40/3 gehen nicht
         verloren, sie stehen unveraendert im Hero von /tanzkurse und /team. */
      facts: [
        ['CHF 190.-', 'Kursstaffel, 8 Wochen'],
        ['CHF 100.-', 'Privatstunde, 1 Person'],
        ['Gratis', 'Schnupperstunde'],
      ],
    },
    regular: {
      title: 'Reguläre Kursstaffel',
      body: 'Eine Kursstaffel ist der normale Einstieg, wenn du Salsa, Bachata oder Heels strukturiert lernen möchtest.',
      fixed: '8 Wochen, eine Lektion à 60 Minuten pro Woche.',
      cardTitle: 'Kursstaffel',
      cardNote: 'Festpreis pro Staffel.',
      groups: [
        {
          label: 'Einzeln',
          rows: [
            { label: 'Kurs Singles', value: 'CHF 190.-' },
            { label: 'Schüler und Studenten', value: 'CHF 160.-' },
          ],
        },
        {
          label: 'Zu zweit',
          rows: [
            { label: 'Kurs für Paare', value: 'CHF 320.-' },
            { label: 'Paare, Schüler und Studenten', value: 'CHF 270.-' },
          ],
        },
        {
          label: 'Einzellektion',
          rows: [
            { label: 'Einzellektion', value: 'CHF 30.-' },
            { label: 'Schüler und Studenten', value: 'CHF 25.-' },
          ],
        },
      ],
      included: [
        '8 Lektionen à 60 Minuten',
        'Nachholen in der Staffel möglich',
        'Aushilfe wird organisiert',
        'Keine versteckten Kosten',
      ],
      cta: { label: 'Kursplan öffnen', href: '/kursplan' },
      microcopy: 'Im Kursplan siehst du Startdaten, Level und freie Plätze.',
      entry: {
        label: 'Bevor du dich festlegst',
        items: [
          {
            title: 'Erst schnuppern, dann entscheiden',
            text: 'Die Schnupperstunde ist gratis und unverbindlich. Du tanzt eine Lektion mit, auch ohne Tanzpartner, und entscheidest danach in Ruhe.',
          },
          {
            title: 'Auch mitten in der Staffel',
            text: 'Bei vielen Kursen kannst du später einsteigen. Ob dein Wunschkurs gerade offen ist, steht direkt beim Kurs im Kursplan.',
          },
        ],
        link: { label: 'Schnupperstunde abmachen', href: SCHNUPPER_HREF },
      },
      image: {
        src: '/photos/party/party-36.webp',
        alt: 'Kursgruppe übt gemeinsam den Grundschritt im Salsaflow Studio',
      },
    },
    privat: {
      eyebrow: 'Privatstunden',
      title: 'Privatstunden für persönlichen Fokus',
      body: 'Privatstunden lohnen sich, wenn du an einem konkreten Ziel arbeitest: Hochzeitstanz, Technik, Styling, Levelwechsel oder Wiedereinstieg.',
      rows: [
        { label: 'Privatstunde, 1 Person', value: 'CHF 100.-' },
        { label: '5 Privatstunden, 1 Person', value: 'CHF 450.-' },
        { label: 'Privatstunde, Paar', value: 'CHF 130.-' },
        { label: '5 Privatstunden, Paar', value: 'CHF 600.-' },
      ],
      // Alle vier Punkte stehen so schon in privat/content.ts (hero.bullets, when.cards,
      // flow.steps) — hier nur zusammengezogen, damit die Preiszeilen nicht allein stehen.
      // Keine Dauer genannt: dafuer gibt es im Repo und im Brain keine Quelle.
      included: [
        'Du sagst dein Ziel, wir bauen die Stunde darum herum',
        'Einzeln oder zu zweit, im Studio am Bahnhof SBB',
        'Korrektur direkt im Moment statt Wochen später',
        'Auch für Hochzeitstanz und Wiedereinstieg',
      ],
      // Rechnerisch aus den Zeilen darueber, keine neue Zusage: 5x100 = 500 gegen 450,
      // 5x130 = 650 gegen 600. In beiden Faellen genau 50 Franken.
      note: 'Im Fünferblock sparst du gegenüber Einzelstunden 50 Franken.',
      cta: { label: 'Privatstunde anfragen', href: '/privatstunden' },
      // Quadrat-Crop des Wide-Originals (Kritik 10.08.2026): im alten Portrait-Asset war
      // die Frau schon in der Quelldatei am linken Rand halb abgeschnitten.
      image: {
        src: '/photos/premium/offer-privat-square-1200.webp',
        alt: 'Paar bei einer Privatstunde im Studio',
      },
      cardLabel: '1:1 Fokus',
      cardText: 'Dein Tempo. Dein Ziel.',
    },
    workshops: {
      title: 'Workshops und Events',
      lead: 'Zwei Wege, mehr auf die Tanzfläche zu kommen: ein Thema vertiefen oder einfach mittanzen.',
      workshop: {
        title: 'Workshop',
        body: 'Vertiefe ein Thema vor der Danceflow Night oder als Spezialformat.',
        rows: [
          { label: 'Freitag Workshop', value: 'CHF 30.-' },
          { label: 'Schüler und Studenten', value: 'CHF 25.-' },
        ],
        // Kursformat, kein Partybild: die Copy verspricht "ein Thema vertiefen", also zeigt
        // das Foto Unterricht im Studio. Nachbarspalte trägt bewusst den Social-Dance-Moment,
        // damit die zwei Wege auch im Bild unterscheidbar sind.
        image: {
          src: '/photos/gallery/kurse/08.jpg',
          alt: 'Tanzlehrer zeigt vorne einen Schritt, die Gruppe übt mit',
          width: 1067,
          height: 1600,
          position: 'center 20%',
        },
      },
      social: {
        title: 'Danceflow Night',
        body: 'Social Dance, Community und Üben in entspannter Atmosphäre.',
        rows: [
          { label: 'Salsaflow Schüler', value: 'CHF 5.-' },
          { label: 'Gäste', value: 'CHF 10.-' },
        ],
        foot: 'Jeden 1., 3. und 5. Freitag im Monat.',
        image: {
          src: '/photos/party/party-38.webp',
          alt: 'Lachendes Paar tanzt bei einer Danceflow Night, weitere Gäste im Hintergrund',
          width: 1500,
          height: 1000,
          position: 'center 30%',
        },
      },
      cta: { label: 'Events ansehen', href: '/events-workshops/danceflow-night' },
    },
    pass: {
      badge: 'Mehr tanzen, ein Preis',
      title: 'Für alle, die mehr als einen Kurs tanzen',
      titleAccent: 'wollen.',
      body: 'Der Salsaflow Pass kann sinnvoll sein, wenn du regelmässig mehrere Kurse besuchen möchtest.',
      rows: [
        { label: 'Salsaflow Pass', value: 'CHF 410.-' },
        { label: 'Schüler und Studenten', value: 'CHF 340.-' },
      ],
      // PREIS-INTEGRITAET gilt auch hier: die drei Zeilen sind Umformulierungen von Fakten, die
      // in DIESEM Block schon stehen (body: "regelmässig mehrere Kurse"; rows: reduzierter
      // Schueler-Preis; cta: "Pass anfragen"). Keine neue Leistungszusage erfunden — fuer
      // Pass-Konditionen liegt im Brain keine Quelle vor (geprueft: 00-brain/**, nur MASTERPLAN
      // nennt die beiden Zahlen 410/340).
      included: [
        'Für mehrere Kurse in derselben Staffel',
        'Reduzierter Preis für Schüler und Studenten',
        'Wir prüfen mit dir, ob sich der Pass lohnt',
      ],
      cta: { label: 'Pass anfragen', href: '/kontakt' },
      // Erste Wahl war party-25.webp (hellster Wert im Bestand, 179/255). Im Screenshot
      // (/tmp/rest-fix1-shots/preise-desktop-06-y4200.png) war das Motiv aber eine
      // Langzeitbelichtung: alle vier Personen sind Bewegungsschlieren, im 16/9-Ausschnitt
      // blieb sichtbar nur der Wand-Schriftzug. Ein unscharfes Bild loest den Befund
      // "wirkt unfertig" nicht, es verschiebt ihn. Darum classfreude: 151/255, scharf,
      // volle Klasse in Bewegung im hellen Studio — und inhaltlich genau die Aussage der
      // Headline ("mehr als einen Kurs"). Die Datei war seit dem Hero-Wechsel
      // (home/Hero.tsx:14) ohne Platzierung.
      image: {
        src: '/photos/kurse/kurs-07.jpg',
        alt: 'Volle Kursgruppe tanzt gemeinsam im hellen Salsaflow Studio',
        // Hochformat (1067x1600), Koepfe bei 15-25% der Hoehe: ohne position war der
        // Haupttaenzer im Querformat-Crop kopflos (Kopf-Schnitt-Sweep 13.08.2026).
        position: 'center 15%',
      },
    },
    fit: {
      title: 'Welches Angebot passt zu deinem Ziel?',
      lead: 'Schnupperstunde, Gruppenkurs, Privatstunde, Pass oder Danceflow Night im direkten Vergleich.',
      optionsTitle: 'Was passt zu dir?',
      options: [
        { when: 'Wenn du neu bist', pick: 'Gratis Schnupperstunde oder Beginner-Kurs.', href: SCHNUPPER_HREF },
        { when: 'Wenn du ein Ziel hast', pick: 'Privatstunde.', href: '/privatstunden' },
        { when: 'Wenn du viel tanzen willst', pick: 'Pass prüfen.', href: '#salsaflow-pass' },
        { when: 'Wenn du nur üben willst', pick: 'Danceflow Night.', href: '/events-workshops/danceflow-night' },
        { when: 'Wenn du unsicher bist', pick: 'Nachricht senden.', href: '/kontakt' },
      ],
      cta: { label: 'Passenden Einstieg finden', href: '/kontakt' },
    },
    closing: {
      title: 'Finde den nächsten Termin im',
      titleAccent: 'Kursplan.',
      body: 'Öffne den Kursplan, wähle Tanzstil und Level oder schreib uns, wenn du unsicher bist.',
      primary: { label: 'Kursplan ansehen', href: '/kursplan' },
      secondary: { label: 'Frage stellen', href: '/kontakt' },
    },
    faqEyebrow: 'FAQ',
    faqTitle: 'Häufige Fragen zu',
    faqTitleAccent: 'Preisen',
    faq: [
      {
        q: 'Gibt es Studentenpreise?',
        a: 'Ja, laut aktueller Preisliste gibt es reduzierte Preise für Schüler und Studenten.',
      },
      {
        q: 'Sind Shows und Animationen pauschal bepreist?',
        a: 'Nein. Für Shows, Animationen und Spezialanfragen erstellen wir dir ein individuelles Angebot.',
      },
      {
        q: 'Was kostet eine Schnupperstunde?',
        a: 'Die Schnupperstunde ist gratis. Komm unverbindlich vorbei und entscheide danach in Ruhe.',
      },
      {
        q: 'Welcher Preis gilt für Paare?',
        a: 'Für reguläre Kurse und Privatstunden gibt es Paarpreise laut Preisliste.',
      },
    ],
  },
  en: {
    crumb: { label: 'Prices', href: '/preise' },
    onRequest: 'on request',
    hero: {
      eyebrow: 'Prices & options',
      title: 'Prices for courses, workshops and',
      titleAccent: 'private lessons.',
      lead: 'Here you find the most important prices at a glance. For shows, animations and special requests you get an individual quote.',
      primary: { label: 'See the schedule', href: '/kursplan' },
      secondary: { label: 'Ask a question', href: '/kontakt' },
      image: {
        src: '/photos/kurse/kurs-03.jpg',
        alt: 'A calm look into a dance class at the Salsaflow studio',
      },
      media: {
        src: '/photos/kurse/kurs-05.jpg',
        alt: 'A full course term in the bright Salsaflow studio, everyone dancing in time',
        // Gleicher Ausschnitt wie de.
        position: 'center 38%',
        heightClass: 'h-[10rem] sm:h-[11rem] lg:h-[12rem]',
      },
      cardLabel: 'Clear and simple',
      cardText: 'All prices at a glance. You sort out the rest in the schedule or by message.',
      // Gleiche Anker wie de (siehe Kommentar dort): Preis statt Gruendungsjahr.
      facts: [
        ['CHF 190.-', 'course term, 8 weeks'],
        ['CHF 100.-', 'private lesson, 1 person'],
        ['Free', 'trial class'],
      ],
    },
    regular: {
      title: 'Regular course term',
      body: 'A course term is the normal way in when you want to learn Salsa, Bachata or Heels in a structured way.',
      fixed: '8 weeks, one 60-minute lesson per week.',
      cardTitle: 'Course term',
      cardNote: 'Fixed price per term.',
      groups: [
        {
          label: 'Solo',
          rows: [
            { label: 'Course singles', value: 'CHF 190.-' },
            { label: 'Pupils and students', value: 'CHF 160.-' },
          ],
        },
        {
          label: 'As a pair',
          rows: [
            { label: 'Course for couples', value: 'CHF 320.-' },
            { label: 'Couples, pupils and students', value: 'CHF 270.-' },
          ],
        },
        {
          label: 'Single lesson',
          rows: [
            { label: 'Single lesson', value: 'CHF 30.-' },
            { label: 'Pupils and students', value: 'CHF 25.-' },
          ],
        },
      ],
      included: [
        '8 lessons of 60 minutes',
        'Catch up within the term',
        'We arrange a partner',
        'No hidden costs',
      ],
      cta: { label: 'Open the schedule', href: '/kursplan' },
      microcopy: 'In the schedule you see start dates, levels and free spots.',
      entry: {
        label: 'Before you commit',
        items: [
          {
            title: 'Try first, decide after',
            text: 'The trial class is free and without obligation. You dance one lesson along, also without a partner, and decide afterwards in your own time.',
          },
          {
            title: 'Also mid-term',
            text: 'For many courses you can join later. Whether your course is open right now is shown on the course itself in the schedule.',
          },
        ],
        link: { label: 'Arrange a trial class', href: SCHNUPPER_HREF },
      },
      image: {
        src: '/photos/party/party-36.webp',
        alt: 'Course group practising the basic step together in the Salsaflow studio',
      },
    },
    privat: {
      eyebrow: 'Private lessons',
      title: 'Private lessons for personal focus',
      body: 'Private lessons pay off when you work on a specific goal: wedding dance, technique, styling, a level change or a comeback.',
      rows: [
        { label: 'Private lesson, 1 person', value: 'CHF 100.-' },
        { label: '5 private lessons, 1 person', value: 'CHF 450.-' },
        { label: 'Private lesson, couple', value: 'CHF 130.-' },
        { label: '5 private lessons, couple', value: 'CHF 600.-' },
      ],
      included: [
        'You name your goal, we build the lesson around it',
        'Alone or as a pair, in the studio by the SBB station',
        'Correction right in the moment instead of weeks later',
        'Also for wedding dances and coming back after a break',
      ],
      note: 'With a block of five you save 50 francs against single lessons.',
      cta: { label: 'Request a private lesson', href: '/privatstunden' },
      // Square crop of the wide original (critique 2026-08-10): the old portrait asset had
      // the woman half-cut at the left edge in the source file itself.
      image: {
        src: '/photos/premium/offer-privat-square-1200.webp',
        alt: 'Couple in a private lesson at the studio',
      },
      cardLabel: '1:1 focus',
      cardText: 'Your pace. Your goal.',
    },
    workshops: {
      title: 'Workshops and events',
      lead: 'Two ways to get more time on the floor: go deeper on a topic or simply dance along.',
      workshop: {
        title: 'Workshop',
        body: 'Go deeper on a topic before the Danceflow Night or as a special format.',
        rows: [
          { label: 'Friday workshop', value: 'CHF 30.-' },
          { label: 'Pupils and students', value: 'CHF 25.-' },
        ],
        image: {
          src: '/photos/gallery/kurse/08.jpg',
          alt: 'Teacher showing a step at the front while the group practises along',
          width: 1067,
          height: 1600,
          position: 'center 20%',
        },
      },
      social: {
        title: 'Danceflow Night',
        body: 'Social dance, community and practice in a relaxed atmosphere.',
        rows: [
          { label: 'Salsaflow students', value: 'CHF 5.-' },
          { label: 'Guests', value: 'CHF 10.-' },
        ],
        foot: 'Every 1st, 3rd and 5th Friday of the month.',
        image: {
          src: '/photos/party/party-38.webp',
          alt: 'Laughing couple dancing at a Danceflow Night, more guests in the background',
          width: 1500,
          height: 1000,
          position: 'center 30%',
        },
      },
      cta: { label: 'See the events', href: '/events-workshops/danceflow-night' },
    },
    pass: {
      badge: 'More dancing, one price',
      title: 'For everyone who wants to dance more than one',
      titleAccent: 'course.',
      body: 'The Salsaflow Pass can make sense if you want to take several courses regularly.',
      rows: [
        { label: 'Salsaflow Pass', value: 'CHF 410.-' },
        { label: 'Pupils and students', value: 'CHF 340.-' },
      ],
      included: [
        'For several courses in the same block',
        'Reduced price for pupils and students',
        'We check with you whether the pass is worth it',
      ],
      cta: { label: 'Ask about the pass', href: '/kontakt' },
      image: {
        src: '/photos/kurse/kurs-07.jpg',
        alt: 'A full class dancing together in the bright Salsaflow studio',
      },
    },
    fit: {
      title: 'Which option fits your goal?',
      lead: 'Compare a trial class, group course, private lesson, pass and Danceflow Night at a glance.',
      optionsTitle: 'What fits you?',
      options: [
        { when: 'If you are new', pick: 'Free trial class or a beginner course.', href: SCHNUPPER_HREF },
        { when: 'If you have a goal', pick: 'Private lesson.', href: '/privatstunden' },
        { when: 'If you want to dance a lot', pick: 'Check the pass.', href: '#salsaflow-pass' },
        { when: 'If you only want to practise', pick: 'Danceflow Night.', href: '/events-workshops/danceflow-night' },
        { when: 'If you are unsure', pick: 'Send a message.', href: '/kontakt' },
      ],
      cta: { label: 'Find your right start', href: '/kontakt' },
    },
    closing: {
      title: 'Find the next date in the',
      titleAccent: 'schedule.',
      body: 'Open the schedule, pick a dance style and level, or write to us if you are unsure.',
      primary: { label: 'See the schedule', href: '/kursplan' },
      secondary: { label: 'Ask a question', href: '/kontakt' },
    },
    faqEyebrow: 'FAQ',
    faqTitle: 'Common questions about',
    faqTitleAccent: 'prices',
    faq: [
      {
        q: 'Are there student prices?',
        a: 'Yes, according to the current price list there are reduced prices for pupils and students.',
      },
      {
        q: 'Are shows and animations priced as a flat rate?',
        a: 'No. For shows, animations and special requests we create an individual quote for you.',
      },
      {
        q: 'What does a trial class cost?',
        a: 'The trial class is free. Come by without any obligation and decide afterwards in your own time.',
      },
      {
        q: 'Which price applies to couples?',
        a: 'For regular courses and private lessons there are couple prices according to the price list.',
      },
    ],
  },
};
