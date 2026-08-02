import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import ResultDetailHeader from '../components/student/results/ResultDetailHeader';
import SessionTimeline from '../components/student/results/SessionTimeline';
import ScoreBreakdownCard from '../components/student/results/ScoreBreakdownCard';
import SessionFeedbackCard from '../components/student/results/SessionFeedbackCard';
import Icon from '../components/student/Icon';
import { fetchResultDetail } from '../services/studentResultsService';
import type { StudentResultDetailResponse } from '../types/studentResults';

const StudentResultDetailPage = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const id = Number(resultId);
  const [detail, setDetail] = useState<StudentResultDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchResultDetail(id)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    document.title = detail
      ? `${detail.courseName} — Result — Observerr`
      : 'Result Not Found — Observerr';
  }, [detail]);

  const handleDownload = useCallback(() => {
    if (!detail) return;
    const lines = [
      `${detail.assessmentType} — ${detail.courseCode}`,
      detail.completedLabel,
      `Academic score: ${detail.score ?? 'Pending'} / ${detail.maxScore}`,
      `Integrity score: ${detail.integrityScore}%`,
      '',
      ...detail.timeline.map((item) => `${item.title}: ${item.description}`),
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `observerr-result-${detail.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [detail]);

  if (loading) {
    return (
      <StudentPortalLayout contentClassName="student-results-bg">
        <div className="py-24 text-center text-student-on-surface-variant">Loading result…</div>
      </StudentPortalLayout>
    );
  }

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

  const displayTitle = detail.courseName;

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
            <div className="student-exam-glass-card rounded-[24px] p-6">
              <p className="text-student-label-md uppercase tracking-wide text-student-on-surface-variant">Academic grade</p>
              <p className="mt-2 text-student-headline-md font-bold text-student-on-surface">
                {detail.score === null ? 'Pending' : `${detail.score} / ${detail.maxScore}`}
              </p>
            </div>
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
