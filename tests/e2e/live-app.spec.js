import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://techi-27.github.io/MR-Career/app.html';
const SITE_BASE = APP_URL.replace(/app\.html(?:\?.*)?$/, '');

async function openApp(page) {
  const response = await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  expect(response, 'The app URL should return a document response').not.toBeNull();
  expect(response.status(), 'The deployed app should return HTTP 200').toBe(200);
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveTitle(/MR\.Career/i);
  await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15_000 });
  await expect(page.locator('#content')).toBeVisible();
}

async function chooseRole(page, role = 'Platform Engineer') {
  const trigger = page.locator('#headerRolePicker .header-role-trigger');
  await expect(trigger).toBeVisible();
  await trigger.click();
  const menu = page.locator('#headerRoleMenu');
  await expect(menu).toBeVisible();
  await menu.locator('.header-role-search').fill(role);
  await page.locator(`.header-role-option[data-role="${role}"]`).click();
  await expect(page.locator('#headerRolePicker .header-role-value')).toContainText(role);
}

test('live app loads and has no uncaught JavaScript errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await openApp(page);
  await page.waitForTimeout(500);
  expect(pageErrors, 'Uncaught browser errors: ' + pageErrors.join('\n')).toEqual([]);
});

test('desktop, tablet and mobile layouts do not create page-level horizontal overflow', async ({ page }) => {
  await openApp(page);
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 820, height: 1180 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'small mobile', width: 320, height: 720 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(150);
    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.documentWidth, `${viewport.name} horizontal overflow: ${JSON.stringify(dimensions)}`)
      .toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  }
});

test('role selector changes the target role and persists after reload', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  const storedRole = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('itCareerOS_v10') || '{}');
    return state.settings?.selectedRole;
  });
  expect(storedRole).toBe('Platform Engineer');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#headerRolePicker .header-role-value')).toContainText('Platform Engineer');
});

test('all application routes render content without a page-error fallback', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await openApp(page);
  await chooseRole(page);
  const views = [
    'dashboard', 'careers', 'discover', 'compare', 'profile', 'switch', 'jobs',
    'planner', 'roadmap', 'tech', 'skills', 'exams', 'labs', 'quizzes',
    'interview', 'resume', 'jd', 'readiness', 'skillgap', 'weekly', 'coach',
    'projects', 'portfolio',
  ];
  for (const view of views) {
    await page.evaluate(viewName => window.navigate(viewName), view);
    await expect(page.locator('#pageTitle')).not.toHaveText('Page Error', { timeout: 10_000 });
    await expect(page.locator('#content')).toBeVisible();
    const result = await page.locator('#content').innerText();
    expect(result.trim().length, `View "${view}" should render useful content`).toBeGreaterThan(20);
    expect(result, `View "${view}" should not show the generic page-error message`).not.toContain('Unable to load this page.');
  }
  expect(pageErrors, 'Uncaught browser errors: ' + pageErrors.join('\n')).toEqual([]);
});

test('resume analyzer and job-description analyzer produce results', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');

  await page.evaluate(() => window.navigate('resume'));
  await page.locator('#resumeText').fill(
    'Platform Engineer with AWS, Kubernetes, EKS, Terraform, Docker, Linux, Python, GitOps, Argo CD, Prometheus and Grafana experience. Built CI/CD pipelines and automated infrastructure.'
  );
  await page.getByRole('button', { name: /Analyze for Platform Engineer/i }).click();
  await expect(page.getByText('RESUME ALIGNMENT')).toBeVisible();
  await expect(page.getByText(/Target role: Platform Engineer/)).toBeVisible();

  await page.evaluate(() => window.navigate('jd'));
  await page.locator('#jdInput').fill(
    'Platform Engineer required skills: AWS, Kubernetes, EKS, Terraform, Docker, Linux, Python, GitOps, Argo CD, Backstage, Prometheus, Grafana, CI/CD and infrastructure as code.'
  );
  await page.getByRole('button', { name: 'Analyze JD' }).click();
  await expect(page.locator('#jdResult')).toContainText('role-relevant skill areas detected');
  await expect(page.locator('#jdResult')).toContainText('Potentially missing role areas');
});

test('study planner generates a dated plan and shows the daily calendar', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  await page.evaluate(() => window.navigate('planner'));

  const start = page.locator('input[data-date-action="plannerStart"]');
  const end = page.locator('input[data-date-action="plannerEnd"]');
  await start.fill('10/10/26');
  await start.press('Tab');
  await end.fill('10/24/26');
  await end.press('Tab');

  await page.getByRole('button', { name: 'Generate Daily Study Plan' }).click();
  await expect(page.locator('.plan-table')).toBeVisible();
  await expect(page.getByText('Follow your daily commitment')).toBeVisible();
  await expect(page.locator('.study-day-cell').first()).toBeVisible();
});

test('project checklist changes are saved locally', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  await page.evaluate(() => window.navigate('projects'));
  const checkbox = page.locator('.v9-check input[type="checkbox"]').first();
  await expect(checkbox).toBeVisible();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.navigate('projects'));
  await expect(page.locator('.v9-check input[type="checkbox"]').first()).toBeChecked();
});

test('export downloads a backup file', async ({ page }) => {
  await openApp(page);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export' }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^MR-Career-backup-.*\.json$/);
});

test('public information pages load and navigation CTA is visible', async ({ page }) => {
  const pages = [
    { file: 'index.html', title: /MR\.Career/i },
    { file: 'about.html', title: /About.*MR\.Career|MR\.Career.*About/i },
    { file: 'privacy.html', title: /Privacy.*MR\.Career/i },
    { file: 'terms.html', title: /Terms.*MR\.Career/i },
    { file: 'contact.html', title: /Contact.*MR\.Career/i },
    { file: 'accessibility.html', title: /Accessibility.*MR\.Career/i },
  ];
  for (const item of pages) {
    const response = await page.goto(new URL(item.file, SITE_BASE).toString(), { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(response, `${item.file} should return a document response`).not.toBeNull();
    expect(response.status(), `${item.file} should return HTTP 200`).toBe(200);
    await expect(page).toHaveTitle(item.title);
    await expect(page.locator('body')).toBeVisible();
  }

  await page.goto(new URL('about.html', SITE_BASE).toString(), { waitUntil: 'domcontentloaded' });
  const cta = page.locator('.navlinks a[href="app.html"]');
  await expect(cta).toBeVisible();
  await expect(cta).toContainText(/Open App|Open workspace/i);
  const rect = await cta.boundingBox();
  expect(rect.width, 'CTA should have enough width to show its label').toBeGreaterThan(80);
  expect(rect.height, 'CTA should have enough height to show its label').toBeGreaterThan(30);
  expect(rect.x + rect.width).toBeLessThanOrEqual(await page.evaluate(() => document.documentElement.clientWidth) + 1);
});
