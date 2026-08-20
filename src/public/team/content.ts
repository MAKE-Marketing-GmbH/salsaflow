// Inhalt der Team-Seite (Etappe 13), zweisprachig DE/EN.
// Quelle der Fakten: wiki.md Abschnitt 11 (Team nach Rollen, Anzahl aus der Sitemap-DOCX) +
// Abschnitt 1 (vier Freunde, über 30 im Team, 3 Studios am Bahnhof SBB).
// Copy nach Regel 003/069/085 (simpel, du, echte Umlaute, CH-ss, keine Em-Dashes).
//
// EHRLICHKEIT (wichtig, Memory "Josephine": nie erfundene Identitaet auf echtem Gesicht):
// Die Namen-zu-Foto-Zuordnung und die persönlichen Kurz-Bios sind offene Kundendaten
// (wiki.md Abschnitt 14, Punkt 10/20). Darum:
//  - Die Rollen-Beschreibungen sind echt und stehen pro Rollengruppe (Bio auf Rollen-Ebene).
//  - Die echten Studio-Portraits werden als Team-Gesichter gezeigt, OHNE erfundene Namen.
//    `name: null` rendert ein neutrales Label; sobald Fabio die Liste liefert, trägt
//    man Name + Bio hier ein, ohne eine Zeile Code zu ändern.

import type { Lang } from '@/lib/i18n';

/** Eine Rollengruppe des Teams (Anzahl + echte Beschreibung). */
export type RoleGroup = {
  id: string;
  /** Anzahl Personen laut Sitemap-DOCX (wiki.md 11). */
  count: number;
  title: string;
  blurb: string;
};

/** Ein echtes Team-Gesicht. Foto ist ein freigestelltes Studio-Portrait.
 *  name/bio bleiben null bis der Kunde die Zuordnung liefert (siehe Kopf-Kommentar). */
export type Face = {
  id: string;
  /** Pfad zum freigestellten Portrait in public/photos/team, oder null für eine Stil-Kachel. */
  photo: string | null;
  /** Echter Name, sobald vom Kunden bestätigt. null => neutrales Team-Label. */
  name: string | null;
  /** Rolle in einem Wort (DE), nur wenn vom Kunden bestaetigt. null => keine Rollen-Behauptung. */
  role: string | null;
  /** Optionale Tailwind-object-position-Klasse fuer den Crop (sonst Default). */
  optPos?: string;
};

// Die 5 echten Tanzlehrer als saubere Freisteller (Bau-Welle 3, public/photos/team/teacher-*.webp).
// Namen sind belegt (INVARIANTS.json facts.gruender: "Tanzlehrer: Aleksandra, Anina, Jelena,
// Maarten, Tobias"). Darum zeigen wir hier Vorname + Rolle, keine erfundene Zuordnung.
// Die alten team-0x-Cutouts (inkonsistente Beleuchtung) sind ersetzt. Die vier Gründer stehen
// separat und prominent als FOUNDERS. optPos: object-position pro Freisteller (Köpfe auf eine Linie).
export const FACES: Face[] = [
  { id: 'aleksandra', photo: '/photos/team/teacher-aleksandra.webp', name: 'Aleksandra', role: 'Tanzlehrerin', optPos: 'object-[48%_5%]' },
  { id: 'anina', photo: '/photos/team/teacher-anina.webp', name: 'Anina', role: 'Tanzlehrerin', optPos: 'object-[52%_5%]' },
  { id: 'jelena', photo: '/photos/team/teacher-jelena.webp', name: 'Jelena', role: 'Tanzlehrerin', optPos: 'object-[54%_5%]' },
  { id: 'maarten', photo: '/photos/team/teacher-maarten.webp', name: 'Maarten', role: 'Tanzlehrer', optPos: 'object-[50%_4%]' },
  { id: 'tobias', photo: '/photos/team/teacher-tobias.webp', name: 'Tobias', role: 'Tanzlehrer', optPos: 'object-[50%_4%]' },
];

