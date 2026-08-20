// Inhalt + Daten der Fotos-Galerie (Bright Editorial, Geil-Pass v2), zweisprachig DE/EN.
// Die Bilder kommen aus dem echten Kunden-Foto-Export unter public/photos/. Die Galerie ist
// jetzt eine kuratierte, in sich geschlossene Foto-Liste (GALLERY_PHOTOS) statt eines
// Laufzeit-Manifests. Grund: das alte Manifest deckte nur public/photos/gallery/ ab und konnte
// die reicheren Quellen (events, premium, team, founders) gar nicht aufnehmen. Die kuratierte
// Liste ist die eine Wahrheit, damit die Galerie immer voll und vorhersehbar ist.
// Copy nach Regel 003/069/085 (simpel, du, echte Umlaute, CH-ss, keine Em-Dashes).

import type { Lang } from '@/lib/i18n';

// Vier ehrliche Alben: die Tanzabende, der Unterricht, die Menschen dahinter und die Buehnen-Shows.
export type AlbumId = 'danceflow' | 'kurse' | 'team' | 'shows';

export type GalleryAlbumMeta = {
  id: AlbumId;
  title: string;
  desc: string;
};

export type GalleryStrings = {
  hero: { eyebrow: string; titleA: string; titleAccent: string; titleB: string; lead: string };
  filterAll: string;
  albums: Record<AlbumId, GalleryAlbumMeta>;
  photoCountOne: string;
  photoCountMany: string;
  empty: string;
  lightbox: { close: string; prev: string; next: string; counter: string }; // counter: "{i} von {n}"
  closing: { title: string; titleAccent: string; body: string; cta: string };
};

export const GALLERY = {
  de: {
    hero: {
      eyebrow: 'Galerie',
      // Runde 3 (kimi-critic): "Echte Momente schlagen perfekte Posen." war eine
      // Antithese nach forbidden.md A2 (echt gegen perfekt). Ersetzt durch eine
      // Aussage, die sagt, was auf den Fotos zu sehen ist.
      titleA: 'Fotos aus unseren Kursen,',
      titleAccent: 'Abenden',
      titleB: 'und Shows.',
      lead: 'Ein Blick in unsere Kurse, Workshops, Danceflow Nights, Shows und die Salsaflow-Community in Basel.',
    },
    filterAll: 'Alle',
    albums: {
      danceflow: {
        id: 'danceflow',
        title: 'Danceflow Nights',
        desc: 'Unsere Tanzabende. Social Dancing, Live-Stimmung und volle Fläche.',
      },
      kurse: {
        id: 'kurse',
        title: 'Kurse',
        desc: 'Aus dem Studio. Wo aus ersten Schritten ein Tanz wird.',
      },
      team: {
        id: 'team',
        title: 'Team',
        desc: 'Die Crew zusammen. Gruppenfotos aus dem Studio, keine Einzelporträts.',
      },
      shows: {
        id: 'shows',
        title: 'Shows',
        desc: 'Unsere Bühnenauftritte. Choreografien, Kostüme und grosse Momente.',
      },
    },
    photoCountOne: 'Foto',
    photoCountMany: 'Fotos',
    empty: 'Für diese Auswahl gibt es aktuell keine Fotos.',
    lightbox: { close: 'Schliessen', prev: 'Vorheriges Foto', next: 'Nächstes Foto', counter: 'von' },
    closing: {
      title: 'Willst du auf dem nächsten Foto',
      titleAccent: 'mittanzen?',
      body: 'Dann starte mit einer Schnupperstunde oder komm zu einem Event.',
      cta: 'Schnupperstunde buchen',
    },
  },
  en: {
    hero: {
      eyebrow: 'Gallery',
      titleA: 'Photos from our classes,',
      titleAccent: 'nights',
      titleB: 'and shows.',
      lead: 'A look into our classes, workshops, Danceflow Nights, shows and the Salsaflow community in Basel.',
    },
    filterAll: 'All',
    albums: {
      danceflow: {
        id: 'danceflow',
        title: 'Danceflow Nights',
        desc: 'Our dance nights. Social dancing, live energy and a full floor.',
      },
      kurse: {
        id: 'kurse',
        title: 'Courses',
        desc: 'From the studio. Where first steps turn into a dance.',
      },
      team: {
        id: 'team',
        title: 'Team',
        desc: 'The crew together. Group photos from the studio, no single portraits.',
      },
      shows: {
        id: 'shows',
        title: 'Shows',
        desc: 'Our stage performances. Choreographies, costumes and big moments.',
      },
    },
    photoCountOne: 'photo',
    photoCountMany: 'photos',
    empty: 'There are currently no photos for this selection.',
    lightbox: { close: 'Close', prev: 'Previous photo', next: 'Next photo', counter: 'of' },
    closing: {
      title: 'Want to dance in the next',
      titleAccent: 'photo?',
      body: 'Then start with a trial class or come to an event.',
      cta: 'Book a trial class',
    },
  },
} satisfies Record<Lang, GalleryStrings>;

