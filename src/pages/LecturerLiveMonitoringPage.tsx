import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerExam } from '../hooks/useLecturerExam';
import { useLecturerLiveSessions } from '../hooks/useLecturerLiveSessions';
import { computeRemainingSeconds, formatExamTitle } from '../lib/lecturerExamsUtils';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import LiveMonitoringHeader from '../components/lecturer/LiveMonitoringHeader';
import MonitoringStatsCards from '../components/lecturer/MonitoringStatsCards';
import MonitoringFilterBar from '../components/lecturer/MonitoringFilterBar';
import MonitoringStudentTable from '../components/lecturer/MonitoringStudentTable';
import Icon from '../components/student/Icon';
import type { MonitoredStudent, RiskFilter } from '../data/liveMonitoringData';
import { CREATE_EXAM_PATH } from '../data/createExamData';
import { endLecturerExam } from '../services/lecturerLiveSessionsService';

const LecturerLiveMonitoringPage = () => {
  const { examId: examIdParam } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();

  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [endConfirm, setEndConfirm] = useState(false);
  const [endingExam, setEndingExam] = useState(false);
  const [endError, setEndError] = useState('');
  const [blockTarget, setBlockTarget] = useState<MonitoredStudent | null>(null);
  const [blockReason, setBlockReason] = useState('');

  const examId = useMemo(() => {
    const parsed = Number(examIdParam);
    return Number.isNaN(parsed) ? null : parsed;
  }, [examIdParam]);

  const { exam, loading: examLoading, error: examError, forbidden: examForbidden, notFound: examNotFound, reload: reloadExam } = useLecturerExam(examId);
  const {
    students: monitoredStudents,
    stats: sessionStats,
    loading: sessionsLoading,
    error: sessionsError,
    forbidden: sessionsForbidden,
    notFound: sessionsNotFound,
    reload: reloadSessions,
    actionError,
    pendingStudentId,
    setStudentBlocked,
  } = useLecturerLiveSessions(examId);

  const loading = examLoading || sessionsLoading;
  const error = examError || sessionsError;
  const forbidden = examForbidden || sessionsForbidden;
  const notFound = examNotFound || sessionsNotFound;
  const reload = useCallback(() => {
    void reloadExam();
    void reloadSessions();
  }, [reloadExam, reloadSessions]);

  const examTitle = exam ? formatExamTitle(exam) : loading ? 'Loading exam…' : 'Live Exam';
  const initialSeconds = exam
    ? computeRemainingSeconds(exam.startAt, exam.durationMinutes)
    : 0;

  useEffect(() => {
    document.title = `Live — ${examTitle} | Observerr`;
  }, [examTitle]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return monitoredStudents.filter((student) => {
      if (riskFilter !== 'all' && student.risk !== riskFilter) return false;
      if (!q) return true;
      return (
        student.name.toLowerCase().includes(q) ||
        student.id.includes(q) ||
        (student.lastEvent?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [monitoredStudents, riskFilter, searchQuery]);

  const riskCounts = useMemo(() => ({
    all: monitoredStudents.length,
    high: monitoredStudents.filter((student) => student.risk === 'high').length,
    medium: monitoredStudents.filter((student) => student.risk === 'medium').length,
    low: monitoredStudents.filter((student) => student.risk === 'low').length,
  }), [monitoredStudents]);

  const handleEndExam = useCallback(() => {
    setEndError('');
    setEndConfirm(true);
  }, []);
  const confirmEndExam = useCallback(async () => {
    if (examId === null || endingExam) return;
    setEndingExam(true);
    setEndError('');
    try {
      await endLecturerExam(examId);
      navigate('/lecturer/exams');
    } catch {
      setEndError('Could not end this exam. It may already be ended, or the request failed.');
    } finally {
      setEndingExam(false);
    }
  }, [endingExam, examId, navigate]);
  const handleViewTimeline = useCallback(
    (student: MonitoredStudent) => {
      if (student.latestSessionId) {
        navigate(`/lecturer/students/sessions/${student.latestSessionId}`);
        return;
      }
      navigate('/lecturer/students');
    },
    [navigate],
  );
  const handleWatchFeed = useCallback(
    (student: MonitoredStudent) => {
      navigate(`/lecturer/proctoring?student=${student.id}`);
    },
    [navigate],
  );
  const handleFilterChange = useCallback((filter: RiskFilter) => setRiskFilter(filter), []);
  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleToggleBlock = useCallback((student: MonitoredStudent) => {
    if (student.blocked) {
      void setStudentBlocked(student.id, false);
      return;
    }
    setBlockReason('');
    setBlockTarget(student);
  }, [setStudentBlocked]);
  const confirmBlock = useCallback(async () => {
    if (!blockTarget || !blockReason.trim()) return;
    const updated = await setStudentBlocked(blockTarget.id, true, blockReason.trim());
    if (updated) setBlockTarget(null);
  }, [blockReason, blockTarget, setStudentBlocked]);

  useEffect(() => {
    if (!endConfirm && !blockTarget) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !endingExam && !pendingStudentId) {
        setEndConfirm(false);
        setBlockTarget(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [blockTarget, endConfirm, endingExam, pendingStudentId]);

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
            {sessionStats ? (
              <MonitoringStatsCards stats={sessionStats} />
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 bg-student-surface-container-high rounded-brand" />
                ))}
              </div>
            ) : null}
            <MonitoringFilterBar
              activeFilter={riskFilter}
              searchQuery={searchQuery}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              counts={riskCounts}
            />
            {actionError && <p role="alert" className="text-student-error font-student">{actionError}</p>}
            <MonitoringStudentTable
              students={filteredStudents}
              onViewTimeline={handleViewTimeline}
              onWatchFeed={handleWatchFeed}
              onToggleBlock={handleToggleBlock}
              pendingStudentId={pendingStudentId}
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
            aria-modal="true"
            aria-labelledby="end-exam-title"
          >
            <h3 id="end-exam-title" className="text-student-headline-sm font-student font-bold text-student-on-surface mb-2">
              End this exam?
            </h3>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
              All students will be submitted automatically. This cannot be undone.
            </p>
            {endError && <p role="alert" className="text-student-error text-sm mb-4">{endError}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={endingExam}
                onClick={() => setEndConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-student-outline-variant font-student font-semibold hover:bg-student-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={endingExam}
                onClick={() => void confirmEndExam()}
                className="flex-1 py-2.5 rounded-xl bg-student-error text-white font-student font-bold hover:opacity-90 transition-opacity"
              >
                {endingExam ? 'Ending…' : 'End Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {blockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" role="presentation" onClick={() => setBlockTarget(null)}>
          <div className="bg-white w-full max-w-md rounded-brand p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="block-student-title" onClick={(event) => event.stopPropagation()}>
            <h3 id="block-student-title" className="text-student-headline-sm font-student font-bold mb-2">
              Block {blockTarget.name}?
            </h3>
            <p className="text-student-body-md text-student-on-surface-variant mb-4">
              Their active attempt will end. This block applies only to this exam and can be reversed.
            </p>
            <label className="block font-student text-student-label-md mb-4">
              Reason
              <textarea
                autoFocus
                value={blockReason}
                onChange={(event) => setBlockReason(event.target.value)}
                rows={3}
                maxLength={500}
                className="mt-1 w-full rounded-xl border border-student-outline-variant p-3"
                required
              />
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setBlockTarget(null)} className="flex-1 py-2.5 rounded-xl border border-student-outline-variant">Cancel</button>
              <button type="button" disabled={!blockReason.trim() || pendingStudentId === blockTarget.id} onClick={() => void confirmBlock()} className="flex-1 py-2.5 rounded-xl bg-student-error text-white disabled:opacity-50">
                {pendingStudentId === blockTarget.id ? 'Blocking…' : 'Block student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </LecturerPortalLayout>
  );
};

export default LecturerLiveMonitoringPage;
