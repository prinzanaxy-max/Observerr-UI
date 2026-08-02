import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import type {
  CalibrationBaseline,
  FaceDetectionSignals,
  IntegrityEvent,
  IntegrityMonitorStatus,
} from '../types/integrityMonitoring';
import {
  calibrationQuality,
  computeFaceBoxCoverage,
  isGazeDeviated,
  matrixToHeadPose,
} from '../lib/integrity/headPose';
import { IntegrityEventMachine } from '../lib/integrity/integrityEventMachine';
import {
  closeFaceLandmarker,
  loadFaceLandmarker,
} from '../lib/integrity/faceLandmarkerLoader';
import type { FaceLandmarker } from '@mediapipe/tasks-vision';
import {
  frameDifferenceRatio,
  sampleVideoLuma,
  type LumaFrame,
} from '../lib/integrity/frameDifference';

const DEFAULT_INFERENCE_MS = 500;
const CALIBRATION_DURATION_MS = 3_000;
const CALIBRATION_SAMPLE_INTERVAL_MS = 200;

export type UseIntegrityMonitorOptions = {
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
  onIntegrityEvent: (event: IntegrityEvent) => void;
  /** Pre-set baseline; if omitted, call calibrate() before monitoring. */
  calibrationBaseline?: CalibrationBaseline | null;
  examContainerRef?: RefObject<HTMLElement | null>;
  inferenceIntervalMs?: number;
  blockClipboard?: boolean;
  beforeStopTracks?: () => Promise<void> | void;
};

export type UseIntegrityMonitorReturn = {
  status: IntegrityMonitorStatus;
  isCalibrating: boolean;
  calibrationBaseline: CalibrationBaseline | null;
  calibrate: () => Promise<CalibrationBaseline>;
  error: string | null;
  mediaStream: MediaStream | null;
};

function isDevtoolsShortcut(e: KeyboardEvent): boolean {
  const key = e.key.toLowerCase();
  if (key === 'f12') return true;
  if (e.ctrlKey && e.shiftKey && key === 'i') return true;
  if (e.metaKey && e.altKey && key === 'i') return true;
  if (e.ctrlKey && e.shiftKey && key === 'j') return true;
  if (e.metaKey && e.altKey && key === 'j') return true;
  return false;
}

