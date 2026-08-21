// WhatsApp-Floating-Knopf (Sitewide-Shell, sitewide.md §7). Rundes, fixes Icon unten rechts,
// rechts unten, weiss auf gruen, auch auf dem Handy. Direkter Draht zu +41 76 478 84 11.
// Liegt z-technisch unter dem Nav-Drawer (z-50), aber über dem
// Seiteninhalt. Wenn der Cookie-Banner offen ist (Prop `raised`), weicht der Knopf nach oben aus,
// damit er das Banner nicht überlappt (z-Order aus sitewide.md §7/§8).
// Sobald der Footer in den Viewport kommt, blendet der Knopf aus: Der Footer traegt im
// Entry-CTA-Band einen eigenen WhatsApp-Button, den der Float sonst ueberlappt (Kritiker-
// Befund kursplan d-mid, Runde 10) — gleiche Footer-Beobachtung wie CookieBanner.tsx.

import { useEffect, useRef, useState } from 'react';
import { WhatsAppIcon } from '@/public/site/BrandIcons';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';

const WHATSAPP_URL = 'https://wa.me/41764788411';

/* Breite, die das Label "WhatsApp" plus Innenabstand der Pille belegt. Gemessen auf
   1440px: Pille 122px, Kreis 56px. Der Solver braucht die Zahl, um im kompakten Zustand
   noch zu wissen, wie breit der Knopf mit Label waere — sonst kann er nie zurueck. */
const LABEL_WIDTH = 66;

