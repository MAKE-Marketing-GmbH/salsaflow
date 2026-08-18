// Die EINE Quelle für die Instagram-Sektion auf der Startseite und auf /fotos.
//
// Warum diese Datei existiert
// ---------------------------
// Vorher standen die drei Shortcodes als Literale mitten in InstagramShowcase.tsx.
// Wer den Feed aktualisieren wollte, musste eine Layout-Komponente anfassen. Jetzt liest
// die UI nur noch `getInstagramFeed()`. In der Komponente steht kein Shortcode mehr.
//
// So aktualisierst du die Liste (2 Wege)
// --------------------------------------
// 1. Automatisch, best effort:
//      node scripts/refresh-instagram-feed.mjs
//    Das Skript holt https://www.instagram.com/salsaflowdc/, zieht die Shortcodes und
//    schreibt NUR den Datenblock unten (zwischen den beiden BEGIN/END-Markern) neu.
//    Instagram sperrt Server-Abrufe oft aus (302 auf /accounts/login, 429). Dann bricht
//    das Skript mit einer klaren Meldung ab und ändert nichts. Das ist kein Fehler im
//    Skript, sondern Instagrams Login-Wand.
// 2. Von Hand, immer verlässlich:
//    Öffne https://www.instagram.com/salsaflowdc/ im Browser. Nimm die neuesten Reels.
//    Der Shortcode ist das Stück in der URL: instagram.com/reel/<SHORTCODE>/
//    Trage ihn unten ein, neueste Reel zuerst. Titel selbst schreiben (siehe unten).
//
// Titel schreibt immer ein Mensch
// -------------------------------
// Instagram liefert die Caption nicht im HTML des Embeds aus (geprüft am 14.08.2026:
// /embed/captioned/ antwortet mit 200, aber der Text steht erst nach dem JS-Start da).
// Der Titel ist deshalb redaktionell. Er ist gleichzeitig der Text, den Google und die
// KI-Suche sehen. DESIGN.md Zeile 113 verlangt vollen Text im HTML. Kurz halten,
// beschreiben was zu sehen ist, kein Werbe-Ton.
//
// Später auf Behold oder die Graph API wechseln
// ---------------------------------------------
// Nur diese Datei tauschen. `getInstagramFeed()` darf ein Promise zurückgeben, die UI
// kann beides. Beim Wechsel: Fetch auf den Anbieter legen, Antwort auf `FeedPost`
// mappen, und die Liste unten als Startwert/Fallback behalten. Sonst steht die
// Sektion leer im Prerender und der SEO-Text ist weg.

/** Ein Beitrag im Feed. `titel` ist sichtbarer Text, kein Alt-Attribut. */
export type FeedPost = {
  /** Das Stück aus der URL: instagram.com/reel/<shortcode>/ */
  shortcode: string;
  /** Volle Permalink-URL. Ziel für den Direkt-Link und Basis für das Embed. */
  url: string;
  /** Redaktioneller Titel, deutsch. Steht sichtbar auf der Karte und im HTML. */
  titel: string;
  /** Englische Fassung desselben Titels. */
  titelEn: string;
  type: 'reel' | 'post';
  /** Standbild aus /public. Ohne Poster zeigt die Karte eine ruhige Fläche. */
  poster?: string;
  posterWidth?: number;
  posterHeight?: number;
};

/**
 * Stand des Datenblocks. Setzt das Refresh-Skript mit.
 * Quelle "redaktion" = von Hand gepflegt, "profil-abruf" = vom Skript geholt.
 */
export const FEED_STAND = { datum: '2026-08-14', quelle: 'redaktion' as 'redaktion' | 'profil-abruf' };

// --- BEGIN INSTAGRAM-FEED-DATEN (refresh-instagram-feed.mjs schreibt ab hier) ---
const FEED: FeedPost[] = [
  {
    shortcode: 'DX-Cz9MNkG_',
    url: 'https://www.instagram.com/reel/DX-Cz9MNkG_/',
    titel: 'Anniversary Weekend 2026',
    titelEn: 'Anniversary Weekend 2026',
    type: 'reel',
    poster: '/photos/instagram/anniversary-recap-v2.webp',
    posterWidth: 1080,
    posterHeight: 1916,
  },
  {
    shortcode: 'DahpxEVtWvm',
    url: 'https://www.instagram.com/reel/DahpxEVtWvm/',
    titel: 'Choreografie von Salsaflow',
    titelEn: 'Salsaflow choreography',
    type: 'reel',
    poster: '/photos/instagram/choreography-v2.webp',
    posterWidth: 640,
    posterHeight: 1136,
  },
  {
    shortcode: 'DYhKD7ONhfK',
    url: 'https://www.instagram.com/reel/DYhKD7ONhfK/',
    titel: 'Body Movement und Lady Style',
    titelEn: 'Body Movement and Lady Style',
    type: 'reel',
    poster: '/photos/instagram/lady-style-v2.webp',
    posterWidth: 640,
    posterHeight: 1136,
  },
];
// --- END INSTAGRAM-FEED-DATEN ---

/**
 * Der Feed für die UI. Neueste zuerst.
 *
 * Synchron, damit die Sektion beim Prerender schon Text hat. Ein späterer Anbieter darf
 * hier ein Promise zurückgeben; die Komponente behandelt beide Fälle.
 */
export function getInstagramFeed(): FeedPost[] {
  return FEED;
}
