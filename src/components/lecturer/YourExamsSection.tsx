import { memo } from 'react';
import Icon from '../student/Icon';
import type { ExamTab, LecturerExam } from '../../data/lecturerDashboardData';

const EXAM_TABS: { id: ExamTab; label: string }[] = [
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

const statusBadge = {
  live: 'bg-student-primary-container text-student-on-primary-container',
  upcoming: 'bg-student-surface-container-highest text-student-on-surface-variant',
  completed: 'bg-student-tertiary-container text-student-on-tertiary-container',
};

const statusLabel = {
  live: 'LIVE NOW',
  upcoming: 'UPCOMING',
  completed: 'COMPLETED',
};

type YourExamsSectionProps = {
  exams: LecturerExam[];
  activeTab: ExamTab;
  onTabChange: (tab: ExamTab) => void;
};

const YourExamsSection = memo(({ exams, activeTab, onTabChange }: YourExamsSectionProps) => (
  <section>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <h3 className="text-student-headline-sm font-student font-bold text-student-on-surface">Your Exams</h3>
        <div className="bg-student-surface-container flex rounded-full p-1 border border-student-outline-variant/30 w-fit">
          {EXAM_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-1.5 rounded-full text-student-body-md font-student transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm font-bold text-student-primary'
                  : 'font-medium text-student-on-surface-variant hover:bg-student-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <button type="button" className="text-student-primary font-student font-bold text-student-body-md hover:underline text-left">
        See all
      </button>
    </div>

    {exams.length === 0 ? (
      <div className="bg-white p-8 rounded-brand border border-student-outline-variant/20 text-center text-student-on-surface-variant">
        No {activeTab} exams found.
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className={`bg-white p-6 rounded-brand shadow-sm hover:shadow-md transition-shadow border border-student-outline-variant/20 flex flex-col h-full ${
              exam.status !== 'live' ? 'opacity-80' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge[exam.status]}`}>
                {statusLabel[exam.status]}
              </span>
              <button type="button" className="text-student-on-surface-variant hover:text-student-primary transition-colors" aria-label="More options">
                <Icon name="more_vert" />
              </button>
            </div>
            <h4 className="text-student-body-lg font-student font-bold text-student-on-surface mb-2">{exam.title}</h4>
            <p className="text-student-label-md font-student text-student-on-surface-variant mb-auto">{exam.date}</p>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-student-outline-variant/20">
              <span className="flex items-center gap-1 text-student-on-surface-variant font-medium text-student-label-md font-student">
                <Icon name="group" className="text-[18px]" />
                {exam.students} Students
              </span>
              <button type="button" className="text-student-primary font-student font-bold text-student-body-md">
                {exam.status === 'live' ? 'Manage' : exam.status === 'upcoming' ? 'Edit' : 'View'}
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
));

YourExamsSection.displayName = 'YourExamsSection';

export default YourExamsSection;
