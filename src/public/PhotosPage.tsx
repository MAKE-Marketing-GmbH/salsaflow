// Fotos-Galerie unter /fotos (Bright Editorial, Geil-Pass v2). Heller Anker ist der neue Home-Hero:
// warme, helle Flaechen, 1400px-Shell, echte Fotos, Rot strikt sparsam. SiteHeader, ein heller
// Galerie-Hero, ein voller Album-Filter (Alle/Danceflow/Kurse/Team), das masonry-Grid mit
// barrierearmer Lightbox (role=dialog, ESC schliesst, Pfeiltasten blaettern, Fokus wandert und
// kehrt zurueck), dann Instagram-Band, Schluss-CTA und SiteFooter.
//
// Die Bilder kommen aus der kuratierten, in sich geschlossenen Liste (gallery/content.ts) - kein
// Laufzeit-Manifest mehr, damit die Galerie immer voll und vorhersehbar ist. Motion: der ruhige
// Fade-up-Takt aus @/public/home/motion (Reveal/useReveal), reduced-motion ist eingebaut.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { Shell, Eyebrow, TitleAccent, CtaPill, GoogleRating } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { GALLERY, ALBUM_ORDER, GALLERY_PHOTOS, type AlbumId } from '@/public/gallery/content';
import { InstagramShowcase } from '@/public/social/InstagramShowcase';

type Photo = { albumId: AlbumId; src: string; alt: string; width?: number; height?: number };
type Filter = AlbumId | 'all';

