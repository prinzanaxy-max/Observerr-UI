import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import Icon from '../components/student/Icon';
import { useAuthProfile } from '../hooks/useAuthProfile';
import {
  fetchLecturerExamResults,
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
        <h1 className="text-student-headline-md font-bold">Exam Results</h1>
        <p className="text-student-on-surface-variant mb-6">Review automatically graded submissions and control student visibility.</p>
        {error && <p role="alert" className="mb-4 rounded-xl bg-student-error-container p-3 text-student-on-error-container">{error}</p>}
        {loading ? (
          <p>Loading results…</p>
        ) : !data.length ? (
          <div className="rounded-2xl bg-student-surface p-10 text-center">No submissions yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-student-surface lecturer-card-elevation">
            <table className="w-full min-w-[760px]">
              <thead><tr className="border-b text-left">
                {['Student', 'Submitted', 'Integrity', 'Score', 'Status', 'Actions'].map((label) => <th key={label} className="p-4">{label}</th>)}
              </tr></thead>
              <tbody>{data.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="p-4 font-semibold">{row.studentName}</td>
                  <td className="p-4">{new Date(row.submittedAt).toLocaleString()}</td>
                  <td className="p-4">{row.integrityScore}% integrity</td>
                  <td className="p-4">{row.academicScore} / {row.maxScore} ({Math.round(row.percentage)}%)</td>
                  <td className="p-4">{row.status}</td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      disabled={saving === row.id}
                      onClick={() => void setReleased(row.id, row.status !== 'RELEASED')}
                      className="rounded-full bg-student-primary text-student-on-primary px-4 py-2 font-semibold disabled:opacity-60"
                    >
                      {row.status === 'RELEASED' ? 'Withhold' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </LecturerPortalLayout>
  );
}
