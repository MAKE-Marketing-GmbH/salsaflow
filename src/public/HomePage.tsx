// Startseite unter "/" (Geil-Pass v2 2026-07-07): komplett HELL. Der fruehere Hell-Dunkel-
// Herzschlag ist aufgeloest - nur noch der Footer und der EventsTeaser sind dunkel.
//
// Simple-Pass 2026-07-22 (Raphael: "weniger kaisler-artig, simpler"): PhotoBand und
// InternalLinks von Home entfernt (Fotos leben auf /fotos, Navigation im Footer),
// InstagramShowcase auf die helle compact-Variante (kein zweiter dunkler Show-Block),
// WallOfLove auf 6 Karten reduziert, Hero-Collage auf ein ruhiges Foto vereinfacht.

import { useEffect, useState } from 'react';
import { Seo } from '@/lib/seo';
import { LocalBusinessSchema } from '@/lib/schema';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { Hero } from '@/public/home/Hero';
import { Offer } from '@/public/home/Offer';
import { ScheduleTeaser } from '@/public/home/ScheduleTeaser';
import { WallOfLove } from '@/public/home/WallOfLove';
import { TeamBlock } from '@/public/home/TeamBlock';
import { PriceSignal } from '@/public/home/PriceSignal';
import { EventsTeaser } from '@/public/home/EventsTeaser';
import { Faq } from '@/public/home/Faq';
import { LocationBand } from '@/public/home/LocationBand';
import { InstagramShowcase } from '@/public/social/InstagramShowcase';
import { StickyCta } from '@/public/home/StickyCta';

