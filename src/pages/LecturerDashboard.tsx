import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import LecturerTopBar from '../components/lecturer/LecturerTopBar';
import LiveExamCard from '../components/lecturer/LiveExamCard';
import NeedsReviewTable from '../components/lecturer/NeedsReviewTable';
import YourExamsSection from '../components/lecturer/YourExamsSection';
import QuickActionsPanel from '../components/lecturer/QuickActionsPanel';
import IntegrityTrendPanel from '../components/lecturer/IntegrityTrendPanel';
import FlaggedBehaviorsPanel from '../components/lecturer/FlaggedBehaviorsPanel';
import {
  FLAGGED_BEHAVIORS,
  LECTURER_EXAMS,
  NEEDS_REVIEW,
  type ExamTab,
  type ReviewStudent,
} from '../data/lecturerDashboardData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [examTab, setExamTab] = useState<ExamTab>('live');
  const [selectedStudent, setSelectedStudent] = useState<ReviewStudent | null>(null);

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  useEffect(() => {
    document.title = 'Dashboard — Observerr Lecturer';
  }, []);

  const filteredReview = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return NEEDS_REVIEW;
    return NEEDS_REVIEW.filter(
      (student) =>
        student.name.toLowerCase().includes(q) ||
        student.exam.toLowerCase().includes(q) ||
        student.risk.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const byTab = LECTURER_EXAMS.filter((exam) => exam.status === examTab);
    if (!q) return byTab;
    return byTab.filter(
      (exam) =>
        exam.title.toLowerCase().includes(q) ||
        exam.date.toLowerCase().includes(q),
    );
  }, [searchQuery, examTab]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleExamTabChange = useCallback((tab: ExamTab) => setExamTab(tab), []);
  const handleNewExam = useCallback(() => navigate(CREATE_EXAM_PATH), [navigate]);
  const handleQuickAction = useCallback((id: string) => {
    if (id === 'new-exam') navigate(CREATE_EXAM_PATH);
    if (id === 'analytics') navigate('/lecturer/reports');
  }, [navigate]);
  const handleViewTimeline = useCallback((student: ReviewStudent) => setSelectedStudent(student), []);

  return (
    <LecturerPortalLayout
      fullName={fullName}
      initials={initials}
      onNewExam={handleNewExam}
      header={
        <LecturerTopBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onNewExam={handleNewExam}
        />
      }
    >
      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto w-full pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 space-y-5">
            <LiveExamCard />
            <NeedsReviewTable students={filteredReview} onViewTimeline={handleViewTimeline} />
            <YourExamsSection exams={filteredExams} activeTab={examTab} onTabChange={handleExamTabChange} />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <QuickActionsPanel onAction={handleQuickAction} />
            <IntegrityTrendPanel />
            <FlaggedBehaviorsPanel behaviors={FLAGGED_BEHAVIORS} />
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedStudent(null)}
          role="presentation"
        >
          <div
            className="bg-white w-full max-w-md rounded-brand p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="timeline-title"
          >
            <h3 id="timeline-title" className="text-student-headline-sm font-student font-bold text-student-on-surface mb-2">
              Timeline — {selectedStudent.name}
            </h3>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">
              {selectedStudent.exam} • {selectedStudent.integrity}% integrity
            </p>
            <p className="text-sm text-student-on-surface-variant mb-6">
              Detailed event timeline will connect to the monitoring API.
            </p>
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-student-primary text-white font-student font-bold hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </LecturerPortalLayout>
  );
};

export default LecturerDashboard;
