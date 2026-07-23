import { memo } from 'react';
import Icon from '../student/Icon';
import type { ExamOverview } from '../../data/lecturerExamsData';

const detailTone = {
  error: 'text-student-error',
  muted: 'text-student-on-surface-variant opacity-50',
  secondary: 'text-student-secondary',
};

type ExamOverviewCardProps = {
  exam: ExamOverview;
  onPrimaryAction: (exam: ExamOverview) => void;
  onSelect?: (exam: ExamOverview) => void;
};

const ExamOverviewCard = memo(({ exam, onPrimaryAction, onSelect }: ExamOverviewCardProps) => {
  const isLive = exam.status === 'live';

  return (
    <article
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? () => onSelect(exam) : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(exam);
              }
            }
          : undefined
      }
      className={`bg-student-surface rounded-[24px] p-6 lecturer-card-elevation border border-transparent hover:border-student-primary-container transition-colors group relative overflow-hidden flex flex-col h-full ${
        onSelect ? 'cursor-pointer' : ''
      }`}
    >
      {isLive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-student-primary-fixed to-student-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-4">
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-student-primary text-student-on-primary text-student-label-md font-student">
            <span className="w-2 h-2 rounded-full bg-student-on-primary animate-pulse" />
            Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-student-surface-container-high text-student-on-surface text-student-label-md font-student capitalize">
            {exam.status}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-student-on-surface-variant hover:text-student-primary transition-colors"
          aria-label={`More options for ${exam.title}`}
        >
          <Icon name="more_vert" />
        </button>
      </div>

      <h3 className="text-student-headline-sm font-student text-student-on-surface mb-1">{exam.title}</h3>
      <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
        {exam.courseCode} • {exam.term}
      </p>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-3 text-student-on-surface-variant">
          <Icon name="calendar_today" className="text-student-outline" />
          <span className="text-student-body-md font-student">{exam.schedule}</span>
        </div>
        <div className="flex items-center gap-3 text-student-on-surface-variant">
          <Icon name="group" className="text-student-outline" />
          <span className="text-student-body-md font-student">{exam.enrollment}</span>
        </div>
        {exam.detail && (
          <div className={`flex items-center gap-3 ${detailTone[exam.detail.tone]}`}>
            <Icon name={exam.detail.icon} />
            <span className={`text-student-body-md font-student ${exam.detail.tone === 'error' ? 'font-semibold' : ''}`}>
              {exam.detail.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-auto">
        {isLive ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrimaryAction(exam);
            }}
            className="flex-1 bg-student-primary text-student-on-primary py-2.5 rounded-full text-student-body-md font-student font-semibold hover:bg-student-primary/90 transition-colors"
          >
            Proctor Now
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrimaryAction(exam);
            }}
            className="flex-1 bg-student-surface-container-high text-student-on-surface py-2.5 rounded-full text-student-body-md font-student font-semibold hover:bg-student-surface-variant transition-colors"
          >
            {exam.status === 'completed' ? 'View Results' : 'Manage'}
          </button>
        )}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={`flex-none px-4 py-2.5 rounded-full border-[1.5px] transition-colors ${
            isLive
              ? 'border-student-primary text-student-primary hover:bg-student-primary/5'
              : 'border-student-outline text-student-on-surface-variant hover:border-student-primary hover:text-student-primary'
          }`}
          aria-label={`Edit ${exam.title}`}
        >
          <Icon name="edit" />
        </button>
      </div>
    </article>
  );
});

ExamOverviewCard.displayName = 'ExamOverviewCard';

export default ExamOverviewCard;
