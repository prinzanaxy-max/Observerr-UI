import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import LiveMonitoringHeader from '../components/lecturer/LiveMonitoringHeader';
import MonitoringStatsCards from '../components/lecturer/MonitoringStatsCards';
import MonitoringFilterBar from '../components/lecturer/MonitoringFilterBar';
import MonitoringStudentTable from '../components/lecturer/MonitoringStudentTable';
import {
  LIVE_SESSION_INITIAL_SECONDS,
  LIVE_SESSION_STATS,
  MONITORED_STUDENTS,
  type MonitoredStudent,
  type RiskFilter,
} from '../data/liveMonitoringData';
import { getExamById } from '../data/lecturerExamsData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LecturerLiveMonitoringPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [endConfirm, setEndConfirm] = useState(false);

  const exam = useMemo(() => {
    const id = Number(examId);
    if (Number.isNaN(id)) return undefined;
    return getExamById(id);
  }, [examId]);

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const examTitle = exam ? `${exam.courseCode} — ${exam.title}` : 'Live Exam';

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

  if (!examId || Number.isNaN(Number(examId))) {
    return <Navigate to="/lecturer/exams" replace />;
  }

  return (
    <LecturerPortalLayout
      fullName={fullName}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="lecturer-exams-bg"
      header={
        <LiveMonitoringHeader
          examTitle={examTitle}
          initialSeconds={LIVE_SESSION_INITIAL_SECONDS}
          onEndExam={handleEndExam}
        />
      }
    >
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-12 space-y-6">
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
