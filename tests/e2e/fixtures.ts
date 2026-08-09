import { test as base, expect, type Page, type Route } from '@playwright/test';

export type Role = 'STUDENT' | 'LECTURER';
export type ApiMode = 'success' | 'empty' | 'error' | 'loading';

const now = '2026-08-02T12:00:00.000Z';

const user = (role: Role) => ({
  id: role === 'STUDENT' ? 101 : 201,
  institutionalId: role === 'STUDENT' ? 'STU-101' : 'LEC-201',
  email: `${role.toLowerCase()}@observerr.test`,
  role,
  createdAt: now,
  profilePictureUrl: null,
});

const account = (role: Role) => ({
  ...user(role),
  firstName: role === 'STUDENT' ? 'Sam' : 'Lee',
  lastName: 'Observer',
  fullName: role === 'STUDENT' ? 'Sam Observer' : 'Lee Observer',
});

const exam = {
  id: 42,
  title: 'Release Readiness Exam',
  courseCode: 'CS101',
  courseName: 'Computer Science',
  courseLabel: 'CS101 · Computer Science',
  term: 'Fall 2026',
  schedule: 'Today, 2:00 PM',
  status: 'LIVE',
  enrollment: '1 enrolled',
  enrolledCount: 1,
  capacityCount: 30,
  activeFlagsCount: 0,
  startAt: now,
  endAt: '2026-08-02T13:00:00.000Z',
  durationMinutes: 60,
  security: { webcamMonitoring: true, tabSwitchTracking: true, blockCopyPaste: true },
  canTake: true,
  detail: null,
};

const result = {
  id: 7,
  examId: 42,
  sessionId: 'session-7',
  examTitle: 'Release Readiness Exam',
  courseCode: 'CS101',
  academicScore: 18,
  maxScore: 20,
  percentage: 90,
  integrityScore: 96,
  requiresReview: false,
  submittedAt: now,
  status: 'RELEASED',
};

function payload(path: string, role: Role, mode: ApiMode): unknown {
  const empty = mode === 'empty';
  if (path === '/api/auth/me') return user(role);
  if (path === '/api/auth/refresh') {
    return { accessToken: 'e2e-token', refreshToken: 'e2e-refresh', tokenType: 'Bearer', role, institutionalId: user(role).institutionalId, expiresIn: 3600 };
  }
  if (path === '/api/account/me') return account(role);
  if (path === '/api/student/stats') return empty ? { examsCompleted: 0, avgIntegrity: 100, verifiedSessions: 0, underReview: 0 } : { examsCompleted: 4, avgIntegrity: 96, verifiedSessions: 4, underReview: 0 };
  if (path === '/api/student/exams') return { exams: empty ? [] : [exam], totalElements: empty ? 0 : 1 };
  if (/^\/api\/student\/exams\/\d+$/.test(path)) return exam;
  if (/^\/api\/student\/exams\/\d+\/sessions$/.test(path)) {
    return { sessionId: 'session-7', examId: 42, startedAt: now, startingScore: 100, status: 'ACTIVE' };
  }
  if (/^\/api\/student\/exam-sessions\/[^/]+\/questions$/.test(path)) {
    return empty ? [] : [{
      id: 501,
      order: 0,
      text: 'Which option is correct?',
      points: 1,
      options: [
        { key: 'A', text: 'Alpha' },
        { key: 'B', text: 'Beta' },
        { key: 'C', text: 'Gamma' },
        { key: 'D', text: 'Delta' },
      ],
    }];
  }
  if (/^\/api\/student\/exam-sessions\/[^/]+\/answers$/.test(path)) return [];
  if (path === '/api/student/results') return { content: empty ? [] : [result], page: 0, size: 10, totalElements: empty ? 0 : 1, totalPages: empty ? 0 : 1 };
  if (/^\/api\/student\/results\/\d+$/.test(path)) return { result, analysis: [] };
  if (path === '/api/notifications') return { content: empty ? [] : [{ id: 1, category: 'RESULT', title: 'Results released', message: 'Your result is ready.', read: false, createdAt: now, deepLink: '/student/results/7' }], page: 0, size: 20, totalElements: empty ? 0 : 1, totalPages: empty ? 0 : 1, unreadCount: empty ? 0 : 1 };
  if (path === '/api/notifications/preferences') return { examEvents: true, integrityAlerts: true, resultUpdates: true, systemUpdates: true };
  if (path === '/api/lecturer/dashboard') return {
    liveExam: empty ? null : { examId: 42, title: exam.title, courseCode: exam.courseCode, status: 'LIVE', remainingSeconds: 1800, activeStudents: 1, highRiskCount: 0, avgIntegrityScore: 96 },
    needsReview: [],
    examTabs: { live: empty ? [] : [exam], upcoming: [], completed: [] },
    integrityTrend: { changeLabel: 'Stable', changeDirection: 'STABLE', points: [95, 96] },
    topFlaggedBehaviors: [],
  };
  if (path === '/api/lecturer/students/needs-review') return [];
  if (path === '/api/lecturer/exams') return { exams: empty ? [] : [exam], totalElements: empty ? 0 : 1 };
  if (/^\/api\/lecturer\/exams\/\d+$/.test(path)) return exam;
  if (/^\/api\/lecturer\/exams\/\d+\/results$/.test(path)) return empty ? [] : [{ ...result, studentId: 101, studentName: 'Sam Observer' }];
  if (/^\/api\/lecturer\/exams\/\d+\/live-sessions$/.test(path)) return {
    examId: 42,
    stats: { active: 0, total: 0, highRisk: 0, warnings: 0, networkStability: 100 },
    students: [],
  };
  if (path === '/api/lecturer/students') return { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, from: 0, to: 0, availableCourses: [] };
  if (path === '/api/lecturer/analytics/overview') return {
    period: '30D',
    totalExamsMonitored: { value: 1, changePercent: 0, changeDirection: 'STABLE', changeLabel: 'No change' },
    totalFlaggedEvents: { value: 0, changePercent: 0, changeDirection: 'STABLE', changeLabel: 'No change' },
    avgIntegrityScore: { value: 96, changePercent: 0, changeDirection: 'STABLE', changeLabel: 'No change' },
    mostCommonFlag: { label: 'None', sharePercent: 0, icon: 'check' },
    trends: { title: 'Integrity Event Trends', subtitle: 'Release fixture', granularity: 'DAY', points: [] },
    topBehaviors: [],
  };
  if (path === '/api/lecturer/analytics/integrity-events') return { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, eventTypes: [] };
  if (path === '/api/lecturer/proctoring/exams') return { exams: [] };
  if (/^\/api\/lecturer\/proctoring\/exams\/\d+\/feeds$/.test(path)) return { feeds: [] };
  return {};
}

async function fulfillApi(route: Route, role: Role, mode: ApiMode) {
  if (mode === 'loading') await new Promise((resolve) => setTimeout(resolve, 1_500));
  if (mode === 'error' && new URL(route.request().url()).pathname !== '/api/auth/me') {
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'E2E_UNAVAILABLE', message: 'Release fixture unavailable', timestamp: now }) });
    return;
  }
  const path = new URL(route.request().url()).pathname;
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload(path, role, mode)) });
}

export async function mockSession(page: Page, role: Role, mode: ApiMode = 'success') {
  await page.addInitScript((token) => sessionStorage.setItem('observerr:accessToken', token), 'e2e-token');
  await page.route('**/api/**', (route) => fulfillApi(route, role, mode));
}

export const test = base.extend({
  page: async ({ page }, providePage) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173\/)/, (route) => route.abort());
    await providePage(page);
  },
});
export { expect };
