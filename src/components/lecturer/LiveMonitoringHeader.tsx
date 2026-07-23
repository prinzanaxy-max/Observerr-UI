import { memo, useEffect, useState } from 'react';
import Icon from '../student/Icon';

const formatTimer = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

type LiveMonitoringHeaderProps = {
  examTitle: string;
  initialSeconds: number;
  onEndExam: () => void;
};

const LiveMonitoringHeader = memo(({ examTitle, initialSeconds, onEndExam }: LiveMonitoringHeaderProps) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="shrink-0 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 z-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 sm:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
          <span className="inline-flex items-center gap-2 text-student-error font-student text-student-label-md font-bold uppercase tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-student-error animate-pulse" />
            Live Monitoring
          </span>
          <h1 className="text-student-headline-md font-student font-bold text-student-on-surface truncate">{examTitle}</h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-student-surface-container-high px-4 py-2 rounded-full">
            <Icon name="schedule" className="text-student-on-surface-variant" />
            <span className="font-mono text-student-headline-sm font-student font-bold text-student-on-surface tabular-nums">
              {formatTimer(secondsLeft)}
            </span>
          </div>
          <button
            type="button"
            onClick={onEndExam}
            className="px-5 py-2 rounded-full border-2 border-student-error text-student-error font-student font-bold hover:bg-student-error/5 transition-colors"
          >
            End Exam
          </button>
        </div>
      </div>
    </header>
  );
});

LiveMonitoringHeader.displayName = 'LiveMonitoringHeader';

export default LiveMonitoringHeader;
