import { useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ResultDetailHeader from '../components/student/results/ResultDetailHeader';
import SessionTimeline from '../components/student/results/SessionTimeline';
import ScoreBreakdownCard from '../components/student/results/ScoreBreakdownCard';
import SessionFeedbackCard from '../components/student/results/SessionFeedbackCard';
import Icon from '../components/student/Icon';
import { getStudentResultDetail } from '../data/studentResultDetailData';

const StudentResultDetailPage = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const id = Number(resultId);
  const detail = Number.isFinite(id) ? getStudentResultDetail(id) : undefined;

  useEffect(() => {
    document.title = detail
      ? `${detail.courseName} — Result — Observerr`
      : 'Result Not Found — Observerr';
  }, [detail]);

  const handleDownload = useCallback(() => {
    window.alert('Report download will be available once connected to the backend.');
  }, []);

  if (!detail) {
    return (
      <StudentPortalLayout contentClassName="student-results-bg">
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <Icon name="search_off" className="text-[48px] text-student-outline mb-4 mx-auto" />
          <h1 className="text-student-headline-sm font-student text-student-on-surface mb-2">Result not found</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
            This result may have been removed or the link is invalid.
          </p>
          <Link
            to="/student/results"
            className="inline-flex items-center gap-2 text-student-primary font-student font-medium hover:underline"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            Back to Results
          </Link>
        </div>
      </StudentPortalLayout>
    );
  }

  const displayTitle = detail.examLabel
    ? `${detail.courseName.replace(/ & Algorithms$/, '')}`
    : detail.courseName;

  return (
    <StudentPortalLayout
      contentClassName="student-results-bg"
      header={
        <ResultDetailHeader
          title={displayTitle}
          completedLabel={detail.completedLabel}
          integrityScore={detail.integrityScore}
        />
      }
    >
      <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1400px] mx-auto w-full pb-24 md:pb-8">
        <Link
          to="/student/results"
          className="hidden md:inline-flex items-center gap-1 text-student-body-md font-student text-student-on-surface-variant hover:text-student-primary transition-colors mb-6"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Back to Results
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <SessionTimeline events={detail.timeline} />

          <aside className="w-full md:w-[340px] flex flex-col gap-6 md:sticky md:top-24 shrink-0">
            <ScoreBreakdownCard
              baseScore={detail.baseScore}
              deductions={detail.deductions}
              finalScore={detail.finalScore}
              deductionNote={detail.deductionNote}
              onDownload={handleDownload}
            />
            <SessionFeedbackCard title={detail.feedbackTitle} message={detail.feedbackMessage} />
          </aside>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default StudentResultDetailPage;
