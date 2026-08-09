import { describe, expect, it } from 'vitest';
import {
  normalizeNotificationPage,
  normalizeNotificationPreferences,
} from '../services/notificationService';
import {
  normalizeResultDetail,
  normalizeResultsPage,
} from '../services/studentResultsService';
import { normalizeLiveSessions } from '../services/lecturerLiveSessionsService';
import { normalizeIntegrityReport } from '../services/lecturerAnalyticsService';
import { normalizeLecturerResults } from '../services/lecturerExamsService';

const result = {
  id: 7,
  examId: 42,
  sessionId: 'session-7',
  examTitle: 'Final',
  courseCode: 'CS101',
  academicScore: 8,
  maxScore: 10,
  percentage: 80,
  integrityScore: 95,
  requiresReview: false,
  submittedAt: '2026-08-02T12:00:00.000Z',
  status: 'RELEASED',
};

describe('API contract normalizers', () => {
  it('accepts current backend result list and detail contracts', () => {
    expect(normalizeResultsPage({
      content: [result],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
    }).content).toHaveLength(1);
    expect(normalizeResultDetail({
      result,
      analysis: [{
        questionId: 1,
        question: 'Question?',
        selectedAnswer: null,
        correctAnswer: 'A',
        correct: false,
        pointsEarned: 0,
        pointsPossible: 1,
      }],
    }).analysis[0].selectedAnswer).toBeNull();
  });

  it('rejects malformed result payloads before render mapping', () => {
    expect(() => normalizeResultsPage({ content: null })).toThrow('Invalid student results page');
    expect(() => normalizeResultDetail({ result, analysis: [{ questionId: 'bad' }] }))
      .toThrow('Invalid question analysis');
  });

  it('accepts notification inbox and preference contracts', () => {
    expect(normalizeNotificationPage({
      content: [{
        id: 1,
        category: 'RESULT',
        title: 'Released',
        message: 'Ready',
        read: false,
        createdAt: '2026-08-02T12:00:00.000Z',
        deepLink: '/student/results/7',
      }],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      unreadCount: 1,
    }).content[0].category).toBe('RESULT');
    expect(normalizeNotificationPreferences({
      examEvents: true,
      integrityAlerts: false,
      resultUpdates: true,
      systemUpdates: false,
    }).integrityAlerts).toBe(false);
  });

  it('rejects unknown notification categories and partial preferences', () => {
    expect(() => normalizeNotificationPage({
      content: [{
        id: 1,
        category: 'OTHER',
        title: 'x',
        message: 'x',
        read: false,
        createdAt: 'x',
        deepLink: null,
      }],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      unreadCount: 1,
    })).toThrow('Invalid notification response');
    expect(() => normalizeNotificationPreferences({ examEvents: true }))
      .toThrow('Invalid notification preferences');
  });

  it('rejects malformed live-session stats before dashboard mapping', () => {
    expect(() => normalizeLiveSessions({
      examId: 42,
      stats: { active: 'one' },
      students: [],
    })).toThrow('Invalid live sessions');
  });

  it('rejects malformed report pages before table rendering', () => {
    expect(() => normalizeIntegrityReport({
      content: [{ id: 1, severity: 'UNKNOWN' }],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      eventTypes: [],
    })).toThrow('Invalid integrity report event');
  });

  it('rejects malformed lecturer result rows before table rendering', () => {
    expect(() => normalizeLecturerResults({ content: [] }))
      .toThrow('Invalid lecturer exam results');
  });
});
