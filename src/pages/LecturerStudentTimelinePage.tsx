import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerExam } from '../hooks/useLecturerExam';
import { formatExamTitle } from '../lib/lecturerExamsUtils';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import StudentTimelineTopBar from '../components/lecturer/StudentTimelineTopBar';
import StudentProfileHeader from '../components/lecturer/StudentProfileHeader';
import SessionEventTimeline from '../components/lecturer/SessionEventTimeline';
import SessionStatisticsPanel from '../components/lecturer/SessionStatisticsPanel';
import StudentReportActions from '../components/lecturer/StudentReportActions';
import Icon from '../components/student/Icon';
import { getStudentTimeline } from '../data/studentTimelineData';
import { mapLegacyTimelineEventToView } from '../lib/lecturerStudentsUtils';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const LecturerStudentTimelinePage = () => {
  const { examId, studentId } = useParams<{ examId?: string; studentId: string }>();
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();

  const [searchQuery, setSearchQuery] = useState('');

  const profile = useMemo(
    () => (studentId ? getStudentTimeline(studentId) : undefined),
    [studentId],
  );

  const parsedExamId = useMemo(() => {
    if (!examId) return null;
    const id = Number(examId);
    return Number.isNaN(id) ? null : id;
  }, [examId]);

  const { exam } = useLecturerExam(parsedExamId);

  const fromLiveMonitoring = Boolean(examId && !Number.isNaN(Number(examId)));
  const backTo = fromLiveMonitoring ? `/lecturer/exams/${examId}/live` : '/lecturer/students';
  const backLabel = fromLiveMonitoring ? 'Back to Live Monitoring' : 'Back to Students';
  const examLabel = exam ? formatExamTitle(exam) : profile?.examLabel;

  useEffect(() => {
    if (profile) {
      document.title = `${profile.name} — Timeline | Observerr`;
    }
  }, [profile]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  const displayProfile = useMemo(() => {
    if (!profile) return null;
    return examLabel ? { ...profile, examLabel } : profile;
  }, [examLabel, profile]);

  const timelineEvents = useMemo(
    () => profile?.events.map(mapLegacyTimelineEventToView) ?? [],
    [profile?.events],
  );

  if (!studentId || !profile || !displayProfile) {
    return <Navigate to="/lecturer/students" replace />;
  }

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
        />
      }
    >
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-12">
        <Link
          to={backTo}
          className="hidden lg:inline-flex items-center gap-2 text-student-on-surface-variant hover:text-student-primary font-student text-student-body-md mb-4 transition-colors"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          {backLabel}
        </Link>

        <StudentProfileHeader profile={displayProfile} backTo={backTo} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <SessionEventTimeline events={timelineEvents} searchQuery={searchQuery} />

          <div className="space-y-5">
            <SessionStatisticsPanel stats={profile.stats} />
            <StudentReportActions studentName={profile.name} />
          </div>
        </div>
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerStudentTimelinePage;
