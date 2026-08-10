import { memo, useEffect, useMemo, useState } from 'react';
import Icon from '../student/Icon';
import CustomSelect from '../shared/CustomSelect';
import type { ProctoringExam } from '../../data/proctoringData';

const formatTimer = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

type ProctoringPageHeaderProps = {
  exams: ProctoringExam[];
  selectedExamId: number;
  initialSeconds: number;
  onExamChange: (examId: number) => void;
  initials: string;
};

const ProctoringPageHeader = memo(({
  exams,
  selectedExamId,
  initialSeconds,
  onExamChange,
  initials,
}: ProctoringPageHeaderProps) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const selectedExam = exams.find((exam) => exam.id === selectedExamId);
  const examOptions = useMemo(
    () => exams.map((exam) => ({ value: String(exam.id), label: `${exam.courseCode} — ${exam.title}` })),
    [exams],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="shrink-0 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 z-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 sm:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 min-w-0">
          <span className="inline-flex items-center gap-2 text-student-error font-student text-student-label-md font-bold uppercase tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-student-error pulse-live" />
            Live Proctoring
          </span>

          {exams.length > 0 && (
            <CustomSelect
              value={String(selectedExamId)}
              onChange={(v) => onExamChange(Number(v))}
              options={examOptions}
              aria-label="Select exam session"
              className="min-w-0 max-w-md"
            />
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0 flex-wrap">
          {selectedExam && (
            <div className="flex items-center gap-2 text-student-body-md font-student text-student-on-surface-variant">
              <Icon name="videocam" className="text-student-primary" />
              <span>
                <strong className="text-student-on-surface">{selectedExam.activeFeeds}</strong>
                {' / '}
                {selectedExam.totalStudents} feeds active
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-student-surface-container-high px-4 py-2 rounded-full">
            <Icon name="schedule" className="text-student-on-surface-variant" />
            <span className="font-mono text-student-headline-sm font-student font-bold text-student-on-surface tabular-nums">
              {formatTimer(secondsLeft)}
            </span>
          </div>

          <div
            className="w-8 h-8 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold border border-student-outline-variant"
            aria-hidden="true"
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
});

ProctoringPageHeader.displayName = 'ProctoringPageHeader';

export default ProctoringPageHeader;
