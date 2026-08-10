import { SeoHead } from '@/components/SeoHead';
import { useLang } from '@/lib/i18n';
import { SEO_META, type SeoKey } from '@/lib/seo-config';

export {
  BUSINESS_ID,
  DEFAULT_SOCIAL_IMAGE,
  SEO_META,
  SEO_ROUTE_CONFIG,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_IMAGE,
  WEBSITE_ID,
  canonicalUrlFor,
} from '@/lib/seo-config';
export type { Meta, SeoKey, SeoRouteConfig } from '@/lib/seo-config';

/** Bestehende Seiten-API; delegiert die vollständige Head- und Schema-Steuerung zentral. */
export function Seo({ page, noindex = false }: { page: SeoKey; noindex?: boolean }) {
  const { lang } = useLang();
  return <SeoHead page={page} lang={lang} meta={SEO_META[page][lang]} noindex={noindex} />;
}
