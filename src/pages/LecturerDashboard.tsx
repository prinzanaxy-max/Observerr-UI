import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerDashboard } from '../hooks/useLecturerDashboard';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import Icon from '../components/student/Icon';
import LiveExamCard from '../components/lecturer/LiveExamCard';
import NeedsReviewTable from '../components/lecturer/NeedsReviewTable';
import YourExamsSection from '../components/lecturer/YourExamsSection';
import QuickActionsPanel from '../components/lecturer/QuickActionsPanel';
import IntegrityTrendPanel from '../components/lecturer/IntegrityTrendPanel';
import FlaggedBehaviorsPanel from '../components/lecturer/FlaggedBehaviorsPanel';
import type { ExamTab, ReviewStudent } from '../data/lecturerDashboardData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();
  const { dashboard, loading, error, errorHint, forbidden, reload } = useLecturerDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [examTab, setExamTab] = useState<ExamTab>('live');

  useEffect(() => {
    document.title = 'Overview — Observerr Lecturer';
  }, []);

  const filteredReview = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return dashboard.needsReview;
    return dashboard.needsReview.filter(
      (student) =>
        student.name.toLowerCase().includes(q) ||
        student.exam.toLowerCase().includes(q) ||
        student.risk.toLowerCase().includes(q),
    );
  }, [dashboard.needsReview, searchQuery]);

  const tabExams = useMemo(() => {
    const byTab = dashboard.examsByTab[examTab] ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter(
      (exam) =>
        exam.title.toLowerCase().includes(q) ||
        exam.date.toLowerCase().includes(q),
    );
  }, [dashboard.examsByTab, examTab, searchQuery]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleExamTabChange = useCallback((tab: ExamTab) => setExamTab(tab), []);
  const handleNewExam = useCallback(() => navigate(CREATE_EXAM_PATH), [navigate]);
  const handleQuickAction = useCallback(
    (id: string) => {
      if (id === 'new-exam') navigate(CREATE_EXAM_PATH);
      if (id === 'analytics') navigate('/lecturer/reports');
      if (id === 'reports') navigate('/lecturer/reports');
    },
    [navigate],
  );

  const handleViewTimeline = useCallback(
    (student: ReviewStudent) => {
      if (student.latestSessionId) {
        navigate(`/lecturer/students/sessions/${student.latestSessionId}`);
      }
    },
    [navigate],
  );

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={handleNewExam}
    >
      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full pb-8">
        <div className="hidden md:block mb-6">
          <h1 className="text-student-headline-md font-student font-semibold text-student-on-surface">Overview</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">Monitor your exams and student activity at a glance.</p>
        </div>
        <div className="mb-4">
          <div className="relative w-full sm:w-72 lg:w-96">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-student-surface-container-low border border-student-outline/20 rounded-full py-2 pl-10 pr-4 text-student-body-md font-student focus:outline-none focus:ring-2 focus:ring-student-primary/30 transition-all"
              placeholder="Search exams, students, or flags..."
              aria-label="Search exams, students, or flags"
            />
          </div>
        </div>
        {(error || forbidden) && !loading && (
          <div className="mb-5 rounded-xl border border-student-error-container bg-student-error-container/30 px-4 py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="font-student text-student-body-md text-student-on-error-container">{error}</p>
              {errorHint && (
                <p className="font-student text-student-label-md text-student-on-error-container/80 mt-1">{errorHint}</p>
              )}
            </div>
            {!forbidden && (
              <button
                type="button"
                onClick={() => void reload()}
                className="shrink-0 px-4 py-2 rounded-full border border-student-error text-student-error font-student text-student-label-md hover:bg-student-error/5 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 space-y-5">
            <LiveExamCard liveExam={dashboard.liveExam} loading={loading} />
            <NeedsReviewTable
              students={filteredReview}
              loading={loading}
              onViewTimeline={handleViewTimeline}
            />
            <YourExamsSection
              exams={tabExams}
              activeTab={examTab}
              loading={loading}
              onTabChange={handleExamTabChange}
            />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <QuickActionsPanel onAction={handleQuickAction} />
            <IntegrityTrendPanel
              changeLabel={dashboard.integrityTrend.changeLabel}
              points={dashboard.integrityTrend.points}
              loading={loading}
            />
            <FlaggedBehaviorsPanel behaviors={dashboard.flaggedBehaviors} loading={loading} />
          </div>
        </div>
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerDashboard;
