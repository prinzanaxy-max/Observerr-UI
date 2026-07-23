import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import StudentTimelineTopBar from '../components/lecturer/StudentTimelineTopBar';
import StudentProfileHeader from '../components/lecturer/StudentProfileHeader';
import SessionEventTimeline from '../components/lecturer/SessionEventTimeline';
import SessionStatisticsPanel from '../components/lecturer/SessionStatisticsPanel';
import StudentReportActions from '../components/lecturer/StudentReportActions';
import Icon from '../components/student/Icon';
import { getExamById } from '../data/lecturerExamsData';
import { getStudentTimeline } from '../data/studentTimelineData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LecturerStudentTimelinePage = () => {
  const { examId, studentId } = useParams<{ examId?: string; studentId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [searchQuery, setSearchQuery] = useState('');

  const profile = useMemo(
    () => (studentId ? getStudentTimeline(studentId) : undefined),
    [studentId],
  );

  const exam = useMemo(() => {
    if (!examId) return undefined;
    const id = Number(examId);
    if (Number.isNaN(id)) return undefined;
    return getExamById(id);
  }, [examId]);

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const lecturerInitials = useMemo(() => getInitials(fullName), [fullName]);

  const fromLiveMonitoring = Boolean(examId && !Number.isNaN(Number(examId)));
  const backTo = fromLiveMonitoring ? `/lecturer/exams/${examId}/live` : '/lecturer/students';
  const backLabel = fromLiveMonitoring ? 'Back to Live Monitoring' : 'Back to Students';
  const examLabel = exam ? `${exam.courseCode} — ${exam.title}` : profile?.examLabel;

  useEffect(() => {
    if (profile) {
      document.title = `${profile.name} — Timeline | Observerr`;
    }
  }, [profile]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);

  if (!studentId || !profile) {
    return <Navigate to="/lecturer/students" replace />;
  }

  const displayProfile = examLabel
    ? { ...profile, examLabel }
    : profile;

  return (
    <LecturerPortalLayout
      fullName={fullName}
      initials={lecturerInitials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="bg-gradient-to-b from-student-surface-container to-student-background"
      header={
        <StudentTimelineTopBar
          initials={lecturerInitials}
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
          <SessionEventTimeline events={profile.events} searchQuery={searchQuery} />

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
