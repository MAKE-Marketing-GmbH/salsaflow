// Inhalt der Tanzkurse-Uebersicht (oberhalb des Kurskalenders), zweisprachig DE/EN.
// Quelle der Fakten: docs/CONTENT-SPEC.md (Struktur + echte Preise) und INVARIANTS.json
// (preise_zeigen: true). Copy-Regeln (003/069/085): simpel, du-Form, echte Umlaute, CH-ss,
// keine Em-Dashes, ~50 Woerter pro Sektion, keine Superlative/Rabatte/Fachjargon.
//
// Preise sind auf DIESER Seite ausdruecklich erwuenscht (anders als Home). Echte Zahlen, nichts
// erfunden. Fotos: nur physisch vorhandene Dateien aus /photos/gallery/kurse/ (echte Kundenfotos
// kommen spaeter, dann Swap auf gleiche Pfade). Keine 404.
//
// Copy (2026-07-09): sichtbare Besucher-Copy 1:1 aus dem V3-Copyplan 02_tanzkurse uebernommen
// (Hero, Kursrichtungen, Level & Aufbau, Schnupperstunde/Final-CTA, Privatstunden, Kursplan-Teaser).
// Struktur/Keys/hrefs/Bild-Pfade unveraendert. Preise + Sommerkurse hat der Plan nicht, bleiben Bestand.
// Interne Redaktions-Notizen aus dem Plan ("Salsaflow sollte...", "Besucher sollen...") sind in
// Kunden-Ton aufgeloest, keine Bau-Notiz als Besucher-Text.
//
// Geil-Pass v2 (2026-07-07): Jede Sektions-Headline traegt jetzt ein Akzent-Wort (titleAccent),
// das im Bright-Editorial-Layout als Alex-Brush-Handschrift in Salsa-Rot gesetzt wird. `title`
// ist der Vorlauf ohne das Akzent-Wort, `titleAccent` der geschwungene Schluss. Im Render steht
// dazwischen genau ein Leerzeichen, der volle Satz bleibt also unveraendert lesbar.

import type { Lang } from '@/lib/i18n';

export type StyleCard = {
  key: string;
  title: string;
  text: string;
  photo?: string; // /photos/...
  alt?: string;
  href: string;
  cta: string;
  accent?: boolean; // rote Akzent-Karte (Workshops) statt Foto
};

export type LevelTrack = {
  key: string;
  title: string;
  note: string;
  rungs: string[]; // aufsteigende Stufen der Leiter
};

export type FactChip = { label: string };

export type PriceRow = { label: string; value: string };
export type PriceGroup = { key: string; title: string; rows: PriceRow[]; cta?: { label: string; href: string } };

export type OverviewContent = {
  hero: { eyebrow: string; title: string; titleAccent?: string; lead: string; facts: string[] };
  styles: { eyebrow: string; title: string; titleAccent?: string; lead: string; cards: StyleCard[] };
  levels: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    flowNoteBeginner: string; // erklaert die "Flow"-Zwischenstufe nach den Beginner-Stufen
    flowNoteIntermediate: string; // erklaert die "Flow"-Zwischenstufe nach den Intermediate-Stufen
    tracks: LevelTrack[];
    onTitle: string;
    onText: string; // Salsa On1 / On2
    chips: FactChip[]; // 8 Wochen, Quereinstieg, Nachholen, Aushilfe
  };
  prices: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    groups: PriceGroup[];
    guarantee: string;
  };
  summer: { eyebrow: string; title: string; titleAccent?: string; body: string; badge: string };
  trial: { eyebrow: string; title: string; titleAccent?: string; body: string; cta: string; note: string };
  privat: { eyebrow: string; title: string; titleAccent?: string; body: string; points: string[] };
  calendar: { eyebrow: string; title: string; titleAccent?: string; lead: string; cta: string };
};

