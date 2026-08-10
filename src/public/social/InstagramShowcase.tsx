import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { CONTACT, InstagramIcon } from '@/public/site/SiteFooter';
import { Eyebrow, Shell } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { SECTION_Y, SECTION_Y_HOME } from '@/public/home/kit';
import { cn } from '@/lib/utils';

type InstagramVideo = {
  shortcode: string;
  poster: string;
  width: number;
  height: number;
  de: string;
  en: string;
};

const INSTAGRAM_VIDEOS: InstagramVideo[] = [
  {
    shortcode: 'DX-Cz9MNkG_',
    poster: '/photos/instagram/anniversary-recap-v2.webp',
    width: 1080,
    height: 1916,
    de: 'Anniversary Weekend 2026',
    en: 'Anniversary Weekend 2026',
  },
  {
    shortcode: 'DahpxEVtWvm',
    poster: '/photos/instagram/choreography-v2.webp',
    width: 640,
    height: 1136,
    de: 'Choreografie von Salsaflow',
    en: 'Salsaflow choreography',
  },
  {
    shortcode: 'DYhKD7ONhfK',
    poster: '/photos/instagram/lady-style-v2.webp',
    width: 640,
    height: 1136,
    de: 'Body Movement und Lady Style',
    en: 'Body Movement and Lady Style',
  },
];

function InstagramVideoCard({ video }: { video: InstagramVideo }) {
  const { lang } = useLang();
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const title = lang === 'de' ? video.de : video.en;
  const postUrl = `https://www.instagram.com/reel/${video.shortcode}/`;
  const iframeTitle = lang === 'de' ? `${title} auf Instagram` : `${title} on Instagram`;
  const loadLabel = lang === 'de' ? `${title} von Instagram laden` : `Load ${title} from Instagram`;
  const directLabel = lang === 'de' ? `${title} direkt auf Instagram öffnen` : `Open ${title} directly on Instagram`;

  useEffect(() => {
    if (!loaded) return;
    const frame = window.requestAnimationFrame(() => iframeRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [loaded]);

  return (
    <article data-component-unit="component.instagram-video-card" className="group relative isolate overflow-hidden rounded-[1.5rem] border border-white/15 bg-[var(--color-ink)] shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)]">
      <div className="relative aspect-[9/16] w-full bg-[var(--color-ink)]">
        {loaded ? (
          <iframe
            ref={iframeRef}
            src={`${postUrl}embed/captioned/`}
            title={iframeTitle}
            className="absolute inset-0 h-full w-full border-0 bg-white"
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            tabIndex={-1}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label={loadLabel}
            className="absolute inset-0 h-full w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          >
            <img
              src={video.poster}
              alt=""
              width={video.width}
              height={video.height}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
            />
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.02)_0%,rgba(10,10,10,0.08)_45%,rgba(10,10,10,0.82)_100%)]" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--color-ink)] shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 motion-safe:group-hover:scale-105">
                <Play aria-hidden className="ml-1 h-6 w-6 fill-current" strokeWidth={1.5} />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/75">
                <InstagramIcon className="h-4 w-4" />
                @salsaflowdc
              </span>
              <span className="mt-2 block font-display text-xl font-bold leading-tight text-balance">{title}</span>
            </span>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[var(--color-ink)] px-4 py-3 text-white">
        <span className="inline-flex items-center gap-1.5 text-xs text-white/65">
          <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
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
          <motion.div variants={item} className="max-w-xl lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <Eyebrow dark={!compact}>Instagram</Eyebrow>
            {/* Kritiker final-2, Issue 2 ("Phones/Kanaele-Sektion kuerzen"): die Zeile lief mit
                lg:56px auf derselben Stufe wie die Kapitel-H2 von Kurs, Team und Preis. Als
                Ausblick direkt vor dem Footer soll sie leiser sein als die Entscheidungs-
                Kapitel — auf /fotos ist sie dagegen die Sektions-H2 und behaelt ihre Groesse. */}
            <h2
              className={cn(
                'mt-5 font-display font-bold leading-[0.98] tracking-[-0.025em] text-balance',
                onHome ? 'text-3xl sm:text-4xl lg:text-[2.75rem]' : 'text-4xl sm:text-5xl lg:text-[3.5rem]',
              )}
            >
              Siempre con Flow.
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
                'mt-7 inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
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
          <motion.div variants={item} className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {INSTAGRAM_VIDEOS.map((video) => (
              <div key={video.shortcode} className="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2rem)/3)]">
                <InstagramVideoCard video={video} />
              </div>
            ))}
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}
