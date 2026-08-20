// Echte Google-Bewertungen (Harvest 2026-07-07).
// Quelle: assets/harvest-2026-07-07/google-reviews/REVIEWS.md (direkt von Google Maps gezogen,
// Original-Sprache). v2-Direktive Raphael 2026-07-07: die ECHTEN Reviews prominent auf der
// Startseite zeigen (Wall of Love), keine erfundenen Zitate mehr. Das ueberschreibt den alten
// Vermerk in home/content.ts ("keine Sterne-Zahlen") - wir haben jetzt die echten Zahlen.
//
// Gesamt: 4.9 von 5 aus 104 Bewertungen (100x 5*, 2x 4*, 2x 1*). 72 davon mit Text.
// Die Texte unten sind echte Auszuege (gekuerzt, nie umgeschrieben oder erfunden).
// Sichtbarer Text traegt echte Umlaute (ä/ö/ü) und CH-ss (kein ß).

import type { Lang } from '@/lib/i18n';

export const GOOGLE_REVIEWS = {
  rating: 4.9,
  count: 104,
  // Echte Google-Maps-Place-URL (Harvest reviews-raw.json -> placeUrl).
  url: 'https://www.google.com/maps/place/Salsaflow+Dance+Company+GmbH/@47.548917,7.5895042,17z/data=!4m8!3m7!1s0x4791b9bbe6210ca7:0xe24471415832cb62',
};

export type Review = {
  name: string;
  stars: number;
  when: string; // relativ, DE
  aspect: string; // kurzer Themen-Tag
  text: string; // echter, gekuerzter Auszug
  lang: 'de' | 'en';
};

// Kuratierte 12 fuer die Wall of Love. Bewusst breit gestreut: Anfaenger, Community, Coaches,
// Partys, Privatstunden, faire Preise, ohne Partner, neu in Basel. Mix DE/EN wie im Original.
export const WALL_REVIEWS: Review[] = [
  {
    name: 'Deliu',
    stars: 5,
    when: 'vor 1 Jahr',
    aspect: 'Anfänger',
    lang: 'en',
    text: 'The teachers are absolutely fantastic, and the atmosphere is always welcoming and fun. I truly feel that my dancing has improved significantly, and I am already looking forward to the next course!',
  },
  {
    name: 'Sarah',
    stars: 5,
    when: 'vor 2 Jahren',
    aspect: 'Community',
    lang: 'de',
    text: 'Man wird hier sehr herzlich aufgenommen und hat sofort das Gefühl, Teil der Salsaflow-Family zu sein. Die Lehrer:innen geben jedem individuelle Rückmeldung, sodass man sich wirklich verbessern kann.',
  },
  {
    name: 'Marco',
    stars: 5,
    when: 'vor 1 Jahr',
    aspect: 'Bachata',
    lang: 'de',
    text: 'Hervorragende und sympathische Lehrer. Sie zeigen geduldig die Figuren vor und lassen die Schüler genug üben. Von allen Schulen, die ich besucht habe, klar die Beste.',
  },
  {
    name: 'Nicola',
    stars: 5,
    when: 'vor 2 Monaten',
    aspect: 'Hochzeitstanz',
    lang: 'de',
    text: 'Wir haben für unseren Hochzeitstanz Privatstunden gebucht. Claudia und Fabio waren hammer und haben alles einfach erklärt. Sie haben für uns extra unseren Song geschnitten und eine Choreo erstellt.',
  },
  {
    name: 'Linda',
    stars: 5,
    when: 'vor 2 Jahren',
    aspect: 'Flexibel',
    lang: 'de',
    text: 'Die erste Tanzschule, die so hochflexibel und sehr gut organisiert ist. Auch ohne Anmeldung mit Tanzpartner ist immer jemand vor Ort. Claudia und Fabio unterrichten mit viel Herzblut.',
  },
  {
    name: 'Larissa',
    stars: 5,
    when: 'vor 3 Jahren',
    aspect: 'Faire Preise',
    lang: 'de',
    text: 'Die Preise sind mega fair, und auch die Tanzparty alle 2 Wochen ist zum Üben prima. Auf verschiedene Sprachen wird Rücksicht genommen. Ich freue mich jede Woche auf den Kurs!',
  },
  {
    name: 'Sofia',
    stars: 5,
    when: 'vor 6 Monaten',
    aspect: 'Danceflow',
    lang: 'de',
    text: 'Die Tanzlehrer:innen achten sehr auf Details, sodass ich mich wirklich verbessere. Auch die Einzellektionen haben mich in Bachata sehr vorangebracht. Die Danceflow Night war immer spektakulär.',
  },
  {
    name: 'Irma',
    stars: 5,
    when: 'vor 1 Jahr',
    aspect: 'Ohne Partner',
    lang: 'de',
    text: 'Man kann sich einzeln anmelden und muss nicht lange nach einem Partner suchen. Alle 14 Tage Freitagsparty, an der geübt werden kann. Die Kursleitung gibt klare Anleitung und lässt uns genug üben.',
  },
  {
    name: 'Rahel',
    stars: 5,
    when: 'vor 1 Jahr',
    aspect: 'Partys',
    lang: 'de',
    text: 'Alle Lehrer:innen sind sehr sympathisch, geduldig und kompetent. Die Tanzabende, die das Salsaflow-Team organisiert, sind sehr lustig und entspannt. Für mich sind das die besten Abende.',
  },
  {
    name: 'Marta',
    stars: 5,
    when: 'vor 3 Jahren',
    aspect: 'Neu in Basel',
    lang: 'en',
    text: 'The teachers are so nice and really know how to make the classes engaging and enjoyable. A great way to meet new people, have a good time, and learn how to dance with no pressure.',
  },
  {
    name: 'Solange',
    stars: 5,
    when: 'vor 2 Jahren',
    // Der Tag hiess "Beste in Basel". Die Zitate sind Fremdaussagen und duerfen so klingen,
    // der Tag aber ist redaktionell vergeben — damit behauptete Salsaflow im eigenen Namen,
    // die Beste zu sein. Das Kunden-Onboarding verbietet unter "niemals" ausdruecklich
    // "uebertriebene Werbesprueche oder Superlative" und "namentliche Vergleiche mit anderen
    // Tanzschulen". Der neue Tag zitiert dasselbe Review, ohne zu vergleichen.
    aspect: 'Wie eine Familie',
    lang: 'de',
    text: 'Salsaflow ist die beste Tanzschule in Basel. Der Unterricht macht Spass und man lernt gleichzeitig viel und schnell. Man fühlt sich einfach gut aufgehoben, wie in einer grossen Familie.',
  },
  {
    name: 'Anja',
    stars: 5,
    when: 'vor 1 Jahr',
    aspect: 'Persönlich',
    lang: 'de',
    text: 'Beste Tanzschule in Basel! Nicht zu gross, super persönliche Betreuung und die nettesten, witzigsten Lehrer!',
  },
];

