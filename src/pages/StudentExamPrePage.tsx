import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ExamPreHeader from '../components/student/exam/ExamPreHeader';
import ExamDetailsCard from '../components/student/exam/ExamDetailsCard';
import MonitoringNotice from '../components/student/exam/MonitoringNotice';
import BeforeYouBegin from '../components/student/exam/BeforeYouBegin';
import ExamPreActionBar from '../components/student/exam/ExamPreActionBar';
import { getStudentExamDetail } from '../data/studentExamSessionData';

const StudentExamPrePage = () => {
  const { examId } = useParams<{ examId: string }>();
  const id = Number(examId);
  const exam = Number.isNaN(id) ? undefined : getStudentExamDetail(id);

  useEffect(() => {
    if (exam) {
      document.title = `${exam.title} — Observerr`;
    }
  }, [exam]);

  if (!exam) {
    return <Navigate to="/student/exams" replace />;
  }

  return (
    <div className="student-exam-pre h-dvh flex flex-col font-student text-student-on-surface antialiased">
      <ExamPreHeader title={exam.title} />

      <main className="flex-1 overflow-y-auto pt-8 pb-32 px-4 sm:px-6 student-hide-scrollbar">
        <div className="w-full max-w-[600px] mx-auto flex flex-col gap-6">
          <ExamDetailsCard exam={exam} />
          <MonitoringNotice />
          <BeforeYouBegin instructions={exam.instructions} />
        </div>
      </main>

      <ExamPreActionBar
        examId={exam.id}
        availability={exam.availability}
        availableAtLabel={exam.availableAtLabel}
        beginLabel={exam.beginLabel}
      />
    </div>
  );
};

export default StudentExamPrePage;
