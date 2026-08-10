// Inhalt der Mehr-Seite (/mehr), zweisprachig DE/EN. Quelle: V3-Copyplan
// (Downloads/salsaflow_v3_detailed_copy_plan/pages/20_mehr.md + 01_startseite.md Section 10
// "MEHR VON SALSAFLOW"). /mehr ist ein schlanker Hub: Hero + 4 Karten, die auf die echten
// Unterseiten zeigen (/mehr/collabs, /mehr/tanzschuhe, /mehr/partys, /faq) + Schluss-CTA.
// Die alte Version mit eingebettetem FAQ/Collabs/Partys wurde durch den Karten-Hub ersetzt,
// weil diese Inhalte jetzt eigene Routen haben (kein doppelter Inhalt mehr).
// Copy nach Regel 003/069/085 (simpel, du-Form, echte Umlaute, CH-ss, keine Em-Dashes).

import type { Lang } from '@/lib/i18n';

export type HubCard = { title: string; body: string; cta: string; href: string };

export type MoreContent = {
  hero: {
    eyebrow: string;
    titleA: string;
    titleAccent: string;
    titleB: string;
    lead: string;
    primary: string;
    primaryHref: string;
    secondary: string;
    secondaryHref: string;
  };
  cards: HubCard[];
  cta: {
    eyebrow: string;
    title: string;
    lead: string;
    primary: string;
    primaryHref: string;
    secondary: string;
    secondaryHref: string;
  };
};

export const MORE_PAGE: Record<Lang, MoreContent> = {
  de: {
    hero: {
      eyebrow: 'MEHR VON SALSAFLOW',
      titleA: 'Alles, was rund ums',
      titleAccent: 'Tanzen',
      titleB: ' dazugehört.',
      lead: 'Von Tanzschuhen über Collabs bis zu Partys und häufigen Fragen: Hier findest du alles, was nicht direkt Kurs ist, aber deinen Einstieg einfacher macht.',
      primary: 'FAQ öffnen',
      primaryHref: '/faq',
      secondary: 'Kontakt aufnehmen',
      secondaryHref: '/kontakt',
    },
    cards: [
      {
        title: 'Collabs',
        body: 'Salsaflow Kollektion, Merchandise und ausgewählte Partnerschaften.',
        cta: 'Collabs ansehen',
        href: '/mehr/collabs',
      },
      {
        title: 'Tanzschuhe',
        body: 'Empfehlungen für Tanzschuhe, die zu deinem Tanzstil und Level passen.',
        cta: 'Tanzschuhe ansehen',
        href: '/mehr/tanzschuhe',
      },
      {
        title: 'Partys',
        body: 'Weitere Tanzabende und Empfehlungen rund um Basel.',
        cta: 'Partys ansehen',
        href: '/mehr/partys',
      },
      {
        title: 'FAQ',
        body: 'Antworten zu Kursdauer, Preisen, Level, Tanzpartner, Kleidung und Nachholen.',
        cta: 'FAQ öffnen',
        href: '/faq',
      },
    ],
    cta: {
      eyebrow: 'Noch eine Frage?',
      title: 'Nicht gefunden, was du suchst?',
      lead: 'Dann ist eine kurze Nachricht der schnellste Weg. Wir melden uns meistens innerhalb von 24 Stunden.',
      primary: 'Kontakt aufnehmen',
      primaryHref: '/kontakt',
      secondary: 'Kursplan ansehen',
      secondaryHref: '/kursplan',
    },
  },
  en: {
    hero: {
      eyebrow: 'MORE FROM SALSAFLOW',
      titleA: 'Everything that comes with',
      titleAccent: 'dancing',
      titleB: '.',
      lead: 'From dance shoes and collabs to parties and common questions: here you find everything that is not the course itself, but makes your start easier.',
      primary: 'Open FAQ',
      primaryHref: '/faq',
      secondary: 'Get in touch',
      secondaryHref: '/kontakt',
    },
    cards: [
      {
        title: 'Collabs',
        body: 'Salsaflow collection, merchandise and selected partnerships.',
        cta: 'See collabs',
        href: '/mehr/collabs',
      },
      {
        title: 'Dance shoes',
        body: 'Dance shoe recommendations that fit your style and level.',
        cta: 'See dance shoes',
        href: '/mehr/tanzschuhe',
      },
      {
        title: 'Parties',
        body: 'More dance nights and recommendations around Basel.',
        cta: 'See parties',
        href: '/mehr/partys',
      },
      {
        title: 'FAQ',
        body: 'Answers on course length, prices, level, dance partner, clothing and catching up.',
        cta: 'Open FAQ',
        href: '/faq',
      },
    ],
    cta: {
      eyebrow: 'One more question?',
      title: 'Still looking for something?',
      lead: 'Then a short message is the fastest way. We usually get back to you within 24 hours.',
      primary: 'Get in touch',
      primaryHref: '/kontakt',
      secondary: 'See the schedule',
      secondaryHref: '/kursplan',
    },
  },
};
