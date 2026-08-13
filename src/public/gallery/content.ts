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

export const GALLERY: Record<Lang, GalleryStrings> = {
  de: {
    hero: {
      eyebrow: 'Galerie',
      titleA: 'Echte Momente',
      titleAccent: 'schlagen',
      titleB: 'perfekte Posen.',
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
        desc: 'Die Menschen hinter Salsaflow. Gründer, Lehrer und die ganze Crew.',
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
      titleA: 'Real moments',
      titleAccent: 'beat',
      titleB: 'perfect poses.',
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
        desc: 'The people behind Salsaflow. Founders, teachers and the whole crew.',
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
};

// Reihenfolge der Alben in der Galerie (bestimmt auch die Filter-Chip-Reihenfolge).
export const ALBUM_ORDER: AlbumId[] = ['danceflow', 'kurse', 'team', 'shows'];

export type GalleryPhoto = { albumId: AlbumId; src: string; alt: string; altEn?: string; width?: number; height?: number };

// Kuratierter Grundbestand, in sich geschlossen (kein Laufzeit-Manifest noetig).
// Nur echte Fotos aus public/photos/ (jeder Pfad gegen den echten Foto-Export geprueft),
// kein Duoton, keine KI-Personen, keine Logo- oder Promo-Kacheln, keine leeren Dateien.
// Vier Alben: Danceflow Nights (Party-Fotos), Kurse und Unterricht, Unser Team (Gruender,
// Lehrer, Crew) und Shows (Buehnenauftritte). Reihenfolge ist bewusst gemischt: die Ansicht
// "Alle" zeigt sofort Abende, Kurse, Team und Shows im Wechsel; ein Filter zeigt nur sein Album.
// Jedes Foto hat eine echte, beschreibende Alt-Zeile (Deutsch, echte Umlaute, CH-ss).
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { albumId: 'danceflow', src: '/photos/instagram/anniversary-recap-v2.webp', alt: 'Tänzerinnen und Tänzer feiern das Salsaflow Anniversary Weekend', altEn: 'Dancers celebrating the Salsaflow Anniversary Weekend', width: 1080, height: 1916 },
  { albumId: 'kurse', src: '/photos/instagram/studio-flow-v2.webp', alt: 'Gruppe tanzt gemeinsam im hellen Salsaflow-Studio', altEn: 'Group dancing together in the bright Salsaflow studio', width: 1080, height: 1916 },
  { albumId: 'team', src: '/photos/instagram/community-comeback-v2.webp', alt: 'Die Salsaflow-Community gemeinsam vor der Studiowand', altEn: 'The Salsaflow community together in front of the studio wall', width: 1080, height: 725 },
  { albumId: 'kurse', src: '/photos/instagram/lady-style-v2.webp', alt: 'Lady-Style-Gruppe bei einer Choreografie im Studio', altEn: 'Lady Style group performing choreography in the studio', width: 640, height: 1136 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/01-v3.webp', alt: 'Tanzpaar dreht sich eng bei einer Danceflow Night', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/01.jpg', alt: 'Tanzpaar übt einen neuen Schritt im Kurs', width: 1600, height: 1066 },
  { albumId: 'team', src: '/photos/founders/fabio.webp', alt: 'Fabio Branco, Mitgründer von Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-02.webp', alt: 'Ensemble tanzt eine Choreografie in grünen Kostümen', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/02-v3.webp', alt: 'Paare tanzen dicht an dicht auf der vollen Tanzfläche', width: 2048, height: 1360 },

  { albumId: 'danceflow', src: '/photos/gallery/danceflow/03-v3.webp', alt: 'Zwei Tanzende lachen mitten im Salsa-Takt', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/02.jpg', alt: 'Zwei Lernende folgen der Anleitung im Studio', width: 1600, height: 1067 },
  { albumId: 'team', src: '/photos/founders/claudia.webp', alt: 'Claudia Branco, Mitgründerin von Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-03.webp', alt: 'Show-Nummer mit funkelnden Fransenkostümen', width: 600, height: 400 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/04.jpg', alt: 'Paar tanzt Bachata im warmen Licht des Abends', width: 1600, height: 1066 },

  { albumId: 'danceflow', src: '/photos/gallery/danceflow/05-v3.webp', alt: 'Tanzende bewegen sich zur Musik durch den Saal', width: 1360, height: 2048 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/03.jpg', alt: 'Paar arbeitet an der Haltung im Salsa-Kurs', width: 1600, height: 1066 },
  { albumId: 'team', src: '/photos/founders/sebastian.webp', alt: 'Sebastian Carballo, Mitgründer von Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-04.webp', alt: 'Gruppe tanzt eine Choreografie auf der Bühne', width: 1000, height: 667 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/06.jpg', alt: 'Voller Saal an einer Danceflow Night in Basel', width: 1066, height: 1600 },

  { albumId: 'danceflow', src: '/photos/gallery/danceflow/07.jpg', alt: 'Paar in geschlossener Tanzhaltung auf der Fläche', width: 1600, height: 1067 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/04.jpg', alt: 'Gruppe übt gemeinsam die Grundschritte', width: 1600, height: 1066 },
  { albumId: 'team', src: '/photos/founders/vanessa.webp', alt: 'Vanessa Costante, Mitgründerin von Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-07.webp', alt: 'Ensemble posiert am Ende der Show mit erhobenen Armen', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/gallery/danceflow/08.jpg', alt: 'Gruppe tanzt ausgelassen bis in die Nacht', width: 1600, height: 1066 },

  { albumId: 'danceflow', src: '/photos/events/event-01.jpg', alt: 'Gäste tanzen Salsa bei einem Salsaflow-Abend', width: 1600, height: 1067 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/05.jpg', alt: 'Tanzpaar im Kurs bei heller Studio-Atmosphäre', width: 1600, height: 1066 },
  { albumId: 'team', src: '/photos/team/teacher-aleksandra.webp', alt: 'Aleksandra, Tanzlehrerin bei Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-08.webp', alt: 'Weihnachts-Show mit Santa und Tänzerin auf der Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/events/event-04.jpg', alt: 'Stimmungsvoller Abend mit vielen Tanzpaaren', width: 1600, height: 1067 },

  { albumId: 'danceflow', src: '/photos/events/event-06-v3.webp', alt: 'Menschen feiern und tanzen im warmen Saallicht', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/06.jpg', alt: 'Lehrer zeigt vorne den Schritt, die Gruppe macht mit', width: 1066, height: 1600 },
  { albumId: 'team', src: '/photos/team/teacher-anina.webp', alt: 'Anina, Tanzlehrerin bei Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-09.webp', alt: 'Tänzerinnen in lila Kostümen bei der Bühnenshow', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/events/event-08.jpg', alt: 'Volle Tanzfläche bei einer langen Party-Nacht', width: 1400, height: 2095 },

  { albumId: 'danceflow', src: '/photos/premium/danceflow-home-2000.webp', alt: 'Paar tanzt eng umschlungen bei gedämpftem Licht', width: 2000, height: 1334 },
  { albumId: 'kurse', src: '/photos/gallery/kurse/07.jpg', alt: 'Paar tanzt im Kurs vor den grossen Fenstern', width: 1600, height: 1067 },
  { albumId: 'team', src: '/photos/team/teacher-jelena.webp', alt: 'Jelena, Tanzlehrerin bei Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-11.webp', alt: 'Choreografie in lila Kostümen auf dunkler Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/premium/events-hero-2000.webp', alt: 'Grosse Runde tanzt gemeinsam bei einem Salsaflow-Abend', width: 2000, height: 1125 },

  { albumId: 'danceflow', src: '/photos/party/party-01.webp', alt: 'Paar tanzt eng und lächelt im warmen Abendlicht', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-01.jpg', alt: 'Teilnehmende üben Bachata im Studio', width: 1600, height: 1067 },
  { albumId: 'team', src: '/photos/team/teacher-maarten.webp', alt: 'Maarten, Tanzlehrer bei Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-12.webp', alt: 'Formation tanzt synchron im Bühnenlicht', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-02.webp', alt: 'Zwei Tanzende vor der Salsaflow-Wand im Studio', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-04.webp', alt: 'Paar in enger Haltung vor der Salsaflow-Kulisse', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-03.jpg', alt: 'Paar übt eine Drehung während der Lektion', width: 1600, height: 1064 },
  { albumId: 'team', src: '/photos/team/teacher-tobias.webp', alt: 'Tobias, Tanzlehrer bei Salsaflow', width: 1000, height: 1414 },
  { albumId: 'shows', src: '/photos/shows/show-13.webp', alt: 'Auftritt beim festlichen Event mit vollem Saal', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-06-v3.webp', alt: 'Frau im roten Top tanzt mit ihrem Partner', width: 2048, height: 1360 },

  { albumId: 'danceflow', src: '/photos/party/party-07-v3.webp', alt: 'Paar streckt die Arme hoch mitten in der Drehung', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-05.jpg', alt: 'Kursgruppe tanzt konzentriert im Takt', width: 1600, height: 1065 },
  { albumId: 'team', src: '/photos/team/team-01.jpg', alt: 'Das Salsaflow-Team zusammen im Studio', width: 1103, height: 1560 },
  { albumId: 'shows', src: '/photos/shows/show-14.webp', alt: 'Paar tanzt eine elegante Show-Figur in Weiss und Schwarz', width: 310, height: 470 },
  { albumId: 'danceflow', src: '/photos/party/party-08.webp', alt: 'Gruppe tanzt im hellen Studio zur Musik', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-10.webp', alt: 'Tanzender hält lachend ein Kind im Arm', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/premium/offer-salsa-1200.webp', alt: 'Salsa-Kurs im vollen Studio in Bewegung', width: 1200, height: 1600 },
  { albumId: 'team', src: '/photos/team/team-03.jpg', alt: 'Ein Teil der Crew posiert gut gelaunt', width: 1103, height: 1560 },
  { albumId: 'shows', src: '/photos/shows/show-16.webp', alt: 'Paare tanzen eine Show-Choreografie auf der Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-11.webp', alt: 'Paar tanzt dicht umringt von weiteren Gästen', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-13.webp', alt: 'Frau im weissen Top tanzt mit ihrem Partner', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/premium/offer-bachata-1200.webp', alt: 'Paar tanzt Bachata eng zusammen im Kurs', width: 1200, height: 1600 },
  { albumId: 'team', src: '/photos/showcase/hp-03.webp', alt: 'Das ganze Team vor der Salsaflow-Wand im Studio', width: 1800, height: 1115 },
  { albumId: 'shows', src: '/photos/shows/show-17.webp', alt: 'Bühne und Saal beim grossen Abendprogramm', width: 1600, height: 1600 },
  { albumId: 'danceflow', src: '/photos/party/party-15.webp', alt: 'Paar dreht sich vor der beleuchteten Studiowand', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-17-v3.webp', alt: 'Zwei Frauen tanzen zusammen und haben Spass', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/premium/offer-heels-1200.webp', alt: 'Heels-Kurs mit ausdrucksstarker Pose', width: 1200, height: 1600 },
  { albumId: 'team', src: '/photos/showcase/hp-06.webp', alt: 'Fünf aus dem Team posieren im hellen Studio', width: 1200, height: 1800 },
  { albumId: 'shows', src: '/photos/shows/show-19.webp', alt: 'Ensemble tanzt eine Nummer im grünen Bühnenlicht', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-21.webp', alt: 'Paar posiert eng vor rotem Hintergrund', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-27.webp', alt: 'Frau im roten Oberteil tanzt mit ihrem Partner', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-02.jpg', alt: 'Paar tanzt im Kurs, weitere Lernende im Hintergrund', width: 1600, height: 1067 },
  { albumId: 'team', src: '/photos/showcase/hp-08.webp', alt: 'Die Crew posiert gemeinsam für ein Gruppenbild', width: 1200, height: 1800 },
  { albumId: 'shows', src: '/photos/shows/show-20.webp', alt: 'Formation in lila und grün auf der dunklen Bühne', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-28.webp', alt: 'Dichte Menge feiert gemeinsam auf der Tanzfläche', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-33.webp', alt: 'Mehrere Paare tanzen im blauen Partylicht', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-04.jpg', alt: 'Paar übt eine enge Bachata-Figur im Studio', width: 1600, height: 1067 },
  { albumId: 'team', src: '/photos/showcase/hp-17.webp', alt: 'Zwei Tanzpaare des Teams posieren gut gelaunt', width: 1314, height: 1800 },
  { albumId: 'shows', src: '/photos/shows/show-21.webp', alt: 'Tänzerinnen in lila Kleidern posieren für die Show', width: 1350, height: 1800 },
  { albumId: 'danceflow', src: '/photos/party/party-34.webp', alt: 'Paar tanzt eng umschlungen im Halbdunkel', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-35-v3.webp', alt: 'Frau im geblümten Top tanzt mit ihrem Partner', width: 2048, height: 1360 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-06.jpg', alt: 'Gruppe von Tänzerinnen im Ladies-Styling-Kurs', width: 1067, height: 1600 },
  { albumId: 'team', src: '/photos/showcase/hp-22.webp', alt: 'Zwei Tänzerinnen des Teams im Studioportrait', width: 1200, height: 1800 },
  { albumId: 'danceflow', src: '/photos/party/party-44.webp', alt: 'Frau streckt den Arm hoch mitten in der Drehung', width: 1500, height: 1000 },

  { albumId: 'danceflow', src: '/photos/party/party-52.webp', alt: 'Gruppe springt jubelnd mit erhobenen Armen', width: 1500, height: 1000 },
  { albumId: 'kurse', src: '/photos/kurse/kurs-07.jpg', alt: 'Kursleiter tanzt vorne, die Gruppe macht den Schritt mit', width: 1067, height: 1600 },
  { albumId: 'team', src: '/photos/showcase/hp-27.webp', alt: 'Vier aus dem Team sitzen entspannt zusammen', width: 1800, height: 1200 },
  { albumId: 'danceflow', src: '/photos/party/party-54.webp', alt: 'Zwei Musiker spielen Congas zur Live-Musik', width: 1500, height: 1000 },

  { albumId: 'kurse', src: '/photos/premium/offer-privat-1200.webp', alt: 'Privatstunde: Lehrerin führt einen Schüler Schritt für Schritt', width: 1200, height: 1600 },
];