// Die Originalauszuege oben bleiben unveraendert als Quellenwahrheit. Fuer den sichtbaren
// Sprachwechsel liegen hier sinngenaue, nicht werblich erweiterte Uebersetzungen.
type LocalizedReviewLookup = Record<string, Record<Lang, string>>;

function defineLocalizedReviewLookup(
  lookup: LocalizedReviewLookup,
): LocalizedReviewLookup {
  return lookup;
}

const REVIEW_TEXT = defineLocalizedReviewLookup({
  Deliu: {
    de: 'Die Lehrpersonen sind fantastisch und die Atmosphäre ist immer herzlich und voller Freude. Ich merke deutlich, wie sehr sich mein Tanzen verbessert hat, und freue mich schon auf den nächsten Kurs.',
    en: 'The teachers are absolutely fantastic, and the atmosphere is always welcoming and fun. I truly feel that my dancing has improved significantly, and I am already looking forward to the next course!',
  },
  Sarah: {
    de: 'Man wird hier sehr herzlich aufgenommen und hat sofort das Gefühl, Teil der Salsaflow-Family zu sein. Die Lehrer:innen geben jedem individuelle Rückmeldung, sodass man sich wirklich verbessern kann.',
    en: 'You receive such a warm welcome and immediately feel part of the Salsaflow family. The teachers give everyone individual feedback, so you can genuinely improve.',
  },
  Marco: {
    de: 'Hervorragende und sympathische Lehrer. Sie zeigen geduldig die Figuren vor und lassen die Schüler genug üben. Von allen Schulen, die ich besucht habe, klar die Beste.',
    en: 'Excellent and likeable teachers. They demonstrate the figures patiently and give students enough time to practise. Clearly the best of all the schools I have visited.',
  },
  Nicola: {
    de: 'Wir haben für unseren Hochzeitstanz Privatstunden gebucht. Claudia und Fabio waren hammer und haben alles einfach erklärt. Sie haben für uns extra unseren Song geschnitten und eine Choreo erstellt.',
    en: 'We booked private lessons for our wedding dance. Claudia and Fabio were amazing and explained everything simply. They even edited our song and created a choreography for us.',
  },
  Linda: {
    de: 'Die erste Tanzschule, die so hochflexibel und sehr gut organisiert ist. Auch ohne Anmeldung mit Tanzpartner ist immer jemand vor Ort. Claudia und Fabio unterrichten mit viel Herzblut.',
    en: 'The first dance school I have found that is this flexible and well organised. Even if you register without a partner, someone is always there. Claudia and Fabio teach with real passion.',
  },
  Larissa: {
    de: 'Die Preise sind mega fair, und auch die Tanzparty alle 2 Wochen ist zum Üben prima. Auf verschiedene Sprachen wird Rücksicht genommen. Ich freue mich jede Woche auf den Kurs!',
    en: 'The prices are very fair, and the dance party every two weeks is great for practising. Different languages are taken into account. I look forward to class every week!',
  },
  Sofia: {
    de: 'Die Tanzlehrer:innen achten sehr auf Details, sodass ich mich wirklich verbessere. Auch die Einzellektionen haben mich in Bachata sehr vorangebracht. Die Danceflow Night war immer spektakulär.',
    en: 'The dance teachers pay close attention to detail, so I genuinely improve. The private lessons also moved my Bachata forward a lot. The Danceflow Night was always spectacular.',
  },
  Irma: {
    de: 'Man kann sich einzeln anmelden und muss nicht lange nach einem Partner suchen. Alle 14 Tage Freitagsparty, an der geübt werden kann. Die Kursleitung gibt klare Anleitung und lässt uns genug üben.',
    en: 'You can register on your own and do not have to search for a partner. There is a Friday party every two weeks where you can practise. The teachers give clear guidance and enough time to train.',
  },
  Rahel: {
    de: 'Alle Lehrer:innen sind sehr sympathisch, geduldig und kompetent. Die Tanzabende, die das Salsaflow-Team organisiert, sind sehr lustig und entspannt. Für mich sind das die besten Abende.',
    en: 'All the teachers are very friendly, patient and skilled. The dance evenings organised by the Salsaflow team are fun and relaxed. For me, they are the best evenings.',
  },
  Marta: {
    de: 'Die Lehrpersonen sind sehr herzlich und wissen genau, wie sie die Kurse spannend und unterhaltsam machen. Eine tolle Möglichkeit, neue Leute kennenzulernen, Spass zu haben und ohne Druck tanzen zu lernen.',
    en: 'The teachers are so nice and really know how to make the classes engaging and enjoyable. A great way to meet new people, have a good time, and learn how to dance with no pressure.',
  },
  Solange: {
    de: 'Salsaflow ist die beste Tanzschule in Basel. Der Unterricht macht Spass und man lernt gleichzeitig viel und schnell. Man fühlt sich einfach gut aufgehoben, wie in einer grossen Familie.',
    en: 'Salsaflow is the best dance school in Basel. Classes are fun while you learn a lot, quickly. You simply feel well looked after, like part of a big family.',
  },
  Anja: {
    de: 'Beste Tanzschule in Basel! Nicht zu gross, super persönliche Betreuung und die nettesten, witzigsten Lehrer!',
    en: 'Best dance school in Basel! Not too big, very personal support and the nicest, funniest teachers!',
  },
});

