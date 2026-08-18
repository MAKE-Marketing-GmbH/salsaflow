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
import { SchnupperstundePage } from '@/public/SchnupperstundePage';
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
  { path: '/schnupperstunde', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', prerender: true },
  { path: '/kontakt/standort-raumvermietung', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', prerender: true },
  // R86: /mehr ist kein Hub mehr (Raphael 17.08.: Mehr ist nur Dropdown, keine Uebersicht).
  // Die Route leitet auf /faq um (erster Dropdown-Eintrag), wie /shows und /events-workshops.
  // MehrPage bleibt liegen, wird aber nicht mehr gerendert. Crumbs (R85) zeigen nicht mehr hierher.
  { path: '/mehr', component: MehrPage, routeClass: 'seo-public', seoKey: 'more', redirectTo: '/faq' },
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
  // R92: /animationen war SPA-404. Die echte Seite lebt unter /shows-animationen (Zeile oben,
  // seoKey 'shows'). Wie /shows: Kurz-Pfad leitet um. Keine eigene Animations-Seite.
  { path: '/animationen', component: ShowsAnimationenPage, routeClass: 'seo-public', seoKey: 'shows', redirectTo: '/shows-animationen' },
  // R93: sechs Kurz-/Alt-Pfade waren SPA-404. Alle leiten auf die echte Seite um, wie R88-R92.
  // /gutscheine (Plural) folgt R89 auf den Kontakt-Anker. /events-workshops/shows folgt R92.
  { path: '/kurse', component: CoursesPage, routeClass: 'seo-public', seoKey: 'courses', redirectTo: '/tanzkurse' },
  { path: '/privat', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  { path: '/private-lessons', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  { path: '/gutscheine', component: ContactPage, routeClass: 'seo-public', seoKey: 'contact', redirectTo: '/kontakt#geschenkgutschein' },
  { path: '/events-workshops/shows', component: ShowsAnimationenPage, routeClass: 'seo-public', seoKey: 'shows', redirectTo: '/shows-animationen' },
  { path: '/schedule', component: SchedulePage, routeClass: 'app-public', seoKey: 'schedule', redirectTo: '/kursplan' },
  // R94: /fotos-1 (Alt-Pfad aus Raphaels Erstauftrag P1, www.salsaflow-dc.com/fotos-1/) war
  // SPA-404. Die echte Seite lebt unter /fotos (Zeile oben, seoKey 'photos'). Wie R93: eine Zeile.
  { path: '/fotos-1', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  // R95: neun Stil-/Themen-Kurz-Pfade waren SPA-404. Alle leiten auf die echte Seite um, wie R93.
  // Stile auf ihre Kurs-Seite, /show folgt R92, /tanzschuhe+/party(s) auf die Mehr-Seiten (R86: /mehr
  // selbst ist weg, die Unterseiten leben). /danceflow auf die Danceflow-Night, /workshop auf /events.
  { path: '/salsa', component: SalsaPage, routeClass: 'seo-public', seoKey: 'salsa', redirectTo: '/tanzkurse/salsa' },
  { path: '/heels', component: HeelsPage, routeClass: 'seo-public', seoKey: 'heels', redirectTo: '/tanzkurse/heels' },
  { path: '/bachata', component: BachataPage, routeClass: 'seo-public', seoKey: 'bachata', redirectTo: '/tanzkurse/bachata' },
  { path: '/tanzschuhe', component: TanzschuhePage, routeClass: 'seo-public', seoKey: 'tanzschuhe', redirectTo: '/mehr/tanzschuhe' },
  { path: '/danceflow', component: DanceflowNightPage, routeClass: 'seo-public', seoKey: 'danceflow', redirectTo: '/events-workshops/danceflow-night' },
  { path: '/party', component: PartysPage, routeClass: 'seo-public', seoKey: 'partys', redirectTo: '/mehr/partys' },
  { path: '/partys', component: PartysPage, routeClass: 'seo-public', seoKey: 'partys', redirectTo: '/mehr/partys' },
  { path: '/show', component: ShowsAnimationenPage, routeClass: 'seo-public', seoKey: 'shows', redirectTo: '/shows-animationen' },
  { path: '/workshop', component: EventsPage, routeClass: 'seo-public', seoKey: 'events', redirectTo: '/events' },
  // R96: Journey-Altpfade + Event-Kurz-Pfade waren SPA-404. Schnupper-Altbegriffe (Raphael P10:
  // Schnupper muss erreichbar sein) auf /schnupperstunde, Events/Workshops/Collabs auf die echten
  // Seiten. /jahrestag und /events-workshops/anniversary sind Alt-Namen fuer anniversary-weekend.
  { path: '/erste-stunde', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  { path: '/probestunde', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  { path: '/kontakt/schnupper', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  { path: '/floweekend', component: FloweekendPage, routeClass: 'seo-public', seoKey: 'floweekend', redirectTo: '/events-workshops/floweekend' },
  { path: '/jahrestag', component: AnniversaryPage, routeClass: 'seo-public', seoKey: 'anniversary', redirectTo: '/events-workshops/anniversary-weekend' },
  { path: '/danceflow-night', component: DanceflowNightPage, routeClass: 'seo-public', seoKey: 'danceflow', redirectTo: '/events-workshops/danceflow-night' },
  { path: '/events-workshops/anniversary', component: AnniversaryPage, routeClass: 'seo-public', seoKey: 'anniversary', redirectTo: '/events-workshops/anniversary-weekend' },
  { path: '/workshops', component: EventsPage, routeClass: 'seo-public', seoKey: 'events', redirectTo: '/events' },
  { path: '/collabs', component: CollabsPage, routeClass: 'seo-public', seoKey: 'collabs', redirectTo: '/mehr/collabs' },
  // R97: Hub-Altpfade (Team/Fotos/Standort/Trial) waren SPA-404. ueber-uns/about sind Alt-Namen fuer
  // Team, galerie/gallery fuer Fotos, studio(s)/location/anfahrt fuer die Standort-Seite (R88),
  // trial (EN) fuer die Schnupperstunde. Wie R93-R96: eine Zeile pro Pfad.
  { path: '/ueber-uns', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  { path: '/about', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  { path: '/galerie', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/gallery', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/studio', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', redirectTo: '/kontakt/standort-raumvermietung' },
  { path: '/studios', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', redirectTo: '/kontakt/standort-raumvermietung' },
  { path: '/location', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', redirectTo: '/kontakt/standort-raumvermietung' },
  { path: '/anfahrt', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', redirectTo: '/kontakt/standort-raumvermietung' },
  { path: '/trial', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  { path: '/events-workshops', component: EventsPage, routeClass: 'seo-public', seoKey: 'events', redirectTo: '/events' },
  { path: '/kursplan-buchung', component: SchedulePage, routeClass: 'app-public', seoKey: 'schedule', redirectTo: '/kursplan' },
  // R88: /standort und /raumvermietung waren 404 (SPA-Fallback). Die echte Seite lebt unter
  // /kontakt/standort-raumvermietung (Zeile oben, seoKey 'standort'). Beide Kurz-Pfade leiten
  // dahin um, wie /shows und /mehr. Footer und Crumbs zeigen schon auf die echte Route.
  { path: '/standort', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', redirectTo: '/kontakt/standort-raumvermietung' },
  { path: '/raumvermietung', component: StandortPage, routeClass: 'seo-public', seoKey: 'standort', redirectTo: '/kontakt/standort-raumvermietung' },
  // R89: /geschenkgutschein und /gutschein waren SPA-404. Der Footer (SiteFooter) zeigt schon
  // auf /kontakt#geschenkgutschein. Beide Kurz-Pfade leiten dorthin um (main.tsx haengt den
  // Hash aus redirectTo an). Es gibt keine eigene Gutschein-Seite — der Kontakt-Anker ist Ziel.
  { path: '/geschenkgutschein', component: ContactPage, routeClass: 'seo-public', seoKey: 'contact', redirectTo: '/kontakt#geschenkgutschein' },
  { path: '/gutschein', component: ContactPage, routeClass: 'seo-public', seoKey: 'contact', redirectTo: '/kontakt#geschenkgutschein' },
  // R91: /schnupper und /kontakt/schnupperstunde waren SPA-404. Die echte Seite lebt unter
  // /schnupperstunde (Zeile oben, seoKey 'schnupper'). Beide Kurz-/Alt-Pfade leiten dahin um,
  // wie R88/R89. Raphael 17.08.: Schnupper ist eine eigene Seite, kein Kontakt-Anker.
  { path: '/schnupper', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  { path: '/kontakt/schnupperstunde', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  // R98: /kurse/{stil} war SPA-404. /kurse leitet schon auf /tanzkurse (R93) — die drei
  // Stil-Unterpfade folgen auf die echten Stil-Seiten. Kein /en: Sprache ist Toggle, kein Pfad.
  { path: '/kurse/salsa', component: SalsaPage, routeClass: 'seo-public', seoKey: 'salsa', redirectTo: '/tanzkurse/salsa' },
  { path: '/kurse/heels', component: HeelsPage, routeClass: 'seo-public', seoKey: 'heels', redirectTo: '/tanzkurse/heels' },
  { path: '/kurse/bachata', component: BachataPage, routeClass: 'seo-public', seoKey: 'bachata', redirectTo: '/tanzkurse/bachata' },
  // R99: /teachers und /lehrer (Alt-Namen fuer Team) plus /private und /lessons (Alt-Namen
  // fuer Privatstunden) waren SPA-404. Wie R93-R98: eine Zeile pro Pfad auf die echte Seite.
  // Kein /en (Toggle), kein /instagram, kein /community.
  { path: '/teachers', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  { path: '/lehrer', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  { path: '/private', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  { path: '/lessons', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  // R102: neun EN-/Alt-Aliase waren SPA-404. Wie R93-R99: eine Zeile pro Pfad auf die echte
  // Seite. /about /teachers /erste-stunde /danceflow-night leben schon (R96-R99). Kein /en
  // (Sprache = Toggle in localStorage), kein /login (bleibt Admin, kein oeffentlicher Pfad).
  { path: '/about-us', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  { path: '/aboutus', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  { path: '/classes', component: CoursesPage, routeClass: 'seo-public', seoKey: 'courses', redirectTo: '/tanzkurse' },
  { path: '/timetable', component: SchedulePage, routeClass: 'app-public', seoKey: 'schedule', redirectTo: '/kursplan' },
  { path: '/calendar', component: EventkalenderPage, routeClass: 'seo-public', seoKey: 'eventkalender', redirectTo: '/events-workshops/eventkalender' },
  { path: '/nights', component: PartysPage, routeClass: 'seo-public', seoKey: 'partys', redirectTo: '/mehr/partys' },
  { path: '/danceflow-nights', component: DanceflowNightPage, routeClass: 'seo-public', seoKey: 'danceflow', redirectTo: '/events-workshops/danceflow-night' },
  { path: '/ersteStunde', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  { path: '/ich-tanze', component: HomePage, routeClass: 'seo-public', seoKey: 'home', redirectTo: '/' },
  // R103: vier Tracking-/Alt-Pfade waren SPA-404 (R28-Rest). /ichtanze folgt R102 /ich-tanze
  // auf Home, /worumgeht + /worum-gehts auf /faq (Fragen zur Schule), /blog auf /fotos
  // (Bilder statt Artikel — es gibt keinen Blog). Kein /en, kein /login.
  { path: '/ichtanze', component: HomePage, routeClass: 'seo-public', seoKey: 'home', redirectTo: '/' },
  { path: '/worumgeht', component: FaqPage, routeClass: 'seo-public', seoKey: 'faq', redirectTo: '/faq' },
  { path: '/worum-gehts', component: FaqPage, routeClass: 'seo-public', seoKey: 'faq', redirectTo: '/faq' },
  { path: '/blog', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  // R104: neun EN-/Alt-Aliase waren SPA-404 (R28-Rest). Wie R93-R103: eine Zeile
  // pro Pfad auf die echte Seite. /pricing+/prices auf /preise, /contact+/contacts
  // auf /kontakt, /photos+/photo auf /fotos, /class auf /tanzkurse (R93: /classes
  // lebt schon), /trial-lesson auf /schnupperstunde (R96: /trial lebt schon),
  // /instructors auf /team. Kein /en (Toggle), kein /login (Admin).
  { path: '/pricing', component: PreisePage, routeClass: 'seo-public', seoKey: 'preise', redirectTo: '/preise' },
  { path: '/prices', component: PreisePage, routeClass: 'seo-public', seoKey: 'preise', redirectTo: '/preise' },
  { path: '/contact', component: ContactPage, routeClass: 'seo-public', seoKey: 'contact', redirectTo: '/kontakt' },
  { path: '/contacts', component: ContactPage, routeClass: 'seo-public', seoKey: 'contact', redirectTo: '/kontakt' },
  { path: '/photos', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/photo', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/class', component: CoursesPage, routeClass: 'seo-public', seoKey: 'courses', redirectTo: '/tanzkurse' },
  { path: '/trial-lesson', component: SchnupperstundePage, routeClass: 'seo-public', seoKey: 'schnupper', redirectTo: '/schnupperstunde' },
  { path: '/instructors', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  // R105: neun Journey-Pfade waren SPA-404 (R28-Rest). Wie R93-R104: eine Zeile
  // pro Pfad auf die echte Seite. /buchen+/booking+/anmelden+/anmeldung auf
  // /buchung (Buchungs-App), /privatstunde+/einzelstunde auf /privatstunden
  // (Singular-Alt), /home auf /, /fragen auf /faq, /termine auf /kursplan.
  // Kein /en, kein /de (Toggle), kein /login (Admin), kein /instagram.
  { path: '/buchen', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  { path: '/booking', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  { path: '/anmelden', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  { path: '/anmeldung', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  { path: '/privatstunde', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  { path: '/einzelstunde', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  { path: '/home', component: HomePage, routeClass: 'seo-public', seoKey: 'home', redirectTo: '/' },
  { path: '/fragen', component: FaqPage, routeClass: 'seo-public', seoKey: 'faq', redirectTo: '/faq' },
  { path: '/termine', component: SchedulePage, routeClass: 'app-public', seoKey: 'schedule', redirectTo: '/kursplan' },
  // R106: neun Kurz-/Alt-Pfade waren SPA-404 (R28-Rest). Wie R93-R105: eine Zeile
  // pro Pfad auf die echte Seite. /book+/reservieren+/reservation auf /buchung
  // (R105: /buchen+/booking leben schon), /private-lesson+/privates auf
  // /privatstunden (R93/R105: /private-lessons+/privatstunde leben schon),
  // /start+/startseite auf /, /lehrerinnen+/dozenten auf /team (R99: /lehrer
  // lebt schon). Kein /en (Toggle), kein /login (Admin), kein /instagram (Hub).
  { path: '/book', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  { path: '/reservieren', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  { path: '/reservation', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  { path: '/private-lesson', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  { path: '/privates', component: PrivatstundenPage, routeClass: 'seo-public', seoKey: 'privatstunden', redirectTo: '/privatstunden' },
  { path: '/start', component: HomePage, routeClass: 'seo-public', seoKey: 'home', redirectTo: '/' },
  { path: '/startseite', component: HomePage, routeClass: 'seo-public', seoKey: 'home', redirectTo: '/' },
  { path: '/lehrerinnen', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  { path: '/dozenten', component: TeamPage, routeClass: 'seo-public', seoKey: 'team', redirectTo: '/team' },
  // R107: vier Medien-/Kombi-Pfade waren SPA-404 (R28-Rest). Wie R93-R106: eine
  // Zeile pro Pfad auf die echte Seite. /news+/journal+/stories auf /fotos
  // (Bilder statt Artikel — es gibt keinen Blog, R103: /blog lebt schon),
  // /kurse-buchen auf /buchung. Kein /en (Toggle), kein /login (Admin), kein
  // /instagram (Hub).
  { path: '/news', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/journal', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/stories', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/kurse-buchen', component: BookingPage, routeClass: 'app-public', seoKey: 'booking', redirectTo: '/buchung' },
  // R108: vier Presse-/Medien-Pfade waren SPA-404 (R28-Rest). Wie R107 (/news,
  // /journal, /stories): keine eigene Presse-Seite, Bilder statt Artikel — alle
  // vier auf /fotos. Kein /en (Toggle), kein /login (Admin), kein /instagram.
  { path: '/presse', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/press', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/medien', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
  { path: '/media', component: PhotosPage, routeClass: 'seo-public', seoKey: 'photos', redirectTo: '/fotos' },
];

export const PRERENDER_ROUTES = ROUTE_DEFINITIONS.filter((route) => route.prerender);

const NOT_FOUND_ROUTE: RouteDefinition = {
  path: '/404',
  component: NotFoundPage,
  routeClass: 'seo-public',
  seoKey: 'notFound',
};

// R98: Slash am Ende machte echte Seiten zu 404 (resolveRoute matchte nur exact).
// Ohne Slash erneut matchen und auf den kanonischen Pfad umleiten — auch wenn der
// Treffer selbst schon redirectTo traegt (z.B. /kurse/ -> /tanzkurse, /mehr/ -> /faq).
const withTrailingSlashRedirect = (route: RouteDefinition, canonicalPath: string): RouteDefinition => ({
  ...route,
  redirectTo: route.redirectTo ?? canonicalPath,
});

export function resolveRoute(pathname: string): RouteDefinition {
  const exact = ROUTE_DEFINITIONS.find((route) => route.match !== 'prefix' && route.path === pathname);
  if (exact) return exact;

  const prefix = ROUTE_DEFINITIONS.find(
    (route) => route.match === 'prefix' && (pathname === route.path || pathname.startsWith(`${route.path}/`)),
  );
  if (prefix) return prefix;

  if (pathname.length > 1 && pathname.endsWith('/')) {
    const trimmed = pathname.slice(0, -1);
    const trimmedMatch = ROUTE_DEFINITIONS.find(
      (route) =>
        (route.match !== 'prefix' && route.path === trimmed) ||
        (route.match === 'prefix' && (trimmed === route.path || trimmed.startsWith(`${route.path}/`))),
    );
    if (trimmedMatch) return withTrailingSlashRedirect(trimmedMatch, trimmed);
  }

  return NOT_FOUND_ROUTE;
}