export function PhotosPage() {
  const { lang } = useLang();
  const g = GALLERY[lang];
  const { item } = useReveal();
  const [filter, setFilter] = useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Sichtbare Fotos aus der kuratierten Liste, gefiltert. "Alle" behaelt die gemischte
  // Reihenfolge (Abende, Kurse, Team, Shows im Wechsel); ein Filter zeigt nur sein Album.
  // Jedes Foto bringt seine eigene, echte Alt-Zeile mit (aus gallery/content.ts).
  const photos = useMemo<Photo[]>(() => {
    const base = filter === 'all' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((p) => p.albumId === filter);
    return base.map((p) => ({ albumId: p.albumId, src: p.src, alt: lang === 'en' ? (p.altEn ?? p.alt) : p.alt, width: p.width, height: p.height }));
  }, [filter, lang]);

  // Filterwechsel schliesst eine offene Lightbox (sonst zeigt der Index auf ein falsches Foto).
  function changeFilter(next: Filter) {
    setLightboxIndex(null);
    setFilter(next);
  }

  return (
    <>
      <Seo page="photos" />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <GalleryHero />

        <section className="bg-[var(--color-bg-soft)] pb-12 pt-12 sm:pb-14 sm:pt-16 lg:pb-16 lg:pt-20">
          <Shell>
            {/* Album-Filter */}
            <Reveal>
              <div className="flex flex-col gap-5 border-b border-[var(--color-line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <FilterHeader />
                <motion.div
                  variants={item}
                  // sm:pr-32: der fixe WhatsApp-FAB (rechte 140px-Zone) lag auf dem
                  // "Shows"-Chip (Critic Runde 6, Item 4).
                  className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap sm:justify-end sm:pr-32"
                  role="group"
                  aria-label={lang === 'de' ? 'Album-Filter' : 'Album filter'}
                >
                  <FilterChip active={filter === 'all'} onClick={() => changeFilter('all')} testId="gallery-filter-all">
                    {g.filterAll}
                  </FilterChip>
                  {ALBUM_ORDER.map((id) => (
                    <FilterChip
                      key={id}
                      active={filter === id}
                      onClick={() => changeFilter(id)}
                      testId={`gallery-filter-${id}`}
                    >
                      {g.albums[id].title}
                    </FilterChip>
                  ))}
                </motion.div>
              </div>
            </Reveal>

            <div className="mt-5 flex flex-col gap-2 text-sm text-[var(--color-ink-muted)] sm:flex-row sm:items-center sm:justify-between">
              <p role="status" aria-live="polite" aria-atomic="true">
                {photos.length} {photos.length === 1 ? g.photoCountOne : g.photoCountMany}
              </p>
              {filter !== 'all' && <p className="max-w-xl sm:text-right">{g.albums[filter].desc}</p>}
            </div>

            {/* Foto-Raster (masonry, klick oeffnet Lightbox) */}
            {photos.length === 0 ? (
              <p className="mt-8 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white px-5 py-12 text-center text-sm text-[var(--color-ink-muted)]">
                {g.empty}
              </p>
            ) : (
              <Reveal className="mt-6">
                <motion.div
                  variants={item}
                  className="rounded-[var(--radius-media)] border border-[var(--color-line)] bg-white p-3 shadow-[0_18px_55px_rgba(17,17,17,0.06)] sm:p-4"
                >
                  <ul className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5">
                    {photos.map((p, i) => (
                      <li key={`${filter}-${p.src}`} className="mb-3 break-inside-avoid sm:mb-4">
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(i)}
                          aria-label={p.alt}
                          data-testid="gallery-photo"
                          className="group relative block w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] shadow-sm transition-shadow duration-[var(--dur-base)] hover:shadow-[0_16px_40px_-16px_rgba(17,17,17,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
                        >
                          <img
                            src={p.src}
                            alt={p.alt}
                            /* Kein Zuschnitt mehr (13.08.2026). Vorher gab galleryTileAspect(i)
                               jeder Kachel ein Format nach ihrer Position im Raster — ein
                               Hochformat-Portraet konnte in einer 3:2-Kachel landen und verlor
                               dort 53 % seiner Hoehe. Der Ausgleich `object-[center_30%]` half
                               nur halb: gemessen klebte der Scheitel an der Oberkante.
                               Die Galerie ist ein Masonry-Raster (columns), es braucht gar keine
                               feste Kachelhoehe. Jedes Bild laeuft jetzt in seinem eigenen
                               Format. Darum tragen alle 88 Eintraege in gallery/content.ts ihre
                               echten Masse — ohne sie koennte der Browser die Hoehe nicht
                               reservieren und das Raster wuerde beim Laden springen. */
                            className="block h-auto w-full transition-transform duration-[var(--dur-slow)] ease-out group-hover:scale-[1.04]"
                            width={p.width ?? 1080}
                            height={p.height ?? 1350}
                            loading="lazy"
                          />
                          {/* Klick-Affordance: leichtes Abdunkeln + Vergroessern-Chip signalisieren,
                              dass die Kachel die Lightbox oeffnet (State-Signal, nicht nur Zoom). */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition-opacity duration-[var(--dur-base)] group-hover:opacity-100"
                          />
                          <span
                            aria-hidden
                            className="pointer-events-none absolute bottom-2.5 right-2.5 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] opacity-0 shadow-sm backdrop-blur-sm transition-[transform,opacity] duration-[var(--dur-base)] ease-out group-hover:translate-y-0 group-hover:opacity-100"
                          >
                            <Maximize2 size={15} strokeWidth={2} />
                          </span>
                          {i < 2 && (
                            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[var(--color-ink)] shadow-sm backdrop-blur">
                              {g.albums[p.albumId].title}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            )}
          </Shell>
        </section>

        <InstagramShowcase compact data-design-unit="photos.instagram-showcase" />
        <GalleryClosing />
      </main>
      {/* GalleryClosing ist der Schluss-CTA dieser Seite — das Einstiegs-Band im Footer
          waere ein doppelter CTA direkt darunter (Kritik 10.08.2026, sitewide-Regel in
          subpage/kit.tsx: Seiten mit eigenem Closer setzen entryCta aus). */}
      <SiteFooter entryCta={false} />

      {lightboxIndex !== null && photos[lightboxIndex] && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          setIndex={setLightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------- Hero */
// Heller Bright-Editorial-Hero (Anker: Home-Hero). Links Eyebrow + Headline + Lead +
// echte Google-Sterne, rechts eine kompakte Drei-Foto-Komposition aus hellen Kurs- und
// Danceflow-Fotos. Ruhiger Fade-up-Takt beim Laden (Reveal/useReveal).
function GalleryHero() {
  const { lang } = useLang();
  const h = GALLERY[lang].hero;
  const { item } = useReveal();
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-paper-warm)] text-[var(--color-ink)]">
      {/* Feiner warmer Lichtschein oben rechts - Leben ohne Dunkel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(173,24,39,0.06)_0%,transparent_68%)]"
      />

      <Shell className="grid grid-cols-1 items-center gap-10 pb-12 pt-[calc(var(--nav-h)+2.25rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-16 lg:pt-[calc(var(--nav-h)+3rem)]">
        <Reveal className="max-w-2xl">
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          <motion.h1
            variants={item}
            className="mt-5 font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.025em] text-balance sm:text-[3.3rem] lg:text-[3.9rem]"
          >
            {h.titleA} <TitleAccent>{h.titleAccent}</TitleAccent>
            {h.titleB ? ` ${h.titleB}` : ''}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[var(--color-ink-muted)]"
          >
            {h.lead}
          </motion.p>
          <motion.div variants={item} className="mt-7">
            <GoogleRating />
          </motion.div>
        </Reveal>

        {/* Kompakte Drei-Foto-Komposition (echte, helle Fotos). */}
        <Reveal className="relative">
          <motion.div variants={item} className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_26px_60px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
              <img
                src="/photos/instagram/anniversary-recap-v2.webp"
                alt={lang === 'de' ? 'Tänzerinnen und Tänzer am Salsaflow Anniversary Weekend' : 'Dancers at the Salsaflow Anniversary Weekend'}
                className="h-full w-full object-cover object-center"
                width={1080}
                height={1916}
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="grid gap-3 sm:gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_20px_48px_-26px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
                <img
                  src="/photos/instagram/studio-flow-v2.webp"
                  alt={lang === 'de' ? 'Salsaflow-Gruppe tanzt gemeinsam im hellen Studio' : 'Salsaflow group dancing together in the bright studio'}
                  className="h-full w-full object-cover object-center"
                  width={1080}
                  height={1916}
                  loading="eager"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_20px_48px_-26px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
                <img
                  src="/photos/instagram/lady-style-v2.webp"
                  alt={lang === 'de' ? 'Lady-Style-Gruppe bei einer Choreografie im Studio' : 'Lady Style group performing choreography in the studio'}
                  // 20% statt Mitte: Hochformat in 4/3-Kachel — mittig fehlten alle fuenf
                  // Koepfe (Kopf-Schnitt-Sweep 13.08.2026, Crop-Vergleich /tmp/ls-crop-20.png).
                  className="h-full w-full object-cover object-[center_20%]"
                  width={640}
                  height={1136}
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

// Kopf ueber dem Filter (Eyebrow + eine Zeile). Eigene Komponente, damit useReveal sauber laeuft.
function FilterHeader() {
  const { lang } = useLang();
  const { item } = useReveal();
  return (
    <motion.div variants={item}>
      <Eyebrow>{lang === 'de' ? 'Galerie' : 'Gallery'}</Eyebrow>
      <p className="mt-3 max-w-2xl text-xl font-semibold leading-snug text-[var(--color-ink)] sm:text-2xl">
        {lang === 'de'
          ? 'Such nicht ewig. Spring direkt in den Moment, der dich interessiert.'
          : "Don't search forever. Jump straight to the moment that interests you."}
      </p>
    </motion.div>
  );
}

// Tile-Seitenverhaeltnisse fuer ein lebendiges masonry-Raster (object-cover schneidet passend zu).
/* ---------------------------------------------------------------------------- Closing */
function GalleryClosing() {
  const { lang } = useLang();
  const c = GALLERY[lang].closing;
  const { item } = useReveal();
  return (
    <section className="bg-[var(--color-paper-warm)] py-16 lg:py-24">
      <Shell className="max-w-3xl text-center">
        <Reveal>
          <motion.h2
            variants={item}
            className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            {c.title} {c.titleAccent}
          </motion.h2>
          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg"
          >
            {c.body}
          </motion.p>
          {/* Runde 2, Issue 2: Glow-Halo raus, EINE Button-Definition (CtaPill). */}
          <motion.div variants={item} className="mt-8 flex justify-center">
            <CtaPill href="/kontakt#schnupperstunde">{c.cta}</CtaPill>
          </motion.div>
        </Reveal>
      </Shell>
    </section>
  );
}

/* ---------------------------------------------------------------------------- Filter-Chip */
function FilterChip({
  active,
  onClick,
  testId,
  children,
}: {
  active: boolean;
  onClick: () => void;
  testId?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-testid={testId}
      className={cn(
        'min-h-11 rounded-full border px-4 py-2 text-center text-sm font-semibold leading-tight transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2',
        active
          ? 'border-[var(--color-salsa)] bg-[var(--color-salsa)] text-white'
          : 'border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]',
      )}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------------------
 * Barrierearme Lightbox: role=dialog + aria-modal. ESC schliesst, Pfeiltasten blaettern
 * (mit Umlauf). Beim Oeffnen wandert der Fokus auf den Schliessen-Knopf, beim Schliessen
 * zurueck auf das ausloesende Foto. Body-Scroll ist gesperrt, solange die Lightbox offen ist.
 * Icons sind Lucide (ChevronLeft/Right, X).
 * -------------------------------------------------------------------------- */
function Lightbox({
  photos,
  index,
  setIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const lb = GALLERY[lang].lightbox;
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(index);
  const photo = photos[index];

  indexRef.current = index;
  const prev = () => setIndex((indexRef.current - 1 + photos.length) % photos.length);
  const next = () => setIndex((indexRef.current + 1) % photos.length);

  useEffect(() => {
    // Fokus beim Oeffnen merken und am Ende zuruecksetzen (Fokus-Falle leicht gehalten).
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'Tab') {
        const items = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])') ?? [])]
          .filter((element) => element.getClientRects().length > 0);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose, photos.length]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${index + 1} ${lb.counter} ${photos.length}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={(e) => {
        // Klick auf den dunklen Hintergrund schliesst (nicht der Klick aufs Bild).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Schliessen */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={lb.close}
        className="t-hover absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X size={22} strokeWidth={2} aria-hidden />
      </button>

      {/* Vorheriges */}
      <button
        type="button"
        onClick={prev}
        aria-label={lb.prev}
        className="t-hover absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
      >
        <ChevronLeft size={24} strokeWidth={2} aria-hidden />
      </button>

      {/* Bild + Zaehler */}
      <figure className="flex max-h-full max-w-5xl flex-col items-center gap-4">
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-h-[78vh] w-auto rounded-[var(--radius-card)] object-contain shadow-2xl"
        />
        <figcaption role="status" aria-live="polite" aria-atomic="true" className="text-sm font-medium text-white/80">
          {index + 1} {lb.counter} {photos.length}
        </figcaption>
      </figure>

      {/* Naechstes */}
      <button
        type="button"
        onClick={next}
        aria-label={lb.next}
        className="t-hover absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
      >
        <ChevronRight size={24} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
