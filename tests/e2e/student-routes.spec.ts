import AxeBuilder from '@axe-core/playwright';
import { test, expect, mockSession } from './fixtures';

const routes = [
  ['/student', /Dashboard|Upcoming Exams/i],
  ['/student/exams', /Exams/i],
  ['/student/exams/42', /Release Readiness Exam/i],
  ['/student/results', /Results/i],
  ['/student/results/7', /CS101/i],
  ['/student/notifications', /Notifications/i],
  ['/student/settings', /Settings/i],
  ['/student/profile', /Profile/i],
  ['/student/documentation', /Documentation/i],
] as const;

test.describe('student release routes', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page, 'STUDENT');
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
    await page.goto('/student');
    await expect(page.locator('main')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });
});

test.describe('student API states', () => {
  test('empty exams response renders a stable empty state', async ({ page }) => {
    await mockSession(page, 'STUDENT', 'empty');
    await page.goto('/student/exams');
    await expect(page.getByRole('heading', { name: /No exams found/i })).toBeVisible();
  });

  test('API errors remain on-route and expose recovery UI', async ({ page }) => {
    await mockSession(page, 'STUDENT', 'error');
    await page.goto('/student/notifications');
    await expect(page).toHaveURL(/\/student\/notifications$/);
    await expect(page.locator('body')).toContainText(/Release fixture unavailable|Retry|unable|failed|error/i);
  });

  test('slow API displays loading UI before settling', async ({ page }) => {
    await mockSession(page, 'STUDENT', 'loading');
    await page.goto('/student/notifications');
    await expect(page.getByLabel('Loading notifications')).toBeVisible();
    await expect(page.getByText('Results released')).toBeVisible({ timeout: 5_000 });
  });
});
