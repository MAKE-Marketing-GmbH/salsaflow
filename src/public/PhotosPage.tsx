// Fotos-Galerie unter /fotos (Bright Editorial, Geil-Pass v2). Heller Anker ist der neue Home-Hero:
// warme, helle Flaechen, 1400px-Shell, echte Fotos, Rot strikt sparsam. SiteHeader, ein heller
// Galerie-Hero, ein voller Album-Filter (Alle/Danceflow/Kurse/Team), das masonry-Grid mit
// barrierearmer Lightbox (role=dialog, ESC schliesst, Pfeiltasten blaettern, Fokus wandert und
// kehrt zurueck), dann Instagram-Band, Schluss-CTA und SiteFooter.
//
// Die Bilder kommen aus der kuratierten, in sich geschlossenen Liste (gallery/content.ts) - kein
// Laufzeit-Manifest mehr, damit die Galerie immer voll und vorhersehbar ist. Motion: der ruhige
// Fade-up-Takt aus @/public/home/motion (Reveal/useReveal), reduced-motion ist eingebaut.
//
// Das Raster zeigt reine Bilder: kein sichtbarer Bildtext unter der Kachel (Raphael 20.08.2026)
// und seit Runde 3 auch kein Album-Badge mehr auf der Kachel (kimi-critic: lag auf Koerpern,
// doppelte die Filter-Chips). Das Album steht im Filter und in der Album-Zeile darueber.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { Seo } from '@/lib/seo';
import { SiteHeader } from '@/public/site/SiteHeader';
import { SiteFooter } from '@/public/site/SiteFooter';
import { Shell, Eyebrow, TitleAccent, CtaPill, GoogleRating } from '@/public/site/primitives';
import { Reveal, useReveal, EASE_OUT, VIEWPORT, useHydrated } from '@/public/home/motion';
import { useReducedMotion, type Variants } from 'framer-motion';
import { GALLERY, ALBUM_ORDER, GALLERY_PHOTOS, type AlbumId } from '@/public/gallery/content';
import { InstagramShowcase } from '@/public/social/InstagramShowcase';

type Photo = { albumId: AlbumId; src: string; alt: string; width?: number; height?: number };
type Filter = AlbumId | 'all';
type Packed = { photo: Photo; index: number };

// Raphael 20.08.2026: die Kacheln tragen keinen sichtbaren Bildtext mehr. Der frühere
// captionFor() (Serie + Ort unter jeder Kachel) ist damit ersatzlos raus. Die Beschreibung
// lebt weiter im alt-Attribut und im aria-label des Foto-Buttons — Screenreader verlieren
// nichts, das Auge bekommt ein ruhiges Raster.

function packColumns(items: Packed[], n: number): Packed[][] {
  const cols: Packed[][] = Array.from({ length: n }, () => []);
  const heights = Array.from({ length: n }, () => 0);
  for (const item of items) {
    const ratio = (item.photo.height ?? 1350) / (item.photo.width ?? 1080);
    let slot = 0;
    for (let i = 1; i < n; i++) if (heights[i] < heights[slot]) slot = i;
    cols[slot].push(item);
    heights[slot] += ratio;
  }
  return cols;
}

/* R188 G1 (Video 01:20-01:29): "Schoene Reinflieg-Animationen ergaenzen (Bilder fliegen
 * beim Scrollen rein)."
 *
 * Vorher lag das ganze Raster in EINEM `Reveal`. Das ist ein einziger Container, der
 * einmal zuendet, wenn seine Oberkante in den Viewport kommt — bei einem Raster, das
 * mehrere Bildschirmhoehen hoch ist, heisst das: die obersten Kacheln blenden auf, alle
 * anderen stehen schon fertig da, bevor man sie sieht. Beim Scrollen fliegt nichts rein.
 *
 * Jetzt traegt JEDE Kachel ihren eigenen `whileInView`. Sie zuendet, wenn sie selbst
 * sichtbar wird, also genau beim Scrollen und ueber die ganze Seitenlaenge.
 *
 * Die Werte kommen aus dem bestehenden Motion-Vertrag des Repos (home/motion.tsx):
 * nur transform + opacity, EASE_OUT [0.22,1,0.36,1], `once: true`, Distanz <= 24px.
 * Der Versatz ist 18px plus ein leichtes scale 0.985 — dieselbe Sprache wie die
 * Bild-Reveals auf /team, kein neuer Effekt.
 *
 * reducedMotion: `useReducedMotion` nimmt Versatz UND Skalierung heraus, es bleibt ein
 * kurzer Fade. Vor der Hydration ist der Endzustand der Startzustand (useHydrated),
 * sonst schriebe der Prerender `opacity: 0` in jede Kachel und die Galerie waere ohne
 * JavaScript leer — derselbe Grund, aus dem `useReveal` den Haken schon traegt.
 */