/** Die vier echten Gründer (Bau-Welle 2, Stand 2026-07-03).
 *  Quelle: INVARIANTS.json facts.gruender + assets/original-site/founder-*.png (Studio-Portraits,
 *  Halbkörper auf weissem Hintergrund). Web-optimiert nach public/photos/founders/<key>.webp.
 *  Die vorherigen Namen (Jenny/Alex/Ilhan/Sabrina) waren Bailadoro-Assets eines anderen Kunden
 *  und sind raus. Rollen bleiben belegbar generisch: alle vier sind Mitgründer:in und stehen
 *  selbst im Kurs (INVARIANTS). Fabio und Sebastian sind die Hauptkontakte. KEINE erfundenen
 *  Biografien, keine erfundenen Tanz-Titel. */
export type Founder = {
  key: string;
  /** Vorname, wird gross gezeigt. */
  name: string;
  /** Nachname, wird klein unter dem Vornamen gezeigt. */
  last: string;
  photo: string;
  /** true = weibliche Ansprache (Mitgründerin), false = männliche (Mitgründer). Nur für die Rollen-Zeile. */
  fem: boolean;
  /** Optionale object-position-Klasse für den Crop (Köpfe auf eine Linie bringen). */
  optPos?: string;
  /** Normiertes Brustbild-Fenster: Breite/links/oben in Prozent des 4:5-Panels.
   *  Siehe `bust` unten — object-position reicht hier nicht, weil auch der ZOOM je Person
   *  unterschiedlich sein muss. */
  bust: { w: string; l: string; t: string };
};

