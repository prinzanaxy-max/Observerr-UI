import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerExam } from '../hooks/useLecturerExam';
import { computeRemainingSeconds, formatExamTitle } from '../lib/lecturerExamsUtils';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import LiveMonitoringHeader from '../components/lecturer/LiveMonitoringHeader';
import MonitoringStatsCards from '../components/lecturer/MonitoringStatsCards';
import MonitoringFilterBar from '../components/lecturer/MonitoringFilterBar';
import MonitoringStudentTable from '../components/lecturer/MonitoringStudentTable';
import Icon from '../components/student/Icon';
import {
  LIVE_SESSION_STATS,
  MONITORED_STUDENTS,
  type MonitoredStudent,
  type RiskFilter,
} from '../data/liveMonitoringData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const LecturerLiveMonitoringPage = () => {
  const { examId: examIdParam } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();

  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [endConfirm, setEndConfirm] = useState(false);

  const examId = useMemo(() => {
    const parsed = Number(examIdParam);
    return Number.isNaN(parsed) ? null : parsed;
  }, [examIdParam]);

  const { exam, loading, error, forbidden, notFound, reload } = useLecturerExam(examId);

  const examTitle = exam ? formatExamTitle(exam) : loading ? 'Loading exam…' : 'Live Exam';
  const initialSeconds = exam
    ? computeRemainingSeconds(exam.startAt, exam.durationMinutes)
    : 0;

  useEffect(() => {
    document.title = `Live — ${examTitle} | Observerr`;
  }, [examTitle]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MONITORED_STUDENTS.filter((student) => {
      if (riskFilter !== 'all' && student.risk !== riskFilter) return false;
      if (!q) return true;
      return (
        student.name.toLowerCase().includes(q) ||
        student.id.includes(q) ||
        (student.lastEvent?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [riskFilter, searchQuery]);

  const handleEndExam = useCallback(() => setEndConfirm(true), []);
  const confirmEndExam = useCallback(() => navigate('/lecturer/exams'), [navigate]);
  const handleViewTimeline = useCallback(
    (student: MonitoredStudent) => {
      navigate(`/lecturer/exams/${examId}/students/${student.id}/timeline`);
    },
    [navigate, examId],
  );
  const handleWatchFeed = useCallback(
    (student: MonitoredStudent) => {
      navigate(`/lecturer/proctoring?student=${student.id}`);
    },
    [navigate],
  );
  const handleFilterChange = useCallback((filter: RiskFilter) => setRiskFilter(filter), []);
  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  if (!examIdParam || examId === null) {
    return <Navigate to="/lecturer/exams" replace />;
  }

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="lecturer-exams-bg"
      header={
        !error && !notFound ? (
          <LiveMonitoringHeader
            examTitle={examTitle}
            initialSeconds={initialSeconds}
            loading={loading}
            onEndExam={handleEndExam}
          />
        ) : undefined
      }
    >
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-12 space-y-6">
        {error ? (
          <div className="bg-student-surface rounded-[24px] p-12 text-center lecturer-card-elevation">
            <Icon name={forbidden ? 'block' : 'error'} className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              {forbidden ? 'Access denied' : notFound ? 'Exam not found' : 'Could not load exam'}
            </h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">{error}</p>
            {!forbidden && !notFound && (
              <button
                type="button"
                onClick={() => void reload()}
                className="px-5 py-2 rounded-full border border-student-primary text-student-primary text-student-body-md font-student hover:bg-student-primary/5"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            <MonitoringStatsCards stats={LIVE_SESSION_STATS} />
            <MonitoringFilterBar
              activeFilter={riskFilter}
              searchQuery={searchQuery}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
            />
            <MonitoringStudentTable
              students={filteredStudents}
              onViewTimeline={handleViewTimeline}
              onWatchFeed={handleWatchFeed}
            />
          </>
        )}
      </div>

      {endConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setEndConfirm(false)}
          role="presentation"
        >
          <div
            className="bg-white w-full max-w-sm rounded-brand p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="end-exam-title"
          >
            <h3 id="end-exam-title" className="text-student-headline-sm font-student font-bold text-student-on-surface mb-2">
              End this exam?
            </h3>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
              All students will be submitted automatically. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEndConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-student-outline-variant font-student font-semibold hover:bg-student-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmEndExam}
                className="flex-1 py-2.5 rounded-xl bg-student-error text-white font-student font-bold hover:opacity-90 transition-opacity"
              >
                End Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </LecturerPortalLayout>
  );
};

export default LecturerLiveMonitoringPage;
