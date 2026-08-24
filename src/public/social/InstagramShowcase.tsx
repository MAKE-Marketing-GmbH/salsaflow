// Woher die Beitraege kommen: src/public/social/instagram-feed.ts. Hier steht KEIN
// Shortcode mehr. Wer den Feed wechselt (Behold, Graph API) oder aktualisiert
// (scripts/refresh-instagram-feed.mjs), fasst nur die Datendatei an, nicht dieses Layout.

import { type CSSProperties } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { CONTACT } from '@/public/site/SiteFooter';
import { InstagramIcon } from '@/public/site/BrandIcons';
import { Eyebrow, Shell, sectionLead } from '@/public/site/primitives';
import { Reveal, useReveal } from '@/public/home/motion';
import { SECTION_Y, SECTION_Y_HOME } from '@/public/home/kit';
import { getInstagramFeed, type FeedPost } from '@/public/social/instagram-feed';
import { cn } from '@/lib/utils';

/* Die Breite, ab der Instagrams eigener Embed-Kopf (Avatar, Kontoname, Audiozeile,
   "Profil ansehen") kollisionsfrei nebeneinander passt. Am echten Embed gemessen,
   nicht geschaetzt: bei 320px ueberlappen die Elemente noch, ab 360px nicht mehr —
   fuer alle drei Shortcodes aus instagram-feed.ts.
   Beleg: worklog/shots/CRITIC-0824-0457/_log-igthresh.json.
   Wer diesen Wert senkt, holt den zerstoerten Kopf zurueck.

   Die Schwelle gilt fuer das IFRAME, nicht fuer die Karte. Die Karte traegt
   links und rechts je 1px Rand (border border-white/15), also braucht sie zwei
   Pixel mehr — sonst misst das Iframe 358px und der Kopf kollidiert wieder
   (gemessen, zweite Fassung dieses Fixes). */
const IG_EMBED_MIN = 360;
const IG_CARD_BORDER = 2;
const IG_CARD_MIN = IG_EMBED_MIN + IG_CARD_BORDER;