// Design-Kritik Runde 2, Issue 8: "Fabios Kopf ist deutlich kleiner als Claudias, Vanessa steht
// im Profil, die Augenlinien liegen auf drei verschiedenen Hoehen"
// (Beleg /tmp/slices/z_home_founders.jpg, z_team_founders.jpg).
//
// Der frueherer Versuch normierte auf SCHEITEL und SCHULTER. Das war der Fehler: die Schulter
// liegt bei einer Person im Profil (Vanessa) voellig anders als bei einer frontalen Figur, und
// der Scheitel haengt an der Frisur, nicht am Kopf. Wer darauf normiert, bekommt vier gleich
// hohe Silhouetten mit vier verschiedenen Augenlinien — genau der Befund der Kritik.
//
// Jetzt wird auf die zwei Groessen normiert, die das Auge tatsaechlich vergleicht:
//   KOPFHOEHE  (Scheitel -> Augenlinie, x2 = stabiles Mass fuer die Kopfgroesse)
//   AUGENLINIE (die eine Hoehe, auf der alle vier Gesichter sitzen sollen)
//
// Gemessen aus den Quelldateien (alle 1000x1414), Augenlinie ueber Dunkelpixel, die beidseitig
// von Hautton eingefasst sind (= Iris/Wimpernkante, nicht Haar):
//              Scheitel   Augenlinie   Kopfhoehe (2x Differenz)
//   Fabio        5.52%      23.34%        35.6%
//   Claudia      6.51%      23.06%        33.1%
//   Sebastian    4.67%      18.03%        26.7%   <- deutlich kleinerer Kopf in der Datei
//   Vanessa      5.87%      22.28%        32.8%
// R159: 152.2% Zoom war zu eng (Schultern und Brust weg, Scheitel knapp). Zoom liegt
// jetzt bei 122%, damit Kopf plus Brust im 4:5-Panel sitzen und der Scheitel frei bleibt.
// object-position verschiebt nur, es skaliert nicht — darum bleibt `bust`.
//
// Zielwerte im 4:5-Panel: Kopfhoehe 46%, Augenlinie 38% der Panelhoehe.
// `bust` ist das daraus ausgerechnete Bildfenster (Breite/links/oben in % der Panelmasse).
//
// Gegengeprueft am gerenderten Panel (Kontaktbogen 380x475 mit Hilfslinie, Augenlinie erneut
// gemessen, Suche auf die Gesichtsspalten begrenzt):
//   Fabio 37.47%  ·  Claudia 37.68%  ·  Sebastian 37.89%  ·  Vanessa 37.68%
// Streuung 0.42pp (vorher: drei sichtbar verschiedene Hoehen).
export const FOUNDERS: Founder[] = [
  { key: 'fabio', name: 'Fabio', last: 'Branco', photo: '/photos/founders/fabio.webp', fem: false, optPos: 'object-[52%_6%]', bust: { w: '114.1%', l: '-7.3%', t: '7.9%' } },
  { key: 'claudia', name: 'Claudia', last: 'Branco', photo: '/photos/founders/claudia.webp', fem: true, optPos: 'object-[44%_6%]', bust: { w: '122.9%', l: '0%', t: '6.0%' } },
  // R156: `photo` zeigt hier auf `sebastian-ok.webp`, nicht auf `sebastian.webp`.
  // Grund ist NICHT die Datei. `sebastian.webp` liegt im Ordner, ist ein gueltiges WebP
  // (147228 Byte, 1414x2000, RGBA, dekodiert sauber) und byte-identisch mit dem Stand in
  // HEAD (gleiche sha256). Ein statischer Server liefert sie korrekt als `image/webp` aus.
  // Der laufende Vite-Dev-Server beantwortet aber GENAU diesen einen Pfad mit dem
  // SPA-Index (`Content-Type: text/html`) — der Browser bekommt HTML statt Bild und zeigt
  // das kaputte Bild-Icon (sichtbar im Avatar-Stapel der RolesSection, Vorher-Shot
  // worklog/shots/S7-ux156/vorher/team-y2800.png). Alle anderen Fotos derselben Ordner
  // (fabio/claudia/vanessa, alle teacher-*) kommen normal als `image/webp`.
  // `sebastian-ok.webp` ist dieselbe Datei unter einem Pfad, den Vite ausliefert.
  { key: 'sebastian', name: 'Sebastian', last: 'Carballo', photo: '/photos/founders/sebastian-ok.webp', fem: false, optPos: 'object-[50%_4%]', bust: { w: '122%', l: '-11%', t: '1%' } },
  { key: 'vanessa', name: 'Vanessa', last: 'Costante', photo: '/photos/founders/vanessa.webp', fem: true, optPos: 'object-[56%_7%]', bust: { w: '123.9%', l: '-13.7%', t: '6.8%' } },
];

/** Generische Rollen-Zeile pro Gründer:in (keine erfundene Rolle). */
export function founderRole(fem: boolean, lang: Lang): string {
  if (lang === 'de') return fem ? 'Gründerin und Schulleitung' : 'Gründer und Schulleitung';
  return 'Founder and school director';
}

export type TeamContent = {
  founders: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  hero: {
    eyebrow: string;
    titleA: string;
    titleAccent: string;
    titleB: string;
    lead: string;
    stats: { v: string; l: string }[];
  };
  story: {
    eyebrow: string;
    title: string;
    body: string;
    body2: string;
  };
  roles: {
    eyebrow: string;
    title: string;
    lead: string;
    groups: RoleGroup[];
    countLabel: string; // "Personen" / "people"
  };
  faces: {
    eyebrow: string;
    title: string;
    lead: string;
    namePlaceholder: string; // ehrlicher Platzhalter statt erfundenem Namen
    note: string; // transparente Zeile: Namen + Vorstellungen folgen
  };
  closing: {
    title: string;
    titleAccent: string;
    body: string;
    cta: string;
    secondary: string;
  };
};

/* `satisfies` statt `: Record<Lang, TeamContent>`: die Annotation weitete jeden Wert auf
 * `string` und warf damit die Typ-Evidenz weg, die im Objekt schon steht (anti-slop
 * no-known-value-widening). Mit `satisfies` prueft der Compiler denselben Vertrag —
 * beide Sprachen, alle Felder — und behaelt die genauen Literal-Typen. */
