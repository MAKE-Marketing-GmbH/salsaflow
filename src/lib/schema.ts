// Strukturierte Daten (P1.9, Teil 1): Organisations-Schema fuer die Home.
// @type ist ein Array (SEO-Audit 28.08.2026): DanceSchool als praeziserer Subtyp,
// LocalBusiness bleibt daneben als Fallback fuer Parser, die DanceSchool nicht kennen.
// Nur belegte Fakten: Kontakt, Standort und Recht stehen im Impressum, die Preisspanne in
// src/public/preise/content.ts. Keine erfundenen Oeffnungszeiten.
// Bewertungen: ebenfalls nur belegt. Sie kommen aus src/public/site/reviews.ts (Google-Harvest
// 2026-07-07) und stehen mit derselben Quelle sichtbar auf der Seite — nie hier hart eintippen.
// priceRange spannt den kleinsten und groessten Preis der Preisseite: CHF 5.- (Danceflow Night
// fuer Salsaflow-Schueler, content.ts:321) bis CHF 600.- (5 Privatstunden Paar, content.ts:268).

import { createElement } from 'react';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo-config';
import { GOOGLE_REVIEWS } from '@/public/site/reviews';

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': ['DanceSchool', 'LocalBusiness'],
  '@id': 'https://www.salsaflow-dc.com/#business',
  name: 'Salsaflow Dance Company',
  legalName: 'Salsaflow Dance Company GmbH',
  description:
    'Tanzschule in Basel für Salsa, Bachata und Heels. 3 Studios am Bahnhof Basel SBB. Erste Schnupperstunde gratis.',
  url: 'https://www.salsaflow-dc.com',
  telephone: '+41764788411',
  email: 'info@salsaflow-dc.com',
  priceRange: 'CHF 5–600',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Elisabethenanlage 7',
    postalCode: '4051',
    addressLocality: 'Basel',
    addressCountry: 'CH',
  },
  sameAs: ['https://www.instagram.com/salsaflowdc'],
  /* Maschinenlesbare Bewertungsdaten aus derselben Quelle wie die sichtbare Bewertung.
     Google blendet bei selbst veröffentlichten LocalBusiness-Bewertungen in der Regel keine
     Review-Sterne ein. Das Markup beschreibt deshalb die belegten Daten, ohne Sterne im
     Suchergebnis zu versprechen. Steigt die Zahl, ändert sich reviews.ts und beides zieht mit. */
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: GOOGLE_REVIEWS.rating,
    reviewCount: GOOGLE_REVIEWS.count,
    bestRating: 5,
    worstRating: 1,
  },
} as const;

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    LOCAL_BUSINESS,
    {
      '@type': 'WebSite',
      '@id': 'https://www.salsaflow-dc.com/#website',
      url: 'https://www.salsaflow-dc.com/',
      name: 'Salsaflow Dance Company',
      inLanguage: ['de-CH', 'en'],
      publisher: { '@id': 'https://www.salsaflow-dc.com/#business' },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.salsaflow-dc.com/#webpage',
      url: 'https://www.salsaflow-dc.com/',
      name: 'Tanzschule Basel: Salsa, Bachata & Heels | Salsaflow',
      description:
        'Salsa, Bachata und Heels tanzen in Basel: Gratis Schnupperstunde, Kurse für jedes Level, direkt am Bahnhof SBB und auch ohne Tanzpartner möglich.',
      inLanguage: 'de-CH',
      isPartOf: { '@id': 'https://www.salsaflow-dc.com/#website' },
      about: { '@id': 'https://www.salsaflow-dc.com/#business' },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        // EINE Quelle fuer das Social-Bild (seo-config.ts, 1200x630 og-default.jpg).
        // Deren Host ist ASSET_ORIGIN: auf der Ziel-Domain liegt bis zum DNS-Cutover
        // noch die alte Website, dort waere das Bild 404.
        url: DEFAULT_SOCIAL_IMAGE.url,
        width: DEFAULT_SOCIAL_IMAGE.width,
        height: DEFAULT_SOCIAL_IMAGE.height,
      },
    },
  ],
} as const;

/** JSON-LD-Script fuer die Home. Als createElement, damit die Datei .ts bleiben kann. */
export function LocalBusinessSchema() {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(HOME_SCHEMA) },
  });
}