// Design-Kritik Runde 3, Issue 3: bachata zeigte /photos/gallery/kurse/03.jpg — dasselbe
// Foto lag zusaetzlich im Home-Hero, auf /kontakt, in der Team-Sektion, auf der
// Bachata-Unterseite und in der Galerie (9 Fundstellen; DESIGN.md:93 erlaubt sitewide 2).
// Die Bachata-Kachel bekommt jetzt das Bachata-Motiv aus der premium-Strecke, das auch
// die Home-Offer-Kachel traegt: ein Paar in warmem Licht, sichtbar Bachata statt Party.
// Design-Kritik Runde 2, Issue 5 ("die Heels-Kachel ist ein muddy Dunkelbild, Motiv kaum
// lesbar", Beleg /tmp/slices/z_heels_dark.jpg). Gemessen: /photos/gallery/kurse/04.jpg hat
// Luminanz 30/255, 76.6% der Pixel liegen unter 40/255 — eine Nachtaufnahme auf einer
// Papierton-Flaeche (#FBFAF8). Auf hellem Grund wirkt sie wie ein Loch in der Seite.
//
// Ersatz laut Fix-Vorgabe ("auf helles Studio-/Tageslichtmotiv wechseln"):
// kurse-heels-energie-01.webp, Luminanz 159/255 — eine Heels-Gruppe im hellen Studio vor
// der Salsaflow-Wand, Tageslicht, Motiv sofort lesbar. Das Bild stand bisher an genau EINER
// Stelle (/team), mit dieser zweiten Platzierung bleibt es im Limit von DESIGN.md:93
// (gegengeprueft mit scripts/verify-image-reuse.cjs).
const photos = {
  salsa: '/photos/gallery/kurse/01.jpg',
  bachata: '/photos/premium/offer-bachata-1200.webp',
  heels: '/photos/2026/kurse-heels-energie-01.webp',
};

