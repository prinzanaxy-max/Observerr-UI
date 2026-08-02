import { describe, expect, it } from 'vitest';
import {
  applyProctoringUnavailableCap,
  describeEvent,
  resolveDeductionsForEvent,
} from './integrityScoring';

const event = (durationMs: number) => ({
  type: 'gaze_deviation_end' as const,
  timestamp: new Date(0).toISOString(),
  durationMs,
});

describe('integrity scoring boundaries', () => {
  it('closes the moderate gaze gap', () => {
    expect(resolveDeductionsForEvent(event(3_999))[0]?.code).toBe(
      'GAZE_DEVIATION_BRIEF',
    );
    expect(resolveDeductionsForEvent(event(4_000))[0]?.code).toBe(
      'GAZE_DEVIATION_MODERATE',
    );
    expect(resolveDeductionsForEvent(event(9_999))[0]?.code).toBe(
      'GAZE_DEVIATION_MODERATE',
    );
    expect(resolveDeductionsForEvent(event(10_000))[0]?.code).toBe(
      'GAZE_DEVIATION_SUSTAINED',
    );
  });

  it('scores short face absence and unavailable proctoring', () => {
    expect(
      resolveDeductionsForEvent({
        type: 'face_restored',
        timestamp: new Date(0).toISOString(),
        durationMs: 2_000,
      })[0]?.code,
    ).toBe('FACE_ABSENT_SHORT');
    const unavailable = resolveDeductionsForEvent({
      type: 'proctoring_unavailable',
      timestamp: new Date(0).toISOString(),
    })[0];
    expect(unavailable).toMatchObject({ points: 15, requiresReview: true });
    expect(applyProctoringUnavailableCap(unavailable!, 100).points).toBe(15);
    expect(applyProctoringUnavailableCap(unavailable!, 70).points).toBe(0);
  });

  it('only offers the repeated-tab rule after the threshold', () => {
    const blur = { type: 'tab_blur' as const, timestamp: new Date(0).toISOString() };
    expect(resolveDeductionsForEvent(blur, 2)).toHaveLength(1);
    expect(resolveDeductionsForEvent(blur, 3).map((rule) => rule.code)).toEqual([
      'TAB_BLUR',
      'TAB_BLUR_REPEATED',
    ]);
  });

  it('scores only completed brief partial-face episodes', () => {
    const started = {
      type: 'face_partial_out_of_frame' as const,
      timestamp: new Date(0).toISOString(),
    };
    expect(resolveDeductionsForEvent(started)).toEqual([]);
    expect(describeEvent(started).code).toBe('FACE_PARTIAL_DETECTED');

    const brief = {
      ...started,
      durationMs: 5_000,
      metadata: { ended: true },
    };
    expect(resolveDeductionsForEvent(brief)[0]?.code).toBe('FACE_PARTIAL_BRIEF');

    const long = { ...brief, durationMs: 5_001 };
    expect(resolveDeductionsForEvent(long)).toEqual([]);
    expect(describeEvent(long).code).toBe('FACE_PARTIAL_CLEARED');
  });
});
