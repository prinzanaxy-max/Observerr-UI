import AxeBuilder from '@axe-core/playwright';
import { test, expect, mockSession } from './fixtures';

test.describe('critical authoring and recovery', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page, 'LECTURER');
  });

  test('validates imports, recovers drafts, and suppresses duplicate publish', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'Covered on desktop and tablet authoring layouts.');
    let createRequests = 0;
    await page.route('**/api/lecturer/exams', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback();
      createRequests += 1;
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 43 }) });
    });

    await page.goto('/lecturer/exams/new');
    await page.getByLabel('Exam Title').fill('Recovered final');
    await expect.poll(() => page.evaluate(() =>
      Object.keys(localStorage).some((key) => key.startsWith('observerr:lecturer-exam-draft:')),
    )).toBe(true);
    await page.reload();
    await expect(page.getByLabel('Exam Title')).toHaveValue('Recovered final');

    await page.getByRole('button', { name: 'Publish Exam' }).click();
    await expect(page.getByText('Associated course is required.')).toBeVisible();

    const importInput = page.locator('input[type="file"][accept=".txt,.docx"]');
    await importInput.setInputFiles({
      name: 'questions.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('not supported'),
    });
    await expect(page.getByText('Only .txt and .docx files are supported.')).toBeVisible();

    await importInput.setInputFiles({
      name: 'questions.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('1. Valid question?\nA. One\nB. Two\nC. Three\nD. Four\nAnswer: C'),
    });
    await expect(page.getByText('1 valid question ready to import.')).toBeVisible();
    await page.getByRole('button', { name: 'Replace with preview' }).click();
    await expect(page.getByPlaceholder('Question text')).toHaveValue('Valid question?');

    await page.getByLabel('Associated Course').fill('CS101');
    await page.getByLabel('Enrolled Student IDs').fill('STU-101');
    await page.getByLabel('Start Date & Time').fill('2026-08-03T09:00');
    await page.getByRole('button', { name: 'Publish Exam' }).dispatchEvent('click');
    await page.getByRole('button', { name: /Publish|Publishing/ }).dispatchEvent('click');
    await expect(page).toHaveURL(/\/lecturer\/exams$/);
    expect(createRequests).toBe(1);
    await expect.poll(() => page.evaluate(() =>
      Object.keys(localStorage).filter((key) => key.startsWith('observerr:lecturer-exam-draft:')).length,
    )).toBe(0);
  });
});

