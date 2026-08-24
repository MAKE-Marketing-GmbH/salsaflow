// R189: Prüft WhatsApp gegen Text, Bedienelemente und Medien auf Kernrouten.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/whatsapp-collisions';
const ROUTES = ['/', '/kursplan', '/preise', '/tanzkurse', '/tanzkurse/salsa', '/events', '/team', '/faq'];
/* R190: `tablet` ist neu und war die Luecke, durch die der Befund fiel. Zwischen 640 und
   1023 px weicht das Kursraster dem Knopf nicht aus (`ScheduleTeaser.tsx` haelt sein
   `pr-36` erst ab `lg`), waehrend der Knopf seine Zone schon ab `sm` belegt. Mit nur
   390 und 1440 px hatte dieses Gate dort keinen einzigen Messpunkt und meldete gruen,
   waehrend die Pille auf der Sa-Kachel sass. 768x1024 liegt mitten in der Luecke. */
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['tablet', { width: 768, height: 1024 }],
  ['mobile', { width: 390, height: 844 }],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [];

  for (const route of ROUTES) {
    for (const [viewportName, viewport] of VIEWPORTS) {
      const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(900);
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      const step = Math.max(320, Math.round(viewport.height * 0.72));
      const slug = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '_');
      const hits = [];
      // Treffer im Ruhezustand (ausgefahrene Pille). Getrennt gefuehrt, damit im
      // Ergebnis sichtbar bleibt, WELCHER Zustand kollidiert.
      const restingHits = [];
      const driftedPositions = [];
      const missingPositions = [];
      let visiblePositions = 0;
      let measuredPositions = 0;
      let lastVisibleY = 0;
      const inspect = () => page.evaluate(() => {
        const isVisible = (element) =>
          !element.closest('[hidden], [aria-hidden="true"], [inert]') &&
          element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
        const float = document.querySelector('a.whatsapp-float');
        if (!float || !isVisible(float)) {
          /* Am Seitenende gehoert der Knopf weg: der Footer traegt im Entry-CTA-Band einen
             eigenen WhatsApp-Knopf. Nur dieser eine Grund darf ihn verschwinden lassen. */
          const footerRect = document.querySelector('footer')?.getBoundingClientRect();
          const footerInView = Boolean(footerRect && footerRect.top < innerHeight - 48 && footerRect.bottom > 0);
          const dialogOpen = Boolean(document.querySelector('[data-testid="booking-dialog"], [aria-modal="true"]'));
          return { visible: false, hits: [], anchored: false, footerInView: footerInView || dialogOpen };
        }
        const button = float.getBoundingClientRect();
        /* Zweite Pflicht neben "keine Kollision": Der Knopf gehoert unten rechts
           (wiki/absprachen.md:21). Ohne diese Messung war das Gate gruen, waehrend der Knopf
           auf /team desktop bei y=298 und auf /tanzkurse/salsa mobil bei y=216 stand — also
           im oberen Drittel. Ein Ausweichmanoever, das den Knopf woanders hin verlegt, ist
           kein bestandenes Gate. */
        const anchored = button.top > innerHeight * 0.55 && innerWidth - button.right <= 32;
        const overlaps = (rect) => {
          const width = Math.min(button.right, rect.right) - Math.max(button.left, rect.left);
          const height = Math.min(button.bottom, rect.bottom) - Math.max(button.top, rect.top);
          return width > 1 && height > 1;
        };
        const found = [];
        const CLIP_OVERFLOW = ['hidden', 'clip', 'auto', 'scroll'];
        const clipToAncestors = (element, rect) => {
          let left = rect.left;
          let right = rect.right;
          let top = rect.top;
          let bottom = rect.bottom;
          let ancestor = element.parentElement;
          while (ancestor && ancestor !== document.body) {
            const style = window.getComputedStyle(ancestor);
            if (CLIP_OVERFLOW.includes(style.overflowX) || CLIP_OVERFLOW.includes(style.overflowY)) {
              const box = ancestor.getBoundingClientRect();
              left = Math.max(left, box.left);
              right = Math.min(right, box.right);
              top = Math.max(top, box.top);
              bottom = Math.min(bottom, box.bottom);
            }
            ancestor = ancestor.parentElement;
          }
          if (right - left <= 1 || bottom - top <= 1) return null;
          return { left, right, top, bottom, width: right - left, height: bottom - top };
        };
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim();
          const parent = node.parentElement;
          if (!text || text.length < 2 || !parent || float.contains(parent)) continue;
          if (parent.closest('.sr-only')) continue;
          if (!isVisible(parent)) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            const clipped = clipToAncestors(parent, rect);
            if (clipped && overlaps(clipped)) found.push({ kind: 'text', label: text.slice(0, 48) });
          }
        }

        for (const element of document.querySelectorAll(
          'a, button, input, select, textarea, summary, [role="button"], [role="tab"], [role="checkbox"], img, video, picture',
        )) {
          if (float === element || float.contains(element) || element.contains(float)) continue;
          if (!isVisible(element)) continue;
          const isMedia = element.matches('img, video, picture');
          const rect = clipToAncestors(element, element.getBoundingClientRect());
          if (!rect) continue;
          /* Hintergrund heisst randlos ueber die volle Fensterbreite und ueber den grossen
             Teil der Hoehe. Vorher stand hier eine Flaechenrechnung, die ein 16:9-Foto in
             der Shell (1336 x 751 px) als Hintergrund zaehlte, obwohl rechts daneben nur
             52 px Rand liegen — der Knopf lag auf den Personen im Team-Band und das Gate
             blieb gruen. Dieselbe engere Bedingung steht in WhatsAppFloat.tsx. */
          const visibleWidth = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
          const visibleHeight = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
          const boxW = rect.right - rect.left;
          const boxH = rect.bottom - rect.top;
          const ratio = boxH > 0 ? boxW / boxH : 0;
          const tile = boxW < innerWidth * 0.45 && boxH < innerHeight * 0.5 && ratio > 0.75 && ratio < 1.35;
          const atmosphere = visibleWidth > innerWidth * 0.35 && visibleHeight > innerHeight * 0.22;
          if (isMedia && atmosphere && !tile) continue;
          if (overlaps(rect)) {
            /* R191: Eine Box-Ueberlappung allein ist noch kein Befund. Ein Textlink traegt
               oft Polsterung, die weit ueber seine sichtbare Flaeche hinausreicht: gemessen
               auf `/` mobil 390 px lag der Knopf 32x3 px in der Box des Links
               "Schnupperstunde buchen" — dessen TEXT aber 51 px weiter links endet
               (x287 gegen x338), und der Link hat weder Hintergrund (rgba(0,0,0,0)) noch
               Rand noch Radius. Sichtbar beruehrt der Kreis dort nichts.
               Das Gate meldete diesen Fall drei Runden lang rot und band Aufmerksamkeit,
               die anderswo fehlte. Es zaehlt jetzt nur, was man SIEHT oder NICHT KLICKEN
               kann. Beide Ausschluesse sind eng gefasst — Medien, sichtbar gefuellte oder
               gerahmte Elemente und jeder gestohlene Klickpunkt fallen weiterhin hart. */
            /* R192: Die Ausnahme war eine Whitelist aus zwei CSS-Eigenschaften gegen eine
               offene Menge sichtbarer Darstellungen. Gegenprobe des Pruefers mit kopierter
               Gate-Logik: ein roter Block via `::before`, ein 4px-`outline` und ein
               `box-shadow: inset 0 0 0 40px` wurden alle DURCHGELASSEN, obwohl jeder von
               ihnen den Knopf sichtbar deckt. Pseudoelemente, Outline und Schatten zaehlen
               jetzt mit. `getComputedStyle` braucht dafuer den zweiten Parameter — ohne ihn
               ist ein `::before` fuer das Gate unsichtbar. */
            const es = window.getComputedStyle(element);
            const gefuellt = (style) =>
              (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') ||
              style.backgroundImage !== 'none';
            const vor = window.getComputedStyle(element, '::before');
            const nach = window.getComputedStyle(element, '::after');
            const pseudoSichtbar = (style) =>
              style.content !== 'none' && style.content !== 'normal' &&
              style.display !== 'none' && style.visibility !== 'hidden' &&
              parseFloat(style.opacity || '1') > 0 && gefuellt(style);
            const hasFill = gefuellt(es) || pseudoSichtbar(vor) || pseudoSichtbar(nach);
            const hasBorder = parseFloat(es.borderTopWidth) > 0 || parseFloat(es.borderBottomWidth) > 0 ||
              parseFloat(es.borderLeftWidth) > 0 || parseFloat(es.borderRightWidth) > 0 ||
              (es.outlineStyle !== 'none' && parseFloat(es.outlineWidth) > 0) ||
              (es.boxShadow !== 'none' && es.boxShadow !== '');
            /* Deckt der Knopf die eigenen Textkaesten oder ein Icon des Elements? Das ist
               die sichtbare Substanz — nicht die Polsterung darum. */
            let coversInk = false;
            const inkRange = document.createRange();
            inkRange.selectNodeContents(element);
            for (const ink of inkRange.getClientRects()) {
              if (ink.width > 1 && ink.height > 1 && overlaps(ink)) { coversInk = true; break; }
            }
            /* R192: `svg, img, picture, video` war zu eng. Ein Kind-`div` mit
               Hintergrundfarbe oder ein `canvas` fiel nur zufaellig auf, naemlich wenn die
               Range-Rects des Elternteils zufaellig griffen. Jetzt zaehlt jedes Kind, das
               selbst sichtbare Flaeche traegt. */
            if (!coversInk) {
              for (const child of element.querySelectorAll('*')) {
                const cr = child.getBoundingClientRect();
                if (cr.width <= 1 || cr.height <= 1 || !overlaps(cr)) continue;
                if (child.matches('svg, img, picture, video, canvas')) { coversInk = true; break; }
                const cs = window.getComputedStyle(child);
                if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity || '1') === 0) continue;
                if (gefuellt(cs) || (cs.borderTopWidth && parseFloat(cs.borderTopWidth) > 0)) { coversInk = true; break; }
              }
            }
            /* Klaut der Knopf Klickpunkte? Raster ueber die Schnittflaeche: gehoert dort ein
               Punkt dem Float statt dem Element, ist das Element unbedienbar — immer FAIL,
               unabhaengig von Sichtbarkeit. */
            /* R192, zwei Loecher geschlossen (Pruefer-Gegenprobe mit kopierter Logik):
               1. Schrittweite 3 mit `sx1 + 1 < sx2 - 1` tastete einen 2px-Schnitt NULL mal
                  ab — die Schleife lief kein einziges Mal, das Ergebnis war garantiert 0.
                  Genau so ein Streifen war der R191-Klickdiebstahl. Jetzt 1px-Raster, und
                  die Grenzen sind nicht mehr um je 1px verkuerzt.
               2. Der Knopf ist ein Kreis. Von seiner Bounding-Box gehoeren ihm nur rund
                  82 Prozent; ab der oberen Kante greift er erst nach 12,5px. Ein Element,
                  das nur in eine Ecke ragt, bekam dadurch 0 Punkte. Mit dem feineren
                  Raster wird jetzt auch die Ecke abgetastet, statt zwischen den Punkten
                  hindurchzufallen.
               Das Raster ist auf 4096 Punkte gedeckelt: die Schnittflaeche ist in der Praxis
               klein, aber eine grosse Flaeche darf den Lauf nicht sprengen. Wird gedeckelt,
               waechst die Schrittweite gleichmaessig mit — Abdeckung bleibt, Aufloesung sinkt. */
            let stolenPoints = 0;
            if (!isMedia) {
              const sx1 = Math.max(button.left, rect.left), sx2 = Math.min(button.right, rect.right);
              const sy1 = Math.max(button.top, rect.top), sy2 = Math.min(button.bottom, rect.bottom);
              const breite = sx2 - sx1, hoehe = sy2 - sy1;
              const schritt = Math.max(1, Math.ceil(Math.sqrt((breite * hoehe) / 4096)));
              for (let x = Math.ceil(sx1); x < sx2 && stolenPoints === 0; x += schritt) {
                for (let y = Math.ceil(sy1); y < sy2; y += schritt) {
                  const at = document.elementFromPoint(x, y);
                  if (at && (at === float || float.contains(at))) { stolenPoints++; break; }
                }
              }
            }
            const invisiblePaddingOnly = !isMedia && !coversInk && !hasFill && !hasBorder && stolenPoints === 0;
            if (!invisiblePaddingOnly) {
              found.push({
                kind: isMedia ? 'media' : 'control',
                label: (element.getAttribute('aria-label') || element.textContent || element.tagName).trim().slice(0, 48),
                reason: stolenPoints > 0 ? 'stolen-click' : coversInk ? 'covers-ink' : hasFill || hasBorder ? 'covers-visible-box' : 'overlap',
              });
            }
          }
        }
        return { visible: true, hits: found, anchored, box: [Math.round(button.top), Math.round(button.right)] };
      });

      for (let y = 0; y <= maxScroll; y += step) {
        await page.evaluate((top) => scrollTo(0, top), y).catch(() => {});
        await page.waitForTimeout(240);
        await page.evaluate(() => new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        })).catch(() => {});
        measuredPositions += 1;
        const state = await inspect().catch(() => ({ visible: false, hits: [], evaluateFailed: true }));
        if (state.visible) {
          visiblePositions += 1;
          lastVisibleY = y;
          if (!state.anchored) driftedPositions.push({ y, box: state.box });
        } else if (!state.footerInView) {
          missingPositions.push(y);
        }
        if (state.hits.length) {
          hits.push({ y, hits: state.hits });
          await page.screenshot({ path: `${OUT}/${slug}-${viewportName}-${y}-fail.png` });
        }

      }

      /* R190, ZWEITER MESSPUNKT: der RUHENDE Knopf.
         Die Schleife oben misst 240 ms nach dem Scrollen und trifft den Knopf damit
         IMMER als Kreis — Scrollen erzwingt `compact` (WhatsAppFloat.tsx). Nach rund
         2,4 s waechst er zurueck zur Pille (LABEL_WIDTH 66). Gemessen auf der
         Startseite bei 1440 px: Kreis 56 px breit ab x1360, Pille 122 px ab x1294.
         Die Pille reicht also 66 px weiter nach links als alles, was dieses Gate
         bisher je gesehen hat; fuer den breiten Zustand gab es schlicht keine
         Auskunft.

         Geprueft werden die Positionen mit dem meisten Inhalt neben dem Knopf statt
         aller: 2,6 s Wartezeit an ~130 Stellen wuerden den Lauf um eine Stunde
         verlaengern, ohne mehr zu zeigen — die Pille ist an jeder Position gleich
         breit, es zaehlt nur, was neben ihr liegt. Nur ab lg: darunter gibt es kein
         Label (`hidden lg:inline-block`), dort ist der Ruhezustand derselbe Kreis.
         Die Schwelle stand bis R190 auf 640 und passt jetzt zur Klasse — sonst
         wartete der Lauf auf Tablet 2,6 s auf eine Pille, die dort nicht mehr
         entsteht, und der Kreis-Fall oben deckt den Zustand ohnehin ab. */
      if (viewport.width >= 1024) {
        const probes = hits.length > 0 ? hits.slice(0, 3).map((h) => h.y) : [];
        for (const y of [0, Math.round(maxScroll / 2), ...probes]) {
          if (y > maxScroll) continue;
          await page.evaluate((top) => scrollTo(0, top), y).catch(() => {});
          await page.waitForTimeout(2600);
          const resting = await inspect().catch(() => ({ visible: false, hits: [] }));
          if (resting.visible && resting.hits.length) {
            restingHits.push({ y, hits: resting.hits });
            await page.screenshot({ path: `${OUT}/${slug}-${viewportName}-${y}-rest-fail.png` });
          }
        }
      }

      await page.evaluate((top) => scrollTo(0, top), lastVisibleY).catch(() => {});
      await page.waitForTimeout(400);
      await page.evaluate(() => new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })).catch(() => {});
      const returned = await inspect().catch(() => ({ visible: false, hits: [], evaluateFailed: true }));
      if (visiblePositions === 0 || !returned.visible) {
        await page.screenshot({ path: `${OUT}/${slug}-${viewportName}-hidden.png` });
      }
      results.push({
        route,
        viewport: viewportName,
        measuredPositions,
        visiblePositions,
        returnedVisible: returned.visible,
        evaluateFailed: Boolean(returned.evaluateFailed),
        hits,
        restingHits,
        drifted: driftedPositions,
        missing: missingPositions,
      });
      await context.close();
    }
  }

  fs.writeFileSync(`${OUT}/result.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results));
  await browser.close();

  const failures = results.filter(
    (result) =>
      result.hits.length > 0 ||
      result.restingHits.length > 0 ||
      result.drifted.length > 0 ||
      result.missing.length > 0 ||
      result.visiblePositions === 0 ||
      !result.returnedVisible ||
      result.evaluateFailed,
  );
  if (failures.length) {
    throw new Error(`WhatsApp-Kollisionsgate fehlgeschlagen: ${JSON.stringify(failures)}`);
  }
})();
