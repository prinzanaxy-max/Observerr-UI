import type { HeadPose } from '../../types/integrityMonitoring';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Extract yaw / pitch / roll (degrees) from MediaPipe Face Landmarker
 * facialTransformationMatrixes[0] — a row-major 4×4 rigid transform.
 *
 * Convention (MediaPipe face geometry):
 *   yaw   = rotation about Y (left/right)
 *   pitch = rotation about X (up/down)
 *   roll  = rotation about Z (head tilt)
 *
 * Reference: MediaPipe face landmarker transformation matrix docs + standard
 * rotation-matrix → Tait-Bryan angle decomposition.
 */
export function matrixToHeadPose(matrix: number[] | Float32Array): HeadPose {
  const m = matrix;
  const r00 = m[0];
  const r10 = m[4];
  const r20 = m[8];
  const r21 = m[9];
  const r22 = m[10];

  const sy = Math.hypot(r00, r10);
  const singular = sy < 1e-6;

  let yaw: number;
  let pitch: number;
  let roll: number;

  if (!singular) {
    yaw = Math.atan2(r10, r00);
    pitch = Math.atan2(-r20, sy);
    roll = Math.atan2(r21, r22);
  } else {
    yaw = Math.atan2(-m[1], m[5]);
    pitch = Math.atan2(-r20, sy);
    roll = 0;
  }

  return {
    yaw: toDegrees(yaw),
    pitch: toDegrees(pitch),
    roll: toDegrees(roll),
  };
}

export const YAW_DEVIATION_THRESHOLD_DEG = 18;
export const PITCH_DEVIATION_THRESHOLD_DEG = 15;
export const MIN_CALIBRATION_SAMPLES = 8;
export const MAX_CALIBRATION_STDDEV_DEG = 6;

export function isGazeDeviated(
  pose: HeadPose,
  baseline: HeadPose | null,
): boolean {
  if (!baseline) return false;
  const deltaYaw = Math.abs(pose.yaw - baseline.yaw);
  const deltaPitch = Math.abs(pose.pitch - baseline.pitch);
  return (
    deltaYaw > YAW_DEVIATION_THRESHOLD_DEG ||
    deltaPitch > PITCH_DEVIATION_THRESHOLD_DEG
  );
}

export function averageHeadPoses(poses: HeadPose[]): HeadPose {
  if (poses.length === 0) {
    return { yaw: 0, pitch: 0, roll: 0 };
  }
  const sum = poses.reduce(
    (acc, p) => ({
      yaw: acc.yaw + p.yaw,
      pitch: acc.pitch + p.pitch,
      roll: acc.roll + p.roll,
    }),
    { yaw: 0, pitch: 0, roll: 0 },
  );
  const n = poses.length;
  return {
    yaw: sum.yaw / n,
    pitch: sum.pitch / n,
    roll: sum.roll / n,
  };
}

export function calibrationQuality(poses: HeadPose[]): {
  acceptable: boolean;
  baseline: HeadPose;
  sampleCount: number;
  maxStdDev: number;
} {
  const baseline = averageHeadPoses(poses);
  const standardDeviation = (key: keyof HeadPose) => {
    if (poses.length === 0) return Number.POSITIVE_INFINITY;
    const variance =
      poses.reduce((sum, pose) => sum + (pose[key] - baseline[key]) ** 2, 0) / poses.length;
    return Math.sqrt(variance);
  };
  const maxStdDev = Math.max(standardDeviation('yaw'), standardDeviation('pitch'));
  return {
    acceptable:
      poses.length >= MIN_CALIBRATION_SAMPLES && maxStdDev <= MAX_CALIBRATION_STDDEV_DEG,
    baseline,
    sampleCount: poses.length,
    maxStdDev,
  };
}

/** Landmark bounding-box area (normalised 0–1) vs frame. */
export function computeFaceBoxCoverage(
  landmarks: { x: number; y: number }[],
): { coverage: number; partialOutOfFrame: boolean } {
  if (landmarks.length === 0) {
    return { coverage: 0, partialOutOfFrame: false };
  }

  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;
  let edgeClipped = false;

  for (const lm of landmarks) {
    minX = Math.min(minX, lm.x);
    maxX = Math.max(maxX, lm.x);
    minY = Math.min(minY, lm.y);
    maxY = Math.max(maxY, lm.y);
    if (lm.x < 0.02 || lm.x > 0.98 || lm.y < 0.02 || lm.y > 0.98) {
      edgeClipped = true;
    }
  }

  const width = clamp(maxX - minX, 0, 1);
  const height = clamp(maxY - minY, 0, 1);
  const coverage = width * height;

  const tooSmall = coverage < 0.04;
  const partialOutOfFrame = edgeClipped || tooSmall;

  return { coverage, partialOutOfFrame };
}
