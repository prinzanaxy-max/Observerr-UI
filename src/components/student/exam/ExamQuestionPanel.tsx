import { memo } from 'react';
import type { ExamQuestion } from '../../../data/studentExamSessionData';

type ExamQuestionPanelProps = {
  question: ExamQuestion;
  answer: string;
  onAnswerChange: (value: string) => void;
};

const ExamQuestionPanel = memo(({ question, answer, onAnswerChange }: ExamQuestionPanelProps) => (
  <div className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
    <div className="flex items-center justify-between gap-4 mb-6">
      <span className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider">
        Question {question.number}
      </span>
      <span className="text-student-label-md font-student text-student-primary font-semibold">
        {question.points} pts
      </span>
    </div>

    <h2 className="text-student-headline-sm font-student text-student-on-surface mb-8 leading-relaxed">
      {question.text}
    </h2>

    {question.type === 'multiple-choice' && question.options ? (
      <div className="space-y-3" role="radiogroup" aria-label={`Question ${question.number}`}>
        {question.options.map((option, index) => {
          const answerKey = question.optionKeys?.[index] ?? option;
          const selected = answer === answerKey;
          return (
            <label
              key={option}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                selected
                  ? 'border-student-primary bg-student-primary/5'
                  : 'border-student-outline-variant hover:border-student-primary/40 hover:bg-student-surface-container-low'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={answerKey}
                checked={selected}
                onChange={() => onAnswerChange(answerKey)}
                className="w-4 h-4 text-student-primary focus:ring-student-primary"
              />
              <span className="text-student-body-lg font-student text-student-on-surface">{option}</span>
            </label>
          );
        })}
      </div>
    ) : (
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        rows={5}
        placeholder="Type your answer here..."
        className="w-full rounded-xl border border-student-outline-variant bg-student-surface-container-lowest px-4 py-3 text-student-body-lg font-student text-student-on-surface placeholder:text-student-outline focus:outline-none focus:border-student-primary focus:ring-1 focus:ring-student-primary resize-y min-h-[120px]"
      />
    )}
  </div>
));

ExamQuestionPanel.displayName = 'ExamQuestionPanel';

export default ExamQuestionPanel;
