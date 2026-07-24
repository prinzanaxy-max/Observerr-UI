import { memo } from 'react';
import Icon from './Icon';
import type { StudentExam } from '../../data/studentExamsData';

type StudentExamCardProps = {
  exam: StudentExam;
  onAction?: (exam: StudentExam) => void;
};

const iconToneClasses = {
  secondary: 'bg-student-secondary-container text-student-on-secondary-container',
  tertiary: 'bg-student-tertiary-container text-student-on-tertiary-container',
  error: 'bg-student-error-container/50 text-student-on-error-container',
};

const StudentExamCard = memo(({ exam, onAction }: StudentExamCardProps) => {
  const isDisabled = exam.action.type === 'disabled';
  const isPrimary = exam.action.type === 'waiting-room';
  const isOutline = exam.action.type === 'guidelines';
  const isResults = exam.action.type === 'view-results';

  return (
    <article
      className={`bg-student-surface rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full border ${
        exam.highlight
          ? 'border-transparent hover:border-student-primary-container'
          : 'border-student-surface-variant'
      }`}
    >
      {exam.highlight && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-student-primary-container opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconToneClasses[exam.iconTone]}`}>
          <Icon name={exam.icon} className="text-[28px]" />
        </div>
        <span
          className={`px-3 py-1 rounded-full font-student text-student-label-md font-bold ${
            exam.statusTone === 'urgent'
              ? 'bg-student-error text-student-on-error animate-pulse'
              : 'bg-student-surface-container-high text-student-on-surface'
          }`}
        >
          {exam.statusLabel}
        </span>
      </div>

      <div className="mb-6 flex-grow relative z-10">
        <h3 className="text-student-headline-sm font-student text-student-on-surface mb-1">{exam.title}</h3>
        <p className="text-student-body-md font-student text-student-on-surface-variant flex items-center gap-1">
          <Icon name="school" className="text-[16px]" />
          {exam.professor}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-auto relative z-10">
        <div className="flex items-center gap-2 text-student-on-surface-variant font-student text-student-label-md">
          <Icon name="calendar_today" className="text-[16px]" />
          {exam.date}
        </div>
        <div className="flex items-center gap-2 text-student-on-surface-variant font-student text-student-label-md">
          <Icon name="schedule" className="text-[16px]" />
          {exam.timeRange}
        </div>

        <button
          type="button"
          disabled={isDisabled}
          onClick={() => !isDisabled && onAction?.(exam)}
          className={`mt-4 w-full py-3 rounded-full font-student text-student-label-md font-bold transition-all flex justify-center items-center gap-2 ${
            isDisabled
              ? 'border border-student-outline text-student-on-surface-variant opacity-50 cursor-not-allowed'
              : isPrimary
                ? 'student-exam-btn-primary text-student-on-primary hover:opacity-90'
                : isOutline
                  ? 'border-2 border-student-primary text-student-primary hover:bg-student-primary/5'
                  : isResults
                    ? 'border-2 border-student-primary text-student-primary hover:bg-student-primary/5'
                    : 'border border-student-outline text-student-on-surface-variant'
          }`}
        >
          {exam.action.label}
          {isPrimary && <Icon name="arrow_forward" className="text-sm" />}
        </button>
      </div>
    </article>
  );
});

StudentExamCard.displayName = 'StudentExamCard';

export default StudentExamCard;
