const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => localStorage.setItem('salsaflow-cookie-ok', '1'));
  await page.goto('http://localhost:5173/buchung', { waitUntil: 'networkidle', timeout: 30000 });

  // Heute kann sonntags leer sein — ersten Tag mit Kursen ansteuern.
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  let courseBtn = page.locator('[data-testid^="pick-course-"]').first();
  let found = false;
  for (const key of dayKeys) {
    await page.locator(`[data-testid="day-${key}"]`).click();
    await page.waitForTimeout(120);
    if ((await page.locator('[data-testid^="pick-course-"]').count()) > 0) {
      courseBtn = page.locator('[data-testid^="pick-course-"]').first();
      found = true;
      break;
    }
  }
  if (!found) throw new Error('No courses available on any weekday');
  await courseBtn.waitFor({ timeout: 5000 });
  await courseBtn.click();

  const dialog = page.locator('[data-testid="booking-dialog"]');
  const backdrop = page.locator('[data-testid="booking-backdrop"]');
  await dialog.waitFor({ timeout: 8000 });
  await page.waitForTimeout(250);

  const role = await dialog.getAttribute('role');
  const ariaModal = await dialog.getAttribute('aria-modal');
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  const backdropStyles = await backdrop.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      position: cs.position,
      bg: cs.backgroundColor,
      backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
      zIndex: cs.zIndex,
    };
  });
  const dialogBox = await dialog.boundingBox();
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el
      ? {
          tag: el.tagName,
          testid: el.getAttribute('data-testid'),
          role: el.getAttribute('role'),
        }
      : null;
  });

  console.log(
    JSON.stringify(
      {
        role,
        ariaModal,
        bodyOverflow,
        backdropStyles,
        dialogVisible: !!(dialogBox && dialogBox.width > 0),
        focused,
      },
      null,
      2,
    ),
  );

  await page.screenshot({
    path: '/root/clients/salsaflow-dc/.claude/worktrees/ultracode-aaa-2026-08-06/scratch/booking-dialog-backdrop.png',
    fullPage: false,
  });
  console.log('screenshot ok');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const stillOpen = await dialog.count();
  const overflowAfter = await page.evaluate(() => document.body.style.overflow);
  console.log(JSON.stringify({ stillOpen, overflowAfter }));

  await courseBtn.click();
  await dialog.waitFor({ timeout: 8000 });
  await page.waitForTimeout(150);
  await backdrop.click({ position: { x: 8, y: 8 } });
  await page.waitForTimeout(200);
  const afterBackdropClick = await dialog.count();
  console.log(JSON.stringify({ afterBackdropClick }));

  await browser.close();
  console.log('VERIFY_DONE');
})().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