export const TEAM = {
  de: {
    founders: {
      eyebrow: '',
      title: 'Die Menschen, die Salsaflow geprägt haben.',
      lead: 'Fabio, Claudia, Sebastian und Vanessa haben Salsaflow 2018 gegründet und prägen die Schule bis heute.',
    },
    hero: {
      eyebrow: 'Team Salsaflow',
      titleA: 'Tanz lernt man',
      titleAccent: 'leichter',
      titleB: 'wenn man sich willkommen fühlt.',
      lead: 'Unser Team unterrichtet, organisiert, tanzt und sorgt dafür, dass du dich in der Community nicht wie ein Gast, sondern wie ein Teil davon fühlst.',
      stats: [
        { v: '~40', l: 'Kurse pro Woche' },
        { v: '4', l: 'Freunde am Anfang' },
        { v: '3', l: 'Studios am Bahnhof SBB' },
      ],
    },
    story: {
      eyebrow: 'Unsere Geschichte',
      title: 'So wurde aus einer Idee Salsaflow.',
      // Ergaenzt 14.08.2026 aus dem Kunden-Onboarding:
      // - "geschichte": "alle haben schon unterrichtet und hatten schon Erfahrung" — ohne den
      //   Halbsatz klang die Gruendung nach Spontanidee statt nach erfahrenen Leuten.
      // - "erfolge": "An den Schueler merkt man das, wenn sie dann ploetzlich Shows machen.
      //   Shows sind auch von den Schueler. Unser Team tun wir selbst ausbilden."
      // - "qualifikationen": "Teilnahme an nationalen Tanzwettbewerben" — einziges hartes
      //   Qualifikations-Signal im Onboarding, stand nirgends.
      body: 'Vier Freunde hatten auf dem Weg zum Starbucks die Idee, ein eigenes Studio zu öffnen. Alle vier unterrichteten damals schon. 2018 gründeten sie Salsaflow in Basel und haben seither an nationalen Tanzwettbewerben teilgenommen.',
      body2: 'Daraus ist ein Team geworden, das heute rund 40 Kurse pro Woche gibt. Unsere Lehrerinnen und Lehrer bilden wir selbst aus, oft aus den eigenen Kursen heraus. Wer bei uns anfängt, steht ein paar Staffeln später vielleicht selbst in einer Show.',
    },
    roles: {
      eyebrow: '',
      title: 'Unser Team nach Rollen',
      lead: 'Bei uns hat jede Rolle ihren Platz. So sieht das Team hinter deinen Kursen und Abenden aus. Pushflower sind erfahrene Tänzer, die im Kurs mittanzen und als Partner einspringen, damit niemand allein steht.',
      countLabel: 'Personen',
      groups: [
        {
          id: 'owners',
          count: 4,
          title: 'Inhaber und Lehrer',
          blurb: 'Die vier Freunde, die Salsaflow gegründet haben. Sie führen die Schule und stehen selbst jede Woche im Kurs.',
        },
        {
          id: 'teachers',
          count: 17,
          title: 'Lehrer und Pushflower',
          blurb: 'Unser grösstes Team. Sie geben Kurse und helfen als Pushflower auf der Tanzfläche, damit niemand allein steht.',
        },
        {
          id: 'trainees',
          count: 2,
          title: 'Lehrer in Ausbildung und Pushflower',
          blurb: 'Sie lernen gerade das Unterrichten und sind schon als Pushflower mittendrin.',
        },
        {
          id: 'pushflowers',
          count: 11,
          title: 'Pushflowers',
          blurb: 'Die guten Seelen am Rand der Fläche. Sie tanzen mit, springen als Partner ein und halten die Stimmung warm.',
        },
        {
          id: 'crew',
          count: 3,
          title: 'DJ, Eventmanager und Allrounder',
          blurb: 'Musik, Organisation und alles dazwischen. Sie machen aus einem Abend ein Erlebnis.',
        },
      ],
    },
    faces: {
      eyebrow: 'Die Gesichter',
      title: 'Ein paar von uns',
      lead: 'Fünf aus unserem Team von Tanzlehrerinnen und Tanzlehrern. Beim nächsten Kurs stehen wir vielleicht zusammen mit dir auf der Fläche.',
      namePlaceholder: 'Salsaflow Team',
      note: 'Dazu kommen viele Pushflowers und Helfer im Hintergrund. Das ganze Team lernst du am besten an einem Abend bei uns kennen.',
    },
    closing: {
      title: 'Lern das Team auf der Tanzfläche',
      titleAccent: 'kennen.',
      body: 'Am besten lernst du uns in einer Schnupperstunde oder auf einer Danceflow Night kennen.',
      cta: 'Schnupperstunde buchen',
      secondary: 'Folg uns auf Instagram',
    },
  },
  en: {
    founders: {
      eyebrow: '',
      title: 'The people who shaped Salsaflow.',
      lead: 'Fabio, Claudia, Sebastian and Vanessa founded Salsaflow in 2018 and still shape the school today.',
    },
    hero: {
      eyebrow: 'Team Salsaflow',
      titleA: 'Dancing feels',
      titleAccent: 'easier',
      titleB: 'when you feel welcome.',
      lead: 'Our team teaches, organises, dances and makes sure you feel like part of the community, not like a guest.',
      stats: [
        { v: '~40', l: 'classes a week' },
        { v: '4', l: 'friends at the start' },
        { v: '3', l: 'studios at Basel SBB' },
      ],
    },
    story: {
      eyebrow: 'Our story',
      title: 'How an idea became Salsaflow.',
      body: 'On the way to Starbucks, four friends had the idea to open their own studio. All four were already teaching at the time. They founded Salsaflow in Basel in 2018 and have since taken part in national dance competitions.',
      body2: 'From there grew a team that now teaches around 40 classes a week. We train our teachers ourselves, often from our own courses. Whoever starts with us might be on stage in a show a few terms later.',
    },
    roles: {
      eyebrow: '',
      title: 'Our team by role',
      lead: 'Every role has its place with us. This is the team behind your courses and your nights out. Pushflowers are experienced dancers who dance along in class and step in as partners, so nobody stands alone.',
      countLabel: 'people',
      groups: [
        {
          id: 'owners',
          count: 4,
          title: 'Owners and teachers',
          blurb: 'The four friends who founded Salsaflow. They run the school and still teach in the studio every week.',
        },
        {
          id: 'teachers',
          count: 17,
          title: 'Teachers and Pushflowers',
          blurb: 'Our largest team. They teach the courses and help as Pushflowers on the floor, so nobody stands alone.',
        },
        {
          id: 'trainees',
          count: 2,
          title: 'Teachers in training and Pushflowers',
          blurb: 'They are learning to teach and are already in the middle of it as Pushflowers.',
        },
        {
          id: 'pushflowers',
          count: 11,
          title: 'Pushflowers',
          blurb: 'The kind souls at the edge of the floor. They dance along, step in as partners and keep the mood warm.',
        },
        {
          id: 'crew',
          count: 3,
          title: 'DJ, event manager and all-rounder',
          blurb: 'Music, organisation and everything in between. They turn an evening into an experience.',
        },
      ],
    },
    faces: {
      eyebrow: 'The faces',
      title: 'A few of us',
      lead: 'Five of our dance teachers. At your next class we might be on the floor together with you.',
      namePlaceholder: 'Salsaflow team',
      note: 'On top of that there are many Pushflowers and helpers behind the scenes. The best way to meet the whole team is one evening with us.',
    },
    closing: {
      title: 'Get to know the team',
      titleAccent: 'on the dance floor.',
      body: 'The best way to meet us is in a trial class or at a Danceflow Night.',
      cta: 'Book a trial class',
      secondary: 'Follow us on Instagram',
    },
  },
} satisfies Record<Lang, TeamContent>;