export function WhatsAppFloat({ raised = false, className = '' }: { raised?: boolean; className?: string }) {
  const { lang } = useLang();
  const label = lang === 'de' ? 'Schreib uns auf WhatsApp' : 'Message us on WhatsApp';
  // Footer sichtbar -> Float weg (Doppel-WhatsApp + Overlap mit Footer-Button vermeiden).
  const [footerInView, setFooterInView] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [headerDocked, setHeaderDocked] = useState(false);
  const floatRef = useRef<HTMLAnchorElement>(null);
  const collisionLiftRef = useRef(0);
  const collisionBlockedRef = useRef(false);
  const headerDockedRef = useRef(false);
  const compactRef = useRef(false);
  const [compact, setCompact] = useState(false);
  const [collisionLift, setCollisionLift] = useState(0);
  const [collisionBlocked, setCollisionBlocked] = useState(false);
  // R134/10, geschaerft R153: Raphael will keine 0815-Animation. Kein Puls, kein Ping-Ring,
  // kein Scale, kein Wackeln. Der Knopf kommt EINMAL herein — nur opacity und translateY.
  // Danach ist Ruhe; Bewegung gibt es nur noch auf Hover.
  // Der Auftritt liegt in `.whatsapp-float` in index.css, innerhalb einer
  // `prefers-reduced-motion: no-preference`-Media-Query. Kein React-State, kein
  // `useReducedMotion` im Markup: Server und Client rendern damit dieselben Klassen.

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterInView(!!entry?.isIntersecting),
      // Frueh genug ausblenden, bevor der Float das Entry-CTA-Band beruehrt.
      { root: null, rootMargin: '0px 0px -48px 0px', threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const check = () => {
      setDialogOpen(!!document.querySelector('[data-testid="booking-dialog"], [aria-modal="true"]'));
    };
    check();
    const obs = new MutationObserver(check);
    obs?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'data-testid'],
    });
    return () => obs?.disconnect();
  }, []);

  /* R188 / AAA: Kollisionsschutz auf JEDEM Viewport, nicht nur mobil.
   *
   * Der Knopf schwebt fix ueber der Seite. Ob er etwas verdeckt, entscheidet allein die
   * Frage, was gerade unter seiner Flaeche liegt — und die Antwort wechselt mit jeder
   * Scrollposition und jeder Route. Genau daran sind die bisherigen Loesungen gescheitert:
   * sieben Route-Sonderregeln in index.css (R101, R138, R139 ...) und eine kleinere Blase
   * auf Mobil. Jede davon fixt eine einzelne Stelle, keine die Klasse.
   *
   * Gemessene Reste am 21.08. nach der mobilen Runde:
   *   /tanzkurse/heels Desktop 1440: der Kreis lag mit rund 28px auf dem Kursinhalte-Foto
   *     (Knopf x=1360..1416, Bild endet x=1387).
   *   /tanzkurse/heels Mobil 390 im Fold: der Kreis lag auf dem Chip
   *     "Level je nach aktuellem Kursplan" (Knopf x=330..378, Chip laeuft bis x=369).
   * Beides sind KEINE Textknoten im bisherigen Sinn: das eine ist ein Bild, das andere
   * ein Chip, dessen Text vor dem Knopf endet, dessen Rand aber darunter laeuft.
   *
   * Der Solver liest darum jetzt drei Arten von Inhalt:
   *   1. sichtbare Text-Zeilen (unveraendert, inkl. Preise),
   *   2. Bilder und Video-Flaechen,
   *   3. abgegrenzte Flaechen mit eigenem Rand oder Fuellung (Chips, Karten, Knoepfe).
   * Findet er unter dem Knopf etwas davon, steigt der Knopf in 56px-Schritten, bis der
   * Platz frei ist. Er veraendert dabei kein Layout und keine Copy.
   *
   * Der Scan laeuft auf allen Breiten, aber nur bei Scroll/Resize und gebuendelt in
   * requestAnimationFrame. Slots oberhalb der Kopfzeile sind gesperrt, solange die
   * Kopfzeile steht. Ist der rechte Rand ueber die volle Hoehe belegt, blendet der Knopf
   * fuer diesen Bildschirm aus und kehrt beim naechsten freien Zustand zurueck — lieber
   * kurz weg als dauerhaft auf einem Gesicht. Reduced Motion: die bestehende CSS-Regel
   * setzt die Transition-Dauer auf 0.01ms. */
  useEffect(() => {
    let frame = 0;
    let settleTimer = 0;

    const measure = () => {
      frame = 0;
      const float = floatRef.current;
      if (!float) return;

      const current = float.getBoundingClientRect();
      // Aktuelle Verschiebung herausrechnen: so bleibt der Ausgangspunkt stabil und der
      // Knopf springt nicht zwischen zwei Slots hin und her.
      const baseTop = current.top + collisionLiftRef.current;
      const baseBottom = current.bottom + collisionLiftRef.current;
      /* Der Knopf weicht nach OBEN aus (positive Werte) und, wenn noetig, nach UNTEN
         (negative). Nur nach oben zu suchen war ein blinder Fleck: auf der Startseite
         Desktop 1440 endet das Hero-Foto bei y=768, der Knopf sass bei y=746 und alle
         Aufwaerts-Slots lagen im Foto. Frei waren die 132px DARUNTER. Ohne die negativen
         Stufen blendete der Knopf auf dem wichtigsten Bildschirm der Seite aus.
         Nach unten reichen kleine Schritte: viel Platz ist dort nie, sonst haette schon
         Stufe 0 gepasst. */
      const candidates = [0, -24, -48, 56, 112, 168, 224, 280, 336, 392, 448, 504, 560, 616, 672];
      const blockers: Array<{ top: number; bottom: number; left: number; right: number }> = [];
      const viewportH = window.innerHeight;
      const push = (rect: DOMRect) => {
        if (rect.width <= 1 || rect.height <= 1) return;
        if (rect.bottom <= 0 || rect.top >= viewportH) return;
        blockers.push({ top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right });
      };

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        const parent = node.parentElement;
        if (!text || text.length < 2 || !parent || float.contains(parent)) continue;
        const style = window.getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.05) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) push(rect);
      }

      /* Bilder und abgegrenzte Flaechen. Der Rahmen eines Chips gehoert genauso zum
         sichtbaren Inhalt wie seine Schrift — der Heels-Fund m-01 lag exakt auf dem Rand,
         nicht auf einem Buchstaben.
         Ausgenommen ist nur, wovor der Knopf gar nicht ausweichen KANN — und das ist
         nicht die Groesse allein, sondern die Frage, ob ueberhaupt Platz daneben bleibt.
         Drei gemessene Faelle zeigen, warum eine einzelne Groessen-Grenze zu grob ist:
           /tanzkurse/heels Desktop 1440: Foto 41.8 % breit, 83.6 % hoch → seitlich Platz,
             muss zaehlen (war der 27px-Befund).
           Home Desktop 1440: Hero 43.6 % breit, 71.6 % hoch → dasselbe.
           /events-workshops/floweekend Mobil 390: Foto 100 % breit, endet aber bei y=784
             → seitlich kein Platz, darunter schon; muss ebenfalls zaehlen (8px-Befund).
         Eine reine Hoehen-Grenze haette die ersten beiden durchgewinkt, eine reine
         Breiten-Grenze den dritten. Entscheidend ist deshalb die Flaeche: deckt ein
         Element mehr als 70 % des Bildschirms ab, ist es Hintergrund oder Shell und es
         gibt nirgends ein Ausweichen. Alles darunter zaehlt als Inhalt. */
      const viewportArea = window.innerWidth * viewportH;
      for (const el of document.querySelectorAll<HTMLElement>('img, svg, video, picture, li, button, [class*="rounded"]')) {
        if (float.contains(el)) continue;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.05) continue;
        const isMedia = el.tagName === 'IMG' || el.tagName === 'SVG' || el.tagName === 'VIDEO' || el.tagName === 'PICTURE';
        /* Eine Flaeche zaehlt nur, wenn sie wirklich eine ist: eigene Fuellung oder ein
           umlaufender Rahmen. Eine einzelne Trennlinie ist keine.
           Gemessen auf /tanzkurse Desktop 1440: ein `li ... border-t` ist 537px hoch und
           traegt oben einen 1px-Strich. Zaehlte dieser Strich als Blockflaeche, war der
           Knopf ueber 1200 Scroll-Pixel durchgehend ausgeblendet — der Nutzer haette auf
           der wichtigsten Kursseite keinen WhatsApp-Knopf mehr gehabt. Der Strich selbst
           verdeckt nichts; verdeckt wird nur, was Fuellung oder Kasten hat. */
        const boxed =
          style.borderTopWidth !== '0px' &&
          style.borderBottomWidth !== '0px' &&
          style.borderLeftWidth !== '0px' &&
          style.borderRightWidth !== '0px';
        const filled =
          (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') ||
          style.backgroundImage !== 'none';
        const hasSurface = boxed || filled;
        if (!isMedia && !hasSurface) continue;
        /* Deko ohne Maus-Annahme ist kein Inhalt. Auf /events-workshops/floweekend sperrte
           ein `pointer-events-none absolute`-Div (Verlaufsschleier, Rechteck -160..416)
           vier Slots am Stueck und drueckte den Knopf komplett aus der Seite. Ein Element,
           das keinen Klick annimmt, kann auch nichts verdecken, was jemand braucht.
           Bilder bleiben ausgenommen: ein Foto traegt Inhalt, auch ohne Maus-Annahme. */
        if (!isMedia && style.pointerEvents === 'none') continue;
        const rect = el.getBoundingClientRect();
        // Nur den sichtbaren Anteil messen: ein langes Bild, das oben aus dem Bild
        // laeuft, ist auf diesem Schirm nicht Hintergrund.
        const visW = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        const visH = Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0);
        if (visW * visH > viewportArea * 0.7) continue;
        push(rect);
      }

      /* Die Kopfzeile faehrt beim Runterscrollen aus dem Bild (SiteHeader translateY).
         Solange sie steht, darf der Knopf nicht unter sie fahren; ist sie weg, ist der
         Platz oben frei und wird gebraucht — auf /tanzkurse/heels ist der obere Rand
         sonst der einzige freie Streifen. */
      const header = document.querySelector('header');
      const headerRect = header?.getBoundingClientRect();
      const headerVisible = Boolean(headerRect && headerRect.bottom > 0 && headerRect.height > 0);
      const ceiling = headerVisible && headerRect ? headerRect.bottom + 12 : 12;

      /* Zwei Formen, in dieser Reihenfolge: erst die volle Pille mit Label, sonst der
         kompakte Kreis. Der Auftrag erlaubt ausdruecklich eine kleinere, unaufdringliche
         Darstellung — und auf Desktop ist genau die Breite das Problem, nicht die Hoehe.
         Gemessen auf der Startseite 1440px: das Hero-Foto endet bei x=1408, rechts davon
         bleiben 32px. Die Pille ist 122px breit und findet deshalb ueber den ganzen Fold
         keinen Platz; der Knopf verschwand dort ab Sekunde 3 komplett. Als 56px-Kreis
         steht er neben dem Foto statt darauf. Label weg ist besser als Knopf weg. */
      /* Der Kreis ist so breit wie hoch. Die Verschmaelerung darf NICHT aus der aktuellen
         Breite kommen: sobald der Knopf einmal kompakt ist, waere sie null und der
         Solver haette den Kreis-Versuch verloren — er kippte dann sofort auf "kein Platz"
         zurueck und blendete aus. Ausgangsbreite ist deshalb die Pillenbreite, die der
         Knopf im Normalzustand hat. */
      const pillWidth = compactRef.current ? current.width + LABEL_WIDTH : current.width;
      const compactShift = Math.max(0, pillWidth - current.height);
      const searchLeft = current.right - pillWidth;
      let next: number | null = null;
      let compact = false;
      for (const shrink of [0, compactShift]) {
        for (const lift of candidates) {
          const top = baseTop - lift - 6;
          const bottom = baseBottom - lift + 6;
          const left = searchLeft + shrink - 6;
          const right = current.right + 6;
          if (top < ceiling) continue;
          // Nach unten nie aus dem Bild schieben: 12px Luft zur Viewportkante bleiben.
          if (bottom > viewportH - 12) continue;
          const blocked = blockers.some(
            (rect) => rect.right > left && rect.left < right && rect.bottom > top && rect.top < bottom,
          );
          if (!blocked) {
            next = lift;
            compact = shrink > 0;
            break;
          }
        }
        if (next !== null) break;
        if (compactShift === 0) break;
      }
      if (compactRef.current !== compact) {
        compactRef.current = compact;
        setCompact(compact);
      }

      if (headerDockedRef.current !== headerVisible) {
        headerDockedRef.current = headerVisible;
        setHeaderDocked(headerVisible);
      }
      const blocked = next === null;
      if (collisionBlockedRef.current !== blocked) {
        collisionBlockedRef.current = blocked;
        setCollisionBlocked(blocked);
      }
      if (next !== null && collisionLiftRef.current !== next) {
        collisionLiftRef.current = next;
        setCollisionLift(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
      // Reveal-Animationen starten beim Scroll mit opacity:0. Der erste Frame darf diese
      // Textknoten zu Recht ignorieren; nach 700ms sind sie sichtbar. Ohne zweiten Scan
      // erschien z.B. «Festpreis pro Staffel.» erst NACH der Messung unter dem Knopf.
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (!frame) frame = window.requestAnimationFrame(measure);
      }, 700);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('animationend', schedule, true);
    document.addEventListener('transitionend', schedule, true);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('animationend', schedule, true);
      document.removeEventListener('transitionend', schedule, true);
    };
  }, []);

  if (footerInView || dialogOpen) return null;

  return (
    <a
      ref={floatRef}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      aria-hidden={collisionBlocked || undefined}
      tabIndex={collisionBlocked ? -1 : undefined}
      title={label}
      className={cn(
        // Raphael 17.08.: rechts unten, weiss auf gruen. Auch auf dem Handy sichtbar.
        /* R188 / AAA (Video-Runde 21.08.): mobil deckte die Blase Fliesstext ab — gemessen
           auf der Startseite 390px an 14 von 35 Scrollpositionen, 17 ueberdeckte Textzeilen
           (worklog/.r188f6-wa.mjs), auf /preise sogar einen Preis in der Zeile "Schueler
           und Studenten" (worklog/shots/R188/after-final5-preise/preise/m-02.png).
           Ursache ist Geometrie, kein Einzelfall: die Blase mass 56px breit an x=314..370,
           die Inhaltsspalte laeuft bei 390px Viewport bis x=370 (Shell-Padding 20px). Der
           Knopf stand also vollstaendig IN der Textspalte. Ein vertikaler Lift verschiebt
           das Problem nur — genau daran haengen bereits sieben Route-Sonderregeln in
           index.css (R101, R138, R139 ...), jede fuer eine einzelne Stelle.
           Mobil ist die Blase deshalb ein kompakter 48px-Kreis am rechten Rand (right-3).
           Sie belegt jetzt x=338..386 und damit im Wesentlichen den Aussenrand rechts der
           Textkante statt die Spalte selbst. Ab sm bleibt alles unveraendert (h-14, right-6,
           Pillenform mit Label) — Desktop war nie der Befund. */
        'whatsapp-float fixed right-3 z-40 inline-flex h-12 w-12 items-center justify-center gap-2 rounded-full px-0 sm:right-6 sm:h-14',
        // Kompakt heisst: Kreis statt Pille, weil sonst kein Platz bleibt (siehe Solver).
        compact ? 'sm:w-14 sm:px-0' : 'sm:w-auto sm:px-4',
        collisionBlocked && 'pointer-events-none opacity-0',
        'bg-[var(--color-whatsapp)] text-white shadow-lg shadow-black/15 ring-1 ring-black/10',
        // R153: `t-hover-move` ist hier raus. Die Klasse deckte dieselben Eigenschaften ab
        // wie die Zeile darunter, setzte aber `transition-duration: var(--dur-base)` und
        // gewann per Reihenfolge gegen die Utility — gemessen 0.24s statt der gewollten
        // 0.42s. Die explizite `transition-[...]`-Zeile ist die Obermenge (plus `bottom`),
        // also bleibt nur sie.
        'hover:-translate-y-0.5 hover:bg-[var(--color-whatsapp-hover)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-whatsapp)]',
        // `bottom` bleibt in der Transition, weil Cookie-Banner und Sticky-CTA den Knopf
        // im Betrieb verschieben. Der Auftritt selbst laeuft als CSS-Animation
        // (`.whatsapp-float` in index.css), nicht ueber diese Transition.
        // Dauer und Kurve kommen aus den Motion-Token statt aus einer eigenen 520ms-Zahl —
        // dieselbe Stufe wie der Auftritt in `.whatsapp-float`.
        /* Mobil springt `bottom` ohne Zwischenweg in den freien Kollisions-Slot. Eine
           420ms-Fahrt von Slot A nach B kreuzte unterwegs genau den Text, den der Solver
           freigibt (Verifier mass trotz korrektem Ziel weiter Treffer). Ab sm gibt es
           keine Kollisions-Slots; dort bleibt die ruhige Token-Dauer unveraendert. */
        /* Springt der Knopf in einen anderen Slot, faehrt er ohne Zwischenweg. Eine
           420ms-Fahrt von Slot A nach B kreuzte unterwegs genau den Inhalt, den der Solver
           freigibt (Verifier mass trotz korrektem Ziel weiter Treffer). Steht die Kopfzeile
           und liegt der Knopf auf seinem Ausgangsplatz, gibt es nichts zu kreuzen; dann
           bleibt die ruhige Token-Dauer. */
        collisionLift === 0 && headerDocked
          ? 'transition-[color,background-color,border-color,transform,opacity,box-shadow,bottom] duration-[var(--dur-slow)] ease-[var(--ease-sf)]'
          : 'transition-[color,background-color,border-color,transform,opacity,box-shadow,bottom] duration-0 ease-[var(--ease-sf)]',
        // R101: Seiten-Anker (z.B. /kursplan) setzt --whatsapp-lift per Media-Query auf :root.
        className,
      )}
      // bottom ist inline, weil er zwei Hoehen-Variablen mitrechnet — eine Klasse koennte
      // diesen Wert nicht ueberschreiben (inline schlaegt Klasse). Die Seiten-Korrektur laeuft
      // deshalb ueber die dritte Variable --whatsapp-lift (Default 0px), NICHT ueber eine
      // Klasse: /kursplan setzt sie mobil auf 5rem, damit der Float die Tages-Chips freigibt.
      // --sticky-cta-height: der mobile Home-CTA-Balken (StickyCta) meldet seine Hoehe,
      // solange er sichtbar ist — der Float sass sonst genau auf dem roten Knopf.
      // R153: Der Cookie-Anteil laeuft ueber --cookie-float-lift, nicht mehr direkt ueber
      // --cookie-banner-height. Unter sm ist die Variable 0px: dort haelt der rechte Gutter
      // am Banner-Wrapper (CookieBanner.tsx) die Karte vom Knopf weg, und ein Vertikal-Lift
      // haette den Kreis auf den Hero-CTA «Schnupperstunde buchen» gehoben. Ab sm traegt die
      // Variable die gemessene Kartenhoehe und der Float steigt ueber die Karte.
      style={{
        bottom: raised
          ? `calc(1.25rem + var(--sticky-cta-height, 0px) + var(--cookie-float-lift, 0px) + var(--whatsapp-lift, 0px) + ${collisionLift}px)`
          : `calc(1.25rem + var(--sticky-cta-height, 0px) + var(--whatsapp-lift, 0px) + ${collisionLift}px)`,
      }}
    >
      {/* Echtes WhatsApp-Zeichen im gruenen Kreis (vorher generische Lucide-Sprechblase). */}
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      {/* Das Label faellt nur weg, wenn der Solver keinen Platz fuer die Pille findet.
          Das Icon bleibt, `aria-label` traegt den Namen weiter — der Knopf bleibt fuer
          Screenreader und Tastatur unveraendert benannt. */}
      {!compact && <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>}
    </a>
  );
}
