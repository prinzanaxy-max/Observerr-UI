import AxeBuilder from '@axe-core/playwright';
import { test, expect, mockSession } from './fixtures';

const routes = [
  ['/lecturer', /Release Readiness Exam|Live Exam/i],
  ['/lecturer/exams', /Exams Overview/i],
  ['/lecturer/exams/new', /Create New Exam/i],
  ['/lecturer/exams/42/results', /Exam Results/i],
  ['/lecturer/exams/42/live', /Release Readiness Exam|Live Exam/i],
  ['/lecturer/students', /Students/i],
  ['/lecturer/reports', /Analytics Overview/i],
  ['/lecturer/proctoring', /No live exams/i],
  ['/lecturer/settings', /Settings/i],
  ['/lecturer/support', /Support/i],
] as const;

test.describe('lecturer release routes', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page, 'LECTURER');
  });

  for (const [path, visibleText] of routes) {
    test(`${path} supports authenticated deep linking`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`${path.replaceAll('/', '\\/')}$`));
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('body')).toContainText(visibleText);
    });
  }

  test('dashboard has no serious or critical axe findings', async ({ page }) => {
    await page.goto('/lecturer');
    await expect(page.locator('main')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });
});

test.describe('lecturer API states', () => {
  test('empty proctoring response provides a useful next step', async ({ page }) => {
    await mockSession(page, 'LECTURER', 'empty');
    await page.goto('/lecturer/proctoring');
    await expect(page.getByRole('heading', { name: 'No live exams' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Exams' })).toBeVisible();
  });

  test('dashboard API failure exposes retry without leaving route', async ({ page }) => {
    await mockSession(page, 'LECTURER', 'error');
    await page.goto('/lecturer');
    await expect(page).toHaveURL(/\/lecturer$/);
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Release fixture unavailable|unavailable|failed|error/i);
  });

  test('slow dashboard response renders loading placeholders', async ({ page }) => {
    await mockSession(page, 'LECTURER', 'loading');
    await page.goto('/lecturer');
    await expect(page.locator('.animate-pulse').first()).toBeVisible();
    await expect(page.getByText('Release Readiness Exam').first()).toBeVisible({ timeout: 5_000 });
  });
});
