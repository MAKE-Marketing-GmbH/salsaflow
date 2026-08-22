// Woher die Beitraege kommen: src/public/social/instagram-feed.ts. Hier steht KEIN
// Shortcode mehr. Wer den Feed wechselt (Behold, Graph API) oder aktualisiert
// (scripts/refresh-instagram-feed.mjs), fasst nur die Datendatei an, nicht dieses Layout.

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { CONTACT } from '@/public/site/SiteFooter';
import { InstagramIcon } from '@/public/site/BrandIcons';
import { Eyebrow, Shell } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { SECTION_Y, SECTION_Y_HOME } from '@/public/home/kit';
import { getInstagramFeed, type FeedPost } from '@/public/social/instagram-feed';
import { cn } from '@/lib/utils';

function InstagramVideoCard({ post, compact = false }: { post: FeedPost; compact?: boolean }) {
  const { lang } = useLang();
  const [loaded, setLoaded] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const title = lang === 'de' ? post.titel : post.titelEn;
  const postUrl = post.url;
  const iframeTitle = lang === 'de' ? `${title} auf Instagram` : `${title} on Instagram`;
  const loadLabel = lang === 'de' ? `${title} von Instagram laden` : `Load ${title} from Instagram`;
  const directLabel = lang === 'de' ? `${title} direkt auf Instagram öffnen` : `Open ${title} directly on Instagram`;

  useEffect(() => {
    if (!frameReady) return;
    const frame = window.requestAnimationFrame(() => iframeRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [frameReady]);

  return (
    <article data-component-unit="component.instagram-video-card" className="group relative isolate flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/15 bg-[var(--color-ink)] shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)]">
      {/* Feste 9:16-Buehne. Poster und iframe liegen beide absolut darin, also springt
          das Layout beim Laden des Embeds nicht (kein Layout-Shift).
          S4 (14.08.2026), Hoehen-Ruhe: `overflow-hidden` ist jetzt explizit Pflicht —
          die Karte rundet den Container (rounded-[1.5rem]), aber nur die Buehne selbst
          clippt das iframe wirklich auf die 9:16-Aussenmasse. Das captioned-Embed haengt
          seine Kopf-/Fusszeile in den Buehnen-Rand hinaus; ohne Clip auf der Buehne
          wuerde die geladene Karte optisch aus der Reihe wachsen. Instagram-Chrome im
          iframe ist Fremd-UI — die Aussenmasse der Buehne hat Vorrang. */}
      <div className={cn('relative w-full overflow-hidden bg-[var(--color-ink)]', compact ? 'aspect-[5/4]' : 'aspect-[9/16]')}>
        {loaded && (
          <iframe
            ref={iframeRef}
            src={`${postUrl}embed/captioned/`}
            title={iframeTitle}
            className="absolute inset-0 h-full w-full border-0 bg-[var(--color-ink)]"
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            tabIndex={-1}
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setFrameReady(true)}
          />
        )}
        {!frameReady && (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            disabled={loaded}
            aria-label={loadLabel}
            className={cn(
              'absolute inset-0 z-10 h-full w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white',
              loaded && 'pointer-events-none cursor-default',
            )}
          >
            {post.poster ? (
              <img
                src={post.poster}
                alt=""
                width={post.posterWidth}
                height={post.posterHeight}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-out motion-safe:group-hover:scale-[1.025]"
              />
            ) : (
              // Neuer Shortcode ohne Standbild: ruhige Flaeche statt kaputtes Bild.
              <span aria-hidden className="block h-full w-full bg-[var(--color-surface-dark)]" />
            )}
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.02)_0%,rgba(10,10,10,0.08)_45%,rgba(10,10,10,0.82)_100%)]" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--color-ink)] shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-transform duration-[var(--dur-base)] motion-safe:group-hover:scale-105">
                <Play aria-hidden className="ml-1 h-6 w-6 fill-current" strokeWidth={1.5} />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/75">
                <InstagramIcon className="h-4 w-4" />
                @salsaflowdc
              </span>
            </span>
          </button>
        )}
      </div>
      {/* Der Titel steht UNTER der Buehne, nicht im Poster-Overlay. Zwei Gruende:
          1. SEO: er bleibt im HTML lesbar, auch wenn das Embed geladen ist.
          2. Lesbarkeit: auf 390px stand er vorher als weisser Text auf dem Foto. */}
      <div className={cn(!compact && 'flex flex-1 flex-col gap-3 border-t border-white/10 bg-[var(--color-ink)] px-4 py-4 text-white')}>
        <h3
          className={cn(
            'font-display font-bold leading-tight text-balance',
            compact ? 'sr-only' : 'text-lg',
          )}
          style={compact ? undefined : { letterSpacing: 0, wordSpacing: '0.1em' }}
        >
          {title}
        </h3>
        {!compact && (
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs leading-snug text-white/65">
            <ShieldCheck aria-hidden className="h-3.5 w-3.5 shrink-0" />
            {lang === 'de' ? 'Lädt Instagram erst beim Klick' : 'Loads Instagram only on click'}
          </span>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={directLabel}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ExternalLink aria-hidden className="h-4 w-4" />
          </a>
        </div>
        )}
      </div>
    </article>
  );
}

