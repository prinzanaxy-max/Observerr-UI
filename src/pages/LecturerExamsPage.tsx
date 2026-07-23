import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import ExamsPageHeader from '../components/lecturer/ExamsPageHeader';
import ExamsFilterBar from '../components/lecturer/ExamsFilterBar';
import ExamOverviewCard from '../components/lecturer/ExamOverviewCard';
import {
  EXAM_OVERVIEWS,
  type ExamFilterTab,
  type ExamOverview,
} from '../data/lecturerExamsData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LecturerExamsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<ExamFilterTab>('live');
  const [searchQuery, setSearchQuery] = useState('');

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  useEffect(() => {
    document.title = 'Exams — Observerr Lecturer';
  }, []);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EXAM_OVERVIEWS.filter((exam) => {
      const matchesTab =
        activeTab === 'live'
          ? exam.status === 'live' || exam.status === 'upcoming'
          : exam.status === activeTab;
      if (!matchesTab) return false;
      if (!q) return true;
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.courseCode.toLowerCase().includes(q) ||
        exam.term.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      if (a.status === b.status) return a.id - b.id;
      if (a.status === 'live') return -1;
      if (b.status === 'live') return 1;
      return 0;
    });
  }, [activeTab, searchQuery]);

  const handleTabChange = useCallback((tab: ExamFilterTab) => setActiveTab(tab), []);
  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleNewExam = useCallback(() => navigate(CREATE_EXAM_PATH), [navigate]);
  const handleGoLive = useCallback(() => setActiveTab('live'), []);
  const openExam = useCallback(
    (exam: ExamOverview) => {
      if (exam.status === 'live') {
        navigate(`/lecturer/exams/${exam.id}/live`);
      }
    },
    [navigate],
  );

  const handlePrimaryAction = useCallback(
    (exam: ExamOverview) => openExam(exam),
    [openExam],
  );

  return (
    <LecturerPortalLayout
      fullName={fullName}
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

        {filteredExams.length === 0 ? (
          <div className="bg-student-surface rounded-[24px] p-12 text-center lecturer-card-elevation">
            <p className="text-student-on-surface-variant font-student text-student-body-lg">
              No {activeTab} exams found{searchQuery ? ` matching "${searchQuery}"` : ''}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <ExamOverviewCard
                key={exam.id}
                exam={exam}
                onPrimaryAction={handlePrimaryAction}
                onSelect={exam.status === 'live' ? openExam : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerExamsPage;
