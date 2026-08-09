import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerSessionDetail } from '../hooks/useLecturerSessionDetail';
import { useLecturerGoLive } from '../hooks/useLecturerGoLive';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import StudentTimelineTopBar from '../components/lecturer/StudentTimelineTopBar';
import StudentProfileHeader from '../components/lecturer/StudentProfileHeader';
import SessionEventTimeline from '../components/lecturer/SessionEventTimeline';
import SessionStatisticsPanel from '../components/lecturer/SessionStatisticsPanel';
import Icon from '../components/student/Icon';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const LecturerSessionDetailPage = () => {
  const { sessionId: sessionIdParam } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const { goLive, goingLive } = useLecturerGoLive();

  const sessionId = sessionIdParam?.trim() || null;

  const { session, events, loading, error, forbidden, reload } = useLecturerSessionDetail(sessionId);

  useEffect(() => {
    if (session) {
      document.title = `${session.studentName} — Session | Observerr`;
    }
  }, [session]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  if (!sessionIdParam || !sessionId) {
    return <Navigate to="/lecturer/students" replace />;
  }

  const profileHeader = session
    ? {
        name: session.studentName,
        initials: session.initials,
        examLabel: `${session.assessmentTitle} (${session.courseLabel}) • ${session.sessionDate}`,
        integrityScore: session.integrityScore,
      }
    : null;

  const stats = session
    ? {
        duration: session.duration,
        totalFlags: session.totalFlags,
        deviceFlags: session.deviceFlags,
        absenceFlags: session.absenceFlags,
      }
    : null;

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="bg-gradient-to-b from-student-surface-container to-student-background"
      header={
        <StudentTimelineTopBar
          initials={initials}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onGoLive={() => void goLive()}
          goingLive={goingLive}
        />
      }
    >
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-12">
        <Link
          to="/lecturer/students"
          className="hidden lg:inline-flex items-center gap-2 text-student-on-surface-variant hover:text-student-primary font-student text-student-body-md mb-4 transition-colors"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Back to Students
        </Link>

        {error && !loading ? (
          <div className="text-center py-16 px-6 rounded-[24px] student-glass-card">
            <Icon name={forbidden ? 'block' : 'error'} className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              {forbidden ? 'Access denied' : 'Could not load session'}
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
        ) : (
          <>
            {profileHeader && (
              <>
                <StudentProfileHeader profile={profileHeader} backTo="/lecturer/students" />
                {session?.requiresReview && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-student text-student-body-md flex items-center gap-2">
                    <Icon name="flag" className="shrink-0" />
                    This session requires human review — critical integrity events were detected.
                  </div>
                )}
              </>
            )}

            {loading && !profileHeader && (
              <div className="h-28 rounded-[24px] bg-student-surface-container-high animate-pulse mb-5" />
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <SessionEventTimeline events={events} searchQuery={searchQuery} loading={loading} />

              <div className="space-y-5">
                {stats ? (
                  <SessionStatisticsPanel stats={stats} />
                ) : loading ? (
                  <div className="h-48 rounded-[24px] bg-student-surface-container-high animate-pulse" />
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerSessionDetailPage;
