import { describe, expect, it } from 'vitest';
import { mapProctoringFeedToView } from './lecturerDashboardUtils';

describe('lecturer proctoring API contract', () => {
  it('maps the backend feed fields and preserves LiveKit identity', () => {
    const feed = mapProctoringFeedToView({
      sessionId: '6ab38e32-0ae1-4d43-a38c-26ff4a94d0b4',
      participantIdentity: '6ab38e32-0ae1-4d43-a38c-26ff4a94d0b4',
      roomName: 'exam-42',
      studentId: 7,
      studentName: 'Ada Student',
      initials: 'AS',
      riskLevel: 'HIGH',
      liveStatusLabel: 'Needs attention',
      integrityScore: 68,
      snapshotUrl: null,
      lastEvent: 'Tab/window blur',
    });

    expect(feed.id).toBe('7');
    expect(feed.name).toBe('Ada Student');
    expect(feed.participantIdentity).toBe(
      '6ab38e32-0ae1-4d43-a38c-26ff4a94d0b4',
    );
    expect(feed.roomName).toBe('exam-42');
    expect(feed.lastFlag).toBe('Tab/window blur');
    expect(feed.risk).toBe('high');
  });
});
