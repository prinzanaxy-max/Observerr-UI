import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerExams } from '../hooks/useLecturerExams';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import ExamsPageHeader from '../components/lecturer/ExamsPageHeader';
import ExamsFilterBar from '../components/lecturer/ExamsFilterBar';
import ExamOverviewCard from '../components/lecturer/ExamOverviewCard';
import Icon from '../components/student/Icon';
import type { ExamFilterTab, ExamOverview } from '../types/lecturerExams';
import { CREATE_EXAM_PATH } from '../data/createExamData';
import { lecturerExamPath } from '../lib/examResultNavigation';

const ExamCardSkeleton = () => (
  <div className="bg-student-surface rounded-[24px] p-6 lecturer-card-elevation animate-pulse h-[320px]">
    <div className="h-6 w-20 bg-student-surface-container-high rounded-full mb-4" />
    <div className="h-8 w-3/4 bg-student-surface-container-high rounded mb-2" />
    <div className="h-4 w-1/2 bg-student-surface-container-high rounded mb-6" />
    <div className="space-y-3">
      <div className="h-4 w-full bg-student-surface-container-high rounded" />
      <div className="h-4 w-2/3 bg-student-surface-container-high rounded" />
    </div>
  </div>
);

const LecturerExamsPage = () => {
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();

  const [activeTab, setActiveTab] = useState<ExamFilterTab>('live');
  const [searchQuery, setSearchQuery] = useState('');

  const { exams, loading, error, forbidden, reload } = useLecturerExams(searchQuery, activeTab);

  useEffect(() => {
    document.title = 'Exams — Observerr Lecturer';
  }, []);

  const handleTabChange = useCallback((tab: ExamFilterTab) => setActiveTab(tab), []);
  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleNewExam = useCallback(() => navigate(CREATE_EXAM_PATH), [navigate]);
  const handleGoLive = useCallback(() => setActiveTab('live'), []);

  const openExam = useCallback(
    (exam: ExamOverview) => {
      const path = lecturerExamPath(exam.id, exam.status);
      if (path) navigate(path);
    },
    [navigate],
  );

  const handlePrimaryAction = useCallback(
    (exam: ExamOverview) => openExam(exam),
    [openExam],
  );

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={handleNewExam}
      contentClassName="lecturer-exams-bg"
      header={<ExamsPageHeader initials={initials} onGoLive={handleGoLive} />}
    >
      <div className="p-4 md:p-8 max-w-[1440px] mx-auto w-full pb-12">
        <div className="md:hidden mb-6">
          <h1 className="text-student-headline-md font-student font-semibold text-student-on-surface">Exams Overview</h1>
        </div>

        <ExamsFilterBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          onTabChange={handleTabChange}
          onSearchChange={handleSearchChange}
        />

        {error ? (
          <div className="bg-student-surface rounded-[24px] p-12 text-center lecturer-card-elevation">
            <Icon name={forbidden ? 'block' : 'error'} className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              {forbidden ? 'Access denied' : 'Could not load exams'}
            </h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">{error}</p>
            {!forbidden && (
              <button
                type="button"
                onClick={() => void reload()}
                className="px-5 py-2 rounded-full border border-student-primary text-student-primary text-student-body-md font-student hover:bg-student-primary/5"
              >
                Retry
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ExamCardSkeleton key={i} />
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-student-surface rounded-[24px] p-12 text-center lecturer-card-elevation">
            <p className="text-student-on-surface-variant font-student text-student-body-lg">
              No {activeTab} exams found{searchQuery ? ` matching "${searchQuery}"` : ''}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <ExamOverviewCard
                key={exam.id}
                exam={exam}
                onPrimaryAction={handlePrimaryAction}
                onSelect={exam.status !== 'upcoming' ? openExam : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerExamsPage;