test.describe('critical student contracts', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page, 'STUDENT');
  });

  test('gates unreleased result payloads and contains malformed responses', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    await page.route(/\/api\/student\/results(?:\?|$)/, (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        content: [{
          id: 9,
          examId: 42,
          sessionId: 'pending',
          examTitle: 'Hidden result',
          courseCode: 'CS101',
          academicScore: 10,
          maxScore: 10,
          percentage: 100,
          integrityScore: 100,
          requiresReview: false,
          submittedAt: '2026-08-02T12:00:00.000Z',
          status: 'PENDING',
        }],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      }),
    }));
    await page.goto('/student/results');
    await expect(page.getByRole('heading', { name: 'Could not load results' })).toBeVisible();

    await page.route(/\/api\/notifications(?:\?|$)/, (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ content: null }),
    }));
    await page.goto('/student/notifications');
    await expect(page.getByRole('alert')).toContainText('Could not load notifications');
    expect(pageErrors).toEqual([]);
  });

  test('saves notification preferences once and reports upload validation errors', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'Covered on desktop and tablet settings layouts.');
    let preferenceWrites = 0;
    await page.route('**/api/notifications/preferences', async (route) => {
      if (route.request().method() === 'PUT') {
        preferenceWrites += 1;
        await new Promise((resolve) => setTimeout(resolve, 200));
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: route.request().postData() ?? '{}',
        });
      }
      return route.fallback();
    });
    await page.goto('/student/settings');
    await page.getByRole('button', { name: 'Notifications' }).first().click();
    await page.getByRole('switch', { name: /Exam/i }).click();
    const save = page.getByRole('button', { name: 'Save Preferences' });
    await save.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
    await expect(page.getByText('Notification preferences saved.')).toBeVisible();
    expect(preferenceWrites).toBe(1);

    await page.getByRole('button', { name: 'Account' }).first().click();
    await page.locator('input[type="file"]').setInputFiles({
      name: 'too-large.png',
      mimeType: 'image/png',
      buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
    });
    await expect(page.getByText(/5 MB/i).last()).toBeVisible();
  });

  test('supports browser back and forward across result detail', async ({ page }) => {
    await page.goto('/student/results');
    await page.getByRole('button', { name: /View .* result/i }).first().click();
    await expect(page).toHaveURL(/\/student\/results\/7$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/student\/results$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/student\/results\/7$/);
  });

  test('automatically recovers question loading when connectivity returns', async ({ page }) => {
    await page.addInitScript(() => {
      (window as Window & { __e2eOnline?: boolean }).__e2eOnline = false;
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        get: () => (window as Window & { __e2eOnline?: boolean }).__e2eOnline,
      });
    });
    let questionCalls = 0;
    await page.route('**/api/student/exam-sessions/session-7/questions', (route) => {
      questionCalls += 1;
      if (questionCalls === 1) {
        return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 501,
          order: 1,
          text: 'Recovered question',
          points: 1,
          options: [
            { key: 'A', text: 'Alpha' },
            { key: 'B', text: 'Beta' },
            { key: 'C', text: 'Gamma' },
            { key: 'D', text: 'Delta' },
          ],
        }]),
      });
    });
    await page.goto('/student/exams/42/take');
    await expect(page.getByText('You are offline. Reconnect to continue loading this exam.')).toBeVisible();
    await page.evaluate(() => {
      (window as Window & { __e2eOnline?: boolean }).__e2eOnline = true;
      window.dispatchEvent(new Event('online'));
    });
    await expect.poll(() => questionCalls).toBe(2);
    await expect(page.getByText('Recovered question')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('critical lecturer controls', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page, 'LECTURER');
  });

  test('blocks and unblocks a monitored student with backend contract paths', async ({ page }) => {
    const methods: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.endsWith('/api/lecturer/exams/42/students/STU-101/block')) {
        methods.push(request.method());
      }
    });
    await page.route('**/api/lecturer/exams/42/live-sessions', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        examId: 42,
        stats: { active: 1, total: 1, highRisk: 1, warnings: 0, networkStability: 99 },
        students: [{
          studentId: 101,
          studentNumber: 'STU-101',
          name: 'Sam Observer',
          initials: 'SO',
          liveStatus: 'active',
          liveStatusLabel: 'Active',
          riskLevel: 'high',
          lastEvent: 'Tab switch',
          latestSessionId: 'session-7',
          integrityScore: 70,
          blocked: false,
          blockReason: null,
        }],
      }),
    }));
    await page.route('**/api/lecturer/exams/42/students/STU-101/block', (route) => {
      return route.fulfill({
        status: route.request().method() === 'DELETE' ? 204 : 200,
        contentType: 'application/json',
        body: route.request().method() === 'DELETE' ? '' : '{"blocked":true}',
      });
    });
    await page.goto('/lecturer/exams/42/live');
    await page.getByRole('button', { name: 'Block Sam Observer for this exam' }).click();
    await page.getByLabel('Reason').fill('Policy violation');
    await page.getByRole('button', { name: 'Block student' }).click();
    await expect(page.getByRole('button', { name: 'Unblock Sam Observer for this exam' })).toBeVisible();
    await page.getByRole('button', { name: 'Unblock Sam Observer for this exam' }).click();
    await expect(page.getByRole('button', { name: 'Block Sam Observer for this exam' })).toBeVisible();
    expect(methods).toEqual(['POST', 'DELETE']);
  });

  test('sends report search and severity filters to the API', async ({ page }) => {
    await page.goto('/lecturer/reports');
    await page.getByRole('button', { name: 'View Full Report' }).click();
    await expect(page.getByRole('heading', { name: 'Full Integrity Report' })).toBeVisible();
    const filtered = page.waitForRequest((request) => {
      const url = new URL(request.url());
      return url.pathname.endsWith('/api/lecturer/analytics/integrity-events')
        && url.searchParams.get('search') === 'Sam'
        && url.searchParams.get('severity') === 'DANGER';
    });
    await page.getByLabel('Search report').fill('Sam');
    await page.getByLabel('Filter severity').selectOption('DANGER');
    await filtered;
  });

  test('has no serious or critical authoring accessibility findings', async ({ page }) => {
    await page.goto('/lecturer/exams/new');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    )).toEqual([]);
  });
});

test('refreshes one expired token and retries the protected request', async ({ page }) => {
  await mockSession(page, 'STUDENT');
  let statsCalls = 0;
  let refreshCalls = 0;
  await page.route('**/api/student/stats', (route) => {
    statsCalls += 1;
    return route.fulfill({
      status: statsCalls === 1 ? 401 : 200,
      contentType: 'application/json',
      body: statsCalls === 1
        ? '{}'
        : JSON.stringify({ examsCompleted: 4, avgIntegrity: 96, verifiedSessions: 4, underReview: 0 }),
    });
  });
  await page.route('**/api/auth/refresh', (route) => {
    refreshCalls += 1;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: 'renewed-token',
        refreshToken: 'renewed-refresh',
        tokenType: 'Bearer',
        role: 'STUDENT',
        institutionalId: 'STU-101',
        expiresIn: 3600,
      }),
    });
  });
  await page.goto('/student');
  await expect(page.locator('main')).toBeVisible();
  await expect.poll(() => statsCalls).toBe(2);
  expect(refreshCalls).toBe(1);
});

test('supports isolated mocked student and lecturer roles', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Cross-role isolation is viewport-independent.');
  test.slow();
  const studentContext = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const lecturerContext = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const student = await studentContext.newPage();
  const lecturer = await lecturerContext.newPage();
  await mockSession(student, 'STUDENT');
  await mockSession(lecturer, 'LECTURER');

  await Promise.all([student.goto('/student/exams'), lecturer.goto('/lecturer/exams')]);
  await expect(student.getByRole('heading', { name: 'Exams' })).toBeVisible();
  await expect(lecturer.locator('main')).toContainText('Exams Overview');
  await student.goto('/lecturer/exams');
  await lecturer.goto('/student/results');
  await expect(student.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  await expect(lecturer.getByRole('heading', { name: 'Access Denied' })).toBeVisible();

  await Promise.all([studentContext.close(), lecturerContext.close()]);
});
