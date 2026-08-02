import AxeBuilder from '@axe-core/playwright';
import { test, expect, mockSession } from './fixtures';

test.describe('public release paths', () => {
  test('landing, auth aliases, keyboard focus, and public accessibility', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Honest Exams/ })).toBeVisible();

    await page.goto('/login');
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    await expect(focused).toHaveAttribute('href', '/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

    await page.goto('/register');
    await expect(page).toHaveURL(/\/auth\?mode=signup$/);
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('unknown deep links render the not-found route', async ({ page }) => {
    await page.goto('/release/deep-link-that-does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  });
});

test.describe('session and role guards', () => {
  test('anonymous protected deep link returns to auth', async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: '{}' }),
    );
    await page.goto('/student/results/7');
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('student cannot open lecturer deep links', async ({ page }) => {
    await mockSession(page, 'STUDENT');
    await page.goto('/lecturer/exams/42/results');
    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  });

  test('lecturer cannot open student deep links', async ({ page }) => {
    await mockSession(page, 'LECTURER');
    await page.goto('/student/profile');
    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  });
});
