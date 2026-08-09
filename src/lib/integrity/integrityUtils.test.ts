import { describe, expect, it } from 'vitest';
import { frameDifferenceRatio } from './frameDifference';
import {
  calibrationQuality,
  isGazeDeviated,
  MIN_CALIBRATION_SAMPLES,
} from './headPose';

describe('integrity utilities', () => {
  it('detects meaningful pixel changes without comparing encodings', () => {
    const base = { pixels: new Uint8Array([10, 10, 10, 10]), width: 2, height: 2 };
    expect(frameDifferenceRatio(base, base)).toBe(0);
    expect(
      frameDifferenceRatio(base, {
        pixels: new Uint8Array([20, 10, 20, 10]),
        width: 2,
        height: 2,
      }),
    ).toBe(0.5);
  });

  it('accepts stable calibration and rejects unstable calibration', () => {
    const stable = Array.from({ length: MIN_CALIBRATION_SAMPLES }, (_, index) => ({
      yaw: index % 2,
      pitch: 1,
      roll: 0,
    }));
    expect(calibrationQuality(stable).acceptable).toBe(true);
    expect(
      calibrationQuality(
        stable.map((pose, index) => ({ ...pose, yaw: index % 2 ? 20 : -20 })),
      ).acceptable,
    ).toBe(false);
  });

  it('uses tighter calibrated gaze thresholds', () => {
    const baseline = { yaw: 2, pitch: -1, roll: 0 };
    expect(isGazeDeviated({ yaw: 20, pitch: -1, roll: 0 }, baseline)).toBe(false);
    expect(isGazeDeviated({ yaw: 21, pitch: -1, roll: 0 }, baseline)).toBe(true);
    expect(isGazeDeviated({ yaw: 2, pitch: 15, roll: 0 }, baseline)).toBe(true);
  });
});