function useTileReveal(): Variants {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  return {
    hidden: hydrated
      ? { opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.985 }
      : { opacity: 1, y: 0, scale: 1 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduced ? 0.3 : 0.55, ease: EASE_OUT },
    },
  };
}

function useGalleryCols() {
  const [n, setN] = useState(2);
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 64rem)');
    const sm = window.matchMedia('(min-width: 40rem)');
    const apply = () => setN(lg.matches ? 4 : sm.matches ? 3 : 2);
    apply();
    lg.addEventListener('change', apply);
    sm.addEventListener('change', apply);
    return () => {
      lg.removeEventListener('change', apply);
      sm.removeEventListener('change', apply);
    };
  }, []);
  return n;
}

export function PhotosPage() {
  const { lang } = useLang();
  const g = GALLERY[lang];
  const { item } = useReveal();
  const tileReveal = useTileReveal();
  const [filter, setFilter] = useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Sichtbare Fotos aus der kuratierten Liste, gefiltert. Team-Album bleibt draussen.
  // "Alle" mischt Abende, Kurse und Shows; ein Filter zeigt nur sein Album.
  // Jedes Foto bringt seine eigene, echte Alt-Zeile mit (aus gallery/content.ts).
  const colCount = useGalleryCols();
  const photos = useMemo<Photo[]>(() => {
    const visible = GALLERY_PHOTOS.filter((p) => p.albumId !== 'team');
    const base = filter === 'all' ? visible : visible.filter((p) => p.albumId === filter);
    return base.map((p) => ({ albumId: p.albumId, src: p.src, alt: lang === 'en' ? (p.altEn ?? p.alt) : p.alt, width: p.width, height: p.height }));
  }, [filter, lang]);
  const packed = useMemo(
    () => packColumns(photos.map((photo, index) => ({ photo, index })), colCount),
    [photos, colCount],
  );
  // Runde 3: firstOfAlbum ist mit dem Album-Badge weggefallen (kimi-critic).

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

        <section id="galerie" className="scroll-mt-24 bg-[var(--color-bg-soft)] pb-12 pt-12 sm:pb-14 sm:pt-16 lg:pb-16 lg:pt-20">
          <Shell>
            {/* Album-Filter */}
            <Reveal>
              <div className="flex flex-col gap-5 border-b border-[var(--color-line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <FilterHeader />
                <motion.div
                  variants={item}
                  // sm:pr-32: der fixe WhatsApp-FAB (rechte 140px-Zone) lag auf dem
                  // "Shows"-Chip (Critic Runde 6, Item 4).
                  className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end sm:pr-32"
                  role="group"
                  aria-label={lang === 'de' ? 'Album-Filter' : 'Album filter'}
                >
                  <FilterChip active={filter === 'all'} onClick={() => changeFilter('all')} testId="gallery-filter-all">
                    {g.filterAll}
                  </FilterChip>
                  {ALBUM_ORDER.filter((id) => id !== 'team').map((id) => (
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
                  <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                    {packed.map((col, ci) => (
                      <ul key={ci} className="flex flex-col gap-3 sm:gap-4">
                        {col.map(({ photo: p, index: i }, rowIndex) => (
                          <motion.li
                            key={`${filter}-${p.src}`}
                            data-reveal
                            variants={tileReveal}
                            initial="hidden"
                            whileInView="show"
                            viewport={VIEWPORT}
                            /* Kleiner Versatz je Reihe, damit die vier Spalten nicht
                               im Gleichschritt kippen. Bei 0.05s und maximal drei
                               Stufen bleibt es ein Takt, keine Warteschlange. */
                            transition={{ delay: (rowIndex % 3) * 0.05 }}
                          >
                            <button
                              type="button"
                              onClick={() => setLightboxIndex(i)}
                              aria-label={p.alt}
                              data-testid="gallery-photo"
                              className="group relative block w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] shadow-sm transition-shadow duration-[var(--dur-base)] hover:shadow-[0_16px_40px_-16px_rgba(17,17,17,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-salsa)] focus-visible:ring-offset-2"
                            >
                              {/* Kein object-cover und kein festes Kachel-Verhaeltnis: h-auto laesst
                                  jedes Foto in seinem eigenen Seitenverhaeltnis stehen, packColumns
                                  rechnet mit genau diesem Verhaeltnis. Die Kachel schneidet also
                                  nichts ab. Angeschnittene Koepfe am Rand stecken schon im Original
                                  (geprueft an gallery/danceflow/01-v3.webp, 2048x1360: der Partner
                                  ist in der Quelle angeschnitten). object-position waere hier ohne
                                  Wirkung — der Fix muesste das Foto selbst ersetzen. */}
                              <img
                                src={p.src}
                                alt={p.alt}
                                className="block h-auto w-full transition-transform duration-[var(--dur-slow)] ease-out group-hover:scale-[1.04]"
                                width={p.width ?? 1080}
                                height={p.height ?? 1350}
                                loading="lazy"
                              />
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
                              {/* Runde 3 (kimi-critic): das Album-Badge auf der ersten Kachel
                                  ist raus. Es lag unsystematisch auf Koerpern und Gesichtern und
                                  wiederholte nur die Filter-Chips, die direkt darueber stehen.
                                  Das Album steht weiter im Filter und in der Album-Zeile. */}
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    ))}
                  </div>
                  <p className="mt-2 border-t border-[var(--color-line)] pt-3 text-center text-sm text-[var(--color-ink-muted)]">
                    {photos.length} {lang === 'de' ? 'Fotos' : 'photos'}
                  </p>
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

      <Shell className="grid grid-cols-1 items-start gap-10 pb-12 pt-[calc(var(--nav-h)+2.25rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-16 lg:pt-[calc(var(--nav-h)+3rem)]">
        <Reveal className="max-w-2xl">
          {/* Hero-Eyebrow raus (Meta-Kritik 2026-08-07): identischer Seiteneinstieg sitewide. */}
          <motion.h1
            variants={item}
            className="type-h1 mt-5"
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
          <motion.div variants={item} className="mt-8">
            <CtaPill href="#galerie">{lang === 'de' ? 'Fotos ansehen' : 'See the photos'}</CtaPill>
          </motion.div>
        </Reveal>

        {/* Kompakte Drei-Foto-Komposition (echte, helle Fotos). */}
        <Reveal className="relative">
          <motion.div variants={item} className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] bg-[var(--color-bg-soft)] shadow-[0_26px_60px_-30px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
              {/* Kontext statt Portrait (Auftrag 19.08.2026): anniversary-recap-v2 zeigte ein
                  einzelnes, eng geschnittenes Gesicht und las sich wie ein Portraet. Ersatz ist
                  die volle Community-Menge an einem Abend. object-right, weil der mittige 4/5-Crop
                  das Salsaflow-Wasserzeichen unten links anschneidet (Crop-Vergleich
                  /tmp/fotocrop/crowd-right.png gegen crowd-45.png). */}
              <img
                src="/photos/2026/community-crowd-01.webp"
                alt={lang === 'de' ? 'Volle Salsaflow-Community feiert gemeinsam an einem Tanzabend' : 'The full Salsaflow community celebrating together at a dance night'}
                className="h-full w-full object-cover object-right"
                width={1920}
                height={1281}
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
      {/* Runde 3 (kimi-critic): "Such nicht ewig. Spring direkt in den Moment..."
          war ein Werbe-Imperativ ohne Information. Die Zeile sagt jetzt, was die
          Chips darunter tun. */}
      <p className="mt-3 max-w-2xl text-xl font-semibold leading-snug text-[var(--color-ink)] sm:text-2xl">
        {lang === 'de'
          ? 'Die Filter zeigen dir nur ein Album: Danceflow Nights, Kurse oder Shows.'
          : 'The filters show one album at a time: Danceflow Nights, courses or shows.'}
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
            className="type-h2 text-[var(--color-ink)]"
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
            <CtaPill href="/schnupperstunde">{c.cta}</CtaPill>
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
    // SAFETY: document.activeElement ist typisiert als Element | null. Die Lightbox oeffnet
    // ausschliesslich per Klick auf den Foto-Button, das aktive Element ist also ein
    // HTMLElement. Die Assertion behaelt | null und der einzige Zugriff unten ist der
    // optionale Aufruf previouslyFocused?.focus?.() — beide Faelle sind abgesichert.
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
