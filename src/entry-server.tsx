import { StrictMode, Suspense, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { LangProvider } from '@/lib/i18n';
import { SmoothScroll } from '@/public/site/SmoothScroll';
import { PRERENDER_ROUTES, resolveRoute } from '@/routes';
import { SEO_META, SEO_ROUTE_CONFIG, type SeoKey } from '@/lib/seo';
import { HomePage } from '@/public/HomePage';
import { CoursesPage } from '@/public/CoursesPage';
import { EventsPage } from '@/public/EventsPage';
import { TeamPage } from '@/public/TeamPage';
import { PhotosPage } from '@/public/PhotosPage';
import { ContactPage } from '@/public/ContactPage';
import { ImpressumPage } from '@/public/ImpressumPage';
import { DatenschutzPage } from '@/public/DatenschutzPage';
import { SchedulePage } from '@/public/SchedulePage';
import { SalsaPage, BachataPage, HeelsPage } from '@/public/courses/styles/pages';
import { PrivatstundenPage } from '@/public/PrivatstundenPage';
import { KursaufbauPage } from '@/public/KursaufbauPage';
import { PreisePage } from '@/public/PreisePage';
import { ShowsAnimationenPage } from '@/public/ShowsAnimationenPage';
import { DanceflowNightPage } from '@/public/DanceflowNightPage';
import { AnniversaryPage } from '@/public/AnniversaryPage';
import { FloweekendPage } from '@/public/FloweekendPage';
import { EventkalenderPage } from '@/public/EventkalenderPage';
import { CollabsPage } from '@/public/CollabsPage';
import { TanzschuhePage } from '@/public/TanzschuhePage';
import { PartysPage } from '@/public/PartysPage';
import { FaqPage } from '@/public/FaqPage';
import { SchnupperstundePage } from '@/public/SchnupperstundePage';
import { PreparePage } from '@/public/PreparePage';
import { StandortPage } from '@/public/StandortPage';
import { NotFoundPage } from '@/public/NotFoundPage';

export type PrerenderResult = {
  html: string;
  seoKey: SeoKey;
  routeClass: 'seo-public' | 'app-public' | 'app-private';
  title: string;
  description: string;
};

export function getPrerenderManifest() {
  return PRERENDER_ROUTES.map(({ path, routeClass, seoKey }) => ({
    path,
    routeClass,
    seoKey,
    indexable: SEO_ROUTE_CONFIG[seoKey].indexable,
  }));
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

/**
 * Der Browser-Router nutzt React.lazy. Beim Build muss renderToString dagegen bereits
 * aufgeloeste Komponenten sehen, sonst wuerde jede SEO-Route am Suspense-Fallback enden.
 * Diese server-only Zuordnung wird nie Teil des Client-Bundles.
 */
function prerenderComponentFor(seoKey: SeoKey): ComponentType {
  switch (seoKey) {
    case 'home': return HomePage;
    case 'courses': return CoursesPage;
    case 'salsa': return SalsaPage;
    case 'bachata': return BachataPage;
    case 'heels': return HeelsPage;
    case 'privatstunden': return PrivatstundenPage;
    case 'kursaufbau': return KursaufbauPage;
    case 'preise': return PreisePage;
    case 'shows': return ShowsAnimationenPage;
    case 'events': return EventsPage;
    case 'danceflow': return DanceflowNightPage;
    case 'anniversary': return AnniversaryPage;
    case 'floweekend': return FloweekendPage;
    case 'eventkalender': return EventkalenderPage;
    case 'team': return TeamPage;
    case 'photos': return PhotosPage;
    case 'contact': return ContactPage;
    case 'schnupper': return SchnupperstundePage;
    case 'prepare': return PreparePage;
    case 'standort': return StandortPage;
    case 'collabs': return CollabsPage;
    case 'tanzschuhe': return TanzschuhePage;
    case 'partys': return PartysPage;
    case 'faq': return FaqPage;
    case 'impressum': return ImpressumPage;
    case 'datenschutz': return DatenschutzPage;
    case 'schedule': return SchedulePage;
    case 'notFound': return NotFoundPage;
    default: throw new Error(`Route ${seoKey} ist nicht fuer Prerender freigegeben.`);
  }
}

export function renderRoute(pathname: string): PrerenderResult {
  const route = resolveRoute(pathname);
  const Matched = prerenderComponentFor(route.seoKey);
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
