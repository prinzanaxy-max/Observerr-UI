import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ExamsTabControl from '../components/student/ExamsTabControl';
import StudentExamCard from '../components/student/StudentExamCard';
import Icon from '../components/student/Icon';
import { useStudentExams } from '../hooks/useStudentExams';
import type { ExamListTab, StudentExam } from '../data/studentExamsData';
import { studentExamActionPath } from '../lib/examResultNavigation';

const StudentExamsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ExamListTab>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const { upcomingExams, completedExams, loading, error, reload } = useStudentExams();

  useEffect(() => {
    document.title = 'Exams — Observerr';
  }, []);

  const tabExams = activeTab === 'upcoming' ? upcomingExams : completedExams;

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tabExams.filter((exam) => {
      if (!q) return true;
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.professor.toLowerCase().includes(q) ||
        exam.date.toLowerCase().includes(q)
      );
    });
  }, [tabExams, searchQuery]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleTabChange = useCallback((tab: ExamListTab) => setActiveTab(tab), []);
  const handleExamAction = useCallback((exam: StudentExam) => {
    navigate(studentExamActionPath(
      exam.id,
      exam.action.type === 'view-results' ? 'view-results' : 'exam',
      exam.resultId,
    ));
  }, [navigate]);

  return (
    <StudentPortalLayout
      title="Exams"
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search exams..."
      contentClassName="student-exams-bg"
    >
      <div className="px-4 sm:px-6 md:px-8 pb-24 md:pb-8 max-w-[1200px] mx-auto w-full">
        <div className="md:hidden mb-4 pt-2">
          <h1 className="text-student-headline-md font-student text-student-on-surface">Exams</h1>
        </div>

        <ExamsTabControl activeTab={activeTab} onTabChange={handleTabChange} />

        {loading ? (
          <div className="text-center py-16 px-6">
            <p className="text-student-body-md font-student text-student-on-surface-variant">Loading exams…</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-6 rounded-[24px] bg-student-surface border border-student-surface-variant">
            <Icon name="error_outline" className="text-[48px] text-student-error mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">Could not load exams</h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">{error}</p>
            <button
              type="button"
              onClick={() => void reload()}
              className="px-6 py-2 rounded-full bg-student-primary text-student-on-primary font-student font-semibold"
            >
              Try again
            </button>
          </div>
        ) : filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <StudentExamCard key={exam.id} exam={exam} onAction={handleExamAction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-[24px] bg-student-surface border border-student-surface-variant">
            <Icon name="assignment" className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No exams found</h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant">
              {searchQuery.trim()
                ? 'Try a different search term.'
                : activeTab === 'upcoming'
                  ? 'You have no upcoming exams scheduled.'
                  : 'You have no completed exams yet.'}
            </p>
          </div>
        )}
      </div>
    </StudentPortalLayout>
  );
};

export default StudentExamsPage;
