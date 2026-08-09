import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import Icon from '../components/student/Icon';
import { useAuthProfile } from '../hooks/useAuthProfile';
import {
  fetchLecturerExamResults,
  setAllLecturerResultsReleased,
  setLecturerResultReleased,
} from '../services/lecturerExamsService';
import type { LecturerExamResultsResponse } from '../types/lecturerExams';

export default function LecturerExamResultsPage() {
  const { examId } = useParams<{ examId: string }>();
  const id = Number(examId);
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();
  const [data, setData] = useState<LecturerExamResultsResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<number | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchLecturerExamResults(id);
      setData(response);
    } catch {
      setError('Could not load exam results.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    document.title = 'Exam Results — Observerr Lecturer';
    if (Number.isFinite(id)) void load();
  }, [id, load]);

  const pendingCount = useMemo(
    () => data.filter((row) => row.status !== 'RELEASED').length,
    [data],
  );
  const releasedCount = data.length - pendingCount;

  const setReleased = async (resultId: number, released: boolean) => {
    setSaving(resultId);
    setError('');
    try {
      await setLecturerResultReleased(id, resultId, released);
      await load();
    } catch {
      setError(`Could not ${released ? 'publish' : 'withhold'} this result.`);
    } finally {
      setSaving(null);
    }
  };

  const publishAll = async () => {
    if (bulkSaving || pendingCount === 0) return;
    setBulkSaving(true);
    setError('');
    try {
      await setAllLecturerResultsReleased(id, true);
      await load();
    } catch {
      setError('Could not publish all results to students.');
    } finally {
      setBulkSaving(false);
    }
  };

  if (!Number.isFinite(id)) return <Navigate to="/lecturer/exams" replace />;

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate('/lecturer/exams/new')}
    >
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <Link to="/lecturer/exams" className="inline-flex items-center gap-2 text-student-primary mb-5">
          <Icon name="arrow_back" /> Exams
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-student-headline-md font-bold">Exam Results</h1>
            <p className="text-student-on-surface-variant mt-1 max-w-2xl">
              Students only see scores in their Results page after you publish them here.
              Submissions stay hidden (PENDING) until published (RELEASED).
            </p>
          </div>
          {pendingCount > 0 && (
            <button
              type="button"
              disabled={bulkSaving}
              onClick={() => void publishAll()}
              className="shrink-0 rounded-full bg-student-primary text-student-on-primary px-5 py-2.5 font-semibold disabled:opacity-60"
            >
              {bulkSaving ? 'Publishing…' : `Publish all to students (${pendingCount})`}
            </button>
          )}
        </div>

        {!loading && data.length > 0 && (
          <p className="text-student-body-md text-student-on-surface-variant mb-6">
            {releasedCount} published · {pendingCount} waiting to publish
          </p>
        )}

        {error && (
          <p role="alert" className="mb-4 rounded-xl bg-student-error-container p-3 text-student-on-error-container">
            {error}
          </p>
        )}
        {loading ? (
          <p>Loading results…</p>
        ) : !data.length ? (
          <div className="rounded-2xl bg-student-surface p-10 text-center space-y-2">
            <p className="font-semibold text-student-on-surface">No submissions yet.</p>
            <p className="text-student-on-surface-variant text-student-body-md">
              Results appear after students submit, or after you end a live exam (in-progress attempts are graded automatically).
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-student-surface lecturer-card-elevation">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b text-left">
                  {['Student', 'Submitted', 'Integrity', 'Score', 'Status', 'Actions'].map((label) => (
                    <th key={label} className="p-4">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="p-4 font-semibold">{row.studentName}</td>
                    <td className="p-4">{new Date(row.submittedAt).toLocaleString()}</td>
                    <td className="p-4">{row.integrityScore}% integrity</td>
                    <td className="p-4">
                      {row.academicScore} / {row.maxScore} ({Math.round(row.percentage)}%)
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-student-label-md font-semibold ${
                          row.status === 'RELEASED'
                            ? 'bg-student-primary-container text-student-on-primary-container'
                            : 'bg-student-surface-container-high text-student-on-surface-variant'
                        }`}
                      >
                        {row.status === 'RELEASED' ? 'Visible to student' : 'Hidden (PENDING)'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={saving === row.id}
                        onClick={() => void setReleased(row.id, row.status !== 'RELEASED')}
                        className="rounded-full bg-student-primary text-student-on-primary px-4 py-2 font-semibold disabled:opacity-60"
                      >
                        {row.status === 'RELEASED' ? 'Withhold' : 'Publish to student'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LecturerPortalLayout>
  );
}
