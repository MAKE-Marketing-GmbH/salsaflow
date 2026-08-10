import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { LangProvider } from '@/lib/i18n';
import { SmoothScroll } from '@/public/site/SmoothScroll';
import { PRERENDER_ROUTES, resolveRoute } from '@/routes';
import { SEO_META, type SeoKey } from '@/lib/seo';

export type PrerenderResult = {
  html: string;
  seoKey: SeoKey;
  routeClass: 'seo-public' | 'app-public' | 'app-private';
  title: string;
  description: string;
};

export function getPrerenderManifest() {
  return PRERENDER_ROUTES.map(({ path, routeClass, seoKey }) => ({ path, routeClass, seoKey }));
}

export function renderRoute(pathname: string): PrerenderResult {
  const route = resolveRoute(pathname);
  const Matched = route.component;
  const meta = SEO_META[route.seoKey].de;
  const html = renderToString(
    <StrictMode>
      <LangProvider>
        <SmoothScroll />
        <Matched />
      </LangProvider>
    </StrictMode>,
  );

  return {
    html,
    seoKey: route.seoKey,
    routeClass: route.routeClass,
    title: meta.title,
    description: meta.description,
  };
}
