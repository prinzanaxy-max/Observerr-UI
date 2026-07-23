import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../student/Icon';
import type { StudentRosterEntry } from '../../data/lecturerStudentsData';
import { integrityScoreClass, riskBadgeClass } from '../../data/lecturerStudentsData';

type StudentsTableProps = {
  students: StudentRosterEntry[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const StudentsTable = memo(({ students, page, pageSize, total, onPageChange }: StudentsTableProps) => {
  const navigate = useNavigate();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

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
          <tbody className="divide-y divide-student-surface-variant">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-student-surface-container-low transition-colors group cursor-pointer"
                onClick={() => navigate(`/lecturer/students/${student.id}/timeline`)}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full shrink-0 bg-student-primary-container flex items-center justify-center text-student-on-primary-container font-bold text-sm">
                      {student.initials ?? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-student-body-lg font-student font-semibold text-student-on-surface">{student.name}</div>
                      <div className="text-student-body-md font-student text-student-on-surface-variant">ID: {student.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-student-body-md font-student text-student-on-surface">{student.course}</td>
                <td className="py-4 px-4 text-student-body-md font-student text-student-on-surface">{student.examsTaken}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`text-student-headline-sm font-student font-bold ${integrityScoreClass(student.avgIntegrity)}`}>
                    {student.avgIntegrity}%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${riskBadgeClass[student.risk]}`}>
                    {student.risk}
                  </span>
                </td>
                <td className="py-4 px-4 text-student-body-md font-student text-student-on-surface-variant">{student.lastActive}</td>
                <td className="py-4 px-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lecturer/students/${student.id}/timeline`);
                    }}
                    className="text-student-on-surface-variant hover:text-student-primary transition-colors opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-student-surface-container-high"
                    aria-label={`View ${student.name} timeline`}
                  >
                    <Icon name="chevron_right" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <p className="py-12 text-center text-student-on-surface-variant font-student">No students match your filters.</p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-student-surface-variant">
        <span className="text-student-body-md font-student text-student-on-surface-variant">
          Showing {total === 0 ? 0 : start} to {end} of {total} students
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border border-student-outline-variant rounded-md text-student-on-surface-variant hover:bg-student-surface-container-high transition-colors font-student text-student-body-md disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded-md font-student text-student-body-md ${
                p === page
                  ? 'bg-student-primary-container text-student-on-primary-container font-medium'
                  : 'border border-student-outline-variant text-student-on-surface-variant hover:bg-student-surface-container-high'
              }`}
            >
              {p}
            </button>
          ))}
          {totalPages > 3 && <span className="px-2 py-1 text-student-on-surface-variant">...</span>}
          <button
            type="button"
            disabled={page >= totalPages}
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
