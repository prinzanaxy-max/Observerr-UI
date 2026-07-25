import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../student/Icon';
import type { LecturerStudentItem } from '../../types/lecturerStudents';
import {
  formatRiskLabel,
  integrityScoreClass,
  riskBadgeClass,
} from '../../lib/lecturerStudentsUtils';

type StudentsTableProps = {
  students: LecturerStudentItem[];
  page: number;
  totalPages: number;
  from: number;
  to: number;
  totalElements: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
};

const TableSkeleton = () => (
  <tbody className="animate-pulse divide-y divide-student-surface-variant">
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i}>
        <td colSpan={7} className="py-4 px-4">
          <div className="h-12 bg-student-surface-container-high rounded-lg" />
        </td>
      </tr>
    ))}
  </tbody>
);

const StudentsTable = memo(({
  students,
  page,
  totalPages,
  from,
  to,
  totalElements,
  loading = false,
  onPageChange,
}: StudentsTableProps) => {
  const navigate = useNavigate();
  const safeTotalPages = Math.max(1, totalPages);

  const goToSession = (sessionId: number | null) => {
    if (sessionId != null) {
      navigate(`/lecturer/students/sessions/${sessionId}`);
    }
  };

  return (
    <div className="student-glass-card rounded-[24px] p-4 sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left border-collapse">
          <thead>
            <tr className="border-b border-student-surface-variant">
              {['Student', 'Course', 'Exams Taken', 'Avg Integrity Score', 'Risk Level', 'Last Active', ''].map((col) => (
                <th
                  key={col || 'action'}
                  className={`py-4 px-4 text-student-label-md font-student text-student-outline uppercase tracking-wider font-medium ${
                    col === 'Avg Integrity Score' || col === 'Risk Level' ? 'text-center' : col === '' ? 'text-right' : ''
                  }`}
                >
                  {col === 'Student' ? (
                    <span className="inline-flex items-center gap-1">
                      Student <Icon name="arrow_downward" className="text-[16px]" />
                    </span>
                  ) : col}
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <TableSkeleton />
          ) : (
            <tbody className="divide-y divide-student-surface-variant">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={`hover:bg-student-surface-container-low transition-colors group ${
                    student.latestSessionId != null ? 'cursor-pointer' : 'cursor-default opacity-80'
                  }`}
                  onClick={() => goToSession(student.latestSessionId)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container font-bold text-sm">
                        {student.initials}
                      </div>
                      <div>
                        <div className="text-student-body-lg font-student font-semibold text-student-on-surface">{student.fullName}</div>
                        <div className="text-student-body-md font-student text-student-on-surface-variant">ID: {student.studentNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-student-body-md font-student text-student-on-surface">{student.courseLabel}</td>
                  <td className="py-4 px-4 text-student-body-md font-student text-student-on-surface">{student.examsTaken}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-student-headline-sm font-student font-bold ${integrityScoreClass(student.avgIntegrityScore)}`}>
                      {student.avgIntegrityScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskBadgeClass[student.riskLevel]}`}>
                      {formatRiskLabel(student.riskLevel)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-student-body-md font-student text-student-on-surface-variant">{student.lastActive}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSession(student.latestSessionId);
                      }}
                      disabled={student.latestSessionId == null}
                      className="text-student-on-surface-variant hover:text-student-primary transition-colors opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-student-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`View ${student.fullName} session`}
                    >
                      <Icon name="chevron_right" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {!loading && students.length === 0 && (
        <p className="py-12 text-center text-student-on-surface-variant font-student">No students match your filters.</p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-student-surface-variant">
        <span className="text-student-body-md font-student text-student-on-surface-variant">
          Showing {totalElements === 0 ? 0 : from} to {to} of {totalElements} students
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border border-student-outline-variant rounded-md text-student-on-surface-variant hover:bg-student-surface-container-high transition-colors font-student text-student-body-md disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(safeTotalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={loading}
              className={`px-3 py-1 rounded-md font-student text-student-body-md ${
                p === page
                  ? 'bg-student-primary-container text-student-on-primary-container font-medium'
                  : 'border border-student-outline-variant text-student-on-surface-variant hover:bg-student-surface-container-high'
              }`}
            >
              {p}
            </button>
          ))}
          {safeTotalPages > 5 && <span className="px-2 py-1 text-student-on-surface-variant">...</span>}
          <button
            type="button"
            disabled={page >= safeTotalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border border-student-outline-variant rounded-md text-student-on-surface-variant hover:bg-student-surface-container-high transition-colors font-student text-student-body-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

StudentsTable.displayName = 'StudentsTable';

export default StudentsTable;
