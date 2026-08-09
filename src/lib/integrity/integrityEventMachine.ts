import type { IntegrityEvent, IntegrityEventType } from '../../types/integrityMonitoring';

export type EmitFn = (event: IntegrityEvent) => void;

type Episode = {
  startedAt: number;
};

/**
 * Debounced state machine — emits one event per transition, not per frame.
 */
export class IntegrityEventMachine {
  private facePresent = false;
  private faceLostEpisode: Episode | null = null;

  private gazingAway = false;
  private gazeEpisode: Episode | null = null;
  private gazeAwayFrames = 0;
  private gazeReturnFrames = 0;

  private multipleFaces = false;
  private multiFaceEpisode: Episode | null = null;

  private tabHidden = false;
  private tabBlurEpisode: Episode | null = null;

  private partialFaceActive = false;
  private partialFaceEpisode: Episode | null = null;

  private tabBlurCount = 0;
  private focusLost = false;
  private emitFn: EmitFn;

  constructor(emit: EmitFn) {
    this.emitFn = emit;
  }

  getTabBlurCount() {
    return this.tabBlurCount;
  }

  private emitEvent(type: IntegrityEventType, extra?: Partial<IntegrityEvent>) {
    this.emitFn({
      type,
      timestamp: new Date().toISOString(),
      ...extra,
    });
  }

  updateFace(faceDetected: boolean) {
    if (faceDetected && !this.facePresent) {
      if (this.faceLostEpisode) {
        const durationMs = Date.now() - this.faceLostEpisode.startedAt;
        this.emitEvent('face_restored', { durationMs });
        this.faceLostEpisode = null;
      }
      this.facePresent = true;
      return;
    }

    if (!faceDetected && this.facePresent) {
      this.facePresent = false;
      this.faceLostEpisode = { startedAt: Date.now() };
      this.emitEvent('face_lost');
    }
  }

  updateGaze(gazeDeviation: boolean) {
    if (gazeDeviation) {
      this.gazeAwayFrames += 1;
      this.gazeReturnFrames = 0;
    } else {
      this.gazeReturnFrames += 1;
      this.gazeAwayFrames = 0;
    }

    if (this.gazeAwayFrames >= 2 && !this.gazingAway) {
      this.gazingAway = true;
      this.gazeEpisode = { startedAt: Date.now() };
      this.emitEvent('gaze_deviation_start');
      return;
    }

    if (this.gazeReturnFrames >= 2 && this.gazingAway) {
      this.gazingAway = false;
      const durationMs = this.gazeEpisode
        ? Date.now() - this.gazeEpisode.startedAt
        : undefined;
      this.gazeEpisode = null;
      this.emitEvent('gaze_deviation_end', { durationMs });
    }
  }

  updateFaceCount(faceCount: number) {
    const multi = faceCount > 1;
    if (multi && !this.multipleFaces) {
      this.multipleFaces = true;
      this.multiFaceEpisode = { startedAt: Date.now() };
      this.emitEvent('multi_face_detected', { metadata: { faceCount } });
      return;
    }

    if (!multi && this.multipleFaces) {
      this.multipleFaces = false;
      const durationMs = this.multiFaceEpisode
        ? Date.now() - this.multiFaceEpisode.startedAt
        : undefined;
      this.multiFaceEpisode = null;
      this.emitEvent('multi_face_cleared', { durationMs });
    }
  }

  updatePartialFace(partialOutOfFrame: boolean) {
    if (partialOutOfFrame && !this.partialFaceActive) {
      this.partialFaceActive = true;
      this.partialFaceEpisode = { startedAt: Date.now() };
      this.emitEvent('face_partial_out_of_frame');
      return;
    }

    if (!partialOutOfFrame && this.partialFaceActive) {
      this.partialFaceActive = false;
      const durationMs = this.partialFaceEpisode
        ? Date.now() - this.partialFaceEpisode.startedAt
        : undefined;
      this.partialFaceEpisode = null;
      if (durationMs !== undefined && durationMs >= 500) {
        this.emitEvent('face_partial_out_of_frame', {
          durationMs,
          metadata: { ended: true },
        });
      }
    }
  }

  onTabSwitch(faceDetected = true) {
    if (this.tabHidden) return;
    this.tabHidden = true;
    this.tabBlurCount += 1;
    this.tabBlurEpisode = { startedAt: Date.now() };
    this.emitEvent('tab_switch', {
      metadata: { count: this.tabBlurCount, faceDetected, source: 'visibility' },
    });
    if (!faceDetected) {
      this.emitEvent('tab_blur_no_face', {
        metadata: { count: this.tabBlurCount, faceDetected: false },
      });
    }
  }

  /** @deprecated Prefer onTabSwitch / onFocusLoss */
  onTabBlur(faceDetected = true) {
    this.onTabSwitch(faceDetected);
  }

  onFocusLoss(faceDetected = true) {
    if (this.focusLost || this.tabHidden) return;
    this.focusLost = true;
    this.emitEvent('focus_loss', {
      metadata: { faceDetected, source: 'window' },
    });
  }

  onTabFocus() {
    if (this.tabHidden) {
      this.tabHidden = false;
      const durationMs = this.tabBlurEpisode
        ? Date.now() - this.tabBlurEpisode.startedAt
        : undefined;
      this.tabBlurEpisode = null;
      this.emitEvent('tab_focus', { durationMs, metadata: { count: this.tabBlurCount } });
    }
    this.focusLost = false;
  }

  onDevtoolsShortcut() {
    this.emitEvent('devtools_shortcut_attempt');
  }

  onClipboard(action: 'copy' | 'paste' | 'cut') {
    this.emitEvent('clipboard_event', { metadata: { action } });
  }

  onFullscreenExit() {
    this.emitEvent('fullscreen_exit');
  }

  onPageRefresh() {
    this.emitEvent('page_refresh');
  }

  onIdleTimeout() {
    this.emitEvent('idle_timeout', { metadata: { thresholdMs: 60_000 } });
  }

  onCameraPermissionLost(reason: string) {
    this.emitEvent('camera_permission_lost', { metadata: { reason } });
  }

  emitFrozenFrame() {
    this.emitEvent('camera_feed_frozen', {
      metadata: { reason: 'static_frame_detected' },
    });
  }

  reset() {
    this.facePresent = false;
    this.faceLostEpisode = null;
    this.gazingAway = false;
    this.gazeEpisode = null;
    this.gazeAwayFrames = 0;
    this.gazeReturnFrames = 0;
    this.multipleFaces = false;
    this.multiFaceEpisode = null;
    this.tabHidden = false;
    this.tabBlurEpisode = null;
    this.partialFaceActive = false;
    this.partialFaceEpisode = null;
    this.tabBlurCount = 0;
    this.focusLost = false;
  }
}
