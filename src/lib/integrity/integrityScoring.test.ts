import { describe, expect, it } from 'vitest';
import {
  applyCap,
  applyIntegrityRules,
  applyProctoringUnavailableCap,
  describeEvent,
  resolveDeductionsForEvent,
} from './integrityScoring';

const gaze = (durationMs: number) => ({
  type: 'gaze_deviation_end' as const,
  timestamp: new Date(0).toISOString(),
  durationMs,
});

describe('integrity scoring model', () => {
  it('scales gaze deductions with how long the student looked away', () => {
    expect(resolveDeductionsForEvent(gaze(3_999))[0]).toMatchObject({ code: 'GAZE_DEVIATION_BRIEF', points: 3 });
    expect(resolveDeductionsForEvent(gaze(4_000))[0]).toMatchObject({ code: 'GAZE_DEVIATION_MODERATE', points: 6 });
    expect(resolveDeductionsForEvent(gaze(10_000))[0]).toMatchObject({ code: 'GAZE_DEVIATION_SUSTAINED', points: 10 });
  });

  it('separates copy and paste deductions', () => {
    expect(
      resolveDeductionsForEvent({
        type: 'clipboard_event',
        timestamp: new Date(0).toISOString(),
        metadata: { action: 'copy' },
      })[0],
    ).toMatchObject({ code: 'COPY_EVENT', points: 7 });
    expect(
      resolveDeductionsForEvent({
        type: 'clipboard_event',
        timestamp: new Date(0).toISOString(),
        metadata: { action: 'paste' },
      })[0],
    ).toMatchObject({ code: 'PASTE_EVENT', points: 8 });
  });

  it('five copies deduct 35 points and land below 70%', () => {
    let score = 100;
    let caps: Record<string, number> = {};
    const copy = resolveDeductionsForEvent({
      type: 'clipboard_event',
      timestamp: new Date(0).toISOString(),
      metadata: { action: 'copy' },
    });
    for (let i = 0; i < 5; i += 1) {
      const result = applyIntegrityRules(score, copy, caps);
      score = result.newScore;
      caps = result.deductedByCap;
    }
    expect(score).toBe(65);
    expect(caps.COPY).toBe(35);
    const sixth = applyIntegrityRules(score, copy, caps);
    expect(sixth.updates[0]?.pointsDeducted).toBe(0);
    expect(sixth.updates[0]?.requiresReview).toBe(true);
  });

  it('caps unavailable proctoring at 60', () => {
    const unavailable = resolveDeductionsForEvent({
      type: 'proctoring_unavailable',
      timestamp: new Date(0).toISOString(),
    })[0];
    expect(applyProctoringUnavailableCap(unavailable!, 100).points).toBe(40);
    expect(applyProctoringUnavailableCap(unavailable!, 50).points).toBe(0);
  });

  it('applies remaining capacity correctly', () => {
    expect(applyCap('COPY', 7, 28)).toEqual({ points: 7, hitCap: true });
    expect(applyCap('COPY', 7, 35)).toEqual({ points: 0, hitCap: true });
  });

  it('describes clipboard actions distinctly', () => {
    expect(
      describeEvent({
        type: 'clipboard_event',
        timestamp: new Date(0).toISOString(),
        metadata: { action: 'paste' },
      }).code,
    ).toBe('PASTE_EVENT');
  });
});
