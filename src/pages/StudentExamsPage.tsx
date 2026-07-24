import { useCallback, useEffect, useMemo, useState } from 'react';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ExamsTabControl from '../components/student/ExamsTabControl';
import StudentExamCard from '../components/student/StudentExamCard';
import Icon from '../components/student/Icon';
import {
  ALL_STUDENT_EXAMS,
  type ExamListTab,
  type StudentExam,
} from '../data/studentExamsData';

const StudentExamsPage = () => {
  const [activeTab, setActiveTab] = useState<ExamListTab>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Exams — Observerr';
  }, []);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_STUDENT_EXAMS.filter((exam) => {
      if (exam.tab !== activeTab) return false;
      if (!q) return true;
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.professor.toLowerCase().includes(q) ||
        exam.date.toLowerCase().includes(q)
      );
    });
  }, [activeTab, searchQuery]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleTabChange = useCallback((tab: ExamListTab) => setActiveTab(tab), []);
  const handleExamAction = useCallback((_exam: StudentExam) => {
    // Waiting room / guidelines / results will connect to API routes later
  }, []);

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

        {filteredExams.length > 0 ? (
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