function InstagramVideoCard({ post, compact = false }: { post: FeedPost; compact?: boolean }) {
  const { lang } = useLang();
  const title = lang === 'de' ? post.titel : post.titelEn;
  const postUrl = post.url;
  const iframeTitle = lang === 'de' ? `${title} auf Instagram` : `${title} on Instagram`;
  const directLabel = lang === 'de' ? `${title} direkt auf Instagram öffnen` : `Open ${title} directly on Instagram`;

  return (
    <article data-component-unit="component.instagram-video-card" className="group relative isolate flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/15 bg-[var(--color-ink)] shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)]">
      {/* R207 (Raphael 23.08. 17:10): "Instagram: echtes Instagram-Embed, nicht nur Bilder
          die so tun als waeren sie Instagram." Das iframe laed jetzt SOFORT (loading=lazy),
          ohne Klick-Facade. Die Karte zeigt das echte Instagram-UI — Header mit Avatar,
          Play-Button und Caption sind im Embed sichtbar. */}
      <div className={cn('relative w-full overflow-hidden bg-[var(--color-ink)]', compact ? 'aspect-[5/4]' : 'aspect-[9/16]')}>
        <iframe
          src={`${postUrl}embed/captioned/`}
          title={iframeTitle}
          className="absolute inset-0 h-full w-full border-0 bg-[var(--color-ink)]"
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {/* Der Titel steht UNTER der Buehne. Zwei Gruende:
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
            {lang === 'de' ? 'Eingebettet von Instagram' : 'Embedded from Instagram'}
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
            die Luecke oben ueber dem Kopf. Statt die Spalte kuenstlich zu strecken lief
            der Kopf mit (lg:sticky), dieselbe Loesung wie in der Home-FAQ und in der
            Preise-FitSection.

            R221 (Watcher 24.08. 06:24): diese Zweispalten-Anlage ist mit den breiten
            Embed-Karten aus R220 nicht mehr tragfaehig. Sie gab dem Raster nur die
            1.28fr-Spalte — gemessen 543px bei 1024 und 783px bei 1440. Drei Karten
            brauchen 3x362 + 2x16 = 1118px. Auf KEINER Desktop-Breite passten sie also
            in eine Zeile: 1024-1280 ergaben eine Einspalten-Kolonne mit bis zu 1372px
            hohen Kacheln, ab 1440 den 2+1-Bruch mit 400px toter Grid-Spur daneben.

            Der Kopf steht deshalb jetzt UEBER den Karten statt neben ihnen. Damit hat
            das Raster die volle Shell (1180-1400px) und drei Karten passen ab 1180 in
            eine Zeile. Der lg:sticky-Mitlauf entfaellt — er ergibt ohne Nachbarspalte
            keinen Sinn mehr. Route von Raphael am 24.08. bestaetigt. */}
        <Reveal className="grid gap-8">
          <motion.div variants={item} className="max-w-xl">
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
            {/* R190: war eine Kopie von `sectionLead` mit eigenem `mt-5` und mass damit
                20 px, waehrend jede andere Sektion der Startseite 16 px traegt.
                Der `!compact`-Zweig traegt hier KEINE Farbe mehr. Grund: beide
                Aufrufstellen setzen `compact` (HomePage.tsx:112, PhotosPage.tsx:258),
                der dunkle Pfad ist also unerreichbar. Ein Override, den niemand je
                rendert, liest sich wie eine gepruefte Entscheidung und ist keine. */}
            <p className={cn(sectionLead, 'max-w-lg text-pretty')}>
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
          {/* R220 (Watcher 24.08. 05:38): der Instagram-Kopf im Embed war in jeder
              Karte zerstoert — "Profil ansehen" lag auf dem Kontonamen, auf 390 lief
              der Kopf aus dem Iframe. Gemessen (scripts/r220-breite.cjs): die Site gab
              dem iframe 248px auf 1440 und 206px auf 390. Instagrams eigener Kopf
              braucht 360px, darunter kollidiert er (Schwelle am Standalone-Embed
              belegt, _log-igthresh.json).

              Nicht die Spaltenzahl war falsch, sondern dass es ueberhaupt eine feste
              gab: mit der damaligen Zweispalten-Anlage ergaben drei Spalten 250px bei
              1440 und nur 170px bei 1024. Keine feste Zahl trifft die Schwelle auf
              allen Breiten. Darum ein automatisches Raster mit der Schwelle als
              Minimum — es entscheidet selbst, wie viele Karten nebeneinander passen,
              und legt lieber eine um als eine zu quetschen. Faellt spaeter eine vierte
              Karte in den Feed, gilt dieselbe Regel ohne neuen Breakpoint.

              R221: `auto-fill` wurde zu `auto-fit`. Der Unterschied zaehlt erst,
              seit der Kopf ueber den Karten steht und das Raster die volle Shell hat:
              auto-fill haelt leere Spuren offen (bei 1400px Shell waeren das drei
              Karten + eine leere vierte Spur), auto-fit klappt sie zusammen und
              verteilt die Breite auf die vorhandenen Karten. Genau die offene Spur
              war der 400px-Totraum im 06:24-Befund.

              Auf Mobil reichte die Schwelle allein nicht: der Slider erbt die
              Seitenraender der Shell und war nur 310px breit (mit max-sm:pr-14
                sogar effektiv weniger). Eine 362px-Karte darin wurde vom
              overflow-x der Slider-Box bei 330px abgeschnitten — das Iframe war
              innen korrekt, der Knopf trotzdem halb weg. Darum laeuft der Slider
              bis sm ueber die Shell-Kante hinaus (negative Raender, innen wieder
              ausgeglichen), damit die volle Kartenbreite sichtbar bleibt. */}
          <motion.div
            variants={item}
            className={cn(
              'flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-2',
              // Bis sm aus der Shell ausbrechen. Die Shell gibt links pl-5 und rechts
              // pr-[var(--wa-corner)] (Platz fuer den WhatsApp-Float); beides wird hier
              // per negativem Rand aufgehoben, damit die volle Viewportbreite zum
              // Scrollen zur Verfuegung steht. pl-5 setzt den Einlaufrand danach wieder
              // — der Slider soll unter dem Text beginnen, nicht an der Glaskante.
              // KEIN w-screen dazu: zusammen mit -mx ergab das eine um 20px nach links
              // versetzte Box, die Karte klebte dann bei x=0 am Bildschirmrand.
              //
              // Der Einlaufrand laeuft ueber scroll-pl, NICHT ueber pl: mit `pl-5`
              // scrollte sich der Slider im Ruhezustand selbst um genau diese 20px
              // (gemessen scrollLeft=20), weil `snap-start` die Karte an ihrer
              // Snap-Kante einrasten laesst und das Padding dabei wegschiebt.
              // scroll-padding verschiebt die Snap-Kante mit, statt gegen sie zu
              // arbeiten.
              'max-sm:-ml-5 max-sm:scroll-pl-5 max-sm:pl-5',
              '[-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              /* R221: Der Slider laeuft jetzt bis 1149px durch, nicht mehr nur bis sm.
                 Grund ist eine Rechnung, keine Vorliebe: drei Karten brauchen
                 3x362 + 2x16 = 1118px. Die Shell gibt innen `min(vw,1400) - 32`
                 (pl-8 links; den rechten `pr-[var(--wa-corner)]` holt das Raster
                 unten zurueck). Das erreicht 1118px erst ab 1150px Viewport —
                 bei 1024 stuenden selbst ohne jeden Rand nur 992px zur Verfuegung.

                 Darunter ein Raster zu erzwingen hiesse: entweder die 360px-Schwelle
                 aus R220 unterschreiten (verboten, holt den zerstoerten Kopf zurueck)
                 oder den 2+1-Bruch mit 460px toter Spur behalten (der Befund, der
                 R221 ausgeloest hat). Der Slider ist die dritte Antwort: alle drei
                 Karten in voller Breite, ohne Waise und ohne Einspalten-Kolonne. */
              'max-[1149px]:-mr-[var(--wa-corner)]',
              'min-[1150px]:grid min-[1150px]:snap-none min-[1150px]:grid-cols-[repeat(auto-fit,minmax(var(--ig-min),1fr))] min-[1150px]:gap-4 min-[1150px]:overflow-visible min-[1150px]:pb-0 min-[1150px]:pl-0 min-[1150px]:pr-0',
              /* Die 88px, die die Shell rechts fuer den WhatsApp-Float freihaelt, sind
                 unter dem Raster ungenutzt: der Float ist `fixed` und sitzt unten
                 rechts am Viewport, nicht in dieser Sektion. Das Raster holt sie
                 zurueck — bei 1180 sind es genau die fehlenden 58px zur dritten
                 Karte (1060 -> 1148). Ohne das bliebe 1180 in der 2+1-Waise. */
              'min-[1150px]:-mr-[var(--wa-corner)]',
            )}
            // SAFETY: CSSProperties kennt keine Custom Properties, `--ig-min` ist aber
            // ein gueltiger CSS-Name. Der Wert ist eine hier gebildete px-Zeichenkette
            // aus einer Zahlkonstante, kommt also nicht von aussen.
            style={{ '--ig-min': `${IG_CARD_MIN}px` } as CSSProperties}
          >
            {posts.map((post) => (
              <div
                key={post.shortcode}
                className={cn(
                  // R220: war `w-[82%]` und ergab auf 390px 206px Iframe-Breite — der
                  // Instagram-Kopf lief sichtbar aus der Karte heraus. Jetzt traegt die
                  // Karte die gemessene Schwelle. Kein Randabzug noetig: der Slider hat
                  // auf Mobil volle Viewportbreite (s.o.), die Karte darf sie ganz
                  // ausschoepfen. min() faengt Geraete unter 362px ab (iPhone SE misst
                  // 320px) — dort ist die Schwelle physisch nicht erreichbar, und eine
                  // Karte breiter als der Bildschirm waere schlechter als ein enger Kopf.
                  // R221: die Slider-Breite gilt jetzt bis 1149px (s.o. am Container),
                  // nicht mehr nur bis sm. Erst ab 1150px uebernimmt das Raster die
                  // Breitenverteilung, und die Karte gibt sie an `1fr` ab.
                  'w-[min(var(--ig-min),100vw)] shrink-0 snap-start min-[1150px]:w-auto min-[1150px]:shrink',
                  // Der rechte Auslauf sass frueher als pr-14 am Slider. Der ist mit
                  // dem Ausbruch aus der Shell weggefallen; die letzte Karte traegt
                  // ihn jetzt selbst, sonst klebt sie an der Viewportkante.
                  // S4 (14.08.2026), Mobil-Peek: die letzte Karte sass hart an der
                  // Viewport-Kante (rechter Rand = abgeschnittene Karte 2 liest sich
                  // wie Seitenende, nicht wie "wischen lohnt"). mr-5 gibt dem Auslauf
                  // denselben Rand wie den Einlauf (px-5 links) — der rechte Peek
                  // schwebt dann frei statt zu kleben, und das Scroll-Ende zeigt Luft.
                  'max-[1149px]:last:mr-5',
                  'min-[1150px]:last:mr-0',
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
