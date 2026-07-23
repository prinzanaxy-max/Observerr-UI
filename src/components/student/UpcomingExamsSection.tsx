import { memo } from 'react';
import Icon from './Icon';
import type { UpcomingExam } from '../../data/studentDashboardData';

type UpcomingExamCardProps = {
  exam: UpcomingExam;
  onSelect?: (exam: UpcomingExam) => void;
};

const badgeStyles = {
  urgent: 'bg-student-error/10 text-student-error animate-pulse',
  upcoming: 'bg-student-primary/10 text-student-primary',
};

const UpcomingExamCard = memo(({ exam, onSelect }: UpcomingExamCardProps) => (
  <button
    type="button"
    onClick={() => onSelect?.(exam)}
    className="student-glass-card p-6 flex flex-col text-left hover:shadow-[0_10px_30px_rgba(43,108,0,0.05)] transition-shadow cursor-pointer relative overflow-hidden group w-full"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-student-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />

    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className="w-12 h-12 rounded-xl bg-student-surface-container-high flex items-center justify-center text-student-primary">
        <Icon name={exam.icon} className="text-[24px]" />
      </div>
      <span className={`px-3 py-1 rounded-full text-student-label-md text-[11px] ${badgeStyles[exam.badge.tone]}`}>
        {exam.badge.label}
      </span>
    </div>

    <h4 className="text-student-headline-sm font-student text-student-on-surface mb-1">{exam.title}</h4>
    <p className="text-sm text-student-on-surface-variant mb-4">
      {exam.courseCode} • {exam.professor}
    </p>

    <div className="mt-auto pt-4 border-t border-student-surface-variant/50 flex justify-between items-center text-sm text-student-on-surface-variant">
      <div className="flex items-center">
        <Icon name="calendar_today" className="text-[16px] mr-1" />
        {exam.date}
      </div>
      <div className="flex items-center">
        <Icon name="schedule" className="text-[16px] mr-1" />
        {exam.time}
      </div>
    </div>
  </button>
));

UpcomingExamCard.displayName = 'UpcomingExamCard';

type UpcomingExamsSectionProps = {
  exams: UpcomingExam[];
  onExamSelect?: (exam: UpcomingExam) => void;
};

const UpcomingExamsSection = memo(({ exams, onExamSelect }: UpcomingExamsSectionProps) => (
  <section>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-student-headline-sm font-student text-student-on-background">Upcoming Exams</h3>
      <button type="button" className="text-student-primary hover:text-student-primary-container text-student-label-md font-student transition-colors">
        See all
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {exams.map((exam) => (
        <UpcomingExamCard key={exam.id} exam={exam} onSelect={onExamSelect} />
      ))}
    </div>
  </section>
));

UpcomingExamsSection.displayName = 'UpcomingExamsSection';

export default UpcomingExamsSection;
