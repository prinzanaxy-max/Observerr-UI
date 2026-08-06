import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { ExamAvailability } from '../../../data/studentExamSessionData';

type ExamPreActionBarProps = {
  examId: number;
  availability: ExamAvailability;
  availableAtLabel?: string;
  beginLabel?: string;
};

const ExamPreActionBar = memo(({
  examId,
  availability,
  availableAtLabel = 'Not available yet',
  beginLabel = 'Begin Exam',
}: ExamPreActionBarProps) => {
  const isReady = availability === 'ready';
  const isCompleted = availability === 'completed';

  return (
    <div className="fixed bottom-0 left-0 w-full bg-student-surface-container-lowest/90 backdrop-blur-md border-t border-student-surface-container-highest p-6 z-50">
      <div className="max-w-[600px] mx-auto">
        {isReady ? (
          <Link
            to={`/student/exams/${examId}/take`}
            className="w-full h-14 rounded-full text-student-headline-sm font-student font-bold flex items-center justify-center transition-all duration-300 student-exam-btn-primary text-student-on-primary hover:opacity-90"
          >
            {beginLabel}
          </Link>
        ) : isCompleted ? (
          <div className="space-y-3">
            {availableAtLabel && (
              <p className="text-center text-student-body-md font-student text-student-on-surface-variant">
                {availableAtLabel}
              </p>
            )}
            <Link
              to="/student/results"
              className="w-full h-14 rounded-full text-student-headline-sm font-student font-bold flex items-center justify-center border-2 border-student-primary text-student-primary hover:bg-student-primary/5 transition-colors"
            >
              {beginLabel === 'Back to exams' ? 'Go to Results' : beginLabel}
            </Link>
          </div>
        ) : (
          <button
            type="button"
            disabled
            className="w-full h-14 rounded-full text-student-headline-sm font-student font-bold flex items-center justify-center bg-student-surface-variant text-student-on-surface-variant/50 cursor-not-allowed"
          >
            {availableAtLabel}
          </button>
        )}
      </div>
    </div>
  );
});

ExamPreActionBar.displayName = 'ExamPreActionBar';

export default ExamPreActionBar;
