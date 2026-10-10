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

test('profile fields start unset and preserve explicit choices without inventing study hours', async ({ page }) => {
  await openApp(page);
  await chooseRole(page);
  await page.evaluate(() => window.navigate('profile'));

  const experience = page.locator('#profileExperience');
  const goal = page.locator('#profileGoal');
  const hours = page.locator('#profileWeeklyHours');
  await expect(experience).toHaveValue('');
  await expect(goal).toHaveValue('');
  await expect(hours).toHaveValue('');

  await experience.selectOption('College Student');
  await goal.selectOption('Explore careers');
  await hours.fill('10');
  await hours.fill('');
  await page.getByRole('button', { name: 'Save Profile' }).click();

  await expect(experience).toHaveValue('College Student');
  await expect(goal).toHaveValue('Explore careers');
  await expect(hours).toHaveValue('');
  await expect(page.locator('#summaryWeeklyHours')).toHaveText('Not set');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.navigate('profile'));
  await expect(page.locator('#profileExperience')).toHaveValue('College Student');
  await expect(page.locator('#profileGoal')).toHaveValue('Explore careers');
  await expect(page.locator('#profileWeeklyHours')).toHaveValue('');
});

test('all application routes render content without a page-error fallback', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await openApp(page);
  await chooseRole(page);
  const views = [
    'dashboard', 'careers', 'discover', 'compare', 'profile', 'switch', 'jobs',
    'planner', 'roadmap', 'exams', 'labs', 'interview', 'resume', 'jd',
    'readiness', 'weekly', 'projects',
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

test('simplified navigation hides incomplete and duplicate destinations while legacy links redirect safely', async ({ page }) => {
  await openApp(page);
  await chooseRole(page);
  // The Home dashboard intentionally has no secondary tabs; test the contextual tabs on the roadmap.
  await page.evaluate(() => window.navigate('roadmap'));
  const workspace = page.locator('#content .workspace-tabs');
  await expect(workspace).toBeVisible();

  const visibleTabs = await workspace.locator('.workspace-tab').allTextContents();
  expect(visibleTabs).not.toContain('Knowledge self-check');
  expect(visibleTabs).not.toContain('Technology explorer');
  expect(visibleTabs).not.toContain('Skill dependencies');
  expect(visibleTabs).not.toContain('Skill gap priorities');
  expect(visibleTabs).not.toContain('Daily career coach');

  const legacyRoutes = [
    ['tech', 'My journey', 'Roadmap'],
    ['skills', 'My journey', 'Roadmap'],
    ['quizzes', 'Learn & practise', 'Practice Labs'],
    ['skillgap', 'Job readiness', 'Job Readiness'],
    ['coach', 'Your progress', 'Weekly Review'],
    ['portfolio', null, 'Project Studio'],
  ];
  for (const [legacy, expectedTabGroup, expectedTitle] of legacyRoutes) {
    await page.evaluate(viewName => window.navigate(viewName), legacy);
    if (expectedTabGroup) await expect(page.locator('#content .workspace-tabs')).toContainText(expectedTabGroup);
    await expect(page.locator('#pageTitle')).toHaveText(expectedTitle);
  }
});

test('global search opens, filters results and supports keyboard shortcut', async ({ page }) => {
  await openApp(page);
  await page.keyboard.press('Control+k');
  const modal = page.locator('#globalSearchModal');
  await expect(modal).toBeVisible();
  await page.locator('#globalSearchInput').fill('Kubernetes');
  await expect(page.locator('#globalSearchResults')).toContainText(/Kubernetes/i);
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
});

test('career discovery accepts an answer and displays recommendations', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => window.navigate('discover'));
  const answer = page.locator('.v8-answer').first();
  await expect(answer).toBeVisible();
  await answer.click();
  await expect(page.locator('.v8-match').first()).toBeVisible();
  await expect(page.locator('.v8-match').first()).toContainText(/%/);
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

  const dates = await page.evaluate(() => {
    const startDate = new Date();
    startDate.setHours(12, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14);
    const fmt = d => `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
    return { start: fmt(startDate), end: fmt(endDate) };
  });
  const start = page.locator('input[data-date-action="plannerStart"]');
  const end = page.locator('input[data-date-action="plannerEnd"]');
  await start.fill(dates.start);
  await start.press('Tab');
  await end.fill(dates.end);
  await end.press('Tab');

  await page.getByRole('button', { name: 'Generate Daily Study Plan' }).click();
  await expect(page.locator('.plan-table')).toBeVisible();
  await expect(page.getByText('Follow your daily commitment')).toBeVisible();
  const todayCell = page.locator('.study-day-cell.status-today').first();
  await expect(todayCell).toBeVisible();
  await todayCell.click();
  await page.getByRole('button', { name: 'Mark session complete' }).click();
  await expect(page.locator('.study-day-cell.status-completed').first()).toBeVisible();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.navigate('planner'));
  await expect(page.locator('.study-day-cell.status-completed').first()).toBeVisible();
});

test('missed study sessions can be moved to catch-up', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  await page.evaluate(() => window.navigate('planner'));
  const dates = await page.evaluate(() => {
    const startDate = new Date();
    startDate.setHours(12, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 2);
    const endDate = new Date();
    endDate.setHours(12, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 12);
    const fmt = d => `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
    return { start: fmt(startDate), end: fmt(endDate) };
  });
  const start = page.locator('input[data-date-action="plannerStart"]');
  const end = page.locator('input[data-date-action="plannerEnd"]');
  await start.fill(dates.start);
  await start.press('Tab');
  await end.fill(dates.end);
  await end.press('Tab');
  await page.getByRole('button', { name: 'Generate Daily Study Plan' }).click();

  const missed = page.locator('.study-day-cell.status-missed').first();
  await expect(missed).toBeVisible();
  await missed.click();
  await page.getByRole('button', { name: 'Move to catch-up day' }).click();
  await expect(page.locator('.study-day-cell.status-rescheduled').first()).toBeVisible();
});