type InstagramShowcaseProps = {
  compact?: boolean;
  'data-design-unit': 'home.instagram-showcase' | 'photos.instagram-showcase';
};

export function InstagramShowcase({ compact = false, 'data-design-unit': designUnitId }: InstagramShowcaseProps) {
  const { lang } = useLang();
  const { item } = useReveal({ stagger: 0.08 });
  const onHome = designUnitId === 'home.instagram-showcase';
  const posts = getInstagramFeed();

  return (
    <section
      id={compact ? undefined : 'instagram'}
      data-design-unit={designUnitId}
      className={cn(
        // Runde 2, Issue 9: gleiche Sektions-Stufe wie alle anderen (home/kit.tsx SECTION_Y).
        // Kritiker final-2, Issue 2: die compact-Variante ist die Home-Variante und laeuft
        // deshalb auf der Home-Stufe SECTION_Y_HOME. Die volle Variante (/fotos) bleibt
        // unveraendert auf SECTION_Y — dort wurde nichts kritisiert.
        'relative isolate overflow-hidden',
        compact ? SECTION_Y_HOME : SECTION_Y,
        // S4 (14.08.2026), Float-Freiraum: der fixe WhatsApp-Float (bottom 1.25rem, h-14,
        // ~76px Fuss) deckte im Play-Shot die dritte Karte ab (Titel + Direct-Link).
        // Dasselbe Problem hat SiteFooter an der Legal-Row geloest (SiteFooter.tsx:145,
        // pb-20/pb-24) — hier analog: py-16 wird zu pt-16 + pb-24, die Sektions-Stufe
        // bleibt. Auf Mobil sitzt der Float ohnehin ueber dem StickyCta-Balken
        // (--sticky-cta-height), Desktop ist der kritische Pfad.
        compact ? '!pb-20 sm:!pb-24' : '!pb-24',
        // Flaeche je Einsatzort, damit nie zwei gleiche Flaechen aneinanderstossen:
        //  home  — darueber steht der LocationBand-Closer auf bg-soft (LocationBand.tsx:22),
        //          also hier paper-warm. Sonst verschmelzen beide zu einer langen Platte.
        //  fotos — darunter steht GalleryClosing auf paper-warm (PhotosPage.tsx:282),
        //          also bleibt es hier bei bg-soft wie bisher.
        !compact
          ? 'bg-[var(--color-ink)] text-white'
          : onHome
            ? 'bg-[var(--color-paper-warm)] text-[var(--color-ink)]'
            : 'bg-[var(--color-bg-soft)] text-[var(--color-ink)]',
      )}
    >
      {!compact && (
        <>
          <img
            src="/photos/instagram/community-comeback-v2.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-45"
            width={1080}
            height={725}
            loading="lazy"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(10,10,10,0.96)_0%,rgba(10,10,10,0.86)_42%,rgba(10,10,10,0.66)_72%,rgba(10,10,10,0.88)_100%)]" />
        </>
      )}

      <Shell>
        {/* Design-Kritik Runde 3, Issue 5 ("Tote rechte Spalten" / ungleiche Spaltenhoehen):
            der Kopf links mass 247px, das Video-Raster rechts 534px — mit lg:items-end sass
            die Luecke oben ueber dem Kopf. Statt die Spalte kuenstlich zu strecken laeuft
            der Kopf jetzt mit (lg:sticky), dieselbe Loesung wie in der Home-FAQ und in der
            Preise-FitSection. Die Flaeche bleibt in Bewegung statt tot zu stehen. */}
        <Reveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-14">
          <motion.div
            variants={item}
            className={cn(
              'max-w-xl',
              !onHome && 'lg:sticky lg:top-[calc(var(--nav-h)+2rem)]',
            )}
          >
            {/* Echtes Marken-Glyph am Sektions-Kopf (BrandIcons), nicht die Lucide-Kamera.
                Der Eyebrow traegt das Wort, das Icon ist daneben dekorativ. */}
            <div className="flex items-center gap-2.5">
              <InstagramIcon aria-hidden className={cn('h-5 w-5 shrink-0', compact ? 'text-[var(--color-salsa)]' : 'text-white')} />
              {/* Der rote Takt-Marker entfaellt: das Icon uebernimmt hier die Rolle des
                  Auftakts, sonst stehen zwei rote Marker nebeneinander. */}
              <Eyebrow dark={!compact} mark={false}>
                Instagram
              </Eyebrow>
            </div>
            {/* Kritiker final-2, Issue 2 ("Phones/Kanaele-Sektion kuerzen"): die Zeile lief mit
                lg:56px auf derselben Stufe wie die Kapitel-H2 von Kurs, Team und Preis. Als
                Ausblick direkt vor dem Footer soll sie leiser sein als die Entscheidungs-
                Kapitel. Auf /fotos ist sie dagegen die Sektions-H2 und behaelt ihre Groesse.
                S1 (14.08.2026): beide Zweige laufen jetzt auf .type-h2. Die alte Staffelung
                war 44px auf der Home gegen 56px auf /fotos, dieselbe Ebene in zwei Groessen,
                genau der Befund dieser Scheibe. Leiser wird die Sektion ueber ihre Position
                und den Weissraum, nicht ueber eine eigene Schriftgroesse. */}
            {/* R134/8: Auf der Startseite stand hier "Siempre con Flow." — eine
                Stimmungszeile, die nicht sagt, was darunter kommt. Der Brief verlangt auf
                Route / keine poetische Zeile. Die Ueberschrift nennt jetzt den Inhalt, der
                erklaerende Satz darunter entfaellt dort (er sagte dasselbe zweimal).
                Auf /fotos bleibt die Zeile: dort ist sie der Sektions-Titel einer
                Bildergalerie, nicht der Ersatz fuer eine Aussage. */}
            <h2 className="type-h2 mt-5">
              {onHome
                ? lang === 'de'
                  ? 'Kurse und Abende aus dem Studio.'
                  : 'Classes and nights from the studio.'
                : 'Siempre con Flow.'}
            </h2>
            <p className={cn('mt-5 max-w-lg text-pretty text-base leading-relaxed sm:text-lg', compact ? 'text-[var(--color-ink-muted)]' : 'text-white/75')}>
              {lang === 'de'
                ? 'Kurse, Choreografien und echte Abende aus dem Studio. Direkt von Salsaflow auf Instagram.'
                : 'Classes, choreographies and real nights from the studio. Directly from Salsaflow on Instagram.'}
            </p>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={lang === 'de' ? 'Salsaflow auf Instagram folgen' : 'Follow Salsaflow on Instagram'}
              className={cn(
                'mt-5 inline-flex w-fit min-h-12 items-center gap-2 self-start rounded-full px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                compact
                  ? 'border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white focus-visible:ring-[var(--color-salsa)]'
                  : 'bg-white text-[var(--color-ink)] hover:bg-[var(--color-salsa)] hover:text-white focus-visible:ring-white focus-visible:ring-offset-[var(--color-ink)]',
                // Ring-Offset muss die tatsaechliche Sektionsflaeche treffen, sonst zeichnet der
                // Fokusring einen falschfarbenen Rahmen. Die Flaeche haengt am Einsatzort (s.o.).
                compact && (onHome ? 'focus-visible:ring-offset-[var(--color-paper-warm)]' : 'focus-visible:ring-offset-[var(--color-bg-soft)]'),
              )}
            >
              <InstagramIcon className="h-5 w-5" />
              {lang === 'de' ? '@salsaflowdc folgen' : 'Follow @salsaflowdc'}
              <ExternalLink aria-hidden className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Runde 2, Issue 9 (Home ist zu lang): `grid-cols-1` war auf 390px der groesste
              einzelne Block der Startseite - gemessen 2482px, also 2,9 Bildschirme von 21.
              Ursache: vier 9:16-Videos in EINER Spalte. Bei 350px Innenbreite ist jede Karte
              622px hoch, macht 4x622 + 3x16 Gap = 2537px. Mehrspaltig lesen sie sich als EIN
              Block statt als vier Sektionen.

              Kritiker final-2, im gerenderten Bild dieses Durchgangs nachgeprueft: das Raster
              stand auf `grid-cols-2 md:grid-cols-4`, INSTAGRAM_VIDEOS hat aber nur DREI
              Eintraege (s.o. Zeile 19). Auf Mobil ergab 3 mod 2 = 1 dieselbe Waisen-Karte wie
              auf /team (Issue 5) — zwei Karten oben, eine allein links darunter; md:grid-cols-4
              liess ausserdem eine ganze Spalte leer.
              Drei Spalten auf 390px wurden am gerenderten Screenshot geprueft und verworfen:
              bei ~110px Kartenbreite brechen Titel und Badge ineinander. Darum flex-wrap wie
              auf /team — zwei Spalten auf Mobil mit ZENTRIERTER Restzeile, ab sm drei Spalten,
              wo alle drei Videos in eine Zeile passen. */}
          {/* S4 (14.08.2026), Mobil-390-Befund: das Raster lief auf `flex-wrap` mit zwei
              Spalten. Bei drei Beitraegen ergab das den 2+1-Bruch (zwei Karten oben, eine
              allein darunter), und jede Karte war nur ~168px breit, Titel und Badge
              standen ineinander. Ausserdem war die Zahl der Karten damit an das Layout
              gebunden: vier Beitraege aus dem Feed haetten dieselbe Waise erzeugt.

              Jetzt bis sm ein horizontaler Snap-Slider: EINE Karte pro Blick auf 82%
              Breite (der Rand der naechsten Karte zeigt, dass es weitergeht), Scroll
              rastet ein. Ab sm ein normales Raster, das mit der Feed-Laenge waechst.
              Der Slider braucht kein JS und keine Autoplay-Bewegung, also gibt es hier
              auch nichts, was `prefers-reduced-motion` abschalten muesste. */}
          <motion.div
            variants={item}
            className={cn(
              'flex min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-2 max-sm:pr-14',
              '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              'sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 sm:pr-0 lg:grid-cols-3',
            )}
          >
            {posts.map((post) => (
              <div
                key={post.shortcode}
                className={cn(
                  'w-[82%] shrink-0 snap-start sm:w-auto sm:shrink',
                  // S4 (14.08.2026), Mobil-Peek: die letzte Karte sass hart an der
                  // Viewport-Kante (rechter Rand = abgeschnittene Karte 2 liest sich
                  // wie Seitenende, nicht wie "wischen lohnt"). mr-5 gibt dem Auslauf
                  // denselben Rand wie den Einlauf (px-5 links) — der rechte Peek
                  // schwebt dann frei statt zu kleben, und das Scroll-Ende zeigt Luft.
                  // Ab sm laeuft das normale Raster ohne Slider-Rand.
                  'sm:last:mr-0',
                )}
              >
                <InstagramVideoCard post={post} compact={onHome} />
              </div>
            ))}
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}