export function HomePage() {
  // Kritiker-Runde 3, Befunde d-11 / m-01 / m-05 / m-07 / m-08: die fixe Cookie-Leiste
  // (site/CookieBanner.tsx, `position: fixed; bottom: 0`) lag auf jeder Scrollposition
  // ueber dem untersten Inhalt — gemessen u.a. auf dem Standort-CTA "Komm zur Gratis-Stunde
  // vorbei" (1440px) und auf der Level-Treppe/Review-Zeile (390px). Home nutzt jetzt denselben
  // Vertrag wie /faq und /team: der Hinweis steht beim Einstieg, raeumt nach dem ersten Scroll
  // die Inhaltsflaeche frei und erscheint unbestaetigt auf der naechsten Route wieder. Das
  // Bodenpolster in index.css haelt zusaetzlich JEDEN Inhalt scrollbar frei.
  const [cookieClear, setCookieClear] = useState(false);
  useEffect(() => {
    if (window.scrollY > 0) {
      setCookieClear(true);
      return;
    }
    const clearOnFirstScroll = () => setCookieClear(true);
    window.addEventListener('scroll', clearOnFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', clearOnFirstScroll);
  }, []);

  return (
    <div data-cookie-clear={cookieClear ? 'true' : undefined}>
      <Seo page="home" />
      <LocalBusinessSchema />
      <SiteHeader />
      {/* Kritiker final-2, Issue 2 (MAJOR): die Startseite lief auf 13 gestapelten <section> —
          jede mit eigener H2, eigener Flaeche und vollem Sektionsabstand. Das liest sich als
          SaaS-Baukasten, nicht als Editorial. Gemessen an home-1440.png (13177px) war der
          Scroll rund neun Bildschirme.

          Reduziert auf 11 Sektionen, OHNE konversionsrelevante Inhalte zu streichen (Reviews,
          Preise, FAQ und der Schnupperstunden-CTA bleiben vollstaendig):
            1. ScheduleTeaser + CoursePath -> EIN Kurs-Kapitel. "Welcher Kurs" und "welches
               Level" sind derselbe Gedanke; sie hatten zwei H2 und zwei Kapitelgrenzen.
               Jetzt: eine H2, die Level-Treppe als H3-Block darunter (ScheduleTeaser
               withCoursePath). Kein Satz Copy faellt weg.
            2. InstagramShowcase wandert ans Ende, direkt vor den Footer. Das Band ist ein
               Ausblick ("folg uns weiter"), keine Station im Entscheidungsweg — mitten im
               Scroll unterbrach es die Kette Kurs -> Anfrage -> Events -> Team -> Preis.
               Ganz unten steht es dort, wo der Besucher entweder gebucht hat oder weiterliest.
          Der Weissraum ZWISCHEN den verbleibenden Sektionen steigt ueber SECTION_Y in
          home/kit.tsx (py-16/lg:py-24 -> py-20/lg:py-28). */}
      {/* ------------------------------------------------------------------ Runde 1, 2026-08-07
          Zwei Eingriffe an der Reihenfolge, beide gemessen begruendet (Sektionsraster aus
          `node scripts/home-shot.cjs base`, 1440x900 und 390x844):

          1) `Funnel` ist RAUS. Die Sektion war ein vollstaendiger 4-Schritt-Anfrage-Wizard mit
             acht Anliegen-Kacheln ("Raum mieten", "Shows & Animationen", "Gutschein") und mass
             807px auf Desktop / 1282px auf Mobil — mitten im Entscheidungsweg. Es ist exakt
             dieselbe Komponente, die auf /kontakt#schnupperstunde steht
             (ContactPage.tsx:330 + :374), und genau dorthin zeigen ohnehin der Hero-CTA, der
             WhyGrid-CTA, der Preis-CTA, der Standort-CTA und die Sticky-Leiste. Es geht kein
             Weg verloren, nur die Dublette. Die Datei home/Funnel.tsx bleibt unangetastet
             liegen.

          2) Kurs-Kapitel VOR den Einwand-Block. Vorher las sich die Seite
             Hero -> WhyGrid ("Ich habe noch nie getanzt") -> Angebot -> Reviews -> Kursplan.
             Die Seite raeumte also Einwaende gegen ein Angebot aus, das sie noch gar nicht
             genannt hatte, und der einzige Terminbeweis stand bei y=3576, also vier
             Bildschirme unter dem Fold. Neu: erst WAS es gibt (Offer), dann WANN es laeuft
             (ScheduleTeaser mit echtem Wochendatum), dann die Einwaende, dann der
             Sozialbeweis direkt vor dem dunklen Events-Block. Der Kursplan-Beweis wandert
             damit rund 1000px nach oben.

          Beibehalten aus Kritiker final-2, Issue 2: ScheduleTeaser + CoursePath bleiben EIN
          Kapitel mit einer H2 (withCoursePath), und InstagramShowcase bleibt ganz unten als
          Ausblick statt als Station im Scroll. */}
      {/* paddingBottom via --sticky-cta-height statt statischem pb-20: der Sticky-Balken
          (77px, mobil ab 480px Scroll) deckte sonst am Seitenende den letzten Inhalt
          (Critic Runde 15, Item 2). Die Variable ist 0px, sobald der Balken weg ist. */}
      <main id="main" tabIndex={-1} style={{ paddingBottom: 'var(--sticky-cta-height, 0px)' }}>
        {/* R186 (Dom, 20.08.): WhyGrid ist raus aus der sichtbaren Reihenfolge. Der Kunde
            hat die Sektion "Du brauchst keinen perfekten Moment. Nur den ersten Schritt."
            im Screenshot abgelehnt. Sie beantwortete vier Einsteiger-Einwaende, die die
            FAQ am Seitenende ohnehin traegt ("Fragen vor deiner ersten Stunde").
            Die Datei home/WhyGrid.tsx bleibt unangetastet liegen. Der Import ist raus,
            sonst meldet oxlint eine ungenutzte Einfuhr. Zurueckholen kostet also zwei
            Zeilen: die Einfuhr oben und <WhyGrid /> hier. */}
        <Hero />
        <Offer />
        <ScheduleTeaser withCoursePath />
        <WallOfLove />
        <EventsTeaser />
        <TeamBlock />
        <PriceSignal />
        <Faq />
        <LocationBand />
        <InstagramShowcase compact data-design-unit="home.instagram-showcase" />
      </main>
      <SiteFooter entryCta={false} float />  {/* S17 Footer (dunkel, WhatsApp-Float bleibt auf Home sichtbar) */}
      <StickyCta />
    </div>
  );
}