export function useIntegrityMonitor({
  videoRef,
  enabled = true,
  onIntegrityEvent,
  calibrationBaseline: externalBaseline = null,
  examContainerRef,
  inferenceIntervalMs = DEFAULT_INFERENCE_MS,
  blockClipboard = true,
  beforeStopTracks,
}: UseIntegrityMonitorOptions): UseIntegrityMonitorReturn {
  const [status, setStatus] = useState<IntegrityMonitorStatus>('idle');
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationBaseline, setCalibrationBaseline] = useState<CalibrationBaseline | null>(
    externalBaseline,
  );
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const machineRef = useRef<IntegrityEventMachine | null>(null);
  const loopHandleRef = useRef<number | null>(null);
  const lastInferenceRef = useRef(0);
  const monitoringRef = useRef(false);
  const baselineRef = useRef<CalibrationBaseline | null>(externalBaseline);
  const lastFaceDetectedRef = useRef(true);
  const frozenFrameCountRef = useRef(0);
  const lastFrameSampleRef = useRef<LumaFrame | null>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frozenEmittedRef = useRef(false);
  const onEventRef = useRef(onIntegrityEvent);
  const beforeStopTracksRef = useRef(beforeStopTracks);
  useEffect(() => {
    onEventRef.current = onIntegrityEvent;
  }, [onIntegrityEvent]);
  useEffect(() => {
    beforeStopTracksRef.current = beforeStopTracks;
  }, [beforeStopTracks]);

  useEffect(() => {
    baselineRef.current = calibrationBaseline ?? externalBaseline;
  }, [calibrationBaseline, externalBaseline]);

  const emit = useCallback((event: IntegrityEvent) => {
    onEventRef.current(event);
  }, []);

  useEffect(() => {
    machineRef.current = new IntegrityEventMachine(emit);
    return () => {
      machineRef.current?.reset();
      machineRef.current = null;
    };
  }, [emit]);

  const processDetection = useCallback(
    (landmarker: FaceLandmarker, video: HTMLVideoElement, timestampMs: number) => {
      const result = landmarker.detectForVideo(video, timestampMs);
      const faceCount = result.faceLandmarks.length;
      const faceDetected = faceCount > 0;

      let headPose = null;
      let gazeDeviation = false;
      let faceBoxCoverage = 0;
      let partialOutOfFrame = false;

      if (faceDetected) {
        const landmarks = result.faceLandmarks[0].map((lm) => ({ x: lm.x, y: lm.y }));
        const box = computeFaceBoxCoverage(landmarks);
        faceBoxCoverage = box.coverage;
        partialOutOfFrame = box.partialOutOfFrame;

        if (result.facialTransformationMatrixes?.length) {
          headPose = matrixToHeadPose(result.facialTransformationMatrixes[0].data);
          gazeDeviation = isGazeDeviated(headPose, baselineRef.current);
        }
      }

      const signals: FaceDetectionSignals = {
        faceDetected,
        faceCount,
        headPose,
        gazeDeviation,
        faceBoxCoverage,
        partialOutOfFrame,
      };

      lastFaceDetectedRef.current = faceDetected;

      if (video.videoWidth > 0 && !frozenEmittedRef.current) {
        frameCanvasRef.current ??= document.createElement('canvas');
        const sample = sampleVideoLuma(video, frameCanvasRef.current);
        const previous = lastFrameSampleRef.current;
        if (sample && previous && frameDifferenceRatio(previous, sample) < 0.01) {
          frozenFrameCountRef.current += 1;
        } else {
          frozenFrameCountRef.current = 0;
        }
        lastFrameSampleRef.current = sample;
      }

      const machine = machineRef.current;
      if (!machine || !monitoringRef.current) return signals;

      machine.updateFace(signals.faceDetected);
      machine.updateFaceCount(signals.faceCount);
      machine.updateGaze(signals.gazeDeviation);
      machine.updatePartialFace(signals.partialOutOfFrame);

      if (
        video.videoWidth > 0 &&
        !frozenEmittedRef.current &&
        frozenFrameCountRef.current >= 10
      ) {
        frozenEmittedRef.current = true;
        machine.emitFrozenFrame();
      }

      return signals;
    },
    [],
  );

  const stopCamera = useCallback(() => {
    stopLoopRef.current?.();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setMediaStream(null);
    monitoringRef.current = false;
  }, []);

  const stopLoopRef = useRef<(() => void) | null>(null);

  const startDetectionLoop = useCallback(
    (landmarker: FaceLandmarker, video: HTMLVideoElement) => {
      let rVfcId: number | null = null;
      let stopped = false;

      const tick = (timestampMs: number) => {
        if (stopped || !monitoringRef.current) return;

        if (timestampMs - lastInferenceRef.current >= inferenceIntervalMs) {
          lastInferenceRef.current = timestampMs;
          try {
            processDetection(landmarker, video, performance.now());
          } catch {
            // Skip bad frames
          }
        }

        if (typeof video.requestVideoFrameCallback === 'function') {
          rVfcId = video.requestVideoFrameCallback(tick);
        } else {
          loopHandleRef.current = requestAnimationFrame(() => tick(performance.now()));
        }
      };

      if (typeof video.requestVideoFrameCallback === 'function') {
        rVfcId = video.requestVideoFrameCallback(tick);
      } else {
        loopHandleRef.current = requestAnimationFrame(() => tick(performance.now()));
      }

      return () => {
        stopped = true;
        if (rVfcId !== null && typeof video.cancelVideoFrameCallback === 'function') {
          video.cancelVideoFrameCallback(rVfcId);
        }
        if (loopHandleRef.current !== null) {
          cancelAnimationFrame(loopHandleRef.current);
          loopHandleRef.current = null;
        }
      };
    },
    [inferenceIntervalMs, processDetection],
  );

  const startCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video) throw new Error('Video element not ready');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: { echoCancellation: true, noiseSuppression: true },
    });

    streamRef.current = stream;
    setMediaStream(stream);
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();

    stream.getVideoTracks()[0]?.addEventListener('ended', () => {
      machineRef.current?.onCameraPermissionLost('track_ended');
      setStatus('permission_denied');
    });
  }, [videoRef]);

  const calibrate = useCallback(async (): Promise<CalibrationBaseline> => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker) {
      throw new Error('Camera or model not ready for calibration');
    }

    setIsCalibrating(true);
    setStatus('calibrating');
    monitoringRef.current = false;

    const samples: ReturnType<typeof matrixToHeadPose>[] = [];
    const startedAt = Date.now();

    await new Promise<void>((resolve) => {
      const sample = () => {
        if (Date.now() - startedAt >= CALIBRATION_DURATION_MS) {
          resolve();
          return;
        }

        try {
          const result = landmarker.detectForVideo(video, performance.now());
          if (result.facialTransformationMatrixes?.length) {
            samples.push(matrixToHeadPose(result.facialTransformationMatrixes[0].data));
          }
        } catch {
          // keep sampling
        }

        window.setTimeout(sample, CALIBRATION_SAMPLE_INTERVAL_MS);
      };
      sample();
    });

    const quality = calibrationQuality(samples);
    if (!quality.acceptable) {
      setIsCalibrating(false);
      setStatus('calibrating');
      throw new Error(
        quality.sampleCount < 8
          ? 'Keep your face visible throughout calibration and try again.'
          : 'Hold your head steady during calibration and try again.',
      );
    }
    const baseline = quality.baseline;
    baselineRef.current = baseline;
    setCalibrationBaseline(baseline);
    setIsCalibrating(false);
    monitoringRef.current = true;
    setStatus('monitoring');
    return baseline;
  }, [videoRef]);

  // Load model + camera
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let cancelled = false;

    const init = async () => {
      setStatus('loading');
      setError(null);

      try {
        const landmarker = await loadFaceLandmarker();
        if (cancelled) return;
        landmarkerRef.current = landmarker;

        await startCamera();
        if (cancelled) {
          stopCamera();
          return;
        }

        const video = videoRef.current;
        if (!video) return;

        if (baselineRef.current) {
          monitoringRef.current = true;
          setStatus('monitoring');
        } else {
          setStatus('calibrating');
        }

        stopLoopRef.current = startDetectionLoop(landmarker, video);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Camera permission denied'
            : 'Proctoring unavailable — could not load monitoring';
        setError(message);
        setStatus(err instanceof DOMException ? 'permission_denied' : 'unavailable');
        emit({
          type: err instanceof DOMException ? 'camera_permission_lost' : 'proctoring_unavailable',
          timestamp: new Date().toISOString(),
          metadata: { message },
        });
      }
    };

    void init();

    return () => {
      cancelled = true;
      stopLoopRef.current?.();
      void Promise.resolve(beforeStopTracksRef.current?.()).finally(() => {
        stopCamera();
        closeFaceLandmarker();
        landmarkerRef.current = null;
      });
    };
  }, [enabled, emit, startCamera, startDetectionLoop, stopCamera, videoRef]);

  // Non-webcam signals
  useEffect(() => {
    if (!enabled) return undefined;

    const onVisibility = () => {
      if (document.hidden) {
        machineRef.current?.onTabBlur(lastFaceDetectedRef.current);
      } else {
        machineRef.current?.onTabFocus();
      }
    };

    const onBlur = () => machineRef.current?.onTabBlur(lastFaceDetectedRef.current);
    const onFocus = () => machineRef.current?.onTabFocus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (isDevtoolsShortcut(e)) {
        e.preventDefault();
        machineRef.current?.onDevtoolsShortcut();
      }
    };

    const onCopy = (e: ClipboardEvent) => {
      if (blockClipboard) e.preventDefault();
      machineRef.current?.onClipboard('copy');
    };
    const onPaste = (e: ClipboardEvent) => {
      if (blockClipboard) e.preventDefault();
      machineRef.current?.onClipboard('paste');
    };
    const onCut = (e: ClipboardEvent) => {
      if (blockClipboard) e.preventDefault();
      machineRef.current?.onClipboard('cut');
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    window.addEventListener('keydown', onKeyDown, true);

    const container = examContainerRef?.current ?? document.body;
    container.addEventListener('copy', onCopy, true);
    container.addEventListener('paste', onPaste, true);
    container.addEventListener('cut', onCut, true);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('keydown', onKeyDown, true);
      container.removeEventListener('copy', onCopy, true);
      container.removeEventListener('paste', onPaste, true);
      container.removeEventListener('cut', onCut, true);
    };
  }, [blockClipboard, enabled, examContainerRef]);

  return {
    status,
    isCalibrating,
    calibrationBaseline,
    calibrate,
    error,
    mediaStream,
  };
}
