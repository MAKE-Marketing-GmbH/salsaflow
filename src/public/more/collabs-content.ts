// Inhalt der Collabs-Seite (/mehr/collabs) aus dem V3-Copyplan (pages/21_mehr__collabs.md).
// Zweisprachig DE/EN. de = Plan-Wortlaut, en = treu uebersetzt. Echte Umlaute, CH-ss, keine
// Em-Dashes. Ruhige Seite (Plan: darf nicht wichtiger wirken als Kursplan/Kontakt).
//
// Fakten nur gesichert (Brief): seit 2018, 3 Studios am Bahnhof Basel SBB, ~40 Kurse pro Woche.
// Partner-Shop = verifizierter 2332dancewear-Salsaflow-Collab (COLLAB_URL, sitewide genutzt).
// Der Plan nennt "Dancing Queens" nur bedingt und ohne URL, darum bleibt der reale, bestaetigte
// Partner. Meta-Anweisungen des Plans ("sollte die Karte erklaeren") sind zu echter Karten-Copy
// verdichtet, die substanziellen Saetze bleiben woertlich.

import type { Lang } from '@/lib/i18n';
import type { Faq, Crumb } from '@/public/subpage/kit';
import { COLLAB_URL } from '@/public/contact/content';

type Cta = { label: string; href: string };
type Img = { src: string; alt: string };
type TemplateRow = { label: string; hint: string };
type Fact = { value: string; label: string };

export type CollabsContent = {
  crumbs: Crumb[];
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    primary: Cta;
    secondary: Cta;
    image: Img;
    cardLabel: string;
    cardText: string;
  };
  how: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    template: TemplateRow[];
  };
  partner: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    badge: string;
    note: string;
    bullets: string[];
    primary: Cta;
    secondary: Cta;
    image: Img;
  };
  trust: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    facts: Fact[];
  };
  request: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    fieldsLabel: string;
    fields: string[];
    cta: Cta;
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

