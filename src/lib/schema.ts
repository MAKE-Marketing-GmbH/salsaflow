// Strukturierte Daten (P1.9, Teil 1): Organisations-Schema fuer die Home.
// schema.org kennt KEIN "DanceSchool" (404) - korrekt ist LocalBusiness.
// Nur belegte Fakten aus INVARIANTS.json (Kontakt, Standort, Recht). Keine erfundenen
// Oeffnungszeiten, keine erfundenen Bewertungen.

import { createElement } from 'react';

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.salsaflow-dc.com/#business',
  name: 'Salsaflow Dance Company',
  legalName: 'Salsaflow Dance Company GmbH',
  description:
    'Tanzschule in Basel für Salsa, Bachata und Heels. 3 Studios am Bahnhof Basel SBB. Erste Schnupperstunde gratis.',
  url: 'https://www.salsaflow-dc.com',
  telephone: '+41764788411',
  email: 'info@salsaflow-dc.com',
  priceRange: 'CHF 10–340',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Elisabethenanlage 7',
    postalCode: '4051',
    addressLocality: 'Basel',
    addressCountry: 'CH',
  },
  sameAs: ['https://www.instagram.com/salsaflowdc'],
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
        // Bild-Host = ASSET_ORIGIN (seo-config.ts): auf der Ziel-Domain liegt bis zum
        // DNS-Cutover noch die alte Website, dort ist dieses Bild 404.
        url: 'https://salsaflow-dc.vercel.app/photos/showcase/hp-05.webp',
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
