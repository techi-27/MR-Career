import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://techi-27.github.io/MR-Career/app.html';

async function openApp(page) {
  const response = await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  expect(response, 'The app URL should return a document response').not.toBeNull();
  expect(response.status(), 'The deployed app should return HTTP 200').toBe(200);
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveTitle(/MR\.Career/i);
  // Give the app's inline scripts time to initialize without relying on external network idle.
  await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15_000 });
}

test('live app loads and has no uncaught JavaScript errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await openApp(page);
  await page.waitForTimeout(1500);

  expect(pageErrors, 'Uncaught browser errors: ' + pageErrors.join('\n')).toEqual([]);
});

test('desktop and mobile layouts do not create page-level horizontal overflow', async ({ page }) => {
  await openApp(page);

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 820, height: 1180 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'small mobile', width: 320, height: 720 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(250);

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
    }));

    expect(
      dimensions.documentWidth,
      `${viewport.name} horizontal overflow: ${JSON.stringify(dimensions)}`
    ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  }
});

test('main navigation items can be opened without uncaught JavaScript errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await openApp(page);

  const views = ['dashboard', 'careers', 'profile', 'switch', 'roadmap', 'labs', 'projects', 'resume', 'readiness', 'weekly'];
  for (const view of views) {
    const item = page.locator(`[data-view="${view}"]`).first();
    if (await item.count() === 0 || !(await item.isVisible().catch(() => false))) continue;

    await item.click();
    await page.waitForTimeout(100);
    expect(pageErrors, `Browser error after opening "${view}": ${pageErrors.join('\n')}`).toEqual([]);
  }

  expect(
    await page.locator('[data-view="dashboard"], [data-view="careers"], [data-view="profile"]').count(),
    'At least one expected main navigation item should exist'
  ).toBeGreaterThan(0);
});
