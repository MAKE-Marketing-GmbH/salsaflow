import { chromium } from 'playwright-core';

const base = process.env.BASE ?? 'http://127.0.0.1:4174';
const earlySampleMs = 60;
const minimumCloseWindowMs = 180;

const browser = await chromium.launch({
  headless: true,
  channel: 'chrome',
  args: ['--force-color-profile=srgb'],
});

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 2_000 }).catch(() => {});
  await page.locator('button[aria-label="Menü"]').click();
  await page.locator('[data-mobile-menu-panel]').waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const panel = document.querySelector('[data-mobile-menu-panel]');
    return panel !== null && Number.parseFloat(getComputedStyle(panel).opacity) > 0.99;
  });

  const startedAt = Date.now();
  await page.locator('a[href="/team"]:visible').first().click({ noWaitAfter: true });
  await page.waitForTimeout(earlySampleMs);

  const early = await page.evaluate(() => {
    const shell = document.querySelector('[data-mobile-menu-panel]')?.parentElement;
    const panel = document.querySelector('[data-mobile-menu-panel]');
    return {
      pathname: window.location.pathname,
      shellOpen: shell?.getAttribute('data-open'),
      panelOpacity: panel ? Number.parseFloat(getComputedStyle(panel).opacity) : null,
    };
  });

  await page.waitForURL('**/team', { timeout: 3_000, waitUntil: 'commit' });
  const navigationElapsedMs = Date.now() - startedAt;
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        .some((animation) => animation.effect?.pseudoElement === '::view-transition-new(root)'),
    undefined,
    { timeout: 5_000 },
  );

  const sequencing = await page.evaluate(() => {
    const animations = document.getAnimations();
    const details = (pseudoElement) => {
      const animation = animations.find((candidate) => candidate.effect?.pseudoElement === pseudoElement);
      if (!(animation?.effect instanceof KeyframeEffect)) return null;
      const timing = animation.effect.getComputedTiming();
      return {
        delay: Number(timing.delay),
        duration: Number(timing.duration),
        firstOpacity: animation.effect.getKeyframes()[0]?.opacity ?? null,
      };
    };
    /* Der Header hat keine eigene Ein-/Ausblend-Animation mehr: Blur und vertikaler
       Versatz sind raus, damit nichts durchschimmert. Statt einer Animation pruefen
       wir darum den beobachtbaren Zustand — der Header steht waehrend der Navigation
       deckend und unverschoben, und keine laufende Animation macht ihn transparent. */
    const headerSnapshotStaysOpaque = animations
      .filter((candidate) => String(candidate.effect?.pseudoElement ?? '').includes('sf-site-header'))
      .every((candidate) => {
        if (!(candidate.effect instanceof KeyframeEffect)) return true;
        return candidate.effect
          .getKeyframes()
          .every((frame) => frame.opacity === undefined || Number(frame.opacity) === 1);
      });
    const header = document.querySelector('[data-page-header]');
    const headerStyle = header ? getComputedStyle(header) : null;
    return {
      oldRoot: details('::view-transition-old(root)'),
      newRoot: details('::view-transition-new(root)'),
      headerSnapshotStaysOpaque,
      headerOpacity: headerStyle ? Number.parseFloat(headerStyle.opacity) : null,
      headerNamed: headerStyle ? headerStyle.viewTransitionName : null,
    };
  });
  await page.waitForFunction(
    () =>
      !document
        .getAnimations()
        .some((animation) => animation.effect?.pseudoElement && animation.playState === 'running'),
    undefined,
    { timeout: 2_000 },
  );
  const result = {
    earlySampleMs,
    minimumCloseWindowMs,
    early,
    navigationElapsedMs,
    sequencing,
    pageErrors,
    consoleErrors,
  };

  console.log(JSON.stringify(result, null, 2));

  const menuClosesOpaque =
    early.pathname === '/' &&
    early.shellOpen === 'false' &&
    early.panelOpacity !== null &&
    early.panelOpacity > 0.99 &&
    navigationElapsedMs >= minimumCloseWindowMs;
  const rootUsesOpaqueSlide =
    sequencing.newRoot !== null &&
    sequencing.newRoot.delay === 0 &&
    Number(sequencing.newRoot.firstOpacity) === 1;
  const headerStaysOpaque =
    sequencing.headerNamed === 'sf-site-header' &&
    sequencing.headerOpacity !== null &&
    sequencing.headerOpacity > 0.99 &&
    sequencing.headerSnapshotStaysOpaque;

  if (
    !menuClosesOpaque ||
    !rootUsesOpaqueSlide ||
    !headerStaysOpaque ||
    pageErrors.length > 0 ||
    consoleErrors.length > 0
  ) {
    console.error('FAIL: Mobile-Menü, neue Seite oder Header sind noch transparent bzw. verzögert.');
    process.exitCode = 1;
  } else {
    console.log('PASS: Menü, neue Seite und Header bewegen sich als deckende Flächen ohne Weißblitz.');
  }

  await context.close();
} finally {
  await browser.close();
}