// Reihenfolge der Alben in der Galerie (bestimmt auch die Filter-Chip-Reihenfolge).
export const ALBUM_ORDER: AlbumId[] = ['danceflow', 'kurse', 'team', 'shows'];

export type GalleryPhoto = { albumId: AlbumId; src: string; alt: string; altEn?: string; width?: number; height?: number };

// Kuratierter Grundbestand, in sich geschlossen (kein Laufzeit-Manifest noetig).
// Nur echte Fotos aus public/photos/ (jeder Pfad gegen den echten Foto-Export geprueft),
// kein Duoton, keine KI-Personen, keine Logo- oder Promo-Kacheln, keine leeren Dateien.
// Vier Alben: Danceflow Nights (Party-Fotos), Kurse und Unterricht, Team als Gruppe
// (keine Einzelportraets) und Shows (Buehnenauftritte).
//
// Team-Regel (Auftrag 19.08.2026): /fotos zeigt Kontext, keine Portraets. Deshalb keine
// Freisteller aus founders/ oder team/teacher-*.webp und keine posierten Studio-Kleinposen vor
// grauem Hintergrund. Raus sind hp-06, hp-17, hp-22 und hp-27 (alle grauer Studiohintergrund,
// zwei bis vier Personen in gestellter Pose). Drin bleiben Gruppen am echten Ort: hp-03
// Posierte Wand-Gruppen (hp-03, hp-08, community-comeback-v2) sind raus. Neu dazu
// kommen Bewegungs- und Gruppenbilder aus Kurs, Buehne und Community.
// Reihenfolge ist bewusst gemischt: die Ansicht
// "Alle" zeigt Abende, Kurse und Shows im Wechsel; ein Filter zeigt nur sein Album.
// Jedes Foto hat eine echte, beschreibende Alt-Zeile (Deutsch, echte Umlaute, CH-ss).
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/11-v3.webp', alt: 'Paar tanzt mitten in der Menge bei einer Danceflow Night', altEn: 'Couple dancing in the middle of the crowd at a Danceflow Night', width: 1360, height: 2048 },
  // studio-flow-v2 und lady-style-v2 bleiben nur im Galerie-Hero, nicht nochmal im Raster
  // (Video 18.08 Punkt 3: nicht dasselbe Foto überall).
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/01-v3.webp', alt: 'Tanzpaar dreht sich eng bei einer Danceflow Night', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/01.jpg', alt: 'Tanzpaar übt einen neuen Schritt im Kurs', width: 1600, height: 1066 },
  { albumId: 'danceflow', src: '/photos/party/party-03.webp', alt: 'Tänzerin in Blau zeigt vor klatschendem Publikum', altEn: 'Dancer in blue performing for a clapping audience', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-02.webp', alt: 'Ensemble tanzt eine Choreografie in grünen Kostümen', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/02-v3.webp', alt: 'Paare tanzen dicht an dicht auf der vollen Tanzfläche', width: 2048, height: 1360 },

  { albumId: 'danceflow', src: '/photos/gallery/danceflow/03-v3.webp', alt: 'Zwei Tanzende lachen mitten im Salsa-Takt', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/02.jpg', alt: 'Zwei Lernende folgen der Anleitung im Studio', width: 1600, height: 1067 },
  { albumId: 'danceflow', src: '/photos/party/party-05.webp', alt: 'Paar übt eine Figur vor der Salsaflow-Wand', altEn: 'Couple practising a figure in front of the Salsaflow wall', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-03.webp', alt: 'Show-Nummer mit funkelnden Fransenkostümen', width: 600, height: 400 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/04.jpg', alt: 'Paar tanzt Bachata im warmen Licht des Abends', width: 1600, height: 1066 },

  { albumId: 'danceflow', src: '/photos/gallery/danceflow/05-v3.webp', alt: 'Tanzende bewegen sich zur Musik durch den Saal', width: 1360, height: 2048 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/03.jpg', alt: 'Paar arbeitet an der Haltung im Salsa-Kurs', width: 1600, height: 1066 },
  { albumId: 'danceflow', src: '/photos/party/party-09.webp', alt: 'Paar lacht beim Tanzen im warmen Abendlicht', altEn: 'Couple laughing while dancing in warm evening light', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/06.jpg', alt: 'Voller Saal an einer Danceflow Night in Basel', width: 1066, height: 1600 },

  { albumId: 'danceflow', src: '/photos/gallery/danceflow/07.jpg', alt: 'Paar in geschlossener Tanzhaltung auf der Fläche', width: 1600, height: 1067 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/04.jpg', alt: 'Gruppe übt gemeinsam die Grundschritte', width: 1600, height: 1066 },
  { albumId: 'danceflow', src: '/photos/events/event-02.jpg', alt: 'Paar tanzt vor der Salsaflow-Wand im grünen Licht', altEn: 'Couple dancing in front of the Salsaflow wall in green light', width: 2000, height: 1333 },
  { albumId: 'shows', src: '/photos/shows/show-07.webp', alt: 'Ensemble posiert am Ende der Show mit erhobenen Armen', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/08.jpg', alt: 'Gruppe tanzt ausgelassen bis in die Nacht', width: 1600, height: 1066 },

  { albumId: 'danceflow', src: '/photos/events/event-01.jpg', alt: 'Gäste tanzen Salsa bei einem Salsaflow-Abend', width: 1600, height: 1067 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/05.jpg', alt: 'Tanzpaar im Kurs bei heller Studio-Atmosphäre', width: 1600, height: 1066 },
  { albumId: 'danceflow', src: '/photos/events/event-05.jpg', alt: 'Paar tanzt auf voller Fläche im grünen Saallicht', altEn: 'Couple dancing on a full floor in green hall light', width: 1600, height: 1067 },
  { albumId: 'shows', src: '/photos/shows/show-08.webp', alt: 'Weihnachts-Show mit Santa und Tänzerin auf der Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/events/event-04.jpg', alt: 'Stimmungsvoller Abend mit vielen Tanzpaaren', width: 1600, height: 1067 },

  { albumId: 'danceflow', src: '/photos/events/event-06-v3.webp', alt: 'Menschen feiern und tanzen im warmen Saallicht', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/06.jpg', alt: 'Lehrer zeigt vorne den Schritt, die Gruppe macht mit', width: 1066, height: 1600 },
  { albumId: 'danceflow', src: '/photos/events/event-07.jpg', alt: 'Paar tanzt lachend im rosa Partylicht', altEn: 'Couple dancing and laughing in pink party light', width: 1067, height: 1600 },
  { albumId: 'shows', src: '/photos/shows/show-09.webp', alt: 'Tänzerinnen in lila Kostümen bei der Bühnenshow', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/events/event-08.jpg', alt: 'Volle Tanzfläche bei einer langen Party-Nacht', width: 1400, height: 2095 },

  { albumId: 'danceflow', src: '/photos/premium/danceflow-home-2000.webp', alt: 'Paar tanzt eng umschlungen bei gedämpftem Licht', width: 2000, height: 1334 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/07.jpg', alt: 'Paar tanzt im Kurs vor den grossen Fenstern', width: 1600, height: 1067 },
  { albumId: 'danceflow', src: '/photos/party/party-12.webp', alt: 'Frau im roten Kleid tanzt mit ihrem Partner im vollen Saal', altEn: 'Woman in a red dress dancing with her partner on a full floor', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-11.webp', alt: 'Choreografie in lila Kostümen auf dunkler Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/premium/events-hero-2000.webp', alt: 'Grosse Runde tanzt gemeinsam bei einem Salsaflow-Abend', width: 2000, height: 1125 },

  { albumId: 'danceflow', src: '/photos/party/party-01.webp', alt: 'Paar tanzt eng und lächelt im warmen Abendlicht', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-01.jpg', alt: 'Teilnehmende üben Bachata im Studio', width: 1600, height: 1067 },
  { albumId: 'danceflow', src: '/photos/party/party-16.webp', alt: 'Zwei Frauen tanzen zusammen unter Partylicht', altEn: 'Two women dancing together under party lights', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-12.webp', alt: 'Formation tanzt synchron im Bühnenlicht', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-02.webp', alt: 'Zwei Tanzende vor der Salsaflow-Wand im Studio', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-04.webp', alt: 'Paar in enger Haltung vor der Salsaflow-Kulisse', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-03.jpg', alt: 'Paar übt eine Drehung während der Lektion', width: 1600, height: 1064 },
  { albumId: 'danceflow', src: '/photos/events/event-03.jpg', alt: 'Paar tanzt eng in geschlossener Haltung', altEn: 'Couple dancing close in closed hold', width: 1600, height: 1067 },
  { albumId: 'shows', src: '/photos/shows/show-13.webp', alt: 'Auftritt beim festlichen Event mit vollem Saal', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-06-v3.webp', alt: 'Frau im roten Top tanzt mit ihrem Partner', width: 2048, height: 1360 },

  { albumId: 'danceflow', src: '/photos/party/party-07-v3.webp', alt: 'Paar streckt die Arme hoch mitten in der Drehung', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-05.jpg', alt: 'Kursgruppe tanzt konzentriert im Takt', width: 1600, height: 1065 },
  { albumId: 'danceflow', src: '/photos/party/party-18.webp', alt: 'Paar dreht unter dem Arm bei einer Danceflow Night', altEn: 'Couple turning under the arm at a Danceflow Night', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-14.webp', alt: 'Paar tanzt eine elegante Show-Figur in Weiss und Schwarz', width: 310, height: 470 },
  { albumId: 'danceflow', src: '/photos/party/party-08.webp', alt: 'Gruppe tanzt im hellen Studio zur Musik', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-10.webp', alt: 'Tanzender hält lachend ein Kind im Arm', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/premium/offer-salsa-1200.webp', alt: 'Salsa-Kurs im vollen Studio in Bewegung', width: 1200, height: 1600 },
  { albumId: 'danceflow', src: '/photos/party/party-22.webp', alt: 'Paar lacht auf der vollen Tanzfläche im Partylicht', altEn: 'Couple smiling on a packed dance floor in party light', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-16.webp', alt: 'Paare tanzen eine Show-Choreografie auf der Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-11.webp', alt: 'Paar tanzt dicht umringt von weiteren Gästen', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-13.webp', alt: 'Frau im weissen Top tanzt mit ihrem Partner', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/premium/offer-bachata-1200.webp', alt: 'Paar tanzt Bachata eng zusammen im Kurs', width: 1200, height: 1600 },
  { albumId: 'shows', src: '/photos/shows/show-17.webp', alt: 'Bühne und Saal beim grossen Abendprogramm', width: 1600, height: 1600 },
  { albumId: 'danceflow', src: '/photos/party/party-15.webp', alt: 'Paar dreht sich vor der beleuchteten Studiowand', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-17-v3.webp', alt: 'Zwei Frauen tanzen zusammen und haben Spass', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/premium/offer-heels-1200.webp', alt: 'Heels-Kurs mit ausdrucksstarker Pose', width: 1200, height: 1600 },
  { albumId: 'kurse', src: '/photos/2026/kurse-classfreude-01.webp', alt: 'Das Team führt eine volle Klasse durch die Schrittfolge', altEn: 'The team leading a full class through the step sequence', width: 1920, height: 1280 },
  { albumId: 'shows', src: '/photos/shows/show-19.webp', alt: 'Ensemble tanzt eine Nummer im grünen Bühnenlicht', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-21.webp', alt: 'Paar posiert eng vor rotem Hintergrund', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-27.webp', alt: 'Frau im roten Oberteil tanzt mit ihrem Partner', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-02.jpg', alt: 'Paar tanzt im Kurs, weitere Lernende im Hintergrund', width: 1600, height: 1067 },
  { albumId: 'shows', src: '/photos/shows/show-20.webp', alt: 'Formation in lila und grün auf der dunklen Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-28.webp', alt: 'Dichte Menge feiert gemeinsam auf der Tanzfläche', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-33.webp', alt: 'Mehrere Paare tanzen im blauen Partylicht', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-04.jpg', alt: 'Paar übt eine enge Bachata-Figur im Studio', width: 1600, height: 1067 },
  { albumId: 'shows', src: '/photos/showcase/hp-11.webp', alt: 'Die ganze Crew nach der Show zusammen auf der Bühne', altEn: 'The whole crew together on stage after the show', width: 1800, height: 1200 },
  { albumId: 'shows', src: '/photos/shows/show-21.webp', alt: 'Tänzerinnen in lila Kleidern posieren für die Show', width: 1350, height: 1800 },
  { albumId: 'danceflow', src: '/photos/party/party-34.webp', alt: 'Paar tanzt eng umschlungen im Halbdunkel', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-35-v3.webp', alt: 'Frau im geblümten Top tanzt mit ihrem Partner', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-06.jpg', alt: 'Gruppe von Tänzerinnen im Ladies-Styling-Kurs', width: 1067, height: 1600 },
  { albumId: 'kurse', src: '/photos/2026/kurse-heels-energie-01.webp', alt: 'Trainerin tanzt der Heels-Gruppe die Figur vor', altEn: 'Instructor dancing the figure for the heels group', width: 1920, height: 935 },
  { albumId: 'danceflow', src: '/photos/party/party-44.webp', alt: 'Frau streckt den Arm hoch mitten in der Drehung', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-52.webp', alt: 'Gruppe springt jubelnd mit erhobenen Armen', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-07.jpg', alt: 'Kursleiter tanzt vorne, die Gruppe macht den Schritt mit', width: 1067, height: 1600 },
  { albumId: 'danceflow', src: '/photos/2026/community-diversitaet-01.webp', alt: 'Tanzende aus dem Team und der Community mischen sich auf der Fläche', altEn: 'Dancers from the team and the community mixing on the floor', width: 1920, height: 1280 },
  { albumId: 'danceflow', src: '/photos/party/party-54.webp', alt: 'Zwei Musiker spielen Congas zur Live-Musik', width: 1500, height: 1000 },

  { albumId: 'kurse', src: '/photos/premium/offer-privat-1200.webp', alt: 'Privatstunde: Lehrerin führt einen Schüler Schritt für Schritt', width: 1200, height: 1600 },

  // Nachschub 20.08.2026 (Video-19-Soll "mehr Fotos"): weitere echte Motive aus dem
  // Foto-Export, die vorher nicht im Raster lagen. Jedes Bild vor der Aufnahme angesehen
  // (Kontaktbogen /tmp/fotocand/set1-4.png), Alt-Zeile beschreibt die echte Szene.
  // Bewusst draussen: founders/*, team/teacher-*, gallery/kurse/09.jpg (gestellte
  // Studio-Gruppe vor hellem Hintergrund = Portraet-Charakter), party-26 und party-53
  // (einzelne Person im Mittelpunkt), shows/show-04 und show-10 (reine Logo-Kacheln),
  // shows/show-05, show-06, show-18 (62x62-Platzhalter, kein echtes Foto).
  { albumId: 'danceflow', src: '/photos/party/party-14.webp', alt: 'Paar tanzt eng in der Menge, weitere Gäste rundherum', altEn: 'Couple dancing close in the crowd, more guests all around', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/08.jpg', alt: 'Kursleiter zeigt lachend die Figur, die Gruppe schaut zu', altEn: 'Instructor demonstrating the figure with a smile while the group watches', width: 1067, height: 1600 },
  { albumId: 'danceflow', src: '/photos/party/party-19.webp', alt: 'Paar tanzt eine tiefe Figur im warmen Licht des Saals', altEn: 'Couple dancing a deep figure in the warm light of the hall', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-01.webp', alt: 'Ensemble tanzt eine Reihe in grünen und lila Kostümen', altEn: 'Ensemble dancing in a line in green and purple costumes', width: 1800, height: 1139 },
  { albumId: 'danceflow', src: '/photos/party/party-24.webp', alt: 'Tanzende bewegen sich schnell vor der Salsaflow-Wand', altEn: 'Dancers moving fast in front of the Salsaflow wall', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-29.webp', alt: 'Paar tanzt nah beieinander im violetten Partylicht', altEn: 'Couple dancing close together in purple party light', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-25.webp', alt: 'Tanzende ziehen in Bewegung an der Salsaflow-Wand vorbei', altEn: 'Dancers moving past the Salsaflow wall', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-30.webp', alt: 'Paar tanzt im blauen Licht mitten unter anderen Gästen', altEn: 'Couple dancing in blue light among other guests', width: 1000, height: 1500 },
  { albumId: 'shows', src: '/photos/shows/show-15.webp', alt: 'Grosse Formation tanzt auf der Convention-Bühne', altEn: 'Large formation dancing on the convention stage', width: 1600, height: 850 },
  { albumId: 'danceflow', src: '/photos/party/party-32.webp', alt: 'Paar tanzt eng, hinter ihnen füllt sich der Saal', altEn: 'Couple dancing close while the hall fills up behind them', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-36.webp', alt: 'Gruppe tanzt dicht gedrängt am Abend im Studio', altEn: 'Group dancing tightly packed in the studio in the evening', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-37.webp', alt: 'Paar lacht sich beim Tanzen an, Gäste im Hintergrund', altEn: 'Couple smiling at each other while dancing, guests in the background', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-38.webp', alt: 'Paar tanzt im blauen Licht vor der Studiowand', altEn: 'Couple dancing in blue light in front of the studio wall', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-22.webp', alt: 'Ensemble verbeugt sich mit erhobenen Armen nach der Show', altEn: 'Ensemble bowing with raised arms after the show', width: 1000, height: 667 },
  { albumId: 'danceflow', src: '/photos/party/party-39.webp', alt: 'Zwei Paare tanzen nebeneinander im vollen Saal', altEn: 'Two couples dancing side by side in the full hall', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-40.webp', alt: 'Paar tanzt am Abend im warmen Licht des Studios', altEn: 'Couple dancing in the warm studio light in the evening', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-41.webp', alt: 'Frau lacht beim Tanzen mit ihrem Partner im blauen Licht', altEn: 'Woman laughing while dancing with her partner in blue light', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/party/party-42.webp', alt: 'Show-Gruppe tanzt eine Figur vor der Spiegelwand', altEn: 'Show group dancing a figure in front of the mirror wall', width: 1500, height: 1000 },
  { albumId: 'shows', src: '/photos/shows/show-23.webp', alt: 'Formation tanzt in dunklen Kostümen auf der Bühne', altEn: 'Formation dancing in dark costumes on stage', width: 1800, height: 1200 },
  { albumId: 'shows', src: '/photos/party/party-43.webp', alt: 'Zwei Tänzerinnen in lila Fransenkostümen bei der Show', altEn: 'Two dancers in purple fringe costumes during the show', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-45.webp', alt: 'Paar tanzt lachend im blauen Licht, Fläche gut gefüllt', altEn: 'Couple laughing while dancing in blue light on a busy floor', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-48.webp', alt: 'Paar tanzt ruhig in geschlossener Haltung im Saal', altEn: 'Couple dancing calmly in closed hold in the hall', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-49.webp', alt: 'Paar tanzt vor roter Wand und hat sichtbar Spass', altEn: 'Couple dancing in front of a red wall and clearly having fun', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-55.webp', alt: 'Paar tanzt eng umschlungen im hellen Saal', altEn: 'Couple dancing closely embraced in the bright hall', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-56.webp', alt: 'Frau tanzt mit ihrem Partner mitten in der Nacht-Menge', altEn: 'Woman dancing with her partner in the middle of the night crowd', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-57.webp', alt: 'Gruppe tanzt vor der Spiegelwand, alle in Bewegung', altEn: 'Group dancing in front of the mirror wall, everyone in motion', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-58.webp', alt: 'Paar dreht sich locker auf der Fläche im Grünlicht', altEn: 'Couple turning easily on the floor in green light', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-59.webp', alt: 'Paar tanzt im Spiegelsaal, weitere Paare dahinter', altEn: 'Couple dancing in the mirror hall with more couples behind', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-60.webp', alt: 'Tänzerin dreht sich mit fliegenden Haaren im Takt', altEn: 'Dancer turning with flying hair to the beat', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/party/party-61.webp', alt: 'Paar tanzt lachend Hand in Hand auf der vollen Fläche', altEn: 'Couple dancing hand in hand and laughing on the full floor', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-62.webp', alt: 'Paar tanzt entspannt am Rand der Tanzfläche', altEn: 'Couple dancing relaxed at the edge of the dance floor', width: 1500, height: 1000 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/10-v3.webp', alt: 'Voller Saal tanzt gemeinsam bei einer Danceflow Night', altEn: 'A full hall dancing together at a Danceflow Night', width: 2048, height: 1360 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/12-v3.webp', alt: 'Paare tanzen im warmen Licht durch den ganzen Saal', altEn: 'Couples dancing through the whole hall in warm light', width: 2048, height: 1360 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/09-v2.jpg', alt: 'Tanzende füllen die Fläche bis in den hinteren Teil', altEn: 'Dancers filling the floor all the way to the back', width: 1066, height: 1600 },
  { albumId: 'danceflow', src: '/photos/events/event-06.jpg', alt: 'Gäste tanzen ausgelassen bei einem Salsaflow-Event', altEn: 'Guests dancing exuberantly at a Salsaflow event', width: 1600, height: 1067 },

  { albumId: 'danceflow', src: '/photos/events/event-09.jpg', alt: 'Hochformat vom Abend: viele Paare auf der Tanzfläche', altEn: 'Portrait shot of the evening: many couples on the dance floor', width: 1400, height: 2095 },
  { albumId: 'danceflow', src: '/photos/2026/event-party-dreh-01.webp', alt: 'Paar dreht sich schwungvoll bei einer Party im Studio', altEn: 'Couple turning with momentum at a party in the studio', width: 1920, height: 1280 },
  { albumId: 'danceflow', src: '/photos/2026/event-social-couple-01.webp', alt: 'Paar tanzt beim Social entspannt miteinander', altEn: 'Couple dancing relaxed together at the social', width: 1920, height: 1280 },
  { albumId: 'danceflow', src: '/photos/2026/event-social-couple-02.webp', alt: 'Paar tanzt Bachata im blauen Licht des Abends', altEn: 'Couple dancing bachata in the blue light of the evening', width: 1366, height: 2048 },
  { albumId: 'danceflow', src: '/photos/2026/event-venue-wide-01.webp', alt: 'Blick über den ganzen Saal mit tanzender Menge', altEn: 'View across the whole hall with a dancing crowd', width: 1920, height: 1253 },
];
