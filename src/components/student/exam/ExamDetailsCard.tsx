import { memo } from 'react';
import Icon from '../Icon';
import type { StudentExamDetail } from '../../../data/studentExamSessionData';

type ExamDetailsCardProps = {
  exam: StudentExamDetail;
};

const ExamDetailsCard = memo(({ exam }: ExamDetailsCardProps) => (
  <div className="student-exam-glass-card rounded-[24px] p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-student-primary-container text-student-on-primary-container flex items-center justify-center shrink-0">
        <Icon name={exam.icon} className="text-[22px]" />
      </div>
      <div className="min-w-0">
        <h2 className="text-student-headline-md font-student text-student-on-surface">{exam.examType}</h2>
        <p className="text-student-body-md font-student text-student-on-surface-variant">{exam.courseCode}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
      <DetailItem icon="calendar_today" label="Date" value={exam.date} />
      <DetailItem icon="schedule" label="Time" value={exam.timeRange} />
      <DetailItem icon="timer" label="Duration" value={`${exam.durationMinutes} Minutes`} />
      <DetailItem icon="person" label="Professor" value={exam.professor} />
    </div>
  </div>
));

const DetailItem = memo(({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <Icon name={icon} className="text-student-outline mt-0.5 text-[20px] shrink-0" />
    <div className="min-w-0">
      <p className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider">{label}</p>
      <p className="text-student-body-lg font-student text-student-on-surface font-medium">{value}</p>
    </div>
  </div>
));

DetailItem.displayName = 'DetailItem';
ExamDetailsCard.displayName = 'ExamDetailsCard';

export default ExamDetailsCard;
