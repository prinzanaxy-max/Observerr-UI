import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';

type ExamPreHeaderProps = {
  title: string;
  backTo?: string;
};

const ExamPreHeader = memo(({ title, backTo = '/student/exams' }: ExamPreHeaderProps) => (
  <header className="shrink-0 bg-student-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-50 border-b border-student-surface-container-highest">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
      <Link
        to={backTo}
        className="p-2 -ml-2 rounded-full hover:bg-student-surface-container-high transition-colors text-student-on-surface flex items-center justify-center"
        aria-label="Back to exams"
      >
        <Icon name="arrow_back" />
      </Link>
      <h1 className="text-student-headline-sm font-student text-student-on-surface font-semibold flex-1 truncate">
        {title}
      </h1>
    </div>
  </header>
));

ExamPreHeader.displayName = 'ExamPreHeader';

export default ExamPreHeader;