test('planner rejects invalid calendar dates without creating a plan', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  await page.evaluate(() => window.navigate('planner'));
  const start = page.locator('.date-text[data-date-action="plannerStart"]');
  const end = page.locator('.date-text[data-date-action="plannerEnd"]');
  await start.fill('02/30/26');
  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/valid date/i);
    await dialog.accept();
  });
  await start.press('Tab');
  await expect(start).not.toHaveValue('02/30/26');

  await start.fill('10/15/26');
  await start.press('Tab');
  await end.fill('10/14/26');
  await end.press('Tab');
  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/End date must be on or after/i);
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Generate Daily Study Plan' }).click();
  await expect(page.locator('.plan-table')).toHaveCount(0);
});

test('changing target role invalidates the visible plan without deleting saved session history', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  await page.evaluate(() => window.navigate('planner'));
  const dates = await page.evaluate(() => {
    const start = new Date(); start.setHours(12,0,0,0);
    const end = new Date(start); end.setDate(end.getDate()+7);
    const fmt = d => `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${String(d.getFullYear()).slice(-2)}`;
    return {start:fmt(start),end:fmt(end)};
  });
  const start = page.locator('.date-text[data-date-action="plannerStart"]');
  const end = page.locator('.date-text[data-date-action="plannerEnd"]');
  await start.fill(dates.start); await start.press('Tab');
  await end.fill(dates.end); await end.press('Tab');
  await page.getByRole('button', { name: 'Generate Daily Study Plan' }).click();
  const todayCell = page.locator('.study-day-cell.status-today').first();
  await expect(todayCell).toBeVisible();
  await todayCell.click();
  await page.getByRole('button', { name: 'Mark session complete' }).click();
  const planBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('itCareerOS_v10') || '{}').planner || {});
  expect(planBefore.generated).toBe(true);
  const priorStatus = planBefore.dailyStatus || {};
  expect(Object.values(priorStatus)).toContain('completed');
  await chooseRole(page, 'Cloud Platform Engineer');
  const planAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('itCareerOS_v10') || '{}').planner || {});
  expect(planAfter.generated).toBe(false);
  expect(planAfter.dailyStatus || {}).toEqual(priorStatus);
  await expect(page.locator('.plan-table')).toHaveCount(0);
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


test('exported backup can be imported after confirmation', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export' }).click(),
  ]);
  const filePath = await download.path();
  expect(filePath).toBeTruthy();

  await chooseRole(page, 'Full Stack Developer');
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#filePicker').setInputFiles(filePath);
  await expect(page.locator('#headerRolePicker .header-role-value')).toContainText('Platform Engineer');
});

test('Reset asks for confirmation and returns to first-run role setup', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('#welcomeRoleTrigger')).toBeVisible({ timeout: 15_000 });
  const storedRole = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('itCareerOS_v10') || '{}');
    return state.settings?.selectedRole || '';
  });
  expect(storedRole).toBe('');
});

test('roadmap avoids duplicate tools and core guidance is visible', async ({ page }) => {
  await openApp(page);
  await chooseRole(page, 'Platform Engineer');

  await page.evaluate(() => window.navigate('roadmap'));
  await expect(page.getByRole('button', { name: 'Build study plan' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Practice labs' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Certification guidance' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore technologies' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Skill dependencies' })).toHaveCount(0);

  await page.evaluate(() => window.navigate('interview'));
  await expect(page.getByText(/self-assessed, not an AI evaluation/i)).toBeVisible();
  await expect(page.getByText(/Context/).first()).toBeVisible();
  await expect(page.getByText('Answer outline you can follow')).toBeVisible();

  await page.evaluate(() => window.navigate('readiness'));
  await expect(page.getByText(/65% role-skill progress \+ 20% hands-on lab completion \+ 15% interview self-assessment/i)).toBeVisible();
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
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(dimensions.document, `${item.file} overflows at ${width}px: ${JSON.stringify(dimensions)}`)
        .toBeLessThanOrEqual(dimensions.viewport + 1);
    }
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