export const COURSES_OVERVIEW: Record<Lang, OverviewContent> = {
  de: {
    hero: {
      eyebrow: 'Salsa · Bachata · Heels · Privatstunden',
      title: 'Finde den Kurs, der zu deinem',
      titleAccent: 'Rhythmus passt.',
      lead: 'Ob du komplett neu startest oder schon tanzt: Bei Salsaflow findest du den passenden Kurs, dein Level und den nächsten Einstieg direkt am Bahnhof Basel SBB.',
      facts: ['seit 2018', 'rund 40 Kurse pro Woche', '3 Studios am Bahnhof SBB'],
    },
    styles: {
      eyebrow: 'Kursrichtungen',
      title: 'Salsa, Bachata, Heels oder ein gezielter Workshop.',
      lead: 'Jede Richtung hat ihren eigenen Charakter. Vergleiche Musik, Bewegung und Kursziel und wähle, was dich am meisten anspricht.',
      cards: [
        {
          key: 'salsa',
          title: 'Salsa tanzen in Basel',
          text: 'Für Rhythmus, Energie, Drehungen und Social-Dance-Gefühl. Salsa passt, wenn du lebendig tanzen und schnell in Kontakt mit der Community kommen willst.',
          photo: photos.salsa,
          alt: 'Salsa-Unterricht im Studio',
          href: '/tanzkurse/salsa',
          cta: 'Salsa Kurse ansehen',
        },
        {
          key: 'bachata',
          title: 'Bachata mit Connection und Flow',
          text: 'Für weiche Bewegungen, Körpergefühl, Musikalität und Paartanz mit mehr Nähe. Bachata passt, wenn du Verbindung und Technik gemeinsam aufbauen willst.',
          photo: photos.bachata,
          alt: 'Bachata-Paar beim Üben',
          href: '/tanzkurse/bachata',
          cta: 'Bachata Kurse ansehen',
        },
        {
          key: 'heels',
          title: 'Heels für Haltung und Ausdruck',
          text: 'Für Linien, Präsenz, Selbstbewusstsein und Choreografie. Unterstützend aufgebaut, nicht einschüchternd.',
          photo: photos.heels,
          alt: 'Heels-Gruppe im hellen Salsaflow Studio bei Tageslicht',
          href: '/tanzkurse/heels',
          cta: 'Heels ansehen',
        },
        {
          key: 'workshops',
          title: 'Ein Thema gezielt vertiefen',
          text: 'Workshops passen, wenn du dich an einem Abend gezielt auf Technik, Styling, Musikalität oder neue Figuren konzentrieren willst.',
          href: '/events',
          cta: 'Workshops ansehen',
          accent: true,
        },
      ],
    },
    levels: {
      eyebrow: 'Level & Aufbau',
      title: 'Du musst dein Level nicht kennen. Wir finden es gemeinsam',
      titleAccent: 'heraus.',
      lead: 'Wenn du zwischen zwei Levels stehst oder nach einer Pause zurückkommst, helfen dir eine Schnupperstunde oder eine kurze Nachricht bei der Einordnung.',
      flowNoteBeginner: 'Beginner Flow heisst: die Grundschritte festigen, bis sie sicher sitzen.',
      flowNoteIntermediate: 'Intermediate Flow heisst: die Figuren variieren und frei kombinieren.',
      tracks: [
        {
          key: 'salsa-bachata',
          title: 'Salsa & Bachata',
          note: 'Ein klarer Weg von ganz neu bis Advanced.',
          rungs: [
            'Beginner Stufe 1 bis 6',
            'Beginner Flow',
            'Intermediate Stufe 7 bis 12',
            'Intermediate Flow',
            'Advanced ab Stufe 13',
          ],
        },
        {
          key: 'heels',
          title: 'Heels',
          note: 'Drei Level, dein Tempo.',
          rungs: ['Beginner', 'Intermediate', 'Advanced'],
        },
      ],
      onTitle: 'Salsa On1 und On2',
      onText: 'Wir unterrichten beide Taktarten. On1 ist der klassische Einstieg, On2 der nächste Schritt für den eigenen Stil.',
      chips: [
        { label: '8 Wochen, 8 Lektionen' },
        { label: 'Quereinstieg möglich' },
        { label: 'Nachholen in der Staffel' },
        { label: 'Aushilfe wird organisiert' },
      ],
    },
    prices: {
      eyebrow: '',
      title: 'Was ein regulärer Kurs kostet.',
      lead: 'Du siehst den Preis vor der Anmeldung. Weitere Tarife und Angebote findest du auf der Preisseite.',
      groups: [
        {
          key: 'kurs',
          title: 'Gruppenkurs',
          rows: [{ label: 'Salsa oder Bachata, 8 Lektionen', value: 'CHF 190.-' }],
          cta: { label: 'Kurs finden', href: '/kursplan' },
        },
        {
          key: 'privat',
          title: 'Privatstunden',
          rows: [
            { label: '1 Lektion, 1 Person', value: 'CHF 100.-' },
            { label: '5 Lektionen, 1 Person', value: 'CHF 450.-' },
            { label: '1 Lektion, 2 Personen', value: 'CHF 130.-' },
            { label: '5 Lektionen, 2 Personen', value: 'CHF 600.-' },
          ],
          cta: { label: 'Mehr zu Privatstunden', href: '#privatstunden' },
        },
      ],
      guarantee: 'Der Kursbetrag steht vor der Buchung fest.',
    },
    summer: {
      eyebrow: 'Sommerkurse',
      title: 'Drei Wochen Sommerkurs im August.',
      body: 'Einmal im Jahr machen wir Sommerkurse. Drei Wochen im August, kompakter als sonst und zu einem Spezialpreis. Ideal, um schnell reinzukommen oder dranzubleiben.',
      badge: '3 Wochen · Spezialpreis',
    },
    trial: {
      eyebrow: '',
      title: 'Starte mit einer Schnupperstunde oder öffne direkt den',
      titleAccent: 'Kursplan.',
      body: 'Wähle deinen Tanzstil, prüfe dein Level oder schreib uns kurz, wenn du unsicher bist. Wir helfen dir beim passenden Einstieg.',
      cta: 'Gratis Schnupperstunde buchen',
      note: 'Kostenlos · unverbindlich · auch ohne Tanzpartner möglich.',
    },
    privat: {
      eyebrow: 'Privatstunden',
      title: 'Persönlich schneller weiterkommen',
      body: 'Für Technik, Hochzeitstanz, Level-Feinschliff oder ein konkretes Ziel.',
      points: ['Einzeln oder zu zweit', 'Alle Salsa-Styles', 'Flexible Termine', 'Hochzeitstanz möglich'],
    },
    calendar: {
      eyebrow: '',
      title: 'Sieh, welche Kurse als Nächstes starten.',
      lead: 'Hier siehst du sofort, welche Kurse bald starten, welche Level offen sind und wo eine Schnupperstunde möglich ist. Filtere nach Tanzstil, Level und Wochentag.',
      cta: 'Kursplan öffnen',
    },
  },
  en: {
    hero: {
      eyebrow: 'Salsa · Bachata · Heels · Private lessons',
      title: 'Find the class that fits your',
      titleAccent: 'rhythm.',
      lead: 'Whether you are completely new or already dancing, Salsaflow helps you find the right style, level and starting date in three studios by Basel SBB station.',
      facts: ['since 2018', 'around 40 classes a week', '3 studios by Basel SBB'],
    },
    styles: {
      eyebrow: 'Course styles',
      title: 'Salsa, Bachata, Heels or a focused workshop.',
      lead: 'Each style has its own character. Compare the music, movement and course focus and choose what appeals to you most.',
      cards: [
        {
          key: 'salsa',
          title: 'Dance Salsa in Basel',
          text: 'For rhythm, energy, turns and social dancing. Salsa suits you if you enjoy lively movement and want to connect with the community.',
          photo: photos.salsa,
          alt: 'Salsa class in the studio',
          href: '/tanzkurse/salsa',
          cta: 'See Salsa classes',
        },
        {
          key: 'bachata',
          title: 'Bachata with connection and flow',
          text: 'For soft movement, body awareness, musicality and closer partner work. Bachata suits you if you want to develop connection and technique together.',
          photo: photos.bachata,
          alt: 'Bachata couple practising',
          href: '/tanzkurse/bachata',
          cta: 'See Bachata classes',
        },
        {
          key: 'heels',
          title: 'Heels for posture and expression',
          text: 'For lines, presence, confidence and choreography, taught step by step in a supportive atmosphere.',
          photo: photos.heels,
          alt: 'Heels group in the bright Salsaflow studio in daylight',
          href: '/tanzkurse/heels',
          cta: 'See Heels classes',
        },
        {
          key: 'workshops',
          title: 'Go deep on one topic',
          text: 'Workshops suit you when you want to focus on technique, styling, musicality or new figures in a single evening.',
          href: '/events',
          cta: 'See the workshops',
          accent: true,
        },
      ],
    },
    levels: {
      eyebrow: 'Level & path',
      title: 'You do not need to know your level. We find it',
      titleAccent: 'together.',
      lead: 'If you are between two levels or returning after a break, a trial class or a quick message will help us place you correctly.',
      flowNoteBeginner: 'Beginner Flow means: reinforcing the basic steps until they feel secure.',
      flowNoteIntermediate: 'Intermediate Flow means: varying the figures and combining them freely.',
      tracks: [
        {
          key: 'salsa-bachata',
          title: 'Salsa & Bachata',
          note: 'A clear path from brand new to advanced.',
          rungs: [
            'Beginner stages 1 to 6',
            'Beginner Flow',
            'Intermediate stages 7 to 12',
            'Intermediate Flow',
            'Advanced from stage 13',
          ],
        },
        {
          key: 'heels',
          title: 'Heels',
          note: 'Three levels, your pace.',
          rungs: ['Beginner', 'Intermediate', 'Advanced'],
        },
      ],
      onTitle: 'Salsa On1 and On2',
      onText: 'We teach both timings. On1 is the classic start, On2 the next step for your own style.',
      chips: [
        { label: '8 weeks, 8 lessons' },
        { label: 'Late entry possible' },
        { label: 'Catch up within the course block' },
        { label: 'We arrange a partner' },
      ],
    },
    prices: {
      eyebrow: '',
      title: 'What a regular course costs.',
      lead: 'You see the price before booking. Further rates and offers are listed on the prices page.',
      groups: [
        {
          key: 'kurs',
          title: 'Group course',
          rows: [{ label: 'Salsa or Bachata, 8 lessons', value: 'CHF 190.-' }],
          cta: { label: 'Find a course', href: '/kursplan' },
        },
        {
          key: 'privat',
          title: 'Private lessons',
          rows: [
            { label: '1 lesson, 1 person', value: 'CHF 100.-' },
            { label: '5 lessons, 1 person', value: 'CHF 450.-' },
            { label: '1 lesson, 2 people', value: 'CHF 130.-' },
            { label: '5 lessons, 2 people', value: 'CHF 600.-' },
          ],
          cta: { label: 'More on private lessons', href: '#privatstunden' },
        },
      ],
      guarantee: 'The course price is shown before you book.',
    },
    summer: {
      eyebrow: 'Summer courses',
      title: 'Three weeks of summer classes in August.',
      body: 'Once a year we run summer classes. They last three weeks in August, are more compact than usual and come at a special price. A good way to start or keep dancing through summer.',
      badge: '3 weeks · special price',
    },
    trial: {
      eyebrow: '',
      title: 'Start with a trial class or open the',
      titleAccent: 'schedule.',
      body: 'Choose your style, check your level or message us if you are unsure. We help you find the right starting point.',
      cta: 'Book a free trial class',
      note: 'Free · no obligation · possible even without a dance partner.',
    },
    privat: {
      eyebrow: 'Private lessons',
      title: 'Progress faster, just for you',
      body: 'For technique, your wedding dance, level polish or one specific goal.',
      points: ['Solo or as a pair', 'All Salsa styles', 'Flexible times', 'Wedding dance possible'],
    },
    calendar: {
      eyebrow: '',
      title: 'See which classes start next.',
      lead: 'Here you see right away which courses start soon, which levels are open and where a trial class is possible. Filter by style, level and weekday.',
      cta: 'Open the schedule',
    },
  },
};