const REVIEW_ASPECT = defineLocalizedReviewLookup({
  Anfänger: { de: 'Anfänger', en: 'Beginner' },
  Community: { de: 'Community', en: 'Community' },
  Bachata: { de: 'Bachata', en: 'Bachata' },
  Hochzeitstanz: { de: 'Hochzeitstanz', en: 'Wedding dance' },
  Flexibel: { de: 'Flexibel', en: 'Flexible' },
  'Faire Preise': { de: 'Faire Preise', en: 'Fair prices' },
  Danceflow: { de: 'Danceflow', en: 'Danceflow' },
  'Ohne Partner': { de: 'Ohne Partner', en: 'No partner' },
  Partys: { de: 'Partys', en: 'Parties' },
  'Neu in Basel': { de: 'Neu in Basel', en: 'New in Basel' },
  'Wie eine Familie': { de: 'Wie eine Familie', en: 'Like a family' },
  Persönlich: { de: 'Persönlich', en: 'Personal' },
});

const REVIEW_WHEN = defineLocalizedReviewLookup({
  'vor 2 Monaten': { de: 'vor 2 Monaten', en: '2 months ago' },
  'vor 6 Monaten': { de: 'vor 6 Monaten', en: '6 months ago' },
  'vor 1 Jahr': { de: 'vor 1 Jahr', en: '1 year ago' },
  'vor 2 Jahren': { de: 'vor 2 Jahren', en: '2 years ago' },
  'vor 3 Jahren': { de: 'vor 3 Jahren', en: '3 years ago' },
});

export function localizeReview(review: Review, lang: Lang) {
  return {
    text: REVIEW_TEXT[review.name]?.[lang] ?? review.text,
    aspect: REVIEW_ASPECT[review.aspect]?.[lang] ?? review.aspect,
    when: REVIEW_WHEN[review.when]?.[lang] ?? review.when,
  };
}
