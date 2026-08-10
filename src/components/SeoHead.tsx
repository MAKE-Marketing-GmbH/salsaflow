import { useEffect } from 'react';
import type { Lang } from '@/lib/i18n';
import {
  DEFAULT_SOCIAL_IMAGE,
  SEO_ROUTE_CONFIG,
  SITE_NAME,
  canonicalUrlFor,
  type Meta,
  type SeoKey,
} from '@/lib/seo-config';
import { buildSeoJsonLd } from '@/lib/seo-schema';

type SeoHeadProps = {
  page: SeoKey;
  lang: Lang;
  meta: Meta;
  noindex?: boolean;
};

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  const matches = Array.from(document.head.querySelectorAll<HTMLMetaElement>(selector));
  let element = matches.shift();
  matches.forEach((duplicate) => duplicate.remove());

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url: string | null) {
  const matches = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
  let element = matches.shift();
  matches.forEach((duplicate) => duplicate.remove());

  if (!url) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

/**
 * Einheitliche Head-Steuerung für Client-Navigation und Sprachwechsel. Der statische Build
 * setzt dieselben DE-Werte bereits ins HTML; nach dem Sprachwechsel werden alle sichtbaren
 * und sozialen Meta-Texte gemeinsam aktualisiert.
 */
export function SeoHead({ page, lang, meta, noindex = false }: SeoHeadProps) {
  const route = SEO_ROUTE_CONFIG[page];
  const indexable = route.indexable && !noindex;
  const canonical = canonicalUrlFor(page);
  const locale = lang === 'de' ? 'de_CH' : 'en_GB';
  const alternateLocale = lang === 'de' ? 'en_GB' : 'de_CH';
  const imageAlt = DEFAULT_SOCIAL_IMAGE.alt[lang];
  const jsonLd = indexable ? buildSeoJsonLd(page, lang, meta) : null;

  useEffect(() => {
    document.title = meta.title;
    document.documentElement.lang = lang === 'de' ? 'de-CH' : 'en';

    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', indexable ? 'index, follow' : 'noindex, nofollow');

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:locale', locale);
    upsertMeta('property', 'og:locale:alternate', alternateLocale);
    upsertMeta('property', 'og:image', DEFAULT_SOCIAL_IMAGE.url);
    upsertMeta('property', 'og:image:secure_url', DEFAULT_SOCIAL_IMAGE.url);
    upsertMeta('property', 'og:image:type', DEFAULT_SOCIAL_IMAGE.type);
    upsertMeta('property', 'og:image:width', String(DEFAULT_SOCIAL_IMAGE.width));
    upsertMeta('property', 'og:image:height', String(DEFAULT_SOCIAL_IMAGE.height));
    upsertMeta('property', 'og:image:alt', imageAlt);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', DEFAULT_SOCIAL_IMAGE.url);
    upsertMeta('name', 'twitter:image:alt', imageAlt);

    setCanonical(indexable ? canonical : null);
  }, [alternateLocale, canonical, imageAlt, indexable, lang, locale, meta.description, meta.title]);

  if (!jsonLd) return null;

  return (
    <script
      id={`seo-jsonld-${page}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  );
}
