import { lazy, type ComponentType } from 'react';
import type { SeoKey } from '@/lib/seo';
// Admin lazy: die komplette Verwaltung (App) lag im einen oeffentlichen Bundle — jeder
// Besucher der Startseite hat sie mitgeladen. /admin wird nie prerendert (leere Huelle),
// darum trifft renderToString diese lazy-Komponente nie.
const App = lazy(() => import('@/App').then((m) => ({ default: m.App })));
import { HomePage } from '@/public/HomePage';
import { CoursesPage } from '@/public/CoursesPage';
import { EventsPage } from '@/public/EventsPage';
import { TeamPage } from '@/public/TeamPage';
import { PhotosPage } from '@/public/PhotosPage';
import { ContactPage } from '@/public/ContactPage';
import { MehrPage } from '@/public/MehrPage';
import { ImpressumPage } from '@/public/ImpressumPage';
import { DatenschutzPage } from '@/public/DatenschutzPage';
import { SchedulePage } from '@/public/SchedulePage';
import { BookingReturn } from '@/public/BookingReturn';
import { BookingPage } from '@/public/BookingPanel';
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
import { StandortPage } from '@/public/StandortPage';
import { NotFoundPage } from '@/public/NotFoundPage';

export type RouteClass = 'seo-public' | 'app-public' | 'app-private';

export type RouteDefinition = {
  path: string;
  component: ComponentType;
  routeClass: RouteClass;
  seoKey: SeoKey;
  match?: 'exact' | 'prefix';
  prerender?: boolean;
  redirectTo?: string;
};

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  { path: '/', component: HomePage, routeClass: 'seo-public', seoKey: 'home', prerender: true },
  { path: '/tanzkurse', component: CoursesPage, routeClass: 'seo-public', seoKey: 'courses', prerender: true },
  { path: '/tanzkurse/salsa', component: SalsaPage, routeClass: 'seo-public', seoKey: 'salsa', prerender: true },
  { path: '/tanzkurse/bachata', component: BachataPage, routeClass: 'seo-public', seoKey: 'bachata', prerender: true },
  { path: '/tanzkurse/heels', component: HeelsPage, routeClass: 'seo-public', seoKey: 'heels', prerender: true },
  { path: '/privatstunden', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', prerender: true },
  { path: '/kursaufbau', component: KursaufbauPage, routeClass: 'seo-public', seoKey: 'kursaufbau', prerender: true },
  { path: '/preise', component: PreisePage, routeClass: 'seo-public', seoKey: 'preise', prerender: true },
  { path: '/shows-animationen', component: ShowsAnimationenPage, routeClass: 'seo-public', seoKey: 'shows', prerender: true },
  { path: '/events', component: EventsPage, routeClass: 'seo-public', seoKey: 'events', prerender: true },
  { path: '/events-workshops/danceflow-night', component: DanceflowNightPage, routeClass: 'seo-public', seoKey: 'danceflow', prerender: true },
  { path: '/events-workshops/anniversary-weekend', component: AnniversaryPage, routeClass: 'seo-public', seoKey: 'anniversary', prerender: true },
  { path: '/events-workshops/floweekend', component: FloweekendPage, routeClass: 'seo-public', seoKey: 'floweekend', prerender: true },
  { path: '/events-workshops/eventkalender', component: EventkalenderPage, routeClass: 'seo-public', seoKey: 'eventkalender', prerender: true },
  { path: '/team', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', prerender: true },
  { path: '/fotos', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', prerender: true },
  { path: '/kontakt', component: ContactPage, routeClass: 'seo-public', seoKey: 'contact', prerender: true },
  { path: '/kontakt/standort-raumvermietung', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', prerender: true },
  { path: '/mehr', component: MehrPage, routeClass: 'seo-public', seoKey: 'more', prerender: true },
  { path: '/mehr/collabs', component: CollabsPage, routeClass: 'seo-public', seoKey: 'collabs', prerender: true },
  { path: '/mehr/tanzschuhe', component: TanzschuhePage, routeClass: 'seo-public', seoKey: 'tanzschuhe', prerender: true },
  { path: '/mehr/partys', component: PartysPage, routeClass: 'seo-public', seoKey: 'partys', prerender: true },
  { path: '/faq', component: FaqPage, routeClass: 'seo-public', seoKey: 'faq', prerender: true },
  { path: '/impressum', component: ImpressumPage, routeClass: 'seo-public', seoKey: 'impressum', prerender: true },
  { path: '/datenschutz', component: DatenschutzPage, routeClass: 'seo-public', seoKey: 'datenschutz', prerender: true },
  { path: '/kursplan', component: SchedulePage, routeClass: 'app-public', seoKey: 'schedule', prerender: true },
  { path: '/admin', component: App, routeClass: 'app-private', seoKey: 'admin' },
  { path: '/buchung', component: BookingPage, routeClass: 'app-public', seoKey: 'booking' },
  { path: '/buchung/erfolg', component: BookingReturn, routeClass: 'app-public', seoKey: 'bookingStatus' },
  { path: '/buchung/abbruch', component: BookingReturn, routeClass: 'app-public', seoKey: 'bookingStatus' },
  { path: '/shows', component: ShowsAnimationenPage, routeClass: 'seo-public', seoKey: 'shows', redirectTo: '/shows-animationen' },
  { path: '/events-workshops', component: EventsPage, routeClass: 'seo-public', seoKey: 'events', redirectTo: '/events' },
  { path: '/kursplan-buchung', component: SchedulePage, routeClass: 'app-public', seoKey: 'schedule', redirectTo: '/kursplan' },
];

export const PRERENDER_ROUTES = ROUTE_DEFINITIONS.filter((route) => route.prerender);

const NOT_FOUND_ROUTE: RouteDefinition = {
  path: '/404',
  component: NotFoundPage,
  routeClass: 'seo-public',
  seoKey: 'notFound',
};

export function resolveRoute(pathname: string): RouteDefinition {
  const exact = ROUTE_DEFINITIONS.find((route) => route.match !== 'prefix' && route.path === pathname);
  if (exact) return exact;

  const prefix = ROUTE_DEFINITIONS.find(
    (route) => route.match === 'prefix' && (pathname === route.path || pathname.startsWith(`${route.path}/`)),
  );
  return prefix ?? NOT_FOUND_ROUTE;
}
