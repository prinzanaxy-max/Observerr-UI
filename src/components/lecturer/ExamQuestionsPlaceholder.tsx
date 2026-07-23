import { memo } from 'react';
import Icon from '../student/Icon';

type ExamQuestionsPlaceholderProps = {
  onAddQuestions?: () => void;
};

const ExamQuestionsPlaceholder = memo(({ onAddQuestions }: ExamQuestionsPlaceholderProps) => (
  <section className="bg-student-surface rounded-2xl p-6 lecturer-card-elevation border-2 border-dashed border-student-surface-container/50 flex flex-col items-center justify-center min-h-[200px] text-center">
    <div className="w-16 h-16 rounded-full bg-student-primary-container/30 flex items-center justify-center mb-4 text-student-primary">
      <Icon name="post_add" className="text-3xl" />
    </div>
    <h3 className="text-student-headline-sm font-student font-semibold mb-2 text-student-on-surface">
      No Questions Added Yet
    </h3>
    <p className="text-student-on-surface-variant font-student text-student-body-md mb-6 max-w-md">
      Import from question bank or create new questions to build your exam.
    </p>
    <button
      type="button"
      onClick={onAddQuestions}
      className="px-6 py-2.5 bg-student-surface-container-high hover:bg-student-surface-variant text-student-on-surface rounded-full font-student text-student-body-md font-medium transition-colors border border-student-outline-variant/30 flex items-center gap-2"
    >
      <Icon name="add" className="text-[20px]" />
      Add Questions
    </button>
  </section>
));

ExamQuestionsPlaceholder.displayName = 'ExamQuestionsPlaceholder';

export default ExamQuestionsPlaceholder;
