// R189: Prüft WhatsApp gegen Text, Bedienelemente und Medien auf Kernrouten.
const { chromium } = require('playwright-core');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5175';
const OUT = 'worklog/shots/R189/whatsapp-collisions';
const ROUTES = ['/', '/kursplan', '/preise', '/tanzkurse', '/tanzkurse/salsa', '/events', '/team', '/faq'];
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
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
            found.push({
              kind: isMedia ? 'media' : 'control',
              label: (element.getAttribute('aria-label') || element.textContent || element.tagName).trim().slice(0, 48),
            });
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
