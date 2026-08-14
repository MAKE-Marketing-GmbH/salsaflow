import { StrictMode, Suspense } from 'react';
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

/**
 * Titel und Beschreibung einer Route, ohne sie zu rendern. Das Build-Skript schreibt fuer
 * /admin und /buchung leere Huellen; deren Texte standen frueher als Kopie im Skript und
 * liefen darum auseinander. Einzige Quelle bleibt SEO_META.
 */
export function getRouteMeta(pathname: string) {
  const route = resolveRoute(pathname);
  const meta = SEO_META[route.seoKey].de;
  return { title: meta.title, description: meta.description };
}

export function renderRoute(pathname: string): PrerenderResult {
  const route = resolveRoute(pathname);
  const Matched = route.component;
  const meta = SEO_META[route.seoKey].de;
  // Der Baum muss ZEICHEN FUER ZEICHEN dem aus main.tsx entsprechen, inklusive <Suspense>.
  // Ohne das Suspense hier sah React beim Hydrieren an derselben Stelle einmal <Suspense>
  // und einmal das JSON-LD-<script> und warf den ganzen Baum weg (Fehler 418). Sichtbar
  // war das nicht, teuer schon: jede Seite rendert nach dem Laden komplett neu.
  const html = renderToString(
    <StrictMode>
      <LangProvider>
        <SmoothScroll />
        <Suspense fallback={null}>
          <Matched />
        </Suspense>
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