export const COLLABS: Record<Lang, CollabsContent> = {
  de: {
    crumbs: [
      { label: 'Collabs', href: '/mehr/collabs' },
    ],
    hero: {
      eyebrow: 'Collabs & Partner',
      title: 'Gute Empfehlungen sparen dir Fehlkäufe und',
      titleAccent: 'Umwege.',
      lead: 'Hier findest du Partner und Empfehlungen für Tanzschuhe, Kleidung und weitere Angebote rund ums Tanzen.',
      primary: { label: 'Partner ansehen', href: '#partner' },
      secondary: { label: 'Collab anfragen', href: '/kontakt' },
      image: { src: '/photos/showcase/hp-27.webp', alt: 'Das Salsaflow-Team präsentiert Shirts der eigenen Kollektion' },
      cardLabel: 'Empfehlungen',
      cardText: 'Nur was dir auf der Tanzfläche wirklich hilft.',
    },
    how: {
      eyebrow: 'Unsere Auswahl',
      title: 'Was eine Empfehlung für uns erfüllen',
      titleAccent: 'muss.',
      // Zweiter Satz aus dem Kunden-Onboarding, Feld "sonderInfo": "das wir unser Beitrag fuer
      // Salsa Community leisten wollen, wir foerdern Vereine und wollen die Konkurrenz barrieren
      // aufloesen." Das ist die einzige echte Haltung im Onboarding — sie stand nirgends und
      // passt genau hierher, wo es um Kooperationen geht.
      body: 'Wir empfehlen nur Angebote, die einen konkreten Bezug zum Tanzen haben. Partnerschaften und Vorteile kennzeichnen wir offen. Wir arbeiten auch mit Vereinen und anderen Schulen zusammen: Die Szene wird grösser, wenn man sie nicht gegeneinander aufstellt.',
      template: [
        { label: 'Bezug zum Tanzen', hint: 'Das Angebot unterstützt Unterricht, Social Dancing oder Events.' },
        { label: 'Konkreter Nutzen', hint: 'Du erkennst, wobei dir die Empfehlung helfen kann.' },
        { label: 'Passende Zielgruppe', hint: 'Wir sagen, ob das Angebot für Einsteiger oder erfahrene Tänzer passt.' },
        { label: 'Transparenz', hint: 'Eine Kooperation oder ein Vorteil wird sichtbar genannt.' },
        { label: 'Aktuelle Information', hint: 'Links und Hinweise sollen erreichbar und nachvollziehbar sein.' },
        { label: 'Freie Entscheidung', hint: 'Eine Empfehlung ist eine Hilfe, keine Voraussetzung für den Kurs.' },
      ],
    },
    partner: {
      eyebrow: 'Tanzschuhe & Zubehör',
      title: 'Tanzschuhe ohne',
      titleAccent: 'Rätselraten.',
      body: 'Hier findest du Tanzschuhe und Zubehör, die besser zu Salsa, Bachata oder Heels passen als normale Modeschuhe.',
      badge: '2332dancewear',
      note: 'Eigene Salsaflow-Kollektion bei 2332dancewear.',
      bullets: ['Eigene Salsaflow-Kollektion', 'Passt zu Kurs und Socials', 'Am Anfang reicht bequeme Kleidung'],
      primary: { label: 'Tanzschuhe ansehen', href: '/mehr/tanzschuhe' },
      secondary: { label: 'Shop öffnen', href: COLLAB_URL },
      // TODO KI-Still-Life (rote Tanzschuhe auf hellem Studio-Parkett), vorerst echtes Kursfoto.
      image: { src: '/photos/kurse/kurs-03.jpg', alt: 'Nahaufnahme im Tanzkurs mit Fokus auf Schritte und Schuhe' },
    },
    trust: {
      eyebrow: 'Warum Salsaflow',
      title: 'Warum wir Empfehlungen sorgfältig',
      titleAccent: 'auswählen.',
      body: 'Eine Empfehlung muss zur Tanz-Community passen und einen nachvollziehbaren Nutzen haben. Kooperationen und Vorteile kennzeichnen wir transparent.',
      facts: [
        { value: 'Seit 2018', label: 'Salsaflow in Basel' },
        { value: '3 Studios', label: 'direkt am Bahnhof Basel SBB' },
        { value: '~40 Kurse', label: 'pro Woche' },
      ],
    },
    request: {
      eyebrow: 'Zusammenarbeit',
      title: 'Du willst mit Salsaflow',
      titleAccent: 'zusammenarbeiten?',
      body: 'Kooperationen passen, wenn sie der Community echten Nutzen bringen: Schuhe, Events, Musik, Räume, Kultur, Tanzszene oder lokale Angebote.',
      fieldsLabel: 'Das gehört in deine Anfrage',
      fields: ['Name', 'Organisation', 'Idee', 'Nutzen für Community', 'Kontakt'],
      cta: { label: 'Collab anfragen', href: '/kontakt' },
    },
    faqEyebrow: 'Collabs FAQ',
    faqTitle: 'Häufige Fragen zu Partnern & Empfehlungen',
    faq: [
      {
        q: 'Sind die Links Werbung?',
        a: 'Wenn eine Partnerschaft oder ein Vorteil besteht, weisen wir dich transparent darauf hin.',
      },
      {
        q: 'Kann ich eine Kooperation vorschlagen?',
        a: 'Ja, über die Collab-Anfrage. Wichtig ist, dass die Idee zur Tanz-Community passt.',
      },
      {
        q: 'Warum gibt es eine Tanzschuh-Empfehlung?',
        a: 'Weil viele Anfänger nicht wissen, welche Schuhe für Drehungen, Halt und Sicherheit sinnvoll sind.',
      },
    ],
    closing: {
      eyebrow: 'Nächster Schritt',
      title: 'Entdecke Tanzschuhe, Partner und',
      titleAccent: 'Partys.',
      body: 'Wähle die passende Seite oder schreib uns, wenn du eine Kooperation vorschlagen möchtest.',
      primary: { label: 'Tanzschuhe ansehen', href: '/mehr/tanzschuhe' },
      secondary: { label: 'Kontakt aufnehmen', href: '/kontakt' },
    },
  },
  en: {
    crumbs: [
      { label: 'Collabs', href: '/mehr/collabs' },
    ],
    hero: {
      eyebrow: 'Collabs & partners',
      title: 'Good recommendations help you avoid poor choices and',
      titleAccent: 'detours.',
      lead: 'Here you find partners and recommendations for dance shoes, clothing and other offers around dancing.',
      primary: { label: 'See partners', href: '#partner' },
      secondary: { label: 'Suggest a collab', href: '/kontakt' },
      image: { src: '/photos/showcase/hp-27.webp', alt: 'The Salsaflow team presenting shirts from its own collection' },
      cardLabel: 'Recommendations',
      cardText: 'Only what really helps you on the dance floor.',
    },
    how: {
      eyebrow: 'How we choose',
      title: 'What we expect from a',
      titleAccent: 'recommendation.',
      body: 'We recommend offers that have a clear connection to dancing. Partnerships and benefits are always identified. We also work with clubs and other schools: the scene grows when you stop playing it against itself.',
      template: [
        { label: 'Relevant to dancing', hint: 'The offer supports classes, social dancing or events.' },
        { label: 'A practical benefit', hint: 'You can see exactly how the recommendation may help.' },
        { label: 'A defined audience', hint: 'We explain whether it suits beginners or experienced dancers.' },
        { label: 'Transparency', hint: 'Any partnership or benefit is clearly identified.' },
        { label: 'Current information', hint: 'Links and details should be accessible and easy to verify.' },
        { label: 'Your choice', hint: 'A recommendation can help, but is never required for a class.' },
      ],
    },
    partner: {
      eyebrow: 'Dance shoes & gear',
      title: 'Dance shoes without',
      titleAccent: 'guesswork.',
      body: 'Here you find dance shoes and gear that suit Salsa, Bachata or Heels better than regular fashion shoes.',
      badge: '2332dancewear',
      note: 'A dedicated Salsaflow collection at 2332dancewear.',
      bullets: ['A dedicated Salsaflow collection', 'Fits class and socials', 'Comfortable clothes are enough at the start'],
      primary: { label: 'See dance shoes', href: '/mehr/tanzschuhe' },
      secondary: { label: 'Open the shop', href: COLLAB_URL },
      image: { src: '/photos/kurse/kurs-03.jpg', alt: 'Close-up in a dance class focused on steps and shoes' },
    },
    trust: {
      eyebrow: 'Why Salsaflow',
      title: 'Why we choose recommendations',
      titleAccent: 'carefully.',
      body: 'A recommendation must suit the dance community and offer a clear benefit. We label partnerships and advantages transparently.',
      facts: [
        { value: 'Since 2018', label: 'Salsaflow in Basel' },
        { value: '3 studios', label: 'right by Basel SBB station' },
        { value: '~40 classes', label: 'per week' },
      ],
    },
    request: {
      eyebrow: 'Working together',
      title: 'Do you want to work with',
      titleAccent: 'Salsaflow?',
      body: 'Collaborations fit when they bring the community real value: shoes, events, music, rooms, culture, dance scene or local offers.',
      fieldsLabel: 'What your request should include',
      fields: ['Name', 'Organisation', 'Idea', 'Benefit for the community', 'Contact'],
      cta: { label: 'Suggest a collab', href: '/kontakt' },
    },
    faqEyebrow: 'Collabs FAQ',
    faqTitle: 'Common questions about partners & recommendations',
    faq: [
      {
        q: 'Are the links advertising?',
        a: 'If there is a partnership or a benefit, we point that out to you transparently.',
      },
      {
        q: 'Can I suggest a collaboration?',
        a: 'Yes, through the collab request. What matters is that the idea fits the dance community.',
      },
      {
        q: 'Why is there a dance shoe recommendation?',
        a: 'Because many beginners do not know which shoes make sense for turns, grip and safety.',
      },
    ],
    closing: {
      eyebrow: 'Next step',
      title: 'Explore dance shoes, partners and',
      titleAccent: 'parties.',
      body: 'Choose the relevant page or write to us if you would like to suggest a collaboration.',
      primary: { label: 'See dance shoes', href: '/mehr/tanzschuhe' },
      secondary: { label: 'Get in touch', href: '/kontakt' },
    },
  },
};
