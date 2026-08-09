import { memo, useState } from 'react';
import Icon from '../Icon';

type IntegrityCalibrationOverlayProps = {
  onComplete: () => void;
  onCalibrate: () => Promise<unknown>;
};

const IntegrityCalibrationOverlay = memo(({ onComplete, onCalibrate }: IntegrityCalibrationOverlayProps) => {
  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro');
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [error, setError] = useState('');

  const startCalibration = async () => {
    setError('');
    setPhase('running');
    setSecondsLeft(3);

    const countdown = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(countdown);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    try {
      await onCalibrate();
      window.clearInterval(countdown);
      setPhase('done');
      window.setTimeout(onComplete, 800);
    } catch {
      window.clearInterval(countdown);
      setError('Could not calibrate — ensure your face is visible and try again.');
      setPhase('intro');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md student-exam-glass-card rounded-[24px] p-8 text-center font-student">
        <div className="w-16 h-16 rounded-full bg-student-primary-container/40 flex items-center justify-center mx-auto mb-4">
          <Icon name="center_focus_strong" className="text-[32px] text-student-primary" />
        </div>

        {phase === 'intro' && (
          <>
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              Calibrate your gaze
            </h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
              Look directly at the center of your screen. We&apos;ll capture a 3-second baseline so
              proctoring adapts to your webcam and monitor setup.
            </p>
            {error && (
              <p className="text-student-error text-student-body-md mb-4">{error}</p>
            )}
            <button
              type="button"
              onClick={() => void startCalibration()}
              className="w-full py-3 rounded-full student-exam-btn-primary text-student-on-primary font-student font-bold"
            >
              Start calibration
            </button>
          </>
        )}

        {phase === 'running' && (
          <>
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              Look at the center of your screen
            </h2>
            <p className="text-student-headline-md font-student text-student-primary font-bold tabular-nums mb-2">
              {secondsLeft > 0 ? secondsLeft : '…'}
            </p>
            <p className="text-student-body-md font-student text-student-on-surface-variant">
              Keep your head still and face the monitor.
            </p>
          </>
        )}

        {phase === 'done' && (
          <>
            <Icon name="check_circle" className="text-[48px] text-student-primary mx-auto mb-3" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface">
              Calibration complete
            </h2>
          </>
        )}
      </div>
    </div>
  );
});

IntegrityCalibrationOverlay.displayName = 'IntegrityCalibrationOverlay';

export default IntegrityCalibrationOverlay;
