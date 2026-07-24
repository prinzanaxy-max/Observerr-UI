import { memo } from 'react';
import Icon from '../Icon';

type ExamSessionNavProps = {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
};

const ExamSessionNav = memo(({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  canSubmit,
}: ExamSessionNavProps) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-student-surface-container-lowest/90 backdrop-blur-md border-t border-student-surface-container-highest p-4 sm:p-6 z-50">
      <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="px-5 py-3 rounded-full border border-student-outline-variant text-student-on-surface font-student text-student-body-md font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-student-surface-container-high transition-colors flex items-center gap-2"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="px-8 py-3 rounded-full student-exam-btn-primary text-student-on-primary font-student text-student-body-md font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Submit Exam
            <Icon name="check_circle" className="text-[18px]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 rounded-full student-exam-btn-primary text-student-on-primary font-student text-student-body-md font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Next
            <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
});

ExamSessionNav.displayName = 'ExamSessionNav';

export default ExamSessionNav;
