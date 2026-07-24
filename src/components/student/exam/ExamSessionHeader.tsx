import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';

type ExamSessionHeaderProps = {
  title: string;
  courseCode: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: string;
  examId: number;
};

const ExamSessionHeader = memo(({
  title,
  courseCode,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  examId,
}: ExamSessionHeaderProps) => (
  <header className="shrink-0 bg-student-surface-container-lowest/90 backdrop-blur-md border-b border-student-surface-container-highest sticky top-0 z-50">
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
      <Link
        to={`/student/exams/${examId}`}
        className="p-2 -ml-2 rounded-full hover:bg-student-surface-container-high transition-colors text-student-on-surface"
        aria-label="Back to exam details"
      >
        <Icon name="arrow_back" />
      </Link>

      <div className="flex-1 min-w-0">
        <h1 className="text-student-headline-sm font-student text-student-on-surface font-semibold truncate">{title}</h1>
        <p className="text-student-label-md font-student text-student-on-surface-variant truncate">{courseCode}</p>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-student-surface-container-high text-student-on-surface-variant text-student-label-md font-student">
        <Icon name="timer" className="text-[18px]" />
        {timeRemaining}
      </div>

      <div className="text-student-label-md font-student text-student-on-surface-variant whitespace-nowrap">
        Q {currentQuestion}/{totalQuestions}
      </div>
    </div>
  </header>
));

ExamSessionHeader.displayName = 'ExamSessionHeader';

export default ExamSessionHeader;
